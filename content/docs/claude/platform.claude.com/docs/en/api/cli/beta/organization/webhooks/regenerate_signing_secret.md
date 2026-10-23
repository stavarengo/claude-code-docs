---
title: Regenerate Organization Webhook Endpoint Signing Secret
url: https://platform.claude.com/docs/en/api/cli/beta/organization/webhooks/regenerate_signing_secret
---

# Regenerate Organization Webhook Endpoint Signing Secret

`$ ant beta:organization:webhooks regenerate-signing-secret`

**POST** `/v1/organizations/webhooks/{webhook_endpoint_id}/regenerate_signing_secret`

Replace an organization webhook endpoint's signing secret. The old secret stops
working immediately. The new secret is returned only in this response.

Every request must include the beta header `anthropic-beta: webhooks-2026-10-07`. A request without it returns `404`, exactly as if this API did not exist. Anthropic turns organization webhook endpoints on for each organization; until yours is on, requests also return `404`. Organization webhook endpoints are in beta and are not available to organizations with HIPAA readiness enabled.

## Parameters

- `--webhook-endpoint-id: string` (path parameter)

  ID of the webhook endpoint.

  maxLength: 2048

- `--beta: optional array of AnthropicBeta` (header parameter)

  This endpoint is in beta: requests must send `webhooks-2026-10-07` in this header.

## Returns

- `beta_organization_webhook_endpoint_signing_secret: object`

  An organization webhook endpoint's new signing secret.

  - `signing_secret: string`

    The new signing secret. Deliveries are signed with it from now on, and no other response returns it.

## Example

```bash
ant beta:organization:webhooks regenerate-signing-secret \
  --webhook-endpoint-id webhook_endpoint_id
```

### Response (200)

```json
{
  "signing_secret": "signing_secret"
}
```
