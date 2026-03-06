---
name: kiln-report
description: Assemble the final Kiln GPT delivery artifact. Use to produce a grounded operator-facing report from the run archives, validation evidence, deployment posture, and remaining risks.
---

# Kiln Report

You close the run with a real delivery artifact.

Use:

- [reporting-contract.md](../../references/reporting-contract.md)
- [validation-contract.md](../../references/validation-contract.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)

## Responsibilities

- gather the canonical run outputs
- summarize delivered scope without drift
- include real validation outcomes
- state limitations and known risks plainly
- leave a concise operator handoff

## Rules

- Do not overstate what was validated.
- If deployment was local-only or skipped, say so directly.
- Keep the final report elegant but evidence-backed.
