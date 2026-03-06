"use strict";

const { runResume } = require("../lib/workflow");
const { spinner, transition } = require("../lib/lore");

async function resumeCommand(args) {
  const result = await runResume(args.projectRoot, {
    stage: args.stage,
    auto: Boolean(args.auto),
    dryRun: Boolean(args["dry-run"]),
  });

  process.stdout.write(
    [
      spinner("planning", `${args.projectRoot}:${args.stage || "resume"}`),
      transition("planning_start", `${args.projectRoot}:${args.stage || "resume"}`),
      result.message,
    ].join("\n") + "\n",
  );
}

module.exports = {
  resumeCommand,
};
