---
name: kiln-build
description: Run Kiln GPT Stage 3 execution. Use for per-phase planning, sharpened prompts, implementation, review loops, merges, reconciliation, and phase archival.
---

# Kiln Build

Build one phase at a time.

Use:

- [execution-contract.md](../../references/execution-contract.md)
- [review-contract.md](../../references/review-contract.md)
- [mind-contracts.md](../../references/mind-contracts.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)
- [planning-contract.md](../../references/planning-contract.md)
- [fire-control-loop.md](../../references/fire-control-loop.md)

## Execution Loop

1. index the current codebase
2. derive or refresh the current phase ledger and task graph
3. sharpen task prompts against current reality
4. implement
5. review and fix
6. merge
7. reconcile living docs
8. archive the phase

## Deliverables

- `tasks/phase-<nn>.md`
- `reports/execution/outputs/*`
- `reports/execution/reviews/*`
- `reports/execution/archive/phase-<nn>/phase-summary.md`

## Roles

- Maestro coordinates the phase
- Scheherazade sharpens prompts
- Workers implement bounded tasks
- Sphinx reviews
- Sherlock reconciles evidence-driven docs
- Architect and Sentinel refresh durable guidance after execution

## Rules

- no new phase until the current one is merged and reconciled
- max three review rounds per phase
- ambiguous requirements must stop the loop and surface to the operator
- if Codex is absent, reduce task size and tighten review
- review is mandatory even when implementation appears clean
- phase archives are history, not canonical truth
- on resume, pre-mark completed tasks and restart from the last safe point instead of replaying the whole phase
