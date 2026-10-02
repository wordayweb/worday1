/* ============ الهيدر الموحّد المتكامل - مع أوقات الصلاة ============ */

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
        <!-- الصف العلوي: الشعار + التحية + الإجراءات -->
        <div class="header-top">
          <div class="brand-section">
            <img src="assets/img/logo.png" alt="وِرْدِي" class="main-logo" />
            <div class="brand-info">
              <h1 class="brand-title">وِرْدِي</h1>
              <p class="brand-subtitle">رفيقك اليومي لذكر الله</p>
            </div>
          </div>
          
          <div class="header-actions">
            <div class="greeting-badge">
              <span class="greeting-ico">${g.icon}</span>
              <span class="greeting-text">${g.text}</span>
            </div>
            <button class="action-btn theme-btn" id="themeToggle" aria-label="الوضع الليلي">🌙</button>
            <button class="action-btn user-btn" aria-label="حسابي"></button>
          </div>
        </div>

        <!-- القسم الأوسط: التاريخ والساعة وأوقات الصلاة -->
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
          
          <!-- أوقات الصلاة المدمجة في الهيدر -->
          <div class="header-prayer-times" id="headerPrayerTimes">
            <div class="header-prayer-item">
              <span class="header-prayer-name">الفجر</span>
              <span class="header-prayer-time" id="hdrFajr">--:--</span>
            </div>
            <div class="header-prayer-item">
              <span class="header-prayer-name">الظهر</span>
              <span class="header-prayer-time" id="hdrDhuhr">--:--</span>
            </div>
            <div class="header-prayer-item">
              <span class="header-prayer-name">العصر</span>
              <span class="header-prayer-time" id="hdrAsr">--:--</span>
            </div>
            <div class="header-prayer-item">
              <span class="header-prayer-name">المغرب</span>
              <span class="header-prayer-time" id="hdrMaghrib">--:--</span>
            </div>
            <div class="header-prayer-item">
              <span class="header-prayer-name">العشاء</span>
              <span class="header-prayer-time" id="hdrIsha">--:--</span>
            </div>
          </div>
        </div>

        <!-- شريط التنقل -->
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
    const ORDER = [
      { key: 'Fajr', ar: 'الفجر', el: 'hdrFajr' },
      { key: 'Dhuhr', ar: 'الظهر', el: 'hdrDhuhr' },
      { key: 'Asr', ar: 'العصر', el: 'hdrAsr' },
      { key: 'Maghrib', ar: 'المغرب', el: 'hdrMaghrib' },
      { key: 'Isha', ar: 'العشاء', el: 'hdrIsha' }
    ];

    function update() {
      const cached = readCachedTimings();
      
      if (!cached) {
        fetchAndCachePrayerTimings().then(t => {
          if (t) displayPrayerTimes(t);
        });
        return;
      }
      
      displayPrayerTimes(cached);
    }

    function displayPrayerTimes(timings) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      let nextKey = null;

      // عرض جميع الأوقات وتحديد القادمة
      ORDER.forEach(p => {
        const el = document.getElementById(p.el);
        if (el && timings[p.key]) {
          const [h, m] = timings[p.key].split(':');
          el.textContent = `${h}:${m}`;
          
          // تحديد الصلاة القادمة
          const tMin = parseInt(h, 10) * 60 + parseInt(m, 10);
          if (tMin > nowMin && !nextKey) {
            nextKey = p.key;
          }
        }
      });

      // تمييز الصلاة القادمة
      ORDER.forEach(p => {
        const item = document.getElementById(p.el)?.parentElement;
        if (item) {
          if (p.key === nextKey) {
            item.classList.add('next');
          } else {
            item.classList.remove('next');
          }
        }
      });

      // إذا انتهت كل صلوات اليوم، القادمة هي الفجر
      if (!nextKey) {
        const fajrItem = document.getElementById('hdrFajr')?.parentElement;
        if (fajrItem) fajrItem.classList.add('next');
      }
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