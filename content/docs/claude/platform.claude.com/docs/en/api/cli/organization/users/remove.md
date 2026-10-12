---
title: Remove User
url: https://platform.claude.com/docs/en/api/cli/organization/users/remove
---

# Remove User

`$ ant organization:users remove`

**DELETE** `/v1/organizations/users/{user_id}`

Remove a member from the organization.

## Parameters

- `--user-id: string` (path parameter)

  ID of the User.

## Returns

- `OrganizationUserRemoveResponse: object`

  - `type: "user_deleted"`

    Deleted object type.

    For Users, this is always `"user_deleted"`.

  - `id: string`

    ID of the User.

## Example

```bash
ant organization:users remove \
  --api-key my-anthropic-api-key \
  --user-id user_id
```

### Response (200)

```json
{
  "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
  "type": "user_deleted"
}
```
