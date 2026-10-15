---
title: Task
description: Displays the steps the agent takes, as it takes them.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
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
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  {
    task: {
      title: string
      steps: { title: string; status: "done" | "running" | "error" }[]
    }
  }
>

type TaskPart = Extract<ChatMessage["parts"][number], { type: "data-task" }>

type Status = "running" | "error" | undefined

const TASKS = [
  {
    id: "find",
    title: ["Finding the project files", "Found the project files"],
    steps: [
      ["Searching for generateMetadata", "Searched for generateMetadata"],
      ["Reading app/layout.tsx", "Read app/layout.tsx"],
      ["Reading app/page.tsx", "Read app/page.tsx"],
    ],
  },
  {
    id: "update",
    title: ["Updating the page metadata", "Updated the page metadata"],
    steps: [
      ["Editing app/layout.tsx", "Edited app/layout.tsx"],
      ["Editing app/page.tsx", "Edited app/page.tsx"],
    ],
  },
]

function taskAt(task: (typeof TASKS)[number], done: number) {
  return {
    title: task.title[done < task.steps.length ? 0 : 1],
    steps: task.steps.slice(0, done + 1).map(([running, finished], index) => ({
      title: index < done ? finished : running,
      status: index < done ? "done" : "running",
    })),
  } satisfies TaskPart["data"]
}

const chat = createChat<ChatMessage>()
  .user("Add Open Graph metadata to the home page.")
  .assistant(({ writer }) => {
    TASKS.forEach((task) => {
      for (let done = 0; done <= task.steps.length; done++) {
        writer
          .data({ type: "data-task", id: task.id, data: taskAt(task, done) })
          .sleep(900)
      }
    })
    writer.text(
      "Added Open Graph defaults to app/layout.tsx and a title, description and image for the home page in app/page.tsx."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function getStepStatus(
  status: TaskPart["data"]["steps"][number]["status"],
  streaming: boolean
): Status {
  if (status === "done") {
    return undefined
  }

  return status === "running" && streaming ? "running" : "error"
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "running") {
    return <LoaderCircleIcon className="animate-spin" />
  }

  return status === "error" ? <CircleAlertIcon /> : <CircleCheckIcon />
}

function TaskRow({
  task,
  streaming,
}: {
  task: TaskPart["data"]
  streaming: boolean
}) {
  const [open, setOpen] = React.useState<boolean>()
  const steps = task.steps.map((step) => ({
    title: step.title,
    status: getStepStatus(step.status, streaming),
  }))
  const status = steps.some((step) => step.status === "error")
    ? "error"
    : steps.some((step) => step.status === "running")
      ? "running"
      : undefined

  return (
    <TraceCollapsible
      open={open ?? status === "running"}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={status}>
          <TraceIcon>
            <StatusIcon status={status} />
          </TraceIcon>
          <TraceTitle>{task.title}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          {steps.map((step) => (
            <TraceLine key={step.title} status={step.status}>
              <TraceTitle>{step.title}</TraceTitle>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function TaskDemo() {
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
        const tasks = message.parts.filter((part) => part.type === "data-task")
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tasks.length > 0 && (
                <Trace>
                  {tasks.map((part) => (
                    <TaskRow
                      key={part.id}
                      task={part.data}
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

Task is a piece of work the agent is doing, such as finding the project files or updating a page. Each step, like a search, a read or an edit, appears under the task when the agent takes it.

Task is built with `Trace` with a `TraceCollapsible` for each task.

## Task or Plan

Both are a list of steps under a collapsible line. The difference is when the steps are known.

Use [Plan](/docs/ai-elements/base/plan) when the agent decides the steps before it starts. Use Task when the steps come from the work itself, and the agent only knows the next one once it has taken the last.

|               | Plan                                   | Task                                            |
| ------------- | -------------------------------------- | ----------------------------------------------- |
| Steps         | Every step, from the start             | Each step, once the agent takes it              |
| Pending steps | Yes, waiting their turn                | None                                            |
| Title         | The goal, with progress: "2 of 4 done" | What the agent is doing, then what it did       |
| Per reply     | One plan                               | One or more tasks, each closing when it is done |

## Installation

Task is built with the [Trace](/docs/components/base/trace) component.

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
  <TraceCollapsible defaultOpen>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceTitle>Found the project files</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <SearchIcon />
          </TraceIcon>
          <TraceTitle>Searched for app/page.tsx</TraceTitle>
        </TraceLine>
        <a href="/files/app/page.tsx">
          <TraceLine>
            <TraceIcon>
              <FileTextIcon />
            </TraceIcon>
            <TraceTitle>Read app/page.tsx</TraceTitle>
          </TraceLine>
        </a>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Status

Set the task's status from its steps. Write the title in the present tense while the task runs, and in the past tense once it is done.

| Steps                   | `status`    | Title                              |
| ----------------------- | ----------- | ---------------------------------- |
| A step is still running | `"running"` | Updating the page metadata         |
| A step failed           | `"error"`   | Failed to update the page metadata |
| Every step is done      | none        | Updated the page metadata          |

Put several tasks in one `Trace`. Keep the running task open, and close each task once it is done.

## AI SDK

Stream each task as a data part with its own `id`. The AI SDK replaces a data part with the same `id`, so writing a task again with a new step updates it in place.

```ts showLineNumbers title="app/api/chat/route.ts"
const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    writer.write({ type: "data-task", id: "update", data: { title, steps } })
  },
})
```

```tsx showLineNumbers
const tasks = message.parts.filter((part) => part.type === "data-task")
```

## Migrating from AI SDK Elements

If you added Task from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/task.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/task.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/task.md and build Task the same way.
3. Rebuild each part:
   - Task renders a Trace with a TraceCollapsible.
   - TaskTrigger renders a TraceCollapsibleTrigger with a TraceLine and a TraceTitle with title.
   - TaskContent renders a TraceCollapsibleContent with keepMounted, and a Trace for the steps.
   - TaskItem renders a TraceLine with a TraceTitle.
   - Keep TaskItemFile as it is.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
