// holidays.js - Sărbători legale România 2024-2030

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Sărbători fixe pentru toți anii
function getFixedHolidays(year) {
  return [
    `${year}-01-01`, // Anul Nou
    `${year}-01-02`, // A doua zi după Anul Nou
    `${year}-01-06`, // Bobotează
    `${year}-01-07`, // Sfântul Ioan Botezătorul
    `${year}-01-24`, // Ziua Unirii Principatelor Române
    `${year}-05-01`, // Ziua Muncii
    `${year}-06-01`, // Ziua Copilului
    `${year}-08-15`, // Adormirea Maicii Domnului
    `${year}-11-30`, // Sfântul Andrei
    `${year}-12-01`, // Ziua Națională a României
    `${year}-12-25`, // Crăciunul
    `${year}-12-26`, // A doua zi de Crăciun
  ];
}

// Sărbători mobile pentru anii 2024-2030
function getMobileHolidays(year) {
  const holidays = [];
  
  switch (year) {
    case 2024:
      // Paște ortodox 2024: 3-6 mai
      holidays.push('2024-05-03', '2024-05-04', '2024-05-05', '2024-05-06');
      // Rusalii: 23-24 iunie
      holidays.push('2024-06-23', '2024-06-24');
      break;
      
    case 2025:
      // Paște ortodox 2025: 18-21 aprilie
      holidays.push('2025-04-18', '2025-04-19', '2025-04-20', '2025-04-21');
      // Rusalii: 8-9 iunie
      holidays.push('2025-06-08', '2025-06-09');
      break;
      
    case 2026:
      // Paște ortodox 2026: 10-13 aprilie
      holidays.push('2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13');
      // Rusalii: 31 mai - 1 iunie
      holidays.push('2026-05-31', '2026-06-01');
      break;
      
    case 2027:
      // Paște ortodox 2027: 30 aprilie - 3 mai
      holidays.push('2027-04-30', '2027-05-01', '2027-05-02', '2027-05-03');
      // Rusalii: 20-21 iunie
      holidays.push('2027-06-20', '2027-06-21');
      break;
      
    case 2028:
      // Paște ortodox 2028: 14-17 aprilie
      holidays.push('2028-04-14', '2028-04-15', '2028-04-16', '2028-04-17');
      // Rusalii: 4-5 iunie
      holidays.push('2028-06-04', '2028-06-05');
      break;
      
    case 2029:
      // Paște ortodox 2029: 6-9 aprilie
      holidays.push('2029-04-06', '2029-04-07', '2029-04-08', '2029-04-09');
      // Rusalii: 27-28 mai
      holidays.push('2029-05-27', '2029-05-28');
      break;
      
    case 2030:
      // Paște ortodox 2030: 26-29 aprilie
      holidays.push('2030-04-26', '2030-04-27', '2030-04-28', '2030-04-29');
      // Rusalii: 16-17 iunie
      holidays.push('2030-06-16', '2030-06-17');
      break;
      
    default:
      // Pentru anii în afara intervalului 2024-2030, returnează doar sărbătorile fixe
      break;
  }
  
  return holidays;
}

// Funcția principală - returnează toate sărbătorile pentru un an
function getLegalHolidays(year) {
  const fixedHolidays = getFixedHolidays(year);
  const mobileHolidays = getMobileHolidays(year);
  
  return [...fixedHolidays, ...mobileHolidays];
}

// Verifică dacă o dată este sărbătoare legală
function isLegalHoliday(date) {
  const year = date.getFullYear();
  const holidays = getLegalHolidays(year);
  const iso = formatDate(date);
  return holidays.includes(iso);
} 