---
title: Prompt Input
description: A message field with attachments and a send button.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  ChevronDownIcon,
  FileTextIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type AttachmentFile = {
  id: string
  name: string
}

const providers = [
  {
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 mini" },
    ],
  },
  {
    name: "Anthropic",
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
    ],
  },
]

const models = providers.flatMap((provider) => provider.models)

const efforts = [
  { id: "low", name: "Low" },
  { id: "medium", name: "Medium" },
  { id: "high", name: "High" },
]

export function PromptInputDemo() {
  const [text, setText] = React.useState("")
  const [files, setFiles] = React.useState<AttachmentFile[]>([])
  const [model, setModel] = React.useState(models[0].id)
  const [effort, setEffort] = React.useState(efforts[1].id)
  const formRef = React.useRef<HTMLFormElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const currentModel = models.find((item) => item.id === model) ?? models[0]
  const currentEffort = efforts.find((item) => item.id === effort) ?? efforts[1]
  const canSend = text.trim().length > 0

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    setText("")
    setFiles([])
  }

  function onAttach(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files
    if (!selected) {
      return
    }

    setFiles((current) => [
      ...current,
      ...Array.from(selected, (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
      })),
    ])
    event.target.value = ""
  }

  return (
    <div className="mx-auto w-full max-w-lg py-6">
      <form ref={formRef} onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={onAttach}
        />
        <InputGroup>
          {files.length > 0 && (
            <InputGroupAddon align="block-start" className="flex-wrap">
              {files.map((file) => (
                <Attachment key={file.id} size="sm">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((item) => item.id !== file.id)
                        )
                      }
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </InputGroupAddon>
          )}
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
              onClick={() => inputRef.current?.click()}
            >
              <PlusIcon />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton
                    size="sm"
                    variant="outline"
                    aria-label={`Model: ${currentModel.name}`}
                    className="ml-auto"
                  />
                }
              >
                {currentModel.name}
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                  {providers.map((provider, index) => (
                    <React.Fragment key={provider.name}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
                        {provider.models.map((item) => (
                          <DropdownMenuRadioItem
                            key={item.id}
                            value={item.id}
                            closeOnClick
                          >
                            {item.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuGroup>
                    </React.Fragment>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton
                    size="sm"
                    variant="outline"
                    aria-label={`Effort: ${currentEffort.name}`}
                  />
                }
              >
                <span className="text-muted-foreground">Effort</span>
                {currentEffort.name}
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Effort</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={effort}
                    onValueChange={setEffort}
                  >
                    {efforts.map((item) => (
                      <DropdownMenuRadioItem
                        key={item.id}
                        value={item.id}
                        closeOnClick
                      >
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              className="rounded-full"
              disabled={!canSend}
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}

```

Prompt Input is the field the person types into to message the agent. It is an [Input Group](/docs/components/base/input-group) with a textarea, an attach button, the [Model Selector](/docs/ai-elements/base/model-selector) menus and a send button. Attached files show as [Attachment](/docs/components/base/attachment) chips above the text.

## Installation

Prompt Input is built with the [Input Group](/docs/components/base/input-group), [Attachment](/docs/components/base/attachment) and [Dropdown Menu](/docs/components/base/dropdown-menu) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add input-group attachment dropdown-menu
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add input-group attachment dropdown-menu
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="input-group"
  title="components/ui/input-group.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
```

```tsx showLineNumbers
<form ref={formRef} onSubmit={onSubmit}>
  <InputGroup>
    <InputGroupTextarea
      value={text}
      onChange={(event) => setText(event.target.value)}
      placeholder="Ask the agent to change your code..."
      className="p-3"
    />
    <InputGroupAddon align="block-end">
      <InputGroupButton
        size="icon-sm"
        variant="outline"
        className="rounded-full"
        aria-label="Attach files"
        onClick={() => inputRef.current?.click()}
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
```

## Attachments

The attach button opens a hidden file input. Show each file as an [Attachment](/docs/components/base/attachment) in an addon with `align="block-start"`, with a button to remove it.

## Model and Effort

Put the two [Model Selector](/docs/ai-elements/base/model-selector) menus in the `block-end` addon, between the attach and send buttons. Move `ml-auto` from the send button to the first menu trigger, so both menus sit next to the send button.

## Keyboard

Enter sends the message. Shift+Enter adds a new line.

```tsx showLineNumbers
onKeyDown={(event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    formRef.current?.requestSubmit()
  }
}}
```

## AI SDK

Send the text and the `FileList` from the file input.

```tsx showLineNumbers
sendMessage({ text, files })
```

The route streams the reply with `result.toUIMessageStreamResponse()`.

## Migrating from AI SDK Elements

If you added Prompt Input from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/prompt-input.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Input Group and Attachment. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/prompt-input.tsx from AI SDK Elements to the shadcn/ui Input Group and Attachment components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add input-group attachment
2. Read https://ui.shadcn.com/docs/ai-elements/base/prompt-input.md and build Prompt Input the same way.
3. Rebuild each part:
   - PromptInput already renders an Input Group. Keep the form, the provider, the attachment state and the command parts as they are.
   - PromptInputTextarea renders an InputGroupTextarea with className="p-3".
   - PromptInputActionMenuTrigger renders an InputGroupButton with size="icon-sm", variant="outline" and rounded-full, with a PlusIcon.
   - PromptInputSubmit renders an InputGroupButton with size="icon-sm", variant="default" and rounded-full, with an ArrowUpIcon while idle. Keep the spinner and stop icons for the other statuses.
   - PromptInputHeader shows each attachment as an Attachment with size="sm" and a button to remove it.
   - Keep PromptInputSelect, PromptInputHoverCard and the tab parts as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
