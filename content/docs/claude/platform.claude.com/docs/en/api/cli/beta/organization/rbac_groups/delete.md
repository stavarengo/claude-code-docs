---
title: Delete RBAC Group
url: https://platform.claude.com/docs/en/api/cli/beta/organization/rbac_groups/delete
---

# Delete RBAC Group

`$ ant beta:organization:rbac-groups delete`

**DELETE** `/v1/organizations/rbac_groups/{rbac_group_id}`

Delete an RBAC Group. Groups provisioned by an identity provider (source type `"scim"`) cannot be deleted via the API while an organization in the tenant uses SCIM provisioning.

The RBAC Groups API is available to Claude Enterprise organizations only.

## Parameters

- `--rbac-group-id: string` (path parameter)

  ID of the RBAC Group.

## Returns

- `beta_deleted_rbac_group: object`

  - `type: "rbac_group_deleted"`

    Deleted object type.

    For RBAC Groups, this is always `"rbac_group_deleted"`.

  - `id: string`

    ID of the RBAC Group.

## Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `rbac_group_grants_owner_access` (HTTP status 400)

  A role attached to an RBAC Group in the request grants owner access, so this API does not add members to that group (directly or through an invite), remove its members, or delete it. Make the change in the organization's admin settings in Claude.

- `rbac_group_owner_access_unconfirmed` (HTTP status 400)

  The API could not finish checking whether an RBAC Group in the request grants owner access, so it made no change. Retrying the same request will not help. Make the change in the organization's admin settings in Claude.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this change. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

## Example

```bash
ant beta:organization:rbac-groups delete \
  --rbac-group-id rbac_group_id
```

### Response (200)

```json
{
  "id": "rbac_group_012rppKaSVsmTo6NqRDXQXNF",
  "type": "rbac_group_deleted"
}
```
