---
title: Suggestion
description: A short prompt you can send to the agent in one click.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { ArrowUpIcon, PlusIcon } from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent } from "@/components/ui/message"

const suggestions = [
  "Add a dark mode toggle",
  "Fix the failing build",
  "Write tests for the form",
  "Upgrade to Next.js 16",
  "Add a loading state",
  "Find unused dependencies",
]

const replies: Record<string, string> = {
  "Add a dark mode toggle":
    "Added a ModeToggle to the site header. It calls setTheme from next-themes.",
  "Fix the failing build":
    "The build failed on a missing import in app/page.tsx. I added it and the build passes.",
  "Write tests for the form":
    "Added four tests in signup-form.test.tsx. They cover the empty, invalid and valid states.",
  "Upgrade to Next.js 16":
    "Ran the codemod and bumped next to 16. Two routes needed async params, so I updated them.",
  "Add a loading state":
    "Added a loading.tsx to the dashboard route. It shows skeletons while the data loads.",
  "Find unused dependencies":
    "Three packages are not imported anywhere: lodash, moment and classnames. Should I remove them?",
}

export function SuggestionDemo() {
  const [text, setText] = React.useState("")
  const [turn, setTurn] = React.useState<{
    prompt: string
    reply: string
  } | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const canSend = text.trim().length > 0

  function send(prompt: string) {
    setTurn({
      prompt,
      reply:
        replies[prompt] ?? "This demo only knows the suggestions. Pick one.",
    })
    setText("")
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    send(text.trim())
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-6 text-sm">
      {turn && (
        <div className="flex flex-col gap-4">
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{turn.prompt}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageContent>
              <p>{turn.reply}</p>
            </MessageContent>
          </Message>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex scroll-fade-x scrollbar-none gap-2 overflow-x-auto overscroll-x-contain">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => send(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <form ref={formRef} onSubmit={onSubmit}>
          <InputGroup>
            <InputGroupTextarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ask the agent to change your code..."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
              className="p-3"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Attach files"
              >
                <PlusIcon />
              </InputGroupButton>
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="ml-auto rounded-full"
                disabled={!canSend}
                aria-label="Send"
              >
                <ArrowUpIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  )
}

```

Suggestion is a prompt you send without typing. Each one is a [Button](/docs/components/base/button) with the prompt as its label. Put a row of them above the [Prompt Input](/docs/ai-elements/base/prompt-input).

## Installation

Suggestion is built with the [Button](/docs/components/base/button) component.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="button"
  title="components/ui/button.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Button } from "@/components/ui/button"
```

```tsx showLineNumbers
<div className="scrollbar-none flex scroll-fade-x gap-2 overflow-x-auto overscroll-x-contain">
  {suggestions.map((suggestion) => (
    <Button
      key={suggestion}
      variant="outline"
      size="sm"
      className="shrink-0"
      onClick={() => send(suggestion)}
    >
      {suggestion}
    </Button>
  ))}
</div>
```

## Scrolling

The row scrolls sideways when the suggestions do not fit. [`scroll-fade-x`](/docs/utils/scroll-fade) fades the edge that has more to show, and `shrink-0` keeps each label on one line.

## AI SDK

The label is the message. Send it as is.

```tsx showLineNumbers
sendMessage({ text: suggestion })
```

## Migrating from AI SDK Elements

If you added Suggestion from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/suggestion.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/suggestion.tsx from AI SDK Elements to the shadcn/ui Button component.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install Button: npx shadcn@latest add button
2. Read https://ui.shadcn.com/docs/ai-elements/base/suggestion.md and build Suggestion the same way.
3. Rebuild each part:
   - Suggestions renders a div with className="flex scroll-fade-x scrollbar-none gap-2 overflow-x-auto overscroll-x-contain", instead of a ScrollArea. Change SuggestionsProps to ComponentProps<"div">.
   - Suggestion renders a Button with variant="outline", size="sm" and className="shrink-0". Keep onClick, called with the suggestion.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
