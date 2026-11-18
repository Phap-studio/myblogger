(function () {
  'use strict';

  // Discourage casual downloading/copying while keeping images visible and usable.
  document.addEventListener('contextmenu', function (event) {
    if (event.target.closest('img, picture, [style*="background-image"]')) {
      event.preventDefault();
    }
  });

  document.addEventListener('dragstart', function (event) {
    if (event.target.closest('img, picture')) event.preventDefault();
  });

  document.addEventListener('selectstart', function (event) {
    if (event.target.closest('img, picture')) event.preventDefault();
  });

  document.addEventListener('touchstart', function (event) {
    if (event.target.closest('img, picture')) event.preventDefault();
  }, { passive: false });
})();
