/* Premium menu rendering + cart/toast + carousel + counters */

(function(){
  const STORAGE_KEY = 'bhiMachinesCart';

  // Keep cart logic (existing behavior concept) but modernized
  let cart = {};
  let cartCount = 0;

  // --- Menu data (preserve item names & prices from your existing HTML) ---
  const MENU = [
    // Soup
    { id:'manchow', category:'soup', name:'Manchow Soup', price:'₹80', desc:'Hot & savoury manchow-style soup.' },
    { id:'hns', category:'soup', name:'Hot N Sour Soup', price:'₹80', desc:'Zesty hot and sour bowl.' },
    { id:'tomato', category:'soup', name:'Tomato Soup', price:'₹80', desc:'Classic tomato comfort soup.' },
    { id:'clear', category:'soup', name:'Veg Clear Soup', price:'₹80', desc:'Light clear broth with veg goodness.' },
    { id:'sweetcorn', category:'soup', name:'Veg Sweet Corn Soup', price:'₹90', desc:'Sweet corn blended with flavours.' },
    { id:'mushroom', category:'soup', name:'Mushroom Veg Soup', price:'₹110', desc:'Mushrooms with veg in a rich broth.' },

    // Pav Bhaji
    { id:'pavbhaji', category:'pavbhaji', name:'Pav Bhaji', price:'₹100', desc:'Spiced bhaji with soft pav.' },
    { id:'paneer-pav', category:'pavbhaji', name:'Paneer Pav Bhaji', price:'₹140', desc:'Creamy paneer bhaji with pav.' },
    { id:'cheese-pav', category:'pavbhaji', name:'Cheese Pav Bhaji', price:'₹150', desc:'Cheesy bhaji served with pav.' },
    { id:'extra-pav', category:'pavbhaji', name:'Extra Pav', price:'₹25', desc:'Add extra pav.' },
    { id:'extra-bhaji', category:'pavbhaji', name:'Extra Bhaji', price:'₹30', desc:'Add extra bhaji.' },

    // Rolls
    { id:'veg-roll', category:'rolls', name:'Veg Roll', price:'₹90', desc:'Crispy veg roll.' },
    { id:'paneer-roll', category:'rolls', name:'Paneer Roll', price:'₹130', desc:'Paneer-stuffed roll.' },
    { id:'manch-roll', category:'rolls', name:'Manchurian Roll', price:'₹140', desc:'Manchurian flavours in a roll.' },
    { id:'crispy-roll', category:'rolls', name:'Crispy Roll', price:'₹100', desc:'Extra crunchy roll.' },
    { id:'rice-roll', category:'rolls', name:'Rice Roll', price:'₹110', desc:'Ricey, delicious roll.' },
    { id:'veg-cheese-roll', category:'rolls', name:'Veg Cheese Roll', price:'₹140', desc:'Veg + cheese goodness.' },
    { id:'veg-mush-roll', category:'rolls', name:'Veg Mushroom Roll', price:'₹160', desc:'Mushroom loaded roll.' },
    { id:'mush-paneer-roll', category:'rolls', name:'Mushroom Paneer Roll', price:'₹160', desc:'Mushroom & paneer together.' },
    { id:'mush-cheese-roll', category:'rolls', name:'Mushroom Cheese Roll', price:'₹170', desc:'Mushroom with cheese kick.' },

    // Tandoor
    { id:'tandoori-momos', category:'tandoor', name:'Tandoori Momos (8 Pcs)', price:'₹150', desc:'Smoky tandoori momos.' },
    { id:'paneer-tikka', category:'tandoor', name:'Paneer Tikka (8 Pcs)', price:'₹180', desc:'Tandoori paneer tikka.' },
    { id:'mush-tikka', category:'tandoor', name:'Mushroom Tikka (8 Pcs)', price:'₹210', desc:'Smoky mushroom tikka.' },

    // Veg Rice
    { id:'veg-biryani', category:'vegrice', name:'Veg Biryani', price:'₹140', desc:'Veg biryani with bold flavour.' },
    { id:'manch-biryani', category:'vegrice', name:'Manchurian Biryani', price:'₹150', desc:'Manchurian biryani comfort.' },
    { id:'fried-rice', category:'vegrice', name:'Fried Rice', price:'₹150', desc:'Classic fried rice.' },
    { id:'hakka-rice', category:'vegrice', name:'Hakka Rice', price:'₹140', desc:'Hakka-style rice goodness.' },
    { id:'paneer-rice', category:'vegrice', name:'Paneer Rice', price:'₹150', desc:'Paneer rice, rich & satisfying.' },
    { id:'paneer-cheese-rice', category:'vegrice', name:'Paneer Cheese Rice', price:'₹160', desc:'Cheesy paneer rice.' },
    { id:'bhima-fried-rice', category:'vegrice', name:'⭐ Bhima Special Fried Rice', price:'₹190', desc:'Chef special fried rice.' },
    { id:'schezwan-rice', category:'vegrice', name:'Schezwan Rice', price:'₹140', desc:'Spicy schezwan rice.' },
    { id:'mushroom-fried-rice', category:'vegrice', name:'Mushroom Fried Rice', price:'₹160', desc:'Mushroom loaded fried rice.' },

    // Chinese - Noodles & More
    { id:'veg-hakka-noodles', category:'chinese', name:'Veg Hakka Noodles', price:'₹90 / ₹140', desc:'Hakka noodles, stir-fried to perfection.' },
    { id:'veg-noodles', category:'chinese', name:'Veg Noodles', price:'₹90 / ₹140', desc:'Veg noodles with a delicious sauce.' },
    { id:'crispy-noodles', category:'chinese', name:'Crispy Noodles', price:'₹90 / ₹140', desc:'Crunchy crispy noodles.' },
    { id:'schezwan-noodles', category:'chinese', name:'Schezwan Noodles', price:'₹90 / ₹140', desc:'Schezwan zing in noodles.' },
    { id:'noodles-manchurian', category:'chinese', name:'Noodles Manchurian', price:'₹100 / ₹150', desc:'Manchurian noodles.' },
    { id:'manchurian-dry', category:'chinese', name:'Manchurian Dry', price:'₹90 / ₹140', desc:'Dry manchurian style noodles.' },
    { id:'manchurian-gravy', category:'chinese', name:'Manchurian Gravy', price:'₹90 / ₹140', desc:'Manchurian gravy noodles.' },
    { id:'veg-combo', category:'chinese', name:'Veg Combo', price:'₹150', desc:'Veg combo for a full flavour experience.' },
    { id:'tomato-pasta', category:'chinese', name:'Tomato Red Pasta', price:'₹90 / ₹140', desc:'Tomato red pasta with bold taste.' },
    { id:'mush-hakka', category:'chinese', name:'Mushroom Hakka Noodles', price:'₹150', desc:'Mushroom + hakka magic.' },
    { id:'mush-combo', category:'chinese', name:'Mushroom Combo', price:'₹160', desc:'Mushroom combo for cravings.' },
    { id:'veg-kothe', category:'chinese', name:'Veg Kothe', price:'₹140', desc:'Veg kothe delight.' },

    // Thukpa
    { id:'veg-thukpa', category:'thukpa', name:'Veg Thukpa', price:'₹140', desc:'Warm veg thukpa.' },
    { id:'paneer-thukpa', category:'thukpa', name:'Paneer Thukpa', price:'₹150', desc:'Paneer thukpa, comforting bowl.' },
    { id:'paneer-pasta-thukpa', category:'thukpa', name:'Paneer Pasta Thukpa', price:'₹160', desc:'Paneer pasta thukpa twist.' },
    { id:'corn-veg-thukpa', category:'thukpa', name:'Corn Veg Thukpa', price:'₹160', desc:'Corn veg thukpa with flavour.' },
    { id:'crispy-thukpa', category:'thukpa', name:'Crispy Thukpa', price:'₹150', desc:'Crispy crunch in thukpa.' },
    { id:'mush-paneer-thukpa', category:'thukpa', name:'Mushroom Paneer Thukpa', price:'₹160', desc:'Mushroom paneer thukpa.' },
    { id:'mush-cheese-thukpa', category:'thukpa', name:'Mushroom Cheese Thukpa', price:'₹160', desc:'Cheesy mushroom thukpa.' },
    { id:'bhima-special-thukpa', category:'thukpa', name:'⭐ Bhima Special Thukpa', price:'₹180', desc:'Chef special thukpa, spicy & rich.' },

    // Special Chinese
    { id:'chilli-garlic-hakka', category:'special', name:'Chilli Garlic Hakka Noodles', price:'₹140', desc:'Chilli garlic hakka noodles.' },
    { id:'chilli-garlic-fried-rice', category:'special', name:'Chilli Garlic Fried Rice', price:'₹140', desc:'Chilli garlic fried rice.' },
    { id:'white-cheese-pasta', category:'special', name:'White Cheese Pasta', price:'₹160', desc:'Creamy white cheese pasta.' },
    { id:'red-cheese-pasta', category:'special', name:'Red Cheese Pasta', price:'₹150', desc:'Tangy red cheese pasta.' },
    { id:'finger-chips', category:'special', name:'Finger Chips', price:'₹120', desc:'Crispy finger chips.' },
    { id:'potato-chilli-dry', category:'special', name:'Potato Chilli Dry', price:'₹140', desc:'Chilli potato dry.' },
    { id:'potato-65', category:'special', name:'Potato 65', price:'₹140', desc:'Potato 65, spicy bites.' },
    { id:'paneer-65', category:'special', name:'Paneer 65', price:'₹160', desc:'Paneer 65, crunchy & hot.' },
    { id:'paneer-soya-chilli', category:'special', name:'Paneer Soya Chilli', price:'₹150', desc:'Paneer soya chilli.' },
    { id:'crispy-corn', category:'special', name:'Crispy Corn', price:'₹150', desc:'Crispy corn snack.' },
    { id:'paneer-chilli-dry-gravy', category:'special', name:'Paneer Chilli Dry / Gravy', price:'₹180', desc:'Paneer chilli dry or gravy.' },
    { id:'cheese-dry-manchurian', category:'special', name:'Cheese Dry Manchurian', price:'₹170', desc:'Cheese dry manchurian.' },
    { id:'veg-cheese-combo', category:'special', name:'Veg Cheese Combo', price:'₹180', desc:'Veg cheese combo.' },
    { id:'paneer-cheese-combo', category:'special', name:'Paneer Cheese Combo', price:'₹180', desc:'Paneer cheese combo.' },

    // Indian
    { id:'paneer-butter', category:'indian', name:'Paneer Butter Masala', price:'₹180 / ₹250', desc:'Butter masala with paneer.' },
    { id:'kadai-paneer', category:'indian', name:'Kadai Paneer', price:'₹190 / ₹260', desc:'Kadai paneer, rich & aromatic.' },
    { id:'chole', category:'indian', name:'Chole Masala', price:'₹160 / ₹220', desc:'Chole masala with bold spices.' },
    { id:'mutter-paneer', category:'indian', name:'Mutter Paneer Gravy', price:'₹180 / ₹250', desc:'Mutter paneer gravy.' },
    { id:'paneer-bhurji-dry', category:'indian', name:'Paneer Bhurji Dry', price:'₹260', desc:'Dry bhurji style paneer.' },
    { id:'paneer-bhurji-gravy', category:'indian', name:'Paneer Bhurji Gravy', price:'₹260', desc:'Gravy style paneer bhurji.' },

    // Breads (Indian category)
    { id:'tawa-roti', category:'indian', name:'Tawa Roti', price:'₹10', desc:'Soft tawa roti.' },
    { id:'tandoori-roti', category:'indian', name:'Tandoori Roti', price:'₹20', desc:'Tandoori roti.' },
    { id:'plain-naan', category:'indian', name:'Plain Naan', price:'₹25', desc:'Plain naan.' },
    { id:'butter-naan', category:'indian', name:'Butter Naan', price:'₹45', desc:'Butter naan.' },
    { id:'garlic-naan', category:'indian', name:'Garlic Naan', price:'₹70', desc:'Garlic naan.' },
    { id:'chur-chur-naan', category:'indian', name:'Chur-Chur Naan', price:'₹80', desc:'Chur-chur naan.' },

    // Combos (Indian category)
    { id:'chole-kulche', category:'indian', name:'Chole Kulche', price:'₹180', desc:'Chole kulche combo.' },
    { id:'butter-paneer-kulche', category:'indian', name:'Butter Paneer Kulche', price:'₹220', desc:'Butter paneer kulche.' },
    { id:'chole-paneer-kulche', category:'indian', name:'Chole + Paneer Kulche', price:'₹250', desc:'Chole + paneer kulche.' },

    // Momos
    { id:'jhol-momos', category:'momos', name:'Jhol Momos (8 Pcs)', price:'₹140', desc:'Jhol momos, spicy & steamed.' },
    { id:'jhol-fried-momos', category:'momos', name:'Jhol Fried Momos (8 Pcs)', price:'₹150', desc:'Jhol fried momos.' },
    { id:'steam-momos', category:'momos', name:'Steam Momos (8 Pcs)', price:'₹90', desc:'Classic steam momos.' },
    { id:'fried-momos', category:'momos', name:'Fried Momos (8 Pcs)', price:'₹110', desc:'Crispy fried momos.' },

    // Snacks
    { id:'mush-chilli', category:'snacks', name:'Mushroom Chilli Dry / Gravy', price:'₹180', desc:'Mushroom chilli dry/gravy.' },
    { id:'chana-chilli', category:'snacks', name:'Chana Chilli Dry', price:'₹180', desc:'Chana chilli dry.' },
    { id:'soya-chilli', category:'snacks', name:'Soya Chilli', price:'₹140', desc:'Soya chilli.' },
    { id:'bhima-mush-combo', category:'snacks', name:'⭐ Bhima Special Mushroom Combo', price:'₹190', desc:'Chef special mushroom combo.' },
    { id:'hara-bhara-kabab', category:'snacks', name:'Hara Bhara Kabab (10 Pcs)', price:'₹180', desc:'Hara bhara kababs.' },
    { id:'veg-cutlet', category:'snacks', name:'Veg Cutlet (2 Pcs)', price:'₹140', desc:'Crispy veg cutlets.' },
    { id:'paneer-pakoda', category:'snacks', name:'Paneer Pakoda (8 Pcs)', price:'₹190', desc:'Paneer pakoda.' },
    { id:'veg-pakoda', category:'snacks', name:'Veg Pakoda (1 Plate)', price:'₹170', desc:'Veg pakoda plate.' },
    { id:'chole-bhature', category:'snacks', name:'Chole Bhature (2 Pcs)', price:'₹120', desc:'Chole bhature 2 pcs.' },

    // Raita
    { id:'curd-plain', category:'raita', name:'Curd Plain', price:'₹60', desc:'Plain curd.' },
    { id:'mix-raita', category:'raita', name:'Mix Raita', price:'₹80', desc:'Mixed veg raita.' },
    { id:'tomato-raita', category:'raita', name:'Tomato Raita', price:'₹80', desc:'Tomato raita.' },
    { id:'cucumber-raita', category:'raita', name:'Cucumber Raita', price:'₹80', desc:'Cool cucumber raita.' },
    { id:'bhima-raita', category:'raita', name:'⭐ Bhima Special Raita', price:'₹120', desc:'Chef special raita.' },

    // Shakes
    { id:'cold-coffee', category:'shakes', name:'Cold Coffee', price:'₹120', desc:'Chilled cold coffee.' },
    { id:'choco-shake', category:'shakes', name:'Chocolate Shake', price:'₹130', desc:'Chocolate shake.' },
    { id:'icecream-shake', category:'shakes', name:'Ice Cream Shake', price:'₹140', desc:'Ice cream shake.' },
    { id:'vanilla-shake', category:'shakes', name:'Vanilla Shake', price:'₹130', desc:'Vanilla shake.' },
    { id:'strawberry-shake', category:'shakes', name:'Strawberry Shake', price:'₹120', desc:'Strawberry shake.' },
    { id:'butterscotch-shake', category:'shakes', name:'Butterscotch Shake', price:'₹130', desc:'Butterscotch shake.' },
    { id:'oreo-shake', category:'shakes', name:'Oreo Shake', price:'₹130', desc:'Oreo shake.' },
    { id:'namkeen-chaach', category:'shakes', name:'Namkeen Chaach', price:'₹50', desc:'Namkeen chaach.' },
    { id:'sweet-chaach', category:'shakes', name:'Sweet Chaach', price:'₹50', desc:'Sweet chaach.' },
  ];

  // Category map to filter buttons
  const filterButtons = () => Array.from(document.querySelectorAll('.filter-btn'));

  // Render menu cards
  const menuGrid = document.getElementById('menuGrid');

  // Cards were using per-category images earlier; now we render text-only.
  const categoryCardsImage = () => '';

  function cardHtml(item){
    const img = categoryCardsImage(item.category);
    return `
      <article class="menu-card" data-category="${item.category}">
        <div class="flip">
          <div class="face face--front">
            <div class="front-body">
              <h3 class="menu-item-title">${escapeHtml(item.name)}</h3>
              <div class="menu-item-meta">Freshly prepared • Premium veg fast food</div>
            </div>
          </div>


          <div class="face face--back">
            <div class="back-body">
              <div class="price-tag">
                <span style="font-weight:1000;color:rgba(255,255,255,.85)">Price</span>
                <strong>${escapeHtml(item.price)}</strong>
              </div>
              <div class="back-desc">${escapeHtml(item.desc)}</div>
              <button class="add-btn" type="button" aria-label="Add ${escapeHtml(item.name)} to order" data-item-id="${escapeAttr(item.id)}">
                <i class="fa-solid fa-plus" aria-hidden="true"></i> Add to Order
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'<','>':'>','"':'"',"'":'&#039;'}[s]));
  }
  function escapeAttr(str){
    return escapeHtml(str).replace(/\s+/g,' ');
  }

  function loadCart(){
    try{ cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch{ cart = {}; }
  }
  function saveCart(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch{}
  }

  function cartCountFromState(){
    return Object.values(cart).reduce((sum, line) => sum + (line.qty || 0), 0);
  }

  function showToast(msg){
    const t = document.getElementById('cart-toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('is-show');
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(()=>t.classList.remove('is-show'), 2600);
  }

  function addToCartById(id){
    const item = MENU.find(x => x.id === id);
    if(!item) return;
    if(cart[item.name]){ cart[item.name].qty += 1; }
    else{ cart[item.name] = { qty:1, price:item.price, item:item.name }; }
    saveCart();
    const count = cartCountFromState();
    showToast('🛒 ' + item.name + ' added!');
    // also open cart modal? Keeping lightweight: order via WhatsApp when user submits form or clicks CTA.
    return count;
  }

  function renderMenu(){
    if(!menuGrid) return;
    const html = MENU.map(cardHtml).join('');
    menuGrid.innerHTML = html;

    // Bind add buttons
    menuGrid.querySelectorAll('.add-btn').forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-item-id');
        addToCartById(id);
      });
    });
  }

  // Filtering
  function setActiveFilter(target){
    filterButtons().forEach(b => b.classList.toggle('is-active', b === target));
  }

  function applyFilter(category){
    if(!menuGrid) return;
    const cards = Array.from(menuGrid.querySelectorAll('.menu-card'));
    cards.forEach(card =>{
      const c = card.getAttribute('data-category');
      const show = category === 'all' ? true : c === category;
      card.style.display = show ? '' : 'none';
    });
  }

  function bindFilters(){
    const btns = filterButtons();
    btns.forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        const filter = btn.getAttribute('data-filter') || 'all';
        setActiveFilter(btn);
        applyFilter(filter);
      });
    });
  }

  // Testimonials carousel
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsWrap = document.getElementById('testimonialDots');
  let current = 0;
  function initCarousel(){
    if(!track) return;
    const slides = Array.from(track.querySelectorAll('.review-card'));
    if(!slides.length) return;

    // Build dots
    if(dotsWrap){
      dotsWrap.innerHTML = '';
      slides.forEach((_, i)=>{
        const d = document.createElement('button');
        d.type='button';
        d.className = 'dot-btn' + (i===0 ? ' is-active' : '');
        d.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
        d.addEventListener('click', ()=>setSlide(i));
        dotsWrap.appendChild(d);
      });
    }

    function setSlide(i){
      current = (i + slides.length) % slides.length;
      slides.forEach((s, idx)=>s.classList.toggle('is-active', idx===current));
      if(dotsWrap){
        Array.from(dotsWrap.querySelectorAll('.dot-btn')).forEach((d, idx)=>{
          d.classList.toggle('is-active', idx===current);
        });
      }
    }

    prevBtn && prevBtn.addEventListener('click', ()=>setSlide(current-1));
    nextBtn && nextBtn.addEventListener('click', ()=>setSlide(current+1));

    // Auto
    window.setInterval(()=>setSlide(current+1), 5200);
  }

  // Stats counters
  function animateCounter(el, target, decimals){
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now){
      const p = Math.min(1, (now - startTime)/duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = start + (target - start)*eased;
      const out = decimals ? val.toFixed(decimals) : Math.round(val).toString();
      el.textContent = out;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function bindCounters(){
    const counters = document.querySelectorAll('[data-counter]');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting && entry.target && !entry.target.dataset.done){
          entry.target.dataset.done = '1';
          const raw = entry.target.getAttribute('data-counter');
          const decimals = parseInt(entry.target.getAttribute('data-counter-decimals') || '0', 10);
          const target = parseFloat(raw);
          animateCounter(entry.target, target, decimals);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => io.observe(c));
  }

  // Contact form -> WhatsApp with message
  function bindContactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = (document.getElementById('name')?.value || '').trim();
      const phone = (document.getElementById('phone')?.value || '').trim();
      const enquiry = document.getElementById('enquiry')?.value || 'order';
      const message = (document.getElementById('message')?.value || '').trim();
      if(!name || !phone){
        showToast('⚠️ Please enter your name and phone.');
        return;
      }

      const waText = encodeURIComponent(
        `Hi BhiMachines Fast Food!%0A%0A` +
        `Name: ${name}%0A` +
        `Phone: ${phone}%0A` +
        `Enquiry: ${enquiry}%0A%0A` +
        `Message: ${message || '(No message)'}%0A`
      );

      // Uses the same phone/chat link as your original site
      window.open('https://wa.link/1v4w39?text=' + waText, '_blank');
      form.reset();
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', ()=>{
    loadCart();
    renderMenu();
    bindFilters();
    initCarousel();
    bindCounters();
    bindContactForm();
  });

})();

