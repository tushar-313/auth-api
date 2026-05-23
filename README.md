# 🔐 JWT Authentication API

A secure Authentication REST API built completely from scratch using **Node.js**, **Express**, **MongoDB**, and the native **Node.js Crypto module** — no third-party auth libraries.

> Built as a learning project to deeply understand backend concepts like authentication, authorization, session handling, OTP verification, and secure API architecture — without AI assistance.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- ✅ User Registration & Login
- ✅ JWT Access & Refresh Token Flow
- ✅ OTP-based Email Verification
- ✅ Session Management (single & all-session logout)
- ✅ Password Encryption using the native Crypto module
- ✅ Protected Routes with Bearer Token Authentication
- ✅ MongoDB Integration via Mongoose
- ✅ Environment Variable Configuration
- ✅ Clean REST API Architecture
- ✅ Centralized Error Handling

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Access & refresh token auth |
| Node.js Crypto Module | Password hashing & encryption |
| Nodemailer | OTP email delivery |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
AUTH/
│
├── controllers/
│   └── auth.controller.js       # Route handler logic
│
├── models/
│   ├── otp.model.js             # OTP schema
│   ├── sessions.model.js        # Session schema
│   └── user.models.js           # User schema
│
├── routes/
│   └── auth.routes.js           # Auth route definitions
│
├── src/
│   ├── config/                  # App configuration
│   ├── services/
│   │   └── email.services.js    # Email / OTP service
│   └── utils/
│       └── utils.js             # Helper utilities
│
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))
- A Gmail account with Google OAuth 2.0 credentials for email delivery

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-link>
   ```

2. **Move to the project directory**
   ```bash
   cd auth-api
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables** (see below)

5. **Start the development server**
   ```bash
   npm run dev
   ```

---

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_gmail_address
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret |
| `GOOGLE_REFRESH_TOKEN` | Refresh token for Gmail SMTP access |
| `GOOGLE_USER` | Gmail address used to send OTP emails |

---

## 📡 API Reference

Base URL: `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive access + refresh tokens | ❌ |
| `POST` | `/verify-email` | Verify email address using OTP | ❌ |
| `GET` | `/getme` | Get current authenticated user details | ✅ |
| `GET` | `/refresh` | Issue a new access token via refresh token | ✅ |
| `GET` | `/logout` | Logout from the current session | ✅ |
| `GET` | `/logoutall` | Logout from all active sessions | ✅ |

---

### Request & Response Examples

#### Register — `POST /api/auth/register`
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Login — `POST /api/auth/login`
```json
// Request Body
{
  "email": "john@example.com",
  "password": "yourpassword"
}

// Response
{
  "accessToken": "<jwt_access_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

#### Verify Email — `POST /api/auth/verify-email`
```json
// Request Body
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

## 🔒 Authentication

Protected routes require a valid JWT access token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

**Token Flow:**

```
Register → Verify Email (OTP) → Login → Access Token + Refresh Token
                                                  ↓
                                      Use Access Token for protected routes
                                                  ↓
                                      Expired? → GET /refresh → New Access Token
```

When the access token expires, call `/refresh` with your refresh token to get a new one — no need to log in again.

---

