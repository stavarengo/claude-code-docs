---
title: Update User
url: https://platform.claude.com/docs/en/api/cli/organization/users/update
---

# Update User

`$ ant organization:users update`

**POST** `/v1/organizations/users/{user_id}`

Update a member's organization role.

## Parameters

- `--user-id: string` (path parameter)

  ID of the User.

- `--role: "billing" or "claude_code_user" or "developer" or 2 more`

  New role for the User.

  The accepted values depend on the organization type. Console and API organizations accept `user`, `developer`, `billing`, and `claude_code_user`; `admin` cannot be assigned through the API. Claude Enterprise organizations accept `user` and `managed`.

## Returns

- `organization_user: object`

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

## Example

```bash
ant organization:users update \
  --api-key my-anthropic-api-key \
  --user-id user_id \
  --role user
```

### Response (200)

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
