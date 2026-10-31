---
title: Add RBAC Group Member
url: https://platform.claude.com/docs/en/api/cli/beta/organization/rbac_groups/members/add
---

# Add RBAC Group Member

`$ ant beta:organization:rbac-groups:members add`

**POST** `/v1/organizations/rbac_groups/{rbac_group_id}/members`

Add a User to an RBAC Group. Membership of groups provisioned by an identity provider (source type `"scim"`) cannot be modified via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

## Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--user-id: string`

  ID of the User.

## Returns

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

## Example

```bash
ant beta:organization:rbac-groups:members add \
  --rbac-group-id rbac_group_id \
  --user-id user_01WxYzAbCdEfGhJkMnPqRsTu
```

### Response (200)

```json
{
  "created_at": "2024-10-30T23:58:27.427722Z",
  "email": "user@emaildomain.com",
  "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_member",
  "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
}
```
