# gpt-3.5-turbo-instruct

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> An older model only compatible with the legacy Completions endpoint

Model ID: `gpt-3.5-turbo-instruct`

Similar capabilities as GPT-3 era models. Compatible with legacy Completions endpoint and not Chat Completions.

## Model details

- Default snapshot: `gpt-3.5-turbo-instruct`
- Input modalities: text
- Output modalities: text
- 4,096 context window
- 4,096 max output tokens
- Sep 01, 2021 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $1.5 | 1M tokens |
| Output | $2 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Supported |
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

- fine_tuning

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| gpt-3.5-turbo-instruct | $1.5 | - | $2 |
| GPT-4o mini | $0.15 | $0.075 | $0.6 |
| o3-mini | $1.1 | $0.55 | $4.4 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for gpt-3.5-turbo-instruct.

- `gpt-3.5-turbo-instruct`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | RPD | TPM | Batch queue limit |
| --- | ---: | ---: | ---: | ---: |
| Tier 1 | 3,500 | 10,000 | 200,000 | 2,000,000 |
| Tier 2 | 3,500 | - | 2,000,000 | 5,000,000 |
| Tier 3 | 3,500 | - | 800,000 | 50,000,000 |
| Tier 4 | 10,000 | - | 10,000,000 | 1,000,000,000 |
| Tier 5 | 10,000 | - | 50,000,000 | 10,000,000,000 |
