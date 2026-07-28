# GPT-5 mini

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Near-frontier intelligence for cost sensitive, low latency, high volume workloads

Model ID: `gpt-5-mini`

GPT-5 mini is a faster, more cost-efficient version of GPT-5. It's great for
well-defined tasks and precise prompts. For most new low-latency,
high-volume workloads, we recommend starting with
[GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra).

## Model details

- Default snapshot: `gpt-5-mini-2025-08-07`
- Input modalities: text, image
- Output modalities: text
- 400,000 context window
- Maximum input tokens: 272,000
- 128,000 max output tokens
- May 31, 2024 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $0.25 | 1M tokens |
| Cached input | $0.025 | 1M tokens |
| Output | $2 | 1M tokens |

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Supported |
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

- streaming
- function_calling
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
| GPT-5 mini | $0.25 | $0.025 | $2 |
| GPT-5.4 mini | $0.75 | $0.075 | $4.5 |
| GPT-5.4 nano | $0.2 | $0.02 | $1.25 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-5 mini.

- `gpt-5-mini-2025-08-07`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 500,000 | 5,000,000 |
| Tier 2 | 5,000 | 2,000,000 | 20,000,000 |
| Tier 3 | 5,000 | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | 180,000,000 | 15,000,000,000 |
