---
title: List Organization Webhook Endpoints
url: https://platform.claude.com/docs/en/api/cli/beta/organization/webhooks/list
---

# List Organization Webhook Endpoints

`$ ant beta:organization:webhooks list`

**GET** `/v1/organizations/webhooks`

List the organization's webhook endpoints.

An organization webhook endpoint belongs to the organization rather than to one of its workspaces. The list does not include webhook endpoints that
belong to a workspace.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

## Parameters

- `--after-id: optional string` (query parameter)

  ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

- `--before-id: optional string` (query parameter)

  ID of a webhook endpoint to use as a cursor. Returns the first `limit` endpoints that come before it in list order, not the `limit` endpoints just before it.

- `--limit: optional number` (query parameter)

  Number of items to return per page, up to `100`. The default, `0`, means `20`.

  minimum: 0, maximum: 100

- `--order: optional "asc" or "desc"` (query parameter)

  Sort order by `created_at`. Defaults to `desc`, newest first.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

## Returns

- `BetaOrganizationWebhookEndpointList: object`

  A page of organization webhook endpoints.

  - `data: array of BetaOrganizationWebhookEndpoint`

    The organization webhook endpoints on this page.

    - `id: string`

      ID of the webhook endpoint.

    - `created_at: string`

      When the endpoint was created, in RFC 3339 format.

      format: date-time

    - `description: string`

      Notes about the endpoint. An empty string when none were given.

    - `disabled_reason: string`

      Why Anthropic disabled the endpoint automatically. An empty string when the endpoint is enabled, or when you disabled it.

    - `enabled_events: array of "user_profile.enforcement_action_opened" or "user_profile.enforcement_action_resolved"`

      The event types delivered to the endpoint.

      - `"user_profile.enforcement_action_opened"`

      - `"user_profile.enforcement_action_resolved"`

    - `name: string`

      A short label for the endpoint. An empty string when none was given.

    - `state: "disabled" or "enabled"`

      Whether deliveries are sent to the endpoint.

      - `"disabled"`

      - `"enabled"`

    - `updated_at: string`

      When the endpoint was last changed, in RFC 3339 format.

      format: date-time

    - `url: string`

      The HTTPS URL that deliveries are sent to.

  - `has_more: boolean`

    Whether more endpoints follow this page in list order. With `before_id`, only endpoints before the cursor count.

  - `first_id: optional string`

    First ID in the `data` list.

  - `last_id: optional string`

    Last ID in the `data` list. Can be used as the `after_id` for the next page.

## Example

```bash
ant beta:organization:webhooks list \
  --api-key my-anthropic-api-key
```

### Response (200)

```json
{
  "data": [
    {
      "id": "id",
      "created_at": "2019-12-27T18:11:19.117Z",
      "description": "description",
      "disabled_reason": "disabled_reason",
      "enabled_events": [
        "user_profile.enforcement_action_opened"
      ],
      "name": "name",
      "state": "disabled",
      "updated_at": "2019-12-27T18:11:19.117Z",
      "url": "url"
    }
  ],
  "has_more": true,
  "first_id": "first_id",
  "last_id": "last_id"
}
```
