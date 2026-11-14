---
title: Per-message effort
url: https://platform.claude.com/docs/en/build-with-claude/effort-per-message
description: Use a system message to change the effort level partway through a conversation and keep the prompt cache.
featureMetadata:
  status: beta
  betaHeader: mid-conversation-output-config-2026-07-01
  supportedModels:
    - claude-fable-5-2
    - claude-mythos-5-2
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-haiku-5-5
  supportedPlatforms:
    Claude API: beta
    Amazon Bedrock: beta
    Amazon Bedrock (bedrock-runtime):
      availability: beta
      note: Send the beta value in the `anthropic_beta` array of the request body.
    Claude Platform on AWS: beta
    Claude Models on Google Cloud (Anthropic managed): beta
    Claude Models on Google Cloud (Google managed): beta
    Microsoft Foundry: beta
---

A per-message effort change sets a new effort level for later turns of a conversation without changing the request’s top-level value, so the cached prefix still matches.

## Change the effort level

To change the level partway through a conversation:

1. Add a `role: "system"` message to `messages`, with empty `content` and the new [effort](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli) level in `output_config.effort`.
2. Send the `mid-conversation-output-config-2026-07-01` [beta header](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli).
3. Leave the top-level value unchanged.

The following example keeps the top-level value at `high` and drops to `low` for a routine follow-up:

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --beta mid-conversation-output-config-2026-07-01 <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  output_config:
    effort: high
  messages:
    - role: user
      content: Plan a migration from SQLite to PostgreSQL in three short steps.
    - role: assistant
      content: "1. Export the SQLite data. 2. Create the PostgreSQL schema. 3. Import the data and verify row counts."
    # Effort-only system message: the new level takes effect from the next user turn.
    - role: system
      content: []
      output_config:
        effort: low
    - role: user
      content: Summarize the plan in one sentence.
  YAML
  ```
</CodeGroup>

The message’s position decides when the new level starts:

* Directly after a `user` turn with new input: Claude’s reply to that turn uses the new level.
* In any other position, such as between an `assistant` turn and the next `user` turn as in the preceding example: the new level starts at the next `user` turn with new input.

A `user` turn that holds only `tool_result` blocks doesn’t count as new input.

The new level stays in effect until a later message changes it.

Put the message after everything you’ve already sent, and keep it in place on later requests. Don’t insert it before turns you’ve already sent, and don’t move or remove it later. On models with [preserved thinking](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli), any of those changes invalidates the thinking blocks in the `assistant` turns after the message. For what happens next, see [Set `prefix_mismatch_behavior`](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking/prefix-checks?sdk_languages=cli#mismatch-behavior).

If it sits next to a `system` message that has content, both messages must follow the [placement rules for mid-conversation system messages](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli#limitations).

With the Amazon Bedrock InvokeModel API, send the beta value in the `anthropic_beta` array of the request body instead of the header. For the models that support per-message effort there, see [Mid-conversation system messages on Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli#mid-conversation-system-messages-on-bedrock).

## Errors

* Without the beta header, a per-message `output_config` returns a 400 error: `messages.N.output_config: Extra inputs are not permitted`, where `N` is the index of the `system` message in `messages`.
* With the beta header, models without per-message effort, such as Claude Fable 5, return a 400 error: `output_config.effort requires a model that supports per-turn effort; this model does not`. On Amazon Bedrock, those models and Claude Opus 5 return `Extra inputs are not permitted` instead.
* On Claude Sonnet 5.5 with `thinking: {"type": "between_tools"}`, and on Claude Haiku 5.5 with `thinking: {"type": "disabled"}`, you can’t change the effort level mid-conversation. There, a per-message `output_config.effort` with a new level returns a 400 error. To vary effort for each turn, use adaptive thinking.

## Per-message or top-level effort

Prefer per-message effort over [changing the top-level value](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli#top-level-effort-on-the-next-request) between requests. A per-message change leaves everything before it unchanged, so the cached prefix still matches. A top-level change can invalidate all or part of the cache. On Claude Fable 5.1, a top-level change also steers the model less reliably. The model’s earlier replies were written at the previous level, and the model tends to stay consistent with them.

## Availability

Per-message effort is in beta on select models.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Available

| Status           | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Models                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Beta             | Claude API, [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) | [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli)                                                                                                                                                                                                             |
| Beta<sup>1</sup> | [Amazon Bedrock (bedrock-runtime)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview?sdk_languages=cli), [Claude Mythos 5.2](https://platform.claude.com/docs/en/models/mythos-5-2/overview?sdk_languages=cli), [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli) |
| Beta             | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli)                                                                                                                     | [Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview?sdk_languages=cli), [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview?sdk_languages=cli), [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli), [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli)     |
| Beta             | Claude API, [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry (hosted on Anthropic)](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli)                                                                                                                                                                                                                                                                                   | [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=cli)                                                                                                                                                                                                                                                                                                              |
| Beta             | Claude API, [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry (hosted on Anthropic)](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli)                                                                                                                                                                                                                         | [Claude Mythos 5.2](https://platform.claude.com/docs/en/models/mythos-5-2/overview?sdk_languages=cli)                                                                                                                                                                                                                                                                                                              |

1. Send the beta value in the `anthropic_beta` array of the request body.

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Not available
* Usage: Instead, set effort for a session by overriding the agent’s model settings.

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `mid-conversation-output-config-2026-07-01`
