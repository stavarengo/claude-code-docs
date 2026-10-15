---
title: Trace
description: The building block for reasoning, tool calls, sources and more.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  ArrowUpRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  GlobeIcon,
  LoaderCircleIcon,
} from "lucide-react"

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

type Part = ChatMessage["parts"][number]

const chat = createChat<ChatMessage>()
  .user("Why does pnpm install fail in CI?")
  .assistant(({ writer }) => {
    writer.reasoning(
      "CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml disagree. I should check what the last commit changed, then reproduce the install.",
      { delayMs: 40 }
    )
    writer
      .tool("runCommand", { input: { command: "pnpm --version" } })
      .sleep(700)
      .output({ stdout: "10.18.0" })
    writer
      .tool("runCommand", {
        input: {
          command: "git diff --stat HEAD~1 -- package.json pnpm-lock.yaml",
        },
      })
      .sleep(900)
      .output({
        stdout:
          " package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)",
      })
    writer
      .tool("runCommand", {
        input: { command: "pnpm install --frozen-lockfile" },
      })
      .sleep(1200)
      .error(
        'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json'
      )
    writer.sourceUrl({
      url: "https://pnpm.io/cli/install#--frozen-lockfile",
      title: "pnpm install | pnpm.io",
    })
    writer.sourceUrl({
      url: "https://pnpm.io/continuous-integration",
      title: "Continuous Integration | pnpm.io",
    })
    writer.sleep(1000)
    writer.text(
      "The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the frozen install fails. Run pnpm install locally and commit the lockfile."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function ThinkingRow({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  const line = (
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        {running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleCheckIcon />
        )}
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought for 5s"}</TraceTitle>
    </TraceLine>
  )

  if (text.length === 0) {
    return line
  }

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function ToolRow({
  part,
  streaming,
  defaultOpen,
}: {
  part: Extract<Part, { type: "tool-runCommand" }>
  streaming: boolean
  defaultOpen?: boolean
}) {
  const command = part.input?.command

  if (part.state === "output-available" || part.state === "output-error") {
    const failed = part.state === "output-error"

    return (
      <TraceCollapsible defaultOpen={defaultOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine status={failed ? "error" : undefined}>
            <TraceIcon>
              {failed ? <CircleAlertIcon /> : <CircleCheckIcon />}
            </TraceIcon>
            <TraceTitle>
              {failed ? "Failed to run" : "Ran"} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          {failed ? (
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap className="max-h-64">
                {part.errorText}
              </CodeBlockContent>
            </CodeBlock>
          ) : (
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {part.output.stdout}
              </CodeBlockContent>
            </CodeBlock>
          )}
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine status={streaming ? "running" : "error"}>
      <TraceIcon>
        {streaming ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleAlertIcon />
        )}
      </TraceIcon>
      <TraceTitle>
        {streaming ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}

function SourcesRow({
  sources,
  running,
}: {
  sources: Extract<Part, { type: "source-url" }>[]
  running: boolean
}) {
  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            {running ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <GlobeIcon />
            )}
          </TraceIcon>
          <TraceTitle>
            {running ? "Using" : "Used"} {sources.length} sources
          </TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
                <TraceTitle>
                  {source.title ?? new URL(source.url).hostname}
                  <span className="sr-only"> (opens in a new tab)</span>
                </TraceTitle>
                <TraceIcon>
                  <ArrowUpRightIcon />
                </TraceIcon>
              </TraceLine>
            </a>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function TraceDemo() {
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
        const rows = message.parts.filter(
          (part) => part.type === "reasoning" || part.type === "tool-runCommand"
        )
        const sources = message.parts.filter(
          (part) => part.type === "source-url"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {rows.length + sources.length > 0 && (
                <Trace>
                  {rows.map((part, index) =>
                    part.type === "reasoning" ? (
                      <ThinkingRow
                        key={index}
                        text={part.text}
                        running={streaming && part.state === "streaming"}
                      />
                    ) : part.type === "tool-runCommand" ? (
                      <ToolRow
                        key={part.toolCallId}
                        part={part}
                        streaming={streaming}
                        defaultOpen={index === 2}
                      />
                    ) : null
                  )}
                  {sources.length > 0 && (
                    <SourcesRow
                      sources={sources}
                      running={streaming && text.length === 0}
                    />
                  )}
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

`Trace` is a list of lines. Each line has an icon, a title, and an optional description and status. A line can expand to show more detail, link to a page, or open a dialog or sheet.

Every line has the same shape, so reasoning, tool calls, sources and plans built from `Trace` look and behave the same.

Use `Trace` for the steps an agent takes, like calling a tool, running a subagent or editing a file. Use [Message](/docs/components/base/message) for its reply, and [Marker](/docs/components/base/marker) for notes and dividers between turns.

## Built with Trace

Every pattern below is a composition of `Trace` parts. See [AI Elements](/docs/ai-elements) for examples and code.

| Pattern                                                     | Shows                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| [Chain of Thought](/docs/ai-elements/base/chain-of-thought) | A summary that expands into the steps behind it.                 |
| [Plan](/docs/ai-elements/base/plan)                         | The steps the agent plans to take, and how far it has got.       |
| [Queue](/docs/ai-elements/base/queue)                       | The agent's todo list, split into what is left and what is done. |
| [Reasoning](/docs/ai-elements/base/reasoning)               | The agent's thinking as it streams.                              |
| [Sources](/docs/ai-elements/base/sources)                   | The links the agent used for a reply.                            |
| [Stack Trace](/docs/ai-elements/base/stack-trace)           | A failed tool call and its stack frames.                         |
| [Subagent](/docs/ai-elements/base/subagent)                 | A subagent run, with its tool calls and result.                  |
| [Task](/docs/ai-elements/base/task)                         | The steps the agent takes, as it takes them.                     |
| [Terminal](/docs/ai-elements/base/terminal)                 | A command the agent runs, with its output as it streams.         |
| [Test Results](/docs/ai-elements/base/test-results)         | A test run by the agent, with its suites and failures.           |
| [Tool](/docs/ai-elements/base/tool)                         | A tool call the agent makes, from input to output.               |

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible
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

Use a `TraceLine` for a single step:

```tsx showLineNumbers
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"
```

```tsx showLineNumbers
<Trace>
  <TraceLine>
    <TraceIcon>
      <SearchIcon />
    </TraceIcon>
    <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
  </TraceLine>
</Trace>
```

Wrap the line in a `TraceCollapsible` to show more detail when it expands:

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
<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran node --version</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Composition

Use the following composition to build a trace line:

```text
Trace
└── TraceLine
    ├── TraceIcon
    ├── TraceTitle
    ├── TraceDescription
    └── TraceIcon
```

Wrap the line in a `TraceCollapsible` to show more detail when it expands:

```text
Trace
└── TraceCollapsible
    ├── TraceCollapsibleTrigger
    │   └── TraceLine
    └── TraceCollapsibleContent
```

`TraceLine` is always the line. To make a line do something, wrap it in that thing's trigger.

## Features

- One row for reasoning, tool calls, sources, plans and tasks
- Rows that expand, link out, or open a dialog, sheet, drawer or popover
- `running`, `error` and `pending` states, with a shimmer while running
- Nested rows, so a summary expands into steps and a step into its output
- Works with reasoning, tool and source parts from the AI SDK
- Keyboard and screen reader support from the trigger that wraps each row
- Customizable styling through the `className` prop on every part

## Trace Line

Use a `TraceLine` on its own for a step with no detail to show. It reads as plain text.

```tsx
import { GitBranchIcon } from "lucide-react"

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceStatic() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <GitBranchIcon />
        </TraceIcon>
        <TraceTitle>Created branch fix/frozen-lockfile</TraceTitle>
      </TraceLine>
    </Trace>
  )
}

```

## Status

Set `status` on `TraceLine` when a step is running, has failed or hasn't started yet.

```tsx
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleIcon,
  LoaderCircleIcon,
} from "lucide-react"

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceStatus() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <CircleAlertIcon />
        </TraceIcon>
        <TraceTitle>Failed to run pnpm lint</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <LoaderCircleIcon className="animate-spin" />
        </TraceIcon>
        <TraceTitle>Running pnpm build</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <CircleIcon />
        </TraceIcon>
        <TraceTitle>Run pnpm test</TraceTitle>
      </TraceLine>
    </Trace>
  )
}

```

| Status      | Use for                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| none        | Work that is done: "Ran pnpm install".                                        |
| `"error"`   | Work that failed. Say so in the title: "Failed to run pnpm lint".             |
| `"running"` | Work in progress. Write the title in the present tense: "Running pnpm build". |
| `"pending"` | Work that has not started, such as a plan step: "Run pnpm test".              |

## Description

Put secondary text such as a diff stat, a duration or a count in a `TraceDescription` after the `TraceTitle`. It does not truncate.

```tsx
import { FilePenIcon, SearchIcon, TerminalIcon } from "lucide-react"

import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceDescriptionDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <FilePenIcon />
        </TraceIcon>
        <TraceTitle>
          Edited components/settings/notification-preferences-form.tsx
        </TraceTitle>
        <TraceDescription className="font-mono">+48 −12</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran pnpm test</TraceTitle>
        <TraceDescription>14s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Searched for useChat</TraceTitle>
        <TraceDescription>8 results</TraceDescription>
      </TraceLine>
    </Trace>
  )
}

```

## Collapsible

Wrap the line in a `TraceCollapsible` to show more detail when it expands. Put the `TraceLine` inside `TraceCollapsibleTrigger` and the detail in `TraceCollapsibleContent`.

```tsx
import { TerminalIcon } from "lucide-react"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceCollapsibleDemo() {
  return (
    <div className="w-full max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ node --version\nv24.18.0"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  )
}

```

## Open State

Rows start closed. Use `defaultOpen` on `TraceCollapsible` to start open, or `open` with `onOpenChange` to control a row.

```tsx
"use client"

import * as React from "react"
import { TerminalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceOpen() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ node --version\nv24.18.0"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible open={open} onOpenChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran pnpm --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {"$ pnpm --version\n10.33.4"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} the pnpm output
      </Button>
    </div>
  )
}

```

To open a row while it streams and let the reader's click win, pass `open ?? running`.

```tsx showLineNumbers
const [open, setOpen] = React.useState<boolean>()

<TraceCollapsible
  open={open ?? running}
  onOpenChange={setOpen}
>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : undefined}>…</TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>{text}</TraceCollapsibleContent>
</TraceCollapsible>
```

## Link

Wrap the `TraceLine` in an anchor. For a new tab, use an arrow-up-right icon and sr-only "(opens in a new tab)".

```tsx
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  FileTextIcon,
  GlobeIcon,
} from "lucide-react"

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceLink() {
  return (
    <Trace className="max-w-sm">
      <a href="#link">
        <TraceLine>
          <TraceIcon>
            <FileTextIcon />
          </TraceIcon>
          <TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
          <TraceIcon>
            <ChevronRightIcon />
          </TraceIcon>
        </TraceLine>
      </a>
      <a
        href="https://docs.astro.build/en/install-and-setup/"
        target="_blank"
        rel="noreferrer"
      >
        <TraceLine>
          <TraceIcon>
            <GlobeIcon />
          </TraceIcon>
          <TraceTitle>
            Install Astro | docs.astro.build
            <span className="sr-only"> (opens in a new tab)</span>
          </TraceTitle>
          <TraceIcon>
            <ArrowUpRightIcon />
          </TraceIcon>
        </TraceLine>
      </a>
    </Trace>
  )
}

```

```tsx showLineNumbers
<a href="https://docs.astro.build" target="_blank" rel="noreferrer">
  <TraceLine>
    <TraceTitle>
      Install Astro
      <span className="sr-only"> (opens in a new tab)</span>
    </TraceTitle>
    <TraceIcon>
      <ArrowUpRightIcon />
    </TraceIcon>
  </TraceLine>
</a>
```

## Dialog

Wrap the `TraceLine` in the dialog's trigger. The dialog owns its open state, Escape and focus return.

```tsx
import { ArrowUpRightIcon, ChevronRightIcon, GlobeIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const results = [
  {
    title: "Caching build outputs",
    url: "https://nextjs.org/docs/app/guides/caching",
  },
  {
    title: "Image optimization reference",
    url: "https://nextjs.org/docs/app/api-reference/components/image",
  },
  {
    title: "Deploy hooks and cache keys",
    url: "https://vercel.com/docs/deploy-hooks",
  },
]

export function TraceDialog() {
  return (
    <Trace className="max-w-sm">
      <Dialog>
        <DialogTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Searched the web for cache keys</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon />
            </TraceIcon>
          </TraceLine>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Searched the web for cache keys</DialogTitle>
            <DialogDescription>
              Three results were used in the response.
            </DialogDescription>
          </DialogHeader>
          <Trace>
            {results.map((result) => (
              <a
                key={result.url}
                href={result.url}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceIcon>
                    <GlobeIcon />
                  </TraceIcon>
                  <TraceTitle>
                    {result.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRightIcon />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </DialogContent>
      </Dialog>
    </Trace>
  )
}

```

```tsx showLineNumbers
<Dialog>
  <DialogTrigger>
    <TraceLine>
      <TraceTitle>Searched the web for cache keys</TraceTitle>
      <TraceIcon>
        <ChevronRightIcon />
      </TraceIcon>
    </TraceLine>
  </DialogTrigger>
  <DialogContent>…</DialogContent>
</Dialog>
```

## Sheet

The same shape as the dialog. Drawer and Popover work the same way.

```tsx
import { ChevronRightIcon, FolderSearchIcon } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceSheet() {
  return (
    <Trace className="max-w-sm">
      <Sheet>
        <SheetTrigger>
          <TraceLine>
            <TraceIcon>
              <FolderSearchIcon />
            </TraceIcon>
            <TraceTitle>Explored 4 files</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon />
            </TraceIcon>
          </TraceLine>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Explored 4 files</SheetTitle>
            <SheetDescription>
              Files read while preparing the response.
            </SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-2 px-6 font-mono text-xs">
            <li>apps/v4/lib/docs.ts</li>
            <li>apps/v4/lib/components.ts</li>
            <li>apps/v4/next.config.mjs</li>
            <li>apps/v4/package.json</li>
          </ul>
        </SheetContent>
      </Sheet>
    </Trace>
  )
}

```

## Group

Put rows that sit next to each other in a `Trace`. It also styles any trigger or link that wraps a `TraceLine`.

```tsx
import { FileTextIcon, SearchIcon, TerminalIcon } from "lucide-react"

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceGroupDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <FileTextIcon />
        </TraceIcon>
        <TraceTitle>Read pnpm-workspace.yaml</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
    </Trace>
  )
}

```

## Sources

A collapsible row whose detail is a `Trace` of link rows.

```tsx
import { ArrowUpRightIcon, GlobeIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const sources = [
  {
    title: "Install Astro | docs.astro.build",
    href: "https://docs.astro.build/en/install-and-setup/",
  },
  {
    title: "create-astro | npmjs.com",
    href: "https://www.npmjs.com/package/create-astro",
  },
  {
    title: "Settings: minimumReleaseAge | pnpm.io",
    href: "https://pnpm.io/settings#minimumreleaseage",
  },
]

export function TraceSources() {
  return (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Used {sources.length} sources</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceIcon>
                    <GlobeIcon />
                  </TraceIcon>
                  <TraceTitle>
                    {source.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRightIcon />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  )
}

```

See [Sources](/docs/ai-elements/base/sources) for more examples.

## Chain of Thought

A chain of thought is a collapsible row with step rows inside. Set the parent's status and title from its children.

```tsx
import { ChevronRightIcon, FileTextIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

export function TraceSteps() {
  return (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceTitle>Looking into the slow deploy</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <SearchIcon />
                  </TraceIcon>
                  <TraceTitle>Searched for the checkout build log</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">vercel.com</Badge>
                <Badge variant="secondary">github.com</Badge>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <a href="#steps">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Read the last twelve deploys</TraceTitle>
                <TraceIcon>
                  <ChevronRightIcon />
                </TraceIcon>
              </TraceLine>
            </a>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine status="running">
                  <TraceIcon>
                    <SearchIcon />
                  </TraceIcon>
                  <TraceTitle>Searching for the cache key</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    cache key image optimization
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  )
}

```

See [Chain of Thought](/docs/ai-elements/base/chain-of-thought) and [Task](/docs/ai-elements/base/task) for more examples.

## Commit

A commit is a collapsible row with a line for each changed file. Say what changed in the title, Added, Edited or Deleted, and put the line counts in the description. Each file opens its diff in a [Sheet](#sheet).

```tsx
import {
  ChevronRightIcon,
  FilePenIcon,
  FilePlusIcon,
  GitCommitHorizontalIcon,
} from "lucide-react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const files = [
  {
    path: "app/login/page.tsx",
    added: false,
    additions: 2,
    deletions: 2,
    diff: `@@ -14,7 +14,7 @@ export async function LoginPage({
   searchParams,
 }) {
   const { next } = await searchParams
-  const redirectTo =
-    next && next.startsWith("/") ? next : "/"
+  const redirectTo = safeRedirect(next)
+
   return <LoginForm redirectTo={redirectTo} />
 }`,
  },
  {
    path: "lib/auth/redirect.ts",
    added: true,
    additions: 7,
    deletions: 0,
    diff: `@@ -0,0 +1,7 @@
+export function safeRedirect(next: string | undefined) {
+  if (!next || !next.startsWith("/") || next.startsWith("//")) {
+    return "/"
+  }
+
+  return next
+}`,
  },
]

function DiffLines({ diff }: { diff: string }) {
  return diff.split("\n").map((line, index) => {
    if (line.startsWith("@@")) {
      return (
        <CodeBlockLine key={index} className="text-muted-foreground">
          {line}
        </CodeBlockLine>
      )
    }

    return (
      <CodeBlockLine
        key={index}
        variant={
          line.startsWith("+")
            ? "added"
            : line.startsWith("-")
              ? "removed"
              : "default"
        }
      >
        {line.slice(1)}
      </CodeBlockLine>
    )
  })
}

export function TraceCommit() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {files.map((file) => (
              <Sheet key={file.path}>
                <SheetTrigger>
                  <TraceLine>
                    <TraceIcon>
                      {file.added ? <FilePlusIcon /> : <FilePenIcon />}
                    </TraceIcon>
                    <TraceTitle>
                      {file.added ? "Added" : "Edited"} {file.path}
                    </TraceTitle>
                    <TraceDescription className="font-mono">
                      +{file.additions} −{file.deletions}
                    </TraceDescription>
                    <TraceIcon>
                      <ChevronRightIcon />
                    </TraceIcon>
                  </TraceLine>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="font-mono">{file.path}</SheetTitle>
                    <SheetDescription>
                      {file.additions} additions, {file.deletions} deletions
                    </SheetDescription>
                  </SheetHeader>
                  <CodeBlock className="mx-6 mb-6 w-auto">
                    <CodeBlockContent>
                      <DiffLines diff={file.diff} />
                    </CodeBlockContent>
                  </CodeBlock>
                </SheetContent>
              </Sheet>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

## Whole Turn

Three levels: the turn, a summary, and the rows. Text between steps sits between two `Trace` lists.

```tsx
import {
  BrainIcon,
  ChevronRightIcon,
  FileTextIcon,
  TerminalIcon,
} from "lucide-react"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function TraceTurn() {
  return (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted className="flex flex-col gap-2">
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <BrainIcon />
                  </TraceIcon>
                  <TraceTitle>Thought</TraceTitle>
                  <TraceDescription>12s</TraceDescription>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="whitespace-pre-wrap">
                I should check which package managers are installed before I
                scaffold anything.
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <TerminalIcon />
                  </TraceIcon>
                  <TraceTitle>Ran 2 commands, 1 failed</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent keepMounted>
                <Trace>
                  <TraceLine>
                    <TraceIcon>
                      <TerminalIcon />
                    </TraceIcon>
                    <TraceTitle>Ran node --version</TraceTitle>
                  </TraceLine>
                  <TraceCollapsible>
                    <TraceCollapsibleTrigger>
                      <TraceLine status="error">
                        <TraceIcon>
                          <TerminalIcon />
                        </TraceIcon>
                        <TraceTitle>Failed to run pnpm --version</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm" variant="destructive">
                        <CodeBlockContent wrap className="max-h-64">
                          command not found: pnpm
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>Node is installed and pnpm is not. Reading the docs config.</p>
          <Trace>
            <a href="#turn">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
                <TraceIcon>
                  <ChevronRightIcon />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  )
}

```

## Reasoning

Render a `reasoning` part from the AI SDK. The row is a `TraceLine` until the first text arrives. See [Open State](#open-state).

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { BrainIcon } from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
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

const chat = createChat()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer.reasoning(
      "The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.",
      { delayMs: 60 }
    )
    writer.sleep(400)
    writer.text(
      "Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash."
    )
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

function ThinkingTrace({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  const line = (
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
    </TraceLine>
  )

  if (text.length === 0) {
    return line
  }

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function groupParts(parts: UIMessage["parts"]) {
  const runs: { trace: boolean; parts: UIMessage["parts"] }[] = []

  for (const part of parts) {
    const trace = part.type === "reasoning"

    if (!trace && part.type !== "text") {
      continue
    }

    const last = runs.at(-1)

    if (last?.trace === trace) {
      last.parts.push(part)
    } else {
      runs.push({ trace, parts: [part] })
    }
  }

  return runs
}

export function TraceThinking() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
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

        const live = status === "streaming" && message === messages.at(-1)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {groupParts(message.parts).map((run, runIndex) =>
                run.trace ? (
                  <Trace key={runIndex}>
                    {run.parts.map((part, index) =>
                      part.type === "reasoning" ? (
                        <ThinkingTrace
                          key={index}
                          text={part.text}
                          running={live && part.state === "streaming"}
                        />
                      ) : null
                    )}
                  </Trace>
                ) : (
                  run.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p key={`${runIndex}-${index}`}>{part.text}</p>
                    ) : null
                  )
                )
              )}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() =>
            nextMessage
              ? sendMessage(nextMessage)
              : setMessages(initialMessages)
          }
        >
          {nextMessage ? "Send message" : "Reset"}
        </Button>
      )}
    </div>
  )
}

```

See [Reasoning](/docs/ai-elements/base/reasoning) for more examples.

## Tool

Render tool parts from the AI SDK. Map the tool part as in [Tool](/docs/ai-elements/base/tool#states).

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { DynamicToolUIPart, UIMessage } from "ai"
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

const chat = createChat()
  .user("Which package managers are installed?")
  .assistant(({ writer }) => {
    writer
      .tool("runCommand", {
        dynamic: true,
        input: { command: "node --version" },
      })
      .sleep(900)
      .output({ stdout: "v24.18.0" })
    writer
      .tool("runCommand", {
        dynamic: true,
        input: { command: "npm --version" },
      })
      .sleep(900)
      .output({ stdout: "11.6.2" })
    writer
      .tool("runCommand", {
        dynamic: true,
        input: { command: "pnpm --version" },
      })
      .sleep(900)
      .error("command not found: pnpm")
    writer.text("Node 24 and npm 11 are installed. pnpm is not.")
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

function ToolTrace({ part, live }: { part: DynamicToolUIPart; live: boolean }) {
  const command = (part.input as { command?: string } | undefined)?.command

  if (part.state === "output-available" || part.state === "output-error") {
    const failed = part.state === "output-error"

    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status={failed ? "error" : undefined}>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>
              {failed ? "Failed to run" : "Ran"} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {failed
                ? part.errorText
                : (part.output as { stdout: string }).stdout}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  if (part.state === "output-denied") {
    return (
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Denied {command}</TraceTitle>
      </TraceLine>
    )
  }

  return (
    <TraceLine status={live ? "running" : "error"}>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {live ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}

function groupParts(parts: UIMessage["parts"]) {
  const runs: { trace: boolean; parts: UIMessage["parts"] }[] = []

  for (const part of parts) {
    const trace = part.type === "dynamic-tool"

    if (!trace && part.type !== "text") {
      continue
    }

    const last = runs.at(-1)

    if (last?.trace === trace) {
      last.parts.push(part)
    } else {
      runs.push({ trace, parts: [part] })
    }
  }

  return runs
}

export function TraceToolCalls() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
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

        const live = status === "streaming" && message === messages.at(-1)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {groupParts(message.parts).map((run, runIndex) =>
                run.trace ? (
                  <Trace key={runIndex}>
                    {run.parts.map((part) =>
                      part.type === "dynamic-tool" ? (
                        <ToolTrace
                          key={part.toolCallId}
                          part={part}
                          live={live}
                        />
                      ) : null
                    )}
                  </Trace>
                ) : (
                  run.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p key={`${runIndex}-${index}`}>{part.text}</p>
                    ) : null
                  )
                )
              )}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() =>
            nextMessage
              ? sendMessage(nextMessage)
              : setMessages(initialMessages)
          }
        >
          {nextMessage ? "Send message" : "Reset"}
        </Button>
      )}
    </div>
  )
}

```

See [Tool](/docs/ai-elements/base/tool) for more examples.

## Accessibility

`Trace` adds no roles of its own. Each line gets its semantics from the element that wraps it.

- A `TraceLine` on its own is a `span`. It is read as text and is not a tab stop.
- Wrap it in a `TraceCollapsibleTrigger` and it becomes a button with `aria-expanded`. Wrap it in a link, or in the trigger for a dialog or sheet, and it takes the keyboard and focus behavior of that element.
- `TraceIcon` is hidden from assistive tech, so `TraceTitle` is the accessible name. Write it as a sentence that says what happened, like "Edited trace.tsx", not just "trace.tsx".
- When a link opens a new tab, add "(opens in a new tab)" to the title with `sr-only`.
- Status is shown with color and motion, so put it in the title too. Write "Running pnpm build" while it runs and "Failed to run pnpm build" when it errors.
- The shimmer on a running title stops when the reader prefers reduced motion. The title still says what is happening.
- Inside a [Message Scroller](/docs/components/base/message-scroller), each line is announced once when it is added.
- `TraceCollapsibleContent` mutes its text. If you put a block with a muted background inside it, give the block `text-foreground` so it keeps its contrast. `CodeBlock` sets its own text color.

## API Reference

### Trace

A list of rows. It also styles any trigger or link that wraps a `TraceLine`.

| Prop        | Type     | Default | Description                              |
| ----------- | -------- | ------- | ---------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the list. |

### TraceLine

One line: an icon and a title. It is a span, so it is not a button or a tab stop. Wrap it in a trigger or a link to make it do something.

| Prop        | Type                                | Default | Description                              |
| ----------- | ----------------------------------- | ------- | ---------------------------------------- |
| `status`    | `"running" \| "error" \| "pending"` | -       | The state of the work the line reports.  |
| `className` | `string`                            | -       | Additional classes to apply to the line. |

### TraceIcon

A decorative icon slot, hidden from assistive tech. Before the title it names the action; after it, it is the indicator.

| Prop        | Type     | Default | Description                                   |
| ----------- | -------- | ------- | --------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the icon slot. |

### TraceTitle

One sentence on one line. It truncates and shimmers while the line is running.

| Prop        | Type     | Default | Description                               |
| ----------- | -------- | ------- | ----------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the title. |

### TraceDescription

Secondary text after the title, such as a count or a duration. It does not truncate.

| Prop        | Type     | Default | Description                                     |
| ----------- | -------- | ------- | ----------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the description. |

### TraceCollapsible

A row that expands. It accepts the props of [`Collapsible`](/docs/components/base/collapsible).

| Prop           | Type                      | Default | Description                                             |
| -------------- | ------------------------- | ------- | ------------------------------------------------------- |
| `open`         | `boolean`                 | -       | The controlled open state. Pass it with `onOpenChange`. |
| `defaultOpen`  | `boolean`                 | `false` | Whether the row starts open.                            |
| `onOpenChange` | `(open: boolean) => void` | -       | Called when the open state changes.                     |
| `className`    | `string`                  | -       | Additional classes to apply to the row.                 |

### TraceCollapsibleTrigger

The button that opens and closes the row. Put a `TraceLine` inside it. It adds a chevron after the line.

| Prop        | Type     | Default | Description                                 |
| ----------- | -------- | ------- | ------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the trigger. |

### TraceCollapsibleContent

The detail of a row that expands.

| Prop          | Type      | Default | Description                                                                 |
| ------------- | --------- | ------- | --------------------------------------------------------------------------- |
| `keepMounted` | `boolean` | `false` | Keep the detail mounted while closed, so nested rows keep their open state. |
| `className`   | `string`  | -       | Additional classes to apply to the content.                                 |
