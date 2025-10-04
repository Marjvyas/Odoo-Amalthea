# Expense Tracker API Documentation

This document provides details for the backend API of the Expense Tracker application.

## Authentication (`/api/auth`)
This section covers user registration, login, and data retrieval.

---

### 1. User Signup

Registers a new company and creates the initial admin user.

- **Endpoint:** `POST /api/auth/signup`
- **Access:** Public

**Request Body (JSON):**
```json
{
  "name": "Saanvi Desai",
  "email": "saanvi.desai@example.com",
  "password": "password123",
  "companyName": "Desai Innovations",
  "country": "India"
}
```

**Success Response (`201 Created`):**
Returns a JSON Web Token (JWT) upon successful registration.
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNzI3OTQ4ODAwLCJleHAiOjE3Mjc5NjY4MDB9.abcdefg..."
}
```

**Error Responses (`400 Bad Request`):**
If validation fails:
```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Password must be 6 or more characters",
      "path": "password",
      "location": "body"
    }
  ]
}
```
If the user already exists:
```json
{
  "errors": [
    {
      "msg": "User with this email already exists"
    }
  ]
}
```

---

### 2. User Login

Authenticates an existing user and returns a token.

- **Endpoint:** `POST /api/auth/login`
- **Access:** Public

**Request Body (JSON):**
```json
{
  "email": "saanvi.desai@example.com",
  "password": "password123"
}
```

**Success Response (`200 OK`):**
Returns a JWT upon successful login.
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNzI3OTQ4ODAwLCJleHAiOjE3Mjc5NjY4MDB9.hijklmnop..."
}
```

**Error Response (`400 Bad Request`):**
If credentials do not match:
```json
{
  "errors": [
    {
      "msg": "Invalid credentials"
    }
  ]
}
```

---

### 3. Get Current User Data

Fetches the profile information of the currently authenticated user.

- **Endpoint:** `GET /api/auth/me`
- **Access:** Private

**Header:**
You must include the JWT in the `Authorization` header.
- **Key:** `Authorization`
- **Value:** `Bearer <your_jwt_token>`

**Success Response (`200 OK`):**
Returns the user object (excluding the password).
```json
{
  "id": 1,
  "name": "Saanvi Desai",
  "email": "saanvi.desai@example.com",
  "role": "Admin"
}
```

**Error Response (`401 Unauthorized`):**
If the token is missing, invalid, or expired.
```json
{
  "msg": "No token, authorization denied"
}
```
```markdown
{
  "msg": "Token is not valid"
}
```