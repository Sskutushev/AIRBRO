# AIRBRO Business - AI-Powered Automation Ecosystem

[![CI](https://github.com/Sskutushev/AIRBRO-Business/actions/workflows/ci.yml/badge.svg)](https://github.com/Sskutushev/AIRBRO-Business/actions/workflows/ci.yml)
[![Security Scan](https://github.com/Sskutushev/AIRBRO-Business/actions/workflows/security.yml/badge.svg)](https://github.com/Sskutushev/AIRBRO-Business/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AIRBRO Business** is an AI-powered automation ecosystem designed for businesses operating primarily in Telegram. The platform provides tools for creating, managing, and selling digital products and services, as well as for interacting with customers.

> **Note:** This repository contains both the frontend (landing page and web application) and the project backend.

## 🚀 Quick Start

For full local deployment of the project (frontend + backend), follow the instructions in the **[Getting Started Guide](./docs/02_Getting_Started.md)**.

### Frontend Only

If you need to run only the frontend part:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the dev server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📚 Documentation

All detailed project documentation is located in the [`/docs`](./docs/) folder.

- **[01 - Introduction](./docs/01_Introduction.md):** Project and architecture overview.
- **[02 - Getting Started](./docs/02_Getting_Started.md):** Complete installation and launch guide.
- **[03 - Backend and API](./docs/03_Backend_API.md):** API, routes, and backend logic description.
- **[04 - Database Schema](./docs/04_Database_Schema.md):** Analysis of data models and their relationships.
- **[05 - Frontend](./docs/05_Frontend.md):** Frontend architecture, components, and state management description.
- **[06 - Deployment](./docs/06_Deployment.md):** Information about deployment processes on Vercel and Railway.
- **[07 - CI/CD](./docs/07_CI_CD.md):** Continuous integration and delivery pipeline description.
- **[08 - Testing](./docs/08_Testing.md):** How to run and write tests.

## 🛠 Main Technology Stack

- **Frontend:**
  - **Framework:** React (with Vite)
  - **Language:** TypeScript
  - **Styling:** Tailwind CSS
  - **Animations:** Framer Motion
  - **Data management:** Tanstack Query
- **Backend:**
  - **Framework:** Express.js
  - **Language:** TypeScript
  - **Database:** SQLite
  - **ORM:** Prisma
- **CI/CD:** GitHub Actions
- **Hosting:**
  - **Frontend:** Vercel
  - **Backend:** Railway
