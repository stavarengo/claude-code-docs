---
title: Self-hosted sandboxes
url: https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes
description: Run Claude Managed Agents sessions in self-hosted sandboxes, keeping tool execution, files, and network egress in your own infrastructure.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
---

Self-hosted sandboxes move the agent's tool execution from Anthropic-managed cloud sandboxes into infrastructure you control, while Anthropic keeps running the agent. To learn what that means and decide whether it fits your agent, see [Choosing an agent environment](https://platform.claude.com/docs/en/managed-agents/choosing-an-environment?sdk_languages=cli).

## How it works

A `self_hosted` environment acts as a work queue. You run an **environment worker**, a process on your own infrastructure that serves that queue:

1. You create a [session](https://platform.claude.com/docs/en/managed-agents/sessions?sdk_languages=cli) that targets the environment. Anthropic enqueues the session as a work item.
2. Your worker claims the work item and downloads the agent's [skills](https://platform.claude.com/docs/en/managed-agents/skills?sdk_languages=cli) and the session's [memory stores](https://platform.claude.com/docs/en/managed-agents/memory?sdk_languages=cli).
3. Claude runs on Anthropic's side and requests tool calls. Your worker runs each call locally and posts the result back.

Tool inputs and outputs still flow to Anthropic's control plane, so the model can receive results and determine what to do next. Anthropic stores skills and memory stores. Your sandbox holds a copy for the session. See [Security model](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security?sdk_languages=cli) for the full data-flow boundary.

Self-hosted sandboxes support every Claude model available in Managed Agents. The model is configured on the agent, not the environment.

The `ant` CLI and the Python, TypeScript, and Go SDKs ship pre-built workers. Sandbox providers such as Cloudflare, Daytona, and Modal also publish their own [platform guides](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#platform-guides).

## Quickstart

This quickstart runs one always-on worker with the `ant` CLI, sends it a session, and confirms that the agent's tool calls ran on your host.

### Prerequisites

* **An agent:** If you don't have one, complete [Get started with Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/quickstart?sdk_languages=cli) first and note the agent ID.
* **A Linux host:** The host needs `/bin/bash` at that exact path. The worker needs only outbound HTTPS.
* **A Claude API key:** You use it from your own machine to create sessions and read queue stats. Keep it off the worker host, where agent tool calls could read it.
* **The `ant` CLI or the SDK on your own machine:** The stats and session steps in this quickstart run there, not on the worker host. Install the CLI the same way the [install step](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#run-your-first-session) does for the worker, or install the [SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli).

<Note>
  On [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), the worker authenticates with AWS IAM (SigV4) or an [API key generated in the AWS Console](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli#api-key-authentication), not an environment key. Attach the [`AnthropicSelfHostedEnvironmentAccess`](https://platform.claude.com/docs/en/api/claude-platform-on-aws-iam-actions?sdk_languages=cli#managed-policies) managed policy to the IAM principal your worker runs as. Environment keys generated in the Claude Console don't work with the Claude Platform on AWS endpoint.

  On [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), the worker authenticates with [Google Cloud credentials](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli#authentication), not an environment key. Grant the Google Cloud identity your worker uses `roles/claude.user` or `roles/claude.admin` on the project. Both roles include [`environments.processWork`](https://platform.claude.com/docs/en/api/claude-models-on-google-cloud-anthropic-managed-iam-permissions?sdk_languages=cli#environments), which the worker needs to poll for and manage work items, and the session and skill permissions it needs to run a session. Environment keys generated in the Claude Console don't work with the Claude Models on Google Cloud (Anthropic managed) endpoint. The pre-built workers in the `ant` CLI and in the Python, TypeScript, and Go SDKs don't support Claude Models on Google Cloud (Anthropic managed), so implement your own worker that calls the [Environments Work endpoints](https://platform.claude.com/docs/en/api/beta/environments/work?sdk_languages=cli) directly. See [Features not supported](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli#features-not-supported).
</Note>

### Run your first session

<Steps>
  <Step title="Create a self-hosted environment">
    In the Claude Console, go to the [Environments](https://platform.claude.com/environments) page (`platform.claude.com/environments`), click **Create environment**, and under **Hosting** select **Self-hosted**.

    Or through the API:

    <CodeGroup defaultLanguage="CLI">
      <CodeGroupItem>
        ```bash CLI
        ant apply environment.yaml
        ```

        <File filename="environment.yaml">
          ```yaml
          # yaml-language-server: $schema=https://platform.claude.com/schemas/ant/beta/environment.json
          name: self-hosted
          config:
            type: self_hosted
          ```
        </File>
      </CodeGroupItem>
    </CodeGroup>
  </Step>

  <Step title="Generate an environment key">
    In the Console, open the environment and click **Generate environment key**. The environment key authenticates the worker to its queue. You can generate one only in the Console, even for an environment you created through the API.

    Export the environment ID and key on the worker host:

    ```bash
    export ANTHROPIC_ENVIRONMENT_KEY="sk-ant-oat01-..."
    export ANTHROPIC_ENVIRONMENT_ID="env_..."
    ```
  </Step>

  <Step title="Install the ant CLI">
    Run this on the worker host.

    <Tabs>
      <Tab title="curl (Linux/WSL)">
        For Linux environments, download the release binary directly.

        ```bash
        VERSION=2.3.0
        OS=$(uname -s | tr '[:upper:]' '[:lower:]')
        case $(uname -m) in
          x86_64) ARCH=amd64 ;;
          aarch64) ARCH=arm64 ;;
        esac
        curl -fsSL "https://github.com/anthropics/anthropic-cli/releases/download/v${VERSION}/ant_${VERSION}_${OS}_${ARCH}.tar.gz" \
          | sudo tar -xz -C /usr/local/bin ant
        ```

        You can find all releases on the [GitHub releases page](https://github.com/anthropics/anthropic-cli/releases).
      </Tab>

      <Tab title="Homebrew (macOS)">
        ```bash
        brew install anthropics/tap/ant
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Start the worker">
    Create the working directory, then start the worker. `--workdir` defaults to the current directory, so pass `/workspace` to match the system default.

    ```bash
    sudo mkdir -p /workspace && sudo chown "$USER" /workspace
    ant beta:worker poll --workdir /workspace
    ```

    The worker reads the two variables you exported and polls until you stop it.
  </Step>

  <Step title="Verify the worker is connected">
    On your own machine, set `ANTHROPIC_API_KEY` to your Claude API key (not the environment key) and `ANTHROPIC_ENVIRONMENT_ID` to the environment ID. Confirm that `workers_polling` is at least 1:

    <CodeGroup>
      ```bash CLI
      ant beta:environments:work stats --environment-id "$ANTHROPIC_ENVIRONMENT_ID"
      ```
    </CodeGroup>

    If `workers_polling` stays at 0, see [Troubleshooting](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-operations?sdk_languages=cli#troubleshooting).
  </Step>

  <Step title="Start a session">
    Set `AGENT_ID` to your agent's ID. Create a session that targets the environment, then send it a task:

    <CodeGroup>
      ```bash CLI
      # Create a session
      ant beta:sessions create \
        --agent "$AGENT_ID" \
        --environment-id "$ANTHROPIC_ENVIRONMENT_ID"

      # Send it a task: SESSION_ID is the ID from the create response
      ant beta:sessions:events send --session-id "$SESSION_ID" <<'YAML'
      events:
        - type: user.message
          content:
            - type: text
              text: Write the output of "uname -a" to hello.txt in your working directory.
      YAML
      ```
    </CodeGroup>

    The session waits in the environment's queue until a worker claims it. If no worker is connected, the session stays queued rather than failing.
  </Step>

  <Step title="Confirm the tools ran on your host">
    On the worker host, read the file the agent wrote:

    ```bash
    cat /workspace/hello.txt
    ```

    The file describes your own host's kernel, so the agent's tool calls ran there. To follow the agent's work in real time, see [Session event stream](https://platform.claude.com/docs/en/managed-agents/events-and-streaming?sdk_languages=cli).
  </Step>
</Steps>

## Session resources

Self-hosted sandboxes support `memory_store` resources only. A session on a self-hosted environment that includes a `file` or `github_repository` resource is rejected with a 400 error:

```text wrap
Environment env_... is a self-hosted environment. `resources` are not supported with self-hosted environments.
```

[Deployments](https://platform.claude.com/docs/en/managed-agents/scheduled-deployments?sdk_languages=cli) that target a self-hosted environment follow the same rule. To give a session its own input files, see [Stage files for a session](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-workers?sdk_languages=cli#stage-files-for-a-session).

## Self-hosted sandboxes and MCP tunnels

Self-hosting controls *where the agent's code runs*. [MCP tunnels](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview?sdk_languages=cli) control *how Anthropic reaches MCP servers in your network*. The two are independent:

* A session in Anthropic's cloud sandboxes can reach private MCP servers through a tunnel. For example, a private MCP server might sit in front of a database or an internal API behind your firewall.
* A self-hosted session can use either tunneled or public MCP servers.

Use both when you want execution and tool access to stay inside your boundary. To skip the tunnel, [wrap the MCP server as custom tools](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-custom-tools?sdk_languages=cli#wrap-an-mcp-server-as-custom-tools) that your worker serves.

## Platform guides

These pages describe how to build a worker on any sandboxing platform. Platform-specific guides are also available:

* [AWS Lambda MicroVMs](https://docs.aws.amazon.com/lambda/latest/dg/microvms-integrations-claude-managed-agents.html)
* [Blaxel](https://docs.blaxel.ai/Tutorials/Claude-Managed-Agents)
* [Cloudflare](https://developers.cloudflare.com/sandbox/claude-managed-agents/)
* [Daytona](https://www.daytona.io/docs/en/guides/claude/claude-managed-agents)
* [E2B](https://e2b.dev/docs/agents/claude-managed-agents)
* [Fly.io](https://docs.sprites.dev/integrations/claude-managed-agents/)
* [GKE Agent Sandbox](https://github.com/GoogleCloudPlatform/kubernetes-engine-samples/tree/main/ai-ml/anthropic-agent-sandbox)
* [Modal](https://github.com/modal-labs/claude-managed-agents-modal-sandbox)
* [Namespace](https://namespace.so/docs/integrations/claude)
* [Superserve](https://docs.superserve.ai/integrations/managed-agents/claude-managed-agents)
* [Vercel](https://vercel.com/kb/guide/run-claude-managed-agent-tools-with-vercel-sandbox)

## Next steps

<CardGroup cols={2}>
  <Card title="Deploy workers" icon="play" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-workers?sdk_languages=cli">
    Run the SDK worker, trigger workers from webhooks, or give each session its own sandbox.
  </Card>

  <Card title="Memory stores in self-hosted sandboxes" icon="brain" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli">
    Prepare the host, configure sync, and handle read-only stores and conflicts.
  </Card>

  <Card title="Custom tools and MCP servers" icon="tool" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-custom-tools?sdk_languages=cli">
    Serve your own tools from the worker, including tools from an MCP server inside your network.
  </Card>

  <Card title="Monitor and troubleshoot" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-operations?sdk_languages=cli">
    Read queue depth, stop sessions and workers cleanly, and fix common failures.
  </Card>

  <Card title="Worker reference" icon="book" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-reference?sdk_languages=cli">
    CLI flags, environment variables, filesystem paths, and SDK helper options.
  </Card>

  <Card title="Security model" icon="lock" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security?sdk_languages=cli">
    Shared responsibility model for self-hosted sandbox environments.
  </Card>
</CardGroup>
