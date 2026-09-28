/* ============================================================
   tafsir.js — صفحة تفسير القرآن
   ============================================================ */

const QURAN_API_V4 = 'https://api.quran.com/api/v4';
const TAFSIR_SOURCE_KEY = 'wirdi_tafsir_source';
const TAFSIR_CACHE_PREFIX = 'tafsir_cache_';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;

let ALL_SURAHS = [];
let CURRENT_SURAH = null;
let CURRENT_SOURCE = 'ar-tafsir-muyassar';

/* خريطة مبدئية للتفاسير — تُحدَّث ديناميكيًا من API */
let TAFSIR_ID_MAP = {
  'ar-tafsir-muyassar':      169,
  'ar-tafsir-jalalayn':      168,
  'ar-tafseer-al-saddi':     91,
  'ar-tafsir-ibn-kathir':    164,
  'ar-tafsir-tabari':        166,
  'ar-tafsir-qurtubi':       90,
  'ar-tafsir-baghawi':       94,
};
let TAFSIR_ID_MAP_LOADED = false;
let searchQuery = '';

function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}

function getCache(key) {
  try {
    const raw = localStorage.getItem(TAFSIR_CACHE_PREFIX + key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (Date.now() - obj.time > CACHE_TTL) {
      localStorage.removeItem(TAFSIR_CACHE_PREFIX + key);
      return null;
    }
    return obj.data;
  } catch { return null; }
}

function setCache(key, data) {
  try {
    localStorage.setItem(TAFSIR_CACHE_PREFIX + key, JSON.stringify({
      time: Date.now(),
      data,
    }));
  } catch {}
}

async function fetchSurahs() {
  const cacheKey = 'surahs_v1';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${QURAN_API_V4}/chapters?language=ar`);
  const data = await res.json();
  if (!data.chapters) throw new Error('فشل جلب السور');

  const surahs = data.chapters.map(c => ({
    number: c.id,
    name: `سُورَةُ ${c.name_arabic}`,
    arabicName: c.name_arabic,
    numberOfAyahs: c.verses_count,
    revelationType: c.revelation_place === 'makkah' ? 'مكية' : 'مدنية',
  }));

  setCache(cacheKey, surahs);
  return surahs;
}

function renderSurahList() {
  const list = document.getElementById('tafsirSurahList');
  let surahs = ALL_SURAHS.slice();

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    surahs = surahs.filter(s =>
      s.arabicName.includes(q) ||
      s.name.includes(q) ||
      s.number.toString() === q ||
      toAr(s.number) === q
    );
  }

  if (!surahs.length) {
    list.innerHTML = '<div class="loading">🔍 لا توجد نتائج</div>';
    return;
  }

  list.innerHTML = '';
  surahs.forEach(s => {
    const a = document.createElement('a');
    a.className = 'surah-row fade-in';
    a.href = `?n=${s.number}`;
    a.dataset.type = s.revelationType === 'مكية' ? 'Meccan' : 'Medinan';
    a.innerHTML = `
      <div class="sr-num">${toAr(s.number)}</div>
      <div class="sr-info">
        <div class="sr-name">${s.name}</div>
        <div class="sr-meta">
          <span class="sr-type">${s.revelationType}</span>
          <span>${toAr(s.numberOfAyahs)} آية</span>
        </div>
      </div>
      <span class="sr-badge">📖</span>
    `;
    list.appendChild(a);
  });
}

async function fetchSurahVerses(surahNum) {
  const cacheKey = `surah_${surahNum}_v1`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const [infoRes, versesRes] = await Promise.all([
    fetch(`${QURAN_API_V4}/chapters/${surahNum}?language=ar`),
    fetch(`${QURAN_API_V4}/quran/verses/uthmani?chapter_number=${surahNum}`)
  ]);

  const infoData = await infoRes.json();
  const versesData = await versesRes.json();

  if (!infoData.chapter || !versesData.verses) throw new Error('فشل جلب السورة');

  const surah = {
    number: infoData.chapter.id,
    name: infoData.chapter.name_arabic,
    fullName: `سُورَةُ ${infoData.chapter.name_arabic}`,
    numberOfAyahs: infoData.chapter.verses_count,
    revelationType: infoData.chapter.revelation_place === 'makkah' ? 'مكية' : 'مدنية',
    ayahs: versesData.verses.map(v => {
      const [, a] = v.verse_key.split(':').map(Number);
      return {
        numberInSurah: a,
        text: v.text_uthmani,
        verse_key: v.verse_key,
      };
    }),
  };

  setCache(cacheKey, surah);
  return surah;
}

async function fetchTafsir(surahNum, ayahNum) {
/* تحميل خريطة الأسماء ← الأرقام من API */
async function loadTafsirIds() {
  if (TAFSIR_ID_MAP_LOADED) return;
  try {
    const res = await fetch('https://api.quran.com/api/v4/resources/tafsirs');
    const data = await res.json();
    if (data.tafsirs && data.tafsirs.length) {
      const found = {};
      data.tafsirs.forEach(t => {
        if (t.slug) found[t.slug] = t.id;
      });
      console.log('📖 التفاسير المتوفرة من API:', found);
      TAFSIR_ID_MAP = { ...TAFSIR_ID_MAP, ...found };
      TAFSIR_ID_MAP_LOADED = true;
    }
  } catch (e) {
    console.warn('⚠️ فشل تحميل قائمة التفاسير:', e);
  }
}

  const key = `${CURRENT_SOURCE}_${surahNum}_${ayahNum}`;
  const cached = getCache(key);
  if (cached) return cached;

  await loadTafsirIds(); const tafsirId = TAFSIR_ID_MAP[CURRENT_SOURCE] || 169; const url = `${QURAN_API_V4}/tafsirs/${tafsirId}/by_ayah/${surahNum}:${ayahNum}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);

  const data = await res.json();
  const tafsir = data.tafsir || (data.tafsirs && data.tafsirs[0]);
  if (!tafsir || !tafsir.text) throw new Error('لا يوجد تفسير');

  const cleanText = tafsir.text.replace(/<[^>]*>/g, '').trim();
  setCache(key, cleanText);
  return cleanText;
}

async function renderTafsirView(surahNum) {
  const surahView = document.getElementById('surahView');
  const tafsirView = document.getElementById('tafsirView');
  const infoBox = document.getElementById('tafsirSurahInfo');
  const listBox = document.getElementById('tafsirList');
  const progress = document.querySelector('.tafsir-progress');
  const progressCount = document.getElementById('tafsirProgressCount');
  const pageTitle = document.getElementById('tafsirPageTitle');

  surahView.hidden = true;
  tafsirView.hidden = false;

  infoBox.innerHTML = '<div class="loading">⏳ جارٍ تحميل…</div>';
  listBox.innerHTML = '';

  try {
    const surah = await fetchSurahVerses(surahNum);
    CURRENT_SURAH = surah;

    pageTitle.textContent = `تفسير ${surah.fullName}`;
    document.title = `تفسير ${surah.fullName} — وِرْدِي`;

    infoBox.innerHTML = `
      <h3>${surah.fullName}</h3>
      <div class="info-meta">
        <span>📖 ${toAr(surah.numberOfAyahs)} آية</span>
        <span>🕌 ${surah.revelationType}</span>
        <span>📿 ${toAr(surah.number)}</span>
      </div>
    `;

    surah.ayahs.forEach((ayah) => {
      const el = document.createElement('div');
      el.className = 'tafsir-card fade-in';
      el.dataset.ayah = ayah.numberInSurah;

      el.innerHTML = `
        <div class="tafsir-card-head">
          <span class="tafsir-ayah-num">
            آية <span class="num">${toAr(ayah.numberInSurah)}</span>
          </span>
          <div class="tafsir-card-actions">
            <button class="copy-btn" title="نسخ التفسير" aria-label="نسخ">
              <span>📋</span>
            </button>
            <button class="open-quran-btn" title="فتح في المصحف" aria-label="فتح">
              <span>📖</span>
            </button>
          </div>
        </div>
        <div class="tafsir-ayah">${ayah.text}</div>
        <div class="tafsir-text" id="tafsir-text-${ayah.numberInSurah}">
          <div class="tafsir-loading-inline">
            <span class="spinner"></span>
            <span>جارٍ التحميل…</span>
          </div>
        </div>
      `;

      el.querySelector('.copy-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        const textEl = el.querySelector('.tafsir-text');
        const text = `${ayah.text}\n\n[التفسير]\n${textEl.textContent}`;
        try {
          await navigator.clipboard.writeText(text);
          const btn = e.currentTarget;
          btn.innerHTML = '<span>✓</span>';
          setTimeout(() => { btn.innerHTML = '<span>📋</span>'; }, 1200);
        } catch {}
      });

      el.querySelector('.open-quran-btn').addEventListener('click', () => {
        location.href = `surah.html?n=${surahNum}&ayah=${ayah.numberInSurah}`;
      });

      listBox.appendChild(el);
    });

    progress.classList.remove('done');
    progress.innerHTML = `<span>جارٍ تحميل التفسير…</span><span id="tafsirProgressCount">٠ / ${toAr(surah.ayahs.length)}</span>`;

    let loaded = 0;
    const total = surah.ayahs.length;
    const BATCH = 5;

    for (let i = 0; i < total; i += BATCH) {
      const batch = surah.ayahs.slice(i, i + BATCH);
      await Promise.all(batch.map(async (ayah) => {
        const box = document.getElementById(`tafsir-text-${ayah.numberInSurah}`);
        if (!box) return;
        try {
          const text = await fetchTafsir(surahNum, ayah.numberInSurah);
          const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
          box.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        } catch (err) {
          console.warn('فشل تفسير', ayah.numberInSurah, err);
          box.innerHTML = '<div class="tafsir-error">⚠️ تعذّر تحميل التفسير لهذه الآية</div>';
        } finally {
          loaded++;
          const pc = document.getElementById('tafsirProgressCount');
          if (pc) pc.textContent = `${toAr(loaded)} / ${toAr(total)}`;
        }
      }));
    }

    progress.classList.add('done');
    progress.innerHTML = `<span>✅ تم تحميل التفسير كاملًا</span><span>${toAr(total)} آية</span>`;

    const prevBtn = document.getElementById('tafsirPrevSurah');
    const nextBtn = document.getElementById('tafsirNextSurah');
    prevBtn.disabled = surahNum <= 1;
    nextBtn.disabled = surahNum >= 114;
    prevBtn.onclick = () => location.href = `?n=${surahNum - 1}`;
    nextBtn.onclick = () => location.href = `?n=${surahNum + 1}`;

  } catch (e) {
    console.error(e);
    infoBox.innerHTML = '';
    listBox.innerHTML = '<div class="loading">❌ تعذّر تحميل التفسير. تحقق من الاتصال.</div>';
    progress.hidden = true;
  }
}

async function initTafsirPage() {
  const savedSource = localStorage.getItem(TAFSIR_SOURCE_KEY);
  if (savedSource) CURRENT_SOURCE = savedSource;

  const selectBox = document.getElementById('tafsirSource');
  if (selectBox) {
    selectBox.value = CURRENT_SOURCE;
    selectBox.addEventListener('change', () => {
      CURRENT_SOURCE = selectBox.value;
      localStorage.setItem(TAFSIR_SOURCE_KEY, CURRENT_SOURCE);
      const params = new URLSearchParams(location.search);
      const num = parseInt(params.get('n'), 10);
      if (num) {
        Object.keys(localStorage)
          .filter(k => k.startsWith(TAFSIR_CACHE_PREFIX + 'ar-'))
          .forEach(k => localStorage.removeItem(k));
        location.reload();
      }
    });
  }

  try {
    ALL_SURAHS = await fetchSurahs();
    renderSurahList();
  } catch (e) {
    console.error(e);
    document.getElementById('tafsirSurahList').innerHTML =
      '<div class="loading">❌ تعذّر تحميل السور.</div>';
  }

  const searchInput = document.getElementById('tafsirSearch');
  const clearBtn = document.getElementById('tafsirClearSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearBtn.style.display = searchQuery ? 'block' : 'none';
      renderSurahList();
    });
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderSurahList();
    });
  }

  const backToListBtn = document.getElementById('tafsirBackToList');
  if (backToListBtn) {
    backToListBtn.addEventListener('click', () => {
      location.href = 'tafsir.html';
    });
  }

  const params = new URLSearchParams(location.search);
  const num = parseInt(params.get('n'), 10);
  if (num >= 1 && num <= 114) {
    renderTafsirView(num);
  }
}

document.addEventListener('DOMContentLoaded', initTafsirPage);