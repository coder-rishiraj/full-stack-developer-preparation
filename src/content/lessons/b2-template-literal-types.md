---
summary: Template literal types build string types the way template strings build string values — `` `on${Capitalize<E>}` `` turns `"click" | "focus"` into `"onClick" | "onFocus"`. You will learn how they combine unions, which types can be interpolated, the four built-in string helpers, how patterns such as `` `${number}px` `` check strings, and how `infer` parses strings at the type level.
difficulty: advanced
minutes: 45
objectives:
  - Build string literal unions with template literal types and predict how unions combine
  - Use `Uppercase`, `Lowercase`, `Capitalize` and `Uncapitalize`, and handle non-string keys safely
  - Explain what pattern types such as `` `${number}px` `` and `` `user_${string}` `` accept and reject
  - Parse strings at the type level with `infer` — route parameters, prefixes, splitting
  - Design a typed API (event names, CSS tokens) with template literal types and recognise when it becomes too expensive
---

## Introduction

A lot of frontend code is held together by strings that follow conventions. A React prop for the `click` event is called `onClick`. A field called `email` fires an `emailChanged` event. A spacing token is `margin-top` or `padding-left`. A route is `/users/:userId`. In plain TypeScript these are all plain `string`, so a typo such as `onClik` or `emailChange` compiles happily and fails quietly at runtime.

**Template literal types**, added in TypeScript 4.1, let the type system understand those conventions. They use the same backtick syntax as JavaScript template strings, but they operate on *types*:

```typescript title="first-look.ts"
type EventName = "click" | "focus";
type HandlerProp = `on${Capitalize<EventName>}`; // "onClick" | "onFocus"

const prop: HandlerProp = "onClick";  // ok
const typo: HandlerProp = "onClik";   // error
```

```output
error TS2820: Type '"onClik"' is not assignable to type '"onClick" | "onFocus"'. Did you mean '"onClick"'?
```

The compiler computed the set of valid names from the set of events. Add `"blur"` to `EventName` and `"onBlur"` becomes valid everywhere `HandlerProp` is used. This lesson teaches how that computation works, what else template literal types can express — including patterns like "any string that starts with `user_`" — and how to take strings *apart* with `infer`.

## Before you start

- **Literal types and unions** — `"click"` as a type, and `"a" | "b"`. See [[b2-literal-types]] and [[b2-unions]].
- **JavaScript template literals** — `` `Hello ${name}` `` at runtime. The type-level syntax copies it.
- **Conditional types and `infer`** (for the parsing section) — see [[b2-conditional-types]] and [[b2-infer]].
- **`keyof`** — the union of a type's keys, which often feeds template literal types. See [[b2-keyof]].

## The intuition

A JavaScript template string builds *one* string from the *values* you plug into it. A template literal type builds a *set* of strings from the *types* you plug into it.

If you plug in a single literal, you get a single literal: `` `on-${"click"}` `` is `"on-click"`. If you plug in a union, think of it as a combination lock: each slot can show any of its options, and the result is every combination the lock can display. Two slots with two options each give four strings; three slots with four options each give sixty-four. If you plug in `string` or `number`, the slot accepts *anything* of that kind, and the result is no longer a finite list but a **pattern** the compiler checks strings against.

The analogy stops at runtime: nothing is built. A template literal type only describes which strings are allowed; your code still has to produce those strings.

## Building strings from literal types

### Plain interpolation

Any string, number, bigint, boolean, `null` or `undefined` literal type can be interpolated, and it is converted the way JavaScript would convert it:

```typescript title="interpolation.ts"
type Version = `v${2}`;              // "v2"
type Flag = `debug=${boolean}`;      // "debug=false" | "debug=true"
type Maybe = `id-${null | undefined}`; // "id-null" | "id-undefined"
```

`boolean` is the union `true | false`, so it produces two strings. Symbols and object types cannot be interpolated; the compiler rejects them with "Type 'symbol' is not assignable to type 'string | number | bigint | boolean | null | undefined'", which is the exact list of allowed types.

### Unions multiply

When several slots hold unions, the result is the **cross product** — every combination:

```typescript title="cross-product.ts"
type Side = "top" | "bottom" | "left" | "right";
type Spacing = `${"margin" | "padding"}-${Side}`;
// "margin-top" | "margin-bottom" | "margin-left" | "margin-right"
// | "padding-top" | "padding-bottom" | "padding-left" | "padding-right"

type Size = "sm" | "lg";
type Tone = "red" | "blue";
type ButtonClass = `btn-${Size}-${Tone}`;
// "btn-sm-red" | "btn-sm-blue" | "btn-lg-red" | "btn-lg-blue"
```

Two options times four options gives eight; two times two gives four. That multiplication is what makes the feature powerful — a design system can describe hundreds of valid class names in one line — and also what makes it dangerous, as the trade-offs section explains.

## The intrinsic string helpers

TypeScript ships four **intrinsic** string manipulation types. They are implemented inside the compiler (their declarations in `lib.es5.d.ts` only say `intrinsic`), not as ordinary conditional types:

```typescript title="intrinsics.ts"
type A = Uppercase<"hello">;           // "HELLO"
type B = Lowercase<"HeLLo">;           // "hello"
type C = Capitalize<"hello world">;    // "Hello world"
type D = Uncapitalize<"Hello">;        // "hello"
type E = Capitalize<"click" | "focus">; // "Click" | "Focus"
```

`Capitalize` changes only the first character; it does not title-case each word. All four distribute over unions, as `E` shows.

Each helper requires its argument to be a string type. That matters when the input comes from `keyof`, which can include `number` and `symbol` keys:

```typescript title="string-and-key.ts"
type Bad<T> = `on${Capitalize<keyof T>}`;           // error TS2344
type Good<T> = `on${Capitalize<keyof T & string>}`; // ok

type G = Good<{ name: string; 0: boolean }>;        // "onName"
```

`keyof T & string` keeps only the string keys: a numeric key such as `0` becomes `never` and disappears from the union. This is the reason you will see `string & K` or `K & string` in almost every mapped type that renames keys; [[b2-mapped-types]] uses it in its key remapping section. When you interpolate `keyof T` without a helper, the error is different but the cause is the same — `symbol` cannot be put in a string — and the fix is identical.

The helpers also work on `string` itself, as patterns: `Lowercase<string>` accepts `"hello"` but rejects `"Hello"`.

## Pattern types: `string`, `number` and friends in a slot

When a slot holds `string`, `number` or `bigint` rather than literals, the template literal type is no longer a finite union. It becomes a **pattern**: a string literal is assignable to it if the compiler can match the fixed parts and the slot accepts what is left over.

```typescript title="patterns.ts"
type UserId = `user_${string}`;
type Px = `${number}px`;

const id: UserId = "user_42";   // ok
const bad: UserId = "usr_42";   // error: does not start with "user_"
const width: Px = "12.5px";     // ok
const h: Px = "auto";           // error
```

Patterns are useful for checking IDs with prefixes, CSS lengths, URL schemes (`` `https://${string}` ``) and similar conventions. Know their limits before relying on them:

- `` `${string}` `` matches the **empty string** too, so `` `${string}@${string}` `` accepts `"@"`. It is a shape check, not validation.
- `` `${number}` `` accepts any text that JavaScript's `Number()` converts to a finite number. In TypeScript 6.0, `` `${number}px` `` accepts `"1e3px"`, `"0x1Fpx"`, `"12 px"` and even `" px"`, because `Number("12 ")` is `12` and `Number(" ")` is `0`. It rejects `"NaNpx"` and `"Infinitypx"`.
- A plain `string` variable is not assignable to a pattern — the compiler cannot know what it contains. Values from user input or the network need a runtime check (and usually a custom type guard; see [[b2-custom-type-guards]]) before they can be given a pattern type.

## Parsing strings with `infer`

Template literal types can appear on the `extends` side of a conditional type, with `infer` in the slots. The compiler then matches a string against the pattern and captures the pieces:

```typescript title="parsing.ts"
type HandlerToEvent<S> = S extends `on${infer E}` ? Uncapitalize<E> : never;
type H = HandlerToEvent<"onClick" | "onKeyDown" | "value">; // "click" | "keyDown"

type Trim<S extends string> =
  S extends ` ${infer R}` ? Trim<R> :
  S extends `${infer R} ` ? Trim<R> :
  S;
type T = Trim<"  hi  ">; // "hi"

type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}` ? [Head, ...Split<Tail, D>] : [S];
type P = Split<"a.b.c", ".">; // ["a", "b", "c"]
```

The matching rule is worth knowing: when an `infer` slot is followed by fixed text, it captures the **shortest** prefix that lets the rest match. So in `Split`, `Head` stops at the *first* `"."`. An `infer` at the very end captures everything that is left.

The flagship real-world use is extracting parameter names from a route string:

```typescript title="route-params.ts"
type RouteParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParams<`/${Rest}`>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

type Params = RouteParams<"/users/:userId/posts/:postId">; // "userId" | "postId"

function buildPath<P extends string>(path: P, params: Record<RouteParams<P>, string>): string {
  return path.replace(/:(\w+)/g, (_, name: string) => params[name as RouteParams<P>]);
}

console.log(buildPath("/users/:userId/posts/:postId", { userId: "42", postId: "7" }));
```

```output
/users/42/posts/7
```

`RouteParams` peels one `:param/` segment at a time and recurses on the rest. `buildPath` infers `P` as the literal path string, so the second argument must have exactly the keys `userId` and `postId` — forgetting one, or misspelling it, is a compile error. Router libraries such as React Router and Hono use this technique for typed route parameters. Since TypeScript 4.8 you can also write `infer N extends number` in a slot to convert matched digits into a number literal type, as shown in [[b2-infer]].

## Worked example: a typed change-event store

Combining `keyof`, a template literal type and inference gives an event API whose names and payloads are both checked. Run with Node.js 22.

```typescript title="store.ts"
type Listener<V> = (value: V) => void;

class Store<T extends object> {
  private state: T;
  private listeners = new Map<string, Listener<any>[]>();

  constructor(initial: T) {
    this.state = initial;
  }

  // K is inferred from the event name: "nameChanged" -> K = "name".
  on<K extends keyof T & string>(event: `${K}Changed`, listener: Listener<T[K]>): void {
    const list = this.listeners.get(event) ?? [];
    list.push(listener);
    this.listeners.set(event, list);
  }

  set<K extends keyof T & string>(key: K, value: T[K]): void {
    this.state[key] = value;
    const event: `${K}Changed` = `${key}Changed`;
    for (const listener of this.listeners.get(event) ?? []) listener(value);
  }
}

const store = new Store({ name: "Ada", age: 36 });

store.on("nameChanged", (name) => console.log(`name -> ${name.toUpperCase()}`));
store.on("ageChanged", (age) => console.log(`age -> ${age + 1} next year`));

store.set("name", "Grace");
store.set("age", 85);
```

```output
name -> GRACE
age -> 86 next year
```

The interesting line is the signature of `on`. Its first parameter has the type `` `${K}Changed` ``, where `K` is a type parameter. When you call `store.on("nameChanged", ...)`, the compiler matches `"nameChanged"` against the pattern, infers `K = "name"`, and then types the listener as `Listener<T["name"]>`, which is `(value: string) => void`. That is why `name.toUpperCase()` needs no annotation, and why `age + 1` is arithmetic rather than string concatenation.

Mistakes are caught at the call:

```typescript title="store-errors.ts"
store.on("emailChanged", () => {});           // error
store.on("nameChanged", (n: number) => {});   // error
```

```output
error TS2345: Argument of type '"emailChanged"' is not assignable to parameter of type '"nameChanged" | "ageChanged"'.
error TS2345: Argument of type '(n: number) => void' is not assignable to parameter of type 'Listener<string>'.
```

Inside `set`, the annotation `` const event: `${K}Changed` `` matters. A template string *expression* is normally typed as plain `string`; with the annotation as context, the compiler gives it the template literal type instead. Here the precise type is not strictly needed because the `Map` is keyed by `string`, but the annotation documents the convention and catches a typo such as `` `${key}Change` ``. The `Map` itself uses `Listener<any>` because one map holds listeners for different value types; the public methods are what keep callers type-safe.

## How it works internally

The compiler represents a template literal type as a list of fixed text pieces and the types between them. When every slot is a literal or a union of literals, it eagerly expands the cross product into an ordinary union of string literals. When a slot is `string`, `number`, `bigint` or a generic type parameter, the type stays as a pattern.

Assignability to a pattern is checked by matching: the fixed pieces must appear in order, and the text between them must be acceptable for each slot (any text for `string`, numeric text for `number`, and so on). Inference uses the same matching in reverse, binding each `infer` slot or type parameter to the captured text.

Expansion has a hard limit. A union with more than 100,000 members cannot be represented, and the compiler stops with **TS2590: Expression produces a union type that is too complex to represent**. Five slots of 27 options each would be over 14 million strings, and fails immediately. Long before that limit, unions of a few thousand members make the editor sluggish.

## In real systems

**Component props and events.** Design systems generate `onXxx` handler names, `aria-*` and `data-*` attribute keys (`` `data-${string}` `` is a common index-signature key), and variant class names from unions.

**CSS-in-TypeScript.** Typed style systems describe tokens such as `` `${number}px` ``, `` `var(--${string})` `` or spacing scales as template literal types.

**Routing and APIs.** Routers extract `:param` names from path strings; API clients describe endpoints as `` `${"GET" | "POST"} /users/${string}` ``.

**Typed events and state.** The `` `${K}Changed` `` pattern from the worked example, and the `on${Capitalize<K>}Change` handler maps of [[b2-change-handlers-pattern]], tie event names to the state shape.

## Trade-offs and alternatives

| Approach | Catches typos | Cost | Best for |
|---|---|---|---|
| Plain `string` | No | None | Truly free-form text |
| Literal union written by hand | Yes | Must be maintained | A short, stable list |
| Template literal type from other unions | Yes, and stays in sync | Union size multiplies | Names derived from a convention |
| Pattern type (`` `${number}px` ``) | Shape only | Low | Prefixes, units, schemes |
| Runtime validation | Yes, for real data | Code and runtime cost | Anything from users or the network |

Use template literal types when names are *derived* from something you already have — events from a union, handlers from keys, routes from strings. Avoid them when the cross product grows large: three or four small unions are fine; anything approaching thousands of members is a compile-time performance problem. And never mistake a pattern check for validation: `` `${string}@${string}` `` is not an email validator.

## Common mistakes

> [!MISTAKE] Interpolating `keyof T` directly
> `` `${keyof T}Changed` `` fails because `keyof T` can contain `symbol`, which cannot appear in a string. Write `` `${keyof T & string}Changed` ``, or constrain the type parameter with `K extends keyof T & string`.

**Expecting `Capitalize` to title-case.** It changes only the first character: `Capitalize<"hello world">` is `"Hello world"`.

**Trusting `` `${number}` `` as validation.** It accepts `"1e3"`, `"0x1F"`, `" "` and other strings `Number()` accepts. If you need "digits only", check at runtime.

**Assigning a `string` to a pattern type.** `const id: UserId = someString` fails even if the value happens to start with `user_`. Narrow with a type guard after a runtime check.

**Exploding unions.** Multiplying several unions together can produce tens of thousands of members and slow every keystroke in the editor, or fail with TS2590. Keep slots small, or use a pattern type with `string` instead of a full cross product.

**Expecting inference through helpers.** A parameter typed `` `on${Capitalize<E>}` `` does not reliably infer `E` from `"onMouseMove"` (in TypeScript 6.0 it infers `string`). Infer the raw text with `` `on${infer E}` `` in a conditional type, then apply `Uncapitalize`.

## Interview perspective

Template literal types come up in frontend interviews about design systems and typed component APIs. Typical prompts: "Type the event-handler props of a component from a list of events", "Extract the params from `/users/:id`", "What does `` `${A}-${B}` `` give for unions?"

> [!INTERVIEW] What a strong answer sounds like
> "Template literal types build string literal types with backtick syntax. Unions in the slots produce the cross product, so `` `on${Capitalize<'click' | 'focus'>}` `` is `'onClick' | 'onFocus'`. I'd use `keyof T & string` because symbols can't be interpolated. With `string` or `number` in a slot it becomes a pattern rather than a union. And with `infer` in a conditional I can parse strings — for route params I'd recurse over `` `${string}:${infer P}/${infer Rest}` ``. The main cost is union size; past a few thousand members the compiler slows down, and 100,000 is a hard limit."

Follow-ups to prepare:

- **How do you turn `"onClick"` back into `"click"`?** `` S extends `on${infer E}` ? Uncapitalize<E> : never ``.
- **Which types can be interpolated?** `string`, `number`, `bigint`, `boolean`, `null`, `undefined` and their literals.
- **Are template literal types checked at runtime?** No; they are erased. Data from outside needs runtime validation.

## Practice

1. Write `CssVar<T extends string>` that turns `"primary" | "accent"` into `"--color-primary" | "--color-accent"`.
2. Write `EventProps<E extends string>` that maps a union of event names to an object type of optional `onXxx` handlers (combine with a mapped type).
3. Write `KebabToCamel<S>` that turns `"background-color"` into `"backgroundColor"` using `infer` and recursion.
4. Extend `RouteParams` so that optional segments written as `:id?` are reported separately as optional keys.
5. Measure: build a union of three slots with ten options each, then four slots, and notice when your editor's hover becomes slow. Explain the arithmetic.

```quiz
Q: What is `` `${"a" | "b"}-${"x" | "y"}` ``?
- [ ] `"a-x" | "b-y"`
- [x] `"a-x" | "a-y" | "b-x" | "b-y"`
- [ ] `` `${string}-${string}` ``
- [ ] A compile error: unions cannot be interpolated
> Unions in template slots produce the cross product of all combinations — two options times two options gives four strings. Pairing items position by position is not how it works.

Q: Why does `` type Names<T> = `${keyof T}Changed` `` fail to compile?
- [ ] Template literal types cannot use `keyof`
- [x] `keyof T` may include `symbol`, which cannot be interpolated into a string
- [ ] `Changed` must be capitalised
- [ ] Generic types cannot be used in template literal types
> Only string, number, bigint, boolean, null and undefined types can be interpolated. Intersecting with `string` (`keyof T & string`) removes symbol (and number) keys and fixes the error.

Q: Is `"12 px"` assignable to `` `${number}px` `` in TypeScript 6.0?
- [x] Yes, because `"12 "` converts to a finite number with `Number()`
- [ ] No, because of the space
- [ ] Only with `strict` turned off
- [ ] No, because `number` slots only accept integers
> The `${number}` slot accepts any text that JavaScript's numeric conversion turns into a finite number, and `Number("12 ")` is `12`. That is why pattern types are shape hints, not validation. Decimals and exponents are accepted too.

Q: In `` S extends `${infer Head}.${infer Tail}` ``, what does `Head` capture for `S = "a.b.c"`?
- [x] `"a"`
- [ ] `"a.b"`
- [ ] `"a.b.c"`
- [ ] `never`
> An `infer` slot followed by fixed text captures the shortest prefix that lets the rest match, so it stops at the first `"."`. `Tail` then captures `"b.c"`, which is why a recursive `Split` works left to right.
```

## Quick revision {#quick-revision}

- Syntax: backticks with `${Type}` slots; added in TypeScript 4.1; compile-time only.
- Interpolatable: `string`, `number`, `bigint`, `boolean`, `null`, `undefined` (and literals). Not `symbol` or objects.
- Unions in slots → cross product of every combination; watch the multiplication.
- Intrinsics: `Uppercase`, `Lowercase`, `Capitalize` (first char only), `Uncapitalize`; they distribute and need string input.
- With `keyof`: use `keyof T & string` or `string & K`.
- Pattern types: `` `user_${string}` ``, `` `${number}px` ``. `${string}` matches empty; `${number}` accepts anything `Number()` makes finite (`"1e3"`, `" "`). A plain `string` is not assignable.
- Parsing: `` S extends `on${infer E}` ? ... `` ; an `infer` before fixed text takes the shortest match; recurse for splitting and route params.
- Type parameters in patterns are inferred: `` on<K>(e: `${K}Changed`) `` gives `K = "name"` from `"nameChanged"`.
- Unions above 100,000 members → TS2590; thousands already slow the editor.

## Key takeaways {#key-takeaways}

- Template literal types turn string naming conventions into checked types, so typos in event names, props and tokens become compile errors.
- Unions in slots multiply into every combination; that is the feature's power and its main cost.
- Use the intrinsic helpers for case conventions, and intersect `keyof` with `string` before interpolating.
- `string` and `number` slots create loose patterns that check shape, not validity; validate real data at runtime.
- With `infer`, conditional types can parse strings — prefixes, separators and route parameters — recursively.
