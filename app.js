// ==========================================================================
// PRODUCT DATA DEFINITION (9 mockup products + extras)
// Prices set to $2352.41 and names set to match the Figma visual template
// while keeping internal searchable names distinct.
// ==========================================================================
const PRODUCTS = [
  {
    id: "p1",
    name: "Modern Black Chair",
    displayName: "URBAN LUX HIGH CHAIR", // Visual match
    category: "chair",
    price: 2668.15,
    rating: 5,
    image: "assets/products/chair.png",
    material: "Oak wood",
    size: "M",
    discount: 20,
    featured: true,
    shipping: "free"
  },
  {
    id: "p2",
    name: "Modern Black Hanging Light",
    displayName: "MORDERN BLACK HANGING LIGHT",
    category: "lamp",
    price: 1595.6,
    rating: 5,
    image: "assets/products/hanging-black.png",
    material: "Alloy",
    size: "S",
    hanging: true,
    discount: 20,
    featured: true,
    shipping: "free"
  },
  {
    id: "p3",
    name: "Modern Black Table",
    displayName: "METRO FUSION TABLE ",
    category: "table",
    price: 2238.30,
    rating: 5,
    image: "assets/products/table.png",
    material: "Oak wood",
    size: "L",
    discount: 20,
    featured: true,
    shipping: "paid"
  },
  {
    id: "p4",
    name: "Modern Arch Floor Lamp",
    displayName: "LUMIN DESK LAMP",
    category: "lamp",
    price: 1477.80,
    rating: 5,
    image: "assets/products/floor-lamp.png",
    material: "Stainless steel",
    size: "L",
    discount: 20,
    featured: true,
    shipping: "free"
  },
  {
    id: "p5",
    name: "Modern Wall Clock",
    displayName: "TIMELESS EDGE HANGING CLOCK",
    category: "table", // Placed in table category for diversity
    price: 1071.6,
    rating: 5,
    image: "assets/products/clock.png",
    material: "Ceramic",
    size: "S",
    discount: 20,
    featured: true,
    shipping: "paid"
  },
  {
    id: "p6",
    name: "Modern White Hanging Light",
    displayName: "ZENITH PENDANT LIGHT",
    category: "lamp",
    price: 2069.59,
    rating: 5,
    image: "assets/products/pendant-white.png",
    material: "Alloy",
    size: "M",
    hanging: true,
    discount: 20,
    featured: true,
    shipping: "free"
  },
  {
    id: "p7",
    name: "Modern Square Desk Clock",
    displayName: "MORDERN WHITE HANGING CLOCK",
    category: "Clock",
    price: 2352.41,
    rating: 5,
    image: "assets/products/clock 2.png",
    material: "Ceramic",
    size: "S",
    discount: 20,
    featured: false,
    shipping: "paid"
  },
  {
    id: "p8",
    name: "Modern Plant Pot",
    displayName: "MORDERN BLACK HANGING LIGHT",
    category: "sofa", // Placed in sofa category for filter testing
    price: 2352.41,
    rating: 5,
    image: "assets/products/plant.png",
    material: "Ceramic",
    size: "M",
    discount: 20,
    featured: false,
    shipping: "free"
  },
  {
    id: "p9",
    name: "Modern Wood Stool",
    displayName: "MODERN WOOD STOOL",
    category: "chair",
    price: 2352.41,
    rating: 5,
    image: "assets/products/chair-wood.png",
    material: "Oak wood",
    size: "S",
    discount: 20,
    featured: false,
    shipping: "free"
  },
  {
    id: "p10",
    name: "Green Designed Sofa",
    displayName: "MORDERN GREEN DESIGNED SOFA",
    category: "sofa",
    price: 2352.41,
    rating: 5,
    image: "assets/designed-sofa.png",
    material: "Oak wood",
    size: "L",
    discount: 20,
    featured: false,
    shipping: "free"
  },
  {
    id: "p11",
    name: "Luxury Leather Couch",
    displayName: "MORDERN LUXURY LEATHER COUCH",
    category: "couch",
    price: 2950.00,
    rating: 5,
    image: "assets/products/chair-blue.jpg",
    material: "Oak wood",
    size: "L",
    featured: false,
    shipping: "free"
  },
  {
    id: "p12",
    name: "Modern Bronze Hanging Light",
    displayName: "MORDERN BRONZE HANGING LIGHT",
    category: "lamp",
    price: 2352.41,
    rating: 5,
    image: "assets/bronze-hanging-light.png",
    material: "Bronze",
    size: "L",
    discount: 20,
    featured: true,
    shipping: "free"
  }
];

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let cart = JSON.parse(localStorage.getItem("furnitur_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("furnitur_wishlist")) || [];

// Active view detection based on body classes
const isSearchPage = document.body.classList.contains("search-page");
const isHomePage = document.body.classList.contains("home-page");
const isProductPage = document.body.classList.contains("product-page");

// Filter state for Search Page
let filters = {
  category: "all",
  searchQuery: "",
  materials: [],
  sizes: [],
  maxPrice: 3000,
  freeShippingOnly: false,
  onSaleOnly: false,
  sort: "default",
  viewMode: "grid"
};

// Pagination state
let pagination = {
  currentPage: 1,
  itemsPerPage: 9
};

// ==========================================================================
// DOM SELECTORS & INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initHeaderSearch();
  initNavigation();
  initCart();
  initWishlist();

  if (isHomePage) {
    initHomePage();
  }

  if (isSearchPage) {
    initSearchPage();
  }

  if (isProductPage) {
    initProductPage();
  }
});

// ==========================================================================
// SHARED NAVBAR SEARCH REDIRECT
// ==========================================================================
function initHeaderSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  // Handle typing inside navbar search
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const term = searchInput.value.trim();
      if (isSearchPage) {
        // Already on search page, just update filter
        filters.searchQuery = term;
        pagination.currentPage = 1;
        updateCatalog();
      } else {
        // Redirect to search.html with query parameter
        window.location.href = `search.html?query=${encodeURIComponent(term)}`;
      }
    }
  });

  // If on search page, pre-fill search input from URL params
  if (isSearchPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("query");
    const categoryParam = urlParams.get("category");

    if (queryParam) {
      filters.searchQuery = queryParam;
      searchInput.value = queryParam;
    }
    if (categoryParam) {
      filters.category = categoryParam;

      // Update sidebar active link state
      const sidebarLinks = document.querySelectorAll(".category-filter-list .filter-link");
      sidebarLinks.forEach(link => {
        if (link.getAttribute("data-category") === categoryParam) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }
}

// Mobile Search - Click on Magnifying Glass Icon + Enter Key
const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSearchIcon = document.getElementById('mobile-search-icon');

function performMobileSearch() {
  const term = mobileSearchInput.value.trim();
  
  if (term) {
    if (isSearchPage) {
      filters.searchQuery = term;
      pagination.currentPage = 1;
      updateCatalog();
    } else {
      window.location.href = `search.html?query=${encodeURIComponent(term)}`;
    }
  }

  // Close mobile menu after search
  const mobileNav = document.getElementById('mobile-nav-menu');
  if (mobileNav) mobileNav.classList.remove('active');
}

// Click on Magnifying Glass Icon
if (mobileSearchIcon) {
  mobileSearchIcon.addEventListener('click', performMobileSearch);
}

// Press Enter Key
if (mobileSearchInput) {
  mobileSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performMobileSearch();
    }
  });
}


// ==========================================================================
// MOBILE DRAWER NAVIGATION
// ==========================================================================
function initNavigation() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNavMenu = document.getElementById("mobile-nav-menu");
  const mobileNavClose = document.getElementById("mobile-nav-close");

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNavMenu.classList.add("active");
    });
  }

  if (mobileNavClose && mobileNavMenu) {
    mobileNavClose.addEventListener("click", () => {
      mobileNavMenu.classList.remove("active");
    });
  }

  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileNavMenu.classList.remove("active");
    });
  });
}

// ==========================================================================
// HOME PAGE ACTIONS & TESTIMONIALS SLIDER
// ==========================================================================
function initHomePage() {
  // Render Home featured products
  renderFeaturedProducts("all");

  // Tab filters
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderFeaturedProducts(category);
    });
  });

  // Reviews Offset Slider dots mechanism
  const reviewSlides = document.querySelectorAll(".review-slide-box");
  const dots = document.querySelectorAll(".dot");
  let activeIdx = 1; // Slide 1 (Sarah Jenkins) starts active

  const updateReviewsUI = (targetIdx) => {
    reviewSlides.forEach((slide, idx) => {
      slide.className = "review-slide-box"; // reset classes

      if (idx === targetIdx) {
        slide.classList.add("active-slide");
      } else if (idx === (targetIdx - 1 + reviewSlides.length) % reviewSlides.length) {
        slide.classList.add("prev-slide");
      } else {
        slide.classList.add("next-slide");
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === targetIdx);
    });

    activeIdx = targetIdx;
  };

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.getAttribute("data-slide"));
      updateReviewsUI(idx);
    });
  });

  // Testimonial slide boxes are clickable to bring them active
  reviewSlides.forEach((slide, idx) => {
    slide.addEventListener("click", () => {
      if (!slide.classList.contains("active-slide")) {
        updateReviewsUI(idx);
      }
    });
  });

  // Promo Shop Now buy button
  const promoBuyBtn = document.getElementById("promo-buy-btn");
  if (promoBuyBtn) {
    promoBuyBtn.addEventListener("click", () => {
      const pId = promoBuyBtn.getAttribute("data-id");
      addToCart(pId);
    });
  }
}

// ==========================================================================
// SEARCH PAGE SIDEBAR accordion & dynamic renders
// ==========================================================================
function initSearchPage() {
  const collapsibleHeadings = document.querySelectorAll(".collapsible");
  const categoryLinks = document.querySelectorAll(".category-filter-list .filter-link");
  const materialCBs = document.querySelectorAll(".material-checkbox");
  const sizeCBs = document.querySelectorAll(".size-checkbox");
  const priceSlider = document.getElementById("price-slider");
  const priceMaxDisplay = document.getElementById("price-max-display");
  const applyPriceBtn = document.getElementById("apply-price-btn");

  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");
  const onSaleFilterBtn = document.getElementById("on-sale-filter-btn");
  const sortSelect = document.getElementById("sort-select");

  // Accordion widgets
  collapsibleHeadings.forEach(heading => {
    heading.addEventListener("click", () => {
      const content = heading.nextElementSibling;
      const icon = heading.querySelector(".toggle-icon");
      heading.classList.toggle("active");
      content.classList.toggle("hidden");
      icon.className = heading.classList.contains("active")
        ? "fa-solid fa-chevron-up toggle-icon"
        : "fa-solid fa-chevron-down toggle-icon";
    });
  });

  // Category selection
  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      categoryLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      filters.category = link.getAttribute("data-category");
      pagination.currentPage = 1;
      updateCatalog();
    });
  });

  // Material checkboxes
  materialCBs.forEach(cb => {
    cb.addEventListener("change", () => {
      const mats = [];
      materialCBs.forEach(checkbox => {
        if (checkbox.checked) mats.push(checkbox.value);
      });
      filters.materials = mats;
      pagination.currentPage = 1;
      updateCatalog();
    });
  });

  // Size checkboxes
  sizeCBs.forEach(cb => {
    cb.addEventListener("change", () => {
      const sizes = [];
      sizeCBs.forEach(checkbox => {
        if (checkbox.checked) sizes.push(checkbox.value);
      });
      filters.sizes = sizes;
      pagination.currentPage = 1;
      updateCatalog();
    });
  });

  // Price range slider
  priceSlider.addEventListener("input", (e) => {
    priceMaxDisplay.textContent = e.target.value;
  });
  applyPriceBtn.addEventListener("click", () => {
    filters.maxPrice = parseInt(priceSlider.value);
    pagination.currentPage = 1;
    updateCatalog();
  });

  // On Sale Button
  onSaleFilterBtn.addEventListener("click", () => {
    filters.onSaleOnly = !filters.onSaleOnly;
    onSaleFilterBtn.classList.toggle("active", filters.onSaleOnly);
    pagination.currentPage = 1;
    updateCatalog();
  });

  // Sorting
  sortSelect.addEventListener("change", (e) => {
    filters.sort = e.target.value;
    updateCatalog();
  });

  // View modes grid/list
  gridViewBtn.addEventListener("click", () => {
    filters.viewMode = "grid";
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    document.getElementById("catalog-products-container").classList.remove("list-view");
    updateCatalog();
  });
  listViewBtn.addEventListener("click", () => {
    filters.viewMode = "list";
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
    document.getElementById("catalog-products-container").classList.add("list-view");
    updateCatalog();
  });

  // Trigger initial catalog update
  updateCatalog();
}

// ==========================================================================
// DYNAMIC RENDER ENGINES
// ==========================================================================
function getStarsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rating ? `<i class="fa-solid fa-star"></i>` : `<i class="fa-regular fa-star"></i>`;
  }
  return html;
}

// Shared product-card builder used by home, search, and "best combined" renders.
// Clicking the card (outside the action buttons) navigates to the product detail page.
function createProductCardElement(p, options = {}) {
  const isWishlisted = wishlist.includes(p.id);
  const isHanging = p.category === 'lamp' || p.hanging === true;

  const card = document.createElement("div");
  card.className = `product-card${isHanging ? ' img-top' : ''}`;
  card.dataset.id = p.id;

  // Grid View Overlay Buttons
  const gridActions = `
    <div class="product-actions">
      <button class="btn-icon add-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}">
        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
      <button class="btn-add-cart-text add-cart-btn" data-id="${p.id}">Add To Cart</button>
    </div>
  `;

  // List View Buttons (under price)
  const listActionsHtml = options.includeListActions ? `
    <div class="product-list-actions">
      <button class="list-wishlist-btn add-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}">
        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
      <button class="list-cart-btn add-cart-btn" data-id="${p.id}">Add To Cart</button>
    </div>` : "";

  card.innerHTML = `
    <div class="product-card-image">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      ${gridActions}
    </div>
    <div class="product-info">
      <h3 class="product-title">${p.displayName}</h3>
      <div class="product-stars">${getStarsHtml(p.rating)}</div>
      <div class="product-price-container">
        <span class="product-price">$${p.price.toFixed(2)}</span>
      </div>
      ${listActionsHtml}
    </div>
  `;

  // Click to go to product detail (except buttons)
  card.addEventListener("click", (e) => {
    if (!e.target.closest('.add-wishlist-btn') && !e.target.closest('.add-cart-btn')) {
      window.location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    }
  });

  return card;
}

/* ── Home page: no includeListActions → hover overlay only ── */
// Render Featured (6 items on Home page)
function renderFeaturedProducts(categoryFilter = "all") {
  const container = document.getElementById("featured-products-container");
  if (!container) return;

  container.innerHTML = "";

  const filtered = PRODUCTS.filter(p => {
    if (!p.featured) return false;
    if (categoryFilter === "all") return true;
    return p.category === categoryFilter;
  }).slice(0, 6);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-products">No products found.</p>`;
    return;
  }

  filtered.forEach(p => {
    container.appendChild(createProductCardElement(p)); /* no options = no list actions */
  });

  attachProductListeners(container);
}

/* ── Search page: includeListActions only in list view ── */
function updateCatalog() {
  const container = document.getElementById("catalog-products-container");
  if (!container) return;

  const isListView = filters.viewMode === "list";

  let filtered = PRODUCTS.filter(p => {
    if (filters.category !== "all" && p.category !== filters.category) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    }
    if (filters.materials.length > 0 && !filters.materials.includes(p.material)) return false;
    if (filters.sizes.length > 0 && !filters.sizes.includes(p.size)) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.onSaleOnly && !p.onSale) return false;
    return true;
  });

  if (filters.sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (filters.sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const titleEl = document.getElementById("search-result-title");
  if (filters.searchQuery) {
    titleEl.textContent = `RESULT FOR " ${filters.searchQuery.toUpperCase()} "`;
  } else if (filters.category !== "all") {
    titleEl.textContent = `RESULT FOR " ${filters.category.toUpperCase()} "`;
  } else {
    titleEl.textContent = 'RESULT FOR " FURNITURE "';
  }

  renderActiveBadges();

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
  if (pagination.currentPage > totalPages && totalPages > 0) pagination.currentPage = totalPages;

  const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const end = Math.min(start + pagination.itemsPerPage, totalItems);
  const paginated = filtered.slice(start, end);

  const countText = totalItems > 0
    ? `SHOWED ${start + 1} - ${end} OF ${totalItems} PRODUCTS`
    : `SHOWED 0 OF 0 PRODUCTS`;
  document.getElementById("results-count-text").textContent = countText;
  document.getElementById("pagination-results-count-text").textContent = countText;

  container.innerHTML = "";

  if (paginated.length === 0) {
    container.innerHTML = `
      <div class="no-products-found" style="grid-column:1/-1;text-align:center;padding:3rem 0;">
        <i class="fa-solid fa-face-frown" style="font-size:2.5rem;color:var(--color-grey-500);margin-bottom:1rem;"></i>
        <h3>No matching results.</h3>
        <button class="btn btn-outline btn-sm" id="reset-catalog-filters-btn" style="margin-top:1rem;">Reset Filters</button>
      </div>`;
    document.getElementById("reset-catalog-filters-btn")
      .addEventListener("click", resetAllFilters);
    renderPagination(0);
    return;
  }

  paginated.forEach(p => {
    container.appendChild(
      createProductCardElement(p, {
        includeListActions: filters.viewMode === "list" // ← only true in list view
      })
      /*                                                ↑
         true  → list view: buttons visible below info
         false → grid view: hover overlay only (no duplicates)       */
    );
  });

  attachProductListeners(container);
  renderPagination(totalPages);
}




// Update Search page catalog layout
function updateCatalog() {
  const container = document.getElementById("catalog-products-container");
  if (!container) return;

  // A. Filtering logic
  let filtered = PRODUCTS.filter(p => {
    if (filters.category !== "all" && p.category !== filters.category) return false;

    if (filters.searchQuery) {
      const matchName = p.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchCat = p.category.toLowerCase().includes(filters.searchQuery.toLowerCase());
      if (!matchName && !matchCat) return false;
    }

    if (filters.materials.length > 0 && !filters.materials.includes(p.material)) return false;
    if (filters.sizes.length > 0 && !filters.sizes.includes(p.size)) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.onSaleOnly && !p.onSale) return false;

    return true;
  });

  // B. Sorting
  if (filters.sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // C. Update Title
  const titleEl = document.getElementById("search-result-title");
  if (filters.searchQuery) {
    titleEl.textContent = `RESULT FOR " ${filters.searchQuery.toUpperCase()} "`;
  } else if (filters.category !== "all") {
    titleEl.textContent = `RESULT FOR " ${filters.category.toUpperCase()} "`;
  } else {
    titleEl.textContent = 'RESULT FOR " FURNITURE "';
  }

  renderActiveBadges();

  // D. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

  if (pagination.currentPage > totalPages && totalPages > 0) {
    pagination.currentPage = totalPages;
  }

  const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const end = Math.min(start + pagination.itemsPerPage, totalItems);
  const paginated = filtered.slice(start, end);

  // E. Counter display
  const countText = totalItems > 0
    ? `SHOWED ${start + 1} - ${end} OF ${totalItems} PRODUCTS`
    : `SHOWED 0 OF 0 PRODUCTS`;
  document.getElementById("results-count-text").textContent = countText;
  document.getElementById("pagination-results-count-text").textContent = countText;

  // F. Render Grid Cards
  container.innerHTML = "";
  if (paginated.length === 0) {
    container.innerHTML = `
      <div class="no-products-found" style="grid-column: 1/-1; text-align: center; padding: 3rem 0;">
        <i class="fa-solid fa-face-frown" style="font-size: 2.5rem; color: var(--color-grey-500); margin-bottom: 1rem;"></i>
        <h3>No matching results.</h3>
        <button class="btn btn-outline btn-sm" id="reset-catalog-filters-btn" style="margin-top: 1rem;">Reset Filters</button>
      </div>
    `;
    document.getElementById("reset-catalog-filters-btn").addEventListener("click", () => resetAllFilters());
    renderPagination(0);
    return;
  }

  paginated.forEach(p => {
    container.appendChild(createProductCardElement(p, { includeListActions: true }));
  });

  attachProductListeners(container);
  renderPagination(totalPages);
}

// Render active filter badges
function renderActiveBadges() {
  const listEl = document.getElementById("active-filters-badges");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (filters.category !== "all") {
    createBadge("Category: " + filters.category, () => {
      filters.category = "all";
      const links = document.querySelectorAll(".category-filter-list .filter-link");
      links.forEach(l => l.classList.remove("active"));
      updateCatalog();
    });
  }

  if (filters.materials.length > 0) {
    filters.materials.forEach(mat => {
      createBadge("Material: " + mat, () => {
        filters.materials = filters.materials.filter(m => m !== mat);
        document.querySelectorAll(".material-checkbox").forEach(cb => {
          if (cb.value === mat) cb.checked = false;
        });
        updateCatalog();
      });
    });
  }

  if (filters.sizes.length > 0) {
    filters.sizes.forEach(sz => {
      createBadge("Size: " + sz, () => {
        filters.sizes = filters.sizes.filter(s => s !== sz);
        document.querySelectorAll(".size-checkbox").forEach(cb => {
          if (cb.value === sz) cb.checked = false;
        });
        updateCatalog();
      });
    });
  }

  if (filters.maxPrice < 3000) {
    createBadge(`Under $${filters.maxPrice}`, () => {
      filters.maxPrice = 3000;
      const slider = document.getElementById("price-slider");
      slider.value = 3000;
      document.getElementById("price-max-display").textContent = "3000";
      updateCatalog();
    });
  }

  function createBadge(text, removeCallback) {
    const badge = document.createElement("span");
    badge.className = "filter-badge";
    badge.innerHTML = `${text} <button><i class="fa-solid fa-xmark"></i></button>`;
    badge.querySelector("button").addEventListener("click", removeCallback);
    listEl.appendChild(badge);
  }
}

// Pagination Rendering
function renderPagination(totalPages) {
  const pagEl = document.getElementById("shop-pagination");
  if (!pagEl) return;

  pagEl.innerHTML = "";
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className = `page-link ${pagination.currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  prevBtn.addEventListener("click", () => {
    if (pagination.currentPage > 1) {
      pagination.currentPage--;
      updateCatalog();
    }
  });
  pagEl.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement("button");
    link.className = `page-link ${pagination.currentPage === i ? 'active' : ''}`;
    link.textContent = i < 10 ? `0${i}` : i;
    link.addEventListener("click", () => {
      pagination.currentPage = i;
      updateCatalog();
    });
    pagEl.appendChild(link);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = `page-link ${pagination.currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  nextBtn.addEventListener("click", () => {
    if (pagination.currentPage < totalPages) {
      pagination.currentPage++;
      updateCatalog();
    }
  });
  pagEl.appendChild(nextBtn);
}

// Reset Catalog Sidebar Filters
function resetAllFilters() {
  filters = {
    category: "all",
    searchQuery: "",
    materials: [],
    sizes: [],
    maxPrice: 3000,
    freeShippingOnly: false,
    onSaleOnly: false,
    sort: "default",
    viewMode: filters.viewMode
  };

  document.getElementById("search-input").value = "";
  document.querySelectorAll(".material-checkbox").forEach(cb => cb.checked = false);
  document.querySelectorAll(".size-checkbox").forEach(cb => cb.checked = false);

  const slider = document.getElementById("price-slider");
  slider.value = 3000;
  document.getElementById("price-max-display").textContent = "3000";
  document.getElementById("on-sale-filter-btn").classList.remove("active");
  document.getElementById("sort-select").value = "default";

  document.querySelectorAll(".category-filter-list .filter-link").forEach(l => l.classList.remove("active"));

  pagination.currentPage = 1;
  updateCatalog();
}

// Helper to attach Dynamic Card Triggers
function attachProductListeners(container) {
  container.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(btn.getAttribute("data-id"));
    });
  });

  container.querySelectorAll(".add-wishlist-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(btn.getAttribute("data-id"));
    });
  });
}

// ==========================================================================
// PRODUCT DETAIL PAGE
// ==========================================================================
function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  if (!product) return;

  // ── Basic fields ──
  document.getElementById("page-title").textContent = `FURNITUR | ${product.displayName}`;
  document.getElementById("product-breadcrumb-name").textContent = product.displayName;
  document.getElementById("product-title").textContent = product.displayName;
  document.getElementById("product-detail-stars").innerHTML = getStarsHtml(product.rating);
  document.getElementById("product-detail-price").textContent = `$${product.price.toFixed(2)}`;

  const saleBadge = document.getElementById("sale-badge");
  if (product.discount) {
    saleBadge.classList.remove("hidden");
  } else {
    saleBadge.classList.add("hidden");
  }

  // Decorative social-proof line (stable per-product, not tied to real analytics)
  const soldCount = 150 + (product.id.replace(/\D/g, "") * 37) % 400;
  const watchedCount = (soldCount * 12).toLocaleString();
  document.getElementById("product-social-proof").textContent =
    `${soldCount} products sold  •  ${(watchedCount / 1000).toFixed(1)}k products watched`;

  document.getElementById("review-form-sub").textContent = `About ${product.displayName.toLowerCase()}`;

  // ── Gallery: reuse the same image for the main view + thumbnails ──
  const mainImg = document.getElementById("product-main-image");
  mainImg.src = product.image;
  mainImg.alt = product.name;

  const thumbsContainer = document.getElementById("gallery-thumbs");
  thumbsContainer.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const thumb = document.createElement("div");
    thumb.className = `gallery-thumb${i === 0 ? " active" : ""}`;
    thumb.innerHTML = `<img src="${product.image}" alt="${product.name} thumbnail ${i + 1}">`;
    thumb.addEventListener("click", () => {
      thumbsContainer.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      mainImg.src = product.image;
    });
    thumbsContainer.appendChild(thumb);
  }

  // ── Variant controls ──
  const typeSelect = document.getElementById("variant-type-select");
  const sizeToType = { S: "Short", M: "Regular", L: "Long" };
  typeSelect.value = sizeToType[product.size] || "Regular";

  document.querySelectorAll(".swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      document.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
    });
  });

  // ── Quantity stepper ──
  let quantity = 1;
  const qtyValueEl = document.getElementById("qty-value-detail");
  document.getElementById("qty-minus-detail").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyValueEl.textContent = quantity;
    }
  });
  document.getElementById("qty-plus-detail").addEventListener("click", () => {
    quantity++;
    qtyValueEl.textContent = quantity;
  });

  // ── Buy now / Add to cart / Wishlist ──
  document.getElementById("detail-add-cart-btn").addEventListener("click", () => {
    for (let i = 0; i < quantity; i++) addToCart(product.id);
  });
  document.getElementById("detail-buy-now-btn").addEventListener("click", () => {
    for (let i = 0; i < quantity; i++) addToCart(product.id);
  });

  const wishlistBtnDetail = document.getElementById("detail-wishlist-btn");
  const syncWishlistBtn = () => {
    const active = wishlist.includes(product.id);
    wishlistBtnDetail.classList.toggle("active", active);
    wishlistBtnDetail.querySelector("i").className = active ? "fa-solid fa-heart" : "fa-regular fa-heart";
  };
  syncWishlistBtn();
  wishlistBtnDetail.addEventListener("click", () => {
    toggleWishlist(product.id);
    syncWishlistBtn();
  });

  // ── Description + features (generic copy referencing this product) ──
  document.getElementById("product-description-text").textContent =
    `Introducing our ${product.displayName.toLowerCase()} - a sleek and stylish addition to any modern home. `
    + `With its clean lines and simple design, this piece is perfect for those who value both form and function. `
    + `Crafted from ${product.material.toLowerCase()}, it blends seamlessly into any living space while ensuring `
    + `lasting comfort and durability. Versatile and adaptable, it can be customized to suit your personal style, `
    + `making it a timeless and practical piece that will elevate any room.`;

  const featuresList = document.getElementById("product-features-list");
  featuresList.innerHTML = `
    <li>Sleek design with a sturdy, well-balanced frame.</li>
    <li>Made from premium ${product.material.toLowerCase()} for lasting durability.</li>
    <li>Available in ${product.size} size to fit your space.</li>
    <li>${product.shipping === "free" ? "Ships free, straight to your door." : "Affordable shipping options available at checkout."}</li>
    <li>Practical, versatile, and built to last for years to come.</li>
  `;

  // ── Tabs ──
  document.querySelectorAll(".tab-link").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
      tabBtn.classList.add("active");
      const target = tabBtn.getAttribute("data-tab");
      document.getElementById("tab-panel-detail").classList.toggle("hidden", target !== "detail");
      document.getElementById("tab-panel-delivery").classList.toggle("hidden", target !== "delivery");
    });
  });

  // ── Best combined with: related products (same category first, then featured, excluding self) ──
  const combinedContainer = document.getElementById("combined-products-container");
  const related = PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter(p => p.id !== product.id && p.featured && p.category !== product.category))
    .slice(0, 3);

  combinedContainer.innerHTML = "";
  related.forEach(p => {
    combinedContainer.appendChild(createProductCardElement(p));
  });
  attachProductListeners(combinedContainer);

  // ── Static reviews (illustrative; not tied to real backend data) ──
  const reviews = [
    {
      name: "Val Purvis", date: "July 23, 2026", rating: 5, avatar: "https://i.pravatar.cc/80?img=12",
      text: `I love my new ${product.displayName.toLowerCase()}! The clean lines and premium finish make it a great addition to my living room, and it's every bit as comfortable as it looks. Highly recommend!`
    },
    {
      name: "Phoebe Kunis", date: "July 23, 2026", rating: 4, avatar: "https://i.pravatar.cc/80?img=32",
      text: "Perfect centerpiece for my home. Its minimalist design fits perfectly with my aesthetic, and the high-quality materials mean it will last for years to come."
    },
    {
      name: "Dianne Russell", date: "July 23, 2026", rating: 5, avatar: "https://i.pravatar.cc/80?img=45",
      text: "This is a game-changer for my space. Its minimalist design fits perfectly with my aesthetic, and the durable materials make it a worthwhile investment... "
    },
    {
      name: "Kendall Mckernan", date: "July 23, 2026", rating: 5, avatar: "https://i.pravatar.cc/80?img=5",
      text: "I can't get enough of it! The build quality and finish make it perfect for everyday use, and the sleek design adds a touch of sophistication to..."
    }
  ];

  const reviewsList = document.getElementById("reviews-list");
  reviewsList.innerHTML = "";
  reviews.forEach(r => {
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `
      <div class="review-item-header">
        <img class="review-avatar" src="${r.avatar}" alt="${r.name}">
        <div class="review-meta">
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
        <div class="review-item-stars">${getStarsHtml(r.rating)}</div>
      </div>
      <div class="review-title">Great Product</div>
      <p class="review-text">${r.text} <a href="#" class="review-read-more">Read more</a></p>
    `;
    reviewsList.appendChild(item);
  });

  // ── Review form submit (front-end only demo) ──
  const reviewForm = document.getElementById("review-form");
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you for your review! It has been submitted for approval.");
    reviewForm.reset();
  });

  // ── Promo strip CTA ──
  const promoStripBtn = document.getElementById("promo-strip-btn");
  if (promoStripBtn) {
    promoStripBtn.addEventListener("click", () => {
      window.location.href = "search.html";
    });
  }
}

// ==========================================================================
// WISHLIST CONTROLS
// ==========================================================================
function initWishlist() {
  updateWishlistBadge();

  const wishlistBtn = document.getElementById("wishlist-btn");
  wishlistBtn.addEventListener("click", () => {
    if (wishlist.length === 0) {
      alert("Your Love list is currently empty!");
    } else {
      alert(`Your Love List (${wishlist.length}):\n` +
        wishlist.map(id => PRODUCTS.find(p => p.id === id)?.name).join("\n")
      );
    }
  });
}

function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
  } else {
    wishlist.splice(idx, 1);
  }

  localStorage.setItem("furnitur_wishlist", JSON.stringify(wishlist));
  updateWishlistBadge();

  const isNowActive = wishlist.includes(productId);

  /* ── Sync every visible button for this product in-place (no re-render) ── */
  document.querySelectorAll(`.add-wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle("active", isNowActive);
    btn.querySelector("i").className = isNowActive
      ? "fa-solid fa-heart"
      : "fa-regular fa-heart";
  });

  /* ── Product detail page: also sync the dedicated detail button ── */
  if (isProductPage) {
    const detailBtn = document.getElementById("detail-wishlist-btn");
    if (detailBtn) {
      detailBtn.classList.toggle("active", isNowActive);
      detailBtn.querySelector("i").className = isNowActive
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";
    }
  }

  /* ── No re-render needed — DOM is already updated in-place above ── */
}

function updateWishlistBadge() {
  document.getElementById("wishlist-count").textContent = wishlist.length;
}

// ==========================================================================
// PERSISTENT SHOPPING CART
// ==========================================================================
function initCart() {
  const cartBtn = document.getElementById("cart-btn");
  const cartCloseBtn = document.getElementById("cart-close-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartBtn.addEventListener("click", () => openCart());
  cartCloseBtn.addEventListener("click", () => closeCart());
  cartOverlay.addEventListener("click", () => closeCart());

  checkoutBtn.addEventListener("click", () => {
    alert("Thank you for your purchase! Checkout process simulation successful.");
    cart = [];
    saveCart();
    closeCart();
  });

  updateCartUI();
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("active");
  document.getElementById("cart-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("active");
  document.getElementById("cart-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  openCart();
}

function updateCartQuantity(productId, amount) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
  }
}

function removeCartItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function saveCart() {
  localStorage.setItem("furnitur_cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartList = document.getElementById("cart-items-list");
  const subtotalPriceEl = document.getElementById("cart-total-price");
  const footerEl = document.getElementById("cart-summary-footer");

  // Total quantities
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalQty;
  document.getElementById("cart-drawer-count").textContent = totalQty;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-bag-shopping empty-icon"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    footerEl.classList.add("hidden");
    return;
  }

  footerEl.classList.remove("hidden");
  let subtotal = 0;

  cart.forEach(cartItem => {
    const product = PRODUCTS.find(p => p.id === cartItem.id);
    if (!product) return;

    const price = product.price;
    const itemTotal = price * cartItem.quantity;
    subtotal += itemTotal;

    const li = document.createElement("div");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title-row">
          <h4 class="cart-item-title">${product.displayName}</h4>
          <button class="cart-item-remove" data-id="${product.id}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="cart-item-options">
          Size: ${product.size} | Material: ${product.material}
        </div>
        <div class="cart-item-price-row">
          <div class="quantity-adjuster">
            <button class="qty-btn qty-minus" data-id="${product.id}">-</button>
            <span class="qty-value">${cartItem.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${product.id}">+</button>
          </div>
          <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
        </div>
      </div>
    `;

    li.querySelector(".cart-item-remove").addEventListener("click", () => removeCartItem(product.id));
    li.querySelector(".qty-minus").addEventListener("click", () => updateCartQuantity(product.id, -1));
    li.querySelector(".qty-plus").addEventListener("click", () => updateCartQuantity(product.id, 1));

    cartList.appendChild(li);
  });

  subtotalPriceEl.textContent = `$${subtotal.toFixed(2)}`;
}


// ── REVIEWS CAROUSEL (Home page only) ──
if (document.getElementById('reviews-track')) {
  const track = document.getElementById('reviews-track');
  const dots = document.querySelectorAll('.carousel-dots-container .dot');
  const slides = document.querySelectorAll('.review-slide-box');
  const total = slides.length;
  let current = 1;        // start at middle (active) slide
  let autoTimer = null;

  function goToSlide(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;

    slides.forEach((slide, i) => {
      slide.classList.remove('active-slide', 'prev-slide', 'next-slide', 'far-slide');
      const diff = i - current;

      if (diff === 0) slide.classList.add('active-slide');
      else if (diff === -1 || diff === total - 1) slide.classList.add('prev-slide');
      else if (diff === 1 || diff === -(total - 1)) slide.classList.add('next-slide');
      else slide.classList.add('far-slide');
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('next-slide')) goToSlide(current + 1);
      if (slide.classList.contains('prev-slide')) goToSlide(current - 1);
      resetAuto();
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(+dot.dataset.slide);
      resetAuto();
    });
  });

  function startAuto() {
    autoTimer = setInterval(() => goToSlide(current + 1), 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  goToSlide(1);
  startAuto();
}

// Color swatches — change gallery circle color on click
document.querySelectorAll('.swatch').forEach(swatch => {
  const defaultSwatch = document.querySelector('.swatch.active');
  if (defaultSwatch) {
    document.querySelector('.gallery-main')
      .style.setProperty('--circle-color', defaultSwatch.style.background);
  }
  swatch.addEventListener('click', () => {

    // 1. update active swatch
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');

    // 2. get the swatch background color
    const color = swatch.style.background;

    // 3. apply it to the gallery circle via CSS variable
    document.querySelector('.gallery-main').style.setProperty('--circle-color', color);
  });
});
const defaultSwatch = document.querySelector('.swatch.active');
if (defaultSwatch) {
  document.querySelector('.gallery-main')
    .style.setProperty('--circle-color', defaultSwatch.style.background);
}