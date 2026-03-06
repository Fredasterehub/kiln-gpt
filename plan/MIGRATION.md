# Kiln Migration

This file maps the legacy `kilntwo` system to the native Claude Code plugin.

## Core Principle

Use the GitHub repo as behavioral reference, not implementation cargo.

Preserve:

- the 5-stage pipeline
- the memory contract
- the planning gate
- the per-phase execution loop
- the validation correction loop
- the persona-driven user experience

Drop or replace:

- Node installer
- CLAUDE.md protocol injection
- tmux dependency
- checksum manifest
- copied assets in `~/.claude/kilntwo/...`

## Legacy To Native Mapping

| Legacy | Native target |
|---|---|
| `kilntwo install` | Claude plugin package |
| `assets/commands/kiln/*.md` | plugin `skills/` |
| `assets/agents/*.md` | plugin `agents/` |
| `assets/protocol.md` injected into `CLAUDE.md` | explicit skill and agent instructions |
| `~/.claude/kilntwo/templates/` | plugin `references/` and runtime file creation |
| tmux preflight | native teams/subagents only |
| `MEMORY_DIR` under Claude home | `.kiln/runs/<run_id>/` in project |

## Must Preserve From Legacy Kiln

### Stage 1

- project classification
- brownfield mapping option
- brainstorm depth and debate mode selection
- Da Vinci-led interactive discovery

### Stage 2

- two independent plan sources
- optional debate
- synthesis
- Athena validation
- explicit operator approval gate

### Stage 3

- one phase at a time
- index -> plan -> sharpen -> implement -> review -> merge -> reconcile -> archive
- max three review rounds
- no guessing on ambiguous requirements

### Stage 4

- real build/deploy/test validation
- correction cycles re-enter the build loop

### Stage 5

- final operator-facing delivery summary

## Safe Simplifications

- use plugin skills and agents instead of injected protocol blocks
- use project-local `.kiln/` state instead of split project-memory under Claude home
- keep one native team per run
- remove lore-driven shell mechanics from the critical path
- treat Codex as optional acceleration rather than mandatory runtime
