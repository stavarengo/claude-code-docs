---
title: Test Results
description: Displays a test run by the agent, with its suites and failures.
base: base
component: true
---

```tsx
"use client"

import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  CheckIcon,
  CircleDashedIcon,
  FileCodeIcon,
  FlaskConicalIcon,
  XIcon,
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

type Test = {
  name: string
  status: "passed" | "failed" | "skipped"
  error?: string
}

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runTests: {
      input: { command: string }
      output: { suites: { name: string; tests: Test[] }[] }
    }
  }
>

type ToolPart = Extract<ChatMessage["parts"][number], { type: "tool-runTests" }>

const chat = createChat<ChatMessage>()
  .user("Run the checkout tests.")
  .assistant(({ writer }) => {
    writer
      .tool("runTests", { input: { command: "pnpm test checkout" } })
      .sleep(1500)
      .output({
        suites: [
          {
            name: "cart.test.ts",
            tests: [
              { name: "adds an item", status: "passed" },
              { name: "removes an item", status: "passed" },
              { name: "applies a discount code", status: "passed" },
            ],
          },
          {
            name: "payment.test.ts",
            tests: [
              { name: "charges the saved card", status: "passed" },
              {
                name: "retries a declined card",
                status: "failed",
                error: `Expected 2 charge attempts, received 1

  at Object.<anonymous> (src/payment.test.ts:58:22)`,
              },
            ],
          },
        ],
      })
    writer.text(
      "One test failed. The payment client does not retry a declined card, so the second charge attempt never happens."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function countTests(tests: Test[]) {
  return {
    total: tests.length,
    failed: tests.filter((test) => test.status === "failed").length,
    skipped: tests.filter((test) => test.status === "skipped").length,
  }
}

function formatCounts({
  total,
  failed,
  skipped,
}: ReturnType<typeof countTests>) {
  return [
    `${total} tests`,
    failed > 0 && `${failed} failed`,
    skipped > 0 && `${skipped} skipped`,
  ]
    .filter(Boolean)
    .join(", ")
}

function TestRow({ test }: { test: Test }) {
  if (test.status === "failed") {
    return (
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <XIcon />
            </TraceIcon>
            <TraceTitle>{test.name}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {test.error}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine>
      <TraceIcon>
        {test.status === "skipped" ? <CircleDashedIcon /> : <CheckIcon />}
      </TraceIcon>
      <TraceTitle>
        {test.status === "skipped" ? `Skipped ${test.name}` : test.name}
      </TraceTitle>
    </TraceLine>
  )
}

function TestResultsRow({
  part,
  streaming,
}: {
  part: ToolPart
  streaming: boolean
}) {
  const command = part.input?.command

  if (part.state !== "output-available") {
    const running = streaming && part.state !== "output-error"

    return (
      <TraceLine status={running ? "running" : "error"}>
        <TraceIcon>
          <FlaskConicalIcon />
        </TraceIcon>
        <TraceTitle>
          {running ? "Running" : "Failed to run"} {command}
        </TraceTitle>
      </TraceLine>
    )
  }

  const { suites } = part.output
  const summary = countTests(suites.flatMap((suite) => suite.tests))

  return (
    <TraceCollapsible defaultOpen={summary.failed > 0}>
      <TraceCollapsibleTrigger>
        <TraceLine status={summary.failed > 0 ? "error" : undefined}>
          <TraceIcon>
            <FlaskConicalIcon />
          </TraceIcon>
          <TraceTitle>Ran {formatCounts(summary)}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          {suites.map((suite) => {
            const counts = countTests(suite.tests)

            return (
              <TraceCollapsible
                key={suite.name}
                defaultOpen={counts.failed > 0}
              >
                <TraceCollapsibleTrigger>
                  <TraceLine status={counts.failed > 0 ? "error" : undefined}>
                    <TraceIcon>
                      <FileCodeIcon />
                    </TraceIcon>
                    <TraceTitle>
                      {suite.name}, {formatCounts(counts)}
                    </TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent keepMounted>
                  <Trace>
                    {suite.tests.map((test) => (
                      <TestRow key={test.name} test={test} />
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            )
          })}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function TestResultsDemo() {
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
        const tools = message.parts.filter(
          (part) => part.type === "tool-runTests"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tools.length > 0 && (
                <Trace>
                  {tools.map((part) => (
                    <TestResultsRow
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

Test Results is a test run by the agent. The summary line counts what passed and failed. Open it to see each suite, its tests, and the error for each failure.

Test Results is built with `Trace` with a `TraceCollapsible` for the run and for each suite.

## Installation

Test Results is built with the [Trace](/docs/components/base/trace) and [Code Block](/docs/components/base/code-block) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add trace code-block
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible code-block
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
```

```tsx showLineNumbers
<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine status="error">
        <TraceIcon>
          <FlaskConicalIcon />
        </TraceIcon>
        <TraceTitle>Ran 2 tests, 1 failed</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <CheckIcon />
          </TraceIcon>
          <TraceTitle>creates a user</TraceTitle>
        </TraceLine>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <XIcon />
              </TraceIcon>
              <TraceTitle>updates a user profile</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                Expected status 200, received 500
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```

## Suites

Group tests by file. Each suite is a collapsible line with a `Trace` of its tests. Open the suites that have a failure.

```tsx
import {
  CheckIcon,
  CircleDashedIcon,
  FileCodeIcon,
  FlaskConicalIcon,
  XIcon,
} from "lucide-react"

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

type Test = {
  name: string
  status: "passed" | "failed" | "skipped"
  error?: string
}

const suites: { name: string; tests: Test[] }[] = [
  {
    name: "auth.test.ts",
    tests: [
      { name: "logs in with valid credentials", status: "passed" },
      { name: "rejects an invalid password", status: "passed" },
      { name: "refreshes an expired token", status: "passed" },
    ],
  },
  {
    name: "user-api.test.ts",
    tests: [
      { name: "creates a user", status: "passed" },
      {
        name: "updates a user profile",
        status: "failed",
        error: `Expected status 200, received 500

  at Object.<anonymous> (src/user-api.test.ts:45:12)`,
      },
      { name: "deletes a user", status: "skipped" },
    ],
  },
  {
    name: "db.test.ts",
    tests: [
      { name: "connects to the database", status: "passed" },
      {
        name: "times out a slow query",
        status: "failed",
        error: `Exceeded timeout of 5000 ms for a test.

  at Object.<anonymous> (src/db.test.ts:22:3)`,
      },
    ],
  },
]

function countTests(tests: Test[]) {
  return {
    total: tests.length,
    failed: tests.filter((test) => test.status === "failed").length,
    skipped: tests.filter((test) => test.status === "skipped").length,
  }
}

function formatCounts({
  total,
  failed,
  skipped,
}: ReturnType<typeof countTests>) {
  return [
    `${total} tests`,
    failed > 0 && `${failed} failed`,
    skipped > 0 && `${skipped} skipped`,
  ]
    .filter(Boolean)
    .join(", ")
}

function TestRow({ test }: { test: Test }) {
  if (test.status === "failed") {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <XIcon />
            </TraceIcon>
            <TraceTitle>{test.name}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {test.error}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine>
      <TraceIcon>
        {test.status === "skipped" ? <CircleDashedIcon /> : <CheckIcon />}
      </TraceIcon>
      <TraceTitle>
        {test.status === "skipped" ? `Skipped ${test.name}` : test.name}
      </TraceTitle>
    </TraceLine>
  )
}

export function TestResultsSuites() {
  const summary = countTests(suites.flatMap((suite) => suite.tests))

  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status={summary.failed > 0 ? "error" : undefined}>
            <TraceIcon>
              <FlaskConicalIcon />
            </TraceIcon>
            <TraceTitle>Ran {formatCounts(summary)}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            {suites.map((suite) => {
              const counts = countTests(suite.tests)

              return (
                <TraceCollapsible
                  key={suite.name}
                  defaultOpen={counts.failed > 0}
                >
                  <TraceCollapsibleTrigger>
                    <TraceLine status={counts.failed > 0 ? "error" : undefined}>
                      <TraceIcon>
                        <FileCodeIcon />
                      </TraceIcon>
                      <TraceTitle>
                        {suite.name}, {formatCounts(counts)}
                      </TraceTitle>
                    </TraceLine>
                  </TraceCollapsibleTrigger>
                  <TraceCollapsibleContent keepMounted>
                    <Trace>
                      {suite.tests.map((test) => (
                        <TestRow key={test.name} test={test} />
                      ))}
                    </Trace>
                  </TraceCollapsibleContent>
                </TraceCollapsible>
              )
            })}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

```

```tsx showLineNumbers
<TraceCollapsible defaultOpen={failed > 0}>
  <TraceCollapsibleTrigger>
    <TraceLine status={failed > 0 ? "error" : undefined}>
      <TraceIcon>
        <FileCodeIcon />
      </TraceIcon>
      <TraceTitle>user-api.test.ts, 14 tests, 2 failed</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    <Trace>…</Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

## AI SDK

Run the tests as a tool and render its output. The tool states map the same way as in [Tool](/docs/ai-elements/base/tool#states).

```tsx showLineNumbers
const tests = part.output.suites.flatMap((suite) => suite.tests)
const failed = tests.filter((test) => test.status === "failed").length

return (
  <TraceCollapsible defaultOpen={failed > 0}>
    <TraceCollapsibleTrigger>
      <TraceLine status={failed > 0 ? "error" : undefined}>
        <TraceIcon>
          <FlaskConicalIcon />
        </TraceIcon>
        <TraceTitle>
          Ran {tests.length} tests{failed > 0 && `, ${failed} failed`}
        </TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>…</TraceCollapsibleContent>
  </TraceCollapsible>
)
```

## Migrating from AI SDK Elements

If you added Test Results from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/test-results.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Trace and Code Block. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/test-results.tsx from AI SDK Elements to the shadcn/ui Trace and Code Block components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add trace code-block
2. Read https://ui.shadcn.com/docs/ai-elements/base/test-results.md and build Test Results the same way.
3. Rebuild each part:
   - Import CodeBlock and CodeBlockContent from @/components/ui/code-block, not from ./code-block.
   - TestResults renders a Trace with a TraceCollapsible. Keep summary.
   - TestResultsHeader renders a TraceCollapsibleTrigger with a TraceLine, and TestResultsSummary a TraceTitle with the counts, like "Ran 42 tests, 2 failed". Set status="error" when a test failed.
   - TestResultsContent renders a TraceCollapsibleContent with a Trace for the suites.
   - TestSuite renders a TraceCollapsible, open when it has a failure. TestSuiteName renders a TraceCollapsibleTrigger with a TraceLine, and TestSuiteContent a TraceCollapsibleContent with a Trace for the tests.
   - Test renders a TraceLine with a TraceTitle for its name. Set status="error" when it failed.
   - TestError renders a CodeBlock with size="sm", with TestErrorMessage and TestErrorStack in a CodeBlockContent.
   - Keep TestResultsDuration, TestResultsProgress, TestSuiteStats, TestName, TestDuration and TestStatus as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

## API Reference

See [Trace](/docs/components/base/trace#api-reference).
