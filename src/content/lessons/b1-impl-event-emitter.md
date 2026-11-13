---
summary: An event emitter lets one part of a program announce "this happened" while any number of other parts react, without either side knowing about the other. You will build one from scratch — `on`, `off`, `once`, `emit` — and learn the details that separate a toy from a correct implementation, such as snapshotting listeners during `emit`, function identity, error handling and leaks.
difficulty: intermediate
minutes: 40
objectives:
  - Explain the publish/subscribe idea and why emitters decouple code
  - Implement an EventEmitter with on, off, once, emit and listenerCount
  - Explain why emit must iterate a snapshot and demonstrate the bug when it does not
  - Debug listener-removal failures caused by function identity and bind
  - Choose an error-handling policy for listeners and compare with Node's EventEmitter and the DOM's EventTarget
---

## Introduction

A shopping-cart module adds an item. Several other things should happen: the header badge updates, an analytics event is recorded, the "free shipping" banner recalculates. The cart could call each of them directly — `updateBadge(); trackAdd(); recalcBanner();` — but then the cart has to know about every feature that cares about carts, and every new feature means editing the cart.

An **event emitter** turns that around. The cart only *announces* what happened: `cart.emit('add', item)`. Anyone interested has registered beforehand: `cart.on('add', updateBadge)`. The cart does not know who is listening, and listeners do not know about each other. This pattern is called **publish/subscribe** (pub/sub) or the **observer pattern**, and the emitter is the small object in the middle that keeps the lists of subscribers.

You use emitters constantly, often without noticing. Node.js builds streams, HTTP servers, sockets and child processes on its `EventEmitter` class. The browser's `addEventListener` is the same idea under a different API (`EventTarget`). UI frameworks, game engines and WebSocket clients all ship small event buses. Implementing one is a classic interview task because it is short but tests several things at once: choosing data structures, function identity, iteration while a collection changes, `this` binding and error handling.

## Before you start

- **Map** — storing a key-to-value table and why it beats a plain object for arbitrary keys. See [[b1-map]].
- **Classes and private fields** — `class`, methods and `#private` fields. See [[b1-classes]] and [[b1-private-state]].
- **Functions as values and closures** — passing a function to be called later, and a wrapper function that captures variables. See [[b1-callback-concept]] and [[b1-closures]].
- **`this` and `bind`** — how `this` is set for a call and that `bind` returns a new function. See [[b1-this]] and [[b1-bind]].
- **Rest and spread** — `(...args)` and `[...array]`. See [[b1-spread-rest]].

## The intuition

Picture a newsroom with a set of mailing lists, one per topic: "sports", "weather", "elections". Subscribing adds your phone number to a list. When news breaks, the editor **photocopies the current list** and phones every number on the copy, one after another.

Each part of that picture maps to code:

| Newsroom | Emitter |
|---|---|
| Topic name | Event name, such as `'add'` |
| Mailing list | Array of listener functions for that event |
| Subscribe | `on(event, fn)` pushes `fn` onto the array |
| Unsubscribe | `off(event, fn)` removes that exact `fn` |
| Breaking news | `emit(event, ...args)` calls each listener with `args` |
| Photocopy the list first | Iterate a **snapshot**, so people subscribing or leaving mid-call don't confuse the round |

The photocopy detail looks fussy, but it is the part most first implementations get wrong, and the section below shows the exact bug it prevents.

The analogy stops at one point: the editor's calls happen **synchronously**. `emit` does not schedule anything; it calls every listener immediately, in order, and returns only after the last one finishes.

## The data structure

The emitter needs, for each event name, an ordered collection of functions. Order matters because listeners should run in the order they subscribed, and the same function may legitimately be added twice. That rules out a `Set` (unordered in spirit and no duplicates) for a Node-compatible emitter and points to **a `Map` from event name to array**:

```text
#listeners: Map {
  'add'      => [ logAdd, updateBadge, onceWrapper ],
  'checkout' => [ sendReceipt ]
}
```

A `Map` is preferable to a plain object here because event names are arbitrary user-supplied strings (or symbols). On a plain object `{}`, an event called `'constructor'` or `'__proto__'` collides with inherited properties; `Map` has no such keys.

## Building the emitter

Here is a complete implementation. Read it once, then the sections below take each method in turn.

```javascript title="emitter.mjs"
export class EventEmitter {
  #listeners = new Map(); // event name -> array of listener functions

  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    let list = this.#listeners.get(event);
    if (!list) {
      list = [];
      this.#listeners.set(event, list);
    }
    list.push(listener);
    return this; // allow chaining: emitter.on(...).on(...)
  }

  off(event, listener) {
    const list = this.#listeners.get(event);
    if (!list) return this;
    // Search from the end so the most recently added copy is removed, like Node.
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        list.splice(i, 1);
        break;
      }
    }
    if (list.length === 0) this.#listeners.delete(event); // don't keep empty arrays
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper); // remove first, so a re-entrant emit can't call it twice
      listener.apply(this, args);
    };
    wrapper.listener = listener; // lets off(event, listener) find the wrapper
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list) {
      // Node convention: an 'error' nobody listens for must not vanish silently.
      if (event === 'error') {
        throw args[0] instanceof Error ? args[0] : new Error(String(args[0]));
      }
      return false;
    }
    for (const listener of [...list]) { // snapshot: changes during emit don't skip anyone
      listener.apply(this, args);
    }
    return true;
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.length ?? 0;
  }

  removeAllListeners(event) {
    if (event === undefined) this.#listeners.clear();
    else this.#listeners.delete(event);
    return this;
  }
}
```

And a program that exercises it:

```javascript title="cart.mjs"
import { EventEmitter } from './emitter.mjs';

const cart = new EventEmitter();
const logAdd = (item, qty) => console.log(`added ${qty} x ${item}`);

cart.on('add', logAdd);
cart.once('add', (item) => console.log(`first item ever: ${item}`));
cart.on('checkout', function (total) {
  console.log(`checkout ${total}, this is emitter: ${this === cart}`);
});

console.log(cart.emit('add', 'pen', 2));
console.log(cart.emit('add', 'ink', 1));
cart.off('add', logAdd);
console.log(cart.emit('add', 'paper', 5), cart.listenerCount('add'));
cart.emit('checkout', 12.5);
```

```output
added 2 x pen
first item ever: pen
true
added 1 x ink
true
false 0
checkout 12.5, this is emitter: true
```

The first `emit` runs both `'add'` listeners in subscription order and returns `true` because someone was listening. The `once` listener removed itself, so the second `emit` runs only `logAdd`. After `off`, no `'add'` listeners remain, the empty array has been deleted, and `emit` returns `false`. The `'checkout'` listener is a regular `function`, so `listener.apply(this, args)` sets its `this` to the emitter — the same behaviour Node documents. Arrow-function listeners ignore that `this` and keep their surrounding one.

### on: get-or-create, then push

`on` validates its argument early, because a non-function would otherwise fail much later inside `emit`, far from the line that caused it. It then fetches the event's array or creates it, and pushes. Returning `this` enables chaining such as `server.on('request', a).on('close', b)`. Adding is O(1).

### off: remove one, by identity

`off` must remove *the* function that was passed to `on`. JavaScript compares functions by **identity**: two functions are equal only if they are the same object, even if their source text is identical. That is why `off` needs a reference to the original function and why anonymous inline listeners cannot be removed later.

Two design choices are visible. It removes **one** occurrence, not all — if a function was added twice, it was meant to run twice, and one `off` undoes one `on`. It searches **from the end**, matching Node's documented behaviour of removing the most recently added instance. And it deletes the event's key when the array becomes empty, so an emitter that sees thousands of short-lived event names does not keep thousands of empty arrays alive. Removal is O(n) in the number of listeners for that event, which is fine because listener lists are short.

### once: a self-removing wrapper

`once` cannot change the listener the caller passed, so it registers a **wrapper** that removes itself and then calls the original. Two details matter:

- The wrapper removes itself *before* calling the listener. If the listener emits the same event again (re-entrancy), the wrapper is already gone and cannot run twice.
- `wrapper.listener = listener` remembers the original. Without it, a caller who writes `once('close', onClose)` and later `off('close', onClose)` would find nothing, because the array contains `wrapper`, not `onClose`. The check `list[i].listener === listener` in `off` handles this. Node uses the same trick, and exposes the wrappers through `rawListeners()`.

```javascript title="once-off.mjs"
import { EventEmitter } from './emitter.mjs';
const ui = new EventEmitter();
const onClose = () => console.log('should not run');
ui.once('close', onClose);
ui.off('close', onClose);
console.log(ui.emit('close'));
```

```output
false
```

### emit: snapshot, then call

`emit` copies the array with `[...list]` and iterates the copy. The next section shows why. It passes arguments through with rest/spread, calls each listener with the emitter as `this`, and returns whether anyone was listening. A boolean result is cheap to provide and useful: a caller can detect "nobody handled this" and log or fall back.

## Why emit must iterate a snapshot

Here is an emitter that iterates the live array, and a listener that unsubscribes itself — exactly what every `once` listener does:

```javascript title="live-bug.mjs"
class LiveEmitter {
  #listeners = new Map();
  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
  }
  off(event, fn) {
    const list = this.#listeners.get(event);
    if (!list) return;
    const i = list.indexOf(fn);
    if (i !== -1) list.splice(i, 1);
  }
  emit(event, ...args) {
    const list = this.#listeners.get(event) ?? [];
    for (let i = 0; i < list.length; i++) list[i](...args); // iterates the live array
  }
}
const bus = new LiveEmitter();
const first = () => { console.log('first (unsubscribes itself)'); bus.off('save', first); };
bus.on('save', first);
bus.on('save', () => console.log('second'));
bus.on('save', () => console.log('third'));
bus.emit('save');
console.log('--- next emit');
bus.emit('save');
```

```output
first (unsubscribes itself)
third
--- next emit
second
third
```

The second listener was **silently skipped** on the first emit. Trace the index:

| Step | `i` | `list` | Called | Effect |
|---|---|---|---|---|
| 1 | 0 | `[first, second, third]` | `first` | `splice(0, 1)` shifts everything left |
| 2 | 1 | `[second, third]` | `third` | `second` slid into index 0, behind the loop |
| 3 | 2 | `[second, third]` | — | `2 < 2` is false; loop ends |

Removing an element shifts the later elements down by one while the loop counter moves up by one, so the element right after the removed one is jumped over. Adding a listener during `emit` has the opposite problem: the new listener runs in the *current* round, and a listener that re-subscribes itself can loop forever. A `for...of` over the live array behaves the same way, because array iterators read by index.

The real implementation iterates `[...list]`, a copy taken before any listener runs. Running the same scenario against it gives `first`, `second`, `third`, then `second`, `third` — every listener that was subscribed when the event fired gets called exactly once, and changes take effect from the next emit. This is the rule Node's `EventEmitter` documents: listeners added or removed during an emit do not affect that emit.

> [!WARNING] Snapshot cost
> Copying the array on every emit is O(n) extra work and memory per emit. For typical listener counts (a handful) that is negligible. Node avoids even this by copying only when needed; an alternative is copy-on-write, where `on`/`off` replace the array instead of mutating it, so `emit` can iterate whatever array it read at the start.

## emit is synchronous

Developers who know events from the browser sometimes assume `emit` schedules the listeners for later. It does not:

```javascript title="sync-order.mjs"
import { EventEmitter } from './emitter.mjs';
const e = new EventEmitter();
e.on('data', (x) => console.log('listener got', x));
console.log('before emit');
e.emit('data', 42);
console.log('after emit');
```

```output
before emit
listener got 42
after emit
```

Each listener runs to completion inside the `emit` call, on the same stack. That has three consequences. A slow listener blocks the emitter and every listener after it. A listener that throws throws *out of* `emit`, into the code that emitted. And listeners can rely on the emitter's state being exactly what it was at the moment of emitting. If you want deferred delivery, schedule it explicitly — `queueMicrotask(() => e.emit('data', 42))` or `setImmediate` in Node — and see [[b1-event-loop]] for when each one runs.

## Errors in listeners

With the implementation above, an exception in one listener stops the loop: later listeners never run, and the exception propagates to the caller of `emit`. Node's `EventEmitter` behaves the same way. That is a **policy**, not a law, and an interviewer may ask you to choose another. The main options:

1. **Propagate immediately** (Node's behaviour, shown above). Simple and loud; one faulty subscriber can starve the rest.
2. **Isolate and report.** Call every listener, collect failures, and throw them afterwards. This suits buses where subscribers are independent features:

```javascript title="isolate-errors.mjs"
function emitAll(listeners, args) {
  const errors = [];
  for (const listener of [...listeners]) {
    try {
      listener(...args);
    } catch (err) {
      errors.push(err); // keep going: one bad subscriber must not starve the others
    }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, `${errors.length} listeners failed`);
}

const listeners = [
  () => { throw new Error('analytics down'); },
  () => console.log('ui updated'),
  () => { throw new Error('cache down'); },
];
try {
  emitAll(listeners, []);
} catch (err) {
  console.log(err.name, '-', err.message);
  console.log(err.errors.map((e) => e.message));
}
```

```output
ui updated
AggregateError - 2 listeners failed
[ 'analytics down', 'cache down' ]
```

3. **Isolate and swallow**, reporting each error to a logger or rethrowing it asynchronously with `queueMicrotask(() => { throw err; })` so it reaches the global error handler without interrupting the loop. The browser's `dispatchEvent` behaves like this: an exception in one listener is reported, and the remaining listeners still run.

Separately, Node gives the event name `'error'` special meaning: emitting `'error'` when nobody listens for it **throws** the error. The implementation above follows that convention, because an error event that nobody hears is almost always a bug that should crash loudly rather than vanish. If you use an emitter for anything that can fail (a socket, a file stream), always attach an `'error'` listener.

## Function identity and bind

The most common real-world emitter bug is a listener that will not go away:

```javascript title="bind-bug.mjs"
import { EventEmitter } from './emitter.mjs';
class Widget {
  constructor(bus) { this.bus = bus; this.name = 'clock'; }
  mount() { this.bus.on('tick', this.render.bind(this)); }
  unmount() { this.bus.off('tick', this.render.bind(this)); } // a different function!
  render() { console.log(`${this.name} rendered`); }
}
const bus = new EventEmitter();
const w = new Widget(bus);
w.mount();
w.unmount();
console.log(bus.listenerCount('tick'));
console.log(w.render.bind(w) === w.render.bind(w));
```

```output
1
false
```

Every call to `bind` creates a **new** function object. `unmount` passes a function that was never registered, `off` finds nothing, and the widget's listener stays subscribed. Each mount/unmount cycle leaks another listener and keeps the old widget alive in memory, because the bus holds a reference to a function that holds the widget. The fix is to create the bound function once and keep it — `this.onTick = this.render.bind(this)` in the constructor, or a class field `onTick = () => this.render()` — and pass that same reference to both `on` and `off`.

Node helps you notice leaks like this: when more than 10 listeners are added to one event (`EventEmitter.defaultMaxListeners`), it prints a `MaxListenersExceededWarning`. The listeners are still added; the warning only flags a likely leak.

## A variant: on returns an unsubscribe function

Many modern libraries avoid the identity problem entirely by having `on` return a function that undoes the subscription. Redux's `store.subscribe` and many state libraries work this way:

```javascript title="unsubscribe-bus.mjs"
function createBus() {
  const listeners = new Map();
  return {
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => listeners.get(event)?.delete(fn); // the caller keeps this, not fn
    },
    emit(event, payload) {
      for (const fn of [...(listeners.get(event) ?? [])]) fn(payload);
    },
  };
}
const bus = createBus();
const stop = bus.on('theme', (t) => console.log('theme is', t));
bus.emit('theme', 'dark');
stop();
bus.emit('theme', 'light');
console.log('done');
```

```output
theme is dark
done
```

The caller no longer needs to keep the listener itself, so inline arrow functions are fine. This version uses a `Set`, which makes removal O(1) but means the same function cannot be subscribed twice — acceptable for a UI bus, different from Node's semantics. It fits React well: `useEffect(() => bus.on('theme', setTheme), [])` returns the unsubscribe function as the effect's cleanup.

## How it works internally: Node and the DOM

Node's `EventEmitter` (`node:events`) adds features on top of the core you built: `prependListener` to jump the queue, `rawListeners`, the `'newListener'` and `'removeListener'` meta-events, `setMaxListeners`, `captureRejections` for async listeners, and the static helpers `events.once(emitter, name)` (returns a promise) and `events.on` (an async iterator). As a memory optimisation it stores a single listener as a bare function and switches to an array only when a second one is added. Unless asked, do not subclass Node's class in an interview — the exercise is to build the mechanism.

The browser's **`EventTarget`** (`addEventListener`, `removeEventListener`, `dispatchEvent`) solves the same problem with different rules. Adding the same function twice for the same event type and capture flag is ignored rather than duplicated. Events carry an `Event` object, and on DOM nodes they propagate through capture and bubble phases. Options such as `{ once: true }` and `{ signal }` (remove all listeners when an `AbortController` aborts) are built in. Node has also shipped a global `EventTarget` since Node 15. See [[b3-add-event-listener]] and [[b3-custom-events]].

| | Your emitter / Node `EventEmitter` | DOM `EventTarget` |
|---|---|---|
| Subscribe | `on(name, fn)` | `addEventListener(type, fn, options)` |
| Duplicates | Allowed; runs twice | Ignored |
| Payload | Any arguments | One `Event` object |
| Listener throws | Propagates out of `emit` | Reported; other listeners still run |
| `this` in a regular function | The emitter | The `currentTarget` element |
| Propagation | None | Capture and bubble (in the DOM tree) |

## In real systems

**Node.js core.** `http.Server` emits `'request'`, streams emit `'data'`, `'end'` and `'error'`, and child processes emit `'exit'`. Missing an `'error'` listener on a stream is a classic cause of a crashed Node process.

**UI event buses.** Small libraries such as mitt (around 200 bytes) give components a shared bus for cross-cutting events like "user logged out". They are convenient but make data flow hard to trace when overused; state management libraries are usually a better fit for shared state.

**Realtime clients.** WebSocket and Server-Sent Events wrappers expose `client.on('message', ...)` on top of the browser's raw events, adding reconnection and typed message names.

**Domain events.** Back-end code often emits in-process events such as `'order.placed'` so that email, analytics and inventory code can react without the order service importing them. When those reactions must survive a crash, teams move them to a durable message broker; an in-memory emitter loses events if the process dies.

## Trade-offs and alternatives

Emitters **decouple** senders from receivers, which makes adding a new reaction a one-line change. The same property makes them **harder to follow**: reading `emit('add')` does not tell you what will run, in what order, or whether anything will. Event names are strings, so a typo in `emit('ad')` fails silently. TypeScript can type an emitter with an event map (`{ add: [item: string, qty: number] }`) so names and payload types are checked.

Use an emitter when several independent parts react to the same occurrence, or when the producer must not depend on the consumers. Prefer a direct function call when there is exactly one obvious receiver. Prefer promises when there is one result in the future rather than a stream of occurrences. Prefer observables (RxJS) or async iterators when you need to transform, combine or back-pressure streams of events.

## Common mistakes

> [!MISTAKE] Iterating the live listener array in emit
> A listener that calls `off` (including every `once` wrapper) shifts the array and the loop skips the next listener. Iterate a copy, or replace arrays instead of mutating them.

**Removing with a new function.** `off('tick', this.render.bind(this))` or `off('tick', () => ...)` never matches. Store the exact reference you registered, or return an unsubscribe function from `on`.

**`once` that cannot be cancelled.** Without remembering the original on the wrapper, `off(event, original)` does nothing for listeners added with `once`.

**`once` that removes itself after calling.** If the listener emits the same event, the wrapper is still registered and runs again. Remove first, then call.

**Using a plain object as the table.** `listeners['constructor']` exists on `{}` before anyone subscribes, so `emit('constructor')` may try to call `Object`. Use a `Map` or `Object.create(null)`.

**Forgetting to unsubscribe.** Components that subscribe on mount and never unsubscribe leak memory and keep reacting after they are gone. Pair every `on` with an `off`, ideally in the same place in the code.

## Interview perspective

Expect the prompt "Implement an EventEmitter with `on`, `off`, `emit` and `once`". Interviewers then probe the edge cases rather than the happy path.

> [!INTERVIEW] What to say while coding
> "I'll store a `Map` from event name to an array of listeners so order is kept and duplicates are allowed. `emit` iterates a copy of the array, so a listener removing itself — which is what `once` does — can't make me skip the next one. `once` registers a wrapper that removes itself before calling the original, and I store the original on the wrapper so `off` with the original still works. If a listener throws, I'll let it propagate like Node, but I can switch to collecting errors if we want isolation."

Questions you should be ready for:

- **Why copy the array in `emit`?** Removal during iteration shifts indexes and skips listeners; additions would run in the current round. A snapshot fixes both.
- **Why does `off` fail with `bind`?** `bind` returns a new function each call, and removal is by identity.
- **What does `emit` return?** In Node, `true` if the event had listeners, `false` otherwise.
- **Is `emit` asynchronous?** No; listeners run synchronously in subscription order.
- **How would you add wildcard listeners (`'*'`)?** Keep a separate list and call it from `emit` with the event name as the first argument.
- **How would you type it in TypeScript?** A generic `Emitter<Events extends Record<string, unknown[]>>` whose `on<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void)` ties names to payloads.

```quiz
Q: An emitter iterates its live listener array. Listeners A, B and C are subscribed to 'save', and A removes itself when called. What runs on the first emit('save')?
- [ ] A, B, C
- [x] A, C
- [ ] A only
- [ ] B, C
> Removing A shifts B to index 0 and C to index 1, while the loop moves on to index 1, so B is skipped. Iterating a snapshot (a copy of the array) makes the output A, B, C, with the removal taking effect from the next emit.

Q: Why does `bus.off('tick', this.render.bind(this))` fail to remove a listener added with `bus.on('tick', this.render.bind(this))`?
- [ ] `off` only works with arrow functions
- [x] Each `bind` call returns a new function object, and listeners are removed by identity
- [ ] `bind` makes functions non-removable
- [ ] `off` must be called before `emit`
> Functions are compared by reference. Two bind calls produce two distinct functions, so off finds no match. Create the bound function once, store it, and pass the same reference to both on and off.

Q: In Node.js, what happens when you call `emitter.emit('error', err)` and no 'error' listener is registered?
- [ ] Nothing; emit returns false
- [ ] The error is logged as a warning
- [x] `err` is thrown from the `emit` call
- [ ] The process schedules a retry
> Node treats an unhandled 'error' event as fatal by design and throws it, which usually crashes the process if uncaught. That is why every stream or socket should have an 'error' listener.
```

## Practice

1. **`prependListener`.** Add a method that registers a listener at the front of the list.
2. **Wildcard.** Support `on('*', fn)`, where `fn` receives the event name followed by the arguments, and runs after the specific listeners.
3. **Promise-based once.** Write `onceAsync(emitter, event)` returning a promise that resolves with the arguments of the next emit, and rejects if `'error'` fires first.
4. **Isolation option.** Add a constructor option `{ isolateErrors: true }` that runs every listener and throws an `AggregateError` at the end.
5. **Typed emitter.** Port the class to TypeScript with an event map so `emit('add', 'pen')` is a compile error when `'add'` expects `(item: string, qty: number)`.

## Quick revision {#quick-revision}

- Pub/sub: `on` subscribes, `emit` publishes, `off` unsubscribes; producer and consumers don't know each other.
- Storage: `Map<eventName, listener[]>` — ordered, duplicates allowed, no prototype-key collisions.
- `emit` iterates a **copy** of the array; mutating during iteration skips listeners.
- `emit` is synchronous; listeners run in subscription order; return `true` if any listener ran.
- `off` removes one occurrence by **identity**, most recent first in Node; delete empty arrays.
- `once` = wrapper that removes itself *before* calling; store `wrapper.listener = original` so `off(original)` works.
- `bind` and inline arrows create new functions; keep the reference or return an unsubscribe function from `on`.
- Errors: Node propagates the first throw out of `emit`; an unhandled `'error'` event throws. DOM `dispatchEvent` reports errors and keeps going.
- Node warns past 10 listeners per event (`MaxListenersExceededWarning`) to flag leaks.

## Key takeaways {#key-takeaways}

- An event emitter is a map of event names to ordered listener lists plus a loop that calls them.
- Snapshot the list before emitting so subscriptions changing mid-emit cannot skip or add listeners in that round.
- Listener removal works by function identity, which is why `bind` and inline functions cause leaks.
- `once` is a self-removing wrapper that remembers the original function.
- `emit` runs listeners synchronously, so a throwing listener interrupts the rest unless you choose an isolating policy.
- Node's `EventEmitter` and the DOM's `EventTarget` share the idea but differ in duplicates, payloads and error handling — know both.
