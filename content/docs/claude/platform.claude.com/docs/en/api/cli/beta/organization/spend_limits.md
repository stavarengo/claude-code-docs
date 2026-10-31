---
title: Spend Limits
url: https://platform.claude.com/docs/en/api/cli/beta/organization/spend_limits
---

# Spend Limits

## Set Spend Limit

`$ ant beta:organization:spend-limits set`

**POST** `/v1/organizations/spend_limits`

Set a spend limit.

Upsert keyed on (scope, period): setting a limit that already exists
overwrites it in place. A Claude Enterprise organization sets `user`
limits. Its seat-tier, group, and organization-level defaults are configured
in claude.ai. A Claude Console organization sets `organization` and
`workspace` limits, which are monthly and always carry an amount. Setting those
limits is in an early access preview. To request access, contact your
Anthropic account team.

### Parameters

- `--amount: string`

  Limit amount as a non-negative integer decimal string in the minor unit of the organization's billing currency (cents for USD): "50000" is $500.00. `null` sets an explicit no-limit override for this scope and `period` only — each period resolves independently, so caps for other periods still apply.

- `--scope: BetaSpendLimitUserScope or BetaSpendLimitOrganizationScope or BetaSpendLimitWorkspaceScope`

  What the limit applies to. Claude Enterprise organizations set `user` limits. Claude Console organizations set `organization` and `workspace` limits. Any other combination returns 400. Setting `organization` and `workspace` limits through the API is in an early access preview. To request access, contact your Anthropic account team.

- `--period: optional "daily" or "monthly" or "weekly"`

- `--beta: optional array of AnthropicBeta` (header parameter)

  Optional header to specify the beta version(s) you want to use.

### Returns

- `beta_spend_limit: object`

  A configured spend limit: a cap on metered spend for one scope and period.

  - `type: "spend_limit"`

    Object type. Always `spend_limit`.

  - `id: string`

    Unique tagged ID of the spend limit (`spl_...`).

  - `amount: string`

    Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

  - `created_at: string`

    RFC 3339 datetime at which the spend limit was created.

    format: date-time

  - `currency: string`

    ISO 4217 code of the organization's billing currency; the unit for `amount`.

  - `is_enabled: boolean`

    Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

  - `period: "daily" or "monthly" or "weekly"`

    Length of the window the limit resets over. `amount` caps spend within each period.

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

    What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

      - `type: "user"`

        Scope type. Always `user` for this scope.

      - `user_id: string`

        Tagged ID of the member the spend limit applies to.

    - `beta_spend_limit_seat_tier_scope: object`

      - `type: "seat_tier"`

      - `seat_tier: string`

    - `beta_spend_limit_rbac_group_scope: object`

      - `type: "rbac_group"`

      - `rbac_group_id: string`

    - `beta_spend_limit_organization_service_scope: object`

      - `type: "organization_service"`

      - `service: string`

    - `beta_spend_limit_organization_scope: object`

      - `type: "organization"`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

      - `type: "workspace"`

        Scope type. Always `workspace` for this scope.

      - `workspace_id: string`

        Tagged ID of the workspace the spend limit applies to.

    - `beta_spend_limit_usage_tier_scope: object`

      Scope of the monthly spend cap Anthropic sets for a Claude Console
      organization from its usage tier, or a higher cap Anthropic granted the
      organization. Read-only; its `created_at` and `updated_at` are the
      organization's creation time, so `amount` can change while `updated_at` stays
      the same.

      - `type: "usage_tier"`

        Scope type. Always `usage_tier` for this scope.

  - `updated_at: string`

    RFC 3339 datetime at which the spend limit was last modified.

    format: date-time

### Example

```bash
ant beta:organization:spend-limits set \
  --amount 50000 \
  --scope '{type: user, user_id: user_01WxYzAbCdEfGhJkMnPqRsTu}'
```

#### Response (200)

```json
{
  "id": "id",
  "amount": "50000",
  "created_at": "2019-12-27T18:11:19.117Z",
  "currency": "USD",
  "is_enabled": true,
  "period": "daily",
  "scope": {
    "type": "user",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "type": "spend_limit",
  "updated_at": "2019-12-27T18:11:19.117Z"
}
```

## Get Spend Limit

`$ ant beta:organization:spend-limits retrieve`

**GET** `/v1/organizations/spend_limits/{spend_limit_id}`

Retrieve a spend limit by ID.

### Parameters

- `--spend-limit-id: string` (path parameter)

  ID of the Spend Limit.

### Returns

- `beta_spend_limit: object`

  A configured spend limit: a cap on metered spend for one scope and period.

  - `type: "spend_limit"`

    Object type. Always `spend_limit`.

  - `id: string`

    Unique tagged ID of the spend limit (`spl_...`).

  - `amount: string`

    Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

  - `created_at: string`

    RFC 3339 datetime at which the spend limit was created.

    format: date-time

  - `currency: string`

    ISO 4217 code of the organization's billing currency; the unit for `amount`.

  - `is_enabled: boolean`

    Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

  - `period: "daily" or "monthly" or "weekly"`

    Length of the window the limit resets over. `amount` caps spend within each period.

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

    What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

      - `type: "user"`

        Scope type. Always `user` for this scope.

      - `user_id: string`

        Tagged ID of the member the spend limit applies to.

    - `beta_spend_limit_seat_tier_scope: object`

      - `type: "seat_tier"`

      - `seat_tier: string`

    - `beta_spend_limit_rbac_group_scope: object`

      - `type: "rbac_group"`

      - `rbac_group_id: string`

    - `beta_spend_limit_organization_service_scope: object`

      - `type: "organization_service"`

      - `service: string`

    - `beta_spend_limit_organization_scope: object`

      - `type: "organization"`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

      - `type: "workspace"`

        Scope type. Always `workspace` for this scope.

      - `workspace_id: string`

        Tagged ID of the workspace the spend limit applies to.

    - `beta_spend_limit_usage_tier_scope: object`

      Scope of the monthly spend cap Anthropic sets for a Claude Console
      organization from its usage tier, or a higher cap Anthropic granted the
      organization. Read-only; its `created_at` and `updated_at` are the
      organization's creation time, so `amount` can change while `updated_at` stays
      the same.

      - `type: "usage_tier"`

        Scope type. Always `usage_tier` for this scope.

  - `updated_at: string`

    RFC 3339 datetime at which the spend limit was last modified.

    format: date-time

### Example

```bash
ant beta:organization:spend-limits retrieve \
  --spend-limit-id spend_limit_id
```

#### Response (200)

```json
{
  "id": "id",
  "amount": "50000",
  "created_at": "2019-12-27T18:11:19.117Z",
  "currency": "USD",
  "is_enabled": true,
  "period": "daily",
  "scope": {
    "type": "user",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "type": "spend_limit",
  "updated_at": "2019-12-27T18:11:19.117Z"
}
```

## Delete Spend Limit

`$ ant beta:organization:spend-limits delete`

**DELETE** `/v1/organizations/spend_limits/{spend_limit_id}`

Delete a spend limit.

For a Claude Enterprise organization, this deletes a per-user override, and
the member falls back to any inherited spend limit at that period. Its
seat-tier, group, and organization-level rows cannot be deleted via this
endpoint. A Claude Console organization deletes its organization and
workspace limits, but not its `usage_tier` limit. Deleting organization and
workspace limits through the API is in an early access preview.

### Parameters

- `--spend-limit-id: string` (path parameter)

  ID of the Spend Limit.

### Returns

- `BetaOrganizationSpendLimitDeleteResponse: object`

  - `type: "spend_limit_deleted"`

  - `id: string`

### Example

```bash
ant beta:organization:spend-limits delete \
  --spend-limit-id spend_limit_id
```

#### Response (200)

```json
{
  "id": "id",
  "type": "spend_limit_deleted"
}
```

## List Spend Limits

`$ ant beta:organization:spend-limits list`

**GET** `/v1/organizations/spend_limits`

List the organization's spend limits.

A Claude Console organization's limits, including any read-only `usage_tier`
limit, come newest first. Listing them is in an early access preview. To
request access, contact your Anthropic account team. A Claude Enterprise
organization's limits are grouped by scope type, in the order `organization`,
`seat_tier`, `rbac_group`, `organization_service`, `user`; within a type they
come in a fixed order that is not creation order.

### Parameters

- `--limit: optional number` (query parameter)

  Maximum number of limits per page. Defaults to `20`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--scope-type: optional array of "organization" or "organization_service" or "rbac_group" or 4 more` (query parameter)

  Return only limits with these scope types. Omit for all. A scope type that doesn't apply to the organization gets a 400 error.

  maxItems: 100

- `--workspace-id: optional string` (query parameter)

  Return only the limits whose `scope.workspace_id` is this workspace (`wrkspc_...`). Claude Console organizations only; other organizations get a 400 error.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `spend-limit-reads-2026-09-26` in this header.

### Returns

- `BetaListSpendLimitsResponse: object`

  - `data: array of BetaSpendLimit`

    - `type: "spend_limit"`

      Object type. Always `spend_limit`.

    - `id: string`

      Unique tagged ID of the spend limit (`spl_...`).

    - `amount: string`

      Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

    - `created_at: string`

      RFC 3339 datetime at which the spend limit was created.

      format: date-time

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount`.

    - `is_enabled: boolean`

      Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

    - `period: "daily" or "monthly" or "weekly"`

      Length of the window the limit resets over. `amount` caps spend within each period.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

        - `type: "usage_tier"`

          Scope type. Always `usage_tier` for this scope.

    - `updated_at: string`

      RFC 3339 datetime at which the spend limit was last modified.

      format: date-time

  - `next_page: string`

### Example

```bash
ant beta:organization:spend-limits list
```

#### Response (200)

```json
{
  "data": [
    {
      "id": "id",
      "amount": "50000",
      "created_at": "2019-12-27T18:11:19.117Z",
      "currency": "USD",
      "is_enabled": true,
      "period": "daily",
      "scope": {
        "type": "user",
        "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
      },
      "type": "spend_limit",
      "updated_at": "2019-12-27T18:11:19.117Z"
    }
  ],
  "next_page": "next_page"
}
```

## Domain types

### Beta Spend Limit

- `beta_spend_limit: object`

  A configured spend limit: a cap on metered spend for one scope and period.

  - `type: "spend_limit"`

    Object type. Always `spend_limit`.

  - `id: string`

    Unique tagged ID of the spend limit (`spl_...`).

  - `amount: string`

    Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

  - `created_at: string`

    RFC 3339 datetime at which the spend limit was created.

    format: date-time

  - `currency: string`

    ISO 4217 code of the organization's billing currency; the unit for `amount`.

  - `is_enabled: boolean`

    Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

  - `period: "daily" or "monthly" or "weekly"`

    Length of the window the limit resets over. `amount` caps spend within each period.

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

    What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

      - `type: "user"`

        Scope type. Always `user` for this scope.

      - `user_id: string`

        Tagged ID of the member the spend limit applies to.

    - `beta_spend_limit_seat_tier_scope: object`

      - `type: "seat_tier"`

      - `seat_tier: string`

    - `beta_spend_limit_rbac_group_scope: object`

      - `type: "rbac_group"`

      - `rbac_group_id: string`

    - `beta_spend_limit_organization_service_scope: object`

      - `type: "organization_service"`

      - `service: string`

    - `beta_spend_limit_organization_scope: object`

      - `type: "organization"`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

      - `type: "workspace"`

        Scope type. Always `workspace` for this scope.

      - `workspace_id: string`

        Tagged ID of the workspace the spend limit applies to.

    - `beta_spend_limit_usage_tier_scope: object`

      Scope of the monthly spend cap Anthropic sets for a Claude Console
      organization from its usage tier, or a higher cap Anthropic granted the
      organization. Read-only; its `created_at` and `updated_at` are the
      organization's creation time, so `amount` can change while `updated_at` stays
      the same.

      - `type: "usage_tier"`

        Scope type. Always `usage_tier` for this scope.

  - `updated_at: string`

    RFC 3339 datetime at which the spend limit was last modified.

    format: date-time

### Beta Spend Limit Organization Scope

- `beta_spend_limit_organization_scope: object`

  - `type: "organization"`

### Beta Spend Limit Organization Service Scope

- `beta_spend_limit_organization_service_scope: object`

  - `type: "organization_service"`

  - `service: string`

### Beta Spend Limit Period

- `beta_spend_limit_period: "daily" or "monthly" or "weekly"`

  - `"daily"`

  - `"monthly"`

  - `"weekly"`

### Beta Spend Limit RBAC Group Scope

- `beta_spend_limit_rbac_group_scope: object`

  - `type: "rbac_group"`

  - `rbac_group_id: string`

### Beta Spend Limit Scoped API Key Actor

- `beta_spend_limit_scoped_api_key_actor: object`

  A scoped Admin API key acting on behalf of the organization.

  - `type: "scoped_api_key_actor"`

  - `scoped_api_key_id: string`

### Beta Spend Limit Seat Tier Scope

- `beta_spend_limit_seat_tier_scope: object`

  - `type: "seat_tier"`

  - `seat_tier: string`

### Beta Spend Limit Usage Tier Scope

- `beta_spend_limit_usage_tier_scope: object`

  Scope of the monthly spend cap Anthropic sets for a Claude Console
  organization from its usage tier, or a higher cap Anthropic granted the
  organization. Read-only; its `created_at` and `updated_at` are the
  organization's creation time, so `amount` can change while `updated_at` stays
  the same.

  - `type: "usage_tier"`

    Scope type. Always `usage_tier` for this scope.

### Beta Spend Limit User Actor

- `beta_spend_limit_user_actor: object`

  A user within the organization. `name` and `email_address` are
  null when the underlying account is unavailable or has been deleted;
  `deleted` is true only for deleted accounts.

  - `type: "user_actor"`

    Actor type. Always `user_actor`.

  - `deleted: boolean`

    True only when the underlying account has been deleted.

  - `email_address: string`

    The user's email address. Null when the account is unavailable or has been deleted.

  - `name: string`

    The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

  - `user_id: string`

    Tagged ID of the user.

### Beta Spend Limit User Scope

- `beta_spend_limit_user_scope: object`

  Scope selecting a single member of the organization.

  - `type: "user"`

    Scope type. Always `user` for this scope.

  - `user_id: string`

    Tagged ID of the member the spend limit applies to.

### Beta Spend Limit Workspace Scope

- `beta_spend_limit_workspace_scope: object`

  Scope selecting one workspace of a Claude Console organization.

  - `type: "workspace"`

    Scope type. Always `workspace` for this scope.

  - `workspace_id: string`

    Tagged ID of the workspace the spend limit applies to.

### Beta Spend Summary

- `beta_spend_summary: object`

  Per-member effective-limit report row (`GET /spend_limits/effective`).

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `amount: string`

    Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

  - `currency: string`

    ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

  - `period: "daily" or "monthly" or "weekly"`

    Period this row's effective limit and spend are reported for.

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `period_to_date_spend: string`

    The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

  - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

      - `type: "user"`

        Scope type. Always `user` for this scope.

      - `user_id: string`

        Tagged ID of the member the spend limit applies to.

    - `beta_spend_limit_seat_tier_scope: object`

      - `type: "seat_tier"`

      - `seat_tier: string`

    - `beta_spend_limit_rbac_group_scope: object`

      - `type: "rbac_group"`

      - `rbac_group_id: string`

    - `beta_spend_limit_organization_service_scope: object`

      - `type: "organization_service"`

      - `service: string`

    - `beta_spend_limit_organization_scope: object`

      - `type: "organization"`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

      - `type: "workspace"`

        Scope type. Always `workspace` for this scope.

      - `workspace_id: string`

        Tagged ID of the workspace the spend limit applies to.

    - `beta_spend_limit_usage_tier_scope: object`

      Scope of the monthly spend cap Anthropic sets for a Claude Console
      organization from its usage tier, or a higher cap Anthropic granted the
      organization. Read-only; its `created_at` and `updated_at` are the
      organization's creation time, so `amount` can change while `updated_at` stays
      the same.

      - `type: "usage_tier"`

        Scope type. Always `usage_tier` for this scope.

  - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

    - `beta_spend_limit_user_scope: object`

      Scope selecting a single member of the organization.

    - `beta_spend_limit_seat_tier_scope: object`

    - `beta_spend_limit_rbac_group_scope: object`

    - `beta_spend_limit_organization_service_scope: object`

    - `beta_spend_limit_organization_scope: object`

    - `beta_spend_limit_workspace_scope: object`

      Scope selecting one workspace of a Claude Console organization.

    - `beta_spend_limit_usage_tier_scope: object`

      Scope of the monthly spend cap Anthropic sets for a Claude Console
      organization from its usage tier, or a higher cap Anthropic granted the
      organization. Read-only; its `created_at` and `updated_at` are the
      organization's creation time, so `amount` can change while `updated_at` stays
      the same.

  - `spend_limit_id: string`

## Spend Limits › Effective

### List Effective Spend Limits

`$ ant beta:organization:spend-limits:effective list`

**GET** `/v1/organizations/spend_limits/effective`

List each member's effective spend limit and period-to-date spend.

Returns one row per (member, period) the member resolves a spend limit
for, with the `source` scope the spend limit was inherited from.
Paginates by member, so a member's periods never split across pages.
Supported for Claude Enterprise organizations only, not for Claude Console
organizations.

#### Parameters

- `--limit: optional number` (query parameter)

  Maximum number of members per page. A member's period rows never split across pages, so a page may carry more rows than this. Defaults to `20`.

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page` field.

- `--period: optional array of "daily" or "monthly" or "weekly"` (query parameter)

  Restrict the report to these limit periods. Omit to return one row per period each member resolves a spend limit for.

  maxItems: 3

- `--user-id: optional array of string` (query parameter)

  Restrict the report to these members, by tagged user ID (`user_...`). At most 100 entries.

  maxItems: 100

#### Returns

- `BetaListEffectiveSpendLimitsResponse: object`

  - `data: array of BetaSpendSummary`

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

        - `type: "user_actor"`

          Actor type. Always `user_actor`.

        - `deleted: boolean`

          True only when the underlying account has been deleted.

        - `email_address: string`

          The user's email address. Null when the account is unavailable or has been deleted.

        - `name: string`

          The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

        - `user_id: string`

          Tagged ID of the user.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

        - `type: "scoped_api_key_actor"`

        - `scoped_api_key_id: string`

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

        - `type: "usage_tier"`

          Scope type. Always `usage_tier` for this scope.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

    - `spend_limit_id: string`

  - `next_page: string`

#### Example

```bash
ant beta:organization:spend-limits:effective list
```

##### Response (200)

```json
{
  "data": [
    {
      "actor": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
      },
      "amount": "50000",
      "currency": "USD",
      "period": "daily",
      "period_to_date_spend": "12050.5",
      "scope": {
        "type": "user",
        "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
      },
      "source": {
        "type": "user",
        "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
      },
      "spend_limit_id": "spend_limit_id"
    }
  ],
  "next_page": "next_page"
}
```

## Spend Limits › Increase Requests

### List Spend Limit Increase Requests

`$ ant beta:organization:spend-limits:increase-requests list`

**GET** `/v1/organizations/spend_limit_increase_requests`

List spend limit increase requests, most recent first.

Pending requests include a live `spend_summary` for the requester.
Requests whose requester is no longer a member are excluded.

#### Parameters

- `--actor-id: optional array of string` (query parameter)

  Filter by requester, as `user_...` tagged IDs.

- `--limit: optional number` (query parameter)

  minimum: 1, maximum: 1000

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

- `--status: optional array of BetaSpendLimitIncreaseRequestStatus` (query parameter)

  Filter by status. Omit to return all.

#### Returns

- `BetaSpendLimitIncreaseRequestListResponse: object`

  - `data: array of BetaSpendLimitIncreaseRequest`

    - `type: "spend_limit_increase_request"`

    - `id: string`

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

        - `type: "user_actor"`

          Actor type. Always `user_actor`.

        - `deleted: boolean`

          True only when the underlying account has been deleted.

        - `email_address: string`

          The user's email address. Null when the account is unavailable or has been deleted.

        - `name: string`

          The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

        - `user_id: string`

          Tagged ID of the user.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

        - `type: "scoped_api_key_actor"`

        - `scoped_api_key_id: string`

    - `created_at: string`

      format: date-time

    - `period: "daily" or "monthly" or "weekly"`

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `resolved_at: string`

      format: date-time

    - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `spend_summary: object`

      Per-member effective-limit report row (`GET /spend_limits/effective`).

      - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

        - `beta_spend_limit_user_actor: object`

          A user within the organization. `name` and `email_address` are
          null when the underlying account is unavailable or has been deleted;
          `deleted` is true only for deleted accounts.

        - `beta_spend_limit_scoped_api_key_actor: object`

          A scoped Admin API key acting on behalf of the organization.

      - `amount: string`

        Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

      - `currency: string`

        ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

      - `period: "daily" or "monthly" or "weekly"`

        Period this row's effective limit and spend are reported for.

        - `"daily"`

        - `"monthly"`

        - `"weekly"`

      - `period_to_date_spend: string`

        The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

      - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

        - `beta_spend_limit_user_scope: object`

          Scope selecting a single member of the organization.

          - `type: "user"`

            Scope type. Always `user` for this scope.

          - `user_id: string`

            Tagged ID of the member the spend limit applies to.

        - `beta_spend_limit_seat_tier_scope: object`

          - `type: "seat_tier"`

          - `seat_tier: string`

        - `beta_spend_limit_rbac_group_scope: object`

          - `type: "rbac_group"`

          - `rbac_group_id: string`

        - `beta_spend_limit_organization_service_scope: object`

          - `type: "organization_service"`

          - `service: string`

        - `beta_spend_limit_organization_scope: object`

          - `type: "organization"`

        - `beta_spend_limit_workspace_scope: object`

          Scope selecting one workspace of a Claude Console organization.

          - `type: "workspace"`

            Scope type. Always `workspace` for this scope.

          - `workspace_id: string`

            Tagged ID of the workspace the spend limit applies to.

        - `beta_spend_limit_usage_tier_scope: object`

          Scope of the monthly spend cap Anthropic sets for a Claude Console
          organization from its usage tier, or a higher cap Anthropic granted the
          organization. Read-only; its `created_at` and `updated_at` are the
          organization's creation time, so `amount` can change while `updated_at` stays
          the same.

          - `type: "usage_tier"`

            Scope type. Always `usage_tier` for this scope.

      - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

        - `beta_spend_limit_user_scope: object`

          Scope selecting a single member of the organization.

        - `beta_spend_limit_seat_tier_scope: object`

        - `beta_spend_limit_rbac_group_scope: object`

        - `beta_spend_limit_organization_service_scope: object`

        - `beta_spend_limit_organization_scope: object`

        - `beta_spend_limit_workspace_scope: object`

          Scope selecting one workspace of a Claude Console organization.

        - `beta_spend_limit_usage_tier_scope: object`

          Scope of the monthly spend cap Anthropic sets for a Claude Console
          organization from its usage tier, or a higher cap Anthropic granted the
          organization. Read-only; its `created_at` and `updated_at` are the
          organization's creation time, so `amount` can change while `updated_at` stays
          the same.

      - `spend_limit_id: string`

    - `status: "approved" or "denied" or "pending"`

      - `"approved"`

      - `"denied"`

      - `"pending"`

  - `next_page: string`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests list
```

##### Response (200)

```json
{
  "data": [
    {
      "id": "id",
      "actor": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
      },
      "created_at": "2019-12-27T18:11:19.117Z",
      "period": "daily",
      "resolved_at": "2019-12-27T18:11:19.117Z",
      "resolved_by": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
      },
      "spend_summary": {
        "actor": {
          "deleted": true,
          "email_address": "email_address",
          "name": "name",
          "type": "user_actor",
          "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
        },
        "amount": "50000",
        "currency": "USD",
        "period": "daily",
        "period_to_date_spend": "12050.5",
        "scope": {
          "type": "user",
          "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
        },
        "source": {
          "type": "user",
          "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
        },
        "spend_limit_id": "spend_limit_id"
      },
      "status": "approved",
      "type": "spend_limit_increase_request"
    }
  ],
  "next_page": "next_page"
}
```

### Get Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests retrieve`

**GET** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}`

Retrieve a spend limit increase request.

While `pending`, the response includes a live `spend_summary` for the
requester at the request's period.

#### Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

#### Returns

- `beta_spend_limit_increase_request: object`

  - `type: "spend_limit_increase_request"`

  - `id: string`

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `created_at: string`

    format: date-time

  - `period: "daily" or "monthly" or "weekly"`

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `resolved_at: string`

    format: date-time

  - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

  - `spend_summary: object`

    Per-member effective-limit report row (`GET /spend_limits/effective`).

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

        - `type: "usage_tier"`

          Scope type. Always `usage_tier` for this scope.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

    - `spend_limit_id: string`

  - `status: "approved" or "denied" or "pending"`

    - `"approved"`

    - `"denied"`

    - `"pending"`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests retrieve \
  --spend-limit-increase-request-id spend_limit_increase_request_id
```

##### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "spend_summary": {
    "actor": {
      "deleted": true,
      "email_address": "email_address",
      "name": "name",
      "type": "user_actor",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "amount": "50000",
    "currency": "USD",
    "period": "daily",
    "period_to_date_spend": "12050.5",
    "scope": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "source": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "spend_limit_id": "spend_limit_id"
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```

### Approve Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests approve`

**POST** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}/approve`

Approve a pending spend limit increase request.

Writes a per-user spend limit at `amount` for the requester and
transitions the request to `approved`. `period` defaults to the period
the member was blocked on. Anthropic emails the requester unless
`suppress_notification` is set.

#### Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

- `--amount: string`

  New per-user spend limit as a non-negative integer decimal string (minor units).

- `--period: optional "daily" or "monthly" or "weekly"`

- `--suppress-notification: optional boolean`

#### Returns

- `BetaOrganizationSpendLimitIncreaseRequestApproveResponse: object`

  - `type: "spend_limit_increase_request"`

  - `id: string`

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `created_at: string`

    format: date-time

  - `period: "daily" or "monthly" or "weekly"`

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `resolved_at: string`

    format: date-time

  - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

  - `spend_limit: object`

    A configured spend limit: a cap on metered spend for one scope and period.

    - `type: "spend_limit"`

      Object type. Always `spend_limit`.

    - `id: string`

      Unique tagged ID of the spend limit (`spl_...`).

    - `amount: string`

      Limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD): "50000" is $500.00. `null` means no numeric cap is configured at this scope — see the effective report for whether a limit applies.

    - `created_at: string`

      RFC 3339 datetime at which the spend limit was created.

      format: date-time

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount`.

    - `is_enabled: boolean`

      Read-only. `false` when extra usage is switched off for this organization (`organization` limit); `amount` is kept and applies again when it's switched back on. Always `true` for other limits.

    - `period: "daily" or "monthly" or "weekly"`

      Length of the window the limit resets over. `amount` caps spend within each period.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      What the limit applies to. A tagged union on `type`; each variant carries the identifier for its scope.

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

        - `type: "usage_tier"`

          Scope type. Always `usage_tier` for this scope.

    - `updated_at: string`

      RFC 3339 datetime at which the spend limit was last modified.

      format: date-time

  - `spend_summary: object`

    Per-member effective-limit report row (`GET /spend_limits/effective`).

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

    - `spend_limit_id: string`

  - `status: "approved" or "denied" or "pending"`

    - `"approved"`

    - `"denied"`

    - `"pending"`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests approve \
  --spend-limit-increase-request-id spend_limit_increase_request_id \
  --amount 50000
```

##### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "spend_limit": {
    "id": "id",
    "amount": "50000",
    "created_at": "2019-12-27T18:11:19.117Z",
    "currency": "USD",
    "is_enabled": true,
    "period": "daily",
    "scope": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "type": "spend_limit",
    "updated_at": "2019-12-27T18:11:19.117Z"
  },
  "spend_summary": {
    "actor": {
      "deleted": true,
      "email_address": "email_address",
      "name": "name",
      "type": "user_actor",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "amount": "50000",
    "currency": "USD",
    "period": "daily",
    "period_to_date_spend": "12050.5",
    "scope": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "source": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "spend_limit_id": "spend_limit_id"
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```

### Deny Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests deny`

**POST** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}/deny`

Deny a pending spend limit increase request.

Idempotent on `denied`; denying an already-`approved` request returns
400. Anthropic emails the requester unless `suppress_notification` is set.

#### Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

- `--suppress-notification: optional boolean`

#### Returns

- `beta_spend_limit_increase_request: object`

  - `type: "spend_limit_increase_request"`

  - `id: string`

  - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

      - `type: "user_actor"`

        Actor type. Always `user_actor`.

      - `deleted: boolean`

        True only when the underlying account has been deleted.

      - `email_address: string`

        The user's email address. Null when the account is unavailable or has been deleted.

      - `name: string`

        The user's current display name. Null when the account is unavailable, has been deleted, or has no name set.

      - `user_id: string`

        Tagged ID of the user.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

      - `type: "scoped_api_key_actor"`

      - `scoped_api_key_id: string`

  - `created_at: string`

    format: date-time

  - `period: "daily" or "monthly" or "weekly"`

    - `"daily"`

    - `"monthly"`

    - `"weekly"`

  - `resolved_at: string`

    format: date-time

  - `resolved_by: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

    - `beta_spend_limit_user_actor: object`

      A user within the organization. `name` and `email_address` are
      null when the underlying account is unavailable or has been deleted;
      `deleted` is true only for deleted accounts.

    - `beta_spend_limit_scoped_api_key_actor: object`

      A scoped Admin API key acting on behalf of the organization.

  - `spend_summary: object`

    Per-member effective-limit report row (`GET /spend_limits/effective`).

    - `actor: BetaSpendLimitUserActor or BetaSpendLimitScopedAPIKeyActor`

      - `beta_spend_limit_user_actor: object`

        A user within the organization. `name` and `email_address` are
        null when the underlying account is unavailable or has been deleted;
        `deleted` is true only for deleted accounts.

      - `beta_spend_limit_scoped_api_key_actor: object`

        A scoped Admin API key acting on behalf of the organization.

    - `amount: string`

      Effective limit amount as a non-negative integer decimal string in the minor unit of `currency` (cents for USD). `null` means no limit applies for this row's `period` — each period resolves independently, so another period may still cap this member.

    - `currency: string`

      ISO 4217 code of the organization's billing currency; the unit for `amount` and `period_to_date_spend`.

    - `period: "daily" or "monthly" or "weekly"`

      Period this row's effective limit and spend are reported for.

      - `"daily"`

      - `"monthly"`

      - `"weekly"`

    - `period_to_date_spend: string`

      The member's spend so far in the current period, as a non-negative decimal string in the minor unit of `currency` (cents for USD). May carry fractional minor units up to three decimal places (e.g. `"12050.5"`) — metered usage is not rounded to whole cents. Reads as `"0"` when the spend reading is temporarily unavailable.

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

        - `type: "user"`

          Scope type. Always `user` for this scope.

        - `user_id: string`

          Tagged ID of the member the spend limit applies to.

      - `beta_spend_limit_seat_tier_scope: object`

        - `type: "seat_tier"`

        - `seat_tier: string`

      - `beta_spend_limit_rbac_group_scope: object`

        - `type: "rbac_group"`

        - `rbac_group_id: string`

      - `beta_spend_limit_organization_service_scope: object`

        - `type: "organization_service"`

        - `service: string`

      - `beta_spend_limit_organization_scope: object`

        - `type: "organization"`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

        - `type: "workspace"`

          Scope type. Always `workspace` for this scope.

        - `workspace_id: string`

          Tagged ID of the workspace the spend limit applies to.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

        - `type: "usage_tier"`

          Scope type. Always `usage_tier` for this scope.

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 4 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

      - `beta_spend_limit_usage_tier_scope: object`

        Scope of the monthly spend cap Anthropic sets for a Claude Console
        organization from its usage tier, or a higher cap Anthropic granted the
        organization. Read-only; its `created_at` and `updated_at` are the
        organization's creation time, so `amount` can change while `updated_at` stays
        the same.

    - `spend_limit_id: string`

  - `status: "approved" or "denied" or "pending"`

    - `"approved"`

    - `"denied"`

    - `"pending"`

#### Example

```bash
ant beta:organization:spend-limits:increase-requests deny \
  --spend-limit-increase-request-id spend_limit_increase_request_id
```

##### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
  },
  "spend_summary": {
    "actor": {
      "deleted": true,
      "email_address": "email_address",
      "name": "name",
      "type": "user_actor",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "amount": "50000",
    "currency": "USD",
    "period": "daily",
    "period_to_date_spend": "12050.5",
    "scope": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "source": {
      "type": "user",
      "user_id": "user_01WxYzAbCdEfGhJkMnPqRsTu"
    },
    "spend_limit_id": "spend_limit_id"
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```
