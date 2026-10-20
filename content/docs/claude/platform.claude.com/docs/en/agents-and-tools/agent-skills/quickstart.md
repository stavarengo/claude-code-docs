---
title: Get started with Agent Skills in the API
url: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart
description: Learn how to use Agent Skills to create documents with the Claude API in under 10 minutes.
---

This tutorial shows you how to use Agent Skills to create a PowerPoint presentation. You'll learn how to enable Skills, make a request, and access the generated file.

## Prerequisites

* A [Claude API key](https://platform.claude.com/settings/keys) from the Claude Console, or a logged-in [ant CLI](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/authentication?sdk_languages=cli)
* A [client SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/overview?sdk_languages=cli) for your language, or `curl` and `jq`
* Basic familiarity with making API requests

## Agent Skills overview

Pre-built Agent Skills extend Claude's capabilities with specialized expertise for tasks such as creating documents, analyzing data, and processing files. Anthropic provides the following pre-built Agent Skills in the API:

* **PowerPoint (pptx):** Create and edit presentations
* **Excel (xlsx):** Create and analyze spreadsheets
* **Word (docx):** Create and edit documents
* **PDF (pdf):** Generate PDF documents

<Note>
  To create custom Skills, see the [Agent Skills Cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction) for examples of building your own Skills with domain-specific expertise.
</Note>

## Step 1: List available Skills

First, check what Skills are available. Use the Skills API to list all Anthropic-managed Skills. Each language tab is an excerpt from one continuous script, with any imports and client setup at the top:

<CodeGroup>
  ```bash CLI
  # List Anthropic-managed Skills
  ant skills list --source anthropic
  ```
</CodeGroup>

You see the following Skills: `pptx`, `xlsx`, `docx`, and `pdf`.

This API returns each Skill's metadata: its name and description. Claude loads this metadata at startup to determine which Skills are available. This is the first level of **progressive disclosure**, where Claude discovers Skills without loading their full instructions yet.

## Step 2: Create a presentation

Use the PowerPoint Skill to create a presentation about renewable energy. Specify Skills using the `container` parameter in the Messages API:

<CodeGroup>
  ```bash CLI
  # Create a message with the PowerPoint Skill
  response=$(ant messages create --format json <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  container:
    skills:
      - type: anthropic
        skill_id: pptx
        version: latest
  messages:
    - role: user
      content: Create a presentation about renewable energy with 5 slides
  tools:
    - type: code_execution_20260521
      name: code_execution
  YAML
  )
  ```
</CodeGroup>

The request includes the following parts:

* **`model`:** A [model that supports the code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#compatibility)
* **`container.skills`:** Specifies which Skills Claude can use
* **`type: "anthropic"`:** Indicates this is an Anthropic-managed Skill
* **`skill_id: "pptx"`:** The PowerPoint Skill identifier
* **`version: "latest"`:** The Skill version set to the most recently published
* **`tools`:** Enables code execution (required for Skills)

<Note>
  The examples use the `code_execution_20260521` tool version, and the Step 3 code parses the result types that current tool versions return. Skills also work with older [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli) versions such as `code_execution_20250825`: any current code execution tool version satisfies the Skills requirement. If you use a different version, use the tool `type` listed on the code execution tool page.
</Note>

When you make this request, Claude automatically matches your task to the relevant Skill. Because you asked for a presentation, Claude determines the PowerPoint Skill is relevant and loads its full instructions: the second level of progressive disclosure. Then Claude runs the Skill's code to create your presentation.

## Step 3: Download the created file

The presentation was created in the code execution container and saved as a file. The Step 2 `response` includes a file reference with a file ID. Extract the file ID and download the file with the Files API. The example saves it to your system temp directory:

<CodeGroup>
  ```bash CLI
  # Extract the file ID. The code execution tool runs the Skill's code through
  # its Bash sub-tool, and generated files appear as bash_code_execution_output
  # items inside the bash_code_execution_tool_result block.
  file_id=$(jq -r '
    last(
      .content[]
      | select(.type == "bash_code_execution_tool_result")
      | .content
      | select(.type == "bash_code_execution_result")
      | .content[].file_id
    ) // empty
  ' <<<"$response")

  if [[ -n "$file_id" ]]; then
    # Download the file and save it
    ant files download --file-id "$file_id" --output "${TMPDIR:-/tmp}/renewable_energy.pptx"
  fi
  ```
</CodeGroup>

<Note>
  For complete details on working with generated files, see [Retrieve generated files](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool?sdk_languages=cli#retrieve-generated-files) in the code execution tool documentation.
</Note>

## Try more examples

Try these variations:

### Create a spreadsheet

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  container:
    skills:
      - type: anthropic
        skill_id: xlsx
        version: latest
  messages:
    - role: user
      content: Create a quarterly sales tracking spreadsheet with sample data
  tools:
    - type: code_execution_20260521
      name: code_execution
  YAML
  ```
</CodeGroup>

### Create a Word document

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  container:
    skills:
      - type: anthropic
        skill_id: docx
        version: latest
  messages:
    - role: user
      content: Write a 2-page report on the benefits of renewable energy
  tools:
    - type: code_execution_20260521
      name: code_execution
  YAML
  ```
</CodeGroup>

### Generate a PDF

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 16000
  container:
    skills:
      - type: anthropic
        skill_id: pdf
        version: latest
  messages:
    - role: user
      content: Generate a PDF invoice template
  tools:
    - type: code_execution_20260521
      name: code_execution
  YAML
  ```
</CodeGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Skill authoring best practices" icon="edit" href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices?sdk_languages=cli">
    Learn how to write effective Skills that Claude can discover and use successfully.
  </Card>

  <Card title="Using Agent Skills with the API" icon="book" href="https://platform.claude.com/docs/en/build-with-claude/skills-guide?sdk_languages=cli">
    Learn how to use Agent Skills to extend Claude's capabilities through the API.
  </Card>

  <Card title="Create custom Skills" icon="code" href="https://platform.claude.com/docs/en/api/skills/create?sdk_languages=cli">
    Upload your own Skills for specialized tasks.
  </Card>

  <Card title="Use Skills in Claude Code" icon="terminal" href="https://code.claude.com/docs/en/skills">
    Learn about Skills in Claude Code.
  </Card>

  <Card title="Agent Skills Cookbook" icon="book" href="https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction">
    Explore example Skills and implementation patterns.
  </Card>
</CardGroup>
