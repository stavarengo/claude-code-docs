---
title: Authentication
url: https://platform.claude.com/docs/en/manage-claude/authentication
description: Authenticate to the Claude API with API keys, Workload Identity Federation, or App Attest.
---

The Claude API supports three ways to authenticate requests:

| Method                                                                                                                                          | Credential                                                                                              | Best for                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [API key](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#api-keys)                                          | Static `sk-ant-api...` secret sent as a bearer token in the `Authorization` header                      | Local development, prototyping, scripts, and servers where you control secret storage                                                           |
| [Workload Identity Federation](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#workload-identity-federation) | Short-lived bearer token exchanged from your identity provider’s identity token                         | Production workloads on cloud platforms (AWS, Google Cloud, Azure), CI/CD pipelines, and Kubernetes, where you want to eliminate static secrets |
| [App Attest](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#app-attest)                                     | Short-lived access token issued to a genuine, attested installation of your registered iOS or macOS app | iOS and macOS apps distributed to end users, where the app calls the Claude API directly with no back end or proxy                              |

API keys and Workload Identity Federation grant the same access to Claude API endpoints. Choose API keys to get started quickly: a personal key for your own development, or a service account key for anything shared. Move to Workload Identity Federation when your workload already has a platform-issued identity you can federate. Use App Attest for iOS and macOS apps you distribute to end users.

## API keys

API keys are static secrets that you generate in the Claude Console and send on every request as a bearer token in the `Authorization` header.

### Key types

When you create a key, you choose its type, which determines what the key can do, where it works, and when it stops working:

| Key type                   | Acts as                                                                                                                                | Works in                                                                                                                                                                                              | Stops working when                                                                                                                                                                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Personal key**           | You, the user, with your roles and permissions                                                                                         | Either a single workspace or the workspaces where your role allows API use, chosen when the key is created                                                                                            | You lose access to the organization. A single-workspace key also stops working when you lose access to that workspace or that workspace is archived. Personal keys are archived when you are removed from the organization. If you are re-invited, create new keys; archived keys are not restored |
| **Service account key**    | A [service account](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli#service-accounts) | Either a single workspace or anything the service account has access to, chosen when the key is created. A service account has access to the Default Workspace and to workspaces it has been added to | The service account is archived. A single-workspace key also stops working when the service account is removed from that workspace or that workspace is archived                                                                                                                                   |
| **Workspace key** (legacy) | No one: it belongs to the workspace it was created in                                                                                  | That workspace                                                                                                                                                                                        | It expires, is disabled or deleted, or its workspace is archived, regardless of whether its creator leaves the organization                                                                                                                                                                        |

Personal keys and service account keys are identity-backed: each belongs to a user or service account your organization already manages, and every request acts as that identity. When that identity is removed from the organization, the key stops working. This means that keys don’t accidentally outlive the people or workloads that own them. Prefer them over workspace keys for new integrations.

Use a personal key for your own development and scripts. A shared personal key acts as one person and breaks when they leave. For shared or automated workloads (CI, production services), have an organization admin create a service account so the workload has its own identity.

Workspace API keys still work but should be considered legacy; identity-backed keys or [Workload Identity Federation](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli) are preferred. To migrate, see [Replacing workspace API keys](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#replacing-workspace-api-keys).

### Create and use a key

* **Create a key:** In the Claude Console, go to the [API keys](https://platform.claude.com/settings/keys) page (`platform.claude.com/settings/keys`) and click **Create key**. Name the key and select an [expiration](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#key-expiration). Set **Linked account** to yourself for a personal key, or to a service account for a key shared across multiple users. You can also scope the key to a specific workspace, which lets you skip setting a workspace ID manually in future requests.
* **Use the key:** Send it as `Authorization: Bearer <key>` on direct HTTP requests, or set the `ANTHROPIC_API_KEY` environment variable and the [client SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) picks it up automatically.

```http
POST /v1/messages
Authorization: Bearer YOUR_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

The legacy `x-api-key: YOUR_API_KEY` header is still supported in place of `Authorization`.

Store API keys in a secrets manager, rotate them periodically, and disable or delete any key you suspect has leaked. On the [API keys](https://platform.claude.com/settings/keys) page in the Claude Console, **Disable** is reversible (the Admin API reports the key’s `status` as `"inactive"`, and **Re-enable** returns it to `"active"`), whereas **Delete** is permanent: the key is archived and still appears in [List API Keys](https://platform.claude.com/docs/en/api/organization/api_keys/list?sdk_languages=cli) with `status: "archived"`. Expired keys can only be deleted. You can also set an [expiration](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#key-expiration) when you create a key to limit how long a leaked credential stays usable.

<CodeGroup>
  ```bash CLI
  # See /docs/en/cli-sdks-libraries/cli/authentication#api-key for zsh, bash, and Windows variants
  export ANTHROPIC_API_KEY=sk-ant-api03-...
  ```
</CodeGroup>

### Select a workspace

API keys that are created for a specific workspace only work in that workspace, and API requests using these keys can omit the workspace ID.

If your API key isn’t scoped to a workspace, you must specify the workspace ID in the `anthropic-workspace-id` header for each request. See the following example for how to set this header in a request or in the SDK.

The [Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api?sdk_languages=cli) accepts a personal key or service account key only if the key isn’t scoped to a specific workspace.

You can find a workspace’s ID in the **ID** column on the [Workspaces](https://platform.claude.com/settings/workspaces) page (`platform.claude.com/settings/workspaces`) in the Claude Console, or by calling the [List Workspaces](https://platform.claude.com/docs/en/api/organization/workspaces/list?sdk_languages=cli) endpoint. List Workspaces includes the Default Workspace only when you pass `include_default=true`; its ID is also in the `anthropic-workspace-id` [response header](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli#identify-the-workspace-behind-an-api-response) of any request that runs there.

<CodeGroup>
  ```bash CLI
  # Required on every command for a key that isn't scoped to a workspace.
  # Omit --workspace-id for a key scoped to one workspace.
  ant messages create \
    --workspace-id wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ \
    --model claude-opus-5-5 \
    --max-tokens 1024 \
    --message '{role: user, content: "Hello, Claude"}'
  ```
</CodeGroup>

If a request made with a key that isn’t scoped to a workspace omits the header, the API returns a 400 `invalid_request_error`:

```json JSON
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "This API key is not scoped to a workspace, so this request must include the anthropic-workspace-id header with the ID of the workspace to use. Add the header, or use an API key that is scoped to a workspace."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

A header value that isn’t a valid workspace ID returns a 400 `invalid_request_error` with the message `anthropic-workspace-id header must be a valid workspace ID.` If the workspace doesn’t exist, or the key’s user or service account doesn’t have access to it, the API returns a 404 `not_found_error` with the message ``Workspace `<id>` not found.``, the same response as for any unknown workspace.

Workload Identity Federation selects a workspace at token exchange instead; see the [WIF reference](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli) for details.

### Key expiration

When you create an API key from the [API keys](https://platform.claude.com/settings/keys) page in the Claude Console, you choose an expiration: a preset (3 hours, 1 day, 7 days, or 30 days), a custom duration, or **Never** for keys you store in a secrets manager and rotate yourself. If your organization has a maximum expiration policy, the Console limits presets and custom durations to the policy maximum, and **Never** is unavailable. Existing keys keep their current behavior; expiration is set at creation time and cannot be changed afterward. The same expiration choice applies when you [create an Admin API key](https://platform.claude.com/docs/en/manage-claude/admin-api-keys?sdk_languages=cli) in the Claude Console.

Anthropic emails the key’s creator as the expiration approaches: 7 days before expiration for keys created with a lifetime of at least 14 days, and 1 day before for keys with a lifetime of at least 7 days. Keys with shorter lifetimes expire without a warning email.

After a key expires, requests made with it return a `401 authentication_error`. Create a new key to restore access; expired keys cannot be reactivated.

The Console API keys table shows each key’s expiration, and the Admin API reports each key’s `expires_at` timestamp on the [List API Keys](https://platform.claude.com/docs/en/api/organization/api_keys/list?sdk_languages=cli) and [Retrieve API Key](https://platform.claude.com/docs/en/api/organization/api_keys/retrieve?sdk_languages=cli) endpoints, so you can audit and rotate keys before they expire. The field is `null` for keys without an expiration.

Expiration limits the lifetime of a leaked credential, but it is not a substitute for secret hygiene. Regardless of expiration, store keys in a secrets manager and disable or delete any key you suspect has leaked.

### Replacing workspace API keys

If you have a workspace key, you may want to replace it with [Workload Identity Federation](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli) or a personal or service account key. This provides better security and observability.

See the [WIF reference](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli) for details on configuring Workload Identity Federation, which is preferred over long-lived keys.

To replace a workspace key with a personal or service account key:

1. **Decide the key type.** Your own tooling should use a personal key. A shared or unattended workload should use a service account key.
2. **Create a service account** if necessary. You might have to ask an organization admin to create one on the [Service accounts](https://platform.claude.com/settings/service-accounts) page (`platform.claude.com/settings/service-accounts`) in the Claude Console and add it to the relevant workspace.
3. **Create the new key.** Create it specifically for the integration’s workspace unless the integration needs multiple workspaces.
4. **Deploy the new key.** Replace the old key wherever the integration reads it, typically the `ANTHROPIC_API_KEY` environment variable or a secrets manager entry. For a key that isn’t scoped to a workspace, also send the `anthropic-workspace-id` header as shown in [Select a workspace](https://platform.claude.com/docs/en/manage-claude/authentication?sdk_languages=cli#select-a-workspace).
5. **Delete the old key.** Confirm that requests succeed, then delete the workspace key on the [API keys page](https://platform.claude.com/settings/keys) in the Claude Console.

## Workload Identity Federation

Workload Identity Federation (WIF) lets a workload authenticate with a short-lived identity token issued by an identity provider (IdP) you already trust. Such IdPs include AWS IAM, Google Cloud, and any standards-compliant OIDC issuer (such as GitHub Actions, Kubernetes service accounts, SPIFFE, Microsoft Entra ID, or Okta). The workload exchanges its IdP-issued JWT at `POST /v1/oauth/token` for a short-lived Claude API access token, and the SDK refreshes that token automatically before it expires. There is no `sk-ant-api...` string to mint, distribute, or rotate.

Federation removes long-lived Claude API keys from your environment, which limits the damage that a leaked credential can cause and lets you manage access with the same IdP controls you already use for cloud resources. It does not, on its own, guarantee end-to-end security: the trust chain is only as strong as your identity provider’s configuration, and a long-lived secret one step earlier in that chain (for example, a static cloud credential that can mint IdP tokens) can still undermine it. Pair federation with your provider’s controls, such as IP allowlists, MFA, and audit logging.

To configure federation, you create three resources in the Claude Console (a service account, a federation issuer, and a federation rule) and then point your SDK at the rule. See [Workload Identity Federation](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli) for the full setup walkthrough.

## App Attest

App Attest authenticates iOS and macOS apps that call the Claude API directly from the device. Each installation proves that it is a genuine, unmodified build of an app you registered in the Claude Console, using Apple’s App Attest service. Anthropic then issues the device a short-lived access token that bills usage to your workspace. Tokens are scoped to your workspace, expire after 1 hour, and authorize only [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli) calls.

To register your app and get a client ID, see [App Attest for iOS and macOS apps](https://platform.claude.com/docs/en/manage-claude/app-attest?sdk_languages=cli).

## Next steps

<CardGroup cols={2}>
  <Card title="Set up Workload Identity Federation" icon="lock" href="https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli">
    Configure issuers, rules, and service accounts, then exchange tokens
  </Card>

  <Card title="Identity provider guides" icon="cloud" href="https://platform.claude.com/docs/en/manage-claude/workload-identity-federation?sdk_languages=cli#identity-providers">
    Step-by-step guides for AWS, Google Cloud, Azure, GitHub Actions, Kubernetes, SPIFFE, and Okta
  </Card>

  <Card title="WIF reference" icon="book" href="https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli">
    Environment variables, validation rules, profile configuration, and error reference
  </Card>

  <Card title="App Attest for iOS and macOS apps" icon="fingerprint" href="https://platform.claude.com/docs/en/manage-claude/app-attest?sdk_languages=cli">
    Let genuine installations of your app call the Claude API without shipping an API key
  </Card>

  <Card title="Client SDKs" icon="code" href="https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli">
    Python, TypeScript, C#, Go, Java, PHP, Ruby, and the CLI
  </Card>
</CardGroup>
