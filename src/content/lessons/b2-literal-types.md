---
summary: A literal type is a type with exactly one value, such as "GET", 404 or true. You will learn how unions of literals describe finite sets of allowed values, why TypeScript sometimes widens a literal to string or number, and how to keep the precise type when you need it.
difficulty: beginner
minutes: 40
objectives:
  - Explain a literal type as a set containing one value and a union of literals as a finite set
  - Predict when TypeScript infers a literal type and when it widens it to string, number or boolean
  - Keep literal types with annotations, as const, satisfies and const type parameters
  - Derive a literal union from a runtime array or object so types and values cannot drift apart
  - Choose between a literal union, a plain string and an enum for a given API
---

## Introduction

Here is a function that sends an HTTP request:

```typescript
function request(method: string, url: string) {
  // ...
}

request("GTE", "/users");
```

It compiles without complaint. The parameter type `string` accepts every string in existence, including the typo `"GTE"`, the empty string and the complete works of Shakespeare. The bug is found only when the server answers `405 Method Not Allowed`, or worse, when a branch such as `if (method === "GET")` silently never runs.

What the function really accepts is a short, fixed list: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`. TypeScript lets you say exactly that:

```typescript
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function request(method: Method, url: string) {
  // ...
}
```

Now `request("GTE", "/users")` is a compile error, and your editor offers the five valid methods as autocomplete suggestions. Each of `"GET"`, `"POST"` and so on is a **literal type**: a type whose only value is that exact string. Joined with `|`, they form a **union of literal types** — a type with a finite list of allowed values.

Literal types look like a small feature, but much of TypeScript's precision rests on them. They are how libraries type HTTP methods, button variants, event names and Redux action types. They are the tags that make [[b2-discriminated-unions]] work. And they are behind one of the most confusing early experiences in TypeScript: a value you wrote as `"GET"` being reported as plain `string`. This lesson explains all three.

## Before you start

- **Type annotations and inference** — how `let x: number` differs from letting the compiler infer. See [[b2-type-annotations]] and [[b2-type-inference]].
- **Union types** — `A | B` means "a value of type A or of type B". See [[b2-unions]].
- **Primitive types** — `string`, `number`, `boolean`, `bigint`. See [[b2-primitive-object-types]].

## The intuition: a type with one member

A useful way to think about any TypeScript type is as a **set of values**. `string` is the set of all strings. `number` is the set of all numbers. `boolean` is the set `{ true, false }`.

A literal type is the smallest useful set: it has exactly one member. The type `"GET"` is the set `{ "GET" }`. The type `404` is the set `{ 404 }`. The type `true` is the set `{ true }`.

Two consequences follow from that picture.

First, every literal type is a **subtype** of its primitive. The set `{ "GET" }` sits inside the set of all strings, so a value of type `"GET"` can go anywhere a `string` is expected. The reverse is not true: a `string` might be `"hello"`, which is not in `{ "GET" }`.

Second, a union is set union. `"GET" | "POST"` is `{ "GET", "POST" }`. You build exactly the set of values your code supports, and the compiler rejects everything outside it.

A street address is a fair analogy. "Any address on Baker Street" is like `string`; "221B Baker Street" is like a literal type; "221B or 221C Baker Street" is a union of literals. The analogy stops at runtime: an address exists in the world, but a literal type exists only while the compiler runs. After compilation, `"GET"` is an ordinary JavaScript string and nothing remembers that it was once a type.

## The kinds of literal types

Any primitive value you can write directly in source code can be a type:

```typescript title="kinds.ts"
type Method = "GET" | "POST";          // string literal types
type Dice = 1 | 2 | 3 | 4 | 5 | 6;     // number literal types
type Big = 10n;                         // bigint literal type (ES2020+)
type Yes = true;                        // boolean literal type

let roll: Dice = 4;
roll = 7;
```

```output
kinds.ts(7,1): error TS2322: Type '7' is not assignable to type 'Dice'.
```

The error is the whole point: `7` is a number, but it is not in the set `{ 1, 2, 3, 4, 5, 6 }`.

Some details are worth knowing:

- **`boolean` is itself a union.** TypeScript defines `boolean` as `true | false`. You rarely write `true` or `false` as types on their own, but they appear in type-level code and in tags such as `{ ok: true; data: T } | { ok: false; error: string }`.
- **Arithmetic loses the literal.** If `roll` has type `Dice`, then `roll + 1` has type `number`. The compiler does not compute which numbers could result; it falls back to the primitive.
- **`null` and `undefined` behave like literal types.** Each is a set with one value, which is why they combine with unions so naturally, as in `string | null` ([[b2-null-undefined-ts]]).
- **There are no literal types for objects or arrays.** `{ x: 1 }` written as a type means "any object with an `x` property of type `1`", not "this particular object".

## Unions of literals: finite sets of allowed values

The most common use of literal types is to list the valid options for a parameter, property or variable:

```typescript title="button.ts"
type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  variant: Variant;
  size?: Size;
}

function buttonClass({ variant, size = "md" }: ButtonProps): string {
  return `btn btn-${variant} btn-${size}`;
}

console.log(buttonClass({ label: "Save", variant: "primary" }));
console.log(buttonClass({ label: "Delete", variant: "danger", size: "sm" }));
```

```output
btn btn-primary btn-md
btn btn-danger btn-sm
```

Compared with `variant: string`, this type does three jobs at once. It **documents** the options where the reader needs them. It **validates** every call site: `variant: "warning"` would be rejected before the code runs. And it **powers tooling**: the editor lists the three variants as completions, and renaming one with the editor's rename command updates every use.

Inside the function, the union also helps. If you write `if (variant === "primray")`, TypeScript reports that the comparison can never be true, because `"primray"` is not in the union. That catches a class of typos that plain strings let through. The general mechanism — comparing with a literal and getting a more precise type in the branch — is called narrowing, and it is the subject of [[b2-narrowing]].

## Literal widening: why "GET" becomes string

Here is the surprise that every TypeScript learner meets:

```typescript title="widening.ts"
type Method = "GET" | "POST";

function send(method: Method) {}

const config = { method: "GET", url: "/users" };
send(config.method);
```

```output
widening.ts(6,6): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Method'.
```

You wrote `"GET"`. Why does the compiler say `string`?

The answer is **literal widening**. When TypeScript infers the type of a *mutable* location from a literal, it widens the literal type to its primitive: `"GET"` becomes `string`, `3` becomes `number`, `true` becomes `boolean`. The property `config.method` is mutable — any later line could run `config.method = "DELETE"` — so the compiler guesses you meant "a string that starts as `"GET"`", not "forever exactly `"GET"`". For most code that guess is right. If `let count = 0` were inferred as the type `0`, you could never increment it.

The rule depends on whether the location can change:

| Declaration | Inferred type | Why |
|---|---|---|
| `const a = "GET"` | `"GET"` | A `const` binding can never be reassigned |
| `let b = "GET"` | `string` | `b` may be reassigned to another string later |
| `let d = a` (where `a` is the const above) | `string` | The literal widens again when copied into a mutable location |
| `const h = cond ? "a" : "b"` | `"a" \| "b"` | Both branches are literals and the binding is `const` |
| `let g = cond ? "a" : "b"` | `string` | Same expression, mutable binding |
| `const config = { method: "GET" }` | `{ method: string }` | Object properties are mutable, even inside a `const` object |
| `const list = ["GET", "POST"]` | `string[]` | Array elements are mutable too |

The last two rows cause most of the confusion. `const` protects the *binding* — you cannot point `config` at another object — but it does not freeze the object's contents. JavaScript lets you change `config.method` at any time, so TypeScript types the property as `string`.

There is one subtle exception in the table's third row. A literal type the compiler *inferred* from a `const` is a "widening" literal: copying it into a `let` widens it again. A literal type you *wrote yourself* is not:

```typescript title="nonwidening.ts"
const inferred = "GET";        // type "GET" (widening)
const annotated: "GET" = "GET"; // type "GET" (non-widening)

let copy1 = inferred;  // string
let copy2 = annotated; // "GET"
copy2 = "POST";
```

```output
nonwidening.ts(6,1): error TS2322: Type '"POST"' is not assignable to type '"GET"'.
```

The annotation is a statement of intent — "this is exactly `"GET"`" — so the compiler carries it forward.

## Keeping literal types when you need them

There are four tools for stopping widening. Each says something slightly different, so the choice matters.

### 1. Annotate the location

The most direct fix is to tell the compiler the type of the property or variable:

```typescript
type Method = "GET" | "POST";
function send(method: Method) {}

const config: { method: Method; url: string } = { method: "GET", url: "/users" };
send(config.method); // OK: config.method has type Method
```

Use this when a named type already exists. Note that `config.method` is now `Method`, not `"GET"` — you asked for the union, so you get the union, and later code may set it to `"POST"`.

### 2. `as const`

A **const assertion** tells the compiler to infer the narrowest possible type for an expression: literals stay literals, object properties become `readonly`, and arrays become `readonly` tuples. It applies recursively to nested objects and arrays.

```typescript title="as-const.ts"
const config = { method: "GET", retries: 3 } as const;
// type: { readonly method: "GET"; readonly retries: 3 }

const methods = ["GET", "POST"] as const;
// type: readonly ["GET", "POST"]

config.retries = 4;
```

```output
as-const.ts(7,8): error TS2540: Cannot assign to 'retries' because it is a read-only property.
```

`as const` is the right tool for fixed configuration and lookup tables — data that really never changes. The `readonly` modifiers are compile-time only; at runtime the object is still mutable unless you also call `Object.freeze`. The assertion is covered in detail in [[b2-as-const]] and [[b2-as-const-assertion]].

### 3. `satisfies`

Sometimes you want the compiler to check a value against a type *without* replacing the inferred type with the annotated one. The `satisfies` operator (TypeScript 4.9+) does exactly that, and because the target type contains literal types, the literals are preserved where the target expects them:

```typescript
type Method = "GET" | "POST";

const route = { method: "GET", url: "/users" } satisfies { method: Method; url: string };
// type: { method: "GET"; url: string }
```

Two things happened. A typo such as `method: "GTE"` would be an error, because `satisfies` checks the value. And `route.method` has the precise type `"GET"` rather than `Method`, because `satisfies` keeps the inferred type. Combining both — `{ ... } as const satisfies RouteConfig` — gives you readonly literals and a shape check. See [[b2-satisfies]].

### 4. `const` type parameters

When a generic function infers its type parameter from an argument, the literals widen as usual:

```typescript title="const-generic.ts"
function first<T>(items: T[]): T {
  return items[0];
}
function firstConst<const T>(items: readonly T[]): T {
  return items[0];
}

const a = first(["sm", "md"]);      // string
const b = firstConst(["sm", "md"]); // "sm" | "md"
```

The `const` modifier on a type parameter (TypeScript 5.0+) asks the compiler to infer as if the caller had written `as const`. Only the inference of `T` changes; the function body is untouched, and callers who pass a variable rather than a literal get whatever type that variable already has. Library authors use this so callers get precise types without remembering `as const` themselves.

## Deriving unions from runtime values

A literal union is erased at compile time. If you also need the list of values at runtime — to render a dropdown, or to validate user input — you might be tempted to write it twice:

```typescript
type Method = "GET" | "POST" | "DELETE";
const METHODS = ["GET", "POST", "DELETE"];
```

Now there are two sources of truth, and they will drift apart the first time somebody adds `"PATCH"` to one and not the other. The fix is to write the values once and **derive the type from them**:

```typescript title="derive.ts"
const METHODS = ["GET", "POST", "DELETE"] as const;
type Method = (typeof METHODS)[number]; // "GET" | "POST" | "DELETE"

const STATUS_TEXT = { 200: "OK", 404: "Not Found", 500: "Server Error" } as const;
type KnownStatus = keyof typeof STATUS_TEXT; // 200 | 404 | 500

for (const m of METHODS) console.log(m);
console.log(STATUS_TEXT[404]);
```

```output
GET
POST
DELETE
Not Found
```

Read `(typeof METHODS)[number]` from the inside out. `typeof METHODS` (the type-level `typeof`, see [[b2-typeof]]) is `readonly ["GET", "POST", "DELETE"]`. Indexing a tuple type with `number` asks "what is the type of an element at any numeric index?", which is the union of its element types. Without `as const`, `METHODS` would be `string[]` and the derived type would collapse to `string`. The same idea with objects uses `keyof typeof`, as in the second example; [[b2-keyof-typeof-patterns]] goes further.

### Checking unknown strings against the list

Deriving the type creates a common follow-up problem. Input from a URL or a form is a `string`, and you want to know whether it is a valid `Method`:

```typescript title="includes.ts"
const METHODS = ["GET", "POST", "DELETE"] as const;
type Method = (typeof METHODS)[number];

function isKnownMethod(input: string): boolean {
  return METHODS.includes(input);
}
```

```output
includes.ts(5,27): error TS2345: Argument of type 'string' is not assignable to parameter of type '"GET" | "POST" | "DELETE"'.
```

On a `readonly ["GET", "POST", "DELETE"]`, the `includes` method is declared to accept only the element type. That is strict in an unhelpful direction: the whole reason you are calling `includes` is that you do not yet know whether `input` is a member. The idiomatic fix is a small type guard that widens the array for the check and narrows the input for the caller:

```typescript title="is-method.ts"
const METHODS = ["GET", "POST", "DELETE"] as const;
type Method = (typeof METHODS)[number];

function isMethod(value: string): value is Method {
  return (METHODS as readonly string[]).includes(value);
}

for (const raw of ["POST", "post", "PATCH"]) {
  console.log(raw, isMethod(raw));
}
```

```output
POST true
post false
PATCH false
```

The `value is Method` return type is a **type predicate**: after `if (isMethod(raw))`, the compiler treats `raw` as `Method`. Type predicates are taught in [[b2-custom-type-guards]]. The cast `as readonly string[]` is safe here, because a list of three specific strings is certainly a list of strings.

## Template literal types

Literal types can be combined with template-literal syntax to produce new string literal types:

```typescript
type Tone = "primary" | "danger";
type Size = "sm" | "md" | "lg";
type ButtonClass = `btn-${Tone}-${Size}`;
// "btn-primary-sm" | "btn-primary-md" | "btn-primary-lg"
// | "btn-danger-sm" | "btn-danger-md" | "btn-danger-lg"

type Handler = `on${Capitalize<"click" | "focus">}`; // "onClick" | "onFocus"
```

When a placeholder holds a union, the result contains every combination — two tones times three sizes gives six members. That is powerful and also a way to create unions with thousands of members by accident, which slows the compiler. Template literal types, the built-in `Uppercase`/`Capitalize` helpers and pattern matching with `infer` are covered in [[b2-template-literal-types]].

## How the compiler treats literal types

Three mechanisms explain everything you have seen so far.

**Assignability follows the subset relation.** `"GET"` is assignable to `"GET" | "POST"`, which is assignable to `string`. Each step moves to a larger set. Going the other way requires proof — a comparison, a type guard or an assertion — because a larger set may contain values the smaller one does not.

**Inference picks a type for each expression, then widens it for mutable locations.** The expression `"GET"` always starts with the literal type `"GET"`. What happens next depends on the destination: a `const` binding keeps it, a `let`, property or array element widens it, and a **contextual type** that expects literals keeps it. Contextual typing is why this compiles even without `as const`:

```typescript
type Method = "GET" | "POST";
function send(method: Method) {}

send("GET");                         // the parameter type gives "GET" its context
const options: { method: Method } = { method: "GET" }; // so does the annotation
```

**Literal types are erased.** The emitted JavaScript for `type Method = "GET" | "POST"` is nothing at all; for `let m: Method = "GET"` it is `let m = "GET"`. That is the main difference from an `enum`, which produces a real runtime object ([[b2-enums]]). It also means a literal type alone can never validate data arriving at runtime — a JSON response claiming `"method": "TRACE"` will flow into a `Method`-typed variable unless code checks it. A guard such as `isMethod` above is the bridge.

## Worked example: a typed API route table

The following program combines the techniques into a pattern you will see in real front-end codebases: one `as const` table of API routes, from which the types for method names and route names are derived.

```typescript title="routes.ts"
const ROUTES = {
  listUsers: { method: "GET", path: "/users" },
  createUser: { method: "POST", path: "/users" },
  deleteUser: { method: "DELETE", path: "/users/:id" },
} as const satisfies Record<string, { method: "GET" | "POST" | "DELETE"; path: string }>;

type RouteName = keyof typeof ROUTES;                 // "listUsers" | "createUser" | "deleteUser"
type RouteMethod = (typeof ROUTES)[RouteName]["method"]; // "GET" | "POST" | "DELETE"

function describe(name: RouteName): string {
  const { method, path } = ROUTES[name];
  return `${method.padEnd(6)} ${path}`;
}

function isSafe(method: RouteMethod): boolean {
  // GET does not change server state, so it can be retried and cached
  return method === "GET";
}

for (const name of Object.keys(ROUTES) as RouteName[]) {
  const note = isSafe(ROUTES[name].method) ? " (safe)" : "";
  console.log(describe(name) + note);
}
```

```output
GET    /users (safe)
POST   /users
DELETE /users/:id
```

Walk through it from the top. `as const` keeps every `method` and `path` as literal types and makes the table readonly. `satisfies Record<...>` then checks the shape: a route written as `method: "GTE"` or missing its `path` would be a compile error, while the inferred type with its literal keys and values survives unchanged. If you had annotated `const ROUTES: Record<string, ...>` instead, the keys would collapse to `string` and `RouteName` would no longer list the three route names.

`RouteName` and `RouteMethod` are derived, never written by hand. Adding a fourth route to the table automatically extends both unions, and every function typed with them picks up the new member. `describe` accepts only real route names, so `describe("listUser")` fails to compile.

The one cast, `Object.keys(ROUTES) as RouteName[]`, exists because `Object.keys` is declared to return `string[]` — an object may have more keys at runtime than its type lists. For a literal table you wrote yourself that cannot happen, so the cast is justified; for objects of unknown origin it would not be.

## In real systems

**Component APIs.** Design-system components type their visual options as literal unions — `variant: "primary" | "secondary" | "ghost"`, `size: "sm" | "md" | "lg"`. Consumers get autocomplete and cannot pass a variant the stylesheet does not support. See [[b2-react-component-props]].

**Protocol and platform strings.** HTTP methods, `fetch`'s `RequestInit` options such as `mode: "cors" | "no-cors" | "same-origin" | "navigate"`, DOM event names in `addEventListener`, and Node's `BufferEncoding` are all literal unions in the standard type definitions. When you hover over one of these parameters, you are reading a literal type.

**Action and message tags.** Redux actions, `postMessage` payloads and WebSocket messages carry a `type` field whose value is a literal type. That field is what lets the compiler tell the messages apart, which is the subject of the next lesson, [[b2-discriminated-unions]].

**Generic constraints.** A function such as `sortBy<T>(items: T[], key: keyof T, direction: "asc" | "desc")` uses a literal union where a boolean like `ascending: boolean` would make call sites unreadable — `sortBy(users, "name", "desc")` says more than `sortBy(users, "name", false)`.

## Trade-offs and alternatives

| Option | Runtime cost | Autocomplete | Accepts unknown strings | Best for |
|---|---|---|---|---|
| `string` | None | No | Yes | Truly open-ended text (names, messages) |
| Literal union | None (erased) | Yes | No | A fixed, known set of options |
| `enum` | Emits an object | Yes | No | When you need a runtime object and can accept non-erasable syntax |
| `"a" \| "b" \| (string & {})` | None | Yes, for the listed values | Yes | Suggested values that must stay open, such as CSS colour names |

Literal unions are the default choice in modern TypeScript for a closed set of options: they cost nothing at runtime, read clearly in error messages and work with plain JSON strings. `enum` adds a runtime object and is not supported by type-stripping tools such as Node's built-in TypeScript support, which is one reason many teams avoid it; [[b2-literal-unions-vs-enums]] compares them in depth.

The last row is a well-known trick. `"red" | "blue" | string` collapses to `string` — the union of a set and its superset is the superset — so the editor stops suggesting `"red"`. Intersecting with the empty object type, `string & {}`, produces a type the compiler treats as distinct from `string` while still accepting any string, so the listed literals stay visible in autocomplete. It relies on compiler behaviour rather than a documented feature, so use it where the benefit is real.

The main limitation of literal unions is that the set is fixed at compile time. If the valid values come from a database or a feature-flag service, a literal union cannot describe them, and pretending it can (with a cast) only hides the runtime risk.

## Common mistakes

**Expecting `const` to make object properties literal.** `const theme = { mode: "dark" }` gives `mode: string`. `const` protects the binding, not the contents. Annotate the object, add `as const`, or use `satisfies` with a type that contains the literal union.

**Annotating a lookup table with a wide type.** `const ROUTES: Record<string, Route> = {...}` throws away the key names you wanted to derive. Use `as const satisfies Record<string, Route>` so the value is checked and the inferred keys are kept.

**Duplicating values and types.** Writing the literal union and the runtime array separately invites drift. Write the array or object once with `as const` and derive the type with `(typeof X)[number]` or `keyof typeof X`.

**Casting unvalidated input to a literal type.** `const method = req.query.method as Method` compiles, and lets `"TRACE"` through at runtime. A cast is a promise you are making, not a check. Use a guard such as `isMethod` that inspects the value.

**Reaching for `as const` on everything.** It makes the result readonly, so code that later pushes to the array or updates the object stops compiling. Use it for data that really is constant, and an annotation for state that changes.

**Expecting arithmetic to stay literal.** `const next = dice + 1` is `number`, not `2 | 3 | ... | 7`. If you need a literal result, map it explicitly or validate it.

## Interview perspective

**"What is a literal type?"** Say it is a type with one value, that unions of them model a finite set, and give a concrete case such as HTTP methods. Strong answers mention that literals are subtypes of their primitives and are erased at runtime.

**"Why does `const config = { method: 'GET' }` give `method: string`?"** Explain widening: object properties are mutable, so the compiler widens the literal. Then list the fixes and when each fits — annotation for a known type, `as const` for fixed data, `satisfies` to check while keeping inference.

**"How do you keep a runtime list and a type in sync?"** The expected answer is `as const` plus `(typeof LIST)[number]`. A good follow-up is to mention the `includes` argument-type problem and the type-guard fix.

**"Literal union or enum?"** Interviewers look for trade-offs rather than a slogan: unions are erased, structural and JSON-friendly; enums produce a runtime object, are nominal, and need a compiler that understands them.

A common trap is the claim that `as const` makes an object immutable at runtime. It does not — it only adds `readonly` to the type. `Object.freeze` is the runtime counterpart, and it is shallow.

```quiz
Q: What type does TypeScript infer for `list` in `const list = ["sm", "md"];`?
- [ ] `readonly ["sm", "md"]`
- [ ] `("sm" | "md")[]`
- [x] `string[]`
- [ ] `["sm", "md"]`
> Array elements are mutable locations, so their literal types widen to `string`, even though the binding is `const`. Only `as const` (or a contextual type that expects literals) produces the readonly tuple `readonly ["sm", "md"]`. `const` prevents reassigning `list`, not changing its elements.
```

```quiz
Q: Given `const SIZES = ["sm", "md", "lg"] as const;`, which type is `"sm" | "md" | "lg"`?
- [ ] `typeof SIZES`
- [x] `(typeof SIZES)[number]`
- [ ] `keyof typeof SIZES`
- [ ] `SIZES[number]`
> `typeof SIZES` is the tuple type `readonly ["sm", "md", "lg"]`; indexing it with `number` gives the union of its element types. `keyof typeof SIZES` gives the tuple's keys (indices and array methods), not its values. `SIZES[number]` is a value expression, not a type, so it does not compile in a type position.
```

```quiz
Q: What is the main difference between `const route = {...} satisfies Route` and `const route: Route = {...}`?
- [ ] `satisfies` skips the type check
- [ ] The annotation keeps literal types and `satisfies` widens them
- [x] Both check the value, but `satisfies` keeps the inferred type while the annotation replaces it with `Route`
- [ ] `satisfies` makes the object readonly
> Both forms reject a value that does not match `Route`. The annotation then gives `route` the declared type, so a property typed `Method` in `Route` is `Method` on `route`. `satisfies` leaves the inferred type in place, so `route.method` stays the literal `"GET"`. Readonly properties come from `as const`, not from `satisfies`.
```

## Practice

1. Write a `LogLevel` union of `"debug" | "info" | "warn" | "error"` and a function `shouldLog(level: LogLevel, threshold: LogLevel): boolean`. Store the ordering in an `as const` array and derive `LogLevel` from it.
2. Without running it, predict the inferred type of each: `let a = 5`, `const b = 5`, `const c = { n: 5 }`, `const d = [5] as const`, `const e = Math.random() > 0.5 ? "x" : "y"`. Check your answers by hovering in an editor.
3. Write `parseSize(input: string): Size | undefined` for `type Size = "sm" | "md" | "lg"`, using a type guard rather than a cast. Test it with `"md"`, `"MD"` and `""`.
4. Use a template literal type to describe CSS length strings `"${number}px" | "${number}rem"`, and check which of `"12px"`, `"1.5rem"` and `"12"` it accepts.
5. Take a component with `color: string` and change it to accept `"primary" | "secondary"` plus any other string, while keeping autocomplete for the two named colours.

## Quick revision {#quick-revision}

- A literal type has one value: `"GET"`, `404`, `true`, `10n`. A union of literals is a finite set of allowed values.
- Literal types are subtypes of their primitive: `"GET"` is assignable to `string`, not the reverse.
- `boolean` is `true | false`. Arithmetic on literal types produces `number`.
- Widening: `const x = "a"` is `"a"`; `let x = "a"`, object properties and array elements become `string`.
- An inferred literal widens again when copied into a `let`; an annotated literal does not.
- Keep literals with: an annotation, `as const` (deep readonly literals), `satisfies` (check without replacing the inferred type), `<const T>` type parameters (TS 5.0+).
- Contextual types keep literals: `send("GET")` works when the parameter is `Method`.
- Derive unions from values: `(typeof ARR)[number]` for `as const` arrays, `keyof typeof OBJ` for object keys.
- `readonly` tuple `includes` only accepts members; check unknown strings with a type guard.
- Template literal types combine unions: `` `btn-${Tone}-${Size}` `` is every combination.
- Literal types are erased; they cannot validate runtime data on their own.

## Key takeaways {#key-takeaways}

- A literal type narrows a primitive to one exact value, and unions of literals let you list exactly the options your code supports.
- TypeScript widens literals in mutable locations because that is usually what you mean; the surprise with object properties comes from `const` protecting the binding, not the contents.
- Choose the right tool to keep a literal: an annotation when a named type exists, `as const` for fixed data, `satisfies` to check a value without losing its inferred type.
- Write runtime lists once with `as const` and derive their types, so values and types cannot drift apart.
- Because literal types disappear at runtime, any string from outside the program must pass through a real check before it becomes a literal type.
- Literal types are the foundation for [[b2-discriminated-unions]], where a literal tag tells the compiler which variant of a union it is looking at.
