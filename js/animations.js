/* Scroll reveal, navbar blur, hero tilt, parallax, particles, typewriter */

(function(){
  // IntersectionObserver reveals (supports .reveal)
  function initReveal(){
    const els = Array.from(document.querySelectorAll('.reveal'));
    if(!els.length) return;

    const io = new IntersectionObserver((entries)=>{
      entries.forEach((e)=>{
        if(e.isIntersecting){
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el=>io.observe(el));
  }

  // Navbar scroll effect (adds class on header nav)
  function initNavbarScroll(){
    const nav = document.querySelector('.nav');
    if(!nav) return;

    const onScroll = ()=>{
      if(window.scrollY > 10) nav.classList.add('nav--scrolled');
      else nav.classList.remove('nav--scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  // Hero tilt
  function initHeroTilt(){
    const tilt = document.getElementById('heroTilt');
    const inner = document.getElementById('heroTiltInner');
    if(!tilt || !inner) return;

    // Reduced motion
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e)=>{
      const rect = tilt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      const rotY = (x - 0.5) * 18; // left/right
      const rotX = -(y - 0.5) * 12; // up/down
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };

    const onLeave = ()=>{ inner.style.transform = 'rotateX(0deg) rotateY(0deg)'; };

    tilt.addEventListener('mousemove', onMove);
    tilt.addEventListener('mouseleave', onLeave);
  }

  // Hero parallax background
  function initParallax(){
    const bg = document.querySelector('.hero-bg');
    if(!bg) return;
    const onScroll = ()=>{
      const y = window.scrollY || 0;
      bg.style.transform = `translate3d(0, ${Math.min(60, y*0.08)}px, 0)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  // Typewriter in hero
  function initTypewriter(){
    const textEl = document.querySelector('.hero-type__text');
    if(!textEl) return;

    const phrases = ['Fresh & Fiery', 'Made to Order', 'Hot & Clean', 'Premium Veg Fast Food'];
    let idx = 0;
    let char = 0;
    let deleting = false;
    const speed = 52;
    const deleteSpeed = 28;

    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    textEl.innerHTML = '';
    const caret = document.createElement('span');
    caret.className = 'typewriter-caret';
    caret.textContent = '|';
    caret.setAttribute('aria-hidden', 'true');

    function step(){
      const current = phrases[idx];
      if(!deleting){
        char++;
        textEl.textContent = current.slice(0, char);
        if(char >= current.length){
          deleting = true;
          setTimeout(step, 1100);
          return;
        }
        setTimeout(step, speed);
      } else {
        char--;
        textEl.textContent = current.slice(0, char);
        if(char <= 0){
          deleting = false;
          idx = (idx + 1) % phrases.length;
          setTimeout(step, 300);
          return;
        }
        setTimeout(step, deleteSpeed);
      }
    }

    // If caret markup isn’t present, append it
    textEl.appendChild(document.createTextNode(''));
    step();
  }

  // Particles: distribute random positions/animations
  function initParticles(){
    const particles = Array.from(document.querySelectorAll('.particle'));
    if(!particles.length) return;
    const hero = document.querySelector('.hero-visual');
    if(!hero) return;

    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      particles.forEach(p=>p.style.display='none');
      return;
    }

    particles.forEach((p, i)=>{
      const left = Math.random()*90;
      const top = Math.random()*70;
      const dur = (4 + Math.random()*5).toFixed(2) + 's';
      const dx = (15 + Math.random()*50).toFixed(0) + 'px';
      const dy = (-60 - Math.random()*110).toFixed(0) + 'px';
      p.style.left = left + '%';
      p.style.top = top + '%';
      p.style.setProperty('--dur', dur);
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.animationDelay = (Math.random()*2.5).toFixed(2) + 's';
    });
  }

  // Mobile drawer
  function initMobileDrawer(){
    const btn = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('mobileDrawer');
    if(!btn || !drawer) return;

    const open = ()=>{
      drawer.classList.add('is-open');
      btn.setAttribute('aria-expanded','true');
    };
    const close = ()=>{
      drawer.classList.remove('is-open');
      btn.setAttribute('aria-expanded','false');
    };

    btn.addEventListener('click', ()=>{
      const isOpen = drawer.classList.contains('is-open');
      isOpen ? close() : open();
    });

    drawer.addEventListener('click', (e)=>{
      if(e.target === drawer) close();
    });

    drawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>close());
    });
  }

  // About parallax (simple)
  function initAboutParallax(){
    const nodes = document.querySelectorAll('[data-parallax]');
    if(!nodes.length) return;
    const onScroll = ()=>{
      const y = window.scrollY || 0;
      nodes.forEach(n=>{
        n.style.transform = `translate3d(0, ${Math.min(40, y*0.03)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initReveal();
    initNavbarScroll();
    initHeroTilt();
    initParallax();
    initParticles();
    initTypewriter();
    initMobileDrawer();
    initAboutParallax();
  });

})();

