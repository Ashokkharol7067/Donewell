# Donewell Task Manager

A full-stack task management system. Users can create an account, manage their own tasks, filter and search their list, and see dashboard statistics.

## Stack

- Frontend: React 19, Vite, React Router, Axios, Context API, responsive CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, CORS

## Structure

```text
backend/
  config/ db.js
  controllers/ authController.js taskController.js dashboardController.js
  middleware/ authMiddleware.js errorMiddleware.js
  models/ User.js Task.js
  routes/ authRoutes.js taskRoutes.js dashboardRoutes.js
  services/ dashboardService.js
  utils/ generateToken.js
  server.js
frontend/
  src/api.js
  src/context/AuthContext.jsx
  src/components/
  src/pages/
```

## Setup

1. Create a MongoDB Atlas cluster and copy its connection string.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` to the Atlas connection string and choose a strong `JWT_SECRET`.
3. Copy `frontend/.env.example` to `frontend/.env` if the API is not at the default URL.
4. Install dependencies with `npm install` inside both `backend` and `frontend`.

Run in two terminals:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Open `http://localhost:5173`.

## Environment

Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.
Frontend: `VITE_API_URL`.

## API

- `POST /api/auth/register` create an account
- `POST /api/auth/login` sign in
- `GET /api/auth/me` get the current user
- `POST /api/tasks` create a task
- `GET /api/tasks` list tasks with `status`, `priority`, `search`, `sort`, `page`, and `limit`
- `GET /api/tasks/:id` get one task
- `PUT /api/tasks/:id` update or complete a task
- `DELETE /api/tasks/:id` delete a task
- `GET /api/dashboard/stats` get totals and tasks due within seven days
- `GET /api/health` health check

Authenticated endpoints require `Authorization: Bearer <token>`. The API always scopes task queries by the authenticated user's id, so a user cannot access another user's tasks. Passwords are bcrypt-hashed and excluded from responses. Logout is handled client-side by removing the stored token.
