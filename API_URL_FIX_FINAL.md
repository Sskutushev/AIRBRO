# 🚨 ПРОБЛЕМА С API URL - Дублирование доменов

## 🔍 Проблема:

В логах видно неправильный URL:

```
POST https://airbro-mrqs.vercel.app/airbro-production.up.railway.app/api/auth/login 404 (Not Found)
```

Домены дублируются: `airbro-mrqs.vercel.app` + `airbro-production.up.railway.app`

## 🛠 ИСПРАВЛЕНИЕ:

### В Vercel Dashboard:

1. Перейдите в панель управления Vercel: https://vercel.com/dashboard
2. Выберите проект AIRBRO
3. **Settings** → **Environment Variables**
4. Найдите переменную `VITE_API_URL`
5. **Измените значение на:**
   ```
   https://airbro-production.up.railway.app
   ```
   (БЕЗ `airbro-mrqs.vercel.app`)

### Правильный URL должен быть:

```
https://airbro-production.up.railway.app
```

### После исправления:

1. Перезапустите деплой в Vercel
2. Проверьте авторизацию на сайте

## 🔧 Альтернативное решение:

Если проблема повторяется, проверьте в коде:

```typescript
// В src/services/api/client.ts
console.log('API URL:', this.baseURL);
// Должно быть: https://airbro-production.up.railway.app
```

## ✅ Что должно произойти:

После исправления URL запросы будут идти на:

```
POST https://airbro-production.up.railway.app/api/auth/login
```

И авторизация заработает!
