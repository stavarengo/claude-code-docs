---
title: Queue
description: Displays the agent's todo list, split into what is left and what is done.
base: base
component: true
---

```tsx
"use client"

import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  ListChecksIcon,
  ListTodoIcon,
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
  UIDataTypes,
  {
    writeTodos: {
      input: {
        todos: {
          content: string
          status: "pending" | "in_progress" | "completed"
        }[]
      }
      output: string
    }
  }
>

type Todo = Extract<
  ChatMessage["parts"][number],
  { type: "tool-writeTodos"; state: "input-available" }
>["input"]["todos"][number]

const TODOS = [
  "Add a dark variant to the theme tokens",
  "Read the theme from a cookie",
  "Add a toggle to the settings page",
  "Check contrast on the charts",
]

function todosAt(current: number) {
  return TODOS.map(
    (content, index) =>
      ({
        content,
        status:
          index < current
            ? "completed"
            : index === current
              ? "in_progress"
              : "pending",
      }) satisfies Todo
  )
}

const chat = createChat<ChatMessage>()
  .user("Add dark mode to the settings page.")
  .assistant(({ writer }) => {
    TODOS.forEach((_, index) => {
      writer
        .tool("writeTodos", { input: { todos: todosAt(index) } })
        .output("Updated the todo list.")
      writer.sleep(1400)
    })
    writer
      .tool("writeTodos", { input: { todos: todosAt(TODOS.length) } })
      .output("Updated the todo list.")
    writer.text("Dark mode is in. The toggle is under Settings, Appearance.")
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function TodoLine({ todo, streaming }: { todo: Todo; streaming: boolean }) {
  return (
    <TraceLine
      status={
        streaming && todo.status === "in_progress" ? "running" : undefined
      }
    >
      <TraceIcon>
        {todo.status === "completed" ? (
          <CircleCheckIcon />
        ) : todo.status === "in_progress" ? (
          <CircleDotIcon />
        ) : (
          <CircleIcon />
        )}
      </TraceIcon>
      <TraceTitle>{todo.content}</TraceTitle>
    </TraceLine>
  )
}

function TodoQueue({
  todos,
  streaming,
}: {
  todos: Todo[]
  streaming: boolean
}) {
  const pending = todos.filter((todo) => todo.status !== "completed")
  const completed = todos.filter((todo) => todo.status === "completed")

  return (
    <Trace>
      {pending.length > 0 && (
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <ListTodoIcon />
              </TraceIcon>
              <TraceTitle>{pending.length} to do</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {pending.map((todo) => (
                <TodoLine
                  key={todo.content}
                  todo={todo}
                  streaming={streaming}
                />
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      )}
      {completed.length > 0 && (
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <ListChecksIcon />
              </TraceIcon>
              <TraceTitle>{completed.length} completed</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {completed.map((todo) => (
                <TodoLine
                  key={todo.content}
                  todo={todo}
                  streaming={streaming}
                />
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      )}
    </Trace>
  )
}

export function QueueDemo() {
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
        const todos = message.parts
          .filter((part) => part.type === "tool-writeTodos")
          .filter((part) => part.state !== "input-streaming")
          .at(-1)?.input?.todos
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {todos && <TodoQueue todos={todos} streaming={streaming} />}
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

Queue is the agent's todo list. Todos sit in two sections, To do and Completed, and the icon on each todo shows its status. The agent updates the list as it works, so a todo moves from one section to the other when it is done.

Queue is built with `Trace` with a `TraceCollapsible` for each section.

## Installation

Queue is built with the [Trace](/docs/components/base/trace) component.

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
        <TraceIcon>
          <ListTodoIcon />
        </TraceIcon>
        <TraceTitle>2 to do</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleIcon />
          </TraceIcon>
          <TraceTitle>Update the registry snapshots</TraceTitle>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <CircleIcon />
          </TraceIcon>
          <TraceTitle>Add tests for the combobox</TraceTitle>
        </TraceLine>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <ListChecksIcon />
        </TraceIcon>
        <TraceTitle>1 completed</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Add a changeset</TraceTitle>
        </TraceLine>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Descriptions

A todo with a description is a `TraceCollapsible` that opens to show it. A todo without one stays a `TraceLine`.

```tsx
import {
  CircleCheckIcon,
  CircleIcon,
  ListChecksIcon,
  ListTodoIcon,
} from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const todos: { title: string; description?: string; done: boolean }[] = [
  {
    title: "Write the migration guide",
    description: "Cover the renamed props and the new data attributes.",
    done: true,
  },
  { title: "Add a changeset", done: true },
  {
    title: "Fix the focus ring on the select trigger",
    description: "It is clipped by overflow-hidden on the field.",
    done: false,
  },
  { title: "Update the registry snapshots", done: false },
  {
    title: "Add tests for the combobox",
    description: "Typing, clearing and keyboard selection.",
    done: false,
  },
]

function TodoRow({ todo }: { todo: (typeof todos)[number] }) {
  const line = (
    <TraceLine>
      <TraceIcon>{todo.done ? <CircleCheckIcon /> : <CircleIcon />}</TraceIcon>
      <TraceTitle>{todo.title}</TraceTitle>
    </TraceLine>
  )

  if (!todo.description) {
    return line
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{todo.description}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function QueueDescriptions() {
  const pending = todos.filter((todo) => !todo.done)
  const completed = todos.filter((todo) => todo.done)

  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <ListTodoIcon />
            </TraceIcon>
            <TraceTitle>{pending.length} to do</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            {pending.map((todo) => (
              <TodoRow key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <ListChecksIcon />
            </TraceIcon>
            <TraceTitle>{completed.length} completed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            {completed.map((todo) => (
              <TodoRow key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

```tsx showLineNumbers
<TraceCollapsible>
  <TraceCollapsibleTrigger>
    <TraceLine>
      <TraceIcon>
        <CircleIcon />
      </TraceIcon>
      <TraceTitle>Fix the focus ring on the select trigger</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    It is clipped by overflow-hidden on the field.
  </TraceCollapsibleContent>
</TraceCollapsible>
```

## AI SDK

The agent writes its todos with a tool, `writeTodos` in this example. Each call sends the whole list, so render the last call and skip one whose input is still streaming.

```tsx showLineNumbers
const todos = message.parts
  .filter((part) => part.type === "tool-writeTodos")
  .filter((part) => part.state !== "input-streaming")
  .at(-1)?.input?.todos
```

Map each todo status to a section, an icon and a `TraceLine` status. Set `"running"` on the todo in progress only while the chat streams, so its title stops shimmering when the agent stops.

| Todo status   | Section   | Icon              | `TraceLine` status                 |
| ------------- | --------- | ----------------- | ---------------------------------- |
| `pending`     | To do     | `CircleIcon`      | none                               |
| `in_progress` | To do     | `CircleDotIcon`   | `"running"` while the chat streams |
| `completed`   | Completed | `CircleCheckIcon` | none                               |

## Migrating from AI SDK Elements

If you added Queue from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/queue.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/queue.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/queue.md and build Queue the same way.
3. Rebuild each part:
   - Queue renders a Trace.
   - QueueSection, QueueSectionTrigger and QueueSectionContent render TraceCollapsible, TraceCollapsibleTrigger and TraceCollapsibleContent.
   - QueueSectionLabel renders a TraceLine with a TraceIcon and a TraceTitle, like "2 to do".
   - QueueList renders a Trace. Drop the ScrollArea.
   - QueueItem renders a TraceLine. QueueItemIndicator renders a TraceIcon, QueueItemContent a TraceTitle, and QueueItemDescription a TraceDescription.
   - Keep QueueItemActions, QueueItemAction and the attachment parts as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
