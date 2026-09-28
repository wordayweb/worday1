/* ============ صفحة الإعدادات ============ */

(function () {
  'use strict';

  /* ============================================================
     مفتاح موحّد للوضع الليلي (نفس المفتاح الذي يستخدمه header.js)
     ============================================================ */
  const DARK_KEY = 'wirdi_dark';

  /* ---------- الوضع الليلي ---------- */
  function initDark() {
    const toggle = document.getElementById('setDark');
    if (!toggle) return;

    /* قراءة الحالة المحفوظة */
    const saved = localStorage.getItem(DARK_KEY);
    let isDark = false;

    if (saved === 'true') isDark = true;
    else if (saved === 'false') isDark = false;
    else isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    /* تطبيق الحالة */
    toggle.checked = isDark;
    if (isDark) document.body.classList.add('dark');

    /* التفاعل */
    toggle.addEventListener('change', () => {
      const nowDark = toggle.checked;
      document.body.classList.toggle('dark', nowDark);
      localStorage.setItem(DARK_KEY, String(nowDark));
    });
  }

  /* ---------- إعدادات أخرى (قابلة للتوسعة) ---------- */
  function initOtherSettings() {
    /* يمكن إضافة: الخط، الحجم، الإشعارات، إلخ */
  }

  /* ---------- التهيئة ---------- */
  function init() {
    initDark();
    initOtherSettings();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();