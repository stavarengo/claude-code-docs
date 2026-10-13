---
title: Organization
url: https://platform.claude.com/docs/en/api/cli/beta/organization
---

# Organization

## Get Current Organization

`$ ant beta:organization retrieve`

**GET** `/v1/organizations/me`

Retrieve information about the organization associated with the authenticated API key.

### Returns

- `beta_organization: object`

  - `type: "organization"`

    Object type.

    For Organizations, this is always `"organization"`.

  - `id: string`

    ID of the Organization.

    format: uuid

  - `name: string`

    Name of the Organization.

### Example

```bash
ant beta:organization retrieve \
  --api-key my-anthropic-api-key
```

#### Response (200)

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "name": "Organization Name",
  "type": "organization"
}
```

## Domain types

### Beta Organization

- `beta_organization: object`

  - `type: "organization"`

    Object type.

    For Organizations, this is always `"organization"`.

  - `id: string`

    ID of the Organization.

    format: uuid

  - `name: string`

    Name of the Organization.

### Beta Organization Role

- `beta_organization_role: "admin" or "billing" or "claude_code_user" or 6 more`

  - `"admin"`

  - `"billing"`

  - `"claude_code_user"`

  - `"developer"`

  - `"managed"`

  - `"membership_admin"`

  - `"owner"`

  - `"primary_owner"`

  - `"user"`

## Organization › API Keys

### List API Keys

`$ ant beta:organization:api-keys list`

**GET** `/v1/organizations/api_keys`

List API Keys

#### Parameters

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

#### Returns

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

#### Example

```bash
ant beta:organization:api-keys list \
  --api-key my-anthropic-api-key
```

##### Response (200)

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

### Retrieve API Key (Admin API)

`$ ant beta:organization:api-keys retrieve`

**GET** `/v1/organizations/api_keys/{api_key_id}`

Retrieve information about a single API key in your organization, looked up by its ID. This Admin API endpoint requires an Admin API key, is intended for programmatic key management, and never returns the key's secret value. To view or create your own API keys, go to [API keys](https://platform.claude.com/settings/keys) in the Claude Console.

#### Parameters

- `--api-key-id: string` (path parameter)

  ID of the API key.

#### Returns

- `beta_api_key: object`

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

#### Example

```bash
ant beta:organization:api-keys retrieve \
  --api-key my-anthropic-api-key \
  --api-key-id api_key_id
```

##### Response (200)

```json
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
```

### Update API Key

`$ ant beta:organization:api-keys update`

**POST** `/v1/organizations/api_keys/{api_key_id}`

Update API Key

#### Parameters

- `--api-key-id: string` (path parameter)

  ID of the API key.

- `--name: optional string`

  Name of the API key.

  minLength: 1, maxLength: 500

- `--status: optional "active" or "archived" or "inactive"`

  Status of the API key.

#### Returns

- `beta_api_key: object`

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

#### Example

```bash
ant beta:organization:api-keys update \
  --api-key my-anthropic-api-key \
  --api-key-id api_key_id
```

##### Response (200)

```json
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
```

## Organization › External Keys

### Create External Key

`$ ant beta:organization:external-keys create`

**POST** `/v1/organizations/external_keys`

Create an external key config owned by the caller's organization.

#### Parameters

- `--provider-config: BetaAWSExternalKeyConfig or BetaGCPExternalKeyConfig or BetaAzureExternalKeyConfigParam`

  KMS provider identity and auth coordinates.

- `--display-name: optional string`

  Human-friendly display name.

  minLength: 1, maxLength: 255

- `--geo: optional "us"`

  Data residency geo. Only `us` is supported.

#### Returns

- `beta_external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config. A tagged ID prefixed `ekey_`, or — for organizations on the Claude Platform on AWS — the AWS KMS key ARN.

  - `attachment: BetaExternalKeyAttachedAttachment or BetaExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `beta_external_key_attached_attachment: object`

      - `type: "attached"`

    - `beta_external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects which regional validator handles this key's encrypt/decrypt roundtrips.

  - `provider_config: BetaAWSExternalKeyConfig or BetaGCPExternalKeyConfig or BetaAzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `beta_aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS the key must be a single-Region key in your organization's own AWS account; cross-account keys, multi-Region keys, and alias ARNs are rejected.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

      - `role_arn: optional string`

        **Deprecated**

        IAM role ARN. Deprecated — Anthropic reaches the KMS key through its own intermediate role (or, on Claude Platform on AWS, with credentials AWS issues for the Workspace); this field is ignored.

    - `beta_gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `beta_azure_external_key_config: object`

      - `type: "azure"`

      - `key_name: string`

        Name of the key within the vault.

      - `tenant_id: string`

        Azure AD tenant ID.

      - `vault_uri: string`

        Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

      - `client_id: optional string`

        Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

  - `updated_at: string`

    format: date-time

#### Example

```bash
ant beta:organization:external-keys create \
  --api-key my-anthropic-api-key \
  --provider-config '{kms_arn: arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222, type: aws}'
```

##### Response (200)

```json
{
  "id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "attachment": {
    "type": "attached"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "display_name": "prod-us-key",
  "geo": "us",
  "provider_config": {
    "kms_arn": "arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222",
    "type": "aws",
    "region": "us-east-1",
    "role_arn": "arn:aws:iam::111122223333:role/anthropic-cmek"
  },
  "type": "external_key",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

### List External Keys

`$ ant beta:organization:external-keys list`

**GET** `/v1/organizations/external_keys`

List external key configs in the caller's organization.

Results are ordered by creation time (newest first). Use the
`next_page` cursor from the response to fetch subsequent pages.

#### Parameters

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

#### Returns

- `BetaExternalKeyListResponse: object`

  Opaque-cursor page of external keys, ordered by creation time (newest first).

  - `data: array of BetaExternalKey`

    - `type: "external_key"`

    - `id: string`

      Identifier of the external key config. A tagged ID prefixed `ekey_`, or — for organizations on the Claude Platform on AWS — the AWS KMS key ARN.

    - `attachment: BetaExternalKeyAttachedAttachment or BetaExternalKeyUnattachedAttachment`

      Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

      - `beta_external_key_attached_attachment: object`

        - `type: "attached"`

      - `beta_external_key_unattached_attachment: object`

        - `type: "unattached"`

    - `created_at: string`

      format: date-time

    - `display_name: string`

      Human-friendly display name. Null if none was set.

    - `geo: string`

      Data residency geo. Selects which regional validator handles this key's encrypt/decrypt roundtrips.

    - `provider_config: BetaAWSExternalKeyConfig or BetaGCPExternalKeyConfig or BetaAzureExternalKeyConfig`

      KMS provider identity and auth coordinates.

      - `beta_aws_external_key_config: object`

        - `type: "aws"`

        - `kms_arn: string`

          Full ARN of the AWS KMS key. On Claude Platform on AWS the key must be a single-Region key in your organization's own AWS account; cross-account keys, multi-Region keys, and alias ARNs are rejected.

          maxLength: 2048

        - `region: optional string`

          AWS region. Derived from `kms_arn` if omitted.

        - `role_arn: optional string`

          **Deprecated**

          IAM role ARN. Deprecated — Anthropic reaches the KMS key through its own intermediate role (or, on Claude Platform on AWS, with credentials AWS issues for the Workspace); this field is ignored.

      - `beta_gcp_external_key_config: object`

        - `type: "gcp"`

        - `key_name: string`

          Full resource name of the Cloud KMS key.

      - `beta_azure_external_key_config: object`

        - `type: "azure"`

        - `key_name: string`

          Name of the key within the vault.

        - `tenant_id: string`

          Azure AD tenant ID.

        - `vault_uri: string`

          Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

        - `client_id: optional string`

          Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

    - `updated_at: string`

      format: date-time

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results. Pass as `?page=` to fetch the next page.

#### Example

```bash
ant beta:organization:external-keys list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
      "attachment": {
        "type": "attached"
      },
      "created_at": "2024-10-30T23:58:27.427722Z",
      "display_name": "prod-us-key",
      "geo": "us",
      "provider_config": {
        "kms_arn": "arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222",
        "type": "aws",
        "region": "us-east-1",
        "role_arn": "arn:aws:iam::111122223333:role/anthropic-cmek"
      },
      "type": "external_key",
      "updated_at": "2024-10-30T23:58:27.427722Z"
    }
  ],
  "next_page": "next_page"
}
```

### Get External Key

`$ ant beta:organization:external-keys retrieve`

**GET** `/v1/organizations/external_keys/{external_key_id}`

Retrieve a single external key config in the caller's organization by ID.

#### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

#### Returns

- `beta_external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config. A tagged ID prefixed `ekey_`, or — for organizations on the Claude Platform on AWS — the AWS KMS key ARN.

  - `attachment: BetaExternalKeyAttachedAttachment or BetaExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `beta_external_key_attached_attachment: object`

      - `type: "attached"`

    - `beta_external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects which regional validator handles this key's encrypt/decrypt roundtrips.

  - `provider_config: BetaAWSExternalKeyConfig or BetaGCPExternalKeyConfig or BetaAzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `beta_aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS the key must be a single-Region key in your organization's own AWS account; cross-account keys, multi-Region keys, and alias ARNs are rejected.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

      - `role_arn: optional string`

        **Deprecated**

        IAM role ARN. Deprecated — Anthropic reaches the KMS key through its own intermediate role (or, on Claude Platform on AWS, with credentials AWS issues for the Workspace); this field is ignored.

    - `beta_gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `beta_azure_external_key_config: object`

      - `type: "azure"`

      - `key_name: string`

        Name of the key within the vault.

      - `tenant_id: string`

        Azure AD tenant ID.

      - `vault_uri: string`

        Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

      - `client_id: optional string`

        Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

  - `updated_at: string`

    format: date-time

#### Example

```bash
ant beta:organization:external-keys retrieve \
  --api-key my-anthropic-api-key \
  --external-key-id external_key_id
```

##### Response (200)

```json
{
  "id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "attachment": {
    "type": "attached"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "display_name": "prod-us-key",
  "geo": "us",
  "provider_config": {
    "kms_arn": "arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222",
    "type": "aws",
    "region": "us-east-1",
    "role_arn": "arn:aws:iam::111122223333:role/anthropic-cmek"
  },
  "type": "external_key",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

### Update External Key

`$ ant beta:organization:external-keys update`

**POST** `/v1/organizations/external_keys/{external_key_id}`

Partially update an external key config. Omitted fields are left unchanged.

`display_name` is always editable. `geo` and `provider_config` cannot
be changed once any workspace references this config, because previously
encrypted data requires the original key identity to decrypt.

#### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

- `--display-name: optional string`

  Human-friendly display name.

  minLength: 1, maxLength: 255

- `--geo: optional "us"`

  Data residency geo. Only `us` is supported.

- `--provider-config: optional BetaAWSExternalKeyConfig or BetaGCPExternalKeyConfig or BetaAzureExternalKeyConfigParam`

  KMS provider identity and auth coordinates.

#### Returns

- `beta_external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config. A tagged ID prefixed `ekey_`, or — for organizations on the Claude Platform on AWS — the AWS KMS key ARN.

  - `attachment: BetaExternalKeyAttachedAttachment or BetaExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `beta_external_key_attached_attachment: object`

      - `type: "attached"`

    - `beta_external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects which regional validator handles this key's encrypt/decrypt roundtrips.

  - `provider_config: BetaAWSExternalKeyConfig or BetaGCPExternalKeyConfig or BetaAzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `beta_aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS the key must be a single-Region key in your organization's own AWS account; cross-account keys, multi-Region keys, and alias ARNs are rejected.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

      - `role_arn: optional string`

        **Deprecated**

        IAM role ARN. Deprecated — Anthropic reaches the KMS key through its own intermediate role (or, on Claude Platform on AWS, with credentials AWS issues for the Workspace); this field is ignored.

    - `beta_gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `beta_azure_external_key_config: object`

      - `type: "azure"`

      - `key_name: string`

        Name of the key within the vault.

      - `tenant_id: string`

        Azure AD tenant ID.

      - `vault_uri: string`

        Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

      - `client_id: optional string`

        Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

  - `updated_at: string`

    format: date-time

#### Example

```bash
ant beta:organization:external-keys update \
  --api-key my-anthropic-api-key \
  --external-key-id external_key_id
```

##### Response (200)

```json
{
  "id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "attachment": {
    "type": "attached"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "display_name": "prod-us-key",
  "geo": "us",
  "provider_config": {
    "kms_arn": "arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222",
    "type": "aws",
    "region": "us-east-1",
    "role_arn": "arn:aws:iam::111122223333:role/anthropic-cmek"
  },
  "type": "external_key",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

### Delete External Key

`$ ant beta:organization:external-keys delete`

**DELETE** `/v1/organizations/external_keys/{external_key_id}`

Delete an external key config.

The request is rejected if any workspace still references this config.

#### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

#### Returns

- `BetaOrganizationExternalKeyDeleteResponse: object`

  - `type: "external_key_deleted"`

  - `id: string`

    ID of the deleted External Key.

#### Example

```bash
ant beta:organization:external-keys delete \
  --api-key my-anthropic-api-key \
  --external-key-id external_key_id
```

##### Response (200)

```json
{
  "id": "ekey_01AbCdEfGhIjKlMnOpQrStUv",
  "type": "external_key_deleted"
}
```

### Validate External Key

`$ ant beta:organization:external-keys validate`

**POST** `/v1/organizations/external_keys/{external_key_id}/validate`

Validate an external key config against the customer's KMS.

Anthropic performs an encrypt/decrypt roundtrip against the configured
KMS key and waits up to 30 seconds for the result. The response status is
`success` if the roundtrip succeeded, or `failure` with an error
message if it failed or timed out.

#### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

#### Returns

- `BetaOrganizationExternalKeyValidateResponse: object`

  Result of a validation roundtrip against the customer's KMS.

  HTTP 200 for both outcomes — the operation completed; `status` says
  whether the key works.

  - `type: "external_key_validation"`

  - `error: string`

    Error message when status is `failure`. Null otherwise.

  - `status: "failure" or "success"`

    `success` — encrypt/decrypt roundtrip succeeded. `failure` — the roundtrip failed or timed out; see `error`.

    - `"failure"`

    - `"success"`

#### Example

```bash
ant beta:organization:external-keys validate \
  --api-key my-anthropic-api-key \
  --external-key-id external_key_id
```

##### Response (200)

```json
{
  "error": "error",
  "status": "failure",
  "type": "external_key_validation"
}
```

## Organization › Federation › Issuers

### Create Federation Issuer

`$ ant beta:organization:federation:issuers create`

**POST** `/v1/organizations/federation_issuers`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Register an OIDC issuer that Anthropic will trust for workload identity
federation in your organization.

The `jwks` field controls how the issuer's signing keys are obtained and
takes one of three shapes selected by `type`: `discovery` (resolve keys
through OIDC discovery), `explicit_url` (fetch keys from a fixed JWKS
URL), or `inline` (provide a static key set). When `jwks.type` is
`discovery` and no `discovery_base` is set, the issuer URL must be
publicly reachable over HTTPS so Anthropic can fetch the discovery
document; for `explicit_url` and `inline` modes the issuer URL is only
matched as the JWT's `iss` claim and is not fetched.

#### Parameters

- `--issuer-url: string`

  The `iss` claim value to match against.

  minLength: 1

- `--name: string`

  Slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--check-jti: optional boolean`

  Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Defaults to true. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

- `--jwks: optional BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

  How signing keys are obtained. Defaults to OIDC discovery.

- `--max-jwt-lifetime-seconds: optional number`

  Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Defaults to 3600 (1h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

  minimum: 1, maximum: 176400

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_issuer: object`

  Registered external OIDC identity provider.

  Records an external IdP the organization trusts for the RFC 7523
  jwt-bearer grant. The `issuer_url` must match the JWT `iss` claim exactly.

  - `type: "federation_issuer"`

  - `id: string`

    Tagged ID of the federation issuer.

  - `archived_at: string`

    If set, all rules referencing this issuer reject token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this issuer.

  - `check_jti: boolean`

    Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

  - `created_at: string`

    When this issuer was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this issuer.

  - `issuer_url: string`

    The `iss` claim value. Incoming JWTs must match exactly.

  - `jwks: BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

    How signing keys are obtained for signature verification.

    - `beta_jwks_discovery: object`

      JWKS via the issuer's OIDC discovery document.

      - `type: "discovery"`

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

      - `discovery_base: optional string`

        Set when the discovery URL differs from `issuer_url`.

    - `beta_jwks_explicit_url: object`

      JWKS fetched from a fixed endpoint.

      - `type: "explicit_url"`

      - `url: string`

        JWKS endpoint.

        minLength: 1

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

    - `beta_jwks_inline: object`

      JWKS supplied directly; no network fetch.

      - `type: "inline"`

      - `keys: array of map[unknown]`

        Inline JWK objects.

        minItems: 1

  - `jwks_polling_disabled_at: string`

    If set, Anthropic's JWKS poller has paused polling for this issuer after repeated fetch failures. Re-enable by sending `jwks_polling_disabled: false` via the issuer update endpoint (POST) once the upstream JWKS endpoint is fixed. An OAuth caller cannot send this when the issuer backs a rule with any scope other than `workspace:developer` or `workspace:inference`; use a Console session.

    format: date-time

  - `max_jwt_lifetime_seconds: number`

    Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

  - `name: string`

    Admin-chosen slug identifier.

  - `poll_status: object`

    Live state of Anthropic's JWKS polling for this issuer. Populated on both single-issuer retrieval and list responses, including archived issuers. Typically null for inline-key issuers (no polling), or when poll status is temporarily unavailable or polling has not started yet.

    - `consecutive_failures: number`

      Consecutive fetch failures since the last success.

    - `last_fetched_at: string`

      When the last successful fetch completed.

      format: date-time

    - `next_poll_at: string`

      When the next fetch is scheduled. Null if paused.

      format: date-time

  - `updated_at: string`

    When this issuer was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this issuer.

#### Example

```bash
ant beta:organization:federation:issuers create \
  --api-key my-anthropic-api-key \
  --issuer-url x \
  --name x
```

##### Response (200)

```json
{
  "id": "fdis_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "check_jti": true,
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "issuer_url": "https://token.actions.githubusercontent.com",
  "jwks": {
    "type": "discovery",
    "ca_cert_pem": "ca_cert_pem",
    "discovery_base": "discovery_base"
  },
  "jwks_polling_disabled_at": "2019-12-27T18:11:19.117Z",
  "max_jwt_lifetime_seconds": 0,
  "name": "github-actions",
  "poll_status": {
    "consecutive_failures": 0,
    "last_fetched_at": "2019-12-27T18:11:19.117Z",
    "next_poll_at": "2019-12-27T18:11:19.117Z"
  },
  "type": "federation_issuer",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

### List Federation Issuers

`$ ant beta:organization:federation:issuers list`

**GET** `/v1/organizations/federation_issuers`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List federation issuers in your organization.

Archived issuers are excluded unless `include_archived=true`.

#### Parameters

- `--include-archived: optional boolean` (query parameter)

  Include archived resources. Defaults to false.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaFederationIssuerListResponse: object`

  - `data: array of BetaFederationIssuer`

    - `type: "federation_issuer"`

    - `id: string`

      Tagged ID of the federation issuer.

    - `archived_at: string`

      If set, all rules referencing this issuer reject token exchange.

      format: date-time

    - `archived_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that archived this issuer.

    - `check_jti: boolean`

      Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

    - `created_at: string`

      When this issuer was created.

      format: date-time

    - `created_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that created this issuer.

    - `issuer_url: string`

      The `iss` claim value. Incoming JWTs must match exactly.

    - `jwks: BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

      How signing keys are obtained for signature verification.

      - `beta_jwks_discovery: object`

        JWKS via the issuer's OIDC discovery document.

        - `type: "discovery"`

        - `ca_cert_pem: optional string`

          Optional custom CA (PEM) for TLS verification of the JWKS fetch.

          maxLength: 8192

        - `discovery_base: optional string`

          Set when the discovery URL differs from `issuer_url`.

      - `beta_jwks_explicit_url: object`

        JWKS fetched from a fixed endpoint.

        - `type: "explicit_url"`

        - `url: string`

          JWKS endpoint.

          minLength: 1

        - `ca_cert_pem: optional string`

          Optional custom CA (PEM) for TLS verification of the JWKS fetch.

          maxLength: 8192

      - `beta_jwks_inline: object`

        JWKS supplied directly; no network fetch.

        - `type: "inline"`

        - `keys: array of map[unknown]`

          Inline JWK objects.

          minItems: 1

    - `jwks_polling_disabled_at: string`

      If set, Anthropic's JWKS poller has paused polling for this issuer after repeated fetch failures. Re-enable by sending `jwks_polling_disabled: false` via the issuer update endpoint (POST) once the upstream JWKS endpoint is fixed. An OAuth caller cannot send this when the issuer backs a rule with any scope other than `workspace:developer` or `workspace:inference`; use a Console session.

      format: date-time

    - `max_jwt_lifetime_seconds: number`

      Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

    - `name: string`

      Admin-chosen slug identifier.

    - `poll_status: object`

      Live state of Anthropic's JWKS polling for this issuer. Populated on both single-issuer retrieval and list responses, including archived issuers. Typically null for inline-key issuers (no polling), or when poll status is temporarily unavailable or polling has not started yet.

      - `consecutive_failures: number`

        Consecutive fetch failures since the last success.

      - `last_fetched_at: string`

        When the last successful fetch completed.

        format: date-time

      - `next_poll_at: string`

        When the next fetch is scheduled. Null if paused.

        format: date-time

    - `updated_at: string`

      When this issuer was last updated.

      format: date-time

    - `updated_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that last updated this issuer.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results.

#### Example

```bash
ant beta:organization:federation:issuers list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "fdis_01SDCCSbTxrXDpWc1phhtcfK",
      "archived_at": "2019-12-27T18:11:19.117Z",
      "archived_by_actor_id": "archived_by_actor_id",
      "check_jti": true,
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by_actor_id": "created_by_actor_id",
      "issuer_url": "https://token.actions.githubusercontent.com",
      "jwks": {
        "type": "discovery",
        "ca_cert_pem": "ca_cert_pem",
        "discovery_base": "discovery_base"
      },
      "jwks_polling_disabled_at": "2019-12-27T18:11:19.117Z",
      "max_jwt_lifetime_seconds": 0,
      "name": "github-actions",
      "poll_status": {
        "consecutive_failures": 0,
        "last_fetched_at": "2019-12-27T18:11:19.117Z",
        "next_poll_at": "2019-12-27T18:11:19.117Z"
      },
      "type": "federation_issuer",
      "updated_at": "2024-10-30T23:58:27.427722Z",
      "updated_by_actor_id": "updated_by_actor_id"
    }
  ],
  "next_page": "next_page"
}
```

### Get Federation Issuer

`$ ant beta:organization:federation:issuers retrieve`

**GET** `/v1/organizations/federation_issuers/{federation_issuer_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Retrieve a federation issuer by its ID (`fdis_...`).

#### Parameters

- `--federation-issuer-id: string` (path parameter)

  ID of the federation issuer.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_issuer: object`

  Registered external OIDC identity provider.

  Records an external IdP the organization trusts for the RFC 7523
  jwt-bearer grant. The `issuer_url` must match the JWT `iss` claim exactly.

  - `type: "federation_issuer"`

  - `id: string`

    Tagged ID of the federation issuer.

  - `archived_at: string`

    If set, all rules referencing this issuer reject token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this issuer.

  - `check_jti: boolean`

    Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

  - `created_at: string`

    When this issuer was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this issuer.

  - `issuer_url: string`

    The `iss` claim value. Incoming JWTs must match exactly.

  - `jwks: BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

    How signing keys are obtained for signature verification.

    - `beta_jwks_discovery: object`

      JWKS via the issuer's OIDC discovery document.

      - `type: "discovery"`

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

      - `discovery_base: optional string`

        Set when the discovery URL differs from `issuer_url`.

    - `beta_jwks_explicit_url: object`

      JWKS fetched from a fixed endpoint.

      - `type: "explicit_url"`

      - `url: string`

        JWKS endpoint.

        minLength: 1

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

    - `beta_jwks_inline: object`

      JWKS supplied directly; no network fetch.

      - `type: "inline"`

      - `keys: array of map[unknown]`

        Inline JWK objects.

        minItems: 1

  - `jwks_polling_disabled_at: string`

    If set, Anthropic's JWKS poller has paused polling for this issuer after repeated fetch failures. Re-enable by sending `jwks_polling_disabled: false` via the issuer update endpoint (POST) once the upstream JWKS endpoint is fixed. An OAuth caller cannot send this when the issuer backs a rule with any scope other than `workspace:developer` or `workspace:inference`; use a Console session.

    format: date-time

  - `max_jwt_lifetime_seconds: number`

    Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

  - `name: string`

    Admin-chosen slug identifier.

  - `poll_status: object`

    Live state of Anthropic's JWKS polling for this issuer. Populated on both single-issuer retrieval and list responses, including archived issuers. Typically null for inline-key issuers (no polling), or when poll status is temporarily unavailable or polling has not started yet.

    - `consecutive_failures: number`

      Consecutive fetch failures since the last success.

    - `last_fetched_at: string`

      When the last successful fetch completed.

      format: date-time

    - `next_poll_at: string`

      When the next fetch is scheduled. Null if paused.

      format: date-time

  - `updated_at: string`

    When this issuer was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this issuer.

#### Example

```bash
ant beta:organization:federation:issuers retrieve \
  --api-key my-anthropic-api-key \
  --federation-issuer-id federation_issuer_id
```

##### Response (200)

```json
{
  "id": "fdis_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "check_jti": true,
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "issuer_url": "https://token.actions.githubusercontent.com",
  "jwks": {
    "type": "discovery",
    "ca_cert_pem": "ca_cert_pem",
    "discovery_base": "discovery_base"
  },
  "jwks_polling_disabled_at": "2019-12-27T18:11:19.117Z",
  "max_jwt_lifetime_seconds": 0,
  "name": "github-actions",
  "poll_status": {
    "consecutive_failures": 0,
    "last_fetched_at": "2019-12-27T18:11:19.117Z",
    "next_poll_at": "2019-12-27T18:11:19.117Z"
  },
  "type": "federation_issuer",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

### Update Federation Issuer

`$ ant beta:organization:federation:issuers update`

**POST** `/v1/organizations/federation_issuers/{federation_issuer_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Partially update a federation issuer.

Setting `jwks` replaces the full JWKS shape at once. Archived issuers
cannot be updated; this returns 400. Create a new issuer instead.

Updating an issuer that backs a rule with a scope outside
`workspace:developer` or `workspace:inference` requires a Console
session.

#### Parameters

- `--federation-issuer-id: string` (path parameter)

  ID of the federation issuer to update.

- `--check-jti: optional boolean`

  Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

- `--issuer-url: optional string`

  Replaces the `iss` claim value to match against. For discovery-mode issuers without a `discovery_base`, this is also the URL Anthropic fetches the OIDC discovery document and signing keys from, so changing it repoints the JWKS source. Changing the issuer URL to a well-known shared platform is rejected while any live rule under this issuer would not constrain tenant identity.

  minLength: 1

- `--jwks: optional BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

  Replaces the entire JWKS configuration.

- `--jwks-polling-disabled: optional boolean`

  Only `false` is accepted, to re-enable polling after the system pauses it. Polling is paused automatically; sending `true` is rejected.

- `--max-jwt-lifetime-seconds: optional number`

  Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

  minimum: 1, maximum: 176400

- `--name: optional string`

  Replaces the slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_issuer: object`

  Registered external OIDC identity provider.

  Records an external IdP the organization trusts for the RFC 7523
  jwt-bearer grant. The `issuer_url` must match the JWT `iss` claim exactly.

  - `type: "federation_issuer"`

  - `id: string`

    Tagged ID of the federation issuer.

  - `archived_at: string`

    If set, all rules referencing this issuer reject token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this issuer.

  - `check_jti: boolean`

    Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

  - `created_at: string`

    When this issuer was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this issuer.

  - `issuer_url: string`

    The `iss` claim value. Incoming JWTs must match exactly.

  - `jwks: BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

    How signing keys are obtained for signature verification.

    - `beta_jwks_discovery: object`

      JWKS via the issuer's OIDC discovery document.

      - `type: "discovery"`

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

      - `discovery_base: optional string`

        Set when the discovery URL differs from `issuer_url`.

    - `beta_jwks_explicit_url: object`

      JWKS fetched from a fixed endpoint.

      - `type: "explicit_url"`

      - `url: string`

        JWKS endpoint.

        minLength: 1

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

    - `beta_jwks_inline: object`

      JWKS supplied directly; no network fetch.

      - `type: "inline"`

      - `keys: array of map[unknown]`

        Inline JWK objects.

        minItems: 1

  - `jwks_polling_disabled_at: string`

    If set, Anthropic's JWKS poller has paused polling for this issuer after repeated fetch failures. Re-enable by sending `jwks_polling_disabled: false` via the issuer update endpoint (POST) once the upstream JWKS endpoint is fixed. An OAuth caller cannot send this when the issuer backs a rule with any scope other than `workspace:developer` or `workspace:inference`; use a Console session.

    format: date-time

  - `max_jwt_lifetime_seconds: number`

    Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

  - `name: string`

    Admin-chosen slug identifier.

  - `poll_status: object`

    Live state of Anthropic's JWKS polling for this issuer. Populated on both single-issuer retrieval and list responses, including archived issuers. Typically null for inline-key issuers (no polling), or when poll status is temporarily unavailable or polling has not started yet.

    - `consecutive_failures: number`

      Consecutive fetch failures since the last success.

    - `last_fetched_at: string`

      When the last successful fetch completed.

      format: date-time

    - `next_poll_at: string`

      When the next fetch is scheduled. Null if paused.

      format: date-time

  - `updated_at: string`

    When this issuer was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this issuer.

#### Example

```bash
ant beta:organization:federation:issuers update \
  --api-key my-anthropic-api-key \
  --federation-issuer-id federation_issuer_id
```

##### Response (200)

```json
{
  "id": "fdis_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "check_jti": true,
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "issuer_url": "https://token.actions.githubusercontent.com",
  "jwks": {
    "type": "discovery",
    "ca_cert_pem": "ca_cert_pem",
    "discovery_base": "discovery_base"
  },
  "jwks_polling_disabled_at": "2019-12-27T18:11:19.117Z",
  "max_jwt_lifetime_seconds": 0,
  "name": "github-actions",
  "poll_status": {
    "consecutive_failures": 0,
    "last_fetched_at": "2019-12-27T18:11:19.117Z",
    "next_poll_at": "2019-12-27T18:11:19.117Z"
  },
  "type": "federation_issuer",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

### Archive Federation Issuer

`$ ant beta:organization:federation:issuers archive`

**POST** `/v1/organizations/federation_issuers/{federation_issuer_id}/archive`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Archive a federation issuer.

Idempotent; re-archiving returns the issuer with its original
`archived_at`. Rejected with 400 if any live (non-archived) federation
rule still references the issuer; archive those rules first (a rule's
issuer cannot be changed), or recreate them against another issuer.

#### Parameters

- `--federation-issuer-id: string` (path parameter)

  ID of the federation issuer to archive.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_issuer: object`

  Registered external OIDC identity provider.

  Records an external IdP the organization trusts for the RFC 7523
  jwt-bearer grant. The `issuer_url` must match the JWT `iss` claim exactly.

  - `type: "federation_issuer"`

  - `id: string`

    Tagged ID of the federation issuer.

  - `archived_at: string`

    If set, all rules referencing this issuer reject token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this issuer.

  - `check_jti: boolean`

    Whether the jwt-bearer exchange enforces JTI single-use (replay protection) for tokens from this issuer. Applies only to assertions carrying a `jti` claim; tokens without one are accepted without single-use enforcement.

  - `created_at: string`

    When this issuer was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this issuer.

  - `issuer_url: string`

    The `iss` claim value. Incoming JWTs must match exactly.

  - `jwks: BetaJWKSDiscovery or BetaJWKSExplicitURL or BetaJWKSInline`

    How signing keys are obtained for signature verification.

    - `beta_jwks_discovery: object`

      JWKS via the issuer's OIDC discovery document.

      - `type: "discovery"`

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

      - `discovery_base: optional string`

        Set when the discovery URL differs from `issuer_url`.

    - `beta_jwks_explicit_url: object`

      JWKS fetched from a fixed endpoint.

      - `type: "explicit_url"`

      - `url: string`

        JWKS endpoint.

        minLength: 1

      - `ca_cert_pem: optional string`

        Optional custom CA (PEM) for TLS verification of the JWKS fetch.

        maxLength: 8192

    - `beta_jwks_inline: object`

      JWKS supplied directly; no network fetch.

      - `type: "inline"`

      - `keys: array of map[unknown]`

        Inline JWK objects.

        minItems: 1

  - `jwks_polling_disabled_at: string`

    If set, Anthropic's JWKS poller has paused polling for this issuer after repeated fetch failures. Re-enable by sending `jwks_polling_disabled: false` via the issuer update endpoint (POST) once the upstream JWKS endpoint is fixed. An OAuth caller cannot send this when the issuer backs a rule with any scope other than `workspace:developer` or `workspace:inference`; use a Console session.

    format: date-time

  - `max_jwt_lifetime_seconds: number`

    Maximum allowed iat→exp spread for assertions from this issuer (1-176400 seconds, i.e. up to 49h). Assertions must carry both `iat` and `exp`; a missing `iat` is rejected.

  - `name: string`

    Admin-chosen slug identifier.

  - `poll_status: object`

    Live state of Anthropic's JWKS polling for this issuer. Populated on both single-issuer retrieval and list responses, including archived issuers. Typically null for inline-key issuers (no polling), or when poll status is temporarily unavailable or polling has not started yet.

    - `consecutive_failures: number`

      Consecutive fetch failures since the last success.

    - `last_fetched_at: string`

      When the last successful fetch completed.

      format: date-time

    - `next_poll_at: string`

      When the next fetch is scheduled. Null if paused.

      format: date-time

  - `updated_at: string`

    When this issuer was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this issuer.

#### Example

```bash
ant beta:organization:federation:issuers archive \
  --api-key my-anthropic-api-key \
  --federation-issuer-id federation_issuer_id
```

##### Response (200)

```json
{
  "id": "fdis_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "check_jti": true,
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "issuer_url": "https://token.actions.githubusercontent.com",
  "jwks": {
    "type": "discovery",
    "ca_cert_pem": "ca_cert_pem",
    "discovery_base": "discovery_base"
  },
  "jwks_polling_disabled_at": "2019-12-27T18:11:19.117Z",
  "max_jwt_lifetime_seconds": 0,
  "name": "github-actions",
  "poll_status": {
    "consecutive_failures": 0,
    "last_fetched_at": "2019-12-27T18:11:19.117Z",
    "next_poll_at": "2019-12-27T18:11:19.117Z"
  },
  "type": "federation_issuer",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

## Organization › Federation › Rules

### Create Federation Rule

`$ ant beta:organization:federation:rules create`

**POST** `/v1/organizations/federation_rules`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Create a federation rule owned by your organization.

The referenced issuer and the target service account must already exist
in the same organization; invalid references are rejected with a 400
error. The workspace reference is validated. Membership is not checked
at rule creation: token exchange resolves a single enabled workspace per
call and is rejected unless the target service account is a member of
that workspace (it is implicitly a member of the default workspace).
Rules on well-known shared issuers (GitHub Actions, GitLab, Buildkite,
Terraform Cloud, Google) must constrain tenant identity via an
identity-bearing claim, a tenant-pinning subject prefix (such as
`repo:YOUR_ORG/...`), or a CEL condition referencing one of those
identity claims (e.g. `claims.repository_owner`). OAuth callers may only
manage rules whose `oauth_scope` is `workspace:developer` or
`workspace:inference`; other scopes require a Console session.

#### Parameters

- `--issuer-id: string`

  Tagged ID of the federation issuer.

- `--match: object`

  Conditions the verified JWT must satisfy for this rule to apply. At least one of `subject_prefix` (other than a wildcard-only value like `*`), `claims`, or `condition` is required; `audience` alone is not sufficient.

- `--name: string`

  Slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--oauth-scope: string`

  Space-separated OAuth scopes. OAuth callers may only set `workspace:developer` or `workspace:inference`; other scopes (such as `org:admin`) require a Console session.

  minLength: 1

- `--target: object`

  Identity that tokens minted via this rule act as. Currently always a `service_account` target.

- `--applies-to-all-workspaces: optional boolean`

  When true, enable this rule for every workspace in the org (including workspaces created later).

- `--attributes: optional map[string]`

  CEL expressions `{name: expr}` extracting named values from claims. Not yet supported; any non-empty value is rejected with 400.

- `--description: optional string`

  Optional free-text description.

  maxLength: 2000

- `--token-lifetime-seconds: optional number`

  Lifetime in seconds for access tokens minted via this rule (60-86400). Defaults to 3600 (1h). Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  minimum: 60, maximum: 86400

- `--workspace-id: optional string`

  Tagged ID of the workspace to enable this rule for. Required unless `applies_to_all_workspaces` is true. Additional workspaces can be added via the `/federation_rules/{federation_rule_id}/workspaces` sub-resource.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `attributes: map[string]`

    CEL expressions extracting named values from claims. Not yet supported; always null.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_id: string`

    Legacy single-workspace binding. Prefer `workspace_ids` and the `/federation_rules/{federation_rule_id}/workspaces` sub-resource for managing workspace enablement.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

#### Example

```bash
ant beta:organization:federation:rules create \
  --api-key my-anthropic-api-key \
  --issuer-id issuer_id \
  --match '{}' \
  --name x \
  --oauth-scope x \
  --target '{service_account_id: svac_01SDCCSbTxrXDpWc1phhtcfK, type: service_account}'
```

##### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

### List Federation Rules

`$ ant beta:organization:federation:rules list`

**GET** `/v1/organizations/federation_rules`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List federation rules in your organization.

Optionally filter by issuer with `issuer_id`. Archived rules are excluded
unless `include_archived=true`.

#### Parameters

- `--include-archived: optional boolean` (query parameter)

  Include archived resources. Defaults to false.

- `--issuer-id: optional string` (query parameter)

  Filter to rules referencing this federation issuer.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaFederationRuleListResponse: object`

  - `data: array of BetaFederationRule`

    - `type: "federation_rule"`

    - `id: string`

      Tagged ID of the federation rule.

    - `applies_to_all_workspaces: boolean`

      When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

    - `archived_at: string`

      If set, this rule is archived and rejects token exchange.

      format: date-time

    - `archived_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

    - `attributes: map[string]`

      CEL expressions extracting named values from claims. Not yet supported; always null.

    - `created_at: string`

      When this rule was created.

      format: date-time

    - `created_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that created this rule.

    - `description: string`

      Optional free-text description.

    - `issuer_id: string`

      Tagged ID of the issuer whose tokens this rule accepts.

    - `issuer_name: string`

      Issuer's display name at read time.

    - `match: object`

      Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

      - `audience: optional string`

        Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

        maxLength: 1024

      - `claims: optional map[string]`

        Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

      - `condition: optional string`

        CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

        maxLength: 4096

      - `subject_prefix: optional string`

        Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

        maxLength: 1024

    - `name: string`

      Admin-chosen slug identifier.

    - `oauth_scope: string`

      Space-separated OAuth scopes granted on the minted token.

    - `target: object`

      What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

      - `type: "service_account"`

      - `service_account_id: string`

        Tagged ID of the service account to mint tokens for.

      - `service_account_name: optional string`

        Service account's display name at read time. Ignored on writes.

    - `token_lifetime_seconds: number`

      Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

    - `updated_at: string`

      When this rule was last updated.

      format: date-time

    - `updated_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

    - `workspace_id: string`

      Legacy single-workspace binding. Prefer `workspace_ids` and the `/federation_rules/{federation_rule_id}/workspaces` sub-resource for managing workspace enablement.

    - `workspace_ids: array of string`

      Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results.

#### Example

```bash
ant beta:organization:federation:rules list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
      "applies_to_all_workspaces": true,
      "archived_at": "2019-12-27T18:11:19.117Z",
      "archived_by_actor_id": "archived_by_actor_id",
      "attributes": {
        "foo": "string"
      },
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by_actor_id": "created_by_actor_id",
      "description": "description",
      "issuer_id": "issuer_id",
      "issuer_name": "issuer_name",
      "match": {
        "audience": "audience",
        "claims": {
          "foo": "string"
        },
        "condition": "condition",
        "subject_prefix": "subject_prefix"
      },
      "name": "prod-deploy-pipeline",
      "oauth_scope": "oauth_scope",
      "target": {
        "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
        "type": "service_account",
        "service_account_name": "service_account_name"
      },
      "token_lifetime_seconds": 0,
      "type": "federation_rule",
      "updated_at": "2024-10-30T23:58:27.427722Z",
      "updated_by_actor_id": "updated_by_actor_id",
      "workspace_id": "workspace_id",
      "workspace_ids": [
        "string"
      ]
    }
  ],
  "next_page": "next_page"
}
```

### Get Federation Rule

`$ ant beta:organization:federation:rules retrieve`

**GET** `/v1/organizations/federation_rules/{federation_rule_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Retrieve a federation rule by its ID (`fdrl_...`).

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `attributes: map[string]`

    CEL expressions extracting named values from claims. Not yet supported; always null.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_id: string`

    Legacy single-workspace binding. Prefer `workspace_ids` and the `/federation_rules/{federation_rule_id}/workspaces` sub-resource for managing workspace enablement.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

#### Example

```bash
ant beta:organization:federation:rules retrieve \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

##### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

### Update Federation Rule

`$ ant beta:organization:federation:rules update`

**POST** `/v1/organizations/federation_rules/{federation_rule_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Partially update a federation rule.

`issuer_id` is immutable. `match` and `target` are replaced as whole
objects when set. Referenced service accounts and workspaces must exist
in your organization; invalid references are rejected with a 400 error.
Archived rules cannot be updated; this returns 400. Create a new rule
instead. Rules on well-known shared issuers (GitHub Actions, GitLab,
Buildkite, Terraform Cloud, Google) must constrain tenant identity via
an identity-bearing claim, a tenant-pinning subject prefix (such as
`repo:YOUR_ORG/...`), or a CEL condition referencing one of those
identity claims (e.g. `claims.repository_owner`). On these issuers the
requirement is re-checked on every update; if an existing rule's stored
match does not yet constrain tenant identity, any update (even a rename
or description change) must also supply a conforming `match` in the same
request. OAuth callers may only manage rules whose `oauth_scope` is
`workspace:developer` or `workspace:inference`; other scopes require a
Console session.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule to update.

- `--applies-to-all-workspaces: optional boolean`

  When true, enables this rule for every workspace in the org (including workspaces created later). Setting `false` is rejected with 400 if no workspace would remain enabled; a rule with only a legacy `workspace_id` binding continues to mint.

- `--attributes: optional map[string]`

  Replaces the CEL expressions `{name: expr}` extracting named values from claims. Send null to clear them. Not yet supported; any non-empty value is rejected with 400.

- `--description: optional string`

  Replaces the description. Omit to leave unchanged; send `null` to clear (the field is stored as an empty string).

  maxLength: 2000

- `--match: optional object`

  Replaces the entire match object. All populated matcher fields must pass.

- `--name: optional string`

  Replaces the slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--oauth-scope: optional string`

  Replaces the space-separated OAuth scopes granted on minted tokens. OAuth callers may only set `workspace:developer` or `workspace:inference`; other scopes (such as `org:admin`) require a Console session.

  minLength: 1

- `--target: optional object`

  Replaces the entire target object. Currently always a `service_account` target.

- `--token-lifetime-seconds: optional number`

  Replaces the lifetime in seconds for access tokens minted via this rule (60-86400). Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  minimum: 60, maximum: 86400

- `--workspace-id: optional string`

  Replaces the existing single workspace enablement (the previous one is removed). Rejected with 400 if the rule is enabled for more than one workspace; use the `/federation_rules/{federation_rule_id}/workspaces` sub-resource instead.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `attributes: map[string]`

    CEL expressions extracting named values from claims. Not yet supported; always null.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_id: string`

    Legacy single-workspace binding. Prefer `workspace_ids` and the `/federation_rules/{federation_rule_id}/workspaces` sub-resource for managing workspace enablement.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

#### Example

```bash
ant beta:organization:federation:rules update \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

##### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

### Archive Federation Rule

`$ ant beta:organization:federation:rules archive`

**POST** `/v1/organizations/federation_rules/{federation_rule_id}/archive`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Archive a federation rule.

Token exchange through this rule stops immediately. Idempotent;
re-archiving returns the rule with its original `archived_at`. Archiving
clears the rule's workspace targeting (`workspace_id` and
`workspace_ids` are emptied). Tokens already minted before archive
remain valid until they expire. OAuth callers may only manage rules
whose `oauth_scope` is `workspace:developer` or `workspace:inference`;
other scopes require a Console session.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule to archive.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `attributes: map[string]`

    CEL expressions extracting named values from claims. Not yet supported; always null.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_id: string`

    Legacy single-workspace binding. Prefer `workspace_ids` and the `/federation_rules/{federation_rule_id}/workspaces` sub-resource for managing workspace enablement.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

#### Example

```bash
ant beta:organization:federation:rules archive \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

##### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

## Organization › Federation › Rules › Workspaces

### Add Federation Rule Workspace

`$ ant beta:organization:federation:rules:workspaces add`

**POST** `/v1/organizations/federation_rules/{federation_rule_id}/workspaces`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Enable a federation rule for a workspace.

Idempotent; re-enabling returns the existing enablement. The rule and
workspace must both belong to your organization. Membership of the
rule's target service account in this workspace is not checked at
enablement: token exchange into this workspace is rejected unless the
target is a member (it is implicitly a member of the default workspace).
Archived rules are rejected with 400. OAuth callers may only manage rules
whose `oauth_scope` is `workspace:developer` or `workspace:inference`;
other scopes require a Console session.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--workspace-id: string`

  Tagged ID of the workspace to enable this rule for.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_federation_rule_workspace: object`

  - `type: "federation_rule_workspace"`

  - `created_at: string`

    When this workspace was enabled for the rule.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_...` or `svac_...`) of the actor that enabled this workspace for the rule, if known.

  - `federation_rule_id: string`

    Tagged ID of the federation rule.

  - `workspace_id: string`

    Tagged ID of the workspace this rule is enabled for.

  - `workspace_name: string`

    Workspace display name. Populated when listing; null in the enable response.

#### Example

```bash
ant beta:organization:federation:rules:workspaces add \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "federation_rule_id": "federation_rule_id",
  "type": "federation_rule_workspace",
  "workspace_id": "workspace_id",
  "workspace_name": "workspace_name"
}
```

### List Federation Rule Workspaces

`$ ant beta:organization:federation:rules:workspaces list`

**GET** `/v1/organizations/federation_rules/{federation_rule_id}/workspaces`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List workspaces where this federation rule is enabled.

Returns all workspace enablements in a single response; the `limit` and
`page` parameters are accepted but have no effect, and `next_page` is
always `null`. Returns explicit per-workspace enablements only; for
rules with `applies_to_all_workspaces` or a legacy single
`workspace_id`, check those fields on the rule itself.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaFederationRuleWorkspaceListResponse: object`

  - `data: array of BetaFederationRuleWorkspace`

    - `type: "federation_rule_workspace"`

    - `created_at: string`

      When this workspace was enabled for the rule.

      format: date-time

    - `created_by_actor_id: string`

      Tagged ID (`user_...` or `svac_...`) of the actor that enabled this workspace for the rule, if known.

    - `federation_rule_id: string`

      Tagged ID of the federation rule.

    - `workspace_id: string`

      Tagged ID of the workspace this rule is enabled for.

    - `workspace_name: string`

      Workspace display name. Populated when listing; null in the enable response.

  - `next_page: string`

    Opaque cursor for the next page; null when there are no more results.

#### Example

```bash
ant beta:organization:federation:rules:workspaces list \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

##### Response (200)

```json
{
  "data": [
    {
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by_actor_id": "created_by_actor_id",
      "federation_rule_id": "federation_rule_id",
      "type": "federation_rule_workspace",
      "workspace_id": "workspace_id",
      "workspace_name": "workspace_name"
    }
  ],
  "next_page": "next_page"
}
```

### Remove Federation Rule Workspace

`$ ant beta:organization:federation:rules:workspaces remove`

**DELETE** `/v1/organizations/federation_rules/{federation_rule_id}/workspaces/{workspace_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Disable a federation rule for a workspace.

Idempotent; succeeds even if the enablement was already removed. OAuth
callers may only manage rules whose `oauth_scope` is
`workspace:developer` or `workspace:inference`; other scopes require a
Console session.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--workspace-id: string` (path parameter)

  ID of the workspace to disable for.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaOrganizationFederationRuleWorkspaceRemoveResponse: object`

  - `type: "federation_rule_workspace_deleted"`

  - `federation_rule_id: string`

    Tagged ID of the federation rule.

  - `workspace_id: string`

    Tagged ID of the workspace named in the delete request. Removal is idempotent.

#### Example

```bash
ant beta:organization:federation:rules:workspaces remove \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "federation_rule_id": "federation_rule_id",
  "type": "federation_rule_workspace_deleted",
  "workspace_id": "workspace_id"
}
```

## Organization › Invites

### Create Invite

`$ ant beta:organization:invites create`

**POST** `/v1/organizations/invites`

Invite a user to join the organization by email.

On plans that draw members from a finite pool of purchased seats, the invite automatically consumes a seat from the lowest tier with availability; there is no seat-tier parameter. When no seat is free the request fails with a 400 error rather than purchasing a seat.

#### Parameters

- `--email: string`

  Email of the User.

  format: email

- `--role: "billing" or "claude_code_user" or "developer" or 2 more`

  Role for the invited User.

  The accepted values depend on the organization type. Console and API organizations accept `user`, `developer`, `billing`, and `claude_code_user`; `admin` cannot be assigned through the API. Claude Enterprise organizations accept `user` and `managed`.

- `--rbac-group-id: optional array of string`

  RBAC group IDs to assign to the User when the Invite is accepted. A non-empty array is accepted only for a Claude Enterprise organization with RBAC groups, and requires the key to carry the `write:rbac_groups` scope.

  maxItems: 100

#### Returns

- `beta_organization_invite: object`

  - `type: "invite"`

    Object type.

    For Invites, this is always `"invite"`.

  - `id: string`

    ID of the Invite.

  - `accepted_at: string`

    RFC 3339 datetime string indicating when the Invite was accepted, or null.

    format: date-time

  - `email: string`

    Email of the User being invited.

  - `expires_at: string`

    RFC 3339 datetime string indicating when the Invite expires.

    format: date-time

  - `invited_at: string`

    RFC 3339 datetime string indicating when the Invite was created.

    format: date-time

  - `rbac_group_ids: array of string`

    RBAC group IDs recorded on the Invite (Claude Enterprise organizations), to be assigned to the User when the Invite is accepted. `[]` when none.

  - `role: "admin" or "billing" or "claude_code_user" or 6 more`

    Organization role of the User.

    - `"admin"`

    - `"billing"`

    - `"claude_code_user"`

    - `"developer"`

    - `"managed"`

    - `"membership_admin"`

    - `"owner"`

    - `"primary_owner"`

    - `"user"`

  - `status: "accepted" or "deleted" or "expired" or "pending"`

    Status of the Invite.

    - `"accepted"`

    - `"deleted"`

    - `"expired"`

    - `"pending"`

#### Example

```bash
ant beta:organization:invites create \
  --api-key my-anthropic-api-key \
  --email user@emaildomain.com \
  --role user
```

##### Response (200)

```json
{
  "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
  "accepted_at": "2019-12-27T18:11:19.117Z",
  "email": "user@emaildomain.com",
  "expires_at": "2024-11-20T23:58:27.427722Z",
  "invited_at": "2024-10-30T23:58:27.427722Z",
  "rbac_group_ids": [
    "string"
  ],
  "role": "admin",
  "status": "pending",
  "type": "invite"
}
```

### List Invites

`$ ant beta:organization:invites list`

**GET** `/v1/organizations/invites`

List the organization's invites.

#### Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--email: optional string` (query parameter)

  Filter by the email address the Invite was sent to. Matches the same way as the Users list's `email` filter (normalized, case-insensitive).

  format: email

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--role: optional array of string` (query parameter)

  Filter to items whose `role` equals one of the supplied values. Repeatable; values are OR'ed together.

  Accepted values depend on the organization type: Console and API organizations accept `user`, `developer`, `billing`, `admin`, and `claude_code_user`; Claude Enterprise organizations accept `user`, `owner`, `primary_owner`, `membership_admin`, and `managed`.

- `--status: optional array of "accepted" or "expired" or "pending"` (query parameter)

  Filter by Invite status. Repeatable; values are OR'ed together. Omit to return `pending`, `accepted`, and `expired` Invites alike.

#### Returns

- `BetaListResponse_InviteSchema_: object`

  - `data: array of BetaOrganizationInvite`

    - `type: "invite"`

      Object type.

      For Invites, this is always `"invite"`.

    - `id: string`

      ID of the Invite.

    - `accepted_at: string`

      RFC 3339 datetime string indicating when the Invite was accepted, or null.

      format: date-time

    - `email: string`

      Email of the User being invited.

    - `expires_at: string`

      RFC 3339 datetime string indicating when the Invite expires.

      format: date-time

    - `invited_at: string`

      RFC 3339 datetime string indicating when the Invite was created.

      format: date-time

    - `rbac_group_ids: array of string`

      RBAC group IDs recorded on the Invite (Claude Enterprise organizations), to be assigned to the User when the Invite is accepted. `[]` when none.

    - `role: "admin" or "billing" or "claude_code_user" or 6 more`

      Organization role of the User.

      - `"admin"`

      - `"billing"`

      - `"claude_code_user"`

      - `"developer"`

      - `"managed"`

      - `"membership_admin"`

      - `"owner"`

      - `"primary_owner"`

      - `"user"`

    - `status: "accepted" or "deleted" or "expired" or "pending"`

      Status of the Invite.

      - `"accepted"`

      - `"deleted"`

      - `"expired"`

      - `"pending"`

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

#### Example

```bash
ant beta:organization:invites list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
      "accepted_at": "2019-12-27T18:11:19.117Z",
      "email": "user@emaildomain.com",
      "expires_at": "2024-11-20T23:58:27.427722Z",
      "invited_at": "2024-10-30T23:58:27.427722Z",
      "rbac_group_ids": [
        "string"
      ],
      "role": "admin",
      "status": "pending",
      "type": "invite"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```

### Get Invite

`$ ant beta:organization:invites retrieve`

**GET** `/v1/organizations/invites/{invite_id}`

Retrieve an invite by ID.

#### Parameters

- `--invite-id: string` (path parameter)

  ID of the Invite.

#### Returns

- `beta_organization_invite: object`

  - `type: "invite"`

    Object type.

    For Invites, this is always `"invite"`.

  - `id: string`

    ID of the Invite.

  - `accepted_at: string`

    RFC 3339 datetime string indicating when the Invite was accepted, or null.

    format: date-time

  - `email: string`

    Email of the User being invited.

  - `expires_at: string`

    RFC 3339 datetime string indicating when the Invite expires.

    format: date-time

  - `invited_at: string`

    RFC 3339 datetime string indicating when the Invite was created.

    format: date-time

  - `rbac_group_ids: array of string`

    RBAC group IDs recorded on the Invite (Claude Enterprise organizations), to be assigned to the User when the Invite is accepted. `[]` when none.

  - `role: "admin" or "billing" or "claude_code_user" or 6 more`

    Organization role of the User.

    - `"admin"`

    - `"billing"`

    - `"claude_code_user"`

    - `"developer"`

    - `"managed"`

    - `"membership_admin"`

    - `"owner"`

    - `"primary_owner"`

    - `"user"`

  - `status: "accepted" or "deleted" or "expired" or "pending"`

    Status of the Invite.

    - `"accepted"`

    - `"deleted"`

    - `"expired"`

    - `"pending"`

#### Example

```bash
ant beta:organization:invites retrieve \
  --api-key my-anthropic-api-key \
  --invite-id invite_id
```

##### Response (200)

```json
{
  "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
  "accepted_at": "2019-12-27T18:11:19.117Z",
  "email": "user@emaildomain.com",
  "expires_at": "2024-11-20T23:58:27.427722Z",
  "invited_at": "2024-10-30T23:58:27.427722Z",
  "rbac_group_ids": [
    "string"
  ],
  "role": "admin",
  "status": "pending",
  "type": "invite"
}
```

### Delete Invite

`$ ant beta:organization:invites delete`

**DELETE** `/v1/organizations/invites/{invite_id}`

Delete a pending invite.

#### Parameters

- `--invite-id: string` (path parameter)

  ID of the Invite.

#### Returns

- `BetaOrganizationInviteDeleteResponse: object`

  - `type: "invite_deleted"`

    Deleted object type.

    For Invites, this is always `"invite_deleted"`.

  - `id: string`

    ID of the Invite.

#### Example

```bash
ant beta:organization:invites delete \
  --api-key my-anthropic-api-key \
  --invite-id invite_id
```

##### Response (200)

```json
{
  "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
  "type": "invite_deleted"
}
```

## Organization › Service Accounts

### Create Service Account

`$ ant beta:organization:service-accounts create`

**POST** `/v1/organizations/service_accounts`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Create a service account.

A service account is a named workload identity that federation rules
target. `organization_role` is `developer` (default) or `admin`; a rule
may only be created or retargeted to grant `org:admin` scope when the
target's `organization_role` is `admin`. Creating an `admin`-role service
account requires an interactive credential (a user OAuth token or a
Console session) — a workload may only create `developer`-role service
accounts.

#### Parameters

- `--name: string`

  Slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--description: optional string`

  Optional free-text description.

  maxLength: 2000

- `--organization-role: optional "admin" or "developer"`

  Org-level role. Defaults to `developer`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account: object`

  Named non-human identity within the caller's organization.

  A service account is a pure identity: name + org. Authorization lives on
  whatever references it (federation rules).

  - `type: "service_account"`

  - `id: string`

    Tagged ID of the service account.

  - `archived_at: string`

    If set, this service account is archived.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this service account.

  - `created_at: string`

    When this service account was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this service account.

  - `description: string`

    Optional free-text description.

  - `name: string`

    Admin-chosen slug identifier.

  - `organization_role: "admin" or "developer"`

    Org-level role. A federation rule may only be created or retargeted to grant `org:admin` scope when this is `admin`. A rule granting `org:admin` whose target is later demoted to `developer` is rejected at token exchange. Rules granting `org:admin` are managed in the Console.

    - `"admin"`

    - `"developer"`

  - `updated_at: string`

    When this service account was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this service account.

#### Example

```bash
ant beta:organization:service-accounts create \
  --api-key my-anthropic-api-key \
  --name ci-deploy-bot
```

##### Response (200)

```json
{
  "id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "name": "ci-deploy-bot",
  "organization_role": "admin",
  "type": "service_account",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

### List Service Accounts

`$ ant beta:organization:service-accounts list`

**GET** `/v1/organizations/service_accounts`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List service accounts in the caller's organization.

Results are ordered by creation time, newest first. Use `limit` and the
`next_page` cursor to paginate; set `include_archived=true` to include
archived service accounts.

#### Parameters

- `--include-archived: optional boolean` (query parameter)

  Include archived resources. Defaults to false.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaServiceAccountListResponse: object`

  - `data: array of BetaServiceAccount`

    - `type: "service_account"`

    - `id: string`

      Tagged ID of the service account.

    - `archived_at: string`

      If set, this service account is archived.

      format: date-time

    - `archived_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that archived this service account.

    - `created_at: string`

      When this service account was created.

      format: date-time

    - `created_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that created this service account.

    - `description: string`

      Optional free-text description.

    - `name: string`

      Admin-chosen slug identifier.

    - `organization_role: "admin" or "developer"`

      Org-level role. A federation rule may only be created or retargeted to grant `org:admin` scope when this is `admin`. A rule granting `org:admin` whose target is later demoted to `developer` is rejected at token exchange. Rules granting `org:admin` are managed in the Console.

      - `"admin"`

      - `"developer"`

    - `updated_at: string`

      When this service account was last updated.

      format: date-time

    - `updated_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that last updated this service account.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results.

#### Example

```bash
ant beta:organization:service-accounts list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
      "archived_at": "2019-12-27T18:11:19.117Z",
      "archived_by_actor_id": "archived_by_actor_id",
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by_actor_id": "created_by_actor_id",
      "description": "description",
      "name": "ci-deploy-bot",
      "organization_role": "admin",
      "type": "service_account",
      "updated_at": "2024-10-30T23:58:27.427722Z",
      "updated_by_actor_id": "updated_by_actor_id"
    }
  ],
  "next_page": "next_page"
}
```

### Get Service Account

`$ ant beta:organization:service-accounts retrieve`

**GET** `/v1/organizations/service_accounts/{service_account_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Retrieve a service account by its ID (`svac_...`).

#### Parameters

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account: object`

  Named non-human identity within the caller's organization.

  A service account is a pure identity: name + org. Authorization lives on
  whatever references it (federation rules).

  - `type: "service_account"`

  - `id: string`

    Tagged ID of the service account.

  - `archived_at: string`

    If set, this service account is archived.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this service account.

  - `created_at: string`

    When this service account was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this service account.

  - `description: string`

    Optional free-text description.

  - `name: string`

    Admin-chosen slug identifier.

  - `organization_role: "admin" or "developer"`

    Org-level role. A federation rule may only be created or retargeted to grant `org:admin` scope when this is `admin`. A rule granting `org:admin` whose target is later demoted to `developer` is rejected at token exchange. Rules granting `org:admin` are managed in the Console.

    - `"admin"`

    - `"developer"`

  - `updated_at: string`

    When this service account was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this service account.

#### Example

```bash
ant beta:organization:service-accounts retrieve \
  --api-key my-anthropic-api-key \
  --service-account-id service_account_id
```

##### Response (200)

```json
{
  "id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "name": "ci-deploy-bot",
  "organization_role": "admin",
  "type": "service_account",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

### Update Service Account

`$ ant beta:organization:service-accounts update`

**POST** `/v1/organizations/service_accounts/{service_account_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Update a service account.

Only `description` and `organization_role` are mutable; `name` cannot be
changed. Archived service accounts cannot be updated; this returns 400.
Setting `organization_role` to `admin` (even when unchanged) requires an
interactive credential (a user OAuth token or a Console session).

#### Parameters

- `--service-account-id: string` (path parameter)

  ID of the service account to update.

- `--description: optional string`

  Replaces the description. Omit to leave unchanged; send `null` to clear (the field is stored as an empty string).

  maxLength: 2000

- `--organization-role: optional "admin" or "developer"`

  Replaces the org-level role. Omit or send `null` to leave unchanged.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account: object`

  Named non-human identity within the caller's organization.

  A service account is a pure identity: name + org. Authorization lives on
  whatever references it (federation rules).

  - `type: "service_account"`

  - `id: string`

    Tagged ID of the service account.

  - `archived_at: string`

    If set, this service account is archived.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this service account.

  - `created_at: string`

    When this service account was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this service account.

  - `description: string`

    Optional free-text description.

  - `name: string`

    Admin-chosen slug identifier.

  - `organization_role: "admin" or "developer"`

    Org-level role. A federation rule may only be created or retargeted to grant `org:admin` scope when this is `admin`. A rule granting `org:admin` whose target is later demoted to `developer` is rejected at token exchange. Rules granting `org:admin` are managed in the Console.

    - `"admin"`

    - `"developer"`

  - `updated_at: string`

    When this service account was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this service account.

#### Example

```bash
ant beta:organization:service-accounts update \
  --api-key my-anthropic-api-key \
  --service-account-id service_account_id
```

##### Response (200)

```json
{
  "id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "name": "ci-deploy-bot",
  "organization_role": "admin",
  "type": "service_account",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

### Archive Service Account

`$ ant beta:organization:service-accounts archive`

**POST** `/v1/organizations/service_accounts/{service_account_id}/archive`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Archive a service account.

Idempotent; re-archiving returns the service account with its original
`archived_at`. Rejected with 400 if any live (non-archived) federation
rule still targets this service account, same as issuer archival; archive
those rules first or change their target to another service account.

#### Parameters

- `--service-account-id: string` (path parameter)

  ID of the service account to archive.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account: object`

  Named non-human identity within the caller's organization.

  A service account is a pure identity: name + org. Authorization lives on
  whatever references it (federation rules).

  - `type: "service_account"`

  - `id: string`

    Tagged ID of the service account.

  - `archived_at: string`

    If set, this service account is archived.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this service account.

  - `created_at: string`

    When this service account was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this service account.

  - `description: string`

    Optional free-text description.

  - `name: string`

    Admin-chosen slug identifier.

  - `organization_role: "admin" or "developer"`

    Org-level role. A federation rule may only be created or retargeted to grant `org:admin` scope when this is `admin`. A rule granting `org:admin` whose target is later demoted to `developer` is rejected at token exchange. Rules granting `org:admin` are managed in the Console.

    - `"admin"`

    - `"developer"`

  - `updated_at: string`

    When this service account was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this service account.

#### Example

```bash
ant beta:organization:service-accounts archive \
  --api-key my-anthropic-api-key \
  --service-account-id service_account_id
```

##### Response (200)

```json
{
  "id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "name": "ci-deploy-bot",
  "organization_role": "admin",
  "type": "service_account",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id"
}
```

## Organization › Service Accounts › Workspaces

### Add Workspace To Service Account

`$ ant beta:organization:service-accounts:workspaces add`

**POST** `/v1/organizations/service_accounts/{service_account_id}/workspaces`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Add a service account to a workspace with the given `workspace_role`.

Mirror of `POST /workspaces/{workspace_id}/service_accounts`, addressed
from the service-account side; both create the same membership. If the
service account is already an explicit member of the workspace, its
`workspace_role` is replaced with the value supplied here. Archived
workspaces return 400. Archived service accounts cannot be added and are
rejected.

#### Parameters

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--workspace-id: string`

  Tagged workspace ID to add the service account to.

- `--workspace-role: "workspace_admin" or "workspace_developer" or "workspace_restricted_developer" or "workspace_user"`

  Role to assign to the service account in this workspace.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account_workspace_member: object`

  - `type: "service_account_workspace_member"`

  - `created_by_actor_id: string`

    Tagged ID (`user_...`/`svac_...`) of the actor who created this membership.

  - `implicit: boolean`

    True when this is the implicit default-workspace membership every service account has when no explicit membership exists. Implicit memberships have role `workspace_user` and cannot be removed.

  - `service_account_id: string`

    Tagged service account ID (`svac_...`).

  - `workspace_id: string`

    Tagged workspace ID (`wrkspc_...`).

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the service account in this workspace. Service accounts cannot hold the `workspace_billing` role.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:service-accounts:workspaces add \
  --api-key my-anthropic-api-key \
  --service-account-id service_account_id \
  --workspace-id workspace_id \
  --workspace-role workspace_admin
```

##### Response (200)

```json
{
  "created_by_actor_id": "created_by_actor_id",
  "implicit": true,
  "service_account_id": "service_account_id",
  "type": "service_account_workspace_member",
  "workspace_id": "workspace_id",
  "workspace_role": "workspace_admin"
}
```

### List Workspaces For Service Account

`$ ant beta:organization:service-accounts:workspaces list`

**GET** `/v1/organizations/service_accounts/{service_account_id}/workspaces`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List the workspaces a service account is a member of.

Each entry includes the service account's `workspace_role` in that
workspace. Use `limit` and the `next_page` cursor to paginate. When the
service account has no explicit default-workspace membership, the
implicit (`implicit: true`) membership is returned as the first entry on
the first page; with `limit=1` the first page may return up to 2 entries
(the implicit entry plus one explicit membership) so a pagination cursor
can be derived. Memberships are returned only while
the service account is active. Without a `page` cursor, an archived
service account returns an empty list. A `page` cursor that does not
match an active membership returns a 400 invalid-request error. A cursor
stops matching when the membership is removed, the workspace is deleted,
or the service account is archived. Restart pagination from the first
page to recover.

#### Parameters

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaServiceAccountWorkspaceMemberListResponse: object`

  - `data: array of BetaServiceAccountWorkspaceMember`

    - `type: "service_account_workspace_member"`

    - `created_by_actor_id: string`

      Tagged ID (`user_...`/`svac_...`) of the actor who created this membership.

    - `implicit: boolean`

      True when this is the implicit default-workspace membership every service account has when no explicit membership exists. Implicit memberships have role `workspace_user` and cannot be removed.

    - `service_account_id: string`

      Tagged service account ID (`svac_...`).

    - `workspace_id: string`

      Tagged workspace ID (`wrkspc_...`).

    - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

      Role of the service account in this workspace. Service accounts cannot hold the `workspace_billing` role.

      - `"workspace_admin"`

      - `"workspace_billing"`

      - `"workspace_developer"`

      - `"workspace_restricted_developer"`

      - `"workspace_user"`

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results.

#### Example

```bash
ant beta:organization:service-accounts:workspaces list \
  --api-key my-anthropic-api-key \
  --service-account-id service_account_id
```

##### Response (200)

```json
{
  "data": [
    {
      "created_by_actor_id": "created_by_actor_id",
      "implicit": true,
      "service_account_id": "service_account_id",
      "type": "service_account_workspace_member",
      "workspace_id": "workspace_id",
      "workspace_role": "workspace_admin"
    }
  ],
  "next_page": "next_page"
}
```

### Remove Workspace From Service Account

`$ ant beta:organization:service-accounts:workspaces remove`

**DELETE** `/v1/organizations/service_accounts/{service_account_id}/workspaces/{workspace_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Remove a service account from a workspace.

Mirror of `DELETE /workspaces/{workspace_id}/service_accounts/{service_account_id}`,
addressed from the service-account side. Removal is idempotent (returns
200 even if the membership was already removed). A DELETE against the
implicit default-workspace membership returns 200 but is a no-op and the
membership persists; deleting an explicit default-workspace row reverts
to the implicit `workspace_user` membership. Archived workspaces return
400.

#### Parameters

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--workspace-id: string` (path parameter)

  ID of the workspace.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaOrganizationServiceAccountWorkspaceRemoveResponse: object`

  - `type: "service_account_workspace_member_deleted"`

  - `service_account_id: string`

    Tagged service account ID (`svac_...`) named in the delete request. Removal is idempotent; see the endpoint description for the implicit-membership no-op.

  - `workspace_id: string`

    Tagged workspace ID (`wrkspc_...`) named in the delete request.

#### Example

```bash
ant beta:organization:service-accounts:workspaces remove \
  --api-key my-anthropic-api-key \
  --service-account-id service_account_id \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "service_account_id": "service_account_id",
  "type": "service_account_workspace_member_deleted",
  "workspace_id": "workspace_id"
}
```

## Organization › Users

### List Users

`$ ant beta:organization:users list`

**GET** `/v1/organizations/users`

List the organization's members.

#### Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--email: optional string` (query parameter)

  Filter by user email.

  format: email

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--role: optional array of string` (query parameter)

  Filter to items whose `role` equals one of the supplied values. Repeatable; values are OR'ed together.

  Accepted values depend on the organization type: Console and API organizations accept `user`, `developer`, `billing`, `admin`, and `claude_code_user`; Claude Enterprise organizations accept `user`, `owner`, `primary_owner`, `membership_admin`, and `managed`.

#### Returns

- `BetaListResponse_User_: object`

  - `data: array of BetaOrganizationUser`

    - `type: "user"`

      Object type.

      For Users, this is always `"user"`.

    - `id: string`

      ID of the User.

    - `added_at: string`

      RFC 3339 datetime string indicating when the User joined the Organization.

      format: date-time

    - `email: string`

      Email of the User.

    - `name: string`

      Name of the User.

    - `role: "admin" or "billing" or "claude_code_user" or 6 more`

      Organization role of the User.

      - `"admin"`

      - `"billing"`

      - `"claude_code_user"`

      - `"developer"`

      - `"managed"`

      - `"membership_admin"`

      - `"owner"`

      - `"primary_owner"`

      - `"user"`

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

#### Example

```bash
ant beta:organization:users list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
      "added_at": "2024-10-30T23:58:27.427722Z",
      "email": "user@emaildomain.com",
      "name": "Jane Doe",
      "role": "admin",
      "type": "user"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```

### Get User

`$ ant beta:organization:users retrieve`

**GET** `/v1/organizations/users/{user_id}`

Retrieve a member of the organization by user ID.

#### Parameters

- `--user-id: string` (path parameter)

  ID of the User.

#### Returns

- `beta_organization_user: object`

  - `type: "user"`

    Object type.

    For Users, this is always `"user"`.

  - `id: string`

    ID of the User.

  - `added_at: string`

    RFC 3339 datetime string indicating when the User joined the Organization.

    format: date-time

  - `email: string`

    Email of the User.

  - `name: string`

    Name of the User.

  - `role: "admin" or "billing" or "claude_code_user" or 6 more`

    Organization role of the User.

    - `"admin"`

    - `"billing"`

    - `"claude_code_user"`

    - `"developer"`

    - `"managed"`

    - `"membership_admin"`

    - `"owner"`

    - `"primary_owner"`

    - `"user"`

#### Example

```bash
ant beta:organization:users retrieve \
  --api-key my-anthropic-api-key \
  --user-id user_id
```

##### Response (200)

```json
{
  "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "added_at": "2024-10-30T23:58:27.427722Z",
  "email": "user@emaildomain.com",
  "name": "Jane Doe",
  "role": "admin",
  "type": "user"
}
```

### Update User

`$ ant beta:organization:users update`

**POST** `/v1/organizations/users/{user_id}`

Update a member's organization role.

#### Parameters

- `--user-id: string` (path parameter)

  ID of the User.

- `--role: "billing" or "claude_code_user" or "developer" or 2 more`

  New role for the User.

  The accepted values depend on the organization type. Console and API organizations accept `user`, `developer`, `billing`, and `claude_code_user`; `admin` cannot be assigned through the API. Claude Enterprise organizations accept `user` and `managed`.

#### Returns

- `beta_organization_user: object`

  - `type: "user"`

    Object type.

    For Users, this is always `"user"`.

  - `id: string`

    ID of the User.

  - `added_at: string`

    RFC 3339 datetime string indicating when the User joined the Organization.

    format: date-time

  - `email: string`

    Email of the User.

  - `name: string`

    Name of the User.

  - `role: "admin" or "billing" or "claude_code_user" or 6 more`

    Organization role of the User.

    - `"admin"`

    - `"billing"`

    - `"claude_code_user"`

    - `"developer"`

    - `"managed"`

    - `"membership_admin"`

    - `"owner"`

    - `"primary_owner"`

    - `"user"`

#### Example

```bash
ant beta:organization:users update \
  --api-key my-anthropic-api-key \
  --user-id user_id \
  --role user
```

##### Response (200)

```json
{
  "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "added_at": "2024-10-30T23:58:27.427722Z",
  "email": "user@emaildomain.com",
  "name": "Jane Doe",
  "role": "admin",
  "type": "user"
}
```

### Remove User

`$ ant beta:organization:users remove`

**DELETE** `/v1/organizations/users/{user_id}`

Remove a member from the organization.

#### Parameters

- `--user-id: string` (path parameter)

  ID of the User.

#### Returns

- `BetaOrganizationUserRemoveResponse: object`

  - `type: "user_deleted"`

    Deleted object type.

    For Users, this is always `"user_deleted"`.

  - `id: string`

    ID of the User.

#### Example

```bash
ant beta:organization:users remove \
  --api-key my-anthropic-api-key \
  --user-id user_id
```

##### Response (200)

```json
{
  "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "type": "user_deleted"
}
```

## Organization › Workspaces

### List Workspaces

`$ ant beta:organization:workspaces list`

**GET** `/v1/organizations/workspaces`

List Workspaces

#### Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--include-archived: optional boolean` (query parameter)

  Whether to include Workspaces that have been archived in the response

- `--include-default: optional boolean` (query parameter)

  Whether to include the organization's default Workspace in the response

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

#### Returns

- `BetaListResponse_Workspace_: object`

  - `data: array of BetaWorkspace`

    - `type: "workspace"`

      Object type.

      For Workspaces, this is always `"workspace"`.

    - `id: string`

      ID of the Workspace.

    - `archived_at: string`

      RFC 3339 datetime string indicating when the Workspace was archived, or `null` if the Workspace is not archived.

      format: date-time

    - `compartment_id: string`

      Identifier for this Workspace's encryption compartment. When you configure a
      customer-managed encryption key (CMEK) on AWS, reference this value in your
      KMS key-policy condition so the key is scoped to this compartment. On GCP and
      Azure, Anthropic enforces the compartment binding automatically; you do not
      need to reference this value in your key configuration. See the CMEK
      integration guide for the required key configuration; unless your organization
      is on Claude Platform on AWS, it includes a separate value used during key
      validation. On Claude Platform on AWS there is no separate validation value:
      the key is validated against this Workspace's own value when it is attached, so
      if your key policy uses the compartment condition, add this value to it before
      attaching the key.

    - `created_at: string`

      RFC 3339 datetime string indicating when the Workspace was created.

      format: date-time

    - `data_residency: object`

      Data residency configuration.

      - `allowed_inference_geos: array of BetaAllowedInferenceGeo or "unrestricted"`

        Permitted inference geo values. 'unrestricted' means all geos are allowed.

        - `geos: array of BetaAllowedInferenceGeo`

          - `"global"`

          - `"us"`

        - `unrestricted: "unrestricted"`

      - `default_inference_geo: "global" or "us"`

        Default inference geo applied when requests omit the parameter.

        - `"global"`

        - `"us"`

      - `workspace_geo: "us"`

        Geographic region for workspace data storage. Immutable after creation.

    - `display_color: string`

      Hex color code representing the Workspace in the Anthropic Console.

    - `external_key_id: string`

      ID of the customer-managed encryption key (CMEK) configuration to use for this
      Workspace. Setting this field requires CMEK to be enabled for your
      organization. When set, data stored for this Workspace is encrypted with the
      referenced key. Create key configurations with the External Keys API. On
      Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
      single-Region key in the same AWS account and Region as the Workspace. On that
      platform the key is validated against this Workspace when it is attached, so a
      key-policy problem is reported as an error on this request. This field is write-once:
      once a key is attached to a Workspace it cannot be detached or replaced. To
      rotate key material, rotate the underlying key on your cloud KMS; the
      `external_key_id` stays the same.

    - `name: string`

      Name of the Workspace.

    - `tags: map[string]`

      User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

#### Example

```bash
ant beta:organization:workspaces list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "archived_at": "2024-11-01T23:59:27.427722Z",
      "compartment_id": "f8a7b6c5-4d3e-4f1a-8b9c-0d1e2f3a4b5c",
      "created_at": "2024-10-30T23:58:27.427722Z",
      "data_residency": {
        "allowed_inference_geos": "unrestricted",
        "default_inference_geo": "global",
        "workspace_geo": "us"
      },
      "display_color": "#6C5BB9",
      "external_key_id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
      "name": "Workspace Name",
      "tags": {
        "env": "prod",
        "team": "platform"
      },
      "type": "workspace"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```

### Create Workspace

`$ ant beta:organization:workspaces create`

**POST** `/v1/organizations/workspaces`

Create Workspace

#### Parameters

- `--name: string`

  Name of the Workspace.

  minLength: 1, maxLength: 255

- `--data-residency: optional object`

  Data residency configuration for the workspace. If omitted, defaults to `workspace_geo: "us"`, `allowed_inference_geos: "unrestricted"`, and `default_inference_geo: "global"`.

- `--display-color: optional string`

  Hex color code representing the Workspace in the Anthropic Console.

  maxLength: 7, pattern: ^#[0-9A-Fa-f]{6}$

- `--external-key-id: optional string`

  ID of the customer-managed encryption key (CMEK) configuration to use for this
  Workspace. Setting this field requires CMEK to be enabled for your
  organization. When set, data stored for this Workspace is encrypted with the
  referenced key. Create key configurations with the External Keys API. On
  Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
  single-Region key in the same AWS account and Region as the Workspace. On that
  platform the key is validated against this Workspace when it is attached, so a
  key-policy problem is reported as an error on this request. This field is write-once:
  once a key is attached to a Workspace it cannot be detached or replaced. To
  rotate key material, rotate the underlying key on your cloud KMS; the
  `external_key_id` stays the same.

- `--tags: optional map[string]`

  User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_workspace: object`

  - `type: "workspace"`

    Object type.

    For Workspaces, this is always `"workspace"`.

  - `id: string`

    ID of the Workspace.

  - `archived_at: string`

    RFC 3339 datetime string indicating when the Workspace was archived, or `null` if the Workspace is not archived.

    format: date-time

  - `compartment_id: string`

    Identifier for this Workspace's encryption compartment. When you configure a
    customer-managed encryption key (CMEK) on AWS, reference this value in your
    KMS key-policy condition so the key is scoped to this compartment. On GCP and
    Azure, Anthropic enforces the compartment binding automatically; you do not
    need to reference this value in your key configuration. See the CMEK
    integration guide for the required key configuration; unless your organization
    is on Claude Platform on AWS, it includes a separate value used during key
    validation. On Claude Platform on AWS there is no separate validation value:
    the key is validated against this Workspace's own value when it is attached, so
    if your key policy uses the compartment condition, add this value to it before
    attaching the key.

  - `created_at: string`

    RFC 3339 datetime string indicating when the Workspace was created.

    format: date-time

  - `data_residency: object`

    Data residency configuration.

    - `allowed_inference_geos: array of BetaAllowedInferenceGeo or "unrestricted"`

      Permitted inference geo values. 'unrestricted' means all geos are allowed.

      - `geos: array of BetaAllowedInferenceGeo`

        - `"global"`

        - `"us"`

      - `unrestricted: "unrestricted"`

    - `default_inference_geo: "global" or "us"`

      Default inference geo applied when requests omit the parameter.

      - `"global"`

      - `"us"`

    - `workspace_geo: "us"`

      Geographic region for workspace data storage. Immutable after creation.

  - `display_color: string`

    Hex color code representing the Workspace in the Anthropic Console.

  - `external_key_id: string`

    ID of the customer-managed encryption key (CMEK) configuration to use for this
    Workspace. Setting this field requires CMEK to be enabled for your
    organization. When set, data stored for this Workspace is encrypted with the
    referenced key. Create key configurations with the External Keys API. On
    Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
    single-Region key in the same AWS account and Region as the Workspace. On that
    platform the key is validated against this Workspace when it is attached, so a
    key-policy problem is reported as an error on this request. This field is write-once:
    once a key is attached to a Workspace it cannot be detached or replaced. To
    rotate key material, rotate the underlying key on your cloud KMS; the
    `external_key_id` stays the same.

  - `name: string`

    Name of the Workspace.

  - `tags: map[string]`

    User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

#### Example

```bash
ant beta:organization:workspaces create \
  --api-key my-anthropic-api-key \
  --name x
```

##### Response (200)

```json
{
  "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "archived_at": "2024-11-01T23:59:27.427722Z",
  "compartment_id": "f8a7b6c5-4d3e-4f1a-8b9c-0d1e2f3a4b5c",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "data_residency": {
    "allowed_inference_geos": "unrestricted",
    "default_inference_geo": "global",
    "workspace_geo": "us"
  },
  "display_color": "#6C5BB9",
  "external_key_id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "name": "Workspace Name",
  "tags": {
    "env": "prod",
    "team": "platform"
  },
  "type": "workspace"
}
```

### Get Workspace

`$ ant beta:organization:workspaces retrieve`

**GET** `/v1/organizations/workspaces/{workspace_id}`

Get Workspace

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the Workspace.

#### Returns

- `beta_workspace: object`

  - `type: "workspace"`

    Object type.

    For Workspaces, this is always `"workspace"`.

  - `id: string`

    ID of the Workspace.

  - `archived_at: string`

    RFC 3339 datetime string indicating when the Workspace was archived, or `null` if the Workspace is not archived.

    format: date-time

  - `compartment_id: string`

    Identifier for this Workspace's encryption compartment. When you configure a
    customer-managed encryption key (CMEK) on AWS, reference this value in your
    KMS key-policy condition so the key is scoped to this compartment. On GCP and
    Azure, Anthropic enforces the compartment binding automatically; you do not
    need to reference this value in your key configuration. See the CMEK
    integration guide for the required key configuration; unless your organization
    is on Claude Platform on AWS, it includes a separate value used during key
    validation. On Claude Platform on AWS there is no separate validation value:
    the key is validated against this Workspace's own value when it is attached, so
    if your key policy uses the compartment condition, add this value to it before
    attaching the key.

  - `created_at: string`

    RFC 3339 datetime string indicating when the Workspace was created.

    format: date-time

  - `data_residency: object`

    Data residency configuration.

    - `allowed_inference_geos: array of BetaAllowedInferenceGeo or "unrestricted"`

      Permitted inference geo values. 'unrestricted' means all geos are allowed.

      - `geos: array of BetaAllowedInferenceGeo`

        - `"global"`

        - `"us"`

      - `unrestricted: "unrestricted"`

    - `default_inference_geo: "global" or "us"`

      Default inference geo applied when requests omit the parameter.

      - `"global"`

      - `"us"`

    - `workspace_geo: "us"`

      Geographic region for workspace data storage. Immutable after creation.

  - `display_color: string`

    Hex color code representing the Workspace in the Anthropic Console.

  - `external_key_id: string`

    ID of the customer-managed encryption key (CMEK) configuration to use for this
    Workspace. Setting this field requires CMEK to be enabled for your
    organization. When set, data stored for this Workspace is encrypted with the
    referenced key. Create key configurations with the External Keys API. On
    Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
    single-Region key in the same AWS account and Region as the Workspace. On that
    platform the key is validated against this Workspace when it is attached, so a
    key-policy problem is reported as an error on this request. This field is write-once:
    once a key is attached to a Workspace it cannot be detached or replaced. To
    rotate key material, rotate the underlying key on your cloud KMS; the
    `external_key_id` stays the same.

  - `name: string`

    Name of the Workspace.

  - `tags: map[string]`

    User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

#### Example

```bash
ant beta:organization:workspaces retrieve \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "archived_at": "2024-11-01T23:59:27.427722Z",
  "compartment_id": "f8a7b6c5-4d3e-4f1a-8b9c-0d1e2f3a4b5c",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "data_residency": {
    "allowed_inference_geos": "unrestricted",
    "default_inference_geo": "global",
    "workspace_geo": "us"
  },
  "display_color": "#6C5BB9",
  "external_key_id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "name": "Workspace Name",
  "tags": {
    "env": "prod",
    "team": "platform"
  },
  "type": "workspace"
}
```

### Update Workspace

`$ ant beta:organization:workspaces update`

**POST** `/v1/organizations/workspaces/{workspace_id}`

Update Workspace

#### Parameters

- `--workspace-id: string` (path parameter)

- `--data-residency: optional object`

  Data residency configuration for the workspace.

- `--display-color: optional string`

  Hex color code representing the Workspace in the Anthropic Console.

  maxLength: 7, pattern: ^#[0-9A-Fa-f]{6}$

- `--external-key-id: optional string`

  ID of the customer-managed encryption key (CMEK) configuration to use for this
  Workspace. Setting this field requires CMEK to be enabled for your
  organization. When set, data stored for this Workspace is encrypted with the
  referenced key. Create key configurations with the External Keys API. On
  Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
  single-Region key in the same AWS account and Region as the Workspace. On that
  platform the key is validated against this Workspace when it is attached, so a
  key-policy problem is reported as an error on this request. This field is write-once:
  once a key is attached to a Workspace it cannot be detached or replaced. To
  rotate key material, rotate the underlying key on your cloud KMS; the
  `external_key_id` stays the same.

- `--name: optional string`

  Name of the Workspace.

  minLength: 1, maxLength: 255

- `--tags: optional map[string]`

  User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

#### Returns

- `beta_workspace: object`

  - `type: "workspace"`

    Object type.

    For Workspaces, this is always `"workspace"`.

  - `id: string`

    ID of the Workspace.

  - `archived_at: string`

    RFC 3339 datetime string indicating when the Workspace was archived, or `null` if the Workspace is not archived.

    format: date-time

  - `compartment_id: string`

    Identifier for this Workspace's encryption compartment. When you configure a
    customer-managed encryption key (CMEK) on AWS, reference this value in your
    KMS key-policy condition so the key is scoped to this compartment. On GCP and
    Azure, Anthropic enforces the compartment binding automatically; you do not
    need to reference this value in your key configuration. See the CMEK
    integration guide for the required key configuration; unless your organization
    is on Claude Platform on AWS, it includes a separate value used during key
    validation. On Claude Platform on AWS there is no separate validation value:
    the key is validated against this Workspace's own value when it is attached, so
    if your key policy uses the compartment condition, add this value to it before
    attaching the key.

  - `created_at: string`

    RFC 3339 datetime string indicating when the Workspace was created.

    format: date-time

  - `data_residency: object`

    Data residency configuration.

    - `allowed_inference_geos: array of BetaAllowedInferenceGeo or "unrestricted"`

      Permitted inference geo values. 'unrestricted' means all geos are allowed.

      - `geos: array of BetaAllowedInferenceGeo`

        - `"global"`

        - `"us"`

      - `unrestricted: "unrestricted"`

    - `default_inference_geo: "global" or "us"`

      Default inference geo applied when requests omit the parameter.

      - `"global"`

      - `"us"`

    - `workspace_geo: "us"`

      Geographic region for workspace data storage. Immutable after creation.

  - `display_color: string`

    Hex color code representing the Workspace in the Anthropic Console.

  - `external_key_id: string`

    ID of the customer-managed encryption key (CMEK) configuration to use for this
    Workspace. Setting this field requires CMEK to be enabled for your
    organization. When set, data stored for this Workspace is encrypted with the
    referenced key. Create key configurations with the External Keys API. On
    Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
    single-Region key in the same AWS account and Region as the Workspace. On that
    platform the key is validated against this Workspace when it is attached, so a
    key-policy problem is reported as an error on this request. This field is write-once:
    once a key is attached to a Workspace it cannot be detached or replaced. To
    rotate key material, rotate the underlying key on your cloud KMS; the
    `external_key_id` stays the same.

  - `name: string`

    Name of the Workspace.

  - `tags: map[string]`

    User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

#### Example

```bash
ant beta:organization:workspaces update \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "archived_at": "2024-11-01T23:59:27.427722Z",
  "compartment_id": "f8a7b6c5-4d3e-4f1a-8b9c-0d1e2f3a4b5c",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "data_residency": {
    "allowed_inference_geos": "unrestricted",
    "default_inference_geo": "global",
    "workspace_geo": "us"
  },
  "display_color": "#6C5BB9",
  "external_key_id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "name": "Workspace Name",
  "tags": {
    "env": "prod",
    "team": "platform"
  },
  "type": "workspace"
}
```

### Archive Workspace

`$ ant beta:organization:workspaces archive`

**POST** `/v1/organizations/workspaces/{workspace_id}/archive`

Archive Workspace

#### Parameters

- `--workspace-id: string` (path parameter)

#### Returns

- `beta_workspace: object`

  - `type: "workspace"`

    Object type.

    For Workspaces, this is always `"workspace"`.

  - `id: string`

    ID of the Workspace.

  - `archived_at: string`

    RFC 3339 datetime string indicating when the Workspace was archived, or `null` if the Workspace is not archived.

    format: date-time

  - `compartment_id: string`

    Identifier for this Workspace's encryption compartment. When you configure a
    customer-managed encryption key (CMEK) on AWS, reference this value in your
    KMS key-policy condition so the key is scoped to this compartment. On GCP and
    Azure, Anthropic enforces the compartment binding automatically; you do not
    need to reference this value in your key configuration. See the CMEK
    integration guide for the required key configuration; unless your organization
    is on Claude Platform on AWS, it includes a separate value used during key
    validation. On Claude Platform on AWS there is no separate validation value:
    the key is validated against this Workspace's own value when it is attached, so
    if your key policy uses the compartment condition, add this value to it before
    attaching the key.

  - `created_at: string`

    RFC 3339 datetime string indicating when the Workspace was created.

    format: date-time

  - `data_residency: object`

    Data residency configuration.

    - `allowed_inference_geos: array of BetaAllowedInferenceGeo or "unrestricted"`

      Permitted inference geo values. 'unrestricted' means all geos are allowed.

      - `geos: array of BetaAllowedInferenceGeo`

        - `"global"`

        - `"us"`

      - `unrestricted: "unrestricted"`

    - `default_inference_geo: "global" or "us"`

      Default inference geo applied when requests omit the parameter.

      - `"global"`

      - `"us"`

    - `workspace_geo: "us"`

      Geographic region for workspace data storage. Immutable after creation.

  - `display_color: string`

    Hex color code representing the Workspace in the Anthropic Console.

  - `external_key_id: string`

    ID of the customer-managed encryption key (CMEK) configuration to use for this
    Workspace. Setting this field requires CMEK to be enabled for your
    organization. When set, data stored for this Workspace is encrypted with the
    referenced key. Create key configurations with the External Keys API. On
    Claude Platform on AWS the value is the AWS KMS key ARN, and the key must be a
    single-Region key in the same AWS account and Region as the Workspace. On that
    platform the key is validated against this Workspace when it is attached, so a
    key-policy problem is reported as an error on this request. This field is write-once:
    once a key is attached to a Workspace it cannot be detached or replaced. To
    rotate key material, rotate the underlying key on your cloud KMS; the
    `external_key_id` stays the same.

  - `name: string`

    Name of the Workspace.

  - `tags: map[string]`

    User-defined tags as string key-value pairs. Keys may not begin with `anthropic`.

#### Example

```bash
ant beta:organization:workspaces archive \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "archived_at": "2024-11-01T23:59:27.427722Z",
  "compartment_id": "f8a7b6c5-4d3e-4f1a-8b9c-0d1e2f3a4b5c",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "data_residency": {
    "allowed_inference_geos": "unrestricted",
    "default_inference_geo": "global",
    "workspace_geo": "us"
  },
  "display_color": "#6C5BB9",
  "external_key_id": "ekey_01SDCCSbTxrXDpWc1phhtcfK",
  "name": "Workspace Name",
  "tags": {
    "env": "prod",
    "team": "platform"
  },
  "type": "workspace"
}
```

## Organization › Workspaces › Rate Limits

### List Workspace Rate Limits

`$ ant beta:organization:workspaces:rate-limits list`

**GET** `/v1/organizations/workspaces/{workspace_id}/rate_limits`

List a workspace's rate limits.

By default, returns only the groups and limiter types that have a
workspace-level override. With `include_inherited=true`, returns every
group with organization-level limits the workspace can see, listing for
each the values it inherits from the organization as well as its own
overrides. Each value's `source` says which it is.

When `limit` is omitted, every matching entry is returned in a single
page; when `limit` truncates the result, follow `next_page` to fetch
the remaining entries.

#### Parameters

- `--workspace-id: string` (path parameter)

  The ID of the workspace.

- `--group-type: optional "batch" or "files" or "model_group" or 3 more` (query parameter)

  Filter by group type.

- `--include-inherited: optional boolean` (query parameter)

  Also list the limiter values the workspace inherits from the organization, including groups with no workspace-level override.

- `--limit: optional number` (query parameter)

  Maximum number of items to return per page. Ranges from `1` to `1000`.

  When omitted, every remaining entry is returned in a single page and `next_page` is `null`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

#### Returns

- `BetaWorkspaceRateLimitListResponse: object`

  - `data: array of BetaWorkspaceRateLimit`

    Rate-limit entries for the workspace: one per group with at least one override, or, with `include_inherited` set to `true`, one per group the workspace can see that has organization-level limits.

    - `type: "workspace_rate_limit"`

      Object type. Always `workspace_rate_limit` for workspace rate-limit entries.

    - `group: BetaOrganizationRateLimitModelGroup or BetaOrganizationRateLimitBatchGroup or BetaOrganizationRateLimitTokenCountGroup or 3 more`

      The rate-limit group this entry's limits apply to. Its `type` equals `group_type`.

      - `beta_organization_rate_limit_model_group: object`

        - `type: "model_group"`

          Always `model_group`: a family of models.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

        - `display_name: string`

          Human-readable name of the model group (for example, `Claude Sonnet 4.x`). For display only; it may change.

      - `beta_organization_rate_limit_batch_group: object`

        - `type: "batch"`

          Always `batch`: the Message Batches API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_token_count_group: object`

        - `type: "token_count"`

          Always `token_count`: the Token Count API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_files_group: object`

        - `type: "files"`

          Always `files`: the Files API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_skills_group: object`

        - `type: "skills"`

          Always `skills`: the Skills API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_web_search_group: object`

        - `type: "web_search"`

          Always `web_search`: the Messages API web search tool.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

    - `limits: array of BetaWorkspaceRateLimitValue`

      The workspace's limiter values for this group. By default only the limiter types with a workspace-level override are listed. With `include_inherited` set to `true`, the limiter types the workspace inherits from the organization are listed too, each marked by `source`.

      - `type: string`

        The limiter type (for example, `requests_per_minute` or `input_tokens_per_minute`).

      - `org_limit: number`

        The organization-level value for the same limiter type, for reference. `null` when the organization has no limit configured for this limiter type.

      - `source: BetaWorkspaceRateLimitWorkspaceSource or BetaWorkspaceRateLimitOrganizationSource`

        Where `value` comes from. `organization` values are listed only when `include_inherited` is `true`, and then `value` equals `org_limit`.

        - `beta_workspace_rate_limit_workspace_source: object`

          - `type: "workspace"`

            Always `workspace`: a workspace-level override is stored.

        - `beta_workspace_rate_limit_organization_source: object`

          - `type: "organization"`

            Always `organization`: no workspace-level override is stored, so the organization's value applies.

      - `value: number`

        The workspace's value for this limiter type: the workspace-level override when `source.type` is `workspace`, otherwise the organization's value.

    - `models: array of string`

      Model names this entry's limits apply to, including aliases. `null` when `group_type` is not `"model_group"`.

    - `rate_limit_id: string`

      The `id` of the organization's RateLimit entry this entry applies to.

    - `workspace_id: string`

      ID of the Workspace this entry applies to.

    - `group_type: "batch" or "files" or "model_group" or 3 more`

      **Deprecated**: Use `group.type` instead. `group_type` is still returned and always equals `group.type`.

      Deprecated: use `group.type` instead. The kind of rate-limit group this entry represents. `model_group` entries apply to a family of models (listed in `models`); other values apply to an API-surface category and have `models` set to `null`. Always equal to `group.type`.

      - `"batch"`

      - `"files"`

      - `"model_group"`

      - `"skills"`

      - `"token_count"`

      - `"web_search"`

  - `next_page: string`

    Opaque cursor for the next page of results, or `null` when no entries remain beyond this response.

#### Example

```bash
ant beta:organization:workspaces:rate-limits list \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "data": [
    {
      "group": {
        "id": "id",
        "display_name": "display_name",
        "type": "model_group"
      },
      "group_type": "batch",
      "limits": [
        {
          "org_limit": 0,
          "source": {
            "type": "workspace"
          },
          "type": "type",
          "value": 0
        }
      ],
      "models": [
        "string"
      ],
      "rate_limit_id": "rate_limit_id",
      "type": "workspace_rate_limit",
      "workspace_id": "workspace_id"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Workspaces › Members

### List Workspace Members

`$ ant beta:organization:workspaces:members list`

**GET** `/v1/organizations/workspaces/{workspace_id}/members`

List Workspace Members

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the Workspace.

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

#### Returns

- `BetaListResponse_WorkspaceMemberSchema_: object`

  - `data: array of BetaWorkspaceMember`

    - `type: "workspace_member"`

      Object type.

      For Workspace Members, this is always `"workspace_member"`.

    - `user_id: string`

      ID of the User.

    - `workspace_id: string`

      ID of the Workspace.

    - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

      Role of the Workspace Member.

      - `"workspace_admin"`

      - `"workspace_billing"`

      - `"workspace_developer"`

      - `"workspace_restricted_developer"`

      - `"workspace_user"`

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

#### Example

```bash
ant beta:organization:workspaces:members list \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "data": [
    {
      "type": "workspace_member",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "workspace_role": "workspace_admin"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```

### Create Workspace Member

`$ ant beta:organization:workspaces:members add`

**POST** `/v1/organizations/workspaces/{workspace_id}/members`

Create Workspace Member

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the Workspace.

- `--user-id: string`

  ID of the User.

- `--workspace-role: "workspace_admin" or "workspace_developer" or "workspace_restricted_developer" or "workspace_user"`

  Role of the new Workspace Member. Cannot be `workspace_billing`.

#### Returns

- `beta_workspace_member: object`

  - `type: "workspace_member"`

    Object type.

    For Workspace Members, this is always `"workspace_member"`.

  - `user_id: string`

    ID of the User.

  - `workspace_id: string`

    ID of the Workspace.

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the Workspace Member.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:workspaces:members add \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --user-id user_01WCz1FkmYMm4gnmykNKUu3Q \
  --workspace-role workspace_admin
```

##### Response (200)

```json
{
  "type": "workspace_member",
  "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "workspace_role": "workspace_admin"
}
```

### Get Workspace Member

`$ ant beta:organization:workspaces:members retrieve`

**GET** `/v1/organizations/workspaces/{workspace_id}/members/{user_id}`

Get Workspace Member

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the Workspace.

- `--user-id: string` (path parameter)

  ID of the User.

#### Returns

- `beta_workspace_member: object`

  - `type: "workspace_member"`

    Object type.

    For Workspace Members, this is always `"workspace_member"`.

  - `user_id: string`

    ID of the User.

  - `workspace_id: string`

    ID of the Workspace.

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the Workspace Member.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:workspaces:members retrieve \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --user-id user_id
```

##### Response (200)

```json
{
  "type": "workspace_member",
  "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "workspace_role": "workspace_admin"
}
```

### Update Workspace Member

`$ ant beta:organization:workspaces:members update`

**POST** `/v1/organizations/workspaces/{workspace_id}/members/{user_id}`

Update Workspace Member

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the Workspace.

- `--user-id: string` (path parameter)

  ID of the User.

- `--workspace-role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

  New workspace role for the User.

#### Returns

- `beta_workspace_member: object`

  - `type: "workspace_member"`

    Object type.

    For Workspace Members, this is always `"workspace_member"`.

  - `user_id: string`

    ID of the User.

  - `workspace_id: string`

    ID of the Workspace.

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the Workspace Member.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:workspaces:members update \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --user-id user_id \
  --workspace-role workspace_admin
```

##### Response (200)

```json
{
  "type": "workspace_member",
  "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "workspace_role": "workspace_admin"
}
```

### Delete Workspace Member

`$ ant beta:organization:workspaces:members remove`

**DELETE** `/v1/organizations/workspaces/{workspace_id}/members/{user_id}`

Delete Workspace Member

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the Workspace.

- `--user-id: string` (path parameter)

  ID of the User.

#### Returns

- `BetaOrganizationWorkspaceMemberRemoveResponse: object`

  - `type: "workspace_member_deleted"`

    Deleted object type.

    For Workspace Members, this is always `"workspace_member_deleted"`.

  - `user_id: string`

    ID of the User.

  - `workspace_id: string`

    ID of the Workspace.

#### Example

```bash
ant beta:organization:workspaces:members remove \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --user-id user_id
```

##### Response (200)

```json
{
  "type": "workspace_member_deleted",
  "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"
}
```

## Organization › Workspaces › Service Accounts

### List Service Account Workspace Members

`$ ant beta:organization:workspaces:service-accounts list`

**GET** `/v1/organizations/workspaces/{workspace_id}/service_accounts`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List the service accounts that are members of a workspace.

Each entry includes the service account's `workspace_role`. Use `limit`
and the `next_page` cursor to paginate. Archived workspaces return 400;
use `GET /service_accounts/{id}/workspaces` to audit memberships of an
archived workspace. The implicit default-workspace membership is not
included in this list. Memberships of archived service accounts are
omitted from the results.

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the workspace.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaServiceAccountWorkspaceMemberListResponse: object`

  - `data: array of BetaServiceAccountWorkspaceMember`

    - `type: "service_account_workspace_member"`

    - `created_by_actor_id: string`

      Tagged ID (`user_...`/`svac_...`) of the actor who created this membership.

    - `implicit: boolean`

      True when this is the implicit default-workspace membership every service account has when no explicit membership exists. Implicit memberships have role `workspace_user` and cannot be removed.

    - `service_account_id: string`

      Tagged service account ID (`svac_...`).

    - `workspace_id: string`

      Tagged workspace ID (`wrkspc_...`).

    - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

      Role of the service account in this workspace. Service accounts cannot hold the `workspace_billing` role.

      - `"workspace_admin"`

      - `"workspace_billing"`

      - `"workspace_developer"`

      - `"workspace_restricted_developer"`

      - `"workspace_user"`

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results.

#### Example

```bash
ant beta:organization:workspaces:service-accounts list \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "data": [
    {
      "created_by_actor_id": "created_by_actor_id",
      "implicit": true,
      "service_account_id": "service_account_id",
      "type": "service_account_workspace_member",
      "workspace_id": "workspace_id",
      "workspace_role": "workspace_admin"
    }
  ],
  "next_page": "next_page"
}
```

### Create Service Account Workspace Member

`$ ant beta:organization:workspaces:service-accounts add`

**POST** `/v1/organizations/workspaces/{workspace_id}/service_accounts`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Add a service account to a workspace with the given `workspace_role`.

The role determines what the service account can do in the workspace and
which workspace-scoped permissions it can be granted when authenticating
through federation. Every service account is already an implicit
`workspace_user` member of the default workspace; adding it explicitly
assigns a chosen role. If the service account is already an explicit
member of the workspace, its `workspace_role` is replaced with the
value supplied here. Archived workspaces return 400. Archived service
accounts cannot be added and are rejected.

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the workspace.

- `--service-account-id: string`

  Tagged service account ID to add.

- `--workspace-role: "workspace_admin" or "workspace_developer" or "workspace_restricted_developer" or "workspace_user"`

  Role to assign to the service account in this workspace.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account_workspace_member: object`

  - `type: "service_account_workspace_member"`

  - `created_by_actor_id: string`

    Tagged ID (`user_...`/`svac_...`) of the actor who created this membership.

  - `implicit: boolean`

    True when this is the implicit default-workspace membership every service account has when no explicit membership exists. Implicit memberships have role `workspace_user` and cannot be removed.

  - `service_account_id: string`

    Tagged service account ID (`svac_...`).

  - `workspace_id: string`

    Tagged workspace ID (`wrkspc_...`).

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the service account in this workspace. Service accounts cannot hold the `workspace_billing` role.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:workspaces:service-accounts add \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --service-account-id service_account_id \
  --workspace-role workspace_admin
```

##### Response (200)

```json
{
  "created_by_actor_id": "created_by_actor_id",
  "implicit": true,
  "service_account_id": "service_account_id",
  "type": "service_account_workspace_member",
  "workspace_id": "workspace_id",
  "workspace_role": "workspace_admin"
}
```

### Get Service Account Workspace Member

`$ ant beta:organization:workspaces:service-accounts retrieve`

**GET** `/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Retrieve a service account's membership in a workspace.

Returns the membership record, including the service account's
`workspace_role` in this workspace. Archived workspaces return 400. For
the default workspace, returns the implicit (`implicit: true`)
membership when no explicit membership exists; an explicitly added
membership is returned with its assigned role. An archived service
account returns 404.

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the workspace.

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account_workspace_member: object`

  - `type: "service_account_workspace_member"`

  - `created_by_actor_id: string`

    Tagged ID (`user_...`/`svac_...`) of the actor who created this membership.

  - `implicit: boolean`

    True when this is the implicit default-workspace membership every service account has when no explicit membership exists. Implicit memberships have role `workspace_user` and cannot be removed.

  - `service_account_id: string`

    Tagged service account ID (`svac_...`).

  - `workspace_id: string`

    Tagged workspace ID (`wrkspc_...`).

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the service account in this workspace. Service accounts cannot hold the `workspace_billing` role.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:workspaces:service-accounts retrieve \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --service-account-id service_account_id
```

##### Response (200)

```json
{
  "created_by_actor_id": "created_by_actor_id",
  "implicit": true,
  "service_account_id": "service_account_id",
  "type": "service_account_workspace_member",
  "workspace_id": "workspace_id",
  "workspace_role": "workspace_admin"
}
```

### Update Service Account Workspace Member

`$ ant beta:organization:workspaces:service-accounts update`

**POST** `/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Change a service account's role in a workspace.

The new `workspace_role` replaces the current one. Only explicit
memberships can be updated; to set a role on the implicit
default-workspace membership, add the service account explicitly with
`POST /workspaces/{workspace_id}/service_accounts`. Archived workspaces
return 400. Archived service accounts cannot be updated and are
rejected.

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the workspace.

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--workspace-role: "workspace_admin" or "workspace_developer" or "workspace_restricted_developer" or "workspace_user"`

  New role for the service account in this workspace.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_service_account_workspace_member: object`

  - `type: "service_account_workspace_member"`

  - `created_by_actor_id: string`

    Tagged ID (`user_...`/`svac_...`) of the actor who created this membership.

  - `implicit: boolean`

    True when this is the implicit default-workspace membership every service account has when no explicit membership exists. Implicit memberships have role `workspace_user` and cannot be removed.

  - `service_account_id: string`

    Tagged service account ID (`svac_...`).

  - `workspace_id: string`

    Tagged workspace ID (`wrkspc_...`).

  - `workspace_role: "workspace_admin" or "workspace_billing" or "workspace_developer" or 2 more`

    Role of the service account in this workspace. Service accounts cannot hold the `workspace_billing` role.

    - `"workspace_admin"`

    - `"workspace_billing"`

    - `"workspace_developer"`

    - `"workspace_restricted_developer"`

    - `"workspace_user"`

#### Example

```bash
ant beta:organization:workspaces:service-accounts update \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --service-account-id service_account_id \
  --workspace-role workspace_admin
```

##### Response (200)

```json
{
  "created_by_actor_id": "created_by_actor_id",
  "implicit": true,
  "service_account_id": "service_account_id",
  "type": "service_account_workspace_member",
  "workspace_id": "workspace_id",
  "workspace_role": "workspace_admin"
}
```

### Delete Service Account Workspace Member

`$ ant beta:organization:workspaces:service-accounts remove`

**DELETE** `/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Remove a service account from a workspace.

Removal is idempotent (returns 200 even if the membership was already
removed). A DELETE against the implicit default-workspace membership
returns 200 but is a no-op and the membership persists; deleting an
explicit default-workspace row reverts to the implicit `workspace_user`
membership. Archived workspaces return 400.

#### Parameters

- `--workspace-id: string` (path parameter)

  ID of the workspace.

- `--service-account-id: string` (path parameter)

  ID of the service account.

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `BetaOrganizationWorkspaceServiceAccountRemoveResponse: object`

  - `type: "service_account_workspace_member_deleted"`

  - `service_account_id: string`

    Tagged service account ID (`svac_...`) named in the delete request. Removal is idempotent; see the endpoint description for the implicit-membership no-op.

  - `workspace_id: string`

    Tagged workspace ID (`wrkspc_...`) named in the delete request.

#### Example

```bash
ant beta:organization:workspaces:service-accounts remove \
  --api-key my-anthropic-api-key \
  --workspace-id workspace_id \
  --service-account-id service_account_id
```

##### Response (200)

```json
{
  "service_account_id": "service_account_id",
  "type": "service_account_workspace_member_deleted",
  "workspace_id": "workspace_id"
}
```

## Organization › Rate Limits

### List Organization Rate Limits

`$ ant beta:organization:rate-limits list`

**GET** `/v1/organizations/rate_limits`

List Messages API rate limits for your organization.

Each entry corresponds to one rate-limit group (either a model family
or an API-surface category such as the Message Batches API or the web
search tool) and contains the set of limiter values that apply to it.

When `limit` is omitted, every matching entry is returned in a single
page; when `limit` truncates the result, follow `next_page` to fetch
the remaining entries.

#### Parameters

- `--group-type: optional "batch" or "files" or "model_group" or 3 more` (query parameter)

  Filter by group type.

- `--limit: optional number` (query parameter)

  Maximum number of items to return per page. Ranges from `1` to `1000`.

  When omitted, every remaining entry is returned in a single page and `next_page` is `null`.

  minimum: 1, maximum: 1000

- `--model: optional string` (query parameter)

  Filter to the single entry containing this model. Accepts full model names and aliases. Returns 404 if the model is not found or has no rate limits for this organization.

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

#### Returns

- `BetaRateLimitListResponse: object`

  - `data: array of BetaOrganizationRateLimit`

    Rate-limit entries for the organization, one per group.

    - `type: "rate_limit"`

      Object type. Always `rate_limit` for organization rate-limit entries.

    - `id: string`

      Identifier of this rate-limit entry. It is stable within the organization and differs between organizations; the group's own identifier is `group.id`.

    - `group: BetaOrganizationRateLimitModelGroup or BetaOrganizationRateLimitBatchGroup or BetaOrganizationRateLimitTokenCountGroup or 3 more`

      The rate-limit group this entry's limits apply to. Its `type` equals `group_type`.

      - `beta_organization_rate_limit_model_group: object`

        - `type: "model_group"`

          Always `model_group`: a family of models.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

        - `display_name: string`

          Human-readable name of the model group (for example, `Claude Sonnet 4.x`). For display only; it may change.

      - `beta_organization_rate_limit_batch_group: object`

        - `type: "batch"`

          Always `batch`: the Message Batches API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_token_count_group: object`

        - `type: "token_count"`

          Always `token_count`: the Token Count API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_files_group: object`

        - `type: "files"`

          Always `files`: the Files API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_skills_group: object`

        - `type: "skills"`

          Always `skills`: the Skills API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `beta_organization_rate_limit_web_search_group: object`

        - `type: "web_search"`

          Always `web_search`: the Messages API web search tool.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

    - `limits: array of BetaOrganizationRateLimitValue`

      The limiter values that apply to this group.

      - `type: string`

        The limiter type (for example, `requests_per_minute` or `input_tokens_per_minute`).

      - `value: number`

        The configured limit value for this limiter type.

    - `models: array of string`

      Model names this entry's limits apply to, including aliases. `null` when `group_type` is not `"model_group"`.

    - `group_type: "batch" or "files" or "model_group" or 3 more`

      **Deprecated**: Use `group.type` instead. `group_type` is still returned and always equals `group.type`.

      Deprecated: use `group.type` instead. The kind of rate-limit group this entry represents. `model_group` entries apply to a family of models (listed in `models`); other values apply to an API-surface category and have `models` set to `null`. Always equal to `group.type`.

      - `"batch"`

      - `"files"`

      - `"model_group"`

      - `"skills"`

      - `"token_count"`

      - `"web_search"`

  - `next_page: string`

    Opaque cursor for the next page of results, or `null` when no entries remain beyond this response.

#### Example

```bash
ant beta:organization:rate-limits list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "id",
      "group": {
        "id": "id",
        "display_name": "display_name",
        "type": "model_group"
      },
      "group_type": "batch",
      "limits": [
        {
          "type": "type",
          "value": 0
        }
      ],
      "models": [
        "string"
      ],
      "type": "rate_limit"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Compliance Settings

### Get Compliance Settings

`$ ant beta:organization:compliance-settings retrieve`

**GET** `/v1/organizations/compliance_settings`

Retrieve your organization's Compliance Settings.

Compliance Settings is a singleton resource: there is exactly one per
organization, addressed without an identifier. The `state` field reflects
whether the Compliance API is enabled. An organization with a parent
organization reads the state inherited from the parent's configuration.

#### Returns

- `beta_compliance_settings: object`

  - `type: "compliance_settings"`

  - `state: BetaComplianceSettingsStateEnabled or BetaComplianceSettingsStateDisabled`

    Whether the Compliance API is enabled for this organization.

    - `beta_compliance_settings_state_enabled: object`

      - `type: "enabled"`

    - `beta_compliance_settings_state_disabled: object`

      - `type: "disabled"`

#### Example

```bash
ant beta:organization:compliance-settings retrieve \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "state": {
    "type": "enabled"
  },
  "type": "compliance_settings"
}
```

### Update Compliance Settings

`$ ant beta:organization:compliance-settings update`

**POST** `/v1/organizations/compliance_settings`

Update your organization's Compliance Settings.

Setting `state` to `enabled` turns on the Compliance API and begins
capturing organization activity events. Setting it to `disabled` turns
both off. `state` reflects whether the Compliance API is enabled.

A request that sets `state` to its current value succeeds and leaves the
resource unchanged. A `disabled` request stays in effect until a later
`enabled` request or the organization's next provisioning action that
enables Access Transparency: enabling Access Transparency also enables
the Compliance API, which serves its activity events, so such
provisioning (including re-runs) re-enables the Compliance API even
after a `disabled` request. Automated provisioning never disables
compliance settings.

#### Parameters

- `--state: BetaComplianceSettingsStateEnabledParam or BetaComplianceSettingsStateDisabledParam`

  Desired state. Accepts the string shorthand "enabled" or "disabled" in place of the object form; the response always returns the canonical object form.

#### Returns

- `beta_compliance_settings: object`

  - `type: "compliance_settings"`

  - `state: BetaComplianceSettingsStateEnabled or BetaComplianceSettingsStateDisabled`

    Whether the Compliance API is enabled for this organization.

    - `beta_compliance_settings_state_enabled: object`

      - `type: "enabled"`

    - `beta_compliance_settings_state_disabled: object`

      - `type: "disabled"`

#### Example

```bash
ant beta:organization:compliance-settings update \
  --api-key my-anthropic-api-key \
  --state '{type: enabled}'
```

##### Response (200)

```json
{
  "state": {
    "type": "enabled"
  },
  "type": "compliance_settings"
}
```

## Organization › Analytics › Summaries

### Get Activity Summaries

`$ ant beta:organization:analytics:summaries list`

**GET** `/v1/organizations/analytics/summaries`

Get organization-wide activity summaries for a date range.

Returns one entry per day from `starting_date` (inclusive) to `ending_date`
(exclusive) in `data`, the same `data` / `next_page` envelope as the other
analytics list endpoints; the series is currently returned in full, so
`next_page` is always null.
Data is typically available with a 1-day lag and may be revised by a few
percent over the following days: when `ending_date` is omitted it
defaults to the most recent available day + 1, so the last entry covers
the most recent available day. The series can be scoped to an RBAC group
via `filter[]=rbac_group_id:{id}`. Available to organizations on a Claude
Enterprise plan. Requires an API key with the `read:analytics` scope.

#### Parameters

- `--starting-date: string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of the date range (inclusive). Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive). Data is typically available with a 1-day lag, so this can be at most today — which is also the default when omitted, making the last entry cover the most recent available day. Data may be revised by a few percent over the following days. The range may span at most 366 days.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`. Only `rbac_group_id` is supported (e.g. `filter[]=rbac_group_id:{id}`); repeat the param to OR across groups. Scopes the whole day series to members of the matching group(s), re-aggregated from member-level activity — org-wide seat/invite fields and the adoption rates derived from them are null on scoped rows. `rbac_group_id` accepts the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each UTC day (time-of-usage attribution). At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100). The day series (at most 366 entries) is currently returned in full in a single page, so `limit` does not yet shorten it.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field. `next_page` is currently always null, so there is never a cursor to send.

#### Returns

- `BetaAnalyticsActivitySummaryResponse: object`

  Response for GET /v1/organizations/analytics/summaries.

  - `data: array of BetaAnalyticsSingleDayActivitySummary`

    One entry per day in the requested range, ascending by date.

    - `assigned_seat_count: number`

      Number of seats currently assigned to members. Null when the response is scoped to an RBAC group — seat assignment is org-wide and has no per-group analogue.

    - `cowork_daily_active_user_count: number`

      Number of users with Cowork activity on the requested day

    - `cowork_monthly_active_user_count: number`

      Number of users with Cowork activity in the 30-day rolling window

    - `cowork_weekly_active_user_count: number`

      Number of users with Cowork activity in the 7-day rolling window

    - `daily_active_user_count: number`

      Number of users with token consumption on the requested day

    - `daily_adoption_rate: number`

      Percentage of assigned seats with activity on the requested day (`DAU / assigned_seat_count * 100`). Null when the response is scoped to an RBAC group.

    - `ending_at: string`

      End of the aggregation period (exclusive), UTC midnight in RFC 3339 format (e.g. `2026-01-16T00:00:00Z`).

      format: date-time

    - `monthly_active_user_count: number`

      Number of users with token consumption in the 30-day rolling window

    - `monthly_adoption_rate: number`

      Percentage of assigned seats with activity in the 30-day rolling window (`MAU / assigned_seat_count * 100`). Null when the response is scoped to an RBAC group.

    - `pending_invite_count: number`

      Number of pending invitations to join the organization. Null when the response is scoped to an RBAC group.

    - `starting_at: string`

      Start of the aggregation period (inclusive), UTC midnight in RFC 3339 format (e.g. `2026-01-15T00:00:00Z`).

      format: date-time

    - `weekly_active_user_count: number`

      Number of users with token consumption in the 7-day rolling window

    - `weekly_adoption_rate: number`

      Percentage of assigned seats with activity in the 7-day rolling window (`WAU / assigned_seat_count * 100`). Null when the response is scoped to an RBAC group.

    - `chat_cowork_unified_daily_active_user_count: optional number`

      Number of users with activity in Chat and Cowork unified on the requested day. Omitted from the response on deployments that do not offer Chat and Cowork unified.

    - `chat_cowork_unified_monthly_active_user_count: optional number`

      Number of users with activity in Chat and Cowork unified in the 28-day rolling window (30 days when the request filters by `rbac_group_id`). Omitted from the response on deployments that do not offer Chat and Cowork unified.

    - `chat_cowork_unified_weekly_active_user_count: optional number`

      Number of users with activity in Chat and Cowork unified in the 7-day rolling window. Omitted from the response on deployments that do not offer Chat and Cowork unified.

    - `chat_daily_active_user_count: optional number`

      Number of users with claude.ai (chat) activity on the requested day. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `chat_monthly_active_user_count: optional number`

      Number of users with claude.ai (chat) activity in the 30-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `chat_weekly_active_user_count: optional number`

      Number of users with claude.ai (chat) activity in the 7-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `claude_code_daily_active_user_count: optional number`

      Number of users with Claude Code activity on the requested day. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `claude_code_monthly_active_user_count: optional number`

      Number of users with Claude Code activity in the 30-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `claude_code_weekly_active_user_count: optional number`

      Number of users with Claude Code activity in the 7-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `claude_design_daily_active_user_count: optional number`

      Number of users with Claude Design activity on the requested day. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `claude_design_monthly_active_user_count: optional number`

      Number of users with Claude Design activity in the 30-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `claude_design_weekly_active_user_count: optional number`

      Number of users with Claude Design activity in the 7-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `office_agent_daily_active_user_count: optional number`

      Number of users with Claude in Office activity on the requested day. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `office_agent_monthly_active_user_count: optional number`

      Number of users with Claude in Office activity in the 30-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `office_agent_weekly_active_user_count: optional number`

      Number of users with Claude in Office activity in the 7-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `science_daily_active_user_count: optional number`

      Number of users with Claude Science activity on the requested day. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `science_entitled_user_count: optional number`

      Number of users with a Claude Science seat entitlement (per-seat RBAC) at the time of the daily snapshot. The funnel top; independent of the org-level Claude Science toggle. Null when the response is scoped to an RBAC group — entitlement is org-wide and has no per-group analogue. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `science_monthly_active_user_count: optional number`

      Number of users with Claude Science activity in the 30-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

    - `science_weekly_active_user_count: optional number`

      Number of users with Claude Science activity in the 7-day rolling window. Omitted from the response while the per-product breakdown is not enabled for this organization.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results. Currently always null: the day series is returned in full.

#### Example

```bash
ant beta:organization:analytics:summaries list \
  --api-key my-anthropic-api-key \
  --starting-date ''\''2019-12-27'\'''
```

##### Response (200)

```json
{
  "data": [
    {
      "assigned_seat_count": 0,
      "cowork_daily_active_user_count": 0,
      "cowork_monthly_active_user_count": 0,
      "cowork_weekly_active_user_count": 0,
      "daily_active_user_count": 0,
      "daily_adoption_rate": 0,
      "ending_at": "2019-12-27T18:11:19.117Z",
      "monthly_active_user_count": 0,
      "monthly_adoption_rate": 0,
      "pending_invite_count": 0,
      "starting_at": "2019-12-27T18:11:19.117Z",
      "weekly_active_user_count": 0,
      "weekly_adoption_rate": 0,
      "chat_cowork_unified_daily_active_user_count": 0,
      "chat_cowork_unified_monthly_active_user_count": 0,
      "chat_cowork_unified_weekly_active_user_count": 0,
      "chat_daily_active_user_count": 0,
      "chat_monthly_active_user_count": 0,
      "chat_weekly_active_user_count": 0,
      "claude_code_daily_active_user_count": 0,
      "claude_code_monthly_active_user_count": 0,
      "claude_code_weekly_active_user_count": 0,
      "claude_design_daily_active_user_count": 0,
      "claude_design_monthly_active_user_count": 0,
      "claude_design_weekly_active_user_count": 0,
      "office_agent_daily_active_user_count": 0,
      "office_agent_monthly_active_user_count": 0,
      "office_agent_weekly_active_user_count": 0,
      "science_daily_active_user_count": 0,
      "science_entitled_user_count": 0,
      "science_monthly_active_user_count": 0,
      "science_weekly_active_user_count": 0
    }
  ],
  "next_page": "next_page",
  "summaries": [
    {
      "assigned_seat_count": 0,
      "cowork_daily_active_user_count": 0,
      "cowork_monthly_active_user_count": 0,
      "cowork_weekly_active_user_count": 0,
      "daily_active_user_count": 0,
      "daily_adoption_rate": 0,
      "ending_at": "2019-12-27T18:11:19.117Z",
      "monthly_active_user_count": 0,
      "monthly_adoption_rate": 0,
      "pending_invite_count": 0,
      "starting_at": "2019-12-27T18:11:19.117Z",
      "weekly_active_user_count": 0,
      "weekly_adoption_rate": 0,
      "chat_cowork_unified_daily_active_user_count": 0,
      "chat_cowork_unified_monthly_active_user_count": 0,
      "chat_cowork_unified_weekly_active_user_count": 0,
      "chat_daily_active_user_count": 0,
      "chat_monthly_active_user_count": 0,
      "chat_weekly_active_user_count": 0,
      "claude_code_daily_active_user_count": 0,
      "claude_code_monthly_active_user_count": 0,
      "claude_code_weekly_active_user_count": 0,
      "claude_design_daily_active_user_count": 0,
      "claude_design_monthly_active_user_count": 0,
      "claude_design_weekly_active_user_count": 0,
      "office_agent_daily_active_user_count": 0,
      "office_agent_monthly_active_user_count": 0,
      "office_agent_weekly_active_user_count": 0,
      "science_daily_active_user_count": 0,
      "science_entitled_user_count": 0,
      "science_monthly_active_user_count": 0,
      "science_weekly_active_user_count": 0
    }
  ]
}
```

## Organization › Analytics › Users

### List User Activity

`$ ant beta:organization:analytics:users list`

**GET** `/v1/organizations/analytics/users`

Get per-user activity for a given day, with cursor-based pagination.

Returns activity metrics for each user in the organization, sorted by email
address. Use `group_by[]` for per-RBAC-group aggregates, or `filter[]` to
scope results to specific members, groups, or a chat project. Available
to organizations on a Claude Enterprise plan. Requires an API key with
the `read:analytics` scope.

#### Parameters

- `--date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get user activity for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive); only valid with `starting_date`. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day), so this can be at most today — which is also the default when omitted, resolved once when the first page is served and reused for the rest of the pagination sequence. At most 366 days after `starting_date`.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `project_id`, `rbac_group_id`, `user_id`. Value forms: `project_id` takes a tagged project id (`claude_proj_...`); `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries. A `project_id` filter limits each member's row to their claude.ai chat activity in that project and cannot be combined with `group_by[]` or an `rbac_group_id` filter. On these rows, every count in `chat_cowork_unified_metrics.sessions` is 0, because sessions are not measured per project. On any day a member sent a chat message in Chat and Cowork unified, all of that member's project activity for the day is counted in `chat_cowork_unified_metrics.chat` instead of `chat_metrics`.

  maxItems: 100

- `--group-by: optional array of "rbac_group_id"` (query parameter)

  Dimensions to break results out by (e.g. `group_by[]=rbac_group_id`). Supported on this endpoint: `rbac_group_id`. Rows are already per-member, so the one supported grouping aggregates them per RBAC group instead. Grouped rows carry the requested dimension values as additional fields and paginate like ungrouped responses via `next_page`; an unsupported dimension returns 400. `rbac_group_id` attributes a user to every group they held at any point during each covered UTC day, so grouped rows are not an exclusive partition and can sum above org-level totals. At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100).

  minimum: 1, maximum: 1000

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction: `asc` or `desc`. Defaults to `asc` for the endpoint's sort column and to `desc` when `order_by` names a metric (a top-N ranking). Applies to `order_by`, or to the endpoint's default sort field when `order_by` is omitted.

- `--order-by: optional string` (query parameter)

  Sort field. Restricted to the endpoint's sort column plus its rankable metrics (metrics default to descending; a few metrics rank in date-range mode only, per the endpoint's documented orderable set).

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--starting-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of a date range (inclusive). Enables rollup mode: one row per entity aggregated over the whole range — addable counters are summed across days, and a distinct count is never summed where summing could double-count (a field's range value is recomputed exactly over the window, approximate via HLL with typical error under 2%, null, or — for the creation-event counts, whose per-day values cannot overlap — a per-day sum that is itself exact; each field's own description says which). Use either `date` or `starting_date`, not both. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

#### Returns

- `BetaAnalyticsUsersResponse: object`

  Response for GET /v1/organizations/analytics/users.

  - `data: array of BetaAnalyticsUserActivity`

    - `chat_metrics: object`

      Claude.ai activity metrics for a single user on a given day.

      - `connectors_used_count: number`

        Number of MCP connector invocations.

      - `distinct_artifacts_created_count: number`

        Number of distinct artifacts created. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

      - `distinct_connectors_used_count: number`

        Distinct claude.ai connectors this user used. Excludes calls whose connector could not be identified and all calls from organizations with zero data retention. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_conversation_count: number`

        Number of distinct conversations the user participated in. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_files_uploaded_count: number`

        Number of distinct files uploaded. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_projects_created_count: number`

        Number of distinct projects created. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

      - `distinct_projects_used_count: number`

        Number of distinct projects used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_shared_artifacts_viewed_count: number`

        Number of distinct shared artifacts the user viewed. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_skills_used_count: number`

        Number of distinct skills used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `message_count: number`

        Number of messages sent

      - `shared_conversations_viewed_count: number`

        Number of times the user opened a shared conversation in a project

      - `thinking_message_count: number`

        Number of messages that used extended thinking

    - `claude_code_metrics: object`

      Claude Code activity metrics for a single user on a given day.

      - `core_metrics: object`

        Core Claude Code activity metrics for a single user on a given day.

        - `artifacts_created_count: number`

          Number of artifacts created in Claude Code sessions: an artifact counts once, on the day a session first saves it. Counted from 2026-08-17; 0 on earlier days. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

        - `commit_count: number`

          Number of commits made via Claude Code

        - `distinct_session_count: number`

          Number of distinct Claude Code sessions. On aggregated rows and in date-range mode: summed per-day distinct counts. A session essentially never spans a UTC day, so the sum is in practice the true distinct count.

        - `lines_of_code: object`

          Lines of code added and removed via Claude Code.

          - `added_count: number`

            Lines of code added

          - `removed_count: number`

            Lines of code removed

        - `pull_request_count: number`

          Number of pull requests created via Claude Code

      - `tool_actions: object`

        Per-tool accepted/rejected counts for Claude Code file modification tools.

        - `edit_tool: object`

          Accepted/rejected counts for a single Claude Code tool type.

          - `accepted_count: number`

            Number of tool proposals accepted

          - `rejected_count: number`

            Number of tool proposals rejected

        - `multi_edit_tool: object`

          Accepted/rejected counts for a single Claude Code tool type.

          - `accepted_count: number`

            Number of tool proposals accepted

          - `rejected_count: number`

            Number of tool proposals rejected

        - `notebook_edit_tool: object`

          Accepted/rejected counts for a single Claude Code tool type.

          - `accepted_count: number`

            Number of tool proposals accepted

          - `rejected_count: number`

            Number of tool proposals rejected

        - `write_tool: object`

          Accepted/rejected counts for a single Claude Code tool type.

          - `accepted_count: number`

            Number of tool proposals accepted

          - `rejected_count: number`

            Number of tool proposals rejected

    - `cowork_metrics: object`

      Cowork activity metrics for a single user on a given day.

      - `action_count: number`

        Number of tool actions completed in Cowork sessions

      - `artifacts_created_count: number`

        Number of artifacts created in Cowork sessions: an artifact counts once, on the day a session first saves it. Counted from 2026-08-17; 0 on earlier days. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

      - `connectors_used_count: number`

        Total number of connector invocations in Cowork sessions

      - `dispatch_turn_count: number`

        Number of Dispatch (background agent) turns completed

      - `distinct_connectors_used_count: number`

        Number of distinct connectors used in Cowork sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_session_count: number`

        Number of distinct Cowork sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_skills_used_count: number`

        Number of distinct skills used in Cowork sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `message_count: number`

        Number of messages sent in Cowork sessions

      - `skills_used_count: number`

        Total number of skill invocations in Cowork sessions

      - `distinct_plugins_used_count: optional number`

        Number of distinct plugins used in Cowork sessions. Null while Cowork plugin-use metrics are not enabled for this organization. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `edit_tool_count: optional number`

        Number of successful Edit tool calls in Cowork sessions. Null while the file-edit metrics are not enabled for this organization.

      - `file_edit_count: optional number`

        Number of successful file-edit tool calls (Edit, MultiEdit, Write, NotebookEdit) in Cowork sessions. Null, never 0, while the file-edit metrics are not enabled for this organization.

      - `multi_edit_tool_count: optional number`

        Number of successful MultiEdit tool calls in Cowork sessions. Null while the file-edit metrics are not enabled for this organization.

      - `notebook_edit_tool_count: optional number`

        Number of successful NotebookEdit tool calls in Cowork sessions. Null while the file-edit metrics are not enabled for this organization.

      - `plugins_used_count: optional number`

        Total number of plugin invocations in Cowork sessions. Null while Cowork plugin-use metrics are not enabled for this organization.

      - `sessions_with_file_edits_count: optional number`

        Number of distinct Cowork sessions with at least one successful file-edit tool call. Null while the file-edit metrics are not enabled for this organization. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `write_tool_count: optional number`

        Number of successful Write tool calls in Cowork sessions. Null while the file-edit metrics are not enabled for this organization.

    - `design_metrics: object`

      Claude Design activity metrics for a single user on a given day.

      - `distinct_projects_created_count: number`

        Number of distinct Claude Design projects created. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

      - `distinct_projects_used_count: number`

        Number of distinct Claude Design projects the user worked in. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `distinct_session_count: number`

        Number of distinct Claude Design sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `message_count: number`

        Number of messages sent in Claude Design sessions

    - `office_metrics: object`

      Office Agent activity metrics for a single user on a given day, broken out by Office product.

      - `excel: object`

        Office Agent activity metrics for a single user on a given day within one Office product.

        - `connectors_used_count: number`

          Number of MCP connector invocations

        - `distinct_connectors_used_count: number`

          Number of distinct MCP connectors used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_session_count: number`

          Number of distinct Office Agent sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_skills_used_count: number`

          Number of distinct skills used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `message_count: number`

          Number of messages sent

        - `skills_used_count: number`

          Number of skill invocations

      - `outlook: object`

        Office Agent activity metrics for a single user on a given day within one Office product.

        - `connectors_used_count: number`

          Number of MCP connector invocations

        - `distinct_connectors_used_count: number`

          Number of distinct MCP connectors used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_session_count: number`

          Number of distinct Office Agent sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_skills_used_count: number`

          Number of distinct skills used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `message_count: number`

          Number of messages sent

        - `skills_used_count: number`

          Number of skill invocations

      - `powerpoint: object`

        Office Agent activity metrics for a single user on a given day within one Office product.

        - `connectors_used_count: number`

          Number of MCP connector invocations

        - `distinct_connectors_used_count: number`

          Number of distinct MCP connectors used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_session_count: number`

          Number of distinct Office Agent sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_skills_used_count: number`

          Number of distinct skills used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `message_count: number`

          Number of messages sent

        - `skills_used_count: number`

          Number of skill invocations

      - `word: object`

        Office Agent activity metrics for a single user on a given day within one Office product.

        - `connectors_used_count: number`

          Number of MCP connector invocations

        - `distinct_connectors_used_count: number`

          Number of distinct MCP connectors used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_session_count: number`

          Number of distinct Office Agent sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_skills_used_count: number`

          Number of distinct skills used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `message_count: number`

          Number of messages sent

        - `skills_used_count: number`

          Number of skill invocations

    - `science_metrics: object`

      Claude Science activity metrics for a single user on a given day.

      - `delegation_count: number`

        Number of delegations (handoffs to a specialized agent) in Claude Science sessions

      - `distinct_session_count: number`

        Number of distinct Claude Science sessions. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `message_count: number`

        Number of messages sent in Claude Science sessions

      - `remote_compute_job_count: number`

        Number of remote compute jobs launched from Claude Science sessions

      - `skills_used_count: number`

        Total number of skill invocations in Claude Science sessions

    - `web_search_count: number`

      Number of web searches performed

    - `chat_cowork_unified_metrics: optional object`

      Activity recorded while the member had Chat and Cowork unified (Cowork's features inside claude.ai chat) turned on, split into `chat` (chat activity) and `sessions` (Cowork activity). Omitted from the response on deployments that do not offer Chat and Cowork unified.

      - `chat: object`

        Chat activity recorded while members had Chat and Cowork unified turned
        on.

        - `connectors_used_count: number`

          Same measure as `chat_metrics.connectors_used_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `distinct_artifacts_created_count: number`

          Same measure as `chat_metrics.distinct_artifacts_created_count`, for activity recorded while members had Chat and Cowork unified turned on. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

        - `distinct_connectors_used_count: number`

          Same measure as `chat_metrics.distinct_connectors_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_conversation_count: number`

          Same measure as `chat_metrics.distinct_conversation_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_files_uploaded_count: number`

          Same measure as `chat_metrics.distinct_files_uploaded_count`, for activity recorded while members had Chat and Cowork unified turned on. It counts uploaded files as well as files Claude created and images returned by Claude's tools, such as screenshots. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_projects_created_count: number`

          Same measure as `chat_metrics.distinct_projects_created_count`, for activity recorded while members had Chat and Cowork unified turned on. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

        - `distinct_projects_used_count: number`

          Same measure as `chat_metrics.distinct_projects_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_shared_artifacts_viewed_count: number`

          Always null: shared-artifact views are not currently measured.

        - `distinct_skills_used_count: number`

          Same measure as `chat_metrics.distinct_skills_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `message_count: number`

          Same measure as `chat_metrics.message_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `shared_conversations_viewed_count: number`

          Same measure as `chat_metrics.shared_conversations_viewed_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `thinking_message_count: number`

          Same measure as `chat_metrics.thinking_message_count`, for activity recorded while members had Chat and Cowork unified turned on.

      - `sessions: object`

        Cowork session activity recorded while members had Chat and Cowork
        unified turned on.

        - `action_count: number`

          Same measure as `cowork_metrics.action_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `artifacts_created_count: number`

          Same measure as `cowork_metrics.artifacts_created_count`, for activity recorded while members had Chat and Cowork unified turned on. Exact in date-range mode: a creation belongs to exactly one day, so the per-day counts never overlap and their sum over the window is the exact count of distinct creations in it.

        - `connectors_used_count: number`

          Same measure as `cowork_metrics.connectors_used_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `dispatch_turn_count: number`

          Same measure as `cowork_metrics.dispatch_turn_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `distinct_connectors_used_count: number`

          Same measure as `cowork_metrics.distinct_connectors_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_plugins_used_count: number`

          Same measure as `cowork_metrics.distinct_plugins_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_session_count: number`

          Same measure as `cowork_metrics.distinct_session_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `distinct_skills_used_count: number`

          Same measure as `cowork_metrics.distinct_skills_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `edit_tool_count: number`

          Same measure as `cowork_metrics.edit_tool_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `file_edit_count: number`

          Same measure as `cowork_metrics.file_edit_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `message_count: number`

          Same measure as `cowork_metrics.message_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `multi_edit_tool_count: number`

          Same measure as `cowork_metrics.multi_edit_tool_count`, for activity recorded while members had Chat and Cowork unified turned on. Claude no longer has a multi-edit tool, so expect 0 when not null; each edit is now a separate Edit tool call, counted in `edit_tool_count` and `file_edit_count`.

        - `notebook_edit_tool_count: number`

          Same measure as `cowork_metrics.notebook_edit_tool_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `plugins_used_count: number`

          Same measure as `cowork_metrics.plugins_used_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `sessions_with_file_edits_count: number`

          Same measure as `cowork_metrics.sessions_with_file_edits_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

        - `skills_used_count: number`

          Same measure as `cowork_metrics.skills_used_count`, for activity recorded while members had Chat and Cowork unified turned on.

        - `write_tool_count: number`

          Same measure as `cowork_metrics.write_tool_count`, for activity recorded while members had Chat and Cowork unified turned on.

    - `distinct_user_count: optional number`

      Number of distinct active users represented by this row. Only set for grouped rollups (`group_by[]`); null for per-user rows. In date-range mode, recomputed as an exact distinct count of the group's active members over the requested window, never a sum of per-day values.

    - `last_activity_date: optional string`

      Most recent UTC day (YYYY-MM-DD) on which the user had any counted activity, within the requested window: equal to the requested `date` in single-day mode, and to the latest active day from `starting_date` (inclusive) to `ending_date` (exclusive) in date-range rollup mode — never a day earlier than the window start. On filtered requests (`filter[]`) only days matching the filter count: with `filter[]=rbac_group_id:{id}` it is the last day the user was active while a member of that group, consistent with the row's other metrics. On grouped (`group_by[]`) rows it is the latest day any member of the group was active (the requested `date` in single-day mode). Omitted from the response while last-activity reporting is not enabled for this organization.

      format: date

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `user: optional object`

      The user this row describes. Null on rows aggregated across users.

      - `type: "user"`

        Object type. Always `user`.

      - `id: string`

        Tagged user identifier (e.g. `user_...`)

      - `email_address: string`

        Email address of the user

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results

#### Example

```bash
ant beta:organization:analytics:users list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "chat_metrics": {
        "connectors_used_count": 0,
        "distinct_artifacts_created_count": 0,
        "distinct_connectors_used_count": 0,
        "distinct_conversation_count": 0,
        "distinct_files_uploaded_count": 0,
        "distinct_projects_created_count": 0,
        "distinct_projects_used_count": 0,
        "distinct_shared_artifacts_viewed_count": 0,
        "distinct_skills_used_count": 0,
        "message_count": 0,
        "shared_conversations_viewed_count": 0,
        "thinking_message_count": 0
      },
      "claude_code_metrics": {
        "core_metrics": {
          "artifacts_created_count": 0,
          "commit_count": 0,
          "distinct_session_count": 0,
          "lines_of_code": {
            "added_count": 0,
            "removed_count": 0
          },
          "pull_request_count": 0
        },
        "tool_actions": {
          "edit_tool": {
            "accepted_count": 0,
            "rejected_count": 0
          },
          "multi_edit_tool": {
            "accepted_count": 0,
            "rejected_count": 0
          },
          "notebook_edit_tool": {
            "accepted_count": 0,
            "rejected_count": 0
          },
          "write_tool": {
            "accepted_count": 0,
            "rejected_count": 0
          }
        }
      },
      "cowork_metrics": {
        "action_count": 0,
        "artifacts_created_count": 0,
        "connectors_used_count": 0,
        "dispatch_turn_count": 0,
        "distinct_connectors_used_count": 0,
        "distinct_session_count": 0,
        "distinct_skills_used_count": 0,
        "message_count": 0,
        "skills_used_count": 0,
        "distinct_plugins_used_count": 0,
        "edit_tool_count": 0,
        "file_edit_count": 0,
        "multi_edit_tool_count": 0,
        "notebook_edit_tool_count": 0,
        "plugins_used_count": 0,
        "sessions_with_file_edits_count": 0,
        "write_tool_count": 0
      },
      "design_metrics": {
        "distinct_projects_created_count": 0,
        "distinct_projects_used_count": 0,
        "distinct_session_count": 0,
        "message_count": 0
      },
      "office_metrics": {
        "excel": {
          "connectors_used_count": 0,
          "distinct_connectors_used_count": 0,
          "distinct_session_count": 0,
          "distinct_skills_used_count": 0,
          "message_count": 0,
          "skills_used_count": 0
        },
        "outlook": {
          "connectors_used_count": 0,
          "distinct_connectors_used_count": 0,
          "distinct_session_count": 0,
          "distinct_skills_used_count": 0,
          "message_count": 0,
          "skills_used_count": 0
        },
        "powerpoint": {
          "connectors_used_count": 0,
          "distinct_connectors_used_count": 0,
          "distinct_session_count": 0,
          "distinct_skills_used_count": 0,
          "message_count": 0,
          "skills_used_count": 0
        },
        "word": {
          "connectors_used_count": 0,
          "distinct_connectors_used_count": 0,
          "distinct_session_count": 0,
          "distinct_skills_used_count": 0,
          "message_count": 0,
          "skills_used_count": 0
        }
      },
      "science_metrics": {
        "delegation_count": 0,
        "distinct_session_count": 0,
        "message_count": 0,
        "remote_compute_job_count": 0,
        "skills_used_count": 0
      },
      "web_search_count": 0,
      "chat_cowork_unified_metrics": {
        "chat": {
          "connectors_used_count": 0,
          "distinct_artifacts_created_count": 0,
          "distinct_connectors_used_count": 0,
          "distinct_conversation_count": 0,
          "distinct_files_uploaded_count": 0,
          "distinct_projects_created_count": 0,
          "distinct_projects_used_count": 0,
          "distinct_shared_artifacts_viewed_count": 0,
          "distinct_skills_used_count": 0,
          "message_count": 0,
          "shared_conversations_viewed_count": 0,
          "thinking_message_count": 0
        },
        "sessions": {
          "action_count": 0,
          "artifacts_created_count": 0,
          "connectors_used_count": 0,
          "dispatch_turn_count": 0,
          "distinct_connectors_used_count": 0,
          "distinct_plugins_used_count": 0,
          "distinct_session_count": 0,
          "distinct_skills_used_count": 0,
          "edit_tool_count": 0,
          "file_edit_count": 0,
          "message_count": 0,
          "multi_edit_tool_count": 0,
          "notebook_edit_tool_count": 0,
          "plugins_used_count": 0,
          "sessions_with_file_edits_count": 0,
          "skills_used_count": 0,
          "write_tool_count": 0
        }
      },
      "distinct_user_count": 0,
      "last_activity_date": "2019-12-27",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "user": {
        "id": "id",
        "email_address": "email_address",
        "type": "user"
      }
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Analytics › Apps › Chat › Projects

### Get Chat Project Usage

`$ ant beta:organization:analytics:apps:chat:projects list`

**GET** `/v1/organizations/analytics/apps/chat/projects`

Get per-project activity for a given day, with cursor-based pagination.

Returns activity metrics for each project in the organization, sorted by
project ID. Use `group_by[]` to break projects out per member or per RBAC
group, and `filter[]` to scope results; the parameter descriptions list the
supported dimensions. Available to organizations on a Claude Enterprise
plan. Requires an API key with the `read:analytics` scope.

#### Parameters

- `--date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get project activity for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive); only valid with `starting_date`. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day), so this can be at most today — which is also the default when omitted, resolved once when the first page is served and reused for the rest of the pagination sequence. At most 366 days after `starting_date`.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `project_id`, `rbac_group_id`, `user_id`. Value forms: `project_id` takes a tagged project id (`claude_proj_...`); `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries.

  maxItems: 100

- `--group-by: optional array of "rbac_group_id" or "user_id"` (query parameter)

  Dimensions to break results out by (e.g. `group_by[]=user_id`). Supported on this endpoint: `rbac_group_id`, `user_id`. Grouped rows carry the requested dimension values as additional fields and paginate like ungrouped responses via `next_page`; an unsupported dimension returns 400. `rbac_group_id` attributes a user to every group they held at any point during each covered UTC day, so grouped rows are not an exclusive partition and can sum above org-level totals. At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100).

  minimum: 1, maximum: 1000

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction: `asc` or `desc`. Defaults to `asc` for the endpoint's sort column and to `desc` when `order_by` names a metric (a top-N ranking). Applies to `order_by`, or to the endpoint's default sort field when `order_by` is omitted.

- `--order-by: optional string` (query parameter)

  Sort field. Restricted to the endpoint's sort column plus its rankable metrics (metrics default to descending; a few metrics rank in date-range mode only, per the endpoint's documented orderable set).

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--starting-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of a date range (inclusive). Enables rollup mode: one row per entity aggregated over the whole range — addable counters are summed across days, and a distinct count is never summed where summing could double-count (a field's range value is recomputed exactly over the window, approximate via HLL with typical error under 2%, null, or — for the creation-event counts, whose per-day values cannot overlap — a per-day sum that is itself exact; each field's own description says which). Use either `date` or `starting_date`, not both. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

#### Returns

- `BetaAnalyticsProjectsResponse: object`

  Response for GET /v1/organizations/analytics/apps/chat/projects.

  - `data: array of BetaAnalyticsProjectActivity`

    - `distinct_user_count: number`

      Number of distinct users who used the project on the requested day, or, in date-range mode, over the requested window — recomputed as an exact distinct count over the window's per-member daily rows, never a sum of per-day values.

    - `message_count: number`

      Number of messages sent in the project on the requested day

    - `project_id: string`

      Tagged project identifier (e.g. `claude_proj_...`)

    - `project_name: string`

      Name of the project

    - `created_at: optional string`

      Project creation timestamp in RFC 3339 format. Null if the project was deleted before attribution was recorded.

      format: date-time

    - `created_by: optional object`

      User who created the project. Null if the project was deleted before attribution was recorded, or if the creator's account no longer exists.

      - `type: "user"`

        Object type. Always `user`.

      - `id: string`

        Tagged user identifier (e.g. `user_...`)

      - `email_address: string`

        Email address of the user

    - `distinct_conversation_count: optional number`

      Number of distinct conversations in the project. Null on aggregated rows where a distinct count cannot be computed.

    - `product: optional string`

      Product that produced this row's activity: one of `chat`, `claude_code`, `cowork`, `office_agent`, or `chat_cowork_unified` (Chat and Cowork unified). These are the canonical Cost & Usage product names; an `office_agent` row's per-surface breakdown is in its `office_metrics`. On `/plugins` only `cowork`, `claude_code` and `chat_cowork_unified` occur (the only surfaces with plugin attribution); on `/artifacts` only `chat`, `claude_code`, `cowork` and `chat_cowork_unified` occur (the surfaces that create artifacts); `/apps/chat/projects` does not support the product dimension (a `product` entry in `group_by[]` or `filter[]` there is rejected). Present only when the request grouped by `product`.

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `user_id: optional string`

      Tagged user identifier (e.g. `user_...`). Present only when the request grouped by `user_id`.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results

#### Example

```bash
ant beta:organization:analytics:apps:chat:projects list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "distinct_user_count": 0,
      "message_count": 0,
      "project_id": "project_id",
      "project_name": "project_name",
      "created_at": "2019-12-27T18:11:19.117Z",
      "created_by": {
        "id": "id",
        "email_address": "email_address",
        "type": "user"
      },
      "distinct_conversation_count": 0,
      "product": "product",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "user_id": "user_id"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Analytics › Connectors

### Get Connector Usage

`$ ant beta:organization:analytics:connectors list`

**GET** `/v1/organizations/analytics/connectors`

Get per-connector usage for a given day, with cursor-based pagination.

Returns connector usage metrics for the organization, sorted by connector
name. Connector names are normalized from their various sources — for
example, "Atlassian MCP server" and "mcp-atlassian" both appear as
"atlassian". Use `group_by[]` to break usage out per member, per RBAC
group, or per product surface, and `filter[]` to scope results; the
parameter descriptions list the supported dimensions. Available to
organizations on a Claude Enterprise plan. Requires an API key with the
`read:analytics` scope.

#### Parameters

- `--date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get connector usage for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive); only valid with `starting_date`. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day), so this can be at most today — which is also the default when omitted, resolved once when the first page is served and reused for the rest of the pagination sequence. At most 366 days after `starting_date`.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `connector_name`, `product`, `rbac_group_id`, `user_id`. Value forms: `connector_name` matches case-insensitively, a display name such as 'GitHub MCP' also matches its normalized stored form ('github'), and for rows whose `connector_name` is an opaque connector id the connector's display name (`connector_display_name`) also matches; `product` is one of `chat_cowork_unified`, `chat`, `claude_code`, `cowork`, or `office_agent`; `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries. `chat_cowork_unified` is accepted as a `product` value only on deployments that offer Chat and Cowork unified.

  maxItems: 100

- `--group-by: optional array of "product" or "rbac_group_id" or "user_id"` (query parameter)

  Dimensions to break results out by (e.g. `group_by[]=user_id`). Supported on this endpoint: `product`, `rbac_group_id`, `user_id`. Grouped rows carry the requested dimension values as additional fields and paginate like ungrouped responses via `next_page`; an unsupported dimension returns 400. `rbac_group_id` attributes a user to every group they held at any point during each covered UTC day, so grouped rows are not an exclusive partition and can sum above org-level totals. At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100).

  minimum: 1, maximum: 1000

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction: `asc` or `desc`. Defaults to `asc` for the endpoint's sort column and to `desc` when `order_by` names a metric (a top-N ranking). Applies to `order_by`, or to the endpoint's default sort field when `order_by` is omitted.

- `--order-by: optional string` (query parameter)

  Sort field. Restricted to the endpoint's sort column plus its rankable metrics (metrics default to descending; a few metrics rank in date-range mode only, per the endpoint's documented orderable set).

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--starting-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of a date range (inclusive). Enables rollup mode: one row per entity aggregated over the whole range — addable counters are summed across days, and a distinct count is never summed where summing could double-count (a field's range value is recomputed exactly over the window, approximate via HLL with typical error under 2%, null, or — for the creation-event counts, whose per-day values cannot overlap — a per-day sum that is itself exact; each field's own description says which). Use either `date` or `starting_date`, not both. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

#### Returns

- `BetaAnalyticsConnectorsResponse: object`

  Response for GET /v1/organizations/analytics/connectors.

  - `data: array of BetaAnalyticsConnectorActivity`

    - `chat_metrics: object`

      Claude.ai activity metrics for a single connector on a given day.

      - `distinct_conversation_connector_used_count: number`

        Number of distinct conversations in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `claude_code_metrics: object`

      Claude Code activity metrics for a single connector on a given day.

      - `distinct_session_connector_used_count: number`

        Number of distinct Claude Code sessions in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `connector_name: string`

      Name of the connector. Some rows carry an opaque connector id here instead of a readable name; `connector_display_name` holds the resolved name for those rows.

    - `cowork_metrics: object`

      Cowork activity metrics for a single connector on a given day.

      - `distinct_session_connector_used_count: number`

        Number of distinct Cowork sessions in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `distinct_user_count: number`

      Number of distinct users who used the connector on the requested day, or, in date-range mode, over the requested window — recomputed as an exact distinct count over the window's per-member daily rows, never a sum of per-day values.

    - `office_metrics: object`

      Office Agent activity metrics for a single connector on a given day, broken out by Office product.

      - `excel: object`

        Office Agent activity metrics for a single connector on a given day within one Office product.

        - `distinct_session_connector_used_count: number`

          Number of distinct Office Agent sessions in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `outlook: object`

        Office Agent activity metrics for a single connector on a given day within one Office product.

        - `distinct_session_connector_used_count: number`

          Number of distinct Office Agent sessions in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `powerpoint: object`

        Office Agent activity metrics for a single connector on a given day within one Office product.

        - `distinct_session_connector_used_count: number`

          Number of distinct Office Agent sessions in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `word: object`

        Office Agent activity metrics for a single connector on a given day within one Office product.

        - `distinct_session_connector_used_count: number`

          Number of distinct Office Agent sessions in which the connector was used. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `chat_cowork_unified_metrics: optional object`

      Connector use recorded while members had Chat and Cowork unified (Cowork's features inside claude.ai chat) turned on, split into chat conversations and Cowork sessions. A count is null in date-range mode where it cannot be computed. Omitted from the response on deployments that do not offer Chat and Cowork unified.

      - `chat: object`

        A connector's use in chat conversations recorded while members had
        Chat and Cowork unified turned on.

        - `distinct_conversation_connector_used_count: number`

          Same measure as `chat_metrics.distinct_conversation_connector_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `sessions: object`

        A connector's use in Cowork sessions recorded while members had
        Chat and Cowork unified turned on.

        - `distinct_session_connector_used_count: number`

          Same measure as `cowork_metrics.distinct_session_connector_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `connector_display_name: optional string`

      Human-readable display name for rows whose `connector_name` is an opaque connector id rather than a readable name, resolved at request time from the organization's connectors (including connectors that have since been removed). `connector_name` remains the row's stable key for sorting and pagination, and `filter[]=connector_name:{value}` also matches these rows by display name. Display names are not unique, and the same connector's claude.ai usage can appear under a separate row with a readable `connector_name`. Null when `connector_name` is already a readable name, when the id cannot be resolved to one of the organization's connectors, or when display-name resolution is not enabled for this organization.

    - `individual_auth_distinct_user_count: optional number`

      Number of distinct users whose use of this connector on the requested day ran on their own individual credential, connected through their own consent flow. Companion bucket to `managed_auth_distinct_user_count`, which carries the measurement, attribution, and null rules. Users whose requests used no stored credential count in neither bucket.

    - `managed_auth_distinct_user_count: optional number`

      Number of distinct users whose use of this connector on the requested day ran on Enterprise Managed Auth (an organization-managed credential provisioned through the organization's identity provider), read from the token record each request used. Null, never 0, when managed-auth reporting is not enabled for the organization, the value cannot be attributed to the row, no credentialed requests and no managed-token mint events (a managed credential being provisioned for a user's use of the connector) were observed that day, or the day predates 2026-07-01, the first day the backing data exists (forward-only data, no backfill). When credentialed requests or mint events were observed and attributed, both managed-auth fields populate, reporting 0 for a bucket with no users; the two counts are independent, not a partition — a user whose requests that day used both kinds of credential counts in both. Mint events carry user but not surface attribution, so they count as observed auth activity on `user_id` and `rbac_group_id` cuts — attributed to the user the credential was provisioned for — but never on a cut that references `product` (group or filter). Date-range rollup mode (`starting_date`/`ending_date`) computes both fields exactly over the window — distinct users with at least one qualifying day — when the whole window starts on or after 2026-07-01, with the null-versus-0 and mint-event rules applying with the window in place of the day; a range starting earlier reports every managed-auth field as null, never a partial-window value.

    - `product: optional string`

      Product that produced this row's activity: one of `chat`, `claude_code`, `cowork`, `office_agent`, or `chat_cowork_unified` (Chat and Cowork unified). These are the canonical Cost & Usage product names; an `office_agent` row's per-surface breakdown is in its `office_metrics`. On `/plugins` only `cowork`, `claude_code` and `chat_cowork_unified` occur (the only surfaces with plugin attribution); on `/artifacts` only `chat`, `claude_code`, `cowork` and `chat_cowork_unified` occur (the surfaces that create artifacts); `/apps/chat/projects` does not support the product dimension (a `product` entry in `group_by[]` or `filter[]` there is rejected). Present only when the request grouped by `product`.

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `read_call_count: optional number`

      Number of connector tool calls on the requested day whose trusted read-only annotation marked them read-only. Call count, not distinct users. Every call recorded on a classified surface lands in exactly one of `read_call_count`, `write_call_count`, or `unclassified_call_count`, so the three sum to the day's classified calls. Classification is forward-only per surface: claude.ai from 2026-06-01, Claude Code from 2026-05-30, Claude in Office from 2026-05-29, Cowork from 2026-06-02 (Cowork clients predating annotation forwarding land in `unclassified_call_count`). Null, never 0, when the value cannot be stated: the read/write split is not enabled for this organization, or the day predates 2026-05-29. For a date-range total, sum the per-day values, but treat a window that extends before 2026-05-29 as null rather than summing only its covered days — date-range rollup mode (`starting_date`/`ending_date`) applies both rules server-side.

    - `unclassified_call_count: optional number`

      Number of connector tool calls on the requested day with no trusted read-only annotation — the annotation is optional in the MCP spec and is discarded when connector access controls are active, so unclassified calls are common. This field shows how much of the day's classified activity the read/write split actually covers. Call count, not distinct users. One of the three call-classification buckets; see `read_call_count` for the per-surface data-start dates, null conditions, and date-range guidance.

    - `user_id: optional string`

      Tagged user identifier (e.g. `user_...`). Present only when the request grouped by `user_id`.

    - `write_call_count: optional number`

      Number of connector tool calls on the requested day whose trusted read-only annotation marked them not read-only. Call count, not distinct users. One of the three call-classification buckets; see `read_call_count` for the per-surface data-start dates, null conditions, and date-range guidance.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results

#### Example

```bash
ant beta:organization:analytics:connectors list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "chat_metrics": {
        "distinct_conversation_connector_used_count": 0
      },
      "claude_code_metrics": {
        "distinct_session_connector_used_count": 0
      },
      "connector_name": "connector_name",
      "cowork_metrics": {
        "distinct_session_connector_used_count": 0
      },
      "distinct_user_count": 0,
      "office_metrics": {
        "excel": {
          "distinct_session_connector_used_count": 0
        },
        "outlook": {
          "distinct_session_connector_used_count": 0
        },
        "powerpoint": {
          "distinct_session_connector_used_count": 0
        },
        "word": {
          "distinct_session_connector_used_count": 0
        }
      },
      "chat_cowork_unified_metrics": {
        "chat": {
          "distinct_conversation_connector_used_count": 0
        },
        "sessions": {
          "distinct_session_connector_used_count": 0
        }
      },
      "connector_display_name": "connector_display_name",
      "individual_auth_distinct_user_count": 0,
      "managed_auth_distinct_user_count": 0,
      "product": "product",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "read_call_count": 0,
      "unclassified_call_count": 0,
      "user_id": "user_id",
      "write_call_count": 0
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Analytics › Plugins

### Get Plugin Usage

`$ ant beta:organization:analytics:plugins list`

**GET** `/v1/organizations/analytics/plugins`

Get per-plugin install + invocation usage for a given day, with pagination.

Returns plugin usage metrics for the organization across Cowork and Claude
Code, sorted by plugin name. The `plugin_name` value `third-party` is
an aggregate bucket, not a plugin: it collects plugin activity, from
either surface, for which the reporting client did not provide a plugin
name — so an organization's own plugins can contribute both to their own
named rows and to this bucket. Use `group_by[]` to break usage out per
member, per RBAC group, or per product surface (Cowork / Claude Code),
and `filter[]` to scope results; the parameter descriptions list the
supported dimensions. Requires an API key with the
`read:analytics` scope. `starting_date` / `ending_date` select
range-rollup mode like `/skills`.

#### Parameters

- `--date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get plugin usage for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive); only valid with `starting_date`. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day), so this can be at most today — which is also the default when omitted, resolved once when the first page is served and reused for the rest of the pagination sequence. At most 366 days after `starting_date`.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `plugin_name`, `product`, `rbac_group_id`, `user_id`. Value forms: `plugin_name` matches case-insensitively; `product` is `chat_cowork_unified`, `claude_code`, or `cowork` (the only surfaces with plugin attribution); `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries. `chat_cowork_unified` is accepted as a `product` value only on deployments that offer Chat and Cowork unified.

  maxItems: 100

- `--group-by: optional array of "product" or "rbac_group_id" or "user_id"` (query parameter)

  Dimensions to break results out by (e.g. `group_by[]=user_id`). Supported on this endpoint: `product`, `rbac_group_id`, `user_id`. On this endpoint `product` takes the values `chat_cowork_unified`, `claude_code`, or `cowork` only (the surfaces with plugin attribution). Grouped rows carry the requested dimension values as additional fields and paginate like ungrouped responses via `next_page`; an unsupported dimension returns 400. `rbac_group_id` attributes a user to every group they held at any point during each covered UTC day, so grouped rows are not an exclusive partition and can sum above org-level totals. At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100).

  minimum: 1, maximum: 1000

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction: `asc` or `desc`. Defaults to `asc` for the endpoint's sort column and to `desc` when `order_by` names a metric (a top-N ranking). Applies to `order_by`, or to the endpoint's default sort field when `order_by` is omitted.

- `--order-by: optional string` (query parameter)

  Sort field. Restricted to the endpoint's sort column plus its rankable metrics (metrics default to descending; a few metrics rank in date-range mode only, per the endpoint's documented orderable set).

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--starting-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of a date range (inclusive). Enables rollup mode: one row per entity aggregated over the whole range — addable counters are summed across days, and a distinct count is never summed where summing could double-count (a field's range value is recomputed exactly over the window, approximate via HLL with typical error under 2%, null, or — for the creation-event counts, whose per-day values cannot overlap — a per-day sum that is itself exact; each field's own description says which). Use either `date` or `starting_date`, not both. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

#### Returns

- `BetaAnalyticsPluginsResponse: object`

  Response for GET /v1/organizations/analytics/plugins.

  - `data: array of BetaAnalyticsPluginActivity`

    - `claude_code_metrics: object`

      Claude Code activity metrics for a single plugin on a given day.

      - `distinct_session_plugin_used_count: number`

        Number of distinct Claude Code sessions in which the plugin was invoked. Null on aggregated rows where a distinct count cannot be computed.

    - `cowork_metrics: object`

      Cowork activity metrics for a single plugin on a given day.

      - `distinct_session_plugin_used_count: number`

        Number of distinct Cowork sessions in which the plugin was invoked. Null on aggregated rows where a distinct count cannot be computed.

    - `distinct_user_count: number`

      Number of distinct users with recorded install or invocation activity for the plugin on the requested day (install-only users count), or, in date-range mode, over the requested window — recomputed as an exact distinct count over the window's per-member daily rows, never a sum of per-day values.

    - `install_count: number`

      Number of distinct users who installed the plugin on the requested day, or, in date-range mode, over the requested window — recomputed as an exact distinct count over the window's per-member daily rows, never a sum of per-day values.

    - `invocation_count: number`

      Number of plugin invocations on the requested day

    - `plugin_name: string`

      Name of the plugin

    - `chat_cowork_unified_metrics: optional object`

      Plugin use recorded while members had Chat and Cowork unified (Cowork's features inside claude.ai chat) turned on. A count is null in date-range mode where it cannot be computed. Omitted from the response on deployments that do not offer Chat and Cowork unified.

      - `distinct_session_plugin_used_count: number`

        Same measure as `cowork_metrics.distinct_session_plugin_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Null on aggregated rows where a distinct count cannot be computed.

    - `plugin_id: optional string`

      Stable plugin identifier when available (e.g. `serena@claude-plugins-official`). Null for third-party Claude Code plugins (redacted at the source) and Cowork slash commands that carry only a hashed id.

    - `product: optional string`

      Product that produced this row's activity: one of `chat`, `claude_code`, `cowork`, `office_agent`, or `chat_cowork_unified` (Chat and Cowork unified). These are the canonical Cost & Usage product names; an `office_agent` row's per-surface breakdown is in its `office_metrics`. On `/plugins` only `cowork`, `claude_code` and `chat_cowork_unified` occur (the only surfaces with plugin attribution); on `/artifacts` only `chat`, `claude_code`, `cowork` and `chat_cowork_unified` occur (the surfaces that create artifacts); `/apps/chat/projects` does not support the product dimension (a `product` entry in `group_by[]` or `filter[]` there is rejected). Present only when the request grouped by `product`.

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `user_id: optional string`

      Tagged user identifier (e.g. `user_...`). Present only when the request grouped by `user_id`.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results

#### Example

```bash
ant beta:organization:analytics:plugins list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "claude_code_metrics": {
        "distinct_session_plugin_used_count": 0
      },
      "cowork_metrics": {
        "distinct_session_plugin_used_count": 0
      },
      "distinct_user_count": 0,
      "install_count": 0,
      "invocation_count": 0,
      "plugin_name": "plugin_name",
      "chat_cowork_unified_metrics": {
        "distinct_session_plugin_used_count": 0
      },
      "plugin_id": "plugin_id",
      "product": "product",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "user_id": "user_id"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Analytics › Skills

### Get Skill Usage

`$ ant beta:organization:analytics:skills list`

**GET** `/v1/organizations/analytics/skills`

Get per-skill usage for a given day, with cursor-based pagination.

Returns skill usage metrics for the organization, sorted by skill name.
Use `group_by[]` to break usage out per member, per RBAC group, or per
product surface, and `filter[]` to scope results; the parameter
descriptions list the supported dimensions. Available to organizations
on a Claude Enterprise plan. Requires an API key with the
`read:analytics` scope.

#### Parameters

- `--date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get skill usage for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive); only valid with `starting_date`. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day), so this can be at most today — which is also the default when omitted, resolved once when the first page is served and reused for the rest of the pagination sequence. At most 366 days after `starting_date`.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `product`, `rbac_group_id`, `share_status`, `skill_name`, `user_id`. Value forms: `product` is one of `chat_cowork_unified`, `chat`, `claude_code`, `cowork`, or `office_agent`; `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `share_status` is one of `organization`, `private`, or `public`; `skill_name` matches case-insensitively; `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries. `chat_cowork_unified` is accepted as a `product` value only on deployments that offer Chat and Cowork unified.

  maxItems: 100

- `--group-by: optional array of "product" or "rbac_group_id" or "user_id"` (query parameter)

  Dimensions to break results out by (e.g. `group_by[]=user_id`). Supported on this endpoint: `product`, `rbac_group_id`, `user_id`. Grouped rows carry the requested dimension values as additional fields and paginate like ungrouped responses via `next_page`; an unsupported dimension returns 400. `rbac_group_id` attributes a user to every group they held at any point during each covered UTC day, so grouped rows are not an exclusive partition and can sum above org-level totals. At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100).

  minimum: 1, maximum: 1000

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction: `asc` or `desc`. Defaults to `asc` for the endpoint's sort column and to `desc` when `order_by` names a metric (a top-N ranking). Applies to `order_by`, or to the endpoint's default sort field when `order_by` is omitted.

- `--order-by: optional string` (query parameter)

  Sort field. Restricted to the endpoint's sort column plus its rankable metrics (metrics default to descending; a few metrics rank in date-range mode only, per the endpoint's documented orderable set).

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--starting-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of a date range (inclusive). Enables rollup mode: one row per entity aggregated over the whole range — addable counters are summed across days, and a distinct count is never summed where summing could double-count (a field's range value is recomputed exactly over the window, approximate via HLL with typical error under 2%, null, or — for the creation-event counts, whose per-day values cannot overlap — a per-day sum that is itself exact; each field's own description says which). Use either `date` or `starting_date`, not both. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

#### Returns

- `BetaAnalyticsSkillsResponse: object`

  Response for GET /v1/organizations/analytics/skills.

  - `data: array of BetaAnalyticsSkillActivity`

    - `chat_metrics: object`

      Claude.ai activity metrics for a single skill on a given day.

      - `distinct_conversation_skill_used_count: number`

        Number of distinct conversations in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `claude_code_metrics: object`

      Claude Code activity metrics for a single skill on a given day.

      - `distinct_session_skill_used_count: number`

        Number of distinct Claude Code sessions in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `cowork_metrics: object`

      Cowork activity metrics for a single skill on a given day.

      - `distinct_session_skill_used_count: number`

        Number of distinct Cowork sessions in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `distinct_user_count: number`

      Number of distinct users who used the skill on the requested day, or, in date-range mode, over the requested window — recomputed as an exact distinct count over the window's per-member daily rows, never a sum of per-day values. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted.

    - `office_metrics: object`

      Office Agent activity metrics for a single skill on a given day, broken out by Office product.

      - `excel: object`

        Office Agent activity metrics for a single skill on a given day within one Office product.

        - `distinct_session_skill_used_count: number`

          Number of distinct Office Agent sessions in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `outlook: object`

        Office Agent activity metrics for a single skill on a given day within one Office product.

        - `distinct_session_skill_used_count: number`

          Number of distinct Office Agent sessions in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `powerpoint: object`

        Office Agent activity metrics for a single skill on a given day within one Office product.

        - `distinct_session_skill_used_count: number`

          Number of distinct Office Agent sessions in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `word: object`

        Office Agent activity metrics for a single skill on a given day within one Office product.

        - `distinct_session_skill_used_count: number`

          Number of distinct Office Agent sessions in which the skill was used. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `skill_name: string`

      Name of the skill

    - `attributed_list_price: optional string`

      List-price (rate-card) value of the member requests attributed to this skill, as a decimal string in the minor unit of `currency` (cents for USD), from Claude Code, Cowork, and Office Agent request-level attribution — the value of requests that involved the skill, not the skill's incremental cost. Unlike `estimated_overage_spend` this reflects usage value regardless of how it was funded — seat-covered usage counts — but it is undiscounted and does not tie to billed spend or the organization's spend reporting. claude.ai chat usage carries no request-level attribution and contributes nothing: the field is null on `chat` product rows and on `office_agent` product cuts dated before 2026-06-18 (the Office Agent attribution data-start), and on ungrouped rows it covers the Claude Code + Cowork + Office Agent share only (null when no attributable usage exists). Also null under the same conditions as `estimated_overage_spend` (spend reporting not enabled for this organization, `office_agent` product cuts before the 2026-06-18 data-start). "0" means attributable usage existed but none was attributed to this skill. Addable across days: date-range rollup mode returns the window's sum. On `group_by[]` and `filter[]` shapes both amounts can total below the ungrouped value for the same skill over the same date or range: spend attributed to a member–skill pair with no counted usage on that day is excluded from those cuts.

    - `chat_cowork_unified_metrics: optional object`

      Skill use recorded while members had Chat and Cowork unified (Cowork's features inside claude.ai chat) turned on, split into chat conversations and Cowork sessions. A count is null in date-range mode where it cannot be computed. Omitted from the response on deployments that do not offer Chat and Cowork unified.

      - `chat: object`

        A skill's use in chat conversations recorded while members had
        Chat and Cowork unified turned on.

        - `distinct_conversation_skill_used_count: number`

          Same measure as `chat_metrics.distinct_conversation_skill_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

      - `sessions: object`

        A skill's use in Cowork sessions recorded while members had Chat
        and Cowork unified turned on.

        - `distinct_session_skill_used_count: number`

          Same measure as `cowork_metrics.distinct_session_skill_used_count`, for activity recorded while members had Chat and Cowork unified turned on. Approximate (HLL, typical error <2%) in date-range mode. Null on aggregated rows where a distinct count cannot be computed.

    - `currency: optional string`

      Currency for this row's monetary fields (`estimated_overage_spend` and `attributed_list_price`), as an uppercase ISO-4217 code. Always "USD" when either amount is populated; null whenever both amounts are null.

    - `enable_count: optional number`

      Distinct accounts that enabled this skill on the requested day (claude.ai only — the skill analog of plugin `install_count`). The count is org-wide: null when enable reporting is not enabled for this organization, or when the request scopes to `user_id` / `rbac_group_id` / `product` via `group_by[]` or `filter[]` (an org-wide count would be misleading on per-cut rows). A distinct count, not an event count: summing across days double-counts members who enable the skill on more than one day, so it is also null in date-range rollup mode (`starting_date`/`ending_date`).

    - `estimated_overage_spend: optional string`

      Estimated overage spend attributed to this skill, as a decimal string in the minor unit of `currency` (cents for USD; "1250" is $12.50, fractional cents possible) — an allocation of each member's daily post-discount, pre-credit metered overage spend (the same cost basis as the organization's spend reporting and the Cost & Usage API, so per-skill figures are directly comparable; spend with no skill attribution — including any member-day without skill invocations — is not represented, so skill rows sum to at most those totals) across the skills the member used. Overage only: usage covered by included seat allowances bills nothing and allocates $0 here — see `attributed_list_price` for the funding-independent usage-value companion. Claude Code, Cowork, and Office Agent spend use request-level skill attribution; claude.ai chat spend is approximated proportionally to skill-invoking messages. An estimate, not a billing number — and the cost of the requests/messages that involved the skill, not the skill's incremental cost (the same request would still have cost something without the skill active). "0" means no overage spend was attributed; null when spend reporting is not enabled for this organization, on `office_agent` product cuts dated before 2026-06-18 (the Office Agent attribution data-start). Addable across days: date-range rollup mode (`starting_date`/`ending_date`) returns the window's sum. With `group_by[]=user_id` each row carries the user's own attributed spend. On `group_by[]` and `filter[]` shapes both amounts can total below the ungrouped value for the same skill over the same date or range: spend attributed to a member–skill pair with no counted usage on that day is excluded from those cuts.

    - `invocation_count: optional number`

      Total number of times this skill was invoked on the requested day (the skill analog of plugin `invocation_count`). Unlike `distinct_user_count` — which answers '\# of users' — this is the true '# of uses'. A skill counts as used only when it is explicitly activated — the model (or the user, via the skill's slash command) invokes it, reading its instructions into context as part of that activation. Skills that are merely installed or listed as available, or whose content reaches the context without an activation (preloaded, hook-injected, or read as a plain file), are not counted. Null when invocation reporting is not enabled for this organization. Sum across a date range for total uses in the window — date-range rollup mode (`starting_date`/`ending_date`) returns this sum directly.

    - `product: optional string`

      Product that produced this row's activity: one of `chat`, `claude_code`, `cowork`, `office_agent`, or `chat_cowork_unified` (Chat and Cowork unified). These are the canonical Cost & Usage product names; an `office_agent` row's per-surface breakdown is in its `office_metrics`. On `/plugins` only `cowork`, `claude_code` and `chat_cowork_unified` occur (the only surfaces with plugin attribution); on `/artifacts` only `chat`, `claude_code`, `cowork` and `chat_cowork_unified` occur (the surfaces that create artifacts); `/apps/chat/projects` does not support the product dimension (a `product` entry in `group_by[]` or `filter[]` there is rejected). Present only when the request grouped by `product`.

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `share_status: optional "organization" or "private" or "public"`

      Skill share status (claude.ai only): one of `private`, `organization`, or `public`. Null for skills used only in Claude Code or Office (no per-skill share-status concept) and when share-status reporting is not yet available for the organization. Filterable via `filter[]=share_status:{value}`.

      - `"organization"`

      - `"private"`

      - `"public"`

    - `skill_display_name: optional string`

      Human-readable display name for rows whose `skill_name` is an opaque skill id (user/organization skill types and plugin-delivered skills, whose user-defined names usage reports generally withhold). Organization-shared skills and skills delivered by the organization's own plugins (its plugin marketplaces and its library) resolve; plugin skill names are shown without their 'plugin:' prefix. The literal 'unknown' bucket row gets a fixed 'Unknown skill' label. For a member's own skill (private or personal-plugin) it is null, except when the skill's owner used it from Claude Code or Cowork in the requested period: then it shows the name that client reported at the time. Apart from that, the names of members' own skills are not disclosed to analytics-key holders. Also null for Anthropic-provided plugin skills (not resolved), for an organization skill or plugin whose name can no longer be found (for example, one since deleted), when `skill_name` is already a display name, or when display-name resolution is not enabled for this organization.

    - `user_id: optional string`

      Tagged user identifier (e.g. `user_...`). Present only when the request grouped by `user_id`.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results

#### Example

```bash
ant beta:organization:analytics:skills list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "chat_metrics": {
        "distinct_conversation_skill_used_count": 0
      },
      "claude_code_metrics": {
        "distinct_session_skill_used_count": 0
      },
      "cowork_metrics": {
        "distinct_session_skill_used_count": 0
      },
      "distinct_user_count": 0,
      "office_metrics": {
        "excel": {
          "distinct_session_skill_used_count": 0
        },
        "outlook": {
          "distinct_session_skill_used_count": 0
        },
        "powerpoint": {
          "distinct_session_skill_used_count": 0
        },
        "word": {
          "distinct_session_skill_used_count": 0
        }
      },
      "skill_name": "skill_name",
      "attributed_list_price": "attributed_list_price",
      "chat_cowork_unified_metrics": {
        "chat": {
          "distinct_conversation_skill_used_count": 0
        },
        "sessions": {
          "distinct_session_skill_used_count": 0
        }
      },
      "currency": "currency",
      "enable_count": 0,
      "estimated_overage_spend": "estimated_overage_spend",
      "invocation_count": 0,
      "product": "product",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "share_status": "organization",
      "skill_display_name": "skill_display_name",
      "user_id": "user_id"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Analytics › Artifacts

### Get Artifact Activity

`$ ant beta:organization:analytics:artifacts list`

**GET** `/v1/organizations/analytics/artifacts`

Get artifact-creation activity for a given day, broken out by MIME type.

Returns the full (`artifact_type`, `is_shared`) cube for the organization;
`next_page` is null except for grouped queries, which paginate. The cube
can be broken out per product, per member, or per RBAC group via
`group_by[]`, and scoped via `filter[]`. Requires an API key with the
`read:analytics` scope.

#### Parameters

- `--date: string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get artifact activity for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `artifact_type`, `is_shared`, `product`, `rbac_group_id`, `user_id`. Value forms: `artifact_type` is a canonical artifact MIME type (e.g. `text/markdown`) or `other`; `is_shared` is `true` or `false`; `product` is `chat_cowork_unified`, `chat`, `claude_code`, or `cowork` (the surfaces that create artifacts); `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries. `chat_cowork_unified` is accepted as a `product` value only on deployments that offer Chat and Cowork unified.

  maxItems: 100

- `--group-by: optional array of "product" or "rbac_group_id" or "user_id"` (query parameter)

  Dimensions to break results out by: `product`, `user_id` and/or `rbac_group_id`. The ungrouped artifact-type cube is finite and returned in full; grouped queries multiply the cube and paginate via `next_page`. `product` takes the values `chat_cowork_unified`, `chat`, `claude_code`, or `cowork` (the surfaces that create artifacts). `rbac_group_id` attributes a user to every group they held at any point during the requested UTC day, so grouped rows are not an exclusive partition. At most 100 entries.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Maximum rows to return (1-1000, default 100). The ungrouped artifact-type cube is finite and returned in full; `limit` is the page size only when `group_by[]` multiplies the cube.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field. Only valid with `group_by[]` — the ungrouped cube is never paginated.

#### Returns

- `BetaAnalyticsArtifactsResponse: object`

  Response for GET /v1/organizations/analytics/artifacts.

  `next_page` is null on ungrouped queries — the artifact-type cube is
  finite and returned in full. Grouped queries (`group_by[]` on `product` /
  `user_id` / `rbac_group_id`) multiply the cube and paginate like the other
  analytics list endpoints.

  - `data: array of BetaAnalyticsArtifactActivity`

    - `artifact_type: string`

      Canonical artifact MIME type (e.g. `text/markdown`, `application/vnd.ant.react`, `image/svg+xml`), or `other`. Claude Code and Cowork artifacts report as `text/html`.

    - `artifacts_created_count: number`

      Number of artifacts created in this bucket on the requested day

    - `distinct_user_count: number`

      Number of distinct users who created artifacts in this bucket on the requested day

    - `is_shared: boolean`

      Whether the artifacts in this bucket have ever been shared (a Claude Code / Cowork artifact is shared once anyone beyond its creator may open it: named members, the whole organization, or anyone with the link).

    - `published_artifacts_created_count: number`

      Number of those artifacts that have been published (for Claude Code / Cowork artifacts: open to anyone with the link); never exceeds `artifacts_created_count`

    - `product: optional string`

      Product that produced this row's activity: one of `chat`, `claude_code`, `cowork`, `office_agent`, or `chat_cowork_unified` (Chat and Cowork unified). These are the canonical Cost & Usage product names; an `office_agent` row's per-surface breakdown is in its `office_metrics`. On `/plugins` only `cowork`, `claude_code` and `chat_cowork_unified` occur (the only surfaces with plugin attribution); on `/artifacts` only `chat`, `claude_code`, `cowork` and `chat_cowork_unified` occur (the surfaces that create artifacts); `/apps/chat/projects` does not support the product dimension (a `product` entry in `group_by[]` or `filter[]` there is rejected). Present only when the request grouped by `product`.

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `user_id: optional string`

      Tagged user identifier (e.g. `user_...`). Present only when the request grouped by `user_id`.

  - `next_page: string`

    Cursor for the next page of a grouped query; always null for the ungrouped artifact-type cube, which is returned in full.

#### Example

```bash
ant beta:organization:analytics:artifacts list \
  --api-key my-anthropic-api-key \
  --date ''\''2019-12-27'\'''
```

##### Response (200)

```json
{
  "data": [
    {
      "artifact_type": "artifact_type",
      "artifacts_created_count": 0,
      "distinct_user_count": 0,
      "is_shared": true,
      "published_artifacts_created_count": 0,
      "product": "product",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "user_id": "user_id"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Analytics › Usage Report

### Get Token Usage Over Time

`$ ant beta:organization:analytics:usage-report list`

**GET** `/v1/organizations/analytics/usage_report`

Get token usage over time across a date range.

Returns token usage bucketed by minute, hour, or day, optionally broken
down by product, model, context window, inference region, or speed.
Available to organizations on a Claude Enterprise plan. Requires an API
key with the `read:analytics` scope.

#### Parameters

- `--starting-at: string` (query parameter)

  Start of range, inclusive. RFC 3339 tz-aware. Must be within the last 365 days and no earlier than 2026-01-01T00:00:00Z.

  format: date-time

- `--bucket-width: optional "1d" or "1h" or "1m"` (query parameter)

  Time bucket granularity.

- `--claude-tag-category: optional array of BetaAnalyticsClaudeTagCategory` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage in specific spend categories. Usage with no category never matches. `dm` usage is reported under the user's product rather than `claude-tag`, so combining this filter with `products[]=claude-tag` excludes it. Use `group_by[]=claude_tag_category` to break out per-category values.

  maxItems: 100

- `--claude-tag-user-id: optional array of string` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage attributed to specific Slack users, by Slack user ID (for example `U0123ABCDEF`), not claude.ai user ID. Usage that is not Claude Tag, and Claude Tag usage not attributed to a single user, never matches. Use `group_by[]=claude_tag_user_id` to break out per-user values.

  maxItems: 100

- `--context-window: optional array of BetaAnalyticsContextWindow` (query parameter)

  Filter to specific context-window pricing tiers. Use `group_by[]=context_window` to break out per-tier values.

  maxItems: 100

- `--ending-at: optional string` (query parameter)

  End of range, exclusive. When omitted, defaults to the earlier of now and `starting_at` + 31 days. The range may span at most 31 days.

  format: date-time

- `--group-by: optional array of "claude_tag_category" or "claude_tag_user_id" or "context_window" or 6 more` (query parameter)

  Dimensions to break each time bucket out by. Defaults to no grouping (one total per bucket). Each bucket reports at most its top 100 groups; a group beyond that cap has no row in that bucket (there is no remainder row), so grouped buckets are not exhaustive when a dimension has more than 100 distinct values.

  maxItems: 100

- `--inference-geo: optional array of BetaAnalyticsInferenceGeoFilter` (query parameter)

  Filter to specific inference regions. `not_available` matches rows where the region is unset. Use `group_by[]=inference_geo` to break out per-region values.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Maximum number of time buckets per page. Defaults and caps vary by `bucket_width` (`1d`: default 7, max 31; `1h`: default 24, max 168; `1m`: default 60, max 256).

  minimum: 1

- `--model: optional array of string` (query parameter)

  Models to include. Defaults to all models. Use `group_by[]=model` to break out per-model values.

  maxItems: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--product: optional array of BetaAnalyticsProductFilter` (query parameter)

  Product surfaces to include. Defaults to all products. Use `group_by[]=product` to break out per-product values.

  maxItems: 100

- `--rbac-group-id: optional array of string` (query parameter)

  Filter to usage attributed to specific RBAC groups. Accepts tagged RBAC group IDs (`rbac_group_...`) or bare group UUIDs. A row matches when the user belonged to any of the listed groups on the (UTC) day the usage occurred; usage with no group attribution never matches.

  maxItems: 100

- `--slack-channel-id: optional array of string` (query parameter)

  Filter to usage originating from specific Slack channels. Use `group_by[]=slack_channel_id` to break out per-channel values.

  maxItems: 100

- `--speed: optional array of "fast" or "standard"` (query parameter)

  Filter to fast or standard inference mode. Use `group_by[]=speed` to break out per-mode values.

  maxItems: 100

- `--user-id: optional array of string` (query parameter)

  Filter to specific users by tagged user ID.

  maxItems: 100

#### Returns

- `BetaAnalyticsUsageBucketedResponse: object`

  - `data: array of BetaAnalyticsUsageReportTimeBucket`

    Time buckets for this page, oldest first: one per `bucket_width` interval, including intervals with no data (their `results` list is empty). A page holds at most `limit` buckets.

    - `ending_at: string`

      End of the time bucket (exclusive) in RFC 3339 format.

      format: date-time

    - `results: array of BetaAnalyticsUsageBucketedResult`

      Rows for this time bucket. Empty when the bucket has no data; otherwise a single combined row when `group_by[]` is omitted, or one row per group (subject to the per-bucket group cap described on the `group_by[]` parameter).

      - `cache_creation: object`

        The number of input tokens for cache creation.

        - `ephemeral_1h_input_tokens: number`

          The number of input tokens used to create the 1 hour cache entry.

          minimum: 0

        - `ephemeral_5m_input_tokens: number`

          The number of input tokens used to create the 5 minute cache entry.

          minimum: 0

      - `cache_read_input_tokens: number`

        The number of input tokens read from the cache.

      - `claude_tag_category: "dm" or "engaged" or "monitoring" or 2 more`

        Claude Tag (Claude in Slack) spend category: `engaged` (a person addressed Claude in a channel or thread), `proactive` (Claude responded without being addressed), `scheduled` (a scheduled routine ran), `monitoring` (Claude watching a channel it was asked to monitor), or `dm` (direct messages with Claude). Populated only when `claude_tag_category` is in `group_by[]`; null for usage that is not Claude Tag. Direct-message usage is billed to the individual user and is reported under that user's product, not under `claude-tag`. New categories may be added over time.

        - `"dm"`

        - `"engaged"`

        - `"monitoring"`

        - `"proactive"`

        - `"scheduled"`

      - `claude_tag_user_id: string`

        Slack user ID (for example `U0123ABCDEF`) of the member the Claude Tag (Claude in Slack) usage is attributed to, not a claude.ai user ID. Populated only when `claude_tag_user_id` is in `group_by[]`; null for usage that is not Claude Tag and for Claude Tag usage that is not attributed to a single user (for example `monitoring`, and `proactive` usage Claude initiated), so per-user rows can sum to less than the Claude Tag total. Cannot be combined with `group_by[]=rbac_group_id` or the `rbac_group_ids[]` filter.

      - `context_window: "0-200k" or "200k-1M"`

        Context-window pricing tier of the usage or cost. Null unless `context_window` is in `group_by[]`; it can also be null on grouped rows with no context-window tier, such as code execution.

        - `"0-200k"`

        - `"200k-1M"`

      - `inference_geo: "global" or "us"`

        Inference region of the usage or cost. Null unless `inference_geo` is in `group_by[]`; it can also be null on grouped rows where the region is not set (the rows that `inference_geos[]=not_available` matches).

        - `"global"`

        - `"us"`

      - `model: string`

        Model that produced the usage or cost, as a model name in the form the `models[]` filter accepts (for example, `claude-opus-5-5`). Null unless `model` is in `group_by[]`; it can also be null on grouped rows whose usage or cost is not attributed to a specific model, such as code execution.

      - `output_tokens: number`

        The number of output tokens generated.

      - `product: string`

        Product surface that produced the usage or cost. Null unless product is in `group_by[]`; it can also be null on grouped rows whose usage cannot be attributed to a known surface. Values include `chat`, `claude_code`, `cowork`, `office_agent`, `claude_in_chrome`, `claude_design`, `claude-tag`, and `chat_cowork_unified`. `claude-tag` is Claude Tag, the Claude product in Slack. `chat_cowork_unified` is Chat and Cowork unified, Cowork's features inside claude.ai chat: chat and Cowork usage by a member who has it turned on is reported under this value instead of `chat` or `cowork`. It is accepted as a filter only on deployments that offer Chat and Cowork unified. Some unattributed usage is reported as "other".

      - `rbac_group_id: string`

        RBAC group (team) the usage is attributed to, in the public tagged `rbac_group_...` spelling — the same spelling the activity resources use for this key, so the same team has one id across resources and it round-trips as an `rbac_group_ids[]` filter value. Populated only when `rbac_group_id` is in `group_by[]`. Any-membership semantics: a user in several groups contributes their full usage to each of those groups' rows, so the named-group rows overlap and their sum can exceed the org total. A null value is the single unassigned row: users in no group on that (UTC) day. For the true org total, run the same query without `group_by[]`.

      - `requests: number`

        Number of API requests in this row's scope. For sandbox / code-execution events, this counts execution spans rather than HTTP requests (these rows surface with `product: null`).

      - `server_tool_use: object`

        Server-side tool usage metrics.

        - `web_search_requests: number`

          The number of web search requests made.

      - `slack_channel_id: string`

        Slack channel the usage originated from. Populated only when `slack_channel_id` is in `group_by[]`; null for usage outside Slack (and for rows recorded before channel attribution was enabled).

      - `speed: "fast" or "standard"`

        Inference speed mode of the usage or cost: `fast` or `standard`. Null unless `speed` is in `group_by[]`.

        - `"fast"`

        - `"standard"`

      - `uncached_input_tokens: number`

        The number of uncached input tokens processed.

    - `starting_at: string`

      Start of the time bucket (inclusive) in RFC 3339 format.

      format: date-time

  - `data_refreshed_at: string`

    RFC 3339 timestamp of the export this response was served from. Null when no export yet covers any part of the requested range, in which case every bucket's `results` list is empty. Buckets beyond this watermark are incomplete; for stable results, set `ending_at` to this value or earlier. Data is typically refreshed every 4 hours. Values can be revised as late events arrive and reconciliation runs, until about 7 days after the end of the calendar month the usage falls in; for example, values for October 1 can change until about November 7.

    format: date-time

  - `has_more: boolean`

    Whether another page is available. When true, pass `next_page` as the `page` parameter to fetch it.

  - `next_page: string`

    Opaque cursor for the next page, or null when `has_more` is false. Pass it as the `page` parameter, keeping the other parameters unchanged. A cursor can expire after the underlying data refreshes; the request then returns HTTP 410 and pagination must restart from the first page.

  - `organization_id: string`

    ID of the Organization.

#### Example

```bash
ant beta:organization:analytics:usage-report list \
  --api-key my-anthropic-api-key \
  --starting-at ''\''2019-12-27T18:11:19.117Z'\'''
```

##### Response (200)

```json
{
  "data": [
    {
      "ending_at": "2019-12-27T18:11:19.117Z",
      "results": [
        {
          "cache_creation": {
            "ephemeral_1h_input_tokens": 0,
            "ephemeral_5m_input_tokens": 0
          },
          "cache_read_input_tokens": 0,
          "claude_tag_category": "dm",
          "claude_tag_user_id": "U0123ABCDEF",
          "context_window": "0-200k",
          "inference_geo": "global",
          "model": "claude-opus-5-5",
          "output_tokens": 0,
          "product": "chat",
          "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
          "requests": 0,
          "server_tool_use": {
            "web_search_requests": 10
          },
          "slack_channel_id": "C0123ABCDEF",
          "speed": "fast",
          "uncached_input_tokens": 0
        }
      ],
      "starting_at": "2019-12-27T18:11:19.117Z"
    }
  ],
  "data_refreshed_at": "2019-12-27T18:11:19.117Z",
  "has_more": true,
  "next_page": "next_page",
  "organization_id": "org_013FP9SaFPBg7Kw7fetjn6cF"
}
```

## Organization › Analytics › User Usage Report

### Get Per-User Token Usage

`$ ant beta:organization:analytics:user-usage-report list`

**GET** `/v1/organizations/analytics/user_usage_report`

Get per-user token usage across a date range.

Returns one row per user, ranked by the chosen token metric. Use this to
see which users consume the most tokens. Only usage attributable to a
seat user is included; for organization-wide totals including direct
API-key and automation traffic, use the bucketed
`/v1/organizations/analytics/usage_report` endpoint. Available to
organizations on a Claude Enterprise plan. Requires an API key with the
`read:analytics` scope.

#### Parameters

- `--starting-at: string` (query parameter)

  Start of range, inclusive. RFC 3339 tz-aware. Must be within the last 365 days and no earlier than 2026-01-01T00:00:00Z.

  format: date-time

- `--bucket-width: optional "1d" or "1h" or "1m"` (query parameter)

  Time-bucket granularity. When set, each row's `starting_at` and `ending_at` are populated and one actor may span several rows (one per time bucket with usage). The time bucket counts toward `limit`, so one page can return multiple rows for the same actor. `ending_at` is required when `bucket_width` is set, and with `bucket_width="1m"` the range may span at most 24 hours. When omitted, each row aggregates the full `[starting_at, ending_at)` range.

- `--claude-tag-category: optional array of BetaAnalyticsClaudeTagCategory` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage in specific spend categories. Usage with no category never matches. `dm` usage is reported under the user's product rather than `claude-tag`, so combining this filter with `products[]=claude-tag` excludes it. Use `group_by[]=claude_tag_category` to break out per-category values.

  maxItems: 100

- `--claude-tag-user-id: optional array of string` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage attributed to specific Slack users, by Slack user ID (for example `U0123ABCDEF`), not claude.ai user ID. Usage that is not Claude Tag, and Claude Tag usage not attributed to a single user, never matches. Use `group_by[]=claude_tag_user_id` to break out per-user values.

  maxItems: 100

- `--context-window: optional array of BetaAnalyticsContextWindow` (query parameter)

  Filter to specific context-window pricing tiers. Use `group_by[]=context_window` to break out per-tier values.

  maxItems: 100

- `--ending-at: optional string` (query parameter)

  End of range, exclusive. When omitted, defaults to the earlier of now and `starting_at` + 31 days. The range may span at most 31 days.

  format: date-time

- `--exclude-deleted-users: optional boolean` (query parameter)

  If true, omit rows for users who are deleted (`deleted: true`). A page may contain fewer than `limit` rows; use `has_more` and `next_page` to paginate as usual.

- `--group-by: optional array of "claude_tag_category" or "claude_tag_user_id" or "context_window" or 6 more` (query parameter)

  Break each actor's row out by the given dimensions. Accepts the same values as the bucketed `/usage_report` endpoint. `limit` bounds (actor × time bucket × dimension) rows — with dimensions or `bucket_width` present, one actor may span several rows.

  maxItems: 100

- `--inference-geo: optional array of BetaAnalyticsInferenceGeoFilter` (query parameter)

  Filter to specific inference regions. `not_available` matches rows where the region is unset. Use `group_by[]=inference_geo` to break out per-region values.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of rows per page (1-1000, default 20). One row per actor unless `group_by[]` or `bucket_width` splits an actor across rows; `cost_type`/`token_type` fan-out rows (cost endpoint only) are the exception — they do not count toward this limit, so `data` can exceed it.

  minimum: 1, maximum: 1000

- `--model: optional array of string` (query parameter)

  Models to include. Defaults to all models. Use `group_by[]=model` to break out per-model values.

  maxItems: 100

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction. Defaults to `desc`.

- `--order-by: optional "output_tokens" or "requests" or "total_tokens" or "uncached_input_tokens"` (query parameter)

  Metric to rank actors by. Defaults to `total_tokens`.

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--product: optional array of BetaAnalyticsProductFilter` (query parameter)

  Product surfaces to include. Defaults to all products.

  maxItems: 100

- `--rbac-group-id: optional array of string` (query parameter)

  Filter to usage attributed to specific RBAC groups. Accepts tagged RBAC group IDs (`rbac_group_...`) or bare group UUIDs. A row matches when the user belonged to any of the listed groups on the (UTC) day the usage occurred; usage with no group attribution never matches.

  maxItems: 100

- `--slack-channel-id: optional array of string` (query parameter)

  Filter to usage originating from specific Slack channels. Use `group_by[]=slack_channel_id` to break out per-channel values.

  maxItems: 100

- `--speed: optional array of "fast" or "standard"` (query parameter)

  Filter to fast or standard inference mode. Use `group_by[]=speed` to break out per-mode values.

  maxItems: 100

- `--user-id: optional array of string` (query parameter)

  Filter to specific users by tagged user ID.

  maxItems: 100

#### Returns

- `BetaAnalyticsUsageUsersResponse: object`

  - `data: array of BetaAnalyticsUsageUsersItem`

    Rows for this page, ranked by `order_by` in the `order` direction. One row per user, or several per user when `group_by[]` or `bucket_width` breaks that user's usage or cost out across rows. Rows split out by `cost_type` or `token_type` (cost endpoint only) stay adjacent and are ranked as one unit.

    - `actor: object`

      The user this row's usage or cost is attributed to. Always a `user_actor`.

      - `type: "user_actor"`

        Actor type. Always `"user_actor"`.

      - `deleted: boolean`

        True when the account has been deleted, or when the user is no longer a member of the organization or its associated organizations (for example, their membership was removed or they were deprovisioned via your identity provider). `email_address` stays populated for removed users and is null when the account has been deleted. `name` follows the rules described on that field. The `user_id` is still populated for reconciliation.

      - `email_address: string`

        The user's email address, including for users who are no longer members of the organization or its associated organizations. Null when the account has been deleted (check `deleted`) and for system-minted service accounts, which have no person's mailbox behind them (check `name`).

      - `name: string`

        The user's full name. Null when the user has not set a name. Returns `"Deleted User"` when the account itself has been deleted, or when the user is no longer a member of the organization or its associated organizations and the organization has chosen to hide the names of removed users. Otherwise, the name stays populated for removed users. Rows for system-minted service accounts render the service name (for example, `"Claude Security"` for usage by Anthropic's security-patching service) or null.

      - `user_id: string`

        Tagged user ID.

    - `cache_creation: object`

      The number of input tokens for cache creation.

      - `ephemeral_1h_input_tokens: number`

        The number of input tokens used to create the 1 hour cache entry.

        minimum: 0

      - `ephemeral_5m_input_tokens: number`

        The number of input tokens used to create the 5 minute cache entry.

        minimum: 0

    - `cache_read_input_tokens: number`

      The number of input tokens read from the cache.

    - `claude_tag_category: "dm" or "engaged" or "monitoring" or 2 more`

      Claude Tag (Claude in Slack) spend category: `engaged` (a person addressed Claude in a channel or thread), `proactive` (Claude responded without being addressed), `scheduled` (a scheduled routine ran), `monitoring` (Claude watching a channel it was asked to monitor), or `dm` (direct messages with Claude). Populated only when `claude_tag_category` is in `group_by[]`; null for usage that is not Claude Tag. Direct-message usage is billed to the individual user and is reported under that user's product, not under `claude-tag`. New categories may be added over time.

      - `"dm"`

      - `"engaged"`

      - `"monitoring"`

      - `"proactive"`

      - `"scheduled"`

    - `claude_tag_user_id: string`

      Slack user ID (for example `U0123ABCDEF`) of the member the Claude Tag (Claude in Slack) usage is attributed to, not a claude.ai user ID. Populated only when `claude_tag_user_id` is in `group_by[]`; null for usage that is not Claude Tag and for Claude Tag usage that is not attributed to a single user (for example `monitoring`, and `proactive` usage Claude initiated), so per-user rows can sum to less than the Claude Tag total. Cannot be combined with `group_by[]=rbac_group_id` or the `rbac_group_ids[]` filter.

    - `context_window: "0-200k" or "200k-1M"`

      Context-window pricing tier of the usage or cost. Null unless `context_window` is in `group_by[]`; it can also be null on grouped rows with no context-window tier, such as code execution.

      - `"0-200k"`

      - `"200k-1M"`

    - `ending_at: string`

      End of the row's UTC time bucket (exclusive), as an RFC 3339 timestamp; equal to `starting_at` plus one `bucket_width`. Null unless `bucket_width` is set.

      format: date-time

    - `inference_geo: "global" or "us"`

      Inference region of the usage or cost. Null unless `inference_geo` is in `group_by[]`; it can also be null on grouped rows where the region is not set (the rows that `inference_geos[]=not_available` matches).

      - `"global"`

      - `"us"`

    - `model: string`

      Model that produced the usage or cost, as a model name in the form the `models[]` filter accepts (for example, `claude-opus-5-5`). Null unless `model` is in `group_by[]`; it can also be null on grouped rows whose usage or cost is not attributed to a specific model, such as code execution.

    - `output_tokens: number`

      The number of output tokens generated.

    - `product: string`

      Product surface that produced the usage or cost. Null unless product is in `group_by[]`; it can also be null on grouped rows whose usage cannot be attributed to a known surface. Values include `chat`, `claude_code`, `cowork`, `office_agent`, `claude_in_chrome`, `claude_design`, `claude-tag`, and `chat_cowork_unified`. `claude-tag` is Claude Tag, the Claude product in Slack. `chat_cowork_unified` is Chat and Cowork unified, Cowork's features inside claude.ai chat: chat and Cowork usage by a member who has it turned on is reported under this value instead of `chat` or `cowork`. It is accepted as a filter only on deployments that offer Chat and Cowork unified. Some unattributed usage is reported as "other".

    - `rbac_group_id: string`

      RBAC group (team) the usage is attributed to, in the public tagged `rbac_group_...` spelling — the same spelling the activity resources use for this key, so the same team has one id across resources and it round-trips as an `rbac_group_ids[]` filter value. Populated only when `rbac_group_id` is in `group_by[]`. Any-membership semantics: a user in several groups contributes their full usage to each of those groups' rows, so the named-group rows overlap and their sum can exceed the org total. A null value is the single unassigned row: users in no group on that (UTC) day. For the true org total, run the same query without `group_by[]`.

    - `requests: number`

      Number of API requests in this row's scope. For sandbox / code-execution events, this counts execution spans rather than HTTP requests (these rows surface with `product: null`).

    - `server_tool_use: object`

      Server-side tool usage metrics.

      - `web_search_requests: number`

        The number of web search requests made.

    - `slack_channel_id: string`

      Slack channel the usage originated from. Populated only when `slack_channel_id` is in `group_by[]`; null for usage outside Slack (and for rows recorded before channel attribution was enabled).

    - `speed: "fast" or "standard"`

      Inference speed mode of the usage or cost: `fast` or `standard`. Null unless `speed` is in `group_by[]`.

      - `"fast"`

      - `"standard"`

    - `starting_at: string`

      Start of the row's UTC time bucket (inclusive), as an RFC 3339 timestamp. Null unless `bucket_width` is set; without `bucket_width`, each row aggregates the full requested range.

      format: date-time

    - `total_tokens: number`

      Total token count across all token types. This is the value the default `order_by` (`total_tokens`) sorts on.

    - `uncached_input_tokens: number`

      The number of uncached input tokens processed.

  - `data_refreshed_at: string`

    RFC 3339 timestamp of the export this response was served from. Null when no export yet covers any part of the requested range, in which case `data` is empty. Data beyond this watermark is incomplete; for stable results, set `ending_at` to this value or earlier. Data is typically refreshed every 4 hours. Values can be revised as late events arrive and reconciliation runs, until about 7 days after the end of the calendar month the usage falls in; for example, values for October 1 can change until about November 7.

    format: date-time

  - `has_more: boolean`

    Whether another page is available. When true, pass `next_page` as the `page` parameter to fetch it.

  - `next_page: string`

    Opaque cursor for the next page, or null when `has_more` is false. Pass it as the `page` parameter, keeping the other parameters unchanged. A cursor can expire after the underlying data refreshes; the request then returns HTTP 410 and pagination must restart from the first page.

  - `organization_id: string`

    ID of the Organization.

#### Example

```bash
ant beta:organization:analytics:user-usage-report list \
  --api-key my-anthropic-api-key \
  --starting-at ''\''2019-12-27T18:11:19.117Z'\'''
```

##### Response (200)

```json
{
  "data": [
    {
      "actor": {
        "deleted": true,
        "email": "jane@example.com",
        "email_address": "jane@example.com",
        "name": "Jane Smith",
        "type": "user_actor",
        "user_id": "user_01AbCdEfGhIjKlMnOpQrSt"
      },
      "cache_creation": {
        "ephemeral_1h_input_tokens": 0,
        "ephemeral_5m_input_tokens": 0
      },
      "cache_read_input_tokens": 3200000,
      "claude_tag_category": "dm",
      "claude_tag_user_id": "U0123ABCDEF",
      "context_window": "0-200k",
      "ending_at": "2019-12-27T18:11:19.117Z",
      "inference_geo": "global",
      "model": "claude-opus-5-5",
      "output_tokens": 891000,
      "product": "chat",
      "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
      "requests": 128,
      "server_tool_use": {
        "web_search_requests": 10
      },
      "slack_channel_id": "C0123ABCDEF",
      "speed": "fast",
      "starting_at": "2019-12-27T18:11:19.117Z",
      "total_tokens": 5377000,
      "uncached_input_tokens": 1284500
    }
  ],
  "data_refreshed_at": "2019-12-27T18:11:19.117Z",
  "has_more": true,
  "next_page": "next_page",
  "organization_id": "org_013FP9SaFPBg7Kw7fetjn6cF"
}
```

## Organization › Analytics › Cost Report

### Get Cost Over Time

`$ ant beta:organization:analytics:cost-report list`

**GET** `/v1/organizations/analytics/cost_report`

Get cost in USD over time across a date range.

Returns cost bucketed by minute, hour, or day, optionally broken down by
product, model, context window, inference region, speed, cost type, or
token type. Available to organizations on a Claude Enterprise plan.
Requires an API key with the `read:analytics` scope.

#### Parameters

- `--starting-at: string` (query parameter)

  Start of range, inclusive. RFC 3339 tz-aware. Must be within the last 365 days and no earlier than 2026-01-01T00:00:00Z.

  format: date-time

- `--bucket-width: optional "1d" or "1h" or "1m"` (query parameter)

  Time bucket granularity.

- `--claude-tag-category: optional array of BetaAnalyticsClaudeTagCategory` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage in specific spend categories. Usage with no category never matches. `dm` usage is reported under the user's product rather than `claude-tag`, so combining this filter with `products[]=claude-tag` excludes it. Use `group_by[]=claude_tag_category` to break out per-category values.

  maxItems: 100

- `--claude-tag-user-id: optional array of string` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage attributed to specific Slack users, by Slack user ID (for example `U0123ABCDEF`), not claude.ai user ID. Usage that is not Claude Tag, and Claude Tag usage not attributed to a single user, never matches. Use `group_by[]=claude_tag_user_id` to break out per-user values.

  maxItems: 100

- `--context-window: optional array of BetaAnalyticsContextWindow` (query parameter)

  Filter to specific context-window pricing tiers. Use `group_by[]=context_window` to break out per-tier values.

  maxItems: 100

- `--ending-at: optional string` (query parameter)

  End of range, exclusive. When omitted, defaults to the earlier of now and `starting_at` + 31 days. The range may span at most 31 days.

  format: date-time

- `--group-by: optional array of "claude_tag_category" or "claude_tag_user_id" or "context_window" or 8 more` (query parameter)

  Dimensions to break each time bucket out by. Defaults to no grouping (one total per bucket). Each bucket reports at most its top 100 groups; a group beyond that cap has no row in that bucket (there is no remainder row), so grouped buckets are not exhaustive when a dimension has more than 100 distinct values.

  maxItems: 100

- `--inference-geo: optional array of BetaAnalyticsInferenceGeoFilter` (query parameter)

  Filter to specific inference regions. `not_available` matches rows where the region is unset. Use `group_by[]=inference_geo` to break out per-region values.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Maximum number of time buckets per page. Defaults and caps vary by `bucket_width` (`1d`: default 7, max 31; `1h`: default 24, max 168; `1m`: default 60, max 256).

  minimum: 1

- `--model: optional array of string` (query parameter)

  Models to include. Defaults to all models. Use `group_by[]=model` to break out per-model values.

  maxItems: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--product: optional array of BetaAnalyticsProductFilter` (query parameter)

  Product surfaces to include. Defaults to all products. Use `group_by[]=product` to break out per-product values.

  maxItems: 100

- `--rbac-group-id: optional array of string` (query parameter)

  Filter to usage attributed to specific RBAC groups. Accepts tagged RBAC group IDs (`rbac_group_...`) or bare group UUIDs. A row matches when the user belonged to any of the listed groups on the (UTC) day the usage occurred; usage with no group attribution never matches.

  maxItems: 100

- `--slack-channel-id: optional array of string` (query parameter)

  Filter to usage originating from specific Slack channels. Use `group_by[]=slack_channel_id` to break out per-channel values.

  maxItems: 100

- `--speed: optional array of "fast" or "standard"` (query parameter)

  Filter to fast or standard inference mode. Use `group_by[]=speed` to break out per-mode values.

  maxItems: 100

- `--user-id: optional array of string` (query parameter)

  Filter to specific users by tagged user ID.

  maxItems: 100

#### Returns

- `BetaAnalyticsCostBucketedResponse: object`

  - `data: array of BetaAnalyticsCostReportTimeBucket`

    Time buckets for this page, oldest first: one per `bucket_width` interval, including intervals with no data (their `results` list is empty). A page holds at most `limit` buckets.

    - `ending_at: string`

      End of the time bucket (exclusive) in RFC 3339 format.

      format: date-time

    - `results: array of BetaAnalyticsCostBucketedResult`

      Rows for this time bucket. Empty when the bucket has no data; otherwise a single combined row when `group_by[]` is omitted, or one row per group (subject to the per-bucket group cap described on the `group_by[]` parameter).

      - `amount: string`

        Amount (post-discount, pre-credit) in fractional cents.

      - `claude_tag_category: "dm" or "engaged" or "monitoring" or 2 more`

        Claude Tag (Claude in Slack) spend category: `engaged` (a person addressed Claude in a channel or thread), `proactive` (Claude responded without being addressed), `scheduled` (a scheduled routine ran), `monitoring` (Claude watching a channel it was asked to monitor), or `dm` (direct messages with Claude). Populated only when `claude_tag_category` is in `group_by[]`; null for usage that is not Claude Tag. Direct-message usage is billed to the individual user and is reported under that user's product, not under `claude-tag`. New categories may be added over time.

        - `"dm"`

        - `"engaged"`

        - `"monitoring"`

        - `"proactive"`

        - `"scheduled"`

      - `claude_tag_user_id: string`

        Slack user ID (for example `U0123ABCDEF`) of the member the Claude Tag (Claude in Slack) usage is attributed to, not a claude.ai user ID. Populated only when `claude_tag_user_id` is in `group_by[]`; null for usage that is not Claude Tag and for Claude Tag usage that is not attributed to a single user (for example `monitoring`, and `proactive` usage Claude initiated), so per-user rows can sum to less than the Claude Tag total. Cannot be combined with `group_by[]=rbac_group_id` or the `rbac_group_ids[]` filter.

      - `context_window: "0-200k" or "200k-1M"`

        Context-window pricing tier of the usage or cost. Null unless `context_window` is in `group_by[]`; it can also be null on grouped rows with no context-window tier, such as code execution.

        - `"0-200k"`

        - `"200k-1M"`

      - `cost_type: "code_execution" or "tokens" or "web_search"`

        Cost component when `group_by[]=cost_type`; null otherwise (amount is the combined total).

        - `"code_execution"`

        - `"tokens"`

        - `"web_search"`

      - `currency: string`

        Currency code for the cost amount. Currently always `"USD"`.

      - `inference_geo: "global" or "us"`

        Inference region of the usage or cost. Null unless `inference_geo` is in `group_by[]`; it can also be null on grouped rows where the region is not set (the rows that `inference_geos[]=not_available` matches).

        - `"global"`

        - `"us"`

      - `list_amount: string`

        List-price amount (pre-discount) in fractional cents.

      - `model: string`

        Model that produced the usage or cost, as a model name in the form the `models[]` filter accepts (for example, `claude-opus-5-5`). Null unless `model` is in `group_by[]`; it can also be null on grouped rows whose usage or cost is not attributed to a specific model, such as code execution.

      - `product: string`

        Product surface that produced the usage or cost. Null unless product is in `group_by[]`; it can also be null on grouped rows whose usage cannot be attributed to a known surface. Values include `chat`, `claude_code`, `cowork`, `office_agent`, `claude_in_chrome`, `claude_design`, `claude-tag`, and `chat_cowork_unified`. `claude-tag` is Claude Tag, the Claude product in Slack. `chat_cowork_unified` is Chat and Cowork unified, Cowork's features inside claude.ai chat: chat and Cowork usage by a member who has it turned on is reported under this value instead of `chat` or `cowork`. It is accepted as a filter only on deployments that offer Chat and Cowork unified. Some unattributed usage is reported as "other".

      - `rbac_group_id: string`

        RBAC group (team) the usage is attributed to, in the public tagged `rbac_group_...` spelling — the same spelling the activity resources use for this key, so the same team has one id across resources and it round-trips as an `rbac_group_ids[]` filter value. Populated only when `rbac_group_id` is in `group_by[]`. Any-membership semantics: a user in several groups contributes their full usage to each of those groups' rows, so the named-group rows overlap and their sum can exceed the org total. A null value is the single unassigned row: users in no group on that (UTC) day. For the true org total, run the same query without `group_by[]`.

      - `requests: number`

        Number of API requests in this row's scope. Null when `group_by` includes `cost_type` or `token_type` (the count has no per-component attribution; read it from the ungrouped response). For sandbox / code-execution events, this counts execution spans rather than HTTP requests (these rows surface with `product: null`).

      - `slack_channel_id: string`

        Slack channel the usage originated from. Populated only when `slack_channel_id` is in `group_by[]`; null for usage outside Slack (and for rows recorded before channel attribution was enabled).

      - `speed: "fast" or "standard"`

        Inference speed mode of the usage or cost: `fast` or `standard`. Null unless `speed` is in `group_by[]`.

        - `"fast"`

        - `"standard"`

      - `token_type: "cache_creation.ephemeral_1h_input_tokens" or "cache_creation.ephemeral_5m_input_tokens" or "cache_read_input_tokens" or 2 more`

        Token type when `group_by[]=token_type` and `cost_type=tokens`; null otherwise.

        - `"cache_creation.ephemeral_1h_input_tokens"`

        - `"cache_creation.ephemeral_5m_input_tokens"`

        - `"cache_read_input_tokens"`

        - `"output_tokens"`

        - `"uncached_input_tokens"`

    - `starting_at: string`

      Start of the time bucket (inclusive) in RFC 3339 format.

      format: date-time

  - `data_refreshed_at: string`

    RFC 3339 timestamp of the export this response was served from. Null when no export yet covers any part of the requested range, in which case every bucket's `results` list is empty. Buckets beyond this watermark are incomplete; for stable results, set `ending_at` to this value or earlier. Data is typically refreshed every 4 hours. Values can be revised as late events arrive and reconciliation runs, until about 7 days after the end of the calendar month the usage falls in; for example, values for October 1 can change until about November 7.

    format: date-time

  - `has_more: boolean`

    Whether another page is available. When true, pass `next_page` as the `page` parameter to fetch it.

  - `next_page: string`

    Opaque cursor for the next page, or null when `has_more` is false. Pass it as the `page` parameter, keeping the other parameters unchanged. A cursor can expire after the underlying data refreshes; the request then returns HTTP 410 and pagination must restart from the first page.

  - `organization_id: string`

    ID of the Organization.

#### Example

```bash
ant beta:organization:analytics:cost-report list \
  --api-key my-anthropic-api-key \
  --starting-at ''\''2019-12-27T18:11:19.117Z'\'''
```

##### Response (200)

```json
{
  "data": [
    {
      "ending_at": "2019-12-27T18:11:19.117Z",
      "results": [
        {
          "amount": "amount",
          "claude_tag_category": "dm",
          "claude_tag_user_id": "U0123ABCDEF",
          "context_window": "0-200k",
          "cost_type": "code_execution",
          "currency": "USD",
          "inference_geo": "global",
          "list_amount": "list_amount",
          "model": "claude-opus-5-5",
          "product": "chat",
          "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
          "requests": 0,
          "slack_channel_id": "C0123ABCDEF",
          "speed": "fast",
          "token_type": "cache_creation.ephemeral_1h_input_tokens"
        }
      ],
      "starting_at": "2019-12-27T18:11:19.117Z"
    }
  ],
  "data_refreshed_at": "2019-12-27T18:11:19.117Z",
  "has_more": true,
  "next_page": "next_page",
  "organization_id": "org_013FP9SaFPBg7Kw7fetjn6cF"
}
```

## Organization › Analytics › User Cost Report

### Get Per-User Cost

`$ ant beta:organization:analytics:user-cost-report list`

**GET** `/v1/organizations/analytics/user_cost_report`

Get per-user cost in USD across a date range.

Returns one row per user, ranked by spend. Use this to see which users
account for the most cost. Only cost attributable to a seat user is
included; for organization-wide totals including direct API-key and
automation traffic, use the bucketed
`/v1/organizations/analytics/cost_report` endpoint. Available to
organizations on a Claude Enterprise plan. Requires an API key with the
`read:analytics` scope.

#### Parameters

- `--starting-at: string` (query parameter)

  Start of range, inclusive. RFC 3339 tz-aware. Must be within the last 365 days and no earlier than 2026-01-01T00:00:00Z.

  format: date-time

- `--bucket-width: optional "1d" or "1h" or "1m"` (query parameter)

  Time-bucket granularity. When set, each row's `starting_at` and `ending_at` are populated and one actor may span several rows (one per time bucket with usage). The time bucket counts toward `limit`, so one page can return multiple rows for the same actor. `ending_at` is required when `bucket_width` is set, and with `bucket_width="1m"` the range may span at most 24 hours. When omitted, each row aggregates the full `[starting_at, ending_at)` range.

- `--claude-tag-category: optional array of BetaAnalyticsClaudeTagCategory` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage in specific spend categories. Usage with no category never matches. `dm` usage is reported under the user's product rather than `claude-tag`, so combining this filter with `products[]=claude-tag` excludes it. Use `group_by[]=claude_tag_category` to break out per-category values.

  maxItems: 100

- `--claude-tag-user-id: optional array of string` (query parameter)

  Filter to Claude Tag (Claude in Slack) usage attributed to specific Slack users, by Slack user ID (for example `U0123ABCDEF`), not claude.ai user ID. Usage that is not Claude Tag, and Claude Tag usage not attributed to a single user, never matches. Use `group_by[]=claude_tag_user_id` to break out per-user values.

  maxItems: 100

- `--context-window: optional array of BetaAnalyticsContextWindow` (query parameter)

  Filter to specific context-window pricing tiers. Use `group_by[]=context_window` to break out per-tier values.

  maxItems: 100

- `--ending-at: optional string` (query parameter)

  End of range, exclusive. When omitted, defaults to the earlier of now and `starting_at` + 31 days. The range may span at most 31 days.

  format: date-time

- `--exclude-deleted-users: optional boolean` (query parameter)

  If true, omit rows for users who are deleted (`deleted: true`). A page may contain fewer than `limit` rows; use `has_more` and `next_page` to paginate as usual.

- `--group-by: optional array of "claude_tag_category" or "claude_tag_user_id" or "context_window" or 8 more` (query parameter)

  Break each actor's row out by the given dimensions. Accepts the same values as the bucketed `/cost_report` endpoint. The `product`, `model`, `context_window`, `inference_geo`, and `speed` dimensions — and the time bucket, when `bucket_width` is set — count toward `limit`. `cost_type` and `token_type` do not: `cost_type` returns one row per cost component (tokens, web search, code execution); `token_type` returns one row per token type, each with `cost_type: "tokens"`; combining both returns the per-token-type rows plus the web-search and code-execution rows. A page can therefore contain more rows than `limit` when `cost_type` or `token_type` is requested.

  maxItems: 100

- `--inference-geo: optional array of BetaAnalyticsInferenceGeoFilter` (query parameter)

  Filter to specific inference regions. `not_available` matches rows where the region is unset. Use `group_by[]=inference_geo` to break out per-region values.

  maxItems: 100

- `--limit: optional number` (query parameter)

  Number of rows per page (1-1000, default 20). One row per actor unless `group_by[]` or `bucket_width` splits an actor across rows; `cost_type`/`token_type` fan-out rows (cost endpoint only) are the exception — they do not count toward this limit, so `data` can exceed it.

  minimum: 1, maximum: 1000

- `--model: optional array of string` (query parameter)

  Models to include. Defaults to all models. Use `group_by[]=model` to break out per-model values.

  maxItems: 100

- `--order: optional "asc" or "desc"` (query parameter)

  Sort direction. Defaults to `desc`.

- `--order-by: optional "amount" or "list_amount"` (query parameter)

  Metric to rank actors by. Defaults to `amount`.

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--product: optional array of BetaAnalyticsProductFilter` (query parameter)

  Product surfaces to include. Defaults to all products.

  maxItems: 100

- `--rbac-group-id: optional array of string` (query parameter)

  Filter to usage attributed to specific RBAC groups. Accepts tagged RBAC group IDs (`rbac_group_...`) or bare group UUIDs. A row matches when the user belonged to any of the listed groups on the (UTC) day the usage occurred; usage with no group attribution never matches.

  maxItems: 100

- `--slack-channel-id: optional array of string` (query parameter)

  Filter to usage originating from specific Slack channels. Use `group_by[]=slack_channel_id` to break out per-channel values.

  maxItems: 100

- `--speed: optional array of "fast" or "standard"` (query parameter)

  Filter to fast or standard inference mode. Use `group_by[]=speed` to break out per-mode values.

  maxItems: 100

- `--user-id: optional array of string` (query parameter)

  Filter to specific users by tagged user ID.

  maxItems: 100

#### Returns

- `BetaAnalyticsCostUsersResponse: object`

  - `data: array of BetaAnalyticsCostUsersItem`

    Rows for this page, ranked by `order_by` in the `order` direction. One row per user, or several per user when `group_by[]` or `bucket_width` breaks that user's usage or cost out across rows. Rows split out by `cost_type` or `token_type` (cost endpoint only) stay adjacent and are ranked as one unit.

    - `actor: object`

      The user this row's usage or cost is attributed to. Always a `user_actor`.

      - `type: "user_actor"`

        Actor type. Always `"user_actor"`.

      - `deleted: boolean`

        True when the account has been deleted, or when the user is no longer a member of the organization or its associated organizations (for example, their membership was removed or they were deprovisioned via your identity provider). `email_address` stays populated for removed users and is null when the account has been deleted. `name` follows the rules described on that field. The `user_id` is still populated for reconciliation.

      - `email_address: string`

        The user's email address, including for users who are no longer members of the organization or its associated organizations. Null when the account has been deleted (check `deleted`) and for system-minted service accounts, which have no person's mailbox behind them (check `name`).

      - `name: string`

        The user's full name. Null when the user has not set a name. Returns `"Deleted User"` when the account itself has been deleted, or when the user is no longer a member of the organization or its associated organizations and the organization has chosen to hide the names of removed users. Otherwise, the name stays populated for removed users. Rows for system-minted service accounts render the service name (for example, `"Claude Security"` for usage by Anthropic's security-patching service) or null.

      - `user_id: string`

        Tagged user ID.

    - `amount: string`

      Amount (post-discount, pre-credit) in fractional cents (minor units).

    - `claude_tag_category: "dm" or "engaged" or "monitoring" or 2 more`

      Claude Tag (Claude in Slack) spend category: `engaged` (a person addressed Claude in a channel or thread), `proactive` (Claude responded without being addressed), `scheduled` (a scheduled routine ran), `monitoring` (Claude watching a channel it was asked to monitor), or `dm` (direct messages with Claude). Populated only when `claude_tag_category` is in `group_by[]`; null for usage that is not Claude Tag. Direct-message usage is billed to the individual user and is reported under that user's product, not under `claude-tag`. New categories may be added over time.

      - `"dm"`

      - `"engaged"`

      - `"monitoring"`

      - `"proactive"`

      - `"scheduled"`

    - `claude_tag_user_id: string`

      Slack user ID (for example `U0123ABCDEF`) of the member the Claude Tag (Claude in Slack) usage is attributed to, not a claude.ai user ID. Populated only when `claude_tag_user_id` is in `group_by[]`; null for usage that is not Claude Tag and for Claude Tag usage that is not attributed to a single user (for example `monitoring`, and `proactive` usage Claude initiated), so per-user rows can sum to less than the Claude Tag total. Cannot be combined with `group_by[]=rbac_group_id` or the `rbac_group_ids[]` filter.

    - `context_window: "0-200k" or "200k-1M"`

      Context-window pricing tier of the usage or cost. Null unless `context_window` is in `group_by[]`; it can also be null on grouped rows with no context-window tier, such as code execution.

      - `"0-200k"`

      - `"200k-1M"`

    - `cost_type: "code_execution" or "tokens" or "web_search"`

      Cost component breakdown; null when returning the combined total.

      - `"code_execution"`

      - `"tokens"`

      - `"web_search"`

    - `currency: string`

      Currency code for the cost amount. Currently always `"USD"`.

    - `ending_at: string`

      End of the row's UTC time bucket (exclusive), as an RFC 3339 timestamp; equal to `starting_at` plus one `bucket_width`. Null unless `bucket_width` is set.

      format: date-time

    - `inference_geo: "global" or "us"`

      Inference region of the usage or cost. Null unless `inference_geo` is in `group_by[]`; it can also be null on grouped rows where the region is not set (the rows that `inference_geos[]=not_available` matches).

      - `"global"`

      - `"us"`

    - `list_amount: string`

      List-price amount (pre-discount) in fractional cents.

    - `model: string`

      Model that produced the usage or cost, as a model name in the form the `models[]` filter accepts (for example, `claude-opus-5-5`). Null unless `model` is in `group_by[]`; it can also be null on grouped rows whose usage or cost is not attributed to a specific model, such as code execution.

    - `product: string`

      Product surface that produced the usage or cost. Null unless product is in `group_by[]`; it can also be null on grouped rows whose usage cannot be attributed to a known surface. Values include `chat`, `claude_code`, `cowork`, `office_agent`, `claude_in_chrome`, `claude_design`, `claude-tag`, and `chat_cowork_unified`. `claude-tag` is Claude Tag, the Claude product in Slack. `chat_cowork_unified` is Chat and Cowork unified, Cowork's features inside claude.ai chat: chat and Cowork usage by a member who has it turned on is reported under this value instead of `chat` or `cowork`. It is accepted as a filter only on deployments that offer Chat and Cowork unified. Some unattributed usage is reported as "other".

    - `rbac_group_id: string`

      RBAC group (team) the usage is attributed to, in the public tagged `rbac_group_...` spelling — the same spelling the activity resources use for this key, so the same team has one id across resources and it round-trips as an `rbac_group_ids[]` filter value. Populated only when `rbac_group_id` is in `group_by[]`. Any-membership semantics: a user in several groups contributes their full usage to each of those groups' rows, so the named-group rows overlap and their sum can exceed the org total. A null value is the single unassigned row: users in no group on that (UTC) day. For the true org total, run the same query without `group_by[]`.

    - `requests: number`

      Number of API requests in this row's scope. Null when `group_by` includes `cost_type` or `token_type` (the count has no per-component attribution; read it from the ungrouped response). For sandbox / code-execution events, this counts execution spans rather than HTTP requests (these rows surface with `product: null`).

    - `slack_channel_id: string`

      Slack channel the usage originated from. Populated only when `slack_channel_id` is in `group_by[]`; null for usage outside Slack (and for rows recorded before channel attribution was enabled).

    - `speed: "fast" or "standard"`

      Inference speed mode of the usage or cost: `fast` or `standard`. Null unless `speed` is in `group_by[]`.

      - `"fast"`

      - `"standard"`

    - `starting_at: string`

      Start of the row's UTC time bucket (inclusive), as an RFC 3339 timestamp. Null unless `bucket_width` is set; without `bucket_width`, each row aggregates the full requested range.

      format: date-time

    - `token_type: "cache_creation.ephemeral_1h_input_tokens" or "cache_creation.ephemeral_5m_input_tokens" or "cache_read_input_tokens" or 2 more`

      Token type when `cost_type` is `tokens`; null otherwise.

      - `"cache_creation.ephemeral_1h_input_tokens"`

      - `"cache_creation.ephemeral_5m_input_tokens"`

      - `"cache_read_input_tokens"`

      - `"output_tokens"`

      - `"uncached_input_tokens"`

  - `data_refreshed_at: string`

    RFC 3339 timestamp of the export this response was served from. Null when no export yet covers any part of the requested range, in which case `data` is empty. Data beyond this watermark is incomplete; for stable results, set `ending_at` to this value or earlier. Data is typically refreshed every 4 hours. Values can be revised as late events arrive and reconciliation runs, until about 7 days after the end of the calendar month the usage falls in; for example, values for October 1 can change until about November 7.

    format: date-time

  - `has_more: boolean`

    Whether another page is available. When true, pass `next_page` as the `page` parameter to fetch it.

  - `next_page: string`

    Opaque cursor for the next page, or null when `has_more` is false. Pass it as the `page` parameter, keeping the other parameters unchanged. A cursor can expire after the underlying data refreshes; the request then returns HTTP 410 and pagination must restart from the first page.

  - `organization_id: string`

    ID of the Organization.

#### Example

```bash
ant beta:organization:analytics:user-cost-report list \
  --api-key my-anthropic-api-key \
  --starting-at ''\''2019-12-27T18:11:19.117Z'\'''
```

##### Response (200)

```json
{
  "data": [
    {
      "actor": {
        "deleted": true,
        "email": "jane@example.com",
        "email_address": "jane@example.com",
        "name": "Jane Smith",
        "type": "user_actor",
        "user_id": "user_01AbCdEfGhIjKlMnOpQrSt"
      },
      "amount": "41280.000000",
      "claude_tag_category": "dm",
      "claude_tag_user_id": "U0123ABCDEF",
      "context_window": "0-200k",
      "cost_type": "code_execution",
      "currency": "USD",
      "ending_at": "2019-12-27T18:11:19.117Z",
      "inference_geo": "global",
      "list_amount": "51600.000000",
      "model": "claude-opus-5-5",
      "product": "chat",
      "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
      "requests": 128,
      "slack_channel_id": "C0123ABCDEF",
      "speed": "fast",
      "starting_at": "2019-12-27T18:11:19.117Z",
      "token_type": "cache_creation.ephemeral_1h_input_tokens"
    }
  ],
  "data_refreshed_at": "2019-12-27T18:11:19.117Z",
  "has_more": true,
  "next_page": "next_page",
  "organization_id": "org_013FP9SaFPBg7Kw7fetjn6cF"
}
```

## Organization › Spend Limits

### Set Spend Limit

`$ ant beta:organization:spend-limits set`

**POST** `/v1/organizations/spend_limits`

Set a spend limit.

Upsert keyed on (scope, period): setting a limit that already exists
overwrites it in place. A Claude Enterprise organization sets `user`
limits. Its seat-tier, group, and organization-level defaults are configured
in claude.ai. A Claude Console organization sets `organization` and
`workspace` limits, which are monthly and always carry an amount. Setting those
limits is in an early access preview. To request access, contact your
Anthropic account team.

#### Parameters

- `--amount: string`

  Limit amount as a non-negative integer decimal string in the minor unit of the organization's billing currency (cents for USD): "50000" is $500.00. `null` sets an explicit no-limit override for this scope and `period` only — each period resolves independently, so caps for other periods still apply.

- `--scope: BetaSpendLimitUserScope or BetaSpendLimitOrganizationScope or BetaSpendLimitWorkspaceScope`

  What the limit applies to. Claude Enterprise organizations set `user` limits. Claude Console organizations set `organization` and `workspace` limits. Any other combination returns 400. Setting `organization` and `workspace` limits through the API is in an early access preview. To request access, contact your Anthropic account team.

- `--period: optional "daily" or "monthly" or "weekly"`

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

#### Returns

- `beta_spend_limit: object`

  A configured spend limit: a cap on metered spend for one scope and period.

  - `type: "spend_limit"`

    Object type. Always `spend_limit`.

  - `id: string`

    Unique tagged ID of the spend limit (`spl_...`).

  - `amount: string`

    Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

  - `created_at: string`

    RFC 3339 datetime at which the spend limit was created.

    format: date-time

  - `currency: string`

    ISO 4217 code of the organization's billing currency; the unit for `amount`.

  - `is_enabled: boolean`

    Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

  - `period: "daily" or "monthly" or "weekly"`

    Length of the window the limit resets over. `amount` caps spend within each period.

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

    What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

      - `type: "user"`

        Scope type. Always `user` for this scope.

      - `user_id: string`

        Tagged ID of the member the spend limit applies to.

    - `beta_spend_limit_seat_tier_scope: object`

      - `type: "seat_tier"`

      - `seat_tier: string`

    - `beta_spend_limit_rbac_group_scope: object`

      - `type: "rbac_group"`

      - `rbac_group_id: string`

    - `beta_spend_limit_organization_service_scope: object`

      - `type: "organization_service"`

      - `service: string`

    - `beta_spend_limit_organization_scope: object`

      - `type: "organization"`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

      - `type: "workspace"`

        Scope type. Always `workspace` for this scope.

      - `workspace_id: string`

        Tagged ID of the workspace the spend limit applies to.

  - `updated_at: string`

    RFC 3339 datetime at which the spend limit was last modified.

    format: date-time

#### Example

```bash
ant beta:organization:spend-limits set \
  --api-key my-anthropic-api-key \
  --amount 50000 \
  --scope '{type: user, user_id: user_01WCz1FkmYMm4gnmykNKUu3Q}'
```

##### Response (200)

```json
{
  "id": "id",
  "amount": "50000",
  "created_at": "2019-12-27T18:11:19.117Z",
  "currency": "USD",
  "is_enabled": true,
  "period": "daily",
  "scope": {
    "type": "user",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "type": "spend_limit",
  "updated_at": "2019-12-27T18:11:19.117Z"
}
```

### Get Spend Limit

`$ ant beta:organization:spend-limits retrieve`

**GET** `/v1/organizations/spend_limits/{spend_limit_id}`

Retrieve a spend limit by ID.

#### Parameters

- `--spend-limit-id: string` (path parameter)

  ID of the Spend Limit.

#### Returns

- `beta_spend_limit: object`

  A configured spend limit: a cap on metered spend for one scope and period.

  - `type: "spend_limit"`

    Object type. Always `spend_limit`.

  - `id: string`

    Unique tagged ID of the spend limit (`spl_...`).

  - `amount: string`

    Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

  - `created_at: string`

    RFC 3339 datetime at which the spend limit was created.

    format: date-time

  - `currency: string`

    ISO 4217 code of the organization's billing currency; the unit for `amount`.

  - `is_enabled: boolean`

    Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

  - `period: "daily" or "monthly" or "weekly"`

    Length of the window the limit resets over. `amount` caps spend within each period.

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

    What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

      - `type: "user"`

        Scope type. Always `user` for this scope.

      - `user_id: string`

        Tagged ID of the member the spend limit applies to.

    - `beta_spend_limit_seat_tier_scope: object`

      - `type: "seat_tier"`

      - `seat_tier: string`

    - `beta_spend_limit_rbac_group_scope: object`

      - `type: "rbac_group"`

      - `rbac_group_id: string`

    - `beta_spend_limit_organization_service_scope: object`

      - `type: "organization_service"`

      - `service: string`

    - `beta_spend_limit_organization_scope: object`

      - `type: "organization"`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

      - `type: "workspace"`

        Scope type. Always `workspace` for this scope.

      - `workspace_id: string`

        Tagged ID of the workspace the spend limit applies to.

  - `updated_at: string`

    RFC 3339 datetime at which the spend limit was last modified.

    format: date-time

#### Example

```bash
ant beta:organization:spend-limits retrieve \
  --api-key my-anthropic-api-key \
  --spend-limit-id spend_limit_id
```

##### Response (200)

```json
{
  "id": "id",
  "amount": "50000",
  "created_at": "2019-12-27T18:11:19.117Z",
  "currency": "USD",
  "is_enabled": true,
  "period": "daily",
  "scope": {
    "type": "user",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "type": "spend_limit",
  "updated_at": "2019-12-27T18:11:19.117Z"
}
```

### Delete Spend Limit

`$ ant beta:organization:spend-limits delete`

**DELETE** `/v1/organizations/spend_limits/{spend_limit_id}`

Delete a spend limit.

For a Claude Enterprise organization, this deletes a per-user override, and
the member falls back to any inherited spend limit at that period. Its
seat-tier, group, and organization-level rows cannot be deleted via this
endpoint. A Claude Console organization deletes its organization and
workspace limits. Deleting them through the API is in an early access preview.

#### Parameters

- `--spend-limit-id: string` (path parameter)

  ID of the Spend Limit.

#### Returns

- `BetaOrganizationSpendLimitDeleteResponse: object`

  - `type: "spend_limit_deleted"`

  - `id: string`

#### Example

```bash
ant beta:organization:spend-limits delete \
  --api-key my-anthropic-api-key \
  --spend-limit-id spend_limit_id
```

##### Response (200)

```json
{
  "id": "id",
  "type": "spend_limit_deleted"
}
```

### List Spend Limits

`$ ant beta:organization:spend-limits list`

**GET** `/v1/organizations/spend_limits`

List the organization's spend limits.

Limits are grouped by scope type, in the order `organization`, `seat_tier`,
`rbac_group`, `organization_service`, `user`; within a type they come in a
fixed order that is not creation order. Supported for Claude Enterprise
organizations only, not for Claude Console organizations.

#### Parameters

- `--limit: optional number` (query parameter)

  Maximum number of limits per page. Defaults to `20`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--scope-type: optional array of "organization" or "organization_service" or "rbac_group" or 3 more` (query parameter)

  Return only limits with these scope types. Omit for all.

  maxItems: 100

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `spend-limit-reads-2026-09-26` in this header.

#### Returns

- `BetaListSpendLimitsResponse: object`

  - `data: array of BetaSpendLimit`

    - `type: "spend_limit"`

      Object type. Always `spend_limit`.

    - `id: string`

      Unique tagged ID of the spend limit (`spl_...`).

    - `amount: string`

      Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

    - `created_at: string`

      RFC 3339 datetime at which the spend limit was created.

      format: date-time

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount`.

    - `is_enabled: boolean`

      Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

    - `period: "daily" or "monthly" or "weekly"`

      Length of the window the limit resets over. `amount` caps spend within each period.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

    - `updated_at: string`

      RFC 3339 datetime at which the spend limit was last modified.

      format: date-time

  - `next_page: string`

#### Example

```bash
ant beta:organization:spend-limits list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "id",
      "amount": "50000",
      "created_at": "2019-12-27T18:11:19.117Z",
      "currency": "USD",
      "is_enabled": true,
      "period": "daily",
      "scope": {
        "type": "user",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "type": "spend_limit",
      "updated_at": "2019-12-27T18:11:19.117Z"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Spend Limits › Effective

### List Effective Spend Limits

`$ ant beta:organization:spend-limits:effective list`

**GET** `/v1/organizations/spend_limits/effective`

List each member's effective spend limit and period-to-date spend.

Returns one row per (member, period) the member resolves a spend limit
for, with the `source` scope the spend limit was inherited from.
Paginates by member, so a member's periods never split across pages.
Supported for Claude Enterprise organizations only, not for Claude Console
organizations.

#### Parameters

- `--limit: optional number` (query parameter)

  Maximum number of members per page. A member's period rows never split across pages, so a page may carry more rows than this. Defaults to `20`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--period: optional array of "daily" or "monthly" or "weekly"` (query parameter)

  Restrict the report to these limit periods. Omit to return one row per period each member resolves a spend limit for.

  maxItems: 3

- `--user-id: optional array of string` (query parameter)

  Restrict the report to these members, by tagged user ID (`user_...`). At most 100 entries.

  maxItems: 100

#### Returns

- `BetaListEffectiveSpendLimitsResponse: object`

  - `data: array of BetaSpendSummary`

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

        - `type: "user_actor"`

          Actor type. Always `user_actor`.

        - `deleted: boolean`

          True only when the underlying account has been deleted.

        - `email_address: string`

          The user's email address. Null when the account is unavailable or has been deleted.

        - `name: string`

          The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

        - `user_id: string`

          Tagged ID of the user.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

        - `type: "scoped_api_key_actor"`

        - `scoped_api_key_id: string`

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

    - `spend_limit_id: string`

  - `next_page: string`

#### Example

```bash
ant beta:organization:spend-limits:effective list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "actor": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "amount": "50000",
      "currency": "USD",
      "period": "daily",
      "period_to_date_spend": "12050.5",
      "scope": {
        "type": "user",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "source": {
        "type": "user",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "spend_limit_id": "spend_limit_id"
    }
  ],
  "next_page": "next_page"
}
```

## Organization › Spend Limits › Increase Requests

### List Spend Limit Increase Requests

`$ ant beta:organization:spend-limits:increase-requests list`

**GET** `/v1/organizations/spend_limit_increase_requests`

List spend limit increase requests, most recent first.

Pending requests include a live `spend_summary` for the requester.
Requests whose requester is no longer a member are excluded.

#### Parameters

- `--actor-id: optional array of string` (query parameter)

  Filter by requester, as `user_...` tagged IDs.

- `--limit: optional number` (query parameter)

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--status: optional array of BetaSpendLimitIncreaseRequestStatus` (query parameter)

  Filter by status. Omit to return all.

#### Returns

- `BetaSpendLimitIncreaseRequestListResponse: object`

  - `data: array of BetaSpendLimitIncreaseRequest`

    - `type: "spend_limit_increase_request"`

    - `id: string`

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

        - `type: "user_actor"`

          Actor type. Always `user_actor`.

        - `deleted: boolean`

          True only when the underlying account has been deleted.

        - `email_address: string`

          The user's email address. Null when the account is unavailable or has been deleted.

        - `name: string`

          The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

        - `user_id: string`

          Tagged ID of the user.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

        - `type: "scoped_api_key_actor"`

        - `scoped_api_key_id: string`

    - `created_at: string`

      format: date-time

    - `period: "daily" or "monthly" or "weekly"`

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `resolved_at: string`

      format: date-time

    - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `spend_summary: object`

      Per-member effective-limit report row (`GET /spend_limits/effective`).

      - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

        - `beta_spend_limit_user_actor: object`

          A user within the organization. `name` and `email_address` are
          null when the underlying account is unavailable or has been deleted;
          `deleted` is true only for deleted accounts.

        - `beta_spend_limit_scoped_api_key_actor: object`

          A scoped Admin API key acting on behalf of the organization.

      - `amount: string`

        Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

      - `currency: string`

        ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

      - `period: "daily" or "monthly" or "weekly"`

        Period this row's effective limit and spend are reported for.

        - `"daily"`

        - `"monthly"`

        - `"weekly"`

      - `period_to_date_spend: string`

        The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

      - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

        - `beta_spend_limit_user_scope: object`

          Scope selecting a single member of the organization.

          - `type: "user"`

            Scope type. Always `user` for this scope.

          - `user_id: string`

            Tagged ID of the member the spend limit applies to.

        - `beta_spend_limit_seat_tier_scope: object`

          - `type: "seat_tier"`

          - `seat_tier: string`

        - `beta_spend_limit_rbac_group_scope: object`

          - `type: "rbac_group"`

          - `rbac_group_id: string`

        - `beta_spend_limit_organization_service_scope: object`

          - `type: "organization_service"`

          - `service: string`

        - `beta_spend_limit_organization_scope: object`

          - `type: "organization"`

        - `beta_spend_limit_workspace_scope: object`

          Scope selecting one workspace of a Claude Console organization.

          - `type: "workspace"`

            Scope type. Always `workspace` for this scope.

          - `workspace_id: string`

            Tagged ID of the workspace the spend limit applies to.

      - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

        - `beta_spend_limit_user_scope: object`

          Scope selecting a single member of the organization.

        - `beta_spend_limit_seat_tier_scope: object`

        - `beta_spend_limit_rbac_group_scope: object`

        - `beta_spend_limit_organization_service_scope: object`

        - `beta_spend_limit_organization_scope: object`

        - `beta_spend_limit_workspace_scope: object`

          Scope selecting one workspace of a Claude Console organization.

      - `spend_limit_id: string`

    - `status: "approved" or "denied" or "pending"`

      - `"approved"`

      - `"denied"`

      - `"pending"`

  - `next_page: string`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "id",
      "actor": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "created_at": "2019-12-27T18:11:19.117Z",
      "period": "daily",
      "resolved_at": "2019-12-27T18:11:19.117Z",
      "resolved_by": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "spend_summary": {
        "actor": {
          "deleted": true,
          "email_address": "email_address",
          "name": "name",
          "type": "user_actor",
          "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
        },
        "amount": "50000",
        "currency": "USD",
        "period": "daily",
        "period_to_date_spend": "12050.5",
        "scope": {
          "type": "user",
          "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
        },
        "source": {
          "type": "user",
          "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
        },
        "spend_limit_id": "spend_limit_id"
      },
      "status": "approved",
      "type": "spend_limit_increase_request"
    }
  ],
  "next_page": "next_page"
}
```

### Get Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests retrieve`

**GET** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}`

Retrieve a spend limit increase request.

While `pending`, the response includes a live `spend_summary` for the
requester at the request's period.

#### Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

#### Returns

- `beta_spend_limit_increase_request: object`

  - `type: "spend_limit_increase_request"`

  - `id: string`

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `created_at: string`

    format: date-time

  - `period: "daily" or "monthly" or "weekly"`

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `resolved_at: string`

    format: date-time

  - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

  - `spend_summary: object`

    Per-member effective-limit report row (`GET /spend_limits/effective`).

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

    - `spend_limit_id: string`

  - `status: "approved" or "denied" or "pending"`

    - `"approved"`

    - `"denied"`

    - `"pending"`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests retrieve \
  --api-key my-anthropic-api-key \
  --spend-limit-increase-request-id spend_limit_increase_request_id
```

##### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "spend_summary": {
    "actor": {
      "deleted": true,
      "email_address": "email_address",
      "name": "name",
      "type": "user_actor",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "amount": "50000",
    "currency": "USD",
    "period": "daily",
    "period_to_date_spend": "12050.5",
    "scope": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "source": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "spend_limit_id": "spend_limit_id"
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```

### Approve Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests approve`

**POST** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}/approve`

Approve a pending spend limit increase request.

Writes a per-user spend limit at `amount` for the requester and
transitions the request to `approved`. `period` defaults to the period
the member was blocked on. Anthropic emails the requester unless
`suppress_notification` is set.

#### Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

- `--amount: string`

  New per-user spend limit as a non-negative integer decimal string (minor units).

- `--period: optional "daily" or "monthly" or "weekly"`

- `--suppress-notification: optional boolean`

#### Returns

- `BetaOrganizationSpendLimitIncreaseRequestApproveResponse: object`

  - `type: "spend_limit_increase_request"`

  - `id: string`

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `created_at: string`

    format: date-time

  - `period: "daily" or "monthly" or "weekly"`

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `resolved_at: string`

    format: date-time

  - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

  - `spend_limit: object`

    A configured spend limit: a cap on metered spend for one scope and period.

    - `type: "spend_limit"`

      Object type. Always `spend_limit`.

    - `id: string`

      Unique tagged ID of the spend limit (`spl_...`).

    - `amount: string`

      Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

    - `created_at: string`

      RFC 3339 datetime at which the spend limit was created.

      format: date-time

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount`.

    - `is_enabled: boolean`

      Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

    - `period: "daily" or "monthly" or "weekly"`

      Length of the window the limit resets over. `amount` caps spend within each period.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

    - `updated_at: string`

      RFC 3339 datetime at which the spend limit was last modified.

      format: date-time

  - `spend_summary: object`

    Per-member effective-limit report row (`GET /spend_limits/effective`).

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

    - `spend_limit_id: string`

  - `status: "approved" or "denied" or "pending"`

    - `"approved"`

    - `"denied"`

    - `"pending"`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests approve \
  --api-key my-anthropic-api-key \
  --spend-limit-increase-request-id spend_limit_increase_request_id \
  --amount 50000
```

##### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "spend_limit": {
    "id": "id",
    "amount": "50000",
    "created_at": "2019-12-27T18:11:19.117Z",
    "currency": "USD",
    "is_enabled": true,
    "period": "daily",
    "scope": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "type": "spend_limit",
    "updated_at": "2019-12-27T18:11:19.117Z"
  },
  "spend_summary": {
    "actor": {
      "deleted": true,
      "email_address": "email_address",
      "name": "name",
      "type": "user_actor",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "amount": "50000",
    "currency": "USD",
    "period": "daily",
    "period_to_date_spend": "12050.5",
    "scope": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "source": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "spend_limit_id": "spend_limit_id"
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```

### Deny Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests deny`

**POST** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}/deny`

Deny a pending spend limit increase request.

Idempotent on `denied`; denying an already-`approved` request returns
400. Anthropic emails the requester unless `suppress_notification` is set.

#### Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

- `--suppress-notification: optional boolean`

#### Returns

- `beta_spend_limit_increase_request: object`

  - `type: "spend_limit_increase_request"`

  - `id: string`

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `created_at: string`

    format: date-time

  - `period: "daily" or "monthly" or "weekly"`

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `resolved_at: string`

    format: date-time

  - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

  - `spend_summary: object`

    Per-member effective-limit report row (`GET /spend_limits/effective`).

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

    - `spend_limit_id: string`

  - `status: "approved" or "denied" or "pending"`

    - `"approved"`

    - `"denied"`

    - `"pending"`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests deny \
  --api-key my-anthropic-api-key \
  --spend-limit-increase-request-id spend_limit_increase_request_id
```

##### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "spend_summary": {
    "actor": {
      "deleted": true,
      "email_address": "email_address",
      "name": "name",
      "type": "user_actor",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "amount": "50000",
    "currency": "USD",
    "period": "daily",
    "period_to_date_spend": "12050.5",
    "scope": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "source": {
      "type": "user",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    },
    "spend_limit_id": "spend_limit_id"
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```

## Organization › RBAC Groups

### Create RBAC Group

`$ ant beta:organization:rbac-groups create`

**POST** `/v1/organizations/rbac_groups`

Create an RBAC Group in the Claude Enterprise tenant. Groups created via the API have source type `"direct"`.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--name: string`

  Name of the RBAC Group. Not uniqueness-enforced.

  minLength: 1, maxLength: 255

#### Returns

- `beta_rbac_group: object`

  - `type: "rbac_group"`

    Object type.

    For RBAC Groups, this is always `"rbac_group"`.

  - `id: string`

    ID of the RBAC Group.

  - `created_at: string`

    RFC 3339 timestamp of when the RBAC Group was created.

    format: date-time

  - `name: string`

    Name of the RBAC Group. Not uniqueness-enforced.

  - `role_ids: array of string`

    RBAC Role IDs attached to this RBAC Group. Role attachment is managed in the admin settings and is read-only on this API. `null` means role data was temporarily unavailable — retry to distinguish from an empty list.

  - `source_type: "direct" or "scim"`

    How the RBAC Group was created: `"direct"` for groups created directly (for example, in the organization's admin settings), `"scim"` for groups provisioned by the identity provider.

    - `"direct"`

    - `"scim"`

  - `updated_at: string`

    RFC 3339 timestamp of when the RBAC Group was last updated.

    format: date-time

#### Example

```bash
ant beta:organization:rbac-groups create \
  --api-key my-anthropic-api-key \
  --name Engineering
```

##### Response (200)

```json
{
  "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "name": "Engineering",
  "role_ids": [
    "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
  ],
  "roles": [
    "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
  ],
  "source_type": "direct",
  "type": "rbac_group",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

### List RBAC Groups

`$ ant beta:organization:rbac-groups list`

**GET** `/v1/organizations/rbac_groups`

List RBAC Groups in the Claude Enterprise tenant.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

#### Returns

- `BetaRbacGroupList: object`

  - `data: array of BetaRBACGroup`

    - `type: "rbac_group"`

      Object type.

      For RBAC Groups, this is always `"rbac_group"`.

    - `id: string`

      ID of the RBAC Group.

    - `created_at: string`

      RFC 3339 timestamp of when the RBAC Group was created.

      format: date-time

    - `name: string`

      Name of the RBAC Group. Not uniqueness-enforced.

    - `role_ids: array of string`

      RBAC Role IDs attached to this RBAC Group. Role attachment is managed in the admin settings and is read-only on this API. `null` means role data was temporarily unavailable — retry to distinguish from an empty list.

    - `source_type: "direct" or "scim"`

      How the RBAC Group was created: `"direct"` for groups created directly (for example, in the organization's admin settings), `"scim"` for groups provisioned by the identity provider.

      - `"direct"`

      - `"scim"`

    - `updated_at: string`

      RFC 3339 timestamp of when the RBAC Group was last updated.

      format: date-time

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data.

#### Example

```bash
ant beta:organization:rbac-groups list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
      "created_at": "2024-10-30T23:58:27.427722Z",
      "name": "Engineering",
      "role_ids": [
        "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
      ],
      "roles": [
        "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
      ],
      "source_type": "direct",
      "type": "rbac_group",
      "updated_at": "2024-10-30T23:58:27.427722Z"
    }
  ],
  "has_more": false,
  "next_page": "eyJjdXJzb3IiOiAicmJhY19ncm91cF8wMSJ9"
}
```

### Get RBAC Group

`$ ant beta:organization:rbac-groups retrieve`

**GET** `/v1/organizations/rbac_groups/{rbac_group_id}`

Retrieve an RBAC Group by ID.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

#### Returns

- `beta_rbac_group: object`

  - `type: "rbac_group"`

    Object type.

    For RBAC Groups, this is always `"rbac_group"`.

  - `id: string`

    ID of the RBAC Group.

  - `created_at: string`

    RFC 3339 timestamp of when the RBAC Group was created.

    format: date-time

  - `name: string`

    Name of the RBAC Group. Not uniqueness-enforced.

  - `role_ids: array of string`

    RBAC Role IDs attached to this RBAC Group. Role attachment is managed in the admin settings and is read-only on this API. `null` means role data was temporarily unavailable — retry to distinguish from an empty list.

  - `source_type: "direct" or "scim"`

    How the RBAC Group was created: `"direct"` for groups created directly (for example, in the organization's admin settings), `"scim"` for groups provisioned by the identity provider.

    - `"direct"`

    - `"scim"`

  - `updated_at: string`

    RFC 3339 timestamp of when the RBAC Group was last updated.

    format: date-time

#### Example

```bash
ant beta:organization:rbac-groups retrieve \
  --api-key my-anthropic-api-key \
  --rbac-group-id rbac_group_id
```

##### Response (200)

```json
{
  "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "name": "Engineering",
  "role_ids": [
    "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
  ],
  "roles": [
    "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
  ],
  "source_type": "direct",
  "type": "rbac_group",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

### Update RBAC Group

`$ ant beta:organization:rbac-groups update`

**POST** `/v1/organizations/rbac_groups/{rbac_group_id}`

Update an RBAC Group's name. Groups provisioned by an identity provider (source type `"scim"`) cannot be modified via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--name: optional string`

  Name of the RBAC Group. Not uniqueness-enforced.

  minLength: 1, maxLength: 255

#### Returns

- `beta_rbac_group: object`

  - `type: "rbac_group"`

    Object type.

    For RBAC Groups, this is always `"rbac_group"`.

  - `id: string`

    ID of the RBAC Group.

  - `created_at: string`

    RFC 3339 timestamp of when the RBAC Group was created.

    format: date-time

  - `name: string`

    Name of the RBAC Group. Not uniqueness-enforced.

  - `role_ids: array of string`

    RBAC Role IDs attached to this RBAC Group. Role attachment is managed in the admin settings and is read-only on this API. `null` means role data was temporarily unavailable — retry to distinguish from an empty list.

  - `source_type: "direct" or "scim"`

    How the RBAC Group was created: `"direct"` for groups created directly (for example, in the organization's admin settings), `"scim"` for groups provisioned by the identity provider.

    - `"direct"`

    - `"scim"`

  - `updated_at: string`

    RFC 3339 timestamp of when the RBAC Group was last updated.

    format: date-time

#### Example

```bash
ant beta:organization:rbac-groups update \
  --api-key my-anthropic-api-key \
  --rbac-group-id rbac_group_id
```

##### Response (200)

```json
{
  "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "name": "Engineering",
  "role_ids": [
    "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
  ],
  "roles": [
    "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s"
  ],
  "source_type": "direct",
  "type": "rbac_group",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

### Delete RBAC Group

`$ ant beta:organization:rbac-groups delete`

**DELETE** `/v1/organizations/rbac_groups/{rbac_group_id}`

Delete an RBAC Group. Groups provisioned by an identity provider (source type `"scim"`) cannot be deleted via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

#### Returns

- `BetaOrganizationRBACGroupDeleteResponse: object`

  - `type: "rbac_group_deleted"`

    Deleted object type.

    For RBAC Groups, this is always `"rbac_group_deleted"`.

  - `id: string`

    ID of the RBAC Group.

#### Example

```bash
ant beta:organization:rbac-groups delete \
  --api-key my-anthropic-api-key \
  --rbac-group-id rbac_group_id
```

##### Response (200)

```json
{
  "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_deleted"
}
```

## Organization › RBAC Groups › Members

### List RBAC Group Members

`$ ant beta:organization:rbac-groups:members list`

**GET** `/v1/organizations/rbac_groups/{rbac_group_id}/members`

List members of an RBAC Group.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

#### Returns

- `BetaRbacGroupMemberList: object`

  - `data: array of BetaRBACGroupMember`

    - `type: "rbac_group_member"`

      Object type.

      For RBAC Group Members, this is always `"rbac_group_member"`.

    - `created_at: string`

      RFC 3339 timestamp of when the User was added to the RBAC Group.

      format: date-time

    - `email: string`

      Email of the User.

    - `rbac_group_id: string`

      ID of the RBAC Group.

    - `user_id: string`

      ID of the User.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data.

#### Example

```bash
ant beta:organization:rbac-groups:members list \
  --api-key my-anthropic-api-key \
  --rbac-group-id rbac_group_id
```

##### Response (200)

```json
{
  "data": [
    {
      "created_at": "2024-10-30T23:58:27.427722Z",
      "email": "user@emaildomain.com",
      "group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
      "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
      "type": "rbac_group_member",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    }
  ],
  "has_more": false,
  "next_page": "eyJjdXJzb3IiOiAicmJhY19ncm91cF8wMSJ9"
}
```

### Add RBAC Group Member

`$ ant beta:organization:rbac-groups:members add`

**POST** `/v1/organizations/rbac_groups/{rbac_group_id}/members`

Add a User to an RBAC Group. Membership of groups provisioned by an identity provider (source type `"scim"`) cannot be modified via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--user-id: string`

  ID of the User.

#### Returns

- `beta_rbac_group_member: object`

  - `type: "rbac_group_member"`

    Object type.

    For RBAC Group Members, this is always `"rbac_group_member"`.

  - `created_at: string`

    RFC 3339 timestamp of when the User was added to the RBAC Group.

    format: date-time

  - `email: string`

    Email of the User.

  - `rbac_group_id: string`

    ID of the RBAC Group.

  - `user_id: string`

    ID of the User.

#### Example

```bash
ant beta:organization:rbac-groups:members add \
  --api-key my-anthropic-api-key \
  --rbac-group-id rbac_group_id \
  --user-id user_01WCz1FkmYMm4gnmykNKUu3Q
```

##### Response (200)

```json
{
  "created_at": "2024-10-30T23:58:27.427722Z",
  "email": "user@emaildomain.com",
  "group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_member",
  "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
}
```

### Remove RBAC Group Member

`$ ant beta:organization:rbac-groups:members remove`

**DELETE** `/v1/organizations/rbac_groups/{rbac_group_id}/members/{user_id}`

Remove a User from an RBAC Group. Membership of groups provisioned by an identity provider (source type `"scim"`) cannot be modified via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--user-id: string` (path parameter)

  ID of the User.

#### Returns

- `BetaOrganizationRBACGroupMemberRemoveResponse: object`

  - `type: "rbac_group_member_deleted"`

    Deleted object type. For RBAC Group Members, this is always `"rbac_group_member_deleted"`.

  - `rbac_group_id: string`

    ID of the RBAC Group.

  - `user_id: string`

    ID of the User.

#### Example

```bash
ant beta:organization:rbac-groups:members remove \
  --api-key my-anthropic-api-key \
  --rbac-group-id rbac_group_id \
  --user-id user_id
```

##### Response (200)

```json
{
  "group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_member_deleted",
  "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
}
```

## Organization › RBAC Roles

### List RBAC Roles

`$ ant beta:organization:rbac-roles list`

**GET** `/v1/organizations/rbac_roles`

List RBAC Roles in the organization.

The RBAC Roles API is available to Claude Enterprise organizations only.

#### Parameters

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

#### Returns

- `BetaRbacRoleList: object`

  - `data: array of BetaRBACRole`

    - `type: "rbac_role"`

      Object type.

      For RBAC Roles, this is always `"rbac_role"`.

    - `id: string`

      ID of the RBAC Role.

    - `created_at: string`

      RFC 3339 datetime string indicating when the RBAC Role was created.

      format: date-time

    - `display_name: string`

      Name of the RBAC Role. For a role created by Anthropic, this name can differ from the label claude.ai shows, and Anthropic may change the name. To keep a lasting reference to a role, store its `id`.

    - `updated_at: string`

      RFC 3339 datetime string indicating when the RBAC Role was last updated.

      format: date-time

    - `name: string`

      **Deprecated**: Use `display_name` instead; `name` always has the same value.

      Deprecated: use `display_name` instead. Name of the RBAC Role; always the same value as `display_name`.

  - `has_more: boolean`

    Indicates whether there are more results beyond this page.

  - `next_page: string`

    Opaque cursor for the next page. Pass as the `page` parameter on the next
    request.

#### Example

```bash
ant beta:organization:rbac-roles list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s",
      "created_at": "2024-10-30T23:58:27.427722Z",
      "display_name": "Project Editor",
      "name": "Project Editor",
      "type": "rbac_role",
      "updated_at": "2024-10-30T23:58:27.427722Z"
    }
  ],
  "has_more": true,
  "next_page": "eyJjdXJzb3IiOiAicmJhY19yb2xlXzAxIn0"
}
```

### Get RBAC Role

`$ ant beta:organization:rbac-roles retrieve`

**GET** `/v1/organizations/rbac_roles/{rbac_role_id}`

Retrieve an RBAC Role by ID.

The RBAC Roles API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-role-id: string` (path parameter)

  ID of the RBAC Role.

#### Returns

- `beta_rbac_role: object`

  - `type: "rbac_role"`

    Object type.

    For RBAC Roles, this is always `"rbac_role"`.

  - `id: string`

    ID of the RBAC Role.

  - `created_at: string`

    RFC 3339 datetime string indicating when the RBAC Role was created.

    format: date-time

  - `display_name: string`

    Name of the RBAC Role. For a role created by Anthropic, this name can differ from the label claude.ai shows, and Anthropic may change the name. To keep a lasting reference to a role, store its `id`.

  - `updated_at: string`

    RFC 3339 datetime string indicating when the RBAC Role was last updated.

    format: date-time

  - `name: string`

    **Deprecated**: Use `display_name` instead; `name` always has the same value.

    Deprecated: use `display_name` instead. Name of the RBAC Role; always the same value as `display_name`.

#### Example

```bash
ant beta:organization:rbac-roles retrieve \
  --api-key my-anthropic-api-key \
  --rbac-role-id rbac_role_id
```

##### Response (200)

```json
{
  "id": "rbac_role_016J8xVtKpDq3Wy9ZmN2hR4s",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "display_name": "Project Editor",
  "name": "Project Editor",
  "type": "rbac_role",
  "updated_at": "2024-10-30T23:58:27.427722Z"
}
```

## Organization › RBAC Roles › Permissions

### List RBAC Role Permissions

`$ ant beta:organization:rbac-roles:permissions list`

**GET** `/v1/organizations/rbac_roles/{rbac_role_id}/permissions`

List the permissions an RBAC Role grants.

The RBAC Roles API is available to Claude Enterprise organizations only.

#### Parameters

- `--rbac-role-id: string` (path parameter)

  ID of the RBAC Role.

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

#### Returns

- `BetaRbacRolePermissionList: object`

  - `data: array of BetaRBACRolePermission`

    - `type: "rbac_role_permission"`

      Object type.

      For RBAC Role Permissions, this is always `"rbac_role_permission"`.

    - `action: string`

      Action the permission grants on the resource.

      The vocabulary follows the resource: an `organization` grant carries a
      product-feature entitlement (for example `chat`), an admin-panel
      permission entitlement (`permission_*`), or a blanket capability-access
      mode — `capability_access_all` grants every product-feature entitlement,
      and `capability_access_all_ga` grants the generally-available subset as
      it stands at permission-check time; neither mode grants model-access
      entitlements. A consumer enumerating a role's per-feature grants should
      treat a blanket row as granting every product-feature entitlement it
      covers, or it will under-report the role's effective access. A `connector_tool` grant carries
      a tool-access action (`use` or `always_allow`); a `connector_scope` grant
      carries the scope action `grant` (the role may receive the named OAuth
      scope when tokens are minted for the connector); `connector` and
      `all_connectors` grants carry a tool-access action, the scope action, or
      an authentication-method action (`interactive` or `managed`).

    - `resource: BetaRBACOrganizationPermissionResource or BetaRBACConnectorToolPermissionResource or BetaRBACConnectorScopePermissionResource or 2 more`

      What the permission applies to.

      A tagged union: `type` names the kind of resource and determines which
      identifier fields are present.

      - `beta_rbac_organization_permission_resource: object`

        - `type: "organization"`

          Kind of resource the permission applies to.

        - `organization_id: string`

          UUID of the organization the permission applies to.

      - `beta_rbac_connector_tool_permission_resource: object`

        - `type: "connector_tool"`

          Kind of resource the permission applies to.

        - `connector_id: string`

          ID of the connector the permission applies to.

        - `tool_name: string`

          Published name of the connector tool the permission applies to.

          When the published name contains characters outside `[a-zA-Z0-9_-]` (or
          collides with a reserved form), it is server-encoded into a stable
          `{prefix}_{32-hex}` form — a shortened readable prefix of the name plus
          a hash — from which the published name is not recoverable.

      - `beta_rbac_connector_scope_permission_resource: object`

        - `type: "connector_scope"`

          Kind of resource the permission applies to.

        - `connector_id: string`

          ID of the connector the permission applies to.

        - `scope: string`

          OAuth scope the permission names — the role may receive this scope when
          tokens are minted for the connector.

          Subject to the same encoding rule as `tool_name`: a scope containing
          characters outside `[a-zA-Z0-9_-]` (or colliding with a reserved form)
          appears server-encoded in a stable `{prefix}_{32-hex}` form. OAuth
          scopes routinely contain `:` and `/`, so most appear encoded.

      - `beta_rbac_connector_permission_resource: object`

        - `type: "connector"`

          Kind of resource the permission applies to.

        - `connector_id: string`

          ID of the connector the permission applies to.

      - `beta_rbac_all_connectors_permission_resource: object`

        - `type: "all_connectors"`

          Kind of resource the permission applies to.

  - `has_more: boolean`

    Indicates whether there are more results beyond this page.

  - `next_page: string`

    Opaque cursor for the next page. Pass as the `page` parameter on the next
    request.

#### Example

```bash
ant beta:organization:rbac-roles:permissions list \
  --api-key my-anthropic-api-key \
  --rbac-role-id rbac_role_id
```

##### Response (200)

```json
{
  "data": [
    {
      "action": "use",
      "resource": {
        "organization_id": "3c4f5e6d-7a8b-49c0-9d1e-2f3a4b5c6d7e",
        "type": "organization"
      },
      "type": "rbac_role_permission"
    }
  ],
  "has_more": true,
  "next_page": "eyJjdXJzb3IiOiAicmJhY19yb2xlXzAxIn0"
}
```

## Organization › Plugins

### Create Plugin

`$ ant beta:organization:plugins create`

**POST** `/v1/organizations/plugins`

Create an organization-owned Plugin and its first version by uploading the
version's files.

The upload is `multipart/form-data`: the version's files (`files`, each part sent
as `files[]`), with an optional `marketplace_id` and `release_notes`. The manifest's `name` becomes the
Plugin's `name`, and `display_name`, `description` and `manifest_version` come
from the manifest too.

`name` may contain lowercase letters (from any alphabet), digits, and hyphens, up
to 64 characters. Uppercase letters, spaces, underscores, and other punctuation are
rejected.

The `name` must be unique within the marketplace: a name already taken
returns a 409 with `error_code` `plugin_name_taken` and, when a Plugin holds it,
that Plugin's ID in `details.plugin_id`. A Plugin going into the organization's
library marketplace is also refused with a 409 when one of its skills has the name of
an organization skill (a skill an administrator uploaded for the whole organization
in claude.ai): `error_code` `skill_name_taken`, with that name in
`details.skill_name`; rename the skill, or remove the organization skill in
claude.ai. A 503 with `error_code`
`registration_pending` means the Plugin and its version were stored (their IDs are
in `details`) but are not yet usable in claude.ai: do not retry the create (the
retry would return `plugin_name_taken`); create a version on the stored Plugin
instead, which completes it.

For a worked example, see [Create a plugin](https://platform.claude.com/docs/en/manage-claude/plugins-api?sdk_languages=cli#create-a-plugin)
in the Plugins API guide.

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--file: array of string`

  The version's files: one part per file, the part's filename being the file's path within the Plugin (for example `skills/review-pr/SKILL.md`), or a single `.zip` or `.plugin` archive holding them all. On the wire each part is named `files[]`, and a part named plain `files` is not read; with cURL, `-F 'files[]=@SKILL.md;filename=skills/review-pr/SKILL.md'`. The files must include the manifest, `.claude-plugin/plugin.json`.

- `--marketplace-id: optional string`

  ID of the organization-owned plugin marketplace to create the Plugin in (prefixed `marketplace_`). It must be a `manual` marketplace, one whose Plugins are uploaded rather than synchronized from a repository. When omitted, the Plugin is created in the organization's library marketplace, an organization-owned `manual` marketplace created on first use.

- `--release-notes: optional string`

  Release notes stored with the version and shown in its version history in claude.ai; up to 5,000 characters.

  maxLength: 5000

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin: object`

  - `type: "plugin"`

    Always `plugin`.

  - `id: string`

    The Plugin's ID.

  - `components: array of BetaPluginComponent`

    What the served version contains; null when not enumerated.

    - `type: "agent" or "cli" or "command" or 3 more`

      The kind of component.

      - `"agent"`

      - `"cli"`

      - `"command"`

      - `"hook"`

      - `"mcp_server"`

      - `"skill"`

    - `description: string`

      What the component declares about itself; always null for MCP servers, hooks, and CLIs.

    - `name: string`

      The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

  - `content_scan: object`

    The served version's content scan; null when it has not been scanned.

    - `assessment: "fail" or "pass" or "unknown" or "warn"`

      The scan's verdict; set only when `status` is `completed`.

      - `"fail"`

      - `"pass"`

      - `"unknown"`

      - `"warn"`

    - `reason: string`

      The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

    - `status: "completed" or "errored" or "processing"`

      `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

      - `"completed"`

      - `"errored"`

      - `"processing"`

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

    Who created the Plugin; null when no creator is recorded.

    - `beta_plugin_user_actor: object`

      - `type: "user_actor"`

        A member of the organization.

      - `email_address: string`

        The member's email address; may be null, for example when they are no longer a member of the organization.

      - `user_id: string`

        The member's User ID.

    - `beta_plugin_api_actor: object`

      - `type: "api_actor"`

        An Admin API key, in the same form the Compliance API activity feed uses for it.

      - `api_key_id: string`

        The key's ID.

  - `description: string`

    The served version's description.

  - `display_name: string`

    The served version's display name.

  - `latest_version_id: string`

    The newest version.

  - `manifest_version: string`

    The version string the served version's manifest declares.

  - `marketplace_id: string`

    The ID of the plugin marketplace the Plugin lives in.

  - `name: string`

    Lowercase identifier, unique within its plugin marketplace. Fixed for an organization-owned Plugin's lifetime; a member-owned Plugin's changes when its owner renames it in claude.ai, while its `id` stays the same.

  - `organization_installation_preference: "auto_install" or "available" or "not_available" or "required"`

    Organization-owned Plugin: the organization-wide installation setting every member gets unless an RBAC Group they belong to holds its own — the Plugin's own setting, or its plugin marketplace's default. Null for a member-owned Plugin, which has shares instead. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

    - `"auto_install"`

    - `"available"`

    - `"not_available"`

    - `"required"`

  - `organization_installation_preference_inherited: boolean`

    Organization-owned Plugin: true while it has no organization-wide setting of its own and `organization_installation_preference` is its plugin marketplace's default. Null for a member-owned Plugin.

  - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

    Who owns the Plugin: the organization, or the member whose personal plugin marketplace it lives in.

    - `beta_plugin_owner_organization: object`

      - `type: "organization"`

        The Plugin lives in a plugin marketplace the organization owns.

    - `beta_plugin_owner_user: object`

      - `type: "user"`

        The Plugin lives in one member's personal plugin marketplace.

      - `user_id: string`

        The member's User ID.

  - `reach: "contained" or "privileged" or "remote"`

    How far the served version reaches: `remote` when it declares an MCP server or a CLI, `privileged` when it declares a hook, monitor, language server or settings but nothing remote, `contained` otherwise; null when not classifiable.

    - `"contained"`

    - `"privileged"`

    - `"remote"`

  - `served_version_id: string`

    The version claude.ai serves to members.

  - `served_version_pinned: boolean`

    False while the served version follows each new version; true once it has been pinned to one.

  - `updated_at: string`

    RFC 3339. Moves on a new version and on a served-version change; a change to the Plugin's installation settings or shares does not move it.

    format: date-time

#### Example

```bash
ant beta:organization:plugins create \
  --api-key my-anthropic-api-key \
  --file 'Example data'
```

##### Response (200)

```json
{
  "id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "components": [
    {
      "description": "description",
      "name": "review-pr",
      "type": "skill"
    }
  ],
  "content_scan": {
    "assessment": "warn",
    "reason": "credential-exposure",
    "status": "completed"
  },
  "created_at": "2026-03-14T09:26:53.589793Z",
  "created_by": {
    "email_address": "user@example.com",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "description": "Reviews pull requests against your team's conventions.",
  "display_name": "Code Review Helper",
  "latest_version_id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
  "manifest_version": "1.2.0",
  "marketplace_id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
  "name": "code-review-helper",
  "organization_installation_preference": "available",
  "organization_installation_preference_inherited": true,
  "owner": {
    "type": "organization"
  },
  "reach": "contained",
  "served_version_id": "pluginver_01K9wPcHd4Rm2Tx8Vq6Ln3Sb",
  "served_version_pinned": true,
  "type": "plugin",
  "updated_at": "2026-03-14T09:26:53.589793Z"
}
```

### Get Plugin

`$ ant beta:organization:plugins retrieve`

**GET** `/v1/organizations/plugins/{plugin_id}`

Retrieve a Plugin by ID.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin: object`

  - `type: "plugin"`

    Always `plugin`.

  - `id: string`

    The Plugin's ID.

  - `components: array of BetaPluginComponent`

    What the served version contains; null when not enumerated.

    - `type: "agent" or "cli" or "command" or 3 more`

      The kind of component.

      - `"agent"`

      - `"cli"`

      - `"command"`

      - `"hook"`

      - `"mcp_server"`

      - `"skill"`

    - `description: string`

      What the component declares about itself; always null for MCP servers, hooks, and CLIs.

    - `name: string`

      The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

  - `content_scan: object`

    The served version's content scan; null when it has not been scanned.

    - `assessment: "fail" or "pass" or "unknown" or "warn"`

      The scan's verdict; set only when `status` is `completed`.

      - `"fail"`

      - `"pass"`

      - `"unknown"`

      - `"warn"`

    - `reason: string`

      The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

    - `status: "completed" or "errored" or "processing"`

      `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

      - `"completed"`

      - `"errored"`

      - `"processing"`

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

    Who created the Plugin; null when no creator is recorded.

    - `beta_plugin_user_actor: object`

      - `type: "user_actor"`

        A member of the organization.

      - `email_address: string`

        The member's email address; may be null, for example when they are no longer a member of the organization.

      - `user_id: string`

        The member's User ID.

    - `beta_plugin_api_actor: object`

      - `type: "api_actor"`

        An Admin API key, in the same form the Compliance API activity feed uses for it.

      - `api_key_id: string`

        The key's ID.

  - `description: string`

    The served version's description.

  - `display_name: string`

    The served version's display name.

  - `latest_version_id: string`

    The newest version.

  - `manifest_version: string`

    The version string the served version's manifest declares.

  - `marketplace_id: string`

    The ID of the plugin marketplace the Plugin lives in.

  - `name: string`

    Lowercase identifier, unique within its plugin marketplace. Fixed for an organization-owned Plugin's lifetime; a member-owned Plugin's changes when its owner renames it in claude.ai, while its `id` stays the same.

  - `organization_installation_preference: "auto_install" or "available" or "not_available" or "required"`

    Organization-owned Plugin: the organization-wide installation setting every member gets unless an RBAC Group they belong to holds its own — the Plugin's own setting, or its plugin marketplace's default. Null for a member-owned Plugin, which has shares instead. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

    - `"auto_install"`

    - `"available"`

    - `"not_available"`

    - `"required"`

  - `organization_installation_preference_inherited: boolean`

    Organization-owned Plugin: true while it has no organization-wide setting of its own and `organization_installation_preference` is its plugin marketplace's default. Null for a member-owned Plugin.

  - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

    Who owns the Plugin: the organization, or the member whose personal plugin marketplace it lives in.

    - `beta_plugin_owner_organization: object`

      - `type: "organization"`

        The Plugin lives in a plugin marketplace the organization owns.

    - `beta_plugin_owner_user: object`

      - `type: "user"`

        The Plugin lives in one member's personal plugin marketplace.

      - `user_id: string`

        The member's User ID.

  - `reach: "contained" or "privileged" or "remote"`

    How far the served version reaches: `remote` when it declares an MCP server or a CLI, `privileged` when it declares a hook, monitor, language server or settings but nothing remote, `contained` otherwise; null when not classifiable.

    - `"contained"`

    - `"privileged"`

    - `"remote"`

  - `served_version_id: string`

    The version claude.ai serves to members.

  - `served_version_pinned: boolean`

    False while the served version follows each new version; true once it has been pinned to one.

  - `updated_at: string`

    RFC 3339. Moves on a new version and on a served-version change; a change to the Plugin's installation settings or shares does not move it.

    format: date-time

#### Example

```bash
ant beta:organization:plugins retrieve \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id
```

##### Response (200)

```json
{
  "id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "components": [
    {
      "description": "description",
      "name": "review-pr",
      "type": "skill"
    }
  ],
  "content_scan": {
    "assessment": "warn",
    "reason": "credential-exposure",
    "status": "completed"
  },
  "created_at": "2026-03-14T09:26:53.589793Z",
  "created_by": {
    "email_address": "user@example.com",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "description": "Reviews pull requests against your team's conventions.",
  "display_name": "Code Review Helper",
  "latest_version_id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
  "manifest_version": "1.2.0",
  "marketplace_id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
  "name": "code-review-helper",
  "organization_installation_preference": "available",
  "organization_installation_preference_inherited": true,
  "owner": {
    "type": "organization"
  },
  "reach": "contained",
  "served_version_id": "pluginver_01K9wPcHd4Rm2Tx8Vq6Ln3Sb",
  "served_version_pinned": true,
  "type": "plugin",
  "updated_at": "2026-03-14T09:26:53.589793Z"
}
```

### Update Plugin

`$ ant beta:organization:plugins update`

**POST** `/v1/organizations/plugins/{plugin_id}`

Change which stored version of an organization-owned Plugin is served to members,
for example to roll back to an earlier one. This pins the served version: later
uploads are stored but no longer change what is served, and pinning cannot currently
be undone, here or in claude.ai.

Pass the version as `served_version_id`: an earlier one to roll back, a later one to
start serving a version that was stored without being served, or the one already
served to pin it without changing what is served. No new version is created.

When the organization has content scanning enabled, a version whose scan is still
running is refused with a 409 (`error_code` `scan_pending`; retry once the scan
finishes) and one whose scan failed, errored or reached no verdict with a 400
(`scan_failed`; a `warn` is accepted). When the Plugin is in the organization's
library marketplace, a version other than the one served is also refused with a 409
when one of its skills has a name that an organization skill (one an administrator
uploaded for the whole organization in claude.ai) has since taken: `error_code`
`skill_name_taken`, with that name in `details.skill_name`. A member-owned Plugin
cannot be updated here (403).

This endpoint does not write installation settings; they are written at
`/v1/organizations/plugins/{plugin_id}/installation_settings/{target}`.

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--served-version-id: string`

  Serve this version of the Plugin (prefixed `pluginver_`) and pin the served version to it; `latest` is not accepted.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin: object`

  - `type: "plugin"`

    Always `plugin`.

  - `id: string`

    The Plugin's ID.

  - `components: array of BetaPluginComponent`

    What the served version contains; null when not enumerated.

    - `type: "agent" or "cli" or "command" or 3 more`

      The kind of component.

      - `"agent"`

      - `"cli"`

      - `"command"`

      - `"hook"`

      - `"mcp_server"`

      - `"skill"`

    - `description: string`

      What the component declares about itself; always null for MCP servers, hooks, and CLIs.

    - `name: string`

      The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

  - `content_scan: object`

    The served version's content scan; null when it has not been scanned.

    - `assessment: "fail" or "pass" or "unknown" or "warn"`

      The scan's verdict; set only when `status` is `completed`.

      - `"fail"`

      - `"pass"`

      - `"unknown"`

      - `"warn"`

    - `reason: string`

      The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

    - `status: "completed" or "errored" or "processing"`

      `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

      - `"completed"`

      - `"errored"`

      - `"processing"`

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

    Who created the Plugin; null when no creator is recorded.

    - `beta_plugin_user_actor: object`

      - `type: "user_actor"`

        A member of the organization.

      - `email_address: string`

        The member's email address; may be null, for example when they are no longer a member of the organization.

      - `user_id: string`

        The member's User ID.

    - `beta_plugin_api_actor: object`

      - `type: "api_actor"`

        An Admin API key, in the same form the Compliance API activity feed uses for it.

      - `api_key_id: string`

        The key's ID.

  - `description: string`

    The served version's description.

  - `display_name: string`

    The served version's display name.

  - `latest_version_id: string`

    The newest version.

  - `manifest_version: string`

    The version string the served version's manifest declares.

  - `marketplace_id: string`

    The ID of the plugin marketplace the Plugin lives in.

  - `name: string`

    Lowercase identifier, unique within its plugin marketplace. Fixed for an organization-owned Plugin's lifetime; a member-owned Plugin's changes when its owner renames it in claude.ai, while its `id` stays the same.

  - `organization_installation_preference: "auto_install" or "available" or "not_available" or "required"`

    Organization-owned Plugin: the organization-wide installation setting every member gets unless an RBAC Group they belong to holds its own — the Plugin's own setting, or its plugin marketplace's default. Null for a member-owned Plugin, which has shares instead. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

    - `"auto_install"`

    - `"available"`

    - `"not_available"`

    - `"required"`

  - `organization_installation_preference_inherited: boolean`

    Organization-owned Plugin: true while it has no organization-wide setting of its own and `organization_installation_preference` is its plugin marketplace's default. Null for a member-owned Plugin.

  - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

    Who owns the Plugin: the organization, or the member whose personal plugin marketplace it lives in.

    - `beta_plugin_owner_organization: object`

      - `type: "organization"`

        The Plugin lives in a plugin marketplace the organization owns.

    - `beta_plugin_owner_user: object`

      - `type: "user"`

        The Plugin lives in one member's personal plugin marketplace.

      - `user_id: string`

        The member's User ID.

  - `reach: "contained" or "privileged" or "remote"`

    How far the served version reaches: `remote` when it declares an MCP server or a CLI, `privileged` when it declares a hook, monitor, language server or settings but nothing remote, `contained` otherwise; null when not classifiable.

    - `"contained"`

    - `"privileged"`

    - `"remote"`

  - `served_version_id: string`

    The version claude.ai serves to members.

  - `served_version_pinned: boolean`

    False while the served version follows each new version; true once it has been pinned to one.

  - `updated_at: string`

    RFC 3339. Moves on a new version and on a served-version change; a change to the Plugin's installation settings or shares does not move it.

    format: date-time

#### Example

```bash
ant beta:organization:plugins update \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id \
  --served-version-id pluginver_01KaZmQpRsTuVwXyZ2b4c6d8
```

##### Response (200)

```json
{
  "id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "components": [
    {
      "description": "description",
      "name": "review-pr",
      "type": "skill"
    }
  ],
  "content_scan": {
    "assessment": "warn",
    "reason": "credential-exposure",
    "status": "completed"
  },
  "created_at": "2026-03-14T09:26:53.589793Z",
  "created_by": {
    "email_address": "user@example.com",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "description": "Reviews pull requests against your team's conventions.",
  "display_name": "Code Review Helper",
  "latest_version_id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
  "manifest_version": "1.2.0",
  "marketplace_id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
  "name": "code-review-helper",
  "organization_installation_preference": "available",
  "organization_installation_preference_inherited": true,
  "owner": {
    "type": "organization"
  },
  "reach": "contained",
  "served_version_id": "pluginver_01K9wPcHd4Rm2Tx8Vq6Ln3Sb",
  "served_version_pinned": true,
  "type": "plugin",
  "updated_at": "2026-03-14T09:26:53.589793Z"
}
```

### List Plugins

`$ ant beta:organization:plugins list`

**GET** `/v1/organizations/plugins`

List the Plugins created under the organization, newest first: those in the
organization's own plugin marketplaces and those in members' personal plugin
marketplaces.

Plugins in members' personal marketplaces are listed with the same detail as the
organization's own, and their files can be downloaded through the version archive
endpoint, which records each such download on the Compliance API activity feed.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--created-at-gt: optional string` (query parameter)

  RFC 3339 timestamp bound; combine [gte], [gt], [lte], [lt].

  format: date-time

- `--created-at-gte: optional string` (query parameter)

  RFC 3339 timestamp bound; combine [gte], [gt], [lte], [lt].

  format: date-time

- `--created-at-lt: optional string` (query parameter)

  RFC 3339 timestamp bound; combine [gte], [gt], [lte], [lt].

  format: date-time

- `--created-at-lte: optional string` (query parameter)

  RFC 3339 timestamp bound; combine [gte], [gt], [lte], [lt].

  format: date-time

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `100`.

  minimum: 1, maximum: 100

- `--marketplace-id: optional string` (query parameter)

  Only Plugins in this plugin marketplace (prefixed `marketplace_`).

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--owner-type: optional "organization" or "user"` (query parameter)

  `organization` for Plugins in the organization's plugin marketplaces, `user` for Plugins in members' personal plugin marketplaces.

- `--owner-user-id: optional string` (query parameter)

  Only Plugins in this member's personal plugin marketplaces (prefixed `user_`); a removed member's ID is accepted.

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `BetaPluginList: object`

  - `data: array of BetaPlugin`

    - `type: "plugin"`

      Always `plugin`.

    - `id: string`

      The Plugin's ID.

    - `components: array of BetaPluginComponent`

      What the served version contains; null when not enumerated.

      - `type: "agent" or "cli" or "command" or 3 more`

        The kind of component.

        - `"agent"`

        - `"cli"`

        - `"command"`

        - `"hook"`

        - `"mcp_server"`

        - `"skill"`

      - `description: string`

        What the component declares about itself; always null for MCP servers, hooks, and CLIs.

      - `name: string`

        The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

    - `content_scan: object`

      The served version's content scan; null when it has not been scanned.

      - `assessment: "fail" or "pass" or "unknown" or "warn"`

        The scan's verdict; set only when `status` is `completed`.

        - `"fail"`

        - `"pass"`

        - `"unknown"`

        - `"warn"`

      - `reason: string`

        The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

      - `status: "completed" or "errored" or "processing"`

        `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

        - `"completed"`

        - `"errored"`

        - `"processing"`

    - `created_at: string`

      RFC 3339.

      format: date-time

    - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

      Who created the Plugin; null when no creator is recorded.

      - `beta_plugin_user_actor: object`

        - `type: "user_actor"`

          A member of the organization.

        - `email_address: string`

          The member's email address; may be null, for example when they are no longer a member of the organization.

        - `user_id: string`

          The member's User ID.

      - `beta_plugin_api_actor: object`

        - `type: "api_actor"`

          An Admin API key, in the same form the Compliance API activity feed uses for it.

        - `api_key_id: string`

          The key's ID.

    - `description: string`

      The served version's description.

    - `display_name: string`

      The served version's display name.

    - `latest_version_id: string`

      The newest version.

    - `manifest_version: string`

      The version string the served version's manifest declares.

    - `marketplace_id: string`

      The ID of the plugin marketplace the Plugin lives in.

    - `name: string`

      Lowercase identifier, unique within its plugin marketplace. Fixed for an organization-owned Plugin's lifetime; a member-owned Plugin's changes when its owner renames it in claude.ai, while its `id` stays the same.

    - `organization_installation_preference: "auto_install" or "available" or "not_available" or "required"`

      Organization-owned Plugin: the organization-wide installation setting every member gets unless an RBAC Group they belong to holds its own — the Plugin's own setting, or its plugin marketplace's default. Null for a member-owned Plugin, which has shares instead. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

      - `"auto_install"`

      - `"available"`

      - `"not_available"`

      - `"required"`

    - `organization_installation_preference_inherited: boolean`

      Organization-owned Plugin: true while it has no organization-wide setting of its own and `organization_installation_preference` is its plugin marketplace's default. Null for a member-owned Plugin.

    - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

      Who owns the Plugin: the organization, or the member whose personal plugin marketplace it lives in.

      - `beta_plugin_owner_organization: object`

        - `type: "organization"`

          The Plugin lives in a plugin marketplace the organization owns.

      - `beta_plugin_owner_user: object`

        - `type: "user"`

          The Plugin lives in one member's personal plugin marketplace.

        - `user_id: string`

          The member's User ID.

    - `reach: "contained" or "privileged" or "remote"`

      How far the served version reaches: `remote` when it declares an MCP server or a CLI, `privileged` when it declares a hook, monitor, language server or settings but nothing remote, `contained` otherwise; null when not classifiable.

      - `"contained"`

      - `"privileged"`

      - `"remote"`

    - `served_version_id: string`

      The version claude.ai serves to members.

    - `served_version_pinned: boolean`

      False while the served version follows each new version; true once it has been pinned to one.

    - `updated_at: string`

      RFC 3339. Moves on a new version and on a served-version change; a change to the Plugin's installation settings or shares does not move it.

      format: date-time

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data. A page may hold fewer than `limit` Plugins, even none, while this is set; keep following it until it is null.

#### Example

```bash
ant beta:organization:plugins list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
      "components": [
        {
          "description": "description",
          "name": "review-pr",
          "type": "skill"
        }
      ],
      "content_scan": {
        "assessment": "warn",
        "reason": "credential-exposure",
        "status": "completed"
      },
      "created_at": "2026-03-14T09:26:53.589793Z",
      "created_by": {
        "email_address": "user@example.com",
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "description": "Reviews pull requests against your team's conventions.",
      "display_name": "Code Review Helper",
      "latest_version_id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
      "manifest_version": "1.2.0",
      "marketplace_id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
      "name": "code-review-helper",
      "organization_installation_preference": "available",
      "organization_installation_preference_inherited": true,
      "owner": {
        "type": "organization"
      },
      "reach": "contained",
      "served_version_id": "pluginver_01K9wPcHd4Rm2Tx8Vq6Ln3Sb",
      "served_version_pinned": true,
      "type": "plugin",
      "updated_at": "2026-03-14T09:26:53.589793Z"
    }
  ],
  "next_page": "page_MjAyNi0wOS0xNlQxNDowNTowOVo"
}
```

### Delete Plugin

`$ ant beta:organization:plugins delete`

**DELETE** `/v1/organizations/plugins/{plugin_id}`

Permanently delete a Plugin and every version it holds, exactly as when an
administrator deletes it in claude.ai. The Plugin may belong to the organization or
to a member, including a member who has since left the organization.

An organization-owned Plugin's installation settings go with it; a member-owned
Plugin's shares are withdrawn and its owner no longer has it.

To take an organization-owned Plugin out of use reversibly, set its
organization-wide installation setting to `not_available` instead (and
remove or change any group settings, which override it for their members). Only a
Plugin in a `manual` marketplace can be deleted here; one synchronized from a
repository is removed by removing it from the repository (400).

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_deleted_plugin: object`

  - `type: "plugin_deleted"`

    Always `plugin_deleted`.

  - `id: string`

    The deleted Plugin's ID.

#### Example

```bash
ant beta:organization:plugins delete \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id
```

##### Response (200)

```json
{
  "id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "type": "plugin_deleted"
}
```

## Organization › Plugins › Versions

### Create Plugin Version

`$ ant beta:organization:plugins:versions create`

**POST** `/v1/organizations/plugins/{plugin_id}/versions`

Add a version to an organization-owned Plugin by uploading the new version's
files; it becomes the version served to members unless the Plugin's served version
has been pinned.

The upload is the same `multipart/form-data` as creating a Plugin: the version's
files (`files`, each part sent as `files[]`) and optional `release_notes`. The uploaded manifest's `name`
must equal the Plugin's `name`. Returns the stored version; read the Plugin back to
see which version it serves.

Only a Plugin in a `manual` marketplace takes uploads; a Plugin synchronized from
a repository gets its versions from the repository. When the Plugin is in the
organization's library marketplace, a version that adds a skill with the name of an
organization skill (a skill an administrator uploaded for the whole organization in
claude.ai) is refused with a 409: `error_code` `skill_name_taken`, with that name in
`details.skill_name`. A 503 with `error_code`
`registration_pending` means the version was stored but is not yet usable; a later
version create on the Plugin completes it.

For a worked example, see [Create a version](https://platform.claude.com/docs/en/manage-claude/plugins-api?sdk_languages=cli#create-a-version)
in the Plugins API guide.

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--file: array of string`

  The version's files: one part per file, the part's filename being the file's path within the Plugin (for example `skills/review-pr/SKILL.md`), or a single `.zip` or `.plugin` archive holding them all. On the wire each part is named `files[]`, and a part named plain `files` is not read; with cURL, `-F 'files[]=@SKILL.md;filename=skills/review-pr/SKILL.md'`. The files must include the manifest, `.claude-plugin/plugin.json`.

- `--release-notes: optional string`

  Release notes stored with the version and shown in its version history in claude.ai; up to 5,000 characters.

  maxLength: 5000

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_version: object`

  - `type: "plugin_version"`

    Always `plugin_version`.

  - `id: string`

    The version's ID.

  - `components: array of BetaPluginComponent`

    What the version contains; null when not enumerated.

    - `type: "agent" or "cli" or "command" or 3 more`

      The kind of component.

      - `"agent"`

      - `"cli"`

      - `"command"`

      - `"hook"`

      - `"mcp_server"`

      - `"skill"`

    - `description: string`

      What the component declares about itself; always null for MCP servers, hooks, and CLIs.

    - `name: string`

      The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

  - `content_scan: object`

    This version's content scan; null when it has not been scanned.

    - `assessment: "fail" or "pass" or "unknown" or "warn"`

      The scan's verdict; set only when `status` is `completed`.

      - `"fail"`

      - `"pass"`

      - `"unknown"`

      - `"warn"`

    - `reason: string`

      The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

    - `status: "completed" or "errored" or "processing"`

      `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

      - `"completed"`

      - `"errored"`

      - `"processing"`

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

    Who uploaded this version; null when not recorded.

    - `beta_plugin_user_actor: object`

      - `type: "user_actor"`

        A member of the organization.

      - `email_address: string`

        The member's email address; may be null, for example when they are no longer a member of the organization.

      - `user_id: string`

        The member's User ID.

    - `beta_plugin_api_actor: object`

      - `type: "api_actor"`

        An Admin API key, in the same form the Compliance API activity feed uses for it.

      - `api_key_id: string`

        The key's ID.

  - `description: string`

    The manifest's description; null when it declares none.

  - `display_name: string`

    The manifest's display name; null when it declares none.

  - `manifest_version: string`

    The version string the manifest declares; null when it declares none.

  - `plugin_id: string`

    The Plugin's ID.

  - `reach: "contained" or "privileged" or "remote"`

    How far the version reaches: `remote`, `privileged` or `contained`, as on the Plugin; null when not classifiable.

    - `"contained"`

    - `"privileged"`

    - `"remote"`

  - `release_notes: string`

    As supplied with the upload; null when none were supplied.

#### Example

```bash
ant beta:organization:plugins:versions create \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id \
  --file 'Example data'
```

##### Response (200)

```json
{
  "id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
  "components": [
    {
      "description": "description",
      "name": "review-pr",
      "type": "skill"
    }
  ],
  "content_scan": {
    "assessment": "warn",
    "reason": "credential-exposure",
    "status": "completed"
  },
  "created_at": "2026-03-14T09:26:53.589793Z",
  "created_by": {
    "email_address": "user@example.com",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "description": "Reviews pull requests against your team's conventions.",
  "display_name": "Code Review Helper",
  "manifest_version": "1.2.0",
  "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "reach": "contained",
  "release_notes": "Adds a review checklist for database migrations.",
  "type": "plugin_version"
}
```

### List Plugin Versions

`$ ant beta:organization:plugins:versions list`

**GET** `/v1/organizations/plugins/{plugin_id}/versions`

List a Plugin's versions, newest first.

The first item of the first page is the version the Plugin's `latest_version_id`
refers to.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `BetaPluginVersionList: object`

  - `data: array of BetaPluginVersion`

    - `type: "plugin_version"`

      Always `plugin_version`.

    - `id: string`

      The version's ID.

    - `components: array of BetaPluginComponent`

      What the version contains; null when not enumerated.

      - `type: "agent" or "cli" or "command" or 3 more`

        The kind of component.

        - `"agent"`

        - `"cli"`

        - `"command"`

        - `"hook"`

        - `"mcp_server"`

        - `"skill"`

      - `description: string`

        What the component declares about itself; always null for MCP servers, hooks, and CLIs.

      - `name: string`

        The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

    - `content_scan: object`

      This version's content scan; null when it has not been scanned.

      - `assessment: "fail" or "pass" or "unknown" or "warn"`

        The scan's verdict; set only when `status` is `completed`.

        - `"fail"`

        - `"pass"`

        - `"unknown"`

        - `"warn"`

      - `reason: string`

        The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

      - `status: "completed" or "errored" or "processing"`

        `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

        - `"completed"`

        - `"errored"`

        - `"processing"`

    - `created_at: string`

      RFC 3339.

      format: date-time

    - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

      Who uploaded this version; null when not recorded.

      - `beta_plugin_user_actor: object`

        - `type: "user_actor"`

          A member of the organization.

        - `email_address: string`

          The member's email address; may be null, for example when they are no longer a member of the organization.

        - `user_id: string`

          The member's User ID.

      - `beta_plugin_api_actor: object`

        - `type: "api_actor"`

          An Admin API key, in the same form the Compliance API activity feed uses for it.

        - `api_key_id: string`

          The key's ID.

    - `description: string`

      The manifest's description; null when it declares none.

    - `display_name: string`

      The manifest's display name; null when it declares none.

    - `manifest_version: string`

      The version string the manifest declares; null when it declares none.

    - `plugin_id: string`

      The Plugin's ID.

    - `reach: "contained" or "privileged" or "remote"`

      How far the version reaches: `remote`, `privileged` or `contained`, as on the Plugin; null when not classifiable.

      - `"contained"`

      - `"privileged"`

      - `"remote"`

    - `release_notes: string`

      As supplied with the upload; null when none were supplied.

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data.

#### Example

```bash
ant beta:organization:plugins:versions list \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
      "components": [
        {
          "description": "description",
          "name": "review-pr",
          "type": "skill"
        }
      ],
      "content_scan": {
        "assessment": "warn",
        "reason": "credential-exposure",
        "status": "completed"
      },
      "created_at": "2026-03-14T09:26:53.589793Z",
      "created_by": {
        "email_address": "user@example.com",
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "description": "Reviews pull requests against your team's conventions.",
      "display_name": "Code Review Helper",
      "manifest_version": "1.2.0",
      "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
      "reach": "contained",
      "release_notes": "Adds a review checklist for database migrations.",
      "type": "plugin_version"
    }
  ],
  "next_page": "page_MjAyNi0wOS0xNlQxNDowNTowOVo"
}
```

### Get Plugin Version

`$ ant beta:organization:plugins:versions retrieve`

**GET** `/v1/organizations/plugins/{plugin_id}/versions/{version}`

Retrieve one version of a Plugin by its ID, or the Plugin's newest version.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--version: string` (path parameter)

  ID of the Plugin Version (prefixed `pluginver_`), or `latest` for the newest one.

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_version: object`

  - `type: "plugin_version"`

    Always `plugin_version`.

  - `id: string`

    The version's ID.

  - `components: array of BetaPluginComponent`

    What the version contains; null when not enumerated.

    - `type: "agent" or "cli" or "command" or 3 more`

      The kind of component.

      - `"agent"`

      - `"cli"`

      - `"command"`

      - `"hook"`

      - `"mcp_server"`

      - `"skill"`

    - `description: string`

      What the component declares about itself; always null for MCP servers, hooks, and CLIs.

    - `name: string`

      The component's name: a skill's, command's or agent's name, an MCP server's key in the manifest, the event a hook runs on, or a CLI's executable.

  - `content_scan: object`

    This version's content scan; null when it has not been scanned.

    - `assessment: "fail" or "pass" or "unknown" or "warn"`

      The scan's verdict; set only when `status` is `completed`.

      - `"fail"`

      - `"pass"`

      - `"unknown"`

      - `"warn"`

    - `reason: string`

      The primary mechanism behind a `warn` or `fail`, such as `credential-exposure` or `guardrail-tampering`; a mechanism this API does not yet name reads as `other`. Null on a `pass`, whenever `assessment` is null, and when no mechanism is reported for the verdict.

    - `status: "completed" or "errored" or "processing"`

      `processing` while a scan runs, `completed` when it ran to completion, `errored` when it could not run or its outcome cannot be read.

      - `"completed"`

      - `"errored"`

      - `"processing"`

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `created_by: BetaPluginUserActor or BetaPluginAPIActor`

    Who uploaded this version; null when not recorded.

    - `beta_plugin_user_actor: object`

      - `type: "user_actor"`

        A member of the organization.

      - `email_address: string`

        The member's email address; may be null, for example when they are no longer a member of the organization.

      - `user_id: string`

        The member's User ID.

    - `beta_plugin_api_actor: object`

      - `type: "api_actor"`

        An Admin API key, in the same form the Compliance API activity feed uses for it.

      - `api_key_id: string`

        The key's ID.

  - `description: string`

    The manifest's description; null when it declares none.

  - `display_name: string`

    The manifest's display name; null when it declares none.

  - `manifest_version: string`

    The version string the manifest declares; null when it declares none.

  - `plugin_id: string`

    The Plugin's ID.

  - `reach: "contained" or "privileged" or "remote"`

    How far the version reaches: `remote`, `privileged` or `contained`, as on the Plugin; null when not classifiable.

    - `"contained"`

    - `"privileged"`

    - `"remote"`

  - `release_notes: string`

    As supplied with the upload; null when none were supplied.

#### Example

```bash
ant beta:organization:plugins:versions retrieve \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id \
  --version version
```

##### Response (200)

```json
{
  "id": "pluginver_01KaZmQpRsTuVwXyZ2b4c6d8",
  "components": [
    {
      "description": "description",
      "name": "review-pr",
      "type": "skill"
    }
  ],
  "content_scan": {
    "assessment": "warn",
    "reason": "credential-exposure",
    "status": "completed"
  },
  "created_at": "2026-03-14T09:26:53.589793Z",
  "created_by": {
    "email_address": "user@example.com",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "description": "Reviews pull requests against your team's conventions.",
  "display_name": "Code Review Helper",
  "manifest_version": "1.2.0",
  "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "reach": "contained",
  "release_notes": "Adds a review checklist for database migrations.",
  "type": "plugin_version"
}
```

### Download Plugin Version Archive

`$ ant beta:organization:plugins:versions download`

**GET** `/v1/organizations/plugins/{plugin_id}/versions/{version}/content`

Download one version's `.zip` archive, exactly as stored. Each download of a
Plugin from a member's personal plugin marketplace is recorded on the Compliance API
activity feed.

The response body is the archive (`Content-Type: application/zip`), sent as an
attachment whose filename is derived from the Plugin's name; name saved files from
the IDs in the request path, since that filename is not unique.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every read scope above (`read:plugins`, `read:org_audit`, and
`read:compliance_org_data`) can download the files of plugins in members' personal
marketplaces, including files that claude.ai's admin settings do not show, and a
`read:org_audit` or `read:compliance_org_data` key created for all of your parent
organization's linked organizations can do this in any organization under it that has
access to this API, by passing `organization_id`. Each such download records a
`claude_plugin_archive_accessed` event on the Compliance API activity feed,
identifying the key, the plugin, the version, and the member. Downloads of
organization-owned plugins are not recorded.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--version: string` (path parameter)

  ID of the Plugin Version (prefixed `pluginver_`). `latest` is not accepted here.

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `unnamed_schema_3: file path`

#### Example

```bash
ant beta:organization:plugins:versions download \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id \
  --version version
```

## Organization › Plugins › Installation Settings

### List Plugin Installation Settings

`$ ant beta:organization:plugins:installation-settings list`

**GET** `/v1/organizations/plugins/{plugin_id}/installation_settings`

List an organization-owned Plugin's installation settings, which say which
members it is for, most recently created first.

The list holds the Plugin's own organization-wide setting (absent while the Plugin
inherits its marketplace's default) and each RBAC Group's own setting. A
member-owned Plugin has shares instead, so this path returns 404 for one.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `100`.

  minimum: 1, maximum: 100

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

  maxLength: 2048

- `--target-type: optional "organization" or "rbac_group"` (query parameter)

  Only settings for this kind of target: `organization` (the organization-wide setting) or `rbac_group` (an RBAC Group's).

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `BetaPluginInstallationSettingList: object`

  - `data: array of BetaPluginInstallationSetting`

    - `type: "plugin_installation_setting"`

      Always `plugin_installation_setting`.

    - `created_at: string`

      When the target was first given a setting for this Plugin.

      format: date-time

    - `installation_preference: "auto_install" or "available" or "not_available" or "required"`

      The setting the target holds for this Plugin. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

      - `"auto_install"`

      - `"available"`

      - `"not_available"`

      - `"required"`

    - `plugin_id: string`

      The Plugin's ID.

    - `target: BetaPluginTargetOrganization or BetaPluginTargetRBACGroup or BetaPluginTargetOrganizationMember`

      Whose setting this is: `organization` (the Plugin's own organization-wide setting) or `rbac_group` (one RBAC Group's own setting); `organization_member` does not occur here.

      - `beta_plugin_target_organization: object`

        - `type: "organization"`

          Every member of the organization.

      - `beta_plugin_target_rbac_group: object`

        - `type: "rbac_group"`

          An RBAC Group.

        - `rbac_group_id: string`

          The RBAC Group's ID.

      - `beta_plugin_target_organization_member: object`

        - `type: "organization_member"`

          One member of the organization.

        - `user_id: string`

          The member's User ID.

    - `updated_at: string`

      When its setting last changed.

      format: date-time

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data.

#### Example

```bash
ant beta:organization:plugins:installation-settings list \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id
```

##### Response (200)

```json
{
  "data": [
    {
      "created_at": "2026-03-14T09:26:53.589793Z",
      "installation_preference": "required",
      "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
      "target": {
        "type": "organization"
      },
      "type": "plugin_installation_setting",
      "updated_at": "2026-03-14T09:26:53.589793Z"
    }
  ],
  "next_page": "page_MjAyNi0wOS0xNlQxNDowNTowOVo"
}
```

### Set Plugin Installation Setting

`$ ant beta:organization:plugins:installation-settings set`

**POST** `/v1/organizations/plugins/{plugin_id}/installation_settings/{target}`

Set or change an organization-owned Plugin's installation setting for the whole
organization or for one RBAC Group.

Writing the value a target already holds of its own changes nothing.

A member-owned Plugin has shares instead of installation settings, so this path
returns 404 for one.

Send a Plugin's installation-setting writes one at a time. If several writes for the
same Plugin arrive at the same time, the server handles them one after another and
can answer some of them with `503` instead of applying them. That `503` carries
`x-should-retry: true`, and the write is safe to repeat: wait a second or two, then
send it again.

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--target: string` (path parameter)

  The target whose setting is written: the literal `organization` for the Plugin's organization-wide setting, or an RBAC Group's ID (prefixed `rbac_group_`) for that group's own setting. Writing the `organization` target stops the Plugin from inheriting its marketplace's default, even when the value written equals that default.

- `--installation-preference: "auto_install" or "available" or "not_available" or "required"`

  The installation setting the target is to hold for this Plugin: one of `required`, `auto_install`, `available`, `not_available`.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_installation_setting: object`

  The installation setting an organization-owned Plugin holds for one
  target. It has no ID of its own: it is addressed by the Plugin's ID and the
  target.

  - `type: "plugin_installation_setting"`

    Always `plugin_installation_setting`.

  - `created_at: string`

    When the target was first given a setting for this Plugin.

    format: date-time

  - `installation_preference: "auto_install" or "available" or "not_available" or "required"`

    The setting the target holds for this Plugin. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

    - `"auto_install"`

    - `"available"`

    - `"not_available"`

    - `"required"`

  - `plugin_id: string`

    The Plugin's ID.

  - `target: BetaPluginTargetOrganization or BetaPluginTargetRBACGroup or BetaPluginTargetOrganizationMember`

    Whose setting this is: `organization` (the Plugin's own organization-wide setting) or `rbac_group` (one RBAC Group's own setting); `organization_member` does not occur here.

    - `beta_plugin_target_organization: object`

      - `type: "organization"`

        Every member of the organization.

    - `beta_plugin_target_rbac_group: object`

      - `type: "rbac_group"`

        An RBAC Group.

      - `rbac_group_id: string`

        The RBAC Group's ID.

    - `beta_plugin_target_organization_member: object`

      - `type: "organization_member"`

        One member of the organization.

      - `user_id: string`

        The member's User ID.

  - `updated_at: string`

    When its setting last changed.

    format: date-time

#### Example

```bash
ant beta:organization:plugins:installation-settings set \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id \
  --target target \
  --installation-preference required
```

##### Response (200)

```json
{
  "created_at": "2026-03-14T09:26:53.589793Z",
  "installation_preference": "required",
  "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "target": {
    "type": "organization"
  },
  "type": "plugin_installation_setting",
  "updated_at": "2026-03-14T09:26:53.589793Z"
}
```

### Remove Plugin Installation Setting

`$ ant beta:organization:plugins:installation-settings remove`

**DELETE** `/v1/organizations/plugins/{plugin_id}/installation_settings/{target}`

Remove an organization-owned Plugin's own installation setting for the whole
organization or for one RBAC Group.

Removing the `organization` target returns the Plugin to its marketplace's default
installation setting and leaves the groups' settings in place. Removing a group's
setting makes the group's members fall back to the Plugin's organization-wide setting
or to the settings of their other groups.

A target that holds no setting of its own returns 404 (a Plugin that already inherits
its marketplace's default holds no `organization` setting), and so does a member-owned
Plugin.

A removal counts as one of the Plugin's installation-setting writes: send all of those
writes one at a time. If several arrive for the same Plugin at the same time, the server
handles them one after another and can answer some of them with `503` and
`x-should-retry: true` instead of applying them; wait a second or two and send the
removal again. A `404` on the repeat means the setting is already gone.

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--target: string` (path parameter)

  The target whose own setting is removed: the literal `organization` for the Plugin's organization-wide setting, or an RBAC Group's ID (prefixed `rbac_group_`) for that group's own setting. Removing the `organization` setting returns the Plugin to its marketplace's default.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_deleted_plugin_installation_setting: object`

  Confirmation that one target's installation setting was removed, naming
  the Plugin and the target in place of an ID.

  - `type: "plugin_installation_setting_deleted"`

    Always `plugin_installation_setting_deleted`.

  - `plugin_id: string`

    The Plugin's ID.

  - `target: BetaPluginTargetOrganization or BetaPluginTargetRBACGroup or BetaPluginTargetOrganizationMember`

    Whose setting was removed.

    - `beta_plugin_target_organization: object`

      - `type: "organization"`

        Every member of the organization.

    - `beta_plugin_target_rbac_group: object`

      - `type: "rbac_group"`

        An RBAC Group.

      - `rbac_group_id: string`

        The RBAC Group's ID.

    - `beta_plugin_target_organization_member: object`

      - `type: "organization_member"`

        One member of the organization.

      - `user_id: string`

        The member's User ID.

#### Example

```bash
ant beta:organization:plugins:installation-settings remove \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id \
  --target target
```

##### Response (200)

```json
{
  "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
  "target": {
    "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
    "type": "rbac_group"
  },
  "type": "plugin_installation_setting_deleted"
}
```

## Organization › Plugins › Shares

### List Plugin Shares

`$ ant beta:organization:plugins:shares list`

**GET** `/v1/organizations/plugins/{plugin_id}/shares`

List the shares the owner of a member-owned Plugin has given — to every member of
the organization, to an RBAC Group, or to one member — most recently granted first.

Shares are read-only in this API: members give and withdraw them in claude.ai, and
who gave a share is recorded on the Compliance API activity feed rather than on the
share. An organization-owned Plugin has installation settings instead, so this path
returns 404 for one.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--plugin-id: string` (path parameter)

  ID of the Plugin (prefixed `plugin_`).

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `100`.

  minimum: 1, maximum: 100

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

  maxLength: 2048

- `--target-type: optional "organization" or "organization_member" or "rbac_group"` (query parameter)

  Only shares with this kind of target: `organization` (every member), `rbac_group` (one RBAC Group), or `organization_member` (one member).

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `BetaPluginShareList: object`

  - `data: array of BetaPluginShare`

    - `type: "plugin_share"`

      Always `plugin_share`.

    - `granted_at: string`

      When the share was given; a share whose role is later changed in claude.ai is re-granted and carries the time of that change.

      format: date-time

    - `plugin_id: string`

      The Plugin's ID.

    - `target: BetaPluginTargetOrganization or BetaPluginTargetRBACGroup or BetaPluginTargetOrganizationMember`

      Who the Plugin is shared with: `organization` (every member), `rbac_group` (one RBAC Group), or `organization_member` (one member).

      - `beta_plugin_target_organization: object`

        - `type: "organization"`

          Every member of the organization.

      - `beta_plugin_target_rbac_group: object`

        - `type: "rbac_group"`

          An RBAC Group.

        - `rbac_group_id: string`

          The RBAC Group's ID.

      - `beta_plugin_target_organization_member: object`

        - `type: "organization_member"`

          One member of the organization.

        - `user_id: string`

          The member's User ID.

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data.

#### Example

```bash
ant beta:organization:plugins:shares list \
  --api-key my-anthropic-api-key \
  --plugin-id plugin_id
```

##### Response (200)

```json
{
  "data": [
    {
      "granted_at": "2026-03-14T09:26:53.589793Z",
      "plugin_id": "plugin_01JyHfbRkZvD1gW7oTqXc3Ne",
      "target": {
        "type": "organization"
      },
      "type": "plugin_share"
    }
  ],
  "next_page": "page_MjAyNi0wOS0xNlQxNDowNTowOVo"
}
```

## Organization › Plugin Marketplaces

### List Plugin Marketplaces

`$ ant beta:organization:plugin-marketplaces list`

**GET** `/v1/organizations/plugin_marketplaces`

List the plugin marketplaces Plugins live in, newest first: the organization's own
and its members' personal ones.

Plugin marketplaces are created, connected to a repository and deleted in
claude.ai, not through this API. The organization's library marketplace, the
organization-owned `manual` marketplace that uploads go to when no marketplace is
named, is created the first time something is put in it and is listed from then on.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--owner-type: optional "organization" or "user"` (query parameter)

  `organization` for the organization's plugin marketplaces, `user` for members' personal plugin marketplaces.

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

  maxLength: 2048

- `--source: optional "directory" or "github" or "gitlab" or 2 more` (query parameter)

  Only plugin marketplaces with this `source`: `manual` for those whose Plugins are uploaded; `github`, `gitlab` or `public_git` for those synchronized from a Git repository. `directory` (Anthropic's catalog) is never listed here.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `BetaPluginMarketplaceList: object`

  - `data: array of BetaPluginMarketplace`

    - `type: "plugin_marketplace"`

      Always `plugin_marketplace`.

    - `id: string`

      The plugin marketplace's ID, prefixed `marketplace_`.

    - `created_at: string`

      RFC 3339.

      format: date-time

    - `default_installation_preference: "auto_install" or "available" or "not_available" or "required"`

      Organization plugin marketplace: the organization-wide setting every Plugin in it with no setting of its own gets. Null for a member's personal plugin marketplace. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

      - `"auto_install"`

      - `"available"`

      - `"not_available"`

      - `"required"`

    - `last_sync_ended_at: string`

      RFC 3339. When the most recent synchronization attempt to finish did so, whatever its outcome; for a repository plugin marketplace no synchronization has run on yet, when it was created. Null for a plugin marketplace that is not synchronized from a repository.

      format: date-time

    - `last_sync_read_sha: string`

      The commit the last synchronization attempt that reached the repository read, whether or not its content was then accepted (see `sync_status`); an attempt that ends `failed_auth` or `failed_transient` leaves it unchanged. Null until an attempt has first read the repository, and for a plugin marketplace that is not synchronized from a repository.

    - `name: string`

      Fixed for the plugin marketplace's lifetime.

    - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

      The organization, or the member whose personal plugin marketplace it is.

      - `beta_plugin_owner_organization: object`

        - `type: "organization"`

          The Plugin lives in a plugin marketplace the organization owns.

      - `beta_plugin_owner_user: object`

        - `type: "user"`

          The Plugin lives in one member's personal plugin marketplace.

        - `user_id: string`

          The member's User ID.

    - `source: "directory" or "github" or "gitlab" or 2 more`

      Where the plugin marketplace's Plugins come from: `manual` when they are uploaded; `github`, `gitlab` or `public_git` when they are synchronized from the Git repository the owner connected, into which nothing can be uploaded; `directory` is Anthropic's own catalog, which this API does not list. A value this API does not yet name is returned as stored.

      - `"directory"`

      - `"github"`

      - `"gitlab"`

      - `"manual"`

      - `"public_git"`

    - `sync_status: "failed_auth" or "failed_content" or "failed_limits" or 3 more`

      Outcome of the plugin marketplace's most recent synchronization: one of `success`, `in_progress`, `failed_content`, `failed_transient`, `failed_auth`, `failed_limits`; a value this API does not yet name is returned as stored. Null until a synchronization is first attempted — so always for a `manual` plugin marketplace.

      - `"failed_auth"`

      - `"failed_content"`

      - `"failed_limits"`

      - `"failed_transient"`

      - `"in_progress"`

      - `"success"`

  - `next_page: string`

    Token to provide in as `page` in the subsequent request to retrieve the next page of data.

#### Example

```bash
ant beta:organization:plugin-marketplaces list \
  --api-key my-anthropic-api-key
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
      "created_at": "2026-03-14T09:26:53.589793Z",
      "default_installation_preference": "available",
      "last_sync_ended_at": "2026-03-14T09:26:53.589793Z",
      "last_sync_read_sha": "9fceb02d0ae598e95dc970b74767f19372d61af8",
      "name": "engineering-tools",
      "owner": {
        "type": "organization"
      },
      "source": "github",
      "sync_status": "success",
      "type": "plugin_marketplace"
    }
  ],
  "next_page": "page_MjAyNi0wOS0xNlQxNDowNTowOVo"
}
```

### Get Plugin Marketplace

`$ ant beta:organization:plugin-marketplaces retrieve`

**GET** `/v1/organizations/plugin_marketplaces/{marketplace_id}`

Retrieve a plugin marketplace by ID.

**Accepted credentials:** an Admin API key with the `read:plugins` or `read:org_audit` scope, or a Compliance Access Key with the `read:compliance_org_data` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--marketplace-id: string` (path parameter)

  ID of the plugin marketplace (prefixed `marketplace_`).

- `--organization-id: optional string` (query parameter)

  For a `read:org_audit` or `read:compliance_org_data` key created for all of a parent organization's linked organizations: a child organization of that parent to read instead of the organization the key was created in, given as the organization's UUID or its `org_`-prefixed ID. A value that is neither returns a 400; an organization that is not a child of the key's parent, or where the Plugins API is not available, returns a 404. Any other key may pass only its own organization's ID here; another organization returns a 404.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_marketplace: object`

  - `type: "plugin_marketplace"`

    Always `plugin_marketplace`.

  - `id: string`

    The plugin marketplace's ID, prefixed `marketplace_`.

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `default_installation_preference: "auto_install" or "available" or "not_available" or "required"`

    Organization plugin marketplace: the organization-wide setting every Plugin in it with no setting of its own gets. Null for a member's personal plugin marketplace. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

    - `"auto_install"`

    - `"available"`

    - `"not_available"`

    - `"required"`

  - `last_sync_ended_at: string`

    RFC 3339. When the most recent synchronization attempt to finish did so, whatever its outcome; for a repository plugin marketplace no synchronization has run on yet, when it was created. Null for a plugin marketplace that is not synchronized from a repository.

    format: date-time

  - `last_sync_read_sha: string`

    The commit the last synchronization attempt that reached the repository read, whether or not its content was then accepted (see `sync_status`); an attempt that ends `failed_auth` or `failed_transient` leaves it unchanged. Null until an attempt has first read the repository, and for a plugin marketplace that is not synchronized from a repository.

  - `name: string`

    Fixed for the plugin marketplace's lifetime.

  - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

    The organization, or the member whose personal plugin marketplace it is.

    - `beta_plugin_owner_organization: object`

      - `type: "organization"`

        The Plugin lives in a plugin marketplace the organization owns.

    - `beta_plugin_owner_user: object`

      - `type: "user"`

        The Plugin lives in one member's personal plugin marketplace.

      - `user_id: string`

        The member's User ID.

  - `source: "directory" or "github" or "gitlab" or 2 more`

    Where the plugin marketplace's Plugins come from: `manual` when they are uploaded; `github`, `gitlab` or `public_git` when they are synchronized from the Git repository the owner connected, into which nothing can be uploaded; `directory` is Anthropic's own catalog, which this API does not list. A value this API does not yet name is returned as stored.

    - `"directory"`

    - `"github"`

    - `"gitlab"`

    - `"manual"`

    - `"public_git"`

  - `sync_status: "failed_auth" or "failed_content" or "failed_limits" or 3 more`

    Outcome of the plugin marketplace's most recent synchronization: one of `success`, `in_progress`, `failed_content`, `failed_transient`, `failed_auth`, `failed_limits`; a value this API does not yet name is returned as stored. Null until a synchronization is first attempted — so always for a `manual` plugin marketplace.

    - `"failed_auth"`

    - `"failed_content"`

    - `"failed_limits"`

    - `"failed_transient"`

    - `"in_progress"`

    - `"success"`

#### Example

```bash
ant beta:organization:plugin-marketplaces retrieve \
  --api-key my-anthropic-api-key \
  --marketplace-id marketplace_id
```

##### Response (200)

```json
{
  "id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
  "created_at": "2026-03-14T09:26:53.589793Z",
  "default_installation_preference": "available",
  "last_sync_ended_at": "2026-03-14T09:26:53.589793Z",
  "last_sync_read_sha": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "name": "engineering-tools",
  "owner": {
    "type": "organization"
  },
  "source": "github",
  "sync_status": "success",
  "type": "plugin_marketplace"
}
```

### Update Plugin Marketplace

`$ ant beta:organization:plugin-marketplaces update`

**POST** `/v1/organizations/plugin_marketplaces/{marketplace_id}`

Set the default installation setting of one of the organization's own plugin
marketplaces. Every Plugin in it without a setting of its own gets this default as
its organization-wide setting, including Plugins added later.

Pass it as `default_installation_preference`. A member's personal marketplace
cannot be updated here (403).

**Accepted credentials:** an Admin API key with the `write:plugins` scope.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--marketplace-id: string` (path parameter)

  ID of the plugin marketplace (prefixed `marketplace_`).

- `--default-installation-preference: "auto_install" or "available" or "not_available" or "required"`

  The organization-wide installation setting every Plugin in the marketplace without one of its own gets: one of `required`, `auto_install`, `available`, `not_available`. Once set it can be changed but not removed.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_marketplace: object`

  - `type: "plugin_marketplace"`

    Always `plugin_marketplace`.

  - `id: string`

    The plugin marketplace's ID, prefixed `marketplace_`.

  - `created_at: string`

    RFC 3339.

    format: date-time

  - `default_installation_preference: "auto_install" or "available" or "not_available" or "required"`

    Organization plugin marketplace: the organization-wide setting every Plugin in it with no setting of its own gets. Null for a member's personal plugin marketplace. One of `required`, `auto_install`, `available`, `not_available`; a value this API does not yet name is returned as stored.

    - `"auto_install"`

    - `"available"`

    - `"not_available"`

    - `"required"`

  - `last_sync_ended_at: string`

    RFC 3339. When the most recent synchronization attempt to finish did so, whatever its outcome; for a repository plugin marketplace no synchronization has run on yet, when it was created. Null for a plugin marketplace that is not synchronized from a repository.

    format: date-time

  - `last_sync_read_sha: string`

    The commit the last synchronization attempt that reached the repository read, whether or not its content was then accepted (see `sync_status`); an attempt that ends `failed_auth` or `failed_transient` leaves it unchanged. Null until an attempt has first read the repository, and for a plugin marketplace that is not synchronized from a repository.

  - `name: string`

    Fixed for the plugin marketplace's lifetime.

  - `owner: BetaPluginOwnerOrganization or BetaPluginOwnerUser`

    The organization, or the member whose personal plugin marketplace it is.

    - `beta_plugin_owner_organization: object`

      - `type: "organization"`

        The Plugin lives in a plugin marketplace the organization owns.

    - `beta_plugin_owner_user: object`

      - `type: "user"`

        The Plugin lives in one member's personal plugin marketplace.

      - `user_id: string`

        The member's User ID.

  - `source: "directory" or "github" or "gitlab" or 2 more`

    Where the plugin marketplace's Plugins come from: `manual` when they are uploaded; `github`, `gitlab` or `public_git` when they are synchronized from the Git repository the owner connected, into which nothing can be uploaded; `directory` is Anthropic's own catalog, which this API does not list. A value this API does not yet name is returned as stored.

    - `"directory"`

    - `"github"`

    - `"gitlab"`

    - `"manual"`

    - `"public_git"`

  - `sync_status: "failed_auth" or "failed_content" or "failed_limits" or 3 more`

    Outcome of the plugin marketplace's most recent synchronization: one of `success`, `in_progress`, `failed_content`, `failed_transient`, `failed_auth`, `failed_limits`; a value this API does not yet name is returned as stored. Null until a synchronization is first attempted — so always for a `manual` plugin marketplace.

    - `"failed_auth"`

    - `"failed_content"`

    - `"failed_limits"`

    - `"failed_transient"`

    - `"in_progress"`

    - `"success"`

#### Example

```bash
ant beta:organization:plugin-marketplaces update \
  --api-key my-anthropic-api-key \
  --marketplace-id marketplace_id \
  --default-installation-preference available
```

##### Response (200)

```json
{
  "id": "marketplace_01HxQ3v9KpZ2mTn8RwLc4Ys7",
  "created_at": "2026-03-14T09:26:53.589793Z",
  "default_installation_preference": "available",
  "last_sync_ended_at": "2026-03-14T09:26:53.589793Z",
  "last_sync_read_sha": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "name": "engineering-tools",
  "owner": {
    "type": "organization"
  },
  "source": "github",
  "sync_status": "success",
  "type": "plugin_marketplace"
}
```

### Validate Plugin Marketplace Repository

`$ ant beta:organization:plugin-marketplaces validate-repository`

**POST** `/v1/organizations/plugin_marketplaces/validate_repository`

Check whether a plugin marketplace held in a public GitHub repository would
synchronize into claude.ai, without connecting or storing it.

To check a `.zip` of the marketplace directory instead, use Validate Plugin Marketplace Archive.

The report says whether `marketplace.json` is well-formed, which plugins a
synchronization would skip and why, and which plugins would synchronize only in
part, with some files left out. A repository that is missing, private, or has no such branch or commit is reported, not refused: the response is a report with `valid: false`. Plugin sources outside the marketplace
are fetched anonymously from GitHub, so a private one is reported as not found; a
source on any other host is not fetched here, and the report notes that it will be
checked when the marketplace actually synchronizes.

Nothing is recorded on the Compliance API activity feed.

For a worked example, see [Validate marketplace content](https://platform.claude.com/docs/en/manage-claude/plugins-api?sdk_languages=cli#validate-marketplace-content)
in the Plugins API guide.

**Accepted credentials:** an Admin API key with the `read:plugins` or `write:plugins` scope; `read:org_audit` and `read:compliance_org_data` do not grant it.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--repository-url: string`

  The `https://` URL of a public repository on github.com that holds the marketplace. Any other host, a URL with credentials in it, or one that does not name a repository is a 400.

  minLength: 1

- `--ref: optional string`

  The branch to validate the tip of, or the full 40-character SHA of the commit to validate. When omitted, the branch a synchronization would read (usually the repository's default branch); if that is not the default branch, the report's `ref` says which branch was read. An empty string, or a value that is neither a branch name nor a 40-character SHA, is a 400.

  minLength: 1

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_marketplace_validation_report: object`

  The outcome of validating plugin marketplace content: a report, not a
  stored object, so nothing in it can be retrieved afterwards.

  - `type: "plugin_marketplace_validation_report"`

    Always `plugin_marketplace_validation_report`.

  - `commit_sha: string`

    The full SHA of the commit that was validated: for a repository, the commit that was read; for an uploaded archive, the commit recorded in the archive's comment (as a Git host's download writes it; not verified), else null.

  - `manifest_error: string`

    Set when nothing could be validated: the repository or archive could not be read, or marketplace.json is missing, malformed or over a limit. Null otherwise.

  - `manifest_error_code: string`

    A stable identifier for `manifest_error`; null when that is.

  - `plugin_errors: array of BetaPluginMarketplaceValidationPluginError`

    One entry per plugin a synchronization would skip entirely, keyed by the plugin's name in marketplace.json.

    - `error: string`

      Why the plugin would be skipped by a synchronization.

    - `error_code: string`

      A stable identifier for the reason — the value to branch on.

    - `name: string`

      The plugin's name, as its entry in marketplace.json declares it.

  - `plugin_warnings: array of BetaPluginMarketplaceValidationPluginWarnings`

    One entry per plugin that would synchronize with some of its contents left out, keyed by the plugin's name in marketplace.json.

    - `name: string`

      The plugin's name, as its entry in marketplace.json declares it.

    - `warnings: array of BetaPluginMarketplaceValidationPluginWarning`

      The parts of the plugin a synchronization would leave out.

      - `error_code: string`

        A stable identifier for the kind of warning.

      - `message: string`

        What would be left out, and why.

  - `ref: string`

    For a repository, the branch that was read by name: the one requested, or else the branch a synchronization of this repository is set to read. Null when no branch is named or set and the repository's default branch was read, for a request by commit SHA, and for an uploaded archive.

  - `total_plugin_count: number`

    How many plugins marketplace.json declares; 0 when it could not be read.

  - `valid: boolean`

    True when marketplace.json is well-formed and no plugin would be skipped; warnings never make it false.

#### Example

```bash
ant beta:organization:plugin-marketplaces validate-repository \
  --api-key my-anthropic-api-key \
  --repository-url https://github.com/example-org/example-marketplace
```

##### Response (200)

```json
{
  "commit_sha": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "manifest_error": "manifest_error",
  "manifest_error_code": "marketplace_sync_manifest_not_found",
  "plugin_errors": [
    {
      "error": "error",
      "error_code": "marketplace_sync_plugin_missing_manifest",
      "name": "name"
    }
  ],
  "plugin_warnings": [
    {
      "name": "name",
      "warnings": [
        {
          "error_code": "marketplace_sync_zipball_symlink_dangling",
          "message": "message"
        }
      ]
    }
  ],
  "ref": "main",
  "total_plugin_count": 0,
  "type": "plugin_marketplace_validation_report",
  "valid": false
}
```

### Validate Plugin Marketplace Archive

`$ ant beta:organization:plugin-marketplaces validate-archive`

**POST** `/v1/organizations/plugin_marketplaces/validate_archive`

Check whether a plugin marketplace, uploaded as a `.zip` of the marketplace
directory, would synchronize into claude.ai, without connecting or storing it.

To check a public GitHub repository instead, use Validate Plugin Marketplace Repository.

The report says whether `marketplace.json` is well-formed, which plugins a
synchronization would skip and why, and which plugins would synchronize only in
part, with some files left out. An archive that cannot be read as a marketplace is reported, not refused: the response is a report with `valid: false`. Plugin sources outside the marketplace
are fetched anonymously from GitHub, so a private one is reported as not found; a
source on any other host is not fetched here, and the report notes that it will be
checked when the marketplace actually synchronizes.

Nothing is recorded on the Compliance API activity feed.

For a worked example, see [Validate marketplace content](https://platform.claude.com/docs/en/manage-claude/plugins-api?sdk_languages=cli#validate-marketplace-content)
in the Plugins API guide.

**Accepted credentials:** an Admin API key with the `read:plugins` or `write:plugins` scope; `read:org_audit` and `read:compliance_org_data` do not grant it.

Every request must include the beta header `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`, exactly as if the endpoint did not exist. The Plugins API is in beta and is available to Claude Enterprise organizations only. It is not available to Claude Platform (Claude Console) organizations, or to organizations with HIPAA readiness enabled.

#### Parameters

- `--archive: string`

  A .zip of the marketplace directory (its contents at the root, or wrapped in one folder as a Git host's download produces), sent as a file part with a filename; DEFLATE- or STORE-compressed, at most 32 MB. A part sent without a filename, a second archive part, or any other form field is a 400; a larger archive is a 413.

  format: binary

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `ce-plugins-2026-09-01` in this header.

#### Returns

- `beta_plugin_marketplace_validation_report: object`

  The outcome of validating plugin marketplace content: a report, not a
  stored object, so nothing in it can be retrieved afterwards.

  - `type: "plugin_marketplace_validation_report"`

    Always `plugin_marketplace_validation_report`.

  - `commit_sha: string`

    The full SHA of the commit that was validated: for a repository, the commit that was read; for an uploaded archive, the commit recorded in the archive's comment (as a Git host's download writes it; not verified), else null.

  - `manifest_error: string`

    Set when nothing could be validated: the repository or archive could not be read, or marketplace.json is missing, malformed or over a limit. Null otherwise.

  - `manifest_error_code: string`

    A stable identifier for `manifest_error`; null when that is.

  - `plugin_errors: array of BetaPluginMarketplaceValidationPluginError`

    One entry per plugin a synchronization would skip entirely, keyed by the plugin's name in marketplace.json.

    - `error: string`

      Why the plugin would be skipped by a synchronization.

    - `error_code: string`

      A stable identifier for the reason — the value to branch on.

    - `name: string`

      The plugin's name, as its entry in marketplace.json declares it.

  - `plugin_warnings: array of BetaPluginMarketplaceValidationPluginWarnings`

    One entry per plugin that would synchronize with some of its contents left out, keyed by the plugin's name in marketplace.json.

    - `name: string`

      The plugin's name, as its entry in marketplace.json declares it.

    - `warnings: array of BetaPluginMarketplaceValidationPluginWarning`

      The parts of the plugin a synchronization would leave out.

      - `error_code: string`

        A stable identifier for the kind of warning.

      - `message: string`

        What would be left out, and why.

  - `ref: string`

    For a repository, the branch that was read by name: the one requested, or else the branch a synchronization of this repository is set to read. Null when no branch is named or set and the repository's default branch was read, for a request by commit SHA, and for an uploaded archive.

  - `total_plugin_count: number`

    How many plugins marketplace.json declares; 0 when it could not be read.

  - `valid: boolean`

    True when marketplace.json is well-formed and no plugin would be skipped; warnings never make it false.

#### Example

```bash
ant beta:organization:plugin-marketplaces validate-archive \
  --api-key my-anthropic-api-key \
  --archive 'Example data'
```

##### Response (200)

```json
{
  "commit_sha": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "manifest_error": "manifest_error",
  "manifest_error_code": "marketplace_sync_manifest_not_found",
  "plugin_errors": [
    {
      "error": "error",
      "error_code": "marketplace_sync_plugin_missing_manifest",
      "name": "name"
    }
  ],
  "plugin_warnings": [
    {
      "name": "name",
      "warnings": [
        {
          "error_code": "marketplace_sync_zipball_symlink_dangling",
          "message": "message"
        }
      ]
    }
  ],
  "ref": "main",
  "total_plugin_count": 0,
  "type": "plugin_marketplace_validation_report",
  "valid": false
}
```
