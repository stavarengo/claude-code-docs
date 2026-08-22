# GPT-Live-Transcribe

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Low-latency speech-to-text model for realtime transcription

Model ID: `gpt-live-transcribe`

GPT Live Transcribe is a streaming speech-to-text model for applications that need low-latency transcript deltas from live audio. It supports tunable latency, unstructured context, keyword hints, and multiple language hints.

## Model details

- Default snapshot: `gpt-live-transcribe`
- Input modalities: audio, text
- Output modalities: text

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Realtime audio duration

| Metric | Price | Unit |
| --- | ---: | --- |
| Price | $0.017 | minute |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Not supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Supported |
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

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-Live-Transcribe.

- `gpt-live-transcribe`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM |
| --- | ---: | ---: |
| Tier 1 | 500 | 60,000 |
| Tier 2 | 2,000 | 210,000 |
| Tier 3 | 5,000 | 390,000 |
| Tier 4 | 10,000 | 600,000 |
| Tier 5 | 10,000 | 780,000 |
