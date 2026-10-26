---
title: Server tools
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools
description: "Work with tools that Anthropic runs: server_tool_use blocks, pause_turn continuation, mixed server and client tool turns, and domain filtering."
---

Server-executed tools share these mechanics: the `server_tool_use` block, `pause_turn` continuation, turns that mix server and client tools, Zero Data Retention (ZDR) eligibility, and domain filtering. For individual tools, see the [Tool reference](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference?sdk_languages=curl).

## The server\_tool\_use block

The `server_tool_use` block appears in Claude's response when a server-executed tool runs. Its `id` field uses the `srvtoolu_` prefix to distinguish it from client tool calls:

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01A2B3C4D5E6F7G8H9",
  "name": "web_search",
  "input": { "query": "latest quantum computing breakthroughs" }
}
```

The API runs the tool internally. You see the call and its result in the response, but you don't handle execution. Unlike client `tool_use` blocks, you don't need to respond with a `tool_result`. The tool's result block (for example, `web_search_tool_result` for web search) follows the `server_tool_use` block in the same assistant turn, paired by `tool_use_id`. If Claude calls one of your client tools at the same time, the `server_tool_use` block appears without its result, and the response ends with `stop_reason: "tool_use"`. The API runs the tool when you return the client `tool_result` blocks in your next request.

## The server-side loop and pause\_turn

When using server tools such as web search, the API executes tool calls in a server-side agentic loop. On a long-running turn, the API might pause that loop and return a `pause_turn` stop reason.

Here's how to handle the `pause_turn` stop reason:

<CodeGroup>
  ```bash cURL
  # Initial request. If "stop_reason" in the response is "pause_turn", continue
  # the turn by re-sending the request with the assistant content appended to messages.
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"
        }
      ],
      "tools": [{"type": "web_search_20250305", "name": "web_search", "max_uses": 10}]
    }'
  ```
</CodeGroup>

When handling `pause_turn`:

* **Continue the conversation:** Pass the paused response back as-is in a subsequent request to let Claude continue its turn.
* **Preserve tool state:** Include the same tools in the continuation request. A paused turn can end with a `server_tool_use` block whose tool has not run yet, and the API returns a validation error if that tool is missing from the continuation.
* **Repeat as needed:** A continued turn can pause again. Check `stop_reason` on each response and continue until you get a different stop reason, capping the number of continuations as you would any retry loop.

For the other `stop_reason` values and general handling patterns, see [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=curl).

## Mixing server tools and client tools in one turn

Claude can call a server tool and a client tool in the same group of parallel tool calls, for example, `web_fetch` together with a user-defined tool. A client tool is any tool that your code runs and that produces a `tool_use` block, whether it is user-defined or an Anthropic-schema client tool such as the [Bash tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool?sdk_languages=curl). When that occurs, the API does not run the server tool. It returns immediately so that you can run the client tool first:

* `stop_reason` is `"tool_use"`, not `"pause_turn"`.
* `content` contains the `server_tool_use` block and the client `tool_use` block, but no result block for the server tool: that call is not complete.
* There is no other marker. Detect the state by looking for a `server_tool_use` block whose `id` has no matching result block in the response. An `mcp_tool_use` block from the [MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector?sdk_languages=curl) behaves the same way. Server tool calls that already have their result block in the same response are complete and need nothing from you.

<Note>
  With [programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling?sdk_languages=curl), the same response shape means something different. The client `tool_use` block comes from code that is running in the `code_execution` tool rather than from Claude directly, and its `caller` field names the `code_execution` block that called it. That code has already started: it is paused waiting for your `tool_result` blocks, and sending them resumes the execution instead of starting a deferred tool. The `code_execution` block's own result block arrives once the code completes, which can take more than one round of tool results. The follow-up user message itself is the same in both cases; with programmatic tool calling, also pass back the `id` from the response's `container` field, as that page shows.
</Note>

```json
{
  "stop_reason": "tool_use",
  "content": [
    {
      "type": "text",
      "text": "I'll fetch the article and check your system at the same time."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01HxbWnMRmbWyMfUtJKC45rA",
      "name": "web_fetch",
      "input": { "url": "https://example.com/article" }
    },
    {
      "type": "tool_use",
      "id": "toolu_01PjgRJLbXrXEMZwDNYLnBqk",
      "name": "run_command",
      "input": { "command": "uname -a" }
    }
  ]
}
```

To continue the turn, run the client tools and send a user message whose content is only the `tool_result` blocks, one for each `tool_use` block in that response. Keep the same `tools` array: a resume request that no longer defines the waiting server tool fails with a 400 whose message ends ``but no `web_fetch` tool was provided``.

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01PjgRJLbXrXEMZwDNYLnBqk",
      "content": "Linux demo-host 6.8.0-52-generic x86_64 GNU/Linux"
    }
  ]
}
```

The API attaches your results to the still-open assistant turn, runs the deferred server tool (for paused code execution, resumes it), and then lets Claude continue. For a server tool Claude called directly, the next response starts with the result block that answers the previous response's `server_tool_use` `id`, followed by the newly generated content and a fresh `stop_reason`:

```json
{
  "stop_reason": "end_turn",
  "content": [
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01HxbWnMRmbWyMfUtJKC45rA",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          }
        }
      }
    },
    {
      "type": "text",
      "text": "The article argues that... and your machine is running Linux..."
    }
  ]
}
```

A `server_tool_use` block and its result block pair up by `tool_use_id`, not by position: in this flow they arrive in two different responses, and the `server_tool_use` block is not repeated in the second one. On later requests, keep the whole exchange in your `messages` array in order: the first response as an `assistant` message, the `tool_result` user message, and then the next response as another `assistant` message, the same way you accumulate any other tool-use exchange.

<Warning>
  The follow-up user message must contain nothing except `tool_result` blocks. A block added after the results, such as text, tells the API that the assistant turn is over. For a server tool Claude called directly, that leaves the turn with an unresolved server tool call, and the request fails with a 400 `invalid_request_error`:

  ```text wrap
  `web_fetch` tool use with id `srvtoolu_01HxbWnMRmbWyMfUtJKC45rA` was found without a corresponding `web_fetch_tool_result` block
  ```

  A follow-up that puts content before the results, answers only some of the client `tool_use` IDs, or contains no `tool_result` blocks at all fails earlier, with the client tool error described in [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=curl):

  ```text wrap
  `tool_use` ids were found without `tool_result` blocks immediately after: toolu_01PjgRJLbXrXEMZwDNYLnBqk. Each `tool_use` block must have a corresponding `tool_result` block in the next message.
  ```

  To give Claude more input, send it as a separate user message after the turn completes.
</Warning>

**How this differs from `pause_turn`:** A [`pause_turn` response](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools?sdk_languages=curl#the-server-side-loop-and-pause-turn) can also end with a `server_tool_use` block that has not run, but it never leaves a client `tool_use` block waiting on you, so you continue it by re-sending the assistant content as-is. A response that leaves a client `tool_use` block waiting on you never has a `stop_reason` of `pause_turn`: when Claude stops to call your tools, `stop_reason` is `tool_use`, and you continue it by sending the client `tool_result` blocks rather than by re-sending the response. In both cases the API runs the pending server tool at the start of the next request.

The following example enables web fetch together with a user-defined `run_command` tool and handles the mixed response:

<CodeGroup>
  ```bash cURL
  # If "stop_reason" is "tool_use" and a server_tool_use block has no matching
  # result block, that call is not finished. Run the client tools, then POST
  # again with one more user message containing only their tool_result blocks
  # and the same tools array (see the SDK tabs).
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "messages": [
        {
          "role": "user",
          "content": "Summarize https://example.com/article and run uname -a to tell me what system this is on."
        }
      ],
      "tools": [
        {"type": "web_fetch_20250910", "name": "web_fetch", "max_uses": 5},
        {
          "name": "run_command",
          "description": "Run a shell command on this computer and return its output.",
          "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string", "description": "The command to run"}},
            "required": ["command"]
          }
        }
      ]
    }'
  ```
</CodeGroup>

This code is also correct when Claude does not mix the two kinds of call. A turn with only client `tool_use` blocks takes the same continuation path. A turn with only server tool calls needs no client `tool_result` blocks from you, because its result blocks are normally already present. If that turn comes back suspended, for example as a [`pause_turn` response](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools?sdk_languages=curl#the-server-side-loop-and-pause-turn), re-send it as-is instead.

## ZDR and allowed\_callers

The basic versions of web search (`web_search_20250305`) and web fetch (`web_fetch_20250910`) are eligible for [Zero Data Retention (ZDR)](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=curl).

The `_20260209` and later versions with dynamic filtering are **not** ZDR-eligible by default because dynamic filtering relies on code execution internally.

To use a `_20260209` or later server tool with ZDR, disable dynamic filtering by setting `"allowed_callers": ["direct"]` on the tool:

```json
{
  "type": "web_search_20260209",
  "name": "web_search",
  "allowed_callers": ["direct"]
}
```

This restricts the tool to direct calls only, bypassing the internal code execution step.

`allowed_callers` controls how a tool can be called: directly by Claude (`"direct"`), from inside a code execution container (for example, `"code_execution_20260120"`), or both. The `_20260209` versions of the web tools default to the code execution caller only; earlier versions default to `["direct"]`. On models that don't support programmatic tool calling, these versions require `allowed_callers: ["direct"]`; without it the API returns a validation error that says to set it.

<Note>
  Even when web fetch is used in a ZDR-eligible configuration, website publishers might retain any parameters passed to the URL if Claude fetches content from their site.
</Note>

## Domain filtering

Server tools that access the web accept `allowed_domains` and `blocked_domains` parameters to control which domains Claude can reach. Both are fields on the tool object:

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "allowed_domains": ["example.com", "docs.python.org"]
}
```

When using domain filters:

* Domains should not include the HTTP/HTTPS scheme (use `example.com` instead of `https://example.com`).
* Subdomains are automatically included (`example.com` covers `docs.example.com`).
* Specific subdomains restrict results to only that subdomain (`docs.example.com` returns only results from that subdomain, not from `example.com` or `api.example.com`).
* Subpaths are supported for web search and match anything after the path (`example.com/blog` matches `example.com/blog/post-1`).
* Web fetch matches on the domain only: an entry that includes a path never matches a web fetch URL.
* You can use either `allowed_domains` or `blocked_domains`, but not both in the same request.

**Wildcard support:**

* Wildcards (`*`) are not allowed in the domain itself, only in the path after it.
* Valid: `example.com/*`, `example.com/*/articles`
* Invalid: `*.example.com`, `ex*.com`

Invalid domain formats are rejected at request time with a 400 `invalid_request_error`.

<Note>
  Request-level domain restrictions work together with any organization-level domain restrictions configured in the Claude Console. Request-level `allowed_domains` must be a subset of the organization-level allowed list; entries outside it cause the API to return a validation error. A request-level allowed list that includes a domain your organization blocks is rejected with a `400` error that names the conflicting entries.
</Note>

<Warning>
  Unicode characters in domain names can bypass domain filters through homograph attacks: `аmazon.com` (with a Cyrillic `а`) looks identical to `amazon.com` but is a different domain. Use ASCII-only domain names in allow and block lists, and audit existing entries for non-ASCII characters.
</Warning>

For domain lists and your organization's settings in Claude Managed Agents sessions, see [Restrict web search and web fetch domains](https://platform.claude.com/docs/en/managed-agents/tools-web-restrictions?sdk_languages=curl).

## Dynamic filtering with code execution

The `_20260209` and later versions of web search and web fetch use code execution internally to apply dynamic filters against search results.

<Note>
  You don't need to add a `code_execution` tool for these versions: when dynamic filtering runs, the API provisions code execution for the request automatically, and both tools share a single execution container. If you do include one, use `code_execution_20260120` or later; the API rejects older code execution versions alongside these web tool versions.
</Note>

## Streaming server-tool events

Server-tool events stream as part of the normal server-sent events (SSE) flow. A `server_tool_use` block that Claude calls directly streams like a client `tool_use` block: a `content_block_start` event followed by `input_json_delta` events. The result block arrives complete in a single `content_block_start` event, with no deltas.

See [Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl) for the full event reference. Individual tool pages document tool-specific event names where they differ.

## Batch requests

All server tools support batch processing. In a batch, the agentic loop runs just as it does for synchronous requests, with a higher per-turn iteration limit. If the loop reaches that limit, the response ends with `stop_reason: "pause_turn"`; you can continue it by submitting a follow-up request with the returned content. See [Server tools and the agentic loop](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=curl#server-tools-and-the-agentic-loop) for details.

Common batch workloads include enriching a dataset with information from the web, checking a large set of documents against current sources, and running analysis code over many files.

## Next steps

<CardGroup cols={2}>
  <Card title="Troubleshooting tool use" icon="wrench" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use?sdk_languages=curl">
    Fix the most common tool-use errors with symptom-to-fix diagnostic tables.
  </Card>

  <Card title="Web search tool" icon="magnifying-glass" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool?sdk_languages=curl">
    Search the web and cite results.
  </Card>

  <Card title="Web fetch tool" icon="download" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool?sdk_languages=curl">
    Fetch and read content from specific URLs to augment Claude's context with live web content.
  </Card>

  <Card title="Code execution tool" icon="terminal" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=curl">
    Run Python and Bash code in a sandboxed container to analyze data, generate files, and iterate on solutions.
  </Card>

  <Card title="Tool search tool" icon="compass" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool?sdk_languages=curl">
    Discover and load tools on demand.
  </Card>
</CardGroup>
