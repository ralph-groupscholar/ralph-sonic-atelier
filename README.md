# Ralph Sonic Atelier

A generative music sketchbook and visual instrument dashboard.

## Run

Open `index.html` in a browser. Press **Start Session** to enable audio.

## Cloud + Ledger

This project ships Vercel serverless functions for cloud scene syncing and the shared studio ledger.

Required environment variables (set via `vercel env add`):
- `SONIC_ATELIER_DB_HOST`
- `SONIC_ATELIER_DB_PORT`
- `SONIC_ATELIER_DB_USER`
- `SONIC_ATELIER_DB_PASSWORD`
- `SONIC_ATELIER_DB_NAME`
- `SONIC_ATELIER_DB_SSL` (set to `false` when the server does not support SSL)

## Cloud Scenes

The cloud library is backed by PostgreSQL and exposed via `api/scenes.js`.
Schema helpers live in `api/lib/db.js` and auto-create tables on first request.
