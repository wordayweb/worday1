/* ============ صفحة التقويم المزدوج ============ */

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

const GREG_MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const HIJRI_EVENTS = {
  '1-1':   'رأس السنة الهجرية',
  '1-10':  'يوم عاشوراء',
  '3-12':  'المولد النبوي',
  '7-27':  'الإسراء والمعراج',
  '8-15':  'ليلة النصف من شعبان',
  '9-1':   'أول رمضان',
  '9-27':  'ليلة القدر (المرجّحة)',
  '10-1':  'عيد الفطر',
  '12-9':  'يوم عرفة',
  '12-10': 'عيد الأضحى',
};

let viewDate = new Date();

/* ---------- أدوات ---------- */
function toAr(s) {
  const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(s).replace(/[0-9]/g, d => ar[d]);
}

function getHijri(date) {
  try {
    const parts = new Intl.DateTimeFormat('en-SA-u-ca-islamic-nu-latn', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    }).formatToParts(date);
    const obj = {};
    parts.forEach(p => { if (p.type !== 'literal') obj[p.type] = p.value; });
    return {
      day: parseInt(obj.day, 10),
      month: parseInt(obj.month, 10),
      year: parseInt(obj.year, 10),
    };
  } catch {
    return { day: 1, month: 1, year: 1446 };
  }
}

/* ---------- بطاقة اليوم ---------- */
function renderTodayCard() {
  const d = new Date();
  const h = getHijri(d);

  document.getElementById('tcWeekday').textContent =
    new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(d);

  document.getElementById('tcHijri').textContent =
    `${toAr(h.day)} ${HIJRI_MONTHS[h.month - 1]} ${toAr(h.year)} هـ`;

  document.getElementById('tcGreg').textContent =
    `${toAr(d.getDate())} ${GREG_MONTHS_AR[d.getMonth()]} ${toAr(d.getFullYear())} م`;

  document.getElementById('tcDayHijri').textContent = toAr(h.day);
  document.getElementById('tcDayGreg').textContent = toAr(d.getDate());
}

/* ---------- شبكة هجرية ---------- */
function renderHijriGrid(viewDate) {
  const grid = document.getElementById('hijriGrid');
  grid.innerHTML = '';

  const firstOfGreg = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const hFirst = getHijri(firstOfGreg);

  // ابحث عن أول يوم من الشهر الهجري
  let startDate = new Date(firstOfGreg);
  let startHijri = getHijri(startDate);

  // ارجع للوراء حتى نصل لأول يوم من الشهر الهجري الحالي
  while (startHijri.day !== 1) {
    startDate.setDate(startDate.getDate() - 1);
    startHijri = getHijri(startDate);
  }

  // ابحث عن آخر يوم من الشهر الهجري
  let endDate = new Date(firstOfGreg);
  let endHijri = getHijri(endDate);

  // تقدّم حتى نهاية الشهر الهجري
  for (let i = 0; i < 40; i++) {
    const next = new Date(endDate);
    next.setDate(next.getDate() + 1);
    const nHijri = getHijri(next);
    if (nHijri.month !== hFirst.month || nHijri.year !== hFirst.year) break;
    endDate = next;
    endHijri = nHijri;
  }

  // أول يوم من الأسبوع
  const firstWeekday = startDate.getDay();

  // الأيام من الشهر السابق
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const cellDate = new Date(startDate);
    cellDate.setDate(cellDate.getDate() - i - 1);
    const h = getHijri(cellDate);
    const cell = document.createElement('div');
    cell.className = 'cal-cell other';
    cell.innerHTML = `
      ${toAr(h.day)}
      <span class="small-num">${cellDate.getDate()}</span>
    `;
    grid.appendChild(cell);
  }

  // أيام الشهر الهجري
  const today = new Date();
  const todayH = getHijri(today);

  let cursor = new Date(startDate);
  while (getHijri(cursor).month === hFirst.month && cursor <= endDate) {
    const h = getHijri(cursor);
    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    const isToday =
      cursor.getDate() === today.getDate() &&
      cursor.getMonth() === today.getMonth() &&
      cursor.getFullYear() === today.getFullYear();

    if (isToday) cell.classList.add('today');
    if (cursor.getDay() === 5) cell.classList.add('friday');

    const key = `${h.month}-${h.day}`;
    if (HIJRI_EVENTS[key]) {
      cell.classList.add('event');
      cell.title = HIJRI_EVENTS[key];
    }

    cell.innerHTML = `
      ${toAr(h.day)}
      <span class="small-num">${cursor.getDate()}</span>
    `;

    cell.addEventListener('click', () => {
      const ev = HIJRI_EVENTS[key];
      alert(
        `${toAr(h.day)} ${HIJRI_MONTHS[h.month - 1]} ${toAr(h.year)} هـ\n` +
        `${toAr(cursor.getDate())} ${GREG_MONTHS_AR[cursor.getMonth()]} ${toAr(cursor.getFullYear())} م` +
        (ev ? `\n\n🎉 ${ev}` : '')
      );
    });

    grid.appendChild(cell);

    const next = new Date(cursor);
    next.setDate(next.getDate() + 1);
    cursor = next;
  }

  // إكمال الصف الأخير
  const totalCells = firstWeekday + grid.querySelectorAll('.cal-cell').length - firstWeekday;
  const remainder = totalCells % 7;
  if (remainder) {
    for (let i = 1; i <= 7 - remainder; i++) {
      const cellDate = new Date(cursor);
      const h = getHijri(cellDate);
      const cell = document.createElement('div');
      cell.className = 'cal-cell other';
      cell.innerHTML = `
        ${toAr(h.day)}
        <span class="small-num">${cellDate.getDate()}</span>
      `;
      grid.appendChild(cell);
      cursor.setDate(cursor.getDate() + 1);
    }
  }
}

/* ---------- شبكة ميلادية ---------- */
function renderGregGrid(viewDate) {
  const grid = document.getElementById('gregGrid');
  grid.innerHTML = '';

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const firstWeekday = firstOfMonth.getDay();

  const today = new Date();

  // أيام الشهر السابق
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    const d = new Date(year, month - 1, day);
    const h = getHijri(d);
    const cell = document.createElement('div');
    cell.className = 'cal-cell other';
    cell.innerHTML = `
      ${toAr(day)}
      <span class="small-num">${h.day}</span>
    `;
    grid.appendChild(cell);
  }

  // أيام الشهر الحالي
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const h = getHijri(date);
    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) cell.classList.add('today');
    if (date.getDay() === 5) cell.classList.add('friday');

    const key = `${h.month}-${h.day}`;
    if (HIJRI_EVENTS[key]) {
      cell.classList.add('event');
      cell.title = HIJRI_EVENTS[key];
    }

    cell.innerHTML = `
      ${toAr(d)}
      <span class="small-num">${toAr(h.day)}</span>
    `;

    cell.addEventListener('click', () => {
      const ev = HIJRI_EVENTS[key];
      alert(
        `${toAr(d)} ${GREG_MONTHS_AR[month]} ${toAr(year)} م\n` +
        `${toAr(h.day)} ${HIJRI_MONTHS[h.month - 1]} ${toAr(h.year)} هـ` +
        (ev ? `\n\n🎉 ${ev}` : '')
      );
    });

    grid.appendChild(cell);
  }

  // إكمال الصف الأخير
  const totalCells = firstWeekday + daysInMonth;
  const remainder = totalCells % 7;
  if (remainder) {
    for (let i = 1; i <= 7 - remainder; i++) {
      const date = new Date(year, month + 1, i);
      const h = getHijri(date);
      const cell = document.createElement('div');
      cell.className = 'cal-cell other';
      cell.innerHTML = `
        ${toAr(i)}
        <span class="small-num">${toAr(h.day)}</span>
      `;
      grid.appendChild(cell);
    }
  }
}

/* ---------- عنوان الشهر ---------- */
function renderTitle(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const hFirst = getHijri(new Date(year, month, 1));
  const hLast = getHijri(new Date(year, month + 1, 0));

  const hijriTitle = (hFirst.month === hLast.month)
    ? `${HIJRI_MONTHS[hFirst.month - 1]} ${toAr(hFirst.year)} هـ`
    : `${HIJRI_MONTHS[hFirst.month - 1]} - ${HIJRI_MONTHS[hLast.month - 1]} ${toAr(hLast.year)} هـ`;

  const gregTitle = `${GREG_MONTHS_AR[month]} ${toAr(year)} م`;

  document.getElementById('calTitle').innerHTML = `
    <div>${hijriTitle}</div>
    <div style="font-size:13px;color:var(--ink-soft);font-weight:600;margin-top:2px;">${gregTitle}</div>
  `;
}

/* ---------- المناسبات ---------- */
function renderEvents(viewDate) {
  const list = document.getElementById('eventsList');
  list.innerHTML = '';

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const hFirst = getHijri(new Date(year, month, 1));
  const hLast = getHijri(new Date(year, month + 1, 0));

  const months = [];
  if (hLast.year === hFirst.year) {
    for (let m = hFirst.month; m <= hLast.month; m++) months.push(m);
  } else {
    for (let m = hFirst.month; m <= 12; m++) months.push(m);
    for (let m = 1; m <= hLast.month; m++) months.push(m);
  }

  const events = [];
  Object.entries(HIJRI_EVENTS).forEach(([key, name]) => {
    const [mm, dd] = key.split('-').map(Number);
    if (months.includes(mm)) {
      events.push({ month: mm, day: dd, name });
    }
  });

  if (!events.length) {
    list.innerHTML = '<li class="empty">لا توجد مناسبات هذا الشهر</li>';
    return;
  }

  events.sort((a, b) => a.month - b.month || a.day - b.day);
  events.forEach(ev => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="ev-name">${ev.name}</span>
      <span class="ev-date">${toAr(ev.day)} ${HIJRI_MONTHS[ev.month - 1]}</span>
    `;
    list.appendChild(li);
  });
}

/* ---------- العرض الكامل ---------- */
function renderAll() {
  renderTitle(viewDate);
  renderHijriGrid(viewDate);
  renderGregGrid(viewDate);
  renderEvents(viewDate);
}

/* ---------- التهيئة ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderTodayCard();
  renderAll();

  document.getElementById('prevMonth').addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderAll();
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderAll();
  });

  document.getElementById('todayBtn').addEventListener('click', () => {
    viewDate = new Date();
    renderAll();
  });
});