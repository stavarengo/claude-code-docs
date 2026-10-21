---
title: Cache diagnostics
url: https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics
description: Diagnose unexpected prompt cache misses by comparing consecutive requests and identifying exactly where the prompt prefix diverged.
featureMetadata:
  status: ga
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=curl#model-specific-data-retention-requirements).
  supportedPlatforms:
    Claude API: ga
---

[Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=curl) cuts latency and cost significantly, but only when the beginning of your prompt is byte-for-byte identical to a recent request. A reordered tool, a timestamp interpolated into your system prompt, or an edit to an earlier message can silently invalidate the cache. Without cache diagnostics, the only signal is `usage.cache_read_input_tokens` dropping to zero, with no indication of what changed.

Cache diagnostics closes that gap. Pass the `id` of your previous response, and the API compares the two requests and tells you where they diverged (the model, the system prompt, the tools, or the message history) so you can fix the root cause instead of guessing.

## How cache diagnostics works

For each request that includes the `diagnostics` object, the API stores a lightweight fingerprint keyed by the response `id`. It stores nothing for requests that omit the object. On your next request, include the previous response's `id` as `diagnostics.previous_message_id`. The API rebuilds the fingerprint for the new request, compares it against the stored one, and attaches a `diagnostics` object to the response describing the first point of divergence.

The comparison is about request structure, independent of whether the cache actually hit. See [Reading diagnostics alongside usage](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics?sdk_languages=curl#reading-diagnostics-alongside-usage) for how to combine the `diagnostics` result with `usage.cache_read_input_tokens`.

Fingerprints contain only hashes and token-count estimates (never raw prompt content), are retained for a limited time, are scoped to your organization and workspace, and are not used for any other purpose.

## Basic usage

Include the `diagnostics` object on every turn. The object is the opt-in: the API stores a fingerprint only for requests that include it. On the first turn, pass `"previous_message_id": null` to opt in without a prior message to compare against. On subsequent turns, pass the `id` from the previous response. The `cache-diagnosis-2026-04-07` beta header is no longer required, and requests that still send it work as before.

<CodeGroup>
  ```bash cURL
  # Turn 1: establish the cache and opt in to diagnostics
  curl -sS --fail-with-body https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "cache_control": {"type": "ephemeral"},
      "system": "You are an AI assistant analyzing a large document. <document>...</document>",
      "messages": [{"role": "user", "content": "Summarize section 1."}],
      "diagnostics": {"previous_message_id": null}
    }'

  # Turn 2: pass the id from the turn 1 response as previous_message_id, so the API can compare prefixes.
  # In the response, diagnostics: null means no divergence was found.
  curl -sS --fail-with-body https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "cache_control": {"type": "ephemeral"},
      "system": "You are an AI assistant analyzing a large document. <document>...</document>",
      "messages": [
        {"role": "user", "content": "Summarize section 1."},
        {"role": "assistant", "content": "Section 1 covers..."},
        {"role": "user", "content": "Now summarize section 2."}
      ],
      "diagnostics": {"previous_message_id": "'"$message_id"'"}
    }'
  ```
</CodeGroup>

## Streaming

In streaming responses, `diagnostics` appears on the `message_start` event.

<CodeGroup>
  ```bash cURL
  # Turn 2: stream the response. diagnostics arrives on the message_start event;
  # a null value means no divergence was found.
  curl -sS --fail-with-body https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-opus-5-5",
      "max_tokens": 1024,
      "stream": true,
      "cache_control": {"type": "ephemeral"},
      "system": "You are an AI assistant analyzing a large document. <document>...</document>",
      "messages": [
        {"role": "user", "content": "Summarize section 1."},
        {"role": "assistant", "content": "Section 1 covers..."},
        {"role": "user", "content": "Now summarize section 2."}
      ],
      "diagnostics": {"previous_message_id": "'"$message_id"'"}
    }'
  ```
</CodeGroup>

The `message_start` event carries the full `diagnostics` field; see [Response format](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics?sdk_languages=curl#response-format) for the possible values.

## Threading diagnostics through a conversation loop

In a multi-turn conversation, carry the latest response `id` forward as `previous_message_id` on every turn. The first iteration passes `null` to opt in; each subsequent iteration passes the `id` from the previous response.

<Tabs>
  <Tab title="cURL">
    <Info>
      This workflow doesn't translate well to a one-off shell command. See the SDK tabs for the loop pattern; the per-turn HTTP request is identical to [Basic usage](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics?sdk_languages=curl#basic-usage).
    </Info>
  </Tab>
</Tabs>

## Response format

The `diagnostics` field on the response `Message` has three possible values:

| Value                          | Meaning                                                                                                                                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `null`                         | The request did not include the `diagnostics` object, `previous_message_id` was `null` (first turn, nothing to compare), or a comparison ran and found no divergence.                           |
| `{"cache_miss_reason": null}`  | The comparison was still running when the response was serialized. This can happen when the response starts very quickly. Treat it as inconclusive and check the next turn.                     |
| `{"cache_miss_reason": {...}}` | A `cache_miss_reason` is attached. For `*_changed` types this identifies the first divergence point; `previous_message_not_found` and `unavailable` are cases where no comparison was produced. |

When `cache_miss_reason` is non-null, it looks like this:

```json
{
  "id": "msg_01Xyz...",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "..." }],
  "usage": {
    "input_tokens": 42,
    "cache_read_input_tokens": 0,
    "cache_creation_input_tokens": 41850,
    "output_tokens": 210
  },
  "diagnostics": {
    "cache_miss_reason": {
      "type": "system_changed",
      "cache_missed_input_tokens": 41850
    }
  }
}
```

## Cache miss reason types

`cache_miss_reason` is a discriminated union on `type`. The response reports the earliest divergence only, so fix it first; later ones may be hidden behind it.

| Type                         | What it means                                                                                                                                                                                                                                                                                                                                                                                                                                   | What to change                                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model_changed`              | The `model` differs from the previous request (for example, a router, A/B test, or fallback selected a different model). The cache is per-model.                                                                                                                                                                                                                                                                                                | Hold the model constant within a cached conversation.                                                                                                                                                                                                                                                                            |
| `system_changed`             | The `system` parameter differs. Typically a timestamp, request ID, or other per-request value was interpolated into the system prompt.                                                                                                                                                                                                                                                                                                          | Make the system prompt a byte-stable constant and move dynamic data into the first `user` message after your cache breakpoint.                                                                                                                                                                                                   |
| `tools_changed`              | The `tools` array differs: tools were added, removed, or reordered between turns, or tool `input_schema` JSON was serialized non-deterministically.                                                                                                                                                                                                                                                                                             | Send the same tool list on every turn in a fixed order with deterministically serialized schemas (for example, sort keys).                                                                                                                                                                                                       |
| `messages_changed`           | The model, system, and tools all match, but an earlier entry in `messages` was altered, reordered, or removed rather than appended to. Typically conversation history was truncated or edited, or assistant turns and `tool_result` blocks were re-serialized differently on resend.                                                                                                                                                            | Treat the history as append-only; echo assistant `content` and tool results back verbatim.                                                                                                                                                                                                                                       |
| `previous_message_not_found` | No stored fingerprint exists for the supplied `previous_message_id`. This is not evidence that your request changed. Typically the previous request did not include the `diagnostics` object, it came from a different workspace, or too much time has passed since it was sent.                                                                                                                                                                | Include the `diagnostics` object on every turn and keep consecutive turns close together in time.                                                                                                                                                                                                                                |
| `unavailable`                | Diagnostic information was not available for this request. This includes the case where `model`, `system`, and `tools` match but another prompt-affecting request parameter (`tool_choice`, `thinking`, `context_management`, `output_config`, `output_format`, or the set of active `anthropic-beta` headers) differs, and very long conversations where the divergence is beyond the comparison horizon. Your request was processed normally. | Keep the prompt-affecting request parameters constant for the lifetime of a cached conversation. If persistent, apply the manual checks under [Troubleshooting common issues](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=curl#troubleshooting-common-issues) on the prompt caching page. |

<Note>
  The four `*_changed` types also carry a `cache_missed_input_tokens` integer: an estimate of how many input tokens fell after the divergence point, giving you a sense of how much cacheable prefix was lost. It is derived from byte lengths before tokenization, so treat it as a magnitude indicator rather than a billing number. It can differ from (and occasionally exceed) `usage.input_tokens`.
</Note>

## Reading diagnostics alongside usage

`diagnostics` answers "did my request change?" while `usage.cache_read_input_tokens` answers "did the cache hit?". Combining them tells you where to look.

This matrix applies to turns where you passed a real `previous_message_id`. On the first turn (`previous_message_id: null`), `diagnostics` is always `null` and `cache_read_input_tokens` is normally zero because the cache is being written, not read; no troubleshooting is needed. The matrix also does not apply when `cache_miss_reason` is `null` (the comparison is still pending; check the next turn) or when its `type` is `previous_message_not_found` or `unavailable` (no comparison was produced).

| Diagnostics result                        | Cache read tokens | Interpretation                                                                                                                                                                                                                                          |
| ----------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `null`                                    | high              | Working as expected. Your prefix is stable and the cache hit.                                                                                                                                                                                           |
| `null`                                    | low or zero       | Your requests match but the cache entry was no longer available. Consider shortening gaps between turns or using the [1-hour cache TTL](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=curl#1-hour-cache-duration). |
| `cache_miss_reason` is a `*_changed` type | low or zero       | Your bug. The request changed; fix the cause indicated by `type`.                                                                                                                                                                                       |
| `cache_miss_reason` is a `*_changed` type | high              | Rare. A change occurred late in the prompt but an earlier `cache_control` breakpoint still hit. Worth fixing, but low impact.                                                                                                                           |

## Limitations

* **Claude API only:** Not available on Amazon Bedrock or Google Cloud.
* **Limited retention:** Fingerprints for `previous_message_id` lookup expire after a short period. Run diagnostic comparisons between closely spaced requests.
* **Same workspace:** The previous request must have run in the same organization and workspace. To check, compare the `anthropic-workspace-id` [response header](https://platform.claude.com/docs/en/api/overview?sdk_languages=curl#response-headers) on the two responses.
* **Comparison horizon:** For very long conversations where the only change is deep in the message list, the response may be `unavailable` rather than a precise location.
* **Best-effort:** Diagnostics never blocks or fails your request. If diagnostic information is not available, the response returns `unavailable`, or `cache_miss_reason: null` when the comparison was still running.

## Data retention

Cache diagnostics is ZDR eligible (qualified). Anthropic does not store the raw text of your prompts or Claude's outputs for this feature.

The API stores a fingerprint only for requests that include the `diagnostics` object. The fingerprint consists only of cryptographic hashes and token-count estimates, keyed by the response `id` and scoped to your organization and workspace. Fingerprints expire after a short period and are not used for any other purpose.

For ZDR eligibility across all features, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=curl).

## See also

* [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=curl)
* [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=curl)
