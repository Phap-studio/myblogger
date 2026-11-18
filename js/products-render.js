document.addEventListener('DOMContentLoaded', () => {
  const productGridContainer = document.getElementById('product-grid-container');
  const paginationContainer = document.getElementById('pagination-container');

  if (!productGridContainer || !paginationContainer || typeof products === 'undefined') {
    console.error('Required containers or products data not found!');
    return;
  }

  let currentPage = 1;
  const itemsPerPage = 15;

  /**
   * Renders a slice of products to the grid.
   * @param {Array} productsToRender - The array of products for the current page.
   */
  function renderProductSlice(productsToRender) {
    productGridContainer.innerHTML = '';
    productsToRender.forEach(product => {
      const card = document.createElement('article');
      card.className = 'video-card';
      card.dataset.id = product.id;
      card.innerHTML = `
        <a href="#" class="js-open-modal" draggable="false">
          <div class="video-image">
            <img src="${product.image}?v=20261118-fast-render" alt="${product.title}" loading="lazy" decoding="async">
            <span class="tag">${product.category}</span>
          </div>
          <h3>${product.title}</h3>
          <p>${product.brand}</p>
        </a>
      `;
      productGridContainer.appendChild(card);

      const img = card.querySelector('img');
      img.onload = () => img.classList.add('loaded');
      img.onerror = () => {
        img.classList.add('loaded');
      };
      if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
    });
  }

  /**
   * Creates and renders pagination controls.
   */
  function setupPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(products.length / itemsPerPage);
    if (totalPages <= 1) return;

    const createButton = (content, page) => {
      const button = document.createElement('button');
      button.className = 'pagination-button';
      button.innerHTML = content;
      if (page) {
        button.addEventListener('click', () => displayPage(page));
      }
      return button;
    };

    // Previous Button
    const prevButton = createButton('←', currentPage > 1 ? currentPage - 1 : null);
    if (currentPage === 1) prevButton.disabled = true;
    paginationContainer.appendChild(prevButton);

    // Page Number Buttons
    const pageNumbers = getPageNumbers(totalPages, currentPage);
    pageNumbers.forEach(pageNumber => {
      if (pageNumber === '...') {
        const ellipsis = createButton('...');
        ellipsis.classList.add('ellipsis');
        paginationContainer.appendChild(ellipsis);
      } else {
        const pageButton = createButton(pageNumber, pageNumber);
        if (pageNumber === currentPage) {
          pageButton.classList.add('active');
        }
        paginationContainer.appendChild(pageButton);
      }
    });

    // Next Button
    const nextButton = createButton('→', currentPage < totalPages ? currentPage + 1 : null);
    if (currentPage === totalPages) nextButton.disabled = true;
    paginationContainer.appendChild(nextButton);
  }

  /**
   * Calculates which page numbers to show for responsive pagination.
   */
  function getPageNumbers(totalPages, currentPage) {
    const pages = new Set();
    // On mobile, we want to show fewer pages.
    const maxVisibleDesktop = 5;
    const maxVisibleMobile = 3;
    const maxVisible = window.innerWidth < 620 ? maxVisibleMobile : maxVisibleDesktop;

    // Always show first, last, and current page
    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);

    // Add pages around the current page
    for (let i = 1; pages.size < maxVisible && i < totalPages; i++) {
      if (currentPage - i > 1) pages.add(currentPage - i);
      if (pages.size >= maxVisible) break;
      if (currentPage + i < totalPages) pages.add(currentPage + i);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const finalPages = [];
    let lastPage = 0;

    for (const page of sortedPages) {
      if (lastPage !== 0 && page - lastPage > 1) {
        finalPages.push('...');
      }
      finalPages.push(page);
      lastPage = page;
    }
    return finalPages;
  }

  /**
   * Displays a specific page of products.
   */
  function displayPage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = products.slice(start, end);

    productGridContainer.classList.add('loading'); // Triggers fade-out and move-down animation

    setTimeout(() => {
      renderProductSlice(paginatedItems);
      productGridContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
      const sectionTitle = document.querySelector('.section-title'); // More robust selector
      if (sectionTitle) {
        sectionTitle.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      productGridContainer.classList.remove('loading');
      setupPagination(); // Re-render pagination to update active state
    }, 300);
  }

  // Initial setup
  displayPage(1);
  
  // Re-render pagination on resize for responsiveness
  window.addEventListener('resize', setupPagination);

  // Event delegation for opening modals
  productGridContainer.addEventListener('click', (e) => {
    const cardLink = e.target.closest('.js-open-modal');
    if (!cardLink) return;

    e.preventDefault();
    const card = cardLink.closest('.video-card');
    const productId = parseInt(card.dataset.id, 10);
    const product = products.find(p => p.id === productId);

    if (product && window.showProductDetails) {
      window.showProductDetails(product);
    }
  });
});
