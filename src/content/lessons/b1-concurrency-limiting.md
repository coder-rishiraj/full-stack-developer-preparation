---
summary: Running every async task at once with Promise.all is fast for ten items and dangerous for ten thousand. This lesson shows how to cap the number of tasks in flight — with batches, a worker pool, or a reusable limiter — how to keep results in order and slots from leaking on errors, and how to choose the limit.
difficulty: intermediate
minutes: 45
objectives:
  - Explain why unbounded Promise.all over a large list can overload clients, servers and resources
  - Compare fixed batches with a sliding worker pool and explain why the pool is faster
  - Implement a mapLimit worker pool that preserves result order and handles failures
  - Implement a reusable limiter that releases its slot even when a task fails
  - Choose a concurrency limit and distinguish concurrency limiting from rate limiting
---

## Introduction

You need to process a list of items asynchronously: resize 5,000 images, call an API for each of 20,000 customer records, upload 300 files. [[b1-async-control-flow]] taught the fast way to do independent work: `await Promise.all(items.map(processItem))`. For ten items that is exactly right. For twenty thousand it is a self-inflicted outage. Every call starts immediately, so twenty thousand requests are opened at once: the server rate-limits or falls over, the client runs out of sockets or file handles, memory fills with pending requests and buffered responses, and the first failure rejects the whole batch while the rest carry on in the background.

The answer is **concurrency limiting**: keep at most *N* tasks in flight at any moment, and start the next one only when one finishes. This keeps most of the speed of parallel work — the waiting still overlaps — while bounding the load on everything involved.

A **concurrency limit** controls how many operations are running *at the same time*. It is different from a **rate limit**, which controls how many operations *start per unit of time*; the lesson returns to that distinction near the end.

## Before you start

- **async/await and Promise.all** — starting work, then joining it. See [[b1-async-await]] and [[b1-promise-all]].
- **Async control flow** — sequential versus parallel loops and fail-fast versus settle-all joins. See [[b1-async-control-flow]].
- **Queues** — first in, first out. A plain JavaScript array with `push` and `shift` is enough here.

Examples are ES modules run with Node 22. Simulated tasks use timers, so durations are approximate and printed timings are rounded.

## The intuition: a club with N wristbands

A club holds a fixed number of people. The door staff hand out *N* wristbands. Anyone arriving when all bands are taken waits in line. When someone leaves, they hand back their band and the first person in line goes in. The club is never over capacity, there is no idle space while a line exists, and the order of entry is fair.

That is a concurrency limiter. The wristbands are **slots**; the line is a **queue**; handing back a band is **releasing a slot**. Two things can go wrong in the analogy that also go wrong in code: a guest who leaves through the fire exit without returning the band (a task that fails without releasing its slot) shrinks the club's capacity for the rest of the night; and staff who let people in only in groups of N, waiting for the whole group to leave before admitting the next (batching), leave the club mostly empty while the slowest guest finishes.

## The problem, measured

Let us count how many tasks are actually running at once with an unbounded `Promise.all`:

```javascript title="unbounded.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let active = 0;
let peak = 0;
async function upload(file) {
  active += 1;
  peak = Math.max(peak, active);
  await delay(10); // stands in for a network request
  active -= 1;
  return `${file} uploaded`;
}

const files = Array.from({ length: 1000 }, (_, i) => `file-${i}.jpg`);
const results = await Promise.all(files.map(upload));
console.log(results.length, 'uploads; peak concurrency:', peak);
```

```output
1000 uploads; peak concurrency: 1000
```

All one thousand uploads were in flight at the same moment, because `files.map(upload)` calls `upload` for every file before anything is awaited. With real network requests that has concrete costs:

- **Browsers** queue the excess themselves — major browsers allow about six simultaneous HTTP/1.1 connections per host — so the extra requests sit in the browser's own queue, holding memory, and can starve other requests the page needs, such as images or user-triggered calls. HTTP/2 multiplexes many requests on one connection, but servers still cap concurrent streams (commonly around 100).
- **Servers and APIs** respond to sudden bursts with `429 Too Many Requests` or by slowing down for everyone.
- **Node processes** can hit the operating system's open-file limit (`EMFILE: too many open files`) when every task opens a file or socket, and memory grows with every pending task and buffered response.
- **Databases** have a fixed connection pool; extra queries wait in the pool's queue or time out.

## Approach 1: fixed batches

The simplest bound is to split the list into chunks of N and `Promise.all` each chunk in turn:

```javascript title="batches.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const durations = [100, 10, 10, 10, 100, 10, 10, 10]; // two slow tasks
const task = (i) => delay(durations[i]).then(() => i);

async function inBatches(count, size, fn) {
  const results = [];
  for (let start = 0; start < count; start += size) {
    const batch = [];
    for (let i = start; i < Math.min(start + size, count); i++) batch.push(fn(i));
    results.push(...(await Promise.all(batch))); // wait for the whole batch
  }
  return results;
}

const t0 = Date.now();
console.log(await inBatches(durations.length, 4, task));
console.log('batches took ~', Math.round((Date.now() - t0) / 50) * 50, 'ms');
```

```output
[
  0, 1, 2, 3,
  4, 5, 6, 7
]
batches took ~ 200 ms
```

Batching does bound concurrency to four, and it is easy to read. Its flaw is visible in the timing: each batch takes as long as its **slowest** task. In the first batch, three tasks finish after 10 ms and their slots then sit idle for 90 ms waiting for task 0. The total is 100 + 100 = 200 ms even though no single task takes longer than 100 ms.

## Approach 2: a worker pool

A better shape is a **sliding window**: whenever a task finishes, start the next one immediately. The cleanest way to write it is a **worker pool** — start N async "workers", each of which repeatedly takes the next unclaimed item from a shared index until none remain:

```javascript title="map-limit.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const durations = [100, 10, 10, 10, 100, 10, 10, 10];
const task = (i) => delay(durations[i]).then(() => i);

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0; // index of the next unclaimed item, shared by all workers

  async function worker() {
    while (next < items.length) {
      const index = next++; // claim synchronously: no other worker can take the same index
      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

const t0 = Date.now();
console.log(await mapLimit(durations.map((_, i) => i), 4, task));
console.log('pool took ~', Math.round((Date.now() - t0) / 50) * 50, 'ms');
```

```output
[
  0, 1, 2, 3,
  4, 5, 6, 7
]
pool took ~ 100 ms
```

The same eight tasks with the same limit finish in about 110 ms instead of 200. Trace it:

| Time (ms) | Event | Running |
|---|---|---|
| 0 | Workers A–D claim items 0, 1, 2, 3 | 0, 1, 2, 3 |
| 10 | Items 1–3 finish; B, C, D claim 4, 5, 6 | 0, 4, 5, 6 |
| 20 | Items 5 and 6 finish; C claims 7, D finds nothing left and exits | 0, 4, 7 |
| 30 | Item 7 finishes; C exits | 0, 4 |
| 100 | Item 0 finishes; A exits | 4 |
| 110 | Item 4 finishes; B exits; `Promise.all(workers)` fulfils | — |

Three details make this correct. **Claiming is synchronous**: `const index = next++` runs without an `await` between reading and incrementing, and JavaScript runs one piece of code at a time, so two workers can never claim the same item — no lock is needed (contrast this with threads in Java, [[c3-semaphore]]). **Results are stored by index**, so they come back in input order even though tasks finish out of order. And the number of workers is `min(limit, items.length)`, so a short list does not create idle workers.

### What happens when a task fails

In this version, a rejected `fn` makes its worker's Promise reject, so `Promise.all(workers)` rejects with that error — fail-fast. But the *other* workers keep pulling items until the list is empty, because nothing tells them to stop. Usually you want one of two explicit policies:

- **Fail fast and stop starting new work.** Set a `failed` flag in a `catch` and have each worker check it before claiming the next item (and abort in-flight tasks with an `AbortSignal` if they should stop too).
- **Settle all.** Catch inside the worker and store `{ status: 'rejected', reason }` in the results, mirroring `Promise.allSettled`. This suits batch jobs that should process everything and report failures.

```javascript title="map-limit-settled.mjs"
async function mapLimitSettled(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = { status: 'fulfilled', value: await fn(items[index]) };
      } catch (reason) {
        results[index] = { status: 'rejected', reason: reason.message };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const check = async (n) => {
  if (n % 3 === 0) throw new Error(`${n} is divisible by 3`);
  return n * 10;
};
console.log(await mapLimitSettled([1, 2, 3, 4, 5, 6], 2, check));
```

```output
[
  { status: 'fulfilled', value: 10 },
  { status: 'fulfilled', value: 20 },
  { status: 'rejected', reason: '3 is divisible by 3' },
  { status: 'fulfilled', value: 40 },
  { status: 'fulfilled', value: 50 },
  { status: 'rejected', reason: '6 is divisible by 3' }
]
```

## Approach 3: a reusable limiter

A worker pool needs the whole list up front. Sometimes tasks arrive one at a time from different parts of the program — every image component on a page wants to load its thumbnail, or every incoming request wants to call the same rate-sensitive API. For that you want a **limiter**: a function that wraps any task and returns a Promise that runs the task as soon as a slot is free. This is the design of the popular `p-limit` package.

```javascript title="limiter.mjs"
function createLimiter(limit) {
  let active = 0;
  const queue = []; // waiting tasks, first in first out

  function runNext() {
    if (active >= limit || queue.length === 0) return;
    active += 1;
    const { task, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(task) // also turns a synchronous throw inside task into a rejection
      .then(resolve, reject)
      .finally(() => {
        active -= 1; // always give the slot back, success or failure
        runNext();
      });
  }

  return (task) =>
    new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject });
      runNext();
    });
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const limit = createLimiter(2);
let running = 0;
let peak = 0;

const job = (id, ms, fail = false) => async () => {
  running += 1;
  peak = Math.max(peak, running);
  await delay(ms);
  running -= 1;
  if (fail) throw new Error(`job ${id} failed`);
  return `job ${id}`;
};

const results = await Promise.allSettled([
  limit(job(1, 30)),
  limit(job(2, 10, true)),
  limit(job(3, 10)),
  limit(job(4, 10)),
  limit(job(5, 10)),
]);
console.log(results.map((r) => r.value ?? r.reason.message));
console.log('peak concurrency:', peak);
```

```output
[ 'job 1', 'job 2 failed', 'job 3', 'job 4', 'job 5' ]
peak concurrency: 2
```

Each call to `limit(task)` returns a Promise immediately and puts the task in the queue. `runNext` starts tasks while there are free slots. When a task settles, its outcome is forwarded to the caller's Promise, and the `finally` releases the slot and starts the next queued task.

The `finally` is the most important line. Job 2 failed, yet jobs 3, 4 and 5 still ran. If the release were in a `.then` that only runs on success, every failure would permanently consume a slot; after two failures this limiter would hang forever with an empty club and a full queue. **Release in `finally`**, always.

Two other details are deliberate. `Promise.resolve().then(task)` calls the task inside a Promise callback, so a task that throws synchronously becomes a rejection rather than an exception that skips the bookkeeping. And the queue is FIFO, so tasks start in the order they were submitted. A priority queue could replace the array if some tasks should jump the line.

The limiter is a **counting semaphore** written for a single thread: `active` is the count, the queue holds waiters, and `finally` is the release. With async/await you can expose the same idea as `await semaphore.acquire(); try { ... } finally { semaphore.release(); }`.

## How it works internally

None of these approaches creates threads. JavaScript still runs one callback at a time; the limit controls how many *pending operations* — network requests, file reads, timers — exist at once outside JavaScript, in the browser or Node's I/O layer (libuv). This is **user-space scheduling**: your code decides when to start each operation, using nothing more than a counter, a queue and Promise callbacks.

That single-threaded model is what makes the implementations so small. In a multi-threaded language, `next++` and `active += 1` would be data races requiring atomic operations or locks. In JavaScript, a run of synchronous code is never interleaved with other JavaScript, so the read and update of `next` happen together. The only places other code can run are the `await` points — which is why the claim must happen before the `await`, not after.

Memory is bounded too, which is easy to overlook. With a pool, only N tasks have live request objects and buffered responses at once. The queue in a limiter still holds one small record per waiting task; if tasks arrive faster than they complete for a long time, the queue grows without bound. Long-running producers therefore need **backpressure** — pausing the producer when the queue is too long (for example, reading the next batch from a database only when the queue is short).

## Choosing the limit

There is no universal number, but there are good starting points, and the right value is found by measuring:

- **Browser requests to one origin over HTTP/1.1:** around 4–6, since the browser will not open more connections per host anyway.
- **Calls to a third-party API:** start from the provider's documented concurrency or rate limits, and leave headroom for other clients sharing the same key.
- **Database work:** at most the size of the connection pool, often less, so other requests are not starved.
- **Local file I/O in Node:** dozens can be fine; libuv's thread pool (4 threads by default) bounds how many file operations truly run at once.
- **CPU work:** limiting async concurrency does nothing for CPU-bound work on the main thread, which runs one task at a time anyway. Use a pool of worker threads sized to the number of cores ([[b3-web-workers]]).

Beyond the best value, more concurrency only adds queueing somewhere else and makes latency worse. A useful experiment is to measure total time for limits of 1, 2, 4, 8, 16 and 32: throughput rises steeply, flattens, and then often falls.

## Concurrency limits versus rate limits

A concurrency limit of 5 means "never more than 5 in flight". If each request takes 50 ms, that still allows about 100 requests per second. A **rate limit** means "no more than R starts per second", regardless of how long each takes. APIs often impose both. To respect a rate limit, add pacing — a token bucket that allows a start only when a token is available, refilled at R per second ([[d6-rate-limiting]], [[d3-rate-limiter-lld]]) — and combine it with a concurrency limiter. When the server answers `429`, back off and retry as described in [[b1-timeouts-retries]].

## Worked example: a bounded image download

A gallery page must prefetch 12 thumbnails. Each request takes a different time. The goal is to keep at most 3 in flight, keep results in order, record failures without stopping, and report peak concurrency and total time.

```javascript title="thumbnails.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let active = 0;
let peak = 0;
async function fetchThumbnail(id) {
  active += 1;
  peak = Math.max(peak, active);
  try {
    await delay(20 + (id % 4) * 10); // 20–50 ms
    if (id === 7) throw new Error('404');
    return `thumb-${id}.webp`;
  } finally {
    active -= 1;
  }
}

async function mapLimitSettled(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      try {
        results[i] = await fn(items[i]);
      } catch (err) {
        results[i] = `failed (${err.message})`;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const ids = Array.from({ length: 12 }, (_, i) => i);
const t0 = Date.now();
const thumbs = await mapLimitSettled(ids, 3, fetchThumbnail);
const elapsed = Date.now() - t0;

console.log(thumbs.slice(5, 9));
console.log('peak concurrency:', peak);
console.log('faster than sequential:', elapsed < 360, '| total under 200 ms:', elapsed < 200);
```

```output
[ 'thumb-5.webp', 'thumb-6.webp', 'failed (404)', 'thumb-8.webp' ]
peak concurrency: 3
faster than sequential: true | total under 200 ms: true
```

The tasks sum to 420 ms if run one after another. With three workers the total is roughly a third of that (around 140–150 ms; timings vary), while no more than three requests were ever in flight. The failed thumbnail took one slot briefly and was recorded in its position; the other workers continued. With an unbounded `Promise.all`, all twelve would have started at once, and the first failure would have rejected the whole batch.

In a real browser you would also pass an `AbortSignal` into `fetchThumbnail` and stop the workers when the user leaves the gallery ([[b1-abort-controller-js]]).

## In real systems

- **Libraries.** `p-limit` (a limiter), `p-map` (a `mapLimit` with a `concurrency` option and a `stopOnError` setting), `p-queue` (limiter plus priorities, pausing and rate intervals), and the older `async` library's `mapLimit` / `eachLimit`.
- **HTTP clients.** Node's `http.Agent` has a `maxSockets` option that caps connections per host; undici (the engine behind Node's `fetch`) has per-origin connection limits on its pools.
- **Databases.** Connection pools (for example `pg.Pool` with `max`) are concurrency limiters: queries beyond the pool size wait for a free connection.
- **Build tools and CLIs.** Bundlers, test runners and package managers process files and network downloads with bounded parallelism, often configurable with a flag.
- **Crawlers and data pipelines.** A per-domain concurrency limit plus a rate limit keeps them polite and avoids being blocked.

## Trade-offs and alternatives

| Approach | Strengths | Weaknesses |
|---|---|---|
| Unbounded `Promise.all` | Simplest, fastest for small lists | Unbounded load and memory; fail-fast leaves work running |
| Sequential `for...of` | Gentlest on resources; trivial errors | Total time is the sum of all tasks |
| Fixed batches | Easy to write and explain | Each batch waits for its slowest task; idle slots |
| Worker pool (`mapLimit`) | Slots never idle while work remains; ordered results | Needs the whole list up front |
| Limiter (`p-limit` style) | Works for tasks arriving from anywhere; reusable | Queue can grow without bound; needs backpressure for endless producers |

Concurrency limits trade peak throughput for stability. The cost of a limit that is slightly too low is modest extra latency; the cost of no limit is failures that appear only at scale, in production, on the biggest customer's data.

## Common mistakes

> [!MISTAKE] Leaking slots on failure
> Decrementing the active count only after success means every failed task permanently takes a slot. After `limit` failures, the limiter stops running anything and the program hangs with queued tasks. Release in `finally`.

**Creating the Promises before limiting them.** `limit(fetchUser(id))` calls `fetchUser` immediately, so the request has already started before the limiter sees it. Pass a function: `limit(() => fetchUser(id))`. The same applies to `mapLimit(items.map(fetchUser), ...)` — by the time `map` returns, all requests are running.

**Claiming work after an await.** In a hand-written pool, `await something(); const i = next++;` lets several workers interleave in surprising ways. Claim synchronously, then await.

**Pushing results instead of storing by index.** `results.push(value)` records completion order, which differs from input order.

**Using batches where a pool fits.** Batches waste slots behind each slow task; a pool keeps them busy.

**Treating a concurrency limit as a rate limit.** Five concurrent fast requests can still exceed "10 requests per second". Pace starts when the API limits rate.

**Limiting CPU work on the main thread.** Async concurrency limits only help I/O. CPU-bound work blocks the thread no matter how it is scheduled.

## Interview perspective

"Implement `mapLimit` / `promisePool` / `p-limit`" is a staple frontend and Node interview question. Interviewers check that you: never exceed the limit; start a new task as soon as one finishes (not in batches); preserve input order; handle an empty list and a limit larger than the list; release slots on failure; and decide what happens on error (fail-fast or settle-all). Walking through a timeline like the one above, out loud, is a strong way to show the code is correct.

Common follow-ups: Why is no lock needed around `next++`? (single-threaded execution; no await between read and write). How would you add cancellation? (check a signal before claiming, pass it to tasks). How would you add priorities? (a priority queue instead of an array). How is this different from a rate limiter? (in-flight count versus starts per time). What limit would you pick? (measure; start from browser per-host connection limits, the API's limits or the pool size).

> [!INTERVIEW] What to say first
> "Unbounded `Promise.all` starts everything immediately, so I'd use a pool: N async workers sharing an index, each claiming the next item synchronously and awaiting it, storing results by index. That keeps exactly N in flight with no idle slots, preserves order, and I release work in `finally` so a failure can't shrink the pool."

```quiz
Q: Tasks take 100, 10, 10, 10, 100, 10, 10, 10 ms. With a limit of 4, roughly how long do fixed batches of 4 and a sliding worker pool of 4 take?
- [ ] Both about 200 ms, because the limit is the same
- [x] Batches about 200 ms; pool about 110 ms
- [ ] Batches about 110 ms; pool about 200 ms
- [ ] Both about 110 ms, because the slow tasks overlap either way
> Each batch waits for its slowest task, so the two batches cost 100 + 100 ms. The pool starts the next item as soon as any slot frees, so the second slow task starts at 10 ms, overlapping the first, and everything finishes around 110 ms. The limit is the same; what differs is whether free slots are used immediately.
```

```quiz
Q: Why does `limit(fetchUser(id))` fail to limit concurrency, while `limit(() => fetchUser(id))` works?
- [ ] The limiter only accepts async arrow functions
- [x] `fetchUser(id)` runs immediately as the argument is evaluated, so the request has already started before the limiter can queue it
- [ ] Passing a Promise makes the limiter run tasks in reverse order
- [ ] There is no difference; both versions are limited
> Arguments are evaluated before the function is called, so `fetchUser(id)` starts the request on the spot and hands the limiter a Promise for work already in flight. A limiter can only delay work it starts itself, which is why it takes a function that creates the Promise when a slot is available.
```

## Practice

1. **Fail-fast pool.** Change `mapLimit` so that after the first failure no worker claims a new item, and the function rejects with that first error.
2. **Measure the curve.** Simulate 200 tasks with random durations between 10 and 100 ms, run them with limits 1, 2, 4, 8, 16, 32 and 200, and print total time for each. Explain where the curve flattens.
3. **Semaphore API.** Implement a `Semaphore` class with `acquire()` (returns a Promise that resolves when a slot is free) and `release()`, and rewrite the thumbnail example to use it with `try`/`finally`.
4. **Cancellable limiter.** Add an optional `signal` to the limiter's wrapped call so that queued tasks whose signal aborts are removed from the queue and rejected without running.
5. **Rate plus concurrency.** Combine a limiter of 5 with a token bucket that allows at most 10 starts per second, and show with timestamps that both limits hold.

## Quick revision {#quick-revision}

- **Concurrency limit:** at most N operations in flight; the rest wait. **Rate limit:** at most R starts per time window.
- Unbounded `Promise.all(items.map(fn))` starts every task at once: overload, `429`s, `EMFILE`, memory growth, starved browser connections.
- **Batches:** simple, but each batch waits for its slowest task.
- **Worker pool:** N workers loop `const i = next++; results[i] = await fn(items[i]);` — no idle slots, ordered results; claim **before** awaiting.
- **Limiter (`p-limit`):** queue + `active` counter; start while `active < N`; release in **`finally`**; wrap with `Promise.resolve().then(task)` to catch sync throws.
- Pass **functions**, not Promises, to limiters: `limit(() => fn(x))`.
- Error policy is explicit: fail-fast (stop claiming) or settle-all (record each outcome).
- No threads, no locks: single-threaded JavaScript makes `next++` safe.
- Choose N by measuring; start near browser per-host limits (~6 for HTTP/1.1), API limits, or DB pool size.
- Long-running producers need **backpressure**, or the queue grows without bound.

## Key takeaways {#key-takeaways}

- `Promise.all` over a large list starts everything at once; bound the number of tasks in flight to protect clients, servers and memory.
- A worker pool keeps exactly N tasks running and starts the next one as soon as a slot frees, which beats fixed batches whenever task durations vary.
- Store results by input index to keep order, and claim each item synchronously before awaiting it.
- Always release a slot in `finally`; a limiter that leaks slots on failure eventually stops running anything.
- Limiters take functions that start work, not Promises of work already started.
- A concurrency limit is not a rate limit; real clients often need both, plus retries with backoff for the requests that still get rejected.
