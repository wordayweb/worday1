/* ============ الهيدر الموحّد - نسخة عربية ============ */

(function () {
  const IS_HOME = (() => {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  })();

  const PRAYER_CACHE_KEY = 'wirdi_prayer_timings';
  const PRAYER_CITY_KEY = 'wirdi_prayer_city';
  const DEFAULT_CITY = { lat: 24.7136, lng: 46.6753, name: 'الرياض' };

  const ALL_NAV_ITEMS = [
    { href: 'index.html',          icon: '🏠', label: 'الرئيسية',     key: 'home' },
    { href: 'quran.html',          icon: '📖', label: 'القرآن الكريم', key: 'quran' },
    { href: 'athkar-morning.html', icon: '🌅', label: 'أذكار الصباح', key: 'morning' },
    { href: 'athkar-evening.html', icon: '', label: 'أذكار المساء', key: 'evening' },
    { href: 'prayer.html',         icon: '🕌', label: 'مواقيت الصلاة', key: 'prayer' },
    { href: 'tasbih.html',         icon: '📿', label: 'التسبيح',      key: 'tasbih' },
    { href: 'salah-method.html',   icon: '🤲', label: 'طريقة الصلاة', key: 'salah' },
    { href: 'tafsir.html',         icon: '📚', label: 'التفسير',      key: 'tafsir' },
    { href: 'calendar.html',       icon: '📅', label: 'التقويم',      key: 'calendar' },
    { href: 'zakat.html',          icon: '💰', label: 'الزكاة',      key: 'zakat' },
    { href: 'zad-alquloob.html',   icon: '💖', label: 'زاد القلوب',  key: 'zad' },
    { href: 'support.html',        icon: '💚', label: 'ادعم وِرْدِي', key: 'support' },
  ];

  const NAV_BAR_ITEMS = [
    { href: 'index.html',          label: 'الرئيسية',     key: 'home' },
    { href: 'quran.html',          label: 'القرآن',       key: 'quran' },
    { href: 'athkar-morning.html', label: 'أذكار الصباح', key: 'morning' },
    { href: 'athkar-evening.html', label: 'أذكار المساء', key: 'evening' },
    { href: 'prayer.html',         label: 'مواقيت الصلاة', key: 'prayer' },
    { href: 'tasbih.html',         label: 'التسبيح',      key: 'tasbih' },
    { href: 'salah-method.html',   label: 'طريقة الصلاة', key: 'salah' },
    { href: 'tafsir.html',         label: 'التفسير',      key: 'tafsir' },
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

  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h >= 4 && h < 12)  return { text: 'صباح مبارك',  icon: '' };
    if (h >= 12 && h < 17) return { text: 'نهار طيب',    icon: '️' };
    if (h >= 17 && h < 21) return { text: 'مساء مبارك',  icon: '🌆' };
    return { text: 'ليلة هادئة', icon: '🌙' };
  }

  function toAr(s) {
    return String(s).replace(/[0-9]/g, d => ['٠','١','٢','','٤','٥','٦','','٨','٩'][d]);
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  async function fetchAndCachePrayerTimings() {
    let city = DEFAULT_CITY;
    try {
      const saved = localStorage.getItem(PRAYER_CITY_KEY);
      if (saved) {
        const obj = JSON.parse(saved);
        if (obj && typeof obj.lat === 'number') city = obj;
      }
    } catch (e) {}

    const today = todayKey();
    const url = 'https://api.aladhan.com/v1/timings/' + today +
      '?latitude=' + city.lat + '&longitude=' + city.lng + '&method=4';

    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.data || !data.data.timings) return null;

      const raw = data.data.timings;
      const clean = {
        Fajr: raw.Fajr, Sunrise: raw.Sunrise, Dhuhr: raw.Dhuhr,
        Asr: raw.Asr, Maghrib: raw.Maghrib, Isha: raw.Isha
      };

      localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify({
        date: today, city: city.name || 'الرياض', timings: clean
      }));
      return clean;
    } catch (e) { return null; }
  }

  function readCachedTimings() {
    try {
      const raw = localStorage.getItem(PRAYER_CACHE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || obj.date !== todayKey() || !obj.timings) return null;
      return obj.timings;
    } catch (e) { return null; }
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

  function buildNavBar() {
    const current = getCurrentKey();
    return NAV_BAR_ITEMS.map(item => {
      const active = item.key === current ? 'active' : '';
      return `<a href="${item.href}" class="nav-bar-link ${active}">${item.label}</a>`;
    }).join('');
  }

  function buildHeader() {
    const g = getTimeGreeting();
    
    return `
      <div class="unified-header">
        <!-- الصف العلوي: الشعار + الوضع الليلي + المستخدم -->
        <div class="header-top">
          <div class="brand-section">
            <img src="assets/img/logo.png" alt="وِرْدِي" class="main-logo" />
            <div class="brand-info">
              <h1 class="brand-title">وِرْدِي</h1>
              <p class="brand-subtitle">رفيقك اليومي لذكر الله</p>
            </div>
          </div>
          
          <div class="header-actions">
            <button class="action-btn theme-btn" id="themeToggle" aria-label="الوضع الليلي"></button>
            <button class="action-btn user-btn" aria-label="حسابي">👤</button>
          </div>
        </div>

        <!-- الشريط الأخضر: التاريخ والساعة والصلاة -->
        <div class="header-info-bar">
          <div class="info-item">
            <span class="info-ico">📅</span>
            <span id="gregDate" class="info-text">...</span>
          </div>
          <span class="info-sep">•</span>
          <div class="info-item">
            <span class="info-ico">🕌</span>
            <span id="hijriDate" class="info-text">...</span>
          </div>
          <span class="info-sep">•</span>
          <div class="info-item">
            <span class="info-ico">🕐</span>
            <span id="liveClock" class="info-text clock-text">00:00</span>
          </div>
          <span class="info-sep">•</span>
          <div class="info-item prayer-next">
            <span class="info-ico">🕌</span>
            <span id="nextPrayerTxt" class="info-text">—</span>
          </div>
        </div>

        <!-- شريط التنقل + زر القائمة -->
        <nav class="nav-bar-wrapper">
          <nav class="nav-bar" role="navigation" aria-label="التنقل الرئيسي">
            ${buildNavBar()}
          </nav>
          <button class="menu-btn" id="menuToggle" aria-label="القائمة">
            <span class="hamburger">☰</span>
            <span class="menu-text">القائمة</span>
          </button>
        </nav>

        <!-- القائمة المنزلاقة -->
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

  function initDatesAndClock() {
    const hijriEl = document.getElementById('hijriDate');
    const gregEl = document.getElementById('gregDate');
    const clockEl = document.getElementById('liveClock');
    const d = new Date();

    try {
      if (gregEl) {
        gregEl.textContent = new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long' }).format(d);
      }
      if (hijriEl) {
        hijriEl.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
          day: 'numeric', month: 'long', year: 'numeric'
        }).format(d) + ' هـ';
      }
    } catch (e) { console.error(e); }

    if (clockEl) {
      const tick = function () {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = toAr(hh + ':' + mm);
      };
      tick();
      setInterval(tick, 30000);
    }
  }

  function initNextPrayer() {
    const txt = document.getElementById('nextPrayerTxt');
    if (!txt) return;

    const ORDER = [
      { key: 'Fajr', ar: 'الفجر' },
      { key: 'Dhuhr', ar: 'الظهر' },
      { key: 'Asr', ar: 'العصر' },
      { key: 'Maghrib', ar: 'المغرب' },
      { key: 'Isha', ar: 'العشاء' }
    ];

    function update() {
      const cached = readCachedTimings();
      
      if (!cached) {
        txt.textContent = '—';
        fetchAndCachePrayerTimings().then(t => {
          if (t) computeAndDisplay(t);
        });
        return;
      }
      
      computeAndDisplay(cached);
    }

    function computeAndDisplay(timings) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      
      for (let p of ORDER) {
        const t = timings[p.key];
        if (!t) continue;
        const parts = t.split(':');
        const tMin = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (tMin > nowMin) {
          const diff = tMin - nowMin;
          const h = Math.floor(diff / 60);
          const m = diff % 60;
          txt.textContent = `${p.ar} بعد ${h > 0 ? toAr(h) + ' س ' : ''}${toAr(m)} د`;
          return;
        }
      }
      txt.textContent = 'الفجر غداً';
    }

    update();
    setInterval(update, 60000);
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
  }

  function injectHeader() {
    const target = document.querySelector('[data-header-target]');
    if (!target) return;
    target.innerHTML = buildHeader();
    initDatesAndClock();
    initNextPrayer();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();