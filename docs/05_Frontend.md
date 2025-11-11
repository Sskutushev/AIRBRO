# 5. Frontend

The AIRBRO Business frontend is a modern single-page application (SPA) built with React and Vite. It serves two main functions:

1.  **Marketing Landing Page:** Attracts new users and informs them about the platform's capabilities.
2.  **Web Application (Dashboard):** Provides registered users with access to their profile, subscriptions, and other features.

## Architecture and Folder Structure

The `src` folder structure is organized by feature-based principle, which simplifies navigation and code maintenance.

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
│   ├── common/     # Base components (Button, Input, Skeleton)
│   └── sections/   # Large landing sections (Hero, FAQ, Footer)
├── context/        # React Context for global state
├── data/           # Mock data and other static data (e.g., modules.ts)
├── hooks/          # Reusable React hooks
├── i18n/           # Configuration and localization files (i18next)
├── lib/            # Utility libraries and helpers
├── mocks/          # Mock Service Worker (MSW) setup for API mocking
├── pages/          # Page components (Account, Payment, Auth)
├── services/       # Logic for interacting with external APIs
├── test/           # Test utilities and setup files
└── types/          # Global TypeScript type definitions
```

## Key Libraries and Their Role

- **Vite:** Project bundler that provides extremely fast hot module replacement (HMR) in development and optimized builds for production.
- **React:** Foundation of the application, used for building declarative and component-based UI.
- **TypeScript:** Provides strict typing, which significantly reduces the number of errors and improves code readability.
- **React Router:** Manages navigation and routing in the application.
- **Tailwind CSS:** Utility-first CSS framework that enables fast and consistent styling of components directly in JSX markup.
- **Tanstack Query (React Query):** Powerful library for server state management. It handles caching, background synchronization, loading and error state handling when working with APIs. This eliminates the need to store server data in global state (like Redux).
- **Framer Motion:** Library for creating smooth and complex animations. Used to enhance user experience (UX).
- **React Hook Form & Zod:** Combination for form management. `React Hook Form` optimizes form performance, while `Zod` is used for data validation both on the client and server.
- **i18next:** Internationalization (i18n) framework that allows easy addition and switching of languages in the application.
- **MSW (Mock Service Worker):** Used for API mocking in development and testing environments, allowing frontend development and testing without a running backend.

## State Management

The state management approach in the project is hybrid:

1.  **Server State:** Managed exclusively with **Tanstack Query**. All data retrieved from the backend (user profile, product list, subscriptions) is stored and cached by this library. This is the de facto standard for modern React applications.
2.  **Global UI State:** A small amount of global state not related to the server (e.g., current theme information, user authentication status) is managed with **React Context**. This avoids unnecessary complexity and the need for heavy libraries like Redux.
3.  **Local State:** State of individual components (e.g., whether a modal is open, input field value) is managed with standard hooks `useState` and `useReducer`.

## Styling

Styling is built on **Tailwind CSS**. All primary colors, fonts, and other design tokens are defined in the [`tailwind.config.js`](../tailwind.config.js) file. For convenience and style reusability, the following utilities are used:

- **`clsx`**: Utility for conditional joining of CSS classes.
- **`tailwind-merge`**: Utility for resolving Tailwind class conflicts (e.g., when overriding `p-2` with `p-4`).

---

**Next:** [06 - Deployment](./06_Deployment.md)
