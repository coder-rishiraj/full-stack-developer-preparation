---
summary: "`as const` tells TypeScript to infer the narrowest possible type for a literal: exact literal values, readonly properties and readonly tuples instead of arrays. You will learn why TypeScript widens types by default, what `as const` changes, how to derive union types from constant data, and how it works with `satisfies` and `const` type parameters."
difficulty: intermediate
minutes: 35
objectives:
  - Explain literal widening and predict when TypeScript widens a literal type
  - Describe the three effects of as const on strings, numbers, objects and arrays
  - Derive union types from as const arrays and objects with indexed access and keyof typeof
  - Use as const to return tuples from functions and to pass discriminated-union literals
  - Distinguish the compile-time readonly of as const from runtime Object.freeze, and know where as const cannot be used
---

## Introduction

TypeScript has to guess what you mean when you write a literal. Given `let mode = "dark"`, does `mode` hold *exactly* `"dark"` forever, or is it a string that happens to start as `"dark"`? Because `let` variables are usually reassigned, TypeScript guesses the general type, `string`. The same guess happens inside objects and arrays, because their contents can be changed: `{ mode: "dark" }` is inferred as `{ mode: string }`, and `["sm", "md"]` as `string[]`.

That guess is called **literal widening**, and most of the time it is what you want. But for data that never changes — a list of allowed sizes, a table of routes, the tuple a function returns — widening throws away exactly the information you need. You want the compiler to know that sizes are `"sm" | "md" | "lg"`, not any string.

A **const assertion**, written `as const` after a literal, tells the compiler: "treat this value as constant; infer the most specific type you can." It has three effects:

1. Literal values keep their **literal types** (`"dark"`, not `string`; `42`, not `number`).
2. Object properties become **`readonly`**, recursively.
3. Array literals become **`readonly` tuples** with a fixed length and a type per position.

```typescript
const SIZES = ["sm", "md", "lg"] as const;
// type: readonly ["sm", "md", "lg"]
```

From that one constant you can derive the type `"sm" | "md" | "lg"` and use the array for runtime checks, so the type and the data never drift apart. That pattern is the foundation of much of modern TypeScript: unions instead of enums, typed route tables, and validated configuration with [[b2-satisfies]].

This lesson covers `as const` as a general tool. [[b2-as-const-objects]] focuses on one major use — constant objects as an alternative to `enum` — and [[b2-as-const-assertion]] covers the assertion's rules in the core language section.

## Before you start

- **Literal types** — `"dark"` and `42` as types. See [[b2-literal-types]].
- **Tuples and readonly arrays** — `[string, number]` and `readonly T[]`. See [[b2-tuples]] and [[b2-readonly-tuples]].
- **`typeof` and `keyof` in type positions** — getting the type of a value and the keys of a type. See [[b2-typeof]] and [[b2-keyof]].
- **Type assertions** — the `as` syntax in general. See [[b2-type-assertions]].

## The intuition

Think of inference as a clerk filing your data. By default the clerk files by category: "a string", "a number", "a list of strings". That is useful when the value will be replaced later — the category is what matters. `as const` asks the clerk to file the exact value instead: "the string `md`", "a list of exactly three things: `sm`, `md`, `lg`, in that order". And because the clerk has recorded exact values, the filing is marked "do not edit", since editing would make the record wrong.

That is why the two effects come together. A type that says "this property is `"dark"`" is only true if nobody assigns `"light"` to it, so `as const` adds `readonly` to make the claim safe.

## Literal widening: what TypeScript does by default

The rules for when TypeScript keeps a literal type are worth knowing precisely, because `as const` is the switch that overrides them.

```typescript
const a = "dark";          // "dark"   — const binding of a primitive cannot change
let b = "dark";            // string   — let can be reassigned
const c = { mode: "dark" }; // { mode: string } — properties can be reassigned
const d = ["sm", "md"];     // string[] — elements can change, length can change
```

A `const` variable holding a primitive keeps its literal type, because neither the binding nor the value can change. Everything that *could* change is widened: `let` variables, object properties (the object is mutable even if the binding is `const`), and array elements. For arrays, TypeScript also chooses an array type rather than a tuple, because an array literal is usually a list that grows.

Widening only causes trouble when the wider type is then used where a narrow one is required. A classic example is passing an object to a function that expects a discriminated union (see [[b2-discriminated-unions]]):

```typescript
type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };
function area(shape: Shape) { /* … */ }

const circle = { kind: "circle", r: 1 };
area(circle);
```

```output
error TS2345: Argument of type '{ kind: string; r: number; }' is not assignable to parameter of type 'Shape'.
```

`circle.kind` was widened to `string`, and a `string` might be `"triangle"`, so it is not a valid discriminant. Passing the literal directly, `area({ kind: "circle", r: 1 })`, works, because the parameter type provides a contextual type that keeps the literal. Stored in a variable first, the context is lost.

## What `as const` changes

Apply `as const` and every widening above is switched off:

```typescript
let b = "dark" as const;                    // "dark"
const c = { mode: "dark" } as const;        // { readonly mode: "dark" }
const d = ["sm", "md"] as const;            // readonly ["sm", "md"]
const circle = { kind: "circle", r: 1 } as const;
// { readonly kind: "circle"; readonly r: 1 }
area(circle);                               // OK
```

The effect is **deep**. Nested objects and arrays inside the literal are also made readonly and literal:

```typescript
const THEME = { space: { sm: 4, lg: 16 }, fonts: ["Inter", "serif"] } as const;
// { readonly space: { readonly sm: 4; readonly lg: 16 };
//   readonly fonts: readonly ["Inter", "serif"] }
```

Writes are now compile errors, and array methods that mutate are not available on the type:

```typescript
THEME.space.sm = 8;
THEME.fonts.push("mono");
```

```output
error TS2540: Cannot assign to 'sm' because it is a read-only property.
error TS2339: Property 'push' does not exist on type 'readonly ["Inter", "serif"]'.
```

### Where `as const` can be used

A const assertion may only be applied to a **literal expression**: a string, number, boolean, array or object literal (or an enum member). It cannot be applied to a variable or a function call, because the point is to change how a literal is *inferred*, and a variable's type has already been decided:

```typescript
let s = "x";
const t = s as const;
```

```output
error TS1355: A 'const' assertion can only be applied to references to enum members, or string, number, boolean, array, or object literals.
```

Function expressions inside an `as const` literal are left as they are; only literals are narrowed.

## Deriving types from constant data

The most valuable use of `as const` is to write data once and derive types from it, so there is a single source of truth.

**Union from an array.** Indexing a tuple type with `number` gives the union of its element types:

```typescript
const SIZES = ["sm", "md", "lg"] as const;
type Size = (typeof SIZES)[number];   // "sm" | "md" | "lg"
```

Read `(typeof SIZES)[number]` as "the type of whatever you get when you index `SIZES` with any number". Without `as const`, `typeof SIZES` would be `string[]` and the result would be `string`.

**Unions from an object.** `keyof typeof` gives the keys, and indexed access gives the values:

```typescript
const MODES = { view: "VIEW", edit: "EDIT" } as const;
type ModeName = keyof typeof MODES;               // "view" | "edit"
type ModeValue = (typeof MODES)[keyof typeof MODES]; // "VIEW" | "EDIT"
```

These patterns are explored further in [[b2-keyof-typeof-patterns]] and [[b2-indexed-access]].

The array version has an extra benefit: the same array is available at runtime, so you can validate input against the very list that defines the type. One snag: `SIZES.includes(value)` with `value: string` is a compile error, because the readonly tuple's `includes` only accepts `"sm" | "md" | "lg"`. Widening the array for the call, `(SIZES as readonly string[]).includes(value)`, is the usual fix, as in the worked example below.

## Tuples from functions

A function that returns several values in an array has its return type inferred as an array of the union of element types, which loses the position information:

```typescript
function parseSetting(line: string) {
  const [key = "", raw = ""] = line.split("=");
  return [key.trim(), Number(raw)];   // inferred: (string | number)[]
}
const [k] = parseSetting("timeout=30");
k.toUpperCase();
```

```output
error TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
```

Adding `as const` to the returned literal makes the return type `readonly [string, number]`, so each destructured variable has its own type. This is the same reason React-style hooks that return `[value, setter]` either use `as const` or declare an explicit tuple return type.

## `as const` with `satisfies`

`as const` keeps exact values, but it checks nothing: a typo or a wrong value is preserved faithfully. [[b2-satisfies]] checks a shape without changing the inferred type. Combined, they give data that is exact, readonly and validated:

```typescript
type Route = "/" | "/about" | "/settings";
const NAV = {
  home: "/",
  about: "/about",
} as const satisfies Record<string, Route>;
```

Write `as const` first: it must apply to the literal itself, and the frozen result is then checked. Prefer `readonly` arrays in the target type, since `as const` produces readonly tuples.

## `const` type parameters (TypeScript 5.0+)

Sometimes you want callers' arguments to be inferred as if they had written `as const`, without asking them to. TypeScript 5.0 added the `const` modifier on type parameters:

```typescript
function routes<const T extends readonly string[]>(paths: T): T {
  return paths;
}
const r = routes(["/", "/about"]);   // T is readonly ["/", "/about"]

function loose<T extends readonly string[]>(paths: T): T {
  return paths;
}
const l = loose(["/", "/about"]);    // T is string[]
```

The modifier only affects literals written directly in the call; passing a variable that was already widened does not narrow it again. It is mostly useful in library code that builds typed APIs from literal arguments.

## How it works internally

`as const` exists only at compile time. The emitted JavaScript for `const SIZES = ["sm", "md", "lg"] as const` is `const SIZES = ["sm", "md", "lg"]` — an ordinary, mutable array. What changes is the type the checker attaches to the literal: during inference it enters a **const context**, in which literal types are not widened, object properties are given the `readonly` modifier, and array literals are typed as readonly tuples. The const context passes down into nested literals, which is why the effect is deep.

So `readonly` here is a compile-time promise, not a runtime guarantee. Code that bypasses the type system — a cast, `any`, or plain JavaScript calling your module — can still mutate the object. If you need runtime immutability, call `Object.freeze` (which is shallow) as well; `Object.freeze` on its own also narrows the type for top-level properties, but it does not freeze nested objects.

**Spreading loses `readonly` but keeps literals.** Spreading a const-asserted object into a new literal copies the property types, but the new object's properties are mutable:

```typescript
const MODES = { view: "view", edit: "edit" } as const;
const more = { ...MODES, extra: "x" };
// { extra: string; view: "view"; edit: "edit" } — no readonly, and extra is widened
```

If the new object should also be constant, apply `as const` to the new literal too.

## Worked example: one source of truth for sizes

This program compiles under `strict` and `noUncheckedIndexedAccess`.

```typescript title="asconst.ts"
const SIZES = ["sm", "md", "lg"] as const;
type Size = (typeof SIZES)[number];           // "sm" | "md" | "lg"

// A runtime check derived from the same array as the type
function isSize(value: string): value is Size {
  return (SIZES as readonly string[]).includes(value);
}

// as const on a return value gives a tuple, not an array of unions
function parseSetting(line: string) {
  const [key = "", raw = ""] = line.split("=");
  return [key.trim(), Number(raw)] as const;  // readonly [string, number]
}

for (const input of ["md", "xl"]) {
  console.log(input, isSize(input) ? "valid" : "invalid");
}

const [key, value] = parseSetting("timeout = 30");
console.log(key.toUpperCase(), value.toFixed(1));
console.log(SIZES.length, Object.isFrozen(SIZES));
```

```output
md valid
xl invalid
TIMEOUT 30.0
3 false
```

`SIZES` is both data and the definition of `Size`. Adding `"xl"` to the array updates the type, every function that accepts a `Size`, and the runtime check, in one edit. `isSize` is a type guard (see [[b2-custom-type-guards]]): after `if (isSize(input))`, `input` is narrowed to `Size`. The cast inside it widens the tuple only for the `includes` call; it does not affect `SIZES` anywhere else.

`parseSetting` returns `readonly [string, number]`, so `key` is a `string` and `value` a `number`, and both method calls type-check. The `= ""` defaults in the destructuring are there because, with `noUncheckedIndexedAccess`, elements of `split`'s result may be `undefined`.

The last line shows the runtime truth: `SIZES.length` is 3, and `Object.isFrozen(SIZES)` is `false`. `as const` did not freeze anything; it only changed the type.

```quiz
Q: What is the type of `x` in `const x = { tags: ["a", "b"] } as const`?
- [ ] `{ tags: string[] }`
- [ ] `{ readonly tags: string[] }`
- [x] `{ readonly tags: readonly ["a", "b"] }`
- [ ] `{ tags: ["a", "b"] }`
> A const context is deep: the property becomes readonly, the nested array becomes a readonly tuple, and each element keeps its literal type.

Q: What does `as const` do at runtime?
- [ ] It calls `Object.freeze` on the value
- [ ] It deep-freezes the value
- [x] Nothing; it is erased and only changes the inferred type
- [ ] It makes the variable impossible to reassign
> Type assertions are removed during compilation. The readonly-ness is a compile-time rule; the object remains mutable at runtime, as `Object.isFrozen` returning `false` shows.

Q: Why does `(typeof SIZES)[number]` give `"sm" | "md" | "lg"` only when `SIZES` is declared with `as const`?
- [ ] `typeof` does not work on arrays without `as const`
- [x] Without it, `SIZES` is inferred as `string[]`, so indexing it gives `string`
- [ ] `as const` adds a hidden `number` key to the array
- [ ] It works the same without `as const`
> Literal widening turns an array of string literals into `string[]`. The indexed access type faithfully returns the element type, which is then just `string`. `as const` keeps the tuple of literals, so the element type is the union.
```

## In real systems

**Allowed-value lists.** Sizes, variants, locales, roles and event names are commonly written as `as const` arrays, with the type derived by `(typeof X)[number]`, and the array used for dropdowns and validation. This replaces many uses of `enum` without generating extra JavaScript; see [[b2-literal-unions-vs-enums]].

**Action creators and messages.** Objects that must carry a literal `type` discriminant — Redux-style actions, `postMessage` payloads, WebSocket messages — use `as const` (or a return type annotation) so `type` is not widened to `string`.

**Hook-style tuple returns.** Custom hooks returning `[value, setValue]` add `as const` so that callers get a typed tuple rather than an array of unions.

**Validated configuration.** `as const satisfies Config` produces configuration whose exact values can be read by other code and whose shape has been checked.

## Trade-offs and alternatives

| Tool | Literal types | Readonly | Checks shape | Runtime effect |
|---|---|---|---|---|
| Plain inference | Only for `const` primitives | No | No | None |
| Type annotation | Only if the annotation has literals | Only if annotated | Yes | None |
| `as const` | Yes, deep | Yes, deep | No | None |
| `as const satisfies T` | Yes, deep | Yes, deep | Yes | None |
| `Object.freeze(obj)` | Top-level properties | Top-level properties | No | Shallow runtime freeze |
| `enum` | Its own member types | Yes | N/A | Generates an object |

The cost of `as const` is rigidity. A `readonly ["sm", "md", "lg"]` cannot be passed to a function that expects a mutable `string[]` (TypeScript reports that the readonly type cannot be assigned to the mutable type), so APIs that receive constant data should accept `readonly` arrays. Very large `as const` objects also produce very large types, which slow down the compiler and make error messages long.

## Common mistakes

> [!MISTAKE] Treating `as const` as runtime protection
> `as const` does not freeze anything. If the object must not change at runtime — for example, a default config that callers could mutate — combine it with `Object.freeze`, and remember `Object.freeze` is shallow.

**Applying it to a variable.** `value as const` is error TS1355. Put it on the literal where the value is created.

**Forgetting it on returned tuples.** A function returning `[a, b]` returns an array of unions unless you use `as const` or declare the tuple return type.

**Losing it through spread or copying.** `{ ...CONST, extra }` removes `readonly`, and `[...ARR]` produces a mutable array. Reapply `as const` to the new literal if needed.

**Expecting it to catch mistakes.** `as const` preserves typos faithfully. Pair it with `satisfies` when the data must conform to a type.

## Interview perspective

> [!INTERVIEW] What interviewers look for
> A strong answer names the three effects (no literal widening, deep `readonly`, arrays become readonly tuples), explains *why* TypeScript widens by default (mutable locations could hold other values), shows the `(typeof X)[number]` pattern for a single source of truth, and states clearly that nothing happens at runtime.

Common follow-ups:

- **"`as const` versus `Object.freeze`?"** One is a deep compile-time type change with no runtime effect; the other is a shallow runtime freeze that also narrows top-level property types.
- **"`as const` versus `enum`?"** Unions derived from `as const` data erase to plain values and work with structural typing; `enum` generates runtime code and has nominal-like behaviour.
- **"How do you make a generic function infer literals without the caller writing `as const`?"** A `const` type parameter (TypeScript 5.0+).

## Practice

1. Declare the HTTP methods your API supports as an `as const` array, derive `Method`, and write `isMethod(value: string): value is Method`.
2. Write a function returning `[isLoading, error]` and compare its inferred return type with and without `as const`.
3. Given `const DEFAULTS = { retries: 3, backoff: [100, 200, 400] } as const`, write a function that accepts the backoff array as a parameter. What parameter type do you need, and why?
4. Write a `const` type parameter function `tuple(...items)` that returns its arguments as a precisely typed tuple.

## Quick revision {#quick-revision}

- Literal widening: `let`, object properties and array elements widen (`"a"` → `string`, `[…]` → `T[]`).
- `as const`: no widening, deep `readonly`, arrays become readonly tuples.
- Only on literals (string, number, boolean, array, object, enum member); `variable as const` is TS1355.
- `(typeof ARR)[number]` → union of elements; `keyof typeof OBJ` → keys; `(typeof OBJ)[keyof typeof OBJ]` → values.
- `return [a, b] as const` → typed tuple return.
- `as const satisfies T` → exact, readonly and checked.
- `const` type parameters (TS 5.0+) infer arguments as if `as const`.
- Compile-time only; `Object.isFrozen` stays `false`. Spread drops `readonly`.

## Key takeaways {#key-takeaways}

- TypeScript widens literals in mutable positions; `as const` turns that off for one literal.
- The result is exact literal types, deep `readonly`, and tuples instead of arrays.
- Write constant data once with `as const` and derive union types from it, so types and runtime values cannot drift apart.
- It checks nothing and freezes nothing; pair it with `satisfies` for validation and `Object.freeze` for runtime immutability.
- Accept `readonly` arrays in APIs that receive constant data.
