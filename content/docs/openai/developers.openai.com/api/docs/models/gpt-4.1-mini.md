# GPT-4.1 Mini

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Smaller, faster version of GPT-4.1

Model ID: `gpt-4.1-mini`

GPT-4.1 Mini excels at instruction following and tool calling. It features a
1M token context window, and low latency without a reasoning step.

Note that we recommend starting with [GPT-5 Mini](/api/docs/models/gpt-5-mini) for
more complex tasks.

## Model details

- Default snapshot: `gpt-4.1-mini-2025-04-14`
- Input modalities: text, image
- Output modalities: text
- 1,047,576 context window
- 32,768 max output tokens
- Jun 01, 2024 knowledge cutoff

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $0.4 | 1M tokens |
| Cached input | $0.1 | 1M tokens |
| Output | $1.6 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Supported |
| Responses | `v1/responses` | Supported |
| Realtime | `v1/realtime` | Not supported |
| Realtime translation | `v1/realtime/translations` | Not supported |
| Realtime transcription | `v1/realtime/transcription_sessions` | Not supported |
| Assistants | `v1/assistants` | Supported |
| Batch | `v1/batch` | Supported |
| Fine-tuning | `v1/fine-tuning` | Supported |
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

- predicted_outputs
- streaming
- function_calling
- fine_tuning
- file_search
- file_uploads
- web_search
- structured_outputs
- image_input

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- web_search
- file_search
- code_interpreter
- mcp

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-4.1 Mini | $0.4 | $0.1 | $1.6 |
| GPT-4o Mini | $0.15 | $0.075 | $0.6 |
| GPT-5 Mini | $0.25 | $0.025 | $2 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-4.1 Mini.

- `gpt-4.1-mini-2025-04-14`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### Standard

| Tier | RPM | RPD | TPM | Batch queue limit |
| --- | ---: | ---: | ---: | ---: |
| Tier 1 | 500 | 10,000 | 200,000 | 2,000,000 |
| Tier 2 | 5,000 | - | 2,000,000 | 20,000,000 |
| Tier 3 | 5,000 | - | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | - | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | - | 150,000,000 | 15,000,000,000 |

### Long Context

> 128k input tokens

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 200 | 400,000 | 5,000,000 |
| Tier 2 | 500 | 1,000,000 | 40,000,000 |
| Tier 3 | 1,000 | 2,000,000 | 80,000,000 |
| Tier 4 | 2,000 | 10,000,000 | 200,000,000 |
| Tier 5 | 8,000 | 20,000,000 | 2,000,000,000 |
