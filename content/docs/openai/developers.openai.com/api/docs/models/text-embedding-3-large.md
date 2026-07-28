# text-embedding-3-large

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> Most capable embedding model

Model ID: `text-embedding-3-large`

text-embedding-3-large is our most capable embedding model for both english and non-english tasks.
Embeddings are a numerical representation of text that can be used to measure the relatedness between two pieces of text.
Embeddings are useful for search, clustering, recommendations, anomaly detection, and classification tasks.

## Model details

- Default snapshot: `text-embedding-3-large`
- Input modalities: text
- Output modalities: text

## Pricing

Pricing is based on the number of tokens used, or other metrics based on the model type. For tool-specific models, like search and computer use, there’s a fee per tool call. See details in the [pricing page](/api/docs/pricing).

### Embeddings

| Metric | Price | Unit |
| --- | ---: | --- |
| Cost | $0.13 | 1M tokens |

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
| Embeddings | `v1/embeddings` | Supported |
| Image generation | `v1/images/generations` | Not supported |
| Videos | `v1/videos` | Not supported |
| Image edit | `v1/images/edits` | Not supported |
| Speech generation | `v1/audio/speech` | Not supported |
| Transcription | `v1/audio/transcriptions` | Not supported |
| Translation | `v1/audio/translations` | Not supported |
| Moderation | `v1/moderations` | Not supported |
| Completions (legacy) | `v1/completions` | Not supported |

## Quick comparison

| Model | Cost |
| --- | ---: |
| text-embedding-3-large | $0.13 |
| text-embedding-3-small | $0.02 |

## Snapshots

Snapshots let you lock in a specific version of the model so that performance and behavior remain consistent. Below is a list of all available snapshots and aliases for text-embedding-3-large.

- `text-embedding-3-large`

## Rate limits

Rate limits ensure fair and reliable access to the API by placing specific caps on requests, tokens, audio duration, or other usage within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.

### default

| Tier | RPM | RPD | TPM | Batch queue limit |
| --- | ---: | ---: | ---: | ---: |
| free | 100 | 2,000 | 40,000 | - |
| Tier 1 | 3,000 | - | 1,000,000 | 3,000,000 |
| Tier 2 | 5,000 | - | 1,000,000 | 20,000,000 |
| Tier 3 | 5,000 | - | 5,000,000 | 100,000,000 |
| Tier 4 | 10,000 | - | 5,000,000 | 500,000,000 |
| Tier 5 | 10,000 | - | 10,000,000 | 4,000,000,000 |
