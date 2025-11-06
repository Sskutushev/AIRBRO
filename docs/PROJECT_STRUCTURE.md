# Project Structure and Architecture

This document provides a detailed overview of the AIBRO Business landing page project structure, architecture, and key concepts.

## 1. Core Technologies

The project is built with a modern frontend stack:

-   **Vite:** A next-generation frontend tooling that provides a faster and leaner development experience. It serves files over native ES modules, enabling lightning-fast Hot Module Replacement (HMR).
-   **React:** A declarative, efficient, and flexible JavaScript library for building user interfaces. The project uses functional components with Hooks.
-   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript. It helps in writing more robust and maintainable code by adding static types.
-   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs. It's configured with custom themes (colors, fonts) in `tailwind.config.js`.
-   **Framer Motion:** A production-ready motion library for React. It's used for all animations and page transitions to create a fluid and engaging user experience.
-   **i18next:** A powerful internationalization framework for JavaScript. It's used to manage English and Russian translations, with JSON files for each language.

## 2. Directory Structure

The project follows a standard Vite/React project structure, with some additions for this specific application.

```
/
├── .env                  # Environment variables (e.g., for API keys)
├── .gitignore            # Files and folders to be ignored by Git
├── index.html            # The main HTML entry point for the application
├── package.json          # Project metadata and dependencies
├── vite.config.ts        # Vite configuration file
├── tailwind.config.js    # Tailwind CSS configuration file
├── tsconfig.json         # TypeScript compiler configuration
├── api/                  # Serverless functions (e.g., for Vercel)
│   └── telegram.ts       # Function to handle form submissions and send Telegram messages
├── docs/                 # Project documentation
│   └── PROJECT_STRUCTURE.md # This file
├── public/               # Static assets that are served directly
│   └── images/           # Images, videos, and other media
└── src/                  # Main application source code
    ├── assets/           # Static assets processed by Vite (e.g., SVGs)
    ├── components/       # Reusable React components
    │   ├── common/       # General-purpose components (Button, Modal, etc.)
    │   └── sections/     # Components for each section of the landing page
    ├── context/          # React Context providers for global state
    │   ├── AuthContext.tsx # Manages user authentication state
    │   └── ThemeContext.tsx# Manages the light/dark theme
    ├── i18n/               # Internationalization (i18n) configuration
    │   ├── config.ts     # i18next configuration file
    │   └── locales/      # Translation files
    │       ├── en/       # English translations
    │       └── ru/       # Russian translations
    ├── pages/            # Page components (though this project is a single-page app)
    ├── services/         # Business logic and API calls
    └── main.tsx          # The main entry point for the React application
```

### Key Files and Directories Explained

-   **`vite.config.ts`**: Configures the Vite build tool. It sets up the React plugin.
-   **`tailwind.config.js`**: This is where the design system is defined. It extends the default Tailwind theme with custom colors (`primary-telegram`, `bg-primary`, etc.), fonts, and other design tokens.
-   **`src/main.tsx`**: The root of the React application. It renders the main `App` component and wraps it with necessary context providers (`AuthProvider`, `ThemeProvider`, `I18nextProvider`).
-   **`src/App.tsx`**: The main application component. It lays out all the different sections of the landing page.
-   **`src/components/sections/`**: Each file in this directory corresponds to a major section of the landing page (e.g., `HeroSection.tsx`, `ProblemSection.tsx`). This makes the codebase modular and easy to navigate.
-   **`src/i18n/`**: This directory contains the entire translation system.
    -   `config.ts`: Initializes `i18next`, registers namespaces, and sets up language detection.
    -   `locales/`: Contains JSON files for each language, split by namespace (e.g., `hero.json`, `problem.json`). This separation keeps translation files small and organized.
-   **`src/context/`**: Manages global state.
    -   `ThemeContext.tsx`: Provides the current theme (`light` or `dark`) and a function to toggle it. The theme is persisted in `localStorage`.
    -   `AuthContext.tsx`: A placeholder for managing user authentication.
-   **`api/telegram.ts`**: A serverless function (for Vercel) that receives data from the contact form and sends a formatted message to a specified Telegram chat using a bot token. This is a secure way to handle form submissions without exposing the bot token on the client-side.

## 3. Architectural Concepts

### Component-Based Architecture

The UI is broken down into a hierarchy of reusable components. The main page is composed of larger "section" components, which in turn are built from smaller "common" components like `Button.tsx` and `Card.tsx`.

### Styling

Styling is handled primarily with **Tailwind CSS**. The `tailwind.config.js` file is customized to define a specific color palette for the AIBRO brand. This includes primary colors, background colors, and text colors for both light and dark themes. The dark theme is enabled by adding a `dark` class to the `<html>` element, which is managed by the `ThemeContext`.

### State Management

-   **Local State:** Most components manage their own state using the `useState` hook (e.g., for form inputs, or to track the current slide in a carousel).
-   **Global State:** For state that needs to be shared across the entire application, React's Context API is used:
    -   **Theme:** `ThemeContext` provides the current theme and the `toggleTheme` function to all components.
    -   **Authentication:** `AuthContext` is set up to provide user information and `login`/`logout` functions.

### Internationalization (i18n)

The site is fully bilingual (Russian/English).
-   The `useTranslation` hook from `react-i18next` is used in components to get the `t` function.
-   Text is stored in JSON files under `src/i18n/locales/`.
-   Content is organized into **namespaces** (e.g., `hero`, `problem`, `footer`). This allows for code splitting of translations and keeps the files manageable. A component specifies which namespace it needs when calling `useTranslation('namespace')`.
-   The user's selected language is persisted in `localStorage`.

### Animations

All animations are handled by **Framer Motion**. This includes:
-   **Page Load Animations:** Sections fade in and slide up as the user scrolls.
-   **Micro-interactions:** Buttons, cards, and other elements have subtle hover and press animations.
-   **Complex Transitions:** The library is used for more complex animations like the testimonial carousel.
