const { getPool, ensureSchema } = require("./lib/db");

const SCHEMA = "ralph_sonic_atelier";
const TABLE = "cloud_scenes";
const tableRef = `"${SCHEMA}"."${TABLE}"`;
const MAX_SCENES = 12;
const MAX_INSERT = 8;

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch (error) {
    return {};
  }
}

function sanitizeScenes(rawScenes) {
  if (!Array.isArray(rawScenes)) return [];
  return rawScenes
    .map((scene) => ({
      name: typeof scene?.name === "string" ? scene.name.trim() : "",
      settings: scene?.settings && typeof scene.settings === "object" ? scene.settings : null,
    }))
    .filter((scene) => scene.name.length > 0 && scene.settings);
}

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === "GET") {
      const result = await pool.query(
        `SELECT id, name, settings, created_at
         FROM ${tableRef}
         ORDER BY created_at DESC
         LIMIT $1`,
        [MAX_SCENES]
      );
      res.status(200).json({ scenes: result.rows });
      return;
    }

    if (req.method === "POST") {
      const payload = parseBody(req);
      const scenes = sanitizeScenes(payload.scenes).slice(0, MAX_INSERT);
      if (scenes.length === 0) {
        res.status(400).json({ error: "No scenes provided." });
        return;
      }

      const values = [];
      const placeholders = scenes
        .map((scene, index) => {
          const offset = index * 2;
          values.push(scene.name, JSON.stringify(scene.settings));
          return `($${offset + 1}, $${offset + 2}::jsonb)`;
        })
        .join(", ");

      const result = await pool.query(
        `INSERT INTO ${tableRef} (name, settings)
         VALUES ${placeholders}
         ON CONFLICT DO NOTHING`,
        values
      );

      res.status(200).json({ inserted: result.rowCount });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    res.status(500).json({ error: "Database request failed." });
  }
};
