# GPT-5.2-Codex

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Our most intelligent coding model optimized for long-horizon, agentic coding tasks.

Model ID: `gpt-5.2-codex`

GPT-5.2-Codex is an upgraded version of GPT-5.2 optimized for agentic coding tasks in [Codex](https://developers.openai.com/codex) or similar environments.
GPT-5.2-Codex supports `low`, `medium`, `high`, and `xhigh` reasoning effort settings.
If you want to learn more about prompting GPT-5.2-Codex, refer to our [dedicated guide](/cookbook/examples/gpt-5/codex_prompting_guide).

## Model details

- Default snapshot: `gpt-5.2-codex`
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
| Input | $1.75 | 1M tokens |
| Cached input | $0.175 | 1M tokens |
| Output | $14 | 1M tokens |

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
- web_search
- prompt_caching

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- web_search
- hosted_shell
- skills

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-5.2-Codex | $1.75 | $0.175 | $14 |
| GPT-5.1-Codex | $1.25 | $0.125 | $10 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-5.2-Codex.

- `gpt-5.2-codex`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 500,000 | 1,500,000 |
| Tier 2 | 5,000 | 1,000,000 | 3,000,000 |
| Tier 3 | 5,000 | 2,000,000 | 100,000,000 |
| Tier 4 | 10,000 | 4,000,000 | 200,000,000 |
| Tier 5 | 15,000 | 40,000,000 | 15,000,000,000 |
