---
summary: A tuple is an array with a fixed shape — a known number of elements and a type for each position. You will learn how to write tuples with optional, rest and labelled elements, why functions that return pairs need a tuple annotation, how tuples type rest parameters, and when an object is the better choice.
difficulty: intermediate
minutes: 40
objectives:
  - Write tuple types with optional, rest and labelled elements and predict their length type
  - Explain why returning [a, b] from a function infers an array, and fix it with a tuple annotation
  - Use tuples to type rest parameters and recognise Parameters<T> and variadic tuple types
  - Narrow a union of tuples, including through destructuring
  - Choose between a tuple and an object for a given API
---

## Introduction

Sometimes an array is not a list of similar things but a small record whose meaning depends on position. A coordinate is `[x, y]`. React's `useState` returns `[value, setValue]`. A CSV row is `[name, quantity, price]`. `Object.entries` gives you `[key, value]` pairs. In each case, position 0 and position 1 mean different things and often have different types.

An ordinary array type cannot express that. `(string | number)[]` says "any number of elements, each a string or a number", so the compiler cannot tell you that position 0 is the name and position 1 is the quantity, and it cannot catch a row with four elements instead of three.

A **tuple type** can. `[string, number]` describes an array with **exactly two elements**, where the first is a `string` and the second is a `number`. The compiler checks the length on creation, knows the type at each index, and keeps those types when you destructure. Tuples exist only in the type system — at runtime they are ordinary JavaScript arrays — but they let you describe fixed-shape data precisely.

This lesson covers tuple syntax and its variations, how tuples interact with functions, and when to choose a tuple over an object. Readonly tuples and `as const` have their own lesson, [[b2-readonly-tuples]].

## Before you start

- **Array types** — `T[]`, element types, and how array methods are typed. See [[b2-typed-arrays]].
- **Destructuring** — `const [a, b] = arr`. See [[b1-destructuring]].
- **Rest and spread** — `...args` in parameters and `...arr` in calls. See [[b1-spread-rest]].
- **Union types and literal types** — `true | false`, `"ok" | "error"`. See [[b2-unions]] and [[b2-literal-types]].

Examples were compiled with TypeScript 6.0 (`tsc --strict`) and run with Node.js 22.

## The intuition

An array type is like a stack of identical trays — you can add or remove trays, and each one holds the same kind of thing. A tuple is like a bento box: a fixed number of compartments, and each compartment is meant for something specific. The rice compartment is always first; the fish is always second. Knowing the box layout tells you what is in compartment 2 without looking.

Where the analogy stops: a real bento box cannot grow a fourth compartment, but a JavaScript array typed as a tuple can, if code calls `push` on it. The type system does not fully prevent that, as you will see — which is one reason readonly tuples exist.

## Tuple basics

```typescript title="point.ts"
type Point = [number, number];

const start: Point = [0, 0];
const p: Point = [3, 4];
const [x, y] = p;                       // x: number, y: number
console.log(Math.hypot(x, y), p.length);

const tooLong: Point = [1, 2, 3];
const wrongType: Point = [1, "2"];
const z = p[2];
```

```output
point.ts(8,7): error TS2322: Type '[number, number, number]' is not assignable to type 'Point'.
  Source has 3 element(s) but target allows only 2.
point.ts(9,30): error TS2322: Type 'string' is not assignable to type 'number'.
point.ts(10,13): error TS2493: Tuple type 'Point' of length '2' has no element at index '2'.
```

When run, the program prints `5 2`.

The tuple type `[number, number]` is checked in three ways:

- **Length.** `[1, 2, 3]` has three elements and `Point` allows two. Unlike ordinary arrays, the compiler knows the length; `p.length` has the literal type `2`.
- **Type per position.** `[1, "2"]` has a string in position 1. The error points at the exact element (column 30).
- **Index access.** `p[2]` is an error, because a two-element tuple has no index 2. With a plain `number[]`, the same read would compile and give `undefined`.

**Destructuring** keeps the per-position types: `x` and `y` are both `number`. If the tuple were `[string, number]`, the first variable would be a `string` and the second a `number`. This is how `const [count, setCount] = useState(0)` gives `count` and `setCount` different types.

### Optional elements

A `?` after an element type makes that position optional. Optional elements must come after all required ones:

```typescript title="optional.ts"
type Entry = [key: string, value: number, note?: string];
const e1: Entry = ["a", 1];
const e2: Entry = ["b", 2, "two"];
type LenCheck = Entry["length"];   // 2 | 3
const lc: LenCheck = 4;
```

```output
optional.ts(5,7): error TS2322: Type '4' is not assignable to type '2 | 3'.
```

The length type is now `2 | 3`, and reading `e1[2]` gives `string | undefined`. This example also uses **labels**, explained next.

### Labelled elements

Since **TypeScript 4.0**, each element can carry a name: `[key: string, value: number]`. Labels are documentation only. They do not change the type, do not affect assignability (a `[x: number, y: number]` is the same type as `[a: number, b: number]`), and are erased in the JavaScript output. They do show up in editor tooltips and error messages, which makes `[min: number, max: number]` much easier to read than `[number, number]`. Before TypeScript 5.2, if one element was labelled, all had to be; since 5.2, labelled and unlabelled elements may be mixed, though labelling all of them reads better.

### Rest elements

A **rest element** `...T[]` inside a tuple means "zero or more elements of type `T` here":

```typescript title="rest.ts"
type Row = [id: number, ...tags: string[]];
const r1: Row = [1];
const r2: Row = [2, "new", "sale"];
type Path = [...dirs: string[], file: string];
const pth: Path = ["src", "lib", "index.ts"];
const last = pth[pth.length - 1];
```

`Row` is "a number, followed by any number of strings". Since **TypeScript 4.2**, the rest element may also appear at the start or in the middle, as in `Path` — any number of directory names, then exactly one file name. A tuple may contain at most one rest element, and an optional element cannot follow a rest element. A tuple with a rest element has a length type of `number`, since its length is no longer fixed, so `pth[pth.length - 1]` falls back to the element types (`string`).

## Tuples and functions

### Returning more than one value

The most common use of tuples in application code is returning two or more values from a function. Here a detail of inference trips almost everyone:

```typescript title="minmax.ts"
function minMaxLoose(values: number[]) {
  return [Math.min(...values), Math.max(...values)];    // number[]
}
function minMax(values: number[]): [min: number, max: number] {
  return [Math.min(...values), Math.max(...values)];
}

const [lo, hi] = minMax([4, 9, 1]);
console.log(lo, hi);

const loose = minMaxLoose([4, 9, 1]);
const third: number = loose[2];        // compiles, undefined at runtime
const strict = minMax([4, 9, 1]);
const bad = strict[2];                 // error: no element at index 2
console.log(third);
```

```output
minmax.ts(14,20): error TS2493: Tuple type '[min: number, max: number]' of length '2' has no element at index '2'.
```

When run, it prints `1 9` and then `undefined`.

**An array literal is inferred as an array, not a tuple.** `[Math.min(...), Math.max(...)]` in `minMaxLoose` becomes `number[]`, because arrays are far more common than tuples, and an array type allows `push` and other changes that a tuple would forbid. The consequence is that `loose[2]` compiles. When the two elements have different types, it is worse: `return [user, error]` would infer `(User | Error)[]`, and destructuring gives two variables of the union type, so neither can be used without a check.

The fix is to say what you mean. Annotate the return type as a tuple, as `minMax` does, or return `[a, b] as const`, which infers a readonly tuple (see [[b2-readonly-tuples]]). The annotation is usually better for exported functions, because it documents the contract and lets you add labels.

### Rest parameters are tuples

A function's parameter list *is* a tuple type, and TypeScript lets you treat it as one:

```typescript title="params.ts"
function createEvent(name: string, payload: object, urgent: boolean) {
  return { name, payload, urgent };
}
type EventArgs = Parameters<typeof createEvent>;
// [name: string, payload: object, urgent: boolean]

function log(...args: [message: string, level?: "info" | "warn"]) {
  const [message, level = "info"] = args;
  console.log(`[${level}] ${message}`);
}
log("started");
log("disk almost full", "warn");
```

```output
[info] started
[warn] disk almost full
```

The built-in utility **`Parameters<F>`** extracts a function's parameter list as a labelled tuple. It is useful for wrappers that forward arguments: `function logged(...args: Parameters<typeof createEvent>) { return createEvent(...args); }` stays correct when `createEvent` changes. ([[b2-parameters-type]] covers it.)

In the other direction, typing a rest parameter as a tuple, as `log` does, is exactly equivalent to writing `(message: string, level?: "info" | "warn")`. Callers see two parameters with those names. This becomes powerful with generics.

### Variadic tuple types

Since **TypeScript 4.0**, a spread in a tuple type can refer to a *generic* tuple. This lets you describe functions that combine argument lists without losing their types:

```typescript title="concat.ts"
function concat<A extends unknown[], B extends unknown[]>(a: A, b: B): [...A, ...B] {
  return [...a, ...b];
}
const head: [number, string] = [1, "x"];
const tail: [boolean] = [true];
const joined = concat(head, tail);     // [number, string, boolean]
```

The result type `[...A, ...B]` is built from the two input tuple types. Library authors use **variadic tuple types** to type `bind`, `pipe`, `curry`, and middleware that adds arguments in front of a handler's own. In application code you will mostly *consume* them rather than write them.

### Unions of tuples

A function that can succeed or fail is sometimes written Go-style, returning a pair. A union of tuples, with a literal type in the first position, describes it precisely:

```typescript title="result.ts"
type Result = [ok: true, value: number] | [ok: false, error: string];
function parse(text: string): Result {
  const n = Number(text);
  return Number.isNaN(n) ? [false, `not a number: ${text}`] : [true, n];
}
for (const input of ["42", "abc"]) {
  const [ok, data] = parse(input);
  if (ok) {
    console.log(data.toFixed(1));       // data: number
  } else {
    console.log(data.toUpperCase());    // data: string
  }
}
```

```output
42.0
NOT A NUMBER: ABC
```

This is a **discriminated union** whose discriminant is position 0 ([[b2-discriminated-unions]]). Since **TypeScript 4.6**, narrowing works even after destructuring: checking `ok` narrows `data`, as long as both were destructured from the same `const` declaration. On older versions you had to keep the tuple whole and check `result[0]`.

## How it works internally

At runtime, a tuple is a plain JavaScript array. There is no tuple object, no length check and no type per slot; the compiled output of `const p: Point = [3, 4]` is `const p = [3, 4]`.

In the type system, a tuple type is a special kind of array type. TypeScript represents `[string, number]` roughly as an `Array<string | number>` with three extras: numeric properties `"0"` and `"1"` with their own types, a `length` property with a literal type (`2`), and rules that check element count and order on assignment. That is why a tuple is assignable to an array of the union of its elements — `[string, number]` can be passed where `(string | number)[]` is expected — but not the other way round, since an arbitrary array does not guarantee the length or the per-position types.

It also explains the main soundness gap in tuples. Because a mutable tuple is still an `Array`, it inherits `push`, `pop` and `splice`, and the compiler allows them:

```typescript title="hole.ts"
const pair: [string, number] = ["a", 1];
pair.push(99);                         // compiles: mutating methods are allowed
console.log(pair, pair.length);
```

```output
[ 'a', 1, 99 ] 3
```

The type still says `length` is `2`; the runtime value has three elements. TypeScript accepts this gap to keep tuples compatible with arrays. The cure is a **readonly tuple** — `readonly [string, number]` has no `push` at all — which is one reason readonly tuples are recommended for values you return from functions. See [[b2-readonly-tuples]].

## Worked example: a state pair and typed CSV rows

This example combines the two most common tuple uses: a function that returns a `[getter, setter]` pair (the shape of React's `useState`, see [[b2-hooks-typing]]) and fixed-shape rows parsed from text.

```typescript title="orders.ts"
// A tiny state container shaped like React's useState.
function createState<T>(initial: T): [get: () => T, set: (next: T) => void] {
  let value = initial;
  const get = () => value;
  const set = (next: T) => {
    value = next;
  };
  return [get, set];
}

// One CSV row: product name, quantity, unit price in cents.
type OrderRow = [product: string, quantity: number, unitCents: number];

function parseRow(line: string): OrderRow | null {
  const [product, qty, price] = line.split(",");
  const quantity = Number(qty);
  const unitCents = Number(price);
  if (!product || !Number.isInteger(quantity) || !Number.isInteger(unitCents)) {
    return null;
  }
  return [product.trim(), quantity, unitCents];
}

const [getTotal, setTotal] = createState(0);
const csv = ["tea, 3, 450", "mug, 1, 1200", "broken line", "teapot, 1, 3500"];

for (const line of csv) {
  const row = parseRow(line);
  if (row === null) {
    console.log(`skipped: "${line}"`);
    continue;
  }
  const [product, quantity, unitCents] = row;
  setTotal(getTotal() + quantity * unitCents);
  console.log(`${product.padEnd(7)} x${quantity}  ${(unitCents / 100).toFixed(2)}`);
}
console.log(`total: ${(getTotal() / 100).toFixed(2)}`);
```

```output
tea     x3  4.50
mug     x1  12.00
skipped: "broken line"
teapot  x1  35.00
total: 60.50
```

Walking through it:

1. `createState` is generic. Calling it with `0` infers `T = number`, so the return type is `[get: () => number, set: (next: number) => void]`. Without the tuple annotation, the compiler infers an array type — here, surprisingly, `((next: number) => void)[]`, because `() => number` is assignable to `(next: number) => void` and the union collapses to that one member. Both destructured variables would then have the setter's type, so `getTotal()` would be an error (it expects an argument), and its result would be typed `void`.
2. Destructuring `[getTotal, setTotal]` gives each variable its own type, and the names are chosen by the caller — the reason React returns a tuple rather than an object.
3. `OrderRow` labels each position, so tooltips and errors say `quantity` rather than "element 1".
4. `parseRow` builds the tuple only after validating the text. `"broken line"` has no commas, so `qty` is `undefined`, `Number(undefined)` is `NaN`, and the row is rejected. `Number(" 3")` is `3`, because `Number` ignores surrounding whitespace.
5. Inside the loop, destructuring `row` gives a `string` and two `number`s, so `product.padEnd` and the arithmetic are all type-checked.

```quiz
Q: What type does TypeScript infer for `function f() { return ["id", 42]; }`?
- [ ] `[string, number]`
- [x] `(string | number)[]`
- [ ] `readonly ["id", 42]`
- [ ] `any[]`
> Array literals are inferred as arrays, not tuples, so the element type is the union of the elements. Annotate the return type as `[string, number]`, or write `return ["id", 42] as const` for a readonly literal tuple.

Q: Which statement about `type T = [a: string, b?: number]` is correct?
- [ ] The labels `a` and `b` exist at runtime as property names
- [x] `T["length"]` is `1 | 2`
- [ ] `["x", 1, 2]` is assignable to `T`
- [ ] The optional element may be placed before the required one
> An optional element makes the length either 1 or 2. Labels are compile-time documentation and are erased. Extra elements are rejected, and optional elements must follow all required ones.

Q: `const pair: [string, number] = ["a", 1]; pair.push(2);` — what happens?
- [ ] Compile error: tuples have no `push`
- [x] It compiles, and at runtime the array has three elements while the type still says length 2
- [ ] It throws a `TypeError` at runtime
- [ ] TypeScript converts the tuple to `(string | number)[]`
> A mutable tuple is still an Array type, so it inherits `push`. This is a known gap; `readonly [string, number]` removes `push` and closes it.
```

## In real systems

**React hooks.** `useState`, `useReducer` and many custom hooks return tuples so that callers can name the parts freely: `const [isOpen, setIsOpen] = useState(false)`. Custom hooks that return pairs should declare a tuple return type (often readonly), or callers get a union array.

**Entries and maps.** `Object.entries(obj)` returns `[string, T][]`, and `new Map(entries)` accepts `[K, V]` pairs. Converting between objects, maps and arrays of pairs is everyday code, and tuple types keep keys and values distinct.

**Function utilities.** `Parameters<F>`, `ConstructorParameters<C>` and variadic tuples are how libraries type wrappers, decorators, event emitters (`emit<E>(event: E, ...args: EventArgs[E])`) and middleware. See [[b2-utility-types]].

**Coordinates and ranges.** Graphics, maps and charts use `[x, y]`, `[lat, lng]` and `[start, end]`. Labels (`[lat: number, lng: number]`) prevent the classic swapped-coordinates bug from being invisible in tooltips — although the compiler still cannot tell two `number`s apart; for that, see [[b2-branded-types]].

## Trade-offs and alternatives

| Use a tuple when | Use an object when |
|---|---|
| There are two or three elements whose meaning is obvious from context | There are more than three fields, or the meaning is not obvious |
| Callers should choose their own names (`useState`) | Names should be the same everywhere |
| The data is naturally positional (coordinates, CSV rows, entries) | Fields may be added later — adding a key to an object does not break callers, inserting a tuple position does |
| You need to spread it into a function call | You want to read fields in any order |

Tuples are compact and destructure neatly, but `row[2]` says nothing to a reader, and two adjacent elements of the same type can be swapped without any compiler error. Objects are self-describing and easier to extend. A practical rule: tuples for small, short-lived, positional data and for APIs that benefit from caller-chosen names; objects for everything else.

## Common mistakes

> [!MISTAKE] Returning a pair without a tuple type
> `return [data, error]` infers a union array, and the caller's `const [data, error] = f()` gives both variables the union type. Annotate the return type as a tuple or use `as const`.

**Mutating a tuple.** `push`, `pop` and `splice` compile on mutable tuples and break the length the type promises. Use readonly tuples for values you hand out.

**Expecting labels to do anything at runtime.** Labels are erased; `pair.min` is not a property. If you want named access, use an object.

**Long tuples.** `[string, string, number, boolean, string]` is unreadable at the call site and easy to get out of order. Switch to an object once the meaning of a position is not obvious.

**Same-typed neighbours.** `[width: number, height: number]` will happily accept `[height, width]`. Labels help readers but not the compiler; consider an object or branded types when the order matters.

## Interview perspective

> [!INTERVIEW] Tuple versus array
> "An array type says 'any length, every element type T'. A tuple says 'exactly these positions with these types'. At runtime both are plain arrays. I use tuples for small positional data and for hook-style return values where callers choose names; for anything with more than two or three fields I prefer an object. One gotcha: an array literal is inferred as an array, so a function returning a pair needs a tuple return type or `as const`."

Questions to prepare:

- **Why does `useState` return a tuple and not an object?** So callers name the parts in destructuring without aliasing syntax.
- **How do you type a function returning two values of different types?** Tuple return annotation, possibly labelled and readonly; or `as const`.
- **What are variadic tuple types?** Generic spreads in tuple types (`[...A, ...B]`), used to type argument-forwarding functions.
- **What does `Parameters<typeof fn>` return?** The parameter list as a labelled tuple.
- **Are tuples sound?** Mostly; the main hole is mutating methods on mutable tuples.

## Practice

1. **Swap.** Write `swap<A, B>(pair: [A, B]): [B, A]` and check the types of `swap(["a", 1])`.
2. **Entries round trip.** Given `const prices = { tea: 450, mug: 1200 }`, use `Object.entries` to produce `[name: string, euros: string][]` with prices formatted as euros, then turn it into a `Map`.
3. **Range parsing.** Write `parseRange(text: string): [start: number, end: number] | null` for input like `"10-20"`, rejecting ranges where `start > end`.
4. **Forwarding wrapper.** Write `withTiming<F extends (...args: any[]) => unknown>(fn: F)` that returns a function with the same parameters (`Parameters<F>`) and logs how long each call took.
5. **Tuple or object?** For each of these, choose a tuple or an object and justify it: a hex colour split into RGB; an HTTP response with status, headers and body; a `useToggle` hook's return value; a database row with twelve columns.

## Quick revision {#quick-revision}

- `[A, B]` = exactly two elements, `A` at index 0, `B` at index 1; `length` is the literal `2`.
- Errors: wrong length (TS2322 "Source has 3 element(s)…"), wrong type per position, out-of-range index (TS2493).
- Optional elements `[A, B?]` → length `1 | 2`; must follow required ones.
- Labels `[x: number, y: number]` (TS 4.0+): documentation only, erased; may be mixed with unlabelled elements since TS 5.2.
- Rest elements `[A, ...B[]]`; leading/middle rest since TS 4.2; at most one rest; length becomes `number`.
- Array literals infer arrays, not tuples — annotate the return type or use `as const`.
- Parameter lists are tuples: `Parameters<F>`, `...args: [a: string, b?: number]`.
- Variadic tuple types `[...A, ...B]` (TS 4.0+) type argument-forwarding helpers.
- Unions of tuples narrow by a literal first element, even after destructuring (TS 4.6+).
- Runtime: plain arrays. Mutable tuples still allow `push` — use readonly tuples to close the gap.
- Prefer objects for more than ~3 fields or non-obvious positions.

## Key takeaways {#key-takeaways}

- A tuple fixes the length and the type of each position, so the compiler checks construction, index access and destructuring.
- Optional, rest and labelled elements make tuples flexible enough for parameter lists, rows and entries, while labels stay purely documentary.
- Functions that return several values need an explicit tuple type or `as const`, because literals are inferred as arrays.
- Tuples are ordinary arrays at runtime, and mutable tuples can still be pushed to; readonly tuples close that gap.
- Choose tuples for small positional data and caller-named results, and objects when names make the data clearer.
