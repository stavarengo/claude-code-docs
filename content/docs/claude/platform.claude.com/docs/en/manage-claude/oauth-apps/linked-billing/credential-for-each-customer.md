---
title: Use a separate credential for each customer
url: https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer
description: Call Claude with each customer's own OAuth access token, so that code you don't fully control can bill only that customer.
---

<Warning>
  Claude Platform OAuth is a Beta Service: prerelease software provided under your agreement with Anthropic, such as the [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms), and the [Service Specific Terms](https://www.anthropic.com/legal/service-specific-terms). Endpoints, parameters, and behavior can change during the beta. It might not be suitable for production use.
</Warning>

Each customer you link with [Linked billing](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing?sdk_languages=cli) comes with their own credential: an OAuth access token that can bill only that customer. Use it when code that you don’t fully control calls Claude for one customer, for example in an agent’s sandbox or a single-tenant deployment. A bug or a leak in that code can then bill only that customer.

If every request that bills a customer comes from your own back end, you don’t need these credentials. [Bill customers as your operator service account](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#bill-a-request), and skip this page.

## Before you begin

* **The customer’s OAuth tokens and connection ID:** The code exchange returned them when you [linked the customer](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#save-the-connection-and-its-tokens). A connection is the record that ties the customer’s Claude organization to one of your [user profiles](https://platform.claude.com/docs/en/manage-claude/user-profiles?sdk_languages=cli).
* **A refresh token:** [**Offline access**](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#choose-whether-to-get-refresh-tokens) is on for your app, and the customer approved `billing:attribution offline_access`. A customer who approved without `offline_access` gets a refresh token by [approving again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-a-customer-approves-again), which replaces their connection without an unlink.
* **For the refresh samples:** A client assertion: a JWT from your identity provider for your app’s **Expected audience**, set up as your app’s [client authentication](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#set-up-client-authentication). The samples read it from the file that the `CLIENT_ASSERTION_FILE` environment variable names or from the `CLIENT_ASSERTION` shell variable.

## Keep the OAuth tokens secret

Store each customer’s access token, refresh token, and their expiry times in a secret store that only the refreshing service can read. Anyone who holds an access token can bill that customer until the token expires. If a token leaks, [unlink the customer](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#unlink-a-customer) first, then link them again. If you lose a refresh token, [link the customer again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again).

## Call Claude with a customer’s access token

Send the customer’s access token in place of your operator service account’s credential:

* **In the Anthropic SDK:** Pass the customer’s access token as the client’s authentication token when you build the client.
* **In the `ant` CLI:** Set `ANTHROPIC_AUTH_TOKEN` to the token for the command.
* **In an HTTP request:** Send it as a bearer token in the `Authorization` header. Don’t send an `x-api-key` header.

<Warning>
  Unset `ANTHROPIC_API_KEY` wherever you use a customer’s access token: some clients send the key instead, and Anthropic can bill you.
</Warning>

Those clients are the `ant` CLI and an SDK client that reads the token from `ANTHROPIC_AUTH_TOKEN`. For the reason and a guard against it, see [If an API key can reach the process](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli#if-an-api-key-can-reach-the-process). If your lookup finds no token for the customer, stop before you build the client. Given a null token, the SDK might fall back to your own credential and bill you.

<CodeGroup>
  ```bash CLI
  ANTHROPIC_AUTH_TOKEN="$CUSTOMER_ACCESS_TOKEN" ant messages create \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}'
  ```
</CodeGroup>

A customer’s access token works on these endpoints only:

* `/v1/messages` and `/v1/chat/completions`
* `/v1/messages/count_tokens`
* the Models endpoints

On `/v1/messages` and `/v1/chat/completions`, the access token alone bills the customer. You don’t need the `anthropic-user-profile-id` header or [`billing_policy`](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#bill-a-request).

Send every other request and every request that you pay for as your operator service account. That includes requests that use billable code execution, which [can’t bill a customer](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing?sdk_languages=cli#if-you-use-code-execution).

Requests with the token run in the workspace that you set as your app’s default. Archiving it revokes every token in it: see [If you move to another workspace](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#if-you-move-to-another-workspace). If a request with the token is refused, see [Linked billing errors](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli).

## Refresh the OAuth tokens

A customer’s access token lasts at most 1 hour. Before it expires, send the customer’s refresh token to the token endpoint for a new pair of tokens. Each refresh token works once, apart from a single repeat within 30 seconds to recover an answer that you lost.

<Warning>
  A refresh token sent again more than 30 seconds after its first use ends the customer’s connection, and you have to link them again.
</Warning>

To make sure that you never send a used token late:

* Turn off automatic retries for the refresh request in your HTTP client and in any proxy.
* Refresh each customer’s OAuth tokens from one service, one refresh at a time for each customer. If the service has replicas, give them a shared lock. Hold it from reading a customer’s stored tokens until the new ones are stored.
* Store the new refresh token before you use the new access token.

The request is a `refresh_token` grant to `auth.claude.com`. It carries the refresh token and your app’s [client authentication](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#set-up-client-authentication): `client_id` and a client assertion. No SDK covers `auth.claude.com`, so the samples call it over HTTP. They show the plain call with no failure handling:

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI has no command for `auth.claude.com`. Send the refresh with cURL or in your application’s language.
  </CodeGroupItem>
</CodeGroup>

The response holds a new access token and a new refresh token. `expires_in` and `refresh_token_expires_in` give their lifetimes in seconds. The new refresh token replaces the one you sent, and the earlier access token stops working within a few minutes.

Before you send a token again after a failed refresh, read [what to do if a refresh fails](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli#if-a-refresh-fails). Some retries end the connection, and some failures mean that you pause every customer’s refreshes. The [full refresh sample](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli#full-refresh-sample) handles those failures.

A refresh token lasts at most 1 year from the code exchange, and a refresh doesn’t extend that. Before it expires, [link the customer again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again).

## Run an agent in a sandbox

Before you use this section, read section 4.1(b) of the [Linked Billing Beta Terms](https://www.anthropic.com/legal/linked-billing-terms). If you have a question about it, ask your Anthropic account team.

When an agent works for one customer in a sandbox, follow these rules:

* Give the sandbox only the access token, never the refresh token. Your back end refreshes the tokens and sends each new access token to the sandbox.
* Decide which customer a sandbox serves from the sandbox’s own identity, such as its pod identity. Never decide from a value that the sandbox sends.
* Send a sandbox only the token of the customer it serves.
* Give the sandbox no mounted identity token and no access to a cloud metadata server.

That last rule keeps the sandbox from getting a JWT that matches your app’s client authentication or one of your [federation rules](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli). With such a JWT, code in the sandbox could authenticate as your app or as one of your service accounts.

The Anthropic SDK, Claude Code, and the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) can read the access token from a credentials file in a configuration profile. For the file’s format, see [Profile configuration file](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli#profile-configuration-file). To set up the sandbox:

<Steps>
  <Step title="Add a profile">
    In the sandbox, create a configuration directory. Inside it, add a profile at `configs/customer.json` whose authentication type is `user_oauth`. Don’t give the profile a `client_id`: with one, the SDK expects a refresh token in the file and refreshes the token itself.

    <File filename="configs/customer.json">
      ```json
      {
        "version": "1.0",
        "authentication": {
          "type": "user_oauth"
        }
      }
      ```
    </File>
  </Step>

  <Step title="Write the access token">
    Before the agent starts, write the access token to `credentials/customer.json` in the same configuration directory, so that `configs` and `credentials` sit side by side. Write it again right after each refresh. `expires_at` is the token’s expiry time in Unix seconds. For code that writes it safely, see [When you write each new access token to a sandbox](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli#when-you-write-each-new-token-to-a-sandbox).

    ```json credentials/customer.json
    {
      "type": "oauth_token",
      "access_token": "sk-ant-oat01-...",
      "expires_at": 1793635200
    }
    ```
  </Step>

  <Step title="Point the client at the profile">
    Set `ANTHROPIC_CONFIG_DIR` to the configuration directory and `ANTHROPIC_PROFILE` to `customer`.
  </Step>

  <Step title="Remove every other credential">
    Unset every other credential in the sandbox, because each can take precedence over the profile. These include:

    * the `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` environment variables
    * Claude Code’s `CLAUDE_CODE_OAUTH_TOKEN` environment variable and `apiKeyHelper` setting
  </Step>
</Steps>

The SDK picks up each new token without a restart: see [When you write each new access token to a sandbox](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli#when-you-write-each-new-token-to-a-sandbox).

## Check the result

To confirm that a request billed the customer, see [where a billed request appears](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#check-the-result). To confirm that a token is limited to its customer:

* A request with the token that names another of your user profiles gets `400 invalid_request_error`.
* A few minutes after a refresh, a request with the earlier access token gets `401 authentication_error`.

## Decide whether to turn off operator-only authentication

By default, your operator service account can bill any linked customer without the customer’s access token. It names the customer’s user profile and sets `bill_to: "user_profile"` in [`billing_policy`](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#bill-a-request). This default is called operator-only authentication, and it keeps working after a customer’s access token expires.

Once every customer’s requests use their own access token, you can turn off operator-only authentication. Then, only a customer’s own access token can bill them, so a bug that names the wrong user profile can’t bill the wrong customer.

Every customer’s requests then depend on refreshes. If you lose a customer’s refresh token, you can’t bill them until they [link again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again). Anything that stops refreshes, such as turning off **Offline access** or clearing the [default workspace](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#default-workspace), makes every customer’s requests fail as their access tokens expire.

The Claude Console checks only that your app has `billing:attribution`, `offline_access`, and a default workspace. Before you turn off operator-only authentication, check these yourself:

* Your store holds a refresh token for every linked customer.
* Your requests with their access tokens work.

To turn off operator-only authentication:

1. Open the app’s **Client authentication** tab in the Console.
2. Under the operator service account, turn on **Disable operator-only tokenless authentication** and confirm in the dialog box. Its name in the API is `disable_operator_only_auth`.

These rules then apply:

* A request from the service account alone that sets `bill_to: "user_profile"` for a linked customer gets `403 user_profile_not_billable`. The customer still shows as **Linked**, so watch your logs for this error.
* The service account can still manage user profiles and send the requests that you pay for.
* To go back to the default, turn the same setting off.

## Implementation details, rules, and special cases

The rest of this page is the detail behind the steps. It covers failed refreshes, a full refresh sample, and how an API key or a refresh affects a running client. A customer who approved only the deprecated scope has no access token of their own: see [If you still use the deprecated scope](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#if-you-still-use-the-deprecated-scope).

### If a refresh fails

A refresh replaces the refresh token that you sent. What happens when the replaced token arrives again depends on when it arrives:

* **Within 30 seconds, the first time:** It returns a new pair of tokens and revokes the pair that you never received. This lets you repeat a refresh whose answer you lost.
* **Within 30 seconds, the first time, if the token that you sent was under 30 seconds old when it was replaced:** It gets `invalid_grant`, and the connection stays.
* **Within 30 seconds, any later time:** It gets `invalid_grant`, and the connection stays.
* **After 30 seconds:** It gets `invalid_grant` and ends the connection. Every token is revoked, the customer shows as **Unlinked**, and nothing can bill them until they link again.

After a failed refresh, what to do depends on whether the refresh token reached `auth.claude.com` and was used:

| What the refresh got | What it means | What to do |
| ----- | ----- | ----- |
| The request couldn’t reach `auth.claude.com`, including a connect timeout | The token wasn’t sent | Send it again later |
| `429` | Nothing was revoked | Wait, then send it again |
| A `503` refusal: a `retry-after` header and `"type": "error"` at the top level of the body | Nothing was revoked | Wait, then send it again |
| Any other `4xx`, except `invalid_grant` | Nothing was revoked | Fix the cause, then send it again |
| Any other `5xx` or a network drop after the request went out | It might have worked | Send it once more, right away |
| No answer in time (a read timeout) | It might still be running | Don’t send it again |
| `invalid_grant` | The token can’t be used now | Stop sending it |

**Wait, then send it again:** Wait at least as long as `retry-after` says. If a `429` has no `retry-after` header, back off before you send it again. A `503` that lacks either mark counts as any other `5xx`.

**Fix the cause, then send it again:**

* `unauthorized_client`: `error_description` usually names the cause, such as a missing default workspace or `offline_access` no longer on your app.
* `invalid_client`: your client assertion failed. Check it against [Client assertion claims](https://platform.claude.com/docs/en/manage-claude/oauth-apps/endpoints-and-parameters?sdk_languages=cli#client-assertion-claims).
* `invalid_scope`: the request sent a `scope` parameter, or `billing:attribution` is no longer on your app.
* Any other `4xx`, such as `invalid_request`: correct the request.

If you changed or archived the operator service account, every refresh of a working token gets `unauthorized_client`, and sending again can’t help. See [If you change the service account](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#if-you-change-the-service-account).

**Send it once more, right away:** `auth.claude.com` must receive the second request within 30 seconds of replacing the token. You can’t see when that was, so count from when you sent the first request, and leave time for the second to arrive. Then:

* If the second request returns new tokens, store them and use only them.
* If it returns anything else, gets no answer, or can’t go out in time, don’t send the token again.

**Don’t send it again:** After a read timeout or a lost answer that you can’t recover, stop refreshing that customer and [link them again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again).

**Stop sending it:** Stop refreshing that customer. `invalid_grant` usually means one of these, and the response doesn’t say which, so check the first two before you link anyone again:

* The customer’s organization is suspended. Don’t unlink the customer, and keep the refresh token: it works again after the suspension ends. To find out, ask [Anthropic support](https://support.claude.com/en/articles/9015913-how-to-get-support) or your Anthropic account team if you have one.
* Every customer’s refresh got `invalid_grant` at the same time. Look for a cause on your side, such as an [archived workspace](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#if-you-move-to-another-workspace).
* The token expired or was already used, the connection ended, or its workspace was archived. [Link the customer again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again).

A lost network connection, a `5xx` response, or a timeout can mean that `auth.claude.com` has a fault. If one made you stop refreshing a customer, keep the fault from costing you more connections:

1. Pause the refreshes of your other customers.
2. Refresh one customer.
3. Resume the rest only after that refresh succeeds or gets a `4xx` response.

### Full refresh sample

This version of the refresh follows [If a refresh fails](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli#if-a-refresh-fails). It adds these safeguards to the plain call:

* It refreshes when the access token has less than 10 minutes left.
* It holds a lock for each customer from reading the stored tokens until the new ones are stored.
* Before the refresh token leaves the process, it marks the stored tokens `on_hold`, so that a crash can’t lead to a second send.
* It waits up to 2 seconds to reach `auth.claude.com` and 10 seconds for an answer.
* It sends a second request only within 4 seconds of the first. That leaves time for the second to arrive within the 30 seconds. It also keeps the second inside the 10-second wait, so that a request that timed out is never sent again.
* If only the write to your secret store fails, it tries the write again and doesn’t refresh again.

The sample leaves three things to you:

* a lock that all your replicas share, because its own lock doesn’t reach your other replicas
* waiting and sending again after a `429` or a `503` refusal, which it reports as an error
* pausing the refreshes of your other customers after a lost refresh, on every replica

Call the refresh function for each customer more often than every 10 minutes, so that it always runs inside that margin.

`refresh_connection()` fails with `RefreshOnHoldError` when a refresh token must not be sent again. It also fails on every later call for that customer. The stored record keeps `on_hold` and `hold_reason`, so that you can tell later why the hold was set. When only the write failed, the error’s `new_tokens` holds the tokens to store.

The following setup defines the shared names. You write `load_tokens()` and `save_tokens()` for your own secret store.

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This setup goes with the refresh function that follows, which needs more logic than a single shell command. Write both in your application’s language.
  </CodeGroupItem>
</CodeGroup>

The following refresh function uses that setup:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This refresh needs more logic than a single shell command. Write it in your application’s language.
  </CodeGroupItem>
</CodeGroup>

### If an API key can reach the process

This section is only for a process where `ANTHROPIC_API_KEY` might be set beside a customer’s access token. These clients send the key in place of the token:

* the `ant` CLI
* an SDK client that reads the token from `ANTHROPIC_AUTH_TOKEN`

An SDK client given the token when you build it sends only the token. Other clients can send both. The key still wins, except on the Models endpoints, where the request can be refused. When the key goes out, the Claude API authenticates the request with it, so the request isn’t limited to that customer.

As a guard in such a process, send each request with the `anthropic-user-profile-id` header, `billing_policy` with `bill_to: "user_profile"`, and the `user-profiles-billing-2026-10-01` beta header. Then, a request that goes out with the key has one of these outcomes:

* **With the header and `bill_to: "user_profile"`:** It fails, or it bills the customer the header names.
* **With the header alone, or with neither:** Anthropic bills it to you.

### When you write each new access token to a sandbox

Your back end sends each new token to code in the sandbox, over a channel that you build. That code runs as the agent’s user and writes the token into a `credentials` directory with mode `0700`. It writes a new file with mode `0600` and renames it over the old one, so that the agent never reads half a file. This function does that:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    Write the file with your application’s code, running in the sandbox as the agent’s user.
  </CodeGroupItem>
</CodeGroup>

Within a few minutes of a refresh, a request with the earlier token gets a `401`. The client can then read the file again and send the request with the new token. With the TypeScript or C# SDK on its own, that one request fails instead. Send it once more: the next request uses the new token. The SDK also reads the file again in the last 2 minutes before `expires_at`, or in the last 30 seconds in Java.

### For agents

* When you refresh, don’t send a `scope` parameter.
* For every refresh, read the client assertion again from its file.
* When you store new tokens, count their expiry times from when you sent the refresh, using `expires_in` and `refresh_token_expires_in`.
* When a suspension ends, clear `on_hold` only if its `hold_reason` is `invalid_grant`.
* When you write a sandbox’s credentials file, write a token that has more than 30 seconds left before its `expires_at`.

## Next steps

<CardGroup cols={2}>
  <Card title="Test and publish your app" icon="rocket" href="https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/test-and-publish?sdk_languages=cli">
    Add test users, publish your app, and change or delete it
  </Card>

  <Card title="What your customers see" icon="browser" href="https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/what-your-customers-see?sdk_languages=cli">
    The approval page, spend caps, and emails that your customers see, so that you can support them
  </Card>
</CardGroup>
