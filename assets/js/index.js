/* ============ الصفحة الرئيسية — وِرْدِي ============ */

(function () {
  'use strict';

  /* ============================================================
     🕐 التحية الزمنية
     ============================================================ */
  function updateGreeting() {
    const el = document.getElementById('greeting-text');
    const ico = document.getElementById('greeting-ico');
    if (!el || !ico) return;

    const h = new Date().getHours();
    let text, icon;

    if (h >= 4 && h < 12) {
      text = 'صباح مبارك';
      icon = '';
    } else if (h >= 12 && h < 17) {
      text = 'نهار طيب';
      icon = '☀️';
    } else if (h >= 17 && h < 21) {
      text = 'مساء مبارك';
      icon = '🌆';
    } else {
      text = 'ليلة هادئة';
      icon = '🌙';
    }

    el.textContent = text;
    ico.textContent = icon;
  }

  /* ============================================================
      التاريخ والساعة
     ============================================================ */
  function updateDateTime() {
    const gregEl = document.getElementById('greg-date');
    const hijriEl = document.getElementById('hijri-date');
    const clockEl = document.getElementById('live-clock');

    const now = new Date();

    if (gregEl) {
      gregEl.textContent = new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long'
      }).format(now);
    }

    if (hijriEl) {
      try {
        hijriEl.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(now) + ' هـ';
      } catch (e) {
        hijriEl.textContent = '—';
      }
    }

    if (clockEl) {
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;
      clockEl.textContent = toArabicNumerals(timeStr);
    }
  }

  function toArabicNumerals(str) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(str).replace(/[0-9]/g, d => arabicDigits[d]);
  }

  /* ============================================================
     🕌 بطاقة مواقيت الصلاة المصغرة (الصفحة الرئيسية) — مُصلح
     ============================================================ */
  function initMiniPrayerWidget() {
    const PRAYER_NAMES = {
      Fajr: { ar: 'الفجر' },
      Sunrise: { ar: 'الشروق' },
      Dhuhr: { ar: 'الظهر' },
      Asr: { ar: 'العصر' },
      Maghrib: { ar: 'المغرب' },
      Isha: { ar: 'العشاء' }
    };
    const ORDERED = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    const toAr = (s) => String(s).replace(/[0-9]/g, d => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][d]);
    const fmt12 = (t) => {
      const [h, m] = t.split(':').map(Number);
      return toAr(`${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'م' : 'ص'}`);
    };
    const timeToMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const settings = JSON.parse(localStorage.getItem('prayer_settings') || '{"lat":24.7136,"lng":46.6753,"cityName":"الرياض"}');
    const cityEl = document.getElementById('mpcCity');
    if (cityEl) cityEl.textContent = settings.cityName || 'موقعك';

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    const cacheKey = `prayer_times_cache_${dateStr}_${(settings.lat || 0).toFixed(3)}_${(settings.lng || 0).toFixed(3)}`;

    let countdownTimer = null;

    const renderWidget = (timings) => {
      const list = document.getElementById('mpcTimesList');
      if (!list) return;
      list.innerHTML = '';

      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      // ✅ إصلاح: تحديد الصلاة القادمة بشكل صحيح
      let nextKey = null;
      for (const key of ORDERED) {
        const tSec = timeToMin(timings[key]) * 60;
        if (tSec > nowSec) {
          nextKey = key;
          break;
        }
      }
      if (!nextKey) nextKey = 'Fajr';

      ORDERED.forEach(key => {
        const div = document.createElement('div');
        // ✅ تمييز الصلاة القادمة فقط
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
          if (tSec > nowSec) {
            targetSec = tSec;
            found = true;
            break;
          }
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
      try {
        renderWidget(JSON.parse(cached));
        return;
      } catch (e) {}
    }

    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${settings.lat}&longitude=${settings.lng}&method=4&school=0`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          const t = data.data.timings;
          const result = {
            Fajr: t.Fajr,
            Sunrise: t.Sunrise,
            Dhuhr: t.Dhuhr,
            Asr: t.Asr,
            Maghrib: t.Maghrib,
            Isha: t.Isha
          };
          localStorage.setItem(cacheKey, JSON.stringify(result));
          renderWidget(result);
        }
      })
      .catch(() => {
        if (cityEl) cityEl.textContent = 'تعذّر الجلب';
      });
  }

  /* ============================================================
     🚀 التهيئة عند تحميل الصفحة
     ============================================================ */
  function init() {
    updateGreeting();
    updateDateTime();
    initMiniPrayerWidget();

    setInterval(updateDateTime, 30000);
    setInterval(updateGreeting, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();