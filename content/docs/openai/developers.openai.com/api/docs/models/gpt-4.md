# GPT-4

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> An older high-intelligence GPT model

Model ID: `gpt-4`

GPT-4 is an older version of a high-intelligence GPT model, usable in Chat Completions.

## Model details

- Default snapshot: `gpt-4-0613`
- Input modalities: text
- Output modalities: text
- 8,192 context window
- 8,192 max output tokens
- Dec 01, 2023 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $30 | 1M tokens |
| Output | $60 | 1M tokens |

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
| Fine-tuning | `v1/fine-tuning` | Supported |
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

- fine_tuning
- streaming

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-4 | $30 | - | $60 |
| GPT-4o Mini | $0.15 | $0.075 | $0.6 |
| o3-mini | $1.1 | $0.55 | $4.4 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4.

- `gpt-4-0613`
- `gpt-4-0314`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | RPD | TPM | Batch queue limit |
| --- | ---: | ---: | ---: | ---: |
| Tier 1 | 500 | 10,000 | 10,000 | 100,000 |
| Tier 2 | 5,000 | - | 40,000 | 200,000 |
| Tier 3 | 5,000 | - | 80,000 | 5,000,000 |
| Tier 4 | 10,000 | - | 300,000 | 30,000,000 |
| Tier 5 | 10,000 | - | 1,000,000 | 150,000,000 |
