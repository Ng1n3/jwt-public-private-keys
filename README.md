# JWT Authentication with Public/Private Keys (RS256)

This repository contains a comprehensive, production-ready implementation of a secure JWT-based authentication system for Node.js applications. It leverages asymmetric cryptography (RSA) with public/private keys for enhanced security, making it ideal for modern web applications and microservices architectures.

The system is built with TypeScript, Express.js, and MongoDB, following clean architecture principles like the Repository Pattern.

✨ **This project is the result of the in-depth guide published [here](https://muyiwa-dev.medium.com/jwt-authentication-using-private-and-public-keys-25c1de8fb933).**

---

## 🚀 Key Features

* **Asymmetric JWT Signing:** Uses `RS256` (RSA) for signing tokens. The private key signs tokens, while the public key verifies them, allowing verification services to operate without access to the secret key.
* **Access & Refresh Tokens:** Implements a robust authentication flow with short-lived access tokens and long-lived refresh tokens.
* **Secure Cookie Storage:** Stores refresh tokens in secure, `HttpOnly`, `SameSite=Strict` cookies to prevent XSS attacks.
* **Server-Side Token Revocation:** Refresh tokens are stored in the database, allowing for immediate session invalidation (e.g., on logout or if a token is compromised).
* **Clean Architecture:** Follows the **Repository Pattern** to decouple business logic from the data access layer (Mongoose).
* **Strong Password Security:** Uses `bcrypt` to hash and salt user passwords before storing them.
* **Graceful Shutdown:** The server is configured to shut down gracefully, closing database connections before exiting.
* **TypeScript-First:** Built entirely in TypeScript for type safety and improved developer experience.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** `jsonwebtoken`, `bcryptjs`
* **Runtime:** `ts-node`, `nodemon`
* **Package Manager:** `pnpm`

---

## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* [pnpm](https://pnpm.io/installation)
* [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud)
* [OpenSSL](https://www.openssl.org/) (usually pre-installed on Linux/macOS)

### 1. Clone the Repository

```bash
git clone https://github.com/Ng1n3/jwt-public-private-keys
cd your-repo-name
```

### 2. Install Dependencies
```
pnpm install
```

### 3. Set Up Environment Variables
Now, open the `env` file in the root of the project by copying the example file.
```
cp .env.example .env
```
Now, open the `.env` file and add your MongDB connection string:
```
# .env
PORT=6000
DB_URI=mongodb://localhost:27017/jwt_auth
# ... other variables are pre-filled
```

### 4. Generate RSA Key Pair
You need to generate a private and public key pair for signing and verifying JWTs. Run the following commands in the root of your project.
```
# Generate a 2048-bit private key
openssl genrsa -out private.pem 2048

# Extract the public key from the private key
openssl rsa -in private.pem -pubout -out public.pem
```
After running these commands, create a `keys` folder inside the `src/auth` directory and move the generated `private.pem` and `public.pem` files into it.

Your final structure should be:

```
src/
└── auth/
    └── keys/
        ├── private.pem
        └── public.pem
```
### 5. Run the Development Server
```
pnpm run dev
```
The server will start on the port specified in your `.env` file (e.g., `http://localhost:6000`).

## 🗺️ API Endpoints
The primary authentication routes are available under the /api/v1/auth prefix.

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|------------|
| `POST` | `/api/v1/auth/register` | Register a new user. | No |
| `POST` | `/api/v1/auth/login` | Log in a user and get tokens. | No |
| `POST` | `/api/v1/auth/refresh-token` | Get a new access token using the refresh token cookie. | No |
| `POST` | `/api/v1/auth/logout` | Log out the user and invalidate the refresh token. | Yes |
| `GET`  | `/api/v1/auth/me` | Get the currently authenticated user's profile. | Yes |
| `GET`  | `/api/v1/healthcheck` | Check if the server is running. | No |


Protected routes require a valid access token in the `Authorization: Bearer <token>` header.

## 🔐 Security Focus
Security was a primary consideration for this project. Key features include:

- Asymmetric Keys (RS256): Prevents services that only need to verify tokens from having access to the secret signing key.
- HttpOnly Cookies: Protects refresh tokens from being accessed by client-side JavaScript, mitigating XSS risks.
- Password Hashing: Uses `bcrypt` to securely hash all user passwords.
- Secret Management: All sensitive information (database URI, key paths) is managed via environment variables and is not hardcoded.
- Input Validation: Mongoose schemas enforce validation rules on all incoming data.

Made with ❤️ by Muyiwa