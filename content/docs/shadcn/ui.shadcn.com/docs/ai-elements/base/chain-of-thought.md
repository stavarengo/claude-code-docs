---
title: Chain of Thought
description: Displays a summary that expands into the steps an agent took.
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
import { Badge } from "@/components/ui/badge"
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
    searchWeb: {
      input: { query: string }
      output: { results: { title: string; url: string }[] }
    }
    readBuildLog: {
      input: { deployment: string }
      output: { log: string }
    }
    searchCode: {
      input: { query: string }
      output: { files: string[] }
    }
  }
>

type StepPart = Extract<
  ChatMessage["parts"][number],
  { type: "tool-searchWeb" | "tool-readBuildLog" | "tool-searchCode" }
>

const chat = createChat<ChatMessage>()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer
      .tool("readBuildLog", { input: { deployment: "dpl_8Kx2" } })
      .sleep(900)
      .output({
        log: "install    41s\ncompile    38s\nimages   3m 52s",
      })
    writer
      .tool("searchWeb", { input: { query: "next.js image cache key" } })
      .sleep(900)
      .output({
        results: [
          {
            title: "Image component | nextjs.org",
            url: "https://nextjs.org/docs/app/api-reference/components/image",
          },
          {
            title: "Build cache | vercel.com",
            url: "https://vercel.com/docs/deployments/troubleshoot-a-build",
          },
        ],
      })
    writer
      .tool("searchCode", { input: { query: "cacheKey" } })
      .sleep(900)
      .output({ files: ["next.config.ts", "scripts/optimize-images.ts"] })
    writer.text(
      "Image optimization takes almost four minutes because its cache key includes the commit hash. Key it on the image directory instead."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function StatusIcon({ status }: { status?: "running" | "error" }) {
  if (status === "running") {
    return <LoaderCircleIcon className="animate-spin" />
  }

  return status === "error" ? <CircleAlertIcon /> : <CircleCheckIcon />
}

function Step({
  title,
  status,
  defaultOpen,
  children,
}: {
  title: string
  status?: "running" | "error"
  defaultOpen?: boolean
  children?: React.ReactNode
}) {
  const line = (
    <TraceLine status={status}>
      <TraceIcon>
        <StatusIcon status={status} />
      </TraceIcon>
      <TraceTitle>{title}</TraceTitle>
    </TraceLine>
  )

  if (!children) {
    return line
  }

  return (
    <TraceCollapsible defaultOpen={defaultOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{children}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function StepRow({ part, streaming }: { part: StepPart; streaming: boolean }) {
  const status =
    part.state === "output-available"
      ? undefined
      : part.state === "output-error" || !streaming
        ? "error"
        : "running"
  const verb = (running: string, done: string, failed: string) =>
    status === "running" ? running : status === "error" ? failed : done
  const error = part.state === "output-error" && (
    <CodeBlock size="sm" variant="destructive">
      <CodeBlockContent wrap className="max-h-64">
        {part.errorText}
      </CodeBlockContent>
    </CodeBlock>
  )

  if (part.type === "tool-searchWeb") {
    return (
      <Step
        status={status}
        title={`${verb("Searching", "Searched", "Failed to search")} the web for ${part.input?.query}`}
      >
        {error ||
          (part.state === "output-available" && (
            <Trace>
              {part.output.results.map((result) => (
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
          ))}
      </Step>
    )
  }

  if (part.type === "tool-readBuildLog") {
    return (
      <Step
        status={status}
        defaultOpen
        title={`${verb("Reading", "Read", "Failed to read")} the build log for ${part.input?.deployment}`}
      >
        {error ||
          (part.state === "output-available" && (
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {part.output.log}
              </CodeBlockContent>
            </CodeBlock>
          ))}
      </Step>
    )
  }

  return (
    <Step
      status={status}
      title={`${verb("Searching", "Searched", "Failed to search")} the code for ${part.input?.query}`}
    >
      {error ||
        (part.state === "output-available" && (
          <div className="flex flex-wrap gap-1.5">
            {part.output.files.map((file) => (
              <Badge key={file} variant="secondary" className="font-mono">
                {file}
              </Badge>
            ))}
          </div>
        ))}
    </Step>
  )
}

function ChainOfThought({
  steps,
  streaming,
  answering,
}: {
  steps: StepPart[]
  streaming: boolean
  answering: boolean
}) {
  const [open, setOpen] = React.useState<boolean>()
  const running = streaming && !answering
  const failed = steps.filter((part) => part.state === "output-error").length
  const status = running ? "running" : failed > 0 ? "error" : undefined

  return (
    <Trace>
      <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine status={status}>
            <TraceIcon>
              <StatusIcon status={status} />
            </TraceIcon>
            <TraceTitle>
              {running
                ? "Researching"
                : `Researched in ${steps.length} steps${failed > 0 ? `, ${failed} failed` : ""}`}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            {steps.map((part) => (
              <StepRow
                key={part.toolCallId}
                part={part}
                streaming={streaming}
              />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

export function ChainOfThoughtDemo() {
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
        const steps = message.parts.filter(
          (part) =>
            part.type === "tool-searchWeb" ||
            part.type === "tool-readBuildLog" ||
            part.type === "tool-searchCode"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {steps.length > 0 && (
                <ChainOfThought
                  steps={steps}
                  streaming={streaming}
                  answering={text.length > 0}
                />
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

Chain of Thought is a summary line that expands into the steps an agent took. The summary says what happened, like "Researched in 3 steps". The steps sit inside it, each one a line of its own.

Chain of Thought is built with `Trace` with a `TraceCollapsible` for the summary.

## Installation

Chain of Thought is built with the [Trace](/docs/components/base/trace), [Code Block](/docs/components/base/code-block) and [Badge](/docs/components/base/badge) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace code-block badge
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible code-block badge
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
<Trace>
  <TraceCollapsible defaultOpen>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Researched in 3 steps</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Read the build log for dpl_8Kx2</TraceTitle>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Searched the web for next.js image cache key</TraceTitle>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Searched the code for cacheKey</TraceTitle>
        </TraceLine>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Steps

Each step is a `TraceLine`. Set its `status` and write the title in the matching tense.

| Step              | `status`    | Title                         |
| ----------------- | ----------- | ----------------------------- |
| Running           | `"running"` | Searching for …               |
| Done, with detail | none        | Searched for …                |
| Done, links out   | none        | Read the Image component docs |
| Failed            | `"error"`   | Failed to search for …        |

Add `keepMounted` to the summary's `TraceCollapsibleContent`. Steps keep their open state when the summary closes.

## Search Results

When a step runs a web search, show the results as a `Badge` for each hostname in the step's content.

```tsx showLineNumbers
<TraceCollapsibleContent className="flex flex-wrap gap-1.5">
  {results.map((result) => (
    <Badge key={result.url} variant="secondary">
      {new URL(result.url).hostname}
    </Badge>
  ))}
</TraceCollapsibleContent>
```

## AI SDK

Render each tool part as a step. `running` is true while tool parts stream and before the reply starts. Set the summary's status and title from the steps. The summary opens while the steps run, as in [Trace](/docs/components/base/trace#open-state).

```tsx showLineNumbers
const [open, setOpen] = React.useState<boolean>()
const running = streaming && !answering
const failed = steps.filter((part) => part.state === "output-error").length

<TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : failed > 0 ? "error" : undefined}>
      <TraceTitle>
        {running ? "Researching" : `Researched in ${steps.length} steps`}
      </TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent keepMounted>
    <Trace>
      {steps.map((part) => (
        <StepLine key={part.toolCallId} part={part} streaming={streaming} />
      ))}
    </Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

`StepLine` renders one tool part as a `TraceLine`, as in [Tool](/docs/ai-elements/base/tool#states).

## Migrating from AI SDK Elements

If you added ChainOfThought from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/chain-of-thought.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Badge. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/chain-of-thought.tsx from AI SDK Elements to the shadcn/ui Trace and Badge components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace badge
2. Read https://ui.shadcn.com/docs/ai-elements/base/chain-of-thought.md and build Chain of Thought the same way.
3. Rebuild each part:
   - ChainOfThought renders a Trace with a TraceCollapsible. Pass open, defaultOpen and onOpenChange to the TraceCollapsible.
   - ChainOfThoughtHeader renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle, like "Researched in 3 steps".
   - ChainOfThoughtContent renders a TraceCollapsibleContent with keepMounted, and a Trace for the steps.
   - ChainOfThoughtStep renders a TraceLine. Its icon goes in a TraceIcon, its label in a TraceTitle and its description in a TraceDescription. Map status "active" to "running", "pending" to "pending", and "complete" to no status.
   - ChainOfThoughtSearchResults renders a flex-wrap list, and ChainOfThoughtSearchResult a Badge with variant="secondary".
   - Keep ChainOfThoughtImage as it is.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
