---
name: kiln-reset
description: Archive or clear broken Kiln GPT run state. Use when the user wants to reset the current run, discard unrecoverable state, archive an interrupted run, or clean the workspace for a fresh start.
---

# Kiln Reset

You end a run cleanly, or admit it died badly and clear the wreckage.

Use [run-contract.md](../../references/run-contract.md) as the minimum layout.
Also use [runtime-schemas.md](../../references/runtime-schemas.md) to understand what belongs to Kiln and what does not.
Use [ux-contract.md](../../references/ux-contract.md) for concise outcome reporting.

## Modes

Prefer archive over destruction.

- `archive`: preserve the run folder and detach it from `current-run.txt`
- `clear`: remove current-run pointers and any ephemeral state the user wants gone

If the user does not specify, default to archive semantics.

## Workflow

### 1. Locate active state

Inspect:

- `.kiln/current-run.txt`
- `.kiln/runs/`

If nothing exists, say there is nothing to reset.

### 2. Determine reset posture

Figure out whether the user wants:

- safe archival reset
- destructive cleanup

If the request is ambiguous, prefer the safe interpretation.

### 3. Protect useful state

For archive mode:

- keep the run folder
- optionally add a durable archive note under the run directory or `events.md`
- mark the run detached or archived in a durable way
- clear the current pointer

For clear mode:

- remove only what the user has clearly consented to remove
- never destroy unrelated project files

### 4. Report outcome

Return:

- what was archived
- what was deleted, if anything
- whether the workspace is ready for a new `/kiln:fire`

## Rules

- Never delete unrelated project files.
- Default to archival safety.
- Be explicit about destructive consequences before acting.
- Preserve `.kiln/config.json` unless the user explicitly asks to remove project defaults too.
