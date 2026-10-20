---
title: Adding files
url: https://platform.claude.com/docs/en/managed-agents/files
description: Upload files and mount them in your sandbox for reading and processing.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

You can provide files to your agent by uploading them through the Files API and mounting them in the session's sandbox.

## Uploading files

First, upload a file using the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli):

<CodeGroup>
  ```bash CLI
  ant files upload --file data.csv
  ```
</CodeGroup>

## Mounting files in a session

Mount uploaded files into the sandbox by adding them to the `resources` array when creating a session:

<Tip>
  The `mount_path` is optional, but make sure the uploaded file has a descriptive name so the agent can identify it.
</Tip>

<CodeGroup>
  ```bash CLI
  ant beta:sessions create \
    --agent "$AGENT_ID" \
    --environment-id "$ENVIRONMENT_ID" <<EOF
  resources:
    - type: file
      file_id: $FILE_ID
      mount_path: /data.csv
  EOF
  ```
</CodeGroup>

With the preceding `mount_path`, the agent reads the file at `/mnt/session/uploads/data.csv` (see [File paths](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli#file-paths)).

A new `file_id` is created that references the instance of the file in the session. These copies do not count against your [storage limits](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli).

## Multiple files

Mount multiple files by adding entries to the `resources` array:

<CodeGroup>
  ```bash CLI
  ant beta:sessions create \
    --agent agent_01J8XkN5uT3vHpLqRfWdY2 \
    --environment-id env_01K2mPsT7hNwR4jXuLvCqD8 <<YAML
  resources:
    - type: file
      file_id: file_011CNha8iCJcU1wXNR6q4V8w
      mount_path: /data.csv
    - type: file
      file_id: file_011CPMxVD3fHLUhvTqtsQA5w
      mount_path: /config.json
    - type: file
      file_id: file_011CRb3kQ7tWx9ZsLmDe2Vh4
      mount_path: /src/main.py
  YAML
  ```
</CodeGroup>

A maximum of 500 files is supported per session.

## Managing files on a running session

You can add or remove files from a session after creation using the session resources API. Each resource has an `id` returned when it is added (or listed), which you use for deletes.

<CodeGroup>
  ```bash CLI
  ant beta:sessions:resources add \
    --session-id "$SESSION_ID" \
    --type file \
    --file-id "$FILE_ID"
  ```
</CodeGroup>

List all resources on a session with `ant beta:sessions:resources list` (cli: `ant beta:sessions:resources list`). To remove a file, call `ant beta:sessions:resources delete` (cli: `ant beta:sessions:resources delete`) with the resource ID:

<CodeGroup>
  ```bash CLI
  ant beta:sessions:resources list --session-id "$SESSION_ID"

  ant beta:sessions:resources delete \
    --session-id "$SESSION_ID" \
    --resource-id "$RESOURCE_ID"
  ```
</CodeGroup>

## Listing and downloading session files

Use the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli) to list files scoped to a session and download them. Files the agent writes to `/mnt/session/outputs/` appear in the list shortly after the agent finishes writing them, sometimes a few seconds after the session goes idle. If an output file you expect is missing, list again after a short delay; once it appears in the list, its upload has finished.

Filtering by `scope_id` requires the `managed-agents-2026-04-01` beta header, so the list examples call `ant beta:files list` (cli: `ant beta:files list`) and pass that header explicitly.

<CodeGroup>
  ```bash CLI
  # List files associated with a session
  ant beta:files list --scope-id sesn_abc123 --beta managed-agents-2026-04-01

  # Download a file
  ant files download --file-id "$FILE_ID" --output output.txt
  ```
</CodeGroup>

## Supported file types

The agent can work with any file type, including:

* Source code (`.py`, `.js`, `.ts`, `.go`, `.rs`, and others)
* Data files (`.csv`, `.json`, `.xml`, `.yaml`)
* Documents (`.txt`, `.md`)
* Archives (`.zip`, `.tar.gz`) - the agent can extract these using bash
* Binary files - the agent can process these with appropriate tools

## File paths

<Note>
  Files mounted in the sandbox are read-only copies. The agent can read them but cannot modify the original uploaded file. To work with modified versions, the agent writes to new paths within the sandbox.
</Note>

* The path you specify is rooted under the session's uploads directory: a `mount_path` of `/data.csv` places the file at `/mnt/session/uploads/data.csv` in the sandbox
* If you omit `mount_path`, the file is placed at `/mnt/session/uploads/<file_id>`
* Parent directories are created automatically
* Paths should be absolute (starting with `/`)
* Files the agent writes to `/mnt/session/outputs/` become available through the Files API, scoped to the session; see [Listing and downloading session files](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli#listing-and-downloading-session-files)
