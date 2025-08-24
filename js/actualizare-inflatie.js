// Calculator de Actualizare cu Indicele Inflației - IPC (anual)
// Versiunea: 1.0
// Ultima actualizare: 2024

// Set to true for debugging and self-check tests
const DEBUG = true;

// Indicele prețurilor de consum - % (an/precedent)
const CPI_BY_YEAR = {
  1971: 100.6, 1972: 100.0, 1973: 100.7, 1974: 101.1, 1975: 100.2,
  1976: 100.6, 1977: 100.6, 1978: 101.6, 1979: 102.0, 1980: 102.1,
  1981: 103.1, 1982: 117.8, 1983: 104.1, 1984: 101.1, 1985: 100.8,
  1986: 101.0, 1987: 100.9, 1988: 102.2, 1989: 101.1, 1990: 105.1,
  1991: 270.2, 1992: 310.4, 1993: 356.1, 1994: 236.7, 1995: 132.3,
  1996: 138.8, 1997: 254.8, 1998: 159.1, 1999: 145.8, 2000: 145.7,
  2001: 134.5, 2002: 122.5, 2003: 115.3, 2004: 111.9, 2005: 109.0,
  2006: 106.56, 2007: 104.84, 2008: 107.85, 2009: 105.59, 2010: 106.09,
  2011: 105.79, 2012: 103.33, 2013: 103.98, 2014: 101.07, 2015: 99.41,
  2016: 98.45, 2017: 101.34, 2018: 104.63, 2019: 103.83, 2020: 102.63,
  2021: 105.05, 2022: 113.80, 2023: 110.40, 2024: 105.59
};

/**
 * Parsează o sumă din string, acceptând atât "." cât și "," pentru zecimale
 * @param {string} inputString - String-ul de parsat
 * @returns {number} Suma ca număr
 */
function parseAmount(inputString) {
  if (!inputString || typeof inputString !== 'string') return 0;
  
  // Înlocuiește virgula cu punct și elimină spațiile
  const cleaned = inputString.replace(/\s/g, '').replace(',', '.');
  
  // Parsează ca float
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Generează vectorul de ani pentru înlănțuire în ordinea corectă
 * @param {number} y0 - Anul de origine
 * @param {number} y1 - Anul țintă
 * @param {boolean} includeOrigin - Dacă să includă anul de origine
 * @returns {number[]} Vectorul de ani înlănțuiți
 */
function getYearRange(y0, y1, includeOrigin) {
  const years = [];
  
  if (y0 === y1) {
    return years; // Fără actualizare
  }
  
  if (y1 > y0) {
    // Actualizare înainte
    const startYear = includeOrigin ? y0 : y0 + 1;
    for (let year = startYear; year <= y1; year++) {
      years.push(year);
    }
  } else {
    // Retro-indexare (y1 < y0)
    const startYear = includeOrigin ? y1 : y1 + 1;
    for (let year = startYear; year <= y0; year++) {
      years.push(year);
    }
  }
  
  return years;
}

/**
 * Calculează factorul cumulativ pentru un vector de ani
 * @param {number[]} years - Vectorul de ani
 * @returns {number} Factorul cumulativ
 */
function computeChainFactor(years) {
  if (years.length === 0) return 1;
  
  let factor = 1;
  
  for (const year of years) {
    if (CPI_BY_YEAR[year] === undefined) {
      throw new Error(`Lipsește IPC pentru anul ${year}`);
    }
    factor *= CPI_BY_YEAR[year] / 100;
  }
  
  return factor;
}

/**
 * Actualizează o sumă folosind înlănțuirea indicilor IPC
 * @param {number} amount - Suma de actualizat
 * @param {number} y0 - Anul de origine
 * @param {number} y1 - Anul țintă
 * @param {boolean} includeOrigin - Dacă să includă anul de origine
 * @returns {Object} Rezultatul cu factor, anii folosiți și suma actualizată
 */
function updateAmount(amount, y0, y1, includeOrigin) {
  if (y0 === y1) {
    return {
      factor: 1,
      yearsUsed: [],
      updated: amount
    };
  }
  
  const years = getYearRange(y0, y1, includeOrigin);
  const factor = computeChainFactor(years);
  
  let updated;
  if (y1 > y0) {
    // Actualizare înainte
    updated = amount * factor;
  } else {
    // Retro-indexare
    updated = amount / factor;
  }
  
  return {
    factor,
    yearsUsed: years,
    updated
  };
}

/**
 * Formatează o sumă ca monedă românească
 * @param {number} amount - Suma de formatat
 * @returns {string} Suma formatată
 */
function formatMoney(amount) {
  return amount.toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Validează input-urile și returnează lista de erori
 * @param {number} amount - Suma
 * @param {number} y0 - Anul de origine
 * @param {number} y1 - Anul țintă
 * @returns {string[]} Lista de erori
 */
function validateInputs(amount, y0, y1) {
  const errors = [];
  
  if (!amount || amount <= 0) {
    errors.push('Suma trebuie să fie mai mare decât 0');
  }
  
  if (!y0 || !y1) {
    errors.push('Ambele ani trebuie selectate');
  }
  
  if (y0 && y1 && (y0 < 1971 || y0 > 2024 || y1 < 1971 || y1 > 2024)) {
    errors.push('Anii trebuie să fie în intervalul 1971-2024');
  }
  
  return errors;
}

/**
 * Populează dropdown-urile cu anii disponibili
 */
function populateYearDropdowns() {
  const years = Object.keys(CPI_BY_YEAR).map(Number).sort((a, b) => a - b);
  
  const originSelect = document.getElementById('originYear');
  const targetSelect = document.getElementById('targetYear');
  
  if (originSelect && targetSelect) {
    // Golește opțiunile existente
    originSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    
    // Adaugă opțiunea default
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selectează anul';
    originSelect.appendChild(defaultOption.cloneNode(true));
    targetSelect.appendChild(defaultOption.cloneNode(true));
    
    // Adaugă anii
    years.forEach(year => {
      const option1 = document.createElement('option');
      option1.value = year;
      option1.textContent = year;
      originSelect.appendChild(option1);
      
      const option2 = document.createElement('option');
      option2.value = year;
      option2.textContent = year;
      targetSelect.appendChild(option2);
    });
  }
}

/**
 * Calculează și afișează rezultatele
 */
function calculateResults() {
  const amountInput = document.getElementById('amount');
  const originYear = document.getElementById('originYear');
  const targetYear = document.getElementById('targetYear');
  const includeOrigin = document.getElementById('includeOrigin');
  const rounding = document.getElementById('rounding');
  
  const amount = parseAmount(amountInput.value);
  const y0 = parseInt(originYear.value);
  const y1 = parseInt(targetYear.value);
  const includeOriginYear = includeOrigin.checked;
  const useRounding = rounding.value === 'rounded';
  
  // Validează input-urile
  const errors = validateInputs(amount, y0, y1);
  
  if (errors.length > 0) {
    displayResults('', '', '', errors);
    return;
  }
  
  try {
    const result = updateAmount(amount, y0, y1, includeOriginYear);
    
    // Formatează rezultatele
    const factor = result.factor.toFixed(4);
    let updatedAmount;
    
    if (useRounding) {
      updatedAmount = formatMoney(result.updated);
    } else {
      updatedAmount = result.updated.toFixed(6);
    }
    
    // Formatează lista anilor cu indicii IPC
    let yearsList = '';
    if (result.yearsUsed.length > 0) {
      yearsList = result.yearsUsed.map(year => `${year} (${CPI_BY_YEAR[year]})`).join(' → ');
    } else {
      yearsList = 'Fără actualizare (aceeași perioadă)';
    }
    
    displayResults(factor, updatedAmount, yearsList);
    
  } catch (error) {
    displayResults('', '', '', [error.message]);
  }
}

/**
 * Afișează rezultatele sau erorile
 */
function displayResults(factor, updatedAmount, yearsList, errors = []) {
  const resultsDiv = document.getElementById('results');
  const factorDiv = document.getElementById('factorResult');
  const amountDiv = document.getElementById('amountResult');
  const yearsDiv = document.getElementById('yearsResult');
  const errorsDiv = document.getElementById('errors');
  
  if (errors.length > 0) {
    // Afișează erorile
    resultsDiv.style.display = 'none';
    errorsDiv.style.display = 'block';
    errorsDiv.innerHTML = '<strong>Erori:</strong><br>' + errors.join('<br>');
  } else {
    // Afișează rezultatele
    errorsDiv.style.display = 'none';
    resultsDiv.style.display = 'block';
    
    factorDiv.textContent = factor;
    amountDiv.textContent = updatedAmount + ' Lei';
    yearsDiv.textContent = yearsList;
    
    // Afișează butonul de export
    document.getElementById('exportBtn').style.display = 'inline-block';
  }
}

/**
 * Resetează calculatorul
 */
function resetCalculator() {
  document.getElementById('amount').value = '';
  document.getElementById('originYear').value = '';
  document.getElementById('targetYear').value = '';
  document.getElementById('includeOrigin').checked = false;
  document.getElementById('rounding').value = 'rounded';
  
  document.getElementById('results').style.display = 'none';
  document.getElementById('errors').style.display = 'none';
  
  // Ascunde butonul de export
  document.getElementById('exportBtn').style.display = 'none';
}

/**
 * Inițializează calculatorul
 */
function initCalculator() {
  // Populează dropdown-urile
  populateYearDropdowns();
  
  // Atașează evenimente
  document.getElementById('calculateBtn').addEventListener('click', calculateResults);
  document.getElementById('resetBtn').addEventListener('click', resetCalculator);
  
  // Enter pentru calcul, ESC pentru reset
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      calculateResults();
    } else if (e.key === 'Escape') {
      resetCalculator();
    }
  });
  
  // Nu mai facem formatare automată pentru a permite introducerea liberă
  // document.getElementById('amount').addEventListener('input', function() {
  //   // Parsează și reformatează input-ul
  //   const value = this.value;
  //   const parsed = parseAmount(value);
  //   if (parsed > 0) {
  //     this.value = formatMoney(parsed);
  //   }
  // });
  
  // Self-check dacă este în mod debug
  if (DEBUG) {
    runSelfCheck();
  }
}

/**
 * Self-check pentru debugging
 */
function runSelfCheck() {
  console.log('🔍 Running self-check tests...');
  
  try {
    // Test 1: 2020 → 2024, exclude origine
    let result = updateAmount(1000, 2020, 2024, false);
    let expectedFactor = (105.05/100) * (113.80/100) * (110.40/100) * (105.59/100);
    let tolerance = Math.abs(result.factor - expectedFactor) < 1e-6;
    console.log(`Test 1 (2020→2024, exclude origine): ${tolerance ? '✅' : '❌'}`);
    console.log(`  Expected: ${expectedFactor}, Got: ${result.factor}`);
    
    // Test 2: 2015 → 2016, exclude origine
    result = updateAmount(1000, 2015, 2016, false);
    expectedFactor = 98.45/100;
    tolerance = Math.abs(result.factor - expectedFactor) < 1e-6;
    console.log(`Test 2 (2015→2016, exclude origine): ${tolerance ? '✅' : '❌'}`);
    console.log(`  Expected: ${expectedFactor}, Got: ${result.factor}`);
    
    // Test 3: 1991 → 1993, exclude origine
    result = updateAmount(1000, 1991, 1993, false);
    expectedFactor = (310.4/100) * (356.1/100);
    tolerance = Math.abs(result.factor - expectedFactor) < 1e-6;
    console.log(`Test 3 (1991→1993, exclude origine): ${tolerance ? '✅' : '❌'}`);
    console.log(`  Expected: ${expectedFactor}, Got: ${result.factor}`);
    
    // Test 4: 1993 → 1991, exclude origine (retro-indexare)
    result = updateAmount(1000, 1993, 1991, false);
    expectedFactor = 1 / ((310.4/100) * (356.1/100));
    tolerance = Math.abs(result.factor - expectedFactor) < 1e-6;
    console.log(`Test 4 (1993→1991, exclude origine): ${tolerance ? '✅' : '❌'}`);
    console.log(`  Expected: ${expectedFactor}, Got: ${result.factor}`);
    
    // Test 5: 2019 → 2019
    result = updateAmount(1000, 2019, 2019, false);
    expectedFactor = 1;
    tolerance = Math.abs(result.factor - expectedFactor) < 1e-6;
    console.log(`Test 5 (2019→2019): ${tolerance ? '✅' : '❌'}`);
    console.log(`  Expected: ${expectedFactor}, Got: ${result.factor}`);
    
    console.log('🔍 Self-check completed!');
    
  } catch (error) {
    console.error('❌ Self-check failed:', error);
  }
}

// Funcție pentru export PDF
function exportResultsToPDF() {
  const calculatorName = 'Calculator Orientativ de Actualizare cu Indicele Inflației';
  
  // Colectează datele din formular cu suport pentru radio buttons
  const inputData = collectInflationFormData();
  
  // Colectează rezultatele specifice pentru calculatorul de actualizare cu inflația
  const results = collectInflationResults();
  
  // Verifică dacă sunt rezultate
  if (Object.keys(results).length === 0) {
    alert('Nu există rezultate de exportat. Vă rugăm să faceți un calcul mai întâi.');
    return;
  }
  
  // Exportă PDF-ul
  exportToPDF(calculatorName, inputData, results);
}

// Funcție pentru a colecta rezultatele specifice pentru calculatorul de actualizare cu inflația
function collectInflationResults() {
  const results = {};
  
  // Colectează factorul cumulativ
  const factorElement = document.getElementById('factorResult');
  if (factorElement && factorElement.textContent && factorElement.textContent !== '–') {
    results['Factor cumulativ de actualizare'] = {
      label: 'Factor cumulativ de actualizare',
      value: factorElement.textContent,
      formula: '∏ (IPC_an / 100) pentru fiecare an din lanț',
      details: 'Factorul cumulativ reprezintă produsul indicilor IPC pentru perioada selectată'
    };
  }
  
  // Colectează suma actualizată
  const amountElement = document.getElementById('amountResult');
  if (amountElement && amountElement.textContent && amountElement.textContent !== '–') {
    results['Suma actualizată'] = {
      label: 'Suma actualizată',
      value: amountElement.textContent,
      formula: 'Suma inițială × Factor cumulativ',
      details: 'Suma finală după aplicarea factorului de actualizare'
    };
  }
  
  // Colectează perioada înlănțuită
  const yearsElement = document.getElementById('yearsResult');
  if (yearsElement && yearsElement.textContent && yearsElement.textContent !== '–') {
    results['Perioada înlănțuită'] = {
      label: 'Perioada înlănțuită',
      value: yearsElement.textContent,
      formula: 'Înlănțuirea indicilor IPC pentru anii selectați',
      details: 'Lista anilor cu indicii IPC corespunzători folosiți în calcul'
    };
  }
  
  return results;
}

// Funcție pentru a colecta datele din formular cu suport pentru radio buttons
function collectInflationFormData() {
  const formData = {};
  
  // Colectează suma
  const amountInput = document.getElementById('amount');
  if (amountInput && amountInput.value) {
    formData['amount'] = {
      label: 'Suma de actualizat',
      value: amountInput.value + ' Lei',
      unit: 'Lei'
    };
  }
  
  // Colectează anul de origine
  const originYearSelect = document.getElementById('originYear');
  if (originYearSelect && originYearSelect.value) {
    formData['originYear'] = {
      label: 'An de origine',
      value: originYearSelect.value,
      unit: ''
    };
  }
  
  // Colectează anul de actualizare
  const targetYearSelect = document.getElementById('targetYear');
  if (targetYearSelect && targetYearSelect.value) {
    formData['targetYear'] = {
      label: 'An de actualizare',
      value: targetYearSelect.value,
      unit: ''
    };
  }
  
  // Colectează metoda de înlănțuire
  const includeOriginRadio = document.getElementById('includeOrigin');
  if (includeOriginRadio) {
    formData['method'] = {
      label: 'Metodă de înlănțuire',
      value: includeOriginRadio.checked ? 'Include și anul de origine' : 'Standard (exclude anul de origine, include anul țintă)',
      unit: ''
    };
  }
  
  // Colectează rotunjirea
  const roundingSelect = document.getElementById('rounding');
  if (roundingSelect && roundingSelect.value) {
    const roundingText = roundingSelect.value === 'rounded' ? 'La 2 zecimale (monedă)' : 'Fără rotunjire';
    formData['rounding'] = {
      label: 'Rotunjire',
      value: roundingText,
      unit: ''
    };
  }
  
  return formData;
}

// Inițializează calculatorul când DOM-ul este gata
document.addEventListener('DOMContentLoaded', initCalculator);
