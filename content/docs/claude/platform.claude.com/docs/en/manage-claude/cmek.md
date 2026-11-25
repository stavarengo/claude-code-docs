---
title: Customer-managed encryption keys
url: https://platform.claude.com/docs/en/manage-claude/cmek
description: Use a key you hold in your own cloud to encrypt data that Claude stores.
---

Ask Claude Code about this feature

```text
/claude-api tell me about customer-managed encryption keys
```

With customer-managed encryption keys (CMEK), you create a key in your own AWS KMS, Google Cloud KMS, or Azure Key Vault. Anthropic uses it to encrypt certain data at rest. The key stays under your control, so you can rotate it, audit its use, and remove Anthropic’s access.

## Choose your setup page

Choose the service that holds your key. [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) uses Google Cloud KMS keys. Claude Platform on AWS uses AWS KMS but has its own page.

<CardGroup cols={2}>
  <Card title="AWS KMS" href="https://platform.claude.com/docs/en/manage-claude/cmek-aws-kms?sdk_languages=cli">
    For Claude Platform and Claude Enterprise.
  </Card>

  <Card title="Google Cloud KMS" href="https://platform.claude.com/docs/en/manage-claude/cmek-google-cloud-kms?sdk_languages=cli">
    For Claude Platform, Claude Enterprise, and Claude Models on Google Cloud (Anthropic managed).
  </Card>

  <Card title="Azure Key Vault" href="https://platform.claude.com/docs/en/manage-claude/cmek-azure-key-vault?sdk_languages=cli">
    For Claude Platform and Claude Enterprise.
  </Card>

  <Card title="Claude Platform on AWS" href="https://platform.claude.com/docs/en/manage-claude/cmek-claude-platform-on-aws?sdk_languages=cli">
    For organizations whose Claude Console sidebar shows **Account managed by AWS**.
  </Card>
</CardGroup>

On Claude Platform, you can also [add and attach an encryption key with the Admin API](https://platform.claude.com/docs/en/manage-claude/cmek-admin-api?sdk_languages=cli).

## Understand CMEK before you set it up

Which product you use decides what your key encrypts, what stays under Anthropic’s key, and which features turn off or change.

<CardGroup cols={2}>
  <Card title="How CMEK works" href="https://platform.claude.com/docs/en/manage-claude/cmek-how-it-works?sdk_languages=cli">
    How your key protects data, when it takes effect, and what you can see.
  </Card>

  <Card title="CMEK, data retention, and ZDR" href="https://platform.claude.com/docs/en/manage-claude/cmek-data-retention?sdk_languages=cli">
    Using a key with zero data retention (ZDR), and what Anthropic can preserve outside your key.
  </Card>

  <Card title="What CMEK covers on Claude Platform" href="https://platform.claude.com/docs/en/manage-claude/cmek-coverage-claude-platform?sdk_languages=cli">
    Look up a feature or a kind of data.
  </Card>

  <Card title="What CMEK covers on Claude Enterprise" href="https://platform.claude.com/docs/en/manage-claude/cmek-coverage-claude-enterprise?sdk_languages=cli">
    Look up a feature, and see what your users will notice.
  </Card>
</CardGroup>

## What you commit to

* Once you attach a key, you [can’t remove or replace it](https://platform.claude.com/docs/en/manage-claude/cmek-key-lifecycle?sdk_languages=cli#what-each-action-does).
* Your key protects only data written [after it takes effect](https://platform.claude.com/docs/en/manage-claude/cmek-how-it-works?sdk_languages=cli#when-your-key-takes-effect).
* If your key is deleted, Anthropic can’t recover the data it protects. Within about an hour of disabling your key, Anthropic can no longer decrypt that data. See [What each action does](https://platform.claude.com/docs/en/manage-claude/cmek-key-lifecycle?sdk_languages=cli#what-each-action-does).
* On Claude Platform, a workspace with a key [must retain data](https://platform.claude.com/docs/en/manage-claude/cmek-data-retention?sdk_languages=cli#data-retention).
* When Anthropic approves your whole organization for CMEK, it also enables [Access Transparency](https://platform.claude.com/docs/en/manage-claude/access-transparency?sdk_languages=cli#access-transparency-with-customer-managed-keys) for that organization. On Claude Platform, if you got access through [Enterprise Frontier Safeguards](https://platform.claude.com/docs/en/manage-claude/enterprise-frontier-safeguards/overview?sdk_languages=cli) or Enterprise Data Controls, attaching your first key turns on Access Transparency instead, unless it’s already on. Organizations with Access Transparency can’t call the Claude API directly from a browser.

## Who can use CMEK

CMEK is optional. To turn it on for an eligible organization, contact your Anthropic account team. You need one of these roles to set it up:

* Claude Platform: Organization Admin
* Claude Platform on AWS: Admin
* Claude Models on Google Cloud (Anthropic managed): [Claude Admin](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli#iam-roles) (`roles/claude.admin`)
* Claude Enterprise: Owner or Primary Owner

## After setup

* [What happens when you rotate, disable, or delete your encryption key](https://platform.claude.com/docs/en/manage-claude/cmek-key-lifecycle?sdk_languages=cli)
* [Troubleshoot CMEK](https://platform.claude.com/docs/en/manage-claude/cmek-troubleshooting?sdk_languages=cli)
