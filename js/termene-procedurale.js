// Variabile pentru starea calculatorului
let startDate = null;
let duration = '';
let unit = 'zile';
let system = 'zile_libere';
let result = null;
let explanation = '';
let calculated = false;

// Funcție pentru verificarea validității formularului
function isFormValid() {
    return startDate && duration && Number(duration) > 0 && unit && (unit !== 'zile' || system);
}

// Funcție pentru actualizarea interfeței
function updateUI() {
    const calcBtn = document.getElementById('calcBtn');
    const systemGroup = document.getElementById('systemGroup');
    const selectedYearSelect = document.getElementById('selectedYear');
    
    // Actualizează butonul de calcul
    calcBtn.disabled = !isFormValid();
    
    // Afișează/ascunde sistemul de calcul pentru zile
    systemGroup.style.display = unit === 'zile' ? 'block' : 'none';
    
    // Actualizează anul selectat
    if (startDate) {
        const year = startDate.getFullYear();
        selectedYearSelect.innerHTML = `<option value="${year}">${year}</option>`;
    } else {
        selectedYearSelect.innerHTML = '<option value="">Alege data de început</option>';
    }
    
    // Resetare rezultat la modificarea inputurilor
    if (calculated) {
        setResult(null);
        setExplanation('');
        calculated = false;
    }
}

// Funcție pentru setarea rezultatului
function setResult(value) {
    result = value;
    document.getElementById('resultDate').textContent = value || '-';
}

// Funcție pentru setarea explicației
function setExplanation(value) {
    explanation = value;
    document.getElementById('resultExplanation').textContent = value || '-';
}

// Funcție pentru calculul termenului
function calculeazaTermen() {
    if (!isFormValid()) return;
    
    let resultDate = null;
    let logic = '';
    const n = Number(duration);

    if (unit === 'zile') {
        // Sistemul zilelor libere (Cod procedură civilă)
        if (system === 'zile_libere') {
            let d = new Date(startDate);
            d.setDate(d.getDate() + 1); // ziua de început nu se ia în calcul
            d.setDate(d.getDate() + n); // adaug n zile calendaristice
            
            // dacă nu e lucrătoare, mergem la prima zi lucrătoare
            while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
                d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
            }
            resultDate = d;
            logic = `Termenul de ${n} zile calculat conform Codului de procedură civilă, fără a include ziua de început și ultima zi a termenului, expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
        }
        // Sistemul intermediar (Legea 101/2016)
        else if (system === 'intermediar') {
            let d = new Date(startDate);
            d.setDate(d.getDate() + 1); // ziua comunicării nu se ia în calcul
            d.setDate(d.getDate() + n); // numărăm n zile calendaristice
            d.setDate(d.getDate() - 1); // ne întoarcem pe ultima zi
            
            // dacă nu e lucrătoare, mergem la prima zi lucrătoare
            while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
                d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
            }
            resultDate = d;
            logic = `Termenul de ${n} zile calculat conform Legii 101/2016, fără a include ziua de comunicare și prelungit din cauza zilelor nelucrătoare, expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
        }
        // Sistemul zilelor pline (sistem brut)
        else if (system === 'zile_pline') {
            let d = new Date(startDate);
            d.setDate(d.getDate() + n - 1);
            
            // dacă nu e lucrătoare, mergem la prima zi lucrătoare
            while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
                d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
            }
            resultDate = d;
            logic = `Termenul de ${n} zile calculat în sistem brut (zile pline), incluzând ziua de început și prelungit dacă expiră într-o zi nelucrătoare, expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
        }
    }
    else if (unit === 'ore') {
        let d = new Date(startDate);
        d.setDate(d.getDate() + 1); // începe de la 00:00 a zilei următoare
        d.setHours(0, 0, 0, 0);
        d = new Date(d.getTime() + n * 60 * 60 * 1000); // adaug n ore
        
        // dacă se termină într-o zi nelucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
            d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
            d.setHours(0, 0, 0, 0);
        }
        resultDate = d;
        logic = `Termenul de ${n} ore începe la ora 00:00 a zilei următoare (${formatDateRO(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1))}) și expiră la ora 0:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}), prelungit dacă expiră într-o zi nelucrătoare.`;
    }
    else if (unit === 'săptămâni') {
        let d = new Date(startDate);
        d.setDate(d.getDate() + n * 7);
        
        // dacă nu e lucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
            d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        }
        resultDate = d;
        logic = `Termenul de ${n} săptămână${n > 1 ? 'i' : 'ă'} se încheie în ziua corespunzătoare, iar dacă expiră într-o zi nelucrătoare se prelungește la prima zi lucrătoare. Termenul expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
    }
    else if (unit === 'luni') {
        let d = new Date(startDate);
        let zi = d.getDate();
        d.setMonth(d.getMonth() + n);
        
        // dacă luna nu are ziua respectivă, se ia ultima zi a lunii
        if (d.getDate() < zi) {
            d.setDate(0); // ultima zi a lunii anterioare
        } else {
            d.setDate(zi);
        }
        
        // dacă nu e lucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
            d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        }
        resultDate = d;
        logic = `Termenul de ${n} lun${n > 1 ? 'i' : 'ă'} se încheie în ziua corespunzătoare, iar dacă luna nu are ziua respectivă se ia ultima zi a lunii. Dacă expiră într-o zi nelucrătoare, se prelungește la prima zi lucrătoare. Termenul expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
    }
    else if (unit === 'ani') {
        let d = new Date(startDate);
        let zi = d.getDate();
        let luna = d.getMonth();
        d.setFullYear(d.getFullYear() + n);
        
        // dacă luna nu are ziua respectivă, se ia ultima zi a lunii
        if (d.getMonth() !== luna) {
            d.setDate(0); // ultima zi a lunii anterioare
        } else {
            d.setDate(zi);
        }
        
        // dacă nu e lucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
            d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        }
        resultDate = d;
        logic = `Termenul de ${n} an${n > 1 ? 'i' : ''} se încheie în ziua corespunzătoare, iar dacă nu există ziua respectivă se ia ultima zi a lunii. Dacă expiră într-o zi nelucrătoare, se prelungește la prima zi lucrătoare. Termenul expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
    }
    
    setResult(resultDate ? formatDateRO(resultDate) : '');
    setExplanation(logic);
    calculated = true;
    
    document.getElementById('rezultate').style.display = 'block';
}

// Funcție pentru resetarea calculatorului
function resetCalculator() {
    startDate = null;
    duration = '';
    unit = 'zile';
    system = 'zile_libere';
    result = null;
    explanation = '';
    calculated = false;
    
    // Resetare formular
    document.getElementById('startDate').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('unit').value = 'zile';
    document.getElementById('system').value = 'zile_libere';
    document.getElementById('selectedYear').innerHTML = '<option value="">Alege data de început</option>';
    
    // Resetare rezultate
    setResult(null);
    setExplanation('');
    document.getElementById('rezultate').style.display = 'none';
    
    // Resetare UI
    updateUI();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Data de început
    document.getElementById('startDate').addEventListener('change', function() {
        if (this.value) {
            startDate = new Date(this.value);
            updateUI();
        } else {
            startDate = null;
            updateUI();
        }
    });
    
    // Durata
    document.getElementById('duration').addEventListener('input', function() {
        duration = this.value;
        updateUI();
    });
    
    // Unitatea de măsură
    document.getElementById('unit').addEventListener('change', function() {
        unit = this.value;
        updateUI();
    });
    
    // Sistemul de calcul
    document.getElementById('system').addEventListener('change', function() {
        system = this.value;
        updateUI();
    });
    
    // Inițializare UI
    updateUI();
}); 