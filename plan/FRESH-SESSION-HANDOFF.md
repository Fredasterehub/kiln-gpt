# Fresh Session Handoff

Use this prompt to resume the build in a fresh session without re-discovery.

```text
You are continuing work on `/DEV/kilngpt`, a native Claude Code plugin migration of the Kiln workflow from `https://github.com/Fredasterehub/kiln`.

Read these files first:
- /DEV/kilngpt/README.md
- /DEV/kilngpt/plan/PLAN.md
- /DEV/kilngpt/plan/ARCHITECTURE.md
- /DEV/kilngpt/plan/MIGRATION.md
- /DEV/kilngpt/plan/OPERATOR-DECISIONS.md
- /DEV/kilngpt/plan/IMPLEMENTATION-BACKLOG.md
- /DEV/kilngpt/plan/OFFICIAL-NOTES.md

Then inspect the current plugin files under:
- /DEV/kilngpt/.claude-plugin/
- /DEV/kilngpt/agents/
- /DEV/kilngpt/skills/
- /DEV/kilngpt/references/

Important constraints already decided:
- Use the old Kiln repo as behavioral reference only, not implementation cargo.
- Build against native Claude Code plugin features: plugin manifest, plugin skills, plugin agents, native teams/subagents, Claude memory where appropriate.
- Do not recreate the old Node installer, CLAUDE.md protocol injection, or tmux hard dependency.
- Keep the main session as a lean control plane.
- Persistent minds are Visionary, Architect, and Sentinel; they are explicit inner voices of Kiln, persistent team members, and smart owners of durable artifacts.
- Da Vinci is the only intentionally interactive specialist.
- Default gate profile is `Vision only`.
- Pre-brainstorm onboarding is ultra-minimal.
- Post-vision execution questions are adaptive and essential-only.
- Default debate rigor is focused; full debate must preserve the strong old critique/revise model.
- If Codex is missing, warn and ask whether to continue in Claude-only mode.
- Validation is real and local-first by default, with Playwright/browser validation where relevant.
- Ambient status from the main session must stay minimal to preserve context.

Immediate implementation priority:
1. finish runtime schemas and `.kiln/config.json`
2. implement `kiln-mind` plus the three persistent minds
3. implement the planning stack, including Socrates full debate
4. wire the real `kiln-fire` control loop

Do not spend time on naming. The working package name is `Kiln GPT`.
Do not re-ask resolved operator-experience questions unless a true contradiction appears.
```

## Notes

This handoff is meant to save context window and eliminate rediscovery churn.
It is intentionally blunt.
