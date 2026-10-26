---
summary: Hoisting puzzles are short programs whose output looks wrong until you apply the creation phase. You will learn a two-pass method for solving any of them and work through the patterns interviewers use — var shadowing, var and function name clashes, function expressions, the temporal dead zone, default parameters, block-level functions and classes.
difficulty: intermediate
minutes: 50
objectives:
  - Apply a two-pass method (bindings first, then statements) to predict the output of hoisting puzzles
  - Resolve clashes between var, function declarations and parameters that share a name
  - Distinguish the TypeError, ReferenceError and undefined outcomes of using something before its declaration
  - Explain how default parameters, named function expressions and block-level functions change hoisting
  - Rewrite puzzle code into clear code that does not depend on hoisting
---

## Introduction

Hoisting puzzles are a staple of front-end interviews. You are shown ten lines of JavaScript and asked what they print. The code is usually something nobody would write on purpose — a `var` and a function with the same name, a variable used above its declaration — and that is the point. Interviewers are not testing whether you would write it. They are testing whether you have an accurate model of how JavaScript prepares a scope before running it, because the same model explains real bugs: an "is not a function" error at start-up, a `ReferenceError` from a circular import, a value that is mysteriously `undefined`.

Every puzzle in this lesson is solved with the same method, built on the creation and execution phases taught in [[b1-hoisting]]. The goal is not to memorise answers but to be able to derive the answer to a puzzle you have never seen. Each puzzle shows the code, the real output (from Node.js 22, whose engine is V8), the reasoning, and how the code should have been written.

## Before you start

- **Hoisting and the two phases** — the starting state of each declaration kind. See [[b1-hoisting]] and [[b1-creation-vs-execution]]. This lesson assumes them.
- **The temporal dead zone** — why `let` and `const` throw before their line. See [[b1-tdz]].
- **Scope and shadowing** — function versus block scope and how inner names hide outer ones. See [[b1-scope]] and [[b1-shadowing]].
- **Function declarations versus expressions.** See [[b1-function-hoisting]].

## The method: two passes

When you meet a hoisting puzzle, do not start reading at line 1 and executing in your head. Run two passes for each scope, exactly as the engine does.

**Pass 1 — set up the bindings.** For the scope you are about to execute (the global code, or a function when it is called):

1. Write down each parameter with its argument value.
2. Write down every `var` name declared anywhere in the scope — inside `if` blocks and loops too, but not inside nested functions — with the value `undefined`. If a parameter already has that name, keep the parameter's value.
3. Write down every function declaration at the top level of the scope with its function value. If the name already exists (as a `var` or a parameter), the function replaces the value. If two function declarations share a name, the last one wins.
4. Write down every `let`, `const` and `class` with the state "TDZ".

**Pass 2 — execute.** Now go through the statements in order, updating your table. A `var x = …` line is only the assignment `x = …`. A function declaration line does nothing (it was handled in pass 1). A `let`/`const`/`class` line moves its binding out of the TDZ. When a function is called, run both passes again for that call.

The outcomes of using a name are then mechanical:

| What your table says | Reading it | Calling it |
|---|---|---|
| `undefined` (a `var` not yet assigned) | `undefined` | `TypeError: x is not a function` |
| TDZ (`let`/`const`/`class` before its line) | `ReferenceError: Cannot access 'x' before initialization` | Same `ReferenceError` |
| Not in any scope's table | `ReferenceError: x is not defined` (`typeof` gives `'undefined'`) | Same `ReferenceError` |

The error messages are V8's wording; other engines use different words for the same error types.

## Puzzles with var

### Puzzle 1: the hoisted local shadows the global

```javascript
var x = 1;

function show() {
  console.log(x);
  var x = 2;
  console.log(x);
}

show();
console.log(x);
```

```output
undefined
2
1
```

Many people answer `1, 2, 1`, reasoning that the first `console.log` runs before the local `x` is declared, so it should see the outer `x`. Pass 1 for the call to `show` says otherwise: `show` declares `var x`, so its table starts with `x: undefined`. That local binding exists from the first line of the function and shadows the outer `x` for the entire body. The first log reads the local `undefined`, the assignment sets it to `2`, and the global `x` is never touched. The fix in real code is to give the two variables different names, or to declare with `let`, which would turn the first log into a clear `ReferenceError`.

### Puzzle 2: an assignment that does not create a global

```javascript
function setCount() {
  count = 10;  // looks like an implicit global...
  return;
  var count;   // ...but this unreachable line declares a local
}

setCount();
console.log(typeof count);
```

```output
undefined
```

In sloppy mode, assigning to an undeclared name creates a global variable, so you might expect `count` to be a global holding `10`. But pass 1 collects `var count` even though it sits after a `return` and can never execute. The function therefore has a local `count`, the assignment writes to it, and it disappears when the function returns. Unreachable code is still part of the scope's declarations.

### Puzzle 3: the global property check

```javascript title="page-script.js"
// A classic script, so top-level var creates a property on the global object.
if (!('ready' in globalThis)) {
  var ready = true;
}
console.log(ready);
```

```output
undefined
```

The code seems to say "if `ready` does not exist yet, create it as `true`". Pass 1 for the global scope hoists `var ready`, and in a classic script a top-level `var` becomes a property of the global object immediately. So `'ready' in globalThis` is already `true` when the condition runs, the block is skipped, and `ready` stays `undefined`. (In an ES module the `var` would be module-scoped rather than a global property, and the condition would be true.) The condition intended "has some other script defined this?", and `var` hoisting destroyed the question.

## Puzzles where var and function share a name

### Puzzle 4: function first, then the assignment wins

```javascript
var value = 1;

function puzzle() {
  console.log(value);
  var value = 2;
  function value() {}
  console.log(typeof value, value);
}

puzzle();
```

```output
[Function: value]
number 2
```

Pass 1 for `puzzle`: `var value` creates `value: undefined`; then the function declaration `value` replaces it with the function. So the first log prints the function — Node.js shows it as `[Function: value]`; a browser console shows the function's source. Pass 2 then executes `value = 2`, an ordinary assignment that overwrites the function. The function declaration line itself does nothing during execution. The common wrong answer is that "functions always win"; they win only *during the creation phase*. Any later assignment replaces them.

### Puzzle 5: the same declaration, a different order

```javascript
function getValue() {
  return value();

  function value() { return 'declaration'; }
  var value = function () { return 'expression'; };
}

function getValueAgain() {
  var value = function () { return 'expression'; };
  return value();

  function value() { return 'declaration'; }
}

console.log(getValue(), getValueAgain());
```

```output
declaration expression
```

Both functions have the same declarations, so pass 1 produces the same table: `value` holds the declared function. The difference is entirely in pass 2. In `getValue`, the `return` runs first and calls the hoisted declaration; the assignment of the expression is never reached. In `getValueAgain`, the assignment runs first and replaces the declaration, so the call gets the expression. If you ever find yourself writing both forms with one name, you have found a bug.

### Puzzle 6: two declarations, one name

```javascript
console.log(pick());

function pick() { return 'first'; }
function pick() { return 'second'; }

console.log(pick());
```

```output
second
second
```

Both declarations are processed in pass 1, in source order, so the second replaces the first before any code runs. Even the call above both of them gets `'second'`. This is allowed at the top level of a function or classic script, even in strict mode. It is a `SyntaxError` at the top level of an ES module (where function declarations are lexical, like `let`) and inside a block in strict code. Linters flag duplicate declarations (`no-redeclare`, `no-dupe-class-members` for methods).

### Puzzle 7: parameters, var and functions

```javascript
function withVar(a) {
  var a;            // does not reset the parameter
  console.log(a);
  var a = 2;
  console.log(a);
}

function withFunction(a) {
  function a() {}   // replaces the parameter's value
  return typeof a;
}

withVar(1);
console.log(withFunction(1));
```

```output
1
2
function
```

A `var` with the same name as a parameter does not create a second binding and does not reset it to `undefined`; step 2 of pass 1 keeps the parameter's value. So `withVar` logs the argument `1`, then `2` after the assignment. A function declaration with the same name, however, replaces the value in pass 1, so inside `withFunction` the argument `1` is gone before the first line runs. (A `let a` in the function body, by contrast, would be a `SyntaxError`, because it would redeclare the parameter in the same scope.)

## Puzzles with function expressions

### Puzzle 8: is not a function

```javascript
try {
  notify('saved');
} catch (e) {
  console.log(e.name + ': ' + e.message);
}

var notify = function (msg) {
  console.log('notify:', msg);
};

notify('saved');
```

```output
TypeError: notify is not a function
notify: saved
```

Pass 1 makes `notify: undefined` because only the `var` is a declaration; the function on the right is an expression evaluated during pass 2. The first call therefore tries to call `undefined`. The message names the variable, which makes it look as though `notify` is the wrong type rather than not yet assigned — a common source of confusion in real start-up code. After the assignment line, the second call works. With `const notify = …` the first call would throw `ReferenceError: Cannot access 'notify' before initialization` instead.

### Puzzle 9: the named function expression

```javascript
var factorial = function fact(n) {
  fact = null;          // ignored: the inner name is read-only
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5));
console.log(typeof fact);
```

```output
120
undefined
```

A **named function expression** (see [[b1-named-function-expression]]) creates its name, `fact`, only inside the function's own body, as a read-only binding. Outside, nothing called `fact` exists, so `typeof fact` is `'undefined'` — the name is not hoisted into the surrounding scope at all. Inside the body, `fact = null` is silently ignored in sloppy mode (in strict mode it throws `TypeError: Assignment to constant variable.`), so the recursion keeps working. This is why named function expressions are a safe way to write self-referencing callbacks: the outer variable `factorial` could be reassigned, but `fact` always means the function itself.

## Puzzles with let, const and class

### Puzzle 10: the shadow that throws

```javascript
let theme = 'light';

function render() {
  console.log(theme);
  let theme = 'dark';
}

try {
  render();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
ReferenceError: Cannot access 'theme' before initialization
```

This is Puzzle 1 rewritten with `let`. Pass 1 for `render` creates a local `theme` in the TDZ, which shadows the outer `theme` for the whole function. Reading it throws instead of falling through to `'light'`. The error is better than `var`'s silent `undefined`, because it points at the exact line. If the intent was to use the outer value, rename the inner variable.

### Puzzle 11: typeof is not always safe

```javascript
console.log(typeof undeclared);

try {
  console.log(typeof later);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
let later = 1;
```

```output
undefined
ReferenceError: Cannot access 'later' before initialization
```

`typeof` returns `'undefined'` for a name that is not declared anywhere. But `later` *is* declared in this scope — pass 1 put it in the TDZ — so `typeof later` is a read of an uninitialised binding and throws. If the same code used `var later`, `typeof` would return `'undefined'`. The difference between the two lines is the difference between "no binding" and "binding not initialised".

### Puzzle 12: default parameters

```javascript
function build(a = b, b = 2) {
  return [a, b];
}

function scale(n, factor = n * 2) {
  return [n, factor];
}

try {
  build();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
console.log(build(1), scale(3));
```

```output
ReferenceError: Cannot access 'b' before initialization
[ 1, 2 ] [ 3, 6 ]
```

Parameters are initialised one at a time, left to right, and while that happens they behave like `let` bindings. When `build()` is called with no arguments, the default for `a` needs `b`, which is still uninitialised: TDZ error. When `a` is supplied, its default is never evaluated and nothing goes wrong. `scale` works because its default refers to an *earlier* parameter, which is already initialised. Rule: a default value may use parameters to its left, never to its right.

### Puzzle 13: classes are not functions here

```javascript
try {
  const admin = new Admin();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}

class User {}
class Admin extends User {}

console.log(new Admin() instanceof User);
```

```output
ReferenceError: Cannot access 'Admin' before initialization
true
```

A class is a constructor function, so people expect it to be hoisted like a function declaration. It is hoisted like `let` instead: pass 1 puts `User` and `Admin` in the TDZ, and each leaves it only when its declaration line executes. The reason, explained in [[b1-class-hoisting]], is that evaluating a class can run code — the `extends` expression, computed method names, static fields — and that must happen in order. The same rule means `class Admin extends User {}` written above `class User {}` would throw.

### Puzzle 14: the loop that prints 3, 3, 3

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i));
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j));
}
```

```output
var 3
var 3
var 3
let 0
let 1
let 2
```

This is technically a scope puzzle, but it is always asked alongside hoisting. `var i` is hoisted to the enclosing scope, so all three callbacks share one `i`, which is `3` by the time they run after the loops finish. `let j` is block-scoped, and each iteration gets a fresh binding, so each callback captures its own value. The full explanation is in [[b1-closures-in-loops]].

## The expert-level trap: functions inside blocks

Function declarations inside blocks (`if`, `for`, bare `{}`) were not part of the language before ES2015, but browsers supported them anyway, each in its own way. ES2015 standardised two behaviours: in **strict code**, a function declared in a block is block-scoped, like `let` but initialised with its function at the top of the block. In **sloppy code**, browsers must also follow legacy compatibility rules (Annex B of the specification) that create an extra `var`-like binding in the enclosing function.

```javascript
function sloppy() {
  const before = typeof g;
  if (true) {
    function g() {}
  }
  return [before, typeof g];
}

function strict() {
  'use strict';
  const before = typeof g;
  if (true) {
    function g() {}
  }
  return [before, typeof g];
}

console.log(sloppy(), strict());
```

```output
[ 'undefined', 'function' ] [ 'undefined', 'undefined' ]
```

In `sloppy`, Annex B gives the function a `var` binding named `g`, initialised to `undefined` — so `before` is `'undefined'` rather than an error. When execution reaches the function declaration inside the block, its value is copied out to that outer binding, so after the block `typeof g` is `'function'`. If the block never ran (`if (false)`), `g` would stay `undefined` outside it. In `strict`, `g` exists only inside the block; outside, the name does not resolve at all, so both `typeof` checks give `'undefined'`.

The practical lesson is short: do not declare functions inside blocks in sloppy code. ES modules and classes are always strict, so in modern code you get the simple block-scoped behaviour. If you need a conditional function, assign a function expression to a `let` or `const`.

## Worked example: a full puzzle, step by step

Here is a harder combination. Work it with the two-pass method before reading the solution.

```javascript
var a = 1;

function outer() {
  console.log(a, typeof b, typeof c);
  var a = 2;

  if (a > 1) {
    var b = function () { return 'b'; };
  }

  function c() { return 'c'; }

  inner();
  console.log(a, b(), c());

  function inner() {
    a = 3;
    var c = 'shadowed';
  }
}

outer();
console.log(a);
```

```output
undefined undefined function
3 b c
1
```

**Global pass 1:** `a: undefined`, `outer: function`. **Global pass 2:** `a = 1`, then `outer()` is called.

**`outer` pass 1:**

| Binding | Source | Starting value |
|---|---|---|
| `a` | `var a` | `undefined` (shadows the global `a`) |
| `b` | `var b` inside the `if` | `undefined` |
| `c` | function declaration | function `c` |
| `inner` | function declaration | function `inner` |

**`outer` pass 2:** The first log prints `undefined` (local `a`), `'undefined'` (`b` is a `var` not yet assigned), and `'function'` (`c` was hoisted with its value). Then local `a = 2`. The condition `a > 1` is true, so `b` is assigned its function. The declaration of `c` does nothing now. `inner()` is called.

**`inner` pass 1:** `c: undefined` (its own local `var c`). There is no local `a`. **`inner` pass 2:** `a = 3` resolves outward to `outer`'s `a` — the nearest enclosing declaration — and sets it to `3`. `var c = 'shadowed'` assigns `inner`'s own `c`, leaving `outer`'s `c` untouched.

Back in `outer`, the second log prints `3` (changed by `inner`), `'b'`, and `'c'`. Finally the global log prints `1`: the global `a` was shadowed in `outer` the whole time and never changed.

## How to write it instead

Every puzzle above relies on code that obscures its own behaviour. Rewriting it is part of a strong interview answer, and it is what you should do in real code.

| Puzzle pattern | Clear version |
|---|---|
| Local `var` shadows a global and is read early | Use distinct names; declare with `const`/`let` at first use |
| `var` and function with the same name | Never reuse a name for two declarations |
| Calling a function expression before its line | Use a function declaration, or move the definition above the call |
| `'x' in globalThis` check followed by `var x` | Use `globalThis.x ??= value` for an intentional global |
| Default parameter refers to a later parameter | Reorder parameters, or compute the value in the body |
| Function declared inside a block | `const handler = cond ? fnA : fnB;` or a block-scoped `const` expression |
| Class used before its declaration | Declare base classes first; import classes before using them |

Enabling `'use strict'` (or using modules), ESLint's `no-var`, `no-redeclare`, `no-shadow`, `no-use-before-define` and `no-inner-declarations` removes almost every puzzle in this lesson from real code.

## Common mistakes

> [!MISTAKE] Executing in one pass
> The most common way to get hoisting puzzles wrong is to read the code top to bottom once. A `var` or function declaration written at the bottom of a function affects the first line. Always build the binding table for the scope before executing a single statement.

**Believing "functions always win" over `var`.** A function declaration wins only during pass 1. Any `var x = …` assignment that runs later replaces it.

**Forgetting nested function boundaries.** A `var` inside a nested function is hoisted to that nested function, not to the outer one. In the worked example, `inner`'s `var c` never touched `outer`'s `c`.

**Treating TDZ errors as "not defined".** A `let` in the TDZ shadows outer variables of the same name; the read does not fall through to them.

**Assuming `typeof` never throws.** It throws for `let`, `const` and `class` in the TDZ.

**Ignoring strict mode.** Block-level functions and assignments to read-only names behave differently in strict code. Ask whether the snippet is a module or strict if it matters to the answer.

## Interview perspective

Interviewers watch your *process* as much as your answer. Say out loud what pass 1 produces, then execute. If you are unsure, state the rule you are applying; a correct rule applied carefully is worth more than a guessed answer.

> [!INTERVIEW] Narrating a hoisting puzzle
> "First, the bindings for this function: `value` is a `var`, so it starts as `undefined`, but there's also a function declaration called `value`, which replaces it during setup. So the first log prints the function. Then execution reaches `value = 2`, which overwrites it, so the second log prints `number 2`."

Follow-ups to expect:

- **Would the answer change in strict mode?** For block-level functions, assignments to named function expression names and implicit globals: yes. For basic `var`/`let` hoisting: no.
- **What if `var` were `let`?** Early reads become `ReferenceError`s; duplicate declarations become `SyntaxError`s; loop callbacks capture per-iteration values.
- **How would you fix this code?** Rename, reorder, use `const`, and remove duplicate declarations — show the rewrite.
- **Why do function declarations hoist with their value but classes do not?** Creating a function runs no code; creating a class can.

## Practice

1. **Write the table.** For each puzzle in this lesson, cover the explanation, write the pass-1 table on paper, then execute pass 2. Compare with the output.
2. **Mutate a puzzle.** Change Puzzle 4 so that `var value = 2` comes *after* the second `console.log`. Predict the new output, then run it.
3. **Make it strict.** Add `'use strict'` to Puzzles 2, 9 and the block-function example. Predict what changes and why.
4. **Invent one.** Write your own puzzle combining a parameter, a `var` and a function declaration of the same name, and swap it with a friend.
5. **Refactor.** Rewrite the worked example so that it prints the same output without relying on hoisting or shadowing.

```quiz
Q: `function f() { console.log(n); var n = 5; function n() {} } f();` — what is logged?
- [ ] `undefined`
- [ ] `5`
- [x] The function `n`
- [ ] A ReferenceError
> In pass 1, `var n` creates `n` as undefined, then the function declaration replaces it with the function. The log runs before the assignment `n = 5`, so it prints the function.

Q: `function g(a) { var a; return a; }` — what does `g(7)` return?
- [x] `7`
- [ ] `undefined`
- [ ] A SyntaxError is thrown
- [ ] A function
> A `var` with the same name as a parameter refers to the same binding and does not reset it. A `let a` here would be a SyntaxError, and a function declaration named `a` would replace the value.

Q: In sloppy mode, `if (false) { function k() {} }` is followed by `console.log(typeof k)` in the same function. What is logged?
- [ ] `'function'`
- [x] `'undefined'`
- [ ] A ReferenceError
- [ ] A SyntaxError
> Annex B creates a var-like binding `k` in the function, initialised to undefined, and copies the function into it only when the block's declaration is evaluated. The block never runs, so `k` stays undefined. In strict code `k` would not exist outside the block, and `typeof` would also give 'undefined' — for a different reason.

Q: `const x = 1; function h() { return typeof x; let x = 2; }` — what does `h()` do?
- [ ] Returns `'number'`
- [ ] Returns `'undefined'`
- [x] Throws a ReferenceError
- [ ] Throws a SyntaxError before anything runs
> The local `let x` shadows the outer `x` for the whole function and is in its TDZ when `typeof` runs, so reading it throws. Unreachable code after `return` still contributes declarations. It is not a SyntaxError, because shadowing an outer `const` is legal.
```

## Quick revision {#quick-revision}

- Method: pass 1 builds the binding table for a scope; pass 2 executes statements in order. Repeat both for every function call.
- Pass 1 order: parameters → every `var` as `undefined` (parameters keep their values) → function declarations (replace; last one wins) → `let`/`const`/`class` in TDZ.
- Unreachable `var` declarations (after `return`, in `if (false)`) still count.
- A local `var` shadows an outer variable for the whole function, giving `undefined` on early reads.
- "Functions win" only in pass 1; a later `var` assignment overwrites the function.
- Calling a `var` function expression early → `TypeError: x is not a function`; a `const` one → `ReferenceError`.
- Named function expression names exist only inside the function and are read-only.
- `let`/`const`/`class` in the TDZ shadow outer names and throw on any access, including `typeof`.
- Default parameters initialise left to right; referring to a later parameter throws.
- Classes hoist like `let`; declare base classes first.
- Sloppy block functions (Annex B): `var`-like outer binding, `undefined` until the block runs. Strict: block-scoped only.
- Global `var` in a classic script is a global-object property from the start, so `'x' in globalThis` is already true.

## Key takeaways {#key-takeaways}

- Every hoisting puzzle yields to the same two-pass method: set up the bindings, then execute.
- Know the three outcomes: a `var` not yet assigned gives `undefined`, a TDZ binding throws "before initialization", and a missing binding throws "not defined".
- Name clashes are resolved in pass 1 (functions replace `var` placeholders; the last function wins) but later assignments still overwrite.
- Strict mode changes several answers, especially for functions declared in blocks.
- In interviews, narrate the binding table before giving the output, and finish by showing the clear rewrite.
- In real code, `const`, `let`, strict mode and a few lint rules make these puzzles impossible to write by accident.
