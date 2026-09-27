/* ============ المسبحة الإلكترونية ============ */

const TASBIH_KEY = 'tasbih_state_v2';
const ADHKAR_KEY = 'tasbih_adhkar_v2';
const MAX_ADHKAR = 20;

/* ---------- الأذكار الافتراضية ---------- */
const DEFAULT_ADHKAR = [
  { id: 'post-prayer', title: 'تسبيح بعد الصلاة', text: 'سُبْحَانَ اللهِ (٣٣) — الْحَمْدُ لِلَّهِ (٣٣) — اللهُ أَكْبَرُ (٣٤)', count: 33 },
  { id: 'subhan',      title: 'سبحان الله',              text: 'سُبْحَانَ اللهِ', count: 33 },
  { id: 'hamd',        title: 'الحمد لله',               text: 'الْحَمْدُ لِلَّهِ', count: 33 },
  { id: 'akbar',       title: 'الله أكبر',               text: 'اللهُ أَكْبَرُ', count: 34 },
  { id: 'istighfar',   title: 'أستغفر الله',             text: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ', count: 100 },
  { id: 'salah-nabi',  title: 'الصلاة على النبي',         text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', count: 100 },
  { id: 'ibrahimiya',  title: 'الصلاة الإبراهيمية',       text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ', count: 10 },
  { id: 'taj',         title: 'تاج الذكر',                text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 100 },
  { id: 'hawqala',     title: 'الحوقلة',                  text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ', count: 100 },
  { id: 'tahlil',      title: 'لا إله إلا الله',          text: 'لَا إِلَهَ إِلَّا اللهُ', count: 100 },
];

/* ---------- الحالة ---------- */
let ADHKAR = [];
let STATE = {};

/* ---------- أدوات ---------- */
function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- تحميل البيانات ---------- */
function loadAdhkar() {
  const saved = LS.get(ADHKAR_KEY, null);
  if (saved && Array.isArray(saved) && saved.length) {
    ADHKAR = saved;
  } else {
    ADHKAR = JSON.parse(JSON.stringify(DEFAULT_ADHKAR));
    LS.set(ADHKAR_KEY, ADHKAR);
  }
}

function loadState() {
  const saved = LS.get(TASBIH_KEY, null);
  const today = todayKey();
  STATE = saved || {};
  if (STATE.lastDate !== today) {
    STATE.todayTotal = 0;
    STATE.lastDate = today;
  }
  STATE.currentId   = STATE.currentId   || ADHKAR[0]?.id;
  STATE.perDhikr    = STATE.perDhikr    || {};
  STATE.todayTotal  = STATE.todayTotal  || 0;
  STATE.allTotal    = STATE.allTotal    || 0;
  STATE.cyclesTotal = STATE.cyclesTotal || 0;
  STATE.goal        = STATE.goal        || 100;
  STATE.vibrate     = STATE.vibrate !== false;
  STATE.sound       = STATE.sound !== false;
  STATE.lastDate    = today;

  if (!ADHKAR.find(d => d.id === STATE.currentId)) {
    STATE.currentId = ADHKAR[0]?.id;
  }

  if (!STATE.perDhikr[STATE.currentId]) {
    STATE.perDhikr[STATE.currentId] = { count: 0, cycles: 0 };
  }
}

function saveState() { LS.set(TASBIH_KEY, STATE); }
function saveAdhkar() { LS.set(ADHKAR_KEY, ADHKAR); }

/* ---------- الذكر الحالي ---------- */
function getCurrent() {
  return ADHKAR.find(d => d.id === STATE.currentId) || ADHKAR[0];
}
function getCurrentCount() {
  return (STATE.perDhikr[STATE.currentId]?.count) || 0;
}
function getCurrentCycles() {
  return (STATE.perDhikr[STATE.currentId]?.cycles) || 0;
}
function setCurrentCount(n) {
  if (!STATE.perDhikr[STATE.currentId]) STATE.perDhikr[STATE.currentId] = { count: 0, cycles: 0 };
  STATE.perDhikr[STATE.currentId].count = n;
}
function setCurrentCycles(n) {
  if (!STATE.perDhikr[STATE.currentId]) STATE.perDhikr[STATE.currentId] = { count: 0, cycles: 0 };
  STATE.perDhikr[STATE.currentId].cycles = n;
}

/* ---------- العرض: شرائح الأذكار ---------- */
function renderPicker() {
  const box = document.getElementById('dhikrPicker');
  if (!box) return;
  box.innerHTML = '';

  ADHKAR.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'dhikr-chip' + (d.id === STATE.currentId ? ' active' : '');
    btn.dataset.id = d.id;
    btn.textContent = d.title;
    btn.addEventListener('click', () => {
      STATE.currentId = d.id;
      saveState();
      renderAll();
    });
    box.appendChild(btn);
  });

  const add = document.createElement('button');
  add.className = 'dhikr-chip add';
  add.textContent = '＋ إضافة';
  add.title = `إضافة ذكر جديد (${ADHKAR.length}/${MAX_ADHKAR})`;
  add.addEventListener('click', () => openModal(null));
  box.appendChild(add);

  setTimeout(() => {
    const active = box.querySelector('.dhikr-chip.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, 100);
}

/* ---------- العرض: الذكر الحالي ---------- */
function renderCurrent() {
  const d = getCurrent();
  if (!d) return;

  const titleEl = document.getElementById('dhikrTitle');
  const textEl = document.getElementById('dhikrText');

  titleEl.textContent = d.title;

  textEl.classList.add('changing');
  setTimeout(() => {
    textEl.textContent = d.text;
    textEl.classList.remove('changing');
  }, 30);

  document.getElementById('target').textContent = `/ ${toAr(d.count)}`;

  // أعد بناء الخرزات عند تغيير الذكر
  renderBeadRing(d.count);
  updateBeads(getCurrentCount(), d.count);
}

/* ---------- بناء الخرزات ---------- */
function renderBeadRing(target) {
  const group = document.getElementById('beadsGroup');
  if (!group) return;

  const COUNT = Math.min(target, 33);
  const cx = 140, cy = 140;
  const R = 125;

  let html = '';
  for (let i = 0; i < COUNT; i++) {
    const angle = (i / COUNT) * 2 * Math.PI - Math.PI / 2;
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    html += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="5" class="bead" data-i="${i}"/>`;
  }
  group.innerHTML = html;
  group.dataset.count = COUNT;
}

/* ---------- تحديث الخرزات ---------- */
function updateBeads(cur, target) {
  const group = document.getElementById('beadsGroup');
  if (!group) return;
  const beads = group.querySelectorAll('.bead');
  const total = beads.length;
  if (!total) return;

  const svg = document.querySelector('.ring-svg');
  const filledCount = Math.floor((cur / target) * total);
  const nextIdx = Math.min(filledCount, total - 1);
  const isDone = cur >= target;

  beads.forEach((b, i) => {
    b.classList.toggle('filled', isDone || i < filledCount);
    b.classList.toggle('current', !isDone && i === nextIdx && cur > 0);
  });

  if (svg) svg.classList.toggle('complete', isDone);
}

/* ---------- العرض: العداد ---------- */
function renderCounter() {
  const d = getCurrent();
  if (!d) return;

  const cur = getCurrentCount();
  const max = d.count;

  document.getElementById('counter').textContent = toAr(cur);
  document.getElementById('target').textContent = `/ ${toAr(max)}`;

  // حلقة التقدم
  const pct = max ? cur / max : 0;
  const dash = 660;
  const ring = document.getElementById('ringFg');
  if (ring) {
    ring.style.strokeDashoffset = dash - (dash * Math.min(pct, 1));
    ring.classList.toggle('complete', pct >= 1);
  }

  // الخرزات
  updateBeads(cur, max);
}

/* ---------- العرض: الإحصائيات ---------- */
function renderStats() {
  document.getElementById('todayTotal').textContent = toAr(STATE.todayTotal);
  document.getElementById('cycles').textContent = toAr(getCurrentCycles());
  document.getElementById('allTotal').textContent = toAr(STATE.allTotal);

  const goal = STATE.goal;
  const goalPct = Math.min((STATE.todayTotal / goal) * 100, 100);
  document.getElementById('goalFill').style.width = goalPct + '%';
  document.getElementById('goalValue').textContent = toAr(goal);

  const note = document.getElementById('goalNote');
  if (STATE.todayTotal >= goal) {
    note.textContent = '🎉 أكملت هدفك اليومي، بارك الله فيك!';
    note.style.color = 'var(--green)';
  } else {
    const left = goal - STATE.todayTotal;
    note.textContent = `تبقّى لك ${toAr(left)} تسبيحة لإتمام الهدف`;
    note.style.color = 'var(--ink-soft)';
  }

  const vibBtn = document.getElementById('vibrateBtn');
  if (vibBtn) {
    vibBtn.classList.toggle('off', !STATE.vibrate);
    document.getElementById('vibIco').textContent = STATE.vibrate ? '📳' : '🔕';
  }
}

function renderAll() {
  renderPicker();
  renderCurrent();
  renderCounter();
  renderStats();
}

/* ---------- نغمة عند الإتمام ---------- */
function playChime() {
  if (!STATE.sound) return;
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

/* ---------- التسبيح ---------- */
function tapTasbih() {
  const d = getCurrent();
  if (!d) return;

  let cur = getCurrentCount();
  cur++;
  setCurrentCount(cur);
  STATE.todayTotal++;
  STATE.allTotal++;

  if (STATE.vibrate && 'vibrate' in navigator) navigator.vibrate(15);

  const btn = document.getElementById('tapBtn');
  btn.classList.remove('pulse');
  void btn.offsetWidth;
  btn.classList.add('pulse');

  const num = document.getElementById('counter');
  num.classList.add('pop');
  setTimeout(() => num.classList.remove('pop'), 150);

  if (cur >= d.count) {
    setCurrentCount(0);
    setCurrentCycles(getCurrentCycles() + 1);
    STATE.cyclesTotal++;
    if (STATE.vibrate && 'vibrate' in navigator) navigator.vibrate([40, 60, 40]);
    playChime();
  }

  saveState();
  renderCounter();
  renderStats();
}

/* ---------- التصفير ---------- */
function resetTasbih() {
  if (!confirm('هل تريد تصفير العداد الحالي؟')) return;
  setCurrentCount(0);
  saveState();
  renderCounter();
}

/* ---------- النافذة ---------- */
let editingId = null;

function openModal(dhikr) {
  editingId = dhikr ? dhikr.id : null;

  document.getElementById('modalTitle').textContent =
    dhikr ? 'تعديل الذكر' : 'إضافة ذكر جديد';

  document.getElementById('editTitle').value = dhikr?.title || '';
  document.getElementById('editText').value = dhikr?.text || '';
  document.getElementById('editCount').value = dhikr?.count || 33;

  document.getElementById('modalDelete').style.display = dhikr ? 'block' : 'none';
  document.getElementById('modalCounter').textContent = `عدد الأذكار: ${toAr(ADHKAR.length)} / ${toAr(MAX_ADHKAR)}`;

  document.getElementById('modalBackdrop').classList.add('open');
  document.getElementById('editModal').classList.add('open');

  setTimeout(() => document.getElementById('editTitle').focus(), 300);
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.getElementById('editModal').classList.remove('open');
  editingId = null;
}

/* ---------- حفظ ---------- */
function saveModal() {
  const title = document.getElementById('editTitle').value.trim();
  const text = document.getElementById('editText').value.trim();
  const count = parseInt(document.getElementById('editCount').value, 10) || 1;

  if (!title) { alert('الرجاء إدخال عنوان الذكر'); return; }
  if (!text) { alert('الرجاء إدخال نص الذكر'); return; }
  if (count < 1 || count > 1000) { alert('عدد التسبيحات يجب أن يكون بين 1 و 1000'); return; }

  if (editingId) {
    const idx = ADHKAR.findIndex(d => d.id === editingId);
    if (idx !== -1) {
      ADHKAR[idx] = { ...ADHKAR[idx], title, text, count };
    }
  } else {
    if (ADHKAR.length >= MAX_ADHKAR) {
      alert(`عذرًا، الحد الأقصى ${toAr(MAX_ADHKAR)} ذكرًا. احذف واحدًا أولًا.`);
      return;
    }
    const id = 'custom_' + Date.now();
    ADHKAR.push({ id, title, text, count });
    STATE.currentId = id;
  }

  saveAdhkar();
  saveState();
  closeModal();
  renderAll();
}

/* ---------- حذف ---------- */
function deleteModal() {
  if (!editingId) return;
  if (ADHKAR.length <= 1) {
    alert('لا يمكن حذف الذكر الأخير');
    return;
  }
  if (!confirm('هل تريد حذف هذا الذكر؟')) return;

  ADHKAR = ADHKAR.filter(d => d.id !== editingId);
  delete STATE.perDhikr[editingId];

  if (STATE.currentId === editingId) {
    STATE.currentId = ADHKAR[0].id;
  }

  saveAdhkar();
  saveState();
  closeModal();
  renderAll();
}

/* ---------- الاهتزاز ---------- */
function toggleVibrate() {
  STATE.vibrate = !STATE.vibrate;
  saveState();
  renderStats();
}

/* ---------- التهيئة ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadAdhkar();
  loadState();
  renderAll();

  document.getElementById('tapBtn').addEventListener('click', tapTasbih);
  document.getElementById('resetBtn').addEventListener('click', resetTasbih);
  document.getElementById('vibrateBtn').addEventListener('click', toggleVibrate);

  document.getElementById('editCurrentBtn').addEventListener('click', () => {
    const d = getCurrent();
    if (d) openModal(d);
  });

  document.getElementById('manageBtn').addEventListener('click', () => openModal(null));

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.getElementById('modalSave').addEventListener('click', saveModal);
  document.getElementById('modalDelete').addEventListener('click', deleteModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if (e.code === 'Space' && !document.querySelector('.tasbih-modal.open')) {
      e.preventDefault();
      tapTasbih();
    }
  });
});