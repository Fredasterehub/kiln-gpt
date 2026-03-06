# Execution Contract

Stage 3 executes one approved phase at a time.

## Core Loop

1. derive the current phase from `docs/master-plan.md`
2. create or refresh the phase ledger in `tasks/`
3. sharpen task prompts against current code reality
4. implement one task at a time
5. review with a hard gate
6. merge only after approval
7. reconcile docs through Sherlock plus persistent minds
8. archive the phase

## Phase Ledger

Use one ledger per phase:

- `tasks/phase-<nn>.md`

Build a simple task graph inside the ledger before execution starts.
Each task should expose:

- task id
- status
- dependencies
- owner
- verification target

The ledger must expose:

- phase goal
- queued tasks
- active task
- blocked tasks
- failed tasks
- completed tasks
- review round count
- branch or execution lane, if relevant

## Resume Pre-Marking

On resume:

- read the existing phase ledger first
- pre-mark completed tasks as completed instead of re-running them blindly
- re-open only tasks that were active, blocked, or failed at interruption time
- regenerate prompts only for tasks whose context is stale

## Prompt Sharpening

Scheherazade must:

- read the current codebase, not just the plan
- inspect relevant docs and pitfalls before sharpening
- produce prompts that are path-aware, testable, and self-contained
- split work if a task is too broad for one worker pass

## Worker Model

Workers execute one bounded task at a time.

Rules:

- no self-approval
- no unbounded speculative refactors
- if blocked, consult Architect or Sentinel through the mind envelope
- if Codex is unavailable, switch to the Claude-only worker path and tighten review

## Review Gate

Sphinx returns one of:

- `approved`
- `rejected`

On rejection:

- write a fix artifact under `reports/execution/reviews/`
- re-enter implementation for the failed task or narrow fix scope
- stop after three rounds and escalate

## Merge Rule

Do not merge or advance the phase until the latest review is `approved`.

## Reconciliation

After merge:

- Sherlock updates evidence-driven findings
- Architect refreshes architecture or decisions if execution changed them
- Sentinel refreshes patterns and pitfalls if new lessons emerged

## Archive Structure

Archive each completed phase under:

```text
reports/execution/archive/phase-<nn>/
  phase-summary.md
  prompts/
  reviews/
  outputs/
  ledgers/
```

The archive is history, not canonical truth.
