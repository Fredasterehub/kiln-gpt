# Validation Contract

Stage 4 checks reality, not just internal confidence.

## Validation Posture

- local-first by default
- deploy or run the built system when the project type makes that meaningful
- use browser validation for web experiences when relevant
- do not confuse unit tests with full validation

## Validator Roles

- Argus owns the final verdict
- a tester may generate and execute milestone tests where that improves rigor
- Visionary, Architect, and Sentinel advise when failures imply scope, architecture, or quality memory changes

## Supported Validation Modes

### Web App

- build
- run locally
- exercise major user flows
- use browser or Playwright-based checks when the interface matters

### API

- build or run locally
- hit real endpoints
- verify response shapes, status codes, and critical flows

### CLI

- invoke commands directly
- verify outputs, exit codes, and important flags

### Library

- validate through tests, examples, and integration surfaces
- be explicit that no runtime deployment target exists

## Verdicts

- `pass`
- `partial`
- `fail`

Use `partial` when:

- credentials are missing
- some validation modes are unavailable but meaningful checks still ran
- the product is usable enough to learn from, but not fully validated

## Correction Loop

If validation is `partial` or `fail`:

1. write a validation failure artifact
2. write a correction phase artifact with bounded work
3. send the correction work back into Stage 3
4. re-run validation after the correction phase completes

Do not hand-wave with "needs fixes" and stop there.

## Credential Readiness

Track readiness without storing secrets.

Artifact:

- `reports/validation/missing-credentials.md`

Capture:

- credential class
- affected validation step
- whether validation can continue partially
- operator follow-up needed

## Required Validation Outputs

- `reports/validation/test-results.md`
- `reports/validation/report.md`
- `reports/validation/validation-failure.md` when needed
- `reports/validation/correction-phase.md` when needed
- `reports/validation/missing-credentials.md` when needed
