---
title: Strict tool use
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use
description: Enforce JSON Schema compliance on Claude's tool inputs with grammar-constrained sampling.
---

Setting `strict: true` on a tool definition guarantees Claude's tool inputs match your JSON Schema by constraining the model's token sampling to schema-valid outputs (a technique called grammar-constrained sampling). This page covers why strict mode matters for agents, how to enable it, and common use cases. For the supported JSON Schema subset, see [JSON Schema limitations](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#json-schema-limitations). For non-strict schema guidance, see [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=cli).

Strict tool use validates tool parameters, ensuring Claude calls your functions with correctly-typed arguments. Use strict tool use when you need to:

* Validate tool parameters
* Build agentic workflows
* Ensure type-safe function calls
* Handle complex tools with nested properties

## Why strict tool use matters for agents

Building reliable agentic systems requires guaranteed schema conformance. Without strict mode, Claude might return incompatible types (`"2"` instead of `2`) or omit required fields, breaking your functions and causing runtime errors.

Strict tool use guarantees type-safe parameters:

* Functions receive correctly-typed arguments every time
* No need to validate and retry tool calls
* Production-ready agents that work consistently at scale

For example, suppose a booking system needs `passengers: int`. Without strict mode, Claude might provide `passengers: "two"` or `passengers: "2"`. With `strict: true`, the response always contains `passengers: 2`.

## Quick start

<CodeGroup>
  ```bash CLI
  ant messages create --transform content <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content: What is the weather in San Francisco?
  tools:
    - name: get_weather
      description: Get the current weather in a given location
      strict: true
      input_schema:
        type: object
        properties:
          location:
            type: string
            description: The city and state, e.g. San Francisco, CA
          unit:
            type: string
            enum: [celsius, fahrenheit]
        required: [location]
        additionalProperties: false
  YAML
  ```
</CodeGroup>

**Response format:** Tool use blocks with validated inputs in `response.content[x].input`

```json Output
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Guarantees:**

* Tool `input` strictly follows the `input_schema`
* Tool `name` is always valid (from provided tools or server tools)

## How it works

<Steps>
  <Step title="Define your tool schema">
    Create a JSON schema for your tool's `input_schema`. The schema uses standard JSON Schema format with some limitations (see [JSON Schema limitations](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#json-schema-limitations)).
  </Step>

  <Step title="Add strict: true">
    Set `"strict": true` as a top-level property in your tool definition, alongside `name`, `description`, and `input_schema`.
  </Step>

  <Step title="Handle tool calls">
    When Claude uses the tool, the `input` field in the `tool_use` block strictly follows your `input_schema`, and the `name` is always valid.
  </Step>
</Steps>

The [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli) and [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli) toolset entries (`computer_toolset_20260801` and `browser_toolset_20260801`) don't accept `strict: true`; a request that sets it on either entry is rejected.

## Common use cases

<AccordionGroup>
  <Accordion title="Validated tool inputs">
    Ensure tool parameters exactly match your schema:

    <CodeGroup>
      ```bash CLI
      ant messages create <<'YAML'
      model: claude-opus-5-5
      max_tokens: 1024
      messages:
        - role: user
          content: Search for flights to Tokyo departing June 1, 2026
      tools:
        - name: search_flights
          strict: true
          input_schema:
            type: object
            properties:
              destination:
                type: string
              departure_date:
                type: string
                format: date
              passengers:
                type: integer
                enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            required: [destination, departure_date]
            additionalProperties: false
      YAML
      ```
    </CodeGroup>
  </Accordion>

  <Accordion title="Agentic workflow with multiple validated tools">
    Build reliable multistep agents with guaranteed tool parameters:

    <CodeGroup>
      ```bash CLI
      ant messages create <<'YAML'
      model: claude-opus-5-5
      max_tokens: 1024
      messages:
        - role: user
          content: >-
            Help me plan a trip from New York to Paris for 2 people,
            departing June 1, 2026
      tools:
        - name: search_flights
          strict: true
          input_schema:
            type: object
            properties:
              origin: {type: string}
              destination: {type: string}
              departure_date: {type: string, format: date}
              travelers: {type: integer, enum: [1, 2, 3, 4, 5, 6]}
            required: [origin, destination, departure_date]
            additionalProperties: false
        - name: search_hotels
          strict: true
          input_schema:
            type: object
            properties:
              city: {type: string}
              check_in: {type: string, format: date}
              guests: {type: integer, enum: [1, 2, 3, 4]}
            required: [city, check_in]
            additionalProperties: false
      YAML
      ```
    </CodeGroup>
  </Accordion>
</AccordionGroup>

## Data retention

Strict tool use compiles tool `input_schema` definitions into grammars using the same pipeline as [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli). Tool schemas are temporarily cached for up to 24 hours since last use. Prompts and responses are not retained beyond the API response.

Strict tool use is HIPAA eligible, but **protected health information (PHI) must not be included in tool schema definitions**. The API caches compiled schemas separately from message content, and these cached schemas do not receive the same PHI protections as prompts and responses. Do not include PHI in `input_schema` property names, `enum` values, `const` values, or `pattern` regular expressions. PHI should only appear in message content (prompts and responses), where it is protected under HIPAA safeguards.

For ZDR and HIPAA eligibility across all features, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli).

## Next steps

<CardGroup cols={2}>
  <Card title="Web fetch tool" icon="link" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool?sdk_languages=cli">
    Fetch and read content from specific URLs to bring live web content into Claude's context.
  </Card>

  <Card title="Tool use with prompt caching" icon="database" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching?sdk_languages=cli">
    Cache tool definitions across turns to reduce cost and latency.
  </Card>

  <Card title="Structured outputs" icon="code-brackets" href="https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli">
    Get validated JSON responses using the same grammar-constrained sampling.
  </Card>

  <Card title="Define tools" icon="hammer" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=cli">
    Specify tool schemas, write effective descriptions, and control when Claude calls your tools.
  </Card>
</CardGroup>
