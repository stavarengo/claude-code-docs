---
title: Claude in Amazon Bedrock (Opus 4.7 and later)
url: https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock
description: Access Claude models through Amazon Bedrock with AWS-native authentication, billing, and security boundaries.
---

This guide walks you through setting up and making API calls to Claude in Amazon Bedrock. Claude in Amazon Bedrock runs on AWS-managed infrastructure with zero operator access (Anthropic personnel have no access to the inference infrastructure), letting you build sensitive applications entirely inside the AWS security boundary while using the same Messages API shape you use with Anthropic's first-party API.

<Note>
  This page covers Claude in Amazon Bedrock, which serves Claude through the Messages API at `/anthropic/v1/messages` on AWS-managed infrastructure. The previous Amazon Bedrock integration (the `InvokeModel` and `Converse` APIs with ARN-versioned model identifiers) remains available and is documented at [Claude on Amazon Bedrock (Opus 4.6 and earlier)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli). For an Anthropic-operated alternative on AWS with AWS Marketplace billing and typically same-day feature access, see [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli).
</Note>

## Access

Amazon Bedrock sets access criteria for each Claude model individually. Claude Fable 5.1, Claude Fable 5, Claude Opus 4.8, Claude Sonnet 5, Claude Opus 4.7, and Claude Haiku 4.5 are open to all Amazon Bedrock customers. For any other model's current criteria, check [Amazon Bedrock model access](https://console.aws.amazon.com/bedrock/home#/modelaccess) in the AWS console. Claude Mythos Preview requires an invitation through [Project Glasswing](https://anthropic.com/glasswing). For region availability, see [Regions](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli#regions).

## Prerequisites

Before you start, ensure you have:

* An AWS account with [Amazon Bedrock model access](https://console.aws.amazon.com/bedrock/home#/modelaccess) enabled for the Claude models you intend to use
* The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured (optional, for credential management)

Claude Mythos Preview additionally requires a dedicated AWS account that has been allowlisted by the Bedrock Marketplace team. Your Anthropic account executive can submit your account ID for allowlisting (typically processed within 24 hours), and AWS sends a welcome email once it's complete.

## Authentication

Claude in Amazon Bedrock supports three authentication paths. Choose the one that best fits your security requirements.

### Bedrock service role (recommended)

Use a Bedrock service role with AWS-managed keys for the most secure, long-lived access:

<Steps>
  <Step title="Admin: provision the service role">
    An AWS administrator provisions a Bedrock service role and grants developers `iam:PassRole` permission on the service role ARN.
  </Step>

  <Step title="Developer: pass the role">
    When you call the API, Bedrock assumes the service role on your behalf. See the [Amazon Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) for how to associate the role with your requests.
  </Step>
</Steps>

### IAM assumed roles

For identity-federated access with a 12-hour maximum session:

<Steps>
  <Step title="Admin: configure the IAM role">
    Create an IAM role scoped to your Claude models. The trust policy names your identity provider (SAML, OIDC, or AWS Identity Center). The permissions policy grants `bedrock-mantle:CreateInference` only on the allowed model ARNs.
  </Step>

  <Step title="Developer: authenticate and assume">
    Authenticate through your corporate identity provider, then assume the IAM role. AWS STS issues temporary credentials that the SDK or CLI uses to sign requests.
  </Step>
</Steps>

### Bearer tokens

For short-term access without IAM roles (12-hour maximum, least preferred):

<Steps>
  <Step title="Admin: restrict token types">
    Block long-term keys by attaching a policy that denies `bedrock:CallWithBearerToken` unless the `bedrock:BearerTokenType` condition matches a short-term token.
  </Step>

  <Step title="Developer: mint a token">
    Use the `aws-bedrock-token-generator` CLI to mint a bearer token. Pass it in the `x-api-key` header on each request.
  </Step>
</Steps>

## Install an SDK

Anthropic's [client SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) support Claude in Amazon Bedrock through a Bedrock-specific package or module.

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
    go get github.com/anthropics/anthropic-sdk-go/v2/bedrock
    ```
  </Tab>

  <Tab title="Java">
    <Tabs>
      <Tab title="Gradle">
        ```kotlin
        implementation("com.anthropic:anthropic-java:3.3.0")
        implementation("com.anthropic:anthropic-java-bedrock:3.3.0")
        ```
      </Tab>

      <Tab title="Maven">
        ```xml
        <dependency>
            <groupId>com.anthropic</groupId>
            <artifactId>anthropic-java</artifactId>
            <version>3.3.0</version>
        </dependency>
        <dependency>
            <groupId>com.anthropic</groupId>
            <artifactId>anthropic-java-bedrock</artifactId>
            <version>3.3.0</version>
        </dependency>
        ```
      </Tab>
    </Tabs>
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
    gem "aws-sdk-core"
    ```
  </Tab>
</Tabs>

## Making your first request

The endpoint follows the pattern `https://bedrock-mantle.{region}.api.aws/anthropic/v1/messages`. Unlike the `InvokeModel`-based integration, this endpoint uses standard SSE streaming and the same request body shape as Anthropic's first-party API.

The SDK resolves credentials and region using the standard AWS precedence: constructor arguments, then environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION`), then the AWS config file and credential chain (SSO, assumed roles, ECS task role, IMDS).

<Tabs>
  <Tab title="CLI">
    The `ant` CLI does not support Amazon Bedrock. Use either cURL or an SDK.
  </Tab>
</Tabs>

<Tip>
  You can also create the standard client with `Anthropic`: set `base_url` to `https://bedrock-mantle.{region}.api.aws/anthropic` and pass your bearer token as `api_key`. This path supports bearer-token authentication only. SigV4 signing requires `AnthropicBedrockMantle`.
</Tip>

## Supported models

Model IDs in Claude in Amazon Bedrock carry an `anthropic.` provider prefix. Model capabilities and behaviors are documented on the [Models overview](https://platform.claude.com/docs/en/models/overview?sdk_languages=cli) page.

| Model                                                                                       | Model ID                          | Access                                                                                                                |
| :------------------------------------------------------------------------------------------ | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| Claude Fable 5.1                                                                            | `anthropic.claude-fable-5-1`      | Open                                                                                                                  |
| Claude Mythos 5.1 ([limited availability](https://support.claude.com/en/articles/14604842)) | `anthropic.claude-mythos-5-1`     | Active (verification required)                                                                                        |
| Claude Fable 5                                                                              | `anthropic.claude-fable-5`        | Open                                                                                                                  |
| Claude Mythos 5 ([limited availability](https://support.claude.com/en/articles/14604842))   | `anthropic.claude-mythos-5`       | Active (verification required)                                                                                        |
| Claude Mythos Preview ([limited availability](https://anthropic.com/glasswing))             | `anthropic.claude-mythos-preview` | Invitation only                                                                                                       |
| Claude Opus 5.5                                                                             | `anthropic.claude-opus-5-5`       | [See Access](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli#access) |
| Claude Opus 5                                                                               | `anthropic.claude-opus-5`         | [See Access](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli#access) |
| Claude Opus 4.8                                                                             | `anthropic.claude-opus-4-8`       | Open                                                                                                                  |
| Claude Opus 4.7                                                                             | `anthropic.claude-opus-4-7`       | Open                                                                                                                  |
| Claude Sonnet 5.5                                                                           | `anthropic.claude-sonnet-5-5`     | [See Access](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli#access) |
| Claude Sonnet 5                                                                             | `anthropic.claude-sonnet-5`       | Open                                                                                                                  |
| Claude Haiku 5.5                                                                            | `anthropic.claude-haiku-5-5`      | [See Access](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli#access) |
| Claude Haiku 4.5                                                                            | `anthropic.claude-haiku-4-5`      | Open                                                                                                                  |

Use the latest version of Claude Code with Claude in Amazon Bedrock; run `claude update` to upgrade.

<Tip>
  Upgrading to a newer Claude model? The [Claude API skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill?sdk_languages=cli#migrating-to-a-newer-claude-model) in Claude Code applies model ID swaps and breaking parameter changes across your code base:

  Let Claude Code migrate your code for you

  ```text
  /claude-api migrate this project to the latest Claude Opus model
  ```

  The skill detects which cloud platform your code targets and adjusts model ID formats and feature changes for that platform.
</Tip>

## Feature support

For the full feature list with Amazon Bedrock availability, see [Features overview](https://platform.claude.com/docs/en/build-with-claude/overview?sdk_languages=cli).

### Supported feature highlights

* [Messages API](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli) (`/anthropic/v1/messages`)
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
* [Computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli) and [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli) toolsets (`computer_toolset_20260801` and `browser_toolset_20260801` are not currently available on Amazon Bedrock; the beta computer use tool versions remain available)

## Regions

Claude in Amazon Bedrock is available in the following AWS regions. Amazon Bedrock offers two endpoint types:

* **Global:** dynamic routing across all available regions for maximum availability. No pricing premium.
* **Regional:** the endpoint resolves to the single AWS region you specify, for data-residency requirements. Regional endpoints carry a 10 percent pricing premium over global endpoints. To route across multiple regions within a geography, use an [inference profile](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html) (US, EU, JP, or AU). Regions marked **In-region only** in the table support direct single-region routing without an inference profile.

The global endpoint is available for Claude Fable 5.1, Claude Fable 5, Claude Opus 5.5, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Sonnet 5.5, Claude Sonnet 5, Claude Haiku 5.5, and Claude Haiku 4.5. For Claude Fable 5.1, regional endpoints are currently available in `us-east-1` only. Claude Mythos Preview is regional only and is available in `us-east-1`.

| AWS region       | Location                  | Endpoint types             |
| ---------------- | ------------------------- | -------------------------- |
| `af-south-1`     | Africa (Cape Town)        | Global                     |
| `ap-northeast-1` | Asia Pacific (Tokyo)      | Global, JP, In-region only |
| `ap-northeast-2` | Asia Pacific (Seoul)      | Global                     |
| `ap-northeast-3` | Asia Pacific (Osaka)      | Global, JP                 |
| `ap-south-1`     | Asia Pacific (Mumbai)     | Global                     |
| `ap-south-2`     | Asia Pacific (Hyderabad)  | Global                     |
| `ap-southeast-1` | Asia Pacific (Singapore)  | Global                     |
| `ap-southeast-2` | Asia Pacific (Sydney)     | Global, AU                 |
| `ap-southeast-3` | Asia Pacific (Jakarta)    | Global                     |
| `ap-southeast-4` | Asia Pacific (Melbourne)  | Global, AU, In-region only |
| `ca-central-1`   | Canada (Central)          | Global, US                 |
| `ca-west-1`      | Canada West (Calgary)     | Global                     |
| `eu-central-1`   | Europe (Frankfurt)        | Global, EU                 |
| `eu-central-2`   | Europe (Zurich)           | Global, EU                 |
| `eu-north-1`     | Europe (Stockholm)        | Global, EU, In-region only |
| `eu-south-1`     | Europe (Milan)            | Global, EU                 |
| `eu-south-2`     | Europe (Spain)            | Global, EU                 |
| `eu-west-1`      | Europe (Ireland)          | Global, EU, In-region only |
| `eu-west-2`      | Europe (London)           | Global, EU                 |
| `eu-west-3`      | Europe (Paris)            | Global, EU                 |
| `il-central-1`   | Israel (Tel Aviv)         | Global                     |
| `me-central-1`   | Middle East (UAE)         | Global                     |
| `sa-east-1`      | South America (São Paulo) | Global                     |
| `us-east-1`      | US East (N. Virginia)     | Global, US, In-region only |
| `us-east-2`      | US East (Ohio)            | Global, US, In-region only |
| `us-west-1`      | US West (N. California)   | Global, US                 |
| `us-west-2`      | US West (Oregon)          | Global, US, In-region only |

## Quotas

Default quota is 2 million input tokens per minute (TPM). You can request up to 5 million input TPM and 500,000 output TPM without additional Anthropic approval. AWS enforces requests-per-minute (RPM) limits on the Bedrock side; contact AWS support for RPM adjustments.

## Data retention

Data handling for this offering is governed by Amazon Bedrock. For details, see [Data protection in Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html).

## Monitoring and logging

Claude in Amazon Bedrock emits logs to both CloudWatch and CloudTrail. Anthropic recommends retaining activity logs on at least a 30-day rolling basis to understand usage patterns and investigate potential issues.

## Support

For support, contact **[bedrock-ant-eap@amazon.com](mailto:bedrock-ant-eap@amazon.com)**. Include your AWS account ID and the `request-id` from any failed API responses.

<Note>
  **Claude Mythos Preview** is a research preview model available to invited customers on Amazon Bedrock. For more information, see [Project Glasswing](https://anthropic.com/glasswing).
</Note>
