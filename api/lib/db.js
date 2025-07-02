const { Pool } = require("pg");

const SCHEMA = "ralph_sonic_atelier";
const TABLE = "sessions";
const CLOUD_TABLE = "cloud_scenes";
const tableRef = `"${SCHEMA}"."${TABLE}"`;
const cloudTableRef = `"${SCHEMA}"."${CLOUD_TABLE}"`;

let pool;
let initialized = false;

function getConfig() {
  const sslEnabled = process.env.SONIC_ATELIER_DB_SSL === "true";
  return {
    host: process.env.SONIC_ATELIER_DB_HOST,
    port: Number(process.env.SONIC_ATELIER_DB_PORT || 5432),
    user: process.env.SONIC_ATELIER_DB_USER,
    password: process.env.SONIC_ATELIER_DB_PASSWORD,
    database: process.env.SONIC_ATELIER_DB_NAME,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  };
}

function getPool() {
  if (!pool) {
    pool = new Pool(getConfig());
  }
  return pool;
}

async function ensureSchema() {
  if (initialized) return;
  const poolInstance = getPool();
  await poolInstance.query(`CREATE SCHEMA IF NOT EXISTS "${SCHEMA}";`);
  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS ${tableRef} (
      id uuid PRIMARY KEY,
      scene_name text NOT NULL,
      root text NOT NULL,
      mode text NOT NULL,
      tempo integer NOT NULL,
      density integer NOT NULL,
      length integer NOT NULL,
      energy integer NOT NULL,
      accent integer NOT NULL,
      humanize integer NOT NULL,
      texture integer NOT NULL,
      atmosphere integer NOT NULL,
      swing integer NOT NULL,
      mood text NOT NULL,
      notes text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await poolInstance.query(`
    CREATE TABLE IF NOT EXISTS ${cloudTableRef} (
      id bigserial PRIMARY KEY,
      name text NOT NULL,
      settings jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await poolInstance.query(
    `CREATE INDEX IF NOT EXISTS ${TABLE}_created_at_idx ON ${tableRef} (created_at DESC);`
  );
  await poolInstance.query(
    `CREATE INDEX IF NOT EXISTS ${CLOUD_TABLE}_created_at_idx ON ${cloudTableRef} (created_at DESC);`
  );
  await poolInstance.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS ${CLOUD_TABLE}_unique_idx ON ${cloudTableRef} (name, settings);`
  );
  initialized = true;
}

module.exports = {
  SCHEMA,
  TABLE,
  CLOUD_TABLE,
  tableRef,
  cloudTableRef,
  getPool,
  ensureSchema,
};
