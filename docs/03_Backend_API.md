# 3. Backend and API

The AIRBRO Business backend is an API service based on Node.js and Express.js that serves as the central hub for all business logic of the application.

## Architecture

The backend is built using a classical service-controller architecture with Repository pattern, which ensures good separation of concerns.

- **`routes`**: Define API endpoints and bind them to the appropriate controllers.
- **`controllers`**: Handle incoming HTTP requests. They are responsible for validating data (using `zod`), calling business logic from services, and sending responses to the client.
- **`repositories`**: Repository layer for database operations providing abstraction between controllers and Prisma Client.
- **`services`**: Contain the main business logic. Services interact with the database via the Repository layer and perform operations such as creating users, processing payments, or getting product lists.
- **`middleware`**: Middlewares that execute before the main controllers. They are used for authentication (JWT verification), logging, request limiting, data sanitization, HTTPS redirection, etc.
- **`utils`**: Utility functions used in different parts of the application (e.g., `logger` for logging).
- **`prisma`**: Contains the database schema (`schema.prisma`) and the generated Prisma Client.

## Main API Routes

All API routes start with the `/api` prefix.

### Authentication (`/api/auth`)

- `POST /register`: Register a new user.
- `POST /login`: Log in a user, returns JWT token in response body.
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
  -H "Authorization: Bearer your_jwt_token_here"
```

### Products (`/api/products`)

- `GET /`: Get a list of all products with optional filtering by tier and active status.
- `GET /:slug`: Get a specific product by its slug.

#### Examples

**Get all active products:**

```bash
curl -X GET http://localhost:3000/api/products
```

**Get products filtered by tier:**

```bash
curl -X GET http://localhost:3000/api/products?tier=1
```

**Get product by slug:**

```bash
curl -X GET http://localhost:3000/api/products/product-slug
```

### Cart (`/api/cart`)

- `GET /`: Get the content of the current user's cart.
- `POST /add`: Add a product to the cart.
- `DELETE /:itemId`: Remove a specific cart item from the cart.
- `POST /clear`: Clear all items from the user's cart.

#### Examples

**Get user's cart:**

```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer your_jwt_token_here"
```

**Add product to cart:**

```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

**Remove product from cart:**

```bash
curl -X DELETE http://localhost:3000/api/cart/cart_item_id_here \
  -H "Authorization: Bearer your_jwt_token_here"
```

**Clear user's cart:**

```bash
curl -X POST http://localhost:3000/api/cart/clear \
  -H "Authorization: Bearer your_jwt_token_here"
```

### Payments (`/api/payments`)

- `POST /crypto/create`: Create a cryptocurrency payment.
- `GET /:id/status`: Check the status of a specific payment.
- `POST /:id/confirm`: Confirm a payment (for testing purposes).

#### Examples

**Create a cryptocurrency payment:**

```bash
curl -X POST http://localhost:3000/api/payments/crypto/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "cartItems": ["cart_item_id_here"],
    "paymentMethod": "crypto_usdt_trc20"
  }'
```

**Check payment status:**

```bash
curl -X GET http://localhost:3000/api/payments/payment_id_here/status \
  -H "Authorization: Bearer your_jwt_token_here"
```

### User (`/api/user`)

- `GET /profile`: Get the current user's profile information.
- `PUT /profile`: Update user profile.
- `GET /subscriptions`: Get the list of subscriptions for the current user.
- `GET /payments`: Get the list of payments for the current user.
- `POST /subscriptions/:id/cancel`: Cancel a user's subscription.

#### Examples

**Get user profile:**

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer your_jwt_token_here"
```

**Update user profile:**

```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "name": "Updated Name",
    "telegram": "@updatedtelegram"
  }'
```

**Get user subscriptions:**

```bash
curl -X GET http://localhost:3000/api/user/subscriptions \
  -H "Authorization: Bearer your_jwt_token_here"
```

**Get user payments:**

```bash
curl -X GET http://localhost:3000/api/user/payments \
  -H "Authorization: Bearer your_jwt_token_here"
```

**Cancel a subscription:**

```bash
curl -X POST http://localhost:3000/api/user/subscriptions/subscription_id_here/cancel \
  -H "Authorization: Bearer your_jwt_token_here"
```

## Authentication

Authentication is implemented using **JSON Web Tokens (JWT)**.

1.  Upon successful login (`/api/auth/login`), the server generates a JWT token.
2.  The token is returned in the response body instead of cookies for better compatibility with mobile clients and various frontend architectures.
3.  Upon every subsequent request to protected routes, the client must include the token in the `Authorization` header as `Bearer <token>`.
4.  A special middleware on the backend verifies the validity of the token, and if everything is in order, extracts the `userId` from it and adds it to the request object (`req.userId`).

## Security Features

- **Helmet.js**: Security middleware that sets various HTTP headers to protect against common web vulnerabilities.
- **Input Sanitization**: All user inputs are sanitized using the `xss` library to prevent cross-site scripting attacks.
- **Rate Limiting**: Implemented to prevent abuse of the API endpoints.
- **HTTPS Redirection**: All HTTP requests are redirected to HTTPS in production environments.

## Error Handling

The backend uses a centralized error handler.

- **Validation errors (400 Bad Request):** If the request data does not match the `zod` schema, the controller returns a 400 error with a detailed description of the fields that failed validation.
- **Authentication errors (401 Unauthorized):** Returned if the user tries to access a protected resource without a valid JWT token.
- **Authorization errors (403 Forbidden):** Returned if the user does not have the rights to perform a certain action.
- **"Not found" errors (404 Not Found):** Returned when accessing a non-existent resource.
- **Conflict errors (409 Conflict):** Returned when creating a resource that already exists (e.g. duplicate user registration).
- **Server errors (500 Internal Server Error):** If an unexpected error occurs, it is logged and a general error 500 is returned to the client.

---

**Next:** [04 - Database Schema](./04_Database_Schema.md)
