---
summary: The nullish coalescing operator `??` supplies a fallback only when a value is `null` or `undefined`, so real values such as `0`, `''` and `false` are kept. You will learn how it differs from `||` and from default parameters, why it cannot be mixed with `&&` and `||` without parentheses, and how the logical assignment operators `??=`, `||=` and `&&=` turn the same rules into in-place updates.
difficulty: beginner
minutes: 40
objectives:
  - Explain which values make `??` use its right operand, and contrast that with `||`
  - Choose between `??`, `||`, default parameters and explicit checks when supplying defaults
  - Explain why `a || b ?? c` is a SyntaxError and parenthesise mixed expressions correctly
  - Use `??=`, `||=` and `&&=` and predict when they skip both the right-hand side and the write
  - Debug lost-zero bugs and useless `??` fallbacks on values that are never nullish
---

## Introduction

A data-fetching helper accepts a `timeout` option in milliseconds. The documentation says that `0` means "no timeout". The implementation reads:

```javascript title="timeout-bug.js"
function resolveTimeout(options) {
  return options.timeout || 3000;
}

console.log(resolveTimeout({ timeout: 500 }));
console.log(resolveTimeout({}));
console.log(resolveTimeout({ timeout: 0 }));
```

```output
500
3000
3000
```

The caller who asked for no timeout silently gets three seconds. The `||` operator does not ask "was a timeout provided?"; it asks "is the timeout truthy?", and `0` is falsy. The same bug appears with a price of `0` ("Free" shown as the default price), an empty string the user typed on purpose, or a feature flag set to `false`.

The **nullish coalescing operator** `??`, added in ES2020, asks the right question. `a ?? b` evaluates to `a` unless `a` is `null` or `undefined`, in which case it evaluates to `b`. Those two values are called **nullish**: they are the language's ways of saying "no value here". Every other value — including `0`, `''`, `false` and `NaN` — counts as a real value and is kept.

```javascript title="timeout-fixed.js"
function resolveTimeout(options) {
  return options.timeout ?? 3000;
}

console.log(resolveTimeout({ timeout: 0 }), resolveTimeout({}), resolveTimeout({ timeout: null }));
```

```output
0 3000 3000
```

That single change is the core of this lesson. The rest covers the details that make `??` safe to use everywhere: how it compares with other ways of defaulting, its unusual precedence rule, the cases where it quietly does nothing, and the three **logical assignment** operators that apply the same tests to update a variable or property in place.

## Before you start

- **Truthy and falsy values** — `||` tests truthiness, so you need the list of falsy values to see what `??` does differently. See [[b1-truthy-falsy]].
- **`undefined` versus `null`** — the two nullish values and where each comes from. See [[b1-undefined-vs-null]].
- **Logical operators and short-circuiting** — `&&` and `||` return one of their operands and may skip the right side. See [[b1-logical-operators]] and [[b1-short-circuit]].
- **Assignment** — for the logical assignment section, how `=` and compound operators such as `+=` read and write a target. See [[b1-assignment-operators]].

## The intuition

Think of `||` and `??` as two different receptionists covering a desk.

The `||` receptionist steps in whenever the person at the desk *looks* unhelpful: they are absent, but also if they are present and holding a `0`, an empty form or a "no". The `??` receptionist steps in only when the desk is genuinely **empty** — nobody there at all (`undefined`) or a sign saying "intentionally left empty" (`null`). If someone is at the desk, whatever they are holding is the answer, even if it is `0`.

Both receptionists are lazy in the same useful way: if they do not need to step in, they do not even get up. The right operand of `??` is evaluated only when it is needed.

## How `??` decides

The rule fits in one line: **`a ?? b` is `a` when `a` is neither `null` nor `undefined`; otherwise it is `b`.** Compare it with `||` over every falsy value and a few truthy ones:

| Left value `a` | `a \|\| 'D'` | `a ?? 'D'` |
|---|---|---|
| `null` | `'D'` | `'D'` |
| `undefined` | `'D'` | `'D'` |
| `0`, `-0`, `0n` | `'D'` | kept (`0`, `-0`, `0n`) |
| `''` | `'D'` | `''` |
| `false` | `'D'` | `false` |
| `NaN` | `'D'` | `NaN` |
| `'hi'`, `42`, `[]`, `{}` | kept | kept |

The two operators agree on nullish values and on truthy values. They disagree exactly on the six falsy-but-real values in the middle rows. That is the whole difference, and it tells you when to use which: use `??` when those middle values are legitimate data; use `||` only when you deliberately want them replaced.

### Short-circuiting

Like `||` and `&&`, `??` evaluates its right operand only if it needs it. That makes it safe to put an expensive computation or a side effect on the right:

```javascript title="lazy-right.js"
let calls = 0;
function computeDefault() {
  calls++;
  return 'computed';
}

console.log('cached' ?? computeDefault());
console.log(null ?? computeDefault());
console.log(0 ?? computeDefault());
console.log('calls:', calls);
```

```output
cached
computed
0
calls: 1
```

Only the `null` case needed the right side, so `computeDefault` ran once. Note the third line: `0` is falsy but not nullish, so `??` stops — `||` would have called the function.

### Chaining several fallbacks

`??` is left-associative, so `a ?? b ?? c` means `(a ?? b) ?? c` and returns the **first operand that is not nullish**, or the last operand if all of them are:

```javascript title="chain.js"
const fromUrl = undefined;
const fromStorage = null;
const fromConfig = 0;
console.log(fromUrl ?? fromStorage ?? fromConfig ?? 25);
```

```output
0
```

This is a natural way to express a priority order of sources: the URL wins, then local storage, then configuration, then a hard-coded default. `fromConfig` is `0`, a real value, so the chain stops there.

## `??` versus default parameters and destructuring defaults

JavaScript has another built-in defaulting mechanism: **default parameters** (`function f(x = 5)`) and **destructuring defaults** (`const { x = 5 } = obj`). They look similar to `??`, but they trigger on a narrower condition — **only `undefined`, not `null`**:

```javascript title="defaults-vs-nullish.js"
function pageSize(size = 20) {
  return size;
}
console.log(pageSize(undefined), pageSize(null), pageSize(0));

const { theme = 'light' } = { theme: null };
console.log(theme);

function pageSize2(size) {
  return size ?? 20;
}
console.log(pageSize2(undefined), pageSize2(null), pageSize2(0));
```

```output
20 null 0
null
20 20 0
```

`pageSize(null)` returns `null`: the caller passed an argument, so the default did not apply. Data from JSON APIs often uses `null` for "no value" (JSON has no `undefined`), so a default parameter alone can let `null` through into code that expects a number. Choose deliberately:

| Mechanism | Replaces | Typical use |
|---|---|---|
| `x \|\| d` | Every falsy value | Treating `''` or `0` as "not provided" on purpose |
| `x ?? d` | `null` and `undefined` | Most defaults for data and options |
| `function f(x = d)` / `{ x = d } = o` | `undefined` only | Optional arguments and missing properties |
| Explicit check | Whatever you specify | Validation, e.g. rejecting `NaN` or negative numbers |

A common robust pattern combines them: destructure with defaults for readability, and use `??` at the point where values from external data enter the program.

## Precedence: why `??` refuses to mix with `&&` and `||`

`??` has very low precedence — just above the conditional operator `? :` and assignment, at the same level as `||`. But it has a rule no other operator has: **it cannot be combined with `&&` or `||` in the same expression without parentheses.**

```javascript title="mixing.js"
for (const src of ['a || b ?? c', 'a ?? b && c', '(a || b) ?? c', 'a || (b ?? c)']) {
  try {
    new Function('a', 'b', 'c', `return ${src};`);
    console.log('ok         ', src);
  } catch (e) {
    console.log('SyntaxError', src, '->', e.message);
  }
}
```

```output
SyntaxError a || b ?? c -> Unexpected token '??'
SyntaxError a ?? b && c -> Unexpected token '&&'
ok          (a || b) ?? c
ok          a || (b ?? c)
```

The committee that designs JavaScript (TC39) made this choice on purpose. `a || b ?? c` could reasonably mean "take `a` or `b` if truthy, otherwise default to `c`" or "take `a` if truthy, otherwise `b` with a nullish default of `c`", and the two give different answers for inputs like `a = 0, b = null`. Any precedence they picked would surprise someone, so the grammar requires you to write the grouping explicitly. Because this is a syntax error, it is caught when the script loads, not when the line runs.

Two consequences of the low precedence are worth knowing:

- The conditional operator binds *more* loosely than `??`, so `a ?? b ? 'yes' : 'no'` means `(a ?? b) ? 'yes' : 'no'`.
- Arithmetic binds tighter, so `count ?? 0 + 1` means `count ?? (0 + 1)` — probably not what you meant. Write `(count ?? 0) + 1`.

The full precedence table is in [[b1-precedence]].

## Pairing with optional chaining

Optional chaining `?.` produces `undefined` when a step in a property path is missing, and `undefined` is exactly what `??` replaces. The two were designed together and appeared in the same edition of the language:

```javascript title="with-optional-chaining.js"
const user = { profile: { displayName: '' } };
const guest = null;

console.log(JSON.stringify(user.profile?.displayName ?? 'Anonymous'));
console.log(guest?.profile?.displayName ?? 'Anonymous');
```

```output
""
Anonymous
```

The user deliberately chose an empty display name, and `??` respects it; a missing guest falls back to `'Anonymous'`. If your product rules say an empty name should also be replaced, that is a different requirement — write it explicitly with `||` or a trimmed-length check so the intent is visible. See [[b1-optional-chaining]].

## When `??` silently does nothing

`??` only helps if the left side can actually be nullish. Several common functions signal failure with a value that is *not* nullish, and a `??` after them never fires:

```javascript title="never-nullish.js"
console.log(Number('abc') ?? 0);           // NaN is not nullish
console.log(parseInt('', 10) ?? 0);        // NaN again
console.log([1, 2, 3].indexOf(9) ?? 0);    // -1 is not nullish
console.log('abc'.match(/x/) ?? []);       // null: this one works
console.log(new Map().get('k') ?? 0);      // undefined: this one works
```

```output
NaN
NaN
-1
[]
0
```

`Number` and `parseInt` return `NaN` on failure, and `indexOf` returns `-1`. To default those, check the actual failure value: `Number.isNaN(n) ? 0 : n`, or `i === -1 ? fallback : i`. By contrast, `String.prototype.match`, `Array.prototype.find`, `Map.prototype.get`, `document.querySelector` and `localStorage.getItem` really do return `null` or `undefined` when nothing is found, which makes `??` the right partner for them.

## How it works internally

The specification evaluates `a ?? b` in three steps:

1. Evaluate `a` and get its value.
2. If the value is `undefined` or `null`, evaluate `b` and return its value.
3. Otherwise return the value of `a`. `b` is never evaluated.

Unlike `||`, there is no conversion to boolean at any point: the value of `a` is compared directly with the two nullish values. Engines compile it to the same conditional jump an `if` would produce.

When TypeScript compiles `obj.a ?? 0` for a target older than ES2020, it writes the comparison out by hand (output from TypeScript 6.0 with `--target es2019`):

```javascript title="downlevel-output.js"
var _b;
const total = (_b = obj.a) !== null && _b !== void 0 ? _b : 0;
```

The temporary `_b` guarantees `obj.a` is read only once — it could be a getter with side effects. Babel produces equivalent code. The comparison is with `null` and `void 0` (a reliable spelling of `undefined`), never a truthiness test, which is exactly the semantic difference from `||`.

## Logical Assignment (&&= ||= ??=) {#b1-logical-assignment}

**Logical assignment** operators combine a logical test with an assignment: `x ??= y` assigns `y` to `x` only if `x` is `null` or `undefined`; `x ||= y` assigns only if `x` is falsy; `x &&= y` assigns only if `x` is truthy. They were added in ES2021 (Node.js 15 and later, and all current browsers), and they exist because code constantly wrote the long forms `x = x ?? y` and `x = x || y` to fill in missing values.

### What each operator does

Each operator is defined by the matching logical operator, applied so that the assignment itself is part of the skippable right side:

| Operator | Equivalent to | Assigns when `x` is |
|---|---|---|
| `x ??= y` | `x ?? (x = y)` | `null` or `undefined` |
| `x \|\|= y` | `x \|\| (x = y)` | falsy |
| `x &&= y` | `x && (x = y)` | truthy |

Read the middle column carefully: it is **not** `x = x ?? y`. In the long form an assignment always happens, sometimes assigning `x` back to itself. In the logical form, when the test says no assignment is needed, **no write happens at all** and `y` is not even evaluated.

```javascript title="logical-assignment.js"
const prefs = { volume: 0, theme: '', name: '  Ada  ', cache: null };

prefs.volume ||= 50;               // 0 is falsy: replaced (probably a bug)
prefs.theme ??= 'light';           // '' is not nullish: kept
prefs.name &&= prefs.name.trim();  // truthy: transformed
prefs.cache ??= new Map();         // null: created
prefs.retries ??= 3;               // missing (undefined): created

console.log(prefs);
```

```output
{ volume: 50, theme: '', name: 'Ada', cache: Map(0) {}, retries: 3 }
```

Each line shows a typical use. `??=` fills in **missing** values without touching real ones — the right default for almost all configuration and caching. `||=` replaces any falsy value, so it overwrote the user's deliberate `volume: 0`; use it only when falsy values really mean "unset", such as an empty string for a title. `&&=` updates a value **only if it exists**, which is ideal for transforming optional fields (`trim` would have thrown on `null`).

### No write means no setter and no re-evaluation

The difference between "skip the write" and "write the same value back" is observable whenever the target is a setter, a `Proxy` or a reactive store:

```javascript title="setter.js"
const store = {
  _mode: 'dark',
  get mode() { console.log('  get'); return this._mode; },
  set mode(v) { console.log('  set', v); this._mode = v; },
};

console.log('logical form:');
store.mode ||= 'light';

console.log('long form:');
store.mode = store.mode || 'light';
```

```output
logical form:
  get
long form:
  get
  set dark
```

`||=` read the value, saw that it was truthy and stopped. The long form called the setter to write `'dark'` over `'dark'`. In a framework where a setter triggers a re-render or a network sync, that is wasted work.

Logical assignment also evaluates the **target reference once**. In `obj[nextKey()] ??= 0`, `nextKey()` is called exactly once, whereas `obj[nextKey()] = obj[nextKey()] ?? 0` calls it twice and may read one key and write another:

```javascript title="once.js"
let calls = 0;
const keyOf = () => { calls++; return 'hits'; };
const counters = {};

counters[keyOf()] ??= 0;
console.log(counters, 'keyOf calls:', calls);
```

```output
{ hits: 0 } keyOf calls: 1
```

The value of the whole expression is the final value of the target: the new value if a write happened, the existing value if it did not. So `const v = (cache[k] ??= compute(k));` both fills the cache and gives you the cached value in one step.

### Typical uses

**Lazy initialisation and memoisation.** `??=` creates something the first time it is needed and reuses it afterwards:

```javascript title="memo.js"
const memo = {};
function fib(n) {
  if (n < 2) return n;
  return (memo[n] ??= fib(n - 1) + fib(n - 2));
}
console.log(fib(50));
```

```output
12586269025
```

The recursive calls on the right run only when `memo[n]` is still missing, so each value is computed once. `??=` is safer than `||=` here: with `||=`, a cached result of `0` would be recomputed every time.

**Grouping into buckets.** `(groups[key] ??= []).push(item)` creates the array for a new key and pushes into it in one expression.

**Transforming optional values.** `user.email &&= user.email.toLowerCase()` normalises the email only if one is present.

One limit: logical assignment works on variables and properties, not on `Map` entries, because `map.get(k)` is a call, not an assignable reference. For a `Map`, write `if (!map.has(k)) map.set(k, [])`. And like every assignment, it fails on a `const` variable as soon as a write is actually attempted. The broader family of assignment operators is covered in [[b1-assignment-operators]].

## Worked example: normalising user settings

A settings panel receives partially filled data from an API. JSON uses `null` for "never set", some fields can legitimately be `0`, `false` or `''`, and some text fields need cleaning when present.

```javascript title="settings.js"
const DEFAULTS = { fontSize: 14, autosave: true, signature: '', maxRecent: 10 };

function normalise(raw) {
  const s = { ...raw };
  s.fontSize ??= DEFAULTS.fontSize;     // null from the API means "never set"
  s.autosave ??= DEFAULTS.autosave;     // false must survive
  s.signature ??= DEFAULTS.signature;   // '' is a real choice: "no signature"
  s.signature &&= s.signature.trim();   // clean only if there is text
  s.maxRecent = Math.max(0, s.maxRecent ?? DEFAULTS.maxRecent);
  return s;
}

const raw = { fontSize: null, autosave: false, signature: '  Regards, Ada ', maxRecent: 0 };
console.log(normalise(raw));
console.log(normalise({}));
```

```output
{
  fontSize: 14,
  autosave: false,
  signature: 'Regards, Ada',
  maxRecent: 0
}
{ fontSize: 14, autosave: true, signature: '', maxRecent: 10 }
```

Walk through the first call. `fontSize` is `null`, so `??=` writes 14. `autosave` is `false` — not nullish — so `??=` leaves it alone, honouring the user's choice. `signature` has text, so `??=` skips and `&&=` trims it. `maxRecent` is `0`: `??` keeps it, and `Math.max` clamps negatives. In the second call every field is missing (`undefined`), so every default applies, and `&&=` skips the trim because `''` is falsy.

Now imagine the same function written with `||` and `||=`. The first call would produce `autosave: true` (the user turned it off), and `maxRecent: 10` (the user asked for none). Neither bug throws an error; both would ship unnoticed until a user complains. That is the practical case for defaulting with `??` by habit.

## In real systems

**Configuration and options objects.** Libraries normalise options with `options.retries ??= 3` or `const retries = options.retries ?? 3`, so callers can pass `0` or `false` explicitly. Older code written as `options.retries || 3` is a frequent source of "I passed 0 but it was ignored" bug reports.

**React props and state.** Components default numeric or boolean props with `??` — `const size = props.size ?? 'medium'` — or with destructuring defaults when only `undefined` needs handling. In JSX, `{count ?? 0}` renders a real zero rather than nothing.

**Caches.** In-memory caches and memoised selectors use `cache[key] ??= compute(key)`. The typescript-eslint rule `prefer-nullish-coalescing` flags `||` and `||=` where `??` and `??=` were probably intended, based on the operand's type.

**Browser storage.** `localStorage.getItem('theme') ?? 'light'` works because `getItem` returns `null` for a missing key. (This is a browser API and was not run for this lesson.)

**TypeScript narrowing.** For a value of type `number | undefined`, the type of `value ?? 0` is `number`. TypeScript removes `null` and `undefined` from the left operand's type, so later code needs no further checks.

## Trade-offs and alternatives

| Option | Strength | Weakness |
|---|---|---|
| `??` / `??=` | Keeps every real value; precise meaning "missing" | Does not catch `NaN`, `-1` or other failure markers |
| `\|\|` / `\|\|=` | Also replaces `''`, `0`, `false` when that is intended | Silently discards legitimate falsy data |
| Default parameters / destructuring defaults | Declarative, visible in the signature | Ignore `null`, which JSON APIs use heavily |
| Explicit validation | Can reject out-of-range values, log, or throw | More code |

`??` is a defaulting tool, not a validation tool. It answers "is something here?", not "is what is here acceptable?". Where values come from users or networks, combine it with checks for range, type and `NaN`.

## Common mistakes

> [!MISTAKE] Using `||` for numbers and booleans
> `const limit = options.limit || 50;` turns a deliberate `0` into `50`, and `const enabled = options.enabled || true;` can never be `false`. Use `??` for any value where `0`, `''` or `false` is meaningful.

**Mixing `??` with `||` or `&&` without parentheses.** It is a `SyntaxError`. Decide which grouping you mean and write it.

**Forgetting precedence with arithmetic.** `total ?? 0 + tax` adds `tax` to `0`, not to `total`. Write `(total ?? 0) + tax`.

**Expecting `??` to catch `NaN` or `-1`.** `Number(x) ?? 0` and `arr.indexOf(v) ?? 0` never use the fallback. Test for the real failure value.

**Assuming default parameters handle `null`.** `function f(x = 1)` returns `null` for `f(null)`. Use `??` inside the function when `null` can arrive.

**Using `||=` for counters and caches.** `count ||= 1` resets a stored `0`; `cache[k] ||= compute(k)` recomputes falsy results. Prefer `??=`.

## Interview perspective

The core interview question is "what is the difference between `||` and `??`?", and the expected example is `0`. Strong candidates go further: they mention the parentheses rule, the comparison with default parameters, and the logical assignment operators.

> [!INTERVIEW] What a strong answer sounds like
> "`??` returns the right side only when the left is `null` or `undefined`; `||` returns it for any falsy value. So `0 ?? 5` is `0` but `0 || 5` is `5`. Both short-circuit. `??` can't be mixed with `&&` or `||` without parentheses — that's a syntax error by design. `x ??= y` is `x ?? (x = y)`, so if `x` already has a value, nothing is written."

Questions you should be able to answer:

- **What does `false ?? true` return?** `false` — it is not nullish.
- **What does `null || undefined ?? 'x'` do?** It is a `SyntaxError`; you must parenthesise.
- **How does `function f(a = 1)` differ from `a ?? 1`?** The default parameter applies only to `undefined`; `??` also handles `null`.
- **Is `x ||= y` the same as `x = x || y`?** No. The logical form skips the write (and the setter) when `x` is truthy, and evaluates `x`'s reference only once.
- **When would you still choose `||`?** When falsy values really mean "not provided", for example an empty search string that should fall back to a placeholder — and say so in a comment or variable name.

```quiz
Q: What does `console.log(0 ?? 10, '' || 'x', null ?? undefined ?? 'y')` print?
- [ ] `10 x y`
- [x] `0 x y`
- [ ] `0 '' y`
- [ ] `10 '' undefined`
> `0` is not nullish, so `0 ?? 10` is `0`. `''` is falsy, so `'' || 'x'` is `'x'`. The chain `null ?? undefined ?? 'y'` returns the first non-nullish operand, which is `'y'`.

Q: Why is `a || b ?? c` a SyntaxError?
- [ ] `??` can only be used with numbers
- [ ] `??` must always be the first operator in an expression
- [x] The grammar forbids mixing `??` with `&&` or `||` without parentheses, to avoid an ambiguous grouping
- [ ] `||` and `??` have the same symbol internally
> Both `(a || b) ?? c` and `a || (b ?? c)` are plausible readings with different results, so the language requires you to choose. The fix is to add parentheses; the expression itself is perfectly meaningful once grouped.

Q: `const s = { count: 0 };` After `s.count ||= 5; s.total ??= s.count;`, what is `s`?
- [ ] `{ count: 0, total: 0 }`
- [x] `{ count: 5, total: 5 }`
- [ ] `{ count: 0 }`
- [ ] `{ count: 5 }`
> `0` is falsy, so `||=` writes 5 into `count`. `total` is missing (`undefined`), so `??=` writes the current `s.count`, which is now 5. With `??=` on the first line, `count` would have stayed 0.

Q: Which expression ever uses its fallback?
- [ ] `Number(input) ?? 0`
- [ ] `list.indexOf(item) ?? 0`
- [x] `list.find((x) => x.id === id) ?? null`
- [ ] `parseFloat(input) ?? 0`
> `find` returns `undefined` when nothing matches, so `??` applies. `Number` and `parseFloat` return `NaN` on failure and `indexOf` returns `-1`; neither is nullish, so `??` never fires for them.
```

## Practice

1. **Audit for lost zeros.** Search a codebase you know for `|| 0`, `|| false` and `|| ''`. For each, decide whether `??` was intended and explain the user-visible bug if it was.
2. **Priority chain.** Write `getLocale(urlParam, stored, browser)` that returns the first non-nullish value, falling back to `'en-US'`. Then change the requirement so that an empty string from the URL is also ignored, and implement it without losing readability.
3. **Group by.** Implement `groupBy(items, keyFn)` using `??=` so that each new key gets an empty array exactly once.
4. **Setter experiment.** Build an object with a logging setter and show, for each of `??=`, `||=` and `&&=`, one case where the setter runs and one where it does not.
5. **Fix the parse.** `const qty = parseInt(field.value, 10) ?? 1;` never defaults. Rewrite it so that an empty or non-numeric field gives `1` and `0` stays `0`.

## Quick revision {#quick-revision}

- `a ?? b`: `b` only if `a` is `null` or `undefined`; keeps `0`, `''`, `false`, `NaN`. ES2020.
- `||` replaces every falsy value; `??` replaces only nullish ones. They agree on nullish and truthy values.
- Short-circuits: the right side is evaluated only when needed. `a ?? b ?? c` returns the first non-nullish operand.
- Default parameters and destructuring defaults replace only `undefined`, not `null`.
- Mixing `??` with `&&`/`||` without parentheses is a `SyntaxError`. `? :` binds looser than `??`; arithmetic binds tighter (`(x ?? 0) + 1`).
- `??` does not catch `NaN` or `-1`; it pairs well with `find`, `match`, `Map.get`, `querySelector`, `getItem` and `?.`.
- Logical assignment (ES2021): `x ??= y` is `x ?? (x = y)`; `x ||= y` is `x || (x = y)`; `x &&= y` is `x && (x = y)`.
- When the test says no, no write happens (no setter call) and `y` is not evaluated; the target reference is evaluated once.
- Prefer `??=` for defaults, caches and counters; `&&=` to transform a value only if it exists; `||=` only when falsy means unset.

## Key takeaways {#key-takeaways}

- `??` answers "is a value missing?", while `||` answers "is a value falsy?" — use `??` whenever `0`, `''` or `false` can be real data.
- Both operators short-circuit, so fallbacks with side effects or high cost run only when needed.
- The language forces parentheses when `??` meets `&&` or `||`, because any implicit grouping would surprise someone.
- `??` is not validation: functions that signal failure with `NaN` or `-1` need explicit checks.
- `??=`, `||=` and `&&=` apply the same tests to updates, and skip the write entirely when it is not needed, which matters for setters, proxies and reactive state.
