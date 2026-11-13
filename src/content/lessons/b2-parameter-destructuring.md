---
summary: Destructuring a parameter unpacks the properties of an object (or the items of a tuple) right in the function's parameter list. You will learn where the type annotation goes, why `{ x: number }` inside a pattern does not mean what it looks like, how defaults interact with optional properties, and how to type rest properties and destructured unions.
difficulty: beginner
minutes: 40
objectives:
  - Annotate a destructured parameter with an inline or named object type, and explain why the annotation goes after the whole pattern
  - Debug the "renaming, not typing" mistake in patterns such as `{ x: number }`
  - Combine optional properties with destructuring defaults and predict the resulting types for callers and inside the function
  - Type rest properties, nested patterns and tuple patterns, including a whole-parameter default of `{}`
  - Explain how TypeScript narrows destructured discriminated unions, and when it cannot
---

## Introduction

Many functions take a single object instead of a list of positional arguments. React components receive `props`; `fetch` takes an options object; most configuration functions take `{ host, port, timeout, … }`. An object argument scales better than positional ones: callers name every value, can leave out the ones that have defaults, and do not have to remember an order.

JavaScript lets you unpack that object directly in the parameter list with **destructuring**: `function connect({ host, port }) { … }` creates two local variables, `host` and `port`, from the argument's properties. TypeScript has to answer one question about this syntax — *where does the type go?* — and the answer has a trap in it that every TypeScript developer hits at least once. Once you have the syntax right, destructuring combines with optional properties and defaults to give functions a clean, self-documenting signature.

This lesson covers typing destructured parameters (inline and named), defaults, renaming, nested and rest patterns, tuple patterns, and the interaction with union types.

## Before you start

- **Destructuring in JavaScript** — object and array patterns, renaming and defaults. See [[b1-destructuring]] and [[b1-destructure-defaults]].
- **Rest and spread** — `...rest` in patterns and `...obj` in literals. See [[b1-spread-rest]].
- **Object types and optional properties** — `{ host: string; port?: number }`. See [[b2-object-types]] and [[b2-optional-properties]].
- **Typed functions** — annotating parameters and return types. See [[b2-typed-functions]].

## The intuition

Picture a function as a room with one door. A parameter of type `Options` is a suitcase handed through the door. Without destructuring, the function carries the whole suitcase around and opens it every time it needs something: `options.host`, `options.port`. Destructuring opens the suitcase at the door and lays out the items you need, each on its own shelf with a label.

The type annotation describes **the suitcase**, not the shelves. You say "this argument is an `Options`", and TypeScript works out the type of each item you take out of it. That is why the annotation is written after the whole pattern, once.

## Where the type annotation goes

Here is the same function written without and with destructuring:

```typescript title="annotation.ts"
type Point = { x: number; y: number };

function lengthA(point: Point): number {
  return Math.hypot(point.x, point.y);
}

function lengthB({ x, y }: Point): number {
  return Math.hypot(x, y);
}

console.log(lengthA({ x: 3, y: 4 }), lengthB({ x: 3, y: 4 }));
```

```output
5 5
```

In `lengthB`, the parameter is the pattern `{ x, y }` and its type is `Point`. TypeScript reads the pattern against the type and gives `x` the type of `Point["x"]` (number) and `y` the type of `Point["y"]` (number). From the caller's point of view the two functions are identical: both take one argument of type `Point`.

You can also write the type inline, which is common for small private helpers:

```typescript title="inline-pattern.ts"
function label({ name, count }: { name: string; count: number }): string {
  return `${name} (${count})`;
}

console.log(label({ name: "Inbox", count: 3 }));
```

```output
Inbox (3)
```

The names appear twice — once in the pattern, once in the type — which is noisy. As soon as the shape has more than two or three properties, or is used anywhere else, give it a name (`type LabelProps = …`). In React code the convention is to name it `<Component>Props`; see [[b2-react-component-props]].

### The renaming trap

Because the type goes after the pattern, it is tempting to write the types *inside* it, the way you would in some other languages:

```typescript title="trap.ts"
function area({ width: number, height: number }) {
  return width * height;
}
```

```output
trap.ts(1,24): error TS2300: Duplicate identifier 'number'.
trap.ts(1,24): error TS7031: Binding element 'number' implicitly has an 'any' type.
trap.ts(1,40): error TS2300: Duplicate identifier 'number'.
trap.ts(1,40): error TS7031: Binding element 'number' implicitly has an 'any' type.
trap.ts(2,10): error TS2304: Cannot find name 'width'.
trap.ts(2,18): error TS2304: Cannot find name 'height'.
```

The output is from `tsc --noEmit`. This is not a type annotation at all. Inside a destructuring pattern, `width: number` is JavaScript's **renaming** syntax: "take the property `width` and store it in a variable called `number`". Both properties are being renamed to a variable called `number`, there are no variables called `width` and `height`, and the parameter has no type. The compiler messages are a confusing pile because the code means something completely different from what was intended.

> [!MISTAKE] Colons inside a pattern rename; the type goes after it
> `{ width: number }` in a parameter list means "rename `width` to `number`". Write `{ width, height }: { width: number; height: number }`, or better, `{ width, height }: Size` with a named type.

Renaming itself is legitimate and works with types as you would expect. The name on the left of the colon is the property, the name on the right is the new local variable, and the type annotation still describes the original object:

```typescript title="rename.ts"
type ApiUser = { id: string; display_name: string };

function greet({ id: userId, display_name: displayName }: ApiUser): string {
  return `${displayName} <${userId}>`;
}

console.log(greet({ id: "u7", display_name: "Grace" }));
```

```output
Grace <u7>
```

Renaming is handy when external data uses names that do not fit your code's conventions, such as `snake_case` from an API.

## Defaults and optional properties

Destructuring defaults are where TypeScript's types and JavaScript's runtime behaviour meet most usefully. Declare a property as optional in the type, give it a default in the pattern, and you get two different views of the same parameter:

```typescript title="defaults.ts"
type ConnectOptions = { host: string; port?: number; ssl?: boolean };

function connect({ host, port = 443, ssl = true }: ConnectOptions): string {
  // Here port: number and ssl: boolean — the defaults removed undefined
  return `${ssl ? "https" : "http"}://${host}:${port}`;
}

console.log(connect({ host: "localhost" }));
console.log(connect({ host: "localhost", port: 8080, ssl: false }));
```

```output
https://localhost:443
http://localhost:8080
```

**For callers**, `port` and `ssl` are optional: the type says so, and `connect({ host: "localhost" })` is accepted. `host` is required, and leaving it out is an error. **Inside the function**, `port` has type `number`, not `number | undefined`, because TypeScript knows the default fills in the missing case. You never have to check it again. This split — optional on the outside, definite on the inside — is the reason destructuring defaults are the standard way to handle option objects.

The default does not change the parameter's type. If you give a default to a property that the type declares as *required*, the default can never be used by a correctly typed caller, and callers must still provide the value. Optionality comes from the type; the default only decides what the missing value becomes.

### Defaults apply to `undefined`, not `null`

A JavaScript destructuring default is used only when the property's value is `undefined` — missing, or explicitly `undefined`. A `null` is a real value and passes through untouched:

```typescript title="null-default.ts"
function pageSize({ size = 20 }: { size?: number | null }): number | null {
  return size;
}

console.log(pageSize({}));
console.log(pageSize({ size: undefined }));
console.log(pageSize({ size: null }));
```

```output
20
20
null
```

TypeScript models this exactly: with the type `number | null | undefined` coming in, the default removes only `undefined`, so `size` is `number | null` inside. If your data source sends `null` for "no value" (many JSON APIs do), a pattern default will not catch it. Use `size ?? 20` in the body instead, because `??` treats `null` and `undefined` alike ([[b1-nullish-coalescing]]).

### Defaults can use earlier values

Defaults are evaluated left to right when the function is called, and each one can refer to the bindings before it:

```typescript title="dependent-defaults.ts"
function range({ min = 0, max = min + 10 }: { min?: number; max?: number }): number[] {
  return [min, max];
}

console.log(range({}), range({ min: 5 }), range({ min: 1, max: 2 }));
```

```output
[ 0, 10 ] [ 5, 15 ] [ 1, 2 ]
```

### Making the whole argument optional

A function whose options are all optional should be callable with no argument at all. Destructuring `undefined` throws a `TypeError` at runtime, so you give the *whole parameter* a default of `{}`:

```typescript title="whole-default.ts"
type ListOptions = { page?: number; size?: number };

function list({ page = 1, size = 20 }: ListOptions = {}): string {
  return `page ${page}, ${size} per page`;
}

console.log(list());
console.log(list({ size: 50 }));
```

```output
page 1, 20 per page
page 1, 50 per page
```

Two defaults are at work. `= {}` after the type is used when the argument itself is missing; `page = 1` and `size = 20` are then applied to the properties of that empty object. TypeScript checks the parameter default against the type: `{}` is only a valid `ListOptions` because every property is optional. With a required property, the compiler rejects it:

```typescript title="bad-whole-default.ts"
function sum({ a, b }: { a: number; b: number } = {}) { // error TS2739
  return a + b;
}
```

```output
bad-whole-default.ts(1,14): error TS2739: Type '{}' is missing the following properties from type '{ a: number; b: number; }': a, b
```

## Nested patterns and callbacks

Patterns can go as deep as the type does. Each level is typed by the corresponding part of the annotation:

```typescript title="nested.ts"
type Order = {
  id: string;
  customer: { name: string; address: { city: string } };
};

function shippingLabel({ id, customer: { name, address: { city } } }: Order): string {
  return `${id}: ${name}, ${city}`;
}

console.log(shippingLabel({ id: "o1", customer: { name: "Ada", address: { city: "Leeds" } } }));
```

```output
o1: Ada, Leeds
```

Note that `customer` and `address` are *not* variables here — in a nested pattern, `customer: { … }` means "go into `customer` and destructure it". Deep patterns get hard to read quickly; two levels is usually the practical limit before it is clearer to destructure in the body.

Callbacks are where you most often destructure without writing a type at all. When a function is passed to something whose signature is already known, such as `Array.prototype.map`, TypeScript infers the parameter's type from context. This is **contextual typing**, and it reaches into the pattern:

```typescript title="contextual.ts"
const users = [
  { id: 1, name: "Ada", active: true },
  { id: 2, name: "Linus", active: false },
];

const names = users.filter(({ active }) => active).map(({ id, name }) => `${id}:${name}`);
console.log(names);
```

```output
[ '1:Ada' ]
```

`users` has the inferred type `{ id: number; name: string; active: boolean }[]`, so the callback parameter is known to be one of those objects, and `id`, `name` and `active` all get their types without annotations. Adding an annotation here would only duplicate information.

## Rest properties

A rest element in an object pattern collects every property you did not name into a new object. TypeScript computes its type as **the original type minus the named properties**:

```typescript title="rest.ts"
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick: () => void;
};

function renderButton({ label, variant = "primary", ...rest }: ButtonProps): string {
  // rest: { disabled?: boolean; onClick: () => void }
  const attrs = Object.keys(rest).join(",");
  return `<button class="${variant}" data-attrs="${attrs}">${label}</button>`;
}

console.log(renderButton({ label: "Save", disabled: true, onClick: () => {} }));
```

```output
<button class="primary" data-attrs="disabled,onClick">Save</button>
```

This is the backbone of the **forwarding** pattern in component libraries: pull out the props the component handles itself and pass the rest straight to an underlying element. Because `rest` is precisely typed, passing it on is checked too. When you need to *name* that leftover type — for a helper that receives it — write it with the utility type `Omit<ButtonProps, "label" | "variant">` ([[b2-omit]]).

## Tuple and array patterns

Array destructuring works on parameters too. With a **tuple type**, each position has its own type, and the pattern picks them up by position:

```typescript title="tuple-pattern.ts"
type Entry = [key: string, count: number];

function formatEntry([key, count]: Entry): string {
  return `${key.toUpperCase()}=${count.toFixed(1)}`;
}

const counts = new Map([["a", 2], ["b", 5]]);
console.log([...counts].map(([key, count]) => `${key}:${count}`).join(" "));
console.log(formatEntry(["x", 3]));
```

```output
a:2 b:5
X=3.0
```

The labels in `[key: string, count: number]` are documentation only; the types come from position. `Map` entries are typed as `[string, number]` tuples, which is why destructuring them in a callback gives each variable the right type. Destructuring a plain array type (`number[]`) also works, but every element gets the same type, and with `noUncheckedIndexedAccess` each one may be `undefined`. Tuples are covered in [[b2-tuples]].

## Destructuring union types

If a parameter's type is a union, you can only destructure properties that exist on **every** member. A property that appears in some members but not others is not known to exist:

```typescript title="union-pattern.ts"
type Result = { ok: true; value: number } | { ok: false; error: string };

function show({ ok, value }: Result) {} // error TS2339
```

```output
union-pattern.ts(3,21): error TS2339: Property 'value' does not exist on type 'Result'.
```

When every member has the property — even with different types — destructuring works, and since TypeScript 4.6 the compiler keeps track of how the destructured variables relate. Checking the discriminant narrows the other variable too:

```typescript title="destructured-union.ts"
type Action =
  | { type: "add"; payload: number }
  | { type: "rename"; payload: string };

function describe({ type, payload }: Action): string {
  if (type === "add") {
    return `add ${payload.toFixed(0)}`;   // payload: number
  }
  return `rename to ${payload.trim()}`;  // payload: string
}

console.log(describe({ type: "add", payload: 2 }));
console.log(describe({ type: "rename", payload: " Ada " }));
```

```output
add 2
rename to Ada
```

This only works while the destructured variables are not reassigned; assigning to `payload` anywhere in the function breaks the link and `payload` stays `number | string`. When the members have different properties, keep the parameter whole (`action: Action`), narrow on `action.type`, and destructure inside each branch. See [[b2-discriminated-unions]].

## How it works internally

TypeScript's part in parameter destructuring is purely compile-time. When it emits JavaScript, it deletes the type annotation and leaves the pattern as written, because modern JavaScript supports destructuring natively. For `connect` above, with `target` set to ES2022:

```javascript title="connect.js"
export function connect({ host, port = 443, ssl = true }) {
    return `${ssl ? "https" : "http"}://${host}:${port}`;
}
```

The runtime behaviour is therefore plain JavaScript: on each call the engine reads `host`, `port` and `ssl` from the argument, and for each one that is `undefined` evaluates its default. If the argument itself is `undefined` and there is no `= {}`, reading a property from it throws `TypeError: Cannot destructure property 'host' of 'undefined'`. TypeScript prevents that call at compile time, but code called from untyped JavaScript can still do it.

For very old targets that lack destructuring, the compiler rewrites the pattern into ordinary property reads with `=== void 0` checks for each default. TypeScript 6 deprecates the `es5` target, so in practice you will see the native form.

At compile time, the checker does three things with a destructured parameter. It takes the declared type (or the contextual type, for callbacks) as the type of the whole argument. It gives each binding the type of the matching property, removing `undefined` when the binding has a default. And it checks every default value — including a whole-parameter `= {}` — against the declared type.

```quiz
Q: What does `function f({ name: string }) {}` declare?
- [ ] A parameter with a `name` property of type `string`
- [x] A parameter with no type whose `name` property is copied into a local variable called `string`
- [ ] A syntax error in JavaScript
- [ ] A parameter with an optional `name` property
> Inside a destructuring pattern, `a: b` is renaming: property `a` goes into variable `b`. The pattern has no type annotation at all, so under `strict` the binding is an implicit `any` error. The fix is `{ name }: { name: string }`.

Q: Given `function f({ port = 80 }: { port?: number | null })`, what is the type of `port` inside the function, and what does `f({ port: null })` produce?
- [ ] `number`, and the default 80 is used
- [x] `number | null`, and `port` is `null`
- [ ] `number | undefined`, and `port` is `undefined`
- [ ] `number | null | undefined`, and `port` is `null`
> Destructuring defaults apply only when the value is `undefined`. The default removes `undefined` from the type but leaves `null`, and at runtime `null` passes through unchanged. Use `??` in the body to replace both.
```

## Worked example: a typed request helper

This example builds a small request-description helper of the kind found in most frontend codebases. It combines a named options type, required and optional properties, defaults, a whole-parameter default and rest properties.

```typescript title="request.ts"
type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  retries?: number;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

type RequestPlan = {
  url: string;
  method: "GET" | "POST" | "DELETE";
  attempts: number;
  headers: Record<string, string>;
  extra: Omit<RequestOptions, "method" | "retries" | "headers">;
};

function planRequest(
  url: string,
  { method = "GET", retries = 2, headers = {}, ...extra }: RequestOptions = {},
): RequestPlan {
  return {
    url,
    method,
    attempts: retries + 1,               // retries: number thanks to the default
    headers: { Accept: "application/json", ...headers },
    extra,                               // { timeoutMs?: number }
  };
}

console.log(planRequest("/api/users"));
console.log(planRequest("/api/users/7", { method: "DELETE", retries: 0, timeoutMs: 500 }));
```

```output
{
  url: '/api/users',
  method: 'GET',
  attempts: 3,
  headers: { Accept: 'application/json' },
  extra: {}
}
{
  url: '/api/users/7',
  method: 'DELETE',
  attempts: 1,
  headers: { Accept: 'application/json' },
  extra: { timeoutMs: 500 }
}
```

Walk through it. The required input, `url`, stays a positional parameter, because every call needs it and it reads naturally first. Everything optional lives in one `RequestOptions` object, so new options can be added later without breaking existing calls. The whole options parameter defaults to `{}`, which is valid because every property is optional, so `planRequest("/api/users")` works.

Inside, `method`, `retries` and `headers` have non-optional types because each has a default, which is why `retries + 1` needs no check. `...extra` collects what is left — here only `timeoutMs` — and its type matches `Omit<RequestOptions, "method" | "retries" | "headers">`, which is how the `RequestPlan` type names it. If you added a new option to `RequestOptions` and forgot to handle it, it would flow into `extra` with the correct type rather than being silently dropped.

Edge cases worth checking: `retries: 0` is respected because `0` is not `undefined` (a `||` default would have replaced it with 2); and passing `{ method: "PATCH" }` is a compile error because `"PATCH"` is not in the method union.

## In real systems

**React components.** Nearly every function component destructures its props: `function Avatar({ src, size = 40, ...imgProps }: AvatarProps)`. Optional props with pattern defaults replaced the older `defaultProps` mechanism, which React 19 no longer supports for function components. Rest props are forwarded to the underlying DOM element.

**Library APIs.** Options objects with destructured defaults are the norm for configuration: test runners, HTTP clients, bundler plugins. They let a library add options without breaking callers, and the named type serves as documentation in editors.

**Event handlers and array callbacks.** `onChange={({ target }) => setValue(target.value)}` and `entries.map(([key, value]) => …)` rely on contextual typing, so no annotation is written at all.

## Trade-offs and alternatives

| Style | Strength | Weakness |
|---|---|---|
| Positional parameters `f(a, b, c)` | Short calls for 1–2 obvious arguments | Order must be remembered; boolean arguments are unreadable at the call site |
| Object parameter, not destructured | Easy to pass the whole object on | `options.` repeated everywhere; defaults need separate code |
| Destructured object parameter | Self-documenting signature; defaults in one place | Long patterns get noisy; renaming syntax confuses beginners |

A common rule of thumb: use positional parameters for one or two required values with a natural order, and an options object for anything optional or for more than about three parameters. Calls such as `createUser("Ada", true, false)` are a sign that the booleans belong in a named object.

Destructuring copies values out of the object once, at the start of the call. If the function needs to observe later changes to the object — rare, but it happens with mutable shared state — keep a reference to the object instead.

## Common mistakes

**Putting types inside the pattern.** `{ id: string }` renames. Annotate after the pattern.

**Destructuring an optional argument without `= {}`.** If every option is optional, callers will call `f()`, and destructuring `undefined` throws. Add a whole-parameter default.

**Expecting a default to replace `null`.** Pattern defaults only apply to `undefined`. If the data can contain `null`, use `??` in the body or normalise at the boundary.

**Giving a default to a required property.** The type still makes callers provide it, so the default is dead code. Make the property optional in the type if it really has a default.

**Destructuring a property that only some union members have.** It is a compile error. Narrow the whole object first, then destructure inside the branch.

**Destructuring with class parameter properties.** `constructor(private { name }: Options)` is not allowed — TypeScript reports *A parameter property may not be declared using a binding pattern*. Take the options as a normal parameter and assign fields in the constructor body. Parameter properties are covered in [[b2-parameter-properties]].

## Interview perspective

Questions on this topic test whether you know where TypeScript ends and JavaScript begins.

> [!INTERVIEW] What does the default do to the type?
> "In `function f({ port = 443 }: { port?: number })`, what is `port`'s type inside the function, and what is the parameter's type for callers?" Inside: `number`, because the default removes `undefined`. For callers: `{ port?: number }` — still optional. Mention that `null` would not trigger the default.

Also be ready to:

- Explain why `{ a: number }` in a pattern is renaming and how you would spot the bug from the compiler errors.
- Type a component that forwards unknown props: destructure the props you handle, collect `...rest`, and describe its type as `Omit<Props, …>`.
- Explain why `f({ a, b }: T = {})` needs every property of `T` to be optional.
- Explain how to handle a discriminated union parameter: destructure the discriminant and a shared property and rely on TypeScript 4.6+ narrowing, or narrow the whole object first.

## Practice

1. Rewrite `function draw(x: number, y: number, filled: boolean, colour: string)` to take an options object with `filled` and `colour` optional (defaults `false` and `"black"`). Show a call before and after and compare readability.
2. Write `formatPrice({ amount, currency = "EUR", locale = "en-GB" }: PriceOptions = …)` so that it can be called with only `amount`. Decide which properties are optional and justify the whole-parameter default (or its absence).
3. A function receives `{ title?: string | null }` from an API. Make it display `"Untitled"` for both `null` and a missing title. Explain why a pattern default alone is not enough.
4. Write a `TextInput` function that destructures `label` and `error` and forwards everything else. Write the type of the forwarded object with `Omit`.
5. Given `type Shape = { kind: "circle"; radius: number } | { kind: "rect"; w: number; h: number }`, write `area(shape: Shape)` with destructuring inside each branch. Then try destructuring `radius` in the parameter list and explain the error.

## Quick revision {#quick-revision}

- Annotate the whole pattern: `function f({ a, b }: Props)`. The type describes the argument, not the variables.
- `{ a: x }` inside a pattern **renames** `a` to `x`; it is not a type.
- Optional property + pattern default: optional for callers, non-`undefined` inside.
- Defaults apply only to `undefined`; `null` passes through. Use `??` for both.
- Defaults are evaluated left to right and may use earlier bindings.
- `= {}` after the type makes the whole argument optional; only valid if every property is optional.
- Nested patterns: `{ user: { name } }` — `user` is not a variable.
- Callbacks get pattern types from context; no annotation needed.
- `...rest` has the original type minus the named properties; name it with `Omit`.
- Tuple patterns type each position: `([key, value]: [string, number])`.
- Unions: only properties on every member can be destructured; destructured discriminants narrow siblings (TS 4.6+) unless reassigned.
- Parameter properties (`private x`) cannot use destructuring patterns.

## Key takeaways {#key-takeaways}

- The type annotation for a destructured parameter goes after the entire pattern and describes the object being passed.
- A colon inside a pattern renames a property; it never declares a type.
- Optional properties in the type plus defaults in the pattern give callers flexibility and give the function body definite types.
- A whole-parameter `= {}` lets a function with all-optional settings be called with no argument.
- Rest properties are typed precisely as "everything else", which makes prop forwarding type-safe.
- Destructuring is plain JavaScript at runtime: defaults only replace `undefined`, and destructuring `undefined` throws.
