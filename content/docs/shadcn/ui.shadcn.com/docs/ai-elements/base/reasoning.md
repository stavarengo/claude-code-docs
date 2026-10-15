---
title: Reasoning
description: Displays the agent's thinking as it streams.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const chat = createChat()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer.reasoning(
      "The deploy log has three phases. Install takes 38s and next build takes 52s, both normal for this repo.\n\nImage optimization takes 3m 50s. It reruns on every deploy because its cache key includes the commit hash, so the cache never hits.",
      { delayMs: 40 }
    )
    writer.sleep(400)
    writer.text(
      "Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash, and the deploy should take under two minutes."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function ReasoningRow({
  text,
  running,
  defaultOpen,
}: {
  text: string
  running: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  const line = (
    <TraceLine status={running ? "running" : undefined}>
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

export function ReasoningDemo() {
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
        const reasoning = message.parts.filter(
          (part) => part.type === "reasoning"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {reasoning.length > 0 && (
                <Trace>
                  {reasoning.map((part, index) => (
                    <ReasoningRow
                      key={index}
                      text={part.text}
                      running={streaming && part.state === "streaming"}
                      defaultOpen={busy ? undefined : true}
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

Reasoning is a line for the agent's thinking. It reads "Thinking" and opens while the model thinks, then reads "Thought" and closes when it is done. The thinking itself sits inside, and the line can show how long it took.

Reasoning is built with `Trace` with a `TraceCollapsible` for the thinking.

## Installation

Reasoning is built with the [Trace](/docs/components/base/trace) component.

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
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Thought</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent className="whitespace-pre-wrap">
      {text}
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Duration

The AI SDK does not time reasoning. Measure it on the server, send it as message metadata, and show it in a `TraceDescription` after the title.

```tsx
import { CircleCheckIcon } from "lucide-react"

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

export function ReasoningDuration() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Thought</TraceTitle>
            <TraceDescription>12s</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="whitespace-pre-wrap">
          The build log shows install and compile finish in under a minute.
          Image optimization takes almost four, and it reruns on every deploy
          because the cache key includes the commit hash.
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

```tsx showLineNumbers
<TraceLine>
  <TraceIcon>
    <CircleCheckIcon />
  </TraceIcon>
  <TraceTitle>Thought</TraceTitle>
  <TraceDescription>{seconds}s</TraceDescription>
</TraceLine>
```

## AI SDK

Render each `reasoning` part as a line. It starts as a plain `TraceLine` and becomes a `TraceCollapsible` once text arrives, so there is nothing to open before the model has written anything. It opens while the model thinks and closes when it finishes. If the person opens or closes it, their choice wins. See [Open State](/docs/components/base/trace#open-state).

```tsx showLineNumbers
function ReasoningLine({ text, running }: { text: string; running: boolean }) {
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
```

```tsx showLineNumbers
<Trace>
  {message.parts
    .filter((part) => part.type === "reasoning")
    .map((part, index) => (
      <ReasoningLine
        key={index}
        text={part.text}
        running={streaming && part.state === "streaming"}
      />
    ))}
</Trace>
```

Some models send several reasoning parts in one message. Each one is a line in the same `Trace`.

## Migrating from AI SDK Elements

If you added Reasoning from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/reasoning.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/reasoning.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/reasoning.md and build Reasoning the same way.
3. Rebuild each part:
   - Reasoning renders a Trace with a TraceCollapsible. Keep isStreaming, open, defaultOpen, onOpenChange and duration, and the useReasoning context.
   - ReasoningTrigger renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle. Set status="running" while isStreaming is true, instead of the Shimmer. The title reads "Thinking" while it streams, then the duration, like "Thought for 5s".
   - ReasoningContent renders a TraceCollapsibleContent. Keep Streamdown for the text.
   - Keep the open behavior: open while it streams, close when it finishes, unless the person opened or closed it.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
