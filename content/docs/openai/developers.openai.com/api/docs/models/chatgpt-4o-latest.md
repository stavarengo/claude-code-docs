# ChatGPT-4o

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> GPT-4o model used in ChatGPT

Model ID: `chatgpt-4o-latest`

ChatGPT-4o was a model alias for the GPT-4o snapshot used in ChatGPT. It has been deprecated and removed from the API. We recommend using [GPT-5.6](/api/docs/models/gpt-5.6-sol) for most API integrations.

## Model details

- Default snapshot: `chatgpt-4o-latest`
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
| Input | $5 | 1M tokens |
| Output | $15 | 1M tokens |

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

- streaming
- predicted_outputs
- image_input

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| ChatGPT-4o | $5 | - | $15 |
| GPT-4o | $2.5 | $1.25 | $10 |
| GPT-4o mini | $0.15 | $0.075 | $0.6 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for ChatGPT-4o.

- `chatgpt-4o-latest`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 30,000 | 90,000 |
| Tier 2 | 5,000 | 450,000 | 1,350,000 |
| Tier 3 | 5,000 | 800,000 | 50,000,000 |
| Tier 4 | 10,000 | 2,000,000 | 200,000,000 |
| Tier 5 | 10,000 | 30,000,000 | 5,000,000,000 |
