---
title: Checkpoint
description: Marks a point in the conversation you can return to.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"

type ChatMessage = UIMessage<
  unknown,
  {
    checkpoint: {
      label: string
    }
  }
>

type CheckpointPart = Extract<
  ChatMessage["parts"][number],
  { type: "data-checkpoint" }
>

const chat = createChat<ChatMessage>()
  .user("Rename the button component to action.")
  .assistant(({ writer }) => {
    writer.text("Renamed Button to Action in components/ui/button.tsx.")
    writer.data({
      type: "data-checkpoint",
      id: "rename",
      data: { label: "Button renamed" },
    })
  })
  .user("Update the docs to match.")
  .assistant(({ writer }) => {
    writer.text("Updated the Button page to say Action.")
  })

const transcript = chat.get()
const transport = chat.transport({ delayMs: 20 })

export function CheckpointDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const nextMessage = chat.next(messages)
  const busy = status === "submitted" || status === "streaming"

  function restore(messageId: string) {
    const index = messages.findIndex((message) => message.id === messageId)

    if (index === -1) {
      return
    }

    setMessages(messages.slice(0, index + 1))
  }

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const checkpoint = message.parts.find(
          (part): part is CheckpointPart => part.type === "data-checkpoint"
        )
        const index = messages.findIndex((item) => item.id === message.id)
        const canRestore = index < messages.length - 1

        return (
          <React.Fragment key={message.id}>
            {message.role === "user" ? (
              <Message align="end">
                <MessageContent>
                  <Bubble align="end" variant="muted">
                    <BubbleContent>{getMessageText(message)}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            ) : (
              <Message>
                <MessageContent>
                  <p>{getMessageText(message)}</p>
                </MessageContent>
              </Message>
            )}
            {checkpoint && (
              <Marker variant="separator">
                <MarkerContent className="inline-flex items-center gap-2">
                  {checkpoint.data.label}
                  {canRestore && (
                    <Button
                      size="xs"
                      variant="outline"
                      aria-label={`Restore to ${checkpoint.data.label}`}
                      onClick={() => restore(message.id)}
                    >
                      Restore
                    </Button>
                  )}
                </MarkerContent>
              </Marker>
            )}
          </React.Fragment>
        )
      })}
      {!busy && nextMessage && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() => sendMessage(nextMessage)}
        >
          Continue
        </Button>
      )}
    </div>
  )
}

```

Checkpoint is a point in the conversation you can return to. It is a [Marker](/docs/components/base/marker) after a turn, with a Restore button. Restore keeps that turn and drops every message after it.

## Installation

Checkpoint is built with the [Marker](/docs/components/base/marker) and [Button](/docs/components/base/button) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add marker button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add marker button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="marker"
  title="components/ui/marker.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

Render a marker after the turn, with a button that restores it.

```tsx showLineNumbers
<Marker variant="separator">
  <MarkerContent className="inline-flex items-center gap-2">
    {label}
    <Button size="xs" variant="outline" onClick={restore}>
      Restore
    </Button>
  </MarkerContent>
</Marker>
```

See [Marker](/docs/components/base/marker#separator).

## AI SDK

Restore replaces the thread with the messages up to and including that turn. Every later turn is removed. Send a new message to continue from there.

```tsx showLineNumbers
const index = messages.findIndex((message) => message.id === messageId)
setMessages(messages.slice(0, index + 1))
```

## AI SDK Helper

To script a checkpoint with [`createChat`](/docs/helpers/ai-sdk), write it as a data part on the agent's turn. Send the same `id` again only when you mean to update that checkpoint.

```ts showLineNumbers
const chat = createChat()
  .user("Rename the button component to action.")
  .assistant(({ writer }) => {
    writer.text("Renamed Button to Action in components/ui/button.tsx.")
    writer.data({
      type: "data-checkpoint",
      id: "rename",
      data: { label: "Button renamed" },
    })
  })
  .user("Update the docs to match.")
  .assistant(({ writer }) => {
    writer.text("Updated the Button page to say Action.")
  })
```

## Migrating from AI SDK Elements

If you added Checkpoint from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/checkpoint.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Marker and Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/checkpoint.tsx from AI SDK Elements to the shadcn/ui Marker and Button components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add marker button
2. Read https://ui.shadcn.com/docs/ai-elements/base/checkpoint.md and build Checkpoint the same way.
3. Rebuild each part:
   - Checkpoint renders a Marker with variant="separator" and a MarkerContent, instead of a Separator.
   - CheckpointIcon renders a MarkerIcon.
   - CheckpointTrigger renders a Button with size="xs" and variant="outline", like "Restore". Keep its tooltip prop on the Tooltip.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
