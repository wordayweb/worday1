/* ============ صفحة أذكار المساء ============ */

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('athkarList');
  if (!list) return;

  const items = window.ATHKAR_EVENING || [];
  const progress = AthkarCore.getProgress();

  list.innerHTML = '';
  items.forEach((item, i) => {
    const card = AthkarCore.buildThikrCard(item, i, 'evening', progress);
    list.appendChild(card);
  });

  AthkarCore.updatePageProgress();
});

/* ربط زر التصفير */
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.querySelector('[data-reset-all]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => AthkarCore.resetAllAthkar('evening'));
  }
});