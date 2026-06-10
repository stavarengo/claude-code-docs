# CLI quickstart

Install the ant command-line tool, authenticate, and send your first request to the Claude API.

---

The `ant` CLI provides access to the Claude API from your terminal. Every API resource is exposed as a subcommand, with output formatting, response filtering, and support for YAML or JSON file input that make it practical for both interactive exploration and automation.

Compared to calling the API with `curl`, `ant` lets you build request bodies from typed flags or piped YAML rather than hand-written JSON, inline file contents into string fields with an `@path` reference, and extract fields from the response with a built-in `--transform` query (no separate JSON tooling required). List endpoints paginate automatically. Claude Code has native support for `ant`.

<Info>
For endpoint-specific parameters and response schemas, see the [API reference](/docs/en/api/cli/messages/create). This page gets you to a working command. For everything else the CLI does, see [Using the CLI](/docs/en/cli-sdks-libraries/cli/using) and [CLI scripting and automation](/docs/en/cli-sdks-libraries/cli/scripting).
</Info>

## Installation

<Tabs>
<Tab title="Homebrew (macOS)">

```bash
brew install anthropics/tap/ant
```

</Tab>
<Tab title="curl (Linux/WSL)">

For Linux environments, download the release binary directly.

```bash nocheck
VERSION=1.11.0
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
curl -fsSL "https://github.com/anthropics/anthropic-cli/releases/download/v${VERSION}/ant_${VERSION}_${OS}_${ARCH}.tar.gz" \
  | sudo tar -xz -C /usr/local/bin ant
```

You can find all releases on the [GitHub releases page](https://github.com/anthropics/anthropic-cli/releases).

</Tab>
<Tab title="Go">

You may also install the CLI from source using `go install`. Requires Go 1.22 or later.

```bash
go install github.com/anthropics/anthropic-cli/cmd/ant@latest
```

The binary is placed in `$(go env GOPATH)/bin`. Add it to your `PATH` if it isn't already:

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

</Tab>
</Tabs>

Check the installation:

```bash
ant --version
```

## Authentication

`ant auth login` opens a browser-based OAuth flow against the Claude Console and stores the resulting credentials locally, so you can call the API without creating or managing an API key.

```bash CLI nocheck
ant auth login
```

<Note>
For other ways to authenticate (API key environment variable, headless hosts, multiple workspaces, named profiles, and Workload Identity Federation), see [CLI authentication options](/docs/en/cli-sdks-libraries/cli/authentication).
</Note>

## Send your first request

With the binary installed and authenticated, call the [Messages API](/docs/en/api/cli/messages/create):

```bash
ant messages create \
  --model claude-opus-4-8 \
  --max-tokens 1024 \
  --message '{role: user, content: "Hello, Claude"}'
```

```json Output
{
  "model": "claude-opus-4-8",
  "id": "msg_01YMmR5XodC5nTqMxLZMKaq6",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How are you doing today? Is there something I can help you with?"
    }
  ],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 27, "output_tokens": 20 /*, ... */ }
}
```

The response is the full API object, pretty-printed because stdout is a terminal.

## Shell completion

The CLI ships completion scripts for bash, zsh, fish, and PowerShell. Generate and install one for your shell:

<Tabs>
<Tab title="zsh">

```bash
ant @completion zsh > "${fpath[1]}/_ant"
# Restart your shell or run: autoload -U compinit && compinit
```

</Tab>
<Tab title="bash">

```bash
ant @completion bash > /etc/bash_completion.d/ant
```

</Tab>
<Tab title="fish">

```bash
ant @completion fish > ~/.config/fish/completions/ant.fish
```

</Tab>
<Tab title="PowerShell">

```powershell
ant @completion powershell | Out-String | Invoke-Expression
# To persist across sessions:
# ant @completion powershell >> $PROFILE
```

</Tab>
</Tabs>

## Next steps

- [CLI authentication options](/docs/en/cli-sdks-libraries/cli/authentication): API keys, headless hosts, multiple workspaces, and named profiles
- [Using the CLI](/docs/en/cli-sdks-libraries/cli/using): command structure, output formats, GJSON transforms, and request bodies
- [CLI scripting and automation](/docs/en/cli-sdks-libraries/cli/scripting): version-control API resources, scripting patterns, and use from Claude Code