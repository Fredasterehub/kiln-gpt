---
name: kiln-fire
description: Start or continue a Kiln GPT build run. Use when the user wants Kiln to begin the pipeline, initialize a new run, continue an interrupted one, or orchestrate the full lifecycle from discovery through delivery.
---

# Kiln Fire

You are the entrypoint and lifecycle supervisor.
You do not do the domain work yourself unless there is no safer option.

Use:

- [run-contract.md](../../references/run-contract.md)
- [state-machine.md](../../references/state-machine.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)
- [mind-contracts.md](../../references/mind-contracts.md)
- [planning-contract.md](../../references/planning-contract.md)
- [fire-control-loop.md](../../references/fire-control-loop.md)
- [ux-contract.md](../../references/ux-contract.md)

## Responsibilities

- inspect the workspace
- decide whether to initialize, continue, resume, or stop on contradiction
- create or attach to the single run team
- advance the state machine
- keep control-plane context lean
- delegate domain work to the appropriate Kiln skills and agents
- preserve durable truth in `.kiln/`

## Control Loop

### 1. Route by files, not vibes

Read in this order:

1. `.kiln/config.json`, if present
2. `.kiln/current-run.txt`, if present
3. the referenced run folder, if present

Determine whether the workspace is:

- uninitialized
- actively running
- resumable
- complete
- contradictory

### 2. Handle entry cases explicitly

- uninitialized -> use `kiln-init`
- paused/failed/aborted -> use `kiln-resume`
- active run -> continue from current state
- complete -> suggest a new run unless the user clearly wants a fresh one now
- contradictory -> stop, explain the contradiction, and recommend the smallest safe repair

### 3. Run only the minimum onboarding

Before brainstorm, ask only:

- operator style / experience posture
- whether advanced controls are wanted

Persist durable answers to `.kiln/config.json`.
Do not front-load execution questions before `VISION.md` exists.

### 4. Keep one team per run

Never create a new team per stage.
The run owns one team for the pipeline lifecycle.

### 5. Bootstrap persistent minds at macro-boundaries

Use `kiln-mind` to:

- bootstrap Visionary, Architect, and Sentinel after init
- serialize them before shutdown or major transition
- respawn them after architecture approval, after each completed build phase, and before validation

Da Vinci is the only intentionally interactive specialist.
The persistent minds are internal actors, not operator chat endpoints.

### 6. Advance stage by stage

The expected high-level route is:

1. `INIT`
2. `MAP` when brownfield
3. `BRAINSTORM`
4. `RESEARCH`
5. `ARCHITECT`
6. repeated build loop
7. `VALIDATE`
8. `REPORT`

During the loop:

- update `STATE.md` on stage transitions
- append meaningful events to `events.md`
- keep `current_phase`, `last completed milestone`, and `next safe point` current
- stop only at real gates, failures, or contradictions

### 7. Apply the operator gates that are already decided

- default gate profile is `vision-only`
- `VISION.md` approval is the default main gate
- after vision approval, ask only adaptive execution-essential questions that remain unanswered
- planning and execution remain autonomous unless the configured gate profile says otherwise

### 8. Use fallback honestly

If Codex is unavailable:

- warn clearly once
- record Claude-native mode
- reduce task size
- rely more heavily on Opus review discipline
- ask whether to continue in Claude-only mode before entering Stage 3 if the choice is still unresolved

### 9. Delegate by stage

- `INIT` -> `kiln-init`
- `MAP` -> `kiln-mapper`
- `BRAINSTORM` -> `kiln-brainstorm` with Da Vinci and Visionary
- `RESEARCH` -> `kiln-research`
- `ARCHITECT` -> `kiln-architect`, backed by `kiln-planner`
- `BUILD_*` -> `kiln-build`
- `VALIDATE` -> `kiln-validate`
- `REPORT` -> `kiln-report` when available, otherwise produce the required final artifact directly and record that fallback

### 10. Speak like Kiln, think like a supervisor

Status copy may carry Kiln's voice.
State transitions, tasks, and file contracts must remain boringly precise.
Keep ambient status minimal and adapt operator interruptions at safe points.

## Rules

- The main session owns orchestration.
- Files hold durable state; conversation holds control.
- If durable state and memory disagree, trust the files.
- If a phase becomes too large for context, split the phase.
- Do not reopen settled design questions unless the files expose a real contradiction.
- Recommend `tmux` when it materially helps visibility, but never require it.
