---
summary: The `satisfies` operator (TypeScript 4.9+) checks that a value matches a type without changing the type TypeScript infers for it. You will learn the problem it solves, how it differs from a type annotation and from `as`, how it combines with `as const`, and where it fits in real configuration and lookup-table code.
difficulty: intermediate
minutes: 40
objectives:
  - Explain the trade-off between a type annotation and inference that satisfies resolves
  - Predict the inferred type of an expression checked with satisfies, including literal and union-typed properties
  - Compare satisfies, a type annotation and an as assertion in terms of what each checks and what type results
  - Combine as const with satisfies in the correct order and explain why the order matters
  - Choose when to use satisfies and when an annotation is the better tool
---

## Introduction

When you declare a constant in TypeScript you usually face a choice. You can **annotate** it, `const palette: Palette = { … }`, so the compiler checks the object against `Palette`. Or you can let TypeScript **infer** the type from the value, `const palette = { … }`, so it remembers exactly what you wrote. Each choice gives up something.

The annotation gives you checking — misspelled keys, wrong value types and missing properties are reported — but the variable's type *becomes* `Palette`. Every detail TypeScript could have learned from the literal is thrown away. If `Palette` says a colour is `string | [number, number, number]`, then `palette.primary` is that union, even though you can see it is a string.

Inference keeps every detail but checks nothing. A typo in a key is just a new key.

The **`satisfies` operator**, added in TypeScript 4.9, gives you both. You write the expression, then `satisfies Type`:

```typescript
const palette = {
  primary: "#0066ff",
  danger: [220, 0, 0],
} satisfies Record<string, Color>;
```

The compiler checks the object literal against `Record<string, Color>` exactly as an annotation would. But the type of `palette` is still the inferred one: `{ primary: string; danger: [number, number, number] }`. You keep the precise type and gain the check.

This sounds small, and the syntax is small, but it changed how idiomatic TypeScript is written for configuration objects, route tables, design tokens, and maps from one set of keys to handlers. This lesson explains the mechanism precisely so you can predict what type you will get.

## Before you start

- **Type annotations and inference** — how TypeScript chooses a variable's type with and without `: Type`. See [[b2-type-annotations]] and [[b2-type-inference]].
- **Literal types and widening** — why `const x = "a"` has type `"a"` but `{ k: "a" }` has `{ k: string }`. See [[b2-literal-types]].
- **Type assertions** — what `value as Type` does and does not check. See [[b2-type-assertions]].
- **`Record` and index signatures** — see [[b2-record-vs-index-signature]].

## The intuition

Imagine a building inspector and an architect. An annotation is like replacing your building with the architect's blueprint: once it passes inspection, everyone who asks about the building is shown the generic blueprint, not the building you actually built. `satisfies` is an inspection only: the inspector checks that your building meets the code, signs it off, and walks away. The building — with all its specific details — is what people see afterwards.

The analogy has a limit worth knowing: the inspector does affect a few details during construction. As you will see, the target type is used as a *contextual type* while TypeScript infers the literal, which can keep literal types narrower than plain inference would. The check is not completely invisible to inference.

## The problem: annotation versus inference

Here is the trade-off made concrete. A colour can be a hex string or an RGB tuple:

```typescript
type RGB = readonly [number, number, number];
type Color = string | RGB;
```

**With an annotation**, the variable's type is the annotated type:

```typescript
const annotated: Record<string, Color> = { primary: "#0066ff" };
annotated.primary.toUpperCase();
annotated.secondry;   // no error: any string key is allowed
```

```output
error TS2339: Property 'toUpperCase' does not exist on type 'Color'.
```

Two things went wrong. `primary` is typed `Color`, so calling a string method is rejected although the value is plainly a string — you would need a `typeof` check for a value you can see. And `secondry`, a typo, is accepted silently, because `Record<string, Color>` is an index signature that allows every key. (With `noUncheckedIndexedAccess`, `annotated.primary` is also `Color | undefined`.)

**With plain inference**, `palette.primary` is a `string` and typos are caught, but nothing checks that the values are valid colours. `danger: [220, 0]` or `danger: 220` would be accepted.

**With `satisfies`**:

```typescript
const palette = {
  primary: "#0066ff",
  danger: [220, 0, 0],
} satisfies Record<string, Color>;

palette.primary.toUpperCase();   // OK: primary is string
palette.secondry;
```

```output
error TS2339: Property 'secondry' does not exist on type '{ primary: string; danger: [number, number, number]; }'.
```

The values were checked against `Color` — writing `danger: 220` would fail — and the inferred type kept the exact keys and the specific type of each value. The error message shows that type: `{ primary: string; danger: [number, number, number] }`.

## How `satisfies` works

The rules are short. For `expr satisfies T`:

1. TypeScript infers the type of `expr`, using `T` as the **contextual type**. Contextual typing is the same mechanism that lets `const f: (n: number) => void = (n) => …` know `n` is a number without annotating the parameter.
2. It checks that the inferred type is assignable to `T`. For a fresh object literal, this includes **excess property checking** and required-property checking, exactly as for an annotation.
3. The type of the whole expression is the **inferred type**, not `T`.

Step 3 is the whole point. Step 1 has two practical consequences that are easy to miss.

**Function parameters get their types from `T`.** If `T` describes functions, you do not need to annotate their parameters:

```typescript
type Handlers = Record<"click" | "key", (e: { x: number }) => void>;
const handlers = {
  click: (e) => console.log(e.x),   // e: { x: number }, inferred from Handlers
  key: (e) => console.log(e.x),
} satisfies Handlers;
```

**Literal types survive when `T` mentions literals.** Normally a string property in an object literal widens to `string`. If the contextual type at that position contains string literal types, TypeScript keeps the literal:

```typescript
type Route = "/" | "/about";
const ROUTES = { home: "/", about: "/about" } satisfies Record<string, Route>;
// typeof ROUTES is { home: "/"; about: "/about" }

const LOOSE = { home: "/" } satisfies Record<string, string>;
// typeof LOOSE is { home: string } — the contextual type has no literals
```

The properties are still mutable (no `readonly`), so `ROUTES.home = "/about"` is an error only because the type of `home` is the literal `"/"`. If you want both narrow literals and immutability regardless of the target type, combine `satisfies` with `as const` (covered below).

**Excess property checks apply only to fresh literals.** As with annotations, if `expr` is a variable rather than a literal, extra properties are allowed:

```typescript
const obj = { a: 1, extra: 2 };
const checked = obj satisfies { a: number };   // no error; checked has both properties
```

**`satisfies` is erased at compile time.** The emitted JavaScript is just the expression. There is no runtime validation and no runtime cost; data from a network request still needs a runtime check.

## `satisfies`, annotation and `as` compared

All three put a type next to a value, which is why they are often confused. They do very different things.

| | `const x: T = e` | `const x = e satisfies T` | `const x = e as T` |
|---|---|---|---|
| Checks `e` against `T`? | Yes, fully | Yes, fully | Only that the types are *comparable* |
| Reports missing properties? | Yes | Yes | No |
| Reports excess properties on literals? | Yes | Yes | No |
| Type of `x` | `T` | Inferred type of `e` | `T` |
| Main use | Declare the contract the variable has from now on | Validate a value while keeping its precise type | Override the compiler when you know more than it does |

An **`as` assertion** is the dangerous one. It tells the compiler to trust you, and only rejects conversions that are obviously impossible:

```typescript
const incomplete = { red: "#f00" } as Record<"red" | "green", string>;
// compiles: the missing "green" is not reported

const checked = { red: "#f00" } satisfies Record<"red" | "green", string>;
```

```output
error TS1360: Type '{ red: string; }' does not satisfy the expected type 'Record<"red" | "green", string>'.
  Property 'green' is missing in type '{ red: string; }' but required in type 'Record<"red" | "green", string>'.
```

Whenever you find yourself writing `as SomeType` on an object literal just to get autocomplete or a check, `satisfies` is almost always what you meant.

The **annotation** still has a place. It is the right tool when the variable will be reassigned or mutated with other values of `T` later (`let current: Status = "idle"`), when the variable is part of a public API and you want callers to see the general type, or when you deliberately want to hide details. `satisfies` widens nothing, so a `let` checked with `satisfies` still gets ordinary inference: `let mode = "dark" satisfies "dark" | "light"` has type `string`, and later assignments are not checked against the union.

## Combining `satisfies` with `as const`

`as const` (see [[b2-as-const]]) makes a literal deeply `readonly` and keeps every literal type. `satisfies` checks a shape. Together they give you a frozen, precisely typed constant that has been validated:

```typescript
type Route = "/" | "/about" | "/settings";

const ROUTES = {
  home: "/",
  about: "/about",
} as const satisfies Record<string, Route>;

type RouteName = keyof typeof ROUTES;                  // "home" | "about"
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]; // "/" | "/about"
```

The order matters: write **`as const satisfies T`**. The expression is parsed as `(literal as const) satisfies T`: `as const` applies to the literal, then the frozen result is checked. The opposite order, `(literal satisfies T) as const`, is an error, because `as const` may only be applied directly to a literal (error TS1355).

Because `as const` makes arrays `readonly`, the target type should accept readonly arrays, for example `readonly string[]`. Since TypeScript 5.3, if the target uses a mutable array type, the compiler infers a mutable tuple for that position instead of reporting an error, so `{ sizes: [1, 2] } as const satisfies { sizes: number[] }` gives `sizes` the type `[1, 2]` without `readonly`. Writing `readonly` in the target keeps the result predictable.

## Worked example: a typed colour palette

This program compiles under `strict` and `noUncheckedIndexedAccess`, and compares the two declarations side by side.

```typescript title="satisfies.ts"
type RGB = readonly [number, number, number];
type Color = string | RGB;

// Annotation: the variable's type IS Record<string, Color>
const annotated: Record<string, Color> = {
  primary: "#0066ff",
  danger: [220, 0, 0],
};

// satisfies: checked against the same type, but the inferred type is kept
const palette = {
  primary: "#0066ff",
  danger: [220, 0, 0],
} satisfies Record<string, Color>;

function toCss(c: Color): string {
  return typeof c === "string" ? c : `rgb(${c.join(", ")})`;
}

console.log(palette.primary.toUpperCase());   // known to be a string
console.log(palette.danger.map((n) => n / 255).map((n) => n.toFixed(2)));
console.log(Object.keys(palette), toCss(palette.danger));

const p = annotated["primary"];               // Color | undefined
console.log(typeof p === "string" ? p.toUpperCase() : p);
```

```output
#0066FF
[ '0.86', '0.00', '0.00' ]
[ 'primary', 'danger' ] rgb(220, 0, 0)
#0066FF
```

Follow the types. `palette.primary` is `string`, so `toUpperCase` needs no check. `palette.danger` is `[number, number, number]` — a tuple, because the contextual type `RGB` is a tuple — so `map` is available and each `n` is a `number`. `palette.danger` is still assignable to `Color`, so passing it to `toCss` works: the precise type is a subtype of the checked type, which is exactly what `satisfies` guarantees.

The last two lines show the cost of the annotation. Reading `annotated["primary"]` gives `Color | undefined` — the compiler forgot both that the key exists and that its value is a string — so the code needs a `typeof` check and must handle `undefined` to produce the same output. Both objects are identical at runtime; only what the compiler knows differs.

```quiz
Q: What is the type of `cfg` in `const cfg = { port: 8080 } satisfies { port: number | string }`?
- [ ] `{ port: number | string }`
- [x] `{ port: number }`
- [ ] `{ port: 8080 }`
- [ ] `unknown`
> `satisfies` keeps the inferred type. Number properties widen to `number` as usual, and the contextual type `number | string` contains no numeric literal types, so no literal is preserved. An annotation would have produced `{ port: number | string }`.

Q: Which line compiles even though the object is missing a required key?
- [ ] `const a: Record<"x" | "y", number> = { x: 1 }`
- [ ] `const b = { x: 1 } satisfies Record<"x" | "y", number>`
- [x] `const c = { x: 1 } as Record<"x" | "y", number>`
- [ ] None of them
> An `as` assertion only checks that the two types are comparable, so a missing property is not reported. Both the annotation and `satisfies` perform a full assignability check and reject the literal.

Q: Why is `{ … } as const satisfies T` written in that order?
- [x] `as const` must apply directly to the literal, and then the frozen result is checked against `T`
- [ ] `satisfies` must always be the last operator in a statement
- [ ] The reverse order compiles but silently skips the check
- [ ] The two orders are equivalent
> `as const` is only allowed on literal expressions. In `(literal satisfies T) as const` its operand is a `satisfies` expression, which is error TS1355. The working order freezes the literal first and validates it second.
```

## In real systems

**Configuration objects.** Framework configuration files are a natural fit: `export default { … } satisfies Config` checks the object against the framework's type while keeping the literal values, so other code importing the config sees exact values rather than the general config type. Many framework templates now generate config files in this form.

**Route and endpoint tables.** `as const satisfies Record<string, Route>` gives a validated table whose keys and paths can be turned into union types with `keyof typeof` and indexed access types, as in the example above. See [[b2-keyof-typeof-patterns]].

**Variant maps and handler tables.** Mapping every member of a union to a handler or a component, with `satisfies` checking that none is missing and contextual typing giving each handler its parameter types. This is important enough to have its own lesson: [[b2-variant-map-satisfies]].

**Design tokens and theme objects.** Checking a theme against a token schema while keeping each token's exact value available to code that needs it, such as a value that must be a tuple for a colour-maths function.

## Trade-offs and alternatives

`satisfies` is a compile-time check of *one expression*. It does not attach a type to a variable for the future. That is both its strength and its limit:

- **Use `satisfies`** for constants defined once in a literal — configuration, lookup tables, tokens, fixtures — where you want both validation and precise inference.
- **Use an annotation** for variables that will change, for function parameters and return types, and for exported values where the general type is the intended contract. Annotating a function's return type is still the best way to stop accidental changes to an API.
- **Use `as`** only when you genuinely know something the compiler cannot, such as after a runtime check it cannot follow. Do not use it to get autocomplete on a literal.
- **Use runtime validation** (a schema library or a hand-written type guard) for data that crosses a boundary: `satisfies` does nothing at runtime.

The main cost of `satisfies` is that inferred types can be large and specific, and they leak into everything that uses the constant. For an exported library value, a deliberately general annotation may be better for readers of your API.

## Common mistakes

> [!MISTAKE] Annotating a constant and then fighting the type
> Writing `const routes: Record<string, string> = { home: "/" }` and then `routes.home!` or `routes["home"] as string` elsewhere is a sign you wanted `satisfies`. The annotation discarded the keys; `satisfies` keeps them.

**Using `as` to "check" a literal.** `{ … } as Config` does not report missing properties or typos. Replace it with `satisfies Config`.

**Expecting `satisfies` to validate at runtime.** It is erased. `JSON.parse(text) satisfies Config` checks nothing useful, because `JSON.parse` returns `any`, which satisfies every type.

**Putting `as const` in the wrong place.** `(obj satisfies T) as const` is a compile error. Write `obj as const satisfies T`.

**Expecting later assignments to be checked.** `let theme = "dark" satisfies Theme` gives `theme` the type `string`; assigning `"blue"` later compiles. Annotate variables that change.

## Interview perspective

> [!INTERVIEW] The one-sentence explanation
> "An annotation sets the variable's type to the annotated type; `satisfies` checks the value against the type but keeps the inferred type, so I get validation and precise literal types at the same time — and unlike `as`, it actually reports missing and excess properties."

Expect follow-ups such as:

- **"What's the inferred type here?"** Be ready to apply the three rules: infer with `T` as context, check, keep the inferred type. Watch for literal preservation when `T` contains literals.
- **"Why not just `as const`?"** `as const` keeps literals but checks nothing; a typo or wrong value type is accepted. The two are complementary.
- **"Which version introduced it?"** TypeScript 4.9 (November 2022). JSDoc gained an `@satisfies` tag in TypeScript 5.0.
- **"Does it work on non-literals?"** Yes, but excess property checks only apply to fresh object literals.

## Practice

1. Rewrite `const sizes: Record<string, number> = { sm: 4, md: 8, lg: 16 }` with `satisfies` and show one error the new version catches that the old one did not.
2. Write a `Record<"GET" | "POST", (path: string) => void>` handler table using `satisfies`, without annotating any parameter. Remove one key and read the error.
3. Predict, then check, the type of `const x = { mode: "dark" } satisfies { mode: "dark" | "light" }`. Then remove the literal union from the target and predict again.
4. Find an `as SomeType` on an object literal in a codebase you know, replace it with `satisfies`, and note whether the compiler finds anything.

## Quick revision {#quick-revision}

- `expr satisfies T` (TS 4.9+): check `expr` against `T`, keep the inferred type of `expr`.
- Inference uses `T` as the contextual type: function parameters get types, and literal types are kept where `T` has literals.
- Fresh object literals get excess and missing-property checks, like an annotation.
- Annotation: type becomes `T`. `satisfies`: type stays inferred. `as`: only a comparability check, type becomes `T`.
- `as const satisfies T` — freeze, then check; the reverse order is TS1355.
- With `as const`, prefer `readonly` arrays in `T`.
- Erased at compile time; no runtime validation.
- `let x = v satisfies T` does not constrain later assignments.

## Key takeaways {#key-takeaways}

- `satisfies` removes the old choice between checking a value and keeping its precise type.
- It checks as strictly as an annotation, and far more strictly than `as`.
- The resulting type is the inferred one, shaped by `T` only through contextual typing.
- Combined with `as const`, it produces validated, readonly constants whose keys and values can be turned into union types.
- Use annotations for variables that change and for public contracts; use `satisfies` for literal constants you want both checked and precise.
