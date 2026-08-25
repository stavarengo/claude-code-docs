# GPT-Realtime Mini

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> A cost-efficient version of GPT-Realtime

Model ID: `gpt-realtime-mini`

GPT-Realtime Mini is capable of responding to audio and text inputs in realtime over WebRTC, WebSocket, or SIP connections.

## Model details

- Default snapshot: `gpt-realtime-mini-2025-12-15`
- Input modalities: text, image, audio
- Output modalities: text, audio
- 32,000 context window
- 4,096 max output tokens
- Oct 01, 2023 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $0.6 | 1M tokens |
| Cached input | $0.06 | 1M tokens |
| Output | $2.4 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Not supported |
| Realtime | `v1/realtime` | Supported |
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

- function_calling
- prompt_caching

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-Realtime Mini | $0.6 | $0.06 | $2.4 |
| GPT-5 | $1.25 | $0.125 | $10 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-Realtime Mini.

- `gpt-realtime-mini-2025-10-06`
- `gpt-realtime-mini-2025-12-15`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM |
| --- | ---: | ---: |
| Tier 1 | 200 | 40,000 |
| Tier 2 | 400 | 200,000 |
| Tier 3 | 5,000 | 800,000 |
| Tier 4 | 10,000 | 4,000,000 |
| Tier 5 | 20,000 | 15,000,000 |
