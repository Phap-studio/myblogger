import { getCurrentUser } from './auth.js';

const NOTIFICATIONS_STORAGE_PREFIX = 'tvp_notifications_';

/**
 * Gets the operating system of the user.
 * @returns {string}
 */
function getOS() {
  const userAgent = window.navigator.userAgent;
  if (userAgent.indexOf("Win") != -1) return "Windows";
  if (userAgent.indexOf("Mac") != -1) return "macOS";
  if (userAgent.indexOf("iPhone") != -1) return "iPhone";
  if (userAgent.indexOf("Android") != -1) return "Android";
  if (userAgent.indexOf("Linux") != -1) return "Linux";
  return "Unknown OS";
}

/**
 * Retrieves all notifications for a specific user from localStorage.
 * @param {string} userId - The user's email.
 * @returns {Array}
 */
function getStoredNotifications(userId) {
  if (!userId) return [];
  const key = NOTIFICATIONS_STORAGE_PREFIX + userId;
  const notificationsJson = localStorage.getItem(key);
  return notificationsJson ? JSON.parse(notificationsJson) : [];
}

/**
 * Saves notifications for a specific user to localStorage.
 * @param {string} userId - The user's email.
 * @param {Array} notifications - The array of notifications to save.
 */
function saveNotifications(userId, notifications) {
  if (!userId) return;
  const key = NOTIFICATIONS_STORAGE_PREFIX + userId;
  localStorage.setItem(key, JSON.stringify(notifications));
}

/**
 * Adds a new notification for a user.
 * @param {string} userId - The user's email.
 * @param {string} message - The notification message.
 */
export function addNotification(userId, message) {
  if (!userId) return;
  const notifications = getStoredNotifications(userId);
  const newNotification = {
    id: Date.now(),
    message: message,
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(newNotification); // Add to the top
  saveNotifications(userId, notifications);
}

/**
 * Creates a notification for a successful login.
 */
export function createLoginNotification() {
  const user = getCurrentUser();
  if (!user) return;
  const os = getOS();
  addNotification(user.email, `Bạn đã đăng nhập thành công trên thiết bị ${os}.`);
}

/**
 * Creates a notification for a successful password reset.
 * @param {string} email - The email of the user who reset their password.
 */
export function createPasswordResetNotification(email) {
  addNotification(email, 'Bạn đã khôi phục mật khẩu thành công.');
}


/**
 * Renders notifications into the panel.
 */
export function renderNotifications() {
  const user = getCurrentUser();
  const listContainer = document.getElementById('notifications-list');
  if (!listContainer) return;

  if (!user) {
    listContainer.innerHTML = `
      <div class="notifications-empty-state">
        <p class="empty-state-title">Chưa có thông báo</p>
        <p class="empty-state-message">Vui lòng đăng nhập/đăng ký để sử dụng tính năng.</p>
      </div>`;
    return;
  }

  const notifications = getStoredNotifications(user.email);

  if (notifications.length === 0) {
    listContainer.innerHTML = `<div class="notifications-empty-state"><p>Bạn chưa có thông báo nào.</p></div>`;
    return;
  }

  listContainer.innerHTML = notifications.map(n => `
    <div class="notification-item">
      <div class="notification-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      </div>
      <div class="notification-content">
        <p class="notification-message">${n.message}</p>
        <span class="notification-timestamp">${formatTimeAgo(n.timestamp)}</span>
      </div>
    </div>
  `).join('');
}

function formatTimeAgo(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' lúc ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}