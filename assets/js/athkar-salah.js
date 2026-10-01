const SALAH_ATHKAR_DATA = [
  { category: "🕌 أذكار الأذان", items: [
    { id: "adhan_1", text: "يَقُولُ مِثْلَ مَا يَقُولُ الْمُؤَذِّنُ، إِلَّا فِي «حَيَّ عَلَى الصَّلَاةِ» وَ«حَيَّ عَلَى الْفَلَاحِ» فَيَقُولُ: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", count: 1, virtue: "من قال ذلك موقناً به دخل الجنة", source: "متفق عليه" },
    { id: "adhan_2", text: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ", count: 1, virtue: "حَلَّتْ لَهُ شَفَاعَتِي يَوْمَ الْقِيَامَةِ", source: "رواه البخاري" }
  ]},
  { category: "💧 أذكار الوضوء", items: [
    { id: "wudu_1", text: "بِسْمِ اللَّهِ", count: 1, virtue: "لا وضوء لمن لم يذكر اسم الله عليه", source: "رواه أبو داود والترمذي" },
    { id: "wudu_2", text: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", count: 1, virtue: "فُتِحَتْ لَهُ أَبْوَابُ الْجَنَّةِ الثَّمَانِيَةُ يَدْخُلُ مِنْ أَيِّهَا شَاءَ", source: "رواه مسلم" }
  ]},
  { category: "🕋 أذكار دخول المسجد", items: [
    { id: "mosque_in", text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", count: 1, virtue: "دعاء دخول المسجد", source: "رواه مسلم" },
    { id: "mosque_out", text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", count: 1, virtue: "دعاء الخروج من المسجد", source: "رواه مسلم" }
  ]},
  { category: "⏳ أذكار بين الأذان والإقامة", items: [
    { id: "between_1", text: "الدُّعَاءُ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ لَا يُرَدُّ", count: 1, virtue: "ادعُ بما شئت من خير الدنيا والآخرة", source: "رواه الترمذي وأبو داود" }
  ]},
  { category: "✅ أذكار بعد السلام", items: [
    { id: "after_1", text: "أَسْتَغْفِرُ اللَّهَ", count: 3, virtue: "استغفار بعد الصلاة", source: "رواه مسلم" },
    { id: "after_2", text: "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", count: 1, virtue: "دعاء بعد السلام", source: "رواه مسلم" },
    { id: "after_3", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, virtue: "بعد المغرب والصبح", source: "متفق عليه" }
  ]},
  { category: "🕌 صلاة الجمعة", items: [
    { id: "jumuah_1", text: "الإكثار من الصلاة على النبي ﷺ يوم الجمعة وليلتها", count: 1, virtue: "عرضها على النبي ﷺ", source: "رواه أبو داود" },
    { id: "jumuah_2", text: "قراءة سورة الكهف", count: 1, virtue: "أضاء له من النور ما بين الجمعتين", source: "رواه الحاكم" }
  ]}
];

const PROGRESS_KEY = 'wirdi_salah_athkar_progress';
function toAr(s) { return String(s).replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][d]); }
function getProgress() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; } }
function saveProgress(id, currentCount) {
  const progress = getProgress();
  progress[id] = currentCount <= 0 ? 'done' : currentCount;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  updateGlobalProgress();
}
function updateGlobalProgress() {
  const progress = getProgress();
  let total = 0, completed = 0;
  SALAH_ATHKAR_DATA.forEach(cat => cat.items.forEach(item => {
    total++; if (progress[item.id] === 'done') completed++;
  }));
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = toAr(pct) + '٪ مكتمل';
}
function renderAthkar() {
  const container = document.getElementById('athkarSalahContainer');
  if (!container) return;
  container.innerHTML = '';
  const progress = getProgress();
  SALAH_ATHKAR_DATA.forEach(cat => {
    const catTitle = document.createElement('h3');
    catTitle.className = 'category-title';
    catTitle.textContent = cat.category;
    container.appendChild(catTitle);
    cat.items.forEach(item => {
      const currentCount = progress[item.id] === 'done' ? 0 : (progress[item.id] || item.count);
      const isCompleted = currentCount === 0;
      const card = document.createElement('div');
      card.className = `dhikr-card ${isCompleted ? 'completed' : ''}`;
      card.id = `card-${item.id}`;
      card.innerHTML = `
        <p class="dhikr-text">${item.text}</p>
        <div class="dhikr-meta">
          ${item.virtue ? `<span class="meta-badge">💡 ${item.virtue}</span>` : ''}
          <span class="meta-badge source">📚 ${item.source}</span>
        </div>
        <div class="dhikr-actions">
          <span class="count-display">المتبقي: <strong id="count-${item.id}">${toAr(currentCount)}</strong></span>
          <button class="count-btn" id="btn-${item.id}" ${isCompleted ? 'disabled' : ''} onclick="decrementCount('${item.id}', ${item.count})">
            ${isCompleted ? '✓ تم' : '📿 ذكر'}
          </button>
        </div>`;
      container.appendChild(card);
    });
  });
  updateGlobalProgress();
}
function decrementCount(id, maxCount) {
  const progress = getProgress();
  let current = progress[id] === 'done' ? 0 : (progress[id] || maxCount);
  if (current > 0) {
    current--;
    saveProgress(id, current);
    const countEl = document.getElementById(`count-${id}`);
    const btnEl = document.getElementById(`btn-${id}`);
    const cardEl = document.getElementById(`card-${id}`);
    if (countEl) countEl.textContent = toAr(current);
    if (current === 0) {
      if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '✓ تم'; }
      if (cardEl) cardEl.classList.add('completed');
      if (navigator.vibrate) navigator.vibrate(50);
    }
  }
}
function resetProgress() {
  if (confirm('هل أنت متأكد من إعادة تعيين تقدم جميع الأذكار؟')) {
    localStorage.removeItem(PROGRESS_KEY);
    renderAthkar();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  renderAthkar();
  const resetBtn = document.getElementById('resetProgressBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetProgress);
});
