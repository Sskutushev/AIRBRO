🎯 Промпт для улучшения проекта AIRBRO Business до 9.5/10

📋 ОБЩИЕ ИНСТРУКЦИИ
Контекст: Ты работаешь над улучшением full-stack проекта AIRBRO Business (React + Node.js/Express). Текущая оценка 8.3/10, цель - 9.5/10.
Правила работы:

Работай последовательно: сначала критичные улучшения, потом важные, потом полировка
Не ломай существующую функциональность
После каждого этапа обновляй файл PROGRESS_LOG.md в корне проекта
Тестируй каждое изменение перед переходом к следующему
Делай коммиты после каждого завершенного шага

Формат записи в PROGRESS_LOG.md:
markdown## [Дата] - [Название этапа]

### Что сделано:

- [Конкретное изменение]

### Зачем:

- [Причина изменения]

### Как работает сейчас:

- [Описание новой функциональности]

### Файлы изменены:

- [список файлов]

### Тесты:

- [как проверить]

```

---

## 🔴 НЕДЕЛЯ 1: КРИТИЧНЫЕ УЛУЧШЕНИЯ (7-8 дней)

---

### 📅 ДНИ 1-2: Рефакторинг кода - Английский язык

**Задача:** Убрать всю кириллицу из кода (комментарии, console.log, сообщения).

#### Шаг 1.1: Backend - комментарии и логи
```

Цель: Перевести все комментарии и console.log на английский

Где работать:

- backend/src/controllers/\*.ts
- backend/src/middleware/\*.ts
- backend/src/routes/\*.ts
- backend/src/config/\*.ts

Что делать:

1. Найти все комментарии на русском (// Комментарий)
2. Перевести на английский (// Comment)
3. Найти все console.log с кириллицей
4. Перевести сообщения на английский

Примеры:
❌ Было: // Проверяем пользователя
✅ Стало: // Check if user exists

❌ Было: console.log('Ошибка авторизации:', error);
✅ Стало: console.log('Authentication error:', error);

После завершения:

- Запустить: npm run typecheck в папке backend
- Обновить PROGRESS_LOG.md
- Коммит: "refactor(backend): translate comments to English"

```

#### Шаг 1.2: Backend - сообщения в ответах API
```

Цель: Убрать кириллицу из всех API responses

Где работать:

- backend/src/controllers/\*.ts (все res.json())

Что делать:

1. Найти все res.json({ message: 'Русский текст' })
2. Перевести на английский ИЛИ удалить (если используется на фронте через i18n)
3. Проверить, не сломались ли зависимости на фронте

Примеры:
❌ Было: res.status(200).json({ message: 'Товар удален из корзины' });
✅ Стало: res.status(200).json({ message: 'Item removed from cart' });

ИЛИ (если фронт использует i18n):
✅ Стало: res.status(200).json({ success: true });

Важно: Проверить фронтенд, нет ли прямого использования этих сообщений

После завершения:

- Запустить backend: npm run dev
- Протестировать API endpoints через Postman/curl
- Обновить PROGRESS_LOG.md
- Коммит: "refactor(backend): translate API responses to English"

```

#### Шаг 1.3: Frontend - комментарии
```

Цель: Перевести все комментарии на английский

Где работать:

- src/components/\*_/_.tsx
- src/pages/\*_/_.tsx
- src/hooks/\*_/_.ts
- src/lib/\*_/_.ts

Что делать:

1. Найти комментарии: // Комментарий на русском
2. Перевести на английский
3. Обновить JSDoc комментарии (если есть)

Примеры:
❌ Было: // Компонент для обработки авторизации
✅ Стало: // Component for handling authentication

После завершения:

- Запустить: npm run typecheck
- Обновить PROGRESS_LOG.md
- Коммит: "refactor(frontend): translate comments to English"

```

#### Шаг 1.4: Проверка кириллицы
```

Команда для поиска оставшейся кириллицы:
grep -r "[А-Яа-яЁё]" --include="_.ts" --include="_.tsx" src/ backend/src/

Исключения (где кириллица допустима):

- Файлы переводов: src/i18n/locales/\*_/_.json
- README.md
- PROGRESS_LOG.md

Финальная проверка:

- npm run typecheck (в обоих папках)
- npm run lint (в обоих папках)
- Запустить проект: npm run dev
- Протестировать основные флоу вручную

После завершения:

- Обновить PROGRESS_LOG.md (общий итог Дней 1-2)
- Коммит: "refactor: complete translation to English"

```

---

### 📅 ДЕНЬ 3: PostgreSQL миграция

**Задача:** Заменить SQLite на PostgreSQL для production-ready решения.

#### Шаг 3.1: Обновить Prisma schema
```

Цель: Изменить datasource на PostgreSQL

Где работать:

- backend/prisma/schema.prisma

Что делать:

1. Открыть schema.prisma
2. Изменить datasource db:

❌ Было:
datasource db {
provider = "sqlite"
url = env("DATABASE_URL")
}

✅ Стало:
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

3. Проверить модели на совместимость (обычно все работает)

После изменения:

- Сохранить файл
- НЕ запускать миграции пока

```

#### Шаг 3.2: Обновить environment.ts
```

Цель: Обновить валидацию DATABASE_URL

Где работать:

- backend/src/config/environment.ts

Что делать:

1. Найти строку с DATABASE_URL
2. Изменить default значение:

❌ Было:
DATABASE_URL: z.string().url().default('file:./prisma/dev.db'),

✅ Стало:
DATABASE_URL: z.string().url().default('postgresql://user:password@localhost:5432/airbro_dev'),

3. Добавить комментарий:
   // For development: postgresql://user:password@localhost:5432/airbro_dev
   // For production: Set in environment variables

После изменения:

- npm run typecheck

```

#### Шаг 3.3: Создать локальную PostgreSQL базу
```

Цель: Поднять PostgreSQL для локальной разработки

Вариант 1 (Docker - рекомендуется):
docker run --name airbro-postgres \
 -e POSTGRES_USER=airbro \
 -e POSTGRES_PASSWORD=airbro_dev \
 -e POSTGRES_DB=airbro_dev \
 -p 5432:5432 \
 -d postgres:15

Вариант 2 (Локальная установка):

- Установить PostgreSQL
- Создать базу: createdb airbro_dev

Создать .env в backend/:
DATABASE_URL="postgresql://airbro:airbro_dev@localhost:5432/airbro_dev"

Проверка подключения:
psql -U airbro -d airbro_dev -h localhost

```

#### Шаг 3.4: Применить миграции
```

Цель: Создать структуру БД в PostgreSQL

Команды:
cd backend
npx prisma migrate dev --name init_postgresql

Что произойдет:

- Создаст таблицы в PostgreSQL
- Сгенерирует Prisma Client
- Создаст файл миграции в prisma/migrations/

Проверка:
npx prisma studio

# Откроется UI для просмотра БД

После завершения:

- Запустить backend: npm run dev
- Протестировать регистрацию пользователя
- Протестировать создание продукта
- Обновить PROGRESS_LOG.md
- Коммит: "feat(db): migrate from SQLite to PostgreSQL"

```

#### Шаг 3.5: Обновить документацию
```

Цель: Обновить инструкции в README и docs

Где работать:

- README.md
- docs/02_Getting_Started.md
- backend/README.md

Что изменить:

1. Заменить инструкции по SQLite на PostgreSQL
2. Добавить Docker команду для быстрого старта
3. Обновить переменные окружения в примерах

После завершения:

- Обновить PROGRESS_LOG.md
- Коммит: "docs: update database setup for PostgreSQL"

```

---

### 📅 ДЕНЬ 4: Security (Helmet, sanitization)

**Задача:** Добавить защитные заголовки и санитизацию входных данных.

#### Шаг 4.1: Установить зависимости
```

Цель: Добавить необходимые пакеты

Команды:
cd backend
npm install helmet express-validator xss

После установки:

- npm run typecheck

```

#### Шаг 4.2: Добавить Helmet middleware
```

Цель: Настроить защитные HTTP заголовки

Где работать:

- backend/src/server.ts

Что делать:

1. Добавить импорт в начало файла:
   import helmet from 'helmet';

2. Добавить middleware ПОСЛЕ cors, ДО маршрутов:
   // Security middleware
   app.use(helmet({
   contentSecurityPolicy: {
   directives: {
   defaultSrc: ["'self'"],
   styleSrc: ["'self'", "'unsafe-inline'"],
   scriptSrc: ["'self'"],
   imgSrc: ["'self'", "data:", "https:"],
   },
   },
   hsts: {
   maxAge: 31536000, // 1 year
   includeSubDomains: true,
   preload: true,
   },
   }));

Проверка:

- Запустить: npm run dev
- Открыть DevTools → Network → проверить заголовки ответа
- Должны появиться: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security

После завершения:

- Обновить PROGRESS_LOG.md
- Коммит: "feat(security): add Helmet middleware for security headers"

```

#### Шаг 4.3: Создать sanitization middleware
```

Цель: Создать middleware для очистки входных данных

Где работать:

- backend/src/middleware/sanitizer.ts (создать новый файл)

Что делать:
Создать файл с содержимым:

import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

/\*\*

- Middleware to sanitize request body, query, and params
- Removes XSS attacks and dangerous HTML
  \*/
  export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body) {
  req.body = sanitizeObject(req.body);
  }

// Sanitize query params
if (req.query) {
req.query = sanitizeObject(req.query);
}

// Sanitize URL params
if (req.params) {
req.params = sanitizeObject(req.params);
}

next();
};

/\*\*

- Recursively sanitize an object
  \*/
  function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
  return xss(obj);
  }

if (Array.isArray(obj)) {
return obj.map(sanitizeObject);
}

if (obj !== null && typeof obj === 'object') {
const sanitized: any = {};
for (const key in obj) {
if (obj.hasOwnProperty(key)) {
sanitized[key] = sanitizeObject(obj[key]);
}
}
return sanitized;
}

return obj;
}

После создания:

- npm run typecheck

```

#### Шаг 4.4: Применить sanitization к маршрутам
```

Цель: Добавить sanitization во все POST/PUT маршруты

Где работать:

- backend/src/server.ts

Что делать:

1. Добавить импорт:
   import { sanitizeInput } from './middleware/sanitizer';

2. Добавить middleware ПОСЛЕ express.json(), ДО маршрутов:
   // Sanitize all inputs
   app.use(sanitizeInput);

Проверка:

- Протестировать с опасным вводом:
  curl -X POST http://localhost:3000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"email":"test@test.com","password":"pass","name":"<script>alert(\"XSS\")</script>"}'

Результат должен быть очищен: name: "&lt;script&gt;alert(\"XSS\")&lt;/script&gt;"

После завершения:

- Обновить PROGRESS_LOG.md
- Коммит: "feat(security): add input sanitization middleware"

```

#### Шаг 4.5: Добавить HTTPS redirect для production
```

Цель: Принудительно перенаправлять на HTTPS в production

Где работать:

- backend/src/middleware/httpsRedirect.ts (создать)

Что делать:
Создать файл:

import { Request, Response, NextFunction } from 'express';

/\*\*

- Middleware to redirect HTTP to HTTPS in production
  \*/
  export const httpsRedirect = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
  const forwardedProto = req.header('x-forwarded-proto');
  if (forwardedProto && forwardedProto !== 'https') {
  return res.redirect(301, `https://${req.header('host')}${req.url}`);
  }
  }

next();
};

Применить в server.ts:
import { httpsRedirect } from './middleware/httpsRedirect';

// HTTPS redirect (must be first middleware)
app.use(httpsRedirect);

После завершения:

- npm run typecheck
- Обновить PROGRESS_LOG.md
- Коммит: "feat(security): add HTTPS redirect for production"

```

#### Шаг 4.6: Обновить security scanning
```

Цель: Убедиться, что секреты не попадают в код

Где работать:

- .gitignore

Что добавить (если нет):

# Environment files

.env
.env.local
.env.production
.env.development

# Database

_.db
_.sqlite

После завершения:

- Проверить: git status (не должно быть .env файлов)
- Обновить PROGRESS_LOG.md (общий итог Дня 4)
- Коммит: "chore(security): update gitignore for sensitive files"

```

---

### 📅 ДНИ 5-7: Backend тесты

**Задача:** Написать тесты для всех backend controllers и services.

#### Шаг 5.1: Настроить тестовое окружение
```

Цель: Установить и настроить Vitest для backend

Команды:
cd backend
npm install -D vitest @vitest/ui supertest @types/supertest

Создать backend/vitest.config.ts:

import { defineConfig } from 'vitest/config';

export default defineConfig({
test: {
globals: true,
environment: 'node',
coverage: {
provider: 'v8',
reporter: ['text', 'json', 'html'],
exclude: ['node_modules/', 'dist/', '**/*.test.ts'],
},
},
});

Добавить в backend/package.json scripts:
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"

Проверка:
npm run test

# Должно запуститься (тестов пока нет)

После завершения:

- Коммит: "test(backend): setup Vitest environment"

```

#### Шаг 5.2: Настроить тестовую базу данных
```

Цель: Создать отдельную БД для тестов

Что делать:

1. Создать backend/.env.test:
   DATABASE_URL="postgresql://airbro:airbro_dev@localhost:5432/airbro_test"
   NODE_ENV="test"
   JWT_SECRET="test-secret-key-for-testing-only"

2. Создать тестовую БД:
   createdb airbro_test

3. Применить миграции:
   DATABASE_URL="postgresql://airbro:airbro_dev@localhost:5432/airbro_test" npx prisma migrate deploy

4. Создать backend/src/tests/setup.ts:

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function clearDatabase() {
// Clear all tables in correct order (respecting foreign keys)
await prisma.cartItem.deleteMany();
await prisma.payment.deleteMany();
await prisma.subscription.deleteMany();
await prisma.product.deleteMany();
await prisma.user.deleteMany();
}

export async function closeDatabase() {
await prisma.$disconnect();
}

После завершения:

- Коммит: "test(backend): setup test database"

```

#### Шаг 5.3: Тесты для authController
```

Цель: Покрыть тестами регистрацию, вход, получение профиля

Где работать:

- backend/src/controllers/authController.test.ts (создать)

Что делать:
Создать файл с тестами:

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import { clearDatabase, closeDatabase } from '../tests/setup';

describe('Auth Controller', () => {
beforeEach(async () => {
await clearDatabase();
});

afterAll(async () => {
await closeDatabase();
});

describe('POST /api/auth/register', () => {
it('should register a new user', async () => {
const response = await request(app)
.post('/api/auth/register')
.send({
email: 'test@example.com',
password: 'password123',
name: 'Test User',
telegram: '@testuser',
});

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 409 if user already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          telegram: '@testuser',
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password456',
          name: 'Another User',
          telegram: '@anotheruser',
        });

      expect(response.status).toBe(409);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
    });

});

describe('POST /api/auth/login', () => {
it('should login existing user', async () => {
// Register user first
await request(app)
.post('/api/auth/register')
.send({
email: 'test@example.com',
password: 'password123',
name: 'Test User',
telegram: '@testuser',
});

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

});

describe('GET /api/auth/me', () => {
it('should return user profile with valid token', async () => {
// Register and get token
const registerResponse = await request(app)
.post('/api/auth/register')
.send({
email: 'test@example.com',
password: 'password123',
name: 'Test User',
telegram: '@testuser',
});

      const token = registerResponse.body.token;

      // Get profile
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });

});
});

Запустить тесты:
npm run test

После завершения:

- Обновить PROGRESS_LOG.md
- Коммит: "test(backend): add authController tests"

```

#### Шаг 5.4: Тесты для других controllers
```

Цель: Покрыть тестами остальные контроллеры

Создать тесты по аналогии для:

1. productController.test.ts
   - GET /api/products
   - GET /api/products/:slug

2. cartController.test.ts
   - GET /api/cart (authenticated)
   - POST /api/cart/add (authenticated)
   - DELETE /api/cart/:itemId (authenticated)

3. paymentController.test.ts
   - POST /api/payments/crypto/create (authenticated)
   - GET /api/payments/:id/status

Структура каждого теста:
describe('[Controller Name]', () => {
beforeEach(async () => {
await clearDatabase();
// Создать тестовые данные если нужно
});

describe('[HTTP Method] [Route]', () => {
it('should [expected behavior]', async () => {
// Arrange
// Act
// Assert
});
});
});

После каждого файла:

- Запустить: npm run test
- Коммит: "test(backend): add [controller]Controller tests"

```

#### Шаг 5.5: Проверка coverage
```

Цель: Убедиться, что coverage > 70%

Команда:
npm run test:coverage

Анализ:

- Открыть: backend/coverage/index.html
- Проверить какие файлы недопокрыты
- Добавить недостающие тесты для критичных путей

Цель coverage:

- Controllers: > 80%
- Middleware: > 70%
- Utils: > 90%

После завершения:

- Обновить PROGRESS_LOG.md (общий итог Дней 5-7)
- Коммит: "test(backend): achieve 70%+ coverage"

```

---

## 🟡 НЕДЕЛЯ 2: ВАЖНЫЕ УЛУЧШЕНИЯ (5-7 дней)

---

### 📅 ДНИ 1-2: Repository layer

**Задача:** Создать Repository слой для абстракции работы с БД.

#### Шаг 6.1: Создать базовую структуру
```

Цель: Создать папку и базовый интерфейс

Команды:
mkdir -p backend/src/repositories

Создать backend/src/repositories/BaseRepository.ts:

import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
protected prisma: PrismaClient;

constructor(prisma: PrismaClient) {
this.prisma = prisma;
}
}

После создания:

- npm run typecheck

```

#### Шаг 6.2: Создать UserRepository
```

Цель: Вынести всю логику работы с User в отдельный класс

Где работать:

- backend/src/repositories/UserRepository.ts (создать)

Что делать:
Создать файл:

import { BaseRepository } from './BaseRepository';
import { User, Prisma } from '@prisma/client';

export class UserRepository extends BaseRepository {
/\*\*

- Find user by email
  \*/
  async findByEmail(email: string): Promise<User | null> {
  return this.prisma.user.findUnique({
  where: { email },
  });
  }

/\*\*

- Find user by ID
  \*/
  async findById(id: string): Promise<User | null> {
  return this.prisma.user.findUnique({
  where: { id },
  });
  }

/\*\*

- Create new user
  \*/
  async create(data: Prisma.UserCreateInput): Promise<User> {
  return this.prisma.user.create({
  data,
  });
  }

/\*\*

- Update user
  \*/
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
  return this.prisma.user.update({
  where: { id },
  data,
  });
  }

/\*\*

- Check if user exists by email or telegram
  \*/
  async existsByEmailOrTelegram(email: string, telegram: string): Promise<boolean> {
  const count = await this.prisma.user.count({
  where: {
  OR: [{ email }, { telegram }],
  },
  });
  return count > 0;
  }
  }

После создания:

- npm run typecheck

```

#### Шаг 6.3: Рефакторинг authController
```

Цель: Использовать UserRepository вместо прямого Prisma

Где работать:

- backend/src/controllers/authController.ts

Что делать:

1. Добавить импорты:
   import { UserRepository } from '../repositories/UserRepository';
   import prisma from '../config/database';

2. Создать instance в начале файла:
   const userRepository = new UserRepository(prisma);

3. Заменить прямые вызовы Prisma на repository:

❌ Было:
const existingUser = await prisma.user.findFirst({
where: { OR: [{ email }, { telegram }] },
});

✅ Стало:
const userExists = await userRepository.existsByEmailOrTelegram(email, telegram);

❌ Было:
const user = await prisma.user.create({
data: { email, passwordHash, name, telegram },
});

✅ Стало:
const user = await userRepository.create({
email,
passwordHash,
name,
telegram,
});

Аналогично для всех методов контроллера

После изменений:

- npm run typecheck
- npm run test (проверить что тесты проходят)
- Обновить PROGRESS_LOG.md
- Коммит: "refactor(backend): add UserRepository and update authController"

```

#### Шаг 6.4: Создать ProductRepository и CartRepository
```

Цель: Создать repositories для Product и Cart

По аналогии с UserRepository создать:

1. backend/src/repositories/ProductRepository.ts
   - findAll()
   - findBySlug()
   - findById()
   - findActiveProducts()

2. backend/src/repositories/CartRepository.ts
   - findByUserId()
   - addItem()
   - removeItem()
   - clearCart()
   - findItemByUserAndProduct()

3. Рефакторить соответствующие контроллеры:
   - productController.ts
   - cartController.ts

После каждого:

- npm run typecheck
- npm run test
- Коммит отдельно для каждого

После завершения:

- Обновить PROGRESS_LOG.md (общий итог Дней 1-2)
- Коммит: "refactor(backend): complete repository layer implementation"

```

---

### 📅 ДЕНЬ 3: Рефакторинг ModulePopup

**Задача:** Вынести данные из компонента в отдельные файлы.

#### Шаг 7.1: Создать структуру данных
```

Цель: Создать типы и файлы с данными

Команды:
mkdir -p src/data

Создать src/types/modules.ts:

export interface ModuleBenefit {
title: string;
description: string;
}

export interface ModuleData {
id: string;
keyBenefits: ModuleBenefit[];
howItWorks: string[];
useCases: string[];
}

export type ModulesDataMap = Record<string, ModuleData>;

После создания:

- npm run typecheck
  Шаг 7.2: Вынести данные в i18n
  Цель: Переместить moduleData в файлы переводов

Где работать:

- src/i18n/locales/en/modules.json
- src/i18n/locales/ru/modules.json
- src/data/modules.ts (экспорт ключей модулей)
- src/components/ModulePopup.tsx

Что делать:

1. Создать файлы переводов для модулей:
   src/i18n/locales/en/modules.json
   src/i18n/locales/ru/modules.json

2. Перенести весь хардкод текста:
   - keyBenefits
   - howItWorks
   - useCases

   В структуру вида:
   {
   "conversation-bot": {
   "keyBenefits": [
   { "title": "...", "description": "..." }
   ],
   "howItWorks": ["...", "..."],
   "useCases": ["...", "..."]
   }
   }

3. В src/data/modules.ts оставить только структуру ID:
   export const MODULE_IDS = ['conversation-bot', 'sales-automation', ...];

4. В компоненте ModulePopup:
   ❌ Удалить огромный объект moduleData
   ✅ Заменить на загрузку данных через useTranslation:

   const { t } = useTranslation('modules');
   const module = t(`${moduleId}`, { returnObjects: true });

5. Проверить, что ModulePopup рендерит данные корректно:
   - Заголовки
   - Списки преимуществ
   - Как работает
   - Кейсы

После завершения:

- npm run typecheck
- npm run lint
- Запустить проект и проверить отображение каждого модуля
- Обновить PROGRESS_LOG.md
- Коммит: "refactor(frontend): move ModulePopup data to i18n"

📅 ДНИ 4–6: E2E тесты (Playwright)
Шаг 8.1: Установка Playwright
Цель: Добавить E2E тестирование ключевых пользовательских сценариев

Команды:
cd frontend
npm install -D @playwright/test

Установить браузеры:
npx playwright install

Создать структуру:
mkdir -p tests/e2e

Проверка:
npx playwright test --help

После завершения:

- Коммит: "test(e2e): install Playwright"

Шаг 8.2: Настроить Playwright config
Где работать:

- playwright.config.ts (создать в корне фронтенда)

Что делать:
Создать файл:

import { defineConfig } from '@playwright/test';

export default defineConfig({
testDir: './tests/e2e',
timeout: 30_000,
use: {
baseURL: 'http://localhost:5173',
headless: true,
screenshot: 'only-on-failure',
video: 'retain-on-failure',
},
});

После завершения:

- Проверить запуск: npx playwright test
- Коммит: "test(e2e): add config"

Шаг 8.3: E2E тест: Авторизация
Цель: Проверить вход/регистрацию

Создать файл: tests/e2e/auth.spec.ts

Сценарии:

1. Регистрация нового пользователя
2. Вход в аккаунт
3. Проверка редиректа в личный кабинет
4. Проверка logout

После завершения:

- npx playwright test
- Обновить PROGRESS_LOG.md
- Коммит: "test(e2e): add auth E2E tests"

Шаг 8.4: E2E тест: Покупка
Цель: Полный путь покупки до страницы Payment

Создать: tests/e2e/checkout.spec.ts

Сценарии:

1. Открытие страницы продуктов
2. Добавление товара
3. Переход в корзину
4. Переход к оплате
5. Проверка корректности данных

После завершения:

- Проверить E2E
- Обновить PROGRESS_LOG.md
- Коммит: "test(e2e): add checkout tests"

📅 ДЕНЬ 7: Error Handling
Шаг 9.1: Централизованный обработчик ошибок (backend)
Где работать:

- backend/src/middleware/errorHandler.ts (создать)
- backend/src/server.ts

Что делать:

1. Создать middleware errorHandler:

export const errorHandler = (err, req, res, next) => {
console.error(err.stack);

res.status(err.statusCode || 500).json({
success: false,
message: err.message || 'Internal server error',
});
};

2. В server.ts:
   app.use(errorHandler);

После завершения:

- npm run dev
- Протестировать ошибки вручную
- Коммит: "feat(backend): add global error handler"

Шаг 9.2: Frontend — глобальный ловец ошибок
Где работать:

- src/context/ErrorContext.tsx (создать)
- src/components/ErrorBoundary.tsx (уже есть)

Что делать:

1. Создать ErrorContext:
   - store: currentError
   - function: showError(message)
   - function: clearError()

2. В App.tsx обернуть всё в ErrorProvider

3. Добавить глобальный Toast:
   Если currentError !== null → показывать ошибку через Modal/Toast

4. Заменить catch во всех API вызовах:
   ❌ console.log(error)
   ✅ showError("Something went wrong")

После завершения:

- npm run typecheck
- npm run dev
- Коммит: "feat(frontend): add global error handler"

🟢 НЕДЕЛЯ 3: ФИНАЛЬНАЯ ПОЛИРОВКА (2–3 дня)
📅 День 1: Code splitting
Цель: Разбить крупные бандлы для ускорения загрузки

Где работать:

- src/pages/\*_/_.tsx
- src/sections/\*_/_.tsx

Что делать:

1. Использовать dynamic import:
   const ModulePopup = lazy(() => import('./ModulePopup'));

2. Разделить тяжелые компоненты:
   - PricingSection
   - FAQSection
   - ModulePopup
   - Account pages

3. Добавить Suspense fallback в нужные места

После завершения:

- Lighthouse тест
- Обновить PROGRESS_LOG.md
- Коммит: "perf(frontend): add code splitting"

📅 День 2: Performance оптимизация
Цель: Довести UX до уровня 9.5/10

Что делать:

1. Добавить useMemo/useCallback там, где отсутствует
2. Убрать лишние ре-рендеры в списках
3. Оптимизировать изображения в public/
4. Добавить lazy loading в секции, которые ниже первого экрана
5. Проверить вес бандла → уменьшить при необходимости

После завершения:

- npm run build
- Проверить скорость загрузки
- Обновить PROGRESS_LOG.md
- Коммит: "perf: optimize performance and assets"

📅 День 3: Финальное тестирование
Цель: Завершить проект и довести до 9.5/10

Что делать:

1. Запустить:
   npm run lint
   npm run typecheck
   npm run test
   npx playwright test

2. Проверить все основные флоу руками:
   - Регистрация
   - Авторизация
   - Покупка
   - Оплата
   - Личный кабинет

3. Открыть DevTools Lighthouse:
   - Performance > 80
   - Accessibility > 90
   - Best Practices > 95
   - SEO > 95

4. Проверить адаптивность на мобильных

После завершения:

- Обновить PROGRESS_LOG.md (финальная запись)
- Коммит: "chore: final polish and release prep"

✅ ДОПОЛНИТЕЛЬНОЕ ТРЕБОВАНИЕ (как ты просил)

Добавь это в конец промпта:

📘 ОБЯЗАТЕЛЬНО: ВЕДЕНИЕ ФАЙЛА СЕССИИ
После КАЖДОГО выполненного этапа:

1. Открывать файл: PROGRESS_LOG.md
2. Добавлять блок:

## [Дата] — [Название этапа]

### Что сделано:

- ...

### Зачем:

- ...

### Как работает сейчас:

- ...

### Файлы изменены:

- ...

### Тесты:

- ...

3. Сохранять файл
4. Делать коммит с понятным названием
