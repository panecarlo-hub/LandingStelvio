document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM CURSOR =====
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      cursorDot.style.transform = 'translate(-50%, -50%)';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .car-card, .filter-btn, .carousel-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ===== PARTICLES CANVAS =====
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.gold = Math.random() > 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.gold
          ? `rgba(184, 146, 74, ${this.opacity})`
          : `rgba(160, 140, 120, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(184, 146, 74, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

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

  // ===== HERO COUNTER ANIMATION =====
  const heroCounter = document.querySelector('.hero-counter-number');
  if (heroCounter) {
    let current = 0;
    const target = 17;
    const duration = 2000;
    const start = performance.now();

    function countUp(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      current = Math.floor(eased * target);
      heroCounter.textContent = current;
      if (progress < 1) requestAnimationFrame(countUp);
      else heroCounter.textContent = target;
    }
    setTimeout(() => requestAnimationFrame(countUp), 1200);
  }

  // ===== LOAD CARS & CAROUSEL =====
  let allCars = [];
  let filteredCars = [];
  let currentFilter = 'tutti';
  let currentSlide = 0;

  const colorMap = {
    'Grigio': '#8A8A8A',
    'Nero': '#2A2A2A',
    'Rosso': '#B5232E',
    'Bianco': '#E8E8E8',
    'Blu': '#3A4F7A'
  };

  fetch('stelvio.json')
    .then(res => res.json())
    .then(data => {
      allCars = data;
      filteredCars = [...allCars];
      buildCarousel();
    });

  function buildCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track) return;

    // Build slides
    track.innerHTML = filteredCars.map((car, i) => {
      const kmFormatted = car.km.toLocaleString('it-IT');
      const prezzoFormatted = car.prezzo.toLocaleString('it-IT');
      const badgeText = car.km < 10000 ? 'Quasi Nuova' : car.km < 50000 ? 'Pochi Km' : '';
      const colorHex = colorMap[car.colore] || '#888';
      const waMsg = encodeURIComponent(`Ciao, sono interessato alla ${car.modello} ${car.allestimento} del ${car.anno}, ${car.colore}, ${kmFormatted} km a \u20AC${prezzoFormatted}. \u00C8 ancora disponibile?`);
      const waLink = `https://wa.me/393284120553?text=${waMsg}`;

      return `
        <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
          <article class="car-card" data-wa="${waLink}">
            <div class="car-card-glow"></div>
            <div class="car-card-image">
              ${badgeText ? `<span class="car-card-badge">${badgeText}</span>` : ''}
              <span class="car-card-color" style="background:${colorHex}" title="${car.colore}"></span>
              <img src="${car.foto}" alt="Alfa Romeo ${car.modello} ${car.anno}" loading="lazy">
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Info
                </span>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = filteredCars.map((_, i) =>
        `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`
      ).join('');

      dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
      });
    }

    updateCounter();
    updateSlideClasses();
    initCardInteractions();
    initSwipe();
  }

  function goToSlide(index) {
    if (index < 0) index = filteredCars.length - 1;
    if (index >= filteredCars.length) index = 0;
    currentSlide = index;

    const track = document.getElementById('carouselTrack');
    const slideWidth = track.querySelector('.carousel-slide').offsetWidth;
    const containerWidth = track.parentElement.offsetWidth;
    const offset = (containerWidth / 2) - (slideWidth / 2) - (currentSlide * slideWidth);
    track.style.transform = `translateX(${offset}px)`;

    updateSlideClasses();
    updateCounter();
    updateDots();
  }

  function updateSlideClasses() {
    document.querySelectorAll('.carousel-slide').forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next', 'far');
      const diff = i - currentSlide;
      if (diff === 0) slide.classList.add('active');
      else if (diff === -1 || (currentSlide === 0 && i === filteredCars.length - 1)) slide.classList.add('prev');
      else if (diff === 1 || (currentSlide === filteredCars.length - 1 && i === 0)) slide.classList.add('next');
      else slide.classList.add('far');
    });
  }

  function updateCounter() {
    const counter = document.getElementById('carouselCounter');
    if (counter) counter.innerHTML = `<span>${currentSlide + 1}</span> / ${filteredCars.length}`;
  }

  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // ===== CAROUSEL CONTROLS =====
  document.getElementById('prevBtn')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('nextBtn')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  // ===== SWIPE SUPPORT =====
  function initSwipe() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    let startX = 0, isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  // ===== CARD INTERACTIONS =====
  function initCardInteractions() {
    // Card click → WhatsApp
    document.querySelectorAll('.car-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Ripple effect
        const cta = card.querySelector('.car-card-cta');
        if (cta) {
          const ripple = document.createElement('span');
          ripple.classList.add('ripple');
          const rect = cta.getBoundingClientRect();
          ripple.style.width = ripple.style.height = '20px';
          ripple.style.left = (e.clientX - rect.left) + 'px';
          ripple.style.top = (e.clientY - rect.top) + 'px';
          cta.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        }

        setTimeout(() => {
          const waLink = card.dataset.wa;
          if (waLink) window.open(waLink, '_blank');
        }, 200);
      });

      // Glow follow mouse
      const glow = card.querySelector('.car-card-glow');
      if (glow) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          glow.style.left = (e.clientX - rect.left) + 'px';
          glow.style.top = (e.clientY - rect.top) + 'px';
        });
      }
    });
  }

  // ===== FILTERS =====
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentSlide = 0;

      if (currentFilter === 'tutti') filteredCars = [...allCars];
      else filteredCars = allCars.filter(car => car.allestimento.toLowerCase() === currentFilter);

      buildCarousel();
      goToSlide(0);
    });
  });

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
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
          el.textContent = isDecimal ? (eased * targetNum).toFixed(2) : Math.floor(eased * targetNum);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

  // ===== PARALLAX HERO =====
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImg = document.querySelector('.hero-car-wrapper');
    const heroContent = document.querySelector('.hero-content');
    if (heroImg && scrolled < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrolled * 0.15}px)`;
      heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
      heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
  });

  // ===== INITIAL CAROUSEL POSITION =====
  setTimeout(() => goToSlide(0), 100);

  // ===== SMOOTH PAGE REVEAL =====
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
