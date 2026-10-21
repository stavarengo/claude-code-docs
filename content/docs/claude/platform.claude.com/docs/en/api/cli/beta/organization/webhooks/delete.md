---
title: Delete Organization Webhook Endpoint
url: https://platform.claude.com/docs/en/api/cli/beta/organization/webhooks/delete
---

# Delete Organization Webhook Endpoint

`$ ant beta:organization:webhooks delete`

**DELETE** `/v1/organizations/webhooks/{webhook_endpoint_id}`

Delete an organization webhook endpoint.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

## Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

## Returns

- `beta_deleted_organization_webhook_endpoint: object`

  A deleted organization webhook endpoint.

  - `type: "webhook_endpoint_deleted"`

    Always `webhook_endpoint_deleted`.

  - `id: string`

    ID of the deleted webhook endpoint.

## Example

```bash
ant beta:organization:webhooks delete \
  --api-key my-anthropic-api-key \
  --webhook-endpoint-id webhook_endpoint_id
```

### Response (200)

```json
{
  "id": "id",
  "type": "webhook_endpoint_deleted"
}
```
