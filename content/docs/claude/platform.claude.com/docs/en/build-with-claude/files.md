---
title: Files API
url: https://platform.claude.com/docs/en/build-with-claude/files
description: Upload files once, reference them by file_id in Messages requests, and download outputs created by skills or the code execution tool.
featureMetadata:
  status: stable
  zdr:
    eligibility: not-eligible
    note: Files retained until explicitly deleted or they reach their configured expiration.
  supportedModels:
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
    - claude-opus-4-5-20251101
    - claude-sonnet-4-5-20250929
  supportedPlatforms:
    Claude API: stable
    Claude Platform on AWS: stable
    Claude Models on Google Cloud (Anthropic managed): stable
    Microsoft Foundry (hosted on Anthropic): stable
---

**API support**: Usage differs by product.

* **Messages API**: Refer to an uploaded file by its `file_id` in a `document`, `image` or `container_upload` block.
* **Managed Agents**: Mount files in the session’s sandbox, or refer to a `file_id` in a `user.message` event.

The Files API lets you upload and manage files to use with the Claude API without re-uploading content with each request. This is particularly useful when using the [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli) to provide inputs (for example, datasets and documents) and then download outputs (for example, charts). You can [explore the API reference directly](https://platform.claude.com/docs/en/api/files/upload?sdk_languages=cli), in addition to this guide.

## File type support

Referencing a `file_id` in a Messages request is supported on all models that support the given file type. [Images](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli) are supported on all current Claude models. For [PDFs](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli) and [other file types with the code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#availability-feature-support), see the linked pages for model support.

## How the Files API works

The Files API provides a create-once, use-many-times approach for working with files:

* **Upload files** to Anthropic’s secure storage and receive a unique `file_id`
* **Download files** that are created by skills or the code execution tool
* **Reference files** in [Messages](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli) requests using the `file_id` instead of re-uploading content
* **Manage your files** with list, retrieve, and delete operations

<Warning id="workspace-scoped-access" title="Uploaded files are accessible to your entire workspace">
  Files are not scoped to an end user, conversation, or session. Any API key with access to a workspace can access any files uploaded to that workspace. Every service account, and every user whose organization role allows API access, can use the Default Workspace in addition to any workspace you add them to, so keep files that must stay separate in their own workspace and access them only with [keys scoped to that workspace](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli#api-keys-and-resource-scoping). Never accept `file_id` values from end users or other untrusted sources: a user-supplied file ID would let one user of your application read content that another user uploaded. Treat file IDs as server-side references, and keep the mapping between your users and their files in your application.

  If you are building a multitenant application on the Files API, create a separate [workspace](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli) for each tenant. The workspace is the isolation boundary for files, so a workspace for each tenant gives that tenant’s data hard isolation from every other tenant. Each organization can have up to 100 workspaces; contact your account team if you need more.
</Warning>

## How to use the Files API

### Uploading a file

Upload a file to reference in future API calls:

<CodeGroup>
  ```bash CLI
  ant files upload --file /path/to/document.pdf
  ```
</CodeGroup>

The response from uploading a file includes:

```json Response
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false,
  "expires_at": null
}
```

[`downloadable`](https://platform.claude.com/docs/en/api/files?sdk_languages=cli#file_metadata.downloadable) is `false` for files you upload. Only files created by [skills](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli) or the [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli) can be downloaded. See [Downloading a file](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#downloading-a-file).

The API reference describes every field of the file object.

(See `file_metadata` on `files` in [the API reference](https://platform.claude.com/docs/en/api/files?sdk_languages=cli#file_metadata).)

### Using a file in messages

Once uploaded, reference the file by passing the `id` from the upload response as `file_id`:

<CodeGroup>
  ```bash CLI
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: text
          text: Please summarize this document for me.
        - type: document
          source:
            type: file
            file_id: $FILE_ID
  YAML
  ```
</CodeGroup>

### File types and content blocks

The Files API supports different file types that correspond to different content block types:

| File type                                                                                                                                                                                         | MIME type                                            | Content block type | Use case                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------ | ---------------------------------- |
| PDF                                                                                                                                                                                               | `application/pdf`                                    | `document`         | Text analysis, document processing |
| Plain text                                                                                                                                                                                        | `text/plain`                                         | `document`         | Text analysis, processing          |
| Images                                                                                                                                                                                            | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image`            | Image analysis, visual tasks       |
| Datasets, others (see [Upload and analyze your own files](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#upload-and-analyze-your-own-files)) | Varies                                               | `container_upload` | Data analysis, visualization       |

#### Document blocks

For PDFs and text files, use the `document` content block:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Optional
  "context": "Context about the document", // Optional
  "citations": { "enabled": true } // Optional, enables citations
}
```

#### Image blocks

For images, use the `image` content block:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

#### Container upload blocks

To [send a file to the code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#upload-and-analyze-your-own-files), use the `container_upload` content block:

```json
{
  "type": "container_upload",
  "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
}
```

### Working with other file formats

For file types that the `document` block doesn’t support (for example, .docx and .xlsx), convert the files to plain text and include the content directly in your message. Files that are already plain text, such as .csv and .md files, can either be read in this way or uploaded through the Files API with an explicit `text/plain` content type. To analyze datasets instead of reading them as text, upload them for the code execution tool using a `container_upload` block (see [Upload and analyze your own files](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#upload-and-analyze-your-own-files)).

The following examples read a text file and send its contents as plain text:

<CodeGroup>
  ```bash CLI
  # The "@./path" reference inlines the file contents directly into the field.
  ant messages create --model claude-opus-5-5 --max-tokens 1024 <<'YAML'
  messages:
    - role: user
      content:
        - type: text
          text: "Here's the document content:"
        - type: text
          text: "@./document.txt"
        - type: text
          text: "Please summarize this document."
  YAML
  ```
</CodeGroup>

<Note>
  For .docx files containing images, convert them to PDF format first, then use [PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli) to take advantage of the built-in image parsing. This allows using citations from the PDF document.
</Note>

### Managing files

#### List files

Retrieve a list of your uploaded files. The endpoint is paginated: each request returns up to [`limit`](https://platform.claude.com/docs/en/api/files/list?sdk_languages=cli#list.limit) files (20 by default, and at most 1,000), and the response’s [`next_page`](https://platform.claude.com/docs/en/api/files/list?sdk_languages=cli#list.response.next_page) cursor fetches the next page when passed back as the [`page`](https://platform.claude.com/docs/en/api/files/list?sdk_languages=cli#list.page) parameter. Files are ordered newest first. See the [List Files API reference](https://platform.claude.com/docs/en/api/files/list?sdk_languages=cli). The SDK returns the first page and provides [auto-pagination](https://platform.claude.com/docs/en/api/overview?sdk_languages=cli#pagination) helpers.

<CodeGroup>
  ```bash CLI
  # List commands auto-paginate, so --max-items limits the total
  ant files list --max-items 10
  ```
</CodeGroup>

To check a known set of files in one request instead of paging, pass up to 100 file IDs as `ids[]` query parameters. An `ids[]` request always returns a single page (`next_page` is `null`), and any ID that does not resolve to a file in your workspace is silently omitted from `data`; compare the returned IDs against the requested IDs to detect misses. `ids[]` cannot be combined with `page` or `limit`.

#### Get file metadata

Retrieve information about a specific file:

<CodeGroup>
  ```bash CLI
  ant files retrieve-metadata --file-id "$FILE_ID"
  ```
</CodeGroup>

#### Delete a file

Delete a file from your workspace:

<CodeGroup>
  ```bash CLI
  ant files delete --file-id "$FILE_ID"
  ```
</CodeGroup>

### Downloading a file

Download files that were created by [skills](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli) or the [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli). Files you upload cannot be downloaded. The `file_id` of a generated file appears in the [`bash_code_execution_tool_result` content block](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#retrieve-generated-files) of the Messages response that created it:

<CodeGroup>
  ```bash CLI
  ant files download --file-id "$FILE_ID" --output downloaded_file.txt
  ```
</CodeGroup>

<Note>
  A file is downloadable only when its metadata shows `"downloadable": true`, which is the case for files created by skills or the code execution tool. Downloading a file you uploaded returns a 400 error.
</Note>

On the Claude API, supported image, video, and audio files that Claude produces with the code execution tool, including files created by skills, carry signed C2PA Content Credentials when you download them. See [Content Credentials on generated files](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#content-credentials-on-generated-files) for what the credential contains and how to verify it.

## File storage and limits

### Storage limits

* **Maximum file size:** 500 MB for each file
* **Total storage:** 1 TB for each organization

### File lifecycle

* Files are scoped to the workspace they were uploaded in. Any request in the same workspace can reference them; never accept file IDs from untrusted sources (see the [workspace access warning](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#workspace-scoped-access)).
* Files cannot be modified or renamed after upload. To change a file’s content, upload a new file and delete the old one.
* Files persist until you delete them with the `DELETE /v1/files/{file_id}` endpoint or they reach their `expires_at`.
* Deleted files cannot be recovered.
* Files are inaccessible through the API shortly after deletion, but they may persist in active Messages API calls and associated tool uses.
* Files that users delete will be deleted in accordance with Anthropic’s [data retention policy](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

### File expiration

To have a file expire automatically, include an [`expires_in_seconds`](https://platform.claude.com/docs/en/api/files/upload?sdk_languages=cli#upload.expires_in_seconds) form field when you upload it. The value is an integer number of seconds between 3,600 (1 hour) and 7,776,000 (90 days). The resulting [`expires_at`](https://platform.claude.com/docs/en/api/files?sdk_languages=cli#file_metadata.expires_at) timestamp (RFC 3339) appears on every file response and is `null` for files uploaded without an expiration. Expiration is set once at upload and cannot be changed.

When a file reaches its `expires_at`:

* Downloading its content (`GET /v1/files/{file_id}/content`) returns a 404 error.
* A Messages request that references the file fails before inference.
* Its metadata (`GET /v1/files/{file_id}`) remains readable for up to 30 days, with `expires_at` in the past.
* It continues to appear in list responses during that window; compare `expires_at` to the current time to filter expired files.

Deleting an expired file with `DELETE /v1/files/{file_id}` removes its metadata immediately instead of waiting for the 30-day window to elapse.

<Note>
  Expiration is a lifecycle feature, not a guaranteed-deletion control. After `expires_at`, file content is no longer retrievable through the API and is released from your storage quota; the underlying content may be retained for a limited period thereafter for safety review before permanent deletion, and file metadata remains visible for up to 30 days after expiration. To delete a file before its scheduled expiration, use `DELETE /v1/files/{file_id}`.
</Note>

### Audit logging

If your organization has the [Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api?sdk_languages=cli) enabled, its [Activity Feed](https://platform.claude.com/docs/en/manage-claude/compliance-activity-feed?sdk_languages=cli) records Files API operations made with a Claude API key or from the Claude Console: each upload (`POST /v1/files`), content download (`GET /v1/files/{file_id}/content`), and deletion (`DELETE /v1/files/{file_id}`) appears as a `platform_file_uploaded`, `platform_file_content_downloaded`, or `platform_file_deleted` activity. Listing files and retrieving file metadata are not recorded. Operations that occur while the Compliance API is off are not recorded and cannot be recovered later, so [set up the Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api-access?sdk_languages=cli) before you rely on this audit trail. On [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli#monitoring-and-logging), audit file operations with AWS CloudTrail data events instead.

## Migrate from `files-api-2025-04-14`

The Files API is out of beta and needs no beta header. Migrating off `files-api-2025-04-14` is optional: requests that still send it keep working and keep returning the beta response shapes, so an existing integration keeps working until you change it. Removing the header switches those requests to the shapes documented on this page:

|                                          | With `files-api-2025-04-14`             | Without the header                                                           |
| ---------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| List response                            | `{ data, has_more, first_id, last_id }` | `{ data, next_page }`; pass `next_page` back as the `page` query parameter   |
| List cursors                             | `before_id`, `after_id`                 | `page`, or up to 100 `ids[]` (`before_id` and `after_id` return a 400 error) |
| `expires_at` on file objects             | Not returned                            | Always present; `null` when the file has no expiration                       |
| `Content-Type` on the uploaded file part | Required                                | Optional; the type is detected when omitted                                  |

To migrate:

1. **Remove the beta header.** Drop `anthropic-beta: files-api-2025-04-14` from your requests. With the SDK, call `client.files` instead of `client.beta.files`; keeping `client.beta.files` works only on the [SDK releases that no longer send the header](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#sdk-beta-namespace). Earlier releases send it from `client.beta.files` even when you pass no beta names.
2. **Update pagination.** Replace `after_id`/`before_id` loops with the `page`/`next_page` cursor, or use the SDK auto-pagination helpers shown in [Managing files](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#managing-files).
3. **Read `expires_at`.** The field appears only without the header; `null` means the file has no expiration (see [File expiration](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#file-expiration)).

### SDK beta namespace

Starting with Python SDK 1.2.0, TypeScript SDK 0.122.0, Go SDK 1.68.0, Java SDK 2.59.0, PHP SDK 0.45.0, Ruby SDK 1.67.0, and C# SDK 12.44.0, `client.beta.files` no longer sends `files-api-2025-04-14` and returns the same shapes as `client.files`, with `Beta`-prefixed type names (in PHP, classes in the `Anthropic\Beta` namespace). It takes beta names through `betas` for Files features that are in beta, such as `scope_id` filtering under a [Managed Agents](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli) beta header. Earlier SDK releases are typed to the beta shapes; if you depend on those types, stay on an earlier release until you migrate.

Requests that carry `anthropic-beta: managed-agents-2026-04-01` without `files-api-2025-04-14` receive the shapes on this page with one compatibility affordance on `GET /v1/files`: `before_id` and `after_id` are still accepted (not combinable with `page` or `ids[]`), and the list response includes `has_more`, `first_id`, and `last_id` alongside `next_page`. Later Managed Agents beta versions receive the plain shape.

## Error handling

Common errors when using the Files API include:

* **File not found (404):** The specified `file_id` doesn’t exist or you don’t have access to it.
* **Invalid file type (400):** The file type doesn’t match the content block type (for example, using an image file in a document block).
* **Not downloadable (400):** Files you upload have `"downloadable": false` and cannot be downloaded. Only files created by skills or the code execution tool can be downloaded.
* **Exceeds context window size (400):** The file is larger than the context window size (for example, using a 500 MB plain text file in a `/v1/messages` request).
* **Invalid file name (400):** The file name doesn’t meet the length requirements (1–255 characters) or contains forbidden characters (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, or Unicode characters 0–31).
* **File too large (413):** The file exceeds the 500 MB limit.
* **Storage limit exceeded (400):** Your organization has reached the 1 TB storage limit.

```json Output
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "File `file_011CNha8iCJcU1wXNR6q4V8w` not found."
  },
  "request_id": "req_011CQFYcrRp7mCHLDsAYT8Qt"
}
```

## Usage and billing

Files API operations are free:

* Uploading files
* Downloading files
* Listing files
* Getting file metadata
* Deleting files

File content used in Messages requests is priced as input tokens.

### Rate limits

File-related API calls are limited to approximately 500 requests per minute. To request a higher limit, [contact sales](mailto:sales@anthropic.com).

## Next steps

<CardGroup cols={3}>
  <Card title="PDF support" icon="file" href="https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli">
    Process PDFs with Claude. Extract text, analyze charts, and understand visual content from your documents.
  </Card>

  <Card title="Code execution tool" icon="terminal" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli">
    Run Python and Bash code in a sandboxed container to analyze data, generate files, and iterate on solutions.
  </Card>

  <Card title="Vision" icon="image" href="https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli">
    Process and analyze visual input and generate text and code from images.
  </Card>
</CardGroup>

## Availability

The Files API is available on every model.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Available
* Usage: Refer to an uploaded file by its `file_id` in a `document`, `image` or `container_upload` block.

| Status    | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Available | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Microsoft Foundry (hosted on Anthropic)](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) |

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Available
* Usage: Mount uploaded files in the session’s sandbox as session resources (read-only, under `/mnt/session/uploads`), or refer to a `file_id` in an `image` or `document` block of a `user.message` event. Files the agent writes to `/mnt/session/outputs/` can be downloaded with the Files API.

| Status    | Cloud platforms         |
| --------- | ----------------------- |
| Available | All supported platforms |

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                                                           | HIPAA        |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Status  | Not eligible                                                                                                                                                                                  | Not eligible |
| Details | Files retained until explicitly deleted or they reach their configured expiration. [Learn more](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#data-retention) | —            |

Applicable endpoints:

* `/v1/files`
