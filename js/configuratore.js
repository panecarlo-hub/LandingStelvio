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

// ── TAN per durata ──
const TAN = { 24: 6.9, 36: 7.9, 48: 8.9, 60: 9.9 };

function calcolaRataMensile(prezzo, anticipoPerc, mesi) {
  const anticipo = Math.round(prezzo * (anticipoPerc / 100));
  const P = prezzo - anticipo;
  if (P <= 0) return { rata: 0, finanziato: 0, interessi: 0, totale: 0, anticipo };
  const tanAnnuo = (TAN[mesi] || 7.9) / 100;
  const r = tanAnnuo / 12;
  const rata = P * (r * Math.pow(1 + r, mesi)) / (Math.pow(1 + r, mesi) - 1);
  const totale = rata * mesi;
  const interessi = totale - P;
  return {
    rata:       Math.round(rata),
    finanziato: P,
    interessi:  Math.round(interessi),
    totale:     Math.round(totale),
    anticipo
  };
}

function toggleSimulatore(id) {
  const sim = document.getElementById('sim-' + id);
  const btn = document.getElementById('ratabtn-' + id);
  const isOpen = sim.style.display !== 'none';
  sim.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? 'Calcola rata' : 'Chiudi';
  if (!isOpen) aggiornaSimulatore(id);
}

function aggiornaSimulatore(id) {
  const sim  = document.getElementById('sim-' + id);
  const prezzo      = parseInt(sim.dataset.prezzo);
  const anticipoPerc = parseInt(sim.querySelector('.sim-anticipo').value);
  const mesi        = parseInt(sim.querySelector('.sim-btn.active').dataset.mesi);
  const modello     = sim.dataset.modello;

  const { rata, finanziato, interessi, totale, anticipo } = calcolaRataMensile(prezzo, anticipoPerc, mesi);

  sim.querySelector('.sim-anticipo-val').textContent = '€ ' + anticipo.toLocaleString('it-IT');
  sim.querySelector('.sim-rata-val').textContent     = '€ ' + rata.toLocaleString('it-IT') + '/mese';
  sim.querySelector('.sim-fin-val').textContent      = '€ ' + finanziato.toLocaleString('it-IT');
  sim.querySelector('.sim-int-val').textContent      = '€ ' + interessi.toLocaleString('it-IT');
  sim.querySelector('.sim-tot-val').textContent      = '€ ' + totale.toLocaleString('it-IT');

  const waMsg = encodeURIComponent(
    `Ciao! Sono interessato a un finanziamento per la ${modello}. Simulazione: anticipo € ${anticipo.toLocaleString('it-IT')}, ${mesi} mesi, rata indicativa € ${rata.toLocaleString('it-IT')}/mese. Potete confermarmi la fattibilità?`
  );
  sim.querySelector('.sim-wa-btn').href = `https://wa.me/393284120553?text=${waMsg}`;
}

function setDurata(btn, id) {
  btn.closest('.sim-durate').querySelectorAll('.sim-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  aggiornaSimulatore(id);
}

// ── RENDER CARDS ──
function renderCards(cars) {
  const grid  = document.getElementById('cardsGrid');
  const noRes = document.getElementById('noResults');

  if (cars.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'flex';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = cars.map(car => {
    const id = car.id;
    const waMsg = encodeURIComponent(
      `Ciao! Sono interessato alla Stelvio ${car.modello} (${car.anno}) - ${car.colore} - ${car.km.toLocaleString('it-IT')} km - Targa: ${car.targa}. Posso avere più informazioni?`
    );
    const waUrl  = `https://wa.me/393284120553?text=${waMsg}`;
    const gallery = car.gallery && car.gallery.length ? car.gallery : [car.foto_autoscout];

    return `
    <div class="car-card">
      <div class="card-img-wrap">
        <div class="card-gallery" id="gallery-${id}">
          <div class="card-gallery-track" id="gallery-track-${id}">
            ${gallery.map((src, gi) => `<img src="${src}" alt="${car.modello}" loading="${gi === 0 ? 'eager' : 'lazy'}" class="${gi === 0 ? 'active' : ''}">`).join('')}
          </div>
          <button class="gallery-btn gallery-prev" onclick="galleryNav(event,${id},-1)">&#8249;</button>
          <button class="gallery-btn gallery-next" onclick="galleryNav(event,${id},1)">&#8250;</button>
          <div class="gallery-dots" id="gallery-dots-${id}">
            ${gallery.map((_, gi) => `<span class="gdot ${gi === 0 ? 'active' : ''}"></span>`).join('')}
          </div>
        </div>
        <span class="card-badge">${car.allestimento}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${car.modello}</div>
        <div class="card-specs">
          <div class="card-spec"><span class="spec-label">Anno</span><span class="spec-value">${car.anno}</span></div>
          <div class="card-spec"><span class="spec-label">Km</span><span class="spec-value">${car.km.toLocaleString('it-IT')} km</span></div>
          <div class="card-spec"><span class="spec-label">Colore</span><span class="spec-value">${car.colore}</span></div>
          <div class="card-spec"><span class="spec-label">Trazione</span><span class="spec-value">${car.trazione}</span></div>
        </div>
        <div class="card-footer">
          <div class="card-price">€ ${car.prezzo.toLocaleString('it-IT')} <span>IVA incl.*</span></div>
          <div class="card-actions">
            <button id="ratabtn-${id}" class="card-rata-btn" onclick="toggleSimulatore(${id})">Calcola rata</button>
            <a href="${waUrl}" target="_blank" class="card-wa-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chiedi info
            </a>
          </div>
        </div>
        <!-- SIMULATORE RATA -->
        <div class="simulatore" id="sim-${id}" style="display:none"
             data-prezzo="${car.prezzo}" data-modello="${car.modello} (${car.anno}) targa ${car.targa}">
          <div class="sim-row">
            <div class="sim-row-label">
              <span>Anticipo</span>
              <span class="sim-anticipo-val">€ 0</span>
            </div>
            <input type="range" class="sim-anticipo" min="0" max="30" step="5" value="0"
                   oninput="aggiornaSimulatore(${id})">
            <div class="sim-perc-labels"><span>0%</span><span>15%</span><span>30%</span></div>
          </div>
          <div class="sim-row">
            <span class="sim-row-label-single">Durata</span>
            <div class="sim-durate">
              <button class="sim-btn" data-mesi="24" onclick="setDurata(this,${id})">24 mesi</button>
              <button class="sim-btn active" data-mesi="36" onclick="setDurata(this,${id})">36 mesi</button>
              <button class="sim-btn" data-mesi="48" onclick="setDurata(this,${id})">48 mesi</button>
              <button class="sim-btn" data-mesi="60" onclick="setDurata(this,${id})">60 mesi</button>
            </div>
          </div>
          <div class="sim-result">
            <div class="sim-rata-box">
              <span class="sim-rata-label">Rata mensile indicativa</span>
              <span class="sim-rata-val">€ ---</span>
            </div>
            <div class="sim-details">
              <div class="sim-detail"><span>Finanziato</span><b class="sim-fin-val">---</b></div>
              <div class="sim-detail"><span>Interessi</span><b class="sim-int-val">---</b></div>
              <div class="sim-detail"><span>Totale</span><b class="sim-tot-val">---</b></div>
            </div>
            <a href="#" target="_blank" class="sim-wa-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chiedi finanziamento su WhatsApp
            </a>
            <p class="sim-disclaimer">* I prezzi sono puramente indicativi e potrebbero subire variazioni. Calcolo esemplificativo basato su TAN fisso (${TAN[36]}% per 36 mesi, variabile per durata). Offerta soggetta ad approvazione creditizia. TAEG non incluso.</p>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Inizializza ogni simulatore al caricamento
  cars.forEach(car => aggiornaSimulatore(car.id));
  // Inizializza swipe touch gallery
  initGalleryTouch();
}

// ── GALLERY ──
const galleryState = {};

function galleryNav(e, id, dir) {
  e.preventDefault();
  e.stopPropagation();
  galleryGoTo(id, dir);
}

function galleryGoTo(id, dir) {
  const track = document.getElementById('gallery-track-' + id);
  const dotsEl = document.getElementById('gallery-dots-' + id);
  if (!track) return;
  const imgs = track.querySelectorAll('img');
  const total = imgs.length;
  if (!galleryState[id]) galleryState[id] = 0;
  imgs[galleryState[id]].classList.remove('active');
  galleryState[id] = (galleryState[id] + dir + total) % total;
  imgs[galleryState[id]].classList.add('active');
  dotsEl.querySelectorAll('.gdot').forEach((d, i) => d.classList.toggle('active', i === galleryState[id]));
}

function initGalleryTouch() {
  document.querySelectorAll('.card-gallery').forEach(gallery => {
    const idAttr = gallery.id.replace('gallery-', '');
    let startX = 0, startY = 0, isDragging = false, lockAxis = null;

    gallery.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      lockAxis = null;
    }, { passive: true });

    gallery.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!lockAxis) {
        lockAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (lockAxis === 'x') {
        e.preventDefault();
      }
    }, { passive: false });

    gallery.addEventListener('touchend', e => {
      if (!isDragging || lockAxis !== 'x') { isDragging = false; return; }
      const dx = e.changedTouches[0].clientX - startX;
      isDragging = false;
      if (Math.abs(dx) > 40) {
        galleryGoTo(idAttr, dx < 0 ? 1 : -1);
      }
    });
  });
}
