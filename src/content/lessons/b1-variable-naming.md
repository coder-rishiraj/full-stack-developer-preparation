---
summary: A variable's name is the first and often the only documentation a reader gets. You will learn the JavaScript naming conventions, how to choose names that state meaning, units and intent, which names collide with built-ins and browser globals, and how teams enforce and change names safely.
difficulty: beginner
minutes: 35
objectives:
  - Apply JavaScript's casing conventions for variables, functions, classes, constants, components and hooks
  - Choose names that state what a value means, including booleans, collections, maps, units and time
  - Identify names that shadow built-ins or collide with browser globals, and explain the bug each causes
  - Rewrite a function with unclear names so it can be understood without comments
  - Explain why minification makes long names free in production, and how tooling enforces and renames names
---

## Introduction

Code is read far more often than it is written. A function is written once, then read by reviewers, by teammates fixing bugs in it, by you six months later, and by whoever searches the codebase for "where do we compute the discount?". Every one of those readers meets the names first. A good name lets them understand a line without reading the lines around it; a poor one forces them to reconstruct the meaning from the code, every time.

Consider `const d = 86400000;`. The value is correct, but a reader has to recognise that 86,400,000 is the number of milliseconds in a day. `const ONE_DAY_MS = 24 * 60 * 60 * 1000;` says the same thing with no decoding at all. The engine treats both identically. The difference is entirely for humans — and humans are where most software cost goes.

Naming is not only taste. Some names in JavaScript cause real bugs: a variable called `name` at the top of a browser script turns numbers into strings, a local called `String` breaks every later call to `String()`, and a lowercase React component is silently rendered as an unknown HTML tag. This lesson covers both halves: the conventions and habits that make names communicate, and the specific names the language and the browser make dangerous.

## Before you start

- **Identifiers** — the rules for what characters a name may contain and which words are reserved. See [[b1-identifiers]] and [[b1-keywords]].
- **Declarations** — `let`, `const` and `var`, because how long a variable lives affects how descriptive its name should be. See [[b1-var-let-const]].
- **Scope and shadowing** — an inner name hides an outer one with the same spelling. See [[b1-scope]] and [[b1-shadowing]].
- **Global variables** — several naming traps come from the browser's global object. See [[b1-global-variables]].

## The intuition

Treat every name as a tiny **interface**. A function's signature tells callers what it needs and what it returns without showing its body; a variable's name should tell readers what the value *means* without making them trace where it came from. If a reader has to scroll up to learn what `tmp2` holds, the interface has failed, even though the program works.

A useful test follows from this: cover the right-hand side of a declaration and read only the name. Can you say what kind of value it holds, what it represents and, where it matters, what unit it is in? `usersById` passes — a lookup from id to user. `data` fails — it could be anything. `timeout` half-passes — it is a duration, but in seconds or milliseconds?

The analogy has a limit: unlike a function signature, nothing checks that a name is true. A function called `getUser` that also writes to the database still compiles. Keeping names honest is a discipline, which is why it shows up so often in code review.

## Conventions: casing by kind {#casing}

JavaScript has no official style enforced by the engine, but the ecosystem converged long ago on conventions that the built-in APIs themselves follow (`parseInt`, `toUpperCase`, `Array`, `Number.MAX_SAFE_INTEGER`). Following them lets a reader tell what kind of thing a name refers to before reading anything else.

| Kind | Convention | Examples |
|---|---|---|
| Variables, parameters, properties | `camelCase` | `cartTotal`, `retryCount`, `user.firstName` |
| Functions and methods | `camelCase`, usually a verb | `fetchOrders`, `formatPrice`, `isValidEmail` |
| Classes and constructor functions | `PascalCase` noun | `ShoppingCart`, `HttpClient` |
| React components | `PascalCase` (required by JSX) | `UserCard`, `CheckoutForm` |
| React hooks | `camelCase` starting with `use` (required by tooling) | `useCart`, `useDebouncedValue` |
| TypeScript types and interfaces | `PascalCase` | `OrderStatus`, `UserProfile` |
| Fixed configuration constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| File-private by convention | leading `_` | `_cache` (not real privacy) |
| Truly private class members | `#` prefix | `#balance` |

Two of these rows are more than convention. In JSX, a tag that starts with a lowercase letter is treated as an HTML element, so `<userCard />` renders an unknown `<usercard>` element instead of your component — no error, just nothing useful on screen. And React's linting and compiler identify hooks by the `use` prefix; a hook named `getCart` will not be checked against the rules of hooks. See [[b4-react-component]] and [[b4-custom-hooks]].

`UPPER_SNAKE_CASE` is widely misapplied. It is for values that are fixed when the code is written and act as configuration — limits, URLs, magic numbers given names. It is not for every `const`. `const user = await fetchUser(id)` is a `const` binding, but the value differs on every call, so it is a normal `camelCase` variable. If every `const` were shouted, the casing would stop carrying information. The `const` keyword itself is covered in [[b1-const]].

Leading underscores signal "internal, don't depend on this", but they protect nothing: `obj._cache` is readable and writable by anyone. When you need real privacy, use `#private` class fields or a module-level variable that is not exported.

## Names that state meaning {#meaning}

Casing tells the reader what *kind* of thing a name is. The words tell them what it *means*. The following habits cover most of what experienced reviewers look for.

### Say what the value represents, not how it is stored

`userList`, `nameString` and `countNumber` restate the type, which the code already shows. Prefixing type information (`strName`, `arrItems`, so-called Hungarian notation) was useful in languages without good tooling; in JavaScript with an editor and TypeScript, it is noise that becomes a lie when the type changes. Name the meaning: `users`, `displayName`, `unreadCount`.

Avoid names that could describe any value: `data`, `info`, `item`, `obj`, `value`, `result`, `temp`, `stuff`. They are acceptable only when the scope is a few lines and the context really is generic (a utility function that accepts any value can call its parameter `value`). In application code, `const data = await response.json()` is the moment to write `const orders = await response.json()` instead.

### Booleans read as yes/no questions

A boolean answers a question, so name it like one: `isLoading`, `hasError`, `canSubmit`, `shouldRetry`, `wasCancelled`. Then conditions read as sentences: `if (canSubmit && !isLoading)`. A boolean called `loading` or `error` is ambiguous — `error` might be a message, an `Error` object or a flag.

Name booleans positively. Negated names make conditions harder to read the moment someone negates them again:

```javascript title="negated-booleans.js"
const isNotHidden = false;
if (!isNotHidden) console.log('hidden');   // "if not not hidden" — reader has to work it out

const isVisible = false;
if (!isVisible) console.log('hidden');     // reads directly
```

```output
hidden
hidden
```

Both conditions behave the same; only one can be understood at a glance. The same applies to configuration options: `{ enabled: false }` is clearer than `{ disabled: true }` when the code also checks `!options.disabled`.

### Functions are verbs, and the verb is a promise

A function does something, so its name starts with a verb that describes the effect: `calculateTax`, `sendInvite`, `parseDate`. Functions that answer questions use the boolean prefixes: `isExpired(token)`, `hasPermission(user, action)`.

Pick verbs consistently, because readers learn the vocabulary. A common split in front-end code is: `get` for cheap, synchronous access (`getFullName(user)`); `fetch` or `load` for network or disk work that returns a promise (`fetchOrders()`); `create`, `update`, `delete` for writes; `to` or `format` for conversions (`toUserDto(row)`, `formatPrice(cents)`); and in React, `handleX` for event handler functions and `onX` for the props that receive them (`<Button onClick={handleSubmit} />`). The exact split matters less than using it the same way everywhere.

The verb is also a promise about side effects. `getUser` that silently creates a user when none exists, or `validateForm` that also submits it, will eventually surprise a caller. If a function does two things, either split it or name both (`findOrCreateUser`).

### Collections are plural; maps say what they map

`users` is an array of users; `user` is one of them. That pairing makes loops self-explanatory: `for (const user of users)`. A count of things is `userCount`, not `users` or `numUsers` in one file and `totalUsers` in another.

For lookup objects and `Map`s, name both sides: `usersById`, `priceBySku`, `ordersByCustomerId`. A reader immediately knows that `usersById.get(7)` returns a user. Destructuring lets you rename unhelpful names from an API at the point you receive them:

```javascript title="rename-on-arrival.js"
const response = { data: [{ id: 7, name: 'Ada' }], status: 200 };

const { data: users, status: httpStatus } = response;
const usersById = new Map(users.map((user) => [user.id, user]));

console.log(httpStatus, usersById.get(7).name, users.length);
```

```output
200 Ada 1
```

`data` and `status` were the API's generic names; after destructuring, the rest of the function works with `users` and `httpStatus`, which say what they are. Destructuring syntax is covered in [[b1-destructuring]].

### Put units and time in the name

Numbers without units cause real incidents. `setTimeout` takes milliseconds; many configuration files use seconds; prices may be in cents or in currency units. When a number has a unit, put it in the name: `delayMs`, `timeoutSeconds`, `fileSizeBytes`, `priceCents`, `distanceKm`.

Timestamps and durations are different things and deserve different names. A point in time reads well with an `At` suffix (`createdAt`, `expiresAt`, `lastSeenAt`); a duration names its unit (`sessionLengthMs`). Positional parameters make units worse, because the call site shows only bare numbers:

```javascript title="units.js"
function retry(task, attempts, delay) {
  return `${attempts} attempts, wait ${delay}`;
}
console.log(retry(null, 3, 5)); // 5 what?

function retryWithBackoff(task, { maxAttempts, delayMs }) {
  return `${maxAttempts} attempts, wait ${delayMs} ms`;
}
console.log(retryWithBackoff(null, { maxAttempts: 3, delayMs: 5000 }));
```

```output
3 attempts, wait 5
3 attempts, wait 5000 ms
```

The second call site documents itself: a reader sees `delayMs: 5000` and knows it is five seconds. Passing an options object with named properties is a standard way to make call sites readable when a function takes several numbers or booleans.

### Name magic numbers and strings

A **magic number** is a literal whose meaning is not obvious from context: `if (password.length < 12)`, `if (status === 3)`. Give it a name once and use the name: `MIN_PASSWORD_LENGTH`, `OrderStatus.SHIPPED`. The name explains the value, and changing the rule later means editing one line instead of searching for every `12`.

### Length follows scope

How descriptive a name must be depends on how far away its readers are. A loop index used on the next two lines can be `i`; a coordinate pair can be `x` and `y`; a caught error is conventionally `error` or `err`; an arrow function's parameter in `prices.map((p) => p * 1.2)` is clear because the array name gives the context. A module-level variable read in twenty places, or an exported function used across the codebase, needs a full, specific name because its readers see it far from its definition. The rule of thumb: **the wider the scope, the longer and more specific the name**.

A leading underscore or a bare `_` is the common convention for a parameter you must accept but do not use: `array.map((_, index) => index)`. Linters can be configured to ignore unused names that start with `_`.

## Names that collide with the language and the browser {#collisions}

Some names are not just unclear; they change program behaviour. Most collisions come from **shadowing** — a local name hiding a built-in or global with the same spelling.

### Shadowing built-ins

Every name that the environment already defines (`String`, `Number`, `Map`, `Set`, `Error`, `Promise`, `Date`, `JSON`, `Array`) can be redeclared locally, and then the built-in is unreachable by that name for the rest of the scope:

```javascript title="shadowed-builtin.mjs"
function countWords(text) {
  const String = text.split(/\s+/);   // shadows the built-in for this function
  const total = String.length;
  try {
    return String(total) + ' words';
  } catch (e) {
    return e.name + ': ' + e.message;
  }
}
console.log(countWords('names are an interface'));
```

```output
TypeError: String is not a function
```

Inside `countWords`, `String` means the array, so `String(total)` tries to call an array. In a long function, the declaration and the failing call may be fifty lines apart. The fix is a specific name — `words` — which would have been better anyway. When the shadowing name is not yours to change (an imported `Map` component, for example), `globalThis.Map` still reaches the built-in; see [[b1-global-variables]].

The language itself forbids redeclaring a handful of names in some contexts — strict mode rejects `eval` and `arguments` as binding names — and ESLint's `no-shadow-restricted-names` rule flags shadowing `undefined`, `NaN`, `Infinity`, `eval` and `arguments`.

### Browser globals in classic scripts

In a browser, the global object `window` already has hundreds of properties. At the top level of a classic (non-module) script, a `var` declaration with one of those names reuses the existing property instead of creating a new variable, and some of those properties transform what you assign:

```javascript title="name-trap.js"
// Browser, classic script
var name = 42;
console.log(typeof name, name === 42);
```

```output
string false
```

`window.name` is a built-in string property, so the assignment went through a setter that converts the value to a string. Other `window` properties that collide with tempting variable names include `status`, `length`, `top`, `parent`, `origin`, `event`, `history`, `self` and `location`; the effects vary, from values being converted or ignored to `location = 'home'` navigating the page away. Elements with an `id` attribute also become `window` properties, so `<div id="cart">` makes a bare `cart` refer to that element in classic scripts if no variable of that name exists.

In ES modules (and every bundled application), top-level names live in module scope and these collisions disappear. The problem remains for classic scripts, inline handlers and code pasted into the console. A related trap applies everywhere: in a function, a parameter or local called `event` hides the legacy global `window.event`, and *forgetting* to declare `event` as a parameter can silently pick up that global in browsers instead of throwing. Linters handle this with `no-restricted-globals`, often configured from the `confusing-browser-globals` package, which forbids reading `event`, `name`, `status` and similar names as globals.

### Reserved words

Reserved words cannot be variable names, so code that deals with CSS classes, HTML `for` attributes or default exports needs alternatives. Prefer a more specific name over a misspelling: `cssClass` or `className` rather than `klass`, `labelTarget` rather than `forr`. The DOM itself made this choice early: element properties are named `className` and `htmlFor` because `class` and `for` could not be used as property names in early JavaScript. Modern JavaScript allows reserved words as property names (`obj.class` is fine); only bindings are restricted. The full list is in [[b1-keywords]].

### Lookalike characters

Identifiers may contain any Unicode letter, which allows names in any language — and names that look identical but are different:

```javascript title="homoglyphs.js"
const total = 10;
const tоtal = 99; // о is Cyrillic "о", which renders like Latin "o"
console.log(total);
console.log(tоtal);
console.log('total' === 'tоtal');
```

```output
10
99
false
```

On screen, with the escape written as the real character, both declarations would read `total`. They are two different variables. Attackers have used this in published packages to hide behaviour in plain sight, and it occasionally happens by accident when code is copied from documents. Shared code and libraries should stick to ASCII identifiers; ESLint's `id-match` rule can enforce a character set. Unicode details are covered in [[b1-identifiers]].

## How it works internally: names after the build

It is tempting to keep names short "for performance". In JavaScript this is never a good reason. The engine resolves most local names to fixed slots when it parses a function (see [[b1-name-resolution]]), so name length does not affect run-time speed. And production bundles are **minified**: tools such as Terser and esbuild rename local variables and parameters to single letters, because nothing outside the function can observe those names.

Minifiers leave some names alone by default: object property names, names that other code can see (globals, and module exports that are not bundled away), and anything reached by string. That is why `user.lastSeenAt` survives minification but `const lastSeenAt` inside a function becomes `t`. Long, clear local names therefore cost nothing in the shipped bundle.

To debug minified code, the build emits a **source map** that records how each position and name in the output maps back to the original source. Browser DevTools use it to show your real names in stack traces and the debugger. See [[b1-source-maps]].

## Worked example: renaming a function into clarity

Here is a function that works but must be decoded. It returns the names of users who are active and were seen recently.

```javascript title="rename.js"
// Before: correct, but every name has to be decoded
function calc(d, f) {
  const r = [];
  for (const x of d) {
    if (x.s === 'active' && Date.now() - x.t < f) r.push(x.n);
  }
  return r;
}

// After: same algorithm, names carry the meaning
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getRecentlyActiveUserNames(users, maxIdleMs) {
  const names = [];
  for (const user of users) {
    const isActive = user.status === 'active';
    const idleMs = Date.now() - user.lastSeenAt;
    if (isActive && idleMs < maxIdleMs) names.push(user.name);
  }
  return names;
}

const now = Date.now();
const users = [
  { name: 'Ada', status: 'active', lastSeenAt: now - 1000 },
  { name: 'Linus', status: 'banned', lastSeenAt: now - 1000 },
  { name: 'Grace', status: 'active', lastSeenAt: now - 3 * ONE_DAY_MS },
];
const legacy = users.map((u) => ({ n: u.name, s: u.status, t: u.lastSeenAt }));

console.log(calc(legacy, ONE_DAY_MS));
console.log(getRecentlyActiveUserNames(users, ONE_DAY_MS));
```

```output
[ 'Ada' ]
[ 'Ada' ]
```

Both versions return the same result: Linus is excluded for being banned, Grace for being idle three days. Walk through what each rename bought:

- `calc` → `getRecentlyActiveUserNames`. The caller now knows what comes back without opening the function. The name is long because the function is exported and read far from its definition.
- `d` → `users` and `x` → `user`. The plural/singular pair makes the loop read as English.
- `f` → `maxIdleMs`. "Max" says it is a limit, "Idle" says what is measured, "Ms" gives the unit. The original gave no hint that `f` was a duration.
- The inline condition became two named intermediate values, `isActive` and `idleMs`. **Explaining variables** like these cost one line each and turn a dense expression into a sentence. They also make debugging easier: you can log or inspect each part.
- `86400000` never appears; `ONE_DAY_MS` is computed from its parts so the arithmetic is checkable.
- The short arrow parameter `u` in `users.map((u) => …)` was left alone: its scope is one line and `users` gives the context.

No comment was needed. A comment explaining `calc(d, f)` would have to be kept in sync with the code; good names *are* the code.

## In real systems

**Naming is enforced, not just recommended.** Teams encode conventions in lint rules so review time is spent on meaning, not casing. ESLint's `camelcase`, `id-length` and `id-denylist` (for banning names like `data` or `temp`) cover JavaScript; `@typescript-eslint/naming-convention` can require, for example, that booleans start with `is`/`has`/`should` and that types are `PascalCase`. `no-shadow` flags locals that hide outer names. See [[b2-eslint-typescript]].

**Renames use tools, not search-and-replace.** Editors provide a "Rename Symbol" command (F2 in VS Code) that uses the language service to change exactly the declarations and references of one binding, across files, while leaving unrelated text with the same spelling alone. Find-and-replace on `count` would also change `accountId` and every other `count` in the project. With TypeScript, a missed reference becomes a compile error rather than a run-time one.

**Public names are expensive to change.** Exported functions, component props, API response fields, event names sent to analytics and keys in `localStorage` are read by code you do not control or by stored data. Renaming them needs a migration: support both names for a while, or version the API. That is why public names deserve the most thought up front.

**Shared vocabulary matters across a codebase.** If the product calls them "workspaces", code that calls the same thing `team`, `org` and `group` in different files makes every search incomplete. Many teams keep a short glossary so that names in code match the words product managers, designers and support use.

## Trade-offs and alternatives

Longer names are not automatically better. `theListOfAllCurrentlyActiveUsersInTheSystem` is as hard to scan as `l`. Aim for the shortest name that is unambiguous *in its scope*: `activeUsers` inside a function about the admin dashboard, `activeAdminDashboardUsers` only if several kinds of active user coexist in the same scope.

Comments and names do different jobs. Names say *what* a value is; comments are for *why* — a business rule, a workaround, a surprising constraint. If you find yourself writing a comment to say what a variable holds, rename the variable instead.

Strict conventions trade flexibility for consistency. A rule that every boolean starts with `is` will occasionally force an awkward name (`isHasChildren`); most teams allow a small set of prefixes (`is`, `has`, `can`, `should`, `was`) rather than one.

## Common mistakes

> [!MISTAKE] Naming by type instead of meaning
> `const arr = getOrders()` tells the reader nothing the code does not already say, and it becomes wrong if the function starts returning a `Set`. Name the content: `const orders = getOrders()`, or `pendingOrders` if that is what it is.

**Ambiguous booleans.** `const open = true` could be a flag or a function name; `const isMenuOpen = true` cannot. Similarly `error` should not hold `true`; use `hasError` for the flag and `error` for the `Error` object or message.

**Inconsistent synonyms.** `fetchUser`, `getAccount`, `loadProfile` and `retrieveCustomer` for four functions that do the same kind of work force readers to wonder whether the difference means something. Pick one verb per kind of operation.

**Numbers without units.** `timeout: 30` in a config file has caused production outages when one service read it as seconds and another as milliseconds. Write `timeoutMs` or `timeoutSeconds`.

**Shadowing built-ins and globals.** `const String`, `let name` at the top of a classic script, or a parameter called `event` that is sometimes forgotten. Choose specific names, and turn on `no-shadow` and `no-restricted-globals`.

**Shortening names to save bytes.** Minifiers already rename locals. Short names make the source harder to read and the bundle no smaller.

**Names that outlive their meaning.** A variable called `tempFix`, `newApi` or `usersV2` stops making sense once the fix is permanent or a third version exists. When behaviour changes, rename with the editor's rename tool so the name stays true.

## Interview perspective

Naming rarely appears as its own interview question, but it is judged in every coding round and every take-home. Interviewers notice whether your variables let them follow your solution, and in pair-programming rounds a candidate who says "let me rename this to `windowStart` so it's clear" earns credit.

> [!INTERVIEW] "What makes a good variable name?"
> "It says what the value means in the problem, not how it is stored, and it includes anything a reader would otherwise have to look up — units, whether it's a boolean, what a map is keyed by. Its length follows its scope: `i` in a two-line loop, a full descriptive name for an exported function. It follows the codebase's conventions so the casing alone tells you whether it's a class, a constant or a variable. And it doesn't shadow built-ins like `String` or browser globals like `name`."

Questions to prepare:

- **Why camelCase for variables and PascalCase for classes?** Convention shared with the built-in APIs, so the kind of a name is visible at a glance; in JSX, PascalCase is required to distinguish components from HTML tags.
- **When is a one-letter name acceptable?** Very small scopes with conventional meaning: loop indices, coordinates, short callbacks where the collection name gives context.
- **Does name length affect performance?** No. Engines resolve local names to slots, and minifiers rename locals in production builds; source maps restore names for debugging.
- **Follow-up: what goes wrong with `var name = 42` in a browser?** It reuses the `window.name` property, whose setter converts the value to a string.
- **Follow-up: how do you rename safely in a large codebase?** Use the editor's language-aware rename, rely on TypeScript to catch misses, and treat exported or persisted names as public interfaces that need a migration.

## Practice

1. **Cover test.** Take a function from your own code, hide every right-hand side, and check whether each name alone tells you the value's meaning and unit. Rename those that fail.
2. **Boolean audit.** Find five booleans in a project and rename any that do not read as a yes/no question or that are negated.
3. **Units.** Search a codebase for `timeout`, `delay`, `size`, `duration` and `price`. For each, determine the unit and put it in the name.
4. **Shadowing hunt.** Enable ESLint's `no-shadow` and `no-shadow-restricted-names` on a project and fix what it reports. Explain one case where the shadowing could have caused a bug.
5. **Refactor.** Rewrite this so it needs no comment: `function f(a, b) { return a.filter((x) => x.p > b).map((x) => x.id); }`, given that `a` is a list of products, `p` is the price in cents and `b` is a minimum price.

```quiz
Q: Which name best describes a `Map` from customer id to that customer's list of orders?
- [ ] `orderMap`
- [ ] `data`
- [x] `ordersByCustomerId`
- [ ] `customerOrdersMapObject`
> `ordersByCustomerId` names both sides of the mapping, so `ordersByCustomerId.get(id)` obviously returns orders. `orderMap` hides what the key is, `data` says nothing, and `customerOrdersMapObject` repeats type information the code already shows without saying what the key is.

Q: In a React project, why must a component be named `UserCard` rather than `userCard`?
- [ ] JavaScript forbids lowercase function names that return objects
- [x] JSX treats a lowercase tag as an HTML element, so `<userCard />` would not render the component
- [ ] Minifiers only preserve PascalCase names
- [ ] React throws an error for any lowercase function
> JSX compiles a tag starting with a lowercase letter to a string element name, so React creates an unknown `<usercard>` DOM element instead of calling your function. There is no error; the component simply never runs. It is a language-tooling rule, not a JavaScript one.

Q: Why does using short variable names not make a production bundle meaningfully smaller?
- [ ] Engines compress names automatically at run time
- [x] Minifiers rename local variables to short names during the build
- [ ] Browsers ignore variable names when downloading scripts
- [ ] Short names are slower, which cancels out the savings
> Build tools such as Terser and esbuild rename locals and parameters to single letters because no outside code can observe them. Your original names are restored for debugging through source maps. So long, clear local names are free in production.

Q: A classic browser script runs `var status = 404;` at the top level. Why might `status === 404` be `false` afterwards?
- [ ] `var` cannot hold numbers at the top level
- [ ] `status` is a reserved word
- [x] `status` is an existing property of `window` whose setter converts the value to a string
- [ ] Top-level `var` declarations are ignored in browsers
> At the top level of a classic script, `var` reuses an existing global object property rather than creating a new variable. `window.status` is a legacy string property, so the number is stored as `'404'`. In an ES module the declaration would be module-scoped and the comparison would be `true`.
```

## Quick revision {#quick-revision}

- Casing: `camelCase` variables/functions/properties; `PascalCase` classes, types, React components; `useX` hooks; `UPPER_SNAKE_CASE` only for fixed configuration constants; `#private` for real privacy, `_` only as a hint.
- Name meaning, not type: `orders`, not `arr` or `orderList`. Avoid `data`, `info`, `temp`, `obj` outside tiny generic scopes.
- Booleans: `is`/`has`/`can`/`should`/`was`, phrased positively.
- Functions: verbs; consistent vocabulary (`get` sync, `fetch`/`load` async, `to`/`format` conversions, `handleX` handlers, `onX` props); no hidden side effects.
- Collections plural, single items singular, counts `xCount`, maps `valueByKey`.
- Units and time in names: `delayMs`, `sizeBytes`, `priceCents`; points in time `createdAt`.
- Name magic numbers once; length follows scope; `_` for unused parameters.
- Danger: shadowing `String`/`Map`/`Error`; classic-script `var name`/`status`/`top`; element ids as globals; reserved words; Unicode lookalikes.
- Minifiers rename locals, source maps restore them — short names save nothing.
- Enforce with ESLint (`camelcase`, `id-denylist`, `no-shadow`, `no-restricted-globals`, `@typescript-eslint/naming-convention`); rename with Rename Symbol; treat exported and persisted names as public APIs.

## Key takeaways {#key-takeaways}

- A name is an interface: if a reader has to trace the code to learn what a value means, the name has failed.
- Conventions let casing alone say what kind of thing a name is; in React, two of them are enforced by tooling.
- Put the information a reader would otherwise look up into the name — meaning, unit, boolean-ness, key and value of a map.
- Some names change behaviour: shadowed built-ins, browser globals in classic scripts and lookalike Unicode characters cause real bugs.
- Clear names cost nothing at run time or in bundle size, because engines resolve names to slots and minifiers shorten locals.
- Keep names true over time by renaming with language-aware tools, and treat public names as contracts.
