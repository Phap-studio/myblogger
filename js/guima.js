/**
 * OTP Verification Module
 * Manages the logic for the email verification step in the registration form.
 */
export function setupOtpModule() {
  // --- DOM ELEMENTS ---
  const verifyCodeInput = document.getElementById('verify-code-input');
  const resendTimerDisplay = document.getElementById('resend-timer');
  const resendCodeBtn = document.getElementById('resend-code-btn');
  const verifyCodeBtn = document.getElementById('verify-code-btn');
  const detailForm = document.getElementById('register-detail-form');
  const successModal = document.getElementById('verification-success-modal');
  const successModalClose = document.getElementById('verification-success-close');

  // Check if all required elements exist
  if (!verifyCodeInput || !resendTimerDisplay || !resendCodeBtn || !verifyCodeBtn || !detailForm) {
    console.error('OTP module elements not found.');
    return;
  }

  let countdown;

  function showVerificationSuccess() {
    if (!successModal) return;
    successModal.classList.add('is-visible');
    successModal.setAttribute('aria-hidden', 'false');
    successModalClose?.focus();
  }

  function closeVerificationSuccess() {
    if (!successModal) return;
    successModal.classList.remove('is-visible');
    successModal.setAttribute('aria-hidden', 'true');
    verifyCodeInput.focus();
  }

  successModalClose?.addEventListener('click', closeVerificationSuccess);
  successModal?.addEventListener('click', (event) => {
    if (event.target === successModal) closeVerificationSuccess();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && successModal?.classList.contains('is-visible')) {
      closeVerificationSuccess();
    }
  });

  /**
   * Starts the countdown timer for resending the code.
   */
  function startResendTimer() {
    let timeLeft = 120; // 2 minutes
    resendCodeBtn.disabled = true;
    resendTimerDisplay.textContent = `02:00`;

    countdown = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const seconds = (timeLeft % 60).toString().padStart(2, '0');
      resendTimerDisplay.textContent = `${minutes}:${seconds}`;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        resendCodeBtn.disabled = false;
        resendTimerDisplay.textContent = ''; // Hide timer
      }
    }, 1000);
  }

  // --- EVENT LISTENERS ---

  // Resend button logic
  resendCodeBtn.addEventListener('click', () => {
    if (!resendCodeBtn.disabled) {
      alert('Đã gửi lại mã xác nhận (mô phỏng).');
      startResendTimer();
    }
  });

  // Verification button logic
  verifyCodeBtn.addEventListener('click', () => {
    const code = verifyCodeInput.value.trim();
    const storedOtpData = JSON.parse(sessionStorage.getItem('registration_otp'));

    if (!storedOtpData) {
      alert('Không tìm thấy mã xác thực. Vui lòng thử lại từ đầu.');
      return;
    }

    if (Date.now() > storedOtpData.expires) {
      alert('Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã mới.');
      sessionStorage.removeItem('registration_otp');
      return;
    }

    if (code === storedOtpData.code) {
      showVerificationSuccess();
      sessionStorage.removeItem('registration_otp'); // Clear OTP after success
      // Disable the verification section
      [verifyCodeInput, resendCodeBtn, verifyCodeBtn].forEach(el => el.disabled = true);
      clearInterval(countdown);
    } else {
      alert('Vui lòng nhập mã xác thực gồm 6 chữ số.');
    }
  });

  // --- INITIALIZATION ---
  startResendTimer();
}
