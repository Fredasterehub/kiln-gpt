# Context Management

The main failure mode in long agentic runs is context bloat.

This runtime avoids that by design:

- every stage writes durable artifacts to disk
- every worker gets a prompt pack generated from those artifacts
- no worker relies on inherited chat memory
- Claude sidecars are intentionally stateless

## Practical Rules

- `vision.md` is the root of intent
- `master-plan.md` is the root of execution
- phase workers only receive the current phase plus a small support bundle
- review loops pass findings, not full history
- validation loops pass defects, not the entire transcript

This keeps the system sharp even when the project gets large.
