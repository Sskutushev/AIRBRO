# Архитектура AIBRO Business

## Обзор системы

AIBRO Business представляет собой веб-приложение с разделённой архитектурой между frontend и backend. Система состоит из:

1. **Frontend**: React-приложение с адаптивным дизайном и интеграцией с внешними API
2. **Backend**: Express-сервер с REST API для обработки бизнес-логики и взаимодействия с базой данных
3. **База данных**: SQLite (для разработки) и PostgreSQL (для продакшена)
4. **Внешние интеграции**: Telegram API, криптовалютные кошельки

## Техническая архитектура

### Frontend
```
React + TypeScript + TailwindCSS + Vite
├── src/
│   ├── components/
│   │   ├── common/        # Переиспользуемые компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── CountUp.tsx
│   │   │   └── ...
│   │   └── sections/      # Секции страницы
│   │       ├── HeroSection.tsx
│   │       ├── ProductsSection.tsx
│   │       ├── PricingSection.tsx
│   │       └── ...
│   ├── context/           # React Context провайдеры
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ...
│   ├── hooks/             # Пользовательские хуки
│   │   └── useLogin.ts
│   ├── i18n/              # Конфигурация и переводы
│   ├── lib/               # Утилиты и библиотеки
│   ├── pages/             # Страницы приложения
│   │   ├── AccountPage.tsx
│   │   ├── AuthPage.tsx
│   │   └── ...
│   └── services/          # API сервисы
│       └── api.ts
```

### Backend
```
Express.js + TypeScript + Prisma
├── backend/
│   ├── src/
│   │   ├── config/        # Конфигурационные файлы
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── telegram.ts
│   │   ├── controllers/   # Обработчики бизнес-логики
│   │   │   ├── authController.ts
│   │   │   ├── cartController.ts
│   │   │   ├── paymentController.ts
│   │   │   └── ...
│   │   ├── middleware/    # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── ...
│   │   ├── models/        # TypeScript типы
│   │   │   ├── user.ts
│   │   │   ├── product.ts
│   │   │   ├── cart.ts
│   │   │   └── ...
│   │   ├── routes/        # API маршруты
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   └── ...
│   │   ├── services/      # Сервисные слои
│   │   │   └── crypto.ts
│   │   ├── utils/         # Утилиты
│   │   │   └── crypto.ts
│   │   └── server.ts      # Точка входа
│   ├── prisma/
│   │   ├── schema.prisma  # Схема базы данных
│   │   └── seed.ts        # Сиды данных
│   └── package.json
```

## Слой данных

### Схема базы данных (Prisma)

```
┌─ User ──────────────────────┐
│ id: String @id @default(...)│
│ email: String @unique       │
│ passwordHash: String        │
│ name: String                │
│ telegram: String @unique    │
│ createdAt: DateTime         │
│ updatedAt: DateTime         │
│ subscriptions: Subscription[]│
│ payments: Payment[]         │
│ cartItems: CartItem[]       │
└────────────────────────────┘
           │
           │ 1..*
           ▼
┌─ Subscription ──────────────┐
│ id: String @id @default(...)│
│ userId: String              │
│ productId: String           │
│ status: String              │
│ startDate: DateTime         │
│ endDate: DateTime           │
│ nextPaymentDate: DateTime?  │
│ cancelledAt: DateTime?      │
│ createdAt: DateTime         │
│ updatedAt: DateTime         │
└────────────────────────────┘

┌─ Product ───────────────────┐
│ id: String @id @default(...)│
│ slug: String @unique        │
│ name: String                │
│ description: String         │
│ price: Int                  │
│ interval: String            │
│ features: String            │
│ isActive: Boolean           │
│ tier: Int                   │
│ createdAt: DateTime         │
│ updatedAt: DateTime         │
│ subscriptions: Subscription[]│
│ cartItems: CartItem[]       │
└────────────────────────────┘

┌─ CartItem ──────────────────┐
│ id: String @id @default(...)│
│ userId: String              │
│ productId: String           │
│ quantity: Int               │
│ createdAt: DateTime         │
└────────────────────────────┘

┌─ Payment ───────────────────┐
│ id: String @id @default(...)│
│ userId: String              │
│ amount: Int                 │
│ currency: String            │
│ status: String              │
│ paymentMethod: String       │
│ walletAddress: String?      │
│ txHash: String?             │
│ qrCode: String?             │
│ metadata: String?           │
│ expiresAt: DateTime?        │
│ createdAt: DateTime         │
│ updatedAt: DateTime         │
└────────────────────────────┘
```

## Архитектура API

### Маршруты API

```
/api/
├── auth/                     # Аутентификация
│   ├── POST /register        # Регистрация
│   ├── POST /login           # Вход
│   └── GET /me               # Данные пользователя
├── products/                 # Продукты
│   ├── GET /                 # Все продукты
│   └── GET /:slug            # Продукт по slug
├── cart/                     # Корзина
│   ├── GET /                 # Получить корзину
│   ├── POST /add             # Добавить товар
│   ├── DELETE /:itemId       # Удалить товар
│   └── POST /clear           # Очистить корзину
├── payments/                 # Платежи
│   ├── POST /crypto/create   # Создать криптоплатеж
│   ├── GET /:id/status       # Статус платежа
│   └── POST /:id/confirm     # Подтвердить платеж
└── user/                     # Профиль пользователя
    ├── GET /profile          # Профиль
    ├── PUT /profile          # Обновить
    ├── GET /subscriptions    # Подписки
    ├── GET /payments         # История
    └── POST /subscriptions/:id/cancel  # Отменить
```

## Технические решения

### Аутентификация

- **JWT токены** для защиты маршрутов
- **bcrypt** для шифрования паролей (10 раундов)
- **Middleware** для проверки токенов
- **Cookie/LocalStorage** для хранения токена

### Безопасность

- **Валидация Zod** для входных данных
- **Rate limiting** для предотвращения атак
- **CORS** настроена для безопасности
- **Helmet** для дополнительной безопасности

### Кеш и оптимизация

- **React.memo** для оптимизации рендеринга компонентов
- **useMemo/useCallback** для мемоизации значений
- **Lazy loading** для оптимизации загрузки

### Кросс-платформенность

- **Responsive design** для всех устройств
- **Touch-оптимизации** для мобильных
- **Keyboard navigation** для доступности
- **Dark/Light themes** для пользовательского комфорта

## Интеграции

### Telegram API

- **Node-Telegram-Bot-API** для взаимодействия
- **Уведомления** о регистрации и платежах
- **Обратная связь** через форму

### Криптовалютные платежи

- **QR-коды** для оплаты
- **Поддержка USDT (TRC20/ERC20)** и **TON**
- **Статусы платежей** с таймерами
- **Генерация адресов** с использованием конфигурации

### Локализация

- **i18next** для многоязычности
- **RU и EN** языки
- **Автоматическое определение** языка
- **Переключение** между языками

## DevOps

### Сборка и деплой

- **Vite** для быстрой сборки frontend
- **TypeScript** для проверки типов
- **ESLint и Prettier** для качества кода
- **Git hooks** для проверки перед коммитом

### CI/CD

- **Vercel** для деплоя frontend
- **Railway/Render** для backend
- **Automated testing** на каждом пуше
- **Environment variables** для настройки

## Масштабируемость

### Архитектура

- **Stateless API** для горизонтального масштабирования
- **Database indexing** для быстрых запросов
- **Connection pooling** для эффективного использования ресурсов

### Кэширование

- **Redis** для кэширования сессий (опционально)
- **Browser caching** для статических ресурсов
- **API response caching** для популярных данных

## Мониторинг и логирование

### Логирование

- **Console logging** для разработки
- **Telegram notifications** для критических ошибок
- **Structured logging** для продакшена
- **Error tracking** для отслеживания ошибок

### Метрики

- **Performance monitoring** для отслеживания скорости
- **User behavior** аналитика
- **Payment success rates** мониторинг
- **System health** проверки

## Безопасность

### Аутентификация

- **JWT tokens** с коротким сроком действия
- **Refresh tokens** для длительного доступа
- **Multi-factor auth** (планируется)
- **Session management** для безопасности

### Защита данных

- **Encryption** для чувствительных данных
- **Data validation** на всех уровнях
- **SQL injection protection** через Prisma
- **XSS protection** через безопасные практики

## Тестирование

### Unit тесты

- **Jest** для unit тестов
- **React Testing Library** для компонентов
- **SuperTest** для API тестов
- **Coverage reports** для отслеживания покрытия

### Интеграционные тесты

- **API endpoint tests** для проверки взаимодействия
- **Database integration tests** для проверки работы с БД
- **Third-party service tests** для интеграций
- **End-to-end tests** для пользовательских сценариев