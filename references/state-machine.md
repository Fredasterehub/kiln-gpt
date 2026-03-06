# Kiln GPT State Machine

Canonical lifecycle:

```text
BOOTSTRAP
  -> INIT
  -> MAP
  -> BRAINSTORM
  -> RESEARCH
  -> ARCHITECT
  -> BUILD_PLAN[n]
  -> BUILD_EXECUTE[n]
  -> BUILD_REVIEW[n]
  -> VALIDATE
  -> REPORT
  -> COMPLETE
```

Exceptional states:

- `PAUSED`
- `FAILED`
- `ABORTED`

## Transition Rules

- `INIT` creates run state and classifies the project.
- `MAP` runs only for brownfield projects.
- `BRAINSTORM` is the only operator-interactive stage by default.
- `BUILD_*` repeats per master-plan phase.
- `PAUSED`, `FAILED`, and `ABORTED` are resumable if the run files remain intact.
- `COMPLETE` is not resumable.

## Resume Rules

`kiln-resume` may continue only if:

- `.kiln/current-run.txt` points to a real run
- `STATE.md` exists
- status is `PAUSED`, `FAILED`, or `ABORTED`

If status is `COMPLETE`, advise a new run.
If status is an active in-flight state, verify whether the operator wants to
continue with `kiln-fire` rather than forcing a resume flow.
