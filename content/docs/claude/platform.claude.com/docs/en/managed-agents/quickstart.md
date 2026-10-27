---
title: Get started with Claude Managed Agents
url: https://platform.claude.com/docs/en/managed-agents/quickstart
description: Create your first autonomous agent.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

This guide walks you through creating an agent, setting up an environment, starting a session, and streaming agent responses.

Let Claude Code set up your agent for you

```text
/claude-api managed-agents-onboard
```

## Core concepts

| Concept         | Description                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Agent**       | The model, system prompt, tools, MCP servers, and skills                                                                      |
| **Environment** | Configuration for where sessions run: an Anthropic-managed cloud sandbox, or a self-hosted sandbox on your own infrastructure |
| **Session**     | A running agent instance within an environment, performing a specific task and generating outputs                             |
| **Events**      | Messages exchanged between your application and the agent (user turns, tool results, status updates)                          |

## Prerequisites

* A [Claude Console account](https://platform.claude.com/)
* An [API key](https://platform.claude.com/settings/keys) from the Console

## Install the CLI

<Tabs>
  <Tab title="Homebrew (macOS)">
    ```bash
    brew install anthropics/tap/ant
    ```
  </Tab>

  <Tab title="curl (Linux/WSL)">
    For Linux environments, download the release binary directly.

    ```bash
    VERSION=2.3.0
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    case $(uname -m) in
      x86_64) ARCH=amd64 ;;
      aarch64) ARCH=arm64 ;;
    esac
    curl -fsSL "https://github.com/anthropics/anthropic-cli/releases/download/v${VERSION}/ant_${VERSION}_${OS}_${ARCH}.tar.gz" \
      | sudo tar -xz -C /usr/local/bin ant
    ```

    You can find all releases on the [GitHub releases page](https://github.com/anthropics/anthropic-cli/releases).
  </Tab>

  <Tab title="Go">
    You can also install the CLI from source using `go install`. Requires Go 1.25 or later.

    ```bash
    go install github.com/anthropics/anthropic-cli/v2/cmd/ant@latest
    ```

    The binary is placed in `$(go env GOPATH)/bin`. Add it to your `PATH` if it isn't already:

    ```bash
    export PATH="$PATH:$(go env GOPATH)/bin"
    ```
  </Tab>
</Tabs>

Check the installation:

```bash
ant --version
```

## Install the SDK

<Tabs>
  <Tab title="Python">
    ```bash
    pip install anthropic
    ```
  </Tab>

  <Tab title="TypeScript">
    ```bash
    npm install @anthropic-ai/sdk
    ```
  </Tab>

  <Tab title="Java">
    ```groovy Gradle
    implementation("com.anthropic:anthropic-java:3.3.0")
    ```
  </Tab>

  <Tab title="Go">
    ```bash
    go get github.com/anthropics/anthropic-sdk-go/v2
    ```
  </Tab>

  <Tab title="C#">
    ```bash
    dotnet add package Anthropic
    ```
  </Tab>

  <Tab title="Ruby">
    ```bash
    bundle add anthropic
    ```
  </Tab>

  <Tab title="PHP">
    ```bash
    composer require "anthropic-ai/sdk" "guzzlehttp/guzzle:^7"
    ```
  </Tab>
</Tabs>

Set your API key as an environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

## Create your first session

<Steps>
  <Step title="Create an agent">
    Create an agent that defines the model, system prompt, and available tools.

    <CodeGroup defaultLanguage="CLI">
      <CodeGroupItem>
        ```bash CLI
        ant apply coding-assistant.md
        ```

        <File filename="coding-assistant.md">
          ```markdown
          ---
          name: Coding Assistant
          model: claude-opus-5-5
          tools:
            - type: agent_toolset_20260401
          ---

          You are a helpful coding assistant. Write clean, well-documented code.
          ```
        </File>

        [`ant apply`](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/apply?sdk_languages=cli) prints the agent's ID and records it in `claude-lock.json`. You'll reference it in every session you create.
      </CodeGroupItem>
    </CodeGroup>

    The `agent_toolset_20260401` tool type enables the full set of pre-built agent tools (bash, file operations, web search, and more). See [Tools](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli) for the complete list and per-tool configuration options.
  </Step>

  <Step title="Create an environment">
    An environment defines the sandbox where your agent runs. This one uses `limited` [networking](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli#networking) with package managers allowed, so code running in the sandbox can reach public [package registries and code hosts](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli#package-manager-hosts). Web search and web fetch run outside the sandbox, and this quickstart does not need them. With `limited` networking, the [`allowed_hosts` list](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli#networking) applies to them too. They return no pages or search results in this environment, because it lists no hosts. For your own agent, list the hosts it needs in `allowed_hosts`.

    <CodeGroup defaultLanguage="CLI">
      <CodeGroupItem>
        ```bash CLI
        ant apply environment.yaml
        ```

        <File filename="environment.yaml">
          ```yaml
          # yaml-language-server: $schema=https://platform.claude.com/schemas/ant/beta/environment.json
          name: quickstart-env
          config:
            type: cloud
            networking:
              type: limited
              allow_package_managers: true
          ```
        </File>

        [`ant apply`](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/apply?sdk_languages=cli) records the environment's ID in `claude-lock.json` too. To create the agent and the environment with one command, pass both files: `ant apply coding-assistant.md environment.yaml`.
      </CodeGroupItem>
    </CodeGroup>

    <Tip>
      This quickstart uses a cloud environment. To decide whether to run tools on your own infrastructure with a 

      [self-hosted sandbox](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli)

       instead, see 

      [Choosing an agent environment](https://platform.claude.com/docs/en/managed-agents/choosing-an-environment?sdk_languages=cli)

      .
    </Tip>
  </Step>

  <Step title="Start a session">
    Create a session that references your agent and environment.

    <CodeGroup>
      ```bash CLI
      ant beta:sessions create \
        --agent "$AGENT_ID" \
        --environment-id "$ENVIRONMENT_ID" \
        --title "Quickstart session"
      ```
    </CodeGroup>
  </Step>

  <Step title="Send a message and stream the response">
    Open a stream, send a user event, then process events as they arrive:

    <CodeGroup exclude="shell">
      <CodeGroupItem language="CLI">
        This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
      </CodeGroupItem>
    </CodeGroup>

    The agent writes a Python script, runs it in the sandbox, and verifies the output file was created. Your output looks similar to this:

    ```text wrap
    I'll create a Python script that generates the first 20 Fibonacci numbers and saves them to a file.
    [Using tool: write]
    [Using tool: bash]
    The script ran successfully. Let me verify the output file.
    [Using tool: bash]
    fibonacci.txt contains the first 20 Fibonacci numbers (0 through 4181).

    Agent finished.
    ```
  </Step>
</Steps>

## What's happening

When you send a user event, Claude Managed Agents:

1. **Provisions a sandbox:** Your environment configuration determines how it's built.
2. **Runs the agent loop:** Claude determines which tools to use based on your message.
3. **Runs tools:** File writes, bash commands, and other tool calls run inside the sandbox.
4. **Streams events:** You receive real-time updates as the agent works.
5. **Goes idle:** The agent emits a `session.status_idle` event when it has nothing more to do.

## Build a complete app

Each of these quickstarts pairs Claude Managed Agents with a popular chat framework to make a complete, runnable application. In each one, the framework renders the chat surface while a managed session runs the agent loop server-side: the session holds the transcript, runs tools in a sandbox, and streams events that the front end renders.

<CardGroup cols={3}>
  <Card title="Chat SDK" icon="github-logo" href="https://github.com/anthropics/claude-quickstarts/tree/main/managed-agents/chat-sdk">
    A research analyst in a browser chat built with Vercel's Chat SDK. Each conversation is one persistent session that streams its reply while a live feed shows the tool calls. Swapping the Chat SDK adapter moves the same handler to Slack, Teams, Discord, or WhatsApp.
  </Card>

  <Card title="assistant-ui" icon="github-logo" href="https://github.com/anthropics/claude-quickstarts/tree/main/managed-agents/assistant-ui">
    A spreadsheet analyst in a chat built from assistant-ui primitives. Sessions are the thread list, one reducer turns the session event log into messages and tool cards, and each bash command renders an inline Allow/Deny gate before it runs.
  </Card>

  <Card title="CopilotKit (AG-UI)" icon="github-logo" href="https://github.com/anthropics/claude-quickstarts/tree/main/managed-agents/copilot-kit-ag-ui">
    A personal finance assistant in a CopilotKit chat. The AG-UI adapter for Claude Managed Agents maps each chat thread to a managed session and streams replies token by token, and custom tools render interactive charts inline in the conversation.
  </Card>
</CardGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Define your agent" icon="brain" href="https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli">
    Create reusable, versioned agent configurations
  </Card>

  <Card title="Configure environments" icon="settings" href="https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli">
    Customize networking and sandbox settings
  </Card>

  <Card title="Agent tools" icon="tool" href="https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli">
    Enable specific tools for your agent
  </Card>

  <Card title="Session event stream" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli">
    Handle events and steer the agent while it runs
  </Card>

  <Card title="Scheduled deployments" icon="arrows-clockwise" href="https://platform.claude.com/docs/en/managed-agents/scheduled-deployments?sdk_languages=cli">
    Run your agent on a recurring cron schedule
  </Card>

  <Card title="Knowledge wiki quickstart" icon="github-logo" href="https://github.com/anthropics/claude-quickstarts/tree/main/managed-agents/knowledge-wiki">
    Distill a document corpus once into a knowledge wiki, then answer repeated questions from it at a fraction of the cost
  </Card>
</CardGroup>
