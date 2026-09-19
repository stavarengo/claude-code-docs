> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Auto mode classifier request charges

> Resolve the Claude Code notice saying this session isn't eligible for auto mode's no-charge classifier requests: what it means, why it appears, and what to do.

In [auto mode](/docs/en/permission-modes#eliminate-prompts-with-auto-mode), a classifier runs safety checks on actions such
as shell commands and network requests before they run. Wherever [server-side checks are on](#who-sees-the-notice),
Claude Code v2.1.278 or later asks the server to perform those checks as part of the session's own model requests, and
doesn't charge for them when the server performs them. When the server's checks can't reach your session, Claude Code
keeps using its own classifier requests instead, and those requests are billed as they were before. Before the first
action it would check that way, Claude Code holds the action and shows this notice at the prompt:

```text theme={null}
We're changing auto mode to no longer charge for classifier requests in Claude Code. However, this session isn't eligible.
```

When Claude Code can identify a gateway or proxy in the path, the notice names it and says your requests go through it.
Either way, nothing breaks: auto mode keeps working, and its classifier requests are billed as before. The notice
appears only after the server's checks have stopped reaching the session for the rest of it, which can be as early as
the session's first checked action. Once you press Enter, the notice doesn't appear again in that session. An individual
action the server couldn't check doesn't trigger it: Claude Code handles that action on its own and asks the server
again on the next request.

## Who sees the notice

Claude Code v2.1.278 or later asks for server-side checks by default on Enterprise plans and accounts that use the
Claude API, and on [Claude Platform on AWS](/docs/en/claude-platform-on-aws), Amazon Bedrock, Google Cloud's Agent Platform,
and Microsoft Foundry. Whether a platform or region performs them depends on that platform's rollout. Where it doesn't,
Claude Code uses its own classifier requests and shows this notice. On Amazon Bedrock, Google Cloud's Agent Platform,
Microsoft Foundry, and signed-in Claude apps gateway sessions,
[only Claude Sonnet 5, Opus 4.7 or later, and the Fable models](/docs/en/permission-modes#enable-auto-mode-on-bedrock-agent-platform-or-foundry)
support auto mode at all. Pro, Max, and Team plans never show the notice. To check a session that's in auto mode, run
`/status`: its **Auto mode server** row reads `Enabled` while the server's checks decide the session's actions and
`Disabled` once the session has fallen back.

Where the notice can't wait for an answer, Claude Code reports the same text and the session continues in auto mode,
unless a gateway acknowledgment on this machine in the last 24 hours has dismissed it. In
[non-interactive mode](/docs/en/headless) with `-p` it prints the text to stderr, and in `stream-json` output it emits a
`system` warning message, which Agent SDK applications can read from the message stream. In the
[VS Code extension](/docs/en/vs-code) the message appears as a notice in the conversation, with nothing to acknowledge.

## Why the server's checks aren't reaching the session

The most common cause is an LLM gateway or proxy between Claude Code and the API: one that strips or rewrites request
headers, drops request fields it doesn't recognize, or edits responses, for example by rewriting IDs or dropping keys
from streaming events. The server then never receives the request for checks, or Claude Code never receives the results.
When your configuration or the responses identify a gateway, the notice names it. The notice can also appear when the
platform, region, or credential the session uses doesn't have server-side checks yet.

If you see the notice with no gateway or proxy in the path and it keeps appearing, the likely cause is that server-side
checks haven't reached your platform, region, or credential yet. To confirm, contact support or your company's admin, or
report it with `/feedback`.

## Respond to the notice

The notice holds the action until you answer it:

* **Enter** continues: the held action and the rest of the session use Claude Code's own classifier requests, billed as
  token usage as before. When the notice named a gateway, acknowledging it keeps it from reappearing on this machine for
  24 hours. When it didn't, the notice returns the next time a session falls back.
* **Esc** or **Ctrl+C** cancels: the held action doesn't run and the current turn stops, with the session still in auto
  mode. Nothing is remembered, so the notice appears again before the next checked action.

To stop using auto mode instead, switch permission modes with `Shift+Tab` after you answer.

## Make the session eligible

If a gateway is the cause, ask your company's admin or your gateway provider to pass requests and replies through
unchanged. That means forwarding request headers and body fields as they are, including ones the gateway doesn't
recognize such as the `safeguards` request field, and returning responses and streaming events without dropping keys
such as the `safeguard_results` field or rewriting tool-use IDs, as the
[gateway compatibility guide](/docs/en/llm-gateway-protocol#feature-pass-through) describes. A gateway that passes traffic
through this way keeps working with this feature and with future ones. New sessions then use the server's checks again.

If you already know that your gateway can't provide the server's checks, tell Claude Code not to ask for them there by
setting `CLAUDE_CODE_AUTO_MODE_SERVER` to `0` before you start the session, in your shell or in the
[`env` settings key](/docs/en/settings-reference#env):

```bash theme={null}
export CLAUDE_CODE_AUTO_MODE_SERVER=0
```

Classifier requests are then always Claude Code's own, billed the same way, and the notice doesn't appear. The variable
isn't read on a direct connection to the Anthropic API. Setting
[`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`](/docs/en/llm-gateway-protocol#disable-pre-release-capabilities) while
`CLAUDE_CODE_AUTO_MODE_SERVER` is unset turns the server's checks off as well.

`CLAUDE_CODE_AUTO_MODE_SERVER` is a temporary setting and may be removed in a later release.
