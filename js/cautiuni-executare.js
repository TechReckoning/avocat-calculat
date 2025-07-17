const form = document.getElementById('cautiuni-form');
const rezultate = document.getElementById('rezultate');
const valoareRezultat = document.getElementById('valoare_rezultat');
const formulaRezultat = document.getElementById('formula_rezultat');
const mesajRezultat = document.getElementById('mesaj_rezultat');

function round2(val) {
  return Math.round(val * 100) / 100;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const valoareCont = parseFloat(form.valoareCont.value);
  let valid = true;
  let cauțiune = 0, formula = '', mesaj = '';

  if (isNaN(valoareCont) || valoareCont < 0) valid = false;

  if (valid) {
    if (valoareCont <= 10000) {
      cauțiune = round2(0.10 * valoareCont);
      formula = `10% × ${valoareCont} = ${cauțiune}`;
      mesaj = `Pentru o valoare a contestației de ${valoareCont} lei, cauțiunea este 10% din sumă.`;
    } else if (valoareCont <= 100000) {
      cauțiune = round2(1000 + 0.05 * (valoareCont - 10000));
      formula = `1000 + 5% × (${valoareCont} − 10000) = ${cauțiune}`;
      mesaj = `Pentru o valoare a contestației de ${valoareCont} lei, cauțiunea este 1000 lei + 5% din ce depășește 10.000 lei.`;
    } else if (valoareCont <= 1000000) {
      cauțiune = round2(5500 + 0.01 * (valoareCont - 100000));
      formula = `5500 + 1% × (${valoareCont} − 100000) = ${cauțiune}`;
      mesaj = `Pentru o valoare a contestației de ${valoareCont} lei, cauțiunea este 5500 lei + 1% din ce depășește 100.000 lei.`;
    } else {
      cauțiune = round2(14500 + 0.001 * (valoareCont - 1000000));
      formula = `14500 + 0,1% × (${valoareCont} − 1000000) = ${cauțiune}`;
      mesaj = `Pentru o valoare a contestației de ${valoareCont} lei, cauțiunea este 14500 lei + 0,1% din ce depășește 1.000.000 lei.`;
    }
  }

  rezultate.style.display = 'block';
  if (!valid) {
    valoareRezultat.textContent = 'Date invalide!';
    formulaRezultat.textContent = '';
    mesajRezultat.textContent = 'Vă rugăm să introduceți o valoare numerică pozitivă.';
    return;
  }
  valoareRezultat.textContent = `${cauțiune} lei`;
  formulaRezultat.textContent = formula;
  mesajRezultat.textContent = mesaj;
}); 