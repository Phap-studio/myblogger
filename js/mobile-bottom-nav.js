(function () {
  var currentPage = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var links = Array.from(document.querySelectorAll('.mobile-bottom-nav__item'));
  links.forEach(function (link) {
    if (decodeURIComponent(link.dataset.page).toLowerCase() === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // Allow horizontal swipes to move through the same pages as the bottom nav.
  // Ignore form controls and interactive widgets, and leave vertical scrolling alone.
  if (!links.length || !window.matchMedia('(max-width: 47.99875rem)').matches) return;

  var startX = 0;
  var startY = 0;
  var tracking = false;
  var directionLocked = false;
  var targetLink = null;
  var preloadRequested = false;
  var threshold = 44;
  var preloadThreshold = 24;
  var ignoreSelector = 'a, button, input, textarea, select, label, [contenteditable="true"], video, audio, canvas, .mobile-bottom-nav';

  function getAdjacentLink(dx) {
    var activeIndex = links.findIndex(function (link) {
      return link.getAttribute('aria-current') === 'page';
    });
    if (activeIndex < 0) activeIndex = 0;

    // Finger moving left advances; moving right goes back. Clamp at either end.
    var nextIndex = Math.max(0, Math.min(links.length - 1, activeIndex + (dx < 0 ? 1 : -1)));
    return nextIndex === activeIndex ? null : links[nextIndex];
  }

  function preload(link) {
    if (!link || preloadRequested) return;
    preloadRequested = true;
    var hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.href = link.href;
    hint.as = 'document';
    document.head.appendChild(hint);
  }

  document.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1 || event.target.closest(ignoreSelector)) {
      tracking = false;
      return;
    }
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    tracking = true;
    directionLocked = false;
    targetLink = null;
    preloadRequested = false;
  }, { passive: true });

  document.addEventListener('touchmove', function (event) {
    if (!tracking || event.touches.length !== 1) return;
    var dx = event.touches[0].clientX - startX;
    var dy = event.touches[0].clientY - startY;

    if (!directionLocked && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      // Let native vertical scrolling win; only track deliberate horizontal swipes.
      if (Math.abs(dy) > Math.abs(dx) * 1.15) {
        tracking = false;
        return;
      }
      directionLocked = true;
    }

    if (directionLocked && Math.abs(dx) >= preloadThreshold) {
      targetLink = getAdjacentLink(dx);
      preload(targetLink);
    }
  }, { passive: true });

  document.addEventListener('touchend', function (event) {
    if (!tracking || !event.changedTouches.length) return;
    tracking = false;

    var dx = event.changedTouches[0].clientX - startX;
    var dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.25) return;

    var nextLink = getAdjacentLink(dx);
    if (nextLink) window.location.replace(nextLink.href);
  }, { passive: true });

  document.addEventListener('touchcancel', function () {
    tracking = false;
  }, { passive: true });
})();
