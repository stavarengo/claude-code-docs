---
title: Get Chat Project Usage
url: https://platform.claude.com/docs/en/api/cli/beta/organization/analytics/apps/chat/projects/list
---

# Get Chat Project Usage

`$ ant beta:organization:analytics:apps:chat:projects list`

**GET** `/v1/organizations/analytics/apps/chat/projects`

Get per-project activity for a given day, with cursor-based pagination.

Returns activity metrics for each project in the organization, sorted by
project ID. Use `group_by[]` to break projects out per member or per RBAC
group, and `filter[]` to scope results; the parameter descriptions list the
supported dimensions. Available to organizations on a Claude Enterprise
plan. Requires an API key with the `read:analytics` scope.

## Parameters

- `--date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. The day to get project activity for. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

- `--ending-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. End of the date range (exclusive); only valid with `starting_date`. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day), so this can be at most today — which is also the default when omitted, resolved once when the first page is served and reused for the rest of the pagination sequence. At most 366 days after `starting_date`.

  format: date

- `--filter: optional array of string` (query parameter)

  Filters as `dimension:value`, e.g. `filter[]=rbac_group_id:{id}`. Repeat the param for OR within a dimension and across dimensions for AND. Supported dimensions on this endpoint: `project_id`, `rbac_group_id`, `user_id`. Value forms: `project_id` takes a tagged project id (`claude_proj_...`); `rbac_group_id` takes the tagged id (`rbac_group_...`, as emitted in responses and by the spend-limits API) or a bare group UUID, and matches users who held the group at any point during each covered UTC day (time-of-usage attribution); `user_id` takes a tagged user id (`user_...`), as emitted in responses. An unsupported dimension returns 400. At most 100 entries.

  maxItems: 100

- `--group-by: optional array of BetaAnalyticsProjectGroupBy` (query parameter)

  Dimensions to break results out by (e.g. `group_by[]=user_id`). Supported on this endpoint: `rbac_group_id`, `user_id`. Grouped rows carry the requested dimension values as additional fields and paginate like ungrouped responses via `next_page`; an unsupported dimension returns 400. `rbac_group_id` attributes a user to every group they held at any point during each covered UTC day, so grouped rows are not an exclusive partition and can sum above org-level totals. At most 100 entries.

  maxItems: 100

  - `"rbac_group_id"`

  - `"user_id"`

- `--limit: optional number` (query parameter)

  Number of results per page (1-1000, default 100).

  minimum: 1, maximum: 1000

- `--order: optional BetaAnalyticsOrder` (query parameter)

  Sort direction: `asc` or `desc`. Defaults to `asc` for the endpoint's sort column and to `desc` when `order_by` names a metric (a top-N ranking). Applies to `order_by`, or to the endpoint's default sort field when `order_by` is omitted.

  - `"asc"`

  - `"desc"`

- `--order-by: optional string` (query parameter)

  Sort field. Restricted to the endpoint's sort column plus its rankable metrics (metrics default to descending; a few metrics rank in date-range mode only, per the endpoint's documented orderable set).

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--starting-date: optional string` (query parameter)

  UTC date in YYYY-MM-DD format. Start of a date range (inclusive). Enables rollup mode: one row per entity aggregated over the whole range — addable counters are summed across days, and a distinct count is never summed where summing could double-count (a field's range value is recomputed exactly over the window, approximate via HLL with typical error under 2%, null, or — for the creation-event counts, whose per-day values cannot overlap — a per-day sum that is itself exact; each field's own description says which). Use either `date` or `starting_date`, not both. Data is typically available with a 1-day lag (varies by query; the error for a too-recent date names the latest available day) and may be revised by a few percent over the following days. No earlier than 2026-01-01.

  format: date

## Returns

- `BetaAnalyticsProjectsResponse: object`

  Response for GET /v1/organizations/analytics/apps/chat/projects.

  - `data: array of BetaAnalyticsProjectActivity`

    - `created_at: string`

      Project creation timestamp in RFC 3339 format. Null if the project was deleted before attribution was recorded.

      format: date-time

    - `created_by: object`

      User who created the project. Null if the project was deleted before attribution was recorded, or if the creator's account no longer exists.

      - `type: "user"`

        Object type. Always `user`.

      - `id: string`

        Tagged user identifier (e.g. `user_...`)

      - `email_address: string`

        Email address of the user

    - `distinct_conversation_count: number`

      Number of distinct conversations in the project. Null on aggregated rows where a distinct count cannot be computed.

    - `distinct_user_count: number`

      Number of distinct users who used the project on the requested day, or, in date-range mode, over the requested window — recomputed as an exact distinct count over the window's per-member daily rows, never a sum of per-day values.

    - `message_count: number`

      Number of messages sent in the project on the requested day

    - `project_id: string`

      Tagged project identifier (e.g. `claude_proj_...`)

    - `project_name: string`

      Name of the project

    - `rbac_group_id: optional string`

      Tagged RBAC group identifier (`rbac_group_...`), matching the spend-limits API spelling. Present only when the request grouped by `rbac_group_id`.

    - `rbac_group_name: optional string`

      Resolved RBAC group display name, alongside `rbac_group_id` when name resolution is available. Null if the group has been deleted or its name could not be resolved; `rbac_group_id` remains the stable key.

    - `user_id: optional string`

      Tagged user identifier (e.g. `user_...`). Present only when the request grouped by `user_id`.

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results

## Example

```bash
ant beta:organization:analytics:apps:chat:projects list
```

### Response (200)

```json
{
  "data": [
    {
      "created_at": "2019-12-27T18:11:19.117Z",
      "created_by": {
        "id": "id",
        "email_address": "email_address",
        "type": "user"
      },
      "distinct_conversation_count": 0,
      "distinct_user_count": 0,
      "message_count": 0,
      "project_id": "project_id",
      "project_name": "project_name",
      "rbac_group_id": "rbac_group_id",
      "rbac_group_name": "rbac_group_name",
      "user_id": "user_id"
    }
  ],
  "next_page": "next_page"
}
```
