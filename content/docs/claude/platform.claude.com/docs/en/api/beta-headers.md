---
title: Beta headers
url: https://platform.claude.com/docs/en/api/beta-headers
description: Access experimental features before they become part of the standard API with the `anthropic-beta` header or the SDK's `betas` parameter.
---

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

<Info>
  The [client SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) exposes a `client.beta` namespace for calling the API with beta features enabled.
</Info>

## How to use beta headers

To access beta features, include the `anthropic-beta` header in your API requests:

```http
POST /v1/messages
Authorization: Bearer YOUR_API_KEY
anthropic-version: 2023-06-01
anthropic-beta: BETA_FEATURE_NAME
content-type: application/json
```

Each feature’s documentation states the exact beta name to send. The [API overview](https://platform.claude.com/docs/en/api/overview?sdk_languages=cli) lists the APIs in beta.

The following example sends a request with the [context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing?sdk_languages=cli) beta. The SDK takes beta names through `betas` and sends the `anthropic-beta` header for you:

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --beta context-management-2025-06-27 \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}'
  ```
</CodeGroup>

<Warning>
  Beta features are experimental and may:

  * Have breaking changes with notice
  * Be deprecated or removed
  * Have different rate limits or pricing
  * Not be available in all regions
</Warning>

### Multiple beta features

To use multiple beta features in a single request, include all feature names in the header separated by commas:

```http
anthropic-beta: feature1,feature2,feature3
```

You can also send the `anthropic-beta` header more than once in the same request. The Claude API reads every `anthropic-beta` header, so the following is equivalent to the previous example:

```http
anthropic-beta: feature1
anthropic-beta: feature2
anthropic-beta: feature3
```

With the SDK, list each feature (for example, `betas=["feature1", "feature2"]`). With the CLI, pass a single `--beta` flag with the feature names separated by commas (for example, `--beta feature1,feature2`). You can also repeat the flag (for example, `--beta feature1 --beta feature2`).

### Beta features on other platforms

Beta names are the same on every platform that accepts them, but not every platform accepts every beta. [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli), and [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli) take beta names in the `anthropic-beta` header, as the Claude API does. To send several betas, put their names in one header, separated by commas: Claude Models on Google Cloud (Google managed) reads only one `anthropic-beta` header and ignores the rest, so betas in the others don’t take effect.

On Amazon Bedrock, where beta names go depends on the API you call:

* [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli) (`bedrock-mantle` endpoints) takes them in the `anthropic-beta` header.
* The [InvokeModel API](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli) reads them from the request body, not from a header. List them in the body’s `anthropic_beta` array, one name for each element, for example `"anthropic_beta": ["feature1", "feature2"]`.

### Endpoint-specific headers

Some beta APIs are scoped to specific endpoints and require a feature-specific beta header on every request:

| Endpoints                                        | Beta header                 |
| ------------------------------------------------ | --------------------------- |
| `/v1/agents`, `/v1/sessions`, `/v1/environments` | `managed-agents-2026-04-01` |
| `/v1/tunnels`                                    | `mcp-tunnels-2026-06-22`    |
| `/v1/memory_stores` and sub-resources            | `agent-memory-2026-07-22`   |

The SDK’s `client.beta` namespace adds these headers automatically. Add them yourself only when making raw HTTP requests. See the [Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli), [Using agent memory](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli), and the [MCP tunnels reference](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/reference?sdk_languages=cli#tunnels-api) for details.

Endpoint-specific headers that apply to the same endpoint aren’t always combinable. On memory store endpoints, `agent-memory-2026-07-22` replaces `managed-agents-2026-04-01`: sending both on the same request returns a `400` error. The SDK sends the correct header for each endpoint automatically.

### Version naming conventions

Beta feature names typically follow the pattern `feature-name-YYYY-MM-DD`, where the date indicates when the beta was released. Always use the exact beta feature name as documented.

## Error handling

If you use an invalid beta name, or a beta your organization doesn’t have access to, you’ll receive a `400` error response:

```json Output
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Unexpected value(s) `invalid-beta-name` for the `anthropic-beta` header. Please consult our documentation at platform.claude.com/docs or try again without the header."
  },
  "request_id": "req_011CcnGfC9fELffo2EALu4Wd"
}
```

## Getting help

For updates to beta features, see the [release notes](https://platform.claude.com/docs/en/release-notes/overview?sdk_languages=cli). For help with production issues, contact [support](https://support.claude.com/).

## Next steps

<CardGroup cols={2}>
  <Card title="Errors" icon="info" href="https://platform.claude.com/docs/en/api/errors?sdk_languages=cli">
    Understand the HTTP status codes, error response shape, and request IDs the Claude API returns, and handle errors with the SDK’s typed exceptions.
  </Card>

  <Card title="API overview" icon="compass" href="https://platform.claude.com/docs/en/api/overview?sdk_languages=cli">
    Explore the Claude API’s features, including the APIs in beta.
  </Card>
</CardGroup>
