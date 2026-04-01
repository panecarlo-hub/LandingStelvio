document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar-links');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
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
    });

  // ===== COLOR MAP =====
  const colorMap = {
    'Grigio': '#8A8A8A',
    'Nero': '#2A2A2A',
    'Rosso': '#B5232E',
    'Bianco': '#E8E8E8',
    'Blu': '#3A4F7A'
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
      case 'prezzo-asc': cars.sort((a, b) => a.prezzo - b.prezzo); break;
      case 'prezzo-desc': cars.sort((a, b) => b.prezzo - a.prezzo); break;
      case 'km-asc': cars.sort((a, b) => a.km - b.km); break;
      case 'anno-desc': cars.sort((a, b) => b.anno - a.anno); break;
    }

    grid.innerHTML = cars.map(car => {
      const kmFormatted = car.km.toLocaleString('it-IT');
      const prezzoFormatted = car.prezzo.toLocaleString('it-IT');
      const badgeText = car.km < 10000 ? 'Quasi Nuova' : car.km < 50000 ? 'Pochi Km' : '';
      const colorHex = colorMap[car.colore] || '#888';

      return `
        <article class="car-card" onclick="window.open('${car.link}', '_blank')">
          <div class="car-card-image">
            ${badgeText ? `<span class="car-card-badge">${badgeText}</span>` : ''}
            <span class="car-card-color" style="background:${colorHex}" title="${car.colore}"></span>
            <img src="${car.foto}" alt="Alfa Romeo ${car.modello} ${car.anno} ${car.colore}" loading="lazy">
          </div>
          <div class="car-card-body">
            <div class="car-card-header">
              <h3 class="car-card-title">${car.modello}</h3>
              <span class="car-card-allestimento">${car.allestimento}</span>
            </div>
            <div class="car-card-specs">
              <span class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
                ${car.anno}
              </span>
              <span class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/><path d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
                ${kmFormatted} km
              </span>
              <span class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5.5 8.5l1.5-3h10l1.5 3H5.5zM18 4H6L3 10v9c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-9l-3-6z"/></svg>
                ${car.cv} CV &middot; ${car.trazione}
              </span>
              <span class="car-spec">
                <svg viewBox="0 0 24 24"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/></svg>
                ${car.carburante}
              </span>
            </div>
            <div class="car-card-footer">
              <div class="car-price">
                <span class="car-price-amount">&euro;${prezzoFormatted}</span>
                <span class="car-price-label">IVA inclusa</span>
              </div>
              <span class="car-card-cta">
                Dettagli
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    updateCount(cars.length);
    animateCards();
    initTiltEffect();
  }

  function updateCount(count) {
    const el = document.getElementById('resultsCount');
    if (el) el.textContent = `${count} Stelvio disponibil${count === 1 ? 'e' : 'i'}`;
  }

  // ===== STAGGER CARD ANIMATION =====
  function animateCards() {
    const cards = document.querySelectorAll('.car-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    });
  }

  // ===== 3D TILT EFFECT ON CARDS =====
  function initTiltEffect() {
    if (window.innerWidth < 768) return; // Skip on mobile

    document.querySelectorAll('.car-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s ease';
      });
    });
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
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.feature-card, .contatti-item, .review-highlight, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ===== STAT COUNTER =====
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.target;
        const isDecimal = target.includes('.');
        const targetNum = parseFloat(target);
        const duration = 2200;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = eased * targetNum;
          el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }

        requestAnimationFrame(update);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

  // ===== SMOOTH PAGE REVEAL =====
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
