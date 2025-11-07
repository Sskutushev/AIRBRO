# AIBRO Business - Архитектурная документация

## Обзор системы

AIBRO Business представляет собой современную веб-систему автоматизации бизнеса, полностью интегрированную в Telegram. Система построена по модульной архитектуре с разделением на frontend и backend части, каждая из которых имеет свои слои и компоненты.

## Модель домена

### Основные сущности

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
│ features: String[]          │
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
│ metadata: Json?             │
│ expiresAt: DateTime?        │
│ createdAt: DateTime         │
│ updatedAt: DateTime         │
└────────────────────────────┘
```

## Архитектура frontend

### Слои приложения

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Components    │ │    Sections     │ │    Pages        ││
│  │  (микрокомпоненты)│ │(секции страниц) │ │(маршруты)       ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                 Presentation Layer                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Contexts      │ │     Hooks       │ │   Forms         ││
│  │(состояния)      │ │(логика UI)      │ │(управление)     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                  Service Layer                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   API Client    │ │    i18n         │ │   Analytics     ││
│  │(запросы)        │ │(переводы)       │ │(отслеживание)    ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   Utils Layer                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Validation    │ │   Storage       │ │   DOM Utils     ││
│  │(схемы Zod)      │ │(localStorage)   │ │(доступ к DOM)   ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Ключевые технологии

#### React
- **React 19.1.1** - библиотека для создания пользовательских интерфейсов
- **Functional components** с использованием hooks
- **Context API** для глобального состояния
- **React.memo** для оптимизации рендеринга

#### TypeScript
- **Strict mode** для максимальной безопасности типов
- **Type definitions** для всех props и состояний
- **Generic types** для переиспользуемых компонентов
- **Utility types** для сложных манипуляций с типами

#### Framer Motion
- **Animations** для плавных переходов
- **Gestures** для touch взаимодействий
- **Layout animations** для динамических изменений
- **Spring physics** для реалистичных анимаций

#### React Query
- **Server state management** для данных с сервера
- **Caching** для оптимизации производительности
- **Background updates** для актуальных данных
- **Optimistic updates** для улучшенного UX

#### React Hook Form
- **Form state management** для управления формами
- **Validation** с Zod схемами
- **Performance optimization** через контролируемые компоненты
- **Accessibility** с правильными ARIA атрибутами

## Архитектура backend

### Слои приложения

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Controllers   │ │   Middleware    │ │   Routes        ││
│  │(бизнес-логика)  │ │(валидация, аут) │ │(маршруты)       ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                  Service Layer                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Services      │ │    Prisma       │ │   Utils         ││
│  │(сложная логика)  │ │(ORM)            │ │(вспомогательные) ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   Config Layer                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Database      │ │     JWT         │ │   Telegram      ││
│  │(настройка)      │ │(аутентификация)  │ │(интеграция)     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Ключевые технологии

#### Express.js
- **Middleware architecture** для обработки запросов
- **Routing system** для организации эндпоинтов
- **Error handling** для централизованной обработки ошибок
- **Security middlewares** для защиты от атак

#### Prisma ORM
- **Type-safe database access** через TypeScript
- **Automatic migrations** для безопасного изменения схемы
- **Relation queries** для сложных запросов
- **Transaction support** для безопасных операций

#### Security
- **Helmet** для HTTP заголовков безопасности
- **express-rate-limit** для защиты от DDoS
- **express-validator** для валидации данных
- **bcrypt** для шифрования паролей

#### JWT Authentication
- **JSON Web Tokens** для безопасной аутентификации
- **Token expiration** для безопасности
- **Refresh tokens** для длительных сессий
- **Middleware protection** для защищенных маршрутов

## Интеграции

### Telegram API
- **Node Telegram Bot API** для взаимодействия с ботом
- **Webhook handling** для получения обновлений
- **Message templates** для структурированных сообщений
- **Inline keyboards** для интерактивности

### Криптовалютные платежи
- **Dynamic QR codes** для оплаты
- **Blockchain monitoring** для подтверждения платежей
- **Multiple wallets** (USDT TRC20/ERC20, TON)
- **Payment statuses** с таймерами и уведомлениями

## Безопасность

### Frontend безопасность
- **XSS protection** через DOMPurify
- **Input sanitization** с Zod схемами
- **JWT validation** на клиенте
- **CSRF protection** через заголовки

### Backend безопасность
- **Rate limiting** для предотвращения атак
- **Input validation** через express-validator
- **Password hashing** через bcrypt
- **JWT security** с надежными секретами

## Масштабируемость

### Архитектура
- **Stateless API** для легкого масштабирования
- **Database indexing** для быстрых запросов
- **Caching layers** для снижения нагрузки

### Производительность
- **Optimized queries** через Prisma
- **Connection pooling** для эффективного использования ресурсов
- **Response caching** для часто запрашиваемых данных
- **Image optimization** для уменьшения размера загрузки

## Мониторинг и логирование

### Логирование
- **Application logs** через Winston
- **Error tracking** через Sentry
- **User actions** для анализа поведения
- **System health** для мониторинга статуса

### Аналитика
- **Google Analytics** для отслеживания пользователей
- **Event tracking** для анализа пользовательских сценариев
- **Payment success rates** для мониторинга конверсии
- **Performance monitoring** для выявления узких мест