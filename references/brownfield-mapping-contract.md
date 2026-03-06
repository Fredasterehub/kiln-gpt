# Brownfield Mapping Contract

Brownfield mapping happens before Kiln starts pretending it understands the codebase.

## Mapper Role

Mnemosyne inventories what exists and seeds durable context for later stages.
It does not redesign the system.

## Safety Rules

- never read secret-bearing files unless the operator explicitly asks
- stay read-only on application source files
- write only to `.kiln/runs/<run_id>/docs/`, `.kiln/runs/<run_id>/reports/`, and related runtime artifacts
- prefix seeded observational claims when operator verification is still needed

## Minimum Mapping Outputs

Canonical updates:

- `docs/tech-stack.md`
- `docs/decisions.md`
- `docs/constraints.md`
- `docs/pitfalls.md`

Derived report:

- `reports/mapping/codebase-snapshot.md`

## Snapshot Content

The mapping report should capture:

- what the project appears to do
- top-level architecture and module boundaries
- languages, frameworks, storage, auth, build, test, and lint tooling
- entry points and public interfaces
- fragile areas and likely regression traps

## Seeded Docs Behavior

Seed durable docs conservatively:

- `tech-stack.md`: detected stack and tooling
- `decisions.md`: existing major technical commitments already visible in the codebase
- `constraints.md`: observed constraints or operational limits
- `pitfalls.md`: fragile areas, large hotspots, TODO/FIXME clusters, and upgrade risks

If a doc already contains substantive operator- or mind-authored content, extend it carefully instead of flattening it.

## Scale Policy

Map proportionally to repository size:

- small: direct scan
- medium: direct scan with selective summaries
- large: split by top-level regions or modules

Parallelism is useful, but the output must still synthesize back to one trustworthy snapshot.
