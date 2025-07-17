document.addEventListener('DOMContentLoaded', function() {
  // Gestionare taburi
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const form = document.getElementById('procente-form');
  const rezultate = document.getElementById('rezultate');
  const valoareRezultat = document.getElementById('valoare_rezultat');
  const formulaRezultat = document.getElementById('formula_rezultat');
  const mesajRezultat = document.getElementById('mesaj_rezultat');

  function round2(val) {
    return Math.round(val * 100) / 100;
  }

  function calcProcente() {
    let mod = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    let rezultat = '', formula = '', mesaj = '';
    let valid = true;

    if (mod === 'valoare-procentuala') {
      const procent = parseFloat(form.procent.value);
      const suma_baza = parseFloat(form.suma_baza.value);
      if (isNaN(procent) || isNaN(suma_baza) || procent < 0 || suma_baza < 0) valid = false;
      if (valid) {
        const valoare = round2(procent * suma_baza / 100);
        rezultat = `${valoare} lei`;
        formula = `${procent}% × ${suma_baza} ÷ 100 = ${valoare}`;
        mesaj = `Valoarea care reprezintă ${procent}% din ${suma_baza} este ${valoare} lei.`;
      }
    } else if (mod === 'procent-calc') {
      const partiala = parseFloat(form.valoare_partiala.value);
      const totala = parseFloat(form.valoare_totala.value);
      if (isNaN(partiala) || isNaN(totala) || partiala < 0 || totala <= 0) valid = false;
      if (valid) {
        const procent = round2((partiala / totala) * 100);
        rezultat = `${procent}%`;
        formula = `(${partiala} ÷ ${totala}) × 100 = ${procent}%`;
        mesaj = `${partiala} reprezintă ${procent}% din ${totala}.`;
      }
    } else if (mod === 'suma-initiala') {
      const valoare_procentuala = parseFloat(form.valoare_procentuala.value);
      const procent_aplicat = parseFloat(form.procent_aplicat.value);
      if (isNaN(valoare_procentuala) || isNaN(procent_aplicat) || valoare_procentuala < 0 || procent_aplicat <= 0) valid = false;
      if (valid) {
        const suma_initiala = round2((valoare_procentuala * 100) / procent_aplicat);
        rezultat = `${suma_initiala} lei`;
        formula = `(${valoare_procentuala} × 100) ÷ ${procent_aplicat} = ${suma_initiala}`;
        mesaj = `${valoare_procentuala} este ${procent_aplicat}% din ${suma_initiala} lei.`;
      }
    }

    if (!valid) {
      rezultate.style.display = 'block';
      valoareRezultat.textContent = 'Date invalide!';
      formulaRezultat.textContent = '';
      mesajRezultat.textContent = 'Vă rugăm să introduceți doar valori numerice pozitive.';
      return;
    }

    rezultate.style.display = 'block';
    valoareRezultat.textContent = rezultat;
    formulaRezultat.textContent = formula;
    mesajRezultat.textContent = mesaj;
  }

  // Atașează event listener pe toate inputurile vizibile din tabul activ
  function attachLiveListeners() {
    // Elimină orice event listener anterior (prin recreare)
    const allInputs = form.querySelectorAll('input');
    allInputs.forEach(inp => {
      inp.removeEventListener('input', calcProcente);
    });
    // Atașează doar pe inputurile vizibile (din tabul activ)
    const activeTab = document.querySelector('.tab-content:not([style*="display: none"])');
    if (activeTab) {
      const inputs = activeTab.querySelectorAll('input');
      inputs.forEach(inp => {
        inp.addEventListener('input', calcProcente);
      });
    }
  }

  // Inițializare taburi și event listeners
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabContents.forEach(tc => tc.style.display = 'none');
        const tab = btn.getAttribute('data-tab');
        document.getElementById(tab).style.display = '';
        rezultate.style.display = 'none';
        form.reset();
        attachLiveListeners();
      });
    });
  }

  // Atașează la încărcare
  attachLiveListeners();
}); 