---
summary: The call stack is how a JavaScript engine keeps track of which function is running and where to go back to when it finishes. You will learn to trace pushes and pops by hand, see what a stack frame holds, understand why deep recursion throws a RangeError, and read a stack trace to find where a bug really is.
difficulty: intermediate
minutes: 50
objectives:
  - Trace the call stack of a program by hand, showing each push and pop
  - Explain what a stack frame holds and how it relates to an execution context
  - Explain why JavaScript runs one function at a time and why a busy stack delays timers and events
  - Diagnose a "Maximum call stack size exceeded" error and rewrite deep recursion so it cannot overflow
  - Read a stack trace from the top down to locate the failing line and the path that led to it
---

## Introduction

When a function calls another function, the first one has to wait. The engine must remember that it is waiting, what its local variables were, and the exact point in its code where execution should continue once the second function returns. If the second function calls a third, the same information has to be kept for it as well. Functions finish in the reverse order to the one they started in: the most recent call returns first.

A structure where the last thing added is the first thing removed is a **stack**, and the one the engine uses to track function calls is the **call stack**. Calling a function adds an entry on top. Returning removes it. Whatever is on top is the code that is running right now; everything below is waiting.

You already depend on the call stack every time you write a function call. Knowing it explicitly pays off in three practical ways. It lets you read **stack traces**, the lists of function names printed with every error, which are simply the call stack written out at the moment something went wrong. It explains the error `RangeError: Maximum call stack size exceeded` and how to fix it. And it is the first half of understanding asynchronous JavaScript: the [[b1-event-loop|event loop]] can only start a timer callback or a click handler when the call stack is empty.

## Before you start

- **Functions and calls** — defining a function, calling it, `return`. See [[b1-function-declaration]].
- **Execution contexts** — the record the engine creates for each run of a function, holding its variables and `this`. See [[b1-execution-contexts]]. This lesson is about how those records are stacked.
- **Errors and `try`/`catch`** — helpful for the sections on unwinding and traces. See [[b1-throw-try-catch]].

Recursion is used in several examples; [[b1-recursion-js]] teaches it from the start if you need it.

## The intuition

Picture reading a recipe for lasagne. Half-way down it says "make the béchamel sauce (page 40)". You put a bookmark in the lasagne page and turn to page 40. The sauce recipe says "first make a roux (page 12)", so you leave a second bookmark and turn to page 12. When the roux is done you go back to the *most recent* bookmark, finish the sauce, then go back to the bookmark before that and finish the lasagne.

Each bookmark is a note saying "this recipe is paused here". You always return to the newest one, and you cannot finish the lasagne before the sauce it is waiting for. The pile of bookmarks is the call stack.

The analogy leaves out one thing: a real stack entry stores more than a position. It also carries the paused function's own working values — its parameters and local variables — so that when the function resumes, everything is as it was.

## How calls and returns use the stack

The rules are short:

1. When a script starts, an entry for its top-level code is pushed onto the empty stack.
2. When a function is called, a new entry for that call is **pushed** on top. The caller stops at the call.
3. Only the top entry runs. JavaScript has a single call stack per thread, so one function runs at a time.
4. When the top function returns, its entry is **popped**, and the entry beneath resumes just after the call, with the return value in hand.
5. When the last entry is popped, the stack is empty and the engine has finished this piece of work.

Stack is a "last in, first out" (LIFO) structure, and these rules are what that phrase means for function calls.

### Tracing a program

```javascript title="trace.js"
function c() {
  console.log('c starts');
  console.log('c ends');
}
function b() {
  console.log('b starts');
  c();
  console.log('b ends');
}
function a() {
  console.log('a starts');
  b();
  console.log('a ends');
}
a();
console.log('back at top level');
```

```output
a starts
b starts
c starts
c ends
b ends
a ends
back at top level
```

The output has a mirrored shape — starts in one order, ends in the opposite order — and the stack is the reason. Here is every change to the stack, with the top entry written first:

| Step | Event | Stack after the event (top first) | Printed |
|---|---|---|---|
| 1 | Script starts | global | |
| 2 | `a()` is called | a, global | `a starts` |
| 3 | `a` calls `b()` | b, a, global | `b starts` |
| 4 | `b` calls `c()` | c, b, a, global | `c starts`, `c ends` |
| 5 | `c` returns | b, a, global | `b ends` |
| 6 | `b` returns | a, global | `a ends` |
| 7 | `a` returns | global | `back at top level` |
| 8 | Script ends | (empty) | |

At step 4 the stack is at its deepest: `c` is running, `b` is paused on its line `c();`, `a` is paused on its line `b();`, and the top-level code is paused on its line `a();`. `b ends` cannot be printed before `c ends`, because `b` is not on top until `c` has been popped.

```mermaid title="The stack grows with each call and shrinks with each return"
sequenceDiagram
    participant G as global
    participant A as a()
    participant B as b()
    participant C as c()
    G->>A: call a - push
    A->>B: call b - push
    B->>C: call c - push
    C-->>B: return - pop
    B-->>A: return - pop
    A-->>G: return - pop
```

Calls to `console.log` are function calls too. Each one briefly pushes an entry and pops it again; the table leaves them out to stay readable.

### The stack is not the scope chain

The stack records **who called whom**. It does not decide which variables a function can see. A function looks up outer variables in the place where it was *written* — its [[b1-scope-chain|scope chain]] — regardless of what is beneath it on the stack. In the program above, `c` cannot read a local variable of `b` even though `b` called it and sits directly below it. If the two ideas are blurred together, predictions about variable lookup go wrong; [[b1-lexical-scope]] covers the lookup rule.

## Stack Frames {#b1-stack-frames}

A **stack frame** is one entry on the call stack: the record of a single function call that has started and not yet finished. Where the previous section said "an entry is pushed", the precise statement is that a frame is pushed. If a function is called three times in a row, three frames are created one after another; if it calls itself recursively three levels deep, three of its frames are on the stack at once.

### What a frame holds

Conceptually a frame contains everything needed to run one call and to resume its caller afterwards:

| Part | Purpose |
|---|---|
| The function being run | Shown as the frame's name in debuggers and traces |
| The current position | Which line and column the call has reached; for a waiting frame, where to resume |
| Arguments and local variables | The values belonging to this call only |
| `this` for the call | Decided when the call was made |
| A link to the outer environment | Where to look for variables the function does not declare itself |

In the language specification, the thing that gets pushed and popped is the [[b1-execution-contexts|execution context]], and "stack frame" is the everyday name for it. Inside an engine the two are not quite the same: V8, for example, keeps simple local values in the frame itself or in machine registers, but moves any variable that an inner function captures into a separate object on the [[b1-heap|heap]], so that it can outlive the frame. That is how a [[b1-closures|closure]] can still read a variable after the function that declared it has returned and its frame is gone. Objects and arrays are always on the heap; a frame holds only references to them.

### Looking at frames

You can print the current stack at any moment with `console.trace`. It writes a label followed by one line per frame, top frame first.

```javascript title="frames.js"
function alpha(n) {
  const x = n + 1;
  return beta(x);
}
function beta(n) {
  console.trace('in beta, n =', n);
  return n * 2;
}
console.log(alpha(3));
```

```output
Trace: in beta, n = 4
    at beta (/private/tmp/app/frames.js:6:11)
    at alpha (/private/tmp/app/frames.js:3:10)
    at Object.<anonymous> (/private/tmp/app/frames.js:9:13)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object..js (node:internal/modules/cjs/loader:1913:10)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49
8
```

This was run with Node.js 22 from a file saved in `/tmp/app`; your paths will differ. The first three lines are the program's own frames. `beta` is on top, at line 6, column 11 — the `console.trace` call. `alpha` is waiting at line 3, column 10, which is the call `beta(x)`. `Object.<anonymous>` is the file's top-level code, waiting at line 9. It has that odd name because Node wraps each CommonJS file in an unnamed function. The remaining lines are frames from inside Node itself: the module loader that was running your file. A browser shows no such lines, because a page's script is started by the browser's native code, not by JavaScript.

Two values of `n` exist at the same moment here — `3` in `alpha`'s frame and `4` in `beta`'s — without any conflict, because each frame has its own variables.

### Frames in a debugger

When a program is paused at a breakpoint or a `debugger` statement, browser DevTools show the same information interactively in the Call Stack pane, with the top frame first. Selecting a frame shows *that* call's local variables in the Scope pane and the line it is paused on, so you can inspect what each waiting function was doing. DevTools can also hide frames from libraries ("ignore list") so that only your own code is listed. This is described from the DevTools documentation and was not run for this lesson; see [[b1-watch-scope]] and [[b1-breakpoints]].

### Names make frames readable

A frame is labelled with its function's name, so unnamed functions produce unhelpful lines. The program below throws from three different callbacks and prints the top frame of each error.

```javascript title="names.js"
function run(callback) {
  return callback();
}
function firstFrame(fn) {
  try {
    fn();
  } catch (e) {
    return e.stack.split('\n')[1].trim();
  }
}

console.log(firstFrame(() => run(() => { throw new Error('x'); })));
console.log(firstFrame(() => run(function validateCart() { throw new Error('x'); })));
const checkStock = () => { throw new Error('x'); };
console.log(firstFrame(() => run(checkStock)));
```

```output
at /private/tmp/app/names.js:12:48
at validateCart (/private/tmp/app/names.js:13:66)
at checkStock (/private/tmp/app/names.js:14:34)
```

The arrow function written directly as an argument has no name, so its frame is only a file position. The named function expression shows `validateCart`. The arrow assigned to a `const` shows `checkStock`, because a function created in an assignment to a variable takes the variable's name. In a trace with thirty frames, names are the difference between seeing the path at a glance and opening thirty locations. Give callbacks that do real work a name.

## One stack, one thing at a time

A JavaScript thread has exactly one call stack, and the engine runs the top frame until it returns. Nothing else can run on that thread while any frame is on the stack. This is why JavaScript is described as **single-threaded**, and it has a direct consequence for asynchronous code.

`setTimeout`, event listeners and promise callbacks do not run their functions "in the background". The host environment — the browser or Node.js — keeps the callback in a queue and starts it only when the stack is empty. The callback then runs on a new, short stack of its own.

```javascript title="timer.js"
function first() {
  console.log('first runs');
  setTimeout(function later() {
    console.trace('inside later');
  }, 0);
  console.log('first returns');
}
first();
console.log('script ends');
```

```output
first runs
first returns
script ends
Trace: inside later
    at Timeout.later [as _onTimeout] (/private/tmp/app/timer.js:4:13)
    at listOnTimeout (node:internal/timers:585:17)
    at process.processTimers (node:internal/timers:521:7)
```

Even with a delay of `0`, `later` runs after the whole script has finished. More telling is the trace printed inside it: `first` is not there, and neither is the top-level code. By the time `later` runs, the frame of `first` was popped long ago. `later` was started by Node's timer code, so that is what lies beneath it. `first` scheduled `later`, but it did not *call* it, and the call stack only records calls.

The same rule explains frozen pages. If a function keeps the stack occupied, queued work has to wait:

```javascript title="blocking.js"
const start = Date.now();
setTimeout(() => {
  console.log('timer fired after at least 200 ms:', Date.now() - start >= 200);
}, 0);

while (Date.now() - start < 200) {
  // busy loop: the global context stays on the stack
}
console.log('synchronous work finished');
```

```output
synchronous work finished
timer fired after at least 200 ms: true
```

The timer asked for 0 milliseconds and got at least 200, because the loop kept the stack busy. In a browser the same thing delays clicks, typing and screen updates, which is why long computations must be split up or moved to a Web Worker (a separate thread with its own call stack). See [[b1-long-tasks]] and [[b1-run-to-completion]].

### What `await` does to the stack

An `async` function does not hold its place on the stack while it waits. At an `await`, the function's frame is removed from the stack and its state is saved; the caller continues as if the function had returned a promise (which it has). When the awaited value is ready, the function is resumed on a fresh stack started by the engine's job queue. No second thread and no second stack are involved; see [[b1-await-does-not-block]].

## When an error is thrown: unwinding

`return` pops one frame. `throw` can pop many. When an error is thrown, the engine looks for an enclosing `try` block in the current function. If there is none, the frame is popped and the search continues in the caller, at the point of the call. This repeats until a `catch` is found — a process called **unwinding the stack**. Any `finally` blocks passed on the way run as their frames are removed.

```javascript title="unwind.js"
function level3() {
  console.log('level3 starts');
  throw new Error('failed in level3');
}
function level2() {
  try {
    level3();
    console.log('level2: never printed');
  } finally {
    console.log('level2 cleanup');
  }
}
function level1() {
  try {
    level2();
  } catch (e) {
    console.log('level1 caught:', e.message);
  }
  console.log('level1 continues');
}
level1();
```

```output
level3 starts
level2 cleanup
level1 caught: failed in level3
level1 continues
```

The throw in `level3` pops `level3`'s frame. `level2` has a `try` but no `catch`, so its `finally` runs and its frame is popped too; the line after the call is skipped. `level1` has a `catch`, so unwinding stops there and `level1` continues normally. If no frame had a `catch`, the stack would unwind completely and the host would report an **uncaught exception**: Node.js prints the error and exits, and a browser logs it to the console and abandons that piece of work, leaving the page running.

## Stack Overflow {#b1-stack-overflow}

A **stack overflow** happens when calls are nested so deeply that the call stack runs out of space. The engine gives the stack a fixed amount of memory; every frame uses some of it, and frames are only released when calls return. If functions keep calling without returning, the space is used up and the engine stops the program with `RangeError: Maximum call stack size exceeded` (the wording in V8, which Chrome and Node.js use; Firefox reports `InternalError: too much recursion`).

### The usual cause: recursion that never stops

```javascript title="overflow.js"
let depth = 0;
function dive() {
  depth += 1;
  dive();
}

try {
  dive();
} catch (e) {
  console.log(e instanceof RangeError, e.name + ': ' + e.message);
  console.log('reached a depth of more than 1000:', depth > 1000);
}
console.log('still running');
```

```output
true RangeError: Maximum call stack size exceeded
reached a depth of more than 1000: true
still running
```

`dive` has no **base case** — no condition under which it returns without calling itself — so each call pushes a frame and none is ever popped. The error is an ordinary exception: it unwinds the stack, which frees all those frames, and it can be caught, after which the program continues. Without the limit, the program would instead consume memory until the operating system killed the process, so the error is a safety mechanism.

The limit is not a number in the language specification. It depends on the engine, its settings, and how large each frame is. On the machine used for this lesson, Node.js 22 reached about 9,000 frames of `dive` before overflowing, and about 5,500 for a version of the function with a dozen extra local variables, because bigger frames fill the same space sooner. Treat "roughly ten thousand" as an order of magnitude and never write code that relies on a particular figure.

The same failure appears in less obvious forms:

- **A base case that is never reached**, such as counting down from `5` in steps of `2` and testing for `=== 0`.
- **Mutual recursion**, where two functions call each other. Each call still pushes a frame.
- **Accidental self-calls**: a setter that assigns to its own property (`set name(v) { this.name = v; }`) calls itself forever, as does an event handler that triggers the event it handles.
- **Correct recursion on input that is too deep**. The code is right; the data is too large for the stack.

```javascript title="mutual.js"
function isEven(n) { return n === 0 ? true : isOdd(n - 1); }
function isOdd(n) { return n === 0 ? false : isEven(n - 1); }

console.log(isEven(10));
try {
  isEven(1e6);
} catch (e) {
  console.log(e.name);
}
```

```output
true
RangeError
```

This pair is logically correct and still overflows for a million, because the answer requires a million nested calls.

### Fixing it

If the recursion is unbounded by mistake, add or correct the base case. If the recursion is correct but the input can be deep — a long linked list, a deeply nested tree, a large graph — replace the engine's call stack with a stack of your own. An array used with `push` and `pop` lives on the heap, which is limited only by available memory.

```javascript title="deep.js"
// Build a chain 100,000 objects deep: { child: { child: { ... } } }
const root = {};
let cursor = root;
for (let i = 0; i < 100_000; i++) {
  cursor.child = {};
  cursor = cursor.child;
}

function depthRecursive(node) {
  return node.child ? 1 + depthRecursive(node.child) : 1;
}

function depthIterative(node) {
  let max = 0;
  const stack = [[node, 1]];          // our own stack, stored on the heap
  while (stack.length > 0) {
    const [current, depth] = stack.pop();
    if (depth > max) max = depth;
    if (current.child) stack.push([current.child, depth + 1]);
  }
  return max;
}

try {
  depthRecursive(root);
} catch (e) {
  console.log('recursive:', e.name);
}
console.log('iterative:', depthIterative(root));

const cyclic = {};
cyclic.self = cyclic;
try {
  JSON.stringify(cyclic);
} catch (e) {
  console.log(e.name + ': ' + e.message.split('\n')[0]);
}
try {
  JSON.stringify(root);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
recursive: RangeError
iterative: 100001
TypeError: Converting circular structure to JSON
RangeError: Maximum call stack size exceeded
```

`depthIterative` does the same traversal as the recursive version but keeps its "things still to visit" in an array. The loop runs inside a single frame however deep the data is. The technique generalises to any tree or graph traversal: push the children instead of calling the function on them.

The last two results separate two errors that are often confused. `JSON.stringify` on an object that refers to itself throws a `TypeError` about a circular structure — the function detects the cycle and refuses. On an object that is not cyclic but is extremely deep, it overflows the stack like any other recursive routine, because built-in functions use the same stack.

A second technique is to break one long chain of calls into many short ones by letting the stack empty in between:

```javascript title="chunk.js"
function countDown(n, done) {
  if (n === 0) return done();
  if (n % 1000 === 0) {
    setTimeout(() => countDown(n - 1, done), 0); // start again on an empty stack
  } else {
    countDown(n - 1, done);
  }
}
countDown(100000, () => console.log('finished without overflow'));
```

```output
finished without overflow
```

Every thousandth call is scheduled with a timer instead of being made directly, so the stack never grows beyond a thousand frames. The result arrives asynchronously, which is why this version takes a callback. An `async` function that awaits between steps behaves the same way: each resumption starts on a fresh stack, so the stack does not grow across `await`s. Suspended [[b1-generators|generators]] likewise take up no stack space while paused.

> [!WARNING] Do not count on tail-call optimisation
> ES2015 specifies that a call in "tail position" (`return f(x)` in strict mode) should reuse the current frame, which would make such recursion safe at any depth. Of the major engines only JavaScriptCore (Safari) implements it; V8 and SpiderMonkey do not. Code that depends on it overflows in Chrome, Node.js and Firefox. [[b1-recursion-js]] discusses this in detail.

Two last points about diagnosis. A program that hangs without any error is not a stack overflow — an infinite `while` loop makes no calls, pushes no frames, and runs forever. And raising the limit is rarely the right fix: Node accepts a `--stack-size` flag (a V8 option, in kilobytes), but setting it too high can crash the process outright, and you cannot change the limit in your users' browsers.

## Reading Stack Traces {#b1-stack-traces}

A **stack trace** is a text listing of the frames that were on the call stack at the moment an error object was created: one line per frame, innermost first. It is the engine's answer to "how did the program get here?". Every `Error` has it in its `stack` property, and it is printed automatically for uncaught errors and when you log an error object.

### Anatomy of a trace

```javascript title="receipt.js"
function parsePrice(text) {
  const value = Number(text);
  if (Number.isNaN(value)) {
    throw new TypeError('Not a number: ' + text);
  }
  return value;
}

function totalOf(items) {
  let total = 0;
  for (const item of items) {
    total += parsePrice(item.price);
  }
  return total;
}

function printReceipt(order) {
  console.log('Total:', totalOf(order.items));
}

printReceipt({ items: [{ price: '120' }, { price: 'abc' }] });
```

```output
/private/tmp/app/receipt.js:4
    throw new TypeError('Not a number: ' + text);
    ^

TypeError: Not a number: abc
    at parsePrice (/private/tmp/app/receipt.js:4:11)
    at totalOf (/private/tmp/app/receipt.js:12:14)
    at printReceipt (/private/tmp/app/receipt.js:18:25)
    at Object.<anonymous> (/private/tmp/app/receipt.js:21:1)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object..js (node:internal/modules/cjs/loader:1913:10)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)

Node.js v22.22.3
```

Read it in this order:

1. **The header line**, `TypeError: Not a number: abc`, gives the error's type and message. Read it before anything else; it often answers the question on its own. (The three lines above it are an extra that Node prints for uncaught errors: the source line that threw.)
2. **The first `at` line** is the top of the stack — the function that was running when the error was created. `parsePrice`, file `receipt.js`, line 4, column 11. That is where the error *surfaced*.
3. **Each following line is that function's caller.** `parsePrice` was called by `totalOf` at line 12, which was called by `printReceipt` at line 18, which was called by the top-level code at line 21. Reading downward takes you backward in time.
4. **Lines that are not your code** — here everything beginning `node:internal` — are the platform or a library. Skip them at first.

The working method: find the *first line that points into your own code* and open it. If that line looks correct, move down one frame and ask what the caller passed in. In this example the top frame says a price could not be parsed, but `parsePrice` is doing its job. The useful question is where `'abc'` came from, and walking down the frames leads to the order object built at line 21. The top frame tells you where the program noticed the problem; the cause is often a few frames below, or in the data.

### Where the trace is captured

In V8 the `stack` property is filled in when the error object is **constructed**, not when it is thrown. Usually these happen on the same line (`throw new Error(...)`), so the distinction is invisible. It shows when an error is created in one place and thrown in another:

```javascript title="captured.js"
function makeError() {
  return new Error('made here');
}
function thrower() {
  const err = makeError();
  throw err;
}
try {
  thrower();
} catch (e) {
  console.log(e.stack.split('\n').slice(0, 3).join('\n'));
}
```

```output
Error: made here
    at makeError (/private/tmp/app/captured.js:2:10)
    at thrower (/private/tmp/app/captured.js:5:15)
```

The top frame is `makeError`, at the `new Error` on line 2, although the `throw` is on line 6. Helper functions that build errors therefore add a frame of their own to the top of every trace. V8 provides `Error.captureStackTrace(err, fn)` to re-capture a trace while leaving out `fn` and everything above it; it is a V8 feature, available in Node.js and Chromium browsers, and not part of the language standard.

### The format is not standardised

The `stack` property has been provided by every engine for many years, but its text format is defined by each engine, not by the ECMAScript specification. V8 writes `at parsePrice (file:line:column)`. Firefox and Safari write `parsePrice@file:line:column`, with no header line inside `stack`. Because of this, do not write program logic that parses `stack` strings; treat a trace as something for people and logging tools to read.

V8 also limits how many frames it records. `Error.stackTraceLimit` defaults to `10`:

```javascript title="limit.js"
function down(n) {
  if (n === 0) throw new Error('bottom');
  down(n - 1);
}
try {
  down(50);
} catch (e) {
  console.log(Error.stackTraceLimit, e.stack.split('\n').length - 1);
}
```

```output
10 10
```

Fifty-two frames were on the stack; ten were recorded. If the frame you need has been cut off, raise the limit while debugging (`Error.stackTraceLimit = 50`). The `receipt.js` trace above shows exactly ten `at` lines for the same reason.

### Traces across asynchronous code

A trace shows the stack at one moment, and asynchronous callbacks start on an empty stack. Strictly, then, an error inside a timer callback or after an `await` has no record of the code that scheduled it. Engines soften this for `async` functions:

```javascript title="async.js"
async function fetchUser() {
  await null;
  throw new Error('user service down');
}
async function loadPage() {
  await fetchUser();
}
loadPage().catch((e) => console.log(e.stack));
```

```output
Error: user service down
    at fetchUser (/private/tmp/app/async.js:3:9)
    at async loadPage (/private/tmp/app/async.js:6:3)
```

When the error was created, `loadPage` was not on the stack — it was suspended at its `await`. V8 adds the line `at async loadPage` by following the chain of promises that are waiting for `fetchUser`, so the word `async` marks a frame that has been reconstructed. This works for `async`/`await`. It does not work for plain `setTimeout` or event callbacks, as the `timer.js` example showed, although DevTools can display the scheduling code as a separate "async" section when its async stack traces feature is on. See [[b1-async-debugging]].

### Keeping the original error

A common pattern is to catch a low-level error and throw a more meaningful one. Doing so used to throw away the original trace. Since ES2022, the `cause` option keeps it:

```javascript title="cause.js"
function loadUser(id) {
  try {
    return JSON.parse('{bad json');
  } catch (err) {
    throw new Error('Could not load user ' + id, { cause: err });
  }
}
try {
  loadUser(7);
} catch (e) {
  console.log(e.message);
  console.log('cause:', e.cause.name);
  console.log(e.stack.split('\n')[1].trim());
  console.log(e.cause.stack.split('\n')[1].trim());
}
```

```output
Could not load user 7
cause: SyntaxError
at loadUser (/private/tmp/app/cause.js:5:11)
at JSON.parse (<anonymous>)
```

The new error has its own trace, starting where it was created, and `e.cause` holds the original error with *its* trace, starting inside `JSON.parse`. Node.js and browser consoles print both when the outer error is logged. See [[b1-custom-errors]].

### Traces from production code

Code shipped to browsers is usually bundled and minified, so a raw trace says something like `at t (app.3f9a.js:1:48211)`. A **source map** is a file that maps positions in the built code back to the original files and names; DevTools and error-reporting services apply it to show the trace as if the original source were running. Publishing source maps exposes your original source to anyone who downloads them, so many teams upload them only to their error-reporting service. See [[b1-source-maps]].

```quiz
Q: `a` calls `b`, and `b` calls `c`. While `c` is running, which statement is true?
- [ ] Only `c` has a frame on the stack; `a` and `b` were removed when they made their calls
- [x] The stack holds frames for `c`, `b` and `a`, with `c` on top; `b` and `a` are paused at their call sites
- [ ] `a`, `b` and `c` are running at the same time on three stacks
- [ ] `c` can read the local variables of `b` because `b` is directly below it
> A frame stays on the stack until its function returns, so callers remain beneath their callees, paused. There is one stack and only its top frame runs. Being below another frame gives no access to variables: lookup follows where functions are written, not who called them.

Q: A recursive function works for inputs up to a few thousand and throws `RangeError: Maximum call stack size exceeded` for an input of one million. The base case is correct. What is the most reliable fix?
- [ ] Wrap the call in `try`/`catch` and retry
- [ ] Add `return` before the recursive call so the engine reuses the frame
- [x] Rewrite it with a loop, using an explicit array as a stack if the algorithm needs one
- [ ] Declare the variables with `var` so the frames are smaller
> The recursion is correct but needs more nested frames than the stack can hold. A loop runs in one frame, and an explicit array lives on the heap, which is far larger. Tail-call reuse is not implemented in V8 or Firefox, so `return f(x)` still pushes a frame. Catching the error does not make the computation succeed.

Q: A stack trace begins `TypeError: Cannot read properties of undefined (reading 'id')` followed by `at formatUser`, `at renderRow`, `at renderTable`. Where should you look first?
- [ ] `renderTable`, because the bottom of the trace is where the program started
- [x] `formatUser`, at the file and line shown — then work downward through its callers to see where the `undefined` value came from
- [ ] Anywhere; the order of lines in a trace is not meaningful
- [ ] The last line, because traces are listed oldest call first
> Traces list the innermost frame first: `formatUser` is where the error was created. That line shows what failed; the frames below show who called it and with what, which is often where the real cause is.

Q: A function passed to `setTimeout` throws an error. Why does the function that called `setTimeout` not appear in the error's stack trace?
- [ ] Timer callbacks run on a separate thread with a separate stack
- [ ] The engine removes scheduling functions from traces to keep them short
- [x] By the time the callback runs, the scheduling function has returned and its frame was popped; the callback starts on a new stack
- [ ] `setTimeout` deletes the `stack` property of errors thrown inside it
> The callback is started later by the host, after the stack has emptied. The call stack records only calls that are in progress, and the scheduling function is no longer in progress. There is still only one thread and one stack.
```

## In real systems

**Error monitoring.** Services such as Sentry collect `error.stack` from users' browsers, apply source maps, and group errors by their top frames. The quality of what you see there depends directly on the habits in this lesson: named functions, errors created where the problem is detected, and `cause` chains instead of swallowed errors.

**Performance profiling.** A CPU profiler samples the call stack many times per second and counts how often each function appears. The flame charts in the DevTools Performance panel are stacks drawn sideways: width is time, and each layer is a frame sitting on its caller. A wide block is a function that kept the stack busy. See [[b1-profiling-basics]].

**Deep recursive libraries.** Recursive-descent parsers, deep-equality checks, deep cloning and recursive tree rendering can all overflow on hostile or unusual input — a JSON document nested 100,000 levels, for instance. Code that handles untrusted input should either limit depth explicitly or traverse iteratively.

**Framework stack traces.** In a React or Express application most frames in a trace belong to the framework. The reading method is unchanged: skip to the first frame in your own files. React additionally prints a "component stack", which is a list of parent components rather than a call stack.

## Trade-offs and alternatives

The call stack is fast and automatic: pushing and popping a frame is cheap, cleanup happens by itself on return, and execution order is easy to reason about because nothing interrupts a running function. Its limits are the fixed size, which caps recursion depth, and the fact that there is only one, so long-running work blocks everything else on the thread.

| Situation | Approach |
|---|---|
| Ordinary nested calls, recursion of modest depth | Use the call stack as is |
| Recursion over data that may be very deep | Loop with an explicit array-based stack or queue |
| Long computation that must not freeze the page | Split it into chunks across tasks, or use a Web Worker |
| Work that waits for input/output | `async`/`await`; the frame leaves the stack while waiting |

## Common mistakes

> [!MISTAKE] Fixing the top frame without reading the rest
> The top frame is where the error was noticed. If `parsePrice` throws because it received `'abc'`, the bug is in whatever produced `'abc'`. Read the message, find the first frame in your code, then follow the callers down until the bad value's origin is clear.

**Thinking asynchronous callbacks run on another stack or thread.** There is one stack. A callback waits in a queue until the stack is empty and then runs on it.

**Expecting `await` to keep the caller in the stack.** After an `await`, the function resumes on a new stack. Lines marked `async` in a trace are reconstructed by the engine, and plain timer or event callbacks have no such record.

**Calling an infinite loop a stack overflow.** A loop that never ends makes no nested calls and produces no error; the tab hangs. A stack overflow always comes from nested calls and always produces an error.

**Catching `RangeError` as a way to handle deep recursion.** By the time the error is thrown the work has failed, and the depth at which it fails varies between engines and devices. Remove the deep recursion instead.

**Rethrowing without the original error.** `throw new Error('failed')` inside a `catch` discards the original trace. Pass `{ cause: err }`, or rethrow the original.

**Anonymous functions everywhere.** A trace made of unnamed frames is hard to read. Name the functions that matter.

## Interview perspective

Questions on the call stack are usually the opening to questions on the event loop, so a clear, short model matters more than detail.

> [!INTERVIEW] What a strong answer sounds like
> "The call stack is a LIFO stack of frames, one per function call in progress. Calling pushes a frame with that call's locals and its return position; returning pops it and the caller continues. JavaScript has one stack per thread, so only the top frame runs. Asynchronous callbacks are queued and only start when the stack is empty, which is why blocking the stack blocks timers and rendering. The stack has a fixed size, so unbounded recursion throws a RangeError."

Questions to be ready for:

- **What happens when a function returns?** Its frame is popped, its return value is handed to the caller, and the caller resumes after the call expression.
- **Why does infinite recursion crash while an infinite loop hangs?** Each recursive call pushes a frame and the stack is finite; a loop reuses one frame.
- **Stack versus heap?** The stack holds frames for calls in progress and is released in strict last-in-first-out order. The heap holds objects, arrays, functions and captured variables, and is cleaned up by the garbage collector.
- **Where do a closure's variables live after the outer function returns?** On the heap, in an environment that the inner function references. The frame is gone.
- **How does `await` affect the stack?** The async function's frame is removed at the `await`; the function resumes later on a new stack from the microtask queue.
- **How would you make a deep recursive traversal safe?** Use an explicit stack in an array, or process in chunks across tasks. Mention that tail-call optimisation cannot be relied upon.
- **Given this trace, where is the bug?** Read the message, start at the first frame in application code, then move down to find where the bad value originated.

## Practice

1. **Trace by hand.** For `function f(n) { if (n > 0) { console.log('in', n); f(n - 1); console.log('out', n); } }`, write the full output of `f(3)` and the stack contents at its deepest point. Then run it.
2. **Measure your limit.** Use the counting technique from `overflow.js` to find the depth your engine reaches. Add ten local variables to the function and measure again. Explain the difference.
3. **Remove the recursion.** Write a function that flattens an arbitrarily nested array (`[1, [2, [3, [4]]]]`) without recursion, using an explicit stack. Test it on an array nested 100,000 levels deep.
4. **Read a trace.** Introduce a bug three calls deep in a small program of your own, run it, and write down — from the trace alone — the file, line and call path. Then check against the code.
5. **Lose and recover context.** Throw an error inside a `setTimeout` callback and inspect its trace. Then rewrite the code with `async`/`await` and a promise-based delay, and compare the traces.
6. **Add a cause.** Wrap a failing `JSON.parse` in a function that throws a domain-specific error with `cause`. Log the error in Node.js and identify both traces in the output.

## Quick revision {#quick-revision}

- The call stack is a last-in-first-out stack of frames; each frame is one function call in progress.
- Call → push a frame; return → pop it and resume the caller; uncaught throw → pop frames until a `catch` is found (unwinding), running `finally` blocks on the way.
- Only the top frame runs. One thread has one stack, so JavaScript runs one function at a time.
- A frame holds the function, its current position, its arguments and locals, and `this`; the specification's name for it is an execution context.
- Objects and captured variables live on the heap; frames hold references. Closures survive after their frame is popped.
- The stack shows who called whom. It does not determine variable lookup — that is the scope chain.
- Timer, event and promise callbacks start only when the stack is empty, on a fresh stack. Long synchronous work delays all of them.
- `await` removes the async function's frame from the stack until the awaited value is ready.
- Stack overflow: nesting deeper than the stack's fixed size → `RangeError: Maximum call stack size exceeded` (V8). The limit is engine-defined, roughly ten thousand simple frames in Node.js 22, fewer for larger frames.
- Causes: missing or unreachable base case, mutual recursion, self-triggering setters or handlers, legitimately deep data.
- Fixes: correct the base case; convert to a loop with an explicit array stack; split work across tasks. Tail-call optimisation exists only in Safari's engine.
- A cyclic object in `JSON.stringify` gives a `TypeError`, not a stack overflow; an infinite loop gives no error at all.
- Stack trace: error type and message, then frames innermost first as `function (file:line:column)`. Start at the first frame in your own code and work downward.
- V8 captures the trace when the error is constructed and records 10 frames by default (`Error.stackTraceLimit`). The text format differs between engines.
- `new Error(message, { cause })` (ES2022) preserves the original error; source maps translate minified traces back to source.

## Key takeaways {#key-takeaways}

- Function calls finish in the reverse order they began, and the call stack is the structure that makes this work: push on call, pop on return.
- Exactly one frame runs at a time, so anything that keeps the stack busy delays every timer, event and promise callback.
- Each frame has its own arguments and locals, which is what keeps recursive calls independent; values that must outlive a call are stored on the heap.
- The stack is finite. Recursion whose depth depends on input size should be written as a loop with an explicit stack.
- A stack trace is the call stack at the moment an error was created, innermost frame first; the top frame shows where the failure surfaced, and the frames below show how the program got there.
- Asynchronous callbacks begin on an empty stack, so traces lose their history across timers and events unless the engine reconstructs it for `async` functions.
