"use strict";

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "architecture", "phases", "risks", "validation", "deployment", "masterPlanMarkdown"],
  properties: {
    summary: { type: "string" },
    architecture: { type: "string" },
    phases: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "goal", "hours", "tasks", "acceptanceCriteria", "verification"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          goal: { type: "string" },
          hours: { type: "number" },
          tasks: { type: "array", minItems: 1, items: { type: "string" } },
          acceptanceCriteria: { type: "array", minItems: 1, items: { type: "string" } },
          verification: { type: "array", minItems: 1, items: { type: "string" } },
        },
      },
    },
    risks: { type: "array", items: { type: "string" } },
    validation: { type: "array", items: { type: "string" } },
    deployment: { type: "array", items: { type: "string" } },
    masterPlanMarkdown: { type: "string" },
  },
};

const DEBATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["winner", "strengths", "gaps", "requiredChanges", "summary"],
  properties: {
    winner: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    gaps: { type: "array", items: { type: "string" } },
    requiredChanges: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
  },
};

const IMPLEMENTATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "filesChanged", "commandsRun", "verification"],
  properties: {
    summary: { type: "string" },
    filesChanged: { type: "array", items: { type: "string" } },
    commandsRun: { type: "array", items: { type: "string" } },
    verification: { type: "array", items: { type: "string" } },
  },
};

const REVIEW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["approved", "summary", "findings", "requiredFixes", "suggestedChecks", "reviewMarkdown"],
  properties: {
    approved: { type: "boolean" },
    summary: { type: "string" },
    findings: { type: "array", items: { type: "string" } },
    requiredFixes: { type: "array", items: { type: "string" } },
    suggestedChecks: { type: "array", items: { type: "string" } },
    reviewMarkdown: { type: "string" },
  },
};

const GATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["approved", "summary", "findings", "missingCredentials", "nextActions", "reportMarkdown"],
  properties: {
    approved: { type: "boolean" },
    summary: { type: "string" },
    findings: { type: "array", items: { type: "string" } },
    missingCredentials: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
    reportMarkdown: { type: "string" },
  },
};

const REPORT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "filesChanged", "tests", "residualRisks", "deliveryMarkdown"],
  properties: {
    summary: { type: "string" },
    filesChanged: { type: "array", items: { type: "string" } },
    tests: { type: "array", items: { type: "string" } },
    residualRisks: { type: "array", items: { type: "string" } },
    deliveryMarkdown: { type: "string" },
  },
};

module.exports = {
  DEBATE_SCHEMA,
  GATE_SCHEMA,
  IMPLEMENTATION_SCHEMA,
  PLAN_SCHEMA,
  REPORT_SCHEMA,
  REVIEW_SCHEMA,
};
