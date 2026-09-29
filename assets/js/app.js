/* ============ وِرْدِي — App JS ============ */

/* ============================================================
   نظام الوضع الليلي الموحّد (WirdiTheme)
   ============================================================ */
(function () {
  const KEY = 'wirdi_dark';
  const html = document.documentElement;
  const BTN_SELECTOR = '#darkToggle, .dark-toggle, [data-dark-toggle], #themeToggle, .theme-toggle';

  try {
    if (localStorage.getItem(KEY) === null) {
      const legacy = ['dark', 'set_dark'];
      let migrated = null;
      for (const k of legacy) {
        const raw = localStorage.getItem(k);
        if (raw === null) continue;
        let val = null;
        try { val = JSON.parse(raw); } catch { val = raw; }
        migrated = (val === true || val === 'true' || val === '1' || val === 1) ? '1' : '0';
        break;
      }
      if (migrated !== null) {
        localStorage.setItem(KEY, migrated);
        legacy.forEach(k => localStorage.removeItem(k));
      }
    }
  } catch (e) {}

  function isDark() {
    try {
      const v = localStorage.getItem(KEY);
      if (v === '1' || v === 'true') return true;
      if (v === '0' || v === 'false') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  }

  function updateButtons(d) {
    document.querySelectorAll(BTN_SELECTOR).forEach(b => {
      b.textContent = d ? '☀️' : '🌙';
      b.setAttribute('aria-pressed', d ? 'true' : 'false');
    });
  }

  function apply(force) {
    const d = (typeof force === 'boolean') ? force : isDark();
    html.classList.toggle('dark', d);
    if (document.body) document.body.classList.toggle('dark', d);
    updateButtons(d);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', d ? '#1F4E3D' : '#F5F1E8');
    return d;
  }

  function toggle() {
    const next = !isDark();
    try { localStorage.setItem(KEY, next ? '1' : '0'); } catch {}
    apply(next);
    return next;
  }

  if (!window.__wirdiThemeDelegated) {
    window.__wirdiThemeDelegated = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest(BTN_SELECTOR);
      if (!btn) return;
      e.preventDefault();
      toggle();
    });
  }

  apply();

  function init() { apply(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else { init(); }

  try {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (localStorage.getItem(KEY) === null) apply();
      });
  } catch {}

  window.WirdiTheme = { KEY, isDark, apply, toggle, init };
})();

const LS = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k),
};

function initDark() {
  if (window.WirdiTheme) { window.WirdiTheme.init(); window.WirdiTheme.apply(); }
}

function initHijriDate() {
  const el = document.getElementById('hijriDate');
  if (!el) return;
  try {
    const d = new Date();
    const fmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const weekday = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(d);
    el.innerHTML = `${fmt.format(d)} <span class="dot">■</span> ${weekday}`;
  } catch {
    el.textContent = new Date().toLocaleDateString('ar-EG');
  }
}

function initTracker() {
  const tasksBox = document.getElementById('tasks');
  if (!tasksBox) return;
  const today = new Date().toISOString().slice(0, 10);
  const store = LS.get('tracker', {});
  if (store.date !== today) {
    store.date = today;
    store.done = {};
    LS.set('tracker', store);
  }
  const inputs = tasksBox.querySelectorAll('input[type="checkbox"]');
  inputs.forEach(inp => {
    inp.checked = !!(store.done && store.done[inp.dataset.k]);
    inp.addEventListener('change', () => {
      store.done[inp.dataset.k] = inp.checked;
      LS.set('tracker', store);
      updateProgress();
    });
  });
  function updateProgress() {
    const total = inputs.length;
    const done = [...inputs].filter(i => i.checked).length;
    const pct = Math.round((done / total) * 100);
    const ring = document.getElementById('progressRing');
    const txt = document.getElementById('progressTxt');
    if (ring) ring.style.background = `conic-gradient(var(--green) ${pct * 3.6}deg, var(--line) 0)`;
    if (txt) txt.textContent = pct + '%';
    const greet = document.getElementById('dayGreeting');
    if (greet) {
      const h = new Date().getHours();
      let g = '🌙 ليلة هادئة بذكر الله';
      if (h >= 4 && h < 12) g = '🌅 صباح مبارك بذكر الله';
      else if (h >= 12 && h < 17) g = '☀️ نهار طيب بذكر الله';
      else if (h >= 17 && h < 21) g = '🌆 مساء مبارك بذكر الله';
      greet.textContent = g;
    }
  }
  updateProgress();
  const streak = LS.get('streak', { count: 1, last: today });
  if (streak.last !== today) {
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    streak.count = streak.last === yest ? streak.count + 1 : 1;
    streak.last = today;
    LS.set('streak', streak);
  }
  const streakEl = document.getElementById('streak');
  if (streakEl) streakEl.textContent = streak.count;
}

function setGoal() {
  const cur = LS.get('goal', 0);
  const val = prompt('كم عدد الأذكار التي تريد إتمامها اليوم؟', cur || 10);
  if (val === null) return;
  const n = parseInt(val, 10);
  if (!isNaN(n) && n > 0) {
    LS.set('goal', n);
    const el = document.getElementById('goalTxt');
    if (el) el.textContent = `هدفك اليومي: ${n} ذكر`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDark();
  initHijriDate();
  initTracker();
  const goal = LS.get('goal', 0);
  const goalEl = document.getElementById('goalTxt');
  if (goal && goalEl) goalEl.textContent = `هدفك اليومي: ${goal} ذكر`;
});