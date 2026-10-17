---
title: Configure Azure Key Vault for CMEK
url: https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault
description: Use Azure Key Vault to provide an encryption key for your organization.
---

Let Claude Code set up this feature for you

```text
/claude-api help me configure a customer-managed encryption key with Azure Key Vault
```

This guide shows how to use an Azure Key Vault key as a [customer-managed encryption key (CMEK)](https://platform.claude.com/docs/en/manage-claude/cmek?sdk_languages=cli) for your Anthropic organization.

<Warning>
  Enabling CMEK is permanent. If your Key Vault key is deleted or disabled, Anthropic cannot recover the data encrypted under it. Review the [warnings and limitations](https://platform.claude.com/docs/en/manage-claude/cmek?sdk_languages=cli) before you start.
</Warning>

## Prerequisites

* An Azure Key Vault with these settings:

  * RBAC authorization is enabled (`enableRbacAuthorization: true`).
  * Public network access is allowed. Private endpoints are not supported.
  * Purge protection is enabled (`enablePurgeProtection: true`). You can't turn off purge protection after you enable it.
  * Diagnostic settings route the `AuditEvent` log category to Log Analytics, a storage account, or an event hub. Without them, you have no audit trail of Anthropic's key operations, such as `KeyWrap`, `KeyUnwrap`, and `KeyGet`.

* Permissions to create keys in the vault and to assign RBAC roles on it.

* Permissions to create service principals in your Entra tenant (`Application Administrator`, `Cloud Application Administrator`, or an equivalent custom role).

* The [`az` CLI](https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) installed and authenticated, or Cloud Shell in the Azure portal. Some steps have no portal equivalent.

* To register the key through the API, an Anthropic Admin API key for your organization.

## Anthropic app information

You give the following Anthropic multitenant application access to your key. The application requests no Microsoft Graph permissions.

| Field                          | Value                                  |
| ------------------------------ | -------------------------------------- |
| Multitenant app client ID (US) | `8635ae1a-3e5d-44e8-a4ed-e0f614466f87` |
| App display name               | `anthropic-cmek-client-us`             |

<Warning>
  Use only this published client ID and display name. Never trust an identifier provided over email, chat, or any onboarding channel.
</Warning>

## Encryption key setup

The key must meet these requirements:

* **Type:** RSA, 3072-bit or larger. For an HSM-backed key, use `RSA-HSM`, which requires a Premium-SKU vault.
* **Permitted operations:** `wrapKey` and `unwrapKey`. The steps in this guide turn off every other operation, so Anthropic can only read the key and wrap and unwrap with it.
* **Organization tag:** `anthropic-org-<ORGANIZATION_UUID>` with the value `true`. Replace `<ORGANIZATION_UUID>` with your Anthropic organization ID in lowercase. Validation fails without the tag.
* **Access:** the `Key Vault Crypto User` role for Anthropic's service principal, assigned on the key.

<Note>
  **Finding your organization ID:** Use the bare UUID, not the `org_`-prefixed ID. Copy it from one of these places:

  * **Claude Console:** the **Organization ID** field on the [Organization](https://platform.claude.com/settings/organization) page (`platform.claude.com/settings/organization`)
  * **claude.ai:** the **Organization ID** field under **Organization settings > Organization**
  * **Admin API:** the `id` field from the [Organization Info](https://platform.claude.com/docs/en/api/organization/retrieve?sdk_languages=cli) endpoint
</Note>

### Create the key and grant access

<Tabs>
  <Tab title="Azure portal">
    <Steps>
      <Step title="Create Anthropic's service principal">
        Open Cloud Shell from the portal's top navigation bar. Run this command:

        ```bash
        az ad sp create --id 8635ae1a-3e5d-44e8-a4ed-e0f614466f87
        ```

        If the service principal already exists, continue to the next step.
      </Step>

      <Step title="Confirm the service principal exists">
        Go to **Microsoft Entra ID > Enterprise applications** and clear the default application-type filter. Search for `anthropic-cmek-client-us`.

        <Frame caption="The anthropic-cmek-client-us service principal in Entra enterprise applications.">
          ![Microsoft Entra enterprise application overview for anthropic-cmek-client-us, showing its Application ID and Object ID.](https://platform.claude.com/docs/images/cmek/azure-service-principal.png)
        </Frame>
      </Step>

      <Step title="Open the Create a key page">
        Open your key vault and select **Keys**. Click **Generate/Import**.
      </Step>

      <Step title="Create an RSA key in your vault">
        Set these values:

        * **Name:** a name for the key
        * **Key type:** RSA
        * **RSA key size:** 3072 or larger

        Click the link next to **Tags**.
      </Step>

      <Step title="Add the organization tag">
        Enter these values:

        * **Tag Name:** `anthropic-org-<ORGANIZATION_UUID>`
        * **Tag Value:** `true`

        Click **OK**, then click **Create**.

        <Frame caption="Create an RSA key sized 3072 or larger, with the tag anthropic-org-<ORGANIZATION_UUID> set to true.">
          ![Azure Key Vault Create a key page with RSA, 3072 key size, and the anthropic-org tag set to true.](https://platform.claude.com/docs/images/cmek/azure-create-key-tag.png)
        </Frame>
      </Step>

      <Step title="Limit the permitted operations">
        Open the new key, then open its current version. Under **Permitted operations**, clear every checkbox except **Wrap Key** and **Unwrap Key**. Click **Save**.

        <Frame caption="Restrict permitted operations to Wrap Key and Unwrap Key. The key version shows the organization tag.">
          ![Azure Key Vault key version with 1 tag and Permitted operations limited to Wrap Key and Unwrap Key.](https://platform.claude.com/docs/images/cmek/azure-permitted-operations-tag.png)
        </Frame>
      </Step>

      <Step title="Open the key's access control">
        Open the key itself, not the vault. Select its **Access control (IAM)** tab and click **Add > Add role assignment**.
      </Step>

      <Step title="Select the role">
        On the **Role** tab, select **Key Vault Crypto User**. Click **Next**.
      </Step>

      <Step title="Add Anthropic's service principal">
        On the **Members** tab, click **Select members**. Search for `anthropic-cmek-client-us` and select it. Click **Select**, then click **Next**.
      </Step>

      <Step title="Review and assign">
        On the **Review + assign** tab, click **Review + assign**.
      </Step>
    </Steps>

    To use a key you already have, follow these steps instead of steps 3 to 6, then continue from step 7:

    1. In your key vault, select **Keys** and open the key. Open its current version.
    2. Click the link next to **Tags**.
    3. Add the organization tag and click **OK**.
    4. Under **Permitted operations**, clear every checkbox except **Wrap Key** and **Unwrap Key**.
    5. Click **Save**.
  </Tab>

  <Tab title="Azure CLI">
    <Steps>
      <Step title="Create Anthropic's service principal">
        ```bash
        az ad sp create --id 8635ae1a-3e5d-44e8-a4ed-e0f614466f87
        ```

        Copy the `id` field from the output.

        If the command exits with an "already exists" error, get the `id` with this command instead:

        ```bash
        az ad sp show --id 8635ae1a-3e5d-44e8-a4ed-e0f614466f87 --query id -o tsv
        ```
      </Step>

      <Step title="Create an RSA key in your vault">
        ```bash
        az keyvault key create \
          --vault-name <your-vault-name> \
          --name <your-key-name> \
          --kty RSA --size 3072 \
          --ops wrapKey unwrapKey \
          --tags anthropic-org-<ORGANIZATION_UUID>=true
        ```

        Replace the placeholders:

        * **`<your-vault-name>`:** the name of your key vault
        * **`<your-key-name>`:** a name for the key
        * **`<ORGANIZATION_UUID>`:** your Anthropic organization ID in lowercase

        For an HSM-backed key, use `--kty RSA-HSM`.
      </Step>

      <Step title="Grant the Anthropic service principal access to your key">
        ```bash
        VAULT_ID=$(az keyvault show --name <your-vault-name> --query id -o tsv)

        az role assignment create \
          --role "Key Vault Crypto User" \
          --assignee-object-id <sp-object-id> \
          --assignee-principal-type ServicePrincipal \
          --scope "${VAULT_ID}/keys/<your-key-name>"
        ```

        Replace the placeholders:

        * **`<your-vault-name>`:** the name of your key vault
        * **`<sp-object-id>`:** the `id` value from the first step
        * **`<your-key-name>`:** the name of the key
      </Step>
    </Steps>

    To use a key you already have, run this command instead of step 2:

    ```bash
    az keyvault key set-attributes \
      --vault-name <your-vault-name> \
      --name <your-key-name> \
      --ops wrapKey unwrapKey \
      --tags anthropic-org-<ORGANIZATION_UUID>=true
    ```

    This replaces the version's existing tags. Add each existing tag to `--tags` as `name=value`.
  </Tab>
</Tabs>

<Note>
  **Optional:**

  * To share one key among several Anthropic organizations, add one organization tag for each. A key version can carry at most 15 tags, including your own.
  * If the vault holds only this key, you can assign the role on the vault instead of the key.
</Note>

### Check your vault configuration

Run this command with the Azure CLI or in Cloud Shell. Replace `<your-vault-name>` with the name of your key vault.

```bash
az keyvault show --name <your-vault-name> \
  --query "{rbac:properties.enableRbacAuthorization, purge:properties.enablePurgeProtection, pub:properties.publicNetworkAccess, net:properties.networkAcls.defaultAction, ipRules:properties.networkAcls.ipRules, uri:properties.vaultUri, tenantId:properties.tenantId}"
```

Confirm these values:

* `rbac`: `true`
* `purge`: `true`. If it's `false` or `null`, enable purge protection before you continue.
* `pub`: `"Enabled"`. If it's `"Disabled"`, turn on public network access.
* `net`: `"Allow"`, or `"Deny"` with Anthropic's outbound IP ranges in `ipRules`. For the ranges, see [Outbound IP addresses](https://platform.claude.com/docs/en/api/ip-addresses?sdk_languages=cli#outbound-ip-addresses).

Copy these values to register the key:

* `uri`: the vault URI
* `tenantId`: the ID of the tenant that governs the vault

## Register the key with Anthropic

<Tabs>
  <Tab title="Claude Platform">
    <Tabs>
      <Tab title="Claude Console">
        <Steps>
          <Step title="Open the encryption key settings">
            In the Claude Console, go to the [Data retention](https://platform.claude.com/settings/privacy#encryption-keys) page (`platform.claude.com/settings/privacy`). If you don't see **Encryption keys**, select **Organization** from the dropdown menu at the top of the page.
          </Step>

          <Step title="Add the key">
            Under **Encryption keys**, click **Add key**. Enter a **Display name** and select **Azure Key Vault**. Click **Continue**.
          </Step>

          <Step title="Enter the key details">
            The dialog box shows an **Organization tag**. Check that your key has this tag. Enter these values:

            * **Vault URI:** the `uri` value that you copied
            * **Key name:** the name of the key
            * **Tenant ID:** the `tenantId` value that you copied

            Click **Add**.
          </Step>

          <Step title="Validate the key">
            In the **Encryption keys** list, click **Verify** next to the key. **Connected** appears when the check passes. If it fails, see [Troubleshoot validation](https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault?sdk_languages=cli#troubleshoot-validation) for common causes.
          </Step>

          <Step title="Attach the key to a workspace">
            Attaching a key can't be undone. If you can, attach it to a new workspace before that workspace receives any requests. In a workspace that already receives requests, the key can take [up to a day to take effect](https://platform.claude.com/docs/en/manage-claude/cmek?sdk_languages=cli#how-it-works).

            On the Data retention page, select the workspace from the dropdown menu at the top of the page. Under **Encryption key**, select the key and click **Save**.
          </Step>

          <Step title="Confirm the change">
            Select the checkbox to confirm that you have read the CMEK documentation, then click **Confirm**.
          </Step>
        </Steps>
      </Tab>

      <Tab title="API">
        <Steps>
          <Step title="Create the external key">
            Replace the placeholders:

            * **`<friendly-name>`:** a display name for the key
            * **`<your-vault-name>`:** the name of your key vault
            * **`<your-key-name>`:** the name of the key
            * **`<your-tenant-id>`:** the `tenantId` value that you copied

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

            The `id` field of the response contains the external key ID. Copy it for the next two steps:

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

            If validation fails, the `error` field describes the problem. For common causes, see [Troubleshoot validation](https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault?sdk_languages=cli#troubleshoot-validation).
          </Step>

          <Step title="Attach the key to a workspace">
            Attaching a key can't be undone. If you can, attach it to a new workspace before that workspace receives any requests. In a workspace that already receives requests, the key can take [up to a day to take effect](https://platform.claude.com/docs/en/manage-claude/cmek?sdk_languages=cli#how-it-works).

            Replace `<workspace-id>` with the workspace ID and `ekey_<id>` with the external key ID.

            <CodeGroup>
              ```bash CLI
              ant organization:workspaces update \
                --workspace-id "<workspace-id>" \
                --external-key-id "ekey_<id>"
              ```
            </CodeGroup>
          </Step>
        </Steps>
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Claude Enterprise">
    On Claude Enterprise, CMEK applies to the whole organization, and an organization can have only one key.

    <Steps>
      <Step title="Open the encryption key settings">
        Go to [claude.ai > Organization settings > Data and privacy](https://claude.ai/admin-settings/data-privacy-controls) and find **Encryption keys**.
      </Step>

      <Step title="Add the key">
        Click **Add key**. Enter a **Display name** and select **Azure Key Vault**. Select the checkbox to confirm that you have read the CMEK documentation, then click **Continue**.
      </Step>

      <Step title="Enter the key details">
        The dialog box shows an **Organization tag**. Check that your key has this tag. Enter these values:

        * **Vault URI:** the `uri` value that you copied
        * **Key name:** the name of the key
        * **Tenant ID:** the `tenantId` value that you copied

        Click **Add**.
      </Step>

      <Step title="Confirm that validation passed">
        When the check passes, **Encryption key configured** appears, and your organization is CMEK-protected from then on. If the check fails, see [Troubleshoot validation](https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault?sdk_languages=cli#troubleshoot-validation).
      </Step>
    </Steps>
  </Tab>
</Tabs>

## Troubleshoot validation

If validation fails, common causes are:

* **Wrong organization tag:** Make sure the key's current version has the tag `anthropic-org-<ORGANIZATION_UUID>` with the value `true`. The organization ID must be the bare UUID in lowercase.
* **RBAC propagation delay:** Role assignments can take a few minutes to take effect. Wait and retry.
* **Network ACLs blocking Anthropic:** Confirm public network access and `ipRules`, as described in [Check your vault configuration](https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault?sdk_languages=cli#check-your-vault-configuration).
* **Conditional access policies on workload identities:** If your tenant has conditional access policies that target service principals, exclude the Anthropic service principal. Or add Anthropic's outbound IP ranges to the policy's named locations.

## Terraform

To create the key with Terraform, use the `azurerm` and `azuread` providers.
