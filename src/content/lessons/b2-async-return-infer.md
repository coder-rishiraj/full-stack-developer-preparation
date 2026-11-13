---
summary: Calling `ReturnType` on an async function gives you a `Promise<...>`, not the data inside it. You will learn how to get the resolved value type with `Awaited<ReturnType<typeof fn>>`, how `Awaited` is built from `infer`, how to write the older hand-rolled version, and how to use the pattern to type wrappers, API clients and data hooks without duplicating types.
difficulty: intermediate
minutes: 40
objectives:
  - Explain why `ReturnType` of an async function is a `Promise` and how `Awaited` removes it
  - Implement an `AsyncReturn` helper with `infer` and compare it with `Awaited<ReturnType<T>>`
  - Describe exactly what `Awaited` unwraps — nested promises, thenables, unions — and what it leaves alone
  - Type a generic async wrapper (retry, cache, data hook) so callers keep the precise result type
  - Diagnose the common mistakes — a missing `Awaited`, `ReturnType<fn>` without `typeof`, and overloads
---

## Introduction

Most data in a frontend application arrives through async functions: `fetchUser(id)`, `api.listOrders()`, a server action. The function's code already describes the shape of the result. When you store that result in component state, pass it to a child, or cache it, you need its type — and you want to get it *from the function*, not by retyping it as an interface that can drift out of date.

The obvious first attempt is `ReturnType<typeof fetchUser>`, and it gives the wrong answer:

```typescript title="the-problem.ts"
async function loadUser(id: string) {
  return { id, name: "Ada", joined: new Date(0) };
}

type Wrong = ReturnType<typeof loadUser>;
// Promise<{ id: string; name: string; joined: Date }>
```

That is correct, strictly speaking: an `async` function always returns a `Promise`. But the thing you hold *after* `await` is the object inside it. You need to peel the `Promise` off. Since TypeScript 4.5 the standard library has a utility for exactly that, **`Awaited<T>`**, and the combination is the idiom this lesson is about:

```typescript title="the-fix.ts"
async function loadUser(id: string) {
  return { id, name: "Ada", joined: new Date(0) };
}

type User = Awaited<ReturnType<typeof loadUser>>;
// { id: string; name: string; joined: Date }
```

Read it inside out: `typeof loadUser` is the function's type, `ReturnType<...>` is what calling it gives (`Promise<...>`), and `Awaited<...>` is what `await` on that gives. This is a favourite interview question because it checks three ideas at once: types versus values (`typeof`), conditional types with `infer`, and how `async`/`await` really behave.

## Before you start

- **Promises and `async`/`await`** — an `async` function always returns a promise; `await` gives the fulfilled value. See [[b1-promises]] and [[b1-async-await]].
- **`infer` and `ReturnType`** — capturing part of a type in a conditional type. See [[b2-infer]] and [[b2-returntype]].
- **`typeof` in type positions** — getting the type of a value such as a function. See [[b2-typeof]].
- **`Parameters`** — the tuple of a function's parameter types. See [[b2-parameters-type]].

## The intuition

Picture a parcel that contains a box that contains the item you ordered. `ReturnType` tells you "you will receive a parcel". That is true, but not useful when you want to plan where the item goes. `Awaited` opens the parcel — and if there is a box inside, it opens that too, and keeps going until it reaches something that is not a container.

That matches what `await` does at runtime. Awaiting a promise that resolves to another promise does not give you the inner promise; promise resolution follows the chain until it reaches a plain value. `Awaited<T>` is the type-level description of that runtime behaviour.

## Building it yourself with `infer`

Before `Awaited` existed, codebases wrote their own helper. Seeing it explains what the built-in does:

```typescript title="async-return.ts"
type AsyncReturn<T> =
  T extends (...args: any[]) => Promise<infer R> ? R :
  T extends (...args: any[]) => infer S ? S :
  never;

async function loadUser(id: string) {
  return { id, name: "Ada" as const };
}

type A1 = AsyncReturn<typeof loadUser>;                 // { id: string; name: "Ada" }
type A2 = AsyncReturn<() => number>;                    // number
type A3 = AsyncReturn<() => Promise<Promise<string>>>;  // Promise<string>
```

The first branch matches a function returning `Promise<something>` and captures the something as `R`. The second branch handles ordinary functions by returning their return type unchanged, so the helper works on both sync and async functions. Anything that is not a function falls through to `never`.

`A3` shows the weakness: the pattern peels exactly one `Promise`. You could make it recursive, but there are more cases — values that are `Promise`-like without being `Promise`, unions of promises and plain values — and the built-in already handles all of them.

The modern equivalent is one line, and it covers more:

```typescript title="modern.ts"
type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

type A4 = AsyncReturn<() => Promise<Promise<string>>>; // string
type A5 = AsyncReturn<() => number>;                   // number
```

The constraint on `T` means passing a non-function is a compile error rather than a silent `never`. For `A5`, `Awaited<number>` is `number`, so the helper is the identity on sync functions, the same as the hand-written second branch.

## What `Awaited` actually does

Here is the definition from `lib.es5.d.ts` (TypeScript 6.0), with the comments shortened:

```typescript title="lib-awaited.ts"
type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ?
    F extends (value: infer V, ...args: infer _) => any ?
      Awaited<V> :
      never :
  T;
```

Step by step:

1. `null` and `undefined` are returned as they are. (This line matters only when `strictNullChecks` is off.)
2. If `T` is an **object with a callable `then` method** — a **thenable** — capture the type of `then`'s first parameter as `F`. That parameter is the "on fulfilled" callback.
3. If `F` is a function, capture *its* first parameter as `V`. That is the value the thenable will deliver. Recurse with `Awaited<V>`, so nested thenables are unwrapped all the way down.
4. If `then` exists but its callback is not a function, the result is `never`: such a value would never resolve.
5. Anything else — numbers, strings, objects without a `then` method — is returned unchanged.

Notice that it does not mention `Promise` at all. It follows the same rule as the JavaScript runtime: `await` treats *any* object with a callable `then` as a promise. And because `T` is a naked type parameter, `Awaited` distributes over unions.

```typescript title="awaited-cases.ts"
type W1 = Awaited<Promise<Promise<number>>>;      // number
type W2 = Awaited<string>;                        // string
type W3 = Awaited<Promise<string> | number>;      // string | number
type W4 = Awaited<PromiseLike<boolean>>;          // boolean
type W5 = Awaited<{ then(cb: (v: Date) => void): void }>; // Date
type W6 = Awaited<{ then: string }>;              // { then: string } — not callable
```

`W3` is the "maybe async" case, common for functions that return a cached value synchronously and a fetched value asynchronously: the union is unwrapped member by member. `W6` is not a thenable because its `then` is not a method, so it is left alone — again matching runtime behaviour.

> [!NOTE] `Awaited` is used by the compiler too
> Since TypeScript 4.5, the declarations for `Promise.all`, `Promise.race`, `Promise.allSettled` and `Promise.any` use `Awaited`, and the type of an `await` expression in generic code is written in terms of `Awaited<T>`. That is why `await Promise.all([fetchA(), fetchB()])` gives a precisely typed tuple.

## Where the pattern is used

### Typing state that holds an async result

```typescript title="state.ts"
async function loadUser(id: string) {
  return { id, name: "Ada", joined: new Date(0) };
}

type User = Awaited<ReturnType<typeof loadUser>>;

let current: User | null = null; // e.g. the type for useState<User | null>(null)
```

If `loadUser` gains a field, `User` gains it too. If the type were written by hand, the two would silently diverge.

### Methods on an API client

For a class or object of methods, use an **indexed access type** to name the method, then unwrap it:

```typescript title="api-client.ts"
class Api {
  async getUser(id: string) { return { id, name: "Ada" }; }
  async listPosts() { return [{ id: 1, title: "Hello" }]; }
}

type UserDto = Awaited<ReturnType<Api["getUser"]>>; // { id: string; name: string }

// The resolved result of every method at once, with a mapped type.
type ApiResults<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? Awaited<R> : never;
};
type All = ApiResults<Api>;
// { getUser: { id: string; name: string }; listPosts: { id: number; title: string }[] }
```

`Api["getUser"]` works on the class *type* — no `typeof` needed because `Api` as a type already means "an instance of `Api`". The mapped type form (see [[b2-mapped-types]]) is useful for generating a cache or a mock that has one entry per method.

### Unions of functions

`ReturnType` and `Awaited` both distribute, so a union of async functions gives a union of results: `Awaited<ReturnType<(() => Promise<number>) | (() => Promise<string>)>>` is `string | number`. That is usually what you want for "one of these loaders will run", but notice that you lose the connection between *which* function ran and *which* result you got. If you need that connection, keep the functions in a keyed object and index it by a specific key.

## Worked example: a typed retry wrapper

Wrappers are where this pattern really pays off. A retry helper should accept *any* async function and return a function with the same parameters and the same resolved result, without the caller writing a single type argument. Run with Node.js 22, which strips the type annotations before executing.

```typescript title="with-retry.ts"
function withRetry<F extends (...args: any[]) => Promise<unknown>>(fn: F, attempts = 3) {
  return async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        // ReturnType<F> is deferred inside the generic body, so assert once here.
        return (await fn(...args)) as Awaited<ReturnType<F>>;
      } catch (error) {
        lastError = error;
        console.log(`attempt ${attempt} failed: ${(error as Error).message}`);
      }
    }
    throw lastError;
  };
}

let calls = 0;
async function loadUser(id: string) {
  calls++;
  if (calls < 3) throw new Error("network");
  return { id, name: "Ada", roles: ["admin"] };
}

const loadUserWithRetry = withRetry(loadUser);
// (id: string) => Promise<{ id: string; name: string; roles: string[] }>

const user = await loadUserWithRetry("u1");
console.log(user.name, user.roles.length);
```

```output
attempt 1 failed: network
attempt 2 failed: network
Ada 1
```

Look at the signature first. `F extends (...args: any[]) => Promise<unknown>` restricts the wrapper to async functions — passing a sync function is a compile error, which is the right outcome for a helper that `await`s. The returned function's parameters are `Parameters<F>`, so `loadUserWithRetry(42)` would be rejected just as `loadUser(42)` would. Its result is `Promise<Awaited<ReturnType<F>>>`: the resolved type of the original, wrapped in one fresh promise because the wrapper is itself `async`.

Now the body. Without the `as` assertion, the `return` line fails with "Type 'unknown' is not assignable to type 'Awaited<ReturnType<F>>'". Inside the function, `F` is only known to return `Promise<unknown>`, so awaiting it gives `unknown`; the precise type exists only at call sites, where `F` is known. This is the same deferral you met in [[b2-conditional-types]], and the standard answer is a single, commented assertion in the wrapper so that every caller gets exact types. The file uses top-level `await`, which works in ES modules (see [[b1-top-level-await]]).

## A typed data hook

The same idea shapes data-fetching hooks. A minimal signature, without the React internals, looks like this:

```typescript title="use-data.ts"
type DataState<T> =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "success"; data: T };

declare function useData<F extends (...args: any[]) => Promise<unknown>>(
  fetcher: F,
  ...args: Parameters<F>
): DataState<Awaited<ReturnType<F>>>;

async function fetchUser(id: string) {
  return { id, name: "Ada" };
}

const state = useData(fetchUser, "u1");
if (state.status === "success") {
  console.log(state.data.name); // data: { id: string; name: string }
}
```

The component never mentions `User`; the fetcher's own return type flows into `state.data`. Libraries such as TanStack Query use the same principle (their `useQuery` infers its data type from the query function's resolved value). The status union is the remote-data pattern from [[b2-remote-data-pattern]]; hooks typing in general is covered in [[b2-hooks-typing]]. This snippet was type-checked, not run, because `useData` is only declared.

## Trade-offs and alternatives

| Approach | Stays in sync | Readability | Best when |
|---|---|---|---|
| `Awaited<ReturnType<typeof fn>>` | Yes | Good once known | The function is the source of truth (library, server code) |
| Explicit exported type + annotated return | Yes, if the function is annotated | Best | You own both and the type is part of a public contract |
| Hand-rolled `AsyncReturn` with `infer` | Yes | Fair | Only on TypeScript older than 4.5 |
| Copying the type by hand | No | Good until it drifts | Never, if you can avoid it |

The derivation approach is strongest when the function really is the source of truth. When a type is an important contract — the shape your API promises to clients — it is often clearer to declare it explicitly (`type User = {...}`) and annotate the function with `Promise<User>`. Then the function is checked *against* the contract instead of defining it, so an accidental change in the function body is caught rather than silently propagated.

Remember too that both approaches describe what the code *claims*. If `loadUser` does `return (await res.json()) as User`, the type is only as trustworthy as that assertion. Validate network data at runtime (for example with a schema library) when correctness matters; see [[b2-type-safe-apis]].

## Common mistakes

> [!MISTAKE] Forgetting `Awaited`
> `type User = ReturnType<typeof loadUser>` is `Promise<{...}>`. The mistake usually surfaces later, as "Property 'name' does not exist on type 'Promise<...>'" at the place you use the value. Wrap it: `Awaited<ReturnType<typeof loadUser>>`.

**Passing the function instead of its type.** `ReturnType<loadUser>` fails with "'loadUser' refers to a value, but is being used as a type here. Did you mean 'typeof loadUser'?". Utility types take types; add `typeof`.

**Applying `Awaited` to the function.** `Awaited<typeof loadUser>` returns the function type unchanged — a function is not a thenable. You need `ReturnType` in between.

**Widened literals in the result.** An async function returning `{ status: "ok" }` has the inferred type `{ status: string }`, because object properties widen. If you need the literal, write `"ok" as const` in the function or annotate its return type.

**Overloaded functions.** `ReturnType` uses the last overload signature, so `Awaited<ReturnType<typeof fn>>` describes only that overload. Declare the type you need explicitly.

**Expecting the precise type inside a generic wrapper.** As in the worked example, `Awaited<ReturnType<F>>` is deferred while `F` is a type parameter. One assertion at the return is normal.

## Interview perspective

The usual question is: "Given an async function, how do you get the type of its resolved value?" A good answer gives `Awaited<ReturnType<typeof fn>>`, explains each layer, and can write the pre-4.5 version with `infer`.

> [!INTERVIEW] What a strong answer sounds like
> "`ReturnType<typeof fetchUser>` is `Promise<User>` because async functions always return promises, so I wrap it in `Awaited`, which recursively unwraps anything with a callable `then` — the same rule `await` uses. Before 4.5 I'd write `T extends (...args: any[]) => Promise<infer R> ? R : ...`, but that only peels one layer and only real `Promise`s. In a generic wrapper I'd type the result as `Promise<Awaited<ReturnType<F>>>` and accept one assertion inside, since the type is deferred there."

Follow-ups to expect:

- **Why does `await` of a nested promise give the inner value, and how does `Awaited` model it?** Promise resolution adopts the state of any thenable it resolves with; `Awaited` recurses on the `then` callback's value.
- **What is `Awaited<Promise<A> | B>`?** `A | B`, because it distributes.
- **How would you type the result of every method on an API object?** A mapped type with `infer R` and `Awaited<R>`, or `Awaited<ReturnType<T[K]>>`.
- **What does `Promise.all` return for a tuple of mixed promises and values?** A promise of a tuple of each element's `Awaited` type.

## Practice

1. Write `AsyncReturn<T>` with `infer`, then make it recursive so `() => Promise<Promise<number>>` gives `number`. Compare it with `Awaited<ReturnType<T>>` on a thenable that is not a `Promise`.
2. Given an object `const api = { getUser: async (id: string) => ..., listTeams: async () => ... }`, write `ApiData<K extends keyof typeof api>` that gives the resolved type of one method.
3. Write `withCache(fn)` that memoises an async function by its first argument and keeps the exact parameter and result types.
4. Explain why `withRetry` constrains `F` to return `Promise<unknown>` rather than accepting any function, and what would change if it did not.
5. Find a place in a codebase where a response type is written by hand next to the function that produces it, and decide whether deriving it or annotating the function is the better fix.

```quiz
Q: `async function f() { return 1; }` — what is `ReturnType<typeof f>`?
- [ ] `number`
- [x] `Promise<number>`
- [ ] `Awaited<number>`
- [ ] `1`
> An async function always returns a promise, so its return type is `Promise<number>` (the literal `1` widens to `number` in a return position without `as const`). `Awaited` is needed to get `number`.

Q: What is `Awaited<{ then: string }>`?
- [ ] `string`
- [ ] `never`
- [x] `{ then: string }`
- [ ] `unknown`
> `Awaited` only unwraps objects whose `then` is callable — the same rule the runtime uses. A `then` property holding a string makes it an ordinary object, which is returned unchanged.

Q: Which is the best type for a function returned by a generic retry wrapper around `fn: F`?
- [ ] `(...args: any[]) => any`
- [ ] `(...args: Parameters<F>) => ReturnType<F>`
- [x] `(...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>`
- [ ] `F`
> The wrapper is itself async, so it returns a promise of the original's resolved value; `Parameters<F>` keeps argument checking. `ReturnType<F>` alone happens to describe a promise too, but it would be wrong for an `F` returning a thenable or a union, and `any` throws all checking away.

Q: Why does `return await fn(...args)` inside `withRetry` need an assertion?
- [x] `F` is only known to return `Promise<unknown>` there, so the awaited value is `unknown` and the precise type is deferred
- [ ] `await` cannot be used with generic functions
- [ ] `Awaited` is not allowed in return types
- [ ] Rest parameters lose their types inside arrow functions
> Inside the generic body the compiler only knows `F`'s constraint. `Awaited<ReturnType<F>>` resolves only when a caller supplies a concrete `F`, so a single assertion at the return is the usual solution.
```

## Quick revision {#quick-revision}

- `ReturnType<typeof asyncFn>` is `Promise<X>`; `Awaited<ReturnType<typeof asyncFn>>` is `X`.
- `Awaited<T>` (TS 4.5+) recursively unwraps any object with a callable `then` (thenables), distributes over unions, and leaves non-thenables unchanged.
- Pre-4.5 helper: `T extends (...args: any[]) => Promise<infer R> ? R : T extends (...args: any[]) => infer S ? S : never` — peels one layer, real `Promise` only.
- Modern helper: `type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>` — identity on sync functions.
- Class methods: `Awaited<ReturnType<Api["getUser"]>>`; all methods: mapped type with `infer R ? Awaited<R>`.
- Generic wrappers: `(...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>`, with one assertion inside the body.
- Traps: missing `Awaited`; `ReturnType<fn>` without `typeof`; `Awaited<typeof fn>`; overloads use the last signature; widened literals.
- `Promise.all` and friends are typed with `Awaited`.

## Key takeaways {#key-takeaways}

- Async functions return promises, so the resolved data type is `Awaited<ReturnType<typeof fn>>`, read inside out.
- `Awaited` mirrors runtime `await`: it unwraps any thenable, recursively, and passes everything else through.
- The hand-written `infer` version explains the idea but handles fewer cases; use the built-in on TypeScript 4.5 and later.
- The pattern shines in wrappers and hooks, where `Parameters<F>` and `Awaited<ReturnType<F>>` let callers keep exact types without type arguments.
- Derived types follow the function; for public contracts, prefer an explicit type that the function is checked against, and validate untrusted data at runtime.
