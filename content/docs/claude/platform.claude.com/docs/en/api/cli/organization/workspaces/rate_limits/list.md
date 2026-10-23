---
title: List Workspace Rate Limits
url: https://platform.claude.com/docs/en/api/cli/organization/workspaces/rate_limits/list
---

# List Workspace Rate Limits

`$ ant organization:workspaces:rate-limits list`

**GET** `/v1/organizations/workspaces/{workspace_id}/rate_limits`

List a workspace's rate limits.

By default, returns only the groups and limiter types that have a
workspace-level override. With `include_inherited=true`, returns every
group with organization-level limits the workspace can see, listing for
each the values it inherits from the organization as well as its own
overrides. Each value's `source` says which it is.

When `limit` is omitted, every matching entry is returned in a single
page; when `limit` truncates the result, follow `next_page` to fetch
the remaining entries.

## Parameters

- `--workspace-id: string` (path parameter)

  The ID of the workspace.

- `--group-type: optional "batch" or "files" or "model_group" or 3 more` (query parameter)

  Filter by group type.

- `--include-inherited: optional boolean` (query parameter)

  Also list the limiter values the workspace inherits from the organization, including groups with no workspace-level override.

- `--limit: optional number` (query parameter)

  Maximum number of items to return per page. Ranges from `1` to `1000`.

  When omitted, every remaining entry is returned in a single page and `next_page` is `null`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

## Returns

- `WorkspaceRateLimitListResponse: object`

  - `data: array of WorkspaceRateLimit`

    Rate-limit entries for the workspace: one per group with at least one override, or, with `include_inherited` set to `true`, one per group the workspace can see that has organization-level limits.

    - `type: "workspace_rate_limit"`

      Object type. Always `workspace_rate_limit` for workspace rate-limit entries.

    - `group: OrganizationRateLimitModelGroup or OrganizationRateLimitBatchGroup or OrganizationRateLimitTokenCountGroup or 3 more`

      The rate-limit group this entry's limits apply to.

      - `organization_rate_limit_model_group: object`

        - `type: "model_group"`

          Always `model_group`: a family of models.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

        - `display_name: string`

          Human-readable name of the model group (for example, `Claude Sonnet 4.x`). For display only; it may change.

      - `organization_rate_limit_batch_group: object`

        - `type: "batch"`

          Always `batch`: the Message Batches API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `organization_rate_limit_token_count_group: object`

        - `type: "token_count"`

          Always `token_count`: the Token Count API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `organization_rate_limit_files_group: object`

        - `type: "files"`

          Always `files`: the Files API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `organization_rate_limit_skills_group: object`

        - `type: "skills"`

          Always `skills`: the Skills API.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

      - `organization_rate_limit_web_search_group: object`

        - `type: "web_search"`

          Always `web_search`: the Messages API web search tool.

        - `id: string`

          Opaque identifier of the rate-limit group (for example, `rlg_01VPTCmyiu5ZLsWkcxYG2pY8`). It is the same in every organization and never changes, unlike the entry's own identifier, which differs per organization.

    - `limits: array of WorkspaceRateLimitValue`

      The workspace's limiter values for this group. By default only the limiter types with a workspace-level override are listed. With `include_inherited` set to `true`, the limiter types the workspace inherits from the organization are listed too, each marked by `source`.

      - `type: string`

        The limiter type (for example, `requests_per_minute` or `input_tokens_per_minute`).

      - `org_limit: number`

        The organization-level value for the same limiter type, for reference. `null` when the organization has no limit configured for this limiter type.

      - `source: WorkspaceRateLimitWorkspaceSource or WorkspaceRateLimitOrganizationSource`

        Where `value` comes from. `organization` values are listed only when `include_inherited` is `true`, and then `value` equals `org_limit`.

        - `workspace_rate_limit_workspace_source: object`

          - `type: "workspace"`

            Always `workspace`: a workspace-level override is stored.

        - `workspace_rate_limit_organization_source: object`

          - `type: "organization"`

            Always `organization`: no workspace-level override is stored, so the organization's value applies.

      - `value: number`

        The workspace's value for this limiter type: the workspace-level override when `source.type` is `workspace`, otherwise the organization's value.

    - `models: array of string`

      Model names this entry's limits apply to, including aliases. `null` when `group.type` is not `"model_group"`. The list covers the models this workspace has access to, so it can differ between workspaces.

    - `rate_limit_id: string`

      The `id` of the organization's RateLimit entry this entry applies to.

    - `workspace_id: string`

      ID of the Workspace this entry applies to.

  - `next_page: string`

    Opaque cursor for the next page of results, or `null` when no entries remain beyond this response.

## Example

```bash
ant organization:workspaces:rate-limits list \
  --workspace-id workspace_id
```

### Response (200)

```json
{
  "data": [
    {
      "group": {
        "id": "id",
        "display_name": "display_name",
        "type": "model_group"
      },
      "limits": [
        {
          "org_limit": 0,
          "source": {
            "type": "workspace"
          },
          "type": "type",
          "value": 0
        }
      ],
      "models": [
        "string"
      ],
      "rate_limit_id": "rate_limit_id",
      "type": "workspace_rate_limit",
      "workspace_id": "workspace_id"
    }
  ],
  "next_page": "next_page"
}
```
