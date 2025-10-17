function updateCountdown() {
  const timerElement = document.getElementById('countdown');
  if (!timerElement) return;

  let timeString = timerElement.textContent
    .replace(/\s+/g, '')
    .replace(/:/g, '');

  let days = parseInt(timeString.substr(0, 2));
  let hours = parseInt(timeString.substr(2, 2));
  let minutes = parseInt(timeString.substr(4, 2));
  let seconds = parseInt(timeString.substr(6, 2));

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

    cards.forEach((card) => {
      card.addEventListener('mouseenter', function () {
        cards.forEach((c) => {
          c.classList.remove('expanded');
          const content = c.querySelector('.preview-card-content-medium');
          if (content) content.classList.remove('active');
        });

        this.classList.add('expanded');
        const content = this.querySelector('.preview-card-content-medium');
        if (content) content.classList.add('active');

        lastExpandedCard = this;
      });
    });

    wrapper.addEventListener('mouseleave', function () {
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

document.addEventListener('DOMContentLoaded', () => {
  initMobileCards();
  initBurgerMenu();
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initMobileCards, 250);
});
