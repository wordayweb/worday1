/* ============ شريط التنقل الموحّد ============ */

(function () {
  const NAV_ITEMS = [
    { href: 'index.html',               icon: '🏠', label: 'الرئيسية', key: 'home' },
    { href: 'quran.html',               icon: '📖', label: 'القرآن',   key: 'quran' },
    { href: 'athkar.html?type=morning', icon: '📿', label: 'الأذكار',  key: 'athkar' },
    { href: 'prayer.html',              icon: '🕌', label: 'الصلاة',   key: 'prayer' },
    { href: 'more.html',                icon: '⋯',  label: 'المزيد',   key: 'more' },
  ];

  function getCurrentKey() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '' || path === 'index.html') return 'home';
    if (path === 'quran.html' || path === 'surah.html') return 'quran';
    if (path === 'athkar.html') return 'athkar';
    if (path === 'prayer.html' || path === 'prayer-settings.html') return 'prayer';
    return 'more';
  }

  function buildNav() {
    const current = getCurrentKey();
    const itemsHTML = NAV_ITEMS.map(item => {
      const active = item.key === current ? ' active' : '';
      return `<a href="${item.href}" class="bn-item${active}"><span class="ico">${item.icon}</span><span class="lbl">${item.label}</span></a>`;
    }).join('');
    return `<nav class="bottom-nav" role="navigation">${itemsHTML}</nav>`;
  }

  function injectNav() {
    if (document.body.dataset.hideNav === 'true') return;
    document.querySelectorAll('.bottom-nav').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', buildNav());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }
})();