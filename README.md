# 90-Day Bank Exam Streak Tracker

A focused, single-student MERN habit tracker for a 90-day bank exam preparation sprint. Daily success is derived automatically from recurring study-task completion.

## Run locally

1. Copy `server/.env.example` to `server/.env` and configure MongoDB/JWT.
2. Copy `client/.env.example` to `client/.env` if the API is not at `/api`.
3. Run `npm install`, then `npm run install:all`.
4. Start both apps with `npm run dev`.

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Structure

```text
client/   React, Vite, Tailwind, Framer Motion, Recharts, React Calendar
server/   Express, MongoDB/Mongoose, JWT auth, daily progress service
```

## Task and progress API

- `POST /api/tasks` — create a recurring task
- `PATCH /api/tasks/:id` — update task details
- `DELETE /api/tasks/:id` — archive a task while preserving history
- `PATCH /api/tasks/:id/completion` — complete or undo a task for a date
- `GET /api/tasks/day/:date` — inspect a calendar day's task breakdown
- `GET /api/progress/dashboard` — task metrics, streaks, statuses, charts, and achievements

Task definitions are stored in `tasks`; daily task results are stored in `taskcompletions`. A day becomes successful only when all tasks active on that date are complete.

## Production

Run `npm run build`, set `NODE_ENV=production`, and start with `npm start`. The Express server serves `client/dist` when present.
