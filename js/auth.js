const USERS_STORAGE_KEY = 'tvp_registered_users';
const CURRENT_USER_SESSION_KEY = 'tvp_current_user';
import { showNotification } from './notification.js';
import { createLoginNotification } from './notifications.js';

/**
 * Simulates password hashing. In a real application, use a robust hashing library (e.g., bcrypt on server-side).
 * For a client-side demo, a simple base64 encoding is used.
 * @param {string} password
 * @returns {string} Hashed password (base64 encoded for this demo)
 */
function hashPassword(password) {
  return btoa(password);
}

/**
 * Retrieves all registered users from localStorage.
 * @returns {Object} An object where keys are emails and values are user objects.
 */
function getStoredUsers() {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : {};
}

/**
 * Saves the users object to localStorage.
 * @param {Object} users - The users object to save.
 */
function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Checks if a user exists in the storage.
 * @param {string} email
 * @returns {boolean}
 */
export function checkUserExists(email) {
  const users = getStoredUsers();
  return !!users[email];
}

/**
 * Registers a new user.
 * @param {string} email
 * @param {string} password
 * @param {function} [onConfirm] - Callback to run after user confirms the notification.
 */
export function registerUser(email, password, onConfirm) {
  const users = getStoredUsers();
  if (users[email]) {
    showNotification({
      type: 'error',
      title: 'Đăng ký thất bại',
      message: 'Tài khoản email này đã được sử dụng. Vui lòng chọn email khác.'
    });
    return;
  }

  const passwordHash = hashPassword(password);
  users[email] = {
    email: email,
    passwordHash: passwordHash,
    name: email.split('@')[0], // Default name from email
    username: email.split('@')[0], // Default username
    avatar: './files/anhbia.png', // Hoàn tác về avatar cũ
    joinDate: new Date().toISOString()
  };
  saveUsers(users);

  showNotification({
    type: 'success',
    title: 'Đăng Ký Thành Công',
    message: 'Tài Khoản Của Bạn Đã Được Tạo. Bạn Sẽ Được Chuyển Đến Trang Đăng Nhập.',
    onConfirm: onConfirm
  });
}

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @param {function} [onConfirm] - Callback to run after user confirms the notification.
 */
export function loginUser(email, password, onConfirm) {
  const users = getStoredUsers();
  const user = users[email];

  if (!user) {
    showNotification({
      type: 'error',
      title: 'Đăng nhập thất bại',
      message: 'Tài khoản chưa tồn tại. Vui lòng đăng ký trước.'
    });
    return;
  }

  if (user.passwordHash !== hashPassword(password)) {
    showNotification({
      type: 'error',
      title: 'Đăng nhập thất bại',
      message: 'Mật khẩu không chính xác. Vui lòng thử lại.'
    });
    return;
  }

  // Login successful
  const currentUserData = { ...user }; // Store the full user object
  sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(currentUserData));
  window.currentUser = currentUserData; // Update global state
  createLoginNotification(); // Create login notification

  showNotification({
    type: 'success',
    title: 'Đăng nhập thành công',
    message: 'Chào mừng bạn đã quay trở lại!',
    onConfirm: onConfirm
  });
}

/**
 * Resets the password for a given user.
 * @param {string} email
 * @param {string} newPassword
 */
export function resetPassword(email, newPassword) {
  const users = getStoredUsers();
  if (users[email]) {
    users[email].passwordHash = hashPassword(newPassword);
    saveUsers(users);
  }
  // No return value needed as we show notifications from the calling script.
}

/**
 * Updates a user's profile information.
 * @param {Object} updatedUser - The full user object with updated info.
 */
export function updateUserProfile(updatedUser) {
  const users = getStoredUsers();
  if (users[updatedUser.email]) {
    // Chỉ cho phép cập nhật các trường được chỉ định, bỏ qua mọi thay đổi về avatar.
    const { passwordHash, avatar, ...profileData } = updatedUser; // Destructure để loại bỏ avatar và password
    users[updatedUser.email] = {
      ...users[updatedUser.email], // Giữ lại thông tin cũ
      ...profileData, // Ghi đè bằng dữ liệu mới (name, username)
      avatar: './files/anhbia.png' // Đảm bảo avatar luôn là giá trị mặc định
    };
    saveUsers(users);
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(users[updatedUser.email]));
    window.currentUser = users[updatedUser.email];
  }
}

/**
 * Logs out the current user.
 */
export function logoutUser() {
  sessionStorage.removeItem(CURRENT_USER_SESSION_KEY);
  window.currentUser = null; // Clear global state
}

/**
 * Gets the current logged-in user.
 * @returns {Object|null} The current user object or null if not logged in.
 */
export function getCurrentUser() {
  const userData = sessionStorage.getItem(CURRENT_USER_SESSION_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Initialize window.currentUser on script load
window.currentUser = getCurrentUser();
