# Kiln GPT Operator Decisions

This file captures the operator-experience decisions locked during design.
These are implementation inputs, not vague preferences.

## Core Flow

- `kiln-fire` continues an existing run automatically if one exists.
- A brand-new run uses ultra-minimal pre-brainstorm onboarding.
- Brainstorm is the last major interactive phase.
- After `VISION.md` approval, Kiln becomes fully autonomous by default.
- Default gate profile is `Vision only`.
- Failures use smart retries and refinement loops before a hard stop.

## Onboarding Structure

### Before Brainstorm

Ask only:

- operator style / experience posture
- whether the operator wants advanced controls

Do not front-load execution questions before the project vision exists.

### After `VISION.md` Approval

Ask only execution-essential questions, adaptively:

- debate rigor
- gate profile if overridden
- Codex availability / fallback choice
- likely credential readiness
- any advanced controls made relevant by the project

Group those questions smartly when that is more efficient.

## Operator Style

- Default operator posture is fast, direct, and low-friction.
- Question phrasing adapts to operator style.
- Choices are shown compactly, but free-form responses are always allowed.
- Style is remembered per project and can be overridden naturally later.

## Visual / Voice UX

- Default voice is mythic-minimal.
- Visual design should be elegant, restrained, and visually beautiful.
- `ma` is the design principle: spacing, rhythm, and calm emphasis.
- Ambient status should be minimal to preserve main-session context.
- Runtime diagnostics should be narrative-first with a link/path to technical detail.
- Final report should be elegant, but grounded in what was actually validated.

## Debate / Rigor

- Default planning rigor is focused debate.
- Full debate is available and should preserve the strong old Kiln critique/revise model.
- Debate should remain operator-selectable.
- In a later version, the system may choose rigor per decision class.

## Brownfield Behavior

- Brownfield projects map first automatically.
- Do not bug the user with obvious brownfield confirmations.

## Codex / Fallback

- If Codex CLI is missing, warn clearly and ask whether to proceed in Claude-only mode.
- Codex is strongly recommended but not mandatory.

## Validation / Deployment

- Default validation is real validation, not just static checks.
- Use Playwright and equivalent tools where relevant.
- Deployment posture is local-first by default.
- If the operator wants hosted or another environment, Kiln should adapt.

## Credentials / Security

- Credential handling is security-critical.
- During brainstorm, Kiln may identify likely credential classes.
- After `VISION.md` approval, Kiln should ask for readiness and missing items.
- Secret values should not be sprayed into generic artifacts or status chatter.

## Memory / Defaults

- Use Claude-native memory where it genuinely helps.
- Use project-local `.kiln/config.json` for hard execution defaults.
- Use active run state for per-run overrides.
- Project defaults should persist across sessions.

## Interruptions

- The operator can always talk naturally to Kiln.
- Changes apply from the next safe point onward.
- Kiln should briefly acknowledge the safe point when adapting.

## Persistent Minds

- Visionary, Architect, and Sentinel are explicit inner voices of Kiln.
- They are persistent team members and smart owners of durable artifacts.
- They are not intended operator chat endpoints.
- They interact with workers and non-persistent specialists.
- Da Vinci remains the only explicitly interactive specialist in the intended workflow.

## Brainstorm

- Brainstorm quality should be treated as foundational.
- Use the existing three-tier depth model from Kiln:
  - quick
  - balanced
  - full-depth
- Kiln should clearly explain that shallow brainstorming increases downstream assumptions.

## Tmux

- Recommend `tmux` strongly for a better multi-agent view.
- Do not make `tmux` a hard dependency in the native plugin design.
