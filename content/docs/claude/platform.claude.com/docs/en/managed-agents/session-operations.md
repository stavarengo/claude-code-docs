---
title: Session operations
url: https://platform.claude.com/docs/en/managed-agents/session-operations
description: Retrieve, list, update, archive, and delete Claude Managed Agents sessions.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

Once a session exists, use these operations to read, update, archive, or delete it. See [Start a session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) for creating a session and sending it work.

## Session statuses

Sessions progress through these statuses. See [Start a session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) for the session lifecycle.

| Status         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idle`         | Agent is waiting for input, including user messages or tool confirmations. Sessions created without `initial_events` start in `idle`. A session can be `idle` while a [workflow run](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#while-a-run-is-open) is still open, so `idle` alone doesn't mean that the work is done. See [Know when the work is done](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#know-when-the-work-is-done). |
| `running`      | Agent is actively executing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `rescheduling` | Transient error occurred, retrying automatically.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `terminated`   | Session has ended, either because of an unrecoverable error or because it was archived. A session that finishes its work goes `idle`, not `terminated`.                                                                                                                                                                                                                                                                                                                                                          |

## Updating the agent configuration

You can update a session's `agent.tools` and `agent.mcp_servers`, including permission policies and per-tool web settings such as [domain filters](https://platform.claude.com/docs/en/managed-agents/tools-web-restrictions?sdk_languages=cli#change-the-lists-mid-session), mid-session without creating a new agent version. Updates are session-local and do not propagate back to the underlying agent. Updated `allowed_domains` and `blocked_domains` apply to the rest of the session.

Only the agent's `tools` and `mcp_servers` can change after a session is created. To run a session with `model`, `system`, or `skills` values other than the agent's, use [agent configuration overrides](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#override-agent-configuration-for-a-session) when you create the session. The agent's model configuration, including its [`inference_geo`](https://platform.claude.com/docs/en/manage-claude/data-residency?sdk_languages=cli) pin, also can't change mid-session: set the pin when you save the agent, or set or clear it for a single session with a `model` override when you create it. The agent's configured `system` field is fixed for the session's lifetime. On models that support it, you can still append system-level guidance mid-session by sending a [`system.message` event](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#send-system-messages).

The semantics of a `tools` or `mcp_servers` update are full replacement: the provided array is the new value. To preserve existing entries, `GET` the session, modify the array, and `POST` it back.

The session must be `idle` to update the agent. To update the agent while the session is running, send a [`user.interrupt` event](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#interrupt-the-agent) by itself and wait for the session to become `idle`. If a [workflow run](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#while-a-run-is-open) is open, whether it's running or paused, the update returns a 400 error, even when the session is `idle`. An interrupt doesn't end a run, so the update still fails after you interrupt the session. Send a `user.message` that [asks the agent to stop its runs](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#interrupt-a-session-with-runs-open), or wait until every run has ended.

<CodeGroup>
  ```bash CLI
  ant beta:sessions update --session-id "$SESSION_ID" <<'YAML'
  agent:
    tools:
      - type: agent_toolset_20260401
      - type: mcp_toolset
        mcp_server_name: linear
    mcp_servers:
      - type: url
        name: linear
        url: https://mcp.linear.app/sse
  YAML
  ```
</CodeGroup>

## Updating the session budget

A session [created with a budget](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli#set-a-session-budget) accepts two kinds of budget update: replacing the cap with a new `max_list_cost`, and removing it by passing `--budget null` (cli: `--budget null`). Both automatically resume work that paused when the session reached its cap. A replacement cap can be higher or lower than the current one, but it must be strictly greater than the session's consumed list cost, and removal is one-way: a non-null `budget` is accepted only on a session that currently has one, so you can't re-add a removed budget or add one to a session created without it. See [Session budgets](https://platform.claude.com/docs/en/managed-agents/budgets?sdk_languages=cli#resume-a-session-at-its-budget) for request examples, the error behaviors, and what counts toward list cost.

## Retrieving a session

<CodeGroup>
  ```bash CLI
  ant beta:sessions retrieve --session-id "$SESSION_ID"
  ```
</CodeGroup>

## Listing sessions

Results from `GET /v1/sessions` are paginated. Use the `limit` query parameter to control the page size. Each response includes a `next_page` cursor; pass it as the `page` parameter on the next request to fetch the following page. `next_page` is `null` when there are no more results.

To go back a page, pass `prev_page` as the `page` parameter. `prev_page` is `null` when you're on the first page.

A `page` cursor is opaque and encodes the `order` of the request that produced it. The `order` query parameter sets the sort direction of the results, `asc` or `desc` by creation time; the default is `desc` (newest first). Reusing a cursor with a different `order` returns a 400 error, as does changing a `created_at` filter so that it excludes the cursor's position. Other query parameters, including the remaining filters and `limit`, can change between paginated requests. For the pagination fields shared across list endpoints, see [Pagination](https://platform.claude.com/docs/en/api/overview?sdk_languages=cli#pagination).

<CodeGroup>
  ```bash CLI
  # --format raw returns one page envelope with its prev_page and next_page
  # cursors; the default output auto-paginates and emits only the sessions.
  cursors=$(ant beta:sessions list \
    --agent-id "$AGENT_ID" \
    --limit 1 \
    --format raw \
    --transform '{prev_page,next_page}')
  printf '%s\n' "$cursors"

  # Pass the next_page cursor back as --page to fetch the next page.
  NEXT_PAGE=$(jq -r '.next_page' <<< "$cursors")
  ant beta:sessions list \
    --agent-id "$AGENT_ID" \
    --limit 1 \
    --page "$NEXT_PAGE" \
    --format raw \
    --transform '{prev_page,next_page}'
  # Pass that response's prev_page as --page to go back the same way.
  ```
</CodeGroup>

## Archiving a session

Archive a session to prevent new events from being sent while preserving its history. A `running` session cannot be archived; to archive one, send a [`user.interrupt` event](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#interrupt-the-agent) by itself and wait for the session to become `idle`. If a [workflow run](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#while-a-run-is-open) is open, archiving might return a 400 error, even when the session is `idle`, or it might succeed and end the run. Before you archive, send a `user.message` that [asks the agent to stop its runs](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#interrupt-a-session-with-runs-open), or wait until each run has ended. Then archive the session once it's `idle`.

<CodeGroup>
  ```bash CLI
  ant beta:sessions archive \
    --session-id "$SESSION_ID"
  ```
</CodeGroup>

## Deleting a session

Delete a session to permanently remove its record, events, and associated sandbox. A `running` session cannot be deleted; to delete one, send a [`user.interrupt` event](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli#interrupt-the-agent) by itself and wait for the session to become `idle`. If a [workflow run](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#while-a-run-is-open) is open, deleting might return a 400 error, even when the session is `idle`, or it might succeed. After a delete that succeeds, no `workflow_run` event reports the end of the session's runs. Before you delete, send a `user.message` that [asks the agent to stop its runs](https://platform.claude.com/docs/en/managed-agents/workflow-runs?sdk_languages=cli#interrupt-a-session-with-runs-open), or wait until each run has ended. Then delete the session once it's `idle`.

Memory stores, vaults, skills, environments, and agents are independent resources and are not affected by session deletion. Files you uploaded through the Files API are also unaffected, but files the session itself produced are scoped to it and are permanently deleted along with its filesystem. Download anything you need to keep before deleting the session. An output file written at the end of the last turn can take a few seconds after the session goes idle to appear in the [session's file list](https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli#listing-and-downloading-session-files), so check that the files you expect are listed first.

<CodeGroup>
  ```bash CLI
  ant beta:sessions delete \
    --session-id "$SESSION_ID"
  ```
</CodeGroup>
