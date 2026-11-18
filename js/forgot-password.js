import { showNotification } from './notification.js';
import { checkUserExists, resetPassword } from './auth.js';
import { createPasswordResetNotification } from './notifications.js';

document.addEventListener('DOMContentLoaded', function() {
  // --- DOM ELEMENTS ---
  const emailView = document.getElementById('email-view');
  const otpView = document.getElementById('otp-view');
  const passwordView = document.getElementById('password-view');

  const emailForm = document.getElementById('email-form');
  const otpForm = document.getElementById('otp-form');
  const passwordForm = document.getElementById('password-form');

  const emailInput = document.getElementById('email-input');
  const userEmailDisplay = document.getElementById('user-email-display');
  const otpInput = document.getElementById('verify-code-input');
  const newPasswordInput = document.getElementById('password-input');
  const confirmPasswordInput = document.getElementById('confirm-password-input');

  const resendBtn = document.getElementById('resend-code-btn');
  const timerDisplay = document.getElementById('resend-timer');

  const togglePasswordBtn = document.getElementById('toggle-password');
  const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

  const backFromOtpBtn = document.getElementById('back-from-otp');
  const backFromPasswordBtn = document.getElementById('back-from-password');

  // --- STATE ---
  const OTP_STORAGE_KEY = 'password_reset_otp';
  let countdown;

  // --- EMAILJS CONFIGURATION ---
  // ⚠️ BẢO MẬT: Các khóa này nên được lưu ở backend. Việc để ở frontend chỉ phù hợp cho demo.
  // BẠN CẦN THAY THẾ CÁC GIÁ TRỊ NÀY VÀ TẠO TEMPLATE MỚI TRÊN EMAILJS
  const EMAILJS_SERVICE_ID = 'service_a8zym1c';
  const EMAILJS_TEMPLATE_ID = 'template_bmvdk7q'; // <-- TẠO TEMPLATE MỚI VÀ THAY ID VÀO ĐÂY
  const EMAILJS_PUBLIC_KEY = 'jJdb-zEIN9rQr63mU';

  emailjs.init(EMAILJS_PUBLIC_KEY);

  // --- FUNCTIONS ---

  /**
   * Switches between views.
   * @param {string} viewToShow - 'email', 'otp', or 'password'.
   */
  function switchView(viewToShow) {
    emailView.style.display = 'none';
    otpView.style.display = 'none';
    passwordView.style.display = 'none';

    if (viewToShow === 'otp') otpView.style.display = 'block';
    else if (viewToShow === 'password') passwordView.style.display = 'block';
    else emailView.style.display = 'block';
  }

  /**
   * Toggles the visibility of a password input field.
   * @param {HTMLInputElement} input
   * @param {HTMLButtonElement} button
   */
  function togglePasswordVisibility(input, button) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.classList.toggle('visible', isPassword);
    button.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
  }

  /**
   * Sends the verification email using EmailJS.
   * @param {string} email - The recipient's email.
   * @param {string} otp - The one-time password.
   */
  function sendResetEmail(email, otp) {
    return new Promise((resolve, reject) => {
      const submitBtn = emailForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          email: email,
          passcode: otp,
        })
        .then((response) => {
          console.log('EmailJS Success:', response.status, response.text);
          // On success, resolve the promise
          resolve();
        }, (error) => {
          console.error('EmailJS Error:', error);
          // On failure, show notification and reject the promise
          showNotification({
            type: 'error',
            title: 'Gửi thất bại',
            message: 'Không thể gửi mã xác nhận. Vui lòng thử lại sau.'
          });
          reject(error);
        }).finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Gửi mã xác nhận';
        });
    });
  }

  function startResendTimer() {
    let timeLeft = 120; // 2 minutes
    resendBtn.disabled = true;
    timerDisplay.style.display = 'inline';

    const updateTimer = () => {
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      timerDisplay.textContent = `${minutes}:${seconds}`;
    };

    updateTimer();
    countdown = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        clearInterval(countdown);
        resendBtn.disabled = false;
        timerDisplay.style.display = 'none';
      }
    }, 1000);
  }

  // --- EVENT HANDLERS ---

  // Step 1: Email Form Submission
  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!checkUserExists(email)) {
      showNotification({ type: 'error', title: 'Lỗi', message: 'Email này chưa được đăng ký.' });
      return;
    }

    userEmailDisplay.textContent = email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = { email, code: otp, expires: Date.now() + 2 * 60 * 1000 };
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));

    sendResetEmail(email, otp).then(() => {
      // This block now only runs on successful email send
      showNotification({
        type: 'success',
        title: 'Đã gửi mã',
        message: `Mã xác nhận đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư của bạn.`
      });
      switchView('otp');
      startResendTimer();
    }).catch(() => {
      // Error is already handled inside sendResetEmail, so we just need to catch the rejection
      // to prevent an "Uncaught (in promise)" error in the console.
    });
  });

  // Resend Code Button
  resendBtn.addEventListener('click', () => {
    if (resendBtn.disabled) return;
    const email = userEmailDisplay.textContent;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = { email, code: otp, expires: Date.now() + 2 * 60 * 1000 };
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
    
    // We don't need to re-wrap the logic here as the resend button is simpler
    // and the user is already on the OTP screen. The internal notification is sufficient.
    sendResetEmail(email, otp).then(() => {
      startResendTimer();
    }).catch(() => {
      // Catch error to prevent console noise
    });
  });

  // Step 2: OTP Form Submission
  otpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = otpInput.value.trim();
    const storedOtpData = JSON.parse(sessionStorage.getItem(OTP_STORAGE_KEY));

    if (!storedOtpData) {
      showNotification({ type: 'error', title: 'Lỗi', message: 'Phiên đã hết hạn, vui lòng thử lại.' });
      switchView('email');
      return;
    }

    if (Date.now() > storedOtpData.expires) {
      showNotification({ type: 'error', title: 'Hết hạn', message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' });
      return;
    }

    if (code !== storedOtpData.code) {
      showNotification({ type: 'error', title: 'Sai mã', message: 'Mã xác nhận không chính xác.' });
      return;
    }

    // OTP is correct
    clearInterval(countdown);
    switchView('password');
  });

  // Step 3: New Password Form Submission
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const storedOtpData = JSON.parse(sessionStorage.getItem(OTP_STORAGE_KEY));

    if (!storedOtpData || !storedOtpData.email) {
      showNotification({ type: 'error', title: 'Lỗi', message: 'Phiên không hợp lệ. Vui lòng bắt đầu lại.' });
      switchView('email');
      return;
    }

    if (newPassword.length < 6) {
      showNotification({ type: 'error', title: 'Mật khẩu yếu', message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification({ type: 'error', title: 'Lỗi', message: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    // All checks passed, reset the password
    resetPassword(storedOtpData.email, newPassword);
    createPasswordResetNotification(storedOtpData.email); // Create notification
    sessionStorage.removeItem(OTP_STORAGE_KEY); // Clean up

    showNotification({
      type: 'success',
      title: 'Thành công',
      message: 'Mật khẩu của bạn đã được đặt lại. Đang chuyển đến trang đăng nhập.',
      onConfirm: () => {
        window.location.href = './login.html';
      }
    });
  });

  // --- Back Button Handlers ---
  backFromOtpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('email');
  });

  backFromPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('otp');
  });

  // --- Password Toggle Handlers ---
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      togglePasswordVisibility(newPasswordInput, togglePasswordBtn);
    });
  }
  if (toggleConfirmPasswordBtn) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
    });
  }
});