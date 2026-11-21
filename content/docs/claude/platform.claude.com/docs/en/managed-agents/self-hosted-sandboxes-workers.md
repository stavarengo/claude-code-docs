---
title: Deploy self-hosted workers
url: https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-workers
description: Choose how self-hosted sandbox workers claim work and where sessions run, then run an always-on worker or trigger workers from webhooks.
featureMetadata:
  topic:
    title: Managed Agents
    url: https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli
  status: beta
  betaHeader: managed-agents-2026-04-01
  zdr:
    eligibility: not-eligible
    note: Not eligible for ZDR, except for self-hosted Managed Agents. Sessions are stateful resources; transcripts persist until you delete them.
  supportedModels:
    - claude-fable-5-2
    - claude-mythos-5-2
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
---

The [self-hosted sandboxes quickstart](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#quickstart) runs one `ant` CLI worker that polls continuously and runs every session in one process. This page helps you choose a deployment pattern and then covers always-on and webhook-triggered workers.

## Choose a deployment pattern

When deploying workers, you need to make two choices: how the worker claims work, and where each session runs.

**How the worker claims work:**

* **Always-on:** A long-running process polls the queue continuously. The process makes only outbound HTTPS requests, so you don’t expose an endpoint to Anthropic.
* **Webhook-triggered:** A handler wakes on `session.status_run_started` and starts polling. This avoids an idle poller, but requires a [webhook](https://platform.claude.com/docs/en/managed-agents/webhooks?sdk_languages=cli) endpoint that Anthropic can reach.

**Where each session runs:**

* **In process:** The worker that claims a session also runs its tool calls, in one shared working directory.
* **Sandbox per session:** A poller launches a fresh sandbox for each claimed session. Choose this for stronger isolation: a fresh filesystem, resource limits, or per-session network controls. See [Run one sandbox per session](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-per-session?sdk_languages=cli), which also covers the Helm chart for Kubernetes.

The CLI and SDK workers support different combinations:

| Capability | `ant` CLI | SDK (Python, TypeScript, Go) |
| ----- | ----- | ----- |
| Always-on polling | Yes | Yes |
| Webhook-triggered | No | Yes |
| [Sandbox per session](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-per-session?sdk_languages=cli) | Yes | Yes |
| [Memory stores](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli) | Yes, with default sync settings | Yes, with configurable sync |
| [Custom tools](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-custom-tools?sdk_languages=cli) | No | Yes |

See [Self-hosted worker reference](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-reference?sdk_languages=cli) for every CLI flag and SDK option.

For more control, call the [Environments Work endpoints](https://platform.claude.com/docs/en/api/beta/environments/work?sdk_languages=cli) directly and implement your own worker. Your worker then does what the SDK workers do. Among other things, it acknowledges each work item, sends heartbeats, and downloads the agent’s skills. It runs only the tool calls that the session’s [permission policy](https://platform.claude.com/docs/en/managed-agents/permission-policies?sdk_languages=cli#see-how-each-call-was-evaluated) allows. It returns each result as a `user.tool_result` or `user.custom_tool_result` event. At the end, it stops the item. Use the worker’s source in the [Python SDK](https://github.com/anthropics/anthropic-sdk-python/tree/main/src/anthropic/lib/environments), the [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript/tree/main/src/lib/environments), or the [Go SDK](https://github.com/anthropics/anthropic-sdk-go/tree/main/lib/environments) as a reference.

## Run an always-on worker

These samples use `/workspace` as the worker’s working directory. The directory must exist before the worker starts. On a new host, create it and give the worker’s user write access, as in the “Start the worker” step of [Run your first session](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#run-your-first-session).

On macOS, `mkdir` can’t create `/workspace`, because the root volume is read-only. Create `~/workspace` instead, as that step shows. In place of `/workspace`, use the full path that `echo ~/workspace` prints, because the SDK doesn’t expand `~`.

Start a worker that polls the queue continuously. It authenticates with the [environment key](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#run-your-first-session) from the quickstart:

<CodeGroup exclude="shell:cURL, csharp, java, php, ruby">
  ```bash CLI
  ant beta:worker poll --workdir /workspace
  ```
</CodeGroup>

## Trigger workers from webhooks

<Steps>
  <Step title="Subscribe to session webhooks">
    In the [Claude Console](https://platform.claude.com/settings/workspaces/default/webhooks), define a webhook endpoint that listens for `session.status_run_started` events. See [Subscribe to webhooks](https://platform.claude.com/docs/en/managed-agents/webhooks?sdk_languages=cli) for details.
  </Step>

  <Step title="Export the webhook signing key">
    Along with the environment ID and key from [Run your first session](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#run-your-first-session), export the webhook signing key on your handler host. The handler uses it to verify incoming payloads.

    ```bash
    export ANTHROPIC_WEBHOOK_SIGNING_KEY="whsec_..."
    ```
  </Step>

  <Step title="Implement the webhook handler">
    Start the worker when `session.status_run_started` fires. The handler drains the queue and hands each claimed work item to `handle_item()` (in the Python, TypeScript, and Go SDKs). That method downloads skills, runs tool calls, posts results back, and returns.

    The samples use `/workspace` as the working directory. Before you start the handler, create that directory on the handler host. Make sure that the handler’s user can write to it, as in the “Start the worker” step of [Run your first session](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes?sdk_languages=cli#run-your-first-session).

    <CodeGroup exclude="shell, csharp, java, php, ruby">
      <CodeGroupItem language="CLI">
        This handler needs more logic than a single shell command. Use the Python, TypeScript, or Go SDK to run it.
      </CodeGroupItem>
    </CodeGroup>

    In the Python, TypeScript, and Go SDKs, `handle_item()` needs the work item’s secret to mount memory stores. A worker that polls with `run()` already has the secret. This handler claims each item itself, so it passes the secret in the `work_secret` argument. See [Forward the work item’s secret](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-per-session?sdk_languages=cli#forward-the-work-items-secret).
  </Step>
</Steps>

This handler runs every claimed item in one process, and it runs items from separate webhook deliveries at the same time. Those sessions share one filesystem, including `/workspace` and `/mnt/memory`. If your sessions attach the same memory store, see [Isolate sessions that share a store](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-memory?sdk_languages=cli#isolate-sessions-that-share-a-store).

## Next steps

<CardGroup cols={2}>
  <Card title="Run one sandbox per session" icon="cube" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-per-session?sdk_languages=cli">
    Launch sandboxes with the Helm chart on Kubernetes, a spawn script, or the SDK poller.
  </Card>

  <Card title="Monitor and troubleshoot self-hosted workers" icon="lightning" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-operations?sdk_languages=cli">
    Read queue depth, stop sessions and workers cleanly, and fix common failures.
  </Card>

  <Card title="Security model" icon="lock" href="https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security?sdk_languages=cli">
    Shared responsibility model for self-hosted sandbox environments.
  </Card>
</CardGroup>

## Availability

Prebuilt self-hosted workers are in beta on every model.

### API support

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Available

| Status | Cloud platforms |
| ----- | ----- |
| Beta | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli) |

### Required beta headers

[Beta headers overview](https://platform.claude.com/docs/en/api/beta-headers?sdk_languages=cli)

Beta headers allow you to access experimental features and new model capabilities before they become part of the standard API.

* `managed-agents-2026-04-01`

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item | Zero data retention | HIPAA |
| ----- | ----- | ----- |
| Status | Not eligible | Not eligible |
| Details | Not eligible for ZDR, except for self-hosted Managed Agents. Sessions are stateful resources; transcripts persist until you delete them. [Learn more](https://platform.claude.com/docs/en/managed-agents/self-hosted-data-and-access?sdk_languages=cli#how-long-data-is-kept) | Not eligible for HIPAA. Applies to all Managed Agents sub-features. |

Applicable endpoints:

* `/v1/agents`
* `/v1/sessions`
* `/v1/environments`
