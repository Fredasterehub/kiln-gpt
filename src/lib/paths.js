"use strict";

const path = require("node:path");

function repoRoot() {
  return path.resolve(__dirname, "..", "..");
}

function projectPaths(projectRoot) {
  const kilnDir = path.join(projectRoot, ".kiln");
  return {
    projectRoot,
    kilnDir,
    configPath: path.join(kilnDir, "config.json"),
    currentRunPath: path.join(kilnDir, "current-run.txt"),
    runsDir: path.join(kilnDir, "runs"),
    templateRoot: path.join(repoRoot(), "references", "templates"),
    agentRoot: path.join(repoRoot(), "agents"),
  };
}

function runPaths(projectRoot, runId) {
  const project = projectPaths(projectRoot);
  const runDir = path.join(project.runsDir, runId);
  return {
    ...project,
    runDir,
    manifestPath: path.join(runDir, "manifest.json"),
    statePath: path.join(runDir, "state.json"),
    stateMarkdownPath: path.join(runDir, "STATE.md"),
    eventsPath: path.join(runDir, "events.jsonl"),
    docsDir: path.join(runDir, "docs"),
    plansDir: path.join(runDir, "plans"),
    promptsDir: path.join(runDir, "prompts"),
    reviewsDir: path.join(runDir, "reviews"),
    validationDir: path.join(runDir, "validation"),
    outputsDir: path.join(runDir, "outputs"),
    contextDir: path.join(runDir, "context"),
    tmpDir: path.join(runDir, "tmp"),
  };
}

module.exports = {
  projectPaths,
  repoRoot,
  runPaths,
};
