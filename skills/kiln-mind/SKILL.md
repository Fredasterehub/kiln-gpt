---
name: kiln-mind
description: Manage Kiln GPT persistent minds. Use to bootstrap, consult, serialize, and respawn Visionary, Architect, and Sentinel without blurring file ownership.
---

# Kiln Mind

You run the persistent mind lifecycle.

Use:

- [mind-contracts.md](../../references/mind-contracts.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)
- [fire-control-loop.md](../../references/fire-control-loop.md)

## Responsibilities

- bootstrap Visionary, Architect, and Sentinel from durable state
- enforce owned artifact boundaries
- route consultation requests cleanly
- serialize mind state back into canonical files
- respawn minds only at macro-boundaries

## Workflow

### 1. Determine which minds are needed

- brainstorm -> Visionary, Architect, Sentinel
- planning -> all three
- build -> Architect and Sentinel by default, Visionary when scope or acceptance changes
- validate -> all three

### 2. Bootstrap from durable truth

Each mind reads:

- `STATE.md`
- latest relevant `events.md` entries
- its owned docs only

If an owned file is missing, create or repair it from the runtime template and log the repair.

### 3. Enforce ownership

- Visionary writes only `VISION.md`
- Architect writes only architecture, decisions, tech-stack, and master-plan docs
- Sentinel writes only constraints, patterns, and pitfalls docs

No mind writes another mind's files.

### 4. Handle consultations

Use the compact `[kiln]` envelope from `mind-contracts.md`.
Replies must state:

- direct answer
- artifact impact
- whether execution should change

### 5. Serialize and self-check

Before shutdown or respawn:

- write owned files
- verify they still agree with `STATE.md`
- log meaningful updates in `events.md`

If self-check fails, block shutdown and escalate to `kiln-fire`.

## Rules

- Persistent minds are internal actors, not operator-facing chat endpoints.
- Do not treat scratch notes as mind memory when canonical files disagree.
- If a mind needs to write outside its ownership, that is a coordination bug.
