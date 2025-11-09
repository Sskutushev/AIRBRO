# 3. Backend API Reference

This document provides a reference for the RESTful API exposed by the AIRBRO Business backend.

**Base URL:** `http://localhost:3000/api`

## General Information

- **Authentication:** Most endpoints require a valid JWT (JSON Web Token) in the `Authorization` header (`Bearer <token>`).
- **CSRF Protection:** All state-changing requests (`POST`, `PUT`, `DELETE`) require a valid CSRF token in the `X-CSRF-Token` header. This token can be obtained from the `/api/csrf-token` endpoint.
- **Error Handling:**
  - `400 Bad Request`: Typically for validation failures (e.g., invalid input format).
  - `401 Unauthorized`: If the authentication token is missing or invalid.
  - `403 Forbidden`: If the user does not have permission to access the resource, or if the CSRF token is missing/invalid.
  - `404 Not Found`: If the requested resource does not exist.
  - `409 Conflict`: If there's a conflict with the current state of the resource (e.g., user already exists).
  - `500 Internal Server Error`: For unexpected server-side errors.

## Authentication (`/auth`)

Handles user registration, login, and session management.

---

### `POST /auth/register`

Registers a new user.

- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password",
    "name": "User Name",
    "telegram": "@username",
    "confirmPassword": "your_password",
    "agreement": true
  }
  ```
- **Success Response (201 Created):**
  - **Body:** `{ "user": { "id", "email", "name", "telegram", "createdAt" }, "token": "jwt_token" }`
- **Error Responses:**
  - `409 Conflict`: If a user with the same email or Telegram username already exists.
  - `400 Bad Request`: If validation fails (e.g., invalid email, short password, passwords do not match, agreement not checked).
  - `500 Internal Server Error`: For general server errors.

---

### `POST /auth/login`

Logs in an existing user.

- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Success Response (200 OK):**
  - **Body:** `{ "user": { "id", "email", "name", "telegram" }, "token": "jwt_token" }`
- **Error Responses:**
  - `401 Unauthorized`: If credentials are invalid.
  - `400 Bad Request`: If validation fails.
  - `500 Internal Server Error`: For general server errors.

---

### `GET /auth/me`

Retrieves the profile of the currently authenticated user.

- **Method:** `GET`
- **Authentication:** Required (JWT).
- **Success Response (200 OK):**
  - **Body:** `{ "id", "email", "name", "telegram", "createdAt" }`
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `404 Not Found`: If the user associated with the token cannot be found.

---

### `GET /csrf-token`

Retrieves a CSRF token. This token must be included in the `X-CSRF-Token` header for all state-changing requests (`POST`, `PUT`, `DELETE`).

- **Method:** `GET`
- **Success Response (200 OK):**
  - **Body:** `{ "csrfToken": "your_csrf_token" }`
- **Error Responses:**
  - `500 Internal Server Error`: For general server errors.

## Products (`/products`)

Handles fetching product information.

---

### `GET /products`

Retrieves a list of all available products.

- **Method:** `GET`
- **Query Parameters (Optional):**
  - `tier`: Filter products by tier number.
  - `isActive`: Filter products by active status (`true` or `false`).
- **Success Response (200 OK):**
  - **Body:** `[ { "id", "slug", "name", "description", "price", "interval", "features", "tier", "isActive", "createdAt", "updatedAt" }, ... ]`

---

### `GET /products/:slug`

Retrieves a single product by its unique slug.

- **Method:** `GET`
- **URL Parameter:** `slug` (e.g., `/products/pro-tier`)
- **Success Response (200 OK):**
  - **Body:** `{ "id", "slug", "name", "description", "price", "interval", "features", "tier", "isActive", "createdAt", "updatedAt" }`
- **Error Responses:**
  - `404 Not Found`: If no product with the given slug exists.

## Cart (`/cart`)

Manages the user's shopping cart. All routes require authentication.

---

### `GET /cart`

Retrieves the contents of the user's cart.

- **Method:** `GET`
- **Authentication:** Required (JWT).
- **Success Response (200 OK):**
  - **Body:** `[ { "id", "quantity", "product": { "id", "slug", "name", "price", ... } }, ... ]`

---

### `POST /cart`

Adds a product to the cart or updates its quantity.

- **Method:** `POST`
- **Authentication:** Required (JWT).
- **Body (JSON):**
  ```json
  {
    "productId": "product_id_string",
    "quantity": 1
  }
  ```
- **Success Response (200 OK):**
  - **Body:** The updated cart item object.
- **Error Responses:**
  - `400 Bad Request`: If `productId` is missing or `quantity` is invalid.
  - `404 Not Found`: If the product does not exist.

---

### `DELETE /cart/:productId`

Removes a product from the cart.

- **Method:** `DELETE`
- **Authentication:** Required (JWT).
- **URL Parameter:** `productId`
- **Success Response (204 No Content):** No content.
- **Error Responses:**
  - `404 Not Found`: If the product is not in the cart.

---

### `DELETE /cart/clear`

Clears the entire cart for the authenticated user.

- **Method:** `DELETE`
- **Authentication:** Required (JWT).
- **Success Response (204 No Content):** No content.

## Payments (`/payments`)

Handles the creation and verification of payments. All routes require authentication.

---

### `POST /payments/crypto`

Initiates a cryptocurrency payment.

- **Method:** `POST`
- **Authentication:** Required (JWT).
- **Body (JSON):**
  ```json
  {
    "cartItems": [
      { "productId": "product_id_1", "quantity": 1 },
      { "productId": "product_id_2", "quantity": 2 }
    ],
    "paymentMethod": "USDT_TRC20"
  }
  ```
- **Success Response (200 OK):**
  - **Body:** `{ "paymentId": "generated_payment_id", "address": "crypto_wallet_address", "amount": 100.00, "currency": "USDT" }`
- **Error Responses:**
  - `400 Bad Request`: If `cartItems` or `paymentMethod` are invalid.
  - `404 Not Found`: If a product in `cartItems` does not exist.
  - `500 Internal Server Error`: For general server errors.

---

### `GET /payments/:paymentId/status`

Retrieves the status of a specific payment.

- **Method:** `GET`
- **Authentication:** Required (JWT).
- **URL Parameter:** `paymentId`
- **Success Response (200 OK):**
  - **Body:** `{ "id", "status": "pending" | "completed" | "failed", "amount", "currency", "createdAt" }`
- **Error Responses:**
  - `404 Not Found`: If the payment with the given ID does not exist or does not belong to the user.

## User (`/user`)

Manages user profiles and subscriptions. All routes require authentication.

---

### `GET /user/profile`

Retrieves the profile of the currently authenticated user.

- **Method:** `GET`
- **Authentication:** Required (JWT).
- **Success Response (200 OK):**
  - **Body:** `{ "id", "email", "name", "telegram", "createdAt" }`

---

### `PUT /user/profile`

Updates the profile of the currently authenticated user.

- **Method:** `PUT`
- **Authentication:** Required (JWT).
- **Body (JSON):**
  ```json
  {
    "name": "New User Name",
    "telegram": "@newusername"
  }
  ```
- **Success Response (200 OK):**
  - **Body:** The updated user profile object.
- **Error Responses:**
  - `400 Bad Request`: If validation fails.
  - `409 Conflict`: If the new Telegram username is already taken.

---

### `GET /user/subscriptions`

Retrieves a list of the authenticated user's subscriptions.

- **Method:** `GET`
- **Authentication:** Required (JWT).
- **Success Response (200 OK):**
  - **Body:** `[ { "id", "productId", "status": "active" | "cancelled", "startDate", "endDate" }, ... ]`

---

### `GET /user/payments`

Retrieves a list of the authenticated user's past payments.

- **Method:** `GET`
- **Authentication:** Required (JWT).
- **Success Response (200 OK):**
  - **Body:** `[ { "id", "amount", "currency", "status", "createdAt" }, ... ]`

---

### `POST /user/subscriptions/:subscriptionId/cancel`

Cancels a specific subscription for the authenticated user.

- **Method:** `POST`
- **Authentication:** Required (JWT).
- **URL Parameter:** `subscriptionId`
- **Success Response (200 OK):**
  - **Body:** `{ "message": "Subscription cancelled successfully" }`
- **Error Responses:**
  - `404 Not Found`: If the subscription does not exist or does not belong to the user.
  - `400 Bad Request`: If the subscription cannot be cancelled (e.g., already cancelled).

## Health Check (`/health`)

---

### `GET /health`

Checks the health status of the backend server.

- **Method:** `GET`
- **Success Response (200 OK):**
  - **Body:** `{ "status": "OK" }`
- **Error Responses:**
  - `500 Internal Server Error`: If the server is unhealthy.