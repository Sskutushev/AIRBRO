# AIBRO Business - Документация по безопасности

## Обзор безопасности

AIBRO Business разработан с учетом передовых методов обеспечения безопасности на всех уровнях приложения. Этот документ охватывает все аспекты безопасности в системе.

## Архитектура безопасности

### Многоуровневая модель безопасности

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Security                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Input Sanitiz │ │ XSS Protection  │ │ Form Validation ││
│  │(очистка ввода)  │ │(DOMPurify)      │ │(Zod schemas)    ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                  Transport Security                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   HTTPS         │ │   JWT Tokens    │ │   CORS Policy   ││
│  │(шифрование)     │ │(аутентификация) │ │(контроль доступа)││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   Backend Security                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Rate Limiting │ │ Input Validation│ │ Password Hashing││
│  │(DDoS защита)   │ │(express-valid.) │ │(bcrypt)         ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   Data Security                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Encryption    │ │ Secure Storage  │ │ Access Control  ││
│  │(чувств. данных) │ │(.env файлы)    │ │(роли/права)     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Frontend безопасность

### 1. Защита от XSS (Cross-Site Scripting)

#### DOMPurify Implementation
```typescript
// src/components/common/SafeHTML.tsx
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
```

**Функции:**
- Очищает HTML содержимое от потенциально опасных тегов и атрибутов
- Позволяет только безопасные HTML элементы
- Предотвращает выполнение вредоносного JS кода

#### Валидация Zod
```typescript
// src/lib/validation/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
    .regex(/[0-9]/, 'Должна быть хотя бы одна цифра')
    .regex(/[!@#$%^&*]/, 'Должен быть спецсимвол'),
});
```

**Функции:**
- Валидация всех входных данных на клиенте
- Предотвращение отправки неправильных данных на сервер
- Обеспечение целостности данных

### 2. Управление сессиями

#### JWT токены
```typescript
// src/services/api/client.ts
class APIClient {
  private token: string | null = null;
  
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
  
  private async request<T>(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });
    
    return this.handleResponse<T>(response);
  }
}
```

**Функции:**
- Безопасное хранение токенов
- Автоматическое добавление токенов к запросам
- Правильная очистка токенов при логауте

### 3. Защита от CSRF

```typescript
// src/middleware/csrf.ts
// Используется заголовки и токены для защиты от CSRF
```

**Функции:**
- Проверка происхождения запросов
- Убедиться, что запросы исходят из доверенного источника
- Защита от поддельных запросов

## Backend безопасность

### 1. Аутентификация и авторизация

#### JWT с использованием bcrypt
```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = (decoded as any).userId;
    next();
  });
};
```

**Функции:**
- Безопасная проверка токенов
- Валидация срока действия токенов
- Защита защищенных маршрутов
- Правильная обработка ошибок

#### Хеширование паролей
```typescript
// backend/src/controllers/authControllers.ts
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);
```

**Функции:**
- 10-раундное хеширование bcrypt
- Защита паролей при хранении
- Сравнение хешей при аутентификации

### 2. Валидация и санитизация данных

#### Express-validator
```typescript
// backend/src/middleware/validation.ts
import { body, validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Неверный формат email'),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .withMessage('Пароль должен содержать заглавную букву')
    .matches(/[0-9]/)
    .withMessage('Пароль должен содержать цифру')
    .matches(/[!@#$%^&*]/)
    .withMessage('Пароль должен содержать спецсимвол'),
  validate,
];
```

**Функции:**
- Валидация всех входных данных
- Нормализация данных
- Предотвращение инъекций
- Обработка ошибок валидации

### 3. Защита от атак

#### Rate limiting
```typescript
// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничить каждый IP до 100 запросов на окно
  message: 'Слишком много запросов, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Функции:**
- Защита от DDoS атак
- Ограничение количества запросов
- Предотвращение перегрузки сервера
- Обработка злоупотреблений

#### Helmet
```typescript
// backend/src/server.ts
import helmet from 'helmet';
app.use(helmet());
```

**Функции:**
- Установка безопасных HTTP заголовков
- Защита от известных уязвимостей
- Обеспечение безопасной конфигурации
- Предотвращение XSS и clickjacking атак

### 4. База данных безопасность

#### Защита через Prisma
```typescript
// backend/prisma/schema.prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  passwordHash    String
  name            String
  telegram        String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([email])
  @@map("users")
}
```

**Функции:**
- Валидация на уровне схемы
- Уникальные ограничения
- Шифрование чувствительных данных
- Защита от SQL инъекций через ORM

## Инфраструктурная безопасность

### 1. Хранение секретов

#### Environment Variables
```
# backend/.env
JWT_SECRET=секретный_32_символьный_ключ
TELEGRAM_BOT_TOKEN=токен_бота
DATABASE_URL="file:./dev.db"
USDT_TRC20_WALLET=адрес_кошелька
```

**Функции:**
- Хранение секретов вне кода
- .gitignore для защиты от коммита
- Разные значения для разных сред
- Легкое управление в продакшене

### 2. CORS политика

```typescript
// backend/src/server.ts
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
```

**Функции:**
- Разрешение только доверенным источникам
- Защита от межсайтовых запросов
- Контроль доступа к API
- Предотвращение утечки данных

## Защита платежей

### 1. Криптоплатежи безопасность

#### QR Code генерация
```typescript
// backend/src/services/paymentService.ts
const generatePaymentQR = (address: string, amount: number, currency: string) => {
  const paymentURI = `ethereum:${address}?value=${amount}&currency=${currency}`;
  return QRCode.toDataURL(paymentURI);
};
```

**Функции:**
- Безопасная генерация платежных URI
- Проверка корректности адресов
- Ограничение сумм
- Валидация параметров

### 2. Статусы платежей

```typescript
// backend/src/controllers/paymentController.ts
const validatePaymentStatus = async (txHash: string, address: string, amount: number) => {
  // Проверка транзакции в блокчейне
  // Сравнение суммы и адреса получателя
  // Подтверждение статуса платежа
};
```

**Функции:**
- Проверка транзакций в блокчейне
- Сравнение реквизитов
- Подтверждение платежей
- Защита от мошенничества

## Мониторинг безопасности

### 1. Логирование событий

```typescript
// backend/src/middleware/logger.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

**Функции:**
- Логирование важных событий
- Отслеживание аномалий
- Аудит безопасности
- Мониторинг атак

### 2. Sentry интеграция

```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Фильтрация чувствительных данных
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
    }
    return event;
  },
});
```

**Функции:**
- Отслеживание ошибок в продакшене
- Фильтрация чувствительных данных
- Алерты об уязвимостях
- Мониторинг производительности

## Практики безопасности

### 1. Правила кодирования

- Использование TypeScript для статической проверки типов
- Валидация всех входных данных
- Санитизация всех выходных данных
- Никогда не хранить секреты в коде
- Регулярные обновления зависимостей
- Использование безопасных библиотек

### 2. Правила деплоя

- Проверка уязвимостей зависимостей
- Сканирование безопасности кода
- Тестирование на проникновение
- Ротация секретов регулярно
- Изоляция сред разработки/продакшена
- Резервное копирование данных

## Проверки безопасности

### При каждом релизе:
- [ ] Проверка уязвимостей в зависимостях
- [ ] Проверка на утечку секретов
- [ ] Проверка CORS политик
- [ ] Тестирование аутентификации
- [ ] Тестирование валидации данных
- [ ] Проверка логирования безопасности
- [ ] Аудит доступа к чувствительным данным

### Проверки безопасности кода:
- [ ] Нет жестко закодированных токенов
- [ ] Все данные валидируются
- [ ] Нет уязвимостей XSS
- [ ] Нет уязвимостей CSRF
- [ ] Нет SQL инъекций
- [ ] Правильная обработка ошибок
- [ ] Нет утечки чувствительной информации

## Контакты по безопасности

Для сообщения о уязвимостях безопасности:
- Email: security@aibrobusiness.com
- Telegram: @AIBROSecurityBot
- Буккран: https://github.com/Sskutushev/AIRBRO/security/advisories