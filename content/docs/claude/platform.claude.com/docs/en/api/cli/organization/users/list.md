---
title: List Users
url: https://platform.claude.com/docs/en/api/cli/organization/users/list
---

# List Users

`$ ant organization:users list`

**GET** `/v1/organizations/users`

List the organization's members.

## Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

- `--email: optional string` (query parameter)

  Filter by user email.

  format: email

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--role: optional array of string` (query parameter)

  Filter to items whose `role` equals one of the supplied values. Repeatable; values are OR'ed together.

  Accepted values depend on the organization type: Console and API organizations accept `user`, `developer`, `billing`, `admin`, and `claude_code_user`; Claude Enterprise organizations accept `user`, `owner`, `primary_owner`, `membership_admin`, and `managed`.

## Returns

- `ListResponse_User_: object`

  - `data: array of OrganizationUser`

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

  - `first_id: string`

    First ID in the `data` list. Can be used as the `before_id` for the previous page.

  - `has_more: boolean`

    Indicates if there are more results in the requested page direction.

  - `last_id: string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

## Example

```bash
ant organization:users list
```

### Response (200)

```json
{
  "data": [
    {
      "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
      "added_at": "2024-10-30T23:58:27.427722Z",
      "email": "user@emaildomain.com",
      "name": "Jane Doe",
      "role": "admin",
      "type": "user"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id"
}
```
