---
name: kiln-init
description: Initialize a Kiln GPT run in the current project. Use when the user wants to start Kiln in a workspace, prepare `.kiln/` state, classify the project as greenfield or brownfield, or bootstrap run metadata before orchestration begins.
---

# Kiln Init

You prepare the ground before the rest of Kiln arrives.

Use [run-contract.md](../../references/run-contract.md) and
[state-machine.md](../../references/state-machine.md) as the source of truth.
Also use:

- [runtime-schemas.md](../../references/runtime-schemas.md)
- [fire-control-loop.md](../../references/fire-control-loop.md)
- `../../references/templates/`

## Goals

Create the minimum durable run structure for a new or returning workspace:

- `.kiln/`
- `.kiln/config.json`
- `.kiln/current-run.txt`
- `.kiln/runs/<run_id>/`
- `STATE.md`
- `manifest.md`
- `events.md`
- `docs/`
- `tasks/`
- `reports/`

## Workflow

### 1. Classify the workspace

Determine whether the project is:

- `greenfield`
- `brownfield`
- `returning`

Heuristics:

- existing codebase with meaningful source files -> `brownfield`
- mostly empty repo or fresh directory -> `greenfield`
- existing `.kiln/current-run.txt` or `.kiln/runs/` -> `returning`

### 2. Decide whether to initialize or hand off

- If the workspace is `returning`, do not blindly overwrite state.
- If a live run already exists, advise `kiln-peek` or `kiln-resume`.
- Only create a fresh run when doing so will not clobber an existing one.

### 3. Create run state

For a new run:

- mint a unique `run_id`
- ensure `.kiln/config.json` exists from the runtime template
- create the canonical directory structure
- write `current-run.txt`
- write `STATE.md`, `manifest.md`, and `events.md` from templates
- seed the canonical `docs/` files from templates
- keep `tasks/` and `reports/` ready, even if initially empty
- append an initialization event to `events.md`

### 4. Record bridge posture

Capture whether this run is starting in:

- `bridge-ready`
- `claude-native`
- `unknown`

Do not fail init purely because Codex is missing.
Record the posture and let `kiln-doctor` or later stages explain the tradeoff.

### 5. Record the initial operator defaults

If `.kiln/config.json` is new or incomplete, persist only:

- operator style
- advanced controls flag
- default brainstorm depth
- default debate rigor
- default gate profile
- default execution mode

Do not ask for post-vision execution details yet.
Do not store secrets.

### 6. Return a clean handoff

Summarize:

- run id
- project kind
- whether mapping is expected
- whether the run appears bridge-ready or Claude-native
- next stage

## Rules

- Never destroy existing run state during init.
- Prefer partial initialization plus a clear warning over unsafe overwrite.
- Keep `STATE.md` human-readable.
- Keep `events.md` append-only.
- Reuse the provided templates instead of inventing new file shapes.
