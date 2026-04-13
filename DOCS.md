# UNN BookHub Documentation

## What this project is

UNN BookHub is an online bookstore and e-library web app built for the University of Nigeria, Nsukka. It allows students and staff to browse academic books, manage purchases, access digital library materials, and track receipts.

## Core features

- Browse books and view book details
- Access the e-library and digital content
- User authentication with Firebase Auth
- Student dashboard with profile management
- Shopping cart and checkout flow
- Order history and order details
- Receipt generation and verification
- Complaint submission and tracking
- Admin-only dashboard access
- Light/dark theme toggle

## Architecture

### Frontend

- React + Vite
- Tailwind CSS for styling
- React Router for client-side routing
- Zustand for client state management
- Firebase client SDK for authentication and Firestore

### Backend

- Express server in `server.ts`
- Firebase Admin SDK for server-side Firestore access
- API endpoints for health checks, payment verification, and receipt verification
- Security and middleware:
  - CORS
  - Helmet
  - cookie-parser
  - rate limiting

## Key files

- `README.md` - app run instructions
- `metadata.json` - app metadata and description
- `server.ts` - Express backend setup and API routes
- `src/App.tsx` - main app router and protected route configuration
- `src/firebase.ts` - Firebase initialization and Firestore helpers
- `src/store/useStore.ts` - Zustand stores for auth, cart, and UI state
- `src/types.ts` - TypeScript interfaces for users, books, orders, complaints, and more
- `src/components/AuthGuard.tsx` - route guard for authenticated users and admin roles
- `src/components/Navbar.tsx` - navigation bar with cart and login actions

## Pages and routes

Public routes:

- `/` — Home
- `/books` — Bookshelf
- `/books/:id` — Book detail
- `/library` — E-library
- `/login` — Login
- `/register` — Register
- `/verify-receipt` — Verify receipt

Protected student routes:

- `/dashboard`
- `/profile`
- `/cart`
- `/checkout`
- `/orders`
- `/orders/:id`
- `/reader/:id`
- `/complaints`
- `/complaints/new`
- `/complaints/:id`

Admin route:

- `/admin`

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables as needed.
3. Start the app:
   ```bash
   npm run dev
   ```

## Notes

- Firebase client config is loaded from `src/firebase-applet-config.json`
- The backend uses Firestore collections like `users`, `orders`, `receipts`, and `complaints`
- Receipt verification is implemented with an Express endpoint at `/api/v1/receipts/:receiptId/verify`
- Payment/order verification is simulated in `/api/v1/orders/verify`
