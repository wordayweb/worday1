/* ============ الهيدر الموحّد لكل الصفحات ============ */

(function () {
  const IS_HOME = (() => {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  })();

  const TOP_NAV_ITEMS = [
    { href: 'index.html',           icon: '',   label: 'رئيسية',          key: 'home',     period: null },
    { href: 'quran.html',           icon: '',   label: 'القرآن الكريم',   key: 'quran',    period: null },
    { href: 'athkar-morning.html',  icon: '🌅', label: 'أذكار الصباح',    key: 'morning',  period: 'morning' },
    { href: 'athkar-evening.html',  icon: '🌆', label: 'أذكار المساء',    key: 'evening',  period: 'evening' },
    { href: 'athkar-daily.html',    icon: '📅', label: 'أذكار اليوم',     key: 'daily',    period: null },
    { href: 'prayer.html',          icon: '🕌', label: 'مواقيت الصلاة',   key: 'prayer',   period: null },
    { href: 'tasbih.html',          icon: '📿', label: 'التسبيح',         key: 'tasbih',   period: null },
    { href: 'amin.html',            icon: '👑', label: 'وِرْدِي الأمين',  key: 'amin',     period: null },
    { href: 'calendar.html',        icon: '📅', label: 'التقويم',         key: 'calendar', period: null },
    { href: 'zakat.html',           icon: '💰', label: 'حساب الزكاة',     key: 'zakat',    period: null },
    { href: 'support.html',         icon: '💚', label: 'ادعمنا',          key: 'support',  period: null },
  ];

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
    if (path === 'support.html') return 'support';
    return null;
  }

  function buildChips() {
    const current = getCurrentKey();
    return TOP_NAV_ITEMS.map(item => {
      const active = item.key === current ? ' active' : '';
      const periodAttr = item.period ? ` data-period="${item.period}"` : '';
      const ico = item.icon ? `${item.icon} ` : '';
      return `<a href="${item.href}" class="chip${active}"${periodAttr}>${ico}${item.label}</a>`;
    }).join('');
  }

  function buildHeader() {
    return `
      <div class="main-header">
        <div class="top-logo">
          <img src="assets/img/logo.png" alt="شعار وِرْدِي الأمين" />
        </div>

        <div class="title-block">
          <h1 class="main-title">وِرْدِي</h1>
          <p class="brand-tagline">رفيقك اليومي لذكر الله</p>
          <div class="title-divider"></div>
        </div>

        <div class="lang-bar">
          <button class="lang-btn" id="langAr" type="button">العربية</button>
          <span class="lang-sep">•</span>
          <button class="lang-btn" id="langEn" type="button">English</button>
          <span class="lang-sep">•</span>
          <button class="lang-btn theme-toggle" id="themeToggle" type="button" aria-label="تبديل الوضع الليلي" title="تبديل الوضع الليلي">🌙</button>
        </div>

        <div class="datetime-line">
          <p class="date-line">
            <span id="hijriDate">…</span>
            <span class="dot">■</span>
            <span id="gregDate">…</span>
            <span class="dot">■</span>
            <span id="weekDay">…</span>
          </p>
          <div class="clock-line">
            <span class="clock-ico">🕐</span>
            <span id="liveClock">00:00:00</span>
          </div>
        </div>

        <nav class="chips top-nav" role="navigation" aria-label="التنقل العلوي">
          ${buildChips()}
        </nav>
      </div>
    `;
  }

  function toAr(s) {
    const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(s).replace(/[0-9]/g, d => ar[d]);
  }

  function initDatesAndClock() {
    const hijriEl = document.getElementById('hijriDate');
    const gregEl  = document.getElementById('gregDate');
    const dayEl   = document.getElementById('weekDay');
    const clockEl = document.getElementById('liveClock');
    const d = new Date();

    try {
      if (hijriEl) {
        hijriEl.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
          day: 'numeric', month: 'long', year: 'numeric'
        }).format(d) + ' هـ';
      }
      if (gregEl) {
        const enFmt = new Intl.DateTimeFormat('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric'
        }).format(d);
        gregEl.textContent = toAr(enFmt) + ' م';
      }
      if (dayEl) {
        dayEl.textContent = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(d);
      }
    } catch (e) { console.error(e); }

    if (clockEl) {
      const tick = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = toAr(`${hh}:${mm}:${ss}`);
      };
      tick();
      setInterval(tick, 1000);
    }
  }

  function initLang() {
    const langAr = document.getElementById('langAr');
    const langEn = document.getElementById('langEn');
    if (!langAr || !langEn) return;

    const saved = localStorage.getItem('wirdi_lang');
    const current = saved ? JSON.parse(saved) : 'ar';
    if (current === 'ar') langAr.classList.add('active');
    else langEn.classList.add('active');

    langAr.addEventListener('click', () => {
      localStorage.setItem('wirdi_lang', JSON.stringify('ar'));
      location.reload();
    });
    langEn.addEventListener('click', () => {
      localStorage.setItem('wirdi_lang', JSON.stringify('en'));
      alert('English version coming soon — النسخة الإنجليزية قريبًا');
      localStorage.setItem('wirdi_lang', JSON.stringify('ar'));
      location.reload();
    });
  }

  /* ============ زر الوضع الليلي ============ */
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    /* قراءة الحالة المحفوظة — نفس المفتاح الذي يستخدمه settings.js */
    const saved = localStorage.getItem('wirdi_dark') || localStorage.getItem('dark');

    let isDark = false;
    if (saved === 'true' || saved === '1' || saved === '"dark"') {
      isDark = true;
    } else if (saved === null) {
      /* احترام تفضيل النظام */
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /* تطبيق الحالة */
    if (isDark) document.body.classList.add('dark');
    btn.textContent = isDark ? '☀️' : '🌙';

    /* التفاعل */
    btn.addEventListener('click', () => {
      const nowDark = document.body.classList.toggle('dark');
      btn.textContent = nowDark ? '☀️' : '🌙';
      localStorage.setItem('wirdi_dark', String(nowDark));
      /* مزامنة مع settings.js القديم */
      localStorage.setItem('dark', String(nowDark));
    });
  }

  function injectHeader() {
    const target = document.querySelector('[data-header-target]');
    if (!target) return;

    if (!IS_HOME) {
      target.classList.add('inner-page');
    }

    target.innerHTML = buildHeader();
    initDatesAndClock();
    initLang();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();