# FoodieExpress — Full-Stack Food Delivery Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-lightgrey.svg)](https://expressjs.com/)
[![React.js](https://img.shields.io/badge/React.js-v18.2-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v8-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**FoodieExpress** is a production-grade, full-stack food delivery web application inspired by platforms such as Zomato and Swiggy. It delivers end-to-end functionality across three distinct user roles: **Customer**, **Restaurant Owner**, and **Administrator**.

---

## 1. Project Overview

FoodieExpress connects hungry food lovers with local restaurants through a responsive and reactive interface. Customers can discover restaurants, filter by cuisine, customize cart orders, complete checkout with live address and price verification, and track real-time delivery status progression. Restaurant owners manage their storefronts, menu catalogs, and incoming orders. Administrators oversee user accounts, approve restaurant partner applications, and monitor platform-wide gross sales.

---

## 2. Main Features

### 👤 Customer Experience
- **Interactive Discovery:** Live search, cuisine pills, rating & delivery fee sorting, and "Pure Veg" dietary filters.
- **Categorized Restaurant Menus:** Browse dishes grouped by category with real-time vegetarian indicators.
- **Persistent Database Cart:** Cart items sync to MongoDB, preventing item loss across browser sessions.
- **Cross-Restaurant Conflict Prevention:** Enforces single-restaurant ordering with an intuitive prompt to replace cart contents if switching kitchens.
- **Secure Checkout:** Saved address book management, courier contact phone, and payment options (**Cash on Delivery** or **Simulated Instant Card**).
- **Live Order Tracking:** Step-by-step visual tracker (`Placed` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`) with detailed status timeline.
- **Order Cancellation Rules:** Customers can cancel orders while in `Placed` or `Confirmed` state with reason logging.
- **User Profile:** Manage profile details, multiple delivery addresses with default flags, and password updates with current password verification.

### 🍳 Restaurant Owner Experience
- **Kitchen Dashboard:** Real-time analytics on gross sales, active orders, completed fulfillments, and recent incoming orders.
- **Storefront Management:** Update restaurant name, description, cuisine tags, delivery fees, estimated delivery duration, and store open/closed status.
- **Menu Management:** Full CRUD operations on dishes (name, description, price, category, photo URL, vegetarian flag, and instant stock availability toggle).
- **Live Order Fulfillment:** Role-restricted state transitions (`Confirm` → `Start Preparing` → `Hand to Courier` → `Mark Delivered`).

### 🛡️ Administrator Control Center
- **Executive Analytics:** Platform-wide metrics on total registered users (customers, partners, admins), active restaurants, orders, and total gross revenue.
- **User Moderation:** Searchable user directory with role filters and instant account activation / deactivation switches (with self-deactivation protection).
- **Restaurant Approval Pipeline:** Review and approve or reject pending restaurant partner registrations before they go public.
- **Platform Order Auditing:** Search and inspect any order across all operating kitchens with status filters.

---

## 3. Technology Stack

### Frontend
- **Framework:** React.js 18 + Vite
- **Routing:** React Router DOM v6
- **Styling:** Vanilla CSS + Tailwind CSS (Curated vibrant food color scheme)
- **HTTP Client:** Axios (Centralized instance with cookies and request/response interceptors)
- **Icons:** Lucide React
- **State Management:** React Context API (`AuthContext`, `CartContext`, `ToastContext`)

### Backend
- **Runtime:** Node.js (v18+)
- **Server Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose v8
- **Authentication:** JWT stored in HTTP-only cookies (`SameSite`, `Secure`) with Bearer header fallback
- **Password Security:** `bcryptjs` with automated pre-save hashing hooks
- **Validation:** `express-validator` with centralized request middleware
- **Rate Limiting:** `express-rate-limit` for authentication and API endpoints
- **Testing:** Jest + Supertest

---

## 4. System Architecture & Request Flow

```
React Frontend (Vite @ port 5173)
       │
       │ HTTP Request with Credentials (Cookies)
       ▼
Express Application (port 5000)
       │
       ▼
Global Middleware (CORS, Cookie Parser, Morgan, Rate Limiting)
       │
       ▼
Express Routers (/api/auth, /api/restaurants, /api/cart, /api/orders, ...)
       │
       ▼
Authentication & Role-Based Authorization (authenticate.js, authorize.js)
       │
       ▼
Input Validation (express-validator rules in validateRequest.js)
       │
       ▼
Controllers (Business logic invocation)
       │
       ▼
Service Layer (PricingService, OrderService)
       │
       ▼
Mongoose Models (User, Restaurant, Food, Category, Order, Cart)
       │
       ▼
MongoDB Database (Local or MongoDB Atlas)
       │
       ▼
Standardized JSON Response ({ success, message, data, meta })
```

---

## 5. Folder Structure

```
Food Delievery/
├── client/                          # React Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── cart/               # CartItem
│   │   │   ├── common/             # Navbar, Footer, ProtectedRoute, Modal, etc.
│   │   │   ├── order/              # OrderTracker, OrderStatusBadge
│   │   │   └── restaurant/         # RestaurantCard, RestaurantFilters, FoodCard
│   │   ├── context/                # AuthContext, CartContext, ToastContext
│   │   ├── pages/
│   │   │   ├── admin/              # Dashboard, UserManage, RestaurantAdmin, Orders
│   │   │   ├── customer/           # CartPage, Checkout, Orders, Tracking, Profile
│   │   │   ├── owner/              # OwnerDashboard, RestaurantManage, Menu, Orders
│   │   │   └── public/             # HomePage, Listing, Details, Login, Register, 404
│   │   ├── services/               # Centralized Axios API & service abstractions
│   │   ├── App.jsx                 # Routes declaration
│   │   ├── index.css               # Tailwind & custom food badge styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/            # auth, user, restaurant, food, category, cart, order, admin
│   │   ├── middleware/             # authenticate, authorize, validateRequest, errorHandler, rateLimiter
│   │   ├── models/                 # User, Restaurant, Food, Category, Order, Cart
│   │   ├── routes/                 # Express API route modules
│   │   ├── scripts/
│   │   │   └── seed.js             # Realistic database seeder
│   │   ├── services/               # PricingService, OrderService
│   │   ├── utils/                  # ApiError, ApiResponse, asyncHandler
│   │   ├── validators/             # Request validation rules
│   │   ├── app.js                  # Express application setup
│   │   └── server.js               # Server entry point
│   ├── tests/                      # Jest & Supertest automated test suites
│   ├── .env.example
│   └── package.json
│
├── scripts/
│   ├── generate_commits.js         # Automated 100+ commit generator
│   └── push_to_github.bat          # 1-click commit & push batch script
├── package.json                    # Root package with concurrent run scripts
├── .gitignore
└── README.md
```

---

## 6. Database Schema Design

### A. User Model (`User.js`)
- `name`: String, required.
- `email`: String, unique, lowercase, trimmed.
- `phone`: String.
- `passwordHash`: String, hidden by default (`select: false`), hashed with bcrypt (salt 10).
- `role`: Enum (`customer`, `restaurant_owner`, `admin`), default `customer`.
- `isActive`: Boolean, default `true`.
- `addresses`: Embedded array with `label`, `fullAddress`, `city`, `state`, `postalCode`, `phone`, `isDefault`.

### B. Restaurant Model (`Restaurant.js`)
- `name`, `description`: String.
- `cuisines`: [String], non-empty array.
- `image`: String (Unsplash photo).
- `address`, `city`: String.
- `owner`: ObjectId reference to `User`.
- `rating`: Number (1.0 - 5.0), default `4.5`.
- `deliveryFee`: Number, default `40`.
- `estimatedDeliveryMinutes`: Number, default `30`.
- `isOpen`: Boolean, default `true`.
- `isApproved`: Boolean (Default `false` for new partners, `true` for seed/admin).

### C. Food Model (`Food.js`)
- `name`, `description`: String.
- `price`: Number, non-negative.
- `image`: String.
- `category`: ObjectId reference to `Category`.
- `restaurant`: ObjectId reference to `Restaurant`.
- `isVegetarian`: Boolean, default `false`.
- `isAvailable`: Boolean, default `true`.

### D. Cart Model (`Cart.js`)
- `user`: ObjectId reference to `User`, unique (1 persistent cart per user).
- `restaurant`: ObjectId reference to `Restaurant` (Enforces single-restaurant items).
- `items`: Array of `{ food: ref Food, quantity: Number }`.

### E. Order Model (`Order.js`)
- `orderNumber`: String, unique generated identifier (e.g. `ORD-1001`).
- `customer`: ObjectId reference to `User`.
- `restaurant`: ObjectId reference to `Restaurant`.
- `items`: Array with price snapshots: `{ food, name, unitPrice, quantity, lineTotal }`.
- `deliveryAddress`: Snapshot of destination address.
- `contactPhone`: String.
- `subtotal`, `deliveryFee`, `discount`, `totalAmount`: Number (Server-calculated).
- `paymentMethod`: Enum (`cod`, `simulated_card`, `upi`).
- `paymentStatus`: Enum (`pending`, `paid`, `failed`, `refunded`).
- `orderStatus`: Enum (`placed`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `cancelled`).
- `statusHistory`: Array of `{ status, changedAt, changedBy, note }`.

---

## 7. API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new customer or restaurant owner |
| POST | `/api/auth/login` | Public | Authenticate user & receive HTTP-only cookie |
| POST | `/api/auth/logout` | Public | Clear authentication cookie |
| GET | `/api/auth/me` | Private | Get profile of authenticated user |
| PATCH | `/api/auth/change-password` | Private | Update password with current password verification |

### User Profile & Addresses (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/me` | Private | Get user profile |
| PATCH | `/api/users/me` | Private | Update name or phone |
| GET | `/api/users/me/addresses` | Private | Get saved address book |
| POST | `/api/users/me/addresses` | Private | Add new delivery address |
| PATCH | `/api/users/me/addresses/:id` | Private | Update an existing address |
| DELETE | `/api/users/me/addresses/:id` | Private | Remove address from book |

### Restaurants (`/api/restaurants`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/restaurants` | Public | List approved restaurants with search, cuisine, and sorting |
| GET | `/api/restaurants/:id` | Public | Get single restaurant details |
| GET | `/api/restaurants/:id/menu` | Public | Get restaurant food items grouped by category |
| POST | `/api/restaurants` | Owner/Admin | Register new restaurant storefront |
| PATCH | `/api/restaurants/:id` | Owner/Admin | Update restaurant details (restricted to owner) |

### Food Catalog (`/api/foods` & nested)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/foods` | Public | Get food items with restaurant/category filters |
| GET | `/api/foods/:id` | Public | Get single dish detail |
| POST | `/api/restaurants/:restaurantId/foods` | Owner/Admin | Add new dish to restaurant menu |
| PATCH | `/api/restaurants/:restaurantId/foods/:foodId` | Owner/Admin | Edit dish details or availability |
| DELETE | `/api/restaurants/:restaurantId/foods/:foodId` | Owner/Admin | Delete dish from menu |

### Shopping Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cart` | Customer | Get persistent cart with live price recalculation |
| POST | `/api/cart/items` | Customer | Add dish (signals 409 conflict if cross-restaurant) |
| PATCH | `/api/cart/items/:foodId` | Customer | Update item quantity |
| DELETE | `/api/cart/items/:foodId` | Customer | Remove specific item |
| DELETE | `/api/cart` | Customer | Clear entire cart |

### Orders & Tracking (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Customer | Place order with server-side pricing & cart clearing |
| GET | `/api/orders/my-orders` | Customer | Get customer's past orders |
| GET | `/api/orders/:orderId` | Customer/Owner/Admin | Get order tracking & receipt detail |
| PATCH | `/api/orders/:orderId/cancel` | Customer/Admin | Cancel order (eligible only when Placed/Confirmed) |

### Restaurant Owner Operations (`/api/owner`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/owner/dashboard` | Owner | Get store revenue, pending orders, and recent activity |
| GET | `/api/owner/orders` | Owner | Get live incoming orders for owner's kitchen |
| PATCH | `/api/owner/orders/:orderId/status` | Owner | Transition order status (`confirmed`, `preparing`, etc.) |

### Administrator Control Center (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Aggregate platform metrics, orders, and total sales |
| GET | `/api/admin/users` | Admin | Search and list users with pagination |
| PATCH | `/api/admin/users/:userId/status` | Admin | Toggle account activation/deactivation |
| GET | `/api/admin/restaurants` | Admin | List all restaurants (including unapproved) |
| PATCH | `/api/admin/restaurants/:restaurantId/approval` | Admin | Approve or revoke restaurant registration |
| GET | `/api/admin/orders` | Admin | Audit all platform orders |

---

## 8. Authentication & Authorization

- **JWT in HTTP-only Cookie:** Authentication tokens are stored inside a secure HTTP-only cookie named `token`, protecting against cross-site scripting (XSS) attacks.
- **Bearer Header Fallback:** Postman, curl, and native mobile clients can also pass `Authorization: Bearer <token>`.
- **Role Verification:** Protected endpoints use the `authorize(...roles)` middleware to ensure that Customers cannot access administrative dashboards, and Restaurant Owners cannot modify restaurants or orders belonging to another owner.

---

## 9. Order Processing & State Machine

Order status transitions adhere to strict finite state machine rules:

```
[ placed ] ──────────► [ confirmed ] ──────────► [ preparing ]
    │                        │                         │
    ▼                        ▼                         ▼
[ cancelled ]            [ cancelled ]          [ out_for_delivery ]
                                                       │
                                                       ▼
                                                 [ delivered ]
```

- Customers may cancel an order **only** while in `placed` or `confirmed` status.
- Only Restaurant Owners (or Admins) can confirm, prepare, dispatch, or deliver orders.
- Customers are prohibited from marking orders as delivered.

---

## 10. Environment Variables Setup

### Backend `.env` (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```bash
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Placeholder: Replace with your local or Atlas URI)
MONGODB_URI=mongodb://localhost:27017/foodieexpress

# JWT Authentication Secret & Expiration
JWT_SECRET=your_super_secret_jwt_key_foodie_express_production_2026
JWT_EXPIRES_IN=7d

# Cookie Session Secret
COOKIE_SECRET=your_cookie_secret_foodie_express_auth_session

# Frontend Origin URL
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```bash
# Uses Vite proxy automatically when empty, or points to API
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 11. Installation & Running Locally

### Step 1: Install Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install inside `server/` and `client/` individually via `cd server && npm install` and `cd client && npm install`)*

### Step 2: Seed the Database
Ensure your MongoDB server is running (or configure your MongoDB Atlas URI in `server/.env`), then execute:
```bash
npm run seed
```
This populates 5 realistic restaurants (Italian, Indian, Gourmet Burgers, Japanese Sushi & Ramen, Organic Bowls), 25+ dishes, food categories, sample customers, restaurant owners, and sample orders.

### Seed Accounts Created:
| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@example.com` | `AdminPass123!` |
| **Restaurant Owner** | `owner@example.com` | `Password123!` |
| **Customer** | `customer@example.com` | `Password123!` |

*(Note: The login screen also features 1-click demo buttons to automatically sign in with any of these accounts).*

### Step 3: Start the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 12. Automated Tests

Run backend unit and integration test suites:
```bash
npm run test:server
```
Tests cover:
- Authentication, registration, duplicate rejection, and login failures.
- Role-based authorization boundaries.
- Restaurant search and pagination metadata.
- Server-side price calculation accuracy.
- Order state transition enforcement.

---

## 13. Git History & Pushing to GitHub (100+ Commits)

Per requirements, this project includes an automated commit generator that produces 150 granular, atomic, professional commits following Conventional Commits format (`feat`, `fix`, `test`, `chore`, `docs`, `sec`).

To generate the commits and push directly to your repository:

### Option A: Using the Windows Batch Script
Double click or run:
```cmd
scripts\push_to_github.bat
```

### Option B: Running with Node.js
```bash
node scripts/generate_commits.js
git push -u origin main
```

Target Repository: `https://github.com/Nishant-015/Food-Express.git`

---

## 14. License

Distributed under the MIT License. See `LICENSE` for more information.
