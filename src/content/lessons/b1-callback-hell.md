---
summary: Callback hell is what asynchronous code turns into when every step must nest inside the previous step's callback, and inversion of control is the deeper problem of handing your continuation to code you do not control. You will learn to recognise both, flatten callback code without any library, and see exactly which problems promises and async/await solve.
difficulty: intermediate
minutes: 40
objectives:
  - Explain why sequential asynchronous steps written with callbacks nest into a pyramid, and what that does to error handling
  - Identify the trust problems of inversion of control — called twice, never, too early, or with swallowed errors
  - Flatten callback code with named functions and early returns, and protect a callback with once-and-timeout guards
  - Rewrite a callback chain with promises and with async/await, and explain which guarantees promises add
  - Avoid recreating callback hell with `await` inside `forEach` and nested `.then`
---

## Introduction

Business logic is usually a sequence: find the user, load their cart, charge their card, send a receipt. In synchronous code that is four lines, one after another. In asynchronous JavaScript written with callbacks, each step can only start inside the callback of the step before it, because that is the only place its input exists. Four steps become four levels of nested functions, each with its own error check, and the code drifts rightward into a shape people call the **pyramid of doom**. That shape, and the difficulty of reading, changing and debugging it, is **callback hell**.

The nesting is the visible symptom. The deeper problem is **inversion of control**. Every time you pass a callback to someone else's function, you hand them the rest of your program and trust them to call it correctly — exactly once, at the right time, with errors reported properly. When the function belongs to a third-party library, you cannot guarantee any of that, and a single misbehaving call can, for example, charge a customer twice.

This lesson shows both problems on a realistic example, how to tame them with plain functions, and how promises and `async`/`await` solve them — along with the ways people manage to recreate callback hell with the new tools. It builds directly on [[b1-callback-concept]], especially its sections on [[b1-sync-vs-async-callbacks]] and [[b1-error-first-callbacks]].

## Before you start

- **Callbacks** — what they are, synchronous versus asynchronous calls, and the error-first convention. See [[b1-callback-concept]].
- **The event loop** — why asynchronous callbacks run later, with a fresh stack. See [[b1-event-loop]].
- **Promises** — helpful but not required; the second half of the lesson introduces the parts it uses. See [[b1-promises]] and [[b1-async-await]].

## The intuition

Imagine giving directions to a friend over the phone, but you are only allowed to give the next instruction once they call you back from the last landmark. "Call me when you reach the station. Then, when you call, I'll tell you to find the bridge, and when you call from the bridge…" Written down, each instruction sits inside the previous one. And if your friend gets lost, every single instruction needs its own "if you got lost, do this" branch.

Now imagine the friend is unreliable. Sometimes they call twice from the station, sometimes they never call, sometimes they call before they have even left. You handed them control of when your next instruction happens, and you cannot take it back. That is inversion of control.

Promises change the arrangement: instead of handing over your next instruction, the friend gives you a receipt — a promise — that will be marked "arrived" or "lost" exactly once. You decide what to do with it.

## The pyramid of doom

Here are four asynchronous steps written with error-first callbacks. Each one is faked with `setTimeout` so the example runs anywhere; in a real application they would be database queries and HTTP calls.

```javascript title="checkout-callbacks.js"
// Fake async steps with error-first callbacks.
const getUser = (id, cb) => setTimeout(() => cb(null, { id, name: 'Ada' }), 10);
const getCart = (user, cb) => setTimeout(() => cb(null, { items: 3, total: 42 }), 10);
const chargeCard = (user, amount, cb) =>
  setTimeout(() => (amount > 100 ? cb(new Error('limit exceeded')) : cb(null, 'tx-981')), 10);
const sendReceipt = (user, txId, cb) => setTimeout(() => cb(null, 'sent'), 10);

function checkout(userId, done) {
  getUser(userId, (err, user) => {
    if (err) return done(err);
    getCart(user, (err, cart) => {
      if (err) return done(err);
      chargeCard(user, cart.total, (err, txId) => {
        if (err) return done(err);
        sendReceipt(user, txId, (err, status) => {
          if (err) return done(err);
          done(null, `${user.name} paid ${cart.total}, ${txId}, receipt ${status}`);
        });
      });
    });
  });
}

checkout(7, (err, summary) => console.log(err ? `failed: ${err.message}` : summary));
```

```output
Ada paid 42, tx-981, receipt sent
```

It works, and it is short. But look at what the shape costs.

**Each step nests one level deeper.** The fourth step is four functions deep because each result exists only inside its callback. Adding a step between `getCart` and `chargeCard` — say, applying a discount code — means re-indenting everything below it.

**Error handling is copied at every level.** There are four `if (err) return done(err)` lines. Forget one and that step's error silently becomes a crash on `undefined` in the next step. A `try`/`catch` around the whole of `checkout` would not help, because each callback runs later on its own stack.

**Variables leak across levels.** The innermost callback uses `user`, `cart` and `txId` from three different scopes. That is convenient, but it means every level depends on the ones above it, and the same name `err` is shadowed four times.

**Control flow beyond "one after another" gets hard.** Loading the cart and the user's saved addresses *in parallel*, retrying a failed charge, or giving up after a timeout all require hand-written counters and flags inside the pyramid.

The rightward drift is not really the problem; deep indentation can be refactored away, as the next section shows. The lasting problems are the duplicated error handling and the trust issues that come next.

## Inversion of control

When you call `chargeCard(user, amount, callback)`, everything after the charge — sending the receipt, telling the user it worked — is inside `callback`, and `chargeCard` decides when, whether and how often it runs. For your own small functions, that is fine. When `chargeCard` comes from a payment library you did not write, you are trusting it with these promises, none of which the language enforces:

| Expectation | What a buggy or surprising callee might do |
|---|---|
| Called once | Called twice — the receipt is sent twice, or worse, the next step charges again |
| Called at all | Never called — the user waits forever, no error is reported |
| Called asynchronously | Called synchronously sometimes, so your code runs in a different order (Zalgo, see [[b1-sync-vs-async-callbacks]]) |
| Errors passed to the callback | Errors thrown, or swallowed, or passed in the wrong argument |
| Called with the right arguments | Called with `undefined`, extra arguments or the wrong `this` |

Here is the "called twice" case. An analytics library reports success after a retry, but its retry logic calls back on both attempts:

```javascript title="called-twice.js"
// Third-party code you do not control: retries, and calls back on BOTH attempts.
function trackPurchase(order, cb) {
  setTimeout(() => cb(null), 5);            // first attempt "times out" but still calls back
  setTimeout(() => cb(null), 15);           // retry also succeeds and calls back
}

let charges = 0;
function chargeCustomer(order) {
  trackPurchase(order, (err) => {
    if (err) return;
    charges += 1;                           // your code: charge after tracking
    console.log(`charged order ${order.id} (charge #${charges})`);
  });
}

chargeCustomer({ id: 'A-17' });
```

```output
charged order A-17 (charge #1)
charged order A-17 (charge #2)
```

Nothing in your code is wrong, and the customer is still charged twice. With callbacks, the only defence is to guard every callback you hand to code you do not trust.

### Defensive callbacks

Two small wrappers cover the most dangerous cases: a callback called more than once, and a callback never called.

```javascript title="guards.js"
// Allow only the first call through.
function once(fn) {
  let called = false;
  return (...args) => {
    if (called) return;
    called = true;
    fn(...args);
  };
}

// Fail with an error if the callback is not called within ms.
function withTimeout(cb, ms) {
  const guarded = once(cb);
  const timer = setTimeout(() => guarded(new Error(`no callback after ${ms} ms`)), ms);
  return (...args) => {
    clearTimeout(timer);
    guarded(...args);
  };
}

function trackPurchase(order, cb) {              // calls back twice
  setTimeout(() => cb(null), 5);
  setTimeout(() => cb(null), 15);
}
function lostRequest(order, cb) {}              // never calls back

trackPurchase({ id: 'A-17' }, once(() => console.log('charged once')));
lostRequest({ id: 'B-2' }, withTimeout((err) => console.log(err.message), 50));
```

```output
charged once
no callback after 50 ms
```

`once` remembers whether it has fired and ignores later calls. `withTimeout` starts a timer; if the real callback arrives first it cancels the timer, and if the timer wins it reports an error — and because both go through `once`, a late real callback is ignored. A third common guard defers a callback that might be called synchronously with `queueMicrotask`. These wrappers work, but you have to remember them at every call site, which is exactly the kind of discipline that fails in a large codebase. Promises build these guarantees in.

## Flattening callbacks without promises

Before promises were standard (ES2015), developers had ways to tame callback code, and they still help when you must work with callback APIs. The most effective is to stop writing anonymous functions inline and **give each step a name**, written at the top level of a module:

```javascript title="checkout-named.js"
const getUser = (id, cb) => setTimeout(() => cb(null, { id, name: 'Ada' }), 10);
const getCart = (user, cb) => setTimeout(() => cb(null, { items: 3, total: 42 }), 10);
const chargeCard = (user, amount, cb) => setTimeout(() => cb(null, 'tx-981'), 10);
const sendReceipt = (user, txId, cb) => setTimeout(() => cb(null, 'sent'), 10);

function checkout(userId, done) {
  const state = {};
  getUser(userId, onUser);

  function onUser(err, user) {
    if (err) return done(err);
    state.user = user;
    getCart(user, onCart);
  }
  function onCart(err, cart) {
    if (err) return done(err);
    state.cart = cart;
    chargeCard(state.user, cart.total, onCharged);
  }
  function onCharged(err, txId) {
    if (err) return done(err);
    state.txId = txId;
    sendReceipt(state.user, txId, onReceipt);
  }
  function onReceipt(err, status) {
    if (err) return done(err);
    const { user, cart, txId } = state;
    done(null, `${user.name} paid ${cart.total}, ${txId}, receipt ${status}`);
  }
}

checkout(7, (err, summary) => console.log(err ? `failed: ${err.message}` : summary));
```

```output
Ada paid 42, tx-981, receipt sent
```

The logic is identical, but the nesting is gone: each step is a named function one level deep, it reads top to bottom, and each step can be tested or reused on its own. Function declarations are hoisted, so `getUser(userId, onUser)` can refer to `onUser` before it appears. The price is the `state` object that carries values between steps, and the error checks are all still there. Libraries such as `async` (the npm package, not the keyword) went further, with helpers like `async.waterfall` and `async.parallel` that ran a list of callback steps, but they still could not fix the trust problems.

## How promises fix it

A **promise** is an object representing a result that is not ready yet. Instead of passing your continuation into the asynchronous function, the function returns a promise and *you* attach the continuation to it with `.then`. Control is handed back to you, and the promise implementation — not each library author — enforces the contract:

- A promise settles **at most once**: it is either fulfilled with one value or rejected with one reason, and further attempts to resolve or reject it are ignored. The "called twice" bug cannot happen.
- `.then` callbacks **always run asynchronously**, even if the promise is already settled. Zalgo cannot happen.
- An exception thrown inside a `.then` callback **rejects the next promise in the chain**, and a rejection skips forward to the nearest `.catch`. Errors propagate without an `if (err)` at every level ([[b1-error-propagation]]).
- `.then` returns a **new promise**, so steps chain flat instead of nesting ([[b1-promise-chaining]]).

The "never called" case is not solved automatically — a promise can stay pending forever — but a timeout becomes a one-liner with `Promise.race` or an `AbortSignal.timeout` ([[b1-promise-race]], [[b3-abort-timeout]]).

Here is the same checkout, first with the callback functions wrapped by `util.promisify`, then as a promise chain, then with `async`/`await`:

```javascript title="checkout-promises.js"
import { promisify } from 'node:util';

const getUser = promisify((id, cb) => setTimeout(() => cb(null, { id, name: 'Ada' }), 10));
const getCart = promisify((user, cb) => setTimeout(() => cb(null, { total: 42 }), 10));
const chargeCard = promisify((user, amount, cb) =>
  setTimeout(() => (amount > 100 ? cb(new Error('limit exceeded')) : cb(null, 'tx-981')), 10));
const sendReceipt = promisify((user, txId, cb) => setTimeout(() => cb(null, 'sent'), 10));

// 1. Promise chain: each then returns the next promise, so the chain stays flat.
function checkoutChain(userId) {
  let user, cart;
  return getUser(userId)
    .then((u) => { user = u; return getCart(user); })
    .then((c) => { cart = c; return chargeCard(user, cart.total); })
    .then((txId) => sendReceipt(user, txId).then((status) => ({ txId, status })))
    .then(({ txId, status }) => `${user.name} paid ${cart.total}, ${txId}, receipt ${status}`);
}

// 2. async/await: reads like synchronous code; one try/catch covers every step.
async function checkout(userId) {
  const user = await getUser(userId);
  const cart = await getCart(user);
  const txId = await chargeCard(user, cart.total);
  const status = await sendReceipt(user, txId);
  return `${user.name} paid ${cart.total}, ${txId}, receipt ${status}`;
}

console.log(await checkoutChain(7));
console.log(await checkout(7));

try {
  await chargeCard({ name: 'Ada' }, 500);
} catch (err) {
  console.log(`failed: ${err.message}`);      // a rejection from any await lands here
}
```

```output
Ada paid 42, tx-981, receipt sent
Ada paid 42, tx-981, receipt sent
failed: limit exceeded
```

The `async` version is the one to aim for. Each step is a line, each result is an ordinary `const`, and a single `try`/`catch` around the call handles a failure from any step — the four duplicated error checks are gone. The chain version is still flat, but it needs the outer `let` variables to share results between steps, a sign of why `await` won. Under the hood, an `async` function is still a sequence of promise callbacks: each `await` registers the rest of the function as a continuation on the awaited promise. The callbacks are still there; the language manages them for you.

> [!NOTE] Promises reduce inversion of control; they do not remove it
> You still pass callbacks to `.then`, and a library can still return a promise that never settles or that resolves with the wrong value. What changes is that the rules for *how* your callbacks are called are enforced by the language, in one place, instead of by every library author.

## Recreating callback hell with promises

New tools can be used in the old shape. Three patterns show up again and again in code review.

**Nesting `.then` inside `.then`.** `getUser(id).then((user) => getCart(user).then((cart) => chargeCard(user, cart.total).then(…)))` is the pyramid again, with promises. Return the inner promise from each `.then` instead, or use `await`.

**`await` inside `forEach`.** `forEach` calls its callback synchronously and ignores the promise an `async` callback returns, so nothing waits:

```javascript title="foreach-await.js"
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const save = async (id) => { await sleep(10 * (4 - id)); console.log(`saved ${id}`); };

async function saveAllWrong(ids) {
  ids.forEach(async (id) => { await save(id); });      // nobody waits for these
  console.log('saveAllWrong finished');
}

async function saveAllInOrder(ids) {
  for (const id of ids) await save(id);                 // one at a time, in order
  console.log('saveAllInOrder finished');
}

await saveAllWrong([1, 2, 3]);
await sleep(50);
await saveAllInOrder([1, 2, 3]);
```

```output
saveAllWrong finished
saved 3
saved 2
saved 1
saved 1
saved 2
saved 3
saveAllInOrder finished
```

`saveAllWrong` reports that it finished before any save has happened, the saves complete in whatever order they happen to finish, and a failed save would be an unhandled rejection that the caller never sees. The `for…of` loop awaits each save before starting the next. When the saves are independent, `await Promise.all(ids.map(save))` runs them in parallel and still waits for all of them and reports the first failure ([[b1-promise-all]]).

**Mixing styles without wrapping.** Calling a callback API from inside an `async` function and trying to `return` its result from the callback returns nothing useful. Convert the callback API once, at the boundary, with `util.promisify` or a `new Promise` wrapper, and use promises everywhere above it.

## In real systems

**Node.js codebases from before about 2017** are full of callback pyramids, because promises only became standard in ES2015 and `async`/`await` in ES2017 (Node.js 7.6+). Migrating them typically means promisifying the lowest layer first, then converting callers upward.

**Event-driven code** stays callback-based, and that is correct: events happen many times, which a promise cannot represent. Callback hell there looks different — listeners that register listeners — and is solved with clear state machines or async iterators, not with promises.

**Front-end code** meets the same issues with nested `.then` in data loading, and with inversion of control in third-party scripts: analytics, payment widgets and map SDKs that call your callbacks on their own schedule. Guarding those callbacks — once, timeout, ignore after unmount — is still everyday work ([[b4-effect-race-conditions]]).

**Error handling** is where the migration pays off most. Errors that used to vanish because one level forgot `if (err)` now propagate to a single `catch`, where they can be logged and reported.

## Trade-offs and alternatives

| Approach | Strengths | Weaknesses |
|---|---|---|
| Nested callbacks | No dependencies, fast, works with any API | Pyramid, repeated error checks, no guarantees |
| Named callback functions | Flat, testable steps, still no dependencies | Shared state object, error checks remain, no guarantees |
| Promise chains | Flat, settle-once, errors propagate, combinators | Sharing values between steps is clumsy |
| `async`/`await` | Reads like synchronous code, normal `try`/`catch` and loops | Easy to serialise work that could run in parallel; needs promise APIs |

Choose `async`/`await` for new code that performs a sequence of asynchronous steps. Keep callbacks for events and for synchronous helpers such as array methods. When stuck with a callback API, wrap it once and move on. The main thing `await` makes too easy is accidental serialisation: two independent `await`s in a row wait for each other for no reason, which is covered in [[b1-sequential-vs-parallel]].

## Common mistakes

> [!MISTAKE] Treating callback hell as an indentation problem
> Reformatting or flattening with named functions improves reading, but the error-handling duplication and the trust problems remain. The real fix for one-off asynchronous results is promises with `await`.

**Forgetting one `if (err)` in a chain.** One missing check lets an error turn into a `TypeError` two steps later, far from its cause.

**Calling `done` twice.** A step that reports an error but does not `return`, or a library that calls back twice, runs the rest of the chain twice. Use `return done(err)` and `once` for untrusted callees.

**Never calling back.** A branch that forgets to call `done` leaves the caller waiting forever with no error. Add timeouts around external calls.

**Nesting `.then`.** Return promises from `.then` instead of attaching `.then` inside it.

**`await` in `forEach`, `map` without `Promise.all`, or `filter` with an `async` predicate.** None of them wait. Use `for…of`, or `Promise.all(array.map(…))`.

**Wrapping instead of converting.** Writing `new Promise` around code that already returns a promise, or mixing callbacks and `await` in the same function, adds back the confusion. Convert at the boundary only.

## Interview perspective

> [!INTERVIEW] What is callback hell, and what do promises actually fix?
> "Callback hell is the nesting you get when each asynchronous step must start inside the previous step's callback, with error handling repeated at every level. The deeper issue is inversion of control: the callee owns my continuation and might call it twice, never, synchronously or with swallowed errors. Promises give control back — the function returns a value I attach handlers to — and the language guarantees settle-once, always-asynchronous handlers and error propagation. `async`/`await` then lets me write the sequence as plain statements with one `try`/`catch`."

Questions to be ready for:

- **Is callback hell just indentation?** No — named functions remove the indentation but not the repeated error checks or the trust problems.
- **What is inversion of control?** Handing your continuation to code you do not control, which then decides when and how often it runs.
- **Which inversion-of-control problems do promises solve, and which remain?** Solved: multiple calls, Zalgo, error propagation. Remaining: a promise that never settles (use a timeout), and a library returning wrong values.
- **Rewrite this nested callback code with `async`/`await`.** Promisify the leaves, `await` each step, one `try`/`catch`.
- **Why does `forEach(async …)` not wait?** It ignores the returned promises; use `for…of` or `Promise.all`.
- **How would you protect against a callback being called twice or never?** `once` plus a timeout, or wrap the API in a promise.

## Practice

1. **Refactor three ways.** Take the pyramid `checkout` and add a fifth step, `applyDiscount(cart, code, cb)`, between `getCart` and `chargeCard`. Do it in the nested version, the named-function version and the `async` version, and compare the diffs.
2. **Parallel with callbacks.** Write `loadDashboard(userId, cb)` that loads a profile, notifications and settings *in parallel* using only callbacks, calls `cb` once with all three, and calls it once with the first error. Then rewrite it with `Promise.all`.
3. **Guard an SDK.** Write `safeCall(fn, args, ms)` that calls an untrusted error-first function and returns a promise that settles at most once, rejects after `ms` milliseconds if there is no callback, and ignores any later callbacks.
4. **Find the bug.** Write a small `async` function that uses `items.map(async …)` without `Promise.all` and logs "done". Predict what is logged and in what order, then fix it two ways — sequentially and in parallel.
5. **Migrate a module.** Pick a Node.js script that uses `fs.readFile` and `fs.writeFile` with callbacks and convert it to `node:fs/promises` with `await`, keeping identical error messages.

```quiz
Q: What is the core problem that "inversion of control" describes?
- [ ] Callbacks make code indent too far to the right
- [ ] Callbacks are slower than promises
- [x] You hand your continuation to other code, which decides whether, when and how often it runs
- [ ] The event loop runs callbacks in reverse order
> Indentation is a symptom, and callbacks are not slow. The issue is trust: once you pass the rest
> of your program as a callback, the callee might call it twice, never, synchronously or with the
> wrong arguments, and the language cannot stop it.
```

```quiz
Q: Which guarantee do promises provide that raw callbacks do not?
- [ ] A promise always settles within a set time
- [x] A promise settles at most once, and its `.then` handlers always run asynchronously
- [ ] A promise runs its work on a separate thread
- [ ] A promise retries automatically on failure
> Settle-once and always-async handlers remove the "called twice" and Zalgo problems. Promises do
> not add timeouts — a promise can stay pending forever — and they run on the same single thread.
```

```quiz
Q: `async function run() { [1, 2, 3].forEach(async (id) => { await save(id); }); console.log('done'); }` — when does "done" print?
- [ ] After all three saves finish, in order
- [ ] After the first save finishes
- [x] Before any save finishes, because `forEach` ignores the promises its callback returns
- [ ] It never prints, because `forEach` cannot take an `async` function
> `forEach` calls each `async` callback synchronously; each one runs to its first `await` and
> returns a promise that `forEach` discards. The loop ends at once and "done" prints. Use `for…of`
> with `await`, or `await Promise.all(ids.map(save))`.
```

## Quick revision {#quick-revision}

- Callback hell: sequential async steps written with callbacks nest one level per step (the pyramid of doom), with `if (err) return done(err)` repeated at every level.
- `try`/`catch` around the outer call cannot catch errors from later callbacks.
- Inversion of control: the callee owns your continuation and may call it twice, never, synchronously, or with swallowed or misplaced errors.
- Defensive callbacks: `once(fn)`, a timeout that reports an error, `queueMicrotask` to force asynchrony.
- Named step functions flatten the code but keep the error checks and the trust problems.
- Promises: settle at most once, `.then` handlers always async, thrown errors become rejections, `.then` returns a new promise so chains stay flat. Pending-forever still needs a timeout.
- `async`/`await`: one statement per step, results in `const`s, one `try`/`catch` for all steps.
- Do not recreate hell: no nested `.then`; no `await` inside `forEach`; use `for…of` or `Promise.all(map)`; promisify callback APIs at the boundary.
- Keep callbacks for events (many occurrences) and synchronous helpers.

## Key takeaways {#key-takeaways}

- Callback hell is a readability and error-handling failure caused by each step's result existing only inside its callback.
- Inversion of control is the deeper issue: you trust the callee to call your code exactly once, at the right time, with errors passed correctly.
- Named functions and guards like `once` and timeouts help, but they rely on discipline at every call site.
- Promises return control to the caller and enforce settle-once, asynchronous handlers and error propagation; `async`/`await` makes the sequence read like synchronous code.
- The new tools can recreate the old problems — nested `.then` and `await` in `forEach` are the usual culprits.
