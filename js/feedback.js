import { getCurrentUser } from './auth.js';
// Initialize EmailJS with your Public Key
emailjs.init('jJdb-zEIN9rQr63mU');
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const reviewTrigger = document.getElementById('review-trigger');
  const thankYouMessage = document.getElementById('thank-you-message');

  // Review Modal
  const reviewModal = document.getElementById('review-modal-overlay');
  const closeReviewModalBtn = document.getElementById('review-modal-close');
  let starContainer, stars, feedbackTextarea, charCounter, submitBtn;

  // Auth Modal
  const authModal = document.getElementById('auth-modal-overlay');
  const profileChoiceModal = document.getElementById('profile-choice-modal');
  const closeAuthModalBtn = document.getElementById('auth-modal-close');
  const authModalLoginBtn = document.getElementById('auth-modal-login-btn');
  const authModalRegisterBtn = document.getElementById('auth-modal-register-btn');

  // Validation Alert Modal
  const validationModal = document.getElementById('validation-alert-modal');
  const validationMessageEl = document.getElementById('validation-alert-message');
  const closeValidationBtn = document.getElementById('validation-alert-close-btn');

  // Toast Notification
  const toast = document.getElementById('feedback-toast');

  // --- STATE ---
  let selectedRating = 0;
  let isSubmitting = false;
  const FEEDBACK_SUBMITTED_KEY = 'tvp_feedback_submitted_';

  // --- FUNCTIONS ---
  /**
   * Toggles the visibility of a modal.
   * @param {HTMLElement} modal - The modal element to toggle.
   * @param {boolean} show - True to show, false to hide.
   */
  function toggleModal(modal, show) {
    if (!modal) return;
    if (show) {
      modal.classList.add('visible');
      // Initialize modal-specific elements only when the review modal is shown
      if (modal === reviewModal) {
        starContainer = document.getElementById('star-rating-container');
        stars = starContainer ? Array.from(starContainer.querySelectorAll('.star')) : [];
        feedbackTextarea = document.getElementById('feedback-textarea');
        charCounter = document.getElementById('char-counter');
        submitBtn = document.getElementById('submit-feedback-btn');
        initializeReviewModalListeners();
      }
    } else {
      modal.classList.remove('visible');
    }
  }

  /**
   * Shows a toast notification.
   */
  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /**
   * Shows a custom validation error modal.
   * @param {string} message - The error message to display.
   */
  function showValidationError(message) {
    if (validationModal && validationMessageEl) {
      validationMessageEl.textContent = message;
      toggleModal(validationModal, true);
    }
  }

  /**
   * Checks if the user is authenticated. If not, shows the auth modal.
   * @returns {boolean} True if authenticated, false otherwise.
   */
  function requireAuth() {
    // Always call getCurrentUser directly to ensure the latest login state is checked.
    return !!getCurrentUser();
  }

  /**
   * Updates the star display.
   * @param {number} rating The rating value (1-5).
   */
  function updateStars(rating) {
    // Use the modal's stars by default
    if (stars) stars.forEach(star => {
      // If the star's value is less than or equal to the rating, it should be selected.
      if (Number(star.dataset.value) <= rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }

  /**
   * Resets the submission form to its initial state.
   */
  function resetForm() {
    if (feedbackTextarea) feedbackTextarea.value = '';
    if (charCounter) charCounter.textContent = '0/1000';
    selectedRating = 0;
    updateStars(0);
    isSubmitting = false;
    if (submitBtn) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  /**
   * Handles the submission of the feedback.
   */
  async function handleFeedbackSubmit() {
    if (isSubmitting) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showValidationError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    const content = feedbackTextarea.value.trim();

    // Enhanced Validation
    const hasRating = selectedRating > 0;
    const hasContent = content !== '';

    if (!hasRating && !hasContent) {
      showValidationError('Vui lòng chọn số sao và nhập nội dung đánh giá.');
      return;
    } else if (!hasRating) {
      showValidationError('Vui lòng chọn số sao.');
      return;
    } else if (!hasContent) {
      showValidationError('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    isSubmitting = true;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // --- EMAIL SENDING LOGIC ---
    const emailJsConfig = {
      serviceID: 'service_a8zym1c',    // Reused from register.html
      templateID: 'template_xkfjnm5', // NEW: Specific template for feedback
      publicKey: 'jJdb-zEIN9rQr63mU',   // Corrected Public Key
    };

    // The new template 'template_xkfjnm5' expects these specific parameters
    const emailParams = {
      // IMPORTANT: Add the recipient's email here if the template requires it.
      // Replace with your actual recipient email address.
      email: 'your-recipient-email@example.com', 
      from_name: currentUser.name,
      from_email: currentUser.email,
      rating: '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating),
      message: content,
    };

    try {
      await emailjs.send(emailJsConfig.serviceID, emailJsConfig.templateID, emailParams);
      showToast();

      // Mark user as having submitted feedback
      localStorage.setItem(FEEDBACK_SUBMITTED_KEY + currentUser.email, 'true');
      // Hide trigger and show thank you message
      updateFeedbackSectionVisibility();

      resetForm();
    } catch (error) {
      console.error('EmailJS feedback error:', error);
      showValidationError('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      // Reset form state regardless of success or failure
      resetForm();
      toggleModal(reviewModal, false);
    }
  }

  /**
   * Checks if the current user has already submitted feedback and updates the UI.
   */
  function updateFeedbackSectionVisibility() {
    const currentUser = getCurrentUser();
    if (currentUser && localStorage.getItem(FEEDBACK_SUBMITTED_KEY + currentUser.email)) {
      if (reviewTrigger) reviewTrigger.style.display = 'none';
      if (thankYouMessage) thankYouMessage.style.display = 'block';
    } else {
      if (reviewTrigger) reviewTrigger.style.display = 'block';
      if (thankYouMessage) thankYouMessage.style.display = 'none';
    }
  }


  // This function will be called only when the review modal is opened
  function initializeReviewModalListeners() {
    // Star Rating Interaction
    if (starContainer && !starContainer.dataset.initialized) {
      starContainer.dataset.initialized = 'true';
      starContainer.addEventListener('click', (e) => {
        const star = e.target.closest('.star');
        if (star) {
          const newRating = Number(star.dataset.value);
          selectedRating = (newRating === selectedRating) ? 0 : newRating;
          updateStars(selectedRating);
        }
      });
    }

    // Form Submission
    if (submitBtn && !submitBtn.dataset.initialized) {
      submitBtn.dataset.initialized = 'true';
      submitBtn.addEventListener('click', handleFeedbackSubmit);
    }

    // Textarea Interaction
    if (feedbackTextarea && !feedbackTextarea.dataset.initialized) {
      feedbackTextarea.dataset.initialized = 'true';
      feedbackTextarea.addEventListener('input', () => {
        const len = feedbackTextarea.value.length;
        charCounter.textContent = `${len}/1000`;
      });
    }
  }

  // --- INITIAL EVENT LISTENERS ---
  // Check visibility on page load
  updateFeedbackSectionVisibility();

  // Open Modal Trigger
  if (reviewTrigger) {
    reviewTrigger.addEventListener('click', () => {
      if (requireAuth()) {
        toggleModal(reviewModal, true);
      } else if (profileChoiceModal) {
        profileChoiceModal.classList.add('visible');
      } else {
        toggleModal(authModal, true);
      }
    });
  }

  // Modal Closing
  if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', () => toggleModal(reviewModal, false));
  if (reviewModal) reviewModal.addEventListener('click', (e) => e.target === reviewModal && toggleModal(reviewModal, false));

  // Auth Modal Closing & View Reset
  const closeAuthModalAndReset = () => {
    toggleModal(authModal, false);
  };
  if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModalAndReset);
  if (authModal) authModal.addEventListener('click', (e) => e.target === authModal && closeAuthModalAndReset());

  // Validation Modal Closing
  if (closeValidationBtn) closeValidationBtn.addEventListener('click', () => toggleModal(validationModal, false));
  if (validationModal) validationModal.addEventListener('click', (e) => e.target === validationModal && toggleModal(validationModal, false));


  // --- AUTH MODAL REDIRECTION ---
  // Handle "Đăng nhập" button click
  if (authModalLoginBtn) {
    authModalLoginBtn.addEventListener('click', () => {
      window.location.href = './login.html';
    });
  }
  // Handle "Đăng ký" button click
  if (authModalRegisterBtn) {
    authModalRegisterBtn.addEventListener('click', () => {
      window.location.href = './register.html';
    });
  }
});
