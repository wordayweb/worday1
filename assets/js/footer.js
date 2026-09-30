/* ============ 🕌 الفوتر الموحّد — وِرْدِي ============ */
(function () {
  'use strict';
  if (window.__wirdiFooterLoaded) return;
  window.__wirdiFooterLoaded = true;

  var VERSES = [
    { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', source: 'سورة الرعد — ٢٨' },
    { text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', source: 'سورة البقرة — ١٥٢' },
    { text: 'وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ', source: 'سورة الكهف — ٢٤' },
    { text: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', source: 'سورة العنكبوت — ٤٥' },
    { text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا', source: 'سورة الأحزاب — ٤١' }
  ];

  function weekNum() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 1);
    return Math.floor((d - start) / (7 * 864e5));
  }

  function hijriDate() {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date()) + ' هـ';
    } catch (e) { return new Date().toLocaleDateString('ar-EG'); }
  }


  /* ============ 🕌 شريط مواقيت الصلاة ============ */
  var PRAYER_CACHE = 'wirdi_prayer_timings';
  var PRAYER_CITY  = 'wirdi_prayer_city';
  var DEFAULT_CITY = { lat: 24.7136, lng: 46.6753, name: 'الرياض' };

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function toArabicNum(s) {
    var ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(s).replace(/[0-9]/g, function (d) { return ar[d]; });
  }

  function fmtTime(t) {
    if (!t) return '—';
    var parts = t.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1] || '00';
    var suffix = h < 12 ? 'ص' : 'م';
    var h12 = h % 12 || 12;
    return toArabicNum(h12) + ':' + toArabicNum(m) + ' ' + suffix;
  }

  function readTimings() {
    try {
      var raw = localStorage.getItem(PRAYER_CACHE);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || obj.date !== todayKey() || !obj.timings) return null;
      return obj.timings;
    } catch (e) { return null; }
  }

  function fetchTimings() {
    return new Promise(function (resolve) {
      var city = DEFAULT_CITY;
      try {
        var saved = localStorage.getItem(PRAYER_CITY);
        if (saved) {
          var obj = JSON.parse(saved);
          if (obj && typeof obj.lat === 'number' && typeof obj.lng === 'number') city = obj;
        }
      } catch (e) {}

      var url = 'https://api.aladhan.com/v1/timings/' + todayKey() +
                '?latitude=' + city.lat + '&longitude=' + city.lng + '&method=4';

      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data || !data.data || !data.data.timings) { resolve(null); return; }
          var t = data.data.timings;
          var clean = {
            Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr,
            Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha
          };
          try {
            localStorage.setItem(PRAYER_CACHE, JSON.stringify({
              date: todayKey(), city: city.name, timings: clean
            }));
          } catch (e) {}
          resolve(clean);
        })
        .catch(function () { resolve(null); });
    });
  }

  function getNextPrayer(timings) {
    var order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var names = {
      Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر',
      Maghrib: 'المغرب', Isha: 'العشاء'
    };
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < order.length; i++) {
      var t = timings[order[i]];
      if (!t) continue;
      var p = t.split(':');
      var tMin = parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
      if (tMin > nowMin) return order[i];
    }
    return 'Fajr';
  }

  function buildPrayerBar(timings) {
    if (!timings) return '';
    var next = getNextPrayer(timings);
    var order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var names = {
      Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر',
      Maghrib: 'المغرب', Isha: 'العشاء'
    };

    var items = order.map(function (key) {
      var isNext = key === next;
      var cls = 'wf-prayer-item' + (isNext ? ' wf-prayer-next' : '');
      return '<div class="' + cls + '">' +
        '<span class="wf-prayer-name">' + names[key] + '</span>' +
        '<span class="wf-prayer-time">' + fmtTime(timings[key]) + '</span>' +
        (isNext ? '<span class="wf-prayer-badge">القادمة</span>' : '') +
      '</div>';
    }).join('');

    return '<div class="wf-prayers" aria-label="مواقيت الصلاة">' + items + '</div>';
  }

  /* ============ 📱 وسائل التواصل ============ */
  function buildSocial() {
    var items = [
      { icon: '𝕏', label: 'تويتر X', url: 'https://twitter.com/wirdi' },
      { icon: '📷', label: 'إنستغرام', url: 'https://instagram.com/wirdi' },
      { icon: '📺', label: 'يوتيوب', url: 'https://youtube.com/@wirdi' },
      { icon: '✈️', label: 'تلغرام', url: 'https://t.me/wirdi' }
    ];
    var links = items.map(function (it) {
      return '<a href="' + it.url + '" target="_blank" rel="noopener noreferrer" ' +
        'class="wf-social-btn" aria-label="' + it.label + '" title="' + it.label + '">' +
        '<span aria-hidden="true">' + it.icon + '</span>' +
      '</a>';
    }).join('');

    return '<div class="wf-social" aria-label="تابعنا على">' +
      '<span class="wf-social-label">تابعنا على:</span>' +
      '<div class="wf-social-links">' + links + '</div>' +
    '</div>';
  }

  function html() {
    var v = VERSES[weekNum() % VERSES.length];
    return '' +
      '<footer class="wirdi-footer" role="contentinfo">' +

        '<div class="wf-verse">' +
          '<div class="wf-bismillah">﷽</div>' +
          '<blockquote class="wf-verse-text">«' + v.text + '»</blockquote>' +
          '<cite class="wf-verse-src">' + v.source + '</cite>' +
        '</div>' +

        '<div class="wf-prayers-wrap" id="wfPrayersWrap">' +
          '<div class="wf-prayers-loading">⏳ جارٍ تحميل مواقيت الصلاة…</div>' +
        '</div>' +

        '<div class="wf-cols">' +
          '<div class="wf-col wf-brand-col">' +
            '<img src="assets/img/logo.png" alt="شعار وِرْدِي" class="wf-logo" loading="lazy" />' +
            '<h4 class="wf-brand">وِرْدِي</h4>' +
            '<p class="wf-tagline">رفيقك اليومي لذكر الله</p>' +
            '<p class="wf-made">صُنع بحب لله 🌿</p>' +
          '</div>' +

          '<div class="wf-col">' +
            '<h4 class="wf-col-title">الموقع</h4>' +
            '<ul class="wf-links">' +
              '<li><a href="athkar-morning.html">🌅 أذكار الصباح</a></li>' +
              '<li><a href="athkar-evening.html">🌆 أذكار المساء</a></li>' +
              '<li><a href="quran.html">📖 القرآن الكريم</a></li>' +
              '<li><a href="prayer.html">🕌 مواقيت الصلاة</a></li>' +
              '<li><a href="tasbih.html">📿 التسبيح</a></li>' +
            '</ul>' +
          '</div>' +

          '<div class="wf-col">' +
            '<h4 class="wf-col-title">روابط سريعة</h4>' +
            '<ul class="wf-links">' +
              '<li><a href="tafsir.html">📖 تفسير القرآن</a></li>' +
              '<li><a href="calendar.html">📅 التقويم</a></li>' +
              '<li><a href="zakat.html">💰 حساب الزكاة</a></li>' +
              '<li><a href="notifications.html">🔔 الإشعارات</a></li>' +
              '<li><a href="stats.html">📊 إحصائياتي</a></li>' +
              '<li><a href="amin.html">👑 وِرْدِي في سطور</a></li>' +
            '</ul>' +
          '</div>' +

          '<div class="wf-col">' +
            '<h4 class="wf-col-title">المساعدة</h4>' +
            '<ul class="wf-links">' +
              '<li><a href="contact.html">📞 تواصل معنا</a></li>' +
              '<li><a href="support.html">💚 ادعمنا</a></li>' +
              '<li><a href="sources.html">📚 مصادرنا</a></li>' +
              '<li><a href="privacy.html">🔒 سياسة الخصوصية</a></li>' +
              '<li><a href="settings.html">⚙️ الإعدادات</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div class="wf-bar">' +
          '<button type="button" class="wf-bar-btn" id="wfInstall" hidden>' +
            '<span aria-hidden="true">📲</span><span>ثبّت التطبيق</span>' +
          '</button>' +
          '<a href="notifications.html" class="wf-bar-btn">' +
            '<span aria-hidden="true">🔔</span><span>الإشعارات</span>' +
          '</a>' +
          '<button type="button" class="wf-bar-btn" id="wfTheme">' +
            '<span aria-hidden="true">🌙</span><span>الوضع الليلي</span>' +
          '</button>' +
        '</div>' +

        buildSocial() +

        '<div class="wf-bottom">' +
          '<p class="wf-copy">© وِرْدِي — مجاني لله، بدون إعلانات</p>' +
          '<div class="wf-credit">' +
            '<span class="wf-credit-label">الإشراف الاستشاري في التطوير والبرمجة</span>' +
            '<span class="wf-credit-name">محمد العالم</span>' +
          '</div>' +
          '<p class="wf-date">' + hijriDate() + '</p>' +
        '</div>' +
      '</footer>' +
      '<button type="button" class="wirdi-top-btn" id="wirdiTop" aria-label="العودة إلى الأعلى" title="العودة إلى الأعلى">' +
        '<span aria-hidden="true">↑</span>' +
      '</button>';
  }

  function inject() {
    if (document.querySelector('.wirdi-footer')) return;
    var app = document.querySelector('.app') || document.body;
    app.insertAdjacentHTML('beforeend', html());
    initTheme(); initInstall(); initTop();
    loadPrayerTimes();
  }

  function initTheme() {
    var btn = document.getElementById('wfTheme');
    if (!btn) return;
    var upd = function () {
      var dark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
      btn.querySelector('span:first-child').textContent = dark ? '☀️' : '🌙';
      btn.querySelector('span:last-child').textContent = dark ? 'الوضع النهاري' : 'الوضع الليلي';
    };
    upd();
    btn.addEventListener('click', function () {
      if (window.WirdiTheme && typeof window.WirdiTheme.toggle === 'function') {
        window.WirdiTheme.toggle();
      } else {
        var now = !document.body.classList.contains('dark');
        document.documentElement.classList.toggle('dark', now);
        document.body.classList.toggle('dark', now);
      }
      upd();
    });
  }

  function initInstall() {
    var btn = document.getElementById('wfInstall');
    if (!btn) return;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      window.__wirdiInstall = e;
      btn.hidden = false;
    });
    btn.addEventListener('click', async function () {
      var p = window.__wirdiInstall;
      if (!p) return;
      p.prompt();
      var r = await p.userChoice;
      if (r.outcome === 'accepted') btn.hidden = true;
      window.__wirdiInstall = null;
    });
    window.addEventListener('appinstalled', function () { btn.hidden = true; });
  }

  function initTop() {
    var btn = document.getElementById('wirdiTop');
    if (!btn) return;
    var check = function () { btn.classList.toggle('show', window.scrollY > 400); };
    window.addEventListener('scroll', check, { passive: true });
    check();
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function loadPrayerTimes() {
    var wrap = document.getElementById('wfPrayersWrap');
    if (!wrap) return;

    var cached = readTimings();
    if (cached) {
      wrap.innerHTML = buildPrayerBar(cached);
      return;
    }

    fetchTimings().then(function (t) {
      if (t) wrap.innerHTML = buildPrayerBar(t);
      else wrap.innerHTML = '<div class="wf-prayers-error">تعذّر تحميل المواقيت</div>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else { inject(); }
})();