# GPT-5.4 nano

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Our cheapest GPT-5.4-class model for simple high-volume tasks

Model ID: `gpt-5.4-nano`

GPT-5.4 nano is designed for tasks where speed and cost matter most like
classification, data extraction, ranking, and sub-agents. Learn more in our
[Model guidance](/api/docs/guides/latest-model) page. Reasoning.effort supports: none (default), low, medium, high and xhigh.

## Model details

- Default snapshot: `gpt-5.4-nano-2026-03-17`
- Input modalities: text, image
- Output modalities: text
- 400,000 context window
- Maximum input tokens: 272,000
- 128,000 max output tokens
- Aug 31, 2025 knowledge cutoff
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $0.2 | 1M tokens |
| Cached input | $0.02 | 1M tokens |
| Output | $1.25 | 1M tokens |

- Regional processing (data residency) endpoints are charged a 10% uplift for GPT-5.4 nano.

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
- structured_outputs
- function_calling
- file_search
- file_uploads
- image_input
- web_search
- prompt_caching

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- web_search
- file_search
- image_generation
- code_interpreter
- hosted_shell
- apply_patch
- skills
- mcp

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-5.4 nano | $0.2 | $0.02 | $1.25 |
| GPT-5.4 mini | $0.75 | $0.075 | $4.5 |
| GPT-5 nano | $0.05 | $0.005 | $0.4 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-5.4 nano.

- `gpt-5.4-nano-2026-03-17`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 200,000 | 2,000,000 |
| Tier 2 | 5,000 | 2,000,000 | 20,000,000 |
| Tier 3 | 5,000 | 4,000,000 | 40,000,000 |
| Tier 4 | 10,000 | 10,000,000 | 1,000,000,000 |
| Tier 5 | 30,000 | 180,000,000 | 15,000,000,000 |
