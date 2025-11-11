# 3. Backend and API

The AIRBRO Business backend is an API service based on Node.js and Express.js that serves as the central hub for all business logic of the application.

## Architecture

The backend is built using a classical service-controller architecture, which ensures good separation of concerns.

- **`routes`**: Define API endpoints and bind them to the appropriate controllers.
- **`controllers`**: Handle incoming HTTP requests. They are responsible for validating data (using `zod`), calling business logic from services, and sending responses to the client.
- **`services`**: Contain the main business logic. Services interact with the database via the Prisma Client and perform operations such as creating users, processing payments, or getting product lists.
- **`middleware`**: Middlewares that execute before the main controllers. They are used for authentication (JWT verification), logging, request limiting, data sanitization, HTTPS redirection, etc.
- **`utils`**: Utility functions used in different parts of the application (e.g., `logger` for logging).
- **`prisma`**: Contains the database schema (`schema.prisma`) and the generated Prisma Client.

## Main API Routes

All API routes start with the `/api` prefix.

### Authentication (`/api/auth`)

- `POST /register`: Register a new user.
- `POST /login`: Log in a user, returns JWT token in `httpOnly` cookie.
- `POST /logout`: Log out a user, clears cookie.
- `GET /me`: Get data of the currently authenticated user.

#### Examples

**Register a new user:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123",
    "name": "John Doe",
    "telegram": "@johndoe"
  }'
```

**Log in a user:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123"
  }'
```

**Get current user data:**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: token=your_jwt_token_here"
```

### Products (`/api/products`)

- `GET /`: Get a list of all active products.

#### Examples

**Get all active products:**

```bash
curl -X GET http://localhost:3000/api/products
```

### Cart (`/api/cart`)

- `GET /`: Get the content of the current user's cart.
- `POST /add`: Add a product to the cart.
- `POST /remove`: Remove a product from the cart.
- `POST /update`: Update the quantity of a product in the cart.

#### Examples

**Get user's cart:**

```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here"
```

**Add product to cart:**

```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

**Remove product from cart:**

```bash
curl -X POST http://localhost:3000/api/cart/remove \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "productId": "product_id_here"
  }'
```

**Update product quantity in cart:**

```bash
curl -X POST http://localhost:3000/api/cart/update \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "productId": "product_id_here",
    "quantity": 3
  }'
```

### Cart (`/api/cart`)

- `GET /`: Get the content of the current user's cart.
- `POST /add`: Add a product to the cart.
- `POST /remove`: Remove a product from the cart.
- `POST /update`: Update the quantity of a product in the cart.

#### Examples

**Get user's cart:**

```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Cookie: token=your_jwt_token_here"
```

**Add product to cart:**

```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

**Remove product from cart:**

```bash
curl -X POST http://localhost:3000/api/cart/remove \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "productId": "product_id_here"
  }'
```

### Payments (`/api/payments`)

- `POST /create-payment-intent`: Create a payment intent for card payments.
- `POST /create-telegram-payment`: Initiate a Telegram payment.
- `GET /status/:id`: Check the status of a specific payment.

#### Examples

**Create a payment intent for card payment:**

```bash
curl -X POST http://localhost:3000/api/payments/create-payment-intent \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "amount": 1000,
    "currency": "RUB"
  }'
```

**Initiate a Telegram payment:**

```bash
curl -X POST http://localhost:3000/api/payments/create-telegram-payment \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "amount": 1000
  }'
```

**Check payment status:**

```bash
curl -X GET http://localhost:3000/api/payments/status/payment_id_here \
  -H "Cookie: token=your_jwt_token_here"
```

### User (`/api/user`)

- `GET /subscriptions`: Get the list of subscriptions for the current user.
- `PUT /profile`: Update user profile.

#### Examples

**Get user subscriptions:**

```bash
curl -X GET http://localhost:3000/api/user/subscriptions \
  -H "Cookie: token=your_jwt_token_here"
```

**Update user profile:**

```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token_here" \
  -d '{
    "name": "Updated Name",
    "telegram": "@updatedtelegram"
  }'
```

## Authentication

Authentication is implemented using **JSON Web Tokens (JWT)**.

1.  Upon successful login (`/api/auth/login`), the server generates a JWT token.
2.  The token is stored in a secure `httpOnly` cookie, protecting it from access via JavaScript on the client side (XSS attacks).
3.  Upon every subsequent request to protected routes, the browser automatically sends the cookie with the token.
4.  A special middleware on the backend verifies the validity of the token, and if everything is in order, extracts the `userId` from it and adds it to the request object (`req.user`).

## Error Handling

The backend uses a centralized error handler.

- **Validation errors (400 Bad Request):** If the request data does not match the `zod` schema, the controller returns a 400 error with a detailed description of the fields that failed validation.
- **Authentication errors (401 Unauthorized):** Returned if the user tries to access a protected resource without a valid JWT token.
- **Authorization errors (403 Forbidden):** Returned if the user does not have the rights to perform a certain action.
- **"Not found" errors (404 Not Found):** Returned when accessing a non-existent resource.
- **Server errors (500 Internal Server Error):** If an unexpected error occurs, it is logged and a general error 500 is returned to the client.

---

**Next:** [04 - Database Schema](./04_Database_Schema.md)
