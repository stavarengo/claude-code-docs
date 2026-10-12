---
title: Get RBAC Role
url: https://platform.claude.com/docs/en/api/cli/beta/organization/rbac_roles/retrieve
---

# Get RBAC Role

`$ ant beta:organization:rbac-roles retrieve`

**GET** `/v1/organizations/rbac_roles/{rbac_role_id}`

Retrieve an RBAC Role by ID.

The RBAC Roles API is available to Claude Enterprise organizations only.

## Parameters

- `--rbac-role-id: string` (path parameter)

  ID of the RBAC Role.

## Returns

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

## Example

```bash
ant beta:organization:rbac-roles retrieve \
  --api-key my-anthropic-api-key \
  --rbac-role-id rbac_role_id
```

### Response (200)

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
