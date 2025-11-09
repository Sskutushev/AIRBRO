# 1. Introduction to AIRBRO Business

## Overview

AIRBRO Business is a full-stack, subscription-based e-commerce platform designed to serve as an AI-powered automation ecosystem. The project is architected as a monorepo, containing two primary components:

1.  **Frontend:** A modern, single-page application (SPA) built with **React** and **Vite**. It provides a responsive and interactive user interface for browsing products, managing accounts, and making payments.
2.  **Backend:** A robust RESTful API server built with **Node.js** and **Express**. It handles all business logic, including user authentication, product management, payment processing, and database interactions.

The two components are designed to work together seamlessly, with the frontend consuming the API provided by the backend.

## Core Architecture

### Frontend Architecture

- **Framework:** The frontend is built on **React (v19)** using **TypeScript** for type safety.
- **Build Tool:** **Vite** is used for its fast development server and optimized build process.
- **Styling:** **TailwindCSS** provides a utility-first approach to styling, allowing for rapid and consistent UI development.
- **State Management & Data Fetching:** **TanStack Query** is used to manage server state, handling data fetching, caching, and synchronization with the backend API. Client-side state is managed through a combination of React hooks (`useState`, `useReducer`) and **React Context** for global state like authentication status and theme.
- **Routing:** **React Router** is used for client-side routing, enabling navigation between different pages (`/`, `/account`, `/auth`, etc.) without full page reloads.
- **Animations:** **Framer Motion** is integrated to create fluid and engaging user interface animations.

### Backend Architecture

- **Framework:** The backend is a **Node.js** application running the **Express** framework, written in **TypeScript**.
- **Database & ORM:** **Prisma ORM** is used to interact with the database. It provides a type-safe query builder and simplifies database migrations. For development, the database is **SQLite**, which is simple to set up as a local file.
- **API:** The server exposes a **RESTful API** for the frontend. Routes are organized by feature (e.g., `auth`, `products`, `payments`) and handle all CRUD (Create, Read, Update, Delete) operations.
- **Authentication:** User authentication is handled via **JSON Web Tokens (JWT)**. Upon successful login, the server issues a token that the frontend includes in subsequent requests to access protected routes.
- **Security:** Several security measures are implemented:
    - **CORS:** Cross-Origin Resource Sharing is configured to only allow requests from the frontend's URL.
    - **Rate Limiting:** `express-rate-limit` is used to prevent brute-force attacks.
    - **CSRF Protection:** `csurf` middleware is used to protect against Cross-Site Request Forgery attacks.
- **Telegram Integration:** The backend has a dedicated module for sending notifications to a Telegram channel, for example, upon new user registration.

### Data Flow

1.  A user interacts with the **React frontend** in their browser.
2.  To fetch or submit data (e.g., logging in, viewing products), the frontend makes an **HTTP request** to the **backend API** (e.g., `POST /api/auth/login`).
3.  The **Express backend** receives the request, and the corresponding route forwards it to a **controller**.
4.  The controller processes the request, often using **Prisma** to read from or write to the **SQLite database**.
5.  The backend sends a **JSON response** back to the frontend.
6.  The frontend receives the response and updates its UI accordingly, for example, by logging the user in or displaying a list of products.
