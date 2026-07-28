# DALL·E 3

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Previous generation image generation model

Model ID: `dall-e-3`

DALL·E is an AI system that creates realistic images and art from a natural language description. DALL·E 3 currently supports the ability, given a prompt, to create a new image with a specific size.

## Model details

- Default snapshot: `dall-e-3`
- Input modalities: text
- Output modalities: image

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Image generation

| Metric | Price | Unit |
| --- | ---: | --- |
| Quality | Standard | image |
| 1024x1024 | $0.04 | image |
| 1024x1536 | $0.08 | image |
| 1536x1024 | $0.08 | image |

### Image generation

| Metric | Price | Unit |
| --- | ---: | --- |
| Quality | HD | image |
| 1024x1024 | $0.08 | image |
| 1024x1536 | $0.12 | image |
| 1536x1024 | $0.12 | image |

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
| Image generation | `v1/images/generations` | Supported |
| Videos | `v1/videos` | Not supported |
| Image edit | `v1/images/edits` | Not supported |
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Quick comparison

| Model | 1024x1024 | 1024x1536 | 1536x1024 |
| --- | ---: | ---: | ---: |
| DALL·E 3 | $0.04 | $0.08 | $0.08 |
| DALL·E 2 | $0.016 | $0.018 | $0.02 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for DALL·E 3.

- `dall-e-3`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM |
| --- | ---: |
| Tier free | 1 img/min |
| Tier 1 | 500 img/min |
| Tier 2 | 2500 img/min |
| Tier 3 | 5000 img/min |
| Tier 4 | 7500 img/min |
| Tier 5 | 10000 img/min |
