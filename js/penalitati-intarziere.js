document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('penalitati-form');
  const rezultate = document.getElementById('rezultate');
  const zileIntarziere = document.getElementById('zile_intarziere');
  const penalitatiTotal = document.getElementById('penalitati_total');
  const calculDesfasurat = document.getElementById('calcul_desfasurat');

  // Funcție pentru formatarea numerelor în format românesc
  function formatRomanianNumber(num) {
    return num.toFixed(2).replace('.', ',');
  }

  // Funcție pentru calculul zilelor între două date (inclusiv)
  function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  // Funcție pentru conversia string la număr (acceptă atât . cât și ,)
  function parseNumber(value) {
    if (!value) return NaN;
    // Înlocuiește virgula cu punct pentru parsing
    const normalizedValue = value.replace(',', '.');
    return parseFloat(normalizedValue);
  }

  // Funcție principală de calcul
  function calcPenalitati() {
    const sumaScadenta = parseNumber(document.getElementById('suma_scadenta').value);
    const dataScadenta = document.getElementById('data_scadenta').value;
    const dataCalcul = document.getElementById('data_calcul').value;
    const procentPenalitati = parseNumber(document.getElementById('procent_penalitati').value);

    // Validare
    if (isNaN(sumaScadenta) || isNaN(procentPenalitati) || !dataScadenta || !dataCalcul) {
      rezultate.style.display = 'none';
      return;
    }

    if (sumaScadenta <= 0 || procentPenalitati <= 0) {
      rezultate.style.display = 'none';
      return;
    }

    // Calculul zilelor de întârziere
    const zileIntarziereNum = calculateDaysBetween(dataScadenta, dataCalcul);
    
    if (zileIntarziereNum <= 0) {
      rezultate.style.display = 'none';
      return;
    }

    // Calculul penalităților
    const penalitati = sumaScadenta * (procentPenalitati / 100) * zileIntarziereNum;

    // Afișarea rezultatelor
    rezultate.style.display = 'block';
    
    zileIntarziere.textContent = `${zileIntarziereNum} zile`;
    penalitatiTotal.textContent = `${formatRomanianNumber(penalitati)} lei`;
    
    // Calcul desfășurat
    const calculText = `Penalități = Suma × (Procent/100) × Nr. zile întârziere
                       = ${formatRomanianNumber(sumaScadenta)} × ${procentPenalitati}% × ${zileIntarziereNum} zile
                       = ${formatRomanianNumber(penalitati)} lei`;
    
    calculDesfasurat.textContent = calculText;
    
    // Afișează butonul de export când sunt rezultate
    document.getElementById('exportBtn').style.display = 'inline-block';
  }

  // Funcție de resetare
  window.resetCalculator = function() {
    form.reset();
    rezultate.style.display = 'none';
    // Ascunde butonul de export când se resetează calculatorul
    document.getElementById('exportBtn').style.display = 'none';
  };

  // Event listeners pentru calcul live
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', calcPenalitati);
  });

  // Setează data calculului la data de azi ca default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('data_calcul').value = today;
});

// Funcție pentru export PDF
function exportResultsToPDF() {
  const calculatorName = 'Calculator Orientativ de Penalități de Întârziere';
  
  // Colectează datele din formular
  const inputData = {};
  const sumaScadenta = document.getElementById('suma_scadenta').value;
  const dataScadenta = document.getElementById('data_scadenta').value;
  const dataCalcul = document.getElementById('data_calcul').value;
  const procentPenalitati = document.getElementById('procent_penalitati').value;
  
  if (sumaScadenta) {
    inputData.sumaScadenta = { label: 'Suma scadentă', value: sumaScadenta + ' lei', unit: '' };
  }
  if (dataScadenta) {
    inputData.dataScadenta = { label: 'Data scadenței', value: dataScadenta, unit: '' };
  }
  if (dataCalcul) {
    inputData.dataCalcul = { label: 'Data calculului', value: dataCalcul, unit: '' };
  }
  if (procentPenalitati) {
    inputData.procentPenalitati = { label: 'Procentul penalităților', value: procentPenalitati + '%/zi', unit: '' };
  }
  
  // Colectează rezultatele
  const results = {};
  const zileIntarziere = document.getElementById('zile_intarziere').textContent;
  const penalitatiTotal = document.getElementById('penalitati_total').textContent;
  const calculDesfasurat = document.getElementById('calcul_desfasurat').textContent;
  
  if (zileIntarziere && zileIntarziere !== '–') {
    results.zileIntarziere = { label: 'Numărul de zile de întârziere', value: zileIntarziere, formula: '', details: '' };
  }
  if (penalitatiTotal && penalitatiTotal !== '–') {
    // Extrage numărul de zile și procentul pentru formula
    const zileMatch = zileIntarziere.match(/(\d+)/);
    const procentMatch = document.getElementById('procent_penalitati').value;
    const sumaMatch = document.getElementById('suma_scadenta').value;
    let formula = '';
    if (zileMatch && procentMatch && sumaMatch) {
      formula = `${zileMatch[1]} zile × ${procentMatch}% × ${sumaMatch} lei`;
    }
    results.penalitatiTotal = { label: 'Valoarea totală a penalităților', value: penalitatiTotal, formula: formula, details: '' };
  }
  if (calculDesfasurat && calculDesfasurat !== '–') {
    results.calculDesfasurat = { label: 'Calcul desfășurat', value: '', formula: '', details: calculDesfasurat };
  }
  
  // Verifică dacă sunt rezultate
  if (Object.keys(results).length === 0) {
    alert('Nu există rezultate de exportat. Vă rugăm să faceți un calcul mai întâi.');
    return;
  }
  
  // Exportă PDF-ul
  exportToPDF(calculatorName, inputData, results);
} 