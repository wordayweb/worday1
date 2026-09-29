/* ============ إشعارات الورد — WirdiNotifications ============ */
(function () {
  'use strict';
  const KEY = 'wirdi_notifications';
  const CHECK_INTERVAL = 60 * 1000;
  const TOLERANCE = 15;
  const DEFAULTS = {
    enabled: false,
    morning: { enabled: true, time: '06:30', label: 'أذكار الصباح', icon: '🌅', url: 'athkar-morning.html' },
    evening: { enabled: true, time: '18:00', label: 'أذكار المساء', icon: '🌆', url: 'athkar-evening.html' },
    wird:    { enabled: true, time: '21:00', label: 'الورد اليومي', icon: '📖', url: 'quran.html' }
  };
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const saved = raw ? JSON.parse(raw) : {};
      return Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), saved);
    } catch { return JSON.parse(JSON.stringify(DEFAULTS)); }
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  async function requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    try { return await Notification.requestPermission(); } catch { return 'denied'; }
  }
  function show(title, body, url) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return false;
    try {
      const n = new Notification(title, {
        body: body, icon: 'assets/img/icon-192.png', badge: 'assets/img/icon-192.png',
        lang: 'ar', dir: 'rtl', tag: 'wirdi-' + Date.now()
      });
      n.onclick = function () { window.focus(); if (url) location.href = url; n.close(); };
      return true;
    } catch { return false; }
  }
  function checkDue() {
    const data = load();
    if (!data.enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = todayStr();
    if (!data.lastShown) data.lastShown = {};
    ['morning','evening','wird'].forEach(function (key) {
      const cfg = data[key];
      if (!cfg || !cfg.enabled) return;
      if (data.lastShown[key] === today) return;
      const parts = (cfg.time || '00:00').split(':').map(Number);
      const targetMin = parts[0] * 60 + parts[1];
      if (Math.abs(nowMin - targetMin) <= TOLERANCE) {
        show(cfg.icon + ' ' + cfg.label + ' — وِرْدِي',
             'حان وقت ' + cfg.label + '. افتح وِرْدِي وواصل وردك 🌿', cfg.url);
        data.lastShown[key] = today;
      }
    });
    save(data);
  }
  function init() {
    setTimeout(checkDue, 3000);
    setInterval(checkDue, CHECK_INTERVAL);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) checkDue();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  window.WirdiNotifications = {
    load: load, save: save, requestPermission: requestPermission,
    show: show, checkDue: checkDue,
    async enable() {
      const perm = await requestPermission();
      if (perm === 'granted') { const d = load(); d.enabled = true; save(d); return true; }
      return false;
    },
    disable() { const d = load(); d.enabled = false; save(d); }
  };
})();