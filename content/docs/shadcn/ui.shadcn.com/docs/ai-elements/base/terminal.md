---
title: Terminal
description: Displays a command the agent runs, with its output as it streams.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { TerminalIcon } from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  {
    terminal: { output: string }
  },
  {
    runCommand: {
      input: { command: string }
      output: { exitCode: number }
    }
  }
>

type ToolPart = Extract<
  ChatMessage["parts"][number],
  { type: "tool-runCommand" }
>

const COMMANDS = [
  {
    id: "lint",
    command: "pnpm lint",
    output: ["> acme-chat@0.1.0 lint", "> eslint ."],
  },
  {
    id: "test",
    command: "pnpm test",
    output: [
      "> acme-chat@0.1.0 test",
      "> vitest run",
      "",
      " ✓ lib/ai.test.ts (6 tests) 41ms",
      " ✓ components/chat.test.tsx (9 tests) 212ms",
      "",
      " Test Files  2 passed (2)",
      "      Tests  15 passed (15)",
    ],
  },
  {
    id: "build",
    command: "pnpm build",
    output: [
      "> acme-chat@0.1.0 build",
      "> next build",
      "",
      "   ▲ Next.js 16.3.0",
      "   Creating an optimized production build ...",
      " ✓ Compiled successfully in 4.2s",
      " ✓ Generating static pages (12/12)",
      "",
      "Route (app)                Size  First Load JS",
      "┌ ○ /                     1.9 kB       112 kB",
      "└ ƒ /api/chat              141 B       102 kB",
    ],
  },
]

const chat = createChat<ChatMessage>()
  .user("Run the checks, then build the app.")
  .assistant(({ writer }) => {
    for (const { id, command, output } of COMMANDS) {
      const tool = writer.tool("runCommand", {
        toolCallId: id,
        input: { command },
      })

      // The tool streams its output as a data part with the tool call's id.
      output.forEach((_, index) => {
        writer
          .data({
            type: "data-terminal",
            id,
            data: { output: output.slice(0, index + 1).join("\n") },
          })
          .sleep(200)
      })

      tool.output({ exitCode: 0 })
    }

    writer.text("Lint and tests pass, and the build compiled both routes.")
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function getTitle(part: ToolPart, running: boolean) {
  const command = part.input?.command

  if (part.state === "output-available") {
    return part.output.exitCode === 0
      ? `Ran ${command}`
      : `${command} exited with code ${part.output.exitCode}`
  }

  return running ? `Running ${command}` : `Failed to run ${command}`
}

function getOutput(message: ChatMessage, toolCallId: string) {
  for (const part of message.parts) {
    if (part.type === "data-terminal" && part.id === toolCallId) {
      return part.data.output
    }
  }

  return ""
}

function CommandRow({
  part,
  output,
  streaming,
  defaultOpen,
}: {
  part: ToolPart
  output: string
  streaming: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const running =
    streaming &&
    (part.state === "input-streaming" || part.state === "input-available")
  const failed =
    !running &&
    (part.state !== "output-available" || part.output.exitCode !== 0)

  return (
    <TraceCollapsible
      open={open ?? (running && output.length > 0)}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : failed ? "error" : undefined}>
          <TraceIcon>
            <TerminalIcon />
          </TraceIcon>
          <TraceTitle>{getTitle(part, running)}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-64">
            {part.state === "output-error" ? part.errorText : output}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function TerminalDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <Message key={message.id} align="end">
              <MessageContent>
                <Bubble align="end" variant="muted">
                  <BubbleContent>{getMessageText(message)}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          )
        }

        const streaming = busy && message === messages.at(-1)
        const tools = message.parts.filter(
          (part) => part.type === "tool-runCommand"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tools.length > 0 && (
                <Trace>
                  {tools.map((part) => (
                    <CommandRow
                      key={part.toolCallId}
                      part={part}
                      output={getOutput(message, part.toolCallId)}
                      streaming={streaming}
                      defaultOpen={busy ? undefined : part === tools.at(-1)}
                    />
                  ))}
                </Trace>
              )}
              {text && <p>{text}</p>}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() => {
            setMessages([])
            sendMessage(question)
          }}
        >
          Replay
        </Button>
      )}
    </div>
  )
}

```

Terminal is a shell command the agent runs, such as a lint, a test run or a build. The line shows the command, and its output streams in underneath while it runs.

Terminal is built with `Trace` with a `TraceCollapsible` for each command.

## Installation

Terminal is built with the [Trace](/docs/components/base/trace) and [Code Block](/docs/components/base/code-block) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace code-block
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible code-block
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="trace"
  title="components/ui/trace.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
```

```tsx showLineNumbers
<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran pnpm build</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <CodeBlock size="sm">
        <CodeBlockContent wrap className="max-h-64">
          {output}
        </CodeBlockContent>
      </CodeBlock>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Exit Code

A command that exits with any code other than `0` failed. Set `status="error"`.

```tsx
import { TerminalIcon } from "lucide-react"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const LINT_OUTPUT = `> acme-chat@0.1.0 lint
> eslint .

app/api/chat/route.ts
  14:7  error  'model' is assigned a value but never used  no-unused-vars

components/chat.tsx
  42:5  error  React Hook useEffect has a missing dependency: 'messages'  react-hooks/exhaustive-deps

✖ 2 problems (2 errors, 0 warnings)

 ELIFECYCLE  Command failed with exit code 1.`

export function TerminalError() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>pnpm lint exited with code 1</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {LINT_OUTPUT}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

| Command                  | `status`    | Title                        |
| ------------------------ | ----------- | ---------------------------- |
| Running                  | `"running"` | Running pnpm build           |
| Exited with `0`          | none        | Ran pnpm build               |
| Exited with another code | `"error"`   | pnpm lint exited with code 1 |

The command is a tool call, so its states map the same way as in [Tool](/docs/ai-elements/base/tool#states).

## Open While Running

Open the line once the first output arrives, so the output is visible while the command runs. Leave it open or closed after that, as in [Trace](/docs/components/base/trace#open-state).

## AI SDK

A tool result arrives only once the command exits. To stream the output while it runs, write it from the tool as a data part with the tool call's id. The AI SDK replaces a data part that has the same id, so the output grows in place.

```ts showLineNumbers
writer.write({
  type: "data-terminal",
  id: toolCallId,
  data: { output },
})
```

On the client, find the data part that matches each tool part.

```tsx showLineNumbers
function getOutput(message: ChatMessage, toolCallId: string) {
  for (const part of message.parts) {
    if (part.type === "data-terminal" && part.id === toolCallId) {
      return part.data.output
    }
  }

  return ""
}
```

## Migrating from AI SDK Elements

If you added Terminal from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/terminal.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Code Block. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/terminal.tsx from AI SDK Elements to the shadcn/ui Trace and Code Block components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block
2. Read https://ui.shadcn.com/docs/ai-elements/base/terminal.md and build Terminal the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - Terminal renders a Trace with a TraceCollapsible. Keep output, isStreaming, autoScroll and onClear.
   - TerminalHeader renders a TraceCollapsibleTrigger with a TraceLine. Set status="running" while isStreaming is true.
   - TerminalTitle renders a TraceIcon with a TerminalIcon and a TraceTitle, like "Ran pnpm build".
   - TerminalContent renders a TraceCollapsibleContent with a CodeBlock with size="sm", and a CodeBlockContent with wrap and className="max-h-64" for the output.
   - Open the line once output arrives while the command runs.
   - Buttons cannot sit inside a trigger. Render TerminalStatus, TerminalActions and the copy and clear buttons next to the TraceCollapsibleTrigger, not inside it.
4. Remove ansi-to-react from the dependencies if nothing else uses it.
5. Remove the imports the file no longer uses.
6. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
