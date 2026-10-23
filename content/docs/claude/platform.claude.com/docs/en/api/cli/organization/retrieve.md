---
title: Get Current Organization
url: https://platform.claude.com/docs/en/api/cli/organization/retrieve
---

# Get Current Organization

`$ ant organization retrieve`

**GET** `/v1/organizations/me`

Retrieve information about the organization associated with the authenticated API key.

## Returns

- `organization_info: object`

  - `type: "organization"`

    Object type.

    For Organizations, this is always `"organization"`.

  - `id: string`

    ID of the Organization.

    format: uuid

  - `name: string`

    Name of the Organization.

## Example

```bash
ant organization retrieve
```

### Response (200)

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "name": "Organization Name",
  "type": "organization"
}
```
