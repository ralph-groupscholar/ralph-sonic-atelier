INSERT INTO ralph_sonic_atelier.cloud_scenes (name, settings)
VALUES
  (
    'Aurora Bloom',
    '{"tempo":88,"density":4,"energy":0.44,"accent":0.22,"humanize":14,"texture":0.52,"atmosphere":0.58,"swing":0.16,"length":10,"root":"D","mode":"Dorian","droneLevel":0.18}'::jsonb
  ),
  (
    'Crimson Orbit',
    '{"tempo":118,"density":6,"energy":0.66,"accent":0.38,"humanize":10,"texture":0.34,"atmosphere":0.4,"swing":0.2,"length":8,"root":"A","mode":"Mixolydian","droneLevel":0.12}'::jsonb
  ),
  (
    'Glass Tides',
    '{"tempo":96,"density":3,"energy":0.36,"accent":0.2,"humanize":18,"texture":0.6,"atmosphere":0.7,"swing":0.08,"length":12,"root":"F","mode":"Lydian","droneLevel":0.22}'::jsonb
  ),
  (
    'Nocturne Path',
    '{"tempo":72,"density":2,"energy":0.28,"accent":0.18,"humanize":20,"texture":0.46,"atmosphere":0.76,"swing":0.12,"length":14,"root":"C","mode":"Aeolian","droneLevel":0.26}'::jsonb
  ),
  (
    'Sunlit Run',
    '{"tempo":132,"density":7,"energy":0.72,"accent":0.42,"humanize":8,"texture":0.28,"atmosphere":0.32,"swing":0.24,"length":8,"root":"G","mode":"Ionian","droneLevel":0.1}'::jsonb
  )
ON CONFLICT DO NOTHING;

INSERT INTO ralph_sonic_atelier.sessions
  (id, scene_name, root, mode, tempo, density, length, energy, accent, humanize, texture, atmosphere, swing, mood, notes)
VALUES
  (
    '4f4a9d98-36d4-4c3b-b5d6-2d3a1b9a1e01',
    'Ember Drift',
    'F',
    'Dorian',
    78,
    3,
    10,
    32,
    24,
    16,
    58,
    62,
    12,
    'Smoldering',
    'Soft ember glow with slow arc phrases.'
  ),
  (
    '9a50c4c0-b1a8-4a7a-8a5e-9a25f4d7aa02',
    'Lumen Pulse',
    'A',
    'Mixolydian',
    124,
    6,
    8,
    68,
    38,
    10,
    35,
    28,
    22,
    'Electric',
    'Bright staccato with lifted swing.'
  ),
  (
    'e0e40c7f-9bb3-4d91-9d2d-0b3cc2d53e03',
    'Silver Tide',
    'D',
    'Lydian',
    96,
    4,
    12,
    42,
    28,
    14,
    50,
    70,
    8,
    'Reflective',
    'Long shoreline pulses and shimmering decay.'
  );

INSERT INTO ralph_sonic_atelier.set_runs
  (id, status, started_at, ended_at, duration_seconds, scene_count, looped, setlist)
VALUES
  (
    '2b9a9a6f-1e74-4a7b-bc0d-6e5b7c8dfc11',
    'Completed',
    '2026-02-07T19:42:00Z',
    '2026-02-07T19:49:12Z',
    432,
    4,
    false,
    '[{"name":"Ember Drift","root":"F","mode":"Dorian","tempo":78},{"name":"Lumen Pulse","root":"A","mode":"Mixolydian","tempo":124},{"name":"Silver Tide","root":"D","mode":"Lydian","tempo":96},{"name":"Noon Signal","root":"C","mode":"Ionian","tempo":112}]'::jsonb
  ),
  (
    '5d3c2a5b-4b56-4fb6-8f07-30a0b1c7af12',
    'Stopped',
    '2026-02-07T21:05:00Z',
    '2026-02-07T21:08:05Z',
    185,
    3,
    true,
    '[{"name":"Copper Bloom","root":"G","mode":"Aeolian","tempo":88},{"name":"Aurora Bloom","root":"D","mode":"Dorian","tempo":88},{"name":"Sunlit Run","root":"G","mode":"Ionian","tempo":132}]'::jsonb
  );
