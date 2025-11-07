# AIBRO Business - Полная документация проекта

## Обзор

AIBRO Business - это комплексная система автоматизации малого и среднего бизнеса, полностью интегрированная в Telegram. Система предоставляет набор инструментов на основе искусственного интеллекта для автоматизации различных аспектов бизнеса: создание контента, управление заказами, бронирование, обратная связь и многое другое.

## Стек технологий

### Frontend
- **React** (v19.1.1) - Библиотека компонентного UI
- **TypeScript** - Строгая типизация
- **Vite** (v7.1.7) - Современный инструмент сборки
- **TailwindCSS** - Утилитарный CSS-фреймворк
- **Framer Motion** - Анимации и переходы
- **React Router** - Маршрутизация
- **i18next** - Многоязычность
- **Zod** - Валидация данных
- **Sentry** - Мониторинг ошибок
- **Testing Library** - Тестирование компонентов

### Backend
- **Express.js** - Веб-фреймворк
- **TypeScript** - Строгая типизация
- **Prisma** - ORM для работы с базой данных
- **SQLite/PostgreSQL** - Хранение данных
- **JWT** - Аутентификация
- **BCrypt** - Хеширование паролей
- **Zod** - Валидация данных

## Структура проекта

```
AIBRO/
├── backend/                    # Бэкенд приложения
│   ├── prisma/                # Схема БД и миграции
│   ├── src/
│   │   ├── config/            # Конфигурация
│   │   ├── controllers/       # Бизнес-логика
│   │   ├── middleware/        # Middleware
│   │   ├── models/            # TypeScript типы
│   │   ├── routes/            # API маршруты
│   │   ├── services/          # Сервисные слои
│   │   ├── utils/             # Утилиты
│   │   └── prisma/            # Схема БД и миграции
│   ├── .env                   # Переменные окружения
│   ├── .env.example           # Пример переменных
│   └── package.json
├── src/                        # Фронтенд приложения
│   ├── components/            # React компоненты
│   │   ├── common/            # Общие компоненты
│   │   ├── sections/          # Секции страниц
│   │   └── __tests__          # Тесты компонентов
│   ├── context/               # React контексты
│   ├── hooks/                 # React хуки
│   │   └── __tests__          # Тесты хуков
│   ├── i18n/                  # Локализация
│   ├── lib/                   # Библиотеки и утилиты
│   │   ├── analytics/         # Слой аналитики
│   │   ├── monitoring/        # Слой мониторинга
│   │   ├── utils/             # Утилиты
│   │   │   └── __tests__      # Тесты утилит
│   │   └── validation/        # Валидация
│   ├── pages/                 # Страницы приложения
│   ├── services/              # API сервисы
│   │   └── __tests__          # Тесты API сервисов
│   ├── test/                  # Файлы настройки тестирования
│   ├── types/                 # TypeScript типы
│   └── __tests__              # Интеграционные тесты
├── public/                    # Публичные ресурсы
├── docs/                      # Документация
├── assets/                    # Изображения
├── .env                       # Переменные окружения
├── .env.example               # Пример переменных
├── package.json              # Зависимости
└── README.md                 # Документация
```

## Установка и запуск

### Требования
- Node.js 18+
- npm или yarn
- Git

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Sskutushev/AIRBRO.git
cd AIBRO
```

2. Установите зависимости для фронтенда:
```bash
npm install
```

3. Установите зависимости для бэкенда:
```bash
cd backend
npm install
```

4. Настройте переменные окружения:

#### Frontend .env:
```bash
VITE_API_URL=http://localhost:3000/api
VITE_SENTRY_DSN=ваш_sentry_dsn
VITE_GA_MEASUREMENT_ID=ваш_google_analytics_id
```

#### Backend .env:
```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=ваш_секретный_ключ_для_jwt
USDT_TRC20_WALLET=ваш_TRC20_адрес
USDT_ERC20_WALLET=ваш_ERC20_адрес
TON_WALLET=ваш_TON_адрес
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_ADMIN_CHANNEL=ваш_ID_канала
```

### Запуск

1. Запустите бэкенд:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

2. В новом терминале запустите фронтенд:
```bash
cd ..  # или cd ../frontend если вы в backend директории
npm run dev
```

Приложение будет доступно по адресу: [http://localhost:5173](http://localhost:5173)

## API документация

Полная документация API доступна в [api_documentation.md](docs/api_documentation.md)

## Тестирование

### Запуск тестов

Для запуска тестов выполните:
```bash
# Фронтенд тесты
npm run test

# Бэкенд тесты
cd backend
npm run test
```

## Особенности реализации

### Архитектурные решения
1. **Component-Based Architecture** - модульная архитектура компонентов
2. **Feature-Sliced Design** - разделение по функциональным слоям
3. **Hooks-based State Management** - централизованное управление состоянием
4. **Type-First Development** - строгая типизация как основа архитектуры

### Оптимизации
- Lazy loading компонентов
- Code splitting по маршрутам
- Оптимизация изображений
- React.memo для тяжёлых компонентов
- Service Worker для кэширования

### Безопасность
- JWT аутентификация
- Валидация данных с Zod
- Защита от XSS и CSRF
- Шифрование паролей
- Rate limiting

### Доступность
- Соответствие WCAG 2.1 AA
- Клавиатурная навигация
- ARIA атрибуты
- Skip navigation link

## Контрибуции

Мы приветствуем контрибуции! Чтобы внести изменения:

1. Форкните репозиторий
2. Создайте feature-ветку (`git checkout -b feature/AmazingFeature`)
3. Сделайте изменения
4. Зафиксируйте изменения (`git commit -m 'Add some AmazingFeature'`)
5. Запушьте ветку (`git push origin feature/AmazingFeature`)
6. Откройте Pull Request

## Лицензия

Проект распространяется под лицензией MIT. Подробности см. в файле [LICENSE](LICENSE).

## Поддержка

Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами:

- Задайте вопрос в [Issues](https://github.com/Sskutushev/AIRBRO/issues)
- Напишите в Telegram: [@AIBROSupportBot](https://t.me/AIBROSupportBot)
- Отправьте email: hello@aibrobusiness.com

---

© 2025 AIBRO Business. Все права защищены.