---
title: Get started with Claude
url: https://platform.claude.com/docs/en/get-started
description: Make your first API call to Claude and build a simple web search assistant.
---

## Prerequisites

* A [Claude Console account](https://platform.claude.com/)
* An [API key](https://platform.claude.com/docs/en/get-api-key?sdk_languages=curl)

## Call the API

<Tabs>
  <Tab title="cURL">
    <Steps>
      <Step title="Set your API key">
        Export your API key as an environment variable. The cURL command in the following step reads it from `$ANTHROPIC_API_KEY`.

        ```bash
        export ANTHROPIC_API_KEY="your-api-key-here"
        ```
      </Step>

      <Step title="Make your first API call">
        Send a `POST` request to the Messages API:

        ```bash cURL
        curl https://api.anthropic.com/v1/messages \
          -H "content-type: application/json" \
          -H "x-api-key: $ANTHROPIC_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
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

        Claude returns a JSON response containing the assistant's message:

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

You made your first API call. Next, learn the Messages API patterns you'll use in every Claude integration.

<Card title="Working with the Messages API" icon="messages" href="https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=curl">
  Learn multi-turn conversations, system prompts, stop reasons, and other core patterns.
</Card>

Once you're comfortable with the basics, explore further:

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
