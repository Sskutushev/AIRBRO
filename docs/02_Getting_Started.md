# 2. Getting Started

This guide will help you set up and run the **AIRBRO Business** project locally for development.

## Step 1: Prerequisites

Make sure the following are installed on your computer:

- **Node.js:** version `20.x` or higher.
- **npm:** version `10.x` or higher (usually comes with Node.js).
- **Git:** version control system.

## Step 2: Clone the Repository

Open a terminal and run the following command:

```bash
git clone https://github.com/Sskutushev/AIRBRO-Business.git
cd AIRBRO-Business
```

## Step 3: Backend Setup

The backend requires separate configuration.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    - Create a `.env` file in the `backend` folder.
    - Copy the basic configuration into it:

      ```env
      # Database connection URL. For local development with SQLite.
      DATABASE_URL="file:./dev.db"

      # Secret key for signing JWT tokens. Create any complex string.
      JWT_SECRET="your-super-secret-jwt-key-must-be-at-least-32-chars-long"

      # Frontend URL for CORS configuration
      FRONTEND_URL="http://localhost:5173"

      # Port for the backend server
      PORT=3000

      # Logging settings (optional)
      LOG_LEVEL="info"
      ```

4.  **Create and apply database migrations:**
    This command will set up your PostgreSQL database and create all tables according to the schema in `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

## Step 4: Frontend Setup

Now let's set up the frontend.

1.  **Return to the project root directory:**

    ```bash
    cd ..
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables (optional):**
    - The frontend can work without an `.env` file, using mock data or connecting to the local backend by default.
    - To connect to production API or other services (Sentry, Google Analytics), create an `.env` file in the project root and add the appropriate variables:
      ```env
      VITE_API_URL="http://localhost:3000"
      VITE_SENTRY_DSN="..."
      VITE_GA_MEASUREMENT_ID="..."
      ```

## Step 5: Running the Project

Now that everything is configured, you can run both servers.

1.  **Run the backend:**
    - Open a **first terminal**.
    - Navigate to the `backend` folder and run the dev server:
      ```bash
      cd backend
      npm run dev
      ```
    - The server will run on `http://localhost:3000`.

2.  **Run the frontend:**
    - Open a **second terminal**.
    - From the project root, run the dev server:
      ```bash
      npm run dev
      ```
    - The web application will open in your browser at `http://localhost:5173`.

**Congratulations!** You now have a fully working local copy of the AIRBRO Business project.

---

**Next:** [03 - Backend and API](./03_Backend_API.md)
