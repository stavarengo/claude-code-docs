# gpt-oss-120b

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Most powerful open-weight model, fits into an H100 GPU

Model ID: `gpt-oss-120b`

`gpt-oss-120b`is our most powerful open-weight model, which fits into a single 
H100 GPU (117B parameters with 5.1B active parameters).

[Download gpt-oss-120b on HuggingFace](https://huggingface.co/openai/gpt-oss-120b).

**Key features**

-   **Permissive Apache 2.0 license:** Build freely without copyleft restrictions or patent risk—ideal for experimentation, customization, and commercial deployment.
-   **Configurable reasoning effort:** Easily adjust the reasoning effort (low, medium, high) based on your specific use case and latency needs.
-   **Full chain-of-thought:** Gain complete access to the model's reasoning process, facilitating easier debugging and increased trust in outputs.
-   **Fine-tunable:** Fully customize models to your specific use case through parameter fine-tuning.
-   **Agentic capabilities:** Use the models' native capabilities for function calling, web browsing, Python code execution, and structured outputs.

## Model details

- Default snapshot: `gpt-oss-120b`
- Input modalities: text
- Output modalities: text
- 131,072 context window
- 131,072 max output tokens
- Jun 01, 2024 knowledge cutoff
- Reasoning token support

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
- structured_outputs
- function_calling

## Supported tools

Tools supported by this model when using the Responses API.

- function_calling
- code_interpreter
- mcp
- web_search

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for gpt-oss-120b.

- `gpt-oss-120b`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | TPM | Batch queue limit |
| --- | ---: | ---: | ---: |
| Tier 1 | 0 | 0 | 0 |
| Tier 2 | 0 | 0 | 0 |
| Tier 3 | 0 | 0 | 0 |
| Tier 4 | 0 | 0 | 0 |
| Tier 5 | 0 | 0 | 0 |
