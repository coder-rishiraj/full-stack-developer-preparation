---
summary: Function overloads let one JavaScript function present several distinct, precisely typed call shapes to its callers — for example returning a single item for an id and a list for no argument. You will learn how overload signatures and the implementation signature fit together, how TypeScript picks an overload, where overloads are unsafe, and when a union or generic is the better tool.
difficulty: intermediate
minutes: 40
objectives:
  - Write overload signatures with a compatible implementation signature and explain which one callers see
  - Trace how TypeScript resolves a call against a list of overloads and order overloads correctly
  - Explain why the implementation body is not checked against each overload, and limit the risk that creates
  - Choose between overloads, union parameters, optional parameters and generics for a given API
  - Type overloaded methods, constructors and function types, and predict what ReturnType reports for them
---

## Introduction

Some functions do different things depending on what you pass them. A repository's `find()` returns every user, while `find("u1")` returns one user or nothing. A date helper accepts either a `Date` object or a year, month and day. A `createElement("canvas")` call returns a canvas element, not just "some element".

You can type such a function with unions — `find(id?: string): User | User[] | undefined` — but then every caller receives the union and must check which case they got, even though the *arguments* already decided it. The type has lost the link between input and output.

**Function overloading** restores that link. You write several **overload signatures**, each describing one valid way to call the function and what it returns for that call, followed by a single **implementation** that handles all of them. Callers see only the overloads, so `find()` is typed `User[]` and `find("u1")` is typed `User | undefined`.

This is different from overloading in Java or C#, where each overload is a separate method and the compiler picks which one runs. JavaScript has exactly one function object per name, so TypeScript overloads are purely compile-time: several labels for one function. Understanding that is the key to using them safely.

## Before you start

- **Typed functions** — parameter and return annotations, optional and rest parameters, function types. See [[b2-typed-functions]].
- **Union types and narrowing** — the implementation of an overloaded function receives a union and narrows it with `typeof`, `Array.isArray` or `instanceof`. See [[b2-unions]] and [[b2-narrowing]].
- **Literal types** — overloads often key on string literals such as `"click"`. See [[b2-literal-types]].
- **Generics** (helpful, not required) — for the comparison at the end. See [[b2-generics]].

Examples use `"strict": true` and were checked with TypeScript 6.0; overload rules have been stable for many versions.

## The intuition

Picture a building with one room inside and several doors, each with its own sign: "Deliveries — returns a receipt", "Visitors — returns a badge". People outside choose a door by what they are carrying, and the sign tells them what they will leave with. Inside, one person handles everyone, looks at what arrived and acts accordingly.

The doors are the overload signatures; the room is the implementation. Two consequences follow, and both matter later. First, **people outside never see the room** — callers cannot call the implementation signature directly. Second, **nobody checks that the person inside honours each sign** — TypeScript checks the implementation against its own broad signature, not against each door's promise.

## The problem overloads solve

Start with a union-typed version and look at what callers get:

```typescript title="union-version.ts"
type User = { id: string; name: string };
const users: User[] = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Linus" },
];

function find(id?: string): User | User[] | undefined {
  return id === undefined ? users : users.find((u) => u.id === id);
}

const all = find();
console.log(all.length);
```

```output
union-version.ts(12,13): error TS18048: 'all' is possibly 'undefined'.
union-version.ts(12,17): error TS2339: Property 'length' does not exist on type 'User | User[]'.
2
```

The program works at runtime (it prints `2`), but the caller is forced to narrow a value whose shape the call already determined. Developers then reach for `as User[]`, which silences the compiler and also its ability to catch real mistakes.

## Writing overloads

Overloads are written as bodiless function declarations directly above the implementation:

```typescript title="find-overloads.ts"
type User = { id: string; name: string };
const users: User[] = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Linus" },
];

// Overload signatures: what callers see.
function find(): User[];
function find(id: string): User | undefined;
// Implementation signature: hidden from callers, must cover every overload.
function find(id?: string): User[] | User | undefined {
  if (id === undefined) return users;
  return users.find((u) => u.id === id);
}

const all = find();       // User[]
const one = find("u2");   // User | undefined
console.log(all.length, one?.name);
```

```output
2 Linus
```

There are three parts:

1. **Overload signatures** — `function find(): User[];` and `function find(id: string): User | undefined;`. They have no body and end with a semicolon. Each is one door.
2. **Implementation signature** — the parameter list and return type of the declaration that has a body. It must be general enough to accept every overload's arguments and return every overload's result.
3. **Implementation body** — ordinary code that narrows the parameters to work out which call shape it received.

All declarations must be adjacent, share the same name, and have the same modifiers (all `export`, or none). The overload signatures and the implementation compile to one function; the overload signatures vanish in the emitted JavaScript.

### Callers cannot use the implementation signature

The implementation signature is **not** one of the call shapes. A call that matches only the implementation is rejected:

```typescript title="hidden-impl.ts"
function len(s: string): number;
function len(arr: unknown[]): number;
function len(x: string | unknown[]): number {
  return x.length;
}

console.log(len("abc"), len([1, 2]));

const input: string | unknown[] = Math.random() > 2 ? "abc" : [1];
console.log(len(input));
```

```output
hidden-impl.ts(10,17): error TS2769: No overload matches this call.
3 2
1
```

`input` has the type `string | unknown[]`. Each overload accepts one half of that union but neither accepts the whole thing, and the implementation signature — which would — is invisible. This is the most common surprise with overloads. If callers legitimately pass the union, add an overload for it (`function len(x: string | unknown[]): number;`), or, better, drop the overloads, because a single union signature already says everything here. (The odd `Math.random() > 2` is there only to stop TypeScript narrowing `input` to the array type from its initialiser.)

### The implementation must be compatible with every overload

Each overload has to be assignable to the implementation signature, so the implementation can actually receive those arguments and produce those results:

```typescript title="incompatible.ts"
function toText(value: number): string;
function toText(value: boolean): string;
function toText(value: number): string {
  return String(value);
}
```

```output
incompatible.ts(2,10): error TS2394: This overload signature is not compatible with its implementation signature.
```

The second overload promises to accept a `boolean`, but the implementation only takes `number`. Widening the implementation parameter to `number | boolean` fixes it.

## How TypeScript chooses an overload

For each call, the checker walks the overload list **from top to bottom** and picks the **first** signature whose parameters accept the arguments. It does not look for the "best" match. That makes order significant: put more specific signatures first.

```typescript title="order.ts"
function parse(input: string): string;
function parse(input: "true" | "false"): boolean;
function parse(input: string): string | boolean {
  if (input === "true" || input === "false") return input === "true";
  return input.trim();
}

const flag = parse("true");
const flagIsBoolean: boolean = flag;
```

```output
order.ts(9,7): error TS2322: Type 'string' is not assignable to type 'boolean'.
```

`"true"` is a `string`, so the first overload matches and `flag` is typed `string` — even though at runtime it is the boolean `true`. The literal overload below it can never be chosen. Swapping the two overload signatures fixes both the type of `flag` and the error.

When no overload matches, the error is TS2769, "No overload matches this call", followed by indented lines such as "Overload 1 of 2, '(s: string): number', gave the following error", explaining why each candidate was rejected (the lesson's output blocks show only the first line of each error). Reading those reasons is the fastest way to see what the caller got wrong.

### Overloads keyed on literal types

A very common pattern is to switch the return or callback type on a string literal. The DOM's own `addEventListener` and `createElement` work this way (through overloads combined with a map type). A cut-down version:

```typescript title="literal-overloads.ts"
type ClickEvent = { kind: "click"; x: number; y: number };
type KeyEvent = { kind: "key"; key: string };

function on(event: "click", handler: (e: ClickEvent) => void): void;
function on(event: "key", handler: (e: KeyEvent) => void): void;
function on(event: "click" | "key", handler: (e: any) => void): void {
  const sample = event === "click" ? { kind: "click", x: 10, y: 20 } : { kind: "key", key: "Enter" };
  handler(sample);
}

on("click", (e) => console.log(`clicked at ${e.x},${e.y}`));
on("key", (e) => console.log(`pressed ${e.key}`));
```

```output
clicked at 10,20
pressed Enter
```

Each handler's parameter is contextually typed from the overload chosen by the first argument, so `e.x` is checked in the first call and `e.key` in the second. Notice the `any` in the implementation's `handler` parameter. The implementation has to accept both handler types at once; a union of the two function types would be impossible to call safely without extra narrowing. Using `any` *inside the implementation signature only* is a common, accepted compromise — callers never see it — but it is exactly where type safety ends, which leads to the next point.

## Where overloads are unsafe

TypeScript checks the implementation body against the **implementation signature only**. It does not check that, for the arguments of a given overload, the body returns what that overload promises:

```typescript title="unsound.ts"
function double(x: number): number;
function double(x: string): string;
function double(x: number | string): number | string {
  // Bug: the branches are swapped. TypeScript does not notice.
  return typeof x === "number" ? String(x * 2) : Number(x) * 2;
}

const n = double(21);
console.log(typeof n, n);
```

```output
string 42
```

`n` is typed `number` by the first overload but is actually the string `"42"`. The compiler accepted the body because `string` and `number` are both inside the implementation's return union `number | string`. This is the price of overloads: they move a correctness obligation from the compiler to you.

You can reduce the risk:

- **Keep implementations short** and branch clearly, one branch per overload.
- **Test each overload** at runtime, because the type checker will not.
- **Prefer a narrower implementation return type** where possible, so fewer mistakes fit inside it.
- **Do not use overloads when a union or generic expresses the same thing**; those are checked fully.

> [!WARNING] Overloads are trusted, not verified
> The overload list is a promise to callers that the compiler does not verify against the body. Treat each overload like a type assertion: correct only if you made it correct.

## Overloads versus the alternatives

The TypeScript handbook gives a clear rule: **prefer a parameter with a union type over overloads when possible.** Overloads earn their place only when the *return type* (or another parameter's type) depends on which form of an argument was passed.

| Situation | Better tool | Example |
|---|---|---|
| Accepts several input types, return type is the same | Union parameter | `len(x: string \| unknown[]): number` |
| Trailing argument may be omitted, same return type | Optional or default parameter | `greet(name: string, greeting = "Hi")` |
| Output type equals or derives from input type | Generic | `first<T>(items: T[]): T \| undefined` |
| Return type depends on a literal key, from a lookup table | Generic with an indexed access | `get<K extends keyof Config>(key: K): Config[K]` |
| A small, fixed set of genuinely different call shapes with different results | Overloads | `find(): User[]` / `find(id): User \| undefined` |

Here is the generic alternative to `on` above, driven by a map type. It needs no overload per event and is checked fully at the call site:

```typescript title="generic-alternative.ts"
type EventMap = {
  click: { x: number; y: number };
  key: { key: string };
};

function listen<K extends keyof EventMap>(event: K, handler: (e: EventMap[K]) => void) {
  console.log(`listening for ${event}`);
}

listen("click", (e) => console.log(e.x));
listen("key", (e) => console.log(e.key));
```

```output
listening for click
listening for key
```

Adding an event means adding one line to `EventMap`, not a new overload. This scales much better, and it is how `lib.dom.d.ts` types `addEventListener` for known event names — with a final general overload for arbitrary strings.

Generics with **conditional return types** (`T extends string ? string : number`) can also replace overloads, but the implementation then usually needs type assertions, because TypeScript cannot check a body against an unresolved conditional type. That reintroduces the same unsoundness as overloads, with harder-to-read signatures; for two or three cases, overloads are often clearer. See [[b2-conditional-types]].

## Overloads in methods, constructors and function types

**Methods** in classes are overloaded the same way: several bodiless method signatures followed by one implementation.

**Constructors** can be overloaded too, which lets a class be created from different inputs:

```typescript title="ctor-overloads.ts"
class Money {
  readonly cents: number;

  constructor(cents: number);
  constructor(amount: string);
  constructor(value: number | string) {
    this.cents = typeof value === "number" ? value : Math.round(parseFloat(value) * 100);
  }

  toString(): string {
    return `$${(this.cents / 100).toFixed(2)}`;
  }
}

console.log(new Money(1999).toString(), new Money("4.5").toString());
```

```output
$19.99 $4.50
```

**Function types** can hold several call signatures, which is how you describe an overloaded function as a value:

```typescript title="overloaded-type.ts"
type Formatter = {
  (value: number): string;
  (value: Date): string;
};

const format: Formatter = (value: number | Date) =>
  typeof value === "number" ? value.toFixed(2) : value.toISOString().slice(0, 10);

console.log(format(3.14159), format(new Date(Date.UTC(2024, 0, 15))));
```

```output
3.14 2024-01-15
```

This works because both signatures return `string`. If the signatures had *different* return types, a single arrow function could not be assigned to the type without an assertion (or `any` in its parameters), because one function body cannot be checked against several return types. That is why overloaded functions are almost always written as `function` declarations, not arrows.

Interfaces can also declare overloaded methods, and two declarations of the same method in merged interfaces become overloads — later declarations are placed *first*. See [[b2-declaration-merging]].

## How it works internally

At emit time, `tsc` deletes every overload signature and keeps only the implementation. So this:

```typescript
function find(): User[];
function find(id: string): User | undefined;
function find(id?: string) { /* ... */ }
```

becomes a single ordinary JavaScript function `function find(id) { /* ... */ }`. There is no runtime dispatch, no name mangling and no cost.

At check time, a call is resolved in two passes. TypeScript first tries overloads while ignoring context-sensitive arguments (such as unannotated arrow functions), so that it can pick a signature by the plain arguments; then it checks the callbacks against the chosen signature. That is why, in `on("click", (e) => ...)`, the first argument chooses the overload and the overload then types `e`.

When you ask the type system *about* an overloaded function, it usually uses only the **last** overload. Utilities like `ReturnType` and `Parameters`, which work by inferring from a function type, cannot pick an overload because there is no call to resolve:

```typescript title="returntype-overloads.ts"
function pick(): string[];
function pick(index: number): string;
function pick(index?: number): string | string[] {
  const all = ["a", "b"];
  return index === undefined ? all : all[index];
}

type R = ReturnType<typeof pick>;
const r: R = ["a"];
```

```output
returntype-overloads.ts(9,7): error TS2322: Type 'string[]' is not assignable to type 'string'.
```

`R` is `string` — from `pick(index: number): string`, the last overload — not `string | string[]`. If code elsewhere derives types from your function, put the most general overload last.

## Worked example: a typed config reader

A settings module needs three ways to read values: everything at once, one key, or one key with a fallback. Two of these could use a generic; the fallback overload shows how overloads can express "the result is never `undefined` when a default is given".

```typescript title="config.ts"
type Config = {
  theme: "light" | "dark";
  pageSize: number;
  betaFlags?: string[];
};

const stored: Config = { theme: "dark", pageSize: 25 };

function getSetting(): Readonly<Config>;
function getSetting<K extends keyof Config>(key: K): Config[K];
function getSetting<K extends keyof Config>(
  key: K,
  fallback: NonNullable<Config[K]>,
): NonNullable<Config[K]>;
function getSetting(key?: keyof Config, fallback?: unknown): unknown {
  if (key === undefined) return stored;
  return stored[key] ?? fallback;
}

const all = getSetting();
const theme = getSetting("theme");
const flagsMaybe = getSetting("betaFlags");
const flags = getSetting("betaFlags", []);

console.log(all.pageSize, theme, flagsMaybe, flags.length);
```

```output
25 dark undefined 0
```

Walk through it:

- `getSetting()` matches the first overload and returns `Readonly<Config>`, so `all.pageSize` is a `number` and callers cannot accidentally mutate the stored object through it.
- `getSetting("theme")` skips the first overload (wrong argument count) and matches the second with `K` inferred as `"theme"`, so `theme` is `"light" | "dark"`.
- `getSetting("betaFlags")` also matches the second; the result is `string[] | undefined`, because the key is optional in `Config`.
- `getSetting("betaFlags", [])` matches the third, and `NonNullable` removes `undefined`, so `flags.length` compiles without a check. The fallback type is `string[]`, so `getSetting("pageSize", "x")` would be rejected.

The implementation uses `unknown` for the fallback and the return: it only has to be compatible with the three overloads. Its body is tiny, which is the main defence against the unsoundness shown earlier. Edge case: if a stored value is `null` or `undefined`, `??` falls back; a stored `0` or `""` is kept, which `||` would have wrongly replaced.

## In real systems

- **The DOM library** uses overloads extensively: `document.createElement`, `querySelector` and `addEventListener` each have a generic, map-driven signature for known names and a broader overload for arbitrary strings.
- **`Array.prototype.reduce`** is overloaded so that `reduce((a, b) => a + b)` (no initial value) and `reduce((acc, x) => ..., initial)` type their accumulator differently.
- **Node.js APIs** such as `fs.readFile` are overloaded on the `encoding` option: with an encoding the callback receives a `string`, without one a `Buffer`.
- **Library authors** use overloads for ergonomic entry points — `axios.get(url)` versus `axios.get(url, config)`, or a `debounce(fn)` versus `debounce(fn, { leading: true })` that returns differently typed wrappers.
- **Application code** uses overloads far less. Most teams reach for unions, generics and options objects first and add overloads only where a call-shape-dependent return type significantly improves call sites.

## Common mistakes

**Ordering a general overload before a specific one.** The first match wins, so a `string` overload above a `"true" | "false"` overload hides it forever. Put the narrowest signatures first.

**Expecting the implementation signature to be callable.** Calls are checked only against the overloads. A union argument that spans two overloads fails with TS2769 unless an overload accepts the union.

**Writing overloads where a union would do.** If every overload returns the same type, replace them with one signature and a union parameter; it is shorter and fully checked.

**Trusting the body because it compiles.** The body is checked against the broad implementation signature only. Swapped branches or a wrong return still compile. Test each overload.

**Leaking `any` to callers.** Using `any` in the implementation signature is acceptable because callers cannot see it; using it in an overload signature is not, because that is the public API.

**Exporting only some declarations.** All overloads and the implementation must share the same `export` (and `async`, `static`, access) modifiers; mixing them is an error.

**Deriving types from an overloaded function and getting the wrong one.** `ReturnType` and `Parameters` read the last overload. Put the most general signature last, or define the types explicitly.

## Interview perspective

**"How do TypeScript overloads differ from Java overloads?"** Java compiles each overload to a separate method and selects one at compile time; TypeScript has one runtime function with several compile-time signatures, and the implementation must branch on its arguments itself. Mention that overload signatures are erased.

**"Can a caller call the implementation signature?"** No. It is hidden; callers see only overload signatures. A strong answer explains the union-argument consequence and how to fix it.

**"How does TypeScript pick an overload?"** Top to bottom, first match wins, so order specific to general. Candidates who mention that callbacks are typed after the overload is chosen show deeper understanding.

**"Are overloads type-safe?"** Only at the call site. The body is not checked against each overload's return type, so overloads behave like trusted assertions. Unions and generics are checked fully, which is why the handbook says to prefer them.

**"How would you type a function that returns `string` for a `string` key and `number` for a `number` key?"** For two cases, overloads. For a growing set, a generic over a map type (`K extends keyof Map` returning `Map[K]`). Discussing why conditional return types need assertions in the body is a strong signal.

## Practice

1. Write overloads for `toArray(value: string): string[]` (split into characters) and `toArray(value: number): number[]` (the digits). Then call it with a `string | number` and fix the resulting error two ways.
2. Rewrite `function pad(value: string, width: number): string; function pad(value: string, width: number, char: string): string;` as a single signature. Explain why overloads were unnecessary.
3. Write a `createElement` function with overloads for `"input"` returning `{ tag: "input"; value: string }` and `"button"` returning `{ tag: "button"; onClick(): void }`, and a final general overload. Then rewrite it with a generic map type and compare the two.
4. Deliberately introduce a bug in one branch of an overloaded implementation and confirm that the compiler does not catch it. Write a small runtime test that does.
5. Given an overloaded function `load(): Item[]; load(id: string): Item;`, predict `ReturnType<typeof load>` and `Parameters<typeof load>`, then check your answer.

```quiz
Q: A function has overloads `f(x: string): string` and `f(x: number): number`, and an implementation `f(x: string | number)`. Why does `f(value)` fail when `value` is `string | number`?
- [ ] The implementation does not handle both types
- [x] Callers only see the overloads, and neither overload accepts the whole union
- [ ] Overloaded functions cannot be called with variables, only literals
- [ ] The overloads are in the wrong order
> The implementation signature is invisible to callers. Each overload accepts one member of the
> union, but no single overload accepts `string | number`, so resolution fails with TS2769.
> Adding an overload for the union, or replacing the overloads with a union signature, fixes it.
> Order does not matter here because neither overload matches.
```

```quiz
Q: Overloads are declared as `parse(input: string): string` followed by `parse(input: "true"): boolean`. What is the type of `parse("true")`?
- [x] `string`
- [ ] `boolean`
- [ ] `string | boolean`
- [ ] A compile error: the overloads conflict
> Overload resolution takes the first signature that accepts the arguments, and `"true"` is a
> `string`, so the first overload wins. The literal overload is unreachable. Put specific
> overloads above general ones; TypeScript does not search for the most specific match.
```

```quiz
Q: Which statement about an overloaded function's implementation body is true?
- [ ] It is checked separately against every overload signature
- [x] It is checked only against the implementation signature, so it can return a type that contradicts an overload
- [ ] It is not type-checked at all
- [ ] It must use `any` for all parameters
> The body is type-checked, but only against the broad implementation signature. If one branch
> returns a `string` where an overload promised `number`, it compiles as long as `string` fits
> the implementation's return type. That is why overloads need runtime tests and short bodies.
```

## Quick revision {#quick-revision}

- Overloads = several bodiless signatures + one implementation; all adjacent, same name and modifiers; erased at emit.
- Callers see only overload signatures; the implementation signature is hidden (union arguments spanning overloads → TS2769).
- Each overload must be compatible with the implementation signature (else TS2394).
- Resolution: top to bottom, first match wins → order specific before general.
- The body is checked only against the implementation signature → overloads are trusted promises; keep bodies short and test each overload.
- Prefer union parameters when the return type does not depend on the input; generics with map types when it does and cases may grow; overloads for a few distinct call shapes.
- Methods and constructors can be overloaded; function types hold multiple call signatures `{ (x: number): string; (x: Date): string }`.
- `ReturnType` / `Parameters` of an overloaded function use the last overload.
- `any` is acceptable in the implementation signature, never in an overload.

## Key takeaways {#key-takeaways}

- Overloads give one JavaScript function several precise call shapes, so return types can depend on which arguments were passed.
- Only the overload signatures are public; the implementation signature exists to be compatible with all of them and is invisible to callers.
- TypeScript picks the first overload that matches, so the order of signatures is part of the API.
- The compiler does not check the body against individual overloads, which makes overloads a trusted promise rather than a verified one.
- Reach for unions, optional parameters and generics first; use overloads when they make call sites clearly better and the set of shapes is small and stable.
