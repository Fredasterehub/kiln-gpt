"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { ensureDir, readJson, writeJson } = require("./fs");

function runProcess(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    input: options.input,
    encoding: "utf8",
    timeout: (options.timeoutSeconds || 900) * 1000,
    maxBuffer: 1024 * 1024 * 20,
    stdio: options.stdio || "pipe",
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === "number" && result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    throw new Error(`${command} exited with code ${result.status}${stderr ? `: ${stderr}` : ""}`);
  }

  return result;
}

function cliAvailable(command) {
  const probe = spawnSync("bash", ["-lc", `command -v ${command}`], {
    encoding: "utf8",
    stdio: "pipe",
  });
  return probe.status === 0;
}

function writeSchema(tmpDir, prefix, schema) {
  ensureDir(tmpDir);
  const schemaPath = path.join(tmpDir, `${prefix}.schema.json`);
  writeJson(schemaPath, schema);
  return schemaPath;
}

function runCodexExec(options) {
  const schemaPath = writeSchema(options.tmpDir, options.name, options.schema);
  const outputPath = path.join(options.tmpDir, `${options.name}.output.json`);
  const args = [
    "exec",
    "-",
    "-C",
    options.workdir,
    "-m",
    options.model,
    "--full-auto",
    "--output-schema",
    schemaPath,
    "-o",
    outputPath,
  ];

  if (options.enableMultiAgent) {
    args.push("--enable", "multi_agent");
  }

  runProcess("codex", args, {
    cwd: options.workdir,
    input: options.prompt,
    timeoutSeconds: options.timeoutSeconds,
  });

  return readJson(outputPath);
}

function runCodexReview(options) {
  const args = ["review", "--uncommitted", options.prompt];
  const result = runProcess("codex", args, {
    cwd: options.workdir,
    timeoutSeconds: options.timeoutSeconds,
  });
  return (result.stdout || "").trim();
}

function runClaudePrint(options) {
  const args = [
    "-p",
    "--output-format",
    "json",
    "--json-schema",
    JSON.stringify(options.schema),
    "--model",
    options.model,
    options.prompt,
  ];

  const result = runProcess("claude", args, {
    cwd: options.workdir,
    timeoutSeconds: options.timeoutSeconds,
  });
  const payload = JSON.parse(result.stdout || "{}");
  return payload.structured_output || payload;
}

function launchCodexInteractive(options) {
  const args = ["-C", options.workdir, "-m", options.model, options.prompt];
  const result = spawnSync("codex", args, {
    cwd: options.workdir,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === "number" && result.status !== 0) {
    throw new Error(`codex exited with code ${result.status}`);
  }
}

function runGit(args, cwd) {
  return runProcess("git", args, { cwd });
}

module.exports = {
  cliAvailable,
  launchCodexInteractive,
  runClaudePrint,
  runCodexExec,
  runCodexReview,
  runGit,
};
