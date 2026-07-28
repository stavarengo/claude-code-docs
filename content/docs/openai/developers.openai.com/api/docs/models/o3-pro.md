# o3-pro

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Version of o3 with more compute for better responses

Model ID: `o3-pro`

The o-series of models are trained with reinforcement learning to think 
before they answer and perform complex reasoning. The o3-pro model uses more 
compute to think harder and provide consistently better answers.

o3-pro is available in the [Responses API only](/api/docs/api-reference/responses)
to enable support for multi-turn model interactions before responding to API 
requests, and other advanced API features in the future. Since o3-pro is designed 
to tackle tough problems, some requests may take several minutes to finish. 
To avoid timeouts, try using [background mode](/api/docs/guides/background).

## Model details

- Default snapshot: `o3-pro-2025-06-10`
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
| Input | $20 | 1M tokens |
| Output | $80 | 1M tokens |

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

- structured_outputs
- function_calling
- image_input

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- file_search
- image_generation
- mcp
- web_search

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| o3-pro | $20 | - | $80 |
| o3 | $2 | $0.5 | $8 |
| o3-mini | $1.1 | $0.55 | $4.4 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for o3-pro.

- `o3-pro-2025-06-10`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 30,000 | 90,000 |
| Tier 2 | 5,000 | 450,000 | 1,350,000 |
| Tier 3 | 5,000 | 800,000 | 50,000,000 |
| Tier 4 | 10,000 | 2,000,000 | 200,000,000 |
| Tier 5 | 10,000 | 30,000,000 | 5,000,000,000 |
