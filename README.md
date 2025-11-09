# AIRBRO Business: AI-Powered Automation Ecosystem

AIRBRO Business is a modern, full-stack application designed to provide an AI-powered automation ecosystem for businesses, particularly those native to Telegram. It features a subscription-based model for accessing various products and services, with a comprehensive backend to manage users, products, payments (including cryptocurrency), and a sleek, responsive frontend for user interaction.

## ✨ Key Features

- **Modern Tech Stack:** Built with React, Vite, and TypeScript on the frontend, and Node.js, Express, and Prisma on the backend.
- **Robust Error Handling:** Integrated `ErrorBoundary` with Sentry for production error logging and graceful fallback UI.
- **Optimized Performance:** Implemented Code Splitting, `OptimizedImage` component with WebP/AVIF support, lazy loading for media, and font optimization.
- **Advanced Caching:** Utilizes Service Workers (via VitePWA) for aggressive caching strategies, including API and image caching, and offline support.
- **Comprehensive Monitoring:** Integrated Sentry for error tracking and performance monitoring, and Google Analytics for user behavior insights.
- **Enhanced Security:** Features CSRF protection, secure coding practices, input validation (Zod), and sensitive data handling.
- **Subscription Management:** A complete system for managing user subscriptions to different product tiers.
- **E-commerce Functionality:** Includes a shopping cart and a payment processing system.
- **Cryptocurrency Payments:** Supports payments in various cryptocurrencies like USDT (TRC20, ERC20) and TON.
- **Secure Authentication:** Uses JWT (JSON Web Tokens) for secure user authentication and session management.
- **Robust Backend:** Features CSRF protection, rate limiting, and modularly structured API routes.
- **Responsive Frontend:** A user-friendly interface built with TailwindCSS and Framer Motion for a smooth experience.
- **Database:** Utilizes SQLite via the Prisma ORM for easy database management and migration.
- **Extensive Testing:** Comprehensive unit and integration tests using Vitest and React Testing Library.
- **Reusable Components & Hooks:** Developed a library of reusable UI components (e.g., Skeleton, Toast) and custom React hooks (e.g., useAsync, useDebounce, useLocalStorage) for efficient development.

## 🛠️ Tech Stack

| Area      | Technology                                       |
|-----------|--------------------------------------------------|
| **Frontend**  | React, TypeScript, Vite, TailwindCSS, TanStack Query, Framer Motion, Zod, React Hook Form, React Hot Toast, VitePWA |
| **Backend**   | Node.js, Express, TypeScript, Prisma ORM, CSRF Protection         |
| **Database**  | SQLite (for development)                         |
| **API**       | RESTful, JWT Authentication, CSRF Protection     |
| **Testing**   | Vitest, React Testing Library                    |
| **Monitoring**| Sentry, Google Analytics                         |
| **DevOps**    | Husky, Prettier, ESLint, GitHub Actions, Sharp (Image Optimization) |

## 🚀 Getting Started

This guide will walk you through setting up and running the AIRBRO Business application locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/Sskutushev/AIRBRO-Business.git
cd AIRBRO-Business
```

### 2. Backend Setup

The backend server requires several environment variables to run.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create an environment file:**
    Create a file named `.env` in the `backend` directory by copying `.env.example` and populate it with the necessary keys. A minimal setup is shown below:

    ```env
    # Server & Frontend URL
    NODE_ENV="development"
    PORT="3000"
    FRONTEND_URL="http://localhost:5173"

    # Database URL (points to the local SQLite file)
    DATABASE_URL="file:./prisma/dev.db"

    # Security
    JWT_SECRET="your-super-secret-jwt-key-that-is-at-least-32-characters-long"

    # Telegram Bot
    TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
    TELEGRAM_ADMIN_CHANNEL="YOUR_TELEGRAM_ADMIN_CHANNEL_ID"

    # Crypto Wallets
    USDT_TRC20_WALLET="YOUR_TRC20_WALLET_ADDRESS"
    USDT_ERC20_WALLET="YOUR_ERC20_WALLET_ADDRESS"
    TON_WALLET="YOUR_TON_WALLET_ADDRESS"

    # Optional: Sentry DSN for error monitoring (production only)
    SENTRY_DSN="YOUR_SENTRY_DSN"

    # Optional: Google Analytics Measurement ID (production only)
    GA_MEASUREMENT_ID="YOUR_GA_MEASUREMENT_ID"
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the database migration:**
    This will set up the SQLite database based on the schema.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The backend server should now be running on `http://localhost:3000`.

### 3. Frontend Setup

1.  **Navigate back to the root directory and install dependencies:**
    ```bash
    cd ..
    npm install
    ```

2.  **Create an environment file:**
    Create a file named `.env` in the root directory by copying `.env.example` and populate it with the necessary keys.

    ```env
    # Frontend URL
    VITE_FRONTEND_URL="http://localhost:5173"

    # Backend API URL
    VITE_API_BASE_URL="http://localhost:3000/api"

    # Optional: Sentry DSN for error monitoring (production only)
    VITE_SENTRY_DSN="YOUR_SENTRY_DSN"

    # Optional: Google Analytics Measurement ID (production only)
    VITE_GA_MEASUREMENT_ID="YOUR_GA_MEASUREMENT_ID"
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should now be accessible at `http://localhost:5173`.

## 📂 Project Structure

The project is a monorepo with the frontend and backend code separated into distinct directories.

```
.
├── backend/              # All backend source code
│   ├── prisma/           # Prisma schema and database migrations
│   ├── src/              # Backend TypeScript source
│   │   ├── config/       # Server configuration (db, jwt)
│   │   ├── controllers/  # API route logic
│   │   ├── middleware/   # Express middleware (auth, validation)
│   │   ├── models/       # Data models/types
│   │   ├── routes/       # API route definitions
│   │   └── server.ts     # Server entry point
│   └── .env              # Environment variables (must be created)
│
├── src/                  # All frontend source code (React)
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers (Auth, Theme)
│   ├── hooks/            # Custom React hooks
├── lib/              # Helper functions, libraries (e.g., toast, queryClient)
│   ├── analytics/      # Google Analytics integration
│   ├── monitoring/     # Sentry error monitoring
│   └── ...             # Other utilities
├── pages/            # Top-level page components
│   ├── services/         # API client and data fetching
│   └── main.tsx          # Frontend entry point
│
├── docs/                 # Project documentation
└── .github/              # GitHub Actions workflows (CI/CD)
```

For more detailed information, please refer to the files in the `/docs` directory, especially the [Deployment Guide](docs/06_Deployment.md).
