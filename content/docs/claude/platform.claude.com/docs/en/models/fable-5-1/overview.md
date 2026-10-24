---
title: Claude Fable 5.1
url: https://platform.claude.com/docs/en/models/fable-5-1/overview
description: "An overview of Claude Fable 5.1: what it's for, model IDs on every platform, context window, output limits, pricing, availability, and resources for building with it."
---

**Latest.** Released September 1, 2026.

For demanding reasoning and long-horizon agentic work

Model ID: `claude-fable-5-1`

Context window: 1M tokens · Max output: 128K tokens · Input pricing: $10 / MTok · Output pricing: $50 / MTok

[Announcement](https://www.anthropic.com/claude-fable-and-mythos-5-1) · [What’s new](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli) · [Migration guide](https://platform.claude.com/docs/en/models/fable-5-1/migration-guide?sdk_languages=cli)

## Overview

Claude Fable 5.1 extends Claude Fable 5 at the same input and output prices, with cache reads at a quarter of the cost, and brings stronger long-running agentic coding, multistep research, and document, spreadsheet, and slide work. For most workloads, start with Claude Opus 5.5 (see [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model?sdk_languages=cli)). Use Claude Fable 5.1 for demanding reasoning and long-horizon agentic work, or when your evals on Claude Opus 5.5 at higher effort still don't meet your requirements. Claude Mythos 5.1 offers the same capabilities only to organizations verified through Anthropic's verification programs, such as the [Cyber Verification Program](https://support.claude.com/en/articles/14604842).

If you already call Claude Fable 5, four changes are breaking:

* [Forced tool use returns an error](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#forced-tool-use-is-not-supported).
* Only Claude Fable 5.1 and Claude Mythos 5.1 can [read Claude Fable 5.1's thinking blocks](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#thinking-blocks-are-tied-to-the-model-that-produced-them).
* [Editing earlier turns invalidates thinking blocks](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#editing-earlier-turns-invalidates-thinking-blocks).
* [Some advisor tool pairings are not supported](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#advisor-tool-pairings).

Five changes are additive:

* [Mid-conversation effort changes](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#change-effort-mid-conversation-beta) (beta)
* [Turn-scoped system messages](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#turn-scoped-system-messages-beta) (beta)
* [Readable progress updates between tool calls](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#progress-updates-between-tool-calls-beta) (`display: "updates"`, beta)
* A [lower cache read price](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#pricing)
* [Content provenance](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli#content-provenance)

[What's new in Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1?sdk_languages=cli)

## Claude Fable 5.1 and Claude Mythos 5.1

[Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=cli) offers the same capabilities only to organizations verified through Anthropic's verification programs, such as the [Cyber Verification Program](https://support.claude.com/en/articles/14604842). It shares Claude Fable 5.1's specifications and pricing. To request access, apply to the program that covers your use case, or contact your Anthropic, AWS, or Google Cloud account team.

## How it compares

| Model                                                                                                 | Context | Max output | Price / MTok       | Latency  | Thinking             | Default effort | Knowledge cutoff |
| :---------------------------------------------------------------------------------------------------- | :------ | :--------- | :----------------- | :------- | :------------------- | :------------- | :--------------- |
| **Claude Fable 5.1** (this model)                                                                     | 1M      | 128K       | $10 / $50          | Slower   | Adaptive (always on) | `high`         | Jun 2026         |
| [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli)     | 1M      | 128K       | $4 / $20           | Moderate | Adaptive (always on) | `medium`       | Jun 2026         |
| [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli) | 1M      | 128K       | $2 / $10           | Fast     | Adaptive             | `high`         | Jun 2026         |
| [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli)   | 1M      | 128K       | From $0.10 / $0.50 | Fastest  | Adaptive             | `medium`       | Jun 2026         |

* **Context:** 1M tokens is roughly 555k words or 2.5M Unicode characters on the current tokenizer (introduced with Claude Opus 4.7); models before it fit about 750k words in 1M tokens. 200k tokens is roughly 150k words.
* **Max output:** Synchronous Messages API limit. On the Message Batches API, Claude Opus 5.5, Claude Opus 5, Claude Sonnet 5.5, Claude Sonnet 5, Claude Haiku 5.5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6 support up to 300k output tokens with the output-300k-2026-03-24 beta header.
* **Price / MTok:** Input / output, base price per million tokens. Batch API requests are 50% off; prompt caching reads cost 10% of the base input price (2.5% on Claude Fable 5.1 and Claude Mythos 5.1, 5% on Claude Opus 5.5 and Claude Sonnet 5.5). See Pricing for the full list.
* **Latency:** Comparative latency, relative to the current lineup, as published in the models overview. Actual latency depends on prompt length, output length, and thinking effort.
* **Thinking:** Adaptive thinking lets the model decide how much to think, steered by effort. Extended thinking is the manual budget\_tokens mode on earlier models.
* **Default effort:** The effort parameter’s default on the Claude API. Models without a value don’t support the parameter.
* **Knowledge cutoff:** Reliable knowledge cutoff: the date through which the model’s knowledge is most extensive and reliable.

## Specifications

### Model IDs

| Platform                                                                                                                                                                     | Model ID                     |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| Claude API                                                                                                                                                                   | `claude-fable-5-1`           |
| [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli)                                                           | `anthropic.claude-fable-5-1` |
| [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli)       | `claude-fable-5-1`           |
| [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli)                                                     | `claude-fable-5-1`           |
| [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli)                                                     | `claude-fable-5-1`           |
| [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) | `claude-fable-5-1`           |

### Pricing

| Feature                                                                                                  | Value                            |
| :------------------------------------------------------------------------------------------------------- | :------------------------------- |
| Input                                                                                                    | $10 / MTok                       |
| Output                                                                                                   | $50 / MTok                       |
| [5m cache write](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) | $12.50 / MTok                    |
| [1h cache write](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) | $20 / MTok                       |
| [Cache read](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli)     | $0.25 / MTok                     |
| [Batch API](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli)    | 50% discount on input and output |

[Full price list](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli)

### Capabilities

| Feature                                                                                                   | Value                  |
| :-------------------------------------------------------------------------------------------------------- | :--------------------- |
| [Context window](https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli) | 1M tokens              |
| Max output                                                                                                | 128K tokens            |
| [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli)              | Adaptive (always on)   |
| [Default effort](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli)          | `high`                 |
| Comparative latency                                                                                       | Slower                 |
| Input → output                                                                                            | Text and images → text |
| Reliable knowledge cutoff                                                                                 | Jun 2026               |
| Training data cutoff                                                                                      | Jun 2026               |

### Availability

| Feature                                                                                         | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :---------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Status](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli) | Active (latest)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Released                                                                                        | September 1, 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Retirement                                                                                      | Not sooner than September 1, 2027                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Platforms                                                                                       | Claude API, [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli), [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) |

## Resources

<CardGroup cols={3}>
  <Card title="Prompting Claude Fable 5.1" icon="lightbulb" href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1?sdk_languages=cli">
    Model-specific prompting guidance for long-horizon and agentic work.
  </Card>

  <Card title="Claude Fable 5.1 migration guide" icon="arrow-right" href="https://platform.claude.com/docs/en/models/fable-5-1/migration-guide?sdk_languages=cli">
    What changes when you move from Claude Fable 5, Claude Opus 5, or Claude Opus 4.8.
  </Card>

  <Card title="Preserved thinking" icon="brain" href="https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#preserved-thinking">
    When this model's thinking blocks stay usable: across model switches and across changes to the conversation.
  </Card>

  <Card title="Per-message effort" icon="sliders" href="https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli#change-effort-mid-conversation-beta">
    Change the effort level partway through a conversation without invalidating the prompt cache.
  </Card>

  <Card title="Refusals and fallback" icon="shield" href="https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli">
    Handle classifier refusals and retry on another Claude model.
  </Card>

  <Card title="Adaptive thinking" icon="brain" href="https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli">
    The only thinking mode on Claude Fable 5.1. Steer depth with `effort`.
  </Card>
</CardGroup>

## Reference

<CardGroup cols={3}>
  <Card title="System prompt" icon="text" href="https://platform.claude.com/docs/en/release-notes/system-prompts/claude-fable-5-1?sdk_languages=cli">
    The system prompt Claude Fable 5.1 uses on claude.ai and the Claude apps.
  </Card>

  <Card title="System card" icon="file" href="https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card">
    Safety evaluations and deployment decisions for Claude Fable 5.1 and Claude Mythos 5.1.
  </Card>

  <Card title="Pricing" icon="coins" href="https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli">
    Full price list, including batch discounts and prompt caching rates.
  </Card>

  <Card title="Model IDs and versioning" icon="fingerprint" href="https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions?sdk_languages=cli">
    How model IDs, aliases, and pinned snapshots work.
  </Card>

  <Card title="Model deprecations" icon="clock" href="https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli">
    Lifecycle status and retirement commitments for every Claude model.
  </Card>
</CardGroup>
