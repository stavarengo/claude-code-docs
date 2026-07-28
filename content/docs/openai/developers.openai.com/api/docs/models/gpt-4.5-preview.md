# GPT-4.5 Preview

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Deprecated large model.

Model ID: `gpt-4.5-preview`

Deprecated - a research preview of GPT-4.5. We recommend using gpt-4.1 or o3 
models instead for most use cases

## Model details

- Default snapshot: `gpt-4.5-preview-2025-02-27`
- Input modalities: text, image
- Output modalities: text
- 128,000 context window
- 16,384 max output tokens
- Oct 01, 2023 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $75 | 1M tokens |
| Cached input | $37.5 | 1M tokens |
| Output | $150 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Supported |
| Responses | `v1/responses` | Supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Not supported |
| Assistants | `v1/assistants` | Supported |
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

- function_calling
- structured_outputs
- streaming
- system_messages
- evals
- prompt_caching
- image_input

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-4.5 Preview | $75 | $37.5 | $150 |
| GPT-4.1 | $2 | $0.5 | $8 |
| o3 | $2 | $0.5 | $8 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4.5 Preview.

- `gpt-4.5-preview-2025-02-27`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 1,000 | 125,000 | 50,000 |
| Tier 2 | 5,000 | 250,000 | 500,000 |
| Tier 3 | 5,000 | 500,000 | 50,000,000 |
| Tier 4 | 10,000 | 1,000,000 | 100,000,000 |
| Tier 5 | 10,000 | 2,000,000 | 5,000,000,000 |
