/* ============ نظام SEO الموحّد ============ */

(function () {
  /* ============================================================
     ⚙️ الإعدادات — غيّر هذه القيم بعد النشر على GitHub
     ============================================================ */
  const SITE_URL = 'https://USERNAME.github.io/wirdi';   // ⬅️ غيّرها
  const SITE_NAME = 'وِرْدِي';
  const LOGO_URL = SITE_URL + '/assets/img/logo.png';
  const TWITTER_HANDLE = '@wirdi_app';

  /* ============================================================
     📋 بيانات كل صفحة (Title + Description + Keywords)
     ============================================================ */
  const PAGES = {
    'index.html': {
      title: 'وِرْدِي — رفيقك اليومي لذكر الله',
      description: 'موقع وِرْدِي: أذكار الصباح والمساء، القرآن الكريم بمصحف المدينة، مواقيت الصلاة، التسبيح، وِرْدِي الأمين. رفيقك اليومي لذكر الله.',
      keywords: 'أذكار, أذكار الصباح, أذكار المساء, ورد يومي, القرآن الكريم, تسبيح, مواقيت الصلاة, وِرْدِي',
      type: 'website',
    },
    'quran.html': {
      title: 'القرآن الكريم — مصحف المدينة النبوية | وِرْدِي',
      description: 'اقرأ القرآن الكريم كاملًا بمصحف المدينة النبوية الرسمي، مع إمكانية الاستماع لأشهر القراء، والبحث في السور، والقراءة المريحة.',
      keywords: 'القرآن الكريم, مصحف المدينة, قراءة القرآن, سور القرآن, تلاوة القرآن, القرآن أونلاين',
      type: 'website',
    },
    'surah.html': {
      title: 'قراءة السورة — وِرْدِي',
      description: 'اقرأ السورة بتلاوة عطرة من أشهر القراء، مع إمكانية الحفظ والمشاركة والاستماع بصوت مشاري العفاسي والسديس وغيرهم.',
      keywords: 'سورة, قراءة سورة, تلاوة, استماع, تفسير',
      type: 'article',
    },
    'athkar.html': {
      title: 'الأذكار اليومية — وِرْدِي',
      description: 'أذكار الصباح والمساء كاملة مع عدد التكرار والفضل، وأذكار اليوم الشاملة. سهّلها موقع وِرْدِي.',
      keywords: 'الأذكار, أذكار الصباح, أذكار المساء, أذكار المسلم, أذكار اليوم',
      type: 'website',
    },
    'athkar-morning.html': {
      title: 'أذكار الصباح كاملة — ٢٩ ذكرًا | وِرْدِي',
      description: 'أذكار الصباح كاملة (٢٩ ذكرًا) مع عدد التكرار والفضل، من آية الكرسي إلى سيد الاستغفار. اقرأ وِردك الصباحي بسهولة.',
      keywords: 'أذكار الصباح, أذكار الصباح كاملة, أذكار المسلم, ورد الصباح',
      type: 'article',
    },
    'athkar-evening.html': {
      title: 'أذكار المساء كاملة — ٢٣ ذكرًا | وِرْدِي',
      description: 'أذكار المساء كاملة (٢٣ ذكرًا) مع عدد التكرار والفضل، من آية الكرسي إلى آخر آيتين من البقرة.',
      keywords: 'أذكار المساء, أذكار المساء كاملة, أذكار المسلم, ورد المساء',
      type: 'article',
    },
    'athkar-daily.html': {
      title: 'أذكار اليوم الشاملة — وِرْدِي',
      description: 'أذكار اليوم كاملة: صباح ومساء في صفحة واحدة، لتنظيم وِردك اليومي بسهولة وسلاسة.',
      keywords: 'أذكار اليوم, أذكار يومية, ورد يومي, أذكار شاملة',
      type: 'article',
    },
    'prayer.html': {
      title: 'مواقيت الصلاة والأذان — وِرْدِي',
      description: 'مواقيت الصلاة الدقيقة حسب موقعك، مع اتجاه القبلة، بتقويم أم القرى ورابطة العالم الإسلامي وغيرها.',
      keywords: 'مواقيت الصلاة, أوقات الصلاة, القبلة, الأذان, تقويم أم القرى',
      type: 'website',
    },
    'prayer-settings.html': {
      title: 'إعدادات الصلاة — وِرْدِي',
      description: 'اضبط طريقة حساب مواقيت الصلاة، واختر موقعك يدويًا، وحدّد الجهة المسؤولة عن الحساب.',
      keywords: 'إعدادات الصلاة, طريقة الحساب, الموقع الجغرافي',
      type: 'website',
    },
    'tasbih.html': {
      title: 'المسبحة الإلكترونية — وِرْدِي',
      description: 'مسبحة إلكترونية (عداد تسبيح) مع حفظ للتقدم، وإحصائيات يومية، وإضافة أذكار مخصصة حتى ٢٠ ذكرًا.',
      keywords: 'مسبحة, تسبيح, عداد تسبيح, مسبحة إلكترونية',
      type: 'website',
    },
    'amin.html': {
      title: 'وِرْدِي الأمين — الورد اليومي | وِرْدِي',
      description: 'وِرْدِي الأمين: ورد يومي متجدد (آية + ذكر + حديث) مع سلسلة الإنجاز اليومية.',
      keywords: 'ورد يومي, وِرْدِي الأمين, آية اليوم, ذكر اليوم, حديث اليوم',
      type: 'website',
    },
    'calendar.html': {
      title: 'التقويم الهجري والميلادي — وِرْدِي',
      description: 'التقويم الهجري والميلادي جنبًا إلى جنب، مع المناسبات الإسلامية. تحويل التواريخ بسهولة.',
      keywords: 'التقويم الهجري, التقويم الإسلامي, المناسبات, تحويل التاريخ',
      type: 'website',
    },
    'zakat.html': {
      title: 'حساب الزكاة — وِرْدِي',
      description: 'احسب زكاة مالك بدقة: النقود، الذهب، الفضة، الأسهم، عروض التجارة، مع النصاب الشرعي.',
      keywords: 'حساب الزكاة, زكاة المال, النصاب, زكاة الذهب',
      type: 'website',
    },
    'favorites.html': {
      title: 'مفضلاتي — وِرْدِي',
      description: 'الأذكار والآيات المحفوظة في مفضلاتك للرجوع إليها بسهولة.',
      keywords: 'مفضلات, أذكار محفوظة, آيات محفوظة',
      type: 'website',
    },
    'settings.html': {
      title: 'الإعدادات — وِرْدِي',
      description: 'إعدادات الموقع: الوضع الليلي، حجم الخط، التنبيهات، الصوت، والاهتزاز.',
      keywords: 'إعدادات, تخصيص, الوضع الليلي',
      type: 'website',
    },
    'more.html': {
      title: 'المزيد — وِرْدِي',
      description: 'اكتشف المزيد من أقسام موقع وِرْدِي: الأذكار، القرآن، مواقيت الصلاة، والزكاة.',
      keywords: 'المزيد, أقسام الموقع',
      type: 'website',
    },
  };

  /* ============================================================
     🔧 دوال مساعدة
     ============================================================ */
  function getPageData() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return PAGES[path] || PAGES['index.html'];
  }

  function setMeta(name, content, isProperty = false) {
    if (!content) return;
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function injectSchema(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /* ============================================================
     🎯 تطبيق SEO
     ============================================================ */
  function applySEO() {
    const page = getPageData();
    const path = location.pathname.split('/').pop() || 'index.html';
    const url = SITE_URL + '/' + path;

    /* 1. العنوان */
    document.title = page.title;

    /* 2. Meta الأساسية */
    setMeta('description', page.description);
    setMeta('keywords', page.keywords);
    setMeta('author', SITE_NAME);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1');
    setMeta('googlebot', 'index, follow');
    setMeta('language', 'Arabic');
    setMeta('revisit-after', '1 day');
    setMeta('rating', 'general');
    setMeta('distribution', 'global');

    /* 3. Canonical URL */
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    /* 4. Open Graph (فيسبوك، واتساب، لينكدإن) */
    setMeta('og:type', page.type, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:title', page.title, true);
    setMeta('og:description', page.description, true);
    setMeta('og:url', url, true);
    setMeta('og:image', LOGO_URL, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:image:alt', 'شعار وِرْدِي — رفيقك اليومي لذكر الله', true);
    setMeta('og:locale', 'ar_SA', true);

    /* 5. Twitter Card */
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', TWITTER_HANDLE);
    setMeta('twitter:creator', TWITTER_HANDLE);
    setMeta('twitter:title', page.title);
    setMeta('twitter:description', page.description);
    setMeta('twitter:image', LOGO_URL);
    setMeta('twitter:image:alt', 'شعار وِرْدِي');

    /* 6. Theme color */
    setMeta('theme-color', '#1F4E3D');
    setMeta('msapplication-TileColor', '#1F4E3D');

    /* 7. Language + Direction */
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');

    /* 8. Structured Data (Schema.org) */
    applyStructuredData(page, url);
  }

  /* ============================================================
     🏛️ Structured Data (Schema.org)
     ============================================================ */
  function applyStructuredData(page, url) {
    document.querySelectorAll('script[type="application/ld+json"]').forEach(s => s.remove());

    /* 1. Organization */
    injectSchema({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: 'Wirdi',
      url: SITE_URL,
      logo: LOGO_URL,
      description: 'موقع إسلامي شامل: أذكار، قرآن، مواقيت صلاة، تسابيح، ورد يومي',
      sameAs: [],
    });

    /* 2. Website + SearchAction */
    injectSchema({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'ar-SA',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/quran.html?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });

    /* 3. Article (للصفحات الديناميكية) */
    if (page.type === 'article') {
      injectSchema({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: page.title,
        description: page.description,
        image: LOGO_URL,
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: LOGO_URL },
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        inLanguage: 'ar-SA',
        mainEntityOfPage: url,
      });
    }

    /* 4. Breadcrumbs */
    const path = location.pathname.split('/').pop() || 'index.html';
    if (path !== 'index.html') {
      injectSchema({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_URL + '/index.html' },
          { '@type': 'ListItem', position: 2, name: page.title.split('—')[0].trim(), item: url },
        ],
      });
    }

    /* 5. IslamicWebPage (للمحتوى الإسلامي) */
    if (page.type === 'article' || page.type === 'website') {
      injectSchema({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.title,
        description: page.description,
        url: url,
        inLanguage: 'ar-SA',
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
        },
      });
    }
  }

  /* ============================================================
     ⚡ تشغيل
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySEO);
  } else {
    applySEO();
  }
})();