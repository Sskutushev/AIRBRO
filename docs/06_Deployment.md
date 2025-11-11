# 6. Deployment

The AIRBRO Business project is deployed as two separate applications: frontend and backend. Deployment processes are fully automated using GitHub Actions.

## Frontend

- **Platform:** [Vercel](https://vercel.com/)
- **Workflow:** [`deploy-frontend.yml`](../.github/workflows/deploy-frontend.yml)
- **URL:** `https://aibrobusiness.com` (example)

### Deployment Process

1.  **Trigger:** Deployment is automatically triggered on every `push` to the `main` branch, if changes affect frontend files (`src/**`, `public/**`, `package.json`, etc.).

2.  **Build:**
    - GitHub Action runs the `npm run build` command.
    - During the build, production environment variables (e.g., `VITE_API_URL`) stored in GitHub repository secrets are used. Vite automatically exposes environment variables prefixed with `VITE_` to the client-side code.

3.  **Deployment to Vercel:**
    - The `amondnet/vercel-action` is used, which uploads the build files (`dist`) to Vercel.
    - Vercel automatically assigns the new deployment to the production domain.

4.  **Upload Source Maps to Sentry:**
    - After successful deployment, `source maps` are uploaded to Sentry. This allows seeing readable error stack traces in production.

5.  **Slack Notification:**
    - At the end of the workflow, a notification is sent to Slack about the deployment status (success or failure).

## Backend

- **Platform:** [Railway](https://railway.app/)
- **Workflow:** [`deploy-backend.yml`](../.github/workflows/deploy-backend.yml)
- **URL:** `https://api.aibrobusiness.com` (example)

### Deployment Process

1.  **Trigger:** Deployment is automatically triggered on every `push` to the `main` branch, if changes affect the `backend/**` folder.

2.  **Install Railway CLI:**
    - The official Railway CLI tool is installed in the workflow.

3.  **Deployment to Railway:**
    - The `railway up` command is executed, which automatically detects the project type (Node.js), builds it (if needed), and deploys it.
    - Railway uses `Dockerfile` or `Nixpacks` to build and run the service. Environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`) must be configured in the Railway project itself.

4.  **Apply Migrations:**
    - After deployment, the command `railway run npx prisma migrate deploy` is executed to apply any new migrations to the production database.

5.  **Health Check:**
    - The workflow pauses for 10 seconds, then sends a request to the `/health` endpoint. If the service does not respond with a `200 OK` status, the workflow fails.

6.  **Slack Notification:**
    - As with the frontend, a notification about the deployment status is sent.

---

**Next:** [07 - CI/CD](./07_CI_CD.md)
