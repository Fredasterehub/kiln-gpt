"use strict";

const { doctor } = require("../lib/workflow");

async function doctorCommand(args) {
  const result = doctor(args.projectRoot);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  for (const check of result.checks) {
    process.stdout.write(`[${check.status.toUpperCase()}] ${check.name}: ${check.message}\n`);
  }
}

module.exports = {
  doctorCommand,
};
