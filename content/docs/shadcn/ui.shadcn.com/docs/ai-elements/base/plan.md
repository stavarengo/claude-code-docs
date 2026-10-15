---
title: Plan
description: Displays the steps the agent plans to take, and how far it has got.
base: base
component: true
---

```tsx
"use client"

import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  RouteIcon,
} from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent } from "@/components/ui/message"
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

type ChatMessage = UIMessage<
  unknown,
  {
    plan: {
      title: string
      steps: { title: string; status: "done" | "running" | "pending" }[]
    }
  }
>

type PlanPart = Extract<ChatMessage["parts"][number], { type: "data-plan" }>

const STEPS = [
  "Install @base-ui/react",
  "Replace the Radix imports",
  "Rename asChild to render",
  "Run the type checker",
]

function planAt(current: number) {
  return {
    title: "Plan: migrate to Base UI",
    steps: STEPS.map((title, index) => ({
      title,
      status:
        index < current ? "done" : index === current ? "running" : "pending",
    })),
  } satisfies PlanPart["data"]
}

const chat = createChat<ChatMessage>()
  .user("Migrate the dialog components to Base UI.")
  .assistant(({ writer }) => {
    STEPS.forEach((_, index) => {
      writer
        .data({ type: "data-plan", id: "plan", data: planAt(index) })
        .sleep(1200)
    })
    writer.data({ type: "data-plan", id: "plan", data: planAt(STEPS.length) })
    writer.text("Migrated Dialog and AlertDialog. The type checker passes.")
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function PlanRow({
  plan,
  streaming,
}: {
  plan: PlanPart["data"]
  streaming: boolean
}) {
  const done = plan.steps.filter((step) => step.status === "done").length
  const running = streaming && done < plan.steps.length

  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            <RouteIcon />
          </TraceIcon>
          <TraceTitle>{plan.title}</TraceTitle>
          <TraceDescription>
            {done} of {plan.steps.length} done
          </TraceDescription>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {plan.steps.map((step) => (
            <TraceLine
              key={step.title}
              status={
                step.status === "pending"
                  ? "pending"
                  : streaming && step.status === "running"
                    ? "running"
                    : undefined
              }
            >
              <TraceIcon>
                {step.status === "done" ? (
                  <CircleCheckIcon />
                ) : step.status === "running" ? (
                  <CircleDotIcon />
                ) : (
                  <CircleIcon />
                )}
              </TraceIcon>
              <TraceTitle>{step.title}</TraceTitle>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function PlanDemo() {
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
        const plan = message.parts.find((part) => part.type === "data-plan")
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {plan && (
                <Trace>
                  <PlanRow plan={plan.data} streaming={streaming} />
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

Plan is the list of steps the agent decides on before it starts, such as the steps of a migration. Each step is done, running or pending, and the title counts how many are done.

Plan is built with `Trace` with a `TraceCollapsible` for the plan.

When the steps are not known up front, use [Task](/docs/ai-elements/base/task#task-or-plan) instead.

## Installation

Plan is built with the [Trace](/docs/components/base/trace) component.

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
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
```

```tsx showLineNumbers
<Trace>
  <TraceCollapsible defaultOpen>
    <TraceCollapsibleTrigger>
      <TraceLine status="running">
        <TraceIcon>
          <RouteIcon />
        </TraceIcon>
        <TraceTitle>Plan: migrate to Base UI</TraceTitle>
        <TraceDescription>2 of 5 done</TraceDescription>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Replace the Radix imports</TraceTitle>
        </TraceLine>
        <TraceLine status="running">
          <TraceIcon>
            <CircleDotIcon />
          </TraceIcon>
          <TraceTitle>Rename asChild to render</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon>
            <CircleIcon />
          </TraceIcon>
          <TraceTitle>Run the type checker</TraceTitle>
        </TraceLine>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Details

Put a description above the steps, inside `TraceCollapsibleContent`.

```tsx
import { CircleCheckIcon, CircleIcon, RouteIcon } from "lucide-react"

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

const steps = [
  "Add a dark variant to the theme tokens",
  "Read the theme from a cookie on the server",
  "Add a toggle to the settings page",
  "Check contrast on the charts",
]

export function PlanDescription() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <RouteIcon />
            </TraceIcon>
            <TraceTitle>Plan: add dark mode</TraceTitle>
            <TraceDescription>1 of {steps.length} done</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-3">
          <p>
            Store the theme in a cookie so the server renders the right one and
            the page does not flash on load.
          </p>
          <Trace>
            {steps.map((step, index) => (
              <TraceLine key={step} status={index > 0 ? "pending" : undefined}>
                <TraceIcon>
                  {index === 0 ? <CircleCheckIcon /> : <CircleIcon />}
                </TraceIcon>
                <TraceTitle>{step}</TraceTitle>
              </TraceLine>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

## AI SDK

Stream the plan as a data part with a fixed `id`. The AI SDK replaces a data part with the same `id`, so it updates in place.

```ts showLineNumbers title="app/api/chat/route.ts"
const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    writer.write({ type: "data-plan", id: "plan", data: { title, steps } })
  },
})
```

```tsx showLineNumbers
const plan = message.parts.find((part) => part.type === "data-plan")
```

## Migrating from AI SDK Elements

If you added Plan from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/plan.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/plan.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/plan.md and build Plan the same way.
3. Rebuild each part:
   - Plan renders a Trace with a TraceCollapsible, instead of a Card. Pass isStreaming down in a context.
   - PlanHeader renders a TraceCollapsibleTrigger with a TraceLine. Set status="running" on the TraceLine while isStreaming is true, instead of the Shimmer.
   - PlanTitle renders a TraceTitle, and PlanDescription a TraceDescription, like "2 of 4 done".
   - PlanContent renders a TraceCollapsibleContent with a Trace for the steps.
   - PlanTrigger renders only its children, since the whole line opens the plan.
   - Buttons cannot sit inside a trigger. Render PlanAction next to the TraceCollapsibleTrigger, not inside it.
   - Keep PlanFooter as a plain container.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
