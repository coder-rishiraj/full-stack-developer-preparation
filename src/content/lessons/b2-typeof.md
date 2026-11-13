---
summary: In a type position, `typeof` asks the compiler for the type of an existing value — a variable, object, function or class — so you can derive types from code instead of writing them twice. You will learn how it differs from JavaScript's runtime `typeof`, what it captures for literals, objects, functions, classes and enums, and how it combines with `as const`, `ReturnType` and `InstanceType`.
difficulty: intermediate
minutes: 40
objectives:
  - Distinguish the type-level `typeof` operator from JavaScript's runtime `typeof` by where it appears
  - Predict the type `typeof` captures for `let` and `const` variables, objects, arrays, functions, classes and enums
  - Use `as const` to stop literal widening before taking `typeof`
  - Derive function and class types with `ReturnType<typeof fn>`, `Parameters<typeof fn>` and `InstanceType<typeof C>`
  - Recognise the syntax limits of `typeof` and when an explicit interface is the better choice
---

## Introduction

Much of a real codebase is values that already have a perfectly good shape: a configuration object, a table of theme colours, a function that builds an API response, a class. Very often you also need a *type* for that shape — to annotate a parameter, a React prop or a test fixture. The naive solution is to write an interface by hand next to the value:

```typescript title="duplicated.ts"
const defaultSettings = { theme: "light", fontSize: 14, autosave: true };

interface Settings {   // a second copy of the same facts
  theme: string;
  fontSize: number;
  autosave: boolean;
}
```

Now the same fact lives in two places. Add a `language` field to the object and forget the interface, and the two drift apart silently.

TypeScript solves this with the **type query operator `typeof`**. Written in a position where a type is expected, `typeof defaultSettings` means "the type the compiler inferred for the value `defaultSettings`":

```typescript title="derived.ts"
const defaultSettings = { theme: "light", fontSize: 14, autosave: true };
type Settings = typeof defaultSettings;
// { theme: string; fontSize: number; autosave: boolean }

function applySettings(s: Settings) {
  console.log(`theme=${s.theme} size=${s.fontSize}`);
}
applySettings(defaultSettings);
```

```output
theme=light size=14
```

The value is now the **single source of truth**, and the type follows it automatically. This lesson explains exactly what `typeof` captures — which depends on how the value was declared — and the companion tools (`as const`, `ReturnType`, `InstanceType`) that make it practical.

## Before you start

- **Runtime `typeof` in JavaScript** — the operator that returns `"string"`, `"object"` and so on. See [[b1-typeof]].
- **Type inference** — how TypeScript works out a type from an initialiser, including widening. See [[b2-type-inference]] and [[b2-literal-types]].
- **Type aliases** — `type X = ...`. See [[b2-type-aliases]].
- **`keyof`** — the key-union operator; `keyof typeof x` appears often below. See [[b2-keyof]].

## The intuition: two operators with one name

JavaScript already has a `typeof` operator. It runs when the program runs and returns a string:

```typescript title="runtime-typeof.ts"
const n = 42;
console.log(typeof n);         // runtime: a string describing the value
let kind = typeof n;           // the *type* of kind is a union of those strings
console.log(kind === "number");
```

```output
number
true
```

TypeScript adds a second, unrelated meaning. **Where `typeof` appears decides which one you get.** In an expression (right of `=`, inside `if`, as an argument), it is the JavaScript operator and produces a string at runtime. In a type position (after `:`, after `type X =`, inside `<...>`), it is the type query and produces a type at compile time, then disappears from the emitted JavaScript.

| | Runtime `typeof` | Type-level `typeof` |
|---|---|---|
| Where it appears | Expressions | Type annotations and type aliases |
| Operand | Any expression | A variable or property path (`a`, `a.b.c`) |
| Result | One of 8 strings: `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"` | A full TypeScript type |
| Exists in emitted JS | Yes | No |

You can see both in one line: in `let kind = typeof n`, the `typeof` is runtime, and TypeScript types `kind` as the union `"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"`, because that is everything the runtime operator can return. Runtime `typeof` checks inside `if` statements also *narrow* types, which is covered in [[b2-typeof-narrowing]].

A good mental picture of the type-level operator: you point at a value and ask the compiler, "what did you decide this is?" Whatever the compiler would show when you hover over the variable is what `typeof` gives you.

## What `typeof` captures

### Variables: `let` versus `const`

`typeof` returns the type the compiler has for the variable **at that point in the code**: normally its declared type (the annotation, or the type inferred from the initialiser), narrowed by any control-flow analysis that applies there. Inference rules matter here, because they decide how specific the type is:

```typescript title="let-const.ts"
let mode = "dark";        // let: may be reassigned, so widened
const fixedMode = "dark"; // const: can never change, so kept literal

type A = typeof mode;      // string
type B = typeof fixedMode; // "dark"

let id: string | number = "u1";
type C = typeof id;        // string: narrowed by the assignment just above

function show(value: string | number) {
  type D = typeof value;   // string | number: nothing has narrowed it here
}
```

A `let` initialised with `"dark"` is **widened** to `string` because the variable could later hold any string. A `const` cannot be reassigned, so its literal type `"dark"` is kept. The last two lines show the narrowing rule. `id` is declared `string | number`, but because it was just initialised with a string, the compiler has narrowed it to `string`, and the type query sees that narrowed type. The parameter `value` has not been narrowed, so `typeof value` is the full declared union. When you want the declared type regardless of position, write the annotation's type directly or give it a name with a type alias.

### Objects and arrays

Properties of an object are mutable even when the variable holding the object is `const`, so TypeScript widens property types:

```typescript title="objects.ts"
const config = { retries: 3, mode: "fast", tags: ["api"] };
type Config = typeof config;
// { retries: number; mode: string; tags: string[] }
```

`mode` is `string`, not `"fast"`, because `config.mode = "slow"` is legal. This is the most common surprise with `typeof`: you wanted the literal values and got general types.

### Stopping widening with `as const`

A **const assertion**, `as const`, tells the compiler to infer the narrowest type it can: literal types for every primitive, `readonly` on every property, and `readonly` tuples instead of arrays.

```typescript title="as-const.ts"
const config = { retries: 3, mode: "fast", tags: ["api"] } as const;
type Config = typeof config;
// { readonly retries: 3; readonly mode: "fast"; readonly tags: readonly ["api"] }
```

Now the type records the exact values, and the object cannot be mutated through the type system (it is *not* frozen at runtime; use `Object.freeze` for that). `as const` plus `typeof` is the foundation of the patterns in [[b2-keyof-typeof-patterns]]; the assertion itself is covered in [[b2-as-const]].

### Property paths

The operand can be a dotted path, which is handy for reaching inside a large object:

```typescript title="paths.ts"
const theme = {
  colors: { primary: "#0a7", danger: "#d33" },
  spacing: [4, 8, 16],
} as const;

type Colors = typeof theme.colors;     // { readonly primary: "#0a7"; readonly danger: "#d33" }
type Primary = typeof theme.colors.primary; // "#0a7"
```

### Functions

`typeof` on a function gives its full call signature:

```typescript title="functions.ts"
async function fetchUser(id: string) {
  return { id, name: "Ada", role: "admin" as const };
}

type FetchUser = typeof fetchUser;
// (id: string) => Promise<{ id: string; name: string; role: "admin" }>

type Args = Parameters<typeof fetchUser>;               // [id: string]
type Result = ReturnType<typeof fetchUser>;             // Promise<{ ... }>
type User = Awaited<ReturnType<typeof fetchUser>>;      // { id: string; name: string; role: "admin" }
```

On its own, the function type is rarely what you want. The utility types `ReturnType<F>` and `Parameters<F>` take a *function type*, not a function, so you pass them `typeof fetchUser`. Writing `ReturnType<fetchUser>` is an error because `fetchUser` is a value. For `async` functions the return type is a `Promise`, so wrap it in `Awaited` to get what `await` produces ([[b2-returntype]], [[b2-parameters-type]], [[b2-awaited]]).

This is especially useful for factory functions whose result type is long and has never been written down:

```typescript title="factory.ts"
function createCounter() {
  let n = 0;
  return {
    inc: () => ++n,
    get value() { return n; },
  };
}

type Counter = ReturnType<typeof createCounter>;
// { inc: () => number; readonly value: number }

const c: Counter = createCounter();
c.inc(); c.inc();
console.log(c.value);
```

```output
2
```

With **overloaded** functions, `typeof fn` keeps all overloads, but `ReturnType` and `Parameters` look only at the **last** overload signature. With `function f(x: string): string; function f(x: number): number;`, `ReturnType<typeof f>` is `number`. If you need another overload's type, write it out explicitly.

### Classes: constructor versus instance

A class declaration creates two things with one name: a **type** describing instances, and a **value** — the constructor function. Writing the class name in a type position means the instance type; `typeof` the class name means the constructor:

```typescript title="classes.ts"
class Point {
  static origin = new Point(0, 0);
  constructor(public x: number, public y: number) {}
}

type P1 = Point;                         // instance: { x: number; y: number }
type Ctor = typeof Point;                // constructor: new (x, y) => Point, plus static `origin`
type P2 = InstanceType<typeof Point>;    // Point again

function build(C: typeof Point) {
  return new C(1, 2);
}
console.log(build(Point), Point.origin);
```

```output
Point { x: 1, y: 2 } Point { x: 0, y: 0 }
```

`typeof Point` is needed whenever you pass the class itself around — dependency-injection containers, factories, registries of component classes. `InstanceType<typeof C>` converts back from the constructor type to the instance type, which matters in generic code that receives only the constructor. See [[b2-classes-ts]].

### Enums

An enum is also both a type and a value. `typeof` gives the type of the enum *object*, and `keyof typeof` gives its member names:

```typescript title="enums.ts"
enum Direction { Up, Down }

type DirName = keyof typeof Direction;  // "Up" | "Down"
const name: DirName = "Up";
console.log(Direction[name], Direction[0]);
```

```output
0 Up
```

A numeric enum object also has **reverse mappings** at runtime (`Direction[0]` is `"Up"`), but `keyof typeof Direction` lists only the member names, so `"0"` is not a valid `DirName`. See [[b2-enums]].

## Syntax limits

The type query accepts an identifier or a dotted property path. It does not evaluate arbitrary expressions:

```typescript title="limits.ts"
function makeId() { return "id_1"; }
interface User { name: string }

type A = typeof makeId();   // error: typeof cannot call a function
type B = typeof User;       // error: User is only a type
```

```output
error TS1005: ';' expected.
error TS1109: Expression expected.
```

The first line is a *syntax* error, and the compiler stops before type-checking, so it reports only that. With the first alias removed, the second line produces `error TS2693: 'User' only refers to a type, but is being used as a value here.`

- **No calls.** `typeof makeId()` is a syntax error; use `ReturnType<typeof makeId>`.
- **No types as operands.** `typeof` needs a value. Interfaces and type aliases are already types — use them directly.
- **Brackets bind to the type, not the value.** `typeof items[number]` parses as `(typeof items)[number]`, an indexed access on the type of `items`. This usually does what you want (the element type), but it is worth knowing why it works; see [[b2-indexed-access]].
- **Generic functions can be instantiated (TypeScript 4.7+).** `typeof identity<string>` is an *instantiation expression* that fixes the type parameter, so `ReturnType<typeof identity<string>>` is `string`.

## How it works internally

When the checker meets `typeof x` in a type position, it resolves the name `x` in the **value** namespace (not the type namespace), finds its symbol, and returns that symbol's type — the same type it computed when checking `x`'s declaration. Nothing is evaluated. The emitted JavaScript contains no trace of the type query, so `type Settings = typeof defaultSettings` costs nothing at runtime; it only creates a dependency between the type and the value's declaration.

Two consequences follow:

1. **The type comes from static analysis, not from running code.** The checker uses the declared type narrowed by control flow at the point of the query — inside an `if (typeof v === "string")` block, `typeof v` is `string`. It never reflects values that only exist at runtime.
2. **Values imported only for their type can be imported with `import type`.** `import type { defaultSettings } from "./settings"` followed by `typeof defaultSettings` is allowed, and the import is erased from the output, so the module is not loaded just for its type. Plain `import` works too; bundlers drop unused imports either way, but `import type` makes the intent explicit (see [[b2-ts-modules]]).

## Worked example: a config-driven feature-flag module

A team keeps feature flags in one object and wants typed accessors without a separate interface.

```typescript title="flags.ts"
const FLAGS = {
  newCheckout: { enabled: true, rollout: 0.25 },
  darkMode: { enabled: false, rollout: 0 },
  betaSearch: { enabled: true, rollout: 1 },
} as const;

type FlagName = keyof typeof FLAGS;            // "newCheckout" | "darkMode" | "betaSearch"
type FlagConfig = (typeof FLAGS)[FlagName];    // union of the three config objects

function isOn(name: FlagName, userBucket: number): boolean {
  const flag: FlagConfig = FLAGS[name];
  return flag.enabled && userBucket < flag.rollout;
}

console.log(isOn("newCheckout", 0.1));
console.log(isOn("newCheckout", 0.9));
console.log(isOn("darkMode", 0));
```

```output
true
false
false
```

Step by step: `as const` keeps the flag names and values literal and read-only. `typeof FLAGS` is the type of the whole object, `keyof` turns its keys into the union `FlagName`, and indexing with `FlagName` gives the type of a single flag's configuration. Adding a fourth flag to `FLAGS` updates `FlagName` automatically, and `isOn("dakMode", 0)` is a compile error. No interface had to be written or maintained.

## In real systems

- **Redux and state libraries.** `type RootState = ReturnType<typeof store.getState>` and `type AppDispatch = typeof store.dispatch` are the documented Redux Toolkit setup: the store is configured once and its types are derived.
- **Validation schemas.** Libraries such as Zod use the same idea in a different form: `z.infer<typeof userSchema>` derives the static type from the runtime schema object.
- **Constants and route tables.** `keyof typeof ROUTES` and `typeof ROLES[number]` replace hand-written unions and many enums ([[b2-keyof-typeof-patterns]]).
- **Test doubles.** `jest.Mocked<typeof api>` or a hand-rolled `const fake: typeof realService = {...}` keeps mocks aligned with the real implementation.

## Trade-offs and alternatives

Deriving types with `typeof` removes duplication, but it also makes the *implementation* the definition of the contract. That is ideal for internal constants and module-private helpers. It is risky for **public APIs**: a library that exports `type Options = typeof defaultOptions` changes its public type whenever someone edits the default object, and consumers see long, implementation-shaped types in their tooltips. For a published contract, write an explicit interface and check the value against it — with `satisfies` ([[b2-satisfies]]) you get both the check and the narrow inferred type.

Other alternatives are writing the types by hand (clear, but duplicated) and generating them from a schema such as OpenAPI or GraphQL (best when the source of truth lives outside your code).

## Common mistakes

> [!MISTAKE] Forgetting `as const`
> `const ROLES = ["admin", "user"]; type Role = typeof ROLES[number];` gives `string`, not `"admin" | "user"`, because array elements are widened. Add `as const` to the array.

- **Passing a value where a type is expected.** `ReturnType<makeUser>` fails; write `ReturnType<typeof makeUser>`.
- **Applying `typeof` to a type.** `typeof User` where `User` is an interface is an error. Interfaces are already types.
- **Confusing constructor and instance.** A parameter typed `Point` expects an instance; to accept the class itself, type it `typeof Point`.
- **Expecting runtime behaviour.** A type-level `typeof` does not check anything when the program runs. If data comes from outside (JSON, an API), deriving a type from a sample value does not validate real data.
- **Exporting `typeof` internals as a public API.** Publish an interface instead, and keep `typeof` for internal derivation.

## Interview perspective

- *"What is the difference between `typeof` in JavaScript and in TypeScript?"* — One is a runtime operator returning a string, the other a compile-time type query; position decides which. Mention that `let k = typeof x` uses the runtime one and types `k` as the eight-string union.
- *"How do you get a union of an object's keys without repeating them?"* — `keyof typeof obj`, usually with `as const` on the object if you also need the values.
- *"How do you type the result of a factory function you don't control?"* — `ReturnType<typeof factory>`, plus `Awaited` for async functions. Follow-up: what happens with overloads (last signature).
- *"What is `typeof MyClass` versus `MyClass` as a type?"* — Constructor versus instance; `InstanceType` converts between them.
- A strong answer also names the limit: deriving types from values is great for internal code, but public contracts deserve explicit interfaces.

## Practice

1. Given `const LEVELS = ["debug", "info", "warn", "error"] as const`, derive `type Level` and write `function log(level: Level, msg: string)`. Then remove `as const` and explain the new type of `Level`.
2. Write a function `createApi(baseUrl: string)` that returns an object with three methods, and derive `type Api` from it. Write a fake `Api` for tests and confirm the compiler catches a missing method.
3. Write `function create<C extends new (...args: any[]) => any>(C: C, ...args: ConstructorParameters<C>): InstanceType<C>` and call it with `Point`.
4. Explain, in one sentence each, what `typeof items[0]`, `typeof items[number]` and `(typeof items)[number]` are for `const items = ["a", 1] as const`.

## Quick revision {#quick-revision}

- Type-position `typeof x` returns the compile-time type of the value `x`; expression-position `typeof x` is JavaScript's runtime string operator.
- Operand must be an identifier or dotted path; no calls, no types.
- `let` widens literals, `const` keeps primitive literals, object properties widen; `as const` makes everything literal and `readonly`.
- `typeof x` sees the declared type as narrowed by control flow at that point.
- Functions: `ReturnType<typeof f>`, `Parameters<typeof f>`, `Awaited<...>` for async; overloads → last signature.
- Classes: `typeof C` is the constructor; `C` or `InstanceType<typeof C>` is the instance.
- Enums: `keyof typeof E` is the member names, without reverse-mapping keys.
- `typeof a[number]` means `(typeof a)[number]`.
- No runtime cost; for public APIs prefer explicit interfaces plus `satisfies`.

## Key takeaways {#key-takeaways}

- The type-level `typeof` lets a value be the single source of truth for its type.
- What you get depends on inference: widening for `let` and object properties, literals for `const` primitives, exact read-only types with `as const`.
- Functions and classes become usable as types through `typeof` combined with `ReturnType`, `Parameters` and `InstanceType`.
- `typeof` reads compile-time information only; it never validates runtime data.

```quiz
Q: `const settings = { theme: "dark", size: 12 };` What is `typeof settings`?
- [ ] `{ theme: "dark"; size: 12 }`
- [x] `{ theme: string; size: number }`
- [ ] `"object"`
- [ ] `{ readonly theme: "dark"; readonly size: 12 }`
> Object properties are mutable even in a `const` object, so their literal types widen. The readonly literal version is what `as const` produces, and `"object"` is the result of the runtime `typeof`, not the type query.
```

```quiz
Q: Which line correctly gives the resolved value of `async function load(): Promise<number[]>`?
- [ ] `type R = ReturnType<load>`
- [ ] `type R = typeof load()`
- [x] `type R = Awaited<ReturnType<typeof load>>`
- [ ] `type R = ReturnType<typeof load>`
> `ReturnType` needs a function type, so it takes `typeof load`; its result is `Promise<number[]>`, and `Awaited` unwraps it to `number[]`. `ReturnType<load>` passes a value where a type is required, and `typeof load()` is a syntax error because the type query cannot call functions.
```

```quiz
Q: A function should accept the class `Point` itself so that it can call `new` on it. What should the parameter type be?
- [ ] `Point`
- [x] `typeof Point`
- [ ] `InstanceType<Point>`
- [ ] `keyof Point`
> `Point` as a type means an instance; the constructor function is the value `Point`, whose type is `typeof Point`. `InstanceType` goes the other way (constructor type to instance type) and needs a constructor type as its argument.
```
