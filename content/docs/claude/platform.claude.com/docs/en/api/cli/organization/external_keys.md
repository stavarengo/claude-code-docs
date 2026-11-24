---
title: External Keys
url: https://platform.claude.com/docs/en/api/cli/organization/external_keys
---

# External Keys

## Create External Key

`$ ant organization:external-keys create`

**POST** `/v1/organizations/external_keys`

Create an external key config owned by the caller's organization.

### Parameters

- `--provider-config: AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfigParam`

  KMS provider identity and auth coordinates.

  - `aws_external_key_config: object`

    - `type: "aws"`

    - `kms_arn: string`

      Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

      maxLength: 2048

    - `region: optional string`

      AWS region. Derived from `kms_arn` if omitted.

  - `gcp_external_key_config: object`

    - `type: "gcp"`

    - `key_name: string`

      Full resource name of the Cloud KMS key.

  - `azure_external_key_config_param: object`

    Azure Key Vault provider configuration.

    - `type: "azure"`

    - `key_name: string`

      Name of the key within the vault.

    - `tenant_id: string`

      Azure AD tenant ID.

    - `vault_uri: string`

      Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

    - `client_id: optional string`

      Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

- `--display-name: optional string`

  Human-friendly display name.

  minLength: 1, maxLength: 255

- `--geo: optional "us"`

  Data residency geo. Only `us` is supported.

- `--user-profile-id: optional string`

  ID of a user profile to bind the key to. A user profile represents one of your customers: bind a customer's key to that customer's user profile. A key bound to a user profile can only be attached to a Workspace that has the same user profile, and the binding cannot be changed later. Omit this field only for your organization's own key, never a customer's. A key created without a user profile ID can't be attached to a Workspace that has a user profile, and you can't add one to the key later.

### Returns

- `external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config: a tagged ID prefixed `ekey_`, or, on Claude Platform on AWS, an AWS KMS key's ARN.

  - `attachment: ExternalKeyAttachedAttachment or ExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `external_key_attached_attachment: object`

      - `type: "attached"`

    - `external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects the region this key is used in.

  - `provider_config: AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

    - `gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `azure_external_key_config: object`

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

  - `user_profile_id: string`

    ID of the user profile the key is bound to, or null if the key is not bound to one. A key bound to a user profile can only be attached to a Workspace that has the same user profile. A key that isn't bound can only be attached to a Workspace that has no user profile.

### Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `user_profile_not_found` (HTTP status 400)

  The request depends on a user profile that does not exist in the organization or is no longer active. The request either names this user profile by ID, or names a resource, such as an External Key, that is bound to it.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

### Example

```bash
ant organization:external-keys create \
  --provider-config '{kms_arn: arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222, type: aws}'
```

#### Response (200)

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
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "user_profile_id": "uprof_01SDCCSbTxrXDpWc1phhtcfK"
}
```

## List External Keys

`$ ant organization:external-keys list`

**GET** `/v1/organizations/external_keys`

List external key configs in the caller's organization.

Results are ordered by creation time (newest first). Use the
`next_page` cursor from the response to fetch subsequent pages.

### Parameters

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

### Returns

- `ExternalKeyListResponse: object`

  Opaque-cursor page of external keys, ordered by creation time (newest first).

  - `data: array of ExternalKey`

    - `type: "external_key"`

    - `id: string`

      Identifier of the external key config: a tagged ID prefixed `ekey_`, or, on Claude Platform on AWS, an AWS KMS key's ARN.

    - `attachment: ExternalKeyAttachedAttachment or ExternalKeyUnattachedAttachment`

      Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

      - `external_key_attached_attachment: object`

        - `type: "attached"`

      - `external_key_unattached_attachment: object`

        - `type: "unattached"`

    - `created_at: string`

      format: date-time

    - `display_name: string`

      Human-friendly display name. Null if none was set.

    - `geo: string`

      Data residency geo. Selects the region this key is used in.

    - `provider_config: AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfig`

      KMS provider identity and auth coordinates.

      - `aws_external_key_config: object`

        - `type: "aws"`

        - `kms_arn: string`

          Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

          maxLength: 2048

        - `region: optional string`

          AWS region. Derived from `kms_arn` if omitted.

      - `gcp_external_key_config: object`

        - `type: "gcp"`

        - `key_name: string`

          Full resource name of the Cloud KMS key.

      - `azure_external_key_config: object`

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

    - `user_profile_id: string`

      ID of the user profile the key is bound to, or null if the key is not bound to one. A key bound to a user profile can only be attached to a Workspace that has the same user profile. A key that isn't bound can only be attached to a Workspace that has no user profile.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results. Pass as `?page=` to fetch the next page.

### Example

```bash
ant organization:external-keys list
```

#### Response (200)

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
      "updated_at": "2024-10-30T23:58:27.427722Z",
      "user_profile_id": "uprof_01SDCCSbTxrXDpWc1phhtcfK"
    }
  ],
  "next_page": "next_page"
}
```

## Get External Key

`$ ant organization:external-keys retrieve`

**GET** `/v1/organizations/external_keys/{external_key_id}`

Retrieve a single external key config in the caller's organization by ID.

### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

### Returns

- `external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config: a tagged ID prefixed `ekey_`, or, on Claude Platform on AWS, an AWS KMS key's ARN.

  - `attachment: ExternalKeyAttachedAttachment or ExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `external_key_attached_attachment: object`

      - `type: "attached"`

    - `external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects the region this key is used in.

  - `provider_config: AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

    - `gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `azure_external_key_config: object`

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

  - `user_profile_id: string`

    ID of the user profile the key is bound to, or null if the key is not bound to one. A key bound to a user profile can only be attached to a Workspace that has the same user profile. A key that isn't bound can only be attached to a Workspace that has no user profile.

### Example

```bash
ant organization:external-keys retrieve \
  --external-key-id external_key_id
```

#### Response (200)

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
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "user_profile_id": "uprof_01SDCCSbTxrXDpWc1phhtcfK"
}
```

## Update External Key

`$ ant organization:external-keys update`

**POST** `/v1/organizations/external_keys/{external_key_id}`

Partially update an external key config. Omitted fields are left unchanged.

`display_name` is always editable. `geo` and `provider_config` cannot
be changed once any workspace references this config, and a Google Cloud
key's provider and `key_name` cannot be changed at all.

### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

- `--display-name: optional string`

  Human-friendly display name.

  minLength: 1, maxLength: 255

- `--geo: optional "us"`

  Data residency geo. Only `us` is supported.

- `--provider-config: optional AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfigParam`

  KMS provider identity and auth coordinates.

  - `aws_external_key_config: object`

    - `type: "aws"`

    - `kms_arn: string`

      Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

      maxLength: 2048

    - `region: optional string`

      AWS region. Derived from `kms_arn` if omitted.

  - `gcp_external_key_config: object`

    - `type: "gcp"`

    - `key_name: string`

      Full resource name of the Cloud KMS key.

  - `azure_external_key_config_param: object`

    Azure Key Vault provider configuration.

    - `type: "azure"`

    - `key_name: string`

      Name of the key within the vault.

    - `tenant_id: string`

      Azure AD tenant ID.

    - `vault_uri: string`

      Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

    - `client_id: optional string`

      Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

### Returns

- `external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config: a tagged ID prefixed `ekey_`, or, on Claude Platform on AWS, an AWS KMS key's ARN.

  - `attachment: ExternalKeyAttachedAttachment or ExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `external_key_attached_attachment: object`

      - `type: "attached"`

    - `external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects the region this key is used in.

  - `provider_config: AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

    - `gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `azure_external_key_config: object`

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

  - `user_profile_id: string`

    ID of the user profile the key is bound to, or null if the key is not bound to one. A key bound to a user profile can only be attached to a Workspace that has the same user profile. A key that isn't bound can only be attached to a Workspace that has no user profile.

### Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `external_key_in_workspace_policy` (HTTP status 400)

  The External Key can't be deleted or reconfigured while the organization's Workspace Policy lists it as an allowed key.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

### Example

```bash
ant organization:external-keys update \
  --external-key-id external_key_id
```

#### Response (200)

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
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "user_profile_id": "uprof_01SDCCSbTxrXDpWc1phhtcfK"
}
```

## Delete External Key

`$ ant organization:external-keys delete`

**DELETE** `/v1/organizations/external_keys/{external_key_id}`

Delete an external key config.

The request is rejected if any workspace still references this config.

### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

### Returns

- `OrganizationExternalKeyDeleteResponse: object`

  - `type: "external_key_deleted"`

  - `id: string`

    ID of the deleted External Key.

### Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `external_key_in_workspace_policy` (HTTP status 400)

  The External Key can't be deleted or reconfigured while the organization's Workspace Policy lists it as an allowed key.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

### Example

```bash
ant organization:external-keys delete \
  --external-key-id external_key_id
```

#### Response (200)

```json
{
  "id": "ekey_01AbCdEfGhIjKlMnOpQrStUv",
  "type": "external_key_deleted"
}
```

## Validate External Key

`$ ant organization:external-keys validate`

**POST** `/v1/organizations/external_keys/{external_key_id}/validate`

Validate an external key config against the customer's KMS.

Anthropic performs an encrypt/decrypt roundtrip against the configured
KMS key and waits up to 30 seconds for the result. The response status is
`success` if the roundtrip succeeded, or `failure` with an error
message if it failed or timed out.

### Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

### Returns

- `OrganizationExternalKeyValidateResponse: object`

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

### Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

### Example

```bash
ant organization:external-keys validate \
  --external-key-id external_key_id
```

#### Response (200)

```json
{
  "error": "error",
  "status": "failure",
  "type": "external_key_validation"
}
```

## Domain types

### AWS External Key Config

- `aws_external_key_config: object`

  - `type: "aws"`

  - `kms_arn: string`

    Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

    maxLength: 2048

  - `region: optional string`

    AWS region. Derived from `kms_arn` if omitted.

### Azure External Key Config

- `azure_external_key_config: object`

  - `type: "azure"`

  - `key_name: string`

    Name of the key within the vault.

  - `tenant_id: string`

    Azure AD tenant ID.

  - `vault_uri: string`

    Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

  - `client_id: optional string`

    Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

### Azure External Key Config Param

- `azure_external_key_config_param: object`

  Azure Key Vault provider configuration.

  - `type: "azure"`

  - `key_name: string`

    Name of the key within the vault.

  - `tenant_id: string`

    Azure AD tenant ID.

  - `vault_uri: string`

    Key Vault data-plane URI — `https://{vault-name}.vault.azure.net` or `https://{hsm-name}.managedhsm.azure.net`.

  - `client_id: optional string`

    Azure AD application (client) ID. Omit to use Anthropic's multitenant app. Provide only if using a single-tenant app registration in the customer's directory.

### External Key

- `external_key: object`

  CMEK external key config belonging to the caller's organization.

  Configs are organization-scoped. Workspaces attach to a config; once any
  workspace references it, the provider fields become effectively immutable
  (existing encrypted data needs the config for decrypt).

  - `type: "external_key"`

  - `id: string`

    Identifier of the external key config: a tagged ID prefixed `ekey_`, or, on Claude Platform on AWS, an AWS KMS key's ARN.

  - `attachment: ExternalKeyAttachedAttachment or ExternalKeyUnattachedAttachment`

    Whether any workspace uses this config to encrypt its data — counting live and archived workspaces (an archived workspace's data remains encrypted under the config), excluding deleted ones. Only an attached config is used by the encryption path; an `unattached` config is inert and can be deleted.

    - `external_key_attached_attachment: object`

      - `type: "attached"`

    - `external_key_unattached_attachment: object`

      - `type: "unattached"`

  - `created_at: string`

    format: date-time

  - `display_name: string`

    Human-friendly display name. Null if none was set.

  - `geo: string`

    Data residency geo. Selects the region this key is used in.

  - `provider_config: AWSExternalKeyConfig or GCPExternalKeyConfig or AzureExternalKeyConfig`

    KMS provider identity and auth coordinates.

    - `aws_external_key_config: object`

      - `type: "aws"`

      - `kms_arn: string`

        Full ARN of the AWS KMS key. On Claude Platform on AWS, alias ARNs are rejected, and your organization's own key must be a single-Region key.

        maxLength: 2048

      - `region: optional string`

        AWS region. Derived from `kms_arn` if omitted.

    - `gcp_external_key_config: object`

      - `type: "gcp"`

      - `key_name: string`

        Full resource name of the Cloud KMS key.

    - `azure_external_key_config: object`

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

  - `user_profile_id: string`

    ID of the user profile the key is bound to, or null if the key is not bound to one. A key bound to a user profile can only be attached to a Workspace that has the same user profile. A key that isn't bound can only be attached to a Workspace that has no user profile.

### External Key Attached Attachment

- `external_key_attached_attachment: object`

  - `type: "attached"`

### External Key Changed Error Details

- `external_key_changed_error_details: object`

  - `error_code: "external_key_changed"`

### External Key In Workspace Policy Error Details

- `external_key_in_workspace_policy_error_details: object`

  - `error_code: "external_key_in_workspace_policy"`

### External Key Unattached Attachment

- `external_key_unattached_attachment: object`

  - `type: "unattached"`

### External Key Validation Failed Error Details

- `external_key_validation_failed_error_details: object`

  - `error_code: "external_key_validation_failed"`

### External Key Validation Timed Out Error Details

- `external_key_validation_timed_out_error_details: object`

  - `error_code: "external_key_validation_timed_out"`

### GCP External Key Config

- `gcp_external_key_config: object`

  - `type: "gcp"`

  - `key_name: string`

    Full resource name of the Cloud KMS key.

## Errors

### external_key_in_workspace_policy

HTTP status 400

- `"external_key_in_workspace_policy"`

  The External Key can't be deleted or reconfigured while the organization's Workspace Policy lists it as an allowed key.

  - `details: object`

    - `error_code: "external_key_in_workspace_policy"`

### external_key_validation_failed

HTTP status 400

- `"external_key_validation_failed"`

  The External Key failed Anthropic's validation, so the request was refused. The message gives the reason, if there is one.

  - `details: object`

    - `error_code: "external_key_validation_failed"`

### external_key_validation_timed_out

HTTP status 400

- `"external_key_validation_timed_out"`

  Anthropic's validation of the External Key did not finish in time, so the request was refused. Wait a moment, then send the request again.

  - `details: object`

    - `error_code: "external_key_validation_timed_out"`

### external_key_changed

HTTP status 409

- `"external_key_changed"`

  The external key changed while the request was validating it. Send the request again.

  - `details: object`

    - `error_code: "external_key_changed"`
