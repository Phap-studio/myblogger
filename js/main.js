document.addEventListener('DOMContentLoaded', () => {
  // Add a body class to the Coming Up page for specific styling
  if (window.location.pathname.includes('Coming Up.html')) {
    // Ensure the body has the correct class for styling
    // This is important because the HTML file might not explicitly have it.
    // The class name should match the one used in CSS for targeting.
    document.body.classList.add('coming-up-page-body');
  }

  // LOGIC ĐIỀU KHIỂN NAVBAR KHI SCROLL ĐÃ ĐƯỢC CHUYỂN HOÀN TOÀN SANG `js/index.min.js`
  // ĐỂ TRÁNH XUNG ĐỘT VÀ LỖI NHẤP NHÁY.
  // Đoạn code cũ đã được xóa khỏi đây.

  /**
   * ===================================================================
   * Logic để cập nhật đồng hồ ở mục Home theo thời gian thực.
   * ===================================================================
   */
  function initHomePageClock() {
    // Chọn các thành phần của đồng hồ từ DOM
    const hourHand = document.querySelector('.about__desk-clock-hand--hour');
    const minuteHand = document.querySelector('.about__desk-clock-hand--minute');
    const secondHand = document.querySelector('.about__desk-clock-hand--second');
    const timeDisplay = document.querySelector('.about__desk-clock-time');
    const dateDisplay = document.querySelector('.about__desk-clock-date');

    // Chỉ chạy script nếu các thành phần đồng hồ tồn tại (tức là đang ở trang home)
    if (!hourHand || !minuteHand || !secondHand || !timeDisplay || !dateDisplay) {
      return;
    }

    function updateClock() {
      // Lấy thời gian hiện tại theo giờ địa phương của thiết bị
      const now = new Date();

      // --- Lấy các thành phần giờ, phút, giây từ đồng hồ hệ thống ---
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      // --- Cập nhật đồng hồ kim (Analog) ---
      const secondsRotation = (seconds / 60) * 360;
      const minutesRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
      const hoursRotation = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

      secondHand.style.transform = `rotate(${secondsRotation}deg)`;
      minuteHand.style.transform = `rotate(${minutesRotation}deg)`;
      hourHand.style.transform = `rotate(${hoursRotation}deg)`;

      // --- Cập nhật đồng hồ số và ngày (Digital) ---
      // Sử dụng phương pháp thủ công để đảm bảo format HH:MM:SS và DD/MM/YYYY
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');

      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() là 0-indexed
      const year = now.getFullYear();

      timeDisplay.textContent = `${h}:${m}:${s}`;
      dateDisplay.textContent = `${day}/${month}/${year}`;
    }

    function tick() {
      updateClock();
      const delay = 1000 - new Date().getMilliseconds();
      setTimeout(tick, delay);
    }

    tick(); // Bắt đầu đồng hồ
  }

  initHomePageClock();
});