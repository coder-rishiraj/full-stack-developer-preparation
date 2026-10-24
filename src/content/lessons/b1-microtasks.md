---
summary: JavaScript hosts keep two kinds of waiting work — tasks (macrotasks) such as timers and events, and microtasks such as promise callbacks — and they run them with very different priority. You will learn exactly what goes into each queue, when each queue is processed, how promises and await create microtasks, and how to use that knowledge to batch work without freezing the page.
difficulty: intermediate
minutes: 50
objectives:
  - Classify common APIs as microtask or macrotask sources and explain the difference in when they run
  - Trace how promise chains, `await` and `queueMicrotask` add jobs to the microtask queue, including when a job is queued
  - Use `queueMicrotask` to batch synchronous changes into a single flush, and handle its errors correctly
  - Diagnose microtask starvation and fix it by yielding with a task instead of a microtask
  - Explain Node.js's `process.nextTick` queue and how it relates to promise microtasks
---

## Introduction

The event loop does not treat all waiting work equally. A click handler, a timer callback and a network response are queued as **tasks**, and the loop runs one of them per iteration. A promise callback, by contrast, is queued as a **microtask**, and *all* waiting microtasks run before the loop is allowed to move on to the next task or render a frame.

Why have two levels? Consider a promise chain: `fetch(url).then(r => r.json()).then(render)`. Once the response is ready, the steps after it are logically one piece of work — "handle the response". If each `.then` were an ordinary task, a timer or another event could run between `r.json()` and `render`, and the page could even repaint in a half-updated state. Microtasks let a chain of follow-up steps finish together, as soon as the current code ends, before anything slower gets a turn.

That priority is powerful and occasionally dangerous. It explains the classic interview result that `Promise.resolve().then(fn)` runs before `setTimeout(fn, 0)`. It lets frameworks collect many state changes and apply them once. And it can freeze a page completely if microtasks keep queuing more microtasks, because the loop never gets past them.

This lesson treats the two queues in depth: what goes into each, exactly when items are added, and how to choose between them. Its three nested sections — [[b1-macrotasks]], [[b1-queue-microtask]] and [[b1-microtask-starvation]] — each stand on their own.

## Before you start

- **The event loop** — one task per iteration, then a microtask checkpoint, then possibly rendering. This lesson assumes that model. See [[b1-event-loop]].
- **Promises** — states (pending, fulfilled, rejected) and `.then`/`.catch`. See [[b1-promises]] and [[b1-promise-states]].
- **`async`/`await`** — that `await` pauses an async function until a promise settles. See [[b1-async-await]].

## The intuition

Think of an office worker with an inbox tray and a sticky-note pad. Letters arriving in the tray are tasks: the worker takes one, deals with it fully, and only then looks at the tray again. While dealing with a letter, the worker often writes sticky notes — "file the copy", "update the ledger" — and sticks them on the desk. The rule is that before taking the next letter, every sticky note must be cleared. If clearing a note means writing another note, that one gets cleared too.

The rule has a good effect: the follow-up work for a letter is finished before the next letter starts, so the desk is never left in a half-done state. It also has a risk: a worker who keeps writing a new sticky note for every note they clear will never reach the tray again. Both effects are exactly what happens with microtasks.

## What goes into each queue

| Work | Queue | Available in |
|---|---|---|
| Running a `<script>` or module | Task | Browsers (Node runs the main module similarly) |
| `setTimeout`, `setInterval` callbacks | Task | Browsers, Node (timers phase) |
| User input events (click, keydown) dispatched by the browser | Task | Browsers |
| `postMessage`, `MessageChannel` messages | Task | Browsers, Node (`MessageChannel`), workers |
| Network and file I/O completion | Task | Browsers (networking task source), Node (poll phase) |
| `setImmediate` | Task (check phase) | Node only |
| `.then` / `.catch` / `.finally` callbacks | Microtask | All |
| Code after an `await` | Microtask | All |
| `queueMicrotask(fn)` | Microtask | Browsers, Node 11+ |
| `MutationObserver` callbacks | Microtask | Browsers |
| `process.nextTick(fn)` | Separate queue, drained before promise microtasks | Node only |
| `requestAnimationFrame` | Neither — runs in the rendering step | Browsers |

Two entries deserve a note. `fetch` involves both queues: the browser queues a *task* on the networking task source when the response arrives, and that task resolves the promise, which queues your `.then` callback as a *microtask*. And `requestAnimationFrame` is often mislabelled as a macrotask; it is neither, because it runs during the browser's frame update, which is covered in [[b3-raf]].

## When the microtask queue runs

The HTML Standard calls the moment microtasks are processed a **microtask checkpoint**. During a checkpoint the host repeatedly takes the oldest microtask, runs it to completion, and continues until the queue is empty. It is a **first-in, first-out (FIFO)** queue, and anything queued during the checkpoint goes to the back of the same queue and runs in the same checkpoint.

Checkpoints happen at two kinds of moments. The first is after every task: when a timer callback, event handler or script finishes, the queue is drained before the next task starts or a frame renders. The second is whenever the JavaScript stack becomes empty after the host has called into JavaScript — for example, between two event listeners when the *browser* dispatches an event. That second rule is what makes microtasks run between listeners for a real user click but not for `element.click()` called from script, a favourite puzzle in [[b1-event-loop-puzzles]].

The result is the core ordering rule:

```javascript title="order.js"
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);
```

```output
1
5
3
4
2
```

The script is a task, so `1` and `5` print first. At the checkpoint, the promise callback and the `queueMicrotask` callback run in the order they were queued. Only then can the timer task run.

## How promises queue microtasks

To predict promise-heavy code you need to know *when* each callback is queued, not only that it is a microtask. Three rules cover almost everything.

**Rule 1: `.then` on an already-settled promise queues the callback immediately.** `Promise.resolve().then(fn)` puts `fn` in the microtask queue at the moment `.then` is called. It still does not run synchronously — a `.then` callback *never* runs synchronously, even for a settled promise — but its place in the queue is taken right away.

**Rule 2: `.then` on a pending promise queues nothing yet.** The callback is stored on the promise. When the promise is later resolved or rejected, one microtask is queued for each stored callback, in the order they were registered.

**Rule 3: each `.then` returns a new promise, which settles only when its callback returns.** So in `p.then(a).then(b)`, `b` is not queued until `a` has run. A chain therefore advances one link per microtask, and two independent chains interleave:

```javascript title="interleave.js"
Promise.resolve().then(() => {
  console.log('A');
  Promise.resolve().then(() => console.log('A.inner'));
}).then(() => console.log('A.next'));

Promise.resolve().then(() => console.log('B')).then(() => console.log('B.next'));
```

```output
A
B
A.inner
A.next
B.next
```

Trace the queue. After the script: `[A, B]`. Running `A` logs `A`, queues `A.inner`, and on return fulfils A's promise, queuing `A.next`: the queue is `[B, A.inner, A.next]`. `B` runs and queues `B.next`: `[A.inner, A.next, B.next]`. The rest run in that order. Nothing here is special-cased; it all follows from FIFO plus "the next link is queued when the previous one returns".

### `await` costs one microtask

`await value` suspends the async function and arranges for the rest of it to run as a microtask once `value` settles. Since ES2019 (shipped in V8 7.2 / Chrome 72 and Node 12), awaiting a native promise takes a single microtask hop — the same as awaiting a plain value:

```javascript title="await-ticks.js"
async function waitsOnValue() {
  await 42;
  console.log('resumed after await 42');
}
async function waitsOnPromise() {
  await Promise.resolve(42);
  console.log('resumed after await Promise.resolve(42)');
}
waitsOnValue();
waitsOnPromise();
Promise.resolve()
  .then(() => console.log('tick 1'))
  .then(() => console.log('tick 2'));
```

```output
resumed after await 42
resumed after await Promise.resolve(42)
tick 1
tick 2
```

Both continuations were queued during the synchronous script, before `tick 1`, so they run first. Older engines took three hops for awaiting a promise, which is why some blog posts from before 2019 show different orders.

### Resolving with a promise costs extra hops

There is one case where the number of hops surprises people: settling a promise *with another promise* (or any object with a `then` method). The spec does not adopt the inner promise directly; it queues a job that calls the inner promise's `then`, and that `then` then queues another job. Returning a promise from an `async` function triggers exactly this:

```javascript title="return-promise.js"
async function returnsValue() { return 1; }
async function returnsPromise() { return Promise.resolve(1); }

returnsPromise().then(() => console.log('returnsPromise'));
returnsValue().then(() => console.log('returnsValue'));
Promise.resolve()
  .then(() => console.log('tick 1'))
  .then(() => console.log('tick 2'))
  .then(() => console.log('tick 3'));
```

```output
returnsValue
tick 1
tick 2
returnsPromise
tick 3
```

`returnsPromise` was called first, yet its callback runs two microtasks later than `returnsValue`'s. You should not write code that depends on these exact counts — they are a spec detail that only matters in puzzles — but knowing that "a thenable adds two hops" lets you explain such output instead of guessing.

> [!NOTE] Node's `process.nextTick`
> Node.js has an extra queue for `process.nextTick` callbacks. After each callback the loop runs, Node drains the whole `nextTick` queue and then the whole promise microtask queue, repeating until both are empty. In a CommonJS script, `process.nextTick(a)` therefore runs before an earlier `Promise.resolve().then(b)`. In an ES module the main module's own evaluation is promise-driven, so `b` can run first. The Node documentation recommends `queueMicrotask` for most new code because it behaves the same everywhere.

```quiz
Q: What does this print? `Promise.resolve().then(() => console.log('x')); console.log('y');`
- [ ] x then y, because the promise is already resolved
- [x] y then x, because `.then` callbacks always run as microtasks after the current synchronous code
- [ ] Only y, because the callback is attached too late
- [ ] It depends on the browser
> Even for an already-resolved promise, `.then` only queues the callback; it never calls it synchronously. The callback runs at the next microtask checkpoint, after the script finishes. This guarantee makes promise code behave the same whether the promise was already settled or not.
```

## Macrotasks {#b1-macrotasks}

A **macrotask** — called simply a **task** in the HTML Standard — is a unit of work the host queues for the event loop to run later as a fresh start on an empty call stack: a timer callback, a user-input event, a message from `postMessage`, the completion of network or file I/O, or the running of a script. The word "macrotask" is informal; developers use it to contrast tasks with the smaller, higher-priority microtasks.

### How tasks are scheduled

Each task starts with the stack empty, runs to completion, and is followed by a microtask checkpoint. The loop runs **one task per iteration**, and in a browser it may render a frame between tasks. That makes tasks the natural boundary at which the rest of the world gets a turn: input is handled, frames are painted, other timers fire.

A browser keeps several task queues — one per **task source** (timers, DOM manipulation, user interaction, networking, and others) — and is free to choose which queue to serve each iteration. Browsers use this to keep pages responsive, for example by favouring input events. The consequence for your code: tasks from the *same* source keep their order (two `setTimeout` calls with the same delay fire in call order), but there is no guaranteed order between, say, a timer and a network response that become ready at the same time.

```javascript title="two-timers.js"
setTimeout(() => console.log('A'), 0);
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

```output
D
C
A
B
```

`D` is synchronous. `C` is a microtask and runs at the checkpoint after the script. `A` and `B` are tasks from the same source with the same delay, so they run in order, each in its own loop iteration — with a microtask checkpoint after each. You can see that checkpoint between tasks when a timer queues a microtask:

```javascript title="checkpoint-between-tasks.js"
setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('microtask inside timeout 1'));
}, 0);
setTimeout(() => console.log('timeout 2'), 0);
```

```output
timeout 1
microtask inside timeout 1
timeout 2
```

### Timers are minimums, not schedules

`setTimeout(fn, delay)` queues a task once *at least* `delay` milliseconds have passed. If the thread is busy, the task waits. Browsers also clamp delays: nested timers (more than five levels deep) get at least 4 ms, and hidden tabs are throttled to roughly once per second or less. Node stores a 0 ms delay as 1 ms. `setInterval` does not queue a backlog when a callback runs long — a busy browser simply skips the missed runs — so intervals drift rather than stack up. See [[b1-settimeout]], [[b1-setinterval]] and [[b1-minimum-delay]].

### Using tasks deliberately

Because tasks are where the browser gets a turn, you schedule a task when you *want* to give way: to let the browser paint, process input, or let other timers run. Typical cases are splitting a long computation into chunks (shown in the starvation section below), deferring non-urgent work such as analytics, and debounce or throttle timers ([[b1-debounce]]). `MessageChannel` produces a task without the timer clamping, which is why schedulers — including React's — have used it for fast yielding. The newer `scheduler.postTask()` API adds explicit priorities; see [[b3-scheduler-posttask]].

In Node, the task-like callbacks are organised into libuv phases: timers (`setTimeout`, `setInterval`), poll (I/O callbacks), check (`setImmediate`) and close callbacks. The idea is the same: each callback is followed by draining the `nextTick` and microtask queues before the next one runs.

## queueMicrotask {#b1-queue-microtask}

`queueMicrotask(callback)` is a global function that puts `callback` at the back of the microtask queue. It runs after the currently executing code finishes and before the event loop moves on to the next task or renders — the same timing as a `.then` callback on an already-resolved promise, without creating a promise. It is defined by the HTML Standard rather than ECMA-262, and is available in all modern browsers (since around 2019) and in Node.js 11 and later.

```javascript title="queue-microtask.js"
console.log('a');
queueMicrotask(() => console.log('c'));
Promise.resolve().then(() => console.log('d'));
console.log('b');
```

```output
a
b
c
d
```

`queueMicrotask` and promise reactions share one FIFO queue, so `c` (queued first) runs before `d`.

### Why not `Promise.resolve().then(fn)`?

Before `queueMicrotask` existed, libraries wrote `Promise.resolve().then(fn)` to get microtask timing. That works, but it has two drawbacks. It allocates a promise that nobody needs. More importantly, it changes error handling: if `fn` throws, the exception becomes a rejection of the promise returned by `.then`, which nobody is listening to, so it surfaces only as an "unhandled rejection" warning, far from the cause. With `queueMicrotask`, an exception thrown by the callback is reported as an ordinary uncaught exception — to `window.onerror` in browsers, or `process.on('uncaughtException')` in Node, which by default crashes the process. Other queued microtasks still run:

```javascript title="microtask-error.js"
queueMicrotask(() => { throw new Error('from microtask'); });
queueMicrotask(() => console.log('second microtask'));
process.on('uncaughtException', (e) => console.log('uncaughtException:', e.message));
setTimeout(() => console.log('timer still runs'), 0);
```

```output
uncaughtException: from microtask
second microtask
timer still runs
```

(This Node example installs an `uncaughtException` handler only to show the report; without it, Node would print the error and exit.)

One trap: passing an `async` function as the callback brings promise semantics back. `queueMicrotask(async () => { throw err; })` does not throw at all — the async function returns a rejected promise, and you are back to an unhandled rejection. Use a plain function, or handle errors inside.

### A real use: batching

The most useful job for `queueMicrotask` is **batching**: collecting several synchronous changes and processing them once, after the current code finishes but before the browser paints. Reactive libraries and state managers use this pattern so that ten state updates in one event handler trigger one re-render, not ten.

```javascript title="batch.js"
const pending = [];
let flushScheduled = false;

function notify(change) {
  pending.push(change);
  if (!flushScheduled) {
    flushScheduled = true;
    queueMicrotask(flush); // run once, after the current synchronous code
  }
}

function flush() {
  console.log(`flushing ${pending.length} change(s):`, pending.join(', '));
  pending.length = 0;
  flushScheduled = false;
}

notify('name');
notify('email');
notify('avatar');
console.log('all changes made');
setTimeout(() => notify('theme'), 0);
```

```output
all changes made
flushing 3 change(s): name, email, avatar
flushing 1 change(s): theme
```

The flag ensures only one flush is queued per batch. All three synchronous calls land in the first flush, which still runs before any timer or repaint, so the user never sees the un-flushed state. The `notify` inside the timer starts a new batch, because by then the first flush has reset the flag.

### When to choose it

Choose `queueMicrotask` when you need "after the current code, before anything else" and you are not working with promises otherwise. Choose a promise when you need chaining, a value, or error propagation to a caller. Choose a task (`setTimeout`, `scheduler.postTask`) when you want the browser to render or handle input first. And in Node, prefer `queueMicrotask` over `process.nextTick` unless you specifically need to run before promise callbacks.

## Microtask Starvation {#b1-microtask-starvation}

**Microtask starvation** happens when the microtask queue never becomes empty, because each microtask queues another one. The event loop must drain the queue completely before it runs the next task or renders a frame, so as long as microtasks keep arriving, timers never fire, clicks are never handled, and the page never repaints. The tab looks frozen even though JavaScript is "only" doing asynchronous work.

### Seeing it happen

```javascript title="starve.js"
let count = 0;

setTimeout(() => {
  console.log(`timeout ran after ${count} microtasks`);
}, 0);

function spin() {
  count++;
  if (count < 1_000_000) queueMicrotask(spin); // each microtask queues the next
}
queueMicrotask(spin);
console.log('sync done');
```

```output
sync done
timeout ran after 1000000 microtasks
```

The timer was due almost immediately, but it waited for all one million microtasks, because each one added another before the queue could empty. Remove the limit and the timer never runs at all. The same thing happens with a recursive `Promise.resolve().then(again)` chain, and — less obviously — with an async loop that awaits values that are already available:

```javascript title="starving-loop.js"
async function processAll(items) {
  for (const item of items) {
    await Promise.resolve(); // looks like a yield, but resumes as a microtask
    handle(item);
  }
}
```

Each iteration resumes as a microtask, so the whole loop runs inside one checkpoint. For a million items, the page is as frozen as if you had written a plain `for` loop — the `await` adds overhead without adding responsiveness.

### Why the loop allows it

Starvation is not a bug in the event loop; it is the price of the "drain completely" rule. That rule is what guarantees a promise chain finishes before the next event or frame. The HTML Standard has no fairness limit inside a checkpoint, and neither does Node (where a recursive `process.nextTick` chain starves I/O in the same way).

### The fix: yield with a task

To give the browser a turn, the continuation has to be a *task*, not a microtask. The program below runs the same three-chunk job twice: once yielding with a microtask, once with a task, each time with a timer waiting to run.

```javascript title="yield-comparison.js"
const microYield = () => Promise.resolve();
const taskYield = () => new Promise((resolve) => setTimeout(resolve, 0));

async function processInChunks(label, yieldFn) {
  setTimeout(() => console.log(`  [${label}] timer got a turn`), 0);
  for (let chunk = 1; chunk <= 3; chunk++) {
    // ...imagine 10 ms of real work per chunk here...
    console.log(`  [${label}] chunk ${chunk} done`);
    await yieldFn();
  }
}

(async () => {
  console.log('Yielding with a microtask:');
  await processInChunks('micro', microYield);
  await taskYield(); // let the first demo's timer fire before starting the second
  console.log('Yielding with a task:');
  await processInChunks('task', taskYield);
})();
```

```output
Yielding with a microtask:
  [micro] chunk 1 done
  [micro] chunk 2 done
  [micro] chunk 3 done
  [micro] timer got a turn
Yielding with a task:
  [task] chunk 1 done
  [task] timer got a turn
  [task] chunk 2 done
  [task] chunk 3 done
```

With microtask yields, the timer waits until the whole job is done. With task yields, it runs after the first chunk — and in a browser, so would input handling and rendering. The cost of a task yield is latency: each `setTimeout` round trip takes at least a millisecond or so (more once nesting clamps apply), so yield every few milliseconds of work, not after every item. In Chromium-based browsers, `await scheduler.yield()` (Chrome 129+) gives the same responsiveness while letting your continuation run ahead of other queued tasks; feature-detect it and fall back to `setTimeout`.

### Diagnosing it

Starvation shows up in a browser's Performance panel as one very long task whose flame chart is full of promise callbacks or `queueMicrotask` frames rather than one big synchronous function. Typical sources are recursive promise-based polling with no delay, async loops over large in-memory arrays, and event emitters that re-emit from inside their own microtask handlers. Bounding the work per batch and scheduling the next batch as a task fixes all of them.

```quiz
Q: A page processes 500,000 records in an async function that does `await Promise.resolve()` after every 1,000 records. The page still freezes. Why?
- [ ] `await` is broken in loops
- [ ] 1,000 records per chunk is too many; 10 would fix it
- [x] Each continuation is a microtask, so the whole loop runs within one microtask checkpoint and the browser never gets to render or handle input
- [ ] Promises run on a background thread that blocks the main thread
> The browser can only render and run input tasks once the microtask queue is empty. Awaiting an already-resolved promise resumes as a microtask, so the queue never empties until the loop finishes. Yielding with a task — `await new Promise(r => setTimeout(r, 0))` or `scheduler.yield()` — lets the loop move on between chunks.
```

## In real systems

**UI frameworks.** Vue batches reactive updates and flushes them in a microtask (`nextTick` returns a promise for that flush). React 18+ batches state updates from the same event or callback automatically and schedules rendering work; its scheduler yields to the browser with tasks (via `MessageChannel`) so long renders do not block input. Both depend on the distinction in this lesson: microtasks to collect, tasks to give way.

**DOM observers.** `MutationObserver` delivers its records as a microtask after the code that changed the DOM, so observers see a batch of changes and can react before the frame is painted. See [[b3-mutation-observer]].

**Promise libraries and polyfills.** Promise polyfills for very old browsers needed microtask timing without native promises, and used `MutationObserver` tricks or `setImmediate` to approximate it. `queueMicrotask` exists partly to give library authors a direct, standard way to schedule a microtask.

**Testing.** Fake timers replace `setTimeout` but not the microtask queue. In Jest or Vitest, after advancing timers you often need `await` (or the framework's async timer helpers) so that promise callbacks queued by the timer callbacks get to run before your assertions.

## Trade-offs and alternatives

| Goal | Use | Why not the other |
|---|---|---|
| Continue a chain of async steps without interruption | Promise / `await` (microtask) | A task would let other events and paints slip in between steps |
| Batch synchronous changes, flush before paint | `queueMicrotask` | A task would flush after the frame, showing stale UI for a frame |
| Let the browser render or handle input | `setTimeout`, `MessageChannel`, `scheduler.postTask`, `scheduler.yield()` | A microtask runs before rendering, so it cannot yield |
| Do visual work once per frame | `requestAnimationFrame` | Timers are not frame-aligned |
| Heavy CPU work | Web Worker | Neither queue helps; the main thread is still busy |

Microtasks are cheap and fast, with no clamping and no rendering in between, which is exactly why they are dangerous for long work. Tasks are slower to schedule, but every task boundary is an opportunity for the browser to stay responsive.

## Common mistakes

> [!MISTAKE] Thinking `setTimeout(fn, 0)` runs before promise callbacks
> It is a task; promise callbacks are microtasks, and the loop drains all microtasks before taking the next task. A zero delay never lets a timer jump ahead of the microtask queue.

**Labelling `requestAnimationFrame` as a macrotask.** It runs in the rendering step of the loop, once per frame, and its callbacks are batched together for that frame. Treat it as its own category.

**Expecting `await` to make a loop responsive.** Awaiting already-resolved values keeps everything inside one microtask checkpoint. Only a task yield lets the browser render or respond.

**Assuming each `.then` runs as a separate macrotask.** Every `.then` callback is a microtask, and a whole chain can complete within one checkpoint, before any timer.

**Swallowed errors in `Promise.resolve().then(fn)` used as a scheduler.** Errors become unhandled rejections. Use `queueMicrotask` for fire-and-forget scheduling so errors are reported as exceptions.

**Mixing `process.nextTick` and promises in Node and relying on the order.** The relative order differs between CommonJS and ES modules. Use one mechanism, preferably `queueMicrotask`.

## Interview perspective

Interviewers want to hear the precise rule — "after each task, the microtask queue is drained completely, including microtasks added while draining" — and to see you apply it to code.

> [!INTERVIEW] Microtask versus macrotask in one answer
> "Tasks are things like timers, events, messages and I/O; the loop runs one per iteration. Microtasks are promise reactions, `await` continuations, `queueMicrotask` and `MutationObserver`; after each task the loop drains the whole microtask queue before running the next task or rendering. So promise callbacks beat `setTimeout(0)`, a promise chain finishes in one go, and an endless chain of microtasks can starve rendering. To yield to the browser you need a task, not a microtask."

Questions to expect:

- **Name three microtask sources.** Promise reactions (`then`/`catch`/`finally`, `await`), `queueMicrotask`, `MutationObserver`; in Node, mention `process.nextTick` as a separate, even earlier queue.
- **Why does `Promise.then` run before `setTimeout(0)`?** Microtasks are drained at the checkpoint after the current task; the timer is a later task.
- **Can microtasks starve rendering?** Yes; give the recursive `queueMicrotask` example and the task-yield fix.
- **What is `queueMicrotask` and why use it over `Promise.resolve().then`?** Same timing, no promise allocation, errors reported as exceptions rather than unhandled rejections.
- **Follow-up: is an `async` function's code all microtasks?** No. The code up to the first `await` runs synchronously when called; only the continuations after each `await` are microtasks.

## Practice

1. **Classify.** For each of `setTimeout`, `fetch(...).then`, `addEventListener('click')`, `MutationObserver`, `requestAnimationFrame`, `setImmediate`, `queueMicrotask` and `await`, say which queue its callback goes to and in which environment it exists.
2. **Trace a chain.** Predict the output of two chains of four `.then` calls each, started one after the other, then run it. Then insert `return Promise.resolve()` into one link and predict how far it shifts.
3. **Build a batcher.** Write `createStore()` with `set(key, value)` and `subscribe(fn)` that notifies subscribers once per batch of synchronous `set` calls, using `queueMicrotask`.
4. **Starve and fix.** Write a page with a CSS spinner driven by `left` (main-thread) and a loop that processes 2 million items with `await Promise.resolve()` every 10,000. Observe the freeze, then fix it with a task yield every ~8 ms of work using `performance.now()`.
5. **Node queues.** Predict and run a CommonJS script that mixes `process.nextTick`, `queueMicrotask`, `Promise.then` and `setImmediate`, including one `nextTick` queued from inside a promise callback.

## Quick revision {#quick-revision}

- Tasks (macrotasks): scripts, timers, input events, `postMessage`/`MessageChannel`, I/O, `setImmediate` (Node). One per loop iteration.
- Microtasks: promise reactions, `await` continuations, `queueMicrotask`, `MutationObserver`. Drained completely at each checkpoint, FIFO, including newly added ones.
- Checkpoints: after every task, and whenever the stack empties after the host calls into JavaScript (e.g. between browser-dispatched listeners).
- `.then` on a settled promise queues immediately; on a pending one, queues at settlement; the next link is queued when the previous callback returns. Chains interleave.
- `await` = one microtask hop (ES2019+). Resolving with a promise/thenable (e.g. `return promise` in an async function) adds two hops.
- `rAF` is neither: it runs in the rendering step.
- `queueMicrotask`: microtask without a promise; errors are uncaught exceptions; avoid async callbacks; ideal for batching.
- Starvation: microtasks that keep queuing microtasks block timers, input and paint. Fix by yielding with a task (`setTimeout`, `scheduler.yield()`); `await Promise.resolve()` does not yield.
- Node: `nextTick` queue drains before promise microtasks (CommonJS); order can differ in ES modules; prefer `queueMicrotask`.

## Key takeaways {#key-takeaways}

- The host runs one task, then every microtask, then (in browsers) maybe a frame — so microtasks always beat the next timer, event or paint.
- Promise callbacks and `await` continuations are always microtasks and never run synchronously, even for promises that are already settled.
- Knowing when a microtask is queued — immediately, at settlement, or when the previous link returns — is what makes promise ordering predictable.
- `queueMicrotask` is the clean way to run something after the current code and before rendering, and it is the basis of update batching.
- A microtask cannot yield to the browser; if work must leave room for input and rendering, schedule the next part as a task.
