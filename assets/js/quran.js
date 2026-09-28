/* ============ صفحة القرآن — قائمة السور ============ */

const QURAN_API_V4 = 'https://api.quran.com/api/v4';
const QURAN_FALLBACK = 'https://api.alquran.cloud/v1';
const SURAH_CACHE_KEY = 'quran_surahs_v3';   // محدّث لتفادي الكاش القديم
const LAST_READ_KEY = 'quran_last_read';

let ALL_SURAHS = [];
let currentFilter = 'all';
let searchQuery = '';

function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}

async function fetchSurahs() {
  const cached = localStorage.getItem(SURAH_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  // المصدر الرسمي: مصحف المدينة
  try {
    const res = await fetch(`${QURAN_API_V4}/chapters?language=ar`);
    const data = await res.json();

    if (data.chapters && data.chapters.length) {
      const surahs = data.chapters.map(c => ({
        number: c.id,
        name: `سُورَةُ ${c.name_arabic}`,
        arabicName: c.name_arabic,
        englishName: c.name_simple,
        numberOfAyahs: c.verses_count,
        revelationType: c.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
        bismillahPre: c.bismillah_pre,
      }));

      localStorage.setItem(SURAH_CACHE_KEY, JSON.stringify(surahs));
      return surahs;
    }
  } catch (e) {
    console.warn('المصدر الرسمي فشل، نستخدم الاحتياطي:', e);
  }

  // الاحتياطي
  const res = await fetch(`${QURAN_FALLBACK}/surah`);
  const data = await res.json();
  if (data.code !== 200) throw new Error('فشل جلب السور');

  const surahs = data.data.map(s => ({
    number: s.number,
    name: s.name,
    arabicName: s.name.replace('سُورَةُ ', ''),
    englishName: s.englishName,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType,
    bismillahPre: s.number !== 1 && s.number !== 9,
  }));

  localStorage.setItem(SURAH_CACHE_KEY, JSON.stringify(surahs));
  return surahs;
}

function renderSurahs() {
  const list = document.getElementById('surahList');
  let surahs = ALL_SURAHS.slice();

  if (currentFilter !== 'all') {
    surahs = surahs.filter(s => s.revelationType === currentFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    surahs = surahs.filter(s =>
      s.arabicName.includes(q) ||
      s.name.includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
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
    const typeAr = s.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
    const a = document.createElement('a');
    a.className = 'surah-row fade-in';
    a.href = `surah.html?n=${s.number}`;
    a.dataset.type = s.revelationType;
    a.innerHTML = `
      <div class="sr-num">${toAr(s.number)}</div>
      <div class="sr-info">
        <div class="sr-name">${s.name}</div>
        <div class="sr-meta">
          <span class="sr-type">${typeAr}</span>
          <span>${toAr(s.numberOfAyahs)} آية</span>
        </div>
      </div>
      <span class="sr-badge">★</span>
    `;
    list.appendChild(a);
  });
}

function renderContinue() {
  const last = LS.get(LAST_READ_KEY, null);
  if (!last) return;
  const card = document.getElementById('continueCard');
  const val = document.getElementById('ccValue');
  card.style.display = 'flex';
  val.textContent = `${last.surahName} — آية ${toAr(last.ayah)}`;

  document.getElementById('continueBtn').addEventListener('click', () => {
    location.href = `surah.html?n=${last.surah}&ayah=${last.ayah}`;
  });
}

async function initQuranPage() {
  try {
    ALL_SURAHS = await fetchSurahs();
    renderSurahs();
    renderContinue();
  } catch (e) {
    console.error(e);
    document.getElementById('surahList').innerHTML =
      '<div class="loading">❌ تعذّر تحميل السور. تحقق من الاتصال.</div>';
  }

  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    renderSurahs();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    renderSurahs();
  });

  document.querySelectorAll('.ft').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ft').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderSurahs();
    });
  });
}

document.addEventListener('DOMContentLoaded', initQuranPage);