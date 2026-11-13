---
summary: JavaScript has two values for "nothing here" — null and undefined — and TypeScript gives each its own type. You will learn how they differ at runtime, how to model absence precisely with optional properties and unions, and how to handle possibly-missing values safely with narrowing, ?? and ?.
difficulty: beginner
minutes: 40
objectives:
  - Explain the runtime differences between null and undefined and where each one comes from
  - Choose between an optional property, T | undefined and T | null when modelling data
  - Narrow a possibly-missing value with ===, == null and truthiness checks, and say when truthiness is wrong
  - Use ?? and ?. correctly and explain why || is a bug for 0 and ""
  - Decide when a non-null assertion (!) is justified
---

## Introduction

Every program has to represent the idea "there is no value here": a user who has not set a nickname, a search that found nothing, a DOM element that is not on the page, a form field the user left alone. JavaScript has not one but two values for this, **`undefined`** and **`null`**, and the bug they cause is the most common runtime error in JavaScript: `TypeError: Cannot read properties of undefined`.

TypeScript's answer is to give each of these values its own **type**. The type `null` has exactly one value, `null`; the type `undefined` has exactly one value, `undefined`. A variable that might be missing is then written as a union — `string | null` or `string | undefined` — and the compiler makes you deal with the missing case before you use the value. That only works when the compiler flag `strictNullChecks` is on, which is the subject of the next lesson, [[b2-strict-null-checks]]. This lesson assumes it is on, as it is under `"strict": true` and by default in TypeScript 6.0.

You will learn what the two values mean at runtime, how to describe absence precisely in your types, and the operators and checks that handle it safely.

## Before you start

- **JavaScript's `null` and `undefined`** — how they behave as plain values. See [[b1-undefined-vs-null]], [[b1-type-null]] and [[b1-type-undefined]].
- **Optional chaining and nullish coalescing** in JavaScript — the `?.` and `??` operators. See [[b1-optional-chaining]] and [[b1-nullish-coalescing]].
- **Union types** — `A | B` means a value of either type. See [[b2-unions]].
- **Truthy and falsy values** — which values count as `false` in an `if`. See [[b1-truthy-falsy]].

The examples were compiled with TypeScript 6.0 using `tsc --strict` and run with Node.js 22.

## The intuition

Think of a paper form with a "Middle name" box. There are two different ways it can be empty. The person may have skipped the question entirely — the box was never filled in. Or they may have written "none" — they answered, and the answer is "there is no middle name". A careful system treats those differently: the first might mean "ask again", the second means "stop asking".

JavaScript's two values map loosely onto those two situations:

- **`undefined`** is the language's default for "nothing was put here": a variable declared without a value, a missing object property, a function parameter the caller did not pass, a function that did not `return` anything.
- **`null`** is a value that code assigns on purpose to say "deliberately empty": a database column with no value, a `getElementById` that found no element, an API field the server explicitly cleared.

The analogy is a convention, not a rule the language enforces. Nothing stops code from assigning `undefined` on purpose or from returning `null` by accident. But the convention is common enough that TypeScript lets you express it in your types, and well-designed APIs follow it.

## How null and undefined differ at runtime

Before talking about types, it helps to see that the two values really behave differently in JavaScript. This is plain JavaScript, run with Node.js:

```javascript title="absence.js"
const user = { name: "Ada", nickname: undefined, manager: null };
console.log(typeof undefined, typeof null);
console.log(undefined == null, undefined === null);
console.log(JSON.stringify(user));
console.log("nickname" in user, Object.keys(user));
function greet(name = "guest") { return `hi ${name}`; }
console.log(greet(undefined), greet(null));
const { a = 1, b = 2 } = { a: undefined, b: null };
console.log(a, b);
```

```output
undefined object
true false
{"name":"Ada","manager":null}
true [ 'name', 'nickname', 'manager' ]
hi guest hi null
1 null
```

Line by line:

- `typeof null` is `"object"` — a famous mistake from the first version of JavaScript that can never be fixed without breaking the web ([[b1-typeof-null]]). It means a `typeof x === "object"` check also needs `x !== null`.
- `==` (loose equality) treats `null` and `undefined` as equal to each other and to nothing else. `===` keeps them apart. This makes `x == null` a convenient check for "either one".
- `JSON.stringify` **drops** properties whose value is `undefined` but **keeps** `null`. JSON has no `undefined`, so an `undefined` field simply disappears when sent to a server. If the server needs to know that a field was cleared, you must send `null`.
- A property set to `undefined` still **exists**: `"nickname" in user` is `true` and it appears in `Object.keys`. A property that was never set does not.
- **Default values** — in parameters and in destructuring — apply only for `undefined`. Passing `null` bypasses the default, so `greet(null)` prints `hi null`.

These differences are why TypeScript keeps the two as separate types. Code that sends JSON, uses defaults or checks keys behaves differently depending on which one it gets.

## The null and undefined types

With `strictNullChecks` on, `null` and `undefined` are not part of any other type. `string` means "a string", never "a string or nothing". To allow absence, you say so with a union:

```typescript
let title: string = null;              // error: Type 'null' is not assignable to type 'string'
let subtitle: string | null = null;    // fine
let draft: string | undefined;         // fine; starts as undefined
```

The two types are also separate from each other. A variable typed `null` cannot hold `undefined`, and the reverse. That separation is what lets you describe *which* kind of absence an API produces.

Several standard APIs already include absence in their return types, and the compiler will remind you every time you use them:

| Expression | Type |
|---|---|
| `document.getElementById("save")` | `HTMLElement \| null` |
| `document.querySelector("form")` | `HTMLFormElement \| null` |
| `array.find(predicate)` | `T \| undefined` |
| `map.get(key)` | `V \| undefined` |
| `localStorage.getItem("token")` | `string \| null` |
| `regex.exec(text)` | `RegExpExecArray \| null` |

Notice the pattern: DOM and storage APIs return `null` ("I looked and there is nothing"), while JavaScript collection methods return `undefined`. You cannot change these, so your code must handle whichever one each API uses.

## Modelling absence in your own types

When you design an interface, you have three ways to say a field may have no value, and they mean different things:

```typescript title="profile.ts"
interface Profile {
  name: string;
  nickname?: string;          // may be missing entirely
  avatarUrl: string | null;   // always present, explicitly empty
  bio: string | undefined;    // always present as a key, value may be undefined
}

const p1: Profile = { name: "Ada", avatarUrl: null, bio: undefined };
const p2: Profile = { name: "Lin", avatarUrl: null };
const p3: Profile = { name: "Sam", nickname: undefined, avatarUrl: null, bio: "hi" };

function shout(p: Profile): string {
  return p.nickname.toUpperCase();
}
```

```output
profile.ts(9,7): error TS2741: Property 'bio' is missing in type '{ name: string; avatarUrl: null; }' but required in type 'Profile'.
profile.ts(13,10): error TS18048: 'p.nickname' is possibly 'undefined'.
```

**An optional property** (`nickname?: string`) may be left out of the object. When you read it, its type is `string | undefined`, which is why `shout` fails: the compiler makes you handle the missing case. Optional properties are the right choice for configuration objects, props and partial updates, where leaving a key out is normal. See [[b2-optional-properties]].

**`T | undefined` without `?`** (`bio`) means the key is required but its value may be `undefined`. `p2` fails because it leaves `bio` out. This is useful when you want every caller to make a conscious decision, even if that decision is "no value".

**`T | null`** (`avatarUrl`) means the key is always present and `null` marks an explicit "nothing". It is the natural fit for data from databases and JSON APIs, because SQL `NULL` and JSON `null` both survive the trip, whereas `undefined` disappears in `JSON.stringify`.

Notice that `p3` *does* compile: by default, an optional property also accepts an explicit `undefined`. If you need "missing" and "present but `undefined`" to be different — for example because your code uses `"nickname" in profile` — the compiler flag **`exactOptionalPropertyTypes`** (TypeScript 4.4+, not included in `strict`) forbids writing `undefined` into an optional property unless the type says `| undefined` explicitly. With that flag, `p3` produces error TS2375.

**Optional parameters** work the same way as optional properties. In `function padLeft(text: string, width?: number)`, `width` has type `number | undefined` inside the function, and callers may omit it or pass `undefined`. See [[b2-optional-rest-parameters]].

### Choosing a convention

Teams choose different conventions, and consistency matters more than the choice. A common and practical one:

- Use **optional properties** (`?`) for things that may be left out: options, props, patch objects.
- Use **`| null`** for values that come from or go to a server or database, where "explicitly empty" must survive serialisation.
- Use **`undefined`** for "not computed yet" or "not found" inside your own code, matching what `find` and `Map.get` return.
- Avoid types like `string | null | undefined` in your own models unless the two absences really mean different things. Each extra case is one more thing every reader must handle.

## Handling values that may be missing

The compiler will not let you use a `string | undefined` as a `string`. You have to **narrow** it: write a check that rules out the missing case, after which the compiler treats the value as a plain `string` (control flow analysis, explained in [[b2-strict-null-checks]] and [[b2-narrowing]]).

```typescript title="narrowing.ts"
function label(value: string | null | undefined): string {
  if (value == null) {
    return "(none)";          // value: null | undefined
  }
  return value.trim();        // value: string
}

function padLeft(text: string, width?: number): string {
  // width: number | undefined
  return text.padStart(width ?? 8, ".");
}

const scores = new Map<string, number>([["ada", 90]]);
const linScore = scores.get("lin");          // number | undefined
const first = [3, 8, 15].find((n) => n > 10); // number | undefined

console.log(label(null), label("  hi  "), padLeft("x"), padLeft("x", 3));
console.log(linScore, first);
console.log(linScore.toFixed(0));
```

```output
narrowing.ts(19,13): error TS18048: 'linScore' is possibly 'undefined'.
```

If the error is ignored and the emitted JavaScript runs anyway, the first two lines print and the third crashes — exactly the bug the compiler predicted:

```output
(none) hi .......x ..x
undefined 15
TypeError: Cannot read properties of undefined (reading 'toFixed')
```

The ways to narrow, and when to use each:

- **`value === null`** or **`value === undefined`** removes exactly one of the two. Use it when only one is possible or they mean different things.
- **`value == null`** (loose equality) removes both `null` and `undefined` in one check, and nothing else. It is the one place many style guides allow `==` instead of `===`, because its meaning here is precise.
- **`if (value)`** (truthiness) also removes `null` and `undefined` — but it removes `""`, `0`, `NaN` and `false` too. That is correct for objects and arrays, which are always truthy. It is a **bug** for strings and numbers when an empty string or zero is a valid value.
- **`typeof value === "string"`** narrows to the type you want directly.

### Nullish coalescing: `??`

`a ?? b` evaluates to `a` unless `a` is `null` or `undefined`, in which case it evaluates to `b`. The type of the result has the absence removed: `width ?? 8` is a `number`.

The older idiom `a || b` looks similar but uses truthiness, and that difference matters as soon as `0` or `""` is a valid value:

```typescript title="defaults.ts"
interface Settings {
  volume?: number;
  title?: string;
}

function describeSettings(s: Settings): string {
  const volumeOr = s.volume || 50;      // 0 is falsy, so it becomes 50
  const volumeNc = s.volume ?? 50;      // only null/undefined become 50
  const titleLen = s.title?.length;     // number | undefined
  return `|| ${volumeOr}, ?? ${volumeNc}, title length ${titleLen}`;
}

console.log(describeSettings({ volume: 0, title: "" }));
console.log(describeSettings({}));
```

```output
|| 50, ?? 0, title length 0
|| 50, ?? 50, title length undefined
```

The user muted the volume to `0`, and `||` silently turned it back up to `50`. `??` respects the `0`. TypeScript does not flag `||` here, because it is valid code with a type of `number` either way — this is a logic bug the types cannot see, so the habit has to come from you: **use `??` for defaults**, and `||` only when you really mean "any falsy value". The assignment form `a ??= b` (ES2021) assigns `b` only when `a` is nullish.

### Optional chaining: `?.`

`a?.b` reads `b` if `a` is not `null` or `undefined`, and otherwise stops and produces `undefined` instead of throwing. It works for calls (`callback?.()`) and index access (`list?.[0]`). The result type includes `undefined`: `s.title?.length` above is `number | undefined`, so you usually combine it with `??` to get a definite value, as in `user.address?.city ?? "unknown city"`.

Two cautions. First, `?.` turns a crash into an `undefined` that travels further through the program; use it where absence is expected, not to hide data that should always be there. Second, it short-circuits the *whole* rest of the chain: in `a?.b.c`, if `a` is nullish the result is `undefined` and `.c` is never evaluated.

## The non-null assertion: `!`

Sometimes you know a value is present but the compiler cannot prove it. The postfix **non-null assertion** `value!` removes `null` and `undefined` from the type without any check:

```typescript title="dom.ts"
const button = document.getElementById("save");   // HTMLElement | null
button.addEventListener("click", () => {});        // error

const form = document.querySelector("form");        // HTMLFormElement | null
form!.reset();                                      // compiles; throws if no <form>

const input = document.querySelector<HTMLInputElement>("#email");
if (input) {
  console.log(input.value);                         // narrowed: HTMLInputElement
}
```

```output
dom.ts(2,1): error TS18047: 'button' is possibly 'null'.
```

(This file was type-checked with the DOM library; it was not run in a browser.)

`form!` compiles, but `!` is erased like every other type annotation. If the page has no `<form>`, `form` is `null` at runtime and `form.reset()` throws. The assertion moved the check from the compiler to your memory. Use it only when you have a real reason the compiler cannot see — for example, the element is in a static HTML template that ships with the script — and prefer an explicit check that throws a clear error otherwise. [[b2-non-null-assertion]] covers the trade-offs in detail.

## Worked example: a user card from API data

A small but realistic piece of UI code: an API returns users with some fields explicitly `null`, and a form sends partial updates where a missing key means "leave it alone" and `null` means "clear it".

```typescript title="user-card.ts"
// Shape of the API response: the server sends null for "known to be empty".
interface ApiUser {
  id: number;
  displayName: string | null;
  email: string;
  address: { city: string | null } | null;
  unreadCount: number;
}

// Shape of a form update: a missing key means "leave unchanged".
interface UserPatch {
  displayName?: string | null;   // null means "clear it"
  email?: string;
}

function cardText(user: ApiUser): string {
  const name = user.displayName ?? user.email.split("@")[0];
  const city = user.address?.city ?? "unknown city";
  const badge = user.unreadCount > 0 ? ` (${user.unreadCount})` : "";
  return `${name} from ${city}${badge}`;
}

function applyPatch(user: ApiUser, patch: UserPatch): ApiUser {
  return {
    ...user,
    displayName: patch.displayName !== undefined ? patch.displayName : user.displayName,
    email: patch.email ?? user.email,
  };
}

const ada: ApiUser = {
  id: 1,
  displayName: null,
  email: "ada@example.com",
  address: null,
  unreadCount: 0,
};

console.log(cardText(ada));
const renamed = applyPatch(ada, { displayName: "Ada L." });
console.log(cardText({ ...renamed, address: { city: "London" }, unreadCount: 3 }));
console.log(cardText(applyPatch(renamed, { displayName: null })));
console.log(cardText(applyPatch(renamed, {})));
```

```output
ada from unknown city
Ada L. from London (3)
ada from unknown city
Ada L. from unknown city
```

Things to notice:

1. `ApiUser` uses `| null` for fields the server sends as `null`, and the address is nullable at two levels — the whole object and the city inside it. `user.address?.city ?? "unknown city"` handles both levels in one expression.
2. `unreadCount` is a number where `0` is meaningful. The code compares it with `> 0` instead of testing truthiness, so the intent is explicit.
3. `UserPatch` uses an optional property *and* `null` for `displayName`, because the patch has three meanings: key missing (keep the old name), `null` (clear it), a string (set it). That is why `applyPatch` checks `!== undefined` rather than using `??` — `??` would treat the explicit `null` as "missing" and the user could never clear their name.
4. For `email`, `null` is not allowed by the type, so `??` is the right tool.

The third call shows the clear-to-`null` path: the display name is cleared and the card falls back to the email prefix. The fourth call passes an empty patch and changes nothing.

```quiz
Q: A settings object has `fontSize?: number`, and the user may set it to 0 to hide text. Which expression gives the default 14 only when the setting is missing?
- [ ] `settings.fontSize || 14`
- [x] `settings.fontSize ?? 14`
- [ ] `settings.fontSize! ?? 14`
- [ ] `settings?.fontSize || 14`
> `??` falls back only for null and undefined. `||` falls back for every falsy value, so a deliberate 0 would become 14. The `!` version removes undefined from the type, which makes the `??` pointless and hides the missing case. Optional chaining on `settings` does not change how 0 is treated.

Q: Which value does `JSON.stringify({ a: undefined, b: null })` produce?
- [ ] `{"a":undefined,"b":null}`
- [ ] `{"a":null,"b":null}`
- [x] `{"b":null}`
- [ ] `{}`
> JSON has no undefined, so properties holding undefined are omitted, while null is a valid JSON value and is kept. This is why server-bound data uses `null` to say "explicitly cleared".

Q: Under default compiler settings, which object is assignable to `{ nickname?: string }`?
- [ ] Only `{}`
- [ ] Only `{ nickname: "x" }`
- [x] `{}`, `{ nickname: "x" }` and `{ nickname: undefined }`
- [ ] Only objects that list `nickname` explicitly
> An optional property may be absent, and by default it also accepts an explicit `undefined`. Only the separate flag `exactOptionalPropertyTypes` rejects `{ nickname: undefined }` unless the type adds `| undefined` explicitly.
```

## In real systems

**API clients and databases.** Generated API types (from OpenAPI specs or GraphQL schemas) and ORM types (Prisma, Drizzle) represent nullable columns as `T | null`. Front-end code then uses `?.` and `??` at the point of display, and keeps `null` when sending updates back so that "clear this field" survives JSON serialisation.

**React props.** Optional props (`label?: string`) are the norm, and components set defaults with destructuring defaults (`function Button({ label = "OK" })`), which, as shown above, apply only to `undefined`. Rendering `null` from a component means "render nothing", a separate convention from the type `null`.

**DOM code.** `querySelector` returns `null` when nothing matches, so typed DOM code narrows at the top of a function or throws a descriptive error (`if (!root) throw new Error("#app missing")`), after which the rest of the function works with a definite element.

**Lookups.** `Map.get` and `Array.find` return `undefined` for "not found", and the compiler forces callers to decide what not-found means — a default, an error, or an early return — instead of discovering it as a crash.

## Trade-offs and alternatives

| Option | Meaning | Good for | Watch out for |
|---|---|---|---|
| `prop?: T` | Key may be missing | Options, props, patches | Also accepts explicit `undefined` unless `exactOptionalPropertyTypes` |
| `prop: T \| undefined` | Key required, value may be absent | Forcing callers to decide | Callers must write `prop: undefined` |
| `prop: T \| null` | Explicitly empty | JSON, databases | `typeof null === "object"`; defaults do not apply to `null` |
| `prop: T` plus a sentinel (`""`, `-1`) | Absence hidden in a normal value | Rarely a good idea | The compiler cannot remind anyone to check |
| Discriminated union (`{ status: "loading" } \| { status: "ready"; data: T }`) | Absence tied to a state | Async data, wizards | More verbose; see [[b2-remote-data-pattern]] |

The last row is worth remembering. When several fields are null "together" (`data` and `error` both null while loading), a discriminated union describes the valid combinations directly, so code never has to check fields that cannot be set in the current state.

## Common mistakes

> [!MISTAKE] Using || for defaults
> `count || 10` replaces `0`, and `name || "Anonymous"` replaces `""`. If either is a valid value, use `??`. The compiler cannot catch this because both expressions are well-typed.

**Truthiness checks on numbers and strings.** `if (user.age)` skips age `0`; `if (query)` treats an empty search as "no search". Compare with `!= null` or `!== undefined` when zero or empty is meaningful.

**Expecting defaults to apply to `null`.** Parameter and destructuring defaults fire only on `undefined`. If an API sends `null`, write `value ?? fallback` explicitly.

**Sending `undefined` to clear a field.** It vanishes in `JSON.stringify`, so the server sees "no change". Send `null`.

**Sprinkling `!` to silence errors.** Each `!` is an unchecked promise that the value exists. If you cannot explain why it is safe, write a check.

**Mixing `null` and `undefined` without meaning.** A type like `string | null | undefined` in every model doubles the cases readers must think about. Choose a convention and apply it.

## Interview perspective

Questions about `null` and `undefined` test whether you understand JavaScript's runtime behaviour as well as TypeScript's types.

> [!INTERVIEW] null versus undefined
> "`undefined` is JavaScript's default for 'not set' — missing properties, unpassed parameters, no return value. `null` is assigned deliberately for 'empty'. They differ at runtime: `typeof null` is `'object'`, JSON keeps `null` but drops `undefined`, and default values only replace `undefined`. In TypeScript with `strictNullChecks`, each is its own type, so I write `T | null` or an optional property and the compiler makes me handle the missing case."

Questions to prepare:

- **Optional property versus `T | undefined`?** Optional means the key may be absent; `| undefined` means the key must be written. Mention `exactOptionalPropertyTypes` for the stricter distinction.
- **`??` versus `||`?** Nullish versus falsy; give the `0` or `""` example.
- **When is `!` acceptable?** When an invariant the compiler cannot see guarantees presence, and an explicit check would be noise. Otherwise prefer narrowing.
- **How do you check for both `null` and `undefined`?** `x == null`, and explain why it is precise.
- **What does `a?.b.c` do when `a` is `undefined`?** Returns `undefined` without evaluating `.c`.

## Practice

1. **Classify the absences.** For a blog post model with `title`, `subtitle`, `publishedAt` (not set for drafts) and `coverImageUrl` (can be cleared), choose between `?`, `| undefined` and `| null` for each field and justify each choice.
2. **Fix the defaults.** Rewrite `function paginate(page?: number, size?: number) { page = page || 1; size = size || 20; }` so that it handles `0` sensibly, and decide whether `page = 0` should be allowed at all.
3. **Patch semantics.** Extend `UserPatch` from the worked example with `address?: { city: string | null } | null` and implement it in `applyPatch` so that a missing key, `null` and a value each behave correctly.
4. **DOM without `!`.** Write `function mustGet<T extends Element>(selector: string): T` that throws a descriptive error when `querySelector` returns `null`, and use it instead of `!` in the `dom.ts` example.
5. **Predict the output.** Without running it, predict `const { x = 5 } = { x: null }; console.log(x ?? "none");`, then check.

## Quick revision {#quick-revision}

- `undefined`: language default for "not set" (missing property, unpassed parameter, no `return`). `null`: assigned deliberately for "empty".
- Runtime: `typeof null === "object"`; `null == undefined` but `null !== undefined`; JSON drops `undefined`, keeps `null`; defaults apply only to `undefined`.
- With `strictNullChecks`, `null` and `undefined` are separate types; allow them with unions.
- DOM and storage APIs return `null`; `find`, `Map.get`, missing properties give `undefined`.
- `prop?: T` → may be absent, reads as `T | undefined`; `prop: T | undefined` → key required; `prop: T | null` → explicit empty, survives JSON.
- `exactOptionalPropertyTypes` (not in `strict`) forbids explicit `undefined` in optional properties.
- Narrow with `=== null`, `=== undefined`, `== null` (both), `typeof`; truthiness also removes `0`, `""`, `NaN`, `false`.
- `??` replaces only `null`/`undefined`; `||` replaces every falsy value. `?.` short-circuits to `undefined`.
- `!` removes `null`/`undefined` from the type with no runtime check.

## Key takeaways {#key-takeaways}

- JavaScript has two absence values that behave differently in JSON, defaults and `typeof`; TypeScript gives each its own type so you can say which one you mean.
- With `strictNullChecks`, a type never includes absence unless you write it in a union or with `?`, and the compiler makes you narrow before use.
- Use optional properties for "may be left out" and `| null` for "explicitly empty", especially for data that crosses a network.
- Prefer `??` over `||` for defaults, and use `?.` where absence is expected rather than to hide missing data.
- A non-null assertion is an unchecked claim; a real check that throws a clear error is almost always better.
