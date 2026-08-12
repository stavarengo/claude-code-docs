# GPT-5.4 Pro

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Version of GPT-5.4 that produces smarter and more precise responses.

Model ID: `gpt-5.4-pro`

GPT-5.4 Pro uses more compute to think harder and provide consistently better answers.

GPT-5.4 Pro is available in the Responses API only to enable support for multi-turn model interactions before responding to API requests, and other advanced API features in the future. Since GPT-5.4 Pro is designed to tackle tough problems, some requests may take several minutes to finish. To avoid timeouts, try using [background mode](/api/docs/guides/background). Reasoning.effort supports: medium (default), high and xhigh.

## Model details

- Default snapshot: `gpt-5.4-pro-2026-03-05`
- Input modalities: text, image
- Output modalities: text
- 1,050,000 context window
- 128,000 max output tokens
- Aug 31, 2025 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $30 | 1M tokens |
| Output | $180 | 1M tokens |

- For models with a 1.05M context window (GPT-5.4 and GPT-5.4 Pro), prompts with >272K input tokens are priced at 2x input and 1.5x output for the full session for standard, batch, and flex.
- Regional processing (data residency) endpoints are charged a 10% uplift for GPT-5.4 and GPT-5.4 Pro.

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Not supported |
| Assistants | `v1/assistants` | Not supported |
| Batch | `v1/batch` | Not supported |
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

- streaming
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
- tool_search
- image_generation
- apply_patch
- computer_use
- mcp

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-5.4 Pro | $30 | - | $180 |
| GPT-5.4 | $2.5 | $0.25 | $15 |
| o3-pro | $20 | - | $80 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-5.4 Pro.

- `gpt-5.4-pro-2026-03-05`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### Standard

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 50 | 50,000 | 900,000 |
| Tier 2 | 500 | 100,000 | 1,350,000 |
| Tier 3 | 500 | 200,000 | 100,000,000 |
| Tier 4 | 1,000 | 400,000 | 200,000,000 |
| Tier 5 | 1,500 | 4,000,000 | 15,000,000,000 |

### Long Context

> 272K input tokens

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 20 | 40,000 | 2,000,000 |
| Tier 2 | 50 | 100,000 | 20,000,000 |
| Tier 3 | 100 | 200,000 | 40,000,000 |
| Tier 4 | 200 | 1,000,000 | 100,000,000 |
| Tier 5 | 800 | 2,000,000 | 1,000,000,000 |
