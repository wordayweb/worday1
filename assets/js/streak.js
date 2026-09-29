/* ============ سلسلة الأيام — WirdiStreak ============ */

(function () {
  'use strict';

  const KEY = 'wirdi_streak';
  const MILESTONES = [3, 7, 30, 100, 365];
  const DAY_NAMES = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];

  function dateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function today()    { return dateStr(new Date()); }
  function yesterday(){ return dateStr(new Date(Date.now() - 864e5)); }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { count: 0, best: 0, last: null, history: [] };
      const d = JSON.parse(raw);
      return {
        count:   Number(d.count)   || 0,
        best:    Number(d.best)    || 0,
        last:    d.last            || null,
        history: Array.isArray(d.history) ? d.history : [],
      };
    } catch {
      return { count: 0, best: 0, last: null, history: [] };
    }
  }

  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
  }

  function update() {
    const d = load();
    const t = today();
    const y = yesterday();
    if (d.last === t) return d;
    if (d.last === y)        d.count += 1;
    else if (d.last === null) d.count = 1;
    else                      d.count = 1;
    d.last = t;
    if (d.count > d.best) d.best = d.count;
    if (!d.history.includes(t)) {
      d.history.push(t);
      const cutoff = dateStr(new Date(Date.now() - 30 * 864e5));
      d.history = d.history.filter(x => x >= cutoff);
    }
    save(d);
    return d;
  }

  function nextMilestone(count) {
    return MILESTONES.find(m => m > count) || null;
  }

  function buildCard(data) {
    const next     = nextMilestone(data.count);
    const progress = next ? Math.round((data.count / next) * 100) : 100;

    let daysHTML = '';
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 864e5);
      const key = dateStr(dt);
      const active = data.history.includes(key);
      const isToday = i === 0;
      const cls = ['streak-day'];
      if (active)  cls.push('active');
      if (isToday) cls.push('today');
      daysHTML += '<div class="' + cls.join(' ') + '" title="' + key + '">' +
        '<span class="streak-day-dot"></span>' +
        '<span class="streak-day-name">' + DAY_NAMES[dt.getDay()] + '</span>' +
        '</div>';
    }

    const nextBlock = next
      ? '<div class="streak-progress">' +
          '<div class="streak-progress-bar">' +
            '<div class="streak-progress-fill" style="width:' + progress + '%"></div>' +
          '</div>' +
          '<p class="streak-progress-text">' + data.count + ' / ' + next + ' يومًا للإنجاز القادم 🎯</p>' +
        '</div>'
      : '<div class="streak-progress">' +
          '<p class="streak-progress-text">🏆 أنت في القمة — ما شاء الله!</p>' +
        '</div>';

    return '<div class="streak-card" role="region" aria-label="سلسلة الأيام">' +
      '<div class="streak-head">' +
        '<div class="streak-icon" aria-hidden="true">🔥</div>' +
        '<div class="streak-title">' +
          '<h3>سلسلة الأيام</h3>' +
          '<p>' + (data.count === 1 ? 'يوم واحد' : data.count + ' أيام') + ' متتالية</p>' +
        '</div>' +
        '<div class="streak-best" title="أفضل سلسلة حققتها">' +
          '<span class="streak-best-label">الأفضل</span>' +
          '<span class="streak-best-value">' + data.best + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="streak-days" aria-label="آخر 7 أيام">' + daysHTML + '</div>' +
      nextBlock +
      '</div>';
  }

  function isHome() {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  }

  function ensureCss() {
    if (document.querySelector('link[href*="streak.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/streak.css';
    document.head.appendChild(link);
  }

  function render() {
    if (!isHome()) return;
    if (document.querySelector('.streak-card')) return;
    ensureCss();
    const data = load();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildCard(data).trim();
    const card = wrapper.firstElementChild;
    const after =
      document.querySelector('.tracker-card') ||
      document.querySelector('#tasks')?.closest('section, .card') ||
      document.querySelector('.quick-access') ||
      document.querySelector('.cards-grid') ||
      document.querySelector('main') ||
      document.querySelector('.container');
    if (after && after.parentNode) {
      after.insertAdjacentElement('afterend', card);
    } else {
      const nav = document.querySelector('.bottom-nav');
      if (nav) nav.insertAdjacentElement('beforebegin', card);
      else document.body.appendChild(card);
    }
  }

  update();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }

  window.WirdiStreak = { load, update, reset() { try { localStorage.removeItem(KEY); } catch {} } };
})();