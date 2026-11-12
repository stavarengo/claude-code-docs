---
title: Compaction at a token threshold
url: https://platform.claude.com/docs/en/build-with-claude/compaction-threshold
description: Have the API summarize older context automatically, inside an ordinary request, when the conversation reaches a token threshold you set.
featureMetadata:
  status: beta
  betaHeader: compact-2026-01-12
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements). Server-side compaction results are returned and round-tripped statelessly through the API response.
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
  supportedPlatforms:
    Claude API: beta
    Amazon Bedrock: beta
    Amazon Bedrock (bedrock-runtime): beta
    Claude Platform on AWS: beta
    Claude Models on Google Cloud (Google managed): beta
    Microsoft Foundry: beta
---

**API support**: Usage differs by product.

* **Messages API**: Opt in with a `compact_20260112` edit; compaction starts at 150,000 input tokens by default.
* **Managed Agents**: Always on. It compacts the session’s conversation history to fit the context window.

Threshold compaction is the automatic kind of compaction: you set a token threshold on your ordinary requests, and the API summarizes older context partway through a request once the threshold is reached. It is supported alongside on-demand compaction, where you decide when the summary is written (see [Compaction on demand](https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand?sdk_languages=cli)). To choose between them, see [Choose how to compact](https://platform.claude.com/docs/en/build-with-claude/compaction?sdk_languages=cli#choose-how-to-compact).

Compaction extends the effective context length for long-running conversations and tasks by automatically summarizing older context when approaching the context window limit. It also keeps the active context small: as a conversation grows, response quality degrades, so compaction replaces older content with a concise summary.

<Tip>
  For a deeper look at why long contexts degrade and how compaction helps, see [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
</Tip>

This is ideal for:

* Chat-based, multi-turn conversations where you want users to use one chat for a long period of time
* Task-oriented prompts that require a lot of follow-up work (often tool use) that might exceed the context window

## How compaction works

When compaction is enabled, Claude automatically summarizes your conversation when it reaches the configured token threshold. The API:

1. Detects when input tokens reach your specified trigger threshold.
2. Generates a summary of the current conversation.
3. Creates a `compaction` block containing the summary.
4. Continues the response with the compacted context.

On subsequent requests, append the response to your messages. The API automatically drops all content blocks prior to the `compaction` block, continuing the conversation from the summary.

<Frame>
  ![Compaction flow: when input tokens reach the trigger, Claude writes a summary into a compaction block and continues](https://platform.claude.com/docs/images/compaction-flow.svg)
</Frame>

## Basic usage

Enable compaction by adding the `compact_20260112` strategy to `context_management.edits` in your Messages API request.

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta compact-2026-01-12 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
  YAML
  ```
</CodeGroup>

## Parameters

| Parameter                | Type    | Default                                     | Description                                                                                                            |
| ------------------------ | ------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `type`                   | string  | Required                                    | Must be `"compact_20260112"`                                                                                           |
| `trigger`                | object  | `{"type": "input_tokens", "value": 150000}` | When to trigger compaction. `input_tokens` is the only supported trigger type. `value` must be at least 50,000 tokens. |
| `pause_after_compaction` | boolean | `false`                                     | Whether to pause after generating the compaction summary                                                               |
| `instructions`           | string  | `null`                                      | Custom summarization prompt. Completely replaces the default prompt when provided.                                     |

### Trigger configuration

Configure when compaction triggers using the `trigger` parameter:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta compact-2026-01-12 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
        trigger:
          type: input_tokens
          value: 150000
  YAML
  ```
</CodeGroup>

### Custom summarization instructions

The default summarization prompt varies by model. Each default instructs Claude to write a summary inside `<summary></summary>` tags with the information needed to continue the task in a future context window. For example, this is one of the default prompts:

```text wrap
You have written a partial transcript for the initial task above. Please write a summary of the transcript. The purpose of this summary is to provide continuity so you can continue to make progress towards solving the task in a future context, where the raw history above may not be accessible and will be replaced with this summary. Write down anything that would be helpful, including the state, next steps, learnings etc. You must wrap your summary in a <summary></summary> block.
```

You can provide custom instructions through the `instructions` parameter. Custom instructions don’t supplement the default prompt. They replace it completely:

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta compact-2026-01-12 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
        instructions: >-
          Focus on preserving code snippets, variable names, and
          technical decisions.
  YAML
  ```
</CodeGroup>

On some models, a request with custom `instructions` summarizes from the visible conversation only, without earlier thinking blocks. Those models are Claude Fable 5.2, Claude Mythos 5.2, Claude Fable 5.1, Claude Mythos 5.1, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5.

### Pausing after compaction

Use `pause_after_compaction` to pause the API after generating the compaction summary. This allows you to add additional content blocks (such as preserving recent messages or specific instruction-oriented messages) before the API continues with the response.

When enabled, the API returns a message with the `compaction` stop reason after generating the compaction block:

<CodeGroup>
  ```bash CLI
  # pause_after_compaction stops the response right after the compaction
  # summary so you can adjust the messages before continuing. Continuing
  # needs more logic than a one-off CLI command. Single paused request:
  ant beta:messages create --beta compact-2026-01-12 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
        pause_after_compaction: true
  YAML
  ```
</CodeGroup>

The API pauses even if no summary is generated. The `compaction` block’s `content` is then `null`, so keep the original messages when you continue. If safeguards block the summary, `content` is also `null` and the stop reason is `refusal` instead of `compaction`. [`stop_details`](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli#refusal) gives the policy category, if there is one. Continue the same way in both cases: look for the `compaction` block instead of testing `stop_reason`, as the [example that preserves recent messages](https://platform.claude.com/docs/en/build-with-claude/compaction-threshold?sdk_languages=cli#examples) does.

#### Enforcing a total token budget

When a model works on long tasks with many tool-use iterations, total token consumption can grow significantly. You can combine `pause_after_compaction` with a compaction counter to estimate cumulative usage and gracefully conclude the task once a budget is reached.

The request combines the `trigger` from [Trigger configuration](https://platform.claude.com/docs/en/build-with-claude/compaction-threshold?sdk_languages=cli#trigger-configuration) with `pause_after_compaction` from [Pausing after compaction](https://platform.claude.com/docs/en/build-with-claude/compaction-threshold?sdk_languages=cli#pausing-after-compaction).

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the Anthropic SDK to run it.
  </CodeGroupItem>
</CodeGroup>

## Working with compaction blocks

When compaction is triggered, the API returns a `compaction` block at the start of the assistant response.

A long-running conversation might result in multiple compactions. The last compaction block reflects the final state of the prompt, replacing content prior to it with the generated summary.

```json Output
{
  "content": [
    {
      "type": "compaction",
      "content": "Summary of the conversation: The user requested help building a web scraper..."
    },
    {
      "type": "text",
      "text": "Based on our conversation so far..."
    }
  ]
}
```

### Passing compaction blocks back

You must pass the `compaction` block back to the API on subsequent requests to continue the conversation with the shortened prompt. The simplest approach is to append the entire response content to your messages:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

When the API receives a `compaction` block, all content blocks before it are ignored. You can either:

* Keep the original messages in your list and let the API handle removing the compacted content
* Manually drop the compacted messages and only include the compaction block onward

If no summary is generated, the block’s `content` is `null` and the API ignores the block. Nothing is compacted, so keep the original messages.

Thinking blocks from before a `compaction` block aren’t carried forward, so the summary is all the model has of that earlier work. If you write your own `instructions`, tell the model what the summary must retain; see [Tell the model what to preserve in compaction summaries](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1?sdk_languages=cli#tell-the-model-what-to-preserve-in-compaction-summaries).

### Streaming

The compaction block streams differently from text blocks. You receive a `content_block_start` event, followed by a single `content_block_delta` with the complete summary content (no intermediate streaming), and then a `content_block_stop` event.

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --stream \
    --beta compact-2026-01-12 \
    --format jsonl <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
  YAML
  ```
</CodeGroup>

### Prompt caching

Compaction works well with [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli). You can add a `cache_control` breakpoint on compaction blocks to cache the summarized content.

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "compaction",
      "content": "[summary text]",
      "cache_control": { "type": "ephemeral" }
    },
    {
      "type": "text",
      "text": "Based on our conversation..."
    }
  ]
}
```

#### Maximizing cache hits with system prompts

When compaction occurs, the summary becomes new content that needs to be written to the cache. Without additional cache breakpoints, this would also invalidate any cached system prompt, requiring it to be re-cached along with the compaction summary.

To maximize cache hit rates, add a `cache_control` breakpoint at the end of your system prompt. This keeps the system prompt cached separately from the conversation, so when compaction occurs:

* The system prompt cache remains valid and is read from cache
* Only the compaction summary needs to be written as a new cache entry

<CodeGroup>
  ```bash CLI
  ant beta:messages create --beta compact-2026-01-12 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  system:
    - type: text
      text: You are a helpful coding assistant...
      cache_control:
        type: ephemeral
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
  YAML
  ```
</CodeGroup>

This keeps long system prompts cached across multiple compaction events throughout a conversation.

## Understanding usage

Compaction requires an additional sampling step, which contributes to rate limits and billing. The API returns detailed usage information in the response:

```json Output
{
  "usage": {
    "input_tokens": 23000,
    "output_tokens": 1000,
    "iterations": [
      {
        "type": "compaction",
        "input_tokens": 180000,
        "output_tokens": 3500
      },
      {
        "type": "message",
        "input_tokens": 23000,
        "output_tokens": 1000
      }
    ]
  }
}
```

The `iterations` array shows usage for each sampling iteration. When compaction occurs, you’ll see a `compaction` iteration followed by the main `message` iteration. The top-level `input_tokens` and `output_tokens` match the `message` iteration exactly in this example because there is only one non-compaction iteration. The final iteration’s token counts reflect the effective context size after compaction.

<Note>
  The top-level `input_tokens` and `output_tokens` do not include compaction iteration usage. They reflect the sum of all non-compaction iterations. To calculate total tokens consumed and billed for a request, sum across all entries in the `usage.iterations` array.

  To track cost or audit usage when compaction is enabled, aggregate across `usage.iterations` instead of reading only `usage.input_tokens` and `usage.output_tokens`. With the compaction beta enabled, every response includes `usage.iterations`, even if no compaction occurred. A `compaction` entry appears only when a new compaction is triggered during the request. Re-applying a previous `compaction` block incurs no additional compaction cost, and the top-level usage fields remain accurate in that case.
</Note>

## Combining with other features

### Server tools

When using server tools (such as web search), the compaction trigger is checked at the start of each sampling iteration. Compaction might occur multiple times within a single request depending on your trigger threshold and the amount of output generated.

### Token counting

The token counting endpoint (`/v1/messages/count_tokens`) applies existing `compaction` blocks in your prompt but does not trigger new compactions. Use it to check your effective token count after previous compactions:

<CodeGroup>
  ```bash CLI
  ant beta:messages count-tokens --beta compact-2026-01-12 <<'YAML'
  model: claude-opus-5-5
  messages:
    - role: user
      content: Help me build a website
  context_management:
    edits:
      - type: compact_20260112
  YAML
  ```
</CodeGroup>

## Examples

Here’s a complete example of a long-running conversation with compaction:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

When you reinsert an earlier assistant turn after the compaction block, that turn’s thinking blocks fail the [prefix check](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#preserved-in-conversation) on some models. Those models are Claude Fable 5.2, Claude Mythos 5.2, Claude Fable 5.1, Claude Mythos 5.1, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5. The blocks fail because they were produced when the full history was present.

To avoid the failure, do one of the following:

* **Strip the blocks:** Remove the `thinking` and `redacted_thinking` blocks from the turns you reinsert. The preserved text and tool blocks can stay as they are.
* **Have the API drop the blocks:** Send `thinking.block_binding.prefix_mismatch_behavior: "drop_block"`. This needs the `thinking-binding-controls-2026-08-01` beta header (see [Beta headers](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)).
* **Don’t reinsert earlier turns:** Let the API summarize everything.

On Claude Sonnet 5.5 and Claude Haiku 5.5, `block_binding` works only with `thinking: {"type": "adaptive"}`. With any other thinking setting on those two models, strip the blocks.

Here’s an example that uses `pause_after_compaction` to preserve the prior exchange and the current user message (three messages total) instead of summarizing them. It keeps their text and tool blocks unchanged, removes the `thinking` and `redacted_thinking` blocks from the preserved assistant turn, and drops that turn if nothing else is left:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Current limitations

* **Same model for summarization:** The model specified in your request is used for summarization. There is no option to use a different (for example, cheaper) model for the summary.

* **Compaction might fail when tools are defined:** When your request includes `tools`, the model occasionally calls a tool during the internal summarization step instead of writing a summary. When this occurs, the response contains a `compaction` block with `content: null`. To prevent this, set [`instructions`](https://platform.claude.com/docs/en/build-with-claude/compaction-threshold?sdk_languages=cli#custom-summarization-instructions) to a prompt that explicitly tells the model not to call tools, for example:

  ```text wrap
  Summarize the transcript inside <summary></summary> tags. Include relevant information in the summary for continuing the task in the next context window. Do not call any tools while writing this summary; respond with text only.
  ```

## Next steps

<CardGroup cols={3}>
  <Card title="Context editing" icon="edit" href="https://platform.claude.com/docs/en/build-with-claude/context-editing?sdk_languages=cli">
    Automatically manage conversation context as it grows with context editing.
  </Card>

  <Card title="Context windows" icon="arrows-left-right" href="https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli">
    Learn about context window sizes and management strategies.
  </Card>

  <Card title="Session memory compaction recipe (Claude Cookbook)" icon="book" href="https://platform.claude.com/cookbook/misc-session-memory-compaction">
    Explore a practical implementation that manages long-running conversations with instant session memory compaction using background threading and prompt caching.
  </Card>
</CardGroup>

## Availability

Threshold compaction is in beta on select models and eligible for zero data retention.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Available
* Usage: Opt in with a `compact_20260112` edit in `context_management.edits`. Compaction starts when input tokens reach the trigger, 150,000 by default and at least 50,000.

| Status | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Models                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta   | Claude API, [Amazon Bedrock (bedrock-runtime)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli), [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) | [Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview?sdk_languages=cli), [Claude Mythos 5.2](https://platform.claude.com/docs/en/models/mythos-5-2/overview?sdk_languages=cli), [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=cli), [Claude Fable 5](https://platform.claude.com/docs/en/models/fable-5/overview?sdk_languages=cli), [Claude Mythos 5](https://platform.claude.com/docs/en/models/mythos-5/overview?sdk_languages=cli), Claude Mythos Preview, [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli), [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview?sdk_languages=cli), [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli), [Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/overview?sdk_languages=cli), [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli), [Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-4-8/overview?sdk_languages=cli), [Claude Opus 4.7](https://platform.claude.com/docs/en/models/opus-4-7/overview?sdk_languages=cli), [Claude Opus 4.6](https://platform.claude.com/docs/en/models/opus-4-6/overview?sdk_languages=cli), [Claude Sonnet 4.6](https://platform.claude.com/docs/en/models/sonnet-4-6/overview?sdk_languages=cli) |
| Beta   | [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli)                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=cli), [Claude Fable 5](https://platform.claude.com/docs/en/models/fable-5/overview?sdk_languages=cli), [Claude Mythos 5](https://platform.claude.com/docs/en/models/mythos-5/overview?sdk_languages=cli), [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli), [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview?sdk_languages=cli), [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli), [Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/overview?sdk_languages=cli), [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli), [Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-4-8/overview?sdk_languages=cli), [Claude Opus 4.7](https://platform.claude.com/docs/en/models/opus-4-7/overview?sdk_languages=cli)                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Always on
* Usage: It compacts the session’s conversation history to fit the context window, and each compaction emits an `agent.thread_context_compacted` event.

| Status | Cloud platforms                                                                                                                      | Models                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta   | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli) | [Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview?sdk_languages=cli), [Claude Mythos 5.2](https://platform.claude.com/docs/en/models/mythos-5-2/overview?sdk_languages=cli), [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=cli), [Claude Fable 5](https://platform.claude.com/docs/en/models/fable-5/overview?sdk_languages=cli), [Claude Mythos 5](https://platform.claude.com/docs/en/models/mythos-5/overview?sdk_languages=cli), Claude Mythos Preview, [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli), [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview?sdk_languages=cli), [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli), [Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/overview?sdk_languages=cli), [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli), [Claude Haiku 4.5](https://platform.claude.com/docs/en/models/haiku-4-5/overview?sdk_languages=cli), [Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-4-8/overview?sdk_languages=cli), [Claude Opus 4.7](https://platform.claude.com/docs/en/models/opus-4-7/overview?sdk_languages=cli), [Claude Opus 4.6](https://platform.claude.com/docs/en/models/opus-4-6/overview?sdk_languages=cli), [Claude Sonnet 4.6](https://platform.claude.com/docs/en/models/sonnet-4-6/overview?sdk_languages=cli) |

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

| Header               | APIs                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `compact-2026-01-12` | [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli) |

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                                         | HIPAA        |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Status  | Eligible (excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements)) | Not eligible |
| Details | Server-side compaction results are returned and round-tripped statelessly through the API response.                                                                         | —            |

Applicable endpoints:

* `/v1/messages` with `context_management`
