---
summary: An implementation exercise in typing React props so that conflicting combinations are compile errors. You will build a Button that is either a link or an action (never both), a TextInput that is either controlled or uncontrolled, and a reusable XOR helper, and learn why a plain union is not enough and how optional never fields close the gap.
difficulty: intermediate
minutes: 40
objectives:
  - Explain why a plain union of props types still accepts both sets of props at once
  - Implement mutually exclusive props using optional never fields
  - Narrow exclusive props inside a component with an undefined check, and explain why the in operator fails here
  - Build a generic XOR<A, B> helper with a mapped type
  - Handle the "neither" case and the explicit-undefined loophole deliberately
---

## Introduction

Some components have **modes**. A `Button` in a design system often renders as a link (`<a href>`) when it navigates and as a real `<button>` when it performs an action. A text input is either **controlled** — React state owns the value, passed through `value` and `onChange` — or **uncontrolled**, where the DOM owns the value and you only provide a starting `defaultValue`. In each case some props belong to one mode only, and passing props from both modes is a bug: an `<a>` with a `disabled` attribute is not actually disabled, and React warns at runtime when an input receives both `value` and `defaultValue`, because it cannot honour both.

Runtime warnings arrive late — in the browser console, if anyone is looking. The goal of this exercise is to move those mistakes to compile time: write props types so that `<Button href="/docs" onClick={save}>` and `<TextInput value={v} defaultValue="x" />` do not type-check. The technique is a union of props types in which each mode explicitly **forbids** the other mode's props using optional `never` fields.

This page is the hands-on implementation. The general pattern is introduced in [[b2-mutually-exclusive-props]], and the React side of controlled and uncontrolled inputs is explained in [[b2-controlled-uncontrolled-props]] and [[b4-controlled-component-pattern]].

## Before you start

- **Typing component props** — props are a function parameter typed with an object type. See [[b2-react-component-props]].
- **Unions and narrowing** — a union value must be narrowed before mode-specific fields are used. See [[b2-unions]] and [[b2-narrowing]].
- **Optional properties and `never`** — `x?: T` means the key may be absent; `never` is the type with no values. See [[b2-optional-properties]] and [[b2-never]].
- **Mapped types** — needed for the reusable helper at the end. See [[b2-mapped-types]].

## The intuition

Think of a form with two sections and a rule printed at the top: "Fill in section A *or* section B, not both." A plain union of types is like printing the two sections without the rule — the form accepts entries in both. Optional `never` fields are the rule written into each section: section A has boxes labelled "section B fields — leave blank", and the only value that fits in those boxes is nothing at all.

## Why a plain union is not enough

The obvious first attempt is a union:

```typescript title="loose.ts"
type LinkProps = { href: string };
type ActionProps = { onClick: () => void };
type Loose = LinkProps | ActionProps;

const both: Loose = { href: '/home', onClick: () => {} };   // compiles
const neither: Loose = {};                                  // error
```

Only `neither` fails:

```output
loose.ts(5,7): error TS2322: Type '{}' is not assignable to type 'Loose'.
```

`both` compiles because TypeScript's types are **structural** and **open**: an object with extra properties is still a valid `LinkProps`. Object literals normally get an extra check — **excess property checking**, which rejects unknown keys — but for a union, a key counts as "known" if it appears in *any* member. `onClick` is known to `ActionProps`, so it is not excess, and `{ href, onClick }` matches `LinkProps` with an extra field. The union says "at least one of these shapes", not "exactly one".

## The fix: forbid the other mode's keys

Make each member say explicitly that the other member's keys must be absent. A property typed `?: never` can be left out — it is optional — but cannot hold any value, because no value has type `never`. (Under default settings, `undefined` is still accepted for an optional property; that loophole is discussed below.)

```typescript
type LinkProps = { href: string; onClick?: never };
type ActionProps = { onClick: () => void; href?: never };
```

Now `{ href, onClick }` fails both members: it is not a `LinkProps` because `onClick` must be absent, and not an `ActionProps` because `href` must be absent. And the union has gained something subtle: in every member, both `href` and `onClick` are *declared*. That matters for narrowing.

## Worked example: a link-or-action Button

Here is a realistic design-system `Button`. Props shared by both modes go in `BaseProps`; each mode adds its own props and forbids the other mode's.

```tsx title="Button.tsx"
import type { MouseEventHandler, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

type BaseProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

type LinkButtonProps = BaseProps & {
  href: string;
  target?: '_self' | '_blank';
  // Forbidden in link mode: these only make sense on a <button>.
  onClick?: never;
  type?: never;
  disabled?: never;
};

type ActionButtonProps = BaseProps & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  disabled?: boolean;
  // Forbidden in action mode: these only make sense on an <a>.
  href?: never;
  target?: never;
};

export type ButtonProps = LinkButtonProps | ActionButtonProps;

export function Button(props: ButtonProps) {
  const className = `btn btn-${props.variant ?? 'primary'}`;
  if (props.href !== undefined) {
    const { href, target, children } = props;
    const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
    return <a className={className} href={href} target={target} rel={rel}>{children}</a>;
  }
  const { onClick, type = 'button', disabled = false, children } = props;
  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

console.log(renderToStaticMarkup(<Button href="/docs" target="_blank">Docs</Button>));
console.log(
  renderToStaticMarkup(
    <Button onClick={() => {}} variant="secondary" disabled>Save</Button>,
  ),
);
```

```output
<a class="btn btn-primary" href="/docs" target="_blank" rel="noopener noreferrer">Docs</a>
<button class="btn btn-secondary" type="button" disabled="">Save</button>
```

This was compiled with TypeScript 6 (`--strict --jsx react-jsx`) against `@types/react` 19 and run with React 19.2's `renderToStaticMarkup`, which turns a component tree into an HTML string — a convenient way to see the real output without a browser.

Walk through the component body. `props.variant` exists on both members (via `BaseProps`), so it can be read before narrowing. The check `props.href !== undefined` is the **mode switch**: in the link member `href` is `string`, in the action member it is `undefined` (an optional `never` reads as `undefined`), so TypeScript narrows `props` to `LinkButtonProps` inside the `if`, and to `ActionButtonProps` after it. Destructuring after narrowing gives each variable the right type: `onClick` is a `MouseEventHandler`, `type` is `'button' | 'submit'`. The default `type = 'button'` matters in real apps — a `<button>` inside a `<form>` defaults to `submit`, which is a classic source of accidental form submissions.

Now the misuse cases, each compiled against the same file:

```tsx title="misuse.tsx"
const a = <Button href="/docs" onClick={() => {}}>Docs</Button>;
const b = <Button>Nothing</Button>;
const c = <Button href="/x" disabled>Bad</Button>;
```

```output
misuse.tsx(1,12): error TS2322: Type '{ children: string; href: string; onClick: () => void; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Types of property 'onClick' are incompatible.
    Type '() => void' is not assignable to type 'undefined'.
misuse.tsx(2,12): error TS2322: Type '{ children: string; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Property 'onClick' is missing in type '{ children: string; }' but required in type '{ onClick: MouseEventHandler<HTMLButtonElement>; ... }'.
misuse.tsx(3,12): error TS2322: Type '{ children: string; href: string; disabled: true; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Types of property 'disabled' are incompatible.
    Type 'true' is not assignable to type 'undefined'.
```

(The second message is shortened here; the compiler prints the whole member type.) The errors are not beautiful — they talk about `undefined` rather than "you cannot combine these" — but they point at the right prop. Read them as "this prop is forbidden in the mode you are in".

## Why `in` does not narrow here

Many developers reach for `'href' in props` to tell modes apart. With this pattern it does not work:

```typescript
function kind(p: ButtonProps): string {
  if ('href' in p) return `link to ${p.href.length}`;
  //                                  ^ error TS18048: 'p.href' is possibly 'undefined'.
  return 'action';
}
```

The `in` operator narrows a union to the members that *declare* the key. Here both members declare `href` — one as `string`, one as optional `never` — so `in` eliminates nothing. Worse, it would be wrong at runtime too: a caller can write `href={undefined}`, which makes `'href' in props` true for an action button. The `!== undefined` check is both the one TypeScript understands and the one that matches runtime reality.

## Controlled versus uncontrolled inputs

The same technique types the controlled/uncontrolled split. Here, though, the two modes are not symmetric, and the exercise is to get the details right.

```tsx title="TextInput.tsx"
import type { ChangeEvent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

type ControlledProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: string;
  // Observing changes is fine in uncontrolled mode; driving the value is not.
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: never;
};

type TextInputProps = { name: string } & (ControlledProps | UncontrolledProps);

function TextInput(props: TextInputProps) {
  if (props.value !== undefined) {
    return <input name={props.name} value={props.value} onChange={props.onChange} />;
  }
  // `defaultValue` may be absent: the "neither" case is a valid empty input.
  return (
    <input name={props.name} defaultValue={props.defaultValue ?? ''} onChange={props.onChange} />
  );
}

console.log(renderToStaticMarkup(<TextInput name="email" value="ada@example.com" onChange={() => {}} />));
console.log(renderToStaticMarkup(<TextInput name="city" defaultValue="London" />));
console.log(renderToStaticMarkup(<TextInput name="notes" />));
```

```output
<input name="email" value="ada@example.com"/>
<input name="city" value="London"/>
<input name="notes" value=""/>
```

Three design choices are worth explaining.

**Controlled mode requires `onChange`.** A `value` without `onChange` produces a read-only input that ignores typing — React warns about exactly this at runtime. Making `onChange` required in `ControlledProps` turns `{ value: 'x' }` into a compile error: `Property 'onChange' is missing`.

**Uncontrolled mode allows `onChange`.** Listening to changes does not take ownership of the value, so it would be wrong to forbid it. Only the props that *conflict* are forbidden — `value` and `defaultValue` cannot coexist.

**The "neither" case is allowed, on purpose.** Because `defaultValue` is optional, `<TextInput name="notes" />` is a valid uncontrolled input with no initial text. The notes for this exercise flag this as a trap: if both modes have only optional props, an empty props object matches, and the component must handle it — here with `?? ''`. Decide explicitly whether "neither" is legal. If it should not be, make the distinguishing prop required in every mode.

The output also shows that server rendering writes an uncontrolled input's `defaultValue` as the HTML `value` attribute — that attribute is the input's *initial* value, which is exactly what `defaultValue` means. In the browser, typing then changes the DOM value without React re-rendering.

## A reusable `XOR<A, B>` helper

Writing the `?: never` lines by hand is tedious and easy to forget when someone adds a prop to one mode. A mapped type can generate them:

```typescript title="xor.ts"
type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>);

type LinkProps = { href: string };
type ActionProps = { onClick: () => void };
type Strict = XOR<LinkProps, ActionProps>;

const s1: Strict = { href: '/home' };            // ok
const s2: Strict = { onClick: () => {} };        // ok
const s3: Strict = { href: '/home', onClick: () => {} };
```

```output
xor.ts(10,7): error TS2322: Type '{ href: string; onClick: () => void; }' is not assignable to type 'Strict'.
  Types of property 'onClick' are incompatible.
    Type '() => void' is not assignable to type 'undefined'.
```

Read `Without<T, U>` as "every key of `T` that `U` does not also have, made optional `never`". `Exclude<keyof T, keyof U>` leaves shared keys alone, so props common to both modes — say `children` — stay usable in either. `XOR` then intersects each side with a ban on the other side's unique keys and unions the two results. `XOR<LinkProps, ActionProps>` produces exactly the hand-written pair from earlier.

The helper handles two options; for three or more modes, nest it (`XOR<A, XOR<B, C>>`) or switch to an explicit discriminant, below. Libraries such as `ts-essentials` ship a similar `XOR` type.

## How it works internally

Two compiler rules make the pattern work. First, an optional property's type is read as `T | undefined` (unless `exactOptionalPropertyTypes` is on), so `href?: never` becomes `href?: undefined` — "absent or `undefined`". Assigning a string to it fails because `string` is not assignable to `undefined`. Second, TypeScript narrows a union by comparing a property against a **unit type** such as `undefined` when at least one member types that property as a unit type. That is why `props.href !== undefined` is a valid discriminant check even though `href` is not a string literal like `'link'`.

The same reading explains the loophole: by default `<Button onClick={save} href={undefined}>` compiles, because `undefined` fits `href?: never`. It is harmless here — the component checks `!== undefined` and correctly treats it as an action button — but it is the reason not to use `in`. With the compiler option `exactOptionalPropertyTypes` enabled, an optional property no longer accepts an explicit `undefined`, so even that is rejected (error TS2375).

## In real systems

Design-system buttons in many component libraries accept an `href` and render an anchor when it is present, and teams type them with exactly this union. Polymorphic components take this further with an `as` prop (`<Button as="a" href="...">`) whose allowed props depend on the element chosen, which needs more advanced generics. Form libraries type field components with controlled and uncontrolled modes; React's own DOM typings, by contrast, accept `value` and `defaultValue` together and rely on a runtime warning, because they describe what the DOM allows rather than what is sensible.

Other places the pattern shows up: a `Modal` that is either controlled (`open` plus `onOpenChange`) or self-managed (`defaultOpen`); an `Icon` that takes either `name` or a custom `svg`; a pagination component that takes either `page` plus `onPageChange` or `initialPage`.

## Trade-offs and alternatives

**An explicit discriminant** — `{ kind: 'link'; href: string } | { kind: 'action'; onClick: ... }` — is the most robust option: narrowing is trivial, error messages are clearer, and it scales to many modes. The cost is an extra prop at every call site (`<Button kind="link" href="/docs">`), which feels redundant when `href` already implies the mode. Use it when there are three or more modes or when modes share most props.

**Optional `never` fields** keep call sites clean and match how people already write JSX. The costs are verbose type definitions (mitigated by `XOR`) and error messages that mention `undefined`.

**Splitting into two components** — `LinkButton` and `ActionButton` — removes the problem entirely and is often the simplest answer. It is worth suggesting in an interview; the union is justified when the components share a lot of styling and behaviour and the team wants a single import.

**Runtime checks only** — a `console.warn` when both props appear — are what you fall back to in plain JavaScript. They are better than nothing but run late and only on the code path that is actually executed.

## Common mistakes

- **Using a plain union and assuming it is exclusive.** Excess property checking treats keys from any member as known, so both sets of props are accepted. Add `?: never` for the other mode's keys.
- **Narrowing with `in`.** Both members declare every mode key, so `in` cannot tell them apart. Compare against `undefined`.
- **Forbidding too much.** Banning `onChange` in uncontrolled mode prevents valid code. Forbid only props that conflict.
- **Forgetting the "neither" case.** If every mode's props are optional, `{}` is valid. Either handle it or make a distinguishing prop required.
- **Destructuring before narrowing.** `const { href, onClick } = props` at the top gives `href: string | undefined` and `onClick: ... | undefined`; the link between them is lost. Narrow first, then destructure inside each branch (TypeScript 4.6+ can narrow destructured `const` variables from a discriminated union, but the check must be on a destructured discriminant, and the code is harder to read).

## Interview perspective

A typical prompt: "Type a `Button` that can be a link or a button, but not both." Strong answers follow this order: show the plain union, demonstrate that it accepts both, explain excess property checking for unions, add `?: never`, narrow with `!== undefined`, then mention the discriminant alternative and the option of two components.

Follow-up questions and what they test:

- **"Why does `{ href, onClick }` pass the plain union?"** Structural typing plus union-aware excess property checking.
- **"Why `never` and not `undefined`?"** Both work for the type check, but `never` states intent — "this prop does not belong here" — and is the established convention.
- **"Can you make it generic?"** Write `Without` and `XOR`.
- **"What about `href={undefined}`?"** It is allowed by default and handled by the `!== undefined` check; `exactOptionalPropertyTypes` rejects it.

## Practice

1. Add a `download?: boolean` prop that is allowed only in link mode. Write the misuse case and confirm the error.
2. Type a `Modal` that is either controlled (`open: boolean`, `onOpenChange: (open: boolean) => void`) or uncontrolled (`defaultOpen?: boolean`). Decide whether `onOpenChange` should be allowed in uncontrolled mode.
3. Rewrite `ButtonProps` using `XOR<LinkOnly, ActionOnly> & BaseProps` and check that all three misuse cases still fail.
4. Convert the Button to an explicit `kind` discriminant and compare the error message for passing `onClick` to a link.

```quiz
Q: Why does `const both: { href: string } | { onClick: () => void } = { href: '/', onClick: f }` compile?
- [ ] Unions in TypeScript are always exclusive, but functions are exempt from checking
- [x] Excess property checking treats a key as known if any union member has it, and extra properties are allowed structurally
- [ ] TypeScript only checks the first member of a union
- [ ] Object literals are never checked against union types
> The value matches `{ href: string }` with an extra `onClick`. Extra properties are normally caught by excess property checking, but for unions a key is only "excess" if no member declares it, and `onClick` is declared by the second member. Adding `onClick?: never` to the first member is what makes the combination fail.
```

```quiz
Q: Props are `{ href: string; onClick?: never } | { onClick: () => void; href?: never }`. Which check narrows `props` to the link member?
- [ ] `'href' in props`
- [ ] `typeof props === 'object'`
- [x] `props.href !== undefined`
- [ ] `props.onClick === null`
> Both members declare `href`, so `in` removes neither member, and `href={undefined}` would make `in` true at runtime for an action button. `href` is `string` in one member and `undefined` in the other, so comparing with `undefined` discriminates the union. `onClick` is never `null`, so the last check narrows nothing useful.
```

## Quick revision {#quick-revision}

- Plain union `A | B` accepts objects with both sets of props: structural typing plus union-aware excess property checking.
- Forbid the other mode's keys with `key?: never` in each member.
- Narrow with `props.key !== undefined`, not `'key' in props` (both members declare the key).
- Narrow first, destructure inside each branch.
- Controlled input: `value` + required `onChange`, `defaultValue?: never`. Uncontrolled: optional `defaultValue`, optional `onChange`, `value?: never`.
- Decide on the "neither" case: optional-only modes accept `{}`.
- `Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never }`; `XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)`.
- `href={undefined}` is accepted by default; `exactOptionalPropertyTypes` rejects it.
- Alternatives: explicit `kind` discriminant (best for 3+ modes), two separate components.

## Key takeaways {#key-takeaways}

- A union of props types means "at least one shape", not "exactly one"; exclusivity must be written into the types.
- Optional `never` fields make the other mode's props impossible to supply while keeping call sites clean.
- Inside the component, an `!== undefined` check on a mode-specific prop is the narrowing that both TypeScript and the runtime agree on.
- Forbid only conflicting props, and decide explicitly whether "no mode chosen" is valid.
- For many modes or clearer errors, an explicit discriminant or separate components can be the better design.
