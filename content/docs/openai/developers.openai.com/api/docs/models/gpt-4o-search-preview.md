# GPT-4o Search Preview

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> GPT model for web search in Chat Completions

Model ID: `gpt-4o-search-preview`

GPT-4o Search Preview is a specialized model trained to understand and execute [web search](/api/docs/guides/tools-web-search?api-mode=chat) queries with the Chat Completions API. In addition to token fees, web search queries have a fee per tool call. Learn more in the [pricing](/api/docs/pricing) page.

## Model details

- Default snapshot: `gpt-4o-search-preview-2025-03-11`
- Input modalities: text
- Output modalities: text
- 128,000 context window
- 16,384 max output tokens
- Oct 01, 2023 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $2.5 | 1M tokens |
| Output | $10 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Supported |
| Responses | `v1/responses` | Not supported |
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
- structured_outputs
- image_input

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-4o Search Preview | $2.5 | - | $10 |
| GPT-4o Mini | $0.15 | $0.075 | $0.6 |
| GPT-4o | $2.5 | $1.25 | $10 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4o Search Preview.

- `gpt-4o-search-preview-2025-03-11`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 100 | 30,000 | 0 |
| Tier 2 | 500 | 45,000 | 0 |
| Tier 3 | 500 | 80,000 | 0 |
| Tier 4 | 1,000 | 200,000 | 0 |
| Tier 5 | 1,000 | 3,000,000 | 0 |
