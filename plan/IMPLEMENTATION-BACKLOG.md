# Kiln GPT Implementation Backlog

This is the execution backlog for finishing the plugin.
It is ordered to minimize rework and keep the native Claude Code shape intact.

Status:

- `[ ]` todo
- `[>]` in progress
- `[x]` done

## Phase A — Native Runtime Foundation

- [x] A01 Create native plugin manifest at `.claude-plugin/plugin.json`
- [x] A02 Create initial kernel skill scaffolds
- [x] A03 Create initial stage skill scaffolds
- [x] A04 Create initial coordinator/specialist agent scaffolds
- [x] A05 Normalize naming and file references around `Kiln GPT`
- [x] A06 Create project-local runtime schemas for:
  - `.kiln/config.json`
  - `.kiln/runs/<run_id>/STATE.md`
  - `.kiln/runs/<run_id>/events.md`
  - `.kiln/runs/<run_id>/docs/*`
  - `.kiln/runs/<run_id>/tasks/*`

Exit gate:

- the plugin package shape is correct
- durable runtime file schemas are explicit and stable

## Phase B — Operator Experience Kernel

- [x] B01 Implement `kiln-fire` real entry logic
- [x] B02 Implement `kiln-init` real run creation logic
- [x] B03 Implement `kiln-peek` real status inspection logic
- [x] B04 Implement `kiln-resume` real resumability checks
- [x] B05 Implement `kiln-reset` archive/clear behavior
- [x] B06 Implement `kiln-doctor` with native plugin/package checks
- [x] B07 Implement ultra-minimal pre-brainstorm onboarding
- [x] B08 Implement post-vision adaptive execution questionnaire
- [x] B09 Persist project defaults in `.kiln/config.json`
- [x] B10 Mirror soft preferences into Claude memory where appropriate

Exit gate:

- a user can start, inspect, pause, resume, and reset a run cleanly
- operator experience decisions from `OPERATOR-DECISIONS.md` are actually encoded

## Phase C — Persistent Minds

- [x] C01 Implement Visionary agent contract
- [x] C02 Implement Architect agent contract
- [x] C03 Implement Sentinel agent contract
- [x] C04 Create `kiln-mind` skill
- [x] C05 Define owned artifact schemas and update rules
- [x] C06 Implement messaging patterns for worker consultation
- [x] C07 Implement serialization / bootstrap self-checks
- [x] C08 Implement macro-boundary respawn strategy

Exit gate:

- the three minds are real long-lived internal actors
- files remain canonical while the minds stay useful

## Phase D — Stage 1 Discovery

- [x] D01 Implement Da Vinci behavior in `kiln-brainstorm`
- [x] D02 Port the existing brainstorm depth model and recommendations
- [x] D03 Implement `VISION.md` approval as the default main gate
- [x] D04 Implement Mnemosyne brownfield mapping behavior
- [x] D05 Port brownfield snapshot / seeded docs behavior

Exit gate:

- greenfield and brownfield discovery both produce usable durable inputs

## Phase E — Stage 2 Planning

- [x] E01 Implement Confucius planner agent
- [x] E02 Decide and implement Sun Tzu path:
  - external GPT bridge, or
  - Claude-native fallback for v1
- [x] E03 Implement Socrates debater
- [x] E04 Port focused debate
- [x] E05 Port full critique/revise debate with artifacts
- [x] E06 Implement Plato synthesizer
- [x] E07 Implement Athena validation gate
- [x] E08 Implement planning coordinator orchestration
- [x] E09 Implement planning event log and approval loop

Exit gate:

- Kiln can produce and validate a phaseable master plan

## Phase F — Stage 3 Execution

- [x] F01 Implement Scheherazade prompt-sharpening behavior
- [x] F02 Implement worker behavior and task claiming
- [x] F03 Implement Codex bridge path
- [x] F04 Implement Claude-only fallback execution path
- [x] F05 Implement Sphinx review contract
- [x] F06 Implement Maestro phase executor
- [x] F07 Implement task graph creation and resume pre-marking
- [x] F08 Implement phase archive structure
- [x] F09 Implement post-phase reconciliation through Sherlock + persistent minds

Exit gate:

- one phase can execute end to end with review and archive

## Phase G — Stage 4 Validation

- [x] G01 Implement Argus validator
- [x] G02 Implement local-first validation strategy
- [x] G03 Integrate Playwright/browser validation where relevant
- [x] G04 Implement correction phase generation
- [x] G05 Re-enter Stage 3 from validation failures
- [x] G06 Implement credential readiness and missing-credential artifacts

Exit gate:

- Kiln validates reality, not just code structure

## Phase H — Stage 5 Delivery

- [x] H01 Implement final report skill
- [x] H02 Render elegant final report with real validation outcomes
- [x] H03 Include deployment/validation summary and limitations
- [x] H04 Include concise operator handoff notes where useful

Exit gate:

- successful runs end with a real, polished delivery artifact

## Phase I — UX Polish

- [x] I01 Implement restrained visual system for stage transitions
- [x] I02 Encode narrative diagnostics with technical drill-down paths
- [x] I03 Implement minimal ambient status policy
- [x] I04 Make `tmux` a strong recommendation, never a hard dependency
- [x] I05 Ensure operator can interrupt naturally and Kiln applies changes at safe points

Exit gate:

- the plugin feels intentional, not merely functional

## Phase J — Verification

- [ ] J01 Run one greenfield application proof
- [ ] J02 Run one brownfield application proof
- [ ] J03 Run one CLI/library proof
- [ ] J04 Run one Codex-backed execution proof
- [ ] J05 Run one Claude-only fallback proof
- [ ] J06 Fix issues found in live runs

Exit gate:

- the plugin is actually working, not only well-described

## Immediate Next Slice

The best next implementation tranche is:

1. Run live proofs across greenfield, brownfield, CLI/library, Codex-backed, and Claude-only flows
2. Fix issues found in those runs
3. Tighten any contracts that fail in live execution
4. Polish ambient UX only after the live runs expose real pain
