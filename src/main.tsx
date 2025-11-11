import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { initSentry } from './lib/monitoring/sentry';
import { analytics } from './lib/analytics';
import './index.css';
import App from './App.tsx';

// Init Sentry
initSentry();
// Init Analytics
analytics.init();

// Wrap App in Sentry ErrorBoundary
const SentryApp = Sentry.withProfiler(App);

// Set theme based on user prefs
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

let initialTheme = 'light';
if (savedTheme) {
  initialTheme = savedTheme;
} else if (prefersDark) {
  initialTheme = 'dark';
}

document.documentElement.setAttribute('data-theme', initialTheme);
document.documentElement.classList.add(initialTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryApp />
  </StrictMode>
);
