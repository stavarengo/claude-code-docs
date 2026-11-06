---
title: Get started with Claude
url: https://platform.claude.com/docs/en/get-started
description: Make your first API call to Claude and build a simple web search assistant.
---

## Before you begin

<Steps continues>
  <Step title="Create a Claude Console account">
    [Sign up](https://platform.claude.com/) for a Claude Console account, or sign in to the one you have.
  </Step>

  <Step title="Choose how to authenticate">
    Signing in with the CLI is recommended for local development.

    Follow the steps for one of the following options.
  </Step>
</Steps>

**CLI**

<Steps continued>
  <Step title="Install the CLI" stepNumber={3}>
    <Tabs noDeepLinks>
      <Tab title="Homebrew (macOS)">
        ```bash
        brew install anthropics/tap/ant
        ```
      </Tab>

      <Tab title="curl (Linux/WSL)">
        For Linux environments, download the release binary directly.

        ```bash
        VERSION=2.7.1
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

      <Tab title="go install">
        You can also install the CLI from source with `go install`, which requires Go 1.26.10 or later.

        ```bash
        go install github.com/anthropics/anthropic-cli/v2/cmd/ant@latest
        ```

        `go install` places the binary in `$(go env GOPATH)/bin`. Add that directory to your `PATH` if it isn’t already there:

        ```bash
        export PATH="$PATH:$(go env GOPATH)/bin"
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Sign in" stepNumber={4}>
    ```bash
    ant auth login
    ```

    Once login is completed, the SDKs and CLI will pick up your credentials automatically.
  </Step>
</Steps>

**API key**

<Steps continued>
  <Step title="Create an API key" stepNumber={3}>
    Create an [API key](https://platform.claude.com/settings/keys) in the Claude Console.
  </Step>

  <Step title="Set the environment variable" stepNumber={4}>
    The SDKs and CLI read your key from `ANTHROPIC_API_KEY`:

    ```bash
    export ANTHROPIC_API_KEY="your-api-key-here"
    ```
  </Step>
</Steps>

## Call the API

<Tabs>
  <Tab title="cURL">
    <Steps>
      <Step title="Make your first API call" stepNumber={5}>
        **CLI**

        Send a `POST` request to the Messages API, with [the access token from your CLI sign-in](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/scripting?sdk_languages=curl#authenticate-curl-requests-with-cli-credentials) as a bearer token:

        ```bash cURL
        curl https://api.anthropic.com/v1/messages \
          -H "content-type: application/json" \
          -H "Authorization: Bearer $(ant auth print-credentials --access-token)" \
          -H "anthropic-version: 2026-10-21" \
          -d '{
            "model": "claude-opus-5-5",
            "max_tokens": 1000,
            "messages": [
              {
                "role": "user",
                "content": "What should I search for to find the latest developments in renewable energy?"
              }
            ]
          }'
        ```

        **API key**

        Send a `POST` request to the Messages API:

        ```bash cURL
        curl https://api.anthropic.com/v1/messages \
          -H "content-type: application/json" \
          -H "x-api-key: $ANTHROPIC_API_KEY" \
          -H "anthropic-version: 2026-10-21" \
          -d '{
            "model": "claude-opus-5-5",
            "max_tokens": 1000,
            "messages": [
              {
                "role": "user",
                "content": "What should I search for to find the latest developments in renewable energy?"
              }
            ]
          }'
        ```

        Claude returns a JSON response containing the assistant’s message:

        ```json Output
        {
          "model": "claude-opus-5-5",
          "id": "msg_013mHbppMPd2PrVJzGMZPt2D",
          "type": "message",
          "role": "assistant",
          "content": [
            {
              "type": "text",
              "text": "Here are some effective search strategies to find the latest developments in renewable energy:\n\n## General Search Terms\n- \"Renewable energy news 2025\"\n- ..."
            }
          ],
          "stop_reason": "end_turn",
          "stop_sequence": null,
          "stop_details": null,
          "usage": {
            "input_tokens": 21,
            "output_tokens": 305
          }
        }
        ```
      </Step>
    </Steps>
  </Tab>
</Tabs>

## Next steps

You made your first API call. Next, learn the Messages API patterns you’ll use in every Claude integration.

<Card title="Working with the Messages API" icon="messages" href="https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=curl">
  Learn multi-turn conversations, system prompts, stop reasons, and other core patterns.
</Card>

Once you’re comfortable with the basics, explore further:

<CardGroup cols={2}>
  <Card title="Models overview" icon="brain" href="https://platform.claude.com/docs/en/models/overview?sdk_languages=curl">
    Compare Claude models by capability and cost.
  </Card>

  <Card title="Features overview" icon="list" href="https://platform.claude.com/docs/en/build-with-claude/overview?sdk_languages=curl">
    Browse all Claude capabilities: tools, context management, structured outputs, and more.
  </Card>

  <Card title="Client SDKs" icon="code-brackets" href="https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=curl">
    Reference documentation for Python, TypeScript, C#, and other client libraries.
  </Card>

  <Card title="Authentication" icon="lock" href="https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=curl">
    Compare API keys and Workload Identity Federation, and set key expiration.
  </Card>
</CardGroup>
