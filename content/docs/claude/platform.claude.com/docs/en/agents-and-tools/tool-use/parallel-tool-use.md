---
title: Parallel tool use
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
description: Enable, format, and disable parallel tool calls, with message-history guidance and troubleshooting.
---

By default, Claude may call multiple tools in a single response. This page covers how to run those calls, how to format the message history so parallelism keeps working, and how to disable parallel tool use when you need to. For the single-call flow, see [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli).

## Execution semantics

When Claude calls tools, the response has a `stop_reason` of `tool_use` and can contain several `tool_use` blocks in a single assistant turn. How you run those calls is your decision. The API doesn't prescribe an execution order: you can run the calls concurrently (`Promise.all`, `asyncio.gather`), sequentially in the order they appear, or in any combination that suits your tools.

Choose the strategy based on what your tools do. Independent, read-only operations are usually safe to run in parallel for lower latency. Tools with side effects, shared state, or ordering requirements might be better run sequentially.

Whichever strategy you use, return one `tool_result` for each `tool_use` block, all together in the next user message. Match each result to its call with `tool_use_id`, and put every `tool_result` block before any text content in that message. See [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli) for the full formatting rules. If you choose not to run a particular call (for example, because you ran the batch sequentially and an earlier call failed), still return a `tool_result` for it with `is_error: true` and a brief explanation.

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_02",
  "is_error": true,
  "content": "Not executed: the preceding write_file call failed."
}
```

The [computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#batch-actions) and the [browser use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli#batch-actions) are stricter. When Claude returns several of their member tool calls in one turn (a batch action), run them sequentially in the order they appear and stop at the first failure; each tool defines the exact text to return for the calls you skip.

## Test parallel tool calls

<Note>
  **Use the Tool Runner for most applications:** the SDK [Tool Runner](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner?sdk_languages=cli) handles responses with multiple tool calls and formats the results for you, so you don't write this handling yourself. Use the manual pattern on this page when you need direct control over how the calls run, such as custom batching, ordering, or error handling.
</Note>

The following script sends a request that should trigger parallel tool calls, verifies the response contains them, and formats the tool results so parallelism keeps working. Run it with `ANTHROPIC_API_KEY` set in your environment:

<CodeGroup exclude="shell">
  <CodeGroupItem language="CLI">
    This end-to-end test needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

The summary lines at the end restate the two formatting rules that keep parallelism working: every tool result returns in a single user message, and no text content appears before the tool results in that message.

## Maximizing parallel tool use

Claude 4 and later models make parallel tool calls by default when a request benefits from multiple tools. For all models, you can increase the likelihood of parallel tool calls with targeted prompting:

<AccordionGroup>
  <Accordion title="System prompts for parallel tool use">
    For Claude 4 and later models, add this to your system prompt:

    ```text wrap
    For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
    ```

    For even stronger parallel tool use (recommended if the default isn't sufficient), use:

    ```text wrap
    <use_parallel_tool_calls>
    For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
    </use_parallel_tool_calls>
    ```
  </Accordion>

  <Accordion title="User message prompting">
    You can also encourage parallel tool use within specific user messages:

    ```text wrap
    Instead of:
    "What's the weather in Paris? Also check London."

    Use:
    "Check the weather in Paris and London simultaneously."

    Or be explicit:
    "Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
    ```
  </Accordion>
</AccordionGroup>

<Note>
  **Claude Fable 5.1 in long agent loops**

  Claude Fable 5.1 may issue fewer parallel tool calls than earlier models, most noticeably in long agent loops where the next reads are only implied (custom coding agents, bash and text editor harnesses, computer use). Standard function calling is unaffected. For the batching instruction to add and where to put it, see [Batch independent tool calls in agent loops](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1?sdk_languages=cli#batch-independent-tool-calls-in-agent-loops).
</Note>

## Disable parallel tool use

Parallel tool use is on by default. To turn it off, set `disable_parallel_tool_use: true` inside the [`tool_choice`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=cli#forcing-tool-use) object. It is not a top-level request parameter. The effect depends on the `tool_choice` type.

### At most one tool call

When the `tool_choice` type is `auto` (the default), setting `disable_parallel_tool_use: true` means Claude calls at most one tool in each response. Claude can still answer in plain text without calling any tool. The highlighted lines are the only change from a standard tool use request:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
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
        required: [location]
  tool_choice:
    type: auto
    disable_parallel_tool_use: true
  messages:
    - role: user
      content: What is the weather in San Francisco and New York?
  YAML
  ```
</CodeGroup>

### Exactly one tool call

When `tool_choice` type is `any` or `tool`, setting `disable_parallel_tool_use: true` means Claude calls exactly one tool. Claude Opus 5.5, Claude Sonnet 5.5, Claude Fable 5.1, and Claude Mythos 5.1 don't support these `tool_choice` types (see [Forcing tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=cli#forcing-tool-use)). The following example uses `any`. The same field works with `tool`:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
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
        required: [location]
  tool_choice:
    type: any
    disable_parallel_tool_use: true
  messages:
    - role: user
      content: What is the weather in San Francisco and New York?
  YAML
  ```
</CodeGroup>

## Troubleshooting

If Claude isn't making parallel tool calls when expected, check these common issues:

**1. Incorrect tool result formatting**

The most common issue is formatting tool results incorrectly in the conversation history. This "teaches" Claude to avoid parallel calls.

Specifically for parallel tool use:

* **Wrong:** a separate user message for each tool result
* **Correct:** all tool results together in a single user message

```json
// Wrong: separate user messages reduce parallel tool use
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Separate message
]

// Correct: one user message with all results maintains parallel tool use
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
]
```

See [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli) for other formatting rules.

**2. Weak prompting**

Default prompting might not be sufficient. Use the stronger system prompt from [Maximizing parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use?sdk_languages=cli#maximizing-parallel-tool-use).

**3. Measuring parallel tool usage**

To verify parallel tool calls are working:

<CodeGroup exclude="shell">
  <CodeGroupItem language="CLI">
    To measure parallel tool use, your code analyzes the responses that it already collected. This needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) for this.
  </CodeGroupItem>
</CodeGroup>

**4. Calls in a batch appear to depend on each other**

Execution order is your choice. If your tools have ordering dependencies, running the batch sequentially and stopping on the first failure is a valid strategy (and the required one for the [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#batch-actions) and [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli#batch-actions) tools): return `is_error: true` for any call you didn't run. If you run in parallel and a call fails because its prerequisite hadn't completed, return `is_error: true` with the natural error message. Claude will reissue the call on the next turn. To reduce dependent calls appearing together, add this to your system prompt: "Only batch tool calls that are independent of each other."

## Next steps

<CardGroup cols={3}>
  <Card title="Tool runner (SDK)" icon="wrench" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner?sdk_languages=cli">
    Use the SDK's tool runner abstraction to handle the agentic loop, error wrapping, and type safety automatically.
  </Card>

  <Card title="Handle tool calls" icon="arrows-left-right" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls?sdk_languages=cli">
    Parse `tool_use` blocks, format `tool_result` responses, and handle errors with `is_error`.
  </Card>

  <Card title="Define tools" icon="hammer" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=cli">
    Specify tool schemas, write effective descriptions, and control when Claude calls your tools.
  </Card>
</CardGroup>
