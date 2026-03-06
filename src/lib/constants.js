"use strict";

const STAGES = ["brainstorm", "plan", "execute", "validate", "deploy", "report", "complete"];

const DEFAULT_CONFIG = {
  runtimeVersion: 1,
  host: {
    primary: "codex",
    brainstormModel: "gpt-5.4",
    planningModel: "gpt-5.2",
    synthesisModel: "gpt-5.4",
    implementationModel: "gpt-5-codex",
    validationModel: "gpt-5.4",
    enableMultiAgent: true,
  },
  claude: {
    enabled: true,
    planningModel: "opus",
    debateModel: "opus",
    reviewModel: "opus",
  },
  execution: {
    qaRounds: 3,
    correctionCycles: 3,
    codexTimeoutSeconds: 900,
    claudeTimeoutSeconds: 900,
    defaultBranch: "main",
  },
};

module.exports = {
  DEFAULT_CONFIG,
  STAGES,
};
