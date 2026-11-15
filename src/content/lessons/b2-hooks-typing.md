---
summary: Hooks are ordinary generic functions, so most of their types come from inference — but the places where inference guesses wrong (empty arrays, `null` initial state, DOM refs, context defaults, returned tuples) are exactly where typed React code breaks. You will learn how each built-in hook is typed in React 19, when to annotate, and how to write custom hooks whose types are as precise as the built-in ones.
difficulty: intermediate
minutes: 45
objectives:
  - Predict what type `useState` infers from its initial value, and annotate it when the initial value is `null` or an empty array
  - Type `useReducer` with a discriminated action union and enforce exhaustive handling of actions
  - Choose the right `useRef` form for DOM nodes and for mutable values under React 19's types
  - Type context so consumers never see a `null` they have to check, using a guarded custom hook
  - Design generic custom hooks that return correctly typed tuples or objects
---

## Introduction

Hooks are how React function components hold state, run effects, read context and keep references ([[b4-hooks-model]]). From TypeScript's point of view, a hook is not special: `useState` is a generic function declared in `@types/react`, and calling it is like calling any other generic function. That is good news, because it means everything you know about [[b2-generics|generics]] and [[b2-type-inference|inference]] applies — and most hook calls need no annotation at all.

The problems are concentrated in a handful of situations where the value you pass does not describe the values you will store later. `useState(null)` for data that has not loaded yet, `useState([])` for a list that starts empty, `useRef(null)` for a DOM node React will attach later, `createContext(null)` for a value supplied by a provider. In each case inference sees only the initial value and draws the wrong conclusion, and the resulting errors appear somewhere else, far from the cause.

This lesson goes through the built-in hooks one by one, showing what inference produces, when it is wrong, and what to write instead. It uses the types from `@types/react` 19, which changed several hook signatures compared with React 18; older answers on the internet often show patterns that no longer compile. It ends with custom hooks, where *you* design the types.

## Before you start

- **React hooks** — what `useState`, `useReducer`, `useRef`, `useContext` and `useEffect` do. See [[b4-usestate]], [[b4-usereducer]], [[b4-useref]], [[b4-usecontext]] and [[b4-useeffect]].
- **Generics and inference** — how a type argument is inferred from a function's arguments. See [[b2-generics]] and [[b2-type-inference]].
- **Discriminated unions and `never`** — for reducer actions. See [[b2-discriminated-unions]] and [[b2-exhaustiveness-assertnever]].
- **Tuples and `as const`** — for hooks that return pairs. See [[b2-tuples]] and [[b2-as-const]].
- **Typing components** — props and events. See [[b2-react-typescript]].

## The intuition: inference sees only the first value

Think of a hook's type argument as a box label written by someone who sees only the first item put into the box. Put in `0` and the label says "numbers" — correct, because a counter only ever holds numbers. Put in nothing (`null`) and the label says "nothing" — and later, when you try to store a user, the label rejects it. Put in an empty array and the label says "array of nothing" (`never[]`).

So the rule is: **if the initial value is representative of all future values, let inference work; if it is a placeholder, write the label yourself** with an explicit type argument.

## `useState`

`useState` is declared roughly as `function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]`. `S` is inferred from the argument, and the tuple's first element is the current state, the second the setter.

```tsx title="state-inference.tsx"
import { useState } from "react";

type User = { id: string; name: string };

function Demo() {
  const [count, setCount] = useState(0);              // number: representative
  const [items, setItems] = useState([]);             // never[]: placeholder
  setItems(["a"]);
  const [user, setUser] = useState<User | null>(null); // explicit: placeholder
  setUser({ id: "1", name: "Ada" });
  console.log(user.name);
  const [tags, setTags] = useState<string[]>([]);     // explicit: correct
  setCount((c) => c + 1);                             // c: number
  return null;
}
```

```output
error TS2322: Type 'string' is not assignable to type 'never'.
error TS18047: 'user' is possibly 'null'.
```

Line by line:

- `useState(0)` infers `number`. No annotation needed; adding `useState<number>(0)` is noise.
- `useState([])` infers `never[]` under `strict` mode, because an empty array literal has no element type to infer. The error appears at `setItems(["a"])`, not at the declaration — a symptom of the "label written too early" problem. Fix: `useState<string[]>([])`.
- `useState<User | null>(null)` is the standard pattern for data that arrives later. Without the type argument, `S` would be `null` and `setUser({...})` would fail.
- The `'user' is possibly 'null'` error is the type system doing its job: the first render really has no user. Narrow before use (`if (user === null) return <Spinner />`) and the rest of the component sees `User` ([[b2-strict-null-checks]]).
- The functional update `setCount((c) => c + 1)` gets `c: number` from `S`. Use it whenever the next state depends on the previous one ([[b4-usestate-functional-updates]]).

A **lazy initialiser** — `useState(() => expensiveParse(raw))` — is typed by the function's return type, so `S` is whatever `expensiveParse` returns. The function form exists so the expensive work runs only on the first render ([[b4-lazy-state-initialization]]).

### `null` versus `undefined` for "not loaded"

`useState<User>()` with no argument is allowed and gives `User | undefined`. Prefer an explicit `useState<User | null>(null)`: `null` is a value someone chose, while `undefined` is also what you get from a forgotten initialiser. For anything more than "loaded or not" — loading, error, success — a single union state is better than several booleans; see the `useFetchJson` example below and [[b2-remote-data-pattern]].

## `useReducer`

When state has several related fields that change together, `useReducer` moves the update logic into a **reducer**: a pure function `(state, action) => newState` ([[b4-usereducer]]). TypeScript's contribution is the **action union**: one object type per kind of action, discriminated by a `type` field, so each action carries exactly the data it needs.

```tsx title="cart.tsx"
import { useReducer, createContext, useContext, type ReactNode, type Dispatch } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type CartItem = { sku: string; qty: number };
type CartState = { items: CartItem[]; status: "idle" | "checkingOut" };
type CartAction =
  | { type: "add"; sku: string }
  | { type: "remove"; sku: string }
  | { type: "setQty"; sku: string; qty: number }
  | { type: "checkout" };

function assertNever(x: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(x)}`);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const found = state.items.find((i) => i.sku === action.sku);
      const items = found
        ? state.items.map((i) => (i.sku === action.sku ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { sku: action.sku, qty: 1 }];
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.sku !== action.sku) };
    case "setQty":
      return {
        ...state,
        items: state.items.map((i) => (i.sku === action.sku ? { ...i, qty: action.qty } : i)),
      };
    case "checkout":
      return { ...state, status: "checkingOut" };
    default:
      return assertNever(action);
  }
}

const CartContext = createContext<{ state: CartState; dispatch: Dispatch<CartAction> } | null>(null);

function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === null) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

function CartProvider({ children, initial }: { children: ReactNode; initial: CartState }) {
  const [state, dispatch] = useReducer(cartReducer, initial);
  return <CartContext value={{ state, dispatch }}>{children}</CartContext>;
}

function CartBadge() {
  const { state } = useCart();
  const count = state.items.reduce((n, i) => n + i.qty, 0);
  return <span>{count} items</span>;
}

// Reducers are plain functions, so they can be tested without rendering.
let s: CartState = { items: [], status: "idle" };
const actions: CartAction[] = [
  { type: "add", sku: "mug" },
  { type: "add", sku: "mug" },
  { type: "add", sku: "tee" },
  { type: "setQty", sku: "tee", qty: 3 },
  { type: "remove", sku: "mug" },
];
for (const a of actions) s = cartReducer(s, a);
console.log(JSON.stringify(s));

console.log(renderToStaticMarkup(<CartProvider initial={s}><CartBadge /></CartProvider>));
try {
  renderToStaticMarkup(<CartBadge />);
} catch (e) {
  console.log((e as Error).message);
}
```

```output
{"items":[{"sku":"tee","qty":3}],"status":"idle"}
<span>3 items</span>
useCart must be used inside <CartProvider>
```

The example also covers context, discussed in its own section below. Focus first on the reducer.

**Narrowing per action.** Inside `case "setQty"`, `action` is narrowed to `{ type: "setQty"; sku: string; qty: number }`, so `action.qty` is available; in `case "checkout"` there is no `sku` to read. Each action carries only its own payload, and the compiler checks every `dispatch` call: `dispatch({ type: "double" })` fails with `Type '"double"' is not assignable to type '"add" | "remove" | "setQty" | "checkout"'`, and `dispatch({ type: "setQty", sku: "mug" })` fails because `qty` is missing.

**Exhaustiveness.** In the `default` branch every action type has been handled, so `action` has type `never`, and passing it to `assertNever(x: never)` compiles. Add a fifth action to `CartAction` and forget its `case`, and the `default` branch now receives that action's type, which is not assignable to `never` — a compile error at the exact place you need to change ([[b2-exhaustiveness-assertnever]]).

**Let inference type `useReducer`.** Annotate the reducer's parameters and return type, then call `useReducer(cartReducer, initial)` with no type arguments: `state` is inferred as `CartState` and `dispatch` as a function accepting `CartAction`. This matters more in React 19 because the generic parameters of `useReducer` changed. In `@types/react` 19 they are the state type and a *tuple* of action arguments, so React 18-style explicit arguments no longer compile:

```tsx
const x = useReducer<number, A>(r, 0);
const y = useReducer<Reducer<number, A>>(r, 0);
```

```output
error TS2344: Type 'A' does not satisfy the constraint 'AnyActionArg'.
error TS2558: Expected 2 type arguments, but got 1.
```

Inference sidesteps the whole issue, and it works identically on both versions.

**Testing.** Because the reducer is a plain function, the loop at the bottom exercises it without rendering anything. That is one of the main practical benefits of `useReducer`: the logic is testable in isolation, with typed actions as test inputs.

## `useRef`

A ref is a box with a `current` property that survives re-renders without causing them ([[b4-refs]]). Refs are used for two quite different things, and the typing differs slightly.

**DOM refs.** React fills them in after it creates the element. Write

```tsx
const inputRef = useRef<HTMLInputElement>(null);   // RefObject<HTMLInputElement | null>
// …
<input ref={inputRef} />
inputRef.current?.focus();
```

The type of `current` is `HTMLInputElement | null`, and that `null` is real: before the first commit, and after the element unmounts, there is no node. Use optional chaining or an explicit check. Choose the most specific element type (`HTMLInputElement`, not `HTMLElement`) so `.value`, `.select()` and friends are typed.

**Mutable value refs.** Refs also store values that must persist but should not trigger renders: a timer ID, the previous value of a prop, a render counter ([[b4-mutable-ref-values]]). Give them an initial value of the right type, or a union with `null`:

```tsx
const renders = useRef(0);                                          // RefObject<number>
const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
renders.current += 1;
```

`ReturnType<typeof setTimeout>` avoids hard-coding `number` (the browser's return type) or `NodeJS.Timeout` (Node's), so the code compiles whichever set of type definitions is loaded ([[b2-returntype]]).

### What changed in React 19

In `@types/react` 18 there were three overloads and two ref types: `useRef<T>(null)` returned a `RefObject<T>` whose `current` was **read-only**, while `useRef<T | null>(null)` returned a `MutableRefObject`. The distinction confused nearly everyone. In `@types/react` 19:

- `useRef` **requires an argument**. `useRef<number>()` is an error (`Expected 1 arguments, but got 0`); write `useRef<number | undefined>(undefined)`.
- There is one type, `RefObject<T>`, and `current` is **always mutable**. `MutableRefObject` is deprecated.
- `useRef<T>(null)` returns `RefObject<T | null>` — the `null` is part of the type instead of being silently hidden.

If you are upgrading, the usual changes are adding `undefined` arguments and adding `| null` checks where `current` was previously typed non-null.

## `useContext` and typed context

Context passes a value through the tree without props ([[b4-context-api]]). Its typing problem is the **default value**: `createContext` requires one, but for most real contexts there is no sensible default — the value comes from a provider at runtime. If you create `createContext<CartContextValue | null>(null)`, every consumer receives `CartContextValue | null` and must check for `null`, even though inside the provider it is never `null`.

The standard solution, shown in the cart example, is a **guarded custom hook**:

```tsx
function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === null) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;    // CartContextValue, null removed by narrowing
}
```

The check runs once per use, narrows the type, and turns a configuration mistake (a consumer rendered outside its provider) into an immediate, descriptive error — exactly what the cart example's last line printed. Consumers call `useCart()` and never see `null`. Export the hook and the provider, not the raw context object, so nobody bypasses the guard.

Two other details from the example: `Dispatch<CartAction>` is the type of the `dispatch` function, which lets components send actions through context; and in React 19 the context object itself can be rendered as the provider (`<CartContext value={…}>`), while `<CartContext.Provider>` still works.

Avoid the shortcut `createContext<CartContextValue>({} as CartContextValue)`. It compiles, but consumers outside a provider receive an empty object typed as a full value, and the error surfaces later as a confusing `undefined is not a function`.

## `useEffect`, `useMemo` and `useCallback`

**`useEffect`** takes a callback whose return value must be either nothing or a cleanup function ([[b4-effect-cleanup]]). Two common mistakes violate that:

```tsx
useEffect(() => setTimeout(() => {}, 100), []);
useEffect(async () => { await fetch("/x"); }, []);
```

```output
error TS2322: Type 'number' is not assignable to type 'void | Destructor'.
error TS2345: Argument of type '() => Promise<void>' is not assignable to parameter of type 'EffectCallback'.
  Type 'Promise<void>' is not assignable to type 'void | Destructor'.
```

The first is an arrow with a concise body that accidentally returns the timer ID (the message shows `number` with browser types; with Node's types it says `Timeout`). Use a block body, and return a real cleanup: `{ const t = setTimeout(…); return () => clearTimeout(t); }`. The second is an `async` effect, which returns a `Promise` — React would treat it as a cleanup function and fail. Define an async function *inside* the effect and call it, or use `.then`.

**`useMemo`** infers its type from the callback's return value; annotate only if you want a wider type than the one computed. **`useCallback`** infers the function type from the callback, but its parameters have no contextual type, so under `noImplicitAny` they need annotations:

```tsx
const onPick = useCallback((id) => console.log(id), []);          // error TS7006
const onPick2 = useCallback((id: string) => console.log(id), []); // ok
```

## Custom hooks

A custom hook is a function whose name starts with `use` and that calls other hooks ([[b4-custom-hooks]]). Its type is whatever you make its signature, and three design decisions come up every time.

### Returning a tuple needs `as const`

Hooks that mirror `useState` return a pair. Without help, TypeScript infers an *array* type, not a tuple:

```tsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle];             // (boolean | (() => void))[]
}

const [on, toggle] = useToggle();
toggle();
```

```output
error TS2349: This expression is not callable.
  Not all constituents of type 'boolean | (() => void)' are callable.
    Type 'false' has no call signatures.
```

An array literal `[on, toggle]` is inferred as an array whose elements are the union of both types, so after destructuring each variable has type `boolean | (() => void)`. Writing `return [on, toggle] as const;` makes the return type the readonly tuple `readonly [boolean, () => void]`, and destructuring gives each position its own type. Alternatively, annotate the return type: `function useToggle(initial = false): [boolean, () => void]`.

Should a hook return a tuple or an object? A tuple suits two values the caller will rename (`const [isOpen, toggleOpen] = useToggle()`). Beyond two or three values, return an object — `{ data, error, refetch }` — so callers pick by name and the order cannot be confused.

### Generic hooks preserve the caller's type

A hook that stores arbitrary values should be generic, so the caller's type flows through. Here is a `localStorage`-backed state hook:

```tsx title="useLocalStorage.tsx"
import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initial: T,
  parse: (raw: unknown) => T = (raw) => raw as T,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initial;
    try {
      return parse(JSON.parse(raw));
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

type Theme = "light" | "dark";
const isTheme = (raw: unknown): Theme => (raw === "dark" ? "dark" : "light");

function Settings() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light", isTheme);
  const [recent, setRecent] = useLocalStorage("recent", [] as string[]);
  setTheme("blue");
  setRecent((r) => [...r, "x"]);
  return null;
}
```

```output
error TS2345: Argument of type '"blue"' is not assignable to parameter of type 'SetStateAction<Theme>'.
```

This file was type-checked, not run, because it needs a browser's `localStorage`. Points to notice:

- **`T` is inferred from `initial`, with literal widening.** `useLocalStorage("theme", "light")` would infer `T = string`, not `"light"`, and `setTheme("blue")` would compile. When the type is a literal union, pass the type argument explicitly, as with `<Theme>`.
- **`[] as string[]`** gives the empty array a type, the same fix as for `useState([])`.
- **The stored value is untrusted.** `localStorage` can contain anything — an older version of your app wrote it, or the user edited it. The `parse` parameter turns `unknown` back into `T` honestly; the default (`raw as T`) is a cast and should be used only for data you do not need to trust. This is the same boundary rule as for API responses ([[b2-type-safe-apis]]).
- **`as const`** makes the return a tuple, and `setValue`'s type, `Dispatch<SetStateAction<T>>`, supports functional updates for free.

### Returning a union state

A data-fetching hook is clearest when its state is one discriminated union, so callers cannot read `data` while loading:

```tsx title="useFetchJson.tsx"
import { useEffect, useState } from "react";

type RemoteData<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

function useFetchJson<T>(url: string, parse: (raw: unknown) => T): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((json: unknown) => setState({ status: "success", data: parse(json) }))
      .catch((e: unknown) => {
        if (!controller.signal.aborted) setState({ status: "error", error: String(e) });
      });
    return () => controller.abort();
  }, [url, parse]);
  return state;
}
```

A caller writes `const user = useFetchJson("/api/me", parseUser)` and gets `RemoteData<User>`; `user.data` is only accessible after `if (user.status === "success")`. The `AbortController` cancels a stale request when `url` changes or the component unmounts, which also avoids the race where an old response overwrites a newer one ([[b4-effect-race-conditions]]). One runtime caveat that types cannot catch: `parse` is an effect dependency, so it must be stable — a module-level function such as `parseUser`, not an inline arrow, or the effect would re-run (and re-fetch) on every render. In production, data libraries such as TanStack Query provide this hook with caching and retries, using the same typing ideas.

### Exporting a hook's types

When consumers need the type of a hook's result — for example to pass it to a child component — export it, or derive it: `type CartApi = ReturnType<typeof useCart>`. Deriving keeps the type in sync automatically as the hook evolves.

## What TypeScript does not check

The **rules of hooks** — call hooks only at the top level of components and custom hooks, never conditionally or in loops ([[b4-rules-of-hooks]]) — are invisible to the type checker. A hook call inside an `if` type-checks perfectly. Enforcement comes from `eslint-plugin-react-hooks`, whose `rules-of-hooks` and `exhaustive-deps` rules every typed React project should enable ([[b2-eslint-typescript]]). Likewise, the compiler cannot tell whether a dependency array is complete or whether an effect needs cleanup; those are runtime behaviours that linting and testing cover.

## In real systems

- **Reducers with action unions** power complex local state (multi-step forms, editors, carts) and are the same shape Redux Toolkit uses for global state.
- **Context plus a guarded hook** (`useAuth`, `useTheme`, `useCart`) is the standard way design systems and applications expose shared values.
- **Generic data hooks** from TanStack Query, SWR and Apollo infer `data` types from the fetcher you pass, exactly as `useFetchJson` infers `T` from `parse`.
- **Upgrades to React 19** commonly involve fixing `useRef()` calls without arguments and explicit `useReducer` type arguments; the official codemods handle many of them.

## Common mistakes

- **`useState([])` or `useState(null)` without a type argument.** You get `never[]` or `null`. Fix: `useState<string[]>([])`, `useState<User | null>(null)`.
- **Annotating what inference already knows.** `useState<number>(0)` adds noise. Fix: annotate only placeholders.
- **Explicit `useReducer` type arguments.** They broke in React 19's types. Fix: type the reducer and let inference do the rest.
- **`useRef()` with no argument.** An error in React 19. Fix: `useRef<T | undefined>(undefined)` or `useRef<T>(null)` for DOM nodes.
- **Context typed with a fake default.** `{} as Value` hides missing providers. Fix: `null` default plus a guarded hook.
- **Returning `[a, b]` from a custom hook.** It becomes a union array. Fix: `as const` or a tuple return type.
- **`async` effect callbacks or concise-body effects that return a value.** Fix: block body, async function inside, return only a cleanup.

## Interview perspective

**"How do you type `useState` for data fetched from an API?"** `useState<User | null>(null)`, then narrow before use. Better: a single discriminated union state (`loading` / `error` / `success`) so impossible combinations such as "loading with data and error" cannot exist.

**"How do you type `useReducer`?"** Discriminated action union, typed reducer with an exhaustive `switch` and `assertNever`, inference for `useReducer` itself. Mention that reducers are testable without rendering.

**"What is the difference between a DOM ref and a value ref?"** DOM refs start as `null` and React fills them; value refs hold mutable data that should not trigger renders. In React 19 both are `RefObject<T>` with mutable `current`; `useRef` needs an argument.

**"How do you avoid `null` checks in every context consumer?"** A custom hook that reads the context, throws if it is `null`, and returns the narrowed value.

Follow-ups often ask why a custom hook's returned pair needs `as const`, or why TypeScript does not catch a conditionally called hook (it is a runtime rule, enforced by ESLint).

## Practice

1. Write `useToggle` that returns `readonly [boolean, { on(): void; off(): void; toggle(): void }]`.
2. Model a three-step signup wizard with `useReducer`: actions `next`, `back`, `setField` (with a typed field name and value via a mapped type), and `submit`. Ensure exhaustiveness.
3. Write `usePrevious<T>(value: T): T | undefined` with a value ref, and explain why its return type includes `undefined`.
4. Create `ThemeContext` with a guarded `useTheme` hook, and a provider that persists the theme with `useLocalStorage`.
5. Change `useFetchJson` to accept a `deps` array and an `enabled` flag, keeping the return type a discriminated union with an extra `idle` status.

```quiz
Q: What type does `const [items, setItems] = useState([])` give `items` under `strict` mode?
- [ ] `any[]`
- [ ] `unknown[]`
- [x] `never[]`
- [ ] `[]`
> An empty array literal has no elements to infer from, and with `strict` (which includes `noImplicitAny`) TypeScript infers `never[]` for it, so every later `setItems([...])` with real elements fails. Pass the element type explicitly: `useState<string[]>([])`.
```

```quiz
Q: A custom hook ends with `return [value, setValue];`. Why do callers get type errors when they call `setValue`?
- [ ] Custom hooks cannot return functions
- [x] The array literal is inferred as an array of the union of both element types, not as a tuple
- [ ] `setValue` loses its `this` binding when returned
- [ ] React requires custom hooks to return objects
> Without `as const` or a tuple return type, `[value, setValue]` becomes `(T | Dispatch<…>)[]`, so after destructuring each variable is the union and cannot be called or used as `T` without narrowing. `as const` makes it a readonly tuple with a type per position.
```

```quiz
Q: Why is `createContext<Value | null>(null)` plus a `useValue()` hook that throws on `null` preferred to `createContext<Value>({} as Value)`?
- [ ] `null` contexts render faster
- [ ] React 19 forbids object default values
- [x] The guarded hook gives consumers a non-null type and fails loudly if a provider is missing, while the cast hides the missing provider behind a fake value
- [ ] The cast version does not compile
> Both compile. The cast lies about the default, so a consumer outside the provider receives an empty object typed as a full `Value` and fails later with a confusing error. The guarded hook narrows away `null` once and reports the real problem immediately.
```

## Quick revision {#quick-revision}

- Hooks are generic functions; let inference work when the initial value is representative.
- `useState(0)` → `number`; `useState([])` → `never[]`; `useState(null)` → `null`. Placeholders need `useState<T[]>([])`, `useState<T | null>(null)`.
- Narrow nullable state before use; prefer one discriminated union over several booleans.
- `useReducer`: discriminated `Action` union, typed reducer, `assertNever` in `default`; call `useReducer(reducer, initial)` without type arguments (React 19 changed the generics).
- `useRef<HTMLInputElement>(null)` → `RefObject<HTMLInputElement | null>`; value refs `useRef(0)`; React 19: argument required, `current` always mutable, `MutableRefObject` deprecated.
- Context: `createContext<V | null>(null)` + guarded `useV()` that throws; never `{} as V`.
- `useEffect` callback returns nothing or a cleanup — no `async`, no concise-body return values.
- `useCallback` parameters need annotations; `useMemo` infers.
- Custom hooks: `return [a, b] as const` for tuples; objects for 3+ values; generic `T` inferred with literal widening — pass literal unions explicitly; parse untrusted storage.
- Rules of hooks and deps are not type-checked — use `eslint-plugin-react-hooks`.

## Key takeaways {#key-takeaways}

- Inference types hooks from their first value, so annotate exactly when that value is a placeholder: `null`, `[]`, or a DOM ref.
- Discriminated action unions make reducers self-documenting, check every `dispatch`, and with `assertNever` catch unhandled actions at compile time.
- React 19's types simplified refs to one mutable `RefObject` and require an initial value; explicit `useReducer` type arguments from React 18 no longer compile.
- Wrap nullable contexts in a guarded hook so consumers get a non-null type and missing providers fail loudly.
- Design custom hooks' return types deliberately — tuples with `as const`, objects for larger results, generics that let the caller's type flow through.
