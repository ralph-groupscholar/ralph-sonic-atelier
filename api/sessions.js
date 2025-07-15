const { randomUUID } = require("crypto");
const { ensureSchema, getPool, tableRef } = require("./lib/db");

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

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const limit = Math.min(Math.max(toInt(req.query?.limit || 6, 6), 1), 20);
      const { rows } = await pool.query(
        `SELECT id, scene_name, root, mode, tempo, density, length, energy, texture, atmosphere, swing, mood, notes, created_at
         FROM ${tableRef}
         ORDER BY created_at DESC
         LIMIT $1;`,
        [limit]
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ sessions: rows }));
      return;
    }

    if (req.method === "POST") {
      const payload = parseBody(req);
      if (!payload || !payload.sceneName || !payload.root || !payload.mode) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing required session fields." }));
        return;
      }

      const id = randomUUID();
      const values = [
        id,
        payload.sceneName,
        payload.root,
        payload.mode,
        toInt(payload.tempo, 100),
        toInt(payload.density, 4),
        toInt(payload.length, 8),
        toInt(payload.energy, 40),
        toInt(payload.accent, 30),
        toInt(payload.humanize, 10),
        toInt(payload.texture, 45),
        toInt(payload.atmosphere, 35),
        toInt(payload.swing, 15),
        payload.mood || "Balanced Drift",
        payload.notes || null,
      ];

      await pool.query(
        `INSERT INTO ${tableRef}
         (id, scene_name, root, mode, tempo, density, length, energy, accent, humanize, texture, atmosphere, swing, mood, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);`,
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
