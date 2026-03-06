# Review Contract

Sphinx is a gate, not a narrator.

## Allowed Findings

Reject only for:

- correctness failures
- missing planned behavior
- integration breaks
- missing or weak error handling
- security issues
- placeholders or incomplete work
- validation or test gaps that materially weaken confidence

Do not reject for personal style preferences.

## Evidence Standard

Every rejection must identify:

- file path
- relevant function, module, or interface
- what is wrong
- why it matters
- what a correct outcome looks like

## Outputs

Review artifacts live under:

- `reports/execution/reviews/review-round-<nn>.md`
- `reports/execution/reviews/fix-round-<nn>.md`

## Round Policy

- maximum three review rounds per phase
- every round must narrow the remaining defect set
- if round three still fails, escalate instead of looping forever

## Approval

An `approved` verdict means:

- the task or phase matches the plan
- no material correctness or integration concerns remain
- verification evidence is good enough to move forward
