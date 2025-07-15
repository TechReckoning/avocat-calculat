function calculeazaBuget() {
  const brut = parseFloat(document.getElementById('brut').value);
  if (isNaN(brut) || brut <= 0) {
    alert("Te rog introdu o sumă validă.");
    return;
  }

  let caa = 0;
  if (brut <= 871) {
    caa = 122;
  } else if (brut <= 19993) {
    caa = brut * 0.14;
  } else {
    caa = 2800;
  }

  const impozit = brut * 0.10;
  const cass = brut * 0.10;
  const barou = 15;
  const unbr = 10;
  const solidaritate = 5;

  const totalContributii = caa + impozit + cass + barou + unbr + solidaritate;
  const net = brut - totalContributii;

  const nevoi = net * 0.5;
  const dorinte = net * 0.3;
  const economii = net * 0.2;

  document.getElementById('rezultate').style.display = 'block';
  document.getElementById('impozit').textContent = impozit.toFixed(2) + ' lei';
  document.getElementById('cass').textContent = cass.toFixed(2) + ' lei';
  document.getElementById('caa').textContent = caa.toFixed(2) + ' lei';
  document.getElementById('barou').textContent = barou + ' lei';
  document.getElementById('unbr').textContent = unbr + ' lei';
  document.getElementById('solidaritate').textContent = solidaritate + ' lei';
  document.getElementById('total-contributii').textContent = totalContributii.toFixed(2) + ' lei';
  document.getElementById('net-disponibil').textContent = net.toFixed(2) + ' lei';
  document.getElementById('nevoi').textContent = nevoi.toFixed(2) + ' lei';
  document.getElementById('dorinte').textContent = dorinte.toFixed(2) + ' lei';
  document.getElementById('economii').textContent = economii.toFixed(2) + ' lei';
} 