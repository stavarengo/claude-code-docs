---
title: Define outcomes
url: https://platform.claude.com/docs/en/managed-agents/define-outcomes
description: Tell the agent what 'done' looks like, and let it iterate until it gets there.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

An outcome tells the session what the end result should look like and how to measure its quality. The agent works toward that target, self-evaluating and iterating until the outcome is met.

When you define an outcome, the harness automatically provisions a *grader* to evaluate the artifact against a rubric. The grader uses a separate context window to avoid being influenced by the main agent's implementation choices.

The grader returns an explanation summarizing which criteria passed or failed, or confirming that the artifact satisfies the rubric. That feedback is handed back to the agent for the next iteration.

## Create a rubric

A rubric is a markdown document describing per-criterion scoring. The rubric is required.

<Accordion title="Tips for writing effective rubrics">
  Structure the rubric as explicit, gradeable criteria, such as "The CSV contains a price column with numeric values" rather than "The data looks good." The grader scores each criterion independently, so vague criteria produce noisy evaluations.

  If you don't have a rubric, try giving Claude an example of a known-good artifact and asking it to analyze what makes that content good, then turn that analysis into a rubric. This middle-ground approach often produces better results than writing criteria with no example to start from.
</Accordion>

Example rubric:

```markdown
# DCF Model Rubric

## Revenue Projections
- Uses historical revenue data from the last 5 fiscal years
- Projects revenue for at least 5 years forward
- Growth rate assumptions are explicitly stated and reasonable

## Cost Structure
- COGS and operating expenses are modeled separately
- Margins are consistent with historical trends or deviations are justified

## Discount Rate
- WACC is calculated with stated assumptions for cost of equity and cost of debt
- Beta, risk-free rate, and equity risk premium are sourced or justified

## Terminal Value
- Uses either perpetuity growth or exit multiple method (stated which)
- Terminal growth rate does not exceed long-term GDP growth

## Output Quality
- All figures are in a single .xlsx file with clearly labeled sheets
- Key assumptions are on a separate "Assumptions" sheet
- Sensitivity analysis on WACC and terminal growth rate is included
```

Pass the rubric as inline text on `user.define_outcome` (see [Create a session with an outcome](https://platform.claude.com/docs/en/managed-agents/define-outcomes?sdk_languages=cli#create-a-session-with-an-outcome)), or upload it through the Files API for reuse across sessions.

<CodeGroup>
  ```bash CLI
  ant files upload --file /tmp/rubric.md
  ```
</CodeGroup>

## Create a session with an outcome

The following examples create a [session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) for an existing [agent](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli) and [environment](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli) (both created separately), then send a `user.define_outcome` event. The agent starts work immediately. No additional user message event is required.

<CodeGroup>
  ```bash CLI
  # Create a session
  ant beta:sessions create \
    --agent "$AGENT_ID" \
    --environment-id "$ENVIRONMENT_ID" \
    --title "Financial analysis on Costco"

  # Define the outcome: SESSION_ID is the ID from the create response
  # The agent starts working when it receives the event
  ant beta:sessions:events send --session-id "$SESSION_ID" <<YAML
  events:
    - type: user.define_outcome
      description: Build a DCF model for Costco in .xlsx
      rubric: {type: file, file_id: $RUBRIC_ID}
      # or: rubric: {type: text, content: "..."}
      max_iterations: 5  # optional; default 3, max 20
  YAML
  ```
</CodeGroup>

<Note>
  You can also define the outcome in the create request itself: pass a single `user.define_outcome` event in [`initial_events`](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#seed-the-session-with-initial-events) to create the session and start work toward the outcome in one call.
</Note>

## Outcome events

Progress on an outcome-oriented session is surfaced on the events [stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli).

* `agent.*` events (such as messages and tool use) show progress toward the outcome.
* `span.outcome_evaluation_*` events are only emitted for outcome-oriented sessions and show the number of iteration loops and the grader's feedback process.
* You can also send `user.message` [events](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types) to an outcome-oriented session to direct the agent's work as it progresses, but it isn't required: the agent works toward the outcome on its own, iterating until it succeeds or runs out of iterations.
* A `user.interrupt` event pauses work on the current outcome and marks the `result` of the `span.outcome_evaluation_end` event as `interrupted`, allowing you to start a new outcome.
* After the final outcome evaluation, the session can be continued as a conversational session, or a new outcome can be started. The session retains history of the prior outcome.

### Define outcome user event

<Note>
  Only one outcome is supported at a time, but you can chain outcomes in sequence. To do this, send a new `user.define_outcome` event after the terminal `span.outcome_evaluation_end` event of the previous outcome.
</Note>

This is the event you send to initiate an outcome. It is echoed back on receipt, including a `processed_at` timestamp and `outcome_id`.

```json
{
  "type": "user.define_outcome",
  "description": "Build a DCF model for Costco in .xlsx",
  "rubric": { "type": "file", "file_id": "file_01..." },
  "max_iterations": 5
}
```

### Outcome evaluation start

Emitted once the grader starts an evaluation over one iteration loop. The `iteration` field is a 0-indexed revision counter: `0` is the first evaluation, `1` is the re-evaluation after the first revision, and so on.

```json
{
  "type": "span.outcome_evaluation_start",
  "id": "sevt_01def...",
  "outcome_id": "outc_01a...",
  "iteration": 0,
  "processed_at": "2026-03-25T14:01:45Z"
}
```

### Outcome evaluation ongoing

Heartbeat emitted while the grader runs. The grader's internal reasoning is opaque: the event shows only that the grader is working.

```json
{
  "type": "span.outcome_evaluation_ongoing",
  "id": "sevt_01ghi...",
  "outcome_id": "outc_01a...",
  "iteration": 0,
  "processed_at": "2026-03-25T14:02:10Z"
}
```

### Outcome evaluation end

Emitted when an outcome evaluation cycle ends: after the grader finishes evaluating one iteration, or when the session is interrupted while an outcome is active. The `result` field indicates what occurs next.

| Result                   | Next                                                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `satisfied`              | Session transitions to `idle`.                                                                                                                                                                                            |
| `needs_revision`         | Agent starts a new iteration cycle.                                                                                                                                                                                       |
| `max_iterations_reached` | One final acknowledgment turn follows before the session transitions to `idle`. No further evaluation runs.                                                                                                               |
| `failed`                 | Session transitions to `idle`. Returned when the rubric does not apply to the deliverables, for example if the description and rubric contradict each other.                                                              |
| `interrupted`            | Emitted when the session is interrupted while an outcome is active, even if evaluation hadn't started yet. If no `outcome_evaluation_start` fired before the interrupt, `outcome_evaluation_start_id` is an empty string. |

```json
{
  "type": "span.outcome_evaluation_end",
  "id": "sevt_01jkl...",
  "outcome_evaluation_start_id": "sevt_01def...",
  "outcome_id": "outc_01a...",
  "result": "satisfied",
  "explanation": "All 12 criteria met: revenue projections use 5 years of historical data, WACC assumptions are stated, sensitivity table is included...",
  "iteration": 0,
  "usage": {
    "input_tokens": 2400,
    "output_tokens": 350,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 1800
  },
  "processed_at": "2026-03-25T14:03:00Z"
}
```

## Check outcome status

You can either listen on the [event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli) for `span.outcome_evaluation_end`, or poll `GET /v1/sessions/{session_id}` and read `outcome_evaluations[].result`. Until an evaluation completes, `result` reports `pending`, `running`, or `evaluating`:

<CodeGroup>
  ```bash CLI
  ant beta:sessions retrieve --session-id "$SESSION_ID"
  ```
</CodeGroup>

## Retrieve deliverables

The agent writes output files to `/mnt/session/outputs/` inside the sandbox. To retrieve them, list files through the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli) with the session ID as the `scope_id`, then download them by ID. Filtering by `scope_id` requires the `managed-agents-2026-04-01` beta header on the list request, so the SDK and CLI examples make that call through the `beta` namespace and pass the header explicitly. Files appear in the list shortly after the agent finishes writing them, sometimes a few seconds after the session goes idle. If a file you expect is not listed yet, list again after a short delay; once it appears in the list, its upload is complete.

<CodeGroup>
  ```bash CLI
  # List files produced by this session
  # scope_id filtering requires the managed-agents beta on the files request
  ant beta:files list --scope-id "$SESSION_ID" --beta managed-agents-2026-04-01

  # Download a file by the ID from the list
  ant files download --file-id "$FILE_ID" --output /tmp/output.txt
  ```
</CodeGroup>

## Next steps

<CardGroup cols={3}>
  <Card title="Authenticate with vaults" icon="fingerprint" href="https://platform.claude.com/docs/en/managed-agents/vaults?sdk_languages=cli">
    Register per-user credentials when creating sessions.
  </Card>

  <Card title="Session event stream" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli">
    Send events, stream responses, and interrupt or redirect your session while it runs.
  </Card>

  <Card title="Adding files" icon="file" href="https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli">
    Upload files and mount them in your sandbox for reading and processing.
  </Card>
</CardGroup>
