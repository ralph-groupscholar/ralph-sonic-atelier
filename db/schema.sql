CREATE SCHEMA IF NOT EXISTS ralph_sonic_atelier;

CREATE TABLE IF NOT EXISTS ralph_sonic_atelier.cloud_scenes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, settings)
);

CREATE INDEX IF NOT EXISTS cloud_scenes_created_at_idx
  ON ralph_sonic_atelier.cloud_scenes (created_at DESC);
