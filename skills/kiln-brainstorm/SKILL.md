---
name: kiln-brainstorm
description: Run Kiln GPT Stage 1 brainstorming. Use when the user wants interactive discovery, scope clarification, feature exploration, or a durable project vision before planning begins.
---

# Kiln Brainstorm

Stage 1 is interactive.
Its job is to turn vague desire into a durable, reviewable vision.

Use:

- [runtime-schemas.md](../../references/runtime-schemas.md)
- [mind-contracts.md](../../references/mind-contracts.md)
- [brainstorm-contract.md](../../references/brainstorm-contract.md)
- `../../references/data/brainstorming-techniques.json`
- `../../references/data/elicitation-methods.json`

## Responsibilities

- clarify goals, users, constraints, and success criteria
- widen the option space before narrowing it
- identify missing decisions early
- write approved direction into the run documents
- keep pre-vision questions ultra-minimal
- run the three-tier brainstorm depth model
- make `VISION.md` approval the default main gate

## Deliverables

- `VISION.md`
- `events.md` note for vision approval or remaining blockers
- updates to `STATE.md`
- a concise handoff into planning
- an elicitation log when structured methods were used

## Workflow

### 1. Set depth and posture

Use the default depth from `.kiln/config.json` unless the operator overrides it:

- `quick`
- `balanced`
- `full-depth`

Recommend:

- `quick` for well-formed asks
- `balanced` by default
- `full-depth` when ambiguity or risk is high

### 2. Facilitate, do not generate

- the operator is the source of ideas and priorities
- ask questions, offer technique frames, and surface tradeoffs
- do not invent product decisions on the operator's behalf

### 3. Adjust for brownfield when mapping exists

If `reports/mapping/codebase-snapshot.md` exists:

- anchor questions in observed reality
- frame work as extend, refactor, replace, or integrate
- avoid greenfield assumptions

### 4. Crystallize the vision

Map approved content into `docs/VISION.md` using the template sections.
Before writing material updates, show the proposed content and get explicit approval.

### 5. Gate on vision approval

The default main gate is `VISION.md` approval.
If the vision is not ready, identify the missing section and ask only what is needed to unblock it.

## Rules

- do not jump into implementation planning
- ask fewer, better questions
- preserve operator-approved language where it matters
- Da Vinci is the interactive specialist; the persistent minds stay internal.
- Never infer missing answers just to make the document look complete.
- Use the technique and elicitation data selectively, not performatively.
