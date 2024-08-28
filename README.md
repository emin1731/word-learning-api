# Word learning API

This is the backend API for a word-learning application, designed to be used with a frontend client. The API provides token-based authentication and supports CRUD operations for managing modules and terms.


## Features

- **Token Authentication:** Secure access to API endpoints using JWT tokens.
- **Modules:** Create, read, update, and delete word learning modules.
- **Terms:** Manage terms within modules with full CRUD operations.

## Technologies Used

- **Node.js** with **Express.js**: For building the API server.
- **Prisma ORM**: For database access and management.
- **SQLite**: As the database provider.
- **jsonwebtoken**: For handling JWT-based authentication.
- **Inversify**: For dependency injection and IoC (Inversion of Control).

## Endpoints Overview

### Auth

| Endpoint                | Description                                                            | Method            |
| ----------------------- | ---------------------------------------------------------------------- | ----------------- |
| `auth/register`         | Registers a new user by creating a new account.                        | `POST`            |
| `auth/login`            | Authenticates a user and returns an access token and a refresh token.  | `POST`            |
| `/auth/refreshToken`    | Refreshes the access token using a valid refresh token.                | `POST`            |
| `/auth/revokeTokens`    | Revokes all tokens for the current user, effectively logging them out. | `POST`            |

### Modules

| Endpoint                | Description                                                   | Method            |
| ----------------------- | ------------------------------------------------------------- | ----------------- |
| `modules/`              | Creates a new module for learning.                            | `POST`            |
| `modules/`              | Retrieves a list of all available modules.                    | `GET`             |
| `modules/:id`           | Retrieves an information about a specific module.             | `GET`             |
| `modules/:id`           | Updates an existing module with new information.              | `PUT`             |
| `modules/:id`           | Deletes a specific module.                                    | `DELETE`          |

### Terms

| Endpoint                          | Description                                              | Method            |
| --------------------------------- | -------------------------------------------------------- | ----------------- |
| `modules/:moduleId/terms`         | Creates a new term within a specific module.             | `POST`            |
| `modules/:moduleId/terms`         | Retrieves a list of all terms within a specific module.  | `GET`             |
| `modules/:moduleId/terms/:termId` | Retrieves an information about a specific term.          | `GET`             |
| `modules/:moduleId/terms/:termId` | Updates an existing term within a specific module.       | `PUT`             |
| `modules/:moduleId/terms/:termId` | Deletes a specific term within a module.                 | `DELETE`          |


## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. **Install the dependencies:**

    ```bash
    npm install
    ```

2. **Set up the environment variables:**
   
   Create a `.env` file in the root of the project and add the necessary environment variables.
   
   Example:
   
    ```env
    PORT=8001
    SALT="your_salt_key"
    JWT_ACCESS_SECRET="your_secret_key"
    JWT_REFRESH_SECRET="your_secret_key"
    ```

3. **Run the migrations to set up the database:**

    ```bash
    npx prisma migrate dev --name init
    ```

4. **Start the server:**

    ```bash
    npm run dev
    ```

