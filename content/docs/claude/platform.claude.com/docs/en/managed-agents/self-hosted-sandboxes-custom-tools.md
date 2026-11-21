---
title: Custom tools in self-hosted sandboxes
url: https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-custom-tools
description: Serve custom tools from a self-hosted sandbox worker, and wrap an MCP server inside your network as custom tools without running a tunnel.
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
---

[Custom tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli#custom-tools) are tools your own code runs: the agent emits an `agent.custom_tool_use` event and waits for a matching `user.custom_tool_result`. Your worker can be that code. Because it runs inside your sandbox, the tool reaches the internal services, credentials, and network egress you configured for the sandbox, and nothing more.

The environment key authorizes posting custom tool results, so your Claude API key stays off the worker host.

<Note>
  To serve custom tools, you need the SDK worker. The `ant` CLI worker has no way to register a custom tool implementation. In the sandbox-per-session pattern, [run the SDK worker inside the sandbox](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-per-session?sdk_languages=cli#run-the-sdk-worker-inside-the-sandbox).
</Note>

## Serve a custom tool

<Steps>
  <Step title="Declare the tool on the agent">
    Add a `custom` entry to the agent’s `tools` whose `name` matches the tool your worker registers. See [Custom tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli#custom-tools) for the full declaration shape.

    ```json
    {
      "type": "custom",
      "name": "get_order_status",
      "description": "Look up an order in the internal fulfillment system by order ID.",
      "input_schema": {
        "type": "object",
        "properties": {
          "order_id": { "type": "string", "description": "The order ID" }
        },
        "required": ["order_id"]
      }
    }
    ```
  </Step>

  <Step title="Register the implementation with the worker">
    This step uses [`EnvironmentWorker`](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-reference?sdk_languages=cli#environment-worker), which only the Python, TypeScript, and Go SDKs have. Pass the tool alongside the built-in toolset through the worker’s `tools` factory. The samples use `/workspace` as the working directory, which must exist before the worker starts. [Run an always-on worker](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-workers?sdk_languages=cli#run-an-always-on-worker) says how to create the directory and what to use on macOS.

    <CodeGroup exclude="shell, csharp, java, php, ruby">
      <CodeGroupItem language="CLI">
        The `ant` CLI worker can’t serve custom tools. Use `EnvironmentWorker` in the Python, TypeScript, or Go SDK.
      </CodeGroupItem>
    </CodeGroup>
  </Step>
</Steps>

The worker answers only the tools registered with it. If you declare a tool on the agent but no worker or client serves it, the session pauses with a `requires_action` stop reason. It stays paused until something posts the result. See [Answer tool calls that pause the session](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#answer-tool-calls-that-pause-the-session) for the event flow.

## Wrap an MCP server as custom tools

The [MCP connector](https://platform.claude.com/docs/en/managed-agents/mcp-connector?sdk_languages=cli) connects to MCP servers from Anthropic’s side. A server must therefore expose an HTTP endpoint that Anthropic can reach, directly or through an [MCP tunnel](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview?sdk_languages=cli).

To use a server that only your network can reach, make the worker the MCP client instead and declare the server’s tools as custom tools. The MCP server needs no inbound connectivity from outside your network. Anthropic receives the tool definitions you declare on the agent, each call’s input, and the result your worker posts back.

At runtime the model calls a wrapped tool like any other custom tool:

1. The agent emits an `agent.custom_tool_use` event.
2. The worker, inside your sandbox, forwards the call over its open MCP session to the server on your network.
3. The worker posts the server’s response as the `user.custom_tool_result`.

### Install an MCP SDK

The SDK’s [Client-side MCP helpers](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector?sdk_languages=cli#client-side-mcp-helpers) convert the server’s tools into the runnable tools the worker accepts. Install an MCP SDK alongside the Anthropic SDK: `pip install "anthropic[mcp]" "mcp>=1.24"`.

The examples connect without authentication. To send credentials, configure the `http_client` you hand to the MCP transport.

### Declare and serve the tools

<Steps>
  <Step title="Declare the server’s tools on the agent">
    List the MCP server’s tools and declare each one as a `custom` tool. The MCP `name`, `description`, and `inputSchema` map one to one onto the custom tool’s fields. If the server paginates its tool list, declare every page; the worker must list the same pages.

    <CodeGroup exclude="shell">
      <CodeGroupItem language="CLI">
        Listing an MCP server’s tools and declaring each one needs more logic than a single shell command. Use an MCP SDK and the Anthropic SDK to run it.
      </CodeGroupItem>
    </CodeGroup>
  </Step>

  <Step title="Serve the tools from the worker">
    This step uses `EnvironmentWorker`, which only the Python, TypeScript, and Go SDKs have. Connect to the same MCP server at startup. Convert its tools with `async_mcp_tool()`, and register them alongside `beta_agent_toolset_20260401()`. Keep one MCP session open for the life of the worker.

    The samples use `/workspace` as the working directory, which must exist before the worker starts. [Run an always-on worker](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-workers?sdk_languages=cli#run-an-always-on-worker) says how to create the directory and what to use on macOS.

    <CodeGroup exclude="shell, csharp, java, php, ruby">
      <CodeGroupItem language="CLI">
        The `ant` CLI worker can’t serve custom tools. Use `EnvironmentWorker` in the Python, TypeScript, or Go SDK.
      </CodeGroupItem>
    </CodeGroup>
  </Step>
</Steps>

## Limits and behavior

### Tools are declared, not discovered at runtime

The worker lists the MCP server’s tools once at startup and cannot add tools to a running session. When the server’s tools change:

1. Declare them again, on the agent or on an idle session through [Updating the agent configuration](https://platform.claude.com/docs/en/managed-agents/session-operations?sdk_languages=cli#updating-the-agent-configuration).
2. Restart the worker.

### Declarations must fit the Managed Agents API

The MCP helpers keep the server’s names and descriptions, and most schemas pass through unchanged. Rename, trim, or inline where a declaration breaks one of these rules:

| Field | Rule |
| ----- | ----- |
| `name` | Unique within the agent. Letters, digits, underscores, and hyphens, 1–128 characters. Cannot match a built-in agent tool such as `bash` or `read`, or use the reserved `mcp__` or `ant__` prefix. |
| `description` | Required and non-empty. |
| `input_schema` | Accepts the JSON Schema keywords MCP servers commonly emit, such as `additionalProperties` and `title`. Rejects reference keywords such as `$ref` anywhere, and top-level `oneOf`, `anyOf`, and `allOf`. Property names use letters, digits, underscores, dots, and hyphens, 1–64 characters. |
| The agent’s `tools` array | At most 256 entries. Each wrapped tool is one entry, and the built-in toolset is one more. |

Two cases need extra work:

* **Two servers expose the same tool name:** Define the wrapper yourself under a prefixed name and have it call the server’s original tool name.
* **A generator such as Pydantic factors schemas into `$defs`:** Inline those schemas before you declare the tool.

### Tool failures surface as error tool results

When the MCP server reports a tool error, the worker posts an error tool result the model can react to. MCP content with no tool result equivalent, such as audio blocks and resource links, also surfaces as an error.

Set a timeout on the MCP client for a faster and clearer failure. See [A wrapped MCP tool call hangs](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-operations?sdk_languages=cli#a-wrapped-mcp-tool-call-hangs) for what occurs without one.

### Wrap only servers you operate or trust

A wrapped tool’s name, description, and results enter the model’s context like any other tool’s. They are untrusted input that can influence what the agent does with its other tools, including `bash` on the worker host. Declare only the tools you intend the agent to use.

### Permission policies do not apply

[Permission policies](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli#custom-tools) govern the built-in and MCP toolsets. The worker runs every wrapped tool call the model makes, so put any approval step in your own tool code.
