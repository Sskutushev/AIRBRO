# 4. Database Schema

The database schema for AIRBRO Business is defined using Prisma in the `backend/prisma/schema.prisma` file. Prisma serves as the Object-Relational Mapper (ORM), providing a type-safe and intuitive way to interact with the database. The chosen database for development is SQLite.

Below is a detailed explanation of each model in the schema.

---

## `User`

Represents a user of the application.

- **Table Name:** `users`

| Field        | Type     | Description                                          | Attributes & Constraints      |
|--------------|----------|------------------------------------------------------|-------------------------------|
| `id`         | `String` | A unique identifier for the user.                    | `@id @default(uuid())`        |
| `email`        | `String` | The user's email address. Must be unique.            | `@unique`                     |
| `passwordHash` | `String` | The user's hashed password for secure storage.       |                               |
| `name`         | `String` | The user's display name.                             |                               |
| `telegram`     | `String` | The user's Telegram username. Must be unique.        | `@unique`                     |
| `telegramId`   | `String?`| The user's Telegram ID for bot integration. Must be unique. | `@unique`                     |
| `createdAt`    | `DateTime` | The timestamp when the user was created.             | `@default(now())`             |
| `updatedAt`    | `DateTime` | The timestamp of the last update to the user record. | `@updatedAt`                  |
| `subscriptions`| `Subscription[]` | A list of all subscriptions this user has. | Relation to `Subscription` model |
| `payments`     | `Payment[]`    | A list of all payments made by this user.      | Relation to `Payment` model   |
| `cartItems`    | `CartItem[]`   | A list of all items currently in the user's cart. | Relation to `CartItem` model  |

---

## `Product`

Represents a product or service that can be subscribed to.

- **Table Name:** `products`

| Field         | Type     | Description                                          | Attributes & Constraints      |
|---------------|----------|------------------------------------------------------|-------------------------------|
| `id`          | `String` | A unique identifier for the product.                 | `@id @default(uuid())`        |
| `slug`        | `String` | A URL-friendly unique identifier for the product.    | `@unique`                     |
| `name`        | `String` | The display name of the product.                     |                               |
| `description` | `String` | A detailed description of the product.               |                               |
| `price`       | `Int`    | The price of the product in the smallest currency unit (e.g., cents, kopecks). |                               |
| `interval`    | `String` | The subscription interval (e.g., "month" or "year"). |                               |
| `features`    | `String` | A JSON string containing a list of product features. |                               |
| `isActive`    | `Boolean`| Whether the product is currently available for purchase. | `@default(true)`              |
| `tier`        | `Int`    | The tier level of the product (e.g., 1, 2, 3).       |                               |
| `createdAt`   | `DateTime` | The timestamp when the product was created.          | `@default(now())`             |
| `updatedAt`   | `DateTime` | The timestamp of the last update to the product.     | `@updatedAt`                  |
| `subscriptions`| `Subscription[]` | A list of subscriptions associated with this product. | Relation to `Subscription` model |
| `cartItems`    | `CartItem[]`   | A list of cart items associated with this product. | Relation to `CartItem` model  |

---

## `CartItem`

Represents a single item in a user's shopping cart. This acts as a link between a `User` and a `Product`.

- **Table Name:** `cart_items`

| Field       | Type     | Description                               | Attributes & Constraints      |
|-------------|----------|-------------------------------------------|-------------------------------|
| `id`        | `String` | A unique identifier for the cart item.    | `@id @default(uuid())`        |
| `userId`    | `String` | The ID of the user who owns the cart.     | Foreign Key to `User`         |
| `productId` | `String` | The ID of the product in the cart.        | Foreign Key to `Product`      |
| `quantity`  | `Int`    | The quantity of the product in the cart.  | `@default(1)`                 |
| `createdAt` | `DateTime` | The timestamp when the item was added.    | `@default(now())`             |
| `user`      | `User`   | The related `User` object.                | Relation field                |
| `product`   | `Product`| The related `Product` object.             | Relation field                |
|             |          |                                           | `@@unique([userId, productId])` |

---

## `Subscription`

Represents a user's active or past subscription to a product.

- **Table Name:** `subscriptions`

| Field           | Type      | Description                                          | Attributes & Constraints |
|-----------------|-----------|------------------------------------------------------|--------------------------|
| `id`            | `String`  | A unique identifier for the subscription.            | `@id @default(uuid())`   |
| `userId`        | `String`  | The ID of the subscribed user.                       | Foreign Key to `User`    |
| `productId`     | `String`  | The ID of the subscribed product.                    | Foreign Key to `Product` |
| `status`        | `String`  | The current status of the subscription (e.g., "active", "cancelled", "expired", "trial"). |                          |
| `startDate`     | `DateTime`| The date the subscription began.                     |                          |
| `endDate`       | `DateTime`| The date the subscription is set to expire.          |                          |
| `nextPaymentDate`| `DateTime?`| The date of the next scheduled payment.              | Optional (`?`)           |
| `cancelledAt`   | `DateTime?`| The date the subscription was cancelled.             | Optional (`?`)           |
| `createdAt`     | `DateTime`| The timestamp when the subscription was created.     | `@default(now())`        |
| `updatedAt`     | `DateTime`| The timestamp of the last update.                    | `@updatedAt`             |
| `user`          | `User`    | The related `User` object.                           | Relation field           |
| `product`       | `Product` | The related `Product` object.                        | Relation field           |

---

## `Payment`

Represents a payment transaction made by a user.

- **Table Name:** `payments`

| Field         | Type      | Description                                          | Attributes & Constraints |
|---------------|-----------|------------------------------------------------------|--------------------------|
| `id`          | `String`  | A unique identifier for the payment.                 | `@id @default(uuid())`   |
| `userId`      | `String`  | The ID of the user who made the payment.             | Foreign Key to `User`    |
| `amount`      | `Int`     | The payment amount in the smallest currency unit.    |                          |
| `currency`    | `String`  | The currency of the payment (e.g., "RUB", "USDT").   |                          |
| `status`      | `String`  | The status of the payment (e.g., "pending", "completed", "failed", "expired"). |                          |
| `paymentMethod`| `String`  | The method used for payment (e.g., "crypto_usdt_trc20", "crypto_usdt_erc20", "crypto_ton", "card"). |                          |
| `walletAddress`| `String?` | The crypto wallet address used for the transaction.  | Optional (`?`)           |
| `txHash`      | `String?` | The transaction hash for crypto payments.            | Optional (`?`)           |
| `qrCode`      | `String?` | A Base64 encoded QR code for the payment.            | Optional (`?`)           |
| `metadata`    | `String?` | A JSON string for storing extra payment data.        | Optional (`?`)           |
| `expiresAt`   | `DateTime?`| The time when the payment request expires.           | Optional (`?`)           |
| `createdAt`   | `DateTime`| The timestamp when the payment was created.          | `@default(now())`        |
| `updatedAt`   | `DateTime`| The timestamp of the last update.                    | `@updatedAt`             |
| `user`        | `User`    | The related `User` object.                           | Relation field           |
