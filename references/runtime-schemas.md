# Runtime Schemas

This file defines the concrete runtime templates for Kiln GPT.
Do not improvise alternate file shapes unless a real contradiction appears.

Template files live under `references/templates/`.

## `.kiln/config.json`

Purpose:

- persist project defaults across sessions
- avoid re-asking settled operator preferences
- snapshot bridge defaults without treating them as secrets

Schema:

```json
{
  "version": 1,
  "project_name": "string",
  "operator": {
    "style": "fast-direct",
    "advanced_controls": false
  },
  "defaults": {
    "brainstorm_depth": "balanced",
    "debate_rigor": "focused",
    "gate_profile": "vision-only",
    "execution_mode": "auto",
    "validation_posture": "local-first"
  },
  "bridges": {
    "planning_command": null,
    "codex_command": "codex"
  },
  "memory": {
    "mirror_soft_preferences": true,
    "last_synced_at": null
  }
}
```

Rules:

- store defaults and bridge command names only
- never store secret values
- update only when the operator changes a durable preference

## `STATE.md`

Purpose:

- human-readable control-plane state
- canonical resume source
- minimal live context for `kiln-peek` and `kiln-fire`

Required sections:

1. header metadata block
2. active agents
3. blocked tasks
4. last completed milestone
5. next safe point

Rules:

- one current truth only
- overwrite the file in place on stage transitions
- keep old detail in `events.md`, not here

## `events.md`

Purpose:

- append-only ledger of meaningful control-plane events
- durable explanation for why the current state exists

Rules:

- append newest events to the top or bottom consistently within a run
- log phase transitions, gate decisions, failures, resumes, resets, and bridge posture changes
- keep each event compact enough for `kiln-peek` to summarize quickly

## `docs/`

Ownership:

- Visionary: `VISION.md`
- Architect: `architecture.md`, `decisions.md`, `tech-stack.md`, `master-plan.md`
- Sentinel: `constraints.md`, `patterns.md`, `pitfalls.md`

Rules:

- each file has one durable owner
- files should be updated in place, not forked into variants
- if a debate produces intermediate artifacts, keep them under `reports/planning/`

Common Stage 1 additions:

- brainstorming can enrich `VISION.md`
- brownfield mapping can seed `tech-stack.md`, `decisions.md`, `constraints.md`, and `pitfalls.md`

## `tasks/`

Supported shape for v1:

- one phase ledger file per phase, named `phase-<nn>.md`

Each phase ledger must expose:

- queued tasks
- active tasks
- blocked tasks
- failed tasks
- completed tasks
- owning agent or worker
- related plan phase id
- review round count
- archive path after completion

## `reports/`

Use for derived artifacts, not canonical truth.

Examples:

- planning debate transcript
- plan validation output
- brownfield codebase snapshot
- execution review artifacts
- task output summaries
- archived phase summaries
- validation test results
- validation failure reports
- correction-phase artifacts
- final report
- archived phase summaries

Recommended reusable templates:

- `references/templates/reports/planning/`
- `references/templates/reports/mapping/`
- `references/templates/reports/execution/`
- `references/templates/reports/validation/`
- `references/templates/reports/final/`
