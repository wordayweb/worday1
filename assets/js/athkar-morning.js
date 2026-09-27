/* ============ صفحة أذكار الصباح ============ */

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('athkarList');
  if (!list) return;

  const items = window.ATHKAR_MORNING || [];
  const progress = AthkarCore.getProgress();

  list.innerHTML = '';
  items.forEach((item, i) => {
    const card = AthkarCore.buildThikrCard(item, i, 'morning', progress);
    list.appendChild(card);
  });

  AthkarCore.updatePageProgress();
});

/* ربط زر التصفير */
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.querySelector('[data-reset-all]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => AthkarCore.resetAllAthkar('morning'));
  }
});