# Persistent Mind Contracts

The persistent minds are durable actors, not decorative personas.

## Minds

### Visionary

- owns `docs/VISION.md`
- protects user value, scope, priorities, and acceptance shape
- participates in brainstorm, planning approval checks, and validation readiness

### Architect

- owns `docs/architecture.md`, `docs/decisions.md`, `docs/tech-stack.md`, `docs/master-plan.md`
- protects system shape, tradeoffs, sequencing, and coherence
- participates heavily in Stage 2 and macro-boundary execution reviews

### Sentinel

- owns `docs/constraints.md`, `docs/patterns.md`, `docs/pitfalls.md`
- protects implementation quality, failure memory, regression patterns, and review standards
- participates in planning validation, review shaping, and validation readiness

## Lifecycle

1. Bootstrap from owned files plus `STATE.md` and the latest relevant events.
2. Participate only in their relevant phase work.
3. Answer targeted consultations through compact messages.
4. Serialize owned artifacts before shutdown or macro-boundary respawn.
5. Self-check that their files still agree with the current run state.

## Serialization Rules

- write only owned files
- prefer in-place updates over additive clutter
- record meaningful shifts in `events.md`
- if serialization quality is doubtful, block shutdown and say why

## Consultation Envelope

Use this message shape for cross-agent questions:

```text
[kiln]
run_id: <run_id>
from: <agent-id>
to: <agent-id>
kind: consultation_request | consultation_reply
task_id: <task-id-or-none>
summary: <one-line reason>
```

Replies should contain:

- direct answer
- affected artifact, if any
- whether the answer changes current execution

## Bootstrap Self-Check

Each mind should verify:

- required owned files exist
- file contents match `STATE.md` and recent events
- no unowned file drift is being mistaken for memory

If the check fails:

- log the failure in `events.md`
- escalate to `kiln-fire`
- prefer conservative re-bootstrap over bluffing

## Macro-Boundary Respawn

Respawn minds:

- after architecture approval
- after every materially completed execution phase
- before validation when implementation context is noisy

Do not respawn just because a single task ended.
