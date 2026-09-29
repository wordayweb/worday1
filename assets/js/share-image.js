/* ============ مشاركة الآية كصورة — WirdiShareImage ============ */

(function () {
  'use strict';

  const THEMES = {
    classic: {
      name: 'كريمي',
      bg1: '#F5F1E8', bg2: '#FBF8F1',
      text: '#1F4E3D', accent: '#C9A227',
      subtext: '#6B6B6B', border: '#E4CC6E'
    },
    night: {
      name: 'ليلي',
      bg1: '#1B2A24', bg2: '#0F1A15',
      text: '#F5F1E8', accent: '#E4CC6E',
      subtext: '#A8A8A8', border: '#C9A227'
    },
    emerald: {
      name: 'زمردي',
      bg1: '#1F4E3D', bg2: '#0F2A20',
      text: '#FBF8F1', accent: '#E4CC6E',
      subtext: '#C9D4CE', border: '#C9A227'
    }
  };

  const SIZES = {
    square:   { w: 1080, h: 1080, name: 'مربع' },
    portrait: { w: 1080, h: 1920, name: 'طولي' }
  };

  let modal = null;
  let currentState = {
    ayahText: '', surahName: '', ayahNum: '',
    theme: 'classic', size: 'square', canvas: null
  };

  async function ensureFont() {
    try {
      await document.fonts.load('700 60px "Amiri Quran"');
      await document.fonts.load('700 60px "Amiri"');
    } catch (e) {}
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  async function drawImage(state) {
    await ensureFont();
    const { w, h } = SIZES[state.size];
    const theme = THEMES[state.theme];

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    /* الخلفية */
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, theme.bg1);
    grad.addColorStop(1, theme.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    /* هالة ذهبية */
    const halo = ctx.createRadialGradient(w / 2, 100, 20, w / 2, 100, w * 0.7);
    halo.addColorStop(0, theme.accent + '33');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    /* إطار داخلي */
    const pad = 60;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

    ctx.strokeStyle = theme.border + '88';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad + 12, pad + 12, w - (pad + 12) * 2, h - (pad + 12) * 2);

    /* زخرفة علوية */
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 60px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('﷽', w / 2, pad + 100);

    /* اسم السورة */
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 44px "Amiri", serif';
    ctx.fillText('سورة ' + state.surahName + ' — الآية ' + state.ayahNum, w / 2, pad + 210);

    /* فاصل */
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 100, pad + 250);
    ctx.lineTo(w / 2 + 100, pad + 250);
    ctx.stroke();

    /* نص الآية */
    const maxWidth = w - pad * 2 - 100;
    const fontSize = state.size === 'portrait' ? 54 : 48;
    ctx.font = 'bold ' + fontSize + 'px "Amiri Quran", "Amiri", serif';
    ctx.fillStyle = theme.text;
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    const lines = wrapText(ctx, state.ayahText, maxWidth);
    const lineHeight = fontSize * 1.7;
    const totalHeight = lines.length * lineHeight;
    const startY = (h - totalHeight) / 2 + lineHeight / 2;

    lines.forEach(function (line, i) {
      ctx.fillText(line, w / 2, startY + i * lineHeight);
    });

    /* فاصل سفلي */
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 100, h - pad - 200);
    ctx.lineTo(w / 2 + 100, h - pad - 200);
    ctx.stroke();

    /* الشعار السفلي */
    ctx.font = 'bold 38px "Amiri", serif';
    ctx.fillStyle = theme.accent;
    ctx.fillText('وِرْدِي', w / 2, h - pad - 130);

    ctx.font = '24px "Tajawal", sans-serif';
    ctx.fillStyle = theme.subtext;
    ctx.fillText('رفيقك اليومي لذكر الله', w / 2, h - pad - 80);

    return canvas;
  }

  function buildModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'share-image-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'مشاركة الآية كصورة');
    modal.hidden = true;

    modal.innerHTML =
      '<div class="si-backdrop" data-close></div>' +
      '<div class="si-panel">' +
        '<header class="si-header">' +
          '<h3>🖼️ مشاركة الآية كصورة</h3>' +
          '<button type="button" class="si-close" aria-label="إغلاق" data-close>✕</button>' +
        '</header>' +
        '<div class="si-controls">' +
          '<div class="si-group" role="group" aria-label="اختر القالب">' +
            '<span class="si-group-label">القالب:</span>' +
            '<button type="button" class="si-chip" data-theme="classic">كريمي</button>' +
            '<button type="button" class="si-chip" data-theme="night">ليلي</button>' +
            '<button type="button" class="si-chip" data-theme="emerald">زمردي</button>' +
          '</div>' +
          '<div class="si-group" role="group" aria-label="اختر المقاس">' +
            '<span class="si-group-label">المقاس:</span>' +
            '<button type="button" class="si-chip" data-size="square">مربع</button>' +
            '<button type="button" class="si-chip" data-size="portrait">طولي</button>' +
          '</div>' +
        '</div>' +
        '<div class="si-preview" id="siPreview">' +
          '<div class="si-loading"><span class="spinner"></span><span>جارٍ توليد الصورة…</span></div>' +
        '</div>' +
        '<div class="si-actions">' +
          '<button type="button" class="si-btn si-btn-primary" id="siDownload">📥 تحميل</button>' +
          '<button type="button" class="si-btn si-btn-accent" id="siShare">📤 مشاركة</button>' +
          '<button type="button" class="si-btn" id="siCopy">📋 نسخ</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    modal.querySelectorAll('[data-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentState.theme = btn.dataset.theme;
        modal.querySelectorAll('[data-theme]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        refresh();
      });
    });

    modal.querySelectorAll('[data-size]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentState.size = btn.dataset.size;
        modal.querySelectorAll('[data-size]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        refresh();
      });
    });

    document.getElementById('siDownload').addEventListener('click', download);
    document.getElementById('siShare').addEventListener('click', share);
    document.getElementById('siCopy').addEventListener('click', copyToClipboard);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) close();
    });

    return modal;
  }

  async function refresh() {
    const preview = document.getElementById('siPreview');
    preview.innerHTML = '<div class="si-loading"><span class="spinner"></span><span>جارٍ توليد الصورة…</span></div>';
    try {
      const canvas = await drawImage(currentState);
      currentState.canvas = canvas;
      preview.innerHTML = '';
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
      canvas.style.borderRadius = '12px';
      preview.appendChild(canvas);
    } catch (e) {
      preview.innerHTML = '<div class="si-error">⚠️ فشل توليد الصورة</div>';
    }
  }

  function download() {
    if (!currentState.canvas) return;
    const link = document.createElement('a');
    link.download = 'wirdi-' + currentState.surahName + '-' + currentState.ayahNum + '-' + currentState.theme + '.png';
    link.href = currentState.canvas.toDataURL('image/png');
    link.click();
  }

  async function share() {
    if (!currentState.canvas) return;
    try {
      const blob = await new Promise(function (r) { currentState.canvas.toBlob(r, 'image/png'); });
      const file = new File([blob], 'wirdi-ayah.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'سورة ' + currentState.surahName + ' — الآية ' + currentState.ayahNum,
          text: currentState.ayahText
        });
      } else {
        download();
      }
    } catch (e) {
      if (e.name !== 'AbortError') download();
    }
  }

  async function copyToClipboard() {
    if (!currentState.canvas) return;
    try {
      const blob = await new Promise(function (r) { currentState.canvas.toBlob(r, 'image/png'); });
      await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
      const btn = document.getElementById('siCopy');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ تم';
      setTimeout(function () { btn.innerHTML = orig; }, 1500);
    } catch (e) {}
  }

  function open(state) {
    buildModal();
    Object.assign(currentState, state);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    modal.querySelectorAll('[data-theme]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.theme === currentState.theme);
    });
    modal.querySelectorAll('[data-size]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.size === currentState.size);
    });

    refresh();
    setTimeout(function () {
      const c = modal.querySelector('.si-close');
      if (c) c.focus();
    }, 100);
  }

  function close() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  window.WirdiShareImage = { open: open, close: close };
})();