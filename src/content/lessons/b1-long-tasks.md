---
summary: A long task is a stretch of main-thread work of 50 ms or more, during which the page cannot respond to input or paint. You will learn why run-to-completion makes long tasks freeze the page, how to detect them, and how to fix them by splitting work, yielding to the event loop and moving computation to workers.
difficulty: intermediate
minutes: 35
objectives:
  - Explain why a long task blocks input handling and rendering, using run-to-completion and the event loop
  - Demonstrate that awaiting a resolved promise does not yield to input or rendering, while a macrotask boundary does
  - Split a long computation into chunks that yield with setTimeout or scheduler.yield
  - Choose between chunking, Web Workers and reducing the work itself for a given long task
  - Detect long tasks with DevTools and PerformanceObserver and relate them to INP and TBT
---

## Introduction

A user clicks "Apply filter" on a table of 50,000 rows. The handler filters, sorts and rebuilds the table, which takes 400 ms. For those 400 ms the page is frozen: the button does not show its pressed state, the spinner you added does not appear, typing into the search box does nothing, and a CSS animation stops mid-step. Then everything happens at once. Nothing was "slow" in the sense of waiting for a network; the page was busy.

That 400 ms block is a **long task**. In browser terms, a task is one unit of work the event loop runs to completion — running a script, dispatching an event to its listeners, running a timer callback. A **long task** is any task that keeps the main thread busy for **50 ms or more**. During a long task, the browser cannot handle input or produce a new frame, because both need the same main thread.

Long tasks are the most common cause of pages that feel sluggish even on fast connections, and they are measured directly by user-centred metrics such as Interaction to Next Paint. This lesson explains why they block, how to find them, and the three ways to fix them: do less, split the work, or move it off the main thread.

## Before you start

- **The event loop, tasks and microtasks** — the browser runs one task at a time and drains microtasks after each. See [[b1-event-loop]] and [[b1-microtasks]].
- **Run-to-completion** — once JavaScript starts running, nothing interrupts it. See [[b1-run-to-completion]].
- **`async`/`await` and promises.** See [[b1-async-await]].
- **Timers.** See [[b1-settimeout]].

## The intuition

Picture a café with one barista. Customers place orders, the barista makes drinks, and between drinks they glance at the queue, take new orders and wipe the counter. If one customer orders forty drinks and the barista insists on making all forty before looking up, everyone else waits several minutes, even for a glass of water. The fix is not a faster barista; it is to make a few of the forty, serve the people waiting, and continue.

The main thread is that barista. Your JavaScript, input events, style calculation, layout and paint all take turns on it. A long task is a forty-drink order made in one go. **Yielding** is pausing between drinks so other work can run. A Web Worker is hiring a second barista for the big order — with the restriction that the second barista cannot touch the counter (the DOM) directly.

## Why a long task blocks everything

JavaScript on the main thread follows **run-to-completion**: once a task starts, it runs until its call stack is empty and its microtasks are drained. The browser never pauses your function midway to handle a click. A click that arrives during a 400 ms task is queued, and its handler runs only after the task ends.

Rendering is also scheduled between tasks. The browser updates the screen at the display's refresh rate — at 60 Hz there is a frame opportunity about every 16.7 ms — but it can only render when the main thread is free. A long task therefore means skipped frames: animations driven by JavaScript stop, and visual feedback for input (a pressed button, a typed character) waits.

The 50 ms threshold comes from Google's RAIL performance model. Users perceive a response within about 100 ms as immediate. If a task can run for at most 50 ms, then input arriving at any moment waits at most 50 ms before its handler can start, which leaves the other 50 ms to handle it and paint the result. Treat 50 ms as an engineering threshold rather than a law: a 45 ms task is not fine if you run ten in a row with no gap.

### Seeing the block

Node uses the same single-threaded, run-to-completion model, so the effect can be shown outside a browser. A timer due in 10 ms cannot run while a 200 ms loop holds the thread:

```javascript title="blocking.mjs"
const start = performance.now();
const at = () => `${Math.round(performance.now() - start)} ms`;

// Something that should happen 10 ms from now (in a page: a click handler, a paint)
setTimeout(() => console.log(`timer due at 10 ms ran at ${at()}`), 10);

// 200 ms of synchronous work: one long task
function busyWork(ms) {
  const end = performance.now() + ms;
  let n = 0;
  while (performance.now() < end) n++;
  return n;
}
busyWork(200);
console.log(`busy work finished at ${at()}`);
```

```output
busy work finished at 200 ms
timer due at 10 ms ran at 202 ms
```

The timer was due at 10 ms but ran at about 202 ms, as soon as the busy task finished (exact numbers vary slightly per run). In a page, the same delay applies to a click handler or a frame. Nothing was wrong with the timer; the thread was occupied.

## Fix 1: split the work and yield

If the work must happen on the main thread — usually because it touches the DOM — split it into chunks and let the event loop run other tasks between them. The key is that the pause must be a real **task boundary**: the current task must end so that the browser can process input and render before your next chunk.

```javascript title="chunked.mjs"
const start = performance.now();
const at = () => `${Math.round(performance.now() - start)} ms`;

const yieldToEventLoop = () => new Promise((resolve) => setTimeout(resolve, 0));

function busyWork(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) { /* simulate CPU work */ }
}

async function processInChunks(chunks, msPerChunk) {
  for (let i = 0; i < chunks; i++) {
    busyWork(msPerChunk);          // one short task
    await yieldToEventLoop();      // let queued tasks run before the next chunk
  }
}

setTimeout(() => console.log(`timer due at 10 ms ran at ${at()}`), 10);
await processInChunks(10, 20);     // the same 200 ms of work, in 20 ms pieces
console.log(`chunked work finished at ${at()}`);
```

```output
timer due at 10 ms ran at 20 ms
chunked work finished at 212 ms
```

The same 200 ms of work now runs as ten 20 ms tasks. The timer ran at 20 ms, right after the first chunk, instead of waiting 200 ms. The total time grew slightly (about 212 ms) because of the gaps; that small overhead buys a responsive page. Each `await yieldToEventLoop()` ends the current task and continues the function in a new one, scheduled by the timer.

### Awaiting is not the same as yielding

A tempting shortcut is to sprinkle `await` into the loop. That does not help if the awaited promise is already resolved, because the continuation runs as a **microtask**, and microtasks run before the browser leaves the current task:

```javascript title="await-does-not-yield.mjs"
const start = performance.now();
const at = () => `${Math.round(performance.now() - start)} ms`;
function busyWork(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}
setTimeout(() => console.log(`timer due at 10 ms ran at ${at()}`), 10);
async function stillBlocking() {
  for (let i = 0; i < 10; i++) {
    busyWork(20);
    await Promise.resolve();   // a microtask: does NOT let timers run
  }
}
await stillBlocking();
console.log(`work finished at ${at()}`);
```

```output
work finished at 200 ms
timer due at 10 ms ran at 202 ms
```

The function is `async` and awaits ten times, yet the timer still waited 200 ms: the ten chunks ran back-to-back in one task. The same is true of `queueMicrotask`. The lesson is that **`async` code is not automatically non-blocking**; only waiting for something that resolves in a later task (a timer, a network response, a message) gives the event loop a turn. Endlessly chaining microtasks can even starve rendering completely; see [[b1-microtask-starvation]].

### Better ways to yield in browsers

`setTimeout(resolve, 0)` works everywhere but has two drawbacks: browsers clamp nested timers to at least about 4 ms after a few levels of nesting, and the continuation goes to the back of the task queue, behind any other timers the page scheduled. Newer APIs address this:

- **`scheduler.yield()`** returns a promise that resolves in a new task, but the continuation is given priority over other queued work of the same priority, so your chunked job is not starved by unrelated timers while input and rendering still get their turn. It shipped in Chromium 129; check current support for other browsers and feature-detect it.
- **`scheduler.postTask(callback, { priority })`** schedules a task at `'user-blocking'`, `'user-visible'` or `'background'` priority. See [[b3-scheduler-posttask]].

```javascript title="yield-helper.js"
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function renderRows(rows, table) {
  let deadline = performance.now() + 40;          // stay under 50 ms per task
  for (const row of rows) {
    table.append(buildRow(row));
    if (performance.now() >= deadline) {
      await yieldToMain();
      deadline = performance.now() + 40;
    }
  }
}
```

This runs in a browser (it was not run here; `buildRow` is your own function). Yielding by elapsed time rather than by a fixed number of items adapts to fast and slow devices: a fast laptop processes many rows per task, a slow phone fewer, and neither blocks for more than about 40 ms.

> [!WARNING] Chunked work can be interrupted by the user
> Once you yield, other code — including the user's next click — can run in the middle of your job. If the user changes the filter while the old filter's rows are still being added, you need to cancel the old job (an `AbortSignal` or a "generation" counter checked after each yield), or both jobs will write into the same table.

> [!MISTAKE] The spinner that never appears
> Setting `spinner.hidden = false` and then running 400 ms of work in the same task shows nothing: the browser cannot paint until the task ends, by which time the spinner is hidden again. Yield before the heavy work so the frame with the spinner can be painted.

## Fix 2: move the work off the main thread

Pure computation that does not need the DOM — parsing a large JSON or CSV file, filtering or sorting large datasets, image processing, cryptography, compression, syntax highlighting — can run in a **Web Worker**, a separate thread with its own event loop and heap. The main thread stays free and communicates with the worker through messages.

Node offers the same model with `worker_threads`, which makes it easy to demonstrate. The main thread logs a heartbeat every 50 ms while a worker counts primes:

```javascript title="offload.mjs"
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

function countPrimes(limit) {               // deliberately CPU-heavy
  let count = 0;
  for (let n = 2; n < limit; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
    if (prime) count++;
  }
  return count;
}

if (isMainThread) {
  const start = performance.now();
  const at = () => `${Math.round(performance.now() - start)} ms`;
  const heartbeat = setInterval(() => console.log(`main thread free at ${at()}`), 50);

  const worker = new Worker(new URL(import.meta.url), { workerData: 3_000_000 });
  worker.once('message', (count) => {
    console.log(`worker found ${count} primes at ${at()}`);
    clearInterval(heartbeat);
  });
} else {
  parentPort.postMessage(countPrimes(workerData));
}
```

```output
main thread free at 51 ms
main thread free at 103 ms
main thread free at 154 ms
main thread free at 204 ms
main thread free at 255 ms
main thread free at 306 ms
main thread free at 358 ms
main thread free at 409 ms
main thread free at 459 ms
main thread free at 510 ms
worker found 216816 primes at 519 ms
```

The same file runs as both the main thread and the worker; `isMainThread` picks the role. The heartbeat kept firing on time for the full half second of computation because that computation ran on another thread. Had `countPrimes` run on the main thread, there would have been no heartbeat at all until it finished.

In a browser the structure is the same with `new Worker('worker.js', { type: 'module' })`, `worker.postMessage(data)` and `onmessage` handlers. Workers have real costs: data sent with `postMessage` is copied using the structured clone algorithm (large `ArrayBuffer`s can be *transferred* instead, see [[b3-worker-transferables]]); workers cannot access the DOM; and starting one takes time, so reuse a worker for repeated jobs. [[b3-web-workers]] covers the browser API.

## Fix 3: do less work

Before splitting or moving work, check whether it needs to happen at all, or all at once.

**Avoid layout thrashing.** Reading a layout property (`offsetHeight`, `getBoundingClientRect()`) after writing styles forces the browser to recalculate layout immediately. Doing that inside a loop — write, read, write, read — turns one layout into hundreds and is a classic source of long tasks. Batch all reads, then all writes. See [[b3-layout-thrashing]].

**Render less.** Showing 50,000 rows creates 50,000 DOM rows to lay out. Virtualising the list renders only the few dozen that are visible; see [[b4-virtualization]].

**Defer what is not urgent.** Analytics, prefetching and non-visible widgets can wait until after the response to the user is painted, or until the browser is idle.

**Watch big single calls.** `JSON.parse` of a multi-megabyte string, a large `structuredClone`, or a big regular expression run on a long string are each one indivisible call. You cannot yield in the middle of them; move them to a worker, stream the input, or reduce its size.

## Detecting long tasks

**DevTools.** The Chrome DevTools Performance panel marks tasks over 50 ms with a red triangle and red hatching on the portion beyond 50 ms. The flame chart under the task shows which functions took the time. See [[b3-devtools-performance]].

**In the field.** `PerformanceObserver` can report long tasks from real users in Chromium-based browsers:

```javascript title="observe-long-tasks.js"
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`long task: ${Math.round(entry.duration)} ms at ${Math.round(entry.startTime)} ms`);
  }
});
observer.observe({ type: 'longtask', buffered: true });
```

This was not run here; `longtask` entries are supported in Chromium-based browsers only. They tell you *that* a long task happened but very little about *what* caused it. Chromium's newer Long Animation Frames API (`type: 'long-animation-frame'`, from Chrome 123) reports frames delayed by more than 50 ms and includes script attribution, which makes it more useful for diagnosing real-user problems. [[b3-long-task-api]] covers both.

**Metrics.** Two widely used metrics are built on long tasks. **Total Blocking Time (TBT)** is a lab metric: the sum, over all long tasks between First Contentful Paint and Time to Interactive, of the portion of each task beyond 50 ms. A 120 ms task contributes 70 ms. **Interaction to Next Paint (INP)** is a field metric and, since March 2024, one of the Core Web Vitals, replacing First Input Delay. It measures how long the page takes to paint a response after user interactions, reporting roughly the worst one; under 200 ms is considered good and over 500 ms poor. Long tasks raise INP in two ways: by delaying the start of an event handler (input delay) and by being the event handler. See [[b3-inp]] and [[b3-core-web-vitals]].

## In real systems

Large single-page apps typically have long tasks in three places: the initial script evaluation (fixed with code splitting and less JavaScript), heavy interactions such as filtering or opening a complex view (fixed with chunking, virtualisation, or memoising expensive computations), and third-party scripts (fixed by loading them later or in a worker-based sandbox). React 18 and later reduce long renders by rendering concurrently: work marked as a transition with `startTransition` is rendered in small slices that yield to the browser, so typing stays responsive while a large list re-renders. Garbage collection can also appear as main-thread time in profiles when code allocates heavily; see [[b1-garbage-collection]].

## Trade-offs and alternatives

| Approach | Best for | Cost |
|---|---|---|
| Do less (batch DOM reads/writes, virtualise, defer) | Rendering and layout work | Requires redesigning the work, but gives the largest wins |
| Chunk and yield (`setTimeout`, `scheduler.yield`) | Work that must touch the DOM | More total time; code must handle interruptions and cancellation |
| Web Worker | CPU-heavy work without DOM access | Message copying, no DOM, worker startup, more complex code |
| Concurrent rendering (React transitions) | Expensive React re-renders | Only helps React render work; your own synchronous code inside it still blocks |

## Common mistakes

**Assuming `async` means non-blocking.** An `async` function runs synchronously until it awaits something that is actually pending. Awaiting resolved promises keeps you in the same task.

**Yielding too often.** Yielding after every item adds overhead and, with `setTimeout`, the 4 ms clamp. Yield by elapsed time, for example every 40 ms.

**Ignoring interruption.** After yielding, the user can start another job. Cancel or ignore stale work.

**Moving DOM work to a worker.** Workers cannot access `document`. Compute in the worker, send the result back, and apply it on the main thread.

## Interview perspective

**"What is a long task and why does it matter?"** Main-thread work of 50 ms or more. Because of run-to-completion, input handlers and rendering cannot run until it finishes, so the page feels frozen and INP gets worse.

**"How would you fix a 500 ms click handler?"** First profile to see what the time is spent on. Then: reduce the work (layout thrashing, rendering too many nodes), split it into chunks that yield with `scheduler.yield()` or `setTimeout`, and move pure computation to a worker. Show the user immediate feedback before the heavy part.

**Follow-up: "Does wrapping it in a promise help?"** No. Promise callbacks are microtasks and run before the browser can render or handle input. Only a task boundary yields.

## Practice

1. Change `await-does-not-yield.mjs` so the timer runs after the first chunk, using a single-line change. Explain why it works.
2. Write a `processInBatches(items, fn, { budgetMs, signal })` helper that yields whenever `budgetMs` has elapsed and stops if `signal` is aborted.
3. Profile a page in Chrome DevTools that sorts 200,000 objects on a button click. Find the long task, then move the sort to a Web Worker and compare INP before and after.
4. Explain why a 45 ms task that runs ten times back-to-back with only microtask gaps is just as bad as one 450 ms task.

## Quick revision {#quick-revision}

- Long task: main-thread task of 50 ms or more. Blocks input handling and rendering (run-to-completion).
- 50 ms comes from RAIL: leaves room to respond to input within about 100 ms.
- Fixes: do less; split and yield; move to a Worker.
- Yield = end the task: `setTimeout(resolve, 0)`, `scheduler.yield()` (Chromium 129+, feature-detect), `scheduler.postTask`.
- `await Promise.resolve()` / `queueMicrotask` do **not** yield; microtasks run within the same task.
- Yield by time budget (around 40 ms), and handle cancellation of interrupted jobs.
- Workers: separate thread and heap, no DOM, messages copied (or transferred).
- Detect: DevTools Performance panel (red-marked tasks), `PerformanceObserver` `longtask` and `long-animation-frame` (Chromium).
- TBT = sum of (task duration − 50 ms) between FCP and TTI (lab). INP = interaction-to-paint latency, Core Web Vital since March 2024 (good ≤ 200 ms).

## Key takeaways {#key-takeaways}

- The main thread does one thing at a time; a long task makes everything else, including input and paint, wait.
- Splitting work only helps if each piece ends the current task; microtasks do not count as yielding.
- Move computation that does not need the DOM into a worker, and reduce rendering and layout work before trying to schedule it cleverly.
- Measure with DevTools and real-user data; INP and TBT are the metrics long tasks hurt most.

```quiz
Q: A click handler runs `for (const chunk of chunks) { process(chunk); await Promise.resolve(); }` and the whole loop takes 300 ms. Does the page stay responsive?
- [ ] Yes, because each `await` gives control back to the browser
- [x] No, because resuming after an already-resolved promise is a microtask, so the loop never leaves the current task
- [ ] Yes, because `async` functions run on a background thread
- [ ] No, because `await` is not allowed in event handlers
> Microtasks run before the event loop moves to the next task, so input and rendering still wait 300 ms. `async` functions run on the main thread, and `await` is allowed in handlers. To yield, await something that resolves in a later task, such as `setTimeout` or `scheduler.yield()`.
```

```quiz
Q: Which task is the best candidate for a Web Worker?
- [ ] Measuring the size of 1,000 DOM elements
- [x] Parsing and aggregating a 40 MB CSV file
- [ ] Toggling a CSS class on scroll
- [ ] Adding rows to a table
> CSV parsing and aggregation is pure computation with no DOM access, so it can run on another thread while the page stays responsive. Workers cannot read layout, change classes or modify the table; those must stay on the main thread.
```

```quiz
Q: A page has three long tasks during load: 70 ms, 120 ms and 40 ms. What do they contribute to Total Blocking Time?
- [ ] 230 ms
- [ ] 190 ms
- [x] 90 ms
- [ ] 0 ms
> Only the part of each task beyond 50 ms counts: 20 ms from the 70 ms task and 70 ms from the 120 ms task, giving 90 ms. The 40 ms task is not a long task at all. 230 ms would be the total task time, and 190 ms counts both long tasks in full.
```
