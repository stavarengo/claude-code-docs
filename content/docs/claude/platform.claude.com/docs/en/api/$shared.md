---
title: Shared
url: https://platform.claude.com/docs/en/api/$shared
---

# Shared

## Domain types

### API Error Object

- `APIErrorObject object`

  - `type: "api_error"`

    The broad category of the error.

    default: api_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Internal server error

### Authentication Error Object

- `AuthenticationErrorObject object`

  - `type: "authentication_error"`

    The broad category of the error.

    default: authentication_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Authentication error

### Billing Error Object

- `BillingErrorObject object`

  - `type: "billing_error"`

    The broad category of the error.

    default: billing_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Billing error

### Claude Code Key Creator Not Member Error Details

- `ClaudeCodeKeyCreatorNotMemberErrorDetails object`

  - `error_code: "claude_code_key_creator_not_member"`

### Claude Code Version Too Old Error Details

- `ClaudeCodeVersionTooOldErrorDetails object`

  - `error_code: "claude_code_version_too_old"`

### CMEK Context Unavailable Error Details

- `CMEKContextUnavailableErrorDetails object`

  - `error_code: "cmek_context_unavailable"`

### CMEK Key Disabled Error Details

- `CMEKKeyDisabledErrorDetails object`

  - `error_code: "cmek_key_disabled"`

### CMEK Key Network Blocked Error Details

- `CMEKKeyNetworkBlockedErrorDetails object`

  - `error_code: "cmek_key_network_blocked"`

### CMEK Key Unreachable Error Details

- `CMEKKeyUnreachableErrorDetails object`

  - `error_code: "cmek_key_unreachable"`

### Contract Spend Limit Reached Error Details

- `ContractSpendLimitReachedErrorDetails object`

  - `error_code: "contract_spend_limit_reached"`

### Enforced Spend Limit Reached Error Details

- `EnforcedSpendLimitReachedErrorDetails object`

  - `error_code: "enforced_spend_limit_reached"`

### Error Details

- `ErrorDetails = AvailableToolsLimitExceededErrorDetails or ClaudeCodeKeyCreatorNotMemberErrorDetails or ClaudeCodeVersionTooOldErrorDetails or 122 more`

  - `AvailableToolsLimitExceededErrorDetails object`

    The tools available after a message exceed a limit on their number or their size.

    - `error_code: "available_tools_limit_exceeded"`

  - `ClaudeCodeKeyCreatorNotMemberErrorDetails object`

    The API key belongs to the Claude Code workspace, and the user who created it is no longer a member of the organization or of that workspace.

    - `error_code: "claude_code_key_creator_not_member"`

  - `ClaudeCodeVersionTooOldErrorDetails object`

    The request comes from a Claude Code version older than the minimum that the requested model or the organization requires. Update Claude Code, then retry.

    - `error_code: "claude_code_version_too_old"`

  - `CMEKKeyDisabledErrorDetails object`

    The workspace's customer-managed encryption key is disabled or revoked. Re-enable the key, then retry.

    - `error_code: "cmek_key_disabled"`

  - `CMEKKeyNetworkBlockedErrorDetails object`

    The key management service's network access controls blocked the request to the workspace's customer-managed encryption key. The key itself may be healthy.

    - `error_code: "cmek_key_network_blocked"`

  - `CompactionBlockAmbiguousErrorDetails object`

    `messages` holds more than one `compaction` block with content. Send only the block the conversation returned last.

    - `error_code: "compaction_block_ambiguous"`

  - `CompactionBlockMisplacedErrorDetails object`

    The `compaction` block is not the first block of the conversation, or is in a `system` message.

    - `error_code: "compaction_block_misplaced"`

  - `CompactionContentMismatchErrorDetails object`

    The `compaction` block's `content` differs from the text its `signature` recorded.

    - `error_code: "compaction_content_mismatch"`

  - `CompactionIncompleteTurnErrorDetails object`

    The compaction request ends on an `assistant` turn that is not finished.

    - `error_code: "compaction_incomplete_turn"`

  - `CompactionNothingToSummarizeErrorDetails object`

    `messages` holds no `user` or `assistant` content to summarize or adopt.

    - `error_code: "compaction_nothing_to_summarize"`

  - `CompactionSignatureInvalidErrorDetails object`

    The `compaction` block's `signature` does not verify.

    - `error_code: "compaction_signature_invalid"`

  - `CompactionTooManyToolReferencesErrorDetails object`

    The conversation references more distinct tools than a `compaction` block can record.

    - `error_code: "compaction_too_many_tool_references"`

  - `CompactionToolChangesMismatchErrorDetails object`

    The `compaction` block's `tool_changes` differs from what was returned with the block.

    - `error_code: "compaction_tool_changes_mismatch"`

  - `ImageDimensionsTooLargeErrorDetails object`

    The longest side of one or more images in the request exceeds the image size limit. Scale each image in `paths` so that neither side exceeds `max_side_length_pixels`, or remove it, then retry.

    - `error_code: "image_dimensions_too_large"`

    - `max_side_length_pixels: number`

      The limit the images exceeded: the largest width or height, in pixels, that an image on this request may have.

    - `paths: array of string`

      The position of every image over the limit, in the order you sent them, nested blocks included, such as `messages.0.content.1`, or `messages.0.content.1.content.0` for an image in a `tool_result` block.

  - `OrganizationOnHoldErrorDetails object`

    Anthropic has disabled the organization for trust and safety reasons. An organization disabled for any other reason, such as billing, does not get this code. `appeal_url`, when present, is where the organization can appeal.

    - `error_code: "organization_on_hold"`

    - `appeal_url: optional string or null`

  - `RequestBodyEncodingInvalidErrorDetails object`

    The request body is not valid for its `Content-Encoding`.

    - `error_code: "request_body_encoding_invalid"`

  - `RequestBodyEncodingUnsupportedErrorDetails object`

    The request's `Content-Encoding` is not supported.

    - `error_code: "request_body_encoding_unsupported"`

  - `ThreadAlreadyContinuedErrorDetails object`

    The response that `previous_message_id` names has already been continued, and each response can be continued only once. Continue from the Thread's most recent response `id`.

    - `error_code: "thread_already_continued"`

  - `ThreadContinueInFlightErrorDetails object`

    Another request is still continuing from the same `previous_message_id`. Wait for it to complete and continue from its response `id`, or replay the full conversation with `thread: {"type": "create"}`.

    - `error_code: "thread_continue_in_flight"`

  - `ThreadFingerprintMismatchErrorDetails object`

    A field that must stay the same across a Thread's turns differs from the value stored with the Thread; the message names each such field. Send the stored values, or replay the full conversation with `thread: {"type": "create"}` to change them.

    - `error_code: "thread_fingerprint_mismatch"`

  - `ThreadUnsupportedRequestErrorDetails object`

    The request combines `thread` with a request field or an organization setting that Threads do not support; `unsupported`, when present, names it. Send the full conversation without `thread`, or change that field.

    - `error_code: "thread_unsupported_request"`

    - `unsupported: optional array of ThreadUnsupportedFeatureName or null`

      Each entry names a request field or an organization setting that Threads do not support. On a value you do not recognize, send the full conversation without `thread`.

      - `"cache_control"`

      - `"context_management"`

      - `"fallbacks"`

      - `"hipaa"`

      - `"inference_hooks"`

      - `"thinking"`

  - `ToolNameConflictErrorDetails object`

    A tool made available in `messages` takes a name that an available tool of another kind, or of another MCP server, already holds.

    - `error_code: "tool_name_conflict"`

  - `ToolReferenceUnresolvedErrorDetails object`

    A tool change or MCP tool listing references a tool or MCP server that is not defined at that position in the conversation.

    - `error_code: "tool_reference_unresolved"`

  - `UserProfileRequiredErrorDetails object`

    The request sets `billing_policy.bill_to` to `"user_profile"` but names no user profile. Name the profile to bill in the `anthropic-user-profile-id` header.

    - `error_code: "user_profile_required"`

  - `LinkedOrganizationBillingUnavailableErrorDetails object`

    Anthropic cannot currently bill the organization linked to the request's user profile, for a reason that lies with that organization's own account. The response does not say what the reason is.

    - `error_code: "linked_organization_billing_unavailable"`

  - `LinkedOrganizationSpendLimitReachedErrorDetails object`

    The organization linked to the request's user profile has reached a spend limit that it set, or lacks credit for the request. The response does not say which applies.

    - `error_code: "linked_organization_spend_limit_reached"`

  - `UserProfileBillingNotAuthorizedErrorDetails object`

    The customer that the request's user profile represents has not authorized the caller to bill them, or the authorization that the request's credential uses has ended. The response does not say which applies.

    - `error_code: "user_profile_billing_not_authorized"`

  - `UserProfileNotBillableErrorDetails object`

    The request's user profile cannot be billed. The response gives no more specific error code and does not say what the reason is.

    - `error_code: "user_profile_not_billable"`

  - `ThreadNotFoundErrorDetails object`

    No usable Thread state was found for `previous_message_id`. Replay the full conversation with `thread: {"type": "create"}` to start a new Thread.

    - `error_code: "thread_not_found"`

  - `SkillReadBlockedUndecryptableErrorDetails object`

    A custom skill the request names is stored under an encryption key state the workspace cannot currently decrypt.

    - `error_code: "skill_read_blocked_undecryptable"`

  - `RequestBodyTooLargeAfterDecodingErrorDetails object`

    The compressed request body exceeds the request size limit once decoded.

    - `error_code: "request_body_too_large_after_decoding"`

  - `ContractSpendLimitReachedErrorDetails object`

    The organization has reached the spend limit of its contract.

    - `error_code: "contract_spend_limit_reached"`

  - `EnforcedSpendLimitReachedErrorDetails object`

    The organization has crossed the monthly API usage threshold of its API tier.

    - `error_code: "enforced_spend_limit_reached"`

  - `RampLimitExceededErrorDetails object`

    The request would exceed a ramp limit, which caps how fast usage can grow. Retry after the time in the `retry-after` header.

    - `error_code: "ramp_limit_exceeded"`

  - `CMEKKeyUnreachableErrorDetails object`

    The workspace's customer-managed encryption key could not be reached. Retry the request; if this continues, check that the key is available in your key management service, or contact Anthropic support.

    - `error_code: "cmek_key_unreachable"`

  - `CompactionUnavailableErrorDetails object`

    The compaction could not be completed for a transient server reason. Retry the request.

    - `error_code: "compaction_unavailable"`

  - `WorkspaceHumanReviewDisabledErrorDetails object`

    The request's Workspace has Human Review turned off, and this operation is not available there. Use a Workspace with Human Review on.

    - `error_code: "workspace_human_review_disabled"`

  - `StorageQuotaExceededErrorDetails object`

    The organization's file storage quota is exhausted. Delete files to free up space, then retry the upload.

    - `error_code: "storage_quota_exceeded"`

  - `FileNotDownloadableErrorDetails object`

    The file has `downloadable: false`. Only files generated by a tool, such as the code execution tool, can be downloaded.

    - `error_code: "file_not_downloadable"`

  - `FileExpiredErrorDetails object`

    The file's `expires_at` has passed, so its content is no longer available.

    - `error_code: "file_expired"`

  - `CMEKContextUnavailableErrorDetails object`

    The workspace's encryption settings could not be read, so the request was refused. Retry in a few minutes.

    - `error_code: "cmek_context_unavailable"`

  - `OrgAPIKeyLimitExceededErrorDetails object`

    The organization has reached its limit of active API keys.

    - `error_code: "org_api_key_limit_exceeded"`

  - `WorkspaceAPIKeyLimitExceededErrorDetails object`

    The workspace has reached its limit of active API keys.

    - `error_code: "workspace_api_key_limit_exceeded"`

  - `SandboxEgressRestrictedErrorDetails object`

    The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

    - `error_code: "sandbox_egress_restricted"`

  - `UserProfileNotFoundErrorDetails object`

    The request depends on a user profile that does not exist in the organization or is no longer active. The request either names this user profile by ID, or names a resource, such as an External Key, that is bound to it.

    - `error_code: "user_profile_not_found"`

  - `ExternalKeyInWorkspacePolicyErrorDetails object`

    The External Key can't be deleted or reconfigured while the organization's Workspace Policy lists it as an allowed key.

    - `error_code: "external_key_in_workspace_policy"`

  - `AlreadyMemberErrorDetails object`

    The email address already belongs to a user in the organization. The message names the user.

    - `error_code: "already_member"`

  - `CannotInviteEmailsWithUnverifiedDomainsErrorDetails object`

    The email address's domain is not one of the verified domains of the organization's parent organization.

    - `error_code: "cannot_invite_emails_with_unverified_domains"`

  - `EmailDomainNotAllowedErrorDetails object`

    The organization restricts invites to an allowed list of email domains, and the list is empty or does not include the email address's domain.

    - `error_code: "email_domain_not_allowed"`

  - `InviteAlreadyExistsErrorDetails object`

    A pending invite already exists for the email address. The message names the invite.

    - `error_code: "invite_already_exists"`

  - `OrgMemberLimitExceededErrorDetails object`

    The organization has reached the member limit that Anthropic set for it. Pending invites count toward the limit.

    - `error_code: "org_member_limit_exceeded"`

  - `RBACGroupGrantsOwnerAccessErrorDetails object`

    A role attached to an RBAC Group in the request grants owner access, so this API does not add members to that group (directly or through an invite), remove its members, or delete it. Make the change in the organization's admin settings in Claude.

    - `error_code: "rbac_group_grants_owner_access"`

  - `RBACGroupOwnerAccessUnconfirmedErrorDetails object`

    The API could not finish checking whether an RBAC Group in the request grants owner access, so it made no change. Retrying the same request will not help. Make the change in the organization's admin settings in Claude.

    - `error_code: "rbac_group_owner_access_unconfirmed"`

  - `CannotRemoveLastMemberErrorDetails object`

    The user is the organization's only member. Add another member before removing this one.

    - `error_code: "cannot_remove_last_member"`

  - `ConcurrentMembershipChangeErrorDetails object`

    Another change to the organization's members is in progress. Retry the request once it completes.

    - `error_code: "concurrent_membership_change"`

  - `ExternalKeyValidationFailedErrorDetails object`

    The External Key failed Anthropic's validation, so the request was refused. The message gives the reason, if there is one.

    - `error_code: "external_key_validation_failed"`

  - `ExternalKeyValidationTimedOutErrorDetails object`

    Anthropic's validation of the External Key did not finish in time, so the request was refused. Wait a moment, then send the request again.

    - `error_code: "external_key_validation_timed_out"`

  - `KeyProfileMismatchErrorDetails object`

    After this request, the External Key and the Workspace would not have the same user profile. A key and its Workspace must have the same user profile, or both have none.

    - `error_code: "key_profile_mismatch"`

  - `WorkspacePolicyViolationErrorDetails object`

    The request breaks the organization's Workspace Policy. The message says which rule it broke; an organization admin can see and change the policy in the Console.

    - `error_code: "workspace_policy_violation"`

    - `field: WorkspacePolicyField`

      The request field the broken rule applies to. Other values may be returned.

  - `ExternalKeyChangedErrorDetails object`

    The external key changed while the request was validating it. Send the request again.

    - `error_code: "external_key_changed"`

  - `WorkspaceCreatedIncompleteErrorDetails object`

    The Workspace was created, but some of what the request asked for did not take effect, or may not have. Don't send the create again. The error's `message` says what to do with the Workspace at `workspace_id`.

    - `error_code: "workspace_created_incomplete"`

    - `workspace_id: string`

      ID of the Workspace the request created.

  - `StorageProfileMismatchErrorDetails object`

    The Workspace's storage and its user profile don't match: the Workspace and its storage must have the same user profile, or both have none.

    - `error_code: "storage_profile_mismatch"`

    - `field: string`

      The storage setting that doesn't match the Workspace's user profile.

  - `ChangeOutcomeUnknownErrorDetails object`

    Some of the request's changes may have been saved and others not. Send the same request again to finish it; changes already saved aren't repeated.

    - `error_code: "change_outcome_unknown"`

  - `StorageAttachedDuringArchiveErrorDetails object`

    The Workspace was archived, but External Storage was attached to it during the archive and is still attached. To detach it, archive the Workspace again as a caller with the `org:external-storage:use` permission.

    - `error_code: "storage_attached_during_archive"`

  - `WorkspaceMemberLimitExceededErrorDetails object`

    The workspace has reached the member limit that Anthropic set for it.

    - `error_code: "workspace_member_limit_exceeded"`

  - `OrganizationTypeNotSupportedErrorDetails object`

    The endpoint does not support the organization's type. Each endpoint's description says which organization types it supports.

    - `error_code: "organization_type_not_supported"`

  - `ParentOrganizationRequiredErrorDetails object`

    The endpoint serves only organizations that belong to a parent organization, and this organization belongs to none.

    - `error_code: "parent_organization_required"`

  - `RBACRoleNotFoundErrorDetails object`

    No RBAC Role with this ID was found.

    - `error_code: "rbac_role_not_found"`

  - `BetaEnvironmentCreateDisabledErrorDetails object`

    Anthropic has turned off creating environments for this organization. Existing environments still work.

    - `error_code: "environment_create_disabled"`

  - `BetaEnvironmentArchivedErrorDetails object`

    The environment is archived, so it cannot be updated.

    - `error_code: "environment_archived"`

  - `BetaInvalidConfigTypeChangeErrorDetails object`

    `config.type` differs from the environment's stored type, which cannot change after creation.

    - `error_code: "invalid_config_type_change"`

  - `BetaEnvironmentUpdateDisabledErrorDetails object`

    Anthropic has turned off updating environments for this organization. Existing environments still work as they are.

    - `error_code: "environment_update_disabled"`

  - `BetaHeartbeatPreconditionFailedErrorDetails object`

    `expected_last_heartbeat` does not match the stored heartbeat, so another worker may hold the lease.

    - `current_state: BetaWorkLeaseState`

      The lease as the server holds it.

      - `last_heartbeat: string or null`

        RFC 3339 timestamp of the stored heartbeat, or null if there has been none

      - `lease_extended: boolean`

        Always false: a refused heartbeat does not extend the lease

      - `state: "queued" or "starting" or "active" or 2 more`

        Current state of the work item

        - `"queued"`

        - `"starting"`

        - `"active"`

        - `"stopping"`

        - `"stopped"`

      - `ttl_seconds: number`

        TTL of the lease

    - `error_code: "heartbeat_precondition_failed"`

  - `BetaInvalidMetadataErrorDetails object`

    `metadata` has too many keys, a key or value that is too long, or a reserved key. The message names each problem.

    - `error_code: "invalid_metadata"`

  - `BetaGrantRequiredErrorDetails object`

    Anthropic has not approved External Storage for the organization, for the Workspace or, for storage bound to a user profile, for that user profile. Contact your Anthropic account team.

    - `error_code: "grant_required"`

  - `BetaOrganizationNotEligibleErrorDetails object`

    The feature isn't offered to this organization. The error's `message` names the kind of organization or, when it names none, says to contact your Anthropic account team.

    - `error_code: "organization_not_eligible"`

  - `BetaProviderNotAllowedErrorDetails object`

    The request can't use External Storage on this cloud provider. The error's message says why.

    - `error_code: "provider_not_allowed"`

  - `BetaUnsupportedRegionErrorDetails object`

    `provider_config.region` is not a region where External Storage is available.

    - `error_code: "unsupported_region"`

  - `BetaStorageAlreadyRegisteredErrorDetails object`

    The organization already has External Storage for this bucket that it has not deleted. List the organization's External Storage to find it.

    - `error_code: "storage_already_registered"`

  - `BetaAuthorizationCheckUnavailableErrorDetails object`

    One of the organization's approvals from Anthropic could not be read right now, so nothing was done. Retry after the `Retry-After` delay.

    - `error_code: "authorization_check_unavailable"`

  - `BetaInvalidStorageARNErrorDetails object`

    On Claude Platform on AWS, the External Storage ID in the request is neither a bucket ARN nor an `estrg_` ID, or is the `estrg_` ID of AWS storage. Name AWS storage by its bucket ARN, `arn:<partition>:s3:::<bucket_name>`, which responses return as its `id`.

    - `error_code: "invalid_storage_arn"`

  - `BetaExternalStorageInUseErrorDetails object`

    The External Storage is `active` or `draining`, so this delete didn't erase it. The message says what to do next. On `draining` storage this delete may have started a removal that can't be undone: get the storage and read `status.removal_started`.

    - `error_code: "external_storage_in_use"`

  - `BetaExternalStorageInWorkspacePolicyErrorDetails object`

    The External Storage can't be deleted while an Enterprise Frontier Safeguards workspace policy lists it as allowed storage.

    - `error_code: "external_storage_in_workspace_policy"`

  - `BetaStorageVerificationFailedErrorDetails object`

    The External Storage failed verification, so the request changed nothing. `failed_checks` lists what to fix.

    - `error_code: "storage_verification_failed"`

    - `failed_checks: array of BetaExternalStorageFailedCheck`

      One entry for each check that failed.

      - `check: "already_registered" or "assume_role" or "bucket_empty" or 33 more`

        Name of the check that failed, such as `versioning`, for code to branch on. New names may be added; `other` is a check this API does not name. The value is a name with no data of its own.

        - `"already_registered"`

        - `"assume_role"`

        - `"bucket_empty"`

        - `"bucket_not_confirmed"`

        - `"bucket_policy"`

        - `"bucket_settings"`

        - `"default_encryption"`

        - `"deletion_policy"`

        - `"encryption"`

        - `"grant_mismatch"`

        - `"key_usable"`

        - `"kms_key_refused"`

        - `"lifecycle_no_archive"`

        - `"lifecycle_rules"`

        - `"lifecycle_template"`

        - `"location_mismatch"`

        - `"object_lock"`

        - `"other"`

        - `"ownership_enforced"`

        - `"probe_failed"`

        - `"probe_object"`

        - `"probe_storage_class"`

        - `"public_access_block"`

        - `"region"`

        - `"replication"`

        - `"request_metrics"`

        - `"request_payment"`

        - `"transcripts_support"`

        - `"trust_ingest_role"`

        - `"trust_maintenance_role"`

        - `"trust_media_erasure_role"`

        - `"trust_read_role"`

        - `"trust_transcripts_role"`

        - `"trust_transcripts_verify_role"`

        - `"trust_verify_role"`

        - `"versioning"`

      - `message: string`

        What failed and how to fix it, in plain words.

      - `role: "ingest" or "maintenance" or "media_erasure" or 4 more or null`

        The part of your access grant that the check is about, such as `ingest`: on AWS, one of the IAM roles your setup created; on Google Cloud, the grant to one of Anthropic's service accounts. `null` when the check is not about one. New names may be added. The value is a name with no data of its own.

        - `"ingest"`

        - `"maintenance"`

        - `"media_erasure"`

        - `"read"`

        - `"transcripts"`

        - `"transcripts_verify"`

        - `"verify"`

    - `field: optional string or null`

      The request field at fault. Sent when the refused request is a Workspace's create or update.

  - `BetaCannotSignOutPrimaryOwnerErrorDetails object`

    The member is the organization's primary owner, whom no API key or token can sign out.

    - `error_code: "cannot_sign_out_primary_owner"`

  - `BetaCannotSignOutSelfErrorDetails object`

    The member is the user the API key or token belongs to.

    - `error_code: "cannot_sign_out_self"`

  - `BetaOrganizationNotEnrolledInBetaErrorDetails object`

    The beta that the endpoint requires is not enabled for the organization. The message names the beta value.

    - `error_code: "organization_not_enrolled_in_beta"`

  - `BetaCannotSignOutManagedMemberErrorDetails object`

    The member has the `managed` role, and this API key or token cannot sign them out. The error message says which keys and tokens can.

    - `error_code: "cannot_sign_out_managed_member"`

  - `BetaCannotSignOutMembershipAdminErrorDetails object`

    The member is a membership admin, and the person the API key or token belongs to is not allowed to sign out membership admins.

    - `error_code: "cannot_sign_out_membership_admin"`

  - `BetaCannotSignOutOwnerErrorDetails object`

    The member is an owner or has owner permissions, and this API key or token cannot sign them out. In a Claude Enterprise organization, an API key with the `write:members` scope can.

    - `error_code: "cannot_sign_out_owner"`

  - `BetaCannotSignOutPrivilegedMemberErrorDetails object`

    This OAuth token cannot sign out a membership admin or a member whose roles grant owner, user management, or identity and access management.

    - `error_code: "cannot_sign_out_privileged_member"`

  - `BetaApprovalRequiredErrorDetails object`

    Turning human review off needs Anthropic's approval for the organization, and the organization doesn't have it. Contact Anthropic support to request approval.

    - `error_code: "approval_required"`

    - `field: string`

      The request field that needs the approval.

  - `BetaExternalStorageNotAvailableErrorDetails object`

    External Storage isn't available for this Workspace, so only `internal` storage is accepted. The error's `message` says why.

    - `error_code: "external_storage_not_available"`

  - `BetaHumanReviewNotAvailableErrorDetails object`

    Human review can't be set as requested on this Workspace, so the request changed nothing. The error's `message` says what to do instead.

    - `error_code: "human_review_not_available"`

  - `BetaHumanReviewOnWithExternalStorageErrorDetails object`

    The request would leave the Workspace with `inference_data_privacy.safeguards_storage` set to External Storage and `inference_data_privacy.human_review` enabled. Anthropic doesn't offer human review of data in a customer's own storage. Set `human_review` to `disabled`, or `safeguards_storage` to `internal`.

    - `error_code: "human_review_on_with_external_storage"`

  - `BetaStorageNotAttachableErrorDetails object`

    This External Storage can't be attached to the setting named in `field`. The error's `message` says why.

    - `error_code: "storage_not_attachable"`

    - `field: string`

      The request field at fault.

  - `BetaTranscriptsStorageRequiredErrorDetails object`

    In an organization managed through AWS or Google Cloud, the request would leave the Workspace with `inference_data_privacy.human_review` disabled and `inference_data_privacy.transcripts_storage` not set to External Storage. With human review disabled, the organization reviews its own flagged requests, and it receives them only in that storage.

    - `error_code: "transcripts_storage_required"`

  - `BetaStorageAttachLimitReachedErrorDetails object`

    The Workspace has reached its limit of 100 different External Storage resources attached over its lifetime. Detached storage counts toward the limit until it is deleted.

    - `error_code: "storage_attach_limit_reached"`

  - `BetaStorageProfileStillRequiredErrorDetails object`

    This storage is bound to a different user profile from storage the Workspace has attached, or from active or draining storage it once had for safeguards data. Detaching storage the Workspace uses only for transcripts clears this. Detaching safeguards storage doesn't, so use a new Workspace instead.

    - `error_code: "storage_profile_still_required"`

  - `BetaStorageChangedConcurrentlyErrorDetails object`

    Another request changed this storage setting while this one was running, so this request left it as it is. Read the Workspace and send the request again if you still want the change.

    - `error_code: "storage_changed_concurrently"`

    - `field: string`

      The storage setting that changed.

  - `BetaWorkspaceChangedConcurrentlyErrorDetails object`

    Another request changed the Workspace, so this request left the setting named in `field` as it is. The error's `message` says which of this request's other changes are in place. Read the Workspace and send the request again if you still want the change.

    - `error_code: "workspace_changed_concurrently"`

    - `field: BetaWorkspaceChangedConcurrentlyField`

      The request field whose change was refused. Other values may be returned. The value is a name with no data of its own.

  - `BetaSpendLimitsAdminAPIWritesNotEnabledErrorDetails object`

    The organization cannot retrieve, set or delete spend limits with an Admin API credential.

    - `error_code: "spend_limits_admin_api_writes_not_enabled"`

  - `BetaUnsupportedCharsetErrorDetails object`

    The request's `Content-Type` header names a charset other than UTF-8, ISO-8859-1 or US-ASCII. Send the request with no charset, or with one of these.

    - `error_code: "unsupported_charset"`

  - `BetaPluginNameTakenErrorDetails object`

    The marketplace already holds this name. `plugin_id` is the Plugin that holds it, and can be absent.

    - `error_code: "plugin_name_taken"`

    - `plugin_id: optional string or null`

  - `BetaSkillNameTakenErrorDetails object`

    One of the Plugin's skills has the name of an organization skill. `skill_name` is that name.

    - `error_code: "skill_name_taken"`

    - `skill_name: string`

  - `BetaRegistrationPendingErrorDetails object`

    The Plugin version was stored but is not yet usable in claude.ai. `plugin_id` and `plugin_version_id` identify what was stored.

    - `error_code: "registration_pending"`

    - `plugin_id: string`

    - `plugin_version_id: string`

  - `BetaScanFailedErrorDetails object`

    The version in `plugin_version_id` did not pass its content scan, so it cannot be served.

    - `error_code: "scan_failed"`

    - `plugin_version_id: string`

  - `BetaScanPendingErrorDetails object`

    The content scan of the version in `plugin_version_id` is still running. Retry once the scan finishes.

    - `error_code: "scan_pending"`

    - `plugin_version_id: string`

  - `BetaRequestBodyTimeoutErrorDetails object`

    The request body did not finish arriving in time, so nothing was done. Send a smaller body, or send it over a faster connection.

    - `error_code: "request_body_timeout"`

  - `BetaSettingsDocumentLimitExceededErrorDetails object`

    The organization has reached its limit of settings documents, counting unused ones. An owner can remove unused documents in claude.ai. Deleting a group's settings or clearing the default settings also frees a document, if nothing else uses it. None of these works once the organization has also reached its settings history limit.

    - `error_code: "settings_document_limit_exceeded"`

  - `BetaSettingsHistoryLimitExceededErrorDetails object`

    The organization has reached its settings history limit, a cap on stored versions of its settings documents. Nothing in the API or claude.ai lowers the count, so contact support. Creating or deleting group settings, creating or clearing the default settings, and reordering are refused. Changing the mode still works, unless it would copy the organization settings into a new default.

    - `error_code: "settings_history_limit_exceeded"`

  - `BetaCMEKFeatureUnsupportedErrorDetails object`

    This stored settings document currently cannot be read or replaced. Contact support, or, if you no longer need these settings, delete the group's settings or clear the default.

    - `error_code: "cmek_feature_unsupported"`

  - `BetaRBACGroupManagedSettingsNotFoundErrorDetails object`

    This RBAC Group has no Claude Code managed settings.

    - `error_code: "rbac_group_managed_settings_not_found"`

  - `BetaRBACGroupOrderLimitExceededErrorDetails object`

    The RBAC Group order already has the most groups allowed. Delete another group's settings first.

    - `error_code: "rbac_group_order_limit_exceeded"`

  - `BetaRBACGroupNotFoundErrorDetails object`

    The RBAC Group is not one of the organization's groups.

    - `error_code: "rbac_group_not_found"`

  - `BetaSlackChannelSetUpSettingsRefusedErrorDetails object`

    The request set the channel up, and `settings` was then refused. The channel stays set up with every setting unset.

    - `error_code: "slack_channel_set_up_settings_refused"`

      A stable code that names the cause.

    - `slack_channel_id: string`

      The identifier of the channel the request set up, starting with `slch_`.

  - `BetaAPIKeyScopeMissingErrorDetails object`

    The API key lacks the scope the request needs: `read:claude_tag` for a read, `write:claude_tag` for a change.

    - `error_code: "api_key_scope_missing"`

  - `BetaClaudeTagWritesNotEnabledErrorDetails object`

    Changes through the Claude Tag API are not enabled for the organization.

    - `error_code: "claude_tag_writes_not_enabled"`

  - `BetaComplianceConfigurationRestrictedErrorDetails object`

    The organization's compliance configuration does not let Claude Tag store anything new.

    - `error_code: "compliance_configuration_restricted"`

  - `BetaOrganizationLevelScopedAPIKeyRequiredErrorDetails object`

    The credential is not a scoped API key that is bound at the organization level.

    - `error_code: "organization_level_scoped_api_key_required"`

  - `BetaEnvironmentNotFoundErrorDetails object`

    `settings.environment_id` names no Environment within the organization's reach.

    - `error_code: "environment_not_found"`

  - `BetaSlackChannelSetUpEnvironmentNotFoundErrorDetails object`

    `settings.environment_id` names no Environment within the organization's reach, and the request had set the channel up by then. The channel stays set up with every setting unset.

    - `error_code: "slack_channel_set_up_environment_not_found"`

    - `slack_channel_id: string`

      The identifier of the channel the request set up, starting with `slch_`.

  - `BetaSlackChannelSetUpSettingsConflictErrorDetails object`

    The request set the channel up, and something else then changed the channel or removed it. Nothing of `settings` was stored.

    - `error_code: "slack_channel_set_up_settings_conflict"`

      A stable code that names the cause.

    - `slack_channel_id: string`

      The identifier of the channel the request set up, starting with `slch_`.

  - `BetaBundleAttachmentNotSupportedErrorDetails object`

    The Bundle has an attachment this API does not support editing, so its instructions can be changed only in claude.ai.

    - `error_code: "bundle_attachment_not_supported"`

  - `BetaBundleOnCallErrorDetails object`

    This Bundle's instructions are managed in claude.ai and can't be changed through the API.

    - `error_code: "bundle_on_call"`

### Error Object

- `ErrorObject = InvalidRequestErrorObject or AuthenticationErrorObject or BillingErrorObject or 6 more`

  - `InvalidRequestErrorObject object`

    - `type: "invalid_request_error"`

      The broad category of the error.

      default: invalid_request_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Invalid request

  - `AuthenticationErrorObject object`

    - `type: "authentication_error"`

      The broad category of the error.

      default: authentication_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Authentication error

  - `BillingErrorObject object`

    - `type: "billing_error"`

      The broad category of the error.

      default: billing_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Billing error

  - `PermissionErrorObject object`

    - `type: "permission_error"`

      The broad category of the error.

      default: permission_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Permission denied

  - `NotFoundErrorObject object`

    - `type: "not_found_error"`

      The broad category of the error.

      default: not_found_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Not found

  - `RateLimitErrorObject object`

    - `type: "rate_limit_error"`

      The broad category of the error.

      default: rate_limit_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Rate limited

  - `GatewayTimeoutErrorObject object`

    - `type: "timeout_error"`

      The broad category of the error.

      default: timeout_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Request timeout

  - `APIErrorObject object`

    - `type: "api_error"`

      The broad category of the error.

      default: api_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Internal server error

  - `OverloadedErrorObject object`

    - `type: "overloaded_error"`

      The broad category of the error.

      default: overloaded_error

    - `message: string`

      A human-readable explanation of the error. Its wording can change, so don't match on it.

      default: Overloaded

### Error Response

- `ErrorResponse object`

  - `type: "error"`

    default: error

  - `error: ErrorObject`

    - `InvalidRequestErrorObject object`

      - `type: "invalid_request_error"`

        The broad category of the error.

        default: invalid_request_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Invalid request

    - `AuthenticationErrorObject object`

      - `type: "authentication_error"`

        The broad category of the error.

        default: authentication_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Authentication error

    - `BillingErrorObject object`

      - `type: "billing_error"`

        The broad category of the error.

        default: billing_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Billing error

    - `PermissionErrorObject object`

      - `type: "permission_error"`

        The broad category of the error.

        default: permission_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Permission denied

    - `NotFoundErrorObject object`

      - `type: "not_found_error"`

        The broad category of the error.

        default: not_found_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Not found

    - `RateLimitErrorObject object`

      - `type: "rate_limit_error"`

        The broad category of the error.

        default: rate_limit_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Rate limited

    - `GatewayTimeoutErrorObject object`

      - `type: "timeout_error"`

        The broad category of the error.

        default: timeout_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Request timeout

    - `APIErrorObject object`

      - `type: "api_error"`

        The broad category of the error.

        default: api_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Internal server error

    - `OverloadedErrorObject object`

      - `type: "overloaded_error"`

        The broad category of the error.

        default: overloaded_error

      - `message: string`

        A human-readable explanation of the error. Its wording can change, so don't match on it.

        default: Overloaded

  - `request_id: string or null`

### Error Type

- `ErrorType = "invalid_request_error" or "authentication_error" or "billing_error" or 9 more`

  - `"invalid_request_error"`

  - `"authentication_error"`

  - `"billing_error"`

  - `"permission_error"`

  - `"not_found_error"`

  - `"rate_limit_error"`

  - `"timeout_error"`

  - `"api_error"`

  - `"overloaded_error"`

  - `"memory_precondition_failed_error"`

  - `"memory_path_conflict_error"`

  - `"conflict_error"`

### Gateway Timeout Error Object

- `GatewayTimeoutErrorObject object`

  - `type: "timeout_error"`

    The broad category of the error.

    default: timeout_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Request timeout

### Invalid Request Error Object

- `InvalidRequestErrorObject object`

  - `type: "invalid_request_error"`

    The broad category of the error.

    default: invalid_request_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Invalid request

### Linked Organization Billing Unavailable Error Details

- `LinkedOrganizationBillingUnavailableErrorDetails object`

  - `error_code: "linked_organization_billing_unavailable"`

### Linked Organization Spend Limit Reached Error Details

- `LinkedOrganizationSpendLimitReachedErrorDetails object`

  - `error_code: "linked_organization_spend_limit_reached"`

### Not Found Error Object

- `NotFoundErrorObject object`

  - `type: "not_found_error"`

    The broad category of the error.

    default: not_found_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Not found

### Organization On Hold Error Details

- `OrganizationOnHoldErrorDetails object`

  - `error_code: "organization_on_hold"`

  - `appeal_url: optional string or null`

### Organization Type Not Supported Error Details

- `OrganizationTypeNotSupportedErrorDetails object`

  - `error_code: "organization_type_not_supported"`

### Overloaded Error Object

- `OverloadedErrorObject object`

  - `type: "overloaded_error"`

    The broad category of the error.

    default: overloaded_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Overloaded

### Parent Organization Required Error Details

- `ParentOrganizationRequiredErrorDetails object`

  - `error_code: "parent_organization_required"`

### Permission Error Object

- `PermissionErrorObject object`

  - `type: "permission_error"`

    The broad category of the error.

    default: permission_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Permission denied

### Ramp Limit Exceeded Error Details

- `RampLimitExceededErrorDetails object`

  - `error_code: "ramp_limit_exceeded"`

### Rate Limit Error Object

- `RateLimitErrorObject object`

  - `type: "rate_limit_error"`

    The broad category of the error.

    default: rate_limit_error

  - `message: string`

    A human-readable explanation of the error. Its wording can change, so don't match on it.

    default: Rate limited

### Request Body Encoding Invalid Error Details

- `RequestBodyEncodingInvalidErrorDetails object`

  - `error_code: "request_body_encoding_invalid"`

### Request Body Encoding Unsupported Error Details

- `RequestBodyEncodingUnsupportedErrorDetails object`

  - `error_code: "request_body_encoding_unsupported"`

### Request Body Too Large After Decoding Error Details

- `RequestBodyTooLargeAfterDecodingErrorDetails object`

  - `error_code: "request_body_too_large_after_decoding"`

### Sandbox Egress Restricted Error Details

- `SandboxEgressRestrictedErrorDetails object`

  - `error_code: "sandbox_egress_restricted"`

### Workspace Human Review Disabled Error Details

- `WorkspaceHumanReviewDisabledErrorDetails object`

  - `error_code: "workspace_human_review_disabled"`

## Errors

### claude_code_key_creator_not_member

HTTP status 400

- `"claude_code_key_creator_not_member"`

  The API key belongs to the Claude Code workspace, and the user who created it is no longer a member of the organization or of that workspace.

  - `details: ClaudeCodeKeyCreatorNotMemberErrorDetails`

    - `error_code: "claude_code_key_creator_not_member"`

### claude_code_version_too_old

HTTP status 400

- `"claude_code_version_too_old"`

  The request comes from a Claude Code version older than the minimum that the requested model or the organization requires. Update Claude Code, then retry.

  - `details: ClaudeCodeVersionTooOldErrorDetails`

    - `error_code: "claude_code_version_too_old"`

### cmek_key_disabled

HTTP status 400

- `"cmek_key_disabled"`

  The workspace's customer-managed encryption key is disabled or revoked. Re-enable the key, then retry.

  - `details: CMEKKeyDisabledErrorDetails`

    - `error_code: "cmek_key_disabled"`

### cmek_key_network_blocked

HTTP status 400

- `"cmek_key_network_blocked"`

  The key management service's network access controls blocked the request to the workspace's customer-managed encryption key. The key itself may be healthy.

  - `details: CMEKKeyNetworkBlockedErrorDetails`

    - `error_code: "cmek_key_network_blocked"`

### organization_on_hold

HTTP status 400

- `"organization_on_hold"`

  Anthropic has disabled the organization for trust and safety reasons. An organization disabled for any other reason, such as billing, does not get this code. `appeal_url`, when present, is where the organization can appeal.

  - `details: OrganizationOnHoldErrorDetails`

    - `error_code: "organization_on_hold"`

    - `appeal_url: optional string or null`

### organization_type_not_supported

HTTP status 400

- `"organization_type_not_supported"`

  The endpoint does not support the organization's type. Each endpoint's description says which organization types it supports.

  - `details: OrganizationTypeNotSupportedErrorDetails`

    - `error_code: "organization_type_not_supported"`

### parent_organization_required

HTTP status 400

- `"parent_organization_required"`

  The endpoint serves only organizations that belong to a parent organization, and this organization belongs to none.

  - `details: ParentOrganizationRequiredErrorDetails`

    - `error_code: "parent_organization_required"`

### request_body_encoding_invalid

HTTP status 400

- `"request_body_encoding_invalid"`

  The request body is not valid for its `Content-Encoding`.

  - `details: RequestBodyEncodingInvalidErrorDetails`

    - `error_code: "request_body_encoding_invalid"`

### request_body_encoding_unsupported

HTTP status 400

- `"request_body_encoding_unsupported"`

  The request's `Content-Encoding` is not supported.

  - `details: RequestBodyEncodingUnsupportedErrorDetails`

    - `error_code: "request_body_encoding_unsupported"`

### workspace_human_review_disabled

HTTP status 400

- `"workspace_human_review_disabled"`

  The request's Workspace has Human Review turned off, and this operation is not available there. Use a Workspace with Human Review on.

  - `details: WorkspaceHumanReviewDisabledErrorDetails`

    - `error_code: "workspace_human_review_disabled"`

### linked_organization_billing_unavailable

HTTP status 402

- `"linked_organization_billing_unavailable"`

  Anthropic cannot currently bill the organization linked to the request's user profile, for a reason that lies with that organization's own account. The response does not say what the reason is.

  - `details: LinkedOrganizationBillingUnavailableErrorDetails`

    - `error_code: "linked_organization_billing_unavailable"`

### linked_organization_spend_limit_reached

HTTP status 402

- `"linked_organization_spend_limit_reached"`

  The organization linked to the request's user profile has reached a spend limit that it set, or lacks credit for the request. The response does not say which applies.

  - `details: LinkedOrganizationSpendLimitReachedErrorDetails`

    - `error_code: "linked_organization_spend_limit_reached"`

### sandbox_egress_restricted

HTTP status 403

- `"sandbox_egress_restricted"`

  The request came from a Claude sandbox with restricted network access, which is not allowed to make this request. Send it from outside the sandbox, or from a sandbox with unrestricted network access.

  - `details: SandboxEgressRestrictedErrorDetails`

    - `error_code: "sandbox_egress_restricted"`

### request_body_too_large_after_decoding

HTTP status 413

- `"request_body_too_large_after_decoding"`

  The compressed request body exceeds the request size limit once decoded.

  - `details: RequestBodyTooLargeAfterDecodingErrorDetails`

    - `error_code: "request_body_too_large_after_decoding"`

### contract_spend_limit_reached

HTTP status 429

- `"contract_spend_limit_reached"`

  The organization has reached the spend limit of its contract.

  - `details: ContractSpendLimitReachedErrorDetails`

    - `error_code: "contract_spend_limit_reached"`

### enforced_spend_limit_reached

HTTP status 429

- `"enforced_spend_limit_reached"`

  The organization has crossed the monthly API usage threshold of its API tier.

  - `details: EnforcedSpendLimitReachedErrorDetails`

    - `error_code: "enforced_spend_limit_reached"`

### ramp_limit_exceeded

HTTP status 429

- `"ramp_limit_exceeded"`

  The request would exceed a ramp limit, which caps how fast usage can grow. Retry after the time in the `retry-after` header.

  - `details: RampLimitExceededErrorDetails`

    - `error_code: "ramp_limit_exceeded"`

### cmek_context_unavailable

HTTP status 503

- `"cmek_context_unavailable"`

  The workspace's encryption settings could not be read, so the request was refused. Retry in a few minutes.

  - `details: CMEKContextUnavailableErrorDetails`

    - `error_code: "cmek_context_unavailable"`

### cmek_key_unreachable

HTTP status 503

- `"cmek_key_unreachable"`

  The workspace's customer-managed encryption key could not be reached. Retry the request; if this continues, check that the key is available in your key management service, or contact Anthropic support.

  - `details: CMEKKeyUnreachableErrorDetails`

    - `error_code: "cmek_key_unreachable"`
