---
summary: Scope is the part of a program where a name can be used. You will learn the four kinds of scope JavaScript has — global, module, function and block — which declarations belong to which, and how choosing the right one prevents name collisions, leaked variables and loop bugs.
difficulty: beginner
minutes: 45
objectives:
  - Explain what scope is and how it differs from a variable's value and lifetime
  - Classify any declaration (var, let, const, function, class, parameter, import) into global, module, function or block scope
  - Predict which names are visible at a given line, and why outer code cannot see inner names
  - Explain how ES modules isolate top-level names, and how imports behave as live, read-only bindings
  - Debug accidental globals and the var-in-a-loop bug by choosing the correct declaration
---

## Introduction

Imagine two scripts on the same web page. One is your analytics snippet; the other is a carousel widget written by someone else. Both happen to keep a variable called `count`. If every name in a program lived in one shared space, the carousel would overwrite your analytics counter the first time it ran, and neither author would know why their numbers were wrong.

Programming languages solve this with **scope**: the region of source code in which a name refers to a particular variable. A variable declared inside a function is usable inside that function and invisible outside it, so two functions can both have a local `count` without interfering. Scope is the reason you can name things freely in one place without checking every other file in the program.

Three words appear constantly in this lesson, so it helps to fix them now. An **identifier** is a name written in code, such as `count` or `render`. A **declaration** is a statement that introduces a name — `let count = 0`, `function render() {}`, `class User {}`, a function parameter, or an `import`. The pairing of a name with a storage slot that holds its value is called a **binding**. Scope answers one question about bindings: *from which lines of code can this binding be reached by its name?*

JavaScript has four kinds of scope — **global**, **module**, **function** and **block** — and different declarations attach to different kinds. That is why `var` and `let` behave differently inside an `if` statement, why a variable declared without any keyword can leak out of a function, and why top-level variables in an ES module do not appear on `window`. Every later topic in this part of the course — [[b1-lexical-scope]], [[b1-hoisting]], [[b1-closures]] — builds on the rules taught here.

## Before you start

- **Variable declarations** — the syntax of `var`, `let` and `const`. See [[b1-var-let-const]].
- **Functions** — how to declare and call a function. See [[b1-function-declaration]].
- **Strict mode** — what `'use strict'` changes, because several scope rules differ with it. See [[b1-strict-mode]].

You do not need to know how the engine works internally; the lesson introduces the small amount of machinery that matters.

## The intuition

Picture the program as a set of nested rooms. The whole page is the outermost room. Each function is a room inside it, and each `{ … }` block that declares a `let` or `const` is a smaller room inside that. Every room has a list of names pinned to its wall.

The rule is one-way visibility. From inside a room you can see your own wall and, through the doorway, the walls of every room that encloses you. You cannot see into rooms nested inside yours. So code inside a function can use names declared at the top of the file, but code at the top of the file cannot use names declared inside the function.

The analogy is accurate about visibility, but it hides one detail worth stating now: the rooms are *drawn* when the code is written, yet a fresh copy of a function's room is *built* every time the function is called. Two calls to the same function get two separate sets of local variables. The [[b1-lexical-environment]] section explains that runtime side.

## What scope is, and what it is not

Scope is about **names**, not values. It is easy to blur the two, so here is a small program that separates them.

```javascript
function makeUser() {
  const user = { name: 'Asha' }; // `user` is a name scoped to makeUser
  return user;                   // the object itself is returned, not the name
}

const u = makeUser();
console.log(u.name);
console.log(typeof user);
```

```output
Asha
undefined
```

The name `user` is scoped to `makeUser`, so outside the function it does not exist — `typeof user` reports `'undefined'` (the `typeof` operator is special: it does not throw for unknown names). But the object that `user` pointed to is still alive, because the caller now holds a reference to it through `u`. Scope controls which *names* can be written where. Whether a *value* stays in memory depends on whether anything can still reach it, which is a garbage-collection question covered in [[b1-memory-management]].

Scope is also not the same as **lifetime**. A local variable's name is only usable inside its function, but the binding itself can outlive the call if an inner function still refers to it. That is what a closure is, and it is the main reason scope matters so much in JavaScript.

## The four kinds of scope

| Scope | Created by | Declarations that live there |
|---|---|---|
| Global | The program as a whole (all classic scripts on a page share it) | Top-level `var`, `function`, `let`, `const`, `class` in a classic script |
| Module | Each ES module file | All top-level declarations and `import`s in that module |
| Function | Each function, freshly on every call | Parameters, `var`, function declarations, and `let`/`const`/`class` at the top of the body |
| Block | Any `{ … }` block, `for` loop header, `catch` clause | `let`, `const`, `class` (and, in strict code, function declarations) |

The table's most important column is the last one. `let`, `const` and `class` attach to the **nearest enclosing block**. `var` ignores blocks entirely and attaches to the **nearest enclosing function** (or the global scope, if there is no function). Function declarations follow `var`'s rule in older sloppy code and the block rule in strict code. The sections below take each kind in turn.

### Global scope

The **global scope** is the outermost scope. In a browser, every classic `<script>` tag on the page shares one global scope, which is why two unrelated scripts can collide. In Node.js, each file is wrapped in its own function (CommonJS) or treated as a module (ESM), so files do not share top-level names by default.

The global scope has a quirk that no other scope has: it is split into two halves. Top-level `var` and `function` declarations in a classic script become **properties of the global object** — `window` in browsers, available everywhere as `globalThis`. Top-level `let`, `const` and `class` declarations are still global (other scripts on the page can use them), but they do *not* become properties of the global object.

```javascript title="page-script.js"
// Run as a classic (non-module) script. In a browser, globalThis === window.
var fromVar = 1;
let fromLet = 2;
function fromFunction() {}

console.log(globalThis.fromVar);
console.log(globalThis.fromLet);
console.log(typeof globalThis.fromFunction);
console.log(fromLet); // still visible by name everywhere
```

```output
1
undefined
function
2
```

Why the split? `var` and function declarations predate 2015 and were always stored on the global object; changing that would break old pages. When `let` and `const` arrived in ES2015, the language gave them a separate store so that new code would stop cluttering `window`. The details of the global object are covered in [[b1-global-variables]].

The other danger at global level is the **accidental global**. In sloppy (non-strict) code, assigning to a name that was never declared anywhere does not raise an error; it silently creates a property on the global object.

```javascript
function saveTotal(price, qty) {
  total = price * qty; // typo: forgot `let` — no error in sloppy mode
  return total;
}

saveTotal(5, 3);
console.log(globalThis.total);
```

```output
15
```

The function has quietly written to a global that every other script can see and overwrite. In strict mode — which is automatic inside ES modules and class bodies — the same line throws `ReferenceError: total is not defined`, which is exactly what you want. The full rule for what happens when a name is not found is the subject of [[b1-name-resolution]].

### Function scope

Every function creates a **function scope**. Its parameters, its `var` declarations and its inner function declarations belong to it, and none of them are visible from outside. Crucially, a new scope is created on **every call**, so each call has its own private copy of these variables.

```javascript
function tally(label) {
  var count = 0;
  for (var i = 0; i < 3; i++) {
    count += i;
  }
  console.log(label, count, i); // i is still visible after the loop
}

tally('first');
tally('second');
console.log(typeof count, typeof i);
```

```output
first 3 3
second 3 3
undefined undefined
```

Two things to notice. First, the second call starts again from `count = 0`: the calls do not share state, because each call built a fresh scope. Second, `i` was declared in the `for` header but is still readable after the loop has finished, with the value `3` that ended the loop. That is because `var` ignores the block and attaches to the whole function. Outside `tally`, neither name exists.

Before ES2015, function scope was the *only* way to create a private scope, which is why older code wraps whole files in an Immediately Invoked Function Expression (IIFE): `(function () { … })()`. The pattern is explained in [[b1-iife]].

### Block scope

A **block** is any pair of braces that groups statements: the body of an `if`, `for`, `while`, `switch` or `try`, or a bare `{ … }`. `let`, `const` and `class` declarations inside a block are **block-scoped**: visible from the block's start to its end, and nowhere else.

```javascript
function demo() {
  if (true) {
    var v = 'var';     // attaches to demo()
    let l = 'let';     // attaches to this if-block
    const c = 'const'; // attaches to this if-block
  }
  console.log(v);
  try {
    console.log(l);
  } catch (e) {
    console.log(e.name + ': ' + e.message);
  }
}

demo();
```

```output
var
ReferenceError: l is not defined
```

`v` escapes the `if` because `var` only respects function boundaries. `l` and `c` do not, so reading `l` after the block ends throws. Block scope keeps a variable's visibility as small as the code that needs it, which makes code easier to read: when you see a `let` inside a loop, you know nothing after the loop can depend on it.

Three constructs create block scopes that are easy to overlook:

- **`for` loop headers.** `for (let i = 0; …)` creates a scope for `i`, and — unlike `var` — a *new binding of `i` for every iteration*. That detail fixes a famous bug, shown in the worked example below.
- **`catch` clauses.** The error parameter in `catch (e)` is scoped to the `catch` block.
- **`switch` statements.** The whole `switch` body is *one* block, so `let x` in two different `case` clauses is a redeclaration error. Wrap each case body in its own braces if each needs its own variables.

### Scope follows the written structure

Which scope a name belongs to is decided by **where the declaration appears in the source code**, not by where or how a function is later called. A function defined inside another function can see the outer function's variables, wherever it is eventually called from. This rule is called **lexical scope**, and it is important enough to have its own lesson: [[b1-lexical-scope]]. For now, the practical consequence is that you can work out every name's scope by reading the code, without running it.

## Module scope {#b1-module-scope}

**Module scope** is the top-level scope of an ES module file. Every module gets its own: a `const`, `let`, `function` or `class` declared at the top of a module is visible throughout that file and invisible to every other file, unless the module explicitly `export`s it. It is the file-sized private room that JavaScript lacked for its first twenty years, and it is the reason modern front-end code rarely suffers from global name collisions.

A file is treated as a module when it is loaded with `<script type="module">` in a browser, when it is imported by another module, or in Node.js when it has the `.mjs` extension or sits in a package whose `package.json` contains `"type": "module"`. Bundlers such as Vite and webpack treat source files as modules too.

### How module scope differs from global scope

Compared with a classic script's top level, a module's top level changes four things:

1. **Top-level names are private.** Declarations are not added to the global object and are not visible to other scripts. Two modules can both declare `const config` without conflict.
2. **The code is always in strict mode.** You do not write `'use strict'`; it is implied. So the accidental-global assignment shown earlier throws a `ReferenceError` instead of creating `window.total`.
3. **Top-level `this` is `undefined`**, not the global object.
4. **Top-level `await` is allowed** (since ES2022), because module evaluation can be asynchronous. See [[b1-top-level-await]].

To share something, a module exports it, and another module imports it. An `import` declaration creates a binding in the importing module's scope, so imported names are also module-scoped: importing `formatDate` in `a.js` does not make it available in `b.js`.

### Imports are live, read-only bindings

An imported name is not a copy of the exported value. It is a **live binding**: a read-only view onto the exporting module's own variable. When the exporter changes the variable, every importer sees the new value. Here is a small counter module and a module that uses it.

```javascript title="counter.mjs"
export let count = 0;
export function increment() {
  count += 1; // changes the binding that importers are viewing
}
console.log('counter.mjs evaluated');
```

```javascript title="main.mjs"
import { count, increment } from './counter.mjs';
import { count as sameCount } from './counter.mjs';

console.log(count, this);
increment();
console.log(count, sameCount);

try {
  count = 10; // importers may read the binding but never assign to it
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
counter.mjs evaluated
0 undefined
1 1
TypeError: Assignment to constant variable.
```

Walk through the output. `counter.mjs` printed its message once, even though `main.mjs` imported it twice: a module is **evaluated once**, and every import of it shares that single instance. After `increment()`, both `count` and `sameCount` read `1`, because they are views onto the same variable inside `counter.mjs`. Finally, assigning to `count` from the importing side throws a `TypeError` (the message shown is V8's, used by Chrome and Node.js). Only the module that declares a variable can change it; importers must call a function such as `increment` that the exporter provides. The deeper mechanics are covered in [[b1-live-bindings]].

### One instance per URL

The engine keeps a **module map** keyed by each module's fully resolved URL (or file path in Node.js). The first import of a URL loads and evaluates the module; later imports of the same URL reuse it. This is what makes a module a natural home for shared state such as a cache or a store — every importer gets the same one.

It also explains a subtle bug. Different relative paths are fine — `'./counter.mjs'` from one folder and `'../lib/counter.mjs'` from another resolve to the same URL and share one instance. But anything that changes the resolved URL creates a *second* instance with its own separate state: a query string (`'./counter.mjs?v=2'`), a different host, or, with bundlers, two copies of the same package installed at different paths in `node_modules`. If two parts of an app disagree about a supposedly shared store, check whether they loaded two copies.

### Circular imports and uninitialised bindings

Because imported names are live views, a module can import a binding that has not been initialised yet. This happens with circular imports, where module A imports B and B imports A. The engine evaluates one of them first, and that module can see the other's `let`, `const` or `class` exports only in their uninitialised state.

```javascript title="cycle-a.mjs"
import { b } from './cycle-b.mjs';
export const a = 'A';
console.log('a sees', b);
```

```javascript title="cycle-b.mjs"
import { a } from './cycle-a.mjs';
export const b = 'B';
try {
  console.log('b sees', a);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

Running `node cycle-a.mjs` prints:

```text
ReferenceError: Cannot access 'a' before initialization
a sees B
```

`cycle-a.mjs` starts loading, sees it needs `cycle-b.mjs`, and evaluates that dependency first. When `cycle-b.mjs` runs, the binding `a` already exists (imports are linked before any code runs) but `cycle-a.mjs` has not reached `export const a = 'A'` yet, so reading `a` throws. This is the **temporal dead zone** from [[b1-tdz]] applied across files. The fix is usually to move shared code into a third module that neither side imports back. Circular dependencies are covered in [[b1-circular-deps]].

### Module scope before ES modules

Node.js's older module system, **CommonJS** (`require` and `module.exports`), also gives each file a private top level, but by a different mechanism: Node wraps every file in a function before running it, so top-level declarations are really function-scoped. CommonJS exports are copied values rather than live bindings, and the code is not automatically strict. The differences are compared in [[b1-esm-vs-cjs]]. Before either system existed, developers simulated module scope with the IIFE-based [[b1-module-pattern]].

> [!TIP] Rule of thumb for modules
> Export only what other files need. Everything else stays private for free, which means you can rename or delete it later without searching the rest of the codebase. Avoid assigning to `window` or `globalThis` from a module unless you are deliberately installing a global, such as a polyfill.

## How it works internally

When the engine runs code, each scope is represented by a data structure the specification calls an **environment record**: a table of the bindings declared in that scope, plus a link to the record of the enclosing scope. Calling a function creates a new record for that call; entering a block with `let` or `const` declarations creates a record for that block; each module has one record for its top level. To find a name, the engine starts at the current record and follows the links outward. This structure is taught in [[b1-lexical-environment]] and [[b1-scope-chain]].

Real engines avoid most of that searching. Because scope is decided by the source code, V8 (the engine in Chrome and Node.js) analyses scopes when it parses a function and decides in advance where each variable lives. Variables that no inner function refers to can be kept in fast machine registers or stack slots. Variables that an inner function *does* refer to are placed in a heap-allocated **context** object, so they survive after the call returns. This is why choosing small scopes can matter for memory: a large object declared in a scope that a long-lived callback closes over stays alive as long as the callback does.

## Worked example: the loop that prints the wrong numbers

This is the most famous scope bug in JavaScript. The goal is to schedule three callbacks that print `0`, `1` and `2`.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var:', i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let:', j), 0);
}
```

```output
var: 3
var: 3
var: 3
let: 0
let: 1
let: 2
```

`setTimeout` does not run its callback immediately; it schedules it to run after the current code has finished (the [[b1-event-loop]] lesson explains when). By the time the first callback runs, both loops have completed.

In the first loop, `var i` belongs to the enclosing function scope (here, the file's scope), so there is **one** `i` shared by all three iterations. Each arrow function refers to that single variable. When the callbacks finally run, the loop has already pushed `i` to `3`, so all three print `3`.

In the second loop, `let j` is block-scoped to the loop, and the language creates a **fresh binding of `j` for each iteration**, copying the previous value forward before the increment. Each arrow function captures a different `j`, frozen at `0`, `1` and `2`. Changing one keyword fixed the bug because it changed the scope of the variable. The pattern is explored in more depth in [[b1-closures-in-loops]].

## In real systems

**Modules as the default boundary.** Modern front-end projects are built from ES modules, so module scope does most of the isolation work. Each component, hook or utility file keeps its helpers private and exports a small public surface. Bundlers rely on this: because imports and exports are declared statically at module scope, tools can remove unused exports (tree shaking, see [[b1-tree-shaking]]).

**Linters enforce good scoping.** Common ESLint rules exist exactly for the mistakes in this lesson: `no-var` (use block-scoped declarations), `prefer-const`, `no-undef` (flags names that are never declared, catching accidental globals before they ship), `no-implicit-globals`, and `no-shadow`. TypeScript reports undeclared names as compile errors.

**Shared state lives in modules.** A module-level `const cache = new Map()` is created once and shared by every importer, which is how many libraries implement caches, singletons and stores. Because it is module-scoped rather than global, nothing outside the module can replace it.

**React components.** Every render calls the component function again, which creates a new function scope with new local variables and new inner event handlers. Understanding that each render has its own scope is the key to understanding [[b1-stale-closures]].

## Trade-offs and alternatives

| Choice | Benefit | Cost |
|---|---|---|
| Global scope | Reachable from anywhere, including other scripts | Collisions, hidden coupling, hard to track who changes what |
| Module scope | Private by default, explicit dependencies, one shared instance | Requires a module-aware loader or bundler |
| Function scope (`var`) | Works in every JavaScript engine ever shipped | Leaks out of blocks; one binding per loop, not per iteration |
| Block scope (`let`/`const`) | Smallest visible region; per-iteration loop bindings | Temporal dead zone errors if used before the declaration |

The modern default is simple: use modules for file boundaries, `const` for every binding that is never reassigned, `let` for the rest, and avoid `var` in new code. Use the global scope only for things that genuinely must be global, such as a polyfill or a value injected by a host page.

## Common mistakes

> [!MISTAKE] Expecting a block to contain a var
> Writing `if (ready) { var status = 'ok'; }` does not keep `status` inside the `if`. It is visible throughout the function, holding `undefined` if the branch did not run. Use `let` or `const` when you want a variable to stay inside a block.

**Accidental globals.** Forgetting a declaration keyword in sloppy code creates a global variable instead of an error. Use modules (always strict) or `'use strict'`, and enable the `no-undef` lint rule.

**Assuming a global `let` is on `window`.** `let apiKey = 'x'` at the top of a classic script is global, but `window.apiKey` is `undefined`. Code that reads globals through `window.` will not find it.

**Thinking scope depends on the call site.** A function cannot see the local variables of whatever function called it. If it needs a value, pass it as an argument.

**Reusing names across `case` clauses.** `let` declarations in different `case` clauses of one `switch` share one block and collide. Give each case its own `{ }`.

**Loading a module twice.** If shared module state appears to "reset", check whether the module was imported through two different resolved URLs.

## Interview perspective

Scope questions test whether you can predict program behaviour, so interviewers usually show code and ask for the output. Explain *which scope each declaration belongs to* before predicting anything.

> [!INTERVIEW] A strong answer to "var vs let in a loop"
> "`var i` is function-scoped, so all three callbacks share one `i`, which is `3` by the time they run. `let` is block-scoped and the loop creates a new binding per iteration, so each callback captures its own value: `0`, `1`, `2`."

Questions you should be ready for:

- **What is scope?** The region of code where a binding can be referenced by name. JavaScript has global, module, function and block scope.
- **What is the difference between `var` and `let` scope?** `var` is function-scoped (or global); `let` and `const` are block-scoped and sit in a temporal dead zone until their declaration runs.
- **How does module scope differ from a classic script?** Module top-level names are private and not on the global object, the code is strict, top-level `this` is `undefined`, and imports are live, read-only bindings.
- **Follow-up: how does scope relate to closures?** An inner function keeps access to the scope it was written in, even after the outer function returns. That retained scope is the closure.
- **Trap: "let is not hoisted."** It is — the binding exists from the start of the block — but it cannot be read until its declaration runs. See [[b1-hoisting]].

## Practice

1. **Classify.** For each declaration in a file you have written recently, write down which scope it belongs to. Find one `var` and decide whether `const` or `let` would be more accurate.
2. **Predict, then run.** Write a function containing an `if` block that declares one `var`, one `let` and one `const`. Before running, predict which can be read after the block.
3. **Fix the loop without `let`.** Make the `var` version of the `setTimeout` loop print `0 1 2` by wrapping the callback in a function that receives `i` as a parameter. Explain which new scope fixed it.
4. **Module state.** Create `store.mjs` that exports a `let items = []` and an `add(item)` function. Import it from two other modules, call `add` from one, and log `items` from the other. Then import it once with `?copy` on the URL and explain the result.
5. **Find the leak.** Run a sloppy script that assigns to an undeclared name inside a function, then add `'use strict'` and compare the behaviour.

```quiz
Q: Inside a function, `if (true) { var a = 1; let b = 2; }` runs, followed by `console.log(a, typeof b)`. What is printed?
- [ ] `undefined undefined`
- [x] `1 undefined`
- [ ] `1 number`
- [ ] It throws a ReferenceError
> `var a` belongs to the whole function, so it is still visible after the block with value 1. `let b` belongs only to the block; after the block the name is unknown, and `typeof` on an unknown name returns 'undefined' instead of throwing. Reading `b` directly (without `typeof`) would throw.

Q: A classic browser script contains `let theme = 'dark';` at the top level. What does `window.theme` evaluate to?
- [ ] `'dark'`
- [x] `undefined`
- [ ] It throws because `theme` is private to the script
> Top-level `let`, `const` and `class` are global — other scripts can use `theme` by name — but they are stored separately from the global object, so they are not properties of `window`. Only top-level `var` and function declarations become `window` properties.

Q: `main.mjs` imports `{ count }` from `counter.mjs` and executes `count = 5`. What happens?
- [ ] `count` becomes 5 in `main.mjs` only
- [ ] `count` becomes 5 in both modules
- [x] A `TypeError` is thrown
- [ ] A new global variable `count` is created
> Imported bindings are live, read-only views onto the exporting module's variable. Importers can read them but never assign to them; only `counter.mjs` itself can change `count`. Modules are strict, so nothing ever falls back to creating a global.
```

## Quick revision {#quick-revision}

- Scope = the region of code where a binding can be referenced by name. It is about names, not values or lifetime.
- Four kinds: global, module, function (new on every call), block.
- `var` and function declarations (sloppy) → nearest function; `let`, `const`, `class` → nearest block.
- Classic-script top-level `var`/`function` become global-object properties; top-level `let`/`const`/`class` are global but not on `window`.
- Sloppy assignment to an undeclared name creates a global; strict mode and modules throw `ReferenceError`.
- `for (let …)` creates a new binding per iteration; `for (var …)` shares one binding and leaves it visible after the loop.
- `catch (e)` and a whole `switch` body are blocks.
- Modules: private top level, always strict, top-level `this` is `undefined`, top-level `await` allowed.
- Imports are live, read-only bindings; assigning to one throws `TypeError`.
- One module instance per resolved URL; a different URL (query string, duplicate package) means a second instance.
- Circular imports can read a binding before it is initialised → `ReferenceError`.

## Key takeaways {#key-takeaways}

- Scope decides where a name can be used, and it is fixed by where the declaration is written.
- `let` and `const` attach to the nearest block; `var` attaches to the nearest function, which is why it leaks out of `if` blocks and loops.
- The global scope is shared by all classic scripts and is the main source of collisions; modules give every file its own private top level.
- Imports are live, read-only views of another module's variables, and each module is evaluated once per resolved URL.
- Strict mode and modules turn accidental globals into errors, so prefer them.
- Default to modules, `const` and `let`; reach for global scope only on purpose.
