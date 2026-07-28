# GPT-4o Audio

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> GPT-4o models capable of audio inputs and outputs

Model ID: `gpt-4o-audio-preview`

This is a preview release of the GPT-4o Audio models. These models accept 
audio inputs and outputs, and can be used in the Chat Completions REST API.

## Model details

- Default snapshot: `gpt-4o-audio-preview-2025-06-03`
- Input modalities: text, audio
- Output modalities: text, audio
- 128,000 context window
- 16,384 max output tokens
- Oct 01, 2023 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $2.5 | 1M tokens |
| Output | $10 | 1M tokens |

### Audio tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $40 | 1M tokens |
| Output | $80 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Supported |
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
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Supported features

- streaming
- function_calling

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4o Audio.

- `gpt-4o-audio-preview-2025-06-03`
- `gpt-4o-audio-preview-2024-12-17`
- `gpt-4o-audio-preview-2024-10-01`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 30,000 | 90,000 |
| Tier 2 | 5,000 | 450,000 | 1,350,000 |
| Tier 3 | 5,000 | 800,000 | 50,000,000 |
| Tier 4 | 10,000 | 2,000,000 | 2,000,000 |
| Tier 5 | 10,000 | 30,000,000 | 5,000,000,000 |
