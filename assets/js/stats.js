/* ============ 📊 صفحة الإحصائيات ============ */

(function () {
  'use strict';

  function toAr(s) {
    var ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(s).replace(/[0-9]/g, function (d) { return ar[d]; });
  }

  function get(k, def) {
    try {
      var raw = localStorage.getItem(k);
      if (raw === null) return def;
      return JSON.parse(raw);
    } catch (e) { return def; }
  }

  function dateStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /* ═══════ البطاقات الرئيسية ═══════ */
  function loadStreak() {
    var s = get('wirdi_streak', { count: 0, best: 0, history: [] });
    document.getElementById('stStreak').textContent = toAr(s.count || 0);
    document.getElementById('stBest').textContent = 'الأفضل: ' + toAr(s.best || 0);
    return s;
  }

  function loadReading() {
    var last = get('quran_last_read', null);
    var read = get('wirdi_ayahs_read', 0);
    document.getElementById('stRead').textContent = toAr(read || 0);
    if (last && last.surahName) {
      var name = (last.surahName || '').replace('سُورَةُ ', '');
      document.getElementById('stLastSurah').textContent = 'آخر: ' + name;
    }
  }

  function loadDhikr() {
    var t = get('tracker', { done: {} });
    var done = t.done || {};
    var keys = ['fajr', 'morning', 'prayers', 'evening', 'wird', 'sleep'];
    var count = keys.filter(function (k) { return done[k]; }).length;
    document.getElementById('stDhikr').textContent = toAr(count);
    document.getElementById('stDhikrSub').textContent = 'من ٦ مهام';
    return { done: done, count: count, total: 6 };
  }

  function loadBookmarks() {
    var b = get('quran_bookmarks', []);
    document.getElementById('stBookmarks').textContent = toAr(b.length || 0);
  }

  /* ═══════ مخطط الأسبوع ═══════ */
  function renderWeekChart(streak) {
    var el = document.getElementById('stWeekChart');
    if (!el) return;
    var history = (streak && streak.history) || [];
    var names = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
    var html = '';
    var todayKey = dateStr(new Date());

    for (var i = 6; i >= 0; i--) {
      var d = new Date(Date.now() - i * 864e5);
      var key = dateStr(d);
      var active = history.indexOf(key) !== -1;
      var isToday = key === todayKey;
      var h = active ? 100 : 6;

      html += '<div class="chart-day' + (isToday ? ' today' : '') + '">' +
        '<div class="chart-bar-wrap">' +
          '<div class="chart-bar' + (active ? '' : ' empty') + '" style="height:' + h + '%"></div>' +
        '</div>' +
        '<span class="chart-val">' + (active ? '🔥' : '·') + '</span>' +
        '<span class="chart-day-name">' + names[d.getDay()] + '</span>' +
      '</div>';
    }
    el.innerHTML = html;
  }

  /* ═══════ التزام اليوم ═══════ */
  function renderTracker(d) {
    var pct = Math.round((d.count / d.total) * 100);
    var ring = document.getElementById('stRing');
    var ringTxt = document.getElementById('stRingTxt');
    if (ring) {
      ring.style.background = 'conic-gradient(#C9A227 ' + (pct * 3.6) + 'deg, #EAE6DD 0deg)';
    }
    if (ringTxt) ringTxt.textContent = toAr(pct) + '٪';

    var t = document.getElementById('stTrackerTitle');
    var desc = document.getElementById('stTrackerDesc');
    if (pct === 100) {
      t.textContent = '🏆 ما شاء الله — يوم مكتمل!';
      desc.textContent = 'أتممت كل مهامك اليومية';
    } else if (pct >= 50) {
      t.textContent = '💪 أنت على الطريق الصحيح';
      desc.textContent = 'بقيت ' + toAr(d.total - d.count) + ' مهام لإكمال اليوم';
    } else if (pct > 0) {
      t.textContent = '🌿 بداية طيبة';
      desc.textContent = 'أكمل ' + toAr(d.total - d.count) + ' مهام أخرى';
    } else {
      t.textContent = 'لم تبدأ بعد';
      desc.textContent = 'فعّل مهامك اليومية لتزيد التزامك';
    }
  }

  /* ═══════ التفاصيل ═══════ */
  function loadDetails(trackerData) {
    var tasbih = get('wirdi_tasbih_count', 0);
    document.getElementById('stTasbih').textContent = toAr(tasbih || 0);

    var d = trackerData.done || {};
    document.getElementById('stMorning').textContent = d.morning ? '✅' : '—';
    document.getElementById('stEvening').textContent = d.evening ? '✅' : '—';

    var lastPrayer = get('wirdi_last_prayer', null);
    document.getElementById('stLastPrayer').textContent = lastPrayer && lastPrayer.name ? lastPrayer.name : '—';

    var goal = get('goal', 0);
    document.getElementById('stGoal').textContent = goal ? toAr(goal) + ' ذكر' : '—';

    var first = get('wirdi_first_use', null);
    if (!first) {
      first = Date.now();
      try { localStorage.setItem('wirdi_first_use', JSON.stringify(first)); } catch (e) {}
    }
    try {
      var days = Math.max(1, Math.ceil((Date.now() - first) / 864e5));
      document.getElementById('stFirstUse').textContent = 'منذ ' + toAr(days) + ' يوم';
    } catch (e) {}
  }

  /* ═══════ التهيئة ═══════ */
  function init() {
    var streak = loadStreak();
    loadReading();
    var t = loadDhikr();
    loadBookmarks();
    renderWeekChart(streak);
    renderTracker(t);
    loadDetails(t);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();