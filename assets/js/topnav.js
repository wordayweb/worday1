/* ============ شريط التنقل العلوي (الشرائح) ============ */

(function () {
  // ===== عناصر الشريط =====
  const TOP_NAV_ITEMS = [
    { href: 'index.html',                icon: '',   label: 'رئيسية',          key: 'home',     period: null },
    { href: 'quran.html',                icon: '',   label: 'القرآن الكريم',   key: 'quran',    period: null },
    { href: 'athkar.html?type=morning',  icon: '🌅', label: 'أذكار الصباح',    key: 'morning',  period: 'morning' },
    { href: 'athkar.html?type=evening',  icon: '🌆', label: 'أذكار المساء',    key: 'evening',  period: 'evening' },
    { href: 'athkar.html?type=hearts',   icon: '',   label: 'زاد القلوب',      key: 'hearts',   period: null },
    { href: 'athkar.html?type=sleep',    icon: '🌙', label: 'أذكار النوم',     key: 'sleep',    period: null },
    { href: 'prayer.html',               icon: '🕌', label: 'مواقيت الصلاة',   key: 'prayer',   period: null },
    { href: 'tasbih.html',               icon: '📿', label: 'التسبيح',         key: 'tasbih',   period: null },
    { href: 'amin.html',                 icon: '👑', label: 'وِرْدِي الأمين',  key: 'amin',     period: null },
    { href: 'calendar.html',             icon: '📅', label: 'التقويم',         key: 'calendar', period: null },
    { href: 'zakat.html',                icon: '💰', label: 'حساب الزكاة',     key: 'zakat',    period: null },
  ];

  // ===== تحديد الصفحة الحالية =====
  function getCurrentKey() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const params = new URLSearchParams(location.search);
    const type = params.get('type');

    if (path === '' || path === 'index.html') return 'home';
    if (path === 'quran.html' || path === 'surah.html') return 'quran';
    if (path === 'athkar.html') {
      if (type === 'morning') return 'morning';
      if (type === 'evening') return 'evening';
      if (type === 'hearts') return 'hearts';
      if (type === 'sleep') return 'sleep';
      return 'morning';
    }
    if (path === 'prayer.html' || path === 'prayer-settings.html') return 'prayer';
    if (path === 'tasbih.html') return 'tasbih';
    if (path === 'amin.html') return 'amin';
    if (path === 'calendar.html') return 'calendar';
    if (path === 'zakat.html') return 'zakat';
    return null;
  }

  // ===== بناء الشريط =====
  function buildTopNav() {
    const current = getCurrentKey();

    const itemsHTML = TOP_NAV_ITEMS.map(item => {
      const active = item.key === current ? ' active' : '';
      const periodAttr = item.period ? ` data-period="${item.period}"` : '';
      const ico = item.icon ? `${item.icon} ` : '';
      return `<a href="${item.href}" class="chip${active}"${periodAttr}>${ico}${item.label}</a>`;
    }).join('');

    return `<nav class="chips top-nav" role="navigation" aria-label="التنقل العلوي">${itemsHTML}</nav>`;
  }

  // ===== حقن الشريط =====
  function injectTopNav() {
    // إذا كانت الصفحة ممنوعة من إظهار الشريط
    if (document.body.dataset.hideTopnav === 'true') return;

    // ابحث عن عنصر الحقن (data-topnav-target)
    let target = document.querySelector('[data-topnav-target]');

    // إذا لم يوجد، ضع الشريط بعد .athkar-header أو .title-bar أو في بداية .app
    if (!target) {
      target = document.querySelector('.athkar-header') ||
               document.querySelector('.title-bar') ||
               document.querySelector('.app');
      if (!target) return;

      // إذا كان target هو athkar-header أو title-bar → أضف بعده
      if (target.classList.contains('athkar-header') || target.classList.contains('title-bar')) {
        target.insertAdjacentHTML('afterend', buildTopNav());
        return;
      }
      // إن كان .app → أضف في بدايته
      target.insertAdjacentHTML('afterbegin', buildTopNav());
      return;
    }

    // إذا وُجد عنصر حقن محدد → استبدله
    target.outerHTML = buildTopNav();
  }

  // ===== تشغيل =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTopNav);
  } else {
    injectTopNav();
  }
})();