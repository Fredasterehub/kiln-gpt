"use strict";

const { loadCurrentRun, ensureProjectInitialized } = require("../lib/state");

async function peekCommand(args) {
  ensureProjectInitialized(args.projectRoot);
  const run = loadCurrentRun(args.projectRoot);

  if (!run) {
    const payload = {
      status: "idle",
      message: "No current run.",
    };
    process.stdout.write(args.json ? `${JSON.stringify(payload, null, 2)}\n` : "No current run.\n");
    return;
  }

  const payload = {
    status: run.state.status,
    run_id: run.state.runId,
    stage: run.state.stage,
    project_mode: run.state.projectMode,
    current_phase: run.state.currentPhase,
    completed_phases: run.state.completedPhases,
    next_action: run.state.nextAction,
    run_dir: run.paths.runDir,
  };

  if (args.json) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  process.stdout.write(
    [
      `Run: ${payload.run_id}`,
      `Stage: ${payload.stage}`,
      `Status: ${payload.status}`,
      `Project mode: ${payload.project_mode}`,
      `Current phase: ${payload.current_phase || "none"}`,
      `Completed phases: ${payload.completed_phases.length}`,
      `Next action: ${payload.next_action}`,
      `Run dir: ${payload.run_dir}`,
    ].join("\n") + "\n",
  );
}

module.exports = {
  peekCommand,
};
