---
title: Delete Spend Limit
url: https://platform.claude.com/docs/en/api/cli/beta/organization/spend_limits/delete
---

# Delete Spend Limit

`$ ant beta:organization:spend-limits delete`

**DELETE** `/v1/organizations/spend_limits/{spend_limit_id}`

Delete a spend limit.

For a Claude Enterprise organization, this deletes a per-user override, and
the member falls back to any inherited spend limit at that period. Its
seat-tier, group, and organization-level rows cannot be deleted via this
endpoint. A Claude Console organization deletes its organization and
workspace limits. Deleting them through the API is in an early access preview.

## Parameters

- `--spend-limit-id: string` (path parameter)

  ID of the Spend Limit.

## Returns

- `BetaOrganizationSpendLimitDeleteResponse: object`

  - `type: "spend_limit_deleted"`

  - `id: string`

## Example

```bash
ant beta:organization:spend-limits delete \
  --api-key my-anthropic-api-key \
  --spend-limit-id spend_limit_id
```

### Response (200)

```json
{
  "id": "id",
  "type": "spend_limit_deleted"
}
```
