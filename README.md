# Loan Management API - CredPal Backend Developer Assessment

A complete RESTful API for managing loan requests with JWT authentication and role-based access control.

## Live Deployment

**API URL:** <https://loan-management-api.up.railway.app>

## How to Test the API

### Using Postman (Recommended)

1. **Import the Collection**
   - Open Postman
   - Click "Import" → Select the `credpal-backend-assessment.json` file
   - The collection is pre-configured with the live Railway URL

2. **Test Flow**
   - Start with "Health Check" to verify the API is running
   - Login as Admin (use credentials below)
   - Register a new User
   - Create Loan Request (as user)
   - View All Loans (as admin)
   - Approve/Reject Loans (as admin)

3. **Default Admin Credentials**
   - **Email:** `admin@credpal.com`
   - **Password:** `QeS$4f0nsmdslmd0`

**Note:** All JWT tokens and loan IDs are automatically saved as Postman variables for seamless testing.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (Strict Mode)
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **Logging:** Winston
- **Deployment:** Railway

---

## Features Implemented

### Authentication

- ✅ User registration with secure password hashing
- ✅ JWT-based authentication
- ✅ Role-based access control (User & Admin)
- ✅ Token expiration (7 days)

### Loan Management (User)

- ✅ Create loan requests
- ✅ View personal loan history
- ✅ Update pending loan requests
- ✅ Delete pending loan requests
- ✅ View detailed loan information

### Loan Management (Admin)

- ✅ View all loan requests
- ✅ Filter loans by status
- ✅ Approve or reject loan requests
- ✅ Add custom rejection reasons
- ✅ Set custom interest rates
- ✅ Disburse approved loans
- ✅ Automatic loan calculations (monthly payment & total repayment)

---

## API Documentation

### Base URL

```
https://loan-management-api.up.railway.app/api
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

---

## API Endpoints

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

#### Login (User or Admin)

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

---

### Loan Endpoints (User)

**Authentication Required:** All endpoints require `Authorization: Bearer <token>` header.

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

---

### Loan Endpoints (Admin)

**Authentication Required:** Admin role required.

#### Get All Loans

```http
GET /api/loans
Authorization: Bearer <admin-token>
```

#### Filter Loans by Status

```http
GET /api/loans?status=pending
Authorization: Bearer <admin-token>
```

Available statuses: `pending`, `approved`, `rejected`, `disbursed`, `completed`, `cancelled`

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

---
