---
title: Claude API errors
url: https://platform.claude.com/docs/en/api/errors
description: Understand the HTTP status codes, error response shape, and request IDs the Claude API returns, and handle errors with the SDK's typed exceptions.
---

## HTTP errors

The API follows a predictable HTTP error code format:

* 400 - `invalid_request_error`: There was an issue with the format or content of your request. This error type may also be used for other 4XX status codes not listed in this section. The API also returns a 400 when usage reaches an organization or workspace [spend limit you set](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=curl#setting-your-own-spend-limit), except limits on the [Claude Code workspace](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=curl#claude-code-workspace), which can return a 429 instead.

* 401 - `authentication_error`: There's an issue with your [API key](https://platform.claude.com/docs/en/get-api-key?sdk_languages=curl) (for example, it's malformed, revoked, or expired; see [Key expiration](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=curl#key-expiration)). On Claude Platform on AWS, this can also indicate a problem with your AWS credentials or SigV4 signature.

* 402 - `billing_error`: There's an issue with your billing or payment information. Check your payment details in the [Claude Console](https://platform.claude.com), or in AWS Marketplace if you're using Claude Platform on AWS.

* 403 - `permission_error`: Your API key does not have permission to use the specified resource. Check your organization's access and workspace settings in the [Claude Console](https://platform.claude.com).

* 404 - `not_found_error`: The requested resource was not found. Check the endpoint path and any resource IDs in the request URL.

* 409 - `conflict_error`: The request conflicts with the current state of a resource. For example, the resource was modified concurrently, or a value that must be unique is already in use. Resolve the conflict, then retry the request.

* 413 - `request_too_large`: Request exceeds the maximum allowed number of bytes. See [Request size limits](https://platform.claude.com/docs/en/api/errors?sdk_languages=curl#request-size-limits) for per-endpoint maximums.

* 429 - `rate_limit_error`: Your organization has hit a [rate limit](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=curl), reached its usage tier's monthly spend cap, or reached a spend limit on the Claude Code workspace. A tier spend-cap 429 has no `retry-after` header and keeps failing until access resumes; see [Reaching your spend cap](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=curl#reaching-your-spend-cap) for how to recognize it.

* 500 - `api_error`: An unexpected error has occurred internal to Anthropic's systems. Retry the request with exponential backoff; if the error persists, contact support with the [request ID](https://platform.claude.com/docs/en/api/errors?sdk_languages=curl#request-id).

* 504 - `timeout_error`: The request timed out while processing. Consider using the [streaming Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl) for long-running requests. See [Long requests](https://platform.claude.com/docs/en/api/errors?sdk_languages=curl#long-requests) for more options.

* 529 - `overloaded_error`: The API is temporarily overloaded.

  <Warning>
    529 errors can occur when the API experiences high traffic across all users.

    In rare cases, if your organization has a sharp increase in usage, you might see 429 errors because of acceleration limits on the API. To avoid hitting acceleration limits, ramp up your traffic gradually and maintain consistent usage patterns.
  </Warning>

The official SDK automatically retries transient failures (such as connection errors, rate limits, and 5xx server errors) with exponential backoff, twice by default, honoring the `retry-after` header when present. The SDK client accepts `max_retries` to configure or disable this behavior.

When receiving a [streaming](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl) response over server-sent events (SSE), an error can occur after the API returns a 200 response. In that case, error handling doesn't follow these standard mechanisms. See [Error events](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl#error-events) for the shape of mid-stream errors.

## Request size limits

The API enforces request size limits:

| Endpoint type                                                                                          | Maximum request size |
| ------------------------------------------------------------------------------------------------------ | -------------------- |
| Messages API                                                                                           | 32 MB                |
| Token Counting API                                                                                     | 32 MB                |
| [Batch API](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=curl) | 256 MB               |
| [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=curl)            | 500 MB               |

If you exceed these limits, you'll receive a 413 `request_too_large` error. On the direct Claude API, Cloudflare returns this error before the request reaches the API servers.

## Error shapes

The API always returns errors as JSON, with a top-level `error` object that always includes a `type` and `message` value. The response also includes a `request_id` field for easier tracking and debugging. For example:

```json JSON
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

In accordance with the [versioning](https://platform.claude.com/docs/en/api/versioning?sdk_languages=curl) policy, the values within these objects may expand, and it is possible that the `type` values will grow over time.

## SDK error types

The official SDK raises typed exceptions for these errors instead of returning raw JSON. For example, a 404 surfaces as `anthropic.NotFoundError` (python). The Go SDK has one error type for every status, `*anthropic.Error`: branch on `StatusCode`. Catch the SDK's typed classes rather than string-matching error messages, handling the most specific classes first. Your SDK's page documents the full exception hierarchy:

* [Python](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python?sdk_languages=curl#handling-errors) · [TypeScript](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript?sdk_languages=curl#handling-errors) · [C#](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/csharp?sdk_languages=curl#error-handling) · [Go](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/go?sdk_languages=curl#error-handling) · [Java](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/java?sdk_languages=curl#error-handling) · [PHP](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/php?sdk_languages=curl#error-handling) · [Ruby](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/ruby?sdk_languages=curl#handling-errors)

## Request ID

Every API response includes a unique `request-id` header. This header contains a value such as `req_018EeWyXxfu5pfWkrYcMdjWG`. The same identifier appears as the `request_id` field in [error response bodies](https://platform.claude.com/docs/en/api/errors?sdk_languages=curl#error-shapes). When contacting support about a specific request, include this ID to help quickly resolve your issue.

On [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=curl), responses include two request IDs: the AWS request ID (`x-amzn-requestid`, primary, indexed in CloudTrail) and the Anthropic request ID (`request-id`, secondary). Use the AWS request ID for CloudTrail lookups and the Anthropic request ID for Anthropic support tickets.

The Python and TypeScript SDKs expose the request ID as a `_request_id` property on top-level response objects. The C#, Go, Java, and PHP SDKs expose it through their raw-response accessors, and the Ruby SDK through [middleware](https://platform.claude.com/docs/en/cli-sdks-libraries/middleware?sdk_languages=curl). In every SDK except Ruby, use `with_raw_response` to read any other [response header](https://platform.claude.com/docs/en/api/overview?sdk_languages=curl#response-headers), such as `anthropic-organization-id` and [`anthropic-workspace-id`](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=curl#identify-the-workspace-behind-an-api-response). In Ruby, use the same middleware. On Claude Platform on AWS, use the raw-response accessor to read the AWS request ID (`x-amzn-requestid`) as well:

<CodeGroup>
  ```bash cURL
  # Print the response headers (including request-id); discard the body
  curl -sS -D - -o /dev/null https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-sonnet-5",
      "max_tokens": 1024,
      "messages": [{"role": "user", "content": "Hello, Claude"}]
    }'
  ```
</CodeGroup>

For Claude Platform on AWS request-ID examples in other languages, see [Request IDs](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=curl#request-ids).

## Long requests

<Warning>
  Consider using the [streaming Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl) or [Message Batches API](https://platform.claude.com/docs/en/api/messages/batches/create?sdk_languages=curl) for long-running requests, especially those over 10 minutes.
</Warning>

Avoid setting a large `max_tokens` value without using the [streaming Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl) or [Message Batches API](https://platform.claude.com/docs/en/api/messages/batches/create?sdk_languages=curl):

* Some networks may drop idle connections after a variable period of time, which can cause the request to fail or time out without receiving a response from Anthropic.
* Networks differ in reliability. The [Message Batches API](https://platform.claude.com/docs/en/api/messages/batches/create?sdk_languages=curl) can help you manage the risk of network issues by allowing you to poll for results rather than requiring an uninterrupted network connection.

If you are building a direct API integration, setting a [TCP socket keep-alive](https://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html) can reduce the impact of idle connection timeouts on some networks.

The [SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=curl) validate that your non-streaming Messages API requests are not expected to exceed a 10-minute timeout. They also set a socket option for TCP keep-alive.

If you don't need to process events incrementally, the SDK can consume the stream for you and return the complete `Message` object, identical to what a non-streaming call returns:

<CodeGroup>
  ```bash cURL
  # Raw SSE output requires handling events; there is no single-command way
  # to accumulate the final message with curl. Use the SDK examples instead.
  ```
</CodeGroup>

See [Streaming Messages](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl#get-the-final-message-without-handling-events) for more details.

## Common validation errors

### Prefill not supported

Claude 4.6 and later models and [Claude Mythos Preview](https://anthropic.com/glasswing) do not support prefilling assistant messages. Sending a request with a prefilled last assistant message to any of these models returns a 400 `invalid_request_error`:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "This model does not support assistant message prefill. The conversation must end with a user message."
  }
}
```

Use [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=curl) on models that support it, system prompt instructions, or [`output_config.format`](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=curl#usage) instead.

### Thinking blocks cannot be modified

If the most recent assistant message contains `thinking` or `redacted_thinking` blocks that were edited, reordered, filtered out, or reconstructed before being sent back to the API, the request returns a 400 `invalid_request_error`. The error message starts with the position of the offending block (for example, `messages.1.content.0`) and contains:

```text wrap
`thinking` or `redacted_thinking` blocks in the latest assistant message cannot be modified. These blocks must remain as they were in the original response.
```

With tool use, every `thinking` and `redacted_thinking` block from the assistant turn must be passed back exactly as received, including blocks whose `thinking` field is empty. Pass thinking blocks back unchanged, and if your application filters content blocks by type before resending, include both `thinking` and `redacted_thinking`. See [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl#error-thinking-blocks-modified), [Preserving thinking blocks](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=curl#preserving-thinking-blocks), and [Preserved thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=curl#preserved-thinking).

### Extended thinking not supported

Claude 4.7 and later models have removed extended thinking. Sending `thinking: {"type": "enabled"}` to any of these models returns a 400 `invalid_request_error`:

```text wrap
"thinking.type.enabled" is not supported for this model. Use "thinking.type.adaptive" and "output_config.effort" to control thinking behavior.
```

Use [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=curl) instead. [Migrating to adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking?sdk_languages=curl#migrating-to-adaptive-thinking) shows the parameter mapping, and [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl#error-thinking-type-enabled) covers the symptom-first fix.

### Adaptive thinking not supported

Models that support only extended thinking (Claude 4.5 and earlier models) reject `thinking: {"type": "adaptive"}` with a 400 `invalid_request_error`:

```text wrap
adaptive thinking is not supported on this model
```

Use `thinking: {"type": "enabled", "budget_tokens": N}` on these models; see [Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking?sdk_languages=curl) for the configuration and [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl#error-thinking-type-adaptive) for the symptom-first fix.

### Thinking cannot be disabled

On Claude Fable 5.1, [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=curl), Claude Fable 5, [Claude Mythos 5](https://platform.claude.com/docs/en/models/mythos-5/overview?sdk_languages=curl), Claude Opus 5.5, and [Claude Mythos Preview](https://anthropic.com/glasswing), thinking is always on. Sending `thinking: {"type": "disabled"}` to any of these models returns a 400 `invalid_request_error`. On all of these models except Claude Mythos Preview, the message reads:

```text wrap
"thinking.type.disabled" is not supported for this model. Use "thinking.type.adaptive" and "output_config.effort" to control thinking behavior.
```

On Claude Mythos Preview, the only one of these models that accepts extended thinking, the message reads:

```text wrap
"thinking.type.disabled" is not supported for this model. Thinking defaults to adaptive mode when not specified; use "thinking.type.enabled" with "budget_tokens" for extended thinking.
```

On Claude Sonnet 5.5, thinking can't be set to `disabled`. Use `thinking: {"type": "between_tools"}` for the lowest thinking setting, which turns off up-front thinking. Sending `thinking: {"type": "disabled"}` returns a 400 `invalid_request_error` with this message:

```text wrap
To turn thinking off on this model, send "thinking": {"type": "between_tools"} instead of {"type": "disabled"}. The model does not think before responding. The short updates it writes between tool calls come back as thinking blocks.
```

At `xhigh` or `max` [effort](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=curl), a request with `between_tools` also returns a 400 `invalid_request_error`. The message says thinking is disabled because `between_tools` has no up-front thinking:

```text wrap
output_config.effort 'xhigh' is not supported when thinking is disabled on this model. Use effort 'high' or below, or enable thinking.
```

With `between_tools`, effort can't change mid-conversation: a per-message `output_config.effort` that differs from the level in effect returns a 400 error. The error names the position of the message that set the new level:

```text wrap
messages.N: output_config.effort 'low' differs from the 'high' in effect before it; effort cannot change when thinking is disabled on this model. Use effort 'high', or enable thinking.
```

Claude Haiku 5.5 accepts `thinking: {"type": "disabled"}` and holds it to the same two effort limits that apply to `between_tools`: at `xhigh` or `max` effort, or with a per-message `output_config.effort` that differs from the level in effect, the request returns a 400 `invalid_request_error` with the matching message shown earlier.

In both messages, "enable thinking" means adaptive thinking: omit the `thinking` field or send `thinking: {"type": "adaptive"}`. Claude Sonnet 5.5 and Claude Haiku 5.5 reject `"enabled"` with a 400 error. To vary effort per turn, use adaptive thinking.

Sending `thinking: {"type": "between_tools"}` to any model other than Claude Sonnet 5.5 returns a 400 `invalid_request_error`:

```text wrap
"thinking.type.between_tools" is not supported for this model.
```

For the fixes, see [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl#error-thinking-type-between-tools), which covers the `between_tools` and effort errors.

Omit the `thinking` parameter and the request runs with adaptive thinking. To keep thinking content out of responses without turning thinking off, set `display: "omitted"` on the thinking configuration. See [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl#error-thinking-type-disabled).

### Forced tool use not supported

Claude Opus 5.5, Claude Sonnet 5.5, Claude Fable 5.1, and [Claude Mythos 5.1](https://platform.claude.com/docs/en/models/mythos-5-1/overview?sdk_languages=curl) don't support forced tool use. Sending `tool_choice: {"type": "any"}` or `tool_choice: {"type": "tool", "name": "..."}` to any of these models, including on the [token counting endpoint](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=curl), returns a 400 `invalid_request_error`:

```text wrap
tool_choice: type "tool" and "any" are not supported for this model.
```

`tool_choice: {"type": "auto"}` (the default) and `{"type": "none"}` are accepted. Use `auto` with [strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use?sdk_languages=curl) to keep tool inputs schema-valid, or [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=curl) when you need the response itself in a fixed JSON shape. See [Forcing tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools?sdk_languages=curl#forcing-tool-use).

### Computer use tool version not supported

On the Claude API and Google Cloud, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 support [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=curl) only as the `computer_toolset_20260801` toolset. On those platforms, sending any of these models a `tools` entry of the earlier `computer_20251124` or `computer_20250124` type, with that tool's beta header, returns a 400 `invalid_request_error`. The message names the rejected type, then lists the tool types the model does accept after `Did you mean one of`. For Claude Opus 5.5, it begins:

```text wrap
'claude-opus-5-5' does not support tool types: computer_20251124.
```

The API returns the same message for any Anthropic-defined tool type that the requested model doesn't support. Declare `{"type": "computer_toolset_20260801"}` without the beta header and update your agent loop as described in [Migrate from `computer_20251124`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=curl#migrate-from-computer-20251124). To move from `computer_20250124`, see [Move computer use to the toolset](https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide?sdk_languages=curl#computer-use-toolset) in the Claude Haiku 5.5 migration guide. Earlier models that support the toolset keep accepting `computer_20251124`, as do Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 on Amazon Bedrock.

### Thinking block no longer matches the conversation

On Claude Fable 5.1, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5, the API accepts a replayed thinking block only while the `system` prompt, `tools`, and messages that preceded it are unchanged. For new accounts created on or after August 31, 2026, and for any request that sets `thinking.block_binding.prefix_mismatch_behavior` to `"error"`, a replayed block whose earlier history changed is rejected with a 400 `invalid_request_error` (with `"drop_block"`, the API drops the block and the request succeeds). The message starts with the position of the first failing block:

```text wrap
messages.{i}.content.{j}: Invalid `signature` in `thinking` block. The block is bound to a different conversation. Remove the block, or set `thinking.block_binding.prefix_mismatch_behavior` to "drop_block".
```

Without the `thinking-binding-controls-2026-08-01` beta header the message also names that header. Keep the conversation history append-only, or send the beta header with `prefix_mismatch_behavior: "drop_block"` to drop the block and continue. On Claude Sonnet 5.5 and Claude Haiku 5.5, `block_binding` works only with `thinking: {"type": "adaptive"}`. With `between_tools` on Claude Sonnet 5.5, or `thinking: {"type": "disabled"}` on Claude Haiku 5.5, keep the history append-only, or strip the thinking blocks from the edited turn on. A block from a model the target model can't read is dropped rather than rejected. See [Keeping the prefix unchanged](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking?sdk_languages=curl#prefix-check) and [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl#error-thinking-block-signature).

Sending `thinking.block_binding` without the `thinking-binding-controls-2026-08-01` [beta header](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=curl) returns a 400 `invalid_request_error` whose message ends in:

```text wrap
block_binding: Extra inputs are not permitted
```

Add the header, or remove the field.

### Outbound web identity federation disabled (Claude Platform on AWS)

If every request to [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=curl) returns `"Outbound web identity federation is disabled for your account"`, run `aws iam enable-outbound-web-identity-federation` once per AWS account. See [Enable outbound web identity federation](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=curl#enable-outbound-web-identity-federation) for details.

## Next steps

<CardGroup cols={3}>
  <Card title="Troubleshooting thinking" icon="wrench" href="https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting?sdk_languages=curl">
    Symptom-first fixes for thinking configuration 400 errors, empty thinking blocks, and `max_tokens` stops.
  </Card>

  <Card title="Rate limits" icon="gauge" href="https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=curl">
    To mitigate misuse and manage capacity on the API, limits are in place on how much an organization can use the Claude API.
  </Card>

  <Card title="Streaming messages" icon="lightning" href="https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=curl">
    Stream Messages API responses incrementally with server-sent events, including text, tool use, and extended thinking deltas.
  </Card>
</CardGroup>
