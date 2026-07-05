/**
 * Camp Lanka — Main JavaScript
 * Handles: Navigation, Search, Filters, Carousel, Forms, Modals
 */

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element} [ctx=document]
 */
const $ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Shorthand querySelectorAll
 * @param {string} selector
 * @param {Element} [ctx=document]
 */
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

/**
 * Show a toast notification to replace alert()
 * @param {string} message
 * @param {'success'|'error'} [type='success']
 */
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = $('#cl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cl-toast';
  toast.className = `cl-toast cl-toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.innerHTML = `
    <i class="ph-fill ${type === 'success' ? 'ph-check-circle' : 'ph-x-circle'}"></i>
    <span>${message}</span>
    <button class="cl-toast__close" aria-label="Close notification">
      <i class="ph ph-x"></i>
    </button>
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('cl-toast--visible'));

  // Auto-dismiss after 4 s
  const timer = setTimeout(() => dismissToast(toast), 4000);

  // Manual close
  toast.querySelector('.cl-toast__close').addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

/**
 * Animate toast out and remove it
 * @param {HTMLElement} toast
 */
function dismissToast(toast) {
  toast.classList.remove('cl-toast--visible');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

/* ============================================================
   NAVIGATION — Hamburger Menu
   ============================================================ */

/**
 * Initialise the mobile hamburger menu with:
 * - Smooth CSS-driven open/close animation
 * - Close on outside click
 * - Close on nav link click
 * - Close when resized to desktop (≥ 769 px)
 * - Body scroll lock while open
 * - Proper aria-expanded state
 */
function initNavigation() {
  const hamburger = $('.hamburger');
  const navList = $('.nav__list');
  const nav = $('.nav');

  if (!hamburger || !navList) return;

  /** Toggle open/closed state */
  function openMenu() {
    navList.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.innerHTML = '<i class="ph ph-x" aria-hidden="true" style="font-size:1.5rem;"></i>';
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navList.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<i class="ph ph-list" aria-hidden="true" style="font-size:1.5rem;"></i>';
    document.body.classList.remove('menu-open');
  }

  function isMenuOpen() {
    return navList.classList.contains('active');
  }

  // Hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // Close when a nav link is clicked
  $$('.nav__link', navList).forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Close on outside click (document level)
  document.addEventListener('click', (e) => {
    if (isMenuOpen() && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close when resized to desktop breakpoint
  const mql = window.matchMedia('(min-width: 769px)');
  mql.addEventListener('change', (e) => {
    if (e.matches && isMenuOpen()) closeMenu();
  });

  // Support Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      hamburger.focus();
    }
  });
}

/* ============================================================
   CAMPSITE DATA
   Used for search on both index.html and campsites.html
   ============================================================ */

const CAMPSITE_DATA = [
  {
    id: 'great-western',
    name: 'Great Western Mountain',
    district: 'nuwara-eliya',
    location: 'Nuwara Eliya',
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.7,
    season: 'Jan – Mar',
    desc: 'The 8th highest mountain offering a steep incline and challenging trail.',
    img: 'images/distict/Nuwara Eliya/Great Western Mountain.jpg'
  },
  {
    id: 'bambaragala',
    name: 'Bambaragala',
    district: 'badulla',
    location: 'Badulla',
    category: 'Adventure',
    difficulty: 'Hard',
    rating: 4.5,
    season: 'Dec – Apr',
    desc: 'Features a sharp cliff edge offering clear vistas of nearby mountains.',
    img: 'images/distict/Badulla/bambaragala.jpg'
  },
  {
    id: 'narangala',
    name: 'Narangala Mountain',
    district: 'badulla',
    location: 'Badulla',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 4.9,
    season: 'Feb – Jul',
    desc: 'Pure magic with a sea of clouds and a killer 360-degree sunrise.',
    img: 'images/distict/Badulla/Narangala Mountain.jpg'
  },
  {
    id: 'haritha-kanda',
    name: 'Haritha Kanda',
    district: 'badulla',
    location: 'Badulla',
    category: 'Family',
    difficulty: 'Easy',
    rating: 4.8,
    season: 'Jan – May',
    desc: 'Scenic rocky mountain celebrated for its lush pastures and misty landscapes.',
    img: 'images/distict/Badulla/haritha kanda.jpg'
  },
  {
    id: 'hanthana',
    name: 'Hanthana',
    district: 'kandy',
    location: 'Kandy',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 4.6,
    season: 'Dec – Apr',
    desc: 'Set up base camps on open rocky plateaus near the summits.',
    img: 'images/distict/kandy/Hanthana.jpg'
  },
  {
    id: 'meemure',
    name: 'Meemure Village',
    district: 'kandy',
    location: 'Kandy',
    category: 'Forest',
    difficulty: 'Easy',
    rating: 4.9,
    season: 'Jan – Apr',
    desc: 'Serene camping amidst towering pine trees with crisp mountain air.',
    img: 'images/distict/kandy/meemure.webp'
  }
];

/* ============================================================
   HERO SEARCH (index.html)
   Reads the destination input, category & difficulty selects,
   then navigates to campsites.html with query parameters.
   ============================================================ */

function initHeroSearch() {
  const form = $('#heroSearchForm');
  const searchBtn = $('#heroSearchBtn');
  const destInput = $('#searchDestination');

  if (!searchBtn || !destInput) return;

  function doSearch() {
    const dest = destInput.value.trim();
    const cat = $('#searchCategory')?.value || '';
    const diff = $('#searchDifficulty')?.value || '';

    const params = new URLSearchParams();
    if (dest) params.set('q', dest);
    if (cat && cat !== 'Any type') params.set('category', cat);
    if (diff && diff !== 'Easy') params.set('difficulty', diff);

    window.location.href = 'campsites.html' + (params.toString() ? '?' + params.toString() : '');
  }

  searchBtn.addEventListener('click', doSearch);

  // Allow Enter key in destination input
  destInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}

/* ============================================================
   CAMPSITE SEARCH + FILTER (campsites.html)
   Real-time filtering by search text and district filter buttons.
   Shows a "No campsites found" empty state when nothing matches.
   ============================================================ */

function initCampsiteSearch() {
  const grid = $('#campsite-grid');
  const searchInput = $('#campsiteSearch');
  const clearBtn = $('#campsiteSearchClear');
  const emptyState = $('#campsiteEmpty');
  const filterBtns = $$('.filter-btn');
  const cards = $$('.camp-card', grid);

  if (!grid || !searchInput) return;

  let activeDistrict = 'all';

  /** Apply both district filter + text search at once */
  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    // Show/hide clear button
    if (clearBtn) clearBtn.style.display = query ? 'flex' : 'none';

    let visibleCount = 0;

    cards.forEach(card => {
      const district = card.dataset.district || '';
      const name = (card.dataset.name || '').toLowerCase();
      const desc = (card.querySelector('.camp-desc')?.textContent || '').toLowerCase();
      const location = (card.querySelector('.camp-card-meta span')?.textContent || '').toLowerCase();
      const category = (card.dataset.category || '').toLowerCase();

      // District filter
      const districtMatch = activeDistrict === 'all' || district === activeDistrict;
      // Text search — case-insensitive, matches name, desc, location, category
      const textMatch = !query || name.includes(query) || desc.includes(query) ||
                        location.includes(query) || category.includes(query);

      const show = districtMatch && textMatch;
      card.style.display = show ? '' : 'none';
      // Add/remove animation class
      if (show) {
        card.classList.add('card-visible');
        visibleCount++;
      } else {
        card.classList.remove('card-visible');
      }
    });

    // Show empty state
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Real-time search input
  searchInput.addEventListener('input', applyFilters);

  // Clear search
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
      searchInput.focus();
    });
  }

  // District filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDistrict = btn.dataset.filter;
      applyFilters();
    });
  });

  // Handle URL query params (from hero search on index.html)
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const cat = params.get('category');
  const diff = params.get('difficulty');

  if (q) {
    searchInput.value = q;
  }

  // Apply on load (handles URL params)
  applyFilters();
}

/* ============================================================
   NEARBY GEAR LINKING (campsites.html)
   ============================================================ */

const GEAR_DB = {
  'nuwara-eliya': [
    { name: 'Thermal Sleeping Bag', type: 'Rent', price: 'Rs. 1,500/day', img: 'images/Gear/Thermal Sleeping Bag.jpg', desc: 'Sub-zero rated.' },
    { name: 'Alpine Tent (2P)', type: 'Rent', price: 'Rs. 3,000/day', img: 'images/Gear/4-Person Dome Tent.jpg', desc: 'Wind & rain resistant.' }
  ],
  'kandy': [
    { name: 'Standard Tent', type: 'Rent', price: 'Rs. 2,000/day', img: 'images/Gear/4-Person Dome Tent.jpg', desc: 'Good for mild weather.' },
    { name: 'Portable Stove', type: 'Rent/Buy', price: 'Rs. 500/day', img: 'images/Gear/Portable Gas Stove.jpg', desc: 'Compact gas stove.' }
  ],
  'yala': [
    { name: 'Safari Chair', type: 'Rent', price: 'Rs. 800/day', img: 'images/Gear/Foldable Camping Chair.jpg', desc: 'Comfortable foldable.' },
    { name: 'Cooler Box', type: 'Rent', price: 'Rs. 600/day', img: 'images/Gear/LED Camping Lantern.jpg', desc: 'Keeps drinks cold.' }
  ],
  'badulla': [
    { name: 'Hiking Poles', type: 'Rent', price: 'Rs. 400/day', img: 'images/Gear/65L Trekking Backpack.jpg', desc: 'Lightweight and sturdy.' },
    { name: 'Headlamp', type: 'Buy', price: 'Rs. 2,500', img: 'images/Gear/LED Camping Lantern.jpg', desc: 'Ultra-bright LED.' }
  ]
};

const DEFAULT_GEAR = [
  { name: 'Basic Headlamp', type: 'Buy', price: 'Rs. 2,500', img: 'images/Gear/LED Camping Lantern.jpg', desc: 'Essential for any trip.' },
  { name: 'Camping Chair', type: 'Rent', price: 'Rs. 800/day', img: 'images/Gear/Foldable Camping Chair.jpg', desc: 'Foldable and lightweight.' }
];

function initNearbyGear() {
  const gearContainer = $('#gearPlaceholders');
  const cards = $$('.camp-card');

  if (!cards.length || !gearContainer) return;

  cards.forEach(card => {
    card.addEventListener('click', function () {
      const district = this.dataset.district;
      const items = GEAR_DB[district] || DEFAULT_GEAR;

      const html = items.map(item => `
        <div class="nearby__gear-item">
          <img src="${item.img}" alt="${item.name}" loading="lazy" width="80" height="80" />
          <div class="nearby__gear-info">
            <h4>${item.name}</h4>
            <p>${item.desc}</p>
            <span class="badge badge--rent">${item.type}</span>
            <div class="price">${item.price}</div>
          </div>
        </div>
      `).join('');

      gearContainer.innerHTML = html;
      document.querySelector('.nearby')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ============================================================
   REVIEWS CAROUSEL
   ============================================================ */

function initCarousel() {
  const track = $('.carousel-track');
  const slides = $$('.review-slide');
  const prevBtn = $('.carousel-btn.prev');
  const nextBtn = $('.carousel-btn.next');
  const dotsContainer = $('.carousel-dots');

  if (!track || !slides.length) return;

  let current = 0;
  const total = slides.length;

  /** Build dot indicators */
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    $$('.carousel-dot', dotsContainer).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  /** Move to a specific slide index */
  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance every 5 s
  let autoTimer = setInterval(() => goTo(current + 1), 5000);

  // Pause on hover
  const wrapper = $('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrapper.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    });
  }

  buildDots();
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('#name')?.value.trim();
    const email = $('#email')?.value.trim();
    const message = $('#message')?.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!emailPattern.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
    form.reset();
  });
}

/* ============================================================
   CLICKABLE CARDS
   ============================================================ */

function initClickableCards() {
  $$('.card--clickable').forEach(card => {
    card.addEventListener('click', function () {
      const href = this.dataset.href;
      if (href) window.location.href = href;
    });
  });
}

/* ============================================================
   SMOOTH SCROLL (anchor links)
   ============================================================ */

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = $(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   CAMPSITE MODAL
   ============================================================ */

/** Detailed campsite data for the modal */
const DETAILED_CAMPSITE_DATA = {
  'great-western': {
    name: 'Great Western Mountain',
    location: 'Nuwara Eliya',
    image: 'images/distict/Nuwara Eliya/Great Western Mountain.jpg',
    description: 'The 8th highest mountain in Sri Lanka. Its trail is ranked as difficult due to its steep incline and difficult, unclear path. A rewarding challenge for experienced hikers.',
    season: 'Jan – Mar',
    weather: 'Chilly (12°C – 16°C)',
    safety: [
      'Trail can be slippery and unclear; a local guide is recommended.',
      'Carry adequate warm clothing for the night.',
      'Bring plenty of water as there are limited sources near the top.'
    ],
    gear: [
      { name: 'Thermal Sleeping Bag', category: 'Sleeping Bags', store: 'Nuwara Eliya Camp Store', image: 'images/Gear/Thermal Sleeping Bag.jpg', avail: 'In Stock' },
      { name: '4-Person Dome Tent', category: 'Tents', store: 'Nuwara Eliya Camp Store', image: 'images/Gear/4-Person Dome Tent.jpg', avail: 'Limited' }
    ]
  },
  'bambaragala': {
    name: 'Bambaragala',
    location: 'Badulla',
    image: 'images/distict/Badulla/bambaragala.jpg',
    description: 'A scenic mountain surrounded by forests and tea estates. The trail features steep sections and rewarding panoramic views, making it suitable for hikers with moderate experience.',
    season: 'Jan – Apr',
    weather: 'Cool (16°C – 22°C)',
    safety: [
      'Wear hiking shoes with good grip, especially after rain.',
      'Carry sufficient drinking water and snacks.',
      '•	Start early to avoid afternoon mist and rain.'
    ],
    gear: [
      { name: 'LED Camping Lantern', category: 'Lighting', store: 'Badulla Outdoor Rentals', image: 'images/Gear/LED Camping Lantern.jpg', avail: 'In Stock' },
      { name: 'Foldable Camping Chair', category: 'Furniture', store: 'Badulla Outdoor Rentals', image: 'images/Gear/Foldable Camping Chair.jpg', avail: 'In Stock' }
    ]
  },
  'narangala': {
    name: 'Narangala Mountain',
    location: 'Badulla',
    image: 'images/distict/Badulla/Narangala Mountain.jpg',
    description: 'One of Sri Lanka\'s most popular camping mountains. The trail includes rocky climbs and spectacular sunrise views over the surrounding valleys',
    season: 'Jan – Apr',
    weather: 'Cool (14°C – 20°C)',
    safety: [
      'Strong winds are common near the summit.',
      'Camp only in designated areas.',
      'Carry enough water as natural sources are limited.'
    ],
    gear: [
      { name: '65L Trekking Backpack', category: 'Bags', store: 'Badulla Outdoor Rentals', image: 'images/Gear/65L Trekking Backpack.jpg', avail: 'In Stock' },
      { name: 'Portable Gas Stove', category: 'Cooking', store: 'Badulla Outdoor Rentals', image: 'images/Gear/Portable Gas Stove.jpg', avail: 'Limited' }
    ]
  },
  'haritha-kanda': {
    name: 'Haritha Kanda',
    location: 'Nuwara Eliya',
    image: 'images/distict/Badulla/haritha kanda.jpg',
    description: 'A peaceful mountain known for its lush forests and camping opportunities. The hike is moderately difficult with beautiful sunrise viewpoints and rich biodiversity. ',
    season: 'Dec – Mar',
    weather: 'Cool (14°C – 20°C)',
    safety: [
      'Leeches are common during wet weather.wear leech socks.',
      'Bring warm clothing for overnight camping.',
      'Avoid hiking alone and inform someone of your route.'
    ],
    gear: [
      { name: '4-Person Dome Tent', category: 'Tents', store: 'Badulla Outdoor Rentals', image: 'images/Gear/4-Person Dome Tent.jpg', avail: 'In Stock' }
    ]
  },
  'hanthana': {
    name: 'Hanthana',
    location: 'Kandy',
    image: 'images/distict/kandy/Hanthana.jpg',
    description: 'A mountain range famous for its rolling hills, tea plantations, and scenic hiking trails. Suitable for beginners and experienced hikers alike.',
    season: 'Jan – Mar',
    weather: 'Mild (18°C – 24°C)',
    safety: [
      'Weather changes quickly; carry a light rain jacket.',
      'Stay on marked trails to avoid getting lost.',
      'Wear proper hiking shoes for steep sections. '
    ],
    gear: [
      { name: 'Thermal Sleeping Bag', category: 'Sleeping Bags', store: 'Kandy Gear Hub', image: 'images/Gear/Thermal Sleeping Bag.jpg', avail: 'In Stock' },
      { name: 'Foldable Camping Chair', category: 'Furniture', store: 'Kandy Gear Hub', image: 'images/Gear/Foldable Camping Chair.jpg', avail: 'In Stock' }
    ]
  },
  'meemure': {
    name: 'Meemure Village',
    location: 'Kandy',
    image: 'images/distict/kandy/meemure.webp',
    description: 'A remote mountain village surrounded by the Knuckles Range. Popular for trekking, waterfalls, camping, and experiencing traditional village life.',
    season: 'Jan – Mar',
    weather: 'Cool (16°C – 24°C)',
    safety: [
      'Mobile network coverage is limited.',
      'Travel in a 4WD vehicle where possible.',
      'Carry emergency supplies and enough drinking water'
    ],
    gear: [
      { name: 'LED Camping Lantern', category: 'Lighting', store: 'Kandy Gear Hub', image: 'images/Gear/LED Camping Lantern.jpg', avail: 'In Stock' },
      { name: 'Portable Gas Stove', category: 'Cooking', store: 'Kandy Gear Hub', image: 'images/Gear/Portable Gas Stove.jpg', avail: 'Limited' }
    ]
  }
};

/**
 * Open the campsite detail modal
 * @param {string} campId
 */
window.openCampsiteModal = function (campId) {
  const data = DETAILED_CAMPSITE_DATA[campId];
  if (!data) return;

  const modal = $('#campsiteModal');
  const modalBody = $('#modalBody');

  if (!modal || !modalBody) return;

  const safetyHtml = data.safety.map(item => `<li>${item}</li>`).join('');

  const gearHtml = data.gear.map(item => `
    <div class="modal-gear-item">
      <img src="${item.image}" alt="${item.name}" class="modal-gear-img" loading="lazy" width="60" height="60">
      <div class="modal-gear-info">
        <h4>${item.name} <span class="badge badge--rent" style="font-size:0.7rem;position:static;padding:2px 6px;">${item.avail}</span></h4>
        <p>${item.category} • ${item.store}</p>
      </div>
      <button class="btn btn--primary" onclick="addToCart(event, this)" aria-label="Add ${item.name} to cart">Add to Cart</button>
    </div>
  `).join('');

  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-left">
        <img src="${data.image}" alt="${data.name}" class="modal-header-img" loading="lazy">
        <h2 class="modal-title">${data.name}</h2>
        <div class="modal-meta">
          <span><i class="ph ph-map-pin" aria-hidden="true"></i> ${data.location}</span>
          <span><i class="ph ph-calendar-blank" aria-hidden="true"></i> ${data.season}</span>
          <span><i class="ph ph-thermometer" aria-hidden="true"></i> ${data.weather}</span>
        </div>
        <p class="modal-desc">${data.description}</p>
      </div>
      <div class="modal-right">
        <h3 class="modal-section-title">Safety Guidelines</h3>
        <ul class="modal-safety">${safetyHtml}</ul>
        <h3 class="modal-section-title">Nearby Gear</h3>
        <div class="modal-gear-list">${gearHtml}</div>
      </div>
    </div>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  // Trap focus inside modal
  modal.querySelector('.modal-close').focus();
  document.body.classList.add('menu-open'); // reuse scroll lock
};

/** Close the campsite detail modal */
window.closeCampsiteModal = function () {
  const modal = $('#campsiteModal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }
};

/* ============================================================
   GLOBAL ADD TO CART (kept as global for inline onclick attrs)
   ============================================================ */

window.addToCart = function (e, btn) {
  if (e) e.stopPropagation();
  const cardBody = btn.closest('.gear-card__info') || btn.closest('.card__body') || btn.closest('.modal-gear-info');
  const title = cardBody?.querySelector('h3, h4')?.innerText || 'Item';
  showToast(`${title} added to cart! 🎒`, 'success');
};

window.selectCampsite = function (e, btn) {
  if (e) e.stopPropagation();
  const cardBody = btn.closest('.card__body');
  const title = cardBody?.querySelector('h3')?.innerText || 'Campsite';
  showToast(`${title} selected!`, 'success');
};

/* ============================================================
   MODAL BACKDROP CLICK + KEYBOARD CLOSE
   ============================================================ */

function initModalEvents() {
  const modal = $('#campsiteModal');
  if (!modal) return;

  // Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeCampsiteModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      window.closeCampsiteModal();
    }
  });
}

/* ============================================================
   INTERSECTION OBSERVER — fade-in cards on scroll
   ============================================================ */

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.camp-card, .gear-card, .card, .review-slide').forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}

/* ============================================================
   BOOT — run after DOM is ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSearch();
  initCampsiteSearch();
  initNearbyGear();
  initCarousel();
  initContactForm();
  initClickableCards();
  initSmoothScroll();
  initModalEvents();
  initScrollReveal();
});
