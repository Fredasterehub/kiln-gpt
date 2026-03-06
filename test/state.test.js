"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const { createRun, ensureProjectInitialized, loadConfig, loadCurrentRun } = require("../src/lib/state");

function tempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "kiln-codex-test-"));
}

test("init seeds kiln config and gitignore", () => {
  const projectRoot = tempProject();
  const result = ensureProjectInitialized(projectRoot);

  assert.equal(fs.existsSync(result.kilnDir), true);
  assert.equal(fs.existsSync(result.configPath), true);
  assert.match(fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8"), /\.kiln\//);
});

test("createRun seeds docs and current state", () => {
  const projectRoot = tempProject();
  ensureProjectInitialized(projectRoot);
  const run = createRun(projectRoot);
  const current = loadCurrentRun(projectRoot);
  const config = loadConfig(projectRoot);

  assert.equal(current.state.runId, run.state.runId);
  assert.equal(current.state.stage, "brainstorm");
  assert.equal(fs.existsSync(path.join(current.paths.docsDir, "vision.md")), true);
  assert.equal(config.host.primary, "codex");
});
