# Sora 2

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Flagship video generation with synced audio

Model ID: `sora-2`

Sora 2 is our new powerful media generation model, generating videos with synced audio.
It can create richly detailed, dynamic clips from natural language or images.

## Model details

- Default snapshot: `sora-2-2025-12-08`
- Input modalities: text, image
- Output modalities: video, audio

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Video generation

| Metric | Price | Unit |
| --- | ---: | --- |
| Portrait: 720x1280
Landscape: 1280x720 | $0.1 | second |

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
| Videos | `v1/videos` | Supported |
| Image edit | `v1/images/edits` | Not supported |
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Quick comparison

| Model | Portrait: 720x1280
Landscape: 1280x720 | Portrait: 1024x1792
Landscape: 1792x1024 | Portrait: 1080x1920
Landscape: 1920x1080 |
| --- | ---: | ---: | ---: |
| Sora 2 | $0.1 | - | - |
| Sora 2 Pro | $0.3 | $0.5 | $0.7 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for Sora 2.

- `sora-2-2025-12-08`
- `sora-2-2025-10-06`
- `sora-2`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### Standard RPM

| Tier | RPM |
| --- | ---: |
| Tier 1 | 25 |
| Tier 2 | 50 |
| Tier 3 | 125 |
| Tier 4 | 200 |
| Tier 5 | 375 |
