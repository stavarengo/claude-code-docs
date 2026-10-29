---
title: Using the Messages API
url: https://platform.claude.com/docs/en/build-with-claude/working-with-messages
description: Practical patterns and examples for using the Messages API effectively
featureMetadata:
  status: ga
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=curl#model-specific-data-retention-requirements). Standard API calls for generating Claude responses.
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
    Claude API: ga
    Claude Platform on AWS: ga
    Claude Models on Google Cloud (Anthropic managed): ga
    Amazon Bedrock: ga
    Amazon Bedrock (InvokeModel): ga
    Claude Models on Google Cloud (Google managed): ga
    Microsoft Foundry: ga
---

Anthropic offers two ways to build with Claude, each suited to different use cases:

|                | Messages API                                | Claude Managed Agents                                                     |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| **What it is** | Direct model prompting access               | Pre-built, configurable agent harness that runs in managed infrastructure |
| **Best for**   | Custom agent loops and fine-grained control | Long-running tasks and asynchronous work                                  |

This guide covers common patterns for working with the Messages API, including basic requests, multi-turn conversations, prefill techniques, and vision capabilities. For complete API specifications, see the [Messages API reference](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=curl). For the managed agent harness instead, see the [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=curl).

## Basic request and response

<Note>
  The `temperature`, `top_p`, and `top_k` sampling parameters are not supported on Claude 4.7 and later models and Claude Mythos Preview, or on any model starting with [API version `2026-10-21`](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=curl#sampling-parameters). Setting them to a non-default value returns a 400 error, and starting with `2026-10-21` any value does. Omit them from request payloads and use prompting to guide the model’s behavior instead. See the [breaking changes in the migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide?sdk_languages=curl#opus-46-breaking-changes).
</Note>

<CodeGroup>
  ```bash cURL
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "messages": [
        {"role": "user", "content": "Hello, Claude"}
      ]
    }'
  ```
</CodeGroup>

```json Output
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello!"
    }
  ],
  "model": "claude-opus-5-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 12,
    "output_tokens": 6
  }
}
```

Refusal responses (`stop_reason: "refusal"`) also include a `stop_details` object identifying the policy category that triggered the refusal, on every model. See [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=curl#refusal-response) for the field reference and example handling code.

## Multiple conversational turns

The Messages API is stateless, which means that you always send the full conversational history to the API. You can use this pattern to build up a conversation over time. Earlier conversational turns don’t necessarily need to actually originate from Claude. You can use synthetic `assistant` messages.

<CodeGroup>
  ```bash cURL
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "messages": [
        {"role": "user", "content": "Hello, Claude"},
        {"role": "assistant", "content": "Hello!"},
        {"role": "user", "content": "Can you describe LLMs to me?"}

      ]
    }'
  ```
</CodeGroup>

```json Output
{
  "id": "msg_018gCsTGsXkYJVqYPxTgDHBU",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Sure, I'd be happy to provide..."
    }
  ],
  "model": "claude-opus-5-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 30,
    "output_tokens": 309
  }
}
```

### System role in messages

On Claude Fable 5.1, [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=curl), Claude Fable 5, [Claude Mythos 5](https://platform.claude.com/docs/en/models/mythos-5/overview?sdk_languages=curl), Claude Opus 5.5, Claude Opus 4.8, Claude Opus 5, Claude Sonnet 5.5, and Claude Haiku 5.5, you can include messages with `"role": "system"` after a user turn (subject to [placement rules](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=curl#limitations)) to add a new system instruction partway through a conversation. A `system` message that carries content cannot be the first entry in `messages`. Use the top-level `system` field for instructions that apply from the start.

A mid-conversation system message has the same authority as the top-level `system` field, but because it is appended to the end of the message history, it does not invalidate any cached prefix that came before it. Use the top-level `system` field for instructions that should apply from the very first turn, and a mid-conversation system message for instructions that only become relevant later.

See [Mid-conversation system messages](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=curl) for the complete guide, including how to combine it with [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=curl).

## Prefilling Claude’s response

You can prefill part of Claude’s response in the last position of the input messages list. Use this technique to shape Claude’s response. The following example uses `"max_tokens": 1` to get a single multiple choice answer from Claude.

<Warning>
  Prefilling is not supported on Claude 4.6 and later models and [Claude Mythos Preview](https://anthropic.com/glasswing). Requests using prefill with these models return a 400 error. Use [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=curl) on models that support it, or system prompt instructions, instead. See the [migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide?sdk_languages=curl) for migration patterns.
</Warning>

<CodeGroup>
  ```bash cURL
  #!/bin/sh
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1,
      "messages": [
        {"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
        {"role": "assistant", "content": "The answer is ("}
      ]
    }'
  ```
</CodeGroup>

```json Output
{
  "id": "msg_01Q8Faay6S7QPTvEUUQARt7h",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "C"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "max_tokens",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 42,
    "output_tokens": 1
  }
}
```

## Vision

Claude can read both text and images in requests. You can supply images using the `base64`, `url`, or `file` source types. The `file` source type references an image uploaded through the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=curl). Supported media types are `image/jpeg`, `image/png`, `image/gif`, and `image/webp`. See the [Vision](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=curl) guide for more details.

<CodeGroup>
  ```bash cURL
  #!/bin/sh

  # Option 1: base64-encoded image
  IMAGE_BASE64=$(curl "https://platform.claude.com/docs/images/vision-example.jpg" | base64 | tr -d '\n')

  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d @- <<EOF
  {
    "model": "claude-opus-5-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": [
        {"type": "image", "source": {
          "type": "base64",
          "media_type": "image/jpeg",
          "data": "$IMAGE_BASE64"
        }},
        {"type": "text", "text": "What is in the above image?"}
      ]}
    ]
  }
  EOF

  # Option 2: URL-referenced image
  curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "messages": [
        {"role": "user", "content": [
          {"type": "image", "source": {
            "type": "url",
            "url": "https://platform.claude.com/docs/images/vision-example.jpg"
          }},
          {"type": "text", "text": "What is in the above image?"}
        ]}
      ]
    }'
  ```
</CodeGroup>

```json Output
{
  "id": "msg_011CdKmWtV3oFx1C5yUbf5CY",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "This image is a beautiful minimalist/flat-design illustration of a sunset landscape. Here's what it contains:\n\n**Sky & Sun:**\n- A warm gradient sky transitioning from golden-yellow at the top to deep orange toward the horizon\n- A large pale yellow sun positioned in the upper-right area\n\n**Birds:**\n- Three small silhouetted birds flying in the upper-left portion of the sky, depicted as simple \"M\" or \"v\" shapes\n\n**Mountains:**\n- Multiple layered mountain peaks in purple and maroon tones\n- The mountains overlap to create depth, with varying shades of dusty purple and deep burgundy\n\n**Water:**\n- A dark purple body of water at the bottom of the image\n- A reflection of the sun shown as horizontal cream/peach colored lines in the center-bottom area\n\nThe overall style is clean, geometric, and uses a warm sunset color palette (oranges, yellows, purples, and maroons), giving it a peaceful, serene aesthetic typical of modern vector/flat design artwork."
    }
  ],
  "model": "claude-opus-5-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 1030,
    "output_tokens": 350
  }
}
```

## Next steps

<CardGroup cols={2}>
  <Card title="Stop reasons and fallback" icon="list" href="https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=curl">
    Handle each `stop_reason` value and decide what to do when a response ends.
  </Card>

  <Card title="Tool use with Claude" icon="wrench" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=curl">
    Give Claude tools to call external services and APIs from within the Messages API.
  </Card>

  <Card title="Computer use tool" icon="computer" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=curl">
    Control desktop computer environments with the Messages API.
  </Card>

  <Card title="Browser use tool" icon="browser" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=curl">
    Let Claude navigate, read, and interact with webpages in a browser you run.
  </Card>

  <Card title="Structured outputs" icon="code-brackets" href="https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=curl">
    Get guaranteed, schema-validated JSON output from Claude.
  </Card>

  <Card title="Task budgets" icon="gauge" href="https://platform.claude.com/docs/en/build-with-claude/task-budgets?sdk_languages=curl">
    Set an advisory token budget across a full agentic loop with `output_config.task_budget`.
  </Card>
</CardGroup>

## Availability

The Messages API is available on every model and eligible for zero data retention and HIPAA readiness.

### API support

Available

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=curl#feature-eligibility)

| Item    | Zero data retention                                                                                                                                                          | HIPAA    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Status  | Eligible (excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=curl#model-specific-data-retention-requirements)) | Eligible |
| Details | Standard API calls for generating Claude responses.                                                                                                                          | —        |

Applicable endpoints:

* `/v1/messages`
