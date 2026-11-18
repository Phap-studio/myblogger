(function () {
  'use strict';

  // Discourage casual downloading/copying while keeping images visible and usable.
  var imageSelector = 'img, picture, [style*="background-image"]';

  document.addEventListener('contextmenu', function (event) {
    if (event.target.closest(imageSelector)) {
      event.preventDefault();
    }
  });

  document.addEventListener('dragstart', function (event) {
    if (event.target.closest(imageSelector)) event.preventDefault();
  });

  document.addEventListener('copy', function (event) {
    var selection = window.getSelection();
    var selectedImage = selection && selection.anchorNode &&
      (selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentElement);
    if (event.target.closest && event.target.closest(imageSelector) ||
        selectedImage && selectedImage.closest && selectedImage.closest(imageSelector)) {
      event.preventDefault();
    }
  });
})();
