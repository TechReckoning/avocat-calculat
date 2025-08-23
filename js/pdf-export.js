// Funcție comună pentru export PDF folosind print
function exportToPDF(calculatorName, inputData, results) {
    try {
        // Creează un export tabelar simplu și clar
        const pdfContent = createSimpleTableExport(calculatorName, inputData, results);

        // Creează un element temporar cu conținutul
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = pdfContent;
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = '100%';
        tempDiv.style.minHeight = '100vh';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.zIndex = '9999';
        tempDiv.style.overflow = 'auto';
        tempDiv.style.padding = '20px';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '14px';
        tempDiv.style.lineHeight = '1.6';

        // Ascunde conținutul original al paginii
        const originalContent = document.querySelector('main') || document.querySelector('body > *:not(header):not(footer)');
        if (originalContent) {
            originalContent.style.display = 'none';
        }

        // Adaugă un buton de print și unul de închidere
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '10000';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const printBtn = document.createElement('button');
        printBtn.innerHTML = '🖨️ Print PDF';
        printBtn.style.padding = '10px 15px';
        printBtn.style.backgroundColor = '#007bff';
        printBtn.style.color = 'white';
        printBtn.style.border = 'none';
        printBtn.style.borderRadius = '5px';
        printBtn.style.cursor = 'pointer';
        printBtn.style.fontSize = '14px';
        printBtn.style.fontWeight = 'bold';
        printBtn.onclick = () => {
            // Ascunde butoanele înainte de print
            buttonContainer.style.display = 'none';
            // Așteaptă puțin și apoi printează
            setTimeout(() => {
                window.print();
                // Arată din nou butoanele după print
                setTimeout(() => {
                    buttonContainer.style.display = 'flex';
                }, 1000);
            }, 100);
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '× Închide';
        closeBtn.style.padding = '10px 15px';
        closeBtn.style.backgroundColor = '#dc3545';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '14px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.onclick = () => {
            // Șterge exportul
            document.body.removeChild(tempDiv);
            document.body.removeChild(buttonContainer);
            // Arată din nou conținutul original
            if (originalContent) {
                originalContent.style.display = '';
            }
        };

        buttonContainer.appendChild(printBtn);
        buttonContainer.appendChild(closeBtn);

        document.body.appendChild(tempDiv);
        document.body.appendChild(buttonContainer);

    } catch (error) {
        console.error('Eroare la generarea PDF:', error);
        alert('A apărut o eroare la generarea PDF-ului. Vă rugăm să încercați din nou.');
    }
}

// Funcție pentru a crea un export tabelar simplu și clar
function createSimpleTableExport(calculatorName, inputData, results) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ro-RO');
  const timeStr = now.toLocaleTimeString('ro-RO');
  
  // Stiluri simple și clare pentru export
  const simpleStyles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background: white;
        color: black;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 3px solid #333;
        padding-bottom: 20px;
      }
      
      .header h1 {
        margin: 0;
        font-size: 28px;
        color: #333;
      }
      
      .header h2 {
        margin: 10px 0 5px 0;
        font-size: 20px;
        color: #666;
      }
      
      .header p {
        margin: 5px 0;
        font-size: 14px;
        color: #888;
      }
      
      .section {
        margin-bottom: 30px;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f5f5f5;
        border-left: 4px solid #007bff;
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .data-table th {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 12px;
        text-align: left;
        font-weight: bold;
        color: #495057;
      }
      
      .data-table td {
        border: 1px solid #dee2e6;
        padding: 12px;
        text-align: left;
        vertical-align: top;
      }
      
      .data-table tr:nth-child(even) {
        background-color: #f8f9fa;
      }
      
      .data-table tr:hover {
        background-color: #e9ecef;
      }
      
      .formula-cell {
        font-style: italic;
        color: #6c757d;
        font-size: 14px;
      }
      
      .details-cell {
        color: #6c757d;
        font-size: 13px;
        line-height: 1.4;
      }
      
      .disclaimer {
        margin-top: 40px;
        padding: 20px;
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 5px;
        font-size: 14px;
        color: #856404;
      }
      
      @media print {
        body { margin: 0; padding: 15px; }
        button { display: none !important; }
        .no-print { display: none !important; }
        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
      }
    </style>
  `;
  
  let content = `
    <div>
      ${simpleStyles}
      
      <div class="header">
        <h1>Avocat Calculat</h1>
        <h2>${calculatorName}</h2>
        <p><strong>Generat la:</strong> ${dateStr} ${timeStr}</p>
      </div>
      
      <div class="section">
        <div class="section-title">📊 Datele introduse</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40%;">Categorie</th>
              <th style="width: 60%;">Valoare</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Adaugă datele introduse
  Object.keys(inputData).forEach(key => {
    const label = inputData[key].label;
    const value = inputData[key].value;
    const unit = inputData[key].unit || '';
    
    if (value !== undefined && value !== '') {
      content += `
        <tr>
          <td><strong>${label}</strong></td>
          <td>${value}${unit}</td>
        </tr>
      `;
    }
  });
  
  content += `
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">📈 Rezultatele calculate</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 25%;">Categorie</th>
              <th style="width: 25%;">Valoare</th>
              <th style="width: 25%;">Formula</th>
              <th style="width: 25%;">Detalii</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // Adaugă rezultatele cu formatare clară
  Object.keys(results).forEach(key => {
    const result = results[key];
    if (result && result.value !== undefined && result.value !== '') {
      content += `
        <tr>
          <td><strong>${result.label}</strong></td>
          <td><strong style="color: #007bff; font-size: 16px;">${result.value}</strong></td>
          <td class="formula-cell">${result.formula || '-'}</td>
          <td class="details-cell">${result.details || '-'}</td>
        </tr>
      `;
    }
  });
  
  content += `
          </tbody>
        </table>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Disclaimer:</strong> Acest calculator are scop exclusiv informativ și nu reprezintă consultanță juridică. 
        Pentru soluții personalizate, consultați un avocat sau specialist autorizat.
      </div>
    </div>
  `;
  
  return content;
}

// Funcție pentru a colecta datele din formular
function collectFormData(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return {};
  
  const formData = {};
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    if (input.name || input.id) {
      const name = input.name || input.id;
      const label = input.previousElementSibling?.textContent || name;
      const value = input.value;
      const unit = input.placeholder?.match(/Lei|%|zile|ani/i)?.[0] || '';
      
      if (value && value.trim() !== '') {
        formData[name] = {
          label: label.replace(':', '').trim(),
          value: value,
          unit: unit
        };
      }
    }
  });
  
  return formData;
}

// Funcție pentru a colecta rezultatele
function collectResults() {
  const results = {};
  
  // Pentru taxe judiciare, colectează doar valorile finale
  const valoareElements = document.querySelectorAll('#valoare_f, #valoare_a, #valoare_r');
  
  valoareElements.forEach(element => {
    const value = element.textContent.trim();
    if (value && value !== '–') {
      let label = '';
      let formula = '';
      let details = '';
      
      // Determină label-ul și colectează formula și detaliile corespunzătoare
      if (element.id === 'valoare_f') {
        label = 'Taxa de fond';
        const formulaElement = document.getElementById('formula_f');
        const detailsElement = document.getElementById('desfasurare_f');
        if (formulaElement) formula = formulaElement.textContent.trim();
        if (detailsElement) details = detailsElement.textContent.trim();
      } else if (element.id === 'valoare_a') {
        label = 'Taxa de apel';
        const formulaElement = document.getElementById('formula_a');
        const detailsElement = document.getElementById('desfasurare_a');
        if (formulaElement) formula = formulaElement.textContent.trim();
        if (detailsElement) details = detailsElement.textContent.trim();
      } else if (element.id === 'valoare_r') {
        label = 'Taxa de recurs';
        const formulaElement = document.getElementById('formula_r');
        const detailsElement = document.getElementById('desfasurare_r');
        if (formulaElement) formula = formulaElement.textContent.trim();
        if (detailsElement) details = detailsElement.textContent.trim();
      }
      
      results[label] = {
        label: label,
        value: value,
        formula: formula,
        details: details
      };
    }
  });
  
  // Dacă nu sunt taxe judiciare, folosește metoda generală
  if (Object.keys(results).length === 0) {
    const resultElements = document.querySelectorAll('.result, .formula, .desfasurare');
    
    resultElements.forEach(element => {
      const parent = element.closest('tr');
      if (parent) {
        const labelElement = parent.querySelector('label');
        if (labelElement) {
          const label = labelElement.textContent.replace(':', '').trim();
          const value = element.textContent.trim();
          
          if (value && value !== '–') {
            results[label] = {
              label: label,
              value: value,
              formula: '',
              details: ''
            };
            
            // Caută formula și detaliile
            const formulaElement = parent.querySelector('.formula');
            const detailsElement = parent.querySelector('.desfasurare');
            
            if (formulaElement) {
              results[label].formula = formulaElement.textContent.trim();
            }
            
            if (detailsElement) {
              results[label].details = detailsElement.textContent.trim();
            }
          }
        }
      }
    });
  }
  
  return results;
}

// Funcție specială pentru export PDF cu tranșe (dobanzi legale)
function exportToPDFWithTranse(calculatorName, inputData, results, transeDetails) {
    try {
        // Creează un export tabelar simplu și clar cu tranșe
        const pdfContent = createTranseTableExport(calculatorName, inputData, results, transeDetails);

        // Creează un element temporar cu conținutul
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = pdfContent;
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = '100%';
        tempDiv.style.minHeight = '100vh';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.zIndex = '9999';
        tempDiv.style.overflow = 'auto';
        tempDiv.style.padding = '20px';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '14px';
        tempDiv.style.lineHeight = '1.6';

        // Ascunde conținutul original al paginii
        const originalContent = document.querySelector('main') || document.querySelector('body > *:not(header):not(footer)');
        if (originalContent) {
            originalContent.style.display = 'none';
        }

        // Adaugă un buton de print și unul de închidere
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '10000';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const printBtn = document.createElement('button');
        printBtn.innerHTML = '🖨️ Print PDF';
        printBtn.style.padding = '10px 15px';
        printBtn.style.backgroundColor = '#007bff';
        printBtn.style.color = 'white';
        printBtn.style.border = 'none';
        printBtn.style.borderRadius = '5px';
        printBtn.style.cursor = 'pointer';
        printBtn.style.fontSize = '14px';
        printBtn.style.fontWeight = 'bold';
        printBtn.onclick = () => {
            // Ascunde butoanele înainte de print
            buttonContainer.style.display = 'none';
            // Așteaptă puțin și apoi printează
            setTimeout(() => {
                window.print();
                // Arată din nou butoanele după print
                setTimeout(() => {
                    buttonContainer.style.display = 'flex';
                }, 1000);
            }, 100);
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '× Închide';
        closeBtn.style.padding = '10px 15px';
        closeBtn.style.backgroundColor = '#dc3545';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '14px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.onclick = () => {
            // Șterge exportul
            document.body.removeChild(tempDiv);
            document.body.removeChild(buttonContainer);
            // Arată din nou conținutul original
            if (originalContent) {
                originalContent.style.display = '';
            }
        };

        buttonContainer.appendChild(printBtn);
        buttonContainer.appendChild(closeBtn);

        document.body.appendChild(tempDiv);
        document.body.appendChild(buttonContainer);

    } catch (error) {
        console.error('Eroare la generarea PDF:', error);
        alert('A apărut o eroare la generarea PDF-ului. Vă rugăm să încercați din nou.');
    }
}

// Funcție pentru a crea un export tabelar cu tranșe
function createTranseTableExport(calculatorName, inputData, results, transeDetails) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ro-RO');
    const timeStr = now.toLocaleTimeString('ro-RO');

    // Stiluri simple și clare pentru export
    const simpleStyles = `
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                color: black;
            }

            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #333;
                padding-bottom: 20px;
            }

            .header h1 {
                margin: 0;
                font-size: 28px;
                color: #333;
            }

            .header h2 {
                margin: 10px 0 5px 0;
                font-size: 20px;
                color: #666;
            }

            .header p {
                margin: 5px 0;
                font-size: 14px;
                color: #888;
            }

            .section {
                margin-bottom: 30px;
            }

            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 15px;
                padding: 10px;
                background-color: #f5f5f5;
                border-left: 4px solid #007bff;
            }

            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }

            .data-table th {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 12px;
                text-align: left;
                font-weight: bold;
                color: #495057;
            }

            .data-table td {
                border: 1px solid #dee2e6;
                padding: 12px;
                text-align: left;
                vertical-align: top;
            }

            .data-table tr:nth-child(even) {
                background-color: #f8f9fa;
            }

            .data-table tr:hover {
                background-color: #e9ecef;
            }

            .transe-table th {
                background-color: #e3f2fd;
                border: 1px solid #2196f3;
                color: #1976d2;
            }

            .transe-table td {
                font-size: 13px;
            }

            .formula-cell {
                font-style: italic;
                color: #6c757d;
                font-size: 14px;
            }

            .details-cell {
                color: #6c757d;
                font-size: 13px;
                line-height: 1.4;
            }

            .disclaimer {
                margin-top: 40px;
                padding: 20px;
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                font-size: 14px;
                color: #856404;
            }

            @media print {
                body { margin: 0; padding: 15px; }
                button { display: none !important; }
                .no-print { display: none !important; }
                * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            }
        </style>
    `;

    let content = `
        <div>
            ${simpleStyles}

            <div class="header">
                <h1>Avocat Calculat</h1>
                <h2>${calculatorName}</h2>
                <p><strong>Generat la:</strong> ${dateStr} ${timeStr}</p>
            </div>

            <div class="section">
                <div class="section-title">📊 Datele introduse</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 40%;">Categorie</th>
                            <th style="width: 60%;">Valoare</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    // Adaugă datele introduse
    Object.keys(inputData).forEach(key => {
        const label = inputData[key].label;
        const value = inputData[key].value;
        const unit = inputData[key].unit || '';

        if (value !== undefined && value !== '') {
            content += `
                <tr>
                    <td><strong>${label}</strong></td>
                    <td>${value}${unit}</td>
                </tr>
            `;
        }
    });

    content += `
                    </tbody>
                </table>
            </div>

            <div class="section">
                <div class="section-title">📈 Rezultatele calculate</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 25%;">Categorie</th>
                            <th style="width: 25%;">Valoare</th>
                            <th style="width: 25%;">Formula</th>
                            <th style="width: 25%;">Detalii</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    // Adaugă rezultatele cu formatare clară
    Object.keys(results).forEach(key => {
        const result = results[key];
        if (result && result.value !== undefined && result.value !== '') {
            content += `
                <tr>
                    <td><strong>${result.label}</strong></td>
                    <td><strong style="color: #007bff; font-size: 16px;">${result.value}</strong></td>
                    <td class="formula-cell">${result.formula || '-'}</td>
                    <td class="details-cell">${result.details || '-'}</td>
                </tr>
            `;
        }
    });

    content += `
                    </tbody>
                </table>
            </div>
    `;

    // Adaugă secțiunea cu tranșe dacă există
    if (transeDetails && transeDetails.length > 0) {
        content += `
            <div class="section">
                <div class="section-title">📋 Detalii calcul pe tranșe</div>
                <table class="data-table transe-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Perioada</th>
                            <th style="width: 10%;">Zile</th>
                            <th style="width: 15%;">Zile/An</th>
                            <th style="width: 15%;">Rata BNR</th>
                            <th style="width: 20%;">Dobânda Aplicată</th>
                            <th style="width: 25%;">Dobânda (RON)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Adaugă fiecare tranșă
        transeDetails.forEach(transe => {
            content += `
                <tr>
                    <td><strong>${transe.perioada}</strong></td>
                    <td>${transe.zile}</td>
                    <td>${transe.zileAn}</td>
                    <td>${transe.rataBNR}</td>
                    <td>${transe.dobAplicata}</td>
                    <td><strong style="color: #28a745;">${transe.dobandaRON}</strong></td>
                </tr>
            `;
        });

        content += `
                    </tbody>
                </table>
            </div>
        `;
    }

    content += `
            <div class="disclaimer">
                <strong>⚠️ Disclaimer:</strong> Acest calculator are scop exclusiv informativ și nu reprezintă consultanță juridică.
                Pentru soluții personalizate, consultați un avocat sau specialist autorizat.
            </div>
        </div>
    `;
    return content;
}