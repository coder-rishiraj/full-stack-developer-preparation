---
summary: The `keyof` operator turns an object type into the union of its property names. You will learn exactly what `keyof` produces for ordinary objects, index signatures, arrays, unions and classes, and how `K extends keyof T` lets generic helpers accept only real property names while keeping each property's value type.
difficulty: intermediate
minutes: 45
objectives:
  - Predict the result of `keyof` for object types, index signatures, unions, intersections and classes
  - Write generic helpers with `K extends keyof T` that reject invalid property names at compile time
  - Explain why `keyof` is a compile-time union and how it differs from `Object.keys` at runtime
  - Use `keyof` inside mapped types to build types such as `Partial` and `Readonly`
  - Debug the common traps — keys widened to `string`, unsafe writes through `T[K]`, and `for...in` keys typed as `string`
---

## Introduction

A large part of everyday JavaScript is code that works with property *names*: sorting a table by a column, reading a field chosen by the user, building a form where each input is tied to a field of a model, emitting events by name. In plain JavaScript those names are strings, and a string can be anything:

```typescript title="untyped.ts"
function getField(obj: any, name: string) {
  return obj[name];
}

const user = { id: "u1", name: "Ada", age: 36 };
console.log(getField(user, "nmae")); // typo: no warning anywhere
```

```output
undefined
```

The typo `"nmae"` is accepted by the compiler, returns `undefined` at runtime, and the result is typed `any`, so nothing downstream complains either. This is what people call **stringly-typed** code: the meaning lives in strings the compiler cannot check.

TypeScript's answer is the **`keyof` operator**. Given an object type, `keyof` produces the union of that type's property names as string literal types. For the `user` above, the property names are `"id" | "name" | "age"`. Once the set of valid names is a type, you can make a function parameter accept *only* those names, get autocomplete for them, and have every caller fail to compile when a property is renamed. Combined with indexed access (`T[K]`, covered in [[b2-indexed-access]]), it also lets the function return the correct value type for whichever key was passed.

`keyof` is small, but it is the foundation for a large part of TypeScript's type-level programming: `Pick`, `Omit`, `Partial`, `Record` and every mapped type iterate over `keyof T`. Understanding exactly what it produces — including the surprising cases — makes those tools predictable.

## Before you start

- **Object types and interfaces** — how TypeScript describes the shape of an object. See [[b2-object-types]] and [[b2-interfaces]].
- **Literal types and unions** — `"id" | "name"` is a union of string literal types. See [[b2-literal-types]] and [[b2-unions]].
- **Generics** — functions with type parameters such as `<T>`. See [[b2-generics]]; constraints with `extends` are in [[b2-generic-constraints]].
- **Type aliases** — `type X = ...`. See [[b2-type-aliases]].

## The intuition

Think of an object type as a building and its properties as labelled doors. `keyof` walks around the building and writes down the label of every door. The result is not the doors themselves (the values) but the list of labels — and that list is a *type*, a union of literal names, not an array you can loop over.

```typescript title="intuition.ts"
interface User {
  id: string;
  name: string;
  age?: number;
}

type UserKey = keyof User; // "id" | "name" | "age"

const ok: UserKey = "name";
const bad: UserKey = "email"; // error
```

```output
error TS2322: Type '"email"' is not assignable to type 'keyof User'.
```

Two details are worth noticing straight away. First, the optional property `age` is still a key: `keyof` is about which names exist on the type, not whether the value is guaranteed to be present. Second, the error message says `keyof User` rather than the expanded union. The compiler keeps `keyof User` as a deferred form until it needs the members; hovering over `UserKey` in an editor shows `keyof User`, and the members appear in autocomplete and when the union is compared with something.

The analogy breaks in one important place: the list is written down at **compile time** from the type, not from the object that exists at runtime. If an object at runtime carries extra properties the type does not mention, `keyof` knows nothing about them. That gap is the reason `Object.keys` is typed as `string[]`, explained later in this lesson.

## What `keyof` produces

### Ordinary object types

For an object type written with named properties, `keyof` gives the union of those names. Numeric property names and `unique symbol` keys are included as numeric literal and symbol types:

```typescript title="key-kinds.ts"
const tag = Symbol("tag");

type Mixed = {
  x: string;
  0: boolean;
  [tag]: number;
};

type MixedKey = keyof Mixed; // 0 | "x" | typeof tag
```

`0` appears as the number literal `0`, not the string `"0"`. JavaScript turns every non-symbol property key into a string at runtime, but TypeScript keeps numeric-looking names as number literals so that arrays and tuples can be described accurately.

### The full possible key type: `keyof any`

The set of every value JavaScript allows as a property key is `string | number | symbol`, and TypeScript names it `PropertyKey`. `keyof any` evaluates to exactly that union, which is why you will see generic code constrain a key parameter with `K extends keyof any` or `K extends PropertyKey` — both mean "anything that can be a property key".

### Index signatures widen the result

An **index signature** says an object can have any number of keys of some kind, for example `{ [key: string]: number }`. When a type has one, `keyof` cannot list individual names, so it returns the key type instead:

```typescript title="index-signatures.ts"
type Scores = { [player: string]: number };
type ScoreKey = keyof Scores;          // string | number

type ByIndex = { [i: number]: string };
type IndexKey = keyof ByIndex;         // number

type Dict = Record<string, number>;
type DictKey = keyof Dict;             // string
```

The `string | number` result for a string index signature surprises people. It is there because JavaScript converts numeric keys to strings, so `scores[42]` reads the same property as `scores["42"]`; a string index signature therefore accepts numeric keys too, and `keyof` reports both. `Record<string, number>` is defined as a mapped type rather than an index signature, and its `keyof` is plain `string`. Either way, the practical effect is the same: **once a type has an index signature, `keyof` stops protecting you from typos**, because any string is a valid key. Index signatures are taught in [[b2-index-signatures]], and the choice between them and `Record` in [[b2-record-vs-index-signature]].

### Unions and intersections

What are the keys of "either an `A` or a `B`"? Only the keys you can safely use on *every* member, because you do not know which one you have:

```typescript title="union-intersection.ts"
type Cat = { name: string; meows: boolean };
type Dog = { name: string; barks: boolean };

type PetKey = keyof (Cat | Dog);       // "name"
type BothKey = keyof (Cat & Dog);      // "name" | "meows" | "barks"
```

This is easy to get backwards, so state the rule precisely: **`keyof (A | B)` is the set of keys common to both** (`keyof A & keyof B`), and **`keyof (A & B)` is the set of keys of either** (`keyof A | keyof B`). The union of values gives the intersection of keys, and vice versa. If you need every key that appears in *any* member of a union, you have to distribute over the union yourself with a conditional type such as `T extends unknown ? keyof T : never` (see [[b2-conditional-types]]).

### Classes, primitives and special types

For a class, `keyof` applied to the *instance* type lists only public members. Private and protected members are hidden because code outside the class cannot access them:

```typescript title="class-keys.ts"
class Account {
  private balance = 0;
  protected owner = "";
  public id = "acc_1";
  deposit(amount: number) { this.balance += amount; }
}

type AccountKey = keyof Account; // "id" | "deposit"
```

Methods are keys too, because a method is a property whose value is a function.

`keyof` works on primitive types by looking at their wrapper interfaces. `keyof string` is `number | "length" | "charAt" | "slice" | ...` plus `typeof Symbol.iterator` — every method of `String`, plus `number` for character indexing. You almost never want this, but it explains a confusing autocomplete list when a generic `T` turns out to be `string`.

Finally, the edge cases: `keyof {}` and `keyof unknown` are `never` (no known keys), and `keyof never` is `string | number | symbol`. That last one looks odd but follows from the union rule above: `never` is the empty union, and "the keys common to zero types" places no restriction at all.

## `keyof` in generic functions

`keyof` earns its keep in generics. The standard pattern has two type parameters: `T` for the object and `K` for the key, with the **constraint** `K extends keyof T`, which reads "`K` must be one of `T`'s key names".

```typescript title="get-prop.ts"
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: "u1", name: "Ada", age: 36 };

const n = getProp(user, "name"); // n: string
const a = getProp(user, "age");  // a: number
console.log(n, a);
getProp(user, "nmae");           // error
```

```output
error TS2345: Argument of type '"nmae"' is not assignable to parameter of type '"name" | "id" | "age"'.
```

When the error line is removed, the program prints:

```output
Ada 36
```

The error lists the keys in the order the compiler created the literal types, which is why `"name"` comes first; the order has no meaning. Walk through what the compiler does with `getProp(user, "name")`:

1. It infers `T` from the first argument: `{ id: string; name: string; age: number }`.
2. It infers `K` from the second argument. Because `K` is constrained to `keyof T`, TypeScript keeps the literal `"name"` instead of widening it to `string`.
3. It checks the constraint: `"name"` is one of `"id" | "name" | "age"`, so the call is valid.
4. It computes the return type `T[K]`, which is `T["name"]`, which is `string`.

Step 4 is why two type parameters are needed. If the signature were `getProp<T>(obj: T, key: keyof T): T[keyof T]`, the key would still be checked, but the return type would be the union of *all* value types, `string | number`, for every call. Making the key its own type parameter `K` lets the return type follow the specific key passed in.

> [!TIP] Why `K` is inferred as a literal
> A type parameter constrained by a union of literal types (which `keyof T` usually is) is inferred as the literal the caller wrote. Without the constraint, `K` would widen `"name"` to `string`, and `T[K]` would fail to resolve.

### Writing through `T[K]` is less safe than reading

The mirror image, `setProp`, compiles and looks equally safe:

```typescript title="set-prop.ts"
function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

const user = { id: "u1", name: "Ada", age: 36 };
setProp(user, "age", 37);      // fine
setProp(user, "age", "old");   // error: string is not number

declare const field: "id" | "age";
setProp(user, field, 99);      // compiles, but may write 99 into "id"
```

When `K` is a single literal, `T[K]` is exact. When the caller passes a key whose type is a *union*, `T[K]` becomes the union of those properties' types (`string | number`), and the compiler cannot know which property will actually be written. The call compiles even though it might put a number into `id`. This is a known soundness gap. TypeScript closes it for non-generic code: writing `u[key] = value` where `key: "id" | "age"` and `value: string | number` is an error, because the only value safe to write into "either `id` or `age`" is one that is *both* a string and a number (`never`). Keep this in mind when a helper is called with union-typed keys.

## `keyof` in mapped types

A **mapped type** builds a new object type by looping over a union of keys: `{ [P in Keys]: ... }`. The most common source of keys is `keyof T`, and that is how TypeScript's built-in utility types are written:

```typescript title="mapped.ts"
type MyPartial<T> = { [P in keyof T]?: T[P] };
type MyReadonly<T> = { readonly [P in keyof T]: T[P] };

interface Settings { theme: "light" | "dark"; fontSize: number }

type SettingsPatch = MyPartial<Settings>;
// { theme?: "light" | "dark"; fontSize?: number }
```

Read `[P in keyof T]` as "for each key `P` of `T`". When the mapped type iterates over `keyof T` directly like this, TypeScript calls it **homomorphic**: it preserves each property's existing `readonly` and optional modifiers, and the `?` and `readonly` written here are added on top. Modifiers can also be removed with `-?` and `-readonly`, which is how `Required<T>` is defined. Mapped types are the subject of [[b2-mapped-types]]; `Partial`, `Readonly` and `Required` are covered in [[b2-partial]], [[b2-readonly-utility]] and [[b2-required]].

## How it works internally

`keyof` is a **type operator**: it runs inside the type checker and leaves no trace in the emitted JavaScript. `tsc` erases every type annotation, so the compiled `getProp` is `function getProp(obj, key) { return obj[key]; }`.

Inside the checker, `keyof T` for a concrete object type is computed by collecting the type's property names (as literal types), adding the key types of any index signatures, and forming a union. For a generic `T` whose shape is not yet known, the checker keeps `keyof T` as a **deferred** type. It knows two useful facts about a deferred `keyof T` — any `K extends keyof T` is assignable to it, and indexing `T` with it is valid — and it resolves the real union only when `T` is substituted at a call site. That is why `getProp`'s body type-checks before anyone calls it.

The same deferral explains the `for...in` typing:

```typescript title="for-in.ts"
const user = { id: "u1", name: "Ada" };
for (const k in user) {
  // k: string, not "id" | "name"
}

function logAll<T extends object>(obj: T) {
  for (const k in obj) {
    // k: Extract<keyof T, string>, so obj[k] is allowed and typed T[...]
    console.log(k, obj[k]);
  }
}
logAll({ id: "u1", name: "Ada" });
```

```output
id u1
name Ada
```

For a concrete object, a `for...in` loop variable is plain `string`. Inside a generic function it becomes `Extract<keyof T, string>` (displayed by the compiler as `keyof T extends string ? ...`), which lets `obj[k]` type-check. In both cases the loop can see keys the type does not mention, such as extra properties or enumerable inherited ones — the type only describes what is *guaranteed*, not everything that is present.

### Why `Object.keys` returns `string[]`

Beginners often expect `Object.keys(user)` to return `("id" | "name")[]`. TypeScript deliberately types it as `string[]`, because of structural typing ([[b2-structural-typing]]): a value of type `{ id: string; name: string }` is allowed to have *more* properties at runtime.

```typescript title="object-keys.ts"
type Named = { name: string };
const employee = { name: "Ada", salary: 100 };
const n: Named = employee; // allowed: employee has at least `name`

console.log(Object.keys(n)); // the type says only "name"...
```

```output
[ 'name', 'salary' ]
```

If `Object.keys(n)` were typed `"name"[]`, the type would lie about `"salary"`. `keyof` is a promise about the *minimum* set of keys; `Object.keys` reports the actual runtime set. When you know an object has no extra keys (for example, a constant you created), you can assert `Object.keys(obj) as Array<keyof typeof obj>`, accepting responsibility for that claim. [[b2-keyof-typeof-patterns]] shows where this is reasonable.

## Worked example: a type-safe table sorter

A data table lets the user sort rows by a column. The column must be a real field of the row type, and the comparison should work for both strings and numbers.

```typescript title="sort-by.ts"
interface Order {
  id: string;
  customer: string;
  total: number;
  placedAt: number; // epoch millis
}

function sortBy<T, K extends keyof T>(rows: readonly T[], key: K, dir: "asc" | "desc" = "asc"): T[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (x < y) return -1 * sign;
    if (x > y) return 1 * sign;
    return 0;
  });
}

const orders: Order[] = [
  { id: "o1", customer: "Lin", total: 40, placedAt: 1_700_000_300_000 },
  { id: "o2", customer: "Ada", total: 125, placedAt: 1_700_000_100_000 },
  { id: "o3", customer: "Sam", total: 75, placedAt: 1_700_000_200_000 },
];

console.log(sortBy(orders, "total", "desc").map(o => o.id));
console.log(sortBy(orders, "customer").map(o => o.customer));

// A column picker in the UI can only offer real columns:
const columns: Array<keyof Order> = ["customer", "total", "placedAt"];
console.log(columns);
```

```output
[ 'o2', 'o3', 'o1' ]
[ 'Ada', 'Lin', 'Sam' ]
[ 'customer', 'total', 'placedAt' ]
```

What each part contributes:

- `K extends keyof T` makes `sortBy(orders, "totl")` a compile error, and gives autocomplete for the column name.
- `a[key]` is typed `T[K]`. Inside the generic function TypeScript allows `<` and `>` on it because both operands have the same type parameter; at runtime the values are strings or numbers, which compare correctly. (If `Order` gained a `Date` field, sorting by it would still work because `<` on dates compares their numeric values — but an object field would compare meaninglessly. A stricter version can constrain the key to fields whose values are `string | number`; that needs key filtering via mapped types, see [[b2-key-remapping]].)
- `Array<keyof Order>` types the UI's list of sortable columns. Renaming `total` to `amount` in `Order` turns both the list and every `sortBy(..., "total")` into compile errors, which is the refactor safety `keyof` promises.
- `[...rows]` copies before sorting, because `Array.prototype.sort` sorts in place and the input is `readonly`.

## In real systems

- **Form libraries.** React Hook Form's `register("email")` and Formik's field names are constrained by key types derived from the form's values type, so a misspelt field name fails to compile. Libraries extend the idea to nested paths such as `"address.city"` using template literal types ([[b2-template-literal-types]]).
- **Event emitters and DOM typings.** The DOM's `addEventListener` is overloaded with `K extends keyof HTMLElementEventMap`, which is how `el.addEventListener("click", e => ...)` knows `e` is a `MouseEvent`. The same pattern appears in typed event buses.
- **Utility types.** `Pick<T, K extends keyof T>`, `Omit`, `Partial`, `Record<K, V>` and almost every custom mapped type rely on `keyof`. See [[b2-utility-types]].
- **Configuration and route maps.** `keyof typeof ROUTES` turns the keys of a constant object into a union, replacing many enums. That combination is the subject of [[b2-keyof-typeof-patterns]].

## Trade-offs and alternatives

| Approach | Typo-safe | Follows refactors | Value type per key | Runtime cost |
|---|---|---|---|---|
| `key: string` | No | No | No (`any` or a wide union) | None |
| Hand-written union `"id" \| "name"` | Yes | No — must be updated by hand | No | None |
| `K extends keyof T` | Yes | Yes | Yes, via `T[K]` | None |
| Runtime check (`key in obj`) | Only at runtime | Yes | No | A check per call |

`keyof` is the right tool whenever the set of keys is known at compile time. It is the wrong tool for keys that arrive from outside — URL parameters, JSON from an API, user input — because the type says nothing about what those strings actually are. Validate such keys at runtime (for example, `if (key in obj)` or a schema validator) and only then treat them as `keyof T`.

The costs are modest: types that use deep mapped types over `keyof` can slow the compiler and produce long error messages, and an index signature anywhere in the type quietly widens `keyof` to `string`, removing the safety you thought you had.

## Common mistakes

> [!MISTAKE] Expecting `keyof` to give a runtime array
> `keyof User` exists only for the compiler; you cannot loop over it or `console.log` it. When you need the keys at runtime as well, start from a runtime value (an array or object declared `as const`) and derive the type from it with `typeof` — see [[b2-keyof-typeof-patterns]].

- **Using `key: string` instead of `K extends keyof T`.** You lose both the typo check and the link to `T[K]`; `obj[key]` then needs a cast or an index signature. Add the type parameter.
- **Using `key: keyof T` without a separate `K`.** The key is checked, but the return type collapses to `T[keyof T]`, the union of every value type. Introduce `K` when the result depends on which key was passed.
- **Mixing up union and intersection.** `keyof (A | B)` is the *common* keys, not all keys. Code that needs any key from any member has to distribute with a conditional type.
- **Assuming an index signature still gives literal keys.** `keyof { [k: string]: T }` is `string | number`; add explicit named properties or switch to a literal-union-keyed `Record` if you want typo checking.
- **Trusting `T[K]` writes with union keys.** `setProp(obj, k, v)` with `k: "a" | "b"` accepts a value for either property. Pass single literal keys, or check the value at runtime.
- **Expecting private members in `keyof`.** `keyof SomeClass` lists only public members; private fields cannot be targeted from outside.

## Interview perspective

Interviewers use `keyof` to check whether you understand how TypeScript connects names and values at the type level.

- *"What is `keyof { a: 1; b: 2 }`?"* — `"a" | "b"`. A strong answer adds that the result is a compile-time union and mentions how index signatures change it.
- *"Write a typed `get(obj, key)`."* — Write `getProp<T, K extends keyof T>(obj: T, key: K): T[K]` and explain why `K` must be a separate type parameter (the return type follows the specific key, and the constraint keeps the key literal).
- *"Why does `Object.keys` return `string[]` and not `(keyof T)[]`?"* — Because of structural typing: values may have extra properties not in their type. This is one of the best signals that a candidate understands the type system rather than memorised syntax.
- *"What is `keyof (A | B)`?"* — The common keys. Follow-ups may ask how to get all keys (distributive conditional type) or what `keyof any` is (`string | number | symbol`).
- *"How is `Partial` implemented?"* — `{ [P in keyof T]?: T[P] }`, with a word on homomorphic mapped types preserving modifiers.

## Practice

1. Write `pluck<T, K extends keyof T>(rows: T[], key: K)` that returns an array of that column's values. What is its return type for `pluck(orders, "total")`?
2. Predict, then check in an editor: `keyof { a: string } | { b: number }` (note the missing parentheses) versus `keyof ({ a: string } | { b: number })`.
3. Write a `hasKey(obj, key)` function that takes `key: PropertyKey` and returns the type predicate `key is keyof typeof obj` after checking `key in obj` at runtime. Use it to safely read a user-supplied column name.
4. Write `type Getters<T> = { [P in keyof T as ...]: () => T[P] }` that turns `{ name: string }` into `{ getName: () => string }`. (Hint: key remapping with `as` and `Capitalize`, from [[b2-key-remapping]].)
5. Change `sortBy` so that its key must be a field whose value is `string` or `number`, and confirm that sorting by a `Date[]` field is rejected.

## Quick revision {#quick-revision}

- `keyof T` is the union of `T`'s property names as literal types; it exists only at compile time.
- Optional properties are keys; private and protected class members are not.
- Number-like names stay number literals (`0`), symbols appear as `typeof sym`.
- `keyof any` = `PropertyKey` = `string | number | symbol`; `keyof {}` and `keyof unknown` are `never`.
- String index signature → `keyof` is `string | number`; number index signature → `number`; `Record<string, V>` → `string`.
- `keyof (A | B)` = common keys; `keyof (A & B)` = all keys.
- Generic pattern: `<T, K extends keyof T>(obj: T, key: K): T[K]`.
- Writing through `T[K]` with a union `K` is unsound; reading is fine.
- Mapped types loop over keys: `{ [P in keyof T]: T[P] }` (homomorphic, preserves modifiers).
- `Object.keys` and `for...in` give `string` keys because objects may have extra runtime properties.

## Key takeaways {#key-takeaways}

- `keyof` turns the property names of a type into a union, giving the compiler a precise list of valid keys.
- `K extends keyof T` plus `T[K]` is the core pattern for helpers that take a property name and return that property's type.
- Index signatures, unions and generic deferral all change what `keyof` produces; learn the rules rather than guessing.
- `keyof` describes the keys a type guarantees, not the keys an object has at runtime — which is why `Object.keys` returns `string[]`.
- Utility and mapped types are built on `keyof`, so mastering it makes the rest of type-level TypeScript readable.

```quiz
Q: What is `keyof ({ id: string; name: string } | { id: string; email: string })`?
- [ ] `"id" | "name" | "email"`
- [x] `"id"`
- [ ] `never`
- [ ] `string`
> With a union you do not know which member you have, so only keys present on every member are safe to use. `"id" | "name" | "email"` is what you get for the intersection `A & B`, where the value has all properties.
```

```quiz
Q: Why does `getProp<T, K extends keyof T>(obj: T, key: K): T[K]` use a second type parameter `K` instead of `key: keyof T`?
- [ ] `keyof T` cannot be used as a parameter type
- [ ] Without `K`, misspelt keys would be accepted
- [x] So the return type can depend on the specific key passed, rather than being the union of all value types
- [ ] `K` makes the function run faster
> `key: keyof T` still rejects typos, but then the return type can only be `T[keyof T]`, every value type at once. Giving the key its own type parameter lets the compiler infer the literal (`"age"`) and compute `T["age"]` for that call.
```

```quiz
Q: `type S = { [k: string]: boolean }`. What is `keyof S`?
- [ ] `never`
- [ ] `string`
- [x] `string | number`
- [ ] `boolean`
> A string index signature accepts numeric keys too, because JavaScript converts `obj[1]` to `obj["1"]`, so `keyof` reports `string | number`. `keyof Record<string, boolean>` is plain `string`, which is the tempting answer here.
```

```quiz
Q: `v` has the type `{ name: string }`. What return type does TypeScript give `Object.keys(v)`?
- [ ] `"name"[]`
- [ ] `(keyof typeof v)[]`
- [x] `string[]`
- [ ] `PropertyKey[]`
> Structural typing allows a value to have more properties than its type lists, so typing the result as `"name"[]` could be false at runtime. `PropertyKey[]` is wrong because `Object.keys` never returns symbols or numbers — it returns own enumerable string keys.
```
