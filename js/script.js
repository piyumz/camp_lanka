/**
 * Camp Lanka — Main JavaScript
 * Handles: Navigation, Search, Filters, Forms, Modals
 */

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/** Shorthand querySelector */
const $ = (selector, ctx = document) => ctx.querySelector(selector);

/** Shorthand querySelectorAll */
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'} [type='success']
 */
function showToast(message, type = 'success') {
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
  requestAnimationFrame(() => toast.classList.add('cl-toast--visible'));

  const timer = setTimeout(() => dismissToast(toast), 4000);
  toast.querySelector('.cl-toast__close').addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.remove('cl-toast--visible');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

/* ============================================================
   NAVIGATION — Hamburger Menu
   ============================================================ */

function initNavigation() {
  const hamburger = $('.hamburger');
  const navList = $('.nav__list');
  const nav = $('.nav');

  if (!hamburger || !navList) return;

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

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen() ? closeMenu() : openMenu();
  });

  $$('.nav__link', navList).forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('click', (e) => {
    if (isMenuOpen() && !nav.contains(e.target)) closeMenu();
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
    if (e.matches && isMenuOpen()) closeMenu();
  });

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
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.8,
    season: 'Jan – Apr',
    desc: 'Features a sharp cliff edge offering clear vistas of nearby mountains.',
    img: 'images/distict/Badulla/bambaragala.jpg'
  },
  {
    id: 'narangala',
    name: 'Narangala Mountain',
    district: 'badulla',
    location: 'Badulla',
    category: 'Mountain',
    difficulty: 'Easy',
    rating: 4.9,
    season: 'Feb – Jul',
    desc: 'Pure magic with a sea of clouds and a killer 360-degree sunrise.',
    img: 'images/distict/Badulla/Narangala Mountain.jpg'
  },
  {
    id: 'haritha-kanda',
    name: 'Haritha Kanda',
    district: 'nuwara-eliya',
    location: 'Nuwara Eliya',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 4.9,
    season: 'Dec – Mar',
    desc: 'Scenic rocky mountain celebrated for its lush pastures and misty landscapes.',
    img: 'images/distict/Nuwara Eliya/haritha kanda.jpg'
  },
  {
    id: 'hanthana',
    name: 'Hanthana',
    district: 'kandy',
    location: 'Kandy',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 4.7,
    season: 'Jan – Mar',
    desc: 'Set up base camps on open rocky plateaus near the summits.',
    img: 'images/distict/kandy/Hanthana.jpg'
  },
  {
    id: 'meemure',
    name: 'Meemure Village',
    district: 'kandy',
    location: 'Kandy',
    category: 'Forest',
    difficulty: 'Hard',
    rating: 4.0,
    season: 'Jan – Mar',
    desc: 'A remote mountain village surrounded by the Knuckles Range.',
    img: 'images/distict/kandy/meemure.webp'
  },
  {
    id: 'alagalla',
    name: 'Alagalla Mountain Range',
    district: 'kegalla',
    location: 'Kegalla',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 3.5,
    season: 'Jan – Mar',
    desc: 'A historic rock fortress mountain with panoramic summit views.',
    img: 'images/distict/Kegalle/A_view_from_Alagalla_Mountain_Range.jpg'
  },
  {
    id: 'baththalangunduwa',
    name: 'Baththalangunduwa',
    district: 'puttalam',
    location: 'Puttalam',
    category: 'Beach',
    difficulty: 'Moderate',
    rating: 4.5,
    season: 'Jan – Sep',
    desc: 'A remote fisherman\'s island with pristine beaches and starlit camping.',
    img: 'images/distict/Puttalam/Baththalangunduwa.jpg'
  },
  {
    id: 'knuckles-base',
    name: 'Knuckles Base',
    district: 'matale',
    location: 'Matale',
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.4,
    season: 'Jan – Mar',
    desc: 'Gateway to a UNESCO World Heritage forest with diverse trekking routes.',
    img: 'images/distict/Matale/Knuckles_Range.jpg'
  }
];

/* ============================================================
   HERO SEARCH (index.html)
   ============================================================ */

function initHeroSearch() {
  const form = $('#heroSearchForm');
  if (!form) return;

  const destInput = $('#searchDestination');
  const catSelect = $('#searchCategory');
  const diffSelect = $('#searchDifficulty');

  function doSearch(e) {
    if (e) e.preventDefault();
    const dest = destInput?.value.trim() || '';
    const cat  = catSelect?.value || '';
    const diff = diffSelect?.value || '';

    const params = new URLSearchParams();
    if (dest) params.set('q', dest);
    if (cat)  params.set('category', cat);
    if (diff) params.set('difficulty', diff);

    window.location.href = 'campsites.html' + (params.toString() ? '?' + params.toString() : '');
  }

  form.addEventListener('submit', doSearch);

  destInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch(e);
  });
}

/* ============================================================
   CAMPSITE SEARCH + FILTER (campsites.html)
   ============================================================ */

function initCampsiteSearch() {
  const grid        = $('#campsite-grid');
  const searchInput = $('#campsiteSearch');
  const clearBtn    = $('#campsiteSearchClear');
  const emptyState  = $('#campsiteEmpty');
  const filterBtns  = $$('.filter-btn');
  const cards       = grid ? $$('.camp-card', grid) : [];

  if (!grid || !searchInput) return;

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    if (clearBtn) clearBtn.style.display = query ? 'flex' : 'none';

    let visibleCount = 0;

    cards.forEach(card => {
      const district = (card.dataset.district || '').trim().toLowerCase();
      const name     = (card.dataset.name     || '').toLowerCase();
      const category = (card.dataset.category || '').trim().toLowerCase();
      const desc     = (card.querySelector('.camp-desc')?.textContent || '').toLowerCase();
      const location = (card.querySelector('.camp-card-meta span')?.textContent || '').toLowerCase();

      const filterMatch = activeFilter === 'all' || district === activeFilter;
      const textMatch   = !query ||
        name.includes(query)     ||
        desc.includes(query)     ||
        location.includes(query) ||
        category.includes(query);

      const show = filterMatch && textMatch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  searchInput.addEventListener('input', applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
      searchInput.focus();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  // Handle URL query params from hero search
  const params = new URLSearchParams(window.location.search);
  const q    = params.get('q');
  const cat  = params.get('category');
  const diff = params.get('difficulty');

  if (q)    searchInput.value = q;
  if (cat)  searchInput.value = searchInput.value || cat;
  if (diff) searchInput.value = searchInput.value || diff;

  applyFilters();
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = $('#name')?.value.trim();
    const email   = $('#email')?.value.trim();
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
   ADD TO CART (gear page inline onclick buttons)
   ============================================================ */

window.addToCart = function (e, btn) {
  if (e) e.stopPropagation();
  const body  = btn.closest('.gear-card__info') || btn.closest('.card__body');
  const title = body?.querySelector('h2, h3, h4')?.innerText || 'Item';
  showToast(`${title} added to cart! `, 'success');
};

/* ============================================================
   CAMPSITE MODAL
   ============================================================ */

/** Detailed campsite data for the modal */
const DETAILED_CAMPSITE_DATA = {
  'great-western': {
    name: 'Great Western Mountain',
    location: 'Nuwara Eliya, Sri Lanka',
    image: 'images/distict/Nuwara Eliya/Great Western Mountain.jpg',
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.7,
    reviews: 220,
    elevation: '2,212 m',
    season: 'Jan – Mar',
    weather: 'Chilly (12°C – 16°C)',
    mapsUrl: 'https://maps.google.com/?q=Great+Western+Mountain+Nuwara+Eliya+Sri+Lanka',
    phone: '+94112345678',
    description: 'The 8th highest mountain in Sri Lanka. Its trail is ranked as difficult due to its steep incline and unclear path. A rewarding challenge for experienced hikers with breathtaking panoramic views from the summit.',
    safety: [
      'Trail can be slippery and unclear — a local guide is strongly recommended.',
      'Carry adequate warm clothing; temperatures drop sharply at night.',
      'Bring sufficient water as sources are limited near the top.',
      'Start early to avoid afternoon mist and ensure daylight for descent.'
    ]
    
  },
  'bambaragala': {
    name: 'Bambaragala',
    location: 'Badulla, Sri Lanka',
    image: 'images/distict/Badulla/bambaragala.jpg',
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.8,
    reviews: 218,
    elevation: '609 m',
    season: 'Jan – Apr',
    weather: 'Cool (16°C – 22°C)',
    mapsUrl: 'https://maps.google.com/?q=Bambaragala+Badulla+Sri+Lanka',
    phone: '+94552222345',
    description: 'A scenic mountain surrounded by forests and tea estates. The trail features steep sections and rewarding panoramic views, making it suitable for hikers with moderate to high experience.',
    safety: [
      'Wear hiking shoes with good grip, especially after rain.',
      'Carry sufficient drinking water and energy snacks.',
      'Start early to avoid afternoon mist and rain.',
      'Inform someone of your planned route and return time.'
    ]
  },
  'narangala': {
    name: 'Narangala Mountain',
    location: 'Badulla, Sri Lanka',
    image: 'images/distict/Badulla/Narangala Mountain.jpg',
    category: 'Mountain',
    difficulty: 'Easy',
    rating: 4.9,
    reviews: 456,
    elevation: '1,530 m',
    season: 'Jan – Apr',
    weather: 'Cool (14°C – 20°C)',
    mapsUrl: 'https://maps.google.com/?q=Narangala+Mountain+Badulla+Sri+Lanka',
    phone: '+94552222345',
    description: 'One of Sri Lanka\'s most popular camping mountains. The trail includes rocky climbs and spectacular 360° sunrise views over the surrounding valleys — a magical overnight camping experience.',
    safety: [
      'Strong winds are common near the summit — secure your tent.',
      'Camp only in designated areas to preserve the environment.',
      'Carry enough water as natural sources are limited on the summit.',
      'Bring a quality sleeping bag as nights can be cold.'
    ]
  },
  'haritha-kanda': {
    name: 'Haritha Kanda',
    location: 'Nuwara Eliya, Sri Lanka',
    image: 'images/distict/Nuwara Eliya/haritha kanda.jpg',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 4.9,
    reviews: 342,
    elevation: '1,050 m',
    season: 'Dec – Mar',
    weather: 'Cool (14°C – 20°C)',
    mapsUrl: 'https://maps.google.com/?q=Haritha+Kanda+Nuwara+Eliya+Sri+Lanka',
    phone: '+94522233456',
    description: 'A peaceful mountain known for its lush forests and excellent camping opportunities. The hike offers beautiful sunrise viewpoints and rich biodiversity including endemic birds and flora.',
    safety: [
      'Leeches are common during wet weather — wear leech socks.',
      'Bring warm clothing for overnight camping.',
      'Avoid hiking alone; inform someone of your route.',
      'Watch your step on muddy sections after rain.'
    ]
  },
  'hanthana': {
    name: 'Hanthana',
    location: 'Kandy, Sri Lanka',
    image: 'images/distict/kandy/Hanthana.jpg',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 4.7,
    reviews: 450,
    elevation: '1,240 m',
    season: 'Jan – Mar',
    weather: 'Mild (18°C – 24°C)',
    mapsUrl: 'https://maps.google.com/?q=Hanthana+Mountain+Kandy+Sri+Lanka',
    phone: '+94812233456',
    description: 'A mountain range famous for its rolling hills, tea plantations, and scenic hiking trails. Suitable for beginners and experienced hikers alike, with multiple trails offering diverse views.',
    safety: [
      'Weather changes quickly — carry a light rain jacket.',
      'Stay on marked trails to avoid getting lost.',
      'Wear proper hiking shoes for steep sections.',
      'Carry enough water as streams may be dry in peak season.'
    ]
  },
  'meemure': {
    name: 'Meemure Village',
    location: 'Kandy, Sri Lanka',
    image: 'images/distict/kandy/meemure.webp',
    category: 'Forest',
    difficulty: 'Hard',
    rating: 4.0,
    reviews: 120,
    elevation: '350 m',
    season: 'Jan – Mar',
    weather: 'Cool (16°C – 24°C)',
    mapsUrl: 'https://maps.google.com/?q=Meemure+Village+Kandy+Sri+Lanka',
    phone: '+94812233456',
    description: 'A remote mountain village surrounded by the Knuckles Range. Popular for trekking, waterfalls, camping, and experiencing authentic traditional village life far from urban noise.',
    safety: [
      'Mobile network coverage is very limited in this area.',
      'Travel in a 4WD vehicle where possible — roads are rough.',
      'Carry emergency supplies and sufficient drinking water.',
      'Let someone know your itinerary before departure.'
    ]
  },
  'alagalla': {
    name: 'Alagalla Mountain Range',
    location: 'Kegalle, Sri Lanka',
    image: 'images/distict/Kegalle/A_view_from_Alagalla_Mountain_Range.jpg',
    category: 'Mountain',
    difficulty: 'Moderate',
    rating: 3.5,
    reviews: 100,
    elevation: '1,140 m',
    season: 'Jan – Mar',
    weather: 'Tropical (24°C – 30°C)',
    mapsUrl: 'https://maps.google.com/?q=Alagalla+Mountain+Kegalle+Sri+Lanka',
    phone: '+94352244567',
    description: 'A historic rock fortress mountain offering panoramic summit views, famous for its treacherous railway history and tea estates. A natural defense outpost for the ancient Kandyan Kingdom.',
    safety: [
      'The trail has some exposed rocky sections — take care near edges.',
      'Avoid hiking during or after heavy rain.',
      'Carry enough water — no reliable sources on the trail.',
      'Use sunscreen and a hat as sections are exposed to direct sun.'
    ]
  },
  'baththalangunduwa': {
    name: 'Baththalangunduwa',
    location: 'Puttalam, Sri Lanka',
    image: 'images/distict/Puttalam/Baththalangunduwa.jpg',
    category: 'Beach',
    difficulty: 'Moderate',
    rating: 4.5,
    reviews: 245,
    elevation: '0 – 2 m',
    season: 'Jan – Sep',
    weather: 'Hot (28°C – 34°C)',
    mapsUrl: 'https://maps.google.com/?q=Baththalangunduwa+Kalpitiya+Sri+Lanka',
    phone: '+94322255678',
    description: 'A remote, narrow fisherman\'s island accessible only by boat from Kalpitiya. An untouched paradise with pristine sandy beaches, isolated fishing villages, and spectacular starlit night camping right on the shore.',
    safety: [
      'Only accessible by boat — arrange transport in advance.',
      'No medical facilities on the island; carry a first aid kit.',
      'Be aware of tides and sea conditions before swimming.',
      'Protect against mosquitoes especially at dusk and dawn.'
    ]
  },
  'knuckles-base': {
    name: 'Knuckles Base',
    location: 'Matale, Sri Lanka',
    image: 'images/distict/Matale/Knuckles_Range.jpg',
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.4,
    reviews: 105,
    elevation: '1,863 m',
    season: 'Jan – Mar',
    weather: 'Cool (14°C – 22°C)',
    mapsUrl: 'https://maps.google.com/?q=Knuckles+Mountain+Range+Matale+Sri+Lanka',
    phone: '+94662266789',
    description: 'The gateway to the Knuckles Mountain Range, a UNESCO World Heritage Conservation Forest. It offers diverse trekking routes through lush forests, waterfalls, and mountain peaks with exceptional biodiversity.',
    safety: [
      'A permit is required to enter the Knuckles Conservation Forest.',
      'Hire a registered guide — trails can be confusing.',
      'Carry waterproof gear as mist and rain are frequent.',
      'Do not disturb wildlife; this is a protected conservation area.'
    ]
  }
};

const NEARBY_GEAR_DB = [
  {
    id: 'tent-4',
    title: '4-Person Dome Tent',
    image: 'images/Gear/4-Person Dome Tent.jpg',
    subtext: 'Tents • Badulla Outdoor Rentals',
    phone: '+94552222345',
    mapsUrl: 'https://maps.google.com/?q=Badulla+Outdoor+Rentals',
    district: 'badulla'
  },
  {
    id: 'thermal-sleeping-bag',
    title: 'Thermal Sleeping Bag',
    image: 'images/Gear/Thermal Sleeping Bag.jpg',
    subtext: 'Sleeping Bags • Nuwara Eliya Camp Store',
    phone: '+94522233456',
    mapsUrl: 'https://maps.google.com/?q=Nuwara+Eliya+Camp+Store',
    district: 'nuwara-eliya'
  },
  {
    id: 'sleeping-pad',
    title: 'Sleeping Pad',
    image: 'images/Gear/Sleeping Pad.jpg',
    subtext: 'Sleeping Gear • Nuwara Eliya Camp Store',
    phone: '+94522233456',
    mapsUrl: 'https://maps.google.com/?q=Nuwara+Eliya+Camp+Store',
    district: 'nuwara-eliya'
  },
  {
    id: 'lantern',
    title: 'LED Camping Lantern',
    image: 'images/Gear/LED Camping Lantern.jpg',
    subtext: 'Lighting • Kandy Adventure Gear',
    phone: '+94812233456',
    mapsUrl: 'https://maps.google.com/?q=Kandy+Adventure+Gear',
    district: 'kandy'
  },
  {
    id: 'stove',
    title: 'Portable Gas Stove',
    image: 'images/Gear/Portable Gas Stove.jpg',
    subtext: 'Cooking • Kandy Adventure Gear',
    phone: '+94812233456',
    mapsUrl: 'https://maps.google.com/?q=Kandy+Adventure+Gear',
    district: 'kandy'
  },
  {
    id: 'tent-matale',
    title: '4-Person Dome Tent',
    image: 'images/Gear/4-Person Dome Tent.jpg',
    subtext: 'Tents • Matale Camping Hub',
    phone: '+94662266789',
    mapsUrl: 'https://maps.google.com/?q=Matale+Camping+Hub',
    district: 'matale'
  },
  {
    id: 'first-aid',
    title: 'First Aid Kit',
    image: 'images/Gear/first aid.jpg',
    subtext: 'Safety • Islandwide Shipping',
    phone: '+94112345678',
    mapsUrl: 'https://maps.google.com/?q=Colombo',
    district: 'all'
  }
];

/**
 * Open the campsite detail modal
 * @param {string} campId
 */
window.openCampsiteModal = function (campId) {
  const data = DETAILED_CAMPSITE_DATA[campId];
  if (!data) return;

  const modal     = $('#campsiteModal');
  const modalBody = $('#modalBody');
  if (!modal || !modalBody) return;

  const stars = '★'.repeat(Math.round(data.rating)) + '☆'.repeat(5 - Math.round(data.rating));
  const safetyHtml = data.safety.map(item => `<li>${item}</li>`).join('');

  // Generate nearby gear based on district
  const districtKey = CAMPSITE_DATA.find(c => c.id === campId)?.district || 'all';
  const nearbyGear = NEARBY_GEAR_DB.filter(g => g.district === districtKey || g.district === 'all').slice(0, 2);
  let gearHtml = '';
  
  if (nearbyGear.length > 0) {
    const gearItems = nearbyGear.map(gear => {
      return `
        <div style="border: 1px solid var(--color-border); border-radius: 10px; padding: 0.75rem; display: flex; align-items: center; gap: 1rem; background: var(--color-bg); margin-bottom: 1rem;">
          <img src="${gear.image}" alt="${gear.title}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" />
          <div style="flex: 1;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.2rem;">
              <h4 style="color: var(--color-primary); font-weight: 700; font-size: 0.95rem; margin: 0;">${gear.title}</h4>
            </div>
            <p style="color: var(--color-text-light); font-size: 0.85rem; margin: 0;">${gear.subtext}</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-shrink: 0; flex-direction: column;">
            <a href="tel:${gear.phone}" class="btn btn--primary" style="padding: 0.35rem 1rem; font-size: 0.8rem; border-radius: 20px;">Call</a>
            <a href="${gear.mapsUrl}" target="_blank" class="btn btn--outline" style="padding: 0.35rem 1rem; font-size: 0.8rem; border-radius: 20px;">Location</a>
          </div>
        </div>
      `;
    }).join('');

    gearHtml = `
      <h3 class="modal-section-title" style="margin-top:2rem;">Nearby Gear</h3>
      ${gearItems}
    `;
  }

  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-left">
        <img
          src="${data.image}"
          alt="${data.name} campsite"
          class="modal-header-img"
          loading="lazy"
          width="460"
          height="280"
        >
        <h2 class="modal-title">${data.name}</h2>
        <div class="modal-meta">
          <span><i class="ph ph-map-pin" aria-hidden="true"></i> ${data.location}</span>
          <span><i class="ph ph-calendar-blank" aria-hidden="true"></i> ${data.season}</span>
          <span><i class="ph ph-thermometer" aria-hidden="true"></i> ${data.weather}</span>
          <span><i class="ph ph-mountains" aria-hidden="true"></i> ${data.elevation}</span>
        </div>
        <p class="modal-desc">${data.description}</p>
        <div class="modal-action-btns">
          <a
            href="${data.mapsUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--primary"
            aria-label="Open ${data.name} in Google Maps"
          >
            <i class="ph ph-map-pin" aria-hidden="true"></i> Location
          </a>
          <a
            href="tel:${data.phone}"
            class="btn btn--ghost"
            aria-label="Call ${data.name} contact number"
          >
            <i class="ph ph-phone" aria-hidden="true"></i> Call
          </a>
        </div>
      </div>
      <div class="modal-right">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;">
          <span style="font-size:1.3rem;color:#e8b84b;letter-spacing:2px;" aria-label="${data.rating} out of 5 stars">${stars}</span>
          <span style="font-weight:700;color:#fff;font-size:1.1rem;">${data.rating}</span>
          <span style="color:var(--color-text-light);font-size:0.9rem;">(${data.reviews} reviews)</span>
        </div>
        <div style="display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap;">
          <span class="badge" style="position:static;background:rgba(82,197,137,0.15);color:var(--color-primary);border:1px solid rgba(82,197,137,0.3);">
            <i class="ph ph-tag" aria-hidden="true"></i> ${data.category}
          </span>
          <span class="badge" style="position:static;background:rgba(255,255,255,0.05);color:var(--color-text-light);border:1px solid var(--color-border);">
            <i class="ph ph-person-simple-walk" aria-hidden="true"></i> ${data.difficulty}
          </span>
        </div>
        <h3 class="modal-section-title">Safety Guidelines</h3>
        <ul class="modal-safety">${safetyHtml}</ul>
        ${gearHtml}
      </div>
    </div>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('.modal-close').focus();
  document.body.classList.add('menu-open');
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
   MODAL BACKDROP CLICK + KEYBOARD CLOSE
   ============================================================ */

function initModalEvents() {
  const modal = $('#campsiteModal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeCampsiteModal();
  });

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

  $$('.camp-card, .gear-card, .card').forEach(el => {
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
  initContactForm();
  initModalEvents();
  initScrollReveal();
});
