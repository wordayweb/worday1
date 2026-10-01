const SALAH_DATA = {
  fard: { steps: [
    { title: "النية وتكبيرة الإحرام", arabic: "اللهُ أَكْبَرُ", desc: "استقبل القبلة وانوِ الصلاة في قلبك، ثم كبّر رافعاً يديك.", note: "النية محلها القلب." },
    { title: "دعاء الاستفتاح", arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ", desc: "يُقال سراً بعد التكبير." },
    { title: "الفاتحة وما تيسر", arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...", desc: "الفاتحة ركن في كل ركعة. تُقرأ سورة بعدها في أول ركعتين." },
    { title: "الركوع", arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ (3 مرات)", desc: "كبّر واركن، اجعل ظهرك مستوياً." },
    { title: "الرفع من الركوع", arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا وَلَكَ الْحَمْدُ", desc: "قف معتدلاً حتى تطمئن." },
    { title: "السجود", arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى (3 مرات)", desc: "اسجد على الأعضاء السبعة." },
    { title: "الجلوس بين السجدتين", arabic: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي", desc: "اجلس مطمئناً." },
    { title: "التشهد الأخير والتسليم", arabic: "التَّحِيَّاتُ لِلَّهِ...\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ", desc: "اختم صلاتك بالتسليم عن يمينك وشمالك." }
  ]},
  sunnah: { steps: [
    { title: "سنة الفجر", arabic: "ركعتان خفيفتان قبل الفجر", desc: "أكد السنن. يُقرأ فيهما الكافرون والإخلاص.", hadith: "ركعتا الفجر خير من الدنيا وما فيها. (مسلم)" },
    { title: "سنن الظهر", arabic: "4 قبلها و 2 بعدها", desc: "تُصلّى مثنى مثنى." },
    { title: "سنن المغرب والعشاء", arabic: "2 بعد المغرب و 2 بعد العشاء", desc: "تُصلّى في البيت أو المسجد." }
  ]},
  qiyam: { steps: [
    { title: "وقت قيام الليل", arabic: "من بعد العشاء إلى الفجر", desc: "أفضله الثلث الأخير من الليل." },
    { title: "كيفية الأداء", arabic: "مثنى مثنى", desc: "يُطيل القراءة والركوع والسجود." },
    { title: "الوتر", arabic: "ركعة أو 3 أو 5...", desc: "يُختم به قيام الليل.", hadith: "الوتر حق على كل مسلم. (متفق عليه)" }
  ]},
  istikhara: { steps: [
    { title: "صلاة الاستخارة", arabic: "ركعتان من غير الفريضة", desc: "صلّ ركعتين ثم ادعُ بدعاء الاستخارة." },
    { title: "دعاء الاستخارة", arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ... (ويسمّي حاجته)", desc: "يُسمّي حاجته مكان 'هذا الأمر'." }
  ]},
  eid: { steps: [
    { title: "تكبيرات الركعة الأولى", arabic: "7 تكبيرات بعد تكبيرة الإحرام", desc: "يرفع يديه مع كل تكبيرة." },
    { title: "القراءة", arabic: "الفاتحة وسورة (سبح أو ق)", desc: "يُجهر بالقراءة." },
    { title: "تكبيرات الركعة الثانية", arabic: "5 تكبيرات غير تكبيرة القيام", desc: "ثم يُتم الصلاة كعادته." }
  ]}
};

let currentTab = 'fard';
function toAr(s) { return String(s).replace(/[0-9]/g, d => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][d]); }

function renderTab(tabKey) {
  const container = document.getElementById('salahStepsContainer');
  if (!container) return;
  container.innerHTML = '';
  const data = SALAH_DATA[tabKey];
  if (!data) return;
  data.steps.forEach((step, index) => {
    const card = document.createElement('div');
    card.className = 'step-card';
    card.id = 'step-' + tabKey + '-' + index;
    card.innerHTML = '<div class="step-header" onclick="toggleStep(this.parentElement)"><div class="step-number">' + toAr(index + 1) + '</div><h4 class="step-title">' + step.title + '</h4><div class="step-toggle">▼</div></div><div class="step-content"><div class="step-body">' + (step.desc ? '<p>' + step.desc + '</p>' : '') + '<div class="step-arabic">' + step.arabic + '</div>' + (step.hadith ? '<div class="step-hadith">📚 ' + step.hadith + '</div>' : '') + (step.note ? '<div class="step-hadith">💡 ' + step.note + '</div>' : '') + '</div></div>';
    container.appendChild(card);
  });
}

function toggleStep(card) { card.classList.toggle('active'); }
function expandAll() {
  const cards = document.querySelectorAll('.step-card');
  const allActive = Array.from(cards).every(c => c.classList.contains('active'));
  cards.forEach(c => allActive ? c.classList.remove('active') : c.classList.add('active'));
}
function switchTab(tabKey) {
  currentTab = tabKey;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabKey);
  });
  renderTab(tabKey);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTab('fard');
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  const expandBtn = document.getElementById('expandAllBtn');
  if (expandBtn) expandBtn.addEventListener('click', expandAll);
});
