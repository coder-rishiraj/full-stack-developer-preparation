---
summary: A WeakMap associates data with objects without keeping those objects alive - when a key object becomes unreachable, its entry disappears with it. You will learn why an ordinary Map leaks in this situation, what "weakly held" means to the garbage collector, why a WeakMap cannot be counted or iterated, and where WeakRef and FinalizationRegistry fit.
difficulty: intermediate
minutes: 40
objectives:
  - Explain how a Map keyed by objects can leak memory and how a WeakMap avoids it
  - Use the WeakMap API and state which values are allowed as keys
  - Explain why WeakMap has no size, no iteration and no clear in terms of garbage collection
  - Implement per-object caches, metadata and private data with a WeakMap
  - Describe WeakRef and FinalizationRegistry and explain why program correctness must not depend on them
---

## Introduction

Suppose you are writing a small library that records how many times each button on a page has been clicked. The buttons belong to the application, not to you, so you would prefer not to add properties to them. A [[b1-map|Map]] keyed by the element looks ideal:

```javascript
const clicks = new Map();

function track(element) {
  clicks.set(element, (clicks.get(element) ?? 0) + 1);
}
```

It works, and it has a slow-acting bug. Pages remove elements all the time — a dialog closes, a list re-renders. When the application drops its last reference to a removed button, it expects the button's memory to be reclaimed. It will not be: `clicks` still holds the button as a key, so the button, everything it references and its click count stay in memory for as long as `clicks` exists. The Map was meant to be a side note about the button, and instead it has become the thing keeping the button alive. In a long-running single-page application this is a **memory leak** ([[b1-memory-leaks]]).

A **WeakMap** is a key-value collection whose keys are held *weakly*: being a key in a WeakMap does not, by itself, keep an object alive. Once nothing else in the program can reach the key object, the garbage collector may reclaim it, and the entry — key and value — goes with it. Replace `new Map()` with `new WeakMap()` in the code above and the leak is gone, with no cleanup code to write.

WeakMap was added in ES2015 alongside Map. This lesson explains how it differs, why its API is deliberately small, the patterns it is used for, and the two lower-level tools — `WeakRef` and `FinalizationRegistry` — that expose weak references directly.

## Before you start

- **Map** — `set`, `get`, `has`, `delete`, and keys compared by identity. See [[b1-map]].
- **References** — variables hold references to objects, and several references can point to one object. See [[b1-objects-as-values]].
- **Garbage collection** — the engine frees objects that the program can no longer reach. The next section summarises what is needed; the full treatment is in [[b1-garbage-collection]] and [[b1-reachability]].

## Reachability in one page

JavaScript has no `free` or `delete` for objects. Instead, the engine periodically runs a **garbage collector** (GC) that finds objects the program can no longer use and reclaims their memory. "Can no longer use" is defined by **reachability**: starting from a set of **roots** — global variables, the local variables of functions currently executing, and a few engine-internal references — the collector follows every reference it finds. Any object it arrives at is reachable and is kept. Anything it never arrives at is garbage.

An ordinary reference — a variable, a property, an array element, a Map key or value — is a **strong reference**: the collector follows it, so it keeps its target alive. A **weak reference** is one the collector does *not* follow when deciding what is alive. An object that is referred to only weakly is unreachable, and can be collected.

```mermaid title="Why the Map entry survives and the WeakMap entry does not"
flowchart LR
    R(["roots"]) --> M["Map"]
    R --> W["WeakMap"]
    M -- "strong" --> K1["key object A"]
    M -- "strong" --> V1["value for A"]
    W -. "weak" .-> K2["key object B"]
    K2 -. "kept only while B is alive" .-> V2["value for B"]
```

Object A is reachable through the Map, so it stays. Object B has only a weak reference pointing at it; once the application's own references to B are gone, B is unreachable, and so is its value.

## The intuition

Think of a WeakMap as sticky notes attached to other people's luggage. You can write a note and stick it on a bag; if someone hands you that bag, you can read its note. When the owner throws the bag away, the note goes with it — you do not have to do anything, and you are not told. What you cannot do is produce a list of every bag that has a note, because you never held the bags; you only ever recognise a bag when it is put in front of you.

The analogy maps well onto the API: lookup needs the key object in hand, and there is no enumeration. It is imprecise in one way. The data is stored in the WeakMap's own internal table, not on the key object — the key is not modified at all, which is why a WeakMap works even on frozen objects.

## The API

A WeakMap has four methods, and nothing else.

```javascript
const meta = new WeakMap();
const user = { id: 1 };

console.log(meta.set(user, { clicks: 3 }) === meta);   // set returns the WeakMap
console.log(meta.get(user).clicks, meta.has(user));
console.log(meta.get({ id: 1 }), meta.get('user'));    // other object / non-object

console.log(meta.delete(user), meta.delete(user));
console.log(meta.size, typeof meta.forEach, typeof meta.clear);
```

```output
true
3 true
undefined undefined
true false
undefined undefined undefined
```

`set`, `get`, `has` and `delete` behave as they do on a Map, and keys are matched by identity. Looking up a key that cannot be in the map — a different object, or a primitive — returns `undefined` or `false` without an error. The last line shows what is absent: no `size`, no `forEach`, no `keys`, `values` or `entries`, no `clear`, and a WeakMap is not iterable. The constructor accepts an iterable of `[key, value]` pairs, like `Map`.

### What can be a key

Keys must be values that have an identity and can be garbage collected — in practice, **objects** (including arrays, functions and class instances). Primitives are rejected:

```javascript
const wm = new WeakMap();

for (const key of ['u1', 42, null, Symbol.for('app')]) {
  try {
    wm.set(key, 'data');
  } catch (err) {
    console.log(`${err.name}: ${err.message}`);
  }
}

wm.set(Symbol('local'), 'ok');
console.log(wm.has(Symbol('local')));
```

```output
TypeError: Invalid value used as weak map key
TypeError: Invalid value used as weak map key
TypeError: Invalid value used as weak map key
TypeError: Invalid value used as weak map key
false
```

The rule follows from the purpose. A weak entry lives "until the key is unreachable". A string or a number is never unreachable in that sense: anyone can write `'u1'` again at any time and produce the same value, so the entry could never be removed, and "weak" would mean nothing.

Since ES2023, a **non-registered symbol** — one created with `Symbol('description')` — is also allowed, because each such symbol is unique and cannot be recreated ([[b1-symbols]]). Symbols created with `Symbol.for(...)` live in a global registry and can be obtained again by name, so they are rejected, as the fourth line shows ([[b1-symbol-for]]). The final `has` is `false` because `Symbol('local')` creates a different symbol each time. Symbol keys are rare; treat "keys are objects" as the working rule.

Values can be anything, and they are held normally — strongly — for as long as their key is alive.

## Why there is no size and no iteration

The missing methods are not an oversight; each one would break the design.

Garbage collection does not happen at a predictable moment. The engine decides when to run it based on memory pressure, allocation rate and its own heuristics, and different engines decide differently. If a WeakMap had `size`, the number would change at arbitrary points when the collector happened to run, so the same program could print different results from one run to the next. JavaScript's designers chose not to make GC timing observable through this API.

Iteration has a second problem. Listing the keys would hand the program a strong reference to every key object, including ones that were otherwise unreachable and about to be collected. `clear` was dropped from the proposal before ES2015 was finalised, partly because without it, holding a WeakMap gives you no power over entries whose keys you do not hold — which makes WeakMaps safe to share between pieces of code that do not trust each other. To empty one, replace it: `cache = new WeakMap()`.

The consequence for you is a simple rule: **if you need to count, list or loop over the entries, a WeakMap is the wrong structure.** Use a Map and manage removal yourself.

## How it works internally

The specification states the requirement in terms of *liveness*: if a key is not otherwise alive, the WeakMap's entry for it must not make it or its value count as alive. Engines implement this with a GC mechanism called an **ephemeron**. An ephemeron is a key-value pair with a conditional rule: the value is treated as reachable *only if* the key is reachable by some other path (and the table itself is reachable).

That conditional matters because of a common case — a value that refers back to its own key:

```javascript
const info = new WeakMap();

function register(element) {
  info.set(element, { element, registeredAt: Date.now() });
}
```

The value object holds a strong reference to `element`. If a WeakMap merely held keys weakly and values strongly, the chain "WeakMap → value → key" would keep every key alive forever and the map would leak exactly like a Map. Under the ephemeron rule the value is not traced unless the key is already known to be alive, so the cycle is collected as a unit. During marking ([[b1-mark-and-sweep]]), V8 sets ephemeron tables aside, marks everything else, then repeatedly marks the values of entries whose keys turned out to be live until nothing changes; entries whose keys were never marked are removed from the table.

The table itself is a hash table keyed by each object's identity hash, as in a Map, so the four operations are constant time on average.

What the rule does *not* cover is a strong reference to the key from somewhere else. If a value stored under one key is also reachable from a global, or if the key itself is in some array, it stays alive. The WeakMap only promises not to be the reason.

### Seeing it happen

Normal JavaScript cannot observe collection, but Node.js can be started with `--expose-gc`, which adds a global `gc()` function for experiments. This program stores fifty large arrays under fifty key objects that nothing else references, first in a Map and then in a WeakMap, and checks whether the heap grew by more than 30 MB.

```javascript title="weak-vs-strong.mjs (run with: node --expose-gc)"
const heapMB = () => process.memoryUsage().heapUsed / 1048576;

gc();
const baseline = heapMB();

const strong = new Map();
for (let i = 0; i < 50; i++) strong.set({}, new Array(100_000).fill(i));
gc();
console.log('Map still holds the arrays:', heapMB() - baseline > 30);

strong.clear();

const weak = new WeakMap();
for (let i = 0; i < 50; i++) weak.set({}, new Array(100_000).fill(i));
gc();
console.log('WeakMap still holds the arrays:', heapMB() - baseline > 30);
```

```output
Map still holds the arrays: true
WeakMap still holds the arrays: false
```

Each `{}` key is dropped by the program as soon as the loop iteration ends. The Map keeps all fifty keys and their arrays, about 40 MB. The WeakMap's entries are collectable immediately, and the forced collection removes them. This output is from Node.js 22 with an explicit `gc()` call; without forcing a collection the memory would still be reclaimed, but at a time the engine chooses.

## Worked example: a per-object cache

A function computes an expensive summary of a report object. Callers often ask for the same report more than once, so the result should be cached — but reports are created and discarded continuously, and a cache that kept every report it had ever seen would grow forever.

```javascript title="summary-cache.js"
const cache = new WeakMap();
let computations = 0;

function summarise(report) {
  if (cache.has(report)) return cache.get(report);

  computations++;
  const total = report.rows.reduce((sum, row) => sum + row.amount, 0);
  const summary = { total, average: total / report.rows.length };

  cache.set(report, summary);
  return summary;
}

let march = { rows: [{ amount: 40 }, { amount: 60 }] };

console.log(summarise(march));
console.log(summarise(march) === summarise(march), computations);

const copy = { rows: march.rows };
summarise(copy);
console.log(computations);

march = null;   // the report and its cached summary are now collectable
```

```output
{ total: 100, average: 50 }
true 1
2
```

The first call computes and stores; later calls with the same object return the stored summary, so `computations` stays at `1` and the very same summary object comes back each time. `copy` has identical contents but is a different object, so it misses the cache — a WeakMap cache is keyed by *identity*, which suits data that is treated as immutable and replaced when it changes. Setting `march = null` removes the last strong reference to the report. No `cache.delete` is needed: the entry is now unreachable and will be collected along with the report.

This is [[b1-memoization|memoisation]] for functions of one object argument. It only helps when callers pass the same object again. For string or number arguments a WeakMap cannot be used at all; use a Map with a size limit.

## Other uses

**Metadata on objects you do not own.** The click counter from the introduction is the general pattern: a library keeps state about DOM elements, request objects or user-supplied values without modifying them and without extending their lifetime. A typical browser use, described here and not run, is `listeners.set(element, handler)` so that the handler can be found and removed later; when the element is removed from the page and dropped, the entry goes too.

**Private data for class instances.** Before `#private` fields existed, a WeakMap in module scope was the standard way to give objects truly private state: the instance is the key, the private data is the value, and code without access to the WeakMap cannot reach it.

```javascript
const balances = new WeakMap();

class Account {
  constructor(opening) {
    balances.set(this, opening);
  }
  deposit(amount) {
    balances.set(this, balances.get(this) + amount);
    return this;
  }
  get balance() {
    return balances.get(this);
  }
}

const acct = new Account(100).deposit(50);
console.log(acct.balance, Object.keys(acct), JSON.stringify(acct));
```

```output
150 [] {}
```

The balance does not appear among the instance's properties. Since ES2022, `#balance` does the same job with less code and is the better choice in new classes ([[b1-public-private-fields]]); the WeakMap form remains useful for attaching private data to objects whose class you do not control, and it is how transpilers implement private fields for older targets.

**Marking visited objects.** When the associated value would only ever be `true`, use a [[b1-weakset]].

## Weak References & GC {#b1-weak-references}

A **weak reference** is a reference to an object that does not prevent the garbage collector from reclaiming that object. WeakMap and WeakSet use weak references internally but never let you observe a collection. ES2021 added two APIs that do expose it: **`WeakRef`**, a handle to an object that may have been collected, and **`FinalizationRegistry`**, which requests a callback after an object has been collected. Both are in every current browser and in Node.js 14.6 and later. They are specialist tools; the specification itself advises avoiding them where possible.

### WeakRef

`new WeakRef(object)` creates a weak handle. Its one method, `deref()`, returns the object if it still exists, or `undefined` if it has been collected.

### FinalizationRegistry

`new FinalizationRegistry(callback)` creates a registry. `registry.register(object, heldValue)` asks for `callback(heldValue)` to be called at some point after `object` is collected. The held value must not be the object itself — the registry holds it strongly, so that would keep the object alive permanently. An optional third argument is a token for `registry.unregister(token)`.

```javascript title="weakref.mjs (run with: node --expose-gc)"
let image = { name: 'hero.png', pixels: new Array(1_000_000).fill(0) };

const ref = new WeakRef(image);
const registry = new FinalizationRegistry((label) => {
  console.log(`collected: ${label}`);
});
registry.register(image, image.name);

console.log(ref.deref()?.name);

image = null;                                  // drop the only strong reference
await new Promise((resolve) => setTimeout(resolve, 0));
gc();
await new Promise((resolve) => setTimeout(resolve, 50));

console.log(ref.deref());
```

```output
hero.png
collected: hero.png
undefined
```

While `image` holds the object, `deref()` returns it. After the strong reference is dropped and a collection is forced, the registry callback runs and `deref()` returns `undefined`. Two details explain the `await`s. Once `deref()` has returned an object, the specification keeps that object alive until the current synchronous job finishes, so a collection cannot happen in the middle of the code that is using it; the first `await` ends that job. And finalisation callbacks run as separate tasks some time after collection, never synchronously, so the second `await` gives the callback a chance to run.

This output was produced on Node.js 22 with a forced collection. In a normal program you cannot force it, and the following are all permitted by the specification: the object is collected much later, the callback is delayed for a long time, or the callback **never runs at all** — for example because the page is closed or the process exits first.

### The rules that follow

Those guarantees — or the lack of them — lead to firm rules.

**Check `deref()` every time, and store the result.** Call it once, put the result in a local variable (a strong reference for the duration of the function), and handle `undefined`. Calling `ref.deref()` twice and assuming the second call succeeds because the first did is a bug across an `await`.

**Never rely on a finalizer for required cleanup.** Closing a file, releasing a lock, closing a socket or flushing data must be done explicitly — a `close()` method called in a `finally` block, or an `AbortController`. A finalizer may run seconds or minutes late, by which time the program may have run out of file handles, or not run at all. Use `FinalizationRegistry` only as a safety net: to release a secondary resource, or to log a warning that someone forgot to call `close()`.

**Do not write tests that expect collection.** A test asserting that an object "has been collected by now" passes or fails depending on engine version, heap size and optimisation, and is flaky by construction. Investigate leaks with heap snapshots instead ([[b1-heap-snapshots]]).

**Prefer a WeakMap when it fits.** If the need is "data associated with an object for as long as that object lives", a WeakMap expresses it exactly, with deterministic observable behaviour and no callbacks.

The legitimate uses are narrow. A cache that must be keyed by *strings* but should let large values be reclaimed can store `WeakRef`s as Map values, with a `FinalizationRegistry` removing the dead keys — something a WeakMap cannot do, because its keys cannot be strings. Bindings to WebAssembly or native code use finalizers to free memory that the JavaScript collector cannot see. Outside cases like these, reaching for `WeakRef` usually means an ownership problem that should be solved with explicit lifetimes.

> [!WARNING] Weak does not mean "freed soon"
> A weak reference only *permits* collection. An object can stay in memory long after its last strong reference is gone, especially if it has been promoted to the engine's old generation, which is collected less often. Never treat `deref()` returning an object as proof that someone still uses it.

```quiz
Q: A module keeps `const meta = new Map()` and calls `meta.set(element, data)` for DOM elements that the page later removes and stops referencing. What happens to those elements?
- [ ] They are collected, because the page no longer references them
- [x] They stay in memory, because the Map holds a strong reference to each key
- [ ] The Map automatically deletes entries for removed elements
- [ ] They are collected, but their `data` values leak
> A Map's keys and values are strong references, and the Map itself is reachable from module scope, so every element and its data remain reachable. A WeakMap holds keys weakly: once the page drops an element, the entry no longer keeps it alive.

Q: Why does `WeakMap` have no `size` property?
- [ ] It was forgotten in ES2015 and is planned for a later edition
- [ ] Counting entries in a hash table is too slow
- [x] The count would change whenever the garbage collector happened to run, making program behaviour depend on GC timing
- [ ] WeakMaps can hold only one entry at a time
> Entries vanish when their keys are collected, and collection timing is engine-dependent and unpredictable. Exposing `size` or iteration would make that timing observable and results non-deterministic; iteration would also hand out strong references to keys that should be collectable.

Q: `wm.set(key, { owner: key })` stores a value that refers back to its own key. If nothing else references `key`, can the entry be collected?
- [ ] No: the value holds the key strongly, so the pair lives forever
- [x] Yes: a WeakMap value is only considered reachable if its key is reachable some other way
- [ ] Only if `wm.delete(key)` is called first
- [ ] Only in Node.js, not in browsers
> WeakMap entries are ephemerons. The collector does not trace an entry's value unless the key is already known to be alive by another path, so a reference from the value back to the key does not keep either alive.

Q: Which use of `FinalizationRegistry` is appropriate?
- [ ] Closing a database connection when its wrapper object is collected
- [ ] Saving unsaved user data when an editor object is collected
- [x] Logging a warning that a resource was collected without `close()` having been called
- [ ] Decrementing a counter that the UI displays as "open documents"
> Finalizers may run late or never, so nothing required for correctness can depend on them. Connections and user data need explicit, deterministic cleanup, and a UI counter would show wrong values. A diagnostic warning is harmless if it never fires.
```

## In real systems

**Frameworks and reactivity.** Vue 3's reactivity system keeps a module-level `WeakMap` from each raw object to its reactive proxy and another from each target object to its dependency records, so that making an object reactive twice returns the same proxy and discarded objects take their bookkeeping with them ([[b1-proxy]]).

**DOM libraries.** Libraries that attach behaviour to elements store per-element state in a WeakMap keyed by the node, replacing the older practice of writing custom properties onto elements, which risked name clashes and leaks.

**Transpiled private fields.** When TypeScript or Babel compile `#private` fields for targets older than ES2022, the output stores each field in a WeakMap keyed by the instance.

**Deep-clone and serialisation utilities.** A clone function that must handle cycles keeps a map from each original object to its copy; using a WeakMap means the bookkeeping never outlives the objects ([[b1-impl-deep-clone]]).

## Trade-offs and alternatives

| Need | Use |
|---|---|
| Data tied to an object's lifetime, looked up with the object in hand | `WeakMap` |
| Only "have I seen this object?" | [[b1-weakset\|`WeakSet`]] |
| Keys are strings or numbers, or entries must be counted or listed | `Map`, with explicit deletion or a size limit |
| Private state in your own class | `#private` fields |
| A string-keyed cache whose values may be reclaimed | `Map` of `WeakRef`s plus `FinalizationRegistry` |

A WeakMap costs something. Its entries add work to each garbage collection, because ephemerons need the extra marking passes described above, and lookups are a little slower than property access. The identity-only keys mean a cache misses for equal-but-distinct objects. And since you cannot inspect its contents, debugging means using the DevTools memory panel, not `console.log`.

## Common mistakes

**Using primitive keys.** `wm.set(user.id, data)` throws a `TypeError` when the id is a string or number. Key by the object, or use a Map.

**Expecting `size`, iteration or `clear`.** `wm.size` is `undefined`, with no error, and `for...of` over a WeakMap throws. `JSON.stringify(wm)` is `'{}'`.

**Keeping the key alive some other way.** A WeakMap frees nothing if an array, a Map, a closure or a global also references the key. A value that is reachable from elsewhere also stays alive on its own.

**Assuming prompt collection.** Dropping the last reference makes the entry *eligible* for collection; memory may not fall until the engine next collects that part of the heap.

**Using `WeakRef` where a WeakMap fits**, or building logic that requires a finalizer to run.

## Interview perspective

WeakMap is a common follow-up to "Map versus object", and a good way for an interviewer to check that you understand reachability and not only the API.

> [!INTERVIEW] What a strong answer sounds like
> "A Map holds its keys strongly, so using objects as keys keeps them alive as long as the Map lives. A WeakMap holds keys weakly — if the key is unreachable elsewhere, the entry can be collected, value included, even if the value references the key. Because collection timing is unobservable by design, there's no `size` or iteration, and keys have to be objects. I use it for caches and metadata keyed by objects I don't own."

Questions to prepare:

- **Map versus WeakMap.** Key types, strong versus weak keys, enumerability, typical uses.
- **Why can keys not be strings?** A primitive has no identity or lifetime; an equal value can always be recreated, so the entry could never be released.
- **Why is a WeakMap not iterable?** It would expose GC timing and resurrect keys.
- **Are values weak?** No. Values are strong while the key is alive; the entry as a whole is conditional on the key.
- **Give a real use.** Per-element metadata, object-keyed memoisation, private instance data, cycle tracking in deep clone.
- **What are `WeakRef` and `FinalizationRegistry`, and why avoid them?** A handle that may be empty and a best-effort callback after collection; timing is unspecified and callbacks may never run.
- **How would you find a leak caused by a Map?** Take heap snapshots, compare, and follow the retainer chain from the leaked object back to the Map.

## Practice

1. Write `memoizeByObject(fn)` that caches the result of a one-argument function in a WeakMap. What should it do when called with a primitive?
2. Rewrite the `Account` class with a `#balance` field, and list one situation where the WeakMap version is still needed.
3. Run the `weak-vs-strong.mjs` program yourself, then change it so that the keys are also pushed into an array. Explain the new result.
4. Design a cache from URL string to a large parsed document that allows documents to be collected. Say why a WeakMap cannot be used directly and sketch the `Map` plus `WeakRef` version, including how dead entries are removed.
5. Explain why this leaks: `const wm = new WeakMap(); const keys = []; function add(o) { keys.push(o); wm.set(o, compute(o)); }`.

## Quick revision {#quick-revision}

- WeakMap: key-value collection whose keys are held weakly; an entry does not keep its key alive.
- Keys must be objects (or, since ES2023, non-registered symbols); primitives throw a `TypeError`. Values can be anything.
- API is exactly `set`, `get`, `has`, `delete`. No `size`, no iteration, no `keys`/`values`/`entries`, no `clear`.
- The omissions keep garbage-collection timing unobservable and prevent resurrecting collectable keys.
- Entries are ephemerons: the value is live only while the key is live by another path, so a value may reference its key without leaking.
- Uses: metadata on objects you do not own, caches keyed by object identity, private instance data, clone bookkeeping.
- A Map keyed by short-lived objects leaks; a WeakMap does not.
- `WeakRef`: `deref()` returns the object or `undefined`; check every time.
- `FinalizationRegistry`: best-effort callback after collection; may be late or never run; never use it for required cleanup.
- Weak means "may be collected", not "will be collected soon"; tests must not depend on collection.

## Key takeaways {#key-takeaways}

- A strong reference keeps its target alive; a weak one does not, and a WeakMap's keys are weak.
- Use a WeakMap when data belongs to an object and should disappear when the object does.
- You must have the key object in hand to use a WeakMap; if you need to count or list entries, use a Map and manage lifetimes yourself.
- A WeakMap prevents only the leak it would otherwise cause; other strong references to the key still keep it alive.
- `WeakRef` and `FinalizationRegistry` expose collection directly, with no timing guarantees, so correctness must never depend on them.
- Explicit cleanup — `close()`, `delete`, `AbortController` — remains the way to release real resources.
