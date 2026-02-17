# 🧩 Niro – Real-Time Collaborative Kanban Platform

A full-stack Trello-like Kanban application built using:

- **Next.js 16 (App Router)**
- **Express 5**
- **PostgreSQL**
- **Prisma ORM**
- **TanStack Query v5**
- **Socket.IO**
- **TypeScript (end-to-end)**

This project demonstrates modern full-stack architecture, real-time systems, structured activity logging, role-based authorization, SSR authentication, and optimized database indexing.

---

# 👤 Demo Credentials

```
Email: raven@gmail.com
Password: 123456789
```

---

# 📌 Project Overview

Niro is a collaborative Kanban board system where users can:

- Create and manage boards
- Collaborate with members
- Manage lists & tasks
- Assign users to tasks
- Track activity history
- Use invite links
- Experience real-time updates

The application is designed with **clean separation of concerns**, **secure authentication**, and **scalable database indexing**.

---

# 🏗 System Architecture

## 🔹 High-Level Architecture

```
Frontend (Next.js App Router)
        |
        ↓  (Next.js API Proxy with httpOnly cookies)
Backend (Express API + Socket.IO)
        |
        ↓
PostgreSQL (via Prisma ORM)
```

---

## 🔹 Architectural Design Decisions

### 1️⃣ Next.js as a Proxy Layer

All frontend requests pass through the Next.js API proxy before reaching the backend.

This provides:

- Secure cookie forwarding (httpOnly JWT)
- SSR-safe authentication
- Centralized request handling
- Future middleware support (rate limiting, logging, etc.)
- Easier deployment separation (frontend & backend on different domains)

This approach ensures authentication works consistently in:

- Server Components (SSR)
- Client Components
- Browser requests

---

### 2️⃣ Real-Time Layer (Socket.IO)

The backend includes a WebSocket layer using **Socket.IO**.

It handles:

- Task creation updates
- Task movement updates
- Task deletion
- List creation / rename / delete
- Real-time collaboration within a board room

Each board acts as a WebSocket room:

```
io.to(boardId).emit("event", payload)
```

---

### 3️⃣ Future Scalability Plan (Redis Pub/Sub Layer)

The current architecture runs WebSockets in a single backend instance.

However, the system is intentionally designed so it can later scale horizontally by introducing:

```
Multiple Backend Instances
        |
        ↓
Redis Pub/Sub Adapter
        |
        ↓
Socket.IO Cluster Sync
```

By adding:

- `@socket.io/redis-adapter`
- A Redis instance

We can enable:

- WebSocket event broadcasting across multiple backend servers
- Horizontal scaling
- Load-balanced deployments
- Production-ready real-time architecture

This makes the architecture scalable without major refactoring.

---

### 4️⃣ Database Layer (PostgreSQL + Prisma)

Prisma is used as:

- Type-safe ORM
- Migration manager
- Schema source of truth

Database indexing is intentionally applied on:

- Foreign keys
- Sorting fields
- Pagination fields
- Frequently queried columns

This ensures:

- Efficient infinite scroll queries
- Fast membership lookups
- Optimized board filtering
- Stable activity feed pagination

---

## 🔹 Scalability Strategy Summary

Current:

- Single backend instance
- Direct WebSocket communication

Future-ready:

- Redis Pub/Sub adapter
- Horizontal backend scaling
- Load-balanced API servers
- Distributed WebSocket broadcasting

The current architecture is modular and structured in a way that allows scaling without rewriting core business logic.

---

## 🔹 Backend Architecture (Layered Pattern)

```
Routes
  ↓
Controllers
  ↓
Services (Business Logic)
  ↓
Prisma ORM
  ↓
PostgreSQL
```

### Backend Responsibilities

- Authentication & JWT handling
- Role-based authorization
- Business rules enforcement
- Activity logging
- Invite token validation
- WebSocket broadcasting
- Database interaction via Prisma

---

## 🔹 Frontend Architecture

- Next.js 16 (App Router)
- Server Components + Client Components
- SSR authentication checks
- TanStack Query (caching + prefetching)
- Infinite queries (cursor-based)
- Zustand (light global state)
- Shadcn UI + Tailwind CSS
- dnd-kit (drag & drop)
- Socket.IO client (real-time)

---

# 🔐 Authentication & Security

## 🔹 Authentication Flow

- JWT stored in **httpOnly cookie**
- All API requests go through Next.js proxy
- SSR-safe authentication using `requireAuth()`
- Backend validates token via middleware

## 🔹 Security Measures

- bcrypt password hashing
- httpOnly cookies
- CORS configured with credentials
- Helmet security headers
- Rate limiting
- Invite token expiration (7 days)
- JWT expiration (7 days)
- Role-based authorization checks in services

---

# 👥 Role-Based Access Control

Two roles implemented:

### ADMIN

- Automatically assigned to board creator
- Can:
  - Add members
  - Remove members
  - Generate invite links
  - Delete board
  - Delete lists
  - Perform all member actions

### MEMBER

- Can:
  - Create tasks
  - Update tasks
  - Move tasks
  - Delete tasks
  - Create lists
  - Rename lists

- Cannot:
  - Delete lists
  - Delete board
  - Add/remove members
  - Generate invite links

---

# 📦 Core Features

---

## 🧱 Boards

- Create board
- Rename board
- Delete board
- Owned boards listing (pagination)
- Joined boards listing
- Search functionality
- Board header with:
  - Share
  - Members
  - Activity drawer

---

## 📋 Lists

- Create list
- Rename list
- Delete list (Admin only)
- Positioned using floating number strategy for efficient reordering
- Indexed on `(boardId, position)`

---

## ✅ Tasks

- Create task
- Update task
- Delete task
- Drag & drop using dnd-kit
- Move between lists
- Assign members
- Priority enum (LOW, MEDIUM, HIGH, URGENT)
- Due date (required)
- Indexed by `(listId, position)`
- Real-time updates via WebSockets

---

## 📜 Activity Logging System

Centralized logging mechanism using:

```
ActivityLog model
ActivityAction enum
details JSON field
```

### Logged Actions

- BOARD_CREATED
- BOARD_UPDATED
- BOARD_DELETED
- LIST_CREATED
- LIST_UPDATED
- LIST_DELETED
- TASK_CREATED
- TASK_UPDATED
- TASK_MOVED
- TASK_DELETED
- MEMBER_ADDED
- MEMBER_REMOVED

### Activity Implementation Details

- Structured enum for type safety
- `details` stored as JSON for flexibility
- Indexed by:
  - boardId
  - userId
  - createdAt

- Cursor-based infinite scrolling (stable pagination)

---

## 🔗 Invite System

- Admin generates secure random token
- Token stored in `BoardInvite`
- Expiration: 7 days
- Reuse valid invite if not expired
- Join via `/join/:token`
- On success:
  - User becomes board member
  - Activity log recorded

---

## ⚡ Real-Time System

Using Socket.IO.

Events broadcasted:

- task:created
- task:updated
- task:moved
- task:deleted
- list:created
- list:updated
- list:deleted

Real-time improves collaboration and UX consistency.

---

# 🗄 Database Design

## Core Models

- User
- Board
- BoardMember
- List
- Task
- ActivityLog
- BoardInvite

---

## 🔹 Indexing Strategy

| Model       | Index             |
| ----------- | ----------------- |
| Board       | ownerId           |
| BoardMember | boardId, userId   |
| List        | boardId, position |
| Task        | listId, priority  |
| Task        | listId + position |
| ActivityLog | boardId           |
| ActivityLog | createdAt         |
| ActivityLog | userId            |

These indexes optimize:

- Pagination
- Infinite scroll
- Filtering
- Sorting
- Membership checks

---

# 🖥 Local Setup Guide

---

## Prerequisites

- Node.js (>=18)
- PostgreSQL
- pnpm (backend)
- npm (frontend)

---

# Backend Setup

```
cd Backend
pnpm install
```

Create `.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/niro
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

Run migrations:

```
npx prisma migrate dev
```

Start backend:

```
pnpm dev
```

Backend runs on:

```
http://localhost:8000
```

---

# Frontend Setup

```
cd Frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

Start frontend:

```
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🔌 API Documentation

Base URL:

```
http://localhost:8000/api
```

---

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /auth/signup         |
| POST   | /auth/login          |
| POST   | /auth/logout         |
| POST   | /auth/reset-password |
| PUT    | /auth/delete-account |
| PUT    | /auth/rename         |

---

## Boards

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /boards             |
| GET    | /boards             |
| GET    | /boards/:id         |
| GET    | /boards/name/:id    |
| GET    | /boards/members/:id |
| PUT    | /boards/:id         |
| DELETE | /boards/:id         |

---

## Lists

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /lists         |
| PUT    | /lists/:listId |
| DELETE | /lists/:listId |

---

## Tasks

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /tasks              |
| PUT    | /tasks/:taskId      |
| PUT    | /tasks/:taskId/move |
| DELETE | /tasks/:taskId      |

---

## Members

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | /members/:boardId        |
| DELETE | /members/:boardId        |
| POST   | /members/:boardId/invite |
| POST   | /members/join/:token     |

---

## Activity

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | /activity/recent          |
| GET    | /activity/boards/:boardId |

---

# ⚖ Assumptions

- Only ADMIN and MEMBER roles fully implemented.
- Invite links expire after 7 days.
- Hard deletes used (no soft deletes).
- Activity logs do not support filtering.
- No email verification required.
- Password strength validation minimal.
- No refresh token rotation implemented.

---

# ⚠ Trade-offs & Limitations

- No refresh token system
- No soft deletion for audit history
- No granular permissions beyond two roles
- Invite tokens cannot be manually revoked
- No attachment uploads
- No audit export
- No production Docker setup
- No horizontal scaling for WebSocket layer

---

# 🧠 Potential Improvements

- Role hierarchy (Viewer role)
- Soft delete system
- Email notifications
- Refresh token rotation
- Docker support
- Redis for WebSocket scaling
- Activity filtering & search
- Board settings management
- Unit & integration test coverage expansion

---

# 🎯 Key Technical Highlights

- End-to-end TypeScript
- Real-time collaboration
- Cursor-based infinite scroll
- SSR authentication handling
- Structured activity logging
- Database indexing optimization
- Clean layered backend architecture
- Modern Next.js App Router usage
- TanStack Query advanced caching
- Role-based access enforcement
