# 5. Frontend Architecture

This document provides an overview of the frontend application's structure, key libraries, and core concepts.

## Core Technologies

- **React:** The fundamental library for building the user interface.
- **TypeScript:** Provides static typing for the entire codebase, reducing errors and improving developer experience.
- **Vite:** A modern and extremely fast build tool and development server.
- **TailwindCSS:** A utility-first CSS framework for rapid UI development.
- **React Router:** Handles all client-side routing and navigation.
- **TanStack Query:** Manages server state, including data fetching, caching, and synchronization.
- **React Hook Form & Zod:** Used together for powerful and type-safe form validation.
- **Framer Motion:** A production-ready animation library for React.
- **i18next:** Handles internationalization (i18n), allowing the application to be translated into multiple languages.

## Project Structure (`/src`)

The `/src` directory contains all the source code for the frontend application.

```
src/
├── assets/             # Static assets like images and SVGs.
├── components/         # Reusable UI components (Buttons, Inputs, Modals, etc.).
│   ├── forms/          # Specialized form components (FormInput, FormCheckbox).
│   └── sections/       # Large, page-specific sections (Header, Footer, HeroSection).
├── context/            # React Context providers for global state.
│   ├── AuthContext.tsx   # Manages user authentication state and JWT token.
│   └── ThemeContext.tsx  # Manages application theme (e.g., light/dark mode).
├── hooks/              # Custom React hooks for reusable logic.
│   └── useAuth.ts      # Contains hooks for login, register, and profile fetching.
├── i18n/               # Internationalization configuration and locale files.
├── lib/                # Utility functions, external library configurations.
│   ├── analytics/      # Analytics tracking functions.
│   ├── queryClient.ts  # Configuration for TanStack Query.
│   └── validation/     # Zod validation schemas.
├── pages/              # Top-level components that represent entire pages.
│   ├── AccountPage.tsx # User account and profile page.
│   ├── AuthPage.tsx    # Login and registration page.
│   └── PaymentPage.tsx # Page for handling payments.
├── services/           # Modules for interacting with external APIs.
│   └── api/            # Contains the API client for making requests to the backend.
├── types/              # Global TypeScript type definitions.
└── main.tsx            # The main entry point of the application.
```

## Key Concepts

### State Management

The application uses a hybrid approach to state management:

1.  **Server State:** Managed by **TanStack Query**. All data that comes from the backend (user profile, products, etc.) is fetched and cached by TanStack Query. This library handles loading states, errors, and re-fetching data automatically, which significantly simplifies data synchronization. The custom hooks in `src/hooks/` are built on top of TanStack Query's `useQuery` and `useMutation`.

2.  **Global Client State:** Managed by **React Context**. State that needs to be accessible across the entire application but doesn't come from the server is handled by Context. A key example is `AuthContext`, which stores the user's authentication status and JWT token, making it available to any component that needs it.

3.  **Local Component State:** Managed by React's built-in hooks like `useState` and `useReducer`. This is used for state that is only relevant to a single component, such as the open/closed state of a modal or the value of a form input.

### Authentication Flow

1.  The user navigates to the `AuthPage` and fills out the login or registration form.
2.  The form submission triggers a hook from `useAuth.ts` (e.g., `useLogin`).
3.  This hook uses the `apiClient` to send a `POST` request to the backend's `/api/auth/login` endpoint.
4.  If the credentials are valid, the backend responds with the user's data and a JWT.
5.  The `onSuccess` callback in the `useLogin` hook is executed. It calls the `setAuthData` function from `AuthContext`.
6.  `AuthContext` stores the user data and token (e.g., in local storage) and updates its state.
7.  Because the context has updated, any component subscribed to it will re-render. This typically redirects the user to their account page and updates the UI to a "logged-in" state (e.g., showing a "Logout" button instead of "Login").
8.  For all subsequent requests to protected backend routes, the `apiClient` automatically attaches the stored JWT to the `Authorization` header.

### Form Handling

- **React Hook Form** is used to manage form state, submissions, and validation.
- **Zod** is used to define validation schemas (`src/lib/validation/`). These schemas provide clear, readable rules for what constitutes valid data (e.g., a password must be at least 8 characters long).
- The `@hookform/resolvers` library connects Zod schemas to React Hook Form, enabling powerful, real-time validation with minimal boilerplate code. This is clearly demonstrated in `AuthPage.tsx`.
