# Authentication Flow Documentation

This document explains the complete authentication system used in the Poultry Farm Management application.

---

## Overview

The app supports **2 authentication methods**:

1. Username + Password (local)
2. OAuth (Google / GitHub)

All methods result in the same outcome: the server issues an **access token** (JWT, 15 min) and a **refresh token** (random hex, 7 days) as HTTP-only cookies.

---

## Token System

### Access Token
- JWT signed with `JWT_SECRET`
- Stored in HTTP-only cookie `accessToken`
- Expires in 15 minutes
- Contains only `{ id: userId }`

### Refresh Token
- Random 40-byte hex string
- Stored in HTTP-only cookie `refreshToken` (path: `/api/auth/refresh`)
- Stored in MongoDB (`RefreshToken` collection) with `user`, `expiresAt`, `revoked`, `replacedBy`
- Expires in 7 days
- **Rotation**: on each refresh, the old token is revoked and a new one is issued
- **Replay detection**: if a revoked token is reused, ALL tokens for that user are revoked (forces re-login everywhere)

### Cookie Settings
| Setting    | Production      | Development |
|------------|-----------------|-------------|
| httpOnly   | true            | true        |
| secure     | true            | false       |
| sameSite   | strict          | lax         |

---

## Authentication Flows

### 1. Username + Password Login

```
Frontend (Login.jsx)                  Backend
────────────────────                  ───────
User enters username + password
        │
        ▼
POST /api/auth/login ──────────────►  authController.login()
  { username, password }                  │
                                          ├─ Find user by username (with +password)
                                          ├─ Check authProvider === 'local'
                                          ├─ bcrypt.compare(password, hash)
                                          ├─ Check user.isActive
                                          ▼
◄──────────────────────────────────  Set accessToken + refreshToken cookies
  { success: true, user: {...} }     Return user data (no password fields)
        │
        ▼
AuthContext sets user state
Navigate to "/"
```

**Key files:**
- `frontend/src/pages/Login.jsx` → `PasswordForm` component
- `frontend/src/context/AuthContext.jsx` → `login()` method
- `backend/controllers/authController.js` → `login()` + `loginResponse()`

---

### 2. OAuth Login (Google / GitHub)

```
Frontend (Login.jsx)                  Backend
────────────────────                  ───────
User clicks "Google" or "GitHub" button
        │
        ▼
Browser navigates to /api/auth/google (or /github)
        │
        ▼
                                      passport.authenticate('google')
                                          │
                                          ▼
                                      Redirect to Google/GitHub consent screen
                                          │
                                      User grants permission
                                          │
                                          ▼
                                      GET /api/auth/google/callback
                                          │
                                      Passport GoogleStrategy / GitHubStrategy
                                          │
                                          ├─ Find user by (authProvider + providerId)
                                          ├─ If not found, check by email
                                          │   └─ If email match: LINK account (update authProvider)
                                          ├─ If still not found: CREATE new user (role: 'user')
                                          ▼
                                      oauthCallback()
                                          │
                                          ├─ Check user.isActive
                                          ├─ Generate access + refresh tokens
                                          ├─ Set cookies
                                          ▼
◄──────────────────────────────────  Redirect to FRONTEND_URL/
        │
        ▼
AuthContext.checkAuth() calls /api/auth/me
User state is set from cookie
```

**Key files:**
- `frontend/src/pages/Login.jsx` → OAuth buttons (anchor tags)
- `backend/config/passport.js` → Google + GitHub strategies
- `backend/controllers/authController.js` → `oauthCallback()`

---

## Session Persistence (Frontend)

On app load, `AuthContext` runs `checkAuth()`:

```
AuthProvider mounts
        │
        ▼
GET /api/auth/me ──────────────────►  protect middleware checks accessToken cookie
        │                                 │
        ├─ 200 OK → set user state        ├─ Valid → return user
        │                                 ├─ Expired → 401 TOKEN_EXPIRED
        ├─ 401 → try refresh              ▼
        │
        ▼
POST /api/auth/refresh ────────────►  Rotate refresh token, issue new access token
        │
        ├─ 200 OK → retry /me → set user
        ├─ 401 → set user = null (logged out)
```

---

## Protected Routes (Backend Middleware)

### `protect` middleware (`backend/middleware/auth.js`)
1. Read `accessToken` from cookie (fallback: `Authorization: Bearer <token>` header)
2. Verify JWT with `JWT_SECRET`
3. Find user by decoded `id`
4. Check `user.isActive`
5. Attach user to `req.user`

### `authorize(...roles)` middleware
- Checks `req.user.role` against allowed roles
- Example: `authorize('admin', 'manager')`

### `requirePermission(...permissions)` middleware
- Merges user-level permissions + role-level permissions (from `Role` model)
- Checks all required permissions are present

---

## Logout Flow

```
Frontend                              Backend
────────                              ───────
User clicks logout
        │
        ▼
POST /api/auth/logout ─────────────►  authController.logout()
  (with accessToken cookie)               │
                                          ├─ Revoke refresh token in DB
                                          ├─ Clear accessToken cookie
                                          ├─ Clear refreshToken cookie
                                          ▼
◄──────────────────────────────────  { success: true }
        │
        ▼
AuthContext sets user = null
```

---

## Change Password Flow

```
POST /api/auth/change-password ────►  authController.changePassword()
  { currentPassword, newPassword }        │
                                          ├─ Verify current password (bcrypt)
                                          ├─ Set new password (auto-hashed via pre-save hook)
                                          ├─ Revoke ALL refresh tokens for user
                                          │   (forces re-login on all devices)
                                          ├─ Issue new tokens
                                          ▼
◄──────────────────────────────────  Set new cookies + return user
```

---

## User Model Key Fields

| Field            | Purpose                                      |
|------------------|----------------------------------------------|
| `username`       | For local password login (unique, sparse)    |
| `email`          | For OAuth (unique, sparse)                   |
| `password`       | Bcrypt hash, `select: false` (excluded by default) |
| `role`           | `admin` / `manager` / `editor` / `user`      |
| `permissions`    | Array of permission strings (user-level)      |
| `isActive`       | Account activation flag                       |
| `authProvider`   | `local` / `google` / `github`                |
| `providerId`     | OAuth provider's user ID                      |

---

## Role & Permission System

Roles are seeded via `backend/scripts/seedRoles.js`:

| Role    | Permissions                                                                      |
|---------|----------------------------------------------------------------------------------|
| admin   | manage_users, manage_roles, view_reports, create_post, edit_post, delete_post, manage_eggs, manage_feed, manage_birds |
| manager | view_reports, create_post, edit_post, manage_eggs, manage_feed, manage_birds     |
| editor  | create_post, edit_post, view_reports                                             |
| user    | view_reports                                                                     |

Default role for new users: `manager` (local) or `user` (OAuth).

---

## API Routes Summary

| Method | Route                          | Auth     | Description                |
|--------|--------------------------------|----------|----------------------------|
| POST   | `/api/auth/login`              | Public   | Username + password login  |
| POST   | `/api/auth/refresh`            | Public   | Refresh access token       |
| GET    | `/api/auth/me`                 | Private  | Get current user           |
| POST   | `/api/auth/logout`             | Private  | Logout + revoke tokens     |
| PUT    | `/api/auth/change-password`    | Private  | Change password            |
| GET    | `/api/auth/google`             | Public   | Start Google OAuth         |
| GET    | `/api/auth/google/callback`    | Public   | Google OAuth callback      |
| GET    | `/api/auth/github`             | Public   | Start GitHub OAuth         |
| GET    | `/api/auth/github/callback`    | Public   | GitHub OAuth callback      |
