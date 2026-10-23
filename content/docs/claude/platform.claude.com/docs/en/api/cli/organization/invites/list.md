---
title: List Invites
url: https://platform.claude.com/docs/en/api/cli/organization/invites/list
---

# List Invites

`$ ant organization:invites list`

**GET** `/v1/organizations/invites`

List the organization's invites.

## Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--email: optional string` (query parameter)

  Filter by the email address the Invite was sent to. Matches the same way as the Users list's `email` filter (normalized, case-insensitive).

  format: email

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--role: optional array of string` (query parameter)

  Filter to items whose `role` equals one of the supplied values. Repeatable; values are OR'ed together.

  Accepted values depend on the organization type: Console and API organizations accept `user`, `developer`, `billing`, `admin`, and `claude_code_user`; Claude Enterprise organizations accept `user`, `owner`, `primary_owner`, `membership_admin`, and `managed`.

- `--status: optional array of "accepted" or "expired" or "pending"` (query parameter)

  Filter by Invite status. Repeatable; values are OR'ed together. Omit to return `pending`, `accepted`, and `expired` Invites alike.

## Returns

- `ListResponse_InviteSchema_: object`

  - `data: array of OrganizationInvite`

    - `type: "invite"`

      Object type.

      For Invites, this is always `"invite"`.

    - `id: string`

      ID of the Invite.

    - `accepted_at: string`

      RFC 3339 datetime string indicating when the Invite was accepted, or null.

      format: date-time

    - `email: string`

      Email of the User being invited.

    - `expires_at: string`

      RFC 3339 datetime string indicating when the Invite expires.

      format: date-time

    - `invited_at: string`

      RFC 3339 datetime string indicating when the Invite was created.

      format: date-time

    - `rbac_group_ids: array of string`

      RBAC group IDs recorded on the Invite (Claude Enterprise organizations), to be assigned to the User when the Invite is accepted. `[]` when none.

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

    - `status: "accepted" or "deleted" or "expired" or "pending"`

      Status of the Invite.

      - `"accepted"`

      - `"deleted"`

      - `"expired"`

      - `"pending"`

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

## Example

```bash
ant organization:invites list
```

### Response (200)

```json
{
  "data": [
    {
      "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
      "accepted_at": "2019-12-27T18:11:19.117Z",
      "email": "user@emaildomain.com",
      "expires_at": "2024-11-20T23:58:27.427722Z",
      "invited_at": "2024-10-30T23:58:27.427722Z",
      "rbac_group_ids": [
        "string"
      ],
      "role": "admin",
      "status": "pending",
      "type": "invite"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```
