---
name: kiln-bridge
description: Manage Kiln GPT external bridge operations. Use to detect planning and Codex bridge availability, execute them with tight contracts, capture failures, and fall back cleanly to Claude-native mode.
---

# Kiln Bridge

Bridge work is a separate failure domain.

Use:

- [fire-control-loop.md](../../references/fire-control-loop.md)
- [planning-contract.md](../../references/planning-contract.md)
- [runtime-schemas.md](../../references/runtime-schemas.md)

## Responsibilities

- detect bridge command availability
- capture stdout, stderr, and exit status cleanly
- enforce timeouts and conservative retries
- redact irrelevant shell noise from control context
- emit a compact result envelope back to the caller
- fall back honestly when a bridge is unavailable

## Stage 3 Execution Use

For implementation bridges:

- planning bridge is optional and may produce alternate plans
- Codex bridge is preferred for bounded implementation tasks when available
- Claude-only execution remains a first-class fallback, not a broken mode

## Result Envelope

Return bridge outcomes in this shape:

```text
[kiln-bridge]
bridge: planning | codex
status: ok | missing | auth_failed | timed_out | failed
summary: <one line>
artifact: <path-or-none>
fallback: <required action or none>
```

## Rules

- Missing Codex is a capability downgrade, not an automatic fatal error.
- Never claim bridge success without a concrete artifact or verified output.
- Log posture changes and bridge failures in `events.md`.
- Keep bridge output terse enough for `kiln-fire` to reason about quickly.
