/**
 * Creates and manages a general-purpose notification popup.
 */

let popupInstance = null;

function createPopup() {
  if (document.getElementById('notification-popup-overlay')) {
    return document.getElementById('notification-popup-overlay');
  }

  const overlay = document.createElement('div');
  overlay.id = 'notification-popup-overlay';
  overlay.className = 'notification-popup-overlay';

  overlay.innerHTML = `
    <div class="notification-popup-content">
      <div id="notification-popup-icon" class="notification-popup-icon"></div>
      <h3 id="notification-popup-title" class="notification-popup-title"></h3>
      <p id="notification-popup-message" class="notification-popup-message"></p>
      <button id="notification-popup-button" class="notification-popup-button">OK</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const okButton = overlay.querySelector('#notification-popup-button');
  okButton.addEventListener('click', () => hideNotification());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideNotification();
    }
  });

  return overlay;
}

export function showNotification({ type = 'success', title, message, onConfirm }) {
  popupInstance = popupInstance || createPopup();

  popupInstance.querySelector('#notification-popup-icon').className = `notification-popup-icon ${type}`;
  popupInstance.querySelector('#notification-popup-icon').textContent = type === 'success' ? '✓' : '✕';
  popupInstance.querySelector('#notification-popup-title').textContent = title;
  popupInstance.querySelector('#notification-popup-message').textContent = message;

  popupInstance.querySelector('#notification-popup-button').onclick = () => {
    hideNotification();
    if (onConfirm) onConfirm();
  };

  popupInstance.classList.add('visible');
}

export function hideNotification() {
  if (popupInstance) {
    popupInstance.classList.remove('visible');
  }
}