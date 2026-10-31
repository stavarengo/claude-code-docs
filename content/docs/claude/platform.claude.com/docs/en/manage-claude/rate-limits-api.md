---
title: Rate Limits API
url: https://platform.claude.com/docs/en/manage-claude/rate-limits-api
description: Programmatically read your organization's API rate limits and set workspace rate limits with the Rate Limits API.
---

<Tip>
  **The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization on the [Organization](https://platform.claude.com/settings/organization) page (`platform.claude.com/settings/organization`) in the Claude Console.
</Tip>

The Rate Limits API provides programmatic access to the rate limits configured for your organization and its workspaces. This is the same information shown on the [Rate limits](https://platform.claude.com/usage/limits) page in the Claude Console. You can also use it to set and clear a workspace’s rate limits.

Use this API to:

* **Keep gateways and proxies in sync:** Read your current limits at startup and on a schedule instead of hardcoding values that drift when Anthropic adjusts them.
* **Power internal alerting:** Compare usage data from the [Usage and Cost Analytics API](https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api?sdk_languages=cli) against your configured limits.
* **Audit workspace configuration:** Verify that workspace overrides match what your provisioning automation expects.
* **Manage workspace limits from code:** Set and clear each workspace’s limits from your provisioning automation instead of editing them in the Console.

<Check>
  **Admin API credentials required.** These endpoints are part of the Admin API. You can access them using an [Admin API key](https://platform.claude.com/docs/en/manage-claude/admin-api-keys?sdk_languages=cli), an OAuth token with the `org:admin` scope, or a personal or service account key that isn’t scoped to a workspace; workspace API keys don’t work. See [Authentication](https://platform.claude.com/docs/en/manage-claude/admin-api?sdk_languages=cli#authentication) for details.
</Check>

The SDK and CLI examples on this page construct the default client, which reads the Admin API key from the `ANTHROPIC_API_KEY` environment variable. The SDKs expose these endpoints as `client.organization.rate_limits` and `client.organization.workspaces.rate_limits`; the Python, TypeScript, C#, Go, and Java list methods return an iterator that follows `next_page` for you, while the PHP, Ruby, and curl examples read one page.

## Quick start

List the rate limits configured for your organization:

<CodeGroup>
  ```bash CLI
  ant organization:rate-limits list
  ```
</CodeGroup>

## Organization rate limits

The `/v1/organizations/rate_limits` endpoint returns the rate limits applied at the organization level for the Messages API and its supporting resources. Limits for other products, such as [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli), are not included.

### Key concepts

* **Rate limit groups:** Each entry in the response represents one rate limit group. Model rate limits are grouped so that several model versions share a single set of limits, and other groups cover resources such as the Message Batches API, the Files API, the Token Counting API, agent skills, and the web search tool.
* **`group` object:** Present on every entry, it identifies the rate limit group the entry applies to. It always has `type`, which is one of the `group_type` values, and `id`, an opaque identifier with the `rlg_` prefix. On `model_group` entries it also has `display_name`, Anthropic’s current label for the group, such as `Claude Sonnet 4.x`. The label is for display only and may change. Other group types have no `display_name`.
* **The `id` inside `group`:** A group has the same `id` in every organization and on every workspace override, and it never changes. Use it to match entries across organizations or against your own catalog. The entry’s own `id` differs for each organization, and `models` changes when Anthropic moves a model between groups. Neither is a stable key for the group.
* **`group_type`:** The query parameter that restricts the list to one group type. See [Filtering by group type](https://platform.claude.com/docs/en/manage-claude/rate-limits-api?sdk_languages=cli#filtering-by-group-type) for the values.
* **`models` list:** For `model_group` entries, the `models` field lists every model ID and alias that counts against that group’s limits. Use this list to look up which group any model string falls under. For other group types, `models` is `null`.
* **`limits` list:** Each group carries a list of `{type, value}` pairs. The `type` field identifies the limiter (such as `requests_per_minute`, `input_tokens_per_minute`, or `output_tokens_per_minute`) and `value` is the configured limit. See [Rate limits](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=cli) for how each limiter is measured and enforced.
* **`source` on workspace limits:** On the workspace endpoint, every limit value also carries `source`, which says where `value` comes from: `{"type": "workspace"}` for an override stored on the workspace, or `{"type": "organization"}` for a value inherited from the organization. By default, the workspace endpoint returns overrides only, so `source.type` is always `workspace` there; inherited values appear when you pass `include_inherited=true`. See [Workspace rate limits](https://platform.claude.com/docs/en/manage-claude/rate-limits-api?sdk_languages=cli#workspace-rate-limits).

For complete parameter details and response schemas, see the [Organization Rate Limits API reference](https://platform.claude.com/docs/en/api/organization/rate_limits/list?sdk_languages=cli).

### List all organization rate limits

<CodeGroup>
  ```bash CLI
  ant organization:rate-limits list
  ```
</CodeGroup>

```json
{
  "data": [
    {
      "id": "rlt_01NwFawrTvAijwqn8AjKVBPS",
      "type": "rate_limit",
      "group_type": "model_group",
      "group": {
        "type": "model_group",
        "id": "rlg_01Hq7YkP3mZ9dTwRx4cVbN2s",
        "display_name": "Claude Opus 5.5"
      },
      "models": ["claude-opus-5-5"],
      "limits": [
        { "type": "requests_per_minute", "value": 4000 },
        { "type": "input_tokens_per_minute", "value": 10000000 },
        { "type": "output_tokens_per_minute", "value": 800000 }
      ]
    },
    {
      "id": "rlt_016qriyigbdebqkzhMujdHkX",
      "type": "rate_limit",
      "group_type": "model_group",
      "group": {
        "type": "model_group",
        "id": "rlg_01Kd5wMv8nSq2LcXy6tRfJ4b",
        "display_name": "Claude Opus 4.x"
      },
      "models": [
        "claude-opus-4-5",
        "claude-opus-4-5-20251101",
        "claude-opus-4-6",
        "claude-opus-4-7",
        "claude-opus-4-8"
      ],
      "limits": [
        { "type": "requests_per_minute", "value": 4000 },
        { "type": "input_tokens_per_minute", "value": 10000000 },
        { "type": "output_tokens_per_minute", "value": 800000 }
      ]
    },
    {
      "id": "rlt_01EyY8kq14eviKJPgepbgBH4",
      "type": "rate_limit",
      "group_type": "batch",
      "group": { "type": "batch", "id": "rlg_01Wn3pBz6kCg9vHtQ7mLxD5a" },
      "models": null,
      "limits": [{ "type": "enqueued_batch_requests", "value": 500000 }]
    }
  ],
  "next_page": null
}
```

### Look up the limits for a specific model

Pass any model ID or alias as the `model` query parameter to return only the entry that contains it:

<CodeGroup>
  ```bash CLI
  ant organization:rate-limits list --model claude-opus-5-5
  ```
</CodeGroup>

If the model string doesn’t match any group, the endpoint returns a 404 error. Any model your organization has access to matches its group. The `model` parameter is supported on the organization endpoint only; the workspace endpoint doesn’t accept it.

## Workspace rate limits

The `/v1/organizations/workspaces/{workspace_id}/rate_limits` endpoint returns the rate limit overrides configured for a single workspace. To also see the values the workspace inherits, pass `include_inherited=true` (see [Include inherited values](https://platform.claude.com/docs/en/manage-claude/rate-limits-api?sdk_languages=cli#include-inherited-values)). To change the overrides, see [Set workspace rate limits](https://platform.claude.com/docs/en/manage-claude/rate-limits-api?sdk_languages=cli#set-workspace-rate-limits).

By default, the response only includes overrides, so anything missing from it is inherited from the organization:

* A group that is absent from `data` has no workspace override at all. The workspace inherits the organization-level limits for that group (it is not unlimited).
* Within a group that is present, a limiter type that is absent from `limits[]` has no workspace override for that limiter. The workspace inherits the organization value for it.
* For each limiter that is present, `org_limit` is the organization-level value for the same limiter, or `null` if the organization has no configured limit for that limiter type, and `source` is `{"type": "workspace"}`.

For complete parameter details and response schemas, see the [Workspace Rate Limits API reference](https://platform.claude.com/docs/en/api/organization/workspaces/rate_limits/list?sdk_languages=cli).

<Tip>
  To retrieve your organization’s workspace IDs, use the [List Workspaces](https://platform.claude.com/docs/en/api/organization/workspaces/list?sdk_languages=cli) endpoint, or find them under [Workspaces in the Claude Console](https://platform.claude.com/settings/workspaces). List Workspaces includes the default workspace only when you pass `include_default=true`.
</Tip>

<CodeGroup>
  ```bash CLI
  ant organization:workspaces:rate-limits list \
    --workspace-id wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ
  ```
</CodeGroup>

```json
{
  "data": [
    {
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "rate_limit_id": "rlt_01NwFawrTvAijwqn8AjKVBPS",
      "type": "workspace_rate_limit",
      "group_type": "model_group",
      "group": {
        "type": "model_group",
        "id": "rlg_01Hq7YkP3mZ9dTwRx4cVbN2s",
        "display_name": "Claude Opus 5.5"
      },
      "models": ["claude-opus-5-5"],
      "limits": [
        {
          "type": "requests_per_minute",
          "value": 1000,
          "org_limit": 4000,
          "source": { "type": "workspace" }
        },
        {
          "type": "input_tokens_per_minute",
          "value": 500000,
          "org_limit": 10000000,
          "source": { "type": "workspace" }
        }
      ]
    },
    {
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "rate_limit_id": "rlt_016qriyigbdebqkzhMujdHkX",
      "type": "workspace_rate_limit",
      "group_type": "model_group",
      "group": {
        "type": "model_group",
        "id": "rlg_01Kd5wMv8nSq2LcXy6tRfJ4b",
        "display_name": "Claude Opus 4.x"
      },
      "models": [
        "claude-opus-4-5",
        "claude-opus-4-5-20251101",
        "claude-opus-4-6",
        "claude-opus-4-7",
        "claude-opus-4-8"
      ],
      "limits": [
        {
          "type": "requests_per_minute",
          "value": 1000,
          "org_limit": 4000,
          "source": { "type": "workspace" }
        },
        {
          "type": "input_tokens_per_minute",
          "value": 500000,
          "org_limit": 10000000,
          "source": { "type": "workspace" }
        }
      ]
    }
  ],
  "next_page": null
}
```

### Include inherited values

To read a workspace’s applicable limits in one request, add the optional `include_inherited` query parameter. It defaults to `false`; a value that isn’t a boolean returns a 400 error. With `include_inherited=true`:

* `data` has one entry for each group that applies to the workspace and has an organization-level value, even if the workspace overrides none of it. A model group applies when the workspace can access at least one of its models.
* Each entry’s `limits[]` lists every limiter type the organization has a value for on that group, plus any type the workspace overrides. Each type appears once, with the workspace’s override where one is stored and the organization’s value otherwise, so one entry can mix the two.
* Each value’s `source` tells them apart: `{"type": "workspace"}` is a stored override, and `{"type": "organization"}` is an inherited value, where `value` equals `org_limit`.

<CodeGroup>
  ```bash CLI
  ant organization:workspaces:rate-limits list \
    --workspace-id wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ \
    --include-inherited
  ```
</CodeGroup>

```json
{
  "data": [
    {
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "rate_limit_id": "rlt_01NwFawrTvAijwqn8AjKVBPS",
      "type": "workspace_rate_limit",
      "group_type": "model_group",
      "group": {
        "type": "model_group",
        "id": "rlg_01Hq7YkP3mZ9dTwRx4cVbN2s",
        "display_name": "Claude Opus 5.5"
      },
      "models": ["claude-opus-5-5"],
      "limits": [
        {
          "type": "requests_per_minute",
          "value": 1000,
          "org_limit": 4000,
          "source": { "type": "workspace" }
        },
        {
          "type": "input_tokens_per_minute",
          "value": 500000,
          "org_limit": 10000000,
          "source": { "type": "workspace" }
        },
        {
          "type": "output_tokens_per_minute",
          "value": 800000,
          "org_limit": 800000,
          "source": { "type": "organization" }
        }
      ]
    },
    {
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "rate_limit_id": "rlt_016qriyigbdebqkzhMujdHkX",
      "type": "workspace_rate_limit",
      "group_type": "model_group",
      "group": {
        "type": "model_group",
        "id": "rlg_01Kd5wMv8nSq2LcXy6tRfJ4b",
        "display_name": "Claude Opus 4.x"
      },
      "models": [
        "claude-opus-4-5",
        "claude-opus-4-5-20251101",
        "claude-opus-4-6",
        "claude-opus-4-7",
        "claude-opus-4-8"
      ],
      "limits": [
        {
          "type": "requests_per_minute",
          "value": 1000,
          "org_limit": 4000,
          "source": { "type": "workspace" }
        },
        {
          "type": "input_tokens_per_minute",
          "value": 500000,
          "org_limit": 10000000,
          "source": { "type": "workspace" }
        },
        {
          "type": "output_tokens_per_minute",
          "value": 800000,
          "org_limit": 800000,
          "source": { "type": "organization" }
        }
      ]
    },
    {
      "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
      "rate_limit_id": "rlt_01EyY8kq14eviKJPgepbgBH4",
      "type": "workspace_rate_limit",
      "group_type": "batch",
      "group": { "type": "batch", "id": "rlg_01Wn3pBz6kCg9vHtQ7mLxD5a" },
      "models": null,
      "limits": [
        {
          "type": "enqueued_batch_requests",
          "value": 500000,
          "org_limit": 500000,
          "source": { "type": "organization" }
        }
      ]
    }
  ],
  "next_page": null
}
```

### Set workspace rate limits

To set or clear a workspace’s rate limits for one rate limit group, send a `POST` request to `/v1/organizations/workspaces/{workspace_id}/rate_limits/{rate_limit_id}`. For `rate_limit_id`, pass the `id` of the group’s entry from the organization endpoint, or the `rate_limit_id` of the group’s entry from the workspace list endpoint. To find the ID of a group the workspace doesn’t override yet, call the workspace list endpoint with `include_inherited=true`, which returns the groups you can set limits for. These IDs differ among organizations, so look them up in each organization you manage.

The request body has a `limits` array of one or more `{type, value}` entries, each for a different limiter type:

* A `value` that is an integer, zero or greater, sets the workspace’s override for that limiter type.
* A `value` of `null` clears the override, so the workspace inherits the organization’s value again. Clearing a limiter type that has no override changes nothing.
* Limiter types that the request doesn’t name keep their current values.

You can set these limiter types: `requests_per_minute`, `input_tokens_per_minute`, `output_tokens_per_minute`, `input_tokens_per_minute_cache_aware`, `tokens_per_minute`, `tokens_per_day`, `tool_uses_per_second`, and, where the list endpoints show them for your organization, the [fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode?sdk_languages=cli) limits `fast_itpmca` (input tokens per minute, cache-aware) and `fast_otpm` (output tokens per minute). Which of them a group accepts depends on its `group.type`:

* `model_group`: every type except `tool_uses_per_second`
* `web_search`: `tool_uses_per_second` only
* `batch`: `requests_per_minute` only

Other group types don’t accept any limiter type. You can clear any of the limiter types listed earlier on any group. The list endpoints can return limiter types that you can’t set, such as `enqueued_batch_requests`; sending one returns a 400 error.

The API stores a value above the organization’s limit for the same limiter type, but it enforces the lower of the two. The response’s `org_limit` shows the organization’s value.

Changes take effect within about an hour. Until a change takes effect, the workspace’s requests are still limited by the previous values.

The API checks the whole request before it changes anything, so an invalid entry fails the request with a 400 error and changes nothing. If a request passes validation, the API then applies the entries one at a time. If applying one fails, the request returns an error and the entries before it stay applied. Each entry sets or clears an absolute value, so you can safely send the same request again. A resend replaces any change that someone else made in between to the limiter types it names.

<Note>
  Setting workspace rate limits isn’t available on [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli) yet.
</Note>

Raise the workspace’s requests per minute for the Claude Opus 5.5 group to 2,000 and clear its input tokens per minute override:

<CodeGroup>
  ```bash CLI
  ant organization:workspaces:rate-limits update \
    --workspace-id wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ \
    --rate-limit-id rlt_01NwFawrTvAijwqn8AjKVBPS <<'YAML'
  limits:
    - type: requests_per_minute
      value: 2000
    - type: input_tokens_per_minute
      value: null
  YAML
  ```
</CodeGroup>

The response is the group’s entry, in the shape of one entry in the workspace list endpoint’s `data` list. Its `limits` lists the workspace’s overrides on that group after the change: a cleared limiter type isn’t listed, and `limits` is empty when no override remains. The response includes the request’s changes even when a list request made right afterward doesn’t show them yet.

```json
{
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "rate_limit_id": "rlt_01NwFawrTvAijwqn8AjKVBPS",
  "type": "workspace_rate_limit",
  "group_type": "model_group",
  "group": {
    "type": "model_group",
    "id": "rlg_01Hq7YkP3mZ9dTwRx4cVbN2s",
    "display_name": "Claude Opus 5.5"
  },
  "models": ["claude-opus-5-5"],
  "limits": [
    {
      "type": "requests_per_minute",
      "value": 2000,
      "org_limit": 4000,
      "source": { "type": "workspace" }
    }
  ]
}
```

The endpoint returns a 400 error for an invalid request or an archived workspace. It returns a 404 error when the workspace isn’t found, or when `rate_limit_id` names a group that the workspace can’t use.

## Filtering by group type

Both list endpoints accept an optional `group_type` query parameter that restricts the response to a single category:

<CodeGroup>
  ```bash CLI
  ant organization:rate-limits list --group-type batch
  ```
</CodeGroup>

Valid values are `model_group`, `batch`, `token_count`, `files`, `skills`, and `web_search`.

## Pagination

Both endpoints accept a `page` query parameter and return a `next_page` field. Responses are currently always a single page, so `next_page` is `null`. Loop on `next_page` so your client paginates correctly without changes when the response grows.

## Frequently asked questions

### Which model strings appear in the `models` list?

Every model ID and alias that counts against the group, including dated IDs (such as `claude-sonnet-4-5-20250929`) and undated aliases (such as `claude-sonnet-4-5`). Look up any model string you pass to the Messages API and you’ll find it in exactly one `model_group` entry.

The list covers the models your organization has access to, so it can differ among organizations.

### What does it mean if a group is missing from the workspace response?

By default, the workspace response lists only overrides, so a missing group has no workspace override and inherits the organization-level limit. Pass `include_inherited=true` to see inherited values on the workspace endpoint, or query the organization endpoint. With `include_inherited=true`, a group is missing only when it doesn’t apply to the workspace or the organization has no limit set for it.

### Can I update rate limits with this API?

**For a workspace:** Yes. The [Set Workspace Rate Limits](https://platform.claude.com/docs/en/api/organization/workspaces/rate_limits/update?sdk_languages=cli) endpoint sets or clears a workspace’s overrides for one rate limit group. Pass the top-level `id` of the matching entry in the [organization endpoint’s response](https://platform.claude.com/docs/en/manage-claude/rate-limits-api?sdk_languages=cli#list-all-organization-rate-limits) as `rate_limit_id`, not the `rlg_` `id` inside its `group`. The lower of the workspace override and the organization-level limit applies, and a change takes effect within about an hour. For the request body and an example, see [this page’s section on setting workspace rate limits](https://platform.claude.com/docs/en/manage-claude/rate-limits-api?sdk_languages=cli#set-workspace-rate-limits). You can also set workspace rate limits on the [Rate limits](https://platform.claude.com/usage/limits) page in the Claude Console: select the workspace from the **Workspace** dropdown menu, and click **Edit** next to a model.

**For an organization:** No. To request higher limits, see [Requesting higher limits](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=cli#requesting-higher-limits).

## See also

* [Rate limits](https://platform.claude.com/docs/en/api/rate-limits?sdk_languages=cli)
* [Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api?sdk_languages=cli)
* [Admin API reference](https://platform.claude.com/docs/en/api/organization?sdk_languages=cli)
* [Workspaces](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli)
* [Usage and Cost Analytics API](https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api?sdk_languages=cli)
