---
summary: var is JavaScript's original way to declare a variable, and it behaves differently from let and const in four ways — function scope, hoisting to undefined, silent redeclaration and attachment to the global object. You will learn exactly how each works, why the design made sense in 1995, and how to read and safely modernise code that still uses it.
difficulty: beginner
minutes: 35
objectives:
  - Explain why a var declared inside a block is visible in the whole function
  - Predict the value of a var read before its declaration, including in branches that never run
  - Explain why top-level var in a classic script becomes a property of window, and why it cannot be deleted
  - Debug the shared-loop-variable bug and the nested-loop counter bug caused by var
  - Convert legacy var code to let and const without changing its behaviour
---

## Introduction

For the first twenty years of JavaScript, `var` was the only way to declare a variable. Every tutorial, library and website written before 2015 uses it, and a lot of production code still does. Modern code avoids it — linters ship with a rule that forbids it — but you cannot avoid *reading* it, and interviewers love it because its behaviour exposes whether you really understand scope.

`var` declares a mutable variable, like `let`. What makes it different is four rules that surprise anyone coming from Java, C# or modern JavaScript:

1. **Function scope.** A `var` belongs to the whole enclosing function, not to the block `{ }` it is written in.
2. **Hoisting to `undefined`.** A `var` exists and holds `undefined` from the moment the function starts, even on lines above its declaration.
3. **Silent redeclaration.** Declaring the same `var` twice is allowed and quietly refers to one variable.
4. **Global object properties.** At the top level of a classic script, a `var` becomes a property of the global object (`window` in browsers).

Each rule made sense when JavaScript was a small scripting language for web pages. Each one causes bugs in larger programs, which is why ES2015 added `let` and `const`. This lesson explains every rule, shows the bugs it causes, and shows how to modernise `var` code safely.

## Before you start

- **Variables, declaration and initialisation** — what it means to declare a binding and when it receives its first value. See [[b1-variables]].
- **Scope** — the idea that a name is visible only in part of the program, and the difference between function and block scope. See [[b1-scope]].
- **Functions** — declaring and calling a function. See [[b1-function-declaration]].

## The intuition

Think of a function as a room and its blocks — `if`, `for`, bare `{ }` — as cabinets inside the room. A `let` or `const` is a label stuck inside a cabinet: you can only see it when the cabinet is open. A `var` is a label stuck on the wall of the room. It does not matter which cabinet you were standing at when you wrote it; it goes on the wall, where everyone in the room can see it, from the moment anyone walks in.

And the room sets up its wall labels before anyone does anything: when the function starts, every `var` label is already on the wall, with an empty slot (`undefined`) next to it. The value is filled in only when execution reaches the `var` line.

## Function scope: blocks do not contain var

A `var` declaration belongs to the nearest enclosing **function**. If there is no enclosing function, it belongs to the script (or module). Curly braces of `if`, `for`, `while`, `switch`, `try` and bare blocks do not create a scope for `var`.

```javascript title="function-scope.js"
function f() {
  if (true) {
    var hidden = 1;          // written inside the if block...
  }
  console.log(hidden);       // ...but visible in the whole function
}
f();
console.log(typeof hidden);  // not visible outside the function

for (var i = 0; i < 2; i++) {}
console.log('i after loop', i);
```

```output
1
undefined
i after loop 2
```

`hidden` is declared inside the `if`, yet the function can read it after the block closes. Outside `f` it does not exist (`typeof` reports `'undefined'` for a name that is not declared). The loop counter `i` is declared at the top level of the file, so it outlives the loop and holds its final value, `2`.

If you have used Java or C, this is the rule that will bite you: braces do not hide a `var`. Only a function boundary does.

### The nested-loop counter bug

Function scope turns a simple typo-level mistake into a silent logic error. Here two nested loops both use `i`:

```javascript title="nested-loops.js"
function countPairs(n) {
  var pairs = 0;
  for (var i = 0; i < n; i++) {
    for (var i = 0; i < n; i++) {   // meant to be a separate counter
      pairs++;
    }
  }
  return pairs;
}

function countPairsLet(n) {
  let pairs = 0;
  for (let i = 0; i < n; i++) {
    for (let i = 0; i < n; i++) {   // a separate binding that shadows the outer i
      pairs++;
    }
  }
  return pairs;
}

console.log(countPairs(3), countPairsLet(3));
```

```output
3 9
```

With `var`, both loops share one `i`, because both declarations belong to the function. The inner loop runs `i` up to `3`; the outer loop then sees `i = 3`, increments it to `4` and stops after one pass, returning `3` instead of `9`. No error is raised — the duplicate `var` is legal. With `let`, the inner `i` is a separate binding in the inner loop's scope, and the function returns `9`. (Reusing the name `i` is still poor style; the point is what each keyword does with it.)

## Hoisting: var exists before its line

When a function is called, the engine first creates a binding for every `var` in the function body and sets each one to `undefined`. Only then does it run the body. This set-up is part of what is called **hoisting** ([[b1-hoisting]], and specifically [[b1-var-hoisting]]).

```javascript title="var-hoisting.js"
function checkout() {
  console.log(total);   // the binding exists already, holding undefined
  var total = 100;
  console.log(total);
}
checkout();

function greet(flag) {
  if (flag) {
    var msg = 'hello';  // this line may never run...
  }
  return msg;           // ...but msg always exists
}
console.log(greet(true), greet(false));
```

```output
undefined
100
hello undefined
```

A useful way to read `var` code is to mentally rewrite it the way the engine treats it: every `var` declaration moves to the top of the function as `var name;`, and the original line becomes a plain assignment.

```javascript
// How the engine effectively sees checkout()
function checkout() {
  var total;            // created at function entry, value undefined
  console.log(total);
  total = 100;          // the original line is now just an assignment
  console.log(total);
}
```

Nothing is literally moved — the engine scans declarations before running the code — but the rewrite predicts the behaviour exactly. It also explains `greet(false)`: the `var msg` inside the `if` belongs to the whole function, so `msg` is declared even when the branch is skipped, and returning it gives `undefined` rather than an error.

Why would a language do this? Early JavaScript wanted scripts to keep running rather than crash. Reading a variable early gives `undefined`, which a page might survive. The cost is that ordering bugs never announce themselves: `undefined` flows on into calculations and produces `NaN` or blank output far from the real mistake. `let` and `const` replaced this with an immediate `ReferenceError` (the temporal dead zone, [[b1-tdz]]).

## Redeclaration is silent

Declaring the same `var` twice in one scope is legal. Both declarations refer to one variable; a second declaration without a value does nothing, and one with a value behaves like an assignment.

```javascript title="var-redeclare.js"
var a = 1;
var a;            // no effect: a keeps its value
console.log(a);
var a = 2;        // acts as an assignment
console.log(a);
```

```output
1
2
```

In a two-line example that looks harmless. In a 500-line function, or across several scripts on one page, it means a second `var config = …` somewhere else silently overwrites the first, with no warning. `let` and `const` make the same mistake a SyntaxError that stops the file from running. The full redeclaration rules are in [[b1-variables]] under Redeclaration.

## Top-level var and the global object

In a browser, a top-level `var` in a classic (non-module) script does more than create a variable. It becomes a **property of the global object** — `window`, also reachable as `globalThis`. The same is true of top-level function declarations. Top-level `let`, `const` and `class` are global variables too, but they are kept in a separate store and do *not* appear on `window`.

```javascript title="page.js"
// A classic <script> in a browser (not type="module")
var fromVar = 1;
let fromLet = 2;
function fromFunction() {}

console.log(window.fromVar);
console.log(window.fromLet);
console.log(typeof window.fromFunction);
console.log(delete window.fromVar, window.fromVar);
```

```output
1
undefined
function
false 1
```

The last line shows a detail most developers do not know: a property created by `var` is **non-configurable**, so `delete` cannot remove it and returns `false`. A global created by plain assignment without a declaration (`total = 15` in sloppy mode) *is* configurable and can be deleted. This was checked in Chrome; it follows from the specification, so other engines agree.

Attaching to `window` causes two kinds of trouble:

- **Collisions between scripts.** Every classic script on a page shares the same global object. If your script and a third-party analytics script both use `var data`, they overwrite each other.
- **Collisions with built-in properties.** `window` already has hundreds of properties. In a browser, `var name = 123; console.log(typeof name);` prints `'string'`, because `window.name` already exists and converts anything assigned to it to a string. Your `var` did not create a new variable; it reused the existing property.

### Where this does not happen

The global-object behaviour applies only to the top level of a classic script. It does not happen:

- **Inside functions** — a `var` there is local to the function.
- **In ES modules** (`<script type="module">`, `.mjs` files, or code built by a bundler). Each module has its own scope, so a top-level `var` is module-scoped and `window.modVar` is `undefined` ([[b1-module-scope]]).
- **In Node.js CommonJS files.** Node wraps each file in a function, so a top-level `var` is local to that file, and `globalThis.x` stays `undefined`.

The global object itself, and how to use `globalThis` deliberately, are covered in [[b1-global-variables]].

## The loop and closure problem

The most famous `var` bug combines function scope with closures. Each callback below is meant to log the value of `i` from its own iteration:

```javascript title="loop-closures.js"
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j), 0);
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

With `var`, there is exactly one `i` for the whole loop (in fact for the whole file). The three arrow functions all close over that single binding. The timers fire after the loop has finished, when `i` is `3`, so all three log `3`. With `let`, the loop creates a fresh binding of `j` for every iteration, and each callback closes over its own. This difference, and the older fixes such as wrapping the body in a function, are worked through in [[b1-var-loop-problem]] and [[b1-closures-in-loops]].

## How code worked around var before 2015

Because only functions created a scope, developers used functions to get privacy. The standard trick was the **Immediately Invoked Function Expression (IIFE)**: wrap code in a function and call it at once, so its `var` declarations stay out of the global scope.

```javascript title="iife-counter.js"
var counter = (function () {
  var count = 0;                      // private: lives only inside the IIFE
  return {
    increment: function () { count += 1; return count; },
  };
})();

console.log(counter.increment());
console.log(counter.increment());
console.log(typeof count);
```

```output
1
2
undefined
```

`count` is invisible outside the function, yet `increment` can still use it because it is a closure. Libraries such as jQuery wrapped their entire source in an IIFE for this reason. Block scope (`let`/`const`) and modules made the pattern mostly unnecessary, but you will still see it in older code and bundler output. See [[b1-iife]] and [[b1-module-pattern]].

## How it works internally

In the specification, each function call creates an environment for its declarations. `var` declarations and parameters go into the function's **VariableEnvironment**; `let`, `const` and `class` go into a LexicalEnvironment that can be replaced by a new one for each block ([[b1-variable-environment]], [[b1-lexical-environment]]). During the function's set-up step, the engine collects every `var` name in the body — searching through nested blocks but not into nested functions — and for each name not already bound it creates a mutable binding initialised to `undefined`. Duplicates simply find the existing binding, which is why redeclaration is harmless to the engine.

At the top level of a classic script, the global environment has two parts: an **object record** backed by the global object, and a **declarative record** for `let`, `const` and `class`. Global `var` and function declarations are created in the object record, which is literally a property on `window`, defined as non-configurable. Lexical declarations go to the declarative record, which is why they are global but invisible as `window` properties.

One more legacy behaviour: in sloppy mode, `eval` can add a `var` to the calling function's scope at run time.

```javascript title="eval-var.js"
function sloppy() {
  eval('var injected = 1');
  return injected;
}
function strict() {
  'use strict';
  eval('var injected = 1');   // strict eval gets its own variable scope
  return typeof injected;
}
console.log(sloppy(), strict());
```

```output
1 undefined
```

This is one reason engines optimise sloppy functions that call `eval` less aggressively: the set of variables can change while the function runs. Strict mode closes the hole.

## Modernising var code

Most `var` declarations can be converted mechanically, but three situations need care, because `let` and `const` are stricter:

| Pattern in the old code | What breaks with `let` | Safe conversion |
|---|---|---|
| Variable used before its `var` line | `ReferenceError` (temporal dead zone) | Move the declaration above the first use |
| Variable declared in a block, used after it | `ReferenceError: x is not defined` | Declare it with `let` before the block |
| Same name declared twice in one function | SyntaxError | Remove the second keyword, or rename |
| `window.x` read where `x` was a top-level `var` | `window.x` is `undefined` | Use the variable directly, or assign `window.x` explicitly |
| Callbacks in a `for (var …)` loop | Behaviour *changes* — usually fixing a bug | Check the old behaviour was not relied upon |

A practical approach is to change every `var` to `let`, run the tests, then let ESLint's `prefer-const` rule upgrade the bindings that are never reassigned to `const`. The errors you hit along the way are usually real ordering bugs the old code was hiding.

## In real systems

**Linters forbid it.** ESLint's `no-var` rule, enabled in nearly every modern configuration, reports every `var`. TypeScript compiles `let` and `const` fine for any target, so there is no build-related reason to use `var` in new code.

**Compiled output still uses it.** When TypeScript or Babel targets ES5 (for very old browsers), they rewrite `let` and `const` into `var`, renaming variables where needed to preserve block-scoping behaviour. If you read transpiled bundles or old minified libraries, expect `var` everywhere.

**Legacy pages and third-party snippets.** Analytics tags, ad scripts and widgets embedded with a `<script>` tag often use top-level `var`, which is how they end up as `window` properties — sometimes on purpose, as a way to expose an API like `window.dataLayer`.

## Trade-offs and alternatives

`var` has no advantage in modern code. Its one historical strength — working in every engine — stopped mattering once all supported browsers shipped ES2015. The deliberate uses that remain are rare: a top-level `var` in a classic script to create a `window` property on purpose (clearer as `window.x = …` or `globalThis.x = …`), and matching the style of a legacy file you are making a small fix in.

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Before its line | `undefined` | `ReferenceError` | `ReferenceError` |
| Redeclare in same scope | Allowed | SyntaxError | SyntaxError |
| Top-level in classic script | `window` property | Global, not on `window` | Global, not on `window` |
| Loop closures | One shared binding | One binding per iteration | One per iteration (`for…of`/`for…in`) |

The full comparison and a decision procedure are in [[b1-var-let-const]].

## Common mistakes

> [!MISTAKE] Assuming an if or for block hides a var
> `if (x) { var temp = 1; }` leaves `temp` visible — as `undefined` or `1` — in the whole function. Use `let` or `const` for block-local values.

**Relying on `undefined` from hoisting.** Code like `if (!cache) { var cache = {}; }` works only because `var cache` is hoisted to `undefined`. It reads as if `cache` might exist already, but it never does in that function. Declare it plainly at the top.

**Reusing a loop counter.** Two loops in one function that both use `var i` share one variable; nesting them produces wrong counts, as `countPairs` showed. Use `let` in each loop.

**Expecting `window.x` in a module.** After moving code into a module or bundler, `window.x` for a top-level `var x` becomes `undefined`. If something genuinely needs a global, assign it explicitly.

**Deleting a global var.** `delete window.x` returns `false` and does nothing for a `var`-created global. Set it to `undefined` or, better, do not create the global.

## Interview perspective

`var` questions test whether you can predict output and explain *why*. Walk through the creation step out loud.

> [!INTERVIEW] "What's the difference between var and let?"
> "Four things. `var` is function-scoped while `let` is block-scoped. `var` is initialised to `undefined` at function entry, so reading it early gives `undefined`; `let` is in the temporal dead zone until its line, so reading it early throws. `var` can be redeclared in the same scope; `let` can't. And a top-level `var` in a classic script becomes a property of `window`, which `let` doesn't. The practical consequence most people know is the loop-closure bug: `for (var i…)` shares one `i`, `for (let i…)` creates one per iteration."

Likely follow-ups:

- **Is `let` hoisted?** Yes — its binding is created at block entry — but it is not initialised, so early access throws. That is why an inner `let` shadows an outer variable from the start of the block.
- **What does `function f() { if (false) { var x = 1; } return x; }` return?** `undefined`, because the declaration is processed even though the branch never runs.
- **How would you fix the `setTimeout` loop without `let`?** Wrap the body in an IIFE that takes `i` as a parameter, or pass `i` as the third argument to `setTimeout`.
- **Why does `var name = 1` produce a string in a browser?** Top-level `var` reuses the existing `window.name` property, whose setter converts values to strings.

## Practice

1. Predict the output, then explain it using the "move declarations to the top" rewrite:

   ```javascript
   var x = 'global';
   function show() {
     console.log(x);
     var x = 'local';
     console.log(x);
   }
   show();
   ```

2. Find the bug and fix it in two different ways:

   ```javascript
   function buttonsFor(labels) {
     var handlers = [];
     for (var i = 0; i < labels.length; i++) {
       handlers.push(function () { return labels[i]; });
     }
     return handlers;
   }
   console.log(buttonsFor(['a', 'b'])[0]());   // expected 'a'
   ```

3. Modernise this function to `let`/`const` without changing what it returns for any input:

   ```javascript
   function parse(input) {
     if (input) { var parts = input.split(','); }
     var count = parts ? parts.length : 0;
     var count = count * 2;
     return count;
   }
   ```

4. Explain why `delete window.a` returns `false` after `var a = 1` but `true` after `a = 1` in a sloppy classic script.

```quiz
Q: What does `function f() { console.log(n); if (false) { var n = 5; } } f();` log?
- [ ] 5
- [x] undefined
- [ ] ReferenceError: n is not defined
- [ ] ReferenceError: Cannot access 'n' before initialization
> `var n` belongs to the whole function and is created with the value undefined when f starts, whether or not the if branch ever runs. The assignment of 5 never executes. There is no error because the binding exists; "before initialization" errors only come from let, const and class.

Q: In a classic browser script, which top-level declaration creates a property on `window`?
- [x] `var total = 0;`
- [ ] `let total = 0;`
- [ ] `const total = 0;`
- [ ] `class Total {}`
> Top-level var and function declarations go into the global object record, which is window itself. let, const and class are global variables too, but they live in a separate declarative record, so window.total stays undefined for them.

Q: A function has two nested loops that both use `for (var i = 0; i < n; i++)`. What happens?
- [ ] It is a SyntaxError, because i is declared twice
- [ ] Each loop gets its own i
- [x] Both loops share one i, so the outer loop ends early
- [ ] The inner loop never runs
> Both var declarations belong to the function, and redeclaring a var is legal, so there is a single i. The inner loop leaves i equal to n, and the outer loop's next check fails. Using let gives each loop its own binding.

Q: Why does `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));` log 3 three times?
- [ ] setTimeout always runs callbacks in reverse
- [ ] The arrow functions copy i when they are created
- [x] All three callbacks close over the same i, which is 3 by the time they run
- [ ] var variables are reset to their final value after a loop
> Closures capture bindings, not values. With var there is only one binding of i, and the timers run after the loop finishes, when i is 3. let creates a new binding per iteration, so each callback would see its own value.
```

## Quick revision {#quick-revision}

- `var` is **function-scoped**: blocks (`if`, `for`, `{ }`) do not contain it; only functions do.
- At function entry every `var` is created and set to `undefined` (**hoisting**); reading it early gives `undefined`, never an error.
- A `var` inside a branch that never runs still exists in the whole function.
- **Redeclaration** with `var` is silent and refers to the same variable.
- Top-level `var` in a **classic script** becomes a non-configurable property of `window`/`globalThis`; `delete` returns `false`. Not true in modules, inside functions, or in Node CommonJS files.
- `for (var i …)` shares one `i` across iterations, so closures all see the final value.
- Pre-2015 privacy came from functions: IIFEs and the module pattern.
- Modernise: `var` → `let`, fix TDZ/scope errors by moving declarations, then `prefer-const`.

## Key takeaways {#key-takeaways}

- `var` differs from `let` in scope (function vs block), early access (`undefined` vs error), redeclaration (allowed vs SyntaxError) and global behaviour (`window` property vs not).
- Read `var` code by mentally moving each declaration to the top of its function as `var name;` and turning the original line into an assignment.
- Function scope is what causes the classic loop-closure and nested-counter bugs.
- Top-level `var` in classic scripts pollutes `window` and can collide with other scripts and built-in properties.
- There is no reason to write `var` in new code; when converting old code, the errors `let` reveals are usually real bugs.
