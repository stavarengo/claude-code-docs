---
title: Webhooks
url: https://platform.claude.com/docs/en/api/cli/beta/organization/webhooks
---

# Webhooks

## Create Organization Webhook Endpoint

`$ ant beta:organization:webhooks create`

**POST** `/v1/organizations/webhooks`

Create an organization webhook endpoint.

An organization webhook endpoint belongs to the organization rather than to one of its workspaces. An organization can have at most 32 organization
webhook endpoints, enabled or disabled.

The response includes the endpoint's signing secret. No read returns it, so store
it when you receive it.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

### Parameters

- `--enabled-event: array of "user_profile.enforcement_action_opened" or "user_profile.enforcement_action_resolved"`

  The event types to deliver to the endpoint. Must list at least one.

- `--url: string`

  The HTTPS URL that deliveries are sent to.

  minLength: 1

- `--description: optional string`

  Notes about the endpoint.

- `--name: optional string`

  A short label for the endpoint.

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

### Returns

- `beta_new_organization_webhook_endpoint: object`

  A new organization webhook endpoint, with its signing secret.

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

  - `signing_secret: string`

    The secret Anthropic signs deliveries to the endpoint with (prefix `whsec_`). No other response returns it, so store it now. To replace it, regenerate the signing secret.

  - `state: "disabled" or "enabled"`

    Whether deliveries are sent to the endpoint.

    - `"disabled"`

    - `"enabled"`

  - `updated_at: string`

    When the endpoint was last changed, in RFC 3339 format.

    format: date-time

  - `url: string`

    The HTTPS URL that deliveries are sent to.

### Example

```bash
ant beta:organization:webhooks create \
  --api-key my-anthropic-api-key \
  --enabled-event user_profile.enforcement_action_opened \
  --url x
```

#### Response (200)

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
  "signing_secret": "signing_secret",
  "state": "disabled",
  "updated_at": "2019-12-27T18:11:19.117Z",
  "url": "url"
}
```

## List Organization Webhook Endpoints

`$ ant beta:organization:webhooks list`

**GET** `/v1/organizations/webhooks`

List the organization's webhook endpoints.

An organization webhook endpoint belongs to the organization rather than to one of its workspaces. The list does not include webhook endpoints that
belong to a workspace.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

### Parameters

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

### Returns

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

### Example

```bash
ant beta:organization:webhooks list \
  --api-key my-anthropic-api-key
```

#### Response (200)

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

## Get Organization Webhook Endpoint

`$ ant beta:organization:webhooks retrieve`

**GET** `/v1/organizations/webhooks/{webhook_endpoint_id}`

Retrieve an organization webhook endpoint by ID.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

### Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

### Returns

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

### Example

```bash
ant beta:organization:webhooks retrieve \
  --api-key my-anthropic-api-key \
  --webhook-endpoint-id webhook_endpoint_id
```

#### Response (200)

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

## Update Organization Webhook Endpoint

`$ ant beta:organization:webhooks update`

**POST** `/v1/organizations/webhooks/{webhook_endpoint_id}`

Update an organization webhook endpoint. Only the fields you send are changed.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

### Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--description: optional string`

  Notes about the endpoint.

- `--enabled-event: optional array of "user_profile.enforcement_action_opened" or "user_profile.enforcement_action_resolved"`

  The event types to deliver to the endpoint. Replaces the whole set; an empty list leaves it unchanged.

- `--name: optional string`

  A short label for the endpoint.

- `--state: optional "disabled" or "enabled"`

  `disabled` stops deliveries. `enabled` resumes them and clears `disabled_reason`. Events that happen while the endpoint is disabled are never delivered.

- `--url: optional string`

  The HTTPS URL that deliveries are sent to.

  minLength: 1

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

### Returns

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

### Example

```bash
ant beta:organization:webhooks update \
  --api-key my-anthropic-api-key \
  --webhook-endpoint-id webhook_endpoint_id
```

#### Response (200)

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

## Delete Organization Webhook Endpoint

`$ ant beta:organization:webhooks delete`

**DELETE** `/v1/organizations/webhooks/{webhook_endpoint_id}`

Delete an organization webhook endpoint.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

### Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

### Returns

- `beta_deleted_organization_webhook_endpoint: object`

  A deleted organization webhook endpoint.

  - `type: "webhook_endpoint_deleted"`

    Always `webhook_endpoint_deleted`.

  - `id: string`

    ID of the deleted webhook endpoint.

### Example

```bash
ant beta:organization:webhooks delete \
  --api-key my-anthropic-api-key \
  --webhook-endpoint-id webhook_endpoint_id
```

#### Response (200)

```json
{
  "id": "id",
  "type": "webhook_endpoint_deleted"
}
```

## Regenerate Organization Webhook Endpoint Signing Secret

`$ ant beta:organization:webhooks regenerate-signing-secret`

**POST** `/v1/organizations/webhooks/{webhook_endpoint_id}/regenerate_signing_secret`

Replace an organization webhook endpoint's signing secret. The old secret stops
working immediately. The new secret is returned only in this response.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

### Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

### Returns

- `beta_organization_webhook_endpoint_signing_secret: object`

  An organization webhook endpoint's new signing secret.

  - `signing_secret: string`

    The new signing secret. Deliveries are signed with it from now on, and no other response returns it.

### Example

```bash
ant beta:organization:webhooks regenerate-signing-secret \
  --api-key my-anthropic-api-key \
  --webhook-endpoint-id webhook_endpoint_id
```

#### Response (200)

```json
{
  "signing_secret": "signing_secret"
}
```

## Domain types

### Beta Deleted Organization Webhook Endpoint

- `beta_deleted_organization_webhook_endpoint: object`

  A deleted organization webhook endpoint.

  - `type: "webhook_endpoint_deleted"`

    Always `webhook_endpoint_deleted`.

  - `id: string`

    ID of the deleted webhook endpoint.

### Beta New Organization Webhook Endpoint

- `beta_new_organization_webhook_endpoint: object`

  A new organization webhook endpoint, with its signing secret.

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

  - `signing_secret: string`

    The secret Anthropic signs deliveries to the endpoint with (prefix `whsec_`). No other response returns it, so store it now. To replace it, regenerate the signing secret.

  - `state: "disabled" or "enabled"`

    Whether deliveries are sent to the endpoint.

    - `"disabled"`

    - `"enabled"`

  - `updated_at: string`

    When the endpoint was last changed, in RFC 3339 format.

    format: date-time

  - `url: string`

    The HTTPS URL that deliveries are sent to.

### Beta Organization Webhook Endpoint

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

### Beta Organization Webhook Endpoint Signing Secret

- `beta_organization_webhook_endpoint_signing_secret: object`

  An organization webhook endpoint's new signing secret.

  - `signing_secret: string`

    The new signing secret. Deliveries are signed with it from now on, and no other response returns it.

### Beta Organization Webhook Endpoint State

- `beta_organization_webhook_endpoint_state: "disabled" or "enabled"`

  Whether deliveries are sent to an organization webhook endpoint.

  - `"disabled"`

  - `"enabled"`
