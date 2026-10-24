---
title: Claude Models on Google Cloud (Google managed)
url: https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed
description: Google operates Claude Models on Google Cloud (Google managed) as part of Google Cloud's Agent Platform. You can call Claude with Anthropic's client SDKs.
---

[Claude Models on Google Cloud](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/overview?sdk_languages=cli) compares the two Google Cloud offerings. It also shows how to tell which one you use.

## Before making API calls

To use Claude Models on Google Cloud (Google managed), you need:

1. A Google Cloud project that can use Agent Platform. For setup steps, see Google Cloud's [Anthropic Claude models on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude) page.
2. The [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed, for local development.
3. For the identity making the calls, an IAM role that includes the `aiplatform.endpoints.predict` permission, such as Agent Platform User (`roles/aiplatform.user`). For details, see Google Cloud's [Agent Platform partner models](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/use-partner-models) page.
4. Google Cloud credentials for that identity. For the SDK examples, you might need to run `gcloud auth application-default login` to authenticate with Google Cloud. The cURL examples for Claude Models on Google Cloud (Google managed) get their token with `gcloud auth print-access-token`. That command uses the gcloud CLI's own login, not Application Default Credentials. For those examples, run `gcloud auth login` or `gcloud init` first.

### Install an SDK

Anthropic's [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) support Claude Models on Google Cloud (Google managed) through `AnthropicVertex`. Install the package that provides it:

<Tabs>
  <Tab title="Python">
    ```bash
    pip install -U "anthropic[vertex]"
    ```
  </Tab>

  <Tab title="TypeScript">
    ```bash
    npm install @anthropic-ai/vertex-sdk
    ```
  </Tab>

  <Tab title="C#">
    ```bash
    dotnet add package Anthropic.Vertex
    ```
  </Tab>

  <Tab title="Go">
    ```bash
    go get github.com/anthropics/anthropic-sdk-go/v2
    ```
  </Tab>

  <Tab title="Java">
    <CodeGroup exclude="shell, python, typescript, csharp, go, php, ruby">
      ```groovy Gradle
      implementation("com.anthropic:anthropic-java:3.3.0")
      implementation("com.anthropic:anthropic-java-vertex:3.3.0")
      ```

      ```xml Maven
      <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java</artifactId>
          <version>3.3.0</version>
      </dependency>
      <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java-vertex</artifactId>
          <version>3.3.0</version>
      </dependency>
      ```
    </CodeGroup>
  </Tab>

  <Tab title="PHP">
    ```bash
    composer require anthropic-ai/sdk google/auth
    ```
  </Tab>

  <Tab title="Ruby">
    ```bash
    # Gemfile
    gem "anthropic"
    gem "googleauth"
    ```
  </Tab>
</Tabs>

The `ant` CLI doesn't support Claude Models on Google Cloud (Google managed).

## Making requests

Requests to Claude Models on Google Cloud (Google managed) go to an Agent Platform endpoint URL that ends in `:rawPredict`. Streaming requests use `:streamRawPredict` instead.

A request is nearly identical to a [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli) request. It differs in two main ways:

* **Model:** The endpoint URL names the model. In a cURL request, leave `model` out of the body.
* **Version:** In a cURL request, pass `anthropic_version` in the body, not as a header. Set it to `vertex-2023-10-16`, or to [API version `2026-10-21`](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli).

The following examples use the global endpoint. For the other endpoint types, see [Global, multi-region, and regional endpoints](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#global-multi-region-and-regional-endpoints).

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI doesn't support Claude Models on Google Cloud (Google managed).
  </CodeGroupItem>
</CodeGroup>

### API model IDs

| Model                                                                                                                   | Agent Platform API model ID  |
| :---------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| Claude Fable 5.1                                                                                                        | `claude-fable-5-1`           |
| Claude Mythos 5.1 ([limited availability](https://support.claude.com/en/articles/14604842))                             | `claude-mythos-5-1`          |
| Claude Fable 5                                                                                                          | `claude-fable-5`             |
| Claude Mythos 5 ([limited availability](https://support.claude.com/en/articles/14604842))                               | `claude-mythos-5`            |
| Claude Opus 5.5                                                                                                         | `claude-opus-5-5`            |
| Claude Opus 5                                                                                                           | `claude-opus-5`              |
| Claude Opus 4.8                                                                                                         | `claude-opus-4-8`            |
| Claude Opus 4.7                                                                                                         | `claude-opus-4-7`            |
| Claude Opus 4.6                                                                                                         | `claude-opus-4-6`            |
| Claude Opus 4.5                                                                                                         | `claude-opus-4-5@20251101`   |
| Claude Opus 4.1 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli))   | `claude-opus-4-1@20250805`   |
| Claude Opus 4 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli))     | `claude-opus-4@20250514`     |
| Claude Sonnet 5.5                                                                                                       | `claude-sonnet-5-5`          |
| Claude Sonnet 5                                                                                                         | `claude-sonnet-5`            |
| Claude Sonnet 4.6                                                                                                       | `claude-sonnet-4-6`          |
| Claude Sonnet 4.5 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli)) | `claude-sonnet-4-5@20250929` |
| Claude Sonnet 4 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli))   | `claude-sonnet-4@20250514`   |
| Claude Haiku 5.5                                                                                                        | `claude-haiku-5-5`           |
| Claude Haiku 4.5                                                                                                        | `claude-haiku-4-5@20251001`  |
| Claude Haiku 3.5 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli))  | `claude-3-5-haiku@20241022`  |

Claude Models on Google Cloud (Google managed) offers different Claude models in different regions. To check which models a region offers, search "Claude" in [Model Garden](https://cloud.google.com/model-garden) or see Google Cloud's [Anthropic Claude models on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude) page.

Google sets the lifecycle dates for the models that Claude Models on Google Cloud (Google managed) serves. These dates can differ from the Claude API schedule. For a model's current retirement date, see Google Cloud's [Anthropic Claude models on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude) page. For what Deprecated and Retired mean, see [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli).

<Note>
  Claude Mythos Preview is a research preview. Claude Models on Google Cloud (Google managed) offers it to invited customers. For more information, see [Project Glasswing](https://anthropic.com/glasswing).
</Note>

<Tip>
  Upgrading to a newer Claude model? The [Claude API skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill?sdk_languages=cli#migrating-to-a-newer-claude-model) in Claude Code applies model ID swaps and breaking parameter changes across your code base:

  Let Claude Code migrate your code for you

  ```text
  /claude-api migrate this project to the latest Claude Opus model
  ```

  The skill detects which cloud platform your code targets and adjusts model ID formats and feature changes for that platform.
</Tip>

## Global, multi-region, and regional endpoints

Claude Models on Google Cloud (Google managed) offers three endpoint types. You choose one with the region value you pass when you create the client. In a cURL request, the endpoint type sets the host and the `locations` segment of the URL.

| Endpoint type            | Region value                   | Host                                                                       |
| ------------------------ | ------------------------------ | -------------------------------------------------------------------------- |
| **Global** (recommended) | `"global"`                     | `aiplatform.googleapis.com`                                                |
| **Multi-region**         | `"us"` or `"eu"`               | `aiplatform.us.rep.googleapis.com`<br />`aiplatform.eu.rep.googleapis.com` |
| **Regional**             | A region, such as `"us-east5"` | `{region}-aiplatform.googleapis.com`                                       |

The endpoint types differ in where they send requests:

* **Global:** Requests go to any region with available capacity. Use it when you want maximum availability and data residency is flexible.
* **Multi-region:** Requests go to any region in the United States (`"us"`) or the European Union (`"eu"`). Use it when you need data residency within a broad geography and higher availability than a single region.
* **Regional:** Requests go only to the region you name, such as `"us-east5"` or `"europe-west1"`. Use it when you need single-region data residency or must meet strict compliance mandates.

Multi-region and regional endpoints cost 10 percent more than global endpoints. All three endpoint types take pay-as-you-go traffic, and provisioned throughput needs a regional endpoint.

Regional endpoints serve Claude Sonnet 4.6 and earlier models only. For newer models, use a global or multi-region endpoint.

<Note>
  The premium for multi-region and regional endpoints applies only to Claude Sonnet 4.5 (deprecated) and later models. For the models that keep their earlier pricing, see [Cloud platform pricing](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli#cloud-platform-pricing). For regional endpoints, the premium reflects infrastructure costs for dedicated regional capacity.
</Note>

The following examples use the `us` multi-region endpoint. The highlighted lines set the region. For a full request on the global endpoint, see [Making requests](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#accessing-vertex-ai).

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI doesn't support Claude Models on Google Cloud (Google managed).
  </CodeGroupItem>
</CodeGroup>

## Feature support

Features supported on Claude Models on Google Cloud (Google managed) include the following:

* [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli)

* [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli)

* [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli)

* [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli), including these tools:

  * [Bash tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool?sdk_languages=cli)
  * [Browser use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli)
  * [Computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli)
  * [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool?sdk_languages=cli)
  * [Text editor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool?sdk_languages=cli)
  * [Web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool?sdk_languages=cli)

* [Citations](https://platform.claude.com/docs/en/build-with-claude/citations?sdk_languages=cli)

* [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli)

[Features overview](https://platform.claude.com/docs/en/build-with-claude/overview?sdk_languages=cli) lists every feature and whether Claude Models on Google Cloud (Google managed) supports it.

### Features not supported

Claude Models on Google Cloud (Google managed) doesn't support the following:

* **Input sources:** URL sources for images and documents, and the Files API
* **Server-side tools:** Code execution, web fetch, and advisor
* **Agent infrastructure:** Agent Skills, MCP connector, and programmatic tool calling
* **API endpoints:** Message Batches API, Models API, Admin API, Compliance API, and Usage and Cost API
* **Claude Managed Agents**
* **Server-side fallback:** The [`fallbacks` parameter](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback)

Instead of server-side fallback, use the [client-side fallback pattern](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#client-side-fallback).

### Context window

Claude Models on Google Cloud (Google managed) offers a [1M-token context window](https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli) for these models:

* Claude Fable 5.1
* Claude Fable 5
* Claude Opus 5.5
* Claude Opus 5
* Claude Opus 4.8
* Claude Opus 4.7
* Claude Opus 4.6
* Claude Sonnet 5.5
* Claude Sonnet 5
* Claude Sonnet 4.6
* Claude Haiku 5.5

Other Claude models have a 200k-token context window. These include Claude Sonnet 4.5 (deprecated) and Claude Sonnet 4 (deprecated).

Agent Platform limits request payloads to 30 MB. When you send large documents or many images, you might reach this limit before the token limit.

## Billing, rate limits, and logging

### Rate limits

Google Cloud manages rate limits and quotas for Claude Models on Google Cloud (Google managed). For details, including how to request a quota increase, see Google Cloud's [Quotas for Anthropic Claude models](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/quotas) page.

### Billing

Google Cloud invoices you for Claude Models on Google Cloud (Google managed). For prices, see Google Cloud's [Generative AI pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing#claude-models) page. Prices also depend on the endpoint type. See [Global, multi-region, and regional endpoints](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#global-multi-region-and-regional-endpoints).

### Data retention

Google Cloud governs data handling for Claude Models on Google Cloud (Google managed). For details, see [Agent Platform and zero data retention](https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance).

### Monitoring and logging

To log prompts and completions for Claude Models on Google Cloud (Google managed), use Agent Platform's [request-response logging service](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging).

Anthropic recommends that you keep at least the last 30 days of logs. The logs help you understand your activity and investigate possible misuse.

<Note>
  Turning on this service doesn't give Google or Anthropic any access to your content.
</Note>

## Migrating from Claude Models on Google Cloud (Anthropic managed)

For what changes when you move, see [How the two Google Cloud offerings differ](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/overview?sdk_languages=cli#how-the-two-google-cloud-offerings-differ). To move to Claude Models on Google Cloud (Google managed), follow these steps:

<Steps>
  <Step title="Set up access">
    Check that your project and the identity that makes the calls meet the requirements in [Before making API calls](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#before-making-api-calls).
  </Step>

  <Step title="Install the SDK package">
    Install the package that provides the client for Claude Models on Google Cloud (Google managed). See [Install an SDK](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#install-an-sdk-for-accessing-vertex-ai).
  </Step>

  <Step title="Replace the import and the client">
    Change the code that imports and creates your client. Use `AnthropicVertex` in place of `AnthropicGoogleCloud`. A cURL request needs a new URL, new headers, and a new body. The following code creates the client for Claude Models on Google Cloud (Anthropic managed) that you use today:

    <CodeGroup>
      ```bash CLI
      ant messages create \
        --model claude-opus-5-5 \
        --max-tokens 1024 \
        --message '{role: user, content: "Hello, Claude"}'
      ```
    </CodeGroup>

    The following code creates the client for Claude Models on Google Cloud (Google managed). It uses the global endpoint. For the other endpoint types, see [Global, multi-region, and regional endpoints](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#global-multi-region-and-regional-endpoints).

    <CodeGroup exclude="shell:CLI">
      <CodeGroupItem language="CLI">
        The `ant` CLI doesn't support Claude Models on Google Cloud (Google managed). Use cURL or an SDK instead.
      </CodeGroupItem>
    </CodeGroup>

    This code passes your project ID and a region when it creates the client. Replace `MY_PROJECT_ID` with your project ID. The Messages API calls that you make with the client stay as they are. The exceptions are the model IDs and features in the next step.
  </Step>

  <Step title="Check model IDs and features">
    * **Model IDs:** If you use a model earlier than Claude 4.6, replace the hyphen before the snapshot date in its ID with `@`. For example, `claude-haiku-4-5-20251001` becomes `claude-haiku-4-5@20251001`. For the models and their IDs, see [API model IDs](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#api-model-ids).
    * **Features:** Check that the features your code uses aren't listed in [Features not supported](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#features-not-supported).
  </Step>

  <Step title="Run a test request">
    Run the request in [Making requests](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#accessing-vertex-ai) to check that your setup works. Then run your own code. Before you move production traffic, read about [rate limits for Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli#rate-limits).
  </Step>
</Steps>

## Next steps

<CardGroup cols={2}>
  <Card title="Features overview" icon="stack" href="https://platform.claude.com/docs/en/build-with-claude/overview?sdk_languages=cli">
    Explore Claude's features.
  </Card>

  <Card title="Anthropic Claude models on Agent Platform" icon="book" href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude">
    Check which Claude models each region offers, and their retirement dates.
  </Card>

  <Card title="Agent Platform documentation" icon="book" href="https://cloud.google.com/vertex-ai/docs">
    Read Google Cloud's Agent Platform documentation.
  </Card>

  <Card title="Global endpoint for Claude models" icon="link" href="https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai">
    Read Google Cloud's blog post about the global endpoint for Claude models.
  </Card>
</CardGroup>
