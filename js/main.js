// Main JS: cart, menu category active, form handler
// Vanilla JS only

(function () {
  const state = {
    cart: {},
    cartCount: 0,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function updateCartBadge() {
    const badge = $('cart-badge');
    if (!badge) return;

    state.cartCount = Object.values(state.cart).reduce((s, i) => s + i.qty, 0);
    badge.textContent = String(state.cartCount);
    badge.style.display = state.cartCount > 0 ? 'flex' : 'none';
  }

  function parsePriceToNumber(priceText) {
    // handles "₹90 / ₹140" -> 90
    const m = String(priceText || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
  }

  window.addToCart = async function addToCart(btn) {
    const row = btn.closest('.price-row');
    if (!row) return;

    const nameEl = row.querySelector('.pr-name');
    const priceEl = row.querySelector('.pr-price');
    const name = (nameEl?.textContent || '').trim();
    const priceText = (priceEl?.textContent || '').trim();

    // Disable immediately to avoid double taps
    const prevDisabled = btn.disabled;
    btn.disabled = true;
    const prevOpacity = btn.style.opacity;
    btn.style.opacity = '0.6';

    try {
      const response = await simulateCartAPI({ name, price: priceText, qty: 1 });
      if (!response || !response.ok) {
        throw new Error('Server error');
      }

      if (state.cart[name]) {
        state.cart[name].qty += 1;
      } else {
        state.cart[name] = { qty: 1, price: priceText };
      }

      btn.textContent = '✓';
      btn.style.background = '#22C55E';
      btn.style.opacity = '1';
      showToast('🛒 ' + name + ' added!');
      updateCartBadge();

      setTimeout(() => {
        btn.textContent = '+';
        btn.style.background = '';
        btn.style.opacity = '1';
        btn.disabled = prevDisabled;
      }, 1200);
    } catch (err) {
      console.error('[addToCart] Failed:', err?.message || err);
      btn.textContent = '+';
      btn.style.background = '';
      btn.style.opacity = prevOpacity || '1';
      btn.disabled = prevDisabled;
      showToast('⚠️ Could not add item. Please try again.');
    }
  };

  function simulateCartAPI(item) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: true, status: 200, statusText: 'OK', item });
      }, 250);
    });
  }

  function showToast(msg) {
    const t = $('cart-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.transform = 'translateY(0)';
    t.style.opacity = '1';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      t.style.transform = 'translateY(80px)';
      t.style.opacity = '0';
    }, 2800);
  }

  window.openCartModal = function openCartModal() {
    const items = Object.keys(state.cart);
    if (!items.length) {
      showToast('🛒 Your cart is empty!');
      return;
    }

    let total = 0;
    const lines = items.map((name) => {
      const item = state.cart[name];
      const priceNum = parsePriceToNumber(item.price);
      const lineTotal = priceNum * item.qty;
      total += lineTotal;
      return name + ' x' + item.qty + ' = ₹' + lineTotal;
    });

    const waMsg = encodeURIComponent(
      'Hi! I want to order from Bhima Chinese Fast Food:\n\n' +
        lines.join('\n') +
        '\n\nTotal: ₹' + total
    );

    window.open('https://wa.link/1v4w39?text=' + waMsg, '_blank');
  };

  window.goTo = function goTo(id, btn) {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 90,
        behavior: 'smooth',
      });
    }

    document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.handleFormSubmit = function handleFormSubmit() {
    const name = ($('name')?.value || '').trim();
    const phone = ($('phone')?.value || '').trim();
    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }
    window.open('https://wa.link/1v4w39', '_blank');
  };

  // Keep the existing behavior: Active category on scroll
  const cats = ['soup', 'pavbhaji', 'rolls', 'tandoor', 'vegrice', 'chinese', 'thukpa', 'special', 'indian', 'momos', 'snacks', 'raita', 'shakes'];

  function updateActiveCategoryOnScroll() {
    let cur = cats[0];
    for (let i = 0; i < cats.length; i++) {
      const el = document.getElementById(cats[i]);
      if (el && window.scrollY >= el.offsetTop - 140) cur = cats[i];
    }
    const btns = document.querySelectorAll('.cat-btn');
    btns.forEach((b, i) => {
      // If button order matches cats order
      b.classList.toggle('active', cats[i] === cur);
    });
  }

  window.addEventListener('scroll', () => {
    updateActiveCategoryOnScroll();
  }, { passive: true });

  // Scroll reveal: uses [data-reveal] if present, falls back to .reveal
  function setupReveals() {
    const revealEls = document.querySelectorAll('[data-reveal], .reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07 });

    revealEls.forEach((el) => obs.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    setupReveals();
  });
})();


