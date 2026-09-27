/* ============ نظام الأذان — وِرْدِي ============ */

const ADHAN = {
  settings: null,
  prayerTimes: null,
  audio: null,
  lastPlayed: {},
  checkInterval: null,
  preAlerted: {},
};

const ADHAN_KEY = 'adhan_settings';
const TIMES_CACHE_PREFIX = 'prayer_times_cache_';

const DEFAULT_SETTINGS = {
  enabled: true,
  volume: 0.8,
  preAlertMinutes: 5,
  showNotification: true,
  vibrate: true,
  prayers: {
    Fajr:    { enabled: true, sound: true },
    Dhuhr:   { enabled: true, sound: true },
    Asr:     { enabled: true, sound: true },
    Maghrib: { enabled: true, sound: true },
    Isha:    { enabled: true, sound: true },
  }
};

const PRAYER_NAMES_AR = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

/* ---------- تحويل الأرقام ---------- */
function toAr(num) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(num).replace(/[0-9]/g, d => ar[d]);
}

/* ---------- قراءة الإعدادات ---------- */
function getAdhanSettings() {
  const saved = localStorage.getItem(ADHAN_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        prayers: { ...DEFAULT_SETTINGS.prayers, ...(parsed.prayers || {}) },
      };
    } catch { return { ...DEFAULT_SETTINGS }; }
  }
  return { ...DEFAULT_SETTINGS };
}

function saveAdhanSettings(settings) {
  localStorage.setItem(ADHAN_KEY, JSON.stringify(settings));
  ADHAN.settings = settings;
}

/* ---------- جلب مواقيت الصلاة من الكاش ---------- */
function loadPrayerTimes() {
  const settings = JSON.parse(localStorage.getItem('prayer_settings') || 'null');
  if (!settings || !settings.lat) return null;

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const cacheKey = `${TIMES_CACHE_PREFIX}${dateStr}_${settings.lat.toFixed(3)}_${settings.lng.toFixed(3)}_${settings.method}_${settings.school}`;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch { return null; }
}

/* ---------- تحويل الوقت إلى دقائق ---------- */
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/* ---------- الوقت الحالي بالدقائق ---------- */
function nowInMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/* ---------- تشغيل الأذان ---------- */
function playAdhan(prayerKey) {
  const settings = ADHAN.settings;

  /* الصوت */
  if (settings.prayers[prayerKey]?.sound) {
    if (!ADHAN.audio) {
      ADHAN.audio = new Audio('assets/audio/adhan.mp3');
    }
    ADHAN.audio.volume = settings.volume;
    ADHAN.audio.currentTime = 0;
    ADHAN.audio.play().catch(err => {
      console.warn('⚠️ فشل تشغيل الأذان:', err);
    });
  }

  /* الاهتزاز */
  if (settings.vibrate && 'vibrate' in navigator) {
    navigator.vibrate([300, 200, 300, 200, 500, 200, 300]);
  }

  /* الإشعار */
  if (settings.showNotification && 'Notification' in window && Notification.permission === 'granted') {
    const prayerName = PRAYER_NAMES_AR[prayerKey];
    new Notification(`🕌 حان وقت صلاة ${prayerName}`, {
      body: 'الله أكبر — حي على الصلاة',
      icon: 'assets/img/icon-192.png',
      badge: 'assets/img/icon-192.png',
      tag: 'adhan-' + prayerKey,
      requireInteraction: true,
      vibrate: [300, 200, 300],
    });
  }

  /* تسجيل الوقت */
  const todayKey = new Date().toISOString().slice(0, 10);
  ADHAN.lastPlayed[prayerKey] = todayKey;

  /* حدث مخصص */
  window.dispatchEvent(new CustomEvent('adhan:played', {
    detail: { prayer: prayerKey, time: new Date() }
  }));
}

/* ---------- تنبيه ما قبل الأذان ---------- */
function playPreAlert(prayerKey) {
  const settings = ADHAN.settings;
  const prayerName = PRAYER_NAMES_AR[prayerKey];
  const mins = settings.preAlertMinutes;

  /* الاهتزاز */
  if (settings.vibrate && 'vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }

  /* صوت خفيف */
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 800;
    o.type = 'sine';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch {}

  /* إشعار */
  if (settings.showNotification && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(`⏰ صلاة ${prayerName} بعد ${toAr(mins)} دقائق`, {
      body: 'استعد للأذان — تقبّل الله',
      icon: 'assets/img/icon-192.png',
      tag: 'pre-adhan-' + prayerKey,
    });
  }

  /* تسجيل */
  const todayKey = new Date().toISOString().slice(0, 10);
  ADHAN.preAlerted[prayerKey] = todayKey;
}

/* ---------- الفحص الدوري ---------- */
function checkPrayerTimes() {
  if (!ADHAN.settings?.enabled) return;
  if (!ADHAN.prayerTimes) {
    ADHAN.prayerTimes = loadPrayerTimes();
    if (!ADHAN.prayerTimes) return;
  }

  const now = nowInMinutes();
  const today = new Date().toISOString().slice(0, 10);
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  prayers.forEach(key => {
    const prayerSettings = ADHAN.settings.prayers[key];
    if (!prayerSettings?.enabled) return;

    const timeStr = ADHAN.prayerTimes[key];
    if (!timeStr) return;

    const prayerMin = timeToMinutes(timeStr);

    /* الأذان عند الوقت */
    if (now === prayerMin && ADHAN.lastPlayed[key] !== today) {
      playAdhan(key);
    }

    /* تنبيه قبل الأذان */
    const preMin = prayerMin - ADHAN.settings.preAlertMinutes;
    if (now === preMin && ADHAN.preAlerted[key] !== today) {
      playPreAlert(key);
    }
  });
}

/* ---------- طلب إذن الإشعارات ---------- */
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('⚠️ المتصفح لا يدعم الإشعارات');
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/* ---------- تشغيل النظام ---------- */
function initAdhan() {
  ADHAN.settings = getAdhanSettings();

  if (!ADHAN.settings.enabled) {
    console.log('🔕 الأذان معطّل من الإعدادات');
    return;
  }

  /* فحص فوري */
  checkPrayerTimes();

  /* فحص كل 30 ثانية */
  if (ADHAN.checkInterval) clearInterval(ADHAN.checkInterval);
  ADHAN.checkInterval = setInterval(checkPrayerTimes, 30000);

  /* إعادة تحميل المواقيت عند تحديث prayer_times */
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(TIMES_CACHE_PREFIX)) {
      ADHAN.prayerTimes = loadPrayerTimes();
      console.log('🔄 تم تحديث مواقيت الأذان');
    }
  });

  /* استئناف الصوت عند أول تفاعل */
  document.addEventListener('click', () => {
    if (ADHAN.audio && ADHAN.audio.paused && !ADHAN.audio.ended) {
      ADHAN.audio.play().catch(() => {});
    }
  }, { once: true });

  console.log('✅ نظام الأذان يعمل');
}

/* ---------- واجهة عامة ---------- */
window.AdhanSystem = {
  init: initAdhan,
  play: playAdhan,
  playPreAlert,
  requestPermission: requestNotificationPermission,
  getSettings: getAdhanSettings,
  saveSettings: saveAdhanSettings,
  loadPrayerTimes,
  DEFAULT_SETTINGS,
};

/* ---------- تشغيل تلقائي ---------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdhan);
} else {
  initAdhan();
}