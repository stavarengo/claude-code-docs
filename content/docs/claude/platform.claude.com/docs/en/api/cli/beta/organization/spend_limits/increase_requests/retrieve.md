---
title: Get Spend Limit Increase Request
url: https://platform.claude.com/docs/en/api/cli/beta/organization/spend_limits/increase_requests/retrieve
---

# Get Spend Limit Increase Request

`$ ant beta:organization:spend-limits:increase-requests retrieve`

**GET** `/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}`

Retrieve a spend limit increase request.

While `pending`, the response includes a live `spend_summary` for the
requester at the request's period.

## Parameters

- `--spend-limit-increase-request-id: string` (path parameter)

  ID of the spend limit increase request.

## Returns

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

## Example

```bash
ant beta:organization:spend-limits:increase-requests retrieve \
  --api-key my-anthropic-api-key \
  --spend-limit-increase-request-id spend_limit_increase_request_id
```

### Response (200)

```json
{
  "id": "id",
  "actor": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "created_at": "2019-12-27T18:11:19.117Z",
  "period": "daily",
  "resolved_at": "2019-12-27T18:11:19.117Z",
  "resolved_by": {
    "deleted": true,
    "email_address": "email_address",
    "name": "name",
    "type": "user_actor",
    "user_id": "user_01WCz1FkmYMm4gnmykNKUu3Q"
  },
  "spend_summary": {
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
  },
  "status": "approved",
  "type": "spend_limit_increase_request"
}
```
