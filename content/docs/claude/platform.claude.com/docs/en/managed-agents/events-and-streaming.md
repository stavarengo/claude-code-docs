---
title: Session event stream
url: https://platform.claude.com/docs/en/managed-agents/events-and-streaming
description: Send events, stream responses, and interrupt or redirect your session while it runs.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
  zdr:
    eligibility: not-eligible
    note: Sessions are stateful resources; transcripts persist until you delete them. Applies to all Managed Agents sub-features, including Self-hosted sandboxes.
  supportedModels:
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
    - claude-opus-4-5-20251101
    - claude-sonnet-4-5-20250929
  supportedPlatforms:
    Claude API: beta
    Claude Platform on AWS: beta
    Claude Models on Google Cloud (Anthropic managed): beta
---

Communication with Claude Managed Agents is event-based. You open a stream to follow a session, send events to direct it, and answer it when it pauses for input.

## Event types

Events flow in two directions: you send events to the agent, and the session sends events back to you.

* **Events you send:** `user.*` events start a session and steer it as it progresses. [`system.message`](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#send-system-messages) events append system-level context.
* **Events you receive:** Session events, span events, and agent events report the session’s state and the agent’s progress.

These event type strings follow a `{domain}.{action}` naming convention. See [Event types](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types) in the reference for the full catalog.

[Webhook event types](https://platform.claude.com/docs/en/managed-agents/webhooks?sdk_languages=cli#supported-event-types) are separate, and some of their names differ from the stream’s. For example, webhooks use `session.status_idled` rather than `session.status_idle`.

## Stream events

Stream events from the session to receive real-time updates as the agent works. A stream delivers only the events emitted after it opens, so open the stream before you send events to avoid a race condition.

<CodeGroup>
  ```bash CLI
  # Open the stream before you send the first event: only later events are delivered.
  ant beta:sessions:events stream --session-id "$SESSION_ID"
  ```
</CodeGroup>

The session reports errors through the `session.error` event. See [Event types](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types) for its fields.

The agent’s response text arrives as buffered `agent.message` events, each emitted only after the model request that produced it completes. To render the text while the model is still generating it, see [Preview responses with event deltas](https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli).

### Reconnect without missing events

To reconnect to an existing session without missing events, combine a new stream with the event history:

1. Open a new stream.
2. [List the full event history](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#list-past-events) to seed a set of seen event IDs.
3. Tail the live stream, skipping any events already returned by the history list.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Send events

Send a `user.message` event to start or continue the agent’s work:

<CodeGroup>
  ```bash CLI
  ant beta:sessions:events send --session-id "$SESSION_ID" <<'YAML'
  events:
    - type: user.message
      content:
        - type: text
          text: Analyze the performance of the sort function in utils.py
  YAML
  ```
</CodeGroup>

Every event in the session’s history includes a `processed_at` timestamp, set when the event finishes processing. On events you send, `processed_at` is `null` while the event is still queued behind earlier events. The exceptions are `user.define_outcome`, `user.custom_tool_result`, and `user.tool_result`, which are processed on receipt and echoed back with `processed_at` already populated.

## Respond when the session goes idle

A `session.status_idle` event means the agent has stopped and is waiting for input. Its `stop_reason.type` says why:

| `stop_reason.type` | Why the session stopped                                                                                                                                              | What to do                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `end_turn`         | The agent finished its turn, or [you interrupted it](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#interrupt-the-agent). | [Send a `user.message`](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#resume-an-idle-session) when you have more work for the agent. |
| `requires_action`  | One or more tool calls need an answer from you, such as a custom tool call or a confirmation request.                                                                | [Answer each blocking tool call](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#answer-tool-calls-that-pause-the-session).            |
| `budget_reached`   | The session’s tracked list cost reached its [budget](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli).                                  | [Change or remove the budget](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli#resume-a-session-at-its-budget).                                      |

No event you send resumes a session paused at its budget. The work that the budget paused resumes automatically when you change the budget to a value above the consumed list cost, or remove it. When the work resumes, the session emits a `workflow_run.status_running` event for each [workflow run that the budget paused](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#budgets-and-limits). A run that an interrupt paused stays paused; see [Resume a session at its budget](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli#resume-a-session-at-its-budget). See [When a session reaches its budget](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli#when-a-session-reaches-its-budget) for the events that mark the pause and the events the session still accepts.

## Answer tool calls that pause the session

A session pauses when the agent calls a [custom tool](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli#custom-tools), and when a tool call needs your confirmation under a [permission policy](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli). Both pauses follow the same sequence:

1. The session emits the tool call as an `agent.custom_tool_use`, `agent.tool_use`, or `agent.mcp_tool_use` event.
2. The session pauses with a `session.status_idle` event whose `stop_reason.type` is `requires_action`. The blocking event IDs are in the `stop_reason.event_ids` array.
3. For each blocking event ID, send a [`user.custom_tool_result`](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#return-a-custom-tool-result) or a [`user.tool_confirmation`](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#confirm-a-tool-call) event. A custom tool result doesn’t have to wait for step 2.
4. Once all blocking events are resolved, the session transitions back to `running`.

In a multiagent session, a subagent’s blocking events are cross-posted to the primary thread. See [Tool permissions and custom tools](https://platform.claude.com/docs/en/managed-agents/session-threads?sdk_languages=cli#tool-permissions-and-custom-tools).

### Return a custom tool result

The `agent.custom_tool_use` event contains the tool name and input. Run the tool in your system. Then send a `user.custom_tool_result` event, passing the event ID in the `custom_tool_use_id` parameter along with the result content.

You can send the result as soon as the `agent.custom_tool_use` event arrives, without waiting for `session.status_idle`. The session still emits `session.status_idle` with a `requires_action` stop reason for the call, and your client can ignore it. A second result for the same call is accepted and has no effect.

When you [reconnect](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#reconnect-without-missing-events) to a paused session, `stop_reason.event_ids` on the latest `session.status_idle` event lists the calls to answer.

The following example answers each call as it arrives:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

If the agent has [workflow runs](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli) open, a custom tool call can arrive while the session stays `running`. The `requires_action` idle event arrives only when none of the [session’s threads](https://platform.claude.com/docs/en/managed-agents/session-threads?sdk_languages=cli) is working. Don’t wait for it: answer each call when its `agent.custom_tool_use` event arrives. The sample in [Follow a run](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#follow-a-run) shows how.

### Confirm a tool call

Send a `user.tool_confirmation` event, passing the event ID in the `tool_use_id` parameter. Set `result` to `"allow"` or `"deny"`. See [Respond to confirmation requests](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli#respond-to-confirmation-requests) for which calls wait for a confirmation and how to explain a denial.

The following example approves every pending call:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

The previous example approves each call after the session goes idle. If the agent has [workflow runs](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli) open, a tool call can wait for your confirmation while the session stays `running`. Don’t wait for the idle event: when an `agent.tool_use` or `agent.mcp_tool_use` event arrives whose [`evaluated_permission`](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli#see-how-each-call-was-evaluated) is `ask`, answer it. The sample in [Follow a run](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#follow-a-run) answers custom tool calls this way, and its introduction says how to add confirmations.

## Resume an idle session

Sessions persist between interactions. To resume a session, send a `user.message` event to it as usual:

<CodeGroup>
  ```bash CLI
  # In production, pass the stored ID of the session you want to resume.
  ant beta:sessions:events send --session-id "$SESSION_ID" <<'YAML'
  events:
    - type: user.message
      content:
        - type: text
          text: Now run the tests against the changes you made earlier.
  YAML
  ```
</CodeGroup>

Conversation history is preserved unless the session is explicitly deleted. When a session goes idle, its sandbox is checkpointed. The checkpoint preserves the full sandbox state, including the filesystem, installed packages, and any files the agent created.

<Note>
  Sandbox state is preserved for only 30 days after the sandbox is created, and activity does not extend this window. After 30 days the sandbox state (files, installed tools, and so on) is unrecoverable, and a resumed session starts from a fresh sandbox. If your workflow depends on sandbox contents, have the agent write important artifacts to [outputs](https://platform.claude.com/docs/en/managed-agents/define-outcomes?sdk_languages=cli#retrieving-deliverables) before the window ends.
</Note>

## Interrupt the agent

Send a `user.interrupt` event to stop the agent while it runs, then follow up with a `user.message` event to redirect it:

<CodeGroup>
  ```bash CLI
  # Agent is currently analyzing a file...
  # Interrupt with a new direction:
  ant beta:sessions:events send --session-id "$SESSION_ID" <<'YAML'
  events:
    - type: user.interrupt
    - type: user.message
      content:
        - type: text
          text: Instead, focus on fixing the bug in line 42.
  YAML
  ```
</CodeGroup>

The call returns as soon as the events are queued. The interrupt then takes effect in this order:

1. The agent applies the interrupt. Until then, the interrupt’s `processed_at` stays `null` and the session stays `running`. A model response in progress stops immediately, but the interrupt can take longer to apply while tool calls are running.
2. The `user.interrupt` event appears on the stream, and the interrupted turn ends with a `session.status_idle` event.
3. The agent starts its next turn with the `user.message` you sent after the interrupt.

The idle event’s `stop_reason.type` is `end_turn`, the same value as a turn that completes on its own. If workflow runs are open, the interrupt ends none of them. A run that’s running can keep the session `running`, so the `session.status_idle` event in step 2 might not arrive. See [Interrupt a session with runs open](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#interrupt-a-session-with-runs-open).

## List past events

Retrieve the full event history for a session:

<CodeGroup>
  ```bash CLI
  ant beta:sessions:events list --session-id "$SESSION_ID" --format jsonl
  ```
</CodeGroup>

Pass a `--type` (cli: `--type`) filter to return only specific event types:

<CodeGroup>
  ```bash CLI
  ant beta:sessions:events list --session-id "$SESSION_ID" \
    --type agent.tool_use --type agent.tool_result \
    --format jsonl
  ```
</CodeGroup>

## Send system messages

On a [supported model](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#supported-models), send a `system.message` event to give the agent privileged system-level context. The context applies to the accompanying turn and all subsequent turns. Use it when the agent needs updated system-level guidance mid-session, for example a different persona, revised constraints, or context fetched at runtime.

The event’s `content` accepts 1–1,000 text items. The content is appended to the session’s system context as a `role: "system"` turn. It doesn’t replace the top-level system prompt, which the `system` field on the agent definition sets.

<CodeGroup>
  ```bash CLI
  ant beta:sessions:events send --session-id "$SESSION_ID" <<'YAML'
  events:
    - type: system.message
      content:
        - type: text
          text: "The user's current timezone is America/New_York."
  YAML
  ```
</CodeGroup>

### Supported models

`system.message` is supported by these models:

* Claude Fable 5.1
* Claude Mythos 5.1
* Claude Fable 5
* Claude Mythos 5
* Claude Opus 5.5
* Claude Opus 5
* Claude Opus 4.8
* Claude Sonnet 5.5
* Claude Haiku 5.5

If the agent’s primary model does not support mid-conversation system injection, the event is rejected with a `model_does_not_support_mid_conversation_system` validation error. Subagent models are not checked, because `system.message` lands on the primary thread only.

### System messages while a tool call is pending

While the session is idle with a `requires_action` stop reason, a `system.message` must trail a tool result event in the same request. Sent on its own or with a `user.message`, it is rejected until the pending tool events are resolved.

## Next steps

<CardGroup cols={2}>
  <Card title="Preview responses with event deltas" icon="text" href="https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli">
    Render the agent’s response text while the model is still generating it.
  </Card>

  <Card title="Inspect sessions and track usage" icon="magnifying-glass" href="https://platform.claude.com/docs/en/managed-agents/session-observability?sdk_languages=cli">
    Inspect a session in the Claude Console and read its token usage and list cost.
  </Card>

  <Card title="Subscribe to webhooks" icon="link" href="https://platform.claude.com/docs/en/managed-agents/webhooks?sdk_languages=cli">
    Get notified when major events occur without polling.
  </Card>

  <Card title="Event types" icon="book" href="https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types">
    Look up every event type a session can send or receive.
  </Card>
</CardGroup>
