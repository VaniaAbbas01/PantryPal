# PantryPal 

PantryPal is a full-stack SaaS application that helps people discover recipes using ingredients they already have at home.

Instead of asking **"What should I cook?"**, PantryPal answers:

> **"What can I cook with what I already have?"**

The project is built as a modern web application with a React frontend and a Spring Boot backend.

---

# Target Users

* Students
* Beginner cooks
* Young professionals
* Anyone who wants to reduce food waste and grocery costs

---

# MVP Features

* ✅ User Authentication
* ✅ Pantry Management
* ✅ Recipe Matching
* ✅ Recipe Details
* ✅ Beginner Cooking Mode
* Favorite Recipes

---

# Tech Stack

## Frontend

* React 19
* TypeScript
* Vite
* Chakra UI v3
* React Router v7
* TanStack Query v5

## Backend

* Spring Boot 4
* Java 21
* PostgreSQL
* Spring Security
* JWT Authentication
* Spring Data JPA
* Flyway
* Maven

---

# Repository Structure

```
.
├── frontend/        # React + TypeScript application
├── pantrypal/       # Spring Boot backend
├── docker-compose.yml
└── README.md
```

The frontend and backend are independent applications that are developed and run separately.

---

# Getting Started

## Prerequisites

Install the following:

* Java 21
* Node.js (LTS recommended)
* Docker & Docker Compose
* Git

---

# Running the Project

## 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

The PostgreSQL container is exposed on:

```
localhost:5433
```

---

## 2. Start the Backend

```bash
cd pantrypal
./mvnw spring-boot:run
```

Backend:

```
http://localhost:8080
```

---

## 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# Build Commands

## Backend

Build

```bash
./mvnw clean package
```

Run tests

```bash
./mvnw test
```

Run a single test class

```bash
./mvnw test -Dtest=AuthControllerIntegrationTest
```

Run a single test method

```bash
./mvnw test -Dtest=AuthControllerIntegrationTest#registerThenLoginIssuesUsableToken
```

---

## Frontend

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build

```bash
npm run build
```

Lint

```bash
npm run lint
```

Preview production build

```bash
npm run preview
```

---

# Authentication

PantryPal uses JSON Web Tokens (JWT) for authentication.

Public endpoints:

* `POST /api/auth/register`
* `POST /api/auth/login`

All other API endpoints require a valid Bearer token.

---

# Database

The application uses PostgreSQL with Flyway for schema migrations.

Schema changes should always be added as versioned migration files under:

```
pantrypal/src/main/resources/db/migration
```

Hibernate validates the schema but does not generate it.

---

# Environment Variables

The backend configuration can be overridden using environment variables.

| Variable                 | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `DB_URL`                 | PostgreSQL connection URL                       |
| `DB_USERNAME`            | Database username                               |
| `DB_PASSWORD`            | Database password                               |
| `JWT_SECRET`             | Secret key used to sign JWTs (minimum 32 bytes) |
| `JWT_EXPIRATION_MINUTES` | JWT expiration time                             |

---

# Architecture

The project follows a feature-based architecture.

Backend packages are organized by feature:

```
auth/
config/
user/
...
```

Development principles:

* Clean Architecture
* SOLID principles
* RESTful APIs
* Responsive UI
* Production-quality code
* Testable components
* Simplicity over unnecessary complexity

---

# Testing

Backend integration tests use:

* Spring Boot Test
* Testcontainers
* PostgreSQL

Docker must be running before executing backend tests.

---

# CORS

By default, the backend allows requests from:

```
http://localhost:5173
```

If Vite starts on another port, update the allowed origins in the backend configuration.

---

# Roadmap

Planned improvements include:

* AI-powered recipe recommendations
* Smart ingredient substitutions
* Meal planning calendar
* Shopping list generation
* Nutrition information
* Recipe ratings and reviews
* Pantry expiration reminders
* Image uploads for recipes

---

# Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

---

# License

This project is licensed under the MIT License unless stated otherwise.

---

Built with ❤️ using React, Spring Boot, and PostgreSQL.
