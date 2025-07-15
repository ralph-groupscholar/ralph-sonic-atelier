const { randomUUID } = require("crypto");
const { ensureSchema, getPool, tableRef } = require("../api/lib/db");

const seedSessions = [
  {
    sceneName: "Ember Drift",
    root: "F",
    mode: "Dorian",
    tempo: 78,
    density: 3,
    length: 10,
    energy: 32,
    accent: 24,
    humanize: 16,
    texture: 58,
    atmosphere: 62,
    swing: 12,
    mood: "Smoldering",
    notes: "Soft ember glow with slow arc phrases.",
  },
  {
    sceneName: "Lumen Pulse",
    root: "A",
    mode: "Mixolydian",
    tempo: 124,
    density: 6,
    length: 8,
    energy: 68,
    accent: 38,
    humanize: 10,
    texture: 35,
    atmosphere: 28,
    swing: 22,
    mood: "Electric",
    notes: "Bright staccato with lifted swing.",
  },
  {
    sceneName: "Silver Tide",
    root: "D",
    mode: "Lydian",
    tempo: 96,
    density: 4,
    length: 12,
    energy: 42,
    accent: 28,
    humanize: 14,
    texture: 50,
    atmosphere: 70,
    swing: 8,
    mood: "Reflective",
    notes: "Long shoreline pulses and shimmering decay.",
  },
  {
    sceneName: "Noon Signal",
    root: "C",
    mode: "Ionian",
    tempo: 112,
    density: 5,
    length: 8,
    energy: 55,
    accent: 34,
    humanize: 12,
    texture: 30,
    atmosphere: 35,
    swing: 18,
    mood: "Focused",
    notes: "Steady daytime cadence with minimal haze.",
  },
  {
    sceneName: "Copper Bloom",
    root: "G",
    mode: "Aeolian",
    tempo: 88,
    density: 4,
    length: 14,
    energy: 48,
    accent: 26,
    humanize: 18,
    texture: 64,
    atmosphere: 58,
    swing: 10,
    mood: "Warm",
    notes: "Low drone and humid texture bed.",
  },
];

async function seed() {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM ${tableRef};`);

  if (rows[0].count > 0) {
    console.log("Seed skipped: sessions already present.");
    await pool.end();
    return;
  }

  const insertText = `
    INSERT INTO ${tableRef}
    (id, scene_name, root, mode, tempo, density, length, energy, accent, humanize, texture, atmosphere, swing, mood, notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);
  `;

  for (const session of seedSessions) {
    const values = [
      randomUUID(),
      session.sceneName,
      session.root,
      session.mode,
      session.tempo,
      session.density,
      session.length,
      session.energy,
      session.accent,
      session.humanize,
      session.texture,
      session.atmosphere,
      session.swing,
      session.mood,
      session.notes,
    ];
    await pool.query(insertText, values);
  }

  console.log(`Seeded ${seedSessions.length} Sonic Atelier sessions.`);
  await pool.end();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
