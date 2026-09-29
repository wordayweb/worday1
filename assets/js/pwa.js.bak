/* ============ PWA — تسجيل Service Worker + زر التثبيت ============ */

(function () {

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then((registration) => {
          console.log('✅ تم تسجيل Service Worker:', registration.scope);
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateNotification();
              }
            });
          });
        })
        .catch((err) => console.warn('⚠️ فشل تسجيل Service Worker:', err.message));
    });
  }

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ تم تثبيت التطبيق');
    deferredPrompt = null;
    hideInstallButton();
    showInstalledMessage();
  });

  function showInstallButton() {
    if (document.getElementById('pwaInstallBtn')) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const btn = document.createElement('button');
    btn.id = 'pwaInstallBtn';
    btn.className = 'pwa-install-btn';
    btn.innerHTML = `
      <span class="pwa-install-ico">📲</span>
      <span class="pwa-install-text">ثبّت التطبيق</span>
      <button class="pwa-install-close" aria-label="إغلاق">✕</button>
    `;

    document.body.appendChild(btn);

    btn.addEventListener('click', async (e) => {
      if (e.target.classList.contains('pwa-install-close')) {
        hideInstallButton();
        return;
      }
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('نتيجة التثبيت:', outcome);
      if (outcome === 'accepted') hideInstallButton();
      deferredPrompt = null;
    });

    setTimeout(() => btn.classList.add('show'), 100);
  }

  function hideInstallButton() {
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) {
      btn.classList.remove('show');
      setTimeout(() => btn.remove(), 300);
    }
  }

  function showInstalledMessage() {
    const msg = document.createElement('div');
    msg.className = 'pwa-installed-msg';
    msg.innerHTML = `<span>✅</span><span>تم تثبيت وِرْدِي بنجاح</span>`;
    document.body.appendChild(msg);
    setTimeout(() => msg.classList.add('show'), 100);
    setTimeout(() => {
      msg.classList.remove('show');
      setTimeout(() => msg.remove(), 300);
    }, 3000);
  }

  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="pwa-update-content">
        <span class="pwa-update-ico">🔄</span>
        <div>
          <p class="pwa-update-title">يوجد تحديث جديد</p>
          <p class="pwa-update-text">اضغط للتحديث</p>
        </div>
      </div>
      <button class="pwa-update-btn">تحديث الآن</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);

    notification.querySelector('.pwa-update-btn').addEventListener('click', () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
  }

  window.addEventListener('online', () => document.body.classList.remove('is-offline'));
  window.addEventListener('offline', () => document.body.classList.add('is-offline'));

})();