"use strict";

const fs = require("node:fs");
const path = require("node:path");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text);
}

function appendText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, text);
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function copyIfMissing(sourcePath, destinationPath) {
  if (exists(destinationPath)) {
    return;
  }
  ensureDir(path.dirname(destinationPath));
  fs.copyFileSync(sourcePath, destinationPath);
}

function listProjectFiles(rootDir) {
  const output = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === ".kiln" || entry.name === "node_modules") {
        continue;
      }

      const nextPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(nextPath);
      } else {
        output.push(nextPath);
      }
    }
  }

  return output;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

module.exports = {
  appendText,
  copyIfMissing,
  ensureDir,
  exists,
  listProjectFiles,
  readJson,
  readText,
  slugify,
  writeJson,
  writeText,
};
