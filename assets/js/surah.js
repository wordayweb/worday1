/* ============ صفحة السورة — مصحف المدينة النبوية ============ */

const QURAN_API_V4 = 'https://api.quran.com/api/v4';
const QURAN_FALLBACK = 'https://api.alquran.cloud/v1';
const ALQURAN_API = 'https://api.alquran.cloud/v1';
const LAST_READ_KEY = 'quran_last_read';
const BOOKMARKS_KEY = 'quran_bookmarks';
const RECITER_KEY = 'quran_reciter';
const TAFSIR_SOURCE_KEY = 'wirdi_tafsir_source_v3';
const TAFSIR_CACHE_PREFIX = 'tafsir_v3_';

const TAFSIR_SLUGS = {
  'muyassar': 'ar.muyassar',
  'jalalayn': 'ar.jalalayn',
};

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
let CURRENT_TAFSIR = 'muyassar';

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
  return idx === -1;
}

/* ============================================================
   📖 التفسير — Cache + Fetch + Modal
   ============================================================ */
function getTafsirCache(key) {
  try {
    const raw = localStorage.getItem(TAFSIR_CACHE_PREFIX + key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (Date.now() - obj.time > 1000 * 60 * 60 * 24 * 7) {
      localStorage.removeItem(TAFSIR_CACHE_PREFIX + key);
      return null;
    }
    return obj.data;
  } catch { return null; }
}

function setTafsirCache(key, data) {
  try {
    localStorage.setItem(TAFSIR_CACHE_PREFIX + key, JSON.stringify({
      time: Date.now(),
      data,
    }));
  } catch {}
}

async function fetchTafsir(surahNum, ayahNum) {
  const key = `${CURRENT_TAFSIR}_${surahNum}_${ayahNum}`;
  const cached = getTafsirCache(key);
  if (cached) return cached;

  const slug = TAFSIR_SLUGS[CURRENT_TAFSIR] || 'ar.muyassar';
  const url = `${ALQURAN_API}/ayah/${surahNum}:${ayahNum}/${slug}`;

  console.log('📖 جلب التفسير:', url);

  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);

  const data = await res.json();
  if (data.code !== 200 || !data.data || !data.data.text) {
    throw new Error('لا يوجد تفسير');
  }

  const cleanText = data.data.text.replace(/<[^>]*>/g, '').trim();
  setTafsirCache(key, cleanText);
  return cleanText;
}

function openTafsir(surahNum, ayahNum, ayahText) {
  const modal = document.getElementById('tafsirModal');
  const title = document.getElementById('tafsirTitle');
  const subtitle = document.getElementById('tafsirSubtitle');
  const verseBox = document.getElementById('tafsirVerse');
  const body = document.getElementById('tafsirBody');
  const sourceEl = document.getElementById('tafsirSource');

  if (!modal) return;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const tafsirName = CURRENT_TAFSIR === 'jalalayn' ? 'تفسير الجلالين' : 'التفسير الميسر';
  title.textContent = tafsirName;
  subtitle.textContent = `سورة ${CURRENT.arabicName} — آية ${toAr(ayahNum)}`;
  verseBox.textContent = ayahText || '';
  sourceEl.textContent = 'المصدر: alquran.cloud';

  body.innerHTML = `
    <div class="tafsir-loading">
      <span class="spinner"></span>
      <span>جارٍ تحميل التفسير…</span>
    </div>
  `;

  fetchTafsir(surahNum, ayahNum)
    .then((text) => {
      const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      body.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    })
    .catch((err) => {
      console.warn('فشل التفسير:', err);
      body.innerHTML = `<div class="tafsir-error">⚠️ تعذّر تحميل التفسير. تحقق من الاتصال.</div>`;
    });
}

function closeTafsir() {
  const modal = document.getElementById('tafsirModal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

function initTafsirEvents() {
  const modal = document.getElementById('tafsirModal');
  const closeBtn = document.getElementById('tafsirClose');
  const backdrop = document.getElementById('tafsirBackdrop');
  const copyBtn = document.getElementById('tafsirCopy');

  if (closeBtn) closeBtn.addEventListener('click', closeTafsir);
  if (backdrop) backdrop.addEventListener('click', closeTafsir);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeTafsir();
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const verseBox = document.getElementById('tafsirVerse');
      const body = document.getElementById('tafsirBody');
      const text = `${verseBox.textContent}\n\n[التفسير]\n${body.textContent}`;
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = '✓ تم النسخ';
        setTimeout(() => { copyBtn.textContent = original; }, 1500);
      } catch {}
    });
  }

  /* قراءة التفسير المفضل */
  const savedSource = localStorage.getItem(TAFSIR_SOURCE_KEY);
  if (savedSource && TAFSIR_SLUGS[savedSource]) CURRENT_TAFSIR = savedSource;
}

/* ============================================================
   جلب موقع السورة في المصحف (الجزء والصفحة والحزب)
   ============================================================ */
async function fetchMushafPosition(surahNum) {
  const pick = (obj, ...keys) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return null;
  };

  /* المحاولة 1: verses/by_chapter */
  try {
    const url = `${QURAN_API_V4}/verses/by_chapter/${surahNum}?fields=page_number,juz_number,hizb_number&per_page=300`;
    const res = await fetch(url);
    const data = await res.json();

    const verses = data.verses || [];
    if (verses.length > 0) {
      const first = verses[0];
      const last  = verses[verses.length - 1];

      const juzStart  = pick(first, 'juz_number', 'juz')   || 1;
      const juzEnd    = pick(last,  'juz_number', 'juz')   || juzStart;
      const pageStart = pick(first, 'page_number', 'page') || 1;
      const pageEnd   = pick(last,  'page_number', 'page') || pageStart;
      const hizbStart = pick(first, 'hizb_number', 'hizb') || 1;
      const hizbEnd   = pick(last,  'hizb_number', 'hizb') || hizbStart;

      if (pageStart !== 1 || juzStart !== 1) {
        return { juzStart, juzEnd, pageStart, pageEnd, hizbStart, hizbEnd };
      }
    }
  } catch (e) {
    console.warn('⚠️ verses/by_chapter فشل:', e);
  }

  /* المحاولة 2: chapters/{n} */
  try {
    const url = `${QURAN_API_V4}/chapters/${surahNum}?language=ar`;
    const res = await fetch(url);
    const data = await res.json();

    const chapter = data.chapter || {};
    const pages = chapter.pages || [];
    const pageStart = pages.length > 0 ? pages[0] : 1;
    const pageEnd   = pages.length > 0 ? pages[pages.length - 1] : pageStart;

    const juzStart = Math.max(1, Math.ceil(pageStart / 20));
    const juzEnd   = Math.max(1, Math.ceil(pageEnd / 20));

    const hizbStart = (juzStart - 1) * 2 + 1;
    const hizbEnd   = (juzEnd - 1) * 2 + 2;

    return { juzStart, juzEnd, pageStart, pageEnd, hizbStart, hizbEnd };
  } catch (e) {
    console.warn('⚠️ chapters فشل:', e);
  }

  return {
    juzStart: 1, juzEnd: 1,
    pageStart: 1, pageEnd: 1,
    hizbStart: 1, hizbEnd: 1
  };
}

function renderMushafBar(pos) {
  if (!pos) return;
  const fmt = (a, b) => a === b ? toAr(a) : `${toAr(a)} - ${toAr(b)}`;
  const $ = id => document.getElementById(id);
  if ($('mbJuz'))  $('mbJuz').textContent  = fmt(pos.juzStart,  pos.juzEnd);
  if ($('mbPage')) $('mbPage').textContent = fmt(pos.pageStart, pos.pageEnd);
  if ($('mbHizb')) $('mbHizb').textContent = fmt(pos.hizbStart, pos.hizbEnd);
}

/* ============================================================
   ✨ المؤشر الديناميكي — يُحدِّث الشريط أثناء التمرير
   ============================================================ */
function initScrollTracker() {
  const verses = document.querySelectorAll('.verse');
  if (!verses.length) return;

  const mbJuz  = document.getElementById('mbJuz');
  const mbPage = document.getElementById('mbPage');
  const mbHizb = document.getElementById('mbHizb');
  if (!mbJuz || !mbPage || !mbHizb) return;

  let currentJuz = null;
  let currentPage = null;
  let currentHizb = null;
  let initialized = false;

  /* تحديث عنصر بقيمة جديدة + نبضة ذهبية */
  function updateItem(el, newValue) {
    const newText = toAr(newValue);
    if (el.textContent === newText) return false;
    el.textContent = newText;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    return true;
  }

  /* استخدام scroll مباشرة — أوثق من IntersectionObserver للشريط المتصل */
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      /* اختر الآية الأقرب لأعلى الشاشة */
      const viewportTop = 150; /* نطاق قريب من أعلى الشاشة */
      let closest = null;
      let closestDist = Infinity;

      for (const v of verses) {
        const rect = v.getBoundingClientRect();
        const dist = Math.abs(rect.top - viewportTop);
        if (rect.bottom > 0 && dist < closestDist) {
          closest = v;
          closestDist = dist;
        }
      }

      if (closest) {
        const page = parseInt(closest.dataset.page, 10);
        const juz  = parseInt(closest.dataset.juz, 10);
        const hizb = parseInt(closest.dataset.hizb, 10);

        if (page && page !== currentPage) {
          currentPage = page;
          updateItem(mbPage, page);
        }
        if (juz && juz !== currentJuz) {
          currentJuz = juz;
          updateItem(mbJuz, juz);
        }
        if (hizb && hizb !== currentHizb) {
          currentHizb = hizb;
          updateItem(mbHizb, hizb);
        }
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* تشغيل أولي */
  setTimeout(onScroll, 100);
}

/* ============================================================
   جلب السورة (مع metadata لكل آية)
   ============================================================ */
async function fetchSurah(number) {
  try {
    const [infoRes, versesRes, metaRes] = await Promise.all([
      fetch(`${QURAN_API_V4}/chapters/${number}?language=ar`),
      fetch(`${QURAN_API_V4}/quran/verses/uthmani?chapter_number=${number}`),
      fetch(`${QURAN_API_V4}/verses/by_chapter/${number}?fields=page_number,juz_number,hizb_number&per_page=300`)
    ]);

    const infoData = await infoRes.json();
    const versesData = await versesRes.json();
    const metaData = await metaRes.json();

    const chapter = infoData.chapter;
    if (!chapter || !versesData.verses) throw new Error('فشل');

    /* خريطة metadata: verse_key → { page, juz, hizb } */
    const metaMap = {};
    (metaData.verses || []).forEach(v => {
      metaMap[v.verse_key] = {
        page: v.page_number || 1,
        juz:  v.juz_number  || 1,
        hizb: v.hizb_number || 1,
      };
    });

    return {
      number: chapter.id,
      name: `سُورَةُ ${chapter.name_arabic}`,
      arabicName: chapter.name_arabic,
      revelationType: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
      numberOfAyahs: chapter.verses_count,
      bismillahPre: chapter.bismillah_pre,
      ayahs: versesData.verses.map(v => {
        const [, a] = v.verse_key.split(':').map(Number);
        const meta = metaMap[v.verse_key] || { page: 1, juz: 1, hizb: 1 };
        return {
          numberInSurah: a,
          number: v.id,
          text: v.text_uthmani,
          verse_key: v.verse_key,
          page: meta.page,
          juz:  meta.juz,
          hizb: meta.hizb,
        };
      }),
      source: '✅ مصحف المدينة النبوية',
    };
  } catch (e) {
    console.warn('المصدر الرسمي فشل، نستخدم الاحتياطي:', e);
  }

  const res = await fetch(`${QURAN_FALLBACK}/surah/${number}/quran-uthmani`);
  const data = await res.json();
  if (data.code !== 200) throw new Error('فشل جلب السورة');
  return { ...data.data, source: 'ℹ️ alquran.cloud' };
}

/* ============================================================
   عرض السورة
   ============================================================ */
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
    el.dataset.page = ayah.page || 1;
    el.dataset.juz  = ayah.juz  || 1;
    el.dataset.hizb = ayah.hizb || 1;

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
          <button class="tafsir-btn" data-tip="تفسير" aria-label="تفسير">
            <span class="va-ico">📖</span>
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

    /* إظهار الأزرار عند الضغط على النص */
    el.querySelector('.v-text').addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = el.classList.contains('active');
      document.querySelectorAll('.verse.active').forEach(v => v.classList.remove('active'));
      if (!isActive) el.classList.add('active');
    });

    /* الاستماع */
    el.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
      el.classList.add('playing');
      playAyah(data.number, ayah.numberInSurah);
    });

    /* المفضلة */
    el.querySelector('.bookmark-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const added = toggleBookmark(ayah.numberInSurah);
      e.currentTarget.classList.toggle('active', added);
    });

    /* التفسير */
    el.querySelector('.tafsir-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openTafsir(data.number, ayah.numberInSurah, text.trim());
    });

    /* النسخ */
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

    /* المشاركة */
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

  const prevBtn = document.getElementById('prevSurah');
  const nextBtn = document.getElementById('nextSurah');
  prevBtn.disabled = data.number <= 1;
  nextBtn.disabled = data.number >= 114;
  prevBtn.onclick = () => location.href = `surah.html?n=${data.number - 1}`;
  nextBtn.onclick = () => location.href = `surah.html?n=${data.number + 1}`;

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

/* ============================================================
   الصوت
   ============================================================ */
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

/* ============================================================
   التهيئة
   ============================================================ */
async function initSurahPage() {
  const params = new URLSearchParams(location.search);
  const num = parseInt(params.get('n'), 10) || 1;

  initTafsirEvents();

  try {
    const data = await fetchSurah(num);
    renderSurah(data);

    const pos = await fetchMushafPosition(num);
    renderMushafBar(pos);

    /* بدء تتبع التمرير بعد ظهور الآيات */
    setTimeout(initScrollTracker, 400);

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