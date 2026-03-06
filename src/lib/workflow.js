"use strict";

const path = require("node:path");

const { cliAvailable, launchCodexInteractive, runClaudePrint, runCodexExec, runCodexReview, runGit } = require("./adapters");
const { ACTIVE_SLICE_SCHEMA, DEBATE_SCHEMA, GATE_SCHEMA, IMPLEMENTATION_SCHEMA, PLAN_SCHEMA, REPORT_SCHEMA, REVIEW_SCHEMA } = require("./schemas");
const {
  appendEvent,
  ensureProjectInitialized,
  ensureRun,
  loadConfig,
  loadCurrentRun,
  readDoc,
  setStage,
  updateCurrentRun,
  writeArtifact,
  writeDoc,
} = require("./state");
const {
  buildBrainstormPrompt,
  buildActiveSlicePrompt,
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
} = require("./prompts");
const { readJson, slugify } = require("./fs");

function doctor(projectRoot) {
  ensureProjectInitialized(projectRoot);
  const checks = [];

  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
  checks.push({
    name: "node",
    status: nodeMajor >= 20 ? "pass" : "warn",
    message: `Node.js ${process.versions.node}`,
  });
  checks.push({
    name: "git",
    status: cliAvailable("git") ? "pass" : "fail",
    message: cliAvailable("git") ? "git available" : "git missing",
  });
  checks.push({
    name: "codex",
    status: cliAvailable("codex") ? "pass" : "fail",
    message: cliAvailable("codex") ? "codex CLI available" : "codex CLI missing",
  });
  checks.push({
    name: "claude",
    status: cliAvailable("claude") ? "pass" : "warn",
    message: cliAvailable("claude") ? "claude CLI available" : "claude CLI missing; sidecar steps will be skipped",
  });
  checks.push({
    name: "playwright",
    status: cliAvailable("npx") ? "pass" : "warn",
    message: cliAvailable("npx") ? "npx available for Playwright flows" : "npx missing; browser validation may need manual setup",
  });

  return { checks };
}

function currentBaseBranch(projectRoot, configured) {
  try {
    const result = runGit(["branch", "--show-current"], projectRoot);
    const current = (result.stdout || "").trim();
    return current || configured;
  } catch {
    return configured;
  }
}

function checkoutPhaseBranch(projectRoot, baseBranch, phase) {
  const branchName = `kiln/${phase.id}-${slugify(phase.title)}`;
  runGit(["checkout", baseBranch], projectRoot);
  runGit(["checkout", "-B", branchName], projectRoot);
  return branchName;
}

function maybeCommitPhase(projectRoot, phase) {
  const status = runGit(["status", "--short"], projectRoot).stdout.trim();
  if (!status) {
    return false;
  }

  runGit(["add", "-A"], projectRoot);
  runGit(["commit", "-m", `kiln: ${phase.id} ${phase.title}`], projectRoot);
  return true;
}

function mergePhaseBranch(projectRoot, baseBranch, branchName) {
  runGit(["checkout", baseBranch], projectRoot);
  runGit(["merge", "--no-ff", branchName, "-m", `merge ${branchName}`], projectRoot);
}

function savePrompt(run, name, promptText) {
  const promptPath = path.join(run.paths.promptsDir, `${name}.md`);
  persistPrompt(promptPath, promptText);
  return promptPath;
}

function requireVision(run) {
  const visionText = readDoc(run, "vision.md");
  if (visionText.includes("Replace this file")) {
    throw new Error("Vision doc is still a template. Complete brainstorm first.");
  }
  return visionText;
}

async function runPlanningStage(projectRoot, run, config) {
  const visionText = requireVision(run);
  const codexPrompt = buildPlanningPrompt(projectRoot, run, visionText, "codex");
  savePrompt(run, "plan-codex", codexPrompt);

  const codexPlan = runCodexExec({
    name: "codex-plan",
    model: config.host.planningModel,
    prompt: codexPrompt,
    schema: PLAN_SCHEMA,
    workdir: projectRoot,
    timeoutSeconds: config.execution.codexTimeoutSeconds,
    tmpDir: run.paths.tmpDir,
    enableMultiAgent: config.host.enableMultiAgent,
  });

  let claudePlan = codexPlan;
  let debate = {
    winner: "codex",
    strengths: [],
    gaps: [],
    requiredChanges: [],
    summary: "Claude planning disabled.",
  };

  if (config.claude.enabled && cliAvailable("claude")) {
    const claudePrompt = buildPlanningPrompt(projectRoot, run, visionText, "claude");
    savePrompt(run, "plan-claude", claudePrompt);
    claudePlan = runClaudePrint({
      model: config.claude.planningModel,
      prompt: claudePrompt,
      schema: PLAN_SCHEMA,
      workdir: projectRoot,
      timeoutSeconds: config.execution.claudeTimeoutSeconds,
    });

    const debatePrompt = buildDebatePrompt(projectRoot, run, codexPlan, claudePlan);
    savePrompt(run, "plan-debate", debatePrompt);
    debate = runClaudePrint({
      model: config.claude.debateModel,
      prompt: debatePrompt,
      schema: DEBATE_SCHEMA,
      workdir: projectRoot,
      timeoutSeconds: config.execution.claudeTimeoutSeconds,
    });
  }

  const synthesisPrompt = buildSynthesisPrompt(projectRoot, run, codexPlan, claudePlan, debate);
  savePrompt(run, "plan-synthesis", synthesisPrompt);
  const masterPlan = runCodexExec({
    name: "master-plan",
    model: config.host.synthesisModel,
    prompt: synthesisPrompt,
    schema: PLAN_SCHEMA,
    workdir: projectRoot,
    timeoutSeconds: config.execution.codexTimeoutSeconds,
    tmpDir: run.paths.tmpDir,
    enableMultiAgent: config.host.enableMultiAgent,
  });

  writeArtifact(run, "outputs/codex-plan.json", codexPlan);
  writeArtifact(run, "outputs/claude-plan.json", claudePlan);
  writeArtifact(run, "outputs/plan-debate.json", debate);
  writeArtifact(run, "outputs/master-plan.json", masterPlan);
  writeDoc(run, "master-plan.md", masterPlan.masterPlanMarkdown);

  updateCurrentRun(projectRoot, (state) => ({
    ...state,
    stage: "execute",
    status: "ready",
    nextAction: "Execute the approved phase plan.",
    planPath: path.join(run.paths.outputsDir, "master-plan.json"),
  }));
  appendEvent(run.paths, {
    timestamp: new Date().toISOString(),
    kind: "plan_ready",
    stage: "plan",
    summary: "Master plan synthesized and approved.",
  });
}

function supportDocs(run) {
  return [
    "### architecture.md",
    readDoc(run, "architecture.md").trim(),
    "",
    "### decisions.md",
    readDoc(run, "decisions.md").trim(),
    "",
    "### pitfalls.md",
    readDoc(run, "pitfalls.md").trim(),
    "",
    "### master-plan.md",
    readDoc(run, "master-plan.md").trim(),
  ].join("\n");
}

async function runExecutionStage(projectRoot, run, config) {
  const plan = readJson(path.join(run.paths.outputsDir, "master-plan.json"));
  const baseBranch = currentBaseBranch(projectRoot, config.execution.defaultBranch);

  for (const phase of plan.phases) {
    if (run.state.completedPhases.includes(phase.id)) {
      continue;
    }

    updateCurrentRun(projectRoot, (state) => ({
      ...state,
      stage: "execute",
      status: "running",
      currentPhase: phase.id,
      nextAction: `Implement ${phase.title}.`,
    }));

    const branchName = checkoutPhaseBranch(projectRoot, baseBranch, phase);
    const currentRun = loadCurrentRun(projectRoot);
    const docsBundle = supportDocs(currentRun);
    const slicePrompt = buildActiveSlicePrompt(projectRoot, currentRun, phase, docsBundle);
    savePrompt(currentRun, `slice-${phase.id}`, slicePrompt);
    const activeSlice = runCodexExec({
      name: `slice-${phase.id}`,
      model: config.host.planningModel,
      prompt: slicePrompt,
      schema: ACTIVE_SLICE_SCHEMA,
      workdir: projectRoot,
      timeoutSeconds: config.execution.codexTimeoutSeconds,
      tmpDir: currentRun.paths.tmpDir,
      enableMultiAgent: config.host.enableMultiAgent,
    });
    writeArtifact(currentRun, `plans/${phase.id}-slice.json`, activeSlice);
    writeArtifact(currentRun, `plans/${phase.id}-slice.md`, activeSlice.sliceMarkdown);

    const prompt = buildImplementationPrompt(projectRoot, currentRun, {
      ...phase,
      activeSlice,
    }, docsBundle);
    savePrompt(currentRun, `execute-${phase.id}`, prompt);
    const implementation = runCodexExec({
      name: `implement-${phase.id}`,
      model: config.host.implementationModel,
      prompt,
      schema: IMPLEMENTATION_SCHEMA,
      workdir: projectRoot,
      timeoutSeconds: config.execution.codexTimeoutSeconds,
      tmpDir: currentRun.paths.tmpDir,
      enableMultiAgent: config.host.enableMultiAgent,
    });
    writeArtifact(currentRun, `outputs/${phase.id}-implementation.json`, implementation);

    let approved = false;
    for (let round = 1; round <= config.execution.qaRounds; round += 1) {
      const currentRun = loadCurrentRun(projectRoot);
      const codexReviewText = runCodexReview({
        workdir: projectRoot,
        prompt: `Review the uncommitted changes for phase ${phase.id} ${phase.title}. Be strict about correctness, regressions, and missing verification.`,
        timeoutSeconds: config.execution.codexTimeoutSeconds,
      });

      const reviewPrompt = buildClaudeReviewPrompt(projectRoot, currentRun, phase, codexReviewText);
      savePrompt(currentRun, `review-${phase.id}-round-${round}`, reviewPrompt);
      const review = config.claude.enabled && cliAvailable("claude")
        ? runClaudePrint({
            model: config.claude.reviewModel,
            prompt: reviewPrompt,
            schema: REVIEW_SCHEMA,
            workdir: projectRoot,
            timeoutSeconds: config.execution.claudeTimeoutSeconds,
          })
        : {
            approved: true,
            summary: "Claude review disabled.",
            findings: [],
            requiredFixes: [],
            suggestedChecks: [],
            reviewMarkdown: "Claude review disabled.",
          };

      writeArtifact(currentRun, `reviews/${phase.id}-round-${round}.json`, review);
      writeArtifact(currentRun, `reviews/${phase.id}-round-${round}.md`, review.reviewMarkdown);
      if (review.approved) {
        approved = true;
        break;
      }

      const correctionPrompt = buildCorrectionPrompt(projectRoot, currentRun, phase, review);
      savePrompt(currentRun, `fix-${phase.id}-round-${round}`, correctionPrompt);
      const fix = runCodexExec({
        name: `fix-${phase.id}-round-${round}`,
        model: config.host.implementationModel,
        prompt: correctionPrompt,
        schema: IMPLEMENTATION_SCHEMA,
        workdir: projectRoot,
        timeoutSeconds: config.execution.codexTimeoutSeconds,
        tmpDir: currentRun.paths.tmpDir,
        enableMultiAgent: config.host.enableMultiAgent,
      });
      writeArtifact(currentRun, `outputs/${phase.id}-fix-round-${round}.json`, fix);
    }

    if (!approved) {
      throw new Error(`Phase ${phase.id} failed review after ${config.execution.qaRounds} rounds.`);
    }

    const verifyArtifact = [
      `# Verify ${phase.id}`,
      "",
      `## Objective`,
      "",
      activeSlice.objective,
      "",
      "## Verification Checklist",
      "",
      ...activeSlice.verificationChecklist.map((item) => `- ${item}`),
      "",
      "## Review Evidence",
      "",
      `- Native Codex review executed`,
      `- Claude approval gate ${config.claude.enabled && cliAvailable("claude") ? "executed" : "skipped"}`,
      "",
      "## Status",
      "",
      "- Phase approved for merge.",
      "",
    ].join("\n");
    writeArtifact(loadCurrentRun(projectRoot), `validation/${phase.id}-verify.md`, verifyArtifact);

    maybeCommitPhase(projectRoot, phase);
    mergePhaseBranch(projectRoot, baseBranch, branchName);

    updateCurrentRun(projectRoot, (state) => ({
      ...state,
      stage: "execute",
      status: "ready",
      currentPhase: null,
      completedPhases: [...state.completedPhases, phase.id],
      nextAction: "Continue to the next phase or validation.",
    }));
    appendEvent(loadCurrentRun(projectRoot).paths, {
      timestamp: new Date().toISOString(),
      kind: "phase_complete",
      stage: "execute",
      summary: `${phase.id} ${phase.title} complete.`,
    });
  }

  setStage(projectRoot, "validate", "Run end-to-end validation.");
}

async function runValidationStage(projectRoot, run, config) {
  const plan = readJson(path.join(run.paths.outputsDir, "master-plan.json"));
  let gate = null;

  for (let cycle = 1; cycle <= config.execution.correctionCycles; cycle += 1) {
    const currentRun = updateCurrentRun(projectRoot, (state) => ({
      ...state,
      stage: "validate",
      status: "running",
      correctionCycle: cycle,
      nextAction: "Validate the built system.",
    }));

    const prompt = buildValidationPrompt(projectRoot, currentRun, plan, cycle);
    savePrompt(currentRun, `validate-cycle-${cycle}`, prompt);
    gate = runCodexExec({
      name: `validate-cycle-${cycle}`,
      model: config.host.validationModel,
      prompt,
      schema: GATE_SCHEMA,
      workdir: projectRoot,
      timeoutSeconds: config.execution.codexTimeoutSeconds,
      tmpDir: currentRun.paths.tmpDir,
      enableMultiAgent: config.host.enableMultiAgent,
    });
    writeArtifact(currentRun, `validation/cycle-${cycle}.json`, gate);
    writeArtifact(currentRun, `validation/cycle-${cycle}.md`, gate.reportMarkdown);

    if (gate.approved) {
      break;
    }

    if (cycle === config.execution.correctionCycles) {
      throw new Error("Validation failed after maximum correction cycles.");
    }

    const fixPrompt = buildCorrectionPrompt(projectRoot, currentRun, {
      id: `validation-cycle-${cycle}`,
      title: "Validation corrections",
    }, gate);
    savePrompt(currentRun, `validation-fix-cycle-${cycle}`, fixPrompt);
    runCodexExec({
      name: `validation-fix-cycle-${cycle}`,
      model: config.host.implementationModel,
      prompt: fixPrompt,
      schema: IMPLEMENTATION_SCHEMA,
      workdir: projectRoot,
      timeoutSeconds: config.execution.codexTimeoutSeconds,
      tmpDir: currentRun.paths.tmpDir,
      enableMultiAgent: config.host.enableMultiAgent,
    });
  }

  setStage(projectRoot, "deploy", "Run the final deployment agent.");
  return gate;
}

async function runDeploymentStage(projectRoot, run, config) {
  const plan = readJson(path.join(run.paths.outputsDir, "master-plan.json"));
  const currentRun = loadCurrentRun(projectRoot);
  const prompt = buildDeploymentPrompt(projectRoot, currentRun, plan);
  savePrompt(currentRun, "deploy", prompt);
  const deployment = runCodexExec({
    name: "deploy",
    model: config.host.validationModel,
    prompt,
    schema: GATE_SCHEMA,
    workdir: projectRoot,
    timeoutSeconds: config.execution.codexTimeoutSeconds,
    tmpDir: currentRun.paths.tmpDir,
    enableMultiAgent: config.host.enableMultiAgent,
  });
  writeArtifact(currentRun, "outputs/deployment.json", deployment);
  writeArtifact(currentRun, "outputs/deployment.md", deployment.reportMarkdown);

  if (!deployment.approved) {
    throw new Error("Deployment gate did not approve the run.");
  }

  setStage(projectRoot, "report", "Write final delivery report.");
  return deployment;
}

async function runReportStage(projectRoot, run, config) {
  const plan = readJson(path.join(run.paths.outputsDir, "master-plan.json"));
  const validation = readJson(path.join(run.paths.validationDir, `cycle-${loadCurrentRun(projectRoot).state.correctionCycle}.json`));
  const deployment = readJson(path.join(run.paths.outputsDir, "deployment.json"));
  const currentRun = loadCurrentRun(projectRoot);
  const prompt = buildReportPrompt(projectRoot, currentRun, plan, validation, deployment);
  savePrompt(currentRun, "report", prompt);
  const report = runCodexExec({
    name: "report",
    model: config.host.synthesisModel,
    prompt,
    schema: REPORT_SCHEMA,
    workdir: projectRoot,
    timeoutSeconds: config.execution.codexTimeoutSeconds,
    tmpDir: currentRun.paths.tmpDir,
    enableMultiAgent: config.host.enableMultiAgent,
  });
  writeArtifact(currentRun, "outputs/final-report.json", report);
  writeArtifact(currentRun, "outputs/final-report.md", report.deliveryMarkdown);
  updateCurrentRun(projectRoot, (state) => ({
    ...state,
    stage: "complete",
    status: "complete",
    nextAction: "Run complete. Review outputs/final-report.md.",
  }));
}

async function runAuto(projectRoot, requestedStage) {
  const config = loadConfig(projectRoot);
  let run = loadCurrentRun(projectRoot);
  const startStage = requestedStage || run.state.stage;

  if (startStage === "plan") {
    await runPlanningStage(projectRoot, run, config);
    run = loadCurrentRun(projectRoot);
  }
  if (loadCurrentRun(projectRoot).state.stage === "execute") {
    await runExecutionStage(projectRoot, loadCurrentRun(projectRoot), config);
  }
  if (loadCurrentRun(projectRoot).state.stage === "validate") {
    await runValidationStage(projectRoot, loadCurrentRun(projectRoot), config);
  }
  if (loadCurrentRun(projectRoot).state.stage === "deploy") {
    await runDeploymentStage(projectRoot, loadCurrentRun(projectRoot), config);
  }
  if (loadCurrentRun(projectRoot).state.stage === "report") {
    await runReportStage(projectRoot, loadCurrentRun(projectRoot), config);
  }
}

async function runFire(projectRoot, options) {
  const config = loadConfig(projectRoot);
  let run = ensureRun(projectRoot);

  if (options.stage) {
    setStage(projectRoot, options.stage, `Resume from ${options.stage}.`);
    run = loadCurrentRun(projectRoot);
  }

  if (options.auto && run.state.stage === "brainstorm") {
    try {
      requireVision(run);
      setStage(projectRoot, "plan", "Brainstorm artifacts found. Start planning.");
      run = loadCurrentRun(projectRoot);
    } catch {
      // Keep brainstorm as the active stage until the vision is complete.
    }
  }

  if (run.state.stage === "brainstorm" && !options.auto) {
    const prompt = buildBrainstormPrompt(projectRoot, run);
    const promptPath = savePrompt(run, "brainstorm", prompt);
    appendEvent(run.paths, {
      timestamp: new Date().toISOString(),
      kind: "brainstorm_opened",
      stage: "brainstorm",
      summary: "Prepared brainstorm session prompt.",
    });

    if (options.dryRun) {
      return { message: `Brainstorm prompt ready at ${promptPath}` };
    }

    launchCodexInteractive({
      workdir: projectRoot,
      model: config.host.brainstormModel,
      prompt,
    });
    return { message: `Brainstorm session launched. When vision.md is ready, run 'kiln resume --stage plan --auto'.` };
  }

  if (options.dryRun) {
    return { message: `Dry run: current stage is ${loadCurrentRun(projectRoot).state.stage}.` };
  }

  await runAuto(projectRoot, options.stage || run.state.stage);
  return { message: `Kiln advanced run ${loadCurrentRun(projectRoot).state.runId} to ${loadCurrentRun(projectRoot).state.stage}.` };
}

async function runResume(projectRoot, options) {
  ensureRun(projectRoot);
  if (options.stage) {
    setStage(projectRoot, options.stage, `Resume from ${options.stage}.`);
  }
  return runFire(projectRoot, options);
}

module.exports = {
  doctor,
  runFire,
  runResume,
};
