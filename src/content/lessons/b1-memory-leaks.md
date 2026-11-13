---
summary: A memory leak in JavaScript is memory the program keeps reachable after it stops needing it. You will learn the handful of patterns that cause almost every leak in browsers and Node — forgotten listeners, timers, unbounded caches, detached DOM and closures — and how to prove and locate a leak with heap snapshots.
difficulty: intermediate
minutes: 50
objectives:
  - Define a memory leak in a garbage-collected language and distinguish it from normal heap growth
  - Identify the common leak patterns (listeners, timers, caches, detached DOM, closures, globals) in real code
  - Fix each pattern by pairing registration with cleanup or by bounding and weakening references
  - Use heap snapshots to confirm a leak, compare snapshots and read the retainer path to its root
  - Explain shallow size, retained size and why a snapshot's retainers view answers "why is this alive?"
---

## Introduction

A user opens your dashboard in the morning and leaves the tab open. Every few minutes they switch between the "Orders" and "Customers" views. By the afternoon the tab is using two gigabytes, scrolling stutters, and eventually the browser shows "Aw, Snap! Out of memory". No error was ever thrown, and every individual screen works perfectly. That is a **memory leak**.

In a garbage-collected language a leak has a precise meaning: **memory that stays reachable even though the program will never use it again**. The garbage collector is doing its job correctly — it only reclaims unreachable objects, as [[b1-garbage-collection]] explains — but some reference the programmer forgot about keeps a path open from a root to data that is no longer needed. Each time the leaking action repeats, more data is stranded, so leaks show up as memory that grows with *use* rather than with *time alone*.

Leaks matter most in long-running programs: single-page applications that never reload, Electron apps, and Node servers that run for weeks. This lesson walks through the patterns that cause nearly all of them, shows a fix for each, and then teaches the tool that turns "I think it leaks" into a diagnosis: the heap snapshot.

## Before you start

- **Reachability and roots**, especially host roots such as listeners and timers. See [[b1-reachability]].
- **Closures** and how they keep captured variables alive. See [[b1-closures]] and [[b1-closure-memory]].
- **Timers and events** — `setTimeout`, `setInterval`, `addEventListener`. See [[b1-setinterval]] and [[b3-add-event-listener]].
- **`Map` and `WeakMap`.** See [[b1-map]] and [[b1-weakmap]].

Node examples use `--expose-gc` to force collections so that measurements are stable. Browser examples need a page and were not run here; their behaviour is described from the DOM and DevTools documentation.

## The intuition

Think of every object as a helium balloon. As long as a string ties it to something fixed, it stays; cut every string and it floats away (the collector reclaims it). A leak is a balloon you forgot was tied to a fence post you never look at: the global listener list, the browser's timer table, a cache at the top of a module. You can stare at the balloon all day and see nothing wrong with it. The fix is always to find the post and untie the string — or never to tie it to a permanent post in the first place.

## Leak or normal growth?

Not every rising memory graph is a leak. The heap of a healthy program forms a **sawtooth**: memory rises as objects are allocated, then drops when a collection reclaims the dead ones. Memory also rises legitimately during warm-up, as caches fill, code is compiled and the engine sizes its heap regions. What distinguishes a leak is that **the memory left after each full collection keeps rising as you repeat the same action**. If opening and closing a modal ten times leaves the post-collection baseline higher by roughly the same amount each time, something from each modal is being kept.

That gives you the core experiment for any suspected leak: perform an action, return to the starting state, force a collection, measure, and repeat. Growth that is proportional to the number of repetitions is a leak.

## Pattern 1: listeners that are never removed

Registering a listener adds your function to a list owned by the target: a DOM element, `window`, `document`, a Node `EventEmitter`, a WebSocket, a store. If the target lives longer than the code that registered the listener, the listener — and everything its closure captures — lives that long too.

Node's `EventEmitter` even warns about it. This program "mounts" a widget eleven times, each adding a listener to a process-wide event bus and never removing it.

```javascript title="emitter-leak.mjs"
import { EventEmitter } from 'node:events';

const bus = new EventEmitter();          // lives for the whole process

function mountWidget(id) {
  const buffer = new Array(100_000).fill(id);   // per-widget state
  bus.on('refresh', () => buffer.length);       // never removed
}

for (let id = 1; id <= 11; id++) mountWidget(id);   // "navigate" 11 times
console.log('listeners:', bus.listenerCount('refresh'));
```

```output
listeners: 11
(node:1234) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 refresh listeners added to [EventEmitter]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
```

Every listener keeps its own `buffer` of 100,000 elements alive through its closure. The warning appears when an emitter gains more than ten listeners for one event; it is a heuristic, not a limit, and raising it with `setMaxListeners` silences the symptom without fixing anything. The fix is to remove the listener when the widget goes away:

```javascript title="emitter-fixed.mjs"
// Replaces mountWidget in emitter-leak.mjs; `bus` is the same emitter.
function mountWidget(id) {
  const buffer = new Array(100_000).fill(id);
  const onRefresh = () => buffer.length;
  bus.on('refresh', onRefresh);
  return () => bus.off('refresh', onRefresh);   // the unmount function
}
```

### Removing requires the same function

`removeEventListener` and `off` find the listener by **identity**: you must pass the very same function object you registered. A new arrow function that looks identical is a different object, so nothing is removed and no error is reported.

```javascript title="remove-listener.mjs"
const button = new EventTarget();

button.addEventListener('click', () => console.log('A'));
button.removeEventListener('click', () => console.log('A'));   // different function

const onClick = () => console.log('B');
button.addEventListener('click', onClick);
button.removeEventListener('click', onClick);                 // same function

button.dispatchEvent(new Event('click'));
```

```output
A
```

Listener `A` survived the attempted removal; listener `B` was removed. The same trap catches `element.addEventListener('scroll', this.onScroll.bind(this))`: `bind` returns a new function each time, so store the bound function once and reuse it. Modern code can avoid the bookkeeping by passing an `AbortSignal`: every listener registered with `{ signal }` is removed when the controller aborts.

```javascript title="abort-listeners.js"
const controller = new AbortController();
window.addEventListener('resize', onResize, { signal: controller.signal });
document.addEventListener('keydown', onKey, { signal: controller.signal });

// Later, when the view is destroyed: removes both listeners at once
controller.abort();
```

This runs in any current browser (the `signal` option has been supported in all major browsers since 2021). See [[b1-abort-controller-js]] for the rest of the `AbortController` API.

> [!TIP] Write cleanup next to registration
> The most reliable habit is to write the removal on the line after the registration — returning it from a mount function, or from a React effect as described in [[b4-effect-cleanup]]. Cleanup written far away is cleanup that gets forgotten.

## Pattern 2: timers that keep running

A pending `setTimeout` or a running `setInterval` is held by the environment's timer table, which is a root. The callback and its closure stay reachable until the timeout fires or the interval is cleared. A one-off `setTimeout` releases its callback after it runs; an interval never does on its own.

```javascript title="interval-leak.mjs"
// Run with: node --expose-gc interval-leak.mjs
async function collect() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  globalThis.gc();
}

function startPolling() {
  const history = new Array(1_000_000).fill(0);      // state the poller uses
  const historyRef = new WeakRef(history);
  const id = setInterval(() => history.length, 1_000);
  return { id, historyRef };
}

const { id, historyRef } = startPolling();
await collect();
console.log('interval running: ', historyRef.deref() !== undefined);

clearInterval(id);
await collect();
console.log('interval cleared: ', historyRef.deref() !== undefined);
```

```output
interval running:  true
interval cleared:  false
```

The `WeakRef` lets us check whether `history` still exists without keeping it alive. While the interval runs, the path *timer table → callback → closure → history* holds the array, even though no variable in our code refers to `history` after `startPolling` returns. `clearInterval` removes the timer from the table, and the next collection reclaims everything. In a page, a polling interval started by a view and never cleared also keeps doing network requests for a view the user left long ago, so the leak often comes with wasted work and bugs from stale callbacks.

The same reasoning applies to `requestAnimationFrame` loops that reschedule themselves, `MutationObserver`, `ResizeObserver` and `IntersectionObserver` instances that are never `disconnect()`ed, open WebSocket or `EventSource` connections, and subscriptions to stores or RxJS observables.

## Pattern 3: caches and collections that only grow

A `Map`, array or plain object at module level is reachable for the life of the program, and so is everything stored in it. Caches are the classic case: something is computed once and stored "to be fast next time", with no rule for ever removing it. When keys keep changing — user ids, URLs, search queries, request ids — the cache grows without bound.

```javascript title="cache-leak.mjs"
// Run with: node --expose-gc cache-leak.mjs
const mb = () => (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0);

const cache = new Map();                    // module-level: lives forever
function renderProfile(userId) {
  if (!cache.has(userId)) {
    cache.set(userId, { userId, rows: new Array(1_000).fill(0) });
  }
  return cache.get(userId).rows;
}

for (let round = 1; round <= 3; round++) {
  for (let i = 0; i < 5_000; i++) renderProfile(`${round}-${i}`);   // always new ids
  globalThis.gc();
  console.log(`round ${round}: ${cache.size} entries, ${mb()} MB used`);
}
```

```output
round 1: 5000 entries, 42 MB used
round 2: 10000 entries, 81 MB used
round 3: 15000 entries, 120 MB used
```

Even after a full collection, every round adds about 40 MB, because every entry is reachable through `cache`. This is the "baseline grows with repetitions" signature from earlier. There are two standard fixes, and which one fits depends on what should decide an entry's lifetime.

**If the cache should have a size limit**, evict entries. A least-recently-used (LRU) cache is easy to build on `Map`, because a `Map` iterates in insertion order: re-inserting a key on every access moves it to the end, so the first key is always the least recently used.

```javascript title="bounded-cache.mjs"
// Run with: node --expose-gc bounded-cache.mjs
const mb = () => (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0);

class LruCache {
  #max;
  #map = new Map();                 // Map keeps insertion order
  constructor(max) { this.#max = max; }
  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);          // move to the "most recent" end
    this.#map.set(key, value);
    return value;
  }
  set(key, value) {
    this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#max) {
      const oldest = this.#map.keys().next().value;
      this.#map.delete(oldest);     // evict least recently used
    }
  }
  get size() { return this.#map.size; }
}

const cache = new LruCache(1_000);
function renderProfile(userId) {
  let entry = cache.get(userId);
  if (!entry) {
    entry = { userId, rows: new Array(1_000).fill(0) };
    cache.set(userId, entry);
  }
  return entry.rows;
}

for (let round = 1; round <= 3; round++) {
  for (let i = 0; i < 5_000; i++) renderProfile(`${round}-${i}`);
  globalThis.gc();
  console.log(`round ${round}: ${cache.size} entries, ${mb()} MB used`);
}
```

```output
round 1: 1000 entries, 11 MB used
round 2: 1000 entries, 11 MB used
round 3: 1000 entries, 11 MB used
```

Memory is now flat: at most 1,000 entries are reachable, whatever the input. [[b1-impl-lru]] builds an LRU cache step by step.

**If an entry should live exactly as long as some object**, key the cache by that object in a `WeakMap`. For example, caching a computed layout per DOM node in a `WeakMap` means the entry becomes collectable when the node does. A `WeakMap` cannot help when the keys are strings or numbers, because primitives cannot be weak keys.

A related leak is a `Map` keyed by objects that are otherwise dead. `const seen = new Map(); seen.set(request, Date.now())` keeps every `request` alive forever, because the `Map` key is itself a strong reference. The same code with `WeakMap` does not leak.

## Pattern 4: detached DOM nodes

A DOM node removed from the document is **detached**. If nothing references it, it and its whole subtree are collected. If JavaScript still holds a reference — in a variable, an array of "rows", a closure, a component instance — the node stays in memory, and because every node references its parent and children, a reference to one detached node can keep an entire removed subtree alive.

```javascript title="detached-dom.js"
const rows = [];                       // module-level, lives with the page

function renderTable(data) {
  const table = document.querySelector('#orders');
  table.replaceChildren();             // removes old rows from the document
  for (const item of data) {
    const tr = document.createElement('tr');
    tr.textContent = item.name;
    table.append(tr);
    rows.push(tr);                     // but they are still referenced here
  }
}
```

This needs a page with a `#orders` table, so it was not run here. Each call removes the previous rows from the document and appends new ones, but `rows` keeps every row ever created, so detached `tr` elements accumulate. The fix is to reset the array (`rows.length = 0`) when the old rows are removed, or better, not to keep a second list of nodes the DOM already tracks. In a heap snapshot, such nodes appear under names beginning with `Detached`, which makes this pattern one of the easiest to find.

## Pattern 5: closures that capture more than they need

A closure keeps its captured variables alive as long as the function is reachable. That is usually what you want, but long-lived callbacks — listeners, timers, cached functions — can unintentionally keep large data alive.

```javascript title="closure-capture.js"
function attachExport(button, report) {
  // report.rows may be tens of megabytes
  button.addEventListener('click', () => {
    download(report.title + '.csv');   // only needs the title
  });
}
```

The listener needs only `report.title`, but it captures `report`, so the whole report and its rows live as long as the button's listener. Copy what you need into a local first (`const title = report.title;`) and capture that. In V8, closures created in the same function share one context object for captured variables, so if *any* closure in a scope captures a large variable, every closure from that scope can keep it alive. [[b1-closure-memory]] examines this in detail. Closures are not inherently leaky; the problem is a long-lived closure plus a large capture.

## Pattern 6: accidental globals and logging

In non-strict scripts, assigning to an undeclared variable creates a property on the global object, which lives as long as the page:

```javascript title="accidental-global.js"
function loadOrders() {
  orders = fetchAllOrders();   // missing const: creates window.orders in sloppy mode
}
```

Modules and classes are always strict, and strict mode throws a `ReferenceError` instead, which is one more reason to use them. Deliberate globals (`window.__debug = hugeState`) have the same effect.

Logging is a subtler retainer. When DevTools is open, objects passed to `console.log` are kept so that you can expand them in the console later. During a leak investigation this can make an object look leaked when the console is the only retainer, so clear the console (or avoid logging the suspect objects) before taking measurements.

## Fixing leaks in components

UI frameworks give every subscription a natural home: the component's lifetime. In React, an effect returns a cleanup function that runs when the component unmounts or before the effect re-runs:

```javascript title="useWindowWidth.js"
import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);   // cleanup
  }, []);
  return width;
}
```

This hook requires React 19 (or any version with hooks) in a browser and was not run here. Without the cleanup line, every mount of a component using this hook would leave one more listener on `window`, each holding a `setWidth` for a component that no longer exists. Vue's `onUnmounted`, Angular's `ngOnDestroy` and Svelte's `onDestroy` play the same role.

## Heap snapshots {#b1-heap-snapshots}

A **heap snapshot** is a complete record of the JavaScript heap at one moment: every object, its size, and every reference between objects. It turns a vague suspicion ("memory seems to grow") into concrete evidence — *which* objects are accumulating and *what path from a root* keeps them alive. Chrome, Edge and other Chromium browsers take snapshots from the DevTools **Memory** panel; Node can write them to a `.heapsnapshot` file that the same DevTools UI opens. Firefox and Safari have their own memory tools with similar ideas.

### What a snapshot contains

A snapshot is the object graph itself. Each node is an object (or an internal engine structure) with a constructor name, a **shallow size** and an id; each edge is a reference with a name, such as a property name or a closure variable name. DevTools forces a garbage collection before writing a snapshot, so what you see is what was still reachable.

Two size measures matter:

- **Shallow size** is the memory held by the object itself — its own fields, not the things it points to. A `Map` object has a small shallow size even if it holds gigabytes.
- **Retained size** is the memory that would be freed if this object were deleted, including everything reachable *only* through it. A cache `Map` with a small shallow size and a huge retained size is a strong suspect.

Retained size is computed from the **dominator tree**: object A dominates object B if every path from the roots to B goes through A. Everything A dominates would die with it, so the retained size of A is its shallow size plus the shallow sizes of everything it dominates.

### Snapshots are data you can inspect

The `.heapsnapshot` format is plain JSON describing that graph, which a short Node program can demonstrate. This one creates widgets that are accidentally kept in an array, takes a snapshot, repeats the action, takes another, and counts `Widget` objects in each.

```javascript title="count-widgets.mjs"
import { writeHeapSnapshot } from 'node:v8';
import { readFileSync, rmSync } from 'node:fs';

class Widget {
  constructor() { this.rows = new Array(1_000).fill(0); }
}
const registry = [];                             // the accidental retainer
const mount = () => registry.push(new Widget());

// Count objects whose constructor name is `name` in a .heapsnapshot file.
function countInstances(file, name) {
  const snap = JSON.parse(readFileSync(file, 'utf8'));
  const fields = snap.snapshot.meta.node_fields;  // e.g. type, name, id, ...
  const nameIdx = fields.indexOf('name');
  const typeIdx = fields.indexOf('type');
  const objectType = snap.snapshot.meta.node_types[0].indexOf('object');
  let count = 0;
  for (let i = 0; i < snap.nodes.length; i += fields.length) {
    if (snap.nodes[i + typeIdx] === objectType &&
        snap.strings[snap.nodes[i + nameIdx]] === name) count++;
  }
  rmSync(file);
  return count;
}

for (let i = 0; i < 5; i++) mount();
const first = countInstances(writeHeapSnapshot(), 'Widget');
for (let i = 0; i < 5; i++) mount();               // repeat the same action
const second = countInstances(writeHeapSnapshot(), 'Widget');
console.log({ first, second, grew: second - first });
```

```output
{ first: 5, second: 10, grew: 5 }
```

`writeHeapSnapshot()` writes a file in the current directory and returns its name. The snapshot stores nodes in one flat array of numbers, with `node_fields` describing what each position means and names stored once in a `strings` table, which keeps multi-hundred-megabyte heaps manageable. The result is the snapshot-comparison technique in miniature: repeating the action five times added exactly five `Widget` objects that were never released. In practice you let DevTools do this counting for you.

### The three-snapshot workflow

To find a leak in a page (the steps below describe Chrome DevTools; they were not run as part of this lesson):

1. **Warm up.** Load the page and perform the suspect action once, so that one-time allocations — compiled code, lazy-loaded modules, caches that fill once — are out of the way.
2. **Snapshot 1.** In the Memory panel, choose *Heap snapshot* and take one.
3. **Repeat the action several times**, returning to the same starting state each time (open and close the modal five times, navigate away and back five times).
4. **Snapshot 2.** Take another.
5. **Compare.** Select snapshot 2 and switch the view from *Summary* to *Comparison* against snapshot 1. Sort by *# Delta* or *Size Delta*. Constructors whose count grew by a multiple of your repetitions — five more `ModalController`, fifty more `Detached <div>` — are the leak candidates.
6. **Read the retainers.** Click one leaked instance. The *Retainers* pane at the bottom shows the chain of references keeping it alive, from the object back towards a root, such as `ModalController` ← `context` of `onKeyDown` ← listener list of `Document` ← `Window`. The first link in that chain that you did not intend to exist is the bug.

A third snapshot after more repetitions helps separate leaks from caches that grow once and then stop.

### Views and filters worth knowing

The *Summary* view groups objects by constructor name, which is why giving your classes real names (rather than anonymous objects) makes snapshots much easier to read. The class filter accepts text: typing `Detached` lists DOM nodes that are no longer in the document but still reachable. The *Containment* view lets you walk down from the roots, and the *Statistics* view shows the heap split by type.

Besides snapshots, the Memory panel offers *Allocation instrumentation on timeline*, which records allocations over time and shows which ones are still alive at the end (blue bars that stay blue), and *Allocation sampling*, a low-overhead profile of which functions allocate the most. The *Performance* panel's memory checkbox shows the heap graph over a recording, which is the quickest way to see the rising-baseline shape before you start digging.

### Snapshots in Node

Node offers three ways to get a snapshot: call `v8.writeHeapSnapshot()` from code, start the process with `--heapsnapshot-signal=SIGUSR2` and send that signal to a running server, or use `--heapsnapshot-near-heap-limit=<count>` so Node writes snapshots automatically as it approaches an out-of-memory crash. You can also attach Chrome DevTools to a process started with `--inspect` and use the Memory panel directly.

> [!WARNING] Snapshots are expensive
> Writing a snapshot pauses the JavaScript thread for the whole operation and can temporarily need memory comparable to the heap size. On a production server under load, that pause can trip health checks and the extra memory can itself cause an out-of-memory kill. Take snapshots from a single instance taken out of rotation, or reproduce the leak elsewhere.

### Common snapshot pitfalls

Your own investigation can create retainers. Objects logged to the DevTools console, selected in the Elements panel (`$0`), or stored in console variables are kept alive by DevTools itself, so they appear "leaked". Clear the console and deselect elements before taking snapshots. Also expect noise from browser extensions and from DevTools' own objects; an incognito window without extensions gives cleaner results.

## In real systems

Teams find leaks in three ways. **Monitoring** notices that heap usage of a Node service, after each major collection, rises steadily between deploys, or that a container is periodically killed for exceeding its memory limit. **User reports** describe tabs that slow down after long use. **Tests** catch them before release: tools such as Meta's open-source MemLab drive a page through an action repeatedly with a headless browser and diff heap snapshots automatically, and some teams add a simple Node test that runs an operation many times with `--expose-gc` and fails if `heapUsed` grows beyond a threshold.

Once found, the fix is nearly always one of the patterns in this lesson. The hard part is the search, which is why disciplined habits — cleanup next to registration, bounded caches, `AbortSignal` for groups of listeners — pay off.

## Trade-offs and alternatives

| Fix | Use when | Cost or limit |
|---|---|---|
| Explicit cleanup (`removeEventListener`, `clearInterval`, `disconnect`, `unsubscribe`) | Anything registered with a longer-lived target | Must be remembered everywhere; easy to miss one path (error, early return) |
| `AbortSignal` for listeners | Several listeners share a lifetime | Supported for DOM listeners and some APIs, not every library |
| Bounded cache (LRU, TTL) | Keys are primitives or lifetime is unrelated to any object | Eviction policy to choose; cache misses after eviction |
| `WeakMap` / `WeakSet` | Data belongs to an object you do not own | Keys must be objects; no iteration or size |
| `WeakRef` | Optional cache of large objects | Non-deterministic; more complex code |

## Common mistakes

**Raising `setMaxListeners` to make the warning go away.** The warning exists because listeners are being added and not removed. Fix the missing `off`, and raise the limit only if you genuinely need many listeners on one emitter.

**Removing a listener with a new function.** Inline arrows and `bind` create new function objects; removal silently does nothing. Keep a reference to the exact function you registered.

**Measuring without forcing a collection.** Heap size before a collection includes garbage that simply has not been reclaimed yet. Compare measurements taken after a full collection, or use snapshots (which collect first).

**Mistaking a warm-up or a cache for a leak.** Memory that rises once and then stays flat is usually a cache filling or code being compiled. A leak keeps rising with every repetition.

**Treating closures as the cause.** Closures keep what they capture, which is normal. The real cause is a long-lived reference to the closure, such as a listener or timer.

## Interview perspective

**"What causes memory leaks in JavaScript if it has a garbage collector?"** References that keep unneeded objects reachable: forgotten listeners and timers, unbounded caches and module-level collections, detached DOM nodes held by JavaScript, long-lived closures capturing large data, accidental globals. Emphasise that the collector works correctly; the leak is in the program's references.

**"How would you find a leak in a single-page app?"** Describe the workflow: reproduce with a repeatable action, take a heap snapshot, repeat the action several times, take another, use the comparison view to see which constructors grow, and read the retainer path of a leaked instance to the root. Mentioning the `Detached` filter and retained size shows real experience.

**"How do you prevent leaks in React components?"** Return cleanup functions from effects for every subscription, interval and listener; cancel in-flight requests with `AbortController`; avoid storing component data in module-level variables.

**Follow-up: "What is the difference between shallow and retained size?"** Shallow is the object's own memory; retained is everything that would be freed with it, computed from the dominator tree.

## Practice

1. Rewrite `renderTable` from Pattern 4 so that it cannot leak detached rows, and explain why your version is safe.
2. Write a Node test that calls a function 1,000 times, forces collection with `--expose-gc`, and fails if `heapUsed` grew by more than 5 MB. Use it to catch the `cache-leak.mjs` bug.
3. Convert a component that registers `resize`, `scroll` and `keydown` listeners to use a single `AbortController` for cleanup.
4. Modify `count-widgets.mjs` so that `mount` returns an unmount function, call it for every widget, and check that the second count no longer grows.
5. In Chrome, build a page that leaks detached `<div>` elements on a button click. Use the three-snapshot workflow to find them and write down the retainer chain you see.

## Quick revision {#quick-revision}

- Leak = memory kept reachable after the program stops needing it. The GC is not at fault.
- Signature: the post-collection baseline rises with each repetition of an action.
- Listeners: remove with the same function identity; use `{ signal }` + `AbortController` for groups; `MaxListenersExceededWarning` signals missing `off`.
- Timers and observers: `clearInterval`, cancel animation frames, `disconnect()` observers.
- Caches: bound them (LRU/TTL) or key by object in a `WeakMap`; a `Map` key is a strong reference.
- Detached DOM: removed nodes kept by JavaScript references; look for `Detached` in snapshots.
- Closures: long-lived callbacks retain all captured data; capture only what you need.
- Accidental globals and DevTools console logging also retain objects.
- Heap snapshot: object graph after a forced GC. Shallow size = own memory; retained size = what would be freed (dominator tree).
- Workflow: warm up → snapshot → repeat action N times → snapshot → Comparison view → Retainers path to root.
- Node: `v8.writeHeapSnapshot()`, `--heapsnapshot-signal`, `--heapsnapshot-near-heap-limit`; snapshots pause the process.

## Key takeaways {#key-takeaways}

- In JavaScript, every leak is an unintended path from a root to data you no longer need.
- Most leaks come from a few patterns: listeners, timers, unbounded caches, detached DOM and long-lived closures.
- Pair every registration with its cleanup, ideally in the same place, and bound every collection that can grow.
- Prove a leak by repeating an action and watching the post-collection baseline, not by eyeballing a rising graph.
- Heap snapshots show what is accumulating, and the retainers view shows exactly which reference to break.

```quiz
Q: A page's memory rises during the first minute of use and then stays flat no matter how long you keep using it. What is the most likely explanation?
- [ ] A memory leak in an event listener
- [x] Normal warm-up such as caches filling and code being compiled
- [ ] The garbage collector has stopped running
- [ ] Detached DOM nodes accumulating
> A leak grows with every repetition of the leaking action. Memory that rises once and then plateaus is the signature of one-time allocations. If the collector had stopped, memory would keep rising, and detached nodes accumulating would also produce continued growth.
```

```quiz
Q: Why does `el.removeEventListener('click', () => save())` fail to remove a listener added with `el.addEventListener('click', () => save())`?
- [ ] Arrow functions cannot be used as event listeners
- [ ] The listener must be removed before the element is detached
- [x] Each arrow expression creates a new function object, and removal matches by identity
- [ ] `removeEventListener` requires the `{ once: true }` option
> Listeners are looked up by the exact function object. Two arrow expressions with the same body are different objects, so nothing matches and nothing is removed, silently. Store the function in a variable, or use an `AbortSignal`.
```

```quiz
Q: In a heap snapshot, a cache `Map` has a shallow size of 80 bytes and a retained size of 300 MB. What does that tell you?
- [ ] The snapshot is corrupted, because sizes should match
- [x] The Map itself is small, but 300 MB of objects would be freed if it were released, so it is the likely retainer
- [ ] The Map uses 300 MB of memory for its own internal fields
- [ ] The 300 MB is garbage waiting to be collected
> Shallow size counts only the object's own memory; retained size counts everything that is reachable only through it. A small object retaining a huge amount is exactly what a leaking cache looks like. Snapshots are taken after a collection, so the retained memory is reachable, not garbage.
```

```quiz
Q: What is the best first step when DevTools shows a leaked object in a snapshot comparison?
- [ ] Increase the heap limit
- [ ] Set every variable in the file to `null`
- [x] Select an instance and read its retainers chain back towards a root to find the unintended reference
- [ ] Call `gc()` more often
> The retainers chain names each reference that keeps the object alive, so you can find the one that should not exist and remove it. A larger heap only delays the crash, blanket nulling is guesswork, and forcing collections cannot reclaim reachable objects.
```
