---
title: Preview responses with event deltas
url: https://platform.claude.com/docs/en/managed-agents/event-deltas
description: Render the agent's response text as a live preview while the model is still generating it.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

By default, the agent's response text reaches the [session event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli) as buffered `agent.message` events. Each one is emitted only after the model request that produced it finishes. Event deltas let you render that text incrementally, as a live preview, while the model is still generating it.

Previews are a best-effort display aid, and the buffered `agent.message` is always the authoritative record. A client that ignores previews still receives a complete, correct stream.

## Opt in to previews

Previews are opt-in per stream connection. Add the `event_deltas[]` query parameter to the stream you're reading, and repeat it once for each event type you want previewed. The accepted values are `agent.message` and `agent.thinking`. Any other value returns a 400 error, as does a request with more than 100 values.

Both stream endpoints accept the parameter:

* **Session-level stream:** `GET /v1/sessions/{session_id}/events/stream`
* **Session thread stream:** `GET /v1/sessions/{session_id}/threads/{thread_id}/stream`

A subagent's previews appear on [that subagent's own thread stream](https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli#preview-session-thread-events).

`[]` is a shell glob pattern, so quote the URL whenever you build the request in a shell. The examples percent-encode the brackets as `%5B%5D`, which also works.

### Preview events

When a previewed event begins, the stream emits an `event_start` carrying the upcoming event's type and `id`:

```json
{
  "type": "event_start",
  "event": {
    "type": "agent.message",
    "id": "sevt_01abc..."
  }
}
```

For `agent.message`, the start is followed by `event_delta` events carrying incremental text. Each delta names the event it extends in `event_id` and the content block it extends in `delta.index`:

```json
{
  "type": "event_delta",
  "event_id": "sevt_01abc...",
  "delta": {
    "type": "content_delta",
    "index": 0,
    "content": {
      "type": "text",
      "text": "Here is the summary"
    }
  }
}
```

For `agent.thinking`, only the `event_start` is emitted, as a signal that a thinking block has started. No `event_delta` events follow. The buffered `agent.thinking` event that concludes the preview is a progress signal and carries no thinking content.

Unlike persisted events, `event_start` and `event_delta` have no `id` or `processed_at` of their own. The only identifier they carry is the `id` of the event they preview. Their type strings are also the exception to the `{domain}.{action}` naming convention of persisted events.

<Note>
  Event deltas use a different wire format from [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli), and the difference is intentional. A previewed `agent.message` gets a single `event_start` followed only by `event_delta` events. There are no per-content-block start or stop events and no stop event for the previewed event itself. The delta type is `content_delta`, not `content_block_delta`. Accumulator code written for the Messages API does not carry over unchanged.
</Note>

## Accumulate and reconcile

Every SDK that supports event deltas includes an [accumulator helper](https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli#sdk-accumulator-helpers) that handles the `index` bookkeeping for you. The manual pattern in this section works in every language when you need custom bookkeeping. Apply it to the generated event types.

In the manual pattern, hold preview text in a temporary map keyed by `(event_id, index)`, and treat the buffered event as the record. Reconcile the two per model request.

A turn opens with a single `session.status_running` event. On a turn that completes normally, each model request then produces these events, in order:

1. `span.model_request_start`
2. `event_start`
3. The `event_delta` events
4. The buffered `agent.message`
5. [`span.model_request_end`](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types) (in the Span events tab)

On the wire, this is the previewed portion of that sequence, interleaved with the connection's other buffered events:

```text wrap
event_start     {"event": {"type": "agent.message", "id": "sevt_01abc..."}}
event_delta     {"event_id": "sevt_01abc...", "delta": {"type": "content_delta", "index": 0, "content": {"type": "text", "text": "..."}}}
...
agent.message   {"id": "sevt_01abc...", "content": [...]}
```

The `event_delta` line repeats once per text fragment. Process each event as it arrives:

1. On `event_start`, note the announced `id`. The identifiers always line up: `event_start.event.id`, every `event_delta.event_id`, and the buffered `agent.message`'s `id` are the same value.
2. On each `event_delta`, append `delta.content.text` to the entry at `(event_id, delta.index)` and render the running text. The first delta for an `index` creates that entry.
3. When the buffered `agent.message` arrives, match it by `id`, discard the accumulated preview, and render the message's content instead.
4. On `span.model_request_end`, close any preview that has not been reconciled by its buffered event. No more deltas are coming for it. If the turn errors or is interrupted, the buffered event might never arrive, but `span.model_request_end` still does.

The pattern relies on two guarantees:

* Concatenating a preview's deltas in arrival order, keyed by `(event_id, index)`, gives a prefix of `content[index].text` in the buffered event. It is not necessarily the whole text, because deltas might be [shed under load](https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli#limitations).
* A connection emits at most one `event_start` per `event_id`, and the buffered event is the last thing that connection delivers for that `id`.

### SDK accumulator helpers

Each SDK's helper handles the `index` bookkeeping. The Go, Java, Ruby, and C# helpers also key the accumulating preview by the event's `id`. With the Python, TypeScript, and PHP helpers, keep that map yourself and fold each delta into the entry for its `id`.

The following examples opt in to `agent.message` previews and reconcile them with the buffered event:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Preview session thread events

In a [multiagent](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli) session, every session thread has its own event stream. It takes the same `event_deltas[]` parameter with the same values.

A connection previews only the thread it's reading. The session-level stream previews the primary thread, and a child thread's previews are never cross-posted to it. To watch a subagent's text as the model generates it, open that subagent's thread stream.

A thread stream's path ends in `/threads/{thread_id}/stream`. `/events/stream` exists only at the session level, so there is no `/threads/{thread_id}/events/stream` endpoint.

`event_start` and `event_delta` have the same shape on a thread stream as on the session-level stream, and the [accumulate and reconcile](https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli#accumulate-and-reconcile) pattern applies as written. Run one accumulator instance per stream connection.

<CodeGroup>
  ```bash CLI
  # The thread stream takes the same event_deltas parameter as the session stream,
  # one --event-delta flag per event type to preview.
  ant beta:sessions:threads:events stream \
    --session-id "$SESSION_ID" \
    --thread-id "$THREAD_ID" \
    --event-delta agent.message
  ```
</CodeGroup>

The read loop exits on [`session.thread_status_idle`](https://platform.claude.com/docs/en/managed-agents/reference?sdk_languages=cli#event-types), the event emitted when the session thread's turn finishes and the thread goes idle.

## Limitations

* **Best effort:** Under load, the server might shed deltas for an event. When it does, you receive a contiguous prefix of the text and then no further deltas for that event. The buffered `agent.message` still arrives complete. Never treat an accumulated preview as final.
* **No replay on reconnect:** Deltas are delivered only to the connection that opted in, while it is open. This applies to the session-level stream and to each session thread stream alike. A connection opened after a model request started receives no deltas for that in-flight event. There is no way to re-request missed deltas.
* **One thread, text only:** Previews cover assistant text on [the thread the connection is reading](https://platform.claude.com/docs/en/managed-agents/event-deltas?sdk_languages=cli#preview-session-thread-events). Tool use, tool results, and MCP results are never previewed.
* **Never persisted:** `event_start` and `event_delta` exist only on the live stream. They do not appear in the session's event history (`GET /v1/sessions/{session_id}/events`) or in any session thread's event history.

## Troubleshoot previews

| You see                                                             | What it means                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A stream with buffered events but no `event_start` or `event_delta` | The connection you're reading didn't opt in, or the turn never touched the thread you're streaming. `event_deltas[]` applies per connection, not per session. To find which thread ran, list the session's threads (`GET /v1/sessions/{session_id}/threads`).                                                                                                                  |
| A stream that drops during a preview                                | Deltas are not replayed. Follow the [reconnect procedure](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#reconnect-without-missing-events): reopen the stream and list the event history. The history includes any buffered events emitted while you were disconnected, including the `agent.message` your preview was waiting for. |
| A 404 on the stream URL                                             | The path or an ID is wrong, or the request carries no managed-agents beta header at all. The thread endpoints are beta-gated, so without the header they don't exist.                                                                                                                                                                                                          |
| A 400 naming `event_deltas`                                         | Only `agent.message` and `agent.thinking` are accepted.                                                                                                                                                                                                                                                                                                                        |

## Next steps

<CardGroup cols={2}>
  <Card title="Session event stream" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli">
    Send events, stream responses, and interrupt or redirect your session mid-execution.
  </Card>

  <Card title="Multiagent orchestration" icon="stack" href="https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli">
    Coordinate multiple agents within a single session.
  </Card>
</CardGroup>
