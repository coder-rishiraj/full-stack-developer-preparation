---
summary: Loops repeat code until a condition says stop. You will learn exactly how JavaScript's three classic loops — `for`, `while` and `do...while` — execute, how `let` gives each iteration of a `for` loop its own variable, and how to avoid the off-by-one errors, infinite loops and mutation bugs that cause most loop failures.
difficulty: beginner
minutes: 45
objectives:
  - Trace the execution order of a `for` loop's initialisation, test, body and update, and explain how it maps to a `while` loop
  - Choose between `for`, `while` and `do...while` based on what controls the repetition
  - Explain why closures created in a `for (let …)` loop capture different values but `for (var …)` closures share one
  - Debug off-by-one errors, floating-point counters, infinite loops and arrays modified during iteration
  - Explain why a long-running loop freezes a web page and how `await` inside loops changes timing
---

## Introduction

Computers are useful because they repeat work tirelessly: render every row of a table, sum every item in a cart, retry a failed request until it succeeds, read lines until a file ends. Writing `console.log(items[0]); console.log(items[1]); …` by hand is impossible when you do not know how many items there will be. You need a way to say "do this, then check whether to do it again".

That is a **loop**. Every loop has the same three ingredients: some **state** that changes (a counter, a position, a remaining-attempts number), a **condition** that is checked to decide whether to continue, and a **body** — the code that is repeated. JavaScript has several loop statements, and this lesson covers the three that it inherited from C:

- **`for`** — packs the setup, the condition and the step into one line. Natural when you are counting.
- **`while`** — checks a condition before each repetition. Natural when you do not know in advance how many repetitions there will be.
- **`do...while`** — runs the body first and checks afterwards, so the body always runs at least once.

```javascript title="three-loops.js"
let sum = 0;
for (let i = 1; i <= 4; i++) {
  sum += i;
}

let n = 37;
let steps = 0;
while (n !== 1) {                  // Collatz: unknown number of steps
  n = n % 2 === 0 ? n / 2 : 3 * n + 1;
  steps++;
}

let tries = 0;
do {
  tries++;                         // runs once even though the condition is false
} while (tries < 0);

console.log(sum, steps, tries);
```

```output
10 21 1
```

The loops that walk *values* in a collection — `for...of` and `for...in` — have their own lesson, [[b1-for-of-in]]. Ending a loop early with `break` and skipping an iteration with `continue` are covered in [[b1-break-continue]]. This lesson builds the foundation both rely on.

## Before you start

- **if / else and truthiness** — a loop condition is tested exactly like an `if` condition. See [[b1-if-else]] and [[b1-truthy-falsy]].
- **Comparison operators** — `<`, `<=`, `!==` decide when loops stop. See [[b1-comparison-operators]].
- **Increment and compound assignment** — `i++`, `i += 2`. See [[b1-unary-operators]] and [[b1-assignment-operators]].
- **let vs var** — loop variables behave differently with each. See [[b1-var-let-const]].
- **Closures** (helpful for one section) — a function remembers the variables around it. See [[b1-closures]].

## The intuition

Think of running laps on a track while a coach holds a clipboard. Before each lap, the coach checks the clipboard: "fewer than 10 laps done?" If yes, you run a lap and the coach adds a tally mark. If no, you stop. That is a `while` loop: **check, then run**.

A `for` loop is the same coach with a pre-printed form: one line says where the tally starts (0), one says the rule for continuing (fewer than 10), one says how to update the tally after each lap (add one). The form makes the counting visible in one place instead of spread across the code.

A `do...while` loop is a coach who says "run one lap, then we'll see". You always run at least once, and the check happens at the finish line.

The analogy is good for the order of operations. It misses one thing: a loop does not stop *during* a lap when the condition becomes false. The condition is checked only at the boundary between laps, so a body that makes the condition false still runs to its end.

## The while loop

The simplest loop is `while`:

```text
while ( condition ) statement
```

The steps are: evaluate `condition` and convert it with ToBoolean; if truthy, run the statement (usually a `{ }` block) and go back to the test; if falsy, continue after the loop. If the condition is falsy the very first time, the body **never runs**.

```javascript title="while-basics.js"
// Halve a number until it drops below 1, counting how many halvings it took.
let value = 100;
let halvings = 0;
while (value >= 1) {
  value /= 2;
  halvings++;
}
console.log(halvings, value);

// The body never runs when the condition starts false.
let queue = [];
while (queue.length > 0) {
  console.log('processing', queue.shift());
}
console.log('queue was empty');
```

```output
7 0.78125
queue was empty
```

`while` is the right choice when the number of iterations depends on something you discover as you go: data arriving, a value converging, a queue draining, a user answering. Notice that **the body must change something the condition depends on**. In the first loop, `value /= 2` moves `value` towards the exit. Forget that line and the loop runs forever.

## The do...while loop

```text
do statement while ( condition );
```

`do...while` runs the body first and tests afterwards. The body therefore runs **at least once**, even when the condition is false from the start.

```javascript title="do-while.js"
// Retry an unreliable operation up to 3 times.
// The fake operation fails twice, then succeeds, so the output is deterministic.
let calls = 0;
function fetchStatus() {
  calls++;
  return calls >= 3 ? 'ok' : 'error';
}

let attempt = 0;
let status;
do {
  attempt++;
  status = fetchStatus();
  console.log(`attempt ${attempt}: ${status}`);
} while (status !== 'ok' && attempt < 3);
```

```output
attempt 1: error
attempt 2: error
attempt 3: ok
```

This "try first, then decide whether to try again" shape is exactly what `do...while` is for: retries, menus that are shown and then repeated if the user picks "again", and reading input until it is valid. Notice that `status` is declared *before* the loop. A `let` declared inside the `do` block would not be visible in the `while (…)` condition, because the condition is outside the block.

In practice `do...while` is the least used of the three. Whenever you write one, check whether the "at least once" behaviour is genuinely what you want; often a `while` loop is clearer.

## The for loop

### Anatomy

```text
for ( initialisation ; condition ; update ) statement
```

The three parts in the parentheses are separated by semicolons:

- The **initialisation** runs **once**, before anything else. Usually it declares a counter: `let i = 0`.
- The **condition** is tested **before each iteration**, including the first. If it is falsy, the loop ends.
- The **update** runs **after each iteration**, before the next test. Usually it advances the counter: `i++`.

The order is the part to memorise: **init → test → body → update → test → body → update → … → test fails**.

```javascript title="for-order.js"
const log = (msg) => { console.log(msg); return true; };

for (let i = 0, ok = log('init'); log(`test i=${i}`) && i < 2; log(`update`), i++) {
  console.log(`  body i=${i}`);
}
```

```output
init
test i=0
  body i=0
update
test i=1
  body i=1
update
test i=2
```

The trace shows every rule. Initialisation printed once. The test ran three times — once more than the body — because the final test is the one that fails. The update ran after each body and before the next test.

### Dry run

For `for (let i = 0; i < 3; i++) total += i * 10;` with `total` starting at 0:

| Step | What runs | `i` | Condition `i < 3` | `total` after step |
|---|---|---|---|---|
| 1 | initialisation | 0 | — | 0 |
| 2 | test, body | 0 | true | 0 |
| 3 | update, test, body | 1 | true | 10 |
| 4 | update, test, body | 2 | true | 30 |
| 5 | update, test | 3 | false | 30 (loop ends) |

After the loop, the condition is false — `i` reached 3. With `let`, `i` no longer exists outside the loop; with `var`, it would still be 3 (more on this below).

### A for loop is a while loop with organised parts

Any `for` loop can be rewritten as a `while`:

```javascript title="for-as-while.js"
const prices = [4, 10, 6];

let totalFor = 0;
for (let i = 0; i < prices.length; i++) {
  totalFor += prices[i];
}

let totalWhile = 0;
{
  let i = 0;                       // initialisation
  while (i < prices.length) {      // condition
    totalWhile += prices[i];       // body
    i++;                           // update
  }
}
console.log(totalFor, totalWhile);
```

```output
20 20
```

The equivalence is almost exact; the one difference — how `let` behaves per iteration — gets its own section below. The benefit of `for` is that all the loop-control logic sits on one line. A reader can see where the loop starts, when it stops and how it moves without reading the body. That is why `for` is the default for counting, and `while` for everything else.

### Optional parts and for (;;)

Each of the three parts is optional. Leaving out the initialisation or update is occasionally useful when the counter is managed elsewhere. Leaving out the **condition** means "always true", so `for (;;)` is an infinite loop — identical in meaning to `while (true)` — that must be exited from inside with `break`, `return` or `throw`:

```javascript title="for-ever.js"
// Find the first power of 2 above 1000. The exit is inside the body.
let power = 1;
for (;;) {
  power *= 2;
  if (power > 1000) break;
}
console.log(power);
```

```output
1024
```

The semicolons are still required: `for ()` is a syntax error.

### Several variables: the comma operator

The initialisation can declare several variables, and the update can use the comma operator to perform several expressions. The standard use is the **two-pointer** technique, where one index moves forward and another backward:

```javascript title="two-pointers.js"
function isPalindrome(text) {
  for (let left = 0, right = text.length - 1; left < right; left++, right--) {
    if (text[left] !== text[right]) {
      return false;
    }
  }
  return true;
}
console.log(isPalindrome('racecar'), isPalindrome('react'));
```

```output
true false
```

The pointers meet in the middle, so the loop does about half as many comparisons as the string has characters. This pattern appears constantly in algorithm work; see [[a2-two-pointers]].

## let in a for loop: one variable per iteration

This is the behaviour that makes `for` loops different from the `while` rewrite, and it is a staple interview question. Consider creating a function in each iteration and calling them all after the loop has finished:

```javascript title="var-vs-let.js"
const withVar = [];
for (var i = 0; i < 3; i++) {
  withVar.push(() => i);
}

const withLet = [];
for (let j = 0; j < 3; j++) {
  withLet.push(() => j);
}

console.log(withVar.map((f) => f()));
console.log(withLet.map((f) => f()));
```

```output
[ 3, 3, 3 ]
[ 0, 1, 2 ]
```

With `var`, there is **one variable `i`** for the whole function (or script). All three arrow functions close over that same variable, and when they finally run, the loop has finished and `i` is 3. The famous `setTimeout` version of this — `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` printing `3 3 3` — is the same effect, with the callbacks running after the loop because timers run later via the event loop ([[b1-event-loop]]).

With `let`, the specification does something special: it creates a **fresh binding of `j` for every iteration**. Each arrow function closes over its own iteration's `j`, so they return 0, 1 and 2.

How does a fresh variable get the right value? The specification's `CreatePerIterationEnvironment` step runs once after initialisation and then **at the end of every iteration, before the update**. It creates a new environment and copies the current value into it; the update (`j++`) then increments the *new* copy. You can observe the timing by changing the variable inside the body:

```javascript title="per-iteration-copy.js"
const seen = [];
for (let i = 0; i < 6; i++) {
  seen.push(() => i);
  i++;                 // modifies this iteration's binding, which the closure shares
}
console.log(seen.map((f) => f()));
```

```output
[ 1, 3, 5 ]
```

In the first iteration, the closure captures the binding holding 0; the body then increments that same binding to 1. At the end of the iteration, the value 1 is copied into a fresh binding for the next iteration, and the update makes the copy 2. The first closure keeps seeing its own binding, which is 1. Writing to the loop variable inside the body is confusing and rarely a good idea — the example only demonstrates the mechanism.

The practical rule: **declare loop counters with `let`**. Closures and asynchronous callbacks created in the loop then see the value from their own iteration. This topic is explored further in [[b1-closures-in-loops]].

> [!WARNING] const in a classic for loop
> `for (const i = 0; i < 3; i++)` runs the first iteration and then throws `TypeError: Assignment to constant variable.` when `i++` tries to change it. Per-iteration copying does not help, because the update still assigns to the binding. (`const` is fine in `for...of`, where each iteration *declares* a new variable rather than updating one.)

### Scope of the loop variable

A `let` counter exists only inside the loop. A `var` counter belongs to the enclosing function and remains after the loop:

```javascript title="loop-scope.js"
for (var v = 0; v < 3; v++) {}
console.log('var after loop:', v);

for (let w = 0; w < 3; w++) {}
try {
  console.log(w);
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
var after loop: 3
ReferenceError: w is not defined
```

Occasionally you *want* the final counter value after a loop — for example, the index where a search stopped. Then declare the variable before the loop (`let i = 0; for (; i < n; i++) …`) so its scope is explicit, rather than relying on `var` leaking.

## Choosing a loop

| Situation | Loop | Why |
|---|---|---|
| Counting a known range, or needing the index | `for` | Start, stop and step are visible on one line |
| Walking every value of an array, string, `Map` or `Set` | `for...of` ([[b1-for-of-in]]) | No index bookkeeping, no off-by-one risk |
| Repeating until something happens (queue empty, value converges, data ends) | `while` | The condition is the only thing that matters |
| The body must run once before the check (retry, prompt, read-then-test) | `do...while` | Guarantees one execution |
| Transforming or filtering an array into a new array | `map` / `filter` ([[b1-array-map-filter-reduce]]) | Expresses intent; no mutation of shared state |

A useful test: if you can say "for each X", use `for...of` or an array method. If you can say "from A to B in steps of C", use `for`. If you can only say "until …", use `while`.

## How it works internally

At the language level, every loop is built from the same parts as `if`: a condition converted with ToBoolean and a jump. The specification describes loop bodies in terms of **completion records**: if the body completes normally or with a `continue` aimed at this loop, the loop goes on; if it completes with a `break` aimed at this loop, the loop ends normally; and any other abrupt completion — a `return`, a `throw`, or a `break` aimed at an outer statement — propagates out of the loop. That mechanism is what [[b1-break-continue]] builds on.

V8 compiles a loop into bytecode with a test, a conditional jump out, the body, and a **`JumpLoop`** instruction back to the test. For `for (let i = 0; i < n; i++) s += i;`, Node.js 22's `--print-bytecode` output contains, in order, `TestLessThan`, `JumpIfFalse` (exit), `Add`, `Inc` and `JumpLoop`. When the counter's per-iteration copy cannot be observed — no closure captures it — the engine does not actually allocate a new environment each time; the per-iteration semantics cost nothing in the common case.

`JumpLoop` is also where V8 counts how hot a loop is. A long-running loop in a function that started in the interpreter can be switched into optimised machine code **while it is running**, a technique called **on-stack replacement (OSR)**. You never have to do anything to get it; it is why a tight numeric loop in JavaScript can run at speeds close to compiled languages.

### Loops and the main thread

JavaScript in a browser tab runs on a single **main thread**, which also handles rendering and user input. While a loop is running, nothing else on that thread can happen: clicks are not processed, the page does not repaint, timers do not fire. A loop that takes two seconds freezes the page for two seconds, and a loop that never ends freezes it until the browser offers to stop the script. This is not a property of loops specifically — any long synchronous work blocks the thread — but loops are the usual way to create such work. The event loop and long tasks are covered in [[b1-event-loop]] and [[b1-long-tasks]]; the remedies are to do less work, split it into chunks that yield between them, or move it to a Web Worker.

## Worked example: paginated fetching with while, and timing with await

Real loops often wait for asynchronous work. A common case is fetching every page of a paginated API, where you do not know how many pages exist until you see a response with no "next" cursor. That is a `while` (or `do...while`) problem. The example below uses a fake API so it runs anywhere.

```javascript title="paginate.mjs"
// A fake paginated API: three pages, each returning a cursor to the next page.
const PAGES = {
  start: { items: ['a', 'b'], next: 'p2' },
  p2: { items: ['c', 'd'], next: 'p3' },
  p3: { items: ['e'], next: null },
};
async function fetchPage(cursor) {
  await new Promise((resolve) => setTimeout(resolve, 10)); // simulate network delay
  return PAGES[cursor];
}

async function fetchAll() {
  const all = [];
  let cursor = 'start';
  let requests = 0;
  const MAX_REQUESTS = 50;            // safety valve against an API that never ends

  while (cursor !== null && requests < MAX_REQUESTS) {
    const page = await fetchPage(cursor);
    requests++;
    all.push(...page.items);
    cursor = page.next;
  }
  return { all, requests };
}

console.log(await fetchAll());
```

```output
{ all: [ 'a', 'b', 'c', 'd', 'e' ], requests: 3 }
```

The design decisions:

- **`while` with a cursor** because the number of pages is unknown. The condition depends on data that arrives inside the body.
- **`await` inside the loop** pauses the function until each page arrives, so requests happen one after another. That is required here — you need page 1's cursor to ask for page 2. While the function is paused, the main thread is free; `await` does not block the page the way a busy loop does.
- **A maximum request count** stops a buggy server that always returns a `next` cursor from making your loop run forever.

(The file uses top-level `await`, so it must run as an ES module — hence the `.mjs` extension.)

### forEach does not wait

A loop statement with `await` inside runs iterations sequentially. `Array.prototype.forEach` with an `async` callback does **not** — it calls the callback for every element immediately, and ignores the promises they return:

```javascript title="foreach-async.mjs"
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withFor(ids) {
  for (let i = 0; i < ids.length; i++) {
    await wait(5);
    console.log('for: saved', ids[i]);
  }
  console.log('for: done');
}

async function withForEach(ids) {
  ids.forEach(async (id) => {
    await wait(5);
    console.log('forEach: saved', id);
  });
  console.log('forEach: done');   // runs before any item is saved
}

await withFor([1, 2]);
await withForEach([1, 2]);
await wait(20);                   // give the forEach callbacks time to finish
```

```output
for: saved 1
for: saved 2
for: done
forEach: done
forEach: saved 1
forEach: saved 2
```

In `withFor`, each `await` pauses the loop, so the saves happen in order and `for: done` comes last. In `withForEach`, `forEach` calls both callbacks synchronously; each one starts its timer and returns a promise at its first `await`, and `forEach` throws those promises away. So `forEach: done` prints first — `forEach` returned as soon as it had *started* the callbacks — and the saves arrive later. (The relative order of the two saves follows their timers; both use 5 ms, so they finish in start order.) If you need the work to finish before moving on, use a `for` or `for...of` loop with `await` (sequential), or `await Promise.all(ids.map(async …))` (parallel). The choice between them is covered in [[b1-sequential-vs-parallel]].

## In real systems

**Rendering lists.** Before frameworks, UI code built table rows with `for` loops over data. In React you map an array to elements instead, but the same loop exists inside the framework's reconciliation code.

**Retries and polling.** Clients retry failed requests with `do...while` or a bounded `for` loop and exponential backoff (`await sleep(2 ** attempt * 100)`). Polling a job status until it reaches `'done'` is a `while` loop with an `await` and a timeout.

**Streams and readers.** Reading a stream in modern JavaScript is a loop: `while (true) { const { done, value } = await reader.read(); if (done) break; … }`. The same shape appears in Node.js when reading chunks from a socket or file.

**Game loops and animation.** A game loop is conceptually `while (running) { update(); render(); }`, but in a browser it must not be a literal `while` loop — that would block rendering. Instead each frame is scheduled with `requestAnimationFrame`, so the "loop" yields to the browser between iterations ([[b1-requestanimationframe-js]]).

**Performance-sensitive code.** Hot paths in libraries (parsers, diffing, encoding) often use plain indexed `for` loops because they avoid callback overhead and allow early exit. In ordinary application code, readability matters more; modern engines optimise `for...of` and array methods well.

## Trade-offs and alternatives

Classic loops are flexible — you can go backwards, skip elements, step by two, stop early, and iterate over things that are not collections at all. That flexibility is also their cost: every index expression is a chance for an off-by-one error, and nothing in a `for` header tells the reader *why* you are looping.

Array methods (`map`, `filter`, `reduce`, `find`, `some`, `every`) express intent directly and avoid index bookkeeping, but they always visit elements in order, `forEach` and `map` cannot be stopped early, and chaining several of them makes several passes over the data. `for...of` sits in between: no index, but `break`, `continue` and `await` all work.

A note on the old "cache the length" advice — `for (let i = 0, len = arr.length; i < len; i++)`. Modern engines read `arr.length` cheaply, so caching gives no meaningful speed-up for ordinary arrays. It does change *behaviour* if the array grows or shrinks during the loop: a cached length will not see added elements and will read past the end after removals. Choose based on which behaviour you need.

## Common mistakes

> [!MISTAKE] Off-by-one with `<=` and `.length`
> Arrays are indexed from `0` to `length - 1`. `for (let i = 0; i <= arr.length; i++)` runs one extra time and reads `arr[arr.length]`, which is `undefined` — no error, just a wrong value at the end. Use `i < arr.length`. When looping over a range of numbers instead, decide explicitly whether the end is included and write `<` or `<=` to match.

**Infinite loops.** The body or update must move the state towards the exit. Common causes: forgetting `i++` in a `while` loop; updating the wrong variable (`i++` in an inner loop that tests `j`); a `continue` that skips the increment in a `while` loop ([[b1-break-continue]]); and a condition that can never become false, such as `i !== 10` when `i` steps by 3.

**Floating-point counters.** `0.1` cannot be represented exactly in binary, so adding it ten times does not give exactly `1`:

```javascript title="float-counter.js"
let x = 0;
for (let k = 0; k < 10; k++) x += 0.1;
console.log(x, x === 1);

// A loop that tests x !== 1 would never stop; this one is capped to show it.
let iterations = 0;
for (let y = 0; y !== 1 && iterations < 20; y += 0.1) iterations++;
console.log('iterations before cap:', iterations);
```

```output
0.9999999999999999 false
iterations before cap: 20
```

Count with integers and compute the fractional value from the counter (`const y = k / 10`), and use `<` rather than `!==` in conditions. See [[b1-number-representation]].

**Modifying an array while looping forward over it.** Removing an element shifts every later element left, so the next one is skipped:

```javascript title="mutate-while-looping.js"
const forward = [1, 2, 2, 3];
for (let i = 0; i < forward.length; i++) {
  if (forward[i] === 2) forward.splice(i, 1);
}
console.log('forward: ', forward);

const backward = [1, 2, 2, 3];
for (let i = backward.length - 1; i >= 0; i--) {
  if (backward[i] === 2) backward.splice(i, 1);
}
console.log('backward:', backward);
console.log('filter:  ', [1, 2, 2, 3].filter((n) => n !== 2));
```

```output
forward:  [ 1, 2, 3 ]
backward: [ 1, 3 ]
filter:   [ 1, 3 ]
```

Going forward, removing the first `2` at index 1 moves the second `2` into index 1, but `i` advances to 2 and never looks at it. Looping backward avoids the problem because removals only shift elements you have already visited. Usually the clearest fix is not to mutate at all: build a new array with `filter`.

**`var` counters captured by callbacks.** Use `let` so each iteration's callbacks see their own value.

**Using `forEach` with `async` and expecting it to wait.** Use `for`/`for...of` with `await`, or `Promise.all`.

## Interview perspective

> [!INTERVIEW] What a strong answer sounds like
> "A `for` loop runs its initialiser once, then tests before every iteration and runs the update after every iteration. With `let`, the spec creates a new binding per iteration — copied forward before the update — so closures capture each iteration's value. With `var` there's one shared binding, which is why the `setTimeout` puzzle prints the final value three times."

Questions to expect:

- **Predict the output of the `var`/`let` `setTimeout` loop**, and give two fixes: use `let`, or capture the value with an IIFE or a function parameter (the pre-ES2015 fix).
- **How many times does the condition run?** One more time than the body, when the loop ends because the condition failed.
- **`while` versus `do...while`?** The latter always runs the body once; give retry or prompt-until-valid as the use case.
- **How do you remove items from an array while iterating?** Loop backward, or build a new array with `filter`.
- **Why does an infinite loop freeze the page while an infinite chain of `setTimeout` callbacks does not?** The loop never returns control to the event loop; each timer callback finishes and lets rendering and input run between them.
- **What is the complexity of two nested loops over `n` items?** O(n²); see [[b1-nested-control-flow]] for how to recognise and reduce it.

## Practice

1. **Trace it.** Write the dry-run table for `for (let i = 10; i > 0; i -= 3) console.log(i);`. How many times does the condition run?
2. **Rewrite.** Convert a `for` loop that sums the even numbers from 0 to 100 into a `while` loop and a `do...while` loop. Which conversion needs extra care, and why?
3. **Find the bug.** `let i = 0; while (i < 5) { if (i === 2) continue; console.log(i); i++; }` never ends. Explain why and fix it.
4. **Closures.** Without running it, predict `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);` and the `let` version. Then fix the `var` version without changing `var`.
5. **Bounded retry.** Write `async function retry(fn, attempts)` that calls `fn` until it resolves or `attempts` is exhausted, waiting `100 * 2 ** n` milliseconds between attempts, and rethrows the last error.

```quiz
Q: In `for (let i = 0; i < 3; i++) { … }`, how many times is the condition `i < 3` evaluated?
- [ ] 3
- [x] 4
- [ ] 2
- [ ] 6
> The condition is checked before every iteration: for i = 0, 1 and 2 it is true and the body runs; for i = 3 it is false and the loop ends. That final failing test is the fourth evaluation.

Q: What does this print? `const fs = []; for (var i = 0; i < 3; i++) fs.push(() => i); console.log(fs.map(f => f()));`
- [ ] `[0, 1, 2]`
- [x] `[3, 3, 3]`
- [ ] `[undefined, undefined, undefined]`
- [ ] `[2, 2, 2]`
> `var` creates one variable for the whole function, and every arrow function closes over that same variable. By the time they are called, the loop has finished and `i` is 3 (the value that made `i < 3` false). With `let`, each iteration gets its own binding and the result would be `[0, 1, 2]`.

Q: Which loop guarantees that its body runs at least once?
- [ ] `while`
- [ ] `for`
- [x] `do...while`
- [ ] `for...of`
> `do...while` evaluates its condition after the body, so the body always runs once. `while` and `for` test before the first iteration, and `for...of` does nothing for an empty iterable.

Q: `[1, 2, 2, 3]` is processed with a forward `for` loop that calls `splice(i, 1)` whenever `arr[i] === 2`. What is the result?
- [ ] `[1, 3]`
- [x] `[1, 2, 3]`
- [ ] `[1, 2, 2, 3]`
- [ ] It throws a RangeError
> Removing index 1 shifts the second 2 into index 1, but the loop then increments `i` to 2 and never examines it. Iterate backward, or use `filter`, to remove every match.
```

## Quick revision {#quick-revision}

- `while (cond) body` — test first; body may run zero times; the body must move state towards the exit.
- `do body while (cond);` — body first; runs at least once; variables used in the condition must be declared outside the block.
- `for (init; cond; update) body` — order: init once → test → body → update → test …; the test runs one more time than the body.
- Any part of a `for` header is optional; a missing condition is `true`, so `for (;;)` needs an inner `break`/`return`/`throw`.
- Comma in headers: `for (let l = 0, r = n - 1; l < r; l++, r--)` for two pointers.
- `for (let …)` creates a fresh binding per iteration, copied forward before the update; closures capture each iteration's value. `var` shares one binding (`3 3 3` puzzle).
- `for (const i = 0; …; i++)` throws on the update; `const` is fine in `for...of`.
- Off-by-one: use `i < arr.length`; count with integers, not `0.1` steps; remove while iterating backward or use `filter`.
- A long loop blocks the main thread (no input, no repaint); `await` in a loop pauses without blocking.
- `await` in `for`/`while` is sequential; `forEach` ignores returned promises.
- V8: test + `JumpIfFalse` + body + `JumpLoop`; hot loops can be optimised mid-run via on-stack replacement.

## Key takeaways {#key-takeaways}

- Every loop is state, a condition checked at iteration boundaries, and a body that must move the state towards the exit.
- Use `for` for counting, `while` for "until something happens", `do...while` only when the body must run once, and `for...of` or array methods for walking collections.
- Memorise the `for` order: initialise once, then test, body, update, repeat — the last test is the one that fails.
- `let` in a `for` header gives each iteration its own variable, which is why closures in `let` loops behave and `var` loops do not.
- Most loop bugs are boundary bugs: `<` versus `<=`, floating-point steps, and arrays changing under the loop.
- Synchronous loops block the page while they run; asynchronous loops with `await` give control back between iterations.
