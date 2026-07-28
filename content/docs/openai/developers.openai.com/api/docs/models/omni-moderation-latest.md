# omni-moderation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Identify potentially harmful content in text and images

Model ID: `omni-moderation-latest`

Moderation models are free models designed to detect harmful content.
This model is our most capable moderation model, accepting images as input as well.
You can find the model card [here](https://cdn.openai.com/API/docs/omni_moderation_information_for_developers.pdf).

## Model details

- Default snapshot: `omni-moderation-2024-09-26`
- Input modalities: text, image
- Output modalities: text

## Endpoints

| Endpoint | Route | Support |
| --- | --- | --- |
| Chat Completions | `v1/chat/completions` | Not supported |
| Responses | `v1/responses` | Not supported |
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
| Moderation | `v1/moderations` | Supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Supported features

- image_input

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for omni-moderation.

- `omni-moderation-2024-09-26`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | RPD | TPM |
| --- | ---: | ---: | ---: |
| free | 250 | 5,000 | 10,000 |
| Tier 1 | 500 | 10,000 | 10,000 |
| Tier 2 | 500 | - | 20,000 |
| Tier 3 | 1,000 | - | 50,000 |
| Tier 4 | 2,000 | - | 250,000 |
| Tier 5 | 5,000 | - | 500,000 |
