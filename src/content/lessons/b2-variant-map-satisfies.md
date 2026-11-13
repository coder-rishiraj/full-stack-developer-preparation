---
summary: A variant map is an object with one entry for every case of a union, such as a style for every button variant or a handler for every action type. You will learn how `satisfies` makes the compiler enforce that every case is present, how mapped types give each handler its own precisely typed argument, and how to dispatch through the map without casts.
difficulty: advanced
minutes: 45
objectives:
  - Build a variant map keyed by a union and use satisfies to enforce that every key is present and no unknown key is added
  - Explain what satisfies preserves in a variant map that a type annotation would discard
  - Type a handler table with a mapped type so each handler receives only its own action variant
  - Diagnose why handlers[action.type](action) fails for a plain union and fix it with a generic, correlated dispatch function
  - Compare a variant map with a switch statement plus assertNever and choose between them
---

## Introduction

Many pieces of front-end code follow the same shape. There is a union of cases — button variants `"primary" | "ghost" | "danger"`, request states `"idle" | "loading" | "error"`, action types `"add" | "toggle" | "clear"` — and for each case you need something: a style, a label, a component, a function that handles it.

You can write that as a `switch` statement, or as an **object with one entry per case**:

```typescript
const BUTTON_STYLES = {
  primary: { bg: "blue", fg: "white" },
  ghost: { bg: "transparent", fg: "blue", border: true },
};
```

This object is a **variant map**: a lookup table keyed by the members of a union, with exactly one entry per member. It is data rather than control flow, so it is easy to read, to extend and to iterate over. The danger is the obvious one: nothing stops you from forgetting an entry when the union grows, or mistyping a key.

This lesson shows how to make the compiler guarantee a variant map is complete and correctly shaped, using `satisfies` ([[b2-satisfies]]) together with `Record` and mapped types, while keeping the precise types of the entries. It then takes the pattern to its most demanding use — a typed table of action handlers, like a reducer — and solves the one typing problem that trips up almost everyone who tries it: calling the right handler without a cast.

## Before you start

- **`satisfies`** — checking a value against a type while keeping its inferred type. See [[b2-satisfies]].
- **`Record` with literal keys** — how `Record<Union, V>` requires every key. See [[b2-record-vs-index-signature]].
- **Discriminated unions** — unions of objects with a shared literal `type` field. See [[b2-discriminated-unions]].
- **Mapped types and indexed access** — `{ [K in Keys]: … }` and `T[K]`. See [[b2-mapped-types]] and [[b2-indexed-access]].
- **Generics** — functions with type parameters such as `<K extends string>`. See [[b2-generics]].

## The intuition

Picture a chessboard rulebook: one page per piece type, and each page describes how *that* piece moves. A good rulebook has three properties. Every piece has a page (completeness). There are no pages for pieces that do not exist (no extras). And each page talks about its own piece — the knight's page does not need to handle the bishop (precise typing per entry).

A variant map with `satisfies` gives you all three. `Record<Union, …>` provides completeness and rejects extras. `satisfies` keeps the details of each page. A mapped type lets each page's function receive only its own case.

## Step 1: a complete, checked map of data

Start with data. Each button variant needs a style:

```typescript
type Variant = "primary" | "ghost";
type Style = { bg: string; fg: string; border?: boolean };

const VARIANTS = {
  primary: { bg: "blue", fg: "white" },
  ghost: { bg: "transparent", fg: "blue", border: true },
} satisfies Record<Variant, Style>;
```

`Record<Variant, Style>` expands to `{ primary: Style; ghost: Style }`, so the check enforces two things. If `Variant` gains `"danger"`, this object fails to compile until a `danger` entry is added. And if you add a key that is not a variant, it fails immediately:

```output
error TS2353: Object literal may only specify known properties, and 'danger' does not exist in type 'Record<Variant, Style>'.
```

That message is what you see when `danger` is in the object but not yet in the union — the check works in both directions.

### What `satisfies` keeps that an annotation discards

You could write `const VARIANTS: Record<Variant, Style> = { … }` and get the same completeness check. The difference is the type of `VARIANTS` afterwards. With `satisfies` it is the inferred type:

```typescript
// typeof VARIANTS:
// { primary: { bg: string; fg: string };
//   ghost: { bg: string; fg: string; border: true } }
```

Every entry keeps its own shape. `VARIANTS.ghost.border` is known to be `true`, and `VARIANTS.primary.border` is a compile error, because that entry has no `border`. With the annotation, every entry would be the general `Style`, so `VARIANTS.primary.border` would be `boolean | undefined` and the compiler could not tell you that primary buttons never have a border.

For a pure data map the difference is sometimes small. It becomes decisive when entries have different shapes — for example, when only some variants carry an icon, or when entries are functions with different parameter types, which is the next step.

## Step 2: a handler table for a discriminated union

Now the harder case. A to-do list is updated by actions:

```typescript
type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "clear" };
```

A classic **reducer** handles them with a `switch`. A variant map replaces the switch with a table: one function per action type. The requirement is that the `add` handler receives an action that is known to have `text`, the `toggle` handler one with `id`, and so on.

`Record<Action["type"], Handler>` is not enough, because a `Record` gives every key the *same* value type. Each key needs a *different* function type, depending on the key. That is what a **mapped type** expresses:

```typescript
type State = { count: number };

type Handlers = {
  [K in Action["type"]]: (state: State, action: Extract<Action, { type: K }>) => State;
};
```

Read it as: "for each action type `K`, a function that takes the state and *the member of `Action` whose `type` is `K`*". `Extract<Action, { type: K }>` picks that member out of the union (see [[b2-utility-types]]). For `K = "add"` it is `{ type: "add"; text: string }`.

Now write the table and check it with `satisfies`:

```typescript
const handlers = {
  add: (s, a) => ({ count: s.count + a.text.length }),
  toggle: (s, a) => ({ count: s.count + a.id }),
  clear: () => ({ count: 0 }),
} satisfies Handlers;
```

Notice that no parameter is annotated. The `satisfies` target acts as a **contextual type**, so TypeScript infers `s: State` and, for the `add` entry, `a: { type: "add"; text: string }`. Writing `a.id` inside `add` would be an error. Leaving out a handler is an error too:

```output
error TS1360: Type '{ add: …; clear: …; }' does not satisfy the expected type 'Handlers'.
  Property 'toggle' is missing in type '{ add: …; clear: …; }' but required in type 'Handlers'.
```

(The function types in the real message are spelled out in full; they are shortened here.)

## Step 3: dispatching through the table

The table exists so you can look up a handler by an action's `type` and call it. The obvious code does not compile:

```typescript
function reduce(state: State, action: Action): State {
  return handlers[action.type](state, action);
}
```

```output
error TS2345: Argument of type 'Action' is not assignable to parameter of type 'never'.
  The intersection '{ type: "add"; text: string; } & { type: "toggle"; id: number; }' was reduced to 'never' because property 'type' has conflicting types in some constituents.
```

The error is confusing until you see the compiler's point of view. `action.type` has type `"add" | "toggle" | "clear"`, so `handlers[action.type]` is "one of the three handlers, I don't know which" — a union of three function types. The only argument that is safe to pass to *some unknown one* of them is an argument all three accept: an action that is simultaneously an add, a toggle and a clear. That intersection is impossible, so the parameter type is `never`.

You know the handler and the action match, because both were chosen by the same `action.type`. But the compiler treats `handlers[action.type]` and `action` as two independent unions; it does not track that they are **correlated**.

### The fix: make the correlation explicit with a generic

Since TypeScript 4.6, the compiler can follow this correlation if you express it with a single type parameter and a mapped type. The recipe has two parts.

First, describe actions as a **map from type name to payload**, and derive the union from it with a mapped type indexed by its own keys:

```typescript
type ActionPayloads = {
  add: { text: string };
  toggle: { id: number };
  clear: {};
};
type ActionType = keyof ActionPayloads;

type Action<K extends ActionType = ActionType> = {
  [P in K]: { type: P } & ActionPayloads[P];
}[K];
```

`Action<"add">` is `{ type: "add" } & { text: string }`, and `Action` with the default is the full union — the same union as before, now generated from one map.

Second, write the dispatcher as a generic over `K`, and read the handler through the mapped `Handlers` type:

```typescript
type Handlers = {
  [K in ActionType]: (state: State, action: Action<K>) => State;
};

function reduce<K extends ActionType>(state: State, action: Action<K>): State {
  const handler: Handlers[K] = handlers[action.type];
  return handler(state, action);
}
```

Inside `reduce`, the handler has type `Handlers[K]`, which TypeScript resolves to `(state: State, action: Action<K>) => State`. The argument has type `Action<K>`. Both are expressed in terms of the same `K`, so they match without any cast, and the compiler never has to consider a mismatched pair.

The annotation `: Handlers[K]` matters. `handlers` has its own inferred type (that is what `satisfies` preserves), and indexing that inferred type with `action.type` gives a union again. Reading the entry *as* `Handlers[K]` — the mapped type, which `handlers` was checked against — is what lets the compiler see the correlation. The alternative is to declare the table with an annotation, `const handlers: Handlers = …`, in which case `handlers[action.type]` is already `Handlers[K]`.

> [!NOTE] When a cast is acceptable
> Many codebases write `(handlers[action.type] as (s: State, a: Action) => State)(state, action)`. It compiles and works, because the runtime lookup is correct. The cost is that the cast would also hide a genuine mismatch. The generic version is the cast-free form; use it when the table is central to the code.

## How it works internally

All of this is compile-time. At runtime `handlers` is a plain object of functions, and `reduce` is a property lookup followed by a call. There is no `switch`, no branching, and the cost of dispatch is one hash-table lookup on the object.

At compile time three mechanisms cooperate:

1. **`satisfies` with a mapped target.** The object literal is checked against `Handlers`; missing and extra keys are reported; each arrow function is contextually typed by its own property's type, which is how `a` gets the narrowed action type.
2. **Mapped types indexed by their own keys.** `Action<K>` is defined as a mapped type indexed by `K`. When `K` is a single literal, it resolves to one variant; when it is the whole union, it resolves to the union of variants.
3. **Correlated generic access (TypeScript 4.6+).** When a function parameter's type and a table entry's type are both written as indexed accesses with the same generic `K` (`Action<K>` and `Handlers[K]`), the checker compares them symbolically instead of expanding each into an independent union. That is why the call type-checks.

`Extract<Action, { type: K }>` and the payload-map form `Action<K>` describe the same variants, and with TypeScript 6.0 a generic dispatcher typed with `Extract` (parameter `Extract<Action, { type: K }>`, handler read as `Handlers[K]`) also compiles. The payload-map form is shown in the worked example because it keeps every action's name and payload in one editable map.

## Worked example: a to-do reducer

This complete program compiles under `strict` and `noUncheckedIndexedAccess` and contains no casts in the dispatch path.

```typescript title="variants.ts"
// 1. One map describes every action: its name and its payload
type ActionPayloads = {
  add: { text: string };
  toggle: { id: number };
  clear: {};
};
type ActionType = keyof ActionPayloads;

// 2. The union of actions is derived from the map
type Action<K extends ActionType = ActionType> = {
  [P in K]: { type: P } & ActionPayloads[P];
}[K];

type Todo = { id: number; text: string; done: boolean };
type State = { nextId: number; todos: Todo[] };

// 3. The handler table: one handler per action, each with its own action type
type Handlers = {
  [K in ActionType]: (state: State, action: Action<K>) => State;
};

const handlers = {
  add: (s, a) => ({
    nextId: s.nextId + 1,
    todos: [...s.todos, { id: s.nextId, text: a.text, done: false }],
  }),
  toggle: (s, a) => ({
    ...s,
    todos: s.todos.map((t) => (t.id === a.id ? { ...t, done: !t.done } : t)),
  }),
  clear: (s) => ({ ...s, todos: s.todos.filter((t) => !t.done) }),
} satisfies Handlers;

// 4. Generic dispatch keeps the action type and its handler correlated
function reduce<K extends ActionType>(state: State, action: Action<K>): State {
  const handler: Handlers[K] = handlers[action.type];
  return handler(state, action);
}

const actions: Action[] = [
  { type: "add", text: "Write lesson" },
  { type: "add", text: "Review lesson" },
  { type: "toggle", id: 0 },
  { type: "clear" },
];

const final = actions.reduce(reduce, { nextId: 0, todos: [] } as State);
console.log(final.todos);
console.log(Object.keys(handlers));
```

```output
[ { id: 1, text: 'Review lesson', done: false } ]
[ 'add', 'toggle', 'clear' ]
```

Trace the run. The first two actions add to-dos with ids 0 and 1. The `toggle` with `id: 0` marks the first one done. `clear` removes done to-dos, so only `"Review lesson"` remains. `Array.prototype.reduce` calls our `reduce` once per action, threading the state through.

Now trace the types. `ActionPayloads` is the single source of truth: adding `remove: { id: number }` there automatically adds a variant to `Action`, a required key to `Handlers`, and therefore a compile error on `handlers` until the new handler exists. Inside `add`, `a.text` is a `string`; inside `toggle`, `a.id` is a `number`; neither can see the other's fields. `{ nextId: 0, todos: [] } as State` gives the initial value the right type — without it, `todos` would be inferred as `never[]`.

Finally, `Object.keys(handlers)` shows the map is ordinary data at runtime, which is useful for things like listing available commands in a UI.

```quiz
Q: Why does `handlers[action.type](state, action)` fail when `action: Action` is a plain union?
- [ ] `handlers` has no index signature
- [x] The lookup gives a union of handler functions, and the only argument safe for all of them is the impossible intersection of all actions
- [ ] `satisfies` makes the handlers readonly
- [ ] `action.type` is widened to `string`
> The compiler does not know the handler and the action were chosen by the same key. Calling a union of functions requires an argument acceptable to every member, which is an action that is simultaneously every variant: `never`.

Q: What does `satisfies Handlers` give you that `Record<Action["type"], Handler>` with a single `Handler` type cannot?
- [ ] A runtime check that every handler exists
- [ ] Faster dispatch
- [x] A different, precisely typed action parameter for each key, inferred without annotations
- [ ] Protection against reassigning the object
> `Record` gives every key the same value type. The mapped type `Handlers` gives each key its own function type, and `satisfies` uses it as a contextual type, so each arrow function's `a` parameter is inferred as that key's variant.

Q: In the generic `reduce<K extends ActionType>`, why is the handler read as `Handlers[K]`?
- [ ] It is required syntax for indexing with a generic
- [x] Both the handler type and the action type are then expressed in terms of the same `K`, so the compiler can see they match
- [ ] It converts the handler to `any`
- [ ] It makes the function run faster
> `satisfies` leaves `handlers` with its inferred type, and indexing that with `action.type` produces a union again. Reading the entry as `Handlers[K]` gives `(state: State, action: Action<K>) => State`, which accepts exactly the `Action<K>` the function received.
```

## In real systems

**Reducers and state machines.** Redux Toolkit's `createSlice` takes an object of case reducers keyed by action name — the same idea, with the library generating the action types. Hand-written reducers and XState-style machines use handler tables per state or event.

**Component variants.** Design systems map each variant or size to class names or style objects: `satisfies Record<Variant, string>` makes adding a variant a compile error in every map that needs a value for it.

**Event and message routing.** WebSocket or `postMessage` handlers keyed by message type, command palettes keyed by command id, and analytics event schemas keyed by event name all use the payload-map form, `{ [Name]: Payload }`, to derive both the message union and the handler table.

**Rendering by state.** Components that render a different view per request status (`idle`, `loading`, `success`, `error`) can use a variant map of render functions, each receiving the state variant with its own data.

## Trade-offs and alternatives

The main alternative is a **`switch` with exhaustiveness checking**:

```typescript
function reduceSwitch(state: State, action: Action): State {
  switch (action.type) {
    case "add": return handlers.add(state, action);
    case "toggle": return handlers.toggle(state, action);
    case "clear": return handlers.clear(state);
    default: {
      const unreachable: never = action;   // fails to compile if a case is missing
      return unreachable;
    }
  }
}
```

Each `case` narrows `action` to one variant, and the `never` assignment in `default` fails to compile when a variant is unhandled — the [[b2-exhaustiveness-assertnever]] technique.

| | Variant map with `satisfies` | `switch` with `assertNever` |
|---|---|---|
| Exhaustiveness | Missing key is a compile error | Missing case is a compile error |
| Per-case typing | Mapped type plus contextual typing | Narrowing in each `case` |
| Data available at runtime | Yes: keys can be listed, entries passed around | No |
| Dispatch typing | Needs the generic correlated pattern | Works directly |
| Cases sharing logic | Shared helper functions | Fall-through or shared code in one function |
| Readability for many cases | A flat table | A long function |

Prefer a **variant map** when entries are data (styles, labels, components), when the set of cases should be introspectable at runtime, or when handlers are written in different places and composed. Prefer a **switch** for a handful of cases with closely related logic, or when the dispatch typing is more machinery than the problem deserves.

## Common mistakes

> [!MISTAKE] Typing the map with `Record<string, Handler>`
> An open `Record<string, …>` accepts any keys, so nothing reports a missing handler and typos become new keys. Key the map by the union (`Record<Variant, …>` or a mapped type over `Action["type"]`).

**Annotating instead of using `satisfies` for data maps.** `const STYLES: Record<Variant, Style>` makes every entry the general `Style`, so per-entry details (which variants have a border or an icon) are lost.

**Using one handler type for every key.** `Record<ActionType, (a: Action) => State>` forces each handler to accept every action and narrow it again. Use a mapped type so each key gets its own variant.

**Casting at the dispatch site without understanding why.** `handlers[action.type](action as any)` compiles and hides real mismatches. Use the generic correlated dispatcher, or at least cast to a precise function type.

**Defining the union and the payloads separately.** If `Action` and `ActionPayloads` are written independently, they can drift. Derive one from the other.

## Interview perspective

This pattern comes up in senior front-end interviews as "type this reducer without `any`" or "how would you make sure every variant is handled?".

> [!INTERVIEW] A strong answer
> "I'd key a handler table by the action type with a mapped type, so each handler gets `Extract<Action, { type: K }>` and `satisfies` reports a missing or extra handler while inferring the parameter types. The direct call `handlers[action.type](action)` fails because the compiler sees two independent unions and needs an argument that satisfies all handlers, which is `never`. I'd fix it with a generic dispatcher over `K`, deriving `Action<K>` from a payload map, so the handler and action types are correlated — TypeScript supports that since 4.6."

Follow-ups to prepare for:

- **"Why not just a switch?"** It is a fine choice; compare exhaustiveness, runtime introspection and per-case typing as in the table above.
- **"What does `satisfies` add over an annotation here?"** Preserved per-entry types for data maps; for handler tables, contextual typing works with either, and `satisfies` keeps the inferred return types.
- **"How do you add a new action safely?"** Add it to the payload map; the compiler then lists every table and switch that must change.

## Practice

1. Write a variant map from `type Toast = "info" | "success" | "error"` to `{ icon: string; timeoutMs: number | null }` using `satisfies`. Add `"warning"` to the union and fix the error.
2. Extend the to-do reducer with `rename: { id: number; text: string }`. Note each place the compiler asks you to change.
3. Write `render` for `type Request = { status: "idle" } | { status: "loading" } | { status: "error"; message: string } | { status: "done"; data: string[] }` as a variant map of functions returning strings, with a generic dispatcher.
4. Rewrite the reducer's dispatch as a `switch` with a `never` check, and compare both versions for clarity.

## Quick revision {#quick-revision}

- Variant map: an object with exactly one entry per member of a union.
- `satisfies Record<Union, V>` → missing keys and unknown keys are compile errors; entries keep their inferred types.
- Different value type per key → mapped type: `{ [K in Union]: (a: Extract<Action, { type: K }>) => R }`.
- `satisfies` contextually types handler parameters, so no annotations are needed.
- `handlers[action.type](action)` with a plain union fails: union of functions → parameter `never`.
- Fix (TS 4.6+): payload map → `Action<K>` mapped type indexed by `K`; generic `reduce<K>`; read the handler as `Handlers[K]`.
- Alternative: `switch` plus `never` exhaustiveness check.
- Everything is erased; at runtime it is one property lookup and a call.

## Key takeaways {#key-takeaways}

- A variant map turns per-case logic into data that the compiler can check for completeness.
- `satisfies` gives both completeness checking and precise per-entry types; an annotation keeps only the first.
- A mapped type gives each key its own handler signature, so each handler sees only its own variant.
- Calling through the map needs the handler and argument to share one generic key; otherwise the compiler sees independent unions.
- Choose between a variant map and an exhaustive `switch` by whether the cases are data, need runtime introspection, or are few and closely related.
