## Ecoyaan Checkout Flow (Next.js)

Simple checkout flow built with **Next.js (Pages Router)**, **React**, and **Redux Toolkit**.

### What it includes

- **Products page** – shows mock products from a Next.js API route with SSR.
- **Cart page** – shows added items, quantity selector, remove button, order summary.
- **Shipping page** – address form with basic validation (required, email, 10‑digit phone).
- **Payment page** – final summary, simulated “Pay Securely” and “Order Successful” state.

### How to run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Key files

- `pages/index.js` – Products (SSR from `/api/cart`).
- `pages/cart.js` – Cart items + order summary.
- `pages/checkout/shipping.js` – Shipping form.
- `pages/checkout/payment.js` – Payment / success.
- `pages/api/cart.js` – Mock cart JSON.
- `store/slices/*` – Redux slices for cart + checkout.
