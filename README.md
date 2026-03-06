# Kiln Codex

> "A forge is where vague ambition goes to lose its excuses."

*An autonomous software foundry for Codex CLI, with Claude as optional philosophical backup and occasional professional heckler.*

Software kiln, this is. Ceramics kiln, this is not. Fire code into shape, it does.

The short version: Kiln Codex turns a vague product idea into a disciplined delivery run.

First you brainstorm properly. Not fake brainstorming. Not "tell me your vibe." Actual structured ideation with the BMAD module, depth control, elicitation methods, and a durable vision artifact.

Then the system plans, debates, synthesizes, implements, reviews, validates, deploys, and reports. Codex is the operating system. Claude is a sidecar brain when you want a second set of eyes with a different temperament. The run lives on disk. The workers are disposable. The truth survives.

## Why This Exists

Because most "agentic coding" setups have the memory discipline of a sleep-deprived raccoon.

They start strong, accumulate context like a hoarder with a token budget, forget what mattered, and eventually become extremely confident wrong machines. Spectacular. Cinematic. Useless.

Kiln takes the opposite approach:

- put the run state on disk
- keep context packs narrow
- separate brainstorm from planning
- separate planning from implementation
- separate implementation from review
- separate review from validation
- force deployment and reporting to exist in reality, not in aspiration

This is not a swarm. It is not a vibe. It is not "autonomy" by means of letting one giant chat hallucinate project management. It is a build system with memory, stage discipline, and a taste for receipts.

## What It Feels Like

Imagine if:

- Yoda cared about context windows
- Rick Sanchez had to pass review
- Sheldon Cooper was banned from forgetting deployment

That is roughly the tone. Direct, strange, occasionally theatrical, but never condescending and never decorative for its own sake.

## What Was Preserved From Original Kiln

The important parts. The parts with teeth.

- brainstorm first, always
- durable project memory
- distinct planning, execution, review, validation, and reporting stages
- adversarial or semi-adversarial plan improvement
- just-in-time implementation instead of giant speculative coding passes
- correction loops when validation fails
- a narrative shell with actual taste instead of flat corporate sludge

The host runtime changed. The core philosophy did not.

Claude is no longer the machine that contains the whole world. Codex is the primary runtime now. Claude helps when disagreement, synthesis, or review pressure is useful.

## The Brainstorm Is Not Cosmetic

This is the part I cared about preserving, because it is the difference between "agent writes some code" and "system understands the mission."

`kiln fire` launches an interactive Codex brainstorm session backed by:

- the BMAD-derived brainstorm facilitator
- the full 62-technique catalog
- the full 50-method elicitation catalog
- depth selection: `light`, `standard`, `deep`
- style selection: `express`, `tour`
- a durable `vision.md` artifact that planning must obey

What the brainstorm is supposed to do:

- extract the real problem
- clarify the user
- force explicit goals and non-goals
- surface constraints before they become landmines
- define success criteria
- expose risks, unknowns, and deployment expectations
- leave behind a vision document that is good enough to build from

What it is not supposed to do:

- invent your ideas for you
- fake missing answers
- jump into architecture before the product is legible
- write inspirational fog

The assets live here:

- [agents/brainstorm.md](/DEV/kilngpt/agents/brainstorm.md)
- [references/brainstorm-playbook.md](/DEV/kilngpt/references/brainstorm-playbook.md)
- [references/data/brainstorming-techniques.json](/DEV/kilngpt/references/data/brainstorming-techniques.json)
- [references/data/elicitation-methods.json](/DEV/kilngpt/references/data/elicitation-methods.json)

## The Runtime Shape

```text
brainstorm -> plan -> execute -> validate -> deploy -> report -> complete
```

### Brainstorm

Interactive Codex session. Human and facilitator do the hard thinking up front. Output goes to:

```text
.kiln/runs/<run_id>/docs/vision.md
```

When the vision is ready:

```bash
kiln resume --stage plan --auto
```

### Plan

Now the ideas go on trial.

- Codex creates the primary structured plan
- Claude can produce an independent competing plan
- Claude can debate the two plans and expose weak assumptions
- Codex synthesizes the surviving parts into the master plan

Result:

- `.kiln/runs/<run_id>/outputs/master-plan.json`
- `.kiln/runs/<run_id>/docs/master-plan.md`

### Execute

Codex implements one phase at a time. Not because the machine is timid. Because sequencing is real and giant speculative edits are how software acquires trauma.

Each phase is:

- bounded
- implemented
- reviewed
- corrected if needed
- committed
- merged only after it earns it

### Validate

Validation checks the actual system, not the story you tell yourself about the diff.

That means:

- build
- test
- inspect behavior
- drive end-to-end flows when needed
- report missing credentials or infra instead of pretending

If validation fails, the system loops back through correction rather than declaring spiritual victory.

### Deploy

A final worker performs the safest real deployment path the project exposes and verifies a smoke path. No poetry. No PowerPoint. A real deployment attempt.

### Report

At the end, Kiln writes an operator handoff with:

- what changed
- what passed
- what remains risky
- what should happen next

## How It Is Designed

This is the architectural bet:

- workers should be stateless
- runs should be stateful

So the runtime keeps its memory in files instead of in one endlessly bloated conversation:

- `state.json` for machine state
- `STATE.md` for human state
- `docs/*.md` for durable memory
- `prompts/*.md` for explicit context packs
- `reviews/` for quality gates
- `validation/` for proof, failure, and correction artifacts

This matters more than it sounds. It means a long project can stay coherent because every worker starts from curated truth, not inherited confusion.

## Lore, Because Style Matters

Yes, the narrative layer is integrated on purpose.

Kiln has lore and stage flavor because sterile tooling is forgettable and chaotic tooling is exhausting. The right amount of theater makes a system easier to use, easier to trust, and frankly more fun to live inside for long runs.

That layer now lives in:

- [references/data/lore.json](/DEV/kilngpt/references/data/lore.json)
- [references/data/spinner-verbs.json](/DEV/kilngpt/references/data/spinner-verbs.json)
- [src/lib/lore.js](/DEV/kilngpt/src/lib/lore.js)

So yes, the forge talks back a little. Tastefully. Usually.

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

## What To Expect

Expect:

- a strong brainstorm instead of shallow requirement cosplay
- structured autonomy after the brainstorm
- explicit artifacts under `.kiln/`
- blunt review when work is weak
- durable resume semantics
- a system that cares whether the thing actually works

Do not expect:

- magic from vague prompts
- blind guessing in ambiguous situations
- one-shot perfection in every codebase
- a fake "fully autonomous" demo that quietly relies on human memory and denial

## Current State

The runtime is real, tested, and pushed. The BMAD brainstorm assets are integrated. The lore is integrated. The control plane is Codex-native. Claude is optional and useful, not structural.

There is still room to widen specialized planners, framework-aware deploy adapters, and deeper validation profiles. Good. A foundry should evolve. If it were "finished," I would immediately distrust it.
