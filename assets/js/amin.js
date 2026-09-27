/* ============ وِرْدِي الأمين — الورد اليومي ============ */

const AMIN_KEY = 'wirdi_amin_state';
const AMIN_STREAK_KEY = 'wirdi_amin_streak';
const AMIN_CUSTOM_KEY = 'wirdi_amin_custom';

/* ===== بنك المحتوى ===== */
const BANK = {
  ayahs: [
    { text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', ref: 'الشرح: ٦' },
    { text: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', ref: 'الطلاق: ٣' },
    { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', ref: 'الرعد: ٢٨' },
    { text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', ref: 'طه: ١١٤' },
    { text: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', ref: 'البقرة: ١٥٣' },
    { text: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ', ref: 'هود: ١١٥' },
    { text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', ref: 'البقرة: ١٥٢' },
    { text: 'وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', ref: 'البقرة: ٢١٦' },
    { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', ref: 'البقرة: ٢٠١' },
    { text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', ref: 'البقرة: ٢٥٥' },
    { text: 'وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ', ref: 'الإسراء: ٨١' },
    { text: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', ref: 'طه: ٢٥-٢٦' },
    { text: 'وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ', ref: 'الكهف: ٢٤' },
    { text: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ', ref: 'الأحزاب: ٥٦' },
    { text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', ref: 'البقرة: ١٥٣' },
    { text: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', ref: 'الضحى: ٥' },
    { text: 'إِنَّ رَبِّي لَسَمِيعُ الدُّعَاءِ', ref: 'إبراهيم: ٣٩' },
    { text: 'وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ', ref: 'البقرة: ٢١٦' },
    { text: 'وَعَدَ اللَّهُ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', ref: 'المائدة: ٩' },
    { text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا', ref: 'آل عمران: ٨' },
    { text: 'وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ', ref: 'الفرقان: ٥٨' },
    { text: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', ref: 'الرعد: ١١' },
    { text: 'وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ', ref: 'غافر: ٦٠' },
    { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', ref: 'الشرح: ٥' },
    { text: 'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ', ref: 'النجم: ٣٩' },
    { text: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ', ref: 'آل عمران: ١٨٥' },
    { text: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ', ref: 'هود: ٨٨' },
    { text: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ', ref: 'الحشر: ١٠' },
    { text: 'وَاللَّهُ خَيْرُ الْحَافِظِينَ', ref: 'يوسف: ٦٤' },
    { text: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', ref: 'يوسف: ٨٧' },
  ],
  adhkar: [
    { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', count: 100, ico: '📿' },
    { text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count: 100, ico: '💭' },
    { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', count: 10, ico: '🌿' },
    { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ', count: 10, ico: '☀️' },
    { text: 'حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ', count: 10, ico: '🛡️' },
    { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 10, ico: '💪' },
    { text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', count: 10, ico: '✨' },
    { text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', count: 3, ico: '🤲' },
    { text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', count: 3, ico: '🌙' },
    { text: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ', count: 3, ico: '🤍' },
  ],
  hadiths: [
    { text: '«أحبُّ الأعمالِ إلى اللهِ أدْومُها وإنْ قَلَّ»', ref: 'متفق عليه' },
    { text: '«الكلمةُ الطيبةُ صدقة»', ref: 'متفق عليه' },
    { text: '«من قال سبحان الله وبحمده في يوم مئة مرة حُطّت خطاياه وإن كانت مثل زبد البحر»', ref: 'البخاري' },
    { text: '«اتقِ الله حيثما كنت، وأتبِع السيئة الحسنة تمحُها، وخالق الناس بخلق حسن»', ref: 'الترمذي' },
    { text: '«الدالُ على الخير كفاعله»', ref: 'مسلم' },
    { text: '«مَن صلَّى عليَّ صلاةً صلَّى اللهُ عليه بها عشرًا»', ref: 'مسلم' },
    { text: '«لا يُؤمنُ أحدُكم حتى يحبَّ لأخيه ما يحبُّ لنفسه»', ref: 'متفق عليه' },
    { text: '«الطُّهورُ شطرُ الإيمانِ، والحمدُ للهِ تملأُ الميزانَ»', ref: 'مسلم' },
    { text: '«مَن قرأ حرفًا من كتاب الله فله به حسنة»', ref: 'الترمذي' },
    { text: '«مَن لزم الاستغفار جعل الله له من كل ضيق مخرجًا»', ref: 'أبو داود' },
    { text: '«خيرُكم مَن تعلَّم القرآن وعلَّمه»', ref: 'البخاري' },
    { text: '«الصدقةُ تُطفئ الخطيئة كما يُطفئ الماءُ النارَ»', ref: 'الترمذي' },
    { text: '«مَن صام رمضان إيمانًا واحتسابًا غُفر له ما تقدم من ذنبه»', ref: 'متفق عليه' },
    { text: '«أفضلُ الذكرِ لا إله إلا الله، وأفضلُ الدعاء الحمدُ لله»', ref: 'الترمذي' },
    { text: '«دعوةُ المرءِ المسلمِ لأخيه بظهر الغيب مستجابة»', ref: 'مسلم' },
    { text: '«مَن دلَّ على خير فله مثلُ أجرِ فاعله»', ref: 'مسلم' },
    { text: '«الساعي على الأرملة والمسكين كالمجاهد في سبيل الله»', ref: 'متفق عليه' },
    { text: '«مَن كان يؤمن بالله واليوم الآخر فليقُل خيرًا أو ليصمُت»', ref: 'متفق عليه' },
    { text: '«إن الله جميل يحب الجمال»', ref: 'مسلم' },
    { text: '«رأسُ الأمرِ الإسلام، وعموده الصلاة، وذروةُ سنامه الجهاد»', ref: 'الترمذي' },
  ],
};

/* ===== أدوات ===== */
function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

/* ===== اختيار ورد اليوم ===== */
function pickDailyWird() {
  const day = getDayOfYear();
  const year = new Date().getFullYear();
  const seed = day + year * 7;

  return {
    date: todayKey(),
    ayah:   BANK.ayahs[(seed * 3) % BANK.ayahs.length],
    dhikr:  BANK.adhkar[(seed * 5 + 1) % BANK.adhkar.length],
    hadith: BANK.hadiths[(seed * 7 + 2) % BANK.hadiths.length],
  };
}

/* ===== حالة الورد ===== */
function getState() {
  const saved = LS.get(AMIN_KEY, null);
  const today = todayKey();
  if (!saved || saved.date !== today) {
    return { date: today, done: {}, completed: false };
  }
  return saved;
}
function saveState(state) {
  LS.set(AMIN_KEY, state);
}

/* ===== السلسلة ===== */
function getStreak() {
  const s = LS.get(AMIN_STREAK_KEY, { count: 1, last: todayKey() });
  return s;
}
function bumpStreak() {
  const s = getStreak();
  const today = todayKey();
  if (s.last === today) return s;

  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.count = s.last === yest ? s.count + 1 : 1;
  s.last = today;
  LS.set(AMIN_STREAK_KEY, s);
  return s;
}

/* ===== التحية حسب الوقت ===== */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 12)  return { txt: 'صباح مبارك', ico: '☀️' };
  if (h >= 12 && h < 17) return { txt: 'نهار طيب',   ico: '🌤️' };
  if (h >= 17 && h < 21) return { txt: 'مساء مبارك', ico: '🌆' };
  return { txt: 'ليلة هادئة', ico: '🌙' };
}

/* ===== عرض البطاقة ===== */
function buildCard(item) {
  const state = getState();
  const el = document.createElement('article');
  el.className = 'wird-card fade-in' + (state.done[item.type] ? ' done' : '');
  el.dataset.type = item.type;

  el.innerHTML = `
    <div class="wc-head">
      <div class="wc-title">
        <span class="wc-ico">${item.ico}</span>
        <span>${item.title}</span>
      </div>
      <input type="checkbox" class="wc-check" ${state.done[item.type] ? 'checked' : ''}>
    </div>
    <div class="wc-body ${item.type === 'ayah' ? 'ayah' : ''}">${item.text}</div>
    ${item.ref ? `<div class="wc-ref">${item.ref}</div>` : ''}
    ${item.count ? `<div class="wc-ref" style="border:none;padding:6px 0 0;">📿 التكرار: ${toAr(item.count)} مرة</div>` : ''}
    <div class="wc-actions">
      <button class="share-btn">📤 مشاركة</button>
      <button class="copy-btn">📋 نسخ</button>
      ${item.type === 'dhikr' ? `<button class="go-tasbih">📿 سبّح الآن</button>` : ''}
    </div>
  `;

  el.querySelector('.wc-check').addEventListener('change', (e) => {
    const s = getState();
    s.done[item.type] = e.target.checked;
    saveState(s);
    el.classList.toggle('done', e.target.checked);
    updateHero();
    updateFinishBtn();
    if (e.target.checked && navigator.vibrate) navigator.vibrate(30);
  });

  el.querySelector('.share-btn').addEventListener('click', async () => {
    const t = item.text + (item.ref ? `\n\n[${item.ref}]` : '');
    if (navigator.share) {
      try { await navigator.share({ title: 'من وِرْدِي الأمين', text: t }); } catch {}
    } else {
      await navigator.clipboard.writeText(t);
      alert('تم النسخ ✅');
    }
  });

  el.querySelector('.copy-btn').addEventListener('click', async () => {
    const t = item.text + (item.ref ? ` (${item.ref})` : '');
    await navigator.clipboard.writeText(t);
    alert('تم النسخ ✅');
  });

  const tasbihBtn = el.querySelector('.go-tasbih');
  if (tasbihBtn) {
    tasbihBtn.addEventListener('click', () => {
      location.href = 'tasbih.html';
    });
  }

  return el;
}

/* ===== تحديث بطاقة الهيرو ===== */
function updateHero() {
  const wird = pickDailyWird();
  const state = getState();
  const total = 3;
  const done = Object.values(state.done).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  // التاريخ
  const d = new Date();
  try {
    document.getElementById('hwDate').textContent =
      new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(d);
  } catch {
    document.getElementById('hwDate').textContent = d.toLocaleDateString('ar');
  }

  // التحية
  const g = getGreeting();
  document.querySelector('.hw-ico').textContent = g.ico;
  document.getElementById('hwGreet').textContent = g.txt;

  // التقدم
  document.getElementById('hwDone').textContent = toAr(done);
  document.getElementById('hwTotal').textContent = toAr(total);
  document.getElementById('hwPct').textContent = toAr(pct) + '٪';

  // حلقة التقدم
  const ring = document.getElementById('hwRingFill');
  const dash = 163.36;
  ring.style.strokeDashoffset = dash - (dash * (pct / 100));

  // السلسلة
  const streak = getStreak();
  document.getElementById('hwStreak').textContent = toAr(streak.count);
}

/* ===== زر الإتمام ===== */
function updateFinishBtn() {
  const state = getState();
  const done = Object.values(state.done).filter(Boolean).length;
  const btn = document.getElementById('finishBtn');
  const note = document.getElementById('finishNote');
  const txt = btn.querySelector('.fb-txt');
  const ico = btn.querySelector('.fb-ico');

  if (state.completed) {
    btn.classList.add('completed');
    btn.disabled = false;
    ico.textContent = '✅';
    txt.textContent = 'تقبّل الله منك — وردك مكتمل';
    note.textContent = '🎉 أتممت وردك اليوم، بارك الله فيك';
    return;
  }

  btn.classList.remove('completed');
  if (done === 3) {
    btn.disabled = false;
    ico.textContent = '🎯';
    txt.textContent = 'أتمم وردك اليوم';
    note.textContent = 'اضغط للإتمام وتسجيل سلسلتك';
  } else {
    btn.disabled = true;
    ico.textContent = '⏳';
    txt.textContent = `تبقّى ${toAr(3 - done)} من وردك`;
    note.textContent = 'أكمل العناصر الثلاثة لإتمام وردك';
  }
}

/* ===== إتمام الورد ===== */
function finishWird() {
  const state = getState();
  const done = Object.values(state.done).filter(Boolean).length;
  if (done < 3) return;

  state.completed = true;
  saveState(state);

  const streak = bumpStreak();
  document.getElementById('cbStreak').textContent = toAr(streak.count);
  document.getElementById('celebrate').classList.add('show');

  if (navigator.vibrate) navigator.vibrate([50, 100, 50]);

  updateFinishBtn();
}

/* ===== تجديد الورد ===== */
function refreshWird() {
  if (!confirm('تجديد الورد؟ سيتم مسح تقدم اليوم.')) return;
  const heute = { date: todayKey(), done: {}, completed: false };
  saveState(heute);
  render();
}

/* ===== العرض الكامل ===== */
function render() {
  const wird = pickDailyWird();
  const state = getState();

  // بناء البطاقات
  const box = document.getElementById('wirdContent');
  box.innerHTML = '';

  box.appendChild(buildCard({
    type: 'ayah',
    ico: '📖',
    title: 'آية اليوم',
    text: wird.ayah.text,
    ref: wird.ayah.ref,
  }));

  box.appendChild(buildCard({
    type: 'dhikr',
    ico: wird.dhikr.ico || '📿',
    title: 'ذكر اليوم',
    text: wird.dhikr.text,
    count: wird.dhikr.count,
  }));

  box.appendChild(buildCard({
    type: 'hadith',
    ico: '🕌',
    title: 'حديث اليوم',
    text: wird.hadith.text,
    ref: wird.hadith.ref,
  }));

  updateHero();
  updateFinishBtn();
}

/* ===== التهيئة ===== */
document.addEventListener('DOMContentLoaded', () => {
  initDark?.();
  render();

  document.getElementById('finishBtn').addEventListener('click', () => {
    if (getState().completed) return;
    finishWird();
  });

  document.getElementById('refreshWird').addEventListener('click', refreshWird);
});