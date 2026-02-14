# Real-Time Backend API

A production-ready, real-time backend for a Kanban-style collaboration platform (similar to Trello / Notion).

Built with modern backend architecture principles:

- Layered structure
- Centralized error handling
- Role-based access control
- Real-time updates with WebSockets
- Strict request validation

---

# 🌟 Features

## 🔐 Authentication

- JWT-based authentication
- Secure password hashing with Bcrypt
- Protected routes via middleware

## 🧑‍🤝‍🧑 Role-Based Access Control (RBAC)

- Board Owner
- Admin
- Member
- Viewer (optional future extension)

Permissions enforced at **service layer**.

## ⚡ Real-Time Collaboration

- Live updates using Socket.io
- Board-based rooms
- Instant task/list synchronization

## 🧠 Smart Drag-and-Drop

- Uses **Fractional Indexing (Float positions)**
- O(1) reordering
- No expensive reindex operations

## ✅ Strict Input Validation

- Zod-based request validation
- Strong typing via TypeScript
- No unvalidated payloads reach business logic

## 📜 Activity Logging

- Tracks task creation
- Task movement
- Board creation

## 🛡 Secure Error Handling

- Custom `AppError` class
- Centralized error responses
- No string-based error matching

---

# 🛠 Tech Stack

- Node.js (v20+)
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- Socket.io
- Zod
- Bcrypt
- Helmet + CORS

---

# 📦 Installation

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd backend
```

## 2️⃣ Install Dependencies

```bash
pnpm install
# or
npm install
```

---

# ⚙️ Environment Setup

Create a `.env` file in root:

```env
PORT=5000

DATABASE_URL="postgresql://user:password@localhost:5432/kanban_db"

JWT_SECRET="super_secret_key_change_me"

CORS_ORIGIN="http://localhost:3000"
```

---

# 🗄 Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

---

# 🚀 Run Server

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

Server runs at:

```
http://localhost:5000
```

API Base:

```
http://localhost:5000/api
```

---

# 📡 API Endpoints

All protected routes require:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/auth/register` | Register new user     |
| POST   | `/auth/login`    | Login and receive JWT |

---

## 📋 Boards

| Method | Endpoint      | Description       | Access        |
| ------ | ------------- | ----------------- | ------------- |
| GET    | `/boards`     | Get user boards   | Member        |
| POST   | `/boards`     | Create board      | Authenticated |
| GET    | `/boards/:id` | Get board details | Member        |
| PUT    | `/boards/:id` | Update board      | Admin         |
| DELETE | `/boards/:id` | Delete board      | Owner         |

---

## 📑 Lists

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| POST   | `/lists` | Create list in board |

---

## 📝 Tasks

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | `/tasks`              | Create task |
| PUT    | `/tasks/:taskId/move` | Move task   |
| DELETE | `/tasks/:taskId`      | Delete task |

---

# 🔌 Real-Time (Socket.io)

Connect to:

```
ws://localhost:5000
```

## Join Board Room

```javascript
socket.emit("joinBoard", boardId);
```

---

## Server Events

| Event          | Description    |
| -------------- | -------------- |
| `task:created` | New task added |
| `task:moved`   | Task moved     |
| `task:deleted` | Task deleted   |
| `list:created` | New list added |

All events are emitted to:

```
io.to(boardId)
```

---

# 🏗 Architecture Overview

```
Controller Layer
   ↓
Service Layer (Business Logic + Permissions)
   ↓
Prisma ORM
   ↓
PostgreSQL
```

### Principles Used

- Services throw `AppError`
- Controllers translate to HTTP responses
- No business logic inside controllers
- Permission checks happen inside services
- Validation happens before services

---

# 🛡 Security Design

### 1️⃣ Membership-Based Access

All board/list/task operations verify:

```
User belongs to board.members
```

Prevents ID-based access attacks.

---

### 2️⃣ Owner Restrictions

Only `ownerId` can delete board.

---
