---
title: Questionnaire
description: Build accessible, multi-step questionnaires with single, multiple, freeform, and intentionally skipped answers.
---

`Questionnaire` is an unstyled form primitive for presenting one question at a
time. It manages answers, progress, validation, and navigation.

It works well for agent clarification prompts, onboarding, surveys, intake
forms, and configuration.

The unstyled package gives you full control over markup and styles. For the
styled version and themed examples, see
[Questionnaire](/docs/components/base/questionnaire).

## Installation

```bash
npm install @shadcn/react
```

## Import

```tsx
import { Questionnaire } from "@shadcn/react/questionnaire"
```

`Questionnaire` exports its parts from one namespace. Each part accepts the
native props for its default element.

## Anatomy

```tsx
<Questionnaire.Root>
  <Questionnaire.Progress />
  <Questionnaire.Item name="question">
    <Questionnaire.Title />
    <Questionnaire.Description />
    <Questionnaire.Choices>
      <Questionnaire.Choice>
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel />
        <Questionnaire.ChoiceShortcut />
      </Questionnaire.Choice>
      <Questionnaire.Input />
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
  <Questionnaire.Previous />
  <Questionnaire.Skip />
  <Questionnaire.Next />
  <Questionnaire.Submit />
</Questionnaire.Root>
```

`Root` renders a form. Each `Item` is a fieldset, with `Title` as its legend.
`ChoiceInput` renders a native radio or checkbox.

## Styled version

The styled registry component uses flat component names:

| Styled component                                                                         | Unstyled part                                                                                |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Questionnaire`                                                                          | `Questionnaire.Root`                                                                         |
| `QuestionnaireProgress`                                                                  | `Questionnaire.Progress`                                                                     |
| `QuestionnaireItem`                                                                      | `Questionnaire.Item`                                                                         |
| `QuestionnaireTitle`                                                                     | `Questionnaire.Title`                                                                        |
| `QuestionnaireDescription`                                                               | `Questionnaire.Description`                                                                  |
| `QuestionnaireChoices`                                                                   | `Questionnaire.Choices`                                                                      |
| `QuestionnaireChoice`                                                                    | `Questionnaire.Choice` with `ChoiceInput`, `ChoiceLabel`, and `ChoiceShortcut`               |
| `QuestionnaireInput`                                                                     | `Questionnaire.Input`                                                                        |
| `QuestionnaireError`                                                                     | `Questionnaire.Error`                                                                        |
| `QuestionnaireActions`                                                                   | None. Layout only; use your own container.                                                   |
| `QuestionnairePrevious`, `QuestionnaireSkip`, `QuestionnaireNext`, `QuestionnaireSubmit` | `Questionnaire.Previous`, `Questionnaire.Skip`, `Questionnaire.Next`, `Questionnaire.Submit` |

The styled `QuestionnaireChoice` composes the input, label, shortcut, and visual
indicator for you. With the unstyled package, compose those parts yourself.

## Basic usage

Each `Item` is one step. Its `name` identifies the step and becomes the form
field name for its answers. `Choice.value` is the submitted answer.

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

```tsx
const items = [
  {
    name: "prototype",
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

```tsx showLineNumbers
"use client"

import * as React from "react"
import { Questionnaire } from "@shadcn/react/questionnaire"

export function ProjectQuestionnaire() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    console.log({
      prototype: formData.get("prototype"),
      detail: formData.get("detail"),
    })
  }

  return (
    <Questionnaire.Root items={items} onSubmit={handleSubmit}>
      <Questionnaire.Progress />
      {items.map((question) => (
        <Questionnaire.Item
          key={question.name}
          name={question.name}
          required={question.required}
        >
          <Questionnaire.Title>{question.prompt}</Questionnaire.Title>
          <Questionnaire.Description>
            {question.description}
          </Questionnaire.Description>
          <Questionnaire.Choices>
            {question.choices.map((choice) => (
              <Questionnaire.Choice key={choice.value} value={choice.value}>
                <Questionnaire.ChoiceInput />
                <Questionnaire.ChoiceLabel>
                  <span>{choice.label}</span>
                  {"description" in choice ? (
                    <span>{choice.description}</span>
                  ) : null}
                </Questionnaire.ChoiceLabel>
                <Questionnaire.ChoiceShortcut />
              </Questionnaire.Choice>
            ))}
            {"input" in question ? (
              <Questionnaire.Input
                aria-label={question.input.label}
                placeholder={question.input.placeholder}
              />
            ) : null}
          </Questionnaire.Choices>
          <Questionnaire.Error />
        </Questionnaire.Item>
      ))}
      <Questionnaire.Previous />
      <Questionnaire.Skip />
      <Questionnaire.Next />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )
}
```

Pass the same `items` collection to `Root` that you render as `Item` and
`Choice` parts. This makes item order, progress, action visibility, and answer
shortcuts available in the server-rendered HTML.

## Multiple selection

`multiple` turns an item's fixed choices into native checkboxes. Read the answers with
`FormData.getAll()`. Keep `multiple` in your application data and pass it to
the rendered `Item`.

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

```tsx
const items = [
  {
    name: "signals",
    required: true,
    multiple: true,
    prompt: "What should every update include?",
    description: "Select all that apply.",
    choices: [
      { value: "progress", label: "Progress" },
      { value: "decisions", label: "Decisions" },
      { value: "risks", label: "Risks" },
    ],
  },
] as const
```

```tsx
items.map((question) => (
  <Questionnaire.Item
    key={question.name}
    name={question.name}
    multiple={question.multiple}
    required={question.required}
  >
    <Questionnaire.Title>{question.prompt}</Questionnaire.Title>
    <Questionnaire.Description>
      {question.description}
    </Questionnaire.Description>
    <Questionnaire.Choices>
      {question.choices.map((choice) => (
        <Questionnaire.Choice key={choice.value} value={choice.value}>
          <Questionnaire.ChoiceInput />
          <Questionnaire.ChoiceLabel>{choice.label}</Questionnaire.ChoiceLabel>
          <Questionnaire.ChoiceShortcut />
        </Questionnaire.Choice>
      ))}
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
))
```

```tsx
const signals = new FormData(form).getAll("signals").map(String)
```

## Freeform answers

`Input` adds a freeform answer and renders a native text input.

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

```tsx
const items = [
  {
    name: "prototype",
    required: true,
    prompt: "What should we prototype next?",
    choices: [
      { value: "delegation", label: "Delegation" },
      { value: "questions", label: "Question prompts" },
    ],
    input: {
      label: "Another prototype direction",
      placeholder: "Type another direction…",
    },
  },
] as const
```

```tsx
items.map((question) => (
  <Questionnaire.Item
    key={question.name}
    name={question.name}
    required={question.required}
  >
    <Questionnaire.Title>{question.prompt}</Questionnaire.Title>
    <Questionnaire.Choices>
      {question.choices.map((choice) => (
        <Questionnaire.Choice key={choice.value} value={choice.value}>
          <Questionnaire.ChoiceInput />
          <Questionnaire.ChoiceLabel>{choice.label}</Questionnaire.ChoiceLabel>
          <Questionnaire.ChoiceShortcut />
        </Questionnaire.Choice>
      ))}
      <Questionnaire.Input
        aria-label={question.input.label}
        placeholder={question.input.placeholder}
      />
    </Questionnaire.Choices>
    <Questionnaire.Error />
  </Questionnaire.Item>
))
```

## Explicit skip

`Skip` records that an optional item was intentionally left unanswered. Use
`onStatusChange` when your application needs to distinguish a skipped answer
from a missing one.

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

```tsx showLineNumbers
"use client"

import * as React from "react"
import {
  Questionnaire,
  type QuestionnaireItemStatus,
} from "@shadcn/react/questionnaire"

export function PlanningQuestionnaire() {
  const [timingStatus, setTimingStatus] =
    React.useState<QuestionnaireItemStatus>("unanswered")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    console.log({
      timing:
        timingStatus === "skipped"
          ? { status: "skipped" }
          : {
              status: "answered",
              value: formData.get("timing"),
            },
    })
  }

  return (
    <Questionnaire.Root defaultItem="timing" onSubmit={handleSubmit}>
      <Questionnaire.Item name="timing" onStatusChange={setTimingStatus}>
        <Questionnaire.Title>
          When should this be revisited?
        </Questionnaire.Title>
        <Questionnaire.Description>
          Skip this if timing has not been decided.
        </Questionnaire.Description>
        <Questionnaire.Choices>
          <Questionnaire.Choice value="week">
            <Questionnaire.ChoiceInput />
            <Questionnaire.ChoiceLabel>This week</Questionnaire.ChoiceLabel>
            <Questionnaire.ChoiceShortcut />
          </Questionnaire.Choice>
          <Questionnaire.Choice value="cycle">
            <Questionnaire.ChoiceInput />
            <Questionnaire.ChoiceLabel>Next cycle</Questionnaire.ChoiceLabel>
            <Questionnaire.ChoiceShortcut />
          </Questionnaire.Choice>
        </Questionnaire.Choices>
      </Questionnaire.Item>
      <Questionnaire.Skip />
      <Questionnaire.Submit />
    </Questionnaire.Root>
  )
}
```

## Answer shortcuts

Use `shortcuts="letters"` or `shortcuts="numbers"` to assign a key to each
enabled fixed choice, following the `items` order when it is provided. Compose
`ChoiceShortcut` wherever its hint should appear.

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

```tsx
<Questionnaire.Root shortcuts="letters">
  <Questionnaire.Item name="review" required>
    <Questionnaire.Title>What should the agent review?</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice value="api">
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Public API</Questionnaire.ChoiceLabel>
        <Questionnaire.ChoiceShortcut />
      </Questionnaire.Choice>
      <Questionnaire.Choice value="tests">
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Test coverage</Questionnaire.ChoiceLabel>
        <Questionnaire.ChoiceShortcut />
      </Questionnaire.Choice>
    </Questionnaire.Choices>
  </Questionnaire.Item>
</Questionnaire.Root>
```

`"letters"` assigns `A` through `Z`; `"numbers"` assigns `1` through `9`.
Disabled choices are skipped. Selecting an answer by shortcut does not advance
to the next item.

## Validation

Questionnaire validates the active item before moving forward and validates all
enabled items when the form submits.

- A required item is valid after it has an answer.
- An optional item is valid after it has an answer or is explicitly skipped.
- Disabled items and answers are ignored.

`required` does not add visible “Required” text. Say it in the `Title` or
`Description`.

When validation fails, Questionnaire keeps or opens the invalid item and
focuses an answer. Add `Error` to show a message.

```tsx
<Questionnaire.Item name="scope" required>
  <Questionnaire.Title>
    What should the project include? (Required)
  </Questionnaire.Title>
  <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
  <Questionnaire.Error />
</Questionnaire.Item>
```

`Error` remains hidden until the item is invalid. Pass children to replace its
default message.

```tsx
<Questionnaire.Error>Please choose a project scope.</Questionnaire.Error>
```

Validation still works without `Error`. When rendered, the message is announced
to screen readers.

For Zod or another external validator, set `Item.invalid`, render the message in
`Error`, and move `Root.item` to the first invalid item.

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

```tsx
<Questionnaire.Root item={item} onItemChange={setItem} onSubmit={handleSubmit}>
  <Questionnaire.Item invalid={Boolean(errors.detail)} name="detail" required>
    <Questionnaire.Title>How much detail?</Questionnaire.Title>
    <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
    <Questionnaire.Error>{errors.detail}</Questionnaire.Error>
  </Questionnaire.Item>
</Questionnaire.Root>
```

## Controlled navigation

Pass `item` and `onItemChange` to control the active item.

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

```tsx
const [item, setItem] = React.useState("scope")

<Questionnaire.Root item={item} onItemChange={setItem} onSubmit={handleSubmit}>
  <Questionnaire.Item name="scope" required>
    {/* question and answers */}
  </Questionnaire.Item>
  <Questionnaire.Item name="verification" required>
    {/* question and answers */}
  </Questionnaire.Item>
  <Questionnaire.Previous />
  <Questionnaire.Next>Next</Questionnaire.Next>
  <Questionnaire.Submit>Submit</Questionnaire.Submit>
</Questionnaire.Root>
```

## Resume with defaults

Restore a saved draft with `defaultItem`, `defaultChecked`, and `defaultValue`.

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

```tsx
<Questionnaire.Root defaultItem="verification">
  <Questionnaire.Item name="scope" required>
    <Questionnaire.Title>Which files are in scope?</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice value="component" defaultChecked>
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Component only</Questionnaire.ChoiceLabel>
      </Questionnaire.Choice>
    </Questionnaire.Choices>
  </Questionnaire.Item>
  <Questionnaire.Item name="verification" required>
    <Questionnaire.Title>Any extra instructions?</Questionnaire.Title>
    <Questionnaire.Input
      aria-label="Extra instructions"
      defaultValue="Run the package tests."
    />
  </Questionnaire.Item>
  <button type="reset">Reset draft</button>
</Questionnaire.Root>
```

## Conditional items

Set `disabled` to remove an item from the current flow. Disabled items are
excluded from progress, navigation, validation, and submission.

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

```tsx
const [runtime, setRuntime] = React.useState("local")

<Questionnaire.Root>
  <Questionnaire.Item name="runtime" required>
    <Questionnaire.Title>Where should the agent run?</Questionnaire.Title>
    <Questionnaire.Choices>
      <Questionnaire.Choice
        value="local"
        checked={runtime === "local"}
        onChange={() => setRuntime("local")}
      >
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>Locally</Questionnaire.ChoiceLabel>
      </Questionnaire.Choice>
      <Questionnaire.Choice
        value="remote"
        checked={runtime === "remote"}
        onChange={() => setRuntime("remote")}
      >
        <Questionnaire.ChoiceInput />
        <Questionnaire.ChoiceLabel>
          Remote environment
        </Questionnaire.ChoiceLabel>
      </Questionnaire.Choice>
    </Questionnaire.Choices>
  </Questionnaire.Item>
  <Questionnaire.Item name="region" disabled={runtime !== "remote"} required>
    {/* remote-only question */}
  </Questionnaire.Item>
</Questionnaire.Root>
```

## Navigation state

Navigation actions stay enabled by default so activating Next or Submit can
show a validation error. Use the render state when you want to disable an
action yourself.

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

```tsx
<Questionnaire.Next
  render={(props, state) => (
    <button {...props} disabled={state.status === "unanswered"} />
  )}
>
  Next
</Questionnaire.Next>
```

The render state contains `visible`, `disabled`, `shortcut`, and the active
item's `status`. To change only the appearance, target `data-status` instead:

```tsx
<Questionnaire.Next data-navigation-action>Next</Questionnaire.Next>
```

```css
[data-navigation-action][data-status="unanswered"] {
  opacity: 0.5;
}
```

## Custom progress

`Progress` renders `Question {current} of {total}` by default. Use `render` to
change its element or format.

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

```tsx
<Questionnaire.Progress
  aria-label="Setup progress"
  render={(props, state) => (
    <output {...props}>
      Checkpoint {state.current} of {state.total}
    </output>
  )}
/>
```

The render state contains `current`, `total`, `first`, and `last`. Pass a
localized `aria-label` when needed.

## Animated items

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

```tsx
const itemClassName =
  "data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none"

<Questionnaire.Item
  className={itemClassName}
  name="task"
  required
>
  {/* ... */}
</Questionnaire.Item>
```

Inactive items hide immediately, so animate the entry only.

## Card composition

Place the root around a card and render `Title` and `Description` into the
card header. Give the title an `id` and connect it with the item's
`aria-labelledby` since it replaces the default legend.

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

```tsx
const titleId = React.useId()

<Questionnaire.Root onSubmit={handleSubmit}>
  <Card>
    <Questionnaire.Item aria-labelledby={titleId} name="task" required>
      <CardHeader>
        <Questionnaire.Title id={titleId} render={<CardTitle />}>
          What should the agent work on?
        </Questionnaire.Title>
        <Questionnaire.Description render={<CardDescription />}>
          Choose the task that should be handled next.
        </Questionnaire.Description>
        <CardAction>
          <Questionnaire.Progress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
        <Questionnaire.Error />
      </CardContent>
    </Questionnaire.Item>
    <CardFooter>
      <Questionnaire.Next>Next</Questionnaire.Next>
      <Questionnaire.Submit>Submit</Questionnaire.Submit>
    </CardFooter>
  </Card>
</Questionnaire.Root>
```

## Dialog composition

Keep dialog dismissal separate from `Skip`: closing cancels the flow, while
skipping records an intentional unanswered item.

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

```tsx
const titleId = React.useId()

<Dialog>
  <DialogTrigger>Open clarification</DialogTrigger>
  <DialogContent>
    <Questionnaire.Root onSubmit={handleSubmit}>
      <Questionnaire.Item aria-labelledby={titleId} name="scope" required>
        <DialogHeader>
          <Questionnaire.Progress />
          <Questionnaire.Title id={titleId} render={<DialogTitle />}>
            Which files are in scope?
          </Questionnaire.Title>
          <Questionnaire.Description render={<DialogDescription />}>
            Choose how broadly the agent can update the workspace.
          </Questionnaire.Description>
        </DialogHeader>
        <Questionnaire.Choices>{/* choices */}</Questionnaire.Choices>
        <Questionnaire.Error />
      </Questionnaire.Item>
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <Questionnaire.Next>Next</Questionnaire.Next>
        <Questionnaire.Submit>Send answer</Questionnaire.Submit>
      </DialogFooter>
    </Questionnaire.Root>
  </DialogContent>
</Dialog>
```

## Custom render targets

Use `render` to replace a part's default element. Pass an element, or use a
function when you need its state.

```tsx
<Questionnaire.Next render={<Button />}>Next</Questionnaire.Next>
```

`Root` and `Item` always render a `form` and `fieldset`. If `Title` no longer
renders a `legend`, give it an `id` and pass that ID to `Item` with
`aria-labelledby`.

The primitive does not emit `data-slot`. Styled wrappers own slots and visual
indicators.

## Native forms

`Root` always renders a native form and supports `onSubmit`, `onReset`, `action`,
and the other form props. Do not nest a Questionnaire inside another form.

Answers serialize through native controls:

- `FormData.get(itemName)` reads a single answer.
- `FormData.getAll(itemName)` reads multiple answers.
- Skipped items are absent from `FormData`.
- Use `Item.onStatusChange` to distinguish a skip from a missing answer.

`Root` sets `noValidate` by default so validation uses `Questionnaire.Error`
instead of the browser's constraint validation UI.

`form.reset()` restores the initial item, default answers, skip state, and
validation state.

## Keyboard navigation

Questionnaire builds on native radio, checkbox, input, and button behavior.

| Key                      | Behavior                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`                    | Moves focus between answer controls and visible actions.                                                                        |
| `Shift` + `Tab`          | Moves focus to the previous control or action.                                                                                  |
| `ArrowUp`                | Moves to the previous answer from the item, a fixed answer, or an empty text-like freeform input. Native radios also select it. |
| `ArrowDown`              | Moves to the next answer from the item, a fixed answer, or an empty text-like freeform input. Native radios also select it.     |
| `ArrowLeft`              | Moves to the previous item when focus is outside a radio or text entry control.                                                 |
| `ArrowRight`             | Moves to the next item when the active item is answered or skipped and focus is outside a radio or text entry control.          |
| `Space`                  | Selects a radio, toggles a checkbox, or activates a focused action.                                                             |
| `Enter`                  | Continues from a selected choice or selected, filled input; activates a focused action.                                         |
| `Command/Ctrl` + `Enter` | Validates and continues from anywhere inside the questionnaire, or submits the final item.                                      |

Shortcuts and arrow navigation pause while you type in a text field.
Preventing the root `onKeyDown` event turns off questionnaire key handling.

Navigation actions stay enabled by default so an attempted action can reveal
validation feedback. See [Navigation state](#navigation-state) to disable or
restyle an unanswered action.

## Accessibility

- `Item` renders a `fieldset`.
- `Title` renders the fieldset `legend` by default. If it uses a custom render
  target, connect its `id` to the item with `aria-labelledby`.
- `Description` and the active `Error` are connected with
  `aria-describedby`.
- Invalid items and answer controls expose `aria-invalid`.
- `Progress` renders a named progressbar with current, minimum, maximum, and
  text values.
- Fixed choices use native radios and checkboxes.
- Assigned shortcut keys and available navigation are exposed with
  `aria-keyshortcuts`.
- Inactive items and actions are hidden and inert.
- Navigation focuses the newly active fieldset.
- Validation focuses the first available answer control.
- Disabled items are omitted from progress and navigation.

Always give `Input` an accessible name. Use an explicit `id` with a visible
label:

```tsx
<Label htmlFor="other-answer">Other answer</Label>
<Questionnaire.Input
  id="other-answer"
  placeholder="Type another answer…"
/>
```

When the design has no visible label, use `aria-label` or `aria-labelledby`:

```tsx
<Questionnaire.Input
  aria-label="Other answer"
  placeholder="Type another answer…"
/>
```

A placeholder is not a label.

## Data attributes

Use these attributes for styling. Boolean attributes are present when true and
absent when false.

### Root and Progress

| Data attribute   | Value                                            |
| ---------------- | ------------------------------------------------ |
| `data-current`   | One-based active item position.                  |
| `data-total`     | Number of enabled items.                         |
| `data-first`     | Present on the first item.                       |
| `data-last`      | Present on the last item.                        |
| `data-shortcuts` | `"letters"` \| `"numbers"` on Root when enabled. |

### Item

| Data attribute  | Value                                         |
| --------------- | --------------------------------------------- |
| `data-active`   | Present when active.                          |
| `data-status`   | `"unanswered"` \| `"answered"` \| `"skipped"` |
| `data-required` | Present when required.                        |
| `data-multiple` | Present when multiple.                        |
| `data-disabled` | Present when disabled.                        |
| `data-invalid`  | Present after failed validation.              |

### Choice

| Data attribute   | Value                             |
| ---------------- | --------------------------------- |
| `data-type`      | `"radio"` \| `"checkbox"`         |
| `data-checked`   | Present when selected.            |
| `data-unchecked` | Present when not selected.        |
| `data-disabled`  | Present when disabled.            |
| `data-invalid`   | Present when its item is invalid. |
| `data-shortcut`  | Assigned letter or number.        |

### Choices

| Data attribute   | Value                                    |
| ---------------- | ---------------------------------------- |
| `data-shortcuts` | `"letters"` \| `"numbers"` when enabled. |

### Input

| Data attribute  | Value                                      |
| --------------- | ------------------------------------------ |
| `data-filled`   | Present when the input has non-empty text. |
| `data-empty`    | Present when the input has no answer text. |
| `data-disabled` | Present when disabled.                     |
| `data-invalid`  | Present when its item is invalid.          |

### Error

| Data attribute | Value                              |
| -------------- | ---------------------------------- |
| `data-invalid` | Present while the error is active. |

### Previous, Skip, Next, and Submit

| Data attribute  | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| `data-visible`  | Present when the action applies to the active item.        |
| `data-hidden`   | Present when the action does not apply.                    |
| `data-disabled` | Present when disabled.                                     |
| `data-shortcut` | `"Enter"` on an enabled, visible Next or Submit.           |
| `data-status`   | Active item: `"unanswered"`, `"answered"`, or `"skipped"`. |

`Title` and `Description` have no state attributes. The headless parts do not
emit `data-slot`.

## API Reference

### Questionnaire.Root

The form and coordination root.

| Prop           | Type                                     | Default            | Description                                                              |
| -------------- | ---------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| `item`         | `string`                                 | -                  | Controlled active item name.                                             |
| `defaultItem`  | `string`                                 | first enabled item | Initially active item name.                                              |
| `items`        | `readonly QuestionnaireItemDefinition[]` | -                  | Optional item data for server rendering and item order.                  |
| `onItemChange` | `(item: string) => void`                 | -                  | Called when navigation requests a different item.                        |
| `shortcuts`    | `"letters" \| "numbers"`                 | -                  | Assigns scoped answer shortcuts in definition or rendered DOM order.     |
| `noValidate`   | `boolean`                                | `true`             | Disables native constraint UI while preserving questionnaire validation. |
| `onSubmit`     | `FormEventHandler<HTMLFormElement>`      | -                  | Native form submission handler after every item validates.               |
| `onReset`      | `FormEventHandler<HTMLFormElement>`      | -                  | Native reset handler. Prevent default to stop questionnaire reset.       |

Root exposes `current`, `total`, `first`, `last`, and `shortcuts` through data
attributes.

The optional collection types are exported from
`@shadcn/react/questionnaire`:

```ts
type QuestionnaireChoiceDefinition = {
  value: string
  disabled?: boolean
}

type QuestionnaireItemDefinition = {
  name: string
  required?: boolean
  disabled?: boolean
  choices?: readonly QuestionnaireChoiceDefinition[]
}
```

### Questionnaire.Progress

Position within the enabled item collection.

| Prop         | Type                                             | Default                         | Description                               |
| ------------ | ------------------------------------------------ | ------------------------------- | ----------------------------------------- |
| `children`   | `React.ReactNode`                                | `Question {current} of {total}` | Custom progress content.                  |
| `aria-label` | `string`                                         | `Questionnaire progress`        | Accessible progressbar name.              |
| `render`     | `ReactElement \| (props, state) => ReactElement` | `<div>`                         | Custom render target with progress state. |

The render state contains `current`, `total`, `first`, and `last`.

### Questionnaire.Item

One questionnaire step.

| Prop             | Type                                        | Default  | Description                                                     |
| ---------------- | ------------------------------------------- | -------- | --------------------------------------------------------------- |
| `name`           | `string`                                    | required | Unique item identifier and native form field name.              |
| `invalid`        | `boolean`                                   | `false`  | Marks the item invalid from an external validator.              |
| `required`       | `boolean`                                   | `false`  | Requires an answer and prevents Skip.                           |
| `multiple`       | `boolean`                                   | `false`  | Renders fixed choices as checkboxes.                            |
| `disabled`       | `boolean`                                   | `false`  | Omits the item from progress and navigation.                    |
| `onStatusChange` | `(status: QuestionnaireItemStatus) => void` | -        | Observes `"unanswered"`, `"answered"`, and `"skipped"` changes. |

Item exposes `active`, `disabled`, `invalid`, `multiple`, `required`, and
`status` through data attributes.

Item names must be unique within a Root. The name belongs to the answer
controls, not the fieldset.

### Questionnaire.Title

The item title. Renders a semantic `legend` by default.

| Prop     | Type                              | Default    | Description                                                            |
| -------- | --------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `render` | `ReactElement \| render function` | `<legend>` | Custom render target. Pair its `id` with the item’s `aria-labelledby`. |

### Questionnaire.Description

Supporting text connected to the item with `aria-describedby`.

| Prop     | Type                              | Default | Description           |
| -------- | --------------------------------- | ------- | --------------------- |
| `render` | `ReactElement \| render function` | `<p>`   | Custom render target. |

### Questionnaire.Choices

A layout container for fixed and freeform answers.

| Prop     | Type                              | Default | Description           |
| -------- | --------------------------------- | ------- | --------------------- |
| `render` | `ReactElement \| render function` | `<div>` | Custom render target. |

The render state contains `shortcuts`.

### Questionnaire.Choice

A fixed-answer container. Compose one `ChoiceInput`, one `ChoiceLabel`, and an
optional `ChoiceShortcut` inside it. The default `<label>` keeps the whole row
associated with its native control.

| Prop             | Type                                             | Default   | Description                             |
| ---------------- | ------------------------------------------------ | --------- | --------------------------------------- |
| `value`          | `string`                                         | required  | Native answer value.                    |
| `checked`        | `boolean`                                        | -         | Controlled checked state.               |
| `defaultChecked` | `boolean`                                        | `false`   | Initial checked state.                  |
| `disabled`       | `boolean`                                        | `false`   | Disables the native answer control.     |
| `onChange`       | `ChangeEventHandler<HTMLInputElement>`           | -         | Native input change handler.            |
| `render`         | `ReactElement \| (props, state) => ReactElement` | `<label>` | Custom render target with choice state. |

The render state contains `checked`, `disabled`, `invalid`, `shortcut`, and
`type`.

### Questionnaire.ChoiceInput

The native radio or checkbox for its containing `Choice`. Questionnaire supplies
the props needed for selection, form submission, validation, and keyboard
interaction. It also accepts `className`, `id`, `ref`, `render`, and other
non-conflicting native input props.

`ChoiceInput` must be used inside `Choice`. Its render state matches `Choice`.

### Questionnaire.ChoiceLabel

The visible label content for a fixed choice. It renders a `<span>` inside the
`Choice` label and accepts native span props and `render`.

### Questionnaire.ChoiceShortcut

The visible shortcut for a fixed choice. It renders a `<span>` containing the
assigned letter or number and remains hidden when the choice has no shortcut.
It accepts native span props and `render`; its render state contains `shortcut`.

### Questionnaire.Input

A freeform answer. Its native `name` is managed by the containing item.

| Prop           | Type                                             | Default   | Description                                                   |
| -------------- | ------------------------------------------------ | --------- | ------------------------------------------------------------- |
| `value`        | `string \| number \| readonly string[]`          | -         | Controlled native input value.                                |
| `defaultValue` | `string \| number \| readonly string[]`          | -         | Initial native input value.                                   |
| `disabled`     | `boolean`                                        | `false`   | Disables the input.                                           |
| `onChange`     | `ChangeEventHandler<HTMLInputElement>`           | -         | Native input change handler.                                  |
| `type`         | `QuestionnaireInputType`                         | `"text"`  | A text-entry type such as `"email"`, `"number"`, or `"date"`. |
| `render`       | `ReactElement \| (props, state) => ReactElement` | `<input>` | Custom render target with input state.                        |

The render state contains `disabled`, `filled`, and `invalid`.

### Questionnaire.Error

The validation message. It is hidden until its item fails validation.

| Prop       | Type                                             | Default            | Description                              |
| ---------- | ------------------------------------------------ | ------------------ | ---------------------------------------- |
| `children` | `React.ReactNode`                                | contextual message | Custom validation message.               |
| `render`   | `ReactElement \| (props, state) => ReactElement` | `<p>`              | Custom render target with invalid state. |

### Navigation actions

`Previous`, `Skip`, `Next`, and `Submit` render native buttons and stay mounted
while their visibility changes.

| Part       | Default type | Visible when             | Disabled when             |
| ---------- | ------------ | ------------------------ | ------------------------- |
| `Previous` | `"button"`   | Not on the first item.   | Consumer sets `disabled`. |
| `Skip`     | `"button"`   | Active item is optional. | Consumer sets `disabled`. |
| `Next`     | `"button"`   | Not on the last item.    | Consumer sets `disabled`. |
| `Submit`   | `"submit"`   | On the last item.        | Consumer sets `disabled`. |

Each accepts native button props and:

| Prop     | Type                                             | Description                                 |
| -------- | ------------------------------------------------ | ------------------------------------------- |
| `render` | `ReactElement \| (props, state) => ReactElement` | Custom render target with navigation state. |

The render state contains `visible`, `disabled`, `shortcut`, and the active
item's `status`.
