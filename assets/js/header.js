/* ============ الهيدر الموحّد لكل الصفحات (مُطوّر) ============ */

(function () {
  const IS_HOME = (() => {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  })();

  const PRAYER_CACHE_KEY = 'wirdi_prayer_timings';
  const PRAYER_CITY_KEY  = 'wirdi_prayer_city';
  const DEFAULT_CITY     = { lat: 24.7136, lng: 46.6753, name: 'الرياض' };

  // 🔹 الروابط الأساسية (تظهر دائماً في الشريط العلوي)
  const PRIMARY_NAV = [
    { href: 'index.html',          icon: '🏠', label: 'الرئيسية', key: 'home' },
    { href: 'quran.html',          icon: '📖', label: 'القرآن',   key: 'quran' },
    { href: 'athkar-morning.html', icon: '🌅', label: 'الأذكار',  key: 'morning' }, // يغطي الصباح والمساء
    { href: 'prayer.html',         icon: '🕌', label: 'الصلاة',   key: 'prayer' },
  ];

  // 🔹 الروابط الثانوية (تظهر في القائمة المنسدلة)
  const SECONDARY_NAV = [
    { href: 'athkar-daily.html',  icon: '📅', label: 'أذكار اليوم' },
    { href: 'tasbih.html',        icon: '📿', label: 'التسبيح' },
    { href: 'calendar.html',      icon: '🗓️', label: 'التقويم الهجري' },
    { href: 'zakat.html',         icon: '💰', label: 'حاسبة الزكاة' },
    { href: 'tafsir.html',        icon: '📚', label: 'تفسير القرآن' },
    { href: 'salah-method.html',  icon: '🤲', label: 'طريقة الصلاة' },
    { href: 'zad-alquloob.html',  icon: '💖', label: 'زاد القلوب' },
    { href: 'support.html',       icon: '💚', label: 'ادعم وِرْدِي' },
  ];

  function getCurrentKey() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '' || path === 'index.html') return 'home';
    if (path.includes('quran') || path.includes('surah')) return 'quran';
    if (path.includes('athkar')) return 'morning'; // تبسيط للتنقل
    if (path.includes('prayer')) return 'prayer';
    return 'other';
  }

  function buildPrimaryChips() {
    const current = getCurrentKey();
    return PRIMARY_NAV.map(item => {
      const active = item.key === current ? 'active' : '';
      const currentAttr = active ? ' aria-current="page"' : '';
      return `<a href="${item.href}" class="nav-chip ${active}"${currentAttr}>
                <span class="chip-ico">${item.icon}</span>
                <span class="chip-label">${item.label}</span>
              </a>`;
    }).join('');
  }

  function buildSecondaryMenu() {
    return SECONDARY_NAV.map(item => 
      `<a href="${item.href}" class="drawer-link">
         <span class="link-ico">${item.icon}</span>
         <span class="link-text">${item.label}</span>
       </a>`
    ).join('');
  }

  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h >= 4 && h < 12)  return { text: 'صباح مبارك',  icon: '🌅' };
    if (h >= 12 && h < 17) return { text: 'نهار طيب',    icon: '☀️' };
    if (h >= 17 && h < 21) return { text: 'مساء مبارك',  icon: '🌆' };
    return { text: 'ليلة هادئة', icon: '🌙' };
  }

  function buildHeader() {
    const g = getTimeGreeting();
    const isInner = !IS_HOME ? ' inner-page' : '';
    
    return `
      <div class="main-header${isInner}">
        <!-- الشريط العلوي المضغوط -->
        <div class="compact-top-bar">
          <div class="brand-area">
            <img src="assets/img/logo.png" alt="وِرْدِي" class="mini-logo" />
            <div class="brand-text">
              <span class="brand-name">وِرْدِي</span>
              <span class="brand-tagline-mini">رفيقك اليومي</span>
            </div>
          </div>
          <div class="top-actions">
            <button class="icon-btn theme-toggle" id="themeToggle" aria-label="تبديل الوضع الليلي">🌙</button>
            <button class="icon-btn menu-toggle" id="menuToggle" aria-label="فتح القائمة">⋮</button>
          </div>
        </div>

        <!-- قسم الترحيب (يظهر فقط في الرئيسية) -->
        ${IS_HOME ? `
        <div class="hero-greeting">
          <span class="greeting-badge">
            <span class="greeting-ico">${g.icon}</span> ${g.text}
          </span>
        </div>` : ''}

        <!-- شريط التنقل السريع -->
        <nav class="primary-nav" role="navigation" aria-label="التنقل الرئيسي">
          ${buildPrimaryChips()}
        </nav>

        <!-- القائمة الجانبية المنسدلة -->
        <div class="nav-drawer" id="navDrawer" hidden>
          <div class="drawer-backdrop" id="drawerBackdrop"></div>
          <div class="drawer-content">
            <div class="drawer-header">
              <h3>القائمة</h3>
              <button class="icon-btn close-drawer" id="closeDrawer">✕</button>
            </div>
            <div class="drawer-links">
              ${buildSecondaryMenu()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function toAr(s) {
    return String(s).replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][d]);
  }

  function initDrawer() {
    const toggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('navDrawer');
    const close = document.getElementById('closeDrawer');
    const backdrop = document.getElementById('drawerBackdrop');

    function open() { drawer.hidden = false; document.body.style.overflow = 'hidden'; }
    function closeDrawer() { drawer.hidden = true; document.body.style.overflow = ''; }

    if (toggle) toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
  }

  function initThemeToggle() {
    if (window.WirdiTheme) window.WirdiTheme.apply();
  }

  function injectHeader() {
    const target = document.querySelector('[data-header-target]');
    if (!target) return;
    target.innerHTML = buildHeader();
    initDrawer();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();