# GPT-5.5 Pro

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Version of GPT-5.5 that produces smarter and more precise responses.

Model ID: `gpt-5.5-pro`

GPT-5.5 Pro uses more compute to think harder and provide consistently better answers.

GPT-5.5 Pro is available for Responses API requests, including through the Batch API, to enable support for multi-turn model interactions before responding to API requests and other advanced API features in the future. Since GPT-5.5 Pro is designed to tackle tough problems, some requests may take several minutes to finish. To avoid timeouts, try using [background mode](/api/docs/guides/background). Reasoning.effort supports: medium, high (default) and xhigh.

## Model details

- Default snapshot: `gpt-5.5-pro-2026-04-23`
- Input modalities: text, image
- Output modalities: text
- 1,050,000 context window
- 128,000 max output tokens
- Dec 01, 2025 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $30 | 1M tokens |
| Output | $180 | 1M tokens |

- GPT-5.5 Pro does not offer a cached input discount.
- Regional processing (data residency) endpoints are charged a 10% uplift for GPT-5.5 Pro.

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Not supported |
| Assistants | `v1/assistants` | Not supported |
| Batch | `v1/batch` | Supported |
| Fine-tuning | `v1/fine-tuning` | Not supported |
| Embeddings | `v1/embeddings` | Not supported |
| Image generation | `v1/images/generations` | Not supported |
| Videos | `v1/videos` | Not supported |
| Image edit | `v1/images/edits` | Not supported |
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Supported features

- structured_outputs
- function_calling
- file_search
- image_input
- image_generation
- mcp
- web_search

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- web_search
- file_search
- image_generation
- code_interpreter
- hosted_shell
- mcp

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-5.5 Pro | $30 | - | $180 |
| GPT-5.5 | $5 | $0.5 | $30 |
| GPT-5.4 Pro | $30 | - | $180 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-5.5 Pro.

- `gpt-5.5-pro-2026-04-23`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 50 | 50,000 | 500,000 |
| Tier 2 | 500 | 200,000 | 1,000,000 |
| Tier 3 | 500 | 500,000 | 10,000,000 |
| Tier 4 | 1,000 | 1,000,000 | 20,000,000 |
| Tier 5 | 2,000 | 4,000,000 | 1,500,000,000 |
