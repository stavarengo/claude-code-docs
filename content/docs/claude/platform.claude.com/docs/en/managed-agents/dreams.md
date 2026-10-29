---
title: Dreams
url: https://platform.claude.com/docs/en/managed-agents/dreams
description: Let Claude review past sessions to curate an agent's memory and surface new insights.
featureMetadata:
  status: research-preview
  betaHeader: managed-agents-2026-04-01, dreaming-2026-04-21
  zdr:
    eligibility: not-eligible
    note: Sessions are stateful resources; transcripts persist until you delete them. Applies to all Managed Agents sub-features, including Self-hosted sandboxes.
  supportedModels:
    - claude-fable-5-1
    - claude-fable-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-sonnet-4-6
  supportedPlatforms:
    Claude API: research-preview
---

<Note>
  Dreams are in research preview.

  * [Request access](https://claude.com/form/claude-managed-agents)
</Note>

Agents write to their [memory stores](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli) as they work, but these writes are local and incremental: over many sessions a memory store accumulates duplicates, contradictions, and stale entries.

**Dreams** let Claude clean that up. A dream reads an existing memory store alongside past session transcripts, then produces a new, reorganized memory store: duplicates merged, stale or contradicted entries replaced with the latest value, and new insights surfaced.

The input store is never modified, so you can review the output and discard it if you don’t like the result.

<Note>
  Dream endpoints are gated by the `dreaming-2026-04-21` beta header; the `managed-agents-2026-04-01` header on its own doesn’t grant access to dreams. The dream-endpoint examples on this page send both headers; session and memory-store calls need only `managed-agents-2026-04-01`. The SDK sets these automatically.
</Note>

## How it works

A **dream** is an asynchronous job that takes:

* a pre-existing **memory store:** the store Claude verifies, deduplicates, and reorganizes, and
* 1 to 100 **sessions:** past transcripts Claude mines for patterns and insights to fold into the output.

The dream produces another **output memory store**, separate from the input. The output store ID appears in the dream’s `outputs` array shortly after the dream starts `running`, once the workflow has cloned the input store; a `running` dream can briefly report an empty `outputs` array.

## Create a dream

<CodeGroup>
  ```bash CLI
  ant beta:dreams create <<YAML
  inputs:
    - type: memory_store
      memory_store_id: $store_id
    - type: sessions
      session_ids: [$session_a, $session_b]
  model: claude-opus-5-5
  instructions: Focus on coding-style preferences; ignore one-off debugging notes.
  YAML
  ```
</CodeGroup>

Dreaming inputs include the pre-existing memory store and an array of sessions. The selected model runs the dreaming pipeline. During the research preview, `claude-opus-5-5`, `claude-fable-5-1`, `claude-opus-5`, `claude-fable-5`, `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-5-5`, `claude-sonnet-5`, and `claude-sonnet-4-6` are supported. You can optionally pass `instructions` to steer the dreaming process. See [Steer with instructions](https://platform.claude.com/docs/en/managed-agents/dreams?sdk_languages=cli#steer-with-instructions).

The response is the full `dream` resource with `status: "pending"`:

```json
{
  "type": "dream",
  "id": "drm_01AbCDefGhIjKlMnOpQrStUv",
  "status": "pending",
  "inputs": [
    { "type": "memory_store", "memory_store_id": "memstore_01Hx..." },
    { "type": "sessions", "session_ids": ["sesn_01...", "sesn_02..."] }
  ],
  "outputs": [],
  "model": { "id": "claude-opus-5-5" },
  "instructions": "Focus on coding-style preferences; ignore one-off debugging notes.",
  "session_id": null,
  "created_at": "2026-04-29T17:04:10Z",
  "ended_at": null,
  "archived_at": null,
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "cache_read_input_tokens": 0,
    "cache_creation_input_tokens": 0
  },
  "error": null
}
```

<Tip>
  If you only have session transcripts and no existing store, [create an empty memory store](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli#create-a-memory-store) first and pass it as the `memory_store` input.
</Tip>

### Steer with instructions

The optional `instructions` field steers what the dreaming pipeline synthesizes. It is applied throughout the pipeline: what to read closely, what to merge or drop, and how to structure the output store.

Use `instructions` for high-level synthesis guidance such as focus areas (“focus on coding-style preferences”), content to preserve unchanged, or output conventions you want applied across the store. The pipeline is a synthesis pass over the inputs, not an editor applied to the text of the store, so imperative directives that target specific lines (“change sentence X to Y,” “fix the count in section Z”) generally produce no change. To make targeted edits to individual memories, use the [Memory Stores API](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli#view-and-edit-memories) on the output store directly.

## Track progress

Dreams run asynchronously and typically take minutes to a few hours, driven by the number of input transcripts. Poll the dream by ID to check status:

<CodeGroup>
  ```bash CLI
  ant beta:dreams retrieve --dream-id "$dream_id"
  ```
</CodeGroup>

### Lifecycle

| `status`    | Meaning                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `pending`   | Dream successfully created and queued.                                                                            |
| `running`   | The pipeline is processing. `usage` updates as work progresses.                                                   |
| `completed` | Finished successfully. The `outputs` value is the new memory store.                                               |
| `failed`    | Dreaming run ended with an error. The output memory store is left as-is with whatever was written before failure. |
| `canceled`  | Dreaming run canceled. The output memory store is left as-is.                                                     |

### Watch the pipeline run

Once a dream is `running`, its `session_id` field points at the underlying [session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) running the pipeline. You can stream that session’s [events](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli) to observe what the dream is reading and writing in real time. The session is archived (not deleted) when the dream reaches a terminal state, so the transcript remains available afterward.

## Use the output

When `status` reaches `completed`, the `memory_store` entry in `outputs` references a fully populated store. It’s an ordinary memory store in your workspace. Review it with the [Memory Stores API](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli#view-and-edit-memories) or in the Claude Console, then either:

* **Use it:** attach it to future sessions as a `memory_store` resource in place of (or alongside) the input memory store, or
* **Discard it:** [delete the memory store](https://platform.claude.com/docs/en/api/beta/memory_stores/delete?sdk_languages=cli) or [archive the memory store](https://platform.claude.com/docs/en/api/beta/memory_stores/archive?sdk_languages=cli).

<CodeGroup>
  ```bash CLI
  # $output_store_id is the memory_store_id of the completed dream's memory_store output
  ant beta:sessions create <<YAML
  agent: $agent_id
  environment_id: $environment_id
  resources:
    - type: memory_store
      memory_store_id: $output_store_id
  YAML
  ```
</CodeGroup>

The dream itself never deletes or modifies its inputs. On `failed` or `canceled` the output store persists with partial contents so you can inspect what was produced before stopping; clean it up through the Memory Stores API if you don’t need it.

<Warning>
  While a dream is `pending` or `running`, the 400 guard applies to archiving the dream itself, not its stores. Archiving or deleting an *input* memory store mid-run (or deleting an input session) will cause the dream to fail with `input_memory_store_unavailable` or `input_session_unavailable`.
</Warning>

## Cancel a dream

Cancel moves a `pending` or `running` dream to `canceled` immediately. Canceling an already-`canceled` dream is an idempotent no-op; canceling a `completed` or `failed` dream returns 400.

<Note>
  After cancellation, the dream’s `usage` fields might continue to update for a few seconds while in-flight work winds down. Poll the dream until `usage` stabilizes if you need the final count.
</Note>

<CodeGroup>
  ```bash CLI
  ant beta:dreams cancel --dream-id "$dream_id"
  ```
</CodeGroup>

## Archive a dream

Archive sets `archived_at` on a dream that has reached a terminal state (`completed`, `failed`, or `canceled`); `status` is left unchanged. Archived dreams are excluded from default list responses but remain readable by ID. Archiving an already-archived dream is an idempotent no-op. Archiving a `pending` or `running` dream returns 400; cancel it first. There is no unarchive.

<CodeGroup>
  ```bash CLI
  ant beta:dreams archive --dream-id "$dream_id"
  ```
</CodeGroup>

Archiving a dream does not touch its output memory store; manage that separately through the [Memory Stores API](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli#view-and-edit-memories).

## List dreams

Returns all non-archived dreams in the workspace, newest first. Use `limit` (default 20, max 100) and the `page` cursor to paginate. Set `include_archived` to `true` to include archived dreams.

<CodeGroup>
  ```bash CLI
  ant beta:dreams list --limit 20
  ```
</CodeGroup>

## Errors

A non-exhaustive list of possible dreaming errors follows.

| `error.type`                      | When                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `timeout`                         | The pipeline exceeded its runtime budget.                                                       |
| `internal_error`                  | Unclassified pipeline failure.                                                                  |
| `memory_store_org_limit_exceeded` | Your organization hit its memory-store cap while the pipeline was provisioning working storage. |
| `input_memory_store_too_large`    | The input memory store exceeds the pipeline’s size limit.                                       |
| `input_memory_store_unavailable`  | The input memory store was archived or deleted after the dream was created.                     |
| `input_session_unavailable`       | An input session was deleted after the dream was created.                                       |

## Billing

Dreams are billed at standard API token rates for the model you select; `usage` on the resource reports the exact totals. Cost scales roughly linearly with the number and length of input sessions. Start with a small batch of sessions and scale up once you’re satisfied with the curation quality.

## Limits

| Limit                 | Value                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sessions per dream    | 100                                                                                                                                                                         |
| `instructions` length | 4,096 characters                                                                                                                                                            |
| Supported models      | `claude-opus-5-5`, `claude-fable-5-1`, `claude-opus-5`, `claude-fable-5`, `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-5-5`, `claude-sonnet-5`, `claude-sonnet-4-6` |

Default rate limits apply to dream creation while this feature is in research preview. [Contact support](https://support.claude.com) if you need higher limits.

## Availability

Dreams are in research preview on select models.

### API support

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Available

| Status           | Cloud platforms | Models                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Research preview | Claude API      | [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview?sdk_languages=cli), [Claude Fable 5](https://platform.claude.com/docs/en/models/fable-5/overview?sdk_languages=cli), Claude Mythos Preview, [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview?sdk_languages=cli), [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview?sdk_languages=cli), [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview?sdk_languages=cli), [Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/overview?sdk_languages=cli), [Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-4-8/overview?sdk_languages=cli), [Claude Opus 4.7](https://platform.claude.com/docs/en/models/opus-4-7/overview?sdk_languages=cli), [Claude Sonnet 4.6](https://platform.claude.com/docs/en/models/sonnet-4-6/overview?sdk_languages=cli) |

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `managed-agents-2026-04-01`
* `dreaming-2026-04-21`

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                      | HIPAA                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Status  | Not eligible                                                                                                                                             | Not eligible                                                                 |
| Details | Sessions are stateful resources; transcripts persist until you delete them. Applies to all Managed Agents sub-features, including Self-hosted sandboxes. | Applies to all Managed Agents sub-features, including Self-hosted sandboxes. |

Applicable endpoints:

* `/v1/agents`
* `/v1/sessions`
* `/v1/environments`
