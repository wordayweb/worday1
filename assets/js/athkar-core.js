/* ============ الدوال المشتركة لصفحات الأذكار ============ */

const AK = {
  favKey: 'wirdi_favorites',
  progressKey: 'athkar_progress',
  soundKey: 'athkar_sound_enabled',
  vibrateKey: 'athkar_vibrate_enabled',
  tashkeelKey: 'athkar_tashkeel_enabled',
};

/* ---------- تحويل الأرقام إلى عربية ---------- */
function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}

/* ---------- إزالة التشكيل ---------- */
function stripTashkeel(text) {
  if (!text) return '';
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTashkeelEnabled() {
  const saved = LS.get(AK.tashkeelKey, null);
  return saved !== false;
}

function getDisplayText(text) {
  return isTashkeelEnabled() ? text : stripTashkeel(text);
}

/* ---------- التقدم اليومي ---------- */
function getProgress() {
  const today = new Date().toISOString().slice(0, 10);
  const saved = LS.get(AK.progressKey, {});
  if (saved.date !== today) return { date: today, data: {} };
  return saved;
}
function saveProgress(p) { LS.set(AK.progressKey, p); }

/* ---------- المفضلات ---------- */
function getFavs() { return LS.get(AK.favKey, []); }
function toggleFav(item) {
  const favs = getFavs();
  const idx = favs.findIndex(f => f.text === item.text);
  if (idx !== -1) favs.splice(idx, 1);
  else favs.push({ text: item.text, ref: '', type: 'thikr' });
  LS.set(AK.favKey, favs);
}

/* ---------- إعدادات الصوت والاهتزاز ---------- */
function isSoundEnabled() {
  const saved = LS.get(AK.soundKey, null);
  return saved !== false;
}
function isVibrateEnabled() {
  const saved = LS.get(AK.vibrateKey, null);
  return saved !== false;
}

/* ---------- نغمات ---------- */
function playCompletionChime() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.frequency.value = 880;
    o2.frequency.value = 1320;
    o1.type = 'sine';
    o2.type = 'sine';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.start(); o2.start();
    o1.stop(ctx.currentTime + 0.5);
    o2.stop(ctx.currentTime + 0.5);
  } catch {}
}

function playTickSound() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 1200;
    o.type = 'sine';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.06);
  } catch {}
}

/* ---------- اهتزاز ---------- */
function vibrateTap() {
  if (!isVibrateEnabled()) return;
  if ('vibrate' in navigator) navigator.vibrate(15);
}
function vibrateComplete() {
  if (!isVibrateEnabled()) return;
  if ('vibrate' in navigator) navigator.vibrate([40, 60, 40, 60, 80]);
}

/* ---------- تحديث الحلقة ---------- */
function updateRing(el) {
  const cur = parseInt(el.dataset.current, 10);
  const max = parseInt(el.dataset.max, 10);
  const pct = max ? (cur / max) * 100 : 0;
  const ring = el.querySelector('.counter-ring');
  const txt = el.querySelector('.count-txt');
  const fill = el.querySelector('.thikr-progress-fill');
  if (ring) ring.style.setProperty('--p', pct + '%');
  if (txt) txt.textContent = `${toAr(cur)}/${toAr(max)}`;
  if (fill) fill.style.width = Math.min(pct, 100) + '%';
}

/* ---------- بناء بطاقة ذكر ---------- */
function buildThikrCard(item, index, scope, progress) {
  const key = `${scope}_${item.id || index}`;
  const state = progress.data[key] || { count: 0, done: false };

  const el = document.createElement('article');
  el.className = 'thikr fade-in' + (state.done ? ' done' : '');
  el.dataset.key = key;
  el.dataset.scope = scope;
  el.dataset.max = item.count || 1;
  el.dataset.current = state.count || 0;

  const favs = getFavs();
  const isFav = favs.some(f => f.text === item.text);

  const displayText = getDisplayText(item.text).replace(/\n/g, '<br>');
  const displayFadl = item.fadl ? getDisplayText(item.fadl) : '';

  el.innerHTML = `
    <div class="row-top">
      <div class="num-badge">${toAr(index + 1)}</div>
      <div class="counter-ring">
        <span class="count-txt">${toAr(state.count || 0)}/${toAr(item.count)}</span>
      </div>
      <div class="actions">
        <button class="fav-btn ${isFav ? 'active' : ''}" title="مفضلة">⭐</button>
        <button class="share-btn" title="مشاركة">📤</button>
        <button class="reset-btn" title="تصفير">↺</button>
      </div>
    </div>

    <div class="thikr-hint-bar">
      <span class="hint-ico">👇</span>
      <span class="hint-txt">اضغط للتسبيح</span>
      <span class="hint-count">${toAr(item.count)} مرة</span>
    </div>

    <p class="text">${displayText}</p>

    ${displayFadl ? `<div class="fadl">💡 ${displayFadl}</div>` : ''}

    <div class="thikr-progress">
      <span class="thikr-progress-fill" style="width: ${(state.count || 0) / item.count * 100}%"></span>
    </div>

    <button class="thikr-tap-btn" type="button" aria-label="تسبيح">
      <span class="tap-ripple"></span>
      <span class="tap-ico">📿</span>
      <span class="tap-lbl">سبّح الآن</span>
    </button>
  `;

  updateRing(el);

  const tapElement = () => {
    const cur = parseInt(el.dataset.current, 10);
    const max = parseInt(el.dataset.max, 10);

    if (cur >= max) {
      el.dataset.current = 0;
      el.classList.remove('done');
      updateRing(el);

      const p = getProgress();
      p.data[key] = { count: 0, done: false };
      saveProgress(p);
      updatePageProgress();
      return;
    }

    const next = cur + 1;
    el.dataset.current = next;
    updateRing(el);

    const p = getProgress();
    p.data[key] = { count: next, done: next >= max };
    saveProgress(p);

    const numEl = el.querySelector('.count-txt');
    if (numEl) {
      numEl.classList.remove('pop');
      void numEl.offsetWidth;
      numEl.classList.add('pop');
    }

    el.classList.remove('tapped');
    void el.offsetWidth;
    el.classList.add('tapped');

    if (next < max) {
      vibrateTap();
      if (next % 5 === 0) playTickSound();
    }

    if (next >= max) {
      el.classList.add('done');
      vibrateComplete();
      playCompletionChime();
    }

    updatePageProgress();
  };

  el.querySelector('.text').addEventListener('click', tapElement);

  const tapBtn = el.querySelector('.thikr-tap-btn');
  if (tapBtn) {
    tapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tapBtn.classList.remove('pulse');
      void tapBtn.offsetWidth;
      tapBtn.classList.add('pulse');
      tapElement();
    });
  }

  el.querySelector('.reset-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    el.dataset.current = 0;
    el.classList.remove('done');
    updateRing(el);
    const p = getProgress();
    p.data[key] = { count: 0, done: false };
    saveProgress(p);
    updatePageProgress();
  });

  el.querySelector('.share-btn').addEventListener('click', async (e) => {
    e.stopPropagation();
    const t = item.text + (item.fadl ? '\n\n' + item.fadl : '');
    if (navigator.share) {
      try { await navigator.share({ title: 'من وِرْدِي', text: t }); } catch {}
    } else {
      await navigator.clipboard.writeText(t);
      alert('تم النسخ ✅');
    }
  });

  el.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFav(item);
    e.target.classList.toggle('active');
  });

  return el;
}

/* ---------- شريط التقدم العام ---------- */
function updatePageProgress() {
  const cards = document.querySelectorAll('.thikr');
  if (!cards.length) return;
  const done = [...cards].filter(c => c.classList.contains('done')).length;
  const total = cards.length;
  const pct = Math.round((done / total) * 100);

  const wrap = document.getElementById('progressWrap');
  const fill = document.getElementById('pbFill');
  const counter = document.getElementById('pbCounter');

  if (wrap) wrap.style.display = 'block';
  if (fill) fill.style.width = pct + '%';
  if (counter) counter.textContent = `${toAr(done)} / ${toAr(total)}`;
}

/* ---------- تصفير الكل ---------- */
function resetAllAthkar(scopes) {
  if (!confirm('هل تريد تصفير جميع الأذكار في هذه الصفحة؟')) return;
  document.querySelectorAll('.thikr').forEach(el => {
    el.dataset.current = 0;
    el.classList.remove('done');
    updateRing(el);
  });
  const p = getProgress();
  const scopeList = Array.isArray(scopes) ? scopes : [scopes];
  Object.keys(p.data).forEach(k => {
    if (scopeList.some(s => k.startsWith(s + '_'))) delete p.data[k];
  });
  saveProgress(p);
  updatePageProgress();
}

/* ---------- زر التشكيل ---------- */
function injectTashkeelToggle() {
  const header = document.querySelector('.athkar-header');
  if (!header) return;
  if (document.getElementById('tashkeelToggle')) return;

  const resetBtn = header.querySelector('.nav-btn:last-child');
  if (!resetBtn) return;

  const btn = document.createElement('button');
  btn.id = 'tashkeelToggle';
  btn.className = 'nav-btn tashkeel-toggle';
  btn.title = 'إظهار/إخفاء التشكيل';

  const update = () => {
    const on = isTashkeelEnabled();
    btn.textContent = 'ت';
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-label', on ? 'إخفاء التشكيل' : 'إظهار التشكيل');
  };
  update();

  btn.addEventListener('click', () => {
    const next = !isTashkeelEnabled();
    LS.set(AK.tashkeelKey, next);
    location.reload();
  });

  header.insertBefore(btn, resetBtn);
}

/* ---------- إعادة بناء البطاقات ---------- */
function rebuildAllCards(scope, data) {
  const list = document.getElementById('athkarList');
  if (!list || !data) return;
  const progress = getProgress();
  list.innerHTML = '';
  data.forEach((item, i) => {
    list.appendChild(buildThikrCard(item, i, scope, progress));
  });
  updatePageProgress();
}

/* ---------- تصدير ---------- */
window.AthkarCore = {
  buildThikrCard,
  updateRing,
  updatePageProgress,
  resetAllAthkar,
  getProgress,
  saveProgress,
  toAr,
  stripTashkeel,
  isTashkeelEnabled,
  getDisplayText,
  injectTashkeelToggle,
  rebuildAllCards,
};