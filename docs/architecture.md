# Архитектура проекта AIBRO Business

## Общая архитектура

AIBRO Business - это веб-приложение с разделённым фронтендом и бэкендом:

- **Frontend**: React + TypeScript + TailwindCSS + i18next
- **Backend**: Express.js + TypeScript + Prisma ORM + SQLite/PostgreSQL
- **Аутентификация**: JWT токены
- **Локализация**: i18next с поддержкой RU/EN

## Структура проекта

```
AIBRO/
├── backend/                 # Бэкенд приложения
│   ├── src/
│   │   ├── config/         # Конфигурация (JWT, Telegram)
│   │   ├── controllers/    # Бизнес-логика
│   │   ├── middleware/     # Middleware (аутентификация, валидация)
│   │   ├── models/         # TypeScript типы
│   │   ├── routes/         # API маршруты
│   │   ├── services/       # Сервисные слои
│   │   ├── utils/          # Утилиты (криптоплатежи)
│   │   └── server.ts       # Точка входа
│   ├── prisma/             # Схема БД и миграции
│   └── package.json
├── src/                    # Фронтенд приложения
│   ├── components/         # React компоненты
│   ├── context/            # React контексты
│   ├── hooks/              # React хуки
│   ├── i18n/               # Файлы локализации
│   ├── lib/                # Библиотеки и утилиты
│   ├── pages/              # Страницы приложения
│   └── services/           # Сервисы (API)
├── public/                 # Публичные ресурсы
└── docs/                   # Документация
```

## База данных

Используется Prisma ORM с поддержкой SQLite (dev) и PostgreSQL (prod).

### Модели данных

- **User**: Пользователи системы
- **Product**: Продукты и услуги
- **CartItem**: Элементы корзины
- **Subscription**: Подписки пользователей
- **Payment**: История платежей

## Аутентификация

- JWT-токены для аутентификации
- Защита паролей с помощью bcrypt (10 раундов)
- Middleware для проверки токенов

## API

Все API эндпоинты доступны по префиксу `/api/`:

- `/api/auth/` - аутентификация
- `/api/products/` - продукты
- `/api/cart/` - корзина
- `/api/payments/` - платежи
- `/api/user/` - пользовательские данные
- `/api/telegram/` - интеграция с Telegram