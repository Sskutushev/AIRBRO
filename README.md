# AIBRO Business Landing Page

This is the official repository for the AIBRO Business landing page, a fully responsive, animated, and bilingual (English/Russian) single-page application built with a modern frontend stack.

![AIBRO Hero Section](public/images/screenshot.png) <!-- I'll assume a screenshot will be added here later -->

## ✨ Features

-   **Modern & Animated UI:** Built with Tailwind CSS and Framer Motion for a smooth, fluid user experience.
-   **Fully Responsive:** Adapts to all screen sizes, from mobile to desktop.
-   **Bilingual (i18n):** Supports English and Russian languages, managed by `i18next`.
-   **Light & Dark Modes:** Theme support with a toggle, persists in `localStorage`.
-   **Component-Based:** Structured with reusable React components for maintainability.
-   **Enhanced UI/UX:** Improved footer logo, responsive 'Мы рекомендуем' badge, and refined CTA sections for better user engagement.
-   **Contact Form:** A functional contact form that sends inquiries directly to a Telegram chat via a secure serverless function.

## 🛠️ Tech Stack

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Internationalization:** [i18next](https://www.i18next.com/)
-   **Deployment:** [Vercel](https://vercel.com/)

## 📄 Project Structure

The project is organized into a modular structure to keep the codebase clean and scalable. For a detailed breakdown of the architecture, file structure, and key concepts, please see the [**Project Structure Documentation**](./docs/PROJECT_STRUCTURE.md).

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18.x or higher)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sskutushev/AIRBRO.git
    cd AIRBRO
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Telegram Bot Token and Chat ID for the contact form to work.
    ```
    VITE_TELEGRAM_BOT_TOKEN=your_bot_token
    VITE_TELEGRAM_CHAT_ID=your_chat_id
    ```

### Running the Development Server

To start the Vite development server, run:

```bash
npm run dev
```

This will start the application on `http://localhost:5173` (or another port if 5173 is in use). The server supports Hot Module Replacement (HMR) for a fast development workflow.

### Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

This command will generate a `dist` folder in the project root, which contains the optimized and minified static assets for deployment.

## 部署 (Deployment)

The project is configured for easy deployment on [Vercel](https://vercel.com/). Simply connect your GitHub repository to a new Vercel project. Vercel will automatically detect the Vite configuration and deploy the application. The serverless function in the `api` directory will also be deployed automatically.
