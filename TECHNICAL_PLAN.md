# Abron React — Technical Plan & High-Level Design (HLD)

**Project**: Abron — A React Frontend for a Food-Ordering App in Addis Ababa, Gerji.

---

## 1. State Management Approach

In accordance with the project brief guidelines (_"place state in the lowest component that contains all consumers, nothing global by default"_), state is divided into logical scopes:

| State Layer                      | Scope & Tool                         | Purpose & Consumers                                                                                   |
| -------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Selected Category & Query**    | URL (`useSearchParams`)              | Shareable, bookmarkable, and survives page refresh. Read by `/menu` (Search page) and category pills. |
| **Catalog & Inventory Store**    | `ShopContext.jsx` + `localStorage`   | Seeded from `menu-data.json`. Read and updated by Home, Menu, Dish Detail, and Admin Menu CRUD.       |
| **Cart & Order Items Store**     | `ShopContext.jsx` + `localStorage`   | Survives refresh. Read by Header Badge, Cart page, Checkout, and DishDetailModal.                     |
| **Favorites / Wishlist**         | `ShopContext.jsx` + `localStorage`   | Toggled by heart buttons on dish cards, read by `/favorites` and Header badge.                        |
| **Order History & Status**       | `ShopContext.jsx` + `localStorage`   | Appended upon checkout. Read by `/orders`, live tracking (`/order-confirmed`), and Admin Orders.      |
| **Area Delivery Fee Calculator** | `ShopContext.jsx` (derived)          | Dynamically computed based on selected sub-city (Bole, Kazanchis, Sarbet, Piassa, Gerji, CMC).        |
| **Theme Preference**             | `ThemeContext.jsx` + `localStorage`  | Dark / Light theme persisted in `localStorage` (`abron_theme`) and applied to `<html>` root.          |
| **Authentication & Sessions**    | `AuthContext.jsx` + `sessionStorage` | Guards Admin dashboard and maintains customer profile credentials.                                    |
| **Local / UI Ephemeral State**   | Component `useState`                 | Modal toggles, form fields, active tabs, filter flags, and quantity steppers.                         |

---

## 2. Component Tree

```
App
├── ToastContainer
├── ThemeProvider (Dark / Light Mode)
│   └── AuthProvider (Admin & Customer Sessions)
│       └── ShopContextProvider (Cart, Products, Orders, Favorites, Delivery Fees)
│           └── Routes
│               │
│               ├── Customer Routes (wrapped in MobileAppShell)
│               │   ├── / (HomePage)
│               │   │   ├── Header (Logo, Desktop Nav, ThemeToggle, CartBadge)
│               │   │   ├── Hero (Greeting, Quick Search, Promo Chip, Highlights)
│               │   │   ├── ProductList (Category Pills [Ethiopian, Pizza, Burgers, Drinks], Filters, Dish Cards)
│               │   │   ├── DishDetailModal (Popup modal on card click)
│               │   │   └── Footer (Branding, Navigation, Centered Social Icons)
│               │   │
│               │   ├── /menu & /search (Search / Catalog Page)
│               │   │   ├── Live Search Input & URL SearchParams Sync
│               │   │   ├── Category Pills (Reflected in URL query string)
│               │   │   ├── Filter Toggles (Available Today, Spicy) & Sort Dropdown
│               │   │   ├── Dish Cards Grid & UnavailabilityOverlay
│               │   │   └── DishDetailModal
│               │   │
│               │   ├── /menu/:id & /product/:id (Product Details)
│               │   │   ├── High-res Dish Showcase & Spicy Tag
│               │   │   ├── Ingredients, Nutritional info, Preparation Time
│               │   │   └── Quantity Controls & Add to Cart
│               │   │
│               │   ├── /cart (Cart Page)
│               │   │   ├── Cart Item Lines (+ / - steppers, Remove action)
│               │   │   ├── Promo Code Form (e.g. ABRON20)
│               │   │   ├── Subtotal, Delivery Fee & Running ETB Total
│               │   │   └── Checkout CTA Button
│               │   │
│               │   ├── /checkout (Checkout Page)
│               │   │   ├── Validated Customer Form (Name, Ethiopian Phone format, Area)
│               │   │   ├── Area Delivery Fee Calculator (Bole, Kazanchis, Sarbet, etc.)
│               │   │   ├── Dynamic Payment Forms (Telebirr, CBE Birr, Card, Cash)
│               │   │   └── Place Order Action -> /order-confirmed
│               │   │
│               │   ├── /order-confirmed (Order Tracking Page)
│               │   │   ├── Live 4-Step Stepper (Placed -> Preparing -> On Way -> Delivered)
│               │   │   ├── Real Ordered Items Breakdown with Prices
│               │   │   └── Delivery Address, Estimated Time & Payment Method
│               │   │
│               │   ├── /favorites (Saved Favorites Page)
│               │   │   ├── 1-Click Ordering and Quick Removal
│               │   │   └── Empty State linking to Menu
│               │   │
│               │   ├── /orders (Order History Page)
│               │   │   ├── Active Orders with Live Status Progression
│               │   │   ├── Past Orders with Itemized Receipts
│               │   │   └── 1-Click Instant Reorder Action
│               │   │
│               │   └── /profile (Customer Profile Page)
│               │       ├── Saved Addresses Management
│               │       └── Payment Preferences & Notification Settings
│               │
│               ├── Admin Guarded Route Group (/admin)
│               │   ├── /admin/login (Admin Credentials Gate)
│               │   └── <RequireAdmin>
│               │       └── AdminLayout (Sidebar Navigation, ThemeToggle, Admin Profile)
│               │           ├── /admin & /admin/dashboard (Revenue, Order Count, Top Dishes, Status Chart)
│               │           ├── /admin/menu & /admin/dishes (Dish CRUD, Search, Stock Toggle)
│               │           ├── /admin/orders (Order List, Status Pipeline, Delete)
│               │           └── /admin/settings (Store Operations & Hours)
│               │
│               └── 404 (NotFound Page)
```

---

## 3. Folder Structure

The application follows the recommended feature-based architecture from the Day 35 project brief:

```
abron-react/
├── public/
│   ├── images/               # Authentic Ethiopian food photography
│   └── menu-data.json        # Seed catalog data standing in for backend API
│
├── src/
│   ├── admin/                # Admin Extension Feature Group
│   │   ├── AdminLayout.jsx   # Nested layout with sidebar & <Outlet />
│   │   ├── AdminLogin.jsx    # Feature 1: Admin Login gate
│   │   ├── AdminSettings.jsx # Restaurant operations & hours
│   │   ├── Dashboard.jsx     # Features 3–5: Analytics, Top dishes, Status distribution
│   │   ├── DishManager.jsx   # Features 6–10: View, Add, Edit, Delete, Stock control
│   │   ├── OrderManager.jsx  # Features 11–14: Order pipeline, details, status update
│   │   ├── RequireAdmin.jsx  # Route guard for /admin group
│   │   └── useAdminAuth.js   # Session management hook
│   │
│   ├── auth/                 # Authentication & Session Store
│   │   └── AuthContext.jsx   # AuthProvider, useAuth hook
│   │
│   ├── cart/                 # Cart Feature
│   │   └── Cart.jsx          # Cart lines, steppers, promo calculation, totals
│   │
│   ├── checkout/             # Checkout Feature
│   │   └── Checkout.jsx      # Validated order form, area calculator, dynamic payment forms

│   |── favorites/            # favorite Feature
        └──FavoritesPage.jsx     # Saved favorites view & 1-click order

│   ├── components/           # Shared & Customer Components
│   │   ├── DishDetailModal.jsx   # Interactive popup modal on dish card click
│   │   ├── Footer.jsx            # Modern footer with centered social icons
│   │   ├── Hero.jsx              # Responsive hero section with greeting & search
│   │   ├── MobileAppShell.jsx    # Sticky topbar & 5-tab fixed mobile bottom navigation
│   │   ├── ProductList.jsx       # Menu listing with category pills & filters
│   │   ├── ShopContext.jsx       # Single source of truth for products, cart, orders, favorites
│   │   └── UnavailabilityOverlay.jsx # Out-of-stock badge & interaction guard
│   │
│   ├── orders/               # Orders Feature
│   │   ├── OrderConfirmed.jsx    # Real-time order tracking & status stepper
│   │   └── OrderHistory.jsx      # Past orders, receipts & 1-click reorder
│   │
│   ├── pages/                # Top-level Page Views
│   │   │   │   ├── HomePage.jsx          # Customer landing page
│   │   ├── NotFound.jsx          # 404 handler
│   │   ├── ProductDetails.jsx    # Dedicated dish page (/menu/:id)
│   │   ├── Profile.jsx           # Customer profile & addresses
│   │   └── Search.jsx            # Full catalog (/menu) with URL category reflection
│   │
│   ├── theme/                # Theme Feature
│   │   ├── ThemeContext.jsx      # Theme provider with localStorage persistence
│   │   └── ThemeToggle.jsx       # Reusable Sun/Moon theme switcher
│   │
│   ├── App.jsx               # Route definitions & app providers
│   ├── index.css             # Tailwind v4 directives & dark mode rules
│   └── main.jsx              # Application entry point
│
├── package.json              # React 19, Tailwind CSS v4, Vite, React Router, React Icons
├── TECHNICAL_PLAN.md         # Architecture, HLD, and requirements compliance document
└── README.md                 # Project summary and run instructions
```

---

## 4. Overall Implementation Approach & Requirements Matrix

### Customer-Facing Features (26 Total)

| #   | Feature                     | Status  | Implementation Detail                                                       |
| --- | --------------------------- | ------- | --------------------------------------------------------------------------- |
| 1   | **Browse Menu**             | ✅ Done | Fetched from `menu-data.json` with initial fallback and local persistence   |
| 2   | **Live Search**             | ✅ Done | Instant text search across name, category, and description                  |
| 3   | **Category Filter**         | ✅ Done | Filter by Ethiopian, Pizza, Burgers, Drinks, Breakfast, Sides               |
| 4   | **Add to Cart**             | ✅ Done | 1-click addition with toast confirmation and quantity tracking              |
| 5   | **Update Quantity**         | ✅ Done | Interactive `+` and `-` controls in cart, modal, and dish card              |
| 6   | **Remove from Cart**        | ✅ Done | Single-item removal with instant recalculation                              |
| 7   | **Live ETB Total**          | ✅ Done | Subtotal + Area Delivery Fee - Promo Discount calculated live               |
| 8   | **Cart Persistence**        | ✅ Done | Stored in `localStorage` (`abron_cart`) across sessions                |
| 9   | **Checkout Form**           | ✅ Done | Customer name, Ethiopian phone, delivery area, street address, instructions |
| 10  | **Form Validation**         | ✅ Done | Phone format validation (`/^(\+251\|0)?[79]\d{8}$/`), name min length       |
| 11  | **Order Confirmation**      | ✅ Done | Dedicated tracking screen with status pipeline at `/order-confirmed`        |
| 12  | **Loading States**          | ✅ Done | Smooth loading indicators and fallbacks during data fetch                   |
| 13  | **Empty States**            | ✅ Done | Custom friendly illustrations/messages for empty cart, favorites, search    |
| 14  | **Error Handling**          | ✅ Done | Handled gracefully with interactive reset buttons and notifications         |
| 15  | **Responsive Design**       | ✅ Done | Optimized for Mobile (375px+), Tablet (768px+), and Desktop (1024px+)       |
| 16  | **Order History**           | ✅ Done | Active & past orders rendered at `/orders` with itemized receipts           |
| 17  | **Favorites / Wishlist**    | ✅ Done | Heart toggles on dish cards + dedicated view at `/favorites`                |
| 18  | **Dish Detail View**        | ✅ Done | Interactive popup modal + full page at `/menu/:id`                          |
| 19  | **Reorder Action**          | ✅ Done | 1-click reorder button in `/orders` adding all items to cart                |
| 20  | **Delivery Fee Calculator** | ✅ Done | Dynamic fee based on sub-city (Bole 80, Kazanchis 100, CMC 150 ETB)         |
| 21  | **Estimated Delivery Time** | ✅ Done | Displayed at checkout and order confirmation ("30 – 45 mins")               |
| 22  | **Theme Switcher**          | ✅ Done | Persistent Light/Dark toggle in client header and admin topbar              |
| 23  | **Special Instructions**    | ✅ Done | Customer dietary and delivery notes field in Checkout                       |
| 24  | **Cart Badge Count**        | ✅ Done | Animated badge reflecting item count in topbar and bottom nav               |
| 25  | **Keyboard Accessibility**  | ✅ Done | Focus rings, accessible ARIA attributes, and keyboard navigability          |
| 26  | **Formatted Currency**      | ✅ Done | Consistent "ETB" formatting across all components                           |

---

### Admin Features (17 Total)

- **Authentication & Dashboard (5)**: Admin Login, Session Management, Real-time Analytics (Revenue, Order Count, Avg Order Value), Top Selling Dishes, Order Status Distribution Chart.
- **Menu Management CRUD (5)**: View all dishes with live search, Add new dish with spicy tag & category, Edit dish, Delete dish with confirmation, Out-of-Stock toggle.
- **Order Management (4)**: View all customer orders, Move status (Pending -> Preparing -> Delivering -> Delivered), Delete order, View full order details & customer info.
- **Data & System (3)**: Persistence in `localStorage`, Seeding from `menu-data.json`, Secure Logout.
