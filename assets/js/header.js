/* ============ الهيدر الموحّد لكل الصفحات ============ */

(function () {
  const IS_HOME = (() => {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  })();

  const PRAYER_CACHE_KEY = 'wirdi_prayer_timings';
  const PRAYER_CITY_KEY  = 'wirdi_prayer_city';
  const DEFAULT_CITY     = { lat: 24.7136, lng: 46.6753, name: 'الرياض' };

  const TOP_NAV_ITEMS = [
    { href: 'index.html',           icon: '🏠', label: 'رئيسية',         key: 'home',    period: null },
    { href: 'quran.html',           icon: '📖', label: 'القرآن',         key: 'quran',   period: null },
    { href: 'athkar-morning.html',  icon: '🌅', label: 'أذكار الصباح',   key: 'morning', period: 'morning' },
    { href: 'athkar-evening.html',  icon: '🌆', label: 'أذكار المساء',   key: 'evening', period: 'evening' },
    { href: 'athkar-daily.html',    icon: '📅', label: 'أذكار اليوم',    key: 'daily',   period: null },
    { href: 'prayer.html',          icon: '🕌', label: 'مواقيت الصلاة',  key: 'prayer',  period: null },
    { href: 'tasbih.html',          icon: '📿', label: 'التسبيح',        key: 'tasbih',  period: null },
    { href: 'amin.html',            icon: '👑', label: 'وِرْدِي الأمين', key: 'amin',    period: null },
    { href: 'calendar.html',        icon: '📅', label: 'التقويم',        key: 'calendar', period: null },
    { href: 'zakat.html',           icon: '💰', label: 'حساب الزكاة',    key: 'zakat',   period: null },
    { href: 'tafsir.html',          icon: '📖', label: 'تفسير القرآن',   key: 'tafsir',  period: null },
    { href: 'support.html',         icon: '💚', label: 'ادعمنا',         key: 'support', period: null },
  ];

  const PRIMARY_CHIPS = ['home', 'quran', 'morning', 'evening', 'prayer'];

  function getCurrentKey() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '' || path === 'index.html') return 'home';
    if (path === 'quran.html' || path === 'surah.html') return 'quran';
    if (path === 'athkar-morning.html') return 'morning';
    if (path === 'athkar-evening.html') return 'evening';
    if (path === 'athkar-daily.html')   return 'daily';
    if (path === 'athkar.html') return 'morning';
    if (path === 'prayer.html' || path === 'prayer-settings.html') return 'prayer';
    if (path === 'tasbih.html') return 'tasbih';
    if (path === 'amin.html') return 'amin';
    if (path === 'calendar.html') return 'calendar';
    if (path === 'zakat.html') return 'zakat';
    if (path === 'tafsir.html') return 'tafsir';
    if (path === 'support.html') return 'support';
    if (path === 'notifications.html') return 'notifications';
    return null;
  }

  function buildChips() {
    const current = getCurrentKey();
    return TOP_NAV_ITEMS.map(item => {
      const active = item.key === current;
      const cls = active ? 'chip active' : 'chip';
      const periodAttr = item.period ? ` data-period="${item.period}"` : '';
      const currentAttr = active ? ' aria-current="page"' : '';
      const ico = item.icon ? `<span aria-hidden="true">${item.icon}</span> ` : '';
      return `<a href="${item.href}" class="${cls}"${periodAttr}${currentAttr} aria-label="${item.label}">${ico}${item.label}</a>`;
    }).join('');
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
    return '' +
      '<div class="main-header">' +
        '<div class="greeting-block">' +
          '<span class="greeting-txt">' +
            '<span class="greeting-ico" aria-hidden="true">' + g.icon + '</span> ' + g.text +
          '</span>' +
        '</div>' +

        '<div class="top-logo">' +
          '<img src="assets/img/logo.png" alt="شعار وِرْدِي" />' +
        '</div>' +

        '<div class="title-block">' +
          '<h1 class="main-title">وِرْدِي</h1>' +
          '<p class="brand-tagline">رفيقك اليومي لذكر الله</p>' +
          '<div class="title-divider"></div>' +
        '</div>' +

        '<div class="lang-bar">' +
          '<button class="lang-btn" id="langAr" type="button" aria-label="التبديل إلى العربية">العربية</button>' +
          '<span class="lang-sep" aria-hidden="true">•</span>' +
          '<button class="lang-btn" id="langEn" type="button" aria-label="Switch to English">English</button>' +
          '<span class="lang-sep" aria-hidden="true">•</span>' +
          '<button class="lang-btn theme-toggle" id="themeToggle" type="button" aria-label="تبديل الوضع الليلي" aria-pressed="false" title="تبديل الوضع الليلي">🌙</button>' +
        '</div>' +

        '<div class="datetime-line">' +
          '<p class="date-line">' +
            '<span class="dt-item"><span class="dt-ico" aria-hidden="true">📅</span><span id="gregDate">…</span></span>' +
            '<span class="dot" aria-hidden="true">•</span>' +
            '<span class="dt-item"><span class="dt-ico" aria-hidden="true">🕌</span><span id="hijriDate">…</span></span>' +
          '</p>' +
          '<p class="clock-line">' +
            '<span class="dt-item"><span class="clock-ico" aria-hidden="true">🕐</span><span id="liveClock">00:00</span></span>' +
            '<span class="dot" aria-hidden="true">•</span>' +
            '<span class="dt-item" id="nextPrayerWrap" hidden>' +
              '<span class="dt-ico" aria-hidden="true">🕌</span>' +
              '<span id="nextPrayerTxt">—</span>' +
            '</span>' +
          '</p>' +
        '</div>' +

        '<nav class="chips top-nav" role="navigation" aria-label="التنقل العلوي">' + buildChips() + '</nav>' +
      '</div>';
  }

  function toAr(s) {
    const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(s).replace(/[0-9]/g, function (d) { return ar[d]; });
  }

  function initDatesAndClock() {
    const hijriEl = document.getElementById('hijriDate');
    const gregEl  = document.getElementById('gregDate');
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
        if (obj && typeof obj.lat === 'number' && typeof obj.lng === 'number') {
          city = obj;
        }
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
        Fajr:    raw.Fajr,
        Sunrise: raw.Sunrise,
        Dhuhr:   raw.Dhuhr,
        Asr:     raw.Asr,
        Maghrib: raw.Maghrib,
        Isha:    raw.Isha
      };

      const payload = { date: today, city: city.name || 'الرياض', timings: clean };
      localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(payload));
      return clean;
    } catch (e) {
      return null;
    }
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

  function initNextPrayer() {
    const wrap = document.getElementById('nextPrayerWrap');
    const txt  = document.getElementById('nextPrayerTxt');
    if (!wrap || !txt) return;

    const ORDER = [
      { key: 'Fajr',    ar: 'الفجر' },
      { key: 'Dhuhr',   ar: 'الظهر' },
      { key: 'Asr',     ar: 'العصر' },
      { key: 'Maghrib', ar: 'المغرب' },
      { key: 'Isha',    ar: 'العشاء' }
    ];

    function computeFromTimings(timings) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      for (let i = 0; i < ORDER.length; i++) {
        const p = ORDER[i];
        const t = timings[p.key];
        if (!t) continue;
        const parts = t.split(':');
        const tMin = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (tMin > nowMin) return { name: p.ar, diff: tMin - nowMin };
      }
      const fajr = timings.Fajr || '05:00';
      const parts = fajr.split(':');
      return { name: 'الفجر', diff: (24 * 60 - nowMin) + parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) };
    }

    function render(timings) {
      const next = computeFromTimings(timings);
      const h = Math.floor(next.diff / 60);
      const m = next.diff % 60;
      const str = h > 0 ? toAr(h) + ' س ' + toAr(m) + ' د' : toAr(m) + ' دقيقة';
      txt.textContent = next.name + ' بعد ' + str;
      wrap.hidden = false;
    }

    function update() {
      const cached = readCachedTimings();
      if (cached) { render(cached); return; }
      wrap.hidden = true;
      fetchAndCachePrayerTimings().then(function (t) { if (t) render(t); });
    }

    update();
    setInterval(update, 60000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) update();
    });
  }

  function initLang() {
    const langAr = document.getElementById('langAr');
    const langEn = document.getElementById('langEn');
    if (!langAr || !langEn) return;
    const saved = localStorage.getItem('wirdi_lang');
    const current = saved ? JSON.parse(saved) : 'ar';
    if (current === 'ar') langAr.classList.add('active');
    else langEn.classList.add('active');
    langAr.addEventListener('click', function () { localStorage.setItem('wirdi_lang', JSON.stringify('ar')); location.reload(); });
    langEn.addEventListener('click', function () { alert('النسخة الإنجليزية قريبًا'); });
  }

  function initThemeToggle() {
    if (window.WirdiTheme) window.WirdiTheme.apply();
  }

  function injectHeader() {
    const target = document.querySelector('[data-header-target]');
    if (!target) return;
    if (!IS_HOME) target.classList.add('inner-page');
    target.innerHTML = buildHeader();
    initDatesAndClock();
    initLang();
    initThemeToggle();
    initNextPrayer();
  }

  window.WirdiNav = { currentKey: getCurrentKey, items: TOP_NAV_ITEMS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();