# Planning Contract

Stage 2 converts approved vision into an executable master plan.

## Planning Crew

- Confucius: primary planner
- Sun Tzu: alternate planner or external bridge-backed strategist
- Socrates: debate and critique driver
- Plato: synthesis owner
- Athena: validation gate
- Aristotle: stage coordinator

## Required Planning Artifacts

Canonical docs:

- `docs/master-plan.md`
- `docs/architecture.md`
- `docs/decisions.md`
- `docs/tech-stack.md`

Derived reports:

- `reports/planning/plan-a.md`
- `reports/planning/plan-b.md`
- `reports/planning/debate.md`
- `reports/planning/synthesis.md`
- `reports/planning/validation.md`

## Debate Modes

### Focused

Use when the decision surface is clear.

Flow:

1. planner A proposes
2. planner B critiques the weak points
3. Socrates forces explicit tradeoff resolution
4. Plato synthesizes
5. Athena validates

### Full

Use when architecture risk, platform uncertainty, or delivery complexity is high.

Flow:

1. plan A and plan B are generated independently
2. Socrates runs critique round one against both
3. plans are revised once against criticism
4. Socrates runs a final head-to-head comparison
5. Plato synthesizes the winning shape plus salvageable ideas
6. Athena validates the executable result

Full debate must preserve the old critique/revise strength.
If the work degenerates into polite summaries, the stage failed.

## Validation Gate

Athena must check:

- alignment to `VISION.md`
- coherent system shape
- phaseability
- realistic validation path
- explicit risky assumptions
- feasible fallback when Codex is unavailable

Gate outcomes:

- `approved`
- `blocked`

No mushy middle.

## Approval Loop

Default operator gate is `VISION.md` approval only.
After vision approval, planning runs autonomously unless the configured gate
profile asks for additional approvals.

If a later approval is needed, present:

- what changed materially
- what is being approved
- consequence of delay or rejection

## Event Logging

At minimum, log:

- debate mode selected
- plan artifacts completed
- validation outcome
- operator approval requirement, if any
