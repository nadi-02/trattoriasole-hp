/**
 * Trattoria SOLE - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. スクロール時のヘッダー制御
  // Header behavior on scroll
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. 現在のページに応じたナビゲーションのアクティブ化
  // Set active class to current nav item
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // 簡単なパス判定 (Simple path matching)
    if (currentPath.includes(href) && href !== 'index.html' && href !== '/') {
      link.classList.add('active');
    } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && (href === 'index.html' || href === '/')) {
      link.classList.add('active');
    }
  });

  // 3. スクロールアニメーション (フェードイン)
  // Fade in elements on scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    observer.observe(el);
  });
});
