/* ============ صفحة السورة — مصحف المدينة النبوية ============ */

const QURAN_API_V4 = 'https://api.quran.com/api/v4';
const QURAN_FALLBACK = 'https://api.alquran.cloud/v1';
const LAST_READ_KEY = 'quran_last_read';
const BOOKMARKS_KEY = 'quran_bookmarks';
const RECITER_KEY = 'quran_reciter';

const RECITERS = {
  Alafasy:                   { name: 'مشاري العفاسي',      slug: 'Alafasy' },
  AbdulBaset:                { name: 'عبد الباسط (مرتل)',  slug: 'AbdulBaset' },
  Minshawy_Murattal_128kbps: { name: 'المنشاوي (مرتل)',    slug: 'Minshawy_Murattal_128kbps' },
  Husary:                    { name: 'محمود خليل الحصري',  slug: 'Husary' },
  Sudais:                    { name: 'عبد الرحمن السديس',  slug: 'Sudais' },
  Maher:                     { name: 'ماهر المعيقلي',      slug: 'Maher' },
  Ajamy:                     { name: 'أحمد بن علي العجمي', slug: 'Ajamy' },
  Ghamadi:                   { name: 'سعد الغامدي',        slug: 'Ghamadi' },
};

let CURRENT = null;
let audioEl = null;

function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '٠:٠٠';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return toAr(`${m}:${String(s).padStart(2, '0')}`);
}

function getBookmarks() {
  return LS.get(BOOKMARKS_KEY, []);
}

function toggleBookmark(ayah) {
  const list = getBookmarks();
  const idx = list.findIndex(b => b.surah === CURRENT.number && b.ayah === ayah);
  if (idx !== -1) list.splice(idx, 1);
  else list.push({ surah: CURRENT.number, surahName: CURRENT.name, ayah, time: Date.now() });
  LS.set(BOOKMARKS_KEY, list);
  return idx === -1; // يُرجع true إذا أُضيف
}

/* ---------- جلب السورة ---------- */
async function fetchSurah(number) {
  // المصدر الرسمي
  try {
    const infoRes = await fetch(`${QURAN_API_V4}/chapters/${number}?language=ar`);
    const infoData = await infoRes.json();
    const chapter = infoData.chapter;

    const versesRes = await fetch(`${QURAN_API_V4}/quran/verses/uthmani?chapter_number=${number}`);
    const versesData = await versesRes.json();

    if (versesData.verses && versesData.verses.length) {
      return {
        number: chapter.id,
        name: `سُورَةُ ${chapter.name_arabic}`,
        arabicName: chapter.name_arabic,
        revelationType: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
        numberOfAyahs: chapter.verses_count,
        bismillahPre: chapter.bismillah_pre,
        ayahs: versesData.verses.map(v => {
          const [s, a] = v.verse_key.split(':').map(Number);
          return {
            numberInSurah: a,
            number: v.id,
            text: v.text_uthmani,
            verse_key: v.verse_key,
          };
        }),
        source: '✅ مصحف المدينة النبوية',
      };
    }
  } catch (e) {
    console.warn('المصدر الرسمي فشل، نستخدم الاحتياطي:', e);
  }

  // الاحتياطي
  const res = await fetch(`${QURAN_FALLBACK}/surah/${number}/quran-uthmani`);
  const data = await res.json();
  if (data.code !== 200) throw new Error('فشل جلب السورة');
  return { ...data.data, source: 'ℹ️ alquran.cloud' };
}

/* ---------- عرض السورة ---------- */
function renderSurah(data) {
  CURRENT = data;

  document.getElementById('surahTitle').textContent = data.name;
  document.title = `${data.name} — وِرْدِي`;

  const typeAr = data.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
  document.getElementById('surahInfo').innerHTML = `
    <h3>سورة ${data.arabicName || data.name.replace('سُورَةُ ', '')}</h3>
    <div class="si-meta">
      <span>📖 ${toAr(data.numberOfAyahs)} آية</span>
      <span>🕌 ${typeAr}</span>
      <span>📿 ${toAr(data.number)}</span>
    </div>
    <div class="source-badge">${data.source || '✅ مصحف المدينة النبوية'}</div>
  `;

  const bismillah = document.getElementById('bismillah');
  if (data.number === 1 || data.number === 9) {
    bismillah.classList.add('hidden');
  } else {
    bismillah.classList.remove('hidden');
  }

  const versesBox = document.getElementById('verses');
  versesBox.innerHTML = '';

  // قراءة المفضلة الحالية
  const bookmarks = getBookmarks();
  const isBookmarked = (surahNum, ayahNum) =>
    bookmarks.some(b => b.surah === surahNum && b.ayah === ayahNum);

  data.ayahs.forEach((ayah, idx) => {
    let text = ayah.text;
    if (idx === 0 && data.number !== 1 && data.number !== 9) {
      text = text.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/u, '');
    }

    const el = document.createElement('div');
    el.className = 'verse fade-in';
    el.id = `ayah-${ayah.numberInSurah}`;
    el.dataset.ayah = ayah.numberInSurah;

    el.innerHTML = `
      <div class="v-body">
        <p class="v-text">
          ${text}
          <span class="v-num">${toAr(ayah.numberInSurah)}</span>
        </p>
        <div class="v-actions">
          <button class="play-btn" data-tip="استماع" aria-label="استماع">
            <span class="va-ico">▶</span>
          </button>
          <button class="bookmark-btn ${isBookmarked(data.number, ayah.numberInSurah) ? 'active' : ''}"
                  data-tip="مفضلة" aria-label="مفضلة">
            <span class="va-ico">🔖</span>
          </button>
          <button class="copy-btn" data-tip="نسخ" aria-label="نسخ">
            <span class="va-ico">📋</span>
          </button>
          <button class="share-btn" data-tip="مشاركة" aria-label="مشاركة">
            <span class="va-ico">📤</span>
          </button>
        </div>
      </div>
    `;

    // ===== إظهار الأزرار عند لمس/الضغط على نص الآية =====
    el.querySelector('.v-text').addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = el.classList.contains('active');
      document.querySelectorAll('.verse.active').forEach(v => v.classList.remove('active'));
      if (!isActive) el.classList.add('active');
    });

    // ===== زر الاستماع =====
    el.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      // إزالة تشغيل الآيات الأخرى
      document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
      el.classList.add('playing');
      playAyah(data.number, ayah.numberInSurah);
    });

    // ===== المفضلة =====
    el.querySelector('.bookmark-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const added = toggleBookmark(ayah.numberInSurah);
      e.currentTarget.classList.toggle('active', added);
    });

    // ===== النسخ =====
    el.querySelector('.copy-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      const t = `${text} (${data.arabicName || data.name}: ${toAr(ayah.numberInSurah)})`;
      try {
        await navigator.clipboard.writeText(t);
        const btn = e.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="va-ico">✓</span>';
        setTimeout(() => { btn.innerHTML = original; }, 1200);
      } catch {}
    });

    // ===== المشاركة =====
    el.querySelector('.share-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      const t = `${text}\n\n[${data.arabicName || data.name}: ${toAr(ayah.numberInSurah)}]`;
      if (navigator.share) {
        try { await navigator.share({ title: data.name, text: t }); } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(t);
          const btn = e.currentTarget;
          const original = btn.innerHTML;
          btn.innerHTML = '<span class="va-ico">✓</span>';
          setTimeout(() => { btn.innerHTML = original; }, 1200);
        } catch {}
      }
    });

    versesBox.appendChild(el);
  });

  // ===== أزرار السورة السابقة/التالية =====
  const prevBtn = document.getElementById('prevSurah');
  const nextBtn = document.getElementById('nextSurah');
  prevBtn.disabled = data.number <= 1;
  nextBtn.disabled = data.number >= 114;
  prevBtn.onclick = () => location.href = `surah.html?n=${data.number - 1}`;
  nextBtn.onclick = () => location.href = `surah.html?n=${data.number + 1}`;

  // ===== حفظ آخر قراءة =====
  const params = new URLSearchParams(location.search);
  const ayahParam = parseInt(params.get('ayah'), 10) || 1;
  LS.set(LAST_READ_KEY, {
    surah: data.number,
    surahName: data.name,
    ayah: ayahParam,
    time: Date.now(),
  });

  if (ayahParam > 1) {
    setTimeout(() => {
      const target = document.getElementById(`ayah-${ayahParam}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('highlight');
        setTimeout(() => target.classList.remove('highlight'), 3000);
      }
    }, 300);
  }

  // ===== قائمة العمليات =====
  document.getElementById('surahMenuBtn').onclick = () => {
    const curReciter = LS.get(RECITER_KEY, 'Alafasy');
    const choice = prompt(
      `اختر العملية:\n\n` +
      `1 = تشغيل السورة كاملة\n` +
      `2 = إيقاف الصوت\n` +
      `3 = نسخ السورة كاملة\n` +
      `4 = تغيير القارئ\n\n` +
      `—— القارئ الحالي: ${RECITERS[curReciter].name} ——`
    );
    if (choice === '1') playFullSurah();
    else if (choice === '2') stopAudio();
    else if (choice === '3') copyFullSurah();
    else if (choice === '4') changeReciter();
  };
}

function changeReciter() {
  const keys = Object.keys(RECITERS);
  const list = keys.map((k, i) => `${i + 1} = ${RECITERS[k].name}`).join('\n');
  const choice = prompt(`اختر القارئ:\n\n${list}`);
  const idx = parseInt(choice, 10) - 1;
  if (idx >= 0 && idx < keys.length) {
    LS.set(RECITER_KEY, keys[idx]);
    alert(`✅ تم اختيار: ${RECITERS[keys[idx]].name}`);
  }
}

/* ---------- الصوت ---------- */
function initAudio() {
  if (audioEl) return;
  audioEl = new Audio();
  audioEl.addEventListener('timeupdate', updateProgress);
  audioEl.addEventListener('loadedmetadata', updateProgress);
  audioEl.addEventListener('ended', () => {
    document.getElementById('apPlay').textContent = '▶';
    document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
  });
}

function pad(n, len = 3) {
  return String(n).padStart(len, '0');
}

function playAyah(surahNum, ayahNum) {
  initAudio();
  const reciter = LS.get(RECITER_KEY, 'Alafasy');
  const slug = RECITERS[reciter]?.slug || 'Alafasy';
  const url = `https://verses.quran.com/${slug}/mp3/${pad(surahNum)}${pad(ayahNum)}.mp3`;

  audioEl.src = url;
  audioEl.play().catch(err => {
    console.error('فشل التشغيل:', err);
    alert('⚠️ تعذّر تشغيل التلاوة. تحقق من الاتصال.');
  });

  document.getElementById('audioPlayer').style.display = 'flex';
  document.getElementById('apTitle').textContent = `${CURRENT.name} — آية ${toAr(ayahNum)} (${RECITERS[reciter].name})`;
  document.getElementById('apPlay').textContent = '⏸';
}

function playFullSurah() {
  initAudio();
  const reciter = LS.get(RECITER_KEY, 'Alafasy');
  const map = {
    Alafasy: 'ar.alafasy',
    AbdulBaset: 'ar.abdulbasitmurattal',
    Minshawy_Murattal_128kbps: 'ar.minshawi',
    Husary: 'ar.husary',
    Sudais: 'ar.abdurrahmaansudais',
    Maher: 'ar.mahermuaiqly',
    Ajamy: 'ar.ahmedajamy',
    Ghamadi: 'ar.saoodshuraym',
  };
  const apiReciter = map[reciter] || 'ar.alafasy';
  const url = `https://cdn.islamic.network/quran/audio-surah/128/${apiReciter}/${CURRENT.number}.mp3`;

  audioEl.src = url;
  audioEl.play().catch(() => alert('⚠️ تعذّر تشغيل السورة'));
  document.getElementById('audioPlayer').style.display = 'flex';
  document.getElementById('apTitle').textContent = `سورة ${CURRENT.arabicName} (${RECITERS[reciter].name})`;
  document.getElementById('apPlay').textContent = '⏸';
}

function updateProgress() {
  if (!audioEl) return;
  const fill = document.getElementById('apFill');
  const time = document.getElementById('apTime');
  const cur = audioEl.currentTime || 0;
  const dur = audioEl.duration || 0;
  const pct = dur ? (cur / dur) * 100 : 0;
  if (fill) fill.style.width = pct + '%';
  if (time) time.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
}

function stopAudio() {
  if (audioEl) {
    audioEl.pause();
    document.getElementById('apPlay').textContent = '▶';
    document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
  }
}

async function copyFullSurah() {
  const text = CURRENT.ayahs.map(a => a.text).join(' ');
  try {
    await navigator.clipboard.writeText(text);
    alert('تم نسخ السورة ✅');
  } catch {}
}

/* ---------- التهيئة ---------- */
async function initSurahPage() {
  const params = new URLSearchParams(location.search);
  const num = parseInt(params.get('n'), 10) || 1;

  try {
    const data = await fetchSurah(num);
    renderSurah(data);

    document.getElementById('apPlay').addEventListener('click', () => {
      if (!audioEl) return;
      if (audioEl.paused) {
        audioEl.play();
        document.getElementById('apPlay').textContent = '⏸';
      } else {
        audioEl.pause();
        document.getElementById('apPlay').textContent = '▶';
      }
    });

    document.getElementById('apProgress').addEventListener('click', (e) => {
      if (!audioEl || !audioEl.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = 1 - (x / rect.width);
      audioEl.currentTime = pct * audioEl.duration;
    });
  } catch (e) {
    console.error(e);
    document.getElementById('verses').innerHTML =
      '<div class="loading">❌ تعذّر تحميل السورة. تحقق من الاتصال.</div>';
  }
}

document.addEventListener('DOMContentLoaded', initSurahPage);