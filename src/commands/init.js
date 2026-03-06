"use strict";

const { ensureProjectInitialized } = require("../lib/state");
const { greeting, transition } = require("../lib/lore");

async function initCommand(args) {
  const result = ensureProjectInitialized(args.projectRoot);
  process.stdout.write(
    [
      greeting(args.projectRoot),
      transition("ignition", args.projectRoot),
      `Kiln initialized at ${result.kilnDir}`,
      `Config: ${result.configPath}`,
      `Runs: ${result.runsDir}`,
    ].join("\n") + "\n",
  );
}

module.exports = {
  initCommand,
};
