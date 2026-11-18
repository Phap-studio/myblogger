(function () {
  var currentPage = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.mobile-bottom-nav__item').forEach(function (link) {
    if (decodeURIComponent(link.dataset.page).toLowerCase() === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
