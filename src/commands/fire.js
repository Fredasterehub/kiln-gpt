"use strict";

const { runFire } = require("../lib/workflow");
const { spinner, transition } = require("../lib/lore");

async function fireCommand(args) {
  const result = await runFire(args.projectRoot, {
    stage: args.stage,
    auto: Boolean(args.auto),
    dryRun: Boolean(args["dry-run"]),
  });

  process.stdout.write(
    [
      spinner("brainstorm", `${args.projectRoot}:${args.stage || "brainstorm"}`),
      transition(
        args.stage === "plan" || args.auto ? "planning_start" : "brainstorm_start",
        `${args.projectRoot}:${args.stage || "brainstorm"}`,
      ),
      result.message,
    ].join("\n") + "\n",
  );
}

module.exports = {
  fireCommand,
};
