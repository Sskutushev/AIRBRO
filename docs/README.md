# AIRBRO Business - Complete Project Documentation

Welcome to the complete documentation for the AIRBRO Business project. This document serves as a summary of all key aspects of the project and references the detailed documentation files.

## 📚 Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Backend & API](#3-backend--api)
4. [Database Schema](#4-database-schema)
5. [Frontend](#5-frontend)
6. [Deployment](#6-deployment)
7. [CI/CD](#7-cicd)
8. [Testing](#8-testing)
9. [Security](#9-security)
10. [Additional Documentation](#10-additional-documentation)

## 1. Introduction

AIRBRO Business is a full-stack application built with React and TypeScript on the frontend, and Node.js/Express with PostgreSQL on the backend. It provides an AI-powered automation ecosystem with subscription management and cryptocurrency payment processing.

**Key Features:**

- User authentication and authorization
- Product and subscription management
- Shopping cart functionality
- Cryptocurrency payment integration (USDT, TON)
- Internationalization (i18n) support
- Responsive design with Tailwind CSS

For detailed introduction: [01_Introduction.md](./01_Introduction.md)

## 2. Getting Started

To set up the project locally:

1. Install Node.js (v20+), npm, and Git
2. Clone the repository
3. Set up the backend with PostgreSQL database
4. Set up the frontend
5. Run both servers

**Important:** The project now uses PostgreSQL for both development and production environments.

For detailed setup instructions: [02_Getting_Started.md](./02_Getting_Started.md)

## 3. Backend & API

The backend is built with Node.js, Express, and PostgreSQL, using Prisma ORM and following the repository pattern architecture.

**Key Features:**

- JWT-based authentication
- Comprehensive API endpoints for all business logic
- Repository layer for database abstraction
- Input validation and sanitization
- Security middleware (Helmet, rate limiting)

**API Endpoints:**

- `/api/auth` - Authentication (register, login, profile)
- `/api/products` - Product management
- `/api/cart` - Shopping cart functionality
- `/api/payments` - Payment processing
- `/api/user` - User management

For complete API documentation: [03_Backend_API.md](./03_Backend_API.md)

## 4. Database Schema

The application uses PostgreSQL with the following main models:

- **User** - User accounts and authentication
- **Product** - Subscription plans and products
- **Subscription** - User subscriptions to products
- **Payment** - Payment records and transactions
- **CartItem** - Shopping cart items

The schema is managed with Prisma ORM and includes relationships between all models.

For detailed schema information: [04_Database_Schema.md](./04_Database_Schema.md)

## 5. Frontend

The frontend is built with React, TypeScript, and Tailwind CSS, featuring:

- Responsive design
- Internationalization with i18next
- Theme switching
- Modular component architecture
- State management with React Query and Context API
- Form validation and error handling

For frontend details: [05_Frontend.md](./05_Frontend.md)

## 6. Deployment

The application is designed for deployment on platforms like Vercel (frontend) and Railway (backend), with PostgreSQL database hosting.

**Deployment Steps:**

1. Configure environment variables
2. Set up PostgreSQL database
3. Build and deploy frontend
4. Build and deploy backend
5. Configure domain and SSL

For deployment instructions: [06_Deployment.md](./06_Deployment.md)

## 7. CI/CD

Continuous Integration and Deployment pipelines are configured to:

- Run tests on every push
- Build and deploy the application
- Perform security checks
- Monitor application performance

For CI/CD details: [07_CI_CD.md](./07_CI_CD.md)

## 8. Testing

The project follows a comprehensive testing strategy:

**Frontend Testing:**

- Unit tests with Vitest
- Component tests with React Testing Library
- Integration tests for hooks and utilities

**Backend Testing:**

- Migrated from Jest to Vitest
- Controller tests with Supertest
- Database integration tests
- Real database testing with test database isolation

**E2E Testing:**

- Playwright for end-to-end tests
- 35+ tests covering critical user flows
- Cross-browser testing

For testing details: [08_Testing.md](./08_Testing.md)

## 9. Security

Security is a top priority with multiple layers of protection:

**Backend Security:**

- Helmet.js for HTTP security headers
- Input sanitization to prevent XSS
- Rate limiting to prevent abuse
- HTTPS redirection in production
- JWT-based authentication
- CSRF protection (partially implemented)

**Database Security:**

- PostgreSQL with proper connection security
- Prisma schema validation
- Database access control

**Frontend Security:**

- Secure API communication
- Input validation
- Proper error handling

For security guidelines: [10_Security.md](./10_Security.md)

## 10. Additional Documentation

The project includes additional documentation files:

- [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md) - Deployment issue fixes
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deployment guide

## 🔧 Recent Improvements

Recent improvements made to reach 9.5/10 quality rating:

1. **Backend Test Migration** - Migrated from Jest to Vitest with comprehensive coverage
2. **Repository Pattern** - Implemented clean architecture with repository layer
3. **Security Enhancements** - Added Helmet, sanitization, HTTPS redirects
4. **E2E Testing** - 35+ Playwright tests for critical flows
5. **Global Error Handling** - Centralized error management
6. **Code Splitting** - Performance optimization with lazy loading
7. **Type Safety** - Comprehensive TypeScript implementation
8. **Internationalization** - Full EN/RU language support

## 🚀 Running the Application

**Backend:**

```bash
cd backend
npm install
npx prisma migrate dev  # Setup database
npm run dev
```

**Frontend:**

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3000`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

For questions or support, please open an issue in the repository.
