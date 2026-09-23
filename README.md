# Abron

Abron is a React food ordering web app for browsing Ethiopian dishes, managing a cart, placing orders, and maintaining a restaurant menu. It includes a customer storefront and a separate admin area, with light and dark themes.

## Features

- Browse and search dishes by category, availability, and other filters.
- View dish details, save favorites, and add items to the cart.
- Complete checkout with delivery details and payment options.
- View order history and order status.
- Manage dishes, availability, and orders from the admin dashboard.
- Switch between light and dark themes; the theme preference is saved in the browser.
- Keep cart, favorites, menu, and order data in browser storage for local use.

## Requirements

- Node.js and npm

## Get started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Admin dashboard

Open `/admin/login` and sign in with the demo account:

- Email: `admin@abron.com`
- Password: `admin123`

The admin dashboard includes sales summaries, charts, dish inventory controls, and an order tracker. Authentication and data are implemented as local demo behavior; use a secure server-side auth and data service before deploying this app for real operations.

## Routes

| Path | Page |
| --- | --- |
| `/` | Customer home and featured dishes |
| `/menu` or `/search` | Dish catalog and search |
| `/menu/:id` or `/product/:id` | Dish details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/order-confirmed` | Order confirmation and tracking |
| `/orders` | Order history |
| `/favorites` | Saved dishes |
| `/profile` | Customer profile and preferences |
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Admin overview |
| `/admin/dishes` | Dish management |
| `/admin/orders` | Order management |
| `/admin/settings` | Admin profile settings |

## Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Project layout

- `src/pages/` — customer home, search, profile, and product pages
- `src/components/` — navigation, hero, footer, dish cards, and shared UI
- `src/cart/`, `src/checkout/`, `src/orders/`, `src/favorites/` — customer ordering flows
- `src/admin/` — admin login, dashboard, dish and order management
- `src/theme/` — theme context, palette, and global theme styles
- `src/api/` — menu data and local API helpers

## Tech stack

React, Vite, React Router, Tailwind CSS, Recharts, and React Icons.
