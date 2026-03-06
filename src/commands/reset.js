"use strict";

const { resetRuntime } = require("../lib/state");

async function resetCommand(args) {
  const result = resetRuntime(args.projectRoot);
  process.stdout.write(`Archived runtime to ${result.archivePath}\n`);
}

module.exports = {
  resetCommand,
};
