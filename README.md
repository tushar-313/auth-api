# JWT Authentication API

A secure Authentication API built completely from scratch using Node.js, Express, MongoDB, JWT, and Node.js Crypto module.

This project was developed for learning backend development concepts like authentication, authorization, session handling, OTP verification, and secure API architecture without using any AI tool.

## Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- OTP Verification System
- Session Management
- Password Encryption using Crypto Module
- MongoDB Database Integration
- Environment Variables Configuration
- REST API Architecture
- Error Handling

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Crypto Module
- Nodemailer
- dotenv

## Project Structure

```bash
AUTH/
│
├── controllers/
│   └── auth.controller.js
│
├── models/
│   ├── otp.model.js
│   ├── sessions.model.js
│   └── user.models.js
│
├── routes/
│   └── auth.routes.js
│
├── src/
│   ├── config/
│   ├── services/
│   │   └── email.services.js
│   │
│   └── utils/
│       └── utils.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
