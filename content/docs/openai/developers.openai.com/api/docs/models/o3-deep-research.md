# o3-deep-research

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Our most powerful deep research model

Model ID: `o3-deep-research`

o3-deep-research is our most advanced model for deep research, 
designed to tackle complex, multi-step research tasks. It can 
search and synthesize information from across the internet as 
well as from your own data—brought in through MCP connectors.

Learn more about getting started with this model in our
[deep research](/api/docs/guides/deep-research) guide.

## Model details

- Default snapshot: `o3-deep-research-2025-06-26`
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
| Input | $10 | 1M tokens |
| Cached input | $2.5 | 1M tokens |
| Output | $40 | 1M tokens |

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

- streaming
- file_uploads
- image_input
- prompt_caching
- evals
- stored_completions

## Supported tools

Tools supported by this model when using the Responses API.

- web_search
- code_interpreter
- mcp

## Quick comparison

| Model | Input | Cached input | Output |
| --- | ---: | ---: | ---: |
| o3-deep-research | $10 | $2.5 | $40 |
| o1 | $15 | $7.5 | $60 |
| o4-mini | $1.1 | $0.275 | $4.4 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for o3-deep-research.

- `o3-deep-research-2025-06-26`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 500 | 200,000 | 200,000 |
| Tier 2 | 5,000 | 450,000 | 300,000 |
| Tier 3 | 5,000 | 800,000 | 500,000 |
| Tier 4 | 10,000 | 2,000,000 | 2,000,000 |
| Tier 5 | 10,000 | 30,000,000 | 10,000,000 |
