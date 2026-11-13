---
summary: An object type lists the properties a value must have and the type of each one. You will learn how to write object types, why TypeScript compares them by shape rather than by name, why a typo in an object literal is an error but the same typo in a variable is not, and how optional and readonly properties describe data that may be missing or must not change.
difficulty: beginner
minutes: 55
objectives:
  - Write object types inline, as type aliases and as interfaces, including nested objects and methods
  - Explain structural typing and predict whether one object type is assignable to another
  - Explain when excess property checking runs and why it only applies to fresh object literals
  - Choose between fixed properties, index signatures, `Record` and `unknown` for a given piece of data
  - Use optional (`?`) and `readonly` properties correctly, including their limits at runtime
---

## Introduction

Almost all the data a frontend handles is an object. A user is an object with an id, a name and an email. A to-do item has a title and a `done` flag. An API response has `data`, `error` and `status`. React components receive their inputs as a `props` object. If you cannot describe objects precisely, TypeScript can do very little for you.

In plain JavaScript nothing stops a function that expects `{ title, done }` from receiving `{ titel, done }`. The mistake surfaces later, as `undefined` showing up on screen or a `TypeError` far from the line that caused it. An **object type** fixes this by writing the expected shape down: which property names exist and what type of value each one holds. The compiler then checks every place an object is created, passed or read against that shape.

This lesson covers three things. First, how to write object types and how TypeScript decides whether a value fits one — the rule is **structural**: matching shape is enough, the name of the type does not matter. Second, the special check that catches typos in object literals, and why it does not run everywhere. Third, the two property modifiers you will use constantly: **optional properties** for fields that may be absent, and **readonly properties** for fields that must not be reassigned.

## Before you start

- **Object literals and property access** in JavaScript — `{ a: 1 }`, `obj.a`, `obj["a"]`. See [[b1-object-literals]].
- **Primitive and object types** — `string`, `number`, `boolean`, and why `object` and `{}` are rarely what you want. See [[b2-primitive-object-types]].
- **Type annotations** — the `name: Type` syntax. See [[b2-type-annotations]].
- **Optional chaining and nullish coalescing** — `a?.b` and `a ?? b`, used when reading optional properties. See [[b1-optional-chaining]] and [[b1-nullish-coalescing]].

You do not need to know interfaces in detail. This lesson shows the `interface` syntax briefly; [[b2-interfaces]] and [[b2-interface-vs-type-when]] cover it fully.

## The intuition

Think of an object type as a paper form with labelled boxes: *Id*, *Title*, *Done*. Each box says what may be written in it — text, a number, a tick. A filled-in form is valid if every required box contains the right kind of thing.

Two details of TypeScript's version of the form are worth knowing early, because they are where the analogy stops working:

1. **TypeScript does not care which form you used.** If a value has the right boxes filled with the right kinds of things, it counts as that form, even if it was created for a different purpose. This is structural typing.
2. **Extra boxes are usually allowed.** A value with an additional `priority` box still fits the `Task` form. TypeScript only objects to extra properties in one situation — when you write an object literal directly where a `Task` is expected — because there an extra property is almost always a typo.

Both rules are explained below with real compiler output.

## Writing object types

The simplest object type is written inline, right where it is used:

```typescript title="inline.ts"
function describe(point: { x: number; y: number }): string {
  return `(${point.x}, ${point.y})`;
}

console.log(describe({ x: 3, y: 4 }));
```

```output
(3, 4)
```

The type `{ x: number; y: number }` says: an object with a property `x` holding a number and a property `y` holding a number. Members can be separated by semicolons or commas; semicolons are the common style. Inline types are fine for a one-off, but as soon as the shape is used in two places you should give it a name, so that a change happens in one place. There are two ways to do that:

```typescript title="named.ts"
type Point = { x: number; y: number };

interface Size {
  width: number;
  height: number;
}

function area(size: Size): number {
  return size.width * size.height;
}

const origin: Point = { x: 0, y: 0 };
console.log(origin, area({ width: 3, height: 5 }));
```

```output
{ x: 0, y: 0 } 15
```

A **type alias** (`type Point = …`) gives a name to any type, including an object type. An **interface** (`interface Size { … }`) can only describe object shapes, and it can be extended and merged. For plain object shapes the two are interchangeable in almost every situation; the differences are covered in [[b2-interface-vs-type-when]]. This lesson uses `type` for brevity.

### Nested objects and methods

Properties can hold any type, including other objects, arrays and functions:

```typescript title="nested.ts"
type Address = { city: string; postcode: string };

type User = {
  id: string;
  name: string;
  address: Address;                     // a named nested type
  tags: string[];                       // an array of strings
  settings: { theme: "light" | "dark" }; // an inline nested type
  greet(): string;                      // a method
};

const ada: User = {
  id: "u1",
  name: "Ada",
  address: { city: "London", postcode: "N1" },
  tags: ["admin"],
  settings: { theme: "dark" },
  greet() {
    return `Hello, I am ${this.name}`;
  },
};

console.log(ada.address.city, ada.settings.theme, ada.greet());
```

```output
London dark Hello, I am Ada
```

Whether to name a nested type or write it inline is a readability choice. Name it (`Address`) when other code needs to talk about it on its own — a function that formats an address, for instance. Keep it inline when it only makes sense inside its parent. The `"light" | "dark"` type is a union of literal types: the property may only hold one of those two exact strings. See [[b2-literal-types]].

### Reading and adding properties

Once a variable has an object type, TypeScript only lets you read the properties that type declares. This is what turns typos into compile errors and gives your editor accurate autocomplete:

```typescript title="access.ts"
type Task = { id: string; title: string; done: boolean };
const task: Task = { id: "t1", title: "Write lesson", done: false };

console.log(task.titel);  // error TS2551

const draft = {};
draft.title = "x";        // error TS2339
```

```output
access.ts(4,18): error TS2551: Property 'titel' does not exist on type 'Task'. Did you mean 'title'?
access.ts(7,7): error TS2339: Property 'title' does not exist on type '{}'.
```

The output above is from `tsc --noEmit`. The second error surprises people coming from JavaScript, where you often start with `{}` and add properties one at a time. TypeScript infers the type of `draft` from its initial value — an object with no properties — and that type does not change later. The fix is to build the object in one expression, or to annotate it with a type whose properties are optional (see [[b2-optional-properties|optional properties]] below).

## Structural typing: shape is what counts

In languages such as Java, a `Cat` is only a `Pet` if the `Cat` class declares `implements Pet`. TypeScript works differently. A value is assignable to an object type if it has **at least** the properties the type requires, each with a compatible type. Where the value came from, and what its type was called, does not matter. This is **structural typing**.

```typescript title="structural.ts"
type Point = { x: number; y: number };
type Vector = { x: number; y: number };

const v: Vector = { x: 1, y: 2 };
const p: Point = v;                 // fine: same shape, different name

const pixel = { x: 10, y: 20, colour: "red" };
const q: Point = pixel;             // fine: has x and y, extra colour is allowed

function length(pt: Point): number {
  return Math.hypot(pt.x, pt.y);
}
console.log(length(pixel));
```

```output
22.360679774997898
```

`Point` and `Vector` are two names for the same shape, so they are fully interchangeable. `pixel` has an extra `colour` property; it is still a `Point`, because it has everything a `Point` needs. Inside `length` the extra property is invisible — `pt.colour` would be a compile error — but it still exists at runtime.

This rule matches how JavaScript code is written. Functions in JavaScript do not ask an object what class it is; they read the properties they need. Structural typing lets TypeScript describe that style without forcing you to declare relationships up front. The full model, including how functions and classes are compared, is in [[b2-structural-typing]].

## Excess property checking

If extra properties are allowed, how does TypeScript catch a typo like `titel`? The answer is a separate, narrower rule called **excess property checking**.

When you write an **object literal** directly in a position that has a known type — an annotated variable, a function argument, a return value — TypeScript checks that the literal does not contain properties the target type does not know about. An object literal in that position is called **fresh**: it was created right here, so nobody else can be relying on its extra properties. An extra property on a fresh literal is almost certainly a mistake.

```typescript title="excess.ts"
type Task = { id: string; title: string; done: boolean };

const a: Task = { id: "1", title: "x", done: false, priority: 2 }; // error TS2353

function save(t: Task) {}
save({ id: "1", titel: "x", done: false });                          // error TS2561

const extra = { id: "1", title: "x", done: false, priority: 2 };
const b: Task = extra;                                                // no error
```

```output
excess.ts(3,53): error TS2353: Object literal may only specify known properties, and 'priority' does not exist in type 'Task'.
excess.ts(6,17): error TS2561: Object literal may only specify known properties, but 'titel' does not exist in type 'Task'. Did you mean to write 'title'?
```

Line 9 is the important one. `extra` has exactly the same contents as the literal on line 3, but it is a variable, not a fresh literal. Its type was inferred as `{ id: string; title: string; done: boolean; priority: number }` when it was declared, and assigning it to `Task` is an ordinary structural check — which passes, because the extra property is allowed. The literal lost its freshness the moment it was stored in a variable.

Why the difference? Once an object lives in a variable, other code may use its other properties: `extra.priority` is valid and meaningful. Forbidding the assignment would break legitimate code such as passing a richer object to a function that only needs part of it. On a fresh literal, nothing can ever read `priority` through the `Task` type, so the property is dead weight at best and a typo at worst.

> [!WARNING] The check is a lint, not a guarantee
> Excess property checking only looks at fresh object literals. A value of type `Task` may still carry extra properties at runtime. Code that copies "all properties" of a `Task` — `Object.keys(task)`, `{ ...task }`, `JSON.stringify(task)` — will include them. If extra data must not leak (for example, a password field before sending a user to the client), pick the fields explicitly.

A related rule catches a nastier case. If every property of a type is optional, almost any object would structurally match it, and a misspelled options object would silently do nothing. TypeScript therefore treats such an all-optional type as a **weak type**: assigning a value that shares *no* properties with it is an error, even from a variable.

```typescript title="weak.ts"
type Options = { verbose?: boolean; colour?: string };

const typo = { verbos: true };
const opts: Options = typo; // error TS2559
```

```output
weak.ts(4,7): error TS2559: Type '{ verbos: boolean; }' has no properties in common with type 'Options'.
```

## Dynamic keys: index signatures and `Record`

Fixed properties describe entities whose fields you know in advance. Some objects are used as dictionaries instead: scores by player name, translations by language code, cached results by id. You cannot list the keys, but every value has the same type. An **index signature** describes that:

```typescript title="index-signature.ts"
type Scores = { [player: string]: number };

const scores: Scores = { ada: 3, linus: 5 };
scores.grace = 4;                 // any string key may be added

for (const [name, points] of Object.entries(scores)) {
  console.log(name, points);
}

const missing = scores.bob;       // type number, value undefined
console.log(missing);
```

```output
ada 3
linus 5
grace 4
undefined
```

`[player: string]: number` reads "for any string key, the value is a number". The name `player` is only documentation. The last two lines show the catch: TypeScript gives `scores.bob` the type `number`, but the value is `undefined`, because no such key exists. By default the compiler assumes every key you look up is present. The compiler option `noUncheckedIndexedAccess` changes this so that index-signature reads have type `number | undefined`, forcing you to handle the missing case. It is not part of `strict`, but many teams turn it on.

The built-in utility type `Record<K, V>` is a shorter way to write the same thing, and it also accepts a union of specific keys:

```typescript title="record.ts"
type Scores = Record<string, number>;            // same as { [k: string]: number }

type Status = "idle" | "loading" | "done";
// every status must have a label
const labels: Record<Status, string> = { // error TS2741
  idle: "Waiting",
  loading: "Loading…",
};
```

```output
record.ts(5,7): error TS2741: Property 'done' is missing in type '{ idle: string; loading: string; }' but required in type 'Record<Status, string>'.
```

With a union of keys, `Record` is not a dictionary at all — it is a fixed object type with one property per key, and the compiler reports any key you forgot. That makes it a good tool for lookup tables that must stay in sync with a union. The choice between the two forms is covered in [[b2-index-signatures]] and [[b2-record-vs-index-signature]].

## "Some object": `object`, `{}`, `Object` and `unknown`

Sometimes a function accepts "any object" — a logger, a deep-clone helper. Beginners reach for `{}` or `Object`, which do not mean what they look like:

| Type | Accepts | Notes |
|---|---|---|
| `object` | any non-primitive: objects, arrays, functions | Rejects `5`, `"x"`, `null` |
| `{}` | any value except `null` and `undefined` | `let e: {} = 5` compiles |
| `Object` | almost the same as `{}` | The wrapper interface; avoid |
| `unknown` | anything | You must narrow before using it |

`{}` means "a value with no required properties", and a number has no missing properties, so it fits. For a parameter that really is "some value I will inspect", prefer `unknown` and narrow it with checks such as `typeof x === "object" && x !== null` (see [[b2-unknown]] and [[b2-narrowing]]). Use `object` when you need to exclude primitives, and a real object type whenever you know the shape. Do not use `Object` or `{}` to mean "an object".

## How it works internally

Object types exist only at compile time. When `tsc` (or a bundler such as Vite or esbuild) emits JavaScript, every `type` and `interface` is deleted, along with every annotation. The emitted code for `const task: Task = { … }` is `const task = { … }`. There is no runtime value called `Task`, no check that runs when the program executes, and no way to ask "is this a `Task`?" without writing that check yourself. See [[b2-tsc-compilation]].

At compile time, checking an assignment `target = source` against an object type works roughly like this:

1. If the source is a fresh object literal, check for properties the target does not declare (excess property check). Report any.
2. If the target is a weak type, check that the source shares at least one property with it.
3. For each property declared in the target: if it is required, the source must have it; if the source has it, the source's property type must be assignable to the target's property type. This step is recursive for nested objects.
4. If the target has an index signature, every known property of the source must be assignable to the index signature's value type.

Because this is all compile-time analysis, **the compiler can only be as right as the types you give it**. Data from `fetch`, `JSON.parse`, `localStorage` or a form arrives as `any` or `unknown`. If you annotate it as `User` without checking, the compiler believes you, and a missing field becomes a runtime `undefined`. At those boundaries, validate the data (by hand or with a schema library) before treating it as a typed object.

```quiz
Q: Given `type Point = { x: number; y: number }`, which assignment is a compile error?
- [ ] `const p: Point = someVector;` where `someVector` has type `{ x: number; y: number }`
- [ ] `const p: Point = pixel;` where `pixel` is a variable of type `{ x: number; y: number; colour: string }`
- [x] `const p: Point = { x: 1, y: 2, colour: "red" };`
- [ ] `const p: Point = { y: 2, x: 1 };`
> The third line assigns a fresh object literal with a property `Point` does not declare, so excess property checking reports it. The second line has the same extra property but comes from a variable, so only the structural check runs, and it passes. Property order never matters, and the first line is a plain structural match.

Q: Why does TypeScript allow `const b: Task = extra` when `extra` has an extra `priority` property?
- [ ] Because `priority` has type `number`, which TypeScript ignores
- [x] Because `extra` is no longer a fresh literal, and other code may legitimately use its extra property
- [ ] Because variables are not type-checked against annotations
- [ ] Because extra properties are deleted at runtime
> Excess property checking only applies to fresh object literals. A variable's extra properties may be used elsewhere, so the assignment is checked structurally: `extra` has everything a `Task` needs. The extra property is not deleted; it still exists at runtime.
```

## Optional properties {#b2-optional-properties}

An **optional property** is a property that an object of that type may leave out entirely. You mark it with a question mark after the name: `email?: string`. It exists because real data is often incomplete. A sign-up form may not ask for a phone number, a search request may or may not include a page size, and an API may omit fields it has no value for. Without optional properties you would have to invent placeholder values for every missing field, or give up on typing the object.

```typescript title="optional.ts"
type CreateUser = { name: string; email?: string };

function save(input: CreateUser): void {
  const email = input.email ?? "none@example.com";
  console.log(input.name, email);
}

save({ name: "Ada" });
save({ name: "Linus", email: "linus@example.com" });
```

```output
Ada none@example.com
Linus linus@example.com
```

`{ name: "Ada" }` is a valid `CreateUser` because `email` is optional. Inside `save`, the type of `input.email` is `string | undefined`: reading an absent property in JavaScript gives `undefined`, and TypeScript models exactly that. The `??` operator supplies a default only when the left side is `null` or `undefined`, so `email` is a plain `string` afterwards.

### You must handle the missing case

With `strictNullChecks` (part of `strict`), TypeScript will not let you use an optional property as if it were always there:

```typescript title="optional-errors.ts"
type CreateUser = { name: string; email?: string };
const user: CreateUser = { name: "Ada" };

console.log(user.email.length); // error TS18048

if (user.email !== undefined) {
  console.log(user.email.length); // fine: narrowed to string
}
console.log(user.email?.length);  // fine: undefined if email is missing
```

```output
optional-errors.ts(4,13): error TS18048: 'user.email' is possibly 'undefined'.
```

There are three standard ways to deal with an optional property. **Narrowing** with an `if` check lets you use the value as `string` inside the block — the compiler tracks that it cannot be `undefined` there ([[b2-narrowing]]). **Optional chaining** (`?.`) short-circuits to `undefined` if the property is missing, which suits read-only paths such as rendering. A **default** with `??` or a destructuring default replaces the missing value once, at the top of a function, so the rest of the code deals with a plain type. Pick the default approach when there is a sensible fallback; narrow when the absent case needs different behaviour.

### Optional is not the same as `| null`

Two declarations that look similar mean different things:

```typescript title="optional-vs-null.ts"
type A = { email?: string };          // property may be absent
type B = { email: string | null };    // property must be present; value may be null

const a: A = {};                      // fine
const b: B = {};                      // error TS2741
const b2: B = { email: null };        // fine
```

```output
optional-vs-null.ts(5,7): error TS2741: Property 'email' is missing in type '{}' but required in type 'B'.
```

Use `?` when the field may genuinely not exist in the data. Use `| null` when the field is always present but may have "no value" — a database column that allows `NULL` is the classic case, and many JSON APIs send `"email": null` rather than omitting the key. Choosing the right one makes your types match the data you actually receive. If both can happen, say so: `email?: string | null`.

### `exactOptionalPropertyTypes`

By default TypeScript treats `email?: string` as allowing both a missing property *and* a property explicitly set to `undefined`: `{ email: undefined }` is accepted. At runtime those are different — `"email" in obj` is `true` for the second and `false` for the first, and `{ ...defaults, ...obj }` overwrites a default with `undefined` only in the second case.

The compiler option `exactOptionalPropertyTypes` (not included in `strict`) makes the distinction strict: with it on, `email?: string` means "absent, or a string", and writing `undefined` explicitly is an error unless you declare `email?: string | undefined`.

```typescript title="exact-optional.ts"
// tsc-flags: --exactOptionalPropertyTypes
type User = { name: string; email?: string };
const u: User = { name: "Ada", email: undefined }; // error TS2375
```

```output
exact-optional.ts(3,7): error TS2375: Type '{ name: string; email: undefined; }' is not assignable to type 'User' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
```

This catches a real bug class — spreading `{ theme: undefined }` over a settings object and wiping out the default — but it makes some library types awkward, which is why it is opt-in.

### `Partial` and `Required`

Two built-in utility types change optionality for a whole type at once. `Partial<T>` makes every property optional; it is the natural type for an update or "patch" payload where the caller sends only the fields that changed. `Required<T>` does the opposite, removing every `?`. They are covered in [[b2-partial]] and [[b2-required]].

### When many optionals are a smell

Optional properties are easy to over-use. Consider a request-state object:

```typescript title="loading-state.ts"
type RequestState = { loading?: boolean; data?: string[]; error?: string };
```

This type allows `{ loading: true, data: [...], error: "timeout" }` — loading, succeeded and failed all at once — and every reader must check all three fields. When a set of optional properties really encodes *which situation you are in*, a **discriminated union** describes it better: one object type per situation, each with only the fields that situation has, and a `status` field to tell them apart ([[b2-discriminated-unions]]). Keep `?` for fields that are independently optional.

A second warning: do not make an `id` optional only so that the same type can describe both "a task the user is creating" and "a task loaded from the database". Every read of `task.id` would then need a check, even for tasks that certainly have one. Use two types instead, as the worked example below shows.

## readonly properties {#b2-readonly-properties}

A **readonly property** is one that cannot be reassigned after the object is created. You mark it with the `readonly` modifier: `readonly id: string`. It documents and enforces that some fields — identifiers, creation timestamps, configuration values — are set once and then only read. The check is done by the compiler: any assignment to the property is a compile error.

```typescript title="readonly.ts"
type Version = { readonly major: number; readonly minor: number };

const v: Version = { major: 1, minor: 2 };
v.minor = 3;                          // error TS2540

const next: Version = { ...v, minor: 3 }; // fine: a new object
console.log(v, next);
```

```output
readonly.ts(4,3): error TS2540: Cannot assign to 'minor' because it is a read-only property.
```

The spread on line 6 is the idiomatic way to "change" a readonly object: build a new object that copies the old one and overrides some fields. The original is untouched, which is exactly what state-management code in React and Redux relies on — a new object reference tells the framework something changed ([[b1-immutability-fp]]).

### readonly is shallow

`readonly` protects the **property binding**, not the value stored in it. If the property holds an object or array, that inner value can still be mutated:

```typescript title="shallow.ts"
type Config = { readonly hosts: string[] };
const config: Config = { hosts: ["a.example.com"] };

config.hosts = [];               // error TS2540: the property is readonly
config.hosts.push("b.example.com"); // fine: the array itself is mutable
console.log(config.hosts);
```

```output
shallow.ts(4,8): error TS2540: Cannot assign to 'hosts' because it is a read-only property.
```

To protect the array too, its type must also be readonly: `readonly hosts: readonly string[]` (or `ReadonlyArray<string>`). A readonly array type has no `push`, `pop`, `splice` or other mutating methods, so `config.hosts.push(...)` becomes `Property 'push' does not exist on type 'readonly string[]'`. See [[b2-readonly-arrays]]. For nested objects, each level needs its own `readonly`. An `as const` assertion applies readonly to every level at once for literal data ([[b2-as-const-objects]]).

### `Readonly<T>` and readonly parameters

Writing `readonly` before every property is tedious. The utility type `Readonly<T>` produces a copy of `T` with every top-level property readonly — still shallow ([[b2-readonly-utility]]). It is particularly useful on function parameters, where it tells the caller "this function will not modify what you pass in":

```typescript title="readonly-param.ts"
type User = { name: string; email: string };

function display(user: Readonly<User>): string {
  user.name = user.name.trim(); // error TS2540
  return user.name;
}
```

```output
readonly-param.ts(4,8): error TS2540: Cannot assign to 'name' because it is a read-only property.
```

Callers can pass an ordinary mutable `User`; the restriction applies only inside the function.

### Classes and getters

On a class, a `readonly` field can be assigned in its declaration or in the constructor, and nowhere else. A property that has a `get` accessor and no `set` accessor is also treated as readonly. Both are covered with classes in [[b2-readonly-class-members]].

```typescript title="readonly-class.ts"
class Account {
  readonly id: string;
  constructor(id: string) {
    this.id = id;                 // fine: inside the constructor
  }
  get label(): string {
    return `Account ${this.id}`;
  }
  reset(): void {
    this.id = "";                 // error TS2540
  }
}
const acc = new Account("a1");
acc.label = "x";                  // error TS2540
```

```output
readonly-class.ts(10,10): error TS2540: Cannot assign to 'id' because it is a read-only property.
readonly-class.ts(14,5): error TS2540: Cannot assign to 'label' because it is a read-only property.
```

### readonly does nothing at runtime

`readonly` is erased like every other type annotation. The emitted JavaScript is an ordinary object, and code that bypasses the type checker — plain JavaScript, a value cast to `any`, a library — can still write to the property. If you need runtime protection, `Object.freeze` makes an object's own properties non-writable (shallowly, again), and in strict-mode code a write to a frozen property throws a `TypeError` ([[b1-object-freeze-seal]]).

There is also a known hole in the compile-time check: TypeScript allows a value with readonly properties to be assigned to a type with the same properties *without* `readonly`. After `const m: { major: number } = v;`, the assignment `m.major = 9` compiles and modifies `v`. The compiler treats `readonly` as a promise about how you access a property through one particular type, not as a property of the object itself. In practice this is rarely a problem, but it is why you should not rely on `readonly` as a security boundary.

```quiz
Q: Given `type A = { email?: string }` and `type B = { email: string | null }`, which value is valid for `A` but not for `B`?
- [ ] `{ email: "a@b.c" }`
- [ ] `{ email: null }`
- [x] `{}`
- [ ] None — the two types are equivalent
> An optional property may be absent, so `{}` is a valid `A`. `B` requires the property to be present (its value may be null), so `{}` is missing `email`. `{ email: null }` is valid for `B` but not `A`, which does not allow `null`.

Q: With `type Config = { readonly hosts: string[] }`, which line compiles?
- [ ] `config.hosts = []`
- [x] `config.hosts.push("x")`
- [ ] Neither
- [ ] Both
> `readonly` stops reassignment of the `hosts` property but says nothing about the array it holds. `push` mutates that array, so it compiles. To forbid it, declare `readonly hosts: readonly string[]`.
```

## Worked example: a task model

This example models a small to-do feature the way a real frontend would. It shows separate types for "creating" and "stored" data, a readonly id, an optional field with a default, and immutable updates.

```typescript title="tasks.ts"
type NewTask = {
  title: string;
  dueDate?: string;           // ISO date; many tasks have none
};

type Task = {
  readonly id: string;        // assigned once, by the store
  title: string;
  done: boolean;
  dueDate?: string;
};

let nextId = 1;

function createTask(input: NewTask): Task {
  return { id: `t${nextId++}`, done: false, ...input };
}

function toggle(task: Task): Task {
  return { ...task, done: !task.done }; // new object; the old one is unchanged
}

function describe(task: Task): string {
  const due = task.dueDate ?? "no due date";
  return `${task.id} ${task.done ? "[x]" : "[ ]"} ${task.title} (${due})`;
}

const first = createTask({ title: "Write lesson", dueDate: "2026-12-01" });
const second = createTask({ title: "Review PR" });
const firstDone = toggle(first);

console.log(describe(first));
console.log(describe(firstDone));
console.log(describe(second));
console.log(first === firstDone);
```

```output
t1 [ ] Write lesson (2026-12-01)
t1 [x] Write lesson (2026-12-01)
t2 [ ] Review PR (no due date)
false
```

Walk through the design decisions. `NewTask` describes what the user types: a title and maybe a due date. It has no `id` or `done`, because the user does not provide those. `Task` describes what the application stores. Its `id` is required and `readonly`, so every function that receives a `Task` can use `task.id` without a check, and nothing can accidentally reassign it. Had we used one type with `id?: string`, `describe` would have needed to handle a missing id that can never actually be missing.

`createTask` builds the object in one expression: defaults first (`id`, `done: false`), then the caller's fields spread on top. The return type `Task` is checked against that literal, so forgetting `done` would be a compile error. `toggle` returns a new object instead of mutating, and the last line confirms the two are different objects — the property React uses to detect a state change. `describe` handles the optional `dueDate` once, with `??`, and the rest of the function works with a plain string.

An edge case to notice: because spread copies properties in order, `{ id, done: false, ...input }` would let a caller override `id` if `input` had one. Excess property checking stops `createTask({ title: "x", id: "evil" })` written as a literal, but not a variable with an extra `id`. If that mattered, you would spread `input` first and put `id` and `done` after it.

## In real systems

**React props.** Every component's props are an object type. Optional props (`size?: "sm" | "md"`) are how components declare defaults, and excess property checking is why misspelling a prop in JSX is a compile error. See [[b2-react-component-props]].

**API contracts.** Teams describe request and response bodies as object types, often generated from an OpenAPI schema. Optional versus `| null` matters here: it should match exactly what the server sends. Because types vanish at runtime, the response is validated at the boundary — commonly with a schema library whose schema also produces the TypeScript type.

**Configuration and state.** Settings objects are typed with `Readonly<...>` so that code reading them cannot change them by accident. Redux and similar stores type their state as readonly and update it by creating new objects, which is what makes change detection by reference cheap.

**Domain models.** Mature codebases avoid one giant `User` type with every field optional. They define the shapes each stage needs — `NewUser`, `User`, `PublicUser` — and derive them from each other with utility types such as `Omit` and `Pick` ([[b2-utility-types]]).

## Trade-offs and alternatives

| Need | Tool | Trade-off |
|---|---|---|
| Entity with known fields | Object type (`type` or `interface`) | Precise; must be updated as the data changes |
| Dictionary with unknown keys | Index signature or `Record<string, V>` | Lookups assume the key exists unless `noUncheckedIndexedAccess` is on |
| Lookup table over a fixed set of keys | `Record<Union, V>` | Forces every key to be present |
| Field that may be absent | `prop?: T` | Every read must handle `undefined` |
| Field present but possibly empty | `prop: T \| null` | Callers must always send it |
| Field that must not be reassigned | `readonly` | Shallow and compile-time only |
| Unknown input to inspect | `unknown` | Needs narrowing before any use |

Structural typing has one real cost: two types that happen to share a shape are interchangeable even when they mean different things. A `UserId` and an `OrderId` that are both `string`, or a `Celsius` and a `Fahrenheit` that are both `{ value: number }`, can be mixed up without an error. When that matters, **branded types** add a phantom property that makes the shapes differ ([[b2-branded-types]]).

## Common mistakes

> [!MISTAKE] Trusting a cast instead of checking data
> `const user = (await res.json()) as User` compiles, but the compiler has not checked anything — the response could be missing fields or have different ones. Validate external data before giving it an object type, or at least check the fields you depend on.

**Expecting extra properties to be stripped.** A `Task` built from a richer object still carries the extra properties at runtime. If you send `{ ...task }` to a server or log it, they go too. Copy the fields you need explicitly.

**Using `{}` or `Object` to mean "an object".** Both accept numbers and strings. Use `object`, `unknown` or a specific shape.

**Starting with `const x = {}` and adding fields.** The inferred type `{}` has no properties, so every later assignment is an error. Build the object in one expression or annotate it with a type up front.

**Making everything optional to silence errors.** It moves the errors from the place that creates the object to every place that reads it. Prefer separate types for separate stages, or a discriminated union for separate states.

**Assuming `readonly` freezes nested data.** It only stops reassigning the property itself. Mark inner arrays as `readonly T[]` and inner objects with their own `readonly`, or use `as const` for literal data.

## Interview perspective

Interviewers use object types to check whether you understand that TypeScript's type system is structural and compile-time only.

> [!INTERVIEW] A typical question
> "Why does `const t: Task = { ...fields, extra: 1 }` fail but `const obj = { ...fields, extra: 1 }; const t: Task = obj;` succeed?" A strong answer names excess property checking, explains that it runs only on fresh object literals because their extra properties can never be observed through the target type, and adds that the second form is an ordinary structural assignability check, which allows extra properties.

Other questions to be ready for:

- **What is structural typing, and what problem does it cause?** Compatibility by shape, not name. It matches JavaScript's duck-typed style; the cost is that unrelated types with the same shape are interchangeable, which branded types address.
- **`email?: string` versus `email: string | undefined` versus `email: string | null`?** Absent-or-string; present-but-maybe-undefined; present-but-maybe-null. Mention `exactOptionalPropertyTypes` for the first two.
- **Is `readonly` deep? Does it exist at runtime?** No and no. Contrast with `Object.freeze` (shallow, runtime) and `as const` (deep, compile-time, for literals).
- **When would you use an index signature instead of fixed properties?** When keys are data, not schema — and mention that lookups should be treated as possibly missing.

## Practice

1. Write a type `Product` with a readonly `sku`, a `name`, a `price` in cents, an optional `discountPercent` and a `tags` array that cannot be mutated. Write `finalPrice(p: Product): number` that applies the discount when present.
2. Explain, without running it, which of these lines are errors and why: `const a: Product = { sku: "1", name: "x", price: 100, tags: [], colour: "red" }`, then the same object stored in a variable first and assigned afterwards.
3. Model the state of a "load comments" request first with three optional properties, then as a discriminated union. Write a `render` function for each and compare how many checks each needs.
4. Write `Record<"en" | "fr" | "de", string>` for a greeting table. Add a fourth language to the union and observe which line the compiler flags.
5. Show that `readonly` is compile-time only: assign a `Readonly<{ count: number }>` to a variable typed `{ count: number }`, mutate it, and explain what happened.

## Quick revision {#quick-revision}

- Object type: `{ name: Type; … }`, inline or named with `type` / `interface`. Erased at compile time.
- Structural typing: a value fits if it has at least the required properties with compatible types; names do not matter; extra properties are allowed.
- Excess property checking: only on **fresh object literals** assigned to a typed target. The same object via a variable is not checked for extras.
- Weak types (all properties optional) reject values with no properties in common.
- `const x = {}` has type `{}`; you cannot add properties later.
- Dictionaries: `{ [key: string]: V }` or `Record<string, V>`; lookups are typed `V` unless `noUncheckedIndexedAccess`.
- `Record<"a" | "b", V>` requires every listed key.
- `object` = non-primitives; `{}` and `Object` = anything except null/undefined; `unknown` = anything, must narrow.
- `prop?: T` — may be absent; reads give `T | undefined`; handle with narrowing, `?.` or `??`.
- `?` (absent) is not `| null` (present, empty). `exactOptionalPropertyTypes` also separates absent from explicit `undefined`.
- `Partial<T>` / `Required<T>` change optionality for every property.
- `readonly prop` — no reassignment; shallow; compile-time only; `Readonly<T>` applies to all top-level properties.
- Inner arrays need `readonly T[]`; deep literal data can use `as const`; runtime protection needs `Object.freeze`.

## Key takeaways {#key-takeaways}

- An object type is a compile-time description of shape; nothing of it survives into the running program.
- TypeScript compares object types by structure, so any value with the required properties fits, extra properties included.
- Excess property checking is a targeted typo check for fresh object literals, not a rule that objects must have exactly the declared properties.
- Optional properties model data that may be missing; every reader must handle `undefined`, so use them only for fields that are genuinely optional.
- `readonly` prevents reassigning a property through a type, but it is shallow and not enforced at runtime.
- Validate data at the boundaries where it enters the program; inside, precise object types make refactors and autocomplete reliable.
