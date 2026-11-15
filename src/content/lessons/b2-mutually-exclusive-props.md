---
summary: Some props must never be passed together — `value` with `defaultValue`, `href` with `onClick`, `src` with `initials`. You will learn why an ordinary union does not forbid the combination, how optional `never` properties close the gap, how to write a reusable `XOR` type, and when a discriminant prop is the better design.
difficulty: intermediate
minutes: 35
objectives:
  - Explain why a plain union of object types accepts objects that combine properties from both members
  - Use optional `never` properties to make two sets of props mutually exclusive, and read the resulting error messages
  - Implement a generic `XOR<A, B>` type and explain each step of its mapped type
  - Narrow mutually exclusive props inside a component and handle the "neither" and `undefined` edge cases
  - Choose between `never`-based exclusivity and an explicit discriminant prop for a given component API
---

## Introduction

Many components have props that make sense alone but are contradictory together. A form field can be controlled with `value` or uncontrolled with `defaultValue`, but not both — which one should win? An action can be a link with `href` or a button with `onClick`; passing both creates an anchor whose click handler fights its navigation. An avatar shows an image from `src` or a circle with `initials`, never both.

If the props type allows these combinations, someone will pass them, and the component must either guess what they meant or silently ignore one prop. Neither is good. The better design makes the impossible combination **unrepresentable**: the code that passes it does not compile. That is what **mutually exclusive props** are — two or more groups of props of which a caller may use exactly one.

TypeScript has no keyword for "exclusive or", and the obvious attempt — a union of the two shapes — does not work. This lesson explains why, then builds the standard solution from optional `never` properties, generalises it into a reusable `XOR` type, and compares it with the alternative of an explicit discriminant prop. It is a favourite senior frontend interview question precisely because the naive answer looks right. For the implementation exercise, see [[b2-impl-exclusive-props]].

## Before you start

- **Union types** — `A | B` means "a value of type `A` or of type `B`". See [[b2-unions]].
- **Narrowing and discriminated unions** — how `if` checks narrow a union. See [[b2-narrowing]] and [[b2-discriminated-unions]].
- **The `never` type** — the type with no values. See [[b2-never]].
- **Optional properties** — what `prop?: T` allows. See [[b2-optional-properties]].
- **Mapped types** — `{ [K in Keys]: … }`, used for the generic helper. See [[b2-mapped-types]].
- **React component props** — the examples are React components, though the technique is plain TypeScript. See [[b2-react-component-props]].

## The intuition: a form with an "either / or" section

Picture a paper form that says: *Pay by card (fill in section A) or by bank transfer (fill in section B).* A union type is like a clerk who checks "is section A complete, or is section B complete?" If you fill in both, section A is complete, so the clerk accepts the form — the union was satisfied. Nothing in the rule says the other section must be blank.

To make the sections exclusive, the rule must say so explicitly: *if you fill in section A, section B must be empty, and vice versa.* In TypeScript, "must be empty" is spelled `?: never` — the property may be absent, but there is no value it could hold. That is the whole trick; the rest of this lesson is about using it well.

## Why a plain union is not enough

Here is the obvious attempt, written as plain TypeScript so it runs without React:

```typescript title="plain-union.ts"
type LinkAction = { label: string; href: string };
type ButtonAction = { label: string; onClick: () => void };
type ActionProps = LinkAction | ButtonAction;

const both: ActionProps = { label: "Save", href: "/save", onClick: () => {} };
console.log("compiled:", Object.keys(both));

function describe(props: ActionProps) {
  return props.href;
}
```

```output
error TS2339: Property 'href' does not exist on type 'ActionProps'.
  Property 'href' does not exist on type 'ButtonAction'.
```

With `describe` removed, the program prints `compiled: [ 'label', 'href', 'onClick' ]`. Two problems appear, and both come from how unions work.

**The union accepts both props at once.** The object `{ label, href, onClick }` is assignable to `LinkAction`: it has `label` and `href`, and extra properties do not break assignability ([[b2-structural-typing]]). What about the excess property check, which normally rejects unknown properties in object literals? For unions it is deliberately lenient: a property counts as excess only if it exists in *no* member of the union. `onClick` exists in `ButtonAction`, so it is not excess. The union is satisfied, and the contradictory value compiles.

**The component cannot read the props.** On a union, you may only access properties that every member declares. `href` is missing from `ButtonAction`, so `props.href` is an error, even just to check whether it is there. You would have to narrow with `"href" in props` first ([[b2-in-operator]]) — which works, but means the union is now awkward for the author *and* useless for the caller.

## The fix: optional `never` properties

Add each member's exclusive props to the other member as optional properties of type `never`:

```typescript title="exclusive.ts"
type LinkAction = { label: string; href: string; onClick?: never };
type ButtonAction = { label: string; onClick: () => void; href?: never };
type ActionProps = LinkAction | ButtonAction;

function render(props: ActionProps): string {
  if (props.href !== undefined) {
    return `<a href="${props.href}">${props.label}</a>`;
  }
  props.onClick();
  return `<button>${props.label}</button>`;
}

console.log(render({ label: "Docs", href: "/docs" }));
console.log(render({ label: "Save", onClick: () => console.log("saving...") }));
const both: ActionProps = { label: "Save", href: "/save", onClick: () => {} };
const neither: ActionProps = { label: "Save" };
```

```output
error TS2322: Type '{ label: string; href: string; onClick: () => void; }' is not assignable to type 'ActionProps'.
  Types of property 'onClick' are incompatible.
    Type '() => void' is not assignable to type 'undefined'.
error TS2322: Type '{ label: string; }' is not assignable to type 'ActionProps'.
  Property 'onClick' is missing in type '{ label: string; }' but required in type 'ButtonAction'.
```

With the last two lines removed, the program prints:

```output
<a href="/docs">Docs</a>
saving...
<button>Save</button>
```

### Why it works

`onClick?: never` means "`onClick` is optional, and if present its type is `never`". No value has type `never`, so the only legal state is *absent*. (Under the default compiler settings an optional property also accepts `undefined`, which is why the error message says `'() => void' is not assignable to type 'undefined'` — more on that below.)

Now check `{ label, href, onClick }` against each member. Against `LinkAction`, `onClick` is a function where only `undefined` is allowed: rejected. Against `ButtonAction`, `href` is a string where only `undefined` is allowed: rejected. Neither member accepts it, so the union rejects it. The "neither" case fails too, because each member requires its own prop — exactly the behaviour we wanted.

### Reading the props inside the component

Both members now *declare* both `href` and `onClick`, so `props.href` is a legal access with type `string | undefined`. Checking `props.href !== undefined` narrows the union: in `LinkAction`, `href` is a required `string` that can never be `undefined`, so if `href` is `undefined` the value must be a `ButtonAction`. That is why `props.onClick()` after the `if` compiles without a check — TypeScript has narrowed `props` to `ButtonAction`, whose `onClick` is required. The optional `never` properties behave like a **discriminant**: a property whose type differs between members in a way the compiler can test.

Editors display `href?: never` as `href?: undefined` in hover text and error messages, because under default settings the two are equivalent. Seeing `undefined` there is expected.

## The same pattern in React

The technique is pure TypeScript, so it works unchanged for component props. JSX attributes are checked like an object literal ([[b2-react-typescript]]):

```tsx title="Action.tsx"
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type ActionProps = { children: ReactNode } & (
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never }
);

function Action(props: ActionProps) {
  if (props.href !== undefined) return <a className="action" href={props.href}>{props.children}</a>;
  return <button type="button" className="action" onClick={props.onClick}>{props.children}</button>;
}

console.log(renderToStaticMarkup(<Action href="/docs">Read the docs</Action>));
console.log(renderToStaticMarkup(<Action onClick={() => {}}>Save</Action>));
```

```output
<a class="action" href="/docs">Read the docs</a>
<button type="button" class="action">Save</button>
```

Shared props (`children`) live in an object type intersected with the union, so they are written once. The intersection distributes: `Shared & (A | B)` behaves like `(Shared & A) | (Shared & B)`.

The best-known instance of this pattern is the controlled/uncontrolled field — `value` plus `onChange`, or `defaultValue` — covered with a full implementation in [[b2-controlled-uncontrolled-props]]:

```typescript
type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never };
type Uncontrolled = { defaultValue?: string; onChange?: (v: string) => void; value?: never };
type InputProps = Controlled | Uncontrolled;
```

Look closely at the uncontrolled branch: `defaultValue` is *optional*. That means `{}` (no value props at all) is a legal `InputProps`, matching how native inputs behave. Whether "neither" should be allowed is a design decision you make per component, by choosing whether each branch's own props are required.

## A reusable `XOR` type

Writing `?: never` for every prop of the other branch by hand gets tedious and error-prone when each branch has several props. A generic helper computes it:

```typescript title="xor.ts"
type Without<T, U> = { [K in Exclude<keyof U, keyof T>]?: never };
type XOR<A, B> = (A & Without<A, B>) | (B & Without<B, A>);

type AvatarProps = { size?: number } & XOR<{ src: string; alt: string }, { initials: string }>;

function avatar(props: AvatarProps): string {
  const size = props.size ?? 32;
  if (props.src !== undefined) return `img(${props.src}, ${props.alt}, ${size})`;
  return `circle(${props.initials}, ${size})`;
}

console.log(avatar({ src: "/ada.png", alt: "Ada" }));
console.log(avatar({ initials: "GH", size: 48 }));
const bad1: AvatarProps = { src: "/ada.png", alt: "Ada", initials: "AL" };
const bad2: AvatarProps = { src: "/ada.png" };
```

```output
error TS2322: Type '{ src: string; alt: string; initials: string; }' is not assignable to type 'AvatarProps'.
  Types of property 'initials' are incompatible.
    Type 'string' is not assignable to type 'undefined'.
error TS2322: Type '{ src: string; }' is not assignable to type 'AvatarProps'.
  Type '{ src: string; }' is not assignable to type '{ size?: number | undefined; } & { src: string; alt: string; } & Without<{ src: string; alt: string; }, { initials: string; }>'.
    Property 'alt' is missing in type '{ src: string; }' but required in type '{ src: string; alt: string; }'.
```

Without the two `bad` lines, it prints `img(/ada.png, Ada, 32)` and `circle(GH, 48)`.

Read `Without<T, U>` from the inside out:

1. `keyof U` — every key of the other branch, here `"initials"`.
2. `Exclude<keyof U, keyof T>` — remove keys that `T` also has, so shared keys are not forbidden. For the image branch this is still `"initials"`.
3. `{ [K in …]?: never }` — a mapped type that declares each remaining key as optional `never`.

So `A & Without<A, B>` is "the image props, and none of the initials props", and `XOR` is the union of that with its mirror image. Notice the second error: the image branch requires *both* `src` and `alt`, so the helper also enforces "these props come together" — `src` without `alt` fails. Grouping props that only make sense together is half the value of the pattern.

`XOR` handles two branches. For three or more (`OneOf<[A, B, C]>`), the same idea is applied to each member against the union of all the others' keys; libraries such as `type-fest` ship ready-made versions, and it is a good exercise to write one.

## Edge cases you must know

### `undefined` slips through

Under default settings, `onClick?: never` accepts an explicit `undefined`, because an optional property's type is implicitly `T | undefined` and `never | undefined` is `undefined`. So this compiles:

```typescript
const sneaky: ActionProps = { label: "Save", href: "/x", onClick: undefined };
```

Usually that is harmless — `undefined` behaves like absence, and the component's `!== undefined` checks treat it that way. With the compiler option `exactOptionalPropertyTypes` enabled ([[b2-strict-compiler-options]]), optional properties no longer accept an explicit `undefined`, and the line fails:

```output
error TS2375: Type '{ label: string; href: string; onClick: undefined; }' is not assignable to type 'ActionProps' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
```

The practical rule for implementations: test with `!== undefined`, not with `"onClick" in props`. The `in` check is `true` for `{ onClick: undefined }` and would send you down the wrong branch.

### Forwarding props with conditional values

The exclusivity has an ergonomic cost when props are computed. A wrapper that decides between link and button with conditional expressions does not compile:

```tsx
function Toolbar({ url }: { url?: string }) {
  return <Action href={url} onClick={url ? undefined : () => {}}>Open</Action>;
}
```

```output
error TS2322: Type '{ children: string; href: string | undefined; onClick: (() => void) | undefined; }' is not assignable to type 'IntrinsicAttributes & ActionProps'.
```

The compiler checks the *types* of the attributes, `string | undefined` and `(() => void) | undefined`, and cannot see that the two conditions are correlated. Some value of those types (both `undefined`) would match neither branch, so the call is rejected. The fix is to branch in JSX, so each call site matches one member:

```tsx
return url !== undefined
  ? <Action href={url}>Open</Action>
  : <Action onClick={() => {}}>Open</Action>;
```

This is usually clearer code anyway, but it is worth knowing before you choose the pattern for a heavily wrapped component.

### Wrapper components that re-declare props

A wrapper that declares its own props as `{ href?: string; onClick?: () => void }` and spreads them into `Action` hits the same error, because the wrapper's type allows both and neither. Wrappers should reuse the exclusive type — `type FancyActionProps = ActionProps & { tone: "info" | "danger" }` — so exclusivity flows through.

## The alternative: an explicit discriminant

Instead of inferring the mode from which props are present, you can make the caller state it:

```typescript
type ActionProps =
  | { kind: "link"; href: string }
  | { kind: "button"; onClick: () => void };
```

This is an ordinary **discriminated union** ([[b2-discriminated-unions]]). It needs no `never` tricks: `{ kind: "link", href, onClick }` fails the excess property check because, once `kind` is a literal, TypeScript checks the object against the matching member only. Narrowing is the familiar `switch (props.kind)`, and exhaustiveness checking works.

| | Optional `never` / `XOR` | Discriminant prop |
|---|---|---|
| Call site | `<Action href="/x">` — natural, matches HTML conventions | `<Action kind="link" href="/x">` — one extra prop |
| Reading in the component | `props.href !== undefined` narrows | `props.kind === "link"` narrows; `switch` with exhaustiveness |
| Error messages | Mention `undefined` and can be long | Short and clear |
| Many modes | Gets unwieldy beyond two or three | Scales to any number |
| Fits | Existing APIs, DOM-like props (`value`/`defaultValue`) | New APIs with several modes, or modes with no obvious "signature" prop |

Use the `never` technique when the presence of a prop *is* the natural way to say the mode — nobody wants `<Input mode="controlled" value={x} />` — and a discriminant when the modes are many or not obviously tied to one prop.

## How it works internally

Nothing in this lesson exists at runtime. `never`, `XOR` and the union are erased by the compiler, so a JavaScript caller, a `{...props}` spread of an `any` value, or data from an untrusted source can still pass both props. Components with dangerous combinations (for example, `href` plus `onClick` that calls `preventDefault`) may still want a development-mode check that warns when both arrive. The type system's job is to catch the overwhelming majority of mistakes — those made in typed code — at the moment they are written.

## In real systems

- **Form controls** in every major component library use controlled/uncontrolled pairs typed this way.
- **Link/button hybrids** (`href` or `onClick`), **icons** (`name` from a sprite or a custom `svg` child), and **images** (`src` or a placeholder) are common candidates.
- **Accessibility requirements** can be encoded as "one of": an icon-only button requires either `aria-label` or `aria-labelledby`.
- **Configuration objects** outside React — "pass `url` or `socketPath`", "`cron` or `intervalMs`" — use the same `XOR` helper.

## Common mistakes

- **Using a plain union.** It accepts both prop groups at once and makes them unreadable. Fix: add `?: never` or use `XOR`.
- **Making both sides optional by accident.** Then `{}` is allowed. Fix: decide whether "neither" is valid and make each branch's own props required if not.
- **Checking with `in`.** `{ onClick: undefined }` passes `"onClick" in props`. Fix: `props.onClick !== undefined`.
- **Re-declaring loose props in wrappers.** Exclusivity is lost or wrappers fail to compile. Fix: build wrapper props from the exclusive type.
- **Casting to `any` to pass both.** It defeats the pattern and reintroduces the ambiguity. Fix: branch in JSX.

## Interview perspective

The typical prompt: "Type a component that accepts either `value` and `onChange`, or `defaultValue`, but not both." A strong answer starts by showing why `A | B` is insufficient — it accepts both, and properties not on every member cannot be read — then adds `?: never` to each branch and explains *why* it works (`never` has no values, so the property must be absent). Then generalise: write `XOR<A, B>` with `Exclude<keyof B, keyof A>` and a mapped type.

Follow-ups to prepare for:

- *"What about explicit `undefined`?"* Allowed by default; `exactOptionalPropertyTypes` forbids it; implementations should test `!== undefined`.
- *"Should 'neither' be allowed?"* Depends on the component — show how required versus optional props in each branch decides it.
- *"When would you use a discriminant instead?"* Many modes, clearer errors, exhaustive `switch`.
- *"Does this protect you at runtime?"* No — types are erased; add a development warning if misuse is dangerous.

## Practice

1. Type a `Modal` that takes either `open` and `onOpenChange` (controlled) or `defaultOpen` (uncontrolled), and implement its mode detection.
2. Write `OneOf<[A, B, C]>` for three branches and test it with an `Icon` that accepts `name`, `svg` or `src`.
3. Type an icon-only `IconButton` that requires either `aria-label` or `aria-labelledby` (but not both) and forbids `children`.
4. Convert the `Action` component to a discriminated union with `kind` and compare the error messages for the "both props" mistake.
5. Turn on `exactOptionalPropertyTypes` and find a call that compiled before and fails now.

```quiz
Q: With `type P = { href: string } | { onClick: () => void }`, does `const p: P = { href: "/x", onClick: () => {} }` compile?
- [x] Yes, because the object satisfies the first member and `onClick` is not excess since another member declares it
- [ ] No, because excess property checking rejects `onClick`
- [ ] No, because a value cannot match two members of a union
- [ ] Only if `strict` is disabled
> Union members are checked by ordinary assignability, and extra properties do not prevent assignability. The excess property check for unions only flags properties that appear in no member; `onClick` appears in the second member, so it is allowed.
```

```quiz
Q: What does `onClick?: never` allow, under default compiler settings?
- [ ] Any function
- [ ] Nothing at all — the object can never be created
- [x] The property may be absent or explicitly `undefined`
- [ ] Only `null`
> `never` has no values, so the property cannot hold anything real. Because it is optional, its type is effectively `never | undefined`, which is `undefined`. With `exactOptionalPropertyTypes`, explicit `undefined` is rejected and only absence remains.
```

```quiz
Q: In `type Without<T, U> = { [K in Exclude<keyof U, keyof T>]?: never }`, why exclude `keyof T`?
- [ ] To make the mapped type faster to compute
- [x] So keys shared by both branches are not turned into `never`, which would make them impossible to pass
- [ ] Because `keyof` cannot be used twice in one type
- [ ] To make the result readonly
> If a key such as `label` exists in both branches, forbidding it in one branch would conflict with requiring it there, producing `never` and an unusable type. Only keys unique to the other branch should be forbidden.
```

## Quick revision {#quick-revision}

- Goal: props groups where callers may use exactly one; make the mix unrepresentable.
- Plain `A | B` fails: excess-property check on unions only flags keys in no member; and non-shared keys cannot be read.
- Fix: add the other branch's keys as `?: never` — `{ href: string; onClick?: never } | { onClick: () => void; href?: never }`.
- `never` has no values → property must be absent (or `undefined` by default); errors show it as `undefined`.
- Inside: `props.href !== undefined` narrows to the right member.
- `XOR<A, B> = (A & Without<A, B>) | (B & Without<B, A>)`, `Without<T, U> = { [K in Exclude<keyof U, keyof T>]?: never }`.
- "Neither" allowed only if one branch's own props are optional — decide per component.
- `exactOptionalPropertyTypes` forbids explicit `undefined`; implementations test `!== undefined`, not `in`.
- Conditional attribute values (`href={a ? x : undefined}`) fail; branch in JSX instead.
- Alternative: discriminant prop `kind: "link" | "button"` — clearer errors, scales to many modes, one extra prop.
- Erased at runtime; add dev warnings if misuse is dangerous.

## Key takeaways {#key-takeaways}

- A union of object types means "at least one of these shapes fits", not "exactly one", so it does not forbid combining props.
- Optional `never` properties turn "this prop must be absent" into a type rule and double as a discriminant for narrowing.
- A small `XOR` helper removes the boilerplate and also groups props that must appear together.
- Decide deliberately whether "neither" is valid, and be aware of explicit `undefined` and conditional-value call sites.
- Prefer an explicit discriminant prop when there are many modes or no natural signature prop.
