# API Документация AIBRO Business

## Оглавление

1. [Общая информация](#общая-информация)
2. [Аутентификация](#аутентификация)
3. [Эндпоинты](#эндпоинты)
4. [Примеры использования](#примеры-использования)

## Общая информация

### Базовый URL
```
http://localhost:3000/api
```
или
```
https://your-domain.com/api
```

### Формат запросов и ответов
- Все запросы и ответы в формате JSON
- Заголовки: `Content-Type: application/json`
- Кодировки: UTF-8

## Аутентификация

### JWT токены
- Для доступа к защищенным маршрутам используйте заголовок:
  ```
  Authorization: Bearer {token}
  ```

### Регистрация пользователя
```
POST /api/auth/register
```

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
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

### Вход пользователя
```
POST /api/auth/login
```

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
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

### Получение данных пользователя
```
GET /api/auth/me
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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

## Эндпоинты

### Продукты

#### Получение всех продуктов
```
GET /api/products
```

**Параметры запроса:**
- `tier` (опционально): Уровень продукта (1, 2, 3)
- `isActive` (опционально): Только активные продукты (true/false)

**Ответ (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "slug": "ai-postmaster-starter",
      "name": "AI PostMaster Starter",
      "description": "1 канал, 30 постов/мес",
      "price": 300000,
      "interval": "month",
      "features": [
        "1 Telegram канал",
        "30 постов в месяц",
        "Базовая персонализация",
        "Email поддержка"
      ],
      "tier": 1
    }
  ]
}
```

#### Получение продукта по слагу
```
GET /api/products/:slug
```

**Ответ (200):**
```json
{
  "id": "uuid",
  "slug": "ai-postmaster-starter",
  "name": "AI PostMaster Starter",
  "description": "1 канал, 30 постов/мес",
  "price": 300000,
  "interval": "month",
  "features": [
    "1 Telegram канал",
    "30 постов в месяц",
    "Базовая персонализация",
    "Email поддержка"
  ],
  "tier": 1
}
```

### Корзина

#### Получение корзины пользователя
```
GET /api/cart
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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
        "description": "1 канал, 30 постов/мес"
      },
      "quantity": 1
    }
  ],
  "total": 300000
}
```

#### Добавление товара в корзину
```
POST /api/cart/add
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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

#### Удаление товара из корзины
```
DELETE /api/cart/:itemId
```

**Заголовки:**
```
Authorization: Bearer {token}
```

**Ответ (200):**
```json
{
  "message": "Товар удален из корзины"
}
```

#### Очистка корзины
```
POST /api/cart/clear
```

**Заголовки:**
```
Authorization: Bearer {token}
```

**Ответ (200):**
```json
{
  "message": "Корзина очищена"
}
```

### Платежи

#### Создание криптоплатежа
```
POST /api/payments/crypto/create
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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
  "walletAddress": "адрес_кошелька",
  "amountRub": 500000,
  "amountCrypto": 5500,
  "currency": "USDT",
  "qrCode": "data:image/png;base64,...",
  "expiresAt": "2025-01-01T00:30:00.000Z",
  "network": "TRC20",
  "warnings": [
    "⚠️ ВНИМАНИЕ: Криптовалютные платежи несут риски!",
    "✓ Отправляйте ТОЛЬКО USDT в сети TRC20",
    "✓ Тщательно проверьте адрес кошелька",
    "✓ Отправка на неправильный адрес приведет к потере средств",
    "✓ Платеж действителен 30 минут"
  ]
}
```

#### Получение статуса платежа
```
GET /api/payments/:id/status
```

**Ответ (200):**
```json
{
  "status": "pending",
  "txHash": null,
  "expiresAt": "2025-01-01T00:30:00.000Z",
  "timeLeft": 1800
}
```

#### Подтверждение платежа
```
POST /api/payments/:id/confirm
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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
  },
  "subscriptions": [
    {
      "id": "uuid",
      "productId": "uuid",
      "status": "active"
    }
  ]
}
```

### Пользователь

#### Получение профиля пользователя
```
GET /api/user/profile
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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

#### Обновление профиля пользователя
```
PUT /api/user/profile
```

**Заголовки:**
```
Authorization: Bearer {token}
```

**Тело запроса:**
```json
{
  "name": "Иван Петров",
  "telegram": "@newusername"
}
```

**Ответ (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Петров",
    "telegram": "@newusername",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Получение подписок пользователя
```
GET /api/user/subscriptions
```

**Заголовки:**
```
Authorization: Bearer {token}
```

**Ответ (200):**
```json
{
  "subscriptions": [
    {
      "id": "uuid",
      "product": {
        "name": "AI PostMaster Starter",
        "description": "1 канал, 30 постов/мес"
      },
      "status": "active",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-02-01T00:00:00.000Z",
      "nextPaymentDate": "2025-02-01T00:00:00.000Z"
    }
  ]
}
```

#### Получение истории платежей пользователя
```
GET /api/user/payments
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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

#### Отмена подписки
```
POST /api/user/subscriptions/:id/cancel
```

**Заголовки:**
```
Authorization: Bearer {token}
```

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

#### Отправка сообщения через форму
```
POST /api/telegram/send
```

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

## Примеры использования

### Авторизация пользователя
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.user;
  } else {
    throw new Error('Unauthorized');
  }
};
```

### Добавление в корзину
```javascript
const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productId,
      quantity
    })
  });
  
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to add item to cart');
  }
};
```

### Создание криптоплатежа
```javascript
const createCryptoPayment = async (cartItems, paymentMethod) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/payments/crypto/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cartItems,
      paymentMethod
    })
  });
  
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to create payment');
  }
};
```