---
title: List Effective Spend Limits
url: https://platform.claude.com/docs/en/api/cli/beta/organization/spend_limits/effective/list
---

# List Effective Spend Limits

`$ ant beta:organization:spend-limits:effective list`

**GET** `/v1/organizations/spend_limits/effective`

List each member's effective spend limit and period-to-date spend.

Returns one row per (member, period) the member resolves a spend limit
for, with the `source` scope the spend limit was inherited from.
Paginates by member, so a member's periods never split across pages.
Supported for Claude Enterprise organizations only, not for Claude Console
organizations.

## Parameters

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

## Returns

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

    - `scope: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

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

    - `source: BetaSpendLimitUserScope or BetaSpendLimitSeatTierScope or BetaSpendLimitRBACGroupScope or 3 more`

      - `beta_spend_limit_user_scope: object`

        Scope selecting a single member of the organization.

      - `beta_spend_limit_seat_tier_scope: object`

      - `beta_spend_limit_rbac_group_scope: object`

      - `beta_spend_limit_organization_service_scope: object`

      - `beta_spend_limit_organization_scope: object`

      - `beta_spend_limit_workspace_scope: object`

        Scope selecting one workspace of a Claude Console organization.

    - `spend_limit_id: string`

  - `next_page: string`

## Example

```bash
ant beta:organization:spend-limits:effective list \
  --api-key my-anthropic-api-key
```

### Response (200)

```json
{
  "data": [
    {
      "actor": {
        "deleted": true,
        "email_address": "email_address",
        "name": "name",
        "type": "user_actor",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "amount": "50000",
      "currency": "USD",
      "period": "daily",
      "period_to_date_spend": "12050.5",
      "scope": {
        "type": "user",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "source": {
        "type": "user",
        "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
      },
      "spend_limit_id": "spend_limit_id"
    }
  ],
  "next_page": "next_page"
}
```
