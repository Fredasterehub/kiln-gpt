# Kiln GPT

Kiln remains the voice.
GPT is the vessel.

This repo is the clean rebuild of Kiln as a pure native Claude Code plugin:
no npm installer, no tmux, no daemon, no protocol injection. Just skills,
agents, references, and a disciplined runtime contract.

The original v2 proved the product shape. v4 proved the mechanics that matter:
one team per run, event-driven orchestration, lean control-plane context, and
living specialist agents that serialize their memory instead of pretending a
file is a mind.

The job of this repo is to turn that into a distributable plugin that can be
copied into Claude Code and trusted to run.

## Name

The working name is `Kiln GPT`.
That is good enough to build under, and build quality matters more than naming games.

Command names stay on the proven prefix:

- `/kiln:fire`
- `/kiln:peek`
- `/kiln:resume`
- `/kiln:reset`
- `/kiln:doctor`

## What Changes In This Rebuild

The original plan had the right ambition but hid several hard problems inside
`/kiln:fire`. This repo upgrades the design by making those problems explicit:

- Runtime control is separated from domain work.
- GPT/Codex bridging is its own contract, not an implied side effect.
- Resume, reset, and install diagnostics are first-class commands.
- Failure handling is designed up front instead of left to "the agents will cope."
- Run state is durable, namespaced, and restartable.
- Official Claude Code plugin packaging is treated as a real requirement, not a
  detail to improvise later.
- Claude-native fallback is explicit when external bridges are unavailable.

## Fallback Philosophy

Kiln should run without Codex CLI. It should simply become less sharp.

- Best path: Opus 4.6 + Sonnet 4.6 + Codex bridge
- Fallback path: Opus 4.6 + Sonnet 4.6 only

The install and diagnostic surfaces should say this plainly:
Codex CLI is not mandatory, but the implementation loop is materially stronger
with it installed.

## Plugin Packaging

This repo is targeting the current Claude Code plugin system rather than an
informal folder copy convention.

- Development path: `claude --plugin-dir /path/to/plugin`
- Marketplace path: `/plugin install <plugin>@<marketplace>`
- Interactive discovery path: `/plugin > Discover`

The plugin layout will follow the official structure:

```text
plugin-root/
  .claude-plugin/plugin.json
  skills/
  agents/
  README.md
```

## Current Foundation

This repo is no longer just high-level planning.
The current foundation now includes concrete native-plugin runtime contracts:

- [plan/PLAN.md](/DEV/kilngpt/plan/PLAN.md) defines the product and phased build.
- [plan/ARCHITECTURE.md](/DEV/kilngpt/plan/ARCHITECTURE.md) defines runtime contracts.
- [plan/MIGRATION.md](/DEV/kilngpt/plan/MIGRATION.md) maps the legacy Kiln workflow to the new native plugin architecture.
- [plan/NAMING.md](/DEV/kilngpt/plan/NAMING.md) records the short-term naming choice and why I stopped spending time there.
- [references/run-contract.md](/DEV/kilngpt/references/run-contract.md) defines the durable runtime contract.
- [references/runtime-schemas.md](/DEV/kilngpt/references/runtime-schemas.md) defines the project-local `.kiln/` schemas and templates.
- [references/mind-contracts.md](/DEV/kilngpt/references/mind-contracts.md) defines persistent mind ownership, serialization, and consultation rules.
- [references/planning-contract.md](/DEV/kilngpt/references/planning-contract.md) defines the Stage 2 planning, debate, synthesis, and validation flow.
- [references/fire-control-loop.md](/DEV/kilngpt/references/fire-control-loop.md) defines the real `kiln-fire` routing and stage-control behavior.
- [references/brainstorm-contract.md](/DEV/kilngpt/references/brainstorm-contract.md) defines Stage 1 facilitation rules, depth modes, and the `VISION.md` gate.
- [references/brownfield-mapping-contract.md](/DEV/kilngpt/references/brownfield-mapping-contract.md) defines brownfield scan outputs and seeded-doc behavior.
- [references/execution-contract.md](/DEV/kilngpt/references/execution-contract.md) defines the Stage 3 phase loop, worker model, reconciliation, and archive rules.
- [references/review-contract.md](/DEV/kilngpt/references/review-contract.md) defines what Sphinx can reject, how evidence must be recorded, and when review escalates.
- [references/validation-contract.md](/DEV/kilngpt/references/validation-contract.md) defines local-first validation, browser checks, verdicts, correction re-entry, and credential-readiness artifacts.
- [references/reporting-contract.md](/DEV/kilngpt/references/reporting-contract.md) defines the final delivery artifact, required inputs, and evidence-backed reporting rules.
- [references/ux-contract.md](/DEV/kilngpt/references/ux-contract.md) defines minimal ambient status, narrative diagnostics, safe-point interruption handling, and `tmux` as a recommendation only.
- [skills/kiln-mind/SKILL.md](/DEV/kilngpt/skills/kiln-mind/SKILL.md) implements the persistent mind lifecycle.
- [skills/kiln-planner/SKILL.md](/DEV/kilngpt/skills/kiln-planner/SKILL.md) implements the planning mechanics behind `kiln-architect`.
- [skills/kiln-bridge/SKILL.md](/DEV/kilngpt/skills/kiln-bridge/SKILL.md) defines the external bridge contract and fallback posture.
- [skills/kiln-worker/SKILL.md](/DEV/kilngpt/skills/kiln-worker/SKILL.md) defines bounded task execution for Stage 3 workers.
- [skills/kiln-validate/SKILL.md](/DEV/kilngpt/skills/kiln-validate/SKILL.md) now encodes local-first validation, browser testing where relevant, and correction-phase generation.
- [skills/kiln-report/SKILL.md](/DEV/kilngpt/skills/kiln-report/SKILL.md) closes the run with a grounded final handoff artifact.
- [references/data/brainstorming-techniques.json](/DEV/kilngpt/references/data/brainstorming-techniques.json) and [references/data/elicitation-methods.json](/DEV/kilngpt/references/data/elicitation-methods.json) carry forward the structured brainstorm inputs from legacy Kiln.

The repo still needs live proofs. Stage 1, the control plane, the persistent
minds, the planning stack, the Stage 3 execution contracts, the Stage 4
validation contracts, and the Stage 5 reporting surface are now grounded enough
to keep moving without reopening design churn.
