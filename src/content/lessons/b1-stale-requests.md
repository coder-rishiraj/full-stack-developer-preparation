---
summary: When several requests for the same piece of UI overlap, an old response can arrive last and overwrite a newer one. This lesson shows why that race happens, the standard fixes — request identity checks and aborting superseded work — and the related resilience patterns of timeouts, retries with backoff, and in-flight deduplication.
difficulty: intermediate
minutes: 50
objectives:
  - Explain why response completion order differs from request start order and how that produces stale UI
  - Fix stale results with request sequence numbers, aborting previous requests, or both
  - Implement a timeout that really cancels work, and tell a timeout from a user cancellation
  - Design a retry policy with exponential backoff and jitter that only retries safe, transient failures
  - Deduplicate concurrent identical requests by sharing one in-flight Promise
---

## Introduction

A user types `rea` into a search box, and the app requests results for `rea`. Before they arrive the user types `react`, and the app requests results for `react`. The `react` request happens to be answered quickly — perhaps from a server cache — and the screen shows results for `react`. Then the slower `rea` response arrives, and the code that handles it does what it always does: it puts the results on screen. The search box now says `react` while the list shows results for `rea`.

That is a **stale request**: a response to an older request that arrives after a newer one and overwrites the newer state. It is a **race condition** — the outcome depends on the timing of events the code does not control — and it is one of the most common bugs in client-side code. It appears wherever the same piece of state can be updated by overlapping async operations: search boxes, filters, tab switches, pagination, route changes, autosave.

The underlying mistake is an assumption that is easy to make and almost never stated: that responses arrive in the order requests were sent. They do not, and the code must decide explicitly which response is allowed to update the state. This lesson covers how to make that decision, and then the companion patterns that make network-dependent code robust: **timeouts**, **retries** and **deduplication**.

## Before you start

- **async/await** — how an async function suspends and resumes. See [[b1-async-await]].
- **AbortController** — creating a signal, passing it to work, and aborting it. See [[b1-abort-controller-js]].
- **Closures** — a function remembers variables from the scope where it was created, which is how a request handler remembers *which* request it belongs to. See [[b1-closures]].

Examples are ES modules run with Node 22, with the network simulated by timers so that slow and fast responses are reproducible. Browser behaviour is described, not run.

## The intuition: two letters in the mail

You move house and write to your bank twice: first with a temporary address, then a week later with your permanent one. The second letter goes by express mail and arrives first; the bank updates your address. The first letter, delayed in a sorting office, arrives afterwards — and a clerk who processes letters in the order they arrive changes your address back to the temporary one.

The clerk's mistake was treating **arrival order** as if it were **sending order**. Two fixes are available, and they map directly onto code. The clerk can check the date written on each letter and discard any that are older than the one already processed (a **sequence check**). Or you can phone the post office and have the first letter withdrawn before it is delivered (an **abort**). The analogy stops where the post office cannot always reach the letter in time — likewise, an abort does not always arrive before the response — which is why robust code often does both.

## Reproducing the bug

The fake API below answers short queries slowly and long ones quickly, which is enough to reorder responses. The handler updates a variable standing in for the screen.

```javascript title="stale-bug.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function searchApi(query) {
  await delay(query === 'rea' ? 80 : 20); // the older query is slower
  return `results for "${query}"`;
}

let screen = '';
async function onInput(query) {
  const results = await searchApi(query);
  screen = results; // whoever finishes last wins
  console.log('rendered', results);
}

onInput('rea');
onInput('react');
await delay(100);
console.log('search box: "react" | list shows:', screen);
```

```output
rendered results for "react"
rendered results for "rea"
search box: "react" | list shows: results for "rea"
```

Nothing in `onInput` is wrong in isolation; each call does the right thing for its own query. The bug is in the interaction between two calls. That is why race conditions survive code review and unit tests: they only appear when timings line up badly, which on a developer's fast local network may be rare and on a user's mobile connection may be frequent.

## Why completion order is not start order

Many things make a later request finish first:

- **Different work per request.** A broad query (`rea`) may match more rows than a specific one (`react`); a cache hit is faster than a miss.
- **Different paths.** Requests may hit different servers behind a load balancer, or one may wait behind a slow request on a busy server.
- **The network itself.** Packet loss and retransmission delay individual responses. With HTTP/2 and HTTP/3, many requests share one connection and their responses are interleaved independently, so there is no ordering guarantee between them.

So the rule is absolute: **any two overlapping requests can complete in either order**. Code that updates shared state from a response must check that the response is still wanted.

## Fix 1: tag each request and ignore old responses

Give every request an identity when it starts, remember the identity of the latest one, and after the `await`, update state only if the response belongs to the latest request. A counter is enough:

```javascript title="sequence-check.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function searchApi(query) {
  await delay(query === 'rea' ? 80 : 20);
  return `results for "${query}"`;
}

let latestRequestId = 0;
let screen = '';

async function onInput(query) {
  const requestId = ++latestRequestId; // this call's identity, kept by the closure
  const results = await searchApi(query);
  if (requestId !== latestRequestId) {
    console.log(`ignored stale "${query}"`);
    return;
  }
  screen = results;
  console.log('rendered', results);
}

onInput('rea');
onInput('react');
await delay(100);
console.log('list shows:', screen);
```

```output
rendered results for "react"
ignored stale "rea"
list shows: results for "react"
```

Each call captures its own `requestId` in a closure, while `latestRequestId` is shared. After the `await`, the comparison asks "has anyone started a newer request since I started?" If so, this response is stale and is dropped. The check must come **after** the `await` — before it, every request is the latest.

The sequence check is simple, works with any async API, and needs no cooperation from the API. Its weakness is that the stale request still runs to completion: the bytes are still downloaded, the server still does the work, and in a busy UI dozens of discarded requests may be in flight at once.

A variant compares the response with the *current input* instead of a counter: `if (query !== currentQuery) return;`. It reads naturally, but it is subtly weaker — if the user types `rea`, then `react`, then deletes back to `rea`, the first slow `rea` response matches the current input and is accepted even though a newer `rea` request exists. Usually harmless, but a counter states the intent exactly.

## Fix 2: abort the previous request

The second fix stops the old request instead of ignoring its result. Keep the controller of the request in flight, and abort it when a new request starts:

```javascript title="abort-previous.mjs"
import { setTimeout as sleep } from 'node:timers/promises';

async function searchApi(query, { signal }) {
  await sleep(query === 'rea' ? 80 : 20, null, { signal }); // stands in for fetch(url, { signal })
  return `results for "${query}"`;
}

let inFlight = null;
let screen = '';

async function onInput(query) {
  inFlight?.abort();
  const controller = new AbortController();
  inFlight = controller;
  try {
    screen = await searchApi(query, { signal: controller.signal });
    console.log('rendered', screen);
  } catch (err) {
    if (controller.signal.aborted) return console.log(`aborted "${query}"`);
    throw err;
  }
}

onInput('rea');
onInput('react');
await sleep(100);
console.log('list shows:', screen);
```

```output
aborted "rea"
rendered results for "react"
list shows: results for "react"
```

With a real `fetch`, aborting cancels the HTTP request in the browser, freeing the connection and avoiding the download (the server may or may not notice; it may already have done the work). The aborted request's Promise rejects, and the `catch` recognises the cancellation and returns quietly.

### Belt and braces

Abort alone has a narrow gap. If the old response has already arrived and its continuation is queued, but has not yet run, aborting is too late — and for APIs that ignore signals, abort does nothing. The robust pattern is therefore **abort for efficiency, and check identity for correctness**. In the abort version, the identity check is cheap: after the `await`, verify `inFlight === controller` before writing state.

## Other ways to avoid the race

- **Do not overlap.** Disable the input or the button while a request is running. This is right for actions such as "Submit payment", where overlapping requests make no sense, but wrong for search-as-you-type.
- **Reduce overlap.** Debouncing ([[b1-debounce]]) waits until the user pauses typing before sending a request. It reduces the number of requests, which is valuable, but it does **not** fix the race: two requests can still overlap whenever the user pauses, types again, and the first response is slow.
- **Key results by input.** Store responses in a cache keyed by query (`results[query] = data`) and render `results[currentQuery]`. A late response then fills its own cache slot and never touches what is on screen. Data-fetching libraries such as TanStack Query and SWR work this way, which is why they rarely show stale-request bugs ([[b4-tanstack-query]], [[b4-swr]]).
- **Sorting by completion time** never fixes anything; it only reproduces the bug in a different form.

### Stale requests in React

In React, the race usually appears in an effect that fetches when a prop changes. The pattern from the React documentation is a local flag set in the cleanup function:

```typescript title="Profile.tsx (fragment)"
useEffect(() => {
  let ignore = false;
  const controller = new AbortController();
  fetchProfile(userId, { signal: controller.signal })
    .then((profile) => {
      if (!ignore) setProfile(profile);
    })
    .catch((err) => {
      if (!controller.signal.aborted) setError(err);
    });
  return () => {
    ignore = true; // this effect's result is no longer wanted
    controller.abort(); // and stop the request itself
  };
}, [userId]);
```

React runs the cleanup before running the effect again for a new `userId` and when the component unmounts, so each effect run's flag acts as a per-request identity check. In development, React 18+ Strict Mode mounts components, unmounts them and mounts them again, so every effect runs twice; an effect without cleanup immediately shows the duplicated or out-of-order behaviour, which is the point of that check. See [[b4-fetching-in-effects]] and [[b4-effect-fetching-pitfalls]].

### The same race in writes

Stale responses are not limited to reads. An autosave that sends version 1 and then version 2 of a document can have version 1 *arrive at the server* last and overwrite version 2. Client-side identity checks cannot fix that, because the damage happens on the server. The fixes there are to serialise saves (send the next one only after the previous completes), or to include a version number and have the server reject outdated writes (optimistic concurrency, often with HTTP `If-Match` and ETags).

## How it works internally

The bug is a direct consequence of the event loop model. Each response is delivered by the browser or Node as a separate event; the continuation after `await` runs as a microtask when that event resolves the Promise ([[b1-event-loop]]). JavaScript processes those continuations in the order the responses arrive, not the order the requests were made. There is no lock or queue tying a response to "the current state of the UI"; the only link is the closure of the function that awaited it. That is why every fix works by putting information in the closure — an id, a controller, a flag — and checking it after the `await`.

## Timeouts / Retries / Deduplication {#b1-timeouts-retries}

Overlapping requests are one way async code goes wrong; slow, failing and duplicated requests are the others. Three patterns handle them. A **timeout** stops waiting for an operation that is taking too long. A **retry** tries a failed operation again, because many network failures are temporary. **Deduplication** makes several identical requests made at the same time share a single real request. Together they decide how an app behaves when the network is imperfect, which in production is always.

### Timeouts

Without a timeout, a request to a server that has stopped responding can stay pending for minutes, holding a spinner on screen or a server worker busy. Many people first write a timeout with `Promise.race`:

```javascript title="race-timeout.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function withTimeoutRace(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms),
  );
  return Promise.race([promise, timeout]);
}

let slowFinished = false;
const slow = delay(100).then(() => { slowFinished = true; });

try {
  await withTimeoutRace(slow, 20);
} catch (err) {
  console.log(err.message);
}
await delay(150);
console.log('did the slow work still finish?', slowFinished);
```

```output
timed out after 20 ms
did the slow work still finish? true
```

The caller stopped waiting, but the work carried on to completion — `Promise.race` cannot cancel anything. For a request, that means the connection stays busy and the server keeps working. (This simple version also leaves its timer running after a fast success; production code clears it.) A real timeout **cancels** the operation, which is exactly what `AbortSignal.timeout` does:

```javascript title="abort-timeout.mjs"
import { setTimeout as sleep } from 'node:timers/promises';

async function getReport({ signal }) {
  await sleep(100, null, { signal }); // stands in for fetch(url, { signal })
  return 'report';
}

try {
  await getReport({ signal: AbortSignal.timeout(20) });
} catch (err) {
  // Node's timer API wraps the reason; fetch would reject with the TimeoutError itself.
  const reason = err.cause ?? err;
  console.log(reason.name);
}
```

```output
TimeoutError
```

The timeout signal's reason is a `DOMException` named `TimeoutError`, distinct from a user's `AbortError`, so a `catch` can report "the server is slow" differently from "the user cancelled". When the user can also cancel, combine both with `AbortSignal.any([userSignal, AbortSignal.timeout(ms)])`.

Choosing the value is a product decision informed by data: set it comfortably above the operation's normal slow case (for example, a little above its 99th-percentile latency), not above its average. In a chain of services, each caller's timeout should be shorter than the timeout of whoever is calling it; otherwise the outer caller gives up while inner work continues uselessly.

### Retries

Some failures are **transient**: a dropped connection, a timeout, `503 Service Unavailable` during a deploy, `429 Too Many Requests` when a rate limit is briefly exceeded. Trying again a moment later often succeeds. Other failures are **permanent**: `400 Bad Request`, `401`, `403`, `404`, a validation error. Retrying those only wastes time and load. So the first rule of retries is: **retry only failures that can succeed next time**.

The second rule is about **safety**. A retry repeats the operation, so the operation must be **idempotent** — doing it twice must have the same effect as doing it once. `GET`, `PUT` and `DELETE` are idempotent by HTTP's definition; `POST` usually is not. A `POST /payments` that times out may have succeeded on the server, and blindly retrying it can charge the customer twice. Retry non-idempotent operations only when the server supports an **idempotency key** — a unique id sent with the request so that the server recognises and ignores a repeat ([[d4-idempotency]]).

The third rule is about **timing**. Retrying immediately hammers a server that is failing because it is overloaded. **Exponential backoff** waits longer after each failure — for example 100 ms, 200 ms, 400 ms — up to a cap. **Jitter** randomises each wait, so that thousands of clients that failed at the same moment do not all retry at the same moment too (a "thundering herd"). A widely used scheme, described by AWS as "full jitter", picks the delay uniformly between zero and the exponential value:

`delay = random(0, min(cap, base × 2^attempt))`

If the server sends a `Retry-After` header (common with 429 and 503), it states how long to wait — either a number of seconds or an HTTP date — and that value should override your own backoff.

```javascript title="retry.mjs"
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

const isRetryable = (err) =>
  err.name === 'TimeoutError' || [429, 502, 503, 504].includes(err.status);

async function retry(fn, { attempts = 4, baseMs = 100, capMs = 2000, random = Math.random } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const last = attempt === attempts - 1;
      if (last || !isRetryable(err)) throw err;
      const delayMs = Math.round(random() * Math.min(capMs, baseMs * 2 ** attempt));
      console.log(`attempt ${attempt + 1} failed (${err.message}); retrying in ${delayMs} ms`);
      await sleep(delayMs);
    }
  }
}

// A service that fails twice with 503, then recovers.
const outcomes = [503, 503, 'ok'];
const flaky = async () => {
  const next = outcomes.shift();
  if (next !== 'ok') throw new HttpError(next);
  return 'report data';
};
// random fixed at 0.5 so the printed delays are reproducible
console.log(await retry(flaky, { baseMs: 20, random: () => 0.5 }));

try {
  await retry(async () => { throw new HttpError(404); });
} catch (err) {
  console.log('not retried:', err.message);
}
```

```output
attempt 1 failed (HTTP 503); retrying in 10 ms
attempt 2 failed (HTTP 503); retrying in 20 ms
report data
not retried: HTTP 404
```

The loop has a hard limit (`attempts`), classifies errors before retrying, grows the delay exponentially with a cap, and randomises it. The 404 is thrown at once because no amount of retrying will make a missing resource appear. In real use, `random` is `Math.random` and you would add a `signal` option so that cancellation also stops the waits between attempts.

Retries multiply load: if each of three service layers retries three times, one user request can become 27 calls to the bottom layer. Production systems therefore retry at one layer only where possible, cap the total proportion of retried requests (a **retry budget**), and stop calling a service that keeps failing (a **circuit breaker**, see [[d7-circuit-breakers]] and [[d7-retry-strategies]]).

### Deduplication

Users double-click. Three components on one page each ask for the current user. A list re-renders and asks for the same item twice. Without coordination, each call sends its own identical request. **In-flight deduplication** stores the Promise of a request that is already running, keyed by what it asks for, and hands that same Promise to anyone else who asks before it finishes:

```javascript title="dedupe.mjs"
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const inFlight = new Map();
function dedupe(key, fn) {
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = fn().finally(() => inFlight.delete(key)); // forget it when settled
  inFlight.set(key, promise);
  return promise;
}

let networkCalls = 0;
async function fetchUser(id) {
  networkCalls += 1;
  await delay(30);
  return { id, name: 'Ada' };
}

const [a, b, c] = await Promise.all([
  dedupe('user:1', () => fetchUser(1)),
  dedupe('user:1', () => fetchUser(1)),
  dedupe('user:2', () => fetchUser(2)),
]);
console.log(a === b, networkCalls);

await dedupe('user:1', () => fetchUser(1)); // the first one finished, so this is a new request
console.log(networkCalls);
```

```output
true 2
3
```

The two `user:1` callers received the same Promise, so they got the very same object, and only two network calls were made for three requests. The `finally` removes the entry whether the request succeeds or fails, which matters: if a failed Promise stayed in the map, every later caller would receive the same old failure instead of trying again. Removing it on settlement also means this is deduplication of *concurrent* requests, not a cache — the next call after completion makes a fresh request. Adding a time-to-live to keep results for a while turns it into a cache, which is what SWR and TanStack Query do.

Two cautions. Every caller shares one result object, so a caller that mutates it changes it for the others; treat shared results as read-only. And sharing complicates cancellation: if one caller aborts, the shared request must not be cancelled for the others. Libraries solve this by reference counting — aborting the underlying request only when every interested caller has gone away.

### Putting them together

The three patterns layer in a particular order. Deduplication goes outermost, so concurrent callers share one entire retried operation. Retry wraps each attempt. A timeout applies **per attempt**, so a single slow attempt can be retried — with an overall deadline as well, if the user should not wait through every attempt. Retries go only on idempotent operations, and every level respects the caller's `AbortSignal`.

## Worked example: a robust search client

This example combines stale-request protection with deduplication. The search function aborts the previous search, keeps an identity check as a second guard, and shares identical in-flight queries.

```javascript title="search-client.mjs"
import { setTimeout as sleep } from 'node:timers/promises';

let serverCalls = 0;
async function searchApi(query, { signal }) {
  serverCalls += 1;
  await sleep(query.length < 4 ? 80 : 20, null, { signal });
  return `results for "${query}"`;
}

function createSearch(render) {
  let current = null;
  return async function search(query) {
    current?.abort();
    const controller = new AbortController();
    current = controller;
    try {
      const results = await searchApi(query, { signal: controller.signal });
      if (current !== controller) return; // identity check: a newer search exists
      render(results);
    } catch (err) {
      if (controller.signal.aborted) return; // superseded: not an error
      render(`error: ${err.message}`);
    }
  };
}

const search = createSearch((text) => console.log('render:', text));
search('rea');
search('reac');
await search('react');
console.log('server calls made:', serverCalls);
```

```output
render: results for "react"
server calls made: 3
```

Only the newest search renders. The two earlier requests were aborted and ended quietly. In this simulation the server was still called three times because each keystroke started a request; adding a debounce in front of `search` would reduce that count, and the stale-request protection would remain necessary for the cases debounce cannot prevent.

## In real systems

- **Search and filtering UIs** combine debounce, abort-previous and an identity check, or delegate the whole problem to a query library keyed by the search term.
- **Data-fetching libraries** (TanStack Query, SWR, RTK Query, Apollo) deduplicate identical in-flight queries, cache by key, retry failed queries with exponential backoff by default (TanStack Query retries failed queries three times on the client), and pass an `AbortSignal` to your query function.
- **HTTP clients and SDKs** (the AWS SDK, Google Cloud clients, gRPC) build in retries with backoff and jitter, honour `Retry-After`, and expose per-attempt and total timeouts.
- **Servers** apply timeouts to every outgoing call and database query, propagate deadlines downstream, and use idempotency keys for payment-like operations (Stripe's API is the well-known example).

## Trade-offs and alternatives

The **sequence check** is cheap and universal but wastes the bandwidth and server work of stale requests. **Abort** saves that work but needs signal support all the way down and still benefits from an identity check. **Disabling input** removes the race entirely at the cost of responsiveness. **Keyed caching** avoids most races structurally and adds reuse, at the cost of cache invalidation questions.

**Timeouts** that are too short fail healthy-but-slow operations; too long and users stare at spinners. **Retries** improve success rates for transient failures but add latency and load, and are dangerous on non-idempotent operations. **Deduplication** saves requests but shares results and failures among callers. Each of these is a small piece of code; the hard part is choosing the policy, and the policy should be driven by the operation's idempotency and by real latency and error data.

## Common mistakes

> [!MISTAKE] Showing whichever response arrives last
> Writing state unconditionally after `await` assumes responses arrive in request order. They do not. Every handler that writes shared state from a response needs an identity check or an abort-previous strategy.

**Checking identity before the await.** The comparison must happen after the response arrives; before it, every request is the latest.

**Showing an error for aborted requests.** Cancellation is expected. Check `signal.aborted` and return quietly.

**Assuming debounce fixes the race.** It reduces how often requests overlap; it does not prevent overlap.

**Timeouts with `Promise.race` alone.** The caller stops waiting but the request keeps running. Abort it, for example with `AbortSignal.timeout`.

**Retrying everything.** Retrying 4xx errors wastes load; retrying non-idempotent `POST`s duplicates orders and payments; retrying without backoff and jitter amplifies outages; retrying without a limit never ends.

**Leaving failed Promises in a dedupe map.** Remove entries in `finally`, or every future caller receives the old failure.

## Interview perspective

"Implement a search box" or "what is wrong with this effect?" questions are usually testing for stale requests. Name the race explicitly ("responses can arrive out of order"), then give layered fixes: debounce to cut request volume, abort the previous request to save work, and an identity check (sequence number or effect cleanup flag) for correctness. Mention that aborted requests must not surface as errors.

For resilience questions, interviewers listen for the policy, not just the loop: which errors you retry (timeouts, 429, 5xx — not other 4xx), why idempotency matters, exponential backoff with jitter and a cap, honouring `Retry-After`, timeouts per attempt plus an overall deadline, and retry amplification across layers. Implementing `retry(fn, attempts)` or `dedupe(key, fn)` is a common live-coding task ([[b1-impl-retry-sleep]]).

> [!INTERVIEW] A compact answer to "how do you prevent stale results?"
> "Completion order isn't start order, so each request needs an identity. I abort the previous request with an AbortController — that saves bandwidth — and after the await I check that this request is still the latest before setting state, because abort can't catch a response that has already arrived. Aborted requests end silently. In React that's the cleanup function setting an `ignore` flag and calling `abort()`."

```quiz
Q: A search handler debounces input by 300 ms and then writes the response to state. Can it still show stale results?
- [ ] No — debouncing guarantees only one request is in flight
- [x] Yes — if the user pauses, types again after 300 ms, and the first response is slower, the old response can still arrive last
- [ ] No — browsers deliver responses in request order on the same connection
- [ ] Only if the server returns an error
> Debouncing reduces how many requests are sent, but two requests separated by a pause can still overlap, and nothing orders their responses. HTTP/2 multiplexes responses independently, so even one connection gives no ordering guarantee. An identity check or aborting the previous request is still required.
```

```quiz
Q: Which retry policy is safest for `POST /orders` that sometimes times out?
- [ ] Retry immediately up to five times
- [ ] Retry with exponential backoff and jitter
- [x] Retry only if the request carries an idempotency key the server uses to ignore duplicates
- [ ] Never time out the request, so no retry is needed
> A timed-out POST may have succeeded on the server, so any retry risks creating a second order. Backoff and jitter protect the server's load but not the correctness of a non-idempotent operation. With an idempotency key, the server recognises the repeat and returns the original result, which makes retrying safe. Removing the timeout leaves users waiting forever.
```

```quiz
Q: In a dedupe helper, why must the in-flight entry be deleted in `finally` rather than only after success?
- [ ] `finally` runs before the Promise settles, so it is faster
- [x] Otherwise a failed request stays in the map and every later caller receives the same old rejection without retrying
- [ ] Map entries cannot hold rejected Promises
- [ ] It prevents two callers from receiving the same Promise
> If only successes remove the entry, a rejected Promise remains stored forever and each new call returns it, so the operation can never be attempted again. `finally` runs after the Promise settles either way. Sharing one Promise between concurrent callers is the purpose of the helper, so the last option is backwards.
```

## Practice

1. **Reproduce and fix.** Recreate the stale-search bug with three queries and random delays. Fix it first with a sequence number, then with abort-previous, and log how many requests completed versus how many were rendered.
2. **Effect cleanup.** Write a React effect that loads a product by `productId`, with abort and an `ignore` flag, and explain what happens in Strict Mode during development.
3. **Retry with `Retry-After`.** Extend `retry` so that if an error carries a `retryAfter` value (seconds or an HTTP date string), the wait uses it instead of the computed backoff.
4. **Cancellable retry.** Add a `signal` option to `retry` that stops both the current attempt and the wait between attempts.
5. **Dedupe with shared cancellation.** Extend `dedupe` so each caller can pass its own signal, and the underlying request is aborted only when all callers have aborted.

## Quick revision {#quick-revision}

- **Stale request:** an older response arrives after a newer one and overwrites state. Cause: completion order ≠ start order.
- **Sequence check:** `const id = ++latest; await ...; if (id !== latest) return;` — check **after** the await.
- **Abort previous:** keep the in-flight controller; `abort()` on a new request; ignore aborts in `catch`.
- Do both: abort saves work; the identity check guarantees correctness.
- Debounce reduces overlap but does not fix it. Keyed caches avoid it structurally.
- React: cleanup sets `ignore = true` and calls `abort()`; Strict Mode (18+) runs effects twice in development.
- Writes can race on the server: serialise saves or use versions/ETags.
- **Timeout:** `Promise.race` stops waiting only; `AbortSignal.timeout(ms)` cancels; reason name `TimeoutError`.
- **Retry:** only transient errors (timeouts, 429, 502–504), only idempotent operations (or idempotency keys), exponential backoff + full jitter + cap + attempt limit; honour `Retry-After`.
- **Dedupe:** `Map<key, Promise>`; return the existing Promise; delete in `finally`; results are shared and read-only.
- Layering: dedupe → retry → per-attempt timeout, all respecting the caller's signal.

## Key takeaways {#key-takeaways}

- Overlapping requests can complete in any order, so every response that updates shared state must prove it is still wanted.
- Aborting superseded requests saves work; an identity check after the await is what guarantees correctness — robust code does both.
- A timeout must cancel the work, not just stop waiting for it, and should be distinguishable from user cancellation.
- Retries help only for transient failures on idempotent operations, and need backoff, jitter and a limit to avoid making outages worse.
- Deduplication shares one in-flight Promise between identical concurrent requests and must forget it once settled.
