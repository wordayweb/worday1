/* ============ نظام الأذكار الذكية بالتوقيت ============ */

const SMART = {
  times: null,
  period: null,
  remaining: 0,
};

/* ---------- قراءة مواقيت الصلاة ---------- */
function getStoredTimings() {
  const settings = LS.get('prayer_settings', null);
  if (!settings || !settings.lat) return null;

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;
  const cacheKey = `prayer_times_cache_${dateStr}_${settings.lat.toFixed(3)}_${settings.lng.toFixed(3)}_${settings.method}_${settings.school}`;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;
  try { return JSON.parse(cached); } catch { return null; }
}

/* ---------- قراءة الأذكار من المحتوى المحفوظ ---------- */
function getAdhkarForPeriod(period) {
  const FALLBACK = {
    morning: [
      { text: 'أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ، اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...', count: 1 },
      { text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۞ ٱللَّهُ ٱلصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ', count: 3 },
      { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ', count: 1 },
      { text: 'اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ، خَلَقْتَنـي وَأَنا عَبْـدُك...', count: 1 },
      { text: 'رَضيـتُ بِاللهِ رَبَّـاً وَبِالإسْلامِ ديـناً وَبِمُحَـمَّدٍ نَبِيّـاً.', count: 3 },
      { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.', count: 100 },
    ],
    evening: [
      { text: 'أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ، اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...', count: 1 },
      { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ', count: 1 },
      { text: 'اللّهـمَّ بِكَ أَمْسَـينَا وَبِكَ أَصْـبَحْنَا، وَبِكَ نَحْـيَا وَبِكَ نَمُـوتُ', count: 1 },
      { text: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ', count: 3 },
      { text: 'اللّهُـمَّ عافِـني في بَدَنـي، اللّهُـمَّ عافِـني في سَمْـعي', count: 3 },
      { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.', count: 100 },
    ],
  };

  const content = LS.get('wirdi_content', null);
  if (content && content[period] && content[period].length) {
    return content[period]
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 6);
  }
  return FALLBACK[period].slice(0, 6);
}

/* ---------- أدوات ---------- */
function timeToMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}
function fmtRemaining(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${toAr(m)} دقيقة`;
  if (m === 0) return `${toAr(h)} ساعة`;
  return `${toAr(h)} ساعة و ${toAr(m)} دقيقة`;
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ---------- تحديد الفترة ---------- */
function computePeriod(timings) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const fajr = timeToMin(timings.Fajr);
  const asr  = timeToMin(timings.Asr);

  if (nowMin >= fajr && nowMin < asr) {
    return {
      period: 'morning',
      title: 'أذكار الصباح',
      icon: '🌅',
      greeting: 'صباح مبارك',
      type: 'morning',
      remaining: asr - nowMin,
    };
  }
  const remain = nowMin < fajr
    ? fajr - nowMin
    : (24 * 60 - nowMin) + fajr;
  return {
    period: 'evening',
    title: 'أذكار المساء',
    icon: '🌆',
    greeting: 'مساء مبارك',
    type: 'evening',
    remaining: remain,
  };
}

/* ---------- بناء البطاقة الذكية ---------- */
function renderSmartHero() {
  const box = document.getElementById('smartHero');
  if (!box) return;

  if (!SMART.times) {
    const h = new Date().getHours();
    const guessed = (h >= 5 && h < 15) ? 'morning' : 'evening';
    const p = {
      period: guessed,
      title: guessed === 'morning' ? 'أذكار الصباح' : 'أذكار المساء',
      icon: guessed === 'morning' ? '🌅' : '🌆',
      greeting: guessed === 'morning' ? 'صباح مبارك' : 'مساء مبارك',
      type: guessed,
      remaining: 0,
    };
    box.dataset.period = p.period;
    box.innerHTML = buildHeroHTML(p, true);
    return;
  }

  box.dataset.period = SMART.period.period;
  box.innerHTML = buildHeroHTML(SMART.period, false);
}

/* ---------- HTML البطاقة ---------- */
function buildHeroHTML(p, noTimes) {
  const now = new Date();
  const nowStr = toAr(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));

  const adhkar = getAdhkarForPeriod(p.period);

  const adhkarHTML = adhkar.map((thikr, i) => {
    const text = escapeHtml(thikr.text);
    const shortText = text.length > 100 ? text.slice(0, 100) + '…' : text;
    const countBadge = thikr.count && thikr.count > 1
      ? `<span class="ha-count">✕${toAr(thikr.count)}</span>`
      : '';

    return `
      <div class="hero-adhkar-item">
        <span class="ha-num">${toAr(i + 1)}</span>
        <span class="ha-text">${shortText}</span>
        ${countBadge}
      </div>
    `;
  }).join('');

  const timeRow = noTimes
    ? `<div class="hero-time">
         <span class="time-hint">📍 حدّد موقعك لعرض الأوقات</span>
       </div>`
    : `<div class="hero-time">
         <span class="time-now">🕐 ${nowStr}</span>
         <span class="time-left">⏳ يتبقى ${fmtRemaining(p.remaining)}</span>
       </div>`;

  const cta = noTimes
    ? `<a href="prayer-settings.html" class="hero-cta">📍 تحديد الموقع</a>`
    : `<a href="athkar.html?type=${p.type}" class="hero-cta">▶ ابدأ ${p.title}</a>`;

  return `
    <div class="hero-top">
      <div class="hero-icon">${p.icon}</div>
      <h3 class="hero-title">${p.greeting}</h3>
      <p class="hero-sub">${p.title}</p>
    </div>

    ${timeRow}

    <div class="hero-adhkar">
      <div class="hero-adhkar-head">
        <span>📿 من أذكار ${p.title.replace('أذكار ', '')}</span>
      </div>
      ${adhkarHTML}
    </div>

    ${cta}
  `;
}

/* ---------- تمييز الشرائح ---------- */
function highlightChips() {
  if (!SMART.period) return;
  document.querySelectorAll('.chip[data-period]').forEach(el => {
    el.classList.toggle('active-period', el.dataset.period === SMART.period.period);
  });
  document.querySelectorAll('.sec-card[data-period]').forEach(el => {
    el.classList.toggle('active-period', el.dataset.period === SMART.period.period);
  });
}

/* ---------- التحديث الدوري ---------- */
function startSmartTimer() {
  if (!SMART.times) return;
  setInterval(() => {
    const newPeriod = computePeriod(SMART.times);
    if (newPeriod.period !== SMART.period.period) {
      location.reload();
      return;
    }
    SMART.period = newPeriod;
    const timeLeft = document.querySelector('.time-left');
    const timeNow = document.querySelector('.time-now');
    if (timeLeft) timeLeft.textContent = `⏳ يتبقى ${fmtRemaining(newPeriod.remaining)}`;
    if (timeNow) {
      const now = new Date();
      timeNow.textContent = `🕐 ${toAr(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }))}`;
    }
  }, 30000);
}

/* ---------- الدالة الرئيسية ---------- */
function initSmartAdhkar() {
  const timings = getStoredTimings();
  SMART.times = timings;

  if (timings) {
    SMART.period = computePeriod(timings);
    renderSmartHero();
    highlightChips();
    startSmartTimer();
  } else {
    const h = new Date().getHours();
    SMART.period = {
      period: (h >= 5 && h < 15) ? 'morning' : 'evening',
      title: (h >= 5 && h < 15) ? 'أذكار الصباح' : 'أذكار المساء',
      icon: (h >= 5 && h < 15) ? '🌅' : '🌆',
      greeting: (h >= 5 && h < 15) ? 'صباح مبارك' : 'مساء مبارك',
      type: (h >= 5 && h < 15) ? 'morning' : 'evening',
      remaining: 0,
    };
    renderSmartHero();
    highlightChips();
  }
}

/* ---------- تصدير ---------- */
window.getCurrentAdhkarPeriod = function () {
  const t = getStoredTimings();
  if (!t) {
    const h = new Date().getHours();
    return (h >= 5 && h < 15) ? 'morning' : 'evening';
  }
  return computePeriod(t).period;
};

document.addEventListener('DOMContentLoaded', initSmartAdhkar);