---
title: Set Workspace Rate Limits
url: https://platform.claude.com/docs/en/api/cli/organization/workspaces/rate_limits/update
---

# Set Workspace Rate Limits

`$ ant organization:workspaces:rate-limits update`

**POST** `/v1/organizations/workspaces/{workspace_id}/rate_limits/{rate_limit_id}`

Set or clear rate-limit overrides for one rate-limit group in a workspace.

Only the limiter types named in `limits` change: an integer `value` sets
that type's override and `null` clears it. Types not named keep their
current value. A value above the organization's own limit is stored, but
the organization limit still applies, so the lower of the two is
enforced.

Returns the targeted group's entry with this request applied, in the shape
`GET /v1/organizations/workspaces/{workspace_id}/rate_limits` returns.
Changes take effect within about an hour.

## Parameters

- `--workspace-id: string` (path parameter)

  The ID of the workspace.

- `--rate-limit-id: string` (path parameter)

  The `id` of the organization's rate-limit entry to set overrides for.

- `--limit: array of WorkspaceRateLimitUpdateValue`

  Limits to set or clear. Unspecified limit types are unchanged.

  minItems: 1, maxItems: 16

## Returns

- `workspace_rate_limit: object`

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

## Example

```bash
ant organization:workspaces:rate-limits update \
  --workspace-id workspace_id \
  --rate-limit-id rate_limit_id \
  --limit '{type: fast_itpmca, value: 0}'
```

### Response (200)

```json
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
```
