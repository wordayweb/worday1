/* ============ وِرْدِي — App JS ============ */

const LS = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k),
};

/* ---------- الوضع الليلي ---------- */
function initDark() {
  const saved = LS.get('dark', null) ?? LS.get('set_dark', null);
  if (saved === null) {
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefers) document.body.classList.add('dark');
  } else if (saved) {
    document.body.classList.add('dark');
  }
  const btn = document.getElementById('darkToggle');
  if (btn) {
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    btn.onclick = () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      LS.set('dark', isDark);
      btn.textContent = isDark ? '☀️' : '🌙';
    };
  }
}

/* ---------- التاريخ الهجري ---------- */
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

/* ---------- بطاقة الالتزام ---------- */
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

/* ---------- الهدف اليومي ---------- */
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

/* ---------- تشغيل ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initDark();
  initHijriDate();
  initTracker();
  const goal = LS.get('goal', 0);
  const goalEl = document.getElementById('goalTxt');
  if (goal && goalEl) goalEl.textContent = `هدفك اليومي: ${goal} ذكر`;
});