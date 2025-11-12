# API Reference

Complete API documentation for AIRBRO Business backend.

**Base URL**: `https://your-backend.railway.app/api`  
**Development**: `http://localhost:3001/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

Obtain tokens via login or registration endpoints. Frontend stores token in `localStorage`.

---

## Endpoints

### Health Check

#### `GET /health`

Check if server is running.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-11-12T12:34:56.789Z",
  "uptime": 12345
}
```

---

## Authentication

### Register User

#### `POST /api/auth/register`

Create new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "telegram": "@johndoe"
}
```

**Validation**:
- `email`: Valid email format, unique
- `password`: Min 8 characters, includes uppercase, lowercase, number
- `name`: 2-50 characters
- `telegram`: Valid Telegram username (starts with @)

**Response** (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "telegram": "@johndoe",
    "createdAt": "2024-11-12T12:34:56.789Z"
  }
}
```

**Errors**:
- `400`: Validation failed
- `409`: Email or Telegram already exists

---

### Login

#### `POST /api/auth/login`

Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "telegram": "@johndoe"
  }
}
```

**Errors**:
- `400`: Missing email or password
- `401`: Invalid credentials

---

### Telegram Login

#### `POST /api/auth/telegram`

Authenticate via Telegram widget.

**Request Body**:
```json
{
  "id": "123456789",
  "first_name": "John",
  "username": "johndoe",
  "photo_url": "https://...",
  "auth_date": "1699999999",
  "hash": "calculated_hash"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": null,
    "name": "John",
    "telegram": "@johndoe",
    "telegramId": "123456789"
  }
}
```

**Errors**:
- `400`: Invalid Telegram data
- `401`: Hash validation failed

---

### Get Current User

#### `GET /api/auth/me`

Get authenticated user's profile.

**Auth**: Required

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "telegram": "@johndoe",
  "createdAt": "2024-11-12T12:34:56.789Z"
}
```

**Errors**:
- `401`: Invalid or expired token

---

## Products

### List Products

#### `GET /api/products`

Get all active subscription products.

**Query Parameters**:
- `tier` (optional): Filter by tier (1, 2, or 3)
- `interval` (optional): Filter by interval (`month` or `year`)

**Response** (200):
```json
[
  {
    "id": "uuid",
    "slug": "pro-monthly",
    "name": "Pro Plan",
    "description": "Perfect for small teams",
    "price": 990000,
    "interval": "month",
    "tier": 2,
    "features": [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ],
    "isActive": true
  }
]
```

**Price**: In kopecks (990000 = 9900.00 RUB)

---

### Get Product

#### `GET /api/products/:slug`

Get single product by slug.

**Response** (200):
```json
{
  "id": "uuid",
  "slug": "pro-monthly",
  "name": "Pro Plan",
  "description": "Perfect for small teams",
  "price": 990000,
  "interval": "month",
  "tier": 2,
  "features": ["..."],
  "isActive": true
}
```

**Errors**:
- `404`: Product not found

---

## Cart

### Get Cart

#### `GET /api/cart`

Get current user's cart items.

**Auth**: Required

**Response** (200):
```json
{
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 1,
      "product": {
        "slug": "pro-monthly",
        "name": "Pro Plan",
        "price": 990000,
        "interval": "month"
      }
    }
  ],
  "total": 990000
}
```

---

### Add to Cart

#### `POST /api/cart/add`

Add product to cart.

**Auth**: Required

**Request Body**:
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "productId": "uuid",
  "quantity": 1,
  "createdAt": "2024-11-12T12:34:56.789Z"
}
```

**Errors**:
- `400`: Invalid productId or quantity
- `404`: Product not found
- `409`: Product already in cart (use update instead)

---

### Update Cart Item

#### `PATCH /api/cart/:itemId`

Update cart item quantity.

**Auth**: Required

**Request Body**:
```json
{
  "quantity": 2
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "quantity": 2,
  "updatedAt": "2024-11-12T12:34:56.789Z"
}
```

---

### Remove from Cart

#### `DELETE /api/cart/remove/:productId`

Remove product from cart.

**Auth**: Required

**Response** (204): No content

**Errors**:
- `404`: Product not in cart

---

### Clear Cart

#### `DELETE /api/cart/clear`

Remove all items from cart.

**Auth**: Required

**Response** (204): No content

---

## Payments

### Create Payment

#### `POST /api/payments/create`

Initiate payment for cart items.

**Auth**: Required

**Request Body**:
```json
{
  "paymentMethod": "crypto_usdt_trc20",
  "currency": "USDT"
}
```

**Payment Methods**:
- `crypto_usdt_trc20`: USDT on Tron network
- `crypto_usdt_erc20`: USDT on Ethereum network
- `crypto_ton`: TON cryptocurrency

**Response** (201):
```json
{
  "id": "uuid",
  "amount": 990000,
  "currency": "USDT",
  "status": "pending",
  "paymentMethod": "crypto_usdt_trc20",
  "walletAddress": "TXxx...xxxx",
  "qrCode": "data:image/png;base64,...",
  "expiresAt": "2024-11-12T13:34:56.789Z",
  "createdAt": "2024-11-12T12:34:56.789Z"
}
```

**QR Code**: Base64-encoded PNG image for wallet address.

**Errors**:
- `400`: Invalid payment method or empty cart
- `401`: Unauthorized

---

### Get Payment Status

#### `GET /api/payments/:id/status`

Check payment status.

**Auth**: Required

**Response** (200):
```json
{
  "id": "uuid",
  "status": "completed",
  "txHash": "0xabc123...",
  "confirmedAt": "2024-11-12T12:45:00.789Z"
}
```

**Statuses**:
- `pending`: Awaiting payment
- `completed`: Payment confirmed
- `failed`: Payment failed
- `expired`: Payment window expired

---

### List User Payments

#### `GET /api/payments`

Get user's payment history.

**Auth**: Required

**Query Parameters**:
- `status` (optional): Filter by status
- `limit` (optional): Max results (default: 20)
- `offset` (optional): Pagination offset

**Response** (200):
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 990000,
      "currency": "USDT",
      "status": "completed",
      "paymentMethod": "crypto_usdt_trc20",
      "createdAt": "2024-11-12T12:34:56.789Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

---

## Subscriptions

### List User Subscriptions

#### `GET /api/subscriptions`

Get user's active subscriptions.

**Auth**: Required

**Response** (200):
```json
[
  {
    "id": "uuid",
    "status": "active",
    "startDate": "2024-11-12T12:34:56.789Z",
    "endDate": "2024-12-12T12:34:56.789Z",
    "nextPaymentDate": "2024-12-12T12:34:56.789Z",
    "product": {
      "slug": "pro-monthly",
      "name": "Pro Plan",
      "price": 990000,
      "interval": "month"
    }
  }
]
```

**Statuses**:
- `active`: Currently active
- `cancelled`: User cancelled, valid until endDate
- `expired`: Past endDate
- `trial`: Trial period

---

### Cancel Subscription

#### `POST /api/subscriptions/cancel/:id`

Cancel subscription (remains active until period ends).

**Auth**: Required

**Response** (200):
```json
{
  "id": "uuid",
  "status": "cancelled",
  "endDate": "2024-12-12T12:34:56.789Z",
  "cancelledAt": "2024-11-12T12:34:56.789Z"
}
```

**Errors**:
- `404`: Subscription not found
- `403`: Not your subscription
- `400`: Already cancelled

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable message",
  "details": [...]  // Optional, for validation errors
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `204`: No content (successful deletion)
- `400`: Bad request (validation failed)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `409`: Conflict (duplicate resource)
- `429`: Too many requests (rate limited)
- `500`: Internal server error

---

## Rate Limiting

**Default Limits**:
- **Anonymous**: 20 requests/15 minutes
- **Authenticated**: 100 requests/15 minutes
- **Payment endpoints**: 10 requests/15 minutes

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699999999
```

**429 Response**:
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in 14 minutes.",
  "retryAfter": 840
}
```

---

## Webhooks (Future)

Planned webhook support for payment confirmations:

```
POST https://your-frontend.com/api/webhooks/payment
{
  "event": "payment.completed",
  "paymentId": "uuid",
  "userId": "uuid",
  "amount": 990000,
  "txHash": "0xabc123..."
}
```

---

## Testing

Use these test accounts in development:

**Email**: `test@airbro.com`  
**Password**: `Test123!`

**Test Telegram**:
- Username: `@airbro_test`
- ID: `999999999`

---

## Client Libraries

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.airbro.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: Login
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'SecurePass123!',
});

localStorage.setItem('token', data.token);
```

### cURL Examples

**Register**:
```bash
curl -X POST https://api.airbro.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "telegram": "@johndoe"
  }'
```

**Get Products**:
```bash
curl https://api.airbro.com/api/products
```

**Get Cart** (authenticated):
```bash
curl https://api.airbro.com/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Auth, products, cart, payments, subscriptions
- Rate limiting
- Telegram authentication

### Planned (v1.1.0)
- Webhook support
- Payment webhooks for auto-confirmation
- Subscription auto-renewal
- Invoice generation API

---

For questions or issues, open an issue on [GitHub](https://github.com/Sskutushev/AIRBRO-Business/issues).
