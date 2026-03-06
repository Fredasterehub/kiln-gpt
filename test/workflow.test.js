"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const { runFire } = require("../src/lib/workflow");
const { createRun, ensureProjectInitialized, loadCurrentRun } = require("../src/lib/state");

function tempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "kiln-codex-workflow-"));
}

test("auto dry-run promotes completed brainstorm into plan stage", async () => {
  const projectRoot = tempProject();
  ensureProjectInitialized(projectRoot);
  const run = createRun(projectRoot);
  fs.writeFileSync(path.join(run.paths.docsDir, "vision.md"), "# Vision\n\nConcrete product brief.\n");

  const result = await runFire(projectRoot, {
    auto: true,
    dryRun: true,
  });

  const current = loadCurrentRun(projectRoot);
  assert.match(result.message, /current stage is plan/);
  assert.equal(current.state.stage, "plan");
});
