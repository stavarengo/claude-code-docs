# TTS-1 HD

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Text-to-speech model optimized for quality

Model ID: `tts-1-hd`

TTS is a model that converts text to natural sounding spoken text. The tts-1-hd model is optimized for high quality text-to-speech use cases. Use it with the Speech endpoint in the Audio API.

## Model details

- Default snapshot: `tts-1-hd`
- Input modalities: text
- Output modalities: audio

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Pricing

| Metric | Price | Unit |
| --- | ---: | --- |
| Use case | Speech generation | 1M tokens |
| Cost | $30 | 1M characters |

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
| Speech generation | `v1/audio/speech` | Supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Quick comparison

| Model | Cost |
| --- | ---: |
| TTS-1 HD | $30 |
| TTS-1 | $15 |
| GPT-4o mini Realtime | - |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for TTS-1 HD.

- `tts-1-hd`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM |
| --- | ---: |
| free | - |
| Tier 1 | 500 |
| Tier 2 | 2,500 |
| Tier 3 | 5,000 |
| Tier 4 | 7,500 |
| Tier 5 | 10,000 |
