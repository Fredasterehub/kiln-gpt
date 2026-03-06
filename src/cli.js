"use strict";

const path = require("node:path");

const { fireCommand } = require("./commands/fire");
const { doctorCommand } = require("./commands/doctor");
const { initCommand } = require("./commands/init");
const { peekCommand } = require("./commands/peek");
const { resetCommand } = require("./commands/reset");
const { resumeCommand } = require("./commands/resume");

function parseArgs(argv) {
  const positionals = [];
  const flags = {};

  for (let index = 3; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return { positionals, flags };
}

function printHelp() {
  process.stdout.write(
    [
      "Kiln Codex Runtime",
      "",
      "Usage:",
      "  kiln init [--project-root PATH]",
      "  kiln fire [--project-root PATH] [--stage STAGE] [--auto] [--dry-run]",
      "  kiln resume [--project-root PATH] [--stage STAGE] [--auto] [--dry-run]",
      "  kiln peek [--project-root PATH] [--json]",
      "  kiln reset [--project-root PATH] [--archive-only]",
      "  kiln doctor [--project-root PATH] [--json]",
      "",
      "Stages:",
      "  brainstorm, plan, execute, validate, deploy, report, complete",
      "",
    ].join("\n"),
  );
}

async function runCli(argv) {
  const command = argv[2] || "help";
  const { flags } = parseArgs(argv);
  const projectRoot = path.resolve(flags["project-root"] || process.cwd());
  const args = { ...flags, projectRoot };

  switch (command) {
    case "init":
      return initCommand(args);
    case "fire":
      return fireCommand(args);
    case "resume":
      return resumeCommand(args);
    case "peek":
      return peekCommand(args);
    case "reset":
      return resetCommand(args);
    case "doctor":
      return doctorCommand(args);
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

module.exports = {
  parseArgs,
  runCli,
};
