function calc() {
  let input = document.getElementById('val_p').value;
  input = input.replace(/[^0-9.,]/g, '').replace(',', '.');
  document.getElementById('val_p').value = input;

  calcul(parseFloat(input));
}

function calcul(val_p) {
  if (isNaN(val_p) || val_p < 0) {
    document.getElementById('valoare_f').innerText = '–';
    document.getElementById('valoare_a').innerText = '–';
    document.getElementById('valoare_r').innerText = '–';
    document.getElementById('formula_f').innerText = '';
    document.getElementById('formula_a').innerText = '';
    document.getElementById('formula_r').innerText = '';
    document.getElementById('desfasurare_f').innerText = '';
    document.getElementById('desfasurare_a').innerText = '';
    document.getElementById('desfasurare_r').innerText = '';
    
    // Ascunde butonul de export dacă nu sunt rezultate
    document.getElementById('exportBtn').style.display = 'none';
    return;
  }

  let val_f = 0, val_a = 0, val_r = 0;
  let formula_f = '';
  let desfasurare_f = '', desfasurare_a = '', desfasurare_r = '';
  let calcul_f = '', calcul_a = '', calcul_r = '';

  if (val_p <= 500) {
    val_f = val_p * 0.08;
    let val_f_initial = val_f;
    if (val_f < 20) val_f = 20;
    formula_f = `8% din ${val_p} Lei (minimum 20 Lei)`;
    desfasurare_f = `8% × ${val_p} Lei = ${(val_p * 0.08).toFixed(2)} Lei`;
    if (val_f_initial < 20) {
      desfasurare_f += ` → minimum 20 Lei se aplică`;
      calcul_f = `max(0.08 × ${val_p}, 20) = ${val_f} Lei`;
    } else {
      calcul_f = `0.08 × ${val_p} = ${(val_p * 0.08).toFixed(2)} Lei`;
    }
  } else if (val_p <= 5000) {
    val_f = 40 + (val_p - 500) * 0.07;
    formula_f = `40 Lei + 7% din ce depășește 500 Lei`;
    desfasurare_f = `40 Lei + 7% × (${val_p} - 500) Lei = 40 Lei + ${(val_p - 500).toFixed(2)} × 0.07 = ${(40 + (val_p - 500) * 0.07).toFixed(2)} Lei`;
    calcul_f = `40 Lei + 0.07 × (${val_p} - 500 Lei)`;
  } else if (val_p <= 25000) {
    val_f = 355 + (val_p - 5000) * 0.05;
    formula_f = `355 Lei + 5% din ce depășește 5.000 Lei`;
    desfasurare_f = `355 Lei + 5% × (${val_p} - 5.000) Lei = 355 Lei + ${(val_p - 5000).toFixed(2)} × 0.05 = ${(355 + (val_p - 5000) * 0.05).toFixed(2)} Lei`;
    calcul_f = `355 Lei + 0.05 × (${val_p} - 5.000 Lei)`;
  } else if (val_p <= 50000) {
    val_f = 1355 + (val_p - 25000) * 0.03;
    formula_f = `1.355 Lei + 3% din ce depășește 25.000 Lei`;
    desfasurare_f = `1.355 Lei + 3% × (${val_p} - 25.000) Lei = 1.355 Lei + ${(val_p - 25000).toFixed(2)} × 0.03 = ${(1355 + (val_p - 25000) * 0.03).toFixed(2)} Lei`;
    calcul_f = `1.355 Lei + 0.03 × (${val_p} - 25.000 Lei)`;
  } else if (val_p <= 250000) {
    val_f = 2105 + (val_p - 50000) * 0.02;
    formula_f = `2.105 Lei + 2% din ce depășește 50.000 Lei`;
    desfasurare_f = `2.105 Lei + 2% × (${val_p} - 50.000) Lei = 2.105 Lei + ${(val_p - 50000).toFixed(2)} × 0.02 = ${(2105 + (val_p - 50000) * 0.02).toFixed(2)} Lei`;
    calcul_f = `2.105 Lei + 0.02 × (${val_p} - 50.000 Lei)`;
  } else {
    val_f = 6105 + (val_p - 250000) * 0.01;
    formula_f = `6.105 Lei + 1% din ce depășește 250.000 Lei`;
    desfasurare_f = `6.105 Lei + 1% × (${val_p} - 250.000) Lei = 6.105 Lei + ${(val_p - 250000).toFixed(2)} × 0.01 = ${(6105 + (val_p - 250000) * 0.01).toFixed(2)} Lei`;
    calcul_f = `6.105 Lei + 0.01 × (${val_p} - 250.000 Lei)`;
  }

  let val_f_num = Math.max(val_f, 20);
  val_f = val_f_num.toFixed(2);
  let val_a_num = Math.max(val_f_num / 2, 20);
  val_a = val_a_num.toFixed(2);
  let val_r_num = Math.max(val_f_num / 2, 100);
  val_r = val_r_num.toFixed(2);

  document.getElementById('valoare_f').innerText = val_f + ' Lei';
  document.getElementById('valoare_a').innerText = val_a + ' Lei';
  document.getElementById('valoare_r').innerText = val_r + ' Lei';

  document.getElementById('formula_f').innerText = formula_f;
  document.getElementById('formula_a').innerText = `50% din taxa de fond (minimum 20 Lei)`;
  document.getElementById('formula_r').innerText = `50% din taxa de fond (minimum 100 Lei)`;

  // Desfasurare pentru Apel
  desfasurare_a = `50% × ${val_f} Lei = ${(val_f_num / 2).toFixed(2)} Lei`;
  calcul_a = `0.5 × ${val_f} Lei`;
  if (val_a_num === 20) {
    desfasurare_a += ` → minimum 20 Lei se aplică`;
    calcul_a = `max(0.5 × ${val_f}, 20) = ${val_a} Lei`;
  }
  // Desfasurare pentru Recurs
  desfasurare_r = `50% × ${val_f} Lei = ${(val_f_num / 2).toFixed(2)} Lei`;
  calcul_r = `0.5 × ${val_f} Lei`;
  if (val_r_num === 100) {
    desfasurare_r += ` → minimum 100 Lei se aplică`;
    calcul_r = `max(0.5 × ${val_f}, 100) = ${val_r} Lei`;
  }

  document.getElementById('desfasurare_f').innerHTML = desfasurare_f + '<br><span style="color:#555;font-size:0.95em;">' + calcul_f + '</span>';
  document.getElementById('desfasurare_a').innerHTML = desfasurare_a + '<br><span style="color:#555;font-size:0.95em;">' + calcul_a + '</span>';
  document.getElementById('desfasurare_r').innerHTML = desfasurare_r + '<br><span style="color:#555;font-size:0.95em;">' + calcul_r + '</span>';
  
  // Afișează butonul de export când sunt rezultate
  document.getElementById('exportBtn').style.display = 'inline-block';
}

function resetCalculator() {
  document.getElementById('val_p').value = '';
  document.getElementById('valoare_f').innerText = '–';
  document.getElementById('valoare_a').innerText = '–';
  document.getElementById('valoare_r').innerText = '–';
  document.getElementById('formula_f').innerText = '';
  document.getElementById('formula_a').innerText = '';
  document.getElementById('formula_r').innerText = '';
  document.getElementById('desfasurare_f').innerText = '';
  document.getElementById('desfasurare_a').innerText = '';
  document.getElementById('desfasurare_r').innerText = '';
} 

// Funcție pentru export PDF
function exportResultsToPDF() {
  const calculatorName = 'Calculator Taxe Judiciare de Timbru la Valoare';
  
  // Colectează datele din formular
  const inputData = collectFormData('.calculator-form');
  
  // Colectează rezultatele
  const results = collectResults();
  
  // Verifică dacă sunt rezultate
  if (Object.keys(results).length === 0) {
    alert('Nu există rezultate de exportat. Vă rugăm să faceți un calcul mai întâi.');
    return;
  }
  
  // Exportă PDF-ul
  exportToPDF(calculatorName, inputData, results);
} 