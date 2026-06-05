// js/animations.js
// 3D hero tilt, parallax, scroll reveals, counters, testimonial carousel, particles.
// Vanilla JS only.

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  // ---- HERO TILT (rotateX/rotateY on mousemove) ----
  function setupHeroTilt() {
    if (prefersReduced) return;

    const tiltEl = $('#hero-tilt');
    const foodImg = $('#hero-tilt .hero-food');
    if (!tiltEl || !foodImg) return;

    let rafId = null;
    const state = { x: 0, y: 0 };

    function apply() {
      rafId = null;
      const rect = tiltEl.getBoundingClientRect();
      const px = (state.x - rect.left) / rect.width; // 0..1
      const py = (state.y - rect.top) / rect.height; // 0..1

      const rotateY = (px - 0.5) * 18; // -9..9
      const rotateX = -(py - 0.5) * 14; // -7..7

      tiltEl.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      foodImg.style.transform = `translateZ(60px) translateY(0px)`;
    }

    function onMove(e) {
      state.x = e.clientX;
      state.y = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    function onLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      tiltEl.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }

    tiltEl.addEventListener('mousemove', onMove, { passive: true });
    tiltEl.addEventListener('mouseleave', onLeave);
    tiltEl.style.willChange = 'transform';
  }

  // ---- PARALLAX BACKGROUND ----
  function setupParallax() {
    if (prefersReduced) return;

    const heroBg = $('.hero-bg');
    if (!heroBg) return;

    let lastY = 0;
    function onScroll() {
      lastY = window.scrollY || 0;
      const offset = Math.min(180, Math.max(-40, lastY * 0.08));
      heroBg.style.transform = `translateY(${offset}px)`;
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- COUNTER ANIMATION ----
  function setupCounters() {
    const counterEls = $$('.js-counter');
    if (!counterEls.length) return;
    if (!('IntersectionObserver' in window)) {
      counterEls.forEach((el) => {
        const to = parseFloat(el.getAttribute('data-to') || '0');
        const type = el.getAttribute('data-format') || 'number';
        el.textContent = formatCount(to, type);
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);
          animateCounter(el);
        });
      },
      { threshold: 0.35 }
    );

    counterEls.forEach((el) => obs.observe(el));
  }

  function formatCount(to, type) {
    if (type === 'plus') return `${Math.round(to)}+`;
    if (type === 'star') {
      // to expected like 4.8 or 5
      const fixed = (to % 1 !== 0) ? to.toFixed(1) : String(to);
      return `${fixed}★`;
    }
    return `${Math.round(to)}`;
  }

  function animateCounter(el) {
    const to = parseFloat(el.getAttribute('data-to') || '0');
    const type = el.getAttribute('data-format') || 'number';
    const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);

    const start = 0;
    const startTs = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = start + (to - start) * eased;
      el.textContent = type === 'number' ? `${Math.round(cur)}` : formatCount(cur, type);
      if (t < 1) requestAnimationFrame(tick);
    }

    if (prefersReduced) {
      el.textContent = formatCount(to, type);
      return;
    }

    requestAnimationFrame(tick);
  }

  // ---- TESTIMONIAL CAROUSEL ----
  function setupCarousel() {
    const carousel = $('#testimonials-carousel');
    if (!carousel) return;

    const track = $('.carousel-track', carousel);
    if (!track) return;

    const slides = $$('.testimonial', carousel);
    if (!slides.length) return;

    let index = 0;
    const intervalMs = parseInt(carousel.getAttribute('data-interval') || '4200', 10);

    function go(i) {
      index = i;
      track.style.transform = `translateX(${-index * 100}%)`;
    }

    // initial
    go(0);

    if (!prefersReduced) {
      setInterval(() => {
        const next = (index + 1) % slides.length;
        go(next);
      }, intervalMs);
      return;
    }
  }

  // ---- FLOATING PARTICLES IN HERO ----
  function setupParticles() {
    if (prefersReduced) return;

    const holder = $('#hero-particles');
    if (!holder) return;

    const count = parseInt(holder.getAttribute('data-count') || '16', 10);

    // Deterministic-ish randomness
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const x0 = Math.round(Math.random() * 100);
      const y0 = Math.round(Math.random() * 100);
      const x1 = Math.round((Math.random() * 100) - 50);
      const y1 = Math.round((Math.random() * 100) - 50);

      p.style.left = `${x0}%`;
      p.style.top = `${y0}%`;

      const dur = (2.8 + Math.random() * 2.6).toFixed(2) + 's';
      p.style.setProperty('--dur', dur);
      p.style.setProperty('--x0', '0px');
      p.style.setProperty('--y0', '0px');
      p.style.setProperty('--x1', `${x1}px`);
      p.style.setProperty('--y1', `${y1}px`);

      const size = 7 + Math.random() * 10;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      holder.appendChild(p);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupHeroTilt();
    setupParallax();
    setupCounters();
    setupCarousel();
    setupParticles();
  });
})();

