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

<CodeGroup>
  ```bash CLI
  #!/usr/bin/env bash
  # Ring 1: Single tool, single turn.
  # Uses jq for cross-turn message-array state — building an agentic loop in shell
  # requires JSON manipulation beyond ant's single-call --transform scope.
  set -euo pipefail

  USER_MSG="Schedule a 30-minute sync with alice@example.com and bob@example.com on Monday, March 30, 2026 at 10am."
  MESSAGES=$(jq -n --arg msg "$USER_MSG" '[{role: "user", content: $msg}]')

  # Define one tool. The input_schema is a JSON Schema object describing
  # the arguments Claude should pass when it calls this tool. This schema
  # includes nested objects (recurrence), arrays (attendees), and optional
  # fields, which is closer to real-world tools than a flat string argument.
  call_api() {
    # ant reads the request body as YAML on stdin: no auth headers, no
    # hand-built JSON envelope. The static keys (model, tools, tool_choice)
    # live in a quoted heredoc; the growing messages array is appended as
    # JSON, which YAML accepts as flow syntax.
    {
      cat <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  tool_choice: {type: auto, disable_parallel_tool_use: true}
  tools:
    - name: create_calendar_event
      description: Create a calendar event with attendees and optional recurrence.
      input_schema:
        type: object
        properties:
          title: {type: string}
          start: {type: string, format: date-time}
          end: {type: string, format: date-time}
          attendees:
            type: array
            items: {type: string, format: email}
          recurrence:
            type: object
            properties:
              frequency: {enum: [daily, weekly, monthly]}
              count: {type: integer, minimum: 1}
        required: [title, start, end]
  YAML
      printf 'messages: %s\n' "$MESSAGES"
    } | ant messages create --format json
  }

  # Send the user's request along with the tool definition. Claude decides
  # whether to call the tool based on the request and the tool description.
  RESPONSE=$(call_api)

  # When Claude calls a tool, the response has stop_reason "tool_use"
  # and the content array contains a tool_use block alongside any text.
  echo "stop_reason: $(jq -r '.stop_reason' <<<"$RESPONSE")"

  # Find the tool_use block. A response may contain text blocks before the
  # tool_use block, so filter by type rather than assuming position.
  TOOL_USE=$(jq '.content[] | select(.type == "tool_use")' <<<"$RESPONSE")
  TOOL_USE_ID=$(jq -r '.id' <<<"$TOOL_USE")
  echo "Tool: $(jq -r '.name' <<<"$TOOL_USE")"
  echo "Input: $(jq -c '.input' <<<"$TOOL_USE")"

  # Execute the tool. In a real system this would call your calendar API.
  # Here the result is hardcoded to keep the example self-contained.
  RESULT='{"event_id": "evt_123", "status": "created"}'

  # Send the result back. The tool_result block goes in a user message and
  # its tool_use_id must match the id from the tool_use block above. The
  # assistant's previous response is included so Claude has the full history.
  MESSAGES=$(jq \
    --argjson assistant "$(jq '.content' <<<"$RESPONSE")" \
    --arg tool_use_id "$TOOL_USE_ID" \
    --arg result "$RESULT" \
    '. + [
      {role: "assistant", content: $assistant},
      {role: "user", content: [
        {type: "tool_result", tool_use_id: $tool_use_id, content: $result}
      ]}
    ]' <<<"$MESSAGES")

  FOLLOWUP=$(call_api)

  # With the tool result in hand, Claude produces a final natural-language
  # answer and stop_reason becomes "end_turn".
  echo "stop_reason: $(jq -r '.stop_reason' <<<"$FOLLOWUP")"
  jq -r '.content[] | select(.type == "text") | .text' <<<"$FOLLOWUP"
  ```
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

<CodeGroup>
  ```bash CLI
  #!/usr/bin/env bash
  # Ring 2: The agentic loop.
  # Uses jq for cross-turn message-array state — building an agentic loop in shell
  # requires JSON manipulation beyond ant's single-call --transform scope.
  set -euo pipefail

  run_tool() {
    local name="$1" input="$2"
    if [ "$name" = "create_calendar_event" ]; then
      jq -n --arg title "$(jq -r '.title' <<<"$input")" \
        '{event_id: "evt_123", status: "created", title: $title}'
    else
      printf '{"error": "Unknown tool: %s"}' "$name"
    fi
  }

  # Keep the full conversation history in a JSON array so each turn sees
  # prior context.
  MESSAGES='[{"role": "user", "content": "Schedule a weekly team standup every Monday at 9am for the next 4 weeks, starting Monday, March 30, 2026. Invite the whole team: alice@example.com, bob@example.com, carol@example.com."}]'

  call_api() {
    # ant reads the request body as YAML on stdin: no auth headers, no
    # hand-built JSON envelope. The static keys (model, tools, tool_choice)
    # live in a quoted heredoc; the growing messages array is appended as
    # JSON, which YAML accepts as flow syntax.
    {
      cat <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  tool_choice: {type: auto, disable_parallel_tool_use: true}
  tools:
    - name: create_calendar_event
      description: Create a calendar event with attendees and optional recurrence.
      input_schema:
        type: object
        properties:
          title: {type: string}
          start: {type: string, format: date-time}
          end: {type: string, format: date-time}
          attendees:
            type: array
            items: {type: string, format: email}
          recurrence:
            type: object
            properties:
              frequency: {enum: [daily, weekly, monthly]}
              count: {type: integer, minimum: 1}
        required: [title, start, end]
  YAML
      printf 'messages: %s\n' "$MESSAGES"
    } | ant messages create --format json
  }

  RESPONSE=$(call_api)

  # Loop until Claude stops asking for tools. Each iteration runs the
  # requested tool, appends the result to history, and asks Claude to
  # continue.
  while [ "$(jq -r '.stop_reason' <<<"$RESPONSE")" = "tool_use" ]; do
    TOOL_USE=$(jq '.content[] | select(.type == "tool_use")' <<<"$RESPONSE")
    TOOL_NAME=$(jq -r '.name' <<<"$TOOL_USE")
    TOOL_INPUT=$(jq -c '.input' <<<"$TOOL_USE")
    TOOL_USE_ID=$(jq -r '.id' <<<"$TOOL_USE")
    RESULT=$(run_tool "$TOOL_NAME" "$TOOL_INPUT")

    MESSAGES=$(jq \
      --argjson assistant "$(jq '.content' <<<"$RESPONSE")" \
      --arg tool_use_id "$TOOL_USE_ID" \
      --arg result "$RESULT" \
      '. + [
        {role: "assistant", content: $assistant},
        {role: "user", content: [
          {type: "tool_result", tool_use_id: $tool_use_id, content: $result}
        ]}
      ]' <<<"$MESSAGES")

    RESPONSE=$(call_api)
  done

  jq -r '.content[] | select(.type == "text") | .text' <<<"$RESPONSE"
  ```
</CodeGroup>

**What to expect**

```text Output wrap
I've set up your weekly team standup for the next 4 Mondays at 9am with Alice, Bob, and Carol invited.
```

The loop might run once or several times depending on how Claude breaks down the task. Your code no longer needs to know in advance.

## Ring 3: Multiple tools, parallel calls

Agents rarely have just one capability. Add a second tool, `list_calendar_events`, so Claude can check the existing schedule before creating something new.

When Claude has multiple independent tool calls to make, it might return several `tool_use` blocks in a single response. Your loop needs to process all of them and send back all results together in one user message. Iterate over every `tool_use` block in `response.content`, not just the first.

<CodeGroup>
  ```bash CLI
  #!/usr/bin/env bash
  # Ring 3: Multiple tools, parallel calls.
  # Uses jq for cross-turn message-array state — building an agentic loop in shell
  # requires JSON manipulation beyond ant's single-call --transform scope.
  set -euo pipefail

  run_tool() {
    case "$1" in
      create_calendar_event)
        jq -n --arg title "$(jq -r '.title' <<<"$2")" \
          '{event_id: "evt_123", status: "created", title: $title}' ;;
      list_calendar_events)
        echo '{"events": [{"title": "Existing meeting", "start": "14:00", "end": "15:00"}]}' ;;
      *)
        printf '{"error": "Unknown tool: %s"}' "$1" ;;
    esac
  }

  MESSAGES='[{"role": "user", "content": "Check what I have on Monday, March 30, 2026, then schedule a one-hour planning session that day that avoids any conflicts."}]'

  call_api() {
    # ant reads the request body as YAML on stdin: no auth headers, no
    # hand-built JSON envelope. The static keys (model, tools) live in a
    # quoted heredoc; the growing messages array is appended as JSON,
    # which YAML accepts as flow syntax.
    {
      cat <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  tools:
    - name: create_calendar_event
      description: Create a calendar event with attendees and optional recurrence.
      input_schema:
        type: object
        properties:
          title: {type: string}
          start: {type: string, format: date-time}
          end: {type: string, format: date-time}
          attendees:
            type: array
            items: {type: string, format: email}
          recurrence:
            type: object
            properties:
              frequency: {enum: [daily, weekly, monthly]}
              count: {type: integer, minimum: 1}
        required: [title, start, end]
    - name: list_calendar_events
      description: List all calendar events on a given date.
      input_schema:
        type: object
        properties:
          date: {type: string, format: date}
        required: [date]
  YAML
      printf 'messages: %s\n' "$MESSAGES"
    } | ant messages create --format json
  }

  RESPONSE=$(call_api)

  while [ "$(jq -r '.stop_reason' <<<"$RESPONSE")" = "tool_use" ]; do
    # A single response can contain multiple tool_use blocks. Process all
    # of them and return all results together in one user message.
    TOOL_RESULTS='[]'
    while read -r block; do
      NAME=$(jq -r '.name' <<<"$block")
      INPUT=$(jq -c '.input' <<<"$block")
      ID=$(jq -r '.id' <<<"$block")
      RESULT=$(run_tool "$NAME" "$INPUT")
      TOOL_RESULTS=$(jq --arg id "$ID" --arg result "$RESULT" \
        '. + [{type: "tool_result", tool_use_id: $id, content: $result}]' \
        <<<"$TOOL_RESULTS")
    done < <(jq -c '.content[] | select(.type == "tool_use")' <<<"$RESPONSE")

    MESSAGES=$(jq \
      --argjson assistant "$(jq '.content' <<<"$RESPONSE")" \
      --argjson results "$TOOL_RESULTS" \
      '. + [
        {role: "assistant", content: $assistant},
        {role: "user", content: $results}
      ]' <<<"$MESSAGES")

    RESPONSE=$(call_api)
  done

  jq -r '.content[] | select(.type == "text") | .text' <<<"$RESPONSE"
  ```
</CodeGroup>

**What to expect**

```text Output wrap
I checked your calendar for Monday, March 30 and found an existing meeting from 2pm to 3pm. I've scheduled the planning session for 10am to 11am to avoid the conflict.
```

For more on concurrent execution and ordering guarantees, see [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use?sdk_languages=cli).

## Ring 4: Error handling

Tools fail. A calendar API might reject an event with too many attendees, or a date might be malformed. When a tool raises an error, send the error message back with `is_error: true` instead of crashing. Claude reads the error and can retry with corrected input, ask the user for clarification, or explain the limitation.

<CodeGroup>
  ```bash CLI
  #!/usr/bin/env bash
  # Ring 4: Error handling.
  # Uses jq for cross-turn message-array state — building an agentic loop in shell
  # requires JSON manipulation beyond ant's single-call --transform scope.
  set -euo pipefail

  run_tool() {
    case "$1" in
      create_calendar_event)
        local count
        count=$(jq '.attendees | length // 0' <<<"$2")
        if [ "$count" -gt 10 ]; then
          echo "ERROR: Too many attendees (max 10)"
          return 1
        fi
        jq -n --arg title "$(jq -r '.title' <<<"$2")" \
          '{event_id: "evt_123", status: "created", title: $title}' ;;
      list_calendar_events)
        echo '{"events": [{"title": "Existing meeting", "start": "14:00", "end": "15:00"}]}' ;;
      *)
        echo "ERROR: Unknown tool: $1"
        return 1 ;;
    esac
  }

  EMAILS=$(seq 0 14 | sed 's/.*/user&@example.com/' | paste -sd, -)
  MESSAGES=$(jq -n --arg msg "Schedule a one-hour all-hands on Monday, March 30, 2026 at 10am with everyone: $EMAILS" \
    '[{role: "user", content: $msg}]')

  call_api() {
    # ant reads the request body as YAML on stdin: no auth headers, no
    # hand-built JSON envelope. The static keys (model, tools) live in a
    # quoted heredoc; the growing messages array is appended as JSON,
    # which YAML accepts as flow syntax.
    {
      cat <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  tools:
    - name: create_calendar_event
      description: Create a calendar event with attendees and optional recurrence.
      input_schema:
        type: object
        properties:
          title: {type: string}
          start: {type: string, format: date-time}
          end: {type: string, format: date-time}
          attendees:
            type: array
            items: {type: string, format: email}
          recurrence:
            type: object
            properties:
              frequency: {enum: [daily, weekly, monthly]}
              count: {type: integer, minimum: 1}
        required: [title, start, end]
    - name: list_calendar_events
      description: List all calendar events on a given date.
      input_schema:
        type: object
        properties:
          date: {type: string, format: date}
        required: [date]
  YAML
      printf 'messages: %s\n' "$MESSAGES"
    } | ant messages create --format json
  }

  RESPONSE=$(call_api)

  while [ "$(jq -r '.stop_reason' <<<"$RESPONSE")" = "tool_use" ]; do
    TOOL_RESULTS='[]'
    while read -r block; do
      NAME=$(jq -r '.name' <<<"$block")
      INPUT=$(jq -c '.input' <<<"$block")
      ID=$(jq -r '.id' <<<"$block")
      if OUTPUT=$(run_tool "$NAME" "$INPUT"); then
        TOOL_RESULTS=$(jq --arg id "$ID" --arg result "$OUTPUT" \
          '. + [{type: "tool_result", tool_use_id: $id, content: $result}]' \
          <<<"$TOOL_RESULTS")
      else
        # Signal failure so Claude can retry or ask for clarification.
        TOOL_RESULTS=$(jq --arg id "$ID" --arg result "$OUTPUT" \
          '. + [{type: "tool_result", tool_use_id: $id, content: $result, is_error: true}]' \
          <<<"$TOOL_RESULTS")
      fi
    done < <(jq -c '.content[] | select(.type == "tool_use")' <<<"$RESPONSE")

    MESSAGES=$(jq \
      --argjson assistant "$(jq '.content' <<<"$RESPONSE")" \
      --argjson results "$TOOL_RESULTS" \
      '. + [
        {role: "assistant", content: $assistant},
        {role: "user", content: $results}
      ]' <<<"$MESSAGES")

    RESPONSE=$(call_api)
  done

  jq -r '.content[] | select(.type == "text") | .text' <<<"$RESPONSE"
  ```
</CodeGroup>

**What to expect**

```text Output wrap
I tried to schedule the all-hands but the calendar only allows 10 attendees per event. I can split this into two sessions, or you can let me know which 10 people to prioritize.
```

The `is_error` flag is the only difference from a successful result. Claude sees the flag and the error text, and responds accordingly. See [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli) for the full error-handling reference.

## Ring 5: The Tool Runner SDK abstraction

Rings 2 through 4 wrote the same loop by hand: call the API, check `stop_reason`, run tools, append results, repeat. The Tool Runner does this for you. Define each tool as a function, pass the list to `client.beta.messages.tool_runner()`, and retrieve the final message once the loop completes. Error wrapping, result formatting, and conversation management are handled internally.

Each SDK provides a helper that turns an ordinary function into a runnable tool and derives the input schema from its signature; the tabs below show the idiomatic form for each language.

<CodeGroup exclude="shell">
  <CodeGroupItem language="CLI">
    The Tool Runner is a helper in the Claude SDK. The `ant` CLI has no equivalent. To keep using the CLI, use the loop from [Ring 4](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent?sdk_languages=cli#ring-4-error-handling).
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
