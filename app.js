/**
 * ShopWave — Loja Virtual
 * Autor: [Seu Nome]
 * Tecnologias: HTML, CSS, JavaScript Vanilla
 * Dados: data.js (simulação de API)
 */

// ─── Estado ──────────────────────────────────────────────────
const state = {
  cart: JSON.parse(localStorage.getItem('shopwave_cart')) || [],
  filter: 'all',
  sort: 'default',
  query: '',
};

// ─── DOM ─────────────────────────────────────────────────────
const grid        = document.getElementById('products-grid');
const noResults   = document.getElementById('no-results');
const cartBadge   = document.getElementById('cart-badge');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems   = document.getElementById('cart-items');
const cartEmpty   = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const cartSubtotal= document.getElementById('cart-subtotal');
const cartFrete   = document.getElementById('cart-frete');
const cartTotal   = document.getElementById('cart-total');
const toast       = document.getElementById('toast');
const searchInput = document.getElementById('search-input');
const sortSelect  = document.getElementById('sort-select');

// ─── Persistência ────────────────────────────────────────────
function saveCart() {
  localStorage.setItem('shopwave_cart', JSON.stringify(state.cart));
}

// ─── Carrinho ─────────────────────────────────────────────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: product.id, qty: 1 });
  }

  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`✅ ${product.name} adicionado ao carrinho`);
}

function changeQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); renderCart(); }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
}

function clearCart() {
  state.cart = [];
  saveCart();
  updateCartBadge();
  renderCart();
}

function getTotalItems() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}

function getSubtotal() {
  return state.cart.reduce((sum, i) => {
    const p = PRODUCTS.find(p => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

// ─── Renderização do Carrinho ─────────────────────────────────
function updateCartBadge() {
  const total = getTotalItems();
  cartBadge.textContent = total;
}

function renderCart() {
  cartItems.innerHTML = '';
  const hasItems = state.cart.length > 0;

  if (hasItems) {
    cartEmpty.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    state.cart.forEach(item => {
      const p = PRODUCTS.find(p => p.id === item.id);
      if (!p) return;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-emoji">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${formatCurrency(p.price)}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" data-id="${p.id}" data-delta="-1">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-id="${p.id}" data-delta="1">+</button>
        </div>
        <button class="btn-remove-item" data-id="${p.id}" title="Remover">✕</button>
      `;
      cartItems.appendChild(div);
    });

    const subtotal = getSubtotal();
    const frete    = subtotal >= 199 ? 0 : 19.90;
    const total    = subtotal + frete;

    cartSubtotal.textContent = formatCurrency(subtotal);
    cartFrete.textContent    = frete === 0 ? '🎉 Grátis' : formatCurrency(frete);
    cartTotal.textContent    = formatCurrency(total);

  } else {
    cartEmpty.classList.remove('hidden');
    cartSummary.classList.add('hidden');
  }
}

// ─── Produtos ────────────────────────────────────────────────
function getFilteredProducts() {
  let list = [...PRODUCTS];

  // Filtro de categoria
  if (state.filter !== 'all') {
    list = list.filter(p => p.category === state.filter);
  }

  // Busca
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Ordenação
  switch (state.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  return list;
}

function renderProducts() {
  const products = getFilteredProducts();
  grid.innerHTML = '';

  if (products.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  products.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 40}ms`;

    const badgeClass = p.badge
      ? p.badge === 'Novo' ? 'badge-novo'
      : p.badge === 'Best Seller' ? 'badge-best'
      : p.badge === 'Hot' ? 'badge-hot' : ''
      : '';

    card.innerHTML = `
      <div class="product-img">${p.emoji}</div>
      ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ''}
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating)}</span>
          ${p.rating} (${p.reviews})
        </div>
        <div class="product-price-row">
          <div class="price-wrap">
            ${p.originalPrice ? `<span class="price-original">${formatCurrency(p.originalPrice)}</span>` : ''}
            <span class="price-current">${formatCurrency(p.price)}</span>
          </div>
          <button class="btn-add-cart" data-id="${p.id}">
            + Carrinho
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      addToCart(p.id);
      btn.textContent = '✓ Adicionado';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = '+ Carrinho';
        btn.classList.remove('added');
      }, 1500);
    });

    grid.appendChild(card);
  });
}

// ─── Utilitários ─────────────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── Sidebar do carrinho ──────────────────────────────────────
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── Eventos ─────────────────────────────────────────────────
document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Delegação de eventos no carrinho
cartItems.addEventListener('click', e => {
  const qtyBtn = e.target.closest('.qty-btn');
  const removeBtn = e.target.closest('.btn-remove-item');
  if (qtyBtn) changeQty(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta));
  if (removeBtn) removeFromCart(Number(removeBtn.dataset.id));
});

// Checkout (simulação)
document.getElementById('btn-checkout').addEventListener('click', () => {
  showToast('🎉 Compra finalizada! Obrigado pela preferência!');
  closeCart();
  setTimeout(clearCart, 600);
});

// Filtros de categoria
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    state.filter = link.dataset.cat;
    renderProducts();
  });
});

// Busca com debounce
let searchTimer;
searchInput.addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.query = e.target.value.trim();
    renderProducts();
  }, 300);
});

// Ordenação
sortSelect.addEventListener('change', e => {
  state.sort = e.target.value;
  renderProducts();
});

// ─── Start ────────────────────────────────────────────────────
renderProducts();
updateCartBadge();
renderCart();
