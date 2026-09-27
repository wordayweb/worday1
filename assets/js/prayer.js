/* ============ مواقيت الصلاة ============ */

const PRAYER_KEY = 'prayer_settings';
const TIMES_CACHE_KEY = 'prayer_times_cache';

const PRAYER_NAMES = {
  Fajr:    { ar: 'الفجر',   ico: '🌄' },
  Sunrise: { ar: 'الشروق',  ico: '☀️' },
  Dhuhr:   { ar: 'الظهر',   ico: '🌞' },
  Asr:     { ar: 'العصر',   ico: '🌤️' },
  Maghrib: { ar: 'المغرب',  ico: '🌅' },
  Isha:    { ar: 'العشاء',  ico: '🌙' },
};

const ORDERED_PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const DEFAULT_SETTINGS = {
  method: 4,
  school: 0,
  lat: null,
  lng: null,
  cityName: 'الرياض',
  cityDetail: 'السعودية',
  manualLocation: false,
};

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...LS.get(PRAYER_KEY, {}) };
}
function saveSettings(s) { LS.set(PRAYER_KEY, s); }

async function detectLocation() {
  const s = getSettings();
  if (s.manualLocation && s.lat && s.lng) return s;
  if (!navigator.geolocation) return s;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const updated = {
          ...s,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${updated.lat}&lon=${updated.lng}&format=json&accept-language=ar`
          );
          const j = await r.json();
          updated.cityName = j.address?.city || j.address?.town || j.address?.village || 'موقعك';
          updated.cityDetail = [j.address?.state, j.address?.country].filter(Boolean).join('، ');
        } catch {}
        saveSettings(updated);
        resolve(updated);
      },
      () => resolve(s),
      { timeout: 7000, maximumAge: 3600000 }
    );
  });
}

async function fetchTimings(settings) {
  if (!settings.lat || !settings.lng) throw new Error('لا يوجد موقع');

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;
  const cacheKey = `${TIMES_CACHE_KEY}_${dateStr}_${settings.lat.toFixed(3)}_${settings.lng.toFixed(3)}_${settings.method}_${settings.school}`;

  const cached = localStorage.getItem(cacheKey);
  if (cached) { try { return JSON.parse(cached); } catch {} }

  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${settings.lat}&longitude=${settings.lng}&method=${settings.method}&school=${settings.school}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.code !== 200) throw new Error('فشل جلب المواقيت');

  const t = data.data.timings;
  const result = {
    Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr,
    Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha,
    meta: data.data.meta,
  };

  // احذف الكاش القديم
  Object.keys(localStorage)
    .filter(k => k.startsWith(TIMES_CACHE_KEY) && k !== cacheKey)
    .forEach(k => localStorage.removeItem(k));

  localStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
}

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}
function fmtTime12(t) {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return toAr(`${h12}:${String(m).padStart(2,'0')} ${p}`);
}

function getNextPrayer(timings) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const key of ORDERED_PRAYERS) {
    if (timeToMin(timings[key]) > nowMin) return { key, time: timings[key] };
  }
  return { key: 'Fajr', time: timings.Fajr, tomorrow: true };
}

let countdownTimer = null;
function startCountdown(timings) {
  if (countdownTimer) clearInterval(countdownTimer);
  const tick = () => {
    const now = new Date();
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    let target = null, found = false;
    for (const key of ORDERED_PRAYERS) {
      const [h, m] = timings[key].split(':').map(Number);
      const tSec = h * 3600 + m * 60;
      if (tSec > nowSec) { target = { key, sec: tSec }; found = true; break; }
    }
    if (!found) {
      const [h, m] = timings.Fajr.split(':').map(Number);
      target = { key: 'Fajr', sec: (24 * 3600) + h * 3600 + m * 60 };
    }
    let diff = target.sec - nowSec;
    if (diff < 0) diff = 0;
    const hh = Math.floor(diff / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = diff % 60;
    document.getElementById('cdH').textContent = toAr(String(hh).padStart(2, '0'));
    document.getElementById('cdM').textContent = toAr(String(mm).padStart(2, '0'));
    document.getElementById('cdS').textContent = toAr(String(ss).padStart(2, '0'));
    if (diff === 0) setTimeout(() => location.reload(), 2000);
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}

function renderTimes(timings) {
  const list = document.getElementById('timesList');
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  list.innerHTML = '';
  ORDERED_PRAYERS.forEach(key => {
    const info = PRAYER_NAMES[key];
    const passed = timeToMin(timings[key]) < nowMin;
    const li = document.createElement('li');
    li.className = 'time-row' + (passed ? ' passed' : '');
    li.innerHTML = `
      <div class="tr-left">
        <span class="tr-ico">${info.ico}</span>
        <span class="tr-name">${info.ar}</span>
      </div>
      <span class="tr-time">${fmtTime12(timings[key])}</span>
    `;
    list.appendChild(li);
  });
}

function renderNext(timings) {
  const next = getNextPrayer(timings);
  document.getElementById('nextPrayerName').textContent = PRAYER_NAMES[next.key].ar;
  document.getElementById('nextPrayerTime').textContent = fmtTime12(next.time);
}

function renderLocation(settings) {
  document.getElementById('cityName').textContent = settings.cityName || 'موقعك';
  document.getElementById('cityDetail').textContent =
    settings.cityDetail || `${settings.lat?.toFixed(2)}°, ${settings.lng?.toFixed(2)}°`;
}

function renderDate() {
  const d = new Date();
  try {
    document.getElementById('timesDate').textContent =
      new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(d);
  } catch {
    document.getElementById('timesDate').textContent = d.toLocaleDateString('ar');
  }
}

function renderJumua() {
  if (new Date().getDay() === 5) {
    document.getElementById('jumuaNote').style.display = 'flex';
  }
}

function calcQibla(lat, lng) {
  const KABA_LAT = 21.4225, KABA_LNG = 39.8262;
  const toRad = d => d * Math.PI / 180;
  const toDeg = r => r * 180 / Math.PI;
  const dLng = toRad(KABA_LNG - lng);
  const lat1 = toRad(lat), lat2 = toRad(KABA_LAT);
  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
  let deg = toDeg(Math.atan2(y, x));
  if (deg < 0) deg += 360;
  return deg;
}

function renderQibla(settings) {
  if (!settings.lat || !settings.lng) return;
  const deg = calcQibla(settings.lat, settings.lng);
  document.getElementById('qiblaDeg').textContent = toAr(deg.toFixed(1)) + '° من الشمال';
}

async function initPrayerPage() {
  renderDate();
  renderJumua();

  let settings = getSettings();
  if (!settings.lat || !settings.lng) {
    const updated = await detectLocation();
    if (updated.lat) settings = updated;
    else {
      settings.lat = 24.7136;
      settings.lng = 46.6753;
      settings.cityName = 'الرياض';
      settings.cityDetail = 'السعودية';
      saveSettings(settings);
    }
  }

  renderLocation(settings);
  renderQibla(settings);

  try {
    const timings = await fetchTimings(settings);
    renderNext(timings);
    renderTimes(timings);
    startCountdown(timings);
  } catch (e) {
    console.error(e);
    document.getElementById('nextPrayerName').textContent = 'تعذّر الجلب';
    document.getElementById('nextPrayerTime').textContent = 'تحقق من الاتصال';
  }

  document.getElementById('changeLocation').addEventListener('click', () => {
    location.href = 'prayer-settings.html';
  });
  document.getElementById('openQibla').addEventListener('click', () => {
    const deg = calcQibla(settings.lat, settings.lng);
    alert(`🕋 اتجاه القبلة:\n\n${deg.toFixed(1)}° من الشمال`);
  });
}

document.addEventListener('DOMContentLoaded', initPrayerPage);