> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Remove group user

**delete** `/organization/groups/{group_id}/users/{user_id}`

Removes a user from a group.

### Path Parameters

- `group_id: string`

  The ID of the group to update.

- `user_id: string`

  The ID of the user to remove from the group.

### Returns

- `deleted: boolean`

  Whether the group membership was removed.

- `object: "group.user.deleted"`

  Always `group.user.deleted`.

  - `"group.user.deleted"`

### Example

```http
curl https://api.openai.com/v1/organization/groups/$GROUP_ID/users/$USER_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

#### 200 — Example

```json
{
  "deleted": true,
  "object": "group.user.deleted"
}
```

### Example

```http
curl -X DELETE https://api.openai.com/v1/organization/groups/group_01J1F8ABCDXYZ/users/user_abc123 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
```

#### Response example

```json
{
    "object": "group.user.deleted",
    "deleted": true
}
```
