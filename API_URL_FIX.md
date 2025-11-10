# 🚨 КРИТИЧЕСКАЯ ОШИБКА: API URL не работает в production

## 🔍 Проблема:

В логах видно: `http://localhost:300/api/auth/login`
Но должно быть: `https://api.aibrobusiness.com/api/auth/login`

## 🛠 РЕШЕНИЕ - Настройка переменных окружения в Vercel:

### 1. Войдите в панель управления Vercel:

- https://vercel.com/dashboard
- Выберите проект AIRBRO

### 2. Перейдите в Settings → Environment Variables:

- https://vercel.com/dashboard/project/[project-id]/settings/environment-variables

### 3. Добавьте следующие переменные:

```
Name: VITE_API_URL
Value: https://api.aibrobusiness.com
Environment: Production, Preview, Development

Name: VITE_SENTRY_DSN
Value: https://c908da1d6af98b5e706a07842906793d@o4510323850149888.ingest.de.sentry.io/4510323853754448
Environment: Production, Preview, Development

Name: VITE_GA_MEASUREMENT_ID
Value: G_-88zE_Qqel0mha3AjFMg
Environment: Production, Preview, Development
```

### 4. Пересоберите проект:

- Перейдите в Deployments
- Нажмите "Redeploy" на последнем деплое

## ✅ Альтернативное решение - Hardcode API URL:

Если проблема с переменными окружения не решается, временно добавлю hardcode URL:
