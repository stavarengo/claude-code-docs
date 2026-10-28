---
title: Files
url: https://platform.claude.com/docs/en/api/cli/files
---

# Files

## Upload File

`$ ant files upload`

**POST** `/v1/files`

Upload File

### Parameters

- `--file: file path`

  The file to upload. Only the final path component of the part's `filename` is kept; an absent or empty `filename` is replaced with `unnamed` plus the extension for the file's stored `mime_type`, when known.

  format: binary

- `--expires-in-seconds: optional number`

  Seconds from upload until the file expires and its bytes become permanently unavailable. Must be between 3600 (one hour) and 7776000 (ninety days).

  minimum: 3600, maximum: 7776000

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

### Returns

- `file_metadata: object`

  - `type: "file"`

    Object type.

    For files, this is always `"file"`.

  - `id: string`

    Unique object identifier.

    The format and length of IDs may change over time.

  - `created_at: string`

    RFC 3339 datetime string representing when the file was created.

    format: date-time

  - `filename: string`

    Original filename of the uploaded file.

    minLength: 1, maxLength: 500

  - `mime_type: string`

    MIME type of the file.

    minLength: 1, maxLength: 255

  - `size_bytes: number`

    Size of the file in bytes.

    minimum: 0

  - `downloadable: optional boolean`

    Whether the file can be downloaded.

  - `expires_at: optional string`

    RFC 3339 datetime string representing when the file will expire and become unavailable for download. Null if the file does not expire. For files uploaded with `expires_in_seconds`, this is the upload time plus that value.

    format: date-time

### Example

```bash
ant files upload \
  --file 'Example data'
```

#### Response (200)

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "created_at": "2025-04-15T18:37:24.100435Z",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 102400,
  "type": "file",
  "downloadable": false,
  "expires_at": "2025-05-15T18:37:24.100435Z"
}
```

## List Files

`$ ant files list`

**GET** `/v1/files`

List Files

### Parameters

- `--id: optional array of string` (query parameter)

  Restrict the result set to Files whose `id` is in this list. At most 100 entries (after de-duplication). Mutually exclusive with `page` and `limit`. When supplied, the response is always a single page (`next_page` is null). IDs that do not resolve to a visible File — including deleted Files — are silently omitted.

- `--limit: optional number` (query parameter)

  Number of items to return per page.

  Defaults to `20`. Ranges from `1` to `1000`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque page cursor returned in a prior list response's `next_page`. Prefixed `page_`.

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

### Returns

- `FileListResponse: object`

  - `data: array of FileMetadata`

    List of file metadata objects.

    - `type: "file"`

      Object type.

      For files, this is always `"file"`.

    - `id: string`

      Unique object identifier.

      The format and length of IDs may change over time.

    - `created_at: string`

      RFC 3339 datetime string representing when the file was created.

      format: date-time

    - `filename: string`

      Original filename of the uploaded file.

      minLength: 1, maxLength: 500

    - `mime_type: string`

      MIME type of the file.

      minLength: 1, maxLength: 255

    - `size_bytes: number`

      Size of the file in bytes.

      minimum: 0

    - `downloadable: optional boolean`

      Whether the file can be downloaded.

    - `expires_at: optional string`

      RFC 3339 datetime string representing when the file will expire and become unavailable for download. Null if the file does not expire. For files uploaded with `expires_in_seconds`, this is the upload time plus that value.

      format: date-time

  - `next_page: optional string`

    Opaque cursor for the next page. Supply as `?page=` to fetch the next page; null when there are no more results.

### Example

```bash
ant files list
```

#### Response (200)

```json
{
  "data": [
    {
      "id": "file_011CNha8iCJcU1wXNR6q4V8w",
      "created_at": "2025-04-15T18:37:24.100435Z",
      "filename": "document.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 102400,
      "type": "file",
      "downloadable": false,
      "expires_at": "2025-05-15T18:37:24.100435Z"
    }
  ],
  "next_page": "next_page"
}
```

## Download File

`$ ant files download`

**GET** `/v1/files/{file_id}/content`

Download File

### Parameters

- `--file-id: string` (path parameter)

  ID of the File.

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

### Returns

- `unnamed_schema_0: file path`

### Example

```bash
ant files download \
  --file-id file_id
```

## Get File Metadata

`$ ant files retrieve-metadata`

**GET** `/v1/files/{file_id}`

Get File Metadata

### Parameters

- `--file-id: string` (path parameter)

  ID of the File.

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

### Returns

- `file_metadata: object`

  - `type: "file"`

    Object type.

    For files, this is always `"file"`.

  - `id: string`

    Unique object identifier.

    The format and length of IDs may change over time.

  - `created_at: string`

    RFC 3339 datetime string representing when the file was created.

    format: date-time

  - `filename: string`

    Original filename of the uploaded file.

    minLength: 1, maxLength: 500

  - `mime_type: string`

    MIME type of the file.

    minLength: 1, maxLength: 255

  - `size_bytes: number`

    Size of the file in bytes.

    minimum: 0

  - `downloadable: optional boolean`

    Whether the file can be downloaded.

  - `expires_at: optional string`

    RFC 3339 datetime string representing when the file will expire and become unavailable for download. Null if the file does not expire. For files uploaded with `expires_in_seconds`, this is the upload time plus that value.

    format: date-time

### Example

```bash
ant files retrieve-metadata \
  --file-id file_id
```

#### Response (200)

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "created_at": "2025-04-15T18:37:24.100435Z",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 102400,
  "type": "file",
  "downloadable": false,
  "expires_at": "2025-05-15T18:37:24.100435Z"
}
```

## Delete File

`$ ant files delete`

**DELETE** `/v1/files/{file_id}`

Delete File

### Parameters

- `--file-id: string` (path parameter)

  ID of the File.

- `--workspace-id: optional string` (header parameter)

  Optional header to select the Workspace for this request. The value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).

  Only needed for credentials that can act on more than one Workspace. A credential that belongs to a specific Workspace may omit it; if sent, it must match that Workspace.

### Returns

- `deleted_file: object`

  - `type: optional "file_deleted"`

    Deleted object type.

    For file deletion, this is always `"file_deleted"`.

  - `id: string`

    ID of the deleted file.

### Example

```bash
ant files delete \
  --file-id file_id
```

#### Response (200)

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file_deleted"
}
```

## Domain types

### Deleted File

- `deleted_file: object`

  - `type: optional "file_deleted"`

    Deleted object type.

    For file deletion, this is always `"file_deleted"`.

  - `id: string`

    ID of the deleted file.

### File Metadata

- `file_metadata: object`

  - `type: "file"`

    Object type.

    For files, this is always `"file"`.

  - `id: string`

    Unique object identifier.

    The format and length of IDs may change over time.

  - `created_at: string`

    RFC 3339 datetime string representing when the file was created.

    format: date-time

  - `filename: string`

    Original filename of the uploaded file.

    minLength: 1, maxLength: 500

  - `mime_type: string`

    MIME type of the file.

    minLength: 1, maxLength: 255

  - `size_bytes: number`

    Size of the file in bytes.

    minimum: 0

  - `downloadable: optional boolean`

    Whether the file can be downloaded.

  - `expires_at: optional string`

    RFC 3339 datetime string representing when the file will expire and become unavailable for download. Null if the file does not expire. For files uploaded with `expires_in_seconds`, this is the upload time plus that value.

    format: date-time
