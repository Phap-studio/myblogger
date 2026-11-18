document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('#hero');
  if (!hero) return;

  const bg1 = document.getElementById('hero-bg-1');
  const bg2 = document.getElementById('hero-bg-2');
  const heading = document.querySelector('#hero-heading');
  const slideButtons = document.querySelectorAll('.slide');
  const prevButton = document.querySelector('.slide-nav.prev');
  const nextButton = document.querySelector('.slide-nav.next');
  
  if (!bg1 || !bg2 || !heading || slideButtons.length === 0 || !prevButton || !nextButton) {
    // Don't run if essential elements are missing
    return;
  }

  let slideInterval;
  const SLIDESHOW_INTERVAL = 5000;
  const isSmallScreen = window.matchMedia('(max-width: 620px), (pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeBg = bg1;
  let inactiveBg = bg2;

  const updateSlideContent = (slide) => {
    document.querySelector('.slide.active')?.classList.remove('active');
    slide.classList.add('active');
    heading.textContent = slide.dataset.title;
    [activeBg, inactiveBg] = [inactiveBg, activeBg];
    activeBg.style.backgroundImage = `url("${slide.dataset.image}")`;
    activeBg.style.opacity = 1;
    inactiveBg.style.opacity = 0;
  };

  const changeSlide = (direction) => {
    const current = document.querySelector('.slide.active');
    const currentIndex = Array.from(slideButtons).indexOf(current);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= slideButtons.length) nextIndex = 0;
    else if (nextIndex < 0) nextIndex = slideButtons.length - 1;
    updateSlideContent(slideButtons[nextIndex]);
  };

  const startSlideShow = () => {
    clearInterval(slideInterval);
    // Save battery and decoding work on phones when the banner is off screen
    // or the browser tab is in the background.
    if (isSmallScreen || reducedMotion || document.hidden) return;
    slideInterval = setInterval(() => changeSlide(1), SLIDESHOW_INTERVAL);
  };

  const resetSlideShow = () => {
    clearInterval(slideInterval);
    startSlideShow();
  };

  const initialSlide = document.querySelector('.slide.active');
  if (initialSlide) {
    heading.textContent = initialSlide.dataset.title;
    const showInitialBanner = () => {
      activeBg.style.backgroundImage = `url("${initialSlide.dataset.image}")`;
      activeBg.style.opacity = 1;
    };
    const bannerImage = new Image();
    bannerImage.decoding = 'async';
    bannerImage.onload = showInitialBanner;
    bannerImage.onerror = showInitialBanner;
    bannerImage.src = initialSlide.dataset.image;
  }
  inactiveBg.style.opacity = 0;

  slideButtons.forEach((slide) => slide.addEventListener('click', () => { updateSlideContent(slide); resetSlideShow(); }));
  prevButton.addEventListener('click', () => { changeSlide(-1); resetSlideShow(); });
  nextButton.addEventListener('click', () => { changeSlide(1), resetSlideShow(); });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(slideInterval);
    else startSlideShow();
  });

  startSlideShow();
});
