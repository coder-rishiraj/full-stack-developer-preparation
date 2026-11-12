---
summary: An expression is referentially transparent when you can replace it with its value without changing what the program does. You will learn how to test any JavaScript expression against that rule, what breaks it (time, randomness, mutation, I/O and hidden state), and why memoization, React's render skipping and safe refactoring all depend on it.
difficulty: intermediate
minutes: 35
objectives:
  - Define referential transparency and test an expression for it with the substitution rule
  - Identify the JavaScript features that break transparency, including Date.now, Math.random, mutation, I/O and reads of mutable outer variables
  - Explain how transparency relates to pure functions and to object identity
  - Judge when memoizing a function is safe and debug a memoization bug caused by hidden state
  - Restructure code so that time, randomness and I/O are passed in at the edges
---

## Introduction

In algebra, if you know that `x = 5`, you can replace `x` with `5` anywhere and the equation still holds. Nobody worries that the second `x` on the page might be different from the first. That freedom — swapping a name or an expression for its value without changing the meaning — is what lets you simplify, rearrange and reason about mathematics step by step.

**Referential transparency** is the same idea applied to programs. An expression is referentially transparent if you can replace it with the value it evaluates to, everywhere it appears, and the program behaves exactly the same. `2 + 3` is transparent: replace it with `5` and nothing changes. `Date.now()` is not: replace it with the number it returned a moment ago, and a clock in your UI stops ticking.

The term is not a JavaScript keyword and does not appear in the ECMAScript specification. It is a way of reasoning about code that comes from logic and functional programming, and it matters to JavaScript developers because several everyday techniques silently assume it. Memoization caches a function's result and returns it later instead of calling the function again — that is literally "replacing the call with its value". React skips re-rendering a memoized component when its props have not changed — it assumes rendering is a function of props. When the assumption is false, those techniques return stale or wrong results, and the bug looks random.

## Before you start

- **Pure functions and side effects** — this lesson builds on their definitions. See [[b1-pure-functions]] and [[b1-side-effects]].
- **Closures** — a function can read variables from the scope where it was defined. See [[b1-closures]].
- **Reference versus primitive values** — why two equal-looking objects are not `===`. See [[b1-primitive-vs-reference]].
- **Immutability** — producing new values instead of editing old ones. See [[b1-immutability-fp]].

## The intuition

Imagine a colleague asks you to speed up a slow function by caching its results. Before you agree, you need to answer one question: *if I return yesterday's answer instead of calling the function today, would anyone be able to tell?* If the function converts Celsius to Fahrenheit, no — the answer for 20 °C is always 68 °F. If the function returns "the current user's unread message count", yes — yesterday's answer is wrong today.

That question is the substitution test. An expression passes it when its value depends only on things that cannot change between evaluations, and when evaluating it has no effect that anyone else could notice. Referential transparency is the name for passing that test.

## The substitution test

To check an expression, imagine evaluating it once, then replacing *every* occurrence of it with that value. If any observable behaviour changes — output, return values, state, network traffic — the expression is not transparent.

```javascript title="substitution.js"
const add = (a, b) => a + b;
const x = add(2, 3) * add(2, 3);
const y = 5 * 5;
console.log(x, y, x === y);

function counter() { let n = 0; return () => ++n; }
let tick = counter();
console.log(tick() + tick());
tick = counter();
console.log(2 * tick());
```

```output
25 25 true
3
2
```

`add(2, 3)` passes: replacing both calls with `5` gives the same result. `tick()` fails. Algebra says `tick() + tick()` equals `2 * tick()`, but with a fresh counter the first gives `1 + 2 = 3` and the second gives `2 * 1 = 2`. Each call to `tick` changes hidden state (`n`) and depends on it, so two calls to the "same" expression are not the same value, and ordinary algebraic rewriting gives the wrong answer.

This is why transparency matters for *refactoring*. Moving a repeated call into a variable (`const v = f(); use(v); use(v);`), deleting a call whose result is unused, reordering two calls, or calling something once instead of twice are all safe exactly when the calls are transparent. When they are not, each of those everyday edits can change behaviour.

## What breaks transparency in JavaScript

An expression stops being transparent when its value depends on something other than its inputs, or when evaluating it does something observable. In JavaScript the usual culprits are:

| Source | Example | Why it fails the test |
|---|---|---|
| Time | `Date.now()`, `new Date()`, `performance.now()` | Value changes between evaluations |
| Randomness | `Math.random()`, `crypto.randomUUID()` | Value differs on every call by design |
| Mutable outer state | A function reading a module-level `let`, a global store, `localStorage` | Same arguments, different result after the state changes |
| Mutation of arguments | `xs.sort()` inside a helper | The call changes data the caller still holds |
| I/O | `fetch`, `console.log`, DOM writes, file access | The effect itself is observable; replacing the call removes it |
| Dynamic `this` | A method whose result depends on which object it is called on | The same-looking call can read a different receiver |

Time and randomness are easy to demonstrate:

```javascript title="time-random.js"
const t1 = Date.now();
while (Date.now() === t1) {}
console.log(Date.now() === t1, Math.random() === Math.random());
```

```output
false false
```

The loop waits until the clock moves on, so the comparison is reliably `false`. Without the loop, `Date.now() === Date.now()` is usually `true`, because two calls a microsecond apart fall in the same millisecond. That is the dangerous thing about time-dependent code: it passes the substitution test *most* of the time, so the bug appears only occasionally — at a millisecond boundary, around midnight, or on a slow machine.

### Hidden inputs through closures

A function can look pure from its signature and still read state from outside:

```javascript title="hidden-input.js"
let taxRate = 0.2;
const withTax = (price) => price * (1 + taxRate);
const withTaxPure = (price, rate) => price * (1 + rate);
console.log(withTax(100));
taxRate = 0.25;
console.log(withTax(100), withTaxPure(100, 0.2), withTaxPure(100, 0.25));
```

```output
120
125 120 125
```

`withTax(100)` returned `120` and then `125` for the same argument, because its real inputs are `price` *and* the current value of `taxRate`. Reading a closed-over variable is not a problem in itself: a function that reads a `const` holding a primitive, or an object that nobody ever mutates, is still transparent, because that value can never change. The problem is reading something **mutable**. `withTaxPure` makes the dependency an argument, and the result is determined entirely by what you pass in.

### Mutating an argument

Mutation breaks transparency from the other side: the result may be right, but the call changes the world.

```javascript title="mutating-helper.js"
const median = (xs) => {
  const s = xs.sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const data = [9, 1, 5];
console.log(median(data), data);
const medianPure = (xs) => {
  const s = xs.toSorted((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const data2 = [9, 1, 5];
console.log(medianPure(data2), data2);
```

```output
5 [ 1, 5, 9 ]
5 [ 9, 1, 5 ]
```

`median(data)` returns `5`, but replacing the call with `5` would not reorder `data`, so the call is not transparent. `toSorted` (ES2023) sorts a copy and fixes it.

### Objects and identity

One subtlety is specific to languages with mutable objects. A function that builds a new object each time — `const makePoint = () => ({ x: 1 })` — is pure, but every call returns a *different* object:

```javascript title="identity.js"
const makePoint = () => ({ x: 1 });
console.log(makePoint() === makePoint());
const p = makePoint();
console.log(p === p, JSON.stringify(makePoint()) === JSON.stringify(p));
```

```output
false
true true
```

If code compares objects by reference, replacing two calls with one shared object changes the result of `===`. So, strictly, such a call is transparent only "up to identity": substituting it is safe as long as no one compares identities or mutates the result. This is why React and memoization libraries care about it. A component that receives `style={{ color: 'red' }}` gets a structurally equal but *new* object on every render, and a memoized child comparing props with `===` sees a change every time.

## Transparency and purity

The two ideas are closely related but are not the same thing. **Purity** is a property of a *function*: its result depends only on its arguments, and calling it has no side effects. **Referential transparency** is a property of an *expression* in a particular program: it can be replaced by its value.

A call to a pure function with transparent arguments is transparent. That is the main way you get transparency in practice, and why the two terms are often used interchangeably. But the distinction is useful. `withTax(100)` is transparent in a program where `taxRate` is never reassigned, even though `withTax` reads outer state. And an expression can be transparent while calling something impure internally, if the effect is invisible to the rest of the program — a function that builds a result with a local, mutable array and returns it is impure on the inside but transparent from the outside.

## How it works internally

The ECMAScript specification has no notion of referential transparency, and the engine cannot check it for you. What engines do is the same reasoning on a small scale: when V8's optimizing compiler can prove that an expression has no side effects and depends only on values that cannot change — simple arithmetic on local numbers, for instance — it may compute it once and reuse the result (an optimisation called common subexpression elimination) or move it out of a loop. It cannot do that for `Date.now()`, `Math.random()`, `fetch(url)` or a call to an arbitrary function that might touch a global, because it cannot prove those calls are transparent. Your memoization cache makes the same decision, but without the proof — that is your job.

## Memoization depends on transparency

**Memoization** stores a function's result for each input and returns the stored result on later calls with the same input. It is substitution performed automatically: "the call `f(42)` has the value I computed last time." It is correct only when that substitution is valid.

```javascript title="memo-bug.js"
function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
let taxRate = 0.2;
const withTax = (price) => price * (1 + taxRate);
const fastWithTax = memoize(withTax);
console.log(fastWithTax(100));
taxRate = 0.25;
console.log(fastWithTax(100), withTax(100));
```

```output
120
120 125
```

After the tax rate changes, the memoized version still returns `120`. The cache key is the argument `100`, but the real inputs included `taxRate`, which the cache knows nothing about. In an application the "hidden input" is typically global store state, the current user, the locale, or feature flags, and the symptom is that a value stops updating after the first call.

The rule: **memoize only transparent functions, and make every input part of the cache key**. If a function must depend on configuration, pass the configuration in as an argument so it becomes part of the key — or create a new memoized function when the configuration changes. React's `useMemo` and `useCallback` express this with a dependency array, and the "exhaustive dependencies" lint rule exists to catch exactly this kind of hidden input. See [[b1-memoization]] for building and bounding caches, and [[b4-usememo]] and [[b4-react-memo]] for React's versions.

> [!WARNING] Memoizing over global state
> A memoized selector that reads a global or Redux-like store directly, instead of receiving the state as an argument, returns cached results after the store changes. Make the state an explicit input.

## Pushing effects to the edges

Most real programs need time, randomness and I/O. The goal is not to remove them but to **keep them out of the core logic**, so that most of the code is transparent and the impure parts are few, small and easy to find. The pattern is often called "functional core, imperative shell": the shell gathers inputs (reads the clock, fetches data, reads the store), passes them to pure functions, then performs the effects with the results.

```javascript title="pure-core.js"
// Pure core: all inputs are arguments, including time
function sessionStatus(session, nowMs) {
  const left = session.expiresAt - nowMs;
  if (left <= 0) return 'expired';
  if (left < 5 * 60_000) return 'expiring-soon';
  return 'active';
}
// Impure shell: reads the clock and does I/O
function report(session) {
  console.log(session.user, sessionStatus(session, Date.now()));
}
const s = { user: 'ana', expiresAt: 1_700_000_600_000 };
console.log(sessionStatus(s, 1_700_000_000_000));
console.log(sessionStatus(s, 1_700_000_400_000));
console.log(sessionStatus(s, 1_700_000_600_000));
report({ user: 'bo', expiresAt: 0 });
```

```output
active
expiring-soon
expired
bo expired
```

`sessionStatus` never calls `Date.now()`; the current time is a parameter. That makes every call transparent, so the three boundary cases can be tested with fixed numbers instead of fake timers or waiting. Only `report`, the shell, touches the clock and the console. The same move works for randomness (pass a random number or a seeded generator), for IDs (pass `crypto.randomUUID` or the generated ID), and for data (pass the fetched response, not the URL).

## In real systems

**React rendering.** React expects a component to behave like a function from props and state to UI: rendering twice with the same inputs should produce the same output. Strict Mode in development deliberately renders components twice to expose components that are not transparent. Reading `Date.now()` or `Math.random()` during render, or mutating a prop, breaks the contract and causes mismatches between server and client rendering. See [[b4-pure-rendering]].

**Selectors and derived data.** Libraries such as Reselect memoize functions from state to derived data. They are correct because selectors receive state as an argument and do not read anything else.

**Build tools and caches.** Bundlers and test runners cache work keyed by the content of inputs. A build step that also reads an environment variable not in the key produces stale output — the same bug as the memoized `withTax`, at a larger scale.

**Testing.** Transparent functions need no mocks: call with inputs, compare the output. Code that reads the clock or the network directly needs fake timers and mocked `fetch`, which is a signal that an input could have been a parameter.

## Trade-offs and alternatives

Making everything transparent has costs. Passing time, configuration and services as arguments makes signatures longer, and threading them through many layers is tedious; dependency injection and React context exist partly to manage this. Copying data instead of mutating it costs allocation. And some code is effectful by nature — an event handler that saves a form *is* an effect.

The useful target is not "no effects" but **effects that are visible and contained**. Keep core logic — calculations, validation, formatting, state transitions — transparent, and keep effects in a thin outer layer where a reader expects them.

## Common mistakes

> [!MISTAKE] Treating `const` functions as transparent
> `const getUser = () => store.user` is declared with `const`, but it reads mutable state. `const` fixes the binding of `getUser`, not the values it reads.

**Reading the clock inside business logic.** It makes results time-dependent and tests flaky around boundaries. Pass `now` in.

**Assuming `Date.now() === Date.now()` proves anything.** It is usually `true` within a millisecond; time-dependence shows up only occasionally.

**Memoizing with an incomplete key.** Every input — arguments, closed-over mutable state, configuration — must be in the key, or the cache returns stale values.

**Mutating an argument in a helper.** `sort`, `reverse`, `splice` and property assignment on parameters make the call observable to the caller. Copy first.

**Creating new objects or functions as props for memoized components.** The values are equal but not identical, so `===`-based comparisons see a change on every render.

## Interview perspective

> [!INTERVIEW] A crisp definition with consequences
> "An expression is referentially transparent if replacing it with its value doesn't change the program. Pure functions with immutable inputs give you that. It's what makes memoization and React's skip-if-props-unchanged correct, and it's broken by time, randomness, I/O, mutation and reads of mutable outer state. In practice I keep the core transparent and pass time and data in from a thin effectful shell."

Questions to prepare for:

- **Is `Math.max(1, 2)` transparent? `Math.random()`? `arr.push(1)`?** Yes; no (different values); no (mutates and its return depends on current length).
- **Difference between purity and transparency?** Function property versus expression property; pure calls with transparent arguments are transparent.
- **Why can memoization return wrong results?** The function had an input that was not part of the cache key.
- **How would you test code that depends on the current time?** Make time a parameter; use fake timers only at the shell.
- **Is a function that returns a new object every call transparent?** Up to identity — safe unless someone compares references or mutates the result.

## Practice

1. For each, say whether it is transparent and why: `str.toUpperCase()`, `new Date().getFullYear()`, `[...xs].sort()`, `xs.sort()`, `JSON.parse('{"a":1}')`, `localStorage.getItem('k')`.
2. Refactor `function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : 'Hello'; }` so the decision is transparent and testable.
3. Write a `memoize` that takes a key function, and use it to memoize a price formatter that depends on both an amount and a currency.
4. Find the hidden input in `const isAdmin = (id) => currentUser.roles.includes('admin') && id > 0` and fix it.
5. Explain why `tick() + tick()` and `2 * tick()` differ, using the substitution test.

## Quick revision {#quick-revision}

- Referentially transparent: an expression can be replaced by its value without changing program behaviour.
- Substitution test: evaluate once, replace every occurrence with the value; any observable change means not transparent.
- Breakers: `Date.now`/`new Date`, `Math.random`, mutable outer state (module `let`, stores, `localStorage`), argument mutation, I/O, dynamic `this`.
- Reading a closed-over value is fine if that value can never change.
- Purity is about functions; transparency is about expressions. Pure call + transparent arguments = transparent.
- New objects per call: transparent only up to identity; `===` comparisons and memo props notice.
- Memoization is automated substitution: only for transparent functions, with every input in the key.
- Functional core, imperative shell: pass time, randomness and data in as arguments; do effects at the edges.
- The spec does not define the term; engines optimise only what they can prove effect-free.

```quiz
Q: Which expression is referentially transparent?
- [ ] `Date.now()`
- [ ] `items.push(4)`
- [x] `Math.max(3, 7)`
- [ ] `Math.random() < 0.5`
> `Math.max(3, 7)` is always `7` and has no effects, so it can be replaced by `7`. `Date.now()` and `Math.random()` change between calls, and `items.push(4)` mutates the array and returns a length that depends on its current contents.

Q: `const f = memoize((id) => cache[id] ?? defaultValue)` returns stale results after `defaultValue` is reassigned. What is the root cause?
- [ ] `Map` cannot store `undefined`
- [x] The function has a hidden input (`defaultValue`, and `cache`) that is not part of the memo key
- [ ] Arrow functions cannot be memoized
- [ ] `??` is evaluated only once per program
> Memoization assumes the result depends only on the key. The function also reads mutable outer variables, so the cached result can be wrong after they change. Pass them as arguments or rebuild the memoized function when they change.

Q: Why is `sessionStatus(session, nowMs)` easier to test than a version that calls `Date.now()` inside?
- [ ] Passing numbers is faster than calling `Date.now()`
- [x] With time as an argument, the result depends only on inputs, so tests can use fixed values without fake timers
- [ ] `Date.now()` is not available in test runners
- [ ] It avoids integer overflow in millisecond timestamps
> Moving the clock read to the caller makes the function transparent: the same session and time always give the same status, so boundary cases are tested with plain numbers. `Date.now()` works in tests, but it makes results depend on when the test runs.
```

## Key takeaways {#key-takeaways}

- An expression is referentially transparent when replacing it with its value changes nothing observable.
- Time, randomness, I/O, mutation and reads of mutable outer state are what break transparency in JavaScript.
- Pure functions called with transparent arguments are the practical way to get transparency.
- Memoization and React's render skipping are substitution in disguise, so they are only correct for transparent code with complete keys.
- Objects add an identity caveat: equal new objects are not `===`, which memoized components notice.
- Keep the core logic transparent and push effects to a thin shell that passes time and data in as arguments.
