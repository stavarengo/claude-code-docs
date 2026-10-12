---
title: List API Keys
url: https://platform.claude.com/docs/en/api/cli/beta/organization/api_keys/list
---

# List API Keys

`$ ant beta:organization:api-keys list`

**GET** `/v1/organizations/api_keys`

List API Keys

## Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--created-by-user-id: optional string` (query parameter)

  Filter by the ID of the User who created the object.

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--status: optional "active" or "archived" or "expired" or "inactive"` (query parameter)

  Filter by API key status.

- `--workspace-id: optional string` (query parameter)

  Filter by Workspace ID.

## Returns

- `BetaListResponse_ApiKey_: object`

  - `data: array of BetaAPIKey`

    - `type: "api_key"`

      Object type.

      For API Keys, this is always `"api_key"`.

    - `id: string`

      ID of the API key.

    - `created_at: string`

      RFC 3339 datetime string indicating when the API Key was created.

      format: date-time

    - `created_by: object`

      The ID and type of the actor that created the API key, or `null` when the
      creator is not recorded (legacy, workload-identity-federated, or
      system-created keys).

      - `type: "service_account" or "user"`

        Type of the actor that created the object.

        - `"service_account"`

        - `"user"`

      - `id: string`

        ID of the actor that created the object.

    - `expires_at: string`

      RFC 3339 datetime string indicating when the API Key expires, or `null` if it never expires.

      format: date-time

    - `name: string`

      Name of the API key.

    - `partial_key_hint: string`

      Partially redacted hint for the API key.

    - `principal: BetaAPIKeyUserActor or BetaAPIKeyServiceAccountActor`

      The principal the API key acts as (a User or a Service Account), or `null` if the API key is not bound to a principal.

      - `beta_api_key_user_actor: object`

        - `type: "user_actor"`

          Principal type. Always `"user_actor"` for a User.

        - `user_id: string`

          ID of the User the API key acts as.

      - `beta_api_key_service_account_actor: object`

        - `type: "service_account_actor"`

          Principal type. Always `"service_account_actor"` for a Service Account.

        - `service_account_id: string`

          ID of the Service Account the API key acts as.

    - `scope: BetaAPIKeyOrganizationScope or BetaAPIKeyWorkspaceScope`

      Where the API key belongs: its Workspace (`{"type": "workspace", "workspace_id": "wrkspc_..."}`, with the Workspace's real ID even when it is the organization's default Workspace), or the organization (`{"type": "organization"}`) for a principal-bound API key that has no Workspace.

      - `beta_api_key_organization_scope: object`

        - `type: "organization"`

          Scope type. Always `"organization"`: the API key has no Workspace. Only a principal-bound API key can have this scope.

      - `beta_api_key_workspace_scope: object`

        - `type: "workspace"`

          Scope type. Always `"workspace"`: the API key belongs to one Workspace.

        - `workspace_id: string`

          ID of the Workspace the API key belongs to. Unlike the deprecated top-level `workspace_id`, this is the Workspace's real ID even for the organization's default Workspace.

    - `status: "active" or "archived" or "expired" or "inactive"`

      Status of the API key.

      - `"active"`

      - `"archived"`

      - `"expired"`

      - `"inactive"`

    - `workspace_id: string`

      **Deprecated**: Use `scope` instead. `workspace_id` is `null` both for an API key in the default Workspace and for a principal-bound API key that has no Workspace.

      Deprecated: use `scope` instead. ID of the Workspace associated with the API key, or `null` if the API key belongs to the default Workspace. Also `null` for a principal-bound API key that has no Workspace; `scope` tells the two apart.

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

## Example

```bash
ant beta:organization:api-keys list \
  --api-key my-anthropic-api-key
```

### Response (200)

```json
{
  "data": [
    {
      "id": "apikey_01Rj2N8SVvo6BePZj99NhmiT",
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by": {
        "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
        "type": "user"
      },
      "expires_at": "2024-10-30T23:58:27.427722Z",
      "name": "Developer Key",
      "partial_key_hint": "sk-ant-api03-R2D...igAA",
      "principal": {
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "scope": {
        "type": "workspace",
        "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"
      },
      "status": "active",
      "type": "api_key",
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```
