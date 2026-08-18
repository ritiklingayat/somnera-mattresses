# Somnera Mattress

Somnera is a responsive React and Vite storefront with a session-based commerce demo and a separate, modular admin console.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. The admin console is at `http://127.0.0.1:5173/admin`.

Demo admin access: `admin` / `admin`.

## Commands

```bash
npm run dev     # Start the Vite development server
npm run build   # Create a production build
```

## Project structure

```text
src/
  admin/
    components/       Reusable admin UI (modal, status badge, order table)
    constants/        Navigation and order status constants
    data/             Seed data and module configurations
    hooks/            Admin route state hook
    layouts/          Admin shell/sidebar layout
    pages/            Independent admin page modules
  assets/images/      Brand and product images
  components/         Storefront-wide components
  config/             Site-level configuration
  data/               Storefront catalog data
  pages/              Storefront screens and page styles
  styles/             Global tokens, typography and base styles
```

## Admin architecture

The `/admin` route is independent from the storefront and uses hash-based module routing:

- `#overview` — dashboard metrics and recent orders
- `#orders` — filtering, status updates, invoice printing and cancellation
- `#products` — product listing and add-product modal
- `#customers`, `#coupons`, `#reviews`, `#leads`, `#settings` — independent modules with working local forms

To add an admin page, create a component in `src/admin/pages`, add its route to `src/admin/constants/navigation.js`, then map the route in `src/pages/AdminPanel.jsx`.

## Design and code standards

- Use PascalCase for React component file names and camelCase for functions, values and hooks.
- Keep reusable UI in `src/admin/components` or `src/components`; do not duplicate controls in pages.
- Keep content and seed data outside of UI components where possible.
- Prefer accessible labels, semantic buttons and keyboard-friendly form controls.
- Use existing CSS variables from `src/styles/variables.css` for storefront colors and the admin variables in `AdminPanel.css` for console UI.

## Changing content

- Product information: `src/data/productsData.js`
- Store contact details: `src/config/siteConfig.js`
- Storefront theme: `src/styles/variables.css`
- Admin seed orders/module labels: `src/admin/data/seedData.js`
- Images: `src/assets/images/`

## Backend integration TODO

The current implementation is a frontend demonstration. To make it production-ready, connect the existing UI to APIs for JWT authentication, role/permission checks, persistent orders/products/customers, Razorpay payment/refunds, image uploads, analytics, SEO generation, rate limiting, and server-side validation.
