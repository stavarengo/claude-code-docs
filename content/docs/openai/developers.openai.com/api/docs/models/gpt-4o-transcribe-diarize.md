# GPT-4o Transcribe Diarize

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Transcription model that identifies who's speaking when

Model ID: `gpt-4o-transcribe-diarize`

GPT-4o Transcribe Diarize is an automatic speech recognition (ASR) model with built-in speaker diarization, meaning it associates audio segments with different speakers in a conversation. This model is only available in the Transcription API.

## Model details

- Default snapshot: `gpt-4o-transcribe-diarize`
- Input modalities: text, audio
- Output modalities: text
- 16,000 context window
- 2,000 max output tokens
- Jun 01, 2024 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Audio tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $2.5 | 1M tokens |
| Output | $10 | 1M tokens |

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
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4o Transcribe Diarize.

- `gpt-4o-transcribe-diarize`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM |
| --- | ---: | ---: |
| Tier 1 | 500 | 10,000 |
| Tier 2 | 5,000 | 100,000 |
| Tier 3 | 5,000 | 400,000 |
| Tier 4 | 10,000 | 2,000,000 |
| Tier 5 | 10,000 | 6,000,000 |
