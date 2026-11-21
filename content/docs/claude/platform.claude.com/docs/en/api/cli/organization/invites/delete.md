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

## Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

## Example

```bash
ant organization:invites delete \
  --invite-id invite_id
```

### Response (200)

```json
{
  "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
  "type": "invite_deleted"
}
```
