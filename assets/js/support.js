/* ============================================================
   support.js — منطق صفحة ادعمنا
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form    = document.getElementById('supportForm');
    var success = document.getElementById('spSuccess');
    var tierSel = document.getElementById('sp-tier');

    if (!form) return;

    /* اختيار المستوى بالضغط على أزرار المستويات */
    var tierBtns = document.querySelectorAll('.sp-btn-gold[data-tier]');
    tierBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tier = this.getAttribute('data-tier');
        if (tierSel && tier) tierSel.value = tier;
        var target = document.getElementById('support-form');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* إرسال النموذج */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var type  = form.querySelector('[name="type"]').value;
      var agree = form.querySelector('[name="agree"]').checked;

      if (!name || !email || !type || !agree) {
        alert('الرجاء إكمال الحقول الإلزامية والموافقة على التواصل.');
        return;
      }

      /* ============================================================
         هنا يتم الإرسال الفعلي. اختر أحد الخيارات:

         (أ) Formspree:
         fetch("https://formspree.io/f/XXXXXXX", {
           method: "POST",
           headers: { "Accept": "application/json" },
           body: new FormData(form)
         });

         (ب) Web3Forms:
         fetch("https://api.web3forms.com/submit", {
           method: "POST",
           headers: { "Accept": "application/json" },
           body: new FormData(form)
         });

         (ج) واتساب مباشر:
         var txt = encodeURIComponent(
           'الاسم: ' + name + '\n' +
           'البريد: ' + email + '\n' +
           'نوع الدعم: ' + type
         );
         window.open('https://wa.me/966500000000?text=' + txt, '_blank');
         ============================================================ */

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      form.reset();

      setTimeout(function () {
        if (success) success.hidden = true;
      }, 9000);
    });
  });
})();