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

## Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `cannot_remove_last_member` (HTTP status 400)

  The user is the organization's only member. Add another member before removing this one.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this change. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

- `concurrent_membership_change` (HTTP status 409)

  Another change to the organization's members is in progress. Retry the request once it completes.

## Example

```bash
ant organization:users remove \
  --user-id user_id
```

### Response (200)

```json
{
  "id": "user_01WxYzAbCdEfGhJkMnPqRsTu",
  "type": "user_deleted"
}
```
