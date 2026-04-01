/* ============================================================
   COSTA AUTO&GOMME — V5 CONFIGURATORE
   ============================================================ */

// ── Immagine rappresentativa per colore (configuratore hero) ──
const COLOR_IMG = {
  'Rosso':  'SenzaSfondo/GP898ZV - Modificata.png',
  'Nero':   'SenzaSfondo/GG752FZ - Modificata.png',
  'Grigio': 'SenzaSfondo/GJ108JB - Modificata.png',
  'Bianco': 'SenzaSfondo/GB610VN - Modificata.png',
  'Blu':    'SenzaSfondo/GD067YJ - Modificata.png',
  'Tutti':  'SenzaSfondo/GP898ZV - Modificata.png',
};

const COLOR_LABEL = {
  'Rosso':  'Rosso Alfa',
  'Nero':   'Nero Vulcano',
  'Grigio': 'Grigio Vesuvio',
  'Bianco': 'Bianco Alfa',
  'Blu':    'Misano Blue',
  'Tutti':  'Tutti i colori',
};

// ── Stato filtri ──
const filters = {
  colore:    'Tutti',
  anno:      'Tutti',
  cv:        'Tutti',
  trazione:  'Tutti',
  kmMin:     0,
  kmMax:     120000,
};

let allCars = [];

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  loadCars();
  initNavbar();
  initSlider();
  initBurger();
});

async function loadCars() {
  try {
    const res = await fetch('stelvio.json');
    allCars = await res.json();
    renderCards(allCars);
    updateMatchCount();
  } catch (e) {
    console.error('Errore caricamento stelvio.json', e);
  }
}

// ── Navbar scroll ──
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Burger menu ──
function initBurger() {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  burger.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });
  // Chiudi al click sui link
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobile.classList.remove('open'));
  });
}

// ── COLORE ──
document.getElementById('colorSwatches').addEventListener('click', e => {
  const btn = e.target.closest('.swatch');
  if (!btn) return;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  filters.colore = btn.dataset.color;
  updateCarPreview(filters.colore);
  applyFilters();
});

function updateCarPreview(colore) {
  const img = document.getElementById('configCarImg');
  const label = document.getElementById('configColorLabel');
  img.classList.add('changing');
  setTimeout(() => {
    img.src = COLOR_IMG[colore] || COLOR_IMG['Tutti'];
    img.classList.remove('changing');
  }, 300);
  label.textContent = COLOR_LABEL[colore] || colore;
}

// ── ANNO ──
document.getElementById('annoGroup').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('#annoGroup .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filters.anno = btn.dataset.anno;
  applyFilters();
});

// ── CV ──
document.getElementById('motorGroup').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('#motorGroup .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filters.cv = btn.dataset.cv;
  applyFilters();
});

// ── TRAZIONE ──
document.getElementById('trazioneGroup').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('#trazioneGroup .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filters.trazione = btn.dataset.trazione;
  applyFilters();
});

// ── KM SLIDER ──
function initSlider() {
  const sliderMin = document.getElementById('kmMin');
  const sliderMax = document.getElementById('kmMax');
  const fill = document.getElementById('rangeFill');
  const display = document.getElementById('kmDisplay');

  function updateSlider() {
    let min = parseInt(sliderMin.value);
    let max = parseInt(sliderMax.value);
    if (min > max) {
      [min, max] = [max, min];
      sliderMin.value = min;
      sliderMax.value = max;
    }
    filters.kmMin = min;
    filters.kmMax = max;
    const pMin = (min / 120000) * 100;
    const pMax = (max / 120000) * 100;
    fill.style.left = pMin + '%';
    fill.style.width = (pMax - pMin) + '%';
    display.textContent = `${formatKm(min)} — ${formatKm(max)} km`;
    applyFilters();
  }

  sliderMin.addEventListener('input', updateSlider);
  sliderMax.addEventListener('input', updateSlider);
  updateSlider();
}

function formatKm(n) {
  return n === 0 ? '0' : n.toLocaleString('it-IT');
}

// ── RESET ──
document.getElementById('resetBtn').addEventListener('click', () => {
  filters.colore   = 'Tutti';
  filters.anno     = 'Tutti';
  filters.cv       = 'Tutti';
  filters.trazione = 'Tutti';
  filters.kmMin    = 0;
  filters.kmMax    = 120000;

  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  document.querySelector('.swatch[data-color="Tutti"]').classList.add('active');
  document.querySelectorAll('#annoGroup .filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#annoGroup .filter-btn[data-anno="Tutti"]').classList.add('active');
  document.querySelectorAll('#motorGroup .filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#motorGroup .filter-btn[data-cv="Tutti"]').classList.add('active');
  document.querySelectorAll('#trazioneGroup .filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#trazioneGroup .filter-btn[data-trazione="Tutti"]').classList.add('active');

  document.getElementById('kmMin').value = 0;
  document.getElementById('kmMax').value = 120000;
  document.getElementById('rangeFill').style.left  = '0%';
  document.getElementById('rangeFill').style.width = '100%';
  document.getElementById('kmDisplay').textContent = '0 — 120.000 km';

  updateCarPreview('Tutti');
  applyFilters();
});

// ── FILTRA ──
function applyFilters() {
  const filtered = allCars.filter(car => {
    if (filters.colore   !== 'Tutti' && car.colore   !== filters.colore)          return false;
    if (filters.anno     !== 'Tutti' && car.anno     !== parseInt(filters.anno))   return false;
    if (filters.cv       !== 'Tutti' && car.cv       !== parseInt(filters.cv))     return false;
    if (filters.trazione !== 'Tutti' && car.trazione !== filters.trazione)         return false;
    if (car.km < filters.kmMin || car.km > filters.kmMax)                          return false;
    return true;
  });

  renderCards(filtered);
  updateMatchCount(filtered.length);
}

function updateMatchCount(count) {
  const n = count !== undefined ? count : allCars.length;
  document.getElementById('configMatchCount').textContent =
    n === 0 ? 'Nessuna vettura trovata' :
    n === 1 ? '1 vettura trovata' :
    `${n} vetture trovate`;
  document.getElementById('risultatiCount').textContent =
    n === 1 ? '1 vettura' : `${n} vetture`;
}

// ── RENDER CARDS ──
function renderCards(cars) {
  const grid = document.getElementById('cardsGrid');
  const noRes = document.getElementById('noResults');

  if (cars.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'flex';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = cars.map(car => {
    const waMsg = encodeURIComponent(
      `Ciao! Sono interessato alla Stelvio ${car.modello} (${car.anno}) - ${car.colore} - ${car.km.toLocaleString('it-IT')} km - Targa: ${car.targa}. Posso avere più informazioni?`
    );
    const waUrl = `https://wa.me/393284120553?text=${waMsg}`;

    // Usa la foto SenzaSfondo se disponibile, altrimenti autoscout
    const imgSrc = car.foto || car.foto_autoscout;

    return `
    <div class="car-card">
      <div class="card-img-wrap">
        <img
          src="${imgSrc}"
          alt="${car.modello}"
          onerror="this.src='${car.foto_autoscout}'"
          loading="lazy"
        >
        <span class="card-badge">${car.allestimento}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${car.modello}</div>
        <div class="card-specs">
          <div class="card-spec">
            <span class="spec-label">Anno</span>
            <span class="spec-value">${car.anno}</span>
          </div>
          <div class="card-spec">
            <span class="spec-label">Km</span>
            <span class="spec-value">${car.km.toLocaleString('it-IT')} km</span>
          </div>
          <div class="card-spec">
            <span class="spec-label">Colore</span>
            <span class="spec-value">${car.colore}</span>
          </div>
          <div class="card-spec">
            <span class="spec-label">Trazione</span>
            <span class="spec-value">${car.trazione}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-price">
            € ${car.prezzo.toLocaleString('it-IT')} <span>IVA incl.</span>
          </div>
          <a href="${waUrl}" target="_blank" class="card-wa-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chiedi info
          </a>
        </div>
      </div>
    </div>`;
  }).join('');
}
