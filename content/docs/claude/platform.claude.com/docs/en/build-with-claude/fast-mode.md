---
title: Fast mode (research preview)
url: https://platform.claude.com/docs/en/build-with-claude/fast-mode
description: Get up to 2.5x higher output tokens per second from supported Claude Opus models.
---

Fast mode delivers up to 2.5x higher output tokens per second from Claude Opus 5.5, Claude Opus 5, and Claude Opus 4.8 at premium pricing. Set `speed: "fast"` with the `fast-mode-2026-02-01` beta header on your request to opt in.

<Note>
  Fast mode is in research preview. Contact your account manager to request access. If you do not have an account manager, [join the waitlist](https://claude.com/fast-mode) for fast mode.
</Note>

<Note>
  To learn how zero data retention (ZDR) applies to this feature, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli).
</Note>

## Supported models

Fast mode is supported on the following models:

* Claude Opus 5.5 (claude-opus-5-5)
* Claude Opus 5 (claude-opus-5)
* Claude Opus 4.8 (claude-opus-4-8)

<Note>
  Fast mode for Claude Opus 5.5, Claude Opus 5, and Claude Opus 4.8 is available as a research preview on the Claude API, including [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli), only. It is not available on Amazon Bedrock, Claude Platform on AWS, Google Cloud, or Microsoft Foundry.
</Note>

<Note>
  Fast mode is not available on Claude Opus 4.7. Requests to `claude-opus-4-7` with `speed: "fast"` return an error; unlike Claude Opus 4.6 (see the following note), requests do not fall back to standard speed. The model itself remains available at standard speed. To continue using fast mode, see [Migrating to Claude Opus 5.5 from Claude Opus 4.7](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide?sdk_languages=cli#migrating-from-claude-opus-47).
</Note>

<Note>
  Fast mode is not available on Claude Opus 4.6. Requests to `claude-opus-4-6` with `speed: "fast"` do not return an error: they run at standard speed and are billed at [standard rates](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli) rather than fast mode's premium rates, and the response reports [`usage.speed: "standard"`](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli#checking-which-speed-was-used). To continue using fast mode, see [Migrating to Claude Opus 5.5 from Claude Opus 4.6 and earlier Opus models](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide?sdk_languages=cli#migrating-from-claude-opus-46).
</Note>

## How fast mode works

Fast mode runs the same model with a faster inference configuration. There is no change to intelligence or capabilities.

* Up to 2.5x higher output tokens per second compared to standard speed
* Speed benefits are focused on output tokens per second (OTPS), not time to first token (TTFT)
* Same model weights and behavior (not a different model)
* Compatible with [streaming](https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli), where the OTPS gain is most visible

## Basic usage

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --beta fast-mode-2026-02-01 \
    --transform 'content.#(type=="text").text' \
    --raw-output <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  speed: fast
  messages:
    - role: user
      content: Refactor this module to use dependency injection
  YAML
  ```
</CodeGroup>

## Pricing

Fast mode is priced at a multiplier on standard rates across the full context window, including requests over 200k input tokens. The following table shows fast mode pricing for the supported models:

| Model                           | Input          | Output         |
| ------------------------------- | -------------- | -------------- |
| Claude Opus 5.5                 | $8 USD / MTok  | $40 USD / MTok |
| Claude Opus 5 / Claude Opus 4.8 | $10 USD / MTok | $50 USD / MTok |

Fast mode pricing stacks with other pricing modifiers:

* [Prompt caching multipliers](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli#prompt-caching) apply on top of fast mode pricing
* [Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency?sdk_languages=cli) multipliers apply on top of fast mode pricing

For complete pricing details, see the [Pricing](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli#fast-mode-pricing) page.

## Rate limits

Fast mode has a dedicated rate limit that is separate from standard Opus rate limits. When your fast mode rate limit is exceeded, the API returns a `429` error with a `retry-after` header indicating when capacity will be available.

The response includes headers that indicate your fast mode rate limit status:

| Header                                   | Description                                       |
| ---------------------------------------- | ------------------------------------------------- |
| `anthropic-fast-input-tokens-limit`      | Maximum fast mode input tokens per minute         |
| `anthropic-fast-input-tokens-remaining`  | Remaining fast mode input tokens                  |
| `anthropic-fast-input-tokens-reset`      | Time when the fast mode input token limit resets  |
| `anthropic-fast-output-tokens-limit`     | Maximum fast mode output tokens per minute        |
| `anthropic-fast-output-tokens-remaining` | Remaining fast mode output tokens                 |
| `anthropic-fast-output-tokens-reset`     | Time when the fast mode output token limit resets |

For tier-specific rate limits, see the [Rate limits](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=cli) page.

## Checking which speed was used

The response `usage` object includes a `speed` field that indicates which speed was used, either `"fast"` or `"standard"`. Requesting `speed: "fast"` on a [model that doesn't support fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli#supported-models) returns an error, and so does exceeding fast mode's rate limits or capacity (a `429` or `529`). When a request with `speed: "fast"` succeeds, `usage.speed` is `"fast"`. If you are using Claude Opus 4.6 and request fast mode, its behavior is unique. Instead of returning an error like other models that don't support fast mode, it silently switches to standard speed. Though there is no error with Opus 4.6, the `speed` field accurately shows `"standard"`.

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --beta fast-mode-2026-02-01 \
    --transform usage.speed \
    --raw-output <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  speed: fast
  messages:
    - role: user
      content: Hello
  YAML
  ```
</CodeGroup>

```json Output
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
// ...
  "usage": {
    "input_tokens": 8,
    "output_tokens": 12,
    "speed": "fast"
  }
}
```

To track fast mode usage and costs across your organization, see the [Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api?sdk_languages=cli).

## Retries and fallback

### Automatic retries

When fast mode rate limits are exceeded, the API returns a `429` error with a `retry-after` header. The SDK automatically retries these requests up to 2 times by default (configurable with `max_retries`), waiting for the server-specified delay before each retry. Because fast mode uses continuous token replenishment, the `retry-after` delay is typically short and requests succeed once capacity is available.

### Falling back to standard speed

<Note>
  This section covers an opt-in client-side fallback when fast mode is rate limited. It is separate from the behavior on [Claude Opus 4.6](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli#supported-models), where fast mode is not available and requests run at standard speed automatically.
</Note>

If you'd prefer to fall back to standard speed rather than wait for fast mode capacity, catch the rate limit error and retry without `speed: "fast"`. Set `max_retries` to `0` on the initial fast request to skip automatic retries and fail immediately on rate limit errors.

<Note>
  Falling back from fast to standard speed will result in a [prompt cache](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) miss. Requests at different speeds do not share cached prefixes.
</Note>

Because setting `max_retries` to `0` also disables retries for other transient errors (overloaded, internal server errors), the following examples reissue the original request with default retries for those cases.

<CodeGroup exclude="shell:cURL">
  ```bash CLI
  # `ant` retries 429/5xx automatically and has no per-request max_retries
  # override, so on a fast-mode 429 the fallback runs after the built-in
  # retries exhaust. --transform-error surfaces error.type for branching.
  create_message_with_fast_fallback() {
    local speed="$1" max_attempts="${2:-3}" body out
    body=${3:-$(cat)}
    out=$(
      ant beta:messages create --beta fast-mode-2026-02-01 \
        ${speed:+--speed "$speed"} \
        --transform-error error.type --format-error yaml <<<"$body" 2>/dev/null
    ) && { printf '%s\n' "$out"; return; }
    case "$out" in
      rate_limit_error)
        if [[ -n "$speed" ]]; then
          create_message_with_fast_fallback "" "$max_attempts" "$body"
          return
        fi ;;
      overloaded_error | api_error | "")
        if (( max_attempts > 1 )); then
          create_message_with_fast_fallback "$speed" $((max_attempts - 1)) "$body"
          return
        fi ;;
    esac
    printf '%s\n' "${out:-connection_error}" >&2
    return 1
  }

  MESSAGE=$(
    create_message_with_fast_fallback fast <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content: Hello
  YAML
  )
  ```
</CodeGroup>

## Considerations

* **Prompt caching:** Switching between fast and standard speed invalidates the prompt cache. Requests at different speeds do not share cached prefixes.
* **Supported models:** Fast mode is supported on Claude Opus 5.5, Claude Opus 5, and Claude Opus 4.8. See [Supported models](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli#supported-models).
* **TTFT:** Fast mode's benefits are focused on output tokens per second (OTPS), not time to first token (TTFT).
* **Batch API:** Fast mode is not available with the [Batch API](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli).
* **Priority Tier:** Fast mode is not available with a [Priority Tier](https://platform.claude.com/docs/en/api/service-tiers?sdk_languages=cli) commitment.
* **Claude Platform on AWS:** Fast mode is not currently available on [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli).

## Next steps

<CardGroup cols={2}>
  <Card title="Structured outputs" icon="code-brackets" href="https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli">
    Get validated JSON results from agent workflows.
  </Card>

  <Card title="Pricing" icon="calculator" href="https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli#fast-mode-pricing">
    Learn about Anthropic's pricing structure for models and features.
  </Card>

  <Card title="Effort" icon="gauge" href="https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli">
    Control how many tokens Claude uses when responding with the effort parameter, trading off between response thoroughness and token efficiency.
  </Card>

  <Card title="Streaming messages" icon="arrow-right" href="https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli">
    Stream Messages API responses incrementally with server-sent events, including text, tool use, and extended thinking deltas.
  </Card>
</CardGroup>
