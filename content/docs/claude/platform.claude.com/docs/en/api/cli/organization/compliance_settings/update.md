---
title: Update Compliance Settings
url: https://platform.claude.com/docs/en/api/cli/organization/compliance_settings/update
---

# Update Compliance Settings

`$ ant organization:compliance-settings update`

**POST** `/v1/organizations/compliance_settings`

Update your organization's Compliance Settings.

Setting `state` to `enabled` turns on the Compliance API and begins
capturing organization activity events. Setting it to `disabled` turns
both off. Access Transparency events are an exception: they are still
captured while the Compliance API is disabled, and the Compliance API
activity feed returns them once it is enabled again. `state` reflects
whether the Compliance API is enabled.

A request that sets `state` to its current value succeeds and leaves the
resource unchanged. A `disabled` request stays in effect until a later
`enabled` request or the organization's next provisioning action that
enables Access Transparency: enabling Access Transparency also enables
the Compliance API, which serves its activity events, so such
provisioning (including re-runs) re-enables the Compliance API even
after a `disabled` request. Automated provisioning never disables
compliance settings.

## Parameters

- `--state: ComplianceSettingsStateParam`

  Desired state. Accepts the string shorthand "enabled" or "disabled" in place of the object form; the response always returns the canonical object form.

  - `compliance_settings_state_enabled_param: object`

    - `type: "enabled"`

  - `compliance_settings_state_disabled_param: object`

    - `type: "disabled"`

## Returns

- `organization_compliance_settings: object`

  - `type: "compliance_settings"`

  - `state: ComplianceSettingsStateEnabled or ComplianceSettingsStateDisabled`

    Whether the Compliance API is enabled for this organization.

    - `compliance_settings_state_enabled: object`

      - `type: "enabled"`

    - `compliance_settings_state_disabled: object`

      - `type: "disabled"`

## Errors

Any method can also return the general [HTTP errors](https://platform.claude.com/docs/en/api/errors?sdk_languages=cli).

Each code below is the value of `error.details.error_code` in the response body.

- `sandbox_egress_restricted` (HTTP status 403)

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

## Example

```bash
ant organization:compliance-settings update \
  --state '{type: enabled}'
```

### Response (200)

```json
{
  "state": {
    "type": "enabled"
  },
  "type": "compliance_settings"
}
```
