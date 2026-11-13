---
summary: A union type says a value is one of several types; an intersection type says it is all of several types at once. You will learn how the compiler treats each, why you must narrow a union before using type-specific members, how intersections combine object shapes (and when they collapse to `never`), and how the two relate to sets of values.
difficulty: beginner
minutes: 50
objectives:
  - Declare union types and explain why only members common to every branch are accessible
  - Narrow unions with `typeof`, equality, truthiness, `in`, `instanceof` and discriminant checks
  - Distinguish `(A | B)[]` from `A[] | B[]` and predict how unions reduce
  - Combine object types with intersections and predict when a property or whole type becomes `never`
  - Explain unions and intersections in terms of sets of values, and choose between `&` and `extends`
---

## Introduction

Real data rarely has exactly one type. An ID might be a string from the URL or a number from the database. A form field is a string until it is cleared, when it becomes `null`. A function may accept a single item or a list. In plain JavaScript you handle this with runtime checks and hope every caller passes something you thought of.

TypeScript lets you write the alternatives down as a **union type**:

```typescript title="first-union.ts"
function formatId(id: string | number): string {
  return typeof id === "string" ? id.toUpperCase() : `#${id}`;
}
```

`string | number` reads "string or number". The compiler now accepts both, rejects anything else (`formatId(true)` is an error), and — importantly — makes you deal with the difference between the two before you use a string-only or number-only operation.

Unions are one of the most-used features in TypeScript. Nullable values (`User | null`), status flags (`"idle" | "loading" | "error"`), API results, React props that accept several forms, and every state machine you will model are unions. This lesson teaches what a union means to the compiler and how to work with one. It also covers the opposite operator, the **intersection** (`A & B`, "both at once"), in its own section. Patterns that build on both, such as discriminated unions for UI state, are in [[b2-union-patterns]].

## Before you start

- **Type aliases** — unions are almost always named with `type`. See [[b2-type-aliases]].
- **Primitive and object types** — `string`, `number`, `boolean`, object shapes, arrays. See [[b2-primitive-object-types]] and [[b2-object-types]].
- **JavaScript `typeof` and `instanceof`** — the runtime checks narrowing builds on. See [[b1-typeof]].
- **`null` and `undefined` in TypeScript** — see [[b2-null-undefined-ts]] and [[b2-strict-null-checks]].

## The intuition: types as sets of values

The cleanest way to understand unions and intersections is to think of every type as a **set of values**. `string` is the set of all strings. `number` is the set of all numbers. The literal type `"dark"` is a set with one element. An object type `{ name: string }` is the set of all objects that have a string `name` property — including objects that have other properties too.

With that picture:

- **`A | B`** is the union of the two sets: every value that is in `A` *or* in `B`. `string | number` contains every string and every number.
- **`A & B`** is the intersection: every value that is in `A` *and* in `B`. `string & number` is empty — no value is both — and the empty type is called `never`.

This model explains the behaviour that otherwise seems backwards. A union has *more* possible values, so you can safely do *less* with one (only what works for every possibility). An intersection of object types has *fewer* possible values — they must satisfy both shapes — so each value has *more* guaranteed properties. Keep this in mind; the rest of the lesson follows from it.

## Declaring unions

A union is written by joining types with `|`. Usually you give it a name:

```typescript title="declare-unions.ts"
type Id = string | number;
type Theme = "light" | "dark" | "system";
type MaybeUser = User | null;
type Input = string | string[];

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

interface User { name: string }
```

The leading `|` in `Shape` is optional and exists only so long unions can be formatted one member per line. Order does not matter: `string | number` and `number | string` are the same type.

Unions of **literal types**, like `Theme`, are the most common unions in frontend code. They describe a closed set of allowed values, give editor autocomplete, and reject typos: `const t: Theme = "drak"` is a compile error. [[b2-literal-types]] covers literal types in depth.

## Working with a union: only shared members are allowed

Here is the rule that defines unions. **Given a value of type `A | B`, you can only use members that exist on both `A` and `B`.** The compiler does not know which one you have, so it only allows what is safe either way:

```typescript title="shared-only.ts"
function printId(id: string | number) {
  console.log(id.toUpperCase());
}
```

```output
error TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'.
```

The error message tells you exactly which member of the union lacks the property. Members that *are* shared are fine: `id.toString()` compiles, because both strings and numbers have `toString`.

The same applies to unions of objects. If two shapes share a property, you can read it; anything else needs narrowing first:

```typescript title="shared-objects.ts"
type Fish = { name: string; swim(): void };
type Bird = { name: string; fly(): void };

function move(animal: Fish | Bird) {
  console.log(animal.name);   // fine: both have name
  animal.fly();               // error: a Fish cannot fly
}
```

```output
error TS2339: Property 'fly' does not exist on type 'Fish | Bird'.
  Property 'fly' does not exist on type 'Fish'.
```

## Narrowing: proving which member you have

To use type-specific members, you add a runtime check that the compiler understands. Inside the branch where the check passed, the compiler treats the value as the **narrowed** type. This is called **narrowing**, and TypeScript recognises many ordinary JavaScript checks:

```typescript title="narrowing.ts"
function describe(value: string | number | string[] | Date | null): string {
  if (value === null) return "nothing";                 // equality
  if (typeof value === "string") return value.trim();   // typeof
  if (typeof value === "number") return value.toFixed(2);
  if (Array.isArray(value)) return value.join(", ");    // Array.isArray
  return value.toISOString();                           // only Date is left
}

type Fish = { swim(): void };
type Bird = { fly(): void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) animal.swim();                  // in operator
  else animal.fly();
}
```

Notice the last line of `describe`: after ruling out `null`, `string`, `number` and arrays, the only possibility left is `Date`, and the compiler knows it. This is **control flow analysis** — the compiler follows `if`, `return`, `switch` and other control flow, removing members from the union as they are ruled out.

| Check | Narrows | Example |
|---|---|---|
| `typeof x === "..."` | Primitives and functions | `typeof x === "string"` |
| `x === value`, `x !== null` | Literals, `null`, `undefined` | `if (status === "error")` |
| Truthiness | Removes `null`, `undefined` (and other falsy values) | `if (user)` |
| `"prop" in x` | Object types by property | `"swim" in animal` |
| `x instanceof C` | Class instances | `x instanceof Date` |
| `Array.isArray(x)` | Arrays | `Array.isArray(input)` |
| `x.kind === "..."` | Object unions with a literal discriminant | `shape.kind === "circle"` |
| Custom type guard | Anything you can test | `isUser(x)` |

Each check has subtleties (`typeof null` is `"object"`, truthiness also removes `0` and `""`), which [[b2-narrowing]], [[b2-typeof-narrowing]], [[b2-in-operator]], [[b2-instanceof-narrowing]] and [[b2-custom-type-guards]] cover one by one.

The last two table rows deserve a preview. When every member of an object union has a common property with a different literal type — `kind: "circle"` versus `kind: "rect"` — checking that property narrows the whole object. This is a **discriminated union**, the most important union pattern in TypeScript:

```typescript title="discriminated-preview.ts"
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;   // s is the circle member here
    case "rect":
      return s.width * s.height;        // s is the rect member here
  }
}
```

[[b2-discriminated-unions]] teaches it fully, including how to make the compiler report a forgotten case ([[b2-exhaustiveness-assertnever]]).

## Nullable unions

With `strictNullChecks` (part of `strict`), `null` and `undefined` are not part of every type. A value that can be missing must say so with a union, and that is how TypeScript eliminates most "cannot read properties of null" crashes:

```typescript title="nullable.ts"
function findUser(id: string): { name: string } | undefined {
  return id === "u1" ? { name: "Ada" } : undefined;
}

const user = findUser("u2");
console.log(user.name);           // error: 'user' is possibly 'undefined'
console.log(user?.name ?? "anonymous");
```

The optional chaining operator `?.` and the nullish coalescing operator `??` are the everyday tools for these unions. An optional property `email?: string` is effectively `email: string | undefined` from the reader's side, which is why the compiler treats it the same way.

## Assigning to a union

Assigning *to* a union is the easy direction: a value is accepted if it fits *any* member. A `Cat` is a valid `Cat | Dog`. For object literals, excess property checking still applies, against the union as a whole:

```typescript title="assign-union.ts"
type A = { a: number };
type B = { b: number };

const both: A | B = { a: 1, b: 2 };   // fine: b is known to the union
const typo: A | B = { a: 1, c: 2 };   // error: c is known to neither
```

```output
error TS2353: Object literal may only specify known properties, and 'c' does not exist in type 'A | B'.
```

The first line surprises people: an object with both `a` and `b` is allowed, because it is a valid `A` with an extra property, and `b` is a property the union knows about. If you want "exactly one of these shapes", add a discriminant property or use the exclusive-props technique in [[b2-mutually-exclusive-props]]. When the union *has* a discriminant, the check becomes stricter: `const pet: Cat | Dog = { kind: "cat", barks: false }` is rejected because `barks` does not exist on `Cat`.

## Arrays of unions versus unions of arrays

Where you put the parentheses changes the meaning:

```typescript title="array-unions.ts"
const mixed: (string | number)[] = [1, "a", 2];        // each element: string or number
const either: string[] | number[] = [1, "a"];          // error
```

```output
error TS2322: Type '(string | number)[]' is not assignable to type 'string[] | number[]'.
  Type '(string | number)[]' is not assignable to type 'string[]'.
    Type 'string | number' is not assignable to type 'string'.
      Type 'number' is not assignable to type 'string'.
```

`(string | number)[]` is "an array whose elements may each be a string or a number". `string[] | number[]` is "either an array of only strings or an array of only numbers". The second is stricter, and it is the right type when a function's input really is one or the other (for example, a column of a table that is all text or all numbers).

## How unions simplify

The compiler normalises unions, and knowing the rules explains what you see in tooltips:

- **Duplicates collapse.** `string | string` is `string`.
- **Subtypes are absorbed by their supertype.** `string | "a"` is `string`, because every `"a"` is already a string. A common consequence: `type Size = "sm" | "md" | string` shows as just `string` and loses autocomplete.
- **`never` disappears.** `string | never` is `string` — adding the empty set adds nothing. This is what makes `never` useful for filtering members out of unions in advanced types.
- **`unknown` and `any` swallow everything.** `string | unknown` is `unknown`.

## How it works internally

Internally, the checker represents a union as a flat, de-duplicated list of member types. Nested unions are flattened (`(A | B) | C` becomes `A | B | C`), and literal members are absorbed by their base primitive when both are present. Member order is an internal detail; the type is the same whatever order you write.

Every operation on a union is checked against **each member**. Reading a property asks "does every member have it?" and produces the union of the property types (reading `name` on `Fish | Bird` gives `string`). Assigning a value asks "does it fit at least one member?". Narrowing works by keeping a **narrowed type** for the variable at each point in the control-flow graph; each `if` or `switch` filters the member list, and branches that rejoin union their results back together.

All of this is static. At runtime there is no union object or tag; a `string | number` is simply whatever JavaScript value is there, which is why narrowing must use real runtime checks like `typeof`. Unions are erased like every other type.

## Worked example: formatting table cells

A data table receives cell values of several types. One function must turn each into display text, and the compiler should make sure every type is handled. This program runs as-is with Node 22.18 or later, which strips TypeScript syntax natively.

```typescript title="format-cell.ts"
type CellValue = string | number | boolean | Date | null | undefined | string[];

function formatCell(value: CellValue): string {
  if (value === null || value === undefined) {
    return "-";                                  // value: null | undefined
  }
  if (typeof value === "string") {
    return value.trim() === "" ? "-" : value;    // value: string
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString("en-US") : "n/a";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);     // value: Date
  }
  return value.join(", ");                       // only string[] is left
}

const row: CellValue[] = [
  "Ada Lovelace",
  1234567.891,
  true,
  new Date(Date.UTC(1815, 11, 10)),
  null,
  ["math", "poetry"],
  "   ",
  NaN,
];

console.log(row.map(formatCell).join(" | "));
```

```output
Ada Lovelace | 1,234,567.891 | Yes | 1815-12-10 | - | math, poetry | - | n/a
```

Follow the union as it shrinks. It starts with seven members. The first check removes `null` and `undefined`; after it, `value` is `string | number | boolean | Date | string[]`. Each `typeof` check removes one primitive. `instanceof Date` removes `Date`. By the final line, only `string[]` remains, so `value.join` compiles with no cast. If you deleted the `boolean` branch, the final line would fail with `Property 'join' does not exist on type 'boolean | string[]'`, pointing you straight at the unhandled case.

Two details worth noticing. `NaN` is a `number`, so the type system cannot distinguish it; the runtime check `Number.isFinite` handles it. And the date is built with `Date.UTC` so the output does not depend on the machine's time zone. If you add a new type to `CellValue` later — say `bigint` — the final line stops compiling until `formatCell` handles it. That is the real value of unions: when the data changes, the compiler lists every place that needs updating.

## Intersection types {#b2-intersections}

An **intersection type** `A & B` describes values that are of type `A` *and* of type `B` at the same time. Where a union widens the set of allowed values, an intersection narrows it. For object types, the practical effect is that the intersection has **all the properties of both**, which makes `&` the tool for combining shapes.

### Combining object shapes

```typescript title="intersection-basic.ts"
type Timestamps = { createdAt: Date; updatedAt: Date };
type SoftDelete = { deletedAt: Date | null };
type User = { id: string; name: string };

type UserRecord = User & Timestamps & SoftDelete;

const row: UserRecord = {
  id: "1",
  name: "Ada",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
```

A `UserRecord` must have all five properties; leave any out and it is rejected. This is why intersections are used to add cross-cutting fields — timestamps, audit info, IDs — to many entity types without repeating them.

The set picture explains why "and" gives *more* properties. `{ id: string }` is the set of all objects that have an `id`; `{ createdAt: Date }` is the set of all objects that have a `createdAt`. Objects in both sets have both properties. Fewer values qualify, and each one is guaranteed more.

### Intersections in generic functions

Intersections appear naturally when a function adds properties to whatever it is given:

```typescript title="stamp.ts"
type Timestamps = { createdAt: Date; updatedAt: Date };
type Versioned = { version: number };

function stamp<T extends object>(entity: T, now: Date): T & Timestamps & Versioned {
  return { ...entity, createdAt: now, updatedAt: now, version: 1 };
}

const note = stamp({ id: "n1", text: "Buy milk" }, new Date(Date.UTC(2026, 0, 1)));

console.log(note.text, note.version, note.createdAt.toISOString());

const merged = Object.assign({ a: 1 }, { b: "two" });   // type: { a: number } & { b: string }
console.log(merged.a + merged.b.length);
```

```output
Buy milk 1 2026-01-01T00:00:00.000Z
4
```

`stamp` keeps everything the caller's object had (`T`) and adds the new fields, so `note.text` is still known. The standard library types `Object.assign(target, source)` the same way: its return type is `T & U`. Intersections are also the mechanism behind branded types ([[b2-type-alias-patterns]]), where `string & { __brand: "UserId" }` adds a phantom property to a primitive.

### Conflicts produce `never`

If both sides declare the same property with incompatible types, that property's type is itself an intersection — and it may be empty:

```typescript title="conflict.ts"
type Conflict = { x: number } & { x: string };
type X = Conflict["x"];      // string & number, which is never

const c: Conflict = { x: 1 };
```

```output
error TS2322: Type 'number' is not assignable to type 'never'.
```

No error appears where `Conflict` is declared; you only find out when you try to create one. When the conflicting property is a literal discriminant, TypeScript (since version 3.9) reduces the **whole** intersection to `never`, and says so:

```typescript title="discriminant-conflict.ts"
type Cat = { kind: "cat"; meows: boolean };
type Dog = { kind: "dog"; barks: boolean };

declare const impossible: Cat & Dog;
impossible.kind;
```

```output
error TS2339: Property 'kind' does not exist on type 'never'.
  The intersection 'Cat & Dog' was reduced to 'never' because property 'kind' has conflicting types in some constituents.
```

Intersecting incompatible primitives does the same: `string & number` is `never`. Seeing `never` where you expected a usable type is almost always a sign that two parts of an intersection disagree.

### Intersections versus `interface extends`

`interface C extends A, B {}` and `type C = A & B` both combine shapes. The differences matter in practice. `extends` checks for conflicts at the declaration and reports them there (error TS2320 or TS2430), while `&` silently produces `never`. `extends` only works with object types whose members are known; `&` works with anything, including generic type parameters and primitives (as in `T & Timestamps` above, which `extends` cannot express). And the TypeScript team's performance guidance prefers `extends` for large object hierarchies because interface relationships are cached. So: use `extends` for hierarchies of named object types ([[b2-extending-interfaces]]); use `&` for generic composition, branding and combining types you do not control.

### Intersections of functions and unions

Two more behaviours are useful to recognise. An intersection of function types acts like an **overloaded** function: a value of type `((x: string) => string) & ((x: number) => number)` can be called with either argument type, and each call gets the matching return type. And intersection **distributes over union**, as in algebra: `(A | B) & C` is the same type as `(A & C) | (B & C)`. That is how `type Pet = (Cat | Dog) & { name: string }` gives every pet a name while keeping the cat/dog distinction.

The mirror image applies when *calling* a union of functions. If `fn` is `((x: string) => void) | ((x: number) => void)`, you do not know which function you have, so an argument must be acceptable to both: the parameter type becomes `string & number`, which is `never`, and no call compiles. Union of functions, intersection of parameters — the set model again.

## In real systems

**Nullable data everywhere.** API fields that may be absent, `document.querySelector` (which returns `Element | null`), `Array.prototype.find` (which returns `T | undefined`) — the standard library uses unions to make "might not exist" explicit.

**Component props.** `size: "sm" | "md" | "lg"`, `children: ReactNode` (itself a big union), `value: string | number` on inputs. Library props such as `className?: string | ((state) => string)` accept several forms through unions.

**State machines.** Loading state, form state and connection state are modelled as discriminated unions so that impossible combinations cannot be represented ([[b2-union-patterns]], [[b2-remote-data-pattern]]).

**Composing entity types.** Database rows as `Entity & Timestamps`, React components that accept their own props plus native attributes as `OwnProps & React.HTMLAttributes<HTMLDivElement>`.

## Trade-offs and alternatives

Unions model real variation precisely and force every case to be handled; their cost is that each use needs narrowing, and wide unions produce long error messages. A forgotten case is only caught if you write an exhaustiveness check ([[b2-exhaustiveness-assertnever]]). The alternative — one object with many optional fields — is simpler to declare but allows nonsensical combinations and pushes checks to runtime.

Intersections compose shapes without class inheritance and work with generics; their costs are silent `never` on conflicts and harder-to-read expanded types in error messages. `interface extends` is the safer alternative for named hierarchies.

## Common mistakes

> [!MISTAKE] Using a type-specific member without narrowing
> `function len(x: string | string[]) { return x.length; }` happens to work because both have `length`, but `x.toUpperCase()` does not. When the compiler says a property does not exist on one member of the union, add the check it needs rather than casting with `as`.

**Confusing `|` with `&`.** "A user or an admin" is `User | Admin`. "Something with both user fields and timestamps" is `User & Timestamps`. Writing `string & number` when you meant "string or number" produces `never` and baffling errors.

**Truthiness narrowing that removes valid values.** `if (count)` rules out `undefined`, but it also rules out `0`. Use `count !== undefined` when zero is a legitimate value.

**Absorbing literals with a wide type.** `type Variant = "primary" | "secondary" | string` collapses to `string`. If you need "these suggestions or any string" with autocomplete, the community idiom is `"primary" | "secondary" | (string & {})`, which prevents the collapse.

**Expecting `A | B` to mean "exactly one of".** An object with properties from both members can satisfy a non-discriminated union. Add a discriminant.

**Missing a conflict in an intersection.** If properties unexpectedly have type `never`, look for two parts declaring the same key differently.

## Interview perspective

**"What is the difference between a union and an intersection?"** Use the set model: union is "in A or B", intersection is "in A and B". Then the practical consequence: on a union you can only use shared members until you narrow; an intersection of object types has all members of both. Mention that incompatible intersections become `never`.

**"How do you work with a value of type `string | number`?"** Narrowing with `typeof`; mention control flow analysis and that narrowing must use runtime checks because types are erased.

**"What is `(string | number)[]` versus `string[] | number[]`?"** Mixed array versus one of two homogeneous arrays.

**Follow-up: "Why can't I call a union of functions?"** Because the argument must satisfy every possible function, so parameter types intersect; incompatible parameters intersect to `never`.

**Follow-up: "When would you use `&` instead of `extends`?"** For generic composition (`T & Extra`), branding, and combining types you do not own; `extends` for named hierarchies, because it reports conflicts early.

## Practice

1. Write `function toArray(input: string | string[]): string[]` using `Array.isArray`. Then generalise it to `toArray<T>(input: T | T[]): T[]`.
2. Write `function len(value: string | unknown[] | Map<string, unknown> | null): number` that returns `0` for `null`, `.size` for maps and `.length` otherwise. Hover `value` in each branch.
3. Declare `type Size = "sm" | "md" | string` and inspect it in your editor. Fix it so autocomplete suggests `"sm"` and `"md"` but any string is still allowed.
4. Write `type WithId<T> = T & { id: string }` and a function `withId<T extends object>(obj: T): WithId<T>` that adds a random ID.
5. Create `type A = { status: "on" }` and `type B = { status: "off" }`, then declare a variable of type `A & B`. Read the error and explain it using the set model.

```quiz
Q: `function f(x: string | number) { ... }`. Which expression compiles inside `f` without narrowing?
- [ ] `x.toUpperCase()`
- [ ] `x.toFixed(2)`
- [x] `x.toString()`
- [ ] `x * 2`
> On a union you may only use members that every member type has. Both strings and numbers have `toString`; `toUpperCase` is string-only, `toFixed` is number-only, and `*` requires a number (or bigint), so the other three need narrowing first.
```

```quiz
Q: What is the type of property `x` in `{ x: number } & { x: string }`?
- [ ] `number | string`
- [ ] `string`, because the later type wins
- [x] `never`
- [ ] A compile error at the declaration
> Intersecting object types intersects the types of shared properties, and `number & string` has no values, so it is `never`. No error appears at the declaration; you discover it when you try to assign a value. `interface extends` would have reported the conflict immediately.
```

```quiz
Q: Which value is accepted by `string[] | number[]`?
- [x] `[1, 2, 3]`
- [ ] `[1, "two"]`
- [ ] `["a", 2]`
- [ ] All three
> The type means "an array of only strings, or an array of only numbers". Mixed arrays fit `(string | number)[]` instead.
```

```quiz
Q: In the set-of-values model, why does `User & Timestamps` have more properties than `User`?
- [ ] Because `&` adds properties to the objects at runtime
- [x] Because only objects that are in both sets qualify, so each qualifying object is guaranteed both sets of properties
- [ ] Because intersections are unions of property names
- [ ] Because `Timestamps` overrides `User`
> An intersection contains fewer values than either part, and each of those values satisfies both shapes. Nothing happens at runtime; types are erased.
```

## Quick revision {#quick-revision}

- `A | B`: value is in A or B. Order and duplicates do not matter; leading `|` allowed.
- On a union, only members common to all branches are accessible; error names the branch that lacks the member.
- Narrow with `typeof`, equality, truthiness, `in`, `instanceof`, `Array.isArray`, discriminant checks, custom guards; control flow analysis tracks the remaining members.
- Discriminated union: shared literal property (`kind`) narrows whole objects; pair with exhaustiveness checks.
- `strictNullChecks` makes missing values explicit: `T | null`, `T | undefined`; use `?.` and `??`.
- Assigning to a union: fits any member; excess property checks use the union's combined keys (stricter with a discriminant).
- `(A | B)[]` mixed elements vs `A[] | B[]` homogeneous arrays.
- Reduction: `string | "a"` → `string`; `T | never` → `T`; `T | unknown` → `unknown`. Keep autocomplete with `| (string & {})`.
- `A & B`: value is in both; object intersection has all properties of both.
- Conflicting property types → that property is `never`; conflicting literal discriminants → whole intersection `never` (TS 3.9+); `string & number` → `never`.
- `T & Extra` for generic composition; `Object.assign` returns `T & U`; brands use `&`.
- `(A | B) & C` = `(A & C) | (B & C)`. Intersection of functions ≈ overloads; calling a union of functions intersects parameters.
- Prefer `interface extends` for named hierarchies (early errors, caching); `&` for generics and types you do not own.

## Key takeaways {#key-takeaways}

- Think of types as sets: a union is "either", an intersection is "both", and `never` is the empty set.
- A union lets you do only what is safe for every member until you narrow it with a runtime check the compiler understands.
- Control flow analysis removes union members as you rule them out, so the compiler can confirm every case is handled.
- Intersections combine object shapes and generic types, but conflicting members silently become `never`.
- Choose `|` to model alternatives and `&` to add guarantees; use `interface extends` when you want conflicts reported at the declaration.
