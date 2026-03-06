# State Machine

```text
brainstorm -> plan -> execute -> validate -> deploy -> report -> complete
```

Transitions are file-driven:

- `state.json` stores the machine stage
- prompt packs are persisted before every worker call
- events are appended to `events.jsonl`

Failure handling:

- phase review failure blocks execution
- validation failure enters a correction loop
- deployment failure stops before report
