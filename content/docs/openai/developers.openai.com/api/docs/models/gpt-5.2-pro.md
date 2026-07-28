# GPT-5.2 Pro

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Previous pro model for professional work that produces smarter and more precise responses.

Model ID: `gpt-5.2-pro`

GPT-5.2 Pro is our previous pro model for complex professional work.
We recommend using [GPT-5.5 Pro](/api/docs/models/gpt-5.5-pro) for the latest pro model. GPT-5.2 Pro is available in the Responses API only to enable support for multi-turn model interactions before responding to API requests, and other advanced API features in the future. Since GPT-5.2 Pro is designed to tackle tough problems, some requests may take several minutes to finish. To avoid timeouts, try using background mode. GPT-5.2 Pro supports reasoning.effort: medium, high, xhigh.

## Model details

- Default snapshot: `gpt-5.2-pro-2025-12-11`
- Input modalities: text, image
- Output modalities: text
- 400,000 context window
- 128,000 max output tokens
- Aug 31, 2025 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $21 | 1M tokens |
| Output | $168 | 1M tokens |

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
- file_search
- image_generation
- mcp
- web_search

## Quick comparison

| Model | Input | Output |
| --- | ---: | ---: |
| GPT-5.2 Pro | $21 | $168 |
| GPT-5.4 Pro | $30 | $180 |
| o3-pro | $20 | $80 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-5.2 Pro.

- `gpt-5.2-pro-2025-12-11`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### Standard

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 30,000 | 90,000 |
| Tier 2 | 5,000 | 450,000 | 1,350,000 |
| Tier 3 | 5,000 | 800,000 | 50,000,000 |
| Tier 4 | 10,000 | 2,000,000 | 200,000,000 |
| Tier 5 | 10,000 | 30,000,000 | 5,000,000,000 |

### Long Context

> 128k input tokens

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 100 | 200,000 | 2,000,000 |
| Tier 2 | 250 | 500,000 | 20,000,000 |
| Tier 3 | 500 | 1,000,000 | 40,000,000 |
| Tier 4 | 1,000 | 5,000,000 | 100,000,000 |
| Tier 5 | 4,000 | 10,000,000 | 1,000,000,000 |
