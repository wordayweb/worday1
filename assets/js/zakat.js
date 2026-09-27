/* ============ حساب الزكاة ============ */

const ZK = 'zakat_inputs';
const GOLD_NISAAB_G = 85;
const SILVER_NISAAB_G = 595;
const ZAKAT_RATE = 0.025;

let zakatBase = 'gold';

function fmt(n) {
  return (Math.round(n * 100) / 100).toLocaleString('ar-EG', { maximumFractionDigits: 2 });
}

function computeZakat() {
  const cash = +document.getElementById('zCash').value || 0;
  const goldG = +document.getElementById('zGoldG').value || 0;
  const goldP = +document.getElementById('zGoldPrice').value || 0;
  const silverG = +document.getElementById('zSilverG').value || 0;
  const silverP = +document.getElementById('zSilverPrice').value || 0;
  const stocks = +document.getElementById('zStocks').value || 0;
  const trade = +document.getElementById('zTrade').value || 0;
  const receivable = +document.getElementById('zReceivable').value || 0;
  const debts = +document.getElementById('zDebts').value || 0;

  const goldValue = goldG * goldP;
  const silverValue = silverG * silverP;

  const totalAssets = cash + goldValue + silverValue + stocks + trade + receivable;
  const netWorth = Math.max(totalAssets - debts, 0);

  const nisaab = zakatBase === 'gold'
    ? GOLD_NISAAB_G * goldP
    : SILVER_NISAAB_G * silverP;

  const reached = netWorth >= nisaab && nisaab > 0;
  const zakat = reached ? netWorth * ZAKAT_RATE : 0;

  document.getElementById('zTotalAssets').textContent = fmt(totalAssets) + ' ﷼';
  document.getElementById('zTotalDebts').textContent = fmt(debts) + ' ﷼';
  document.getElementById('zNetWorth').textContent = fmt(netWorth) + ' ﷼';
  document.getElementById('zNisaab').textContent = fmt(nisaab) + ' ﷼';
  document.getElementById('zZakat').textContent = fmt(zakat) + ' ﷼';

  const badge = document.getElementById('zrBadge');
  if (reached) {
    badge.textContent = 'بلغ النصاب ✅';
    badge.classList.remove('no');
  } else {
    badge.textContent = 'لم يبلغ النصاب';
    badge.classList.add('no');
  }

  LS.set(ZK, {
    cash, goldG, goldP, silverG, silverP,
    stocks, trade, receivable, debts,
    base: zakatBase,
  });
}

function zakatLoad() {
  const saved = LS.get(ZK, null);
  if (!saved) return;
  const map = {
    zCash: saved.cash, zGoldG: saved.goldG, zGoldPrice: saved.goldP,
    zSilverG: saved.silverG, zSilverPrice: saved.silverP,
    zStocks: saved.stocks, zTrade: saved.trade,
    zReceivable: saved.receivable, zDebts: saved.debts,
  };
  Object.entries(map).forEach(([id, v]) => {
    const el = document.getElementById(id);
    if (el && v != null) el.value = v;
  });
  if (saved.base) {
    zakatBase = saved.base;
    document.querySelectorAll('.nisaab-options button').forEach(b => {
      b.classList.toggle('active', b.dataset.base === zakatBase);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  zakatLoad();

  document.querySelectorAll('.zinput').forEach(inp => {
    inp.addEventListener('input', computeZakat);
  });

  document.querySelectorAll('.nisaab-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nisaab-options button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      zakatBase = btn.dataset.base;
      computeZakat();
    });
  });

  document.getElementById('zReset').addEventListener('click', () => {
    if (!confirm('تصفير جميع الحقول؟')) return;
    document.querySelectorAll('.zinput').forEach(i => i.value = 0);
    document.getElementById('zGoldPrice').value = 280;
    document.getElementById('zSilverPrice').value = 3;
    LS.del(ZK);
    computeZakat();
  });

  computeZakat();
});