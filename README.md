# Loan Management API

A complete RESTful API for managing loan requests with JWT authentication and role-based access control.

Built as part of CredPal Backend Developer Assessment.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (Strict Mode)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **Logging:** Winston
- **Development:** Nodemon, ts-node

## ✨ Features

### Authentication

- User registration with secure password hashing
- JWT-based authentication
- Role-based access control (User & Admin)

### Loan Management (User)

- Create loan requests
- View personal loan history
- Update pending loan requests
- Delete pending loan requests
- View detailed loan information

### Loan Management (Admin)

- View all loan requests
- Filter loans by status
- Approve or reject loan requests
- Add rejection reasons
- Set custom interest rates
- Disburse approved loans
- Automatic loan calculation (monthly payment & total repayment)

### Additional Features

- Comprehensive error handling
- Input validation
- Structured API responses
- Request logging
- Auto-admin seeding on startup

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CodeEnthusiast09/credpal-backend-task.git
cd credpal-backend-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/loan-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin Credentials (Auto-seeded on startup)
ADMIN_EMAIL=admin@credpal.com
ADMIN_PASSWORD=admin123

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB

Ensure MongoDB is running locally:

```bash
# Check MongoDB status
mongosh
```

Or use MongoDB Atlas connection string in `MONGODB_URI`.

### 5. Run the Application

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

The API will be available at `http://localhost:4000`

## 📚 API Documentation

### Base URL

```bash
http://localhost:4000/api
```

### Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Error details"
    }
  ]
}
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response includes JWT token:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  }
}
```

### Loan Endpoints (User)

All user endpoints require `Authorization: Bearer <token>` header.

#### Create Loan Request

```http
POST /api/loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000,
  "purpose": "Business expansion and equipment purchase",
  "duration": 24
}
```

#### Get My Loans

```http
GET /api/loans/my-loans
Authorization: Bearer <token>
```

#### Get Loan by ID

```http
GET /api/loans/:id
Authorization: Bearer <token>
```

#### Update Loan (Pending Only)

```http
PUT /api/loans/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 75000,
  "purpose": "Updated purpose",
  "duration": 36
}
```

#### Delete Loan (Pending Only)

```http
DELETE /api/loans/:id
Authorization: Bearer <token>
```

### Loan Endpoints (Admin)

Admin endpoints require admin role.

#### Get All Loans

```http
GET /api/loans
Authorization: Bearer <admin-token>
```

#### Get Loans by Status

```http
GET /api/loans?status=pending
Authorization: Bearer <admin-token>
```

Query parameter `status` can be: `pending`, `approved`, `rejected`, `disbursed`, `completed`, `cancelled`

#### Approve Loan

```http
PATCH /api/loans/:id/approve
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "approved",
  "interestRate": 6.5
}
```

#### Reject Loan

```http
PATCH /api/loans/:id/approve
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "rejected",
  "rejectionReason": "Insufficient credit score"
}
```

#### Disburse Loan

```http
PATCH /api/loans/:id/disburse
Authorization: Bearer <admin-token>
```

## 🧪 Testing with Postman

**⚠️ IMPORTANT: For assessment review, please use the Postman collection provided.**

### Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select `postman/Loan-Management-API.postman_collection.json`
4. The collection includes all endpoints with examples

### Live Postman Collection

**🔗 [Test API Endpoints on Postman](https://documenter.getpostman.com/view/YOUR_COLLECTION_ID/COLLECTION_NAME)**

_(Replace with your published Postman collection link)_

The collection includes:

- All authentication endpoints
- User loan management endpoints
- Admin loan management endpoints
- Auto-saves JWT tokens
- Pre-configured environment variables

### Default Admin Credentials

After starting the server, an admin account is automatically created:

- **Email:** `admin@credpal.com` (or value from `ADMIN_EMAIL` in `.env`)
- **Password:** `admin123` (or value from `ADMIN_PASSWORD` in `.env`)

Use these credentials to login and test admin endpoints.

## 📁 Project Structure

```
src/
├── db/
│   └── connection.ts           # MongoDB connection & admin seeding
├── middleware/
│   └── error.middleware.ts     # Global error handler
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── auth.routes.ts      # Auth routes
│   │   └── auth.service.ts     # Auth business logic
│   ├── loans/
│   │   ├── loan.model.ts       # Loan schema
│   │   ├── loans.controller.ts # Loan endpoints
│   │   ├── loans.routes.ts     # Loan routes
│   │   └── loans.service.ts    # Loan business logic
│   └── users/
│       └── user.model.ts       # User schema
├── types/
│   ├── express.types.ts        # Express extensions
│   ├── loan.types.ts           # Loan interfaces
│   ├── response.types.ts       # API response types
│   ├── user.types.ts           # User interfaces
│   └── index.ts                # Type exports
├── utils/
│   ├── logger.ts               # Winston logger
│   └── response.helper.ts      # Response formatters
└── server.ts                   # App entry point
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected routes with middleware
- Environment variable configuration
- CORS configuration

## 🎯 Loan Calculation Logic

When a loan is approved, the system automatically calculates:

**Monthly Payment Formula:**

```
Monthly Payment = (P × r × (1 + r)^n) / ((1 + r)^n - 1)

Where:
- P = Principal amount
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Number of months
```

**Total Repayment:**

```
Total Repayment = Monthly Payment × Duration
```

## 📝 Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build directory
npm run clean
```

---
