import { getCurrentUser, logoutUser } from './auth.js';
import { renderNotifications } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const fabContainer = document.getElementById('floating-actions-container');
  const notificationBtn = document.getElementById('fab-notification');
  const profileBtn = document.getElementById('fab-profile');

  const notificationsPanel = document.getElementById('notifications-panel');
  const profileChoiceModal = document.getElementById('profile-choice-modal');

  if (!fabContainer) return;

  // --- STATE ---
  const originalProfileBtnContent = profileBtn ? profileBtn.innerHTML : '';

  /**
   * Updates the profile button to show an avatar if logged in, or the default icon if not.
   */
  function updateProfileButton() {
    if (!profileBtn) return;
    const user = getCurrentUser();
    const DEFAULT_AVATAR = './files/anhbia.png';
    const currentAvatarImg = profileBtn.querySelector('.profile-avatar-img');

    if (user) { // Chỉ cần kiểm tra user có đăng nhập không
      if (currentAvatarImg) {
        // If avatar img already exists, just update its src if different
        if (currentAvatarImg.src !== DEFAULT_AVATAR) {
          currentAvatarImg.src = DEFAULT_AVATAR;
          currentAvatarImg.onerror = () => { currentAvatarImg.src = './files/avatar-placeholder.png'; }; // Fallback
        }
      } else {
        // If not, create and set new avatar img
        const img = document.createElement('img');
        img.src = DEFAULT_AVATAR;
        img.alt = "User Avatar";
        img.className = 'profile-avatar-img';
        img.onerror = () => { profileBtn.innerHTML = originalProfileBtnContent; }; // Fallback on initial load error
        profileBtn.innerHTML = ''; // Clear icon
        profileBtn.appendChild(img);
      }
      profileBtn.classList.add('fab-profile-avatar');
      profileBtn.setAttribute('aria-label', 'Tài khoản của bạn');
    } else {
      if (profileBtn.innerHTML !== originalProfileBtnContent) { // Only change if not already the default
        profileBtn.innerHTML = originalProfileBtnContent;
        profileBtn.classList.remove('fab-profile-avatar');
        profileBtn.setAttribute('aria-label', 'Tài khoản');
      }
    }
  }

  // Expose the function to the window so other scripts (like profile.js) can call it
  window.updateProfileButton = updateProfileButton;

  // --- FUNCTIONS ---

  let isNotificationsPanelOpen = false;

  /**
   * Checks if the user is logged in by looking for a global state.
   * This is a simple check; a real app might use a more robust method.
   * @returns {boolean}
   */
  function isUserLoggedIn() {
    return !!getCurrentUser(); // Use the getCurrentUser function from auth.js
  }

  /**
   * Toggles the visibility of the notifications panel.
   * @param {boolean} show - True to show, false to hide.
   */
  function toggleNotificationsPanel(show) {
    if (!notificationsPanel) return;
    isNotificationsPanelOpen = show;
    notificationsPanel.classList.toggle('visible', show);
    if (show) {
      renderNotifications(); // Render content when opening
    }
  }

  // --- PROFILE MODAL LOGIC (INDEPENDENT) ---
  function openProfileChoiceModal() {
    if (!profileChoiceModal) return;
    profileChoiceModal.classList.add('visible');
  }

  function closeProfileChoiceModal() {
    if (!profileChoiceModal) return;
    profileChoiceModal.classList.remove('visible');
  }

  // --- EVENT LISTENERS ---
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      // Luôn mở panel thông báo, logic hiển thị bên trong sẽ tự xử lý theo trạng thái đăng nhập
      window.toggleProfileMenu && window.toggleProfileMenu(false); // Đóng menu profile nếu đang mở
      toggleNotificationsPanel(!isNotificationsPanelOpen); // Mở/đóng panel thông báo
    });
  }
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      if (isUserLoggedIn()) {
        // Khi đã đăng nhập, gọi hàm toggleProfileMenu được cung cấp bởi profile.js
        window.toggleProfileMenu && window.toggleProfileMenu();
      } else {
        // Khi chưa đăng nhập, mở modal lựa chọn
        e.stopPropagation();
        if (profileChoiceModal) {
          openProfileChoiceModal();
        }
      }
    });
  }

  // Close notifications panel when clicking outside
  window.addEventListener('click', (e) => {
    if (isNotificationsPanelOpen && !notificationsPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
      toggleNotificationsPanel(false);
    }
  });

  // KHÔI PHỤC: Gắn lại các trình lắng nghe sự kiện cho modal "Tài khoản"
  if (profileChoiceModal) {
    const closeBtn = document.getElementById('profile-modal-close-btn');
    const loginBtn = document.getElementById('profile-modal-login-btn');
    const registerBtn = document.getElementById('profile-modal-register-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeProfileChoiceModal());
    }
    profileChoiceModal.addEventListener('click', (e) => e.target === profileChoiceModal && closeProfileChoiceModal());

    if (loginBtn) {
      loginBtn.addEventListener('click', () => { window.location.href = './login.html'; });
    }
    if (registerBtn) {
      registerBtn.addEventListener('click', () => { window.location.href = './register.html'; });
    }
  }

  // --- INITIALIZATION ---
  updateProfileButton(); // Set initial button state (icon or avatar)
});