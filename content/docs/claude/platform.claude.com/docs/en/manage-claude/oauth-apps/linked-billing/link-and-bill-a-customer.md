---
title: Link and bill a customer
url: https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer
description: Send a customer to approve your OAuth app, save the connection, and bill Claude API requests to their Claude organization.
featureMetadata:
  status: beta
  betaHeader: user-profiles-billing-2026-10-01
  supportedModels:
    - claude-fable-5-2
    - claude-mythos-5-2
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
    - claude-opus-4-5-20251101
    - claude-sonnet-4-5-20250929
  supportedPlatforms:
    Claude API:
      availability: beta
      note: Only requests that send `billing_policy` need the beta header.
---

<Warning>
  Claude Platform OAuth is a Beta Service: prerelease software provided under your agreement with Anthropic, such as the [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms), and the [Service Specific Terms](https://www.anthropic.com/legal/service-specific-terms). Endpoints, parameters, and behavior can change during the beta. It might not be suitable for production use.
</Warning>

This page shows how to build Linked billing into your product. A customer approves your app once, which creates a connection between their Claude organization and one of your user profiles. After that, your back end bills the customer by sending requests as your own [operator service account](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#service-account), naming the customer’s [user profile](https://platform.claude.com/docs/en/manage-claude/user-profiles?sdk_languages=cli). You try the flow first on a test customer, a second organization of your own. For how the feature works and whether it fits your product, see [Linked billing](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing?sdk_languages=cli).

## Before you begin

You need these:

* **An app set up for Linked billing:** It needs client authentication, an operator service account, and a default workspace: see [Set up your app for Linked billing](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli).
* **A test customer:** A second Claude organization of yours, because the organization that owns your app can’t link to it. It must pay Anthropic directly, through invoiced billing or [credit that can pay for these requests](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing?sdk_languages=cli#which-credits-can-pay).
* **A test user:** A person with the Admin or Billing role in the test customer’s organization, who approves for it. Until your app is live, only people on its **Test users** list can link it. [Add this person’s Claude email address](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/test-and-publish?sdk_languages=cli#add-test-users) to that list.

### Sample setup

The samples read these values:

| Samples | What they need | Where it comes from |
| ----- | ----- | ----- |
| SDK and CLI | Your operator service account’s federation settings, in environment variables, including the federation JWT’s file in `ANTHROPIC_IDENTITY_TOKEN_FILE` | [Construct the SDK client](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli#construct-the-sdk-client) |
| cURL requests to the Claude API | Your service account’s access token, in `ANTHROPIC_AUTH_TOKEN` | [Authenticate from your workload](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli#authenticate-from-your-workload) |
| Requests to `auth.claude.com` | A client assertion: a JWT for your app’s **Expected audience**, in the file that `CLIENT_ASSERTION_FILE` names or in place of `YOUR_CLIENT_ASSERTION_JWT` | Your identity provider |
| All | Your app’s client ID and redirect URI, in place of the sample’s client ID and redirect URI | Your app’s page in the Claude Console |

Set `ANTHROPIC_AUTH_TOKEN` only where the cURL samples run. Where the SDK and CLI samples run, unset it and `ANTHROPIC_API_KEY`, because [each one takes priority over federation](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli#credential-precedence).

The client assertion and the federation JWT usually need different audiences, so keep them in separate files: see [when the two audiences differ](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-the-audiences-differ). The samples that use `CLIENT_ASSERTION_FILE` read it for each request, because the JWT in it rotates.

## Choose the user profile

A [user profile](https://platform.claude.com/docs/en/manage-claude/user-profiles?sdk_languages=cli) is a record in your own organization that stands for one of your customers. A request that bills the customer carries the profile’s ID, which tells Anthropic whom to bill. You can link a profile that you already have, unless it’s archived, and linking doesn’t change its ID or usage history.

Within one app, a customer’s Claude organization can link to only one of your profiles, and a profile can link to only one organization. Decide which profile stands for which organization before you link your first customer. The organization is the one that your customer selects when they approve, so ask them how their teams use Claude organizations:

* **Several teams share one Claude organization:** Use one profile for all of the teams.
* **Each team has its own Claude organization:** Use one profile for each organization.

If the customer selects an organization that’s already linked to another of your profiles, the approval is refused: see [`user_profile_already_linked` in Linked billing errors](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli#user-profile-already-linked).

Two cases change the profile that you create: [If you have a profile for each person](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-you-have-a-profile-for-each-person) and [If you resell API access](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-you-resell-api-access).

## Link the customer

<Frame>
  ![Sequence diagram: the customer approves at auth.claude.com, then your back end gets a connection and OAuth tokens](https://platform.claude.com/docs/images/linked-billing-link-flow.svg)
</Frame>

### Create the user profile

Create one user profile for each Claude organization that will link, as you mapped them in [Choose the user profile](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#choose-the-user-profile). Skip this step for a profile that you already have. Send a name and your own ID for the customer (`reference_id`). Create the profile once, and store its ID with the customer’s record: each create request makes a new profile, even with the same `reference_id`.

<CodeGroup>
  ```bash CLI
  ant user-profiles create \
    --name "Example Customer Inc." \
    --external-user-details.reference-id cust_2abc3def
  ```
</CodeGroup>

The response holds the profile’s `id`, such as `uprof_01HV9Z`.

### Send the customer to approve

Add a [Link your Claude organization button](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-button?sdk_languages=cli) to your product, where your customers manage billing or integrations. Its HTML, colors, and logo are ready to copy.

The approval page offers only the organizations of the signed-in Claude account, and the organization that the customer selects pays. For what to show beside the button, see [What to tell your customers](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#what-to-tell-your-customers).

When the customer clicks the button, do these three things in your back end:

1. **Create a `state` value and a PKCE code verifier,** a random secret that proves your back end started this approval. Store both on your back end, tied to the browser session and the customer’s record.
2. **Send a pushed authorization request** to `auth.claude.com`, which passes the approval’s details from your back end instead of through the browser.
3. **Redirect the browser** to `https://auth.claude.com/oauth/authorize` with your `client_id` and the `request_uri` from the response. A `request_uri` works once and expires after 10 minutes, so send a new pushed authorization request for each click.

No SDK covers `auth.claude.com`, so the samples for these steps call it over HTTP:

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI has no command for `auth.claude.com`. Send the request with cURL or in your application’s language.
  </CodeGroupItem>
</CodeGroup>

The pushed authorization request carries your client ID and a client assertion, the customer’s user profile ID, and the scope. It also carries your registered redirect URI, the `state`, and a code challenge made from the verifier. `connection_type` and `connection_auth_target` mark it as a Linked billing request. For each field and its value, see [OAuth endpoints and parameters](https://platform.claude.com/docs/en/manage-claude/oauth-apps/endpoints-and-parameters?sdk_languages=cli#authorization-requests).

The scope is `billing:attribution`. To also get a refresh token, ask for `billing:attribution offline_access`, which needs **Offline access** turned on for your app. Whether you need one depends on [how your back end bills](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/set-up-your-app?sdk_languages=cli#choose-whether-to-get-refresh-tokens). Adding `offline_access` for a customer who is already linked makes a new connection that replaces the earlier one: see [If a customer approves again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-a-customer-approves-again).

On the approval page, the customer signs in to Claude if needed, selects the organization to link, and approves. Until your app is live, the person who approves must also set a spend cap for your app: see [Caps while testing](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/test-and-publish?sdk_languages=cli#caps-while-testing).

### Save the connection and its OAuth tokens

After the customer approves, `auth.claude.com` sends the browser to your redirect URI. Then, do these things in your back end:

1. **Check the callback.** Check that its `state` matches the one you stored, which shows that the same browser came back. Check that its `iss` is `https://identity.anthropic.com/users`, which shows that the callback came from Claude. If either is missing or doesn’t match, stop.
2. **Check for an error.** If the callback carries an `error` parameter instead of a code, no connection was made. For the causes, see [Linked billing errors](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli#while-linking).
3. **Exchange the code at once.** Send it with the PKCE code verifier, the redirect URI from your pushed authorization request, and a client assertion. The code expires after 5 minutes.
4. **Store what the response returns.** The exchange returns the OAuth tokens only once.

These samples send the code exchange to `auth.claude.com` over HTTP:

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI has no command for `auth.claude.com`. Send the request with cURL or in your application’s language.
  </CodeGroupItem>
</CodeGroup>

The response holds these values:

| Value | What it is | What to do with it |
| ----- | ----- | ----- |
| `connection_id` | The connection’s ID | Store it with the customer’s record, to end the connection from your back end later |
| `access_token` | The customer’s own token, separate from your service account’s: it can bill only this customer, for up to 1 hour | Store it as a secret |
| `refresh_token` | A token that gets new access tokens, if you asked for `offline_access` | Store it as a secret |

The response doesn’t say which organization the customer linked.

The requests on this page bill as your service account, so they don’t need the OAuth tokens. Store them anyway: you need them to [use a separate credential for each customer](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/credential-for-each-customer?sdk_languages=cli). If you asked for a refresh token, you can’t get it again unless you unlink the customer and they link again.

If the exchange fails, what you do depends on how:

* **The exchange returns `unauthorized_client`:** Usually, your app has no operator service account or default workspace, or the workspace is archived. See [how to fix `unauthorized_client`](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli#code-exchange-unauthorized-client).
* **The exchange returns `invalid_grant`:** The redirect URI or the verifier was wrong, or the code expired or was already used. A wrong redirect URI or verifier uses up the code, so the customer has to approve again. For a customer who is already linked, see [If a customer approves again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-a-customer-approves-again).
* **The exchange timed out:** [Send the same code once more](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/link-and-bill-a-customer?sdk_languages=cli#if-the-code-exchange-times-out).

## Bill a request

Send every request for this customer as your operator service account, and put the customer’s user profile ID in the `anthropic-user-profile-id` header. The SDK sends that header for you from its user profile parameter. The header makes the request count in that profile’s usage, whoever pays. Then, choose on each request whether the customer or you pays.

### Your customer pays

To bill a request to the customer, name the profile that holds their connection in that header, and also send:

* [`billing_policy`](https://platform.claude.com/docs/en/api/beta/messages/create?sdk_languages=cli) in the request body, set to `{"type": "billing_policy", "bill_to": "user_profile"}`
* the `user-profiles-billing-2026-10-01` beta header

<Warning>
  If a request names another linked customer’s profile, Anthropic bills that customer’s organization, and no error tells you.
</Warning>

Check each request’s profile ID. Your test customer pays real money for these requests, as any customer would.

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --beta user-profiles-billing-2026-10-01 \
    --user-profile-id uprof_01HV9Z \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}' \
    --billing-policy '{type: billing_policy, bill_to: user_profile}'
  ```
</CodeGroup>

The Claude API either bills the customer or refuses the request. It never bills you instead. On `/v1/messages`, a refused request carries its code in `error.details.error_code`. It can have these causes:

* **A new connection:** A new connection can take about 10 seconds to work after the code exchange. If your first request is refused with `user_profile_billing_not_authorized` within those 10 seconds, send it again after they pass. If it’s still refused, see [how to fix `user_profile_billing_not_authorized`](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli#user-profile-billing-not-authorized).
* **A customer who can’t be billed:** `user_profile_not_billable` can mean that the customer’s organization can’t be billed, for example because it has no billing set up. See [how to fix `user_profile_not_billable`](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli#user-profile-not-billable).
* **A spend limit or no credit:** Requests are refused with `linked_organization_spend_limit_reached` when the customer’s spend through your app reaches their cap or their organization reaches its own monthly spend limit. The same happens when no credit on their account can pay.
* **Anything else:** See [Linked billing errors while billing](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/errors?sdk_languages=cli#while-billing).

### You pay

To pay for a request yourself, keep sending the customer’s user profile ID in the header. Then, either leave `billing_policy` out or set its `bill_to` to `"self"`.

Without `billing_policy`, the beta header is optional:

<CodeGroup>
  ```bash CLI
  ant messages create \
    --user-profile-id uprof_01HV9Z \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}'
  ```
</CodeGroup>

With `bill_to` set to `"self"`, the request needs the beta header:

<CodeGroup>
  ```bash CLI
  ant beta:messages create \
    --beta user-profiles-billing-2026-10-01 \
    --user-profile-id uprof_01HV9Z \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}' \
    --billing-policy '{type: billing_policy, bill_to: self}'
  ```
</CodeGroup>

## Check the result

First, check in the Claude Console that the customer is linked:

* Your User profiles page displays the customer’s profile as **Linked**. Only members with the Admin role see this status.
* Your app’s **Overview** tab lists the customer under **Linked customers**, with the connection ID that you stored.

Then, check the bill in the Console, because a billed request that succeeds returns a normal response that doesn’t say who paid. The test customer’s [Linked platforms](https://platform.claude.com/linked-platforms) page is open to members of that organization with the Admin or Billing role.

| Where | What it displays | How soon |
| ----- | ----- | ----- |
| The test customer’s [Linked platforms](https://platform.claude.com/linked-platforms) page | Your app’s spend this month, against the cap | Within about a minute |
| The test customer’s Linked platforms page | Your app’s cost and usage this month | Every few hours |
| Your [User profiles](https://platform.claude.com/user-profiles) page | **Requests** and **Tokens** count the request. **Your spend** doesn’t. | About once an hour, though a request can take a few hours to appear |

When the test works, [publish your app](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/test-and-publish?sdk_languages=cli#publish-the-app) so that your customers can link it.

## What to tell your customers

Before real customers link, tell them these things in your product:

* **Who can approve:** A person with the Admin or Billing role in their Claude organization.
* **Which account in your product they’re linking:** Show it beside the button.
* **Which Claude account they’re using:** Ask them to check the account that the approval page displays.
* **That they’re linked:** After the code exchange, say that the customer is linked, not that billing is active. A customer’s organization can link before Anthropic can bill it, for example before it has billing set up.
* **What you bill them for:** Only the Claude usage that they and their users cause in your product. For the full rule, see [What you may bill](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing?sdk_languages=cli#what-you-may-bill).

## Rules and special cases

These sections give the rules behind the earlier steps and what to do in particular cases.

### If your federation rule and client authentication expect different audiences

Your back end sends a JWT from your identity provider in two places:

* **To federation, for the Claude API:** The JWT must have your federation rule’s audience. A rule that leaves its audience blank expects `https://api.anthropic.com`.
* **To `auth.claude.com`, as the client assertion:** The JWT must have exactly one audience, your app’s **Expected audience**, from its **Client authentication** tab.

With a rule that leaves its audience blank, the two usually differ, so get a JWT for each audience from your identity provider. The SDK and CLI read the federation JWT from the file that `ANTHROPIC_IDENTITY_TOKEN_FILE` names. The client assertion goes in the file that `CLIENT_ASSERTION_FILE` names.

### If the code exchange times out

A code works once, but a retry after a timeout is safe. If the first try never reached `auth.claude.com`, a retry within the code’s 5 minutes succeeds. If it got through, the retry returns `invalid_grant` and changes nothing. In that case, [check whether the customer is linked](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#check-a-links-status):

* **Not linked:** Start again from the pushed authorization request.
* **Linked:** You don’t have the connection ID or OAuth tokens that the lost response held. If you asked for `billing:attribution` alone, send the customer to approve again with the same scope. That returns the same connection ID and a new access token. If you also asked for `offline_access`, follow [Link a customer again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again).

### If you have a profile for each person

You might already have a user profile for each person who uses your product, and several of them might work for one customer. Only one profile can link each organization, so Anthropic recommends that you create one more profile for the customer’s organization and link that one. Then, the profile ID that you send depends on who pays:

* **Requests that the customer pays for:** Send the ID of the customer’s profile. To also tell Anthropic which person a request comes from, send an opaque ID for the person in `metadata.user_id`, never a name, email address, or phone number. See [Identify one person within a company](https://platform.claude.com/docs/en/manage-claude/user-profiles?sdk_languages=cli#identify-individual-users-within-a-company).
* **Requests that you pay for:** You can keep sending the person’s own profile ID.

### If you resell API access

If your organization resells API access, also send `"access_type": "passthrough"` when you create the customer’s profile. The samples leave `access_type` out, which creates an `application` profile. For the two types, see [Decide who gets a profile](https://platform.claude.com/docs/en/manage-claude/user-profiles?sdk_languages=cli#decide-who-gets-a-profile).

### If a customer approves again

A customer approves again when you send them to approve for a profile that already has a connection. What the code exchange does depends on the connection’s scopes and the scopes of the new approval:

| The customer approves | What the code exchange does | What you do |
| ----- | ----- | ----- |
| `billing:attribution` again | Returns the same connection ID and a new access token | Store the new access token |
| `billing:attribution offline_access` again | Returns `invalid_grant`, and the connection stays as it was | To get new OAuth tokens, [unlink the customer and have them link again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again) |
| Other scopes, such as `offline_access` added to `billing:attribution` | Ends the earlier connection and its OAuth tokens and makes a new one with a new ID | Store the new connection ID and OAuth tokens |

If the exchange for a change of scopes fails with a 5xx response, the earlier connection might have ended already. Requests that you bill to the customer are refused until a new exchange succeeds. To recover:

1. Send the customer to approve again with the new scopes.
2. If that exchange returns `invalid_grant`, [unlink the customer and have them link again](https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/manage-customers?sdk_languages=cli#link-a-customer-again).

### For agents

* If the pushed authorization request fails, don’t redirect the browser.
* When you send a request with `bill_to: "user_profile"`, record it in your own logs: no response says who paid.

## Next steps

<CardGroup cols={1}>
  <Card title="What your customers see" icon="browser" href="https://platform.claude.com/docs/en/manage-claude/oauth-apps/linked-billing/what-your-customers-see?sdk_languages=cli">
    The approval page, spend caps, and emails that your customers see, so that you can support them
  </Card>
</CardGroup>
