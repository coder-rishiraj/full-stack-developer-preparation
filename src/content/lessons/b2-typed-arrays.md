---
summary: TypeScript describes a JavaScript array by the type of its elements, so the compiler can check every push, index read and map/filter chain. You will learn the array type syntax, how array methods carry element types through, how readonly arrays protect data you do not own, and how the compiler infers array types when you do not write them.
difficulty: beginner
minutes: 50
objectives:
  - Write array types with T[] and Array<T>, including arrays of unions, objects and nested arrays
  - Trace how element types flow through map, filter, find and reduce, and when filter narrows
  - Use readonly arrays in function parameters and explain why mutable-to-readonly is allowed but not the reverse
  - Predict the inferred type of an array literal, including empty arrays and as const
  - Distinguish TypeScript array types from JavaScript's binary typed arrays such as Uint8Array
---

## Introduction

Arrays are the most common data structure in frontend code: the rows of a table, the items in a cart, the results of a search, the messages in a chat. In plain JavaScript, an array can hold anything, and nothing stops a number from ending up in a list of names until something breaks far away from where the mistake was made.

TypeScript gives every array an **element type**. `number[]` is an array whose elements are all numbers; `User[]` is an array of `User` objects. With that one piece of information, the compiler checks every value you add, knows the type of every element you read, and carries the element type through chains such as `users.filter(...).map(...)`, so the result is typed too. You get the checking without writing types on every intermediate step.

This lesson covers how to write array types, how they behave with the built-in methods, and two closely related ideas that each have their own section: **readonly arrays**, which let a function promise not to modify an array it is given, and **array type inference**, the rules the compiler uses when you do not annotate. Fixed-length arrays with a type per position are **tuples**, covered next in [[b2-tuples]].

## Before you start

- **JavaScript arrays and their methods** — `push`, `map`, `filter`, `reduce`, `find`, and which ones mutate. See [[b1-array-basics]], [[b1-array-map-filter-reduce]] and [[b1-array-mutation]].
- **Type annotations and inference** — writing `x: number` versus letting the compiler work it out. See [[b2-type-annotations]] and [[b2-type-inference]].
- **Union types** — `string | number`. See [[b2-unions]].
- **`null` and `undefined` in TypeScript** — you will see `T | undefined` from `find`. See [[b2-null-undefined-ts]].

Examples were compiled with TypeScript 6.0 (`tsc --strict`, `lib` set to ES2023) and run with Node.js 22.

## The intuition

Think of an egg carton. It does not matter whether it holds six eggs or twelve, or which slot you look in — every slot holds an egg. Knowing "this is an egg carton" tells you what you will find in any slot, and tells you that a tennis ball does not belong there.

An array type is that kind of container description: **any length, every element the same type**. `string[]` says nothing about how many strings there are, only that each element is a string. That is the difference from a tuple, which is more like a lunchbox with a sandwich compartment and a fruit compartment: fixed slots, each with its own type.

The analogy has one important limit. An egg carton cannot have an empty slot that still claims to hold an egg, but a TypeScript array can: by default, `names[5]` on a two-element array is typed `string` and evaluates to `undefined`. You will see how to close that gap below.

## Writing array types

There are two equivalent spellings:

```typescript title="basics.ts"
const prices: number[] = [10, 4.5, 12];
const names: Array<string> = ["Ada", "Lin"];

const total = prices.reduce((sum, p) => sum + p, 0);   // number
const labels = prices.map((p) => `$${p.toFixed(2)}`);  // string[]
const first = names[0];              // string (not string | undefined)
const missing = names[5];            // also string, but undefined at runtime

console.log(total, labels, first, missing);
```

```output
26.5 [ '$10.00', '$4.50', '$12.00' ] Ada undefined
```

`number[]` and `Array<number>` mean exactly the same thing. `Array<T>` is the generic interface that describes JavaScript's `Array` ([[b2-generics]]), and `T[]` is shorthand for it. Most style guides prefer `T[]` for simple element types and `Array<T>` when the element type is long or is itself a union; pick one and be consistent.

The element type flows through the methods. `reduce` with a starting value of `0` returns a `number`. `map` returns an array of whatever its callback returns, so `labels` is `string[]` without any annotation. Inside the callbacks, `p` is known to be a `number`, which is why `p.toFixed(2)` is allowed.

Adding a value of the wrong type is caught where it happens:

```typescript title="push.ts"
const prices: number[] = [10, 4.5, 12];
prices.push("free");
```

```output
push.ts(2,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Arrays of unions, objects and arrays

When elements can be one of several types, put the union in parentheses. The parentheses matter, because `[]` binds more tightly than `|`:

```typescript title="shapes.ts"
let mixed: (string | number)[] = ["a", 1, "b", 2];
let either: string[] | number[] = ["a", "b"];
let oops: string | number[] = [1, 2];
oops = "text";
either = [1, 2];
either = ["a", 1];
const grid: number[][] = [[1, 2], [3, 4]];
grid[0].push(5);
console.log(mixed, either, oops, grid);
```

```output
shapes.ts(6,1): error TS2322: Type '(string | number)[]' is not assignable to type 'string[] | number[]'.
  Type '(string | number)[]' is not assignable to type 'string[]'.
    Type 'string | number' is not assignable to type 'string'.
      Type 'number' is not assignable to type 'string'.
```

Three different types appear here, and confusing them is a classic mistake:

- `(string | number)[]` — **one array whose elements may be mixed**.
- `string[] | number[]` — **either an all-strings array or an all-numbers array**, never mixed. That is why line 6 fails.
- `string | number[]` — **either a single string or an array of numbers**. The `[]` applied only to `number`. This is usually a typo for the first form.

Arrays of objects are written with an interface or type alias as the element type: `User[]`, or inline as `{ id: number; name: string }[]` (prefer a named type once it is used in more than one place). Nested arrays are arrays of arrays: `number[][]` is a grid, and `grid[0]` is a `number[]`.

### Reading elements: the out-of-range gap

Look again at `const missing = names[5]` in the first example. Its type is `string`, but its value is `undefined`. TypeScript does not track array lengths, so by default it assumes every index read finds an element. This is a deliberate trade-off: most index reads are inside loops that already check the bounds, and flagging every one would be noisy.

The compiler option **`noUncheckedIndexedAccess`** (TypeScript 4.1+, not part of `strict`) closes the gap by typing every index read as `T | undefined`. With it, `names[5]` is `string | undefined` and must be narrowed before use. `for...of` loops and methods like `map` and `forEach` are unaffected because they only visit existing elements. [[b2-strict-null-checks]] discusses the flag alongside the other absence checks.

## How array methods keep their types

The standard library's declarations for `Array<T>` are generic, so each method's result type is computed from `T` and from your callback.

```typescript title="methods.ts"
const raw: (string | null)[] = ["ada", null, "lin", null];

const present = raw.filter((x) => x !== null);        // string[] (TS 5.5+)
const upper = present.map((s) => s.toUpperCase());

const lengths = raw.filter((x) => !!x);                // truthiness: not inferred
const n: string[] = lengths;

const found = present.find((s) => s.startsWith("l"));  // string | undefined
console.log(upper, found);
```

```output
methods.ts(7,7): error TS2322: Type '(string | null)[]' is not assignable to type 'string[]'.
  Type 'string | null' is not assignable to type 'string'.
    Type 'null' is not assignable to type 'string'.
```

When run, the program prints `[ 'ADA', 'LIN' ] lin`.

**`map`** returns `U[]`, where `U` is the callback's return type.

**`filter`** normally returns the same type it started with — the compiler cannot generally know what your callback removed. There is one exception. If the callback is a **type predicate** (`(x): x is string => …`), `filter` returns the narrowed type. Since **TypeScript 5.5**, the compiler *infers* a type predicate for simple callbacks like `x => x !== null`, so `present` is `string[]` without any annotation. On earlier versions, the same line gives `(string | null)[]`, and you had to write `.filter((x): x is string => x !== null)`.

Why is `x => !!x` not inferred the same way? A type predicate must hold in both directions: when the callback returns `false`, the value must *not* be a `string`. But `!!""` is `false` for the empty string, which *is* a string, so the compiler correctly refuses to infer `x is string`. If you want to drop empty strings as well, that is fine at runtime, but write the predicate explicitly so the intent is visible.

**`find`** returns `T | undefined`, because nothing may match. **`findIndex`** returns `-1` when nothing matches, so its type is plain `number` and the "not found" case is not tracked — compare with `-1` explicitly.

**`reduce`** infers its result type from the initial value. `reduce((sum, p) => sum + p, 0)` is a `number`. With an empty object or array as the starting value, write the type: `items.reduce<Record<string, number>>((acc, item) => …, {})`, otherwise the accumulator is typed `{}` and nothing can be added to it.

### Array.isArray and any[]

`Array.isArray(value)` narrows an `unknown` to `any[]`, because the library cannot know what the elements are. Treat the elements as unchecked and validate them before trusting them, as described in [[b2-unknown]].

Likewise, an explicit `any[]` (or `Array<any>`) removes element checking everywhere it flows:

```typescript title="any-array.ts"
const users: any[] = [{ name: "Ada" }];
const userNames = users.map((u) => u.nmae);   // any[], typo not caught
console.log(userNames);
```

```output
[ undefined ]
```

The typo `nmae` compiles because `u` is `any`. Give the array a real element type — `User[]` — and the compiler reports it. See [[b2-avoiding-any]].

## Readonly arrays {#b2-readonly-arrays}

A **readonly array** is an array type without any of the methods that change the array. It is written `readonly T[]` or `ReadonlyArray<T>`. You can read elements, check the length, loop over it and call non-mutating methods such as `map`, `filter`, `slice` and `concat`, but `push`, `pop`, `splice`, `sort`, `reverse` and index assignment are compile errors. Its job is to let a function promise "I will look at your array but not change it", and to have the compiler enforce that promise.

### What it forbids

```typescript title="average.ts"
function average(values: readonly number[]): number {
  values.push(0);                 // error: no push on readonly arrays
  values[0] = 1;                  // error: index is read-only
  values.sort();                  // error: sort mutates in place
  const sorted = values.toSorted((a, b) => a - b);   // fine: returns a new array
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

const scores = [90, 72, 85];      // number[]
console.log(average(scores));     // mutable → readonly: fine

const frozen: ReadonlyArray<number> = scores;
const back: number[] = frozen;    // readonly → mutable: error
```

```output
average.ts(2,10): error TS2339: Property 'push' does not exist on type 'readonly number[]'.
average.ts(3,3): error TS2542: Index signature in type 'readonly number[]' only permits reading.
average.ts(4,10): error TS2339: Property 'sort' does not exist on type 'readonly number[]'.
average.ts(13,7): error TS4104: The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
```

`ReadonlyArray<T>` is a separate interface in the standard library that simply does not declare the mutating methods, which is why the error says "Property 'push' does not exist" rather than "is not allowed". `sort` is missing too: it sorts the array *in place*, which would change the caller's data. ES2023 added non-mutating versions — `toSorted`, `toReversed`, `toSpliced` and `with(index, value)` — which return a new array and are available on readonly arrays. They need `lib` set to ES2023 or later and a runtime that supports them (Node.js 20+, current browsers).

### The direction of assignment

Line 10 passes an ordinary `number[]` to a function that takes `readonly number[]`, and that is allowed. Line 13 tries the reverse and fails. The reasoning is about what each side can do:

- A `number[]` has every method a `readonly number[]` has, plus the mutating ones. Treating it as readonly just hides some abilities — always safe.
- Treating a `readonly number[]` as a `number[]` would unlock `push` and `sort` on data that someone promised not to change. So the compiler forbids it.

This is why `readonly` in **parameters** is so useful: it costs callers nothing. Every caller can pass a normal array, and the function body is prevented from mutating it. The converse matters too — if a function takes `string[]` (mutable), callers holding a `readonly string[]` cannot call it at all, so library and utility functions that do not mutate should accept `readonly` arrays to stay usable.

### Readonly is shallow, and only at compile time

Two limits are essential to understand:

```typescript title="limits.ts"
const team: readonly { name: string }[] = [{ name: "Ada" }];
team[0].name = "Lin";             // allowed: readonly is shallow
const view: readonly number[] = [1, 2, 3];
(view as number[]).push(4);       // compiles; mutates at runtime
console.log(team, view);
```

```output
[ { name: 'Lin' } ] [ 1, 2, 3, 4 ]
```

**It is shallow.** `readonly` protects the array — its slots and its length — not the objects inside it. `team[0].name` is still writable. To protect the elements as well, make the element type readonly too: `readonly Readonly<User>[]` ([[b2-readonly-utility]]), or use `as const` on a literal, which makes everything readonly all the way down (see [[b2-readonly-tuples]]).

**It is erased.** Like all types, `readonly` disappears in the emitted JavaScript. A type assertion, an `any`, or plain JavaScript code can still mutate the array. If you need runtime protection, `Object.freeze(array)` makes the array itself immutable (`push` throws a `TypeError`; an index assignment throws in strict-mode code and is silently ignored otherwise), and TypeScript types its result as `readonly T[]`. `Object.freeze` is also shallow. See [[b1-object-freeze-seal]].

One syntax rule: the `readonly` keyword works only directly on array and tuple type syntax. `readonly Array<string>` is an error (TS1354); write `ReadonlyArray<string>` or `readonly string[]`.

### When to use readonly arrays

- **Function parameters** that are only read — the most valuable use, because it is free for callers.
- **Data you hand out** from a module or a store, so consumers cannot change shared state behind your back. React state and Redux state are expected to be replaced, never mutated, and readonly types make accidental `state.items.push(...)` a compile error.
- **Constants** such as lists of allowed values, usually with `as const`.

Keep mutable arrays where you build a result locally — a function that creates an array and pushes into it before returning it does not need `readonly` internally, though it can return it as `readonly` if callers should not modify it.

## Array type inference {#b2-array-inference}

**Array type inference** is how TypeScript decides an array's type when you do not write one. For an array literal such as `[1, "two"]`, the compiler looks at every element and picks an element type that covers all of them. The rules are short, but a few of their consequences — the `never[]` empty array, widened literals, union element types — surprise almost everyone at first.

### Literals: the union of the element types

```typescript title="inference.ts"
const nums = [1, 2, 3];                    // number[]
const mixed = [1, "two", true];            // (string | number | boolean)[]
const maybe = ["a", null];                 // (string | null)[]
const points = [{ x: 1 }, { x: 2, y: 3 }]; // ({ x: number; y?: undefined } | { x: number; y: number })[]
const literal = [1, 2] as const;           // readonly [1, 2]
```

These comments show the types the compiler reports. The rules behind them:

1. **The element type is the union of each element's type** (the "best common type"). `[1, "two", true]` becomes `(string | number | boolean)[]`. The compiler does not search for a shared supertype that you did not mention: an array containing a `Dog` and a `Cat` is `(Dog | Cat)[]`, not `Animal[]`, unless you annotate it.
2. **Literal types are widened.** Even in a `const`, the elements of a mutable array can be replaced later, so `[1, 2, 3]` is `number[]`, not `(1 | 2 | 3)[]`. The `const` protects the variable, not the array's contents.
3. **Object literals are normalised.** When elements are object literals with different properties, the compiler adds the missing properties as optional `undefined` to each member, as in `points`. That lets you read `p.y` on any element and get `number | undefined` instead of an error.
4. **`as const` switches widening off.** It infers the narrowest possible type: a readonly tuple of literal types, `readonly [1, 2]`. That is the subject of [[b2-readonly-tuples]] and [[b2-as-const]].

### Empty arrays

An empty literal gives the compiler nothing to infer from, and the result depends on where it appears.

```typescript title="empty.ts"
let evolving = [];                         // evolving array
evolving.push(1);
evolving.push("x");
const snapshot = evolving;                 // (string | number)[]

const box = { items: [] };                 // items: never[]
box.items.push("a");

const ids: string[] = [];                  // annotate empty arrays
ids.push("u1");
```

```output
empty.ts(7,16): error TS2345: Argument of type '"a"' is not assignable to parameter of type 'never'.
```

**A variable initialised with `[]`** (under `noImplicitAny`) becomes an **evolving array**: the compiler watches what you push and widens the type as it goes. After the two pushes, `evolving` is `(string | number)[]`. This is convenient inside a single function, but if the compiler cannot see all the pushes — for example because the variable is captured in another function — it reports that the variable implicitly has type `any[]` (TS7034).

**An empty array as a property of an object literal** is not evolving. Its element type is `never` — the type with no values (see [[b2-never]]) — so `never[]` is an array you can never add anything to. That is the `box.items` error. It is one of the most common "where did `never` come from?" moments.

**The fix for both** is to annotate: `const ids: string[] = []`, `{ items: [] as string[] }`, or `new Array<number>()`. An empty array is the one place where an annotation is almost always the right choice.

### Context flows in from outside

Inference also works in the other direction: when the compiler already **expects** an array type — from a variable annotation, a parameter type or a return type — it uses that expectation to type the literal. This is **contextual typing**.

```typescript
const listeners: Array<(e: { button: number }) => void> = [
  (e) => console.log(e.button),    // e is known from the annotation
];
```

The arrow function's parameter `e` has no annotation, but the compiler knows it from the array's declared element type. The same happens when you pass `[]` straight to a function that takes `string[]`: the literal is checked as `string[]`, not `never[]`.

### Keeping literal types without losing checking

Widening becomes a problem when you need the literal types — a list of routes whose `method` must be `"GET"` or `"POST"`, for example:

```typescript title="routes.ts"
type Route = { path: string; method: "GET" | "POST" };
const routes = [
  { path: "/users", method: "GET" },
  { path: "/users", method: "POST" },
] satisfies Route[];
const routesPlain = [{ path: "/users", method: "GET" }];
function register(r: Route[]) {}
register(routes);
register(routesPlain);
```

```output
routes.ts(9,10): error TS2345: Argument of type '{ path: string; method: string; }[]' is not assignable to parameter of type 'Route[]'.
```

In `routesPlain`, `method: "GET"` was widened to `string`, so it no longer fits `Route`. In `routes`, the **`satisfies`** operator (TypeScript 4.9+) checks the literal against `Route[]` and uses that type as context, so `method` keeps its literal type, while the variable's own type stays the precise inferred one. Annotating `const routes: Route[] = …` would also work; `satisfies` is useful when you want the check *and* the more specific inferred type. See [[b2-satisfies]].

### When to annotate arrays

- **Empty arrays**: always, unless they are passed directly where the type is known.
- **Arrays whose element type is a domain type** (`User[]`) when the literal alone would infer something looser.
- **Function parameters and exported values**: yes, as with any public API ([[b2-when-explicit-vs-inferred]]).
- **Results of `map`, `filter`, `slice`**: no — inference is exact and an annotation only adds noise.

## How it works internally

At runtime there is no such thing as a `number[]`. TypeScript's array types are erased, and the program uses ordinary JavaScript arrays, which can hold any mix of values. All the checking you have seen happens in the compiler, using the declarations of `Array<T>` and `ReadonlyArray<T>` in the standard library files (`lib.es5.d.ts` and the later `lib.es20xx` files that add methods such as `toSorted`). Your `lib` setting decides which of those files are loaded, which is why `toSorted` is an error with an older `lib` even on a runtime that supports it.

TypeScript also treats arrays as **covariant**: a `Dog[]` is assignable to an `Animal[]`. For readonly arrays that is completely safe. For mutable arrays it is a known hole — a function receiving the `Animal[]` could push a `Cat` into what is really a `Dog[]`. TypeScript accepts this for practicality; it is another reason to type parameters as `readonly Animal[]` when the function only reads.

### Not the same as JavaScript's typed arrays

JavaScript has a family of built-in classes also called **typed arrays** — `Uint8Array`, `Int32Array`, `Float64Array` and others. They are something different: fixed-length views over raw binary memory in an `ArrayBuffer`, used for files, images, audio, WebGL and network protocols ([[b1-arraybuffer]]). Each element is a number of a specific machine size, and assigning `300` to a `Uint8Array` slot stores `44` (wrapped to 8 bits).

TypeScript has dedicated declarations for these classes. Since TypeScript 5.7 they are generic over their buffer type, so the compiler displays `new Uint8Array([72, 105])` as `Uint8Array<ArrayBuffer>`. Their element type is always `number` (or `bigint` for `BigInt64Array`), and they are not assignable to `number[]` because they lack methods such as `push`. When this curriculum says "typed arrays" in TypeScript, it means ordinary arrays with element types; the binary classes are a separate topic.

## Worked example: a cart summary

A small module for an online shop. The functions only read the cart, so they take `readonly` arrays; element types flow through every method chain.

```typescript title="cart.ts"
interface LineItem {
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
}

// readonly: these functions promise not to change the caller's cart
function subtotalCents(items: readonly LineItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

function topByValue(items: readonly LineItem[], count: number): LineItem[] {
  return items
    .toSorted((a, b) => b.priceCents * b.quantity - a.priceCents * a.quantity)
    .slice(0, count);
}

function skusOnSale(items: readonly LineItem[], sale: ReadonlySet<string>): string[] {
  return items.map((item) => item.sku).filter((sku) => sale.has(sku));
}

const cart: LineItem[] = [
  { sku: "TEA-01", name: "Green tea", priceCents: 450, quantity: 3 },
  { sku: "MUG-02", name: "Mug", priceCents: 1200, quantity: 1 },
  { sku: "PAN-07", name: "Teapot", priceCents: 3500, quantity: 1 },
];

console.log(subtotalCents(cart));
console.log(topByValue(cart, 2).map((item) => item.name));
console.log(skusOnSale(cart, new Set(["MUG-02", "PAN-07"])));
console.log(cart.map((item) => item.sku)); // original order unchanged
```

```output
6050
[ 'Teapot', 'Green tea' ]
[ 'MUG-02', 'PAN-07' ]
[ 'TEA-01', 'MUG-02', 'PAN-07' ]
```

Step by step:

1. `subtotalCents` uses `reduce` with initial value `0`, so the accumulator and result are `number`. Prices are stored in whole cents to avoid floating-point rounding ([[b2-type-number]]).
2. `topByValue` needs sorted data. `items.sort(...)` would be a compile error on a `readonly` array — and rightly so, because it would reorder the caller's cart. `toSorted` returns a sorted copy. The last line proves the original order survived.
3. `skusOnSale` chains `map` (giving `string[]`) and `filter` (still `string[]`). `ReadonlySet` is the set equivalent of `ReadonlyArray`.
4. `cart` is a mutable `LineItem[]`, and passing it to the `readonly` parameters needs no conversion.

Edge cases: an empty cart gives `0` from `subtotalCents` because of the initial value (without one, `reduce` on an empty array throws a `TypeError`); asking `topByValue` for more items than exist returns all of them because `slice` stops at the end.

```quiz
Q: What is the type of `x` in `let x: string | number[]`?
- [ ] An array whose elements are strings or numbers
- [ ] Either an array of strings or an array of numbers
- [x] Either a single string or an array of numbers
- [ ] A syntax error
> `[]` binds tighter than `|`, so the array applies only to `number`. An array of mixed elements is `(string | number)[]`, and "all strings or all numbers" is `string[] | number[]`.

Q: A function only reads its `items` parameter. Why type it `readonly Item[]` rather than `Item[]`?
- [ ] It makes the array immutable at runtime
- [ ] It makes the function faster
- [x] Callers can still pass ordinary arrays, the body is prevented from mutating them, and callers holding readonly arrays can also call it
- [ ] Readonly arrays allow `sort` without copying
> Mutable arrays are assignable to readonly ones, so the change costs callers nothing. The protection is compile-time only — `readonly` is erased — and `sort` is not available on readonly arrays at all; use `toSorted`.

Q: What type does `const config = { tags: [] }` give to `config.tags` under strict settings?
- [ ] `any[]`
- [ ] `string[]`
- [x] `never[]`
- [ ] `unknown[]`
> An empty array literal inside an object literal has nothing to infer from, so its element type is `never` and nothing can be pushed. Only a variable initialised with `[]` becomes an evolving array. Annotate: `{ tags: [] as string[] }`.
```

## In real systems

**Component props.** React components receive lists as props, and those lists belong to the parent. Typing them `readonly Item[]` stops a child from sorting or pushing into its parent's state, a bug that causes stale renders because React compares references. See [[b2-react-component-props]].

**State management.** Redux Toolkit, Zustand and similar libraries expect state to be replaced rather than mutated. Readonly array types in state shapes make accidental mutation a compile error, complementing runtime tools such as Immer.

**API data.** Response types generated from OpenAPI or GraphQL describe lists as `T[]`; with `noUncheckedIndexedAccess`, code that reads `results[0]` must handle an empty result set, which is a common real-world edge case.

**Configuration lists.** Allowed values — supported locales, feature names, route tables — are declared once with `as const` or `satisfies`, so the compiler can derive union types from them and check every use.

## Trade-offs and alternatives

| Choice | Use when | Cost |
|---|---|---|
| `T[]` / `Array<T>` | You build or modify the array | Any holder can mutate it |
| `readonly T[]` | You only read it, or hand it to others | Need `toSorted`/spread to derive changed copies |
| Tuple `[A, B]` | Fixed length, a meaning per position | Less flexible; see [[b2-tuples]] |
| `Set<T>` | Uniqueness and fast membership checks | No index access or ordering methods; see [[b1-set-vs-array]] |
| `Record<K, T>` / `Map<K, T>` | Lookup by key | Not ordered by position |
| `noUncheckedIndexedAccess` | You index by position often and want safety | Extra checks in index-based loops |

## Common mistakes

> [!MISTAKE] Leaving empty arrays unannotated
> `const state = { items: [] }` gives `never[]`, and the first `push` fails with a confusing error about `never`. Write `items: [] as Item[]`, or annotate the whole object's type.

**Writing `string | number[]` for a mixed array.** You need `(string | number)[]`.

**Expecting `filter` to narrow every callback.** TypeScript 5.5+ infers predicates for simple checks such as `x !== null` or `typeof x === "string"`, but not for truthiness checks or complex logic. Write `(x): x is T => …` when inference does not happen, and remember older compilers infer nothing.

**Assuming `readonly` is deep or permanent.** It protects the array's slots and length, not the objects inside, and it disappears at runtime. Use `Readonly<T>` elements, `as const` or `Object.freeze` as needed.

**Using `sort` on data you do not own.** `sort` and `reverse` mutate in place. Use `toSorted`, `toReversed` or `[...items].sort(...)`.

**Trusting index reads.** `arr[i]` is typed `T` even when `i` is out of range. Check the length, use `at()` with a check, or enable `noUncheckedIndexedAccess`.

## Interview perspective

> [!INTERVIEW] T[] versus readonly T[]
> "Both describe the same JavaScript array at runtime. `readonly T[]` is a type without the mutating methods, so a function that takes it cannot push or sort. A normal array is assignable to it, but not the other way round, which makes it a free safety upgrade for parameters. It's shallow and compile-time only; for runtime immutability I'd use `Object.freeze`."

Questions to prepare:

- **`T[]` versus `Array<T>`?** Identical; style only.
- **What is the inferred type of `[]`?** Evolving `any[]` for a variable under `noImplicitAny`; `never[]` inside an object literal; whatever the context says when contextually typed.
- **How do you get a union of literals from an array of strings?** `as const`, then `(typeof arr)[number]` — covered in [[b2-readonly-tuples]].
- **Why doesn't `filter(Boolean)` narrow?** `Boolean` is not a type predicate, and a truthiness check cannot prove the negative case; use an explicit predicate.
- **Are arrays covariant in TypeScript?** Yes, which is unsound for mutable arrays; readonly parameters avoid the problem.

## Practice

1. **Fix the types.** Annotate `const matrix = []` so it can hold rows of numbers, then write `transpose(m: readonly (readonly number[])[]): number[][]`.
2. **Narrowing filter.** Given `(User | undefined)[]`, produce `User[]` with `filter`. Then write a version that also drops users with an empty `name` and explain why it needs an explicit predicate.
3. **Readonly API.** Write a `createTodoStore()` that keeps a private mutable array and exposes `getAll(): readonly Todo[]`. Show that a caller cannot `push` into the result, and show how a caller could still mutate a todo object — then prevent that too.
4. **Predict the inference.** Write down the inferred types of `[0, ""]`, `[[1], ["a"]]`, `[null]`, `{ list: [] }` and `["a", "b"] as const`, then check them by hovering in an editor.
5. **Typed reduce.** Use `reduce` to group `LineItem`s by the first three letters of their `sku` into a `Record<string, LineItem[]>`, with the generic argument written explicitly.

## Quick revision {#quick-revision}

- `T[]` and `Array<T>` are identical; elements may be any number, all of type `T`.
- `(A | B)[]` = mixed array; `A[] | B[]` = all-A or all-B; `A | B[]` = an A or an array of B.
- Index reads are typed `T` even out of range; `noUncheckedIndexedAccess` makes them `T | undefined`.
- `map` → callback's return type; `find` → `T | undefined`; `reduce` → type of the initial value; `filter` narrows only with a type predicate (inferred for simple checks since TS 5.5).
- `Array.isArray(unknown)` → `any[]`; `any[]` disables element checking.
- `readonly T[]` / `ReadonlyArray<T>`: no `push`, `pop`, `splice`, `sort`, `reverse` or index writes; use `toSorted`, `toReversed`, `toSpliced`, `with` (ES2023).
- Mutable → readonly is allowed; readonly → mutable is error TS4104. `readonly Array<T>` is invalid syntax.
- `readonly` is shallow and erased; `Object.freeze` is runtime (also shallow).
- Inference: union of element types, literals widened, object literals normalised with optional `undefined` properties; `as const` → readonly literal tuple.
- `let x = []` evolves; `{ items: [] }` → `never[]`; annotate empty arrays.
- `satisfies T[]` checks a literal while keeping precise literal types.
- `Uint8Array` and friends are binary JavaScript typed arrays, a different thing (`Uint8Array<ArrayBuffer>` since TS 5.7).

## Key takeaways {#key-takeaways}

- An array type describes every element, so the compiler checks additions and carries the element type through `map`, `filter`, `find` and `reduce` without extra annotations.
- Parentheses matter in union array types, and index reads are not bounds-checked unless you enable `noUncheckedIndexedAccess`.
- `readonly` arrays turn "this function does not modify your data" into a compiler-checked promise that costs callers nothing, but they are shallow and exist only at compile time.
- Array inference unions the element types and widens literals; empty arrays and literal-sensitive data are the places to annotate or use `as const` and `satisfies`.
- TypeScript's array types are erased — at runtime there are only JavaScript arrays — so data from outside still needs validation.
