# Official Notes

This file captures the official Anthropic guidance and release notes that
matter for building Kiln GPT as a real Claude Code plugin.

## Anthropic Skills Guidance

Source:

- https://github.com/anthropics/skills/tree/main/skills/skill-creator

Implications for this repo:

- keep each `SKILL.md` lean
- use progressive disclosure
- move deep details into `references/`
- avoid bloated skill bodies
- prefer reusable scripts or assets when deterministic behavior matters

This aligns well with the Kiln decomposition into small role-specific skills.

## Claude Code Plugin Shape

Sources:

- https://code.claude.com/docs/en/plugins
- https://github.com/anthropics/claude-plugins-official

Confirmed current shape:

- plugin root contains `.claude-plugin/plugin.json`
- plugin skills live in `skills/`
- plugin subagents live in `agents/`
- local development works via `claude --plugin-dir /path/to/plugin`
- install works via `/plugin install <name>@<marketplace>`
- interactive discovery works via `/plugin > Discover`

Implication:

Kiln GPT should be built as a first-class plugin package, not merely as a
copy-these-files convention.

## Claude Code Subagents

Source:

- https://docs.anthropic.com/en/docs/claude-code/sub-agents

Relevant points:

- subagents are markdown-defined
- project, personal, and plugin subagents are all supported
- plugin-provided subagents appear in the standard subagent surface

Implication:

Kiln's persona crew should be shipped as plugin agents rather than assuming
manual installation into a personal agents folder.

## Recent Claude Code Release Notes

Source:

- https://github.com/anthropics/claude-code/releases

What I verified on March 6, 2026:

- `v2.1.70` was the latest visible release
- `v2.1.70` included fixes around plugin install/status behavior
- `v2.1.69` added `/reload-plugins`

Implications:

- plugin iteration is materially easier now because reload exists
- plugin install/status edge cases are actively changing, so Kiln should keep
  `kiln-doctor` conservative and explicit

## What I Did Not Find Publicly

I did not find a current official public page that specifies long-lived task
graphs, team lifecycle, and blocked dependency orchestration at the same level
of detail as the local Kiln experiments.

Implication:

The packaging and plugin surface should follow official docs, but the deeper
orchestration runtime still needs validation against live Claude Code behavior
as we implement it.
