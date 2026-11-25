---
title: Migration
url: https://platform.claude.com/docs/en/managed-agents/migration
description: Move an existing agent built on the Messages API or the Claude Agent SDK to Claude Managed Agents.
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

Claude Managed Agents replaces your hand-written agent loop with managed infrastructure. This page covers what changes when you migrate from a custom loop built on the [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli) or from the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview).

## From a Messages API agent loop

If you built an agent by calling `ant messages create` (cli: `ant messages create`) in a loop, running tool calls yourself, and appending results to the conversation history, Claude Managed Agents replaces most of that loop code.

### What you stop managing

| Before | After |
| ----- | ----- |
| You maintain the conversation history array and pass it back on every turn. | The session stores history server-side. You send events and receive events. |
| You iterate `tool_use` content blocks, run each tool, and loop back with `tool_result` messages. | Built-in tools run inside the sandbox automatically. You only handle custom tools through `agent.custom_tool_use` events. |
| You provision your own sandbox for running agent-generated code. | The session sandbox handles code execution, file operations, and bash. |
| You decide when the loop is done. | The session emits `session.status_idle` when the agent has nothing more to do. |

### Code comparison

**Before** (Messages API loop, simplified):

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This loop needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

**After** (Claude Managed Agents):

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

### What you control

* **System prompt and model:** Same fields, on the agent definition.
* **Custom tools:** Declared with JSON Schema. Your client runs them when `agent.custom_tool_use` events arrive, not inside a request loop. See [Session event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli).
* **Web search and web fetch settings:** Same `allowed_domains`, `blocked_domains`, `max_content_tokens`, and `user_location` fields, set once on the `web_search` and `web_fetch` entries of the agent toolset’s `configs` array instead of on every request. The `max_uses`, `citations`, and `cache_control` fields are not available. See [Differences from the Messages API tools](https://platform.claude.com/docs/en/managed-agents/tools-web-restrictions?sdk_languages=cli#differences-from-the-messages-api-tools).
* **Context:** You can inject context through the system prompt, [file resources](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli), or [skills](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli).

## From the Claude Agent SDK

If you built with the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview), you’re already working with agents, tools, and sessions as concepts. The difference is where they run: the SDK runs in a process you operate, whereas Managed Agents runs in Anthropic’s infrastructure. Most of the migration is mapping SDK configuration objects to their API-side equivalents.

### What changes

| Agent SDK | Managed Agents |
| ----- | ----- |
| `ClaudeAgentOptions(...)` constructed for each run | `ant beta:agents create` (cli: `ant beta:agents create`) once. The server persists and versions the agent. See [Define your agent](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli). |
| `async with ClaudeSDKClient(...)` or `query(...)` | `ant beta:sessions create` (cli: `ant beta:sessions create`) then send and receive [events](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli). |
| Functions defined with `@tool`, dispatched automatically by the SDK | Declare as `{"type": "custom", ...}` on the agent; your client handles `agent.custom_tool_use` events and replies with `user.custom_tool_result`. See [Tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli). |
| Built-in tools run in your process against your filesystem | `{"type": "agent_toolset_20260401"}` runs the same tools inside the session sandbox against `/workspace`. |
| `cwd`, `add_dirs` point at local paths | Upload or mount [files](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli) as session resources. |
| `system_prompt` and the `CLAUDE.md` hierarchy | A single `system` string on the agent. Each update that changes the agent produces a new server-side version; pin sessions to a specific version to promote or roll back without a deploy. See [Define your agent](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli). |
| `mcp_servers` configured and authenticated in one place | Declare servers on the agent; provide credentials through a [vault](https://platform.claude.com/docs/en/managed-agents/vaults?sdk_languages=cli) on the session. |
| `permission_mode`, `can_use_tool` | Per-tool [`permission_policy`](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli) (`always_allow`, `always_ask`, or `auto`). Send `user.tool_confirmation` events for calls that pause for your approval. |

### Code comparison

**Before** (Agent SDK):

<CodeGroup exclude="shell, csharp, go, java, php, ruby">
  ```python Python
  from claude_agent_sdk import (
      ClaudeAgentOptions,
      ClaudeSDKClient,
      create_sdk_mcp_server,
      tool,
  )


  @tool("get_weather", "Get the current weather for a city.", {"city": str})
  async def get_weather(args: dict) -> dict:
      return {"content": [{"type": "text", "text": f"{args['city']}: 18°C, clear"}]}


  options = ClaudeAgentOptions(
      model="claude-opus-5-5",
      system_prompt="You are a concise weather assistant.",
      mcp_servers={
          "weather": create_sdk_mcp_server("weather", "1.0", tools=[get_weather])
      },
  )

  async with ClaudeSDKClient(options=options) as agent:
      await agent.query("What's the weather in Tokyo?")
      async for msg in agent.receive_response():
          print(msg)
  ```

  ```typescript TypeScript
  import { createSdkMcpServer, query, tool } from "@anthropic-ai/claude-agent-sdk";
  import { z } from "zod";

  const getWeather = tool(
    "get_weather",
    "Get the current weather for a city.",
    { city: z.string() },
    async (args) => ({
      content: [{ type: "text", text: `${args.city}: 18°C, clear` }]
    })
  );

  for await (const message of query({
    prompt: "What's the weather in Tokyo?",
    options: {
      model: "claude-opus-5-5",
      systemPrompt: "You are a concise weather assistant.",
      mcpServers: {
        weather: createSdkMcpServer({ name: "weather", version: "1.0", tools: [getWeather] })
      }
    }
  })) {
    console.log(message);
  }
  ```
</CodeGroup>

**After** (Managed Agents):

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This loop needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

You create the agent and environment once and reuse them across sessions. The tool function still runs in your process. The difference is that you read the `agent.custom_tool_use` event and send the result explicitly instead of the Agent SDK dispatching it for you.

### Features that move to your client

The tradeoff for Anthropic running the agent loop is that a few things the SDK handled automatically become your client’s responsibility.

| SDK feature | Managed Agents approach |
| ----- | ----- |
| Plan mode | Run a planning-only session first, then a second session to run the plan. |
| Output styles, slash commands | Apply in your client before sending `user.message` or after receiving `agent.message`. |
| `PreToolUse` / `PostToolUse` hooks | Your client already sees every `agent.custom_tool_use` event before responding; put the logic there. For built-in tools, use `permission_policy: always_ask` to review every call. [`auto`](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli#let-the-server-evaluate-each-call-with-auto) lets the server evaluate each call instead, but if the server evaluates a call as safe, it runs without reaching your client. |
| `max_turns` | Count turns client-side. |

## Migration checklist

1. [Create an environment](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli) with the networking and runtimes your agent needs.
2. Port your system prompt and tool selection to an [agent definition](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli).
3. Replace your loop: [create a session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) with `ant beta:sessions create` (cli: `ant beta:sessions create`) and [stream its events](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli) with `ant beta:sessions:events stream` (cli: `ant beta:sessions:events stream`).
4. For any local files the agent reads, upload them through the [Files API](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli) and mount them as `resources`.
5. For any custom tool handlers, run them in your event loop as responses to `agent.custom_tool_use` events.
6. Run a test session before you point production traffic at the migrated flow.

## Migrating between model versions

When a new Claude model is released, migrating a Claude Managed Agents integration is typically a one-field change: update `model` on your [agent definition](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli), and the change takes effect on the next session you create.

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply agent.md
    ```

    <File filename="agent.md">
      ```markdown
      ---
      name: Task Runner
      model: claude-opus-5-5
      tools:
        - type: agent_toolset_20260401
      ---

      You are a task automation agent. Complete the task you are given end to end.
      ```
    </File>
  </CodeGroupItem>
</CodeGroup>

Most model-level behavior changes documented in the [Migration guides](https://platform.claude.com/docs/en/about-claude/models/migration-guide?sdk_languages=cli) do not require action on your side:

* **Request parameter changes** (`max_tokens` defaults, `thinking` configuration) need no action: the Claude Managed Agents runtime handles them. The agent definition does not expose these fields.
* **Assistant message prefilling** does not exist in the event-based session model, so moving to a model that rejects prefill needs no change from you.
* **Tool argument JSON escaping** needs no action: the runtime parses the arguments before you receive `agent.custom_tool_use` events. You see structured data, not raw strings.

The behavior descriptions in those guides (what the model does differently) still apply. The migration steps (how to change your request code) do not.

### When a model is retired

Claude Managed Agents doesn’t move your agents to a newer model. Make the following changes before the retirement date on [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli).

| What uses the model | After the model is retired | What to do |
| ----- | ----- | ----- |
| An agent, as its model or its [advisor model](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#give-the-session-an-advisor) | Creating a session with that agent version returns a 400 error. | Update the agent, and [resend the model settings](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli#update-semantics) that you want to keep. If you pin a version when you create sessions, pin the new one. |
| An agent that another agent lists | Creating a session with the agent that lists it returns a 400 error. | Update the listed agent. Then, update the agent that lists it so that [its list references the new version](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli#list-the-subagents). |
| An existing session, as its agent’s model | Each new turn fails with a `session.error` event of type `model_request_failed_error`. | Create a new session with the updated agent. An existing session [can’t change its model](https://platform.claude.com/docs/en/managed-agents/session-operations?sdk_languages=cli#updating-the-agent-configuration). |
| A scheduled deployment | The next scheduled run fails, and the deployment stops starting sessions. | [Move the deployment](https://platform.claude.com/docs/en/managed-agents/scheduled-deployments?sdk_languages=cli#failure-behavior) to the new agent version. |

A request that sets a retired model on an agent or in a [session override](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#override-agent-configuration-for-a-session) also returns a 400 error. An override with a supported model replaces the agent’s retired model for that session.
