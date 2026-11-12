---
title: Build an orchestration mode
url: https://platform.claude.com/docs/en/build-with-claude/mid-conversation-effort-example
description: Build a session-level mode that grants standing consent for multiagent fan-out, switched on and off with mid-conversation system messages.
---

An orchestration mode is a session-level switch: when it is on, the model puts maximum thoroughness behind every substantive request, scouting the task itself and then fanning work out to parallel subagents by default. When it is off, the same orchestration tool goes back to per-request opt-in.

The mode is not an API parameter. It is built entirely from documented pieces:

1. **An effort level:** requests run at a documented [Effort](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli) value such as `xhigh`. There is no hidden level above the ones on that page. This example sets effort at the top level of each request, which needs no beta header.
2. **A mode reminder:** a [mid-conversation system message](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli) tells the model the mode is active, with a one-line refresher every several turns and an exit notice when the mode is turned off. The top-level `system` field never changes, so the cached prefix stays intact.
3. **Standing consent in the tool description:** the orchestration tool’s description states that while the mode is on, the model should author and run a workflow for every substantive task without asking first.

<Note>
  This example uses mid-conversation system messages; for the models and platforms that support them, see [Mid-conversation system messages](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli). The fan-out itself multiplies token usage: a single request can spawn many subagent conversations, so reserve the mode for work that justifies the cost.
</Note>

## Set up the loop

The example is a single file. The constants control the effort level, the fan-out shape, and how often the mode refresher is re-sent. `MAX_CONCURRENT` caps how many subagents run at the same time (the PHP port is sequential and ignores it); `MAX_TOTAL_SUBTASKS` caps how many the model may queue in a single Workflow call. Splitting the two lets the model plan a large backlog without launching it all at once. The `DOC_TEST_MODE` check caps the loops to a single turn when that environment variable is set, so the automated docs harness can validate that the file compiles and completes quickly without running the full orchestration; leave it unset when running the example yourself.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Set the constants in code.
  </CodeGroupItem>
</CodeGroup>

## Define the mode reminders

The reminders are short on purpose. They flip the mode and point at the tool description, where the heavyweight instructions live. The full text is sent once when the mode turns on, the refresher is re-sent only after several user turns, and the exit notice is sent once when the mode turns off.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Define the reminders in code.
  </CodeGroupItem>
</CodeGroup>

## Grant standing consent in the tool description

The Workflow tool carries the real behavioral contract: the opt-in rule, the standing consent that applies while the mode is on, granularity guidance for sizing the fan-out, and the quality patterns the model can reach for (a verification wave, a completeness critic, multiphase sequencing). Subagents also get a `report_findings` tool so their results come back as structured JSON instead of prose, and the bash tool is the Anthropic-defined `bash_20250124` tool run locally.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Define the tools in code.
  </CodeGroupItem>
</CodeGroup>

## Run the bash tool locally

The bash handler runs the requested command with a timeout, captures combined stdout and stderr, and truncates the result so a runaway command can’t flood the context window. Commands run in the directory you launch the example from, so pointing it at a project means starting it there; when `DOC_TEST_MODE` is set, the harness instead gives bash a small throwaway fixture directory that is removed on exit. There is no sandbox here: the command runs with the permissions of the process that launched the example. For clarity this example runs each call in a fresh subshell rather than maintaining the persistent session the `bash_20250124` contract describes; a production agent should back the tool with a long-lived shell so that working directory, environment, and the `restart` action behave as documented.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Run the requested command in code.
  </CodeGroupItem>
</CodeGroup>

## Run one subagent

Each workflow subtask becomes its own small agent loop with the bash tool, running at the same effort as the main loop. A per-request timeout bounds each API call so a dropped connection degrades one subagent instead of stalling the whole run.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    The full example needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Journal results so reruns resume

A fan-out that spawns dozens of subagents is expensive to restart from the beginning. A small content-addressed journal makes it idempotent: before dispatching a subagent, look up the SHA-256 of its prompt in a local JSON file, and return the recorded result if one exists. Interrupt the run, rerun it, and only the subtasks that never completed are recomputed. The journal deduplicates across runs, not within a single fan-out wave; delete the journal file to start fresh.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Read and write the journal in code.
  </CodeGroupItem>
</CodeGroup>

## Fan out, then verify

The fan-out accepts up to `MAX_TOTAL_SUBTASKS` prompts, runs them through the journal with at most `MAX_CONCURRENT` in flight (sequential in the PHP port), and isolates failures so one broken subagent degrades to an error string instead of ending the run. Once the first wave completes, a second wave reuses the same subagent path to attempt to refute each result: every verifier re-derives the claims from the source, defaulting to refuted when uncertain. Both the original result and its verdict are returned to the orchestrator so it can weigh them together.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    The full example needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Toggle the mode with mid-conversation system messages

The agent appends the user’s message first, then any system messages that are due: the exit notice, the full mode text on entry, or the periodic refresher. Placing the system message after the user turn keeps every cached byte ahead of it untouched, and satisfies the placement rule that a system message follows a user turn.

<CodeGroup>
  ```bash CLI
  # One orchestration-mode turn: the mode reminder rides in the messages array as a
  # system-role entry placed after the user turn it applies to. The response stops
  # at the first tool call. The agent loop that executes tool calls and fans out
  # subagents is shown in the SDK tabs; the Workflow description is condensed here,
  # the SDK examples carry the full standing-consent text.
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 64000
  system: You are a helpful general-purpose agent. Answer the user's request directly.
  output_config: {effort: xhigh}
  tools:
    - name: Workflow
      description: >-
        Orchestrate a multiagent workflow: split a large task into independent
        subtasks and run them as parallel agents, then collect their results.
        Opt-in: only use this tool when the user explicitly asks for a workflow,
        or when a system message confirms that orchestration mode is on.
        Granularity: scope each subtask to a distinct concern rather than per
        line or file section; a review of a small module rarely needs more than
        about ten. Standing consent: while a system message confirms
        orchestration mode is on, author and run a workflow for every
        substantive task by default; work solo only on conversational turns or
        trivial mechanical edits.
      input_schema:
        type: object
        properties:
          subtasks:
            type: array
            items: {type: string}
            description: Independent subtask prompts to run as parallel agents
        required: [subtasks]
    - {type: bash_20250124, name: bash}
  messages:
    - role: user
      content: >-
        Explore the current directory, then give a thorough review: what it
        does, code-quality issues, and concrete improvements.
    - role: system
      content: >-
        Orchestration mode is on: optimize for the most exhaustive, correct
        answer rather than the fastest one. Use the Workflow tool on every
        substantive task, sized to the problem's natural decomposition rather
        than the maximum the tool allows. See the Workflow tool's description
        for standing consent, granularity guidance, and quality patterns. Work
        solo only on conversational or trivial turns.
  YAML
  ```
</CodeGroup>

## Run it

<Warning>
  The bash tool in this example runs model-written commands directly on your machine with no sandbox, and the fan-out runs several of those agents in parallel. Run it in a directory and environment you are comfortable exposing, and add sandboxing before adapting it for anything beyond local experimentation.
</Warning>

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    The full example needs more logic than a single shell command. Use the [Anthropic SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

Start the example from the directory you want the agents to work in, for example the root of a repository to review:

```bash
python orchestration_mode.py "Review this repository for flaky tests and propose fixes."
```

With the mode on, expect the model to scout with a few bash commands, dispatch the Workflow tool unprompted, and synthesize the subagent reports into a final answer. Trivial or conversational requests stay solo, as the reminder instructs.

## Toward a production harness

This example is deliberately small. A harness meant for real workloads would typically add:

* **Sandboxed orchestration scripts:** let the model emit a short orchestration program (branching, loops, and reduce steps) and run it inside an isolated interpreter, rather than accepting only a flat list of subtask strings.
* **Durable journaling:** replace the local JSON file with a store that survives process restarts and is safe under concurrent writers across machines.
* **Budget enforcement:** track total subagents launched across the whole session, not just for each Workflow call, and refuse to exceed a hard cap so a runaway plan cannot exhaust your quota.

The patterns in this example (the mode reminders, standing consent in the tool description, journaling, and a verification wave) carry over unchanged; only the execution substrate around them gets more robust.

## Related

<CardGroup cols={2}>
  <Card title="Mid-conversation system messages" icon="message" href="https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli">
    The mechanism the mode reminders use, and how it interacts with prompt caching.
  </Card>

  <Card title="Effort" icon="gauge" href="https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli">
    The effort levels the API accepts and how to choose one.
  </Card>

  <Card title="Tool use with Claude" icon="wrench" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli">
    Defining tools, handling tool calls, and tool results.
  </Card>

  <Card title="Bash tool" icon="terminal" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool?sdk_languages=cli">
    The Anthropic-defined bash tool this example runs locally.
  </Card>
</CardGroup>
