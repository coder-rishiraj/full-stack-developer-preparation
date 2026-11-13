---
summary: Type inference is the TypeScript compiler working out types you did not write, from initial values, return statements, surrounding context and control flow. You will learn the rules it follows — literal widening, best common type, contextual typing, return inference, generic inference — so you can predict what the compiler infers and spot where inference needs help.
difficulty: intermediate
minutes: 45
objectives:
  - Predict the inferred type of variables, arrays, objects and function returns
  - Explain literal widening and the difference between `let`, `const` and `as const`
  - Explain contextual typing and why callback parameters usually need no annotations
  - Trace how generic type arguments are inferred from function arguments
  - Recognise where inference fails (empty containers, recursion, `JSON.parse`, unannotated parameters) and fix it
---

## Introduction

If every value in a TypeScript program needed a written type, the language would be exhausting to use. A three-line `map` over an array would need half a dozen annotations, and every one of them would have to be updated whenever the code changed. TypeScript avoids that with **type inference**: whenever you leave a type out, the compiler works one out from the code itself.

```typescript title="first-inference.ts"
const prices = [19.99, 5, 12.5];
const total = prices.reduce((sum, p) => sum + p, 0);
```

There is not a single annotation here, yet the compiler knows `prices` is `number[]`, `sum` and `p` are `number`, and `total` is `number`. If you later write `total.toUpperCase()`, you get an error.

Inference is what makes TypeScript feel like JavaScript with a safety net rather than like Java with extra punctuation. It also has a subtler benefit: an inferred type always matches the code, because it is computed from the code. An annotation can be wrong or out of date; an inferred type cannot be out of date. The cost is that you need to understand the rules well enough to predict what the compiler will infer — otherwise you will be surprised when `let mode = "dark"` refuses to be passed where `"dark" | "light"` is expected. This lesson teaches those rules. Deciding when to rely on inference and when to write a type is the subject of [[b2-when-explicit-vs-inferred]].

## Before you start

- **Type annotations** — the `: Type` syntax and where it can go. See [[b2-type-annotations]].
- **Explicit types** — what changes when you write a type yourself. See [[b2-explicit-types]].
- **Literal types and unions** — that `"dark"` and `42` can be types, and `A | B` means "either". A short introduction is in [[b2-primitive-object-types]]; full coverage in [[b2-literal-types]] and [[b2-unions]].
- **`let` vs `const`** — `const` bindings cannot be reassigned. See [[b1-var-let-const]].

## The intuition

Think of the compiler as a careful detective reading your code from top to bottom. It never guesses what you *meant*; it only records what the code *proves*. If you write `let count = 10`, the code proves `count` starts as a number, and since `let` allows reassignment the detective writes down "number" — not "exactly 10", because nothing says it will stay 10. If you write `const limit = 10`, the code proves `limit` is 10 forever, so the detective writes down "exactly 10".

The detective also uses **context**. When a function is passed to `prices.map`, the detective knows `map` will call it with numbers, so the callback's parameter must be a number even though you did not say so. And it follows **control flow**: inside `if (x !== null)`, it knows `x` is not `null`.

Where the detective has no evidence — an empty array, a parameter nobody annotated, the output of `JSON.parse` — it either asks you for an annotation (under `strict`) or falls back to `any`, which means "stop checking".

## Inference from initial values

The simplest case: a variable's type comes from the value it is initialised with. The comments below show the inferred types, as you would see by hovering in an editor.

```typescript title="initializers.ts"
let count = 10;                 // number
const limit = 10;               // 10
let mode = "dark";              // string
const theme = "dark";           // "dark"
const flags = [true, false];    // boolean[]
const user = { name: "Ada", role: "admin", age: 36 };
// { name: string; role: string; age: number }
const nested = { point: { x: 1, y: 2 } };
// { point: { x: number; y: number } }
const lookup = new Map([["a", 1]]); // Map<string, number>
```

Each of these types was confirmed by asking the compiler to emit declaration files, which print the types it inferred.

### Literal widening: `let` versus `const`

The first four lines show the most important inference rule. The value `10` on its own has the **literal type** `10`. What the variable gets depends on whether it can change:

- A `const` holding a primitive can never change, so it keeps the literal type: `limit` is `10`, `theme` is `"dark"`.
- A `let` can be reassigned, so the literal is **widened** to its general primitive type: `count` is `number`, `mode` is `string`. If `mode` were inferred as `"dark"`, the next line `mode = "light"` would be an error, which is almost never what you want.

**Object properties widen too**, even inside a `const` object. `user` is a constant *binding*, but its properties can still be reassigned (`user.role = "viewer"` is legal JavaScript), so `role` is inferred as `string`, not `"admin"`. This rule produces one of the most common confusing errors in TypeScript:

```typescript title="widening-error.ts"
type Shape = { kind: "circle"; radius: number };
function area(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
const s = { kind: "circle", radius: 2 };
area(s);
area({ kind: "circle", radius: 2 });
```

```output
widening-error.ts(6,6): error TS2345: Argument of type '{ kind: string; radius: number; }' is not assignable to parameter of type 'Shape'.
  Types of property 'kind' are incompatible.
    Type 'string' is not assignable to type '"circle"'.
```

`s.kind` widened to `string`, and `string` is not assignable to `"circle"`. The second call works because the object literal is written directly in the argument position, where the parameter type provides context and no widening happens. Three fixes exist, each appropriate in different situations: annotate (`const s: Shape = ...`), check with `satisfies Shape` ([[b2-satisfies]]), or freeze the literals with `as const`.

### `as const`

A **const assertion** (`as const`) tells the compiler to infer the narrowest possible type: literal types everywhere, `readonly` properties, and arrays as `readonly` tuples.

```typescript title="as-const.ts"
const config = { role: "admin", retries: 3 } as const;
// { readonly role: "admin"; readonly retries: 3 }
const sizes = ["s", "m", "l"] as const;
// readonly ["s", "m", "l"]
```

Despite the `as`, this is not an unsafe assertion — it never claims anything the value does not prove. It is widely used to build lists of allowed values from which a union type is derived; see [[b2-as-const]].

## Best common type for arrays

For an array literal, the compiler looks at every element and computes a type that covers all of them. If they share a type, that is the element type; otherwise the result is a **union** of the element types.

```typescript title="arrays.ts"
const mixed = [1, "two", null];          // (string | number | null)[]
const ids = [1, 2, 3];                   // number[]
```

Note that the result is an *array of a union*, not a tuple: the compiler does not remember that position 0 was a number. If position matters, annotate a tuple type or use `as const`. Also note the element type is widened (`number`, not `1 | 2 | 3`), because arrays are mutable.

## Inferring function return types

If a function has no return type annotation, the compiler infers it from all its `return` statements, combining them into a union. A function with no `return` (or only bare `return;`) is inferred to return `void`.

```typescript title="returns.ts"
function describe(n: number) {
  if (n < 0) return "negative";
  if (n === 0) return null;
  return n;
}
const a = describe(5);  // number | "negative" | null
let b = describe(5);    // string | number | null
```

The inferred return type is `number | "negative" | null`. Literal types in return positions are kept on `const` but widen again when stored in a `let`, which is why `a` and `b` differ.

Return inference has one hard limit: **recursion**. To infer `fact`'s return type, the compiler needs the type of `fact(n - 1)`, which is the thing it is trying to infer.

```typescript title="recursion.ts"
function fact(n: number) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
```

```output
recursion.ts(1,10): error TS7023: 'fact' implicitly has return type 'any' because it does not have a return type annotation and is referenced directly or indirectly in one of its return expressions.
```

Annotating the return type, `function fact(n: number): number`, breaks the cycle.

**Parameters are never inferred from how they are used.** In `function add(a, b) { return a + b; }`, the compiler does not look at callers or at the body to guess `a` and `b`. Under `strict` both are errors (TS7006, implicitly `any`); without `strict` they silently become `any`. The only way a parameter gets a type without an annotation is from a default value or from context, described next.

## Contextual typing

Inference usually flows from a value outwards to the variable. **Contextual typing** flows the other way: the type of the place an expression appears in decides the type of the expression. The most common case is callbacks.

```typescript title="worked-example.ts"
const prices = [19.99, 5, 12.5];
const total = prices.reduce((sum, p) => sum + p, 0);
const labels = prices.map((p) => `$${p.toFixed(2)}`);
const expensive = prices.filter((p) => p > 10);

function summarize(values: number[]) {
  if (values.length === 0) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
}
const summary = summarize(prices);
if (summary !== null) {
  console.log(summary.min, summary.max);
}
console.log(total, labels, expensive);
```

```output
5 19.99
37.489999999999995 [ '$19.99', '$5.00', '$12.50' ] [ 19.99, 12.5 ]
```

Walk through what the compiler infers, step by step:

1. `prices` is `number[]` from its elements.
2. `prices.map` is declared in the standard library roughly as `map<U>(callback: (value: number, index: number, array: number[]) => U): U[]`. The callback `(p) => ...` is written where that parameter type is expected, so `p` is contextually typed as `number` — which is why `p.toFixed` is allowed.
3. The callback returns a template string, so `U` is inferred as `string` and `labels` is `string[]`.
4. `summarize` has two returns, `null` and an object, so its return type is `{ min: number; max: number } | null`.
5. Inside `if (summary !== null)`, control-flow narrowing removes `null`, so `summary.min` is allowed. Outside the `if`, it would be an error.

The floating-point total `37.489999999999995` is ordinary IEEE 754 behaviour, not a TypeScript effect.

Contextual typing applies anywhere the expected type is known: event handlers (`document.addEventListener("click", (e) => ...)` gives `e` the type `MouseEvent`, and `"keydown"` gives `KeyboardEvent`), arguments to typed functions, values assigned to annotated variables, and React props. It is the reason most callback code in TypeScript needs no annotations at all — and the reason you lose those types if you pull the callback out into a separate unannotated function.

## Control-flow narrowing

A variable's *declared* type is fixed, but the compiler tracks a narrower type at each point in the code based on the checks it has passed through. After `if (typeof x === "string")`, `x` is `string` inside the branch; after `if (summary !== null)`, `summary` is not `null`; after an assignment `value = 5` to a `string | number` variable, `value` is `number` until the next assignment. This is still inference — the compiler deduces facts from your code — and it is taught fully in [[b2-narrowing]].

## Generic inference

A **generic function** has type parameters, written in angle brackets, that stand for "whatever type the caller uses". When you call it, the compiler infers the type parameters from the arguments.

```typescript title="generics.ts"
function wrap<T>(value: T) {
  return [value];
}
function first<T>(items: T[]) {
  return items[0];
}
const wrapped = wrap("ok");     // T = string, result string[]
const head = first([10, 20]);   // T = number, result number
```

For `wrap("ok")`, the argument `"ok"` is matched against the parameter type `T`, so `T` is `string` (widened from `"ok"`, because nothing asked for a literal). For `first([10, 20])`, the argument `number[]` is matched against `T[]`, so `T` is `number`. You can always override inference by writing the type argument explicitly, as in `wrap<"ok" | "error">("ok")` or `new Map<string, number>()`. Note that `head` is typed `number`, not `number | undefined`, even though `first([])` would return `undefined`; the `noUncheckedIndexedAccess` option changes that. Generics are covered in [[b2-generics]].

## Where inference runs out

Some code does not contain enough information. Knowing these cases saves a lot of confusion.

**Empty arrays assigned to `let` or `const`.** `let items = []` creates an **evolving array**: the compiler watches what you push and updates the type (`items.push(1)` makes it `number[]`). Under `strict`, reading it before anything is pushed is an error (TS7005, implicitly `any[]`). This works within one function but is fragile; an explicit `const items: number[] = []` is clearer.

**Empty arrays inside objects.** `const holder = { items: [] }` gives `items` the type `never[]` — an array that can never contain anything — so `holder.items.push(1)` fails. Annotate the object.

**`JSON.parse` and other `any` sources.** `JSON.parse` returns `any`, and `any` spreads: `parsed.whatever.deep()` compiles without complaint. Inference cannot invent a type for data the compiler has never seen. Annotate with `unknown` and validate (see [[b2-special-types]]).

**Recursive functions** need a return type annotation, as shown above. **Unannotated parameters** are never inferred from usage.

## How it works internally

The type checker computes types lazily. When some code needs the type of `prices`, the checker looks at its declaration; with no annotation it evaluates the type of the initializer expression, applies widening rules depending on whether the declaration is `let` or `const`, and caches the result. Expression types are computed bottom-up: the type of `[19.99, 5, 12.5]` comes from the types of its elements, combined into a union and reduced by **subtype reduction** (removing members that are subsumed by others).

Contextual typing runs top-down. When the checker meets the argument `(p) => ...` in a call to `prices.map`, it first resolves which overload of `map` applies, then uses the parameter type as the **contextual type** for the arrow function. Generic calls are inferred in phases: arguments that are not context-sensitive (like plain values) are inferred first, producing candidate types for the type parameters; then context-sensitive arguments (unannotated callbacks) are checked using the partially inferred types. This ordering lets a plain value argument fix a type parameter before an unannotated callback that depends on it is checked.

Control-flow analysis builds a graph of the function's branches and assignments and, for each reference to a variable, walks backwards through the graph to compute its narrowed type at that point. Inference has depth limits: very deep recursive types or long chains of generic calls can hit "Type instantiation is excessively deep" errors, which is a signal to add explicit types at intermediate steps.

## In real systems

Most TypeScript in a mature codebase has far fewer annotations than you might expect. React components declare their props type; everything inside — derived values, event handler parameters, `useMemo` results, array transforms — is inferred. API layers declare a response type once, and every component consuming the data gets inferred types from the function's return type. Configuration objects use `as const` or `satisfies` so that their literal values are inferred precisely and can drive union types.

When debugging, engineers hover over a variable in the editor to see what was inferred. A hover showing `any` or an unexpectedly wide union (`string | number | undefined` where you expected `string`) is the signal that inference took a wrong turn upstream, and the fix is usually a single annotation at the point where the information was lost.

## Trade-offs and alternatives

Inference gives you less code, types that cannot drift from the implementation, and refactors that propagate automatically. Its costs are that the types are invisible in the source (you need an editor to see them), errors can appear far from their cause (in a caller rather than in the function that changed), and the widening rules occasionally produce types that are wider than you intended. The alternative, explicit annotations, trades those properties the other way. Choosing between them is the topic of [[b2-when-explicit-vs-inferred]].

## Common mistakes

- **Expecting `let` to keep a literal type.** `let mode = "dark"` is `string`. Use `const`, annotate with the union, or use `as const` on the source object.
- **Expecting object properties to keep literal types.** `{ kind: "circle" }` infers `kind: string`. Annotate, use `satisfies`, or `as const`.
- **Initialising with `[]` or `null` and expecting the compiler to know what comes later.** Give the container or variable an explicit type.
- **Extracting a callback into a variable and losing its parameter types.** Contextual typing only works where the expected type is known; annotate the extracted function's parameters.
- **Trusting inferred types from `any`.** Once `any` enters, everything derived from it is `any`. Hover to check.
- **Annotating everything "to be safe".** Redundant annotations add noise and can widen literal types; let the compiler infer obvious locals.

## Interview perspective

**"What is type inference, and when does TypeScript infer `any`?"** Explain that the compiler computes types from initializers, returns, context and control flow. `any` appears from unannotated parameters (an error under `noImplicitAny`), from `any`-returning APIs like `JSON.parse`, and from recursive functions without annotations (also an error under strict).

**"Why does `let x = 'a'` infer `string` but `const x = 'a'` infer `'a'`?"** Widening: a mutable binding must accept other values of the same kind, an immutable one cannot change. Follow up with object properties widening even in a `const` object, and `as const` as the fix.

**"What is contextual typing?"** The type expected at a position flows into the expression placed there, typing callback parameters without annotations. A strong answer mentions event handlers and generic calls such as `map`.

```quiz
Q: What is the inferred type of `role` in `const user = { name: "Ada", role: "admin" }`?
- [ ] `"admin"`, because `user` is declared with `const`
- [x] `string`, because object properties are mutable and widen
- [ ] `any`
> `const` stops `user` from being reassigned but does not freeze its properties, so the compiler widens `"admin"` to `string`. Use `as const`, `satisfies`, or an annotation to keep the literal type.
```

```quiz
Q: In `[1, 2, 3].map((n) => n.toFixed(1))`, where does the type of `n` come from?
- [ ] It is inferred from how `n` is used inside the callback
- [x] Contextual typing: `map`'s callback parameter type says the first argument is a `number`
- [ ] It defaults to `any` and is checked at runtime
> TypeScript never infers parameter types from usage. Because the arrow function is passed where `map` expects `(value: number, ...) => U`, `n` receives `number` from that context.
```

```quiz
Q: Why does `function fact(n: number) { if (n <= 1) return 1; return n * fact(n - 1); }` produce error TS7023 under strict?
- [ ] Recursion is not allowed in TypeScript
- [x] Inferring the return type requires the return type of `fact` itself, which is circular
- [ ] `n * fact(n - 1)` might overflow
> Return inference needs the type of every return expression, and one of them calls `fact`. The compiler cannot finish the cycle, so it would fall back to `any`, which strict mode reports. Annotating `: number` resolves it.
```

```quiz
Q: What is the type of `holder.items` in `const holder = { items: [] }` with strict settings?
- [ ] `any[]`
- [ ] `unknown[]`
- [x] `never[]`
> An empty array literal inside an object has no elements to infer from, and under `strictNullChecks` it becomes `never[]`, so nothing can be pushed. Write `const holder: { items: string[] } = { items: [] }`.
```

## Practice

1. Without an editor, write down the inferred type of each of these, then check: `let a = [1, "x"]`, `const b = { ok: true }`, `const c = [1, 2] as const`, `const d = Math.random() > 0.5 ? "yes" : 0`.
2. Write `const settings = { theme: "dark", size: "md" }` and a function that accepts `{ theme: "dark" | "light"; size: "sm" | "md" | "lg" }`. Make the call compile three different ways.
3. Write a generic `last<T>(items: T[])` and call it with a string array and an array of objects. Check what `T` becomes in each case.
4. Extract the callback from `buttons.forEach((b) => b.addEventListener("click", ...))` into a named function and fix the type errors that appear.
5. Write a recursive `flatten` for nested number arrays and add the minimum annotation it needs to compile under strict.

## Quick revision {#quick-revision}

- Inference computes types from initializers, `return` statements, context and control flow.
- `const x = "a"` → `"a"`; `let x = "a"` → `string` (widening). Object properties and array elements widen even in a `const`.
- `as const` → literal types, `readonly` properties, `readonly` tuples.
- Array literals → union of element types: `[1, "a"]` is `(string | number)[]`, not a tuple.
- Return type = union of all `return` types; no return → `void`. Recursive functions need a return annotation (TS7023).
- Parameters are never inferred from usage — only from annotations, defaults or context.
- Contextual typing: callbacks get parameter types from where they are passed (`map`, `addEventListener`, typed props).
- Generic type parameters are inferred from arguments; override with `fn<T>(...)`.
- Inference runs out on: `let x = []` (evolving `any[]`), `{ items: [] }` (`never[]`), `JSON.parse` (`any`).

## Key takeaways {#key-takeaways}

- Inference is the default in TypeScript; most local code needs no annotations and stays automatically in sync with the implementation.
- The widening rules explain most inference surprises: mutable places get general types, immutable ones keep literals.
- Contextual typing is why callbacks and event handlers rarely need annotations.
- Generic functions infer their type parameters from arguments, so a single generic signature yields precise types at every call.
- Inference cannot create information that is not in the code; empty containers, recursion, unannotated parameters and external data need explicit types.
- Hover to see what was inferred, and add an annotation at the exact point where the type went wrong.
