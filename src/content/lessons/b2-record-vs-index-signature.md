---
summary: "`Record<K, V>` and index signatures both describe objects used as maps, but they answer different questions: is the set of keys fixed and known, or open and discovered at runtime? You will learn how `Record` is built, when it gives you exhaustiveness checking, when it is identical to an index signature, and how to choose between them."
difficulty: intermediate
minutes: 35
objectives:
  - Explain how Record<K, V> is defined as a mapped type and what it produces for literal unions versus string
  - Choose between Record with a literal union, Record<string, V>, an index signature and Map for a given data shape
  - Use Record<K, V> to make the compiler enforce that every key of a union is handled
  - Model sparse finite maps with Partial<Record<K, V>> and handle the resulting undefined reads
  - Iterate over Record keys with correct types and explain why Object.keys returns string[]
---

## Introduction

Two lines of TypeScript that look almost the same:

```typescript
const labels: Record<Status, string> = { idle: "Ready", loading: "Loading…" };
const cache: { [id: string]: User } = {};
```

Both describe objects used as lookup tables. Both let you write `obj[key]`. Yet they make opposite promises. The first says "this object has **exactly these keys**, and each must be present". The second says "this object may have **any string keys**, and I do not know which".

Choosing the wrong one is a common source of quiet bugs. If you type a fixed set of keys as an open dictionary, the compiler stops telling you when a key is missing or misspelled. If you type an open dictionary as a fixed set, you either cannot express it at all or you end up casting. This lesson explains what `Record` actually is, why it behaves exactly like an index signature in one case and completely differently in another, and gives you a rule for deciding.

## Before you start

- **Index signatures** — `{ [k: string]: V }`, the `noUncheckedIndexedAccess` option and why reads may be `undefined`. See [[b2-index-signatures]].
- **Literal and union types** — `"idle" | "loading"` as a type. See [[b2-literal-types]] and [[b2-unions]].
- **`keyof`** — turning an object type into a union of its keys. See [[b2-keyof]].
- **Mapped types**, at least the idea — building an object type by looping over keys. [[b2-mapped-types]] goes deeper; this lesson explains the part you need.

## The intuition

A `Record<"en" | "fr", string>` is like a printed form with two labelled boxes, `en` and `fr`. A form with a box left blank is incomplete, and a box labelled `de` is not on the form at all. The compiler checks the form the way a clerk would.

An index signature is a blank sheet with one rule: every line is "label: value". There is no list of required labels, so the clerk cannot say anything is missing; the clerk can only check that each value is the right kind.

`Record<string, V>` sounds like the first but is really the second. If the "labels" are "all strings", there is no finite list to check against, so the form becomes a blank sheet. That single observation explains most of this topic.

## What `Record` actually is

`Record` is not special syntax. It is a utility type declared in TypeScript's standard library as a **mapped type**:

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

`keyof any` is `string | number | symbol`, so `K` can be any union of those (including literals). The body `[P in K]: T` reads "for each member `P` of `K`, create a property named `P` with type `T`". What you get depends entirely on what `K` is.

**When `K` is a union of literals**, the mapped type loops over a finite list and produces ordinary named properties:

```typescript
type Lang = "en" | "fr";
type Hello = Record<Lang, string>;
// equivalent to: { en: string; fr: string }
```

Both properties are required (no `?`), both are known, and `keyof Hello` is exactly `"en" | "fr"`.

**When `K` is `string`**, there is nothing to loop over one by one, so the mapped type produces an index signature:

```typescript
type Dict = Record<string, number>;
// equivalent to: { [x: string]: number }
```

These two results are different kinds of type, even though both were written as `Record`. (One small quirk: `keyof Record<string, V>` is `string`, because `keyof` of a mapped type is its key constraint, while `keyof { [k: string]: V }` is `string | number`. Reading, writing and assignability are the same.) The first has known keys and gives you every compile-time check; the second is an open dictionary with all the limitations described in [[b2-index-signatures]]. `Record<number, V>` similarly becomes `{ [x: number]: V }`.

**When `K` is a template literal pattern** such as `` `on${string}` ``, the result is a pattern index signature, accepting any key that matches:

```typescript
type Handlers = Record<`on${string}`, () => void>;
const h: Handlers = { onClick() {}, click() {} };
```

```output
error TS2353: Object literal may only specify known properties, and 'click' does not exist in type 'Handlers'.
```

So the useful way to think about the comparison is not "`Record` versus index signature" but **"finite keys versus open keys"**. `Record<string, V>` and `{ [k: string]: V }` describe the same open-keys object, written two ways.

| You write | You get | Keys required? | Unknown keys rejected? | `keyof` |
|---|---|---|---|---|
| `Record<"a" \| "b", V>` | `{ a: V; b: V }` | Yes, all | Yes | `"a" \| "b"` |
| `Partial<Record<"a" \| "b", V>>` | `{ a?: V; b?: V }` | No | Yes | `"a" \| "b"` |
| `Record<string, V>` | `{ [x: string]: V }` | No | No | `string` |
| `{ [k: string]: V }` | same as above | No | No | `string \| number` |
| `` Record<`x-${string}`, V> `` | pattern index signature | No | Yes, if not matching | the pattern |

## Finite keys: exhaustiveness for free

The strongest reason to use `Record` with a literal union is that the compiler then enforces **exhaustiveness**: every member of the union must have an entry. Consider a UI that shows a label for each request status:

```typescript
type Status = "idle" | "loading" | "success" | "error";

const STATUS_LABEL: Record<Status, string> = {
  idle: "Ready",
  loading: "Loading…",
  success: "Saved",
  error: "Something went wrong",
};
```

Months later someone adds `"cancelled"` to `Status`. Every `Record<Status, …>` in the codebase immediately fails to compile:

```output
error TS2741: Property 'cancelled' is missing in type '{ idle: string; loading: string; success: string; error: string; }' but required in type 'Record<Status, string>'.
```

That error is a to-do list generated by the compiler. Had `STATUS_LABEL` been typed `{ [status: string]: string }`, nothing would fail, and the UI would render `undefined` for cancelled requests in production.

The same declaration also rejects keys that are not in the union, which catches typos such as `laoding`, and gives the editor a list of keys to autocomplete. Reading `STATUS_LABEL[status]` where `status: Status` returns `string` with no `undefined`, even under `noUncheckedIndexedAccess`, because every key is known to exist.

This pattern — a union type plus a `Record` keyed by it — is the basis of **variant maps**: tables that map each case of a union to a value or a handler function. [[b2-variant-map-satisfies]] builds that into a full technique.

## Open keys: dictionaries and caches

When keys are discovered at runtime — user ids, product SKUs, words in a document — there is no union to list. Use `Record<string, V>` or an index signature:

```typescript
type User = { id: string; name: string };
const usersById: Record<string, User> = {};
```

Now the compiler cannot help with key names, and it cannot know whether a given id has been loaded. That is why `noUncheckedIndexedAccess` matters most for this kind of type: with it, `usersById[id]` is `User | undefined` and you must handle the missing case. A `Record` over a literal union does not need that protection because presence is guaranteed by the type.

## Sparse finite maps: `Partial<Record<K, V>>`

Sometimes the keys come from a known union, but not every key needs a value. Perhaps only some statuses have an icon. `Record<Status, string>` would force you to invent icons; `Record<string, string>` would throw away the key checking. The middle ground is:

```typescript
const STATUS_ICON: Partial<Record<Status, string>> = { success: "✓", error: "✗" };
```

`Partial` makes every property optional, so the type is `{ idle?: string; loading?: string; success?: string; error?: string }`. Unknown keys are still rejected and autocomplete still works, but reads are `string | undefined` — correctly, because some are missing — so `STATUS_ICON.success.toUpperCase()` is a compile error until you handle `undefined`.

## How it works internally

At runtime there is no difference at all. `Record` and index signatures are erased by the compiler, and every version is a plain JavaScript object. Every check described in this lesson happens at compile time.

Inside the compiler, `Record<K, V>` is instantiated like any generic mapped type. With a literal union, the compiler expands it to an object type with one property per member, which then behaves like a hand-written object type: excess property checks on literals, required-property checks, precise `keyof`. With `string`, `number`, `symbol` or a pattern, the compiler creates an index signature instead, because those key types describe infinitely many keys.

**Iteration does not know about the keys.** `Object.keys` is declared to return `string[]` for every object, including a `Record<Status, string>`. That is deliberate: TypeScript types are structural, so a value of type `Record<Status, string>` may hold *extra* properties at runtime (for example, an object with more keys passed through a variable). The compiler therefore cannot promise that `Object.keys` returns only `Status` values. When you are sure the object has exactly those keys, a cast is the usual approach:

```typescript
for (const status of Object.keys(STATUS_LABEL) as Status[]) { /* … */ }
```

A safer alternative is to keep the list of keys as a value (`const STATUSES = ["idle", "loading", "success", "error"] as const`) and derive the `Status` type from it, so you iterate over the array rather than the object's keys. That technique is covered in [[b2-as-const]].

**Assigning open to closed is looser than you might expect.** With TypeScript 6.0, a value of type `Record<string, string>` can be assigned to a variable of type `Record<Status, string>` without an error, because the compiler relates a generic mapped type to an index signature by checking value types only. Writing the target as an explicit object type (`{ idle: string; loading: string }`) does produce an error. The practical lesson: exhaustiveness is checked where you write the **object literal**; once data has passed through an open dictionary type, the guarantee is gone.

## Worked example: labels, a cache and a sparse map

This complete program, compiled with `strict` and `noUncheckedIndexedAccess`, uses all three shapes side by side.

```typescript title="record.ts"
type Status = "idle" | "loading" | "success" | "error";

// Finite keys: every status needs a label
const STATUS_LABEL: Record<Status, string> = {
  idle: "Ready",
  loading: "Loading…",
  success: "Saved",
  error: "Something went wrong",
};

// Open keys: whichever users the app has fetched so far
type User = { id: string; name: string };
const usersById: Record<string, User> = {};

function remember(user: User): void {
  usersById[user.id] = user;
}

function nameOf(id: string): string {
  const user = usersById[id]; // User | undefined (noUncheckedIndexedAccess)
  return user ? user.name : "(unknown user)";
}

remember({ id: "u1", name: "Ada" });
console.log(STATUS_LABEL.loading);
console.log(nameOf("u1"), "|", nameOf("u2"));

// Sparse finite map: only some statuses have an icon
const STATUS_ICON: Partial<Record<Status, string>> = { success: "✓", error: "✗" };
for (const status of Object.keys(STATUS_LABEL) as Status[]) {
  console.log(status.padEnd(8), STATUS_ICON[status] ?? "-", STATUS_LABEL[status]);
}
```

```output
Loading…
Ada | (unknown user)
idle     - Ready
loading  - Loading…
success  ✓ Saved
error    ✗ Something went wrong
```

Look at how the type of each read differs. `STATUS_LABEL.loading` and `STATUS_LABEL[status]` are plain `string`: the `Record` over a union guarantees presence. `usersById[id]` is `User | undefined`: an open dictionary guarantees nothing about presence, so `nameOf` has to handle the miss, and `"u2"` shows the fallback. `STATUS_ICON[status]` is `string | undefined` because `Partial` made every key optional, and `?? "-"` supplies a default.

The loop casts `Object.keys(...)` to `Status[]`. That is safe here because `STATUS_LABEL` is a literal declared in the same file with exactly those keys. If the object came from elsewhere, iterating a separate array of statuses would be the safer choice.

```quiz
Q: What type does `Record<string, boolean>` produce?
- [ ] An object type with no properties
- [x] An index signature, the same as `{ [x: string]: boolean }`
- [ ] An object type that requires every possible string key
- [ ] A `Map<string, boolean>`
> `Record` is the mapped type `{ [P in K]: T }`. When `K` is `string` there is no finite list of keys to expand, so the compiler produces a string index signature. No keys are required, and reads are not guaranteed to find a value.

Q: You add `"archived"` to a `Status` union. Which declaration makes the compiler point at every place that needs updating?
- [ ] `const icons: { [s: string]: string } = { … }`
- [ ] `const icons: Record<string, string> = { … }`
- [x] `const icons: Record<Status, string> = { … }`
- [ ] `const icons: Partial<Record<Status, string>> = { … }`
> Only `Record<Status, string>` requires one property per member of `Status`, so the existing object literal is now missing `archived` and fails to compile. The open dictionaries accept any keys, and `Partial` makes every key optional, so none of the others report anything.

Q: Why does `Object.keys(obj)` return `string[]` even when `obj: Record<"a" | "b", number>`?
- [ ] It is a bug in TypeScript's library types
- [x] Structural typing allows the runtime object to have extra keys, so the compiler cannot promise only `"a" | "b"`
- [ ] `Record` types are erased, so the compiler forgets the keys
- [ ] Because `keyof` of a `Record` is `string`
> A value with more properties is still assignable to `Record<"a" | "b", number>`, so at runtime `Object.keys` may return other strings. `keyof` of this type is `"a" | "b"`; the issue is what the object may contain, not what the type lists.
```

## In real systems

**UI state machines.** Components often map each state to what they render: `Record<Status, ReactNode>` or `Record<Variant, string>` for class names. Adding a variant then fails compilation in every map until each one handles it. Design systems use `Record<Size, number>` for spacing scales for the same reason.

**Translations.** A translation catalogue keyed by locale is `Record<Locale, Messages>` when the app ships a fixed set of locales; the messages themselves are often `Record<string, string>` because keys are added constantly and validated by tooling instead.

**Caches and normalised stores.** Data fetched by id is `Record<string, Entity>` (or a `Map`). Here the open type is correct: the set of ids is decided by the server, not by the code.

**Configuration validation.** `satisfies Record<Env, Config>` checks that a config object has an entry for every environment without widening the inferred types of the entries. That technique is in [[b2-satisfies]].

## Trade-offs and alternatives

Use this decision order:

1. **Can you list the keys as a union?** Use `Record<Union, V>`. You get required keys, rejected typos, autocomplete and exhaustiveness. If some keys may be absent, use `Partial<Record<Union, V>>`.
2. **Are the keys arbitrary strings discovered at runtime?** Use `Record<string, V>` or `{ [k: string]: V }` — they behave the same. Prefer the index-signature form when naming the key (`[userId: string]`) helps readers. Enable `noUncheckedIndexedAccess`.
3. **Are keys not strings, untrusted, or frequently deleted, or do you need `size` and ordered iteration?** Use `Map<K, V>`. It has no prototype keys and its `get` already returns `V | undefined`.
4. **Do keys follow a naming pattern?** Use a template literal key, either form.

The cost of `Record` over a union is rigidity: you must provide every key up front, which is wrong for data that genuinely grows at runtime. The cost of an open dictionary is that the compiler can no longer check keys. Neither is better in general; they model different facts about your data.

## Common mistakes

> [!MISTAKE] Open dictionary for a closed set
> `const COLORS: Record<string, string> = { primary: "#06f", danger: "#d00" }` loses everything: `COLORS.primry` compiles, and adding a new variant elsewhere does not force a colour here. Type it `Record<Variant, string>`, or use `satisfies` to keep the literal keys.

**Expecting `Record<string, V>` to require keys.** It never does; it is an index signature. Only a union of literal keys makes keys required.

**Casting a partial object to a full `Record`.** `{} as Record<Status, string>` compiles and then every read is typed `string` while the object is empty. Build the object in one literal, or type it `Partial<…>` while it is being filled.

**Losing exhaustiveness through an open type.** Passing a `Record<string, V>` where a `Record<Status, V>` is expected compiles, as shown above. Keep finite maps typed finitely from the point of creation.

**Using `Object.keys` and expecting key types.** It returns `string[]`. Iterate a typed array of keys, or cast only when you control the object's creation.

## Interview perspective

> [!INTERVIEW] Explaining the difference in one breath
> "`Record` is a mapped type, `{ [P in K]: T }`. With a literal union for `K` it creates required named properties, so the compiler checks every key is present and rejects unknown ones. With `string` it degrades to an index signature, identical to `{ [k: string]: T }`. So the real choice is closed keys versus open keys, and I pick based on whether the key set is known at compile time."

Likely follow-ups:

- **"What is `keyof Record<string, number>`?"** `string`, the mapped type's key constraint; for the hand-written `{ [k: string]: number }` it is `string | number`, because numeric keys are converted to strings.
- **"How would you allow only some keys of a union?"** `Partial<Record<K, V>>`, and handle `undefined` on reads.
- **"When is `Map` better?"** Non-string or untrusted keys, frequent deletes, needing `size` or guaranteed iteration order.
- **"How do you keep literal value types while checking against a `Record`?"** Use `satisfies Record<K, V>` instead of an annotation; see [[b2-satisfies]].

## Practice

1. Given `type Theme = "light" | "dark" | "contrast"`, write a `Record` of background colours. Add `"sepia"` to the union and read the compiler error.
2. Model a shopping cart keyed by SKU with quantities. Justify your choice between `Record<string, number>` and `Map<string, number>`.
3. Write a type for feature flags where every flag in `type Flag = "newNav" | "betaSearch"` may or may not be set. Write `isOn(flags, flag)` that returns `false` for unset flags.
4. Write `typedKeys<K extends string>(obj: Record<K, unknown>): K[]` and explain in a comment when its result can be wrong.

## Quick revision {#quick-revision}

- `Record<K, V>` is the mapped type `{ [P in K]: V }`.
- Literal union `K` → required named properties, unknown keys rejected, exact `keyof`, exhaustiveness.
- `K = string` → index signature, behaves like `{ [k: string]: V }`; no keys required; `keyof` is `string` (the hand-written form gives `string | number`).
- Template literal `K` → pattern index signature.
- `Partial<Record<K, V>>` → known keys, all optional, reads include `undefined`.
- Reads from a finite `Record` are never `undefined`; reads from an open one are with `noUncheckedIndexedAccess`.
- `Object.keys` always returns `string[]`; cast only when you control the object.
- Exhaustiveness is checked at the object literal; data passed through `Record<string, V>` loses it.
- Use `Map` for non-string, untrusted or high-churn keys.

## Key takeaways {#key-takeaways}

- The real choice is between a closed set of keys and an open one; `Record` can express both, depending on its key type.
- `Record` over a literal union gives required keys, typo detection, autocomplete and compile errors when the union grows.
- `Record<string, V>` and a string index signature behave the same, with the same missing-key risk.
- `Partial<Record<K, V>>` models a sparse map over known keys.
- None of this exists at runtime: every version is a plain object, and `Object.keys` only knows it has strings.
