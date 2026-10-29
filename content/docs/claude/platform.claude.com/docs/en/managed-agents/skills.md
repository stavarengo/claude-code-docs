---
title: Skills
url: https://platform.claude.com/docs/en/managed-agents/skills
description: Attach pre-built or custom skills to an agent in Claude Managed Agents to give it reusable, filesystem-based expertise for domain-specific workflows.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
  zdr:
    eligibility: not-eligible
    note: Sessions are stateful resources; transcripts persist until you delete them. Applies to all Managed Agents sub-features, including Self-hosted sandboxes.
  supportedModels:
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
    - claude-opus-4-5-20251101
    - claude-sonnet-4-5-20250929
  supportedPlatforms:
    Claude API: beta
    Claude Platform on AWS: beta
    Claude Models on Google Cloud (Anthropic managed): beta
---

Skills are reusable, filesystem-based resources that give your agent domain-specific expertise: workflows, context, and best practices that turn a general-purpose agent into a specialist. Each skill you add incurs a modest cost on the session’s context window, adding instructions and metadata that help the model use the skill. Learn more in the [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview?sdk_languages=cli) overview.

Skills reach your agent in two ways: attach them through the agent’s `skills` array, or [load them from a GitHub repository](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli#load-skills-from-a-github-repository) mounted on the session. Attached skills come in two types. All skills work the same way: your agent uses them automatically when they are relevant to the task.

* **Pre-built Anthropic skills:** Common document tasks such as PowerPoint, Excel, Word, and PDF handling (`pptx`, `xlsx`, `docx`, `pdf`).
* **Custom skills:** Skills you author and upload to your workspace.

To learn how to author custom skills, see [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview?sdk_languages=cli) and [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices?sdk_languages=cli). To upload a custom skill to your workspace, see [Create a custom skill](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli#create-a-custom-skill).

## Create a custom skill

A custom skill is a directory containing a `SKILL.md` file plus any supporting files, uploaded to your workspace as a zip archive or as individual files. Creating the skill returns the `skill_*` ID you reference when attaching it to an agent. Anthropic pre-built skills are already available in every workspace and don’t require this step. To use only pre-built skills, skip to [Attach skills to an agent](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli#attach-skills-to-an-agent).

These examples omit the optional `display_name` field, so the skill’s display name is derived from the `name` field in `SKILL.md`. An explicit `display_name` can be up to 255 characters and doesn’t need to be unique within your workspace.

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply skills/pr-summary
    ```

    <File filename="skills/pr-summary/SKILL.md">
      ```markdown
      ---
      name: pr-summary
      description: Summarize a pull request's changes and risks in the team's review format.
      ---

      # PR summary

      List what changed, why, and anything a reviewer should look at closely, in three short sections.
      ```
    </File>

    [`ant apply`](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/apply?sdk_languages=cli) uploads the `skills/pr-summary` directory, prints the new skill’s ID, and records it in `claude-lock.json`. Commit `claude-lock.json` so the next `ant apply` uploads your edits as a new version instead of creating a second skill.
  </CodeGroupItem>
</CodeGroup>

To list, retrieve, delete, and version custom skills, see [Managing custom skills](https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli#managing-custom-skills). For the full request and response schemas, see the [Create Skill](https://platform.claude.com/docs/en/api/skills/create?sdk_languages=cli) API reference. Skill bundles upload directly to the Skills API rather than through the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli).

## Attach skills to an agent

Attach skills when creating an agent. Each [session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) supports up to 500 skills, counted as the deduplicated set across every agent in the session (see [Multiagent orchestration](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration?sdk_languages=cli)).

<Note>
  Mounting more skills increases the time it takes for the session’s sandbox to start. Attach only the skills each agent needs for its task.
</Note>

Each entry in the `skills` array uses the following fields:

| Field      | Description                                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`     | Either `anthropic` for pre-built skills or `custom` for workspace-authored skills.                                                                                                                                                                                                   |
| `skill_id` | The skill identifier. For Anthropic skills, use the short name (for example, `xlsx`). For custom skills, use the `skill_*` ID returned at creation (see [Create a custom skill](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli#create-a-custom-skill)). |
| `version`  | Pin to a specific version or use `latest`. Optional. Defaults to `latest` when omitted. Applies to both Anthropic and custom skills.                                                                                                                                                 |

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply agent.md
    ```

    <File filename="agent.md">
      ```markdown
      ---
      name: Financial Analyst
      model: claude-opus-5-5
      skills:
        - type: anthropic
          skill_id: xlsx
        - type: custom
          skill_id: skill_01AbCdEfGhIjKlMnOpQrStUv
          version: latest
      ---

      You are a financial analysis agent.
      ```
    </File>
  </CodeGroupItem>
</CodeGroup>

## Load skills from a GitHub repository

Skills can also live in your code base. When a session mounts a repository through the [`github_repository` resource](https://platform.claude.com/docs/en/managed-agents/github?sdk_languages=cli), the repository’s root `.claude/skills` directory is scanned at session start, and each skill found there becomes available to the agent. No upload and no entry in the agent’s `skills` array are required. The agent receives each discovered skill’s name, description, and path in the sandbox, and reads the skill’s `SKILL.md` when a task matches, including any scripts and resources the skill ships. Discovery relies on the agent’s `read` tool from the [agent toolset](https://platform.claude.com/docs/en/managed-agents/tools?sdk_languages=cli), which is enabled by default; an agent with `read` disabled doesn’t load repository skills.

<Warning>
  Repository skills are agent instructions, so a mounted repository is part of your agent’s trust boundary. Anyone who can commit to the repository (a merged external pull request, a compromised dependency, a contributor) can add or change a skill. The platform loads that skill at session start without a review step, and session tools such as `bash` and `web_fetch` give its instructions real reach. Mount only repositories you trust, and review `.claude/skills` before mounting a repository that accepts outside contributions.
</Warning>

<Note>
  Repository skill discovery runs in cloud sandboxes. [Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli) don’t support GitHub repository resources.
</Note>

Discovery finds skills at exactly `.claude/skills/<skill-name>/SKILL.md`, one directory level deep at the repository root:

* `your-repo/`

  * `.claude/`

    * `skills/`

      * `code-review/`
        * `SKILL.md`

      * `release-process/`

        * `SKILL.md`
        * `scripts/`
          * `run_checks.sh`

  * `src/`

Locations that don’t match this layout aren’t discovered at session start:

* `.claude/skills/SKILL.md`: a `SKILL.md` with no skill directory around it
* `.claude/skills/tools/code-review/SKILL.md`: nested more than one directory level deep
* `skills/code-review/SKILL.md`: a `skills` directory outside `.claude`

A `.claude/skills` directory elsewhere in the repository, such as inside a package subdirectory, isn’t announced at session start; those skills can still surface when the agent reads files under that subtree.

Repository skills use the same `SKILL.md` format as the custom skills you upload. For the format and authoring guidance, see [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview?sdk_languages=cli) and [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices?sdk_languages=cli).

To load skills from a repository, create a session that mounts it. This is the same request shown in [Accessing GitHub](https://platform.claude.com/docs/en/managed-agents/github?sdk_languages=cli#token-permissions); `mount_path` is optional and defaults to `/workspace/<repo-name>`:

<CodeGroup>
  ```bash CLI
  ant beta:sessions create \
    --agent "$AGENT_ID" \
    --environment-id "$ENVIRONMENT_ID" <<'EOF'
  resources:
    - type: github_repository
      url: https://github.com/org/repo
      mount_path: /workspace/repo
      authorization_token: ghp_your_github_token
  EOF
  ```
</CodeGroup>

For private repositories, the resource’s `authorization_token` must have access to the repository. This is the same personal access token flow used for any repository mount; see [Accessing GitHub](https://platform.claude.com/docs/en/managed-agents/github?sdk_languages=cli#token-permissions).

Discovered skills follow the checked-out state of the repository: the `checkout` branch or commit when the resource sets one, otherwise the repository’s default branch. The scan runs once, when the session starts. Commits pushed mid-session are not picked up; to load updated skills, start a new session.

Repository skills work alongside skills attached through the agent’s `skills` array. If a repository skill shares a name with an attached skill, or with a skill from another mounted repository, both are available; each is announced with its own path.

## Next steps

<CardGroup cols={2}>
  <Card title="Cloud environment setup" icon="settings" href="https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli">
    Customize cloud sandboxes for your sessions.
  </Card>

  <Card title="Using Agent Skills with the API" icon="code" href="https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli">
    Learn how to use Agent Skills to extend Claude’s capabilities through the API.
  </Card>

  <Card title="Files API" icon="file" href="https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli">
    Upload files once and reference them across API requests.
  </Card>

  <Card title="Get started with Agent Skills in the API" icon="graduation-cap" href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart?sdk_languages=cli">
    Learn how to use Agent Skills to create documents with the Claude API in under 10 minutes.
  </Card>
</CardGroup>
