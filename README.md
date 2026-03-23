# 🌾 Farm Fresh Hub (Farm2Home)

A full-stack MERN (MongoDB, Express, React, Node.js) marketplace connecting farmers directly with consumers. This project features a robust admin panel, real-time product updates, secure authentication, and a complete order management system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or via Docker)

### 1. Start MongoDB
Ensure your local MongoDB instance is running:
```bash
mongod
# OR with Docker
# docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Start the Backend
Open a terminal and run:
```bash
npm run server
# Server will start on http://localhost:5000
```

### 3. Start the Frontend
Open a **new** terminal and run:
```bash
npm run dev
# Frontend will start on http://localhost:8080 (or 8081/8082/8083 depending on availability)
```

> **Note:** The backend connects to the `Farm2Home_final` MongoDB database.

---

## 🔑 Authentication

The project uses a custom MongoDB-based authentication system.

### Default Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | `vnimbalkar79@gmail.com` | `admin123` |
| **Admin** | `admin@farm2home.com` | `admin123` |
| **Farmer** | `raj@farm2home.com` | `farmer123` |

### Features
- **Sign Up/In:** Custom API routes (`api/auth/signup`, `api/auth/signin`).
- **Session:** Uses `localStorage` for persistence.
- **Profile:** Users can view and edit their profile at `/profile`.

---

## 🛠️ Admin Panel

Access at `/admin` (requires Admin login).

### Capabilities
- **Dashboard:** View stats (Products, Users, Orders, Revenue).
- **Product Management:**
  - **Create:** Add products with details, categories, and **image upload**.
  - **Read:** Search and filter products with real-time updates.
  - **Update:** Edit existing products via a modal.
  - **Delete:** Remove products.
- **Image Upload:** Drag-and-drop support; images are stored as Base64 in MongoDB (creates a self-contained DB).

---

## 🛍️ Features

### 🔍 Search & Filter
- **Global Search:** Search bar in the header filters by product name, description, or category.
- **Category Filters:** Filter products by Vegetables, Fruits, Dairy, etc.

### 🛒 Checkout & Payments
- **Payment Methods:**
  - 💵 **Cash on Delivery (COD)**
  - 📱 **PhonePe** (Simulated)
  - 💳 **Google Pay** (Simulated)
- **Order Flow:**
  1. Add items to cart.
  2. Proceed to checkout (`/checkout`).
  3. Enter shipping details and choose payment.
  4. Order is saved to MongoDB.
  5. User receives SMS/Email notification (if configured).

### 📱 Notifications (SMS & Email)
- **SMS:** Integrated with **MSG91** (Indian headers) or **Twilio**.
- **Email:** Integrated with **Nodemailer**.
- **Configuration:** Set `MSG91_AUTH_KEY` or Twilio credentials in `.env` to enable real sending.
- **Behavior:** currently logs simulated messages to the console if keys are missing.

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

#### Products
- `GET /products` - List all products
- `POST /products` - Create a product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

#### Users
- `GET /users` - List all users
- `POST /users` - Create a user
- `PUT /users/:id` - Update a user's profile
- `GET /auth/me` - Get current user info

#### Orders
- `GET /orders` - List all orders
- `POST /orders` - Create an order
- `GET /orders/user/:userId` - Get orders for a specific user

---

## ⚙️ Configuration

### `.env` File
Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/Farm2Home_final
PORT=5000
NODE_ENV=development

# Authentication (Optional future use)
# JWT_SECRET=your_jwt_secret

# SMS (Optional - for real SMS)
MSG91_AUTH_KEY=your_key
MSG91_SENDER_ID=FARMHM

# Email (Optional - for real Emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 🔧 Troubleshooting

### Common Issues
1. **"MongoDB connection failed"**:
   - Ensure the `mongod` service is running.
   - Check if port 27017 is accessible.
2. **"Connection refused"**:
   - Ensure the backend server is running (`npm run server`).
   - Check if the frontend is pointing to the correct backend URL (default `http://localhost:5000/api`).
3. **Images not showing**:
   - Ensure you have uploaded images clearly. Large Base64 strings can sometimes cause performance issues if not handled correctly, but are fine for this scale.

### Resetting Data
To re-seed the database with default users and products:
```bash
npx tsx server/seed.ts
```

---

## 📂 Project Structure

```
farm-fresh-hub/
├── src/                  # Frontend (React + Vite)
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page views (Home, Admin, Checkout, etc.)
│   ├── hooks/            # Custom hooks (useAuth, useToast)
│   └── context/          # Global state (Cart, Auth)
├── server/               # Backend (Express + Node)
│   ├── config/           # DB connection
│   ├── models/           # Mongoose schemas (User, Product, Order)
│   ├── routes/           # API routes
│   └── server.ts         # Server entry point
└── public/               # Static assets
```
