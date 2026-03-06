# Kiln GPT Run Contract

This reference defines the minimum durable state expected by Kiln GPT skills.
Use it with:

- `runtime-schemas.md` for exact file templates
- `mind-contracts.md` for persistent mind ownership
- `planning-contract.md` for Stage 2 planning artifacts

## Canonical Layout

```text
.kiln/
  config.json
  current-run.txt
  runs/
    <run_id>/
      STATE.md
      manifest.md
      events.md
      docs/
      tasks/
      reports/
```

## Required Files

### `.kiln/config.json`

Project-level defaults that survive across runs.
Minimum fields:

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
    "execution_mode": "auto"
  },
  "bridges": {
    "planning_command": null,
    "codex_command": "codex"
  },
  "memory": {
    "mirror_soft_preferences": true
  }
}
```

### `.kiln/current-run.txt`

Contains exactly one line: the active run id.

Example:

```text
r20260306-001
```

### `.kiln/runs/<run_id>/STATE.md`

Human-readable control-plane state. Minimum fields:

```text
# Kiln State

- run_id: r20260306-001
- status: INIT | MAP | BRAINSTORM | RESEARCH | ARCHITECT | BUILD_PLAN | BUILD_EXECUTE | BUILD_REVIEW | VALIDATE | REPORT | COMPLETE | PAUSED | FAILED | ABORTED
- project_kind: greenfield | brownfield | returning
- current_phase: free text
- current_stage_owner: free text
- gate_profile: vision-only | phase-checkpoints | strict
- debate_rigor: focused | full
- execution_mode: auto | codex-preferred | claude-only
- bridge_posture: bridge-ready | claude-native | unknown
- last_event_at: ISO-8601 timestamp
- active_agents:
  - free text
- blocked_tasks:
  - free text
```

### `.kiln/runs/<run_id>/manifest.md`

Installation and run metadata:

- run id
- project root
- autonomy mode
- bridge availability
- creation timestamp
- plugin version
- project defaults snapshot

### `.kiln/runs/<run_id>/events.md`

Append-only event ledger. Newest event may be summarized by `kiln-peek`.

Each event should capture:

- timestamp
- kind
- stage
- actor
- summary
- next action, if relevant

### `.kiln/runs/<run_id>/tasks/`

One file per task or one ledger file per phase. The implementation may choose
either, but the status skill must be able to identify:

- queued tasks
- active tasks
- blocked tasks
- failed tasks

### `.kiln/runs/<run_id>/docs/`

Canonical durable docs. The minimum supported set is:

- `VISION.md`
- `architecture.md`
- `decisions.md`
- `tech-stack.md`
- `constraints.md`
- `patterns.md`
- `pitfalls.md`
- `master-plan.md`

## Skill Expectations

### `kiln-doctor`

Checks whether the expected layout can exist and whether the current workspace
is ready to host it.

### `kiln-peek`

Reads only from durable state. It should not infer pipeline status from chat
history or guess at live agent state when the files disagree.

### `kiln-init`

Creates any missing runtime files by adapting the templates under
`references/templates/` rather than improvising new shapes mid-run.
