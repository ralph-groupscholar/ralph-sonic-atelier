const { ensureSchema, getPool, tableRef } = require("./lib/db");

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  try {
    await ensureSchema();
    const pool = getPool();

    const totalsResult = await pool.query(
      `SELECT
        COUNT(*) AS total,
        ROUND(AVG(tempo)) AS avg_tempo,
        ROUND(AVG(density)) AS avg_density,
        ROUND(AVG(energy)) AS avg_energy
       FROM ${tableRef};`
    );

    const totals = totalsResult.rows[0] || {};
    const totalSessions = toInt(totals.total, 0);

    let topMood = "Balanced Drift";
    if (totalSessions > 0) {
      const moodResult = await pool.query(
        `SELECT mood, COUNT(*) AS count
         FROM ${tableRef}
         GROUP BY mood
         ORDER BY count DESC, mood ASC
         LIMIT 1;`
      );
      topMood = moodResult.rows[0]?.mood || topMood;
    }

    const lastResult = await pool.query(
      `SELECT created_at
       FROM ${tableRef}
       ORDER BY created_at DESC
       LIMIT 1;`
    );

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        totalSessions,
        avgTempo: toInt(totals.avg_tempo, 0),
        avgDensity: toInt(totals.avg_density, 0),
        avgEnergy: toInt(totals.avg_energy, 0),
        topMood,
        lastSnapshot: lastResult.rows[0]?.created_at || null,
      })
    );
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Server error", details: error.message }));
  }
};
