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
