// script.js
document.addEventListener('DOMContentLoaded', () => {
  // ----- Mobile menu toggle -----
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav__list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('active');
      hamburger.innerHTML = navList.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ----- Campsite filter (campsites.html) -----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const campsiteCards = document.querySelectorAll('.campsite-card');
  if (filterBtns.length && campsiteCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        campsiteCards.forEach(card => {
          if (filter === 'all' || card.dataset.district === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ----- Nearby gear linking (campsites.html) -----
  const gearContainer = document.getElementById('gearPlaceholders');
  const campsiteCardsForGear = document.querySelectorAll('.campsite-card');

  const gearDB = {
    'nuwara-eliya': [
      { name: 'Thermal Sleeping Bag', type: 'Rent', price: 'Rs. 1500/day', img: 'images/Gear/Thermal Sleeping Bag.jpg', desc: 'Sub-zero rated.' },
      { name: 'Alpine Tent (2P)', type: 'Rent', price: 'Rs. 3000/day', img: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop', desc: 'Wind & rain resistant.' }
    ],
    'kandy': [
      { name: 'Standard Tent', type: 'Rent', price: 'Rs. 2000/day', img: 'https://images.unsplash.com/photo-1504280741562-60234e07e12b?q=80&w=2070&auto=format&fit=crop', desc: 'Good for mild weather.' },
      { name: 'Portable Stove', type: 'Rent/Buy', price: 'Rs. 500/day', img: 'https://images.unsplash.com/photo-1534062031174-5c92c89280d0?q=80&w=2080&auto=format&fit=crop', desc: 'Compact gas stove.' }
    ],
    'yala': [
      { name: 'Safari Chair', type: 'Rent', price: 'Rs. 800/day', img: 'https://images.unsplash.com/photo-1595237731998-63cb5f106f36?q=80&w=2070&auto=format&fit=crop', desc: 'Comfortable foldable.' },
      { name: 'Cooler Box', type: 'Rent', price: 'Rs. 600/day', img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=2070&auto=format&fit=crop', desc: 'Keeps drinks cold.' }
    ],
    'badulla': [
      { name: 'Hiking Poles', type: 'Rent', price: 'Rs. 400/day', img: 'https://images.unsplash.com/photo-1534062031174-5c92c89280d0?q=80&w=2080&auto=format&fit=crop', desc: 'Lightweight and sturdy.' },
      { name: 'Headlamp', type: 'Buy', price: 'Rs. 2500', img: 'https://images.unsplash.com/photo-1522008342704-6b265b543c46?q=80&w=2070&auto=format&fit=crop', desc: 'Ultra-bright LED.' }
    ]
  };
  const defaultGear = [
    { name: 'Basic Headlamp', type: 'Buy', price: 'Rs. 2500', img: 'https://images.unsplash.com/photo-1522008342704-6b265b543c46?q=80&w=2070&auto=format&fit=crop', desc: 'Essential for any trip.' },
    { name: 'Camping Chair', type: 'Rent', price: 'Rs. 800/day', img: 'https://images.unsplash.com/photo-1595237731998-63cb5f106f36?q=80&w=2070&auto=format&fit=crop', desc: 'Foldable and lightweight.' }
  ];

  if (campsiteCardsForGear.length && gearContainer) {
    campsiteCardsForGear.forEach(card => {
      card.addEventListener('click', function() {
        const district = this.dataset.district;
        const items = gearDB[district] || defaultGear;
        let html = '';
        items.forEach(item => {
          html += `
            <div class="nearby__gear-item">
              <img src="${item.img}" alt="${item.name}" loading="lazy" />
              <div class="nearby__gear-info">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="badge badge--rent">${item.type}</span>
                <div class="price">${item.price}</div>
              </div>
            </div>
          `;
        });
        gearContainer.innerHTML = html;
        // smooth scroll to nearby section
        document.querySelector('.nearby')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ----- Reviews carousel -----
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (track && slides.length) {
    let current = 0;
    const total = slides.length;
    const updateCarousel = () => {
      track.style.transform = `translateX(-${current * 100}%)`;
    };
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % total;
      updateCarousel();
    });
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + total) % total;
      updateCarousel();
    });
  }

  // ----- Contact form validation -----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
      } else {
        alert('Thank you for your message! We’ll get back to you soon.');
        this.reset();
      }
    });
  }

  // ----- Clickable cards (homepage) -----
  document.querySelectorAll('.card--clickable').forEach(card => {
    card.addEventListener('click', function() {
      const href = this.dataset.href;
      if (href) window.location.href = href;
    });
  });
});

// Global actions
window.addToCart = function(e, btn) {
  if(e) e.stopPropagation();
  const cardBody = btn.closest('.gear-card__info') || btn.closest('.card__body');
  const title = cardBody.querySelector('h3, h4').innerText;
  alert(title + ' added to cart!');
};

window.selectCampsite = function(e, btn) {
  if(e) e.stopPropagation();
  const cardBody = btn.closest('.card__body');
  const title = cardBody.querySelector('h3').innerText;
  alert(title + ' selected!');
};



// Detailed Campsite Data for Modal
const detailedCampsiteData = {
  'great-western': {
    name: 'Great Western Mountain',
    location: 'Nuwara Eliya',
    image: 'images/distict/Nuwara Eliya/Great Western Mountain.jpg',
    description: 'The 8th highest mountain in Sri Lanka. Its trail is ranked as difficult due to its steep incline and difficult, unclear path. A rewarding challenge for experienced hikers.',
    season: 'Jan - Mar',
    weather: 'Chilly (12°C - 16°C)',
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
    description: 'The location features a sharp cliff edge offering clear vistas of Namunukula Mountain, Monaragala, Buttala, and Wellawaya.',
    season: 'Dec - Apr',
    weather: 'Mild (18°C - 24°C)',
    safety: [
      'Stay away from the sharp cliff edge, especially during strong winds.',
      'Watch your step on loose rocks.',
      'Keep a safe distance if taking photographs near edges.'
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
    description: 'Narangala is pure magic for campers a steep, windy trek up to a massive ridge where you can pitch your tent right on the edge of the world and wake up completely surrounded by a sea of clouds and a killer 360-degree sunrise.',
    season: 'Feb - Jul',
    weather: 'Warm (28°C - 32°C)',
    safety: [
      'Beware of strong winds at the summit; pitch tents securely.',
      'Start the trek early to avoid the midday sun.',
      'Carry enough water.'
    ],
    gear: [
      { name: '65L Trekking Backpack', category: 'Bags', store: 'Badulla Outdoor Rentals', image: 'images/Gear/65L Trekking Backpack.jpg', avail: 'In Stock' },
      { name: 'Portable Gas Stove', category: 'Cooking', store: 'Badulla Outdoor Rentals', image: 'images/Gear/Portable Gas Stove.jpg', avail: 'Limited' }
    ]
  },
  'haritha-kanda': {
    name: 'Haritha Kanda',
    location: 'Badulla',
    image: 'images/distict/Badulla/haritha kanda.jpg',
    description: 'This scenic rocky mountain is celebrated for its lush pastures, misty landscapes, and panoramic views of the hill country. It has earned a reputation among local travelers as a visual look-alike to the rolling hills of New Zealand.',
    season: 'Jan - May',
    weather: 'Cool (16°C - 22°C)',
    safety: [
      'Pastures can be slippery when misty.',
      'Be mindful of changing weather patterns.',
      'Respect the local flora and avoid littering.'
    ],
    gear: [
      { name: '4-Person Dome Tent', category: 'Tents', store: 'Badulla Outdoor Rentals', image: 'images/Gear/4-Person Dome Tent.jpg', avail: 'In Stock' }
    ]
  },
  'hanthana': {
    name: 'Hanthana',
    location: 'Kandy',
    image: 'images/distict/kandy/Hanthana.jpg',
    description: 'Most adventurers set up basic base camps on the open, rocky plateaus near the summits, which offer a natural escape from the leeches found lower down the slopes.',
    season: 'Dec - Apr',
    weather: 'Mild (22°C - 26°C)',
    safety: [
      'Beware of leeches in the lower grassy areas; wear leech socks.',
      'Stay on marked paths to avoid getting lost.',
      'Avoid camping under large trees during thunderstorms.'
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
    description: 'Serene camping amidst towering pine trees with crisp mountain air.',
    season: 'Jan - Apr',
    weather: 'Cool (14°C - 20°C)',
    safety: [
      'Ensure fires are completely extinguished to prevent forest fires.',
      'Keep food secured to prevent wildlife encounters.',
      'Be respectful of the remote village community.'
    ],
    gear: [
      { name: 'LED Camping Lantern', category: 'Lighting', store: 'Kandy Gear Hub', image: 'images/Gear/LED Camping Lantern.jpg', avail: 'In Stock' },
      { name: 'Portable Gas Stove', category: 'Cooking', store: 'Kandy Gear Hub', image: 'images/Gear/Portable Gas Stove.jpg', avail: 'Limited' }
    ]
  }
};

window.openCampsiteModal = function(campId) {
  const data = detailedCampsiteData[campId];
  if (!data) return;

  const modal = document.getElementById('campsiteModal');
  const modalBody = document.getElementById('modalBody');
  
  if (modal && modalBody) {
    let safetyHtml = '';
    data.safety.forEach(item => { safetyHtml += `<li>${item}</li>`; });

    let gearHtml = '';
    data.gear.forEach(item => {
      gearHtml += `
        <div class="modal-gear-item">
          <img src="${item.image}" alt="${item.name}" class="modal-gear-img">
          <div class="modal-gear-info">
            <h4>${item.name} <span class="badge badge--rent" style="font-size: 0.7rem; position: static; padding: 2px 6px;">${item.avail}</span></h4>
            <p>${item.category} • ${item.store}</p>
          </div>
          <button class="btn btn--primary" onclick="addToCart(event, this)">Add to Cart</button>
        </div>
      `;
    });

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-left">
          <img src="${data.image}" alt="${data.name}" class="modal-header-img">
          <h2 class="modal-title">${data.name}</h2>
          <div class="modal-meta">
            <span><span class="icon-placeholder" data-icon="location"></span> ${data.location}</span>
            <span><span class="icon-placeholder" data-icon="calendar"></span> ${data.season}</span>
            <span><span class="icon-placeholder" data-icon="temp"></span> ${data.weather}</span>
          </div>
          <p class="modal-desc">${data.description}</p>
        </div>
        <div class="modal-right">
          <h3 class="modal-section-title">Safety Guidelines</h3>
          <ul class="modal-safety">
            ${safetyHtml}
          </ul>
          
          <h3 class="modal-section-title">Nearby Gear</h3>
          <div class="modal-gear-list">
            ${gearHtml}
          </div>
        </div>
      </div>
    `;

    modal.classList.add('show');
  }
};

window.closeCampsiteModal = function() {
  const modal = document.getElementById('campsiteModal');
  if (modal) modal.classList.remove('show');
};

window.onclick = function(event) {
  const modal = document.getElementById('campsiteModal');
  if (event.target === modal) {
    closeCampsiteModal();
  }
};
