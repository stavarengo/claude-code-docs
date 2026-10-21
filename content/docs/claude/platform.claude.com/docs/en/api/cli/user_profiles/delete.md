---
title: Delete User Profile
url: https://platform.claude.com/docs/en/api/cli/user_profiles/delete
---

# Delete User Profile

`$ ant user-profiles delete`

**DELETE** `/v1/user_profiles/{user_profile_id}`

Delete User Profile

## Parameters

- `--user-profile-id: string` (path parameter)

  The ID of the user profile to delete (`uprof_...`).

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

## Returns

- `deleted_user_profile: object`

  - `type: "user_profile_deleted"`

    Object type. Always `user_profile_deleted`.

  - `id: string`

    Identifier of the deleted user profile, prefixed `uprof_`.

## Example

```bash
ant user-profiles delete \
  --api-key my-anthropic-api-key \
  --user-profile-id uprof_011CZkZCu8hGbp5mYRQgUmz9
```

### Response (200)

```json
{
  "id": "uprof_011CZkZCu8hGbp5mYRQgUmz9",
  "type": "user_profile_deleted"
}
```
