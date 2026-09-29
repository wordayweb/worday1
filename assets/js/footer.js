/* ============ 🕌 الفوتر الموحّد ============ */

(function () {
  'use strict';

  const VERSES = [
    { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', source: 'سورة الرعد — ٢٨' },
    { text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', source: 'سورة البقرة — ١٥٢' },
    { text: 'وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ', source: 'سورة الكهف — ٢٤' },
    { text: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', source: 'سورة العنكبوت — ٤٥' },
    { text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا', source: 'سورة الأحزاب — ٤١' },
  ];

  function toAr(s) {
    const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(s).replace(/[0-9]/g, function (d) { return ar[d]; });
  }

  function getWeekNumber() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 1);
    const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  }

  function buildHijriDate() {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-arab', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date()) + ' هـ';
    } catch (e) {
      return new Date().toLocaleDateString('ar-EG');
    }
  }

  function buildFooter() {
    const v = VERSES[getWeekNumber() % VERSES.length];

    return (
      '<footer class="wirdi-footer" role="contentinfo">' +
        '<div class="wf-verse">' +
          '<div class="wf-bismillah">﷽</div>' +
          '<blockquote class="wf-verse-text">«' + v.text + '»</blockquote>' +
          '<cite class="wf-verse-src">' + v.source + '</cite>' +
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
          '<a href="notifications.html" class="wf-bar-btn">' +
            '<span aria-hidden="true">🔔</span><span>الإشعارات</span>' +
          '</a>' +
          '<button type="button" class="wf-bar-btn" id="wfInstall" hidden>' +
            '<span aria-hidden="true">📲</span><span>ثبّت التطبيق</span>' +
          '</button>' +
          '<button type="button" class="wf-bar-btn" id="wfTheme">' +
            '<span aria-hidden="true">🌙</span><span>الوضع الليلي</span>' +
          '</button>' +
        '</div>' +

        '<div class="wf-bottom">' +
          '<p class="wf-copy">© وِرْدِي — مجاني لله، بدون إعلانات</p>' +
          '<p class="wf-date">' + buildHijriDate() + '</p>' +
        '</div>' +
      '</footer>' +
      '<button type="button" class="wirdi-top-btn" id="wirdiTop" aria-label="العودة إلى الأعلى" title="العودة إلى الأعلى">' +
        '<span aria-hidden="true">↑</span>' +
      '</button>'
    );
  }

  function injectFooter() {
    if (document.querySelector('.wirdi-footer')) return;
    const app = document.querySelector('.app') || document.body;
    app.insertAdjacentHTML('beforeend', buildFooter());
    initThemeBtn();
    initInstallBtn();
    initBackToTop();
  }

  function initThemeBtn() {
    const btn = document.getElementById('wfTheme');
    if (!btn) return;
    const updateText = function () {
      const isDark = document.documentElement.classList.contains('dark');
      btn.querySelector('span:last-child').textContent = isDark ? 'الوضع النهاري' : 'الوضع الليلي';
      btn.querySelector('span:first-child').textContent = isDark ? '☀️' : '🌙';
    };
    updateText();
    btn.addEventListener('click', function () {
      if (window.WirdiTheme && typeof window.WirdiTheme.toggle === 'function') {
        window.WirdiTheme.toggle();
      } else {
        document.documentElement.classList.toggle('dark');
        document.body.classList.toggle('dark');
      }
      updateText();
    });
  }

  function initInstallBtn() {
    const btn = document.getElementById('wfInstall');
    if (!btn) return;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      window.__wirdiInstallPrompt = e;
      btn.hidden = false;
    });
    btn.addEventListener('click', async function () {
      const prompt = window.__wirdiInstallPrompt;
      if (!prompt) return;
      prompt.prompt();
      const res = await prompt.userChoice;
      if (res.outcome === 'accepted') btn.hidden = true;
      window.__wirdiInstallPrompt = null;
    });
    window.addEventListener('appinstalled', function () { btn.hidden = true; });
  }

  function initBackToTop() {
    const btn = document.getElementById('wirdiTop');
    if (!btn) return;
    function check() {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();