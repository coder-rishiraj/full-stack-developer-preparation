---
summary: '`break` ends a loop or `switch` early and `continue` skips to the next iteration. You will learn exactly where each one sends execution in every kind of loop, how they interact with `switch` and `finally`, why they cannot cross a function boundary (so they do not work inside `forEach`), and how labels let them target an outer loop.'
difficulty: beginner
minutes: 40
objectives:
  - Trace where `break` and `continue` transfer control in `for`, `while`, `do...while`, `for...of` and `switch`
  - Explain why `continue` in a `while` loop can cause an infinite loop while the same code in a `for` loop does not
  - Predict how `break`, `continue` and `return` interact with `try...finally`
  - Use labelled `break` and `continue` to control nested loops, and judge when a function with `return` is clearer
  - Replace `forEach` with a loop or with `some`, `every` or `find` when early exit is needed
---

## Introduction

Loops are written to repeat, but real work often needs to deviate from the plan. When searching a list for a matching user, there is no reason to keep looking after you find one. When processing log lines, you want to skip blank lines without wrapping the rest of the body in an `if`. When reading messages from a queue, a special "shutdown" message should end the loop immediately.

JavaScript gives you two statements for this:

- **`break`** ends the loop (or `switch`) immediately. Execution continues with the first statement after it.
- **`continue`** ends only the **current iteration**. The loop then carries on with its next iteration.

```javascript title="first-look.js"
const readings = [12, -1, 15, 0, 999, 18];

let total = 0;
for (const r of readings) {
  if (r === 999) break;      // sentinel: stop reading entirely
  if (r < 0) continue;       // invalid reading: skip just this one
  total += r;
}
console.log(total);
```

```output
27
```

The loop added 12, skipped `-1`, added 15 and 0, then hit `999` and stopped; `18` was never looked at.

These look simple, and mostly they are. The details that trip people up are *where exactly* each statement sends execution — which differs between loop types — what happens when they meet a `switch` or a `finally` block, and the fact that they are bound to the **syntax** around them, not to whatever is running at the time. That last point is why `break` cannot stop a `forEach`. This lesson covers all of these, and then **labels**, the mechanism that lets `break` and `continue` target a loop other than the innermost one.

## Before you start

- **Loops** — `for`, `while` and `do...while`, especially the order in which a `for` loop runs its update and test. See [[b1-for-loops]].
- **for...of** — and the iterator `return()` method called when it exits early. See [[b1-for-of-in]].
- **switch** — `break` is how cases usually end. See [[b1-switch]].
- **try / catch / finally** — needed for one section; the basics are recapped there. See [[b1-throw-try-catch]].

## The intuition

Picture a loop as laps around a running track, with a gate at the start line where the condition is checked.

- **`continue`** is "abandon this lap": you stop where you are, cut straight back to the start line, and the next lap begins as usual (with whatever bookkeeping happens between laps).
- **`break`** is "leave the track": you walk out through the nearest exit and carry on with your day. No more laps.

And for nested loops, think of a small track inside a large one. An unlabelled `break` or `continue` always applies to the **innermost** track you are on. A **label** is a sign on a track — "outer" — so you can say "leave the *outer* track" from inside the inner one.

The analogy is accurate except for one thing: what "cutting back to the start line" involves depends on the kind of loop, as the next section shows.

## break

`break` without a label ends the nearest enclosing **loop** (`for`, `while`, `do...while`, `for...of`, `for...in`) or **`switch`**. Control moves to the statement immediately after it.

The most common use is ending a **search** as soon as the answer is known:

```javascript title="break-search.js"
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bo' },
  { id: 3, name: 'Cy' },
];

let match = null;
let checks = 0;
for (const user of users) {
  checks++;
  if (user.name === 'Bo') {
    match = user;
    break;                       // no need to look at Cy
  }
}
console.log(match, 'after', checks, 'checks');
```

```output
{ id: 2, name: 'Bo' } after 2 checks
```

Without `break`, the loop would compare every element. For three users that does not matter; for a million it does, and if the comparison is expensive (a network call, a regular expression), stopping early is a real saving. It also makes intent explicit: "the first match is all I want."

The other classic use is ending an **open-ended loop** from inside — a `while (true)` or `for (;;)` where the exit condition is only known partway through the body:

```javascript title="break-while-true.js"
const messages = ['hello', 'world', 'SHUTDOWN', 'ignored'];
let i = 0;

while (true) {
  const msg = messages[i++];
  if (msg === undefined || msg === 'SHUTDOWN') break;
  console.log('handling', msg);
}
console.log('worker stopped');
```

```output
handling hello
handling world
worker stopped
```

The exit test needs the message that was just read, so it naturally sits in the middle of the body. Writing it as `while (msg !== 'SHUTDOWN')` would require reading the first message before the loop and again at the end of the body — duplicated code that is easy to get wrong. `while (true)` with `break` is a well-understood idiom for exactly this shape.

## continue

`continue` without a label ends the **current iteration** of the nearest enclosing loop. It is not valid in a `switch` on its own — only in loops. Where control goes next depends on the loop type:

| Loop | After `continue`, control goes to… |
|---|---|
| `for (init; test; update)` | the **update**, then the test |
| `while (test)` | the **test** |
| `do { } while (test)` | the **test** (at the bottom) |
| `for...of` / `for...in` | the next value or key |

The usual purpose of `continue` is a **guard clause inside a loop**: deal with the cases you want to skip at the top of the body, so the main logic below is not nested inside an `if`.

```javascript title="continue-guard.js"
const lines = ['# comment', 'name=Ana', '', 'role=admin', 'broken line'];
const config = {};

for (const line of lines) {
  if (line === '' || line.startsWith('#')) continue;   // skip blanks and comments
  const eq = line.indexOf('=');
  if (eq === -1) {
    console.log('skipping malformed line:', line);
    continue;
  }
  config[line.slice(0, eq)] = line.slice(eq + 1);
}
console.log(config);
```

```output
skipping malformed line: broken line
{ name: 'Ana', role: 'admin' }
```

Compare this with the version without `continue`, which nests the real work two `if`s deep. With guards, each special case is handled and dismissed in one place, and the happy path reads straight down — the same reasoning as guard clauses with `return` in functions ([[b1-if-else]]).

### The while-loop trap

The table above has a consequence that causes real bugs. In a `for` loop, the update (`i++`) lives in the header, so `continue` still runs it. In a `while` loop, the update is an ordinary statement in the body — and if `continue` jumps past it, the counter never changes:

```javascript title="continue-while-trap.js"
// for: continue still runs i++, so this terminates.
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log('for', i);
}

// while: continue skips i++ when i === 2, so i stays 2 forever.
// A safety counter stops the demo instead of hanging.
let i = 0;
let iterations = 0;
while (i < 5 && iterations < 20) {
  iterations++;
  if (i === 2) continue;
  console.log('while', i);
  i++;
}
console.log('while loop stopped at i =', i, 'after', iterations, 'iterations');
```

```output
for 0
for 1
for 3
for 4
while 0
while 1
while loop stopped at i = 2 after 20 iterations
```

Without the safety counter, the `while` loop would never end. The fix is to update the state **before** any `continue` (for example, increment at the top of the body), or to use a `for` loop so the update is guaranteed to run. In a `do...while`, `continue` jumps to the test at the bottom, so the same caution applies.

## Where break and continue are allowed

`break` and `continue` are matched with their target loop **when the code is parsed**, by looking at the surrounding source text. They are not run-time instructions that search for "whatever loop is currently running". This has two important consequences.

**They are syntax errors outside a loop (or `switch`, for `break`).** You cannot `break` out of an `if`:

```javascript title="illegal-break.js"
for (const code of ['if (ok) { break; }', 'continue;']) {
  try {
    new Function('ok', code);
  } catch (err) {
    console.log(`${err.name}: ${err.message}`);
  }
}
```

```output
SyntaxError: Illegal break statement
SyntaxError: Illegal continue statement: no surrounding iteration statement
```

(Messages are from V8 in Node.js 22. `new Function` is used only so the parse errors can be caught and printed.)

**They cannot cross a function boundary.** A function body is a fresh context: a `break` inside a callback does not see the loop that happens to be calling the callback. This is why you cannot stop a `forEach`:

```javascript title="foreach-break.js"
try {
  new Function(`
    [1, 2, 3].forEach((n) => {
      if (n === 2) break;
    });
  `);
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
SyntaxError: Illegal break statement
```

From the parser's point of view, the arrow function's body contains a `break` with no loop around it — the loop inside `forEach` is somewhere in the engine's implementation, not in your source. A `return` inside the callback only ends that one call, so it behaves like `continue`, not `break`.

When you need to stop early, use a construct that supports it:

```javascript title="early-exit-alternatives.js"
const orders = [
  { id: 'a', total: 20 },
  { id: 'b', total: 250 },
  { id: 'c', total: 80 },
];

// for...of supports break directly.
for (const order of orders) {
  if (order.total > 100) {
    console.log('first large order (loop):', order.id);
    break;
  }
}

// Array methods that stop as soon as the answer is known:
console.log('find: ', orders.find((o) => o.total > 100).id);
console.log('some: ', orders.some((o) => o.total > 100));
console.log('every:', orders.every((o) => o.total < 100));

// Proof that some() stops early:
orders.some((o) => {
  console.log('  some() visited', o.id);
  return o.total > 100;
});
```

```output
first large order (loop): b
find:  b
some:  true
every: false
  some() visited a
  some() visited b
```

`find` returns the first matching element, `findIndex` its index, `some` stops at the first `true` and `every` at the first `false`. Each of these expresses the *question* being asked, which is often clearer than a loop with a flag and a `break`.

## break and continue inside switch

`break` applies to the nearest loop **or** `switch`. Inside a `switch` that is inside a loop, a plain `break` exits only the `switch` — the loop keeps going. `continue`, which never applies to `switch`, goes straight to the loop's next iteration:

```javascript title="switch-in-loop.js"
const commands = ['add', 'skip', 'add', 'stop', 'add'];
let count = 0;

for (const cmd of commands) {
  switch (cmd) {
    case 'add':
      count++;
      break;             // leaves the switch only
    case 'skip':
      continue;          // next iteration of the for...of loop
    case 'stop':
      break;             // also leaves only the switch: the loop goes on
  }
  console.log(`after ${cmd}: count = ${count}`);
}
```

```output
after add: count = 1
after add: count = 2
after stop: count = 2
after add: count = 3
```

The author probably wanted `'stop'` to end the loop, but the `break` was "eaten" by the `switch`. Fixes: use a labelled `break` (see the Labels section below), put the loop in a function and `return`, or check for `'stop'` with an `if` before the `switch`. This exact bug is examined again in [[b1-nested-control-flow]].

## break, continue and finally

A `try...finally` block guarantees that its `finally` part runs however the `try` part is left — normally, by an exception, or by a `return`, `break` or `continue`. Jumping out of a `try` with `break` or `continue` therefore runs the `finally` block **first**, then performs the jump:

```javascript title="finally-runs.js"
for (let i = 0; i < 3; i++) {
  try {
    if (i === 1) continue;
    if (i === 2) break;
    console.log('body', i);
  } finally {
    console.log('finally', i);
  }
}
console.log('after loop');
```

```output
body 0
finally 0
finally 1
finally 2
after loop
```

For `i === 1`, `continue` ran the `finally` and then moved to the next iteration; for `i === 2`, `break` ran the `finally` and then left the loop. This is what makes `finally` reliable for cleanup — releasing a lock, closing a file — even inside loops that skip or exit.

The flip side is a trap. If the `finally` block itself performs a `break`, `continue`, `return` or `throw`, it **replaces** whatever the `try` block was doing — including a `return` value or a thrown error:

```javascript title="finally-overrides.js"
function surprising() {
  for (;;) {
    try {
      return 'from try';
    } finally {
      break;               // discards the pending return
    }
  }
  return 'after loop';
}
console.log(surprising());
```

```output
after loop
```

The `return 'from try'` was pending when the `finally` ran; the `break` replaced it, the loop ended and the function returned `'after loop'`. Errors are swallowed the same way. Never put control-flow statements in a `finally` block; ESLint's `no-unsafe-finally` rule (in its recommended set) reports them.

## How it works internally

The specification models every statement as producing a **completion record**: a type (`normal`, `break`, `continue`, `return` or `throw`), a value, and — for `break` and `continue` — a **target** label, which is empty when no label is written.

When a `break` runs, it produces a break completion. That abrupt completion propagates outward through enclosing statements, each of which gets a chance to react. A loop or `switch` that receives a `break` with an empty target consumes it and finishes normally. A loop that receives a `continue` with an empty target (or one naming that loop) moves to its next iteration — through the specification's `LoopContinues` check. A `try` statement with a `finally` intercepts any completion, runs the `finally` block, and then re-issues the original completion — unless the `finally` block produced its own abrupt completion, which wins. That last rule is exactly the "finally overrides" behaviour shown above.

Engines do not build completion records at run time for this. Because the target of every `break` and `continue` is known when the code is parsed, V8 compiles them into plain **jump** instructions in the bytecode — to the end of the loop for `break`, to the update or test for `continue`. When a `finally` block is in the way, the compiler routes the jump through the `finally` code first. So `break` and `continue` cost nothing beyond a jump.

## Labels {#b1-labels}

A **label** is a name, followed by a colon, placed in front of a statement — usually a loop. It lets a `break` or `continue` inside nested code say *which* enclosing statement it means, instead of always meaning the innermost loop.

```text
outer: for (…) {
  for (…) {
    break outer;      // leave the loop named outer
    continue outer;   // start the next iteration of the loop named outer
  }
}
```

### The problem labels solve

Unlabelled `break` and `continue` apply to the **innermost** loop. With nested loops, that is often not what you want. Consider searching a grid for a value: when you find it, you want to stop *both* loops. A plain `break` only ends the inner loop, and the outer loop starts its next row:

```javascript title="unlabelled-nested.js"
const grid = [
  [4, 7, 1],
  [9, 3, 8],
  [5, 2, 6],
];

let visits = 0;
for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {
    visits++;
    if (grid[r][c] === 3) break;    // ends only the inner loop
  }
}
console.log('visits without label:', visits);
```

```output
visits without label: 8
```

After finding 3 in row 1, the outer loop moved on and scanned all of row 2. Without labels, the usual workaround is a **flag variable** that the outer loop checks — extra state that must be set and tested correctly in two places.

### Labelled break

Name the outer loop and break out of it by name:

```javascript title="labelled-break.js"
const grid = [
  [4, 7, 1],
  [9, 3, 8],
  [5, 2, 6],
];

let found = null;
let visits = 0;
search: for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {
    visits++;
    if (grid[r][c] === 3) {
      found = { r, c };
      break search;               // leaves both loops at once
    }
  }
}
console.log(found, 'visits with label:', visits);
```

```output
{ r: 1, c: 1 } visits with label: 5
```

`break search` ends the statement labelled `search` — the outer loop — and everything inside it. Execution continues after the outer loop. Five cells were visited instead of eight, and no flag was needed.

### Labelled continue

`continue label` ends the current iteration of the **labelled** loop and starts its next iteration, abandoning whatever inner loops were running. A typical use is "skip the rest of this row as soon as one cell disqualifies it":

```javascript title="labelled-continue.js"
const rows = [
  ['ok', 'ok', 'ok'],
  ['ok', 'bad', 'ok'],
  ['ok', 'ok', 'ok'],
];

const validRows = [];
rows: for (let r = 0; r < rows.length; r++) {
  for (const cell of rows[r]) {
    if (cell === 'bad') continue rows;   // reject this row, move to the next one
  }
  validRows.push(r);                     // reached only if no cell was bad
}
console.log(validRows);
```

```output
[ 0, 2 ]
```

The line after the inner loop runs only when the inner loop finished without finding a bad cell. Without the label, you would need a flag (`let ok = true; … if (!ok) continue;`) or an `every` call.

### The rules

**A label can be placed on any statement, but `continue` requires a loop.** `break label` works on a labelled block or even a labelled `if`, ending that statement early. `continue label` must name a loop, because "the next iteration" of a block means nothing:

```javascript title="labelled-block.js"
validate: {
  const input = '';
  if (input === '') {
    console.log('empty input, skipping the rest of the block');
    break validate;
  }
  console.log('this line is skipped');
}
console.log('after block');

try {
  new Function('blk: { continue blk; }');
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
empty input, skipping the rest of the block
after block
SyntaxError: Illegal continue statement: 'blk' does not denote an iteration statement
```

A labelled block with `break` is legal and occasionally seen in generated code, but in hand-written code a function with early `return` almost always reads better.

**The label must enclose the `break` or `continue`, in the same function.** Like unlabelled jumps, labels are resolved by the parser from the surrounding source text, and they stop at function boundaries. You cannot `break` to a label on a loop that is calling your callback, nor jump "sideways" to a label that is not around you:

```javascript title="label-scope.js"
for (const code of [
  'outer: for (;;) { [1].forEach(() => { break outer; }); }',
  'a: for (;;) { a: for (;;) { break a; } }',
]) {
  try {
    new Function(code);
  } catch (err) {
    console.log(`${err.name}: ${err.message}`);
  }
}
```

```output
SyntaxError: Undefined label 'outer'
SyntaxError: Label 'a' has already been declared
```

The second error shows that a label cannot be reused by a statement **nested** inside a statement with the same label. Two **sibling** loops can both be called `rows:`, because neither encloses the other.

**Labels are not variables.** They live in their own namespace, are not values, and are not in scope anywhere except the labelled statement. A variable and a label can share a name without conflict (though that would be confusing to read). A label also does not create a scope; `let` declarations inside the labelled statement are scoped by its blocks as usual.

**Name labels after what they enclose.** `rows:`, `search:`, `retry:` and `outer:` say which loop is meant. Single letters such as `a:` make `break a` hard to follow.

### An accidental label

Because any statement can be labelled, a common bug creates a label without anyone intending it. An arrow function whose body starts with `{` is a **block**, not an object literal:

```javascript title="accidental-label.js"
const makeStatus = () => { status: 'ok' };     // block containing a labelled expression
const makeStatusFixed = () => ({ status: 'ok' });

console.log(makeStatus());
console.log(makeStatusFixed());
```

```output
undefined
{ status: 'ok' }
```

In the first function, the braces are the function body, `status:` is parsed as a **label**, and `'ok'` is an expression statement that does nothing. The function has no `return`, so it returns `undefined`. Wrapping the object in parentheses forces the parser to read it as an expression. Knowing that labels exist is what makes this bug understandable.

### Labels versus extracting a function

Labels are legitimate, but many teams use them rarely, because a nested loop with a labelled jump can usually be restructured into a function whose `return` exits all the loops at once:

```javascript title="return-instead-of-label.js"
function findCell(grid, target) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === target) return { r, c };   // exits both loops
    }
  }
  return null;
}
console.log(findCell([[4, 7], [9, 3]], 3), findCell([[1]], 5));
```

```output
{ r: 1, c: 1 } null
```

The function has a name that explains the loop's purpose, can be tested on its own, and needs no label. Prefer this when the nested loop computes a result. Labels remain a good fit when extracting a function would require passing in or returning many local variables, or in performance-sensitive code that wants to avoid a call — and `continue outer` has no equally direct function-based equivalent.

> [!TIP] When you reach for a label
> First ask whether the nested loop computes a single answer. If it does, extract a function and `return`. If the loop needs to skip ahead in an outer loop while sharing lots of local state, a well-named label is clearer than a flag variable.

## In real systems

**Search and validation loops.** "Stop at the first error", "stop at the first match" and "skip invalid records" are everywhere: form validation, CSV import, log parsing. They are written either with `for...of` plus `break`/`continue` or with `find`/`some`/`every`.

**Worker and event loops.** Long-running consumers in Node.js — reading from a queue, a socket or an async iterator — are often `while (true)` or `for await` loops that `break` on a shutdown signal or end-of-stream, relying on `finally` (or the iterator's `return()`) to release resources.

**Parsers and tokenisers.** Hand-written parsers scan characters in a loop, using `continue` to skip whitespace and `break` when a token ends. Labelled loops occasionally appear in parsers and in performance-critical library code (bundler and compiler output, for example) where avoiding a function call matters.

**Code review norms.** Many style guides allow `break` and `continue` freely but discourage labels, preferring extracted functions. Some older guides discouraged `continue` too; the modern view is that `continue` used as a guard at the top of a loop body makes code flatter and clearer, while a `continue` buried halfway down a long body is easy to miss.

## Common mistakes

> [!MISTAKE] Expecting break to stop forEach
> `break` inside a `forEach` callback is a syntax error, and `return` only skips the current element. Use `for...of` with `break`, or `find` / `some` / `every`, which stop early by design.

**`continue` skipping the update in a `while` loop.** Move the update above the `continue`, or use a `for` loop whose header performs the update.

**`break` inside a `switch` meant to exit the surrounding loop.** It exits only the `switch`. Use a label, `return`, or an `if` before the `switch`.

**Unlabelled `break` in a nested loop meant to stop everything.** It only ends the inner loop. Use `break label` or extract a function and `return`.

**Putting the label on the wrong loop.** `break name` leaves the statement that carries the label `name` — nothing more. If the label sits on the inner loop, `break name` behaves like a plain `break`, and the outer loop keeps going. Put the label on the outermost statement you want to leave.

**Control flow in `finally`.** A `break`, `continue` or `return` in `finally` silently discards the pending return value or exception. Keep `finally` for cleanup only.

**Arrow function returning an object without parentheses.** `() => { a: 1 }` is a block with a label and returns `undefined`; write `() => ({ a: 1 })`.

## Interview perspective

> [!INTERVIEW] What a strong answer sounds like
> "`break` leaves the nearest loop or `switch`; `continue` jumps to the next iteration of the nearest loop — in a `for` loop that runs the update first, in a `while` loop it goes straight to the test. Both are resolved at parse time and can't cross function boundaries, so they don't work in a `forEach` callback. Labels let them target an outer statement, though I often prefer extracting a function and returning."

Questions to expect:

- **How do you break out of a `forEach`?** You cannot; use `for...of`, `some`, `every` or `find` (or throw, which is a hack).
- **What does `continue` do in a `for` loop versus a `while` loop?** The `for` loop still runs its update; the `while` loop goes straight to its test, which can cause an infinite loop if the update was skipped.
- **Does `finally` run when you `break` out of a `try`?** Yes, before the jump completes. Follow-up: what if `finally` itself has a `break` or `return`? It overrides the pending completion.
- **How do you exit two nested loops at once?** Labelled `break`, a function with `return`, or a flag — and the trade-offs between them.
- **Why does `() => { x: 1 }` return `undefined`?** The braces are a function body and `x:` is a label.

## Practice

1. **Trace it.** Predict the output of `for (let i = 0; i < 6; i++) { if (i % 2) continue; if (i > 3) break; console.log(i); }`.
2. **Fix the hang.** Rewrite `let i = 0; while (i < 10) { if (i % 3 === 0) continue; console.log(i); i++; }` so it terminates and prints the numbers from 0 to 9 that are not multiples of 3.
3. **Replace the flag.** Rewrite a nested loop that uses `let found = false` to stop both loops, first with a label and then with a function and `return`. Which do you find clearer, and why?
4. **Stop at the first failure.** Given an array of validation functions, write `firstError(value, validators)` that returns the first non-null error message without running the remaining validators. Write it once with `for...of` and once with array methods.
5. **Labelled continue.** Given an array of words, collect only those containing no repeated letter, using `continue` with a label on the outer loop.

```quiz
Q: In `for (let i = 0; i < 4; i++) { if (i === 1) continue; console.log(i); }`, what happens when `continue` runs?
- [ ] The loop ends
- [ ] Control jumps to the test without running `i++`, so the loop never ends
- [x] The update `i++` runs, then the test, then the next iteration
- [ ] The rest of the body runs and then the loop continues
> In a `for` loop, `continue` ends the current iteration and moves to the update expression before the next test. The output is 0, 2, 3. In a `while` loop there is no separate update step, so a `continue` that skips the increment can loop forever.

Q: Why is `[1, 2, 3].forEach(n => { if (n === 2) break; })` a SyntaxError?
- [ ] Because `forEach` is not allowed to contain `if` statements
- [x] Because `break` is matched to an enclosing loop by the parser, and the callback's body contains no loop
- [ ] Because `break` only works with labelled statements
- [ ] Because arrow functions run in strict mode
> `break` and `continue` are resolved from the surrounding source text, and function boundaries stop that search. The loop inside `forEach` is part of the engine, not your code, so the parser sees a `break` with nothing to break out of. Use `for...of`, `some`, `every` or `find` for early exit.

Q: A `for` loop contains `switch (cmd) { case 'stop': break; }`. What happens when `cmd` is `'stop'`?
- [ ] The loop ends
- [x] Only the switch ends; the loop continues with the statement after the switch
- [ ] The current iteration is skipped
- [ ] It is a SyntaxError to use break inside a switch inside a loop
> An unlabelled `break` targets the nearest enclosing loop or `switch`, which here is the `switch`. To end the loop, use a labelled `break`, `return` from a function, or test for `'stop'` before the switch.

Q: Which statement about labels is correct?
- [ ] `continue label` can target a labelled block
- [ ] A label creates a new variable scope
- [x] `break label` can exit any enclosing labelled statement, including a block
- [ ] A callback can `break` to a label on the loop that calls it
> `break label` ends the labelled statement, whether it is a loop, a block or an `if`. `continue label` requires a loop. Labels have their own namespace and create no scope, and they cannot be referenced across a function boundary.
```

## Quick revision {#quick-revision}

- `break` ends the nearest loop or `switch`; execution continues after it.
- `continue` ends the current iteration of the nearest loop: `for` → update then test; `while`/`do...while` → test; `for...of`/`for...in` → next item.
- `continue` in a `while` loop can skip the increment → infinite loop; update before `continue` or use `for`.
- Both are resolved at parse time from the surrounding source; outside a loop (or `switch` for `break`) they are SyntaxErrors; they cannot cross a function boundary → no `break` in `forEach`.
- Early exit alternatives: `for...of` + `break`, `find`, `findIndex`, `some` (stops at first `true`), `every` (stops at first `false`).
- `break` inside `switch` inside a loop exits only the `switch`; `continue` there targets the loop.
- `break`/`continue` out of `try` run `finally` first; control flow inside `finally` overrides pending returns and errors (ESLint `no-unsafe-finally`).
- Early exit from `for...of` calls the iterator's `return()`.
- Labels: `name: statement`; `break name` exits any labelled statement; `continue name` needs a loop; the label must enclose the jump within the same function; nested duplicate labels are errors; labels have their own namespace and no scope.
- `() => { a: 1 }` is a block with a label, returning `undefined`.
- Prefer a function with `return` to exit nested loops that compute a result; use labels when sharing much local state or for `continue outer`.

## Key takeaways {#key-takeaways}

- `break` means "leave the loop", `continue` means "skip to the next iteration", and both act on the innermost loop unless a label says otherwise.
- Where `continue` lands depends on the loop: the `for` update always runs, but a `while` loop's body-level update can be skipped.
- `break` and `continue` belong to the source code around them, which is why they cannot reach through a callback into `forEach`.
- `finally` always runs on the way out, and control-flow statements inside it override everything else — so keep them out of it.
- Labels are a precise tool for nested loops; reach for them when a flag would otherwise be needed, and prefer an extracted function when the loop computes a single result.
