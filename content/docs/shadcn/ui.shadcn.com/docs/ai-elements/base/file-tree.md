---
title: File Tree
description: The files the agent changed, as a folder tree.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type FileNode =
  | { type: "file"; name: string; path: string }
  | { type: "folder"; name: string; path: string; children: FileNode[] }

const files: FileNode[] = [
  {
    type: "folder",
    name: "app",
    path: "app",
    children: [
      { type: "file", name: "layout.tsx", path: "app/layout.tsx" },
      { type: "file", name: "page.tsx", path: "app/page.tsx" },
    ],
  },
  {
    type: "folder",
    name: "components",
    path: "components",
    children: [
      {
        type: "folder",
        name: "ui",
        path: "components/ui",
        children: [
          {
            type: "file",
            name: "button.tsx",
            path: "components/ui/button.tsx",
          },
        ],
      },
      {
        type: "file",
        name: "login-form.tsx",
        path: "components/login-form.tsx",
      },
    ],
  },
]

function FileTreeNode({
  node,
  selected,
  onSelect,
}: {
  node: FileNode
  selected: string
  onSelect: (path: string) => void
}) {
  switch (node.type) {
    case "folder":
      return (
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal aria-expanded:bg-transparent aria-expanded:hover:bg-muted dark:aria-expanded:hover:bg-muted/50"
              />
            }
          >
            <ChevronRightIcon className="transition-transform group-data-panel-open/button:rotate-90" />
            <FolderIcon />
            {node.name}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-4 flex flex-col">
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    case "file":
      return (
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start font-normal ${
            selected === node.path ? "bg-accent text-accent-foreground" : ""
          }`}
          aria-current={selected === node.path ? "true" : undefined}
          onClick={() => onSelect(node.path)}
        >
          <FileIcon />
          {node.name}
        </Button>
      )
    default: {
      const unreachable: never = node
      return unreachable
    }
  }
}

export function FileTreeDemo() {
  const [selected, setSelected] = React.useState("components/ui/button.tsx")

  return (
    <div className="flex w-full max-w-xs flex-col py-6 text-sm">
      {files.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  )
}

```

File Tree is the files the agent changed, shown as folders you can open. A folder is a [Collapsible](/docs/components/base/collapsible). A file is a [Button](/docs/components/base/button). For a single file the agent read or edited, use a [Tool](/docs/ai-elements/base/tool) line instead.

## Installation

File Tree is built with the [Collapsible](/docs/components/base/collapsible) and [Button](/docs/components/base/button) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add collapsible button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="collapsible"
  title="components/ui/collapsible.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

Render nodes recursively. Nest each folder's children in its `CollapsibleContent`.

```tsx showLineNumbers
if (node.type === "folder") {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger
        render={
          <Button variant="ghost" size="sm" className="w-full justify-start" />
        }
      >
        <ChevronRightIcon className="transition-transform group-data-panel-open/button:rotate-90" />
        <FolderIcon />
        {node.name}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 flex flex-col">
          {node.children.map((child) => (
            <FileTreeNode key={child.path} node={child} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

```tsx showLineNumbers
<Button
  variant="ghost"
  size="sm"
  className="w-full justify-start"
  onClick={() => onSelect(node.path)}
>
  <FileIcon />
  {node.name}
</Button>
```

See [Collapsible](/docs/components/base/collapsible#file-tree).

## Migrating from AI SDK Elements

If you added File Tree from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/file-tree.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Collapsible and Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/file-tree.tsx from AI SDK Elements to the shadcn/ui Collapsible and Button components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add collapsible button
2. Read https://ui.shadcn.com/docs/ai-elements/base/file-tree.md and build File Tree the same way.
3. Rebuild each part:
   - FileTreeFolder renders a Collapsible. Its trigger is a CollapsibleTrigger with render={<Button variant="ghost" size="sm" className="w-full justify-start" />}, and its children go in a CollapsibleContent.
   - FileTreeFile renders a Button with variant="ghost" and size="sm" that calls onSelect with its path. If a file has FileTreeActions, render them next to the Button, not inside it.
   - Keep FileTree with its expanded and selection state, and keep FileTreeIcon, FileTreeName and FileTreeActions as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
