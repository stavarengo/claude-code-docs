---
title: Context editing
url: https://platform.claude.com/docs/en/build-with-claude/context-editing
description: Automatically manage conversation context as it grows with context editing.
featureMetadata:
  status: beta
  betaHeader: context-management-2025-06-27
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements). Context edits (tool use clearing and thinking clearing) are applied in real time.
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
    Amazon Bedrock: beta
    Amazon Bedrock (InvokeModel): beta
    Claude Models on Google Cloud (Google managed): beta
    Microsoft Foundry: beta
---

## Overview

<Note>
  For most use cases, [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) is the primary strategy for managing context in long-running conversations. The strategies on this page are useful for specific scenarios where you need more fine-grained control over what content is cleared.
</Note>

Context editing allows you to selectively clear specific content from conversation history as it grows. Beyond optimizing costs and staying within limits, this is about actively curating what Claude receives: context is a finite resource with diminishing returns, and irrelevant content degrades model focus. Context editing gives you fine-grained runtime control over that curation. For the broader principles behind context management, see [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). This page covers:

* **Tool result clearing:** Best for agentic workflows with heavy tool use where old tool results are no longer needed
* **Thinking block clearing:** For managing thinking blocks from earlier turns, with options to preserve recent thinking for context continuity
* **Client-side SDK compaction:** An SDK-based alternative for summary-based context management (server-side compaction is generally preferred)

| Approach        | Where it runs | Strategies                                                                                                 | How it works                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server-side** | API           | Tool result clearing (`clear_tool_uses_20250919`)<br />Thinking block clearing (`clear_thinking_20251015`) | Applied before the prompt reaches Claude. Clears specific content from conversation history. Each strategy can be configured independently.                                                                                                                                                                                                                                                                                                                       |
| **Client-side** | SDK           | Compaction                                                                                                 | Available in [TypeScript and Ruby SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) when using [`tool_runner`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner?sdk_languages=cli). Generates a summary and replaces full conversation history. See [Client-side compaction](https://platform.claude.com/docs/en/build-with-claude/context-editing?sdk_languages=cli#client-side-compaction-sdk). |

## Server-side strategies

<Note>
  Context editing is in beta with support for tool result clearing and thinking block clearing. To enable it, use the beta header `context-management-2025-06-27` in your API requests.

  Share feedback on this feature through the [feedback form](https://forms.gle/YXC2EKGMhjN1c4L88).
</Note>

### Tool result clearing

The `clear_tool_uses_20250919` strategy clears tool results when conversation context grows beyond your configured threshold. This is particularly useful for agentic workflows with heavy tool use. Older tool results (such as file contents or search results) are no longer needed once Claude has processed them.

When activated, the API automatically clears the oldest tool results in chronological order. The API replaces each cleared result with placeholder text indicating to Claude that it was removed. By default, only tool results are cleared. You can optionally clear both tool results and tool calls (the tool use parameters) by setting `clear_tool_inputs` to true.

### Thinking block clearing

The `clear_thinking_20251015` strategy manages `thinking` blocks from earlier assistant turns. This strategy gives you control over thinking preservation: you can choose to keep more thinking blocks to maintain reasoning continuity, or clear them more aggressively to save context space.

<Tip>
  **Default behavior:** The default varies by model class.

  | Model class      | Keep all prior thinking     | Keep only the last turn’s thinking         |
  | ---------------- | --------------------------- | ------------------------------------------ |
  | Opus             | Claude Opus 4.5 and later   | Claude Opus 4.1 and earlier                |
  | Sonnet           | Claude Sonnet 4.6 and later | Claude Sonnet 4.5 (deprecated) and earlier |
  | Haiku            | Claude Haiku 5.5 and later  | Claude Haiku 4.5 and earlier               |
  | Fable and Mythos | All models                  | (none)                                     |

  Use this strategy to override the default. If your code runs across multiple model tiers, set `keep` explicitly rather than relying on the per-model default.
</Tip>

An assistant conversation turn might include multiple content blocks (for example, when using tools) and multiple thinking blocks (for example, with [interleaved thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#interleaved-thinking)).

### Context editing occurs server-side

Context editing is applied server-side before the prompt reaches Claude. Your client application maintains the full, unmodified conversation history. You do not need to sync your client state with the edited version. Continue managing your full conversation history locally as you normally would.

On Claude Fable 5.1, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5, server-side context management never invalidates thinking blocks. Client-side edits to earlier turns can invalidate the thinking blocks in every later assistant turn. For new accounts created on or after August 31, 2026, a request that replays an invalidated block is rejected unless you opt into dropping it. See [Keeping the prefix unchanged](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#prefix-check).

### Context editing and prompt caching

Context editing’s interaction with [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) varies by strategy:

* **Tool result clearing:** Invalidates cached prompt prefixes when content is cleared. To account for this, clear enough tokens to make the cache invalidation worthwhile. Use the `clear_at_least` parameter to ensure a minimum number of tokens is cleared each time. You’ll incur cache write costs each time content is cleared, but subsequent requests can reuse the newly cached prefix.

* **Thinking block clearing:** When thinking blocks are **kept** in context (not cleared), the prompt cache is preserved, allowing cache hits and reducing input token costs. When thinking blocks are **cleared**, the cache is invalidated at the point where clearing occurs. Configure the `keep` parameter based on whether you want to prioritize cache performance or context window availability.

## Supported models

Context editing is available on all supported Claude models.

## Tool result clearing usage

The simplest way to enable tool result clearing is to specify only the strategy type. All other [configuration options](https://platform.claude.com/docs/en/build-with-claude/context-editing?sdk_languages=cli#configuration-options-for-tool-result-clearing) use their default values:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Search for recent developments in AI
  tools:
    - type: web_search_20250305
      name: web_search
  context_management:
    edits:
      - type: clear_tool_uses_20250919
  YAML
  ```
</CodeGroup>

### Advanced configuration

You can customize the tool result clearing behavior with additional parameters:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Create a simple command line calculator app using Python
  tools:
    - type: text_editor_20250728
      name: str_replace_based_edit_tool
      max_characters: 10000
    - type: web_search_20250305
      name: web_search
      max_uses: 3
  context_management:
    edits:
      - type: clear_tool_uses_20250919
        trigger:
          type: input_tokens
          value: 30000
        keep:
          type: tool_uses
          value: 3
        clear_at_least:
          type: input_tokens
          value: 5000
        exclude_tools:
          - web_search
  YAML
  ```
</CodeGroup>

## Thinking block clearing usage

Use thinking block clearing to manage context and prompt caching in conversations that carry thinking blocks from earlier turns:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  messages:
    - role: user
      content: Hello
  context_management:
    edits:
      - type: clear_thinking_20251015
        keep:
          type: thinking_turns
          value: 2
  YAML
  ```
</CodeGroup>

### Configuration options for thinking block clearing

The `clear_thinking_20251015` strategy supports the following configuration:

| Configuration option | Default        | Description                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keep`               | Model-specific | Defines how many recent assistant turns with thinking blocks to preserve. Use `{type: "thinking_turns", value: N}` where N must be > 0 to keep the last N turns, or `"all"` to keep all thinking blocks. Opus 4.5+, Sonnet 4.6+, and Haiku 5.5+: all turns. Fable and Mythos models: all turns. Earlier Opus/Sonnet and Haiku through Claude Haiku 4.5: last turn only. |

**Example configurations:**

Keep thinking blocks from the last 3 assistant turns:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  messages:
    - role: user
      content: Hello
  context_management:
    edits:
      - type: clear_thinking_20251015
        keep:
          type: thinking_turns
          value: 3
  YAML
  ```
</CodeGroup>

Keep all thinking blocks (maximizes cache hits):

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  messages:
    - role: user
      content: Hello
  context_management:
    edits:
      - type: clear_thinking_20251015
        keep: all
  YAML
  ```
</CodeGroup>

### Combining strategies

You can use both thinking block clearing and tool result clearing together:

<Note>
  When using multiple strategies, you must list the `clear_thinking_20251015` strategy first in the `edits` array.
</Note>

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  messages:
    - role: user
      content: Search for the latest developments in quantum error correction and summarize the key breakthroughs.
  tools:
    - type: web_search_20250305
      name: web_search
      max_uses: 5
  context_management:
    edits:
      - type: clear_thinking_20251015
        keep:
          type: thinking_turns
          value: 2
      - type: clear_tool_uses_20250919
        trigger:
          type: input_tokens
          value: 50000
        keep:
          type: tool_uses
          value: 5
  YAML
  ```
</CodeGroup>

## Configuration options for tool result clearing

| Configuration option | Default              | Description                                                                                                                                                                                                                                           |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger`            | 100,000 input tokens | Defines when the context editing strategy activates. Once the prompt exceeds this threshold, clearing starts. You can specify this value in either `input_tokens` or `tool_uses`.                                                                     |
| `keep`               | 3 tool uses          | Defines how many recent tool use/result pairs to keep after clearing occurs. The API removes the oldest tool interactions first, preserving the most recent ones.                                                                                     |
| `clear_at_least`     | None                 | Ensures a minimum number of tokens is cleared each time the strategy activates. If the API can’t clear at least the specified amount, the strategy will not be applied. This helps determine if context clearing is worth breaking your prompt cache. |
| `exclude_tools`      | None                 | List of tool names whose tool uses and results should never be cleared. Useful for preserving important context.                                                                                                                                      |
| `clear_tool_inputs`  | `false`              | Controls whether the tool call parameters are cleared along with the tool results. By default, only the tool results are cleared while keeping Claude’s original tool calls visible.                                                                  |

## Context editing response

You can see which context edits were applied to your request using the `context_management` response field, along with helpful statistics about the content and input tokens cleared.

```json Output
{
  "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message",
  "role": "assistant",
  "content": [
    // ...
  ],
  "usage": {
    // ...
  },
  "context_management": {
    "applied_edits": [
      // When using `clear_thinking_20251015`
      {
        "type": "clear_thinking_20251015",
        "cleared_thinking_turns": 3,
        "cleared_input_tokens": 15000
      },
      // When using `clear_tool_uses_20250919`
      {
        "type": "clear_tool_uses_20250919",
        "cleared_tool_uses": 8,
        "cleared_input_tokens": 50000
      }
    ]
  }
}
```

For streaming responses, the context edits are included in the final `message_delta` event:

```json Streaming Response
{
  "type": "message_delta",
  "delta": {
    "stop_reason": "end_turn",
    "stop_sequence": null
  },
  "usage": {
    "output_tokens": 1024
  },
  "context_management": {
    "applied_edits": [
      // ...
    ]
  }
}
```

## Token counting

The [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli) endpoint supports context management, allowing you to preview how many tokens your prompt will use after context editing is applied.

<CodeGroup>
  ```bash CLI
  ant beta:messages count-tokens --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  messages:
    - role: user
      content: Continue our conversation...
  context_management:
    edits:
      - type: clear_tool_uses_20250919
        trigger:
          type: input_tokens
          value: 30000
        keep:
          type: tool_uses
          value: 5
  YAML
  ```
</CodeGroup>

```json Output
{
  "input_tokens": 25000,
  "context_management": {
    "original_input_tokens": 70000
  }
}
```

The response shows both the final token count after context management is applied (`input_tokens`) and the original token count before any clearing occurred (`original_input_tokens`).

## Using with the memory tool

Context editing can be combined with the [memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool?sdk_languages=cli). When your conversation context approaches the configured clearing threshold, Claude receives an automatic warning to preserve important information. This allows Claude to save tool results or context to its memory files before they’re cleared from the conversation history.

This combination allows you to:

* **Preserve important context:** Claude can write essential information from tool results to memory files before those results are cleared.
* **Maintain long-running workflows:** Claude can continue agentic workflows that would otherwise exceed context limits by offloading information to persistent storage.
* **Access information on demand:** Claude can look up previously cleared information from memory files when needed, rather than keeping everything in the active context window.

For example, in a file editing workflow where Claude performs many operations, Claude can summarize completed changes to memory files as the context grows. When tool results are cleared, Claude retains access to that information through its memory system and can continue working effectively.

To use both features together, enable them in your API request:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Hello
  tools:
    - type: memory_20250818
      name: memory
  context_management:
    edits:
      - type: clear_tool_uses_20250919
  YAML
  ```
</CodeGroup>

For the full memory tool reference including commands and examples, see [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool?sdk_languages=cli).

## Client-side compaction (SDK)

<Warning>
  **Anthropic recommends server-side compaction over SDK compaction.** [Server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) handles context management automatically with less integration complexity, better token usage calculation, and no client-side limitations. Use SDK compaction only if you specifically need client-side control over the summarization process.

  The `compaction_control` parameter is deprecated in the TypeScript and Ruby SDKs and will be removed in a future version. The TypeScript and Ruby SDKs emit a deprecation warning when it is enabled. The Python SDK removed it in v1.0. To use server-side compaction with a tool runner, pass the `compact_20260112` edit in the request’s `context_management` parameter.
</Warning>

<Note>
  Compaction is available in the [TypeScript and Ruby SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) when using the [`tool_runner` method](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner?sdk_languages=cli).
</Note>

Compaction is an SDK feature that automatically manages conversation context by generating summaries when token usage grows too large. Unlike server-side context editing strategies that clear content, compaction instructs Claude to summarize the conversation history, then replaces the full history with that summary. This allows Claude to continue working on long-running tasks that would otherwise exceed the [context window](https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli).

### How compaction works

When compaction is enabled, the SDK monitors token usage after each model response:

1. **Threshold check:** The SDK calculates total tokens as `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens` (see [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) for the cache token fields).
2. **Summary generation:** When the threshold is exceeded, a summary prompt is injected as a user turn, and Claude generates a structured summary wrapped in `<summary></summary>` tags.
3. **Context replacement:** The SDK extracts the summary and replaces the entire message history with it.
4. **Continuation:** The conversation resumes from the summary, with Claude continuing from where it stopped.

### Using compaction

Add `compaction_control` to your `tool_runner` call to enable automatic summarization when token usage exceeds the threshold.

<Tabs>
  <Tab title="CLI">
    <Note>
      The CLI does not include a `tool_runner` helper. Use [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) instead, which handles compaction on Anthropic’s servers without SDK-side integration.
    </Note>
  </Tab>
</Tabs>

#### What occurs during compaction

As the conversation grows, the message history accumulates:

**Before compaction (approaching 100k tokens):**

```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  {
    "role": "user",
    "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }]
  },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  {
    "role": "user",
    "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }]
  },
  { "role": "assistant", "content": "After analyzing file2.txt..." }
  // ... 50 more exchanges like this ...
]
```

When tokens exceed the threshold, the SDK injects a summary request and Claude generates a summary. The entire history is then replaced:

**After compaction (back to \~2–3k tokens):**

```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continues working from this summary as if it were the original conversation history.

### Configuration options

| Parameter                 | Type    | Required | Default                                                                                                                                      | Description                              |
| ------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `enabled`                 | boolean | Yes      | -                                                                                                                                            | Whether to enable automatic compaction   |
| `context_token_threshold` | number  | No       | 100,000                                                                                                                                      | Token count at which compaction triggers |
| `model`                   | string  | No       | Same as main model                                                                                                                           | Model to use for generating summaries    |
| `summary_prompt`          | string  | No       | See [Default summary prompt](https://platform.claude.com/docs/en/build-with-claude/context-editing?sdk_languages=cli#default-summary-prompt) | Custom prompt for summary generation     |

#### Choosing a token threshold

The threshold determines when compaction occurs. A lower threshold means more frequent compactions with smaller context windows. A higher threshold allows more context but risks hitting limits.

<Tabs>
  <Tab title="CLI">
    <Note>
      The CLI does not include a `tool_runner` helper. Use [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) instead, which handles compaction on Anthropic’s servers without SDK-side integration.
    </Note>
  </Tab>
</Tabs>

#### Using a different model for summaries

You can use a faster or cheaper model for generating summaries:

<Tabs>
  <Tab title="CLI">
    <Note>
      The CLI does not include a `tool_runner` helper. Use [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) instead, which handles compaction on Anthropic’s servers without SDK-side integration.
    </Note>
  </Tab>
</Tabs>

#### Custom summary prompts

You can provide a custom prompt for domain-specific needs. Your prompt should instruct Claude to wrap its summary in `<summary></summary>` tags.

<Tabs>
  <Tab title="CLI">
    <Note>
      The CLI does not include a `tool_runner` helper. Use [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) instead, which handles compaction on Anthropic’s servers without SDK-side integration.
    </Note>
  </Tab>
</Tabs>

### Default summary prompt

The built-in summary prompt instructs Claude to create a structured continuation summary including:

1. **Task Overview:** The user’s core request, success criteria, and constraints.
2. **Current State:** What has been completed, files modified, and artifacts produced.
3. **Important Discoveries:** Technical constraints, decisions made, errors resolved, and failed approaches.
4. **Next Steps:** Specific actions needed, blockers, and priority order.
5. **Context to Preserve:** User preferences, domain-specific details, and commitments made.

This structure allows Claude to resume work efficiently without losing important context or repeating mistakes.

<Accordion title="View full default prompt">
  ```text wrap
  You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

  1. Task Overview
  The user's core request and success criteria
  Any clarifications or constraints they specified

  2. Current State
  What has been completed so far
  Files created, modified, or analyzed (with paths if relevant)
  Key outputs or artifacts produced

  3. Important Discoveries
  Technical constraints or requirements uncovered
  Decisions made and their rationale
  Errors encountered and how they were resolved
  What approaches were tried that didn't work (and why)

  4. Next Steps
  Specific actions needed to complete the task
  Any blockers or open questions to resolve
  Priority order if multiple steps remain

  5. Context to Preserve
  User preferences or style requirements
  Domain-specific details that aren't obvious
  Any promises made to the user

  Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

  Wrap your summary in <summary></summary> tags.
  ```
</Accordion>

### Limitations

#### Server-side tools

<Warning>
  Compaction requires special consideration when using server-side tools such as [web search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool?sdk_languages=cli) or [web fetch](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool?sdk_languages=cli).
</Warning>

When using server-side tools, the SDK might incorrectly calculate token usage, causing compaction to trigger at the wrong time.

For example, after a web search operation, the API response might show:

```json Output
{
  "usage": {
    "input_tokens": 63000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

The SDK calculates total usage as 63,000 + 0 + 270,000 + 1,400 = 334,400 tokens. However, the `cache_read_input_tokens` value includes accumulated reads from multiple internal API calls made by the server-side tool, not your actual conversation context. Your real context length might only be the 63,000 `input_tokens`, but the SDK calculates 334k and triggers compaction prematurely.

**Workarounds:**

* Use the [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli) endpoint to get accurate context length.
* Avoid compaction when using server-side tools extensively.

#### Tool use edge cases

When the SDK triggers compaction while a tool use response is pending, it removes the tool use block from the message history before generating the summary. Claude will re-issue the tool call after resuming from the summary if still needed.

### Monitoring compaction

Understanding when compaction triggers helps you tune thresholds and verify expected behavior.

<Tabs>
  <Tab title="CLI">
    <Note>
      The CLI does not include a `tool_runner` helper. Use [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli) instead, which handles compaction on Anthropic’s servers without SDK-side integration.
    </Note>
  </Tab>
</Tabs>

### When to use compaction

**Good use cases:**

* Long-running agent tasks that process many files or data sources
* Research workflows that accumulate large amounts of information
* Multistep tasks with clear, measurable progress
* Tasks that produce artifacts (files, reports) that persist outside the conversation

**Less ideal use cases:**

* Tasks requiring precise recall of early conversation details
* Workflows using server-side tools extensively
* Tasks that need to maintain exact state across many variables

## Next steps

<CardGroup cols={2}>
  <Card title="Compaction" icon="arrows-clockwise" href="https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli">
    Manage long conversations with server-side compaction, the recommended strategy for most use cases.
  </Card>

  <Card title="Prompt caching" icon="database" href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli">
    Reduce cost and latency by caching prompt prefixes, and learn how context editing interacts with the cache.
  </Card>
</CardGroup>

## Availability

Context editing is in beta on every model and eligible for zero data retention.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Available

| Status | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta   | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Amazon Bedrock (InvokeModel)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) |

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `context-management-2025-06-27`

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                                         | HIPAA        |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Status  | Eligible (excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements)) | Not eligible |
| Details | Context edits (tool use clearing and thinking clearing) are applied in real time.                                                                                           | —            |

Applicable endpoints:

* `/v1/messages` with `context_management`
