---
name: kiln-mapper
description: Run Kiln GPT brownfield mapping. Use when the project already has code and Kiln needs to inspect architecture, tooling, data, APIs, and risk areas before ideation or planning.
---

# Kiln Mapper

Map first. Judge later.

Use:

- [brownfield-mapping-contract.md](../../references/brownfield-mapping-contract.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)
- `../../references/templates/reports/mapping/codebase-snapshot.md`

## Deliverables

- `reports/mapping/codebase-snapshot.md`
- tooling inventory
- architecture notes
- seeded `tech-stack.md`, `decisions.md`, `constraints.md`, and `pitfalls.md`

## Workflow

### 1. Scan proportionally

Assess the repo shape first, then map proportionally to size.
Large codebases may be split by top-level regions or services, but the result must synthesize back to one snapshot.

### 2. Stay conservative

- describe what exists before suggesting change
- avoid secret-bearing files by default
- treat observations as observations, not operator-approved truth

### 3. Seed durable context

Use the scan to enrich:

- `docs/tech-stack.md`
- `docs/decisions.md`
- `docs/constraints.md`
- `docs/pitfalls.md`

If those docs already contain substantive content, extend carefully instead of flattening them.

## Rules

- describe what exists before proposing what should exist
- prefer evidence over narrative
- leave behind files that later stages can trust
- Brownfield mapping should reduce future questioning, not add more noise.
