---
title: Streaming messages
url: https://platform.claude.com/docs/en/build-with-claude/streaming
description: Stream Messages API responses incrementally with server-sent events, including text, tool use, and thinking deltas.
featureMetadata:
  status: stable
  supportedModels:
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
    - claude-opus-4-5-20251101
    - claude-sonnet-4-5-20250929
  supportedPlatforms:
    Claude API: stable
    Claude Platform on AWS: stable
    Claude Models on Google Cloud (Anthropic managed): stable
    Amazon Bedrock: stable
    Amazon Bedrock (InvokeModel):
      availability: stable
      note: The older Amazon Bedrock InvokeModel integration does not stream plain server-sent events.
    Claude Models on Google Cloud (Google managed): stable
    Microsoft Foundry: stable
---

When creating a Message, you can set `"stream": true` to incrementally stream the response using [server-sent events](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).

## Streaming with SDKs

The [Python SDK](https://github.com/anthropics/anthropic-sdk-python) and [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript) offer multiple ways of streaming. The [PHP SDK](https://github.com/anthropics/anthropic-sdk-php) provides streaming through `createStream()`. The Python SDK allows both sync and async streams. See the documentation in each SDK for details.

<CodeGroup exclude="shell:cURL">
  ```bash CLI
  ant messages create --stream \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello"}'
  ```
</CodeGroup>

## Get the final message without handling events

If you don’t need to process text as it arrives, the SDK provides a way to use streaming internally while returning the complete `Message` object, identical to what `client.messages.create()` returns. This is especially useful for requests with large `max_tokens` values, where the SDK requires streaming to avoid HTTP timeouts.

<CodeGroup exclude="shell:cURL">
  ```bash CLI
  # The ant CLI's --stream flag emits one event on each line and does not
  # accumulate into a final Message. For long generations, stream the
  # raw events:
  ant messages create --stream --format jsonl <<'YAML'
  model: claude-opus-5-5
  max_tokens: 128000
  messages:
    - role: user
      content: Write a detailed analysis...
  YAML
  ```
</CodeGroup>

The `.stream()` call keeps the HTTP connection alive with server-sent events, and then the SDK’s message-accumulation helper, `stream.get_final_message()`, collects all events into the complete `Message` object.

## Event types

Each server-sent event includes a named event type and associated JSON data. Each event uses an SSE event name (for example, `event: message_stop`), and includes the matching event `type` in its data.

Each stream uses the following event flow:

1. `message_start`: contains a `Message` object with empty `content`. Under the [`thinking-binding-controls-2026-08-01`](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#preserved-thinking-controls) beta header, this `Message` object also carries the `input_transformations` array. After a mid-stream [server-side fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback), the final `message_delta` event carries the array again with the serving model’s entries.
2. A series of content blocks, each of which has a `content_block_start`, one or more `content_block_delta` events, and a `content_block_stop` event. Each content block has an `index` that corresponds to its index in the final Message `content` array. One exception: during [server-side fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback) responses, a `fallback` content block arrives at each model boundary as a `content_block_start` and `content_block_stop` pair with no deltas in between.
3. One or more `message_delta` events, indicating top-level changes to the final `Message` object.
4. A final `message_stop` event.

<Warning>
  The token counts shown in the `usage` field of the `message_delta` event are *cumulative*.
</Warning>

### Ping events

Event streams might also include any number of `ping` events.

### Error events

The API might occasionally send [errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli) in the event stream. For example, during periods of high usage, you might receive an `overloaded_error`, which would normally correspond to an HTTP 529 in a non-streaming context:

```sse Example error
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Other events

In accordance with the [versioning policy](https://platform.claude.com/docs/en/api/versioning?sdk_languages=cli), new event types may be added, and your code should handle unknown event types gracefully.

## Content block delta types

Each `content_block_delta` event contains a `delta` of a type that updates the `content` block at a given `index`.

### Text delta

A `text` content block delta looks like:

```sse Text delta
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
```

### Input JSON delta

The deltas for `tool_use` content blocks correspond to updates for the `input` field of the block. To support maximum granularity, the deltas are *partial JSON strings*, whereas the final `tool_use.input` is always an *object*.

You can accumulate the string deltas and parse the JSON once you receive a `content_block_stop` event, by using a library such as [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) to do partial JSON parsing, or by using the SDK’s [streaming helpers](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli#streaming-with-sdks). In the Python and TypeScript SDKs, these helpers also give you access to the parsed `input` incrementally, as it streams.

A `tool_use` content block delta looks like:

```sse Input JSON delta
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```

Note: Current models only support emitting one complete key and value property from `input` at a time. As such, when using tools, there might be delays between streaming events while the model is working. Once an `input` key and value are accumulated, they are emitted as multiple `content_block_delta` events with chunked partial JSON so that the format can automatically support finer granularity in future models.

### Thinking delta

When using [thinking with streaming enabled](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#streaming-thinking), you’ll receive thinking content through `thinking_delta` events. These deltas correspond to the `thinking` field of the `thinking` content blocks.

For thinking content, a special `signature_delta` event is sent just before the `content_block_stop` event. This signature is used to verify the integrity of the thinking block.

When `display: "omitted"` is set on the thinking configuration, no thinking text is streamed. The thinking block opens, receives a `thinking_delta` with an empty `thinking` string and then a single `signature_delta`, and closes. With `display: "updates"` (beta), reasoning blocks stream the same way, and only the [progress updates](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#progress-updates) that some models write between tool calls stream `thinking_delta` events that carry text. See [Controlling thinking display](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#controlling-thinking-display).

A typical thinking delta looks like:

```sse Thinking delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "I need to find the GCD of 1071 and 462 using the Euclidean algorithm.\n\n1071 = 2 × 462 + 147"}}
```

The signature delta looks like:

```sse Signature delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## Full HTTP stream response

Use the [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) when using streaming mode. However, if you are building a direct API integration, you need to handle these events yourself.

A stream response consists of:

1. A `message_start` event

2. Potentially multiple content blocks, each of which contains:

   * A `content_block_start` event
   * Potentially multiple `content_block_delta` events
   * A `content_block_stop` event

3. One or more `message_delta` events

4. A `message_stop` event

There might be `ping` events dispersed throughout the response as well. See [Event types](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli#event-types) for more details on the format.

### Basic streaming request

<CodeGroup>
  ```bash CLI
  ant messages create --stream --format jsonl \
    --model claude-opus-5-5 \
    --max-tokens 256 \
    --message '{role: user, content: Hello}'
  ```
</CodeGroup>

```sse Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-5-5", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### Streaming request with tool use

<Tip>
  Tool use supports [fine-grained streaming](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming?sdk_languages=cli) for parameter values. Enable it on individual tools with `eager_input_streaming`.
</Tip>

This request asks Claude to use a tool to report the weather.

<CodeGroup>
  ```bash CLI
  ant messages create --stream --format jsonl <<'YAML'
  model: claude-opus-5
  max_tokens: 1024
  tools:
    - name: get_weather
      description: Get the current weather in a given location
      input_schema:
        type: object
        properties:
          location:
            type: string
            description: The city and state, e.g. San Francisco, CA
        required:
          - location
  tool_choice:
    type: any
  messages:
    - role: user
      content: What is the weather like in San Francisco?
  YAML
  ```
</CodeGroup>

```sse Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-opus-5","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
```

### Streaming request with thinking

This request enables thinking with streaming. The `display: "summarized"` setting streams a condensed summary of Claude’s reasoning rather than the full chain of thought.

<CodeGroup>
  ```bash CLI
  ant messages create --stream --format jsonl \
    --model claude-opus-5-5 \
    --max-tokens 20000 \
    --thinking '{type: adaptive, display: summarized}' \
    --message '{role: user, content: What is the greatest common divisor of 1071 and 462?}'
  ```
</CodeGroup>

```sse Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-5-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": "", "signature": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "I need to find the GCD of 1071 and 462 using the Euclidean algorithm.\n\n1071 = 2 × 462 + 147"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n462 = 3 × 147 + 21"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n147 = 7 × 21 + 0"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\nThe remainder is 0, so GCD(1071, 462) = 21."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "The greatest common divisor of 1071 and 462 is **21**."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

### Streaming request with web search tool use

This request asks Claude to search the web for current weather information.

<CodeGroup>
  ```bash CLI
  ant messages create --stream --format jsonl \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --tool '{type: web_search_20250305, name: web_search, max_uses: 5}' \
    --message '{role: user, content: What is the weather like in New York City today?}'
  ```
</CodeGroup>

```sse Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-opus-5-5","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'll check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the current weather in New York City for you"}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"server_tool_use","id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","name":"web_search","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"query"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" NY"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"C to"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"day\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1 }

event: content_block_start
data: {"type":"content_block_start","index":2,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web_search_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new_york/may-2025/","encrypted_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page_age":null},...]}}

event: content_block_stop
data: {"type":"content_block_stop","index":2}

event: content_block_start
data: {"type":"content_block_start","index":3,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Here's the current weather information for New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" in New York City"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"\n\n"}}

...

event: content_block_stop
data: {"type":"content_block_stop","index":17}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":10682,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":510,"server_tool_use":{"web_search_requests":1}}}

event: message_stop
data: {"type":"message_stop"}
```

## Error recovery

### Claude 4.5 and earlier

For Claude 4.5 models and earlier, you can recover a streaming request that was interrupted because of network issues, timeouts, or other errors by resuming from where the stream was interrupted. This approach saves you from re-processing the entire response.

The basic recovery strategy involves:

1. **Capture the partial response:** Save all content that was successfully received before the error occurred.
2. **Construct a continuation request:** Create a new API request that includes the partial assistant response as the beginning of a new assistant message.
3. **Resume streaming:** Continue receiving the rest of the response from where it was interrupted.

### Claude 4.6 and later

For Claude 4.6 and later models, the same capture-and-resume strategy applies, but step 2 changes: instead of placing the partial response in an assistant message, add a user message that instructs the model to continue from where it left off.

1. **Capture the partial response:** Save all content that was successfully received before the error occurred.
2. **Construct a continuation request:** Create a new API request with a user message containing the partial response and an instruction to continue, for example:
   ```text Sample prompt wrap
   Your previous response was interrupted and ended with [previous_response]. Continue from where you left off.
   ```
3. **Resume streaming:** Continue receiving the rest of the response from where it was interrupted.

### Error recovery best practices

1. **Use SDK features:** Rely on the SDK’s built-in message accumulation and error handling capabilities.
2. **Handle content types:** Be aware that messages can contain multiple content blocks (`text`, `tool_use`, `thinking`). Tool use and thinking blocks cannot be partially recovered. You can resume streaming from the most recent text block.

## Next steps

<CardGroup cols={2}>
  <Card title="Stop reasons and fallback" icon="list" href="https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli">
    Handle each `stop_reason` value once a stream completes.
  </Card>

  <Card title="Fine-grained tool streaming" icon="wrench" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming?sdk_languages=cli">
    Stream tool input JSON without server-side buffering for lower latency.
  </Card>

  <Card title="Thinking" icon="brain" href="https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli">
    Stream thinking output with `thinking_delta` and `signature_delta` events.
  </Card>

  <Card title="Client SDKs" icon="code" href="https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli">
    Use the official SDKs, which handle streaming, accumulation, and reconnection for you.
  </Card>

  <Card title="Batch processing" icon="stack" href="https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli">
    Process large volumes of requests asynchronously when you don’t need real-time responses.
  </Card>
</CardGroup>

## Availability

Message streaming is available on every model.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Available

| Status                | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Available             | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) |
| Available<sup>1</sup> | [Amazon Bedrock (InvokeModel)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

1. The older Amazon Bedrock InvokeModel integration does not stream plain server-sent events.
