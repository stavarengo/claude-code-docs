---
title: Start a session
url: https://platform.claude.com/docs/en/managed-agents/sessions
description: Create a session to run your agent and start running tasks.
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

A session is an agent instance within an environment. Each session references an [agent](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli) and an [environment](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli) (both created separately), and maintains conversation history across multiple interactions. Sessions follow a two-step lifecycle: first [create the session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#creating-a-session), then [send a user event](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#starting-the-session) to start work. You can also collapse both steps into one call with [`initial_events`](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#seed-the-session-with-initial-events).

## Creating a session

A session requires an `agent` ID and an `environment` ID. Agents are versioned resources; passing in the `agent` ID as a string creates the session with the latest agent version.

<CodeGroup>
  ```bash CLI
  ant beta:sessions create --agent "$AGENT_ID" --environment-id "$ENVIRONMENT_ID"
  ```
</CodeGroup>

To pin a session to a specific agent version, pass an object. This lets you control exactly which version runs and stage rollouts of new versions independently.

<CodeGroup>
  ```bash CLI
  ant beta:sessions create <<YAML
  agent:
    type: agent
    id: $AGENT_ID
    version: 1
  environment_id: $ENVIRONMENT_ID
  YAML
  ```
</CodeGroup>

### Seed the session with initial events

You can create a session and start its work in one call. `initial_events` is an optional array of initial [events](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types) to send to the session at creation, processed in order. It supports `user.message` and [`user.define_outcome`](https://platform.claude.com/docs/en/managed-agents/define-outcomes?sdk_languages=cli) events, and accepts a maximum of 50 events. A non-empty list starts the agent loop in the same call: the session is created directly in the `running` status, with no further request.

The following example creates a session with a single `user.message` in `initial_events`:

<CodeGroup>
  ```bash CLI
  ant beta:sessions create <<YAML
  agent: $AGENT_ID
  environment_id: $ENVIRONMENT_ID
  initial_events:
    - type: user.message
      content:
        - type: text
          text: List the files in the working directory.
  YAML
  ```
</CodeGroup>

`initial_events` are not echoed on the create response. To see the seeded message, list the session’s events.

No other event type is accepted. Events that respond to an agent turn (`user.tool_confirmation`, `user.tool_result`, and `user.custom_tool_result`) aren’t accepted because no agent turn exists yet, and `user.interrupt` isn’t accepted because there is no turn to stop. Unlike `initial_events` on a scheduled deployment, a session’s `initial_events` don’t accept `system.message`.

Each event in `initial_events` is validated and persisted before the create response returns, in list order, with a server-assigned ID, exactly as if you had posted it to the [send events](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#send-events) endpoint immediately after creation. Per-event content rules are also the same as on that endpoint. An empty list is equivalent to omitting the field. Validation is all-or-nothing: if any event fails validation, the whole request is rejected and no session is created.

The create request is rejected in the following cases:

| Condition                                                                                                                                                                   | Status |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| More than one `user.define_outcome` event                                                                                                                                   | 400    |
| A `user.define_outcome` event without a `rubric`                                                                                                                            | 400    |
| More than 100 file-sourced [`document` content blocks](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#document-blocks) across the whole list | 400    |
| A request body over 32 MB                                                                                                                                                   | 413    |

A `user.define_outcome` event in `initial_events` is accepted under the same conditions as sending one to an existing session; see [Define outcomes](https://platform.claude.com/docs/en/managed-agents/define-outcomes?sdk_languages=cli).

### Override agent configuration for a session

You can pass `agent` in three forms: an agent ID string, a pinned-version object (`type: "agent"`), or an overrides object (`type: "agent_with_overrides"`). The overrides form changes parts of the agent’s configuration for a single session. Use it to try a different model or grant an extra tool in one session without versioning the agent. For the overrides form, pass the agent’s `id` and optionally a `version` (omit `version` to use the agent’s latest version). Then include any of `model`, `system`, `tools`, `mcp_servers`, or `skills` with the values the session should use.

Each overridable field follows the same three rules:

* **Omit the field:** The session inherits the value from the agent version it references.

* **Set the field to `null`, or to an empty array for list fields:** The session runs with that field cleared. This rule applies in full to `system` and `skills`. There are three exceptions:

  * `model` is never clearable. A session always needs a model, so setting `model` to `null` returns a 400 `agent_model_required` error.
  * Clearing `tools` returns a 400 error when the session’s effective `skills` is non-empty, because skills require the `read` tool. Otherwise, setting `tools` to `null` or to an empty array clears the field.
  * Clearing `mcp_servers` returns a 400 error when the session’s effective `tools` still contains an `mcp_toolset` that references one of the agent’s servers. Override `tools` in the same request to remove those `mcp_toolset` entries, then clear `mcp_servers`.

* **Set the field to a value:** The value replaces the agent’s value in full. Overrides never merge with the agent’s configuration, so a `tools` override must list every tool the session should have. Likewise, a `model` override replaces the agent’s `model` object in full, so the agent’s own `effort` isn’t carried over. To run the session at a specific effort level, set `effort` inside the override’s `model` object. A level the model doesn’t support returns a 400 error, and a `model` override without `effort` runs at that model’s default effort level.

Overrides apply only to the session you create. They do not modify the agent resource or create a new agent version, so other sessions that reference the same agent are unaffected.

In the response, the `agent` object reflects the configuration the session runs with after the overrides are applied. Its `id` and `version` still identify the agent and version the overrides are applied to. This lets you trace a session back to its base agent.

The following example starts a session that overrides the model and clears the system prompt:

<CodeGroup>
  ```bash CLI
  # The response's `agent` is the resolved snapshot: each override replaces that
  # field for this session only, and the agent resource keeps its ID and version.
  ant beta:sessions create <<YAML
  agent:
    type: agent_with_overrides
    id: $AGENT_ID
    model:
      id: claude-sonnet-5-5
    system: null
  environment_id: $ENVIRONMENT_ID
  YAML
  ```
</CodeGroup>

#### Pin the inference geo for a session

Because a `model` override replaces the agent’s `model` object in full, it also sets or clears the model’s [inference geo](https://platform.claude.com/docs/en/manage-claude/data-residency?sdk_languages=cli) pin for the session. An override that includes `inference_geo` pins the geography that serves the session’s model requests. An override that omits it clears the agent’s pin, so the session follows the workspace’s `default_inference_geo`. The overridden value is validated against the workspace’s `allowed_inference_geos` when the session is created.

The following example starts a session from an agent whose model has no geo pin, and pins the session’s model requests to US inference by including `inference_geo` in the `model` override. The response echoes the value in `agent.model`:

<CodeGroup>
  ```bash CLI
  # Replaces the whole model object of the agent: restate id, add inference_geo to pin.
  ant beta:sessions create <<YAML
  agent:
    type: agent_with_overrides
    id: $AGENT_ID
    model:
      id: claude-opus-5-5
      inference_geo: us
  environment_id: $ENVIRONMENT_ID
  YAML
  ```
</CodeGroup>

<Tip>
  The agent defines how Claude behaves within the session, including the model, system prompt, tools, and MCP servers. See [Define your agent](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli) for details.
</Tip>

### Set a session budget

To cap what a session can spend, pass the optional `budget` object when you create it. A budget is a hard ceiling on the session’s list cost: the platform prices everything the session consumes at public list rates, and the session stops issuing new model requests once that running total reaches `max_list_cost`. The budget’s `type` is always `limit`. Give `max_list_cost` an `amount` and a `currency`. `amount` is a whole number of US cents written as a string, such as `"125"` for $1.25 USD. The API takes a string rather than a number so no floating-point rounding is ever applied. `USD` is the only currency currently supported. When the session reaches the cap, it pauses and goes idle with the stop reason `budget_reached`. The cap is enforced between model requests, so the request that crosses it completes first and the session’s final list cost can land [a fraction past the cap](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli#when-a-session-reaches-its-budget). A budget can only be attached at creation: you can [change or remove the budget](https://platform.claude.com/docs/en/managed-agents/session-operations?sdk_languages=cli#updating-the-session-budget) later, but you can’t add one to a session created without it.

The following example creates a session with a $1.25 USD budget:

<CodeGroup>
  ```bash CLI
  # Keep the amount quoted so it is sent as a string, not a number.
  ant beta:sessions create \
    --agent "$AGENT_ID" \
    --environment-id "$ENVIRONMENT_ID" \
    --budget '{type: limit, max_list_cost: {amount: "125", currency: USD}}'
  ```
</CodeGroup>

See [Session budgets](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli) for how enforcement works, what counts toward list cost, and how budgets behave in multiagent sessions.

## MCP authentication through vaults

If your agent uses MCP tools that require authentication, pass `vault_ids` at session creation to reference a vault containing stored OAuth credentials. Anthropic manages token refresh on your behalf. See [Authenticate with vaults](https://platform.claude.com/docs/en/managed-agents/vaults?sdk_languages=cli) for how to create vaults and register credentials.

<CodeGroup>
  ```bash CLI
  ant beta:sessions create <<YAML
  agent: $AGENT_ID
  environment_id: $ENVIRONMENT_ID
  vault_ids:
    - $VAULT_ID
  YAML
  ```
</CodeGroup>

## Starting the session

Creating a session without `initial_events` registers the session but does not start any work; the environment’s sandbox starts provisioning as soon as the session is created, so the first tool call does not wait on it. To delegate a task, send events to the session using a [user event](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types). To supply the first event in the create request instead, see [Seed the session with initial events](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#seed-the-session-with-initial-events). The session acts as a state machine that tracks progress, and events drive the actual execution.

<CodeGroup>
  ```bash CLI
  ant beta:sessions:events send --session-id "$SESSION_ID" <<'YAML'
  events:
    - type: user.message
      content:
        - type: text
          text: List the files in the working directory.
  YAML
  ```
</CodeGroup>

See [Session event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli) for how to stream the agent’s responses and handle tool confirmations.

See [Session statuses](https://platform.claude.com/docs/en/managed-agents/session-operations?sdk_languages=cli#session-statuses) for the statuses a session moves through.

## Next steps

<CardGroup cols={3}>
  <Card title="Session operations" icon="settings" href="https://platform.claude.com/docs/en/managed-agents/session-operations?sdk_languages=cli">
    Retrieve, list, update, archive, and delete Claude Managed Agents sessions.
  </Card>

  <Card title="Session event stream" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli">
    Send events, stream responses, and interrupt or redirect your session while it runs.
  </Card>

  <Card title="Scheduled deployments" icon="arrows-clockwise" href="https://platform.claude.com/docs/en/managed-agents/scheduled-deployments?sdk_languages=cli">
    Create and manage deployments with the Claude API: run an agent on a recurring cron schedule and inspect its run history.
  </Card>
</CardGroup>
