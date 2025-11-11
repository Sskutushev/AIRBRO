# 7. CI/CD (Continuous Integration and Delivery)

The CI/CD processes in the AIRBRO Business project are configured using **GitHub Actions**. They provide automated code quality checks, building, and deployment of the application, minimizing the risk of errors in production.

## Main Workflows

The project has three main workflows configured:

1.  **`ci.yml`**: The main CI pipeline, checking code quality on every push.
2.  **`security.yml`**: Security scanning pipeline.
3.  **`deploy-*.yml`**: Pipelines for deploying frontend and backend.

---

### 1. `ci.yml` - Continuous Integration

This workflow runs on every `push` or `pull request` to the `main` and `develop` branches. Its purpose is to ensure that changes do not break functionality and meet quality standards.

**Jobs:**

- **`lint` (Linting and formatting):**
  - Checks code compliance with ESLint rules.
  - Checks code formatting using Prettier.
  - **Goal:** Maintain a consistent code style and catch syntax errors.

- **`typecheck` (TypeScript type checking):**
  - Runs `tsc --noEmit` command for frontend and backend.
  - **Goal:** Ensure that there are no type errors throughout the project.

- **`test` (Unit tests):**
  - Runs unit and integration tests using `vitest`.
  - Generates a test coverage report.
  - Uploads the coverage report to [Codecov](https://about.codecov.io/).
  - **Goal:** Ensure that existing business logic works correctly.

- **`build` (Build check):**
  - Performs production builds of the frontend (`npm run build`) and backend.
  - Checks that the final frontend bundle size does not exceed the set limit (20 MB).
  - **Goal:** Ensure the project can be successfully built for production.

- **`e2e` (End-to-End tests):**
  - Runs end-to-end tests using Playwright, which simulate actions of a real user in the browser.

---

### 2. `security.yml` - Security Scanning

This workflow runs weekly, as well as on every `push` to `main`.

**Jobs:**

- **`audit` (Dependency audit):**
  - Runs `npm audit` for frontend and backend.
  - **Goal:** Detect known vulnerabilities in used npm packages.

- **`snyk` (Snyk scanning):**
  - Uses Snyk for deeper vulnerability analysis in code and dependencies.
  - **Goal:** Comprehensive security check of the project.

- **`codeql` (CodeQL analysis):**
  - Uses GitHub's static analysis tool to find potential vulnerabilities and errors in code.
  - **Goal:** Find complex vulnerabilities, such as SQL injections, XSS, etc.

- **`secrets` (Secrets scanning):**
  - Uses TruffleHog to search for accidentally committed secrets (API keys, passwords) in Git history.
  - **Goal:** Prevent leakage of confidential data.

---

### 3. `deploy-frontend.yml` and `deploy-backend.yml`

These workflows are responsible for application deployment. They are described in detail in section **[06 - Deployment](./06_Deployment.md)**.

---

**Next:** [08 - Testing](./08_Testing.md)
