---
summary: Type assertions tell the compiler to treat a value as a type it cannot prove — and they do nothing at runtime. You will learn when `as` is legitimate and when it hides bugs, how `as const` freezes literal types for configuration and unions, and how the non-null assertion `!` differs from real null checks.
difficulty: intermediate
minutes: 50
objectives:
  - Explain what a type assertion changes at compile time and why it has no runtime effect
  - Predict which assertions the compiler allows, and recognise the double assertion through unknown as a warning sign
  - Choose between an assertion, an annotation, narrowing, a type guard and satisfies for a given situation
  - Use as const to keep literal types, derive union types from values and create readonly tuples
  - Decide when the non-null assertion and the definite assignment assertion are justified, and replace them with safer code when they are not
---

## Introduction

Sometimes you know something about a value that TypeScript cannot work out. You know the element with id `email` on your page is an `<input>`; TypeScript only knows `getElementById` returns `HTMLElement | null`. You know a `Map` contains a key because you checked `has` one line earlier; TypeScript's analysis does not connect `has` to `get`. You know a string array of theme names should never change; TypeScript infers it as a mutable `string[]`.

A **type assertion** is how you tell the compiler "treat this value as this type". The main form is `value as Type`. Two specialised forms exist: `as const`, which tells the compiler to infer the narrowest, read-only type for a literal, and the postfix `!`, which tells it a value is neither `null` nor `undefined`.

All three share one crucial property: **they change only what the compiler believes, never what the program does.** No check, conversion or exception is emitted. If your belief is wrong, the program fails later at runtime, with a type error that the compiler would otherwise have caught. Assertions are therefore an escape hatch: necessary at a few boundaries (the DOM, untyped libraries, migration from JavaScript), and a code smell when they are used to quiet errors that point to real bugs.

## Before you start

- **Type inference and literal types** — how TypeScript infers `string` from `"dark"` and when it keeps the literal. See [[b2-type-inference]] and [[b2-literal-types]].
- **Unions and narrowing** — the safe alternative to most assertions. See [[b2-unions]] and [[b2-narrowing]].
- **`unknown` and `any`** — what each allows. See [[b2-special-types]].
- **`strictNullChecks`** — why `null` and `undefined` show up in types at all. See [[b2-strict-null-checks]].

Examples use `"strict": true` and TypeScript 6.0. `as const` exists since TypeScript 3.4 and `satisfies` since 4.9.

## The intuition

Imagine a warehouse scanner that reads each parcel's label and routes it. Usually it reads the label itself. A type assertion is a worker sticking a new label over the old one: "this box contains glassware". The scanner now routes the box as glassware — it does not open the box to check. If the worker was right, everything works and perhaps more smoothly than before. If the worker was wrong, the problem shows up at the far end of the line, when somebody unpacks bricks from a box marked fragile.

The analogy has one more useful part: the scanner refuses some relabelling outright. If a box is labelled "liquid, 20 litres", the worker cannot relabel it "envelope" — the two are too different to be a plausible correction. That is the compiler's **overlap rule**, covered below.

## Writing a type assertion

The syntax is `expression as Type`:

```typescript title="basic-as.ts"
type User = { id: number; name: string };

const raw = '{"id": 1, "name": "Ada"}';
const user = JSON.parse(raw) as User;

console.log(user.name.toUpperCase());
```

```output
ADA
```

`JSON.parse` returns `any`. Without the assertion, `user` would be `any` and every typo — `user.nmae` — would compile. With it, the rest of the code is checked against `User`. That is better than `any`, but notice what it is *not*: a check that the JSON really has that shape.

There is an older **angle-bracket** syntax, `<User>JSON.parse(raw)`, which means the same thing. It cannot be used in `.tsx` files because `<User>` looks like a JSX element, so most code bases use `as` everywhere. See [[b2-ts-vs-tsx]].

### Assertions do nothing at runtime

The emitted JavaScript for `basic-as.ts` is:

```javascript title="basic-as.js"
const raw = '{"id": 1, "name": "Ada"}';
const user = JSON.parse(raw);
console.log(user.name.toUpperCase());
```

The assertion has disappeared. So if the data does not match, the failure happens wherever the wrong assumption is first used:

```typescript title="wrong-assertion.ts"
type User = { id: number; name: string };

const user = JSON.parse('{"id": 1}') as User;
console.log(typeof user.name);
console.log(user.name.toUpperCase());
```

```output
undefined
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```

The compiler raised nothing; the assertion told it `name` was a `string`. This is the main danger of assertions on external data. The safe pattern is to treat external data as `unknown` and validate it — by hand with type guards, or with a schema library such as Zod — so that the type is *earned* by a check rather than declared. See [[b2-unknown]] and [[b2-custom-type-guards]].

> [!WARNING] An assertion is a promise you must keep
> TypeScript emits no check for `as`. Use it only where you have evidence the compiler cannot see, and never as a substitute for validating data from networks, storage, users or untyped libraries.

### Which assertions the compiler allows

An assertion from type `S` to type `T` is allowed when either type is assignable to the other — one is a **narrower or wider version** of the other. TypeScript calls this "sufficiently overlapping". Narrowing (`HTMLElement` to `HTMLInputElement`) and widening (`"dark"` to `string`) are both fine. Unrelated types are rejected:

```typescript title="overlap.ts"
const id = "42";
const asNumber = id as number;
const viaUnknown = id as unknown as number;

console.log(typeof viaUnknown, viaUnknown);
```

```output
overlap.ts(2,18): error TS2352: Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
string 42
```

The error message itself suggests the escape: asserting to `unknown` first (or `any`) is always allowed, because every type overlaps with `unknown`, and from `unknown` you can assert to anything. This **double assertion** compiles — and, as the output shows, `viaUnknown` is still the string `"42"` at runtime, even though the compiler now believes it is a `number`. An assertion never converts; for a real conversion use `Number(id)`.

Treat `as unknown as T` in code review as a red flag. It is occasionally needed (for example in tests that build partial mock objects, or when working around an incorrect library type), but each occurrence deserves a comment explaining why the types are wrong and why this value is nonetheless a `T`.

### Assertion versus annotation

An annotation (`const x: T = value`) asks the compiler to **check** that the value is a `T`. An assertion (`value as T`) asks it to **trust** you. The difference matters most for object literals:

```typescript title="assert-vs-annotate.ts"
type Settings = { theme: string; pageSize: number };

const annotated: Settings = { theme: "dark" };
const asserted = { theme: "dark" } as Settings;

console.log(asserted.pageSize.toFixed(0));
```

```output
assert-vs-annotate.ts(3,7): error TS2741: Property 'pageSize' is missing in type '{ theme: string; }' but required in type 'Settings'.
TypeError: Cannot read properties of undefined (reading 'toFixed')
```

The annotation catches the missing property. The assertion is allowed because `{ theme: string }` overlaps with `Settings` (a `Settings` is assignable to it), and the missing field becomes a runtime crash. As a rule: **when you are creating a value, annotate it; assert only when you are reinterpreting a value whose type the compiler got wrong.**

## Better alternatives to as

Most assertions in real code can be replaced by something the compiler checks.

**Narrowing.** If a value has a union type, test it and TypeScript narrows it for you:

```typescript title="narrow-instead.ts"
function lengthOf(value: string | string[]): number {
  if (typeof value === "string") return value.length;   // value: string
  return value.join("").length;                         // value: string[]
}
console.log(lengthOf("abc"), lengthOf(["ab", "cd"]));
```

```output
3 4
```

**Type guards and assertion functions.** For object shapes, write a function that checks at runtime and tells the compiler the result. A type predicate (`value is User`) narrows in an `if`; an assertion function (`asserts value is User`) narrows everything after the call and throws otherwise:

```typescript title="assertion-function.ts"
type User = { id: number; name: string };

function assertUser(value: unknown): asserts value is User {
  if (
    typeof value !== "object" || value === null ||
    typeof (value as { id?: unknown }).id !== "number" ||
    typeof (value as { name?: unknown }).name !== "string"
  ) {
    throw new Error("not a User");
  }
}

const data: unknown = JSON.parse('{"id": 7, "name": "Grace"}');
assertUser(data);
console.log(data.name);

try {
  assertUser(JSON.parse('{"id": 7}'));
} catch (e) {
  console.log((e as Error).message);
}
```

```output
Grace
not a User
```

The small `as { id?: unknown }` assertions inside the guard are safe: they only claim that an object *might* have an `id` of unknown type, which is always true, and the `typeof` checks then verify it. The assertion is confined to one tested function instead of spread across the code base. See [[b2-custom-type-guards]].

**`satisfies`.** When you want to check that a value matches a type *without* changing the type the compiler infers for it, use `satisfies` (TypeScript 4.9+). It catches missing or misspelt properties like an annotation, but keeps the precise inferred type like no annotation at all:

```typescript title="satisfies.ts"
type Theme = Record<string, `#${string}`>;

const palette = {
  primary: "#0055ff",
  danger: "#d32f2f",
} satisfies Theme;

console.log(palette.primary.toUpperCase());
```

```output
#0055FF
```

`palette.primary` is still known to exist (with plain `: Theme` it would be `` `#${string}` | undefined `` under `noUncheckedIndexedAccess`, and any key would be accepted). Writing `"0055ff"` without the `#` would be a compile error. See [[b2-satisfies]].

| Goal | Tool | Checked by the compiler? |
|---|---|---|
| Declare and check a value's type | Annotation `: T` | Yes |
| Check a value matches `T` but keep its precise type | `satisfies T` | Yes |
| Choose a branch based on the runtime type | Narrowing (`typeof`, `in`, `instanceof`) | Yes |
| Prove a shape at runtime and inform the compiler | Type predicate / assertion function | The runtime check is yours; the narrowing is checked |
| Reinterpret a value the compiler typed too loosely | `as T` | Only the overlap rule |
| Keep literal and readonly types | `as const` | Yes — it only narrows |
| Remove `null`/`undefined` | `!` | No |

## How it works internally

The type checker processes an assertion `e as T` in three steps: it computes the type `S` of `e` as usual, checks that `S` and `T` are **comparable** (assignable in at least one direction, with some relaxations for optional properties), and then uses `T` as the type of the whole expression. Nothing else changes, and the emitter strips the `as T` text. That is why an assertion can never introduce a runtime cost — and never a runtime safety net either.

`as const` is handled differently: it is not a reinterpretation but an **inference instruction**. It changes how the compiler infers the type of the literal it is attached to (no widening, readonly everywhere), so the result is always a *narrower* type than plain inference would give and is still fully checked. The non-null `!` removes `null` and `undefined` from the expression's type and, like `as`, is erased.

## as const Assertion {#b2-as-const-assertion}

The **`as const` assertion** (a "const assertion") tells TypeScript to infer the most specific type possible for a literal value: string, number and boolean literals keep their exact literal types, object properties become `readonly`, and array literals become `readonly` tuples. It does not change the value at runtime. Its main uses are configuration objects, lists of allowed values from which you derive union types, and functions that return fixed-length tuples.

### The problem: literal widening

When you write a literal into a mutable place, TypeScript **widens** its type, because the place could later hold other values of the same kind:

```typescript title="widening.ts"
const theme = "dark";               // type "dark" — a const can never change
let mode = "dark";                  // type string — a let can be reassigned
const config = { mode: "dark" };    // { mode: string } — properties are mutable
const sizes = [8, 16];              // number[]

type Mode = "light" | "dark";
function setMode(m: Mode) {
  console.log("mode:", m);
}

setMode(theme);
setMode(config.mode);
```

```output
widening.ts(12,9): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Mode'.
mode: dark
mode: dark
```

`config.mode` could legally be reassigned to `"purple"`, so its type is `string`, and `setMode` rejects it even though its value happens to be `"dark"`. This widening is usually what you want. When it is not, `as const` switches it off.

### What as const does

```typescript title="as-const.ts"
const config = { mode: "dark", retries: 3, tags: ["a", "b"] } as const;
// { readonly mode: "dark"; readonly retries: 3; readonly tags: readonly ["a", "b"] }

const modes = ["light", "dark"] as const;
// readonly ["light", "dark"]

type Mode = (typeof modes)[number];    // "light" | "dark"

function setMode(m: Mode) {
  console.log("mode:", m);
}
setMode(config.mode);

config.retries = 4;
modes.push("blue");
```

```output
as-const.ts(14,8): error TS2540: Cannot assign to 'retries' because it is a read-only property.
as-const.ts(15,7): error TS2339: Property 'push' does not exist on type 'readonly ["light", "dark"]'.
mode: dark
```

Three things happened, and they apply **recursively** to every nested literal:

1. **No literal widening.** `"dark"` stays `"dark"`, `3` stays `3`.
2. **Object properties become `readonly`**, so assignments are compile errors.
3. **Array literals become `readonly` tuples** — fixed length, fixed element types, and no mutating methods like `push`.

Line 7 shows the most valuable pattern: `(typeof modes)[number]` reads "the type of any element of `modes`", which is the union `"light" | "dark"`. The list of values and the union type now come from one source; adding `"system"` to the array updates the type automatically.

### Deriving unions from objects

The same idea works for objects that act as named constants — a common, lighter alternative to `enum` (see [[b2-literal-unions-vs-enums]]):

```typescript title="http-codes.ts"
const HTTP = {
  OK: 200,
  NotFound: 404,
  ServerError: 500,
} as const;

type HttpCode = (typeof HTTP)[keyof typeof HTTP];   // 200 | 404 | 500
type HttpName = keyof typeof HTTP;                  // "OK" | "NotFound" | "ServerError"

function describe(code: HttpCode): string {
  return code === HTTP.OK ? "success" : "failure";
}

console.log(describe(200), describe(HTTP.NotFound));
console.log(describe(201));
```

```output
http-codes.ts(15,22): error TS2345: Argument of type '201' is not assignable to parameter of type 'HttpCode'.
success failure
failure
```

Without `as const`, `HttpCode` would be plain `number` and `describe(201)` would compile. `keyof typeof HTTP` gives the names; indexing with them gives the values. See [[b2-keyof-typeof-patterns]] and [[b2-as-const-objects]].

### Returning tuples from functions

A function that returns an array literal gets an array type, not a tuple. `as const` fixes that, which is why custom React-style hooks use it:

```typescript title="tuple-return.ts"
function useToggle(initial: boolean) {
  let value = initial;
  const toggle = () => {
    value = !value;
    return value;
  };
  return [value, toggle] as const;   // readonly [boolean, () => boolean]
}

const [on, toggle] = useToggle(false);
console.log(on, toggle(), toggle());
```

```output
false true false
```

Without `as const` the return type would be `(boolean | (() => boolean))[]`, and `toggle()` would be an error because TypeScript could not know the second element is a function.

### Limits of as const

- **Only on literals.** It applies to string, number, boolean, array and object literals and to enum member references. `(1 + 2) as const` or `getValue() as const` is error TS1355.
- **Compile-time only.** `readonly` is erased, so the object is still mutable at runtime by code that bypasses the types. For runtime immutability use `Object.freeze`, which is itself shallow — nested objects remain mutable unless frozen too.
- **Spreading loses some of it.** `[...modes]` has type `("light" | "dark")[]` — literal element types survive, but the tuple length and `readonly` do not. `{ ...config }` keeps literal property types but drops `readonly`. Re-apply `as const` or annotate if you need them.
- **Readonly arrays do not fit mutable parameters.** Passing `modes` to a function that takes `string[]` fails, because that function could `push` into it. Declare read-only parameters as `readonly string[]`. See [[b2-readonly-arrays]].

### Combining as const with satisfies

`as const` keeps the literals; `satisfies` checks the shape. Together they give both:

```typescript title="const-satisfies.ts"
type Route = { path: `/${string}`; auth: boolean };

const routes = {
  home: { path: "/", auth: false },
  settings: { path: "/settings", auth: true },
} as const satisfies Record<string, Route>;

type RouteName = keyof typeof routes;           // "home" | "settings"
const p: "/settings" = routes.settings.path;    // literal type kept

console.log(Object.keys(routes) as RouteName[], p);
```

```output
[ 'home', 'settings' ] /settings
```

A typo such as `path: "settings"` (no leading slash) or a missing `auth` is reported at the definition, and every route still has its exact literal type. The order is `as const satisfies T`. (The `as RouteName[]` on the last line is a reasonable assertion: `Object.keys` is typed as `string[]` because objects may have extra keys at runtime, and here we know they do not.)

A related feature, **`const` type parameters** (TypeScript 5.0+), lets a generic function infer arguments as if the *caller* had written `as const`: `function routesOf<const T>(value: T): T`. That moves the responsibility from every call site into the function signature. See [[b2-generics]].

## Non-null Assertion (!) {#b2-non-null-assertion}

The **non-null assertion** is a postfix `!` after an expression: `value!`. It tells TypeScript that the value is neither `null` nor `undefined`, removing those two types from the expression's type. Like every assertion it emits no runtime check — if the value is in fact `null`, the next property access throws. It exists for the cases, common with `strictNullChecks` on, where you know a value is present for reasons the compiler's control-flow analysis cannot follow.

### What ! does

```typescript title="non-null.ts"
const stock = new Map<string, number>([["apple", 3]]);

function count(item: string): number {
  if (!stock.has(item)) return 0;
  return stock.get(item)!;   // Map.get returns number | undefined
}

console.log(count("apple"), count("pear"));
```

```output
3 0
```

`Map.prototype.get` is typed `number | undefined`, and TypeScript does not link a successful `has(item)` to the following `get(item)` — the map could in principle have been changed between the two calls. The `!` states that it has not. This is one of the most defensible uses: the evidence is on the line above.

A version with no assertion at all is often just as short, and it is fully checked:

```typescript title="no-bang.ts"
const stock = new Map<string, number>([["apple", 3]]);

function count(item: string): number {
  return stock.get(item) ?? 0;
}
console.log(count("apple"), count("pear"));
```

```output
3 0
```

### When ! is wrong, it fails late

```typescript title="bang-fails.ts"
type User = { name: string; manager?: { name: string } };

const ada: User = { name: "Ada" };
const managerName = ada.manager!.name;
console.log(managerName);
```

```output
TypeError: Cannot read properties of undefined (reading 'name')
```

The compiler accepted the code; the crash is a runtime `TypeError`. Compare the alternatives:

- **Optional chaining** — `ada.manager?.name` gives `string | undefined` and never throws. See [[b1-optional-chaining]].
- **Narrowing** — `if (ada.manager) { ... ada.manager.name ... }` is checked and documents the missing case.
- **Fail loudly with a message** — `const m = ada.manager ?? fail("Ada has no manager")`, using a `never`-returning helper, throws an error you can understand instead of a generic `TypeError`.

### The DOM case

The classic use is reaching an element that the page is known to contain. This snippet is browser-only and was not run for this lesson:

```typescript
const button = document.getElementById("save")!;          // HTMLElement
const input = document.querySelector<HTMLInputElement>("#email");
if (!input) throw new Error("#email missing from the page");
button.addEventListener("click", () => console.log(input.value));
```

`getElementById` returns `HTMLElement | null`, because the id may not exist. If the script runs after the HTML that defines `#save`, the `!` is reasonable. It is still a bet on markup that can change in another file, which is why the second line's explicit check with a clear message is often preferred.

Note also that `document.getElementById("email") as HTMLInputElement` does *two* things: it narrows `HTMLElement` to `HTMLInputElement` **and** silently removes `null`, because `HTMLInputElement` is comparable to `HTMLElement | null`. People who would never write `!` often write this without noticing. The generic `querySelector<HTMLInputElement>(...)` keeps `| null` in the type so you still handle the missing case.

### Definite assignment assertions

A related but different `!` appears on **declarations**. A **definite assignment assertion** tells the compiler that a variable or class field will be assigned before it is read, even though it cannot see where:

```typescript title="definite-assignment.ts"
let port!: number;
initialise();
console.log(port + 1);

function initialise() {
  port = 8080;
}

class Connection {
  id!: string;   // set by an external init step, not the constructor
  open(id: string) {
    this.id = id;
  }
}

const c = new Connection();
c.open("c-1");
console.log(c.id);
```

```output
8081
c-1
```

Without `!`, `console.log(port + 1)` is error TS2454 ("Variable 'port' is used before being assigned"), because the compiler does not follow assignments into called functions; and `id: string` without an initialiser is error TS2564 under `strictPropertyInitialization`. The `!` turns both checks off for that one declaration. Use it for fields set by frameworks (dependency injection, ORM entities, lifecycle hooks), and prefer constructor initialisation or an optional type (`id?: string`) otherwise. See [[b2-classes-ts]].

### Guidelines for !

- Use it only when the evidence is **local and obvious** — the line above, an invariant of the data structure, or a guarantee from a framework.
- Never use it to make a `strictNullChecks` error go away without understanding why the value might be missing; that error is often the bug report.
- Prefer `?.`, `??`, narrowing or an explicit throw where they read just as well.
- With `noUncheckedIndexedAccess`, `arr[i]` includes `undefined`; inside a loop bounded by `arr.length`, `arr[i]!` is reasonable.
- Many teams enable the lint rule `@typescript-eslint/no-non-null-assertion` (warn) so that each use is deliberate and reviewed.
- Do not confuse it with `!!value` (a JavaScript double negation that converts to `boolean`) or `!=` (loose inequality).

## Worked example: a typed feature-flag module

A small module defines feature flags once, derives types from them, reads overrides from untrusted storage and exposes a typed lookup. It uses all three assertion forms — each in the place it belongs — and a guard where an assertion would be wrong.

```typescript title="flags.ts"
const FLAGS = {
  newCheckout: { default: false, owner: "payments" },
  darkMode: { default: true, owner: "web" },
} as const satisfies Record<string, { default: boolean; owner: string }>;

type FlagName = keyof typeof FLAGS;           // "newCheckout" | "darkMode"

function isFlagName(value: string): value is FlagName {
  return Object.hasOwn(FLAGS, value);
}

// Simulates localStorage: untrusted text that may be missing or malformed.
const storage = new Map<string, string>([["flags", '{"darkMode": false, "bogus": true}']]);

function loadOverrides(): Map<FlagName, boolean> {
  const overrides = new Map<FlagName, boolean>();
  const raw = storage.get("flags");
  if (raw === undefined) return overrides;

  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) return overrides;

  for (const [key, value] of Object.entries(parsed)) {
    if (isFlagName(key) && typeof value === "boolean") overrides.set(key, value);
  }
  return overrides;
}

const overrides = loadOverrides();

function isEnabled(name: FlagName): boolean {
  return overrides.has(name) ? overrides.get(name)! : FLAGS[name].default;
}

console.log(isEnabled("newCheckout"), isEnabled("darkMode"), overrides.size);
```

```output
false false 1
```

How each piece earns its place:

- **`as const satisfies ...`** keeps the flag names as literal keys (so `FlagName` is a precise union) while checking every flag has a boolean `default` and an `owner`.
- **No `as` on the parsed JSON.** It is `unknown`, and every value is checked: the key with `isFlagName` (a type guard using `Object.hasOwn`, ES2022), the value with `typeof`. The bogus key `"bogus"` is dropped, so `overrides.size` is `1`.
- **One `!`**, directly after `overrides.has(name)` — evidence on the same line. `overrides.get(name) ?? FLAGS[name].default` would avoid even that.
- **Edge cases:** missing storage returns no overrides; `JSON.parse` on malformed text would throw, so production code would wrap it in `try`/`catch`; a non-boolean value such as `"yes"` is ignored rather than trusted.

## In real systems

- **DOM code** is where most legitimate `as` assertions live: `event.target as HTMLInputElement` in a handler, or `canvas.getContext("2d")!`. Even there, prefer typed APIs such as `querySelector<T>` and `event.currentTarget`, which is typed by the element the listener is attached to in frameworks like React.
- **API layers** that do `await res.json() as User` are a frequent source of production bugs. Mature code bases validate responses with a schema library at the boundary and let the validated type flow inward.
- **Configuration and constants** — route tables, permission names, design tokens, action types for reducers — are written `as const` (often with `satisfies`) so that unions are derived instead of duplicated.
- **Tests** use `as unknown as T` to build partial mocks. That is acceptable in test code; better still are typed factory helpers that fill defaults.
- **Migration from JavaScript** introduces many assertions temporarily. Tracking them (searching for `as unknown as`, `as any` and `!`) is a useful measure of how much of the code base is really checked. See [[b2-migration-js-to-ts]].

## Trade-offs and alternatives

Assertions are cheap to write and free at runtime, and sometimes there is no alternative — the compiler genuinely lacks information that you have. Their cost is that every assertion is a place where the type system stops protecting you, and that cost compounds: an incorrect type spreads to every value derived from the asserted one.

`as const` is the exception to that warning. It only ever makes types **narrower and more precise**, and the result is fully checked, so it carries none of the risk of `as T` or `!`. Its costs are ergonomic: readonly arrays do not pass to mutable parameters, and literal types can be more specific than an API expects.

When choosing, ask: *can the compiler check this if I restructure slightly?* If yes — with narrowing, a guard, an annotation or `satisfies` — do that. If no, assert, keep the assertion as close as possible to the evidence, and comment why.

## Common mistakes

**Asserting external data.** `JSON.parse(text) as Order` and `await res.json() as Order` check nothing. Validate with a guard or schema; type the raw value as `unknown`.

**Using `as` to create objects.** `{} as Settings` compiles with every property missing. Annotate instead (`const s: Settings = {...}`) so missing properties are reported.

**Expecting `as` to convert.** `"42" as unknown as number` is still a string. Use `Number(...)`, `String(...)` or a parser.

**Silently dropping `null` with `as`.** `getElementById("x") as HTMLInputElement` removes `| null` without a visible `!`. Use `querySelector<HTMLInputElement>` and check the result.

**Sprinkling `!` to satisfy `strictNullChecks`.** Each `!` turns a compile error into a possible runtime `TypeError`. Use `?.`, `??`, narrowing or an explicit error.

**Expecting `as const` to freeze the object.** It is compile-time only; use `Object.freeze` (shallow) when runtime immutability matters.

**Applying `as const` to a non-literal.** `getConfig() as const` is error TS1355; apply it where the literal is written, or use a `const` type parameter.

## Interview perspective

**"What is the difference between a type assertion and a type cast?"** In languages like Java a cast is checked at runtime and can throw `ClassCastException`; numeric casts can convert. A TypeScript assertion is compile-time only — no check, no conversion. Saying "assertion, not cast" and explaining the consequence is the expected answer.

**"When is `as` acceptable?"** At boundaries where you have information the compiler cannot (DOM element types, events, incorrect library types), kept small and close to the evidence. Strong answers mention preferring narrowing, type guards and `satisfies`, and validating external data.

**"Why does `"a" as number` fail but `"a" as unknown as number` work?"** Assertions require overlapping types; `unknown` overlaps with everything. The double assertion is the explicit "I am overriding the type system" form and should be rare.

**"What does `as const` do to an object?"** Literal types, readonly properties, readonly tuples, recursively; compile-time only. Bonus: deriving `(typeof arr)[number]` unions and combining with `satisfies`.

**"What is the difference between `x!` and `x?.y`?"** `!` asserts non-null without a check and crashes if wrong; `?.` checks at runtime and yields `undefined`. Mention definite assignment assertions (`field!: T`) as a separate feature.

## Practice

1. Rewrite `const el = document.getElementById("qty") as HTMLInputElement; total(el.valueAsNumber);` so that a missing or wrong element produces a clear error, without any `as` or `!`.
2. Given `const roles = ["admin", "editor", "viewer"]`, derive a `Role` union type from it and write `function can(role: Role)`. What must you change in the declaration, and why?
3. Find three assertions in a code base you know (or in an open-source project). For each, decide whether it could be replaced by narrowing, a guard, an annotation or `satisfies`.
4. Write a type guard `isProduct(value: unknown): value is Product` for `{ id: string; price: number }` and use it to filter an array parsed from JSON.
5. Explain what each line does at compile time and at runtime: `let a!: number;`, `const b = c!;`, `const d = !!c;`, `const e = c as number;`.

```quiz
Q: What happens at runtime when `const n = "7" as unknown as number; console.log(n + 1);` runs?
- [ ] It prints `8`, because the assertion converts the string to a number
- [ ] It throws a TypeError because the assertion fails
- [x] It prints `71`, because `n` is still the string `"7"` and `+` concatenates
- [ ] It does not compile
> Assertions are erased and never convert or check. The compiler believes `n` is a number, but
> the runtime value is the string `"7"`, so `"7" + 1` is the string `"71"`. The double
> assertion through `unknown` is what makes it compile; a direct `"7" as number` would not.
```

```quiz
Q: Which declaration makes `type Size = (typeof sizes)[number]` equal to `"s" | "m" | "l"`?
- [ ] `const sizes = ["s", "m", "l"];`
- [ ] `const sizes: string[] = ["s", "m", "l"];`
- [x] `const sizes = ["s", "m", "l"] as const;`
- [ ] `const sizes = Object.freeze(["s", "m", "l"]);` followed by `as string[]`
> Without `as const`, the array literal is inferred as `string[]`, so indexing with `number`
> gives `string`. `as const` infers the readonly tuple `readonly ["s", "m", "l"]`, whose element
> type is the literal union. Annotating `string[]` or asserting to it widens to `string`.
```

```quiz
Q: Why is `return map.get(key)!;` right after `if (!map.has(key)) return 0;` a reasonable use of `!`?
- [ ] Because `!` makes TypeScript check at runtime that the value exists
- [x] Because the evidence that the key exists is immediately above, and TypeScript does not connect `has` to `get`
- [ ] Because `Map.get` never returns `undefined`
- [ ] Because `!` narrows the map for later lines
> `Map.get` is typed `V | undefined` and the compiler does not relate a `has` check to a later
> `get`. The `!` asserts what the previous line proves. It adds no runtime check, so it would be
> wrong if the map could change between the calls; `map.get(key) ?? 0` avoids the assertion.
```

## Quick revision {#quick-revision}

- `value as T` (or `<T>value`, not in `.tsx`) changes the compiler's view only; erased at emit; no check, no conversion.
- Allowed when the types overlap (one assignable to the other); otherwise TS2352. `as unknown as T` forces anything — a red flag.
- Annotation `: T` checks; assertion `as T` trusts. Create values with annotations; reinterpret with assertions.
- Safer alternatives: narrowing, type predicates (`value is T`), assertion functions (`asserts value is T`), `satisfies` (TS 4.9+), schema validation for external data.
- `as const`: no literal widening, readonly properties, readonly tuples, recursive; only on literals (TS1355); compile-time only (`Object.freeze` is runtime and shallow).
- Derive unions: `(typeof arr)[number]`, `(typeof obj)[keyof typeof obj]`, `keyof typeof obj`. Combine: `as const satisfies T`.
- Spread of an `as const` value drops `readonly`/tuple length but keeps literal element types.
- `x!` removes `null | undefined`; no runtime check; prefer `?.`, `??`, narrowing or an explicit throw.
- `as HTMLInputElement` on `HTMLElement | null` also removes `null` silently.
- Definite assignment `let x!: T` / `field!: T` disables "used before assigned" (TS2454) and property-initialisation (TS2564) checks.

## Key takeaways {#key-takeaways}

- A type assertion is a compile-time claim, not a runtime check or conversion; if the claim is wrong the program fails later, far from the cause.
- The compiler only stops implausible assertions (non-overlapping types); everything else is trusted, so keep assertions rare and next to their evidence.
- Prefer annotations, narrowing, type guards and `satisfies`, and always validate data from outside the program instead of asserting it.
- `as const` is the safe assertion: it only narrows types, giving literal unions, readonly objects and tuples from a single source of truth.
- The non-null assertion `!` and the definite assignment `!` turn off null-safety checks locally; use them for framework and data-structure guarantees, not to silence errors.
