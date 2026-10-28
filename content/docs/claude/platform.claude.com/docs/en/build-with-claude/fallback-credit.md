---
title: Fallback credit
url: https://platform.claude.com/docs/en/build-with-claude/fallback-credit
description: Avoid paying the prompt-cache cost twice when you retry a refused request on another model.
---

Prompt caches are per-model. When a model declines a request and you retry on another model, the conversation prefix already cached for the first model must be written into the new model’s cache in full. Cache writes cost more than cache reads. Fallback credit removes that extra cost. The refusal carries a credit token, you echo the token on the retry, and the retry is billed as though the conversation had been on the new model from the start.

You need this page only when you build the retry yourself: over raw HTTP or with custom retry logic. [Server-side fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback) and [client-side fallback with the SDK middleware](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#client-side-fallback) apply fallback credit automatically. If you use either, skip this page.

[Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli) covers detecting refusals and choosing a fallback approach. [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) explains cache reads and cache writes if those terms are new.

## The basic flow

<Steps>
  <Step title="Opt in with the beta header">
    Send the request that may be refused with the `anthropic-beta: fallback-credit-2026-07-01` header. The `server-side-fallback-2026-07-01` header also grants the same fields, except on Amazon Bedrock and Claude Models on Google Cloud (Google managed), which return a 400 error for that header. The earlier `fallback-credit-2026-06-01` header remains accepted and grants the same fields.
  </Step>

  <Step title="Read two fields from the refusal">
    On a refusal, `stop_details` includes two fields:

    * **`fallback_credit_token`:** an opaque string that represents the credit
    * **`fallback_has_prefill_claim`:** a Boolean that tells you which retry body shape to use

    Both are `null` when no credit is available for the refusal.
  </Step>

  <Step title="Build the retry">
    Start from the refused request body. Set `model` to the fallback model and add the token as the top-level `fallback_credit_token` parameter. Pick the body shape from the following table.
  </Step>

  <Step title="Send the retry with the same header">
    Send the retry with the same `fallback-credit-2026-07-01` beta header. The retry needs the header to redeem the token.
  </Step>
</Steps>

The `fallback_has_prefill_claim` field tells you whether the retry can continue the refused model’s partial output instead of starting over:

| `fallback_has_prefill_claim` | Retry body                                                                                                                                                                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `true`                       | The refused request body, unchanged, plus one appended assistant message whose `content` echoes the refused response’s `content`. The retry model continues the response from where the refused model stopped, and completed server tool calls are not run again. |
| `false`                      | The refused request body, unchanged.                                                                                                                                                                                                                              |

## Example

The following example makes a request that might be refused and redeems the credit token on a retry against Claude Opus 4.8. When a retry attempt is rejected, the example degrades through the rejection ladder: the sequence of progressively simpler retry shapes covered in [When a retry is rejected](https://platform.claude.com/docs/en/build-with-claude/fallback-credit?sdk_languages=cli#when-a-retry-is-rejected).

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Where it works

Fallback credit is in beta on the Claude API, Amazon Bedrock, Claude Platform on AWS, Claude Models on Google Cloud (Google managed), and Microsoft Foundry. Refusals in [Message Batches](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli) don’t mint credit tokens, and redemption applies only to direct Messages API requests: a token passed on a batch request is accepted but ignored. A Claude Haiku 5.5 refusal carries no fallback credit, so a retry after one pays the full cost of writing the fallback model’s prompt cache.

The retry model must be one of the refused model’s permitted fallback targets. For Claude Fable 5.1, Claude Fable 5, and Claude Opus 5.5, those are Claude Opus 4.8 (`claude-opus-4-8`) and Claude Opus 5 (`claude-opus-5`). For Claude Opus 5, it is Claude Opus 4.8. For Claude Sonnet 5.5, it is Claude Sonnet 5 (`claude-sonnet-5`).

<Accordion title="Looking up permitted fallback targets programmatically">
  On the Claude API and Claude Platform on AWS, the target list is published as `allowed_fallback_models` on each model’s entry in the [Models API](https://platform.claude.com/docs/en/api/beta/models/list?sdk_languages=cli) when the `server-side-fallback-2026-07-01` beta header is set. The list is not yet visible under the `fallback-credit-*` header alone. It is not exposed on Amazon Bedrock, Claude Models on Google Cloud (Google managed), or Microsoft Foundry.
</Accordion>

## Checking that the credit applied

The refund is visible in the retry’s `usage`. Compared with what the same request would report without the token, `cache_creation_input_tokens` is lower, and `cache_read_input_tokens` is higher by the same amount. A shift of zero means the token was honored but there was nothing to reprice, for example because the retry model’s cache was already warm.

## When a retry is rejected

Most retries redeem on the first attempt. When one does not, the API returns a 400 error that tells you what to try next.

<Steps>
  <Step title="Continuation rejected: resend the unchanged body">
    If the retry that appends the assistant message is rejected with a 400 error, resend the refused request body unchanged, still with the token.
  </Step>

  <Step title="Token rejected: drop the token">
    If the unchanged body is also rejected with a 400 error whose message names `fallback_credit_token`, retry without the token. The credit is forfeited, but the retry itself goes through.
  </Step>
</Steps>

<Note>
  If the refused request ran server tools, a tokenless retry re-runs and re-bills those tools. In that case, surface the 400 error to your caller instead of falling through to a tokenless retry.
</Note>

<Accordion title="If the error says ‘redemption temporarily unavailable’">
  This rejection is transient, not a verdict on your retry shape. Retry the same request, with the same token, within the token’s 5-minute window. Do not move to the next step of the ladder.
</Accordion>

## Reference

The following sections cover edge cases and the complete redemption rules. Most integrations do not need them.

<Accordion title="Fields that must match the refused request">
  Redemption compares the retry against the refused request. Every field that shapes the prompt must match exactly. Fields that do not shape the prompt may change on the retry.

  | Rule                    | Fields                                                                                                                                                                      |
  | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Must match exactly      | `system`, `messages`, `tools`, `tool_choice`, `thinking`, and `cache_control`, plus `output_config`, `mcp_servers`, `context_management`, and `container` when you use them |
  | May change on the retry | `model`, `max_tokens`, `stop_sequences`, `stream`, `metadata`, and `service_tier`                                                                                           |

  The continuation shape (`fallback_has_prefill_claim: true`) is the one exception to the `messages` match: it adds exactly one assistant message at the end of `messages`.

  Do not strip `thinking` or `redacted_thinking` blocks from earlier turns on the retry, even though a plain retry without a token usually strips them. The body must match the refused request, and the server handles those blocks itself.
</Accordion>

<Accordion title="Beta headers must match too">
  Send the same `anthropic-beta` headers on the retry as on the refused request. A beta header present on one of the two requests but not the other can fail the match even when the bodies are identical. The resulting 400 error carries the same `request body ... does not match` message as a body difference, so a header difference is easy to misread as a body problem. In particular, do not add or drop beta headers based on which model the request targets.

  Two header families are exempt from the match, for the retry’s sake:

  * **`server-side-fallback-*`:** a retry must drop the `fallbacks` parameter, and dropping this header along with it does not cause a mismatch.
  * **`fallback-credit-*`:** keep this header on both requests. The retry needs it to redeem the token.

  <Note>
    On models that include the 1M token context window by default, such as Claude Fable 5.1, Claude Fable 5, Claude Opus 5.5, Claude Opus 5, Claude Opus 4.8, Claude Sonnet 5.5, and Claude Sonnet 5, the `context-1m-2025-08-07` beta header has no effect. To keep the two requests identical, omit that header on both rather than sending it on one and not the other.
  </Note>
</Accordion>

<Accordion title="When fallback_has_prefill_claim is absent">
  The field has no value only when the token has none either, so while you hold a token the field has a value, except on Amazon Bedrock, Claude Models on Google Cloud (Google managed), and Microsoft Foundry, where it can still be absent while their support for the field rolls out. In that case, treat the retry shape as unknown rather than as `false`. Try the appended-assistant-message shape first, and rely on the rejection handling in [When a retry is rejected](https://platform.claude.com/docs/en/build-with-claude/fallback-credit?sdk_languages=cli#when-a-retry-is-rejected), which falls back to the unchanged body.
</Accordion>

<Accordion title="Echoing the refused response’s content">
  When a refusal’s token supports the continuation shape, the response `content` carries only the model’s own output, and the refusal explanation is delivered in `stop_details.explanation`. You can therefore echo `content` into the appended assistant message as-is.

  Two adjustments might still be needed before sending:

  * If the final block you send is a `text` block, strip its trailing whitespace.
  * Omit any client-side `tool_use` block that has no matching `tool_result`.

  If the echoed content includes a `fallback` block from an earlier [server-side fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback), keep the block exactly where it appeared. It is accepted on any request without a beta header. The API uses its position to validate the thinking blocks around it, so a request that echoes thinking blocks from both sides of that boundary is rejected if the block is omitted or moved.
</Accordion>

<Accordion title="Token scope and lifetime">
  The token redeems only from the organization and workspace that received the refusal, including on Microsoft Foundry. On Amazon Bedrock and Claude Models on Google Cloud (Google managed), which do not have workspaces, the token is bound to the platform’s caller identity instead.

  The token expires 5 minutes after the refusal. After that, send the retry without it. The token is also stateless: the server stores nothing about it, and there is no endpoint to inspect or revoke it.
</Accordion>

<Accordion title="When a token cannot be redeemed by either shape">
  When the refusal arrived after server tools had already run within the request, the token redeems only by continuing the partial response. That restriction is what prevents the completed tool calls from running, and billing, again.

  One combination can therefore leave the token unredeemable by either shape, when both of the following are true:

  * The request used `output_config.format` or a `tool_choice` that forces tool use. Either one rules out the appended-assistant-message shape.
  * The refusal arrived after server tools had run. That rules out the unchanged body.

  If the unchanged-body retry is rejected with a 400 error saying the token must be redeemed by continuing the partial response, discard the token. A retry without it goes through, but it re-runs and re-bills the completed server tools. Surface the cost or the error to your caller rather than retrying silently.
</Accordion>

## Next steps

<CardGroup>
  <Card title="Refusals and fallback" icon="shield" href="https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli">
    Detect refusals and choose between server-side fallback, the SDK middleware, and a manual retry.
  </Card>

  <Card title="Prompt caching" icon="bolt" href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli">
    How cache reads and cache writes are billed.
  </Card>

  <Card title="Stop reasons and fallback" icon="code" href="https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli">
    Every `stop_reason` value and how to handle it.
  </Card>

  <Card title="SDK middleware" icon="settings" href="https://platform.claude.com/docs/en/cli-sdks-libraries/middleware?sdk_languages=cli">
    The SDK helper that applies fallback credit automatically.
  </Card>
</CardGroup>
