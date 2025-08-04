const { randomUUID } = require("crypto");
const { ensureSchema, getPool, setRunsTableRef } = require("./lib/db");

function parseBody(req) {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }
  return req.body;
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

function parseTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const limit = Math.min(Math.max(toInt(req.query?.limit || 5, 5), 1), 12);
      const { rows } = await pool.query(
        `SELECT id, status, started_at, ended_at, duration_seconds, scene_count, looped, setlist, created_at
         FROM ${setRunsTableRef}
         ORDER BY created_at DESC
         LIMIT $1;`,
        [limit]
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ runs: rows }));
      return;
    }

    if (req.method === "POST") {
      const payload = parseBody(req);
      if (!payload) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing payload." }));
        return;
      }

      const startedAt = parseTimestamp(payload.startedAt);
      const endedAt = parseTimestamp(payload.endedAt);
      const durationSeconds = toInt(payload.durationSeconds, 0);
      const sceneCount = toInt(payload.sceneCount, 0);
      const setlist = Array.isArray(payload.setlist) ? payload.setlist : null;
      const status = typeof payload.status === "string" ? payload.status : "Completed";

      if (!startedAt || !endedAt || durationSeconds <= 0 || sceneCount <= 0 || !setlist) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing required set run fields." }));
        return;
      }

      const id = randomUUID();
      const values = [
        id,
        status,
        startedAt.toISOString(),
        endedAt.toISOString(),
        durationSeconds,
        sceneCount,
        toBool(payload.looped),
        JSON.stringify(setlist),
      ];

      await pool.query(
        `INSERT INTO ${setRunsTableRef}
         (id, status, started_at, ended_at, duration_seconds, scene_count, looped, setlist)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,
        values
      );

      res.statusCode = 201;
      res.end(JSON.stringify({ id }));
      return;
    }

    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed." }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Server error", details: error.message }));
  }
};
