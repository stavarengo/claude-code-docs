---
title: Add and attach an encryption key with the Admin API
url: https://platform.claude.com/docs/en/manage-claude/cmek-admin-api
description: Create, validate, and attach a customer-managed encryption key with three Admin API calls.
---

These calls work on Claude Platform. On Claude Enterprise or Claude Platform on AWS, follow [your setup page](https://platform.claude.com/docs/en/manage-claude/cmek?sdk_languages=cli#set-it-up).

Creating an external key is what **Add key** does in the Claude Console, and validating it is what **Verify** does.

## Before you start

* Customer-managed encryption keys (CMEK) are [turned on for your organization](https://platform.claude.com/docs/en/manage-claude/cmek?sdk_languages=cli#availability).
* You have an [Admin API key](https://platform.claude.com/docs/en/manage-claude/admin-api-keys?sdk_languages=cli). The samples read it from `ANTHROPIC_API_KEY`.
* You’ve created your key in [AWS KMS](https://platform.claude.com/docs/en/manage-claude/cmek-aws-kms?sdk_languages=cli#encryption-key-setup), [Google Cloud KMS](https://platform.claude.com/docs/en/manage-claude/cmek-google-cloud-kms?sdk_languages=cli#encryption-key-setup), or [Azure Key Vault](https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault?sdk_languages=cli#encryption-key-setup), and kept the values the setup steps tell you to copy.
* You have a workspace that [retains data](https://platform.claude.com/docs/en/manage-claude/cmek-data-retention?sdk_languages=cli#data-retention), ideally a new one, because [existing data stays under Anthropic’s key](https://platform.claude.com/docs/en/manage-claude/cmek-how-it-works?sdk_languages=cli#when-your-key-takes-effect).

## Create, validate, and attach the key

<Steps>
  <Step title="Create the external key">
    <Tabs>
      <Tab title="AWS">
        Replace `<friendly-name>` with a display name and `<key-arn-from-create-key-step>` with the key ARN.

        <CodeGroup>
          ```bash CLI
          ant organization:external-keys create <<'YAML'
          display_name: "<friendly-name>"
          geo: us
          provider_config:
            type: aws
            kms_arn: "<key-arn-from-create-key-step>"
          YAML
          ```
        </CodeGroup>
      </Tab>

      <Tab title="Google Cloud">
        Replace `<friendly-name>` with a display name. Replace the value that starts with `projects/` with the full key resource name.

        <CodeGroup>
          ```bash CLI
          ant organization:external-keys create <<'YAML'
          display_name: "<friendly-name>"
          geo: us
          provider_config:
            type: gcp
            key_name: "projects/<your-project-id>/locations/<region>/keyRings/<your-keyring-name>/cryptoKeys/<your-key-name>"
          YAML
          ```
        </CodeGroup>
      </Tab>

      <Tab title="Azure">
        Replace the placeholders:

        * `<friendly-name>`: a display name
        * `https://<your-vault-name>.vault.azure.net/`: the vault URI
        * `<your-key-name>`: the key name
        * `<your-tenant-id>`: the vault’s tenant ID

        <CodeGroup>
          ```bash CLI
          ant organization:external-keys create <<'YAML'
          display_name: "<friendly-name>"
          geo: us
          provider_config:
            type: azure
            vault_uri: "https://<your-vault-name>.vault.azure.net/"
            key_name: "<your-key-name>"
            tenant_id: "<your-tenant-id>"
          YAML
          ```
        </CodeGroup>
      </Tab>
    </Tabs>

    The `id` in the response is the external key ID. Copy it for the next two steps.

    ```json
    {
      "type": "external_key",
      "id": "ekey_<id>",
      "display_name": "<friendly-name>"
    }
    ```
  </Step>

  <Step title="Validate the key">
    Replace `ekey_<id>` with the external key ID.

    <CodeGroup>
      ```bash CLI
      ant organization:external-keys validate --external-key-id "ekey_<id>"
      ```
    </CodeGroup>

    A successful response looks like this:

    ```json
    { "type": "external_key_validation", "status": "success", "error": null }
    ```

    If `status` is `failure`, the `error` field says why. See [Troubleshoot CMEK](https://platform.claude.com/docs/en/manage-claude/cmek-troubleshooting?sdk_languages=cli).
  </Step>

  <Step title="Attach the key to a workspace">
    <Warning>
      Attaching a key [can’t be undone](https://platform.claude.com/docs/en/manage-claude/cmek-key-lifecycle?sdk_languages=cli#what-each-action-does). If the key is deleted, Anthropic can’t recover the data it protects.
    </Warning>

    Replace `<workspace-id>` with the workspace ID, which starts with `wrkspc_`, and `ekey_<id>` with the external key ID.

    <CodeGroup>
      ```bash CLI
      ant organization:workspaces update \
        --workspace-id "<workspace-id>" \
        --external-key-id "ekey_<id>"
      ```
    </CodeGroup>

    The response shows the attached key’s ID in `external_key_id`. If the request is refused, [look up the error](https://platform.claude.com/docs/en/manage-claude/cmek-troubleshooting?sdk_languages=cli#refused).
  </Step>
</Steps>
