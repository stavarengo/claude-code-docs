---
title: Delete Invite
url: https://platform.claude.com/docs/en/api/cli/organization/invites/delete
---

# Delete Invite

`$ ant organization:invites delete`

**DELETE** `/v1/organizations/invites/{invite_id}`

Delete a pending invite.

## Parameters

- `--invite-id: string` (path parameter)

  ID of the Invite.

## Returns

- `OrganizationInviteDeleteResponse: object`

  - `type: "invite_deleted"`

    Deleted object type.

    For Invites, this is always `"invite_deleted"`.

  - `id: string`

    ID of the Invite.

## Example

```bash
ant organization:invites delete \
  --api-key my-anthropic-api-key \
  --invite-id invite_id
```

### Response (200)

```json
{
  "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
  "type": "invite_deleted"
}
```
