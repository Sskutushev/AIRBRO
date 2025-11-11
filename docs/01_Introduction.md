# 1. Introduction to AIRBRO Business

## What is AIRBRO?

**AIRBRO Business** is a comprehensive platform designed for entrepreneurs and companies building their business in the Telegram ecosystem. Our goal is to provide a powerful yet intuitive set of tools for automating sales, managing subscriptions, and interacting with customers directly in the messenger.

The project is a monorepo that includes:

- **Frontend:** A modern React web application that serves as both a marketing landing page and a user dashboard.
- **Backend:** A reliable Node.js/Express API service that manages all business logic, user data, and payments.

## Architectural Philosophy

When designing the system, we followed these principles:

1.  **Reliability and Stability:** Code should be strictly typed (TypeScript), covered with tests, and pass automated CI/CD checks before each deployment.
2.  **Performance:** We use modern tools (Vite, React) and approaches (lazy loading, image optimization) to ensure fast loading and responsive interfaces.
3.  **Scalability:** The backend architecture is built on a service model, allowing easy addition of new functionality. Using Prisma ORM provides flexibility when working with the database.
4.  **Security:** We pay attention to security at all levels: from API protection (rate limiting, CORS) to automatic code scanning for vulnerabilities (Snyk, CodeQL) and secrets (TruffleHog).
5.  **Developer Experience:** The project is configured so that new developers can start working quickly. This is facilitated by ready scripts, detailed documentation, and automation of routine tasks.

## Main Technology Stack

| Category     | Technology                           | Reason for choice                                                                                                               |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React, Vite, TypeScript              | Speed, strict typing, modern ecosystem.                                                                                         |
|              | Tailwind CSS                         | Fast and consistent UI development.                                                                                             |
|              | Tanstack Query                       | Effective server state management, caching, and synchronization.                                                                |
|              | Framer Motion                        | Creating smooth and expressive animations.                                                                                      |
| **Backend**  | Node.js, Express.js, TypeScript      | High performance, asynchrony, strict typing.                                                                                    |
|              | Prisma                               | Convenient and type-safe database work, simple schema migration.                                                                |
|              | SQLite                               | Lightweight and easy-to-use database for local development and testing. (PostgreSQL is recommended for production environments) |
|              | JWT (JSON Web Tokens)                | Standard and secure way of authentication for stateless API.                                                                    |
| **CI/CD**    | GitHub Actions                       | Deep integration with GitHub, flexibility in workflow setup.                                                                    |
| **Testing**  | Vitest, React Testing Library        | Fast and reliable unit/integration tests for the frontend.                                                                      |
|              | Playwright                           | Powerful and stable E2E tests.                                                                                                  |
| **Hosting**  | Vercel (frontend), Railway (backend) | Optimal platforms for hosting full-stack applications with CI/CD integration.                                                   |

---

**Next:** [02 - Getting Started](./02_Getting_Started.md)
