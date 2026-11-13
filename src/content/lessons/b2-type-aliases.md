---
summary: A type alias gives a name to any type expression — a union, a tuple, a function signature, an object shape or a type computed from other types. You will learn the syntax for every kind of alias, why an alias is a new name rather than a new type, how generic and recursive aliases work, and how aliases keep complex types readable without any runtime cost.
difficulty: beginner
minutes: 40
objectives:
  - Write type aliases for primitives, literal unions, object shapes, tuples and function types
  - Explain why an alias is transparent (a new name, not a new type) and what that means for type safety
  - Write generic aliases with constraints and defaults, and recursive aliases such as a JSON type
  - Derive aliases from values and other types with `typeof`, `keyof` and indexed access
  - Debug common alias errors such as circular references and using an alias as a value
---

## Introduction

Type annotations get long quickly. A function that accepts a callback might be written like this:

```typescript title="without-alias.ts"
function onStatusChange(
  handler: (status: "idle" | "loading" | "success" | "error", at: Date) => void,
): void {
  // ...
}
```

If three other functions need the same status set or the same callback shape, you copy that text three more times. When a new status, `"cancelled"`, is added, you have to find and update every copy, and missing one creates a mismatch the compiler may not even report.

A **type alias** solves this by giving a type a name:

```typescript title="with-alias.ts"
type Status = "idle" | "loading" | "success" | "error";
type StatusHandler = (status: Status, at: Date) => void;

function onStatusChange(handler: StatusHandler): void {
  // ...
}
```

The syntax is the keyword `type`, a name, `=`, and any type expression. From then on the name can be used anywhere the type could. The code reads like the domain ("a status handler") rather than like type plumbing, and the definition lives in one place.

You have already seen interfaces ([[b2-interfaces]]), which name object shapes. Aliases are broader: they can name **any** type, including unions, tuples and function types that interfaces cannot express. That makes them the basic building block for nearly every advanced TypeScript feature — unions, discriminated unions, utility types, mapped and conditional types are all usually written as aliases. This lesson covers the alias itself; [[b2-type-alias-patterns]] covers the patterns experienced engineers build with it.

## Before you start

- **Type annotations and basic types** — `string`, `number`, arrays, object types. See [[b2-type-annotations]] and [[b2-object-types]].
- **Tuples** — fixed-length arrays such as `[number, number]`. See [[b2-tuples]].
- **Interfaces** — helpful for comparison. See [[b2-interfaces]]; the full comparison is in [[b2-interface-vs-type-when]].
- **Literal types** — that `"idle"` can be a type of its own. Briefly explained below; [[b2-literal-types]] goes deeper.

## The intuition

An alias is a **nickname**. If everyone in your team calls the Head of Platform Engineering "Sam", saying "Sam" and saying "the Head of Platform Engineering" refer to the same person. The nickname is shorter, but it does not create a second person.

That is exactly how TypeScript treats `type UserId = string`. `UserId` and `string` are the same type. The alias makes your code easier to read and gives you one place to change the definition, but the compiler treats every `UserId` as a `string` and every `string` as a `UserId`. This property is called being **transparent**, and it is the single most important fact about aliases — both because it makes them flexible and because it surprises people who expect `UserId` to stop them passing an `OrderId`.

## What an alias can name

The right-hand side of `type X = ...` can be any type expression. Here are the main kinds, roughly in the order you will need them.

### Primitives and literal unions

```typescript title="primitives.ts"
type Email = string;
type Cents = number;
type Theme = "light" | "dark" | "system";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
```

`Email` and `Cents` exist purely for readability: `function charge(amount: Cents)` tells the reader the unit. `Theme` is more powerful. Each string in quotes is a **literal type** — a type with exactly one value — and `|` combines them into a **union**, "one of these". A variable of type `Theme` accepts `"dark"` but rejects `"blue"` and even a general `string`. Literal unions like this are the most common use of aliases in frontend code; they are covered fully in [[b2-literal-types]] and [[b2-unions]].

### Object shapes

```typescript title="object-alias.ts"
type Point = {
  x: number;
  y: number;
};

type Address = {
  line1: string;
  line2?: string;
  readonly country: string;
};
```

An object alias supports everything an interface body does: optional `?` and `readonly` members, methods, index signatures, call signatures. Note the `=` and that the braces are a type expression, so a trailing semicolon after `}` is conventional. Whether to write an object shape as an alias or an interface is a style choice with a few real consequences, covered in [[b2-interface-vs-type-when]].

### Tuples and arrays

```typescript title="tuple-alias.ts"
type Coordinates = [lat: number, lng: number];
type RgbColor = readonly [red: number, green: number, blue: number];
type Matrix = number[][];
```

The names inside a tuple (`lat`, `lng`) are **labels**: they appear in editor tooltips and documentation but have no effect on type checking. They make `Coordinates` self-explanatory where `[number, number]` would leave the reader guessing which number is which. See [[b2-tuples]] and [[b2-readonly-tuples]].

### Function types

```typescript title="function-alias.ts"
type Comparator<T> = (a: T, b: T) => number;

const byLength: Comparator<string> = (a, b) => a.length - b.length;
const ignoresSecond: Comparator<number> = (a) => a;   // also allowed

console.log(["ccc", "a", "bb"].sort(byLength));
```

```output
[ 'a', 'bb', 'ccc' ]
```

Three things happen here. First, the arrow function assigned to `byLength` gets its parameter types from the alias: `a` and `b` are `string` without annotations. This is **contextual typing**, and it is the main day-to-day benefit of function aliases — callbacks, event handlers and reducers can be written without repeating types. Second, parameter names in the alias (`a`, `b`) are documentation; an implementation can use any names. Third, `ignoresSecond` takes fewer parameters than the alias declares, and that is allowed, because JavaScript ignores extra arguments — the same reason you can pass `(x) => ...` to `Array.prototype.map`, which supplies three arguments. A function with *more* required parameters than the alias would be rejected.

### Unions and intersections of other types

```typescript title="combine.ts"
type Id = string | number;
type Point3D = Point & { z: number };
type Nullable<T> = T | null;
```

`|` means "one of" and `&` means "all of at once". [[b2-unions]] and [[b2-intersections]] cover both in depth. Aliases are the natural home for these combinations, since an interface cannot be a union.

## An alias is a new name, not a new type

Because aliases are transparent, this compiles without complaint:

```typescript title="transparent.ts"
type UserId = string;
type OrderId = string;

function loadUser(id: UserId): string {
  return `loading user ${id}`;
}

const orderId: OrderId = "o-1";
console.log(loadUser(orderId));   // wrong ID kind, but accepted
```

```output
loading user o-1
```

`UserId` and `OrderId` are both `string`, so passing an order ID where a user ID is expected is fine as far as the compiler is concerned. If you want the compiler to keep them apart, you need a **branded type** — an alias that intersects `string` with a phantom marker property — which is the first pattern in [[b2-type-alias-patterns]] and the subject of [[b2-branded-types]].

Transparency also shows up in editor tooltips and error messages. The compiler sometimes prints the alias name and sometimes the expanded type. For example, for `type Config = typeof defaultConfig` (shown below), a missing property is reported against `'{ retries: number; baseUrl: string; verbose: boolean; }'`, not `'Config'`. That is not a bug; the alias is only a name, and the compiler is free to show what it stands for.

## Generic aliases

An alias can take **type parameters** in angle brackets, which makes one definition describe a family of types:

```typescript title="generic-alias.ts"
type Nullable<T> = T | null;
type Pair<A, B> = [first: A, second: B];
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

const maybeName: Nullable<string> = null;
const entry: Pair<string, number> = ["age", 36];
```

Read `Nullable<string>` as "substitute `string` for `T`": the result is `string | null`. Generic aliases are how you avoid writing `UserResult`, `OrderResult`, `ProductResult` with the same structure.

Type parameters can have **constraints** (`extends`) and **defaults** (`=`):

```typescript title="constraints-defaults.ts"
type WithLength<T extends { length: number }> = { item: T; length: number };
type Box<T = string> = { value: T };

type A = WithLength<string[]>;    // fine: arrays have length
type B = WithLength<number>;      // error
const b: Box = { value: "no type argument needed" };
```

```output
error TS2344: Type 'number' does not satisfy the constraint '{ length: number; }'.
```

The constraint says which types are allowed as arguments; the default says what `T` is when none is given. Both are explained further in [[b2-generic-constraints]] and [[b2-default-type-parameters]].

## Recursive aliases

An alias can refer to itself, as long as the self-reference is inside an object, array or tuple, so the compiler can expand it one level at a time. The classic example is a type for any JSON value:

```typescript title="json.ts"
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

const ok: Json = { name: "Ada", tags: ["x"], meta: { score: 9, extra: null } };
const bad: Json = { when: new Date() };   // error: a Date is not JSON
```

```output
error TS2322: Type '{ when: Date; }' is not assignable to type 'Json'.
  Types of property 'when' are incompatible.
    Type 'Date' is not assignable to type 'Json | undefined'.
      Type 'Date' is not assignable to type '{ [key: string]: Json; }'.
        Index signature for type 'string' is missing in type 'Date'.
```

Read the error from the bottom up: a `Date` is not a string, number, boolean, null or array, and it is not a plain object of JSON values either, so it is rejected — which matches what `JSON.stringify` does with dates (it turns them into strings, so they do not round-trip; see [[b1-json-unsupported]]).

Tree-shaped data works the same way: `type TreeNode<T> = { value: T; children: TreeNode<T>[] }`. What does *not* work is a reference with no structure in between:

```typescript title="circular.ts"
type Bad = Bad | string;
```

```output
error TS2456: Type alias 'Bad' circularly references itself.
```

To resolve `Bad`, the compiler would first need to resolve `Bad`, forever. Wrapping the reference in an array or object breaks the cycle, because the compiler can stop at "an array of something" and resolve the something later. Recursive references inside arrays and tuples have been allowed since TypeScript 3.7; older code sometimes uses an interface as a workaround for that reason.

## Deriving aliases from values and other types

Aliases do not have to be written out by hand. Three operators let you compute them from things that already exist.

`typeof`, in a type position, gives the type of a value. This keeps a type in sync with a default object:

```typescript title="typeof-alias.ts"
const defaultConfig = { retries: 3, baseUrl: "https://api.example.com", verbose: false };
type Config = typeof defaultConfig;
// { retries: number; baseUrl: string; verbose: boolean }

const c: Config = { retries: 1, baseUrl: "x" };   // error: verbose is missing
```

`keyof` gives the union of an object type's keys, and **indexed access** `T["key"]` gives the type of one property:

```typescript title="keyof-indexed.ts"
type User = { id: string; name: string; age: number };

type UserKey = keyof User;         // "id" | "name" | "age"
type UserAge = User["age"];        // number
type UserValue = User[UserKey];    // string | number
```

And the built-in **utility types** are themselves generic aliases: `Partial<User>`, `Pick<User, "id">`, `Omit<User, "age">`, `Record<string, User>`. When you write `type UserPatch = Partial<User>`, you are naming the result of a type-level computation. These tools have their own lessons — [[b2-typeof]], [[b2-keyof]], [[b2-indexed-access]], [[b2-utility-types]] — but you should recognise that all of them are typically consumed through aliases.

## Scope, export and the value/type split

Aliases follow block scoping like `let`, and like all types they can be used before the line that declares them (type declarations are not executed, so there is no temporal dead zone). In a module you share them with `export type` and bring them in with an ordinary `import` or with `import type`, which guarantees the import is removed from the emitted JavaScript:

```typescript title="share.ts"
// models.ts
export type Theme = "light" | "dark";

// settings.ts
import type { Theme } from "./models";
```

An alias exists only in the type world. Using one as a value is an error:

```typescript title="alias-as-value.ts"
type UserId = string;
const v = UserId;
```

```output
error TS2693: 'UserId' only refers to a type, but is being used as a value here.
```

TypeScript keeps two separate namespaces, one for values and one for types. That is why you can have a `const Theme = { ... }` and a `type Theme = ...` with the same name side by side — a pattern used with `as const` objects ([[b2-as-const-objects]]).

## How it works internally

When the checker meets `type X = ...`, it records a symbol for `X` whose meaning is "this type expression". It resolves the expression lazily, the first time something needs it, which is what allows aliases to be referenced before their declaration and lets recursive aliases expand one level at a time. A generic alias is stored once and **instantiated** for each distinct set of type arguments: `ApiResult<User>` and `ApiResult<Order>` are two instantiations, cached so the work is not repeated.

At emit time, every `type` declaration is deleted, together with all annotations that use it. This program:

```typescript title="erase.ts"
type Theme = "light" | "dark";
const current: Theme = "dark";
console.log(current);
```

compiles to:

```javascript title="erase.js"
"use strict";
const current = "dark";
console.log(current);
```

There is no runtime object, so no runtime cost and no runtime check. If `current` comes from `localStorage`, it could be any string at runtime, and code that trusts the `Theme` type must validate it first.

## Worked example: typed form validation

This program uses function aliases, object aliases, a generic alias with a mapped type, and a utility type to build a reusable validator. It runs as-is with Node 22.18 or later (which strips TypeScript syntax natively); on older versions, compile it with `tsc` first.

```typescript title="validate.ts"
type Validator<T> = (value: T) => string | null;   // null means "valid"

type SignupForm = {
  email: string;
  age: number;
  acceptTerms: boolean;
};

// For each field of T, an optional list of validators for that field's type
type Rules<T> = { [K in keyof T]?: Validator<T[K]>[] };

// At most one error message per field
type Errors<T> = Partial<Record<keyof T, string>>;

const required: Validator<string> = (v) => (v.trim() === "" ? "is required" : null);
const looksLikeEmail: Validator<string> = (v) => (v.includes("@") ? null : "must contain @");
const atLeast =
  (min: number): Validator<number> =>
  (v) => (v >= min ? null : `must be at least ${min}`);
const mustBeTrue: Validator<boolean> = (v) => (v ? null : "must be accepted");

const signupRules: Rules<SignupForm> = {
  email: [required, looksLikeEmail],
  age: [atLeast(13)],
  acceptTerms: [mustBeTrue],
};

function validate<T>(form: T, rules: Rules<T>): Errors<T> {
  const errors: Errors<T> = {};
  for (const key in rules) {
    for (const check of rules[key] ?? []) {
      const message = check(form[key]);
      if (message !== null) {
        errors[key] = message;
        break; // report only the first failure per field
      }
    }
  }
  return errors;
}

console.log(validate({ email: "ada@example.com", age: 36, acceptTerms: true }, signupRules));
console.log(validate({ email: "  ", age: 9, acceptTerms: false }, signupRules));
```

```output
{}
{
  email: 'is required',
  age: 'must be at least 13',
  acceptTerms: 'must be accepted'
}
```

Step through it. `Validator<T>` names "a function that checks a `T` and returns an error message or `null`". Because it is an alias, every validator below is written as a bare arrow function and gets its parameter type from context: `v` is `string` in `required` and `number` in the function returned by `atLeast`.

`Rules<T>` is the interesting one. `[K in keyof T]` is a **mapped type** — "for each key `K` of `T`" — and `Validator<T[K]>[]` uses indexed access to pick that field's own type. For `SignupForm` it expands to `{ email?: Validator<string>[]; age?: Validator<number>[]; acceptTerms?: Validator<boolean>[] }`. You do not need to master mapped types yet ([[b2-mapped-types]]); what matters is that the alias ties each field to validators of the matching type. Put `looksLikeEmail` in the `age` list and the compiler refuses:

```output
error TS2322: Type 'Validator<string>' is not assignable to type 'Validator<number>'.
  Type 'number' is not assignable to type 'string'.
```

`Errors<T>` composes two utility types: `Record<keyof T, string>` is "an object with a string for every field", and `Partial` makes each optional, since a valid field has no error. The second run shows the first failing rule for each field; for `email`, `required` fails on the blank string, so `looksLikeEmail` never runs.

None of these aliases exists at runtime. Adding a field `password: string` to `SignupForm` immediately makes the compiler accept `password: [required]` in the rules — and reject `password: [atLeast(8)]` — without any other change.

## In real systems

**UI state and variants.** Component code is full of literal-union aliases: `type ButtonVariant = "primary" | "secondary" | "ghost"`, `type Size = "sm" | "md" | "lg"`. They give autocomplete in the editor and reject typos in props.

**Callback contracts.** `type ChangeHandler<T> = (next: T) => void` and reducer types such as `type Reducer<S, A> = (state: S, action: A) => S` make libraries and hooks easy to consume: callers write plain arrow functions and get full types by context.

**API results.** `type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError }` is a common way to make error handling explicit. Patterns like this are covered in [[b2-type-alias-patterns]] and [[b2-discriminated-unions]].

**Types derived from code.** `type Route = (typeof routes)[number]["path"]` or `type Props = React.ComponentProps<typeof Button>` keep types in sync with the values they describe, so there is nothing to update by hand.

## Trade-offs and alternatives

Aliases can name anything, compose freely with unions, intersections and generics, cost nothing at runtime, and enable every advanced type feature. Their limits: they cannot be re-opened with declaration merging (a second `type X` is a "Duplicate identifier" error), they are transparent so they give no protection between two aliases of the same underlying type without branding, and deeply nested computed aliases can produce long, hard-to-read error messages. When an alias becomes unreadable, split it into named intermediate aliases; the names then show up in errors and tooltips.

For plain object shapes, an **interface** is a valid alternative (see [[b2-interface-vs-type-when]]). For a fixed set of named constants with a runtime presence, an **enum** or an `as const` object is the alternative to a literal union ([[b2-literal-unions-vs-enums]]).

## Common mistakes

> [!MISTAKE] Expecting an alias to create a distinct type
> `type UserId = string; type OrderId = string;` does not stop you passing an order ID to `loadUser`. Both are just `string`. Use branded types when mixing them up would be a real bug.

**Using an alias as a value.** `if (theme === Theme)` or `Object.values(Theme)` fails with TS2693, because `Theme` is erased. If you need the list of allowed values at runtime, define a constant array (`const THEMES = ["light", "dark"] as const`) and derive the alias from it: `type Theme = (typeof THEMES)[number]`.

**Writing a circular alias with no structure in between.** `type Node = Node | string` gives TS2456. Put the reference in an array or object, such as `children: Node[]`.

**Using `Function` or `object` as a "catch-all" alias.** `type Callback = Function` accepts any function and returns `any` when called, throwing away all checking. Write the actual signature: `type Callback = (error: Error | null, data?: string) => void`.

**Trying to add members with a second declaration.** Aliases do not merge. If consumers need to extend a type, export an interface.

**Over-abstracting.** An alias for every primitive (`type Name = string; type Age = number`) adds indirection without safety. Alias things that have meaning, appear in several places, or are long enough that a name helps.

## Interview perspective

**"What is a type alias, and how is it different from an interface?"** An alias names any type expression; an interface names an object shape. Aliases can express unions, tuples, function types and computed types; interfaces can be merged and extended with early conflict checks. Point to [[b2-interface-vs-type-when]]-style reasoning rather than a blanket preference.

**"Does `type UserId = string` make `UserId` incompatible with `string`?"** No — aliases are transparent. A strong answer explains branding as the fix and notes that brands are still compile-time only.

**"How would you type arbitrary JSON?"** With a recursive alias like the `Json` type above; explain why the recursion must go through an array or object.

**Follow-up: "Can a type alias be generic, and what are constraints for?"** Show `type ApiResult<T>`, then a constraint such as `T extends object`, and explain that constraints restrict which type arguments are allowed and let the alias body rely on members of `T`.

## Practice

1. Write `type Weekday` as a union of five literal day names, and a function `isWeekend(day: string): boolean`. Then change its parameter to accept a union of all seven day names, and confirm the compiler rejects `"Funday"`.
2. Write `type Reducer<S, A> = (state: S, action: A) => S` and implement a counter reducer with actions `"inc"` and `"dec"` without annotating the arrow function's parameters.
3. Write a recursive `type Menu = { label: string; href?: string; children?: Menu[] }` and a function that prints every label with indentation by depth.
4. Given `const ROLES = ["viewer", "editor", "admin"] as const`, derive `type Role` from it, and write `function isRole(x: string): x is Role` using the array at runtime.
5. Extend the validation worked example with a `password` field and a `minLength(n)` validator. Check that putting it in the `age` rules is rejected.

```quiz
Q: Given `type UserId = string` and `type OrderId = string`, what happens when an `OrderId` is passed to a parameter of type `UserId`?
- [ ] A compile error, because the alias names differ
- [x] It compiles, because both aliases are just `string`
- [ ] It compiles but throws at runtime
- [ ] It compiles only with `strict` turned off
> Aliases are transparent: they introduce a name, not a new type. To keep the two apart you need a branded type. There is nothing at runtime to throw, since aliases are erased.
```

```quiz
Q: Why does `type Bad = Bad | string` fail while `type Tree = { children: Tree[] }` works?
- [ ] Only object aliases may be recursive
- [x] The first needs itself to be resolved before it can be resolved; the second refers to itself inside a structure the compiler can expand lazily
- [ ] Unions cannot contain aliases
- [ ] Recursive aliases require an interface wrapper in TypeScript 5
> The compiler can stop at "an object whose `children` is an array of something" and resolve the something later. For `Bad`, there is no such stopping point. Unions can contain recursive references through arrays and objects, as the `Json` type shows.
```

```quiz
Q: `const Theme = "dark"` and `type Theme = "light" | "dark"` are both declared in one file. What happens?
- [x] It compiles; values and types live in separate namespaces
- [ ] Error: duplicate identifier `Theme`
- [ ] The type is erased, so the constant is renamed during compilation
- [ ] The constant becomes the default value of the type
> TypeScript keeps a value namespace and a type namespace. A `const` and a `type` with the same name do not clash; this is the basis of the `as const` object pattern. Two `type Theme` declarations would clash.
```

## Quick revision {#quick-revision}

- `type Name = <any type expression>`; erased at compile time, zero runtime cost.
- Can name primitives, literal unions, object shapes, tuples (with labels), function types, unions, intersections, mapped and conditional types.
- Transparent: an alias is another name for the same type, so `UserId` and `OrderId` aliases of `string` are interchangeable. Use branding for distinct IDs.
- Function aliases provide contextual typing to arrow functions; implementations may take fewer parameters.
- Generic aliases: `type Box<T extends C = D> = ...` — constraint `extends`, default `=`.
- Recursive aliases must recurse through an array, tuple or object; `type X = X | string` → TS2456.
- Derive types with `typeof value`, `keyof T`, `T["key"]`, and utility types.
- Aliases live in the type namespace: using one as a value → TS2693; a same-named `const` is allowed.
- Aliases cannot be merged; a duplicate declaration → TS2300.
- Share with `export type` and `import type`.

## Key takeaways {#key-takeaways}

- A type alias is a reusable name for any type, which keeps long or repeated types in one place.
- Aliases are transparent: they improve readability, not distinctness, so same-shaped aliases are interchangeable.
- Generic and recursive aliases let one definition describe whole families of types, such as API results and JSON.
- Deriving aliases from values and other types keeps types in sync with code automatically.
- Like every type, an alias disappears at runtime, so data from outside the program still needs validation.
