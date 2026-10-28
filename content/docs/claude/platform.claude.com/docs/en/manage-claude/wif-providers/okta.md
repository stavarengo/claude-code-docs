---
title: Use WIF with Okta
url: https://platform.claude.com/docs/en/manage-claude/wif-providers/okta
description: Federate Okta service application identities to the Claude API with Workload Identity Federation.
---

Okta can act as a workload identity provider by issuing OIDC access tokens to a **service application** through the OAuth 2.0 `client_credentials` grant. Your workload authenticates to Okta (typically with `private_key_jwt`, so no shared secret is stored), receives a signed JSON Web Token (JWT), and exchanges that JWT with Anthropic for a short-lived access token.

The Okta authorization server’s issuer URL takes the form `https://<your-domain>.okta.com/oauth2/<auth-server-id>`. If you use the built-in default server, the path is `/oauth2/default`.

<Note>
  You must use an Okta **custom authorization server** (including the `default` one). Tokens issued directly by the Okta org authorization server (the `/oauth2/v1/token` endpoint with no authorization server ID in the path) cannot be validated by external parties because Okta does not publish signing keys for them.
</Note>

There are many ways to configure and authenticate to Okta that are outside the scope of this documentation. Ensure that your configuration and authentication mechanisms follow your company’s guidance and security practices.

## Prerequisites

* Familiarity with [WIF concepts](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli#concepts): service accounts, federation issuers, and federation rules.
* An Okta organization with API Access Management enabled (required for custom authorization servers).
* Permission to create service accounts, federation issuers, and federation rules in the Claude Console for your Anthropic organization.
* A workload that can request a token from Okta’s `/v1/token` endpoint and reach `api.anthropic.com`.

## Configure Okta

At a high level you need to:

1. Create an Okta service application.
2. Configure your default authorization server (or create a new custom authorization server) with an audience, a scope, an access policy, and any custom claims you want to match on.

The exact navigation depends on your Okta org configuration and admin console version. The following numbered steps walk through one common path:

1. **Create a service app integration.** In the Okta Admin Console, create a new app integration of type **API Services** (OIDC, machine-to-machine). Note the generated **Client ID**.
2. **Configure client authentication.** For a keyless setup, select **Public key / Private key** (`private_key_jwt`) and register your workload’s public JWK. Alternatively, use a client secret if your environment can store one securely. For the following example you might need to disable the DPoP requirement on the application; ensure that your production setup adheres to your organization’s security requirements.
3. **Set the audience.** On your custom authorization server, set the audience to `https://api.anthropic.com` so issued access tokens carry that `aud` claim. Anthropic validates `aud` against this fixed value.
4. **Grant a scope.** On your custom authorization server, ensure at least one scope exists that the service app is allowed to request (for example, `anthropic.access`). Okta rejects `client_credentials` requests that do not include a granted scope.
5. **Create an access policy.** On your custom authorization server, create an access policy with at least one rule that allows your service app to request the scope you granted in step 4.
6. **(Optional) Add custom claims.** If you want to match on something other than the client ID, add a claim to the access token in your authorization server’s **Claims** tab.

For a service app using `client_credentials`, Okta sets the `sub` claim of the issued access token to the application’s **Client ID**, and `iss` to the authorization server’s issuer URL.

## Configure Anthropic

In the Claude Console, go to the [Workload identity](https://platform.claude.com/settings/workload-identity-federation) page (`platform.claude.com/settings/workload-identity-federation`), click **Connect workload**, and select **Custom OIDC**. The wizard walks you through registering the issuer, creating a service account, and creating a federation rule.

The wizard creates these resources for you. Use the following values whether you enter them in the wizard or send them to the [Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli):

**Federation issuer:** Use your Okta custom authorization server URL and discovery mode. Anthropic reads Okta’s `.well-known/openid-configuration` discovery document and fetches the JWKS from the `jwks_uri` it advertises.

```json
{
  "name": "okta-prod",
  "issuer_url": "https://acme.okta.com/oauth2/aus1a2b3c4d5e6f7g8h9",
  "jwks": { "type": "discovery" }
}
```

**Federation rule:** Match on the Okta `sub` claim, which is the service app’s Client ID. If you defined custom claims in Okta, you can match on those instead with the `claims` map or a CEL `condition`.

```json
{
  "name": "okta-pipeline",
  "issuer_id": "fdis_...",
  "match": {
    "subject_prefix": "0oa1b2c3d4e5f6g7h8i9",
    "audience": "https://api.anthropic.com"
  },
  "target": { "type": "service_account", "service_account_id": "svac_..." },
  "workspace_id": "wrkspc_...",
  "oauth_scope": "workspace:developer",
  "token_lifetime_seconds": 600
}
```

## Acquire a token and call the Claude API

Unlike platform-native providers (AWS, Google Cloud, Kubernetes), which make a token available inside the workload’s runtime (through a projected file or local metadata endpoint), Okta does not. Your workload must call Okta’s token endpoint to obtain a JWT, then pass that JWT to the Anthropic SDK as the identity token.

<CodeGroup>
  ```bash CLI
  # 1. Request an access token from Okta and write it to a temp file.
  export ANTHROPIC_IDENTITY_TOKEN_FILE=$(mktemp)
  curl -sS "$OKTA_ISSUER/v1/token" \
    -d grant_type=client_credentials \
    -d scope=anthropic.access \
    -d client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer \
    --data-urlencode client_assertion="$SIGNED_CLIENT_ASSERTION" \
    | jq -r .access_token > "$ANTHROPIC_IDENTITY_TOKEN_FILE"

  # 2. Call the Claude API. The CLI reads ANTHROPIC_FEDERATION_RULE_ID,
  # ANTHROPIC_ORGANIZATION_ID, ANTHROPIC_SERVICE_ACCOUNT_ID, ANTHROPIC_WORKSPACE_ID, and
  # ANTHROPIC_IDENTITY_TOKEN_FILE and performs the exchange.
  ant messages create \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}'
  ```
</CodeGroup>

Except in Java (see the comment in that example), the SDK example passes your Okta token fetch to `identity_token_provider` as a token provider. The Claude SDK calls it each time the Anthropic access token approaches expiry, so your Okta fetcher should return a fresh token on each call rather than caching one indefinitely. The `ant` CLI re-reads `ANTHROPIC_IDENTITY_TOKEN_FILE` on each exchange, so refresh that file on a timer for long-running shells.

## Verify the setup

A successful exchange returns an `access_token` starting with `sk-ant-oat01-` and an `expires_in` value in seconds. If the exchange fails with the opaque `401` `authentication_error` response (message `Authentication failed`), check the [authentication history page](https://platform.claude.com/settings/workload-identity-federation?tab=history) in the Claude Console for the deny reason and see [Troubleshoot a failed exchange](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli#troubleshoot-a-failed-exchange). The most common Okta-side cause is an `issuer_url` mismatch. The `issuer_url` must include the `/oauth2/<auth-server-id>` path, and the Okta org authorization server is not usable.

## Scope your rule

<Warning>
  Multiple service apps under the same Okta authorization server share the same issuer. A rule that omits `subject_prefix` matches every service app on that server, so any team that can register one could obtain a federated Anthropic token.
</Warning>

Lock the rule’s `match` block to the narrowest scope that fits your use case:

* **Pin the exact Client ID:** Set `subject_prefix` to the service app’s full Client ID with no trailing `*`.
* **Pin the audience:** Match the `audience` value you configured on the authorization server so tokens minted for a different audience are rejected.
* **Match on custom claims:** For finer-grained scoping, add claims in the authorization server’s **Claims** tab and match them with the rule’s `claims` map or a CEL `condition`.
* **Use one rule for each service app:** Create a separate federation rule for each service app rather than sharing one rule across apps.

## Next steps

* Review the [WIF reference](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli) for the full credential resolution order and profile configuration.
* See [Rule matching semantics](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli#rule-matching-semantics) to match on custom Okta claims with CEL expressions.
