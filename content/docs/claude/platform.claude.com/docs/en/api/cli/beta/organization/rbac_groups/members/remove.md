---
title: Remove RBAC Group Member
url: https://platform.claude.com/docs/en/api/cli/beta/organization/rbac_groups/members/remove
---

# Remove RBAC Group Member

`$ ant beta:organization:rbac-groups:members remove`

**DELETE** `/v1/organizations/rbac_groups/{rbac_group_id}/members/{user_id}`

Remove a User from an RBAC Group. Membership of groups provisioned by an identity provider (source type `"scim"`) cannot be modified via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

## Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--user-id: string` (path parameter)

  ID of the User.

## Returns

- `BetaOrganizationRBACGroupMemberRemoveResponse: object`

  - `type: "rbac_group_member_deleted"`

    Deleted object type. For RBAC Group Members, this is always `"rbac_group_member_deleted"`.

  - `rbac_group_id: string`

    ID of the RBAC Group.

  - `user_id: string`

    ID of the User.

## Example

```bash
ant beta:organization:rbac-groups:members remove \
  --rbac-group-id rbac_group_id \
  --user-id user_id
```

### Response (200)

```json
{
  "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_member_deleted",
  "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
}
```
