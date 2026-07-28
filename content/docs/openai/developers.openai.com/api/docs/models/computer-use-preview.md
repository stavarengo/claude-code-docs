# computer-use-preview

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Specialized model for computer use tool

Model ID: `computer-use-preview`

The computer-use-preview model is a specialized model for the computer use 
tool. It is trained to understand and execute computer tasks.
See the [computer use guide](/api/docs/guides/tools-computer-use) for more
information. This model is only usable in the 
[Responses API](/api/docs/api-reference/responses).

## Model details

- Default snapshot: `computer-use-preview-2025-03-11`
- Input modalities: text, image
- Output modalities: text
- 8,192 context window
- 1,024 max output tokens
- Oct 01, 2023 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $3 | 1M tokens |
| Output | $12 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Not supported |
| Assistants | `v1/assistants` | Not supported |
| Batch | `v1/batch` | Supported |
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

- function_calling

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| computer-use-preview | $3 | - | $12 |
| o3-mini | $1.1 | $0.55 | $4.4 |
| o1 | $15 | $7.5 | $60 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for computer-use-preview.

- `computer-use-preview-2025-03-11`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 3 | 3,000 | 20,000,000 | 450,000,000 |
| Tier 4 | 3,000 | 20,000,000 | 450,000,000 |
| Tier 5 | 3,000 | 20,000,000 | 450,000,000 |
