# Task List Frontend

React + Vite frontend for the task list project.

## Requirements

- Node.js
- Rails backend running at the URL configured in `.env`

## Run

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

Vite proxies `/api` requests to the Rails backend, so the task list screen calls:

```text
GET /api/v1/tasks
GET /api/v1/tasks?due_by_today=true
```

## Environment

```bash
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:3000
```
