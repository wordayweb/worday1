/* ============ صفحة الإعدادات ============ */

const SK = {
  dark: 'set_dark',
};

/* ---------- الوضع الليلي ---------- */
function initDark() {
  const darkEl = document.getElementById('setDark');
  if (!darkEl) return;

  darkEl.checked = document.body.classList.contains('dark');

  darkEl.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkEl.checked);
    LS.set(SK.dark, darkEl.checked);
  });
}

/* ---------- قسم PWA ---------- */
function initPWASection() {
  const cta = document.getElementById('pwaInstallCta');
  const note = document.getElementById('pwaInstallNote');
  const status = document.getElementById('pwaStatus');
  if (!status) return;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  /* تحديث الحالة */
  const updateStatus = () => {
    if (isStandalone) {
      status.classList.add('installed');
      status.querySelector('.pwa-status-ico').textContent = '✅';
      status.querySelector('.pwa-status-txt').textContent =
        'التطبيق مثبّت بالفعل — بارك الله فيك!';
      if (cta) {
        cta.disabled = true;
        cta.textContent = '✅ التطبيق مثبّت';
      }
      if (note) note.textContent = 'يمكنك فتح وِرْدِي من أيقونة على شاشتك';
    } else if (window.deferredPrompt) {
      status.classList.remove('installed', 'not-supported');
      status.querySelector('.pwa-status-ico').textContent = '🎯';
      status.querySelector('.pwa-status-txt').textContent =
        'جهازك يدعم التثبيت — اضغط الزر أعلاه للتثبيت الآن';
    } else if (isiOS) {
      status.classList.remove('installed', 'not-supported');
      status.querySelector('.pwa-status-ico').textContent = '🍎';
      status.querySelector('.pwa-status-txt').textContent =
        'على iPhone: استخدم Safari ثم زر المشاركة ← "إضافة إلى الشاشة الرئيسية"';
    } else if (!('serviceWorker' in navigator)) {
      status.classList.add('not-supported');
      status.querySelector('.pwa-status-ico').textContent = '⚠️';
      status.querySelector('.pwa-status-txt').textContent =
        'متصفحك لا يدعم التثبيت — جرّب Chrome أو Edge';
    } else {
      status.querySelector('.pwa-status-ico').textContent = 'ℹ️';
      status.querySelector('.pwa-status-txt').textContent =
        'اتبع الخطوات أعلاه حسب نوع جهازك لتثبيت التطبيق';
    }
  };

  /* زر التثبيت الرئيسي */
  if (cta) {
    cta.addEventListener('click', async () => {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;
        console.log('نتيجة التثبيت:', outcome);
        window.deferredPrompt = null;
        updateStatus();
      } else if (isStandalone) {
        alert('التطبيق مثبّت بالفعل ✅');
      } else if (isiOS) {
        alert('📱 على iPhone:\n\n1. افتح Safari\n2. اضغط زر المشاركة □↗\n3. اختر "إضافة إلى الشاشة الرئيسية"\n4. اضغط "إضافة"');
      } else {
        alert('📲 اتبع الخطوات في القسم أدناه حسب نوع جهازك');
        // افتح أول قسم مغلق
        const firstStep = document.querySelector('.pwa-step:not([open])');
        if (firstStep) {
          firstStep.setAttribute('open', '');
          firstStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  updateStatus();

  /* استمع لحدث ظهور إشعار التثبيت */
  window.addEventListener('beforeinstallprompt', () => {
    setTimeout(updateStatus, 100);
  });

  /* استمع لحدث إتمام التثبيت */
  window.addEventListener('appinstalled', () => {
    setTimeout(updateStatus, 100);
  });
}

/* ---------- التهيئة ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initDark();
  initPWASection();
});