# Документация API AIBRO Business

## Базовый URL

```
http://localhost:3000/api
```

## Аутентификация

Для доступа к защищенным маршрутам используйте заголовок `Authorization: Bearer {token}`.

## Общие заголовки

- `Content-Type: application/json` - для отправки данных в формате JSON
- `Authorization: Bearer {token}` - для аутентифицированных запросов

## Эндпоинты

### Аутентификация

#### `POST /api/auth/register`
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван Иванов",
  "telegram": "@username"
}
```

**Ответ (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "telegram": "@username",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

#### `POST /api/auth/login`
Вход пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "telegram": "@username"
  },
  "token": "jwt_token"
}
```

#### `GET /api/auth/me`
Получение данных текущего пользователя

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Иван Иванов",
  "telegram": "@username",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Продукты

#### `GET /api/products`
Получение списка продуктов

**Параметры запроса:**
- `tier` (опционально): уровень продукта (1, 2, 3)
- `isActive` (опционально): только активные продукты (true/false)

**Ответ (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "slug": "ai-postmaster-starter",
      "name": "AI PostMaster Starter",
      "description": "1 канал, 30 постов/месяц",
      "price": 300000,
      "interval": "month",
      "features": ["1 Telegram канал", "30 постов в месяц", ...],
      "tier": 1
    }
  ]
}
```

#### `GET /api/products/:slug`
Получение продукта по slug

**Ответ (200):**
```json
{
  "id": "uuid",
  "slug": "ai-postmaster-starter",
  "name": "AI PostMaster Starter",
  "description": "1 канал, 30 постов/месяц",
  "price": 300000,
  "interval": "month",
  "features": ["1 Telegram канал", "30 постов в месяц", ...],
  "tier": 1
}
```

### Корзина

#### `GET /api/cart`
Получение корзины текущего пользователя

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "AI PostMaster Starter",
        "price": 300000,
        "description": "1 канал, 30 постов/месяц"
      },
      "quantity": 1
    }
  ],
  "total": 300000
}
```

#### `POST /api/cart/add`
Добавление товара в корзину

**Заголовки:**
- `Authorization: Bearer {token}`

**Тело запроса:**
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

**Ответ (200):**
```json
{
  "cartItem": {
    "id": "uuid",
    "productId": "uuid",
    "quantity": 1
  }
}
```

#### `DELETE /api/cart/:itemId`
Удаление товара из корзины

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "message": "Товар удален из корзины"
}
```

#### `POST /api/cart/clear`
Очистка корзины

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "message": "Корзина очищена"
}
```

### Платежи

#### `POST /api/payments/crypto/create`
Создание криптоплатежа

**Заголовки:**
- `Authorization: Bearer {token}`

**Тело запроса:**
```json
{
  "cartItems": ["uuid1", "uuid2"],
  "paymentMethod": "crypto_usdt_trc20"
}
```

**Ответ (200):**
```json
{
  "paymentId": "uuid",
  "walletAddress": "address",
  "amountRub": 500000,
  "amountCrypto": 5500,
  "currency": "USDT",
  "qrCode": "data:image/png;base64,...",
  "expiresAt": "2025-01-01T00:30:00.000Z",
  "network": "TRC20",
  "warnings": ["⚠️ ВНИМАНИЕ: Криптовалютные платежи несут риски!"]
}
```

#### `GET /api/payments/:id/status`
Получение статуса платежа

**Ответ (200):**
```json
{
  "status": "pending",
  "txHash": null,
  "expiresAt": "2025-01-01T00:30:00.000Z",
  "timeLeft": 1800
}
```

#### `POST /api/payments/:id/confirm`
Подтверждение платежа (администратор)

**Тело запроса:**
```json
{
  "txHash": "transaction_hash"
}
```

**Ответ (200):**
```json
{
  "payment": {
    "id": "uuid",
    "status": "completed",
    "txHash": "transaction_hash"
  }
}
```

### Пользователь

#### `GET /api/user/profile`
Получение профиля пользователя

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Иван Иванов",
  "telegram": "@username",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### `PUT /api/user/profile`
Обновление профиля пользователя

**Заголовки:**
- `Authorization: Bearer {token}`

**Тело запроса:**
```json
{
  "name": "Иван Петров",
  "telegram": "@new_username"
}
```

**Ответ (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Петров",
    "telegram": "@new_username",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/user/subscriptions`
Получение подписок пользователя

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "subscriptions": [
    {
      "id": "uuid",
      "product": {
        "name": "AI PostMaster Starter",
        "description": "1 канал, 30 постов/месяц"
      },
      "status": "active",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-02-01T00:00:00.000Z",
      "nextPaymentDate": "2025-02-01T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/user/payments`
Получение истории платежей пользователя

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 300000,
      "currency": "RUB",
      "status": "completed",
      "paymentMethod": "crypto_usdt_trc20",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/user/subscriptions/:id/cancel`
Отмена подписки

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ (200):**
```json
{
  "subscription": {
    "id": "uuid",
    "status": "cancelled",
    "cancelledAt": "2025-01-15T00:00:00.000Z"
  }
}
```

### Telegram

#### `POST /api/telegram/send`
Отправка сообщения в Telegram (для формы обратной связи)

**Тело запроса:**
```json
{
  "name": "Иван Иванов",
  "email": "user@example.com",
  "telegram": "@username",
  "business": "Мой бизнес",
  "product": "AI PostMaster",
  "description": "Хочу автоматизировать..."
}
```

**Ответ (200):**
```json
{
  "success": true,
  "message": "Сообщение успешно отправлено в Telegram"
}
```