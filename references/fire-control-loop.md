# Fire Control Loop

`kiln-fire` is the single supervisor for a run.

## Entry Routing

1. Read `.kiln/config.json` if it exists.
2. Read `.kiln/current-run.txt` if it exists.
3. Inspect the referenced run state.
4. Route by truth in files:

| Condition | Action |
|---|---|
| no `.kiln/` state | run `kiln-init` |
| current run is `PAUSED`, `FAILED`, or `ABORTED` | run `kiln-resume` |
| current run is active | continue current run |
| current run is `COMPLETE` | suggest a fresh run unless the user clearly wants reuse |
| state is contradictory | stop and surface the contradiction |

## Minimal Onboarding

Before brainstorm, ask only:

- operator style or experience posture
- whether advanced controls are wanted

Persist durable answers to `.kiln/config.json`.
Mirror soft preferences to Claude memory only when useful and low-risk.

## Post-Vision Adaptive Questions

After `VISION.md` approval, ask only execution-essential questions that are not
already settled in `.kiln/config.json`:

- debate rigor
- gate profile override
- execution mode if Codex is missing
- credential readiness
- any advanced control that became relevant

## Stage Routing

| State | Next action |
|---|---|
| `INIT` | `MAP` for brownfield, otherwise `BRAINSTORM` |
| `MAP` | `BRAINSTORM` |
| `BRAINSTORM` | wait for `VISION.md` approval, then `RESEARCH` |
| `RESEARCH` | `ARCHITECT` |
| `ARCHITECT` | `BUILD_PLAN[1]` after approval |
| `BUILD_PLAN[n]` | `BUILD_EXECUTE[n]` |
| `BUILD_EXECUTE[n]` | `BUILD_REVIEW[n]` |
| `BUILD_REVIEW[n]` | next build phase or `VALIDATE` |
| `VALIDATE` | correction loop back to `BUILD_PLAN[n+1]` or `REPORT` |
| `REPORT` | produce final report, then `COMPLETE` |

## Persistent Mind Boundaries

Bootstrap or respawn minds:

- after init, before brainstorm
- after architecture approval
- after each completed build phase
- before validation

## Bridge Posture

If Codex is unavailable:

- warn clearly once
- record `claude-native` posture
- continue unless the operator explicitly declines

If Codex is available:

- record `bridge-ready`
- prefer Codex-backed implementation for Stage 3

## Status Discipline

- keep ambient status minimal
- log detail in files, not in control-plane chatter
- surface only the current stage, blockages, and next safe point
