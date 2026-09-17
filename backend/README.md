# Buzzer backend

The backend uses Express and Socket.IO for the live buzzer flow, with MongoDB persisting rooms, team scores, and the current buzzer state across server restarts.

## Setup

1. Copy `.env.example` to `.env` if an environment file does not already exist.
2. Set `MONGODB_URI` to a local MongoDB or MongoDB Atlas connection string. Do not commit this value.
3. Optionally set `MONGODB_DB`; it defaults to `buzzer`.
4. Install dependencies with `npm install` and start the server with `npm start`.

The supported local setup uses these origins and ports:

- Team client: `http://localhost:5173`
- Admin client: `http://localhost:5174`
- API and Socket.IO server: `http://localhost:3000`

The health endpoint is available at `GET /health`. Run `npm test` for the HTTP health-check smoke test.

## Persisted data

- `rooms` stores each room's status and current buzzed team.
- `teams` stores a unique, case-insensitive team identity and its score for each room.

The first accepted buzz is written atomically, so simultaneous team clicks still produce one winner. Scores and buzzer state remain after a reconnect or backend restart.
