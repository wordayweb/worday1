/* ============ الصفحة الرئيسية — ترتيب ديناميكي + تحسينات ============ */

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
  }

  function addSmartAdhkarMore() {
    if (!isHome()) return;
    const hero = document.getElementById('smartHero');
    if (!hero) return;
    if (hero.querySelector('.smart-more-btn')) return;

    const items = hero.querySelectorAll('li, .adhkar-item, .dhikr-item, .sa-item, [class*="item"]');
    if (!items.length) return;

    const h = new Date().getHours();
    const isEvening = h >= 17 || h < 4;
    const link = isEvening ? 'athkar-evening.html' : 'athkar-morning.html';
    const label = isEvening ? 'عرض كل أذكار المساء' : 'عرض كل أذكار الصباح';

    const btn = document.createElement('a');
    btn.href = link;
    btn.className = 'smart-more-btn';
    btn.setAttribute('aria-label', label);
    btn.innerHTML = '<span>' + label + '</span><span class="arrow" aria-hidden="true">←</span>';

    const last = items[items.length - 1];
    last.parentNode.appendChild(btn);
  }

  function init() {
    if (!isHome()) return;
    moveStreak();
    setTimeout(addSmartAdhkarMore, 900);
    setTimeout(addSmartAdhkarMore, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 700);
    });
  } else {
    setTimeout(init, 700);
  }
})();