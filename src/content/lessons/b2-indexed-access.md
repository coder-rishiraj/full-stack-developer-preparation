---
summary: An indexed access type `T[K]` looks up the type of property `K` on type `T`, the same way `obj[key]` looks up a value. You will learn how lookups work with literal keys, unions of keys, nested paths, arrays and tuples, optional properties and unions of objects, and how `T[K]` lets generic code return the exact type of the property it reads.
difficulty: intermediate
minutes: 40
objectives:
  - Write indexed access types for single keys, unions of keys and nested paths
  - Extract element types from arrays and tuples with `T[number]` and numeric indexes
  - Predict how optional properties, index signatures and union object types affect `T[K]`
  - Use `T[K]` with `K extends keyof T` to type generic helpers such as `pluck`
  - Explain how indexed access underpins `Pick` and other mapped types
---

## Introduction

Suppose an API returns a large response type, and a component only needs the type of one deeply nested field:

```typescript title="api-types.ts"
interface OrderResponse {
  data: {
    order: {
      id: string;
      status: "pending" | "paid" | "shipped";
      lines: { sku: string; qty: number; price: number }[];
    };
  };
}
```

You could write `type Status = "pending" | "paid" | "shipped"` again, but then the two copies can drift. What you want is to *point at* the existing type and say "the type of `data.order.status` in there". TypeScript's **indexed access type** does exactly that:

```typescript title="lookup.ts"
type Status = OrderResponse["data"]["order"]["status"]; // "pending" | "paid" | "shipped"
type Line = OrderResponse["data"]["order"]["lines"][number];
// { sku: string; qty: number; price: number }
```

The syntax mirrors JavaScript's bracket access. At runtime, `obj["status"]` reads a *value*; at the type level, `T["status"]` reads the *type* of that property. Indexed access types let you derive types from other types without duplication, and in generic code they let a function's return type depend on which key it was given — the partner of [[b2-keyof]] in nearly every type-safe property helper.

## Before you start

- **Object types and interfaces** — property declarations, optional properties. See [[b2-object-types]] and [[b2-optional-properties]].
- **`keyof`** — the union of an object type's keys. See [[b2-keyof]].
- **Arrays and tuples** — `string[]` versus `[string, number]`. See [[b2-typed-arrays]] and [[b2-tuples]].
- **Generics** — type parameters and constraints. See [[b2-generics]] and [[b2-generic-constraints]].

## The intuition

Picture a type as a table of property names and their types. An indexed access type is a lookup in that table: you give it a row name (or several), and it returns what is in the type column.

| Key | Type |
|---|---|
| `"id"` | `string` |
| `"status"` | `"pending" \| "paid" \| "shipped"` |
| `"lines"` | `{ sku: string; qty: number; price: number }[]` |

`Order["status"]` returns one cell. `Order["id" | "status"]` returns the union of two cells. Looking up a row that is not in the table is an error, just as the compiler rejects `order.missing`. Nothing about this runs at runtime: the table is the compiler's knowledge of the type.

## Looking up properties

### Single keys and nested paths

The index must be a **type**, usually a string literal type. Lookups chain, so you can walk into nested objects one bracket at a time:

```typescript title="basic.ts"
type User = {
  id: string;
  name: string;
  address: { city: string; zip: string };
};

type UserId = User["id"];                 // string
type Address = User["address"];           // { city: string; zip: string }
type City = User["address"]["city"];      // string
```

Two syntax rules catch everyone once:

```typescript title="syntax-rules.ts"
type User = { id: string; name: string };

type A = User.id;          // error: dot syntax is for namespaces
const key = "id";
type B = User[key];        // error: key is a value
type C = User[typeof key]; // string: typeof turns the value into the type "id"
type D = User["email"];    // error: no such property
```

```output
error TS2713: Cannot access 'User.id' because 'User' is a type, but not a namespace. Did you mean to retrieve the type of the property 'id' in 'User' with 'User["id"]'?
error TS2749: 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
error TS2339: Property 'email' does not exist on type 'User'.
```

Dot syntax at the type level means "a member of a namespace", so it cannot be used for properties. And because the brackets hold a type, a variable must be converted with `typeof` first ([[b2-typeof]]). (The compiler also reports `TS2538: Type 'key' cannot be used as an index type` for line B.)

### Unions of keys

If the index is a union, the result is the union of each lookup:

```typescript title="union-keys.ts"
type User = { id: string; age: number; active: boolean };

type IdOrAge = User["id" | "age"];        // string | number
type AnyValue = User[keyof User];         // string | number | boolean
```

`T[keyof T]` — "the type of any value of `T`" — is common enough that people often name it `ValueOf<T>`. It is how you get the union of the values of a constant object, as shown in [[b2-keyof-typeof-patterns]].

### Optional properties

Looking up an optional property includes `undefined`, because the property may be absent:

```typescript title="optional.ts"
type Profile = { name: string; bio?: string };

type Bio = Profile["bio"];                 // string | undefined
type BioRequired = Required<Profile>["bio"]; // string
type BioDefined = NonNullable<Profile["bio"]>; // string
```

This holds with or without the `exactOptionalPropertyTypes` compiler option: that option changes what you may *write* into an optional property (it forbids assigning `undefined` explicitly), but reading one still may yield `undefined`, so `T["bio"]` keeps it. When you want the value type without `undefined`, wrap the lookup in `NonNullable` or look it up on `Required<T>`.

## Arrays and tuples

Arrays have a numeric index signature, so indexing an array type with `number` gives its element type:

```typescript title="arrays.ts"
type Names = string[];
type Name = Names[number];                     // string

const users = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Lin" },
];
type UserRow = (typeof users)[number];         // { id: string; name: string }
type UserName = (typeof users)[number]["name"]; // string
```

`(typeof users)[number]` reads as "the type of an element of `users`" and is the standard way to get an element type from an array value. The parentheses are optional — `typeof users[number]` parses the same way — but they make the meaning clear.

Tuples know their length and the type at each position, so numeric literal indexes work:

```typescript title="tuples.ts"
type Entry = [string, number, boolean];

type First = Entry[0];        // string
type Len = Entry["length"];   // 3
type Any = Entry[number];     // string | number | boolean
type Oops = Entry[3];         // error: no element at index 3

type Rest = [string, ...number[]];
type RestLen = Rest["length"]; // number
type Second = Rest[1];         // number
```

```output
error TS2493: Tuple type 'Entry' of length '3' has no element at index '3'.
```

For a fixed tuple, `T[number]` is the union of all element types and `T["length"]` is a literal number. Once a tuple has a rest element, its length is just `number` and positions after the fixed part have the rest element's type. Combined with `as const` arrays, `T[number]` is how a list of allowed values becomes a union type: `typeof ROLES[number]`.

### Index signatures

For a type with an index signature, index with the signature's key type:

```typescript title="index-signature.ts"
type Scores = { [player: string]: number };
type Score = Scores[string];   // number
type AlsoScore = Scores[number]; // number: numeric keys are strings at runtime
```

Note that `Scores[string]` is `number`, not `number | undefined`, even though a given player may be missing. The `noUncheckedIndexedAccess` compiler option adds `undefined` when you *read* `scores[name]` in an expression, but it does not change the indexed access type. See [[b2-index-signatures]].

## Unions of object types

Indexing a union of objects distributes over the members: `(A | B)[K]` becomes `A[K] | B[K]`. The key must exist on *every* member:

```typescript title="union-objects.ts"
type Circle = { kind: "circle"; radius: number };
type Rect = { kind: "rect"; width: number; height: number };
type Shape = Circle | Rect;

type Kind = Shape["kind"];      // "circle" | "rect"
type R = Shape["radius"];       // error: not on every member
```

```output
error TS2339: Property 'radius' does not exist on type 'Shape'.
```

`Shape["kind"]` is a neat way to get the list of discriminants of a discriminated union ([[b2-discriminated-unions]]). To get a single member by its discriminant, combine with `Extract`: `Extract<Shape, { kind: "rect" }>`.

## Indexed access in generics

In generic code the key is often a type parameter `K` constrained by `keyof T`. Then `T[K]` is the type of "whatever property `K` turns out to be":

```typescript title="pluck.ts"
function pluck<T, K extends keyof T>(rows: readonly T[], key: K): T[K][] {
  return rows.map(row => row[key]);
}

const products = [
  { sku: "A1", name: "Pen", price: 2.5 },
  { sku: "B2", name: "Pad", price: 4 },
];

const prices = pluck(products, "price"); // number[]
const names = pluck(products, "name");   // string[]
console.log(prices, names);
```

```output
[ 2.5, 4 ] [ 'Pen', 'Pad' ]
```

Inside the function, `row[key]` has type `T[K]`, which the compiler keeps **deferred** — it cannot resolve it until `T` and `K` are known. At the call `pluck(products, "price")`, `T` becomes the product type, `K` becomes `"price"`, and `T[K][]` resolves to `number[]`. Without indexed access the best return type available would be `unknown[]` or the union of all property types.

The constraint matters: in a function `f<T>(o: T, k: string)`, the expression `o[k]` is rejected, because `string` is not known to be a key of `T`. `K extends keyof T` is what makes `T[K]` legal. (Reading through `T[K]` is safe; writing through it with a union-typed key is not, as explained in [[b2-keyof]].)

### The connection to `Pick` and mapped types

Mapped types build an object type by looping over keys, and almost always use indexed access to copy each property's type:

```typescript title="pick.ts"
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

type Product = { sku: string; name: string; price: number };
type PriceTag = MyPick<Product, "name" | "price">; // { name: string; price: number }
```

For each `P` in the chosen keys, the new property's type is `T[P]` — a lookup in the original. That one line is the built-in `Pick` ([[b2-pick]]); `Partial`, `Readonly` and `Record`-based helpers follow the same shape ([[b2-mapped-types]]).

## How it works internally

An indexed access type is resolved entirely by the type checker. For a concrete object type and a literal key, it looks up the property symbol and returns its type, adding `undefined` for optional properties. For a union key it resolves each member and unions the results. For a union *object* type it distributes, resolving the lookup on each member. For arrays and tuples, numeric literal keys select tuple elements and `number` falls back to the numeric index signature.

When either side is a type parameter, the checker creates a deferred `T[K]` type and remembers the constraint. That is why `T[K]` can appear in a function body and return type before any call fixes `T`. When the generic is instantiated, the deferred type is re-evaluated with the real arguments. None of this produces JavaScript: indexed access types are erased, and the emitted code is the ordinary `row[key]`.

## Worked example: typing a settings form from one model

A settings page has one input per field. The change handler must accept only real field names and only values of the matching type.

```typescript title="settings-form.ts"
interface Settings {
  displayName: string;
  emailDigest: "daily" | "weekly" | "never";
  maxResults: number;
  beta?: boolean;
}

type FieldErrors = { [K in keyof Settings]?: string };

function updateField<K extends keyof Settings>(
  current: Settings,
  key: K,
  value: Settings[K],
): Settings {
  return { ...current, [key]: value };
}

function validate(s: Settings): FieldErrors {
  const errors: FieldErrors = {};
  if (s.displayName.trim() === "") errors.displayName = "Required";
  if (s.maxResults < 1 || s.maxResults > 100) errors.maxResults = "Must be 1-100";
  return errors;
}

let settings: Settings = { displayName: "Ada", emailDigest: "weekly", maxResults: 20 };
settings = updateField(settings, "emailDigest", "daily");
settings = updateField(settings, "maxResults", 500);
// updateField(settings, "emailDigest", "hourly"); // error: not a valid digest value

console.log(settings);
console.log(validate(settings));
```

```output
{ displayName: 'Ada', emailDigest: 'daily', maxResults: 500 }
{ maxResults: 'Must be 1-100' }
```

`Settings[K]` ties the value to the key: for `"emailDigest"` it is the three-way union, for `"maxResults"` it is `number`, and for the optional `"beta"` it is `boolean | undefined`. The mapped type `FieldErrors` uses `keyof Settings` to give every field an optional error message. The value `500` type-checks because it is a `number`; range rules are runtime facts, which is why `validate` exists. Types guarantee shape; validation guarantees content.

## In real systems

- **Deriving from generated types.** Code generated from OpenAPI or GraphQL schemas produces large nested types; components pick what they need with `paths["/orders"]["get"]["responses"][200]`-style lookups instead of redeclaring them.
- **React props.** `React.ComponentProps<typeof Button>["onClick"]` extracts the type of one prop from a component you do not own.
- **Element types of constants.** `typeof SUPPORTED_LOCALES[number]` turns an `as const` array into a union.
- **Library typings.** Event maps such as `HTMLElementEventMap[K]` give each event name its event object type, and state libraries type selectors as `State[K]`.

## Trade-offs and alternatives

Indexed access keeps one source of truth and makes generic helpers precise. Its costs are readability and error quality: a chain like `A["b"]["c"][number]["d"]` is harder to read than a named interface, and when a lookup fails deep inside a generic, the error can be long. A good compromise is to give important lookups a name (`type OrderLine = ...`) so the rest of the code reads naturally.

Alternatives are declaring the nested types separately and composing them (clearer, but you must export each piece), or duplicating the type (simplest, and the first thing to drift).

## Common mistakes

> [!MISTAKE] Using dot syntax
> `User.address` is not a type. Write `User["address"]`. Dot syntax at the type level only works for namespaces.

- **Indexing with a variable.** `User[key]` fails because `key` is a value; use `User[typeof key]`, or better, type the variable as a key type.
- **Forgetting `undefined` on optional properties.** `Profile["bio"]` includes `undefined`. Use `NonNullable<...>` or `Required<Profile>["bio"]` if you need the bare type.
- **Expecting a missing key on a union to be `never`.** `Shape["radius"]` is an error, not `never`; narrow to the member first with `Extract`.
- **Assuming `T[number]` is the first element.** For a tuple it is the union of all elements; use `T[0]` for the first.
- **Writing `o[k]` with `k: string` in generic code.** Constrain the key: `K extends keyof T`.

## Interview perspective

- *"What is `User["id" | "name"]`?"* — The union of both property types. Mention that a union index distributes.
- *"How do you get an array's element type?"* — `Arr[number]`, and for a value, `(typeof arr)[number]`; for tuples, numeric literals select positions.
- *"Type a `pluck` function."* — `<T, K extends keyof T>(rows: T[], key: K): T[K][]`, explaining why `K` must be constrained and how `T[K]` resolves at the call site.
- *"How is `Pick` defined?"* — `{ [P in K]: T[P] }`; a strong answer explains that `T[P]` is an indexed access performed once per key.
- Follow-up traps: indexing optional properties, `(A | B)["onlyOnA"]`, and `Tuple[number]` versus `Tuple[0]`.

## Practice

1. From `OrderResponse` at the top of this lesson, derive types for one order line's `sku` and for the whole `lines` array.
2. Write `type ValueOf<T> = T[keyof T]` and use it on `{ a: 1; b: "x" }`. What does it give for an array type, and why?
3. Write `type ElementOf<T extends readonly unknown[]> = T[number]` and test it with a tuple, a `readonly` array and a tuple with a rest element.
4. Extend `updateField` so it rejects `"beta"` updates unless a second argument `allowBeta: true` is passed. Which part of the signature has to change?
5. Predict `[string, number]["length"]` and `string[]["length"]`, then explain the difference.

## Quick revision {#quick-revision}

- `T[K]` is the type of property `K` on `T`; `K` must be a type (literal, union, `keyof T`, `number`, `string`).
- Chain for nesting: `T["a"]["b"]`. No dot syntax. Convert values with `typeof`.
- Union index → union result; `T[keyof T]` = all value types.
- Optional property → includes `undefined` (also with `exactOptionalPropertyTypes`).
- Arrays: `T[number]` = element type; tuples: `T[0]`, `T["length"]` literal, `T[number]` union of elements.
- Index signatures: `T[string]` gives the value type, without `undefined`.
- Union of objects: `(A | B)[K]` = `A[K] | B[K]`; `K` must exist on every member.
- Generics: `K extends keyof T` makes `T[K]` legal; resolution is deferred to the call site.
- Mapped types copy property types with `T[P]`: `Pick<T, K> = { [P in K]: T[P] }`.

## Key takeaways {#key-takeaways}

- Indexed access types are bracket lookups performed on types instead of values.
- They let you derive any nested property or element type from an existing type, keeping one source of truth.
- With `K extends keyof T`, `T[K]` makes a generic function's types follow the key it is given.
- Optional properties, unions and tuples each have specific rules; most surprises come from `undefined` and union distribution.
- Nearly every utility and mapped type is a loop of indexed accesses.

```quiz
Q: `type Profile = { name: string; avatar?: string }`. What is `Profile["avatar"]`?
- [ ] `string`
- [x] `string | undefined`
- [ ] `string | null`
- [ ] An error, because `avatar` is optional
> Optional properties may be absent, so a lookup includes `undefined`. Plain `string` is what `Required<Profile>["avatar"]` or `NonNullable<Profile["avatar"]>` gives. Optional properties can be indexed like any other.
```

```quiz
Q: For `type Tup = [string, number, boolean]`, what is `Tup[number]`?
- [ ] `string`
- [ ] `3`
- [x] `string | number | boolean`
- [ ] `number`
> Indexing with `number` asks for "the type at any numeric position", which for a tuple is the union of its element types. `string` would be `Tup[0]`, and `3` is `Tup["length"]`.
```

```quiz
Q: Why does `function get<T>(o: T, k: string) { return o[k]; }` fail, while `get<T, K extends keyof T>(o: T, k: K)` works?
- [x] Only the constrained version guarantees that `k` is a key of `T`, so `T[K]` is a valid lookup
- [ ] Generic functions cannot use bracket access unless `K` is declared
- [ ] `string` keys are not allowed in TypeScript
- [ ] The first version works at runtime but returns `never`
> `T` could be any type, and an arbitrary string is not known to index it, so the compiler reports an implicit `any`. With `K extends keyof T`, the lookup `T[K]` is guaranteed to exist. Bracket access with string keys is fine on types that have them.
```
