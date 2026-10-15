---
title: Code Block
description: Displays code, terminal output and diffs with an optional header, line numbers and a copy button.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { DownloadIcon, FileCodeIcon, WrapTextIcon } from "lucide-react"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

function download(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: "text/plain" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function CodeBlockDemo() {
  const [wrap, setWrap] = React.useState(false)
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="w-full max-w-lg">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <FileCodeIcon />
            app/api/chat/route.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Wrap lines"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Download"
              onClick={() => download(code, "route.ts")}
            >
              <DownloadIcon />
            </Button>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap} lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={index >= 5 && index <= 9 ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

`CodeBlock` displays code, terminal output, logs and diffs. It has a header with a title and actions, line numbers, wrapping, diff and highlighted lines, and a small size for tool output in a [Trace](/docs/components/base/trace).

Syntax highlighting is optional and lives in a separate hook, so a block that only shows plain output stays small.

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add code-block
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install shiki
```

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="code-block"
  title="components/ui/code-block.tsx"
  styleName="base-rhea"
/>

<ComponentSource
  src="/registry/bases/base/hooks/use-highlighted-code.ts"
  title="hooks/use-highlighted-code.ts"
  styleName="base-rhea"
/>

<ComponentSource
  src="/registry/bases/base/lib/highlighter.tsx"
  title="lib/highlighter.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

`code-block` also installs `useHighlightedCode` for [syntax highlighting](#syntax-highlighting).

## Usage

```tsx showLineNumbers
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
```

```tsx showLineNumbers
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>Terminal</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={output} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent>{output}</CodeBlockContent>
</CodeBlock>
```

## Composition

```text
CodeBlock
├── CodeBlockHeader
│   ├── CodeBlockTitle
│   └── CodeBlockActions
│       └── CodeBlockCopyButton
├── CodeBlockActions (floating, when there is no header)
├── CodeBlockContent
│   └── CodeBlockLine
└── CodeBlockFooter
```

`CodeBlockContent` takes a string or a list of `CodeBlockLine`. Use lines when you need line variants or highlighted tokens.

## Features

- **It streams cheaply.** A string child renders as one text node, and the highlighter tokenizes only the new lines as code arrives.
- **It copies cleanly.** Line numbers and diff markers are left out of a selection, and blank lines survive the copy.
- **It reads left to right.** The content is always `dir="ltr"`. The header follows the page direction.
- **It highlights without WASM.** `useHighlightedCode` uses Shiki's JavaScript engine, loads each language on first use and renders ANSI colors in terminal output. On the server, `highlightCode` keeps Shiki out of the client bundle.
- **It fits where code shows up.** Use it in a message, a Markdown fence, a Trace line, Tabs, a Dialog or a `typeset` container.
- **It scrolls by keyboard.** The content is focusable, and floating actions show on focus as well as on hover.

## Basic

Pass a string to `CodeBlockContent`. It renders as one text node, so it stays cheap while output streams.

```tsx
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

const output = `$ pnpm build
> next build

 ✓ Compiled successfully in 4.2s
 ✓ Generating static pages (12/12)

Route (app)                Size  First Load JS
┌ ○ /                    1.9 kB         112 kB
├ ○ /_not-found           993 B         103 kB
└ ƒ /api/chat             141 B         102 kB`

export function CodeBlockBasic() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Header

`CodeBlockHeader` holds a `CodeBlockTitle` and `CodeBlockActions`. `CodeBlockCopyButton` copies its `value`.

```tsx
import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const command = "pnpm add ai @ai-sdk/react zod"

const output = `$ ${command}
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`

export function CodeBlockHeaderExample() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={command} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

A long title truncates. To link the title to a file, wrap `CodeBlockTitle` in an anchor.

```tsx showLineNumbers
<CodeBlockHeader>
  <a href="/files/route.ts">
    <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
  </a>
</CodeBlockHeader>
```

## Actions

`CodeBlockActions` holds any number of buttons. For a wrap toggle, keep the state yourself and pass it to `wrap`.

```tsx
"use client"

import * as React from "react"
import { DownloadIcon, TerminalIcon, WrapTextIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const output = `$ pnpm lint
apps/web/components/message-list.tsx
  18:22  error  'messages' is possibly 'undefined'. Add a guard before calling map  @typescript-eslint/no-unsafe-call
  42:7   warning  React Hook React.useEffect has a missing dependency: 'scrollToBottom'  react-hooks/exhaustive-deps

✖ 2 problems (1 error, 1 warning)`

function download(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: "text/plain" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function CodeBlockActionsExample() {
  const [wrap, setWrap] = React.useState(true)

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Wrap lines"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Download"
              onClick={() => download(output, "lint.log")}
            >
              <DownloadIcon />
            </Button>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

```tsx showLineNumbers
const [wrap, setWrap] = React.useState(false)

<CodeBlockActions>
  <Button
    variant="ghost"
    size="icon-xs"
    aria-label="Wrap lines"
    aria-pressed={wrap}
    onClick={() => setWrap(!wrap)}
  >
    <WrapTextIcon />
  </Button>
  <CodeBlockCopyButton value={output} />
</CodeBlockActions>
<CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
```

## Floating Actions

Without a header, put `CodeBlockActions` directly inside `CodeBlock`. The actions float at the top end and stay hidden until the block is hovered or focused. They always show on touch screens.

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@/components/ui/code-block"

const output = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
dependencies:
+ @ai-sdk/react 3.0.12
+ ai 6.0.12
+ zod 4.1.12
Done in 2.8s using pnpm v10.18.0`

export function CodeBlockFloatingActions() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockActions>
          <CodeBlockCopyButton value={output} />
        </CodeBlockActions>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Line Numbers

Add `lineNumbers` to `CodeBlockContent`. A string child is split into lines, and the numbers are not copied with a selection.

```tsx
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

const code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`

export function CodeBlockLineNumbers() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Start Line

Set `startLine` to number lines from a given line, for a snippet from the middle of a file. The gutter grows to fit the widest number.

```tsx
"use client"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const code = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`

export function CodeBlockStartLine() {
  const lines = useHighlightedCode(code, "tsx")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/dashboard/page.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers startLine={995}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Wrap

Long lines scroll by default. Add `wrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, see [Actions](#actions).

```tsx
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

const output = `Error: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens and the context window is 200,000 tokens. Remove some messages or summarize the conversation and try again.`

export function CodeBlockWrap() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Highlighted Lines

Render each line as a `CodeBlockLine` and set `variant="highlighted"` on the lines to call out.

```tsx
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"

const code = `export {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`

const highlighted = [2, 3]

export function CodeBlockHighlightedLines() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          {code.split("\n").map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={highlighted.includes(index) ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Diff

Set `variant="added"` or `variant="removed"` on a `CodeBlockLine`. Each one adds a `+` or `−` marker.

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const patch = ` export function Greeting({ name }: { name: string }) {
-  return <p>Hello, {name}</p>
+  return <p className="text-sm text-muted-foreground">
+    Hello, {name}!
+  </p>
 }`

function getVariant(line: string) {
  if (line.startsWith("+")) {
    return "added"
  }

  if (line.startsWith("-")) {
    return "removed"
  }

  return "default"
}

export function CodeBlockDiff() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={patch} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>
          {patch.split("\n").map((line, index) => (
            <CodeBlockLine key={index} variant={getVariant(line)}>
              {line.slice(1)}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Height

Cap the height with a `max-h-*` class on `CodeBlockContent`. The content scrolls inside the block.

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const logs = Array.from(
  { length: 40 },
  (_, index) =>
    `[${String(index + 1).padStart(2, "0")}] GET /api/chat 200 in ${12 + ((index * 7) % 40)}ms`
).join("\n")

export function CodeBlockHeight() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Logs</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={logs} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent className="max-h-48 scroll-fade-y">
          {logs}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

`CodeBlockContent` fades its edges with [`scroll-fade`](/docs/utils/scroll-fade) as it scrolls: left and right by default, top and bottom when it wraps. Add `scroll-fade-y` to a capped block that does not wrap.

## Show More

`CodeBlockFooter` is a slot below the content. For Show More, cap the content while it is collapsed and put a ghost `xs` `Button` in the footer.

```tsx
"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const code = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Send</Button>
      </form>
    </div>
  )
}`

export function CodeBlockShowMore() {
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(code, "tsx")
  const id = React.useId()

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          lineNumbers
          className={
            expanded ? undefined : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon className="transition-transform in-aria-expanded:rotate-180" />
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}

```

```tsx showLineNumbers
const [expanded, setExpanded] = React.useState(false)
const id = React.useId()

<CodeBlockContent
  id={id}
  className={expanded ? undefined : "max-h-64 overflow-y-hidden scroll-fade-y"}
>
  {code}
</CodeBlockContent>
<CodeBlockFooter className="justify-center">
  <Button
    variant="ghost"
    size="xs"
    aria-expanded={expanded}
    aria-controls={id}
    onClick={() => setExpanded(!expanded)}
  >
    {expanded ? "Show less" : "Show more"}
  </Button>
</CodeBlockFooter>
```

### Max Height

To keep a long block from taking over the page, raise the cap instead of removing it. The expanded content scrolls, and the edges fade as you scroll.

```tsx
"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const code = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Send</Button>
      </form>
    </div>
  )
}`

export function CodeBlockShowMoreScroll() {
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(code, "tsx")
  const id = React.useId()

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          lineNumbers
          className={
            expanded
              ? "max-h-96 scroll-fade-y"
              : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon className="transition-transform in-aria-expanded:rotate-180" />
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}

```

## Size

Use `size="sm"` for tool and [Trace](#trace) output. It has tighter padding and `text-xs` text.

```tsx
import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const output = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`

export function CodeBlockSize() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Destructive

Use `variant="destructive"` for errors and failed output.

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const error = `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)`

export function CodeBlockDestructive() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock variant="destructive">
        <CodeBlockHeader>
          <CodeBlockTitle>Error</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={error} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{error}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Trace

Put a `CodeBlock` with `size="sm"` in `TraceCollapsibleContent` for tool and terminal output. Add `wrap` and a `max-h-64` class to `CodeBlockContent` so long output wraps and scrolls inside the trace. The block sets its own text color, so `TraceCollapsibleContent` does not mute it.

```tsx
import { TerminalIcon } from "lucide-react"

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

const output = `$ node --version
v24.18.0`

const error = `$ pnpm dev
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1908:16)`

export function CodeBlockTrace() {
  return (
    <div className="w-full max-w-md">
      <Trace>
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
                {output}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <TerminalIcon />
              </TraceIcon>
              <TraceTitle>Failed to run pnpm dev</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap className="max-h-64">
                {error}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}

```

## Tabs

Show several files with [Tabs](/docs/components/base/tabs), one `CodeBlock` in each `TabsContent`.

```tsx
"use client"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const files = [
  {
    id: "route",
    title: "app/api/chat/route.ts",
    language: "ts",
    code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    id: "chat",
    title: "components/chat.tsx",
    language: "tsx",
    code: `"use client"

import { useChat } from "@ai-sdk/react"

export function Chat() {
  const { messages } = useChat()

  return <MessageList messages={messages} />
}`,
  },
  {
    id: "env",
    title: ".env.local",
    language: "bash",
    code: "AI_GATEWAY_API_KEY=your-api-key",
  },
]

function FileCode({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent lineNumbers>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export function CodeBlockTabs() {
  return (
    <Tabs defaultValue="route" className="w-full max-w-md">
      <TabsList>
        {files.map((file) => (
          <TabsTrigger key={file.id} value={file.id}>
            {file.title.split("/").at(-1)}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map((file) => (
        <TabsContent key={file.id} value={file.id}>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>{file.title}</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={file.code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <FileCode code={file.code} language={file.language} />
          </CodeBlock>
        </TabsContent>
      ))}
    </Tabs>
  )
}

```

## Message

Put a `CodeBlock` between paragraphs inside a [Message](/docs/components/base/message).

```tsx
"use client"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Message, MessageContent } from "@/components/ui/message"

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

export function CodeBlockChat() {
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do I stream a response?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3">
          <p>Create a route handler that returns the stream:</p>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>
              {lines.map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))}
            </CodeBlockContent>
          </CodeBlock>
          <p>The client reads it with useChat.</p>
        </MessageContent>
      </Message>
    </div>
  )
}

```

## Typeset

A `CodeBlock` inside a [`typeset`](/docs/typeset) container keeps its own styles and gets the same space above as a paragraph.

```tsx
"use client"

import { FileCodeIcon } from "lucide-react"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`

export function CodeBlockTypeset() {
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="typeset w-full max-w-md">
      <h3>Stream a response</h3>
      <p>
        Create a route handler that calls <code>streamText</code> and returns
        the stream to the client.
      </p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <FileCodeIcon />
            app/api/chat/route.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
      <p>
        The <code>useChat</code> hook reads the stream on the client and renders
        the answer while it is written.
      </p>
    </div>
  )
}

```

## RTL

To enable RTL support in shadcn/ui, see the [RTL configuration guide](/docs/rtl). Code always reads left to right. The header follows the page direction.

```tsx
"use client"

import { TerminalIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      description: "Install the packages, then start the dev server.",
      title: "Terminal",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      description: "ثبّت الحزم، ثم شغّل خادم التطوير.",
      title: "الطرفية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      description: "התקן את החבילות, ואז הפעל את שרת הפיתוח.",
      title: "מסוף",
    },
  },
}

const code = `pnpm add ai @ai-sdk/react zod
pnpm dev`

export function CodeBlockRtl() {
  const { dir, t } = useTranslation(translations, "ar")
  const lines = useHighlightedCode(code, "bash")

  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-sm" dir={dir}>
      <p>{t.description}</p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            {t.title}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

## Syntax Highlighting

`useHighlightedCode` highlights with [Shiki](https://shiki.style) and returns one React node per line for `CodeBlockLine`.

```tsx
"use client"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const code = `{
  "location": "San Francisco",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["fog", "wind"]
}`

export function CodeBlockHighlighting() {
  const lines = useHighlightedCode(code, "json")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>getWeather output</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

```tsx showLineNumbers
const lines = useHighlightedCode(code, "json")

<CodeBlock>
  <CodeBlockContent>
    {lines.map((line, index) => (
      <CodeBlockLine key={index}>{line}</CodeBlockLine>
    ))}
  </CodeBlockContent>
</CodeBlock>
```

Shiki uses its JavaScript regex engine, so there is no WASM to load.

### Languages

Each language loads the first time it is used. Edit the list in `lib/highlighter.tsx`. A language that is not in the list renders as plain text.

```tsx
"use client"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const samples = [
  {
    language: "css",
    title: "app/globals.css",
    code: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`,
  },
  {
    language: "python",
    title: "main.py",
    code: `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
  },
  {
    language: "text",
    title: "notes.txt",
    code: "A language that is not in the list renders as plain text.",
  },
]

function Sample({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export function CodeBlockLanguages() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {samples.map((sample) => (
        <CodeBlock key={sample.language}>
          <CodeBlockHeader>
            <CodeBlockTitle>{sample.title}</CodeBlockTitle>
          </CodeBlockHeader>
          <Sample code={sample.code} language={sample.language} />
        </CodeBlock>
      ))}
    </div>
  )
}

```

The list ships with `bash`, `css`, `diff`, `html`, `javascript`, `json`, `jsx`, `markdown`, `python`, `sql`, `tsx`, `typescript` and `yaml`, plus aliases such as `ts`, `js`, `sh` and `yml`.

### Terminal Output

Pass `"ansi"` as the language to render the colors in terminal output. Without it, escape codes show as text.

```tsx
"use client"

import { TerminalIcon } from "lucide-react"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const output = `$ pnpm test
\x1b[32m✓\x1b[39m src/format.test.ts \x1b[2m(4 tests)\x1b[22m
\x1b[32m✓\x1b[39m src/parse.test.ts \x1b[2m(7 tests)\x1b[22m
\x1b[31m✗\x1b[39m src/stream.test.ts \x1b[2m(3 tests | 1 failed)\x1b[22m

\x1b[31mAssertionError: expected 'hello' to be 'hello world'\x1b[39m

Tests  \x1b[31m1 failed\x1b[39m | \x1b[32m13 passed\x1b[39m (14)`

export function CodeBlockAnsi() {
  const lines = useHighlightedCode(output, "ansi")

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output.replace(/\x1b\[[\d;]*m/g, "")} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

```

ANSI colors do not carry from one line to the next.

### Server Rendering

`highlightCode` is async and works in a Server Component, so Shiki stays out of the client bundle.

```tsx showLineNumbers
import { highlightCode } from "@/lib/highlighter"

export async function ServerCode({ code }: { code: string }) {
  const lines = (await highlightCode(code, "tsx")) ?? code.split("\n")

  return (
    <CodeBlock>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
```

### Streaming

While the code streams, the hook tokenizes only the new lines, starting where the last line left off. Lines that did not change keep the same nodes, so React skips them.

```tsx
"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const blocks: {
  title?: string
  language: string
  code: string
  lineNumbers?: boolean
  highlight?: number[]
  diff?: boolean
}[] = [
  {
    title: "hooks/use-debounce.ts",
    language: "ts",
    lineNumbers: true,
    code: `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}`,
  },
  {
    language: "bash",
    code: "pnpm dlx shadcn@latest add code-block",
  },
  {
    title: "components/search.tsx",
    language: "tsx",
    lineNumbers: true,
    diff: true,
    code: ` export function Search() {
   const [query, setQuery] = React.useState("")
-  const results = useSearch(query)
+  const debounced = useDebounce(query, 300)
+  const results = useSearch(debounced)

   return <SearchResults results={results} />
 }`,
  },
  {
    title: "app/api/chat/route.ts",
    language: "ts",
    lineNumbers: true,
    highlight: [5, 6, 7, 8],
    code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    title: ".env.local",
    language: "bash",
    code: "AI_GATEWAY_API_KEY=your-api-key",
  },
]

// Where each block starts in the stream.
const offsets = blocks.map((_, index) =>
  blocks.slice(0, index).reduce((total, block) => total + block.code.length, 0)
)
const total = blocks.reduce((sum, block) => sum + block.code.length, 0)

function StreamingBlock({
  block,
  code,
}: {
  block: (typeof blocks)[number]
  code: string
}) {
  const rows = code.split("\n")
  // A diff row starts with +, - or a space. The marker is not part of the code.
  const source = block.diff ? rows.map((row) => row.slice(1)).join("\n") : code
  const lines = useHighlightedCode(source, block.language)

  return (
    <CodeBlock>
      {block.title && (
        <CodeBlockHeader>
          <CodeBlockTitle>{block.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={source}
              disabled={code.length < block.code.length}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
      )}
      <CodeBlockContent lineNumbers={block.lineNumbers}>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              block.diff
                ? rows[index]?.startsWith("+")
                  ? "added"
                  : rows[index]?.startsWith("-")
                    ? "removed"
                    : "default"
                : block.highlight?.includes(index)
                  ? "highlighted"
                  : "default"
            }
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

export function CodeBlockStreaming() {
  const [length, setLength] = React.useState(total)

  React.useEffect(() => {
    if (length >= total) {
      return
    }

    const timeout = setTimeout(() => setLength(length + 3), 16)
    return () => clearTimeout(timeout)
  }, [length])

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {blocks.map(
        (block, index) =>
          length > offsets[index] && (
            <StreamingBlock
              key={block.code}
              block={block}
              code={block.code.slice(0, length - offsets[index])}
            />
          )
      )}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={length < total}
        onClick={() => setLength(0)}
      >
        <RotateCcwIcon />
        Replay
      </Button>
    </div>
  )
}

```

### Markdown

Render the message with [Streamdown](https://streamdown.ai) and route fenced code to a `CodeBlock` with `components.code`. Streamdown sets `data-block` on fenced code only, so inline code stays inline.

```tsx
"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  Streamdown,
  useIsCodeFenceIncomplete,
  type ExtraProps,
} from "streamdown"

import { createChat, getMessageText } from "@/lib/ai"
import { useHighlightedCode } from "@/components/hooks/use-highlighted-code"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Message, MessageContent } from "@/components/ui/message"

const response = `Wrap the value in a \`useDebounce\` hook. It returns the latest value once it stops changing for \`delay\` milliseconds.

\`\`\`tsx
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
\`\`\`

Pass the debounced value to your fetch instead of the raw input.`

const chat = createChat()
  .user("How do I debounce a search input in React?")
  .assistant(({ writer }) => {
    writer.text(response)
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 30 })

function MarkdownCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  // True while the closing fence has not arrived yet.
  const incomplete = useIsCodeFenceIncomplete()
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{language || "text"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} disabled={incomplete} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function MarkdownCode({
  node,
  className,
  children,
  ...props
}: React.ComponentProps<"code"> & ExtraProps) {
  // Streamdown marks fenced code with data-block. Everything else is inline.
  if (!("data-block" in props)) {
    return (
      <code
        className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <MarkdownCodeBlock
      code={typeof children === "string" ? children : ""}
      language={/language-(\S+)/.exec(className ?? "")?.[1] ?? ""}
    />
  )
}

const components = { code: MarkdownCode }

export function CodeBlockMarkdown() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-112 w-full max-w-md flex-col gap-4 py-6 text-sm">
      {messages.map((message) =>
        message.role === "user" ? (
          <Message key={message.id} align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{getMessageText(message)}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        ) : (
          <Message key={message.id}>
            <MessageContent>
              <Streamdown
                controls={false}
                components={components}
                isAnimating={busy && message === messages.at(-1)}
              >
                {getMessageText(message)}
              </Streamdown>
            </MessageContent>
          </Message>
        )
      )}
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

`useIsCodeFenceIncomplete` returns `true` until the closing fence arrives. Use it to disable the copy button while the code is incomplete. It only works when Streamdown gets `isAnimating`, so pass `isAnimating` while the message streams.

```tsx showLineNumbers
<Streamdown components={{ code: MarkdownCode }} isAnimating={isStreaming}>
  {text}
</Streamdown>
```

## Accessibility

- `CodeBlockContent` is a `pre` with a `code` element and always sets `dir="ltr"`, so code reads left to right on an RTL page.
- `CodeBlockContent` has `tabIndex={0}`, so keyboard users can focus it and scroll it. Pass `tabIndex={-1}` to remove the tab stop.
- Floating actions show when focus is inside the block, not only on hover, so keyboard users can reach them.
- Line numbers are hidden from screen readers.
- Diff lines carry a `+` or `−` marker as well as a tint, so the change does not rely on color.
- `CodeBlockCopyButton` is labelled "Copy", and a polite live region announces "Copied" after a successful copy.
- Give a wrap toggle `aria-pressed` so its state is announced.
- Give a Show More button `aria-expanded` and point `aria-controls` at the `id` of `CodeBlockContent`.

## API Reference

### CodeBlock

The surface that holds the header, the content and the footer.

| Prop        | Type                         | Default     | Description                                                     |
| ----------- | ---------------------------- | ----------- | --------------------------------------------------------------- |
| `variant`   | `"default" \| "destructive"` | `"default"` | The tone of the block.                                          |
| `size`      | `"default" \| "sm"`          | `"default"` | `"sm"` has tighter padding and `text-xs` code, for tool output. |
| `className` | `string`                     | -           | Additional classes to apply to the block.                       |

### CodeBlockHeader

A row above the content for a title and actions.

| Prop        | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `className` | `string` | -       | Additional classes to apply to the header. |

### CodeBlockTitle

A filename or a label, with an optional icon. It truncates.

| Prop        | Type     | Default | Description                               |
| ----------- | -------- | ------- | ----------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the title. |

### CodeBlockActions

Holds buttons at the end of the header. As a direct child of `CodeBlock`, it floats.

| Prop        | Type     | Default | Description                                 |
| ----------- | -------- | ------- | ------------------------------------------- |
| `className` | `string` | -       | Additional classes to apply to the actions. |

### CodeBlockCopyButton

A ghost icon button that copies `value` to the clipboard. It accepts the props of [`Button`](/docs/components/base/button).

| Prop        | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `value`     | `string` | -       | Required. The text to copy.                |
| `className` | `string` | -       | Additional classes to apply to the button. |

### CodeBlockContent

The `pre` that scrolls or wraps.

| Prop          | Type              | Default | Description                                                     |
| ------------- | ----------------- | ------- | --------------------------------------------------------------- |
| `children`    | `React.ReactNode` | -       | A string, or a list of `CodeBlockLine`.                         |
| `wrap`        | `boolean`         | `false` | Wrap long lines instead of scrolling.                           |
| `lineNumbers` | `boolean`         | `false` | Number each line. A string child is split into lines.           |
| `startLine`   | `number`          | `1`     | The number of the first line, when `lineNumbers` is set.        |
| `tabIndex`    | `number`          | `0`     | Makes the content focusable so it can be scrolled by keyboard.  |
| `className`   | `string`          | -       | Additional classes to apply to the content, such as `max-h-72`. |

### CodeBlockLine

One line of code.

| Prop        | Type                                                 | Default     | Description                              |
| ----------- | ---------------------------------------------------- | ----------- | ---------------------------------------- |
| `variant`   | `"default" \| "added" \| "removed" \| "highlighted"` | `"default"` | The state of the line.                   |
| `className` | `string`                                             | -           | Additional classes to apply to the line. |

### CodeBlockFooter

A row below the content, such as for a Show More button.

| Prop        | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `className` | `string` | -       | Additional classes to apply to the footer. |

### useHighlightedCode

```tsx
const lines = useHighlightedCode(code, language)
```

Returns one React node per line. It returns plain lines until the first pass finishes, and for a language that is not in the list.

| Argument   | Type     | Description                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| `code`     | `string` | The code to highlight. A trailing newline is ignored.        |
| `language` | `string` | A language or alias from `lib/highlighter.tsx`, or `"ansi"`. |
