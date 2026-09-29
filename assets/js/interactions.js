/* ============ ✨ تفاعلات وتحسينات بصرية ============ */

(function () {
  'use strict';

  /* ---------- 1) Scroll Reveal ---------- */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll(
      '.section-group, .sec-card, .dashboard-unified, .wirdi-footer, .card'
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      if (el.classList.contains('fade-in')) return;
      el.classList.add('reveal-on-scroll');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 2) Ripple Effect ---------- */
  function initRipple() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('button, .btn-play, .chip, .wf-bar-btn');
      if (!btn) return;
      if (btn.disabled) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'wirdi-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

      if (getComputedStyle(btn).position === 'static') {
        btn.style.position = 'relative';
      }
      if (getComputedStyle(btn).overflow !== 'hidden') {
        btn.style.overflow = 'hidden';
      }

      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    }, { passive: true });
  }

  /* ---------- 3) Smooth internal links ---------- */
  function initSmoothScroll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  /* ---------- 4) Image lazy load fallback ---------- */
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) return;
    document.querySelectorAll('img:not([loading])').forEach(function (img) {
      img.setAttribute('loading', 'lazy');
    });
  }

  /* ---------- 5) Header shrink on scroll ---------- */
  function initHeaderShrink() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    let lastY = 0;
    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (y > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ---------- التشغيل ---------- */
  function init() {
    initScrollReveal();
    initRipple();
    initSmoothScroll();
    initLazyImages();
    initHeaderShrink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();