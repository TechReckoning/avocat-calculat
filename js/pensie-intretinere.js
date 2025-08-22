/**
 * Calculator pentru pensia de întreținere conform art. 529 alin. (2) C.civ.
 * Calculează plafonul maxim pentru întreținerea copiilor
 */

// Formatter pentru moneda românească
const formatterRON = new Intl.NumberFormat('ro-RO', { 
  style: 'currency', 
  currency: 'RON',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Calculează fracția legală aplicabilă în funcție de numărul total de copii
 * @param {number} totalCopii - Numărul total de copii pentru care se datorează întreținere
 * @returns {number} Fracția legală (0.25, 0.3333333333, sau 0.5)
 */
function calculeazaFractie(totalCopii) {
  if (totalCopii === 1) return 0.25;        // 1/4
  if (totalCopii === 2) return 1/3;         // 1/3
  if (totalCopii >= 3) return 0.5;          // 1/2
  return 0;
}

/**
 * Calculează plafonul maxim total pentru întreținerea tuturor copiilor
 * @param {number} venitNet - Venitul lunar net al debitorului
 * @param {number} fractie - Fracția legală aplicabilă
 * @returns {number} Plafonul maxim total rotunjit la 2 zecimale
 */
function calculeazaPlafonTotal(venitNet, fractie) {
  return Math.round((venitNet * fractie) * 100) / 100;
}

/**
 * Calculează plafonul maxim pe copil în cauza curentă
 * @param {number} plafonTotal - Plafonul maxim total
 * @param {number} totalCopii - Numărul total de copii
 * @returns {number} Plafonul maxim pe copil rotunjit la 2 zecimale
 */
function calculeazaPlafonPerCopil(plafonTotal, totalCopii) {
  if (totalCopii <= 0) return 0;
  return Math.round((plafonTotal / totalCopii) * 100) / 100;
}

/**
 * Calculează toate rezultatele pentru calculatorul de pensie de întreținere
 * @param {Object} input - Obiectul cu datele de intrare
 * @param {number} input.venitNet - Venitul lunar net al debitorului
 * @param {number} input.totalCopii - Numărul total de copii
 * @returns {Object} Obiectul cu toate rezultatele calculate
 */
function calculeazaRezultat({ venitNet, totalCopii }) {
  const fractie = calculeazaFractie(totalCopii);
  const plafonTotal = calculeazaPlafonTotal(venitNet, fractie);
  const plafonPerCopil = calculeazaPlafonPerCopil(plafonTotal, totalCopii);
  
  return {
    fractie,
    plafonTotal,
    plafonPerCopil,
    fractieText: getFractieText(totalCopii)
  };
}

/**
 * Returnează textul fracției pentru afișare
 * @param {number} totalCopii - Numărul total de copii
 * @returns {string} Textul fracției (1/4, 1/3, sau 1/2)
 */
function getFractieText(totalCopii) {
  if (totalCopii === 1) return '1/4';
  if (totalCopii === 2) return '1/3';
  if (totalCopii >= 3) return '1/2';
  return '–';
}

/**
 * Validează input-urile și returnează datele validate
 * @returns {Object|null} Obiectul cu datele validate sau null dacă validarea eșuează
 */
function valideazaInput() {
  const venitNetInput = document.getElementById('venit-net');
  const totalCopiiInput = document.getElementById('total-copii');
  
  // Curăță și validează venitul net
  let venitNet = venitNetInput.value.replace(/[^0-9.,]/g, '').replace(',', '.');
  venitNetInput.value = venitNet;
  
  const venitNetNum = parseFloat(venitNet);
  const totalCopii = parseInt(totalCopiiInput.value);
  
  // Resetăm stilurile de eroare
  venitNetInput.style.borderColor = '#000000';
  totalCopiiInput.style.borderColor = '#000000';
  
  // Validări
  if (!venitNet || isNaN(venitNetNum) || venitNetNum <= 0) {
    venitNetInput.style.borderColor = '#ff0000';
    return null;
  }
  
  if (!totalCopii || totalCopii < 1 || totalCopii > 3) {
    totalCopiiInput.style.borderColor = '#ff0000';
    return null;
  }
  
  return {
    venitNet: venitNetNum,
    totalCopii: totalCopii
  };
}

/**
 * Afișează rezultatele în interfață
 * @param {Object} rezultat - Obiectul cu rezultatele calculate
 */
function afiseazaRezultate(rezultat) {
  document.getElementById('fractie-legal').textContent = rezultat.fractieText;
  document.getElementById('plafon-total').textContent = formatterRON.format(rezultat.plafonTotal);
  document.getElementById('plafon-per-copil').textContent = formatterRON.format(rezultat.plafonPerCopil);
  
  // Afișează secțiunea de rezultate
  document.getElementById('rezultate').style.display = 'block';
}

/**
 * Funcția principală care calculează pensia de întreținere
 * Se execută la fiecare modificare a input-urilor
 */
function calculeazaPensie() {
  const inputValidat = valideazaInput();
  
  if (!inputValidat) {
    // Ascunde rezultatele dacă input-ul nu e valid
    document.getElementById('rezultate').style.display = 'none';
    return;
  }
  
  const rezultat = calculeazaRezultat(inputValidat);
  afiseazaRezultate(rezultat);
}

/**
 * Resetează calculatorul la starea inițială
 */
function resetCalculator() {
  document.getElementById('venit-net').value = '';
  document.getElementById('total-copii').value = '';
  document.getElementById('rezultate').style.display = 'none';
  
  // Resetăm stilurile de eroare
  document.getElementById('venit-net').style.borderColor = '#000000';
  document.getElementById('total-copii').style.borderColor = '#000000';
}

/**
 * Copiază rezultatele în clipboard
 */
function copieazaRezultatele() {
  const fractieLegal = document.getElementById('fractie-legal').textContent;
  const plafonTotal = document.getElementById('plafon-total').textContent;
  const plafonPerCopil = document.getElementById('plafon-per-copil').textContent;
  
  const textDeCopiat = `Calculator Pensie de Întreținere - Rezultate:
Fracția legală aplicabilă: ${fractieLegal}
Plafon maxim total întreținere: ${plafonTotal}
Plafon maxim pe copil în cauza curentă: ${plafonPerCopil}

Conform art. 529 alin. (2) C.civ.
Calculator orientativ - nu constituie consultanță juridică.`;
  
  navigator.clipboard.writeText(textDeCopiat).then(() => {
    // Feedback vizual pentru utilizator
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copiat!';
    button.style.background = '#4CAF50';
    button.style.color = '#fff';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '#000000';
      button.style.color = '#ffffff';
    }, 2000);
  }).catch(err => {
    console.error('Eroare la copierea în clipboard:', err);
    alert('Nu s-a putut copia textul. Te rog să copiezi manual rezultatele.');
  });
}

// Inițializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', function() {
  // Adăugăm event listeners pentru validare în timp real
  const venitInput = document.getElementById('venit-net');
  const copiiSelect = document.getElementById('total-copii');
  
  // Validare la fiecare modificare
  venitInput.addEventListener('input', calculeazaPensie);
  copiiSelect.addEventListener('change', calculeazaPensie);
  
  // Focus pe primul câmp
  venitInput.focus();
});
