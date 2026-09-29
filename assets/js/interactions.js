/* ============ ✨ تفاعلات وتحسينات بصرية ============ */
(function () {
  'use strict';

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('.section-group, .sec-card, .dashboard-unified, .card');
    if (!targets.length) return;
    targets.forEach(function (el) {
      if (el.classList.contains('fade-in')) return;
      el.classList.add('reveal-on-scroll');
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { obs.observe(el); });
  }

  function initRipple() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .btn-play, .wf-bar-btn');
      if (!btn || btn.disabled) return;
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'wirdi-ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      if (getComputedStyle(btn).overflow !== 'hidden') btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    }, { passive: true });
  }

  function initSmoothScroll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  function initHeaderShrink() {
    var header = document.querySelector('.main-header');
    if (!header) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  function init() {
    initScrollReveal();
    initRipple();
    initSmoothScroll();
    initHeaderShrink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); });
  } else { setTimeout(init, 300); }
})();