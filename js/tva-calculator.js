/**
 * Calculator pentru TVA cu două direcții de calcul
 * Din sumă fără TVA → calculează TVA și Total (cu TVA)
 * Din sumă cu TVA → extrage TVA și Suma fără TVA
 */

// Formatter pentru moneda românească
const formatterRON = new Intl.NumberFormat('ro-RO', { 
  style: 'currency', 
  currency: 'RON',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Transformă o valoare în bani (cents) pentru calcule precise
 * @param {number} valNumber - Valoarea în RON
 * @returns {number} Valoarea în bani (cents)
 */
function toBani(valNumber) {
  return Math.round(valNumber * 100);
}

/**
 * Transformă o valoare din bani (cents) în RON
 * @param {number} valBani - Valoarea în bani (cents)
 * @returns {number} Valoarea în RON
 */
function fromBani(valBani) {
  return valBani / 100;
}

/**
 * Formatează o valoare numerică în format RON
 * @param {number} number - Valoarea numerică
 * @returns {string} Valoarea formatată în RON
 */
function formatRON(number) {
  return formatterRON.format(number);
}

/**
 * Calculează TVA-ul și totalul din suma fără TVA
 * @param {number} net - Suma fără TVA
 * @param {number} ratePercent - Cota de TVA în procente
 * @returns {Object} Obiect cu TVA-ul și totalul
 */
function calcFromNet(net, ratePercent) {
  const netBani = toBani(net);
  const rateDecimal = ratePercent / 100;
  
  const tvaBani = Math.round(netBani * rateDecimal);
  const totalBani = netBani + tvaBani;
  
  return {
    tva: fromBani(tvaBani),
    total: fromBani(totalBani)
  };
}

/**
 * Calculează TVA-ul și suma fără TVA din suma cu TVA
 * @param {number} gross - Suma cu TVA
 * @param {number} ratePercent - Cota de TVA în procente
 * @returns {Object} Obiect cu TVA-ul și suma fără TVA
 */
function calcFromGross(gross, ratePercent) {
  const grossBani = toBani(gross);
  const rateDecimal = ratePercent / 100;
  
  const netBani = Math.round(grossBani / (1 + rateDecimal));
  const tvaBani = grossBani - netBani;
  
  return {
    tva: fromBani(tvaBani),
    net: fromBani(netBani)
  };
}

/**
 * Validează cota de TVA
 * @param {number} cota - Cota de TVA în procente
 * @returns {boolean} True dacă cota este validă
 */
function valideazaCotaTVA(cota) {
  return !isNaN(cota) && cota >= 0 && cota <= 100;
}

/**
 * Validează o sumă monetară
 * @param {string} suma - Suma ca string
 * @returns {number|null} Suma validată ca number sau null dacă e invalidă
 */
function valideazaSuma(suma) {
  if (!suma || suma.trim() === '') return null;
  
  // Curăță și validează suma
  let sumaCurata = suma.replace(/[^0-9.,]/g, '').replace(',', '.');
  const sumaNum = parseFloat(sumaCurata);
  
  if (isNaN(sumaNum) || sumaNum < 0) return null;
  
  return sumaNum;
}

/**
 * Schimbă modul de calcul între net și brut
 */
function schimbaModCalcul() {
  const modNet = document.querySelector('input[name="mod-calcul"][value="net"]');
  const campNet = document.getElementById('camp-net');
  const campBrut = document.getElementById('camp-brut');
  const rezultateNet = document.getElementById('rezultate-net');
  const rezultateBrut = document.getElementById('rezultate-brut');
  
  if (modNet.checked) {
    // Mod net - calculează din sumă fără TVA
    campNet.style.display = 'block';
    campBrut.style.display = 'none';
    rezultateNet.style.display = 'block';
    rezultateBrut.style.display = 'none';
    
    // Curăță câmpul brut și focus pe net
    document.getElementById('suma-brut').value = '';
    document.getElementById('suma-net').focus();
  } else {
    // Mod brut - extrage din sumă cu TVA
    campNet.style.display = 'none';
    campBrut.style.display = 'block';
    rezultateNet.style.display = 'none';
    rezultateBrut.style.display = 'block';
    
    // Curăță câmpul net și focus pe brut
    document.getElementById('suma-net').value = '';
    document.getElementById('suma-brut').focus();
  }
  
  // Recalculează cu noile date
  calculeazaTVA();
}

/**
 * Calculează TVA-ul în funcție de modul selectat
 */
function calculeazaTVA() {
  const cotaTVA = parseFloat(document.getElementById('cota-tva').value);
  const modNet = document.querySelector('input[name="mod-calcul"][value="net"]').checked;
  
  // Validează cota TVA
  if (!valideazaCotaTVA(cotaTVA)) {
    document.getElementById('cota-tva').style.borderColor = '#ff0000';
    document.getElementById('rezultate').style.display = 'none';
    return;
  }
  
  // Resetăm stilurile de eroare
  document.getElementById('cota-tva').style.borderColor = '#000000';
  
  if (modNet) {
    // Calculează din sumă fără TVA
    const sumaNet = valideazaSuma(document.getElementById('suma-net').value);
    
    if (sumaNet === null) {
      document.getElementById('suma-net').style.borderColor = '#ff0000';
      document.getElementById('rezultate').style.display = 'none';
      return;
    }
    
    document.getElementById('suma-net').style.borderColor = '#000000';
    
    const rezultat = calcFromNet(sumaNet, cotaTVA);
    
    document.getElementById('tva-calculat').textContent = formatRON(rezultat.tva);
    document.getElementById('total-cu-tva').textContent = formatRON(rezultat.total);
    
    document.getElementById('rezultate').style.display = 'block';
    
  } else {
    // Extrage din sumă cu TVA
    const sumaBrut = valideazaSuma(document.getElementById('suma-brut').value);
    
    if (sumaBrut === null) {
      document.getElementById('suma-brut').style.borderColor = '#ff0000';
      document.getElementById('rezultate').style.display = 'none';
      return;
    }
    
    document.getElementById('suma-brut').style.borderColor = '#000000';
    
    const rezultat = calcFromGross(sumaBrut, cotaTVA);
    
    document.getElementById('tva-inclus').textContent = formatRON(rezultat.tva);
    document.getElementById('suma-fara-tva').textContent = formatRON(rezultat.net);
    
    document.getElementById('rezultate').style.display = 'block';
  }
}

/**
 * Resetează calculatorul la starea inițială
 */
function resetCalculator() {
  // Resetăm cota TVA la 21%
  document.getElementById('cota-tva').value = '21';
  
  // Resetăm câmpurile de sumă
  document.getElementById('suma-net').value = '';
  document.getElementById('suma-brut').value = '';
  
  // Resetăm stilurile de eroare
  document.getElementById('cota-tva').style.borderColor = '#000000';
  document.getElementById('suma-net').style.borderColor = '#000000';
  document.getElementById('suma-brut').style.borderColor = '#000000';
  
  // Ascundem rezultatele
  document.getElementById('rezultate').style.display = 'none';
  
  // Revenim la modul net
  document.querySelector('input[name="mod-calcul"][value="net"]').checked = true;
  schimbaModCalcul();
  
  // Focus pe primul câmp
  document.getElementById('cota-tva').focus();
}

/**
 * Copiază rezultatele în clipboard
 */
function copieazaRezultatele() {
  const cotaTVA = document.getElementById('cota-tva').value;
  const modNet = document.querySelector('input[name="mod-calcul"][value="net"]').checked;
  
  let textDeCopiat = `Calculator TVA - Rezultate:
Cota TVA: ${cotaTVA}%

`;
  
  if (modNet) {
    const tvaCalculat = document.getElementById('tva-calculat').textContent;
    const totalCuTVA = document.getElementById('total-cu-tva').textContent;
    
    textDeCopiat += `Mod: Calculează din sumă fără TVA
TVA: ${tvaCalculat}
Total cu TVA: ${totalCuTVA}`;
  } else {
    const tvaInclus = document.getElementById('tva-inclus').textContent;
    const sumaFaraTVA = document.getElementById('suma-fara-tva').textContent;
    
    textDeCopiat += `Mod: Extrage din sumă cu TVA
TVA inclus: ${tvaInclus}
Sumă fără TVA: ${sumaFaraTVA}`;
  }
  
  textDeCopiat += `

Calculator orientativ - nu constituie consultanță fiscală.`;
  
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
  const cotaInput = document.getElementById('cota-tva');
  const sumaNetInput = document.getElementById('suma-net');
  const sumaBrutInput = document.getElementById('suma-brut');
  
  // Validare la fiecare modificare
  cotaInput.addEventListener('input', calculeazaTVA);
  sumaNetInput.addEventListener('input', calculeazaTVA);
  sumaBrutInput.addEventListener('input', calculeazaTVA);
  
  // Focus pe primul câmp
  cotaInput.focus();
  
  // Inițializăm modul de calcul
  schimbaModCalcul();
});
