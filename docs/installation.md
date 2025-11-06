# Руководство по установке и запуску

## Требования

- Node.js 18+ 
- npm или yarn
- Git

## Установка

### 1. Клонирование репозитория

```bash
git clone <ваш_репозиторий>
cd AIRBRO
```

### 2. Установка зависимостей для фронтенда

```bash
npm install
```

### 3. Установка зависимостей для бэкенда

```bash
cd backend
npm install
```

## Настройка

### 1. Настройка бэкенда

В директории `backend` создайте файл `.env`:

```bash
cp .env.example .env
```

Отредактируйте файл `.env`, указав свои настройки:

```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="file:./dev.db" # SQLite для разработки

# JWT
JWT_SECRET=ваш_секретный_ключ_для_jwt

# Crypto Wallets
USDT_TRC20_WALLET=ваш_адрес_кошелька
USDT_ERC20_WALLET=ваш_адрес_кошелька
TON_WALLET=ваш_адрес_кошелька

# Exchange Rates
RUB_TO_USDT_RATE=0.011
RUB_TO_TON_RATE=0.17

# Telegram
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_ADMIN_CHANNEL=ваш_айди_канала
```

### 2. Настройка фронтенда

В корне проекта создайте файл `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Запуск

### 1. Запуск бэкенда

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Бэкенд будет доступен по адресу `http://localhost:3000`

### 2. Запуск фронтенда

В новом терминале:

```bash
npm run dev
```

Фронтенд будет доступен по адресу `http://localhost:5173`

## Продакшен-сборка

### Сборка фронтенда

```bash
npm run build
```

### Сборка бэкенда

```bash
cd backend
npm run build
npm start
```

## Запуск с Docker (опционально)

### Docker Compose файл

Создайте файл `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/aibro
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=aibro
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3000/api

volumes:
  postgres_data:
```

Запуск:

```bash
docker-compose up -d
```