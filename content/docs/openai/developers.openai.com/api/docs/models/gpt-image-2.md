# GPT Image 2

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> State-of-the-art image generation model

Model ID: `gpt-image-2`

GPT Image 2 is our state-of-the-art image generation model for fast, high-quality image generation and editing. It supports flexible image sizes and high-fidelity image inputs. Learn more in our [image generation guide](/api/docs/guides/image-generation), or see the [pricing page](/api/docs/pricing#image-generation) and [image generation calculator](/api/docs/guides/image-generation#calculating-costs) for cost estimates.

## Model details

- Default snapshot: `gpt-image-2-2026-04-21`
- Input modalities: text, image
- Output modalities: image

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Not supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Not supported |
| Assistants | `v1/assistants` | Not supported |
| Batch | `v1/batch` | Supported |
| Fine-tuning | `v1/fine-tuning` | Not supported |
| Embeddings | `v1/embeddings` | Not supported |
| Image generation | `v1/images/generations` | Supported |
| Videos | `v1/videos` | Not supported |
| Image edit | `v1/images/edits` | Supported |
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Supported features

- inpainting

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT Image 2.

- `gpt-image-2-2026-04-21`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | TPM | IPM |
| --- | ---: | ---: |
| Tier 1 | 100,000 | 5 |
| Tier 2 | 250,000 | 20 |
| Tier 3 | 800,000 | 50 |
| Tier 4 | 3,000,000 | 150 |
| Tier 5 | 8,000,000 | 250 |
