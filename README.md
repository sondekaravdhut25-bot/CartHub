# CartHub — MERN Stack E-Commerce Store

A full-featured e-commerce app built with MongoDB, Express, React, and Node.js.
Built as a portfolio project for MERN stack job applications.

**Live demo:** 

## Features

- JWT authentication (register/login), passwords hashed with bcrypt
- Product catalog with search, category filters, and pagination
- Product detail pages with a review system
- Cart with persistent state (survives page refresh)
- Real checkout flow using **Razorpay** (test mode) — server verifies the
  payment signature before marking an order paid, and stock is only
  decremented after a verified payment
- Order history for customers
- Admin dashboard: manage products (create/edit/delete) and orders
  (view all, update fulfillment status)
- Role-based route protection on both frontend and backend

## Tech stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcrypt, Razorpay SDK
- **State management:** React Context + useReducer (no Redux — kept intentionally simple)

## Project structure

```
CartHub/
├── client/          # React frontend (Vite)
└── server/          # Express backend (REST API)
```

## Setup

### 1. Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- A free [Razorpay](https://dashboard.razorpay.com/signup) account (test mode keys)

### 2. Backend

```bash
cd server
npm install
# edit .env with your MongoDB URI, JWT secret, and Razorpay test keys
npm run seed     # populates demo products + an admin account
npm run dev      # starts on http://localhost:5000
```

Demo admin login after seeding: `admin@kilnandco.test` / `admin1234`

### 3. Frontend

```bash
cd client
npm install
npm run dev      # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`,
so both servers need to be running at once.

### 4. Test payments

Razorpay test mode uses fake cards — no real money moves:

- Card number: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits

## Deployment

- **Frontend:** deploy `client/` to [Vercel](https://vercel.com) (framework preset: Vite)
- **Backend:** deploy `server/` to [Render](https://render.com) (free web service)
- **Database:** MongoDB Atlas free tier (M0)
- Set the same environment variables from `.env` in your Render dashboard,
  and update `CLIENT_URL` to your deployed Vercel URL
- Update the frontend's API base URL / proxy for production (see `client/src/services/api.js`)

## Possible next additions

If you want to extend this further for your portfolio: Cloudinary image
uploads (instead of pasting image URLs in the admin form), email
notifications on order status change (Nodemailer), wishlist/favorites,
and product image galleries with multiple photos per item.
