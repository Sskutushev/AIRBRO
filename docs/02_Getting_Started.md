# 2. Getting Started: A Detailed Guide

This document provides a detailed, step-by-step guide to setting up, configuring, and running the AIRBRO Business application on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following software installed:

- **Node.js:** Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
- **npm (Node Package Manager):** This is included with Node.js.
- **Git:** For cloning the repository. You can get it from [git-scm.com](https://git-scm.com/).
- **A Code Editor:** [Visual Studio Code](https://code.visualstudio.com/) is recommended.

## Step 1: Clone the Repository

Open your terminal or command prompt and clone the project repository from GitHub.

```bash
git clone https://github.com/Sskutushev/AIRBRO-Business.git
```

Navigate into the newly created project directory.

```bash
cd AIRBRO-Business
```

## Step 2: Backend Setup

The backend must be set up and running before the frontend can properly function.

### 2.1. Navigate to Backend Directory

All backend-related commands should be run from the `backend` directory.

```bash
cd backend
```

### 2.2. Create and Configure the `.env` File

The backend server relies on an environment file (`.env`) for its configuration. This file is not included in the repository for security reasons, so you must create it yourself.

1.  Create a new file named `.env` inside the `backend` directory.
2.  Copy and paste the following template into the file:

    ```env
    # Server & Frontend URL
    # PORT can be any available port. 3000 is the default.
    # FRONTEND_URL must match the URL where your frontend will run. 5173 is Vite's default.
    NODE_ENV="development"
    PORT="3000"
    FRONTEND_URL="http://localhost:5173"

    # Database URL
    # This path points to the local SQLite database file that Prisma will create.
    DATABASE_URL="file:./prisma/dev.db"

    # Security - JWT Secret
    # This MUST be a random string of at least 32 characters.
    # You can generate one using an online tool or by running `openssl rand -base64 32` in your terminal.
    JWT_SECRET="your-super-secret-jwt-key-that-is-at-least-32-characters-long"

    # Telegram Bot Integration
    # These are required for the Telegram notification features.
    TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
    TELEGRAM_ADMIN_CHANNEL="YOUR_TELEGRAM_ADMIN_CHANNEL_ID"

    # Cryptocurrency Wallet Addresses
    # These are the addresses for receiving payments.
    USDT_TRC20_WALLET="YOUR_TRC20_WALLET_ADDRESS"
    USDT_ERC20_WALLET="YOUR_ERC20_WALLET_ADDRESS"
    TON_WALLET="YOUR_TON_WALLET_ADDRESS"
    ```

3.  **Crucially, replace all placeholder values** (`YOUR_...` and the default `JWT_SECRET`) with your actual credentials. The application will not start without them.

### 2.3. Install Backend Dependencies

Run `npm install` to download all the necessary packages for the backend.

```bash
npm install
```

### 2.4. Set Up the Database

Prisma needs to create the SQLite database and set up the tables according to the schema.

Run the following command. It will:
- Create the `dev.db` file in the `backend/prisma/` directory.
- Create the tables (`User`, `Product`, etc.) defined in `schema.prisma`.

```bash
npx prisma migrate dev --name init
```
*(Note: If you are asked to give the migration a name, `init` is a good choice for the first one.)*

You can optionally use Prisma Studio to view and manage your database visually:
```bash
npx prisma studio
```

### 2.5. Start the Backend Server

Finally, start the backend development server. It will watch for file changes and automatically restart.

```bash
npm run dev
```

If successful, you will see a message like:
`🚀 Server is running on port 3000`

Keep this terminal window open.

## Step 3: Frontend Setup

Now, let's get the user interface running.

### 3.1. Navigate to the Root Directory

Open a **new terminal window** and make sure you are in the project's root directory (`AIRBRO-Business`), not the `backend` directory.

```bash
# If you are still in the backend directory:
cd ..
```

### 3.2. Install Frontend Dependencies

Run `npm install` in the root directory to download all packages for the React application.

```bash
npm install
```

### 3.3. Start the Frontend Server

Start the Vite development server.

```bash
npm run dev
```

If successful, you will see a message indicating the server is running, typically at:
`> Local: http://localhost:5173/`

You can now open this URL in your web browser to see the application.

## Summary

You should now have two running processes in separate terminal windows:
- The **backend server** at `http://localhost:3000`.
- The **frontend server** at `http://localhost:5173`.

The application is ready for development.
