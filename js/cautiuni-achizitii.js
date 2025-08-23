// Avocat Calculat - Cautiuni Achizitii - flux robust si intuitiv

document.addEventListener('DOMContentLoaded', function() {
  // Helper pentru recalculare live
  function liveCautiune() {
    const valoare = parseFloat(document.getElementById('valoare').value.replace(/,/g, '.'));
    const tipContestatie = document.querySelector('input[name="tipContestatie"]:checked')?.value;
    const lege = document.querySelector('input[name="lege"]:checked')?.value;
    const prag = Number(document.querySelector('input[name="prag"]:checked')?.value);
    
    if (!valoare || !tipContestatie || !lege || !prag) {
      document.getElementById('rezultate').style.display = 'none';
      // Ascunde butonul de export când nu sunt rezultate
      document.getElementById('exportBtn').style.display = 'none';
      return;
    }
    
    function calcPlafon(valoare, prag, tipContestatie) {
      if (valoare < prag) {
        return tipContestatie === "documentatie" ? 35000 : 88000;
      } else {
        return tipContestatie === "documentatie" ? 220000 : 2000000;
      }
    }
    
    const provizorie = +(valoare * 0.02).toFixed(2);
    const plafon = calcPlafon(valoare, prag, tipContestatie);
    const finala = Math.min(provizorie, plafon);
    let explanation = "";
    
    if (provizorie > plafon) {
      explanation = `Cauțiunea provizorie (${provizorie.toLocaleString('ro-RO', {minimumFractionDigits: 2, maximumFractionDigits: 2})} lei) depășește plafonul maxim aplicabil (${plafon.toLocaleString('ro-RO')} lei), deci cauțiunea finală este plafonată.`;
    } else {
      explanation = `Cauțiunea provizorie (${provizorie.toLocaleString('ro-RO', {minimumFractionDigits: 2, maximumFractionDigits: 2})} lei) este sub plafonul maxim aplicabil (${plafon.toLocaleString('ro-RO')} lei), deci cauțiunea finală este egală cu cea provizorie.`;
    }
    
    document.getElementById('cautiune-finala').textContent = finala.toLocaleString('ro-RO', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' lei';
    document.getElementById('cautiune-provizorie').textContent = provizorie.toLocaleString('ro-RO', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' lei';
    document.getElementById('plafon-maxim').textContent = plafon.toLocaleString('ro-RO') + ' lei';
    document.getElementById('explicatie').textContent = explanation;
    document.getElementById('rezultate').style.display = 'block';
    
    // Afișează butonul de export când sunt rezultate
    document.getElementById('exportBtn').style.display = 'inline-block';
  }

  // Toate inputurile relevante declanșează recalcularea
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', liveCautiune);
    el.addEventListener('change', liveCautiune);
  });

  // Functie pentru mesajul explicativ la valoare contract
  function updateInfoValoare() {
    const tipProcedura = document.querySelector('input[name="tipProcedura"]:checked')?.value;
    const peLoturi = document.querySelector('input[name="peLoturi"]:checked')?.value;
    const infoDiv = document.getElementById('info-valoare');
    let msg = '';
    if (tipProcedura === 'contract' && peLoturi === 'nu') {
      msg = 'Introduceți Valoarea Estimată a Contractului indicată în Fișa de Date;';
    } else if (tipProcedura === 'contract' && peLoturi === 'da') {
      msg = 'Introduceți Valoarea Estimată a Contractului pentru Lotul Contestat;';
    } else if (tipProcedura === 'acord-cadru' && peLoturi === 'nu') {
      msg = 'Introduceți Valoarea Estimată a Contractului reprezentând Dublul Valorii Estimate a Celui Mai Mare Contract Subsecvent;';
    } else if (tipProcedura === 'acord-cadru' && peLoturi === 'da') {
      msg = 'Introduceți Valoarea Estimată a Contractului reprezentând Dublul Valorii Estimate a Celui Mai Mare Contract Subsecvent pentru Lotul Contestat.';
    } else {
      msg = '';
    }
    infoDiv.textContent = msg;
  }

  // Evenimente pentru radio-uri relevante
  document.querySelectorAll('input[name="tipProcedura"], input[name="peLoturi"]').forEach(el => {
    el.addEventListener('change', updateInfoValoare);
  });
  // Inițializare la încărcare
  updateInfoValoare();

  // Praguri și info praguri (păstrăm logica de generare din vechiul cod)
  const praguri98 = [
    { value: "27334460", label: "27.334.460 lei, pentru contractele de achiziţie publică/acordurile-cadru de lucrări" },
    { value: "705819", label: "705.819 lei, pentru contractele de achiziţie publică/acordurile-cadru de produse şi de servicii" },
    { value: "1090812", label: "1.090.812 lei, pentru contractele de achiziţii publice/acordurile-cadru de produse şi de servicii atribuite de consiliul judeţean, consiliul local, Consiliul General al Municipiului Bucureşti, precum şi de instituţiile publice aflate în subordinea acestora" },
    { value: "3701850", label: "3.701.850 lei, pentru contractele de achiziţie publică/acordurile-cadru de servicii care au ca obiect servicii sociale şi alte servicii specifice, prevăzute în anexa nr. 2." }
  ];
  const praguri99 = [
    { value: "2186559", label: "2.186.559 lei, pentru contractele sectoriale de produse şi de servicii, precum şi pentru concursurile de soluţii" },
    { value: "27334460", label: "27.334.460 lei, pentru contractele sectoriale de lucrări" },
    { value: "4935800", label: "4.935.800 lei, pentru contractele sectoriale de servicii care au ca obiect servicii sociale şi alte servicii specifice, prevăzute în anexa nr. 2." }
  ];

  document.querySelectorAll('input[name="lege"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const lege = this.value;
      const container = document.getElementById('praguri-container');
      container.innerHTML = '';
      if (lege === '98') {
        praguri98.forEach(prag => {
          const label = document.createElement('label');
          label.className = 'radio-label';
          label.innerHTML = `<input type="radio" name="prag" value="${prag.value}"> ${prag.label}`;
          container.appendChild(label);
        });
        container.innerHTML += '<div class="form-info">Pragurile valorice prevăzute la art. 7 alin. (1) din Legea nr. 98/2016.</div>';
      } else if (lege === '99') {
        praguri99.forEach(prag => {
          const label = document.createElement('label');
          label.className = 'radio-label';
          label.innerHTML = `<input type="radio" name="prag" value="${prag.value}"> ${prag.label}`;
          container.appendChild(label);
        });
        container.innerHTML += '<div class="form-info">Pragurile valorice prevăzute la art. 12 alin. (1) din Legea nr. 99/2016.</div>';
      } else if (lege === '100') {
        const label = document.createElement('label');
        label.className = 'radio-label';
        label.innerHTML = `<input type="radio" name="prag" value="27334460" checked readonly> 27.334.460 lei pentru concesiuni de lucrări sau servicii`;
        container.appendChild(label);
        container.innerHTML += '<div class="form-info">Pragul valoric prevăzut la art. 11 alin. (1) din Legea nr. 100/2016.</div>';
      }
      liveCautiune();
    });
  });

  // Inițializare: calculează dacă totul e completat la încărcare
  liveCautiune();
  
  // Expun funcția pentru butonul din HTML
  window.calculeazaCautiune = liveCautiune;
});

// Funcție pentru export PDF
function exportResultsToPDF() {
  const calculatorName = 'Calculator Orientativ de Cauțiuni în Domeniul Achizițiilor Publice, Sectoriale și Concesiunilor';
  
  // Colectează datele din formular
  const inputData = {};
  
  // Tip procedura
  const tipProcedura = document.querySelector('input[name="tipProcedura"]:checked')?.value;
  if (tipProcedura) {
    const label = tipProcedura === 'contract' ? 'Contract' : 'Acord-cadru';
    inputData.tipProcedura = { label: 'Tip procedură', value: label, unit: '' };
  }
  
  // Pe loturi
  const peLoturi = document.querySelector('input[name="peLoturi"]:checked')?.value;
  if (peLoturi) {
    const label = peLoturi === 'da' ? 'Da' : 'Nu';
    inputData.peLoturi = { label: 'Procedură pe loturi', value: label, unit: '' };
  }
  
  // Valoarea
  const valoare = document.getElementById('valoare').value;
  if (valoare) {
    inputData.valoare = { label: 'Valoarea relevantă pentru calcul cauțiune', value: valoare + ' lei', unit: '' };
  }
  
  // Tip contestație
  const tipContestatie = document.querySelector('input[name="tipContestatie"]:checked')?.value;
  if (tipContestatie) {
    const label = tipContestatie === 'documentatie' ? 'Contestație privind documentația de atribuire' : 'Contestație privind rezultatul procedurii de atribuire';
    inputData.tipContestatie = { label: 'Tip contestație', value: label, unit: '' };
  }
  
  // Legea
  const lege = document.querySelector('input[name="lege"]:checked')?.value;
  if (lege) {
    let label = '';
    switch(lege) {
      case '98': label = 'Legea nr. 98/2016'; break;
      case '99': label = 'Legea nr. 99/2016'; break;
      case '100': label = 'Legea nr. 100/2016'; break;
    }
    inputData.lege = { label: 'Legea aplicabilă', value: label, unit: '' };
  }
  
  // Pragul valoric
  const prag = document.querySelector('input[name="prag"]:checked')?.value;
  if (prag) {
    const pragLabel = document.querySelector('input[name="prag"]:checked').parentElement.textContent.trim();
    inputData.prag = { label: 'Prag valoric aplicabil', value: pragLabel, unit: '' };
  }
  
  // Colectează rezultatele
  const results = {};
  const cautiuneFinala = document.getElementById('cautiune-finala').textContent;
  const cautiuneProvizorie = document.getElementById('cautiune-provizorie').textContent;
  const plafonMaxim = document.getElementById('plafon-maxim').textContent;
  const explicatie = document.getElementById('explicatie').textContent;
  
  if (cautiuneFinala !== '-') results.cautiuneFinala = { label: 'Cauțiunea finală', value: cautiuneFinala, formula: '2% plafonat', details: '' };
  if (cautiuneProvizorie !== '-') results.cautiuneProvizorie = { label: 'Cauțiunea provizorie', value: cautiuneProvizorie, formula: '2%', details: '' };
  if (plafonMaxim !== '-') results.plafonMaxim = { label: 'Plafon maxim aplicabil', value: plafonMaxim, formula: 'Plafon legal în funcție de tipul contestației', details: '' };
  if (explicatie !== '-') results.explicatie = { label: 'Explicație', value: explicatie, formula: '', details: '' };
  
  // Verifică dacă sunt rezultate
  if (Object.keys(results).length === 0) {
    alert('Nu există rezultate de exportat. Vă rugăm să faceți un calcul mai întâi.');
    return;
  }
  
  // Exportă PDF-ul
  exportToPDF(calculatorName, inputData, results);
} 