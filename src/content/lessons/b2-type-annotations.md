---
summary: A type annotation is the `: Type` syntax that attaches a type to a variable, parameter, return value, property or class member. You will learn where annotations can go, what each position means to the compiler, the syntax traps (destructuring, optional parameters, catch clauses), and why annotations vanish from the JavaScript that actually runs.
difficulty: beginner
minutes: 40
objectives:
  - Write annotations for variables, parameters, optional and default parameters, rest parameters and return types
  - Annotate arrow functions, function-typed variables, destructured parameters and class members correctly
  - Explain what the compiler does with an annotation and why it has no runtime effect
  - Debug common annotation syntax mistakes such as `{ id: number }` inside a destructuring pattern
  - Use JSDoc annotations to type-check plain JavaScript files
---

## Introduction

TypeScript code is JavaScript code with extra information attached. The main way you attach that information is the **type annotation**: a colon followed by a type, placed right after the name it describes.

```typescript title="first-annotation.ts"
const retries: number = 3;
```

Read it as "`retries` is a `number`". The annotation tells the compiler which values are allowed in that position, and from then on the compiler checks every use of `retries` against it. When the file is compiled, the `: number` is removed and the JavaScript that runs is `const retries = 3;`.

Annotations are how you write down design intent so that both people and tools can read it. A function signature such as `function formatPrice(amount: number, currency: string): string` tells a reader what to pass and what comes back without reading the body, lets the editor autocomplete correctly, and lets the compiler reject a call like `formatPrice("5")`. This lesson is a tour of **where** annotations can go and what each position means. The companion lesson [[b2-explicit-types]] explains the deeper question of what writing a type changes in the checker, and [[b2-when-explicit-vs-inferred]] covers when it is worth writing one at all.

## Before you start

- **Primitive and object types** — `string`, `number`, `boolean`, object shapes, arrays. See [[b2-primitive-object-types]].
- **JavaScript functions** — parameters, default values, rest parameters, arrow functions, destructuring. These are plain JavaScript features; annotations only add types to them.
- **Compiling with `tsc`** — how the compiler turns `.ts` into `.js` and reports errors. See [[b2-tsc-compilation]].

## The intuition

Picture a sticky note attached to each variable, saying what may be put inside. Writing to the variable means the compiler reads the note first and refuses anything that does not match. Reading from the variable means the compiler trusts the note to know what comes out, so it can tell you which methods exist.

The sticky notes are for the compiler only. When the code is shipped, every note is peeled off. That is why annotations are free at runtime and also why they cannot protect you from values the compiler never saw, such as JSON from a server.

## The general shape

Every annotation has the same form: **`name: Type`**. The type can be anything TypeScript can express — a primitive, an object shape, an array, a union, a function type, a named alias.

```typescript title="variables.ts"
let attempts: number = 0;
const appName: string = "Career Duo";
let isOnline: boolean;            // declared now, assigned later
let lastError: string | undefined; // may stay undefined
const ids: number[] = [1, 2];
const pairs: Array<[string, number]> = [["a", 1]];
```

A variable can be annotated without an initial value (`let isOnline: boolean;`). Under strict settings the compiler tracks whether it has been assigned before you read it and reports error TS2454, "used before being assigned", if not. `number[]` and `Array<number>` are two spellings of the same type; `[string, number]` is a **tuple**, an array with a fixed length and a type per position (see [[b2-tuples]]).

In a declaration list such as `let a: number, b: string = "x";`, each name has its own annotation. An annotation does not carry across commas.

## Annotating functions

Functions are where annotations earn their keep, because a function's parameters are a door through which values enter from code you do not control.

```typescript title="functions.ts"
function formatPrice(amount: number, currency: string = "USD", note?: string): string {
  const base = `${amount.toFixed(2)} ${currency}`;
  return note === undefined ? base : `${base} (${note})`;
}
function sum(...values: number[]): number {
  return values.reduce((total, v) => total + v, 0);
}
const double = (n: number): number => n * 2;
const greet: (name: string) => string = (name) => `Hi ${name}`;

console.log(formatPrice(5));
console.log(formatPrice(5, "EUR", "incl. tax"));
console.log(sum(1, 2, 3), sum(), double(21), greet("Ada"));
```

```output
5.00 USD
5.00 EUR (incl. tax)
6 0 42 Hi Ada
```

Take the pieces one at a time.

**Parameter annotations** (`amount: number`) go after each parameter name. Under `strict` — which turns on `noImplicitAny`, and which TypeScript 6 enables by default — a parameter with no annotation and no other source of type information is an error (TS7006), because the compiler would otherwise have to assume `any` and stop checking. Parameters are the one place you almost always annotate.

**Default values** (`currency: string = "USD"`) can be annotated, but the annotation is optional: from `= "USD"` the compiler already infers `string`. A parameter with a default may be omitted by callers.

**Optional parameters** (`note?: string`) may also be omitted. Inside the function, the type of `note` is `string | undefined`, so the compiler makes you handle the missing case — calling `note.length` directly is error TS18048, "'note' is possibly 'undefined'". Optional parameters must come after required ones.

**Rest parameters** (`...values: number[]`) collect the remaining arguments into an array, so their annotation is always an array (or tuple) type.

**Return type annotations** go after the parameter list: `(...): string`. They are optional — the compiler can infer the return type — but on exported or important functions they make errors appear at the faulty `return` rather than in callers. A function that returns nothing is annotated `: void`; see [[b2-special-types]].

**Arrow functions** put the return annotation between the parameter list and the arrow: `(n: number): number => n * 2`. Writing `(n: number) => number => ...` is a different, confusing thing — it declares a function that returns another function whose parameter is called `number`.

**Function-typed variables** annotate the variable instead of the function: `const greet: (name: string) => string`. In a *type* the arrow means "returns", so `(name: string) => string` reads "a function taking a string and returning a string". Because the variable already has a type, the arrow function assigned to it does not need annotations — `name` gets its type from context. That is **contextual typing**, which is also why callbacks like `values.reduce((total, v) => ...)` need no annotations. More on function types is in [[b2-typed-functions]].

Here is what the compiler emits for this file. Every annotation is gone; default values and rest parameters remain because they are JavaScript features:

```javascript title="functions.js (compiled)"
"use strict";
function formatPrice(amount, currency = "USD", note) {
    const base = `${amount.toFixed(2)} ${currency}`;
    return note === undefined ? base : `${base} (${note})`;
}
function sum(...values) {
    return values.reduce((total, v) => total + v, 0);
}
const double = (n) => n * 2;
const greet = (name) => `Hi ${name}`;
```

The `"use strict"` line is added because TypeScript 6 compiles with `alwaysStrict` on by default; it is not related to the annotations.

## Destructured parameters

Many functions take a single options object and destructure it. The annotation goes **after the whole pattern**, not inside it:

```typescript title="destructure.ts"
function show({ id, name }: { id: number; name: string }): string {
  return `${id}:${name}`;
}
```

This reads "the parameter is an object of type `{ id: number; name: string }`, from which we take `id` and `name`". The obvious-looking alternative is wrong:

```typescript title="destructure-wrong.ts"
function wrong({ id: number, name: string }) {
  return id;
}
```

```output
destructure-wrong.ts(1,22): error TS7031: Binding element 'number' implicitly has an 'any' type.
destructure-wrong.ts(1,36): error TS7031: Binding element 'string' implicitly has an 'any' type.
destructure-wrong.ts(2,10): error TS2304: Cannot find name 'id'.
```

Inside a destructuring pattern, a colon is JavaScript's **rename** syntax: `{ id: number }` means "take the property `id` and store it in a new variable called `number`". The errors say exactly that — there are now variables named `number` and `string`, and no variable named `id`. In real code, give the parameter type a name to keep the signature readable:

```typescript title="props.ts"
type CardProps = { title: string; subtitle?: string };
function Card({ title, subtitle = "" }: CardProps): string {
  return subtitle ? `${title} — ${subtitle}` : title;
}
```

This is exactly how React components are usually typed; see [[b2-parameter-destructuring]] and [[b2-react-typescript]].

## Annotating objects and classes

Inside an object type, each property is annotated the same way, with two modifiers available: `?` for an **optional property** and `readonly` for one that cannot be reassigned after creation.

```typescript title="classes.ts"
type Point = { readonly x: number; readonly y: number; label?: string };

class Counter {
  private count: number = 0;
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  increment(by: number = 1): number {
    this.count += by;
    return this.count;
  }
}

const start: Point = { x: 0, y: 0 };
const c = new Counter("clicks");
c.increment();
console.log(c.increment(5), c.name, start.label);
```

```output
6 clicks undefined
```

Class **fields** are annotated like variables (`private count: number = 0`), constructor and method parameters like function parameters, and methods may declare return types. `readonly` and `private` are checked only by the compiler: assigning `start.x = 5` reports TS2540 ("Cannot assign to 'x' because it is a read-only property") and reading `c.count` from outside reports TS2341, but neither exists in the emitted JavaScript. If you need truly private runtime state, JavaScript's own `#count` private fields provide it. Classes are covered in [[b2-classes-ts]] and access modifiers in [[b2-public-private-protected]].

## Annotations with special rules

**Catch clauses.** You cannot annotate a caught error with a specific type, because anything can be thrown in JavaScript — a string, a number, `undefined`. The only allowed annotations are `unknown` and `any`:

```typescript title="catch.ts"
try { JSON.parse("{"); } catch (err) { console.log(err.message); }
try { JSON.parse("{"); } catch (err: Error) { }
```

```output
catch.ts(1,52): error TS18046: 'err' is of type 'unknown'.
catch.ts(2,38): error TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
```

Under `strict` (`useUnknownInCatchVariables`, TypeScript 4.4+), `err` is `unknown`, so you must narrow it first — for example `if (err instanceof Error) console.log(err.message)`.

**Type-only imports.** `import type { User } from "./user"` imports a name for use in annotations only; the whole statement is erased from the output. See [[b2-ts-modules]].

**JSDoc in JavaScript files.** Plain `.js` files cannot use colon syntax, but TypeScript understands the same information written as JSDoc comments, and with `// @ts-check` (or `checkJs`) it type-checks the file:

```javascript title="util.js"
// @ts-check
/**
 * @param {number} amount
 * @param {string} [currency]
 * @returns {string}
 */
export function formatPrice(amount, currency = "USD") {
  return `${amount.toFixed(2)} ${currency}`;
}
formatPrice("5");
```

```output
util.js(10,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

This is a common first step when migrating a JavaScript codebase (see [[b2-migration-js-to-ts]]).

## How it works internally

When the compiler parses `let attempts: number = 0`, it records the annotation as part of the declaration node in the syntax tree. The **binder** creates a symbol for `attempts`; the **checker**, whenever `attempts` is used, asks for its type and finds the annotation, so it never needs to look at the initializer to decide. That has a performance side effect: annotated declarations let the checker skip work, and in very large projects explicit return types on exported functions measurably reduce type-checking time.

The annotation is also used *in the other direction* as context. In `const greet: (name: string) => string = (name) => ...`, the checker types the arrow function with the annotation as its expected type, so `name` gets `string` without being written.

Finally, the **emitter** writes JavaScript by walking the tree and skipping every type-only node: annotations, `type` and `interface` declarations, `import type`, `readonly`, access modifiers. The result is ordinary JavaScript with the same structure. Tools such as esbuild, Babel and SWC perform the same erasure without type-checking, and Node.js 22.6+ can strip types itself (behind `--experimental-strip-types`, enabled by default from Node 23.6), which only works because annotations never affect runtime behaviour.

## In real systems

In a typical React and TypeScript codebase, you will find annotations concentrated in a few places: component props types, the parameters and return types of hooks and utility functions, API client functions, and explicit type arguments such as `useState<User | null>(null)`. Inside component bodies, most variables are unannotated because they are inferred. Teams enforce the boundary annotations with lint rules such as `@typescript-eslint/explicit-module-boundary-types` (see [[b2-eslint-typescript]]).

On the backend, request handler parameters are annotated with the validated request body type, and database access functions declare their return types so that a schema change shows up as a compile error at the query, not in a template three layers away.

## Trade-offs and alternatives

Annotations make code self-documenting and give the checker firm reference points, at the cost of extra syntax and the risk of writing a type that is less precise than the value. The alternative for most local variables is inference, which is covered in [[b2-type-inference]]; for checking object literals without losing detail, `satisfies` ([[b2-satisfies]]). Annotations are almost never optional in practice on parameters, and almost always unnecessary on `const` variables initialised with a literal.

## Common mistakes

- **Annotating inside a destructuring pattern.** `({ id: number })` renames `id` to `number`. Put the type after the pattern: `({ id }: { id: number })`.
- **Misplacing an arrow function's return type.** Write `(n: number): number => ...`, not `(n: number) => number => ...`.
- **Forgetting that `?` adds `undefined`.** An optional parameter or property must be checked before use.
- **Annotating `catch (e: Error)`.** Only `unknown` or `any` is allowed; narrow with `instanceof` instead.
- **Trusting `readonly` or `private` at runtime.** They are compile-time only; use `Object.freeze` or `#private` for runtime guarantees.
- **Using `String`, `Number`, `Boolean` as annotations.** Use the lowercase primitives (see [[b2-primitive-object-types]]).

## Interview perspective

**"Do type annotations affect runtime performance?"** No. They are erased by the compiler or by any build tool that strips types; the emitted JavaScript is the same as if you had not written them. A good answer adds that this is also why they cannot validate runtime data.

**"How do you type a destructured parameter?"** Put the object type after the whole pattern, ideally as a named type alias or interface, and explain that a colon inside the pattern renames instead of typing.

**"Why can't you write `catch (e: Error)`?"** Because JavaScript can throw any value, so the compiler cannot guarantee the type; it allows only `unknown` (preferred) or `any`.

```quiz
Q: What does `function f({ id: number }) {}` declare?
- [ ] A parameter object whose `id` property is a number
- [x] A destructured variable named `number`, holding the value of the `id` property
- [ ] A syntax error
> Inside a destructuring pattern, `prop: name` is JavaScript's rename syntax, so the code creates a variable called `number`. Under `strict` it is an implicit-`any` error. The type belongs after the pattern: `({ id }: { id: number })`.
```

```quiz
Q: Inside `function greet(name?: string) { ... }`, what is the type of `name`?
- [ ] `string`
- [x] `string | undefined`
- [ ] `any`
> An optional parameter may be omitted, in which case it is `undefined`, so the compiler widens its type to include `undefined` and requires a check before calling string methods.
```

```quiz
Q: Which annotation compiles in a `catch` clause?
- [ ] `catch (e: Error)`
- [ ] `catch (e: string)`
- [x] `catch (e: unknown)`
> Any value can be thrown, so TypeScript only allows `unknown` or `any` there (TS1196 otherwise). With `unknown` you narrow before use, for example `if (e instanceof Error)`.
```

```quiz
Q: What is left of `const total: number = add(a, b);` after compilation to JavaScript?
- [x] `const total = add(a, b);`
- [ ] `const total = Number(add(a, b));`
- [ ] A runtime check that throws if the result is not a number
> Annotations are erased without adding conversions or checks; the emitted code is plain JavaScript with the same structure.
```

## Practice

1. Annotate `function paginate(items, page, pageSize = 20)` so that `items` is an array of any element type you choose, `page` is required and `pageSize` is optional, and the function returns an array of the same element type.
2. Write a typed `Button` props type with a required `label`, an optional `disabled` flag and an `onClick` callback that receives no arguments and returns nothing. Destructure it in the component signature.
3. Rewrite `const toUpper = (s: string) => string => s.toUpperCase();` so it does what the author intended, and explain what the original declared.
4. Convert a small `.js` utility file to use JSDoc annotations with `// @ts-check`, and make one deliberate mistake to see the error.
5. Write a `safeParse(text: string): unknown` helper and a caller that handles the error with `catch (err: unknown)` correctly.

## Quick revision {#quick-revision}

- Form: `name: Type`. Works on `let`/`const`/`var`, parameters, return types, properties, class fields.
- Parameters: annotate (strict `noImplicitAny` errors otherwise). Defaults infer their type; `p?: T` means `T | undefined`; rest params are arrays.
- Return type goes after the parameter list; for arrows: `(n: number): number => ...`.
- Function-typed variable: `const f: (x: string) => string = (x) => ...` — the arrow in a type means "returns"; the parameter is typed contextually.
- Destructuring: type after the pattern — `({ id }: { id: number })`. A colon inside the pattern renames.
- Object/class members: `?` optional, `readonly` no reassignment, `private` — all compile-time only.
- `catch (e)` accepts only `unknown` or `any`; strict makes it `unknown`.
- JSDoc (`@param {number} x`) + `// @ts-check` type-checks `.js` files.
- Annotations are erased; zero runtime cost, zero runtime validation.

## Key takeaways {#key-takeaways}

- A type annotation is a colon and a type after a name; the same syntax works for variables, parameters, returns, properties and class members.
- Parameters are the position that almost always needs an annotation; return types are worth adding on exported functions.
- Destructuring and arrow-function syntax each have one trap: the type goes after the whole pattern, and the return type goes before the arrow.
- Modifiers such as `?`, `readonly` and `private` change what the compiler allows, not what the runtime does.
- Because annotations are erased, they document and check your code but never validate data that arrives at runtime.
