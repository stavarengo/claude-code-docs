---
title: Using Agent Skills with the API
url: https://platform.claude.com/docs/en/build-with-claude/skills-guide
description: Learn how to use Agent Skills to extend Claude's capabilities through the API.
---

Agent Skills extend Claude's capabilities through organized folders of instructions, scripts, and resources. This guide shows you how to use both pre-built and custom Skills with the Claude API.

<Note>
  For complete API reference including request/response schemas and all parameters, see:

  * [Skill management API reference](https://platform.claude.com/docs/en/api/skills/list?sdk_languages=cli) - CRUD operations for Skills
  * [Skill versions API reference](https://platform.claude.com/docs/en/api/skills/versions/list?sdk_languages=cli) - Version management
</Note>

<Note>
  To learn how zero data retention (ZDR) applies to this feature, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli).
</Note>

## Quick links

<CardGroup cols={2}>
  <Card title="Get started with Agent Skills in the API" icon="rocket" href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart?sdk_languages=cli">
    Learn how to use Agent Skills to create documents with the Claude API in under 10 minutes.
  </Card>

  <Card title="Skill authoring best practices" icon="hammer" href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices?sdk_languages=cli">
    Learn how to write effective Skills that Claude can discover and use successfully.
  </Card>
</CardGroup>

## Overview

<Note>
  For a detailed look at the architecture and real-world applications of Agent Skills, read the engineering blog post: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

Skills integrate with the Messages API through the [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli). Whether using pre-built Skills managed by Anthropic or custom Skills you've uploaded, the integration shape is identical: both require code execution and use the same `container` structure.

### Using Skills

Skills integrate identically in the Messages API regardless of source. You specify Skills in the `container` parameter with a `skill_id`, `type`, and optional `version`, and they run in the code execution environment.

You can use Skills from two sources:

| Aspect             | Anthropic Skills                           | Custom Skills                                                                                                       |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Type value**     | `anthropic`                                | `custom`                                                                                                            |
| **Skill IDs**      | Short names: `pptx`, `xlsx`, `docx`, `pdf` | Generated: `skill_01AbCdEfGhIjKlMnOpQrStUv`                                                                         |
| **Version format** | Date-based: `20251013` or `latest`         | Version ID: `skver_01AbCdEfGhIjKlMnOpQrStUv` or `latest`                                                            |
| **Management**     | Pre-built and maintained by Anthropic      | Upload and manage through the [Skills API](https://platform.claude.com/docs/en/api/skills/create?sdk_languages=cli) |
| **Availability**   | Available to all users                     | Private to your workspace                                                                                           |

Both skill sources are returned by the [List Skills endpoint](https://platform.claude.com/docs/en/api/skills/list?sdk_languages=cli) (use the `source` parameter to filter). The integration shape and execution environment are identical. The only difference is where the Skills come from and how they're managed.

### Prerequisites

To use Skills, you need:

1. **Claude API key** from the [Claude Console](https://platform.claude.com/settings/keys)
2. **[Code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli)** enabled in your requests

Skills require the code execution tool, so use a model from its [model compatibility list](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#compatibility).

***

## Using Skills in Messages

### Container parameter

Skills are specified using the `container` parameter in the Messages API. You can include up to 20 Skills for each request.

The structure is identical for both Anthropic and custom Skills. Specify the required `type` and `skill_id`, and optionally include `version` to pin to a specific version:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: anthropic
        skill_id: pptx
        version: latest
  messages:
    - role: user
      content: Create a presentation about renewable energy
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

### Downloading generated files

When Skills create documents (Excel, PowerPoint, PDF, Word), they return `file_id` attributes in the response. You must use the Files API to download these files.

**How it works:**

1. Skills create files during code execution.
2. The response includes a `file_id` for each created file, inside code-execution tool result blocks (see [Response format](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#response-format)).
3. Use the Files API to download the actual file content.
4. Save locally or process as needed.

To provide input files for Skills to work on, [upload them with the Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#uploading-a-file) and reference them in your request with a [container upload block](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#container-upload-blocks).

**Example: creating and downloading an Excel file**

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

**Additional Files API operations:**

<CodeGroup>
  ```bash CLI
  # Get file metadata
  ant files retrieve-metadata --file-id "$FILE_ID"

  # List all files
  ant files list

  # Delete a file
  ant files delete --file-id "$FILE_ID"
  ```
</CodeGroup>

<Note>
  For complete details, see [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli).
</Note>

### Multi-turn conversations

The response's `container` object carries the container's `id` and `expires_at` timestamp (see [Container reuse](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#container-reuse) for lifetime details). Reuse the same container across multiple messages by specifying the container ID:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

### Long-running operations

Skills might perform operations that require multiple turns. Handle `pause_turn` stop reasons:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

<Note>
  The response might include a `pause_turn` stop reason, which indicates that the API paused a long-running Skill operation. You can provide the response back as-is in a subsequent request to let Claude continue its turn, or modify the content if you want to interrupt the conversation and provide additional guidance.
</Note>

### Using multiple Skills

Combine multiple Skills in a single request to handle complex workflows:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: anthropic
        skill_id: xlsx
        version: latest
      - type: anthropic
        skill_id: pptx
        version: latest
      - type: custom
        skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
        version: latest
  messages:
    - role: user
      content: Analyze sales data and create a presentation
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

***

## Managing custom Skills

<Warning id="workspace-scoped-access">
  **Custom Skills are accessible to your entire workspace, not scoped to an end user, conversation, or session.** Any API key with access to a workspace can read, use, and delete every custom Skill uploaded to that workspace. Every service account, and every user whose organization role allows API access, can use the Default Workspace in addition to any workspace you add them to, so keep Skills that must stay separate in their own workspace and access them only with [keys scoped to that workspace](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli#api-keys-and-resource-scoping).

  If you are building a multitenant platform on the Skills API, create a separate [workspace](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli) for each tenant. The workspace is the isolation boundary for custom Skills, so a workspace for each tenant gives that tenant's Skills hard isolation from every other tenant. Each organization can have up to 100 workspaces by default (see [How workspaces work](https://platform.claude.com/docs/en/manage-claude/workspaces?sdk_languages=cli#how-workspaces-work)); if you need more for tenant isolation, contact your account team.
</Warning>

### Creating a Skill

A Skill bundle is a directory containing a `SKILL.md` file at the top level with `name` and `description` YAML frontmatter, plus any supporting scripts or resources. See [Get started with Agent Skills in the API](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart?sdk_languages=cli) to author one, and the **Requirements** list following the examples for the full constraints.

Upload your custom Skill to make it available in your workspace. You can upload a zip archive or individual file objects. The Python SDK also provides a `files_from_dir` helper that accepts a directory path, and the CLI's `ant apply` uploads the directory itself.

Files are identified by the file name you attach (the `;filename=` suffix in the cURL example and the file name arguments in the SDK examples). For the walkthrough's skill, create a zip with `zip -r financial_skill.zip financial_skill/` and substitute it for the `example_skill.zip` placeholder in the zip-upload options.

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply financial_skill
    ```

    <File filename="financial_skill/SKILL.md">
      ```markdown
      ---
      name: financial-skill
      description: Docs example skill.
      ---
      ```
    </File>

    <File filename="financial_skill/analyze.py">
      ```python
      print("financial analysis helper")
      ```
    </File>
  </CodeGroupItem>
</CodeGroup>

**Requirements:**

* Must include a `SKILL.md` file at the upload root (or at the top of a single enclosing folder)

* `display_name` is optional: when omitted, it derives from the `SKILL.md` `name`; an explicit value may be up to 255 characters and does not need to be unique within the workspace

* Total upload size must be under 30 MB (uncompressed)

* YAML frontmatter requirements:

  * `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only, no XML tags, no reserved words ("anthropic", "claude")
  * `description`: Maximum 1,024 characters, non-empty, no XML tags

For complete request/response schemas, see the [Create Skill](https://platform.claude.com/docs/en/api/skills/create?sdk_languages=cli) API reference.

### Listing Skills

Retrieve all Skills available to your workspace, including both Anthropic pre-built Skills and your custom Skills. Use the `source` parameter to filter by skill type:

<CodeGroup>
  ```bash CLI
  # List all Skills
  ant skills list

  # List only custom Skills
  ant skills list --source custom
  ```
</CodeGroup>

See the [List Skills API reference](https://platform.claude.com/docs/en/api/skills/list?sdk_languages=cli) for pagination and filtering options.

### Retrieving a Skill

Get details about a specific Skill:

<CodeGroup>
  ```bash CLI
  ant skills retrieve --skill-id skill_01AbCdEfGhIjKlMnOpQrStUv
  ```
</CodeGroup>

### Deleting a Skill

Deleting a Skill also removes all of its versions.

<CodeGroup>
  ```bash CLI
  ant skills delete --skill-id skill_01AbCdEfGhIjKlMnOpQrStUv
  ```
</CodeGroup>

### Versioning

Skills support versioning to manage updates safely:

**Anthropic Skills:**

* Versions use date format: `20251013`
* New versions released as updates are made
* Specify exact versions for stability

**Custom Skills:**

* Auto-generated version IDs: `skver_01AbCdEfGhIjKlMnOpQrStUv`
* Use `"latest"` to always get the most recent version
* Create new versions when updating Skill files

A new version is a complete snapshot, not a delta: upload the Skill's full file set each time. Files you omit are not carried over, and the `name` in the new version's `SKILL.md` must match the Skill's existing name. The following examples re-upload the complete `financial_skill/` bundle from [Creating a Skill](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli#creating-a-skill).

<CodeGroup>
  ```bash CLI
  # Create a new version
  ant skills:versions create \
    --skill-id skill_01AbCdEfGhIjKlMnOpQrStUv \
    --file financial_skill.zip

  # Use a specific version: the ID from the create response
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: custom
        skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
        version: "$VERSION_ID"
  messages:
    - role: user
      content: Use updated Skill
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML

  # Use latest version
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: custom
        skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
        version: latest
  messages:
    - role: user
      content: Use latest Skill version
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

See the [Create Skill Version API reference](https://platform.claude.com/docs/en/api/skills/versions/create?sdk_languages=cli) for complete details.

***

## How Skills are loaded

When you specify Skills in a container:

1. **Metadata discovery:** Claude receives metadata for each Skill (name, description) in the system prompt.
2. **File loading:** Skill files are copied into the container at `/skills/{skill-name}/`. The directory is the Skill's name (`pptx` for an Anthropic Skill, the `SKILL.md` `name` for a custom Skill), not its `skill_01...` ID.
3. **Automatic use:** Claude automatically loads and uses Skills when relevant to your request.
4. **Composition:** Multiple Skills compose together for complex workflows.

Claude loads full Skill instructions only when needed.

***

## Use cases

Skills fit both organizational and personal work. Organizations use them to apply brand formatting to documents, structure notes and reports around company templates, and run company-specific analytical procedures. Individuals use them for custom document templates, specialized data pipelines, and code generation or deployment conventions.

### Example: financial modeling

Combine Excel and custom DCF analysis Skills. First, create the custom DCF analysis Skill:

<CodeGroup defaultLanguage="CLI">
  ```bash CLI
  ant apply dcf_skill
  ```
</CodeGroup>

Then use it with the Excel Skill to create a financial model. Pass the ID of the Skill you created as the custom Skill's `skill_id`:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: anthropic
        skill_id: xlsx
        version: latest
      - type: custom
        skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
        version: latest
  messages:
    - role: user
      content: Build a DCF valuation model for a SaaS company
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

***

## Limits and constraints

### Request limits

* **Maximum Skills per request:** 20

* **Maximum Skill upload size:** 30 MB (all files combined, uncompressed)

* **YAML frontmatter requirements:**

  * `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only, no XML tags, no reserved words ("anthropic", "claude")
  * `description`: Maximum 1,024 characters, non-empty, no XML tags

### Environment constraints

Skills run in the code execution container with these limitations:

* **No network access:** Cannot make external API calls
* **No runtime package installation:** Only pre-installed packages available
* **Isolated environment:** A fresh container is created unless you specify an existing container ID

See [Code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli) for available packages.

***

## Best practices

### When to use multiple Skills

Combine Skills when tasks involve multiple document types or domains:

**Good use cases:**

* Data analysis (Excel) + presentation creation (PowerPoint)
* Report generation (Word) + export to PDF
* Custom domain logic + document generation

**Avoid:**

* Including unused Skills (impacts performance)

### Version management strategy

The SDK tabs in this section show the `container` value to include in a Messages request. The cURL and CLI tabs show the full request.

**For production:** pin a specific version, so Skill updates never change your deployed behavior. If you omit `version` or set it to `"latest"`, requests use the newest version of the Skill, so a version uploaded by [anyone in the workspace](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli#workspace-scoped-access) immediately changes what your production agents run. The version ID comes from the create-version response in [Versioning](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli#versioning) or from the [List Skill Versions API](https://platform.claude.com/docs/en/api/skills/versions/list?sdk_languages=cli). The ID is always a string, so quote it in JSON or YAML even when it looks numeric.

<CodeGroup>
  ```bash CLI
  # Pin to specific versions for stability
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: custom
        skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
        version: "skver_01AbCdEfGhIjKlMnOpQrStUv"
  messages:
    - role: user
      content: Analyze the sales data
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

**For development:** use `latest` to pick up the newest version automatically as you iterate.

<CodeGroup>
  ```bash CLI
  # Use latest for active development
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: custom
        skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
        version: latest
  messages:
    - role: user
      content: Analyze the sales data
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

### Prompt caching considerations

If you use [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli), changing the Skills list in your container breaks the cache. Skills render into the system prompt in a fixed order, so the same list produces the same cacheable prefix:

<CodeGroup>
  ```bash CLI
  # Skills render into the system prompt in a fixed, cache-friendly order
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: anthropic
        skill_id: xlsx
        version: latest
  messages:
    - role: user
      content: Analyze sales data
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML

  # Changing the Skills list ([xlsx] vs [xlsx, pptx]) changes the prefix: a cache miss, while an identical list is a cache hit
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 4096
  container:
    skills:
      - type: anthropic
        skill_id: xlsx
        version: latest
      - type: anthropic
        skill_id: pptx
        version: latest
  messages:
    - role: user
      content: Create a presentation
  tools:
    - type: code_execution_20250825
      name: code_execution
  YAML
  ```
</CodeGroup>

For best caching performance, keep your Skills list, including its order, consistent across requests. Pinning custom Skill versions also helps: with `"latest"`, publishing a new version can invalidate the cached prefix if it changes the Skill's description.

### Error handling

Handle Skill-related errors gracefully:

<CodeGroup exclude="shell:cURL, shell:CLI">
  <CodeGroupItem language="CLI">
    This workflow needs more logic than a single shell command. Use the [Claude SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) to run it.
  </CodeGroupItem>
</CodeGroup>

***

## Migrate from `skills-2025-10-02`

The Skills API is out of beta and needs no beta header. Migrating off `skills-2025-10-02` is optional: requests that still send it keep working and keep returning the beta response shapes, so an existing integration keeps working until you change it. Removing the header switches those requests to the shapes documented on this page:

|                                 | With `skills-2025-10-02`                                                        | Without the header                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skill label                     | `display_title` (up to 64 characters, unique per workspace)                     | `display_name` (up to 255 characters, not unique); derived from the `SKILL.md` `name` when omitted                                                |
| Newest version pointer          | `latest_version`, an epoch-microsecond string such as `"1759178010641129"`      | `latest_version_id`, a version ID such as `"skver_01AbCdEfGhIjKlMnOpQrStUv"`; `GET /v1/skills/{skill_id}/versions/latest` resolves it in one call |
| Version identifier in URLs      | Epoch-microsecond string                                                        | Version ID (`skver_...`). IDs captured under the beta with the `skill_version_` prefix are accepted as input.                                     |
| Version object                  | Includes `directory` (always equal to the Skill `name`)                         | No `directory` field                                                                                                                              |
| `source`                        | A string, `"custom"` or `"anthropic"`                                           | An object, for example `{"type": "custom"}`; the example catalog value is `"anthropic_example"`                                                   |
| List responses                  | `{ data, has_more, next_page }`                                                 | `{ data, next_page }`; `limit` from 1 to 1,000 (default 20)                                                                                       |
| Versions list order             | Oldest first                                                                    | Newest first, default `limit` 20. Page cursors from one shape are not valid on the other.                                                         |
| Deleting a Skill                | Returns a 400 error while any version exists                                    | Deletes the Skill and all of its versions                                                                                                         |
| Deleting a Skill's only version | Allowed, leaving a Skill with no versions                                       | Returns a 400 error; upload a replacement version first, or delete the Skill                                                                      |
| Upload layout                   | Files must sit inside a top-level directory whose name matches the Skill `name` | `SKILL.md` may sit at the root of the upload; stored paths are the same either way                                                                |
| Response types                  | `CreateSkillResponse`, `GetSkillResponse`, and one type per operation           | `Skill`, `SkillVersion`, `DeletedSkill`, `DeletedSkillVersion`                                                                                    |

To migrate:

1. **Remove the beta header.** Drop `anthropic-beta: skills-2025-10-02` from your requests. With the SDK, call `client.skills` instead of `client.beta.skills`; keeping `client.beta.skills` works only on the [SDK releases that no longer send the header](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli#sdk-beta-namespace). Earlier releases send it from `client.beta.skills` even when you pass no beta names.
2. **Rename fields** in your code: `display_title` to `display_name` and `latest_version` to `latest_version_id`. Read `source.type` instead of comparing `source` to a string.
3. **Use version IDs.** Wherever you stored an epoch-microsecond version, store the version's `id` instead, or use `latest`. Skill references in Messages requests accept a version ID, `latest`, or (for Anthropic Skills) the catalog version.
4. **Review delete calls.** `DELETE /v1/skills/{skill_id}` now deletes every version with the Skill. If you relied on the beta's refusal as a safeguard, add your own check.

<Warning>
  After migrating, deleting a Skill through `client.skills` or `client.beta.skills` also deletes all of its versions in one call.
</Warning>

A Skill whose versions were all deleted under the beta has no current version to return: `GET /v1/skills/{skill_id}` returns a 400 error and the Skill is omitted from list responses until you upload a version to it. You can still delete it.

### SDK beta namespace

Starting with Python SDK 1.2.0, TypeScript SDK 0.122.0, Go SDK 1.68.0, Java SDK 2.59.0, PHP SDK 0.45.0, Ruby SDK 1.67.0, and C# SDK 12.44.0, `client.beta.skills` no longer sends `skills-2025-10-02` and returns the same shapes as `client.skills`, with beta type names (`BetaSkill`, `BetaSkillVersion`, `BetaDeletedSkill`, `BetaDeletedSkillVersion`). It takes beta names through `betas` for Skills features that are in beta. In the beta Messages types, the container Skill reference type is renamed from `BetaSkill` to `BetaContainerSkill` (same fields: `type`, `skill_id`, `version`); `BetaSkill` now names the Skill resource, matching `Skill` and `ContainerSkill` in the non-beta types. Earlier SDK releases are typed to the beta shapes; if you depend on those types, stay on an earlier release until you migrate.

## Data retention

Agent Skills are not covered by ZDR arrangements. Skill definitions and execution data are retained according to Anthropic's standard data retention policy.

For ZDR eligibility across all features, see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli).

## Audit logging

If your organization has the [Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api?sdk_languages=cli) enabled, its [Activity Feed](https://platform.claude.com/docs/en/manage-claude/compliance-activity-feed?sdk_languages=cli) records the creation and deletion of Skills and Skill versions made with a Claude API key or from the Claude Console. Operations that occur while the Compliance API is off are not recorded and cannot be recovered later, so [set up the Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api-access?sdk_languages=cli) before you rely on this audit trail.

## Next steps

<CardGroup cols={3}>
  <Card title="API reference" icon="book" href="https://platform.claude.com/docs/en/api/skills/create?sdk_languages=cli">
    Complete API reference with all endpoints
  </Card>

  <Card title="Skill authoring best practices" icon="edit" href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices?sdk_languages=cli">
    Learn how to write effective Skills that Claude can discover and use successfully.
  </Card>

  <Card title="Code execution tool" icon="terminal" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli">
    Run Python and Bash code in a sandboxed container to analyze data, generate files, and iterate on solutions.
  </Card>
</CardGroup>
