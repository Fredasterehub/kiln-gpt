# Kiln GPT — Master Plan

## Product Definition

Kiln GPT is a pure native Claude Code plugin that orchestrates a software
delivery pipeline through Claude skills, Claude agents, task graphs, messaging,
and durable run state.

It is not a generic agent swarm. It is a constrained build system with a voice.

### User Promise

From a single command, the operator should be able to:

1. start a new run with `/kiln:fire`
2. brainstorm interactively when needed
3. let the pipeline continue without babysitting
4. inspect status naturally with `/kiln:peek`
5. recover an interrupted run with `/kiln:resume`
6. wipe or archive broken state with `/kiln:reset`
7. verify installation and bridge availability with `/kiln:doctor`

### Definition Of Done For v1

v1 is done when all of the following are true:

- The plugin loads locally with `claude --plugin-dir` and packages cleanly for
  marketplace-style installation.
- Greenfield and brownfield runs both work.
- The plugin can survive an interrupted session and resume from `.kiln/runs/<run_id>/`.
- Codex CLI is optional but supported. If unavailable, the plugin degrades to
  a Claude-native Opus 4.6 + Sonnet 4.6 execution path instead of collapsing.
- There is one small-project end-to-end proof and one brownfield proof.
- There is at least one CLI or library proof in addition to the application proof.
- All user-facing messages sound like Kiln and all machine contracts sound like engineers wrote them.

## Strategic Changes From The Original Draft

### 1. Keep `Kiln`, Use `Kiln GPT` As The Working Package Name

The original brand already has identity and public continuity. The working
package name is `Kiln GPT` and the namespace stays `kiln`.

### 2. Promote Runtime Operations To First-Class Commands

The previous plan treated resume, reset, and diagnostics as afterthoughts. That
is how autonomous systems become unrecoverable.

User-facing command set:

- `kiln-fire`
- `kiln-peek`
- `kiln-resume`
- `kiln-reset`
- `kiln-doctor`

### 3. Add An Explicit Bridge Layer And Fallback Path

The old plan assumed "Sonnet calls GPT or Codex" as if that were a detail. It
is not. External model invocation is its own failure domain.

New shared playbook:

- `kiln-bridge`: bridge detection, command contracts, retries, stderr capture,
  timeout rules, and degraded-mode fallback

Fallback execution if Codex CLI is unavailable:

- Sonnet worker performs implementation directly
- Opus reviews and splits tasks more aggressively
- planner reduces task size to compensate for lower implementation sharpness

### 4. Align With Official Claude Code Plugin Packaging

Official plugin structure matters now:

```text
plugin-root/
  .claude-plugin/plugin.json
  agents/
  skills/
  README.md
```

Development and install flow:

- local dev: `claude --plugin-dir ./kiln-gpt`
- marketplace install: `/plugin install kiln-gpt@<marketplace>`
- interactive browse: `/plugin > Discover`

### 5. Make State Durable And Namespaced

`STATE.md` alone is not enough once runs get interrupted or restarted.

New persistence layout:

```text
.kiln/
  runs/
    <run_id>/
      STATE.md
      manifest.md
      events.md
      tasks/
      docs/
      reports/
  current-run.txt
```

### 6. Split "Build" Into Control Loop + Specialist Playbooks

The original plan buried too much in `kiln-build`. The improved version keeps:

- `kiln-build` = control loop and phase transitions
- `kiln-planner` = JIT task design
- `kiln-worker` = implementation execution
- `kiln-bridge` = model bridge mechanics

### 7. Add Failure Policies Up Front

Every long-lived agent system fails in the same boring ways. The plugin needs
declared responses for:

- stale tasks
- late messages
- agent hangs
- partial mind serialization
- bridge command missing
- review deadlock
- validation deadlock
- resume after operator abort

## Architecture Summary

### Core Principles

1. One Claude team per run.
2. Main session is the only lifecycle supervisor.
3. Conversation is control; files are durable state.
4. Each artifact has one owner.
5. Event-driven transitions beat polling.
6. If a phase overflows context, the phase design is wrong.
7. External model bridges are optional accelerators, not structural dependencies.
8. The pipeline must support application, CLI, and library archetypes through
   project adapters rather than one universal prompt blob.

### Role Families

#### Kernel

- `kiln-fire`
- `kiln-peek`
- `kiln-resume`
- `kiln-reset`
- `kiln-doctor`

#### Persistent Minds

- Visionary
- Architect
- Sentinel

#### Specialists

- Da Vinci
- Mnemosyne
- Sherlock
- Confucius
- Sun Tzu
- Socrates
- Plato
- Athena
- Scheherazade
- Sphinx
- Argus

#### Execution Wrappers

- Workers
- GPT bridge
- Codex bridge

## Skill Inventory

The cleaner decomposition is 17 skills, not 12.
Twelve was elegant on paper; seventeen is more honest.

### User-Facing Skills

1. `kiln-fire` — start or continue a full run
2. `kiln-peek` — natural-language status and recent events
3. `kiln-resume` — reattach to the latest interrupted run
4. `kiln-reset` — archive or clear broken run state
5. `kiln-doctor` — verify install paths, agents, skills, plugin manifest, and bridge commands

### Pipeline Skills

6. `kiln-init` — detect greenfield/brownfield/returning project and create run folders
7. `kiln-mapper` — brownfield scan and synthesis
8. `kiln-brainstorm` — interactive discovery and approval
9. `kiln-research` — parallel research phase
10. `kiln-architect` — plan, debate, synthesize, validate
11. `kiln-build` — phase loop control
12. `kiln-validate` — acceptance and deployment checks
13. `kiln-report` — final delivery artifacts

### Shared Playbooks

14. `kiln-mind` — persistent mind lifecycle and serialization
15. `kiln-planner` — JIT task prompt creation and review loop shaping
16. `kiln-worker` — implementation behavior for Claude/Sonnet wrappers
17. `kiln-bridge` — GPT/Codex command execution contracts

The count lands at 17 because the bridge deserves its own surface. I am not
compressing it back into a prettier number.

## Runtime State Machine

The improved state machine is explicit about paused and failed states:

```text
BOOTSTRAP
  -> INIT
  -> MAP
  -> BRAINSTORM
  -> RESEARCH
  -> ARCHITECT
  -> BUILD_PLAN[n]
  -> BUILD_EXECUTE[n]
  -> BUILD_REVIEW[n]
  -> VALIDATE
  -> REPORT
  -> COMPLETE

Any state may transition to:
  -> PAUSED
  -> FAILED
  -> ABORTED
```

`/kiln:resume` only works from `PAUSED`, `FAILED`, or `ABORTED`.

## Delivery File Tree

```text
kilngpt/
  README.md
  plan/
  skills/
    kiln-fire/
    kiln-peek/
    kiln-resume/
    kiln-reset/
    kiln-doctor/
    kiln-init/
    kiln-mapper/
    kiln-brainstorm/
    kiln-research/
    kiln-architect/
    kiln-build/
    kiln-validate/
    kiln-report/
    kiln-mind/
    kiln-planner/
    kiln-worker/
    kiln-bridge/
  agents/
  references/
  assets/
```

## Build Roadmap

Status markers:

- `[ ]` todo
- `[>]` in progress
- `[x]` done

### Phase 0 — Platform Contracts

- [ ] `P00.1` Define plugin folder layout, `.claude-plugin/plugin.json`, and install locations
- [ ] `P00.2` Define `.kiln/runs/<run_id>/` file contract
- [ ] `P00.3` Define task ID, agent ID, and message envelope formats
- [ ] `P00.4` Define degraded mode when Codex CLI is unavailable
- [ ] `P00.5` Build `kiln-doctor`

Exit gate: a fresh workspace can be diagnosed before a run starts.

### Phase 1 — Kernel

- [ ] `P01.1` Build `kiln-init`
- [ ] `P01.2` Build `kiln-fire`
- [ ] `P01.3` Build `kiln-peek`
- [ ] `P01.4` Build `kiln-resume`
- [ ] `P01.5` Build `kiln-reset`

Exit gate: a run can start, pause, resume, fail, and be reset deterministically.

### Phase 2 — Persistent Minds

- [ ] `P02.1` Build `kiln-mind`
- [ ] `P02.2` Define owner schemas for Visionary, Architect, Sentinel
- [ ] `P02.3` Add serialization self-check before shutdown
- [ ] `P02.4` Add mind bootstrap validation

Exit gate: the three minds can survive a restart without identity drift.

### Phase 3 — Discovery Front-End

- [ ] `P03.1` Build `kiln-brainstorm`
- [ ] `P03.2` Build `kiln-mapper`
- [ ] `P03.3` Wire brainstorm and mapper outputs into run docs

Exit gate: greenfield and brownfield discovery produce durable inputs for planning.

### Phase 4 — Planning Stack

- [ ] `P04.1` Build `kiln-research`
- [ ] `P04.2` Build `kiln-architect`
- [ ] `P04.3` Build `kiln-planner`
- [ ] `P04.4` Define architecture approval and rejection loop

Exit gate: the pipeline produces a phaseable master plan from validated inputs.

### Phase 5 — Execution Stack

- [ ] `P05.1` Build `kiln-bridge`
- [ ] `P05.2` Build `kiln-worker`
- [ ] `P05.3` Build `kiln-build`
- [ ] `P05.4` Define review loop with Sphinx and Sentinel
- [ ] `P05.5` Define stale-task reaping and hang recovery
- [ ] `P05.6` Define Sonnet-only implementation mode when Codex bridge is absent

Exit gate: a phase can be planned, executed, reviewed, and either advanced or retried.

### Phase 6 — Finalization

- [ ] `P06.1` Build `kiln-validate`
- [ ] `P06.2` Build `kiln-report`
- [ ] `P06.3` Add final run report and artifact index

Exit gate: the system can validate outcomes and deliver a coherent summary.

### Phase 7 — Assembly

- [ ] `P07.1` Create agent definition files
- [ ] `P07.2` Create shared references and data assets
- [ ] `P07.3` Install into a real Claude environment
- [ ] `P07.4` Run one greenfield application E2E proof
- [ ] `P07.5` Run one brownfield application E2E proof
- [ ] `P07.6` Run one CLI or library E2E proof
- [ ] `P07.7` Tighten copy, voice, and docs

Exit gate: the plugin is installable, runnable, and demonstrated.

## Remaining Strategic Questions

These are the only questions still worth bothering you with now:

1. Which bridge command should be treated as canonical for GPT planning in this plugin: none for v1, or a specific CLI you already rely on?
