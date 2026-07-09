# Furnitur — E-Commerce Front-End

A multi-page furniture store front-end built with HTML, CSS, and JavaScript (no framework, no build step). Home, search/catalog, and product detail pages share one design system and one data-driven JS file.

## Project Structure

```
furnitur/
├── index.html          Home page (hero, featured products, testimonials)
├── search.html          Shop / catalog page (filters, sort, grid & list view)
├── product.html          Product detail page (gallery, variants, reviews)
├── search.css          Shared design tokens + styles for search.html
├── product.css          Styles specific to product.html
├── app.js               Shared logic for all pages (data, cart, wishlist, rendering)
└── assets/               Images (logo, product photos, hero banner)
```

> `search.css` currently holds the shared design tokens (`:root` variables, reset, buttons, header, footer, cart drawer). `product.css` re-declares the same tokens so `product.html` can be opened on its own. If you'd rather not duplicate tokens, pull the `:root` block, reset, `.btn*`, header, mobile-nav, footer, and cart-drawer rules out of both files into a new `base.css` and link it before the page-specific stylesheet on every page.

## Pages

### `index.html` — Home
- Hero banner, tabbed featured-products grid, testimonial carousel, promo banner (`promo-banner-section`).
- Featured products render dynamically from the `PRODUCTS` array via `renderFeaturedProducts()`.

### `search.html` — Shop / Catalog
- Sidebar filters: category, material, size, price range, on-sale toggle.
- Sort dropdown (price, alphabetical) and grid/list view toggle.
- Pagination, active-filter badges, and a `catalog-promo-inset` banner.
- All catalog rendering goes through `updateCatalog()`.

### `product.html` — Product Detail
- Image gallery with clickable thumbnails.
- Variant controls: type dropdown, quantity stepper, color swatches.
- Buy Now / Add to Cart / Wishlist actions.
- "Best Combined With" related-products row.
- Product Detail / Delivery & Return tabs.
- Review form + static review list.
- "Why Choose Us" icon grid and a full-width promo strip.
- Populated entirely from one product record via `initProductPage()` — see **Linking to a product** below.

## How Pages Connect

Every product card (on Home, Search, and the "Best Combined With" row) is built by the shared helper `createProductCardElement(p)` in `app.js`. Clicking anywhere on a card (outside its buttons) navigates to:

```
product.html?id=<productId>
```

`product.html` reads that `id` from the URL on load and looks up the matching entry in `PRODUCTS`. If the id is missing or invalid, it falls back to the first product in the array so the page never breaks.

To link to a product manually (e.g. from a custom banner or menu), just point an anchor or button at:

```html
<a href="product.html?id=p1">View Urban Lux High Chair</a>
```

## Data Model — `PRODUCTS` (in `app.js`)

Every product card, filter, and the product detail page all read from one array. Add a new product by pushing an object with this shape:

```js
{
  id: "p13",                 // unique, used in the URL (?id=p13) and as a DOM data attribute
  name: "Internal Name",      // used for search matching
  displayName: "SHOWN NAME",  // shown in the UI, usually uppercase
  category: "chair",          // must match a sidebar filter value (chair, sofa, couch, table, lamp, ...)
  price: 1999.99,
  rating: 5,                  // 1–5, drives the star icons
  image: "assets/products/example.png",
  material: "Oak wood",       // must match a materials-filter checkbox value to be filterable
  size: "M",                  // S / M / L — must match a size-filter checkbox value
  discount: 20,                // omit or set to 0/undefined to hide the "ON SALE" badge
  featured: true,              // true = eligible for Home page + "Best Combined With"
  shipping: "free",            // "free" | "paid" — only affects copy text, not real logic
  hanging: false                // true = image is top-aligned/contain instead of cropped (for pendant lights etc.)
}
```

No other file needs to change when you add a product — cards, filters, cart, wishlist, and the product page all derive from this array automatically.

## Core JS Modules (`app.js`)

| Function | Responsibility |
|---|---|
| `createProductCardElement(p, options)` | Builds one product card DOM node; used by Home, Search, and related-products. Handles card-click navigation to `product.html`. |
| `renderFeaturedProducts(categoryFilter)` | Renders the Home page's featured grid. |
| `updateCatalog()` | Filters, sorts, paginates, and renders the Search page grid/list. |
| `initProductPage()` | Reads `?id=`, populates every section of `product.html` from the matched product. |
| `attachProductListeners(container)` | Wires Add-to-Cart / Wishlist buttons inside a freshly-rendered container. |
| `addToCart(id)` / `updateCartQuantity()` / `removeCartItem()` | Cart state, persisted to `localStorage` under `furnitur_cart`. |
| `toggleWishlist(id)` | Wishlist state, persisted to `localStorage` under `furnitur_wishlist`. |
| `initSearchPage()` | Wires all sidebar filters, sort, view toggle, and pagination clicks. |

State (`cart`, `wishlist`, `filters`, `pagination`) is held in memory and synced to `localStorage` on every cart/wishlist change, so both persist across page reloads and across pages (Home ↔ Search ↔ Product).

## Design Tokens (CSS custom properties)

Defined in `:root` at the top of `search.css` / `product.css`:

```css
--color-primary: #2d2d2b;      /* near-black, main text/button color */
--color-secondary: #c5a880;    /* warm tan accent */
--color-danger: #d84b4b;       /* sale badges, remove icons */
--font-sans: 'Outfit', sans-serif;
--font-serif: 'Playfair Display', Georgia, serif;
--spacing-xs … --spacing-xxl   /* 0.25rem → 4rem spacing scale */
--max-width: 1440px;           /* .container max width */
```

Change a color or spacing value once here and it updates everywhere that uses the variable — cards, buttons, header, footer, etc.

## Responsive Breakpoints

All pages use the same breakpoint ladder:

| Breakpoint | Behavior |
|---|---|
| `1200px` | Sidebar/product-grid columns reduce; promo sections switch from 3-col to a 2-col or stacked layout. |
| `992px` | Search page sidebar hides; shop layout becomes single column. |
| `768px` | Header collapses to the mobile menu/drawer; grids go to 1–2 columns; promo images reposition top-right with text pushed below. |
| `480px` | Final font-size and spacing reductions for small phones. |

The promo sections (`promo-banner-section`, `promo-strip-section`, `catalog-promo-inset`) use a shared **image-bleed technique**: the section has `overflow: visible`, and the image column uses a tall fixed height plus a negative `margin-bottom` (or `position: absolute` bleed) so the product photo visually overflows past the section's edge. On mobile this switches to the image pinned top-right via `position: absolute`, with the text/CTA pulled up underneath it using a negative `margin-top`.

