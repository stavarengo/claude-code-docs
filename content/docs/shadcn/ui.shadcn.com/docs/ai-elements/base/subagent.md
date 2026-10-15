---
title: Subagent
description: Displays a subagent run, with its tool calls and result.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  CircleAlertIcon,
  CircleCheckIcon,
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

type SubagentMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runCommand: {
      input: { command: string }
      output: { stdout: string }
    }
  }
>

type SubagentPart = SubagentMessage["parts"][number]

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    researchAgent: {
      input: { task: string }
      output: SubagentMessage
    }
  }
>

type Part = ChatMessage["parts"][number]

const steps = [
  {
    command: "grep -rn cacheKey scripts",
    stdout:
      "scripts/optimize-images.ts:14:  const cacheKey = process.env.COMMIT_SHA",
  },
  {
    command: "sed -n 13,15p scripts/optimize-images.ts",
    stdout:
      'const cacheDir = ".next/cache/images"\nconst cacheKey = process.env.COMMIT_SHA\nconst cached = await restoreCache(cacheDir, cacheKey)',
  },
  {
    command: "ls public/images | wc -l",
    stdout: "1240",
  },
]

function getSubagentMessage(done: number, report?: string): SubagentMessage {
  const parts = steps.slice(0, done).map(
    (step, index): SubagentPart => ({
      type: "tool-runCommand",
      toolCallId: `step-${index}`,
      state: "output-available",
      input: { command: step.command },
      output: { stdout: step.stdout },
    })
  )

  if (done < steps.length) {
    parts.push({
      type: "tool-runCommand",
      toolCallId: `step-${done}`,
      state: "input-available",
      input: { command: steps[done].command },
    })
  }

  if (report) {
    parts.push({ type: "text", text: report })
  }

  return { id: "research-agent", role: "assistant", parts }
}

const chat = createChat<ChatMessage>()
  .user("Why does image optimization rerun on every deploy?")
  .assistant(({ writer }) => {
    const subagent = writer
      .tool("researchAgent", {
        input: {
          task: "Find out why image optimization reruns on every deploy.",
        },
      })
      .sleep(600)
    steps.forEach((_, index) => {
      subagent
        .output(getSubagentMessage(index), { preliminary: true })
        .sleep(1000)
    })
    subagent
      .output(
        getSubagentMessage(
          steps.length,
          "The cache is keyed on the commit SHA, so every deploy misses it and optimizes all 1,240 images again."
        )
      )
      .sleep(400)
    writer.text(
      "Image optimization reruns because its cache is keyed on the commit SHA, which changes on every deploy. Key the cache on a hash of public/images instead, and unchanged images will be skipped."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function StepRow({
  part,
  running,
}: {
  part: Extract<SubagentPart, { type: "tool-runCommand" }>
  running: boolean
}) {
  const command = part.input?.command

  if (part.state === "output-available") {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
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
    <TraceLine status={running ? "running" : "error"}>
      <TraceIcon>
        {running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleAlertIcon />
        )}
      </TraceIcon>
      <TraceTitle>
        {running ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}

function SubagentRow({
  part,
  streaming,
}: {
  part: Extract<Part, { type: "tool-researchAgent" }>
  streaming: boolean
}) {
  const done = part.state === "output-available" && !part.preliminary
  const running = !done && part.state !== "output-error" && streaming
  const parts = part.state === "output-available" ? part.output.parts : []
  const report = parts
    .map((agentPart) => (agentPart.type === "text" ? agentPart.text : ""))
    .join("")

  const line = (
    <TraceLine status={done ? undefined : running ? "running" : "error"}>
      <TraceIcon>
        {done ? (
          <CircleCheckIcon />
        ) : running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleAlertIcon />
        )}
      </TraceIcon>
      <TraceTitle>
        {done ? "Ran" : running ? "Running" : "Failed to run"} the research
        subagent
      </TraceTitle>
    </TraceLine>
  )

  if (parts.length === 0) {
    return line
  }

  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted className="flex flex-col gap-3">
        <Trace>
          {parts.map((agentPart) =>
            agentPart.type === "tool-runCommand" ? (
              <StepRow
                key={agentPart.toolCallId}
                part={agentPart}
                running={running}
              />
            ) : null
          )}
        </Trace>
        {report && <p>{report}</p>}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function SubagentDemo() {
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
        const agents = message.parts.filter(
          (part) => part.type === "tool-researchAgent"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {agents.length > 0 && (
                <Trace>
                  {agents.map((part) => (
                    <SubagentRow
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

Subagent is a line for work the agent hands to a subagent. The run is the title, like "Ran the research agent". Open it for the tool calls the subagent made and what it found.

Subagent is built with `Trace` with a `TraceCollapsible` for the run and a nested `Trace` for its tool calls.

## Installation

Subagent is built with the [Trace](/docs/components/base/trace), [Code Block](/docs/components/base/code-block) and [Badge](/docs/components/base/badge) components.

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
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Ran the research agent</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted className="flex flex-col gap-3">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CircleCheckIcon />
          </TraceIcon>
          <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
        </TraceLine>
      </Trace>
      <p>The cache is keyed on the commit SHA.</p>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Running

While the subagent runs, the line has `status="running"` and its content shows the tool calls so far. Add the result when the subagent finishes.

```tsx
import { CircleCheckIcon, LoaderCircleIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function SubagentRunning() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceIcon>
              <LoaderCircleIcon className="animate-spin" />
            </TraceIcon>
            <TraceTitle>Running the research agent</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
            </TraceLine>
            <TraceLine status="running">
              <TraceIcon>
                <LoaderCircleIcon className="animate-spin" />
              </TraceIcon>
              <TraceTitle>
                Running sed -n 13,15p scripts/optimize-images.ts
              </TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

## Details

Put the task the subagent was given at the top of the content, with its model and tools as [Badge](/docs/components/base/badge) items. Show how long it ran in a `TraceDescription` after the title.

```tsx
import { CircleCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

export function SubagentDetails() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Ran the research agent</TraceTitle>
            <TraceDescription>48s</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">anthropic/claude-sonnet-4.5</Badge>
            <Badge variant="outline" className="font-mono">
              runCommand
            </Badge>
          </div>
          <p>Find out why image optimization reruns on every deploy.</p>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>
                Ran sed -n 13,15p scripts/optimize-images.ts
              </TraceTitle>
            </TraceLine>
          </Trace>
          <p>The cache is keyed on the commit SHA.</p>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

## AI SDK

With the AI SDK, a subagent is a tool whose `execute` yields the subagent's `UIMessage` as it streams. Render the tool part as the line and `part.output.parts` as the nested `Trace`. Map each nested tool part as in [Tool](/docs/ai-elements/base/tool#states).

Each yield is a preliminary output: the part is `output-available` with `preliminary: true`. The final output replaces it, so check `preliminary` before you show "Ran".

| Tool part state                                         | `TraceLine` status                 | Title           |
| ------------------------------------------------------- | ---------------------------------- | --------------- |
| `input-streaming`, `input-available`                    | `"running"` while the chat streams | Running …       |
| `output-available` with `preliminary: true`             | `"running"` while the chat streams | Running …       |
| `output-available`                                      | none                               | Ran …           |
| `output-error`, or a running state after the chat stops | `"error"`                          | Failed to run … |

## Migrating from AI SDK Elements

If you added Agent from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/agent.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace, Code Block and Badge. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/agent.tsx from AI SDK Elements to the shadcn/ui Trace, Code Block and Badge components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block badge
2. Read https://ui.shadcn.com/docs/ai-elements/base/subagent.md and build Subagent the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - Agent renders a Trace with a TraceCollapsible.
   - AgentHeader renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle with the name, like "Ran the research agent". Show model in a Badge.
   - AgentContent renders a TraceCollapsibleContent with keepMounted.
   - AgentTools renders a Trace, and AgentTool a TraceLine for each tool call, instead of an Accordion.
   - Keep AgentInstructions and AgentOutput, with AgentOutput on CodeBlock.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
