---
title: Delete RBAC Group
url: https://platform.claude.com/docs/en/api/cli/beta/organization/rbac_groups/delete
---

# Delete RBAC Group

`$ ant beta:organization:rbac-groups delete`

**DELETE** `/v1/organizations/rbac_groups/{rbac_group_id}`

Delete an RBAC Group. Groups provisioned by an identity provider (source type `"scim"`) cannot be deleted via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

## Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

## Returns

- `BetaOrganizationRBACGroupDeleteResponse: object`

  - `type: "rbac_group_deleted"`

    Deleted object type.

    For RBAC Groups, this is always `"rbac_group_deleted"`.

  - `id: string`

    ID of the RBAC Group.

## Example

```bash
ant beta:organization:rbac-groups delete \
  --rbac-group-id rbac_group_id
```

### Response (200)

```json
{
  "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_deleted"
}
```
