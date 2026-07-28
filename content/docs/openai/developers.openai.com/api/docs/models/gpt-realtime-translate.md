# GPT-Realtime-Translate

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Streaming speech-to-speech translation model

Model ID: `gpt-realtime-translate`

GPT-Realtime-Translate is a streaming speech-to-speech translation model for live multilingual audio experiences. It uses a dedicated realtime translation endpoint and returns translated audio plus transcript deltas while source audio is still arriving. GPT-Realtime-Translate is priced by audio duration rather than text tokens.

## Model details

- Default snapshot: `gpt-realtime-translate`
- Input modalities: audio
- Output modalities: audio, text
- 16,000 context window
- 2,000 max output tokens
- Sep 30, 2024 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Realtime audio duration

| Metric | Price | Unit |
| --- | ---: | --- |
| Price | $0.034 | minute |

- GPT-Realtime-Translate is priced by audio duration rather than text tokens.

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Not supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Supported |
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

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-Realtime-Translate.

- `gpt-realtime-translate`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | Minutes-of-audio per minute |
| --- | ---: |
| Tier 1 | 50 |
| Tier 2 | 200 |
| Tier 3 | 400 |
| Tier 4 | 650 |
| Tier 5 | 850 |
