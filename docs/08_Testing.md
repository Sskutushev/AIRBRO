# 8. Testing

Testing is an integral part of the development process in AIRBRO Business. It helps ensure stability, reliability, and predictability of the application.

## Testing Strategy

We use a multi-level approach to testing, inspired by the "testing pyramid".

### 1. Unit and Integration Tests

This is the main and most numerous type of tests in the project.

- **Frontend Tools:**
  - [Vitest](https://vitest.dev/): Modern and fast testing framework compatible with Vite.
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/): Library for testing React components that encourages writing user-focused tests.
  - [JSDOM](https://github.com/jsdom/jsdom): Emulates browser environment in Node.js for running tests.

- **Backend Tools:**
  - [Vitest](https://vitest.dev/): Migrated from Jest for consistency and better performance.
  - [Supertest](https://github.com/lucasberesford/supertest): HTTP assertion library for testing API endpoints.
  - [Prisma](https://www.prisma.io/): For database integration tests.

- **What we test:**
  - **Individual functions (unit tests):** Testing utility functions and helpers (e.g., date formatting, validators).
  - **React components:** Checking that components render correctly based on props, display the right data, and respond properly to user actions (clicks, text input).
  - **React hooks:** Testing custom hooks and their logic.
  - **Component interaction (integration tests):** Checking that multiple components work together as a single unit (e.g., a form with input fields and a submit button).
  - **Backend controllers:** Testing all API endpoints for authentication, cart functionality, products, payments, and user management.
  - **Database operations:** Integration tests with real database operations using test database isolation.

- **How to run tests:**
  - **Frontend tests once:**
    ```bash
    npm run test
    ```
  - **Frontend tests in watch mode:** Tests will automatically re-run when files change.
    ```bash
    npm run test:watch
    ```
  - **Frontend tests with UI and coverage report:**
    ```bash
    npm run test:ui
    npm run test:coverage
    ```
  - **Backend tests:**
    ```bash
    cd backend
    npm run test:run
    ```
  - **Backend tests with coverage:**
    ```bash
    cd backend
    npm run test:coverage
    ```

### 2. End-to-End (E2E) Tests

These tests verify the entire system by simulating real user actions in an actual browser.

- **Tool:** [Playwright](https://playwright.dev/)

- **What we test:**
  - Key user scenarios, such as:
    - User registration and login.
    - Viewing product list and adding to cart.
    - Payment process.
    - Navigating the dashboard.
    - Complete user flows from landing to payment completion.

- **Status:**
  - E2E tests are **enabled** in the CI/CD pipeline (`ci.yml`) and run automatically. They should also be run locally before making significant changes to core functionality.

- **How to run E2E tests:**
  1.  **Install Playwright browsers:**
      ```bash
      npx playwright install --with-deps
      ```
  2.  **Run the tests:**
      ```bash
      npm run test:e2e
      ```

### 3. Static Analysis

While not testing in the classical sense, static analysis is an important part of our quality strategy.

- **Tools:** ESLint, Prettier, TypeScript.
- **What is checked:**
  - Compliance with a consistent code style.
  - Absence of syntax errors.
  - Absence of type errors.
- **When it runs:** Automatically on every commit (using `lint-staged` and `husky`), as well as in the CI/CD pipeline.

---

This concludes the testing documentation.
