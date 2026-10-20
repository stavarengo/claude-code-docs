---
title: "Tutorial: Build a tool-using agent"
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent
description: A guided walkthrough from a single tool call to a production-ready agentic loop.
---

This tutorial builds a calendar-management agent in five concentric rings. Each ring is a complete, runnable program that adds exactly one concept to the ring before it. By the end you will have written the agentic loop by hand and then replaced it with the Tool Runner SDK abstraction.

The example tool is `create_calendar_event`. Its schema uses nested objects, arrays, and optional fields, so you will see how Claude handles realistic input shapes rather than a single flat string.

<Note>
  Every ring runs standalone. Copy any ring into a fresh file and it will run without the code from earlier rings.
</Note>

## Ring 1: Single tool, single turn

The smallest possible tool-using program: one tool, one user message, one tool call, one result. The code is heavily commented so you can map each line to the [tool use lifecycle](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works?sdk_languages=cli).

The request sends a `tools` array alongside the user message. When Claude determines that a tool call is needed, the response comes back with `stop_reason: "tool_use"` and a `tool_use` content block containing the tool name, a unique `id`, and the structured `input`. Your code runs the tool, then sends the result back in a `tool_result` block whose `tool_use_id` matches the `id` from the call.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

**What to expect**

```text Output wrap
stop_reason: tool_use
Tool: create_calendar_event
Input: {'title': 'Sync', 'start': '2026-03-30T10:00:00', 'end': '2026-03-30T10:30:00', 'attendees': ['alice@example.com', 'bob@example.com']}
stop_reason: end_turn
I've scheduled your 30-minute sync with Alice and Bob for Monday, March 30 at 10am.
```

The first `stop_reason` is `tool_use` because Claude is waiting for the calendar result. After you send the result, the second `stop_reason` is `end_turn` and the content is natural language for the user.

## Ring 2: The agentic loop

Ring 1 assumed Claude would call the tool exactly once. Real tasks often need several calls: Claude might create an event, read the confirmation, then create another. The fix is a `while` loop that keeps running tools and feeding results back until `stop_reason` is no longer `"tool_use"`.

The other change is conversation history. Instead of rebuilding the `messages` array from scratch on each request, keep a running list and append to it. Every turn sees the complete prior context.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

**What to expect**

```text Output wrap
I've set up your weekly team standup for the next 4 Mondays at 9am with Alice, Bob, and Carol invited.
```

The loop might run once or several times depending on how Claude breaks down the task. Your code no longer needs to know in advance.

## Ring 3: Multiple tools, parallel calls

Agents rarely have just one capability. Add a second tool, `list_calendar_events`, so Claude can check the existing schedule before creating something new.

When Claude has multiple independent tool calls to make, it might return several `tool_use` blocks in a single response. Your loop needs to process all of them and send back all results together in one user message. Iterate over every `tool_use` block in `response.content`, not just the first.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

**What to expect**

```text Output wrap
I checked your calendar for Monday, March 30 and found an existing meeting from 2pm to 3pm. I've scheduled the planning session for 10am to 11am to avoid the conflict.
```

For more on concurrent execution and ordering guarantees, see [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use?sdk_languages=cli).

## Ring 4: Error handling

Tools fail. A calendar API might reject an event with too many attendees, or a date might be malformed. When a tool raises an error, send the error message back with `is_error: true` instead of crashing. Claude reads the error and can retry with corrected input, ask the user for clarification, or explain the limitation.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

**What to expect**

```text Output wrap
I tried to schedule the all-hands but the calendar only allows 10 attendees per event. I can split this into two sessions, or you can let me know which 10 people to prioritize.
```

The `is_error` flag is the only difference from a successful result. Claude sees the flag and the error text, and responds accordingly. See [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli) for the full error-handling reference.

## Ring 5: The Tool Runner SDK abstraction

Rings 2 through 4 wrote the same loop by hand: call the API, check `stop_reason`, run tools, append results, repeat. The Tool Runner does this for you. Define each tool as a function, pass the list to `client.beta.messages.tool_runner()`, and retrieve the final message once the loop completes. Error wrapping, result formatting, and conversation management are handled internally.

Each SDK provides a helper that turns an ordinary function into a runnable tool and derives the input schema from its signature; the following tabs show the idiomatic form for each language.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    The Tool Runner is a helper in the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli). The `ant` CLI has no equivalent.
  </CodeGroupItem>
</CodeGroup>

**What to expect**

```text Output wrap
I checked your calendar for Monday, March 30 and found an existing meeting from 2pm to 3pm. I've scheduled the planning session for 10am to 11am to avoid the conflict.
```

The output is identical to Ring 3. The difference is in the code: roughly half the lines, no manual loop, and the schema lives next to the implementation.

## What you built

You started with a single hardcoded tool call and ended with a production-shaped agent that handles multiple tools, parallel calls, and errors, then collapsed all of that into the Tool Runner. Along the way you saw every piece of the tool-use protocol: `tool_use` blocks, `tool_result` blocks, `tool_use_id` matching, `stop_reason` checking, and `is_error` signaling.

## Next steps

<CardGroup>
  <Card href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=cli" title="Define tools">
    Schema specification and best practices.
  </Card>

  <Card href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner?sdk_languages=cli" title="Tool Runner">
    The full SDK abstraction reference.
  </Card>

  <Card href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use?sdk_languages=cli" title="Troubleshooting">
    Fix common tool-use errors.
  </Card>
</CardGroup>
