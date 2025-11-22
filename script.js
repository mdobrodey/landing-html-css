document.addEventListener('DOMContentLoaded', () => {
  function updateCountdown() {
    const timerElement = document.getElementById('countdown');
    if (!timerElement) return;

    let timeString = timerElement.textContent
      .replace(/\s+/g, '')
      .replace(/:/g, '');

    let days = parseInt(timeString.substring(0, 2));
    let hours = parseInt(timeString.substring(2, 4));
    let minutes = parseInt(timeString.substring(4, 6));
    let seconds = parseInt(timeString.substring(6, 8));

    seconds--;

    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if (minutes < 0) {
      minutes = 59;
      hours--;
    }
    if (hours < 0) {
      hours = 23;
      days--;
    }
    if (days < 0) {
      days = hours = minutes = seconds = 0;
    }

    timerElement.innerHTML =
      `<span class="timer-group">${String(days).padStart(2, '0')}</span>` +
      `<span class="timer-separator" style='margin-right: 4px;'>:</span>` +
      `<span class="timer-group">${String(hours).padStart(2, '0')}</span>` +
      `<span class="timer-separator" style='margin-left: 7px;'>:</span>` +
      `<span class="timer-group" style='margin-left: 4px;'>${String(
        minutes
      ).padStart(2, '0')}</span>` +
      `<span class="timer-separator" style='margin-left: 6px;'>:</span>` +
      `<span class="timer-group" style='margin-left: 4px;'>${String(
        seconds
      ).padStart(2, '0')}</span>`;
  }

  setInterval(updateCountdown, 1000);

  function initSlider(wrapperSelector, dotsSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    const dots = document.querySelectorAll(`${dotsSelector} .slider-dot`);

    if (!wrapper || dots.length === 0) return;

    let isScrolling = false;
    let scrollTimeout;

    wrapper.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (isScrolling) return;

        const scrollLeft = wrapper.scrollLeft;
        const wrapperWidth = wrapper.offsetWidth;
        const scrollWidth = wrapper.scrollWidth;
        const maxScroll = scrollWidth - wrapperWidth;

        let activeIndex;
        const scrollPercentage = scrollLeft / maxScroll;

        if (scrollPercentage >= 0.9) {
          activeIndex = dots.length - 1;
        } else {
          activeIndex = Math.round(scrollPercentage * (dots.length - 1));
        }

        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === activeIndex);
        });
      }, 50);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        isScrolling = true;

        const wrapperWidth = wrapper.offsetWidth;
        const scrollWidth = wrapper.scrollWidth;
        const maxScroll = scrollWidth - wrapperWidth;

        let scrollPosition;
        if (index === dots.length - 1) {
          scrollPosition = maxScroll;
        } else if (index === 0) {
          scrollPosition = 0;
        } else {
          scrollPosition = (maxScroll / (dots.length - 1)) * index;
        }

        dots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');

        wrapper.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });

        setTimeout(() => {
          isScrolling = false;
        }, 500);
      });
    });
  }

  function initDesktopCardHover() {
    if (window.innerWidth > 980) {
      const wrapper = document.querySelector('.narrow-cards-scroll-wrapper');
      if (!wrapper) return;

      const cards = document.querySelectorAll('.preview-card-narrow');
      let lastExpandedCard = document.querySelector('[data-card="digital"]');
      let isAnimating = false;

      cards.forEach((card) => {
        card.addEventListener('mouseenter', function () {
          if (isAnimating) return;

          isAnimating = true;

          cards.forEach((c) => {
            c.classList.remove('expanded');
            const content = c.querySelector('.preview-card-content-medium');
            if (content) content.classList.remove('active');
          });

          this.classList.add('expanded');
          const content = this.querySelector('.preview-card-content-medium');
          if (content) content.classList.add('active');

          lastExpandedCard = this;

          setTimeout(() => {
            isAnimating = false;
          }, 285);
        });
      });

      wrapper.addEventListener('mouseleave', function () {
        if (isAnimating) return;

        cards.forEach((card) => {
          card.classList.remove('expanded');
          const content = card.querySelector('.preview-card-content-medium');
          if (content) content.classList.remove('active');
        });

        if (lastExpandedCard) {
          lastExpandedCard.classList.add('expanded');
          const content = lastExpandedCard.querySelector(
            '.preview-card-content-medium'
          );
          if (content) content.classList.add('active');
        }
      });
    }
  }

  function initMobileCards() {
    const isMobile = window.innerWidth <= 980;

    if (isMobile) {
      document.querySelectorAll('.preview-card-narrow').forEach((card) => {
        card.classList.add('expanded');
        const content = card.querySelector('.preview-card-content-medium');
        if (content) content.classList.add('active');
      });

      initSlider(
        '.narrow-cards-scroll-wrapper',
        '.slider-dots:not(.advantages-slider-dots):not(.services-slider-dots)'
      );
      initSlider('.advantages-cards', '.advantages-slider-dots');
      initSlider('.services-grid', '.services-slider-dots');

      document
        .querySelector('.advantages-slider-dots')
        ?.style.setProperty('display', 'flex');
      document
        .querySelector('.services-slider-dots')
        ?.style.setProperty('display', 'flex');
    } else {
      initDesktopCardHover();

      document
        .querySelector('.advantages-slider-dots')
        ?.style.setProperty('display', 'none');
      document
        .querySelector('.services-slider-dots')
        ?.style.setProperty('display', 'none');
    }
  }

  function initBurgerMenu() {
    const burgerIcon = document.querySelector('.burger-menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const body = document.body;

    function openMenu() {
      burgerIcon?.classList.add('active');
      mobileMenu?.classList.add('active');
      mobileMenuOverlay?.classList.add('active');
      body.classList.add('menu-open');
    }

    function closeMenu() {
      burgerIcon?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      mobileMenuOverlay?.classList.remove('active');
      body.classList.remove('menu-open');
    }

    burgerIcon?.addEventListener('click', () => {
      if (mobileMenu?.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenuClose?.addEventListener('click', closeMenu);
    mobileMenuOverlay?.addEventListener('click', closeMenu);

    window.addEventListener('resize', () => {
      if (window.innerWidth > 630 && mobileMenu?.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  function initTestDriveSlider() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const images = document.querySelectorAll('.portfolio-image');
    const circles = document.querySelectorAll('.control-slider .status-circle');
    let currentSlide = 0;
    let isTransitioning = false;

    if (!images.length || !circles.length) return;

    function showSlide(index, direction = 'next') {
      if (isTransitioning || !images.length) return;
      isTransitioning = true;

      const currentImage = images[currentSlide];
      const nextImage = images[index];

      const slideOutClass =
        direction === 'next' ? 'slide-out-left' : 'slide-out-right';
      const slideInClass =
        direction === 'next' ? 'slide-in-right' : 'slide-in-left';

      currentImage.classList.remove('active');
      currentImage.classList.add(slideOutClass);

      nextImage.style.display = 'block';
      nextImage.classList.add(slideInClass);

      setTimeout(() => {
        nextImage.classList.add('active');
        nextImage.classList.remove(slideInClass);

        setTimeout(() => {
          currentImage.style.display = 'none';
          currentImage.classList.remove(slideOutClass);
        }, 50);

        circles.forEach((circle) => circle.classList.remove('active'));
        circles[index].classList.add('active');

        currentSlide = index;

        setTimeout(() => {
          isTransitioning = false;
        }, 100);
      }, 300);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
          newIndex = images.length - 1;
        }
        showSlide(newIndex, 'prev');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        let newIndex = currentSlide + 1;
        if (newIndex >= images.length) {
          newIndex = 0;
        }
        showSlide(newIndex, 'next');
      });
    }

    circles.forEach((circle, index) => {
      circle.addEventListener('click', () => {
        if (isTransitioning || currentSlide === index) return;
        const direction = index > currentSlide ? 'next' : 'prev';
        showSlide(index, direction);
      });
    });

    if (images.length > 0) {
      images.forEach((img) => (img.style.display = 'none'));
      images[0].style.display = 'block';
      images[0].classList.add('active');
      circles[0].classList.add('active');
    }
  }

  function initShowcaseSlider() {
    const prevBtn = document.getElementById('showcasePrevBtn');
    const nextBtn = document.getElementById('showcaseNextBtn');
    const images = document.querySelectorAll('.showcase-image');
    const dots = document.querySelectorAll(
      '#showcaseIndicators .indicator-dot'
    );
    let currentSlide = 0;
    let isTransitioning = false;

    if (!images.length || !dots.length) return;

    function showSlide(index, direction = 'next') {
      if (isTransitioning || !images.length) return;
      isTransitioning = true;

      const currentImage = images[currentSlide];
      const nextImage = images[index];

      const slideOutClass =
        direction === 'next' ? 'slide-out-left' : 'slide-out-right';
      const slideInClass =
        direction === 'next' ? 'slide-in-right' : 'slide-in-left';

      currentImage.classList.remove('active');
      currentImage.classList.add(slideOutClass);

      nextImage.style.display = 'block';
      nextImage.classList.add(slideInClass);

      setTimeout(() => {
        nextImage.classList.add('active');
        nextImage.classList.remove(slideInClass);

        setTimeout(() => {
          currentImage.style.display = 'none';
          currentImage.classList.remove(slideOutClass);
        }, 50);

        dots.forEach((dot) => dot.classList.remove('active'));
        dots[index].classList.add('active');

        currentSlide = index;

        setTimeout(() => {
          isTransitioning = false;
        }, 100);
      }, 300);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
          newIndex = images.length - 1;
        }
        showSlide(newIndex, 'prev');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        let newIndex = currentSlide + 1;
        if (newIndex >= images.length) {
          newIndex = 0;
        }
        showSlide(newIndex, 'next');
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (isTransitioning || currentSlide === index) return;
        const direction = index > currentSlide ? 'next' : 'prev';
        showSlide(index, direction);
      });
    });

    if (images.length > 0) {
      images.forEach((img) => (img.style.display = 'none'));
      images[0].style.display = 'block';
      images[0].classList.add('active');
      dots[0].classList.add('active');
    }
  }

  const zoomBtn = document.getElementById('zoomBtn');
  const showcaseZoomBtn = document.getElementById('showcaseZoomBtn');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');

  zoomBtn?.addEventListener('click', () => {
    const activeImage = document.querySelector('.portfolio-image.active');
    if (activeImage && modalImage) {
      modalImage.src = activeImage.src;
      modal?.classList.add('active');
    }
  });

  showcaseZoomBtn?.addEventListener('click', () => {
    const activeImage = document.querySelector('.showcase-image.active');
    if (activeImage && modalImage) {
      modalImage.src = activeImage.src;
      modal?.classList.add('active');
    }
  });

  closeModal?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  const nicheItems = document.querySelectorAll('.niche-item');
  const nicheContents = document.querySelectorAll('.niche-content');

  if (nicheItems.length > 0) {
    nicheItems[0].classList.add('active');
    nicheContents[0].classList.add('active');
  }

  let isAnimating = false;

  nicheItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      const targetNiche = this.getAttribute('data-niche');

      if (this.classList.contains('active') || isAnimating) return;

      isAnimating = true;

      nicheItems.forEach((ni) => ni.classList.remove('active'));

      const currentActive = document.querySelector('.niche-content.active');

      if (currentActive) {
        currentActive.classList.add('leaving');
        currentActive.classList.remove('active');
      }

      this.classList.add('active');

      const targetContent = document.querySelector(
        `.niche-content[data-content="${targetNiche}"]`
      );
      if (targetContent) {
        nicheContents.forEach((content) => {
          if (content !== currentActive) {
            content.classList.remove('leaving', 'active', 'entering');
          }
        });

        targetContent.classList.add('entering');

        setTimeout(() => {
          targetContent.classList.add('active');
        }, 50);
      }

      setTimeout(() => {
        if (currentActive) {
          currentActive.classList.remove('leaving');
        }
        if (targetContent) {
          targetContent.classList.remove('entering');
        }
        isAnimating = false;
      }, 500);
    });
  });

  initTestDriveSlider();
  initShowcaseSlider();
  initMobileCards();
  initBurgerMenu();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMobileCards, 250);
  });

  function initTeamSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.team-members-row');
    const circles = document.querySelectorAll(
      '.team-slider-controls .status-circle'
    );
    const prevBtn = document.querySelector(
      '.team-slider-controls .slider-button.prev'
    );
    const nextBtn = document.querySelector(
      '.team-slider-controls .slider-button.next'
    );

    if (!slides.length || !circles.length) return;

    function updateSlider() {
      slides.forEach((slide, index) => {
        if (index === currentSlide) {
          slide.classList.add('active-slide');
        } else {
          slide.classList.remove('active-slide');
        }
      });

      circles.forEach((circle, index) => {
        if (index === currentSlide) {
          circle.classList.add('active');
        } else {
          circle.classList.remove('active');
        }
      });

      if (prevBtn) {
        if (currentSlide === 0) {
          prevBtn.classList.remove('active');
        } else {
          prevBtn.classList.add('active');
        }
      }

      if (nextBtn) {
        if (currentSlide === slides.length - 1) {
          nextBtn.classList.remove('active');
        } else {
          nextBtn.classList.add('active');
        }
      }
    }

    window.changeSlide = function (direction) {
      const newSlide = currentSlide + direction;

      if (newSlide < 0 || newSlide >= slides.length) {
        return;
      }

      currentSlide = newSlide;
      updateSlider();
    };

    let touchStartX = 0;
    let touchEndX = 0;

    const teamSection = document.querySelector('.team-section-wrapper');

    if (teamSection) {
      teamSection.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      });

      teamSection.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
    }

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        changeSlide(1);
      }
      if (touchEndX > touchStartX + 50) {
        changeSlide(-1);
      }
    }

    updateSlider();
  }

  initTeamSlider();
});
