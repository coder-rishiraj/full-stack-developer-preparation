---
summary: An explicit type is a type you write yourself instead of letting the compiler work it out. You will learn what writing a type actually changes — which direction the compiler checks, where errors appear, what information is kept or lost — and how explicit types differ from type assertions and `satisfies`.
difficulty: beginner
minutes: 35
objectives:
  - Explain the difference between an explicit (declared) type and an inferred type for the same value
  - Predict how an explicit type changes where the compiler reports an error
  - Compare explicit annotations, type assertions (`as`) and `satisfies`, and choose the right one
  - Use explicit types to fix inference that is too wide, too narrow or empty
  - Recognise over-annotation and explain what it costs
---

## Introduction

TypeScript can work out most types by itself. If you write `const port = 8080`, the compiler already knows `port` is a number; you did not have to say so. That process is **type inference**, taught in [[b2-type-inference]]. An **explicit type** is the opposite: you state the type yourself, as in `const port: number = 8080` or `function parsePort(value: string): number`.

If the compiler can infer types, why write any? Because an explicit type is not only a description — it is a **commitment**. It tells the compiler "this is what I intend; check my code against it". That changes three things: *what* gets checked, *where* errors are reported, and *what information* other code can rely on. Used in the right places — function signatures, empty containers, data entering the program — explicit types catch bugs at the point where they are made and turn a function's signature into a contract that callers can read without opening the body.

This lesson is about the *idea* of explicit types: what they do to the type checker, how they differ from look-alike features, and when they help. The exact syntax for writing types on every kind of declaration is covered in [[b2-type-annotations]], and the practical rules of thumb for choosing between explicit and inferred types are in [[b2-when-explicit-vs-inferred]].

## Before you start

- **Primitive and object types** — `string`, `number`, `boolean`, object shapes and arrays. See [[b2-primitive-object-types]].
- **Optional static typing** — that TypeScript lets you add as many or as few types as you like. See [[b2-optional-static-typing]].
- **Compiling with `tsc`** — that type errors are reported by the compiler and types are erased from the output. See [[b2-tsc-compilation]].

## The intuition

Imagine a warehouse where boxes move between rooms. Inside a room, workers can see what is in each box, so nobody needs a label. At the doors between rooms, though, boxes get a printed **name tag** saying what they must contain, and an inspector checks every box against its tag. If a box does not match, the inspector stops it *at that door*, not three rooms later where someone opens it and finds the wrong thing.

Explicit types are those name tags. Inference is the workers seeing inside the box. Inside a function body, inference is usually enough. At the doors — parameters, return values, exported values, data arriving from a network or a file — a tag makes the expectation visible and moves error detection to the place where the mistake happened.

The analogy breaks in one place: the inspector only checks at compile time. Once the code runs, the tags are gone. An explicit type cannot check data the compiler never saw, such as a JSON response.

## Declared type versus inferred type

Every variable has a **declared type** — the type the compiler uses whenever the variable is read or assigned. With an explicit type, the declared type is exactly what you wrote. Without one, the compiler computes it from the initial value.

```typescript title="declared.ts"
let inferred = 5;               // declared type: number (inferred)
let explicit: number = 5;       // declared type: number (written)
let wide: string | number = 5;  // declared type: string | number
```

For the first two lines the outcome is identical; the annotation on `explicit` adds nothing. The third line is where explicit types start to matter. The value `5` alone would infer `number`, but the annotation declares a wider type, so later assignments of strings are allowed:

```typescript title="wide.ts"
let value: string | number = 5;
console.log(value.toFixed(1));
value = "five";
console.log(value.toUpperCase());
```

```output
5.0
FIVE
```

Notice that `value.toFixed(1)` compiled even though the declared type includes `string`. After an assignment, TypeScript's **control-flow analysis** tracks the type of the value actually stored — here `number` — until the next assignment. This is called **narrowing**, covered in [[b2-narrowing]]. The declared type still governs what you may *assign*; the narrowed type governs what you may *do* with the current value.

## What an explicit type changes

### The initializer is checked against the declared type

With an annotation, the compiler checks the value against the type you wrote: the value is the *source*, the annotation is the *target*, and the source must be **assignable** to the target. That catches mistakes that inference would quietly accept, because inference would simply adopt whatever type the value happens to have.

```typescript title="checked.ts"
type User = { name: string; email: string };
const user: User = { name: "Ada", email: "ada@example.com", age: 36 };
```

```output
checked.ts(2,61): error TS2353: Object literal may only specify known properties, and 'age' does not exist in type 'User'.
```

This is an **excess property check**: when a fresh object literal is assigned to an explicit object type, any property the type does not mention is reported, because it is almost always a typo or a misunderstanding of the type. Without the annotation, `user` would simply have been inferred as `{ name: string; email: string; age: number }` and nothing would have been reported.

### Errors appear where the mistake is

Explicit return types show this best. Here is the same function twice, once with a declared return type and once without:

```typescript title="returns.ts"
export function discountFor(code: string): number {
  if (code === "VIP") return 0.2;
  if (code === "STAFF") return "0.5";
  return 0;
}

export function discountInferred(code: string) {
  if (code === "VIP") return 0.2;
  if (code === "STAFF") return "0.5";
  return 0;
}
const d = discountInferred("VIP") * 100;
```

```output
returns.ts(3,25): error TS2322: Type 'string' is not assignable to type 'number'.
returns.ts(12,11): error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
```

Both versions contain the same bug: `"0.5"` is a string. With the explicit `: number`, the error points at line 3, the exact `return` statement that is wrong. Without it, the compiler happily infers the return type `string | number` — the function is internally consistent — and the error surfaces at line 12, in a *caller*, possibly in another file written by another person. In a large codebase that caller might not exist yet, and the bug would ship until someone used the function.

An explicit return type also catches missing returns:

```typescript title="missing-return.ts"
export function label(score: number): string {
  if (score >= 50) return "pass";
  if (score >= 0) return "fail";
}
```

```output
missing-return.ts(1,39): error TS2366: Function lacks ending return statement and return type does not include 'undefined'.
```

Negative scores fall off the end and return `undefined`. The annotation forces you to decide what should happen.

### The declared type is all that callers see

An explicit type can *hide* information as well as add it. Once you annotate, the rest of the program sees only the declared type, not the more specific type of the value.

```typescript title="lost-info.ts"
const routes: Record<string, string> = { home: "/", about: "/about" };
routes.contact.toUpperCase(); // compiles — and crashes at runtime
```

`Record<string, string>` says "any string key maps to a string", so the compiler believes `routes.contact` exists. The object literal knew its exact keys; the annotation threw that knowledge away. This is the main cost of explicit types, and it is why `satisfies` exists (below). The general rule: an annotation **replaces** the inferred type, so make sure what you write is at least as precise as what you are replacing.

## Fixing inference that is wrong

Inference only sees the value in front of it. Some values do not contain enough information, and an explicit type supplies what is missing.

**Empty containers.** An empty array or map has no elements to learn from. Writing the element type makes later operations checked:

```typescript title="empty.ts"
const pending: string[] = [];
pending.push(3);
const cache = new Map<string, number>();
cache.set("a", "b");
```

```output
empty.ts(2,14): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
empty.ts(4,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

`new Map<string, number>()` is an explicit **type argument**: instead of annotating the variable, you tell the generic `Map` constructor what its key and value types are. The same pattern appears in React as `useState<User | null>(null)` — the initial value `null` alone would make the state type `null` forever. Generics are taught in [[b2-generics]].

**Values that start narrower than they will become.** `let status = "idle"` infers `string`, which may be too wide if only a few states are valid. A property initialised to `null` is worse: `const form = { selected: null }` gives `selected` the type `null`, so a later `form.selected = "x"` is an error (TS2322). An explicit type such as `{ selected: string | null }` states the full range of values up front.

**Values from outside the program.** `JSON.parse` returns `any`, which disables checking. Annotating the result (`const body: Order = JSON.parse(text)`) makes later code checked, but it is a promise, not a proof — nothing verified that `text` really contains an `Order`. The safer approach is to type the raw result as `unknown` and validate it before giving it a specific type; see [[b2-special-types]] and [[b2-type-safe-apis]].

## Explicit types, assertions and `satisfies`

Three features look similar because they all put a type next to a value. They do very different things.

```typescript title="three-ways.ts"
type User = { name: string; email: string };

const a: User = { name: "Ada", email: "a@x.io" };             // annotation
const b = { name: "Ada" } as User;                            // assertion
const c = { name: "Ada", email: "a@x.io" } satisfies User;    // satisfies

try {
  console.log(b.email.toUpperCase());
} catch (e) {
  console.log((e as Error).message);
}
```

```output
Cannot read properties of undefined (reading 'toUpperCase')
```

- An **explicit type annotation** (`const a: User`) checks the value against the type and then gives the variable that type. If the value does not fit, you get an error.
- A **type assertion** (`as User`) tells the compiler "trust me, this is a `User`". It does not check that the value has every property; it only refuses assertions between types that do not overlap at all. Here `b` is missing `email`, the compiler accepts it, and the program crashes when `email` is read. Assertions are an escape hatch for cases where you genuinely know more than the compiler, such as after a runtime check it cannot follow. They are covered in [[b2-type-assertions]].
- **`satisfies`** (TypeScript 4.9+) checks the value against the type like an annotation does, but the variable keeps its own, more precise inferred type. It is the fix for the `routes` problem above: `const routes = { home: "/", about: "/about" } satisfies Record<string, string>` verifies every value is a string *and* remembers that only `home` and `about` exist. See [[b2-satisfies]].

| Feature | Checks the value? | Variable's type afterwards | Typical use |
|---|---|---|---|
| `const x: T = v` | Yes, including excess properties | `T` | Declaring intent; boundaries |
| `const x = v as T` | Only that `T` and the value's type overlap | `T` | Escape hatch when you know more than the compiler |
| `const x = v satisfies T` | Yes, including excess properties | The inferred type of `v` | Checking a shape while keeping literal detail |

> [!WARNING] An assertion is not an explicit type
> Writing `as SomeType` to silence an error is the most common way to reintroduce the bugs TypeScript is meant to prevent. If an annotation would report an error, the error is usually correct. Reach for `as` only when you can explain why the compiler cannot see a fact you have checked.

## How it works internally

For a declaration with an annotation, the type checker does three steps. First, it resolves the annotation to a type (looking up aliases, interfaces and library types). Second, it checks the initializer **with the annotation as context**: the declared type flows *into* the expression, which is why `const handler: (e: MouseEvent) => void = (e) => ...` lets you omit the type of `e` — this is **contextual typing**. Third, it tests assignability of the initializer's type to the declared type and reports an error if it fails. From then on, every read of the variable starts from the declared type (narrowed by control flow), and the initializer's own type is forgotten.

For a function with a declared return type, every `return` expression is checked against that type individually, and the end of the function is checked for reachability. Without one, the compiler collects the types of all `return` expressions and combines them into a union, which then becomes the function's type.

All of this happens in the compiler. The emitted JavaScript contains no trace of the annotations, so explicit types have **zero runtime cost** — and zero runtime protection.

## In real systems

Library and module authors annotate every exported function's parameters and return type. The signature is documentation that cannot go stale, the return type stops internal refactors from accidentally changing the public API, and declaration files (`.d.ts`) generated from explicit types are faster for the compiler and clearer for users. TypeScript's `isolatedDeclarations` option (5.5+) goes further and requires explicit types on exports so that other tools can generate declaration files without running the type checker.

React codebases write explicit prop types for every component (`function Button(props: ButtonProps)`) and explicit type arguments for state that starts empty (`useState<Item[]>([])`), while leaving local variables inside components inferred. API layers declare the response type at the function that fetches it, ideally after runtime validation, so every component that uses the data gets real types without annotating anything.

## Trade-offs and alternatives

Explicit types make intent visible, catch mistakes at their source, and stabilise contracts between modules. They cost keystrokes, they can drift (a wide annotation such as `string` on a value that was a precise literal union throws detail away), and when overused they make code noisy without adding safety. An annotation that merely repeats what inference already knows — `const count: number = 0` — is harmless but adds nothing.

The alternatives are inference (less noise, always in sync with the code, but errors can surface far from the cause) and `satisfies` (checking without losing detail, but the resulting type is not something a reader can see written down). Most well-written TypeScript uses all three: explicit types at boundaries, inference inside, `satisfies` for configuration objects.

## Common mistakes

- **Annotating every local variable.** `const name: string = "Ada"` adds noise and, for `const`, loses the literal type `"Ada"`. Annotate where it changes something.
- **Using `as` to make an error go away.** Assertions skip the check that would have caught the bug. Use an annotation and fix the value, or validate at runtime.
- **Annotating with a wider type than you need.** `Record<string, string>` for a fixed set of keys, or `string` for a fixed set of values, discards information. Use a narrower type or `satisfies`.
- **Believing an annotation validates data.** `const user: User = await response.json()` compiles because the source is `any`. Validate external data.
- **Leaving empty containers unannotated.** Give `[]`, `new Map()` and `useState(null)` an explicit element or state type.

## Interview perspective

**"When do you write explicit types in TypeScript?"** A strong answer names boundaries — exported functions, parameters, public return types, component props — and the cases where inference lacks information — empty arrays and maps, values initialised to `null`, data from `JSON.parse`. It also mentions *not* annotating obvious locals.

**"What is the difference between `x: T`, `x as T` and `x satisfies T`?"** Annotation checks and adopts `T`; assertion overrides checking and adopts `T`; `satisfies` checks but keeps the inferred type. Give an example of each going wrong: an assertion hiding a missing property, an annotation losing literal keys.

**Follow-up: "Why annotate return types if inference works?"** Errors are reported at the faulty `return` rather than in callers, accidental API changes become compile errors, and readers see the contract without reading the body.

```quiz
Q: Where is the error reported if a function with no return type annotation accidentally returns a string on one path and a number on another?
- [ ] On the `return` statement that returns the string
- [x] Nowhere inside the function; the return type is inferred as `string | number`, so errors appear only where callers misuse it
- [ ] The compiler refuses to infer mixed return types
> Without a declared return type, every `return` is consistent with the inferred union, so the function body is error-free. Declaring `: number` moves the error to the faulty `return`, which is why boundary functions benefit from explicit return types.
```

```quiz
Q: What does `const b = { name: "Ada" } as User` do when `User` requires both `name` and `email`?
- [ ] Reports an error because `email` is missing
- [ ] Adds `email: undefined` to the object
- [x] Compiles, and `b` is typed `User` even though it has no `email`
> A type assertion overrides the checker; it only rejects types with no overlap at all. At runtime the object still lacks `email`, so `b.email.toUpperCase()` throws. An annotation `const b: User = ...` would have reported the missing property.
```

```quiz
Q: You want TypeScript to verify every value in `const routes = { home: "/", about: "/about" }` is a string, and still know that only `home` and `about` exist. What do you write?
- [ ] `const routes: Record<string, string> = { ... }`
- [ ] `const routes = { ... } as Record<string, string>`
- [x] `const routes = { ... } satisfies Record<string, string>`
> The annotation checks the values but replaces the type with "any string key", so `routes.contact` would compile. The assertion does the same without proper checking. `satisfies` checks the values and keeps the inferred object type with its exact keys.
```

## Practice

1. Take a function you have written without a return type, add the one you intended, and see whether the compiler finds anything.
2. Write `const settings = { theme: "dark", fontSize: 14 }` three ways — annotated with a `Settings` type, asserted with `as Settings`, and checked with `satisfies Settings` — then add a misspelt property to each and compare the errors.
3. Predict which of these compiles under strict settings, then check: `const a = { id: null }; a.id = 5;` and `const b: { id: number | null } = { id: null }; b.id = 5;`.
4. Fix `const items = []; items.push({ id: 1 });` so that pushing `{ id: "1" }` is an error.
5. Find an `as` in a codebase you know and decide whether it could be replaced by an annotation, a runtime check, or `satisfies`.

## Quick revision {#quick-revision}

- Explicit type = a type you write (`let x: T`, `function f(a: A): R`); inferred type = one the compiler computes.
- An annotation makes the declared type exactly `T`; the initializer must be assignable to `T`.
- Fresh object literals assigned to an explicit type get **excess property checks**.
- Explicit return types report errors at the faulty `return` and catch missing returns (TS2366); without them errors surface in callers.
- An annotation replaces the inferred type — a wide annotation (`Record<string, string>`) loses detail.
- Use explicit types for empty containers (`string[]`, `new Map<K, V>()`, `useState<T | null>(null)`).
- `as T` overrides checking; `satisfies T` checks but keeps the inferred type.
- Annotations on `any` values (`JSON.parse`) are promises, not validation. All annotations are erased at runtime.

## Key takeaways {#key-takeaways}

- An explicit type is a commitment the compiler checks the code against, not just a comment.
- Its biggest benefit is moving errors to where the mistake is made, especially for function return types.
- It also defines exactly what other code may rely on, which can mean throwing away detail the value had.
- Annotations, assertions and `satisfies` all place a type beside a value, but only annotations and `satisfies` check it.
- Write explicit types at boundaries and where inference lacks information; let inference handle the obvious.
