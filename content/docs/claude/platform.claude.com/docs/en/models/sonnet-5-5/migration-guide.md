---
title: Claude Sonnet 5.5 migration guide
url: https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide
description: Switch to Claude Sonnet 5.5 from earlier Sonnet models or Claude Haiku 4.5 with this migration guide. The guidance to enable Claude Sonnet 5.5 includes settings that return errors, thinking changes, and a checklist for each starting model.
---

This guide lists the code changes for moving to Claude Sonnet 5.5 from Claude Sonnet 5, Claude Sonnet 4.6, Claude Sonnet 4.5, Claude Sonnet 4, Claude 3.7 Sonnet, or Claude Haiku 4.5. Read the first two sections, then read down to the section for your current model. The [migration checklist](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#migration-checklist) lists every change by starting model.

<Note>
  This guide covers migrating [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli) code. If you use [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli), no changes beyond updating the model name are required.
</Note>

Let Claude Code migrate your code for you

```text
/claude-api migrate this project to claude-sonnet-5-5
```

Claude Sonnet 5.5 has the same prices as Claude Sonnet 5, except for prompt cache reads, which cost $0.10 USD per million tokens, half the Claude Sonnet 5 rate. See [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli). For its context window and output limits, see the [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli) model page. For features and prompting, see [What’s new in Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5?sdk_languages=cli#feature-support) and [Prompting Claude Sonnet 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5?sdk_languages=cli).

## Send a request to Claude Sonnet 5.5

This request works on Claude Sonnet 5.5 as written. It sets an effort level, and the SDK example reads the reply by block type. It leaves out five settings that return a 400 error: [thinking budgets](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#sonnet-46-breaking-changes), [sampling parameters](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#sonnet-46-breaking-changes), [assistant prefill](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#migrating-from-sonnet-45), [forced tool choice](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#forced-tool-use), and [`thinking: {"type": "disabled"}`](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#turn-off-up-front-thinking).

<CodeGroup>
  ```bash CLI
  ant messages create \
    --model claude-sonnet-5-5 \
    --max-tokens 4096 \
    --output-config '{effort: medium}' \
    --message '{role: user, content: "Analyze the trade-offs between microservices and monolithic architectures"}'
  ```
</CodeGroup>

## Thinking runs by default

On Claude Sonnet 5.5, a request with no `thinking` field runs with [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli), as does `thinking: {"type": "adaptive"}`. On Claude Sonnet 4.6 and earlier models and on Claude Haiku 4.5, that request ran without thinking. To keep running without up-front thinking, see [Turn off up-front thinking](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#turn-off-up-front-thinking).

| Model                                  | Thinking without a `thinking` field | `thinking.type` values accepted                      | Default `display` |
| -------------------------------------- | ----------------------------------- | ---------------------------------------------------- | ----------------- |
| Claude Sonnet 5.5                      | On                                  | `"adaptive"`, `"between_tools"`                      | `"omitted"`       |
| Claude Sonnet 5                        | On                                  | `"adaptive"`, `"disabled"`                           | `"omitted"`       |
| Claude Sonnet 4.6                      | Off                                 | `"adaptive"`, `"disabled"`, `"enabled"` (deprecated) | `"summarized"`    |
| Claude Sonnet 4.5 and Claude Haiku 4.5 | Off                                 | `"disabled"`, `"enabled"`                            | `"summarized"`    |

### Handle thinking in responses

Code that ran without thinking needs all three items. Code from Claude Sonnet 5 likely has the first two.

* **Read content blocks by `type`.** A response can start with `thinking` blocks, so code that reads `content[0].text` breaks.
* **Pass `thinking` blocks back unchanged** in tool-use loops, including empty ones. See [Preserving thinking blocks](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#preserving-thinking-blocks).
* **Revisit `max_tokens`.** It covers thinking plus text, and thinking tokens are billed as output tokens. See [Cost control](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost?sdk_languages=cli#cost-control).

Thinking text is omitted by default. `thinking` blocks arrive with an empty `thinking` field and a `signature`. To get readable summaries, set `display: "summarized"`, the default on Claude Sonnet 4.6 and earlier models and on Claude Haiku 4.5. See [Controlling thinking display](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#controlling-thinking-display).

### Turn off up-front thinking

To turn off up-front thinking on Claude Sonnet 5.5, send `thinking: {"type": "between_tools"}`. It’s the lowest thinking setting. Its progress updates between tool calls still come back as `thinking` blocks with their summary text. Without tools, the response contains only text. Claude Sonnet 5 turns thinking off with `thinking: {"type": "disabled"}` instead, and earlier models run without thinking by default. On Claude Sonnet 5.5, `disabled` returns a 400 `invalid_request_error`:

```text wrap
To turn thinking off on this model, send "thinking": {"type": "between_tools"} instead of {"type": "disabled"}. The model does not think before responding. The short updates it writes between tool calls come back as thinking blocks.
```

`between_tools` works on every platform that offers Claude Sonnet 5.5, with no beta header. It’s accepted at `low`, `medium`, and `high` effort. At `xhigh` or `max`, it returns a 400 error. To run at those levels, use adaptive thinking: omit the `thinking` field or send `thinking: {"type": "adaptive"}`. `between_tools` takes no other field: `display`, `budget_tokens`, or `block_binding` sent with it returns a 400 error. With [server-side fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback), a `between_tools` request that falls back to Claude Sonnet 5 runs there with `thinking: {"type": "disabled"}`.

With `between_tools`, effort can’t change mid-conversation: a per-message `output_config.effort` that differs from the level in effect returns a 400 error. To vary effort for each turn, use adaptive thinking. For prompting guidance, see [Running without up-front thinking](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5?sdk_languages=cli#running-without-up-front-thinking).

Before (Claude Sonnet 5):

<CodeGroup>
  ```bash CLI
  ant messages create \
    --model claude-sonnet-5 \
    --max-tokens 16000 \
    --thinking '{type: disabled}' \
    --output-config '{effort: xhigh}' \
    --message '{role: user, content: "..."}'
  ```
</CodeGroup>

After (Claude Sonnet 5.5):

<CodeGroup>
  ```bash CLI
  ant messages create \
    --model claude-sonnet-5-5 \
    --max-tokens 16000 \
    --thinking '{type: between_tools}' \
    --output-config '{effort: high}' \
    --message '{role: user, content: "..."}'
  ```
</CodeGroup>

## Migration checklist by starting model

Work down the groups and stop after the one that names your model. On Claude Haiku 4.5, apply every group except “Claude Sonnet 4 or earlier,” ending with “Claude Haiku 4.5 only.”

### Every starting model

* Change the model ID to `claude-sonnet-5-5`.
* [Read content blocks by `type`](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#thinking-in-responses), and pass `thinking` blocks back unchanged.
* To keep running without up-front thinking, send the [lowest thinking setting](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#turn-off-up-front-thinking) at `high` effort or below.
* Replace [forced tool use](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#forced-tool-use) with `auto` and strict tools.
* Keep conversations [append-only](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#thinking-blocks).
* On the Claude API and Claude Models on Google Cloud (Google managed), move computer use to the [toolset](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#computer-use-toolset), without the `fine-grained-tool-streaming-2025-05-14` beta header.
* [Pair the advisor tool](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#advisor-tool) with a supported advisor, and expect encrypted advice.
* Read [text between tool calls](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#text-between-tool-calls) from `thinking` blocks.
* [Handle refusals](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#safety-classifiers-and-fallback), and configure fallback.
* [Re-run your effort sweep](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#recommended-changes), and re-baseline cost.

### Claude Sonnet 4.6 or earlier

* Expect [thinking on requests with no `thinking` field](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#thinking-on-by-default), and revisit `max_tokens`.
* Replace [thinking budgets](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#sonnet-46-breaking-changes) with an effort level.
* Remove `temperature`, `top_p`, and `top_k`.
* If you [show thinking text](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#thinking-in-responses), set `display: "summarized"`.
* [Recount tokens](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#other-changes-from-claude-sonnet-4-6), and re-budget image tokens.

### Claude Sonnet 4.5 or earlier

* Replace [assistant prefills](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#migrating-from-sonnet-45).
* Parse tool call input with a standard JSON parser.
* On Amazon Bedrock, move computer use from `computer_20250124` to [`computer_20251124`](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#computer-use-toolset).
* Set `output_config.effort` explicitly.
* Remove any context-window beta header.
* Remove `interleaved-thinking-2025-05-14`, and replace `fine-grained-tool-streaming-2025-05-14` with `eager_input_streaming`.
* Move `output_format` to `output_config.format`.

### Claude Sonnet 4 or earlier

* Update [tool versions](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#migrating-from-claude-sonnet-4-or-earlier) to `text_editor_20250728` and `code_execution_20260521`.
* Handle the `refusal` and `model_context_window_exceeded` stop reasons.
* Check tool string parameters for trailing newlines.
* Remove `token-efficient-tools-2025-02-19` and `output-128k-2025-02-19`.
* Review your prompts.

### Claude Haiku 4.5 only

* Replace [`claude-haiku-4-5-20251001`](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#migrating-from-claude-haiku-4-5) or its alias.
* Re-baseline cost at the higher price per token.
* Review prompts that were too short to cache on Claude Haiku 4.5.

## Migrating to Claude Sonnet 5.5 from Claude Sonnet 5

Every starting model needs the changes in this section. Replace your model ID with `claude-sonnet-5-5`, which has no date suffix. On other platforms, use the ID listed under [Availability](https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5?sdk_languages=cli#availability).

### Forced tool use is not supported

Every earlier model on this page accepts a `tool_choice` of type `any` or `tool`. Claude Sonnet 5.5 rejects both with a 400 error, including on the [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli) endpoint:

```text wrap
tool_choice: type "tool" and "any" are not supported for this model.
```

Send `tool_choice: {"type": "auto"}`, and mark the tool `strict: true` so its input matches the schema. The model can then answer without calling the tool, so say in the prompt when to use it. [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use?sdk_languages=cli) supports a subset of JSON Schema and needs `additionalProperties: false` on every object. See [JSON Schema limitations](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#json-schema-limitations).

Before (Claude Sonnet 5):

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-sonnet-5
  max_tokens: 1024
  tools:
    - name: get_weather
      description: Get the current weather in a given location
      input_schema:
        type: object
        properties:
          location:
            type: string
            description: The city and state, e.g. San Francisco, CA
        required: [location]
        additionalProperties: false
  tool_choice:
    type: tool
    name: get_weather
  messages:
    - role: user
      content: What's the weather in Paris?
  YAML
  ```
</CodeGroup>

After (Claude Sonnet 5.5):

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-sonnet-5-5
  max_tokens: 1024
  tools:
    - name: get_weather
      description: Get the current weather in a given location
      input_schema:
        type: object
        properties:
          location:
            type: string
            description: The city and state, e.g. San Francisco, CA
        required: [location]
        additionalProperties: false
      # strict tool use: every call matches the tool's input_schema
      strict: true
  tool_choice:
    type: auto
  messages:
    - role: user
      content: What's the weather in Paris? Use the get_weather tool.
  YAML
  ```
</CodeGroup>

The example marks every tool in the list strict. A request can have at most 20 strict tools, and the MCP, computer use, and browser use toolset entries don’t accept `strict`. In a longer tools list, mark only the tools that need it.

### Thinking blocks are tied to the model and the conversation

Claude Sonnet 5.5 reads thinking blocks from Claude Sonnet 5, Claude Opus 4.8, Claude Haiku 4.5, and earlier models, and, on the Claude API and Claude Models on Google Cloud (Google managed), from Claude Haiku 5.5. It doesn’t read blocks from Claude Opus 5, Claude Opus 5.5, or any Claude Fable or Claude Mythos model. The API drops blocks the model can’t read. The request still returns 200, and dropped blocks aren’t billed. See [Switching models mid-conversation](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#switching-models).

Each Claude Sonnet 5.5 thinking block is also signed over the conversation before it. For accounts created on or after August 31, 2026, 00:00 UTC, the API enforces this by default, on the Claude API, Amazon Bedrock, and Claude Models on Google Cloud (Google managed). On those accounts, a request that replays a block after an edit to earlier history returns a 400 error. Keep conversations append-only, and change instructions or tools with [mid-conversation system messages](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli). Thinking blocks that Claude Sonnet 5.5 produces work only in the account that produced them, or in an account linked to it. See [Preserved thinking](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#account-bound-thinking).

### Computer use needs the toolset on the Claude API and Claude Models on Google Cloud (Google managed)

On the Claude API and Claude Models on Google Cloud (Google managed), Claude Sonnet 5.5 supports computer use only through the `computer_toolset_20260801` toolset. There, `computer_20251124` returns a 400 error. Claude Sonnet 5.5 doesn’t accept `computer_20250124` on any platform. Find the version you send today:

| Version you send today | Starting models that send it                         | Send on the Claude API and Claude Models on Google Cloud (Google managed) | Send on Amazon Bedrock |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `computer_20251124`    | Claude Sonnet 5, Claude Sonnet 4.6                   | `computer_toolset_20260801`                                               | `computer_20251124`    |
| `computer_20250124`    | Claude Sonnet 4.5, Claude Haiku 4.5, Claude Sonnet 4 | `computer_toolset_20260801`                                               | `computer_20251124`    |

If you send the `fine-grained-tool-streaming-2025-05-14` beta header, remove it when you move to the toolset. Alongside a toolset entry, it returns a 400 error. Set `eager_input_streaming: true` on each tool that needs it instead.

Code that already sends the toolset needs no change. [Migrate from `computer_20251124`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#migrate-from-computer-20251124) lists the request and agent-loop changes. For other platforms, see [API support](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#availability-feature-support).

### The advisor tool accepts fewer advisors

With the [advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool?sdk_languages=cli), a Claude Sonnet 5.5 executor needs one of these advisors: Claude Opus 5, Claude Opus 5.5, Claude Sonnet 5.5, Claude Fable 5, Claude Fable 5.1, Claude Mythos 5, or Claude Mythos 5.1. Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, Claude Sonnet 4.6, and Claude Haiku 5.5 advisors return a 400 error. The advice comes back encrypted as an `advisor_redacted_result` block, so its text isn’t readable in the response. See [Model compatibility](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool?sdk_languages=cli#model-compatibility).

### Text between tool calls is returned in thinking blocks

On Claude Sonnet 5.5, notes longer than a sentence or two that the model writes between tool calls come back as [progress-update `thinking` blocks](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#progress-updates), empty at the default `display`. Shorter remarks stay `text`. On Claude Sonnet 5 and earlier models, all text between tool calls comes back as `text` blocks. No request fails, but an interface that shows those notes goes quiet.

With adaptive thinking, set `display` to `"updates"` (beta, `thinking-display-updates-2026-08-18` header) to get the updates alone, or to `"summarized"` to get them mixed with reasoning. Render each non-empty `thinking` block before the `tool_use` block that follows it. With [`between_tools`](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#turn-off-up-front-thinking), the text comes back without `display`. See [User-facing progress updates](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5?sdk_languages=cli#user-facing-progress-updates).

### Safety classifiers and fallback

Claude Sonnet 5.5 declines in more categories than Claude Sonnet 5. A decline returns `stop_reason: "refusal"`, and its `stop_details` can name one of these [categories](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#refusal-response):

* **`"cyber"`:** The request could enable cyber harm, such as malware or exploit development.
* **`"bio"`:** The request could enable biological harm, such as dangerous lab methods.
* **`"frontier_llm"`:** The request could help with the development of competing AI models.
* **`"reasoning_extraction"`:** The request asks the model to reproduce its internal reasoning in the response text.
* **`"general_harms"`:** The request falls under another usage-policy area. Benign work can also trigger this category.

[Server-side fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback) (`fallbacks: "default"`), in beta on the Claude API and on [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), retries `"cyber"` and `"frontier_llm"` declines on Claude Sonnet 5. It doesn’t retry `"bio"`, `"reasoning_extraction"`, or `"general_harms"` declines. See [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli) and [How refusals are billed](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#how-refusals-are-billed).

Real-time cyber safeguards are new for code from Claude Sonnet 4.6, Claude Sonnet 4.5, and Claude Haiku 4.5. For legitimate security work, apply to the [Cyber Verification Program](https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude-opus-and-sonnet).

### Other changes

* **Prompt caching:** The minimum cacheable prompt is 512 tokens, down from 1,024 on Claude Sonnet 5, Claude Sonnet 4.6, and Claude Sonnet 4.5. See [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli#cache-limitations).
* **New features:** For mid-conversation system messages, mid-conversation tool changes, and per-message effort, see [What’s new in Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5?sdk_languages=cli#feature-support). With [`between_tools`](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#turn-off-up-front-thinking), effort can’t change mid-conversation.

### Recommended changes

Re-run your effort sweep. Claude Sonnet 5.5 has five effort levels: `low`, `medium`, `high`, `xhigh`, and `max`. The default on the Claude API is `high`. The levels are recalibrated, so a level doesn’t produce the same amount of thinking as on Claude Sonnet 5. Start at `high` unless your workload is agentic or latency-sensitive. For agentic coding and multistep tool use, start at `medium` for well-specified tasks and move to `high` for harder or longer ones. For chat and other latency-sensitive work, start at `medium` or `low`. Set the level in `output_config.effort`. See [Recommended effort levels for Claude Sonnet 5.5](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli#recommended-effort-levels-for-claude-sonnet-5-5). Then re-evaluate model-specific prompt instructions against [Prompting Claude Sonnet 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5?sdk_languages=cli).

## Migrating to Claude Sonnet 5.5 from Claude Sonnet 4.6 and earlier Sonnet models

First apply every preceding section, replacing `claude-sonnet-4-6`. Then make these changes. On Claude Sonnet 4.5 or earlier, continue with the subsections that follow.

### Breaking changes

**Thinking runs on requests that omitted it.** See [Thinking runs by default](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#thinking-on-by-default) and [Turn off up-front thinking](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#turn-off-up-front-thinking).

**Thinking budgets return an error.** Claude Sonnet 4.6 accepts `thinking: {"type": "enabled", "budget_tokens": N}` as a deprecated setting. Claude Sonnet 4.5 and Claude Haiku 4.5 use it for all thinking. Claude Sonnet 5.5 returns a 400 error:

```text wrap
"thinking.type.enabled" is not supported for this model. Use "thinking.type.adaptive" and "output_config.effort" to control thinking behavior.
```

Remove the budget and set an [effort](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli) level. There’s no fixed mapping from a budget to an effort level, so run your evaluations at two or three levels.

Before (Claude Sonnet 4.6):

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-sonnet-4-6
  max_tokens: 16000
  thinking:
    type: enabled
    budget_tokens: 10000
  messages:
    - role: user
      content: "..."
  YAML
  ```
</CodeGroup>

After (Claude Sonnet 5.5):

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-sonnet-5-5
  max_tokens: 16000
  thinking:
    type: adaptive
  output_config:
    effort: high
  messages:
    - role: user
      content: "..."
  YAML
  ```
</CodeGroup>

**Sampling parameters return an error.** Remove `temperature`, `top_p`, and `top_k`.

**Thinking text is omitted by default.** See [Handle thinking in responses](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#thinking-in-responses).

### Other changes

* **About 30 percent more tokens:** Claude Sonnet 5.5 uses Claude Sonnet 5’s tokenizer. Against Claude Sonnet 4.6, Claude Sonnet 4.5, and Claude Haiku 4.5, the same text produces about 30 percent more tokens, depending on the content. Recount with [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli), and revisit `max_tokens` and cost.
* **Effort:** `xhigh` is new, and the levels are recalibrated. See [Recommended changes](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#recommended-changes).
* **Images:** Claude Sonnet 5.5 uses the high-resolution image tier, up to 2,576 pixels on the long edge and up to 4,784 visual tokens for an image. Claude Sonnet 4.6, Claude Sonnet 4.5, and Claude Haiku 4.5 stop at 1,568 pixels and 1,568 tokens. A 2000×1500 image costs about 2.5 times as many tokens on Claude Sonnet 5.5. See [Resolution and token cost](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size).

### Migrating from Claude Sonnet 4.5 or earlier

On Claude Sonnet 4.5, Claude Sonnet 4, or Claude 3.7 Sonnet, first apply every preceding section, then these changes.

**Prefill returns an error.** Claude Sonnet 5.5 rejects a prefilled last assistant turn with a 400 error, as Claude Sonnet 4.6 and Claude Sonnet 5 do. Claude Sonnet 4.5, Claude Haiku 4.5, and older models accept one. The error reads:

```text wrap
This model does not support assistant message prefill. The conversation must end with a user message.
```

Replace each prefill according to what it was for:

* **Output format:** use [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli), or tools with enum fields for classification.
* **Preambles:** ask in the system prompt for a direct answer.
* **Unwanted refusals:** clear instructions in the user message are usually enough.
* **Continuations:** move them to the user message, for example “Your previous response was interrupted and ended with `[previous_response]`. Continue from where you left off.”
* **Context reminders:** put them in the user turn.

**Tool input escaping.** Escaping in tool call arguments can differ. Parse `input` with a standard JSON parser.

**Computer use.** Claude Sonnet 5.5 doesn’t accept `computer_20250124`. See the [computer use table](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#computer-use-toolset).

**Effort.** Claude Sonnet 4.5 has no effort parameter. Set an effort level explicitly, as [Recommended changes](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#recommended-changes) describes.

**Context and output.** Claude Sonnet 5.5 has a larger context window, with no beta header, and a higher output limit. See the [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli) model page. Remove any context-window beta header.

**Beta headers.** Remove `interleaved-thinking-2025-05-14`, because adaptive thinking interleaves automatically. Replace `fine-grained-tool-streaming-2025-05-14` with `eager_input_streaming: true` on each tool that needs it. That header returns a 400 error alongside a computer use or browser use toolset entry. See [Fine-grained tool streaming](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming?sdk_languages=cli).

**Structured outputs.** The `output_format` parameter is deprecated. To use it anyway, add the `structured-outputs-2025-11-13` beta header. Without it, the API returns a 400 error. Use `output_config.format` instead.

### Migrating from Claude Sonnet 4 or earlier

Claude Sonnet 4 is retired on the Claude API and still available on Amazon Bedrock and Claude Models on Google Cloud (Google managed). Claude 3.7 Sonnet is retired. From either model, first apply every preceding section, then these changes:

* **Tool versions:** Use `text_editor_20250728`, with the tool name `str_replace_based_edit_tool` and no `undo_edit` command. Use `code_execution_20260521`. See the [text editor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool?sdk_languages=cli) and the [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#upgrade-to-latest-tool-version).
* **Stop reasons:** Handle `refusal`. Claude 4.5 and later models also stop with `model_context_window_exceeded` at the context window limit. See [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli).
* **Trailing newlines:** Claude 4.5 and later models keep them in tool call string parameters.
* **Legacy beta headers:** Remove `token-efficient-tools-2025-02-19` and `output-128k-2025-02-19`.
* **Prompts:** Review them against [prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices?sdk_languages=cli).

## Migrating to Claude Sonnet 5.5 from Claude Haiku 4.5

First apply every section up to and including [Migrating from Claude Sonnet 4.5 or earlier](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#migrating-from-sonnet-45), skipping the Claude Sonnet 4 subsection. Then make these changes:

* **Model ID:** Replace `claude-haiku-4-5-20251001`, or the alias `claude-haiku-4-5`, with `claude-sonnet-5-5`.
* **Cost:** The price per token is higher, and the same text produces more tokens. Recount tokens and re-baseline cost. See [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli).
* **Prompt caching:** The minimum cacheable prompt drops from 4,096 tokens to the [Claude Sonnet 5.5 minimum](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide?sdk_languages=cli#other-changes-from-claude-sonnet-5).
* **Interleaved thinking:** Adaptive thinking runs between tool calls automatically, with no beta header.
* **Routing:** Claude Sonnet 5.5 reads Claude Haiku 4.5 thinking blocks. A conversation that moves up keeps its reasoning. One that moves back down to Claude Haiku 4.5 drops Claude Sonnet 5.5’s blocks.
