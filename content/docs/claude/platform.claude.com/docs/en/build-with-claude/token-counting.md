---
title: Token counting
url: https://platform.claude.com/docs/en/build-with-claude/token-counting
description: Count the tokens in a message before you send it to Claude. Use token counts to manage rate limits and costs, make model routing decisions, and fit prompts to a target length.
featureMetadata:
  status: ga
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements).
  supportedPlatforms:
    Claude API: ga
    Claude Platform on AWS: ga
    Amazon Bedrock: ga
    Google Cloud: ga
    Microsoft Foundry: ga
---

Token counting lets you determine the number of tokens in a message before you send it to Claude. This helps you make informed decisions about your prompts and usage. With token counting, you can:

* Proactively manage rate limits and costs
* Make smart model routing decisions
* Optimize prompts to a specific length

***

## How to count message tokens

The [token counting](https://platform.claude.com/docs/en/api/messages/count_tokens?sdk_languages=cli) endpoint accepts the same structured list of inputs for creating a message, including support for system prompts, [tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli), [images](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli), and [PDFs](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli). The response contains the total number of input tokens.

This endpoint returns an `invalid_request_error` for a few inputs that the Messages API accepts: [server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools?sdk_languages=cli) such as web search, web fetch, code execution, and tool search (every server tool except the [advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool?sdk_languages=cli)), the [MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector?sdk_languages=cli), and `image` or `document` blocks with a `url` or `file` source. Send images and PDFs as base64 to count them. For requests that use server tools or MCP servers, the Messages API response reports the tokens used in its `usage` object.

<Note>
  The token count is an **estimate**. In some cases, the actual number of input tokens used when creating a message might differ by a small amount.

  Token counts may include tokens added automatically by Anthropic for system optimizations. **You are not billed for system-added tokens**. Billing reflects only your content.
</Note>

### Supported models

All [active models](https://platform.claude.com/docs/en/models/overview?sdk_languages=cli) support token counting.

<Note>
  Claude 4.7 and later models and Claude Mythos Preview use a newer tokenizer. The same input text produces approximately 30 percent more tokens than on earlier models. The exact increase depends on the content and workload shape. Recount prompts against the model you plan to use rather than reusing counts measured against earlier models.
</Note>

### Count tokens in basic messages

<CodeGroup>
  ```bash CLI
  ant messages count-tokens \
    --model claude-opus-5-5 \
    --system "You are a scientist" \
    --message '{role: user, content: "Hello, Claude"}'
  ```
</CodeGroup>

```json Output
{ "input_tokens": 14 }
```

### Count tokens in messages with tools

<Note>
  Token counting supports client tools and the [advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool?sdk_languages=cli). Requests that include other [server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools?sdk_languages=cli) return an error. For the advisor tool, the count covers the executor's first sampling call only.
</Note>

<CodeGroup>
  ```bash CLI
  ant messages count-tokens <<'YAML'
  model: claude-opus-5-5
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
  messages:
    - role: user
      content: What's the weather like in San Francisco?
  YAML
  ```
</CodeGroup>

```json Output
{ "input_tokens": 403 }
```

### Count tokens in messages with images

<CodeGroup>
  ```bash CLI
  curl -s "https://platform.claude.com/docs/images/vision-example.jpg" -o ./vision-example.jpg

  ant messages count-tokens <<'YAML'
  model: claude-opus-5-5
  messages:
    - role: user
      content:
        - type: image
          source:
            type: base64
            media_type: image/jpeg
            data: "@./vision-example.jpg"
        - type: text
          text: Describe this image
  YAML
  ```
</CodeGroup>

```json Output
{ "input_tokens": 1028 }
```

An embedded image block that sets [`"oversized_image": "error"`](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#oversized-image-error) is rejected at count time exactly as the Messages API would reject it.

### Count tokens in messages with thinking

<Note>
  See [Thinking and the context window](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#thinking-and-the-context-window) for more details.

  * Thinking blocks from **previous** assistant turns count toward your input tokens on models that [keep all prior turns](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli#thinking-block-preservation-by-model); on models that keep only the last turn, the API strips them and they do **not** count
  * **Current** assistant turn thinking **does** count toward your input tokens
</Note>

<CodeGroup>
  ```bash CLI
  ant messages count-tokens <<'YAML'
  model: claude-opus-5-5
  thinking:
    type: adaptive
  messages:
    - role: user
      content: Are there an infinite number of prime numbers such that n mod 4 == 3?
    - role: assistant
      content:
        - type: thinking
          thinking: >-
            This is a nice number theory question. Lets think about it step by step...
          signature: >-
            EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...
        - type: text
          text: Yes, there are infinitely many prime numbers p such that p mod 4 = 3...
    - role: user
      content: Can you write a formal proof?
  YAML
  ```
</CodeGroup>

```json Output
{ "input_tokens": 88 }
```

### Count tokens in messages with PDFs

<Note>
  Token counting supports base64-encoded PDFs with the same [PDF requirements](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli#check-pdf-requirements) as the Messages API. This endpoint doesn't support `url` or `file` document sources.
</Note>

<CodeGroup>
  ```bash CLI
  ant messages count-tokens <<'YAML'
  model: claude-opus-5-5
  messages:
    - role: user
      content:
        - type: document
          source:
            type: base64
            media_type: application/pdf
            data: "@./document.pdf"
        - type: text
          text: Please summarize this document.
  YAML
  ```
</CodeGroup>

```json Output
{ "input_tokens": 2188 }
```

***

## Token counts on Claude Fable and Claude Mythos models

Claude Fable 5.1, Claude Mythos 5.1, Claude Fable 5, and Claude Mythos 5 share the tokenizer introduced with Claude Opus 4.7. A prompt counts the same on all four, and roughly 30 percent higher than on models before Claude Opus 4.7 (the exact increase depends on the content). The token counting endpoint counts under the tokenizer of the `model` you pass. To measure the difference for your workload, count the same request twice, once with your current model and once with the model you plan to move to, and compare the two `input_tokens` values.

<Note>
  **Billing and migration:** Usage and billing on these models reflect this tokenizer's counts. When migrating from a model before Claude Opus 4.7, don't reuse token counts measured on the older model to estimate costs or context window fit. Count your prompts with the `model` ID you plan to use (for example, `"claude-fable-5-1"`).
</Note>

***

## Pricing and rate limits

Token counting is **free to use** but subject to requests per minute rate limits based on your [usage tier](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=cli#rate-limits). If you need higher limits, use **Request tier increase** on the [Rate limits](https://platform.claude.com/usage/limits) page in the Claude Console.

| Usage tier | Requests per minute (RPM) |
| ---------- | ------------------------- |
| Start      | 5,000                     |
| Build      | 10,000                    |
| Scale      | 20,000                    |

<Note>
  Token counting and message creation have separate and independent rate limits. Usage of one does not count against the limits of the other.
</Note>

***

## FAQ

<AccordionGroup>
  <Accordion title="Does token counting use prompt caching?">
    No, token counting provides an estimate without using caching logic. Although you may provide `cache_control` blocks in your token counting request, prompt caching only occurs during actual message creation.
  </Accordion>
</AccordionGroup>

***

## Next steps

<CardGroup cols={2}>
  <Card title="Count message tokens" icon="code" href="https://platform.claude.com/docs/en/api/messages/count_tokens?sdk_languages=cli">
    Read the full API reference for the token counting endpoint.
  </Card>

  <Card title="Context windows" icon="arrows-maximize" href="https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli">
    Use token counts to keep prompts within a model's context window.
  </Card>

  <Card title="Rate limits" icon="gauge" href="https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=cli">
    Check token counts before you send a request to stay within your usage tier.
  </Card>

  <Card title="Prompt caching" icon="database" href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli">
    Reduce cost and latency on repeated prompts by caching prompt prefixes.
  </Card>
</CardGroup>
