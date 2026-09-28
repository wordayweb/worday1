/* ============================================================
   support.js — منطق صفحة ادعمنا
   مربوط بـ Formspree: https://formspree.io/f/xwlpaodo
   ============================================================ */
(function () {
  'use strict';

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwlpaodo';

  document.addEventListener('DOMContentLoaded', function () {
    const form    = document.getElementById('supportForm');
    const success = document.getElementById('spSuccess');
    const tierSel = document.getElementById('sp-tier');
    const submitBtn = form ? form.querySelector('.sp-submit') : null;

    if (!form) return;

    /* ---------- اختيار المستوى بالضغط على أزرار المستويات ---------- */
    const tierBtns = document.querySelectorAll('.sp-btn-gold[data-tier]');
    tierBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tier = this.getAttribute('data-tier');
        if (tierSel && tier) tierSel.value = tier;
        const target = document.getElementById('support-form');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* ---------- إرسال النموذج ---------- */
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name  = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const type  = form.querySelector('[name="type"]').value;
      const agree = form.querySelector('[name="agree"]').checked;

      /* التحقق من الحقول الإلزامية */
      if (!name || !email || !type || !agree) {
        alert('الرجاء إكمال الحقول الإلزامية والموافقة على التواصل.');
        return;
      }

      /* التحقق من صيغة البريد */
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح.');
        return;
      }

      /* حالة التحميل */
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ جارٍ الإرسال…';
        submitBtn.style.opacity = '.7';
        submitBtn.style.cursor = 'wait';
      }

      /* إخفاء رسالة النجاح السابقة */
      if (success) success.hidden = true;

      try {
        const formData = new FormData(form);

        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          /* ✅ نجاح */
          if (success) {
            success.hidden = false;
            success.textContent = '✅ تم استلام طلبك بنجاح. سيتواصل معك فريق المشروع قريبًا، جزاك الله خيرًا.';
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { success.hidden = true; }, 12000);
          }
          form.reset();
        } else {
          /* ❌ خطأ من Formspree */
          const data = await response.json().catch(() => ({}));
          const msg = (data.errors && data.errors.map(er => er.message).join('، ')) || 'حدث خطأ غير متوقع.';
          alert('⚠️ تعذّر الإرسال: ' + msg);
        }
      } catch (err) {
        /* ❌ خطأ شبكة */
        console.error('Formspree error:', err);
        alert('⚠️ تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مرة أخرى.');
      } finally {
        /* استرجاع الزر */
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          submitBtn.style.opacity = '';
          submitBtn.style.cursor = '';
        }
      }
    });
  });
})();