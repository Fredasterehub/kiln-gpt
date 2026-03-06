# Kiln GPT — Runtime Architecture

## 1. Product Shape

Kiln GPT is a Claude-native orchestration plugin with three distinct layers:

1. control plane
2. durable knowledge plane
3. execution bridge plane

The original draft blurred those layers. This version does not.

## 2. Control Plane

The main session is the only supervisor. It owns:

- team lifecycle
- run state transitions
- task graph progression
- failure classification
- resume and reset behavior

It does not own domain reasoning. That belongs to specialists and minds.

### Single-Team Rule

Each run creates exactly one Claude team and tears it down only at the end.

Reason:

- team recycling breaks message continuity
- subagents cannot safely own orchestration
- keeping one team preserves operator interaction windows

### State Machine

```text
BOOTSTRAP
  INIT
  MAP?
  BRAINSTORM
  RESEARCH
  ARCHITECT
  BUILD_PLAN[n]
  BUILD_EXECUTE[n]
  BUILD_REVIEW[n]
  VALIDATE
  REPORT
  COMPLETE
```

Exceptional states:

- `PAUSED`
- `FAILED`
- `ABORTED`

## 3. Durable Knowledge Plane

The durable plane exists under `.kiln/runs/<run_id>/`.

```text
.kiln/
  current-run.txt
  runs/
    <run_id>/
      STATE.md
      manifest.md
      events.md
      docs/
        VISION.md
        architecture.md
        decisions.md
        tech-stack.md
        constraints.md
        patterns.md
        pitfalls.md
        master-plan.md
      tasks/
      reports/
```

### Ownership Rules

- Visionary owns vision files.
- Architect owns architecture and decision files.
- Sentinel owns quality pattern files.
- Kernel skills own state, manifest, event, and task ledgers.
- Reporter owns final report artifacts.

No file gets multiple owners.

### Why This Matters

If ownership is ambiguous, long-lived agent systems quietly rot:

- duplicate writes
- stale summaries
- impossible resume logic
- confidence theater in the status view

I prefer boredom to decay.

## 4. Persistent Minds

The persistent minds are not file updaters. They are opinionated agents with
memory continuity enforced by serialized artifacts.

### Mind Roles

- Visionary: priorities, user value, scope, acceptance shape
- Architect: system shape, constraints, tradeoffs, master plan coherence
- Sentinel: implementation patterns, review standards, pitfalls, regression memory

### Mind Lifecycle

1. bootstrap from owned files
2. participate in their relevant phase groups
3. answer targeted questions via messaging
4. serialize fresh state before shutdown
5. self-check serialization quality
6. respawn only at macro-boundaries

### Macro-Boundary Rule

Respawn minds at major boundaries, not every phase:

- after architecture approval
- after every N implementation phases
- before validation if implementation context became noisy

If they need more respawns than that, the phase design is wrong.

## 5. Execution Bridge Plane

The bridge plane is the cleanest improvement over the original plan.

External model calls are treated as bridge operations with strict contracts:

- detect binary availability
- detect auth failure
- enforce timeout windows
- capture stdout and stderr
- redact irrelevant noise from control context
- emit compact result envelopes to the supervisor
- fall back to Claude-only mode when configured

### Bridge Roles

- planning bridge: optional external planning prompt generation
- Codex bridge: optional implementation execution

### Native Fallback Roles

If Codex CLI is unavailable:

- Sonnet workers implement directly
- Opus reviewers tighten acceptance criteria
- planner emits smaller and more testable tasks

The system should become slower and somewhat less capable, not unusable.

### Why A Separate Bridge Skill Exists

Without it, every Sonnet wrapper becomes its own ad hoc shell script with
slightly different error handling. That is how reliability dies.

## 6. Agent Families

### Persistent

- Visionary
- Architect
- Sentinel

### Interactive

- Da Vinci

### Analytical

- Mnemosyne
- Sherlock
- Confucius
- Sun Tzu
- Socrates
- Plato
- Athena

### Delivery

- Scheherazade
- Workers
- Sphinx
- Argus

## 7. Message And Task Contracts

### Agent Identity

Every spawned agent name is unique:

```text
<persona>-<run_id>-<stage>-<instance>
```

Example:

```text
architect-r20260306-architect-001
worker-r20260306-build03-004
```

Late messages to dead agents are discarded by identity, not guessed into the
next incarnation.

### Task Identity

Task IDs are globally unique within a run:

```text
K-<run_id>-<phase>-<sequence>
```

Example:

```text
K-r20260306-build03-004
```

### Message Envelope

Every important inter-agent message uses the same compact envelope:

```text
[kiln]
run_id: r20260306
from: worker-r20260306-build03-004
to: architect-r20260306-build03-001
kind: consultation_request
task_id: K-r20260306-build03-004
summary: Need guidance on auth error-handling pattern.
```

This is ugly in the right way. Machines like it. Humans can still read it.

## 8. Failure Model

The plugin needs declared policies for ordinary failures.

### Agent Hang

- mark the agent stale after timeout threshold
- emit a kernel event
- respawn with a new identity
- reassign incomplete tasks

### Partial Mind Serialization

- block shutdown
- run serialization self-check
- require repair before respawn boundary closes

### Stale Tasks

- mark `orphaned`
- requeue only if inputs are still valid
- otherwise send back to planner for regeneration

### Missing Bridge Command

- `kiln-doctor` should catch it before the run
- if discovered during the run, switch to degraded mode or fail with a precise reason

### Review Deadlock

- after N failed review loops, escalate to Architect + Sentinel synthesis
- either rewrite the task or split it into smaller tasks

### Resume After Abort

- read `STATE.md`, `events.md`, and unfinished tasks
- verify agent identities are dead
- respawn only the roles required for the current state

## 9. User-Facing Surface

### `/kiln:fire`

Start a new run or continue the current one if the state is resumable.

### `/kiln:peek`

Read-only status with natural-language summaries:

- current state
- active agents
- blocked tasks
- last significant event
- next likely action

### `/kiln:resume`

Recover a paused, failed, or aborted run.

### `/kiln:reset`

Archive or clear current run state.

### `/kiln:doctor`

Verify:

- plugin install paths
- skill discovery
- agent discovery
- bridge command availability
- write access for `.kiln/`
- whether the plugin is being run via `--plugin-dir` or as an installed plugin

## 10. Skill Layout

```text
kiln-gpt/
  .claude-plugin/
    plugin.json
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

## 11. Recommended Implementation Order

The right order is not glamorous:

1. `kiln-doctor`
2. `kiln-init`
3. `kiln-peek`
4. `kiln-reset`
5. `kiln-resume`
6. `kiln-mind`
7. `kiln-brainstorm`
8. `kiln-mapper`
9. `kiln-research`
10. `kiln-architect`
11. `kiln-bridge`
12. `kiln-planner`
13. `kiln-worker`
14. `kiln-build`
15. `kiln-validate`
16. `kiln-report`
17. `kiln-fire` final integration pass

`kiln-fire` should be integrated last, not first. It is the thinnest layer and
the easiest place to lie to yourself about progress.
