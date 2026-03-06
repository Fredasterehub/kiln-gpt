#!/usr/bin/env node

const { runCli } = require("../src/cli");

runCli(process.argv).catch((error) => {
  const message = error && error.stack ? error.stack : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
