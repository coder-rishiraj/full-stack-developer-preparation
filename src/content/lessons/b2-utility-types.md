---
summary: Utility types are generic types built into TypeScript that derive new types from existing ones — making properties optional or required, selecting or removing keys, building dictionaries, and extracting the parameters, return value or resolved value of a function. You will learn what each common utility does, how it is defined, where it is used in real code and the traps in each.
difficulty: intermediate
minutes: 60
objectives:
  - Explain why deriving types with utility types is safer than writing each variant by hand
  - Use Partial, Required, Readonly, Pick, Omit and Record to build input, output and lookup types from one model
  - Extract types from functions with ReturnType, Parameters and Awaited, combined with typeof
  - Read the standard definitions of the utilities and explain the mapped and conditional types behind them
  - Debug the common traps — shallow Partial and Readonly, unchecked Omit keys, Omit on unions, and overloads
---

## Introduction

Most applications have one central shape for each kind of data — a `User`, an `Order`, a `Settings` object — and many slightly different variations of it. Creating a user needs every field except the `id` the database will assign. Updating a user takes any subset of the editable fields. The public profile sent to the browser must not include the password hash. A cache maps user IDs to users.

You could write a separate interface for each variant. The problem appears the day someone adds a field to `User`: every copy has to be updated by hand, and a missed copy compiles without complaint because nothing connects it to the original. Types that were meant to agree drift apart.

**Utility types** remove that duplication. They are generic types that ship with TypeScript (declared in its standard library files, such as `lib.es5.d.ts`) and take an existing type as input and produce a transformed type as output:

```typescript title="derived-types.ts"
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

type CreateUserInput = Omit<User, "id">;                    // everything but id
type UpdateUserInput = Partial<Pick<User, "name" | "email">>; // any subset of two fields
type PublicUser = Omit<User, "passwordHash">;               // safe to send to clients
type UserCache = Record<string, PublicUser>;                // id -> user
```

Each variant is now *defined in terms of* `User`. Add a `createdAt` field and `CreateUserInput` and `PublicUser` pick it up automatically; rename `email` and every derived type that mentions it reports an error. The types stay in sync because there is only one source of truth.

This lesson covers the nine utilities you will use most — `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`, `Parameters` and `Awaited` — and briefly the rest. Each has its own section that can be read alone.

## Before you start

- **Generics and constraints** — utility types are generic types, and several have constraints such as `K extends keyof T`. See [[b2-generics]] and [[b2-generic-constraints]].
- **`keyof`, `typeof` and indexed access** — `keyof T` lists keys, `typeof value` turns a value into a type, `T[K]` reads a property type. See [[b2-keyof]], [[b2-typeof]] and [[b2-indexed-access]].
- **Optional and readonly properties** — the `?` and `readonly` modifiers. See [[b2-optional-properties]] and [[b2-readonly-properties]].
- **Unions** — several utilities take or produce union types. See [[b2-unions]].

You do not need to know how to write mapped or conditional types yourself; this lesson shows the definitions and explains them, and [[b2-mapped-types]] and [[b2-conditional-types]] teach the techniques in full.

## The intuition: functions that run on types

An ordinary function takes values and returns a value. A utility type takes types and returns a type, and it runs only inside the compiler. `Partial<User>` is a call: the "function" `Partial` receives `User` and returns a new object type in which every property is optional. Like ordinary functions, utility types compose: `Partial<Pick<User, "name" | "email">>` first selects two properties, then makes them optional.

| Utility | Input | Output |
|---|---|---|
| `Partial<T>` | object type | every property optional |
| `Required<T>` | object type | every property required |
| `Readonly<T>` | object type | every property `readonly` |
| `Pick<T, K>` | object type, keys | only the keys `K` |
| `Omit<T, K>` | object type, keys | every key except `K` |
| `Record<K, V>` | key type, value type | object with keys `K`, each of type `V` |
| `ReturnType<F>` | function type | what it returns |
| `Parameters<F>` | function type | its parameter list as a tuple |
| `Awaited<T>` | any type, usually a promise | the value `await` would produce |

Two points from the analogy are worth keeping. First, utility types do nothing at runtime: like all types, they are erased, so `Omit<User, "passwordHash">` does not remove a password hash from any object — you still have to write the code that removes it. Second, utilities that act on object types are **shallow**: they change the top-level properties and leave nested objects alone.

## How utility types are built

Every utility in the list is an ordinary generic type written in TypeScript itself, and reading the definitions explains their behaviour better than any description. They fall into two families.

The object utilities are **mapped types**: they loop over a set of keys and produce one property per key. Here are their definitions from TypeScript's standard library (formatted, comments removed):

```typescript title="lib.es5.d.ts (excerpt)"
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Record<K extends keyof any, T> = { [P in K]: T };
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

Read `{ [P in keyof T]?: T[P] }` as: "for each key `P` of `T`, make a property named `P`, optional, whose type is the type `T` has at `P`". The only difference between `Partial`, `Required` and `Readonly` is the modifier: `?` adds optionality, `-?` removes it, `readonly` adds read-only. When a mapped type iterates over `keyof T` like this, it is called **homomorphic**, and it preserves the modifiers the original properties already had — which is why `Pick` keeps an optional property optional.

The function utilities are **conditional types** that use `infer` to pull out part of a type:

```typescript title="lib.es5.d.ts (excerpt)"
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;
type Exclude<T, U> = T extends U ? never : T;
```

`T extends (...args: any) => infer R ? R : any` reads: "if `T` is a function, call whatever it returns `R`, and give back `R`". `infer` declares a type variable that the compiler fills in by matching; see [[b2-infer]]. `Awaited` is a recursive conditional type of the same kind.

Being able to write these yourself is a common interview request: implementing `MyPick` and `MyOmit` is practised in [[b2-impl-pick]].

## Partial {#b2-partial}

`Partial<T>` produces a type with the same properties as `T`, but every one of them optional. It describes "some of the fields of `T`, possibly none" — which is exactly the shape of an update, a patch, a set of overrides or a form that is half filled in.

```typescript title="partial.ts"
interface Settings {
  theme: "light" | "dark";
  fontSize: number;
  autosave: boolean;
}

const defaults: Settings = { theme: "light", fontSize: 14, autosave: true };

function applySettings(base: Settings, patch: Partial<Settings>): Settings {
  return { ...base, ...patch };
}

console.log(applySettings(defaults, { fontSize: 16 }));
// applySettings(defaults, { fontSize: "16" });   // error: string is not number
// applySettings(defaults, { colour: "red" });    // error: unknown property
```

```output
{ theme: 'light', fontSize: 16, autosave: true }
```

`Partial<Settings>` is `{ theme?: "light" | "dark"; fontSize?: number; autosave?: boolean }`. The patch may leave fields out, but each field it does include keeps its original type, and unknown fields are rejected in an object literal. The spread `{ ...base, ...patch }` produces a complete `Settings` because every field missing from `patch` comes from `base`. This "defaults plus overrides" pattern is the most common use of `Partial`, along with the bodies of HTTP `PATCH` endpoints and React state updates such as `setState(prev => ({ ...prev, ...changes }))`.

Under strict settings, an optional property's type includes `undefined`, so a reader of `Partial<Settings>` must handle a missing value: `patch.fontSize` is `number | undefined`. Optional also means *the key may be absent*, not "the value may be `null`"; `null` is still rejected unless the original property type allowed it.

**Partial is shallow.** Only top-level properties become optional. If `Settings` had `editor: { tabSize: number; wrap: boolean }`, then `Partial<Settings>` would make `editor` optional, but an `editor` you do provide must still contain both `tabSize` and `wrap`. A deep version needs a recursive mapped type:

```typescript title="deep-partial.ts"
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

This simple version is enough for plain data objects; it is not built in, and production-grade versions (for example in the `type-fest` library) add special cases for arrays, functions, `Map` and `Date`.

**Partial allows the empty object.** `{}` is a valid `Partial<Settings>`. If an update must change at least one field, enforce that at runtime or with a more specific type; `Partial` alone cannot express "at least one".

Combine `Partial` with `Pick` or `Omit` to control *which* fields are patchable: `Partial<Pick<User, "name" | "email">>` allows updating only the name and email, and `Partial<Omit<User, "id">>` allows anything except the id. That combination is the topic of [[b2-pick-partial-patch]].

## Required {#b2-required}

`Required<T>` is the opposite of `Partial`: it produces a type with the same properties as `T`, but every optional property becomes required. It describes "this object is now complete" — typically after defaults have been filled in or after validation has confirmed every field is present.

```typescript title="required.ts"
interface ServerOptions {
  port?: number;
  host?: string;
  timeoutMs?: number;
}

type ResolvedOptions = Required<ServerOptions>;

const DEFAULTS: ResolvedOptions = { port: 8080, host: "localhost", timeoutMs: 5000 };

function resolve(options: ServerOptions): ResolvedOptions {
  return { ...DEFAULTS, ...options };
}

const resolved = resolve({ port: 3000 });
console.log(resolved.timeoutMs.toFixed(0), resolved);
```

```output
5000 { port: 3000, host: 'localhost', timeoutMs: 5000 }
```

The public API accepts `ServerOptions`, where everything is optional, because callers should only specify what they want to change. Internally, code works with `ResolvedOptions`, so `resolved.timeoutMs` is a `number` — no `undefined` checks scattered through the server code. The type marks the boundary where defaults have been applied.

`Required` is defined with the `-?` modifier, which removes optionality. Under `strictNullChecks` it also removes the `undefined` that optionality added: `{ port?: number }` becomes `{ port: number }`, not `{ port: number | undefined }`. That even applies to an optional property written explicitly as `port?: number | undefined`. A property that was **not** optional but includes `undefined` in its type, such as `port: number | undefined`, is left unchanged, because `Required` only acts on the `?` modifier.

Be careful with the spread in `resolve`. If a caller passes `{ port: undefined }` explicitly, the spread copies `undefined` over the default, and the result violates `ResolvedOptions` at runtime even though it type-checks. The compiler option `exactOptionalPropertyTypes` makes `port?: number` reject an explicit `undefined`, closing that hole; without it, filter out `undefined` values before merging.

Like `Partial`, `Required` is shallow: optional properties inside nested objects stay optional. And like every utility type, it checks nothing at runtime — `Required<ServerOptions>` on data from a config file is only true if you validated the file.

## Pick {#b2-pick}

`Pick<T, K>` builds a new object type from only the keys `K` of `T`. Its constraint, `K extends keyof T`, means the keys must actually exist on `T`. It describes a projection: "the parts of `T` this code needs".

```typescript title="pick.ts"
interface User {
  id: string;
  name: string;
  email?: string;
  passwordHash: string;
  lastLoginAt: Date;
}

type UserSummary = Pick<User, "id" | "name" | "email">;

function toSummary(user: User): UserSummary {
  return { id: user.id, name: user.name, email: user.email };
}

const ada: User = {
  id: "u1",
  name: "Ada",
  passwordHash: "x9f...",
  lastLoginAt: new Date(0),
};
console.log(toSummary(ada));
```

```output
{ id: 'u1', name: 'Ada', email: undefined }
```

`UserSummary` is `{ id: string; name: string; email?: string }`. Notice that `email` stays optional: `Pick` is a homomorphic mapped type, so it copies each property's modifiers (`?` and `readonly`) along with its type.

The key constraint is valuable. `Pick<User, "nmae">` is a compile error (*Type '"nmae"' does not satisfy the constraint 'keyof User'*), so a typo or a renamed property in `User` is reported where the projection is defined. That makes `Pick` the safer choice for small, deliberate projections — form models, list-row props, the fields a component displays.

As before, the type does not do the work. `toSummary` must copy the fields itself; a function that returned the whole `user` object would also type-check, because a `User` has every property `UserSummary` requires, and the password hash would be sent along. If excluding data matters for security, build the output object explicitly or validate it.

In React, `Pick` is a natural way to declare that a component needs a slice of a larger model: `function Avatar(props: Pick<User, "name" | "avatarUrl">)`. The component can then be reused with any object that has those two fields. To write `pick` as a typed *runtime* function, which returns `Pick<T, K>` from `obj` and `keys`, see [[b2-generic-pick-helper]].

## Omit {#b2-omit}

`Omit<T, K>` builds a new object type with every key of `T` except the keys `K`. It is the complement of `Pick`, and it is the better choice when you want to remove a few properties and keep the rest — internal fields, generated fields, sensitive fields.

```typescript title="omit.ts"
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

type NewUser = Omit<User, "id">;
type PublicUser = Omit<User, "passwordHash">;

function toPublic(user: User): PublicUser {
  const { passwordHash, ...rest } = user;   // removes the field at runtime
  return rest;
}

const input: NewUser = { name: "Ada", email: "ada@example.com", passwordHash: "x9f..." };
const saved: User = { id: "u1", ...input };
console.log(toPublic(saved));
```

```output
{ id: 'u1', name: 'Ada', email: 'ada@example.com' }
```

`NewUser` is what a "create" form produces before the database assigns an `id`. `PublicUser` is the response type. In `toPublic`, rest destructuring ([[b1-destructuring]]) removes `passwordHash` from the runtime object, and its type is exactly `Omit<User, "passwordHash">`, so the type and the value agree. The type alone would not remove anything.

`Omit` is defined as `Pick<T, Exclude<keyof T, K>>`: take the keys of `T`, exclude `K`, and pick what remains. Two consequences follow from that definition.

**Omit does not check its keys.** Its constraint is `K extends keyof any` — any string, number or symbol — not `K extends keyof T`. `Omit<User, "pasword">` compiles and removes nothing, so a typo or a later rename silently leaks the field you meant to drop. If you want checked keys, define a strict version: `type StrictOmit<T, K extends keyof T> = Omit<T, K>`.

**Omit on a union collapses it.** `keyof` a union is only the keys common to every member, so `Omit` keeps only those:

```typescript title="omit-union.ts"
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

type Broken = Omit<Shape, "kind">;   // {} — radius and side are gone

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type Fixed = DistributiveOmit<Shape, "kind">;
// Omit<{ kind: "circle"; radius: number }, "kind"> | Omit<{ kind: "square"; side: number }, "kind">
```

The only key both members share is `kind`, so after removing it nothing is left. The fix is a **distributive conditional type**: `T extends unknown ? … : never` applies `Omit` to each member of the union separately ([[b2-conditional-types]] explains distribution). This matters for discriminated unions ([[b2-discriminated-unions]]) and for component props that are unions ([[b2-mutually-exclusive-props]]).

A common React use is wrapping a component and replacing one of its props: `type ButtonProps = Omit<ComponentProps<"button">, "type"> & { type?: "button" | "submit" }`. See [[b2-react-component-props]].

## Record {#b2-record-utility}

`Record<K, V>` builds an object type whose keys are `K` and whose values all have type `V`. `K` must be a key-like type (`string`, `number`, `symbol` or a union of literals). It is the standard way to type a dictionary or a lookup table.

The most useful form uses a **finite union of keys**, and then `Record` requires every key to be present:

```typescript title="record.ts"
type Status = "idle" | "loading" | "success" | "error";

const LABELS: Record<Status, string> = {
  idle: "Ready",
  loading: "Loading...",
  success: "Done",
  error: "Something went wrong",
};

function label(status: Status): string {
  return LABELS[status];
}

console.log(label("loading"));
```

```output
Loading...
```

If someone adds `"cancelled"` to `Status`, `LABELS` stops compiling with *Property 'cancelled' is missing in type … but required in type 'Record<Status, string>'*. That **exhaustiveness** is the main reason to prefer `Record<Status, string>` over a loosely typed object: the compiler finds every table that needs a new entry. The same pattern types route tables (`Record<RouteName, Component>`), icon maps and reducer handler maps. When you also want to keep the literal types of the values, use `satisfies Record<Status, string>` instead of an annotation; see [[b2-variant-map-satisfies]] and [[b2-satisfies]].

With a **wide key type** such as `string`, `Record<string, V>` is equivalent to an index signature `{ [key: string]: V }`. It describes a dictionary with unknown keys — user IDs to users, header names to values. Here the compiler cannot know which keys exist, and by default it assumes every lookup succeeds:

```typescript title="record-string.ts"
const scores: Record<string, number> = { ada: 3 };
const missing = scores["grace"];   // typed number, but undefined at runtime
console.log(missing);
```

```output
undefined
```

The compiler option `noUncheckedIndexedAccess` changes such reads to `number | undefined`, forcing a check. For a dictionary that is updated frequently or has non-string keys, a `Map<string, number>` is often better, since `map.get` is always typed `V | undefined`. [[b2-record-vs-index-signature]] compares the options.

`Record<string, unknown>` is a common type for "some JSON object". It has one trap, shown in [[b2-generic-constraints]]: values typed with an `interface` are not assignable to it, because interfaces lack an implicit index signature. And for sparse maps where only some literal keys are present, use `Partial<Record<K, V>>`, as the `groupBy` example in [[b2-generics]] does.

## Readonly {#b2-readonly-utility}

`Readonly<T>` produces a type with the same properties as `T`, each marked `readonly`, so assigning to any of them is a compile error. It expresses "you may look at this, not change it" — for function parameters you promise not to mutate, configuration objects, and state snapshots that must be replaced rather than edited.

```typescript title="readonly.ts"
interface Point {
  x: number;
  y: number;
  meta: { label: string };
}

function translate(p: Readonly<Point>, dx: number): Point {
  // p.x += dx;            // error TS2540: Cannot assign to 'x' because it is a read-only property.
  return { ...p, x: p.x + dx };
}

const origin: Readonly<Point> = { x: 0, y: 0, meta: { label: "origin" } };
const moved = translate(origin, 5);
origin.meta.label = "changed";   // allowed: Readonly is shallow
console.log(moved, origin.meta.label);
```

```output
{ x: 5, y: 0, meta: { label: 'changed' } } changed
```

Two lessons are in that output. First, `translate` cannot modify its argument, so it builds a new object — the immutable-update style React state requires. Second, **`Readonly` is shallow**: `origin.meta` is read-only as a *property* (you cannot replace it), but the object it points to is still mutable, so `origin.meta.label = "changed"` compiles. And since the spread in `translate` copied the reference to `meta`, the change is visible through `moved` too. A recursive `DeepReadonly<T>` type, written like `DeepPartial` above, or `as const` for literal data ([[b2-as-const-objects]]), covers nested objects.

**Readonly is compile-time only.** Nothing stops JavaScript from mutating the object at runtime, and a value can lose its `readonly` view by being assigned to a mutable type, because TypeScript allows assigning `Readonly<Point>` to `Point`. For real runtime immutability use `Object.freeze`, which is also shallow ([[b1-object-freeze-seal]]).

Applied to an array type, `Readonly<number[]>` becomes `readonly number[]`, the same as `ReadonlyArray<number>`: mutating methods such as `push` and `sort` disappear from the type, while `map`, `filter` and `slice`, which return new arrays, remain. See [[b2-readonly-arrays]]. For individual properties, write the `readonly` modifier directly in the interface ([[b2-readonly-properties]]); use `Readonly<T>` when you want a read-only *view* of a type that is mutable elsewhere.

## ReturnType {#b2-returntype}

`ReturnType<F>` takes a **function type** and gives back the type the function returns. It lets you derive a type from a function's implementation instead of writing it out separately, so the two cannot disagree.

Because it needs a type, not a value, you almost always combine it with the type-level `typeof` operator ([[b2-typeof]]), which turns a value — here, a function — into its type:

```typescript title="return-type.ts"
function createCounter(start: number) {
  let value = start;
  return {
    increment: () => ++value,
    reset: () => { value = start; },
    get current() { return value; },
  };
}

type Counter = ReturnType<typeof createCounter>;
// { increment: () => number; reset: () => void; readonly current: number }

function logCounter(counter: Counter) {
  console.log(counter.current);
}

const c = createCounter(10);
c.increment();
logCounter(c);
```

```output
11
```

`createCounter` has no annotated return type; its type is inferred from the object it returns. `ReturnType<typeof createCounter>` captures that inferred shape as `Counter`, so other code can accept counters without anyone writing the interface by hand. When the factory gains a new method, `Counter` gains it too. This is common for factory functions, store creators (`type Store = ReturnType<typeof createStore>`), and Redux-style selectors and action creators.

Writing `ReturnType<createCounter>` without `typeof` is an error: *'createCounter' refers to a value, but is being used as a type here. Did you mean 'typeof createCounter'?*

Some behaviours to know:

- **Async functions** return a promise, so `ReturnType` of an `async` function is `Promise<…>`. To get the resolved value, wrap it in `Awaited` — see the next sections.
- **Overloaded functions** ([[b2-function-overloading]]) have several signatures; `ReturnType` uses the **last** overload signature (not the implementation signature), which may not be the one you wanted.
- **Generic functions** have their type parameters replaced by their constraints: for `function wrap<T>(x: T): T[]`, `ReturnType<typeof wrap>` is `unknown[]`. Since TypeScript 4.7 you can instantiate first with an instantiation expression: `ReturnType<typeof wrap<number>>` is `number[]`.
- For a class, use `InstanceType<typeof MyClass>` to get the type of instances; `ReturnType` only accepts call signatures, not constructors.

## Parameters {#b2-parameters-type}

`Parameters<F>` takes a function type and gives back its parameter list as a **tuple type** ([[b2-tuples]]). It is used when one function must accept exactly the same arguments as another — wrappers, decorators, logging, retry helpers, debounced handlers.

```typescript title="parameters.ts"
function sendEmail(to: string, subject: string, urgent = false): string {
  return `${urgent ? "[URGENT] " : ""}${subject} -> ${to}`;
}

type SendEmailArgs = Parameters<typeof sendEmail>;
// [to: string, subject: string, urgent?: boolean | undefined]
type Recipient = Parameters<typeof sendEmail>[0];   // string

function withLogging<A extends unknown[], R>(fn: (...args: A) => R) {
  return (...args: A): R => {
    console.log("calling with", args);
    return fn(...args);
  };
}

const loggedSend = withLogging(sendEmail);
console.log(loggedSend("ada@example.com", "Report"));
// loggedSend("ada@example.com");   // error: Expected 2-3 arguments, but got 1.
```

```output
calling with [ 'ada@example.com', 'Report' ]
Report -> ada@example.com
```

`SendEmailArgs` keeps the parameter names as tuple labels and keeps `urgent` optional, so the tuple describes the call precisely. Indexing a tuple with `[0]` gives the type of one parameter, which is handy when a function's first argument is a large options object you want to reuse: `type Options = Parameters<typeof createClient>[0]`.

`withLogging` shows the generic form of the same idea. Instead of `Parameters<F>`, it infers the argument tuple `A` and return type `R` directly from the function passed in, so `loggedSend` has the same signature as `sendEmail`. Many libraries write wrappers this way because inference from `(...args: A) => R` handles generic and overloaded functions more predictably. When you already have a function type and only need its arguments, `Parameters` is the shorter tool.

The same caveats as `ReturnType` apply: for overloaded functions `Parameters` sees only the last overload signature, and for generic functions the type parameters are replaced by their constraints. For classes, `ConstructorParameters<typeof MyClass>` gives the constructor's parameter tuple. A related helper, `ThisParameterType<F>`, extracts the type of an explicit `this` parameter ([[b2-this-types]]).

## Awaited {#b2-awaited}

`Awaited<T>` gives the type a value of type `T` would have **after `await`**. For a promise it is the resolved value; for nested promises it unwraps every layer; for a value that is not a promise it returns the type unchanged. It was added in TypeScript 4.5, and the compiler uses it to type `await` expressions and `Promise.all`.

```typescript title="awaited.ts"
async function fetchUser(id: string) {
  return { id, name: "Ada", roles: ["admin"] };
}

type FetchUserResult = ReturnType<typeof fetchUser>;   // Promise<{ id: string; ... }>
type User = Awaited<FetchUserResult>;                  // { id: string; name: string; roles: string[] }

type A = Awaited<Promise<Promise<number>>>;   // number
type B = Awaited<string>;                     // string
type C = Awaited<Promise<string> | number>;   // string | number

async function main() {
  const user: User = await fetchUser("u1");
  console.log(user.roles[0]);
}
main();
```

```output
admin
```

`Awaited<ReturnType<typeof fn>>` is the idiom for "the resolved result of an async function", and it is common enough that teams often alias it, as covered in [[b2-async-return-infer]]. It lets code that receives the result — a cache, a React component's props, a test fixture — use the exact type `fetchUser` produces without anyone writing it twice.

The examples `A`, `B` and `C` show the rules. Nested promises are unwrapped recursively, matching the runtime behaviour: a promise that resolves to a promise is followed until a non-promise value appears ([[b1-promise-chaining]]). Non-promise types pass through, matching `await 5`, which gives `5`. Unions are unwrapped member by member.

Strictly, `Awaited` does not look for `Promise` but for a **thenable**: any object type with a callable `then` method, the same rule `await` follows at runtime. So a custom object such as `{ then(cb: (v: number) => void): void }` is awaited to `number`.

Before 4.5, people wrote their own unwrapper — `T extends Promise<infer U> ? U : T` — which unwraps only one layer and misses thenables. Prefer the built-in. One practical case where it shines: `Promise.all([fetchUser("1"), 5])` is typed `Promise<[User, number]>` because its definition maps each element through `Awaited`.

## The other built-in utilities

The remaining utilities are used less often but are worth recognising:

| Utility | What it does | Example result |
|---|---|---|
| `Exclude<T, U>` | Removes union members assignable to `U` | `Exclude<"a" \| "b" \| "c", "a">` → `"b" \| "c"` |
| `Extract<T, U>` | Keeps union members assignable to `U` | `Extract<string \| number, number>` → `number` |
| `NonNullable<T>` | Removes `null` and `undefined` | `NonNullable<string \| null>` → `string` |
| `InstanceType<C>` | Instance type of a constructor type | `InstanceType<typeof Date>` → `Date` |
| `ConstructorParameters<C>` | Constructor parameters as a tuple | for `class P { constructor(x: number, y: number) {} }`, `ConstructorParameters<typeof P>` → `[x: number, y: number]` |
| `NoInfer<T>` | Blocks inference from a position (TS 5.4) | see [[b2-generic-constraints]] |
| `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` | Transform string literal types | `Capitalize<"click">` → `"Click"` |

`Exclude` and `Extract` act on **union members**, whereas `Omit` and `Pick` act on **object properties** — a frequent source of confusion. `Exclude<User, "id">` does nothing useful; `Omit<User, "id">` is what you meant. The string utilities are covered with [[b2-template-literal-types]].

## Worked example: an API layer from one model

Here the utilities work together to type a small service. Everything is derived from one `Product` interface and one service function.

```typescript title="product-api.ts"
interface Product {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
  internalNotes: string;
  createdAt: Date;
}

type NewProduct = Omit<Product, "id" | "createdAt">;
type ProductPatch = Partial<Omit<Product, "id" | "createdAt">>;
type PublicProduct = Readonly<Omit<Product, "internalNotes">>;
type StockStatus = "in-stock" | "low" | "sold-out";

const STATUS_TEXT: Record<StockStatus, string> = {
  "in-stock": "Available",
  low: "Only a few left",
  "sold-out": "Sold out",
};

const db = new Map<string, Product>();

async function createProduct(input: NewProduct): Promise<PublicProduct> {
  const product: Product = { ...input, id: `p${db.size + 1}`, createdAt: new Date(0) };
  db.set(product.id, product);
  const { internalNotes, ...publicFields } = product;
  return publicFields;
}

async function updateProduct(id: string, patch: ProductPatch) {
  const current = db.get(id);
  if (!current) return undefined;
  const next: Product = { ...current, ...patch };
  db.set(id, next);
  return next;
}

function stockStatus(p: Pick<Product, "stock">): StockStatus {
  return p.stock === 0 ? "sold-out" : p.stock < 5 ? "low" : "in-stock";
}

type CreateArgs = Parameters<typeof createProduct>;            // [input: NewProduct]
type Created = Awaited<ReturnType<typeof createProduct>>;      // PublicProduct

async function main() {
  const args: CreateArgs = [{ name: "Lamp", priceCents: 2500, stock: 3, internalNotes: "supplier B" }];
  const created: Created = await createProduct(...args);
  const updated = await updateProduct(created.id, { stock: 0 });
  console.log(created.name, STATUS_TEXT[stockStatus(created)]);
  console.log(updated && STATUS_TEXT[stockStatus(updated)]);
}
main();
```

```output
Lamp Only a few left
Sold out
```

Walk through the decisions:

1. **`NewProduct`** omits the two server-generated fields. A client cannot send an `id`, and forgetting `stock` is a compile error.
2. **`ProductPatch`** adds `Partial` on top, so an update can change any editable field but never `id` or `createdAt`.
3. **`PublicProduct`** removes `internalNotes` from the type, and the rest destructuring in `createProduct` removes it from the value. `Readonly` tells consumers not to mutate the returned object.
4. **`STATUS_TEXT`** is a `Record` over a finite union, so adding a status forces a new label.
5. **`stockStatus`** takes `Pick<Product, "stock">`, so it accepts a full `Product`, a `PublicProduct` or a test object with only `stock` — it asks for exactly what it uses.
6. **`CreateArgs`** and **`Created`** are extracted from `createProduct` itself, so a test helper or a client SDK can stay in sync with the function without importing internal types.

If `Product` gains a `category` field tomorrow, `NewProduct`, `ProductPatch` and `PublicProduct` all include it with no further edits, and every object literal that builds a `NewProduct` without it is flagged.

## In real systems

- **API boundaries.** Create, update and response types are derived from entity types with `Omit`, `Partial` and `Pick`, often generated from a database schema or an OpenAPI document. See [[b2-type-safe-apis]].
- **React.** Props are extended and narrowed with `Omit<ComponentProps<"input">, "onChange">`, `Pick<User, "name">` and `Partial<Props>` for defaults; `useReducer` handler tables are `Record<Action["type"], Handler>`. See [[b2-react-typescript]].
- **Configuration.** Public options are `Partial`, resolved options are `Required`, and the frozen result is `Readonly`.
- **State management.** Store and selector types are derived with `ReturnType<typeof createStore>` and `ReturnType<typeof selectCart>`, so they follow the implementation.
- **Testing.** `Parameters<typeof fn>` types fixtures and mocks; `Awaited<ReturnType<typeof fetchX>>` types fake responses.

## Trade-offs and alternatives

Derived types keep variants in sync with one source of truth, cost nothing at runtime and document intent ("this is a `User` without its id"). Their costs are readability and tooling. A deeply composed type such as `Readonly<Partial<Omit<Pick<…>>>>` is hard to read, and editors sometimes show it unexpanded, so hovering does not reveal the final shape. Name intermediate types (`ProductPatch`, `PublicProduct`) rather than nesting utilities inline in signatures.

Writing an explicit interface is sometimes the better choice. When a variant is *conceptually* separate from the model — a public API contract you promise to keep stable even if the database model changes — deriving it couples the two, and an internal change could silently change your public API. In that case, write the contract by hand and let the compiler check that your mapping code produces it.

Finally, remember the limits shared by all of them: they are shallow, `Omit` does not validate keys, and none of them checks anything at runtime. Runtime validation libraries can produce both a validator and a type from one schema, which is often a better source of truth for external data than an interface plus utilities.

## Common mistakes

> [!MISTAKE] Expecting a utility type to change runtime data
> `Omit<User, "passwordHash">` as a return type does not remove the field. Returning the full `user` object type-checks (it has every required property) and the hash goes to the client. Remove the field in code — rest destructuring or an explicit object — and use the type to check that code.

**Assuming `Partial` and `Readonly` are deep.** Nested objects keep their original optionality and mutability. Use a recursive `DeepPartial` or `DeepReadonly`, or `as const` for literal data.

**Misspelling a key in `Omit`.** `Omit<User, "pasword">` compiles and omits nothing. Use a `StrictOmit<T, K extends keyof T>` helper for keys that must exist.

**Using `Omit` on a union.** It keeps only the common keys, often leaving `{}`. Use a distributive version.

**Forgetting `typeof`.** `ReturnType<myFunction>` is an error: utilities take types, so write `ReturnType<typeof myFunction>`.

**Using `ReturnType` on an async function and expecting the data.** The result is a `Promise<…>`; wrap it with `Awaited`.

**Mixing up `Exclude` and `Omit`.** `Exclude` filters union members; `Omit` removes object properties.

**Trusting `Record<string, V>` lookups.** Every key is assumed to exist. Enable `noUncheckedIndexedAccess` or use a `Map`.

## Interview perspective

Utility types appear in TypeScript interviews in two forms: usage ("how would you type the body of a PATCH request?") and implementation ("write `Pick` and `Omit` yourself"). For usage, name the utility, write the type, and say what it protects against. For implementation, show the mapped type and explain each part.

> [!INTERVIEW] Implement `Pick`, `Omit` and `Partial`
> `type MyPick<T, K extends keyof T> = { [P in K]: T[P] }` — iterate over the chosen keys and copy each property type. `type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>` — compute the remaining keys first. `type MyPartial<T> = { [P in keyof T]?: T[P] }` — iterate over all keys and add `?`. Mention that the built-in `Omit` does not check `K` against `keyof T`, and that all three are shallow.

Questions to prepare:

- **What is the difference between `Pick`/`Omit` and `Extract`/`Exclude`?** Properties of an object type versus members of a union.
- **How do you get the resolved type of an async function?** `Awaited<ReturnType<typeof fn>>`.
- **How would you type a lookup table that must cover every status?** `Record<Status, V>`, ideally with `satisfies` to keep literal values.
- **What does `ReturnType` do with overloads?** It uses the last overload signature.
- **Why might `Omit` on a union give `{}`?** `keyof` a union is the intersection of the members' keys; use a distributive conditional type.
- **Write `DeepPartial`.** A recursive mapped type that recurses when the property type is an object, with notes on arrays and functions.

## Practice

1. **Model variants.** Given `interface Post { id: string; title: string; body: string; authorId: string; publishedAt?: Date }`, write `NewPost`, `PostPatch` (cannot change `id` or `authorId`) and `PostCard` (only `id`, `title`, `publishedAt`).
2. **Exhaustive table.** Write `Record<HttpMethod, boolean>` describing which methods are safe, then add `"PATCH"` to `HttpMethod` and observe the error.
3. **Strict omit.** Implement `StrictOmit<T, K extends keyof T>` and show one bug it catches that `Omit` does not.
4. **Wrapper.** Write `retry<A extends unknown[], R>(fn: (...args: A) => Promise<R>, times: number)` that returns a function with the same parameters, and check its type with `Parameters` and `Awaited<ReturnType<…>>`.
5. **Deep readonly.** Write `DeepReadonly<T>` and show that `obj.a.b = 1` is rejected for a nested object.
6. **Implement from scratch.** Write `MyRequired`, `MyReadonly` and `MyRecord` without looking at the definitions above.

```quiz
Q: `interface Prefs { theme: string; layout: { sidebar: boolean; width: number } }`. Which object is a valid `Partial<Prefs>`?
- [x] `{ layout: { sidebar: true, width: 240 } }`
- [ ] `{ layout: { sidebar: true } }`
- [ ] `{ theme: null }`
- [ ] `{ colour: "blue" }`
> `Partial` is shallow: `layout` becomes optional, but if you provide it, it must be a complete `{ sidebar; width }`, so `{ sidebar: true }` alone fails. Optional does not mean nullable, so `theme: null` fails under strict null checks, and unknown properties are rejected in object literals.
```

```quiz
Q: What does `Omit<User, "pasword">` (note the typo) produce for `interface User { id: string; password: string }`?
- [ ] A compile error, because `"pasword"` is not a key of `User`
- [x] `{ id: string; password: string }` — nothing is removed and no error is reported
- [ ] `{ id: string }`
- [ ] `{}`
> `Omit`'s key parameter is constrained to `keyof any`, not `keyof User`, so any string is accepted. Excluding a key that does not exist removes nothing. `Pick` would have reported the typo, because its constraint is `K extends keyof T`.
```

```quiz
Q: For `async function load(): Promise<string[]>`, which type is `string[]`?
- [ ] `ReturnType<typeof load>`
- [ ] `ReturnType<load>`
- [x] `Awaited<ReturnType<typeof load>>`
- [ ] `Parameters<typeof load>`
> `ReturnType<typeof load>` is `Promise<string[]>`, because async functions return promises. `Awaited` unwraps the promise. `ReturnType<load>` is an error because `load` is a value and needs `typeof`; `Parameters` gives the empty tuple `[]`.
```

## Quick revision {#quick-revision}

- Utility types are generic types in the standard library; they transform types at compile time and are erased.
- Derive variants from one model so they stay in sync: create = `Omit<T, generated keys>`, patch = `Partial<…>`, response = `Omit<T, secret keys>`.
- `Partial<T>`: all properties optional (`?`); shallow; `{}` is valid.
- `Required<T>`: all properties required (`-?`); strips the `undefined` that `?` added; shallow.
- `Readonly<T>`: all properties `readonly`; shallow; compile-time only; on arrays gives `readonly T[]`.
- `Pick<T, K extends keyof T>`: keep keys `K`; keys checked; modifiers preserved.
- `Omit<T, K extends keyof any>`: drop keys `K`; keys NOT checked; collapses unions — use a distributive version.
- `Record<K, V>`: finite union keys → every key required (exhaustive tables); `string` keys → dictionary, lookups assumed present.
- `ReturnType<typeof fn>`: return type; last overload; generic params become constraints; `InstanceType` for classes.
- `Parameters<typeof fn>`: parameter tuple with labels and optionality; `[0]` for the first parameter; `ConstructorParameters` for classes.
- `Awaited<T>`: unwraps promises and thenables recursively; non-promises pass through; `Awaited<ReturnType<typeof asyncFn>>` (TS 4.5+).
- `Exclude`/`Extract` filter union members; `Pick`/`Omit` filter object properties.

| Family | Built with | Members |
|---|---|---|
| Object transforms | Mapped types | `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record` |
| Function extractors | Conditional types + `infer` | `ReturnType`, `Parameters`, `InstanceType`, `ConstructorParameters` |
| Union filters | Distributive conditional types | `Exclude`, `Extract`, `NonNullable` |
| Promise unwrapping | Recursive conditional type | `Awaited` |

## Key takeaways {#key-takeaways}

- Utility types derive new types from existing ones, so variants of a model cannot drift out of sync with it.
- Object utilities are mapped types and are shallow; nested objects need recursive versions.
- `Pick` checks its keys and `Omit` does not; `Omit` also collapses unions unless you distribute it.
- `Record` over a finite union gives exhaustive lookup tables; over `string` it gives a dictionary whose lookups are not checked by default.
- `ReturnType`, `Parameters` and `Awaited`, combined with `typeof`, let types follow function implementations.
- Utility types never change runtime data; code must still remove secret fields and validate external input.
