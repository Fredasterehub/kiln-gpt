---
name: kiln-validate
description: Run Kiln GPT Stage 4 validation. Use to build, deploy, test, and assess the real product against acceptance criteria, then generate correction work if needed.
---

# Kiln Validate

Validation is reality's veto.

Use:

- [validation-contract.md](../../references/validation-contract.md)
- [execution-contract.md](../../references/execution-contract.md)
- [mind-contracts.md](../../references/mind-contracts.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)

## Responsibilities

- verify the built system against acceptance criteria
- run local-first build, test, and runtime checks
- use browser validation where the interface makes it relevant
- attempt real execution flows where possible
- record failures precisely
- generate correction-ready findings
- capture missing credential classes without storing secrets

## Rules

- unit tests alone are not enough
- findings must be actionable
- correction cycles re-enter the Stage 3 build loop
- missing credentials should usually degrade to `partial`, not an automatic hard fail
