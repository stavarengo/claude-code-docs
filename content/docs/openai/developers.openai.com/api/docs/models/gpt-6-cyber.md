# GPT-6 Cyber

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Investigate a vulnerability, reproduce it in an authorized test environment, or verify a fix.

Model ID: `gpt-6-cyber`

Your organization needs Daybreak Red access and approval to use GPT-6 Cyber. Your account team can confirm access. The standard rate limits below apply to approved organizations and may differ if your organization has custom limits.

[Set up your organization and project](/api/docs/guides/daybreak#set-up-gpt-6-cyber) before sending your first request.

## Model details

- Default snapshot: `gpt-6-cyber`
- Input modalities: text, image
- Output modalities: text
- 1,050,000 context window
- Maximum input tokens: 922,000
- 128,000 max output tokens
- Reasoning token support

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Text tokens

| Metric | Price | Unit |
| --- | ---: | --- |
| Input | $20 | 1M tokens |
| Cached input | $2 | 1M tokens |
| Cache writes | $25 | 1M tokens |
| Output | $100 | 1M tokens |

- The table shows Standard prices for requests with up to 272K input tokens.
- For requests with more than 272K input tokens, Standard prices per 1M tokens are $40 for input, $4 for cached input, and $150 for output.
- Short-context cache writes cost $25 per 1M tokens for 30 minutes or $50 per 1M tokens for 12 hours.

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Live | `v1/live/sessions` | Not supported |
| Chat Completions | `v1/chat/completions` | Supported |
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
- web_search
- prompt_caching

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- web_search
- file_search
- tool_search
- image_generation
- code_interpreter
- hosted_shell
- apply_patch
- skills
- computer_use
- mcp

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for GPT-6 Cyber.

- `gpt-6-cyber`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### Standard

| Tier | RPM | TPM | IPM |
| --- | ---: | ---: | ---: |
| Free | 3 | 10,000 | 50,000 |
| Build | 5,000 | 1,000,000 | 50,000 |
| Launch | 10,000 | 4,000,000 | 50,000 |
| Grow | 15,000 | 40,000,000 | 250,000 |
