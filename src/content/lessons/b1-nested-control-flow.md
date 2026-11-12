---
summary: Real programs put loops inside loops, `switch` inside `for` and `try` inside both. You will learn how nested statements execute, which loop a `break` really leaves, what nesting costs in readability and running time, and the techniques — early returns, guard clauses, extracted functions, array methods and lookup tables — that keep nested logic flat and correct.
difficulty: beginner
minutes: 40
objectives:
  - Trace nested loops over two-dimensional data and derive how many times the inner body runs
  - Predict which statement an unlabelled `break` or `continue` targets when loops, `switch` and `try` are nested, and fix the "switch ate the break" bug
  - Decide where to place `try` / `catch` relative to a loop so that one failure stops only what it should
  - Refactor deeply nested code into a flat shape using guard clauses, extracted functions, array methods and lookup tables
  - Recognise hidden nested loops and reduce an O(n × m) search with a `Set` or `Map`
---

## Introduction

The control-flow statements you have met so far — [[b1-if-else]], [[b1-switch]], the loops in [[b1-for-loops]] and [[b1-for-of-in]] — are each simple on their own. Real tasks need them together. Rendering a seating chart walks rows, and within each row walks seats. Processing orders loops over orders, decides whether each one should be billed, loops over its items, and picks a pricing rule per item type. Each of those decisions or repetitions sits *inside* another one. That is **nested control flow**: a control-flow statement whose body contains further control-flow statements.

JavaScript allows nesting to any depth. The language does not care whether your `if` is inside one loop or five. What changes with depth is everything around the language:

- **Readability.** To understand a line six levels deep, a reader must hold six enclosing conditions in their head at once.
- **Correctness.** A `break` belongs to the nearest loop *or* `switch`. With several of them around a line, it is easy to leave the wrong one.
- **Cost.** A loop inside a loop multiplies the work. Ten thousand items in each is a hundred million inner iterations.

Here is nesting used well — a short search over a grid:

```javascript title="first-positive.js"
function firstPositive(grid) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const n = grid[r][c];
      if (n > 0) return { r, c, n };   // leaves both loops and the function
    }
  }
  return null;
}
console.log(firstPositive([[-1, 0], [-2, 5]]));
console.log(firstPositive([[-1], [0, -3]]));
```

```output
{ r: 1, c: 1, n: 5 }
null
```

Three levels deep, and still easy to read: the two loops mirror the two dimensions of the data, and `return` exits everything the moment the answer is known, with no flag variable. This lesson is about writing nested code like this and recognising when nesting has gone too far.

## Before you start

- **if / else and guard clauses** — the early-`return` idea this lesson builds on. See [[b1-if-else]].
- **switch** — especially that `break` is how cases end. See [[b1-switch]].
- **Loops** — `for`, `while`, `for...of`, and per-iteration `let` bindings. See [[b1-for-loops]] and [[b1-for-of-in]].
- **break, continue and labels** — the exact rules for where each jump goes. See [[b1-break-continue]]; labels are taught in its [[b1-labels|Labels]] section.
- **try / catch** — needed for one section. See [[b1-throw-try-catch]].
- **Big-O notation** (helpful for the section on cost) — see [[a1-time-complexity]].

## The intuition

Picture each control-flow statement as a **box**. An `if` box has a question written on its lid: "is the user active?" A loop box has a label: "for each row". Nesting puts boxes inside boxes. Any line of code sits inside some stack of boxes, and the conditions on every enclosing lid are the context in which that line runs.

Reading nested code means opening the boxes one by one and remembering each lid as you go deeper. Two or three lids are easy to keep in mind. Six are not, and the reader starts to lose track of which `else` belongs to which `if` and which loop a `break` leaves. A useful test follows from the picture: **if you cannot give a short name to a box, extract it** into a function whose name says what the box does.

Where the analogy stops working: the boxes are a burden for the *reader*, not the machine. The engine executes deeply nested statements as plain tests and jumps, with no extra memory per level of nesting (the internals section shows this). Flattening code is about humans and correctness, not speed.

## Nested loops

### Walking two-dimensional data

The most natural use of nesting is data that has two dimensions: a grid, a table, a matrix, a calendar of weeks and days. The outer loop picks a row; the inner loop walks that row.

```javascript title="seat-map.js"
const seats = [
  ['A1', 'A2', 'A3'],
  ['B1', 'B2'],            // rows may have different lengths
  ['C1', 'C2', 'C3'],
];

const order = [];
for (let r = 0; r < seats.length; r++) {
  for (let c = 0; c < seats[r].length; c++) {   // bound comes from this row
    order.push(seats[r][c]);
  }
}
console.log(order.join(' '));

// Same walk with for...of when the indexes are not needed.
let count = 0;
for (const row of seats) {
  for (const seat of row) count++;
}
console.log('seats:', count);
```

```output
A1 A2 A3 B1 B2 C1 C2 C3
seats: 8
```

The inner loop runs **completely** for each single step of the outer loop. The outer loop sets `r = 0`; the inner loop then runs `c = 0, 1, 2` to the end; only then does the outer loop advance to `r = 1`, and the inner loop starts again from `c = 0`. This order — finish a whole row before moving to the next — is called **row-major order**.

| Step | `r` | `c` | Inner test `c < seats[r].length` | Visited |
|---|---|---|---|---|
| 1 | 0 | 0 | `0 < 3` true | A1 |
| 2 | 0 | 1 | `1 < 3` true | A2 |
| 3 | 0 | 2 | `2 < 3` true | A3 |
| 4 | 0 | 3 | `3 < 3` false — inner loop ends, outer advances | — |
| 5 | 1 | 0 | `0 < 2` true | B1 |
| 6 | 1 | 1 | `1 < 2` true | B2 |
| 7 | 1 | 2 | `2 < 2` false — inner loop ends, outer advances | — |
| 8 | 2 | 0 | `0 < 3` true | C1 |

Notice the inner bound: `seats[r].length`, not `seats[0].length`. Row B has only two seats, and a bound taken from the first row would read `seats[1][2]`, which is `undefined`. Writing the bound from the current row is correct for both rectangular and **jagged** arrays (rows of different lengths). Also notice the variable names. `r` and `c` (or `row` and `col`) say which dimension each index walks; nested `i` and `j` make it easy to write `grid[j][i]` by accident.

Nested loops over 2D data are not a smell. They are the clearest way to express "for every cell", and replacing them with clever array-method chains usually makes the code harder to read. Matrix traversal patterns are developed further in [[a2-matrix]].

### Inner loops that depend on the outer loop

The inner loop's range can depend on the outer variable. The classic case is "every pair of items, each pair once":

```javascript title="round-robin.js"
const players = ['Ana', 'Bo', 'Cy', 'Di'];
const matches = [];
for (let i = 0; i < players.length; i++) {
  for (let j = i + 1; j < players.length; j++) {   // start after i: no repeats, no self-pairs
    matches.push(`${players[i]}-${players[j]}`);
  }
}
console.log(matches.join(', '));
console.log(matches.length, 'matches');
```

```output
Ana-Bo, Ana-Cy, Ana-Di, Bo-Cy, Bo-Di, Cy-Di
6 matches
```

Starting `j` at `i + 1` skips pairs already produced (Bo–Ana is the same match as Ana–Bo) and the pairing of a player with themselves. For `n` players the inner body runs (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2 times: 6 for four players, 4,950 for a hundred. That is still proportional to n², just with half the constant.

### Nesting multiplies cost

A single loop over `n` items does about `n` units of work. A loop over `n` items with a loop over `m` items inside does `n × m`. When both run over the same data, that is O(n²) ([[a1-time-complexity]]). For 100 items, 10,000 inner iterations is nothing. For 100,000 items, ten billion is minutes of frozen page.

The dangerous version is the **hidden** nested loop. `array.includes(x)`, `indexOf`, `find`, `some` and `filter` all loop over the array internally. So does `array.splice` (which shifts elements). Calling one of them inside a loop is a nested loop, even though only one `for` is visible. Finding the items two lists have in common shows the problem and the standard fix:

```javascript title="common-items.js"
function makeIds(n, offset) {
  return Array.from({ length: n }, (_, i) => `user-${i + offset}`);
}

// Nested: for each a, scan all of b (includes() is a loop too).
function commonNested(a, b) {
  let comparisons = 0;
  const result = [];
  for (const x of a) {
    for (const y of b) {
      comparisons++;
      if (x === y) {
        result.push(x);
        break;
      }
    }
  }
  return { found: result.length, comparisons };
}

// One loop to build a Set, one loop to probe it.
function commonWithSet(a, b) {
  const inB = new Set(b);                    // n steps to build
  const result = a.filter((x) => inB.has(x)); // n average-O(1) lookups
  return { found: result.length, lookups: a.length };
}

const a = makeIds(5000, 0);
const b = makeIds(5000, 2500);               // half of a overlaps b
console.log(commonNested(a, b));
console.log(commonWithSet(a, b));
```

```output
{ found: 2500, comparisons: 15626250 }
{ found: 2500, lookups: 5000 }
```

The nested version made over fifteen million comparisons. The 2,500 IDs that are not in `b` each scanned all 5,000 entries (12.5 million), and the `break` saved only part of the work for the ones that were. The `Set` version made one pass to build the set and one pass of lookups, each of which a `Set` answers in constant time on average by hashing ([[b1-set]], [[a2-hashing]]). Both find the same 2,500 items. The pattern generalises: **when an inner loop exists only to search for something, build a `Set` or `Map` once outside the outer loop and look it up instead.** A `Map` from ID to object does the same job when you need the matching object rather than a yes/no ([[b1-map]]).

### Closures in nested loops

When a function is created inside nested `let` loops, it captures the binding of *each* loop variable from its own iteration. [[b1-for-loops]] explains the per-iteration binding for one loop; with two loops, both variables get it independently:

```javascript title="nested-closures.js"
const cells = [];
for (let r = 0; r < 2; r++) {
  for (let c = 0; c < 2; c++) {
    cells.push(() => `${r},${c}`);   // captures this iteration's r and this iteration's c
  }
}
console.log(cells.map((f) => f()).join(' | '));

const shared = [];
for (var r2 = 0; r2 < 2; r2++) {
  for (var c2 = 0; c2 < 2; c2++) {
    shared.push(() => `${r2},${c2}`);  // every closure sees the same two variables
  }
}
console.log(shared.map((f) => f()).join(' | '));
```

```output
0,0 | 0,1 | 1,0 | 1,1
2,2 | 2,2 | 2,2 | 2,2
```

This matters when nested loops attach event handlers to grid cells or schedule work with timers: with `let`, each handler knows its own row and column. With `var`, every handler sees the final values. See [[b1-closures-in-loops]] for more of these puzzles.

## Which statement does break belong to?

Nesting creates the most common correctness bug in this area: a `break` or `continue` that leaves the wrong statement. The rules from [[b1-break-continue]] are short:

- An unlabelled **`break`** ends the **innermost enclosing loop or `switch`**.
- An unlabelled **`continue`** goes to the next iteration of the **innermost enclosing loop**. It ignores any `switch` around it, because a `switch` has no "next iteration".
- A **labelled** `break name` or `continue name` targets the statement carrying that label.
- None of them can reach outside the function they are written in. Only `return` (or `throw`) leaves everything at once.

| Where the jump is written | Plain `break` leaves | Plain `continue` goes to |
|---|---|---|
| Inner loop inside outer loop | The inner loop only | The next iteration of the inner loop |
| `switch` inside a loop | The `switch` only | The next iteration of the loop |
| Loop inside a `switch` case | The loop only | The next iteration of that loop |
| `if` inside a loop | The loop (an `if` is not a target) | The next iteration of the loop |

```mermaid title="Where each jump goes from inside a switch inside a for loop"
flowchart TD
    J["Jump written inside a case"] --> B{"Which statement?"}
    B -- "break" --> S["Leaves the switch; the loop body continues after it"]
    B -- "continue" --> N["Skips to the loop's next iteration"]
    B -- "break label" --> L["Leaves the labelled loop"]
    B -- "return" --> F["Leaves the switch, the loop and the function"]
```

### The switch that ate the break

Here is the bug in a form you will meet in real code — a little interpreter that processes commands until it sees `'stop'`:

```javascript title="switch-ate-break.js"
function runScript(commands) {
  const log = [];
  for (const cmd of commands) {
    switch (cmd) {
      case 'beep':
        log.push('BEEP');
        break;           // ends the switch: the loop goes on, as intended
      case 'stop':
        log.push('stopping');
        break;           // meant to end the loop, but it also only ends the switch
      default:
        log.push(`unknown ${cmd}`);
    }
  }
  return log;
}
console.log(runScript(['beep', 'stop', 'beep', 'jump']));
```

```output
[ 'BEEP', 'stopping', 'BEEP', 'unknown jump' ]
```

Both `break`s look identical, and both do the same thing: they end the `switch`. The author's intent differed — "done with this command" in the first case, "done with the whole script" in the second — but `break` cannot know that. The `switch` is the innermost breakable statement, so it "eats" the `break`, and the loop carries on past `'stop'`. Nothing throws; the program simply does too much.

There are three good fixes. When the loop is the last thing the function does, **`return`** is the clearest, because it leaves every enclosing statement at once. When code must run after the loop, a **label** names the loop so that `break` can target it:

```javascript title="switch-ate-break-fixed.js"
// Fix 1: the loop lives in a function, so return leaves everything.
function runScript(commands) {
  const log = [];
  for (const cmd of commands) {
    switch (cmd) {
      case 'beep':
        log.push('BEEP');
        break;           // exits the switch only
      case 'stop':
        log.push('stopping');
        return log;      // exits the switch, the loop and the function
      default:
        log.push(`unknown ${cmd}`);
    }
  }
  return log;
}
console.log(runScript(['beep', 'stop', 'beep', 'jump']));

// Fix 2: a label names the loop, so break can target it.
const log = [];
script: for (const cmd of ['beep', 'stop', 'beep']) {
  switch (cmd) {
    case 'beep':
      log.push('BEEP');
      break;             // exits the switch only
    case 'stop':
      log.push('stopping');
      break script;      // exits the loop named script
  }
}
console.log(log);
```

```output
[ 'BEEP', 'stopping' ]
[ 'BEEP', 'stopping' ]
```

The third fix is to handle the loop-level decision **before** the `switch` — `if (cmd === 'stop') break;` as the first line of the loop body, where `break` unambiguously means the loop — and leave the `switch` to per-command work only. Whichever you choose, when a `switch` sits inside a loop, a short comment on each `break` (as above) saying which statement it ends saves the next reader from having to work it out.

### Flags: the workaround to avoid

Before reaching for a label or a function, many people write a **flag variable**: set `let done = false` before the loops, set it to `true` where the inner code wants to stop, and test it in the outer loop's condition or right after the inner loop. It works, but it spreads one decision across three places — the declaration, the assignment and every test — and forgetting one test means the outer loop keeps running for an extra iteration. A `return` from an extracted function says the same thing in one statement. [[b1-labels|Labels]] covers the label-based alternative and when it is clearer than a function.

## try and catch inside and around loops

`try` is a control-flow statement too, and where you nest it relative to a loop decides how much a single failure stops. Parsing a file of JSON lines, where one line is truncated, shows the two choices:

```javascript title="try-placement.js"
const lines = ['{"id":1}', '{"id":2', '{"id":3}'];   // line 2 is truncated JSON

// try around the loop: the first bad line ends the whole loop.
const outer = [];
try {
  for (const line of lines) {
    outer.push(JSON.parse(line).id);
  }
} catch (err) {
  console.log('outer try caught:', err.name);
}
console.log('outer result:', outer);

// try inside the loop: each line succeeds or fails on its own.
const inner = [];
const failures = [];
for (const [i, line] of lines.entries()) {
  try {
    inner.push(JSON.parse(line).id);
  } catch {
    failures.push(i + 1);
  }
}
console.log('inner result:', inner, 'failed lines:', failures);
```

```output
outer try caught: SyntaxError
outer result: [ 1 ]
inner result: [ 1, 3 ] failed lines: [ 2 ]
```

With `try` **around** the loop, the exception from line 2 propagates out of the loop body, out of the loop, and into the `catch`. The loop is over; line 3 is never parsed. That is right when one failure makes the whole job meaningless — a transaction, a file that must be valid as a whole. With `try` **inside** the loop, the exception is caught within one iteration, the loop moves on, and you collect the failures to report later. That is right for batch work where items are independent: importing rows, sending notifications, resizing images. (`catch` without a parameter, as in the second loop, has been allowed since ES2019.)

Keep the `try` block as small as the operation that can fail. A `try` wrapping a whole loop body also catches bugs in your own code — a `TypeError` from a typo — and silently files them as "bad input". If cleanup must happen even when you `break` or `continue` out of a `try`, a `finally` block runs on the way out; [[b1-break-continue]] shows the exact order.

## Flattening nested code

Nesting that mirrors the data, like the grid loops above, is fine. Nesting that comes from piling up conditions is what makes code hard to read. The techniques below remove it. They all work the same way: deal with special cases early and leave, or move a box into something with a name.

### Guard clauses with continue and return

Inside a loop, `continue` plays the role that `return` plays in a function: it dismisses the current item early, so the main work does not have to sit inside an `if`. Here is a pyramid that builds a mailing list, rewritten with guards and then with array methods:

```javascript title="guard-clauses-in-loops.js"
const users = [
  { name: 'Ana', active: true, email: 'ana@example.com', optIn: true },
  { name: 'Bo', active: false, email: 'bo@example.com', optIn: true },
  { name: 'Cy', active: true, email: '', optIn: true },
  { name: 'Di', active: true, email: 'di@example.com', optIn: false },
];

// Pyramid: the real work sits three levels deep.
function recipientsNested(list) {
  const out = [];
  for (const user of list) {
    if (user.active) {
      if (user.email !== '') {
        if (user.optIn) {
          out.push(user.email);
        }
      }
    }
  }
  return out;
}

// Guards: each rejection is handled and dismissed at the top of the body.
function recipientsFlat(list) {
  const out = [];
  for (const user of list) {
    if (!user.active) continue;
    if (user.email === '') continue;
    if (!user.optIn) continue;
    out.push(user.email);
  }
  return out;
}

// Array methods: the question is "keep some users, then take their emails".
const isReachable = (u) => u.active && u.email !== '' && u.optIn;
const recipientsChain = (list) => list.filter(isReachable).map((u) => u.email);

console.log(recipientsNested(users));
console.log(recipientsFlat(users));
console.log(recipientsChain(users));
```

```output
[ 'ana@example.com' ]
[ 'ana@example.com' ]
[ 'ana@example.com' ]
```

All three give the same answer. The guard version reads as a checklist: inactive users out, users with no email out, users who did not opt in out, everyone left gets mail. Adding a fourth rule is one more line at the same depth rather than one more level of indentation. Each guard is also the *negation* of the original condition (`user.active` becomes `!user.active`), which is the one place to be careful when converting.

The chain version goes further: it names the condition (`isReachable`) and replaces "loop, test, push" with `filter` and `map`, which say *what* is being built rather than *how*. This is the right move whenever the job is "build an array from an array" ([[b1-array-map-filter-reduce]]). It is the wrong move when you need to stop early (use `find`, `some` or a loop with `break`), when you need `await` inside the body, or when a long chain makes several passes over a very large array.

Inside functions, the same idea uses `return` and `throw`: check invalid input at the top and leave, so the normal path runs down the left margin. [[b1-if-else]] develops guard clauses in functions in detail.

### Merging and straightening conditions

Two smaller rewrites remove levels without changing behaviour. When an `if` contains nothing but another `if`, and neither has an `else`, the two can be merged with `&&`: `if (a) { if (b) { run(); } }` is the same as `if (a && b) { run(); }`, because `&&` evaluates `b` only when `a` is truthy ([[b1-logical-operators]]). And when an `else` block contains nothing but an `if`, write it as `else if`: the behaviour is identical (as [[b1-if-else]] explains, `else if` *is* an `else` holding an `if`), and the chain stays at one depth. ESLint's `no-lonely-if` rule reports the second pattern.

### Extracting a function

When a box is big enough that you have to scroll to see its end, give it a name. Moving an inner loop body into a function does three things at once. The outer code shrinks to a line that says what happens (`report.push(priceOrder(order))`). The extracted function can be read and tested alone. And inside it, `return` exits all its loops at once, which removes the need for labels and flags. The worked example below shows this on a realistic function.

Extraction has costs: a reader must jump to another place to see the details, and passing many local variables in and out is a sign the boundary is in the wrong place. Extract a box when it does one nameable thing; leave it inline when the name would be as long as the code.

### Lookup tables instead of nested switches

A `switch` inside a `switch`, or an `if` chain inside a `switch`, often encodes a table. Writing it *as* a table removes both levels:

```javascript title="permissions.js"
// Nested switch: role, then action.
function canNested(role, action) {
  switch (role) {
    case 'admin':
      return true;
    case 'editor':
      switch (action) {
        case 'read':
        case 'edit':
          return true;
        default:
          return false;
      }
    case 'viewer':
      return action === 'read';
    default:
      return false;
  }
}

// The same rules as data: one lookup replaces two levels of branching.
const PERMISSIONS = {
  admin: new Set(['read', 'edit', 'delete']),
  editor: new Set(['read', 'edit']),
  viewer: new Set(['read']),
};
function can(role, action) {
  return Object.hasOwn(PERMISSIONS, role) && PERMISSIONS[role].has(action);
}

for (const [role, action] of [['editor', 'edit'], ['editor', 'delete'],
                              ['viewer', 'read'], ['guest', 'read']]) {
  console.log(role, action, canNested(role, action), can(role, action));
}
```

```output
editor edit true true
editor delete false false
viewer read true true
guest read false false
```

The table makes the rules visible at a glance, and adding a role or an action is a data change rather than a new branch. The `Object.hasOwn` check stops a role such as `'constructor'` from finding an inherited property ([[b1-object-hasown]]). The two are not exactly equal: `canNested` lets admins do *any* action, while the table lists admin actions explicitly. Converting branches to data is a good moment to notice such differences and decide which one you meant.

## How it works internally

**Jump targets are fixed when the code is parsed.** The specification gives each `break` and `continue` an optional label, and gives every loop and `switch` a **label set** — the labels written directly in front of it. An unlabelled `break` produces a break completion with an empty target, which propagates outward through the enclosing statements until the innermost loop or `switch` consumes it. An `if`, a block or a `try` does not consume it: a `try` with `finally` runs its `finally` block and then passes the same completion on. Because all of this can be decided from the source text, engines such as V8 compile each jump into a single bytecode jump instruction to a known location — however deeply it is nested.

**Nesting statements does not grow the call stack.** Only function calls push a new frame onto the call stack ([[b1-call-stack]]). You can measure this by counting the frames in an error's stack trace:

```javascript title="stack-depth.js"
Error.stackTraceLimit = Infinity;   // V8 records only 10 frames by default
// Count the frames on the call stack at the point where this is called.
const frames = () => new Error().stack.split('\n').length - 1;

const base = frames();
let inNested = 0;
for (let i = 0; i < 1; i++) {
  for (let j = 0; j < 1; j++) {
    if (i === j) {
      switch (i) {
        case 0:
          inNested = frames();   // four statements deep
      }
    }
  }
}

function outer() { return inner(); }
function inner() { return frames(); }

console.log('extra frames, 4 nested statements:', inNested - base);
console.log('extra frames, 2 nested calls:     ', outer() - base);
```

```output
extra frames, 4 nested statements: 0
extra frames, 2 nested calls:      2
```

Four levels of statements added no frames; two nested calls added two. (Output from Node.js 22.) So deeply nested statements can never cause a stack overflow — only deep recursion can ([[b1-recursion-js]]).

**Blocks do create scopes.** Each block that declares `let`, `const` or `class` gets its own environment for those names, and a `for (let …)` loop creates one per iteration. That is a scope, not a stack frame, and when no closure captures the variables V8 keeps them in registers rather than allocating anything. Extracting a function, on the other hand, does add a call. For small functions on hot paths, V8's optimising compiler usually **inlines** the call — copies the function's body into the caller — so the cost of extraction is normally negligible. Choose the structure for the reader.

**Complexity can be counted.** **Cyclomatic complexity**, defined by Thomas McCabe in 1976, counts the independent paths through a function: in its simple form, one plus the number of decision points (`if`, each loop, each `case`, `&&`, `||`, `?:`). `recipientsNested` above has a loop and three `if`s, so its complexity is 5 — and so does `recipientsFlat`, because the guards make the same decisions. Cyclomatic complexity measures how many test cases a function needs, not how hard it is to read. **Cognitive complexity**, a later metric from SonarSource, adds a penalty for each level of nesting, which is why it scores the guard version lower. Linters use both ideas: ESLint's `complexity` rule (default limit 20) and `max-depth` rule (default limit 4 levels of nested blocks) flag functions that have grown too tangled.

## Worked example: flattening an order processor

Here is a function of the kind that grows in real code bases over a few months. It bills orders: cancelled and empty orders are skipped, physical items pay shipping by weight, gift cards must have a valid code, and unknown item types are reported. It works, and its deepest line is six levels in.

```javascript title="orders-nested.js"
const orders = [
  { id: 'o1', status: 'paid', items: [
    { type: 'physical', price: 20, weightKg: 2 },
    { type: 'digital', price: 9 },
  ] },
  { id: 'o2', status: 'cancelled', items: [{ type: 'digital', price: 5 }] },
  { id: 'o3', status: 'paid', items: [] },
  { id: 'o4', status: 'paid', items: [
    { type: 'gift-card', price: 25, code: 'GC-123' },
    { type: 'gift-card', price: 25, code: 'oops' },
    { type: 'sticker', price: 1 },
  ] },
];

function checkCode(code) {
  if (!/^GC-\d+$/.test(code)) throw new Error(`bad gift card code ${code}`);
}

function processOrders(orders) {
  const report = [];
  for (const order of orders) {
    if (order.status !== 'cancelled') {
      if (order.items.length > 0) {
        let total = 0;
        const problems = [];
        for (const item of order.items) {
          switch (item.type) {
            case 'physical':
              if (item.weightKg > 0) {
                total += item.price + item.weightKg * 1.5;   // shipping by weight
              } else {
                problems.push('missing weight');
              }
              break;
            case 'digital':
              total += item.price;
              break;
            case 'gift-card':
              try {
                checkCode(item.code);
                total += item.price;
              } catch (err) {
                problems.push(err.message);
              }
              break;
            default:
              problems.push(`unknown item type ${item.type}`);
          }
        }
        report.push({ id: order.id, total, problems });
      }
    }
  }
  return report;
}

console.log(processOrders(orders));
```

```output
[
  { id: 'o1', total: 32, problems: [] },
  {
    id: 'o4',
    total: 25,
    problems: [ 'bad gift card code oops', 'unknown item type sticker' ]
  }
]
```

Count the boxes around `total += item.price + …`: the outer loop, two `if`s, the inner loop, the `switch`, and another `if`. Every `break` in the `switch` sits inside a loop, so a reader must check that each one is meant to leave only the `switch`. Problems are recorded in three different ways in three different places. And the function cannot be tested piece by piece: to check gift-card pricing you must build a whole order list.

The refactor applies four techniques. Guard clauses with `continue` replace the two outer `if`s. The per-item `switch` moves into `priceItem`, where every case `return`s, so there is no `break` left to misread. The per-order loop moves into `priceOrder`. And since every kind of problem now arrives as a thrown error, a single `try` inside the item loop handles them all — placed inside the loop because one bad item should not stop the rest of the order.

```javascript title="orders-flat.js"
// (orders and checkCode are the same as in orders-nested.js)

// Prices one item, or throws an Error describing why it cannot be priced.
function priceItem(item) {
  switch (item.type) {
    case 'physical':
      if (!(item.weightKg > 0)) throw new Error('missing weight');
      return item.price + item.weightKg * 1.5;   // shipping by weight
    case 'digital':
      return item.price;
    case 'gift-card':
      checkCode(item.code);                       // throws on a bad code
      return item.price;
    default:
      throw new Error(`unknown item type ${item.type}`);
  }
}

function priceOrder(order) {
  let total = 0;
  const problems = [];
  for (const item of order.items) {
    try {
      total += priceItem(item);
    } catch (err) {
      problems.push(err.message);                 // one bad item does not stop the order
    }
  }
  return { id: order.id, total, problems };
}

function processOrders(orders) {
  const report = [];
  for (const order of orders) {
    if (order.status === 'cancelled') continue;
    if (order.items.length === 0) continue;
    report.push(priceOrder(order));
  }
  return report;
}

console.log(processOrders(orders));
```

```output
[
  { id: 'o1', total: 32, problems: [] },
  {
    id: 'o4',
    total: 25,
    problems: [ 'bad gift card code oops', 'unknown item type sticker' ]
  }
]
```

The output is identical, which is the first thing to check after any refactor. No function is now more than two levels deep, and each one has a name that describes it. A few details deserve attention:

- **The guards are negations.** `order.status !== 'cancelled'` became `order.status === 'cancelled'` with `continue`, and `order.items.length > 0` became `=== 0`. Getting a negation wrong is the most common refactoring mistake, which is why comparing outputs before and after matters.
- **`!(item.weightKg > 0)` is not the same as `item.weightKg <= 0`.** If `weightKg` is missing, `undefined > 0` and `undefined <= 0` are both `false`. Negating the original test keeps the original behaviour, including for missing values.
- **The `try` now catches more.** It wraps a whole function call, so a genuine bug inside `priceItem` would also be reported as an item problem. In production code you would throw a dedicated error class for expected problems and rethrow anything else ([[b1-custom-errors]]).
- **`processOrders` could be a chain** — `orders.filter(isBillable).map(priceOrder)` — once the guard conditions have a name. The loop and the chain are equally good here; pick the one your team reads more easily.

## In real systems

**React components.** Deeply nested ternaries in JSX — loading, then error, then empty, then data — are nested control flow in expression form. The common fix is the same as for functions: early `return`s at the top of the component for the loading and error states, and small child components for each branch of the main view.

**Request handlers and middleware.** Server handlers validate input, check permissions and load data before doing the real work. Written with nested `if`s, the success path ends up far to the right with a column of closing braces. Written with guard clauses that send an error response and `return`, each check is one flat block.

**Data processing.** CSV imports, spreadsheet-like grids, game boards and image pixels are genuinely two-dimensional, so nested loops are the natural shape. The care goes into the inner bound (jagged rows), the `try` placement (per row or per file) and hidden O(n²) lookups, which a `Map` keyed by ID usually removes.

**Asynchronous code.** Before `async`/`await`, each asynchronous step took a callback, and each callback nested inside the previous one — the shape known as "callback hell". `await` lets the same steps be written as flat statements with ordinary loops and `try`/`catch` around them ([[b1-async-await]]).

**Code review and linting.** Teams commonly set `max-depth` and `complexity` limits in ESLint, and reviewers ask for extraction when a function cannot be understood without scrolling. A rule of thumb many teams use is that more than three levels of nesting inside one function deserves a second look.

## Trade-offs and alternatives

| Technique | Use it when | Watch out for |
|---|---|---|
| Nested loops | The data is genuinely two-dimensional, or you need every pair | O(n × m) cost; hidden loops such as `includes` inside a loop |
| Guard clauses (`continue`, `return`) | Several conditions reject items or inputs before the main work | Negating conditions correctly; exits hidden in the middle of long bodies |
| `&&` to merge conditions | An `if` contains only another `if` and neither has an `else` | Long combined conditions; name them with a variable or function |
| Extracted function | A block does one nameable thing, or needs to exit several loops | Too many tiny functions; passing many variables in and out |
| Array methods | Building, filtering or searching an array | No `break` in `forEach`/`map`; no sequential `await`; several passes |
| Lookup table or `Map` | Branches only map keys to values or handlers | Inherited keys on plain objects; branches with real logic do not fit |
| Labels | Leaving or continuing an outer loop while sharing much local state | Unfamiliar to many readers; prefer a function when one fits |

Flattening is not a goal in itself. A two-level loop over a grid is clearer than a `flatMap` with index arithmetic. A function split into ten one-line helpers can be harder to follow than the original. The goal is that every box has a clear purpose and that every jump obviously targets the statement it means.

## Common mistakes

> [!MISTAKE] A break in a switch meant to exit the loop
> Inside a `switch` that sits inside a loop, a plain `break` ends only the `switch`, and the loop keeps going. Use `return` (if the loop is in a function), a labelled `break`, or handle the loop-level decision with an `if` before the `switch`.

**Unlabelled `break` in an inner loop meant to stop everything.** It ends the inner loop only, and the outer loop starts its next iteration. Extract the loops into a function and `return`, or use a labelled `break`.

**Using the first row's length as the inner bound.** `for (let c = 0; c < grid[0].length; c++)` reads past the end of shorter rows in a jagged array. Use `grid[r].length`.

**Swapping indexes.** With `i` and `j`, it is easy to write `grid[j][i]`. Name indexes after their dimension (`r`, `c`) and keep the outer loop on the first index.

**Hidden quadratic loops.** `includes`, `indexOf`, `find` or `filter` inside a loop over a large array is a nested loop. Build a `Set` or `Map` once, before the loop.

**A `try` around a loop when items are independent.** The first failure ends the whole loop. Put the `try` inside the loop around the single operation that can fail, and collect the failures.

**Negating a condition wrongly when adding guard clauses.** `if (a && b) { work(); }` becomes `if (!a || !b) continue;`, not `if (!a && !b) continue;`. Compare outputs before and after the refactor.

> [!WARNING] Expecting return inside forEach to exit the outer function
> In `items.forEach((item) => { if (item.bad) return; … })`, `return` ends only that one callback call — it acts like `continue`. To leave the enclosing function or stop early, use a `for...of` loop, or `some` / `find`.

## Interview perspective

Interviewers rarely ask about nesting by name. They show you nested code and ask what it prints, how fast it is, or how you would clean it up.

> [!INTERVIEW] What a strong answer sounds like
> "An unlabelled `break` targets the innermost loop or `switch`, so a `break` in a `switch` inside a loop only leaves the `switch` — I'd use `return` from a function or a label to leave the loop. Two nested loops over the same input are O(n²); if the inner loop is just a search, I'd build a `Set` or `Map` first to make it O(n). For deep `if` pyramids I use guard clauses and extract named functions, so each function stays one or two levels deep."

Questions to expect:

- **What does this print?** A `switch` inside a `for` with a `break` that was meant to end the loop, or nested loops with a `break` in the inner one. Trace it with the rule "innermost loop or `switch`".
- **What is the time complexity of this function, and can you improve it?** Spot nested loops, including hidden ones such as `includes` inside a loop. Answer with the multiplication (n × m) and the `Set`/`Map` fix, and mention the extra O(n) memory the set costs.
- **How do you exit two nested loops at once?** A `return` from an extracted function, a labelled `break`, or a flag — and why the first two are usually better than the third.
- **Refactor this function.** Expect a pyramid of `if`s. Show guard clauses, keep the behaviour identical (watch the negations), and explain each step. Mentioning that you would run the existing tests before and after is a strong signal.
- **Does nesting cost performance?** Not by itself: nested statements compile to tests and jumps and add no stack frames. The cost comes from nested *loops* multiplying work, and from function calls only in rare hot paths where the engine does not inline them.

## Practice

1. **Trace it.** Predict the output of `for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) { if (j === i) break; console.log(i, j); } }`. How many times does `console.log` run?
2. **Find the duplicates.** Write `hasDuplicateEmail(users)` first with two nested loops (each pair once, using `j = i + 1`), then with a `Set` in a single loop. Count the comparisons each makes for 1,000 users with no duplicates.
3. **Fix the eaten break.** A loop reads tokens with a `switch`, and `case 'END': break;` is supposed to stop reading. Fix it three ways: with `return`, with a label, and with an `if` before the `switch`.
4. **Flatten the pyramid.** Take a function with four levels of nested `if` inside a loop (for example, validating form fields and collecting messages) and rewrite it with guard clauses and one extracted helper. Show that both versions return the same result for at least five inputs.
5. **Choose the `try` placement.** You are sending a reminder email to each of 500 users, and some addresses are invalid. Where does the `try` go, what do you collect, and what would change if all 500 emails had to be sent in one all-or-nothing batch?
6. **Table it.** Replace a nested `switch` on `(country, shippingSpeed)` that returns a price with a lookup table, and handle unknown combinations explicitly.

```quiz
Q: In `for (const t of tokens) { switch (t) { case 'END': break; default: handle(t); } }`, what happens when `t` is `'END'`?
- [ ] The loop ends
- [x] Only the switch ends; the loop moves on to the next token
- [ ] The current iteration restarts
- [ ] It is a SyntaxError to use break in a switch inside a loop
> An unlabelled `break` targets the innermost enclosing loop or `switch`, which here is the `switch`. The loop therefore continues with the next token. To end the loop, use `return` from a function, a labelled `break`, or test for `'END'` with an `if` before the switch.

Q: An outer loop runs over 2,000 orders and, for each one, calls `customers.find(c => c.id === order.customerId)` on an array of 2,000 customers. Which change removes the nested loop?
- [ ] Replace `find` with `filter(...)[0]`
- [ ] Replace the outer loop with `forEach`
- [x] Build a `Map` from customer id to customer once, before the loop, and use `map.get(order.customerId)` inside it
- [ ] Sort the orders by `customerId` first
> `find` scans the array, so calling it inside the loop does up to 2,000 × 2,000 comparisons. A `Map` built once takes 2,000 steps and then answers each lookup in constant time on average. `filter(...)[0]` is worse (it never stops early), `forEach` is still a loop, and sorting only the orders does not make the customer search faster.

Q: Lines of a file are parsed with `JSON.parse` in a loop. Each line is independent, and a bad line should be reported without losing the others. Where should the `try` go?
- [ ] Around the whole loop
- [x] Inside the loop, around the `JSON.parse` call
- [ ] Around the function that contains the loop
- [ ] Nowhere; `JSON.parse` returns `null` for invalid input
> An exception propagates out of every enclosing statement until a `try` catches it. With the `try` outside the loop, the first bad line ends the loop. With the `try` inside, the error is handled within one iteration and the loop continues. `JSON.parse` throws a `SyntaxError` on invalid input; it does not return `null`.

Q: Which statement about nested control flow is true?
- [ ] Each level of nested `if` or `for` pushes a new frame on the call stack
- [ ] A `continue` inside a `switch` inside a loop skips to the next `case`
- [x] Converting a nested `if` pyramid to guard clauses keeps the same number of decisions but removes levels of nesting
- [ ] `return` inside a `forEach` callback exits the function that called `forEach`
> Guard clauses make the same decisions, so cyclomatic complexity is unchanged, but each check sits at one depth, which is what makes the code easier to read. Only function calls push stack frames. `continue` ignores the `switch` and goes to the loop's next iteration. `return` in a callback ends only that callback.
```

## Quick revision {#quick-revision}

- Nested control flow = control-flow statements inside each other's bodies; any depth is legal, readability decides.
- Nested loops: the inner loop runs fully for each outer step (row-major order for grids); use `grid[r].length` for jagged rows; name indexes `r`/`c`.
- Pairs once: `for (i…) for (j = i + 1…)` → n(n − 1)/2 iterations.
- Cost multiplies: n × m; same data → O(n²). `includes`/`indexOf`/`find`/`filter` inside a loop are hidden nested loops → build a `Set`/`Map` once.
- `let` in nested loops: closures capture each iteration's binding of every loop variable; `var` shares one of each.
- Unlabelled `break` → innermost loop **or `switch`**; unlabelled `continue` → innermost loop (ignores `switch`); neither crosses a function boundary; `return` leaves everything.
- "Switch ate the break": fix with `return`, `break label`, or an `if` before the `switch`; comment each `break` in a switch inside a loop.
- Avoid flag variables for multi-loop exits; prefer an extracted function, then a label.
- `try` around a loop: first failure stops the loop. `try` inside: per-item handling. Keep `try` blocks small.
- Flatten with guard clauses (`continue`/`return`), `&&` for `if`-in-`if` without `else`, `else if` for lonely ifs (ESLint `no-lonely-if`), extracted named functions, `filter`/`map` for building arrays, lookup tables for nested switches.
- Nesting adds no stack frames (only calls do); blocks with `let`/`const` create scopes, not frames; jumps compile to bytecode jumps.
- Cyclomatic complexity = 1 + decision points (guards do not lower it); cognitive complexity penalises nesting; ESLint `complexity` (default 20), `max-depth` (default 4).

## Key takeaways {#key-takeaways}

- Nesting is fine when it mirrors the data, as with rows and columns; it is a problem when it comes from piling up conditions.
- An unlabelled `break` leaves the innermost loop or `switch`, so a `switch` inside a loop silently swallows a `break` meant for the loop; `return` or a label says what you mean.
- Nested loops multiply work, and array methods such as `includes` and `find` are loops too; a `Set` or `Map` built once usually turns O(n²) into O(n).
- Place `try` where a failure should stop: around the loop for all-or-nothing work, inside it for independent items.
- Guard clauses, extracted functions, array methods and lookup tables keep each function one or two levels deep without changing what it does — compare outputs to prove it.
- Nesting costs the reader, not the engine: nested statements are jumps, and only function calls add stack frames.
