---
title: Define your agent
url: https://platform.claude.com/docs/en/managed-agents/agent-setup
description: Create a reusable, versioned agent configuration.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
  zdr:
    eligibility: not-eligible
    note: Not eligible for ZDR, except for self-hosted Managed Agents. Sessions are stateful resources; transcripts persist until you delete them.
  supportedModels:
    - claude-fable-5-2
    - claude-mythos-5-2
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

An agent is a reusable, versioned configuration that defines persona and capabilities. It bundles the model, system prompt, tools, MCP servers, and skills that shape how Claude behaves during a session.

Create the agent once as a reusable resource and reference it by ID each time you [start a session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli). Agents are versioned and easier to manage across many sessions.

## Agent configuration fields

| Field         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`        | Required. A human-readable name for the agent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `model`       | Required. The Claude [model](https://platform.claude.com/docs/en/models/overview?sdk_languages=cli) that powers the agent. Accepts a model ID string or an object, for example `{"id": "claude-opus-5-5"}`. Claude 4.5 and later models are supported. The object form also accepts `speed`, `effort`, and `inference_geo` fields; see the tips under [Create an agent](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli#create-an-agent), [Effort levels](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli#effort-levels), and [Pin the inference geo](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli#pin-the-inference-geo). |
| `system`      | A [system prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices?sdk_languages=cli#give-claude-a-role) that defines the agent’s behavior and persona. The system prompt is distinct from [user messages](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types), which should describe the work to be done.                                                                                                                                                                                                                                                                                                                     |
| `tools`       | The tools available to the agent. Combines [pre-built agent tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli), [MCP tools](https://platform.claude.com/docs/en/managed-agents/mcp-connector?sdk_languages=cli), and [custom tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli#custom-tools).                                                                                                                                                                                                                                                                                                                                                                  |
| `mcp_servers` | [MCP servers](https://platform.claude.com/docs/en/managed-agents/mcp-connector?sdk_languages=cli) that provide standardized third-party capabilities.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `skills`      | [Skills](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli) that supply domain-specific context with progressive disclosure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `multiagent`  | Lets the agent hand work to other agents, as subagents or in [dynamic workflows](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#dynamic-workflows), and optionally consult an [advisor](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#give-the-session-an-advisor) model. With the `multiagent_20261001` type, dynamic workflows are on unless you disable them. See [Multiagent orchestration](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli).                                                                                                                                 |
| `description` | A description of what the agent does.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `metadata`    | Arbitrary key-value pairs for your own tracking.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

You can also override `model`, `system`, `tools`, `mcp_servers`, and `skills` for a single session without changing the agent. A `model` override replaces the agent’s `model` object in full, so the agent’s own `effort` isn’t carried over. To run the session at a specific effort level, set `effort` inside the override’s `model` object. See [Override agent configuration for a session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#override-agent-configuration-for-a-session).

## Create an agent

The following example defines a coding agent that uses the newest Claude Opus model with access to the pre-built agent toolset. The toolset lets the agent write code, read files, search the web, and more. See [Tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli) for the full list of supported tools.

The examples use curl, the `ant` CLI, or the SDK. If you haven’t set one up, [Get started with Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/quickstart?sdk_languages=cli#before-you-begin) covers installation and client setup.

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply coding-assistant.md
    ```

    <File filename="coding-assistant.md">
      ```markdown
      ---
      name: Coding Assistant
      model: claude-opus-5-5
      tools:
        - type: agent_toolset_20260401
      ---

      You are a helpful coding agent.
      ```
    </File>

    [`ant apply`](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/apply?sdk_languages=cli) creates the agent from `coding-assistant.md`, prints its ID, and records it in `claude-lock.json`. Commit `claude-lock.json` so the next `ant apply` updates this agent instead of creating a second one.
  </CodeGroupItem>
</CodeGroup>

The response echoes your configuration and adds `id`, `type`, `version`, `created_at`, `updated_at`, and `archived_at` fields, and fills in `model` fields you omit, such as `effort`, with their defaults. The `version` starts at 1 and increments each time an update changes the agent.

```json
{
  "id": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
  "type": "agent",
  "name": "Coding Assistant",
  "model": {
    "id": "claude-opus-5-5",
    "effort": { "type": "medium" },
    "speed": "standard"
  },
  "system": "You are a helpful coding agent.",
  "description": null,
  "tools": [
    {
      "type": "agent_toolset_20260401",
      "default_config": {
        "permission_policy": { "type": "always_allow" }
      }
    }
  ],
  "skills": [],
  "mcp_servers": [],
  "multiagent": null,
  "metadata": {},
  "version": 1,
  "created_at": "2026-04-03T18:24:10.412Z",
  "updated_at": "2026-04-03T18:24:10.412Z",
  "archived_at": null
}
```

The `default_config` on the toolset shows its default [permission policy](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli), `always_allow`, which applies unless you configure one.

<Tip>
  To use [fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli), pass `model` as an object, for example: `{"id": "claude-opus-5-5", "speed": "fast"}`. Fast mode on Claude Opus 4.8 is deprecated. See the fast mode page’s [supported models](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli#supported-models) for the models that support it on Claude Managed Agents.
</Tip>

<Tip>
  To set the model’s effort level, pass `model` as an object, for example: `{"id": "claude-opus-5-5", "effort": "high"}`. The `effort` field accepts a level string (`low`, `medium`, `high`, `xhigh`, or `max`) or an object such as `{"type": "high"}`. See [Effort levels](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli#effort-levels) for what each level does.
</Tip>

### Pin the inference geo

Like `speed` and `effort`, `inference_geo` is set through the object form of `model`: pass `model` as an object and set `inference_geo` alongside `id`. The field accepts `"us"` or `"global"`. When it’s unset, each model request follows the workspace’s default inference geo at the time it’s served. See [Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency?sdk_languages=cli) for the workspace-level geo controls and pricing.

The following example pins an agent to US inference. The response carries the `inference_geo` value in the agent’s `model` object:

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply geo-pinned-assistant.md
    ```

    <File filename="geo-pinned-assistant.md">
      ```markdown
      ---
      name: Geo-pinned assistant
      model:
        id: claude-opus-5-5
        inference_geo: us
      ---

      You are a helpful assistant.
      ```
    </File>
  </CodeGroupItem>
</CodeGroup>

To change or clear the pin later, update the agent’s `model` object. Supplying `model` without `inference_geo` clears the pin, as described under [Update semantics](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli#update-semantics).

Setting `inference_geo` on a model that doesn’t support it returns a 400 error. See [Model availability](https://platform.claude.com/docs/en/manage-claude/data-residency?sdk_languages=cli#model-availability) for the models that do.

In a `multiagent` configuration, `subagents` and `workflows` each have a `predefined_agents` list. The agent and every agent in those lists must all pin the same geo, or all have no pin. See [Multiagent orchestration](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli).

The API checks an `inference_geo` pin against the workspace’s [`allowed_inference_geos`](https://platform.claude.com/docs/en/manage-claude/data-residency?sdk_languages=cli#workspace-level-restrictions) list. The check runs when you set the pin, when you create a session from the agent, and on every turn of that session. If the list changes and no longer allows the pin, you can’t create new sessions from the agent. Running sessions also refuse further turns. This applies even to a pin that was allowed when you set it, because workspaces rely on these checks for compliance and data residency.

## Update an agent

Updating an agent generates a new version when the configuration changes. The `version` field is optional. Supply the version that you last read, and the update applies only if the agent is still at that version. Otherwise, the request returns a 409 error. Omit `version` to apply the update whatever the agent’s current version. In that case, if two updates set the same field or `metadata` key, the last write wins. The API rejects updates to archived agents.

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply coding-assistant.md
    ```

    <File filename="coding-assistant.md">
      ```markdown
      ---
      name: Coding Assistant
      model: claude-opus-5-5
      tools:
        - type: agent_toolset_20260401
      ---

      You are a helpful coding agent. Always write tests.
      ```
    </File>

    Edit the agent’s file and run `ant apply` again. The command supplies `version` for you.
  </CodeGroupItem>
</CodeGroup>

The preceding example supplies `version`, so the update only applies if the agent is still at that version. To apply an update unconditionally, omit `version` from the request:

<CodeGroup>
  ```bash CLI
  ant beta:agents update \
    --agent-id "$AGENT_ID" \
    --description "Writes and reviews code."
  ```
</CodeGroup>

### Update semantics

* **`version`** is optional and must be at least 1 when supplied. When supplied, it must match the agent’s current version. If it doesn’t, the request returns a 409, even when the fields you send already match the stored values. Reread the agent and retry. When omitted, the update applies unconditionally. If two concurrent updates set the same field or `metadata` key, the later value is kept, with no error to either caller. When too many writes reach the agent at once, a request can fail with a 429 error. Supplying `version` is the recommended default for interactive callers. Omitting it fits declarative apply loops where the loop owns the agent, such as a CI job that syncs checked-in agent definitions.

* **Omitted fields are preserved.** You only need to include the fields you want to change.

* **`model`, `system`, `name`, and `description`** are replaced with the new value. To clear `system` or `description`, pass `null`. Every agent needs a `model` and a `name`, so those two can’t be cleared. When you supply `model`, it replaces the stored object as a whole, so `model` fields that you omit aren’t kept. For example, supplying `model` without `inference_geo` clears the agent’s inference geo pin. The one exception to this rule is `effort`. If the model `id` is unchanged, omitting `effort` leaves the stored effort level unchanged. If you change the model `id`, an omitted `effort` resets to the new model’s default.

* **Array fields** (`tools`, `mcp_servers`, `skills`) are fully replaced by the new array. To clear an array field entirely, pass `null` or an empty array.

* **`multiagent`** updates merge or replace, depending on the type:

  * When the stored block and the update both use the `multiagent_20261001` type, the update is merged into the stored block. A setting that you omit keeps its stored value, both at the top of the block and inside `subagents` or `workflows`. A `predefined_agents` list that you send replaces the stored list. A setting that you send with a new `type`, such as `{"type": "disabled"}`, replaces the stored setting. Fields that it omits take their defaults.
  * If the stored block or the update uses the [`coordinator` type](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#move-from-the-coordinator-type), the update replaces the stored block as a whole. Settings that it omits take their defaults.

  To clear the whole block, pass `"multiagent": null`. To reset one setting to its default, set it to `null` inside the block. For example, setting `workflows` to `null` turns dynamic workflows on, because that is its default. See [Turn on dynamic workflows](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#turn-on-dynamic-workflows).

* **Metadata** is merged at the key level. Keys you provide are added or updated. Keys you omit are preserved. To delete a specific key, set its value to `null`.

* **No-op detection.** If the update produces no change relative to the current version, no new version is created and the existing version is returned.

* **Other agents’ `predefined_agents` lists are not updated.** Updating this agent doesn’t change any agent that lists it in the `predefined_agents` list of `subagents` or `workflows`. A listing agent keeps referencing the same version of this agent. That version is set when the listing agent is created, and again whenever an update to the listing agent includes that list. A reference that omits `version` is set to the latest version at that moment, and it doesn’t follow later versions. To delegate to the new version, [update the agent that lists it](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#list-the-subagents) so that the list references the new version.

The following update clears the description, deletes the `team` key from `metadata`, and sets `workflows` to `null`, which turns dynamic workflows on:

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply code-reviewer.md
    ```

    <File filename="code-reviewer.md">
      ```markdown
      ---
      name: Code Reviewer
      model: claude-opus-5-5
      tools:
        - type: agent_toolset_20260401
      metadata:
        owner: docs
      multiagent:
        type: multiagent_20261001
        workflows: null
      ---

      You are a helpful coding agent.
      ```
    </File>

    The stored agent has a `description` and a `team` key in `metadata`, but the file doesn’t, so `ant apply` sends `null` for them. `multiagent` is different: for a setting missing from inside it, `ant apply` sends nothing, so the API keeps the stored value. To reset `workflows`, the file sets it to `null`.
  </CodeGroupItem>
</CodeGroup>

## Agent lifecycle

| Operation         | Behavior                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **Update**        | Generates a new agent version when the configuration changes.                                       |
| **List versions** | Returns the full version history so you can track changes over time.                                |
| **Archive**       | Makes the agent read-only. New sessions cannot reference it, but existing sessions continue to run. |

### List versions

Fetch the full version history to track how an agent has changed over time. Results are paginated, and the SDK can fetch every page for you.

<CodeGroup>
  ```bash CLI
  ant beta:agents:versions list --agent-id "$AGENT_ID"
  ```
</CodeGroup>

### Archive an agent

Archiving makes the agent read-only and cannot be undone. Existing sessions continue to run, but new sessions cannot reference the agent. The response sets `archived_at` to the archive timestamp.

<CodeGroup>
  ```bash CLI
  ant beta:agents archive --agent-id "$AGENT_ID"
  ```
</CodeGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Tools" icon="tool" href="https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli">
    Configure tools available to your agent.
  </Card>

  <Card title="Skills" icon="graduation-cap" href="https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli">
    Attach reusable, filesystem-based expertise to your agent for domain-specific workflows.
  </Card>

  <Card title="Start a session" icon="play" href="https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli">
    Create a session to start running tasks with your agent.
  </Card>

  <Card title="Reference" icon="book" href="https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli">
    Event types, self-hosted worker CLI flags, supported MCP server types, rate limits, and branding guidelines for Claude Managed Agents.
  </Card>
</CardGroup>

## Availability

Agent configurations are in beta on every model.

### API support

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Available

| Status | Cloud platforms                                                                                                                                                                                                                                                                                                    | Models                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Beta   | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) | [All models](https://platform.claude.com/docs/en/models/overview?sdk_languages=cli) |

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `managed-agents-2026-04-01`

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                                                                                                                                           | HIPAA                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Status  | Not eligible                                                                                                                                                                                                                                                                  | Not eligible                                                        |
| Details | Not eligible for ZDR, except for self-hosted Managed Agents. Sessions are stateful resources; transcripts persist until you delete them. [Learn more](https://platform.claude.com/docs/en/managed-agents/self-hosted-data-and-access?sdk_languages=cli#how-long-data-is-kept) | Not eligible for HIPAA. Applies to all Managed Agents sub-features. |

Applicable endpoints:

* `/v1/agents`
* `/v1/sessions`
* `/v1/environments`
