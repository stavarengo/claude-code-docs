# GPT-4o Mini Audio

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Smaller model capable of audio inputs and outputs

Model ID: `gpt-4o-mini-audio-preview`

This is a preview release of the smaller GPT-4o Audio Mini model. It's designed to input audio or create audio outputs via the REST API.

## Model details

- Default snapshot: `gpt-4o-mini-audio-preview-2024-12-17`
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
| Input | $0.15 | 1M tokens |
| Output | $0.6 | 1M tokens |

### Audio tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $10 | 1M tokens |
| Output | $20 | 1M tokens |

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

## Supported tools

Tools supported by this model when using the Responses API.

- web_search
- file_search
- code_interpreter
- mcp

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4o Mini Audio.

- `gpt-4o-mini-audio-preview-2024-12-17`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | RPD | TPM | Batch queue limit |
| --- | ---: | ---: | ---: | ---: |
| free | 3 | 200 | 40,000 | - |
| Tier 1 | 500 | 10,000 | 200,000 | 2,000,000 |
| Tier 2 | 5,000 | - | 2,000,000 | 20,000,000 |
| Tier 3 | 5,000 | - | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | - | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | - | 150,000,000 | 15,000,000,000 |
