---
summary: The same program can be written as step-by-step instructions that change variables (imperative) or as a description of the result built from transformations (declarative). You will learn how the two styles differ in JavaScript, when each reads better, and how immutability — producing new values instead of editing old ones — makes the declarative style safe in UI code.
difficulty: intermediate
minutes: 55
objectives:
  - Compare imperative and declarative versions of the same computation and explain the readability trade-off
  - Rewrite loops as filter/map/reduce pipelines, and recognise when a loop with break is clearer
  - Avoid misusing map for side effects and nesting transforms beyond readability
  - Explain why const is not immutability and why spread copies are shallow
  - Update nested state immutably and use non-mutating array methods such as toSorted and with
  - Choose between Object.freeze, structuredClone and libraries such as Immer for protecting and copying data
---

## Introduction

Here is a small task: from a list of orders, compute the revenue from paid orders and list the IDs of paid orders worth at least 100. There are two broad ways to write it.

The first is to tell the computer *how*: start a counter at zero, walk through the array by index, check each order's status, add to the counter, push to a result array. This is the **imperative** style — a recipe of steps, each of which changes some variable.

The second is to describe *what* you want: the paid orders; their totals summed; the IDs of the large ones. This is the **declarative** style, and in JavaScript it is usually written with array methods such as `filter`, `map` and `reduce`, chained into a pipeline where each step produces a new value from the previous one.

JavaScript supports both equally well. It is not a "functional language" in the strict sense — it has mutable objects, loops and statements everywhere — but since ES5 added the array methods and ES2015 added arrow functions, the declarative, functional style has become the normal idiom in modern front-end code, especially in React. Knowing both styles, and when each is the better bet, is part of writing code other people can read.

The declarative style depends on a second idea to be safe: **immutability**, producing a new value instead of editing an existing one. That is taught in the second half of this lesson, because the two ideas are hard to separate in practice.

## Before you start

- **Array methods** — what `map`, `filter`, `reduce`, `find` and `some` do. See [[b1-array-map-filter-reduce]] and [[b1-array-search]].
- **Functions as values** — passing a function to another function. See [[b1-first-class-functions]].
- **Pure functions and side effects** — the definition of a function whose result depends only on its arguments. See [[b1-pure-functions]] and [[b1-side-effects]].
- **Primitive versus reference values** — why two variables can point to the same object. See [[b1-primitive-vs-reference]].

## The intuition

Think of giving directions. Imperative directions are turn-by-turn: "go straight 200 metres, turn left, take the second right". Declarative directions state the goal: "the café opposite the station". The turn-by-turn version gives you total control and works even when the destination is hard to describe, but you have to follow every step to know where you will end up. The goal-based version is shorter and tells you immediately what you are looking for, but it relies on someone (here, the array methods) knowing how to get there.

Code is read far more often than it is written, and the main question a reader asks is "what does this produce?". Declarative code answers that question in its shape: `orders.filter(isPaid).map(getId)` *says* "IDs of paid orders". Imperative code answers it only after you have traced the loop in your head. That is the bet the declarative style makes. It is a good bet for data transformation, and a poor one for algorithms whose essence *is* the step-by-step control.

## Imperative versus declarative: the same task twice

```javascript title="orders.js"
const orders = [
  { id: 1, customer: 'ana', total: 120, status: 'paid' },
  { id: 2, customer: 'bo', total: 35, status: 'refunded' },
  { id: 3, customer: 'ana', total: 80, status: 'paid' },
  { id: 4, customer: 'cy', total: 200, status: 'paid' },
];

// Imperative
let revenue = 0;
const bigPaid = [];
for (let i = 0; i < orders.length; i++) {
  const o = orders[i];
  if (o.status === 'paid') {
    revenue += o.total;
    if (o.total >= 100) bigPaid.push(o.id);
  }
}
console.log(revenue, bigPaid);

// Declarative
const paid = orders.filter((o) => o.status === 'paid');
const revenue2 = paid.reduce((sum, o) => sum + o.total, 0);
const bigPaid2 = paid.filter((o) => o.total >= 100).map((o) => o.id);
console.log(revenue2, bigPaid2);
```

```output
400 [ 1, 4 ]
400 [ 1, 4 ]
```

Both produce the same answers. Look at what differs.

The imperative version **interleaves** two computations in one loop body. To understand `bigPaid`, you must also read past the revenue logic. Its variables change over time — `revenue` is `0`, then `120`, then `200`, then `400` — so its meaning depends on *where* in the code you look. A bug such as putting the `push` outside the inner `if` is easy to make and easy to miss.

The declarative version gives **each result its own expression**. `paid` names an intermediate idea. `revenue2` is defined in one line as "the sum of paid totals", and that is all it ever is. Nothing is reassigned. Each callback is a tiny pure function — `(o) => o.status === 'paid'` — that you can read, name, test and reuse on its own.

The imperative version has one advantage: it walks the array once. The declarative version walks the array once for `filter`, then walks `paid` twice more, and allocates two intermediate arrays. For four orders, or four thousand, this does not matter. For millions of items in a hot loop it might; see *How it works internally* below.

## The building blocks of a pipeline

Most declarative array code uses a handful of operations, each answering a different question:

| Operation | Question it answers | Result |
|---|---|---|
| `map(f)` | What is each item transformed into? | New array, same length |
| `filter(pred)` | Which items do I keep? | New array, same or shorter |
| `reduce(f, init)` | What single value summarises the items? | Anything: number, object, array |
| `find(pred)` / `findLast` | Which is the first (or last) item that matches? | An item or `undefined` |
| `some(pred)` / `every(pred)` | Does any / every item match? | Boolean |
| `flatMap(f)` | What items does each item expand into? | New, flattened array |
| `Object.groupBy(items, f)` | How do the items fall into buckets? | Object of arrays (ES2024) |

`find`, `some` and `every` **stop early**: they return as soon as the answer is known. `map`, `filter` and `reduce` always visit every element.

`reduce` is the most general and the most abused. It is the right tool for sums, counts, and building one object from many items:

```javascript title="reduce-grouping.js"
const byCustomer = [
  { customer: 'ana', total: 120 }, { customer: 'bo', total: 35 }, { customer: 'ana', total: 80 },
].reduce((acc, o) => ({ ...acc, [o.customer]: (acc[o.customer] ?? 0) + o.total }), {});
console.log(byCustomer);
console.log(Object.groupBy([1, 2, 3, 4, 5], (n) => (n % 2 ? 'odd' : 'even')));
```

```output
{ ana: 200, bo: 35 }
[Object: null prototype] { odd: [ 1, 3, 5 ], even: [ 2, 4 ] }
```

The `reduce` builds a totals-per-customer object. Note that it creates a *new* accumulator object on every step with spread; that is the immutable style, and because each step copies every key gathered so far, the total copying grows quadratically when there are many distinct keys — mutating a local accumulator inside `reduce` (`acc[k] = …; return acc;`) is a perfectly acceptable optimisation because the object never escapes until it is finished. When a `reduce` callback grows longer than a few lines, a `for...of` loop is often easier to read. For bucketing, `Object.groupBy` (ES2024, Node 21+) says what it does by name.

## When imperative is the better choice

Declarative is not automatically better. Prefer a `for` or `for...of` loop when:

- **You need to stop early in a way the methods do not express.** `find` and `some` cover "stop at the first match", but "stop when the running total exceeds a budget" is clearer as a loop with `break`.
- **The algorithm *is* the control flow.** Two-pointer techniques, binary search, state machines and parsers depend on indices moving in specific ways. Forcing them into `reduce` hides the logic.
- **You need `await` inside the iteration in sequence.** `for...of` with `await` processes items one by one; `forEach` with an async callback does not wait at all.
- **Profiling shows the pipeline is a hot spot.** A single loop avoids intermediate arrays and repeated passes.

```javascript title="early-exit.js"
const nums = [3, 8, 12, 5, 20];
let firstBig;
for (const n of nums) {
  if (n > 10) { firstBig = n; break; }
}
console.log(firstBig, nums.find((n) => n > 10), nums.some((n) => n > 10));
let calls = 0;
const r = nums.map((n) => { calls++; return n * 2; }).find((n) => n > 10);
console.log(r, 'map callbacks:', calls);
calls = 0;
const lazy = nums.values().map((n) => { calls++; return n * 2; }).find((n) => n > 10);
console.log(lazy, 'lazy callbacks:', calls);
```

```output
12 12 true
16 map callbacks: 5
16 lazy callbacks: 2
```

The loop and `find` both stop at `12`. The interesting part is the last two lines. `nums.map(...).find(...)` runs the `map` callback for all five elements before `find` even starts, because `map` builds a complete array. The version using `nums.values()` creates an iterator, and ES2025 **iterator helpers** (`Iterator.prototype.map`, `filter`, `take`, `find` and others; available in Node 22 and current Chrome and Firefox) process items lazily, one at a time, so `map` runs only until `find` is satisfied. Lazy pipelines combine declarative style with loop-like efficiency; libraries offered this for years, and it is now built in.

## Common style traps

**Using `map` for side effects.** `map` exists to build a new array. If the callback does not return anything, you are using it as a loop:

```javascript title="map-misuse.js"
const names = ['ana', 'bo'];
const result = names.map((n) => { console.log('hello', n); });
console.log(result);
names.forEach((n) => console.log('hi', n));
```

```output
hello ana
hello bo
[ undefined, undefined ]
hi ana
hi bo
```

The `map` call allocated an array of `undefined` that nobody uses, and it tells the reader "a transformed array is being built" when none is. Use `forEach` or `for...of` when the point is the side effect; reviewers and linters will flag `map` without a used result.

**Clever chains.** Five nested `map`s, a `reduce` that returns a tuple of three accumulators, or a one-liner that needs a comment to explain it are not declarative; they are imperative logic in disguise. Name intermediate results, extract callbacks into named functions (`orders.filter(isPaid)`), and stop chaining when a step stops being obvious. Small named functions help in both styles.

**Hidden mutation in callbacks.** A callback like `(o) => { o.total *= 1.2; return o; }` inside `map` returns the *same* objects, now changed — the "new" array shares mutated items with the old one. That breaks the main guarantee the declarative style is supposed to give you, and leads directly to the next section.

## How it works internally

`map`, `filter` and `flatMap` each allocate a new array and call your callback once per element, through a normal function call. Modern engines such as V8 inline these built-ins and the callbacks when they are hot, so a simple `map` is usually within a small factor of a hand-written loop. The costs that remain are the intermediate arrays in a chain (more allocation and garbage-collection work) and the repeated passes over the data. A pre-sized loop can avoid both — sometimes measurably faster, often irrelevant next to a network request or a DOM update.

JavaScript has no purity checker. Nothing stops a `filter` callback from mutating state or making a network call; the declarative style is a convention you keep. Likewise, the language gives no fusion of `map().filter()` chains: each step really runs to completion before the next starts, unless you use lazy iterators.

The same declarative-versus-imperative split appears outside arrays. Direct DOM code (`createElement`, `appendChild`, `classList.toggle`) is imperative; React's JSX describes *what the UI should look like for this state* and lets React compute the changes. SQL is declarative; a loop over database rows is imperative. Recognising the split helps you see why each tool is shaped as it is.

## Immutability {#b1-immutability-fp}

**Immutability** means treating a value as fixed once created: to "change" it, you make a new value with the change applied and leave the original untouched. In JavaScript, strings, numbers and other primitives are already immutable. Objects and arrays are mutable by default, so for them immutability is a **discipline** your code follows, helped by a few language tools — not something the engine enforces for you.

### Why it matters

The danger of mutation is **aliasing**: two variables, two components or two parts of a program holding references to the same object. A change made through one reference is visible through all of them, often far from where it happened.

```javascript title="aliasing.js"
const cart = ['apple'];
const sameCart = cart;
sameCart.push('pear');
console.log(cart, cart === sameCart);
```

```output
[ 'apple', 'pear' ] true
```

`sameCart` is not a copy; it is a second name for the same array. In a small script this is obvious. In an application, the "second name" might be a cached value, an undo history, a prop passed to a child component, or a previous state that React compares against the current one. If anything mutates the shared object, the old version no longer exists — and code that relied on comparing old with new sees no difference.

Immutability gives three concrete benefits:

- **Cheap change detection.** If updates always create new objects, then "did this change?" is `prev !== next`, a single reference comparison, instead of a deep walk. React's state updates, `React.memo` and `useMemo` dependencies, and Redux selectors all rely on this. See [[b4-state-immutability]].
- **History for free.** Undo stacks, time-travel debugging and optimistic updates keep old versions around. With mutation, every old version would have to be deep-copied defensively.
- **Local reasoning.** A function that receives an object and cannot change it is easier to trust; you do not need to read its body to know your data survives the call.

### `const` is not immutability

`const` prevents **reassigning the variable**. It says nothing about the object the variable points to:

```javascript title="const-not-frozen.js"
const settings = { theme: 'dark' };
settings.theme = 'light';
console.log(settings);
```

```output
{ theme: 'light' }
```

This is allowed because `settings` still points to the same object. `const` is still worth using everywhere you can — a binding that never changes is easier to follow — but it is a property of the *name*, not the *value*. See [[b1-const]].

### Copy-on-write with spread

The everyday tool for immutable updates is **spread**: build a new object or array containing the old contents plus the change.

```javascript title="nested-update.js"
const state = { user: { name: 'Ana', tags: ['admin'] }, count: 1 };

const next = {
  ...state,
  user: { ...state.user, tags: [...state.user.tags, 'editor'] },
};
console.log(state.user.tags, next.user.tags);
console.log(next === state, next.user === state.user, next.count === state.count);
```

```output
[ 'admin' ] [ 'admin', 'editor' ]
false false true
```

Spread is **shallow**: `{ ...state }` copies the top-level properties, but a property that holds an object is copied *as a reference*. So to change something nested, you must copy every level on the path to the change: a new outer object, a new `user`, a new `tags` array. Everything off that path — here `count`, and in a large state tree most of the data — is reused as is. This reuse is called **structural sharing**: the new version shares unchanged parts with the old one, so an update costs work proportional to the depth of the change, not the size of the state.

Forgetting a level is the classic bug:

```javascript title="shallow-copy-bug.js"
const state = { user: { name: 'Ana' }, count: 1 };
const shallow = { ...state, count: 2 };
shallow.user.name = 'Bo';
console.log(state.user.name, shallow.user === state.user);
```

```output
Bo true
```

`shallow` is a new object, but its `user` is the *same* object as `state.user`, so editing it changed the "old" state too. Copying objects in depth, including `Object.assign` and the copy semantics of spread, is covered in [[b1-copying-objects]] and [[b1-copying-arrays]].

### Non-mutating array methods

Several classic array methods mutate in place: `push`, `pop`, `splice`, `sort`, `reverse`, `fill`. ES2023 added copying counterparts (Node 20+, all current browsers):

```javascript title="change-array-by-copy.js"
const scores = [40, 10, 30];
const sorted = scores.toSorted((a, b) => a - b);
const reversed = scores.toReversed();
const replaced = scores.with(1, 99);
const removed = scores.toSpliced(0, 1);
console.log(scores, sorted, reversed, replaced, removed);
const inPlace = scores.sort((a, b) => a - b);
console.log(scores, inPlace === scores);
```

```output
[ 40, 10, 30 ] [ 10, 30, 40 ] [ 30, 10, 40 ] [ 40, 99, 30 ] [ 10, 30, 40 ]
[ 10, 30, 40 ] true
```

The four new methods leave `scores` unchanged. The last two lines show the trap they replace: `sort` reorders the original *and* returns it, so code like `const sorted = props.items.sort()` silently mutates a prop. Before ES2023 the idiom was `[...items].sort()`. For adding and removing, spread and `filter` remain the usual immutable forms: `[...items, x]`, `items.filter((i) => i.id !== id)`, `items.map((i) => (i.id === id ? { ...i, done: true } : i))`. See [[b1-array-mutation]] for the full list of mutating methods.

### `Object.freeze`

`Object.freeze(obj)` makes an object's own properties read-only and prevents adding or removing properties. What happens when code then tries to write depends on **strict mode**:

```javascript title="freeze.mjs"
const config = Object.freeze({ port: 8080, db: { host: 'localhost' } });
try { config.port = 9090; } catch (e) { console.log(e.name + ': ' + e.message); }
config.db.host = 'prod.example';
console.log(config.port, config.db.host, Object.isFrozen(config), Object.isFrozen(config.db));
```

```output
TypeError: Cannot assign to read only property 'port' of object '#<Object>'
8080 prod.example true false
```

This file is an ES module (`.mjs`), and modules and classes always run in strict mode, so the write throws a `TypeError`. In a sloppy-mode classic script, the same assignment fails **silently** — `config.port` stays `8080` and no error appears — which makes bugs harder to find (see [[b1-strict-mode]]). The second point is the bigger one: **freeze is shallow**. `config.db` is a separate object that was never frozen, so its `host` changed. A "deep freeze" helper must recurse into every nested object.

Freezing is most useful as a **guard in development and tests**: freeze the input to a reducer or a pure function, and any accidental mutation throws instead of corrupting data quietly. Some state libraries do this automatically in development builds. In production code freezing every object is rarely worth it; the discipline of copying is what matters. The details of `freeze`, `seal` and `preventExtensions` are in [[b1-object-freeze-seal]].

### Deep copies and libraries

When you genuinely need an independent copy of a nested structure — for example, a draft that the user edits and may cancel — use `structuredClone` (Node 17+, all current browsers):

```javascript title="structured-clone.js"
const original = { when: new Date(0), nested: { list: [1, 2] } };
const deep = structuredClone(original);
deep.nested.list.push(3);
console.log(original.nested.list, deep.nested.list, deep.when instanceof Date);
const viaJson = JSON.parse(JSON.stringify(original));
console.log(typeof viaJson.when);
try { structuredClone({ fn() {} }); } catch (e) { console.log(e.name); }
```

```output
[ 1, 2 ] [ 1, 2, 3 ] true
string
DataCloneError
```

`structuredClone` copies nested objects, arrays, `Date`, `Map`, `Set` and more, preserving their types; the older `JSON.parse(JSON.stringify(x))` trick turns dates into strings and drops `undefined` and functions. Neither copies functions or class instances' prototypes — `structuredClone` throws a `DataCloneError` for functions. Deep copying is also the expensive option: it copies everything, losing structural sharing, so use it for drafts and snapshots, not for every state update.

When nested spread updates become hard to read, **Immer** is the widely used library answer (Redux Toolkit uses it internally). You write what looks like mutating code against a draft — `draft.user.tags.push('editor')` — and Immer records the changes and produces a new, structurally shared, frozen object, leaving the original untouched. Persistent data structure libraries (Immutable.js and others) take a different route with their own collection types, at the cost of converting to and from plain objects.

### Worked example: an undo history

Because each update returns a new array, every version of the state remains intact and can be kept:

```javascript title="undo-history.js"
function addTodo(todos, text) {
  return [...todos, { text, done: false }];
}
function toggle(todos, index) {
  return todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t));
}
const history = [[]];
const push = (next) => history.push(next);
push(addTodo(history.at(-1), 'write lesson'));
push(addTodo(history.at(-1), 'review'));
push(toggle(history.at(-1), 0));
console.log(history.map((s) => s.map((t) => (t.done ? '[x] ' : '[ ] ') + t.text).join(', ')));
const [, , before, after] = history;
console.log(before[1] === after[1], before[0] === after[0]);
```

```output
[
  '',
  '[ ] write lesson',
  '[ ] write lesson, [ ] review',
  '[x] write lesson, [ ] review'
]
true false
```

`addTodo` and `toggle` never modify their input. Undo is `history.pop()`: the previous version is exactly as it was. The last line shows structural sharing at work. Toggling item 0 created a new object for that item (`before[0] !== after[0]`), but item 1, untouched, is the very same object in both versions — which is also exactly what lets React skip re-rendering an unchanged list row.

Engines do not perform copy-on-write for you. Whatever optimisations they apply internally, `{ ...obj }` always produces a new object with a new identity, and the language guarantees nothing about sharing memory beyond the references you copy.

```quiz
Q: After `const a = { list: [1] }; const b = { ...a }; b.list.push(2);`, what is `a.list`?
- [ ] `[1]`, because spread made a copy
- [x] `[1, 2]`, because spread copies the reference to the nested array
- [ ] It throws, because `a` was declared with `const`
- [ ] `undefined`
> Spread is shallow: `b` is a new object, but `b.list` and `a.list` are the same array. `const` only stops `a` from being reassigned; it does not stop the array from being mutated.

Q: Which call leaves the original array `xs` unchanged?
- [ ] `xs.sort()`
- [ ] `xs.reverse()`
- [x] `xs.toSorted()`
- [ ] `xs.splice(0, 1)`
> `toSorted` (ES2023) returns a sorted copy. `sort`, `reverse` and `splice` all mutate `xs` in place; `sort` also returns the same array, which makes it look like a copy.

Q: Why is `names.map((n) => console.log(n))` considered poor style?
- [ ] `map` cannot call `console.log`
- [x] It builds an unused array of `undefined` and signals a transformation that is not happening
- [ ] `map` skips the first element when the callback returns nothing
- [ ] It runs the callbacks in parallel
> `map` always visits every element and builds a new array from the return values. When only the side effect matters, `forEach` or `for...of` expresses that intent and allocates nothing.
```

## In real systems

**React and Redux.** Component rendering is declarative, and state updates must be immutable: `setItems([...items, item])`, never `items.push(item); setItems(items)`, because React compares the new state to the old by reference and would see no change. Redux reducers are pure functions from (state, action) to new state. See [[b4-state-immutability]] and [[b4-pure-rendering]].

**Data preparation.** Front-end code that turns API responses into view models — filtering, grouping, sorting, formatting — is typically a declarative pipeline of small named functions, each unit-testable.

**Hot paths.** Rendering a canvas frame, parsing a large file, or processing audio usually uses plain loops over typed arrays and mutates buffers in place, because allocation per frame matters there.

**Configuration and constants.** Shared configuration objects and enum-like lookup tables are often `Object.freeze`d so that no module can change them for everyone else.

## Trade-offs and alternatives

| | Imperative loops and mutation | Declarative pipelines and immutability |
|---|---|---|
| Readability | Clear for algorithms with complex control flow | Clear for data transformations |
| Early exit | `break`, `return`, `continue` | `find`, `some`, `every`, lazy iterators |
| Allocation | Minimal; can reuse buffers | New arrays and objects per step |
| Change detection | Needs deep comparison or manual flags | `prev !== next` |
| Bug profile | Aliasing and state-over-time bugs | Forgotten nested copies; overly clever chains |
| Testing | Needs setup of mutable state | Small pure functions test in isolation |

The pragmatic position, and the one most JavaScript codebases take, is a **functional core with imperative edges**: data transformations and state updates are declarative and immutable; performance-critical inner loops, I/O and DOM manipulation are imperative and contained. Mutating a local variable that never escapes the function — an accumulator, a buffer being built — is invisible to callers and does not break any of the guarantees above.

## Common mistakes

> [!MISTAKE] Mutating state and then "setting" it
> `state.items.push(x); setState(state)` changes the old object and passes the same reference back. React sees `prev === next` and may skip the update. Create a new array: `setState({ ...state, items: [...state.items, x] })`.

**Thinking `const` freezes the value.** It only fixes the binding.

**Assuming spread or `Object.freeze` is deep.** Both act on one level. Copy each level on the path to a change; deep-freeze recursively if you need it.

**Calling `sort` or `reverse` on data you do not own.** Props, function arguments and shared arrays get reordered for every holder. Use `toSorted` and `toReversed`.

**Using `map` for side effects** or `reduce` for something `filter` or `groupBy` already names.

**Deep-cloning on every update.** It defeats structural sharing, so every reference changes and every memoised component re-renders.

## Interview perspective

> [!INTERVIEW] A balanced answer
> "Declarative code says what result I want — filter, map, reduce — so each value is defined in one place and the callbacks are small pure functions I can test. I switch to a loop when I need complex early exit, when the algorithm is about index movement, or when profiling shows the intermediate arrays matter. Declarative code relies on immutability: I copy along the path of a change with spread, use `toSorted` instead of `sort`, and reach for Immer when nesting gets deep."

Common questions:

- **Rewrite this loop with array methods** (and the reverse). Expect to discuss passes and allocation.
- **`forEach` versus `map`?** `map` builds a new array from return values; `forEach` returns `undefined` and exists for side effects.
- **Is `const` immutable?** No — binding versus value.
- **Update `state.user.address.city` immutably.** Spread each level; mention structural sharing and Immer.
- **What does `Object.freeze` do and not do?** Shallow, throws only in strict mode, silent in sloppy mode.
- **Why does React need immutable updates?** Reference equality is how it detects changes cheaply.

## Practice

1. Rewrite a `for` loop that builds a list of the email addresses of active users, lowercased and de-duplicated, as a pipeline. Then explain where `new Set` fits.
2. Write a loop that sums prices until a budget is exceeded and returns the items that fit. Explain why this is awkward with `reduce`.
3. Write `updateCity(state, userId, city)` for `{ users: [{ id, address: { city } }] }` without mutating `state`, and check with `===` which objects changed.
4. Write `deepFreeze(obj)` and use it to make a test fail when a reducer mutates its input.
5. Replace `const top = scores.sort((a, b) => b - a).slice(0, 3)` with a version that does not change `scores`.

## Quick revision {#quick-revision}

- Imperative: steps and mutation (`for`, `push`, `+=`). Declarative: describe the result with transformations (`filter`, `map`, `reduce`).
- Declarative wins for data transformation; loops win for complex early exit, index-driven algorithms, sequential `await`, and proven hot paths.
- `map` for transformation only; `forEach`/`for...of` for side effects.
- `find`, `some`, `every` stop early; `map`/`filter`/`reduce` visit everything. Iterator helpers (ES2025, Node 22+) make chains lazy.
- Immutability: create new values instead of editing; in JS it is a discipline, not enforced.
- `const` fixes the binding, not the value.
- Spread is shallow: copy every level on the path to a change; unchanged parts are shared (structural sharing).
- ES2023 copies: `toSorted`, `toReversed`, `toSpliced`, `with`. `sort`/`reverse`/`splice` mutate.
- `Object.freeze` is shallow; writes throw in strict mode (modules, classes), fail silently in sloppy mode.
- `structuredClone` for deep independent copies; Immer for readable nested immutable updates.

## Key takeaways {#key-takeaways}

- Declarative code states what a value is in one place; imperative code describes how it changes over time.
- Choose the style per task: pipelines for transforming data, loops for control-flow-heavy algorithms and measured hot spots.
- Mutation is dangerous because of aliasing: every holder of a reference sees the change.
- Immutable updates make change detection a reference comparison and give undo and history almost for free.
- Spread and `Object.freeze` act on one level only; nested data needs copying along the whole path.
- Prefer the non-mutating array methods and keep mutation local to the function that owns the data.
