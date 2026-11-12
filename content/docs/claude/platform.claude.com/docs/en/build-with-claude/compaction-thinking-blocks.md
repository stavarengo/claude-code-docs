---
title: Compaction and preserved thinking
url: https://platform.claude.com/docs/en/build-with-claude/compaction-thinking-blocks
description: When thinking blocks in turns kept after on-demand compaction stay valid on models with preserved thinking, and how to check.
featureMetadata:
  status: beta
  betaHeader: compact-2026-09-04
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
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
  supportedPlatforms:
    Claude API: beta
    Claude Platform on AWS: beta
    Claude Models on Google Cloud (Google managed): beta
    Microsoft Foundry: beta
---

Skip this page unless you send thinking blocks back to a model with [preserved thinking](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli) and keep turns after the compaction block. Kept turns are the turns that follow the block. They’re either recent turns you left out of the compaction request, as in [Compaction that keeps recent turns](https://platform.claude.com/docs/en/build-with-claude/compaction-keep-recent-turns?sdk_languages=cli), or turns that arrived while the API was writing the summary, as in [Compaction in the background](https://platform.claude.com/docs/en/build-with-claude/compaction-background?sdk_languages=cli).

Models with preserved thinking check earlier thinking blocks against the conversation that produced them. A summary replaces part of that conversation, but the check accepts the swap when the API wrote the summary, so the thinking in kept turns can stay valid.

## Conditions for kept thinking to stay valid

The thinking blocks in kept turns stay valid while all of these hold:

* **The compaction request runs on a model with preserved thinking.** This condition covers every compaction request since a thinking block was produced, not only the most recent one. One way to meet it is to send every compaction request to the model the conversation uses.
* **The kept turns directly follow the summarized messages, and you send them unchanged.** Send each kept message exactly as it is in your history. Don’t skip or add a message between the last summarized message and the first kept one. The first kept message must also have a different role from the last summarized message, and it can’t be a mid-conversation `role: "system"` message. Otherwise, the API merges it into the last summarized message. One way to get the first kept message right is to compact exactly the `messages` of a request you already sent. The kept turns then start with Claude’s reply to it.
* **`system` and `tools` don’t change.** They are the same on the compaction request as on the requests that produced the kept thinking, and they stay the same on the requests that follow. The exception is a tool marked `defer_loading: true` that nothing in the conversation has referenced. [Change the system prompt or tools](https://platform.claude.com/docs/en/build-with-claude/compaction-thinking-blocks?sdk_languages=cli#change-the-system-prompt-or-tools) covers how to change them safely.

If a condition doesn’t hold, the API still accepts the compaction block on later requests. What fails is the kept thinking, on the first later request that sends it. The compaction request runs the same check on the thinking blocks it carries, so a changed `system` or `tools`, or an edited message, can fail that request too. [What the API does with an invalid block](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#mismatch-behavior) describes what happens then, and [When `prefix_mismatch_behavior` is unset](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#enforcement) covers requests that don’t set the field, including Message Batches items.

## Compact again without breaking older thinking

You can [compact again](https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand?sdk_languages=cli#compact-again) and keep turns: the new block covers the old summary and every message that follows it in the compaction request, and any turns you leave out of that request are kept turns of the new block.

The first of the [conditions for kept thinking](https://platform.claude.com/docs/en/build-with-claude/compaction-thinking-blocks?sdk_languages=cli#conditions-for-kept-thinking-to-stay-valid) counts every compaction since a thinking block was produced, so a turn that you keep through two compactions needs both to have run on a model with preserved thinking.

Compactions from before a thinking block was produced don’t count against it. Thinking produced after a block is in place is bound to that block, and it stays valid through later compactions that meet the conditions.

## Change the system prompt or tools

A later request can use a different `system`, different `tools`, or a different model from the compaction request, and the API still accepts the block. Such a change can invalidate the thinking in the kept turns, but it has no other effect.

To change `system` or `tools` without invalidating any kept thinking, compact the whole conversation first, so no turns are kept. Then change them on the next request.

To add an instruction or change the available tools without touching `system` or `tools`, append the change to `messages`, as described in [Make changes without editing the prefix](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#replace-prefix-edits).

The summarized turns can include mid-conversation system messages, which are `role: "system"` entries in `messages` (see [Mid-conversation system messages and tool changes](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli)). They’re summarized with the rest. What happens next depends on what a message carried:

* **Text instructions** stop applying.
* **A [per-message effort](https://platform.claude.com/docs/en/build-with-claude/effort-per-message?sdk_languages=cli) level** stops applying too. Turns then run at the request’s top-level `output_config.effort`. If the request sets none, they run at the model’s default. A later message can set a level again.
* **Tool changes** can carry over. See the steps that follow.

To carry tool changes over:

1. Send the `inline-tools-2026-09-15` beta header on the compaction request. The returned block then records the changes in a `tool_changes` field.
2. Send the block back unmodified. The API then applies the recorded changes on each request that includes the block. If the field is missing, the API accepts the block but applies nothing.
3. Send the same header on every request that includes the block.

If the summarized turns changed your tools and the returned block has no `tool_changes` field, the changes weren’t recorded. State them again, as described next.

You can state an instruction, an effort level, or a tool change again. Put it in a `role: "system"` message at the end of your next request, directly after the `user` message. The request’s `messages` then run in this order:

1. The compaction block.
2. The kept turns, if any.
3. Your `user` message.
4. The `role: "system"` message.

On later requests, leave those entries as they are, and add new turns after the system message.

Don’t put the system message before or between the kept turns. There, it invalidates every kept thinking block that comes after it.

## Check that the kept thinking held

The compaction response doesn’t say whether the kept thinking holds. The first request after the swap does. To check in your tests:

1. Have a short conversation with thinking on. Use a model that runs the prefix check (see [Keeping the prefix unchanged](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#prefix-check)), and use it for every step, because a model that can’t read a thinking block drops it with no error.
2. Compact the older turns, and keep at least one turn that holds a thinking block.
3. Send the next request, with the block first, then the kept turn, then a new `user` message, and with `thinking.block_binding.prefix_mismatch_behavior` set to `"error"`.
4. Read the result. A 200 response whose `input_transformations` array is empty means no thinking block failed the check or was dropped. A 400 error that says the block is bound to a different conversation means one did. The message starts with the path of the first block that failed, and [What the API does with an invalid block](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#mismatch-behavior) shows it in full.

The `prefix_mismatch_behavior` field needs the `thinking-binding-controls-2026-08-01` beta header in addition to the [`compact-2026-09-04` beta header](https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand?sdk_languages=cli#request-a-summary). The value a request sets applies on any account.

The following program runs the four steps. It prints how many thinking blocks the kept turn holds and how many entries `input_transformations` has; no entries means the kept thinking held:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the Anthropic SDK to run it.
  </CodeGroupItem>
</CodeGroup>

```text Output wrap
Thinking blocks in the kept turn: 1
Dropped thinking blocks: 0
```

In production, `"drop_block"` keeps requests succeeding when a condition doesn’t hold. The response lists each dropped block in `input_transformations` with `reason: "prefix_binding_mismatch"`. An entry whose `path` falls in a kept turn means a condition didn’t hold for that turn’s thinking. [What the API does with an invalid block](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=cli#mismatch-behavior) describes what is dropped and says how to alert on it. On Claude Sonnet 5.5 and Claude Haiku 5.5, `block_binding` works only with `thinking: {"type": "adaptive"}`. With any other thinking setting on those models, you can’t send `block_binding`, so make sure every condition holds or strip the `thinking` and `redacted_thinking` blocks from the kept turns.

## Availability

Compaction and preserved thinking are in beta on select models.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Available

| Status | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                        | Models                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta   | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) | [Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview?sdk_languages=cli), [Claude Mythos 5.2](https://platform.claude.com/docs/en/models/mythos-5-2/overview?sdk_languages=cli), [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=cli), [Claude Fable 5](https://platform.claude.com/docs/en/models/fable-5/overview?sdk_languages=cli), [Claude Mythos 5](https://platform.claude.com/docs/en/models/mythos-5/overview?sdk_languages=cli), Claude Mythos Preview, [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli), [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview?sdk_languages=cli), [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli), [Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/overview?sdk_languages=cli), [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli), [Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-4-8/overview?sdk_languages=cli), [Claude Opus 4.7](https://platform.claude.com/docs/en/models/opus-4-7/overview?sdk_languages=cli), [Claude Opus 4.6](https://platform.claude.com/docs/en/models/opus-4-6/overview?sdk_languages=cli), [Claude Sonnet 4.6](https://platform.claude.com/docs/en/models/sonnet-4-6/overview?sdk_languages=cli) |

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `compact-2026-09-04`
