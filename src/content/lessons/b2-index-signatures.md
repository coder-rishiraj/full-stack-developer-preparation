---
summary: An index signature describes an object whose keys are not known when you write the code, such as a word counter or a cache keyed by id. You will learn the syntax, the rules TypeScript enforces on keys and values, why reads can be undefined at runtime, and which compiler options make dictionary code safer.
difficulty: intermediate
minutes: 40
objectives:
  - Write index signatures with string, number, symbol and template-literal key types
  - Explain why every named property must be compatible with the index signature's value type
  - Predict what keyof returns for a type with an index signature
  - Use noUncheckedIndexedAccess to catch reads of keys that may be missing
  - Choose between an index signature, a Record with literal keys and a Map
---

## Introduction

Most object types you write in TypeScript list their properties by name: a `User` has an `id`, a `name` and an `email`. The compiler knows every key, so it can tell you when you misspell one and suggest the rest in your editor.

Some objects do not work like that. A word counter maps whatever words appear in a document to how often they appear. A cache maps user ids, which arrive from a server, to user records. A translation file maps message keys to strings, and new keys are added every week. You cannot list the keys of these objects in a type, because you do not know them when you write the code. What you *do* know is the shape of every entry: each key is a string, and each value is a number, or a `User`, or a string.

An **index signature** is the TypeScript syntax for exactly that statement: "this object may have any number of keys of this key type, and every value has this value type."

```typescript
type WordCounts = { [word: string]: number };
```

Read it as "for any string `word`, `counts[word]` is a number". The name `word` is only documentation; it has no effect on type checking, but a good name tells the reader what the keys mean.

Index signatures show up wherever JavaScript code uses plain objects as dictionaries: parsed JSON, HTTP headers, environment variables, lookup tables, and normalised state in front-end stores (`{ [id: string]: Todo }`). This lesson covers how they work, the rules the compiler enforces, and the one property of them that causes most bugs: the type says a value is always there, while at runtime it often is not.

## Before you start

- **Object types** — how TypeScript describes the shape of an object with named properties. See [[b2-object-types]].
- **Optional properties and `undefined`** — what `prop?: T` means and why `strictNullChecks` matters. See [[b2-optional-properties]] and [[b2-strict-null-checks]].
- **`keyof`** — the operator that turns an object type into a union of its keys. See [[b2-keyof]].
- **Union and literal types** — `"en" | "fr"` as a type. See [[b2-literal-types]].

## The intuition

Think of a normal object type as a form with labelled boxes: one box for `name`, one for `email`, and nothing else. An index signature is a form with a single instruction instead of boxes: "write as many lines as you like; each line has a label on the left and a number on the right". The form does not know how many lines there will be or what the labels say. It only constrains what every line looks like.

That picture also explains the main limitation. When you look up a label on such a form, the type can promise only "if a line with this label exists, its value is a number". It cannot promise the line exists. Hold onto that idea; most of this lesson is about it.

## Syntax and key types

The general form is `[name: KeyType]: ValueType`, written inside an object type or interface:

```typescript
interface Headers {
  [header: string]: string;
}

type Inventory = {
  [sku: string]: { name: string; stock: number };
};
```

The key type is restricted. It must be `string`, `number`, `symbol`, a template literal pattern such as `` `data-${string}` ``, or a union of these. You cannot write `[k: "en" | "fr"]: string`; a union of specific literals is a finite set of keys, and that is the job of a mapped type or `Record` (see [[b2-record-vs-index-signature]]).

**String keys** are by far the most common. **Number keys** describe array-like objects such as `{ [row: number]: string }`. **Symbol keys** (TypeScript 4.4 and later) describe objects keyed by `Symbol` values, which is rare in application code.

**Template literal pattern keys**, also TypeScript 4.4 and later, restrict which strings are allowed. This type accepts any property whose name starts with `data-`:

```typescript
type DataAttributes = { [attr: `data-${string}`]: string };

const ok: DataAttributes = { "data-id": "42", "data-role": "button" };
const bad: DataAttributes = { "aria-label": "Close" };
```

```output
error TS2353: Object literal may only specify known properties, and '"aria-label"' does not exist in type 'DataAttributes'.
```

You can also mark an index signature `readonly`, which forbids writing through it. This is useful for lookup tables that should never change after creation:

```typescript
type Prices = { readonly [sku: string]: number };
const prices: Prices = { a1: 9.99 };
prices.a1 = 5;
```

```output
error TS2542: Index signature in type 'Prices' only permits reading.
```

As with every `readonly` in TypeScript, this is a compile-time rule only. The JavaScript object is still mutable; call `Object.freeze` if you need a runtime guarantee.

## Reading and writing entries

With a string index signature, both bracket access and dot access are allowed:

```typescript
type Scores = { [player: string]: number };
const scores: Scores = { ada: 10 };

scores["grace"] = 7;    // add an entry
const a = scores.ada;   // dot access is allowed too
```

Dot access on an index signature looks exactly like access to a declared property, which can hide the fact that `ada` is not a known key. The compiler option `noPropertyAccessFromIndexSignature` (TypeScript 4.2 and later) makes this explicit by requiring brackets for keys that come only from an index signature:

```output
error TS4111: Property 'ada' comes from an index signature, so it must be accessed with ['ada'].
```

Teams that enable it use the brackets as a visual signal: `scores["ada"]` means "this key may not exist"; `user.name` means "this property is declared".

## Reads can be `undefined`: `noUncheckedIndexedAccess`

Here is the gap mentioned in the introduction. With TypeScript's default settings, this compiles without complaint:

```typescript
const scores: { [player: string]: number } = { ada: 10 };
const bob = scores["bob"];   // type: number
console.log(bob + 1);        // NaN at runtime
```

The type of `scores["bob"]` is `number`, because the index signature says every value is a number. But there is no `bob` key, so the value at runtime is `undefined`, and `undefined + 1` is `NaN`. The compiler did not lie about the *values that exist*; it was silent about *whether the key exists*, and the code assumed it did.

The compiler option **`noUncheckedIndexedAccess`** (TypeScript 4.1 and later) closes the gap. With it enabled, every read through an index signature includes `undefined` in its type:

```typescript
const bob = scores["bob"];   // type: number | undefined
console.log(bob + 1);
```

```output
error TS18048: 'bob' is possibly 'undefined'.
```

Now you must handle the missing case, usually with `??`, an `if` check, or the `in` operator. Writes are unaffected — `scores["bob"] = 3` still expects a plain `number` — and declared properties are unaffected too, because the compiler knows those exist. The option also applies to array element access (`arr[i]` becomes `T | undefined`), which is the main reason some teams find it noisy. It is not part of `strict`; you must enable it separately in `tsconfig.json` (see [[b2-strict-compiler-options]]).

> [!IMPORTANT] The type describes values, not presence
> Without `noUncheckedIndexedAccess`, `dict[key]` is typed as if the key always exists. For any dictionary filled from user input, a server or a file, enable the option or treat every lookup as possibly missing.

## Mixing named properties with an index signature

An object type can have both declared properties and an index signature. The rule is that **every declared property must be compatible with the index signature's value type**:

```typescript
type Scores = {
  [player: string]: number;
  winner: string;
};
```

```output
error TS2411: Property 'winner' of type 'string' is not assignable to 'string' index type 'number'.
```

The rule follows from what the index signature promises. It says that for *any* string key, the value is a number. `"winner"` is a string, so `scores["winner"]` must also be a number — but the declared property says it is a string. Both statements cannot be true, so the compiler rejects the type. The same applies to optional properties: `winner?: string` fails for the same reason.

There are three fixes, in order of preference:

1. **Separate the two kinds of data.** Put the dynamic entries in their own property: `{ winner: string; scores: { [player: string]: number } }`. This is almost always the clearest design, because code that iterates over the scores no longer has to skip `winner`.
2. **Widen the index value type** to include every declared property: `{ [player: string]: number | string; winner: string }`. This compiles, but now every read of an arbitrary score has type `number | string`, so you lose precision everywhere.
3. **Use an intersection** such as `{ winner: string } & { [player: string]: number }`. Reading works, but creating a value of this type from an object literal fails, because the literal is checked against both halves. Avoid it.

Number index signatures have a related rule. JavaScript converts numeric keys to strings (more on this below), so `obj[1]` and `obj["1"]` reach the same property. If a type has both a string and a number index signature, the number index's value type must be assignable to the string index's value type:

```typescript
type Bad = { [i: number]: string; [k: string]: number };
```

```output
error TS2413: 'number' index type 'string' is not assignable to 'string' index type 'number'.
```

## Excess properties and assignability

Normally an object literal with an unknown property is an error, because TypeScript performs **excess property checking** on fresh object literals. An index signature switches that check off for keys of its key type: every string is now a known key. What is still checked is the *value*:

```typescript
type Scores = { [player: string]: number };
const s1: Scores = { ada: 10, grace: 7, linus: 3 };  // any keys are fine
const s2: Scores = { ada: "ten" };
```

```output
error TS2322: Type 'string' is not assignable to type 'number'.
```

Assignability has a surprising corner. A value whose type is a **type alias** for an object literal type gets an *implicit* index signature, so it can be assigned to `Record<string, unknown>` or `{ [k: string]: unknown }`. A value whose type is an **interface** does not:

```typescript
interface UserI { name: string }
type UserT = { name: string };

const i: UserI = { name: "Ada" };
const t: UserT = { name: "Ada" };

const fromAlias: Record<string, unknown> = t;     // OK
const fromInterface: Record<string, unknown> = i;  // error
```

```output
error TS2322: Type 'UserI' is not assignable to type 'Record<string, unknown>'.
  Index signature for type 'string' is missing in type 'UserI'.
```

The reason is [[b2-declaration-merging]]: an interface can be reopened and extended elsewhere, possibly with properties of any type, so the compiler will not assume all its properties fit an index signature. A type alias is closed. If you hit this error when passing an interface to a function that accepts "any object", either change the parameter to `object` or a generic `T extends object`, or declare the data with a type alias.

## How it works internally

Index signatures are a compile-time description. At runtime the object is an ordinary JavaScript object, and three runtime facts shape how the types behave.

**Property keys are strings or symbols.** JavaScript has no numeric property keys. `obj[1]` converts `1` to `"1"` before the lookup. That is why number index signatures are a constraint *on top of* string keys, and why `Object.keys` returns strings even for a `{ [row: number]: string }`:

```typescript title="numkeys.ts"
const byRow: { [row: number]: string } = {};
byRow[1] = "first";
byRow[2] = "second";
console.log(Object.keys(byRow));
console.log(1 in byRow, "1" in byRow);
```

```output
[ '1', '2' ]
true true
```

**Plain objects inherit from `Object.prototype`.** A `{}` literal already "has" keys such as `constructor`, `toString` and `hasOwnProperty`, inherited from its prototype. The type `{ [word: string]: number }` knows nothing about them, which leads to a real bug in counting code:

```typescript title="proto.ts"
type WordCounts = { [word: string]: number };
const counts: WordCounts = {};
for (const word of ["constructor", "toString"]) {
  counts[word] = (counts[word] ?? 0) + 1;
}
console.log(typeof counts["constructor"], String(counts["constructor"]).slice(0, 27));

const safe: WordCounts = Object.create(null);
for (const word of ["constructor", "toString"]) {
  safe[word] = (safe[word] ?? 0) + 1;
}
console.log(safe);
```

```output
string function Object() { [native
[Object: null prototype] { constructor: 1, toString: 1 }
```

`counts["constructor"]` was not `undefined` — it was the inherited `Object` function — so `?? 0` did not apply, and `+ 1` concatenated a string. The types said `number` throughout. `Object.create(null)` creates an object with no prototype, which avoids the problem; a `Map` avoids it too. Use one of them whenever keys come from untrusted input.

**`keyof` on an index signature is broad.** For `{ [k: string]: number }`, `keyof` is `string | number`, not just `string`. Numbers are included because `obj[1]` is a legal way to read the key `"1"`. For a number-only signature, `keyof` is `number`. This matters when you write generic code such as `function get<T, K extends keyof T>(obj: T, key: K)`: with a dictionary type, `K` accepts any string or number, so the compiler cannot catch a misspelled key.

## Worked example: counting words

Here is a complete program, compiled with `strict` and `noUncheckedIndexedAccess`, that counts words and reports the most frequent ones.

```typescript title="wordcount.ts"
type WordCounts = { [word: string]: number };

function countWords(text: string): WordCounts {
  const counts: WordCounts = {};
  for (const word of text.toLowerCase().split(/\W+/)) {
    if (word === "") continue;
    // With noUncheckedIndexedAccess, counts[word] is number | undefined
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
}

const counts = countWords("The cat saw the other cat. The end.");
console.log(counts);
console.log(counts["the"]);
console.log(counts["dog"]);

const top = Object.entries(counts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 2);
console.log(top);
```

```output
{ the: 3, cat: 2, saw: 1, other: 1, end: 1 }
3
undefined
[ [ 'the', 3 ], [ 'cat', 2 ] ]
```

Walk through it. The splitting regular expression produces an empty string after the final full stop, which the `continue` skips. Inside the loop, `counts[word]` has type `number | undefined` because of `noUncheckedIndexedAccess`, so the code must say what a missing word means: `?? 0` treats it as zero. Without the option, a developer could write `counts[word] + 1`, which would compile and produce `NaN` for every new word.

`counts["dog"]` prints `undefined`, which is exactly the case the option forces you to consider. `Object.entries` returns `[string, number][]` for an index-signature type, so the sort callback gets typed numbers. The sorting is stable in ES2019 and later, so words with equal counts keep their insertion order.

For input from users, this function should create `counts` with `Object.create(null)` or switch to a `Map<string, number>`, for the prototype reason shown earlier.

```quiz
Q: Why does `type T = { [k: string]: number; label: string }` fail to compile?
- [ ] Index signatures cannot be combined with any named properties
- [x] The index signature promises every string key maps to a number, and `"label"` is a string key whose value is declared as a string
- [ ] Named properties must come before the index signature
- [ ] `label` is a reserved word in TypeScript
> Named properties are allowed if their types fit the index value type, so `{ [k: string]: number; count: number }` is fine. The conflict is logical: `t["label"]` cannot be both `number` (from the signature) and `string` (from the property). Order of members does not matter.

Q: With default compiler options, what is the type of `d["missing"]` when `d: { [k: string]: boolean }`?
- [x] `boolean`
- [ ] `boolean | undefined`
- [ ] `undefined`
- [ ] `unknown`
> By default TypeScript assumes every key exists, so the read is typed as the value type, `boolean`, even though it is `undefined` at runtime. Only `noUncheckedIndexedAccess` adds `| undefined` to such reads.

Q: What is `keyof { [k: string]: number }`?
- [ ] `string`
- [x] `string | number`
- [ ] `never`
- [ ] `number`
> JavaScript converts numeric keys to strings, so `obj[1]` reads the key `"1"`. TypeScript therefore treats both strings and numbers as valid keys of a string-indexed type.
```

## In real systems

**Normalised state.** Redux Toolkit's entity adapter, and hand-written stores, keep collections as `{ ids: string[]; entities: { [id: string]: Todo } }`. Lookup by id is O(1), and the separate `ids` array preserves order. Notice the design: dynamic entries live in their own property, not mixed with metadata.

**Parsed external data.** `JSON.parse` returns `any`. A common first step is to describe a translation file as `{ [key: string]: string }` or a feature-flag payload as `{ [flag: string]: boolean }`, then validate it at runtime with a schema library before trusting it. The index signature describes the *expected* shape; it does not check anything at runtime.

**Library type definitions.** Node's `process.env` is typed as an index signature whose values are `string | undefined`, precisely because any variable may be missing. HTTP header objects and CSS-in-JS style objects are typed the same way.

## Trade-offs and alternatives

| Need | Best tool | Why |
|---|---|---|
| Keys unknown until runtime, plain object is fine | `{ [k: string]: V }` or `Record<string, V>` | Lightweight, serialises to JSON directly |
| Keys are a known finite set (`"en" \| "fr"`) | `Record<"en" \| "fr", V>` | Compiler checks every key is present; see [[b2-record-vs-index-signature]] |
| Keys come from untrusted input, or are not strings | `Map<K, V>` | No prototype keys, any key type, `size`, guaranteed insertion order |
| Frequent additions and deletions | `Map<K, V>` | `Map` is designed for churn; in V8, `delete` can move an object to a slower representation |
| Keys follow a naming pattern | `` { [k: `data-${string}`]: V } `` | Rejects keys outside the pattern |

`{ [k: string]: V }` and `Record<string, V>` behave the same for reads, writes and assignment (only `keyof` differs slightly; see [[b2-record-vs-index-signature]]), so which one you write is mostly a matter of style. The index signature form lets you name the key (`[userId: string]`), which documents intent; the `Record` form is shorter.

The cost of an index signature is precision. You give up misspelling detection on keys, autocomplete in the editor, and exhaustiveness checks. Use one only when the key set truly is open.

## Common mistakes

> [!MISTAKE] Using an index signature for a fixed set of keys
> `type Labels = { [status: string]: string }` for a value that always has exactly `idle`, `loading` and `error` lets `labels.laoding` compile and gives no error when a new status is added without a label. Use `Record<Status, string>` so the compiler enforces every key.

**Trusting reads without `noUncheckedIndexedAccess`.** Code such as `config[name].toUpperCase()` compiles and crashes when `name` is missing. Enable the option, or check with `if (name in config)` first.

**Mixing metadata into the dictionary.** Adding `total: number` beside `[player: string]: number` compiles (the types match) but now `Object.values(scores)` includes the total, and a player named `total` overwrites it. Put the entries in their own property.

**Using objects as dictionaries for arbitrary user strings.** Keys such as `__proto__`, `constructor` or `toString` collide with `Object.prototype`. Use `Map` or `Object.create(null)`.

**Expecting `Object.keys` to return the key type.** `Object.keys` always returns `string[]`, even for `{ [row: number]: string }`, because that is what JavaScript returns.

## Interview perspective

Interviewers use index signatures to test whether you understand the boundary between what the type system promises and what exists at runtime.

> [!INTERVIEW] A strong answer to "what's wrong with this type?"
> "The index signature `[key: string]: number` says every string key reads as a number, so the declared `name: string` contradicts it and the compiler rejects it. I'd move the entries into their own property. Separately, reads from this dictionary are typed `number` even when the key is missing, so I'd enable `noUncheckedIndexedAccess` or handle `undefined` explicitly."

Questions to prepare for:

- **Index signature or `Record`?** Same thing for `string` keys; `Record` with a union of literals is different, because it requires every key.
- **When would you use `Map` instead?** Non-string keys, untrusted keys, frequent deletes, or when you need `size` and ordered iteration.
- **Why can't an interface be assigned to `Record<string, unknown>`?** Interfaces can be merged later, so they get no implicit index signature; type aliases do.
- **What does `keyof` return for a string index signature?** `string | number`, because numeric keys are converted to strings.

## Practice

1. Write a type `EnvVars` for an object whose keys are environment-variable names and whose values may be missing. Then write `requireEnv(env, name)` that returns a `string` or throws a clear error.
2. A teammate wrote `type Cart = { [sku: string]: number; couponCode?: string }`. Explain the compile error and redesign the type.
3. Write a type for objects that may only have keys starting with `on` (`onClick`, `onSubmit`) whose values are functions. Show one value it accepts and one it rejects.
4. Rewrite `countWords` with a `Map<string, number>` and compare how missing keys are handled.
5. Enable `noUncheckedIndexedAccess` in a small project and fix each new error. Note which ones were real bugs.

## Quick revision {#quick-revision}

- Syntax: `{ [name: KeyType]: ValueType }`; the name is documentation only.
- Key types: `string`, `number`, `symbol`, template literal patterns (TS 4.4+), or unions of these; not literal unions.
- Every declared property must be assignable to the index value type; otherwise TS2411.
- A number index's value type must be assignable to the string index's value type.
- Default reads are typed `V` even for missing keys; `noUncheckedIndexedAccess` makes them `V | undefined` (not part of `strict`).
- `noPropertyAccessFromIndexSignature` forces `obj["key"]` for index-signature keys.
- `keyof { [k: string]: V }` is `string | number`.
- `readonly [k: string]: V` forbids writes at compile time only.
- Type aliases get an implicit index signature; interfaces do not.
- Plain objects inherit prototype keys; use `Map` or `Object.create(null)` for untrusted keys.

## Key takeaways {#key-takeaways}

- An index signature describes an open-ended dictionary: unknown keys, uniform value type.
- It promises the type of values that exist, never that a given key exists; handle missing keys explicitly or enable `noUncheckedIndexedAccess`.
- Named properties must fit the index value type, so keep metadata separate from dynamic entries.
- When the keys form a known finite set, use `Record` with a literal union instead, and gain exhaustiveness checking.
- At runtime it is an ordinary object: keys are strings, prototype keys exist, and nothing is validated.
