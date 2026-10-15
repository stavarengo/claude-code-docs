---
title: Confirmation
description: Asks for approval before a tool runs.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIDataTypes,
  type UIMessage,
} from "ai"
import { CircleCheckIcon, LoaderCircleIcon, TerminalIcon } from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
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

const chat = createChat<ChatMessage>()
  .user("Clean up the build folder.")
  .sleep(600)
  .assistant(({ writer }) => {
    writer.reasoning(
      "The build output lives in dist. Deleting it cannot be undone, so I should ask before I run the command."
    )
    writer.sleep(400)
    writer.tool("runCommand", {
      input: { command: "rm -rf dist" },
      needsApproval: true,
      output: { stdout: "" },
    })
  })
  .assistant(({ writer, toolCall }) => {
    writer.sleep(600)
    writer.text(
      toolCall?.approved
        ? "Removed the dist folder."
        : "Okay, I left the dist folder in place."
    )
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

export function ConfirmationDemo() {
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    addToolApprovalResponse,
  } = useChat({
    messages: initialMessages,
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
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

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return <p key={index}>{part.text}</p>
                }

                if (part.type === "reasoning") {
                  return (
                    <Trace key={index}>
                      <ReasoningRow
                        text={part.text}
                        running={part.state === "streaming"}
                      />
                    </Trace>
                  )
                }

                if (part.type !== "tool-runCommand") {
                  return null
                }

                // A pending approval is a prompt, not activity, so it sits outside Trace.
                if (part.state === "approval-requested") {
                  return (
                    <Item key={part.toolCallId} variant="outline" size="sm">
                      <ItemMedia variant="icon">
                        <TerminalIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Run {part.input.command}?</ItemTitle>
                        <ItemDescription>
                          The command runs in this project.
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addToolApprovalResponse({
                              id: part.approval.id,
                              approved: false,
                            })
                          }
                        >
                          Deny
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            addToolApprovalResponse({
                              id: part.approval.id,
                              approved: true,
                            })
                          }
                        >
                          Approve
                        </Button>
                      </ItemActions>
                    </Item>
                  )
                }

                const denied =
                  part.state === "output-denied" ||
                  (part.state === "approval-responded" &&
                    !part.approval.approved)

                return (
                  <Trace key={part.toolCallId}>
                    <TraceLine
                      status={
                        !denied && part.state !== "output-available"
                          ? "running"
                          : undefined
                      }
                    >
                      <TraceIcon>
                        <TerminalIcon />
                      </TraceIcon>
                      <TraceTitle>
                        {denied
                          ? "Denied"
                          : part.state === "output-available"
                            ? "Ran"
                            : "Running"}{" "}
                        {part.input?.command}
                      </TraceTitle>
                    </TraceLine>
                  </Trace>
                )
              })}
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

function ReasoningRow({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>
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
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

```

Confirmation asks the person for a yes or no before a tool runs. The question is an [Item](/docs/components/base/item) with Deny and Approve buttons. Once the person answers, the call becomes a [Tool](/docs/ai-elements/base/tool) line.

## Installation

Confirmation is built with the [Item](/docs/components/base/item) and [Button](/docs/components/base/button) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add item button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add item button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="item"
  title="components/ui/item.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
<Item variant="outline" size="sm">
  <ItemMedia variant="icon">
    <TerminalIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Run {part.input.command}?</ItemTitle>
    <ItemDescription>The command runs in this project.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="sm" variant="outline" onClick={deny}>
      Deny
    </Button>
    <Button size="sm" onClick={approve}>
      Approve
    </Button>
  </ItemActions>
</Item>
```

## AI SDK

While the part is `approval-requested`, answer with the approval id. Pass `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses` so the chat continues once every approval has an answer.

```tsx showLineNumbers
addToolApprovalResponse({
  id: part.approval.id,
  approved: true,
})
```

```tsx showLineNumbers
useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
})
```

Approve streams the tool output. Deny streams `output-denied`. Either way, the part becomes a Tool line.

See [Tool](/docs/ai-elements/base/tool#approval).

## AI SDK Helper

To script an approval with [`createChat`](/docs/helpers/ai-sdk), set `needsApproval` on the tool. The `output` streams after approval, and the next agent turn reads `toolCall.approved`.

```ts showLineNumbers
const chat = createChat()
  .user("Clean up the build folder.")
  .assistant(({ writer }) => {
    writer.tool("runCommand", {
      input: { command: "rm -rf dist" },
      needsApproval: true,
      output: { stdout: "" },
    })
  })
  .assistant(({ writer, toolCall }) => {
    writer.text(
      toolCall?.approved
        ? "Removed the dist folder."
        : "Okay, I left the dist folder in place."
    )
  })
```

## Migrating from AI SDK Elements

If you added Confirmation from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/confirmation.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Item and Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/confirmation.tsx from AI SDK Elements to the shadcn/ui Item and Button components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add item button
2. Read https://ui.shadcn.com/docs/ai-elements/base/confirmation.md and build Confirmation the same way.
3. Rebuild each part:
   - Confirmation renders an Item with variant="outline" and size="sm", instead of an Alert. Keep the approval and state props and the context they feed.
   - ConfirmationTitle renders an ItemContent with an ItemTitle.
   - ConfirmationActions renders an ItemActions.
   - ConfirmationAction renders a Button with size="sm".
   - Keep ConfirmationRequest, ConfirmationAccepted and ConfirmationRejected as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
