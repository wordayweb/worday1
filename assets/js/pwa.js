/* ============================================================
   PWA — تسجيل Service Worker + زر التثبيت + إشعار التحديث
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1) تسجيل Service Worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then((reg) => {
          reg.update();
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateToast(reg);
              }
            });
          });
        })
        .catch((err) => console.warn('⚠️ فشل تسجيل Service Worker:', err));
    });
  }

  /* ---------- 2) إشعار تحديث متاح ---------- */
  function showUpdateToast(reg) {
    if (document.getElementById('pwa-update-toast')) return;
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.className = 'pwa-toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML =
      '<span class="pwa-toast-text">يتوفر إصدار جديد من وردي</span>' +
      '<button id="pwa-update-btn" type="button" class="pwa-toast-btn">تحديث</button>' +
      '<button id="pwa-dismiss-btn" type="button" class="pwa-toast-close" aria-label="إغلاق">✕</button>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    document.getElementById('pwa-update-btn').addEventListener('click', () => {
      if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
    });
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });
  }

  let refreshing = false;
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  /* ---------- 3) زر التثبيت ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  function showInstallButton() {
    if (document.getElementById('pwa-install-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'pwa-install-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'ثبت تطبيق وردي');
    btn.innerHTML = '📲 ثبت وردي';
    btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const r = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (r.outcome === 'accepted') btn.remove();
    });
    document.body.appendChild(btn);
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.remove();
  });

  /* ---------- 4) حالة الاتصال ---------- */
  window.addEventListener('offline', () => {
    document.documentElement.classList.add('is-offline');
  });
  window.addEventListener('online', () => {
    document.documentElement.classList.remove('is-offline');
  });
})();