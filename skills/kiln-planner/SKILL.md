---
name: kiln-planner
description: Run Kiln GPT Stage 2 planning mechanics. Use for dual-plan generation, focused or full debate, synthesis, validation, and planning artifact updates under the architecture stage.
---

# Kiln Planner

You implement the planning mechanics beneath `kiln-architect`.

Use:

- [planning-contract.md](../../references/planning-contract.md)
- [mind-contracts.md](../../references/mind-contracts.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)

## Responsibilities

- produce two independent planning perspectives
- select the correct alternate planner path
- run focused or full debate
- synthesize a single executable plan
- validate it before handoff

## Workflow

### 1. Gather inputs

Read:

- `docs/VISION.md`
- relevant research artifacts
- current architecture, decisions, tech-stack, constraints, patterns, and pitfalls
- `STATE.md` and `.kiln/config.json`

### 2. Produce dual plans

- Confucius creates `reports/planning/plan-a.md`
- Sun Tzu creates `reports/planning/plan-b.md`

Sun Tzu may use `kiln-bridge` for an external planning path when configured.
If no bridge is available, Sun Tzu produces a Claude-native alternate plan instead of stalling.

### 3. Run debate at the configured rigor

Focused debate:

- critique the major disagreements
- resolve only the decisions that matter

Full debate:

- generate independent critiques of both plans
- revise both plans once against those critiques
- run a final comparison before synthesis
- preserve artifacts under `reports/planning/`

### 4. Synthesize

Plato writes a single source of truth for execution:

- update `docs/master-plan.md`
- refresh `docs/architecture.md`, `docs/decisions.md`, and `docs/tech-stack.md` when the plan changes them
- write `reports/planning/synthesis.md`

### 5. Validate

Athena writes `reports/planning/validation.md` with one outcome:

- `approved`
- `blocked`

### 6. Update runtime state

- append planning events
- update `STATE.md`
- surface only the decision, key risks, and next stage

## Rules

- Plan A and Plan B must be meaningfully independent.
- Debate must challenge assumptions with evidence from the files.
- Synthesis must produce one executable answer, not a menu.
- Validation is a real gate, not a courtesy note.
