# GPT-Live-1.1

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Full-duplex voice model for multilingual conversations.

Model ID: `gpt-live-1.1`

GPT-Live-1.1 can listen while it speaks. Compared with GPT-Live-1, it transcribes speech more accurately and maintains a more consistent accent and voice across languages. Describe in plain language when the model should hand a task to your backend for reasoning or tool use.

Learn how to [start a voice session](/api/docs/guides/live), [prompt GPT-Live](/api/docs/guides/live-prompting), and [configure delegation](/api/docs/guides/live-delegation).

## Model details

- Default snapshot: `gpt-live-1.1`
- Input modalities: audio, text
- Output modalities: audio, text

## Pricing

Voice sessions are billed by duration. Backend model and tool usage is billed separately.

### Live session duration

| Metric | Price | Unit |
| --- | ---: | --- |
| Active | $0.05 | minute |
| Standby | $0.02 | minute |

- The lower standby rate applies to WebRTC sessions while inference is paused. See [GPT-Live pricing](/api/docs/pricing#live-session-duration).

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

## Snapshots

Use `gpt-live-1.1` in your API requests.

- `gpt-live-1.1`

## Rate limits

GPT-Live-1.1 and GPT-Live-1 have separate concurrent-session limits. Each model’s limit applies across inference regions.

See your [organization’s limits](https://platform.openai.com/settings/organization/limits) for the rate limits that apply to your account.
