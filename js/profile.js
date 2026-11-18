import { getCurrentUser, updateUserProfile, logoutUser } from './auth.js';
import { showNotification } from './notification.js';

const DEFAULT_AVATAR = './files/anhbia.png';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const profileBtn = document.getElementById('fab-profile');
  const profileMenu = document.getElementById('profile-menu');
  // Menu elements
  const menuUsername = document.getElementById('profile-menu-username');
  const menuEmail = document.getElementById('profile-menu-email');
  const viewProfileBtn = document.getElementById('profile-menu-view');
  const editProfileBtn = document.getElementById('profile-menu-edit');
  const logoutBtn = document.getElementById('profile-menu-logout');

  // Modal elements
  const profileModal = document.getElementById('profile-modal-overlay');
  const closeModalBtn = document.getElementById('profile-modal-close');
  const modalTitle = document.getElementById('profile-modal-title');
  const viewContainer = document.getElementById('profile-view-container');

  // --- STATE ---
  let isMenuOpen = false;
  let isModalOpen = false;

  // --- FUNCTIONS ---

  function toggleMenu(show) {
    // Nếu không có tham số `show` (boolean), tự động đảo ngược trạng thái hiện tại.
    isMenuOpen = typeof show === 'boolean' ? show : !isMenuOpen;

    if (profileMenu) {
      // Khi mở menu, đảm bảo panel thông báo đã đóng
      if (isMenuOpen) {
        // Tác vụ 1: Hiển thị menu NGAY LẬP TỨC
        document.getElementById('notifications-panel')?.classList.remove('visible');
        profileMenu.classList.add('visible');

        // Tác vụ 2: Cập nhật dữ liệu sau khi UI đã phản hồi (dùng setTimeout 0)
        // Kỹ thuật này đưa tác vụ vào cuối hàng đợi, tránh chặn render.
        setTimeout(() => populateProfileData(getCurrentUser()), 0);
      } else {
        profileMenu.classList.remove('visible');
      }
    }
  }

  window.toggleProfileMenu = toggleMenu; // Expose to window for floating-actions.js

  function toggleModal(show, mode = 'view') {
    const user = getCurrentUser();
    isModalOpen = typeof show === 'boolean' ? show : !isModalOpen;
    profileModal.classList.toggle('visible', isModalOpen);

    if (isModalOpen && user) {
      setTimeout(() => populateProfileData(user), 0);
    }
  }

  function populateProfileData(user) {
    if (!user) return;

    // Populate Menu
    menuUsername.textContent = user.name || 'User';
    menuEmail.textContent = user.email;

    // Populate View Modal
    document.getElementById('profile-view-avatar').src = DEFAULT_AVATAR;
    document.getElementById('profile-view-name').textContent = user.name;
    document.getElementById('profile-view-username').textContent = user.username;
    document.getElementById('profile-view-email').textContent = user.email;
    document.getElementById('profile-view-joined').textContent = new Date(user.joinDate).toLocaleDateString('vi-VN');
  }

  // --- INITIAL SETUP ---
  // Ẩn mục "Chỉnh sửa hồ sơ" khỏi menu
  if (editProfileBtn && editProfileBtn.parentElement) {
    editProfileBtn.parentElement.style.display = 'none';
  }

  // --- EVENT LISTENERS ---

  if (viewProfileBtn) {
    viewProfileBtn.addEventListener('click', () => {
      toggleMenu(false); // Close menu
      toggleModal(true, 'view'); // Open view modal
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser(); // Perform logout
      window.location.reload();
      toggleMenu(false);
      // Cập nhật lại giao diện nút profile và các thành phần khác
      if (window.updateProfileButton) {
        window.updateProfileButton();
      }
    });
  }

  // Close menu when clicking outside
  window.addEventListener('click', (e) => {
    // Thêm kiểm tra null để tránh lỗi nếu các element không tồn tại
    if (isMenuOpen && profileMenu && !profileMenu.contains(e.target) && profileBtn && !profileBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => toggleModal(false));
  }
  if (profileModal) {
    profileModal.addEventListener('click', (e) => e.target === profileModal && toggleModal(false));
  }

  // Initial state check
  if (window.updateProfileButton) {
    window.updateProfileButton();
  }
});
