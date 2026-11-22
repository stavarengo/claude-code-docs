---
title: Validate External Key
url: https://platform.claude.com/docs/en/api/cli/organization/external_keys/validate
---

# Validate External Key

`$ ant organization:external-keys validate`

**POST** `/v1/organizations/external_keys/{external_key_id}/validate`

Validate an external key config against the customer's KMS.

Anthropic performs an encrypt/decrypt roundtrip against the configured
KMS key and waits up to 30 seconds for the result. The response status is
`success` if the roundtrip succeeded, or `failure` with an error
message if it failed or timed out.

## Parameters

- `--external-key-id: string` (path parameter)

  ID of the External Key.

  maxLength: 2048

## Returns

- `OrganizationExternalKeyValidateResponse: object`

  Result of a validation roundtrip against the customer's KMS.

  HTTP 200 for both outcomes — the operation completed; `status` says
  whether the key works.

  - `type: "external_key_validation"`

  - `error: string`

    Error message when status is `failure`. Null otherwise.

  - `status: "failure" or "success"`

    `success` — encrypt/decrypt roundtrip succeeded. `failure` — the roundtrip failed or timed out; see `error`.

    - `"failure"`

    - `"success"`

## Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

## Example

```bash
ant organization:external-keys validate \
  --external-key-id external_key_id
```

### Response (200)

```json
{
  "error": "error",
  "status": "failure",
  "type": "external_key_validation"
}
```
