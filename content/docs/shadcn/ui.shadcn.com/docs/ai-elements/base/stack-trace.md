---
title: Stack Trace
description: Displays a failed tool call and its stack frames.
base: base
component: true
---

```tsx
"use client"

import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import { FileCodeIcon, LayersIcon, TerminalIcon } from "lucide-react"

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
  UIDataTypes,
  {
    runCommand: {
      input: { command: string }
      output: { stdout: string }
    }
  }
>

type ToolPart = Extract<
  ChatMessage["parts"][number],
  { type: "tool-runCommand" }
>

const STACK = `TypeError: Cannot read properties of undefined (reading 'email')
    at seedUsers (prisma/seed.ts:27:34)
    at main (prisma/seed.ts:51:9)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object.transformer (node_modules/tsx/dist/register.cjs:3:1104)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)`

const chat = createChat<ChatMessage>()
  .user("Reset the database and seed it.")
  .assistant(({ writer }) => {
    writer
      .tool("runCommand", {
        input: { command: "pnpm prisma migrate reset --skip-seed" },
      })
      .sleep(900)
      .output({
        stdout: `Database reset successful

The following migrations have been applied:

migrations/
  └─ 20260912_init/
  └─ 20260920_add_profiles/`,
      })
    writer
      .tool("runCommand", { input: { command: "pnpm prisma db seed" } })
      .sleep(1200)
      .error(STACK)
    writer.text(
      "The migrations ran, but the seed failed in seedUsers. One fixture has no profile, so profile.email is undefined."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function parseFrame(line: string) {
  const match = line.match(/^at (.+) \((.+):(\d+):(\d+)\)$/)

  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes("node_modules") || line.includes("node:"),
  }
}

function StackTrace({ stack }: { stack: string }) {
  const [error, ...lines] = stack.split("\n").map((line) => line.trim())
  const frames = lines.map(parseFrame)
  const appFrames = frames.filter((frame) => !frame.internal)
  const internalFrames = frames.filter((frame) => frame.internal)

  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceIcon>
            <TerminalIcon />
          </TraceIcon>
          <TraceTitle>Failed: {error}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="flex flex-col gap-2">
        <p className="font-mono text-xs text-destructive">{error}</p>
        <Trace>
          {appFrames.map((frame) => (
            <a key={frame.line} href={`#${frame.file}:${frame.lineNumber}`}>
              <TraceLine>
                <TraceIcon>
                  <FileCodeIcon />
                </TraceIcon>
                <TraceTitle>
                  {frame.name} in {frame.file}:{frame.lineNumber}
                </TraceTitle>
              </TraceLine>
            </a>
          ))}
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <LayersIcon />
                </TraceIcon>
                <TraceTitle>
                  {internalFrames.length} framework frames
                </TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <ol className="flex flex-col gap-1 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
                {internalFrames.map((frame) => (
                  <li key={frame.line} className="whitespace-nowrap">
                    {frame.line}
                  </li>
                ))}
              </ol>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function CommandRow({
  part,
  streaming,
}: {
  part: ToolPart
  streaming: boolean
}) {
  const command = part.input?.command

  if (part.state === "output-error") {
    return <StackTrace stack={part.errorText} />
  }

  if (part.state === "output-available") {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran {command}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {part.output.stdout}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine status={streaming ? "running" : "error"}>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {streaming ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}

export function StackTraceDemo() {
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
                      streaming={streaming}
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

Stack Trace is a line for a tool call that failed. The error is the title, like "Failed: TypeError". Open it for the stack frames, which can link to the file and line.

Stack Trace is built with `Trace` with a `TraceCollapsible` for the frames.

## Installation

Stack Trace is built with the [Trace](/docs/components/base/trace) and [Code Block](/docs/components/base/code-block) components.

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
const [error, ...frames] = stack.split("\n").map((line) => line.trim())

<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine status="error">
        <TraceIcon>
          <CircleXIcon />
        </TraceIcon>
        <TraceTitle>Failed: {error}</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <div className="flex flex-col gap-2 rounded-md bg-muted p-3 font-mono text-xs">
        <p className="text-destructive">{error}</p>
        <ol>
          {frames.map((frame, index) => (
            <li
              key={index}
              className={
                frame.includes("node_modules") ? undefined : "text-foreground"
              }
            >
              {frame}
            </li>
          ))}
        </ol>
      </div>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

The title truncates, so repeat the full error at the top of the content. Frames from `node_modules` stay muted, so your own frames stand out.

## Frame Links

Turn your own frames into links that open the file at the line. Fold the framework frames into a collapsible line of their own, so the frames you can fix come first.

```tsx
import { CircleXIcon, FileCodeIcon, LayersIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const STACK = `TypeError: Cannot read properties of undefined (reading 'total')
    at formatInvoice (app/lib/billing.ts:42:31)
    at InvoiceRow (app/components/invoice-row.tsx:18:12)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:22776:12)
    at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:22707:5)`

function parseFrame(line: string) {
  const match = line.match(/^at (.+) \((.+):(\d+):(\d+)\)$/)

  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes("node_modules"),
  }
}

const [error, ...lines] = STACK.split("\n").map((line) => line.trim())
const frames = lines.map(parseFrame)
const appFrames = frames.filter((frame) => !frame.internal)
const internalFrames = frames.filter((frame) => frame.internal)

export function StackTraceFrames() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <CircleXIcon />
            </TraceIcon>
            <TraceTitle>Failed: {error}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted className="flex flex-col gap-2">
          <p className="font-mono text-xs text-destructive">{error}</p>
          <Trace>
            {appFrames.map((frame) => (
              <a key={frame.line} href={`#${frame.file}:${frame.lineNumber}`}>
                <TraceLine>
                  <TraceIcon>
                    <FileCodeIcon />
                  </TraceIcon>
                  <TraceTitle>
                    {frame.name} in {frame.file}:{frame.lineNumber}
                  </TraceTitle>
                </TraceLine>
              </a>
            ))}
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <LayersIcon />
                  </TraceIcon>
                  <TraceTitle>
                    {internalFrames.length} framework frames
                  </TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <ol className="flex flex-col gap-1 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
                  {internalFrames.map((frame) => (
                    <li key={frame.line} className="whitespace-nowrap">
                      {frame.line}
                    </li>
                  ))}
                </ol>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

## AI SDK

When a tool throws, its part is `output-error`. By default `errorText` is only the error message, with no frames. Return `error.stack` from `onError` in `toUIMessageStreamResponse` to send them.

```ts showLineNumbers title="app/api/chat/route.ts"
return result.toUIMessageStreamResponse({
  onError: (error) =>
    error instanceof Error ? (error.stack ?? error.message) : String(error),
})
```

A stack shows file paths from your server, so only send it in development.

```tsx showLineNumbers
if (part.state === "output-error") {
  const [error, ...frames] = part.errorText
    .split("\n")
    .map((line) => line.trim())

  return <TraceCollapsible>…</TraceCollapsible>
}
```

Map the other tool states as in [Tool](/docs/ai-elements/base/tool#states).

## Migrating from AI SDK Elements

If you added Stack Trace from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/stack-trace.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/stack-trace.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/stack-trace.md and build Stack Trace the same way.
3. Rebuild each part:
   - StackTrace renders a Trace with a TraceCollapsible. Keep trace, open, defaultOpen, onOpenChange and onFilePathClick, and the parsing.
   - StackTraceHeader renders a TraceCollapsibleTrigger with a TraceLine with status="error" and a TraceIcon.
   - StackTraceError renders a TraceTitle, like "Failed: TypeError: …". Keep StackTraceErrorType and StackTraceErrorMessage as spans inside it.
   - StackTraceContent renders a TraceCollapsibleContent.
   - StackTraceFrames renders the frames as a list in a muted, monospace block. Dim the frames from node_modules, and keep the file path buttons.
   - StackTraceExpandButton renders nothing, since the whole line opens the frames.
   - Buttons cannot sit inside a trigger. Render StackTraceActions and StackTraceCopyButton next to the TraceCollapsibleTrigger, not inside it.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
