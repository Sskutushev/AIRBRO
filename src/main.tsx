import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Установка начальной темы на основе предпочтений пользователя
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
    <App />
  </StrictMode>,
)
