"use strict";

const path = require("node:path");

const { readText, writeText } = require("./fs");
const { projectPaths, repoRoot } = require("./paths");

function readAgentSpec(projectRoot, name) {
  const agentPath = path.join(projectPaths(projectRoot).agentRoot, `${name}.md`);
  return readText(agentPath).trim();
}

function readRuntimeReference(...parts) {
  return readText(path.join(repoRoot(), ...parts));
}

function contextBlock(label, value) {
  return [`## ${label}`, "", value.trim(), ""].join("\n");
}

function buildBrainstormPrompt(projectRoot, run) {
  const playbook = readRuntimeReference("references", "brainstorm-playbook.md");
  const techniques = readRuntimeReference("references", "data", "brainstorming-techniques.json");
  const elicitation = readRuntimeReference("references", "data", "elicitation-methods.json");
  return [
    readAgentSpec(projectRoot, "brainstorm"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Brainstorm Playbook", playbook),
    contextBlock("Technique Bank", techniques),
    contextBlock("Elicitation Methods", elicitation),
    contextBlock(
      "Execution Contract",
      [
        `Write the durable output to ${path.join(run.paths.docsDir, "vision.md")}.`,
        `Keep all working notes inside ${run.paths.runDir}.`,
        "Do not start implementation.",
        "Start by asking the operator to choose brainstorm depth and conversation style.",
        "Use the BMAD technique and elicitation catalogs directly; do not reduce them to generic brainstorming.",
        "Use the brainstorm playbook to decide how aggressive the exploration should be.",
        "When the brainstorm is complete, tell the operator to run `kiln resume --stage plan --auto`.",
      ].join("\n"),
    ),
  ].join("\n");
}

function buildPlanningPrompt(projectRoot, run, visionText, plannerKind) {
  return [
    readAgentSpec(projectRoot, plannerKind === "codex" ? "planner-codex" : "planner-claude"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Vision", visionText),
    contextBlock(
      "Output Contract",
      [
        "Return only structured data matching the provided schema.",
        "Break work into implementation phases sized for roughly 1 to 4 hours.",
        "Each phase must include verification steps and acceptance criteria.",
      ].join("\n"),
    ),
  ].join("\n");
}

function buildDebatePrompt(projectRoot, run, codexPlan, claudePlan) {
  return [
    readAgentSpec(projectRoot, "debater"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Codex Plan", JSON.stringify(codexPlan, null, 2)),
    contextBlock("Claude Plan", JSON.stringify(claudePlan, null, 2)),
    contextBlock(
      "Output Contract",
      "Select the stronger ideas from both plans, expose weak assumptions, and return only structured data.",
    ),
  ].join("\n");
}

function buildSynthesisPrompt(projectRoot, run, codexPlan, claudePlan, debate) {
  return [
    readAgentSpec(projectRoot, "synthesizer"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Codex Plan", JSON.stringify(codexPlan, null, 2)),
    contextBlock("Claude Plan", JSON.stringify(claudePlan, null, 2)),
    contextBlock("Debate", JSON.stringify(debate, null, 2)),
    contextBlock(
      "Output Contract",
      [
        "Return only structured data matching the provided schema.",
        "The `masterPlanMarkdown` field must be publication-ready markdown for docs/master-plan.md.",
      ].join("\n"),
    ),
  ].join("\n");
}

function buildImplementationPrompt(projectRoot, run, phase, supportDocs) {
  return [
    readAgentSpec(projectRoot, "implementer"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Phase", JSON.stringify(phase, null, 2)),
    contextBlock("Support Docs", supportDocs),
    contextBlock(
      "Execution Contract",
      [
        "Implement only the current phase.",
        "Run the smallest useful verification commands yourself.",
        "Do not commit, merge, or change unrelated files.",
        "Return only structured data.",
      ].join("\n"),
    ),
  ].join("\n");
}

function buildCorrectionPrompt(projectRoot, run, phase, reviewPayload) {
  return [
    readAgentSpec(projectRoot, "optimizer"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Phase", JSON.stringify(phase, null, 2)),
    contextBlock("Review", JSON.stringify(reviewPayload, null, 2)),
    contextBlock(
      "Execution Contract",
      "Apply only the required fixes, rerun the relevant checks, and return only structured data.",
    ),
  ].join("\n");
}

function buildClaudeReviewPrompt(projectRoot, run, phase, codexReviewText) {
  return [
    readAgentSpec(projectRoot, "reviewer-claude"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Phase", JSON.stringify(phase, null, 2)),
    contextBlock("Codex Review", codexReviewText || "No Codex review output."),
    contextBlock(
      "Review Contract",
      "Act as the final approval gate. Return only structured data. Reject if correctness, completeness, or verification quality is weak.",
    ),
  ].join("\n");
}

function buildValidationPrompt(projectRoot, run, plan, cycleNumber) {
  return [
    readAgentSpec(projectRoot, "validator"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Master Plan", JSON.stringify(plan, null, 2)),
    contextBlock(
      "Validation Contract",
      [
        `This is validation cycle ${cycleNumber}.`,
        "Build, test, and inspect the actual product. Use Playwright or other local tools if the project shape requires them.",
        "If deployment credentials are missing, report them explicitly instead of guessing.",
        "Return only structured data.",
      ].join("\n"),
    ),
  ].join("\n");
}

function buildDeploymentPrompt(projectRoot, run, plan) {
  return [
    readAgentSpec(projectRoot, "deployer"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Master Plan", JSON.stringify(plan, null, 2)),
    contextBlock(
      "Deployment Contract",
      "Perform the safest real deployment path available in this repository, validate a happy-path flow, and return only structured data.",
    ),
  ].join("\n");
}

function buildReportPrompt(projectRoot, run, plan, validationPayload, deploymentPayload) {
  return [
    readAgentSpec(projectRoot, "reporter"),
    "",
    contextBlock("Run State", JSON.stringify(run.state, null, 2)),
    contextBlock("Master Plan", JSON.stringify(plan, null, 2)),
    contextBlock("Validation", JSON.stringify(validationPayload, null, 2)),
    contextBlock("Deployment", JSON.stringify(deploymentPayload, null, 2)),
    contextBlock(
      "Report Contract",
      "Return only structured data. The delivery markdown should read like an operator handoff, not an internal log.",
    ),
  ].join("\n");
}

function persistPrompt(promptPath, promptText) {
  writeText(promptPath, `${promptText}\n`);
}

module.exports = {
  buildBrainstormPrompt,
  buildClaudeReviewPrompt,
  buildCorrectionPrompt,
  buildDebatePrompt,
  buildDeploymentPrompt,
  buildImplementationPrompt,
  buildPlanningPrompt,
  buildReportPrompt,
  buildSynthesisPrompt,
  buildValidationPrompt,
  persistPrompt,
};
