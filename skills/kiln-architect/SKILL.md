---
name: kiln-architect
description: Run Kiln GPT Stage 2 planning and architecture. Use for dual planning, debate, synthesis, validation, and operator approval before implementation begins.
---

# Kiln Architect

This stage owns the gate between desire and execution.

Use:

- [planning-contract.md](../../references/planning-contract.md)
- [mind-contracts.md](../../references/mind-contracts.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)

## Responsibilities

- generate at least two planning perspectives
- reconcile disagreements deliberately
- synthesize a phaseable master plan
- validate that the plan is executable
- update the canonical docs, not just scratch artifacts
- stop execution until the required gate is approved

## Deliverables

- `master-plan.md`
- `reports/planning/plan-a.md`
- `reports/planning/plan-b.md`
- `reports/planning/debate.md`
- `reports/planning/synthesis.md`
- `reports/planning/validation.md`
- updated runtime handoff

## Workflow

1. Load `VISION.md`, relevant research, and the persistent mind artifacts.
2. Use `kiln-planner` to produce two planning perspectives.
3. Run focused or full debate according to the configured rigor.
4. Have Plato synthesize one executable plan.
5. Have Athena return a single gate result: approved or blocked.
6. Update `STATE.md`, `events.md`, and the canonical docs.

## Rules

- planning must stay phaseable
- validation is mandatory
- return one gate outcome only: approved or blocked
- Full debate must preserve critique, revise, and final comparison artifacts.
