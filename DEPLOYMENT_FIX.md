# 🔧 Инструкция по исправлению ошибок авторизации на Vercel

## Проблема

При попытке авторизации на Vercel возникали ошибки:

- **Error 403 Forbidden** - CSRF защита блокировала запросы
- **404 Not Found** - неправильный URL API (склеивались домены)

## ✅ Что было исправлено

### 1. **Frontend - APIClient (`src/services/api/client.ts`)**

Добавлена проверка наличия протокола в URL:

```typescript
constructor() {
  let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Ensure URL has protocol
  if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = `https://${apiUrl}`;
  }

  this.baseURL = apiUrl;
  console.log('APIClient initialized with baseURL:', this.baseURL);
}
```

Теперь даже если в переменной окружения указан URL без протокола, он автоматически добавится.

### 2. **Backend - CSRF Protection (`backend/src/server.ts`)**

Временно отключена CSRF защита (закомментирована), так как она не реализована на фронтенде:

```typescript
// CSRF protection disabled for now - uncomment when implementing on frontend
// app.use(csrfProtection);
// app.use(csrfTokenHandler);
```

Также добавлены необходимые body parser middleware:

```typescript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
```

## 🚀 Что нужно сделать для деплоя

### 1. **Проверить переменные окружения на Vercel**

Зайдите в настройки проекта на Vercel:

1. Откройте ваш проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Убедитесь, что установлена переменная:

```
VITE_API_URL = https://airbro-production.up.railway.app
```

⚠️ **ВАЖНО:** URL должен начинаться с `https://`

### 2. **Проверить переменные окружения на Railway (Backend)**

Зайдите в настройки проекта на Railway:

1. Откройте ваш проект на [railway.app](https://railway.app)
2. Перейдите в **Variables**
3. Проверьте, что установлены:

```
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://airbro-mrqs.vercel.app
DATABASE_URL = [ваша строка подключения PostgreSQL]
JWT_SECRET = [ваш секретный ключ минимум 32 символа]
JWT_EXPIRES_IN = 7d
```

### 3. **Задеплоить изменения**

#### Frontend (Vercel):

```bash
git add .
git commit -m "fix: Resolve auth errors - add protocol check and disable CSRF"
git push origin main
```

Vercel автоматически задеплоит изменения.

#### Backend (Railway):

```bash
cd backend
git add .
git commit -m "fix: Disable CSRF protection temporarily and add body parsers"
git push origin main
```

Railway автоматически задеплоит изменения.

### 4. **Тестирование**

После деплоя проверьте:

1. Откройте браузер Developer Tools (F12)
2. Перейдите во вкладку **Console**
3. Перейдите на сайт `https://airbro-mrqs.vercel.app`
4. Попробуйте авторизоваться
5. В консоли должно появиться сообщение:

   ```
   APIClient initialized with baseURL: https://airbro-production.up.railway.app
   ```

6. Проверьте вкладку **Network** - запросы должны идти на правильный URL:
   ```
   POST https://airbro-production.up.railway.app/api/auth/login
   ```

## 🔐 Безопасность (для будущего)

После того, как авторизация заработает, рекомендуется:

### Включить CSRF защиту обратно:

1. **Backend:** Раскомментировать в `backend/src/server.ts`:

   ```typescript
   app.use(csrfProtection);
   app.use(csrfTokenHandler);

   app.get('/api/csrf-token', (req, res) => {
     res.json({ csrfToken: req.csrfToken() });
   });
   ```

2. **Frontend:** Раскомментировать CSRF логику в `src/services/api/client.ts` (строки ~140-170)

## 📝 Дополнительные переменные окружения

### Vercel (Frontend):

```env
VITE_API_URL=https://airbro-production.up.railway.app
VITE_USE_MOCK_API=false
VITE_SENTRY_DSN=[ваш Sentry DSN, опционально]
VITE_GA_MEASUREMENT_ID=[ваш Google Analytics ID, опционально]
```

### Railway (Backend):

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://airbro-mrqs.vercel.app
DATABASE_URL=[ваша строка подключения PostgreSQL]
JWT_SECRET=[минимум 32 символа]
JWT_EXPIRES_IN=7d

# Опционально - Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHANNEL=

# Опционально - Криптокошельки
USDT_TRC20_WALLET=
USDT_ERC20_WALLET=
TON_WALLET=

# Опционально - Курсы валют
RUB_TO_USDT_RATE=95.5
RUB_TO_TON_RATE=15.2
```

## 🐛 Диагностика ошибок

### Если всё равно получаете 403:

1. Проверьте логи Railway - возможно блокировка на уровне сервера
2. Проверьте, что CSRF точно отключен (закомментирован)
3. Проверьте, что в CORS разрешен домен Vercel

### Если получаете 404:

1. Откройте консоль браузера и проверьте, на какой URL идет запрос
2. Убедитесь, что URL не содержит двойные домены
3. Проверьте сообщение в консоли: `APIClient initialized with baseURL: ...`

### Если получаете Network Error:

1. Проверьте, что backend на Railway запущен
2. Проверьте health endpoint: https://airbro-production.up.railway.app/health
3. Проверьте логи Railway

## 📞 Поддержка

Если проблемы остаются, проверьте:

- Логи на Vercel: Settings → Deployments → [последний деплой] → View Function Logs
- Логи на Railway: [ваш проект] → Deployments → [последний деплой] → View Logs
