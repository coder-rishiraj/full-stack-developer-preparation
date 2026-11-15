---
summary: TypeScript turns a React component's props into a checked contract, so missing props, misspelt attributes and wrong event handlers fail in the editor rather than in the browser. You will learn how React 19's type definitions model components, children, events and refs, how to design props that reuse native HTML attributes safely, and how to type components that can be controlled or uncontrolled.
difficulty: intermediate
minutes: 55
objectives:
  - Explain how TypeScript checks JSX against a component's props type, and what `@types/react` contributes
  - Type function components, children, event handlers and generic components without `React.FC` or `any`
  - Design a component's props that extend native element attributes with `ComponentPropsWithoutRef`, `Omit` and defaults
  - Compare controlled and uncontrolled components and type a field that supports both modes safely
  - Choose the right React 19 types for refs, return values and form events, and recognise outdated patterns
---

## Introduction

A React component is a function that takes one object — its **props** — and returns something to render. In plain JavaScript nothing checks that object. Forget a required prop, misspell `onClick` as `onclick`, or pass a number where the component expects a string, and you find out when the page renders wrongly or throws. In a large application, with components written by different people and reused in hundreds of places, those mistakes are a constant source of bugs.

TypeScript fixes this by treating props as a typed parameter and JSX as a function call it can check. `<Greeting name={42} />` is then a compile error with a message pointing at the exact attribute. The same machinery types event handlers (what is `e.target` here?), refs (can this be `null`?), children, and generic components such as lists and tables that work with any item type.

This lesson covers how that checking works and the everyday patterns for writing typed components with React 19 and `@types/react` 19. Two nested concepts are taught as their own sections: **component props**, which is about designing a component's public API, and **controlled versus uncontrolled** components, which is about who owns a form field's value. Typing hooks has its own lesson, [[b2-hooks-typing]], and the general technique for forbidding conflicting props is in [[b2-mutually-exclusive-props]].

## Before you start

- **React components, props and JSX** — what a function component is and how JSX describes UI. See [[b4-function-components]], [[b4-props]] and [[b4-jsx]].
- **`.tsx` files** — JSX is only allowed in files with the `.tsx` extension. See [[b2-ts-vs-tsx]].
- **Object types, optional properties and unions** — `{ name: string; size?: number }` and `"a" | "b"`. See [[b2-object-types]], [[b2-optional-properties]] and [[b2-unions]].
- **Generics** — needed for generic components. See [[b2-generics]].
- **`Omit` and intersections** — used when extending HTML attributes. See [[b2-omit]] and [[b2-intersections]].

## The intuition: a component is a typed function

Strip away the angle brackets and JSX is a function call. With the automatic JSX runtime used by React 17 and later, the compiler turns

```tsx
<Greeting name="Ada" excited />
```

into roughly `jsx(Greeting, { name: "Ada", excited: true })`. TypeScript checks that call the way it checks any other: the attributes become an object literal, and that object must be assignable to the type of `Greeting`'s first parameter. Everything in this lesson follows from that one idea. Required props are required properties; optional props are optional properties; an unknown attribute is an excess property; children are a property named `children`.

Where the analogy stops: you never call a component yourself, and React decides when and how often it runs. TypeScript checks the props you *pass*; it knows nothing about render timing, effects or state. Those rules (such as the rules of hooks) come from React and are enforced by linters, not by the type checker.

## How the checking works

Here is a small component and three ways to call it wrongly.

```tsx title="Greeting.tsx"
import { renderToStaticMarkup } from "react-dom/server";

type GreetingProps = {
  name: string;
  excited?: boolean;
};

function Greeting({ name, excited = false }: GreetingProps) {
  return <p>Hello, {name}{excited ? "!" : "."}</p>;
}

console.log(renderToStaticMarkup(<Greeting name="Ada" />));
console.log(renderToStaticMarkup(<Greeting name="Grace" excited />));
```

```output
<p>Hello, Ada.</p>
<p>Hello, Grace!</p>
```

`renderToStaticMarkup` from `react-dom/server` renders a component to an HTML string, which lets these examples run in Node.js and print real output. Now the mistakes:

```tsx
const a = <Greeting />;
const b = <Greeting name="Ada" exited />;
const c = <Greeting name={42} />;
```

```output
error TS2741: Property 'name' is missing in type '{}' but required in type 'GreetingProps'.
error TS2322: Type '{ name: string; exited: true; }' is not assignable to type 'IntrinsicAttributes & GreetingProps'.
  Property 'exited' does not exist on type 'IntrinsicAttributes & GreetingProps'. Did you mean 'excited'?
error TS2322: Type 'number' is not assignable to type 'string'.
```

Each error is the ordinary assignability check from the intuition. The second message mentions `IntrinsicAttributes`: that is a type from React's definitions, intersected with every component's props, which adds the attributes React itself handles, such as `key`. The "Did you mean" suggestion comes from TypeScript's excess property check — the attributes form a fresh object literal, so unknown names are rejected.

### Where the types come from

React's runtime is plain JavaScript; its types live in a separate package, `@types/react` (and `@types/react-dom`), maintained in DefinitelyTyped ([[b2-definitely-typed]]). Keep its major version in step with React's — `@types/react@19` for React 19. That package declares a namespace `React.JSX` which tells TypeScript three things: what a JSX expression evaluates to (`JSX.Element`), which lowercase tags exist and what attributes each takes (`JSX.IntrinsicElements`, so `<button disabled>` is checked against button attributes), and what extra attributes all components accept (`IntrinsicAttributes`). The `jsx` compiler option (`"react-jsx"` for the automatic runtime) tells TypeScript how to compile JSX and where to find that namespace.

### Return types: `ReactNode`, not `JSX.Element`

You rarely need to annotate a component's return type; inference gets it right. When you do — for example on a function that may return `null` — know what a component is *allowed* to return. In `@types/react` 19, a function component may return any `ReactNode`: an element, a string, a number, `null`, `undefined`, a boolean, an array of those, and more. `JSX.Element` is narrower: it is only the result of a JSX expression.

React 19's types also removed the **global** `JSX` namespace that older code relied on. In a React 19 project,

```tsx
const A = (): JSX.Element => <div />;
```

```output
error TS2503: Cannot find namespace 'JSX'.
```

Write `React.JSX.Element` (with `import type * as React from "react"` or `import type { JSX } from "react"`), or better, leave the return type to inference. This is one of the most common errors when upgrading an older codebase.

### Why `React.FC` fell out of favour

Older tutorials write components as `const Greeting: React.FC<Props> = (props) => …`. `React.FC` (short for `FunctionComponent`) still exists, but most teams now write plain functions with an annotated props parameter, for three reasons. Up to `@types/react` 17, `FC` silently added an optional `children` prop to every component, so `<Greeting>oops</Greeting>` compiled even when `Greeting` ignored its children; that was removed in version 18, which means old code that relied on it now fails:

```tsx
import type { FC } from "react";

const B: FC<{ title: string }> = ({ title, children }) => <h1>{title}{children}</h1>;
```

```output
error TS2339: Property 'children' does not exist on type '{ title: string; }'.
```

Second, `FC` makes generic components awkward, because a `const` with a type annotation cannot introduce its own type parameter. Third, a plain function declaration is simply shorter and reads like any other function. `FC` is not wrong; it is just no longer necessary.

## Events

React wraps native browser events in **synthetic events** ([[b4-synthetic-events]]), and `@types/react` gives each kind its own generic type: `MouseEvent<T>`, `KeyboardEvent<T>`, `ChangeEvent<T>`, `FocusEvent<T>` and so on, where `T` is the element the handler is attached to.

The easiest way to get them right is to let **contextual typing** do it. When you write a handler inline, TypeScript knows the expected type from the attribute and types the parameter for you:

```tsx
<input onKeyDown={(e) => console.log(e.key)} />   // e: KeyboardEvent<HTMLInputElement>
```

You only need to name the type when the handler is declared separately:

```tsx
function handleChange(e: ChangeEvent<HTMLInputElement>) {
  setName(e.target.value);   // target typed as the input, so .value is a string
}
```

Two details catch people. First, in `ChangeEvent`, `target` is typed as the element you attached the handler to, which is why `e.target.value` works without a cast; for other events, prefer `e.currentTarget` (always the element with the handler), because `e.target` may be a nested child. Second, for form submission, recent `@types/react` 19 releases deprecate `FormEvent` with a note that it does not correspond to a real event, and recommend `SubmitEvent<HTMLFormElement>` for `onSubmit`; older code and older type versions use `React.FormEvent<HTMLFormElement>`, which still compiles but shows a deprecation warning in editors.

If you are unsure of a handler's type, hover over the attribute in your editor, or write the handler inline and copy the inferred parameter type.

## Generic components

A list, table or select component should work with any item type and still check the callbacks you pass. That is a **generic component**: a function component with a type parameter.

```tsx title="List.tsx"
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type ListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

const users = [{ id: "1", name: "Ada" }, { id: "2", name: "Grace" }];
console.log(renderToStaticMarkup(
  <List items={users} getKey={(u) => u.id} renderItem={(u) => <b>{u.name}</b>} />,
));
```

```output
<ul><li><b>Ada</b></li><li><b>Grace</b></li></ul>
```

TypeScript infers `T` from the `items` attribute — here `{ id: string; name: string }` — and then checks `getKey` and `renderItem` against it, which is why `u` needs no annotation. Writing `renderItem={(u) => u.email}` fails with `Property 'email' does not exist on type '{ id: string; name: string; }'`. In a `.tsx` file, a generic *arrow function* must be written `<T,>(props: ListProps<T>) => …`; the trailing comma stops the parser from reading `<T>` as a JSX tag. Function declarations have no such ambiguity.

## Refs in React 19

A **ref** holds a value across renders without causing re-renders, most often a DOM node ([[b4-refs]]). Two React 19 changes affect how refs are typed.

First, `useRef` now requires an argument. For a DOM ref you write `useRef<HTMLInputElement>(null)`, whose type is `RefObject<HTMLInputElement | null>` — the `| null` is honest, because the ref is `null` until React attaches the element and again after it is removed. Calling `useRef<number>()` with no argument is a compile error (`Expected 1 arguments, but got 0`). The details are in [[b2-hooks-typing]].

Second, `ref` is now an ordinary prop for function components ([[b4-ref-as-prop]]), so `forwardRef` is no longer needed in new code. A component that accepts `ComponentProps<"input">` receives a correctly typed `ref` along with every other input attribute and can pass it straight through. [[b4-forwardref]] explains the older pattern you will still meet in libraries.

## Component Props {#b2-react-component-props}

A component's **props type** is its public interface: the list of inputs a caller can pass, which ones are required, and what type each must have. Designing it well is the main way a component author communicates with every other developer who uses the component, because the editor shows this type on hover and in autocompletion, and the compiler enforces it at every call site.

### Required, optional and defaults

Start with the distinction that matters most: a property without `?` must be passed, a property with `?` may be omitted and is then `undefined` inside the component. Provide defaults with destructuring defaults in the parameter list:

```tsx
function Avatar({ src, size = 32, alt = "" }: { src: string; size?: number; alt?: string }) {
  // inside, size is number (not number | undefined) because of the default
}
```

The default narrows the type inside the function — `size` is `number`, not `number | undefined` — while callers still see it as optional. The older `Avatar.defaultProps = { … }` mechanism was removed for function components in React 19 ([[b4-prop-default-values]]); destructuring defaults are the replacement and are understood by TypeScript.

Use literal unions for props with a fixed set of values — `variant?: "primary" | "ghost"` rather than `variant?: string` — so a typo such as `"primay"` is an error and editors can list the options ([[b2-literal-types]]). Use `type` aliases or `interface` declarations as you prefer; for props the difference rarely matters ([[b2-interface-vs-type-when]]).

### Children

`children` is just a prop that JSX fills from whatever appears between the tags ([[b4-children-prop]]). Declare it explicitly, with the type that says what you accept:

| You want | Type |
|---|---|
| Anything React can render | `children: ReactNode` (or `children?: ReactNode` if optional) |
| Exactly one element | `children: ReactElement` |
| A render function | `children: (state: State) => ReactNode` |
| No children allowed | Omit `children` from the type |

`PropsWithChildren<P>` is a helper that adds `children?: ReactNode` to `P`; it is convenient, but writing the property yourself makes required-versus-optional explicit.

### Reusing native attributes

A design-system `Button` should accept everything a native `<button>` accepts — `disabled`, `aria-label`, `onClick`, `form`, `data-*` attributes — without the author listing them all. `@types/react` exposes the attribute types of every intrinsic element:

- `ComponentPropsWithoutRef<"button">` — all props a `<button>` accepts, except `ref`.
- `ComponentPropsWithRef<"button">` or `ComponentProps<"button">` — the same, including `ref` (in React 19 both include it for intrinsic elements).
- `ComponentProps<typeof MyComponent>` — the props of an existing component, useful for wrapping or for exporting a type you did not name.

Combine them with your own props, and use `Omit` to remove or redefine native props whose meaning you change:

```tsx title="Button.tsx"
import type { ComponentPropsWithoutRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "type"> & {
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
};

function Button({ variant = "primary", type = "button", className, ...rest }: ButtonProps) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...rest} />;
}

console.log(renderToStaticMarkup(
  <Button variant="ghost" aria-label="Close dialog" disabled onClick={() => {}}>
    Close
  </Button>,
));
```

```output
<button type="button" class="btn btn-ghost" aria-label="Close dialog" disabled="">Close</button>
```

Several decisions are encoded here. `Omit<…, "type">` removes the native `type` (which allows `"reset"`) and redefines it as `"button" | "submit"` with a default of `"button"` — a deliberate improvement, because a native button inside a form defaults to `"submit"` and causes accidental submissions. `className` is pulled out so the component can merge it with its own classes rather than letting the caller's value replace them. Everything else is collected by `...rest` and spread onto the element, so `aria-label`, `disabled` and `onClick` pass through fully typed. Passing `variant="danger"` or `type="reset"` is a compile error.

Notice the order of the intersection. If you intersect without `Omit` and both sides define `type`, the property's type becomes the intersection of the two — sometimes `never` — and the error messages become confusing. `Omit` first, then add.

### How wide should the props be?

Extending *all* of a native element's attributes is the right default for low-level primitives (`Button`, `Input`, `Link`) because callers expect native behaviour. For higher-level components it is usually a mistake. A `UserCard` that extends `ComponentProps<"div">` exposes hundreds of props — `onCopy`, `contentEditable`, `dangerouslySetInnerHTML` — which become part of its API that you must now support. Prefer listing the few you mean, or `Pick` a small set: `Pick<ComponentProps<"div">, "className" | "id">`.

### Exporting the type

Export the props type alongside the component (`export type ButtonProps = …`). Callers who wrap or configure your component then reference it directly instead of reaching for `ComponentProps<typeof Button>`, and refactors that change it show up as type errors at every use.

A **polymorphic** component — one with an `as` prop, so `<Text as="label">` renders a label with label attributes — needs a generic over the element type and is significantly harder to type correctly. Most design systems that offer it use a well-tested library helper rather than writing it from scratch.

## Controlled vs Uncontrolled {#b2-controlled-uncontrolled-props}

A form field holds a value — the text in an input, whether a checkbox is ticked. The question is **who owns that value**. In a **controlled** component, the parent owns it: the parent passes `value` and an `onChange` callback, keeps the value in its own state, and the field always displays exactly what it is given. In an **uncontrolled** component, the field owns it: the parent passes at most a starting value with `defaultValue`, and after that the field (the DOM, or the component's own state) keeps track, with the parent reading the value when it needs it — usually through a ref or on form submission ([[b4-controlled-forms]], [[b4-uncontrolled-forms]]).

A useful picture: a controlled field is a puppet — it moves only when the parent pulls the string (`value`) in response to the field's request (`onChange`). An uncontrolled field is a wind-up toy: you set its starting position (`defaultValue`) and it runs by itself. The picture stops working in one respect: an uncontrolled field can still *report* changes through `onChange`; it just does not need the parent's permission to change.

### What React enforces at runtime

For native inputs, React decides the mode from the props. A `value` prop makes the input controlled; `defaultValue` (or nothing) makes it uncontrolled. If you pass `value` without `onChange`, the user cannot type into the field, and React warns in development:

```tsx title="readonly-warning.tsx"
import { renderToStaticMarkup } from "react-dom/server";
console.log(renderToStaticMarkup(<input value="Ada" />));
```

```output
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
<input value="Ada"/>
```

The warning is printed by React's development build to `stderr` (via `console.error`); production builds stay silent. React also warns, in the browser, when a field switches modes during its life — typically because `value` started as `undefined` (uncontrolled) and later became a string ("A component is changing an uncontrolled input to be controlled"). That warning comes from client-side re-renders and was not reproduced here; the common cause is initial state of `undefined`, and the fix is to start with `""`. Both warnings point at the same rule: **pick one mode per field and keep it**.

TypeScript's built-in input types do not enforce that rule: `<input value="x" defaultValue="y" />` compiles, because each attribute is independently optional. Your own components can do better.

### Typing a field that supports both modes

Reusable field components usually support both modes, like native inputs do, and the type should allow each mode while rejecting nonsense combinations: `value` without `onChange`, or `value` together with `defaultValue`. Model the two modes as two object types and take their union:

```tsx title="TextField.tsx"
import { useState, type ChangeEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type ControlledProps = {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: never;
};
type UncontrolledProps = {
  defaultValue?: string;
  onChange?: (value: string) => void;
  value?: never;
};
type TextFieldProps = (ControlledProps | UncontrolledProps) & { label: string };

function TextField(props: TextFieldProps) {
  const [inner, setInner] = useState(props.defaultValue ?? "");
  const isControlled = props.value !== undefined;
  const value = isControlled ? props.value : inner;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInner(e.target.value);
    props.onChange?.(e.target.value);
  }
  return (
    <label>
      {props.label} <input value={value} onChange={handleChange} />
    </label>
  );
}

console.log(renderToStaticMarkup(<TextField label="Name" value="Ada" onChange={() => {}} />));
console.log(renderToStaticMarkup(<TextField label="City" defaultValue="London" />));
console.log(renderToStaticMarkup(<TextField label="Notes" />));
```

```output
<label>Name <input value="Ada"/></label>
<label>City <input value="London"/></label>
<label>Notes <input value=""/></label>
```

And the misuse cases:

```tsx
const a = <TextField label="Name" value="Ada" />;
const b = <TextField label="Name" value="Ada" defaultValue="x" onChange={() => {}} />;
```

```output
error TS2322: Type '{ label: string; value: string; }' is not assignable to type 'IntrinsicAttributes & TextFieldProps'.
  Property 'onChange' is missing in type '{ label: string; value: string; }' but required in type 'ControlledProps'.
error TS2322: Type '{ label: string; value: string; defaultValue: string; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & TextFieldProps'.
  Types of property 'defaultValue' are incompatible.
    Type 'string' is not assignable to type 'undefined'.
```

How the type works: `defaultValue?: never` in the controlled branch means "this property may only be absent (or `undefined`)", because no value has type `never`. Passing `value` rules out the uncontrolled branch (whose `value` is `never`), leaving the controlled branch, which requires `onChange` and forbids `defaultValue`. The `?: never` trick is the general technique for mutually exclusive props, explored fully in [[b2-mutually-exclusive-props]].

How the implementation works: the component decides its mode from whether `value` is defined. In controlled mode it renders the parent's value and only *reports* changes; in uncontrolled mode it keeps its own state, seeded from `defaultValue`, and also reports changes so the parent can observe them. The inner `<input>` is always controlled by `TextField` — "uncontrolled" describes the relationship between `TextField` and *its* parent. Note `onChange` is typed as `(value: string) => void` rather than receiving the raw event: a component's callback should speak the component's language, and for a number field it would be `(value: number) => void` after parsing.

Because `isControlled` is computed on every render, a parent that switches from `value="x"` to `value={undefined}` flips the component's mode mid-life — the same bug React warns about for native inputs. Libraries that implement this pattern usually record the mode on the first render (for example in a ref) and warn if it changes. That logic is often extracted into a `useControllableState` hook.

### Uncontrolled fields and refs

The simplest uncontrolled field is a native input read through a ref:

```tsx
const emailRef = useRef<HTMLInputElement>(null);   // RefObject<HTMLInputElement | null>
// later, on submit:
const email = emailRef.current?.value ?? "";
```

The optional chaining is required because the ref's type includes `null`. Many React 19 forms skip refs entirely and read values from the `FormData` passed to a form action. Some inputs are uncontrolled by nature: `<input type="file">` cannot have its value set by script for security reasons, so it is always uncontrolled in React.

### Choosing a mode

Choose **controlled** when the parent must react to every keystroke — live validation, formatting as you type, enabling a submit button, syncing with other fields or the URL. Choose **uncontrolled** for simple forms read once on submit, for very large forms where re-rendering on every keystroke is measurable, and for file inputs. Form libraries such as React Hook Form are uncontrolled at their core for performance and offer controlled adapters for custom widgets ([[b4-form-libraries]]).

## Worked example: a typed search box

This example combines the ideas: a component that extends native input attributes, removes the ones it redefines, supports both modes, and reports a typed value.

```tsx title="SearchBox.tsx"
import { useState, type ComponentPropsWithoutRef, type ChangeEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type NativeInput = Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange" | "type"
>;
type Mode =
  | { query: string; onQueryChange: (q: string) => void; defaultQuery?: never }
  | { defaultQuery?: string; onQueryChange?: (q: string) => void; query?: never };
type SearchBoxProps = NativeInput & Mode;

function SearchBox({ query, defaultQuery, onQueryChange, ...input }: SearchBoxProps) {
  const [inner, setInner] = useState(defaultQuery ?? "");
  const current = query ?? inner;
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value.trimStart();
    if (query === undefined) setInner(next);
    onQueryChange?.(next);
  }
  return <input type="search" {...input} value={current} onChange={handleChange} />;
}

console.log(renderToStaticMarkup(
  <SearchBox placeholder="Search users" aria-label="Search users" defaultQuery="ada" />,
));
console.log(renderToStaticMarkup(
  <SearchBox name="q" query="grace" onQueryChange={(q) => console.log(q.length)} />,
));
```

```output
<input type="search" placeholder="Search users" aria-label="Search users" value="ada"/>
<input type="search" name="q" value="grace"/>
```

`NativeInput` keeps every input attribute except the four the component redefines, so `placeholder`, `name` and `aria-label` work without being listed. `Mode` is the controlled/uncontrolled union, using component-specific names (`query` rather than `value`) so they cannot clash with native attributes. Destructuring pulls the mode props out *before* spreading, so they never reach the DOM as unknown attributes. The native attributes are spread before `value` and `onChange`, so the component's own handlers always win.

## In real systems

- **Design systems** export primitives (`Button`, `Input`, `Select`) whose props extend native attributes, and higher-level components with small, explicit props. Their published `.d.ts` files are the documentation most developers actually read.
- **Component libraries** such as Radix UI and Headless UI support controlled and uncontrolled usage for almost every stateful component (`open`/`defaultOpen`, `value`/`defaultValue`), with types that pair each controlled prop with its change callback.
- **Next.js and other React 19 frameworks** add Server Components, whose props must be serialisable and which may be `async` functions; `@types/react` 19 allows a component to return a `Promise<ReactNode>` for that reason ([[b4-server-components]]).
- **Code review** catches `any` in props, `React.FC` in new code, and over-wide prop types; linting with `@typescript-eslint` and `eslint-plugin-react-hooks` covers what the compiler cannot ([[b2-eslint-typescript]]).

## Trade-offs and alternatives

Typing React components costs little — mostly one props type per component — and pays back in safe refactors: rename a prop and the compiler lists every call site. The costs appear at the edges. Advanced patterns (polymorphic `as` props, deeply generic tables, higher-order components) produce complex types and slow error messages. Library types sometimes lag React releases, which is why upgrades such as React 19 brought type-only breaking changes (`JSX` namespace, `useRef` arguments). And types describe props, not behaviour: a component can be perfectly typed and still break the rules of hooks.

The historical alternative, runtime `propTypes`, is gone: React 19 removed `propTypes` checking, and declarations are silently ignored. TypeScript for component contracts, plus runtime validation where untrusted data enters ([[b2-type-safe-apis]]), is the standard replacement.

## Common mistakes

- **Using the global `JSX.Element` in React 19.** It no longer exists. Fix: `React.JSX.Element`, `ReactNode`, or no annotation.
- **Relying on `React.FC` for `children`.** Since `@types/react` 18 it adds none. Fix: declare `children: ReactNode` explicitly.
- **Typing `children` as `JSX.Element`.** That rejects strings, numbers and arrays. Fix: `ReactNode` unless you really need one element.
- **Annotating handlers with `any`.** You lose `e.target.value` typing. Fix: write the handler inline, or use `ChangeEvent<HTMLInputElement>` and friends.
- **Intersecting native props without `Omit`.** Conflicting property types turn into `never`. Fix: `Omit` the keys you redefine before adding your own.
- **Passing `value` without `onChange`.** The field becomes read-only and React warns. Fix: add `onChange`, use `defaultValue`, or set `readOnly`.
- **Starting controlled state as `undefined`.** The field flips from uncontrolled to controlled. Fix: initialise with `""`.

## Interview perspective

**"How do you type a component's props?"** A good answer writes a props type with required and optional fields, destructures with defaults, declares `children: ReactNode` when needed, and explains why plain functions are preferred to `React.FC`. Mention literal unions for variants.

**"How would you make a `Button` accept all native button props?"** `ComponentPropsWithoutRef<"button">` (or `ComponentProps` in React 19 when you want `ref`), `Omit` the props you redefine, spread `...rest` onto the element, merge `className`. Follow-up: when is extending all native props a bad idea?

**"Controlled versus uncontrolled — what is the difference and how do you type it?"** Explain ownership of the value, React's runtime warnings, and a union with `?: never` so `value` requires `onChange` and excludes `defaultValue`. Strong candidates mention mode switching as a bug and `useControllableState`.

**"What changed in React 19 for TypeScript users?"** Global `JSX` namespace removed, `useRef` requires an argument and returns a mutable `RefObject`, `ref` is a regular prop, `defaultProps` removed for function components, components may return `Promise<ReactNode>` for Server Components.

## Practice

1. Write a `Card` component with a required `title`, optional `footer: ReactNode`, and `children`. Make `title` a literal union of three heading levels via a `level?: 2 | 3 | 4` prop.
2. Build `Link` props that extend `ComponentPropsWithoutRef<"a">`, require `href`, and add `external?: boolean` which sets `target` and `rel`. Make it impossible to pass `target` directly.
3. Write a generic `Select<T>` with `options: readonly T[]`, `getLabel`, `getValue`, and controlled/uncontrolled `value: T` / `defaultValue: T`.
4. Extract the mode logic from `TextField` into `useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void)`, and make it warn once if the mode changes between renders.
5. Take an older component file that uses `React.FC`, `JSX.Element` and `defaultProps`, and migrate it to React 19 types.

```quiz
Q: Why does `<Greeting name="Ada" exited />` fail to compile when `GreetingProps` has `excited?: boolean`?
- [ ] JSX attributes must be listed in alphabetical order
- [x] JSX attributes form a fresh object literal, so the unknown `exited` property is rejected by the excess property check
- [ ] Boolean attributes must be written `exited={true}`
- [ ] React reserves the name `exited`
> TypeScript checks JSX like a function call whose argument is an object literal built from the attributes. Fresh object literals may not contain properties the target type does not declare, which is also where the "Did you mean 'excited'?" hint comes from. The shorthand `exited` is legal syntax for `exited={true}`.
```

```quiz
Q: A `TextField` has props `({ value: string; onChange: (v: string) => void; defaultValue?: never } | { defaultValue?: string; value?: never; onChange?: (v: string) => void })`. Which usage compiles?
- [ ] `<TextField value="a" />`
- [ ] `<TextField value="a" defaultValue="b" onChange={f} />`
- [x] `<TextField defaultValue="b" />`
- [ ] None of them; unions cannot be used as props
> With `value` present, only the controlled branch can match, and it requires `onChange` and forbids `defaultValue` (its type is `never`). `defaultValue` alone matches the uncontrolled branch, whose other properties are optional.
```

```quiz
Q: In a React 19 project, what type does `useRef<HTMLDivElement>(null)` return?
- [ ] `MutableRefObject<HTMLDivElement>`
- [ ] `RefObject<HTMLDivElement>` with a readonly `current`
- [x] `RefObject<HTMLDivElement | null>`
- [ ] `HTMLDivElement | null`
> In `@types/react` 19, `useRef` with a `null` initial value returns `RefObject<T | null>`, and `current` is mutable. The `| null` reflects reality: the ref is `null` until React attaches the element. `MutableRefObject` and the readonly `RefObject` distinction belong to React 18's types.
```

## Quick revision {#quick-revision}

- JSX is a checked call: attributes form an object literal that must match the props type; `IntrinsicAttributes` adds `key`.
- Types come from `@types/react` (match React's major version); `jsx: "react-jsx"` for the automatic runtime.
- React 19: no global `JSX` (use `React.JSX.Element` or `ReactNode`); components may return any `ReactNode` or a `Promise<ReactNode>`.
- Prefer `function C(props: Props)` to `React.FC`; `FC` adds no `children` since `@types/react` 18.
- Events: inline handlers are typed contextually; separate handlers use `ChangeEvent<HTMLInputElement>`, `MouseEvent<HTMLButtonElement>`; `FormEvent` is deprecated in recent 19.x types in favour of `SubmitEvent`.
- Generic components: `function List<T>(props: ListProps<T>)`; arrow form in `.tsx` is `<T,>`.
- Refs: `useRef<HTMLInputElement>(null)` → `RefObject<HTMLInputElement | null>`; `ref` is a normal prop in React 19.
- Props: required vs `?`; defaults by destructuring (`defaultProps` removed for function components); literal unions for variants; `children: ReactNode`.
- Native attributes: `Omit<ComponentPropsWithoutRef<"button">, "type"> & { … }`, merge `className`, spread `...rest`; do not extend all attributes on high-level components.
- Controlled = parent owns `value` + `onChange`; uncontrolled = `defaultValue`, field owns state; never switch modes; `value` without `onChange` warns.
- Type both modes as a union with `?: never` on the opposite branch's props.

## Key takeaways {#key-takeaways}

- TypeScript checks JSX the same way it checks a function call, so a component's props type is its enforced public API.
- Write components as plain functions with an annotated props parameter, declare `children` explicitly, and let inference type the return value and inline handlers.
- Build primitives on `ComponentPropsWithoutRef<…>` with `Omit` for redefined props; keep higher-level components' props small and explicit.
- Controlled and uncontrolled are about who owns the value; pick one mode per field, and use a union with `never` to make the type reject mixed usage.
- React 19's types changed several long-standing patterns — the global `JSX` namespace, `useRef` without an argument, `defaultProps` — so check the version before copying older examples.
