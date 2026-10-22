---
title: Claude on Google Cloud
url: https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai
description: Anthropic's Claude models are available through [Google Cloud's Agent Platform](https://cloud.google.com/vertex-ai).
---

The API for accessing Claude on Google Cloud's Agent Platform is nearly identical to the [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli), with two key differences in request format:

* On Agent Platform, `model` is not passed in the request body. Instead, it is specified in the Google Cloud endpoint URL.
* On Agent Platform, `anthropic_version` is passed in the request body (rather than as a header), and must be set to the value `vertex-2023-10-16`, or to [API version `2026-10-21`](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli).

Agent Platform is also supported by Anthropic's official [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli). This guide walks you through making a request to Claude on Agent Platform using one of Anthropic's client SDKs.

Note that this guide assumes you already have a Google Cloud project that is able to use Agent Platform. See [Anthropic Claude models on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude) for more information on the setup required and a full walkthrough.

## Install an SDK for accessing Agent Platform

First, install Anthropic's [client SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) for your language of choice.

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
    go get github.com/anthropics/anthropic-sdk-go
    ```
  </Tab>

  <Tab title="Java">
    <CodeGroup exclude="shell, python, typescript, csharp, go, php, ruby">
      ```groovy Gradle
      implementation("com.anthropic:anthropic-java:3.1.0")
      implementation("com.anthropic:anthropic-java-vertex:3.1.0")
      ```

      ```xml Maven
      <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java</artifactId>
          <version>3.1.0</version>
      </dependency>
      <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java-vertex</artifactId>
          <version>3.1.0</version>
      </dependency>
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.vertex.backends.VertexBackend;
      import com.google.auth.oauth2.GoogleCredentials;

      void main() throws Exception {
          AnthropicClient client = AnthropicOkHttpClient.builder()
              .backend(
                  VertexBackend.builder()
                      .googleCredentials(GoogleCredentials.getApplicationDefault())
                      .region("global")
                      .project("MY_PROJECT_ID")
                      .build()
              )
              .build();

          MessageCreateParams params = MessageCreateParams.builder()
              .model(Model.CLAUDE_OPUS_5_5)
              .maxTokens(1024L)
              .addUserMessage("What is the capital of France?")
              .build();

          Message response = client.messages().create(params);
          response.content().stream()
              .flatMap(block -> block.text().stream())
              .forEach(textBlock -> IO.println(textBlock.text()));
      }
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

## Accessing Agent Platform

### Model availability

Note that Anthropic model availability varies by region. Search for "Claude" in the [Model Garden](https://cloud.google.com/model-garden) or go to [Anthropic Claude models](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude) for the latest information.

#### API model IDs

Lifecycle terms (Deprecated, Retired) are defined in [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli). Lifecycle dates on partner-operated platforms are set by the partner and can differ from the Claude API schedule. For the current retirement date of any model on Agent Platform, see [Google Cloud's documentation for Claude models on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude).

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

<Tip>
  Upgrading to a newer Claude model? The [Claude API skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill?sdk_languages=cli#migrating-to-a-newer-claude-model) in Claude Code applies model ID swaps and breaking parameter changes across your code base:

  Let Claude Code migrate your code for you

  ```text
  /claude-api migrate this project to the latest Claude Opus model
  ```

  The skill detects which cloud platform your code targets and adjusts model ID formats and feature changes for that platform.
</Tip>

### Making requests

Before running requests you might need to run `gcloud auth application-default login` to authenticate with Google Cloud.

The following examples show how to generate text from Claude on Agent Platform:

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI doesn't support Agent Platform.
  </CodeGroupItem>
</CodeGroup>

See the [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) and the official [Agent Platform docs](https://cloud.google.com/vertex-ai/docs) for more details.

Claude is also available through [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), and [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli).

## Data retention

Data handling for this offering is governed by Google Cloud. For details, see [Agent Platform and zero data retention](https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance).

## Activity logging

Agent Platform provides a [request-response logging service](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging) that allows you to log the prompts and completions associated with your usage.

Anthropic recommends that you log your activity on at least a 30-day rolling basis to understand your activity and investigate any potential misuse.

<Note>
  Turning on this service does not give Google or Anthropic any access to your content.
</Note>

## Feature support

For the full feature list with Google Cloud availability, see [Features overview](https://platform.claude.com/docs/en/build-with-claude/overview?sdk_languages=cli).

### Supported feature highlights

* [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli)
* [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli)
* [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli)
* [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli), including the [Bash tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool?sdk_languages=cli), [Browser use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli), [Computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli), [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool?sdk_languages=cli), and [Text editor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool?sdk_languages=cli)
* [Web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool?sdk_languages=cli)
* [Citations](https://platform.claude.com/docs/en/build-with-claude/citations?sdk_languages=cli)
* [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli)

### Features not supported

* Input sources (URL sources for images and documents, Files API)
* Server-side tools (code execution, web fetch, advisor)
* Agent infrastructure (Agent Skills, MCP connector, programmatic tool calling)
* API endpoints (Message Batches, Models, Admin, Compliance, Usage and Cost)
* Claude Managed Agents
* Server-side fallback (the [`fallbacks` parameter](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback); use the [client-side fallback pattern](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#client-side-fallback) instead)

### Context window

Claude Fable 5.1, Claude Fable 5, Claude Opus 5.5, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5.5, Claude Sonnet 5, Claude Sonnet 4.6, and Claude Haiku 5.5 have a [1M-token context window](https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli) on Agent Platform. Other Claude models, including Sonnet 4.5 (deprecated) and Sonnet 4 (deprecated), have a 200k-token context window.

Agent Platform limits request payloads to 30 MB. When sending large documents or many images, you might reach this limit before the token limit.

## Global, multi-region, and regional endpoints

Agent Platform offers three endpoint types:

* **Global endpoints:** Dynamic routing for maximum availability
* **Multi-region endpoints:** Dynamic routing within a geographic area (for example, the United States or the European Union) for data residency with high availability
* **Regional endpoints:** Guaranteed data routing through specific geographic regions

Regional and multi-region endpoints include a 10 percent pricing premium over global endpoints.

<Note>
  This applies to Claude Sonnet 4.5 (deprecated) and future models only. Older models (Claude Sonnet 4 (deprecated), Opus 4 (deprecated), and earlier) maintain their existing pricing structures.
</Note>

### When to use each option

**Global endpoints (recommended):**

* Provide maximum availability and uptime
* Dynamically route requests to regions with available capacity
* Carry no pricing premium
* Work best for applications where data residency is flexible
* Only support pay-as-you-go traffic (provisioned throughput requires regional endpoints)

**Multi-region endpoints:**

* Dynamically route requests across regions within a geographic area (currently `us` and `eu`)
* Are useful when you need data residency within a broad geography but want higher availability than a single region
* Carry a 10 percent pricing premium over global endpoints
* Only support pay-as-you-go traffic (provisioned throughput requires regional endpoints)

**Regional endpoints:**

* Route traffic through specific geographic regions
* Are required for single-region data residency, strict compliance mandates, or provisioned throughput
* Support both pay-as-you-go and provisioned throughput
* Carry a 10 percent pricing premium that reflects infrastructure costs for dedicated regional capacity

### Implementation

**Using global endpoints (recommended):**

Set the `region` parameter to `"global"` when initializing the client:

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI doesn't support Agent Platform.
  </CodeGroupItem>
</CodeGroup>

**Using multi-region endpoints:**

Set the `region` parameter to a multi-region identifier: `"us"` for the United States or `"eu"` for the European Union. The SDK routes requests to the corresponding multi-region endpoint (`https://aiplatform.us.rep.googleapis.com` or `https://aiplatform.eu.rep.googleapis.com`), which dynamically balances traffic across regions within that geography.

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI doesn't support Agent Platform.
  </CodeGroupItem>
</CodeGroup>

**Using regional endpoints:**

Specify a specific region such as `"us-east5"` or `"europe-west1"`:

<CodeGroup exclude="shell:CLI">
  <CodeGroupItem language="CLI">
    The `ant` CLI doesn't support Agent Platform.
  </CodeGroupItem>
</CodeGroup>

<Note>
  Claude Mythos Preview is a research preview available to invited customers on Agent Platform. For more information, see [Project Glasswing](https://anthropic.com/glasswing).
</Note>

## Additional resources

* **Agent Platform pricing:** [Generative AI pricing on cloud.google.com](https://cloud.google.com/vertex-ai/generative-ai/pricing)
* **Claude models documentation:** [Claude on Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude)
* **Google blog post:** [Global endpoint for Claude models](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
* **Anthropic pricing details:** [Cloud platform pricing](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli#cloud-platform-pricing)
