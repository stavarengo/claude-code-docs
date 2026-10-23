---
title: List RBAC Group Members
url: https://platform.claude.com/docs/en/api/cli/beta/organization/rbac_groups/members/list
---

# List RBAC Group Members

`$ ant beta:organization:rbac-groups:members list`

**GET** `/v1/organizations/rbac_groups/{rbac_group_id}/members`

List members of an RBAC Group.

The RBAC Groups API is available to Claude Enterprise organizations only.

## Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Optionally set to the `next_page` token from the previous response.

## Returns

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

## Example

```bash
ant beta:organization:rbac-groups:members list \
  --rbac-group-id rbac_group_id
```

### Response (200)

```json
{
  "data": [
    {
      "created_at": "2024-10-30T23:58:27.427722Z",
      "email": "user@emaildomain.com",
      "rbac_group_id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
      "type": "rbac_group_member",
      "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
    }
  ],
  "has_more": false,
  "next_page": "eyJjdXJzb3IiOiAicmJhY19ncm91cF8wMSJ9"
}
```
