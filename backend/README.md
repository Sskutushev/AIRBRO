# Backend - AIRBRO Business

This section contains the backend service for the AIRBRO Business platform. It is built on Node.js, Express, and Prisma.

## 🚀 Quick Start

For full project deployment (frontend + backend), follow instructions in the **[main guide](../docs/02_Getting_Started.md)**.

### Running Backend Only

1.  **Navigate to the directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    - Create a `.env` file in the `backend` folder, copying the content from `.env.example` (if it exists).
    - Fill in the required variables, primarily `DATABASE_URL`. For local development, the default value is suitable:
      ```env
      DATABASE_URL="postgresql://username:password@localhost:5432/aibro_business"
      ```

4.  **Apply database migrations:**
    This will set up your PostgreSQL database and create all necessary tables.

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the dev server:**
    The server will automatically reload on code changes.
    ```bash
    npm run dev
    ```
    The backend will be available at `http://localhost:3000`.

## 🛠 Scripts

- `npm run dev`: Run the server in development mode with `tsx`.
- `npm run build`: Build the project using `tsc`.
- `npm run start`: Run the compiled project version.
- `npm run prisma:generate`: Generate Prisma Client.
- `npm run prisma:migrate`: Apply database migrations.
- `npm run prisma:studio`: Open Prisma Studio for viewing and editing data.
- `npm run prisma:seed`: Populate database with test data (if `prisma/seed.ts` is configured).

## 📚 Detailed Documentation

- **[API and Routes](../docs/03_Backend_API.md)**
- **[Database Schema](../docs/04_Database_Schema.md)**
