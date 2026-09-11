# GPT-Live 1

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Our premier model for natural, expressive voice conversations with smooth interruption handling.

Model ID: `gpt-live-1`

GPT-Live 1 is a full-duplex voice model for real-time conversations. It can listen and speak at the same time, and delegate reasoning and tool use to a backend agent.

Learn how to [get started with GPT-Live](/api/docs/guides/live), [configure delegation](/api/docs/guides/live-delegation), and [prompt the model](/api/docs/guides/live-prompting).

## Model details

- Default snapshot: `gpt-live-1`
- Input modalities: audio, text
- Output modalities: audio, text
- Unsupported modalities: image, video
- Jul 31, 2025 knowledge cutoff

## Pricing

Voice sessions cost $0.05 per minute, billed per second. Backend model and tool usage is billed separately.

### Live session duration

| Metric | Price | Unit |
| --- | ---: | --- |
| Per minute | $0.05 | minute |

- Session duration is not rounded up to the next whole minute.
- Backend Responses calls use the normal pricing for the configured model and tools.

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Live | `v1/live/sessions` | Supported |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Not supported |
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
- function_calling

## Unsupported features

- structured_outputs
- fine_tuning
- predicted_outputs

## Snapshots

Use `gpt-live-1` in your API requests.

- `gpt-live-1`

## Rate limits

Rate limits are measured in concurrent sessions.

Unsupported usage tiers: Free.

### Concurrent sessions

| Tier | Concurrent sessions |
| --- | ---: |
| Tier 1 | 25 |
| Tier 2 | 50 |
| Tier 3 | 200 |
| Tier 4 | 300 |
| Tier 5 | 500 |
