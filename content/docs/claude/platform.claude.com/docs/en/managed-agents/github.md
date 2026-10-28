---
title: Accessing GitHub
url: https://platform.claude.com/docs/en/managed-agents/github
description: Connect your agent to GitHub repositories for cloning, reading, and creating pull requests.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

You can mount a GitHub repository to your session sandbox and connect to the GitHub MCP for making pull requests.

GitHub repositories are cached, so future sessions that use the same repository start faster.

## GitHub MCP and session resources

First, create an agent that declares the GitHub MCP server. The agent definition holds the server URL but no authentication token:

<CodeGroup defaultLanguage="CLI">
  <CodeGroupItem>
    ```bash CLI
    ant apply code-reviewer.md
    ```

    <File filename="code-reviewer.md">
      ```markdown
      ---
      name: Code Reviewer
      model: claude-opus-5-5
      mcp_servers:
        - type: url
          name: github
          url: https://api.githubcopilot.com/mcp/
      tools:
        - type: agent_toolset_20260401
        - type: mcp_toolset
          mcp_server_name: github
      ---

      You are a code review assistant with access to GitHub.
      ```
    </File>
  </CodeGroupItem>
</CodeGroup>

Then create a session that mounts the GitHub repository. With a `limited` [environment](https://platform.claude.com/docs/en/managed-agents/environments?sdk_languages=cli#networking), session creation fails with a 400 error when the agent declares an MCP server whose host is not in `allowed_hosts`. Setting `allow_mcp_servers` to `true` in the environment’s networking turns this check off.

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

A `github_repository` resource accepts the following fields:

| Field                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                | Required. Must be `"github_repository"`.                                                                                                                                                                                                                                                                                                                                                                                          |
| `url`                 | Required. The repository’s HTTPS URL in the form `https://github.com/<owner>/<repo>`, without a `.git` suffix. Other forms, including SSH URLs, are rejected with an `invalid_request_error`.                                                                                                                                                                                                                                     |
| `authorization_token` | Optional. The GitHub token used to clone the repository and to push to it. Without a token, a private repository fails to clone after the session is created. A public repository clones without a token, and the agent can commit in its clone, but `git push` fails. It is not echoed in API responses. See [Token permissions](https://platform.claude.com/docs/en/managed-agents/github?sdk_languages=cli#token-permissions). |
| `mount_path`          | Optional. The directory under `/workspace` to clone the repository into. Defaults to `/workspace/<repo-name>`.                                                                                                                                                                                                                                                                                                                    |
| `checkout`            | Optional. A branch (`{"type": "branch", "name": "main"}`) or commit (`{"type": "commit", "sha": "..."}`) to check out. Defaults to the repository’s default branch.                                                                                                                                                                                                                                                               |

Mounting a repository also loads any skills stored in its root `.claude/skills` directory. Skills are discovered once for each session, from the repository state checked out at session start. See [Load skills from a GitHub repository](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli#load-skills-from-a-github-repository).

## Token permissions

When providing a GitHub token, use the minimum required permissions:

| Action              | Required scopes                   |
| ------------------- | --------------------------------- |
| Clone private repos | `repo`                            |
| Create PRs          | `repo`                            |
| Read issues         | `repo` (private) or `public_repo` |
| Create issues       | `repo` (private) or `public_repo` |

<Warning>
  Use fine-grained personal access tokens with minimum required permissions. Avoid using tokens with broad access to your GitHub account.
</Warning>

## Multiple repositories

Mount multiple repositories by adding entries to the `resources` array:

<CodeGroup>
  ```bash CLI
  ant beta:sessions create \
    --agent "$AGENT_ID" \
    --environment-id "$ENVIRONMENT_ID" <<'EOF'
  resources:
    - type: github_repository
      url: https://github.com/org/frontend
      mount_path: /workspace/frontend
      authorization_token: ghp_your_github_token
    - type: github_repository
      url: https://github.com/org/backend
      mount_path: /workspace/backend
      authorization_token: ghp_your_github_token
  EOF
  ```
</CodeGroup>

## Managing repositories on a running session

After a session is created, you can list its repository resources and rotate their authorization tokens. Each resource has an `id` returned at session creation time (or through `ant beta:sessions:resources list` (cli: `ant beta:sessions:resources list`)) that you use for updates. Repositories are attached for the lifetime of the session; to change which repositories are mounted, create a new session.

<CodeGroup>
  ```bash CLI
  # List resources on the session
  ant beta:sessions:resources list --session-id "$SESSION_ID"

  # Rotate the authorization token on a specific resource
  ant beta:sessions:resources update \
    --session-id "$SESSION_ID" \
    --resource-id "$RESOURCE_ID" \
    --authorization-token "ghp_your_new_github_token"
  ```
</CodeGroup>

## Creating pull requests

With the GitHub MCP server, the agent can create branches, commit changes, and push them:

<CodeGroup>
  ```bash CLI
  ant beta:sessions:events send --session-id "$SESSION_ID" <<'EOF'
  events:
    - type: user.message
      content:
        - type: text
          text: Fix the type error in src/utils.ts, commit it to a new branch, and push it.
  EOF
  ```
</CodeGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Session event stream" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli">
    Stream events and steer the agent while it opens the pull request
  </Card>

  <Card title="MCP connector" icon="link" href="https://platform.claude.com/docs/en/managed-agents/mcp-connector?sdk_languages=cli">
    Connect more MCP servers to give the agent additional tools
  </Card>

  <Card title="Adding files" icon="file" href="https://platform.claude.com/docs/en/managed-agents/files?sdk_languages=cli">
    Mount files in the sandbox alongside your repositories
  </Card>
</CardGroup>
