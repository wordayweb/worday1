/* ============ منطق إعدادات الصلاة ============ */

const PS_KEY = 'prayer_settings';
const PTS_CACHE_KEY = 'prayer_times_cache';

const PS_DEFAULTS = {
  method: 4,
  school: 0,
  lat: 24.7136,
  lng: 46.6753,
  cityName: 'الرياض',
  cityDetail: 'السعودية',
  manualLocation: false,
};

function getPSSettings() {
  return { ...PS_DEFAULTS, ...LS.get(PS_KEY, {}) };
}
function savePSSettings(s) {
  LS.set(PS_KEY, s);
}

function clearPTSCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PTS_CACHE_KEY))
    .forEach(k => localStorage.removeItem(k));
}

/* ---------- تحميل القيم ---------- */
function psLoadUI() {
  const s = getPSSettings();

  const useGeoEl = document.getElementById('useGeo');
  const manualBlockEl = document.getElementById('manualBlock');

  if (useGeoEl) {
    const useGeo = !s.manualLocation;
    useGeoEl.checked = useGeo;
    if (manualBlockEl) {
      manualBlockEl.style.display = useGeo ? 'none' : 'flex';
    }
  }

  const inpLat = document.getElementById('inpLat');
  const inpLng = document.getElementById('inpLng');
  const inpCity = document.getElementById('inpCity');
  if (inpLat && s.manualLocation) inpLat.value = s.lat || '';
  if (inpLng && s.manualLocation) inpLng.value = s.lng || '';
  if (inpCity && s.manualLocation) inpCity.value = s.cityName || '';

  const methodSelect = document.getElementById('methodSelect');
  if (methodSelect) methodSelect.value = String(s.method);

  const schoolRadios = document.querySelectorAll('input[name="school"]');
  if (schoolRadios.length) {
    schoolRadios.forEach(r => {
      r.checked = String(s.school) === r.value;
    });
  }
}

/* ---------- ربط الأحداث ---------- */
function psBindUI() {
  const useGeoEl = document.getElementById('useGeo');
  const manualBlockEl = document.getElementById('manualBlock');
  if (useGeoEl && manualBlockEl) {
    useGeoEl.addEventListener('change', (e) => {
      manualBlockEl.style.display = e.target.checked ? 'none' : 'flex';
    });
  }

  const quickCities = document.getElementById('quickCities');
  const citiesList = document.getElementById('citiesList');
  if (quickCities && citiesList) {
    quickCities.addEventListener('click', () => {
      citiesList.style.display = citiesList.style.display === 'none' ? 'grid' : 'none';
    });
  }

  document.querySelectorAll('#citiesList button').forEach(btn => {
    btn.addEventListener('click', () => {
      const inpLat = document.getElementById('inpLat');
      const inpLng = document.getElementById('inpLng');
      const inpCity = document.getElementById('inpCity');
      const useGeoEl = document.getElementById('useGeo');
      const manualBlockEl = document.getElementById('manualBlock');
      const citiesList = document.getElementById('citiesList');

      if (inpLat) inpLat.value = btn.dataset.lat;
      if (inpLng) inpLng.value = btn.dataset.lng;
      if (inpCity) inpCity.value = btn.dataset.city;
      if (useGeoEl) useGeoEl.checked = false;
      if (manualBlockEl) manualBlockEl.style.display = 'flex';
      if (citiesList) citiesList.style.display = 'none';
    });
  });
}

/* ---------- حفظ ---------- */
function psSaveUI() {
  const useGeoEl = document.getElementById('useGeo');
  const useGeo = useGeoEl ? useGeoEl.checked : true;
  const s = getPSSettings();

  const methodSelect = document.getElementById('methodSelect');
  if (methodSelect) s.method = parseInt(methodSelect.value, 10);

  const schoolEl = document.querySelector('input[name="school"]:checked');
  if (schoolEl) s.school = parseInt(schoolEl.value, 10);

  s.manualLocation = !useGeo;

  if (!useGeo) {
    const inpLat = document.getElementById('inpLat');
    const inpLng = document.getElementById('inpLng');
    const inpCity = document.getElementById('inpCity');

    const lat = inpLat ? parseFloat(inpLat.value) : NaN;
    const lng = inpLng ? parseFloat(inpLng.value) : NaN;
    const city = inpCity ? inpCity.value.trim() : '';

    if (isNaN(lat) || isNaN(lng)) {
      alert('⚠️ الرجاء إدخال إحداثيات صحيحة');
      return false;
    }
    s.lat = lat;
    s.lng = lng;
    s.cityName = city || 'موقع مخصص';
    s.cityDetail = `${lat.toFixed(3)}°، ${lng.toFixed(3)}°`;
  }

  savePSSettings(s);
  clearPTSCache();
  return true;
}

/* ---------- التهيئة ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initDark?.();
  psLoadUI();
  psBindUI();

  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (psSaveUI()) {
        alert('✅ تم حفظ الإعدادات');
        location.href = 'prayer.html';
      }
    });
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      clearPTSCache();
      alert('🔄 تم مسح البيانات المؤقتة');
    });
  }
});