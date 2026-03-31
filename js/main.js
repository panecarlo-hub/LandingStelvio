document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar-links');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ===== LOAD CARS =====
  let allCars = [];
  let currentFilter = 'tutti';
  let currentSort = 'prezzo-asc';

  fetch('stelvio.json')
    .then(res => res.json())
    .then(data => {
      allCars = data;
      renderCars();
      updateCount();
    });

  // ===== COLOR MAP =====
  const colorMap = {
    'Grigio': '#7A7A7A',
    'Nero': '#1A1A1A',
    'Rosso': '#C0392B',
    'Bianco': '#F0F0F0',
    'Blu': '#2C3E7B'
  };

  // ===== RENDER CARS =====
  function renderCars() {
    const grid = document.getElementById('carGrid');
    let cars = [...allCars];

    // Filter
    if (currentFilter !== 'tutti') {
      cars = cars.filter(car => car.allestimento.toLowerCase() === currentFilter);
    }

    // Sort
    switch (currentSort) {
      case 'prezzo-asc':
        cars.sort((a, b) => a.prezzo - b.prezzo);
        break;
      case 'prezzo-desc':
        cars.sort((a, b) => b.prezzo - a.prezzo);
        break;
      case 'km-asc':
        cars.sort((a, b) => a.km - b.km);
        break;
      case 'anno-desc':
        cars.sort((a, b) => b.anno - a.anno);
        break;
    }

    grid.innerHTML = cars.map(car => {
      const kmFormatted = car.km.toLocaleString('it-IT');
      const prezzoFormatted = car.prezzo.toLocaleString('it-IT');
      const badgeText = car.km < 10000 ? 'QUASI NUOVA' : car.km < 50000 ? 'POCHI KM' : '';
      const colorHex = colorMap[car.colore] || '#888';

      return `
        <div class="car-card" onclick="window.open('${car.link}', '_blank')">
          <div class="car-card-image">
            ${badgeText ? `<span class="car-card-badge">${badgeText}</span>` : ''}
            <span class="car-card-color" style="background:${colorHex}"></span>
            <img src="${car.foto}" alt="Alfa Romeo ${car.modello}" loading="lazy">
          </div>
          <div class="car-card-body">
            <h3 class="car-card-title">Alfa Romeo ${car.modello}</h3>
            <div class="car-card-allestimento">${car.allestimento}</div>
            <div class="car-card-specs">
              <div class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
                ${car.anno}
              </div>
              <div class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M17.5 10c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-11c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h11zm-8.5 4h2v3H9v-3zm4 0h2v3h-2v-3zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/></svg>
                ${kmFormatted} km
              </div>
              <div class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-7-12l1.5 4.5h5L18 6H10zm8.3 0l-1.6 5H9.4L7 6H4v2h2l3.6 7.6L8.2 18H19v-2h-8.3l1-2h5.8l2-6H18.3z"/></svg>
                ${car.cv} CV ${car.trazione}
              </div>
              <div class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/></svg>
                ${car.carburante}
              </div>
            </div>
            <div class="car-card-footer">
              <div class="car-price">
                &euro;${prezzoFormatted}
                <span class="car-price-iva">IVA inclusa</span>
              </div>
              <span class="car-card-link">
                Dettagli
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    updateCount(cars.length);
  }

  function updateCount(count) {
    const el = document.getElementById('resultsCount');
    if (el) {
      const num = count !== undefined ? count : allCars.length;
      el.textContent = `${num} Stelvio disponibil${num === 1 ? 'e' : 'i'}`;
    }
  }

  // ===== FILTERS =====
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderCars();
    });
  });

  // ===== SORT =====
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCars();
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .car-card, .contatti-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Animation class
  const style = document.createElement('style');
  style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // ===== STAT COUNTER ANIMATION =====
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.target;
        const isDecimal = target.includes('.');
        const targetNum = parseFloat(target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * targetNum;

          if (isDecimal) {
            el.textContent = current.toFixed(2);
          } else {
            el.textContent = Math.floor(current);
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(update);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
  });
});
