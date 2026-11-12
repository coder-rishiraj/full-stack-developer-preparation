---
summary: A pure function returns a result that depends only on its arguments and changes nothing outside itself; an impure function reads hidden inputs or causes side effects. You will learn to tell them apart, to spot hidden inputs and hidden side effects in JavaScript, to write non-mutating updates, and to structure programs so the logic is pure and the effects sit at the edges.
difficulty: intermediate
minutes: 45
objectives:
  - Define a pure function using its two rules and classify real JavaScript functions as pure or impure
  - Identify hidden inputs such as mutable outer variables, Date.now and Math.random, and remove them by passing values in
  - Identify side effects, including hidden ones in getters and toString, and explain why they make code harder to test and debug
  - Rewrite mutating functions as non-mutating ones using spread and the ES2023 copying array methods
  - Design code as a pure core with an impure shell, and explain why React rendering and memoization depend on purity
---

## Introduction

Here are two functions that compute a discounted price:

```javascript
function discounted(price, percent) {
  return price - (price * percent) / 100;
}

let currentDiscount = 10;
function discountedNow(price) {
  return price - (price * currentDiscount) / 100;
}

console.log(discounted(200, 10), discountedNow(200));
currentDiscount = 25;
console.log(discounted(200, 10), discountedNow(200));
```

```output
180 180
180 150
```

They give the same answer at first. But `discountedNow(200)` returned `180` and then `150` for the *same argument*, because it secretly depends on a variable outside itself. To know what it returns, you must know the current state of the whole program. `discounted(200, 10)` always returns `180`; everything it depends on is in its parameter list.

The first kind is called a **pure function**. A pure function's result depends only on its arguments, and calling it changes nothing outside the function. Functions that break either rule are **impure**. Purity is not a keyword or a language feature in JavaScript — nothing stops you writing impure code — but it is one of the most useful properties a function can have. Pure functions are trivially testable, safe to cache, safe to call in any order, and easy to reason about in isolation. React requires components to render purely; Redux requires pure reducers; memoization is only correct for pure functions.

Programs still need impure code: something has to read input, save data and update the screen. The skill is not avoiding effects but **containing** them. This lesson defines purity, teaches how to spot hidden inputs and mutations, and covers the nested topic [[b1-side-effects]] — what counts as a side effect, including the hidden ones — before showing how to structure programs around a pure core.

## Before you start

- **Parameters and call-by-sharing** — a function receives references to objects, so it can mutate its caller's data. See [[b1-parameters]] and [[b1-call-by-sharing]].
- **Object mutability** — objects and arrays can change in place; primitives cannot. See [[b1-object-mutability]].
- **Closures** — a function can read variables from where it was defined, which can become a hidden input. See [[b1-closures]].
- **First-class functions** — functions passed to `map`, `filter` and `reduce`. See [[b1-first-class-functions]].

## The intuition

Think of a pocket calculator. Type `7 × 6` and you get `42` — today, tomorrow, on anyone's calculator. The calculator does not look at the clock, does not remember what you typed yesterday, and does not print a receipt or move anything in the room. That is a pure function: inputs in, answer out, world unchanged.

Now think of a vending machine. Press B4 and what happens depends on hidden state — whether B4 is in stock, how much credit is inserted — and pressing it changes the world: a snack drops, stock goes down, coins move. That is an impure function. The machine is useful precisely *because* of those effects; you would not want a vending machine that only calculated which snack you would have got. But if you wanted to test its pricing logic, you would much rather test a calculator-like piece of it than stand in front of the machine buying snacks.

## The two rules

A function is **pure** when both of these hold:

1. **Same inputs, same output.** Its return value is determined entirely by its arguments. Call it with the same arguments a thousand times and you get the same result every time. It does not read anything that can change between calls — mutable outer variables, the clock, random numbers, the DOM, files, the network.
2. **No side effects.** Calling it has no observable effect other than returning a value. It does not modify its arguments, change outer variables, write to the console, the screen, storage or the network, or schedule work for later.

A useful consequence has a name: **referential transparency**. If a function is pure, any call to it can be replaced by its result without changing the program's behaviour. `discounted(200, 10)` can be replaced by `180` anywhere. `discountedNow(200)` cannot, because its result depends on *when* it is called.

```javascript
const TAX = 0.2;                                   // a constant: never changes
const withTax = (price) => price * (1 + TAX);      // pure: TAX is fixed

let calls = 0;
function double(n) {                               // impure: changes outer state
  calls += 1;
  return n * 2;
}

const rollDie = () => Math.floor(Math.random() * 6) + 1;   // impure: random
const isWeekend = () => [0, 6].includes(new Date().getDay()); // impure: reads the clock

console.log(withTax(100), double(3), double(3), calls);
```

```output
120 6 6 2
```

`withTax` reads `TAX` from outside, but `TAX` is a `const` holding a primitive, so it can never change; reading it is no different from writing `0.2` in the body. `double` returns the same result for the same input, so it passes rule 1, but it fails rule 2 — every call changes `calls`. `rollDie` and `isWeekend` fail rule 1: they read values that change on every call (they are not run here because their output would differ on each run).

## Hidden inputs

The most common way a function becomes impure without anyone noticing is by reading something that is not in its parameter list. These are **hidden inputs**:

| Hidden input | Example | Make it explicit by… |
|---|---|---|
| Mutable outer variable | `let currentDiscount` read inside a function | Passing `percent` as a parameter |
| The clock | `Date.now()`, `new Date()` | Passing `now` as a parameter |
| Randomness | `Math.random()`, `crypto.randomUUID()` | Passing the random value, or a random-number function, in |
| The DOM or browser state | `document.querySelector('#qty').value`, `localStorage` | Reading it in the caller and passing the value |
| Environment | `process.env.NODE_ENV`, the current URL | Reading it once at startup and passing configuration in |
| Mutable object contents | An object passed in that someone mutates between calls | Treating data as immutable |

The fix is always the same: **move the hidden input into the parameter list**. `isWeekend(date)` is pure; the caller decides which date to ask about — `isWeekend(new Date())` in production, `isWeekend(new Date('2026-11-14'))` in a test. The impurity has not disappeared, but it has moved to one place (the caller) instead of being buried in a helper that looks harmless.

The last row deserves a note. A function that reads properties of an object argument is still pure: the object is an input. But if the program mutates that object between two calls, the "same" argument (the same reference) now has different contents, and the function returns something different. Purity works best together with **immutability** — treating data as values that are replaced, not edited. Even `Object.freeze` only prevents changes to the object's own properties; nested objects remain mutable:

```javascript
const settings = Object.freeze({ tags: ['a'] });
const tagCount = (obj) => obj.tags.length;

console.log(tagCount(settings));
settings.tags.push('b');              // freeze is shallow: the inner array still changes
console.log(tagCount(settings));
```

```output
1
2
```

## Mutating arguments: the impurity that looks local

Because objects are passed by sharing, a function that modifies an object or array argument modifies the **caller's** data. The function looks self-contained, but the change is visible everywhere that object is referenced.

```javascript
function sortedScores(scores) {
  return scores.sort((a, b) => a - b);       // sort mutates the array in place
}

const scores = [42, 7, 19];
const ordered = sortedScores(scores);
console.log(ordered, scores, ordered === scores);
```

```output
[ 7, 19, 42 ] [ 7, 19, 42 ] true
```

The caller wanted a sorted copy and lost the original order. `sort`, `reverse`, `splice`, `push`, `pop`, `shift`, `unshift`, `fill` and `copyWithin` all **mutate** the array they are called on ([[b1-array-mutation]]). Assigning to `obj.prop` or `delete obj.prop` mutates an object.

The non-mutating versions return a new array or object and leave the input alone:

```javascript
const scores = [42, 7, 19];

console.log(scores.toSorted((a, b) => a - b), scores);    // ES2023
console.log([...scores].sort((a, b) => a - b), scores);   // copy first, then sort

function addItemImpure(cart, item) {
  cart.items.push(item);
  return cart;
}
function addItemPure(cart, item) {
  return { ...cart, items: [...cart.items, item] };
}

const cart = { owner: 'ada', items: ['pen'] };
const next = addItemPure(cart, 'book');
console.log(cart.items, next.items, cart === next);
addItemImpure(cart, 'lamp');
console.log(cart.items);
```

```output
[ 7, 19, 42 ] [ 42, 7, 19 ]
[ 7, 19, 42 ] [ 42, 7, 19 ]
[ 'pen' ] [ 'pen', 'book' ] false
[ 'pen', 'lamp' ]
```

ECMAScript 2023 added `toSorted`, `toReversed`, `toSpliced` and `with(index, value)` as copying counterparts of the mutating methods; they are available in Node.js 20+ and current browsers. For objects, spread syntax (`{ ...obj, changed: value }`) creates a new object with one property replaced.

> [!WARNING] Spread copies are shallow
> `{ ...cart }` creates a new outer object, but nested objects and arrays are still shared with the original. `addItemPure` works because it also copies `items` with `[...cart.items, item]`. Pushing to `{ ...cart }.items` would still mutate the original array. Copy every level you change; see [[b1-copying-objects]].

### Local mutation is fine

Purity is about what can be **observed from outside**. A function may create its own arrays and objects and mutate them freely, as long as it does not touch anything that existed before the call:

```javascript
function squares(n) {
  const out = [];                 // created inside this call
  for (let i = 0; i < n; i++) {
    out.push(i * i);              // mutating a local array is invisible to callers
  }
  return out;
}

console.log(squares(4));
```

```output
[ 0, 1, 4, 9 ]
```

`squares` is pure. Every call builds a new array, the same `n` always produces the same contents, and no caller can see the `push` calls. You do not need to avoid loops and local variables to write pure code; you need to avoid changing things you did not create.

## Side Effects {#b1-side-effects}

A **side effect** is anything a function does that can be observed outside it, other than returning a value. "Side" because it happens alongside the main result. A function with no side effects can only communicate through its return value; a function with side effects also changes the state of the program or the world.

### What counts as a side effect

| Category | Examples |
|---|---|
| Changing state outside the function | Assigning to an outer or global variable; mutating an argument, a module-level object or a property on `this` |
| Input/output (I/O) | `console.log`, `fetch`, reading or writing files, databases, `localStorage`, cookies |
| Changing the page | Creating or editing DOM elements, setting `document.title`, focusing an element, navigating |
| Scheduling work | `setTimeout`, `setInterval`, adding event listeners, starting a promise chain that does any of the above |
| Throwing an exception | Ends the call abruptly and transfers control to whichever `catch` is waiting — strictly speaking an effect on control flow |

Throwing is the one people argue about. In strict functional-programming terms it is an effect, because the function does not return a value at all. In everyday JavaScript, a function that throws on invalid input — `parseAge('abc')` throwing a `RangeError` — is usually still treated as pure "for valid inputs", as long as it is deterministic: the same bad input always throws the same error. The important point is to know that a throw is part of the function's observable behaviour and to document it.

```javascript
const state = { n: 0 };

function increment() {
  state.n += 1;                // side effect: mutates outer state
  return state.n;
}
function add(a, b) {
  return a + b;                // no side effects
}

console.log(add(1, 2), increment(), increment(), state.n);
```

```output
3 1 2 2
```

`add(1, 2)` can be called any number of times with no consequences. Each call to `increment` changes `state`, so calling it twice is different from calling it once, and its return value depends on how many times it has already been called.

### Hidden side effects

Some effects do not look like function calls at all, which makes them dangerous. **Getters** run a function when a property is *read*. **`toString` and `valueOf`** run when an object is converted to a string or number — inside a template literal, during `+`, or when a debugger displays it. **Proxies** can run code on any property access. If those functions have side effects, merely reading a value changes the program:

```javascript
let reads = 0;
const config = {
  get retries() {
    reads += 1;                         // a read that changes state
    return reads > 2 ? 0 : 3;
  },
};
console.log(config.retries, config.retries, config.retries, reads);

const label = {
  toString() {
    console.log('toString ran');        // conversion with a visible effect
    return 'label';
  },
};
const text = `${label}`;
console.log(text);
```

```output
3 3 0 3
toString ran
label
```

The third read of `config.retries` returns `0` because the first two reads changed `reads`. Now imagine debugging this: you add `console.log(config.retries)` to see the value, and that extra read shifts every later result. A bug that changes when you observe it is among the hardest to find. **Getters, `toString`, `valueOf` and `Symbol.toPrimitive` should never have side effects** ([[b1-getters-setters]], [[b1-to-primitive]]). The same applies to callbacks passed to `map`, `filter` and `sort`: they are expected to compute, not to change things, and an effect inside them runs a number of times that depends on the data.

### Effects are necessary, so contain them

A program with no side effects cannot show anything, save anything or respond to anyone. The goal is to make effects **few, obvious and at the edges**:

- **Separate computing from doing.** A function should either compute and return a value (a *query*) or perform an effect (a *command*), not both. This principle is called **command–query separation**. `calculateTotal(cart)` computes; `saveOrder(order)` acts.
- **Name effectful functions as actions.** Verbs such as `save`, `send`, `render`, `update`, `log` warn the reader; nouns and questions such as `total`, `isValid`, `formatDate` promise a pure computation.
- **Push effects to the boundaries.** Read inputs at the start (from the request, the DOM, the clock), pass plain values to pure functions, and perform effects with the result at the end. The worked example below follows this shape.
- **Do not hide effects in places readers expect purity**: getters, conversions, `map`/`filter` callbacks, React render functions.

## Why purity matters

**Testing.** A pure function's test is one line: given these arguments, expect this result. No mocks, no setup, no cleanup, no clock to freeze. Impure functions need their environment faked — a database, a timer, the DOM — and tests become slow and brittle.

**Caching and memoization.** If a function is pure, its result for given arguments never changes, so it can be computed once and remembered. Memoizing an impure function returns stale answers:

```javascript
let discountPercent = 10;
const finalPrice = (p) => p - (p * discountPercent) / 100;   // impure: hidden input

function memoize(fn) {
  const cache = new Map();
  return (x) => {
    if (!cache.has(x)) cache.set(x, fn(x));
    return cache.get(x);
  };
}

const memoPrice = memoize(finalPrice);
console.log(memoPrice(200));
discountPercent = 50;
console.log(memoPrice(200), finalPrice(200));
```

```output
180
180 100
```

After the discount changes, the memoized version still returns the cached `180` while the real answer is `100`. Memoization in React (`useMemo`, `React.memo`, the React Compiler) rests on the same assumption ([[b1-memoization]], [[b4-memoization-perf]]).

**Reasoning and refactoring.** With referential transparency, you can understand a pure function by reading only its body and arguments, reorder independent calls, and extract or inline code without fear. Impure code requires knowing the history of the whole program.

**Rendering in React.** React calls your component functions whenever it decides to render, possibly more than once and in an order it chooses. It requires components to be pure with respect to their props, state and context: the same inputs must produce the same JSX, with no side effects during rendering. In development, `<StrictMode>` deliberately calls components twice to expose impure rendering ([[b4-pure-rendering]], [[b4-strict-mode-double-run]]). Effects belong in event handlers or `useEffect`.

## How it works internally

There is no engine mechanism for purity in JavaScript. The language has no `pure` keyword, the engine does not check, and every function can read outer variables, mutate objects and perform I/O. Engines such as V8 can sometimes prove that a specific piece of code has no observable effects and optimise it (for example, removing a computation whose result is unused), but that is an internal optimisation, not a guarantee you can rely on or request.

Tools help at the edges. `const` prevents *reassigning* a variable but not mutating the object it holds. `Object.freeze` prevents changes to an object's own properties, shallowly. TypeScript's `readonly` and `ReadonlyArray` catch mutations at compile time. Linters can forbid parameter reassignment (`no-param-reassign`). Libraries such as Immer let you write mutation-style code that produces new immutable objects. But purity is ultimately a discipline: a property of how you write a function, not something JavaScript enforces.

## Worked example: a pure core with an impure shell

A shopping cart needs to add items, apply a coupon, compute totals and report the result. All the *logic* can be pure; only the reporting is an effect.

```javascript title="cart.js"
// ---- pure core: amounts in cents, no effects, inputs never mutated ----
function lineTotal(item) {
  return item.unitPrice * item.qty;
}

function subtotal(items) {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

function applyCoupon(amount, coupon) {
  if (!coupon) return amount;
  if (coupon.type === 'percent') return amount - Math.round((amount * coupon.value) / 100);
  return Math.max(0, amount - coupon.value);
}

function addItem(cart, item) {
  const existing = cart.items.find((i) => i.sku === item.sku);
  const items = existing
    ? cart.items.map((i) => (i.sku === item.sku ? { ...i, qty: i.qty + item.qty } : i))
    : [...cart.items, item];
  return { ...cart, items };
}

function summarize(cart) {
  const before = subtotal(cart.items);
  return { count: cart.items.length, before, total: applyCoupon(before, cart.coupon) };
}

// ---- impure shell: the only place with an effect ----
const formatCents = (c) => `$${(c / 100).toFixed(2)}`;

function checkout(cart, log) {
  const s = summarize(cart);
  log(`${s.count} lines, subtotal ${formatCents(s.before)}, total ${formatCents(s.total)}`);
  return s;
}

const empty = { items: [], coupon: { type: 'percent', value: 10 } };
const c1 = addItem(empty, { sku: 'pen', unitPrice: 250, qty: 2 });
const c2 = addItem(c1, { sku: 'mug', unitPrice: 899, qty: 1 });
const c3 = addItem(c2, { sku: 'pen', unitPrice: 250, qty: 1 });

checkout(c3, console.log);
console.log(empty.items.length, c1.items[0].qty, c3.items[0].qty);

const captured = [];
checkout(c3, (msg) => captured.push(msg));
console.log(captured);
```

```output
2 lines, subtotal $16.49, total $14.84
0 2 3
[ '2 lines, subtotal $16.49, total $14.84' ]
```

Walk through it. Amounts are integers in cents, which avoids floating-point rounding surprises ([[b1-floating-point]]). `addItem` never changes the cart it receives: when the pen is added a second time, `map` builds a new items array in which only the pen's object is replaced by a copy with a higher `qty`. The second output line proves it — `empty` still has no items, and `c1`'s pen still has quantity `2`, even though `c3`'s pen has `3`. Every earlier version of the cart is still intact, which is what makes undo, history and change detection cheap in UI frameworks.

`subtotal`, `applyCoupon` and `summarize` are pure, so each can be tested with plain inputs and expected outputs. The only effect, logging, lives in `checkout`, and even that effect is passed in as a function (`log`). In production it is `console.log`; in a test, the last three lines show it replaced by a function that captures messages — no real output, nothing to mock globally. This structure is often called **functional core, imperative shell**.

## In real systems

**React components and reducers.** Components must render purely; `useReducer` and Redux reducers must be pure functions of `(state, action)` that return new state objects rather than mutating. Redux DevTools' "time travel" works only because every previous state is still intact.

**Selectors and derived data.** Libraries such as Reselect memoize pure selector functions so that derived data (filtered lists, totals) is recomputed only when inputs change.

**Backend request handlers.** A common structure is: parse and validate the request (pure), run business rules (pure), then perform database writes and send the response (effects). The pure middle is where unit tests concentrate.

**Testing time and randomness.** Code that needs the current time or random IDs accepts a `now()` or `generateId()` function as a parameter, so tests can supply fixed values instead of freezing the system clock.

## Trade-offs and alternatives

Purity is a tool, not a rule to follow at any cost.

**Copying has a cost.** Creating new arrays and objects instead of mutating allocates memory and takes time. For UI state and typical business data this is negligible, and it is offset by cheap change detection (`prev !== next`). For large data in tight loops — image processing, simulations, parsing megabytes — local mutation inside a function that is pure from the outside is the right approach. Persistent data structures and libraries such as Immer share unchanged parts between versions to reduce copying.

**Effects must live somewhere.** Forcing everything to be pure by threading state through every function can make simple scripts convoluted. Aim for pure logic and explicit effects, not zero effects.

**Pure is not the same as idempotent.** An **idempotent** operation has the same effect whether you do it once or many times — `user.active = true`, an HTTP `PUT`, `DELETE /items/7`. It can still be impure (it changes state). A pure function has no effect at all. Both properties are valuable; do not confuse them.

| Kind of function | Same inputs → same output? | Side effects? | Example |
|---|---|---|---|
| Pure | Yes | No | `(a, b) => a + b` |
| Deterministic but effectful | Yes | Yes | `(n) => { console.log(n); return n * 2; }` |
| Effect-free but non-deterministic | No | No (only reads) | `() => Date.now()` |
| Idempotent command | — | Yes, same after repeats | `(u) => { u.active = true; }` |

## Common mistakes

> [!MISTAKE] Sorting the caller's array
> `items.sort()` inside a helper reorders the caller's array, and every component or function sharing it sees the new order. Use `items.toSorted(compare)` or `[...items].sort(compare)`.

**Shallow copies that still mutate.** `const next = { ...state }; next.user.name = 'x';` changes `state.user` too. Copy each level you modify: `{ ...state, user: { ...state.user, name: 'x' } }`.

**Hidden inputs in "pure" helpers.** A helper that reads a module-level `let`, `Date.now()` or `localStorage` returns different results at different times. Pass the value in.

**Side effects in `map` callbacks.** Using `map` to push into an outer array, send requests or update the DOM mixes computing with doing. Use `map` to compute and `for...of` or `forEach` for effects.

**Memoizing an impure function.** The cache keeps returning the first result even when hidden inputs change.

**Effects in getters or render functions.** Reading a property or rendering a component should not change anything; logging or counting there makes behaviour depend on how often something is read.

## Interview perspective

Purity questions come up directly ("what is a pure function?"), through code review prompts ("what's wrong with this reducer?"), and in React interviews (why render must be pure, why StrictMode double-renders).

> [!INTERVIEW] What a strong answer sounds like
> "A pure function's output depends only on its arguments, and it has no observable side effects — no mutation of inputs or outer state, no I/O. That makes it referentially transparent, so it's easy to test and safe to memoize. Real programs need effects, so I keep the logic pure and push effects like network calls, DOM updates and logging to the edges."

Questions you should be able to answer:

- **Is a function that uses a local loop variable and `push` pure?** Yes, if it only mutates values it created during the call.
- **Is `const f = (arr) => arr.sort()` pure?** No; `sort` mutates the argument.
- **Is a function that reads a `const` number defined outside it pure?** Yes; a `const` primitive cannot change. Reading a `let` or a mutable object's contents is a hidden input.
- **Why must memoized functions be pure?** The cache assumes the same arguments always give the same result.
- **What is the difference between pure and idempotent?** Idempotent operations have the same effect when repeated; pure functions have no effect.
- **Why does React render components twice in StrictMode?** In development, to reveal side effects and impure logic during rendering.

```quiz
Q: Which function is pure?
- [ ] `(user) => { user.visits += 1; return user; }`
- [ ] `() => new Date().getFullYear()`
- [x] `(items) => items.map((i) => i.price).reduce((a, b) => a + b, 0)`
- [ ] `(msg) => { console.log(msg); return msg.length; }`
> The third function only reads its argument and creates new values, so the same array contents always give the same total and nothing outside changes. The first mutates its argument, the second reads the clock (a hidden input), and the fourth writes to the console (a side effect).

Q: Why does memoizing `const price = (p) => p * rate;` (with `let rate` defined outside) produce wrong results?
- [ ] `Map` cannot store numbers as keys
- [x] `price` depends on the hidden input `rate`, so cached results become stale when `rate` changes
- [ ] Arrow functions cannot be memoized
- [ ] Memoization only works for functions with no parameters
> Memoization caches results by argument, assuming the same arguments always give the same output. `price` also depends on `rate`, which is not an argument, so after `rate` changes the cache returns outdated values. Passing `rate` as a parameter would make the function pure and safe to memoize.

Q: A getter `get total() { this.reads++; return this.sum; }` is read inside `console.log` while debugging. What problem does this cause?
- [ ] None; getters cannot have side effects
- [ ] The getter throws because `this` is undefined
- [x] Reading the value for debugging changes `reads`, so observing the program alters its behaviour
- [ ] `console.log` cannot display getters
> A getter runs a function on every read. Because this one mutates state, every extra read — including ones added for debugging — changes `reads`. Getters and conversion methods such as `toString` should compute values without side effects.
```

## Practice

1. **Classify.** For each function, decide pure or impure and name the rule it breaks: `(a) => a.reverse()`, `(a) => [...a].reverse()`, `(n) => n * Math.PI`, `() => crypto.randomUUID()`, `(el) => el.textContent`, `(s) => s.trim()`.
2. **Remove hidden inputs.** Rewrite `function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : 'Good afternoon'; }` so it is pure, and write three tests for it with fixed times.
3. **Immutable updates.** Given `state = { user: { name: 'Ada', tags: ['admin'] }, theme: 'dark' }`, write pure functions `renameUser(state, name)` and `addTag(state, tag)` that return new state without changing the original. Verify with `===` which parts are shared.
4. **Find the hidden effect.** Write an object with a getter that logs on every read, then show how adding a `console.log` changes the program's output.
5. **Core and shell.** Take a function that reads a form field from the DOM, validates it, and shows an error message. Split it into a pure `validate(value)` and an impure function that reads the DOM and displays the result.

## Quick revision {#quick-revision}

- Pure function: (1) output depends only on arguments; (2) no observable side effects.
- Referential transparency: a pure call can be replaced by its result.
- Hidden inputs: mutable outer variables, `Date.now()`, `Math.random()`, DOM, `localStorage`, environment. Fix by passing values in.
- Reading a `const` primitive from outside is fine; reading a `let` or mutable object contents is a hidden input.
- Mutating arguments is a side effect visible to the caller (call-by-sharing): `sort`, `reverse`, `splice`, `push`, `obj.x = …`.
- Non-mutating alternatives: `toSorted`, `toReversed`, `toSpliced`, `with` (ES2023), spread copies. Spread and `Object.freeze` are shallow.
- Local mutation of values created inside the call keeps a function pure.
- Side effects: changing outer state or arguments, I/O (console, network, storage), DOM changes, scheduling timers/listeners, throwing (control-flow effect).
- Hidden effects: getters, `toString`/`valueOf`, Proxies — keep them effect-free.
- Contain effects: command–query separation, verb names for effects, functional core / imperative shell.
- Memoization and React rendering require purity; StrictMode double-renders in development to expose impurity.
- Pure ≠ idempotent: idempotent operations have the same effect when repeated.

## Key takeaways {#key-takeaways}

- A pure function always returns the same result for the same arguments and changes nothing outside itself, which makes it easy to test, cache and reason about.
- Most accidental impurity comes from hidden inputs (outer `let`s, the clock, randomness) and from mutating objects passed in; pass values in and return new data instead.
- Side effects are how programs do useful work, so keep them few, explicit and at the edges, and never hide them in getters, conversions or `map` callbacks.
- JavaScript does not enforce purity; `const`, `Object.freeze` and spread copies are shallow helpers, and discipline does the rest.
- Structure code as a pure core surrounded by a thin impure shell — the same principle behind React rendering, reducers and memoization.
