/* ============ الصفحة الرئيسية — ترتيب ديناميكي + تحسينات ============ */

(function () {
  'use strict';

  function isHome() {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  }

  function moveStreak() {
    if (!isHome()) return;
    const slot = document.getElementById('streakSlot');
    if (!slot) return;
    const streakCard = document.querySelector('.streak-card');
    if (!streakCard) return;
    slot.appendChild(streakCard);
  }

  function addSmartAdhkarMore() {
    if (!isHome()) return;
    const hero = document.getElementById('smartHero');
    if (!hero) return;
    if (hero.querySelector('.smart-more-btn')) return;

    const items = hero.querySelectorAll('li, .adhkar-item, .dhikr-item, .sa-item, [class*="item"]');
    if (!items.length) return;

    const h = new Date().getHours();
    const isEvening = h >= 17 || h < 4;
    const link = isEvening ? 'athkar-evening.html' : 'athkar-morning.html';
    const label = isEvening ? 'عرض كل أذكار المساء' : 'عرض كل أذكار الصباح';

    const btn = document.createElement('a');
    btn.href = link;
    btn.className = 'smart-more-btn';
    btn.setAttribute('aria-label', label);
    btn.innerHTML = '<span>' + label + '</span><span class="arrow" aria-hidden="true">←</span>';

    const last = items[items.length - 1];
    last.parentNode.appendChild(btn);
  }

  function init() {
    if (!isHome()) return;
    moveStreak();
    setTimeout(addSmartAdhkarMore, 900);
    setTimeout(addSmartAdhkarMore, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 700);
    });
  } else {
    setTimeout(init, 700);
  }
  function wrapCardEmojis() {
    const headings = document.querySelectorAll('.sec-card .overlay h4');
    headings.forEach(function (h4) {
      if (h4.querySelector('.card-emoji')) return;
      const html = h4.innerHTML.trim();
      const firstChar = Array.from(html)[0];
      if (!firstChar) return;
      const isEmoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/u.test(firstChar);
      if (!isEmoji) return;
      const rest = html.slice(firstChar.length).trim();
      if (!rest) return;
      h4.innerHTML = '<span class="card-emoji">' + firstChar + '</span><span class="card-title">' + rest + '</span>';
    });
  }

  const _origInit = init;
  init = function () {
    _origInit();
    setTimeout(wrapCardEmojis, 500);
    setTimeout(wrapCardEmojis, 1500);
  };
})();
  /* ============================================================
     🕌 بطاقة مواقيت الصلاة المصغرة (الصفحة الرئيسية)
     ============================================================ */
  function initMiniPrayerWidget() {
    if (!isHome()) return;
    
    const PRAYER_NAMES = { 
      Fajr: { ar: 'الفجر' }, Sunrise: { ar: 'الشروق' }, 
      Dhuhr: { ar: 'الظهر' }, Asr: { ar: 'العصر' }, 
      Maghrib: { ar: 'المغرب' }, Isha: { ar: 'العشاء' } 
    };
    const ORDERED = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    const toAr = (s) => String(s).replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][d]);
    const fmt12 = (t) => {
      const [h, m] = t.split(':').map(Number);
      return toAr(`${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'م' : 'ص'}`);
    };
    const timeToMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

    const settings = JSON.parse(localStorage.getItem('prayer_settings') || '{"lat":24.7136,"lng":46.6753,"cityName":"الرياض"}');
    const cityEl = document.getElementById('mpcCity');
    if (cityEl) cityEl.textContent = settings.cityName || 'موقعك';

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;
    const cacheKey = `prayer_times_cache_${dateStr}_${(settings.lat||0).toFixed(3)}_${(settings.lng||0).toFixed(3)}`;
    
    let countdownTimer = null;

    const renderWidget = (timings) => {
      const list = document.getElementById('mpcTimesList');
      if (!list) return;
      list.innerHTML = '';
      const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
      let nextKey = 'Fajr';
      
      ORDERED.forEach(key => {
        if (timeToMin(timings[key]) > nowMin && nextKey === 'Fajr') nextKey = key;
        const div = document.createElement('div');
        div.className = `mpc-time-item ${key === nextKey ? 'next' : ''}`;
        div.innerHTML = `<span class="mpc-name">${PRAYER_NAMES[key].ar}</span><span class="mpc-val">${fmt12(timings[key])}</span>`;
        list.appendChild(div);
      });

      const nextNameEl = document.getElementById('mpcNextName');
      if (nextNameEl) nextNameEl.textContent = PRAYER_NAMES[nextKey].ar;
      
      const tick = () => {
        const now = new Date();
        const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        let targetSec = 0, found = false;
        for (const key of ORDERED) {
          const [h, m] = timings[key].split(':').map(Number);
          const tSec = h * 3600 + m * 60;
          if (tSec > nowSec) { targetSec = tSec; found = true; break; }
        }
        if (!found) {
          const [h, m] = timings.Fajr.split(':').map(Number);
          targetSec = (24 * 3600) + h * 3600 + m * 60;
        }
        let diff = targetSec - nowSec;
        if (diff < 0) diff = 0;
        const hh = Math.floor(diff / 3600);
        const mm = Math.floor((diff % 3600) / 60);
        const ss = diff % 60;
        
        const hEl = document.getElementById('cdH');
        const mEl = document.getElementById('cdM');
        const sEl = document.getElementById('cdS');
        if (hEl) hEl.textContent = toAr(String(hh).padStart(2, '0'));
        if (mEl) mEl.textContent = toAr(String(mm).padStart(2, '0'));
        if (sEl) sEl.textContent = toAr(String(ss).padStart(2, '0'));
        
        if (diff === 0) setTimeout(() => location.reload(), 2000);
      };
      
      tick();
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = setInterval(tick, 1000);
    };

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try { renderWidget(JSON.parse(cached)); return; } catch(e) {}
    }

    // جلب جديد في حال عدم وجود كاش
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${settings.lat}&longitude=${settings.lng}&method=4&school=0`;
    fetch(url).then(res => res.json()).then(data => {
      if (data.code === 200) {
        const t = data.data.timings;
        const result = { Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha };
        localStorage.setItem(cacheKey, JSON.stringify(result));
        renderWidget(result);
      }
    }).catch(() => {
      if (cityEl) cityEl.textContent = 'تعذّر الجلب';
    });
  }

  // دمج الاستدعاء مع دالة init الموجودة
  const _origInitWidget = init;
  init = function () {
    _origInitWidget();
    setTimeout(initMiniPrayerWidget, 800);
  };
