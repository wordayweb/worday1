/* ============ صفحة السورة — مصحف المدينة النبوية (a11y) ============ */

const QURAN_API_V4 = 'https://api.quran.com/api/v4';
const QURAN_FALLBACK = 'https://api.alquran.cloud/v1';
const ALQURAN_API = 'https://api.alquran.cloud/v1';
const LAST_READ_KEY = 'quran_last_read';
const BOOKMARKS_KEY = 'quran_bookmarks';
const RECITER_KEY = 'quran_reciter';
const TAFSIR_SOURCE_KEY = 'wirdi_tafsir_source_v3';
const TAFSIR_CACHE_PREFIX = 'tafsir_v3_';

const TAFSIR_SLUGS = { 'muyassar': 'ar.muyassar', 'jalalayn': 'ar.jalalayn' };

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

/* ===== قارئ الشاشة ===== */
function liveRegion() {
  let el = document.getElementById('wirdi-live');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wirdi-live';
    el.className = 'sr-only';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
  }
  return el;
}
function announce(msg) {
  const el = liveRegion();
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 50);
}

function getBookmarks() { return LS.get(BOOKMARKS_KEY, []); }
function toggleBookmark(ayah) {
  const list = getBookmarks();
  const idx = list.findIndex(b => b.surah === CURRENT.number && b.ayah === ayah);
  if (idx !== -1) list.splice(idx, 1);
  else list.push({ surah: CURRENT.number, surahName: CURRENT.name, ayah, time: Date.now() });
  LS.set(BOOKMARKS_KEY, list);
  return idx === -1;
}

/* ===== التفسير ===== */
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
  try { localStorage.setItem(TAFSIR_CACHE_PREFIX + key, JSON.stringify({ time: Date.now(), data })); } catch {}
}
async function fetchTafsir(surahNum, ayahNum) {
  const key = `${CURRENT_TAFSIR}_${surahNum}_${ayahNum}`;
  const cached = getTafsirCache(key);
  if (cached) return cached;
  const slug = TAFSIR_SLUGS[CURRENT_TAFSIR] || 'ar.muyassar';
  const url = `${ALQURAN_API}/ayah/${surahNum}:${ayahNum}/${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.code !== 200 || !data.data || !data.data.text) throw new Error('لا يوجد تفسير');
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
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'tafsirTitle');
  modal.setAttribute('aria-describedby', 'tafsirSubtitle');
  document.body.style.overflow = 'hidden';
  const tafsirName = CURRENT_TAFSIR === 'jalalayn' ? 'تفسير الجلالين' : 'التفسير الميسر';
  title.textContent = tafsirName;
  subtitle.textContent = `سورة ${CURRENT.arabicName} — آية ${toAr(ayahNum)}`;
  verseBox.textContent = ayahText || '';
  sourceEl.textContent = 'المصدر: alquran.cloud';
  body.innerHTML = '<div class="tafsir-loading" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span><span>جارٍ تحميل التفسير…</span></div>';
  setTimeout(() => {
    const closeBtn = document.getElementById('tafsirClose');
    if (closeBtn) closeBtn.focus();
  }, 50);
  fetchTafsir(surahNum, ayahNum)
    .then((text) => {
      const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      body.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    })
    .catch((err) => {
      console.warn('فشل التفسير:', err);
      body.innerHTML = `<div class="tafsir-error" role="alert">⚠️ تعذّر تحميل التفسير. تحقق من الاتصال.</div>`;
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
  if (closeBtn) { closeBtn.setAttribute('aria-label', 'إغلاق نافذة التفسير'); closeBtn.addEventListener('click', closeTafsir); }
  if (backdrop) { backdrop.setAttribute('aria-hidden', 'true'); backdrop.addEventListener('click', closeTafsir); }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeTafsir();
  });
  if (copyBtn) {
    copyBtn.setAttribute('aria-label', 'انسخ الآية مع التفسير');
    copyBtn.addEventListener('click', async () => {
      const verseBox = document.getElementById('tafsirVerse');
      const body = document.getElementById('tafsirBody');
      const text = `${verseBox.textContent}\n\n[التفسير]\n${body.textContent}`;
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = '✓ تم النسخ';
        announce('تم نسخ الآية مع التفسير');
        setTimeout(() => { copyBtn.textContent = original; }, 1500);
      } catch {}
    });
  }
  const savedSource = localStorage.getItem(TAFSIR_SOURCE_KEY);
  if (savedSource && TAFSIR_SLUGS[savedSource]) CURRENT_TAFSIR = savedSource;
}

/* ===== موقع المصحف ===== */
async function fetchMushafPosition(surahNum) {
  const pick = (obj, ...keys) => { for (const k of keys) if (obj && obj[k] != null) return obj[k]; return null; };
  try {
    const url = `${QURAN_API_V4}/verses/by_chapter/${surahNum}?fields=page_number,juz_number,hizb_number&per_page=300`;
    const res = await fetch(url);
    const data = await res.json();
    const verses = data.verses || [];
    if (verses.length > 0) {
      const first = verses[0], last = verses[verses.length - 1];
      const juzStart = pick(first, 'juz_number') || 1, juzEnd = pick(last, 'juz_number') || juzStart;
      const pageStart = pick(first, 'page_number') || 1, pageEnd = pick(last, 'page_number') || pageStart;
      const hizbStart = pick(first, 'hizb_number') || 1, hizbEnd = pick(last, 'hizb_number') || hizbStart;
      if (pageStart !== 1 || juzStart !== 1) return { juzStart, juzEnd, pageStart, pageEnd, hizbStart, hizbEnd };
    }
  } catch (e) {}
  try {
    const url = `${QURAN_API_V4}/chapters/${surahNum}?language=ar`;
    const res = await fetch(url);
    const data = await res.json();
    const chapter = data.chapter || {};
    const pages = chapter.pages || [];
    const pageStart = pages.length > 0 ? pages[0] : 1;
    const pageEnd = pages.length > 0 ? pages[pages.length - 1] : pageStart;
    const juzStart = Math.max(1, Math.ceil(pageStart / 20));
    const juzEnd = Math.max(1, Math.ceil(pageEnd / 20));
    return { juzStart, juzEnd, pageStart, pageEnd, hizbStart: (juzStart - 1) * 2 + 1, hizbEnd: (juzEnd - 1) * 2 + 2 };
  } catch (e) {}
  return { juzStart: 1, juzEnd: 1, pageStart: 1, pageEnd: 1, hizbStart: 1, hizbEnd: 1 };
}
function renderMushafBar(pos) {
  if (!pos) return;
  const fmt = (a, b) => a === b ? toAr(a) : `${toAr(a)} - ${toAr(b)}`;
  const $ = id => document.getElementById(id);
  if ($('mbJuz')) $('mbJuz').textContent = fmt(pos.juzStart, pos.juzEnd);
  if ($('mbPage')) $('mbPage').textContent = fmt(pos.pageStart, pos.pageEnd);
  if ($('mbHizb')) $('mbHizb').textContent = fmt(pos.hizbStart, pos.hizbEnd);
}

/* ===== المؤشر الديناميكي ===== */
function initScrollTracker() {
  const verses = document.querySelectorAll('.verse');
  if (!verses.length) return;
  const mbJuz = document.getElementById('mbJuz');
  const mbPage = document.getElementById('mbPage');
  const mbHizb = document.getElementById('mbHizb');
  if (!mbJuz || !mbPage || !mbHizb) return;
  let currentJuz = null, currentPage = null, currentHizb = null;
  function updateItem(el, newValue) {
    const newText = toAr(newValue);
    if (el.textContent === newText) return;
    el.textContent = newText;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vt = 150; let closest = null, closestDist = Infinity;
      for (const v of verses) {
        const rect = v.getBoundingClientRect();
        const dist = Math.abs(rect.top - vt);
        if (rect.bottom > 0 && dist < closestDist) { closest = v; closestDist = dist; }
      }
      if (closest) {
        const page = parseInt(closest.dataset.page, 10);
        const juz = parseInt(closest.dataset.juz, 10);
        const hizb = parseInt(closest.dataset.hizb, 10);
        if (page && page !== currentPage) { currentPage = page; updateItem(mbPage, page); }
        if (juz && juz !== currentJuz) { currentJuz = juz; updateItem(mbJuz, juz); }
        if (hizb && hizb !== currentHizb) { currentHizb = hizb; updateItem(mbHizb, hizb); }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  setTimeout(onScroll, 100);
}

/* ===== جلب السورة ===== */
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
    const metaMap = {};
    (metaData.verses || []).forEach(v => {
      metaMap[v.verse_key] = { page: v.page_number || 1, juz: v.juz_number || 1, hizb: v.hizb_number || 1 };
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
        return { numberInSurah: a, number: v.id, text: v.text_uthmani, verse_key: v.verse_key, page: meta.page, juz: meta.juz, hizb: meta.hizb };
      }),
      source: '✅ مصحف المدينة النبوية',
    };
  } catch (e) {}
  const res = await fetch(`${QURAN_FALLBACK}/surah/${number}/quran-uthmani`);
  const data = await res.json();
  if (data.code !== 200) throw new Error('فشل جلب السورة');
  return { ...data.data, source: 'ℹ️ alquran.cloud' };
}

/* ===== عرض السورة ===== */
function renderSurah(data) {
  CURRENT = data;
  document.getElementById('surahTitle').textContent = data.name;
  document.title = `${data.name} — وِرْدِي`;
  const typeAr = data.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
  document.getElementById('surahInfo').innerHTML = `
    <h3>سورة ${data.arabicName || data.name.replace('سُورَةُ ', '')}</h3>
    <div class="si-meta" aria-label="بيانات السورة">
      <span><span aria-hidden="true">📖</span> ${toAr(data.numberOfAyahs)} آية</span>
      <span><span aria-hidden="true">🕌</span> ${typeAr}</span>
      <span><span aria-hidden="true">📿</span> ${toAr(data.number)}</span>
    </div>
    <div class="source-badge">${data.source || '✅ مصحف المدينة النبوية'}</div>
  `;
  const bismillah = document.getElementById('bismillah');
  if (data.number === 1 || data.number === 9) bismillah.classList.add('hidden');
  else bismillah.classList.remove('hidden');
  const versesBox = document.getElementById('verses');
  versesBox.innerHTML = '';
  versesBox.setAttribute('role', 'region');
  versesBox.setAttribute('aria-label', `آيات سورة ${data.arabicName}`);
  const bookmarks = getBookmarks();
  const isBookmarked = (s, a) => bookmarks.some(b => b.surah === s && b.ayah === a);
  data.ayahs.forEach((ayah, idx) => {
    let text = ayah.text;
    if (idx === 0 && data.number !== 1 && data.number !== 9) {
      text = text.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/u, '');
    }
    const isFav = isBookmarked(data.number, ayah.numberInSurah);
    const el = document.createElement('div');
    el.className = 'verse fade-in';
    el.id = `ayah-${ayah.numberInSurah}`;
    el.dataset.ayah = ayah.numberInSurah;
    el.dataset.page = ayah.page || 1;
    el.dataset.juz = ayah.juz || 1;
    el.dataset.hizb = ayah.hizb || 1;
    el.setAttribute('role', 'article');
    el.setAttribute('aria-label', `الآية ${toAr(ayah.numberInSurah)}`);
    el.innerHTML = `
      <div class="v-body">
        <p class="v-text">
          ${text}
          <span class="v-num" aria-label="رقم الآية">${toAr(ayah.numberInSurah)}</span>
        </p>
        <div class="v-actions" role="group" aria-label="خيارات الآية ${toAr(ayah.numberInSurah)}">
          <button type="button" class="play-btn" aria-label="استمع للآية ${toAr(ayah.numberInSurah)}">
            <span class="va-ico" aria-hidden="true">▶</span>
          </button>
          <button type="button" class="bookmark-btn ${isFav ? 'active' : ''}"
                  aria-label="${isFav ? 'إزالة الآية من المفضلة' : 'أضف الآية إلى المفضلة'}"
                  aria-pressed="${isFav ? 'true' : 'false'}">
            <span class="va-ico" aria-hidden="true">🔖</span>
          </button>
          <button type="button" class="tafsir-btn" aria-label="افتح تفسير الآية">
            <span class="va-ico" aria-hidden="true">📖</span>
          </button>
          <button type="button" class="copy-btn" aria-label="انسخ الآية">
            <span class="va-ico" aria-hidden="true">📋</span>
          </button>
          <button type="button" class="share-btn" aria-label="شارك الآية">
            <span class="va-ico" aria-hidden="true">📤</span>
          </button>
        </div>
      </div>
    `;
    el.querySelector('.v-text').addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = el.classList.contains('active');
      document.querySelectorAll('.verse.active').forEach(v => v.classList.remove('active'));
      if (!isActive) el.classList.add('active');
    });
    el.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
      el.classList.add('playing');
      playAyah(data.number, ayah.numberInSurah);
    });
    el.querySelector('.bookmark-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const added = toggleBookmark(ayah.numberInSurah);
      btn.classList.toggle('active', added);
      btn.setAttribute('aria-pressed', added ? 'true' : 'false');
      btn.setAttribute('aria-label', added ? 'إزالة الآية من المفضلة' : 'أضف الآية إلى المفضلة');
      announce(added ? 'أُضيفت الآية إلى المفضلة' : 'أُزيلت الآية من المفضلة');
    });
    el.querySelector('.tafsir-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openTafsir(data.number, ayah.numberInSurah, text.trim());
    });
    el.querySelector('.copy-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const t = `${text} (${data.arabicName || data.name}: ${toAr(ayah.numberInSurah)})`;
      try {
        await navigator.clipboard.writeText(t);
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="va-ico" aria-hidden="true">✓</span>';
        btn.setAttribute('aria-label', 'تم نسخ الآية');
        announce('تم نسخ الآية');
        setTimeout(() => { btn.innerHTML = original; btn.setAttribute('aria-label', 'انسخ الآية'); }, 1200);
      } catch {}
    });
    el.querySelector('.share-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const t = `${text}\n\n[${data.arabicName || data.name}: ${toAr(ayah.numberInSurah)}]`;
      if (navigator.share) { try { await navigator.share({ title: data.name, text: t }); } catch {} }
      else {
        try {
          await navigator.clipboard.writeText(t);
          const original = btn.innerHTML;
          btn.innerHTML = '<span class="va-ico" aria-hidden="true">✓</span>';
          btn.setAttribute('aria-label', 'تم نسخ الآية');
          announce('تم نسخ الآية للمشاركة');
          setTimeout(() => { btn.innerHTML = original; btn.setAttribute('aria-label', 'شارك الآية'); }, 1200);
        } catch {}
      }
    });
    versesBox.appendChild(el);
  });
  const prevBtn = document.getElementById('prevSurah');
  const nextBtn = document.getElementById('nextSurah');
  prevBtn.disabled = data.number <= 1;
  nextBtn.disabled = data.number >= 114;
  prevBtn.setAttribute('aria-label', 'السورة السابقة');
  nextBtn.setAttribute('aria-label', 'السورة التالية');
  prevBtn.onclick = () => location.href = `surah.html?n=${data.number - 1}`;
  nextBtn.onclick = () => location.href = `surah.html?n=${data.number + 1}`;
  const params = new URLSearchParams(location.search);
  const ayahParam = parseInt(params.get('ayah'), 10) || 1;
  LS.set(LAST_READ_KEY, { surah: data.number, surahName: data.name, ayah: ayahParam, time: Date.now() });
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
  const menuBtn = document.getElementById('surahMenuBtn');
  if (menuBtn) {
    menuBtn.setAttribute('aria-label', 'قائمة خيارات السورة');
    menuBtn.onclick = () => {
      const curReciter = LS.get(RECITER_KEY, 'Alafasy');
      const choice = prompt(
        `اختر العملية:\n\n1 = تشغيل السورة كاملة\n2 = إيقاف الصوت\n3 = نسخ السورة كاملة\n4 = تغيير القارئ\n\n—— القارئ الحالي: ${RECITERS[curReciter].name} ——`
      );
      if (choice === '1') playFullSurah();
      else if (choice === '2') stopAudio();
      else if (choice === '3') copyFullSurah();
      else if (choice === '4') changeReciter();
    };
  }
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

/* ===== الصوت ===== */
function initAudio() {
  if (audioEl) return;
  audioEl = new Audio();
  audioEl.addEventListener('timeupdate', updateProgress);
  audioEl.addEventListener('loadedmetadata', updateProgress);
  audioEl.addEventListener('ended', () => {
    const p = document.getElementById('apPlay');
    if (p) p.textContent = '▶';
    document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
  });
}
function pad(n, len = 3) { return String(n).padStart(len, '0'); }
function playAyah(surahNum, ayahNum) {
  initAudio();
  const reciter = LS.get(RECITER_KEY, 'Alafasy');
  const slug = RECITERS[reciter]?.slug || 'Alafasy';
  const url = `https://verses.quran.com/${slug}/mp3/${pad(surahNum)}${pad(ayahNum)}.mp3`;
  audioEl.src = url;
  audioEl.play().catch(() => alert('⚠️ تعذّر تشغيل التلاوة.'));
  const player = document.getElementById('audioPlayer');
  if (player) player.style.display = 'flex';
  document.getElementById('apTitle').textContent = `${CURRENT.name} — آية ${toAr(ayahNum)} (${RECITERS[reciter].name})`;
  document.getElementById('apPlay').textContent = '⏸';
  document.getElementById('apPlay').setAttribute('aria-label', 'إيقاف التلاوة');
  announce(`يتم تشغيل الآية ${toAr(ayahNum)}`);
}
function playFullSurah() {
  initAudio();
  const reciter = LS.get(RECITER_KEY, 'Alafasy');
  const map = { Alafasy: 'ar.alafasy', AbdulBaset: 'ar.abdulbasitmurattal', Minshawy_Murattal_128kbps: 'ar.minshawi', Husary: 'ar.husary', Sudais: 'ar.abdurrahmaansudais', Maher: 'ar.mahermuaiqly', Ajamy: 'ar.ahmedajamy', Ghamadi: 'ar.saoodshuraym' };
  const apiReciter = map[reciter] || 'ar.alafasy';
  const url = `https://cdn.islamic.network/quran/audio-surah/128/${apiReciter}/${CURRENT.number}.mp3`;
  audioEl.src = url;
  audioEl.play().catch(() => alert('⚠️ تعذّر تشغيل السورة'));
  document.getElementById('audioPlayer').style.display = 'flex';
  document.getElementById('apTitle').textContent = `سورة ${CURRENT.arabicName} (${RECITERS[reciter].name})`;
  document.getElementById('apPlay').textContent = '⏸';
  document.getElementById('apPlay').setAttribute('aria-label', 'إيقاف التلاوة');
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
    const p = document.getElementById('apPlay');
    if (p) { p.textContent = '▶'; p.setAttribute('aria-label', 'تشغيل التلاوة'); }
    document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
    announce('تم إيقاف التلاوة');
  }
}
async function copyFullSurah() {
  const text = CURRENT.ayahs.map(a => a.text).join(' ');
  try { await navigator.clipboard.writeText(text); alert('تم نسخ السورة ✅'); } catch {}
}

/* ===== التهيئة ===== */
async function initSurahPage() {
  const params = new URLSearchParams(location.search);
  const num = parseInt(params.get('n'), 10) || 1;
  initTafsirEvents();
  try {
    const data = await fetchSurah(num);
    renderSurah(data);
    const pos = await fetchMushafPosition(num);
    renderMushafBar(pos);
    setTimeout(initScrollTracker, 400);
    const apPlay = document.getElementById('apPlay');
    if (apPlay) {
      apPlay.setAttribute('aria-label', 'تشغيل التلاوة');
      apPlay.addEventListener('click', () => {
        if (!audioEl) return;
        if (audioEl.paused) { audioEl.play(); apPlay.textContent = '⏸'; apPlay.setAttribute('aria-label', 'إيقاف التلاوة'); }
        else { audioEl.pause(); apPlay.textContent = '▶'; apPlay.setAttribute('aria-label', 'تشغيل التلاوة'); }
      });
    }
    const apProgress = document.getElementById('apProgress');
    if (apProgress) {
      apProgress.setAttribute('role', 'slider');
      apProgress.setAttribute('aria-label', 'شريط تقدم التلاوة');
      apProgress.addEventListener('click', (e) => {
        if (!audioEl || !audioEl.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        audioEl.currentTime = (1 - (x / rect.width)) * audioEl.duration;
      });
    }
  } catch (e) {
    console.error(e);
    document.getElementById('verses').innerHTML = '<div class="loading" role="alert">❌ تعذّر تحميل السورة. تحقق من الاتصال.</div>';
  }
}
document.addEventListener('DOMContentLoaded', initSurahPage);