---
title: Questionnaire
description: A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.
base: base
component: true
---

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const questionnaireItems = [
  {
    choices: [
      {
        description: "Show what the agent ran and what came back.",
        label: "Tool call timeline",
        value: "tool-calls",
      },
      {
        description: "Ask before sensitive or destructive actions.",
        label: "Approval checkpoints",
        value: "approvals",
      },
      {
        description: "Make delegated work and results easier to follow.",
        label: "Sub-agent handoffs",
        value: "handoffs",
      },
    ],
    description: "Choose a direction or describe another task.",
    input: {
      label: "Another agent feature",
      placeholder: "Describe another feature…",
    },
    name: "direction",
    required: true,
    title: "What should the agent build next?",
  },
  {
    choices: [
      { label: "Progress", value: "progress" },
      { label: "Decisions", value: "decisions" },
      { label: "Risks", value: "risks" },
      { label: "Next step", value: "next-step" },
    ],
    description: "Select all that apply, or skip this question.",
    multiple: true,
    name: "signals",
    required: false,
    title: "What should every progress update include?",
  },
  {
    choices: [
      { label: "Start now", value: "now" },
      { label: "Next development cycle", value: "next-cycle" },
      { label: "Add it to the backlog", value: "backlog" },
    ],
    description: "Choose when the agent should begin the work.",
    name: "timing",
    required: true,
    title: "When should work begin?",
  },
] as const

export function QuestionnaireDemo() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const answers = {
      direction: formData.get("direction"),
      signals: formData.getAll("signals"),
      timing: formData.get("timing"),
    }

    toast("Agent plan saved", {
      description: `Direction: ${answers.direction ?? "None"} · Progress signals: ${answers.signals.join(", ") || "None"} · Timing: ${answers.timing ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="direction"
      items={questionnaireItems}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />
      {questionnaireItems.map((question) => (
        <QuestionnaireItem
          key={question.name}
          multiple={"multiple" in question && question.multiple}
          name={question.name}
          required={question.required}
        >
          <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
          <QuestionnaireDescription>
            {question.description}
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                <span className="font-medium">{choice.label}</span>
                {"description" in choice ? (
                  <span className="text-muted-foreground">
                    {choice.description}
                  </span>
                ) : null}
              </QuestionnaireChoice>
            ))}
            {"input" in question ? (
              <QuestionnaireInput
                aria-label={question.input.label}
                placeholder={question.input.placeholder}
              />
            ) : null}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add questionnaire
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the following dependency:</Step>

```bash
npm install @shadcn/react
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="questionnaire"
  title="components/ui/questionnaire.tsx"
  styleName="base-nova"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
```

```tsx
const items = [
  {
    name: "direction",
    required: true,
    prompt: "What should we prototype next?",
    description: "Choose a direction or write your own.",
    choices: [
      {
        value: "delegation",
        label: "Delegation",
        description: "Show how work moves to a specialist.",
      },
      {
        value: "questions",
        label: "Question prompts",
        description: "Show choices while the interface waits.",
      },
      { value: "both", label: "Both together" },
    ],
    input: { label: "Another answer", placeholder: "Type another answer…" },
  },
  {
    name: "detail",
    required: false,
    prompt: "How much detail should it include?",
    description: "Skip this if you are not sure yet.",
    choices: [
      { value: "focused", label: "Focused" },
      { value: "complete", label: "Complete flow" },
    ],
  },
] as const
```

Define the collection once: pass it to `Questionnaire` for server-rendered
progress, actions, and shortcuts, then map it into the parts.

```tsx
<Questionnaire items={items} onSubmit={handleSubmit}>
  <QuestionnaireProgress />
  {items.map((question) => (
    <QuestionnaireItem
      key={question.name}
      name={question.name}
      required={question.required}
    >
      <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
      <QuestionnaireDescription>
        {question.description}
      </QuestionnaireDescription>
      <QuestionnaireChoices>
        {question.choices.map((choice) => (
          <QuestionnaireChoice key={choice.value} value={choice.value}>
            <span className="font-medium">{choice.label}</span>
            {"description" in choice ? (
              <span className="text-muted-foreground">
                {choice.description}
              </span>
            ) : null}
          </QuestionnaireChoice>
        ))}
        {"input" in question ? (
          <QuestionnaireInput
            aria-label={question.input.label}
            placeholder={question.input.placeholder}
          />
        ) : null}
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>
  ))}
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const answers = new FormData(event.currentTarget)
  // answers.get("direction"), answers.getAll(...) for multiple items.
}
```

## Composition

```text
Questionnaire
├── QuestionnaireProgress
├── QuestionnaireItem
│   ├── QuestionnaireTitle
│   ├── QuestionnaireDescription
│   ├── QuestionnaireChoices
│   │   ├── QuestionnaireChoice
│   │   └── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit
```

Questionnaire owns the ordered items, active item, answer state, validation,
progress, and navigation. The containing page, card, dialog, or drawer owns
close and cancellation behavior, persistence, transport, and branching.

## Server Rendering

Pass `items` to server-render the active item, progress, actions, and answer
shortcuts. See the
[headless Questionnaire](/docs/react/questionnaire) for the complete behavior.

## Multiple Selection

Use `multiple` for an item that accepts more than one fixed answer.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    choices: [
      { value: "source" },
      { value: "tests" },
      { value: "docs" },
      { value: "history" },
    ],
    name: "context",
    required: true,
  },
] as const

export function QuestionnaireMultiple() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const context = new FormData(event.currentTarget).getAll("context")

    toast("Context selected", {
      description: `Context: ${context.join(", ") || "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem name="context" multiple required>
        <QuestionnaireTitle>
          What context should the agent inspect?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select every source that may affect the implementation.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="source">
            Relevant source files
          </QuestionnaireChoice>
          <QuestionnaireChoice value="tests">
            Existing tests
          </QuestionnaireChoice>
          <QuestionnaireChoice value="docs">
            Architecture documentation
          </QuestionnaireChoice>
          <QuestionnaireChoice value="history">
            Recent commit history
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnaireSubmit>Share context</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Freeform Answer

Compose `QuestionnaireInput` with fixed choices when the user can provide another answer.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    choices: [
      { value: "incremental" },
      { value: "module" },
      { value: "rewrite" },
    ],
    name: "approach",
    required: true,
  },
] as const

export function QuestionnaireFreeform() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const approach = new FormData(event.currentTarget).get("approach")

    toast("Approach selected", {
      description: `Approach: ${approach ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem name="approach" required>
        <QuestionnaireTitle>
          How should the agent approach this refactor?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose a strategy or write a more specific instruction.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental">
            Make the smallest safe change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="module">
            Refactor one module at a time
          </QuestionnaireChoice>
          <QuestionnaireChoice value="rewrite">
            Replace the implementation completely
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another refactoring approach"
            placeholder="Describe another approach…"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnaireSubmit>Use this approach</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Explicit Skip

Add `QuestionnaireSkip` when an optional item may be intentionally left unanswered.

```tsx
"use client"

import * as React from "react"
import type { QuestionnaireItemStatus } from "@shadcn/react/questionnaire"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "task", required: true },
  { name: "constraints" },
  { name: "review", required: true },
] as const

export function QuestionnaireSkipExample() {
  const [constraintStatus, setConstraintStatus] =
    React.useState<QuestionnaireItemStatus>("unanswered")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const answers = {
      task: formData.get("task"),
      constraints: formData.get("constraints"),
      constraintStatus,
      review: formData.get("review"),
    }

    toast("Agent brief submitted", {
      description: `Task: ${answers.task ?? "None"} · Constraints: ${
        answers.constraintStatus === "skipped"
          ? "Skipped"
          : (answers.constraints ?? "None")
      } · Review: ${answers.review ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="task" required>
        <QuestionnaireTitle>What kind of change is this?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the category that best describes the work.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="feature">New feature</QuestionnaireChoice>
          <QuestionnaireChoice value="fix">Bug fix</QuestionnaireChoice>
          <QuestionnaireChoice value="refactor">Refactor</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem
        name="constraints"
        onStatusChange={setConstraintStatus}
      >
        <QuestionnaireTitle>
          Are there any implementation constraints?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Answer if needed, or intentionally skip this question.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="no-dependencies">
            Do not add dependencies
          </QuestionnaireChoice>
          <QuestionnaireChoice value="no-migrations">
            Do not change the database
          </QuestionnaireChoice>
          <QuestionnaireChoice value="preserve-api">
            Preserve the public API
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another implementation constraint"
            placeholder="Describe another constraint…"
          />
        </QuestionnaireChoices>
      </QuestionnaireItem>

      <QuestionnaireItem name="review" required>
        <QuestionnaireTitle>
          How should the work be reviewed?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the checks the agent should complete before handoff.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="tests">
            Run the test suite
          </QuestionnaireChoice>
          <QuestionnaireChoice value="diff">
            Review the final diff
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            Tests and diff review
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Submit brief</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Shortcuts

Assign a letter or number key to each answer with `shortcuts`.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    choices: [{ value: "inspect" }, { value: "tests" }, { value: "patch" }],
    name: "action",
    required: true,
  },
] as const

type ShortcutMode = React.ComponentProps<typeof Questionnaire>["shortcuts"]

export function QuestionnaireShortcuts() {
  const [shortcuts, setShortcuts] = React.useState<ShortcutMode>("letters")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const action = new FormData(event.currentTarget).get("action")

    toast("Next action selected", {
      description: `Action: ${action ?? "None"} · Shortcuts: ${shortcuts ?? "none"}`,
    })
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
      <NativeSelect
        aria-label="Shortcut style"
        className="absolute end-0 top-0"
        value={shortcuts ?? "none"}
        onChange={(event) => {
          const value = event.target.value
          setShortcuts(
            value === "letters" || value === "numbers" ? value : undefined
          )
        }}
      >
        <NativeSelectOption value="none">No shortcuts</NativeSelectOption>
        <NativeSelectOption value="letters">Letters</NativeSelectOption>
        <NativeSelectOption value="numbers">Numbers</NativeSelectOption>
      </NativeSelect>

      <Questionnaire
        className="mt-auto"
        items={items}
        shortcuts={shortcuts}
        onSubmit={handleSubmit}
      >
        <QuestionnaireItem name="action" required>
          <QuestionnaireTitle>
            What should the agent do next?
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            Use the displayed shortcut or navigate with the keyboard.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="inspect">
              Inspect the implementation
            </QuestionnaireChoice>
            <QuestionnaireChoice value="tests">
              Run the relevant tests
            </QuestionnaireChoice>
            <QuestionnaireChoice value="patch">
              Prepare the patch
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnaireSubmit>Confirm action</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

```

## Custom Validation

Combine controlled navigation with an external schema such as Zod to return to an invalid item and present its error.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"
import { z } from "zod"

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "detail", required: true },
  { name: "audience", required: true },
] as const

const questionnaireSchema = z
  .object({
    detail: z.enum(["summary", "complete"]),
    audience: z.enum(["team", "public"]),
  })
  .superRefine((answers, context) => {
    if (answers.audience === "public" && answers.detail === "summary") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Public answers need enough context. Choose a complete answer.",
        path: ["detail"],
      })
    }
  })

type QuestionnaireItemName = keyof z.infer<typeof questionnaireSchema>
type QuestionnaireErrors = Partial<Record<QuestionnaireItemName, string>>

function ValidationProgress() {
  return (
    <QuestionnaireProgress
      className="min-w-0"
      render={(props, state) => (
        <div {...props}>
          {state.current} / {state.total}
        </div>
      )}
    />
  )
}

export function QuestionnaireValidation() {
  const [item, setItem] = React.useState("detail")
  const [errors, setErrors] = React.useState<QuestionnaireErrors>({})

  function clearError(name: QuestionnaireItemName) {
    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[name]
      return nextErrors
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = questionnaireSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget))
    )

    if (result.success) {
      setErrors({})
      toast("Agent response configured", {
        description: `Detail: ${result.data.detail} · Audience: ${result.data.audience}`,
      })
      return
    }

    const nextErrors: QuestionnaireErrors = {}

    for (const issue of result.error.issues) {
      const name = issue.path[0]

      if ((name === "detail" || name === "audience") && !nextErrors[name]) {
        nextErrors[name] = issue.message
      }
    }

    const firstInvalidItem = result.error.issues[0]?.path[0]

    setErrors(nextErrors)

    if (firstInvalidItem === "detail" || firstInvalidItem === "audience") {
      setItem(firstInvalidItem)
    }
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={items}
      onItemChange={setItem}
      onSubmit={handleSubmit}
    >
      <Card className="w-full">
        <QuestionnaireItem
          invalid={Boolean(errors.detail)}
          name="detail"
          required
        >
          <CardHeader>
            <QuestionnaireTitle>
              How much detail should the answer include?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              Choose the response depth.
            </QuestionnaireDescription>
            <CardAction>
              <ValidationProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice
                value="summary"
                onChange={() => clearError("detail")}
              >
                Concise summary
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="complete"
                onChange={() => clearError("detail")}
              >
                Complete answer
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>{errors.detail}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          invalid={Boolean(errors.audience)}
          name="audience"
          required
        >
          <CardHeader>
            <QuestionnaireTitle>Who will read the answer?</QuestionnaireTitle>
            <QuestionnaireDescription>
              Public answers require complete context.
            </QuestionnaireDescription>
            <CardAction>
              <ValidationProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice
                value="team"
                onChange={() => clearError("audience")}
              >
                My team
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="public"
                onChange={() => clearError("audience")}
              >
                Public audience
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>{errors.audience}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Validate answers</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}

```

## Controlled

Control the active item from host state, such as returning to an invalid step.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "scope", required: true },
  { name: "checks", required: true },
  { name: "output", required: true },
] as const

const itemLabels: Record<string, string> = {
  scope: "Change scope",
  checks: "Verification",
  output: "Final output",
}

export function QuestionnaireControlled() {
  const [item, setItem] = React.useState("scope")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Agent workflow configured", {
      description: `Scope: ${formData.get("scope") ?? "None"} · Verification: ${formData.get("checks") ?? "None"} · Output: ${formData.get("output") ?? "None"}`,
    })
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
      <p
        className="absolute end-0 top-0 text-sm text-muted-foreground"
        role="status"
      >
        Current checkpoint: {itemLabels[item]}
      </p>

      <Questionnaire
        className="mt-auto"
        item={item}
        items={items}
        onItemChange={setItem}
        onSubmit={handleSubmit}
      >
        <QuestionnaireProgress />

        <QuestionnaireItem name="scope" required>
          <QuestionnaireTitle>What may the agent change?</QuestionnaireTitle>
          <QuestionnaireDescription>
            The host stores the active checkpoint while Questionnaire navigates.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="component">
              Only the target component
            </QuestionnaireChoice>
            <QuestionnaireChoice value="tests">
              Component and related tests
            </QuestionnaireChoice>
            <QuestionnaireChoice value="feature">
              The complete feature area
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="checks" required>
          <QuestionnaireTitle>
            Which verification level should it use?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="targeted">
              Targeted tests
            </QuestionnaireChoice>
            <QuestionnaireChoice value="package">
              Package tests and typecheck
            </QuestionnaireChoice>
            <QuestionnaireChoice value="full">
              Full workspace verification
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="output" required>
          <QuestionnaireTitle>
            What should the agent return when finished?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="summary">
              Concise summary
            </QuestionnaireChoice>
            <QuestionnaireChoice value="diff">
              Summary with changed files
            </QuestionnaireChoice>
            <QuestionnaireChoice value="handoff">
              Detailed implementation handoff
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext>Next</QuestionnaireNext>
          <QuestionnaireSubmit>Save workflow</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

```

## Resume

Restore a saved active item and default answers, then reset changes back to that saved state.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "change", required: true },
  { name: "verification", required: true },
  { name: "notes" },
] as const

export function QuestionnaireResume() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const answers = {
      change: formData.get("change"),
      verification: formData.getAll("verification"),
      notes: formData.get("notes"),
    }

    toast("Draft updated", {
      description: `Migration: ${answers.change ?? "None"} · Verification: ${answers.verification.join(", ") || "None"} · Notes: ${answers.notes || "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="verification"
      items={items}
      onReset={() => toast("Saved answers restored")}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="change" required>
        <QuestionnaireTitle>What kind of migration is this?</QuestionnaireTitle>
        <QuestionnaireDescription>
          This answer was saved during the previous session.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental" defaultChecked>
            Incremental migration
          </QuestionnaireChoice>
          <QuestionnaireChoice value="cutover">
            Single cutover
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="verification" multiple required>
        <QuestionnaireTitle>
          How should the migration be verified?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          These checks were selected during the previous session.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="tests" defaultChecked>
            Run migration tests
          </QuestionnaireChoice>
          <QuestionnaireChoice value="typecheck" defaultChecked>
            Run the typecheck
          </QuestionnaireChoice>
          <QuestionnaireChoice value="manual">
            Perform a manual smoke test
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="notes">
        <QuestionnaireTitle>
          Anything else the agent should remember?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          This note was saved with the draft.
        </QuestionnaireDescription>
        <QuestionnaireInput
          aria-label="Saved migration note"
          defaultValue="Keep the existing public API stable."
        />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <Button type="reset" variant="outline">
          Reset changes
        </Button>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Update draft</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Conditional Items

Disable items that do not apply to the user's earlier answers.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export function QuestionnaireConditional() {
  const [runtime, setRuntime] = React.useState("local")
  const items = React.useMemo(
    () => [
      { name: "runtime", required: true },
      {
        disabled: runtime !== "cloud",
        name: "environment",
        required: true,
      },
      { name: "approval", required: true },
    ],
    [runtime]
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Execution plan saved", {
      description: `Runtime: ${formData.get("runtime") ?? "None"} · Environment: ${formData.get("environment") ?? "Not applicable"} · Approval: ${formData.get("approval") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="runtime"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="runtime" required>
        <QuestionnaireTitle>Where should the agent run?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Cloud runs add an environment question to this flow.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice
            checked={runtime === "local"}
            value="local"
            onChange={() => setRuntime("local")}
          >
            Local workspace
          </QuestionnaireChoice>
          <QuestionnaireChoice
            checked={runtime === "cloud"}
            value="cloud"
            onChange={() => setRuntime("cloud")}
          >
            Cloud workspace
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem
        disabled={runtime !== "cloud"}
        name="environment"
        required
      >
        <QuestionnaireTitle>
          Which cloud environment should it use?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
          <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
          <QuestionnaireChoice value="isolated">
            Isolated sandbox
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="approval" required>
        <QuestionnaireTitle>
          When should the agent request approval?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="writes">
            Before writing files
          </QuestionnaireChoice>
          <QuestionnaireChoice value="commands">
            Before running commands
          </QuestionnaireChoice>
          <QuestionnaireChoice value="sensitive">
            Only for sensitive actions
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save execution plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Navigation State

Read item status to opt into disabled navigation and custom action styling.

```tsx
"use client"

import * as React from "react"
import type { QuestionnaireItemStatus } from "@shadcn/react/questionnaire"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "permission", required: true },
  { name: "verification", required: true },
] as const

type ItemName = "permission" | "verification"

export function QuestionnaireNavigationState() {
  const [item, setItem] = React.useState<ItemName>("permission")
  const [statuses, setStatuses] = React.useState<
    Record<ItemName, QuestionnaireItemStatus>
  >({
    permission: "unanswered",
    verification: "unanswered",
  })
  const unanswered = statuses[item] === "unanswered"

  function setStatus(name: ItemName, status: QuestionnaireItemStatus) {
    setStatuses((current) => ({ ...current, [name]: status }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Permissions saved", {
      description: `Permission: ${formData.get("permission") ?? "None"} · Verification: ${formData.get("verification") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={items}
      onItemChange={(nextItem) => setItem(nextItem as ItemName)}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem
        name="permission"
        required
        onStatusChange={(status) => setStatus("permission", status)}
      >
        <QuestionnaireTitle>What may the agent modify?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Next is intentionally disabled until an answer is selected.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="files">Project files</QuestionnaireChoice>
          <QuestionnaireChoice value="tests">
            Project files and tests
          </QuestionnaireChoice>
          <QuestionnaireChoice value="config">
            Files, tests, and configuration
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem
        name="verification"
        required
        onStatusChange={(status) => setStatus("verification", status)}
      >
        <QuestionnaireTitle>
          What must pass before completion?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="tests">Tests</QuestionnaireChoice>
          <QuestionnaireChoice value="types">
            Tests and types
          </QuestionnaireChoice>
          <QuestionnaireChoice value="all">
            Tests, types, and visual QA
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext
          className="data-[status=unanswered]:opacity-50"
          disabled={unanswered}
          variant="secondary"
        >
          Next
        </QuestionnaireNext>
        <QuestionnaireSubmit disabled={unanswered}>
          Save permissions
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Custom Progress

Use the Progress render state to build a custom progress indicator.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "scope", required: true },
  { name: "strategy", required: true },
  { name: "tests", required: true },
  { name: "delivery", required: true },
] as const

export function QuestionnaireProgressExample() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Pull request plan ready", {
      description: `Scope: ${formData.get("scope") ?? "None"} · Commits: ${formData.get("strategy") ?? "None"} · Tests: ${formData.get("tests") ?? "None"} · Delivery: ${formData.get("delivery") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="scope"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress
        className="w-full"
        render={(props, state) => (
          <div {...props}>
            <div className="mb-2 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: state.total }, (_, index) => (
                <span
                  key={index}
                  className={
                    index < state.current
                      ? "h-1.5 flex-1 rounded-full bg-primary"
                      : "h-1.5 flex-1 rounded-full bg-muted"
                  }
                />
              ))}
            </div>
            <span>
              Checkpoint {state.current} of {state.total}
            </span>
          </div>
        )}
      />

      <QuestionnaireItem name="scope" required>
        <QuestionnaireTitle>How large is the change?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="small">Small patch</QuestionnaireChoice>
          <QuestionnaireChoice value="medium">
            Feature-sized change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="large">
            Cross-package change
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="strategy" required>
        <QuestionnaireTitle>
          How should commits be organized?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="single">
            Single commit
          </QuestionnaireChoice>
          <QuestionnaireChoice value="logical">
            Logical commits
          </QuestionnaireChoice>
          <QuestionnaireChoice value="squash">
            Squash before review
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="tests" required>
        <QuestionnaireTitle>Which tests should run?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="targeted">
            Targeted tests
          </QuestionnaireChoice>
          <QuestionnaireChoice value="package">
            Package suite
          </QuestionnaireChoice>
          <QuestionnaireChoice value="workspace">
            Full workspace
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="delivery" required>
        <QuestionnaireTitle>
          How should the work be delivered?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="patch">Patch only</QuestionnaireChoice>
          <QuestionnaireChoice value="commit">
            Committed locally
          </QuestionnaireChoice>
          <QuestionnaireChoice value="branch">
            Push a review branch
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Finish plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Animated Items

Animate the active item while keeping progress and navigation stationary.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "task", required: true },
  { name: "review", required: true },
  { name: "delivery", required: true },
] as const

const itemClassName =
  "data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none"

export function QuestionnaireAnimated() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Agent workflow saved", {
      description: `Task: ${formData.get("task") ?? "None"} · Review: ${formData.get("review") ?? "None"} · Delivery: ${formData.get("delivery") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem className={itemClassName} name="task" required>
        <QuestionnaireTitle>What should the agent do?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the task for this run.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="implement">
            Implement the requested change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="debug">
            Debug the current behavior
          </QuestionnaireChoice>
          <QuestionnaireChoice value="review">
            Review the implementation
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem className={itemClassName} name="review" required>
        <QuestionnaireTitle>
          How should the work be reviewed?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select the verification depth.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="targeted">
            Targeted checks
          </QuestionnaireChoice>
          <QuestionnaireChoice value="complete">
            Complete test suite
          </QuestionnaireChoice>
          <QuestionnaireChoice value="manual">
            Tests and manual QA
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem className={itemClassName} name="delivery" required>
        <QuestionnaireTitle>
          How should the result be delivered?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the final handoff format.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="summary">
            Concise summary
          </QuestionnaireChoice>
          <QuestionnaireChoice value="diff">
            Summary and changed files
          </QuestionnaireChoice>
          <QuestionnaireChoice value="handoff">
            Detailed review handoff
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save workflow</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

```

## Card

Compose Questionnaire with Card slots while keeping the question title and description semantic.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  {
    choices: [{ value: "fix" }, { value: "refactor" }, { value: "docs" }],
    name: "task",
    required: true,
  },
  {
    choices: [{ value: "summary" }, { value: "files" }, { value: "review" }],
    name: "output",
    required: true,
  },
] as const

export function QuestionnaireCard() {
  const taskTitleId = React.useId()
  const outputTitleId = React.useId()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    toast("Agent task created", {
      description: `Task: ${formData.get("task") ?? "None"} · Handoff: ${formData.get("output") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      shortcuts="numbers"
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem aria-labelledby={taskTitleId} name="task" required>
          <CardHeader>
            <QuestionnaireTitle id={taskTitleId} render={<CardTitle />}>
              What should the agent work on?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Choose the task that should be handled next.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="fix">
                Fix the failing tests
              </QuestionnaireChoice>
              <QuestionnaireChoice value="refactor">
                Refactor the data layer
              </QuestionnaireChoice>
              <QuestionnaireChoice value="docs">
                Update the integration guide
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem
          aria-labelledby={outputTitleId}
          name="output"
          required
        >
          <CardHeader>
            <QuestionnaireTitle id={outputTitleId} render={<CardTitle />}>
              What should the final handoff include?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Pick the level of detail needed for review.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="summary">
                Summary only
              </QuestionnaireChoice>
              <QuestionnaireChoice value="files">
                Summary and changed files
              </QuestionnaireChoice>
              <QuestionnaireChoice value="review">
                Full review handoff
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions className="w-full">
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Create task</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  )
}

```

## Dialog

Compose Questionnaire inside a Dialog while keeping cancellation and dismissal host-owned.

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const items = [
  { name: "scope", required: true },
  { name: "tests", required: true },
] as const

export function QuestionnaireDialog() {
  const [open, setOpen] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setOpen(false)
    toast("Clarification sent", {
      description: `Scope: ${formData.get("scope") ?? "None"} · Verification: ${formData.get("tests") ?? "None"}`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Open clarification
      </DialogTrigger>
      <DialogContent>
        <Questionnaire
          defaultItem="scope"
          items={items}
          onSubmit={handleSubmit}
        >
          <QuestionnaireItem name="scope" required>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>
                Which files are in scope?
              </QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Choose how broadly the agent can update the workspace.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="component">
                Component only
              </QuestionnaireChoice>
              <QuestionnaireChoice value="feature">
                Complete feature directory
              </QuestionnaireChoice>
              <QuestionnaireChoice value="workspace">
                Any related workspace file
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>

          <QuestionnaireItem name="tests" required>
            <DialogHeader>
              <QuestionnaireProgress />
              <QuestionnaireTitle render={<DialogTitle />}>
                How much verification is needed?
              </QuestionnaireTitle>
              <QuestionnaireDescription render={<DialogDescription />}>
                Choose the checks the agent should run before handoff.
              </QuestionnaireDescription>
            </DialogHeader>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="targeted">
                Targeted tests
              </QuestionnaireChoice>
              <QuestionnaireChoice value="package">
                Package tests
              </QuestionnaireChoice>
              <QuestionnaireChoice value="full">
                Full workspace verification
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext>Next</QuestionnaireNext>
              <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
            </QuestionnaireActions>
          </DialogFooter>
        </Questionnaire>
      </DialogContent>
    </Dialog>
  )
}

```

## Accessibility

`QuestionnaireItem` renders a `fieldset`, and `QuestionnaireTitle` renders its
`legend`. Descriptions and active errors are associated with the current item,
and invalid items and answer controls expose `aria-invalid`.

Fixed choices preserve native radio and checkbox behavior. Progress is exposed
as a named progressbar, navigation uses real buttons, and inactive items and
actions are hidden and inert. Successful navigation focuses the newly active
item; failed validation focuses an available answer control.

Always give `QuestionnaireInput` an accessible name with a visible label,
`aria-label`, or `aria-labelledby`. A placeholder is not a label. See the
[Questionnaire accessibility guide](/docs/react/questionnaire#accessibility)
for labeling custom compositions and the complete keyboard behavior.

## Unstyled

The behavior in `Questionnaire` comes from the `@shadcn/react` package. To use
it directly with your own markup and styles, see
[Questionnaire](/docs/react/questionnaire) under @shadcn/react.

## API Reference

The props, data attributes, and render states for every part are documented on
the [@shadcn/react Questionnaire](/docs/react/questionnaire#api-reference) page.
The styled components inherit the corresponding unstyled props. Navigation
components also accept Button `size` and `variant` props, and
`QuestionnaireActions` is a styled-only layout helper.
