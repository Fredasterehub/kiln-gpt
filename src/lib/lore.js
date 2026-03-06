"use strict";

const path = require("node:path");

const { readJson } = require("./fs");
const { repoRoot } = require("./paths");

let loreCache = null;
let verbsCache = null;

function loadLore() {
  if (!loreCache) {
    loreCache = readJson(path.join(repoRoot(), "references", "data", "lore.json"));
  }
  return loreCache;
}

function loadSpinnerVerbs() {
  if (!verbsCache) {
    verbsCache = readJson(path.join(repoRoot(), "references", "data", "spinner-verbs.json"));
  }
  return verbsCache;
}

function pick(array, seed = 0) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  const index = Math.abs(seed) % array.length;
  return array[index];
}

function checksum(text) {
  return String(text || "")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function greeting(seedText) {
  const lore = loadLore();
  return pick(lore.greetings, checksum(seedText));
}

function transition(key, seedText) {
  const lore = loadLore();
  const bucket = lore.transitions[key];
  if (!bucket || !Array.isArray(bucket.quotes) || bucket.quotes.length === 0) {
    return null;
  }
  const quote = pick(bucket.quotes, checksum(`${key}:${seedText}`));
  return `${bucket.label}: "${quote.text}" — ${quote.source}`;
}

function spinner(stage, seedText) {
  const verbs = loadSpinnerVerbs();
  const bucket = verbs[stage] || verbs.generic || [];
  return pick(bucket, checksum(`${stage}:${seedText}`));
}

module.exports = {
  greeting,
  spinner,
  transition,
};
