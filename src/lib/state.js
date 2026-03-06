"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { DEFAULT_CONFIG, STAGES } = require("./constants");
const { appendText, copyIfMissing, ensureDir, exists, listProjectFiles, readJson, readText, slugify, writeJson, writeText } = require("./fs");
const { projectPaths, runPaths } = require("./paths");

function nowIso() {
  return new Date().toISOString();
}

function runId() {
  return `r${nowIso().replace(/[-:TZ.]/g, "").slice(0, 14)}-${Math.floor(Math.random() * 900 + 100)}`;
}

function detectProjectMode(projectRoot) {
  const markers = new Set(["package.json", "pyproject.toml", "go.mod", "Cargo.toml", "README.md"]);
  for (const entry of fs.readdirSync(projectRoot)) {
    if (markers.has(entry)) {
      return "brownfield";
    }
  }

  const files = listProjectFiles(projectRoot);
  return files.length > 0 ? "brownfield" : "greenfield";
}

function seedGitignore(projectRoot) {
  const gitignorePath = path.join(projectRoot, ".gitignore");
  if (!exists(gitignorePath)) {
    writeText(gitignorePath, ".kiln/\n");
    return;
  }

  const text = readText(gitignorePath);
  if (!text.split(/\r?\n/).includes(".kiln/")) {
    writeText(gitignorePath, `${text.replace(/\n*$/, "\n")}.kiln/\n`);
  }
}

function ensureProjectInitialized(projectRoot) {
  const paths = projectPaths(projectRoot);
  ensureDir(paths.kilnDir);
  ensureDir(paths.runsDir);
  seedGitignore(projectRoot);

  copyIfMissing(path.join(paths.templateRoot, "config.json"), paths.configPath);
  return paths;
}

function seedDocs(paths) {
  const docNames = [
    "vision.md",
    "architecture.md",
    "master-plan.md",
    "decisions.md",
    "pitfalls.md",
    "patterns.md",
    "deployment.md",
  ];

  for (const name of docNames) {
    copyIfMissing(path.join(paths.templateRoot, "docs", name), path.join(paths.docsDir, name));
  }
}

function renderStateMarkdown(state) {
  return [
    "# Kiln State",
    "",
    `- run_id: ${state.runId}`,
    `- stage: ${state.stage}`,
    `- status: ${state.status}`,
    `- project_mode: ${state.projectMode}`,
    `- current_phase: ${state.currentPhase || "none"}`,
    `- correction_cycle: ${state.correctionCycle}`,
    `- last_event_at: ${state.lastEventAt}`,
    "",
    "## Completed Phases",
    "",
    ...(state.completedPhases.length > 0 ? state.completedPhases.map((phase) => `- ${phase}`) : ["- none"]),
    "",
    "## Next Action",
    "",
    `- ${state.nextAction}`,
    "",
  ].join("\n");
}

function saveState(paths, state) {
  writeJson(paths.statePath, state);
  writeText(paths.stateMarkdownPath, `${renderStateMarkdown(state)}\n`);
}

function appendEvent(paths, event) {
  appendText(paths.eventsPath, `${JSON.stringify(event)}\n`);
}

function createRun(projectRoot) {
  ensureProjectInitialized(projectRoot);
  const id = runId();
  const paths = runPaths(projectRoot, id);

  [
    paths.runDir,
    paths.docsDir,
    paths.plansDir,
    paths.promptsDir,
    paths.reviewsDir,
    paths.validationDir,
    paths.outputsDir,
    paths.contextDir,
    paths.tmpDir,
  ].forEach(ensureDir);

  seedDocs(paths);

  const state = {
    runId: id,
    stage: "brainstorm",
    status: "ready",
    projectMode: detectProjectMode(projectRoot),
    currentPhase: null,
    completedPhases: [],
    correctionCycle: 0,
    planPath: null,
    lastEventAt: nowIso(),
    nextAction: "Start or continue the brainstorm and capture the result in docs/vision.md.",
  };

  const manifest = {
    runtimeVersion: 1,
    runId: id,
    createdAt: nowIso(),
    projectRoot,
  };

  writeJson(paths.manifestPath, manifest);
  saveState(paths, state);
  writeText(projectPaths(projectRoot).currentRunPath, `${id}\n`);
  appendEvent(paths, {
    timestamp: nowIso(),
    kind: "run_created",
    stage: state.stage,
    summary: "Created new run.",
  });

  return { paths, state };
}

function loadCurrentRun(projectRoot) {
  const paths = projectPaths(projectRoot);
  if (!exists(paths.currentRunPath)) {
    return null;
  }

  const id = readText(paths.currentRunPath).trim();
  if (!id) {
    return null;
  }

  const run = runPaths(projectRoot, id);
  if (!exists(run.statePath)) {
    return null;
  }

  return {
    paths: run,
    state: readJson(run.statePath),
  };
}

function updateCurrentRun(projectRoot, mutate) {
  const current = loadCurrentRun(projectRoot);
  if (!current) {
    throw new Error("No current run.");
  }

  const nextState = mutate({ ...current.state });
  nextState.lastEventAt = nowIso();
  saveState(current.paths, nextState);
  return { ...current, state: nextState };
}

function loadConfig(projectRoot) {
  const paths = ensureProjectInitialized(projectRoot);
  const parsed = readJson(paths.configPath);
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    host: {
      ...DEFAULT_CONFIG.host,
      ...(parsed.host || {}),
    },
    claude: {
      ...DEFAULT_CONFIG.claude,
      ...(parsed.claude || {}),
    },
    execution: {
      ...DEFAULT_CONFIG.execution,
      ...(parsed.execution || {}),
    },
  };
}

function ensureRun(projectRoot) {
  return loadCurrentRun(projectRoot) || createRun(projectRoot);
}

function assertStage(stage) {
  if (!STAGES.includes(stage)) {
    throw new Error(`Invalid stage: ${stage}`);
  }
}

function setStage(projectRoot, stage, nextAction) {
  assertStage(stage);
  return updateCurrentRun(projectRoot, (state) => ({
    ...state,
    stage,
    status: "ready",
    nextAction: nextAction || state.nextAction,
  }));
}

function readDoc(run, name) {
  return readText(path.join(run.paths.docsDir, name));
}

function writeDoc(run, name, value) {
  writeText(path.join(run.paths.docsDir, name), value.endsWith("\n") ? value : `${value}\n`);
}

function writeArtifact(run, relativePath, value) {
  const targetPath = path.join(run.paths.runDir, relativePath);
  if (typeof value === "string") {
    writeText(targetPath, value.endsWith("\n") ? value : `${value}\n`);
    return targetPath;
  }
  writeJson(targetPath, value);
  return targetPath;
}

function resetRuntime(projectRoot) {
  const paths = projectPaths(projectRoot);
  if (!exists(paths.kilnDir)) {
    throw new Error("No .kiln directory found.");
  }

  const archivePath = `${paths.kilnDir}.archive-${nowIso().replace(/[:.]/g, "-")}`;
  fs.renameSync(paths.kilnDir, archivePath);
  return { archivePath };
}

module.exports = {
  appendEvent,
  assertStage,
  createRun,
  ensureProjectInitialized,
  ensureRun,
  loadConfig,
  loadCurrentRun,
  readDoc,
  resetRuntime,
  saveState,
  setStage,
  updateCurrentRun,
  writeArtifact,
  writeDoc,
};
