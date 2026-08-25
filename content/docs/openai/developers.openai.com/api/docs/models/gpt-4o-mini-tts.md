# GPT-4o Mini TTS

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Text-to-speech model powered by GPT-4o Mini

Model ID: `gpt-4o-mini-tts`

GPT-4o Mini TTS is a text-to-speech model built on GPT-4o Mini, a fast and powerful language model. Use it to convert text to natural sounding spoken text. The maximum number of input tokens is 2000.

## Model details

- Default snapshot: `gpt-4o-mini-tts-2025-12-15`
- Input modalities: text
- Output modalities: audio

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $0.6 | 1M tokens |

### Audio tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Output | $12 | 1M tokens |

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

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-4o Mini TTS | $0.6 | - | - |
| GPT-4o Mini Realtime | $0.6 | $0.3 | $2.4 |
| GPT-4o Realtime | $5 | $2.5 | $20 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4o Mini TTS.

- `gpt-4o-mini-tts-2025-03-20`
- `gpt-4o-mini-tts-2025-12-15`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM |
| --- | ---: | ---: |
| Tier 1 | 500 | 50,000 |
| Tier 2 | 2,000 | 150,000 |
| Tier 3 | 5,000 | 600,000 |
| Tier 4 | 10,000 | 2,000,000 |
| Tier 5 | 10,000 | 8,000,000 |
