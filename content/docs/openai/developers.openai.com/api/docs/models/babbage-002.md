# babbage-002

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Replacement for the GPT-3 ada and babbage base models

Model ID: `babbage-002`

GPT base models can understand and generate natural language or code but are not trained with instruction following. These models are made to be replacements for our original GPT-3 base models and use the legacy Completions API. Most customers should use GPT-3.5 or GPT-4.

## Model details

- Default snapshot: `babbage-002`
- Input modalities: text
- Output modalities: text
- 16,384 max output tokens
- Sep 01, 2021 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $0.4 | 1M tokens |
| Output | $0.4 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
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
| Completions (legacy) | `v1/completions` | Supported |

## Supported features

- fine_tuning

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| babbage-002 | $0.4 | - | $0.4 |
| GPT-4o mini | $0.15 | $0.075 | $0.6 |
| GPT-4o | $2.5 | $1.25 | $10 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for babbage-002.

- `babbage-002`

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
