---
title: Fine-grained tool streaming
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming
description: Stream tool inputs without server-side JSON buffering for latency-sensitive applications.
---

<Note>
  To learn how zero data retention (ZDR) applies to this feature, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli).
</Note>

Fine-grained tool streaming delivers a tool's input to your client as Claude generates it, without server-side buffering or JSON validation. Skipping the buffering step reduces the time to the first fragment of a large parameter, such as a document or a block of code, and the fragments arrive through the same [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli) events as standard tool use.

<Warning>
  Because the API does not buffer or validate a tool's input before streaming it, you might receive partial or invalid JSON. A response that ends with the [stop reason](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli) `max_tokens` can also cut a parameter off midway. Accumulate the fragments, guard the parse, and see [Handling invalid JSON in tool responses](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming?sdk_languages=cli#handling-invalid-json-in-tool-responses) for how to return unparseable input to Claude.
</Warning>

## How to use fine-grained tool streaming

All models support fine-grained tool streaming on the Claude API, [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli), and [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli). To use it, set `eager_input_streaming` to `true` on any user-defined tool where you want fine-grained streaming enabled, and enable streaming on your request.

The `eager_input_streaming` field is optional. Setting it to `true` turns on fine-grained streaming for that tool, and omitting it gives you standard buffered streaming, in which the API buffers and validates each parameter value before streaming it back. The exception is a request that still sends the legacy `fine-grained-tool-streaming-2025-05-14` beta header, which turns fine-grained streaming on for tools that leave the field unset. The per-tool field replaces that header, and an explicit `false` keeps buffered streaming for a tool even when a request still sends it. The legacy header cannot be combined with a [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli) or [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli) toolset entry: the API rejects a request that sends both, so remove the header and set `eager_input_streaming` on the user-defined tools that need it. See [Tool reference](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference?sdk_languages=cli) for the field definition.

The following example turns on fine-grained streaming for a `make_file` tool and asks Claude for a long poem, so the tool input is large enough to watch it stream in:

<CodeGroup>
  ```bash CLI
  ant messages create --stream <<'YAML'
  model: claude-opus-5-5
  max_tokens: 65536
  tools:
    - name: make_file
      description: Write text to a file
      eager_input_streaming: true
      input_schema:
        type: object
        properties:
          filename:
            type: string
            description: The filename to write text to
          lines_of_text:
            type: array
            description: An array of lines of text to write to the file
        required:
          - filename
          - lines_of_text
  messages:
    - role: user
      content: Can you write a long poem and make a file called poem.txt?
  YAML
  ```
</CodeGroup>

Each input fragment arrives the moment Claude writes it, and the fragments join into the full tool input, so the poem arrives piece by piece:

```text wrap
{"filename": "poem.txt", "lines_of_text": ["The Wanderer's Journey", "", "I.", "", "Beneath the vast and star-strewn sky,", "Where silver moonbeams softly lie,", ...
Complete tool input: {"filename": "poem.txt", "lines_of_text": ["The Wanderer's Journey", ...]}
```

Without `eager_input_streaming`, the API buffers and validates each parameter value before streaming it back, so nothing prints for a large parameter until Claude has finished generating it. With it, fragments arrive from the moment Claude starts the parameter, and they are typically longer, with fewer mid-word breaks.

## Accumulating tool input deltas

The accumulation contract is the same as for standard tool-use streaming, so this section applies with and without `eager_input_streaming`. See [Input JSON delta](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli#input-json-delta) in Streaming messages for the event format. Fine-grained tool streaming changes what you can assume about the result: the server streams fragments without validating them, so the accumulated string might not be valid JSON.

When a `tool_use` content block streams, the initial `content_block_start` event contains `input: {}` (an empty object). This is a placeholder. The actual input arrives as a series of `input_json_delta` events, each carrying a `partial_json` string fragment. To assemble the full input, concatenate these fragments and parse the result when the block closes.

Where your SDK provides an accumulator helper (as the Python, TypeScript, Go, Java, and Ruby tabs in the previous example do), it handles this for you. Use the manual pattern when your SDK has no helper or when you want full control over how the input is assembled.

The accumulation contract:

1. On `content_block_start` with `type: "tool_use"`, initialize an empty string: `input_json = ""`.
2. For each `content_block_delta` with `type: "input_json_delta"`, append: `input_json += event.delta.partial_json`.
3. On `content_block_stop`, parse the accumulated string.

Guard the parse, as the following SDK example does. A response can also stop at `max_tokens` midway through a parameter. Check the [stop reason](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli) and decide whether to retry the request with a higher `max_tokens` or repair the partial input.

The type mismatch between the initial `input: {}` (object) and `partial_json` (string) is by design. The empty object marks the slot in the content array. The delta strings build the real value.

<CodeGroup exclude="shell">
  <CodeGroupItem language="CLI">
    Accumulating the input fragments of each `tool_use` block needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) for this. To see the raw fragments as they stream, run the request in [How to use fine-grained tool streaming](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming?sdk_languages=cli#how-to-use-fine-grained-tool-streaming).
  </CodeGroupItem>
</CodeGroup>

<Tip>
  Reacting to fragments and assembling them are separate concerns. The first example reacts to each fragment as it arrives and still hands assembly to the SDK in the tabs that use an accumulator helper. Use the manual pattern when you are not using an accumulator helper or when you want full control over assembly.
</Tip>

## Handling invalid JSON in tool responses

With fine-grained tool streaming, the accumulated input for a tool call might be invalid or incomplete JSON. When it is, you cannot run the tool, so report the failure back to Claude instead. The `content` of a tool result does not have to be JSON, but wrapping the raw string in a JSON object under a single key makes it unambiguous to Claude that you received invalid JSON, and preserves the original input for debugging:

```json
{
  "INVALID_JSON": "<the unparseable input you received>"
}
```

Return the wrapper, serialized to a string, as the `content` of a [tool result](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli#handling-errors-with-is-error) content block with `is_error` set to `true`:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "is_error": true,
  "content": "{\"INVALID_JSON\": \"<the unparseable input you received>\"}"
}
```

<Note>
  Build the wrapper with your JSON library rather than by concatenating strings, so quotes and other special characters in the invalid input are escaped correctly.
</Note>

## Next steps

<CardGroup cols={2}>
  <Card title="Context windows" icon="stack" href="https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli">
    Understand how the context window works, how extended thinking and tool use count toward it, and how to manage context as conversations grow.
  </Card>

  <Card title="Streaming messages" icon="lightning" href="https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli">
    Stream Messages API responses incrementally with server-sent events, including text, tool use, and extended thinking deltas.
  </Card>

  <Card title="Handle tool calls" icon="arrows-left-right" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli">
    Parse `tool_use` blocks, format `tool_result` responses, and handle errors with `is_error`.
  </Card>

  <Card title="Tool reference" icon="book" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference?sdk_languages=cli">
    Directory of Anthropic-provided tools and reference for optional tool definition properties.
  </Card>
</CardGroup>
