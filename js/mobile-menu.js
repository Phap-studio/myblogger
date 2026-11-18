*
 * TVP BLOGGER - menu mobile dùng chung cho mọi trang.
 * Bấm dấu 3 gạch -> hiện danh sách HOME / SHOP / COMING UP / FEEDBACK.
 * Muốn thêm/bớt mục: chỉ cần sửa mảng LINKS bên dưới, tất cả các trang tự đồng bộ.
 */
(function () {
  'use strict';

  var LINKS = [
    { label: 'HOME', href: './index.html' },
    { label: 'SHOP', href: './shop.html' },
    { label: 'COMING UP', href: './Coming Up.html' },
    { label: 'FEEDBACK', href: './feedback.html' }
  ];

  var TOGGLE_SELECTOR = '[data-fls-menu], .menu__icon';

  function init() {
    var header = document.querySelector('.header');
    var toggle = document.querySelector(TOGGLE_SELECTOR);
    if (!header || !toggle || document.getElementById('tvp-mobile-menu')) return;

    var root = document.documentElement;
    var currentFile = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');

    // --- Tạo panel menu ---
    var nav = document.createElement('nav');
    nav.id = 'tvp-mobile-menu';
    nav.setAttribute('aria-label', 'Menu');

    LINKS.forEach(function (item) {
      var a = document.createElement('a');
      a.textContent = item.label;
      a.setAttribute('href', encodeURI(item.href));
      var file = decodeURIComponent(item.href.split('/').pop());
      if (file === currentFile) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    document.body.appendChild(nav);

    // --- Helpers ---
    function toggleVisible() {
      return window.getComputedStyle(toggle).display !== 'none' && toggle.getClientRects().length > 0;
    }

    function place() {
      var rect = header.getBoundingClientRect();
      nav.style.top = Math.max(rect.bottom, 0) + 'px';
    }

    function setOpen(open) {
      if (open) place();
      nav.classList.toggle('open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function syncMode() {
      var active = toggleVisible();
      root.classList.toggle('tvp-menu-active', active);
      if (!active) setOpen(false);
    }

    // --- Sự kiện ---
    // Dùng capture để chặn handler cũ của template (nếu có) tránh hiện 2 menu.
    document.addEventListener('click', function (e) {
      if (!root.classList.contains('tvp-menu-active')) return;
      if (e.target.closest(TOGGLE_SELECTOR)) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!nav.classList.contains('open'));
      } else if (!e.target.closest('#tvp-mobile-menu')) {
        setOpen(false);
      }
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      syncMode();
      if (nav.classList.contains('open')) place();
    });

    window.addEventListener('scroll', function () {
      if (!nav.classList.contains('open')) return;
      place();
      if (header.getBoundingClientRect().bottom <= 0) setOpen(false);
    }, { passive: true });

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'tvp-mobile-menu');
    syncMode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
