# 4. Database Schema

For data management in the project, we use **Prisma** — an ORM (Object-Relational Mapper) for the next generation for Node.js and TypeScript. For local development, we use **SQLite**, and for production, **PostgreSQL**.

All data schema is described in the file [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).

## Data Models Overview

Below are the main models and their purposes.

### `User`

Represents a system user.

| Field          | Type       | Description                                |
| -------------- | ---------- | ------------------------------------------ |
| `id`           | `String`   | Unique identifier (UUID).                  |
| `email`        | `String`   | Unique user email.                         |
| `passwordHash` | `String`   | Password hash generated with `bcrypt`.     |
| `name`         | `String`   | User's name.                               |
| `telegram`     | `String`   | Unique Telegram username.                  |
| `telegramId`   | `String?`  | User ID in Telegram (for bot integration). |
| `createdAt`    | `DateTime` | Date and time of user creation.            |
| `updatedAt`    | `DateTime` | Date and time of last update.              |

**Relationships:**

- One `User` can have many `Subscription`, `Payment`, and `CartItem`.

### `Product`

Represents a subscription plan or product that can be purchased.

| Field         | Type       | Description                                    |
| ------------- | ---------- | ---------------------------------------------- |
| `id`          | `String`   | Unique identifier (UUID).                      |
| `slug`        | `String`   | Unique URL string (e.g., `basic-plan`).        |
| `name`        | `String`   | Product name (e.g., "Basic Plan").             |
| `description` | `String`   | Product description.                           |
| `price`       | `Int`      | Price in the smallest currency unit (kopecks). |
| `interval`    | `String`   | Subscription interval ("month" or "year").     |
| `features`    | `String`   | JSON string with a list of product features.   |
| `isActive`    | `Boolean`  | Is the product active for purchase.            |
| `tier`        | `Int`      | Tier level (1, 2, 3).                          |
| `createdAt`   | `DateTime` | Date and time of product creation.             |
| `updatedAt`   | `DateTime` | Date and time of last update.                  |

**Relationships:**

- One `Product` can be associated with many `Subscription` and `CartItem`.

### `Subscription`

Links a user with the product they are subscribed to.

| Field             | Type        | Description                                                      |
| ----------------- | ----------- | ---------------------------------------------------------------- |
| `id`              | `String`    | Unique identifier (UUID).                                        |
| `userId`          | `String`    | ID of the user who owns the subscription.                        |
| `productId`       | `String`    | ID of the product the subscription is for.                       |
| `status`          | `String`    | Subscription status ("active", "cancelled", "expired", "trial"). |
| `startDate`       | `DateTime`  | Start date of the subscription.                                  |
| `endDate`         | `DateTime`  | End date of the subscription.                                    |
| `nextPaymentDate` | `DateTime?` | Next payment date (for recurring payments).                      |
| `cancelledAt`     | `DateTime?` | Date and time when the subscription was cancelled.               |
| `createdAt`       | `DateTime`  | Date and time of subscription creation.                          |
| `updatedAt`       | `DateTime`  | Date and time of last update.                                    |

**Relationships:**

- Belongs to one `User` and one `Product`.

### `Payment`

Record of a financial transaction.

| Field           | Type        | Description                                                   |
| --------------- | ----------- | ------------------------------------------------------------- |
| `id`            | `String`    | Unique identifier (UUID).                                     |
| `userId`        | `String`    | ID of the user who made the payment.                          |
| `amount`        | `Int`       | Amount in the smallest currency unit (kopecks).               |
| `currency`      | `String`    | Payment currency ("RUB", "USD", "USDT", "TON").               |
| `status`        | `String`    | Payment status ("pending", "completed", "failed", "expired"). |
| `paymentMethod` | `String`    | Payment method (e.g., "crypto_usdt_trc20").                   |
| `walletAddress` | `String?`   | Wallet address for crypto payments.                           |
| `txHash`        | `String?`   | Transaction hash in the blockchain.                           |
| `qrCode`        | `String?`   | QR code for payment (in Base64 format).                       |
| `metadata`      | `String?`   | JSON string for additional payment metadata.                  |
| `expiresAt`     | `DateTime?` | Date and time when the payment intent expires.                |
| `createdAt`     | `DateTime`  | Date and time of payment creation.                            |
| `updatedAt`     | `DateTime`  | Date and time of last update.                                 |

**Relationships:**

- Belongs to one `User`.

### `CartItem`

Intermediate model for storing products in a user's cart.

| Field       | Type       | Description                                        |
| ----------- | ---------- | -------------------------------------------------- |
| `id`        | `String`   | Unique identifier (UUID).                          |
| `userId`    | `String`   | User ID.                                           |
| `productId` | `String`   | Product ID in the cart.                            |
| `quantity`  | `Int`      | Quantity (usually 1 for subscriptions).            |
| `createdAt` | `DateTime` | Date and time when the item was added to the cart. |

**Relationships:**

- Belongs to one `User` and one `Product`.

## Visual Schema (ERD)

```mermaid
erDiagram
    User {
        String id PK
        String email UNIQUE
        String passwordHash
        String name
        String telegram UNIQUE
        String telegramId UNIQUE NULLABLE
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        String id PK
        String slug UNIQUE
        String name
        String description
        Int price
        String interval
        String features
        Boolean isActive
        Int tier
        DateTime createdAt
        DateTime updatedAt
    }

    Subscription {
        String id PK
        String userId FK
        String productId FK
        String status
        DateTime startDate
        DateTime endDate
        DateTime nextPaymentDate NULLABLE
        DateTime cancelledAt NULLABLE
        DateTime createdAt
        DateTime updatedAt
    }

    Payment {
        String id PK
        String userId FK
        Int amount
        String currency
        String status
        String paymentMethod
        String walletAddress NULLABLE
        String txHash NULLABLE
        String qrCode NULLABLE
        String metadata NULLABLE
        DateTime expiresAt NULLABLE
        DateTime createdAt
        DateTime updatedAt
    }

    CartItem {
        String id PK
        String userId FK
        String productId FK
        Int quantity
        DateTime createdAt
    }

    User ||--o{ Subscription : "has"
    Product ||--o{ Subscription : "is for"
    User ||--o{ Payment : "makes"
    User ||--o{ CartItem : "has"
    Product ||--o{ CartItem : "contains"
```

---

**Next:** [05 - Frontend](./05_Frontend.md)
