const ui = {
  toggleAudio: document.getElementById("toggleAudio"),
  randomize: document.getElementById("randomize"),
  tempo: document.getElementById("tempo"),
  tempoValue: document.getElementById("tempoValue"),
  density: document.getElementById("density"),
  densityValue: document.getElementById("densityValue"),
  energy: document.getElementById("energy"),
  energyValue: document.getElementById("energyValue"),
  accent: document.getElementById("accent"),
  accentValue: document.getElementById("accentValue"),
  humanize: document.getElementById("humanize"),
  humanizeValue: document.getElementById("humanizeValue"),
  texture: document.getElementById("texture"),
  textureValue: document.getElementById("textureValue"),
  atmosphere: document.getElementById("atmosphere"),
  atmosphereValue: document.getElementById("atmosphereValue"),
  swing: document.getElementById("swing"),
  swingValue: document.getElementById("swingValue"),
  length: document.getElementById("length"),
  lengthValue: document.getElementById("lengthValue"),
  drone: document.getElementById("drone"),
  droneValue: document.getElementById("droneValue"),
  rootButtons: document.getElementById("rootButtons"),
  modeButtons: document.getElementById("modeButtons"),
  toggleTexture: document.getElementById("toggleTexture"),
  toggleDrone: document.getElementById("toggleDrone"),
  toggleVisuals: document.getElementById("toggleVisuals"),
  presetButtons: document.getElementById("presetButtons"),
  sceneName: document.getElementById("sceneName"),
  saveScene: document.getElementById("saveScene"),
  savedScenes: document.getElementById("savedScenes"),
  syncCloud: document.getElementById("syncCloud"),
  refreshCloud: document.getElementById("refreshCloud"),
  cloudStatus: document.getElementById("cloudStatus"),
  cloudScenes: document.getElementById("cloudScenes"),
  cloudSearch: document.getElementById("cloudSearch"),
  cloudMoodFilter: document.getElementById("cloudMoodFilter"),
  setDuration: document.getElementById("setDuration"),
  setDurationValue: document.getElementById("setDurationValue"),
  queueCurrent: document.getElementById("queueCurrent"),
  startSet: document.getElementById("startSet"),
  stopSet: document.getElementById("stopSet"),
  advanceSet: document.getElementById("advanceSet"),
  toggleSetLoop: document.getElementById("toggleSetLoop"),
  toggleAutoSnapshot: document.getElementById("toggleAutoSnapshot"),
  setStatus: document.getElementById("setStatus"),
  setList: document.getElementById("setList"),
  setRunStatus: document.getElementById("setRunStatus"),
  setRunList: document.getElementById("setRunList"),
  recordSession: document.getElementById("recordSession"),
  ledgerList: document.getElementById("ledgerList"),
  insightList: document.getElementById("insightList"),
  sessionNotes: document.getElementById("sessionNotes"),
  moodOverride: document.getElementById("moodOverride"),
  toggleDrift: document.getElementById("toggleDrift"),
  driftRate: document.getElementById("driftRate"),
  driftRateValue: document.getElementById("driftRateValue"),
  driftRange: document.getElementById("driftRange"),
  driftRangeValue: document.getElementById("driftRangeValue"),
  morphIntensity: document.getElementById("morphIntensity"),
  morphIntensityValue: document.getElementById("morphIntensityValue"),
  evolveMotif: document.getElementById("evolveMotif"),
  status: document.getElementById("status"),
  motifList: document.getElementById("motifList"),
  stepMonitor: document.getElementById("stepMonitor"),
  sessionLog: document.getElementById("sessionLog"),
  clearLog: document.getElementById("clearLog"),
  canvas: document.getElementById("canvas"),
};

const state = {
  isPlaying: false,
  tempo: Number(ui.tempo.value),
  density: Number(ui.density.value),
  energy: Number(ui.energy.value) / 100,
  accent: Number(ui.accent.value) / 100,
  humanize: Number(ui.humanize.value),
  texture: Number(ui.texture.value) / 100,
  atmosphere: Number(ui.atmosphere.value) / 100,
  swing: Number(ui.swing.value) / 100,
  length: Number(ui.length.value),
  root: "C",
  mode: "Dorian",
  textureEnabled: true,
  droneEnabled: false,
  droneLevel: Number(ui.drone.value) / 100,
  driftEnabled: false,
  driftRate: Number(ui.driftRate.value),
  driftRange: Number(ui.driftRange.value) / 100,
  morphIntensity: Number(ui.morphIntensity.value) / 100,
  visualsEnabled: true,
  sequence: [],
};

const roots = ["C", "D", "E", "F", "G", "A", "B"];
const modes = {
  Ionian: [0, 2, 4, 5, 7, 9, 11],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Aeolian: [0, 2, 3, 5, 7, 8, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
};
const rootOffsets = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const storageKey = "sonicAtelierScenes";
const setStorageKey = "sonicAtelierSetlist";
const maxSavedScenes = 8;
const maxSetItems = 6;
const cloudApi = "/api/scenes";
const ledgerApi = "/api/sessions";
const insightsApi = "/api/insights";
const setRunsApi = "/api/set-runs";
const presets = [
  {
    name: "Ember Drift",
    settings: {
      tempo: 78,
      density: 3,
      energy: 0.32,
      texture: 0.58,
      atmosphere: 0.62,
      swing: 0.12,
      length: 10,
      root: "F",
      mode: "Dorian",
    },
  },
  {
    name: "Lumen Pulse",
    settings: {
      tempo: 124,
      density: 6,
      energy: 0.68,
      texture: 0.35,
      atmosphere: 0.28,
      swing: 0.22,
      length: 8,
      root: "A",
      mode: "Mixolydian",
    },
  },
  {
    name: "Silver Tide",
    settings: {
      tempo: 96,
      density: 4,
      energy: 0.42,
      texture: 0.5,
      atmosphere: 0.7,
      swing: 0.08,
      length: 12,
      root: "D",
      mode: "Lydian",
    },
  },
  {
    name: "Noon Signal",
    settings: {
      tempo: 112,
      density: 5,
      energy: 0.55,
      texture: 0.3,
      atmosphere: 0.35,
      swing: 0.18,
      length: 8,
      root: "C",
      mode: "Ionian",
    },
  },
];

let audioCtx = null;
let masterGain = null;
let dryGain = null;
let wetGain = null;
let delay = null;
let feedback = null;
let droneOsc = null;
let droneGain = null;
let droneFilter = null;
let timerId = null;
let nextStepTime = 0;
let currentStep = 0;
let noiseBuffer = null;
let driftTimer = null;

const canvas = ui.canvas;
const ctx = canvas.getContext("2d");
const pulses = [];
const canvasSize = { width: canvas.width, height: canvas.height };
const particleField = Array.from({ length: 60 }, (_, index) => ({
  x: Math.random() * canvasSize.width,
  y: Math.random() * canvasSize.height,
  radius: 1 + Math.random() * 2,
  drift: 0.2 + Math.random() * 0.6,
  hue: 30 + index,
}));
const sessionLog = [];
const maxLogEntries = 10;
let ledgerEntries = [];
let ledgerStatus = "idle";
let insightsStatus = "idle";
let insightsData = null;
let snapshotInFlight = false;
let setRuns = [];
let setRunsStatus = "idle";
let cloudScenes = [];
let setQueue = [];
const setState = {
  running: false,
  duration: ui.setDuration ? Number(ui.setDuration.value) : 60,
  loop: false,
  autoSnapshot: false,
  currentIndex: 0,
  timerId: null,
  runStartedAt: null,
};

function updateOutputs() {
  ui.tempoValue.textContent = `${state.tempo} BPM`;
  ui.densityValue.textContent = `${state.density} Notes`;
  ui.energyValue.textContent = `${Math.round(state.energy * 100)}%`;
  ui.accentValue.textContent = `${Math.round(state.accent * 100)}%`;
  ui.humanizeValue.textContent = `${Math.round(state.humanize)} ms`;
  ui.textureValue.textContent = `${Math.round(state.texture * 100)}%`;
  ui.atmosphereValue.textContent = `${Math.round(state.atmosphere * 100)}%`;
  ui.swingValue.textContent = `${Math.round(state.swing * 100)}%`;
  ui.lengthValue.textContent = `${state.length} Steps`;
  ui.droneValue.textContent = `${Math.round(state.droneLevel * 100)}%`;
  ui.driftRateValue.textContent = `${state.driftRate}s`;
  ui.driftRangeValue.textContent = `${Math.round(state.driftRange * 100)}%`;
  ui.morphIntensityValue.textContent = `${Math.round(state.morphIntensity * 100)}%`;
  if (ui.setDurationValue) {
    ui.setDurationValue.textContent = `${setState.duration}s`;
  }
}

function updateStatus(message) {
  ui.status.textContent = message;
}

function addLogEntry(message) {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  sessionLog.unshift({ message, timestamp });
  if (sessionLog.length > maxLogEntries) {
    sessionLog.pop();
  }
  renderSessionLog();
}

function renderSessionLog() {
  if (!ui.sessionLog) return;
  ui.sessionLog.innerHTML = "";
  if (sessionLog.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No session events yet.";
    empty.className = "empty";
    ui.sessionLog.appendChild(empty);
    return;
  }
  sessionLog.forEach((entry) => {
    const item = document.createElement("li");
    const time = document.createElement("span");
    const text = document.createElement("span");
    time.className = "log-time";
    text.className = "log-text";
    time.textContent = entry.timestamp;
    text.textContent = entry.message;
    item.appendChild(time);
    item.appendChild(text);
    ui.sessionLog.appendChild(item);
  });
}

function formatLedgerTimestamp(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatInsightsTimestamp(timestamp) {
  if (!timestamp) return "No snapshots yet.";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Awaiting new snapshots.";
  return `Last snapshot: ${date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function buildMoodLabel() {
  const warmth = state.texture + state.atmosphere;
  if (state.energy > 0.6 && warmth < 0.8) return "Electric Focus";
  if (state.energy < 0.4 && warmth > 1.1) return "Ambient Bloom";
  if (state.swing > 0.25 && state.energy > 0.5) return "Rhythmic Pulse";
  if (state.energy < 0.35) return "Soft Drift";
  return "Balanced Drift";
}

function normalizeLevel(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric > 1) return numeric / 100;
  return numeric;
}

function buildMoodLabelFromSettings(settings) {
  const energy = normalizeLevel(settings?.energy);
  const texture = normalizeLevel(settings?.texture);
  const atmosphere = normalizeLevel(settings?.atmosphere);
  const swing = normalizeLevel(settings?.swing);
  const warmth = texture + atmosphere;
  if (energy > 0.6 && warmth < 0.8) return "Electric Focus";
  if (energy < 0.4 && warmth > 1.1) return "Ambient Bloom";
  if (swing > 0.25 && energy > 0.5) return "Rhythmic Pulse";
  if (energy < 0.35) return "Soft Drift";
  return "Balanced Drift";
}

function formatCloudTimestamp(timestamp) {
  if (!timestamp) return "Unknown time";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60 * 1000) return "Just now";
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 1000))}m ago`;
  if (diffMs < 24 * 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 60 * 1000))}h ago`;
  if (diffMs < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diffMs / (24 * 60 * 60 * 1000))}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getCloudFilters() {
  const searchTerm = ui.cloudSearch ? ui.cloudSearch.value.trim().toLowerCase() : "";
  const mood = ui.cloudMoodFilter ? ui.cloudMoodFilter.value : "any";
  const hasFilters = searchTerm.length > 0 || mood !== "any";
  return { searchTerm, mood, hasFilters };
}

function getFilteredCloudScenes() {
  const { searchTerm, mood, hasFilters } = getCloudFilters();
  let filtered = [...cloudScenes];
  if (searchTerm.length > 0) {
    filtered = filtered.filter((scene) => {
      const settings = scene.settings || {};
      const moodLabel = buildMoodLabelFromSettings(settings);
      const haystack = `${scene.name} ${settings.root || ""} ${settings.mode || ""} ${moodLabel}`
        .toLowerCase();
      return haystack.includes(searchTerm);
    });
  }
  if (mood !== "any") {
    filtered = filtered.filter((scene) => buildMoodLabelFromSettings(scene.settings || {}) === mood);
  }
  return { filtered, hasFilters };
}

function refreshCloudLibrary() {
  const { filtered, hasFilters } = getFilteredCloudScenes();
  renderCloudScenes(filtered, hasFilters);
}

function renderLedger() {
  if (!ui.ledgerList) return;
  ui.ledgerList.innerHTML = "";

  if (ledgerStatus === "loading") {
    const loading = document.createElement("li");
    loading.className = "ledger-empty";
    loading.textContent = "Syncing ledger...";
    ui.ledgerList.appendChild(loading);
    return;
  }

  if (ledgerStatus === "offline") {
    const offline = document.createElement("li");
    offline.className = "ledger-empty";
    offline.textContent = "Ledger offline. Deploy to sync snapshots.";
    ui.ledgerList.appendChild(offline);
    return;
  }

  if (ledgerEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "ledger-empty";
    empty.textContent = "No shared snapshots yet.";
    ui.ledgerList.appendChild(empty);
    return;
  }

  ledgerEntries.forEach((entry) => {
    const item = document.createElement("li");
    const header = document.createElement("div");
    const name = document.createElement("span");
    const time = document.createElement("span");
    const meta = document.createElement("div");
    const notes = document.createElement("div");

    item.className = "ledger-item";
    header.className = "ledger-header-row";
    meta.className = "ledger-meta";
    notes.className = "ledger-notes";

    name.textContent = entry.scene_name;
    time.textContent = formatLedgerTimestamp(entry.created_at);
    header.appendChild(name);
    header.appendChild(time);

    meta.textContent = `${entry.root} ${entry.mode} \u2022 ${entry.tempo} BPM \u2022 ${entry.mood}`;
    notes.textContent = entry.notes ? entry.notes : "No notes attached.";

    item.appendChild(header);
    item.appendChild(meta);
    item.appendChild(notes);
    ui.ledgerList.appendChild(item);
  });
}

function renderInsights() {
  if (!ui.insightList) return;
  ui.insightList.innerHTML = "";

  if (insightsStatus === "loading") {
    const loading = document.createElement("li");
    loading.className = "insight-empty";
    loading.textContent = "Syncing insights...";
    ui.insightList.appendChild(loading);
    return;
  }

  if (insightsStatus === "offline") {
    const offline = document.createElement("li");
    offline.className = "insight-empty";
    offline.textContent = "Insights offline. Deploy to unlock shared stats.";
    ui.insightList.appendChild(offline);
    return;
  }

  if (!insightsData || !insightsData.totalSessions) {
    const empty = document.createElement("li");
    empty.className = "insight-empty";
    empty.textContent = "Record a snapshot to populate shared insights.";
    ui.insightList.appendChild(empty);
    return;
  }

  const rows = [
    `Total snapshots: ${insightsData.totalSessions}`,
    `Avg tempo: ${insightsData.avgTempo} BPM`,
    `Avg density: ${insightsData.avgDensity} notes`,
    `Avg energy: ${insightsData.avgEnergy}%`,
    `Top mood: ${insightsData.topMood}`,
    formatInsightsTimestamp(insightsData.lastSnapshot),
  ];

  rows.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    ui.insightList.appendChild(item);
  });
}

async function fetchLedger() {
  if (!ui.ledgerList) return;
  ledgerStatus = "loading";
  renderLedger();
  try {
    const response = await fetch(`${ledgerApi}?limit=6`);
    if (!response.ok) throw new Error("Ledger unavailable");
    const data = await response.json();
    ledgerEntries = Array.isArray(data.sessions) ? data.sessions : [];
    ledgerStatus = "ready";
  } catch (error) {
    ledgerStatus = "offline";
  }
  renderLedger();
}

async function fetchInsights() {
  if (!ui.insightList) return;
  insightsStatus = "loading";
  renderInsights();
  try {
    const response = await fetch(insightsApi);
    if (!response.ok) throw new Error("Insights unavailable");
    const data = await response.json();
    insightsData = data && typeof data === "object" ? data : null;
    insightsStatus = "ready";
  } catch (error) {
    insightsStatus = "offline";
  }
  renderInsights();
}

async function recordSessionSnapshot() {
  if (!ui.recordSession) return;
  if (snapshotInFlight) {
    updateStatus("Snapshot already recording.");
    addLogEntry("Snapshot already recording.");
    return;
  }
  const sceneName = ui.sceneName.value.trim() || `Live ${state.root} ${state.mode}`;
  const noteText = ui.sessionNotes ? ui.sessionNotes.value.trim() : "";
  const moodOverride = ui.moodOverride ? ui.moodOverride.value : "auto";
  const notes = buildSnapshotNotes(noteText);
  const payload = buildSnapshotPayload({ sceneName, notes, moodOverride });
  await submitSnapshot(payload, {
    button: ui.recordSession,
    clearNotes: true,
    statusMessage: "Snapshot recorded in the studio ledger.",
    logMessage: "Snapshot recorded to shared ledger.",
    failureMessage: "Ledger offline. Snapshot not recorded.",
  });
}

function buildSnapshotNotes(noteText = "") {
  const runtimeNote = state.isPlaying ? "Recorded while live." : "Recorded while paused.";
  return noteText.length > 0 ? `${noteText} ${runtimeNote}` : runtimeNote;
}

function buildSnapshotPayload({ sceneName, notes, moodOverride }) {
  const moodSelection = moodOverride ?? "auto";
  const mood = moodSelection === "auto" ? buildMoodLabel() : moodSelection;
  return {
    sceneName,
    root: state.root,
    mode: state.mode,
    tempo: state.tempo,
    density: state.density,
    length: state.length,
    energy: Math.round(state.energy * 100),
    accent: Math.round(state.accent * 100),
    humanize: Math.round(state.humanize),
    texture: Math.round(state.texture * 100),
    atmosphere: Math.round(state.atmosphere * 100),
    swing: Math.round(state.swing * 100),
    mood,
    notes,
  };
}

async function submitSnapshot(payload, options = {}) {
  if (snapshotInFlight) return;
  snapshotInFlight = true;
  const {
    button,
    clearNotes = false,
    statusMessage = "Snapshot recorded.",
    logMessage = "Snapshot recorded.",
    failureMessage = "Snapshot failed.",
  } = options;
  if (button) {
    button.disabled = true;
    button.textContent = "Recording...";
  }
  try {
    const response = await fetch(ledgerApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Unable to record");
    updateStatus(statusMessage);
    addLogEntry(logMessage);
    if (clearNotes && ui.sessionNotes) {
      ui.sessionNotes.value = "";
    }
    await fetchLedger();
    await fetchInsights();
  } catch (error) {
    updateStatus(failureMessage);
    addLogEntry(failureMessage);
  } finally {
    snapshotInFlight = false;
    if (button) {
      button.disabled = false;
      button.textContent = "Record Snapshot";
    }
  }
}

async function recordAutoSnapshot(sceneName) {
  if (!sceneName) return;
  if (snapshotInFlight) return;
  const notes = `Auto snapshot from set conductor. ${buildSnapshotNotes()}`;
  const payload = buildSnapshotPayload({ sceneName, notes, moodOverride: "auto" });
  await submitSnapshot(payload, {
    statusMessage: `Auto snapshot recorded for ${sceneName}.`,
    logMessage: `Auto snapshot recorded for ${sceneName}.`,
    failureMessage: "Ledger offline. Auto snapshot skipped.",
  });
}

function createButtons(list, container, handler) {
  container.innerHTML = "";
  list.forEach((label) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.textContent = label;
    button.addEventListener("click", () => handler(label));
    container.appendChild(button);
  });
}

function createPresetButtons() {
  ui.presetButtons.innerHTML = "";
  presets.forEach((preset) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.textContent = preset.name;
    button.addEventListener("click", () => applySettings(preset.settings, true));
    ui.presetButtons.appendChild(button);
  });
}

function updateButtonStates() {
  [...ui.rootButtons.children].forEach((chip) => {
    chip.classList.toggle("active", chip.textContent === state.root);
  });
  [...ui.modeButtons.children].forEach((chip) => {
    chip.classList.toggle("active", chip.textContent === state.mode);
  });
}

function buildScale() {
  const rootOffset = rootOffsets[state.root] ?? 0;
  const intervals = modes[state.mode];
  return intervals.map((interval) => rootOffset + interval);
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function applySettings(settings, announce) {
  state.tempo = settings.tempo;
  state.density = settings.density;
  state.energy = settings.energy;
  state.accent = settings.accent ?? state.accent;
  state.humanize = settings.humanize ?? state.humanize;
  state.texture = settings.texture;
  state.atmosphere = settings.atmosphere;
  state.swing = settings.swing;
  state.length = settings.length;
  state.droneLevel = settings.droneLevel ?? state.droneLevel;
  state.morphIntensity = settings.morphIntensity ?? state.morphIntensity;
  state.root = settings.root;
  state.mode = settings.mode;

  ui.tempo.value = state.tempo;
  ui.density.value = state.density;
  ui.energy.value = Math.round(state.energy * 100);
  ui.accent.value = Math.round(state.accent * 100);
  ui.humanize.value = Math.round(state.humanize);
  ui.texture.value = Math.round(state.texture * 100);
  ui.atmosphere.value = Math.round(state.atmosphere * 100);
  ui.swing.value = Math.round(state.swing * 100);
  ui.length.value = state.length;
  ui.drone.value = Math.round(state.droneLevel * 100);
  ui.morphIntensity.value = Math.round(state.morphIntensity * 100);

  updateOutputs();
  updateButtonStates();
  generateSequence();
  applyAtmosphere();
  updateDroneParams();
  if (announce) {
    const message = `Scene set: ${settings.root} ${settings.mode}.`;
    updateStatus(message);
    addLogEntry(message);
  }
}

function generateSequence() {
  const scale = buildScale();
  const length = state.length;
  const steps = Array.from({ length }, () => null);
  const available = [...Array(length).keys()];
  const noteCount = Math.min(state.density, length);

  for (let i = 0; i < noteCount; i += 1) {
    const index = Math.floor(Math.random() * available.length);
    const step = available.splice(index, 1)[0];
    const degree = scale[Math.floor(Math.random() * scale.length)];
    const octave = 3 + Math.floor(Math.random() * 2);
    steps[step] = 12 * octave + degree;
  }

  state.sequence = steps;
  updateMotif();
  renderStepMonitor();
}

function evolveMotif() {
  if (!state.sequence.length) return;
  const scale = buildScale();
  const nextSequence = [...state.sequence];
  const intensity = clamp(state.morphIntensity, 0, 1);
  const mutations = Math.max(1, Math.round(intensity * nextSequence.length * 0.7));

  for (let i = 0; i < mutations; i += 1) {
    const step = Math.floor(Math.random() * nextSequence.length);
    const currentNote = nextSequence[step];
    const shouldRest = Math.random() < 0.2 + intensity * 0.35;

    if (shouldRest) {
      nextSequence[step] = null;
      continue;
    }

    const octave = currentNote ? Math.floor(currentNote / 12) : 3 + Math.floor(Math.random() * 2);
    const degree = scale[Math.floor(Math.random() * scale.length)];
    nextSequence[step] = 12 * octave + degree;
  }

  const desiredNotes = Math.min(state.density, nextSequence.length);
  let noteCount = nextSequence.filter((note) => note !== null).length;
  if (noteCount < desiredNotes) {
    const rests = nextSequence
      .map((note, index) => (note === null ? index : null))
      .filter((index) => index !== null);
    while (noteCount < desiredNotes && rests.length > 0) {
      const pickIndex = Math.floor(Math.random() * rests.length);
      const step = rests.splice(pickIndex, 1)[0];
      const degree = scale[Math.floor(Math.random() * scale.length)];
      const octave = 3 + Math.floor(Math.random() * 2);
      nextSequence[step] = 12 * octave + degree;
      noteCount += 1;
    }
  } else if (noteCount > desiredNotes) {
    const notes = nextSequence
      .map((note, index) => (note !== null ? index : null))
      .filter((index) => index !== null);
    while (noteCount > desiredNotes && notes.length > 0) {
      const pickIndex = Math.floor(Math.random() * notes.length);
      const step = notes.splice(pickIndex, 1)[0];
      nextSequence[step] = null;
      noteCount -= 1;
    }
  }

  state.sequence = nextSequence;
  updateMotif();
  renderStepMonitor();
  updateStatus("Motif evolved. New phrase ready.");
  addLogEntry("Motif evolved in the lab.");
}

function updateMotif() {
  ui.motifList.innerHTML = "";
  state.sequence.forEach((note, index) => {
    const item = document.createElement("li");
    item.textContent = note === null ? `Step ${index + 1}: Rest` : `Step ${index + 1}: MIDI ${note}`;
    ui.motifList.appendChild(item);
  });
}

function renderStepMonitor() {
  ui.stepMonitor.innerHTML = "";
  state.sequence.forEach((_, index) => {
    const step = document.createElement("div");
    step.className = "step-pill";
    step.dataset.index = String(index);
    ui.stepMonitor.appendChild(step);
  });
  setActiveStep(state.isPlaying ? currentStep : null);
}

function setActiveStep(index) {
  const children = [...ui.stepMonitor.children];
  children.forEach((child) => child.classList.remove("active", "hit"));
  if (index === null || index === undefined) return;
  const target = children[index];
  if (!target) return;
  target.classList.add("active", "hit");
  setTimeout(() => target.classList.remove("hit"), 140);
}

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.6;
  dryGain = audioCtx.createGain();
  wetGain = audioCtx.createGain();
  delay = audioCtx.createDelay(4.0);
  feedback = audioCtx.createGain();
  delay.delayTime.value = 0.45;
  feedback.gain.value = 0.35;
  dryGain.gain.value = 0.8;
  wetGain.gain.value = 0.25;

  masterGain.connect(dryGain);
  masterGain.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wetGain);

  dryGain.connect(audioCtx.destination);
  wetGain.connect(audioCtx.destination);

  noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
  const channel = noiseBuffer.getChannelData(0);
  for (let i = 0; i < channel.length; i += 1) {
    channel[i] = Math.random() * 2 - 1;
  }
}

function applyAtmosphere() {
  if (!delay || !feedback || !wetGain) return;
  delay.delayTime.setTargetAtTime(0.25 + state.atmosphere * 0.6, audioCtx.currentTime, 0.01);
  feedback.gain.setTargetAtTime(0.2 + state.atmosphere * 0.45, audioCtx.currentTime, 0.01);
  wetGain.gain.setTargetAtTime(0.15 + state.atmosphere * 0.4, audioCtx.currentTime, 0.01);
}

function updateDroneParams() {
  if (!droneOsc || !droneFilter || !droneGain || !audioCtx) return;
  const rootMidi = 36 + (rootOffsets[state.root] ?? 0);
  droneOsc.frequency.setTargetAtTime(midiToFrequency(rootMidi), audioCtx.currentTime, 0.01);
  droneFilter.frequency.setTargetAtTime(220 + state.energy * 520, audioCtx.currentTime, 0.02);
  const targetGain = state.droneEnabled ? state.droneLevel * 0.35 : 0.0001;
  droneGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.2);
}

function startDrone() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  if (!droneOsc) {
    droneOsc = audioCtx.createOscillator();
    droneGain = audioCtx.createGain();
    droneFilter = audioCtx.createBiquadFilter();
    droneOsc.type = "triangle";
    droneFilter.type = "lowpass";
    droneGain.gain.value = 0.0001;
    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(masterGain);
    droneOsc.start();
  }
  updateDroneParams();
}

function stopDrone() {
  if (!droneGain || !audioCtx) return;
  droneGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.15);
}

function playNote(note, time) {
  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "sawtooth";
  osc2.type = "triangle";

  const frequency = 440 * Math.pow(2, (note - 69) / 12);
  osc.frequency.setValueAtTime(frequency, time);
  osc2.frequency.setValueAtTime(frequency * 0.5, time);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600 + state.energy * 1800, time);
  filter.Q.value = 0.8 + state.texture * 4;

  const accentBoost = Math.random() < state.accent ? 0.22 : 0;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.3 + state.energy * 0.5 + accentBoost, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.5 + state.texture * 0.4);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc2.start(time);
  osc.stop(time + 1.2);
  osc2.stop(time + 1.2);

  if (state.textureEnabled && Math.random() < state.texture) {
    const noise = audioCtx.createBufferSource();
    const noiseFilter = audioCtx.createBiquadFilter();
    const noiseGain = audioCtx.createGain();

    noise.buffer = noiseBuffer;
    noise.loop = true;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(200 + state.texture * 900, time);
    noiseFilter.Q.value = 0.7 + state.texture * 3;

    noiseGain.gain.setValueAtTime(0.0001, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.08 + state.texture * 0.2, time + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(time);
    noise.stop(time + 0.45);
  }

  if (state.visualsEnabled) {
    const x = ((note % 12) / 12) * canvasSize.width;
    pulses.push({
      x,
      y: canvasSize.height * (0.2 + Math.random() * 0.6),
      radius: 12 + state.energy * 22 + accentBoost * 18,
      life: 1,
      hue: 35 + state.texture * 120,
    });
  }
}

function scheduleStep(step, time) {
  const note = state.sequence[step];
  if (note !== null) {
    const jitter = (Math.random() * 2 - 1) * (state.humanize / 1000);
    const scheduledTime = Math.max(time + jitter, audioCtx.currentTime + 0.001);
    playNote(note, scheduledTime);
  }
}

function nextStep() {
  const secondsPerBeat = 60 / state.tempo;
  const baseStep = secondsPerBeat / 2;
  const swingOffset = currentStep % 2 === 1 ? baseStep * state.swing : 0;
  nextStepTime += baseStep + swingOffset;
  currentStep = (currentStep + 1) % state.sequence.length;
}

function scheduler() {
  while (nextStepTime < audioCtx.currentTime + 0.12) {
    setActiveStep(currentStep);
    scheduleStep(currentStep, nextStepTime);
    nextStep();
  }
}

function startPlayback() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  state.isPlaying = true;
  ui.toggleAudio.textContent = "Pause Session";
  updateStatus("Session live. Sculpting your motif.");
  addLogEntry("Session started.");
  generateSequence();
  applyAtmosphere();
  currentStep = 0;
  nextStepTime = audioCtx.currentTime + 0.05;
  clearInterval(timerId);
  timerId = setInterval(scheduler, 25);
  if (state.droneEnabled) {
    startDrone();
  }
}

function stopPlayback() {
  state.isPlaying = false;
  ui.toggleAudio.textContent = "Start Session";
  updateStatus("Session paused. Motif retained.");
  addLogEntry("Session paused.");
  clearInterval(timerId);
  setActiveStep(null);
}

function randomizeSketch() {
  state.tempo = 80 + Math.floor(Math.random() * 60);
  state.density = 2 + Math.floor(Math.random() * 6);
  state.energy = 0.2 + Math.random() * 0.6;
  state.accent = 0.1 + Math.random() * 0.5;
  state.humanize = 6 + Math.random() * 20;
  state.texture = 0.2 + Math.random() * 0.6;
  state.atmosphere = 0.2 + Math.random() * 0.6;
  state.swing = Math.random() * 0.4;
  state.length = [6, 8, 10, 12, 14, 16][Math.floor(Math.random() * 6)];
  state.root = roots[Math.floor(Math.random() * roots.length)];
  const modeKeys = Object.keys(modes);
  state.mode = modeKeys[Math.floor(Math.random() * modeKeys.length)];

  ui.tempo.value = state.tempo;
  ui.density.value = state.density;
  ui.energy.value = Math.round(state.energy * 100);
  ui.accent.value = Math.round(state.accent * 100);
  ui.humanize.value = Math.round(state.humanize);
  ui.texture.value = Math.round(state.texture * 100);
  ui.atmosphere.value = Math.round(state.atmosphere * 100);
  ui.swing.value = Math.round(state.swing * 100);
  ui.length.value = state.length;

  updateOutputs();
  updateButtonStates();
  generateSequence();
  applyAtmosphere();
  updateStatus("Random sketch generated.");
  addLogEntry("Random sketch generated.");
}

function toggleTexture() {
  state.textureEnabled = !state.textureEnabled;
  ui.toggleTexture.textContent = state.textureEnabled ? "Disable Field Texture" : "Enable Field Texture";
  const message = state.textureEnabled ? "Field texture enabled." : "Field texture disabled.";
  updateStatus(message);
  addLogEntry(message);
}

function toggleDrone() {
  state.droneEnabled = !state.droneEnabled;
  ui.toggleDrone.textContent = state.droneEnabled ? "Disable Drone" : "Enable Drone";
  if (state.droneEnabled) {
    startDrone();
    updateStatus("Drone bed engaged.");
    addLogEntry("Drone bed engaged.");
  } else {
    stopDrone();
    updateStatus("Drone bed muted.");
    addLogEntry("Drone bed muted.");
  }
}

function toggleVisuals() {
  state.visualsEnabled = !state.visualsEnabled;
  ui.toggleVisuals.textContent = state.visualsEnabled ? "Hide Visuals" : "Show Visuals";
  const message = state.visualsEnabled ? "Visuals on." : "Visuals hidden.";
  updateStatus(message);
  addLogEntry(message);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function applyDriftStep() {
  const intensity = state.driftRange;
  state.tempo = Math.round(clamp(state.tempo + (Math.random() * 2 - 1) * intensity * 10, 60, 160));
  state.energy = clamp(state.energy + (Math.random() * 2 - 1) * intensity * 0.08, 0.1, 0.9);
  state.texture = clamp(state.texture + (Math.random() * 2 - 1) * intensity * 0.1, 0, 1);
  state.atmosphere = clamp(state.atmosphere + (Math.random() * 2 - 1) * intensity * 0.1, 0, 1);
  state.swing = clamp(state.swing + (Math.random() * 2 - 1) * intensity * 0.08, 0, 0.6);

  if (Math.random() < intensity * 0.6) {
    const delta = Math.random() < 0.5 ? -1 : 1;
    state.density = clamp(state.density + delta, 1, 8);
    ui.density.value = state.density;
    generateSequence();
  }

  ui.tempo.value = state.tempo;
  ui.energy.value = Math.round(state.energy * 100);
  ui.texture.value = Math.round(state.texture * 100);
  ui.atmosphere.value = Math.round(state.atmosphere * 100);
  ui.swing.value = Math.round(state.swing * 100);

  updateOutputs();
  applyAtmosphere();
}

function toggleDrift() {
  state.driftEnabled = !state.driftEnabled;
  ui.toggleDrift.textContent = state.driftEnabled ? "Disable Drift" : "Enable Drift";
  if (state.driftEnabled) {
    clearInterval(driftTimer);
    driftTimer = setInterval(applyDriftStep, state.driftRate * 1000);
    updateStatus("Session drift engaged.");
    addLogEntry("Session drift engaged.");
  } else {
    clearInterval(driftTimer);
    updateStatus("Session drift disabled.");
    addLogEntry("Session drift disabled.");
  }
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  canvasSize.width = rect.width;
  canvasSize.height = rect.height;
}

function draw() {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.fillStyle = "rgba(15, 16, 20, 0.35)";
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  particleField.forEach((particle) => {
    particle.y += particle.drift;
    if (particle.y > canvasSize.height) {
      particle.y = 0;
      particle.x = Math.random() * canvasSize.width;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(248, 199, 154, 0.2)`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = pulses.length - 1; i >= 0; i -= 1) {
    const pulse = pulses[i];
    pulse.life -= 0.02;
    pulse.radius += 0.6;
    if (pulse.life <= 0) {
      pulses.splice(i, 1);
      continue;
    }
    ctx.beginPath();
    ctx.strokeStyle = `rgba(248, 199, 154, ${pulse.life})`;
    ctx.lineWidth = 2;
    ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}

function loadSavedScenes() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveScenes(scenes) {
  localStorage.setItem(storageKey, JSON.stringify(scenes));
}

function loadSetlist() {
  const raw = localStorage.getItem(setStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveSetlist(list) {
  localStorage.setItem(setStorageKey, JSON.stringify(list));
}

function updateSetStatus(message, isError = false) {
  if (!ui.setStatus) return;
  ui.setStatus.textContent = message;
  ui.setStatus.dataset.state = isError ? "error" : "ok";
}

function renderSetlist() {
  if (!ui.setList) return;
  ui.setList.innerHTML = "";
  if (setQueue.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Setlist empty. Queue a few scenes.";
    empty.style.opacity = "0.7";
    ui.setList.appendChild(empty);
    return;
  }

  setQueue.forEach((scene, index) => {
    const item = document.createElement("li");
    const order = document.createElement("span");
    const name = document.createElement("span");
    const removeButton = document.createElement("button");

    order.textContent = `${index + 1}`;
    name.textContent = scene.name;
    removeButton.textContent = "Remove";

    if (setState.running && index === setState.currentIndex) {
      item.classList.add("active");
    }

    removeButton.addEventListener("click", () => {
      setQueue = setQueue.filter((entry) => entry.id !== scene.id);
      if (setState.currentIndex >= setQueue.length) {
        setState.currentIndex = Math.max(0, setQueue.length - 1);
      }
      saveSetlist(setQueue);
      renderSetlist();
      updateSetStatus("Setlist updated.");
    });

    item.appendChild(order);
    item.appendChild(name);
    item.appendChild(removeButton);
    ui.setList.appendChild(item);
  });
}

function formatDuration(seconds) {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total <= 0) return "0s";
  const mins = Math.floor(total / 60);
  const secs = Math.floor(total % 60);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function updateSetRunStatus(message, isError = false) {
  if (!ui.setRunStatus) return;
  ui.setRunStatus.textContent = message;
  ui.setRunStatus.dataset.state = isError ? "error" : "ok";
}

function renderSetRuns() {
  if (!ui.setRunList) return;
  ui.setRunList.innerHTML = "";

  if (setRunsStatus === "loading") {
    const loading = document.createElement("li");
    loading.className = "set-run-empty";
    loading.textContent = "Syncing set log...";
    ui.setRunList.appendChild(loading);
    return;
  }

  if (setRunsStatus === "offline") {
    const offline = document.createElement("li");
    offline.className = "set-run-empty";
    offline.textContent = "Set log offline. Deploy to sync runs.";
    ui.setRunList.appendChild(offline);
    return;
  }

  if (setRuns.length === 0) {
    const empty = document.createElement("li");
    empty.className = "set-run-empty";
    empty.textContent = "No set runs logged yet.";
    ui.setRunList.appendChild(empty);
    return;
  }

  setRuns.forEach((run) => {
    const item = document.createElement("li");
    const header = document.createElement("div");
    const title = document.createElement("span");
    const time = document.createElement("span");
    const meta = document.createElement("div");
    const scenes = document.createElement("div");

    item.className = "set-run-item";
    header.className = "set-run-header";
    meta.className = "set-run-meta";
    scenes.className = "set-run-scenes";

    const statusLabel = run.status || "Run";
    title.textContent = `${statusLabel} \u2022 ${run.scene_count} scenes`;
    time.textContent = formatLedgerTimestamp(run.started_at);
    header.appendChild(title);
    header.appendChild(time);

    const loopedLabel = run.looped ? "Looped" : "Single pass";
    meta.textContent = `${formatDuration(run.duration_seconds)} \u2022 ${loopedLabel}`;

    const setlist = Array.isArray(run.setlist) ? run.setlist : [];
    const sceneNames = setlist.map((entry) => entry.name).filter(Boolean);
    scenes.textContent = sceneNames.length > 0 ? sceneNames.join(" \u2022 ") : "Scene list unavailable.";

    item.appendChild(header);
    item.appendChild(meta);
    item.appendChild(scenes);
    ui.setRunList.appendChild(item);
  });
}

async function fetchSetRuns() {
  if (!ui.setRunList) return;
  setRunsStatus = "loading";
  updateSetRunStatus("Syncing set log...");
  renderSetRuns();
  try {
    const response = await fetch(`${setRunsApi}?limit=5`);
    if (!response.ok) throw new Error("Set log unavailable");
    const data = await response.json();
    setRuns = Array.isArray(data.runs) ? data.runs : [];
    setRunsStatus = "ready";
    updateSetRunStatus("Set log synced.");
  } catch (error) {
    setRunsStatus = "offline";
    updateSetRunStatus("Set log offline.", true);
  }
  renderSetRuns();
}

function buildSetRunPayload(status) {
  if (!setState.runStartedAt) return null;
  const startedAt = setState.runStartedAt;
  const endedAt = new Date();
  const durationSeconds = Math.max(
    1,
    Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)
  );
  const setlist = setQueue.map((scene) => ({
    name: scene.name,
    root: scene.settings?.root,
    mode: scene.settings?.mode,
    tempo: scene.settings?.tempo,
  }));

  return {
    status,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    durationSeconds,
    sceneCount: setQueue.length,
    looped: setState.loop,
    setlist,
  };
}

async function recordSetRun(status) {
  const payload = buildSetRunPayload(status);
  if (!payload || setQueue.length === 0) return;
  try {
    await fetch(setRunsApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchSetRuns();
  } catch (error) {
    updateSetRunStatus("Set log offline.", true);
  } finally {
    setState.runStartedAt = null;
  }
}

function queueScene(scene) {
  if (!scene) return;
  const queued = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: scene.name,
    settings: scene.settings,
  };
  const nextQueue = [...setQueue, queued].slice(0, maxSetItems);
  setQueue = nextQueue;
  saveSetlist(setQueue);
  renderSetlist();
  updateSetStatus(`Queued "${scene.name}".`);
}

function playSetItem(index) {
  const scene = setQueue[index];
  if (!scene) return;
  setState.currentIndex = index;
  applySettings(scene.settings, true);
  const message = `Set cue ${index + 1}/${setQueue.length}: ${scene.name}.`;
  updateStatus(message);
  addLogEntry(message);
  updateSetStatus(setState.running ? `Running: ${scene.name}` : `Ready: ${scene.name}`);
  renderSetlist();
  if (setState.running && setState.autoSnapshot) {
    recordAutoSnapshot(scene.name);
  }
}

function scheduleSetAdvance() {
  clearTimeout(setState.timerId);
  setState.timerId = setTimeout(() => {
    advanceSet(true);
  }, setState.duration * 1000);
}

function startSet() {
  if (setQueue.length === 0) {
    updateSetStatus("Setlist empty. Queue scenes first.", true);
    return;
  }
  if (!setState.running) {
    setState.runStartedAt = new Date();
  }
  setState.running = true;
  if (setState.currentIndex >= setQueue.length) {
    setState.currentIndex = 0;
  }
  playSetItem(setState.currentIndex);
  scheduleSetAdvance();
}

function stopSet({ message = "Set paused.", status = "Stopped" } = {}) {
  setState.running = false;
  clearTimeout(setState.timerId);
  if (setState.runStartedAt) {
    recordSetRun(status);
  }
  updateSetStatus(message);
  renderSetlist();
}

function advanceSet(isAuto = false) {
  if (setQueue.length === 0) return;
  let nextIndex = setState.currentIndex + 1;
  if (nextIndex >= setQueue.length) {
    if (setState.loop) {
      nextIndex = 0;
    } else {
      const message = isAuto ? "Set complete." : "Set paused.";
      const status = isAuto ? "Completed" : "Stopped";
      stopSet({ message, status });
      return;
    }
  }
  playSetItem(nextIndex);
  if (setState.running) {
    scheduleSetAdvance();
  }
}

function toggleSetLoop() {
  setState.loop = !setState.loop;
  if (ui.toggleSetLoop) {
    ui.toggleSetLoop.textContent = setState.loop ? "Loop On" : "Loop Off";
  }
  updateSetStatus(setState.loop ? "Loop enabled." : "Loop disabled.");
}

function toggleAutoSnapshot() {
  setState.autoSnapshot = !setState.autoSnapshot;
  if (ui.toggleAutoSnapshot) {
    ui.toggleAutoSnapshot.textContent = setState.autoSnapshot
      ? "Auto Snapshot On"
      : "Auto Snapshot Off";
    ui.toggleAutoSnapshot.dataset.state = setState.autoSnapshot ? "on" : "off";
  }
  updateSetStatus(setState.autoSnapshot ? "Auto snapshots enabled." : "Auto snapshots disabled.");
}

function queueCurrentState() {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  queueScene({
    name: `Current Sketch ${timestamp}`,
    settings: {
      tempo: state.tempo,
      density: state.density,
      energy: state.energy,
      accent: state.accent,
      humanize: state.humanize,
      texture: state.texture,
      atmosphere: state.atmosphere,
      swing: state.swing,
      length: state.length,
      root: state.root,
      mode: state.mode,
      droneLevel: state.droneLevel,
      morphIntensity: state.morphIntensity,
    },
  });
}

function setCloudStatus(message, isError = false) {
  ui.cloudStatus.textContent = message;
  ui.cloudStatus.dataset.state = isError ? "error" : "ok";
}

function renderCloudScenes(scenes, hasFilters = false) {
  ui.cloudScenes.innerHTML = "";
  if (scenes.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = hasFilters
      ? "No cloud scenes match the current filters."
      : "Cloud library is empty.";
    empty.style.opacity = "0.7";
    ui.cloudScenes.appendChild(empty);
    return;
  }

  scenes.forEach((scene) => {
    const item = document.createElement("li");
    const textWrap = document.createElement("div");
    const name = document.createElement("span");
    const meta = document.createElement("span");
    const loadButton = document.createElement("button");
    const saveLocalButton = document.createElement("button");
    const queueButton = document.createElement("button");
    const settings = scene.settings || {};
    const moodLabel = buildMoodLabelFromSettings(settings);
    const tempoLabel = settings.tempo ? Math.round(settings.tempo) : "--";
    const rootLabel = settings.root || "Root";
    const modeLabel = settings.mode || "Mode";
    const ageLabel = formatCloudTimestamp(scene.created_at);

    name.textContent = scene.name;
    meta.textContent = `${rootLabel} ${modeLabel} · ${tempoLabel} BPM · ${moodLabel} · ${ageLabel}`;
    meta.className = "cloud-meta";
    loadButton.textContent = "Load";
    saveLocalButton.textContent = "Save Local";
    queueButton.textContent = "Queue";

    loadButton.addEventListener("click", () => {
      applySettings(scene.settings, true);
      const message = `Loaded cloud scene: ${scene.name}.`;
      updateStatus(message);
      addLogEntry(message);
    });

    saveLocalButton.addEventListener("click", () => {
      const localScenes = loadSavedScenes();
      const newScene = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: scene.name,
        settings: scene.settings,
      };
      const nextScenes = [newScene, ...localScenes].slice(0, maxSavedScenes);
      saveScenes(nextScenes);
      renderSavedScenes();
      const message = `Saved locally: ${scene.name}.`;
      updateStatus(message);
      addLogEntry(message);
    });

    queueButton.addEventListener("click", () => {
      queueScene({ name: scene.name, settings: scene.settings });
    });

    textWrap.className = "cloud-scene-text";
    textWrap.appendChild(name);
    textWrap.appendChild(meta);
    item.appendChild(textWrap);
    item.appendChild(loadButton);
    item.appendChild(saveLocalButton);
    item.appendChild(queueButton);
    ui.cloudScenes.appendChild(item);
  });
}

async function fetchCloudScenes() {
  setCloudStatus("Loading cloud scenes...");
  try {
    const response = await fetch(cloudApi);
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const reason = errorPayload?.error || "Unable to fetch cloud scenes.";
      throw new Error(reason);
    }
    const data = await response.json();
    const scenes = Array.isArray(data.scenes) ? data.scenes : [];
    cloudScenes = scenes;
    refreshCloudLibrary();
    setCloudStatus(`Cloud updated · ${scenes.length} scenes`);
  } catch (error) {
    const message = error?.message === "Database not configured."
      ? "Cloud unavailable. Configure database."
      : "Cloud offline. Try again shortly.";
    setCloudStatus(message, true);
  }
}

async function syncLocalScenesToCloud() {
  const scenes = loadSavedScenes();
  if (scenes.length === 0) {
    setCloudStatus("Save a scene locally before syncing.", true);
    return;
  }
  setCloudStatus("Syncing local scenes...");
  try {
    const response = await fetch(cloudApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenes: scenes.map((scene) => ({ name: scene.name, settings: scene.settings })),
      }),
    });
    if (!response.ok) {
      throw new Error("Sync failed.");
    }
    const data = await response.json();
    const inserted = Number(data.inserted || 0);
    setCloudStatus(`Synced ${inserted} scenes to cloud.`);
    fetchCloudScenes();
  } catch (error) {
    setCloudStatus("Sync failed. Check connection.", true);
  }
}

function renderSavedScenes() {
  const scenes = loadSavedScenes();
  ui.savedScenes.innerHTML = "";
  if (scenes.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No saved scenes yet.";
    empty.style.opacity = "0.7";
    ui.savedScenes.appendChild(empty);
    return;
  }

  scenes.forEach((scene) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const loadButton = document.createElement("button");
    const queueButton = document.createElement("button");
    const removeButton = document.createElement("button");

    name.textContent = scene.name;
    loadButton.textContent = "Load";
    queueButton.textContent = "Queue";
    removeButton.textContent = "Remove";

    loadButton.addEventListener("click", () => {
      applySettings(scene.settings, true);
      const message = `Loaded scene: ${scene.name}.`;
      updateStatus(message);
      addLogEntry(message);
    });

    queueButton.addEventListener("click", () => {
      queueScene({ name: scene.name, settings: scene.settings });
    });

    removeButton.addEventListener("click", () => {
      const nextScenes = loadSavedScenes().filter((entry) => entry.id !== scene.id);
      saveScenes(nextScenes);
      renderSavedScenes();
      const message = `Removed scene: ${scene.name}.`;
      updateStatus(message);
      addLogEntry(message);
    });

    item.appendChild(name);
    item.appendChild(loadButton);
    item.appendChild(queueButton);
    item.appendChild(removeButton);
    ui.savedScenes.appendChild(item);
  });
}

function saveScene() {
  const scenes = loadSavedScenes();
  const trimmedName = ui.sceneName.value.trim();
  const name = trimmedName.length > 0 ? trimmedName : `Scene ${scenes.length + 1}`;
  const newScene = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    settings: {
      tempo: state.tempo,
      density: state.density,
      energy: state.energy,
      accent: state.accent,
      humanize: state.humanize,
      texture: state.texture,
      atmosphere: state.atmosphere,
      swing: state.swing,
      length: state.length,
      root: state.root,
      mode: state.mode,
      droneLevel: state.droneLevel,
      morphIntensity: state.morphIntensity,
    },
  };

  const nextScenes = [newScene, ...scenes];
  if (nextScenes.length > maxSavedScenes) {
    nextScenes.pop();
  }

  saveScenes(nextScenes);
  ui.sceneName.value = "";
  renderSavedScenes();
  const message = `Saved scene: ${name}.`;
  updateStatus(message);
  addLogEntry(message);
}

function bindControls() {
  ui.toggleAudio.addEventListener("click", () => {
    if (state.isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  ui.randomize.addEventListener("click", randomizeSketch);

  ui.tempo.addEventListener("input", (event) => {
    state.tempo = Number(event.target.value);
    updateOutputs();
  });

  ui.density.addEventListener("input", (event) => {
    state.density = Number(event.target.value);
    updateOutputs();
    generateSequence();
  });

  ui.energy.addEventListener("input", (event) => {
    state.energy = Number(event.target.value) / 100;
    updateOutputs();
  });

  ui.accent.addEventListener("input", (event) => {
    state.accent = Number(event.target.value) / 100;
    updateOutputs();
  });

  ui.humanize.addEventListener("input", (event) => {
    state.humanize = Number(event.target.value);
    updateOutputs();
  });

  ui.texture.addEventListener("input", (event) => {
    state.texture = Number(event.target.value) / 100;
    updateOutputs();
  });

  ui.atmosphere.addEventListener("input", (event) => {
    state.atmosphere = Number(event.target.value) / 100;
    updateOutputs();
    applyAtmosphere();
  });

  ui.swing.addEventListener("input", (event) => {
    state.swing = Number(event.target.value) / 100;
    updateOutputs();
  });

  ui.length.addEventListener("input", (event) => {
    state.length = Number(event.target.value);
    updateOutputs();
    generateSequence();
  });

  ui.drone.addEventListener("input", (event) => {
    state.droneLevel = Number(event.target.value) / 100;
    updateOutputs();
    updateDroneParams();
  });

  ui.driftRate.addEventListener("input", (event) => {
    state.driftRate = Number(event.target.value);
    updateOutputs();
    if (state.driftEnabled) {
      clearInterval(driftTimer);
      driftTimer = setInterval(applyDriftStep, state.driftRate * 1000);
    }
  });

  ui.driftRange.addEventListener("input", (event) => {
    state.driftRange = Number(event.target.value) / 100;
    updateOutputs();
  });

  ui.morphIntensity.addEventListener("input", (event) => {
    state.morphIntensity = Number(event.target.value) / 100;
    updateOutputs();
  });

  if (ui.setDuration) {
    ui.setDuration.addEventListener("input", (event) => {
      setState.duration = Number(event.target.value);
      if (ui.setDurationValue) {
        ui.setDurationValue.textContent = `${setState.duration}s`;
      }
    });
  }

  ui.toggleTexture.addEventListener("click", toggleTexture);
  ui.toggleDrone.addEventListener("click", toggleDrone);
  ui.toggleVisuals.addEventListener("click", toggleVisuals);
  ui.toggleDrift.addEventListener("click", toggleDrift);
  ui.evolveMotif.addEventListener("click", evolveMotif);
  ui.saveScene.addEventListener("click", saveScene);
  if (ui.queueCurrent) {
    ui.queueCurrent.addEventListener("click", queueCurrentState);
  }
  if (ui.startSet) {
    ui.startSet.addEventListener("click", startSet);
  }
  if (ui.advanceSet) {
    ui.advanceSet.addEventListener("click", () => advanceSet(false));
  }
  if (ui.stopSet) {
    ui.stopSet.addEventListener("click", stopSet);
  }
  if (ui.toggleSetLoop) {
    ui.toggleSetLoop.addEventListener("click", toggleSetLoop);
  }
  if (ui.toggleAutoSnapshot) {
    ui.toggleAutoSnapshot.addEventListener("click", toggleAutoSnapshot);
  }
  if (ui.recordSession) {
    ui.recordSession.addEventListener("click", recordSessionSnapshot);
  }
  ui.syncCloud.addEventListener("click", syncLocalScenesToCloud);
  ui.refreshCloud.addEventListener("click", fetchCloudScenes);
  ui.clearLog.addEventListener("click", () => {
    sessionLog.length = 0;
    renderSessionLog();
    updateStatus("Session log cleared.");
  });
}

function init() {
  createButtons(roots, ui.rootButtons, (root) => {
    state.root = root;
    updateButtonStates();
    generateSequence();
  });

  createButtons(Object.keys(modes), ui.modeButtons, (mode) => {
    state.mode = mode;
    updateButtonStates();
    generateSequence();
  });

  updateButtonStates();
  updateOutputs();
  ui.toggleTexture.textContent = "Disable Field Texture";
  ui.toggleDrone.textContent = "Enable Drone";
  ui.toggleVisuals.textContent = "Hide Visuals";
  ui.toggleDrift.textContent = "Enable Drift";
  if (ui.toggleSetLoop) {
    ui.toggleSetLoop.textContent = setState.loop ? "Loop On" : "Loop Off";
  }
  if (ui.toggleAutoSnapshot) {
    ui.toggleAutoSnapshot.textContent = setState.autoSnapshot
      ? "Auto Snapshot On"
      : "Auto Snapshot Off";
    ui.toggleAutoSnapshot.dataset.state = setState.autoSnapshot ? "on" : "off";
  }
  generateSequence();
  createPresetButtons();
  renderSavedScenes();
  renderCloudScenes([]);
  setQueue = loadSetlist();
  renderSetlist();
  updateSetStatus(setQueue.length ? "Set ready. Tap Start Set." : "Set idle. Queue a few scenes.");
  updateSetRunStatus("Set log idle.");
  fetchCloudScenes();
  fetchLedger();
  fetchInsights();
  fetchSetRuns();
  renderSessionLog();
  bindControls();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  draw();
}

init();
