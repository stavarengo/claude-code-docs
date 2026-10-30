> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete file

**delete** `/files/{file_id}`

Delete a file and remove it from all vector stores.

### Path Parameters

- `file_id: string`

  The ID of the file to use for this request.

### Returns

- `FileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "file"`

    - `"file"`

### Example

```http
curl https://api.openai.com/v1/files/$FILE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 200 — Example

```json
{
  "id": "id",
  "deleted": true,
  "object": "file"
}
```

### Example

```http
curl https://api.openai.com/v1/files/file-abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response example

```json
{
  "id": "file-abc123",
  "object": "file",
  "deleted": true
}
```
