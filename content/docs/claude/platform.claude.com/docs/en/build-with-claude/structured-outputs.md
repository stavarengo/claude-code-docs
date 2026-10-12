---
title: Structured outputs
url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
description: Get validated JSON results from agent workflows
featureMetadata:
  status: ga
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements).
  supportedModels:
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-sonnet-4-6
    - claude-sonnet-4-5-20250929
    - claude-opus-4-5-20251101
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
  supportedPlatforms:
    Claude API: ga
    Claude Platform on AWS: ga
    Amazon Bedrock:
      availability: ga
      note: On Amazon Bedrock, structured outputs are available on the legacy [Amazon Bedrock (Opus 4.6 and earlier)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli) integration for Claude Opus 4.6, Claude Sonnet 4.6, Claude Sonnet 4.5, Claude Opus 4.5, and Claude Haiku 4.5, and not on [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli).
    Google Cloud: ga
    Microsoft Foundry: ga
---

Structured outputs constrain Claude's responses to follow a specific schema, ensuring valid, parseable output for downstream processing. Structured outputs provide two complementary features:

* **JSON outputs** (`output_config.format`): Get Claude's response in a specific JSON format, for example to extract data from images or text, generate structured reports, or format API responses. This page covers JSON outputs.
* **Strict tool use** (`strict: true`): Guarantee schema validation on tool names and inputs. See [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use?sdk_languages=cli).

You can use these features independently or [together in the same request](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#using-both-features-together).

## Why use structured outputs

Without structured outputs, Claude can generate malformed JSON responses or invalid tool inputs that break your applications. Even with careful prompting, you may encounter:

* Parsing errors from invalid JSON syntax
* Missing required fields
* Inconsistent data types
* Schema violations requiring error handling and retries

Structured outputs guarantee schema-compliant responses through constrained decoding:

* **Always valid:** No more `JSON.parse()` errors
* **Type safe:** Guaranteed field types and required fields
* **Reliable:** No retries needed for schema violations

## How it works

<Steps>
  <Step title="Define your schema">
    Describe the structure you want as a JSON schema or as a type in your language. The schema follows JSON Schema, with some [limitations](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#json-schema-limitations).
  </Step>

  <Step title="Send it in output_config.format">
    The request carries the schema in `output_config.format` with `type: "json_schema"`. SDK helpers set this for you.
  </Step>

  <Step title="Read the response">
    Claude returns valid JSON that matches your schema in the response's text content block. SDK helpers parse it into your type.
  </Step>
</Steps>

## Usage

<Tabs>
  <Tab title="CLI">
    ```bash
    ant messages create \
      --transform 'content.#(type=="text").text|@fromstr' \
      --format jsonl <<'YAML'
    model: claude-opus-5-5
    max_tokens: 1024
    messages:
      - role: user
        content: >-
          Extract the key information from this email: John Smith
          (john@example.com) is interested in our Enterprise plan and wants
          to schedule a demo for next Tuesday at 2pm.
    output_config:
      format:
        type: json_schema
        schema:
          type: object
          properties:
            name: {type: string}
            email: {type: string}
            plan_interest: {type: string}
            demo_requested: {type: boolean}
          required: [name, email, plan_interest, demo_requested]
          additionalProperties: false
    YAML
    ```

    To print only some properties of the JSON output, pass a [GJSON path](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/using?sdk_languages=cli#transform-output-with-gjson) to `--transform`.

    The example above outputs:

    ```text Output wrap
    {"name":"John Smith","email":"john@example.com","plan_interest":"Enterprise","demo_requested":true}
    ```
  </Tab>
</Tabs>

## How SDK transformation works

Most SDK helpers transform schemas that use unsupported features. The transformation steps:

1. **Remove unsupported constraints** (for example, `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Update descriptions** by adding each unsupported constraint to the field's description (for example, `{minimum: 100}`)
3. **Add `additionalProperties: false`** to all objects
4. **Filter string formats** to supported list only
5. **Validate responses** against your original schema and all its constraints, if the helper validates responses

Claude receives a simplified schema, but a helper that validates responses still enforces every constraint in your code.

**Example:** A field with `minimum: 100` becomes a plain integer in the sent schema, and the SDK adds `{minimum: 100}` to the field's description. A helper that validates responses still checks the response against `minimum: 100`.

## Using a raw JSON schema

To use a JSON schema from a file, an OpenAPI spec, or code that builds it at runtime, pass it in `output_config.format`.

<Tabs>
  <Tab title="CLI">
    ```bash
    ant messages create \
      --transform 'content.#(type=="text").text|@fromstr' \
      --format jsonl <<'YAML'
    model: claude-opus-5-5
    max_tokens: 1024
    messages:
      - role: user
        content: >-
          Extract the key information from this email: John Smith
          (john@example.com) is interested in our Enterprise plan and wants
          to schedule a demo for next Tuesday at 2pm.
    output_config:
      format:
        type: json_schema
        schema:
          type: object
          properties:
            name: {type: string}
            email: {type: string}
            plan_interest: {type: string}
            demo_requested: {type: boolean}
          required: [name, email, plan_interest, demo_requested]
          additionalProperties: false
    YAML
    ```

    The example above outputs:

    ```text Output wrap
    {"name":"John Smith","email":"john@example.com","plan_interest":"Enterprise","demo_requested":true}
    ```
  </Tab>
</Tabs>

## Common use cases

<AccordionGroup>
  <Accordion title="Data extraction">
    Extract structured data from unstructured text:

    <CodeGroup>
      ```bash CLI
      ant messages create \
        --transform 'content.#(type=="text").text|@fromstr' \
        --format jsonl <<'YAML'
      model: claude-opus-5-5
      max_tokens: 4096
      messages:
        - role: user
          content: "Extract invoice data from: Invoice #12345, Date: 2024-01-15, Total: $500.00"
      output_config:
        format:
          type: json_schema
          schema:
            type: object
            properties:
              invoice_number: {type: string}
              date: {type: string}
              total_amount: {type: number}
              line_items:
                type: array
                items: {type: object, additionalProperties: false}
              customer_name: {type: string}
            required: [invoice_number, date, total_amount, line_items, customer_name]
            additionalProperties: false
      YAML
      ```
    </CodeGroup>
  </Accordion>

  <Accordion title="Classification">
    Classify content with structured categories:

    <CodeGroup>
      ```bash CLI
      ant messages create \
        --transform 'content.#(type=="text").text|@fromstr' \
        --format jsonl <<'YAML'
      model: claude-opus-5-5
      max_tokens: 1024
      messages:
        - role: user
          content: "Classify this feedback: Great product, fast shipping!"
      output_config:
        format:
          type: json_schema
          schema:
            type: object
            properties:
              category:
                type: string
              confidence:
                type: number
              tags:
                type: array
                items:
                  type: string
              sentiment:
                type: string
            required:
              - category
              - confidence
              - tags
              - sentiment
            additionalProperties: false
      YAML
      ```
    </CodeGroup>
  </Accordion>

  <Accordion title="API response formatting">
    Generate API-ready responses:

    <CodeGroup>
      ```bash CLI
      ant messages create \
        --transform 'content.#(type=="text").text' \
        --raw-output <<'YAML'
      model: claude-opus-5-5
      max_tokens: 1024
      output_config:
        format:
          type: json_schema
          schema:
            type: object
            properties:
              status:
                type: string
              data:
                type: object
                additionalProperties: false
              errors:
                type: array
                items:
                  type: object
                  additionalProperties: false
              metadata:
                type: object
                additionalProperties: false
            required:
              - status
              - data
              - metadata
            additionalProperties: false
      messages:
        - role: user
          content: "Process this request: ..."
      YAML
      ```
    </CodeGroup>
  </Accordion>
</AccordionGroup>

## Strict tool use

To enforce JSON Schema compliance on tool inputs with grammar-constrained sampling, see [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use?sdk_languages=cli).

### Using both features together

JSON outputs and strict tool use solve different problems and work together:

* **JSON outputs** control Claude's response format (what Claude says)
* **Strict tool use** validates tool parameters (how Claude calls your functions)

When combined, Claude can call tools with guaranteed-valid parameters AND return structured JSON responses. This is useful for agentic workflows where you need both reliable tool calls and structured final outputs.

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content: Help me plan a trip to Paris departing May 15, 2026
  # JSON outputs: structured response format
  output_config:
    format:
      type: json_schema
      schema:
        type: object
        properties:
          summary:
            type: string
          next_steps:
            type: array
            items:
              type: string
        required: [summary, next_steps]
        additionalProperties: false
  # Strict tool use: guaranteed tool parameters
  tools:
    - name: search_flights
      strict: true
      input_schema:
        type: object
        properties:
          destination:
            type: string
          date:
            type: string
            format: date
        required: [destination, date]
        additionalProperties: false
  YAML
  ```
</CodeGroup>

## Important considerations

### Grammar compilation and caching

Structured outputs use constrained sampling with compiled grammar artifacts. This introduces some performance characteristics to be aware of:

* **First request latency:** The first time you use a specific schema, there is additional latency while the grammar compiles

* **Automatic caching:** Compiled grammars are cached for 24 hours from last use, making subsequent requests much faster

* **Cache invalidation:** The cache is invalidated if you change:

  * The JSON schema structure
  * The set of tools in your request (when using both structured outputs and tool use)
  * Changing only `name` or `description` fields does not invalidate the cache

### Prompt modification and token costs

When using structured outputs, Claude automatically receives an additional system prompt explaining the expected output format. This means:

* Your input token count is slightly higher
* The injected prompt costs you tokens like any other system prompt
* Changing the `output_config.format` parameter will invalidate any [prompt cache](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) for that conversation thread

### JSON Schema limitations

Structured outputs support standard JSON Schema with some limitations. Both JSON outputs and strict tool use share these limitations.

<Accordion title="Supported features">
  * All basic types: object, array, string, integer, number, boolean, null
  * `enum` (strings, numbers, bools, or nulls only - no complex types). For a capitalization caveat, see [Invalid outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#invalid-outputs).
  * `const`
  * `anyOf` and `allOf` (with limitations - `allOf` with `$ref` not supported)
  * `$ref`, `$def`, and `definitions` (external `$ref` not supported)
  * `default` property for all supported types
  * `required` and `additionalProperties` (must be set to `false` for objects)
  * String formats: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
  * Array `minItems` (only values 0 and 1 supported)
</Accordion>

<Accordion title="Not supported">
  * Recursive schemas
  * Complex types within enums
  * External `$ref` (for example, `'$ref': 'http://...'`)
  * Numerical constraints (such as `minimum`, `maximum`, `multipleOf`)
  * String constraints (`minLength`, `maxLength`)
  * Array constraints beyond `minItems` of 0 or 1
  * `additionalProperties` set to anything other than `false`

  If you use an unsupported feature, you'll receive a 400 error with details.
</Accordion>

<Accordion title="Pattern support (regex)">
  **Supported regex features:**

  * Full matching (`^...$`) and partial matching
  * Quantifiers: `*`, `+`, `?`, simple `{n,m}` cases
  * Character classes: `[]`, `.`, `\d`, `\w`, `\s`
  * Groups: `(...)`

  **NOT supported:**

  * Backreferences to groups (for example, `\1`, `\2`)
  * Lookahead/lookbehind assertions (for example, `(?=...)`, `(?!...)`)
  * Word boundaries: `\b`, `\B`
  * Complex `{n,m}` quantifiers with large ranges

  Simple regex patterns work well. Complex patterns may result in 400 errors.
</Accordion>

<Tip>
  SDK helpers can transform schemas with [constraints not supported by the API](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#json-schema-limitations). See [How SDK transformation works](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#how-sdk-transformation-works).
</Tip>

### Property ordering

When using structured outputs, properties in objects maintain their defined ordering from your schema, with one important caveat: **required properties appear first, followed by optional properties**.

For example, given this schema:

```json
{
  "type": "object",
  "properties": {
    "notes": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string" },
    "age": { "type": "integer" }
  },
  "required": ["name", "email"],
  "additionalProperties": false
}
```

The output will order properties as:

1. `name` (required, in schema order)
2. `email` (required, in schema order)
3. `notes` (optional, in schema order)
4. `age` (optional, in schema order)

This means the output might look like:

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "notes": "Interested in enterprise plan",
  "age": 35
}
```

If property order in the output is important to your application, mark all properties as required, or account for this reordering in your parsing logic.

### Invalid outputs

While structured outputs guarantee schema compliance in most cases, there are scenarios where the output may not match your schema:

**Refusals** (`stop_reason: "refusal"`)

Claude maintains its safety and helpfulness properties even when using structured outputs. If Claude refuses a request for safety reasons:

* The response has `stop_reason: "refusal"`
* You'll receive a 200 status code
* You'll be billed for the tokens generated
* The output may not match your schema because the refusal message takes precedence over schema constraints

A property that asks for the model's thinking or step-by-step reasoning may lead to a `reasoning_extraction` refusal. Ask for a short explanation instead. See [Keep reasoning in thinking blocks](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#keep-reasoning-in-thinking-blocks).

**Token limit reached** (`stop_reason: "max_tokens"`)

If the response is cut off due to reaching the `max_tokens` limit:

* The response has `stop_reason: "max_tokens"`
* The output may be incomplete and not match your schema
* Retry with a higher `max_tokens` value to get the complete structured output

**Enum value casing**

Structured outputs don't guarantee the capitalization of string `enum` and `const` values: Claude may return a value that differs from your schema only in capitalization, typically in the first letter of a word following a space. For example, given this schema:

```json
{
  "type": "string",
  "enum": ["Conversation Topic 1", "Conversation Topic 2", "Conversation topic 3"]
}
```

The output may contain `"Conversation Topic 3"` (capital "T") even though that exact value isn't in the enum. The response completes normally, with no error and no special `stop_reason`. This applies to both JSON outputs and strict tool use. Compare enum values case-insensitively, and avoid enum values that differ only in capitalization.

### Schema complexity limits

Structured outputs work by compiling your JSON schemas into a grammar that constrains Claude's output. More complex schemas produce larger grammars that take longer to compile. To protect against excessive compilation times, the API enforces several complexity limits.

#### Explicit limits

The following limits apply to all requests with `output_config.format` or `strict: true`:

| Limit                       | Value | Description                                                                                                                                                                                              |
| --------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strict tools per request    | 20    | Maximum number of tools with `strict: true`. Non-strict tools don't count toward this limit.                                                                                                             |
| Optional parameters         | 24    | Total optional parameters across all strict tool schemas and JSON output schemas. Each parameter not listed in `required` counts toward this limit.                                                      |
| Parameters with union types | 16    | Total parameters that use `anyOf` or type arrays (for example, `"type": ["string", "null"]`) across all strict schemas. These are especially expensive because they create exponential compilation cost. |

<Note>
  These limits apply to the combined total across all strict schemas in a single request. For example, if you have 4 strict tools with 6 optional parameters each, you'll reach the 24-parameter limit even though no single tool seems complex.
</Note>

#### Additional internal limits

Beyond the explicit limits in the preceding table, there are additional internal limits on the compiled grammar size. These limits exist because schema complexity doesn't reduce to a single dimension: features like optional parameters, union types, nested objects, and number of tools interact with each other in ways that can make the compiled grammar disproportionately large.

When these limits are exceeded, you'll receive a 400 error with the message "Schema is too complex for compilation." These errors mean the combined complexity of your schemas exceeds what can be efficiently compiled, even if each individual limit in the preceding table is satisfied. As a final stop-gap, the API also enforces a **compilation timeout of 180 seconds**. Schemas that pass all explicit checks but produce very large compiled grammars may hit this timeout.

#### Tips for reducing schema complexity

If you're hitting complexity limits, try these strategies in order:

1. **Mark only critical tools as strict.** If you have many tools, reserve it for tools where schema violations cause real problems, and rely on Claude's natural adherence for simpler tools.

2. **Reduce optional parameters.** Make parameters `required` where possible. Each optional parameter roughly doubles a portion of the grammar's state space. If a parameter always has a reasonable default, consider making it required and having Claude provide that default explicitly.

3. **Simplify nested structures.** Deeply nested objects with optional fields compound the complexity. Flatten structures where possible.

4. **Split into multiple requests.** If you have many strict tools, consider splitting them across separate requests or sub-agents.

For persistent issues with valid schemas, [contact support](https://support.claude.com/en/articles/9015913-how-to-get-support) with your schema definition.

## Migrating from the beta

The `output_format` parameter has moved to `output_config.format`, and beta headers are no longer required. The `output_format` parameter is deprecated and will be removed in the future. To use it anyway, add the `structured-outputs-2025-11-13` beta header. Without it, the API returns a 400 error.

The Python SDK (v1.0 and later) does not accept `output_format={...}` on `client.beta.messages.create()` or `count_tokens()` and raises a `TypeError`. Use `output_config` instead. See [Using a raw JSON schema](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#using-a-raw-json-schema) for the updated API shape.

## Data retention

Prompts and responses are processed with ZDR when using structured outputs. However, the JSON schema itself is temporarily cached for up to 24 hours since last use for optimization purposes. No prompt or response data is retained beyond the API response.

Structured outputs are HIPAA eligible, but **PHI must not be included in JSON schema definitions**. The API compiles JSON schemas into grammars that are cached separately from message content, and these cached schemas do not receive the same PHI protections as prompts and responses. Do not include PHI in schema property names, `enum` values, `const` values, or `pattern` regular expressions. PHI should only appear in message content (prompts and responses), where it is protected under HIPAA safeguards.

For ZDR and HIPAA eligibility across all features, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli).

## Feature compatibility

**Works with:**

* **[Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli):** Process structured outputs at scale with 50% discount
* **[Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli):** Count tokens without compilation
* **[Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli):** Stream structured outputs like normal responses
* **[Combined usage](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli#using-both-features-together):** Use JSON outputs (`output_config.format`) and strict tool use (`strict: true`) together in the same request

**Incompatible with:**

* **[Citations](https://platform.claude.com/docs/en/build-with-claude/citations?sdk_languages=cli):** Citations require interleaving citation blocks with text, which conflicts with strict JSON schema constraints. Returns 400 error if citations enabled with `output_config.format`.
* **Message Prefilling:** Incompatible with JSON outputs

<Tip>
  **Grammar scope:** Grammars apply only to Claude's direct output, not to tool use calls, tool results, or thinking tags (when using [thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli)). Grammar state resets between sections, allowing Claude to think freely while still producing structured output in the final response.
</Tip>

## Next steps

<CardGroup cols={2}>
  <Card title="Citations" icon="book-bookmark" href="https://platform.claude.com/docs/en/build-with-claude/citations?sdk_languages=cli">
    Have Claude cite its sources when answering questions about provided documents.
  </Card>

  <Card title="Strict tool use" icon="check" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use?sdk_languages=cli">
    Enforce JSON Schema compliance on Claude's tool inputs with grammar-constrained sampling.
  </Card>

  <Card title="Tool use with Claude" icon="wrench" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli">
    Connect Claude to external tools and APIs. Learn where tools execute and how the agentic loop works.
  </Card>

  <Card title="Pricing" icon="calculator" href="https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli">
    Learn about Anthropic's pricing structure for models and features.
  </Card>
</CardGroup>
