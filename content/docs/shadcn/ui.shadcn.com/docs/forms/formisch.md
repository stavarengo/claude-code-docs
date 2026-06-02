---
title: Formisch
description: Build forms in React using Formisch and Valibot.
links:
  doc: https://formisch.dev
---

import { InfoIcon } from "lucide-react"

This guide covers building forms with [Formisch](https://formisch.dev), the lightweight, schema-first, and fully type-safe form library for React. We'll create forms with the `<Field />` component, validate them with Valibot schemas, handle errors, and ensure accessibility.

## Demo

We'll build the following form. It has a simple text input and a textarea. On submit, we'll validate the form data and display any errors.

<Callout icon={<InfoIcon />}>
  **Note:** For the purpose of this demo, we have intentionally disabled browser
  validation to show how schema validation and form errors work in Formisch. It
  is recommended to add basic browser validation in your production code.
</Callout>

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const FormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(5, "Bug title must be at least 5 characters."),
    v.maxLength(32, "Bug title must be at most 32 characters.")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(20, "Description must be at least 20 characters."),
    v.maxLength(100, "Description must be at most 100 characters.")
  ),
})

export function BugReportForm() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      title: "",
      description: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-demo" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["title"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-demo-title">
                    Bug Title
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="form-formisch-demo-title"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
            <FormischField of={form} path={["description"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field.props}
                      id="form-formisch-demo-description"
                      value={field.input ?? ""}
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={field.errors !== null}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.input ?? "").length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

## Approach

This form leverages Formisch for headless, schema-first form handling. We'll build our form using the `<Field />` component, which gives you **complete flexibility over the markup and styling**.

- Uses Formisch's `useForm` hook for form state management.
- `<Form />` component to wrap the native `<form>` element with submit handling.
- `<Field />` render-prop component for controlled inputs.
- Schema validation using [Valibot](https://valibot.dev).
- Type-safe field paths inferred from the schema.

## Form Methods

Formisch exposes form operations as **top-level functions** rather than methods on a form object. Import only what you need:

```ts
import { getInput, insert, reset, submit } from "@formisch/react"
```

Every method follows the same signature: the **first parameter is always the form store**, and the **second parameter (if necessary) is always a config object**.

```ts
// Read a field value
const email = getInput(form, { path: ["email"] })

// Reset the form with new initial values
reset(form, { initialInput: { email: "", password: "" } })

// Move an item in a field array
move(form, { path: ["items"], from: 0, to: 3 })
```

This design keeps the API flexible and consistent across all methods. You'll see the same `(form, config)` shape used throughout this guide for reading state (`getInput`, `getErrors`), writing state (`setInput`, `setErrors`), form control (`submit`, `validate`, `focus`), and array operations (`insert`, `remove`, `move`, `swap`, `replace`). See the [full methods reference](https://formisch.dev/react/guides/form-methods) for details.

## Anatomy

Here's a basic example of a form using the `<Field />` component from Formisch and the shadcn `<Field />` component.

```tsx showLineNumbers {3-21}
<Form of={form} onSubmit={handleSubmit}>
  <FieldGroup>
    <FormischField of={form} path={["title"]}>
      {(field) => (
        <Field data-invalid={field.errors !== null}>
          <FieldLabel htmlFor="form-title">Bug Title</FieldLabel>
          <Input
            {...field.props}
            id="form-title"
            value={field.input}
            aria-invalid={field.errors !== null}
            placeholder="Login button not working on mobile"
            autoComplete="off"
          />
          <FieldDescription>
            Provide a concise title for your bug report.
          </FieldDescription>
          {field.errors && (
            <FieldError errors={field.errors.map((message) => ({ message }))} />
          )}
        </Field>
      )}
    </FormischField>
  </FieldGroup>
</Form>
```

<Callout icon={<InfoIcon />}>
  **Note:** Formisch ships its own `Field` component. To avoid a name clash with
  the shadcn `Field`, the examples below import the Formisch one as
  `FormischField` and keep the shadcn `Field` under its original name. In your
  own code you can alias either side — just be consistent.
</Callout>

## Form

### Create a form schema

We'll start by defining the shape of our form using a Valibot schema. Formisch infers all input and output types directly from this schema.

```tsx showLineNumbers title="form.tsx"
import * as v from "valibot"

const FormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(5, "Bug title must be at least 5 characters."),
    v.maxLength(32, "Bug title must be at most 32 characters.")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(20, "Description must be at least 20 characters."),
    v.maxLength(100, "Description must be at most 100 characters.")
  ),
})
```

### Set up the form

Next, we'll use the `useForm` hook from Formisch to create our form instance. The schema is passed directly to `useForm` — there is no resolver step.

```tsx showLineNumbers title="form.tsx" {1-2,21-25}
import { Form, Field as FormischField, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import * as v from "valibot"

const FormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(5, "Bug title must be at least 5 characters."),
    v.maxLength(32, "Bug title must be at most 32 characters.")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(20, "Description must be at least 20 characters."),
    v.maxLength(100, "Description must be at most 100 characters.")
  ),
})

export function BugReportForm() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      title: "",
      description: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    // Do something with the validated form values.
    console.log(output)
  }

  return (
    <Form of={form} onSubmit={handleSubmit}>
      {/* ... */}
      {/* Build the form here */}
      {/* ... */}
    </Form>
  )
}
```

The `<Form />` component wraps a native `<form>` element. It calls `event.preventDefault()`, runs validation, and only invokes `onSubmit` when the data is valid. The `output` you receive is fully typed from the schema.

### Build the form

We can now build the form using the `<Field />` component from Formisch and the shadcn `<Field />` component.

<ComponentSource
  src="/registry/new-york-v4/examples/form-formisch-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the `handleSubmit` function will be called with the validated form data. If the form data is invalid, Formisch will populate `field.errors` for each invalid field and the UI will display them.

## Validation

### Client-side Validation

Formisch validates your form data using the Valibot schema you pass to `useForm`. There is no resolver — the schema is the single source of truth for both runtime validation and static types.

```tsx showLineNumbers title="form.tsx" {1,3-6,11}
import { useForm } from "@formisch/react"

const FormSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
})

export function ExampleForm() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      title: "",
      description: "",
    },
  })
}
```

### Validation Modes

Formisch separates the **first** validation from **subsequent** validations. You configure them with the `validate` and `revalidate` options on `useForm`.

```tsx showLineNumbers title="form.tsx" {3-4}
const form = useForm({
  schema: FormSchema,
  validate: "blur",
  revalidate: "input",
})
```

| Option       | Value       | Description                                                     |
| ------------ | ----------- | --------------------------------------------------------------- |
| `validate`   | `"submit"`  | Validate on form submission (default).                          |
| `validate`   | `"blur"`    | Validate when a field loses focus.                              |
| `validate`   | `"input"`   | Validate on every input change.                                 |
| `validate`   | `"initial"` | Validate immediately on form creation.                          |
| `revalidate` | `"input"`   | Revalidate on every input change after the first run (default). |
| `revalidate` | `"blur"`    | Revalidate on blur after the first run.                         |
| `revalidate` | `"submit"`  | Revalidate only on form submission.                             |

## Displaying Errors

Display errors next to the field using `<FieldError />`. Formisch returns errors as an array of strings, so map them to the shape `<FieldError />` expects. For styling and accessibility:

- Add the `data-invalid` prop to the `<Field />` component.
- Add the `aria-invalid` prop to the form control such as `<Input />`, `<SelectTrigger />`, `<Checkbox />`, etc.

```tsx showLineNumbers title="form.tsx" {3,10,12-14}
<FormischField of={form} path={["email"]}>
  {(field) => (
    <Field data-invalid={field.errors !== null}>
      <FieldLabel htmlFor="form-email">Email</FieldLabel>
      <Input
        {...field.props}
        id="form-email"
        value={field.input}
        type="email"
        aria-invalid={field.errors !== null}
      />
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </Field>
  )}
</FormischField>
```

## Working with Different Field Types

Formisch exposes two ways to bind a field to an element:

- **Native HTML elements** (like `<Input />` and `<Textarea />`) — spread `field.props` and provide `value={field.input}`. Formisch wires up `name`, `ref`, `onChange`, `onBlur`, and `onFocus` for you.
- **Component-library inputs** (like Radix-based `<Select />`, `<Checkbox />`, `<RadioGroup />`, `<Switch />`) — read the value from `field.input` and call `field.onChange(value)` to update it.

### Input

- For input fields, spread `field.props` and provide `value={field.input}`.
- To show errors, add the `aria-invalid` prop to the `<Input />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const FormSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, "Username must be at least 3 characters."),
    v.maxLength(10, "Username must be at most 10 characters."),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    )
  ),
})

export function FormFormischInput() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      username: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-input" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["username"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-input-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="form-formisch-input-username"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="shadcn"
                    autoComplete="username"
                  />
                  <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and
                    underscores.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-input">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

```tsx showLineNumbers title="form.tsx" {5-8}
<FormischField of={form} path={["username"]}>
  {(field) => (
    <Field data-invalid={field.errors !== null}>
      <FieldLabel htmlFor="form-username">Username</FieldLabel>
      <Input
        {...field.props}
        id="form-username"
        value={field.input}
        aria-invalid={field.errors !== null}
      />
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </Field>
  )}
</FormischField>
```

### Textarea

- For textarea fields, spread `field.props` and provide `value={field.input}`.
- To show errors, add the `aria-invalid` prop to the `<Textarea />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = v.object({
  about: v.pipe(
    v.string(),
    v.minLength(10, "Please provide at least 10 characters."),
    v.maxLength(200, "Please keep it under 200 characters.")
  ),
})

export function FormFormischTextarea() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      about: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>
          Customize your experience by telling us more about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-textarea" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["about"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-textarea-about">
                    More about you
                  </FieldLabel>
                  <Textarea
                    {...field.props}
                    id="form-formisch-textarea-about"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="I'm a software engineer..."
                    className="min-h-[120px]"
                  />
                  <FieldDescription>
                    Tell us more about yourself. This will be used to help us
                    personalize your experience.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-textarea">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

```tsx showLineNumbers title="form.tsx" {7-10}
<FormischField of={form} path={["about"]}>
  {(field) => (
    <Field data-invalid={field.errors !== null}>
      <FieldLabel htmlFor="form-about">More about you</FieldLabel>
      <Textarea
        {...field.props}
        id="form-about"
        value={field.input}
        aria-invalid={field.errors !== null}
        placeholder="I'm a software engineer..."
        className="min-h-[120px]"
      />
      <FieldDescription>
        Tell us more about yourself. This will be used to help us personalize
        your experience.
      </FieldDescription>
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </Field>
  )}
</FormischField>
```

### Select

- For select components, read `field.input` and call `field.onChange` from `<Select />`'s `onValueChange`.
- To show errors, add the `aria-invalid` prop to the `<SelectTrigger />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const spokenLanguages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
] as const

const FormSchema = v.object({
  language: v.pipe(
    v.string(),
    v.minLength(1, "Please select your spoken language."),
    v.check(
      (value) => value !== "auto",
      "Auto-detection is not allowed. Please select a specific language."
    )
  ),
})

export function FormFormischSelect() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      language: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle>Language Preferences</CardTitle>
        <CardDescription>
          Select your preferred spoken language.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-select" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["language"]}>
              {(field) => (
                <Field
                  orientation="responsive"
                  data-invalid={field.errors !== null}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-formisch-select-language">
                      Spoken Language
                    </FieldLabel>
                    <FieldDescription>
                      For best results, select the language you speak.
                    </FieldDescription>
                    {field.errors && (
                      <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                      />
                    )}
                  </FieldContent>
                  <Select
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      id="form-formisch-select-language"
                      aria-invalid={field.errors !== null}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectSeparator />
                      {spokenLanguages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-select">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

```tsx showLineNumbers title="form.tsx" {15-19}
<FormischField of={form} path={["language"]}>
  {(field) => (
    <Field orientation="responsive" data-invalid={field.errors !== null}>
      <FieldContent>
        <FieldLabel htmlFor="form-language">Spoken Language</FieldLabel>
        <FieldDescription>
          For best results, select the language you speak.
        </FieldDescription>
        {field.errors && (
          <FieldError errors={field.errors.map((message) => ({ message }))} />
        )}
      </FieldContent>
      <Select value={field.input} onValueChange={field.onChange}>
        <SelectTrigger
          id="form-language"
          aria-invalid={field.errors !== null}
          className="min-w-[120px]"
        >
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  )}
</FormischField>
```

### Checkbox

- For checkbox arrays, read `field.input` and update it from `onCheckedChange` using `field.onChange`.
- To show errors, add the `aria-invalid` prop to the `<Checkbox />` component and the `data-invalid` prop to the `<Field />` component.
- Remember to add `data-slot="checkbox-group"` to the `<FieldGroup />` component for proper styling and spacing.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

const tasks = [
  {
    id: "push",
    label: "Push notifications",
  },
  {
    id: "email",
    label: "Email notifications",
  },
] as const

const FormSchema = v.object({
  responses: v.boolean(),
  tasks: v.pipe(
    v.array(v.string()),
    v.minLength(1, "Please select at least one notification type."),
    v.check(
      (value) => value.every((task) => tasks.some((t) => t.id === task)),
      "Invalid notification type selected."
    )
  ),
})

export function FormFormischCheckbox() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      responses: true,
      tasks: [],
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your notification preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-checkbox" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["responses"]}>
              {(field) => (
                <div>
                  <FieldSet data-invalid={field.errors !== null}>
                    <FieldLegend variant="label">Responses</FieldLegend>
                    <FieldDescription>
                      Get notified for requests that take time, like research or
                      image generation.
                    </FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      <Field orientation="horizontal">
                        <Checkbox
                          id="form-formisch-checkbox-responses"
                          checked={field.input ?? false}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                          disabled
                        />
                        <FieldLabel
                          htmlFor="form-formisch-checkbox-responses"
                          className="font-normal"
                        >
                          Push notifications
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </div>
              )}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["tasks"]}>
              {(field) => (
                <FieldGroup>
                  <FieldSet data-invalid={field.errors !== null}>
                    <FieldLegend variant="label">Tasks</FieldLegend>
                    <FieldDescription>
                      Get notified when tasks you&apos;ve created have updates.
                    </FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      {tasks.map((task) => {
                        const current = field.input ?? []
                        return (
                          <Field
                            key={task.id}
                            orientation="horizontal"
                            data-invalid={field.errors !== null}
                          >
                            <Checkbox
                              id={`form-formisch-checkbox-${task.id}`}
                              aria-invalid={field.errors !== null}
                              checked={current.includes(task.id)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  checked === true
                                    ? [...current, task.id]
                                    : current.filter(
                                        (value) => value !== task.id
                                      )
                                )
                              }}
                            />
                            <FieldLabel
                              htmlFor={`form-formisch-checkbox-${task.id}`}
                              className="font-normal"
                            >
                              {task.label}
                            </FieldLabel>
                          </Field>
                        )
                      })}
                    </FieldGroup>
                  </FieldSet>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </FieldGroup>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-checkbox">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

```tsx showLineNumbers title="form.tsx" {16,19-25}
<FormischField of={form} path={["tasks"]}>
  {(field) => (
    <FieldSet>
      <FieldLegend variant="label">Tasks</FieldLegend>
      <FieldDescription>
        Get notified when tasks you&apos;ve created have updates.
      </FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {tasks.map((task) => (
          <Field
            key={task.id}
            orientation="horizontal"
            data-invalid={field.errors !== null}
          >
            <Checkbox
              id={`form-checkbox-${task.id}`}
              aria-invalid={field.errors !== null}
              checked={field.input?.includes(task.id) ?? false}
              onCheckedChange={(checked) => {
                const current = field.input ?? []
                field.onChange(
                  checked === true
                    ? [...current, task.id]
                    : current.filter((value) => value !== task.id)
                )
              }}
            />
            <FieldLabel
              htmlFor={`form-checkbox-${task.id}`}
              className="font-normal"
            >
              {task.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </FieldSet>
  )}
</FormischField>
```

### Radio Group

- For radio groups, read `field.input` and call `field.onChange` from `onValueChange`.
- To show errors, add the `aria-invalid` prop to the `<RadioGroupItem />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

const plans = [
  {
    id: "starter",
    title: "Starter (100K tokens/month)",
    description: "For everyday use with basic features.",
  },
  {
    id: "pro",
    title: "Pro (1M tokens/month)",
    description: "For advanced AI usage with more features.",
  },
  {
    id: "enterprise",
    title: "Enterprise (Unlimited tokens)",
    description: "For large teams and heavy usage.",
  },
] as const

const FormSchema = v.object({
  plan: v.pipe(
    v.string(),
    v.minLength(1, "You must select a subscription plan to continue.")
  ),
})

export function FormFormischRadioGroup() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      plan: "",
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          See pricing and features for each plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-radiogroup" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["plan"]}>
              {(field) => (
                <FieldSet data-invalid={field.errors !== null}>
                  <FieldLegend>Plan</FieldLegend>
                  <FieldDescription>
                    You can upgrade or downgrade your plan at any time.
                  </FieldDescription>
                  <RadioGroup
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                    aria-invalid={field.errors !== null}
                  >
                    {plans.map((plan) => (
                      <FieldLabel
                        key={plan.id}
                        htmlFor={`form-formisch-radiogroup-${plan.id}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={field.errors !== null}
                        >
                          <FieldContent>
                            <FieldTitle>{plan.title}</FieldTitle>
                            <FieldDescription>
                              {plan.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={plan.id}
                            id={`form-formisch-radiogroup-${plan.id}`}
                            aria-invalid={field.errors !== null}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </FieldSet>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-radiogroup">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

```tsx showLineNumbers title="form.tsx" {9-13,21}
<FormischField of={form} path={["plan"]}>
  {(field) => (
    <FieldSet>
      <FieldLegend>Plan</FieldLegend>
      <FieldDescription>
        You can upgrade or downgrade your plan at any time.
      </FieldDescription>
      <RadioGroup value={field.input} onValueChange={field.onChange}>
        {plans.map((plan) => (
          <FieldLabel key={plan.id} htmlFor={`form-radiogroup-${plan.id}`}>
            <Field
              orientation="horizontal"
              data-invalid={field.errors !== null}
            >
              <FieldContent>
                <FieldTitle>{plan.title}</FieldTitle>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={plan.id}
                id={`form-radiogroup-${plan.id}`}
                aria-invalid={field.errors !== null}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </FieldSet>
  )}
</FormischField>
```

### Switch

- For switches, read `field.input` and call `field.onChange` from `onCheckedChange`.
- To show errors, add the `aria-invalid` prop to the `<Switch />` component and the `data-invalid` prop to the `<Field />` component.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

const FormSchema = v.object({
  twoFactor: v.pipe(
    v.boolean(),
    v.check(
      (value) => value === true,
      "It is highly recommended to enable two-factor authentication."
    )
  ),
})

export function FormFormischSwitch() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      twoFactor: false,
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-switch" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["twoFactor"]}>
              {(field) => (
                <Field
                  orientation="horizontal"
                  data-invalid={field.errors !== null}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-formisch-switch-twoFactor">
                      Multi-factor authentication
                    </FieldLabel>
                    <FieldDescription>
                      Enable multi-factor authentication to secure your account.
                    </FieldDescription>
                    {field.errors && (
                      <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                      />
                    )}
                  </FieldContent>
                  <Switch
                    id="form-formisch-switch-twoFactor"
                    checked={field.input ?? false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-invalid={field.errors !== null}
                  />
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-switch">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

```tsx showLineNumbers title="form.tsx" {15-19}
<FormischField of={form} path={["twoFactor"]}>
  {(field) => (
    <Field orientation="horizontal" data-invalid={field.errors !== null}>
      <FieldContent>
        <FieldLabel htmlFor="form-twoFactor">
          Multi-factor authentication
        </FieldLabel>
        <FieldDescription>
          Enable multi-factor authentication to secure your account.
        </FieldDescription>
        {field.errors && (
          <FieldError errors={field.errors.map((message) => ({ message }))} />
        )}
      </FieldContent>
      <Switch
        id="form-twoFactor"
        checked={field.input ?? false}
        onCheckedChange={field.onChange}
        aria-invalid={field.errors !== null}
      />
    </Field>
  )}
</FormischField>
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

```tsx
"use client"

import * as React from "react"
import { Form, Field as FormischField, reset, useForm } from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const addons = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Advanced analytics and reporting",
  },
  {
    id: "backup",
    title: "Backup",
    description: "Automated daily backups",
  },
  {
    id: "support",
    title: "Priority Support",
    description: "24/7 premium customer support",
  },
] as const

const FormSchema = v.object({
  plan: v.pipe(
    v.string(),
    v.minLength(1, "Please select a subscription plan"),
    v.check(
      (value) => value === "basic" || value === "pro",
      "Invalid plan selection. Please choose Basic or Pro"
    )
  ),
  billingPeriod: v.pipe(
    v.string(),
    v.minLength(1, "Please select a billing period")
  ),
  addons: v.pipe(
    v.array(v.string()),
    v.minLength(1, "Please select at least one add-on"),
    v.maxLength(3, "You can select up to 3 add-ons"),
    v.check(
      (value) => value.every((addon) => addons.some((a) => a.id === addon)),
      "You selected an invalid add-on"
    )
  ),
  emailNotifications: v.boolean(),
})

export function FormFormischComplex() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      plan: "basic",
      billingPeriod: "",
      addons: [],
      emailNotifications: false,
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>You&apos;re almost there!</CardTitle>
        <CardDescription>
          Choose your subscription plan and billing period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-complex" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["plan"]}>
              {(field) => (
                <FieldSet data-invalid={field.errors !== null}>
                  <FieldLegend variant="label">Subscription Plan</FieldLegend>
                  <FieldDescription>
                    Choose your subscription plan.
                  </FieldDescription>
                  <RadioGroup
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                    aria-invalid={field.errors !== null}
                  >
                    <FieldLabel htmlFor="form-formisch-complex-basic">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Basic</FieldTitle>
                          <FieldDescription>
                            For individuals and small teams
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value="basic"
                          id="form-formisch-complex-basic"
                        />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="form-formisch-complex-pro">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Pro</FieldTitle>
                          <FieldDescription>
                            For businesses with higher demands
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value="pro"
                          id="form-formisch-complex-pro"
                        />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </FieldSet>
              )}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["billingPeriod"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="form-formisch-complex-billingPeriod">
                    Billing Period
                  </FieldLabel>
                  <Select
                    value={field.input ?? ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      id="form-formisch-complex-billingPeriod"
                      aria-invalid={field.errors !== null}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Choose how often you want to be billed.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["addons"]}>
              {(field) => {
                const current = field.input ?? []
                return (
                  <FieldSet>
                    <FieldLegend>Add-ons</FieldLegend>
                    <FieldDescription>
                      Select additional features you&apos;d like to include.
                    </FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      {addons.map((addon) => (
                        <Field
                          key={addon.id}
                          orientation="horizontal"
                          data-invalid={field.errors !== null}
                        >
                          <Checkbox
                            id={`form-formisch-complex-${addon.id}`}
                            aria-invalid={field.errors !== null}
                            checked={current.includes(addon.id)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked === true
                                  ? [...current, addon.id]
                                  : current.filter(
                                      (value) => value !== addon.id
                                    )
                              )
                            }}
                          />
                          <FieldContent>
                            <FieldLabel
                              htmlFor={`form-formisch-complex-${addon.id}`}
                            >
                              {addon.title}
                            </FieldLabel>
                            <FieldDescription>
                              {addon.description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      ))}
                    </FieldGroup>
                    {field.errors && (
                      <FieldError
                        errors={field.errors.map((message) => ({ message }))}
                      />
                    )}
                  </FieldSet>
                )
              }}
            </FormischField>
            <FieldSeparator />
            <FormischField of={form} path={["emailNotifications"]}>
              {(field) => (
                <Field
                  orientation="horizontal"
                  data-invalid={field.errors !== null}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-formisch-complex-emailNotifications">
                      Email Notifications
                    </FieldLabel>
                    <FieldDescription>
                      Receive email updates about your subscription
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="form-formisch-complex-emailNotifications"
                    checked={field.input ?? false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-invalid={field.errors !== null}
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter className="border-t">
        <Field>
          <Button type="submit" form="form-formisch-complex">
            Save Preferences
          </Button>
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

## Resetting the Form

Formisch exposes a top-level `reset` function. Pass the form store to reset it to its initial input.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => reset(form)}>
  Reset
</Button>
```

You can also reset to new initial values, or reset while keeping the user's current input:

```tsx showLineNumbers
// Reset to a fresh set of initial values
reset(form, { initialInput: { title: "", description: "" } })

// Sync the baseline to new server data, but keep the user's edits
reset(form, { initialInput: serverData, keepInput: true })
```

## Array Fields

Formisch provides a `<FieldArray />` component and a set of helper functions for managing dynamic array fields. Use it whenever you need to add, remove, or reorder items.

```tsx
"use client"

import * as React from "react"
import {
  FieldArray,
  Form,
  Field as FormischField,
  insert,
  remove,
  reset,
  useForm,
} from "@formisch/react"
import type { SubmitHandler } from "@formisch/react"
import { XIcon } from "lucide-react"
import { toast } from "sonner"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

const FormSchema = v.object({
  emails: v.pipe(
    v.array(
      v.object({
        address: v.pipe(
          v.string(),
          v.nonEmpty("Enter an email address."),
          v.email("Enter a valid email address.")
        ),
      })
    ),
    v.minLength(1, "Add at least one email address."),
    v.maxLength(5, "You can add up to 5 email addresses.")
  ),
})

export function FormFormischArray() {
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      emails: [{ address: "" }, { address: "" }],
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(output, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="border-b">
        <CardTitle>Contact Emails</CardTitle>
        <CardDescription>Manage your contact email addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} id="form-formisch-array" onSubmit={handleSubmit}>
          <FieldArray of={form} path={["emails"]}>
            {(fieldArray) => (
              <FieldSet className="gap-4">
                <FieldLegend variant="label">Email Addresses</FieldLegend>
                <FieldDescription>
                  Add up to 5 email addresses where we can contact you.
                </FieldDescription>
                <FieldGroup className="gap-4">
                  {fieldArray.items.map((item, index) => (
                    <FormischField
                      key={item}
                      of={form}
                      path={["emails", index, "address"]}
                    >
                      {(field) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={field.errors !== null}
                        >
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...field.props}
                                id={`form-formisch-array-email-${index}`}
                                value={field.input ?? ""}
                                aria-invalid={field.errors !== null}
                                placeholder="name@example.com"
                                type="email"
                                autoComplete="email"
                              />
                              {fieldArray.items.length > 1 && (
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() =>
                                      remove(form, {
                                        path: ["emails"],
                                        at: index,
                                      })
                                    }
                                    aria-label={`Remove email ${index + 1}`}
                                  >
                                    <XIcon />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              )}
                            </InputGroup>
                            {field.errors && (
                              <FieldError
                                errors={field.errors.map((message) => ({
                                  message,
                                }))}
                              />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    </FormischField>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      insert(form, {
                        path: ["emails"],
                        initialInput: { address: "" },
                      })
                    }
                    disabled={fieldArray.items.length >= 5}
                  >
                    Add Email Address
                  </Button>
                </FieldGroup>
                {fieldArray.errors && (
                  <FieldError
                    errors={fieldArray.errors.map((message) => ({ message }))}
                  />
                )}
              </FieldSet>
            )}
          </FieldArray>
        </Form>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset(form)}>
            Reset
          </Button>
          <Button type="submit" form="form-formisch-array">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

### Using FieldArray

`<FieldArray />` follows the same render-prop pattern as `<Field />`. Its `items` array contains a stable key per item that you should use as the React `key`.

```tsx showLineNumbers title="form.tsx" {1,7-22}
import {
  Field as FormischField,
  FieldArray,
  insert,
  remove,
} from "@formisch/react"

export function ExampleForm() {
  // ... form config

  return (
    <FieldArray of={form} path={["emails"]}>
      {(fieldArray) => (
        <FieldGroup className="gap-4">
          {fieldArray.items.map((item, index) => (
            <FormischField
              key={item}
              of={form}
              path={["emails", index, "address"]}
            >
              {(field) => /* ... */}
            </FormischField>
          ))}
        </FieldGroup>
      )}
    </FieldArray>
  )
}
```

### Array Field Structure

Wrap your array fields in a `<FieldSet />` with a `<FieldLegend />` and `<FieldDescription />`.

```tsx showLineNumbers title="form.tsx"
<FieldSet className="gap-4">
  <FieldLegend variant="label">Email Addresses</FieldLegend>
  <FieldDescription>
    Add up to 5 email addresses where we can contact you.
  </FieldDescription>
  <FieldGroup className="gap-4">{/* Array items go here */}</FieldGroup>
</FieldSet>
```

### Adding Items

Use the `insert` function to add new items to the array. By default new items are appended to the end. You can also pass an `at` index to insert at a specific position.

```tsx showLineNumbers title="form.tsx"
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() =>
    insert(form, { path: ["emails"], initialInput: { address: "" } })
  }
  disabled={fieldArray.items.length >= 5}
>
  Add Email Address
</Button>
```

### Removing Items

Use the `remove` function with an `at` index to remove items from the array.

```tsx showLineNumbers title="form.tsx"
import { remove } from "@formisch/react"

{
  fieldArray.items.length > 1 && (
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => remove(form, { path: ["emails"], at: index })}
        aria-label={`Remove email ${index + 1}`}
      >
        <XIcon />
      </InputGroupButton>
    </InputGroupAddon>
  )
}
```

Formisch also exposes `move`, `swap`, and `replace` for reordering and replacing items. They follow the same `(form, config)` signature.

### Array Validation

Use Valibot's `array` and pipeline validators to constrain array fields.

```tsx showLineNumbers title="form.tsx"
const FormSchema = v.object({
  emails: v.pipe(
    v.array(
      v.object({
        address: v.pipe(
          v.string(),
          v.nonEmpty("Enter an email address."),
          v.email("Enter a valid email address.")
        ),
      })
    ),
    v.minLength(1, "Add at least one email address."),
    v.maxLength(5, "You can add up to 5 email addresses.")
  ),
})
```
