# Kiln GPT

> "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete."
>
> R. Buckminster Fuller

<p align="center">
  <strong>Context-driven software delivery for Codex CLI.</strong><br>
  Brainstorm hard. Plan clearly. Implement just in time. Verify brutally.
</p>

<p align="center">
  <code>brainstorm → spec → plan → implement → verify → deploy → report</code>
</p>

Kiln GPT is an autonomous software foundry for people who like velocity but do not enjoy chaos dressed up as autonomy.

It starts with a real brainstorm. Then it turns intent into durable artifacts. Then it drives phase-scoped implementation with review, validation, deployment, and final reporting. Codex is the primary runtime. Claude is optional backup for adversarial planning, debate, and review. The run state lives on disk. The workers stay lean. The project memory survives.

This is not a chat gimmick. It is a workflow engine with taste.

## Why Kiln GPT Exists

Most AI coding workflows have one of two problems:

1. They improvise too much.
2. They remember too little.

You ask for a feature. The agent charges forward. Twenty minutes later you have code, uncertainty, missing tests, weak documentation, and a faint smell of future regret.

Kiln GPT takes the opposite path:

- formalize intent before implementation
- move critical context into versionable artifacts
- break complex work into explicit units
- implement only the current slice
- verify against the plan, not just the diff
- keep a durable handoff trail for resume, review, and deployment

That is the product. Not "AI writes code." Plenty of things do that. Kiln GPT is about making that behavior coherent across an entire delivery run.

## What Makes It Different

Kiln GPT is built around four ideas.

### 1. Brainstorm First

The brainstorm is not warm-up theater. It is the ignition sequence.

`kiln fire` launches an interactive Codex session backed by the BMAD-derived brainstorm module:

- 62 brainstorming techniques
- 50 elicitation methods
- depth control: `light`, `standard`, `deep`
- style control: `express`, `tour`
- durable output to `vision.md`

The goal is simple: turn a vague ambition into a brief that can survive contact with implementation.

### 2. Context Is A File, Not A Feeling

Kiln GPT moves project awareness out of ephemeral chat and into durable run artifacts:

- `state.json` for machine state
- `STATE.md` for human state
- `docs/*.md` for vision, architecture, decisions, patterns, pitfalls, deployment
- `prompts/*.md` for explicit worker context packs
- `reviews/` and `validation/` for proof, findings, and iteration loops

The model should not be forced to remember your project by sheer conversational endurance. That is not intelligence. That is stress.

### 3. Just-In-Time Iteration

This is the part you were right to push on.

Kiln GPT is not supposed to front-load everything into one monolithic plan and then drift through implementation on vibes. The intended shape is:

- define the overall direction
- lock the current unit of work
- sharpen context for that unit
- implement only that unit
- verify against plan, guidelines, and tests
- iterate immediately on findings
- then move forward

In other words: the runtime should think in tracks and phases, not in giant wishful blobs.

The useful lesson from Google Conductor is not "copy Gemini." It is this:

- persistent specs beat ephemeral chat
- tracks create momentum without losing control
- verification must be a first-class stage

That design pressure is now reflected in Kiln GPT’s runtime itself:

- before each phase, Kiln GPT generates an active-slice spec
- implementation sees that spec, not just the whole master plan
- after approval, Kiln GPT writes a phase verify artifact

So the JIT loop is not just explained. It is encoded.

### 4. Verification Is Not Optional

Implementation is only half the story. Kiln GPT closes the loop with review, validation, deployment, and reporting:

- native `codex review`
- optional Claude review sidecar
- validation against plan and test results
- deployment pass for the real product path
- final delivery summary with residual risk

If the code exists but the proof does not, the run is not done.

## How The Workflow Works

```text
brainstorm -> plan -> execute -> validate -> deploy -> report -> complete
```

### Brainstorm

Interactive, operator-facing, high-signal.

This stage produces:

- `.kiln/runs/<run_id>/docs/vision.md`

That document is the source of intent for everything downstream.

### Plan

Planning converts the brainstorm into an implementation shape.

The current runtime supports:

- Codex planning as the primary pass
- optional Claude counter-plan
- optional Claude debate
- Codex synthesis into a master plan

Outputs land in:

- `.kiln/runs/<run_id>/outputs/master-plan.json`
- `.kiln/runs/<run_id>/docs/master-plan.md`

### Execute

Execution is phase-scoped and deliberately narrow.

Each phase should be:

- understandable
- reviewable
- testable
- reversible

Before implementation, Kiln GPT writes:

- `plans/<phase-id>-slice.json`
- `plans/<phase-id>-slice.md`

Those artifacts define the active objective, scope boundaries, file focus, dependencies, and verification checklist for the current slice.

The worker then gets only that active slice plus a small support bundle, not the whole novel.

### Validate

Validation checks the actual product, not the emotional truth of the patch.

That includes:

- build and test execution
- behavioral checks
- end-to-end flows when required
- explicit reporting of missing credentials or deployment blockers

### Deploy

Kiln GPT attempts the safest real deployment path exposed by the repo and verifies a smoke path afterward.

### Report

The final stage writes the handoff:

- what changed
- what passed
- what failed
- what still needs attention

## Just-In-Time Delivery Model

Kiln GPT should be read as a context-driven delivery system.

The ideal cycle for meaningful work is:

1. Establish product context.
2. Generate or refine a spec for the active slice.
3. Turn that slice into a concrete plan.
4. Implement only the next approved unit.
5. Run verification and review.
6. Feed findings back into the next iteration immediately.

That is the heartbeat of the product.

If Kiln GPT ever looks like "brainstorm once, then code for hours with vague oversight," that is a presentation failure, not the intent of the system.

The runtime now makes that visible with:

- phase slice specs in `plans/`
- implementation outputs in `outputs/`
- verify artifacts in `validation/`

## What You Actually Get

When you run Kiln GPT, you get:

- a durable `.kiln/` runtime per project
- a structured brainstorm instead of shallow requirement cosplay
- Codex-native execution
- optional multi-model pressure where it matters
- resumable runs
- visible artifacts
- a workflow that treats review and validation as part of implementation, not cleanup afterward

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

## Repository Map

| Path | Purpose |
|---|---|
| `src/lib/workflow.js` | Top-level runtime orchestration |
| `src/lib/state.js` | Durable run state and artifact management |
| `src/lib/prompts.js` | Context-pack generation for each stage |
| `src/lib/adapters.js` | Codex and Claude CLI adapters |
| `src/lib/lore.js` | Narrative layer and stage flavor |
| `agents/brainstorm.md` | Brainstorm facilitator contract |
| `references/data/brainstorming-techniques.json` | BMAD brainstorm catalog |
| `references/data/elicitation-methods.json` | BMAD elicitation catalog |

## Tone, By Design

Kiln GPT is stylish on purpose.

Not because the README needed personality surgery. Because tools that ask for long sessions deserve a point of view. The forge voice, the lore, the stage language, the slightly dangerous confidence: all of that is part of making the workflow memorable without making it unserious.

The standard is simple:

- sharp, not smug
- theatrical, not cringe
- opinionated, not patronizing

## Current State

Kiln GPT is already a real Codex-native runtime with:

- BMAD brainstorm assets integrated
- durable `.kiln` state
- active-slice JIT specs per phase
- per-phase verify artifacts
- planning, execution, validation, deployment, and reporting stages
- local tests passing
- pushed `main`
