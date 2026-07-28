# codex-mini-latest

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Fast reasoning model optimized for the Codex CLI

Model ID: `codex-mini-latest`

codex-mini-latest is a fine-tuned version of o4-mini specifically
for use in Codex CLI. For direct use in the API, we recommend starting
with gpt-4.1.

## Model details

- Default snapshot: `codex-mini-latest`
- Input modalities: text, image
- Output modalities: text
- 200,000 context window
- 100,000 max output tokens
- Jun 01, 2024 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $1.5 | 1M tokens |
| Cached input | $0.375 | 1M tokens |
| Output | $6 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Supported |
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
- structured_outputs
- function_calling
- image_input
- prompt_caching
- evals
- stored_completions

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| codex-mini-latest | $1.5 | $0.375 | $6 |
| o4-mini | $1.1 | $0.275 | $4.4 |
| GPT-4.1 | $2 | $0.5 | $8 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for codex-mini-latest.

- `codex-mini-latest`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 1,000 | 100,000 | 1,000,000 |
| Tier 2 | 2,000 | 200,000 | 2,000,000 |
| Tier 3 | 5,000 | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | 150,000,000 | 15,000,000,000 |
