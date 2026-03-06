# Runtime Contract

## Command Surface

- `kiln init`
- `kiln fire`
- `kiln resume`
- `kiln peek`
- `kiln doctor`
- `kiln reset`

## State Model

Canonical machine state:

- `.kiln/runs/<run_id>/state.json`

Canonical human-readable state:

- `.kiln/runs/<run_id>/STATE.md`

Canonical memory:

- `.kiln/runs/<run_id>/docs/*.md`

## Stage Rules

1. Brainstorm is interactive and must complete before autonomous stages start.
2. Planning must produce structured phases with verification and deployment intent.
3. Execution is phase-by-phase and review-gated.
4. Validation must test the product, not just the diff.
5. Deployment must use the repo's real deployment path.
6. Reporting must summarize outcomes and residual risk.
