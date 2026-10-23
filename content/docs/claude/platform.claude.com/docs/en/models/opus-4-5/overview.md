---
title: Claude Opus 4.5
url: https://platform.claude.com/docs/en/models/opus-4-5/overview
description: "Claude Opus 4.5 reference: lifecycle status, model IDs on every platform, context window, output limits, pricing, and migration resources. Claude Opus 4.5 is a legacy model; Claude Opus 5.5 is the current Opus model."
---

**Legacy.** Released November 24, 2025.

Although Claude Opus 4.5 is still available, you should consider migrating to Claude Opus 5.5. [See Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli) · [Migrate to Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide?sdk_languages=cli#migrating-from-claude-opus-45)

Model ID: `claude-opus-4-5-20251101`

Context window: 200K tokens · Max output: 64K tokens · Input pricing: $5 / MTok · Output pricing: $25 / MTok

[Announcement](https://www.anthropic.com/news/claude-opus-4-5)

## How it compares to the current lineup

| Model                                                                                                 | Context | Max output | Price / MTok       | Thinking             | Default effort | Knowledge cutoff |
| :---------------------------------------------------------------------------------------------------- | :------ | :--------- | :----------------- | :------------------- | :------------- | :--------------- |
| [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli)   | 1M      | 128K       | $10 / $50          | Adaptive (always on) | `high`         | Jun 2026         |
| [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli)     | 1M      | 128K       | $4 / $20           | Adaptive (always on) | `medium`       | Jun 2026         |
| **Claude Opus 4.5** (this model)                                                                      | 200K    | 64K        | $5 / $25           | Extended             | `high`         | May 2025         |
| [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli) | 1M      | 128K       | $2 / $10           | Adaptive             | `high`         | Jun 2026         |
| [Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview?sdk_languages=cli)   | 1M      | 128K       | From $0.10 / $0.50 | Adaptive             | `medium`       | Jun 2026         |

* **Context:** 1M tokens is roughly 555k words or 2.5M Unicode characters on the current tokenizer (introduced with Claude Opus 4.7); models before it fit about 750k words in 1M tokens. 200k tokens is roughly 150k words.
* **Max output:** Synchronous Messages API limit. On the Message Batches API, Claude Opus 5.5, Claude Opus 5, Claude Sonnet 5.5, Claude Sonnet 5, Claude Haiku 5.5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6 support up to 300k output tokens with the output-300k-2026-03-24 beta header.
* **Price / MTok:** Input / output, base price per million tokens. Batch API requests are 50% off; prompt caching reads cost 10% of the base input price (2.5% on Claude Fable 5.1 and Claude Mythos 5.1, 5% on Claude Opus 5.5 and Claude Sonnet 5.5). See Pricing for the full list.
* **Thinking:** Adaptive thinking lets the model decide how much to think, steered by effort. Extended thinking is the manual budget\_tokens mode on earlier models.
* **Default effort:** The effort parameter’s default on the Claude API. Models without a value don’t support the parameter.
* **Knowledge cutoff:** Reliable knowledge cutoff: the date through which the model’s knowledge is most extensive and reliable.

## Specifications

### Model IDs

| Platform                                                                                                                                                                     | Model ID                                  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- |
| Claude API                                                                                                                                                                   | `claude-opus-4-5-20251101`                |
| Claude API alias                                                                                                                                                             | `claude-opus-4-5`                         |
| [Amazon Bedrock (InvokeModel)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli)                                      | `anthropic.claude-opus-4-5-20251101-v1:0` |
| [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli)       | `claude-opus-4-5@20251101`                |
| [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli)                                                     | `claude-opus-4-5`                         |
| [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli)                                                     | `claude-opus-4-5`                         |
| [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) | `claude-opus-4-5-20251101`                |

### Pricing

| Feature                                                                                                  | Value                            |
| :------------------------------------------------------------------------------------------------------- | :------------------------------- |
| Input                                                                                                    | $5 / MTok                        |
| Output                                                                                                   | $25 / MTok                       |
| [5m cache write](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) | $6.25 / MTok                     |
| [1h cache write](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) | $10 / MTok                       |
| [Cache read](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli)     | $0.50 / MTok                     |
| [Batch API](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli)    | 50% discount on input and output |

[Full price list](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli)

### Capabilities

| Feature                                                                                                   | Value                  |
| :-------------------------------------------------------------------------------------------------------- | :--------------------- |
| [Context window](https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli) | 200K tokens            |
| Max output                                                                                                | 64K tokens             |
| [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli)              | Extended               |
| [Default effort](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli)          | `high`                 |
| Input → output                                                                                            | Text and images → text |
| Reliable knowledge cutoff                                                                                 | May 2025               |
| Training data cutoff                                                                                      | Aug 2025               |

### Availability

| Feature                                                                                         | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Status](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli) | Active (legacy)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Released                                                                                        | November 24, 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Retirement                                                                                      | Not sooner than November 24, 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Platforms                                                                                       | Claude API, [Amazon Bedrock (InvokeModel)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli), [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) |

## Resources

<CardGroup cols={3}>
  <Card title="Migrate to Claude Opus 5.5" icon="arrows-left-right" href="https://platform.claude.com/docs/en/models/opus-5-5/migration-guide?sdk_languages=cli#migrating-from-claude-opus-45">
    What changes when moving from Claude Opus 4.5 to Claude Opus 5.5.
  </Card>

  <Card title="Claude Opus 5.5" icon="arrow-right" href="https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli">
    The current Opus model: overview, specs, and resources.
  </Card>
</CardGroup>

## Reference

<CardGroup cols={3}>
  <Card title="System prompt" icon="text" href="https://platform.claude.com/docs/en/release-notes/system-prompts/overview?sdk_languages=cli#claude-opus-4-5">
    The system prompt Claude Opus 4.5 uses on claude.ai and the Claude apps.
  </Card>

  <Card title="System card" icon="file" href="https://www.anthropic.com/claude-opus-4-5-system-card">
    Safety evaluations and deployment decisions for Claude Opus 4.5.
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

  <Card title="Amazon Bedrock (Opus 4.6 and earlier)" icon="cloud" href="https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli">
    Claude Opus 4.5 uses the InvokeModel Bedrock integration and Bedrock-style model IDs.
  </Card>
</CardGroup>
