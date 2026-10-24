---
summary: Lexical scope means a function can see the variables that surround it where it is written, not where it is called. You will learn how JavaScript builds that rule from nested environments linked into a scope chain, how inner names shadow outer ones, and why this one rule is what makes closures, module privacy and safe minification possible.
difficulty: intermediate
minutes: 55
objectives:
  - Explain the difference between lexical (static) and dynamic scope and predict output under each
  - Trace how an identifier is found by walking the scope chain from the innermost environment outward
  - Describe a lexical environment (environment record plus outer link) and when the engine creates one
  - Explain why a function remembers its birth environment and how that produces closures
  - Identify shadowing, its temporal-dead-zone traps, and the redeclarations JavaScript forbids
---

## Introduction

When a function uses a name it did not declare itself, something has to decide which variable that name means. Consider this program:

```javascript
const label = 'global';

function show() {
  console.log(label); // `label` is not declared inside show()
}

function caller() {
  const label = 'caller';
  show();
}

caller();
```

```output
global
```

There are two reasonable rules a language could use. It could look up `label` in the place where `show` was **written** — the top of the file — and print `global`. Or it could look it up in the place where `show` was **called** — inside `caller` — and print `caller`. JavaScript uses the first rule, which is called **lexical scope** (also **static scope**): the variables a piece of code can see are determined by the structure of the source text, by which functions and blocks are written inside which. "Lexical" refers to the lexing (reading) stage of a compiler; the scope is fixed at the point the code is read, before it ever runs.

This sounds like a small technical choice, but almost everything distinctive about JavaScript functions rests on it. It is why a callback passed to `setTimeout` can still use the variables of the function that created it, why a module's private helpers cannot be reached from other files, why tools can rename your local variables safely when they minify your code, and why closures exist at all. This lesson explains the rule, the runtime machinery that implements it — **environments** linked into a **scope chain** — and the **shadowing** behaviour that follows when two scopes use the same name.

## Before you start

- **Scope** — the four kinds of scope and which declarations belong to each. See [[b1-scope]]; this lesson assumes it.
- **Functions as values** — that functions can be stored in variables, passed and returned. See [[b1-first-class-functions]].
- **`let`, `const` and `var`** — and the idea that `let`/`const` cannot be read before their declaration. See [[b1-var-let-const]] and [[b1-tdz]].

## The intuition

Take a printout of your program and draw a box around every function body and every block that declares `let` or `const`. You get boxes nested inside boxes. That drawing *is* the lexical scope structure. To find out what a name means at some line, put your finger on that line and move outward: check the box you are in, then the box enclosing it, and so on until you reach the outermost box. The first declaration of that name you meet is the one the code uses.

The key property of this drawing is that **calling a function does not redraw it**. When `caller` calls `show`, the code of `show` does not move inside `caller`'s box; it stays where it was written. So when `show` looks outward for `label`, it passes from its own box straight to the top of the file and never sees the `label` inside `caller`.

The drawing describes *which* variables are visible. It does not show that each call to a function creates new storage for its variables; for that you need the runtime picture taught in the [[b1-lexical-environment]] section.

## Lexical scope versus dynamic scope

Under **dynamic scope**, the alternative rule, a name is resolved by searching the chain of *active calls*: first the current function, then whichever function called it, then its caller. Very few mainstream languages use dynamic scope for ordinary variables, but one you may have met does. Bash's `local` variables are dynamically scoped:

```bash
label="global"
show() { echo "$label"; }
caller() { local label="caller"; show; }
caller
show
```

```output
caller
global
```

The same `show` function prints different things depending on who called it. That makes every function's behaviour depend on the entire history of calls that led to it, which is why dynamic scope is hard to reason about in large programs.

| | Lexical (static) scope | Dynamic scope |
|---|---|---|
| A free name is looked up in | The scope where the function was **defined** | The scope of the function's **caller**, then its caller |
| Can be determined by | Reading the source | Running the program |
| Used by | JavaScript, Java, Python, C, almost every modern language | Bash `local`, Emacs Lisp (by default), early Lisps |
| Enables | Closures, static analysis, safe renaming | Implicit parameter passing |

JavaScript chose lexical scope, and the choice pays off in three concrete ways. You can understand a function by reading it and its enclosing code, without knowing every place it might be called from. Tools can analyse code without running it: editors can jump to the definition of a name, TypeScript can flag an undefined name, and minifiers can rename a local `customerAddress` to `a` knowing that no code elsewhere could depend on the name. And engines can decide where each variable lives before the code runs, which makes lookups fast.

### The one dynamic thing: `this`

There is one value in JavaScript that *does* depend on how a function is called: `this`. A regular function's `this` is decided by the call site.

```javascript
function whoAmI() {
  return this.name;
}

const a = { name: 'a', whoAmI };
const b = { name: 'b', whoAmI };
console.log(a.whoAmI(), b.whoAmI());
```

```output
a b
```

The same function returns different values depending on which object it is called on. This is not variable lookup — `this` is a keyword, not an identifier resolved through scopes — and it is the source of many bugs when methods are passed as callbacks. Arrow functions opt out: they have no `this` of their own and take it lexically from the surrounding code. That rule is covered in [[b1-this]] and [[b1-lexical-this]]. Everything else in this lesson — every variable, parameter, function and class name — is resolved lexically.

## Scope chain {#b1-scope-chain}

The **scope chain** is the ordered list of scopes that the engine searches to find a name: the current scope first, then the scope that encloses it, and so on outward until the global scope. It is the runtime form of "put your finger on the line and move outward". When an identifier is used, the engine checks each scope in the chain in order, and the first scope that declares the name wins. If no scope in the chain has it, the lookup fails — reading the name throws a `ReferenceError`.

Here is a program with the same name declared at three levels:

```javascript
const x = 'global';

function f() {
  const x = 'function';
  {
    const x = 'block';
    console.log(x);
  }
  console.log(x);
}

f();
console.log(x);
```

```output
block
function
global
```

Each `console.log(x)` starts its search in a different place. The first is inside the block, so the chain is block → `f` → global, and the block's own `x` is found immediately. The second is in `f`'s body after the block has ended, so its chain is `f` → global, and `f`'s `x` is found. The third is at the top level, where only the global `x` exists. The search always stops at the first match, so outer declarations of the same name are never consulted — that effect is called shadowing, and it has [[b1-shadowing|its own section]] below.

### The chain is built from where code is written

Each link in the chain is fixed by the source structure, so you can read a function's chain directly from the code.

```javascript
const appName = 'Shop';

function outer() {
  const user = 'Rin';

  function inner() {
    const item = 'lamp';
    console.log(`${appName}: ${user} bought a ${item}`);
  }

  return inner;
}

const later = outer(); // outer() has returned...
later();               // ...but inner still reaches user through its chain
```

```output
Shop: Rin bought a lamp
```

`inner`'s chain is: `inner`'s own scope (has `item`) → `outer`'s scope (has `user`) → global scope (has `appName`, `outer`, `later`). It does not matter that `inner` is called from the top level after `outer` has finished. The chain was determined when `inner` was created inside `outer`, and it still leads to that call's `user`. A function that keeps its chain alive like this is a **closure**; the mechanism is explained in the next section and taught fully in [[b1-closures]].

```mermaid title="The scope chain for inner(): searched from innermost outward"
flowchart LR
    I["inner scope: item"] -->|outer link| O["outer scope: user, inner"]
    O -->|outer link| G["global scope: appName, outer, later"]
    G -->|outer link| N(["null: not found, ReferenceError"])
```

### What sits at the end of the chain

The last link is the global scope, and it is special. It combines two stores: the **global object** (`window` in browsers, `globalThis` everywhere), which holds built-ins such as `Math` and `setTimeout` plus any top-level `var` and function declarations from classic scripts; and a separate store for top-level `let`, `const` and `class`. When you write `Math.max(…)` in a deeply nested function, the name `Math` is found by walking the whole chain to this last link. Inside an ES module, the module's own scope sits between your code and the global scope, so the chain is block → function → module → global.

### The scope chain is not the prototype chain

JavaScript has a second chain that beginners often confuse with this one. The **prototype chain** is how a *property* is found on an object: `user.toString()` looks for `toString` on `user`, then on `user`'s prototype, and so on (see [[b1-prototype-chain]]). The scope chain is how a bare *identifier* is found. They never substitute for each other:

```javascript
const settings = { debug: true };

function report() {
  console.log(settings.debug); // property lookup on an object we can name
  try {
    console.log(debug);        // identifier lookup: no scope declares `debug`
  } catch (e) {
    console.log(e.name + ': ' + e.message);
  }
}

report();
```

```output
true
ReferenceError: debug is not defined
```

`settings.debug` works because `settings` is found on the scope chain, and then `debug` is found as a property of that object. A bare `debug` is searched for on the scope chain only, and no scope declares it. Having a property called `debug` somewhere does not make it a variable.

> [!WARNING] Two exceptions that insert extra links
> The `with` statement (`with (obj) { … }`) temporarily puts an object onto the scope chain so its properties act like variables, and sloppy-mode direct `eval` can add new `var` declarations to a function's scope at runtime. Both make the chain impossible to determine from the source alone, which is why strict mode forbids `with` and gives `eval` its own scope. Details are in [[b1-name-resolution]].

### Why lookups are not slow

Walking a chain on every variable access sounds expensive. In practice engines resolve most identifiers when they parse the code: because the chain is lexical, V8 can work out ahead of time that `user` inside `inner` is "slot 2 of the context one level up" and generate code that goes straight there. The chain is the correct *model* of what happens; the engine's job is to produce the same answer faster. The few constructs that defeat this analysis — `with` and sloppy direct `eval` — force slower dynamic lookups, which is another reason to avoid them.

## Lexical environment {#b1-lexical-environment}

A **lexical environment** is the runtime object that represents one scope while code is executing. "Scope" is the human word for a region of code; the lexical environment is the engine's actual data structure for it. It has two parts:

1. An **environment record** — a table mapping each name declared in that scope to its binding (its storage slot and current value, plus whether it has been initialised and whether it can be reassigned).
2. An **outer reference** — a pointer to the environment of the enclosing scope.

Following the outer references from any environment gives you exactly the scope chain from the previous section. In recent editions of the ECMAScript specification the two parts are merged — every environment record simply carries an `[[OuterEnv]]` field — but the model is the same, and "lexical environment" remains the common name in books and interviews.

### When environments are created

Environments are created at run time, every time code enters a scope:

- **Running a script or module** creates the global environment (once per page or realm) or a module environment (once per module).
- **Calling a function** creates a new **function environment** for that call. It holds the parameters and local declarations, and also the function's `this` value, `new.target`, and what `super` refers to — that is why `this` belongs to the call, not to the source.
- **Entering a block** that declares `let`, `const`, `class` or (in strict code) a function creates a new **declarative environment** for the block. Each iteration of a `for (let …)` loop gets its own.

Because a new environment is created per call, two calls to the same function never share local variables:

```javascript
function makeCounter() {
  let n = 0;             // lives in this call's environment
  return () => ++n;      // the arrow keeps a pointer to that environment
}

const a = makeCounter();
const b = makeCounter();
a();
a();
console.log(a(), b());
```

```output
3 1
```

Each call to `makeCounter` created a fresh environment with its own `n`. The arrow function returned from the first call points to the first environment; the one returned from the second call points to the second. Three calls to `a` move its `n` to 3; one call to `b` moves its separate `n` to 1.

### How a function remembers where it was born

This is the mechanism behind lexical scope, and it fits in two sentences. When a function object is **created**, the engine stores a reference to the environment that was running at that moment — the specification calls this hidden field `[[Environment]]`. When the function is later **called**, the new function environment's outer reference is set to that stored environment, *not* to the caller's environment.

That is the entire reason JavaScript is lexically scoped. In the opening example, `show` was created at the top level, so its `[[Environment]]` is the global environment. When `caller` calls it, `show`'s new environment links outward to global, skipping `caller` completely.

```javascript
function demo(a) {
  let b = a + 1;
  return function inner() {
    return { a, b };
  };
}

const fn = demo(10);  // demo's environment would normally be discarded here
console.log(fn());
```

```output
{ a: 10, b: 11 }
```

When `demo(10)` runs, its environment holds `a = 10` and `b = 11`. Creating `inner` stores a reference to that environment. `demo` then returns, but the environment cannot be thrown away, because `fn` (which is `inner`) still points to it. When `fn()` runs, it follows that pointer and finds `a` and `b`. The output format `{ a: 10, b: 11 }` is how Node.js prints objects; browsers show the same object in their console.

> [!NOTE] Environments are not stack frames
> It is tempting to picture local variables living in the call stack and disappearing when a function returns. Conceptually, environments are heap objects that live as long as something refers to them. Engines do put variables that no inner function uses in fast stack slots or registers, but any variable an inner function captures is stored in a heap-allocated context object so it can outlive the call. This is why closures can keep large objects in memory: see [[b1-closure-memory]].

### LexicalEnvironment and VariableEnvironment

The specification tracks two environment pointers for the code currently running, and the distinction explains why `var` ignores blocks. The **VariableEnvironment** is where `var` declarations go; it is set when the function (or script) starts and does not change. The **LexicalEnvironment** is where `let`, `const` and `class` go; it starts out the same as the VariableEnvironment but is replaced by a new block environment every time execution enters a block that declares something, and restored when the block ends.

So inside `if (ok) { var a = 1; let b = 2; }`, the `let b` goes into the block's new environment, which is discarded at the closing brace, while `var a` goes into the VariableEnvironment, which still belongs to the whole function. The two pointers can also differ in a few edge cases, such as functions whose parameters have default values. This structure, as part of the full execution context, is covered in [[b1-execution-contexts]] and [[b1-variable-environment]].

| Environment record kind | Created for | Holds |
|---|---|---|
| Declarative | Blocks, `catch` clauses | `let`, `const`, `class`, block functions |
| Function (a declarative record) | Each function call | Parameters, locals, `this`, `new.target`, `super` target |
| Module (a declarative record) | Each module | Top-level declarations and import bindings |
| Object | `with` statements; part of global | Properties of an object, exposed as names |
| Global | The realm, once | Global object properties plus top-level `let`/`const`/`class` |

## Shadowing {#b1-shadowing}

**Shadowing** happens when a scope declares a name that an enclosing scope has already declared. Inside the inner scope, the name refers to the inner binding; the outer binding is hidden — "in its shadow" — until the inner scope ends. Nothing is overwritten. The outer variable keeps its value and becomes visible again as soon as execution leaves the inner scope. Shadowing is a direct consequence of the scope chain stopping at the first match.

```javascript
const value = 'outer';

function f(value) {               // the parameter shadows the outer const
  console.log('param', value);
  {
    const value = 'block';        // shadows the parameter inside this block
    console.log('block', value);
  }
  console.log('after', value);    // the parameter is visible again
}

f('arg');
console.log('global', value);     // the outer const was never touched
```

```output
param arg
block block
after arg
global outer
```

Every declaration form can shadow: parameters, `let`, `const`, `var`, function and class declarations, and the parameter of a `catch (e)` clause, which shadows any outer `e` inside the `catch` block.

### Why shadowing is allowed

Shadowing exists so that code can choose local names without knowing every name in every enclosing scope. A helper function can use `i`, `result` or `item` even if the file also has variables with those names. The policy is simple: the innermost declaration wins. Many style guides still discourage *accidental* shadowing (ESLint's `no-shadow` rule flags it), because a reader who sees `value` may assume it is the outer one.

### You cannot reach the shadowed variable

There is no syntax for "the `value` from one scope out". Once an inner scope declares the name, the outer binding is unreachable by that name from inside the inner scope. If you need both values, rename one of them. The only partial exception is the global object: if the shadowed binding is a global `var`, a global function or a built-in, it is also a property of `globalThis`, so `globalThis.name` still reaches it. Top-level `let` and `const` are not global-object properties, so they cannot be reached this way.

### Shadowing and the temporal dead zone

A `let`, `const` or `class` declaration shadows the outer name for the **whole block**, starting at the opening brace — not from the line where it is written. Between the start of the block and the declaration, the inner binding exists but cannot be read; this is the **temporal dead zone** (TDZ). The result is a confusing error when code at the top of a block expects to see the outer variable:

```javascript
const limit = 10;

function check(n) {
  if (n > 0) {
    try {
      console.log(n < limit);  // intends the outer limit...
    } catch (e) {
      console.log(e.name + ': ' + e.message);
    }
    const limit = 5;           // ...but this shadows it for the whole block
  }
}

check(3);
```

```output
ReferenceError: Cannot access 'limit' before initialization
```

The outer `limit` is hidden from the opening brace of the `if`, so `n < limit` hits the inner, uninitialised `limit`. The same trap catches code that tries to build an inner variable from an outer one with the same name: `let count = count + 1;` inside a block always throws, because the right-hand `count` already refers to the inner binding, which is still in its TDZ. Rename the inner variable (`const nextCount = count + 1`). The error message shown is V8's; other engines word it differently.

A related trap involves `typeof`. Normally `typeof someName` returns `'undefined'` for a name that is not declared anywhere, without throwing. But if a `let` or `const` of that name appears later in the *same* block, `typeof` sees the inner binding in its TDZ and throws a `ReferenceError`. The full rules are in [[b1-tdz]] and [[b1-let-const-hoisting]].

### Shadowing that JavaScript forbids

Shadowing means declaring a name in an *inner* scope. Declaring the same name twice in the *same* scope is a different thing — a redeclaration — and for `let`, `const` and `class` it is a `SyntaxError` reported before any code runs. Some combinations that look like shadowing are actually redeclarations:

| Code | Result | Why |
|---|---|---|
| `function f(a) { { let a = 1; } }` | Allowed | The block is a new scope: true shadowing |
| `function f(a) { let a = 1; }` | `SyntaxError` | The parameter and the top-level `let` are in the same scope |
| `function f(a) { var a = 1; }` | Allowed | `var` may repeat a parameter name; it is the same binding |
| `let x = 1; { var x = 2; }` | `SyntaxError` | `var` belongs to the outer scope, so it collides with `let x` |
| `try {} catch (e) { let e = 1; }` | `SyntaxError` | The `catch` parameter and the `let` share one scope |

The fourth row is the surprising one. `var x` sits inside a block, but `var` ignores blocks, so it is really declared in the same scope as `let x`. The redeclaration rules are covered in [[b1-redeclaration]].

### Shadowing built-in names

Shadowing a global built-in is legal and occasionally disastrous. A component that declares `const Map = …` (perhaps for a map widget) can no longer create `new Map()` anywhere in its scope. A function parameter called `document`, `Error`, `name` or `event` hides the global of the same name for the whole function. Choose names that do not collide with built-ins in the scopes where you might need the built-in.

> [!TIP] Rename when both values matter
> Shadowing is harmless when the inner value really replaces the outer one — for example, a short `.map((user) => …)` callback inside a function whose own `user` is not needed inside the callback. When the code needs both values, give them different names (`user` and `selectedUser`) so a reader never has to work out which one is meant.

## How it works internally

Putting the pieces together, here is what happens when the opening example runs:

1. The script starts. The engine creates the global environment and records `label`, `show` and `caller` in it. When it creates the function objects for `show` and `caller`, each stores the global environment in its `[[Environment]]` field.
2. `caller()` is called. A new function environment is created for the call; its outer reference is `caller.[[Environment]]`, the global environment. `const label = 'caller'` is stored in this new environment.
3. `show()` is called from inside `caller`. A new function environment is created for `show`; its outer reference is `show.[[Environment]]` — **the global environment**, not `caller`'s.
4. `console.log(label)` resolves `label`: not in `show`'s environment; follow the outer reference to global; found, value `'global'`.

```mermaid title="Environments while show() runs: the caller is not on show's chain"
flowchart TB
    G["global env: label = 'global', show, caller"]
    C["caller() env: label = 'caller'"]
    S["show() env: (empty)"]
    C -->|outer| G
    S -->|outer| G
```

`caller`'s environment exists while `show` runs — it is still on the call stack — but nothing links `show`'s environment to it. The **call stack** records who called whom so execution can return; the **scope chain** records where code was written so names can be found. They are separate structures (see [[b1-call-stack]]), and confusing them is the root of the dynamic-scope misconception.

## Worked example: an event handler that remembers its setup

Here is a realistic pattern from UI code. A setup function creates per-button state and returns a handler that a framework will call much later, from somewhere else entirely.

```javascript
const MAX_CLICKS = 3;

function makeClickHandler(buttonId) {
  let clicks = 0;

  return function onClick() {
    clicks += 1;
    if (clicks > MAX_CLICKS) {
      return `${buttonId}: ignored`;
    }
    return `${buttonId}: click ${clicks}`;
  };
}

const save = makeClickHandler('save');
const undo = makeClickHandler('undo');

// Later, some event system invokes the handlers:
for (const handler of [save, save, undo, save, save]) {
  console.log(handler());
}
```

```output
save: click 1
save: click 2
undo: click 1
save: click 3
save: ignored
```

Trace the names inside `onClick`. `clicks` and `buttonId` are not declared in `onClick`, so the engine follows its outer reference to the environment of the `makeClickHandler` call that created it. `save` and `undo` came from different calls, so they reach different environments with separate `clicks` counters and different `buttonId`s. `MAX_CLICKS` is not in either function's environment, so the lookup continues to the global environment. At no point does the `for` loop that invokes the handlers — the call site — affect what the names mean.

## In real systems

**Closures everywhere.** Event handlers, `setTimeout` callbacks, promise callbacks, array methods like `map` with an inline arrow function, and React hooks all rely on functions reaching variables from where they were written. Lexical scope is what makes `items.filter(item => item.price < maxPrice)` work: the arrow finds `maxPrice` in the enclosing function.

**Minifiers and bundlers.** Tools such as Terser and esbuild rename local variables to one-letter names to shrink code. This is only safe because lexical scope guarantees that no code outside a function can depend on its local names. They do not rename global names, and they become cautious inside any scope containing a direct `eval`, because `eval` can refer to names by string.

**Editors and type checkers.** "Go to definition", "rename symbol" and TypeScript's "Cannot find name" error all compute the scope chain from the source code. They can do this without running the program only because scope is lexical.

**React's stale closure bug.** Each render of a component is a new function call with a new environment. A callback created in one render keeps pointing at that render's variables, even after later renders have created newer ones — a direct consequence of `[[Environment]]` being fixed at creation. See [[b1-stale-closures]].

## Trade-offs and alternatives

Lexical scope's benefits are predictability, tooling and closures. Its costs are smaller but real. A closure keeps its entire chain of environments reachable, so a long-lived callback can keep large data alive longer than expected. Deeply nested functions can make it hard to see which outer variable a name refers to, especially with shadowing. And because scope cannot change at run time, passing context implicitly — the one thing dynamic scope was good at — requires explicit mechanisms instead: function parameters, `this`, or framework features such as React context.

The alternatives are not really alternatives within JavaScript; they are techniques layered on top of lexical scope. Passing values as parameters makes dependencies explicit. Module scope (see [[b1-module-scope]]) gives file-level privacy. Before modules, the IIFE pattern used a function scope for the same purpose.

## Common mistakes

> [!MISTAKE] Expecting a function to see its caller's variables
> A helper called from inside another function cannot read that function's locals. If `formatRow()` needs `currency`, pass it in as `formatRow(row, currency)`. Thinking otherwise is the dynamic-scope misconception, and interviewers test for it directly.

**Confusing `this` with scope.** Variables are lexical; `this` in a regular function depends on the call. Moving a method into a callback keeps its variables but can lose its `this`.

**Confusing the scope chain with the prototype chain.** `debug` and `config.debug` are found by different algorithms. A property on some object is never a variable unless you use `with`, which you should not.

**Accidental shadowing.** Declaring `const data` inside a block when an outer `data` is needed later in that block makes the outer one unreachable and can cause TDZ errors at the top of the block. Use distinct names, and enable `no-shadow` if your team prefers.

**Assuming a returned inner function loses its variables.** After `outer()` returns, its environment survives as long as an inner function refers to it. This is a feature, not a leak — unless the inner function is kept forever by accident.

## Interview perspective

Interviewers use lexical scope to check that you understand *why* closures work, not just that they do. The strongest answers mention both the rule and the mechanism.

> [!INTERVIEW] Explaining lexical scope in one breath
> "JavaScript resolves names by where code is written, not where it's called. Each function stores a reference to the environment it was created in; when called, its new environment links to that stored one, so lookup walks outward through the definition-time scopes. That's why closures keep access to outer variables after the outer function returns."

Questions to prepare:

- **What is lexical scope?** Visibility of names determined by source structure; inner scopes see outer ones, never the reverse.
- **Is JavaScript dynamically scoped?** No. Only `this` (for non-arrow functions) depends on the call site, and it is not a variable.
- **What is the scope chain, and how does it differ from the prototype chain?** The scope chain resolves identifiers through nested environments; the prototype chain resolves object properties through prototypes.
- **What is a lexical environment?** An environment record of bindings plus a reference to the outer environment; one is created per call, per block with lexical declarations, per module.
- **What does this print?** Expect a snippet where a function is called from inside another function that declares the same name. Answer from the definition site.
- **Follow-up: can you access a shadowed outer variable?** Not by name; only global-object properties can be reached through `globalThis`.

## Practice

1. **Draw the boxes.** Take the worked example above and draw nested boxes for each scope. Label each box with its declarations and draw arrows for the outer references.
2. **Predict the caller trap.** Write a function `log()` that prints `level`, call it from two functions that each declare their own `level`, and predict the output before running it.
3. **Separate environments.** Write `makeAccount(initial)` returning `{ deposit, balance }` functions sharing a private `amount`. Create two accounts and show their balances are independent.
4. **Find the TDZ.** Write a block that reads an outer variable and later declares a `let` with the same name. Explain the error, then fix it by renaming.
5. **Redeclaration table.** For each row in the forbidden-shadowing table, run the code and explain the result in your own words.

```quiz
Q: `const x = 1; function a() { console.log(x); } function b() { const x = 2; a(); } b();` — what is printed?
- [x] `1`
- [ ] `2`
- [ ] `undefined`
- [ ] It throws a ReferenceError
> `a` was created at the top level, so its outer environment is the global one. When `b` calls it, `a`'s new environment links to global, not to `b`'s environment, and finds `x = 1`. Printing 2 would be dynamic scope, which JavaScript does not use.

Q: Which statement about a function's outer environment is correct?
- [ ] It is set to the caller's environment each time the function is called
- [x] It is fixed when the function object is created, from the environment running at that moment
- [ ] It is always the global environment
- [ ] It is chosen by the value of `this`
> Function objects store their creation-time environment (the `[[Environment]]` field). Every call links its new environment to that stored one. That is the mechanism of lexical scope and the reason closures work.

Q: Inside a block, the first line reads `total` and a later line declares `let total = 0`. An outer `total` exists. What happens on the first line?
- [ ] It reads the outer `total`
- [ ] It reads `undefined`
- [x] It throws a ReferenceError
- [ ] It is a SyntaxError reported before the program runs
> The inner `let` shadows the outer `total` from the start of the block, but the inner binding is in its temporal dead zone until the declaration runs, so reading it throws. It is not a SyntaxError, because shadowing in an inner block is allowed.
```

## Quick revision {#quick-revision}

- Lexical (static) scope: names resolve by where code is written. Dynamic scope (by caller) is not used by JavaScript.
- Only `this` in regular functions depends on the call site; arrow functions take `this` lexically.
- Scope chain = current scope → enclosing scopes → module (if any) → global; first match wins; no match → `ReferenceError` on read.
- Scope chain (identifiers) ≠ prototype chain (object properties) ≠ call stack (who called whom).
- Lexical environment = environment record (bindings) + outer reference.
- New environment per script/module, per function call, per block with lexical declarations, per `for (let …)` iteration.
- A function stores its creation environment (`[[Environment]]`); each call's environment links outward to it → closures.
- `var` goes to the VariableEnvironment (whole function); `let`/`const`/`class` go to the current LexicalEnvironment (block).
- Shadowing: inner declaration hides an outer one of the same name for the whole inner scope; the outer is untouched.
- `let`/`const` shadow from the block's first line, so early reads hit the TDZ.
- Same-scope redeclaration with `let`/`const`/`class` is a `SyntaxError`; `var` inside a block can collide with an outer `let`.
- `with` and sloppy direct `eval` alter the chain at run time; strict mode prevents both.

## Key takeaways {#key-takeaways}

- JavaScript decides what a name means from where the code is written, so you can reason about a function by reading its surroundings.
- At run time, each scope is an environment holding bindings and a link to its enclosing environment; following the links is the scope chain.
- A function remembers the environment it was created in, and every call links to it. That single rule produces closures.
- The innermost declaration of a name shadows outer ones; the outer variable is hidden, not changed, and cannot be reached by name.
- `let` and `const` shadow from the start of their block, which is the source of many temporal dead zone errors.
- The scope chain, the prototype chain and the call stack are three different structures; keeping them apart prevents most scope misconceptions.
