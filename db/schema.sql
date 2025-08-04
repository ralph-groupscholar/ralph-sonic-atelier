CREATE SCHEMA IF NOT EXISTS ralph_sonic_atelier;

CREATE TABLE IF NOT EXISTS ralph_sonic_atelier.sessions (
  id UUID PRIMARY KEY,
  scene_name TEXT NOT NULL,
  root TEXT NOT NULL,
  mode TEXT NOT NULL,
  tempo INTEGER NOT NULL,
  density INTEGER NOT NULL,
  length INTEGER NOT NULL,
  energy INTEGER NOT NULL,
  accent INTEGER NOT NULL,
  humanize INTEGER NOT NULL,
  texture INTEGER NOT NULL,
  atmosphere INTEGER NOT NULL,
  swing INTEGER NOT NULL,
  mood TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ralph_sonic_atelier.cloud_scenes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, settings)
);

CREATE TABLE IF NOT EXISTS ralph_sonic_atelier.set_runs (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER NOT NULL,
  scene_count INTEGER NOT NULL,
  looped BOOLEAN NOT NULL DEFAULT FALSE,
  setlist JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_created_at_idx
  ON ralph_sonic_atelier.sessions (created_at DESC);

CREATE INDEX IF NOT EXISTS cloud_scenes_created_at_idx
  ON ralph_sonic_atelier.cloud_scenes (created_at DESC);

CREATE INDEX IF NOT EXISTS set_runs_created_at_idx
  ON ralph_sonic_atelier.set_runs (created_at DESC);
