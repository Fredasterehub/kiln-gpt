# Kiln Codex

Software kiln, this is. Pottery kiln, absolutely not.

This project is a Codex-native rebuild of the original Kiln workflow: big interactive brainstorm first, then autonomous planning, implementation, review, validation, deployment, and final handoff. Think Yoda with a debugger, Rick with slightly better file hygiene, and Sheldon if he were forced to respect operational reality. Precise, opinionated, mildly theatrical, and built to ship code instead of merely having feelings about architecture.

## What This Thing Actually Is

Kiln Codex is a local runtime for multi-stage software delivery.

It does not pretend one giant model conversation should remember everything forever. That way madness lies. Also token waste. Instead it keeps durable run state on disk, generates narrow prompt packs for each worker, and uses the native CLIs as execution surfaces:

- `codex` is the host runtime
- `claude` is an optional sidecar for independent planning, debate, and review
- `.kiln/` is the source of truth for the run

If you want the short version:

- brainstorm with Codex interactively
- let Codex and Claude argue over the plan
- let Codex implement just-in-time
- let review and validation keep it honest
- let deployment and reporting close the loop

## What Was Preserved From The Original Kiln

Yes, the brainstorm matters here. A lot.

The rebuild now preserves the original spirit on purpose:

- an explicit brainstorm-first workflow
- durable vision capture before planning begins
- the BMAD-origin brainstorm module and its professional-grade JSON catalogs
- a richer brainstorm playbook with depth and style selection
- targeted ideation techniques instead of generic "tell me more" sludge
- planner debate, synthesis, review gates, and correction loops
- end-to-end validation and deployment as first-class stages

The main thing that changed is the host runtime. Claude is no longer the operating system. Codex is.

## Brainstorm Experience

This part is not decorative. It is the ignition sequence.

`kiln fire` launches an interactive Codex session that now:

- asks for brainstorm depth: `light`, `standard`, or `deep`
- asks for conversation style: `express` or `tour`
- uses the BMAD-derived brainstorm module instead of improvising into the void
- loads the full 62-technique catalog and 50-method elicitation catalog from JSON
- writes the durable result to `.kiln/runs/<run_id>/docs/vision.md`

In plain English: the brainstorm is designed to turn "I have an idea" into "here is a buildable product brief with constraints, success criteria, deployment expectations, and the right unresolved questions."

That behavior is grounded in:

- [agents/brainstorm.md](/DEV/kilngpt/agents/brainstorm.md)
- [references/brainstorm-playbook.md](/DEV/kilngpt/references/brainstorm-playbook.md)
- [references/data/brainstorming-techniques.json](/DEV/kilngpt/references/data/brainstorming-techniques.json)
- [references/data/elicitation-methods.json](/DEV/kilngpt/references/data/elicitation-methods.json)
- [references/data/lore.json](/DEV/kilngpt/references/data/lore.json)
- [references/data/spinner-verbs.json](/DEV/kilngpt/references/data/spinner-verbs.json)

## How It Works

```text
brainstorm -> plan -> execute -> validate -> deploy -> report -> complete
```

### 1. Brainstorm

Interactive Codex session.

You and the brainstorm agent shape the product until `vision.md` is concrete enough to plan from. When it is done:

```bash
kiln resume --stage plan --auto
```

### 2. Plan

This is where the models stop being polite and start being useful.

- Codex produces the primary structured plan
- Claude can produce an independent competing plan
- Claude can also debate both plans and expose weak assumptions
- Codex synthesizes the surviving ideas into the master plan

Outputs land in `.kiln/runs/<run_id>/outputs/` and `.kiln/runs/<run_id>/docs/master-plan.md`.

### 3. Execute

Codex implements one phase at a time.

Each phase is intentionally bounded, reviewed, corrected if necessary, then merged. No "ship the whole dream in one pass" nonsense. That is how repos become crime scenes.

### 4. Validate

The runtime validates the actual product, not just the patch.

That means build, test, inspect, and when appropriate drive the thing end-to-end with Playwright or the repo's own tooling. If deployment credentials or infrastructure are missing, Kiln reports that explicitly instead of hallucinating competence.

### 5. Deploy

One final worker performs the safest real deployment path the repo exposes and verifies a smoke flow.

### 6. Report

The last stage writes a clean operator handoff with what changed, what passed, what still smells risky, and what to do next.

## Why The Design Looks Like This

Because context rot is real.

The original Kiln proved the orchestration idea. The Codex-native rebuild makes the mechanics explicit:

- `state.json` is the machine-readable run state
- `STATE.md` is the human-readable state mirror
- `docs/*.md` are durable memory artifacts
- `prompts/*.md` are bounded context packs for workers
- `reviews/` and `validation/` hold gate evidence

Workers are disposable. The run is not.

This is the key design decision. The system should survive long projects because the truth lives on disk, not because one poor model is desperately trying to remember what happened 40,000 tokens ago.

## What To Expect

Expect this:

- a strong brainstorm and a very explicit handoff into planning
- more structure than a casual coding session
- less mystery than a "swarm" repo
- tight artifacts under `.kiln/`
- blunt review behavior when work is weak
- resume semantics that make sense

Do not expect this:

- magic requirements extraction from vague wishes
- blind autonomous guessing in ambiguous situations
- one-shot perfection on the first run in every repo on earth

## Commands

```bash
kiln init
kiln fire
kiln resume --stage plan --auto
kiln peek
kiln doctor
kiln reset
```

## Install

```bash
npm install -g .
```

## Runtime Notes

- `.kiln/` is ignored by git
- Codex is required
- Claude is optional, but useful as a second brain
- the runtime is deliberately dependency-light
- this repo is the supervisor; your project repo is the battlefield

## Current State

The runtime skeleton is real and tested. The brainstorm layer is now much closer to the original Kiln spirit, but there is still room to widen the technique deck, add more specialized planners, and harden the deployment adapters per framework.

Reasonable, that is. Finished forever, nothing is.
