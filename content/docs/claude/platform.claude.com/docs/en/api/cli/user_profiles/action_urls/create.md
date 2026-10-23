---
title: Create Action URL
url: https://platform.claude.com/docs/en/api/cli/user_profiles/action_urls/create
---

# Create Action URL

`$ ant user-profiles:action-urls create`

**POST** `/v1/user_profiles/{user_profile_id}/action_urls`

Create Action URL

## Parameters

- `--user-profile-id: string` (path parameter)

  The ID of the user profile the action is for (`uprof_...`).

- `--action: object`

  The action that the person who opens the URL takes.

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

## Returns

- `user_profile_action_url: object`

  A URL to give to the person who takes the requested action.

  - `type: "user_profile_action_url"`

    Object type. Always `user_profile_action_url`.

  - `expires_at: string`

    When the URL stops working, in RFC 3339 format.

    format: date-time

  - `url: string`

    The URL to give to the person who takes the action. Anyone who holds it can open it until `expires_at`.

## Example

```bash
ant user-profiles:action-urls create \
  --user-profile-id uprof_011CZkZCu8hGbp5mYRQgUmz9 \
  --action '{type: enroll_end_user}'
```

### Response (200)

```json
{
  "expires_at": "2026-03-15T10:15:00Z",
  "type": "user_profile_action_url",
  "url": "https://platform.claude.com/user-profiles/enrollment/M3J0bGJxZ2ppMnptbnB1"
}
```
