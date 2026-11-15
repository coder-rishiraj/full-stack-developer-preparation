---
summary: A generic `pick()` helper copies a chosen set of properties from an object and gives the result the exact type `Pick<T, K>`, so typos in key names are compile errors and the result has no fields you did not ask for. You will implement it, understand how `K extends keyof T` drives inference, build the matching `omit()` and `Patch<T, K>` helpers, and learn where inference quietly widens what callers may send.
difficulty: intermediate
minutes: 35
objectives:
  - Implement a generic `pick(obj, ...keys)` whose return type is `Pick<T, K>` and explain each part of its signature
  - Explain why the implementation needs one type assertion and why that assertion is safe
  - Trace how TypeScript infers `K` from rest arguments, inline arrays and `as const` arrays
  - Build `omit()` and a reusable `Patch<T, K>` type, and compare their key constraints with the built-in utilities
  - Diagnose the inference trap where an inferred `K` lets a patch include any key, and fix it by fixing `K`
---

## Introduction

Copying a few fields out of an object is one of the most common things application code does. A user record from the database has an `id`, `name`, `email` and `passwordHash`; the profile card needs only `id` and `name`; the API response must never include `passwordHash`. In JavaScript you write a small `pick` function — or import Lodash's — and move on.

In TypeScript the interesting part is the *type* of that function. A version typed with `string[]` and `Record<string, unknown>` accepts misspelled keys and returns an object whose fields are all `unknown`, so every caller has to cast. A version typed with `any` accepts anything and returns anything. Neither tells the compiler the obvious truth: "the result has exactly the keys I passed, with the same types they had in the input".

A **generic `pick()` helper** encodes that truth. Its signature,

```typescript
function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>
```

is short, but every piece of it is doing work, which is why it is a favourite interview question. This lesson explains each piece, then reuses the same idea for `omit()` and for the `Patch<T, K>` type that typed update functions are built on. It sits next to [[b2-type-safe-apis]], which uses `Partial<Pick<T, K>>` for PATCH payloads; here the focus is on the generic machinery itself.

## Before you start

- **Generics and constraints** — type parameters, inference from arguments, and `T extends …`. See [[b2-generics]] and [[b2-generic-constraints]].
- **`keyof` and indexed access types** — `keyof User` is the union of `User`'s keys, and `User["name"]` is the type of one property. See [[b2-keyof]] and [[b2-indexed-access]].
- **`Pick`, `Omit` and `Partial`** — the built-in utility types. See [[b2-pick]], [[b2-omit]] and [[b2-partial]].
- **Rest parameters** — `...keys: K[]`. See [[b2-optional-rest-parameters]].

## The intuition: a stencil, not a photocopy

Think of the input object as a printed form and `pick` as a stencil laid over it. The stencil has holes only where you cut them, so what shows through is exactly the fields you chose — no more. The *type system's* version of the stencil is `Pick<T, K>`: a type built from `T` that keeps only the keys in `K`.

The two halves must match. The runtime function decides which values are copied; the return type tells the compiler which fields the result has. A good `pick` keeps them in lockstep by taking the same `K` for both: the keys you pass at runtime are the keys that appear in the type.

## Why the loose versions fail

Start with the version many codebases have, and look at what it costs its callers.

```typescript title="pick-loose.ts"
function pickLoose(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of keys) out[k] = obj[k];
  return out;
}
const user = { id: "u1", name: "Ada", email: "ada@x.io" };
const card = pickLoose(user, ["id", "nmae"]);   // typo compiles
console.log(card);
const n: string = card.name;                    // error: unknown
```

```output
error TS2322: Type 'unknown' is not assignable to type 'string'.
```

Remove the last line and the program prints `{ id: 'u1', nmae: undefined }`. Two separate failures are visible. The misspelt key `"nmae"` compiles, because `keys` is `string[]`, and produces a junk property at runtime. And the result is `Record<string, unknown>`: the compiler has forgotten that `name` was a string, so the caller needs a cast — and casts are where bugs hide. Changing `unknown` to `any` hides the second problem without fixing it. The loose signature has thrown away the information the caller already gave it.

## Building the generic `pick`

Here is the complete helper, followed by a walk through each part.

```typescript title="pick.ts"
function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  nickname?: string;
};

const user: User = { id: "u1", name: "Ada", email: "ada@x.io", passwordHash: "$2b$10$..." };

const card = pick(user, "id", "name");
//    ^? const card: Pick<User, "id" | "name">
console.log(card);
console.log(card.name.toUpperCase());
console.log(pick(user, "id", "nickname"));
```

```output
{ id: 'u1', name: 'Ada' }
ADA
{ id: 'u1' }
```

### The type parameters

**`T extends object`** is the type of the input. The constraint excludes primitives — `pick(42, "toFixed")` is meaningless — and lets the `in` operator be used on `obj`, which requires an object type. `T` is inferred from the first argument, so callers never write it.

**`K extends keyof T`** is the heart of the helper. `keyof T` is the union of `T`'s property names — for `User`, `"id" | "name" | "email" | "passwordHash" | "nickname"`. Constraining `K` to it means every key argument must be one of those names. Because `K` is inferred from the arguments `"id"` and `"name"`, TypeScript infers the *literal* union `"id" | "name"`, not `string`: a type parameter constrained to a union of string literals keeps literal types instead of widening them.

**`...keys: K[]`** is a rest parameter, so callers write `pick(user, "id", "name")` with no array brackets. Each argument contributes one candidate for `K`, and the compiler unions them.

**`Pick<T, K>`** is the return type. It is the built-in mapped type `{ [P in K]: T[P] }`: for each chosen key, the property keeps its original type. So `card.name` is `string`, and `card.email` does not exist. Mistakes are now compile errors at the call site:

```typescript
card.email;
pick(user, "id", "nmae");
```

```output
error TS2339: Property 'email' does not exist on type 'Pick<User, "id" | "name">'.
error TS2345: Argument of type '"nmae"' is not assignable to parameter of type 'keyof User'.
```

### The one assertion, and why it is honest

Inside the function, the result starts as `{} as Pick<T, K>`. Without the assertion the compiler objects:

```typescript
const result: Pick<T, K> = {};
```

```output
error TS2322: Type '{}' is not assignable to type 'Pick<T, K>'.
```

The compiler is right in general: an empty object does not have the keys `K`. It becomes true only after the loop has filled them in, and the compiler does not track how a loop gradually builds up an object. So the assertion is a promise — "by the time I return, this will be a `Pick<T, K>`" — and the loop body keeps it. Note that the assignment `result[key] = obj[key]` itself needs no cast: both sides have type `T[K]`, so the compiler can check it. That is a useful pattern for generic helpers in general: one narrowly placed assertion at the point the compiler cannot follow, with checked code everywhere else.

### Missing keys at runtime

The `if (key in obj)` guard decides what happens for optional properties that are absent. `user` has no `nickname`, so `pick(user, "id", "nickname")` returns `{ id: 'u1' }` rather than `{ id: 'u1', nickname: undefined }`. This matches the type, where `nickname` is still optional in `Pick<User, "id" | "nickname">`, and it matters for code that checks `"nickname" in result` or serialises the result. The `in` operator also sees inherited properties; for plain data objects that never matters, and if your inputs might be class instances, `Object.hasOwn(obj, key)` (ES2022) restricts the copy to own properties.

### Why `pick` is a security tool

Look again at `passwordHash`. Structural typing ([[b2-structural-typing]]) means a value typed as `{ id: string; name: string }` may still carry extra properties at runtime — a `User` can be passed wherever a `PublicUser` is expected. A function like

```typescript
function toPublicUser(u: User): PublicUser { return u; }
```

compiles and sends the hash to the client inside `JSON.stringify(u)`. `pick(u, "id", "name")` copies only the named keys at runtime, so what the type says and what the bytes contain finally agree. This is the strongest practical argument for having the helper: types alone cannot remove properties.

## Passing keys as an array

Sometimes the keys live in a constant, for example the list of public fields. A variant that takes an array instead of rest arguments shows how inference treats array literals.

```typescript title="pick-array.ts"
function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) if (key in obj) result[key] = obj[key];
  return result;
}
type User = { id: string; name: string; email: string };
const user: User = { id: "u1", name: "Ada", email: "ada@x.io" };

const PUBLIC_FIELDS = ["id", "name"] as const;
const a = pick(user, PUBLIC_FIELDS);       // Pick<User, "id" | "name">
const wide = ["id", "name"];               // string[]
const b = pick(user, wide);
const c = pick(user, ["id", "name"]);      // inline literal: K inferred as "id" | "name"
```

```output
error TS2345: Argument of type 'string[]' is not assignable to parameter of type 'readonly (keyof User)[]'.
  Type 'string' is not assignable to type 'keyof User'.
```

Three cases, three behaviours:

| Call | Type of the keys argument | Result |
|---|---|---|
| `pick(user, ["id", "name"])` | Inline literal, contextually typed by `readonly K[]` | `K = "id" \| "name"` |
| `pick(user, PUBLIC_FIELDS)` with `as const` | `readonly ["id", "name"]` | `K = "id" \| "name"` |
| `pick(user, wide)` with no `as const` | `string[]` — widened when the variable was declared | Error |

The `wide` variable was widened to `string[]` at its declaration, before the call existed, so the literal information is gone; see [[b2-as-const]]. The parameter is written `readonly K[]` rather than `K[]` because an `as const` array is a readonly tuple, and a readonly array is not assignable to a mutable one. Accepting `readonly` is also the honest signature: `pick` never modifies the key list.

## The companion: `omit`

`omit` is `pick` inverted — copy everything *except* the listed keys. The runtime version is easier (copy, then delete), and the return type is the built-in `Omit<T, K>`.

```typescript title="omit.ts"
function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
}
type User = { id: string; name: string; email: string; passwordHash: string };
const user: User = { id: "u1", name: "Ada", email: "ada@x.io", passwordHash: "x" };
const safe = omit(user, "passwordHash");
console.log(safe);
```

```output
{ id: 'u1', name: 'Ada', email: 'ada@x.io' }
```

There is a subtle difference from the built-in utility. The built-in `Omit` is declared as `type Omit<T, K extends keyof any>` — its key constraint is *any* string, number or symbol, not `keyof T` — so `Omit<User, "pasword">` is a legal type that removes nothing. Our function constrains `K extends keyof T`, so `omit(user, "pasword")` is a compile error. When you write your own key-taking helpers, prefer the stricter constraint.

The security caveat runs the other way for `omit`: it is a deny-list. If someone later adds `resetToken` to `User`, `omit(user, "passwordHash")` will happily include it. For anything sent outside your system, `pick` with an allow-list is the safer default.

## From `pick` to `Patch<T, K>`

Update functions need the *type-level* half of the same idea: "an object containing some of these keys". That is `Pick` followed by `Partial`, and naming it once avoids repeating the composition in every service:

```typescript
type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;

type ArticlePatch = Patch<Article, "title" | "body">;   // { title?: string; body?: string }
```

The constraint `K extends keyof T` gives the same protection as in `pick`: `Patch<Article, "tittle">` is an error. Teams typically export `Patch` from a shared types module and use it in client update functions, form state and server handlers.

A generic update function can tie the allowed keys to a runtime list, so the list and the type cannot disagree:

```typescript title="update.ts"
type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;
type Article = { id: string; title: string; body: string; publishedAt: string };

function update<T, K extends keyof T>(obj: T, keys: readonly K[], patch: Patch<T, K>): T {
  const next = { ...obj };
  for (const key of keys) {
    const value = patch[key];
    if (value !== undefined) next[key] = value;
  }
  return next;
}

const art: Article = { id: "a1", title: "Draft", body: "...", publishedAt: "2024-01-01" };
console.log(update(art, ["title", "body"], { title: "Final" }));
update(art, ["title"], { body: "sneaky" });
```

```output
error TS2353: Object literal may only specify known properties, and 'body' does not exist in type 'Partial<Pick<Article, "title">>'.
```

With the last line removed, the program prints `{ id: 'a1', title: 'Final', body: '...', publishedAt: '2024-01-01' }`. Here `K` is inferred from the `keys` array, which acts as the allow-list, and the `patch` argument is then *checked* against `Patch<T, K>` rather than inferring anything. The loop copies only allow-listed keys, and skips `undefined` values so an explicit `{ title: undefined }` cannot blank the field.

## The inference trap: when `K` comes from the patch

The version of this helper that appears in many codebases — and in the notes many people learn from — looks simpler:

```typescript
function updateArticle<K extends keyof Article>(patch: Patch<Article, K>) { /* … */ }

updateArticle({ title: "New" });             // K = "title"
updateArticle({ body: "Text", title: "T" }); // K = "body" | "title"
```

It type-checks the legitimate calls, and the hover types look precise. But ask where `K` comes from: it is **inferred from the keys of the object you pass**. The constraint only says `K` must be *some* key of `Article`, and `id` is a key of `Article`. So:

```typescript
updateArticle({ id: "x" });   // compiles: K is inferred as "id"
updateArticle({});            // compiles: K is inferred as never
```

Both compile. Probing the inferred type confirms it: assigning the inferred `K` from the first call to a variable of type `"title"` fails with `Type '"id"' is not assignable to type '"title"'`. Letting `K` be inferred from the very argument it is meant to restrict makes the restriction circular — the signature is no stricter than `Partial<Article>`.

The fix is to decide `K` *before* the argument is seen:

- **Fix it in the signature:** `function updateArticle(patch: Patch<Article, "title" | "body">)`. No type parameter, no inference, `{ id: "x" }` is an excess-property error.
- **Narrow the constraint:** `function updateArticle<K extends "title" | "body">(patch: Patch<Article, K>)` keeps the precise inferred `K` for callers that want it, but `id` is no longer a candidate.
- **Infer from a separate allow-list argument,** as `update(obj, keys, patch)` does above.
- **Pass `K` explicitly** at the call site, `updateArticle<"title">({ … })`, which is occasionally useful in tests but easy to forget.

The general lesson: a generic constraint restricts *what can be inferred*, not *what callers may pass*. If the purpose of a type parameter is to restrict an argument, it must not be inferred from that same argument.

## In real systems

- **API serialisers** use `pick` with a constant list of public fields so that responses contain only allow-listed data, whatever the database row contains.
- **Form libraries and state stores** use `Patch<T, K>`-style types for partial updates; Redux Toolkit reducers and ORM `update` methods accept similar partial shapes.
- **Lodash** ships `pick` and `omit`. Its type definitions include overloads that accept property paths such as `"address.city"`, which cannot be checked as precisely, so some teams keep a small typed helper for the common flat case.
- **Interview platforms** ask for this exact helper — see [[b2-impl-pick]] for the implementation exercise.

## Trade-offs and alternatives

A typed `pick` costs a few lines and one assertion, and it pays back in caught typos, precise result types and runtime removal of unlisted fields. Its limits: it is shallow (nested objects are shared, not copied — the result's `address` is the same object as the input's), it works on known keys only (for `Record<string, V>` inputs `keyof T` is `string` and the helper adds nothing), and it cannot pick by path. Destructuring — `const { id, name } = user` — is a fine alternative inside one function; `pick` earns its place when the key list is data, is reused, or must be shared between a type and runtime code.

## Common mistakes

- **Typing keys as `string[]`.** Typos compile and the result type is lost. Fix: `K extends keyof T`.
- **Returning `Partial<T>` instead of `Pick<T, K>`.** Callers then see every field as optional and must check fields they know are present. Fix: return `Pick<T, K>`.
- **Declaring the key list without `as const`.** It widens to `string[]` and the call fails. Fix: `as const`, or write the array inline.
- **Using `K[]` for the array parameter.** `as const` arrays are readonly and will not be accepted. Fix: `readonly K[]`.
- **Inferring `K` from the patch object.** It lets `id` through. Fix: fix or narrow `K` before the argument is checked.
- **Relying on a type to hide fields.** Assigning a `User` to `PublicUser` keeps the hidden fields at runtime. Fix: copy with `pick`.

## Interview perspective

The usual prompt is "implement `pick` with full types". A strong answer writes the signature first and explains it: `T extends object` because only objects have keys to pick, `K extends keyof T` so keys are checked and inferred as literals, `Pick<T, K>` so the result keeps exact property types. Then the body, with the `{} as Pick<T, K>` assertion justified — the compiler cannot see a loop building the object.

Common follow-ups:

- *"What happens with an optional property that is missing?"* Discuss `key in obj` versus always assigning, and why matching the optional type matters.
- *"Write `omit`."* And note that built-in `Omit`'s constraint is `keyof any`, so it allows non-existent keys.
- *"Why might your patch helper allow `id`?"* The inferred-`K` trap: a constraint restricts inference, not callers.
- *"Is `pick` a deep copy?"* No — it copies property references, so nested objects are shared.

## Practice

1. Write `pick` so that it returns `Readonly<Pick<T, K>>`, and explain when that is useful.
2. Implement `pickBy<T extends object>(obj: T, predicate: (value: T[keyof T], key: keyof T) => boolean): Partial<T>`. Why can it not return `Pick<T, K>`?
3. Change `omit` to build the result by copying instead of deleting, and compare the two for objects with getters.
4. Fix `updateArticle` three ways (fixed type, narrowed constraint, allow-list argument) and write a call that each version rejects.
5. Write a type `PickByValue<T, V>` that keeps only the keys whose values are assignable to `V`, using [[b2-mapped-types]] with key remapping.

```quiz
Q: In `function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>`, what does `pick(user, "id", "name")` infer for `K`?
- [ ] `string`
- [ ] `keyof User`
- [x] `"id" | "name"`
- [ ] `"id"`, and `"name"` is checked separately
> Each rest argument is a candidate for `K`, and because `K` is constrained to `keyof T` (a union of literal keys) the literals are kept rather than widened to `string`. The candidates are unioned, giving exactly the keys passed — not all of `keyof User`.
```

```quiz
Q: `function updateArticle<K extends keyof Article>(patch: Partial<Pick<Article, K>>)` is called as `updateArticle({ id: "x" })`. What happens?
- [ ] Compile error, because `id` is not editable
- [x] It compiles, because `K` is inferred as `"id"` from the argument
- [ ] It compiles, but only because `Partial` makes `id` optional
- [ ] Runtime error, because `Pick` removes `id`
> `K` is inferred from the patch itself, and `"id"` satisfies `keyof Article`, so the patch is checked against `Partial<Pick<Article, "id">>` and passes. To restrict callers, fix `K` or narrow its constraint to the editable keys.
```

```quiz
Q: Why does the implementation start with `const result = {} as Pick<T, K>`?
- [x] An empty object is not yet a `Pick<T, K>`; the compiler cannot see that the loop fills in every key
- [ ] `Pick` types cannot be created without an assertion in any situation
- [ ] The assertion copies the keys at runtime
- [ ] It converts `T` into an object type so `in` can be used
> The assertion is a promise that the loop keeps: each iteration assigns `result[key] = obj[key]`, which is fully type-checked. Assertions never do anything at runtime, and the `in` operator is allowed because of the `T extends object` constraint.
```

## Quick revision {#quick-revision}

- Signature: `pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>`.
- `K extends keyof T` checks keys and infers literal unions; `Pick<T, K>` keeps each property's original type.
- `{} as Pick<T, K>` is needed because the compiler cannot track a loop building an object; `result[key] = obj[key]` is checked (`T[K]` to `T[K]`).
- `key in obj` skips absent optional properties; `Object.hasOwn` ignores inherited ones.
- Array form: parameter `readonly K[]`; inline arrays and `as const` arrays infer literals; a plain `string[]` variable fails.
- `omit` returns `Omit<T, K>`; built-in `Omit` allows any key (`keyof any`), your helper should require `keyof T`.
- `pick` is an allow-list and removes fields at runtime; types alone never remove properties.
- `Patch<T, K> = Partial<Pick<T, K>>`; do not infer `K` from the patch itself — it lets any key through and `{}` infers `never`.

## Key takeaways {#key-takeaways}

- A generic `pick` keeps runtime keys and result type in lockstep by using one `K` for both.
- Constraining `K` to `keyof T` turns misspelt keys into compile errors and keeps literal key types.
- One honest assertion at the point the compiler cannot follow is acceptable; the rest of the helper stays fully checked.
- Use `pick` with an allow-list to strip sensitive fields, because structural typing lets extra properties travel with a value.
- `Patch<T, K>` names the `Partial<Pick<T, K>>` composition; decide `K` from an allow-list, never from the patch being checked.
