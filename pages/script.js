document.addEventListener('DOMContentLoaded', () => {
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

  initBurgerMenu();
});
