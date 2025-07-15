// dateUtils.js - Utilitare pentru date și zile lucrătoare

// Formatează data în format DD.MM.YYYY
function formatDateRO(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Returnează ziua săptămânii în română
function getWeekdayRO(date) {
  const zile = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];
  return zile[date.getDay()];
}

// Verifică dacă o dată este sărbătoare legală
function isHoliday(date, holidays) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const iso = `${year}-${month}-${day}`;
  return holidays.includes(iso);
}

// Verifică dacă o dată este zi nelucrătoare (sâmbătă, duminică sau sărbătoare)
function isNonWorkingDay(date) {
  return isSaturday(date) || isSunday(date) || isLegalHoliday(date);
}

// Verifică dacă o dată este zi lucrătoare
function isWorkingDay(date, holidays) {
  return !isSaturday(date) && !isSunday(date) && !isHoliday(date, holidays);
}

// Returnează prima zi lucrătoare după data dată
function nextWorkingDay(date, holidays) {
  let d = new Date(date);
  d.setDate(d.getDate() + 1);
  while (!isWorkingDay(d, holidays)) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

// Returnează ultima zi lucrătoare înainte de data dată
function prevWorkingDay(date, holidays) {
  let d = new Date(date);
  d.setDate(d.getDate() - 1);
  while (!isWorkingDay(d, holidays)) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

// Funcții helper pentru zile săptămânii
function isSaturday(date) {
  return date.getDay() === 6;
}

function isSunday(date) {
  return date.getDay() === 0;
}

// Funcție pentru adăugarea zilelor
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
} 