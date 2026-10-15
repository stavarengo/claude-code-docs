---
title: Sources
description: Displays the links the agent used for a reply.
base: base
component: true
---

```tsx
"use client"

import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { ArrowUpRightIcon, GlobeIcon } from "lucide-react"

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
  .user("How do I start an Astro project with pnpm?")
  .assistant(({ writer }) => {
    writer.text(
      "Run pnpm create astro@latest and follow the prompts. It scaffolds the project and installs the dependencies."
    )
    writer.sourceUrl({
      url: "https://docs.astro.build/en/install-and-setup/",
      title: "Install Astro | docs.astro.build",
    })
    writer.sourceUrl({
      url: "https://www.npmjs.com/package/create-astro",
      title: "create-astro | npmjs.com",
    })
    writer.sourceUrl({
      url: "https://docs.astro.build/en/install-and-setup/",
      title: "Install Astro | docs.astro.build",
    })
    writer.sourceUrl({
      url: "https://pnpm.io/cli/create",
      title: "pnpm create | pnpm.io",
    })
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

type SourcePart = Extract<UIMessage["parts"][number], { type: "source-url" }>

function Sources({ sources }: { sources: SourcePart[] }) {
  return (
    <Trace>
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
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
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
    </Trace>
  )
}

export function SourcesDemo() {
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

        const sources = message.parts
          .filter((part) => part.type === "source-url")
          .filter(
            (part, index, all) =>
              all.findIndex((other) => other.url === part.url) === index
          )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {text && <p>{text}</p>}
              {sources.length > 0 && <Sources sources={sources} />}
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

Sources is a line that lists the links the agent used for a reply. It says how many there are, like "Used 3 sources", and opens into a link for each one.

Sources is built with `Trace` with a `TraceCollapsible` for the list.

## Installation

Sources is built with the [Trace](/docs/components/base/trace) component.

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
          <GlobeIcon />
        </TraceIcon>
        <TraceTitle>Used {sources.length} sources</TraceTitle>
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
</Trace>
```

## AI SDK

Collect the `source-url` parts of a message and render them after the text. The agent can cite the same page more than once, so dedupe them by `url`.

```tsx showLineNumbers
const sources = message.parts
  .filter((part) => part.type === "source-url")
  .filter(
    (part, index, all) =>
      all.findIndex((other) => other.url === part.url) === index
  )
```

`title` is optional on a `source-url` part. Fall back to the hostname of the URL.

## Accessibility

Each source is a plain link inside the list.

- Links open in a new tab. Add `sr-only` text, like "(opens in a new tab)", so screen readers announce it.
- The arrow icon is decorative. The title is the name of the link.
- The count in the trigger, like "Used 3 sources", tells the person what opens before they open it.

## Migrating from AI SDK Elements

If you added Sources from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/sources.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/sources.tsx from AI SDK Elements to the shadcn/ui Trace component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Trace: npx shadcn@latest add trace
2. Read https://ui.shadcn.com/docs/ai-elements/base/sources.md and build Sources the same way.
3. Rebuild each part:
   - Sources renders a Trace with a TraceCollapsible.
   - SourcesTrigger renders a TraceCollapsibleTrigger with a TraceLine, a TraceIcon and a TraceTitle that uses count, like "Used 3 sources".
   - SourcesContent renders a TraceCollapsibleContent with a Trace for the links.
   - Source renders a link that wraps a TraceLine, with a TraceIcon and a TraceTitle for its title. Add "(opens in a new tab)" in an sr-only span.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
