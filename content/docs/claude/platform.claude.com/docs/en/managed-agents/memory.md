---
title: Using agent memory
url: https://platform.claude.com/docs/en/managed-agents/memory
description: Give your agents persistent memory that survives across sessions using memory stores.
featureMetadata:
  status: beta
  betaHeader: agent-memory-2026-07-22
  zdr:
    eligibility: not-eligible
    note: Sessions are stateful resources; transcripts persist until you delete them. Applies to all Managed Agents sub-features, including Self-hosted sandboxes.
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
    Claude API:
      availability: beta
      note: Sending `managed-agents-2026-04-01` together with `agent-memory-2026-07-22` on a memory store call returns a 400 error.
    Claude Platform on AWS:
      availability: beta
      note: On Claude Platform on AWS, sessions on self-hosted environments can't attach memory stores. Sending `managed-agents-2026-04-01` together with `agent-memory-2026-07-22` on a memory store call returns a 400 error.
    Claude Models on Google Cloud (Anthropic managed):
      availability: beta
      note: On Claude Models on Google Cloud (Anthropic managed), memory stores aren't supported for sessions on self-hosted environments. Sending `managed-agents-2026-04-01` together with `agent-memory-2026-07-22` on a memory store call returns a 400 error.
---

Each Managed Agents session starts with a fresh context by default. When a session ends, any state the agent built up is gone. Memory stores let the agent carry information across sessions: user preferences, project conventions, prior mistakes, and domain context.

<Note>
  Don’t combine `agent-memory-2026-07-22` with `managed-agents-2026-04-01` on a memory store request: sending both returns a `400` error. If your code sets beta headers explicitly, replace `managed-agents-2026-04-01` with `agent-memory-2026-07-22` on memory store calls rather than adding a second value. Session endpoints, including attaching a memory store to a session, still use `managed-agents-2026-04-01`.

  `GET /v1/memory_stores/{memory_store_id}/memories` behaves the same under either header: results come back in a stable, server-defined order, and `path_prefix` and `depth` apply the same way.
</Note>

## Overview

A **memory store** is a workspace-scoped collection of text documents optimized for Claude. When you attach a store to a session, it is mounted as a directory inside the session’s sandbox. The agent reads and writes it with the same file tools it uses for the rest of the filesystem, and a note describing each mount is automatically added to the system prompt, telling the agent where to look. The [agent toolset](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli) is required for these interactions; make sure to enable it during [agent creation](https://platform.claude.com/docs/en/managed-agents/agent-setup?sdk_languages=cli). On [self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli), that directory is not a live mount. Instead, your environment worker downloads each attached store into your sandbox before the agent’s tools run and keeps that copy in sync with the store.

Each **memory** in a store is addressed by a path and can be read and edited directly through the API or the Claude Console, allowing for tuning, importing, and exporting.

Every change to a memory creates an immutable **memory version**, giving you an audit trail and point-in-time recovery for everything the agent writes.

## Create a memory store

Give the store a `name` and a `description`. The description is passed to the agent, telling it what the store contains.

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply memory_store.yaml
    ```

    <File filename="memory_store.yaml">
      ```yaml
      # yaml-language-server: $schema=https://platform.claude.com/schemas/ant/beta/memory_store.json
      name: User Preferences
      description: Per-user preferences and project context.
      ```
    </File>
  </CodeGroupItem>
</CodeGroup>

The memory store `id` (`memstore_...`) is what you pass when attaching the store to a session.

### Seed it with content (optional)

Pre-load a store with reference material before any agent runs:

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories create \
    --memory-store-id "$store_id" \
    --path "/formatting_standards.md" \
    --content "All reports use GAAP formatting. Dates are ISO-8601..."
  ```
</CodeGroup>

<Tip>
  Individual memories within the store are capped at 100 kB (\~25k tokens). A store holds a maximum of 10,000 memories. Structure memory as many small focused files, not a few large ones.
</Tip>

## Attach a memory store to a session

Memory stores are attached in the session’s `resources` array when the [session is created](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#creating-a-session). Unlike file resources, memory stores can only be attached at session creation time; adding or removing one from a running session is not supported. You attach memory stores the same way for sessions on cloud and [self-hosted environments](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli); self-hosted environments accept only `memory_store` resources.

Optionally include `instructions` to provide session-specific guidance for how the agent should use this store. It is shown to the agent alongside the store’s `name` and `description`, and is capped at 4,096 characters.

You can configure `access` as well. It defaults to `read_write` (shown explicitly in the following example), but `read_only` is also supported.

<CodeGroup>
  ```bash CLI
  ant beta:sessions create <<YAML
  agent: $agent_id
  environment_id: $environment_id
  resources:
    - type: memory_store
      memory_store_id: $store_id
      access: read_write
      instructions: User preferences and project context. Check before starting any task.
  YAML
  ```
</CodeGroup>

<Warning>
  Memory stores attach with `read_write` access by default. If the agent processes untrusted input (user-supplied prompts, fetched web content, or third-party tool output), a successful prompt injection could write malicious content into the store. Later sessions then read that content as trusted memory. Use `read_only` for reference material, shared lookups, and any store the agent does not need to modify.
</Warning>

A maximum of **8 memory stores** is supported for each session. Attach multiple stores when different parts of memory have different owners or access rules. Common reasons:

* **Shared reference material:** one read-only store attached to many sessions (standards, conventions, domain knowledge), kept separate from each session’s own read-write store
* **Mapping to your product’s structure:** one store for each end user, team, or project, while sharing a single agent configuration
* **Different lifecycles:** a store that outlives any single session, or one you want to archive on its own schedule

### How the agent accesses memory

Each attached store is mounted inside the session’s sandbox as a directory under `/mnt/memory/`. The directory name is the store’s display name sanitized to a filesystem-safe slug (lowercased, with each non-alphanumeric run replaced by a single hyphen), so a store named “Demo Memory” mounts at `/mnt/memory/demo-memory/`. The exact path is returned in the `mount_path` field on the session’s memory-store resource; read it from there rather than constructing it yourself. The agent reads and writes the store with the standard [agent toolset](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli). Writes under the mount path are persisted back to the store and stay in sync across sessions that share it; writes to any other path under `/mnt/memory/` fail, because the sandbox mounts that parent directory read-only. A short description of each mount (display name, mount path, access mode, store `description`, and any `instructions`) is automatically added to the system prompt.

`access` is enforced at the filesystem level: a `read_only` mount rejects writes, whereas writes to a `read_write` mount produce [memory versions](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli#audit-memory-changes) attributed to the session.

<Note>
  On [self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli), each store’s directory is a local copy that the worker manages rather than a live mount. The worker reconciles each copy with its store after tool calls, at most once per sync interval (15 seconds by default), and once more when the session ends. The agent’s `write` and `edit` tools change only the local copy; the worker uploads those changes at its next sync, so another session running on a self-hosted sandbox sees a change only after both workers have synced. Paths under `/mnt/memory/` outside the store directories are not scratch space there: the worker’s file tools refuse to write to them, and anything a shell command writes there is never synced to a store.

  For a `read_only` store, the worker’s `write` and `edit` tools refuse changes under that directory and the worker never uploads anything from it. To learn how the worker resolves write conflicts, and what the `bash` tool can still change in a read-only store’s local copy, see [Read-only stores and conflicts](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli#read-only-stores-and-conflicts).
</Note>

The agent’s reads and writes appear in the [event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli) as ordinary `agent.tool_use` and `agent.tool_result` events for whichever tool touched the mount.

## View and edit memories

Memory stores can be managed directly through the API. Use this for building review workflows, correcting bad memories, or seeding stores before any session runs.

### List memories

List the memories in a store. Results are returned in a stable, server-defined order.

* `path_prefix` scopes the list to one directory. It must end with `/` and matches whole path segments, so `path_prefix=/notes/` returns `/notes/todo.md` but not `/notes-archive/todo.md`.
* `depth` controls how deep the list goes below `path_prefix`: omit it (or pass `0`) to list the whole subtree, or pass `1` to list only the immediate children. Other values return a `400` error.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories list \
    --memory-store-id "$store_id" \
    --path-prefix "/"
  ```
</CodeGroup>

See the [List memories](https://platform.claude.com/docs/en/api/beta/memory_stores/memories/list?sdk_languages=cli) reference for full parameters and response schema.

### Read a memory

Fetching an individual memory returns the full content.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories retrieve \
    --memory-store-id "$store_id" \
    --memory-id "$mem_id"
  ```
</CodeGroup>

See the [Retrieve a memory](https://platform.claude.com/docs/en/api/beta/memory_stores/memories/retrieve?sdk_languages=cli) reference for full parameters and response schema.

### Create a memory

`ant beta:memory-stores:memories create` (cli: `ant beta:memory-stores:memories create`) creates a memory at a given `path`. Create does not overwrite; to [update an existing memory](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli#update-a-memory), use `ant beta:memory-stores:memories update` (cli: `ant beta:memory-stores:memories update`).

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories create \
    --memory-store-id "$store_id" \
    --path "/preferences/formatting.md" \
    --content "Always use tabs, not spaces."
  ```
</CodeGroup>

See the [Create a memory](https://platform.claude.com/docs/en/api/beta/memory_stores/memories/create?sdk_languages=cli) reference for full parameters and response schema.

### Update a memory

`ant beta:memory-stores:memories update` (cli: `ant beta:memory-stores:memories update`) modifies an existing memory by ID. You can change `content`, `path` (a rename), or both. The example renames a memory to an archive path:

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories update \
    --memory-store-id "$store_id" \
    --memory-id "$mem_id" \
    --path "/archive/2026_q1_formatting.md"
  ```
</CodeGroup>

See the [Update a memory](https://platform.claude.com/docs/en/api/beta/memory_stores/memories/update?sdk_languages=cli) reference for full parameters and response schema.

#### Safe content edits (optimistic concurrency)

To avoid overwriting a concurrent write, pass a `content_sha256` precondition. The update only applies if the stored content hash still matches the one you read; on mismatch, re-read the memory and retry against the fresh state.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories update \
    --memory-store-id "$store_id" \
    --memory-id "$mem_id" \
    --content "CORRECTED: Always use 2-space indentation." \
    --precondition "{type: content_sha256, content_sha256: $mem_sha}"
  ```
</CodeGroup>

### Delete a memory

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memories delete \
    --memory-store-id "$store_id" \
    --memory-id "$mem_id"
  ```
</CodeGroup>

See the [Delete a memory](https://platform.claude.com/docs/en/api/beta/memory_stores/memories/delete?sdk_languages=cli) reference for full parameters and response schema.

## Audit memory changes

Every mutation to a memory creates an immutable **memory version** (`memver_...`). Use the version endpoints to audit who changed what and when, to inspect or restore a prior snapshot, and to scrub sensitive content out of history with redact.

Versions belong to the store (not the individual memory) and are not deleted when the memory itself is deleted, so the audit trail also covers deleted memories, subject to the retention described later. Versions are retained for 30 days after they are written; however, the recent versions of a live memory are always kept regardless of age, so memories that change infrequently might retain history beyond 30 days. The live `ant beta:memory-stores:memories retrieve` (cli: `ant beta:memory-stores:memories retrieve`) call always returns the latest version; the version endpoints give you the retained history.

There is no dedicated restore endpoint; to roll back, retrieve the version you want and write its `content` back with `ant beta:memory-stores:memories update` (cli: `ant beta:memory-stores:memories update`) (or `ant beta:memory-stores:memories create` (cli: `ant beta:memory-stores:memories create`) if the parent memory has been deleted, provided the version you want is still retained).

Past memory versions might be deleted after 30 days. To preserve memory history for longer, export versions through the API.

### List versions

List version history for a store, newest first. The example filters to a single memory’s history:

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memory-versions list \
    --memory-store-id "$store_id" \
    --memory-id "$mem_id" \
    --format json
  ```
</CodeGroup>

See the [List memory versions](https://platform.claude.com/docs/en/api/beta/memory_stores/memory_versions/list?sdk_languages=cli) reference for full parameters and response schema.

### Retrieve a version

Fetching an individual version returns the same fields as the list response plus the full `content` body.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memory-versions retrieve \
    --memory-store-id "$store_id" \
    --memory-version-id "$version_id"
  ```
</CodeGroup>

See the [Retrieve a memory version](https://platform.claude.com/docs/en/api/beta/memory_stores/memory_versions/retrieve?sdk_languages=cli) reference for full parameters and response schema.

### Redact a version

Redact scrubs content out of a historical version while preserving the audit trail (who did what, when). Use it for compliance workflows such as removing leaked secrets or PII, or fulfilling user deletion requests.

A version that is the current head of a live memory cannot be redacted. Write a new version first (or delete the memory), then redact the old one.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores:memory-versions redact \
    --memory-store-id "$store_id" \
    --memory-version-id "$version_id"
  ```
</CodeGroup>

See the [Redact a memory version](https://platform.claude.com/docs/en/api/beta/memory_stores/memory_versions/redact?sdk_languages=cli) reference for full parameters and response schema.

## Manage memory stores

In addition to [`create`](https://platform.claude.com/docs/en/api/beta/memory_stores/create?sdk_languages=cli), memory stores support [`retrieve`](https://platform.claude.com/docs/en/api/beta/memory_stores/retrieve?sdk_languages=cli), [`update`](https://platform.claude.com/docs/en/api/beta/memory_stores/update?sdk_languages=cli), [`list`](https://platform.claude.com/docs/en/api/beta/memory_stores/list?sdk_languages=cli), [`archive`](https://platform.claude.com/docs/en/api/beta/memory_stores/archive?sdk_languages=cli), and [`delete`](https://platform.claude.com/docs/en/api/beta/memory_stores/delete?sdk_languages=cli).

### List stores

List stores in the workspace. Archived stores are excluded by default; set `include_archived` to `true` to include them.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores list --include-archived
  ```
</CodeGroup>

See the [List memory stores](https://platform.claude.com/docs/en/api/beta/memory_stores/list?sdk_languages=cli) reference for full parameters and response schema.

### Archive a store

Archiving makes a store read-only and prevents it from being attached to new sessions. Archiving is one-way; there is no unarchive.

<CodeGroup>
  ```bash CLI
  ant beta:memory-stores archive --memory-store-id "$store_id"
  ```
</CodeGroup>

See the [Archive a memory store](https://platform.claude.com/docs/en/api/beta/memory_stores/archive?sdk_languages=cli) reference for full parameters and response schema.

To [permanently delete a store](https://platform.claude.com/docs/en/api/beta/memory_stores/delete?sdk_languages=cli) along with all of its memories and versions, call `ant beta:memory-stores delete` (cli: `ant beta:memory-stores delete`).

## Best practices for memory management

When a store reaches its 10,000-memory limit, writes to new memories fail: both direct `ant beta:memory-stores:memories create` (cli: `ant beta:memory-stores:memories create`) calls and the agent’s file writes to unmapped paths. Existing memories remain readable and editable. The following practices help you stay well under the limit and recover gracefully if you reach it.

* **Use focused stores.** Rather than one large general-purpose store, use smaller purpose-built stores: one for each user, one for shared domain knowledge, and one for project-specific context. Each store has its own 10,000-memory limit, so keeping stores scoped reduces the chance any single one fills up.

* **Condense or prune before the store fills up.** Delete stale or redundant memories with `ant beta:memory-stores:memories delete` (cli: `ant beta:memory-stores:memories delete`). You can also run a [dreaming session](https://platform.claude.com/docs/en/managed-agents/dreams?sdk_languages=cli), which consolidates fragmented content into a separate new output store rather than modifying the original. Switch your sessions over to that output store, then archive or delete the original.

* **Attach a new store when it makes sense.** If a store has grown beyond its useful scope, attach a fresh one for new content and attach the original with `read_only` access. The agent can read from both while only writing to the new one.

* **Limit write access where appropriate.** Sessions that only read shared reference material don’t need `read_write`. Keeping write access scoped to sessions that actually add new memories makes it easier to track where growth is coming from.

## Availability

Memory stores are in beta on every model.

### API support

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Available

| Status           | Cloud platforms                                                                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta<sup>1</sup> | Claude API                                                                                                                                                                   |
| Beta<sup>2</sup> | [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli)                                                     |
| Beta<sup>3</sup> | [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) |

1. Sending `managed-agents-2026-04-01` together with `agent-memory-2026-07-22` on a memory store call returns a 400 error.
2. On Claude Platform on AWS, sessions on self-hosted environments can’t attach memory stores. Sending `managed-agents-2026-04-01` together with `agent-memory-2026-07-22` on a memory store call returns a 400 error.
3. On Claude Models on Google Cloud (Anthropic managed), memory stores aren’t supported for sessions on self-hosted environments. Sending `managed-agents-2026-04-01` together with `agent-memory-2026-07-22` on a memory store call returns a 400 error.

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `agent-memory-2026-07-22`

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                      | HIPAA                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Status  | Not eligible                                                                                                                                             | Not eligible                                                                 |
| Details | Sessions are stateful resources; transcripts persist until you delete them. Applies to all Managed Agents sub-features, including Self-hosted sandboxes. | Applies to all Managed Agents sub-features, including Self-hosted sandboxes. |

Applicable endpoints:

* `/v1/agents`
* `/v1/sessions`
* `/v1/environments`
