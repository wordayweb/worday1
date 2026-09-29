/* ============ شريط التنقل السفلي الموحّد ============ */

(function () {
  const NAV_ITEMS = [
    { href: 'index.html',               icon: '🏠', label: 'الرئيسية', key: 'home'   },
    { href: 'quran.html',               icon: '📖', label: 'القرآن',   key: 'quran'  },
    { href: 'athkar.html?type=morning', icon: '📿', label: 'الأذكار',  key: 'athkar' },
    { href: 'prayer.html',              icon: '🕌', label: 'الصلاة',   key: 'prayer' },
    { href: 'more.html',                icon: '⋯',  label: 'المزيد',   key: 'more'   },
  ];

  function getCurrentKey() {
    if (window.WirdiNav && typeof window.WirdiNav.currentKey === 'function') {
      return window.WirdiNav.currentKey();
    }
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '' || path === 'index.html') return 'home';
    if (path === 'quran.html' || path === 'surah.html' || path === 'tafsir.html') return 'quran';
    if (path === 'athkar.html' || path.startsWith('athkar-')) return 'athkar';
    if (path === 'prayer.html' || path === 'prayer-settings.html') return 'prayer';
    return 'more';
  }

  function buildNav() {
    const current = getCurrentKey();

    const itemsHTML = NAV_ITEMS.map(item => {
      const active = item.key === current;
      const ariaCurrent = active ? ' aria-current="page"' : '';
      const cls = active ? 'bn-item active' : 'bn-item';
      return (
        `<a href="${item.href}" class="${cls}"${ariaCurrent}` +
        ` aria-label="${item.label}">` +
        `<span class="ico" aria-hidden="true">${item.icon}</span>` +
        `<span class="lbl">${item.label}</span>` +
        `</a>`
      );
    }).join('');

    return (
      `<nav class="bottom-nav" role="navigation" aria-label="التنقل السفلي">` +
      itemsHTML +
      `</nav>`
    );
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