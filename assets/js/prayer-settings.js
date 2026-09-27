/* ============ منطق إعدادات الصلاة ============ */

const PRAYER_KEY = 'prayer_settings';
const TIMES_CACHE_KEY = 'prayer_times_cache';

const DEFAULT_SETTINGS = {
  method: 4,
  school: 0,
  lat: 24.7136,
  lng: 46.6753,
  cityName: 'الرياض',
  cityDetail: 'السعودية',
  manualLocation: false,
  notifications: { before: false, sound: false, vibrate: true },
};

function getSettings() { return { ...DEFAULT_SETTINGS, ...LS.get(PRAYER_KEY, {}) }; }
function saveSettings(s) { LS.set(PRAYER_KEY, s); }

function clearTimingsCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(TIMES_CACHE_KEY))
    .forEach(k => localStorage.removeItem(k));
}

function loadUI() {
  const s = getSettings();
  const useGeo = !s.manualLocation;
  document.getElementById('useGeo').checked = useGeo;
  document.getElementById('manualBlock').style.display = useGeo ? 'none' : 'flex';

  if (!useGeo) {
    document.getElementById('inpLat').value = s.lat || '';
    document.getElementById('inpLng').value = s.lng || '';
    document.getElementById('inpCity').value = s.cityName || '';
  }

  document.getElementById('methodSelect').value = String(s.method);
  document.querySelectorAll('input[name="school"]').forEach(r => {
    r.checked = String(s.school) === r.value;
  });

  const notif = s.notifications || {};
  document.getElementById('notifBefore').checked = !!notif.before;
  document.getElementById('adhanSound').checked = !!notif.sound;
  document.getElementById('notifVibrate').checked = notif.vibrate !== false;
}

function bindUI() {
  document.getElementById('useGeo').addEventListener('change', (e) => {
    document.getElementById('manualBlock').style.display = e.target.checked ? 'none' : 'flex';
  });

  document.getElementById('quickCities').addEventListener('click', () => {
    const list = document.getElementById('citiesList');
    list.style.display = list.style.display === 'none' ? 'grid' : 'none';
  });

  document.querySelectorAll('#citiesList button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('inpLat').value = btn.dataset.lat;
      document.getElementById('inpLng').value = btn.dataset.lng;
      document.getElementById('inpCity').value = btn.dataset.city;
      document.getElementById('useGeo').checked = false;
      document.getElementById('manualBlock').style.display = 'flex';
      document.getElementById('citiesList').style.display = 'none';
    });
  });
}

function saveUI() {
  const useGeo = document.getElementById('useGeo').checked;
  const s = getSettings();

  s.method = parseInt(document.getElementById('methodSelect').value, 10);
  s.school = parseInt(document.querySelector('input[name="school"]:checked').value, 10);
  s.manualLocation = !useGeo;

  if (!useGeo) {
    const lat = parseFloat(document.getElementById('inpLat').value);
    const lng = parseFloat(document.getElementById('inpLng').value);
    const city = document.getElementById('inpCity').value.trim();
    if (isNaN(lat) || isNaN(lng)) {
      alert('⚠️ الرجاء إدخال إحداثيات صحيحة');
      return false;
    }
    s.lat = lat;
    s.lng = lng;
    s.cityName = city || 'موقع مخصص';
    s.cityDetail = `${lat.toFixed(3)}°، ${lng.toFixed(3)}°`;
  }

  s.notifications = {
    before: document.getElementById('notifBefore').checked,
    sound: document.getElementById('adhanSound').checked,
    vibrate: document.getElementById('notifVibrate').checked,
  };

  saveSettings(s);
  clearTimingsCache();
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  initDark?.();
  loadUI();
  bindUI();

  document.getElementById('saveBtn').addEventListener('click', () => {
    if (saveUI()) {
      alert('✅ تم حفظ الإعدادات');
      location.href = 'prayer.html';
    }
  });

  document.getElementById('refreshBtn').addEventListener('click', () => {
    clearTimingsCache();
    alert('🔄 تم مسح البيانات المؤقتة');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('⚠️ استعادة الإعدادات الافتراضية؟')) return;
    LS.del(PRAYER_KEY);
    clearTimingsCache();
    location.reload();
  });
});