/* ============ الصفحة الرئيسية — ترتيب ديناميكي ============ */

(function () {
  'use strict';

  function isHome() {
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' || p === 'index.html';
  }

  function moveStreak() {
    if (!isHome()) return;
    const slot = document.getElementById('streakSlot');
    if (!slot) return;
    const streakCard = document.querySelector('.streak-card');
    if (!streakCard) return;
    slot.appendChild(streakCard);
    slot.classList.remove('fade-in');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(moveStreak, 700);
    });
  } else {
    setTimeout(moveStreak, 700);
  }
})();