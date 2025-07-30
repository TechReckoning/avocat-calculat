// Calculator dobândă legală conform O.G. nr. 13/2011
// Cod preluat și adaptat de la https://github.com/TechReckoning/calculator-dobanda-legala

let bnrRates = [];

function parseDate(dateStr) {
    // YYYY-MM-DD -> Date (ora 12:00 UTC)
    if (!dateStr || typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function daysBetween(start, end) {
    // start, end: Date
    // Dobânda începe a doua zi după scadență, până la data calculului inclusiv
    let s = new Date(start);
    const msPerDay = 1000 * 60 * 60 * 24;
    const result = Math.floor((end - s) / msPerDay) + 1;
    console.log('[daysBetween]', {
        start: start.toISOString(),
        end: end.toISOString(),
        s: s.toISOString(),
        result
    });
    return result;
}

function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
function daysInYear(year) {
    return isLeap(year) ? 366 : 365;
}

function getBNRTranches(start, end, bnrRates) {
    console.log('[getBNRTranches]', { start, end });
    // returnează [{start, end, zile, rataBNR} ...] pentru fiecare subinterval
    let transe = [];
    let s = new Date(start);
    // Pentru prima tranșă, avansează cu o zi după scadență
    s.setUTCDate(s.getUTCDate() + 1);
    let e = new Date(end);
    // Nu incrementăm s aici!
    if (s > e) return [];
    let i = 0;
    while (i < bnrRates.length && parseDate(bnrRates[i].start) <= s) i++;
    if (i > 0) i--;
    while (s <= e && i < bnrRates.length) {
        let rate = bnrRates[i];
        let rateStart = parseDate(rate.start);
        let nextRateStart = (i + 1 < bnrRates.length) ? parseDate(bnrRates[i + 1].start) : null;
        let trancheStart = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate(), 12, 0, 0));
        let trancheEnd = nextRateStart && nextRateStart <= e
            ? new Date(Date.UTC(nextRateStart.getUTCFullYear(), nextRateStart.getUTCMonth(), nextRateStart.getUTCDate() - 1, 12, 0, 0))
            : new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), 12, 0, 0));
        if (trancheEnd < trancheStart) {
            i++;
            continue;
        }
        console.log('[getBNRTranches] trancheStart:', trancheStart.toISOString(), 'trancheEnd:', trancheEnd.toISOString());
        let zile = daysBetween(trancheStart, trancheEnd);
        if (zile > 0) {
            transe.push({
                start: trancheStart,
                end: trancheEnd,
                zile,
                rataBNR: Number(rate.rate) / 100
            });
        }
        if (nextRateStart && nextRateStart <= e) {
            s = nextRateStart;
            i++;
        } else {
            break;
        }
    }
    return transe;
}

function dobandaAnuala(tip, rataBNR) {
    switch (tip) {
        case "uzual": return rataBNR + 0.04;
        case "profesionisti": return rataBNR + 0.08;
        case "profesionisti-art4": return rataBNR + 0.08; // Aceeași rată ca profesioniști
        case "extraneitate": return 0.06;
        case "faraScop": return 0.8 * (rataBNR + 0.04);
        default: return null;
    }
}

// Funcție pentru calculul pe semestre conform art. 4 din Legea nr. 72/2013
function getSemesterRates(start, end, bnrRates) {
    let semestre = [];
    let currentDate = new Date(start);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Începe a doua zi după scadență
    let endDate = new Date(end);
    
    while (currentDate <= endDate) {
        let semesterStart = new Date(currentDate);
        let semesterEnd = new Date(currentDate);
        
        // Determină semestrul (ianuarie-iunie sau iulie-decembrie)
        let month = currentDate.getUTCMonth();
        let year = currentDate.getUTCFullYear();
        
        if (month < 6) {
            // Semestrul I (ianuarie-iunie)
            semesterStart = new Date(Date.UTC(year, 0, 1, 12, 0, 0)); // 1 ianuarie
            semesterEnd = new Date(Date.UTC(year, 5, 30, 12, 0, 0)); // 30 iunie
        } else {
            // Semestrul II (iulie-decembrie)
            semesterStart = new Date(Date.UTC(year, 6, 1, 12, 0, 0)); // 1 iulie
            semesterEnd = new Date(Date.UTC(year, 11, 31, 12, 0, 0)); // 31 decembrie
        }
        
        // Ajustează începutul și sfârșitul la perioada de calcul
        if (semesterStart < currentDate) {
            semesterStart = new Date(currentDate);
        }
        if (semesterEnd > endDate) {
            semesterEnd = new Date(endDate);
        }
        
        // Găsește rata BNR pentru prima zi a semestrului
        let semesterRateStart = new Date(semesterStart);
        if (month < 6) {
            semesterRateStart = new Date(Date.UTC(year, 0, 1, 12, 0, 0)); // 1 ianuarie
        } else {
            semesterRateStart = new Date(Date.UTC(year, 6, 1, 12, 0, 0)); // 1 iulie
        }
        
        // Caută rata BNR valabilă la începutul semestrului
        let rataBNR = 0;
        for (let i = bnrRates.length - 1; i >= 0; i--) {
            let rateDate = parseDate(bnrRates[i].start);
            if (rateDate <= semesterRateStart) {
                rataBNR = Number(bnrRates[i].rate) / 100;
                break;
            }
        }
        
        let zile = daysBetween(semesterStart, semesterEnd);
        // Adaug +1 pentru ultimul semestru care se termină cu data calculului
        if (semesterEnd.getTime() === endDate.getTime()) {
            zile += 1;
        }
        if (zile > 0) {
            semestre.push({
                start: semesterStart,
                end: semesterEnd,
                zile,
                rataBNR,
                semesterType: month < 6 ? 'I' : 'II',
                year: year
            });
        }
        
        // Avansează la următorul semestru
        currentDate = new Date(semesterEnd);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    return semestre;
}

function formatDate(date) {
    if (!date) return '-';
    if (date instanceof Date) return date.toLocaleDateString('ro-RO');
    return new Date(date).toLocaleDateString('ro-RO');
}
function format2(val) {
    return Number(val).toFixed(2);
}

function calcDobanda({ suma, dataScadenta, dataCalcul, tipRaport, bnrRates }) {
    let totalDobanda = 0;
    let detalii = [];
    
    if (tipRaport === "profesionisti-art4") {
        // Logica specială pentru art. 4 din Legea nr. 72/2013 - calcul pe semestre
        let semestre = getSemesterRates(dataScadenta, dataCalcul, bnrRates);
        
        for (let semestru of semestre) {
            let dobAnuala = dobandaAnuala(tipRaport, semestru.rataBNR);
            if (dobAnuala === null) continue;
            
            let zileAn = daysInYear(semestru.year);
            let dobanda = suma * dobAnuala * semestru.zile / zileAn;
            totalDobanda += dobanda;
            
            detalii.push({
                perioada: `${formatDate(semestru.start)} – ${formatDate(semestru.end)}`,
                zile: semestru.zile,
                zileAn: zileAn,
                rataBNR: (semestru.rataBNR * 100).toFixed(2) + '%',
                dobAplicata: (dobAnuala * 100).toFixed(2) + '%',
                dobandaRON: dobanda.toFixed(2),
                semestru: `Semestrul ${semestru.semesterType} ${semestru.year}`
            });
        }
    } else {
        // Logica existentă pentru celelalte tipuri de raport juridic
        let transe = getBNRTranches(dataScadenta, dataCalcul, bnrRates);
        
        for (let t of transe) {
            let dobAnuala = dobandaAnuala(tipRaport, t.rataBNR);
            if (dobAnuala === null) continue;
            let yStart = t.start.getUTCFullYear();
            let yEnd = t.end.getUTCFullYear();
            let subStart = new Date(t.start);
            while (yStart <= yEnd) {
                let subEnd = (yStart === yEnd) ? t.end : parseDate(`${yStart}-12-31`);
                let zile = daysBetween(subStart, subEnd);
                console.log('[detaliu]', { subStart: subStart.toISOString(), subEnd: subEnd.toISOString(), zile });
                let zileAn = daysInYear(yStart);
                let dobanda = suma * dobAnuala * zile / zileAn;
                totalDobanda += dobanda;
                detalii.push({
                    perioada: `${formatDate(subStart)} – ${formatDate(subEnd)}`,
                    zile,
                    zileAn,
                    rataBNR: (t.rataBNR * 100).toFixed(2) + '%',
                    dobAplicata: (dobAnuala * 100).toFixed(2) + '%',
                    dobandaRON: dobanda.toFixed(2)
                });
                if (yStart === yEnd) break;
                yStart++;
                subStart = parseDate(`${yStart}-01-01`);
            }
        }
    }
    
    return {
        detalii,
        totalDobanda: totalDobanda.toFixed(2)
    };
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadBNRRates();
    const form = document.getElementById('calculatorForm');
    const transeTableBody = document.getElementById('transeTableBody');
    const totalDobandaCell = document.getElementById('totalDobanda');
    const sumaAfisata = document.getElementById('sumaAfisata');
    const perioadaIntarziere = document.getElementById('perioadaIntarziere');
    const dobandaAcumulata = document.getElementById('dobandaAcumulata');
    const totalPlata = document.getElementById('totalPlata');
    let errorMsg = document.getElementById('errorMsg');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.id = 'errorMsg';
        errorMsg.style.color = '#b00000';
        errorMsg.style.fontWeight = 'bold';
        errorMsg.style.marginBottom = '15px';
        form.insertBefore(errorMsg, form.firstChild);
    }
    function calculeazaLive() {
        errorMsg.textContent = '';
        let suma = parseFloat(form.suma.value.replace(',', '.'));
        let dataScadenta = form.dataScadenta.value;
        let dataCalcul = form.dataCalcul.value;
        let tipRaport = form.querySelector('input[name="tipRaport"]:checked')?.value;
        const detaliiMsg = document.getElementById('detalii-msg');
        console.log('[calculeazaLive]', { dataScadenta, dataCalcul });
        if (isNaN(suma) || suma <= 0 || !dataScadenta || !dataCalcul || !tipRaport) {
            transeTableBody.innerHTML = '';
            totalDobandaCell.innerHTML = '<strong>-</strong>';
            sumaAfisata.textContent = '-';
            perioadaIntarziere.textContent = '-';
            dobandaAcumulata.textContent = '-';
            totalPlata.textContent = '-';
            detaliiMsg.textContent = 'Introduceți toate datele pentru a vedea calculul detaliat.';
            return;
        }
        let dScadenta = parseDate(dataScadenta);
        let dCalcul = parseDate(dataCalcul);
        if (!dScadenta || !dCalcul) {
            transeTableBody.innerHTML = '';
            totalDobandaCell.innerHTML = '<strong>-</strong>';
            sumaAfisata.textContent = '-';
            perioadaIntarziere.textContent = '-';
            dobandaAcumulata.textContent = '-';
            totalPlata.textContent = '-';
            detaliiMsg.textContent = 'Datele introduse nu sunt valide!';
            return;
        }
        if (dCalcul <= dScadenta) {
            transeTableBody.innerHTML = '';
            totalDobandaCell.innerHTML = '<strong>-</strong>';
            sumaAfisata.textContent = '-';
            perioadaIntarziere.textContent = '-';
            dobandaAcumulata.textContent = '-';
            totalPlata.textContent = '-';
            detaliiMsg.textContent = 'Data calculului trebuie să fie după data scadenței!';
            return;
        }
        let { detalii, totalDobanda } = calcDobanda({ suma, dataScadenta, dataCalcul, tipRaport, bnrRates });
        transeTableBody.innerHTML = '';
        let totalZile = 0;
        detalii.forEach(row => {
            totalZile += row.zile;
            const tr = document.createElement('tr');
            if (tipRaport === "profesionisti-art4" && row.semestru) {
                // Pentru noul tip, afișează și informația despre semestru
                tr.innerHTML = `<td>${row.perioada}<br><small style="color:#666;">${row.semestru}</small></td><td>${row.zile}</td><td>${row.zileAn}</td><td>${row.rataBNR}</td><td>${row.dobAplicata}</td><td>${row.dobandaRON}</td>`;
            } else {
                tr.innerHTML = `<td>${row.perioada}</td><td>${row.zile}</td><td>${row.zileAn}</td><td>${row.rataBNR}</td><td>${row.dobAplicata}</td><td>${row.dobandaRON}</td>`;
            }
            transeTableBody.appendChild(tr);
        });
        totalDobandaCell.innerHTML = `<strong>${totalDobanda} RON</strong>`;
        sumaAfisata.textContent = format2(suma) + ' RON';
        perioadaIntarziere.textContent = totalZile + ' zile';
        dobandaAcumulata.textContent = totalDobanda + ' RON';
        totalPlata.textContent = format2(suma + parseFloat(totalDobanda)) + ' RON';
        detaliiMsg.textContent = '';
    }
    form.suma.addEventListener('input', calculeazaLive);
    form.dataScadenta.addEventListener('change', calculeazaLive);
    form.dataCalcul.addEventListener('change', calculeazaLive);
    const radios = form.querySelectorAll('input[name="tipRaport"]');
    radios.forEach(radio => radio.addEventListener('change', calculeazaLive));
    calculeazaLive();
});

async function loadBNRRates() {
    const resp = await fetch('/js/bnr-rates.json');
    bnrRates = await resp.json();
    bnrRates.sort((a, b) => new Date(a.start) - new Date(b.start));
} 