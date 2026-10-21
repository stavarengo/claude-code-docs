---
title: Claude on Amazon Bedrock (Opus 4.6 and earlier)
url: https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy
description: The legacy Amazon Bedrock integration for Claude models, using InvokeModel and Converse APIs with ARN-versioned model identifiers.
---

<Note>
  This page covers the legacy Amazon Bedrock integration: the `InvokeModel` and `Converse` APIs with ARN-versioned model identifiers and AWS event-stream encoding. For models available on the Messages-API Bedrock endpoint, see [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), which uses the Messages API at `/anthropic/v1/messages` with SSE streaming. For an Anthropic-operated alternative with AWS Marketplace billing and typically same-day feature access, see [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli). Existing Bedrock users can follow the [migration guide](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli#migrating-from-amazon-bedrock).
</Note>

Calling Claude through Bedrock slightly differs from how you would call Claude on the Claude API directly. This guide walks you through completing an API call to Claude on Bedrock using one of Anthropic's [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli).

Note that this guide assumes you have already signed up for an [AWS account](https://portal.aws.amazon.com/billing/signup) and configured programmatic access.

## Install and configure the AWS CLI

1. [Install a version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) at or newer than version `2.13.23`.
2. Configure your AWS credentials using the AWS configure command (see [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) or find your credentials by navigating to "Command line or programmatic access" within your AWS dashboard and following the directions in the modal window.
3. Verify that your credentials are working:

```bash AWS CLI
aws sts get-caller-identity
```

## Install an SDK for accessing Bedrock

Anthropic's [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) support Bedrock. You can also use an AWS SDK like `boto3` directly.

<Tabs>
  <Tab title="Python">
    ```bash
    pip install -U "anthropic[bedrock]"
    ```
  </Tab>

  <Tab title="TypeScript">
    ```bash
    npm install @anthropic-ai/bedrock-sdk
    ```
  </Tab>

  <Tab title="C#">
    ```bash
    dotnet add package Anthropic.Bedrock
    ```
  </Tab>

  <Tab title="Go">
    ```bash
    go get github.com/anthropics/anthropic-sdk-go/bedrock
    ```
  </Tab>

  <Tab title="Java">
    <CodeGroup>
      ```groovy Gradle
      implementation("com.anthropic:anthropic-java:2.75.0")
      implementation("com.anthropic:anthropic-java-bedrock:2.75.0")
      ```

      ```xml Maven
      <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java</artifactId>
          <version>2.75.0</version>
      </dependency>
      <dependency>
          <groupId>com.anthropic</groupId>
          <artifactId>anthropic-java-bedrock</artifactId>
          <version>2.75.0</version>
      </dependency>
      ```

      ```java Java
      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.bedrock.backends.BedrockBackend;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.Model;

      public class BasicMessage {
          public static void main(String[] args) {
              AnthropicClient client = AnthropicOkHttpClient.builder()
                  .backend(BedrockBackend.fromEnv())
                  .build();

              MessageCreateParams params = MessageCreateParams.builder()
                  .model(Model.CLAUDE_OPUS_4_6)
                  .maxTokens(1024L)
                  .addUserMessage("What is the capital of France?")
                  .build();

              Message response = client.messages().create(params);
              response.content().stream()
                  .flatMap(block -> block.text().stream())
                  .forEach(textBlock -> System.out.println(textBlock.text()));
          }
      }
      ```
    </CodeGroup>
  </Tab>

  <Tab title="PHP">
    ```bash
    composer require anthropic-ai/sdk aws/aws-sdk-php
    ```
  </Tab>

  <Tab title="Ruby">
    ```bash
    # Gemfile
    gem "anthropic"
    gem "aws-sdk-bedrockruntime"
    ```
  </Tab>

  <Tab title="Boto3 (Python)">
    ```bash
    pip install "boto3>=1.28.59"
    ```
  </Tab>
</Tabs>

## Accessing Bedrock

### Subscribe to Anthropic models

Go to the [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) and request access to Anthropic models. Note that Anthropic model availability varies by region. See [AWS documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) for latest information.

#### API model IDs

<Note>
  Claude Fable 5.1, Claude Fable 5, Claude Opus 5.5, Claude Opus 5, Claude Sonnet 5.5, Claude Sonnet 5, Claude Haiku 5.5, Claude Opus 4.8, and Claude Opus 4.7 are reachable through `InvokeModel` on `bedrock-runtime`. These requests are served by the same infrastructure as the [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli) endpoint. For the native Messages API request shape and full feature parity, use that page. These models are omitted from the model table on this page because they do not have ARN-versioned model IDs.
</Note>

Lifecycle terms (Deprecated, Retired) are defined in [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli). Lifecycle dates on partner-operated platforms are set by the partner and can differ from the Claude API schedule. For the current retirement date of any model on Amazon Bedrock, see [Amazon Bedrock's model lifecycle page](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html).

AWS offers newer Claude models through [cross-region inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html) rather than on-demand throughput. For these models, a request that passes the base model ID fails with an HTTP 400 error like the following:

```text wrap
Invocation of model ID anthropic.claude-sonnet-4-5-20250929-v1:0 with on-demand throughput isn't supported. Retry your request with the ID or ARN of an inference profile that contains this model.
```

To invoke these models, pass an inference profile instead of the base model ID. The inference profile ID is the base model ID with a prefix from a column marked "Yes" in the following table, for example us.anthropic.claude-sonnet-4-5-20250929-v1:0. You can also pass the full inference profile ARN, in the form `arn:aws:bedrock:{region}:{account-id}:inference-profile/{inference-profile-id}`. For AWS's authoritative list of available inference profiles, see [Supported Regions and models for inference profiles](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html). To learn how the prefixes affect routing and pricing, see the [Global versus regional endpoints](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli#global-vs-regional-endpoints) section.

| Model                                                                                                                   | Base Bedrock model ID                       | `global` | `us` | `eu` | `jp` | `apac` |
| :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ | :------- | :--- | :--- | :--- | :----- |
| Claude Opus 4.6                                                                                                         | `anthropic.claude-opus-4-6-v1`              | Yes      | Yes  | Yes  | Yes  | Yes    |
| Claude Opus 4.5                                                                                                         | `anthropic.claude-opus-4-5-20251101-v1:0`   | Yes      | Yes  | Yes  | No   | No     |
| Claude Opus 4.1 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli))   | `anthropic.claude-opus-4-1-20250805-v1:0`   | No       | Yes  | No   | No   | No     |
| Claude Sonnet 4.6                                                                                                       | `anthropic.claude-sonnet-4-6`               | Yes      | Yes  | Yes  | Yes  | No     |
| Claude Sonnet 4.5 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli)) | `anthropic.claude-sonnet-4-5-20250929-v1:0` | Yes      | Yes  | Yes  | Yes  | No     |
| Claude Sonnet 4 ([deprecated](https://platform.claude.com/docs/en/about-claude/model-deprecations?sdk_languages=cli))   | `anthropic.claude-sonnet-4-20250514-v1:0`   | Yes      | Yes  | Yes  | No   | Yes    |
| Claude Haiku 4.5                                                                                                        | `anthropic.claude-haiku-4-5-20251001-v1:0`  | Yes      | Yes  | Yes  | No   | No     |

### List available models

The following examples show how to print a list of all the Claude models available through Bedrock:

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```

  ```typescript TypeScript
  import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";

  const client = new BedrockClient({ region: "us-west-2" });

  const command = new ListFoundationModelsCommand({ byProvider: "anthropic" });
  const response = await client.send(command);

  if (response.modelSummaries) {
    for (const summary of response.modelSummaries) {
      console.log(summary.modelId);
    }
  }
  ```

  ```csharp C#
  using Amazon;
  using Amazon.Bedrock;
  using Amazon.Bedrock.Model;

  var client = new AmazonBedrockClient(RegionEndpoint.USWest2);

  var request = new ListFoundationModelsRequest
  {
      ByProvider = "anthropic"
  };

  var response = await client.ListFoundationModelsAsync(request);

  foreach (var summary in response.ModelSummaries)
  {
      Console.WriteLine(summary.ModelId);
  }
  ```

  ```go Go
  import (
  	"context"
  	"fmt"
  	"log"

  	"github.com/aws/aws-sdk-go-v2/config"
  	"github.com/aws/aws-sdk-go-v2/service/bedrock"
  )
  // ...
  	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-west-2"))
  	if err != nil {
  		log.Fatal(err)
  	}

  	client := bedrock.NewFromConfig(cfg)

  	byProvider := "anthropic"
  	response, err := client.ListFoundationModels(context.TODO(), &bedrock.ListFoundationModelsInput{
  		ByProvider: &byProvider,
  	})
  	if err != nil {
  		log.Fatal(err)
  	}

  	for _, summary := range response.ModelSummaries {
  		fmt.Println(*summary.ModelId)
  	}
  ```

  ```java Java
  import software.amazon.awssdk.regions.Region;
  import software.amazon.awssdk.services.bedrock.BedrockClient;
  import software.amazon.awssdk.services.bedrock.model.ListFoundationModelsRequest;
  import software.amazon.awssdk.services.bedrock.model.ListFoundationModelsResponse;
  import software.amazon.awssdk.services.bedrock.model.FoundationModelSummary;

  public class ListAnthropicModels {
      public static void main(String[] args) {
          BedrockClient client = BedrockClient.builder()
              .region(Region.US_WEST_2)
              .build();

          ListFoundationModelsRequest request = ListFoundationModelsRequest.builder()
              .byProvider("anthropic")
              .build();

          ListFoundationModelsResponse response = client.listFoundationModels(request);

          for (FoundationModelSummary summary : response.modelSummaries()) {
              System.out.println(summary.modelId());
          }

          client.close();
      }
  }
  ```

  ```php PHP
  <?php

  use Aws\Bedrock\BedrockClient;

  $client = new BedrockClient([
      'region' => 'us-west-2',
      'version' => 'latest'
  ]);

  $result = $client->listFoundationModels([
      'byProvider' => 'anthropic'
  ]);

  foreach ($result['modelSummaries'] as $summary) {
      echo $summary['modelId'] . PHP_EOL;
  }
  ```

  ```ruby Ruby
  require "aws-sdk-bedrock"

  client = Aws::Bedrock::Client.new(region: "us-west-2")

  response = client.list_foundation_models({
    by_provider: "anthropic"
  })

  response.model_summaries.each do |summary|
    puts summary.model_id
  end
  ```
</CodeGroup>

### Making requests

The following examples show how to generate text from Claude on Bedrock:

<Tabs>
  <Tab title="CLI">
    <Note>
      The `ant` CLI does not support Amazon Bedrock. Use one of the SDK examples instead.
    </Note>
  </Tab>
</Tabs>

See the [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) for more details, and the [official Bedrock documentation](https://docs.aws.amazon.com/bedrock/).

### Bearer token authentication

You can authenticate with Bedrock using bearer tokens instead of AWS credentials. This is useful in corporate environments where teams need access to Bedrock without managing AWS credentials, IAM roles, or account-level permissions.

The simplest approach is to set the `AWS_BEARER_TOKEN_BEDROCK` environment variable, which the SDK detects automatically when resolving credentials from the environment.

To provide a token programmatically:

<Tabs>
  <Tab title="CLI">
    <Note>
      The `ant` CLI does not support Amazon Bedrock. Use one of the SDK examples instead.
    </Note>
  </Tab>
</Tabs>

## Activity logging

Bedrock provides an [invocation logging service](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) that allows you to log the prompts and completions associated with your usage.

Anthropic recommends that you log your activity on at least a 30-day rolling basis to understand your activity and investigate any potential misuse.

<Note>
  Turning on this service does not give AWS or Anthropic any access to your content.
</Note>

## Feature support

For the full feature list with Amazon Bedrock availability, see [Features overview](https://platform.claude.com/docs/en/build-with-claude/overview?sdk_languages=cli).

### Supported feature highlights

* [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli)
* [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli)
* [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking?sdk_languages=cli)
* [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli), including the [Bash tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool?sdk_languages=cli), [Computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli), [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool?sdk_languages=cli), and [Text editor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool?sdk_languages=cli)
* [Citations](https://platform.claude.com/docs/en/build-with-claude/citations?sdk_languages=cli)
* [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli)

### Features not supported

* Input sources (URL sources for images and documents, Files API)
* Server-side tools (code execution, web search, web fetch, advisor)
* Agent infrastructure (Agent Skills, MCP connector, programmatic tool calling)
* API endpoints (Message Batches, Models, Admin, Compliance, Usage and Cost)
* Claude Managed Agents
* Server-side fallback (the [`fallbacks` parameter](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback); use the [client-side fallback pattern](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#client-side-fallback) instead)
* Automatic prompt caching (the [top-level `cache_control` field](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli#automatic-caching); use [explicit cache breakpoints](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli#explicit-cache-breakpoints) instead)
* [Computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli) and [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli) toolsets (`computer_toolset_20260801` and `browser_toolset_20260801` are not currently available on Amazon Bedrock; the beta computer use tool versions remain available)

### PDF support on Bedrock

PDF support is available on Bedrock through both the Converse API and InvokeModel API. For detailed information about PDF processing capabilities and limitations, see [Amazon Bedrock PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli#amazon-bedrock-pdf-support).

**Important considerations for Converse API users:**

* Visual PDF analysis (charts, images, layouts) requires citations to be enabled
* Without citations, only basic text extraction is available
* For full control without forced citations, use the InvokeModel API

### Mid-conversation system messages on Bedrock

[Mid-conversation system messages](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages?sdk_languages=cli) are available through the InvokeModel API for Claude Fable 5.1, Claude Fable 5, Claude Opus 5.5, Claude Opus 5, Claude Opus 4.8, Claude Sonnet 5.5, and Claude Haiku 5.5. As described in the note under [API model IDs](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli#api-model-ids), these requests are served by the same infrastructure as the [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli) endpoint. No beta header is required for mid-conversation system messages. This feature is not available on Claude Sonnet 5. Use the top-level `system` field instead. It is not available for the ARN-versioned models in the model table on this page.

A `role: "system"` message can also set `output_config.effort` to [change effort mid-conversation](https://platform.claude.com/docs/en/build-with-claude/effort?sdk_languages=cli#change-effort-mid-conversation-beta) on Claude Fable 5.1 and Claude Opus 5.5. This is in beta: add `mid-conversation-output-config-2026-07-01` to the `anthropic_beta` array in the request body. Without that value, or on Claude Fable 5, Claude Opus 5, or Claude Opus 4.8, the request returns a 400 error: `messages.N.output_config: Extra inputs are not permitted`. In the error, `N` is the index of the `system` message in `messages`.

**For Converse API users:** the Converse API accepts system instructions through its top-level [`system` parameter](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html). To add system instructions mid-conversation, use the InvokeModel API.

### Context window

Claude Fable 5.1, Claude Fable 5, Claude Opus 5.5, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5.5, Claude Sonnet 5, Claude Sonnet 4.6, and Claude Haiku 5.5 have a [1M-token context window](https://platform.claude.com/docs/en/build-with-claude/context-windows?sdk_languages=cli) on Amazon Bedrock. Other Claude models, including Sonnet 4.5 (deprecated) and Sonnet 4 (deprecated), have a 200k-token context window.

Bedrock limits request payloads to 20 MB. When sending large documents or many images, you may reach this limit before the token limit.

## Global versus regional endpoints

Starting with **Claude Sonnet 4.5 and all future models**, Bedrock offers two endpoint types:

* **Global endpoints:** Dynamic routing for maximum availability
* **Regional endpoints:** Guaranteed data routing through specific geographic regions

Regional endpoints include a 10% pricing premium over global endpoints.

<Note>
  This applies to Claude Sonnet 4.5 (deprecated) and future models only. Older models (Claude Sonnet 4 (deprecated) and earlier) maintain their existing pricing structures.
</Note>

### When to use each option

**Global endpoints (recommended):**

* Provide maximum availability and uptime
* Dynamically route requests to regions with available capacity
* No pricing premium
* Best for applications where data residency is flexible

**Regional endpoints (CRIS):**

* Route traffic through specific geographic regions
* Required for data residency and compliance requirements
* Available for US, EU, Japan, and Asia-Pacific
* 10% pricing premium reflects infrastructure costs for dedicated regional capacity

### Implementation

**Using global endpoints (default for Opus 4.6, Sonnet 4.6, and Sonnet 4.5 (deprecated)):**

The model IDs for Claude Opus 4.6, Sonnet 4.6, and Sonnet 4.5 (deprecated) already include the `global.` prefix:

<Tabs>
  <Tab title="CLI">
    <Note>
      The `ant` CLI does not support Amazon Bedrock. Use one of the SDK examples instead.
    </Note>
  </Tab>
</Tabs>

**Using regional endpoints (CRIS):**

To use regional endpoints, replace the `global.` prefix with a regional prefix such as `us.`:

<Tabs>
  <Tab title="CLI">
    <Note>
      The `ant` CLI does not support Amazon Bedrock. Use one of the SDK examples instead.
    </Note>
  </Tab>
</Tabs>

<Note>
  **Claude Mythos Preview** is a research preview model available to invited customers on Amazon Bedrock. For more information, see [Project Glasswing](https://anthropic.com/glasswing).
</Note>

## Additional resources

* **Bedrock pricing:** [Amazon Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/)
* **AWS pricing documentation:** [Bedrock pricing guide](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
* **AWS blog post:** [Introducing Claude Sonnet 4.5 in Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
* **Anthropic pricing details:** [Cloud platform pricing](https://platform.claude.com/docs/en/about-claude/pricing?sdk_languages=cli#cloud-platform-pricing)
