---
title: Rules
url: https://platform.claude.com/docs/en/api/cli/organization/federation/rules
---

# Rules

## Create Federation Rule

`$ ant organization:federation:rules create`

**POST** `/v1/organizations/federation_rules`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Create a federation rule owned by your organization.

The referenced issuer and the target service account must already exist
in the same organization; invalid references are rejected with a 400
error. The workspace reference is validated. Membership is not checked
at rule creation: token exchange resolves a single enabled workspace per
call and is rejected unless the target service account is a member of
that workspace (it is implicitly a member of the default workspace).
Rules on well-known shared issuers (GitHub Actions, GitLab, Buildkite,
Terraform Cloud, Google) must constrain tenant identity via an
identity-bearing claim, a tenant-pinning subject prefix (such as
`repo:YOUR_ORG/...`), or a CEL condition referencing one of those
identity claims (e.g. `claims.repository_owner`). OAuth callers may only
manage rules whose `oauth_scope` is `workspace:developer` or
`workspace:inference`; other scopes require a Console session.

### Parameters

- `--issuer-id: string`

  Tagged ID of the federation issuer.

- `--match: object`

  Conditions the verified JWT must satisfy for this rule to apply. At least one of `subject_prefix` (other than a wildcard-only value like `*`), `claims`, or `condition` is required; `audience` alone is not sufficient.

- `--name: string`

  Slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--oauth-scope: string`

  Space-separated OAuth scopes. OAuth callers may only set `workspace:developer` or `workspace:inference`; other scopes (such as `org:admin`) require a Console session.

  minLength: 1

- `--target: object`

  Identity that tokens minted via this rule act as. Currently always a `service_account` target.

- `--applies-to-all-workspaces: optional boolean`

  When true, enable this rule for every workspace in the org (including workspaces created later).

- `--description: optional string`

  Optional free-text description.

  maxLength: 2000

- `--token-lifetime-seconds: optional number`

  Lifetime in seconds for access tokens minted via this rule (60-86400). Defaults to 3600 (1h). Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  minimum: 60, maximum: 86400

- `--workspace-id: optional string`

  Tagged ID of the workspace to enable this rule for. Required unless `applies_to_all_workspaces` is true. Additional workspaces can be added via the `/federation_rules/{federation_rule_id}/workspaces` sub-resource.

### Returns

- `federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

### Example

```bash
ant organization:federation:rules create \
  --api-key my-anthropic-api-key \
  --issuer-id issuer_id \
  --match '{}' \
  --name x \
  --oauth-scope x \
  --target '{service_account_id: svac_01SDCCSbTxrXDpWc1phhtcfK, type: service_account}'
```

#### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

## List Federation Rules

`$ ant organization:federation:rules list`

**GET** `/v1/organizations/federation_rules`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List federation rules in your organization.

Optionally filter by issuer with `issuer_id`. Archived rules are excluded
unless `include_archived=true`.

### Parameters

- `--include-archived: optional boolean` (query parameter)

  Include archived resources. Defaults to false.

- `--issuer-id: optional string` (query parameter)

  Filter to rules referencing this federation issuer.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

### Returns

- `FederationRuleListResponse: object`

  - `data: array of FederationRule`

    - `type: "federation_rule"`

    - `id: string`

      Tagged ID of the federation rule.

    - `applies_to_all_workspaces: boolean`

      When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

    - `archived_at: string`

      If set, this rule is archived and rejects token exchange.

      format: date-time

    - `archived_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

    - `created_at: string`

      When this rule was created.

      format: date-time

    - `created_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that created this rule.

    - `description: string`

      Optional free-text description.

    - `issuer_id: string`

      Tagged ID of the issuer whose tokens this rule accepts.

    - `issuer_name: string`

      Issuer's display name at read time.

    - `match: object`

      Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

      - `audience: optional string`

        Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

        maxLength: 1024

      - `claims: optional map[string]`

        Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

      - `condition: optional string`

        CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

        maxLength: 4096

      - `subject_prefix: optional string`

        Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

        maxLength: 1024

    - `name: string`

      Admin-chosen slug identifier.

    - `oauth_scope: string`

      Space-separated OAuth scopes granted on the minted token.

    - `target: object`

      What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

      - `type: "service_account"`

      - `service_account_id: string`

        Tagged ID of the service account to mint tokens for.

      - `service_account_name: optional string`

        Service account's display name at read time. Ignored on writes.

    - `token_lifetime_seconds: number`

      Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

    - `updated_at: string`

      When this rule was last updated.

      format: date-time

    - `updated_by_actor_id: string`

      Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

    - `workspace_ids: array of string`

      Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

  - `next_page: string`

    Opaque cursor for the next page, or null if no more results.

### Example

```bash
ant organization:federation:rules list \
  --api-key my-anthropic-api-key
```

#### Response (200)

```json
{
  "data": [
    {
      "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
      "applies_to_all_workspaces": true,
      "archived_at": "2019-12-27T18:11:19.117Z",
      "archived_by_actor_id": "archived_by_actor_id",
      "attributes": {
        "foo": "string"
      },
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by_actor_id": "created_by_actor_id",
      "description": "description",
      "issuer_id": "issuer_id",
      "issuer_name": "issuer_name",
      "match": {
        "audience": "audience",
        "claims": {
          "foo": "string"
        },
        "condition": "condition",
        "subject_prefix": "subject_prefix"
      },
      "name": "prod-deploy-pipeline",
      "oauth_scope": "oauth_scope",
      "target": {
        "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
        "type": "service_account",
        "service_account_name": "service_account_name"
      },
      "token_lifetime_seconds": 0,
      "type": "federation_rule",
      "updated_at": "2024-10-30T23:58:27.427722Z",
      "updated_by_actor_id": "updated_by_actor_id",
      "workspace_id": "workspace_id",
      "workspace_ids": [
        "string"
      ]
    }
  ],
  "next_page": "next_page"
}
```

## Get Federation Rule

`$ ant organization:federation:rules retrieve`

**GET** `/v1/organizations/federation_rules/{federation_rule_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Retrieve a federation rule by its ID (`fdrl_...`).

### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

### Returns

- `federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

### Example

```bash
ant organization:federation:rules retrieve \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

#### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

## Update Federation Rule

`$ ant organization:federation:rules update`

**POST** `/v1/organizations/federation_rules/{federation_rule_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Partially update a federation rule.

`issuer_id` is immutable. `match` and `target` are replaced as whole
objects when set. Referenced service accounts and workspaces must exist
in your organization; invalid references are rejected with a 400 error.
Archived rules cannot be updated; this returns 400. Create a new rule
instead. Rules on well-known shared issuers (GitHub Actions, GitLab,
Buildkite, Terraform Cloud, Google) must constrain tenant identity via
an identity-bearing claim, a tenant-pinning subject prefix (such as
`repo:YOUR_ORG/...`), or a CEL condition referencing one of those
identity claims (e.g. `claims.repository_owner`). On these issuers the
requirement is re-checked on every update; if an existing rule's stored
match does not yet constrain tenant identity, any update (even a rename
or description change) must also supply a conforming `match` in the same
request. OAuth callers may only manage rules whose `oauth_scope` is
`workspace:developer` or `workspace:inference`; other scopes require a
Console session.

### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule to update.

- `--applies-to-all-workspaces: optional boolean`

  When true, enables this rule for every workspace in the org (including workspaces created later). Setting `false` is rejected with 400 if no workspace would remain enabled; a rule with only a legacy `workspace_id` binding continues to mint.

- `--description: optional string`

  Replaces the description. Omit to leave unchanged; send `null` to clear (the field is stored as an empty string).

  maxLength: 2000

- `--match: optional object`

  Replaces the entire match object. All populated matcher fields must pass.

- `--name: optional string`

  Replaces the slug identifier (lowercase, digits, hyphens). Unique within the organization; a duplicate name returns 409.

  minLength: 1, maxLength: 255

- `--oauth-scope: optional string`

  Replaces the space-separated OAuth scopes granted on minted tokens. OAuth callers may only set `workspace:developer` or `workspace:inference`; other scopes (such as `org:admin`) require a Console session.

  minLength: 1

- `--target: optional object`

  Replaces the entire target object. Currently always a `service_account` target.

- `--token-lifetime-seconds: optional number`

  Replaces the lifetime in seconds for access tokens minted via this rule (60-86400). Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  minimum: 60, maximum: 86400

- `--workspace-id: optional string`

  Replaces the existing single workspace enablement (the previous one is removed). Rejected with 400 if the rule is enabled for more than one workspace; use the `/federation_rules/{federation_rule_id}/workspaces` sub-resource instead.

### Returns

- `federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

### Example

```bash
ant organization:federation:rules update \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

#### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

## Archive Federation Rule

`$ ant organization:federation:rules archive`

**POST** `/v1/organizations/federation_rules/{federation_rule_id}/archive`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Archive a federation rule.

Token exchange through this rule stops immediately. Idempotent;
re-archiving returns the rule with its original `archived_at`. Archiving
clears the rule's workspace targeting (`workspace_id` and
`workspace_ids` are emptied). Tokens already minted before archive
remain valid until they expire. OAuth callers may only manage rules
whose `oauth_scope` is `workspace:developer` or `workspace:inference`;
other scopes require a Console session.

### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule to archive.

### Returns

- `federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

### Example

```bash
ant organization:federation:rules archive \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

#### Response (200)

```json
{
  "id": "fdrl_01SDCCSbTxrXDpWc1phhtcfK",
  "applies_to_all_workspaces": true,
  "archived_at": "2019-12-27T18:11:19.117Z",
  "archived_by_actor_id": "archived_by_actor_id",
  "attributes": {
    "foo": "string"
  },
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "description": "description",
  "issuer_id": "issuer_id",
  "issuer_name": "issuer_name",
  "match": {
    "audience": "audience",
    "claims": {
      "foo": "string"
    },
    "condition": "condition",
    "subject_prefix": "subject_prefix"
  },
  "name": "prod-deploy-pipeline",
  "oauth_scope": "oauth_scope",
  "target": {
    "service_account_id": "svac_01SDCCSbTxrXDpWc1phhtcfK",
    "type": "service_account",
    "service_account_name": "service_account_name"
  },
  "token_lifetime_seconds": 0,
  "type": "federation_rule",
  "updated_at": "2024-10-30T23:58:27.427722Z",
  "updated_by_actor_id": "updated_by_actor_id",
  "workspace_id": "workspace_id",
  "workspace_ids": [
    "string"
  ]
}
```

## Domain types

### Federation Rule

- `federation_rule: object`

  Authorization rule binding an external OIDC identity to Anthropic.

  Evaluates the match conditions and mints an OAuth access token for the
  resolved target, scoped to a single workspace where the rule is enabled
  (chosen by the caller at exchange time when the rule is enabled for more
  than one). For rules enabled via `workspace_ids` or
  `applies_to_all_workspaces`, the target service account must be a member
  of that workspace (it is implicitly a member of the default workspace);
  rules carrying only the legacy `workspace_id` binding do not enforce
  this.

  - `type: "federation_rule"`

  - `id: string`

    Tagged ID of the federation rule.

  - `applies_to_all_workspaces: boolean`

    When true, this rule is enabled for every workspace in the org (including ones created after the rule). `workspace_ids` is ignored at exchange time.

  - `archived_at: string`

    If set, this rule is archived and rejects token exchange.

    format: date-time

  - `archived_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that archived this rule.

  - `created_at: string`

    When this rule was created.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that created this rule.

  - `description: string`

    Optional free-text description.

  - `issuer_id: string`

    Tagged ID of the issuer whose tokens this rule accepts.

  - `issuer_name: string`

    Issuer's display name at read time.

  - `match: object`

    Conditions the verified JWT must satisfy for this rule to apply. All populated matcher fields must pass.

    - `audience: optional string`

      Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

      maxLength: 1024

    - `claims: optional map[string]`

      Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

    - `condition: optional string`

      CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

      maxLength: 4096

    - `subject_prefix: optional string`

      Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

      maxLength: 1024

  - `name: string`

    Admin-chosen slug identifier.

  - `oauth_scope: string`

    Space-separated OAuth scopes granted on the minted token.

  - `target: object`

    What this rule targets. Check `type` before reading the other fields. Tokens minted via a rule whose target `type` is `service_account` act as that service account.

    - `type: "service_account"`

    - `service_account_id: string`

      Tagged ID of the service account to mint tokens for.

    - `service_account_name: optional string`

      Service account's display name at read time. Ignored on writes.

  - `token_lifetime_seconds: number`

    Lifetime in seconds of access tokens minted via this rule. Minted tokens are capped at `max(60, min(this value, 2 × remaining assertion validity))` seconds.

  - `updated_at: string`

    When this rule was last updated.

    format: date-time

  - `updated_by_actor_id: string`

    Tagged ID (`user_`/`svac_`) of the actor that last updated this rule.

  - `workspace_ids: array of string`

    Tagged IDs of the workspaces this rule is enabled for. May be empty for older rules that only carry the legacy `workspace_id` binding. Ignored at exchange time when `applies_to_all_workspaces` is true (the list may still be non-empty).

### Federation Rule Match

- `federation_rule_match: object`

  Does the incoming JWT qualify?

  All populated fields must pass; omitted fields are skipped. At least one
  of `subject_prefix` (other than a wildcard-only value like `*`), `claims`,
  or `condition` is required; `audience` alone is not sufficient.

  - `audience: optional string`

    Exact match against the `aud` claim (any element if array). When omitted, the JWT's `aud` must still equal Anthropic's expected audience for the issuer; setting this field overrides that default.

    maxLength: 1024

  - `claims: optional map[string]`

    Exact-match `{claim: value}` pairs against top-level claims. Only string-valued claims can be matched; use `condition` for non-string claims.

  - `condition: optional string`

    CEL expression over claims for logic the structural fields can't express. Must evaluate to a boolean and may reference only the `claims` variable; a constant-true expression (such as `true`) is rejected with 400.

    maxLength: 4096

  - `subject_prefix: optional string`

    Match the verified JWT `sub` claim. Exact match unless the value ends with `*`, in which case it is a prefix match. Example: `repo:my-org/my-repo:ref:refs/heads/main`.

    maxLength: 1024

### Federation Rule Workspace

- `federation_rule_workspace: object`

  - `type: "federation_rule_workspace"`

  - `created_at: string`

    When this workspace was enabled for the rule.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_...` or `svac_...`) of the actor that enabled this workspace for the rule, if known.

  - `federation_rule_id: string`

    Tagged ID of the federation rule.

  - `workspace_id: string`

    Tagged ID of the workspace this rule is enabled for.

  - `workspace_name: string`

    Workspace display name. Populated when listing; null in the enable response.

### Service Account Target

- `service_account_target: object`

  Bind to a fixed service account by ID.

  - `type: "service_account"`

  - `service_account_id: string`

    Tagged ID of the service account to mint tokens for.

  - `service_account_name: optional string`

    Service account's display name at read time. Ignored on writes.

## Rules › Workspaces

### Add Federation Rule Workspace

`$ ant organization:federation:rules:workspaces add`

**POST** `/v1/organizations/federation_rules/{federation_rule_id}/workspaces`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Enable a federation rule for a workspace.

Idempotent; re-enabling returns the existing enablement. The rule and
workspace must both belong to your organization. Membership of the
rule's target service account in this workspace is not checked at
enablement: token exchange into this workspace is rejected unless the
target is a member (it is implicitly a member of the default workspace).
Archived rules are rejected with 400. OAuth callers may only manage rules
whose `oauth_scope` is `workspace:developer` or `workspace:inference`;
other scopes require a Console session.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--workspace-id: string`

  Tagged ID of the workspace to enable this rule for.

#### Returns

- `federation_rule_workspace: object`

  - `type: "federation_rule_workspace"`

  - `created_at: string`

    When this workspace was enabled for the rule.

    format: date-time

  - `created_by_actor_id: string`

    Tagged ID (`user_...` or `svac_...`) of the actor that enabled this workspace for the rule, if known.

  - `federation_rule_id: string`

    Tagged ID of the federation rule.

  - `workspace_id: string`

    Tagged ID of the workspace this rule is enabled for.

  - `workspace_name: string`

    Workspace display name. Populated when listing; null in the enable response.

#### Example

```bash
ant organization:federation:rules:workspaces add \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by_actor_id": "created_by_actor_id",
  "federation_rule_id": "federation_rule_id",
  "type": "federation_rule_workspace",
  "workspace_id": "workspace_id",
  "workspace_name": "workspace_name"
}
```

### List Federation Rule Workspaces

`$ ant organization:federation:rules:workspaces list`

**GET** `/v1/organizations/federation_rules/{federation_rule_id}/workspaces`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

List workspaces where this federation rule is enabled.

Returns all workspace enablements in a single response; the `limit` and
`page` parameters are accepted but have no effect, and `next_page` is
always `null`. Returns explicit per-workspace enablements only; for
rules with `applies_to_all_workspaces` or a legacy single
`workspace_id`, check those fields on the rule itself.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--limit: optional number` (query parameter)

  Number of results per page.

  minimum: 1, maximum: 100

- `--page: optional string` (query parameter)

  Opaque cursor from a previous response's `next_page`.

#### Returns

- `FederationRuleWorkspaceListResponse: object`

  - `data: array of FederationRuleWorkspace`

    - `type: "federation_rule_workspace"`

    - `created_at: string`

      When this workspace was enabled for the rule.

      format: date-time

    - `created_by_actor_id: string`

      Tagged ID (`user_...` or `svac_...`) of the actor that enabled this workspace for the rule, if known.

    - `federation_rule_id: string`

      Tagged ID of the federation rule.

    - `workspace_id: string`

      Tagged ID of the workspace this rule is enabled for.

    - `workspace_name: string`

      Workspace display name. Populated when listing; null in the enable response.

  - `next_page: string`

    Opaque cursor for the next page; null when there are no more results.

#### Example

```bash
ant organization:federation:rules:workspaces list \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id
```

##### Response (200)

```json
{
  "data": [
    {
      "created_at": "2024-10-30T23:58:27.427722Z",
      "created_by_actor_id": "created_by_actor_id",
      "federation_rule_id": "federation_rule_id",
      "type": "federation_rule_workspace",
      "workspace_id": "workspace_id",
      "workspace_name": "workspace_name"
    }
  ],
  "next_page": "next_page"
}
```

### Remove Federation Rule Workspace

`$ ant organization:federation:rules:workspaces remove`

**DELETE** `/v1/organizations/federation_rules/{federation_rule_id}/workspaces/{workspace_id}`

**Requires an OAuth access token with the `org:admin` scope**, from `ant auth login --scope org:admin` or a workload identity federation rule; Admin API keys are not accepted. See [Manage WIF with the Admin API](https://platform.claude.com/docs/en/manage-claude/wif-admin-api?sdk_languages=cli).

Disable a federation rule for a workspace.

Idempotent; succeeds even if the enablement was already removed. OAuth
callers may only manage rules whose `oauth_scope` is
`workspace:developer` or `workspace:inference`; other scopes require a
Console session.

#### Parameters

- `--federation-rule-id: string` (path parameter)

  ID of the federation rule.

- `--workspace-id: string` (path parameter)

  ID of the workspace to disable for.

#### Returns

- `OrganizationFederationRuleWorkspaceRemoveResponse: object`

  - `type: "federation_rule_workspace_deleted"`

  - `federation_rule_id: string`

    Tagged ID of the federation rule.

  - `workspace_id: string`

    Tagged ID of the workspace named in the delete request. Removal is idempotent.

#### Example

```bash
ant organization:federation:rules:workspaces remove \
  --api-key my-anthropic-api-key \
  --federation-rule-id federation_rule_id \
  --workspace-id workspace_id
```

##### Response (200)

```json
{
  "federation_rule_id": "federation_rule_id",
  "type": "federation_rule_workspace_deleted",
  "workspace_id": "workspace_id"
}
```
