---
title: Handle streaming refusals
url: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals
description: Detect and handle refusal stop reasons in streaming responses, and retry refused requests on a fallback model.
---

Starting with Claude 4 models, streaming responses from Claude's API return **`stop_reason`: `"refusal"`** when streaming classifiers intervene to handle potential policy violations. This safety feature helps maintain content compliance during real-time streaming.

<Tip>
  This page covers how refusals appear in streaming responses. For every `stop_reason` value and how to handle it, see [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli). To retry refused requests on another Claude model, see [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli).
</Tip>

## API response format

When streaming classifiers detect content that violates Anthropic's policies, the API returns this response:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello.."
    }
  ],
  "stop_reason": "refusal",
  "stop_details": {
    "type": "refusal",
    "category": "cyber",
    "explanation": "This request was declined because it could enable cyber harm."
  }
}
```

In the event stream, `stop_details` arrives on the `message_delta` event alongside `stop_reason`.

<Note>
  A `refusal` response from streaming classifiers includes a `stop_details` object with a `category` and a human-readable `explanation` that you can surface to the user. See [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#refusal-response) for the full response shape and the available categories.

  On a refusal the `stop_details` object is always present, but its `category` and `explanation` fields can be `null`, for example when the refusal maps to no named category. Branch on `stop_reason` or `stop_details.type` rather than assuming `category` and `explanation` are populated, and provide your own user-facing messaging when they are `null`.
</Note>

## Reset context after refusal

When you receive **`stop_reason`: `refusal`**, you must reset the conversation context before continuing. You can remove or rephrase the turn that triggered the refusal, or clear the conversation history entirely. Attempting to continue without resetting will result in continued refusals.

<Note>
  Usage metrics are still provided in the response, even when the response is refused. Whether a refused request is billed depends on when the refusal arrives and its category; see [How refusals are billed](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#how-refusals-are-billed).
</Note>

<Tip>
  Resetting context is not the only way to recover. You can also retry the refused request on a different Claude model, and the [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli) page shows how to set that up with server-side fallback, the SDK middleware, or a manual retry.
</Tip>

## Implementation guide

Here's how to detect and handle streaming refusals in your application:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Detecting a refusal in the stream and resetting the conversation needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

## Current refusal types

The API currently handles refusals in three different ways:

| Refusal type                       | Response format              | When it occurs                                  |
| ---------------------------------- | ---------------------------- | ----------------------------------------------- |
| Streaming classifier refusals      | **`stop_reason`: `refusal`** | During streaming when content violates policies |
| API input and copyright validation | 400 error codes              | When input fails validation checks              |
| Model-generated refusals           | Standard text responses      | When the model itself refuses                   |

## Best practices

* **Monitor for refusals:** Include **`stop_reason`: `refusal`** checks in your error handling
* **Reset automatically:** Implement automatic context reset when refusals are detected
* **Fall back to another model:** Configure [server-side fallback or the SDK middleware](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli) so refused requests are retried on another Claude model instead of surfacing a refusal to the user. Claude Haiku 5.5 has no server-side fallback, so set up its retry in your client
* **Redeem fallback credit on manual retries:** If you build the retry yourself, pass the refusal's [fallback credit](https://platform.claude.com/docs/en/build-with-claude/fallback-credit?sdk_languages=cli) token so the retry doesn't pay the prompt-cache cost twice. Claude Haiku 5.5 refusals carry no fallback credit
* **Provide custom messaging:** Create user-friendly messages for better UX when refusals occur
* **Track refusal patterns:** Monitor refusal frequency to identify potential issues with your prompts

## Migration notes

If you built refusal handling when this feature first shipped, or you're adding it to an existing integration, check the following:

* **Refusals are responses, not errors.** A refusal arrives as a successful HTTP 200 response with `stop_reason`: `"refusal"`, so monitoring built only on error rates won't surface it. Track refusals as their own signal.
* **Refusals include structured detail.** On every model, a refusal also includes a `stop_details` object that identifies the policy category behind the decline. See [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#refusal-response) for the full response shape.
* **Retry on a different model.** Re-sending a refused request to the same model usually results in another refusal. Instead of only resetting context, retry on a fallback model with [server-side fallback, the SDK middleware, or a manual retry](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli), and redeem [fallback credit](https://platform.claude.com/docs/en/build-with-claude/fallback-credit?sdk_languages=cli) when you build the retry yourself. Claude Haiku 5.5 has no server-side fallback, and its refusals carry no fallback credit, so set up its retry in your client.
* **Check batch results for refusals.** A refused request in a [Message Batch](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli) is returned as a succeeded result with `stop_reason`: `"refusal"`, not as an errored result.
* **Centralize handling on `stop_reason`.** The API continues to consolidate refusal handling around `stop_reason`: `"refusal"`, so branch on the stop reason rather than on model-specific behavior.

## Next steps

<CardGroup cols={2}>
  <Card title="Refusals and fallback" icon="arrows-clockwise" href="https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli">
    Retry refused requests on another Claude model, server-side or in your client.
  </Card>

  <Card title="Stop reasons and fallback" icon="code" href="https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons?sdk_languages=cli">
    Every `stop_reason` value and how to handle it.
  </Card>

  <Card title="Streaming messages" icon="lightning" href="https://platform.claude.com/docs/en/build-with-claude/streaming?sdk_languages=cli">
    Stream responses and read `stop_reason` from `message_delta` events as they arrive.
  </Card>

  <Card title="Multilingual support" icon="text-aa" href="https://platform.claude.com/docs/en/build-with-claude/multilingual-support?sdk_languages=cli">
    Serve users across languages with Claude's cross-lingual capabilities.
  </Card>
</CardGroup>
