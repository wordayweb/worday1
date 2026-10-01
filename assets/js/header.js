/* ============ الهيدر الموحّد المتجاوب ============ */

(function () {
  const IS_HOME = (() => {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  })();

  const ALL_NAV_ITEMS = [
    { href: 'index.html',          icon: '🏠', label: 'الرئيسية',    key: 'home',    priority: 1 },
    { href: 'quran.html',          icon: '📖', label: 'القرآن',      key: 'quran',   priority: 1 },
    { href: 'athkar-morning.html', icon: '🌅', label: 'أذكار الصباح',key: 'morning', priority: 1 },
    { href: 'athkar-evening.html', icon: '🌆', label: 'أذكار المساء',key: 'evening', priority: 1 },
    { href: 'prayer.html',         icon: '🕌', label: 'مواقيت الصلاة',key: 'prayer', priority: 1 },
    { href: 'tasbih.html',         icon: '📿', label: 'التسبيح',     key: 'tasbih',  priority: 2 },
    { href: 'salah-method.html',   icon: '🤲', label: 'طريقة الصلاة',key: 'salah',  priority: 2 },
    { href: 'tafsir.html',         icon: '📚', label: 'التفسير',     key: 'tafsir',  priority: 2 },
    { href: 'calendar.html',       icon: '📅', label: 'التقويم',     key: 'calendar',priority: 2 },
    { href: 'zakat.html',          icon: '💰', label: 'الزكاة',      key: 'zakat',   priority: 2 },
    { href: 'zad-alquloob.html',   icon: '', label: 'زاد القلوب',  key: 'zad',     priority: 2 },
    { href: 'support.html',        icon: '💚', label: 'ادعمنا',      key: 'support', priority: 2 },
  ];

  function getCurrentKey() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '' || path === 'index.html') return 'home';
    if (path.includes('quran')) return 'quran';
    if (path.includes('morning')) return 'morning';
    if (path.includes('evening')) return 'evening';
    if (path.includes('prayer')) return 'prayer';
    if (path.includes('tasbih')) return 'tasbih';
    if (path.includes('salah-method')) return 'salah';
    if (path.includes('tafsir')) return 'tafsir';
    if (path.includes('calendar')) return 'calendar';
    if (path.includes('zakat')) return 'zakat';
    if (path.includes('zad')) return 'zad';
    if (path.includes('support')) return 'support';
    return 'other';
  }

  function buildDesktopNav() {
    const current = getCurrentKey();
    // على الكمبيوتر: نعرض الأولويات 1 فقط في الشريط الرئيسي
    const primaryItems = ALL_NAV_ITEMS.filter(i => i.priority === 1);
    
    return primaryItems.map(item => {
      const active = item.key === current ? 'active' : '';
      return `<a href="${item.href}" class="desktop-nav-link ${active}">
                <span class="nav-ico">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
              </a>`;
    }).join('');
  }

  function buildMobileMenu() {
    const current = getCurrentKey();
    return ALL_NAV_ITEMS.map(item => {
      const active = item.key === current ? 'active' : '';
      return `<a href="${item.href}" class="mobile-nav-link ${active}">
                <span class="link-ico">${item.icon}</span>
                <span class="link-text">${item.label}</span>
              </a>`;
    }).join('');
  }

  function buildHeader() {
    return `
      <div class="responsive-header">
        <!-- الشريط العلوي -->
        <div class="top-bar">
          <div class="brand-section">
            <img src="assets/img/logo.png" alt="وِرْدِي" class="header-logo" />
            <div class="brand-info">
              <span class="brand-name">وِرْدِي</span>
              ${IS_HOME ? '<span class="brand-tagline">رفيقك اليومي</span>' : ''}
            </div>
          </div>
          
          <div class="header-actions">
            <button class="icon-btn theme-toggle" id="themeToggle" aria-label="الوضع الليلي">🌙</button>
            <button class="menu-toggle-btn" id="menuToggle" aria-label="القائمة">
              <span class="hamburger-icon">☰</span>
              <span class="menu-label">القائمة</span>
            </button>
          </div>
        </div>

        <!-- التنقل للكمبيوتر (يظهر فقط على الشاشات الكبيرة) -->
        <nav class="desktop-nav" role="navigation">
          ${buildDesktopNav()}
        </nav>

        <!-- القائمة المنزلاقة للجوال -->
        <div class="mobile-menu-overlay" id="mobileMenu" hidden>
          <div class="mobile-menu-backdrop" id="menuBackdrop"></div>
          <div class="mobile-menu-content">
            <div class="mobile-menu-header">
              <h3>القائمة الرئيسية</h3>
              <button class="close-menu-btn" id="closeMenu">✕</button>
            </div>
            <div class="mobile-nav-items">
              ${buildMobileMenu()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('closeMenu');
    const backdrop = document.getElementById('menuBackdrop');

    function openMenu() {
      menu.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.hidden = true;
      document.body.style.overflow = '';
    }

    if (toggle) toggle.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    
    // إغلاق القائمة عند الضغط على ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
    });
  }

  function injectHeader() {
    const target = document.querySelector('[data-header-target]');
    if (!target) return;
    target.innerHTML = buildHeader();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();