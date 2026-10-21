---
title: Get Organization Webhook Endpoint
url: https://platform.claude.com/docs/en/api/cli/beta/organization/webhooks/retrieve
---

# Get Organization Webhook Endpoint

`$ ant beta:organization:webhooks retrieve`

**GET** `/v1/organizations/webhooks/{webhook_endpoint_id}`

Retrieve an organization webhook endpoint by ID.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

## Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

## Returns

- `beta_organization_webhook_endpoint: object`

  A webhook endpoint that belongs to the organization rather than to one of
  its workspaces.

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

## Example

```bash
ant beta:organization:webhooks retrieve \
  --api-key my-anthropic-api-key \
  --webhook-endpoint-id webhook_endpoint_id
```

### Response (200)

```json
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
```
