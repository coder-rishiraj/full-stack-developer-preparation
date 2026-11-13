---
summary: "`.ts` files hold TypeScript; `.tsx` files hold TypeScript plus JSX, the HTML-like syntax React components use. The extension tells the parser how to read `<`, which changes what is legal in the file. You will learn why two extensions exist, what the `jsx` option emits, and the two syntax traps that catch people in `.tsx` files."
difficulty: beginner
minutes: 30
objectives:
  - Explain why TypeScript needs a separate `.tsx` extension for JSX and what the parser does differently in each
  - Choose the right extension for components, hooks, utilities, tests and declaration files
  - Configure the `jsx` compiler option and predict what `react-jsx`, `react`, `preserve` and `react-jsxdev` emit
  - Write generic arrow functions and type assertions that parse correctly in `.tsx` files
  - Type a React component's props and read the errors the checker reports for misuse
---

## Introduction

Open any React project written in TypeScript and you will see two extensions side by side: `Button.tsx`, `useCart.ts`, `formatPrice.ts`, `App.tsx`. The rule of thumb is simple — files that contain JSX use `.tsx`, everything else uses `.ts` — but the reason behind it is worth understanding, because it explains a couple of errors that otherwise look baffling.

**JSX** is a syntax extension that lets you write markup-like expressions such as `<button onClick={save}>Save</button>` inside JavaScript. It is not part of the ECMAScript standard; a compiler turns each JSX element into a function call before the code runs. TypeScript supports JSX, but only in files with the `.tsx` extension. In a `.ts` file, `<` keeps the meaning it has always had in TypeScript, and that meaning conflicts with JSX.

This lesson explains that conflict, how the compiler emits JSX, how to configure it for React and other libraries, and the small syntax adjustments `.tsx` files require. The type system itself is identical in both kinds of file; only parsing and emit differ. JSX as a React concept is taught in [[b4-jsx]]; typing components in depth is in [[b2-react-typescript]].

## Before you start

- **What TypeScript is and how `tsc` compiles** — [[b2-what-is-typescript]] and [[b2-tsc-compilation]], including the `module` and `target` options.
- **JSX basics** — that `<div className="x">{value}</div>` describes UI and is compiled to function calls. See [[b4-jsx]] and [[b4-jsx-transformation]].
- **Type assertions** at a basic level: `value as Type` tells the checker to treat a value as a type. See [[b2-type-assertions]].

## The intuition

Imagine a document where the symbol `/` sometimes means "divided by" and sometimes means "or", depending on context. A careful reader can usually tell, but a machine reading left to right, one symbol at a time, needs a rule. If the rule is set per document — "in this kind of document, `/` always means 'or' when it could" — the machine never has to guess.

The `<` character is TypeScript's `/`. In a `.ts` file, `<` can start a type argument list or an old-style type assertion. In JSX, `<` starts an element. Both readings are plausible in the same position, so TypeScript decides by file extension: `.tsx` means "read `<` as JSX where possible". That single decision explains everything in this lesson.

## Why `<` is ambiguous

Before JSX support arrived, TypeScript already used angle brackets in expressions for two purposes:

- **Generic type parameters and arguments**: `function first<T>(items: T[])`, `const id = <T>(x: T) => x`, `useState<string>("")`.
- **Angle-bracket type assertions**: `<number>value`, the original syntax for what is now written `value as number`.

Now look at an expression such as `<T>(x: T) => x`. Read as TypeScript, it is a generic arrow function. Read as JSX, it begins an element named `T` whose children are `(x: T) => x`, and a closing `</T>` should follow. A parser reading left to right cannot know which was intended until much later, if at all. The same goes for `<number>value`: a type assertion, or an element named `number`?

The TypeScript team resolved this in TypeScript 1.6 (2015) by introducing `.tsx`. In `.tsx` files, JSX wins: angle-bracket assertions are not allowed at all, and generic arrow functions need a small disambiguation. The `as` assertion syntax was introduced in the same release precisely so that assertions would still be possible in `.tsx`. In `.ts` files, nothing changed and JSX is simply not recognised.

## What happens with the wrong extension

Put JSX in a `.ts` file:

```typescript title="widget.ts"
export const el = <div>Hi</div>;
```

```output
widget.ts(1,27): error TS1161: Unterminated regular expression literal.
```

The message seems unrelated to JSX, which is why it confuses people. Without JSX parsing, `<div>Hi<` is read as comparisons and type syntax, and then `/div>…` looks like the start of a regular expression literal (JavaScript regexes are written `/pattern/`) that is never closed. Whenever you see strange errors near markup in a `.ts` file, check the extension first. The fix is to rename the file to `.tsx`.

The reverse problem — TypeScript-only syntax in a `.tsx` file — produces errors too:

```typescript title="helpers.tsx"
const first = <T>(items: T[]): T | undefined => items[0];
const port = <number>JSON.parse("3000");
```

```output
helpers.tsx(1,16): error TS17008: JSX element 'T' has no corresponding closing tag.
helpers.tsx(1,47): error TS1382: Unexpected token. Did you mean `{'>'}` or `&gt;`?
helpers.tsx(2,15): error TS17008: JSX element 'number' has no corresponding closing tag.
helpers.tsx(3,1): error TS1005: '</' expected.
```

The parser has read `<T>` and `<number>` as opening JSX tags and is waiting for `</T>` and `</number>`. Both lines are perfectly valid in a `.ts` file.

## Writing generics and assertions in `.tsx`

The fixes are small, and once known they become habit:

```typescript title="helpers.tsx"
const first = <T,>(items: T[]): T | undefined => items[0];
const firstAlt = <T extends unknown>(items: T[]): T | undefined => items[0];
const port = JSON.parse("3000") as number;
console.log(first(["a", "b"]), firstAlt([1]), port + 1);
```

```output
a 1 3001
```

`<T,>` — a trailing comma — cannot start a JSX element, so the parser knows it is a type parameter list. `<T extends unknown>` works for the same reason; any constraint will do, and if you already have a real constraint (`<T extends { id: string }>`) there is no ambiguity in the first place. For assertions, use `as`, which works in both kinds of file — most style guides require `as` everywhere for consistency.

Generic **function declarations** have no ambiguity at all, because the `<T>` comes after a name: `function List<T>(props: ListProps<T>)` is fine in `.tsx`. This is one reason many React codebases write components as function declarations.

## What the compiler does with JSX: the `jsx` option

In a `.tsx` file, the type checker understands JSX — it checks element names, props and children — and the emitter must turn JSX into something a JavaScript engine can run. The **`jsx`** compiler option decides how. Take this component:

```typescript title="Badge.tsx"
type BadgeProps = {
  label: string;
  count: number;
};

export function Badge({ label, count }: BadgeProps) {
  return (
    <span className="badge">
      {label}: {count}
    </span>
  );
}
```

With `"jsx": "react-jsx"` — the setting for React 17 and later, and what `tsc --init` writes in TypeScript 6.0 — the output imports a helper from the **automatic runtime**:

```javascript title="Badge.js (jsx: react-jsx)"
import { jsxs as _jsxs } from "react/jsx-runtime";
export function Badge({ label, count }) {
    return (_jsxs("span", { className: "badge", children: [label, ": ", count] }));
}
```

The compiler added the import itself, which is why modern React files do not need `import React from "react"` just to use JSX. Children become a `children` prop. (`jsxs` is used when there are several static children; `jsx` when there is one.)

With `"jsx": "react"`, the **classic runtime**, each element becomes a `React.createElement` call, and you must have `React` in scope in every file that uses JSX:

```javascript title="Badge.js (jsx: react)"
export function Badge({ label, count }) {
    return (React.createElement("span", { className: "badge" },
        label,
        ": ",
        count));
}
```

With `"jsx": "preserve"`, types are removed but the JSX is left untouched, and the output file gets the `.jsx` extension, so another tool (Babel, a framework compiler) can transform it later:

```javascript title="Badge.jsx (jsx: preserve)"
export function Badge({ label, count }) {
    return (<span className="badge">
      {label}: {count}
    </span>);
}
```

`"react-jsxdev"` is the development variant of the automatic runtime: it imports `jsxDEV` from `react/jsx-dev-runtime` and passes file names and line numbers, which React uses for better warnings. `"react-native"` behaves like `preserve` but keeps the `.js` extension.

| `jsx` value | Output | Use when |
|---|---|---|
| `react-jsx` | `_jsx()` calls, auto-imported from `react/jsx-runtime` | React 17+ (default choice) |
| `react-jsxdev` | `_jsxDEV()` with source locations | Development builds |
| `react` | `React.createElement()` | Legacy React (16 and earlier) |
| `preserve` | JSX unchanged, `.jsx` file | Another tool transforms JSX later |
| `react-native` | JSX unchanged, `.js` file | React Native's bundler |

In a Vite or Next.js project, the bundler performs the actual transform, but `tsc` still reads the `jsx` setting to type-check `.tsx` files, so it must be set. Other JSX libraries — Preact, Solid, Emotion — are supported through **`jsxImportSource`**: with `"jsxImportSource": "preact"` and `react-jsx`, the auto-import becomes `preact/jsx-runtime`. A single file can override it with a `/** @jsxImportSource @emotion/react */` comment at the top. JSX is therefore not tied to React; React is just the most common consumer.

## Type checking inside JSX

Because `.tsx` is fully typed, JSX elements are checked like function calls. A component's props type is the parameter type of the function, and intrinsic elements such as `div` are checked against a large interface (`JSX.IntrinsicElements`) shipped by `@types/react`:

```typescript title="Usage.tsx"
import { Badge } from "./Badge";

export function List<T>({ items, render }: { items: T[]; render: (item: T) => string }) {
  return <ul>{items.map((item, i) => <li key={i}>{render(item)}</li>)}</ul>;
}

export const usage = (
  <>
    <Badge label="Inbox" count={3} />
    <Badge label="Spam" count="many" />
    <List items={[1, 2]} render={(n) => n.toFixed(1)} />
  </>
);
```

```output
Usage.tsx(10,25): error TS2322: Type 'string' is not assignable to type 'number'.
```

The second `Badge` passes a string where `count` must be a number. A missing required prop, a misspelled prop name, or an unknown attribute on a `<div>` would all be reported the same way. The `List` usage shows generics flowing through JSX: from `items={[1, 2]}` the compiler infers `T = number`, so `n` in `render` is a `number` and `n.toFixed(1)` is accepted. Note also that the generic component is a function declaration, so `<T>` needs no trailing comma. Typing props and children in depth is covered in [[b2-react-component-props]].

## Choosing extensions in a project

| File contains | Extension | Example |
|---|---|---|
| A component that returns JSX | `.tsx` | `Button.tsx`, `App.tsx` |
| A hook with no JSX | `.ts` | `useDebounce.ts` |
| Utilities, API clients, types, reducers | `.ts` | `formatPrice.ts`, `api.ts` |
| A test that renders components | `.tsx` | `Button.test.tsx` |
| A test of plain functions | `.ts` | `formatPrice.test.ts` |
| Only type declarations | `.d.ts` | `env.d.ts`, `global.d.ts` |
| Node.js ES module / CommonJS module | `.mts` / `.cts` | `server.mts`, `config.cts` |

The rule is about *content*, not about being "React-related": a hook is React code but has no JSX, so it is `.ts`. Using `.ts` wherever possible keeps the more convenient `.ts` syntax available. Making every file `.tsx` does work, but costs you angle-bracket generic arrows and invites the trailing-comma surprise in files that never needed JSX. There is no `.mtsx` or `.ctsx`; JSX files rely on the package's `"type"` field for their module format.

The same split exists in JavaScript (`.js` and `.jsx`), though JavaScript tools are more relaxed about it: many bundlers accept JSX in `.js` files. TypeScript is strict because its own syntax collides with JSX.

## In real systems

A React codebase generated by Vite's `react-ts` template has `src/main.tsx` and `src/App.tsx`, a `tsconfig` with `"jsx": "react-jsx"`, `moduleResolution: "bundler"`, and `noEmit` (Vite does the emitting). Next.js projects use `"jsx": "preserve"` because Next's own compiler transforms the JSX. Design-system libraries compile their `.tsx` components with `react-jsx` and publish `.js` plus `.d.ts`, so consumers do not need any JSX configuration at all. In each case, `.ts` files hold the logic that is easiest to test in isolation — hooks, state reducers, formatting, API calls — and `.tsx` files hold the rendering.

## Common mistakes

**JSX in a `.ts` file.** Produces parse errors such as "Unterminated regular expression literal". Rename to `.tsx`.

**`<T>(x: T) => …` in a `.tsx` file.** Parsed as a JSX tag. Write `<T,>` or add a constraint, or use a function declaration.

**`<Type>value` assertions in `.tsx`.** Not allowed. Use `value as Type`.

**`jsx` not set or set to `react` with React 17+.** With `react`, every file must import `React` or you get "This JSX tag requires 'React' to be in scope". Use `react-jsx`.

**Assuming `.tsx` means "React file".** The extension is about JSX syntax. Hooks and utilities stay `.ts`; Preact and Solid components are `.tsx` too.

## Interview perspective

**"Why does TypeScript have both `.ts` and `.tsx`?"** Because `<` is ambiguous: in TypeScript it starts generic parameters and angle-bracket assertions, in JSX it starts elements. The extension tells the parser which reading to prefer. Follow up with the consequences: no `<T>value` assertions in `.tsx`, and generic arrows need `<T,>`.

**"What does `jsx: react-jsx` do?"** It compiles JSX to calls to `jsx`/`jsxs` imported automatically from `react/jsx-runtime` (React 17+), so files need no `React` import. Compare with `react` (`React.createElement`) and `preserve` (left for another tool).

**"Can you use JSX without React?"** Yes, via `jsxImportSource` (Preact, Solid, Emotion) or a custom factory; JSX is a syntax, not a library.

## Practice

1. Create `Card.ts` containing a component that returns JSX. Read the error, then rename to `.tsx` and confirm it compiles.
2. In a `.tsx` file, write a generic arrow function `last` that returns the last item of an array. Try `<T>`, then `<T,>`, then a function declaration.
3. Compile one component with `jsx` set to `react-jsx`, `react` and `preserve`, and describe the differences in the output files (content and extension).
4. Sort ten files from a React project you know into `.ts` and `.tsx` using the content rule, and explain each choice.

```quiz
Q: Why does `const id = <T>(x: T) => x;` fail to compile in a `.tsx` file but work in a `.ts` file?
- [ ] Generics are not supported in `.tsx` files
- [ ] Arrow functions cannot be generic in TypeScript
- [x] In `.tsx`, `<T>` is parsed as the opening tag of a JSX element named `T`
- [ ] `.tsx` files require all functions to be declared with `function`
> The extension changes how `<` is parsed. In `.tsx`, JSX takes priority, so `<T>` looks like an element. Generics work fine in `.tsx`; writing `<T,>` or `<T extends unknown>` removes the ambiguity, and function declarations never had it.
```

```quiz
Q: A team upgrades to React 18 and wants to stop writing `import React from "react"` in every component file. Which `jsx` setting enables that?
- [ ] `preserve`
- [ ] `react`
- [x] `react-jsx`
- [ ] `react-native`
> `react-jsx` uses the automatic runtime: the compiler inserts an import from `react/jsx-runtime` itself. `react` emits `React.createElement`, which needs `React` in scope. `preserve` and `react-native` leave JSX for another tool.
```

```quiz
Q: A custom hook `useCart` contains no JSX. Which extension should its file use?
- [x] `.ts`, because the extension depends on whether the file contains JSX
- [ ] `.tsx`, because hooks are React code
- [ ] `.jsx`, because it is used by components
- [ ] `.d.ts`, because it exports types
> The extension controls parsing, not which library the code belongs to. Without JSX, `.ts` is correct and keeps angle-bracket syntax unambiguous. `.d.ts` files hold only declarations, never implementations.
```

## Quick revision {#quick-revision}

- `.ts` = TypeScript without JSX; `.tsx` = TypeScript + JSX. Same type system, different parsing of `<`.
- `<` in TypeScript: generics and old `<Type>value` assertions; in JSX: elements. The extension removes the ambiguity (since TypeScript 1.6, which also added `as`).
- In `.tsx`: no `<Type>value` (use `as`); generic arrows need `<T,>` or a constraint; function declarations are fine.
- JSX in `.ts` gives misleading parse errors such as TS1161 "Unterminated regular expression literal".
- `jsx` option: `react-jsx` (automatic runtime, React 17+), `react-jsxdev`, `react` (`React.createElement`, needs `React` in scope), `preserve` (keeps JSX, `.jsx` output), `react-native`.
- `jsxImportSource` (or a `@jsxImportSource` comment) switches the runtime to Preact, Emotion, Solid and others.
- JSX is type-checked: props against the component's parameter type, intrinsic elements via `JSX.IntrinsicElements`.
- Choose by content: components and rendering tests `.tsx`; hooks, utilities, types `.ts`; declarations `.d.ts`.

## Key takeaways {#key-takeaways}

- The two extensions exist because TypeScript's angle-bracket syntax and JSX collide; the extension tells the parser which to prefer.
- Use `.tsx` only for files that contain JSX, and `as` for assertions everywhere.
- The `jsx` option decides what JSX compiles into; `react-jsx` is the modern React choice.
- Type checking works the same in both kinds of file, and JSX props are checked like function arguments.
