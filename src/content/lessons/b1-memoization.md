---
summary: Memoization makes a function remember the results it has already computed, so calling it again with the same arguments returns the stored answer instead of redoing the work. You will learn how to build a memoize helper with a closure and a Map, how to choose cache keys correctly, when memoization silently returns wrong answers, and how to keep caches from growing forever.
difficulty: intermediate
minutes: 45
objectives:
  - Implement a memoize helper with a closure and a Map, and explain why a Map beats a plain object as the cache
  - Memoize a recursive function correctly and explain how it turns exponential work into linear work
  - Choose a cache-key strategy (identity, nested Maps, serialised keys) and name the failure modes of each
  - Identify functions that must not be memoized because they are impure or return mutable results
  - Bound a cache with LRU eviction, use WeakMap for object keys, and deduplicate concurrent async calls
---

## Introduction

Some functions are slow and get called with the same arguments again and again. A product page recomputes the same price breakdown every time any part of the page updates. A route-matching function parses the same URL pattern on every navigation. A recursive algorithm solves the same sub-problem thousands of times. In each case the function does identical work to arrive at an answer it has already produced.

**Memoization** is the fix: the function keeps a record of the answers it has computed, keyed by the arguments that produced them. On each call it first checks the record. If the arguments have been seen before — a **cache hit** — it returns the stored answer immediately. If not — a **cache miss** — it does the work, stores the result, and returns it. The word comes from "memo", a note to yourself; it is not a misspelling of "memorisation".

Memoization is a specific kind of **caching**: caching applied at the boundary of one function, keyed by its arguments, stored in the program's memory. It is one of the most effective optimisations available to a JavaScript developer, and it shows up throughout the ecosystem: React's `useMemo` and `React.memo`, Redux selectors built with Reselect, Lodash's `_.memoize`, and top-down dynamic programming in algorithm interviews.

It is also an optimisation that can make a program *wrong*. A memoized function returns whatever it computed the first time, so if the right answer could have changed since then, the cached answer is stale. And a cache that never forgets anything is a memory leak. This lesson teaches the technique and those limits together, because using memoization well means knowing exactly when it is safe.

## Before you start

- **Pure functions** — a function whose result depends only on its arguments and that has no side effects. See [[b1-pure-functions]]; this is the property that makes memoization safe.
- **Closures** — a returned function keeps access to variables of the function that created it. See [[b1-closures]]. The cache lives in a closure.
- **`Map`** — a key-value collection whose keys can be any value. See [[b1-map]] and [[b1-map-vs-object]].
- **Recursion** — the classic use of memoization is a recursive function with repeated sub-problems. See [[b1-recursion-js]].

## The intuition

Picture a reference librarian who gets the same questions every week. The first time someone asks "How many books were borrowed last year?", the librarian spends twenty minutes adding up the records, then writes the question and answer on an index card and files it. The next time anyone asks, the librarian looks in the card box first, finds the card, and answers in seconds.

That card box is a memoization cache. The question is the key, the answer is the value, and checking the box first is the hit-or-miss test. The analogy also shows the two dangers. If a book is returned late and the true count changes, the card is now wrong, but the librarian keeps reading it out — that is a **stale cache**, and it happens whenever the answer depends on something other than the question. And if the librarian files a card for every question ever asked and never throws any away, the box eventually fills the room — that is **unbounded cache growth**.

## A first memoize helper

A **memoize** helper takes a function and returns a new function that behaves the same but remembers its results. Here is the simplest useful version, for functions of one argument:

```javascript title="memoize.js"
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);     // hit: reuse the stored answer
    const result = fn(arg);                        // miss: compute once
    cache.set(arg, result);
    return result;
  };
}

let runs = 0;
function slowSquare(n) {
  runs++;
  for (let i = 0; i < 1e7; i++);                  // simulate expensive work
  return n * n;
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(12), fastSquare(12), fastSquare(5), fastSquare(12));
console.log('slowSquare ran', runs, 'times');
```

```output
144 144 25 144
slowSquare ran 2 times
```

Four calls, two computations. The first `fastSquare(12)` misses, runs `slowSquare`, and stores `12 → 144`. The second and fourth calls with 12 hit and return immediately. `fastSquare(5)` misses once.

Three design decisions are worth understanding.

**The cache lives in a closure.** `cache` is a local variable of `memoize`. The returned function closes over it, so each memoized function gets its own private cache that persists between calls but cannot be read or corrupted from outside. Calling `memoize` twice on the same function gives two independent caches.

**`has` before `get`.** Writing `if (cache.get(arg)) return cache.get(arg)` looks shorter but breaks for any function that can return a falsy value: a cached `0`, `''`, `false` or `undefined` would be treated as a miss and recomputed every time. `has` asks whether the key is present, regardless of its value.

**The memoized function does the same job.** Callers cannot tell the difference except by speed. That transparency is only true if `fn` is pure, which is the subject of a later section.

### Why a Map and not a plain object

Older memoize implementations use an object, `const cache = {}`. That works for a single string argument but fails in subtle ways for anything else, because **object keys are always strings** (or symbols). Every other key is converted to a string first:

```javascript title="object-vs-map.js"
const cache = {};
cache[1] = 'number one';
cache['1'] = 'string one';
cache[{ id: 1 }] = 'first object';
cache[{ id: 2 }] = 'second object';
console.log(cache);

const map = new Map();
map.set(1, 'number one').set('1', 'string one');
map.set(NaN, 'not a number');
console.log(map.get(1), '|', map.get('1'), '|', map.get(NaN), '|', map.size);
map.set(0, 'zero');
console.log(map.get(-0));
```

```output
{ '1': 'string one', '[object Object]': 'second object' }
number one | string one | not a number | 3
zero
```

In the object, the number `1` and the string `'1'` collide on the key `'1'`, and *every* object argument collides on `'[object Object]'`, so a memoized function would return the result for one object when called with a completely different one. Objects also inherit properties: a lookup for an argument such as `'toString'` or `'constructor'` finds the inherited method and treats it as a cached result unless you use `Object.create(null)` or `Object.hasOwn`.

A `Map` keeps keys as they are. It compares keys with the **SameValueZero** algorithm: like `===`, except that `NaN` equals `NaN` (so `NaN` works as a key) and `+0` equals `-0` (so they share an entry). Objects are compared by **identity** — two different objects are two different keys, even with identical contents. That identity rule is both a strength and a trap, as you will see when choosing keys.

## Memoizing a recursive function

The classic case for memoization is a recursive function that solves the same sub-problems repeatedly. The naive Fibonacci function makes about 2.7 million calls to compute `fib(30)`, because `fib(29)` and `fib(28)` both recompute `fib(27)`, and so on down the tree; see [[b1-recursion-js]]. Memoization stores each `fib(k)` the first time it is computed.

There is a subtle trap in how you apply it:

```javascript title="memo-fib.js"
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

let calls = 0;
function fib(n) {
  calls++;
  return n < 2 ? n : fib(n - 1) + fib(n - 2);   // calls the raw fib
}
const wrapped = memoize(fib);
calls = 0; console.log(wrapped(30), 'calls:', calls);
calls = 0; console.log(wrapped(30), 'calls:', calls);
calls = 0; console.log(wrapped(31), 'calls:', calls);

let calls2 = 0;
const fastFib = memoize((n) => {
  calls2++;
  return n < 2 ? n : fastFib(n - 1) + fastFib(n - 2);   // calls the memoized one
});
console.log(fastFib(30), 'calls:', calls2);
calls2 = 0; console.log(fastFib(31), 'calls:', calls2);
```

```output
832040 calls: 2692537
832040 calls: 0
1346269 calls: 4356617
832040 calls: 31
1346269 calls: 1
```

`wrapped` only memoizes the **outermost** call. Inside, `fib` calls itself by name — the original, unmemoized `fib` — so the first `wrapped(30)` still makes 2.7 million calls. Repeating `wrapped(30)` is a hit, but `wrapped(31)` is a new key and does all the work again (4.4 million calls), learning nothing from the previous computation.

`fastFib` routes its recursive calls through the **memoized** function. Now each `n` from 0 to 30 is computed exactly once: 31 calls in total. Computing `fastFib(31)` afterwards costs one call, because `fastFib(30)` and `fastFib(29)` are already in the cache.

The running time drops from exponential (roughly 1.6ⁿ calls) to **linear**: n + 1 computations, each doing constant work plus two cache lookups. The cost is O(n) memory for the cache. This trade — memory for time — is the essence of memoization, and recursion plus memoization is exactly **top-down dynamic programming**; see [[a11-memoization]].

> [!NOTE] Memoization does not fix recursion depth
> On a fresh cache, `fastFib(20000)` still throws `RangeError`. The first call descends through `fastFib(19999)`, `fastFib(19998)` and so on before anything is cached, so the stack depth is still about n. Memoization reduces the number of calls, not how deeply they nest. For large n, compute bottom-up in a loop instead. (Also note that Fibonacci numbers exceed `Number.MAX_SAFE_INTEGER` after `fib(78)`; use `BigInt` beyond that. See [[b1-safe-integers]].)

## Choosing cache keys

The single-argument version uses the argument itself as the key. Real functions take several arguments, and some take objects. The key strategy decides which calls count as "the same" — and every strategy gets some cases wrong.

### Serialised keys with JSON.stringify

The quickest multi-argument approach turns all arguments into one string: `const key = JSON.stringify(args)`. It treats arguments with equal contents as equal, which is often what you want. But `JSON.stringify` was designed for data interchange, not for identity, and it loses or merges information:

```javascript title="json-keys.js"
const key = (...args) => JSON.stringify(args);
console.log(key(1, 'a'), key('1,a'));
console.log(key({ a: 1, b: 2 }) === key({ b: 2, a: 1 }));
console.log(key([undefined]), key([null]));
console.log(key(NaN), key(null), key(Infinity));
console.log(key(-0), key(0));
console.log(key(new Map([[1, 2]])), key(new Set([1])));
console.log(key(() => 1));
console.log(key(new Date(0)), key('1970-01-01T00:00:00.000Z'));
try { key(10n); } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
[1,"a"] ["1,a"]
false
[[null]] [[null]]
[null] [null] [null]
[0] [0]
[{}] [{}]
[null]
["1970-01-01T00:00:00.000Z"] ["1970-01-01T00:00:00.000Z"]
TypeError: Do not know how to serialize a BigInt
```

Wrapping the arguments in an array keeps `(1, 'a')` distinct from `('1,a')`, which a naive `args.join(',')` would merge. Beyond that, the list of problems is long. Objects with the same properties in a different order produce different strings, so equal objects **miss**. `undefined` inside arrays, `NaN`, `null` and `Infinity` all become `null`, so different arguments **collide** and return each other's results. `-0` becomes `0`. Every `Map` and `Set` becomes `{}`, so all of them collide. Functions become `null`. A `Date` and its ISO string collide. `BigInt` throws. Cyclic objects throw. And serialising a large object on every call can cost more than the computation you were trying to avoid. The details of what JSON drops are in [[b1-json-unsupported]].

Serialised keys are acceptable for small arguments of known, JSON-friendly shapes — a few numbers and short strings — and a poor default for anything else.

### Nested Maps keyed by identity

The more robust general approach keeps one level of `Map` per argument, forming a tree (a **trie**) of caches. Each argument is compared by SameValueZero, so primitives work exactly and objects are matched by identity:

```javascript title="memoize-many.js"
function memoizeMany(fn) {
  const root = new Map();
  const RESULT = Symbol('result');               // cannot collide with a real argument
  return function (...args) {
    let node = root;
    for (const arg of args) {                    // one Map level per argument
      if (!node.has(arg)) node.set(arg, new Map());
      node = node.get(arg);
    }
    if (node.has(RESULT)) return node.get(RESULT);
    const result = fn.apply(this, args);
    node.set(RESULT, result);
    return result;
  };
}

let runs = 0;
const distance = memoizeMany((a, b) => {
  runs++;
  return Math.hypot(a.x - b.x, a.y - b.y);
});

const home = { x: 0, y: 0 };
const office = { x: 3, y: 4 };
console.log(distance(home, office), distance(home, office), 'runs:', runs);
console.log(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 'runs:', runs);  // equal, but new objects

const power = memoizeMany((base, exp) => { runs++; return base ** exp; });
runs = 0;
console.log(power(2, 10), power(2, 10), power(10, 2), 'runs:', runs);
```

```output
5 5 runs: 1
5 runs: 2
1024 1024 100 runs: 2
```

Calling `distance(home, office)` walks `root → home → office` and stores the result at that node under a private `Symbol` key; because no caller can pass that exact symbol, it cannot collide with a real argument. The second call with the same two objects is a hit. The third call passes *new* objects with equal contents, which are different keys, so it misses and computes again. With numbers, `power(2, 10)` and `power(10, 2)` are correctly distinct, because argument order is part of the path. The helper also forwards `this` with `apply`, so it can wrap methods.

Identity keys make one assumption explicit: **the same object means the same input**. That fits code that treats objects as immutable — creating a new object whenever data changes, as React and Redux state does — and fails for code that mutates objects in place, as the next section shows.

| Key strategy | Equal contents, different objects | Same object, mutated | Cost per call | Good for |
|---|---|---|---|---|
| Argument itself (one primitive) | — | — | Cheap | Single number or string arguments |
| `JSON.stringify(args)` | Hit (unless key order differs) | Miss (new contents, new key) | Grows with argument size | Small JSON-friendly arguments |
| Nested `Map` by identity | Miss | Hit (possibly stale) | Cheap | Immutable data, any argument types |
| `WeakMap` by identity | Miss | Hit (possibly stale) | Cheap | One object argument, no leaks |

## Object keys without leaks: WeakMap

A memoization cache holds strong references to its keys. If you memoize a function that takes large objects — DOM nodes, API responses, parsed documents — every object ever passed stays in memory for as long as the memoized function exists, even after the rest of the program has finished with it. A **`WeakMap`** solves this: its keys must be objects, and it holds them *weakly*, so when nothing else references a key object, the garbage collector can reclaim it and its entry disappears. See [[b1-weakmap]].

```javascript title="weakmap-memo.js"
function memoizeByObject(fn) {
  const cache = new WeakMap();                   // entries vanish with their key object
  return function (obj) {
    if (cache.has(obj)) return cache.get(obj);
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

let runs = 0;
const summarise = memoizeByObject((order) => {
  runs++;
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
});

const order = { items: [{ price: 10, qty: 2 }, { price: 5, qty: 1 }] };
console.log(summarise(order), summarise(order), 'runs:', runs);

order.items.push({ price: 100, qty: 1 });       // mutate the same object
console.log(summarise(order), 'runs:', runs);    // stale: same key, old answer

const updated = { ...order, items: [...order.items] };   // new object = new key
console.log(summarise(updated), 'runs:', runs);
```

```output
25 25 runs: 1
25 runs: 1
125 runs: 2
```

The first two calls behave as expected. Then the order is **mutated in place**: an item is added, so the true total is 125. But the key is the same object, so the cache returns the stale 25. Only when a *new* object is created — the immutable-update style — does the function recompute. This is the central rule of identity-based memoization: it is correct only if objects are never mutated after being used as keys.

A `WeakMap` cannot be iterated or sized, and its keys cannot be primitives: `new WeakMap().set(42, 1)` throws `TypeError: Invalid value used as weak map key`. So a WeakMap cache suits functions whose argument is always an object; combine it with a `Map` level if some arguments are primitives.

## When memoization gives wrong answers

Memoization assumes that calling the function again with the same arguments would produce the same result. That is the definition of a **pure function** — one whose output depends only on its inputs and which causes no side effects. It is also called **referential transparency**: a call can be replaced by its result without changing the program. See [[b1-referential-transparency]]. Break that assumption and memoization changes behaviour.

```javascript title="impure-memo.js"
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

let taxRate = 0.2;
const withTax = memoize((price) => price * (1 + taxRate));   // reads outside state
console.log(withTax(100));
taxRate = 0.25;
console.log(withTax(100));                       // stale: still the old rate

const getDefaults = memoize((role) => ({ role, permissions: ['read'] }));
const settings = getDefaults('viewer');
settings.permissions.push('delete');             // caller mutates the cached object
console.log(getDefaults('viewer').permissions);
```

```output
120
120
[ 'read', 'delete' ]
```

**Hidden inputs.** `withTax` reads `taxRate`, which is not an argument. When the rate changes, the cache still holds `100 → 120`. The fix is to make every input an argument — `withTax(price, rate)` — so it becomes part of the key. The same problem occurs with functions that read the current time, random numbers, global configuration, `localStorage`, or the DOM.

**Side effects.** A memoized function's body runs only on a miss. If it logs analytics, sends a request, or increments a counter, those effects silently stop happening on hits. Never memoize a function *because* of what it does; memoize it for what it returns.

**Mutable results.** `getDefaults` is pure, but it returns an object, and the cache returns *the same object* to every caller. One caller pushed `'delete'` into it, and now every future caller asking for `'viewer'` defaults gets a permissions list with `'delete'` in it — a security bug created by an optimisation. Either never mutate values returned from memoized functions (treat them as read-only, or `Object.freeze` them; see [[b1-object-freeze-seal]]), or return a copy on each hit.

> [!WARNING] Memoize only pure functions with immutable results
> Before memoizing, ask: does the result depend on anything other than the arguments? Does the function do anything other than compute? Will callers modify what it returns? If any answer is yes, the memoized version can return stale or shared data.

## Keeping caches bounded

A memoized function that lives for the whole program — a module-level helper, a function in a long-running server — keeps every result it has ever computed. If it is called with an unbounded variety of arguments (user IDs, search terms, timestamps), its cache grows until the process runs out of memory. This is one of the most common causes of slow memory leaks in Node.js services. See [[b1-memory-leaks]].

The standard remedy is an eviction policy. **Least Recently Used (LRU)** eviction keeps at most `max` entries and, when full, discards the entry that has gone unused the longest. A JavaScript `Map` remembers insertion order, which makes a compact LRU possible:

```javascript title="lru-memo.js"
function memoizeLRU(fn, { max = 100 } = {}) {
  const cache = new Map();                       // Map remembers insertion order
  return function (arg) {
    if (cache.has(arg)) {
      const value = cache.get(arg);
      cache.delete(arg);                         // move to the "most recent" end
      cache.set(arg, value);
      return value;
    }
    const value = fn(arg);
    cache.set(arg, value);
    if (cache.size > max) {
      const oldest = cache.keys().next().value;  // first key = least recently used
      cache.delete(oldest);
    }
    return value;
  };
}

const computed = [];
const label = memoizeLRU((n) => { computed.push(n); return `#${n}`; }, { max: 2 });
label(1); label(2); label(1);   // 1 becomes most recent
label(3);                       // evicts 2, the least recently used
label(1); label(2);             // 1 is a hit, 2 must be recomputed
console.log(computed);
```

```output
[ 1, 2, 3, 2 ]
```

On a hit, deleting and re-inserting the key moves it to the end of the Map's order, so the *first* key is always the least recently used. When the size exceeds `max`, that first key is evicted. Trace the example: after `label(1); label(2); label(1)`, the order is `[2, 1]`. `label(3)` adds 3 and evicts 2, leaving `[1, 3]`. `label(1)` is a hit; `label(2)` is a miss and is computed again. Both operations are O(1). The data structure is developed fully in [[b1-impl-lru]].

Other policies fit other data. A **time-to-live (TTL)** stores a timestamp with each entry and treats entries older than some duration as misses — right for data that goes stale over time, such as exchange rates. A **size-one cache** remembers only the most recent call, which is surprisingly effective in UI code, as the next sections show.

## Memoizing async functions

For a function that returns a promise — fetching a user profile, loading a configuration file — there is a choice: cache the *resolved value*, or cache the *promise*. Caching the promise is better, because it also deduplicates calls that happen while the first request is still in flight:

```javascript title="async-memo.js"
function memoizeAsync(fn) {
  const cache = new Map();
  return function (key) {
    if (cache.has(key)) return cache.get(key);
    const promise = fn(key).catch((err) => {
      cache.delete(key);                         // do not cache failures
      throw err;
    });
    cache.set(key, promise);                     // cache the promise immediately
    return promise;
  };
}

let requests = 0;
let failNext = true;
const fetchProfile = async (id) => {
  requests++;
  await new Promise((resolve) => setTimeout(resolve, 10));
  if (id === 'flaky' && failNext) { failNext = false; throw new Error('timeout'); }
  return { id, name: `user-${id}` };
};

const getProfile = memoizeAsync(fetchProfile);

async function main() {
  const [a, b, c] = await Promise.all([getProfile('42'), getProfile('42'), getProfile('42')]);
  console.log(a.name, a === b && b === c, 'requests:', requests);

  try { await getProfile('flaky'); } catch (e) { console.log('first try:', e.message); }
  const retry = await getProfile('flaky');
  console.log('second try:', retry.name, 'requests:', requests);
}
main();
```

```output
user-42 true requests: 1
first try: timeout
second try: user-flaky requests: 3
```

Three components asking for profile `'42'` at the same moment trigger **one** request, because the second and third calls find the pending promise already in the cache. If the cache stored only resolved values, all three would miss (nothing has resolved yet) and send three identical requests.

The `.catch` handler removes a failed promise from the cache. Without it, one network timeout would be cached forever, and every later call would receive the same rejection without retrying. Here, the first `'flaky'` request fails and is evicted, so the second attempt sends a fresh request and succeeds. Data-fetching libraries such as TanStack Query and SWR are built on this idea, adding TTLs, background refresh and invalidation on top.

## How it works internally

A memoized function is two objects: the wrapper function and the cache it closes over. The wrapper's `[[Environment]]` keeps the `memoize` call's scope alive, and that scope holds the `Map`. As long as the wrapper is reachable — stored in a module variable, an object, a component — the cache and everything in it stay in memory. When the wrapper becomes unreachable, the whole cache becomes garbage at once. See [[b1-closure-lifecycle]].

A `Map` lookup is a hash-table operation: average O(1) time. For primitive keys the engine hashes the value; for object keys it uses an identity hash stored with the object. So a memoized call costs one or two hash lookups on a hit, plus the cost of building the key. That last part matters: an identity lookup is nanoseconds, while `JSON.stringify` of a large object can take longer than many of the functions people memoize. Memoization pays off only when the work skipped is clearly larger than the cost of the lookup and key construction, and when hits are frequent.

A `WeakMap` is implemented as an **ephemeron table**: the garbage collector treats an entry's value as reachable only if its key is reachable by some other path. This is what allows the entry to vanish with its key, and also why a WeakMap cannot be iterated — its contents depend on when the collector last ran.

## In real systems

**React.** `useMemo(() => compute(a, b), [a, b])` is a memoization cache of size one per component instance: it keeps the last result and the last dependency values, compares each dependency with `Object.is`, and recomputes only when one changed. `React.memo(Component)` memoizes a component's rendered output against a shallow comparison of its props, and `useCallback` keeps the same function object between renders so memoized children see an unchanged prop. All three rely on identity — which is why creating a new object or array on every render defeats them. The React Compiler can insert this memoization automatically. See [[b4-usememo]], [[b4-react-memo]], [[b4-usecallback]] and [[b4-automatic-memoization]].

**Selectors.** In Redux applications, selectors derive data from the store, such as "visible todos for the current filter". Reselect's `createSelector` (re-exported by Redux Toolkit) recomputes only when the results of its input selectors change by reference. The core idea is a last-arguments cache:

```javascript title="memoize-last.js"
// last-argument cache, the strategy behind useMemo and many selectors
function memoizeLast(fn) {
  let lastArgs = null;
  let lastResult;
  return function (...args) {
    const same = lastArgs !== null && args.length === lastArgs.length &&
      args.every((arg, i) => Object.is(arg, lastArgs[i]));
    if (same) return lastResult;
    lastArgs = args;
    lastResult = fn.apply(this, args);
    return lastResult;
  };
}

let runs = 0;
const visibleTodos = memoizeLast((todos, filter) => {
  runs++;
  return todos.filter((t) => filter === 'all' || t.done === (filter === 'done'));
});

const todos = [{ text: 'write', done: true }, { text: 'test', done: false }];
const a = visibleTodos(todos, 'done');
const b = visibleTodos(todos, 'done');
console.log(a === b, 'runs:', runs);             // same inputs: same array returned
visibleTodos(todos, 'all');
visibleTodos(todos, 'done');                     // only the last call is remembered
console.log('runs:', runs);
visibleTodos([...todos], 'done');                // equal contents, new array: miss
console.log('runs:', runs);
```

```output
true runs: 1
runs: 3
runs: 4
```

Returning the *same array* on a hit is as important as saving the work: a component receiving `a` and then `b` sees an unchanged prop and can skip re-rendering. A size-one cache uses no growing memory, and in UI code consecutive calls usually have the same inputs. Its weakness shows in the second line: alternating between two filters misses every time. See [[b4-redux-selectors]].

**Libraries.** Lodash's `_.memoize(fn, resolver)` caches by the *first argument only* unless you supply a `resolver` function to compute the key — a frequent source of bugs when a second argument is ignored. It exposes the cache as `memoized.cache`, which you can clear or replace with a bounded implementation.

**Compilers and parsers.** Tools such as TypeScript, bundlers and template engines memoize expensive per-file or per-pattern work: compiled regular expressions, resolved module paths, parsed route patterns. These are usually keyed by a string and bounded by the number of files or routes.

**Beyond one process.** Memoization lives in one process's memory and disappears on restart. Sharing results across servers or surviving restarts needs an external cache such as Redis, with explicit invalidation; see [[d3-cache]].

## Trade-offs and alternatives

Memoization trades memory for time. It is worth it when four things are true: the function is pure; it is expensive relative to a cache lookup; it is called repeatedly with the same arguments (a high **hit rate**); and the set of distinct arguments is small or the cache is bounded.

It is not worth it for cheap functions (the lookup can cost more than the work), for functions called with mostly unique arguments (the cache only grows), or for impure functions. In React, wrapping every value in `useMemo` adds comparison overhead and code noise; memoize where profiling shows a real cost or where a stable reference is needed by a memoized child. See [[b4-when-memoization-helps]].

Alternatives to consider:

| Situation | Better tool |
|---|---|
| Recursive problem, all sub-problems needed | Bottom-up dynamic programming with a loop and an array |
| Result needed once, at start-up | Compute once into a constant |
| Data shared across requests or servers | An external cache with TTL and invalidation |
| Avoiding repeated work in event handlers | Debouncing or throttling the calls ([[b1-debounce]]) |
| Expensive derived state in a component | `useMemo`, or restructuring so the value is computed less often |

## Common mistakes

> [!MISTAKE] Memoizing only the outer call of a recursive function
> `const fast = memoize(fib)` does not help if `fib` calls itself by its own name; the inner calls bypass the cache. Make the recursive calls go through the memoized function, as in `fastFib` above.

**Using a plain object as the cache.** Numbers and strings collide, all objects collide on `'[object Object]'`, and inherited properties look like cached values. Use a `Map`.

**Testing hits with `cache.get(key)`.** Falsy results (`0`, `''`, `false`, `undefined`) look like misses. Use `cache.has(key)`.

**Ignoring arguments in the key.** A key built from the first argument (Lodash's default) or from some arguments returns wrong results when the others change. Every argument that affects the result must be part of the key.

**Trusting `JSON.stringify` keys.** Different values collide (`NaN`, `null`, `undefined` in arrays) and equal objects miss when key order differs. Use identity keys with immutable data, or a purpose-built key function.

**Mutating objects used as keys or returned as results.** Identity keys return stale results after in-place mutation, and shared results leak one caller's changes to all others.

**Unbounded caches in long-lived code.** A module-level memoized function called with user-supplied values is a memory leak. Bound it with LRU or TTL, or use a `WeakMap` for object keys.

**Caching rejected promises.** One transient failure becomes permanent. Evict on rejection.

## Interview perspective

Memoization questions range from "implement memoize" to designing a cache for an API client, and they reward candidates who mention correctness conditions without being prompted.

> [!INTERVIEW] What to say while implementing memoize
> "I'll keep a `Map` in a closure, check `has` so falsy results still count as hits, and forward `this` and all arguments with `apply`. The key is the hard part: for one primitive argument it's the argument itself; for several I'd use nested Maps so objects are compared by identity. This is only correct for pure functions, and in a long-running process I'd bound the cache with LRU or use a WeakMap for object keys."

Questions to prepare:

- **Implement `memoize` for any number of arguments.** Nested Maps (shown above) or a key function; discuss trade-offs of `JSON.stringify`.
- **Memoize Fibonacci and give the complexity.** Recursive calls must use the memoized function; O(n) time and O(n) space, versus roughly O(1.6ⁿ) time naively. Mention that stack depth is still O(n).
- **When is memoization unsafe?** Impure functions (hidden inputs, side effects), mutable results, mutated object keys.
- **How do you stop a memo cache leaking memory?** LRU or TTL eviction, size-one caches, or WeakMap keys.
- **How is `useMemo` different from a general memoize?** It remembers only the last result per component instance, compares dependencies with `Object.is`, and React may discard the cache; it is a performance hint, not a semantic guarantee.
- **Deduplicate concurrent API requests.** Cache the promise, evict it on rejection.

```quiz
Q: A memoize helper uses `if (cache.get(arg)) return cache.get(arg);`. For which function will it recompute on every call even after the first?
- [ ] A function returning large objects
- [x] A function that returns 0 for some inputs
- [ ] A function called with string arguments
- [ ] A recursive function
> A cached result of 0 is falsy, so the `if` treats it as a miss and recomputes. The same happens for '', false, null and undefined. Checking `cache.has(arg)` tests whether the key exists, independently of its value.

Q: `const fast = memoize(fib)`, where `fib(n)` returns `fib(n - 1) + fib(n - 2)` by calling itself by name. How does `fast(35)` perform the first time it is called?
- [ ] Linear time, because every sub-result is cached
- [x] Exponential time, because the inner calls go to the unmemoized `fib`
- [ ] It throws, because memoized functions cannot recurse
- [ ] Constant time, because Map lookups are O(1)
> Only the outer call goes through the cache. Inside, `fib` refers to the original function, so the full exponential call tree runs. To memoize every level, the recursive calls must call the memoized function.

Q: A function is memoized with a `WeakMap` keyed by its object argument. The caller passes `order`, then pushes a new item into `order.items`, then calls the function with `order` again. What happens?
- [ ] The cache detects the change and recomputes
- [x] The cache returns the old result, which is now stale
- [ ] The WeakMap entry is garbage-collected because the object changed
- [ ] It throws because WeakMap keys must be frozen
> WeakMap keys are compared by identity, and mutating an object does not change its identity, so the second call is a hit with the old result. Identity-based memoization is correct only if objects are not mutated after being used as keys; create a new object to get a new key.
```

## Practice

1. **Generic memoize.** Extend the nested-Map `memoizeMany` with a `.clear()` method and a `.size` getter that counts stored results. Write tests for zero arguments, `NaN`, `-0` and `+0`.
2. **Key resolver.** Add an optional `resolver(...args)` parameter, like Lodash's, that computes the cache key. Use it to memoize `search(query, { page, pageSize })` by `${query}|${page}|${pageSize}`, and explain what breaks if you forget `pageSize`.
3. **TTL cache.** Write `memoizeTTL(fn, ms)` that treats entries older than `ms` as misses. Test it without real waiting by injecting a `now()` function.
4. **Grid paths.** Count the paths from the top-left to the bottom-right of an `m × n` grid moving only right or down. Write the naive recursion, memoize it with a string key `${r},${c}`, then rewrite it bottom-up and compare.
5. **Request deduplication.** Build `createApiClient(fetchFn)` whose `get(url)` shares in-flight requests, caches successful responses for 30 seconds, and never caches errors.

## Quick revision {#quick-revision}

- Memoization: cache a function's results keyed by its arguments; hit returns the stored value, miss computes and stores.
- Implement with a closure over a `Map`; check `has`, not truthiness of `get`.
- `Map` over object: object keys become strings (`1` vs `'1'` collide, all objects become `'[object Object]'`); `Map` uses SameValueZero (`NaN` works, `+0`/`-0` share).
- Recursive memoization: inner calls must go through the memoized function. Fibonacci goes from ~1.6ⁿ calls to n + 1; space O(n); stack depth still O(n).
- Keys: single primitive → the argument; several → nested Maps by identity; `JSON.stringify(args)` is lossy (key order, `NaN`/`undefined`→`null`, `Map`/`Set`→`{}`, BigInt throws, cycles throw) and can be expensive.
- Identity keys are correct only if objects are never mutated after use.
- `WeakMap` cache: object keys only, entries are collected with their key, not iterable.
- Only memoize pure functions: hidden inputs give stale results, side effects stop on hits, mutable results are shared between callers.
- Bound caches: LRU with `Map` insertion order (delete + set on hit, evict first key), TTL, or size one.
- Async: cache the promise to deduplicate in-flight calls; delete it on rejection.
- React: `useMemo` is a last-value cache comparing deps with `Object.is`; `React.memo` shallow-compares props; Reselect recomputes when input results change by reference. Lodash `_.memoize` keys on the first argument unless given a resolver.

## Key takeaways {#key-takeaways}

- Memoization trades memory for time by remembering results keyed by arguments, and it is built from nothing more than a closure and a `Map`.
- It is correct only for pure functions whose results are not mutated; otherwise it returns stale or shared data.
- The cache key defines what "same arguments" means, and every strategy — identity, serialisation, nested Maps — has failure cases you must choose deliberately.
- For recursive functions, the recursive calls must go through the cache; then overlapping sub-problems are solved once.
- Long-lived caches need bounds (LRU, TTL, size one) or weak keys, and async caches should store promises and forget failures.
