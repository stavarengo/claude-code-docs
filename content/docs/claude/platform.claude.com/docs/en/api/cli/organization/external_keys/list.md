---
title: List External Keys
url: https://platform.claude.com/docs/en/api/cli/organization/external_keys/list
---

# List External Keys

`$ ant organization:external-keys list`

**GET** `/v1/organizations/external_keys`

List external key configs in the caller's organization.

Results are ordered by creation time (newest first). Use the
`next_page` cursor from the response to fetch subsequent pages.

## Parameters

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

## Returns

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

## Example

```bash
ant organization:external-keys list
```

### Response (200)

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
