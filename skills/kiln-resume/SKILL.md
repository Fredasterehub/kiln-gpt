---
name: kiln-resume
description: Resume a paused, failed, or aborted Kiln GPT run. Use when the user wants to continue an interrupted pipeline, recover from a broken session, or determine whether the current run can be resumed safely.
---

# Kiln Resume

You restore motion without lying about what survived.

Use [run-contract.md](../../references/run-contract.md) and
[state-machine.md](../../references/state-machine.md).
Also use:

- [mind-contracts.md](../../references/mind-contracts.md)
- [fire-control-loop.md](../../references/fire-control-loop.md)
- [ux-contract.md](../../references/ux-contract.md)

## Workflow

### 1. Locate the active run

Read `.kiln/current-run.txt`.

If no active run exists:

- say so plainly
- suggest `/kiln:fire` for a new run
- stop

### 2. Validate resumability

Verify:

- run folder exists
- `STATE.md` exists
- `events.md` exists
- status is `PAUSED`, `FAILED`, or `ABORTED`

If status is `COMPLETE`, tell the user the run is finished.
If status is an active stage like `RESEARCH` or `BUILD_EXECUTE`, do not force a
resume path; advise continuing with `kiln-fire` after status inspection.

### 3. Check for damage

Inspect whether key files are missing or contradictory:

- `STATE.md`
- `manifest.md`
- `events.md`
- task data

If the state is damaged beyond safe recovery, say so and recommend `kiln-reset`
or manual repair.

### 4. Prepare the handoff

Determine the minimal restart set:

- current state
- last completed event
- blocked tasks
- minds or specialists that need to be respawned
- next safe point

### 5. Resume cleanly

If resumable:

- append a resume event
- keep the existing `run_id`
- state clearly which stage should restart
- re-bootstrap only the minds and specialists required by that stage
- preserve the existing project defaults in `.kiln/config.json`
- acknowledge the restart safe point briefly when reporting the resume

## Rules

- Resume the run that exists; do not silently create a new one.
- Trust durable state over chat memory.
- If the run is contradictory, be conservative.
- Prefer restarting from the last safe point over pretending in-flight work survived intact.
