// Swiper
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;
  const el = document.querySelector('.home.swiper');
  if (!el) return;

  new Swiper('.home', {
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});

// Auth UI (Google session)
async function wireAuthUI() {
  const authWrap = document.querySelector('.auth');
  if (!authWrap) return;
  try {
    const res = await fetch('/me', { credentials: 'include' });
    const data = await res.json();
    const user = data.user;
    const existing = authWrap.querySelector('a');
    const logout = authWrap.querySelector('.logout-link');

    if (user && existing) {
      existing.textContent = user.email || user.name || 'Signed in';
      existing.href = '#';
      if (!logout) {
        const out = document.createElement('a');
        out.href = '/logout';
        out.className = 'logout-link';
        out.textContent = 'Log out';
        authWrap.appendChild(out);
      }
    } else if (existing) {
      existing.textContent = 'Sign in';
      existing.href = 'signin.html';
      if (logout) logout.remove();
      if (window.location.pathname.endsWith('checkout.html')) {
        window.location.href = 'signin.html';
      }
    }
  } catch {
    // ignore
  }
}

wireAuthUI();

// Sign in flow
const signinForm = document.getElementById('signin-form');
if (signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(signinForm);
    const email = String(form.get('email') || '').trim();
    if (!email) return;
    const next = `create-account.html?email=${encodeURIComponent(email)}`;
    window.location.href = next;
  });
}

// Create account page
const accountEmail = document.getElementById('account-email');
if (accountEmail) {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  if (email) accountEmail.textContent = email;
}

const createAccountForm = document.getElementById('create-account-form');
if (createAccountForm) {
  createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = 'account-created.html';
  });
}

const togglePassword = document.querySelector('.toggle-password');
if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const input = document.querySelector('.password-row input');
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    togglePassword.innerHTML = isHidden ? '<i class="bx bx-hide"></i>' : '<i class="bx bx-show"></i>';
  });
}

// Reviews (Tabs + Shuffle)
const tabs = document.querySelectorAll('.reviews-tabs .tab');
const grid = document.querySelector('.reviews-grid');
const reviewsSection = document.querySelector('.reviews');
const cardsGrid = document.querySelector('.cards-grid');
const bestCreditFeatured = [
  "Paywave Visa Gold",
  "Visa Platinum",
  "Green Dot Visa Gold",
];

if (tabs.length && grid && reviewsSection) {
  fetch('cards.json')
    .then(res => res.json())
    .then(data => {
      const cards = data.cards || [];

      function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      function render(category) {
        const list = cards.filter(c => c.category === category);
        if (!list.length) {
          grid.innerHTML = '';
          return;
        }

        const featured = category === 'best-credit'
          ? bestCreditFeatured.map(name => list.find(c => c.name === name)).filter(Boolean)
          : [];
        const left = category === 'best-credit' ? featured[0] : list[0];
        const right = category === 'best-credit'
          ? featured.slice(1, 3)
          : list.slice(1, 3);

        let bottomHtml = '';
        if (category === 'best-credit') {
          const buyPool = list.filter(c => !bestCreditFeatured.includes(c.name));
          const bottom = shuffle(buyPool).slice(0, 4);
          bottomHtml = `
            <div class="review-grid-bottom">
              ${bottom.map(c => `
                <article class="review-card" data-card-id="${c.id}">
                  <button class="card-cart" aria-label="Add to cart"><i class="bx bx-cart"></i></button>
                  <img src="${c.image}" alt="${c.name}" />
                  <h4>${c.name}</h4>
                  <div class="price-row">
                    <span class="price-tag">${c.price}</span>
                    <span class="views">${c.views} views</span>
                  </div>
                  <div class="mini-rating">
                    <span class="stars">★★★★★</span>
                    <strong>${c.rating}</strong>
                  </div>
                  <a class="buy-btn" href="card-details.html?id=${c.id}">Buy</a>
                </article>
              `).join('')}
            </div>
          `;
        }

        grid.innerHTML = `
          <article class="review-main">
            <div class="card-preview">
              <img src="${left?.image || ''}" alt="${left?.name || 'Card'}" />
            </div>
            <div class="rating">
              <span>Our rating:</span>
              <span class="stars">★★★★★</span>
              <strong>${left?.rating ?? '4.0'}</strong>
            </div>
            <h3>${left?.name || 'Card name'}</h3>
            ${category === 'best-credit' ? `<p class="review-caption">${left?.price || ''}</p>` : ''}
            <div class="meta">
              ${category === 'best-credit' ? '' : `<span class="price">${left?.price || ''}</span>`}
              <span class="views">${left?.views || ''} views</span>
            </div>
            ${category === 'best-credit' ? '' : `<a href="#" class="review-link">Read our review <i class="bx bx-right-arrow-alt"></i></a>`}
          </article>

          <div class="review-side ${category === 'best-credit' ? 'two' : ''}">
            ${right.map(c => `
              <article class="review-mini" data-card-id="${c.id}">
                <img src="${c.image}" alt="${c.name}" />
                <div>
                  <h4>${c.name}</h4>
                  <p>${c.price}</p>
                  <div class="mini-rating">Rating: <strong>${c.rating}</strong></div>
                  <div class="mini-stars">★★★★★</div>
                  <div class="mini-meta">${c.views} views</div>
                  ${category === 'best-credit' ? '' : `<a href="#" class="review-link">Read our review <i class="bx bx-right-arrow-alt"></i></a>`}
                </div>
              </article>
            `).join('')}
          </div>

          ${bottomHtml}
        `;
      }

      function setActive(tab) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      }

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const cat = tab.dataset.category;
          setActive(tab);
          render(cat);
          const link = reviewsSection.querySelector('.see-all');
          if (link) link.href = `cards.html?category=${cat}`;
          const label = reviewsSection.querySelector('.see-all-text');
          if (label) {
            const base = tab.textContent.toLowerCase();
            label.textContent = cat === 'best-credit'
              ? `See all ${base} reviews`
              : `See all ${base} card reviews`;
          }
        });
      });

      const initial = tabs[0];
      if (initial) {
        setActive(initial);
        render(initial.dataset.category);
        const link = reviewsSection.querySelector('.see-all');
        if (link) link.href = `cards.html?category=${initial.dataset.category}`;
        const label = reviewsSection.querySelector('.see-all-text');
        if (label) {
          const base = initial.textContent.toLowerCase();
          label.textContent = initial.dataset.category === 'best-credit'
            ? `See all ${base} reviews`
            : `See all ${base} card reviews`;
        }
      }
    })
    .catch(() => {});
}

// Cards page (See All)
if (cardsGrid) {
  fetch('cards.json')
    .then(res => res.json())
    .then(data => {
      const cards = data.cards || [];
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const filtered = cat ? cards.filter(c => c.category === cat) : cards;
      const title = document.getElementById('page-title');
      const crumb = document.getElementById('breadcrumb-cat');
      const reviewsPage = document.querySelector('.reviews-page');
      const heroCopy = document.querySelector('.hero-copy');
      const heroIcon = document.querySelector('.hero-icon');
      if (cat && title && crumb) {
        const label = cat.replace(/-/g, ' ');
        const pretty = label.replace(/\b\w/g, m => m.toUpperCase());
        title.textContent = `${pretty} Credit Cards - Reviews`;
        crumb.textContent = pretty;

        if (cat === 'best-credit' && reviewsPage) {
          reviewsPage.classList.add('best-credit-page');
        }

        if (cat === 'rewards' && reviewsPage && heroCopy && heroIcon) {
          reviewsPage.classList.add('rewards-page');
          heroIcon.innerHTML = '<i class="bx bx-award"></i>';
          heroCopy.innerHTML = `
            <h1 id="page-title">${pretty} Credit Cards - Reviews</h1>
            <p>Credit card rewards come in many forms â€” from miles to cash back to points that can be redeemed for a variety of options. Some cards offer large sign-up bonuses, others offer extra earnings on bonus categories, and some cards charge annual fees.</p>
            <p>Our ratings compare cards on rewards value, ease of redemption, and overall perks so you can quickly see which offers fit your spending style.</p>
          `;
        }
      }

      function stars(rating) {
        const value = Math.max(0, Math.min(5, Math.round(parseFloat(rating) || 0)));
        return 'â˜…'.repeat(value) + 'â˜†'.repeat(5 - value);
      }

      function shuffleLocal(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      const renderList = cat === 'best-credit'
        ? shuffleLocal(filtered.filter(c => !bestCreditFeatured.includes(c.name))).slice(0, 49)
        : filtered;

      if (cat === 'rewards') {
        cardsGrid.innerHTML = filtered.map(c => `
          <article class="reward-card">
            <img src="${c.image}" alt="${c.name}" />
            <h4>${c.name}</h4>
            <div class="reward-rating">
              <span class="rating-score">${c.rating} rating</span>
              <span class="stars">${stars(c.rating)}</span>
            </div>
            <div class="reward-reviewed">Last reviewed: ${c.views}</div>
            <p class="reward-desc">${c.price}</p>
            <div class="reward-actions">
              <a href="#" class="reward-link">See Rates and Fees</a>
              <a href="#" class="reward-link">Read full review</a>
            </div>
          </article>
        `).join('');
      } else {
        const isBestCredit = cat === 'best-credit';
        const firstBatch = isBestCredit ? renderList.slice(0, 25) : renderList;
        const restBatch = isBestCredit ? renderList.slice(25) : [];

        cardsGrid.innerHTML = firstBatch.map(c => `
          <article class="review-card" data-card-id="${c.id}">
            <button class="card-cart" aria-label="Add to cart"><i class="bx bx-cart"></i></button>
            <img src="${c.image}" alt="${c.name}" />
            <h4>${c.name}</h4>
            <div class="meta">
              <span>${c.price}</span>
              <span>${c.views} views</span>
            </div>
            <div class="mini-rating">
              <span class="stars">★★★★★</span>
              <strong>${c.rating}</strong>
            </div>
            ${isBestCredit ? `<a class="buy-btn" href="card-details.html?id=${c.id}">Buy</a>` : `<a class="buy-btn" href="card-details.html?id=${c.id}">Buy</a>`}
          </article>
        `).join('');

        if (isBestCredit && restBatch.length) {
          const moreWrap = document.createElement('div');
          moreWrap.className = 'see-more-wrap';
          moreWrap.innerHTML = `<button class="see-more-btn">See more</button>`;
          cardsGrid.insertAdjacentElement('afterend', moreWrap);

          moreWrap.querySelector('.see-more-btn').addEventListener('click', () => {
            cardsGrid.insertAdjacentHTML('beforeend', restBatch.map(c => `
              <article class="review-card" data-card-id="${c.id}">
                <button class="card-cart" aria-label="Add to cart"><i class="bx bx-cart"></i></button>
                <img src="${c.image}" alt="${c.name}" />
                <h4>${c.name}</h4>
                <div class="meta">
                  <span>${c.price}</span>
                  <span>${c.views} views</span>
                </div>
                <div class="mini-rating">
                  <span class="stars">★★★★★</span>
                  <strong>${c.rating}</strong>
                </div>
                <a class="buy-btn" href="card-details.html?id=${c.id}">Buy</a>
              </article>
            `).join(''));
            moreWrap.remove();
          });
        }
      }
    })
    .catch(() => {});
}

// Card details page
const detailSection = document.querySelector('.card-details');
if (detailSection) {
  fetch('cards.json')
    .then(res => res.json())
    .then(data => {
      const cards = data.cards || [];
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const card = cards.find(c => c.id === id) || cards[0];
      if (!card) return;
      const title = document.getElementById('detail-title');
      const desc = document.getElementById('detail-desc');
      const image = document.getElementById('detail-image');
      const price = document.getElementById('detail-price');
      const views = document.getElementById('detail-views');
      const rating = document.getElementById('detail-rating');
      if (title) title.textContent = card.name;
      if (desc) desc.textContent = "Review and confirm the card details before proceeding to payment.";
      if (image) image.src = card.image;
      if (price) price.textContent = card.price;
      if (views) views.textContent = card.views;
      if (rating) rating.textContent = card.rating;
    })
    .catch(() => {});
}

// Cart (simple panel)
const cartButton = document.querySelector('.cart');

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cardsecure_cart') || '[]');
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem('cardsecure_cart', JSON.stringify(items));
}

function ensureCartPanel() {
  let panel = document.querySelector('.cart-panel');
  if (panel) return panel;
  panel = document.createElement('div');
  panel.className = 'cart-panel';
  panel.innerHTML = `
    <div class="cart-head">
      <span>Cart</span>
      <span class="cart-count">0 items</span>
    </div>
    <div class="cart-items"></div>
    <div class="cart-footer">
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <strong class="cart-total">$0.00</strong>
      </div>
      <a href="card-details.html" class="cart-buy">Buy now</a>
    </div>
  `;
  document.body.appendChild(panel);
  return panel;
}

function renderCart(panel, items) {
  const list = panel.querySelector('.cart-items');
  const count = panel.querySelector('.cart-count');
  list.innerHTML = items.map((i, idx) => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}" />
      <div class="cart-info">
        <div class="cart-name">${i.name}</div>
        <div class="cart-price">${i.price}</div>
      </div>
      <button class="cart-remove" data-index="${idx}" aria-label="Remove item">&times;</button>
    </div>
  `).join('') || `
    <div class="cart-empty">
      <div class="cart-empty-title">Your cart is empty</div>
      <div class="cart-empty-text">Looks like you haven't added anything to your cart yet</div>
    </div>
  `;
  count.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;
  const totalEl = panel.querySelector('.cart-total');
  const buyLink = panel.querySelector('.cart-buy');
  const subtotal = items.reduce((sum, item) => {
    const match = (item.price || '').match(/[\d.]+/);
    const val = match ? parseFloat(match[0]) : 0;
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
  panel.classList.toggle('has-items', items.length > 0);
  if (buyLink) {
    const last = items[items.length - 1];
    buyLink.href = last && last.id ? `card-details.html?id=${last.id}` : 'card-details.html';
  }
}

function addToCart(item) {
  const items = getCart();
  items.push(item);
  setCart(items);
  const panel = ensureCartPanel();
  renderCart(panel, items);
}

if (cartButton) {
  cartButton.addEventListener('click', () => {
    const panel = ensureCartPanel();
    renderCart(panel, getCart());
    panel.classList.toggle('active');
  });
}

document.addEventListener('click', (e) => {
  const panel = document.querySelector('.cart-panel');
  if (!panel || !panel.classList.contains('active')) return;
  if (panel.contains(e.target) || (cartButton && cartButton.contains(e.target))) return;
  panel.classList.remove('active');
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-cart');
  if (!btn) return;
  const card = btn.closest('.review-card');
  if (!card) return;
  const name = card.querySelector('h4')?.textContent?.trim() || 'Card';
  const price = card.querySelector('.price-tag')?.textContent?.trim()
    || card.querySelector('.meta span')?.textContent?.trim()
    || '$0 annual fee';
  const image = card.querySelector('img')?.getAttribute('src') || '';
  const id = card.getAttribute('data-card-id') || '';
  addToCart({ id, name, price, image });
});

document.addEventListener('click', (e) => {
  const remove = e.target.closest('.cart-remove');
  if (!remove) return;
  const idx = parseInt(remove.getAttribute('data-index'), 10);
  const items = getCart();
  if (!isNaN(idx)) {
    items.splice(idx, 1);
    setCart(items);
    const panel = ensureCartPanel();
    renderCart(panel, items);
  }
});
