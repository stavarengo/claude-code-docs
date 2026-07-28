# GPT-Realtime-Whisper

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Streaming speech-to-text model for realtime transcription

Model ID: `gpt-realtime-whisper`

GPT-Realtime-Whisper is a streaming speech-to-text model for applications that need low-latency transcript deltas from live audio. It is designed for realtime use cases where developers need to tune latency and accuracy. GPT-Realtime-Whisper is priced by audio duration rather than text tokens.

## Model details

- Default snapshot: `gpt-realtime-whisper`
- Input modalities: audio, text
- Output modalities: text
- 16,000 context window
- 2,000 max output tokens
- Sep 30, 2024 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Realtime audio duration

| Metric | Price | Unit |
| --- | ---: | --- |
| Price | $0.017 | minute |

- GPT-Realtime-Whisper is priced by audio duration rather than text tokens.

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

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-Realtime-Whisper.

- `gpt-realtime-whisper`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | Minutes-of-audio per minute |
| --- | ---: |
| Tier 1 | 100 |
| Tier 2 | 350 |
| Tier 3 | 650 |
| Tier 4 | 1,000 |
| Tier 5 | 1,300 |
