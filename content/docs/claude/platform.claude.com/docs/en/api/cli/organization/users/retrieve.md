---
title: Get User
url: https://platform.claude.com/docs/en/api/cli/organization/users/retrieve
---

# Get User

`$ ant organization:users retrieve`

**GET** `/v1/organizations/users/{user_id}`

Retrieve a member of the organization by user ID.

## Parameters

- `--user-id: string` (path parameter)

  ID of the User.

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
ant organization:users retrieve \
  --user-id user_id
```

### Response (200)

```json
{
  "id": "user_01WxYzAbCdEfGhJkMnPqRsTu",
  "added_at": "2024-10-30T23:58:27.427722Z",
  "email": "user@emaildomain.com",
  "name": "Jane Doe",
  "role": "admin",
  "type": "user"
}
```
