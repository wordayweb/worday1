/* ============ صفحة الأذكار الشاملة (صباح + مساء) ============ */

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('athkarList');
  if (!list) return;

  const progress = AthkarCore.getProgress();
  list.innerHTML = '';

  /* ---------- قسم الصباح ---------- */
  const morningHead = document.createElement('div');
  morningHead.className = 'section-head morning-head';
  morningHead.innerHTML = `
    <span class="sh-ico">🌅</span>
    <span class="sh-title">أذكار الصباح</span>
    <span class="sh-count">${AthkarCore.toAr((window.ATHKAR_MORNING || []).length)}</span>
  `;
  list.appendChild(morningHead);

  (window.ATHKAR_MORNING || []).forEach((item, i) => {
    const card = AthkarCore.buildThikrCard(item, i, 'morning', progress);
    list.appendChild(card);
  });

  /* ---------- فاصل ---------- */
  const sep = document.createElement('div');
  sep.className = 'section-separator';
  sep.innerHTML = `<span>✦ ✦ ✦</span>`;
  list.appendChild(sep);

  /* ---------- قسم المساء ---------- */
  const eveningHead = document.createElement('div');
  eveningHead.className = 'section-head evening-head';
  eveningHead.innerHTML = `
    <span class="sh-ico">🌆</span>
    <span class="sh-title">أذكار المساء</span>
    <span class="sh-count">${AthkarCore.toAr((window.ATHKAR_EVENING || []).length)}</span>
  `;
  list.appendChild(eveningHead);

  (window.ATHKAR_EVENING || []).forEach((item, i) => {
    const card = AthkarCore.buildThikrCard(item, i, 'evening', progress);
    list.appendChild(card);
  });

  AthkarCore.updatePageProgress();
});

/* ربط زر التصفير */
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.querySelector('[data-reset-all]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => AthkarCore.resetAllAthkar(['morning', 'evening']));
  }
});