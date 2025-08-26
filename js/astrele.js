async function loadHoroscop() {
  try {
    console.log("Încerc să încarc horoscopul...");
    
    // URL-ul corect pentru Google Sheets
    const url = "https://docs.google.com/spreadsheets/d/1FnGGguZk0cCiMggAspCZLNXLAgMKXIZbDYkLGa7YgF4/export?format=csv&gid=0";
    
    console.log("URL:", url);
    
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      redirect: 'follow'
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const text = await res.text();
    console.log("Răspuns primit:", text.substring(0, 200) + "...");
    
    if (text.includes("Temporary Redirect") || text.includes("HTML")) {
      throw new Error("Google Sheets returnează redirect sau HTML în loc de CSV");
    }
    
    const parsed = Papa.parse(text, { 
      header: true, 
      skipEmptyLines: true,
      error: function(error) {
        console.error("Eroare la parsarea CSV:", error);
      }
    });
    
    const data = parsed.data;
    console.log("Date parsate:", data);
    
    if (!data || data.length === 0) {
      throw new Error("Nu s-au găsit date în CSV");
    }
    
    // Găsește săptămâna curentă (ultima din listă)
    const saptamani = [...new Set(data.map(row => row['saptamana']).filter(Boolean))];
    
    if (saptamani.length === 0) {
      throw new Error("Nu s-au găsit săptămâni în date");
    }
    
    const saptamanaCurenta = saptamani[saptamani.length-1];
    console.log("Săptămâni găsite:", saptamani);
    console.log("Săptămâna curentă:", saptamanaCurenta);
    
    document.getElementById('horoscop-week').textContent = 'Săptămâna: ' + saptamanaCurenta;
    
    const zodii = data.filter(row => row['saptamana'] === saptamanaCurenta);
    console.log("Zodii pentru săptămâna curentă:", zodii);
    
    // Folosește funcția separată pentru afișare
    displayHoroscopData(data, saptamanaCurenta);
    
  } catch (error) {
    console.error("Eroare la încărcarea horoscopului:", error);
    
    const list = document.getElementById('horoscop-list');
    list.innerHTML = `
      <div style="color:#b00;text-align:center;padding:20px;">
        <h3>Eroare la încărcarea datelor</h3>
        <p>Nu s-au putut încărca datele de la Google Sheets.</p>
        <p><strong>Detalii:</strong> ${error.message}</p>
        <p>Vă rugăm să verificați:</p>
        <ul style="text-align:left;display:inline-block;margin:10px 0;">
          <li>Dacă fișierul Excel este public</li>
          <li>Dacă URL-ul este corect</li>
          <li>Dacă există probleme de conectivitate</li>
        </ul>
        <button onclick="loadHoroscop()" style="margin-top:15px;padding:10px 20px;background:#9CAF88;color:white;border:none;border-radius:5px;cursor:pointer;">
          Încearcă din nou
        </button>
      </div>
    `;
    
    document.getElementById('horoscop-week').textContent = 'Eroare la încărcare';
  }
}

// Funcție pentru a verifica dacă Google Sheets este accesibil
async function testGoogleSheetsAccess() {
  try {
    const url = "https://docs.google.com/spreadsheets/d/1FnGGguZk0cCiMggAspCZLNXLAgMKXIZbDYkLGa7YgF4/export?format=csv&gid=0";
    
    const res = await fetch(url, { 
      method: 'GET',
      cache: 'no-cache',
      redirect: 'follow'
    });
    
    if (!res.ok) {
      console.log("Status Google Sheets:", res.status);
      return false;
    }
    
    const text = await res.text();
    const isCSV = text.includes('saptamana') && text.includes('zodie') && text.includes('text_horoscop');
    
    console.log("Google Sheets accesibil și conține date CSV:", isCSV);
    return isCSV;
  } catch (error) {
    console.error("Eroare la testarea accesului:", error);
    return false;
  }
}

// Funcție de fallback cu date statice în caz de urgență
function loadFallbackData() {
  console.log("Încarc date de fallback...");
  
  const fallbackData = [
    {
      saptamana: "14.07-20.07.2025",
      zodie: "Berbec (Avocatus Impulsivus)",
      text_horoscop: "Fiecare caz pare o bătălie în instanță și în viață. Ai grijă să nu trimiți un email pasiv-agresiv clientului înainte de a bea cafeaua. Decizia săptămânii: Nu merge la bară cu argumente bazate pe sentimente. Judecătorul nu e astrolog."
    },
    {
      saptamana: "14.07-20.07.2025", 
      zodie: "Taur (Avocatus Stabilitus)",
      text_horoscop: "Ai început să facturezi mental inclusiv discuțiile cu prietenii. Încearcă totuși să nu le ceri onorariu. Recomandare: Schimbă parola de la e-mail. Ai folosit '123jurist' prea mult timp."
    }
  ];
  
  displayHoroscopData(fallbackData, "14.07-20.07.2025");
}

// Funcție separată pentru afișarea datelor
function displayHoroscopData(data, saptamanaCurenta) {
  document.getElementById('horoscop-week').textContent = 'Săptămâna: ' + saptamanaCurenta;
  
  const zodii = data.filter(row => row['saptamana'] === saptamanaCurenta);
  console.log("Zodii pentru săptămâna curentă:", zodii);
  
  const list = document.getElementById('horoscop-list');
  list.innerHTML = '';
  
  if (zodii.length === 0) {
    list.innerHTML = '<div style="color:#b00;text-align:center;padding:20px;">Nu există date pentru această săptămână.</div>';
  } else {
    zodii.forEach(row => {
      console.log("Procesez zodie:", row);
      const div = document.createElement('div');
      div.className = 'zodie';
      
      const horoscopText = row['horoscop'] || row['text_horoscop'] || row['text'] || '';
      
      div.innerHTML = `
        <div class="zodie-header">
          <span class="nume-zodie"><strong>${row['zodie'] || 'Zodie necunoscută'}</strong></span>
        </div>
        <div class="zodie-text">
          <p>${horoscopText || 'Nu există text pentru această zodie.'}</p>
        </div>
      `;
      list.appendChild(div);
    });
  }
}

// Inițializare când se încarcă pagina
document.addEventListener('DOMContentLoaded', function() {
  console.log("Pagina astrele s-a încărcat");
  
  // Testează mai întâi dacă Google Sheets este accesibil
  testGoogleSheetsAccess().then(accessible => {
    if (accessible) {
      console.log("Google Sheets este accesibil, încarc datele...");
      loadHoroscop();
    } else {
      console.log("Google Sheets nu este accesibil, încarc date de fallback...");
      loadFallbackData();
    }
  }).catch(error => {
    console.error("Eroare la testarea accesului:", error);
    console.log("Încarc date de fallback...");
    loadFallbackData();
  });
});
