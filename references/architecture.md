# Architecture

Kiln Codex is a local supervisor, not a chat prompt.

The core runtime lives in three layers:

1. `kiln` CLI
2. `.kiln/` file-backed run state
3. external workers invoked through `codex` and optionally `claude`

## Control Plane

The control plane is deterministic Node code:

- create or resume runs
- persist state
- write prompt packs
- invoke workers
- gate stage transitions
- enforce review and validation loops

## Workers

Codex is the host runtime:

- interactive brainstorm
- structured planning
- implementation
- native review
- validation
- deployment
- reporting

Claude is optional:

- independent planner
- debate sidecar
- final reviewer

## Durable Truth

All durable state lives under `.kiln/runs/<run_id>/`.

That makes the system resumable without betting on a single long conversation.
