---
title: PDF support
url: https://platform.claude.com/docs/en/build-with-claude/pdf-support
description: "Process PDFs with Claude: extract text, analyze charts, and understand visual content from your documents."
featureMetadata:
  status: ga
  zdr:
    eligibility: eligible
    note: Excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements).
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
    Claude API: ga
    Claude Platform on AWS: ga
    Claude Models on Google Cloud (Anthropic managed): ga
    Amazon Bedrock:
      availability: ga
      note: Base64 sources only.
    Amazon Bedrock (InvokeModel):
      availability: ga
      note: Base64 sources only. With the Converse API, visual PDF analysis needs citations turned on.
    Claude Models on Google Cloud (Google managed):
      availability: ga
      note: Base64 sources only.
    Microsoft Foundry:
      availability: ga
      note: "`file_id` sources need a Hosted on Anthropic deployment."
---

You can ask Claude about any text, pictures, charts, and tables in PDFs you provide. Some sample use cases:

* Analyzing financial reports and understanding charts/tables
* Extracting key information from legal documents
* Helping with document translation
* Converting document information into structured formats

## Before you start

### Check PDF requirements

Claude works with any standard PDF. Ensure your request size meets these requirements:

| Requirement               | Limit                                                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maximum request size      | 128 MB on the first-party Claude API (varies by platform; see [request size limits](https://platform.claude.com/docs/en/api/overview?sdk_languages=cli#request-size-limits)) |
| Maximum pages per request | 600 (100 when the request’s context window is under 1M tokens)                                                                                                               |
| Format                    | Standard PDF (no passwords/encryption)                                                                                                                                       |

Both limits are on the entire request payload, including any other content sent alongside PDFs. For large PDFs, consider uploading with the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli) and referencing by `file_id` to keep request payloads small.

<Tip>
  Dense PDFs (many small-font pages, complex tables, or heavy graphics) can fill the context window before reaching the page limit. Requests with large PDFs can also fail before reaching the page limit, even when using the Files API. Try splitting the document into sections; for large files, because each page is processed as an image, downsampling embedded images can also help.
</Tip>

Because PDF support relies on Claude’s vision capabilities, it is subject to the same [limitations and considerations](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#limitations) as other vision tasks.

### Supported platforms and models

All [active models](https://platform.claude.com/docs/en/models/overview?sdk_languages=cli) support PDF processing. For PDF support through Amazon Bedrock’s Converse API, see [Amazon Bedrock PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli#amazon-bedrock-pdf-support).

### Amazon Bedrock PDF support

When using PDF support through the Converse API, part of [Claude on Amazon Bedrock (Opus 4.6 and earlier)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli), there are two distinct document processing modes:

<Note>
  **Important:** To access Claude’s full visual PDF understanding capabilities in the Converse API, you must enable citations. Without citations enabled, the API falls back to basic text extraction only. Learn more about [working with citations](https://platform.claude.com/docs/en/build-with-claude/citations?sdk_languages=cli).
</Note>

#### Document processing modes

1. **Converse Document Chat** (Original mode - Text extraction only)

   * Provides basic text extraction from PDFs
   * Cannot analyze images, charts, or visual layouts within PDFs
   * Uses approximately 1,000 tokens for a 3-page PDF
   * Automatically used when citations are not enabled

2. **Claude PDF Chat** (New mode - Full visual understanding)

   * Provides complete visual analysis of PDFs
   * Can understand and analyze charts, graphs, images, and visual layouts
   * Processes each page as both text and image for comprehensive understanding
   * Uses approximately 7,000 tokens for a 3-page PDF
   * **Requires citations to be enabled** in the Converse API

#### Key limitations

* **Converse API:** Visual PDF analysis requires citations to be enabled. There is currently no option to use visual analysis without citations (unlike the InvokeModel API).
* **InvokeModel API:** Provides full control over PDF processing without forced citations.

#### Common issues

If Claude isn’t seeing images or charts in your PDFs when using the Converse API, you likely need to enable the citations flag. Without it, Converse falls back to basic text extraction only.

<Note>
  This is a known constraint with the Converse API. For applications that require visual PDF analysis without citations, consider using the InvokeModel API instead.
</Note>

<Note>
  Plain text files such as .txt, .csv, or .md can be used directly in document blocks: upload them to the Files API with MIME type `text/plain` and reference them by `file_id`. Binary formats such as .xlsx or .docx are not supported in document blocks, so convert them to text or PDF first. See [Working with other file formats](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli#working-with-other-file-formats).
</Note>

## Process PDFs with Claude

### Send your first PDF request

Start with a simple example using the Messages API. You can provide PDFs to Claude in three ways:

1. As a URL reference to a PDF hosted online
2. As a base64-encoded PDF in `document` content blocks
3. By a `file_id` from the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli)

<Note>
  On Amazon Bedrock and Claude Models on Google Cloud (Google managed), only base64-encoded sources are currently available. On Microsoft Foundry, the Files API is not supported for deployments hosted on Azure.
</Note>

#### Option 1: URL-based PDF document

The simplest approach is to reference a PDF directly from a URL:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: document
          source:
            type: url
            url: https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf
        - type: text
          text: What are the key findings in this document?
  YAML
  ```
</CodeGroup>

The response returns Claude’s analysis as text blocks in `content`, with token consumption in `usage`:

```json Output
{
  "id": "msg_01Hfp8YuFjQ55VgWbpdHDehB",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-5-5",
  "content": [
    {
      "type": "text",
      "text": "This document is an addendum to the Claude 3 model card, reporting updated evaluation results. The key findings include..."
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 45000,
    "output_tokens": 300
  }
}
```

#### Option 2: Base64-encoded PDF document

If you need to send PDFs from your local system or when a URL isn’t available:

<CodeGroup>
  ```bash CLI
  ant messages create --model claude-opus-5-5 --max-tokens 1024 <<'YAML'
  messages:
    - role: user
      content:
        - type: document
          source:
            type: base64
            media_type: application/pdf
            data: "@./document.pdf"
        - type: text
          text: What are the key findings in this document?
  YAML
  ```
</CodeGroup>

#### Option 3: Files API

For PDFs you’ll use repeatedly, or when you want to avoid encoding overhead, use the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli):

<CodeGroup>
  ```bash CLI
  # First, upload your PDF to the Files API
  ant files upload --file ./document.pdf

  # Then use the file_id from the upload response in your message
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: document
          source:
            type: file
            file_id: $FILE_ID
        - type: text
          text: What are the key findings in this document?
  YAML
  ```
</CodeGroup>

### How PDF support works

When you send a PDF to Claude, the following steps occur:

<Steps>
  <Step title="The system extracts the contents of the document.">
    * The system converts each page of the document into an image.
    * The text from each page is extracted and provided alongside each page’s image.
  </Step>

  <Step title="Claude analyzes both the text and images.">
    * Documents are provided as a combination of text and images for analysis.
    * This allows users to ask for insights on visual elements of a PDF, such as charts, diagrams, and other non-textual content.
  </Step>

  <Step title="Claude responds, referencing the PDF’s contents if relevant.">
    Claude can reference both textual and visual content when it responds. You can further improve performance by integrating PDF support with:

    * [Use prompt caching](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli#use-prompt-caching): To improve performance for repeated analysis.
    * [Process document batches](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli#process-document-batches): To process documents at high volume.
    * [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview?sdk_languages=cli): To extract specific information from documents for use as tool inputs.
  </Step>
</Steps>

### Estimate your costs

The token count of a PDF file depends on the total text extracted from the document and the number of pages:

* Text token costs: Each page typically uses 1,500–3,000 tokens per page depending on content density. Standard API pricing applies with no additional PDF fees.
* Image token costs: Because each page is converted into an image, the same [image-based cost calculations](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size) are applied.

You can use [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli) to estimate costs for your specific PDFs.

## Optimize PDF processing

### Improve performance

Follow these best practices for optimal results:

* Place PDFs before text in your requests
* Use standard fonts
* Ensure text is clear and legible
* Rotate pages to proper upright orientation
* Use logical page numbers (from PDF viewer) in prompts
* Split large PDFs into chunks when needed
* Enable prompt caching for repeated analysis

### Scale your implementation

For high-volume processing, consider these approaches:

#### Use prompt caching

Cache PDFs with [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching?sdk_languages=cli) to improve performance on repeated queries:

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: document
          source:
            type: base64
            media_type: application/pdf
            data: "@./document.pdf"
          cache_control:
            type: ephemeral
        - type: text
          text: Which model has the highest human preference win rates across each use-case?
  YAML
  ```
</CodeGroup>

#### Process document batches

Use the [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli) to process many PDFs in one request:

<CodeGroup>
  ```bash CLI
  ant messages:batches create <<'YAML'
  requests:
    - custom_id: my-first-request
      params:
        model: claude-opus-5-5
        max_tokens: 1024
        messages:
          - role: user
            content:
              - type: document
                source:
                  type: base64
                  media_type: application/pdf
                  data: "@./document.pdf"
              - type: text
                text: >-
                  Which model has the highest human preference win rates
                  across each use-case?
    - custom_id: my-second-request
      params:
        model: claude-opus-5-5
        max_tokens: 1024
        messages:
          - role: user
            content:
              - type: document
                source:
                  type: base64
                  media_type: application/pdf
                  data: "@./document.pdf"
              - type: text
                text: Extract 5 key insights from this document.
  YAML
  ```
</CodeGroup>

Batches process asynchronously. To check progress and retrieve results once processing ends, see [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli).

## Next steps

<CardGroup cols={2}>
  <Card title="Vision" icon="image" href="https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli">
    Claude’s vision capabilities allow it to process and analyze images, opening up exciting possibilities for multimodal interaction.
  </Card>

  <Card title="Try PDF examples" icon="file" href="https://platform.claude.com/cookbook/multimodal-getting-started-with-vision">
    Explore practical examples of PDF processing in the Claude Cookbook recipe.
  </Card>

  <Card title="View API reference" icon="code" href="https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli">
    See complete API documentation for PDF support.
  </Card>
</CardGroup>

## Availability

PDF support is available on every model and eligible for zero data retention and HIPAA readiness.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Always on

| Status                | Cloud platforms                                                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Available             | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli) |
| Available<sup>1</sup> | [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli)                                                                                                                                                                                           |
| Available<sup>2</sup> | [Amazon Bedrock (InvokeModel)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli)                                                                                                                                                                            |
| Available<sup>3</sup> | [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli)                         |

1. `file_id` sources need a Hosted on Anthropic deployment.
2. Base64 sources only. With the Converse API, visual PDF analysis needs citations turned on.
3. Base64 sources only.

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Always on

| Status    | Cloud platforms         |
| --------- | ----------------------- |
| Available | All supported platforms |

### Data handling

[Data handling overview](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#feature-eligibility)

| Item    | Zero data retention                                                                                                                                                         | HIPAA                                                                                              |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Status  | Eligible (excludes [Covered Models](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention?sdk_languages=cli#model-specific-data-retention-requirements)) | Eligible                                                                                           |
| Details | —                                                                                                                                                                           | HIPAA eligibility applies to PDFs sent inline through the Messages API, not through the Files API. |

Applicable endpoints:

* `/v1/messages`
