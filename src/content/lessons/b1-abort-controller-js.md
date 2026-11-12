---
summary: Promises cannot be cancelled, so JavaScript platforms provide a separate cancellation token, AbortController and its AbortSignal. You will learn how the pair works, how to pass a signal through async code, how to make your own functions cancellable, and how timeouts and combined signals are built on the same mechanism.
difficulty: intermediate
minutes: 40
objectives:
  - Explain why Promises have no cancel method and how AbortController separates "who may cancel" from "who must stop"
  - Use abort reasons, signal.aborted, throwIfAborted and the abort event correctly
  - Write a cancellable async function that cleans up its listeners and timers
  - Combine signals with AbortSignal.timeout and AbortSignal.any
  - Distinguish a cancellation from a real failure in error handling
---

## Introduction

A user types into a search box, and every keystroke starts a request. They navigate away from a page while it is still loading. A background job is told to shut down. In each case some async work has become pointless, and you want it to stop: stop the network transfer, stop the timer, stop the next step from running, and do not update state that no longer matters.

Promises offer no way to do this. A Promise represents a *result*, and anyone holding it can only wait for it; there is no `promise.cancel()`. This was deliberate — a Promise can be shared by many consumers, and letting any one of them cancel the work for all the others would be dangerous — but it leaves a gap. **AbortController** fills it. It is a small, standard object that produces a **cancellation token** called an **AbortSignal**. You pass the signal to the work; you keep the controller; calling `controller.abort()` tells everything that holds the signal to stop.

AbortController is not part of the ECMAScript language specification. It is defined in the WHATWG DOM Standard and implemented by every modern browser, Node (stable since 15.4), Deno and Bun, so in practice it is the language's cancellation mechanism. This lesson covers the signal as a general token. How `fetch` in particular reacts to it — aborting the HTTP transfer, the response body stream and so on — is covered in [[b3-fetch]] and [[b3-abort-fetch]].

## Before you start

- **async/await and Promises** — awaiting, rejections and try/catch. See [[b1-async-await]].
- **Events** — `addEventListener` and the idea of an object that dispatches named events. AbortSignal is an `EventTarget`.
- **Async control flow** — how steps are sequenced and joined, so you can see where a signal must be passed. See [[b1-async-control-flow]].

Runnable examples are ES modules run with Node 22. Browser-only behaviour is described from the specifications and was not run.

## The intuition: a shared tripwire

Picture a wire strung through a building, with a handle at one end. Every worker who might need to stop holds a loop of the wire. Pull the handle once, and every worker feels the tug at the same moment and stops what they are doing. Pulling it a second time does nothing — the wire is already pulled.

The handle is the **controller**; the wire is the **signal**. Two properties of the design follow from that picture:

- **Separation of power.** Holding the wire lets you *notice* that it was pulled; only the holder of the handle can *pull* it. Code that receives a signal can stop but cannot cancel anything for others.
- **Cooperation.** The wire does not physically stop anyone. A worker who never checks the wire keeps going. Cancellation in JavaScript is always **cooperative**: an operation stops only if it was written to watch its signal.

## The two objects

```javascript title="basics.mjs"
const controller = new AbortController();
const { signal } = controller;

console.log('aborted?', signal.aborted, '| reason:', signal.reason);

signal.addEventListener('abort', () => {
  console.log('abort event, reason:', signal.reason.message);
});

controller.abort(new Error('user navigated away'));
console.log('aborted?', signal.aborted);

controller.abort(new Error('second call')); // no effect: abort happens once
console.log('reason is still:', signal.reason.message);
```

```output
aborted? false | reason: undefined
abort event, reason: user navigated away
aborted? true
reason is still: user navigated away
```

The **controller** has one property and one method: `controller.signal` and `controller.abort(reason)`. The **signal** has:

| Member | Meaning |
|---|---|
| `signal.aborted` | `false` until abort is called, then `true` forever |
| `signal.reason` | `undefined` until aborted; then the reason passed to `abort()` |
| `signal.throwIfAborted()` | throws `signal.reason` if aborted, otherwise does nothing |
| `'abort'` event / `signal.onabort` | fired once, synchronously, inside the `abort()` call |

Several details are visible in the output. The abort event's listeners run **synchronously during `abort()`** — the log line from the listener appears before `abort()` returns. Abort is **one-way and happens once**: a second `abort()` neither changes the reason nor fires the event again. A controller that has been aborted cannot be reset; create a new one for the next operation.

### The reason

If you call `abort()` with no argument, the reason is a `DOMException` whose `name` is `"AbortError"`. You can pass anything as the reason, but an `Error` (or `DOMException`) is best, because it carries a stack trace and works with `instanceof Error` checks:

```javascript title="reasons.mjs"
const a = new AbortController();
a.abort();
console.log(a.signal.reason instanceof DOMException, a.signal.reason.name);

const b = new AbortController();
b.abort(new Error('search superseded'));
try {
  b.signal.throwIfAborted();
} catch (err) {
  console.log('thrown:', err.message);
}
```

```output
true AbortError
thrown: search superseded
```

Platform APIs that accept a signal reject with the reason when they are aborted, but the exact shape differs slightly. According to the Fetch Standard, `fetch` rejects with `signal.reason` itself — a `DOMException` named `AbortError` by default. Node's own APIs (such as `fs.readFile` or `timers/promises`) reject with their own `AbortError` whose `cause` property holds your reason. Checking `err.name === 'AbortError'` therefore works for both when no custom reason is used; with custom reasons, check the reason you supplied (or compare against `signal.reason`).

## Passing a signal to work that understands it

Most modern async APIs take a signal in an options object. When the signal aborts, they stop their work and reject. Here Node's promise-based `setTimeout` plays the role of a slow operation:

```javascript title="platform-api.mjs"
import { setTimeout as sleep } from 'node:timers/promises';

const controller = new AbortController();
const work = sleep(5_000, 'finished', { signal: controller.signal });

setTimeout(() => controller.abort(), 50); // give up after 50 ms

try {
  console.log(await work);
} catch (err) {
  console.log('stopped early:', err.name);
}
```

```output
stopped early: AbortError
```

The five-second timer was cleared, not merely ignored: the program exits right after printing, because no pending timer keeps Node alive. That is the difference between real cancellation and only stopping waiting.

APIs that accept a signal include `fetch` (browser and Node 18+), `addEventListener` (the `signal` option removes the listener), Node's `fs`, `child_process`, `events.once`, `readline` and `stream.pipeline`, and the browser's `ReadableStream` piping, Web Locks and many third-party libraries (axios, the AWS SDK v3, database drivers). When you design a function that does async work, accept a `signal` option too, so callers can cancel it the same way.

### Removing event listeners with a signal

The `signal` option to `addEventListener` is a neat use of the same object: aborting removes the listener, which makes cleanup of several listeners a single call.

```javascript title="listener-signal.mjs"
const target = new EventTarget(); // a DOM element behaves the same way
const controller = new AbortController();

target.addEventListener('ping', () => console.log('ping handled'), { signal: controller.signal });
target.addEventListener('pong', () => console.log('pong handled'), { signal: controller.signal });

target.dispatchEvent(new Event('ping'));
controller.abort(); // removes both listeners at once
target.dispatchEvent(new Event('ping'));
target.dispatchEvent(new Event('pong'));
console.log('no handlers ran after abort');
```

```output
ping handled
no handlers ran after abort
```

In a UI component, registering all of its `window` and `document` listeners with one controller's signal and aborting it on unmount removes them all without keeping references to each handler.

## Making your own functions cancellable

When an API does not know about signals — a hand-written Promise, a library without signal support, a multi-step workflow — you write the cancellation logic yourself. A well-behaved cancellable function does four things:

1. **Fail fast** if the signal is already aborted when it is called.
2. **Stop the underlying work** when the signal aborts (clear the timer, close the socket) and reject with the reason.
3. **Remove its abort listener** when it finishes normally, so long-lived signals do not accumulate listeners.
4. **Check the signal between steps** when the work has several stages.

Here is a cancellable `sleep`, written with those rules:

```javascript title="cancellable-sleep.mjs"
function sleep(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason); // rule 1

    const onAbort = () => {
      clearTimeout(timer); // rule 2: stop the real work, not just the waiting
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort); // rule 3
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

async function syncDocuments(docs, { signal }) {
  for (const doc of docs) {
    signal.throwIfAborted(); // rule 4: do not start the next step after abort
    await sleep(30, { signal });
    console.log('synced', doc);
  }
}

const controller = new AbortController();
setTimeout(() => controller.abort(new Error('sync cancelled by user')), 75);

try {
  await syncDocuments(['a.txt', 'b.txt', 'c.txt', 'd.txt'], { signal: controller.signal });
} catch (err) {
  console.log(err.message);
}
```

```output
synced a.txt
synced b.txt
sync cancelled by user
```

Trace the timing: documents `a` and `b` finish at about 30 and 60 ms. At 75 ms the controller aborts while `c` is sleeping; the `onAbort` listener clears that timer and rejects with the reason, which `syncDocuments` lets propagate, so `d` never starts. (The exact cut-off depends on timer precision, but with 15 ms of slack on either side this ordering is stable.)

Without rule 3, every completed `sleep` would leave a listener attached to the signal. For a signal that lives for the whole page — for example one tied to a component's lifetime — that is a slow memory leak and, in Node, triggers a `MaxListenersExceededWarning` once more than ten or so are attached (the exact threshold and warning behaviour are Node-specific).

> [!WARNING] abort() cannot interrupt running code
> Aborting only sets a flag and fires an event. A synchronous loop that is already running cannot be interrupted, because the abort itself needs the same thread to run. Long CPU work must be split into chunks that check `signal.aborted` between them, or moved to a Web Worker that you can `terminate()`.

## Timeouts and combined signals

Two static helpers cover the most common needs.

**`AbortSignal.timeout(ms)`** returns a signal that aborts by itself after `ms` milliseconds, with a `DOMException` named `"TimeoutError"` as its reason. Because the name differs from `"AbortError"`, error handling can tell a timeout apart from a user's cancellation.

**`AbortSignal.any(signals)`** returns a signal that aborts as soon as any of the given signals aborts, taking that signal's reason. It is how you say "stop if the user cancels *or* if it takes longer than 5 seconds". It is newer than the rest of the API: Chrome 116, Firefox 124, Safari 17.4 and Node 20.3 and later.

```javascript title="timeout-and-any.mjs"
import { setTimeout as sleep } from 'node:timers/promises';

async function run(label, { userCancelsAfter, timeoutMs }) {
  const user = new AbortController();
  if (userCancelsAfter !== undefined) {
    setTimeout(() => user.abort(), userCancelsAfter);
  }
  const signal = AbortSignal.any([user.signal, AbortSignal.timeout(timeoutMs)]);
  try {
    await sleep(100, null, { signal });
    console.log(label, '-> completed');
  } catch {
    console.log(label, '-> stopped:', signal.reason.name);
  }
}

await run('fast enough', { timeoutMs: 500 });
await run('too slow', { timeoutMs: 20 });
await run('user cancelled', { userCancelsAfter: 20, timeoutMs: 500 });
```

```output
fast enough -> completed
too slow -> stopped: TimeoutError
user cancelled -> stopped: AbortError
```

There is also **`AbortSignal.abort(reason)`**, which returns a signal that is already aborted — useful in tests, or to represent "this operation was cancelled before it started".

## How it works internally

`AbortSignal` is an `EventTarget` with two internal fields — the aborted flag (exposed as `aborted`) and the reason — plus an internal list of **abort algorithms**. Platform features such as `fetch` do not use public event listeners; they register an internal abort algorithm when you pass them a signal.

When `controller.abort(reason)` runs, the DOM Standard's "signal abort" steps execute synchronously:

1. If the signal is already aborted, return. This is why abort happens only once.
2. Set the reason (a new `AbortError` `DOMException` if none was given).
3. Run every abort algorithm — `fetch` terminates the request, `addEventListener` removes the listener, and so on.
4. Fire the `abort` event at the signal, running `onabort` and listeners in registration order.
5. Abort every dependent signal created by `AbortSignal.any` from this one.

Notice what is *not* in the list: nothing touches Promises. A Promise returned by an API rejects only because that API's abort algorithm chose to reject it. JavaScript code that holds a Promise from an API that ignores signals will keep waiting, which is why rule 2 above matters.

Garbage collection is handled carefully by the specification: a timeout signal or an `any` signal with no listeners and no references can be collected along with its timer, so creating them freely does not leak.

## Worked example: cancelling superseded work

A search box should abort the previous request whenever a new query starts. This is the core of [[b1-stale-requests]]. The `searchApi` here is simulated with a cancellable timer; with a real backend it would be `fetch(url, { signal })`.

```javascript title="search-abort.mjs"
import { setTimeout as sleep } from 'node:timers/promises';

async function searchApi(query, { signal }) {
  await sleep(query.length * 20, null, { signal }); // longer queries are slower here
  return [`${query}-result-1`, `${query}-result-2`];
}

let current = null; // controller for the request in flight

async function onQueryChange(query) {
  current?.abort(); // cancel the previous search, if any
  const controller = new AbortController();
  current = controller;
  try {
    const results = await searchApi(query, { signal: controller.signal });
    console.log(`render "${query}":`, results);
  } catch (err) {
    if (controller.signal.aborted) {
      console.log(`"${query}" cancelled`); // expected: not an error to show the user
      return;
    }
    throw err; // a real failure
  }
}

const typing = [onQueryChange('rea'), onQueryChange('reac'), onQueryChange('react')];
await Promise.all(typing);
```

```output
"rea" cancelled
"reac" cancelled
render "react": [ 'react-result-1', 'react-result-2' ]
```

The important design choice is in the `catch`. A cancelled search is not a failure: it happened because the user did something newer. The handler checks its *own* controller's `signal.aborted` to recognise that case and returns quietly, while any other error is re-thrown. Showing an error toast for an aborted request is one of the most common bugs in UI code that adopts AbortController.

In React, the same pattern appears in an effect: create the controller in the effect, pass `controller.signal` to the fetch, and call `controller.abort()` in the cleanup function, which React runs before the next effect and on unmount ([[b4-fetching-in-effects]]).

## In real systems

**Frontends** use one controller per request (or per component lifetime) and abort it on navigation, unmount or a newer request. TanStack Query passes a `signal` to every query function so it can cancel queries that are no longer needed.

**Node servers** create a controller per incoming request, abort it when the client disconnects (`req.on('close', ...)`), and pass the signal to database queries and outgoing HTTP calls, so abandoned requests stop consuming resources. Frameworks increasingly expose this directly — for example, the `Request` object in fetch-style handlers (Next.js route handlers, Hono, Deno) has a `request.signal`.

**Graceful shutdown.** A long-running worker can hold one top-level controller, abort it on `SIGTERM`, and let every loop and pending operation observe the signal and stop cleanly.

**Timeouts.** `fetch(url, { signal: AbortSignal.timeout(5000) })` is now the idiomatic way to put a deadline on a request ([[b1-timeouts-retries]]).

## Trade-offs and alternatives

AbortController's strengths are that it is standard, accepted by platform APIs, composable with `any` and `timeout`, and separates the right to cancel from the duty to stop. Its costs are that cancellation is cooperative (every layer must pass the signal along, and one layer that forgets breaks the chain), and that it is verbose to thread through deep call stacks.

The alternatives are weaker. A boolean `cancelled` flag checked after each await stops your code from using stale results but cannot stop the underlying network request or timer. Promise wrappers with a `cancel()` method (as in some older libraries such as Bluebird) mix the result and the control into one object and do not interoperate with platform APIs. RxJS Observables have cancellation built into unsubscription, which is elegant for streams but requires adopting the library.

Remember also what cancellation cannot do. Aborting a request stops the *client* from waiting and reading; it does not undo work the server has already done. If a `POST /orders` reached the server before the abort, the order may exist. Operations with side effects need server-side protection such as idempotency keys ([[d4-idempotency]]).

## Common mistakes

> [!MISTAKE] Treating an abort as an error
> Aborted operations reject, so a generic `catch` that shows "Something went wrong" will flash an error every time the user types quickly or navigates away. Check `signal.aborted` (or the error's `name`) and handle cancellation silently.

**Reusing an aborted controller.** Once aborted, a controller's signal stays aborted, so every later operation given that signal fails immediately. Create a new controller per operation.

**Not passing the signal down.** A function that accepts a signal but calls a helper without it cancels only the outer layer. Thread the same signal through every call that does async work.

**Forgetting to remove abort listeners.** Hand-written cancellable functions that add an abort listener on every call, and never remove it, leak memory on long-lived signals. Remove it on completion, or use `{ once: true }` and remove it when the work finishes normally.

**Only racing instead of stopping.** `Promise.race([work, abortPromise])` makes the caller stop waiting, but `work` keeps running. Stop the underlying operation (clear the timer, pass the signal to `fetch`).

**Expecting `abort()` to stop synchronous code.** It cannot interrupt a running loop; the code must check `signal.aborted` between chunks.

## Interview perspective

Interviewers ask about AbortController in two contexts: "how do you cancel a fetch?" and "how do you avoid race conditions in a search box?". A strong answer to the first explains that Promises are not cancellable, that `fetch` accepts a `signal`, that `abort()` rejects the fetch with an `AbortError` (or the given reason), and that the server may still have processed the request. For the second, describe aborting the previous request when a new one starts, ignoring the cancellation in the `catch`, and — as a second line of defence — checking that the response still belongs to the latest request ([[b1-stale-requests]]).

Follow-ups often probe the edges: Can `abort()` stop a running `while` loop? (no, cancellation is cooperative). How do you add a timeout as well as user cancellation? (`AbortSignal.any([userSignal, AbortSignal.timeout(ms)])`). How would you make your own function cancellable? (check `throwIfAborted`, listen for `abort`, clean up the listener). How do you tell a timeout from a cancellation? (`TimeoutError` versus `AbortError` reason names).

> [!INTERVIEW] Explaining the design
> "Promises represent a result that may be shared, so cancelling one consumer's interest must not cancel the work for everyone. AbortController separates the capability to cancel (the controller) from the ability to observe cancellation (the signal), and the work itself decides how to stop. That is why I pass signals down explicitly and why a function that ignores its signal can't be cancelled."

```quiz
Q: You call `controller.abort()` and then start a new `fetch(url, { signal: controller.signal })` with the same controller. What happens?
- [ ] The fetch runs normally because abort only affects requests already in flight
- [x] The fetch rejects immediately, because the signal is permanently aborted
- [ ] The controller resets after each abort, so the fetch can be cancelled again later
- [ ] The fetch runs but its response is discarded
> An AbortSignal moves from not-aborted to aborted once and never back. APIs check `signal.aborted` when they start and reject at once with the reason. Each operation needs a fresh controller.
```

```quiz
Q: A hand-written `sleep(ms, { signal })` rejects on abort but never calls `clearTimeout`. What is wrong?
- [ ] Nothing — the Promise rejected, so the work is cancelled
- [x] The timer still fires later and keeps the Node process alive until it does; only the waiting was cancelled
- [ ] The Promise will resolve after rejecting, producing a second result
- [ ] The abort event will fire again when the timer completes
> Rejecting the Promise stops callers waiting, but the underlying timer still exists, keeps the event loop busy and runs its callback (calling `resolve` on an already-settled Promise, which is ignored). Real cancellation stops the underlying work. A Promise can settle only once, which is why the third option is wrong.
```

## Practice

1. **Cancellable retry.** Write `retry(fn, { attempts, signal })` that stops retrying, and stops waiting between attempts, as soon as the signal aborts.
2. **Chunked computation.** Write an async function that sums a large array in chunks of 100,000, yielding with `setTimeout` between chunks and stopping when its signal aborts.
3. **Your own `any`.** Implement `anySignal(signals)` without `AbortSignal.any`, making sure listeners are removed when the combined signal aborts.
4. **Component cleanup.** Sketch a component that registers `resize`, `keydown` and `scroll` listeners plus a polling loop, all cleaned up by one `abort()` call.
5. **Classify errors.** Write a `catch` block that distinguishes user cancellation, a timeout and a real network error, and logs only the last two.

## Quick revision {#quick-revision}

- Promises cannot be cancelled; **AbortController** provides a standard cancellation token (WHATWG DOM Standard; browsers, Node 15.4+, Deno, Bun).
- `controller.abort(reason)` → `signal.aborted = true`, `signal.reason = reason`, abort algorithms run, `'abort'` event fires **synchronously**, **once**.
- No reason given → `DOMException` with name `"AbortError"`.
- `signal.throwIfAborted()` throws the reason; use it between steps.
- **Cooperative:** only code that watches the signal stops. `abort()` cannot interrupt a running synchronous loop.
- Pass signals to APIs that accept them: `fetch`, `addEventListener` (removes the listener), Node `fs`, `timers/promises`, `events.once`, streams.
- Cancellable function: fail fast if already aborted, stop the real work, reject with the reason, remove the listener when done, check between steps.
- `AbortSignal.timeout(ms)` → reason `"TimeoutError"`. `AbortSignal.any([...])` → aborts with the first reason (Chrome 116, Firefox 124, Safari 17.4, Node 20.3).
- A controller cannot be reused after abort.
- Handle aborts silently; they are not failures.
- Aborting does not undo server-side effects.

## Key takeaways {#key-takeaways}

- AbortController exists because Promises represent results and cannot be cancelled; the signal is a separate, shareable cancellation token.
- The controller can cancel, the signal can only observe — so the right to cancel stays with the code that started the work.
- Cancellation is cooperative: every layer must pass the signal on, and work only stops if something watches the signal.
- Real cancellation stops the underlying work (timers, sockets), not just the waiting, and cleans up its listeners.
- Timeouts and combined cancel conditions are built from the same pieces with `AbortSignal.timeout` and `AbortSignal.any`.
- An aborted operation is an expected outcome; distinguish it from real errors in every `catch`.
