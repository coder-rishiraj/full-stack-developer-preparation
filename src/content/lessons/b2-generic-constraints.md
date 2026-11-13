---
summary: A generic constraint, written `T extends Something`, limits which types a type parameter accepts so that generic code can safely use the members that every allowed type has. You will learn how constraints unlock property access while keeping the caller's specific type, how `K extends keyof T` gives typed property keys, and the errors and traps constraints create.
difficulty: intermediate
minutes: 45
objectives:
  - Explain what `T extends U` means for a type parameter and why it is an assignability bound, not inheritance
  - Write constrained generic functions and classes that read members of `T` and still return the caller's specific type
  - Implement typed property access with `K extends keyof T` and the indexed access type `T[K]`
  - Debug the "could be instantiated with a different subtype" error and the interface-versus-index-signature trap
  - Choose between a constraint, a plain parameter type and `unknown` for a given function
---

## Introduction

In [[b2-generics]] you saw that a generic function must work for *every* type its type parameter could be. That promise is what makes generic code safe, but it also makes a bare type parameter almost useless inside the function. This version of a helper that returns the longer of two values does not compile:

```typescript title="no-constraint.ts"
function longest<T>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
```

```output
error TS2339: Property 'length' does not exist on type 'T'.
error TS2339: Property 'length' does not exist on type 'T'.
```

The compiler is right. Nothing stops a caller from writing `longest(10, 20)`, and numbers have no `length`. What the function actually needs is narrower than "every type": it needs "every type that has a numeric `length`". A **generic constraint** says exactly that:

```typescript title="longest.ts"
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

const list = longest([1, 2], [3]);          // list: number[]
const word = longest("generic", "type");    // compiles: strings have length
console.log(list, word);
```

```output
[ 1, 2 ] generic
```

`T extends { length: number }` reads as "`T` can be any type, as long as it is assignable to `{ length: number }`". Inside the function, the compiler now knows that `a.length` exists. Outside, callers still get their own specific type back: `longest([1, 2], [3])` returns `number[]`, not some vague "thing with a length".

Constraints are how almost every useful generic helper is written: lookups by `id`, typed `get(obj, key)` and `pick(obj, keys)` functions, comparators, repositories, and the built-in utility types themselves. This lesson teaches how they work, how to choose them, and the confusing errors they produce.

## Before you start

- **Generics** — type parameters, inference and type arguments. See [[b2-generics]].
- **Assignability and structural typing** — TypeScript compares types by their shape, so "assignable to `{ length: number }`" means "has a numeric `length`". See [[b2-structural-typing]].
- **`keyof` and indexed access** — `keyof T` is the union of `T`'s keys and `T[K]` is the type of property `K`. Needed for the `keyof` section; see [[b2-keyof]] and [[b2-indexed-access]].
- **Interfaces and intersections** — see [[b2-interfaces]] and [[b2-intersections]].

## The intuition: a minimum requirement

Think of a job advert that says "must hold a driving licence". It does not say who will apply, and an applicant who also speaks three languages and can fly a plane is perfectly acceptable. What the advert guarantees is that whoever is hired can drive, so the employer can plan around that one fact.

A constraint is that advert. `T extends { length: number }` does not fix `T`; it sets a **minimum requirement** that every possible `T` must meet. The function body may rely on the requirement and nothing more. The caller may pass a type that offers much more — an array with all its methods, a string, a custom collection class — and keeps all of it, because the result type is still `T`, the caller's own type.

Where the analogy stops: the check happens when the code is compiled, not when it runs. Nobody inspects the "applicant" at runtime; the compiler checks each call site against the constraint and then erases everything.

## What `T extends U` means

The word `extends` is overloaded in TypeScript, so it is worth being precise. In a type parameter list, `T extends U` means **`T` must be assignable to `U`** — every value of type `T` must also be a valid value of type `U`. It has nothing to do with class inheritance. A plain object literal, a string or an array can satisfy `T extends { length: number }` without any `class` or `extends` keyword anywhere, because TypeScript compares shapes ([[b2-structural-typing]]).

`U` is called the **constraint** or **bound** of `T`. It affects two places.

**At the call site**, the compiler checks that the inferred or explicit type argument satisfies the bound, and reports an error if it does not:

```typescript title="call-site-check.ts"
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest(10, 20);
```

```output
error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

**Inside the body**, a value of type `T` can be used wherever a `U` is expected. You can read `a.length` because whatever `T` is, it has `length`. The compiler treats `T` as "some unknown subtype of `U`" — it knows the members `U` guarantees, and nothing about any extra members the real type might have.

An unconstrained type parameter is implicitly constrained to `unknown`, which is why it allows almost nothing: `unknown` guarantees no members.

### Why not take `U` as an ordinary parameter type?

If the body only needs `length`, you might ask why the function needs a type parameter at all. Compare:

```typescript title="plain-vs-generic.ts"
function longestPlain(a: { length: number }, b: { length: number }) {
  return a.length >= b.length ? a : b;
}

function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

const plain = longestPlain([1, 2], [3]);   // plain: { length: number }
const typed = longest([1, 2], [3]);        // typed: number[]

typed.push(4);       // fine
plain.push(4);       // error: push does not exist on { length: number }
```

```output
error TS2339: Property 'push' does not exist on type '{ length: number; }'.
```

Both versions accept the same arguments and run the same code. The difference is the return type. The plain version forgets everything about its arguments except `length`; the generic version remembers the exact type the caller passed in. That is the whole reason to use a constraint rather than a parameter type: **the constraint describes what the function needs, and the type parameter preserves what the caller has.**

The converse is a useful test. If a type parameter does not appear in the return type or in a second parameter — if it relates nothing to anything — the generic adds nothing, and the plain parameter type is simpler. `function printLength<T extends { length: number }>(x: T): void` should be `function printLength(x: { length: number }): void`.

## Kinds of constraints

### Object-shape constraints

The most common constraint names the properties a function needs. Naming the shape with an interface keeps signatures readable and documents the requirement:

```typescript title="find-by-id.ts"
interface Identifiable {
  id: string;
}

function findById<T extends Identifiable>(items: readonly T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

interface User extends Identifiable {
  name: string;
}

const users: User[] = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Linus" },
];

const found = findById(users, "u2");   // found: User | undefined
console.log(found?.name);
```

```output
Linus
```

`found` is `User | undefined`, so `found?.name` type-checks. With a parameter typed `Identifiable[]`, the result would have been `Identifiable | undefined` and `.name` would be an error. Names such as `Identifiable`, `HasTimestamps` and `Comparable` are the conventional style for constraint interfaces.

### Primitive and union constraints

A constraint can be a primitive or a union of primitives. `T extends string` accepts `string` and every string literal type; `T extends PropertyKey` accepts anything usable as an object key (`PropertyKey` is the built-in alias for `string | number | symbol`).

A side effect of primitive constraints matters in practice: they make inference **keep literal types**. Normally a `let` variable widens a literal (see [[b2-literal-types]]), but when the constraint mentions a primitive type, the compiler keeps the literal because it assumes the function cares about the exact value:

```typescript title="literal-preserving.ts"
function plain<T>(value: T): T {
  return value;
}

function tag<T extends string>(value: T): T {
  return value;
}

let a = plain("draft");   // a: string
let b = tag("draft");     // b: "draft"
```

This is why helpers that build typed event names, route paths or action types usually constrain their parameter to `string`: it lets the literal survive into the result type.

### Constraints that refer to other type parameters

A type parameter's constraint can mention another type parameter declared in the same list. The most important case is `K extends keyof T`, covered in its own section below. Another common form is "the second argument must be a subset of the first":

```typescript title="assign-defaults.ts"
function withDefaults<T extends object>(value: Partial<T>, defaults: T): T {
  return { ...defaults, ...value };
}

const config = withDefaults({ retries: 5 }, { retries: 3, timeoutMs: 1000 });
console.log(config);
```

```output
{ retries: 5, timeoutMs: 1000 }
```

`T extends object` rules out primitives (spreading a number makes no sense here), and `Partial<T>` — a utility type from [[b2-utility-types]] — expresses "some of `T`'s properties". `T` is inferred from `defaults`, the argument that carries the full shape.

### Several requirements at once

TypeScript has no `T extends A, B` syntax. To require several things, constrain to their intersection ([[b2-intersections]]):

```typescript title="intersection-constraint.ts"
interface HasId {
  id: string;
}
interface HasUpdatedAt {
  updatedAt: Date;
}

function newest<T extends HasId & HasUpdatedAt>(items: readonly T[]): T | undefined {
  let best: T | undefined;
  for (const item of items) {
    if (!best || item.updatedAt > best.updatedAt) best = item;
  }
  return best;
}

const docs = [
  { id: "a", title: "Plan", updatedAt: new Date("2026-01-02") },
  { id: "b", title: "Notes", updatedAt: new Date("2026-03-04") },
];
console.log(newest(docs)?.title);
```

```output
Notes
```

### Constructor and function constraints

A constraint can describe something callable. `new (...args: any[]) => T` describes a class constructor, which is how generic code gets around the fact that `T` itself does not exist at runtime:

```typescript title="construct.ts"
function createAll<T>(ctor: new () => T, count: number): T[] {
  return Array.from({ length: count }, () => new ctor());
}

class Counter {
  value = 0;
}

const counters = createAll(Counter, 2);   // counters: Counter[]
console.log(counters);
```

```output
[ Counter { value: 0 }, Counter { value: 0 } ]
```

Function-shaped constraints such as `F extends (...args: any) => any` are what `ReturnType<F>` and `Parameters<F>` use; see [[b2-returntype]] and [[b2-parameters-type]]. Mixins ([[b2-mixins]]) constrain a type parameter to a constructor type so they can extend it.

## `K extends keyof T`: typed property keys

The constraint you will write most often after object shapes ties a key to an object. `keyof T` is the union of `T`'s property names, so `K extends keyof T` means "`K` is one (or several) of `T`'s keys". Paired with the **indexed access type** `T[K]` — "the type of property `K` of `T`" — it gives a fully typed property getter:

```typescript title="get-property.ts"
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: "u1", age: 36, admin: false };

const age = getProperty(user, "age");       // age: number
const admin = getProperty(user, "admin");   // admin: boolean
console.log(age, admin);

getProperty(user, "email");                 // error
```

```output
error TS2345: Argument of type '"email"' is not assignable to parameter of type '"age" | "id" | "admin"'.
```

Trace the call `getProperty(user, "age")`:

1. `T` is inferred from `user` as `{ id: string; age: number; admin: boolean }`.
2. `keyof T` is therefore `"id" | "age" | "admin"`, and `K` must be assignable to it.
3. The argument `"age"` gives the candidate `K = "age"`. Because the constraint `keyof T` is made of string literals, the literal is kept rather than widened to `string`.
4. The return type `T[K]` becomes `T["age"]`, which is `number`.

Without the constraint, `obj[key]` would not compile (an arbitrary `K` might not be a key of `T`), and without the separate `K` parameter — if `key` were typed `keyof T` directly — the return type would be `T[keyof T]`, the union `string | number | boolean`, losing the link between the specific key and its value. The same pattern, with `K[]` and a `Pick<T, K>` result, gives a typed `pick` helper; it is worked through in [[b2-generic-pick-helper]] and [[b2-impl-pick]].

## Constraints on generic classes and with defaults

Generic classes take constraints in the same place. A repository that needs to read each entity's `id` constrains its type parameter, and every method can then rely on it:

```typescript title="entity-store.ts"
interface Entity {
  id: string;
}

class EntityStore<T extends Entity> {
  private byId = new Map<string, T>();

  upsert(entity: T): void {
    this.byId.set(entity.id, entity);   // .id is allowed by the constraint
  }

  get(id: string): T | undefined {
    return this.byId.get(id);
  }
}

const products = new EntityStore<{ id: string; price: number }>();
products.upsert({ id: "p1", price: 10 });
products.upsert({ id: "p1", price: 12 });
console.log(products.get("p1")?.price);
```

```output
12
```

`new EntityStore<{ price: number }>()` would be rejected with *Type '{ price: number; }' does not satisfy the constraint 'Entity'*, before any code runs.

A constraint and a default can be combined: `<T extends object = Record<string, unknown>>`. The default comes after the constraint and must satisfy it; see [[b2-default-type-parameters]].

## How it works internally

Constraint checking happens at two moments.

When a generic is **used** — a function called, a class instantiated, a generic type written with arguments — the compiler works out the type arguments (by inference or from what you wrote), then checks each one against its bound. A failure produces either TS2345 (an argument does not match the parameter type it would need) or TS2344 (*Type 'X' does not satisfy the constraint 'Y'*, when the type argument is written explicitly or in a type reference).

When the generic **body** is checked, the compiler does not know the real type argument. It treats each type parameter as an opaque type whose known members are those of its constraint. Reading members works by looking them up on the constraint. Writing a value *into* `T`, however, needs a value of the exact unknown type, and this is where the most confusing constraint error comes from:

```typescript title="subtype-error.ts"
interface RetryOptions {
  retries: number;
}

function defaultOptions<T extends RetryOptions>(): T {
  return { retries: 3 };
}
```

```output
error TS2322: Type '{ retries: number; }' is not assignable to type 'T'.
  '{ retries: number; }' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'RetryOptions'.
```

The message is precise once you read it slowly. `{ retries: 3 }` is a valid `RetryOptions`, but `T` might be `{ retries: number; timeoutMs: number }`, and then the function would be returning an object without `timeoutMs` to a caller who was promised one. A function can only produce a `T` from a value that already is a `T` — one it received from the caller. The fix is almost always to change the signature: return the constraint type (`(): RetryOptions`), or accept the caller's value and add to it, as `withDefaults` does above.

Finally, constraints are erased like every other type. `findById` compiles to a plain function with no check that items have an `id`. If an object with no `id` reaches it through `any` or unvalidated JSON, `item.id` is `undefined` at runtime and the comparison silently fails.

### `extends` in three places

| Where | Example | Meaning |
|---|---|---|
| Class declaration | `class Admin extends User` | Runtime inheritance: `Admin.prototype` links to `User.prototype` |
| Type parameter list | `<T extends User>` | Compile-time bound: `T` must be assignable to `User` |
| Conditional type | `T extends string ? A : B` | Compile-time test: choose `A` if `T` is assignable to `string` |

The last row reuses the same assignability idea as a question rather than a requirement; it is the basis of [[b2-conditional-types]]. `implements` is different again: it asks the compiler to check that a class matches an interface, and adds nothing at runtime ([[b2-implements-vs-extends]]).

## Worked example: an immutable update helper

UI state code often needs "replace the item with this `id` by an updated copy". A typed helper combines several constraint ideas:

```typescript title="update-by-id.ts"
interface HasId {
  id: string;
}

function updateById<T extends HasId>(
  items: readonly T[],
  id: string,
  patch: Partial<Omit<T, "id">>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

const todos: Todo[] = [
  { id: "t1", title: "Write lesson", done: false },
  { id: "t2", title: "Review lesson", done: false },
];

const next = updateById(todos, "t1", { done: true });   // next: Todo[]
console.log(next[0], todos[0].done);

// updateById(todos, "t1", { id: "x" });      // error: id cannot be patched
// updateById(todos, "t1", { done: "yes" });  // error: done must be boolean
```

```output
{ id: 't1', title: 'Write lesson', done: true } false
```

Step by step:

1. `T extends HasId` lets the body compare `item.id` with `id`, and it rejects arrays of things without an `id`.
2. `T` is inferred from `todos` as `Todo`, so the result is `Todo[]` — callers keep their full type.
3. `Partial<Omit<T, "id">>` describes the patch: any subset of `Todo`'s properties except `id`. Each property keeps its type from `Todo`, so `done: "yes"` is caught. [[b2-omit]] and [[b2-partial]] explain these two utility types.
4. `{ ...item, ...patch }` builds a new object instead of mutating, so the original array is untouched — `todos[0].done` is still `false`. That is what React state updates require ([[b1-object-mutability]] explains why mutation breaks change detection).

The spread result is compatible with `T` here because spreading a `T` produces a type containing all of `T`'s members; the compiler accepts it as `T`. Contrast this with `defaultOptions` above, which tried to invent a `T` from nothing.

## In real systems

- **Data helpers.** `findById`, `indexById`, `sortBy<T, K extends keyof T>` and `updateById` appear in nearly every frontend codebase. Lodash's typings and similar libraries use `K extends keyof T` throughout.
- **Typed event systems.** An emitter declared as `class Emitter<Events extends Record<string, unknown[]>>` with `on<E extends keyof Events>(event: E, handler: (...args: Events[E]) => void)` gives each event its own payload type.
- **Forms.** Form libraries type field names as `keyof Values` (often extended to nested paths with [[b2-template-literal-types]]), so a misspelt field name is a compile error.
- **Built-in utility types.** `Pick<T, K extends keyof T>`, `ReturnType<T extends (...args: any) => any>` and `Record<K extends keyof any, T>` are constrained generics; see [[b2-utility-types]].
- **React.** A generic `Select<T extends { id: string }>` component can use `id` as the React `key` while the `onChange` callback receives the caller's full option type.

## Trade-offs and alternatives

A constraint should state the **least** the code needs. Every extra requirement excludes valid callers, and a constraint that is too specific — `T extends User` when the function only reads `id` — makes the helper unusable for orders, products and everything else with an `id`. A constraint that is too loose fails in the other direction: `T extends any` is the same as no constraint, and lint rules such as `@typescript-eslint/no-unnecessary-type-constraint` flag it.

Choose between three options:

- **A plain parameter type** when the function does not return or relate the type — `function printLength(x: { length: number })`.
- **A constrained type parameter** when the function needs some members *and* must hand back or relate the caller's specific type.
- **`unknown` with narrowing** when the input is genuinely arbitrary (external data), so the function must check at runtime what it receives ([[b2-custom-type-guards]]).

Complex constraints — nested conditional types, recursive bounds — produce long error messages that point at the bound rather than at the caller's mistake. Prefer named constraint interfaces and simple bounds, and push complexity into well-named helper types.

## Common mistakes

> [!MISTAKE] Constraining to `Record<string, unknown>` and rejecting interfaces
> `function keys<T extends Record<string, unknown>>(o: T)` accepts object types written with `type`, but rejects values typed with an `interface`: *Argument of type 'IUser' is not assignable to parameter of type 'Record<string, unknown>'. Index signature for type 'string' is missing in type 'IUser'.* Interfaces can be extended later by declaration merging ([[b2-declaration-merging]]), so the compiler will not assume they have no other keys. Use `T extends object` when you only need "some object".

**Returning a new literal as `T`.** "'T' could be instantiated with a different subtype of constraint" means the function tries to create a `T` it cannot know the full shape of. Return the constraint type, or build the result from a `T` the caller passed in.

**Confusing the bound with class inheritance.** `T extends User` does not require `T` to be a subclass of a `User` class, and it creates no prototype link. Any type with `User`'s shape satisfies it.

**Expecting runtime enforcement.** A constraint is checked only at compile time. Data cast with `as` or arriving as `any` can violate it without any error.

**Typing the key as `keyof T` instead of a separate `K`.** `get<T>(obj: T, key: keyof T): T[keyof T]` returns the union of all property types. Use `<T, K extends keyof T>(obj: T, key: K): T[K]` so the result depends on the specific key.

**Letting a second argument widen the type parameter.** In `function setColor<C extends string>(allowed: C[], initial?: C)`, the call `setColor(["red", "green"], "blue")` compiles, because `"blue"` becomes another inference candidate and `C` widens to `"red" | "green" | "blue"`. TypeScript 5.4 added `NoInfer<T>`: declaring `initial?: NoInfer<C>` tells the compiler not to infer from that argument, and the call then fails with *Argument of type '"blue"' is not assignable to parameter of type '"red" | "green" | undefined'*.

## Interview perspective

The standard question is "what does `T extends X` mean in a generic?" A strong answer has three parts: it is a compile-time bound saying `T` must be assignable to `X`; it lets the body use `X`'s members; and unlike a parameter typed `X`, it preserves the caller's specific type in the result. Then write a short example such as `findById<T extends { id: string }>` and point at the return type.

> [!INTERVIEW] Implement `getProperty` or `pick`
> Write `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]` and explain each part: `K extends keyof T` restricts keys to real ones, and `T[K]` ties the result to the chosen key. For `pick`, take `keys: K[]` and return `Pick<T, K>`. Interviewers often follow up with "why not `key: keyof T`?" — the answer is that the return type would collapse to the union of all property types.

Other questions to prepare:

- **Can `T` be narrower than its constraint?** Yes — that is the point. `T` is any subtype of the bound, and the function's return type stays `T`.
- **How do you require two things?** Constrain to an intersection: `T extends A & B`.
- **Why does returning `{ retries: 3 }` as `T` fail?** `T` might be a subtype with more required properties; only a value of type `T` can be returned as `T`.
- **What is the difference between `extends` in a generic, a class and a conditional type?** Bound, runtime inheritance, and a type-level test respectively.

## Practice

1. **`sortBy`.** Write `sortBy<T, K extends keyof T>(items: readonly T[], key: K): T[]` that returns a sorted copy. Then restrict it so only keys whose values are `string` or `number` are allowed (hint: this needs a mapped or conditional type; look ahead to [[b2-mapped-types]]).
2. **`indexById`.** Write `indexById<T extends { id: string }>(items: T[]): Record<string, T>` and check that the values keep their full type.
3. **Fix the subtype error.** Rewrite `defaultOptions<T extends RetryOptions>(): T` in two different ways that compile, and say which one you would choose for a library.
4. **Find the over-constraint.** A teammate wrote `function countActive<T extends User>(items: T[]): number`. Rewrite it with the weakest constraint that works and without a type parameter if possible.
5. **`NoInfer`.** Reproduce the `setColor` widening bug, then fix it with `NoInfer` (TypeScript 5.4 or later).

```quiz
Q: What does the constraint in `function longest<T extends { length: number }>(a: T, b: T): T` achieve that `function longest(a: { length: number }, b: { length: number })` does not?
- [ ] It allows the function to read `a.length`
- [x] It returns the caller's specific type, such as `number[]`, instead of `{ length: number }`
- [ ] It checks at runtime that the arguments have a `length`
- [ ] It allows numbers to be passed
> Both versions can read `.length`, and neither checks anything at runtime (types are erased). The difference is the return type: the type parameter preserves what the caller passed, so `longest([1], [2, 3])` is a `number[]` you can `push` to. Numbers are rejected by both.
```

```quiz
Q: Why does `function make<T extends { retries: number }>(): T { return { retries: 3 }; }` fail to compile?
- [ ] Object literals can never be returned from generic functions
- [ ] `retries` must be optional in the constraint
- [x] `T` could be a subtype with more required properties, so `{ retries: 3 }` is not necessarily a valid `T`
- [ ] The function needs an explicit type argument
> A constraint is a minimum. A caller could instantiate `T` as `{ retries: number; timeoutMs: number }`, and the literal would be missing `timeoutMs`. Returning the constraint type, or building the result from a `T` passed in, fixes it.
```

```quiz
Q: `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]` is called as `getProperty({ id: "a", age: 3 }, "age")`. What is the return type?
- [ ] `string | number`
- [x] `number`
- [ ] `unknown`
- [ ] `"age"`
> `K` is inferred as the literal `"age"` (literals are kept because the constraint is a union of literal keys), so `T[K]` is the type of the `age` property, `number`. `string | number` is what you get if the key parameter is typed `keyof T` instead of a separate `K`.
```

## Quick revision {#quick-revision}

- `T extends U` in a type parameter list = `T` must be assignable to `U` (a compile-time bound, not inheritance).
- The body may use `U`'s members; callers keep their own type because the result is `T`.
- Unconstrained `T` is bounded by `unknown`, so it has no usable members (TS2339).
- Call sites violating the bound: TS2345 for arguments, TS2344 for explicit type arguments.
- Use a plain parameter type if the type parameter would appear only once.
- Primitive constraints (`T extends string`) keep literal types during inference.
- `K extends keyof T` + `T[K]` = typed property access; return type follows the specific key.
- Multiple requirements: `T extends A & B`. Constructors: `new () => T`.
- "Could be instantiated with a different subtype" = you tried to invent a `T`; return the bound or derive from the input.
- `Record<string, unknown>` rejects interfaces (no index signature); use `object`.
- `NoInfer<T>` (TS 5.4) stops an argument from widening a type parameter.
- Constraints are erased: no runtime check.

## Key takeaways {#key-takeaways}

- A constraint states the minimum a generic needs, and lets the body use exactly those members.
- The type parameter preserves the caller's specific type; that is why a constraint beats a plain parameter type when the result relates to the input.
- `K extends keyof T` with `T[K]` is the foundation of typed getters, `pick`, form field names and many utility types.
- Constrain as little as the code needs; over-constrained helpers reject valid callers.
- Generic code can only return a `T` it was given; it cannot construct one from a literal.
- `extends` means a bound in a type parameter list, inheritance in a class, and a test in a conditional type.
