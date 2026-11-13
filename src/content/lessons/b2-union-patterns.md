---
summary: Unions and intersections become powerful when combined into a few standard patterns — state modelled as a discriminated union, exhaustive handling with `assertNever`, action unions for reducers, narrowing array filters, complete lookup tables, and props composed with intersections. You will learn each pattern, the bug it prevents, and how they fit together in a real UI state machine.
difficulty: intermediate
minutes: 50
objectives:
  - Replace "optional everything" state objects with discriminated unions that make impossible states unrepresentable
  - Enforce exhaustive handling of a union with a `never`-based `assertNever` check
  - Model reducer state and actions as unions and narrow both inside a `switch`
  - Narrow arrays with type predicates (including inferred predicates in TypeScript 5.5+) and slice unions with `Extract` and `Exclude`
  - Compose component props with intersections and `Omit`, and express mutually exclusive props with `never`
---

## Introduction

[[b2-unions]] taught what `A | B` and `A & B` mean and how narrowing works. This lesson is about using them well. Most of the value comes from a small set of patterns that experienced frontend engineers reach for again and again, because each one removes a whole category of bug:

- A loading spinner that keeps spinning after an error, because `isLoading` and `error` were separate flags and one was not reset.
- A new order status shipped to production without a label, because nothing forced the label table to change.
- A `filter` that removes `null`s but leaves the array typed as possibly-null, so every later line needs a `!`.
- A custom input component whose `onChange` receives the wrong argument because its props were merged carelessly with native attributes.

Each pattern below is presented as: the problem, the pattern, why it works, and its limits. The final worked example combines them into a small state machine for a search screen. These patterns are standard material in senior frontend interviews, and they all depend on one idea from the previous lesson: a union with a literal **discriminant** property can be narrowed, case by case, by the compiler.

## Before you start

- **Union and intersection types** — and narrowing with `typeof`, `in` and equality. See [[b2-unions]] and [[b2-intersections]].
- **Literal types** — `"loading"` as a type. See [[b2-literal-types]].
- **Type aliases and utility types** — `type`, `Omit`, `Record`. See [[b2-type-aliases]] and [[b2-utility-types]].
- **`never`** — the type with no values. See [[b2-never]].

## The intuition: a state machine on types

Think of a traffic light. It can be red, amber or green. It is never "red and green", and "green with a countdown of 5 seconds to red" is meaningful only in certain states. If you modelled it as three booleans (`isRed`, `isAmber`, `isGreen`), eight combinations would be representable and only three would be valid. Every function touching the light would have to defend against the other five.

Union patterns apply that thinking to types: list the **valid states**, give each its own shape with exactly the data that state has, and make everything else impossible to construct. The compiler then does the defending for you. The guiding phrase, borrowed from functional programming, is **"make impossible states unrepresentable."**

## Pattern 1: state as a discriminated union

### The problem

Here is the most common way to type a request's state, and the bug it allows:

```typescript title="bad-state.ts"
type FetchState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};

const nonsense: FetchState<string> = { loading: true, data: "x", error: "boom" };
```

That compiles. Is the request loading, finished or failed? The type allows all three at once, and also `{ loading: false }` with neither data nor error. Rendering code ends up with ordered `if` checks that must guess which flag is authoritative, and the bug in the introduction — a spinner shown alongside an error — is one forgotten `loading: false` away.

### The pattern

Give each state its own object type, with a shared literal property naming it:

```typescript title="good-state.ts"
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

Now there is no way to build "loading with an error", and `data` exists only in the `success` state. The shared `status` property is the **discriminant**: because its type is a different literal in each member, checking it tells the compiler exactly which member you have.

```typescript title="render-state.ts"
function render(state: FetchState<string[]>): string {
  switch (state.status) {
    case "idle":
      return "Search for something";
    case "loading":
      return "Loading...";
    case "success":
      return state.data.join(", ");   // data is available only here
    case "error":
      return `Failed: ${state.error}`;
  }
}
```

Inside each `case`, `state` is narrowed to one member, so `state.data` compiles in `success` and is an error anywhere else. Every state transition must build a whole new state object, which is exactly what stops stale flags from surviving. This specific four-state shape is common enough to have its own lesson, [[b2-remote-data-pattern]]; the general technique is taught in [[b2-discriminated-unions]].

A discriminant is usually a string literal (`status`, `type`, `kind`), but booleans (`ok: true` / `ok: false`) and numbers work too. It must be a literal type in every member; a member with `status: string` breaks narrowing for the whole union.

## Pattern 2: exhaustive handling with `assertNever`

### The problem

Six months later, someone adds `{ status: "cancelled" }` to `FetchState`. The `render` function above has no `default`, so for a cancelled request it falls off the end of the `switch` and returns `undefined` — but under `strict` the compiler *does* catch this one, because the function's declared return type is `string` and not every path returns. Functions that return `void`, or that handle cases with `if` chains and a fallback, get no such help: the new state silently takes the fallback path.

### The pattern

Add a `default` branch that passes the narrowed value to a function accepting only `never`:

```typescript title="assert-never.ts"
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.side ** 2;
    default:
      return assertNever(s);   // error: triangle is not handled
  }
}
```

```output
error TS2345: Argument of type '{ kind: "triangle"; base: number; height: number; }' is not assignable to parameter of type 'never'.
```

Why it works: each `case` removes one member from the union. If every member is handled, nothing is left in `default`, and `s` has type `never` — so passing it to `assertNever` compiles. If a member is unhandled, `s` is that member in `default`, which is not assignable to `never`, and the error message names the missing case. The function also throws at runtime, which protects you when bad data (say, an unexpected `kind` from an API) arrives despite the types. More variants, including `satisfies never`, are in [[b2-exhaustiveness-assertnever]].

## Pattern 3: action unions for reducers

### The problem

A reducer (in `useReducer`, Redux or any event-driven store) receives actions of many kinds, each with its own payload. Typing the action as `{ type: string; payload?: any }` loses all checking: a typo in `type` is never caught and `payload` can be anything.

### The pattern

Model actions as a discriminated union on `type`:

```typescript title="actions.ts"
type CartAction =
  | { type: "add"; sku: string; quantity: number }
  | { type: "remove"; sku: string }
  | { type: "clear" };
```

Inside `switch (action.type)`, each case sees exactly its payload: `action.quantity` exists only in `"add"`. Dispatching `{ type: "add", sku: "MUG" }` without `quantity` is a compile error, as is `{ type: "ad" }`. Combined with a state union (Pattern 1) and `assertNever` (Pattern 2), the reducer is checked on both axes: every action is handled, and each produces a valid state. The worked example below shows this in full.

## Pattern 4: narrowing arrays with type predicates

### The problem

Filtering an array of a union usually means "keep only the members of one kind". Historically, `Array.prototype.filter` did not narrow the element type, so you were left with the full union afterwards.

### The pattern

`filter` has an overload that accepts a **type predicate** — a function whose return type is `x is T` — and returns `T[]`. You can write the predicate explicitly:

```typescript title="filter-explicit.ts"
type Result =
  | { ok: true; value: number }
  | { ok: false; error: string };

const results: Result[] = [
  { ok: true, value: 1 },
  { ok: false, error: "timeout" },
  { ok: true, value: 3 },
];

const successes = results.filter(
  (r): r is Extract<Result, { ok: true }> => r.ok,
);
console.log(successes.map((r) => r.value));   // r.value is known
```

```output
[ 1, 3 ]
```

Since **TypeScript 5.5**, the compiler can also **infer** a type predicate from a simple arrow function, so `results.filter((r) => r.ok)` is already typed `{ ok: true; value: number }[]`, and `[1, null, 2].filter((x) => x !== null)` is `number[]`. On older compiler versions you need the explicit `x is T` annotation. One exception catches people: `values.filter(Boolean)` does **not** narrow, because `Boolean` is a constructor, not a predicate; the result keeps `null` and `undefined` in its type. Write `filter((x) => x != null)` instead. Custom predicates are covered in [[b2-custom-type-guards]].

## Pattern 5: slicing unions with `Extract`, `Exclude` and indexed access

Once a union exists, you often need a piece of it. Three tools do this without repeating any types:

```typescript title="slice-unions.ts"
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

type ShapeKind = Shape["kind"];                          // "circle" | "square" | "triangle"
type Circle = Extract<Shape, { kind: "circle" }>;       // the circle member
type Polygon = Exclude<Shape, { kind: "circle" }>;      // square | triangle
```

`Shape["kind"]` reads the discriminant across all members, giving the union of kind names. `Extract<U, X>` keeps the members of `U` assignable to `X`; `Exclude<U, X>` removes them. Both work by distributing over each union member, a behaviour of conditional types explained in [[b2-conditional-types]]. Deriving these types means adding a new shape updates them all.

## Pattern 6: complete lookup tables with `satisfies`

### The problem

Not every union is handled by a `switch`. Labels, icons, colours and renderers per state are often stored in an object keyed by the discriminant. When a new member is added, nothing forces the table to grow.

### The pattern

Check the table against a type that requires every key, using `satisfies` so the table keeps its precise type:

```typescript title="lookup-table.ts"
const renderers = {
  circle: (s) => `circle r=${s.r}`,
  square: (s) => `square side=${s.side}`,
} satisfies {
  [K in Shape["kind"]]: (shape: Extract<Shape, { kind: K }>) => string;
};
```

```output
error TS1360: Type '{ circle: ...; square: ...; }' does not satisfy the expected type '{ ...; triangle: (s: { kind: "triangle"; base: number; height: number; }) => string; }'.
  Property 'triangle' is missing in type ...
```

(The real message prints every function type in full; it is shortened here.)

The required type is a **mapped type**: for each kind `K`, a function taking exactly the matching member. That gives two checks at once. A missing kind is an error, as shown. And each renderer's parameter is contextually typed from its own member, so `s.r` compiles in `circle` and would be an error in `square`. For simpler tables, `satisfies Record<Status, string>` is enough. See [[b2-satisfies]] and [[b2-variant-map-satisfies]].

## Pattern 7: composing props with intersections

### The problem

A custom component usually accepts its own props plus the native attributes of the element it wraps. Intersecting the two naively breaks when a name overlaps:

```typescript title="naive-props.ts"
type NativeInputAttrs = {
  id?: string;
  className?: string;
  value?: string | number;
  onChange?: (event: Event) => void;
};

type OwnProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;   // our component passes the string, not the event
};

type Naive = OwnProps & NativeInputAttrs;

const p: Naive = {
  label: "Name",
  value: "Ada",
  onChange: (v) => console.log(v.toUpperCase()),   // error
};
```

```output
error TS2339: Property 'toUpperCase' does not exist on type 'string | Event'.
  Property 'toUpperCase' does not exist on type 'Event'.
```

`onChange` exists in both parts, so its type is the intersection of two function types — an overloaded function — and the callback's parameter is inferred as `string | Event`. The intersection did exactly what it promises; it is just not what was meant.

### The pattern

Remove the overlapping keys from the native side before intersecting:

```typescript title="omit-props.ts"
type TextFieldProps = OwnProps & Omit<NativeInputAttrs, keyof OwnProps>;

const ok: TextFieldProps = {
  label: "Name",
  value: "Ada",
  onChange: (v) => console.log(v.toUpperCase()),   // v: string
  className: "field",
};
```

`keyof OwnProps` is `"label" | "value" | "onChange"`, so `Omit` drops `value` and `onChange` from the native attributes, and your own definitions win. In React the same shape is written `OwnProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof OwnProps>`; see [[b2-react-component-props]].

### Mutually exclusive props with `never`

The opposite need — "pass `href` or `onClick`, never both" — combines a union with intersections and the `never` type:

```typescript title="exclusive.ts"
type ButtonProps = { label: string } & (
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never }
);

const both: ButtonProps = { label: "Go", href: "/", onClick: () => {} };   // error
```

```output
error TS2322: Type '{ label: string; href: string; onClick: () => void; }' is not assignable to type 'ButtonProps'.
  Types of property 'onClick' are incompatible.
    Type '() => void' is not assignable to type 'undefined'.
```

An optional property of type `never` can only be absent (or `undefined`), so each member forbids the other's key. Without those `?: never` entries, an object with both keys would satisfy the union, as [[b2-unions]] showed. The technique is developed in [[b2-mutually-exclusive-props]].

## How it works internally

All seven patterns rest on three compiler mechanisms:

| Mechanism | Patterns that use it |
|---|---|
| **Discriminant narrowing** — checking a literal property filters a union's members in each branch | 1, 2, 3, 4 |
| **`never` as the empty set** — a fully narrowed union is `never`; `never` absorbs in unions and forbids values in properties | 2, 7 (exclusive props) |
| **Distribution over unions** — conditional and mapped types apply to each member separately | 5, 6 |

The compiler tracks narrowing per variable through the control-flow graph, as described in [[b2-unions]]. A `switch` on a discriminant creates one branch per `case`, each with the union filtered to matching members; the `default` branch gets what is left. When nothing is left, the variable's type in that branch is `never`, which is what `assertNever` detects. Nothing here has a runtime cost: the discriminant is an ordinary property, and the `switch` is ordinary JavaScript. The types simply let the compiler reason about the code you would have written anyway.

## Worked example: a search screen state machine

A photo search screen can be idle, loading, showing results, or showing an error. Actions come from the UI and from the network. This program combines the state union, the action union, a reducer narrowed on both, and exhaustive checks. It runs as-is with Node 22.18 or later, which strips TypeScript syntax natively.

```typescript title="gallery.ts"
type Photo = { id: number; title: string };

// Every state the gallery can be in, and only the data valid in that state
type GalleryState =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "success"; query: string; photos: Photo[] }
  | { status: "error"; query: string; message: string };

// Everything that can happen to it
type GalleryAction =
  | { type: "search"; query: string }
  | { type: "loaded"; photos: Photo[] }
  | { type: "failed"; message: string }
  | { type: "reset" };

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

function reducer(state: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case "search":
      return { status: "loading", query: action.query };
    case "loaded":
      // Results only make sense if we were waiting for them
      return state.status === "loading"
        ? { status: "success", query: state.query, photos: action.photos }
        : state;
    case "failed":
      if (state.status !== "loading") return state;
      return { status: "error", query: state.query, message: action.message };
    case "reset":
      return { status: "idle" };
    default:
      return assertNever(action);
  }
}

function view(state: GalleryState): string {
  switch (state.status) {
    case "idle":
      return "Type to search";
    case "loading":
      return `Searching "${state.query}"...`;
    case "success":
      return state.photos.length === 0
        ? `No results for "${state.query}"`
        : `${state.photos.length} photos: ${state.photos.map((p) => p.title).join(", ")}`;
    case "error":
      return `Error: ${state.message}`;
    default:
      return assertNever(state);
  }
}

const actions: GalleryAction[] = [
  { type: "loaded", photos: [{ id: 0, title: "stale" }] }, // ignored: not loading
  { type: "search", query: "cats" },
  { type: "loaded", photos: [{ id: 1, title: "Tabby" }, { id: 2, title: "Siamese" }] },
  { type: "search", query: "dragons" },
  { type: "failed", message: "Network unreachable" },
  { type: "reset" },
];

let state: GalleryState = { status: "idle" };
for (const action of actions) {
  state = reducer(state, action);
  console.log(`${action.type.padEnd(7)} -> ${view(state)}`);
}
```

```output
loaded  -> Type to search
search  -> Searching "cats"...
loaded  -> 2 photos: Tabby, Siamese
search  -> Searching "dragons"...
failed  -> Error: Network unreachable
reset   -> Type to search
```

Trace the run. The first action is a `loaded` that arrives while idle — the kind of late response from an earlier request that causes real bugs. The reducer narrows on `action.type` to reach the `"loaded"` case, then narrows `state` with `state.status === "loading"`; since the state is idle, it is returned unchanged, and the stale photos are discarded. `search` moves to `loading` and records the query. The next `loaded` finds the state loading, so it can read `state.query` (which exists only on loading and later states) and builds a `success` state. The `failed` action after the second search produces an `error` state carrying the query and message. `reset` returns to idle.

Two narrowings happen in the reducer at once: `action` is narrowed by the `switch`, and `state` by the `if` or conditional. In `"loaded"`, writing `state.query` *before* the status check would be an error, because idle has no `query`. That one error message is the compiler stopping the late-response bug.

Now try extending it. Add `| { type: "retry" }` to `GalleryAction`, and `reducer` fails at `assertNever(action)` until you add a case. Add `| { status: "empty"; query: string }` to `GalleryState`, and `view` fails until you render it. Each new state or action produces a compile error in every place that must change, which is the property that keeps this kind of code correct as it grows.

## In real systems

**React state.** `useReducer` with state and action unions is the idiomatic way to manage multi-step UI (wizards, uploads, checkout). Data-fetching libraries such as TanStack Query expose a `status` field that narrows `data` and `error` in the same way.

**Redux and event systems.** Redux Toolkit generates action types that form a discriminated union; analytics events and WebSocket messages are typically modelled as `type ServerMessage = { type: "chat"; ... } | { type: "presence"; ... }` and dispatched with an exhaustive `switch`.

**API layers.** Responses as `Result<T, E>` unions, and errors as unions of known error codes, so the UI must handle each.

**Design systems.** Component props composed with `OwnProps & Omit<NativeProps, keyof OwnProps>`, variant tables checked with `satisfies`, and exclusive props for link-or-button components.

## Trade-offs

Discriminated unions cost more code up front than a single object with optional fields: each transition builds a full new object, and reading data requires narrowing. In return, invalid combinations cannot exist and every handler is checked for completeness. For a flag that genuinely varies independently (a `darkMode` boolean alongside everything else), a union is overkill — only use one when states are mutually exclusive.

`assertNever` and `satisfies` tables only help if every handler uses them; a single `if`-chain with a silent fallback reopens the gap. Exclusive-prop and `Omit`-composition types produce verbose error messages that newcomers find hard to read, so keep them in shared, well-named aliases.

## Common mistakes

> [!MISTAKE] Optional fields for every state
> `{ isLoading: boolean; data?: T; error?: string }` lets `{ isLoading: true, error: "x" }` exist and forces every consumer to guess which field wins. Model each state as its own union member.

**A non-literal discriminant.** If one member declares `status: string`, checking `status === "success"` no longer narrows reliably. Every member's discriminant must be a literal (or union of literals).

**Destructuring the discriminant away too early.** `const { status, data } = state` fails to compile on a union (`data` is not on every member). Narrow first, then destructure inside the branch.

**Using `filter(Boolean)` to remove nulls.** The values are removed at runtime but the type still contains `null`. Use `filter((x) => x != null)` (TypeScript 5.5+) or an explicit predicate.

**Writing a predicate that lies.** `(x): x is User => true` compiles, and the compiler believes it. A type predicate is a promise you make; the compiler does not verify its body.

**Intersecting props that share keys.** Overlapping function props become overloads, overlapping data props may become `never`. Use `Omit<Native, keyof Own>`.

## Interview perspective

**"How would you type the state of a data-fetching component?"** Present the discriminated union with `idle`, `loading`, `success` and `error`, explain why it beats boolean flags (impossible states), and show narrowing on `status` giving access to `data` only on success.

**"How do you make sure a new union member is handled everywhere?"** `assertNever` in the `default` branch, or `satisfies` on lookup tables; explain that the narrowed value is `never` only when all cases are handled.

**"Type a reducer."** State union plus action union, `switch` on `action.type`, narrow `state` where a transition depends on the current state, `assertNever` for actions.

**Follow-up: "Why doesn't `arr.filter(Boolean)` narrow?"** `Boolean` is not declared as a type predicate; since TypeScript 5.5 an arrow function like `x => x != null` is inferred as one.

**Follow-up: "How do you accept native input attributes but override `onChange`?"** `OwnProps & Omit<NativeAttrs, keyof OwnProps>`, explaining the overload problem with a plain intersection.

## Practice

1. Convert `{ isSubmitting: boolean; success?: boolean; errors?: string[] }` for a form into a discriminated union. List the states first, then write the type and a `render` function with `assertNever`.
2. Write a `useReducer`-style reducer for a todo list with actions `add`, `toggle`, `remove` and `clearCompleted`. Add an `edit` action afterwards and follow the compiler errors.
3. Given `type Event = { type: "click"; x: number; y: number } | { type: "key"; key: string } | { type: "scroll"; delta: number }`, derive `EventType`, `KeyEvent` and `PointerLikeEvent` (everything except key) without repeating fields.
4. Write a `handlers` object with one handler per `Event` type, checked with `satisfies` and a mapped type so each handler receives its own member.
5. Write `type LinkOrButton` with exclusive `href` and `onClick`, and check that passing both, or neither, is rejected.

```quiz
Q: Why does `{ status: "loading" } | { status: "success"; data: T }` prevent a "loading with data" bug that `{ loading: boolean; data?: T }` allows?
- [ ] Because unions are checked at runtime
- [x] Because no member of the union has both `status: "loading"` and `data`, so such an object cannot be constructed
- [ ] Because `data` is required in the second type
- [ ] Because string literals are faster to compare than booleans
> A discriminated union lists only valid combinations. An object literal with `status: "loading"` must match the first member, which has no `data`, so excess property checking rejects it. Nothing is checked at runtime; the protection is entirely in the types.
```

```quiz
Q: In `default: return assertNever(shape);`, when does the call compile?
- [ ] Always, because `assertNever` throws
- [x] Only when every member of the union has been handled by earlier cases, leaving `shape` as `never`
- [ ] Only when `strictNullChecks` is off
- [ ] Only when the union has a `default` member
> Each `case` removes one member. If any member is unhandled, `shape` in `default` is that member, which is not assignable to the `never` parameter, and the error names the missing case.
```

```quiz
Q: With TypeScript 5.5 or later, what is the type of `[1, null, 2].filter(Boolean)`?
- [ ] `number[]`
- [x] `(number | null)[]`
- [ ] `boolean[]`
- [ ] `never[]`
> `Boolean` is not a type predicate, so `filter` falls back to the overload that keeps the element type. An arrow function such as `(x) => x !== null` is inferred as a predicate in TypeScript 5.5+, giving `number[]`.
```

```quiz
Q: `OwnProps` has `onChange: (value: string) => void`, and `NativeAttrs` has `onChange?: (e: Event) => void`. What fixes `OwnProps & NativeAttrs` so callbacks receive a `string`?
- [ ] `OwnProps | NativeAttrs`
- [ ] `Partial<OwnProps & NativeAttrs>`
- [x] `OwnProps & Omit<NativeAttrs, keyof OwnProps>`
- [ ] `NativeAttrs & OwnProps`, because the last type wins
> Intersecting two function types for the same key creates an overload, so the parameter is inferred as `string | Event`. Omitting the overlapping keys from the native side leaves only your definition. Intersection order does not matter, and a union would accept either shape rather than combine them.
```

## Quick revision {#quick-revision}

- Make impossible states unrepresentable: one union member per state, carrying only that state's data, with a literal discriminant (`status`, `type`, `kind`, `ok`).
- Narrow on the discriminant with `switch`/`if`; destructure only after narrowing.
- Exhaustiveness: `default: return assertNever(x)` where `assertNever(value: never): never` throws; error names the unhandled member.
- Reducers: state union + action union; narrow `action.type`, then `state.status` where transitions depend on it.
- Array narrowing: `filter((x): x is T => ...)`; TypeScript 5.5+ infers predicates from simple arrows; `filter(Boolean)` does not narrow.
- Slice unions: `U["kind"]`, `Extract<U, { kind: "a" }>`, `Exclude<U, { kind: "a" }>`.
- Complete tables: `satisfies Record<Kind, V>` or `satisfies { [K in Kind]: (x: Extract<U, { kind: K }>) => R }`.
- Props: `OwnProps & Omit<Native, keyof OwnProps>`; plain intersection turns overlapping callbacks into overloads.
- Exclusive props: `A & ({ x: X; y?: never } | { y: Y; x?: never })`.
- All patterns are zero-cost at runtime; they rely on discriminant narrowing, `never`, and distribution over unions.

## Key takeaways {#key-takeaways}

- Modelling each state as its own union member removes whole classes of UI bugs by making invalid combinations impossible to construct.
- Narrowing on a literal discriminant is the engine behind every pattern here, from reducers to lookup tables.
- `assertNever` and `satisfies` turn "we added a new case" into compile errors at every place that must change.
- Type predicates and `Extract`/`Exclude` let you work with parts of a union without repeating types.
- Intersections compose props and capabilities, but overlapping keys need `Omit`, and `?: never` is the tool for "one or the other, not both".
