/**
 * ===================================================================
 * Logic cho nút "Liên hệ Zalo"
 * ===================================================================
 * Script này cải thiện chức năng của nút "Liên hệ Zalo" để mang lại
 * trải nghiệm tốt hơn cho người dùng bằng cách cố gắng mở ứng dụng
 * Zalo gốc trước, sau đó mới chuyển hướng đến Zalo Web nếu thất bại.
 */

// --- CẤU HÌNH ---
// Thay đổi số điện thoại Zalo của bạn tại đây. Sử dụng định dạng 10 số, bắt đầu bằng 0.
const ZALO_PHONE_NUMBER = '0912665729';
// --- KẾT THÚC CẤU HÌNH ---

/**
 * Xử lý sự kiện click cho nút liên hệ Zalo.
 * Tự động phát hiện thiết bị của người dùng và cố gắng mở ứng dụng Zalo.
 * Nếu ứng dụng không mở được sau một khoảng thời gian ngắn, sẽ tự động
 * chuyển hướng người dùng đến Zalo Web.
 * @param {Event} event - Sự kiện click.
 */
function handleZaloContact(event) {
  // Ngăn chặn hành vi mặc định của thẻ <a> (chuyển trang)
  event.preventDefault();

  const zaloWebUrl = `https://zalo.me/${ZALO_PHONE_NUMBER}`;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Xác định URL phù hợp cho ứng dụng dựa trên thiết bị
  const appUrl = isMobile
    ? `zalo://qr/p/${ZALO_PHONE_NUMBER}` // Mobile: Mở trang cá nhân qua QR
    : `zalo://chat?phone=${ZALO_PHONE_NUMBER}`; // Desktop: Mở cửa sổ chat

  // Tạo một bộ đếm thời gian để chuyển hướng đến Zalo Web nếu ứng dụng không mở được
  const fallbackTimeout = setTimeout(() => {
    // Đảm bảo xóa các event listener trước khi chuyển hướng
    window.removeEventListener('visibilitychange', visibilityHandler);
    window.removeEventListener('pagehide', clearFallback);
    // Chuyển hướng sang Zalo Web trong một tab mới
    window.open(zaloWebUrl, '_blank');
  }, 1200); // Tăng thời gian chờ lên một chút cho Zalo PC

  // Hàm để hủy bỏ việc chuyển hướng dự phòng
  const clearFallback = () => {
    clearTimeout(fallbackTimeout);
    window.removeEventListener('visibilitychange', visibilityHandler);
    window.removeEventListener('pagehide', clearFallback);
  };

  // Nếu tab trình duyệt bị ẩn đi, chúng ta giả định rằng ứng dụng Zalo đã được mở
  // và có thể hủy bỏ việc chuyển hướng dự phòng.
  const visibilityHandler = () => {
    if (document.visibilityState === 'hidden') {
      clearFallback();
    }
  };

  // Lắng nghe sự kiện thay đổi trạng thái hiển thị để phát hiện việc chuyển ứng dụng
  window.addEventListener('visibilitychange', visibilityHandler);
  // 'pagehide' là một sự kiện đáng tin cậy hơn cho mục đích này trên iOS Safari
  window.addEventListener('pagehide', clearFallback);

  // Cố gắng mở ứng dụng Zalo. Trình duyệt sẽ xử lý protocol `zalo://`.
  // Nếu không thành công, setTimeout sẽ thực thi và chuyển hướng người dùng.
  window.location.href = appUrl;
}

document.addEventListener('DOMContentLoaded', () => {
  // Lấy các phần tử DOM của modal một lần duy nhất
  const modalOverlay = document.getElementById('detail-modal');
  if (!modalOverlay) return;

  const modalProductImage = modalOverlay.querySelector('#modal-product-image');
  const modalProductTitle = modalOverlay.querySelector('#modal-product-title');
  const modalPrice = modalOverlay.querySelector('#modal-price');
  const modalDuration = modalOverlay.querySelector('#modal-duration');
  const modalWarranty = modalOverlay.querySelector('#modal-warranty');
  const modalDelivery = modalOverlay.querySelector('#modal-delivery');
  const modalFeaturesList = modalOverlay.querySelector('#modal-features-list');
  const modalQrImage = modalOverlay.querySelector('.modal-qr-image');
  const modalZaloButton = modalOverlay.querySelector('.modal-zalo-button');
  const closeModalBtn = modalOverlay.querySelector('.modal-close');

  // Gắn hàm xử lý thông minh cho nút Zalo
  if (modalZaloButton) {
    modalZaloButton.addEventListener('click', handleZaloContact);
  }

  let isModalOpen = false;

  function populateModal(product) {
    modalProductImage.src = product.image
      ? `${product.image}?v=20261118-fast-render`
      : './files/placeholder.png';
    modalProductTitle.textContent = product.title || 'Không có tiêu đề';
    modalPrice.textContent = product.price || 'N/A';
    modalDuration.textContent = product.duration || 'N/A';
    modalWarranty.textContent = product.warranty || 'N/A';

    // Ẩn hoặc hiện thông tin giao hàng
    // Nếu sản phẩm không có thuộc tính 'delivery', ẩn cả dòng thông tin này đi.
    if (product.delivery) {
      modalDelivery.parentElement.style.display = ''; // Reset về CSS mặc định
      modalDelivery.textContent = product.delivery;
    } else {
      modalDelivery.parentElement.style.display = 'none';
    }

    modalFeaturesList.innerHTML = '';
    if (product.features && product.features.length > 0) {
      product.features.forEach(featureText => {
        const li = document.createElement('li');
        li.textContent = featureText;
        modalFeaturesList.appendChild(li);
      });
    } else {
      modalFeaturesList.innerHTML = '<li>Không có thông tin chi tiết.</li>';
    }

    modalQrImage.src = product.qr || './files/zalo-qr-placeholder.png';
    // Không cần cập nhật href nữa vì logic đã được xử lý bằng JavaScript
    // modalZaloButton.href = product.zalo || '#';
  }

  function openModal() {
    if (isModalOpen) return;
    isModalOpen = true;

    // Bù lại cho thanh cuộn để chống rung/giật layout
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const fixedElements = document.querySelectorAll('[data-fls-header]'); // Nhắm vào header cố định
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        fixedElements.forEach(el => {
            el.style.paddingRight = `${scrollbarWidth}px`;
        });
    }

    // Make it visible before starting the animation
    modalOverlay.style.visibility = 'visible';
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!isModalOpen) return;
    
    modalOverlay.classList.remove('active');

    // Use transitionend to hide the element after the animation completes
    modalOverlay.addEventListener('transitionend', () => {
      modalOverlay.style.visibility = 'hidden';
      isModalOpen = false;

      // Xóa padding bù lại cho thanh cuộn (không còn cần thiết cho navbar)
      document.body.style.paddingRight = ''; // Giữ lại để xóa padding nếu có từ các modal khác
      document.body.classList.remove('modal-open');
    }, { once: true }); // Important: listener should only fire once
  }

  // Gán các sự kiện để đóng modal
  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) closeModal();
  });

  // Tạo một hàm toàn cục để các script khác có thể gọi
  window.showProductDetails = (product) => { // This function is for product details, not auth. No changes needed here.
    populateModal(product);
    openModal();
  };
});
